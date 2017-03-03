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

trjs.dataload05 = ( function() {

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
function transcriptDecoding(s, style) {
	var k = $(s).text(); // s.textContent;
    k = k.replace(/</g, trjs.data.leftBracket); // 60 3C
    k = k.replace(/>/g, trjs.data.rightBracket); // 62 3E
	return k;
}

/**
 * if a string is null convert to ''
 * @method checkstring
 * @param {string} string or null or undefined
 * @return {string} correct string
 */
var checkstring = function(s) {
    if (s && !s.trim) {
        console.log(s);
        return s;
    }
//	return (!s) ? '' : s.trim() ;
	return (!s) ? '' : s;
}

/**
 * if a string is null convert to ''
 * @method checkstring0
 * @param {string} string or null or undefined
 * @return {string} correct string
 */
var checkstring0 = function(s) {
	return (!s) ? '' : s;
}

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
 * starts a set of functions for a certain version of TEIML format
 * contains loadU05, loadannotationBlock05, loadSimpleU05, loadDiv05
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
function addLineOfTranscript(hot, loc, ts, te, elt, prop) {
	if (ts === null) ts = '';
	if (te === null) te = '';
	if (elt === null) elt = '';
	hot.push({loc: loc, ts: ts, te: te, tx: elt, type: prop});
	return hot;
}

/**
 * load an utterance from XML data (version 0.3)
 * @method loadU05Isolated (an isolated u has start and end whereas an u inside an annotationBlock has not)
 * @param data to be incremented
 * @param current size of data
 * @param xml information for the element
 * @return new size of data
 */
function loadU05Isolated(hot, utt) {
    /* main orthographic line */
	var utts = $(utt);
	/* user and time information */
	var ts = timelineRef(checkstring0(utts.attr("start")));
	var te = timelineRef(checkstring0(utts.attr("end")));
	var loc = checkstring(utts.attr("wh"));
	if (loc === '') loc = checkstring(utts.attr("who"));
	if (loc !== '' && !trjs.data.codesdata[loc]) trjs.data.codesdata[loc] = '-';
		// names of the locutors found in the transcript in case persons description is incomplete
    hot = loadUSeg05(hot, utts[0], ts, te, loc, false);
    return hot;
}

/**
 * load an utterance from XML data (version 0.3)
 * @method loadUSeg05 (loads also seg)
 * @param data to be incremented
 * @param current size of data
 * @param dom information for the element
 * @param time start of annotationBlock
 * @param time end of annotationBlock
 * @param loc of annotationBlock
 * @return new size of data
 */
function loadUSeg05(hot, seg, ts, te, loc, prop) {
	if (ts && parseFloat(ts) < trjs.data.maxLinkingTime) trjs.data.maxLinkingTime = parseFloat(ts);
	if (te && parseFloat(te) < trjs.data.maxLinkingTime) trjs.data.maxLinkingTime = parseFloat(te);
	var childs = $(seg).contents();
	if (childs.length === 1) {
		// var elt = transcriptDecoding(seg.length === undefined ? seg : seg[0]);
		var elt = transcriptDecoding(seg).trim();
    	return addLineOfTranscript(hot, loc, ts, te, elt, prop);
	} else if (childs.length <= 0) {
		// trjs.log.alert('loadSeg05A: no child elements');
		return addLineOfTranscript(hot, loc, ts, te, '', prop);
	}
	var segs = [];
	var psegs = -1;
	for (var i = 0; i < childs.length; i++) {
		var type = childs[i].nodeType;
		if (type === 1) {
	    	if (childs[i].tagName === 'seg') {
			    segs[i] = ({start:ts, end:te});
			    psegs = i;
			    // console.log('segs: '+i+' '+ts+' '+te);
	    	} else if (childs[i].tagName == 'anchor') {
    			var t = timelineRef($(childs[i]).attr('synch'));
    			if (t !== '' && t === ts) // start of utterance : ignored
    				continue; // nothing to if begining of utterance
    			if (psegs !== -1)
	    			segs[psegs].end = t; // reset the end of the previous segment
    			ts = t; // break in the utterance : reset start
    		}
	    	// ignore all others, including spans
		}
	}

	hot = loadPreparedUSeg05(hot, childs, ts, te, loc, segs, prop);  // return nHot value
	for (var i = 0; i < childs.length; i++) {
		if (childs[i].nodeType === 1) {
	    	if (childs[i].tagName === 'span') {
			    hot = loadUSeg05(hot, childs[i], ts, te, $(childs[i]).attr('type'), prop); // a seg inside a u or a seg
	    	}
	    }
	}

	return hot;
}

function loadPreparedUSeg05(hot, childs, ts, te, loc, segs, prop) {
    var elt = '', a, e;
    var lastStartTime = ts;
    var reg = new RegExp("[\n\r]","g");
	for (var i = 0; i < childs.length; i++) {
		var type = childs[i].nodeType;
		if (type === 1) {
	    	if (childs[i].tagName === 'seg' && segs[i]) {
			   	elt = elt.trim();
			    if (elt.length > 0) { // break in the utterance : flush the old element
    				hot = addLineOfTranscript(hot, loc, lastStartTime, segs[i].start, elt, prop);
				    elt = '';
				}
			    hot = loadUSeg05(hot, childs[i], segs[i].start, segs[i].end, loc, prop); // a seg inside a u or a seg
			    lastStartTime = segs[i].end;
	    	} else if (childs[i].tagName === 'anchor') {
   				continue;
			} else if (childs[i].nodeName === 'incident') {
				if ($(childs[i]).attr('type').toLowerCase() === 'event') {
					e = '[=! ' + $(childs[i]).attr('subtype');
			    	var edesc = $(childs[i]).children();
			    	for (var j=0; j<edesc.length; j++) {
			    		a = transcriptDecoding(edesc[j]);
			    		e += ' | ' + a.replace(reg, "");
			    	}
			    	elt += e + ' ]';
				} else {
		    		a = transcriptDecoding(childs[i]);
					elt += '[= ' + a.replace(reg, "") + ' ]';
				}
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
			    	elt += ' #';
				} else if ($(childs[i]).attr('type') === 'long') {
			    	elt += ' ##';
				} else if ($(childs[i]).attr('type') === 'verylong') {
			    	elt += ' ###';
				} else if ($(childs[i]).attr('type') === 'chrono') {
					var dur = $(childs[i]).attr('dur');
					if (dur)
				    	elt += ' #' + dur;
				    else
				    	elt += ' #';
				} else {
			    	elt += ' #';
				}
			} else if (childs[i].nodeName !== 'span') {
	    		a = transcriptDecoding(childs[i]);
				elt += ' ' + a.replace(reg, "");
			}
		} else if (type === 3) {
    		a = transcriptDecoding(childs[i]);
			elt += ' ' + a.replace(reg, "");
		}
	}
   	elt = elt.trim();
    if (elt.length > 0) {
		hot = addLineOfTranscript(hot, loc, lastStartTime===null ? ts : lastStartTime, te, elt, prop);
    }
	return hot;
}

function loadSpanGrp05(hot, spangrp, ts, te, loc, prop) {
	var childs = $(spangrp).children();
	for (var i = 0; i < childs.length; i++) {
		var type = childs[i].nodeType;
		if (type === 1) {
	    	if (childs[i].tagName === 'span') {
	    		/*
				var elt = transcriptDecoding(childs[i]);
			    var reg = new RegExp("[\n\r]","g");
			    elt = elt.replace(reg, "");
			    var attr = $(childs[i]).attr('type');
			    trjs.data.tiers[attr] = 1;	// add this to the template in case it is not declared as normal template
				hot[nHot] = {Locutor: attr, Ts: '', Te: '', VTs: '', VTe: '', Transcription: elt, Type:'prop'};
				nHot++;
				*/
			    var attr = $(childs[i]).attr('type');
			    if (attr !== '') trjs.data.tiersdata[attr] = true;	// add this to the template in case it is not declared as normal template
				hot = loadUSeg05(hot, childs[i], ts, te, attr, prop); // loads either a span, either a u
	    	}
	    	// ignore all others
		}
	}
	return hot;
}

/**
 * load an utterance from XML data (version 0.3)
 * @method loadannotationBlock05
 * @param data to be incremented
 * @param current size of data
 * @param xml information for the element
 * @return new size of data
 */
function loadannotationBlock05(hot, utt) {
    /* main orthographic line */
	var utts = $(utt);
	/* user and time information */
	var ts = timelineRef(checkstring0(utts.attr("start")));
	var te = timelineRef(checkstring0(utts.attr("end")));
	var loc = checkstring(utts.attr("wh"));
	if (loc === '') loc = checkstring(utts.attr("who"));
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
            hot.push({loc: "+note+", ts: '', te: '', tx: (tr ? tr : ''), stx: ty, type: 'note'});
    	}
    } else
	    hot = loadUSeg05(hot, tmp[0], ts, te, loc, 'loc');
    /* tiers lines */
    /* for now because it is not final:
     * read u and spanGrp
     */
	var childs = utts.find('spanGrp');
	if (childs && childs.length>0)
	    hot = loadSpanGrp05(hot, childs, ts, te, loc, 'prop');
	return hot;
}

