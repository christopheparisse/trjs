package fr.ortolang.tools.imports;
/**
 * @author Christophe Parisse
 * charge un fichier CHAT
 * fonctions utilitaires pour accéder aux données
 *
 * usage principal: initialise une structure de données qui permet de balayer et tester toutes les lignes de CHAT
 * les informations de métadonnées (champs Participants et ID sont analysées et extraites séparement
 * des variables spécifiques sont crées pour contenir ces données (voir ID et chatFilename, mediaFilename,
 * mediaType, birth, date, location, transcriber)
 * nbMainLines() : nombre de lignes principales
 * ml(i) accès à la ligne principale de numéro 'i' (toutes les lignes y compris les \@)
 * mlc(i) accès à la ligne principale nettoyée de numéro 'i' (toutes les lignes y compris les \@)
 * startMl(i) : timecode de début de la ligne 'i'
 * endMl(i) : timecode de fin de la ligne 'i'
 * nbTiers(i) : nombre de tiers de la ligne 'i'
 * t(i,j) : tiers 'j' de la ligne 'i'
 */

import java.util.*;
import java.util.regex.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class ChatFile {
	/** All input will use this encoding */
	final static String inputEncoding = "UTF-8";
	boolean wellFormed = true;

	public static String loc(String ln) {
		int n = ln.indexOf(':');
		if (n == -1) return ln;
		return ln.substring(1,n);
	}

	public static String ctn(String ln) {
		int n = ln.indexOf(':');
		if (n == -1) return ln;
		return ln.substring(n+1,ln.length()).trim();
	}

	public class ID {
		String code;
		String name;
		String role;
		// dans l'@ID
		String language;
		String corpus;
		//code;
		String age;
		String sex;
		String group;
		String SES;
		// role;
		String education;
		String customfield;
	}

	String chatFilename;
	String mediaFilename;
	String mediaType;
	String birth;
	String date;
	String location;
	String transcriber;
	String situation;
	String lang;
	String timeDuration;
	String timeStart;
	ArrayList<String> comments = new ArrayList<String>();
	ArrayList<String> gemes = new ArrayList<String>();
	ArrayList<String> otherInfo = new ArrayList<String>();
	ArrayList<ID> ids= new ArrayList<ID>();
	boolean inMainLine = false;

	public String join(String[] s, String delimiter) {
		StringBuffer buffer = new StringBuffer();
		int i = 0;
		while (i < s.length-1) {
			buffer.append(s[i]);
			buffer.append(delimiter);
			i++;
		}
		buffer.append(s[i]);
		return buffer.toString();
	}

	void findInfo(boolean verbose) {
		// find all types of information and preprocess it.
		int sz = nbMainLines();
		boolean inHeader = true;
		Pattern pattern = Pattern.compile("[%*@](\\w+)[\\s:]?.*");
		Set<String> idsMap= new HashSet<String>();;
		for (int i=0; i<sz; i++) {
			if (ml(i).startsWith("*")) {
				inHeader = false;
				Matcher matcher = pattern.matcher(ml(i));
				if (matcher.matches()) {
					if (!idsMap.contains(matcher.group(1))) {
						idsMap.add(matcher.group(1));
						ID nid = new ID();
						nid.code = matcher.group(1);
						if (nid.code == "UNK")
							nid.role = "Unknown";
						ids.add(nid);
					}
				}
			}
			if ( ml(i).toLowerCase().startsWith("@participants") ) {
				String[] rls = ml(i).split("[:,]");
				for (String part: rls) {
					String[] wds = part.split("\\s+");
					if (wds.length == 3) {
						ID nid = new ID();
						nid.code = wds[1];
						nid.role = wds[2];
						ids.add(nid);
						idsMap.add(wds[1]);
					} else if (wds.length == 4) {
						ID nid = new ID();
						nid.code = wds[1];
						nid.name = wds[2];
						nid.role = wds[3];
						ids.add(nid);
						idsMap.add(wds[1]);
					}
				}
			} else if ( ml(i).toLowerCase().startsWith("@media") ) {
				String[] wds = ml(i).split("[\\s,]+");
				if (wds.length == 3) {
					mediaFilename = wds[1];
					mediaType =  wds[2];
				}
			} else if ( ml(i).toLowerCase().startsWith("@id") ) {
				String[] wds = ml(i).split("\\|");
				if (wds.length < 3) {
					System.err.println("erreur sur les IDs à " + ml(i));
					continue;
				}
				boolean found = false;
				for (ID id: ids) {
					if ( id.code.equals(wds[2]) ) {
						found = true;
						// dans l'@ID
						if (wds.length > 0) {
							String[] details = wds[0].split("(?i)@ID:\\s+");
							if(details.length >= 2){
								id.language = details[1];
							}
						}
						if (wds.length > 1) id.corpus = wds[1];
						//code;
						if (wds.length > 3) id.age = wds[3];
						if (wds.length > 4) id.sex = wds[4];
						if (wds.length > 5) id.group = wds[5];
						if (wds.length > 6) id.SES = wds[6];
						// role;
						if (wds.length > 8) id.education = wds[8];
						if (wds.length > 9) id.customfield = wds[9];
					}
				}
				if (found == false) {
					// System.err.println("erreur sur ID " + ml(i) + "pas trouvé dans les participants - ajourt direct");
					ID nid = new ID();
					// dans l'@ID
					if (wds.length > 0) {
						String[] details = wds[0].split("(?i)@ID:\\s+");
						if(details.length >= 2){
							nid.language = details[1];
						}
					}
					if (wds.length > 1) nid.corpus = wds[1];
					if (wds.length > 2) nid.code = wds[2];
					if (wds.length > 3) nid.age = wds[3];
					if (wds.length > 4) nid.sex = wds[4];
					if (wds.length > 5) nid.group = wds[5];
					if (wds.length > 6) nid.SES = wds[6];
					if (wds.length > 7) nid.role = wds[7];
					if (wds.length > 8) nid.education = wds[8];
					if (wds.length > 9) nid.customfield = wds[9];
					ids.add(nid);
					idsMap.add(wds[2]);
				}
			} else if ( ml(i).toLowerCase().startsWith("@location") ) {
				location = ml(i);
			} else if ( ml(i).toLowerCase().startsWith("@date") ) {
				date = ml(i);
			} else if ( ml(i).toLowerCase().startsWith("@birth") ) {
				if ( ml(i).indexOf("of CHI") != -1 )
					birth = ml(i);
			} else if ( ml(i).toLowerCase().startsWith("@comment") ) {
				if ( ml(i).indexOf("coder") != -1 ||  ml(i).indexOf("Coder") != -1)
					transcriber = ml(i);
				else{
					comments.add(ml(i));
				}
			} else if ( ml(i).toLowerCase().startsWith("@transcriber") ) {
				transcriber = ml(i);
			}
			else if ( ml(i).toLowerCase().startsWith("@situation") && inHeader) {
				situation = ml(i);
			}
			else if ( ml(i).toLowerCase().startsWith("@time Duration") ) {
				timeDuration = ml(i);
			}
			else if ( ml(i).toLowerCase().startsWith("@g") || ml(i).toLowerCase().startsWith("@bg") || ml(i).toLowerCase().startsWith("@eg")  || ml(i).toLowerCase().startsWith("@situation")) {
				gemes.add(ml(i));
			}
			else if ( ml(i).toLowerCase().startsWith("@languages") ) {
				lang = ml(i);
			}
			else if ( ml(i).toLowerCase().startsWith("@time start") ) {
				try{
					timeStart = ml(i).split("\t")[1];
				}
				catch(Exception e){
					if(!ml(i).split("\t|\\s")[1].contains(":")){
						timeStart = ml(i).split("\t|\\s")[1];
					}
				}
			}
			else if(ml(i).startsWith("@") && ml(i).split("\t").length>1 && inHeader ){
				otherInfo.add(ml(i));
			}
		}

		if(!verbose) return;
		System.out.println("chat_filename : " + chatFilename );
		System.out.println("media_filename : " + mediaFilename );
		System.out.println("media_type : " + mediaType );
		System.out.println("birth : " + birth );
		System.out.println("date : " + date );
		System.out.println("location : " + location );
		System.out.println("situation : "  + situation );
		System.out.println("transcriber : " + transcriber );
		System.out.println("language : " + lang );

		for (String com:comments){
			System.out.println("com :  " + com);
		}

		for (String info:otherInfo){
			System.out.println("info :  " + info);
		}

		for (ID id: ids) {
			System.out.println("NAME : " + id.name );
			System.out.println("ID-language : " + id.language );
			System.out.println("ID-corpus : " + id.corpus );
			System.out.println("ID-code : " + id.code );
			System.out.println("ID-age : " + id.age );
			System.out.println("ID-sex : " + id.sex );
			System.out.println("ID-group : " + id.group );
			System.out.println("ID-SES : " + id.SES );
			System.out.println("ID-role : " + id.role );
			System.out.println("ID-education : " + id.education );
			System.out.println("ID-customfield : " + id.customfield );
		}
	}

	String ageChild() {
		if (ids==null) return "";
		return age("CHI");
	}

	String age(String part) {
		if (ids==null) return "";
		for (ID id: ids)
			if ( id.code.equals(part) ) return id.age;
		return "";
	}

	int ageJour(String part) {
		if (ids==null) return -1;
		for (ID id: ids)
			if ( id.code.equals(part) ) {
				int jours = 0;
				String patternStr = "(\\d+);(\\d+).(\\d+)";
				Pattern pattern = Pattern.compile(patternStr);
				Matcher matcher = pattern.matcher(id.age);
				if (matcher.find()) {
					jours = Integer.parseInt(matcher.group(1)) * 365;
					jours += Integer.parseInt(matcher.group(2)) * 30;
					jours += Integer.parseInt(matcher.group(3));
					return jours;
				}
				patternStr = "(\\d+);(\\d+).";
				pattern = Pattern.compile(patternStr);
				matcher = pattern.matcher(id.age);
				if (matcher.find()) {
					jours = Integer.parseInt(matcher.group(1)) * 365;
					jours += Integer.parseInt(matcher.group(2)) * 30;
					return jours;
				}
				patternStr = "(\\d+);(\\d+)";
				pattern = Pattern.compile(patternStr);
				matcher = pattern.matcher(id.age);
				if (matcher.find()) {
					jours = Integer.parseInt(matcher.group(1)) * 365;
					jours += Integer.parseInt(matcher.group(2)) * 30;
					return jours;
				}
				patternStr = "(\\d+);";
				pattern = Pattern.compile(patternStr);
				matcher = pattern.matcher(id.age);
				if (matcher.find()) {
					jours = Integer.parseInt(matcher.group(1)) * 365;
					return jours;
				}
				patternStr = "(\\d+)";
				pattern = Pattern.compile(patternStr);
				matcher = pattern.matcher(id.age);
				if (matcher.find()) {
					jours = Integer.parseInt(matcher.group(1)) * 365;
					return jours;
				}
			}
		return -1;
	}

	String corpus(String part) {
		if (ids==null) return "";
		for (ID id: ids)
			if ( id.code.equals(part) ) return id.corpus;
		return "";
	}

	String name(String part) {
		if (ids==null) return "";
		for (ID id: ids)
			if ( id.code.equals(part) ) return id.name;
		return "";
	}

	String role(String part) {
		if (ids==null) return "";
		for (ID id: ids)
			if ( id.code.equals(part) ) return id.role;
		return "";
	}

	String code(int c) {
		if (c < 0) return "";
		if (c >= ids.size()) return "";
		return ids.get(c).role;
		/*
		int i = 0;
		for (ID id: ids) {
			if ( i == c ) return id.role;
			i++;
		}
		return "";
		*/
	}

	ID id(String part) {
		if (ids==null) return null;
		for (ID id: ids)
			if ( id.code.equals(part) ) return id;
		return null;
	}

	class Tier {
		String tier;
		int nl;
		Tier(String t) {
			tier = t;
			nl = -1;
		}
		Tier(String t, int n) {
			tier = t;
			nl = n;
		}
	}

	class MainTier {
		String mainLine;
		String mainCleaned;
		String mainRaw;
		int startTime;
		int endTime;
		int nl;
		List<Tier> tiers;

		String clean(String l) {
			l = l.replaceAll( "\\([.\\d]\\)", "" );
			l = l.replaceAll( "\\(", "" );
			l = l.replaceAll( "\\)", "" );
			l = l.replaceAll( "\\[.*\\]", "" );
			l = l.replaceAll( "\\x01", "" );
			l = l.replaceAll( "\\x02", "" );
			l = l.replaceAll( "\\x03", "" );
			l = l.replaceAll( "\\x04", "" );
			l = l.replaceAll( "\\x07", "" );
			l = l.replaceAll( "\\x08", "" );
			l = l.replaceAll( "<", "" );
			l = l.replaceAll( ">", "" );
			l = l.replaceAll( "0", "" );
			//l = l.replaceAll( " +", " " ); // garder les marqueurs de fin d'énoncé
			return l;
		}

		MainTier(String ml) {
			mainRaw = ml;
			String patternStr = ".*\\x15(\\d+)_(\\d+)\\x15";
			Pattern pattern = Pattern.compile(patternStr);
			Matcher matcher = pattern.matcher(ml);
			if (matcher.find()) {
				startTime = Integer.parseInt(matcher.group(1));
				endTime = Integer.parseInt(matcher.group(2));
				mainLine = ml.replaceAll("\\x15\\d+_\\d+\\x15",""); // replaceFirst
			} else {
				startTime = -1;
				endTime = -1;
				mainLine = ml;
			}
			mainCleaned = clean(mainLine);
			nl = -1;
			tiers = null;
		}
		MainTier(String ml, int n) {
			this(ml);
			nl = n;
		}
		void addTier(String tier) {
			if (tiers==null)
				tiers = new LinkedList<Tier>();
			tiers.add(new Tier(tier.replaceAll("\\x15\\d+_\\d+\\x15","")));//tier
		}
		void addTier(String tier, int n) {
			if (tiers==null)
				tiers = new LinkedList<Tier>();
			tiers.add(new Tier(tier, n));
		}
		String ml() {
			return mainLine;
		}
		String mlc() {
			return mainCleaned;
		}
		int start() {
			return startTime;
		}
		int end() {
			return endTime;
		}
		String t(int n) {
			return tiers.get(n).tier;
		}
		int mlLNB() {
			return nl;
		}
		int tLNB(int n) {
			return tiers.get(n).nl;
		}
		void majtime(int ts, int te) {
			startTime = ts;
			endTime = te;
		}
	}

	List<MainTier> mainLines;

	ChatFile() {
		/**
		 * initialise une donnée de type ChatFile
		 */
		mainLines = new ArrayList<MainTier>();
	}

	void addML(String ml) {
		mainLines.add( new MainTier(ml) );
	}
	void addML(String ml, int n) {
		mainLines.add( new MainTier(ml, n) );
	}

	void addT(String ml) {
		MainTier last = mainLines.get( mainLines.size()-1 );
		last.addTier( ml );
	}
	void addT(String ml, int n) {
		MainTier last = mainLines.get( mainLines.size()-1 );
		last.addTier( ml, n );
	}

	void insertML(String ml) {
		if ( ml.startsWith("%") ) {
			if (inMainLine == false) {
				inMainLine = true;
				addML("*UNK:\t."); // adds an empty line
			}
			addT(ml);
		} else {
			if ( ml.startsWith("*") )
				inMainLine = true;
			else
				inMainLine = false;
			addML(ml);
		}
	}

	void load(String fn) throws IOException {
		chatFilename = fn;
		BufferedReader reader = new BufferedReader( new InputStreamReader(new FileInputStream(fn), inputEncoding) );
		String line = "";
		String ml = "";
		try {
			while((line = reader.readLine()) != null) {
				// Traitement du flux de sortie de l'application si besoin est
				if ( line.startsWith(" ") || line.startsWith("\t") ) {
					ml += line;
				} else {
					// process previous line if not empty
					if ( ! ml.equals("") ) {
						insertML(ml);
					}
					ml = line;
				}
			}
		}
		catch (FileNotFoundException fnfe) {
			System.err.println("Erreur fichier : " + fn + " indisponible");
			return;
		}
		catch(IOException ioe) {
			System.err.println("Erreur sur fichier : " + fn );
			ioe.printStackTrace();
			System.exit(1);
		}
		finally {
			if ( ! ml.equals("") )
				insertML(ml);
			reader.close();
		}
	}

	public int nbMainLines() {
		return mainLines.size();
	}

	public String ml(int n) {
		return mainLines.get(n).ml();
	}

	public String mlc(int n) {
		return mainLines.get(n).mlc();
	}

	public int startMl(int n) {
		return mainLines.get(n).start();
	}

	public int endMl(int n) {
		return mainLines.get(n).end();
	}

  public void majtime(int n, int ts, int te) {
		mainLines.get(n).majtime(ts, te);
	}

	public int nbTiers(int n) {
		if ( mainLines.get(n).tiers == null ) return 0;
		return mainLines.get(n).tiers.size();
	}

	public String t(int n, int t) {
		return mainLines.get(n).t(t);
	}

	public String filename() {
		return chatFilename;
	}

	public void dump() {
		System.out.println( "Filename : " + filename() );
		System.out.println( "Nb Lines : " + nbMainLines() );
		int nbids = ids.size();
		System.out.println( "Nb IDs : " + nbids );
		System.out.println("chat_filename : " + chatFilename );
		System.out.println("media_filename : " + mediaFilename );
		System.out.println("media_type : " + mediaType );
		System.out.println("birth : " + birth );
		System.out.println("date : " + date );
		System.out.println("location : " + location );
		System.out.println("situation : "  + situation );
		System.out.println("transcriber : " + transcriber );
		System.out.println("language : " + lang );
		for (String com:comments){
			System.out.println("com :  " + com);
		}

		for (String info:otherInfo){
			System.out.println("info :  " + info);

		}
		for (ID id: ids) {
			System.out.println("NAME : " + id.name );
			System.out.println("ID-language : " + id.language );
			System.out.println("ID-corpus : " + id.corpus );
			System.out.println("ID-code : " + id.code );
			System.out.println("ID-age : " + id.age );
			System.out.println("ID-sex : " + id.sex );
			System.out.println("ID-group : " + id.group );
			System.out.println("ID-SES : " + id.SES );
			System.out.println("ID-role : " + id.role );
			System.out.println("ID-education : " + id.education );
			System.out.println("ID-customfield : " + id.customfield );
		}

		int sz = nbMainLines();

		for (int i=0; i<sz; i++) {
			System.out.println( i + ": (" + startMl(i) + ") (" + endMl(i) + ") " + ml(i) );
			System.out.println( i + ": (" + startMl(i) + ") (" + endMl(i) + ") " + mlc(i) );
			int tsz = nbTiers(i);

			for (int j=0; j<tsz; j++) {
				System.out.println( j + "- " + t(i,j) );
			}
		}
	}

	public void cleantime_inmemory(int style) {
		int last_te = -1;
		int last_ts = -1;
		int last_i = -1;
		int missing = 1;
		int i;
		int first=0;

		for (i=0; i < nbMainLines(); i++) {
			String tp = ml(i);
			if (tp.startsWith("*")) {
				if ( missing == 1 ) {
					first = i;
					missing = 0;
				}
				if ( endMl(i) > 0 ) {
					break;
				}
			}
		}
		// i tells where there is the first bullet and first tells where there is the first line where there should be a bullet.
		if ( i == nbMainLines() ) {
			// no bullet at all - note that it could be possible to spread the time across ALL the transcription
			System.out.println("Warning: no bullet in file - impossible to cleantime");
			return;
		}

		// if the first bullet does not correspond to the first line, then we move that bullet to the first line.
		if ( i != first ) {
			int ts = startMl(i);
			int te = endMl(i);
			majtime(i, -1, -1);
			majtime(first, ts, te);
		}

		missing = 0; // count how many missing lines between two bullets.
		for (i=0; i < nbMainLines(); i++) {
			String tp = ml(i);
			if (tp.startsWith("*")) {
				int ts = startMl(i);
				int te = endMl(i);
//				System.out.println("found bullet at " + i + " " + ts + " " + te + " missing " + missing);
				if (ts != -1) { // this means that there is a legal bullet on that line
					if (missing > 0 ) { // it is necessary to propagate
						// propagate time after bullet
						if (style == 0) { // equal length between all lines
							int d = (last_te-last_ts)/(missing+1);
							int k = 0;
							for (; k < missing; k++) {
								int new_ts = last_ts + k*d;
							  int new_te = last_ts + k*d + d;
								// upgrade last_i with new_ts and new_te
								majtime(last_i, new_ts, new_te);
								// find new line to be bulleted
								String tstop;
								do {
									last_i++;
									tstop = ml(last_i);
								} while ( !tstop.startsWith("*") );
							}
							// propagate to last
							int new_ts = last_ts + k*d;
							int new_te = last_te ;
							// upgrade last_i with new_ts and new_te
							majtime(last_i, new_ts, new_te);
						} else {
							// compute the length in words of the line to be bulleted
							int k;
							int li = last_i;
							int total_nw = 0;
							int nw[] = new int[missing+1];
							for (k=0; k <= missing; k++) {
								// count number of words
								String w[] = mlc(li).split("\\s+");
								nw[k] = w.length;
								total_nw += nw[k];
								// find new line to be bulleted
								String tstop;
								do {
									li++;
									tstop = ml(li);
								} while ( !tstop.startsWith("*") );
							}
							// compute the time increment for each word
							int d = (last_te-last_ts)/(total_nw+1);
							int decal = 0; // compute current new bullet time
							// bullet the lines according to their number of words
							for (k=0; k < missing; k++) {
								// compute length in milliseconds
								int lg = nw[k] * d ;
								int new_ts = last_ts + decal;
								int new_te = last_ts + decal+ lg;
								decal += lg;
								// upgrade last_i with new_ts and new_te
								majtime(last_i, new_ts, new_te);
								// find new line to be bulleted
								String tstop;
								do {
									last_i++;
									tstop = ml(last_i);
								} while ( !tstop.startsWith("*") );
							}
							// propagate to last
							int new_ts = last_ts + decal;
							int new_te = last_te ;
							// upgrade last_i with new_ts and new_te
							majtime(last_i, new_ts, new_te);
						}
					}
					// store last line with a bullet
					last_ts = ts;
					last_te = te;
					last_i = i;
					missing = 0;
				} else {
					// count how many lines have no bullet
					missing++;
				}
			}
		}

		if (missing > 0 ) {
			// propagate time after the last bullet of the file
			int d = (last_te-last_ts)/(missing+1); // equal time between all new bullets.
			int k = 0;
			for (; k < missing; k++) {
				int new_ts = last_ts + k*d;
				int new_te = last_ts + k*d + d;
				// upgrade last_i with new_ts and new_te
				majtime(last_i, new_ts, new_te);
				last_i++;
			}
			// propagate to very last line
			int new_ts = last_ts + k*d;
			int new_te = last_te ;
			// upgrade last_i with new_ts and new_te
			majtime(last_i, new_ts, new_te);
		}
	}

	public void init(String fn) throws Exception {
		/**
		 * lit le contenu d'un fichier.
		 * lit et décompose les entetes
		 * exception en cas de fichier absent ou incorrect.
		 * @param fn fichier Chat à lire
		 */
		load(fn);
		findInfo(false);
		cleantime_inmemory(1);
	}

	public static void main(String[] args) throws Exception {
		ChatFile cf = new ChatFile();
		cf.load(args[0]);
		cf.findInfo(false);
		cf.dump();
	}
};
