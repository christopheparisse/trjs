/**
 * reading praat files
 * file taken from ELAN open sources
 * adaptation by Christophe Parisse
 */

/**
 * A class to extract annotations from a Praat .TextGrid file.
 * Only "IntervalTier"s and "TextTier"s are supported.
 * The expected format is roughly like below, but the format is only loosely checked.
 * 
 * 1 File type = "ooTextFile"
 * 2 Object class = "TextGrid"
 * 3 
 * 4 xmin = 0 
 * 5 xmax = 36.59755102040816 
 * 6 tiers? &lt;exists&; 
 * 7 size = 2 
 * 8 item []: 
 * 9     item [1]:
 * 10         class = "IntervalTier" 
 * 11         name = "One" 
 * 12         xmin = 0 
 * 13         xmax = 36.59755102040816 
 * 14         intervals: size = 5 
 * 15         intervals [1]:
 * 16             xmin = 0 
 * 17             xmax = 1 
 * 18             text = "" 
 * 
 * @version Feb 2013 the short notation format (roughly the same lines without the keys and the indentation)
 * is now also supported
 */
var praatTextGrid = ( function() {
	var brack = '[';
	var eq = "=";
	var item = "item";
	var cl = "class";
	var tierSpec = "IntervalTier";
	var textTierSpec = "TextTier";
	var nm = "name";
	var interval = "intervals";
	var min = "xmin";
	var max = "xmax";
	var tx = "text";
	var points = "points";
	var time = "time";
	var mark = "mark";
	var number = "number";
	var escapedInnerQuote = "\"\"";
	var escapedOuterQuote = "\"\"\"";

	var includeTextTiers = false;
	var pointDuration = 1;
	var encoding;

	var gridFile;
	var tierNames = {}; // Map<String, String>
	var annotationMap = {}; // Map<String, ArrayList<Annot>>
	var lookUp; // PraatSpecialChars

	var SN_POSITION = { // short notation line position
	   OUTSIDE: 1, // not in any type of tier
	   NEXT_IS_NAME: 2, // next line is a tier name
	   NEXT_IS_MIN: 3, // next line is the min time of interval
	   NEXT_IS_MAX: 4, // next line is the max time of interval
	   NEXT_IS_TEXT: 5, // next line is the text of an interval
	   NEXT_IS_TIME: 6, // next line is the time of a point annotation
	   NEXT_IS_MARK: 7, // next line is the text of a point annotation
	   NEXT_IS_TOTAL_MIN: 8, // next line is the overall min of a tier, ignored
	   NEXT_IS_TOTAL_MAX: 9, // next line is the overall max of a tier, ignored
	   NEXT_IS_SIZE: 10 // next line is the number of annotations of a tier, ignore
    };

	/**
	 * Creates a new Praat TextGrid parser for the file at the specified path. 
	 *
	 * @param fileName the path to the file
	 * @param includeTextTiers if true "TextTiers" will also be parsed
	 * @param pointDuration the duration of annotations if texttiers are also parsed  
	 * @param encoding the character encoding of the file
	 *
	 * @throws IOException if the file can not be read, for whatever reason
	 */
	function PraatTextGridFile(fileName, p_includeTextTiers, p_pointDuration, p_encoding) {
		if (fileName) {
			gridFile = fs.readFileSync(fileName);
		}
		if (p_includeTextTiers) includeTextTiers = p_includeTextTiers;
		if (p_pointDuration) pointDuration = p_pointDuration;
		if (p_encoding) encoding = p_encoding;

		parse();
	}

	/**
	 * Creates a new Praat TextGrid parser for the specified file.
	 *
	 * @param gridFile the TextGrid file
	 * @param includeTextTiers if true "TextTiers" will also be parsed
	 * @param pointDuration the duration of annotations if texttiers are also parsed  
	 * @param encoding the character encoding of the file
	 * 
	 * @throws IOException if the file can not be read, for whatever reason
	 */
	function PraatTextGridObject(gridFile, p_includeTextTiers, p_pointDuration, p_encoding) {
		gridFile = gridFile;

		if (p_includeTextTiers) includeTextTiers = p_includeTextTiers;
		if (p_pointDuration) pointDuration = p_pointDuration;
		if (p_encoding) encoding = p_encoding;

		parse();
	}

	/**
	 * Returns a list of detected interval tiers.
	 *
	 * @return a list of detected interval tiernames
	 */
	function getTierNames() {
		return tierNames;
	}

	/**
	 * Returns a list of annotation records for the specified tier.
	 *
	 * @param tierName the name of the tier
	 *
	 * @return the annotation records of the specified tier
	 */
	function getAnnotationRecords(tierName) {
		if ((tierName == null) || (annotationMap == null)) {
			return null;
		}

		var value = annotationMap[tierName];

		if (value === undefined) {
    		return null;
		}

		return value;
	}

	/**
	 * Reads a few lines and returns whether the file is in short notation.
	 * 
	 * @param reader the reader object
	 * @return true if in short text notation, false otherwise
	 */
	function isShortNotation(BufferedReader reader) throws IOException {
		if (reader == null) {
			return false;
		}

		String line;
		int lineCount = 0;

		boolean xmin = false, xmax = false, tiers = false;// are the keys xmin and xmax and tiers? found

		while ((line = reader.readLine()) != null && lineCount < 5) {
			if (line.length() == 0) {
				continue;// skip empty lines
			}

			if (lineCount == 2) {
				xmin = (line.indexOf(min) > -1);
			}
			if (lineCount == 3) {
				xmax = (line.indexOf(max) > -1);
			}
			if (lineCount == 4) {
				tiers = (line.indexOf("tiers?") > -1);
			}
			lineCount++;   		
		}

		return (!xmin && !xmax && !tiers);
	}

	/**
	 * Parses the file and extracts interval tiers with their annotations.
	 *
	 * @throws IOException if the file can not be read for any reason
	 */
	private void parse() throws IOException {
		if ((gridFile == null) || !gridFile.exists()) {
			System.err.println("No existing file specified.");
			throw new IOException("No existing file specified.");
		}

		BufferedReader reader = null;

		try {
			if (encoding == null) {      	
				reader = new BufferedReader(new InputStreamReader(
						new FileInputStream(gridFile)));
			} else {
				try {
					reader = new BufferedReader(new InputStreamReader(
							new FileInputStream(gridFile), encoding));
				} catch (UnsupportedEncodingException uee) {
					System.err.println("Unsupported encoding: " + uee.getMessage());
					reader = new BufferedReader(new InputStreamReader(
							new FileInputStream(gridFile)));
				}
			}
			// Praat files on Windows and Linux are created with encoding "Cp1252"
			// on Mac with encoding "MacRoman". The ui could/should be extended
			// with an option to specify the encoding
			// InputStreamReader isr = new InputStreamReader(
			//        new FileInputStream(gridFile));
			// System.out.println("Encoding: " + isr.getEncoding());
			// System.out.println("Read encoding: " + encoding);
			System.out.println("Read encoding: " + encoding);

			boolean isShortNotation = isShortNotation(reader);
			System.out.println("Praat TextGrid is in short notation: " + isShortNotation);

			if (isShortNotation) {
				parseShortNotation(reader);
				return;
			}

			tierNames = new HashMap<String, String>(4);
			annotationMap = new HashMap<String, ArrayList<Annot>>(4);

			ArrayList<Annot> records = new ArrayList<Annot>();
			Annot record = null;

			String line;
			//int lineNum = 0;
			String tierName = null;
			String annValue = "";
			String begin = "-1";
			String end = "-1";
			boolean inTier = false;
			boolean inInterval = false;
			boolean inTextTier = false;
			boolean inPoints = false;
			int eqPos = -1;

			while ((line = reader.readLine()) != null) {
				//lineNum++;
				//System.out.println(lineNum + " " + line);

				if ((line.indexOf(cl) >= 0) && 
						((line.indexOf(tierSpec) > 5) || (line.indexOf(textTierSpec) > 5))) {
					// check if we have to include text (point) tiers
					if (line.indexOf(textTierSpec) > 5) {
						if (includeTextTiers) {
							inTextTier = true;
						} else {
							inTextTier = false;
							inTier = false;
							continue;
						}
					}
					// begin of a new tier
					records = new ArrayList<Annot>();
					inTier = true;

					continue;
				}

				if (!inTier) {
					continue;
				}

				eqPos = line.indexOf(eq);

				if (inTextTier) {
					// text or point tier
					if (eqPos > 0) {
						// split and parse
						if (!inPoints && (line.indexOf(nm) >= 0) &&
								(line.indexOf(nm) < eqPos)) {
							tierName = extractTierName(line, eqPos);

							if (!annotationMap.containsKey(tierName)) {
								annotationMap.put(tierName, records);
								tierNames.put(tierName, "TextTier");
								System.out.println("Point Tier detected: " + tierName);
							} else {
								// the same (sometimes empty) tiername can occur more than once, rename
								int count = 2;
								String nextName = "";
								for (; count < 50; count++) {
									nextName = tierName + "-" + count;
									if (!annotationMap.containsKey(nextName)) {
										annotationMap.put(nextName, records);
										tierNames.put(nextName, "TextTier");
										System.out.println("Point Tier detected: " + tierName + " and renamed to: " + nextName);
										break;
									}
								}
							}

							continue;
						} else if (!inPoints) {
							continue;
						} else if (line.indexOf(time) > -1 || line.indexOf(number) > -1) {
							begin = extractTime(line, eqPos);
							//System.out.println("B: " + begin);
						} else if (line.indexOf(mark) > -1) {
							// extract value
							annValue = extractTextValue(line, eqPos);
							// finish and add the annotation record
							inPoints = false;
							//System.out.println("T: " + annValue);
							record = new Annot(tierName, annValue,
									begin, "-1" /* begin + pointDuration */);
							records.add(record);
							// reset
							annValue = "";
							begin = "-1";
						}
					} else {
						// points??
						if ((line.indexOf(points) >= 0) &&
								(line.indexOf(brack) > points.length())) {
							inPoints = true;

							continue;
						} else {
							if ((line.indexOf(item) >= 0) &&
									(line.indexOf(brack) > item.length())) {
								// reset
								inTextTier = false;
								inPoints = false;
							}
						}
					} // end point tier
				} else {
					// interval tier
					if (eqPos > 0) {
						// split and parse
						if (!inInterval && (line.indexOf(nm) >= 0) &&
								(line.indexOf(nm) < eqPos)) {
							tierName = extractTierName(line, eqPos);

							if (!annotationMap.containsKey(tierName)) {
								annotationMap.put(tierName, records);
								tierNames.put(tierName, "IntervalTier");
								System.out.println("Tier detected: " + tierName);
							} else {
								// the same (sometimes empty) tiername can occur more than once, rename
								int count = 2;
								String nextName = "";
								for (; count < 50; count++) {
									nextName = tierName + "-" + count;
									if (!annotationMap.containsKey(nextName)) {
										annotationMap.put(nextName, records);
										tierNames.put(nextName, "IntervalTier");
										System.out.println("Tier detected: " + tierName + " and renamed to: " + nextName);
										break;
									}
								}
							}	
							continue;
						} else if (!inInterval) {
							continue;
						} else if (line.indexOf(min) > -1) {
							begin = extractTime(line, eqPos);
							//System.out.println("B: " + begin);
						} else if (line.indexOf(max) > -1) {
							end = extractTime(line, eqPos);
							//System.out.println("E: " + end);
						} else if (line.indexOf(tx) > -1) {
							// extract value
							annValue = extractTextValue(line, eqPos);
							// finish and add the annotation record
							inInterval = false;
							//System.out.println("T: " + annValue);
							record = new Annot(tierName, annValue,
									begin, end);
							records.add(record);
							// reset
							annValue = "";
							begin = "-1";
							end = "-1";
						}
					} else {
						// interval?
						if ((line.indexOf(interval) >= 0) &&
								(line.indexOf(brack) > interval.length())) {
							inInterval = true;

							continue;
						} else {
							if ((line.indexOf(item) >= 0) &&
									(line.indexOf(brack) > item.length())) {
								// reset
								inTier = false;
								inInterval = false;
							}
						}
					}
				}
			}

			reader.close();
		} catch (IOException ioe) {
			if (reader != null) {
				reader.close();
			}

			throw ioe;
		} catch (Exception fe) {
			if (reader != null) {
				reader.close();
			}

			throw new IOException("Error occurred while reading the file: " +
					fe.getMessage());
		}
	}

	/**
	 * Parses the short notation of a Praat TextGrid file. 
	 * Handling completely separated from the long notation.
	 * 
	 * @param reader the (configured) reader
	 */
	private void parseShortNotation(BufferedReader reader) throws IOException {
		if (reader == null) {
			throw new IOException("The reader object is null, cannot read from the file.");
		}

		tierNames = new HashMap<String, String>(4);
		annotationMap = new HashMap<String, ArrayList<Annot>>(4);

		ArrayList<Annot> records = new ArrayList<Annot>();
		Annot record = null;

		String line;
		String tierName = null;
		String annValue = "";
		String begin = "-1";
		String end = "-1";

		boolean inTextTier = false;// in text tier
		boolean inTier = false;// in interval tier
		int eqPos = -1;

		SN_POSITION linePos = SN_POSITION.OUTSIDE;

		while ((line = reader.readLine()) != null) {
			if (line.length() == 0) {
				continue;
			}

			if (line.indexOf(tierSpec) > -1) {
				linePos = SN_POSITION.NEXT_IS_NAME;
				inTier = true;
				inTextTier = false;
				continue;
			}
			if (line.indexOf(textTierSpec) > -1) {
				linePos = SN_POSITION.NEXT_IS_NAME;
				inTier = false;
				inTextTier = true;
				continue;
			}

			if (linePos == SN_POSITION.NEXT_IS_NAME) {// tier name on this line
				if (!inTier && !inTextTier) {
					linePos = SN_POSITION.NEXT_IS_TOTAL_MIN;
					continue;
				}

				if (inTier || (inTextTier && includeTextTiers)) {
					tierName = removeQuotes(line);
					if (tierName.length() == 0) {
						tierName = "Noname";
					}

					records = new ArrayList<Annot>();	

					if (!annotationMap.containsKey(tierName)) {
						annotationMap.put(tierName, records);
						if (inTextTier) {
							tierNames.put(tierName, "TextTier");
							System.out.println("Point Tier detected: " + tierName);
						} else {
							tierNames.put(tierName, "IntervalTier");
							System.out.println("Interval Tier detected: " + tierName);
						}
					} else {
						// the same (sometimes empty) tiername can occur more than once, rename
						int count = 2;
						String nextName = "";
						for (; count < 50; count++) {
							nextName = tierName + "-" + count;
							if (!annotationMap.containsKey(nextName)) {
								annotationMap.put(nextName, records);
								if (inTextTier) {
									tierNames.put(nextName, "TextTier");
									System.out.println("Point Tier detected: " + tierName + " and renamed to: " + nextName);
								} else {
									tierNames.put(nextName, "IntervalTier");
									System.out.println("Interval Tier detected: " + tierName + " and renamed to: " + nextName);
								}
								break;
							}
						}
					}
				}

				linePos = SN_POSITION.NEXT_IS_TOTAL_MIN;
				continue;
			}

			if (linePos == SN_POSITION.NEXT_IS_TOTAL_MIN) {
				linePos = SN_POSITION.NEXT_IS_TOTAL_MAX;
				continue;
			}

			if (linePos == SN_POSITION.NEXT_IS_TOTAL_MAX) {
				linePos = SN_POSITION.NEXT_IS_SIZE;
				continue;
			}

			if (linePos == SN_POSITION.NEXT_IS_SIZE) {
				if (inTextTier) {
					linePos = SN_POSITION.NEXT_IS_TIME;
				} else {// interval tier
					linePos = SN_POSITION.NEXT_IS_MIN;
				}
				continue;
			}
			// point text tiers
			if (linePos == SN_POSITION.NEXT_IS_TIME) {
				if (includeTextTiers) {
					// hier extract time
					begin = extractTime(line, eqPos);// eqPos = -1
				}
				linePos = SN_POSITION.NEXT_IS_MARK;
				continue;
			}

			if (linePos == SN_POSITION.NEXT_IS_MARK) {
				if (includeTextTiers) {
					annValue = extractTextValue(line, eqPos);// eqPos = -1
					// finish and add the annotation record
					record = new Annot(tierName, annValue,
							begin, "-1" /* begin + pointDuration */);
					records.add(record);
					// reset
					annValue = "";
					begin = "-1";
				}
				linePos = SN_POSITION.NEXT_IS_TIME;
				continue;
			}
			// interval tiers
			if (linePos == SN_POSITION.NEXT_IS_MIN) {
				begin = extractTime(line, eqPos);// eqPos = -1
				linePos = SN_POSITION.NEXT_IS_MAX;
				continue;
			}

			if (linePos == SN_POSITION.NEXT_IS_MAX) {
				end = extractTime(line, eqPos);// eqPos = -1
				linePos = SN_POSITION.NEXT_IS_TEXT;
				continue;
			}

			if (linePos == SN_POSITION.NEXT_IS_TEXT) {
				// extract value
				annValue = extractTextValue(line, eqPos);// eqPos = -1
				// finish and add the annotation record
				record = new Annot(tierName, annValue,
						begin, end);
				records.add(record);
				// reset
				annValue = "";
				begin = "-1";
				end = "-1";

				linePos = SN_POSITION.NEXT_IS_MIN;
				continue;
			}
		}
	}

	/**
	 * Extracts the tiername from a line.
	 *
	 * @param line the line
	 * @param eqPos the indexof the '=' sign
	 *
	 * @return the tier name
	 */
	private String extractTierName(String line, int eqPos) {
		if (line.length() > (eqPos + 1)) {
			String name = line.substring(eqPos + 1).trim();

			if (name.length() < 3) {
				if ("\"\"".equals(name)) {
					return "Noname";
				}

				return name;
			}

			return removeQuotes(name);
		}

		return line; // or null??
	}

	/**
	 * Extracts the text value and, if needed, converts Praat's special
	 * character sequences into unicode chars.
	 *
	 * @param value the text value
	 * @param eqPos the index of the equals sign
	 *
	 * @return the annotation value. If necessary Praat's special symbols have
	 *         been converted  to Unicode.
	 */
	private String extractTextValue(String value, int eqPos) {
		if (value.length() > (eqPos + 1)) {
			String rawV = removeQuotes(value.substring(eqPos + 1).trim()); // should be save

			if (lookUp == null) {
				lookUp = new PraatSpecialChars();
			}
			rawV = lookUp.replaceIllegalXMLChars(rawV);

			if (rawV.indexOf('\\') > -1) {
				// convert
				//                if (lookUp == null) {
				//                    lookUp = new PraatSpecialChars();
				//                }

				return lookUp.convertSpecialChars(rawV);
			}

			return rawV;
		}

		return "";
	}

	/**
	 * Extracts a double time value, multiplies by 1000 (sec to ms) and
	 * converts to Time (string).
	 *
	 * @param value the raw value
	 * @param eqPos the index of the equals sign
	 *
	 * @return the time value rounded to milliseconds
	 */
	private String extractTime(String value, int eqPos) {
		if (value.length() > (eqPos + 1)) {
			String v = value.substring(eqPos + 1).trim();
			return v;
		}

		return "-1";
	}

	/**
	 * Removes a beginning and end quote mark from the specified string. Does
	 * no null check nor are spaces trimmed.
	 * 
	 * @version Feb 2013 added handling for outer escaped quotes (""") and inner escaped quotes ("")
	 *
	 * @param value the value of which leading and trailing quote chars should
	 *        be removed
	 *
	 * @return the value without the quotes
	 */
	private String removeQuotes(String value) {
		boolean removeOuterQuotes = true;
		if (value.startsWith(escapedOuterQuote) && value.endsWith(escapedOuterQuote)) {
			removeOuterQuotes = false;
		}
		// replace all """ sequences by a single "
		value = value.replaceAll(escapedOuterQuote, "\"");
		value = value.replaceAll(escapedInnerQuote, "\"");

		if (removeOuterQuotes) {
			if (value.charAt(0) == '"') {
				if (value.charAt(value.length() - 1) == '"' && value.length() > 1) {
					return value.substring(1, value.length() - 1);
				} else {
					return value.substring(1);
				}
			} else {
				if (value.charAt(value.length() - 1) == '"') {
					return value.substring(0, value.length() - 1);
				} else {
					return value;
				}
			}
		} else {
			return value;
		}
	}

	public static void main(String[] args) {
		for (int i=0; i<args.length; i++) {
			try {
				PraatTextGrid ptg = new PraatTextGrid(args[i], true, 100, "ISO-8859-1");
				System.out.println("Fichier " + args[i]);
				System.out.println("TIERS");
				for (Map.Entry<String, String> element : ptg.tierNames.entrySet()) {
					System.out.println("TIER: " + element.getKey() + " " + element.getValue());
				}
				System.out.println("ANNOTATIONS");
				for (Map.Entry<String, ArrayList<Annot>> element : ptg.annotationMap.entrySet()) {
					System.out.println(element.getKey() + " :- ");
					ArrayList<Annot> l = element.getValue();
					for (int j=0; j<l.size(); j++) {
						System.out.println("    " + j + " :- " + l.get(j));
					}
				}
				/*
				 * construire un hierarchic trans
				 */
				HierarchicTrans ht = new HierarchicTrans();
				/*
				 * construire tiers info
				 */
				for (Map.Entry<String, String> element : ptg.tierNames.entrySet()) {
					TierInfo value = new TierInfo();					
					value.participant = element.getKey();
					value.type.constraint = LgqType.ROOT;
					value.type.time_align = true;
					// si element.getValue() == TextTier alors des points sinon des intervalles
					ht.tiersInfo.put(element.getKey(), value);
				}
				/*
				 * construire timeline
				 */
				int praatid = 0;
				for (Map.Entry<String, ArrayList<Annot>> element : ptg.annotationMap.entrySet()) {
					// System.out.println(element.getKey() + " :- ");
					ArrayList<Annot> l = element.getValue();
					for (int j=0; j<l.size(); j++) {
						// System.out.println("    " + j + " :- " + l.get(j));
						Annot a = l.get(j);
						praatid++;
						String id = "b" + praatid;
						ht.timeline.put(id, a.start);
						ht.times.add(a.start);
						a.start = "#" + id;
						praatid++;
						id = "e" + praatid;
						ht.timeline.put(id, a.end);
						ht.times.add(a.end);
						a.end = "#" + id;
					}
				}

				ht.partionRepresentationToHierachic(ptg.annotationMap);
				HT_ToTei hiertransToTei = new HT_ToTei(ht);
				Utils.createFile("aa" + Utils.EXT, hiertransToTei.docTEI);

			} catch (IOException ioe) {
				System.err.println("Interrompu!"); // ioe.toString());
			}
			System.out.println("-------------------------------------------------------");
		}
	}
    
return {
    x: x,
};
})();