/**
 * load a div from XML data (version 0.4 & 0.5 & 0.6 & 0.7)
 * @method loadDiv05
 * @param data to be incremented
 * @param current size of data
 * @param xml information for the element
 * @return new size of data
 */
function loadDiv05(hot, div, body) {
//	try {
		var divs = $(div), ts, te;
        if (!body) {
            ts = timelineRef(checkstring0(divs.attr("start")));
            te = timelineRef(checkstring0(divs.attr("end")));
            var ty = divs.attr("type");
            if (!ty) ty = '';
            var st = divs.attr("subtype");
            if (st != null && trjs.data.textDesc != null)
                st = findTextOf(st);
            else
                st = '';

            // ty = '<table><tr><td class="divtxt ttype">' + ty + '</td><td class="divtxt tsubtype">' + st + '</td></tr></table>';
            hot.push({loc: "+div+", ts: ts, te: te, tx: ty, stx: st, type: 'div'});
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
				hot = loadDiv05(hot, elts[i]);
			else if (elts[i].nodeName === 'annotatedU' || elts[i].nodeName === 'annotationGrp' || elts[i].nodeName === 'annotationBlock')
				hot = loadannotationBlock05(hot, elts[i]);
			else if (elts[i].nodeName === 'u')
				hot = loadU05Isolated(hot, elts[i]);
			else if (elts[i].nodeName === 'incident') {
				var e = '[' + $(elts[i]).attr('type') + '] ';
	    		e += ' ' + transcriptDecoding(elts[i]);
	    		// e += ' ' + $(elts[i]).text();
				ts = checkstring0($(elts[i]).attr("start"));
				te = checkstring0($(elts[i]).attr("end"));
				hot = addLineOfTranscript(hot, '+incident+', ts, te, e, 'note');
			} else if (elts[i].nodeName === 'pause') {
                var elt = '';
				if ($(elts[i]).attr('type') === 'short') {
			    	elt += ' #';
				} else if ($(elts[i]).attr('type') === 'long') {
			    	elt += ' ##';
				} else if ($(elts[i]).attr('type') === 'verylong') {
			    	elt += ' ###';
				} else if ($(elts[i]).attr('type') === 'chrono') {
					var dur = $(elts[i]).attr('dur');
					if (dur)
				    	elt += ' #' + dur;
				    else
				    	elt += ' #';
				} else {
			    	elt += ' #';
				}
				ts = checkstring0($(elts[i]).attr("start"));
				te = checkstring0($(elts[i]).attr("end"));
				hot = addLineOfTranscript(hot, '+pause+', ts, te, elt, 'note');
			} else {
				trjs.log.alert('loadDiv05: unknown nodeName: ' + elts[i].nodeName);
			}
		}

//	 	hot.push({loc: "-div-", ts: "", te: "", tx: "", type: 'div'});
		//console.log("End div " + "[" + te + "]");
		return hot;
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
 * @retunr {float} point in time
 */
var timelineRef = function(ref) {
	if (!trjs.data.abs) {
//		console.log('no timeline');
		trjs.log.alert('no timeline');
		return '';
	}
	if (ref !== '') {
		var p = trjs.data.abs[ref.substr(1)];
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
		trjs.data.abs = null;
	else {
		var globalUnit = timeline.attr('unit');
		trjs.data.abs = {};
		// unit = d h min s ms
		var tmns = timeline.children();
		if (!tmns || tmns.length<1)
			trjs.data.abs = null;
		else {
			for (var i = 0; i < tmns.length; i++) {
				var a = $(tmns[i]).attr('absolute');
				if (a != null) {
					a = parseFloat(a);
					if (isNaN(a)) a = 0.0;
					var id = $(tmns[i]).attr('xml:id');
					var unit = $(tmns[i]).attr('unit');
					trjs.data.abs[id] = convert_unit(a, unit?unit:globalUnit);
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
				var w = trjs.data.abs[rel[i].since];
				if (w !== undefined)
					trjs.data.abs[i] = convert_unit(rel[i].interval-w, rel[i].unit?rel[i].unit:globalUnit);
				else {
					var x = i;
					var found = false;
					while (w === undefined) {
						x = rel[x];
						if (x === undefined)
							break;
						w = trjs.data.abs[rel[x].since];
						if (w !== undefined) {
							trjs.data.abs[x] = convert_unit(rel[x].interval-w, rel[x].unit?rel[x].unit:globalUnit, w);
							found = true;
							break;
						}
					}
					if (found === false) {
						trjs.log.alert('ID not found: ' + i);
						trjs.data.abs[i] = ''; // set a default time
					}
				}
			}
		}
	}
};

var loadTEI05 = function(doc) {
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
    var trjsTable = []; // [{loc:"", ts:"", te:"", tx:"", type:""}];
    var firstMessage = false;
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].nodeName === 'timeline')
            continue;
        if (divs[i].nodeName === 'div')
            trjsTable = loadDiv05(trjsTable, divs[i]);
        else if (divs[i].nodeName === 'annotatedU' || divs[i].nodeName === 'annotationGrp' || divs[i].nodeName === 'annotationBlock')
            trjsTable = loadannotationBlock05(trjsTable, divs[i]);
        else if (divs[i].nodeName === 'u')
            trjsTable = loadU05Isolated(trjsTable, divs[i]);
/*
        else if (divs[i].nodeName === 'lookEntry')
            trjsTable = loadLookEntry(trjsTable, divs[i]);
        else if (divs[i].nodeName === 'kwicEntry')
            trjsTable = loadKwicEntry(trjsTable, divs[i]);
        else if (divs[i].nodeName === 'lexEntry')
            trjsTable = loadLexEntry(trjsTable, divs[i]);
*/
        else if (divs[i].nodeName === 'body')
            trjsTable = loadDiv05(trjsTable, divs[i], "body");
        else {
            if (firstMessage === false) {
                trjs.log.boxalert(trjs.messgs.errorformat + divs[i].nodeName);
                firstMessage = true;
            }
        }
    }
    return trjsTable;
};

return {
	loadTEI05: loadTEI05,
};
})();
