/**
 * teiConvertTools.js
 */

/* global $ */

"use strict";

/*
if (typeof window === 'undefined') {
	var teiConvertTools = exports;
    var trjs = {};
	trjs.dataload = require('./dataload.js');
	var docx = require('./teidocx.js')
} else
*/

var teiConvertTools = {};

var shiftSize = 3;

function nolines(s) {
	s = gtlt(s);
	return s.replace(/[\s]+/g, ' ');
}

/**
 * convert text to XML format
 * @method xmlEntities
 * @param plain text
 * @return xml coded text
 */
function xmlEntitiesEncode(texte) {
	//	texte = texte.replace(/\<br.*?\/\s?br\>/g,'\n'); // 10
	//	texte = texte.replace(/\<br\s*\/?\>/g,'\n'); // 10
	texte = texte.replace(/"/g, '&quot;'); // 34 22
	texte = texte.replace(/&/g, '&amp;'); // 38 26
	texte = texte.replace(/\'/g, '&#39;'); // 39 27
	texte = texte.replace(/\</g, '&lt;'); // 60 3C
	texte = texte.replace(/\>/g, '&gt;'); // 62 3E
	//texte = texte.replace(/\^/g,'&circ;'); // 94 5E
	return texte;
}

function removeTags(texte) {
	texte = texte.replace(/\<.*?\>/g, ''); // 62 3E
	return texte;
}

teiConvertTools.textToTEI = function (data) {
	var lines = data.split(/[\n\r]+/);
	var s = '<TEI><text><body>';
	for (var i = 0; i < lines.length; i++) {
		if (!lines[i]) continue;
		var l = xmlEntitiesEncode(lines[i].trim());
		if (l.length < 1) continue;
		var b = /(.*?)[:\s]+(.*)/.exec(l);
		if (b === null)
			s += '<u who="UNK">' + l + '</u>';
		else
			s += '<u who="' + b[1] + '">' + b[2] + '</u>';
	}
	return s + '</body></text></TEI>';
};

function text(d) {
	if (typeof d === 'string')
		return d;
	else {
		return d.join(' ');
	}
}

function splitParts(b) {
	var p = b.split(':-:');
	var r = [];
	for (var i in p) {
		var s = /\s+(.*):\s+(.*)\s+/.exec(p[i]);
		if (s !== null) {
			r.push({ type: s[1], value: s[2] });
		}
	}
	return r;
}

/**
 * Information about persons
 * @constructor __PersonInfo
 */
function __NameInfo() {
	this.code = '';
	this.age = '';
	this.name = '';
	this.role = '';
	this.sex = '';
	this.source = '';
	this.group = '';
	this.ses = '';
	this.educ = '';
	this.xml_id = '';
	this.xml_lang = '';
	this.custom = '';
}

/**
 * Store contents of a basic template information 
 * @constructor __TierInfo
 */
function __TierInfo() {
	this.code = '';
	this.type = '';
	this.parent = '';
	this.name = '';
}

function nameInfo(pb) {
	var r = new __NameInfo();
	for (var i in pb) {
		switch (pb[i].type) {
			case 'code':
				r.code = pb[i].value;
				break;
			case 'age':
				r.age = pb[i].value;
				break;
			case 'name':
				r.name = pb[i].value;
				break;
			case 'role':
				r.role = pb[i].value;
				break;
			case 'sex':
				r.sex = pb[i].value;
				break;
			case 'source':
				r.source = pb[i].value;
				break;
			case 'group':
				r.group = pb[i].value;
				break;
			case 'ses':
				r.ses = pb[i].value;
				break;
			case 'educ':
				r.educ = pb[i].value;
				break;
			case 'xml_id':
				r.xml_id = pb[i].value;
				break;
			case 'xml_lang':
				r.xml_lang = pb[i].value;
				break;
			case 'custom':
				r.custom = pb[i].value;
				break;
		}
	}
	return r;
}

function tierInfo(pb) {
	var r = new __TierInfo();
	for (var i in pb) {
		switch (pb[i].type) {
			case 'code':
				r.code = pb[i].value;
				break;
			case 'type':
				r.type = pb[i].value;
				break;
			case 'parent':
				r.parent = pb[i].value;
				break;
			case 'name':
				r.name = pb[i].value;
				break;
		}
	}
	return r;
}

function mimeType(url, type) {
	var ext = trjs.utils.extensionName(url);
	switch (ext) {
		case '.wav':
			return 'audio/wav';
		case '.mp3':
			return 'audio/mpeg';
		case '.mp4':
			return 'video/mp4';
		case '.webm':
			return 'video/webm';
	}
	return type;
}

/**
 * test if string neither null nor empty
 * @method isnotbl
 * @param string
 * @return boolean yes or no
 */
function isnotbl(s) {
	if (s != null && s != '') return true;
	return false;
}

function gtlt(s) {
	var reLeft = new RegExp(trjs.data.leftBracket, "g");
	var reRight = new RegExp(trjs.data.rightBracket, "g");
	var reAmp = new RegExp(/&/, "g");
	s = s.replace(reLeft, '&lt;'); // 60 3C
	s = s.replace(reRight, '&gt;'); // 62 3E
	s = s.replace(reAmp, '&amp;'); // 62 3E
	return s;
}

function toXmlEvents(t) {
	// transformer les incidents
	// transformer les vocals
	// transformer les pauses
	// transformer les choices
	t = Encoder.htmlDecode(t);
	t = gtlt(t);
	return teiConvertTools.toTEIEvents(t);
}

teiConvertTools.toTEIEvents = function (text) {
	var rewrite = "";
	var reincident = new RegExp("(.*?)\\" + trjs.data.leftEvent + "(.*?)\\" + trjs.data.rightEvent + "(.*)");
	var recode = new RegExp("(.*?)\\" + trjs.data.leftCode + "(.*?)\\" + trjs.data.rightCode + "(.*)");
	var repause = new RegExp("(.*?)(#{1,3})(.*)");
	var repause2 = new RegExp("(.*?)#(\\d+\\.?\\d*)(.*)");
	var resimple2 = new RegExp("(.*)\/(.*)\/(.*)");
	var resimple = new RegExp("(.*)\/(.*)");
	var relangue = new RegExp("(.*)\/LG:(.*)");
	// text === starting value
	// rewrite === the resulting modified text
	while (1) {
		// find first incident
		var p = reincident.exec(text);
		if (p !== null) {
			var q = resimple2.exec(p[2]);
			if (q !== null) {
				rewrite += p[1];
				var cont = q[1].trim();
				var tag = q[3].trim();
				var sub = q[2].trim();
				switch (tag) {
					case 'N':
						rewrite += '<incident type="noise" subtype="' + sub + '">' + cont + '</incident>';
						break;
					case 'COM':
						rewrite += '<incident type="comment" subtype="' + sub + '">' + cont + '</incident>';
						break;
					case 'B':
						rewrite += '<incident type="background" subtype="' + sub + '">' + cont + '</incident>';
						break;
					case 'GES':
						rewrite += '<kinesic type="' + sub + '">' + cont + '</kinesic>';
						break;
					case 'PE':
						rewrite += '<incident type="para" subtype="' + sub + '">' + cont + '</incident>';
						break;
					default:
						rewrite += '<incident type="' + tag + '" subtype="' + sub + '">' + cont + '</incident>';
						break;
				}
				text = p[3];
				continue;
			}
			q = resimple.exec(p[2]);
			if (q !== null) {
				rewrite += p[1];
				var cont = q[1].trim();
				var tag = q[2].trim();
				switch (tag) {
					case 'N':
						rewrite += '<incident type="noise">' + cont + '</incident>';
						break;
					case 'COM':
						rewrite += '<incident type="comment">' + cont + '</incident>';
						break;
					case 'B':
						rewrite += '<incident type="background">' + cont + '</incident>';
						break;
					case 'GES':
						rewrite += '<kinesic>' + cont + '</kinesic>';
						break;
					case 'PE':
						rewrite += '<incident type="para">' + cont + '</incident>';
						break;
					default:
						rewrite += '<incident type="' + tag + '">' + cont + '</incident>';
						break;
				}
				text = p[3];
				continue;
			}
			rewrite += p[1];
			rewrite += '<incident type="unknown">';
			rewrite += p[2];
			rewrite += '</incident>\n';
			text = p[3];
			continue;
		}
		rewrite += text;
		break;
	}

	// text === starting value
	// rewrite === the resulting modified text
	// start again transforming the leftCode + rightCode
	text = rewrite;
	rewrite = "";
	while (1) {
		// find first incident
		var p = recode.exec(text);
		if (p !== null) {
			var q = relangue.exec(p[2]);
			if (q !== null) {
				rewrite += p[1];
				rewrite += '<seg type="language" subtype="' + q[2] + '">';
				rewrite += q[1];
				rewrite += '</seg>\n';
				text = p[3];
				continue;
			}
			q = resimple2.exec(p[2]);
			// there are three elements
			if (q !== null) {
				rewrite += p[1];
				var tag = q[3].trim();
				var sub = q[2].trim();
				var cont = q[1].trim();
				switch (tag) {
					case 'A': // acronyms
						rewrite += '<choice><abbr type="acronym">' + cont + "</abbr><expan>"
							+ sub + '</expan></choice>';
						break;
					case 'VAR': // variation
						rewrite += '<choice><orig>' + cont + "</orig><reg>"
							+ sub + '</reg></choice>';
						break;
					case 'VARPHO': // variation
						rewrite += '<choice type="pho"><orig>' + cont + "</orig><reg>"
							+ sub + '</reg></choice>';
						break;
					case 'NE':
						rewrite += '<rs type="entities" subtype="' + sub + '">' + cont + '</rs>';
						break;
					case 'LEX':
						rewrite += '<seg type="lexical" subtype="' + sub + '">' + cont + '</seg>';
						break;
					case 'API':
						rewrite += '<seg type="API" subtype="' + sub + '">' + cont + '</seg>';
						break;
					case 'VOC':
						rewrite += '<vocal type="' + sub + '">' + cont + '</vocal>';
						break;
					default:
						rewrite += '<vocal type="' + tag + '" subtype="' + sub + '">' + cont + '</vocal>';
						break;
				}
				text = p[3];
				continue;
			}
			q = resimple.exec(p[2]);
			if (q !== null) {
				rewrite += p[1];
				var tag = q[2].trim();
				var cont = q[1].trim();
				switch (tag) {
					case 'C': // choice
						var wrds = cont.split(',');
						rewrite += '<choice>';
						for (var w in wrds)
							rewrite += '<seg>' + wrds[w] + '</seg>';
						rewrite += '</choice>';
						break;
					case 'NE':
						rewrite += '<rs type="entities">' + cont + '</rs>';
						break;
					case 'LEX':
						rewrite += '<seg type="lexical">' + cont + '</seg>';
						break;
					case 'API':
						rewrite += '<seg type="API">' + cont + '</seg>';
						break;
					case 'VOC':
						rewrite += '<vocal>' + cont + '</vocal>';
						break;
					default:
						rewrite += '<vocal type="' + tag + '" subtype="previous">' + cont + '</vocal>';
						break;
				}
				text = p[3];
				continue;
			}
			rewrite += p[1];
			rewrite += '<incident type="unknown" subtype="previous">';
			rewrite += p[2];
			rewrite += '</incident>\n';
			text = p[3];
			continue;
		}
		rewrite += text;
		break;
	}

	// start again transforming the pauses
	text = rewrite;
	rewrite = "";
	while (1) {
		p = repause2.exec(text);
		if (p !== null) {
			rewrite += p[1];
			rewrite += '<pause type="chrono" dur="';
			rewrite += p[2];
			rewrite += '"/>';
			text = p[3];
			continue;
		}
		p = repause.exec(text);
		if (p !== null) {
			rewrite += p[1];
			rewrite += '<pause type="';
			switch (p[2]) {
				case '#':
					rewrite += 'short';
					break;
				case '##':
					rewrite += 'long';
					break;
				case '###':
					rewrite += 'verylong';
					break;
			}
			rewrite += '"/>';
			text = p[3];
			continue;
		}
		rewrite += text;
		break;
	}
	return rewrite;
}

teiConvertTools.docxToTEI = function (data) {
	trjs.dataload.timelineInit();
	var v = docx(data, 'raw'), b, l, t, pb, i;
	var medianame = "";
	var mediatype = "";
	var placename = "";
	var divDesc = [];
	var divType = [];
	var divId = 0;
	var xml_id = 0;
	var names = [];
	var codes = [];
	var tiers = [];
	var lines = [];
	var mapcodes = {};
	var maptiers = {};
	var annotOpened = false;
	var prevTier = [];
	var initSpan = [];
	var nPrevTier = 0;

	function testcode(v) {
		if (!(mapcodes[v] || maptiers[v])) {
			mapcodes[v] = true;
			var ti = new __TierInfo();
			ti.code = v;
			codes.push(ti);
		}
	}

	function closeAllTiers() {
		s = "";
		while (nPrevTier > 0) {
			s += '</span>';
			s += '</spanGrp>\n';
			nPrevTier--;
		}
		return s;
	}

	function __isDescendent(tc, h) {
		var tp = [];
		// find all parents of tc
		for (var i = 0; i < tc.length; i++) {
			for (var j = 0; j < tiers.length; j++) {
				if (tiers[j].code === tc[i]) {
					if (tiers[j].parent === h)
						return true;
					if ([null, '-', 'main', 'none', 'annotatedBlock'].indexOf(tiers[j].parent) < 0)
						tp.push(tiers[j].parent);
				}
			}
		}
		if (tp.length < 1)
			return false;
		else
			return __isDescendent(tp, h);
	}

	function isDescendent(c, h) {
		// find parent of c
		for (var i = 0; i < tiers.length; i++) {
			if (tiers[i].code === c) {
				// found the starting point
				if ([null, '-', 'main', 'none', 'annotatedBlock'].indexOf(tiers[i].parent) >= 0)
					return false;
				if (tiers[i].parent === h)
					return true;
				return __isDescendent([tiers[i].parent], h);
			}
		}
		return false;
	}

	// First read the data and store it in some variables
	// lines
	// codes
	// tiers
	// ... (see above begining of function)
	for (i = 0; i < v.DOM.length; i++) {
		t = v.DOM[i];
		//		console.log('RAW: '+t);
		t = text(t);
		//		console.log('text: '+t);
		//		t = removeTags(t);
		//		console.log(t);
		l = xmlEntitiesEncode(t.trim());
		if (l.length < 1) continue;
		// HEADERS
		if (l.indexOf('[person]') === 0) {
			b = /\[person\](.*)/.exec(l);
			if (b !== null) {
				// diviser b[1]
				pb = splitParts(b[1]);
				//console.log(pb);
				names.push(nameInfo(pb));
			}
			continue;
		}
		if (l.indexOf('[code]') === 0) {
			b = /\[code\](.*)/.exec(l);
			if (b !== null) {
				// diviser b[1]
				pb = splitParts(b[1]);
				//console.log(pb);
				var ti = tierInfo(pb);
				mapcodes[ti.code] = true;
				codes.push(ti);
			}
			continue;
		}
		if (l.indexOf('[tier]') === 0) {
			b = /\[tier\](.*)/.exec(l);
			if (b !== null) {
				// diviser b[1]
				pb = splitParts(b[1]);
				//console.log(pb);
				var ti = tierInfo(pb);
				maptiers[ti.code] = true;
				tiers.push(ti);
			}
			continue;
		}
		if (l.indexOf('[media]') === 0) {
			b = /\[media\](.*)/.exec(l);
			if (b !== null) {
				// diviser b[1]
				pb = b[1].split(':-:');
				//console.log(pb);
				if (pb.length >= 2) {
					medianame = pb[0].trim();
					mediatype = pb[1].trim();
				}
			}
			continue;
		}
		if (l.indexOf('[place]') === 0) {
			b = /\[place\](.*)/.exec(l);
			if (b !== null) {
				placename = b[1].trim();
			}
			continue;
		}
		// TRANSCRITION
		b = /(.*?)\t(.*?)\t(.*?)\t(.*)/.exec(l);
		if (b !== null) {
			// split into four parts with time1, time2, loc, utterances
			if (b[3] === "[+div+]") {
				// it's a div !
				// console.log("div::" + b[4]);
				var divt = /(.*?)\s+\|\s+(.*)/.exec(b[4]);
				if (divt !== null) {
					divType[divId] = divt[1];
					divDesc[divId] = divt[2];
				} else {
					divType[divId] = "";
					divDesc[divId] = b[1];
				}
				var id1 = trjs.dataload.timelineAdd(b[1]);
				var id2 = trjs.dataload.timelineAdd(b[2]);
				lines.push({ start: id1, end: id2, loc: b[3], utt: divId });
				testcode(b[3]);
				divId++;
				continue;
			}
			var id1 = trjs.dataload.timelineAdd(b[1]);
			var id2 = trjs.dataload.timelineAdd(b[2]);
			lines.push({ start: id1, end: id2, loc: b[3], utt: b[4] });
			testcode(b[3]);
		} else {
			b = /(.*?)\t(.*?)\t(.*)/.exec(l);
			if (b !== null) {
				b[3] = b[3].trim();
				// split into three parts with time1, time2, loc
				if (b[3] === "[+div+]") {
					// it's a div !
					divType[divId] = "";
					divDesc[divId] = b[1];
					var id1 = trjs.dataload.timelineAdd(b[1]);
					var id2 = trjs.dataload.timelineAdd(b[2]);
					lines.push({ start: id1, end: id2, loc: b[3], utt: divId });
					testcode(b[3]);
					divId++;
					continue;
				}
				var id1 = trjs.dataload.timelineAdd(b[1]);
				var id2 = trjs.dataload.timelineAdd(b[2]);
				lines.push({ start: id1, end: id2, loc: b[3], utt: '' });
				testcode(b[3]);
			} else {
				b = /(.*?)[:\s]+(.*)/.exec(l);
				if (b === null) {
					if (l.trim() === "[+div+]") {
						// it's a div !
						lines.push({ start: "", end: "", loc: l.trim(), utt: divId });
						testcode(l.trim());
						divId++;
						continue;
					}
					lines.push({ start: "", end: "", loc: l.trim(), utt: "" });
					testcode(l.trim());
				} else {
					if (b[1] === "[+div+]") {
						// it's a div !
						var divt = /(.*?)\\s+\\|\\s+(.*)/.exec(b[2]);
						if (divt !== null) {
							divType[divId] = divt[1];
							divDesc[divId] = divt[2];
						} else {
							divType[divId] = "";
							divDesc[divId] = b[2];
						}
						lines.push({ start: "", end: "", loc: b[1], utt: divId });
						testcode(b[1]);
						divId++;
						continue;
					}
					lines.push({ start: "", end: "", loc: b[1], utt: b[2] });
					testcode(b[1]);
				}
			}
		}
	}
	// Output the data into a string
	// the HEADER
	var s = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE TEI SYSTEM "http://ct3.ortolang.fr/tei-corpo/tei_all.dtd">\n<TEI xmlns="http://www.tei-c.org/ns/1.0" version="0.9">\n';
	s += '<teiHeader>\n<fileDesc>\n<titleStmt>\n<title>' + 'conversion to word (TEI_CORPO)' + '</title>\n</titleStmt>\n';
	s += '<publicationStmt>';
	s += '</publicationStmt>\n';

	s += '<notesStmt>\n';

	s += '<note type="TEMPLATE_DESC">\n';
	for (i in codes) {
		if (codes[i].code === '[+div+]' || codes[i].code === '[-div-]')
			continue;
		s += '<note>\n';
		s += '<note type="code">' + codes[i].code + '</note>\n';
		s += '<note type="type">' + codes[i].type + '</note>\n';
		if (codes[i].parent === '') codes[i].parent = 'main';
		s += '<note type="parent">' + codes[i].parent + '</note>\n';
		s += '</note>\n';
	}
	for (i in tiers) {
		s += '<note>\n';
		s += '<note type="code">' + tiers[i].code + '</note>\n';
		s += '<note type="type">' + tiers[i].type + '</note>\n';
		if (tiers[i].parent === '') tiers[i].parent = 'main';
		s += '<note type="parent">' + tiers[i].parent + '</note>\n';
		s += '</note>\n';
	}
	s += '</note>\n';
	s += '</notesStmt>\n';

	s += '<sourceDesc>\n<recordingStmt>';
	s += '<recording>\n';
	s += '<media url="' + medianame
		+ '" mediaType="' + mimeType(medianame, mediatype) + '" />\n';
	s += '</recording>\n';
	s += '</recordingStmt>\n</sourceDesc>\n';

	s += '</fileDesc>\n';

	s += '<profileDesc>\n';
	s += '<settingDesc>\n';
	s += '<place>\n';
	s += '<placeName>' + placename + '</placeName>\n';
	s += '</place>\n';
	// lister tous les @div+
	for (i = 0; i < divDesc.length; i++) {
		s += '<setting xml:id="d' + i + '">\n';
		s += '<activity>' + divDesc[i] + '</activity></setting>\n';
	}
	s += '</settingDesc>\n';
	s += '<particDesc><listPerson>\n';

	for (i in names) {
		s += '<person\n';
		if (isnotbl(names[i].code)) s += 'xml:id="' + names[i].code + '"\n';
		if (isnotbl(names[i].age)) s += 'age="' + names[i].age + '"\n';
		if (isnotbl(names[i].role)) s += 'role="' + names[i].role + '"\n';
		if (isnotbl(names[i].sex)) {
			if (names[i].sex.toLowerCase() === 'm')
				s += 'sex="1"\n';
			else if (names[i].sex.toLowerCase() === 'f')
				s += 'sex="2"\n';
			else
				s += 'sex="9"\n';
		}
		if (isnotbl(names[i].source)) s += 'source="' + names[i].source + '"\n';
		s += '>\n';
		if (isnotbl(names[i].name))
			s += '<persName>' + names[i].name + '</persName>\n';
		if (isnotbl(names[i].xml_lang)) {
			var ilgs = names[i].xml_lang.split(/[,\s]/);
			s += '<langKnowledge>\n';
			for (var ll = 0; ll < ilgs.length; ll++)
				s += '<langKnown>' + ilgs[ll] + '</langKnown>\n';
			s += '</langKnowledge>';
		}
		if (isnotbl(names[i].ses)) s += '<socecStatus>' + names[i].ses + '</socecStatus>\n';
		if (isnotbl(names[i].educ)) s += '<education>' + names[i].educ + '</education>\n';
		if (isnotbl(names[i].group)) {
			s += '<note type="group">' + names[i].group + '</note>\n';
		}
		if (isnotbl(names[i].custom)) {
			s += '<note type="customField=">' + names[i].custom + '</note>\n';
		}
		if (names[i].name) {
			s += '<altGrp>';
			// find: names[i].name in tiers
			for (var k in codes) {
				if (names[i].name === codes[k].name)
					s += '<alt type="' + codes[k].code + '" />';
			}
			s += '</altGrp>';
		}
		s += '</person>';
	}
	s += '</listPerson></particDesc>\n</profileDesc>\n';

	s += '<encodingDesc>\n';
	s += '<appInfo>\n';
	s += '<application ident="' + "TEI_CORPO converter" + '" />\n';
	s += '</appInfo>\n';
	s += '</encodingDesc>\n';

	s += '<revisionDesc>\n';
	s += '<list>\n';
	var d = new Date();
	s += '<item>lastsave: ' + d.toString() + '</item>\n';
	// s += '<item>url: ' + trjs.data.recordingLoc() + '/' + trjs.data.recordingName() + '</item>\n';
	// s += '<item>name: ' + trjs.data.recTitle + '</item>\n';
	s += '</list>\n';
	s += '</revisionDesc>\n';

	s += '</teiHeader>\n';

	// The TRANSCRITION
	s += '<text>\n';
	s += '<timeline unit="s">\n';
	s += '<when absolute="0" xml:id="tm0"/>\n';
	for (var ti in trjs.data.idToTime)
		s += '<when interval="' + trjs.data.idToTime[ti] + '" since="#tm0" xml:id="' + ti + '"/>\n';
	s += '</timeline>';
	s += '<body>';
	for (b in lines) {
		if (lines[b].loc === '[+div+]') {
			s += closeAllTiers();
			if (annotOpened === true) {
				s += "</annotationBlock>\n";
				annotOpened = false;
			}
			s += '<div type="' + divType[lines[b].utt] + '" subtype="d' + lines[b].utt + '">\n';
			if (lines[b].start && lines[b].end) {
				s += '<head><note type="start">#' + lines[b].start + '</note><note type="end">#' + lines[b].end + '</note></head>\n';
			}
		} else if (lines[b].loc === '[-div-]') {
			s += closeAllTiers();
			if (annotOpened === true) {
				s += "</annotationBlock>\n";
				annotOpened = false;
			}
			s += '</div>\n';
		} else if (mapcodes[lines[b].loc]) {
			s += closeAllTiers();
			if (annotOpened === true) {
				s += "</annotationBlock>\n";
				annotOpened = false;
			}
			if (!lines[b].start && !lines[b].end)
				s += '<annotationBlock who="' + lines[b].loc + '">\n';
			else if (lines[b].start && !lines[b].end)
				s += '<annotationBlock start="#' + lines[b].start + '" end="" who="' + lines[b].loc + '">\n';
			else if (lines[b].start && !lines[b].end)
				s += '<annotationBlock start="" end="#' + lines[b].end + '" who="' + lines[b].loc + '">\n';
			else
				s += '<annotationBlock start="#' + lines[b].start + '" end="#' + lines[b].end + '" who="' + lines[b].loc + '">\n';
			s += '<u>' + toXmlEvents(lines[b].utt) + '</u>\n';
			annotOpened = true;
		} else {
			// tiers secondaires
			while (true) {
				if (nPrevTier < 1) {
					s += '<spanGrp type="' + lines[b].loc + '">\n';
					nPrevTier = 1;
					prevTier[nPrevTier] = lines[b].loc;
					initSpan[nPrevTier] = true;
					break;
				}
				if (lines[b].loc != prevTier[nPrevTier]) {
					if (isDescendent(lines[b].loc, prevTier[nPrevTier])) {
						s += '<spanGrp type="' + lines[b].loc + '">\n';
						nPrevTier++;
						prevTier[nPrevTier] = lines[b].loc;
						initSpan[nPrevTier] = true;
						break;
					} else {
						// si un span est ouvert at the current level, le fermer
						s += '</span>';
						s += '</spanGrp>';
						nPrevTier--;
					}
				} else
					break;
			}
			if (initSpan[nPrevTier] === true)
				initSpan[nPrevTier] = false;
			else
				s += '</span>';
			// si un span est ouvert et que l'on n'a pas ouvert de spanGrp depuis son ouverture, le fermer
			if (!lines[b].start && !lines[b].end)
				s += '<span>' + toXmlEvents(lines[b].utt) + '\n';
			else if (lines[b].start && !lines[b].end)
				s += '<span from="#' + lines[b].start + '" to="">' + toXmlEvents(lines[b].utt) + '\n';
			else if (lines[b].start && !lines[b].end)
				s += '<span from="" to="#' + lines[b].end + '">' + toXmlEvents(lines[b].utt) + '\n';
			else
				s += '<span from="#' + lines[b].start + '" to="#' + lines[b].end + '">' + toXmlEvents(lines[b].utt) + '\n';
		}
	}
	s += closeAllTiers();
	if (annotOpened === true) {
		s += "</annotationBlock>\n";
		annotOpened = false;
	}
	return s + '</body>\n</text>\n</TEI>\n';
};

function to_csv(workbook) {
	var result = [];
	workbook.SheetNames.forEach(function (sheetName) {
		var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
		if (csv.length > 0) {
			result.push("SHEET: " + sheetName);
			result.push("");
			result.push(csv);
		}
	});
	return result.join("\n");
}

function to_tab(workbook) {
	var result = [];
	workbook.FS = '\t';
	workbook.RS = '\n';
	workbook.SheetNames.forEach(function (sheetName) {
		var tab = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
		if (tab.length > 0) {
			result.push(sheetName);
			result.push(tab);
		}
	});
	return result.join("\n");
}

function to_array(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function (sheetName) {
		var array = XLSX.utils.sheet_to_array(workbook.Sheets[sheetName]);
		if (array.length > 0) {
			result[sheetName] = array;
		}
	});
	return result;
}

// Fermeture
(function () {

	/**
	 * Fonction pour arrondir un nombre.
	 *
	 * @param	{String}	type	Le type d'arrondi.
	 * @param	{Number}	value	Le nombre à arrondir.
	 * @param	{Integer}	exp		L'exposant (le logarithme en base 10 de la base pour l'arrondi).
	 * @returns	{Number}			La valeur arrondie.
	 */
	function decimalAdjust(type, value, exp) {
		// Si l'exposant vaut undefined ou zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// Si value n'est pas un nombre
		// ou si l'exposant n'est pas entier
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// Décalage
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Re "calage"
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	// Arrondi décimal
	if (!Math.round10) {
		Math.round10 = function (value, exp) {
			return decimalAdjust('round', value, exp);
		};
	}
	// Arrondi décimal inférieur
	if (!Math.floor10) {
		Math.floor10 = function (value, exp) {
			return decimalAdjust('floor', value, exp);
		};
	}
	// Arrondi décimal supérieur
	if (!Math.ceil10) {
		Math.ceil10 = function (value, exp) {
			return decimalAdjust('ceil', value, exp);
		};
	}

})();

teiConvertTools.precision = function (value, digits) {
	if (value === undefined || value === null || value === '')
		return '';
	if (!digits)
		return Math.round(value);
	var db = parseFloat(value);
	return Math.round10(db, - digits);
}

teiConvertTools.xlsxToTEI = function (data) {
	var workbook = XLSX.read(data, { type: 'binary' });
	var sheets = to_array(workbook);
	var initbloc = 0;
	var s = '<TEI><text><body>';
	for (var bk in sheets) {
		s += '<div type="sheet" xml:id="' + bk + '">';
		// names of columns
		var titles = [];
		for (var col = 0; col < sheets[bk][0].length; col++) {
			titles.push(sheets[bk][0][col]);
		}
		// detect initbloc
		if (titles[initbloc + 0] === 'media' && titles[initbloc + 1] === 'seconds')
			initbloc += 2;
		if (titles[initbloc + 0] === 'file' && (titles[initbloc + 1] === 'id' || titles[initbloc + 1] === 'ln'))
			initbloc += 2;
		for (var ln = 1; ln < sheets[bk].length; ln++) {
			if (sheets[bk][ln].length < initbloc + 4) continue;
			var who = xmlEntitiesEncode(sheets[bk][ln][initbloc + 0]);
			var ts = xmlEntitiesEncode(sheets[bk][ln][initbloc + 1]);
			var te = xmlEntitiesEncode(sheets[bk][ln][initbloc + 2]);
			var u = xmlEntitiesEncode(sheets[bk][ln][initbloc + 3]);
			s += '<annotationGrp who="';
			s += who + '"';
			if (ts) s += ' start="' + ts + '"';
			if (te) s += ' end="' + te + '"';
			s += '>';
			s += '<u>' + u + '</u>';
			if (sheets[bk][ln].length >= initbloc + 4) {
				s += '<spanGrp>';
				for (var row = initbloc + 4; row < sheets[bk][ln].length; row++) {
					s += '<span type="' + titles[row] + '">' + xmlEntitiesEncode(sheets[bk][ln][row]) + '</span>';
				}
				s += '</spanGrp>';
			}
			s += '</annotationGrp>';
		}
		s += '</div>';
	}
	return s + '</body></text></TEI>';
};

function decSpace(nb) {
	var s = '';
	for (var i = 0; i < nb; i++)
		s += '_';
	return s + ' ';
}

function printUttDocx(who, ts, te, v, dec, nl, format) {
	var s = '', v, loc;
	if (dec > 0) {
		v = decSpace(dec) + v;
		loc = decSpace(dec) + who;
	} else {
		loc = who;
	}
	if (format.indexOf(';tab;') >= 0) {
		if (format.indexOf(';time2;') >= 0)
			s = '<p>' + ts + '&#9;' + te + '&#9;' + loc + '&#9;' + xmlEntitiesEncode(v) + '</p>\n';
		else if (format.indexOf(';time1;') >= 0)
			s = '<p>' + ts + '&#9;' + loc + '&#9;' + xmlEntitiesEncode(v) + '</p>\n';
		else
			s = '<p>' + nl + '&#9;' + loc + '&#9;' + xmlEntitiesEncode(v) + '</p>\n';
	} else {
		// case ';table;'
		if (format.indexOf(';time2;') >= 0)
			s = '<tr><td>' + nl + '</td><td>' + loc + '</td><td>' + xmlEntitiesEncode(v) + '</td><td>' + ts + '</td><td>' + te + '</td></tr>\n';
		else if (format.indexOf(';time1;') >= 0)
			s = '<tr><td>' + nl + '</td><td>' + loc + '</td><td>' + xmlEntitiesEncode(v) + '</td><td>' + ts + '</td></tr>\n';
		else
			s = '<tr><td>' + nl + '</td><td>' + loc + '</td><td>' + xmlEntitiesEncode(v) + '</td></tr>\n';
	}
	return s;
}

function printUttTxt(who, ts, te, tx, nb, style) {
	if (style === 'bloc')
		return who.trim() + '\t' + ts + '\t' + te + '\t' + tx + '\n';
	else
		return nb + '\t' + who.trim() + '\t' + tx + '\t' + ts + '\t' + te + '\n';
}

teiConvertTools.teiToText = function (data) {
	var style = $('input:radio[name=paramtxt]:checked').val();
	// style === bloc or line
	var digits = $('#digitstxt').val();
	if (!digits || digits < 0 || digits > 15) digits = 0;
	var parser = new DOMParser();
	var xml = parser.parseFromString(data, "text/xml");
	trjs.template.readMediaInfo(xml);
	trjs.template.readPersons(xml);
	trjs.template.readTemplates(xml);
	var corpus = trjs.dataload.loadTEI(xml);
	var s = ''; // future result
	var nb = 0;
	for (var i = 0; i < corpus.length; i++) {
		if (corpus[i].type === 'loc')
			nb++;
		if (corpus[i].type === 'div')
			s += printUttTxt(corpus[i].loc.trim(), teiConvertTools.precision(corpus[i].ts, digits), teiConvertTools.precision(corpus[i].te, digits),
				nolines((trjs.dataload.checkstring(corpus[i].type) + ' | ' + trjs.dataload.checkstring(corpus[i].subtype)).trim()), nb, style);
		else
			s += printUttTxt(corpus[i].loc.trim(), teiConvertTools.precision(corpus[i].ts, digits), teiConvertTools.precision(corpus[i].te, digits), nolines(corpus[i].tx.trim()), nb, style);
	}
	return s;
};

teiConvertTools.teiToDocx = function (data, format) {
	var format = $('input:radio[name=paramdocx]:checked').val();
	var digits = $('#digitsdocx').val();
	if (!digits || digits < 0 || digits > 15) digits = 0;
	var parser = new DOMParser();
	var xml = parser.parseFromString(data, "text/xml");
	trjs.data.tiersxml = [];
	trjs.data.tiersdata = {};
	trjs.data.codesxml = [];
	trjs.data.codesdata = {};
	trjs.data.codesnames = {};
	trjs.data.persons = null;
	trjs.template.readMediaInfo(xml);
	trjs.template.readPersons(xml);
	trjs.template.readTemplates(xml);
	var corpus = trjs.dataload.loadTEI(xml);
	var s = teiConvertTools.tableToDocx(corpus, format, digits);
	return s;
}

teiConvertTools.tableToDocx = function (corpus, format, digits) {
	if (!digits || digits < 0 || digits > 15) digits = 0;
	var s = ''; // result
	var dec = 0, nb = 0;
	var prevTe = -1;
	if (format.indexOf(';tab;') >= 0) {
		s = '<!DOCTYPE html><html><body>';
	} else {
		s = '<!DOCTYPE html><html><head><style>td {vertical-align:top;}</style></head><body><table>';
	}
	if (format.indexOf(';overlap;') >= 0)
		s += teiConvertTools.teiToDocxOverlap(corpus, format);
	else
		if (format.indexOf(';header;') >= 0) {
			var d;
			var p = trjs.template.tablePersons();
			for (var d in p) {
				s += '<p>' + '[person]';
				if (p[d].Id) s += ' id: ' + p[d].Id + ' :-: ';
				if (p[d].Name) s += ' name: ' + p[d].Name + ' :-: ';
				if (p[d].Age) s += ' age: ' + p[d].Age + ' :-: ';
				if (p[d].Role) s += ' role: ' + p[d].Role + ' :-: ';
				s += '</p>';
			}
			var t = trjs.template.tableTemplates();
			for (d in t.codes) {
				s += '<p>' + '[code] code: ' + t.codes[d].code + ' :-: ';
				if (trjs.data.codesnames[t.codes[d].code]) s += ' name: ' + trjs.data.codesnames[t.codes[d].code] + ' :-: ';
				s += ' type: ' + t.codes[d].type + ' :-: ' + ' parent: ' + t.codes[d].parent + ' :-: ' + ' </p>';
			}
			for (d in t.tiers) {
				s += '<p>' + '[tier] code: ' + t.tiers[d].code + ' :-: ' + ' type: ' + t.tiers[d].type + ' :-: ' + ' parent: ' + t.tiers[d].parent + ' :-: ' + '</p>';
			}
			if (trjs.data.recordingPlaceName())
				s += '<p>' + '[place] ' + trjs.data.recordingPlaceName() + '</p>';
			if (trjs.data.media)
				for (var i = 0; i < trjs.data.media.length; i++) {
					s += '<p>' + '[media] ' + trjs.data.media[i].loc + '/' + trjs.data.media[i].name + ' :-: '
						+ mimeType(trjs.data.media[i].name, trjs.data.media[i].type) + '</p>';
				}
		}
	for (var i = 0; i < corpus.length; i++) {
		// corpus : arrayof {loc: loc, ts: ts, te: te, tx: tx, type: ('loc' or 'prop')}
		if (corpus[i].type === 'loc')
			nb++;
		/*
		if (corpus[i].ts !== '' && corpus[i].te !== '' && corpus[i].ts < prevTe)
			dec += shiftSize;
		else
			dec = 0;
		*/
		if (corpus[i].type === 'div')
			s += printUttDocx('[' + corpus[i].loc + ']', teiConvertTools.precision(corpus[i].ts, digits), teiConvertTools.precision(corpus[i].te, digits),
				nolines((trjs.dataload.checkstring(corpus[i].tx) + ' | ' + trjs.dataload.checkstring(corpus[i].stx)).trim()), dec, nb, format);
		else {
			prevTe = corpus[i].te; // do not set this if this is a div time
			s += printUttDocx(corpus[i].loc, teiConvertTools.precision(corpus[i].ts, digits), teiConvertTools.precision(corpus[i].te, digits),
				nolines(corpus[i].tx.trim()), dec, nb, format);
		}
	}
	if (format.indexOf(';tab;') >= 0) {
		s += '</body></html>';
	} else {
		s += '</table></body></html>';
	}
	// var orientation = document.querySelector('.page-orientation input:checked').value;
	// orientation is portrait or landspace
	var converted = htmlDocx.asBlob(s, { orientation: "portrait" });
	return converted;
};

/**
 * a version of tei to docx that allows to print in specific format overlaps
 */
teiConvertTools.teiToDocxOverlap = function (utterances, format) {
	var s = '', i, nl;

	/* now for turns, it is necessary to first comptute the overlap
	*  then sum turns if necessary and then print
	*/
	var pattern = decSpace(shiftSize);
	for (i = 0; i < utterances.length; i++) {
		var decal = false;
		if (i > 0 && utterances[i].ts !== '' && utterances[i - 1].te !== '' && utterances[i].ts < utterances[i - 1].te)
			decal = true;
		else if (i < utterances.length - 1 && utterances[i].te !== '' && utterances[i + 1].ts !== '' && utterances[i].te > utterances[i + 1].ts)
			decal = true;
		if (decal === true) {
			utterances[i].loc = pattern + utterances[i].loc;
		}
	}

	var utterancesOrTurns;
	if (format.indexOf(';turn;') >= 0) {
		utterancesOrTurns = [];
		var prevWho = '-', prevTs = 0, prevTe = 0, sumUtts = '';
		nl = 0;
		for (i = 0; i < utterances.length; i++) {
			// compute for overlap with turn display
			if (utterances[i].loc !== prevWho) {
				// flush data
				nl++;
				utterancesOrTurns.push({ nl: nl, loc: prevWho, tx: sumUtts, ts: prevTs, te: prevTe });
				prevWho = utterances[i].loc;
				prevTs = utterances[i].ts;
				prevTe = utterances[i].te;
				sumUtts = utterances[i].tx;
			} else {
				// add data
				prevTe = utterances[i].te;
				sumUtts += ' ' + utterances[i].tx;
			}
		}
	} else
		utterancesOrTurns = utterances;

	for (i = 0; i < utterancesOrTurns.length; i++) {
		nl = i + 1;
		if (utterancesOrTurns[i].loc.startsWith(pattern))
			utterancesOrTurns[i].tx = pattern + utterancesOrTurns[i].tx;
		if (format.indexOf(';tab;') >= 0) {
			s += '<p>' + /* nl + '&#9;' + */ utterancesOrTurns[i].loc + '&#9;' + nolines(utterancesOrTurns[i].tx) + '</p>\n';
		} else {
			s += '<tr><td>' + nl + '</td><td>' + utterancesOrTurns[i].loc + '</td><td>' + nolines(utterancesOrTurns[i].tx) + '</td></tr>\n';
		}
	}
	return s;
};

teiConvertTools.teiToTxm = function (teiname, destname, datafrom, callback1) {
	var params = " ";
	var valCT = $('input:checkbox[name=cleanline]:checked').val();
	if (valCT === 'on')
		params += ' -cleanline';
	var ul = $('#tvul').children();
	for (var i = 0; i < ul.length; i++) {
		var ptype = $(ul[i]).find('span.spantvtype').text();
		var pvaleur = $(ul[i]).find('span.spantvvaleur').text();
		params += ' ' + '-tv';
		params += ' ' + ptype + ':' + pvaleur;
	}
	system.call.teiToTxm(teiname, destname, datafrom, params, callback1);
}

teiConvertTools.teiToLexico = function (teiname, destname, datafrom, callback1) {
	var params = [];
	var valCT = $('input:checkbox[name=cleanline]:checked').val();
	if (valCT === 'on')
		params += ' -cleanline';
	var valSec = $('input:checkbox[name=sectionlex]:checked').val();
	if (valSec === 'on')
		params += ' -section';
	var ul = $('#tvul').children();
	for (var i = 0; i < ul.length; i++) {
		var ptype = $(ul[i]).find('span.spantvtype').text();
		var pvaleur = $(ul[i]).find('span.spantvvaleur').text();
		params += ' ' + '-tv';
		params += ' ' + ptype + ':' + pvaleur;
	}
	system.call.teiToLexico(teiname, destname, datafrom, params, callback1);
}
