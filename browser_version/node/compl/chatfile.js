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

'use strict';

var fs = require('fs');
// var fse = require('fs-extra');
// var path = require('path');

var version = require('../editor/version.js');

var chatfile = exports;

chatfile.loc = function(ln) {
	var patloc = new RegExp("([%*@]\\w+)[\\s:]+(.*)");
	var test = patloc.exec(ln);
	if (test) {
		return test[1];
	} else {
		return ln;
	}
}

chatfile.ctn = function(ln) {
	var patloc = new RegExp("([%*@]\\w+)[\\s:]+(.*)");
	var test = patloc.exec(ln);
	if (test) {
		return test[2].trim();
	} else {
		return "";
	}
}

chatfile.locAndCtn = function(ln) {
	var patloc = new RegExp("([%*@]\\w+)[\\s:]+(.*)");
	var test = patloc.exec(ln);
	if (test) {
		return { loc: test[1], ctn: test[2].trim() };
	} else {
		return { loc: '', ctn: '' };
	}
}

/**
 * internal object for chatfile.file
 * contains ID (locutor) information
 **/
function ID() {
	this.code = "";
	this.name = "";
	this.role = "";
	// dans l'@ID
	this.language = "";
	this.corpus = "";
	//code;
	this.age = "";
	this.sex = "";
	this.group = "";
	this.SES = "";
	// role;
	this.education = "";
	this.customfield = "";
};

function Tier() {
    this.tier = '';
    this.nl = -1;
    this.Tier = function(t, n) {
        this.tier = t;
        this.nl = n !== undefined ? n : -1;
    };
}

function MainTier(ml, n) {

    this.clean = function(l) {
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
    };

    this.mainLine = '';
    this.mainCleaned = '';
    this.mainRaw = '';
    this.startTime = -1;
    this.endTime = -1;
    this.nl = -1;
    this.tiers = [];

    this.mainRaw = ml;
    this.pattern = new RegExp(".*\\x15(\\d+)_(\\d+)\\x15$");
    this.matcher = this.pattern.exec(ml);
    if (this.matcher) {
        this.startTime = Integer.parseInt(matcher.group(1));
        this.endTime = Integer.parseInt(matcher.group(2));
        this.mainLine = ml.replaceAll("\\x15\\d+_\\d+\\x15",""); // replaceFirst
    } else {
        this.startTime = -1;
        this.endTime = -1;
        this.mainLine = ml;
    }
    this.mainCleaned = this.clean(this.mainLine);
    if (n !== undefined) this.nl = n; else this.nl -1;
    this.tiers = null;

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
}


/**
 * initializes the chatfile.file object
 */
