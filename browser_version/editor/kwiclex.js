/**
 * <p>Tools for displaying concordances and lexicon</p>
 * date: june 2014
 * @module Kwiclex
 * @author Christophe Parisse
 */

trjs.kwiclex = ( function() {

/**
 * @method setInitParam
 */
function setInitParam() {
	$('#backward-step').val(trjs.param.backwardskip*1000);
	$('#forward-step').val(trjs.param.forwardskip*1000);

	$('#show-num').prop('checked', trjs.param.number);
	
	if (trjs.param.number) {
		$('#param-numbers').show();
		$('#param-nonumbers').hide();		
	} else {
		$('#param-numbers').hide();
		$('#param-nonumbers').show();		
	}
	// trjs.kwiclex.updateCSS();
}

function loadLexEntry(nb, ln) {
	var lex = $(ln);
	var entry = lex.attr("val");
	var nbocc = lex.attr("count");
    return '<tr><td class="num">' + nb + '</td><td class="entry">' + entry + '</td><td class="count">' + nbocc + '</td></tr>' ;
}

function loadLookEntry(nb, ln) {
	var look = $(ln);
	var elts = look.children();
	var fn, loc, ts, te, utt;
	for (var i = 0; i < elts.length; i++) {
		if (elts[i].nodeName == 'file')
			fn = $(elts[i]).text();
		else if (elts[i].nodeName == 'loc')
			loc = $(elts[i]).text();
		else if (elts[i].nodeName == 'start')
			ts = $(elts[i]).text();
		else if (elts[i].nodeName == 'end')
			te = $(elts[i]).text();
		else if (elts[i].nodeName == 'u')
			utt = $(elts[i]).text();
	}
    return '<tr><td class="num">' + nb + '</td><td class="file">' + fn + '</td><td class="loc">' + loc
    	+ '</td><td class="vts">' + ts + '</td><td class="vte">' + ts + '</td><td class="utt">' + utt ;
}

function loadKwicEntry(nb, ln) {
	var look = $(ln);
	var elts = look.children();
	var fn, loc, ts, te, lc, kwic, rc;
	for (var i = 0; i < elts.length; i++) {
		if (elts[i].nodeName == 'file')
			fn = $(elts[i]).text();
		else if (elts[i].nodeName == 'loc')
			loc = $(elts[i]).text();
		else if (elts[i].nodeName == 'start')
			ts = $(elts[i]).text();
		else if (elts[i].nodeName == 'end')
			te = $(elts[i]).text();
		else if (elts[i].nodeName == 'lc')
			lc = $(elts[i]).text();
		else if (elts[i].nodeName == 'kwic')
			kwic = $(elts[i]).text();
		else if (elts[i].nodeName == 'rc')
			rc = $(elts[i]).text();
	}
    return '<tr><td class="num">' + nb + '</td><td class="file">' + fn + '</td><td class="loc">' + loc
    	+ '</td><td class="vts">' + ts + '</td><td class="vte">' + te + '</td><td class="kwiclc">' + lc 
    	+ '</td><td class="kwic">' + kwic + '</td><td class="kwicrc">' + rc + '</td></tr>' ;
}

function loadData(xmlString) {
//	try {
	trjs.data.initRec();
	if (trjs.data.metadata != null) delete trjs.data.metadata;
	if (trjs.data.search != null) delete trjs.data.search;
	trjs.data.metadata = null;
	
	var processed = 0;
	trjs.log.resetLog();

	// get XML ready
	var parser = new DOMParser();
	trjs.data.doc = parser.parseFromString(xmlString, "text/xml");
	if (!trjs.data.doc) {
		trjs.log.boxalert("cannot load xml file: probably bad or wrong file");
		return;
	}
	trjs.template.readMediaInfo(trjs.data.doc); // initialize trjs.data according to info in document
    trjs.template.readMetadata(trjs.data.doc);
	var text = $(trjs.data.doc).find("text");
	if (text == null) {
		return;
	}
	trjs.kwiclex.type = $(text[0]).attr('type');
	var divs = text.children();
	if (divs == null) {
		return;
	}
	var nb = 0;
	var tabletxt = '';
	var firstMessage = false;
	for (var i = 0; i < divs.length; i++) {
		nb++;
		if (divs[i].nodeName == 'lookEntry')
			tabletxt += loadLookEntry(nb, divs[i]);
		else if (divs[i].nodeName == 'kwicEntry')
			tabletxt += loadKwicEntry(nb, divs[i]);
		else if (divs[i].nodeName == 'lexEntry')
			tabletxt += loadLexEntry(nb, divs[i]);
		else {
			if (firstMessage===false) {
				trjs.log.boxalert(trjs.messgs.errorformat + divs[i].nodeName);
				firstMessage = true;
			}
		}
	}
	
	trjs.template.loadMetadata();
	
	if (trjs.kwiclex.type === 'kwic') {
		var s = '<thead><th class="num">Num</th><th class="file">File</th><th class="loc">Loc</th><th class="vts">Start</th><th class="vte">End</th><th class="kwiclc">Left</th><th class="kwic">Cible</th><th class="kwicrc">Right</thead>';
		$('#transcript-head').html(s);
		$('#transcript').html(tabletxt);
	} else if (trjs.kwiclex.type === 'utterance') {
		var s = '<thead><th class="num">Num</th><th class="file">File</th><th class="loc">Loc</th><th class="vts">Start</th><th class="vte">End</th><th class="utt">Ennoncé</thead>';
		$('#transcript-head').html(s);
		$('#transcript').html(tabletxt);
	} else if (trjs.kwiclex.type === 'lexicon') {
		var s = '<thead><th class="num">Num</th><th class="entry">Mot</th><th class="count">Nb d\'occurences</th></thead>';
		$('#transcript-head').html(s);
		$('#transcript').html(tabletxt);
	}
/*	} catch (e) {
		trjs.log.boxalert(trjs.messgs.errorloading + ' - ' + e.name + ' - ' + e.message + ' - ' + e.lineNumber);
		loadNewGrid();
	}
*/
}

function initData(fn) {
	trjs.data.setRecordingRealFile(fn);
}

/**
 * initial jQuery loaf when js ready and loaded
 * @method main.document.ready
 */
function init() {
//	try {
		trjs.utils.detectBrowser();
		trjs.utils.checkStorageSupport();
		
		/**
		 * initialisation of multilingual messages
		 */
		document.title = trjs.messgs.kwicnamesoftware + ' ' + version.version;
		trjs.messgs.init();
		
	    /* for the small and temporary infomessages */
	    trjs.log.init();

		var uriLoad = false;
		var sURL = window.document.URL.toString();
		var uri = parseUri(sURL);
		if (uri.queryKey['ln'] != null) {
			trjs.param.goLine = uri.queryKey['ln'];
			uriLoad = true;		
		} else
			trjs.param.goLine = null;
		if (uri.queryKey['tm'] != null) {
			trjs.param.goTime = uri.queryKey['tm'];
			uriLoad = true;		
		} else
			trjs.param.goTime = null;
		if (uri.queryKey['play'] != null)
			trjs.param.goPlay = true;
		else
			trjs.param.goPlay = false;
		if (uri.queryKey['t'] != null)
			uriLoad = true;
	
		// init params
		trjs.param.loadStorage();
		setInitParam();
		
		$("#transcript-name").text('loading');
		if (uri.protocol == 'file') {
			trjs.kwiclex.loadData(trjs.local.get('kwiclexData')); // loading the data stored in local memory
			// could try using the media name in the recording but works only if the media name is in the same directory as transcriberjs.html
			// VERY UNLIKELY, so do not try: trjs.io.serverLoadMedia(trjs.data.mediaName);
		} else {
			if (uri.queryKey['t'] != null && uri.queryKey['t'] != '') { // load a transcription from the server
				var lt = uri.queryKey['t']; // use the parameter
				trjs.local.put('kwiclexRealFile', lt);
				trjs.io.serverLoadFile(lt, function(err, data) {
					// console.log('fin load ' + err + '   ' + lt);
					if (err) {
						trjs.data.initRec(); // maybe not really necessary but cleaning the data might be a good thing to do
						trjs.data.setInitialValues();
					  	trjs.kwiclex.initData(lt); // nothing loaded
					  	trjs.data.setNamesInWindow();
					  	return;
					}
					trjs.kwiclex.initData(lt);
					trjs.kwiclex.loadData(data);
				  	trjs.data.setNamesInWindow();
					trjs.local.put('kwiclexData', data);
				} ); // external load 
				// second parameter means "try to load the video or audio indicated in the transcription name"
			} else { // no parameters: load what is in memory
				if (trjs.local.get('kwiclexRealfile')) {
					// first time here
					trjs.kwiclex.initData(lt);
				  	trjs.data.setNamesInWindow();
				} else {
					trjs.io.serverLoadFile(trjs.local.get('kwiclexRealfile'), function(err, data) {
						trjs.kwiclex.initData(lt);
						trjs.kwiclex.loadData(data);
					  	trjs.data.setNamesInWindow();
					} ); // external load
				}
			}
		}
		trjs.param.changed = false;
		trjs.local.put('saved', 'yes');
/*	} catch(e) {
		trjs.log.boxalert(trjs.messgs.errorfile + e.name + ' - ' + e.message + ' - ' + e.lineNumber);
		trjs.transcription.loadNewGrid(); // new transcript
	}
*/
}


return {
	init: function() { init(); },
	loadData: function(p) { loadData(p); },
	initData: function(p) { initData(p); },
};
})();
