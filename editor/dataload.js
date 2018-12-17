/**
 * dataload.js
 * loading the teiml files into memory as an array
 * @module dataload
 * @author Christophe Parisse
 * date February 2014
 */

'use strict';

if (typeof trjs === 'undefined')
     var trjs = {}
/*
trjs.data = require('./data.js');
trjs.template = require('./template.js');
*/

if (typeof trjs.log === 'undefined') {
     trjs.log = {}
	 trjs.log.alert = function(s) { console.log(s) };
	 trjs.log.boxalert = function(s) { console.log('BOX: ' + s) };
}

trjs.dataload = ( function() {

var loadTrans = [];
var lastStartTime = -1;
var lastEndTime = -1;

/**
 * convert XML to text format
 * @method xmlEntityDecode
 * @param xml coded text
 * @return plain text
 */
function xmlEntityDecode(texte) {
	texte = texte.replace(/&quot;/g,'"'); // 34 22
	texte = texte.replace(/&amp;/g,'&'); // 38 26
	texte = texte.replace(/&#39;/g,"'"); // 39 27
	texte = texte.replace(/\&lt\;/g,'<'); // 60 3C
	texte = texte.replace(/\&gt\;/g,'>'); // 62 3E
	//texte = texte.replace(/&circ;/g,'^'); // 94 5E
	//texte = texte.replace(/\n/g,'<br/>'); // 94 5E
	return texte;
}

/**
 * return text content without problematic < and > OR NOT
 * @method transcriptDecoding
 * @param DOMobject
 * @return {string} content
 */
function transcriptDecoding(s) {
/*     var elts = $(s).contents(), k = '';
    if (elts.length < 1) {
		// console.log(s);
		// console.log($(s));
		// console.log(s.toString());
		if (s.nodeType === 1)
			k = s.outerHTML;
		else
			k = s.textContent;
    } else
        for (var i = 0; i < elts.length; i++) {
            var x = elts[i];
            // console.log("TagName " + "[" + i + "]" + elts[i].tagName);
            // console.log("NodeName " + "[" + i + "]" + elts[i].nodeName); // ok pour elt et #text pour text
            // console.log("LocaName " + "[" + i + "]" + elts[i].localName);
            // console.log("Type " + "[" + i + "]" + elts[i].nodeType); // 1 pour elt et 3 pour text
			// console.log("Text " + "[" + i + "]" + $(elts[i]).html());
            if (elts[i].nodeType === 3) {
                k += elts[i].textContent;
			} else {
				k += elts[i].outerHTML;
			}
		}
 */	
	// console.log(s);
	var k;
	if (typeof(s) === 'string')
		k = s;
	else if (s.nodeType === 1)
		k = s.outerHTML;
	else if (s.nodeType === 3)
		k = s.textContent;
	else
		k = String(s);
	// console.log(k);
	k = k.replace(/</g, trjs.data.leftBracket); // 60 3C
	k = k.replace(/>/g, trjs.data.rightBracket); // 62 3E
	k = k.replace(/ xmlns=.http...www.tei.c.org.ns.1.0./, ""); // remove namespace information
	return k;
}

/**
 * if a number is null convert to 0.0
 * if it is an empty string or null return empty string
 * @method checknumber
 * @param {integer} integer or null or undefined
 * @return {string/integer} correct integer or empty string
 */
function checknumber(n) {
	n = parseFloat(n);
	if (isNaN(n))
		return '';
	else
		return n;
}

/**
 * if a string is null convert to '' and trim the line
 * @method checkstring
 * @param {string} string or null or undefined
 * @return {string} correct string
 */
var checkstring = function(s) {
	return (!s) ? '' : (s.trim) ? s.trim() : s;
}

/**
 * if a string is null convert to ''
 * @method checkstring0
 * @param {string} string or null or undefined
 * @return {string} correct string
var checkstring0 = function(s) {
	return (!s) ? '' : s;
}
 */

/**
 * find the text corresponding to a div
 * @method findTextOf
 * @param {string} content of div id
 */
function findTextOf(d) {
	for (var i = 0; i < trjs.data.textDesc.length; i++) {
		//console.log(d);
		//console.log(trjs.data.textDesc[i]);
		//console.log(trjs.data.textDesc[i]['text']);
		if (d === trjs.data.textDesc[i]['xml_id'])
			return trjs.data.textDesc[i]['text'];
	}
	return '';
}

/**
 * starts a set of functions for the last version of TEIML/TEI_CORPO format
 * contains loadU, loadannotationBlock, loadSimpleU, loadDiv
 */

/**
 * add a line of transcript (for a locutor: main lines) in the data table
 * @method addLineOfTranscript
 * @param data to be incremented
 * @param current size of data
 * @param loc of annotationBlock
 * @param time start of annotationBlock
 * @param time end of annotationBlock
 * @param text of transcript
 * @param prop line or main line
 * @return new size of data
 */
function addLineOfTranscript(loc, ts, te, elt, prop) {
	if (ts === null) ts = '';
	if (te === null) te = '';
	if (elt === null) elt = '';
    lastStartTime = ts;
    lastEndTime = te;
	loadTrans.push({loc: loc, ts: ts, te: te, tx: elt, type: prop});
}

/**
 * load an utterance from XML data (version 0.3)
 * @method loadUIsolated (an isolated u has start and end whereas an u inside an annotationBlock has not)
 * @param xml information for the element
 */
function loadUIsolated(utt) {
    /* main orthographic line */
	var utts = $(utt);
	/* user and time information */
	var ts = checknumber(timelineRef(utts.attr("start")));
	var te = checknumber(timelineRef(utts.attr("end")));
	var loc = checkstring(utts.attr("who"));
	if (loc !== '') trjs.data.codesdata[loc] = true;
	// names of the locutors found in the transcript in case persons description is incomplete
    lastEndTime = ts; // time of the previous end of an element, even if no element processed yet
    var elt = loadUSeg('', utts[0], ts, te, loc, 'loc');
    addLineOfTranscript(loc, lastEndTime, te, elt, 'loc');
}

function getDesc(node) {
	var e = '';
	var edesc = $(node).find('desc');
	for (var j=0; j<edesc.length; j++, e += ' ') {
		e += transcriptDecoding(edesc[j]);
	}
	return e;
}

/**
 * load an utterance from XML data (version 0.3)
 * @method loadUSeg (loads also seg)
 * @param data to be incremented
 * @param dom information for the element
 * @param time start of annotationBlock
 * @param time end of annotationBlock
 * @param loc of annotationBlock
 * @return new size of data
 */
function loadUSeg(elt, seg, ts, te, loc, prop) {
	if (ts && parseFloat(ts) < trjs.data.maxLinkingTime) trjs.data.maxLinkingTime = parseFloat(ts);
	if (te && parseFloat(te) < trjs.data.maxLinkingTime) trjs.data.maxLinkingTime = parseFloat(te);
	var childs = $(seg).contents(); // mixed nodes
	console.log(seg);
    lastEndTime = ts; // time of the previous end of an element, even if no element processed yet
    var reg = new RegExp("[\n\r]","g");
	for (var i = 0; i < childs.length; i++) {
		var type = childs[i].nodeType;
        var a, e;
		if (type === 1) { // NODE
	    	if (childs[i].tagName === 'seg') {
				var type = $(childs[i]).attr("type");
				if (type === 'lexical' || type === 'language' || type === 'API') {
					elt += loadSegContent(childs[i]);
				} else {
					var internalSeg = loadUSeg(elt, childs[i], lastEndTime, te, prop); // a seg inside a u or a seg
					if (elt === '')
						elt = internalSeg;
					else
						elt += ' ' + internalSeg.replace(reg, "");
				}
	    	} else if (childs[i].tagName === 'anchor') {
    			var t = timelineRef($(childs[i]).attr('synch'));
    			if (t === lastEndTime && elt === '') // start of utterance : ignored
    				continue; // nothing to if begining of utterance and empty element
                // terminates the current element and start a new one
                addLineOfTranscript(loc, lastEndTime, t, elt, prop);
    			lastEndTime = t; // break in the utterance : reset start
                elt = '';
			} else if (childs[i].nodeName === 'choice') {
				elt += loadChoiceContent(childs[i]);
			} else if (childs[i].nodeName === 'rs') {
				elt += loadRSContent(childs[i]);
			} else if (childs[i].nodeName === 'incident') {
				elt += loadIncidentContent(childs[i]);
			} else if (childs[i].nodeName === 'vocal') {
				// elt += trjs.data.leftCode + getDesc(childs[i]).replace(reg, "") + ' /VOC' + trjs.data.rightCode;
				elt += loadVocalContent(childs[i]);
			} else if (childs[i].nodeName === 'kinesic') {
				// elt += trjs.data.leftCode + getDesc(childs[i]).replace(reg, "") + ' /GES' + trjs.data.rightCode;
				elt += loadKinesicContent(childs[i]);
    		} else if (childs[i].nodeName === 'format') {
				if ($(childs[i]).attr('type') === 'italics') {
		    		a = transcriptDecoding(childs[i]);
					elt += '<i>' + a.replace(reg, "") + '</i>';
				} else if ($(childs[i]).attr('type') === 'red') {
		    		a = transcriptDecoding(childs[i]);
					elt += '<span class="format-red">' + a.replace(reg, "") + '</span>';
				} else {
		    		a = transcriptDecoding(childs[i]);
					elt += '<b>' + a.replace(reg, "") + '</b>';
				}
			} else if (childs[i].nodeName === 'pause') {
				if ($(childs[i]).attr('type') === 'short') {
			    	elt += ' # ';
				} else if ($(childs[i]).attr('type') === 'long') {
			    	elt += ' ## ';
				} else if ($(childs[i]).attr('type') === 'verylong') {
			    	elt += ' ### ';
				} else if ($(childs[i]).attr('type') === 'chrono') {
					var dur = $(childs[i]).attr('dur');
					if (dur)
				    	elt += ' #' + dur + ' ';
				    else
				    	elt += ' # ';
				} else {
			    	elt += ' # ';
				}
				/*
				if ($(childs[i]).attr('type') === 'short') {
			    	elt += ' (.) ';
				} else if ($(childs[i]).attr('type') === 'long') {
			    	elt += ' (..) ';
				} else if ($(childs[i]).attr('type') === 'verylong') {
			    	elt += ' (...) ';
				} else if ($(childs[i]).attr('type') === 'chrono') {
					var dur = $(childs[i]).attr('dur');
					if (dur)
				    	elt += ' (' + dur + ') ';
				    else
				    	elt += ' (.) ';
				} else {
			    	elt += ' (.) ';
				}
				*/
			} else if (childs[i].nodeName !== 'span') {
	    		a = transcriptDecoding(childs[i]);
				elt += ' ' + a.replace(reg, "");
			}
		} else if (type === 3) { // TEXT
    		a = transcriptDecoding(childs[i]);
            if (elt === '')
                elt = a;
            else
    			elt += ' ' + a.replace(reg, "");
		}
	}
    /* special format consideration span within u ???
    */
	for (var i = 0; i < childs.length; i++) {
		if (childs[i].nodeType === 1) {
	    	if (childs[i].tagName === 'span') {
			    var spanElt = loadUSeg('', childs[i], ts, te, $(childs[i]).attr('type'), prop); // a seg inside a u or a seg
                if (spanElt) {
                    addLineOfTranscript(loc, lastEndTime, te, elt, 'loc');
                }
	    	}
	    }
	}

    // flush last
   	elt = elt.trim();
	return elt;
}

function loadSpanGrp(spangrp, loc) {
    /* type information */
	var type = checkstring($(spangrp).attr("type"));
    var postsoftware = '';
    if (type !== '') {
        if (type === 'ref') {
            postsoftware = "pos:" + checkstring($(spangrp).attr("inst"));
        }
        trjs.data.tiersdata[type] = true;	// add this to the template in case it is not declared as normal template
        trjs.data.dependency[type] = loc;    // creation of a relation between speaker and type
    }
	var childs = $(spangrp).children();
	for (var i = 0; i < childs.length; i++) {
        if (childs[i].tagName === 'span') {
            /* type and time information */
            var tsx = checknumber(timelineRef($(childs[i]).attr("from")));
            var tex = checknumber(timelineRef($(childs[i]).attr("to")));
            loadSpan(childs[i], tsx, tex, type, postsoftware); // loads either the span
        } else {
            // this should not happen within the limits of TEICORPO
			trjs.log.alert('loadSpanGrp: unknown nodeName: ' + childs[i].tagName + ' type: ' + childs[i].nodeType);
        }
	}
}

function loadSpan(span, from, to, type, postsoftware) {
    var i;
	if (type === 'ref') {
		// console.log(span);
		var ws = $(span).find('w');
		var s = '';
		// console.log(ws, span.innerHTML);
        for (i = 0; i < ws.length; i++) {
        	// console.log(ws[i]);
            // console.log(ws[i].innerHTML);
            var p = $(ws[i]).attr('pos');
            var l = $(ws[i]).attr('lemma');
            var t = $(ws[i]).text();
            // console.log(t,p,l);
            s += p + '|' + t + '{' + l + '} ';
        }
        addLineOfTranscript(postsoftware, from, to, s, 'prop');
		return;
	}
    /* type information */
	var spanType = $(span).attr('type');
	if (spanType)
	    addLineOfTranscript(type, from, to, trjs.data.leftEvent + spanType + '/INF' + trjs.data.rightEvent + ' ' + transcriptDecoding(span), 'prop');
	else
    	addLineOfTranscript(type, from, to, transcriptDecoding(span), 'prop');
	var childs = $(span).children();
	for (i = 0; i < childs.length; i++) {
        if (childs[i].tagName === 'spanGrp') {
            loadSpanGrp(childs[i], type); // loads either the span
        } else if (childs[i].nodeType !== 3) {
            // this should not happen with the limits of TEI CORPO
			trjs.log.alert('loadSpan: unknown nodeName: ' + childs[i].tagName + ' type: ' + childs[i].nodeType);
        }
	}
}

/**
 * load an utterance from XML data (version 0.3)
 * @method loadannotationBlock
 * @param xml information for the element
 * @return new size of data
 */
function loadannotationBlock(utt) {
    /* main orthographic line */
	var utts = $(utt);
	/* user and time information */
    // console.log("ts: " + utts.attr("start"));
    // console.log("tsx: " + ts);
	var ts = checknumber(timelineRef(utts.attr("start")));
	var te = checknumber(timelineRef(utts.attr("end")));
    lastEndTime = ts; // time of the previous end of an element, even if no element processed yet
	var loc = checkstring(utts.attr("who"));
	if (loc !== '') trjs.data.codesdata[loc] = true;
	// names of the locutors found in the transcript in case persons description is incomplete
    /* segments contain u and anchors */
    var tmp = utts.find("u");
    if (!tmp || tmp.length < 1) { // no u found
    	tmp = utts.find("note");
    	if (tmp && tmp.length > 0) {
    		var tr = $(tmp[0]).attr('type');
    		var ty = $(tmp[0]).text();
//			'<table><tr><td class="notetxt ttype">' + tr + '</td><td class="notetxt tsubtype">' + ty + '</td></tr></table>';
            loadTrans.push({loc: "+note+", ts: '', te: '', tx: (tr ? tr : ''), stx: ty, type: 'note'});
    	}
    } else {
	    var elt = loadUSeg('', tmp[0], ts, te, loc, 'loc');
        addLineOfTranscript(loc, lastEndTime, te, elt, 'loc');
    }
    /* tiers lines */
    /* for now because it is not final:
     * read u and spanGrp
     */
	var childs = utts.children();
    for (var spg=0; spg < childs.length; spg++) {
        if (childs[spg].nodeName === 'spanGrp')
            loadSpanGrp(childs[spg], loc);
    }
}

// elt += trjs.data.leftCode + getDesc(childs[i]).replace(reg, "") + ' /GES' + trjs.data.rightCode;

function loadSegContent(inc) {
	var e = trjs.data.leftCode;
	var t = $(inc).find('desc').text();
	if (t === '') t = $(inc).text();
	e += ' ' + t + '/';
	switch($(inc).attr('type')) {
		case 'API':
			e += 'API';
			break;
		case 'language':
			e += 'LG';
			var f = $(inc).attr('subtype');
			if (f) e += ':' + f;
			break;
		case 'lexical':
			e += 'LEX';
			break;
		default:
			e += $(inc).attr('type');
			break;
	}
	e += trjs.data.rightCode;
	return e;
}

function loadVocalContent(inc) {
	var t = $(inc).find('desc').text();
	if (t === '') t = $(inc).text();
	var a = $(inc).attr('type');
	if (a) {
		return trjs.data.leftCode + t + ' /' + a + ' /VOC' + trjs.data.rightCode;
	} else {
		return trjs.data.leftCode + t + ' /VOC' + trjs.data.rightCode;
	}
}

function loadKinesicContent(inc) {
	var t = $(inc).find('desc').text();
	if (t === '') t = $(inc).text();
	var a = $(inc).attr('type');
	if (a) {
		return trjs.data.leftEvent + t + ' /' + a + ' /GES' + trjs.data.rightEvent;
	} else {
		return trjs.data.leftEvent + t + ' /GES' + trjs.data.rightEvent;
	}
}

function loadRSContent(inc) {
	var t = $(inc).find('desc').text();
	if (t === '') t = $(inc).text();
	var a = $(inc).attr('type');
	var b = $(inc).attr('subtype');
	if (a === 'entities') {
		return trjs.data.leftEvent + t + (b ? ' /' + b : '') + ' /NE' + trjs.data.rightEvent;
	} else {
		return trjs.data.leftEvent + t + (b ? ' /' + b : '') + ' /' + a + trjs.data.rightEvent;
	}
}

function loadIncidentContent(inc) {
	var e = trjs.data.leftEvent;
	var t = $(inc).find('desc').text();
	if (t === '') t = $(inc).text();
	e += ' ' + t + '/';
	switch($(inc).attr('type')) {
		case 'noise':
			var f = $(inc).attr('subtype');
			if (f) e += f + '/';
			e += 'N';
			break;
		case 'comment':
			e += 'COM';
			break;
		case 'background':
			e += 'B';
			break;
		case 'para':
			var f = $(inc).attr('subtype');
			if (f) e += f + '/';
			e += 'PE';
			break;
		default:
			e += $(inc).attr('type');
			break;
	}
	e += trjs.data.rightEvent;
	return e;
}

function loadChoiceContent(inc) {
	var content = $(inc).find('abbr');
	if (content.length > 0) {
		var value = $(inc).find('expan').text();
		var attr = $(content).attr('type');
		if (attr === 'acronym') {
			return trjs.data.leftCode + content.text() + '/' + value + '/A' + trjs.data.rightCode;
		}
		return trjs.data.leftCode + content.text() + '/' + value + '/ABBR' + trjs.data.rightCode;
	}
	content = $(inc).find('orig');
	if (content.length > 0) {
		var value = $(inc).find('reg').text();
		if (value) {
			var attr = $(inc).attr('type');
			if (attr === 'pho')
				return trjs.data.leftCode + content.text() + '/' + value + '/VARPHO' + trjs.data.rightCode;
			else
				return trjs.data.leftCode + content.text() + '/' + value + '/VAR' + trjs.data.rightCode;
		}
		return trjs.data.leftCode + content.text() + '/' + value + '/ORIG' + trjs.data.rightCode;
	}
	content = $(inc).find('seg');
	// console.log('find seg', content);
	if (content.length > 0) {
		var s = trjs.data.leftCode;
		for (var i=0 ; i < content.length; i++) {
			s += $(content[i]).text();
			if (i !== content.length - 1) s += ',';
		}
		return s + ' /C' + trjs.data.rightCode;
	}
	return trjs.data.leftCode + $(inc).text() + '/CHOICE' + trjs.data.rightCode;
}

/**
 * load a div from XML data (version 0.4 & 0.5 & 0.6 & 0.7)
 * @method loadDiv
 * @param xml information for the element
 * @return new size of data
 */
function loadDiv(div, body) {
//	try {
		var divs = $(div), ts, te;
        if (!body) {
            var head = divs.find('head');
            var ty = '', st = '', t;
            if (head.length > 0) {
                var note = $(head[0]).find('note');
                // console.log(note);
                for (var n=0; n<note.length; n++) {
                    // console.log(note[n]);
                    if ($(note[n]).attr("type") === 'start') ts = checknumber(timelineRef($(note[n]).text()));
                    if ($(note[n]).attr("type") === 'end') te = checknumber(timelineRef($(note[n]).text()));
                    if ($(note[n]).attr("type") === 'air_date') st = $(note[n]).text();
                    if ($(note[n]).attr("type") === 'program') ty = $(note[n]).text();
                }
            } else {
                ts = '';
                te = '';
            }
            t = trjs.utils.notnull(divs.attr("type"));
            if (ty !== '' && t !== '')
                ty = t + ' ' + ty;
            else if (ty === '')
                ty = t;
            t = trjs.utils.notnull(divs.attr("subtype"));
            if (t !== '') {
                if (trjs.data.textDesc != null)
                    t = findTextOf(t);
            }
            if (st !== '' && t !== '')
                st = t + ' ' + ty;
            else if (st === '')
                st = t;
            loadTrans.push({loc: "+div+", ts: ts, te: te, tx: ty, stx: st, type: 'div'});
        }
		var elts = divs.children();
		// copy the data from XML to container
		for (var i = 0; i < elts.length; i++) {
			//console.log("TagName " + "[" + i + "]" + elts[i].tagName);
			//console.log("NodeName " + "[" + i + "]" + elts[i].nodeName); // ok pour elt et #text pour text
			//console.log("LocaName " + "[" + i + "]" + elts[i].localName);
			//console.log("Type " + "[" + i + "]" + elts[i].nodeType); // 1 pour elt et 3 pour text
			//console.log("Text " + "[" + i + "]" + $(elts[i]).html());
			if (elts[i].nodeName === 'div')
				loadDiv(elts[i]);
			else if (elts[i].nodeName === 'annotationGrp' || elts[i].nodeName === 'annotationBlock')
				loadannotationBlock(elts[i]);
			else if (elts[i].nodeName === 'u')
				loadUIsolated(elts[i]);
			else if (elts[i].nodeName === 'incident') {
	    		// e += ' ' + $(elts[i]).text();
				var e = loadIncidentContent(elts[i]);
                ts = checknumber(timelineRef($(elts[i]).attr("start")));
                te = checknumber(timelineRef($(elts[i]).attr("end")));
				addLineOfTranscript('+incident+', ts, te, e, 'note');
			} else if (elts[i].nodeName === 'pause') {
                var elt = '';
				if ($(elts[i]).attr('type') === 'short') {
			    	elt += ' (.)';
				} else if ($(elts[i]).attr('type') === 'long') {
			    	elt += ' (..)';
				} else if ($(elts[i]).attr('type') === 'verylong') {
			    	elt += ' (...)';
				} else if ($(elts[i]).attr('type') === 'chrono') {
					var dur = $(elts[i]).attr('dur');
					if (dur)
				    	elt += ' (' + dur + ')';
				    else
				    	elt += ' (.)';
				} else {
			    	elt += ' (.)';
				}
                ts = checknumber(timelineRef($(elts[i]).attr("start")));
                te = checknumber(timelineRef($(elts[i]).attr("end")));
				addLineOfTranscript('+pause+', ts, te, elt, 'note');
			} else if (elts[i].nodeName !== 'head') {
				trjs.log.alert('loadDiv: unknown nodeName: ' + elts[i].nodeName);
			}
		}
        if (!body)
	        loadTrans.push({loc: "-div-", ts: "", te: "", tx: "", stx: "", type: 'div'});
/*	} catch(e) {
		trjs.log.alert('catched error ' + e.toString());
		console.log('catched error ' + e.toString());
	}
*/
}

/**
 * indirect access to time reference using an id and the timeline
 * @method timelineRef
 * @param {string} name of reference to time
 * @returns {float} point in time
 */
var timelineRef = function(ref) {
	if (!trjs.data.idToTime) {
//		console.log('no timeline');
		trjs.log.alert('no timeline');
		return '';
	}
	if (ref !== '' && ref !== undefined && ref !== null) {
		var p = trjs.data.idToTime[ref.substr(1)];
		if (p === undefined) {
//			console.log('xml:id ' + ref + ' is unknown');
			trjs.log.alert('xml:id ' + ref + ' is unknown');
			ref = '';
		} else
			ref = p;
	}
	return ref;
};

/**
 * put time reference using an id to the timeline
 * @method timelineAdd
 * @param {float} point in time
 * @returns {string} name of reference to time
 */
var timelineAdd = function(val) {
    if (!trjs.data)
        trjs.data = {};
	if (!trjs.data.idToTime || !trjs.data.timeToId) {
        trjs.data.idToTime = {};
        trjs.data.timeToId = {};
        trjs.data.lastId = 1;
	}
    if (parseFloat(val) === 0.0)
        return 'tm0';
	if (val !== '' && val !== undefined && val !== null) {
        var exists = trjs.data.timeToId[val];
        if (exists) return exists;
        var newId = 'tm' + trjs.data.lastId;
        trjs.data.lastId++;
        trjs.data.idToTime[newId] = val;
        trjs.data.timeToId[val] = newId;
        return newId;
	}
	return null;
};

var timelineInit = function() {
    trjs.data.idToTime = {};
    trjs.data.timeToId = {};
    trjs.data.lastId = 1;
};

/**
 * conversion of a float into seconds according to the unit of time
 * @method convert_unit
 * @param {float} value of time in the unit
 * @param {string} unit of time
 * @returns {float} result in seconds
 */
var convert_unit = function(val, unit) {
	if (unit === 's')
		return val;
	else if (unit === 'ms')
		return val / 1000;
	else if (unit === 'min')
		return val * 60;
	else if (unit === 'h')
		return val * 60 * 60;
	else if (unit === 'd')
		return val * 60 * 60 * 24;
	else
		return val;
};

/**
 * load the timeline of a TEIML file (version 0.3/0.4/0.5/0.6)
 * @method loadTimeline
 */
var loadTimeline = function(doc) {
	// var text = trjs.data.doc.getElementsByTagName("timeline");
	var timeline = $(doc).find("timeline");
	if (!timeline)
		trjs.data.idToTime = null;
	else {
		var globalUnit = timeline.attr('unit');
		trjs.data.idToTime = {};
		// unit = d h min s ms
		var tmns = timeline.children();
		if (!tmns || tmns.length<1)
			trjs.data.idToTime = null;
		else {
			for (var i = 0; i < tmns.length; i++) {
				var a = $(tmns[i]).attr('absolute');
				if (a != null) {
					a = parseFloat(a);
					if (isNaN(a)) a = 0.0;
					var id = $(tmns[i]).attr('xml:id');
					var unit = $(tmns[i]).attr('unit');
					trjs.data.idToTime[id] = convert_unit(a, unit?unit:globalUnit);
				}
			}
			var rel = {};
			for (var i = 0; i < tmns.length; i++) {
				var a = $(tmns[i]).attr('interval');
				if (a != null) {
					a = parseFloat(a);
					if (isNaN(a)) a = 0.0;
					var id = $(tmns[i]).attr('xml:id');
					var unit = $(tmns[i]).attr('unit');
					var since = $(tmns[i]).attr('since');
					rel[id] = { unit: unit, interval: a, since: since.substr(1), };  // remove #
				}
			}
			for (var i in rel) {
				var w = trjs.data.idToTime[rel[i].since];
				if (w !== undefined)
					trjs.data.idToTime[i] = convert_unit(rel[i].interval-w, rel[i].unit?rel[i].unit:globalUnit);
				else {
					var x = i;
					var found = false;
					while (w === undefined) {
						x = rel[x];
						if (x === undefined)
							break;
						w = trjs.data.idToTime[rel[x].since];
						if (w !== undefined) {
							trjs.data.idToTime[x] = convert_unit(rel[x].interval-w, rel[x].unit?rel[x].unit:globalUnit, w);
							found = true;
							break;
						}
					}
					if (found === false) {
						trjs.log.alert('ID not found: ' + i);
						trjs.data.idToTime[i] = ''; // set a default time
					}
				}
			}
		}
	}
};

var loadTEI = function(doc) {
    loadTimeline(doc);
    // var text = trjs.data.doc.getElementsByTagName("text");
    var text = $(doc).find("text");
    if (!text) {
        // no text: creates a minimum of two lines.
        return null;
    }
    // var divs = text[0].childNodes;
    var divs = text.children();
    if (divs == null) {
        return null;
    }
    loadTrans = []; // [{loc:"", ts:"", te:"", tx:"", type:""}];
    var firstMessage = false;
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].nodeName === 'timeline')
            continue;
        if (divs[i].nodeName === 'div')
            loadDiv(divs[i]);
        else if (divs[i].nodeName === 'annotationGrp' || divs[i].nodeName === 'annotationBlock')
            loadannotationBlock(divs[i]);
        else if (divs[i].nodeName === 'u')
            loadUIsolated(divs[i]);
/*
        else if (divs[i].nodeName === 'lookEntry')
            trjsTable = loadLookEntry(trjsTable, divs[i]);
        else if (divs[i].nodeName === 'kwicEntry')
            trjsTable = loadKwicEntry(trjsTable, divs[i]);
        else if (divs[i].nodeName === 'lexEntry')
            trjsTable = loadLexEntry(trjsTable, divs[i]);
*/
        else if (divs[i].nodeName === 'body')
            loadDiv(divs[i], "body");
        else {
            if (firstMessage === false) {
                trjs.log.boxalert(trjs.messgs.errorformat + divs[i].nodeName);
                firstMessage = true;
            }
        }
    }
    return loadTrans;
};

return {
    checkstring: checkstring,
    checknumber: checknumber,
	loadTEI: loadTEI,
    timelineAdd: timelineAdd,
    timelineInit: timelineInit,
    timelineRef: timelineRef,
};
})();