chatfile.chatfile = function() {
	/** All input will use this encoding */
	this.inputEncoding = "UTF-8";
	this.wellFormed = true;

	this.chatFilename = "";
	this.mediaFilename = "";
	this.mediaType = "";
	this.birth = "";
	this.date = "";
	this.location = "";
	this.transcriber = "";
	this.situation = "";
	this.lang = "";
	this.timeDuration = "";
	this.timeStart = "";

	this.comments = [];
	this.gemes = [];
	this.otherInfo = [];
	this.ids= [];
	this.inMainLine = false;

	this.findInfo = function(verbose) {
		// find all types of information and preprocess it.
		var sz = this.nbMainLines();
		var inHeader = true;
		var idsMap = {};
		for (var i=0; i<sz; i++) {
			if (this.ml(i).indexOf("*") === 0) {
				inHeader = false;
				var match = chatfile.loc(ml(i));
				if (match != '') {
					if (idsMap[match] !== undefined) {
						idsMap[match] = 1;
						var nid = new ID();
						nid.code = match;
						if (nid.code === "UNK")
							nid.role = "Unknown";
						this.ids.push(nid);
					}
				}
			}
			if ( this.ml(i).toLowerCase().indexOf("@participants") === 0) {
				var rls = this.ml(i).split(/[:,]/);
				for (var part in rls) {
					var wds = rls[part].split(/\s+/);
					if (wds.length === 3) {
						var nid = new ID();
						nid.code = wds[1];
						nid.role = wds[2];
						this.ids.push(nid);
						idsMap[wds[1]];
					} else if (wds.length === 4) {
						var nid = new ID();
						nid.code = wds[1];
						nid.name = wds[2];
						nid.role = wds[3];
						this.ids.push(nid);
						idsMap[wds[1]];
					}
				}
			} else if ( this.ml(i).toLowerCase().indexOf("@media") === 0) {
				String[] wds = ml(i).split("[\\s,]+");
				if (wds.length === 3) {
					this.mediaFilename = wds[1];
					this.mediaType =  wds[2];
				}
			} else if ( this.ml(i).toLowerCase().indexOf("@id") === 0) {
				String[] wds = ml(i).split("\\|");
				if (wds.length < 3) {
					console.log("erreur sur les IDs à " + ml(i));
					continue;
				}
				var found = false;
				for (var id in ids) {
					if ( this.ids[id].code === wds[2] ) {
						found = true;
						// dans l'@ID
						if (wds.length > 0) {
							var details = wds[0].split(/(?i)@ID:\\s+/);
							if (details.length >= 2) {
								this.ids[id].language = details[1];
							}
						}
						if (wds.length > 1) this.ids[id].corpus = wds[1];
						//code;
						if (wds.length > 3) this.ids[id].age = wds[3];
						if (wds.length > 4) this.ids[id].sex = wds[4];
						if (wds.length > 5) this.ids[id].group = wds[5];
						if (wds.length > 6) this.ids[id].SES = wds[6];
						// role;
						if (wds.length > 8) this.ids[id].education = wds[8];
						if (wds.length > 9) this.ids[id].customfield = wds[9];
					}
				}
				if (found === false) {
					// console.log("erreur sur ID " + ml(i) + "pas trouvé dans les participants - ajourt direct");
					var nid = new ID();
					// dans l'@ID
					if (wds.length > 0) {
						var details = wds[0].split(/(?i)@ID:\\s+/);
						if (details.length >= 2){
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
					this.ids.push(nid);
					idsMap.push(wds[2]);
				}
			} else if ( this.ml(i).toLowerCase().indexOf("@location") === 0 ) {
				this.location = this.ml(i);
			} else if ( this.ml(i).toLowerCase().indexOf("@date") === 0 ) {
				this.date = this.ml(i);
			} else if ( this.ml(i).toLowerCase().indexOf("@birth") === 0 ) {
				if ( this.ml(i).indexOf("of CHI") !== -1 )
					this.birth = this.ml(i);
			} else if ( this.ml(i).toLowerCase().indexOf("@comment") === 0 ) {
				if ( this.ml(i).indexOf("coder") !== -1
					|| this.ml(i).indexOf("Coder") !== -1)
					this.transcriber = this.ml(i);
				else{
					this.comments.push(this.ml(i));
				}
			} else if ( this.ml(i).toLowerCase().indexOf("@transcriber") === 0 ) {
				this.transcriber = this.ml(i);
			}
			else if ( this.ml(i).toLowerCase().indexOf("@situation") === 0 && inHeader) {
				this.situation = this.ml(i);
			}
			else if ( this.ml(i).toLowerCase().indexOf("@time Duration") === 0 ) {
				this.timeDuration = this.ml(i);
			}
			else if ( this.ml(i).toLowerCase().indexOf("@g") === 0
				|| this.ml(i).toLowerCase().indexOf("@bg") === 0
				|| this.ml(i).toLowerCase().indexOf("@eg") === 0
				|| this.ml(i).toLowerCase().indexOf("@situation") === 0) {
				this.gemes.push(this.ml(i));
			}
			else if ( this.ml(i).toLowerCase().indexOf("@languages") === 0 ) {
				this.lang = this.ml(i);
			}
			else if ( this.ml(i).toLowerCase().indexOf("@time start") === 0 ) {
				try {
					this.timeStart = this.ml(i).split(/\s+/)[2];
				}
				catch(Exception e) {
					this.timeStart = 0;
				}
			}
			else if(this.ml(i).indexOf("@") === 0
				&& this.ml(i).split("\t").length>1 && inHeader ) {
				this.otherInfo.push(this.ml(i));
			}
		}

		if(!verbose) return;
		console.log("chat_filename : " + this.chatFilename );
		console.log("media_filename : " + this.mediaFilename );
		console.log("media_type : " + this.mediaType );
		console.log("birth : " + this.birth );
		console.log("date : " + this.date );
		console.log("location : " + this.location );
		console.log("situation : "  + this.situation );
		console.log("transcriber : " + this.transcriber );
		console.log("language : " + this.lang );

		for (var com in this.comments) {
			console.log("com :  " + this.comments[com]);
		}

		for (var info in this.otherInfo) {
			console.log("info :  " + this.otherInfo[info]);
		}

		for (var id in this.ids) {
			console.log("NAME : " + this.ids[id].name );
			console.log("ID-language : " + this.ids[id].language );
			console.log("ID-corpus : " + this.ids[id].corpus );
			console.log("ID-code : " + this.ids[id].code );
			console.log("ID-age : " + this.ids[id].age );
			console.log("ID-sex : " + this.ids[id].sex );
			console.log("ID-group : " + this.ids[id].group );
			console.log("ID-SES : " + this.ids[id].SES );
			console.log("ID-role : " + this.ids[id].role );
			console.log("ID-education : " + this.ids[id].education );
			console.log("ID-customfield : " + this.ids[id].customfield );
		}
	};

	this.ageChild = function() {
		if (this.ids.length<1) return "";
		return age("CHI");
	}

	this.age = function(part) {
		if (this.ids.length<1) return "";
		for (var id in this.ids)
			if ( this.ids[id].code === part ) return this.ids[id].age;
		return "";
	}

	this.ageJour = function(part) {
		if (this.ids.length<1) return -1;
		for (var id in this.ids)
			if ( this.ids[id].code.equals(part) ) {
				var jours = 0;
				var pattern = new RegExp("(\\d+);(\\d+).(\\d+)");
				var matcher = pattern.exec(this.ids[id].age);
				if (matcher)) {
					jours = matcher[1] * 365;
					jours += matcher[2] * 30;
					jours += matcher[3];
					return jours;
				}
				pattern = new RegExp"(\\d+);(\\d+).?";
				matcher = pattern.exec(this.ids[id].age);
				if (matcher) {
					jours = matcher[1] * 365;
					jours += matcher[2] * 30;
					return jours;
				}
				pattern = "(\\d+);?";
				matcher = pattern.exec(this.ids[id].age);
				if (matcher) {
					jours = matcher[1] * 365;
					return jours;
				}
			}
		return -1;
	}

	this.corpus = function(part) {
		if (this.ids.length<1) return "";
		for (var id in this.ids)
			if ( this.ids[id].corpus === part ) return this.ids[id].corpus;
		return "";
	}

	this.name = function(part) {
		if (this.ids.length<1) return "";
		for (var id in this.ids)
			if ( this.ids[id].name === part ) return this.ids[id].name;
		return "";
	}

	this.role = function(part) {
		if (this.ids.length<1) return "";
		for (var id in this.ids)
			if ( this.ids[id].role === part ) return this.ids[id].role;
		return "";
	}

	this.code = function(c) {
		if (c < 0) return "";
		if (c >= this.ids.length) return "";
		return this.ids[c].role;
	}

	this.id = function(part) {
		if (this.ids.length<1) return null;
		for (var nid in this.ids)
			if ( this.ids[nid].code === part ) return this.ids[nid];
		return null;
	}

	this.mainLines = [];

	this.addML = function(ml, n) {
		this.mainLines.push( new MainTier(ml, n) );
	};

	this.addT(ml, n) {
		var last = this.mainLines.get( this.mainLines.size()-1 );
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
		console.log( "Filename : " + filename() );
		console.log( "Nb Lines : " + nbMainLines() );
		int nbids = ids.size();
		console.log( "Nb IDs : " + nbids );
		console.log("chat_filename : " + chatFilename );
		console.log("media_filename : " + mediaFilename );
		console.log("media_type : " + mediaType );
		console.log("birth : " + birth );
		console.log("date : " + date );
		console.log("location : " + location );
		console.log("situation : "  + situation );
		console.log("transcriber : " + transcriber );
		console.log("language : " + lang );
		for (String com:comments){
			console.log("com :  " + com);
		}

		for (String info:otherInfo){
			console.log("info :  " + info);

		}
		for (ID id: ids) {
			console.log("NAME : " + id.name );
			console.log("ID-language : " + id.language );
			console.log("ID-corpus : " + id.corpus );
			console.log("ID-code : " + id.code );
			console.log("ID-age : " + id.age );
			console.log("ID-sex : " + id.sex );
			console.log("ID-group : " + id.group );
			console.log("ID-SES : " + id.SES );
			console.log("ID-role : " + id.role );
			console.log("ID-education : " + id.education );
			console.log("ID-customfield : " + id.customfield );
		}

		int sz = nbMainLines();

		for (int i=0; i<sz; i++) {
			console.log( i + ": (" + startMl(i) + ") (" + endMl(i) + ") " + ml(i) );
			console.log( i + ": (" + startMl(i) + ") (" + endMl(i) + ") " + mlc(i) );
			int tsz = nbTiers(i);

			for (int j=0; j<tsz; j++) {
				console.log( j + "- " + t(i,j) );
			}
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
	}

	public static void main(String[] args) throws Exception {
		ChatFile cf = new ChatFile();
		cf.load(args[0]);
		cf.findInfo(false);
		cf.dump();
	}
};
