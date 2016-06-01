/**
 * <p>Main organisation and initialisation functions of the software</p>
 * date: july 2013
 * version 0.0.1 initial - july 2013
 * version 0.0.2 version sans handsontable pour transcrition.js - july 20123
 * version 0.0.5 first alpha version
 * @version 0.1.5 - functionnal version with Transcriber classic shortcuts
 * @module Transcriber
 * @author Christophe Parisse
 */

/*
 * Description of the module organisation
 * 
 * used in all applications
 * trjs.messgs : all the messages displayed - help to change language
 * trjs.params : parameters of the software
 * trjs.utils : utilitary functions indenpendant of the transcription software (could be used by other software)
 * 
 * transcriberjs.html
 * trjs.data : all the data stored for editing the transcription and handling the files and filenames (transcriber.md)
 * trjs.editor : main functions and starting functions of transcriberjs (transcriber.js)
 * trjs.dmz : all the functions for display, moving, zooming (call partition.js, sliders.js, wave.js and decim.js)
 * trjs.events : events functions (events.js)
 * trjs.io : open and save files functions (opensave.js)
 * trjs.transcription : handle the format (transcription.js)
 * trjs.template : handle the metadata (transcription.js)
 * 
 * transcriberfiles.html
 * trjs.find : functions that list and modify the files on the current computer
 */

trjs.editor = ( function() {

/**
 * Display About message
 * @method about
 */
function about() {
	var year = version.date.getFullYear();
	var month = version.date.getMonth();
	var day = version.date.getDate();
	var datestring;
	if (trjs.param.language === 'eng')
		datestring = trjs.messgs.months[month-1] + ' ' + day + ', ' + year;
	else
		datestring = day + ' ' + trjs.messgs.months[month-1] + ' ' + year;
	
	var last = (trjs.param.lastversion?trjs.param.lastversion:version.version);
	var vn;
	if (last > version.version)
		vn = last + '(' + version.version + ') ' + datestring;
	else
		vn = version.version + ' - ' + datestring;
	var copyright = trjs.messgs.about;
	var libraries = trjs.messgs.aboutlib;
	bootbox.alert(version.appName + " 2013-2016<br />Version " + vn + " <br />Auteur: Christophe Parisse - cparisse@u-paris10.fr<br/>" + copyright + '<br />' + libraries, function() {});
}

/**
 * set of functions that handle the main functions
 * general loading and interface
 * initialization of data, resizing
 * Mains
 */
function setInitParam() {
	$('#backward-step').val(trjs.param.backwardskip*1000);
	$('#forward-step').val(trjs.param.forwardskip*1000);
	$('#nb-saves').val(trjs.param.nbversions);
	$('#nb-digits').val(trjs.param.nbdigits);
	$('#format-time').val(trjs.param.formatTime);

	if (!trjs.param.features.wave()) {
		$('#askforwave').hide();
		$('#show-wave').prop('checked', false);
		trjs.dmz.setVisible('wave', false);
	} else if (trjs.dmz.isWave()) {
		$('#show-wave').prop('checked', true);
		trjs.dmz.setVisible('wave', true);
	} else {
		$('#show-wave').prop('checked', false);
		trjs.dmz.setVisible('wave', false);
	}
	if (!trjs.param.features.partition()) {
		$('#askforpartition').hide();
		$('#show-partition').prop('checked', false);
		trjs.dmz.setVisible('partition', false);
	} else if (trjs.dmz.isPartition()) {
		$('#show-partition').prop('checked', true);
		trjs.dmz.setVisible('partition', true);
	} else {
		$('#show-partition').prop('checked', false);
		trjs.dmz.setVisible('partition', false);
	}
	if (trjs.param.showMedia === true) {
		trjs.dmz.setVisible('media', true);
		$('#show-media').prop('checked', true);
	} else {
		trjs.dmz.setVisible('media', false);
		$('#show-media').prop('checked', false);
	}

	$('#show-num').prop('checked', trjs.param.number);
	$('#show-names').prop('checked', trjs.param.locnames);
	$('#reorder-dynamic').prop('checked', trjs.param.reorder);
	$('#mode-insert').prop('checked', trjs.param.modeinsert);
	$('#mode-showlinktime').prop('checked', trjs.param.showLinkTime);
	$('#use-quality').prop('checked', trjs.param.useQuality);
	$('#check-at-save').prop('checked', trjs.param.checkAtSave);
	
	/*
	if (trjs.param.number) {
		$('#param-numbers').show();
		$('#param-nonumbers').hide();		
	} else {
		$('#param-numbers').hide();
		$('#param-nonumbers').show();		
	}
	if (trjs.param.showLinkTime) {
		$('#param-showLinkTime').show();
		$('#param-hideLinkTime').hide();		
	} else {
		$('#param-showLinkTime').hide();
		$('#param-hideLinkTime').show();		
	}
	*/
	if (trjs.param.modeinsert) {
		$('#insertreplacemode').text(trjs.messgs.insertreplacemodeInsert);
	} else {
		$('#insertreplacemode').text(trjs.messgs.insertreplacemodeReplace);
	}
	trjs.transcription.updateCSS();
}

/**
 * change the language settings
 */
function setLanguage() {
	var val = $('input[name="language-version"]:checked').val();
	if (val === '0') {
		// this is English
		trjs.param.language = 'eng';
		trjs.log.alert('Language set to English');
	} else {
		// this is French
		trjs.log.alert('Langue sélectionnée: Français');
		trjs.param.language = 'fra';
	}
	trjs.param.saveStorage();
	if (trjs.param.language === 'eng') {
		trjs.messgs = trjs.messgs_eng;
		trjs.undo.setLang('eng');
	} else {
		trjs.messgs = trjs.messgs_fra;
		trjs.undo.setLang('fra');
	}
	trjs.messgs_init();
}

/**
 * set option about backward step
 * @method setBackwardStep 
 */
function setBackwardStep() {
	var x = parseInt($('#backward-step').val());
	if (x>100 || x<100000)
		trjs.param.backwardskip = x/1000;
	else
		$('#backward-step').val(3000);
	trjs.param.saveStorage();
}

/**
 * set option about forward step
 * @method setForwardStep 
 */
function setForwardStep() {
	var x = parseInt($('#forward-step').val());
	if (x>100 || x<100000)
		trjs.param.forwardskip = x/1000;
	else
		$('#forward-step').val(3000);
	trjs.param.saveStorage();
}

/**
 * set option about number of saves
 * @method setNbSaves 
 */
function setNbSaves() {
	var x = parseInt($('#nb-saves').val());
	if (x>=1 || x<=3)
		trjs.param.nbversions = x;
	else
		$('#nb-saves').val(3);
	trjs.param.saveStorage();
}

/**
 * set option about number of visible lines in the partition
 * @method setNbVisible
 */
function setNbVisible() {
	var x = parseInt($('#nb-visible').val());
	if (x>=1 || x<=7)
		trjs.param.nbVisible = x;
	else
		$('#nb-saves').val(3);
	trjs.param.saveStorage();
    trjs.partition.redrawPartition();
}

/**
 * set option about number of digits displayed in second division (deciseconds or centiseconds or milliseconds)
 * @method setNbDigits 
 */
function setNbDigits() {
	var x = parseInt($('#nb-digits').val());
	if (x>=0 || x<=3)
		trjs.param.nbdigits = x;
	else
		$('#nb-digits').val(0);
	trjs.transcription.updateTimecode();
	trjs.param.saveStorage();
}

/**
 * set option about format for time
 * @method setFormatTime
 */
function setFormatTime() {
	var x = $('#format-time option:selected').val();
	trjs.param.formatTime = x;
	trjs.transcription.updateTimecode();
	trjs.param.saveStorage();
}

/**
 * set option about numbers
 * @method setNums 
 */
function setCheckAtSave() {
	if ( $('#check-at-save').prop('checked') === true) {
		trjs.param.checkAtSave = true;
//		$('#param-numbers').show();
//		$('#param-nonumbers').hide();		
	}
	else {
		trjs.param.checkAtSave = false;
//		$('#param-numbers').hide();
//		$('#param-nonumbers').show();		
	}
	trjs.param.saveStorage();
}

/**
 * set option about numbers
 * @method setNums 
 */
function setNums() {
	if ( $('#show-num').prop('checked') === true) {
		trjs.param.number = true;
		$('#param-numbers').show();
		$('#param-nonumbers').hide();		
	}
	else {
		trjs.param.number = false;
		$('#param-numbers').hide();
		$('#param-nonumbers').show();		
	}
	trjs.transcription.updateCSS();
	trjs.param.saveStorage();
}

/**
 * set option about code or names
 * @method setLocNames 
 */
function setLocNames() {
	if ($('#show-names').prop('checked') === true) {
		trjs.param.locnames = true;
		$('#param-locnames').show();
		$('#param-loccodes').hide();		
	} else {
		trjs.param.locnames = false;
		$('#param-locnames').hide();
		$('#param-loccodes').show();		
	}
	trjs.transcription.updateLocNames();
	trjs.param.saveStorage();
}

/**
 * set option about reordering the line dinamically
 * @method setReorder 
 */
function setReorder() {
	if ($('#reorder-dynamic').prop('checked') === true) {
        bootbox.confirm( trjs.messgs.askforreorder, function(ok) {
            if (ok !== true)
                return;
    		trjs.param.reorder = true;
        	trjs.param.saveStorage();
        });
	} else {
		trjs.param.reorder = false;
    	trjs.param.saveStorage();
	}
}

/**
 * set insert replace option
 * @method setInsert
 */
function setInsert() {
	if ( $('#mode-insert').prop('checked') === true) {
		trjs.param.modeinsert = true;
		$('#insertreplacemode').text(trjs.messgs.insertreplacemodeInsert);
	} else {
		trjs.param.modeinsert = false;
		$('#insertreplacemode').text(trjs.messgs.insertreplacemodeReplace);
	}
	trjs.param.saveStorage();
}

/**
 * set show link time option
 * @method setLinkTime
 */
function setShowLinkTime() {
	if ( $('#mode-showlinktime').prop('checked') === true) {
		trjs.param.showLinkTime = true;
	} else {
		trjs.param.showLinkTime = false;
	}
	trjs.transcription.updateCSS();
	trjs.param.saveStorage();
}

/**
 * allows to choose between automatic use of quality and manual choice of file names
 * @method setUseQuality
 */
function setUseQuality() {
	if ( $('#use-quality').prop('checked') === true) {
		trjs.param.useQuality = true;
	} else {
		trjs.param.useQuality = false;
	}
	trjs.param.saveStorage();
}

/**
 * set media visible option
 * @method setPartition
 */
function setMedia() {
	if ( $('#show-media').prop('checked') === true) {
		trjs.param.showMedia = true;
		trjs.dmz.setVisible('media', true);
	} else {
		trjs.param.showMedia = false;
		trjs.dmz.setVisible('media', false);
	}
	trjs.param.saveStorage();
	resizeTranscript();
}

/**
 * set partition visible option
 * @method setPartition
 */
function setPartition() {
	if ( $('#show-partition').prop('checked') === true) {
		trjs.param.showPartition = true;
		trjs.dmz.setVisible('partition', true);
		$('#param-show-partition').show();
		$('#param-hide-partition').hide();	
	} else {
		trjs.param.showPartition = false;
		trjs.dmz.setVisible('partition', false);
		$('#param-show-partition').hide();
		$('#param-hide-partition').show();	
	}
	trjs.param.saveStorage();
	resizeTranscript();
}

/**
 * set wave visible option
 * @method setWave
 */
function setWave() {
	if ( $('#show-wave').prop('checked') === true) {
		trjs.param.showWave = true;
		trjs.dmz.setVisible('wave', true);
		$('#param-show-wave').show();
		$('#param-hide-wave').hide();
	} else {
		trjs.param.showWave = false;
		trjs.dmz.setVisible('wave', false);
		$('#param-show-wave').hide();
		$('#param-hide-wave').show();	
	}
	trjs.param.saveStorage();
	resizeTranscript();
}

/**
 * toggle insert replace option
 * @method toggleInsert 
 */
function toggleInsert() {
	if (trjs.param.modeinsert === false) {
		$('#mode-insert').prop('checked', true);
		trjs.param.modeinsert = true;
		$('#insertreplacemode').text(trjs.messgs.insertreplacemodeInsert);
	} else {
		$('#mode-insert').prop('checked', false);
		trjs.param.modeinsert = false;
		$('#insertreplacemode').text(trjs.messgs.insertreplacemodeReplace);
	}
	trjs.param.saveStorage();
}

var nbToogleParametersArea = 0; // count the toggled area actually displayed

/**
 * toggle if necessary the area of parameters
 * if this area is visible then the size of the body has to change
 */
function toogleParametersArea(div, aide, forcevisible) {
	if (div.is(':visible')) {
		if (forcevisible===true) return;
		div.hide();
		if (aide) trjs.aideclose();
		nbToogleParametersArea--;
		if (nbToogleParametersArea <= 0) {
			nbToogleParametersArea = 0;
			$('#parameters-area').hide();
			$('body').height('100%');
		}
	} else {
		div.show();
		if (aide) trjs.aidecontextuelle(aide, false);
		nbToogleParametersArea++;
		$('#parameters-area').show();
		// $('body').height('2000px');
		$('body').height( $('body').height() + $('#parameters-area').height());
	}
}

/**
 * toggle viewing of the open save div
 * @method showOpensave
 */
function showOpensaveTranscript() {
	if ($('#opensave-bench-transcript').is(":visible")) {
		toogleParametersArea($('#opensave-bench-transcript'));
		resizeTranscript();
		return true;
	}
	if (trjs.param.warningLocalTranscript === true) {
        if (trjs.param.mode ===  'readwritelocal') {
            trjs.param.warningLocalTranscript = false;
            trjs.log.boxalert(trjs.messgs.warningLocalTranscript);
            toogleParametersArea($('#opensave-bench-transcript'));
            resizeTranscript();
        } else {
	        bootbox.dialog({
            message: trjs.messgs.warningLocalTranscript,
            title: trjs.messgs.warning,
            buttons: {
                ok: {
                label: trjs.messgs.labelok,
                className: "btn-success",
                callback: function() {
                    toogleParametersArea($('#opensave-bench-transcript'));
                    resizeTranscript();
                }
                },
                cancel: {
                label: trjs.messgs.labelcancel,
                className: "btn-default",
                callback: function() {
                    return;
                }
                },
                notagain: {
                label: trjs.messgs.labelnotagain,
                className: "btn-default btn-sm",
                callback: function() {
                    trjs.param.warningLocalTranscript = false;
                    trjs.param.saveStorage();
                    toogleParametersArea($('#opensave-bench-transcript'));
                    resizeTranscript();
                }
                },
            },
            });
        }
    } else {
		toogleParametersArea($('#opensave-bench-transcript'));
		resizeTranscript();
    }
}

/**
 * toggle viewing of the open save div
 * @method showOpensave
 */
function showOpensaveMedia() {
	if ($('#opensave-bench-media').is(":visible")) {
		toogleParametersArea($('#opensave-bench-media'));
		resizeTranscript();
		return true;
	}
	if (trjs.param.warningLocalMedia === true) {
        if (trjs.param.mode ===  'readwritelocal') {
            trjs.param.warningLocalMedia = false;
            trjs.param.saveStorage();
            trjs.log.boxalert(trjs.messgs.warningLocalMedia);
            toogleParametersArea($('#opensave-bench-media'));
            resizeTranscript();
        } else {
            bootbox.dialog({
            message: trjs.messgs.warningLocalMedia,
            title: trjs.messgs.warning,
            buttons: {
                ok: {
                label: trjs.messgs.labelok,
                className: "btn-success",
                callback: function() {
                    toogleParametersArea($('#opensave-bench-media'));
                    resizeTranscript();
                }
                },
                cancel: {
                label: trjs.messgs.labelcancel,
                className: "btn-default",
                callback: function() {
                    return;
                }
                },
                notagain: {
                label: trjs.messgs.labelnotagain,
                className: "btn-default btn-sm",
                callback: function() {
                    trjs.param.warningLocalMedia = false;
                    trjs.param.saveStorage();
                    toogleParametersArea($('#opensave-bench-media'));
                    resizeTranscript();
                }
                },
            },
            });
        }
    } else {
		toogleParametersArea($('#opensave-bench-media'));
		resizeTranscript();
    }
}

/**
 * toggle viewing of the metadata div
 * @method showMetadata
 */
function showMetadata() {
	trjs.data.checkNamesInProcess = false; // authorize edit filename field
	toogleParametersArea($('#metadata-bench'), 'op-metadata');
	resizeTranscript();
}

/**
 * toggle viewing of the participant div
 * @method showParticipant
 */
function showParticipant() {
	toogleParametersArea($('#participant-bench'), 'op-part');
	resizeTranscript();
}

/**
 * toggle viewing of the template div
 * @method showTemplate
 */
function showTemplate() {
	toogleParametersArea($('#template-bench'), 'op-struc');
	resizeTranscript();
}

/**
 * toggle viewing of the params div
 * @method showParams
 */
function showParams() {
	toogleParametersArea($('#params-bench'), 'op-param');
	resizeTranscript();
}

/**
 * toggle viewing of the search div
 * @method showSearch
 */
function showSearch() {
	toogleParametersArea($('#search-bench'), 'op-search');
	resizeTranscript();
}

/**
 * toggle viewing of the check div
 * @method showCheck
 */
function showCheck(forcevisible) {
	toogleParametersArea($('#check-bench'), null, forcevisible);
	resizeTranscript();
}

/**
 * test is save has to be done (and ask the user if necessary).
 * @method testNotSave
 * @param {string} conditions
 */
function testNotSave(callback) {
	trjs.io.innerSave();
	if (trjs.param.changed === false) {
		if (callback) callback(true);
		return true;
	}
	if (!callback) {
		if (window.confirm(trjs.messgs.mustsave)) {
			trjs.param.changed = false;
			return true;
		} else {
			return false;
		}
	} else
		bootbox.confirm(trjs.messgs.mustsave, function(result) {
			if (result === true ) {
				trjs.param.changed = false;
				if (callback) callback(true);
			} else {
				if (callback) callback(false);
			}
		});
}

/**
 * jumps to the help page.
 * @method goHelp
 */
function goHelp() {
	trjs.io.innerSave();
	// location.href = "http://modyco.inist.fr/transcriberjs/doku.php?id=start";
	window.open("http://modyco.inist.fr/transcriberjs/",'_blank');
}

/**
 * jumps to the ortolang page.
 * @method ortolang
 */
function ortolang() {
	trjs.io.innerSave();
	// location.href = "http://www.ortolang.fr";
	window.open("http://www.ortolang.fr",'_blank');
}

/**
 * jumps to the local help page.
 * @method goHelpLocal
 */
function goHelpLocal() {
	// trjs.io.innerSave();
	// location.href = "http://modyco.inist.fr/transcriberjs/doku.php?id=start";
	// window.open("doc/help.html",'_blank');
	bootbox.alert(trjs.messgs.help, function() {});
}

/**
 * resize the transcript div when size of window changes
 * @method resizeTranscript
 */
function resizeTranscript() {
	var wdh = $(window).height();
	var progress = $('#progress').height();
	var params = $('#parameters-area').height();
	var mdh = $('#media-display').height();
	if ($('#metadata-bench').is(':visible') || $('#participant-bench').is(':visible') || $('#template-bench').is(':visible')
			|| wdh < (progress + params + mdh + trjs.param.MINHEIGHTTRANSCRIPT)) {
		$('#transcription-bench').height(trjs.param.NORMALHEIGHTTRANSCRIPT);
	} else {
		var p = $('#transcription-bench').offset();
		if (!p) return;
		$('#transcription-bench').height(wdh - (p.top + progress + params));
		$('#media-cell').height(mdh);
		/*
		var mdw = $('#media-display').width();
		var blw = $('#buttons-left').width();
		var brw = $('#buttons-right').width();
		$('#media-cell').width(mdw+blw+brw+10);
		var synsz = $('#synchro-left').height();
		$('#synchro-left').css('top', mdh-synsz);
		$('#synchro-right').css('top', mdh-synsz);
		var wdw = $(window).width();
		$('#media-bench').width(wdw);
		*/
	}
	// if width has changed the canvas must be redisplayed 
	trjs.dmz.resetWidth();
}

/**
 * sets the window resize function
 * @method 
 */
window.onresize = function(event) {
	resizeTranscript(event);
};

/**
 * restore the recording file names from the data in local storage
 * @method restoreNameFromLocalStorage
 */
function restoreNameFromLocalStorage() {
	if (trjs.local.get('recordingRealFile') === null || trjs.local.get('recordingRealFile') === '')
		return;
	trjs.data.setRecordingRealFile(trjs.local.get('recordingRealFile'));
}

function finalizeLoad() {
	trjs.param.changed = false;
	trjs.local.put('saved', 'yes');
	
	// console.log('finalized load');
	var closeTest = function() {
		trjs.param.saveStorage();
		if (trjs.param.changed === true) {
			trjs.io.innerSave();
			return trjs.messgs.wantback;
		} else {
			trjs.io.innerSave(true);  // do not keep track of the not saving of the file (inner save only for 
			// the ability to come back and word again on the same file).
			return;
		}
	};
	
	if (trjs.data.currentBrowserName === 'Firefox')
		window.onbeforeunload = closeTest;
	else
		$(window).on('beforeunload', closeTest);

}

/**
 * initial jQuery loaf when js ready and loaded
 * @method main.document.ready
 */
function init() {
//	try {
		trjs.utils.detectBrowser();
		trjs.utils.checkStorageSupport();
		
		$('#files-readwrite').hide();
		// init params
		trjs.local.init();
		trjs.param.loadStorage();
		if (trjs.param.language === 'eng') {
			$('input[name="language-version"][value=0]').prop('checked', true);
			trjs.messgs = trjs.messgs_eng;
			trjs.undo.setLang('eng');
		} else {
			$('input[name="language-version"][value=1]').prop('checked', true);
			trjs.messgs = trjs.messgs_fra;
			trjs.undo.setLang('fra');
		}
		//trjs.messgs_init();
		if (version.serverImpl === 'php') { // conditions for php server (depend on the version)
			trjs.param.features.settingsTP();
		}
		trjs.undo.init();

		// now check if this is a saved HTML file and not a transcriberjs main appli file
		// if this is the case, then load the HTML file directly
		// else load an empty file and insert either the localStorage or an external file
		var sURL = window.document.URL.toString();
		var uri = parseUri(sURL);
		// console.log(uri);
		//if (uri.file === 'transcriberjs.html')
			loadFromTranscriberjsHtml(uri);
		/* 
        else {
			// hide wave and partition
			trjs.dmz.setVisible('partition',false);
			trjs.dmz.setVisible('wave',false);
			var media = $('#media-display')[0].firstElementChild;
			if (media)
				media.addEventListener('timeupdate', trjs.media.timeUpdateListener, false);
		}
        */
/*	} catch(e) {
		trjs.log.boxalert(trjs.messgs.errorfile + e.name + ' - ' + e.message + ' - ' + e.lineNumber);
		trjs.transcription.loadNewGrid(); // new transcript
	}
*/
}

function loadFromTranscriberjsHtml(uri) {
	var uriLoad = false;

	$('#table-loading').text(trjs.messgs.loading);
	trjs.data.initMedia();

	if (trjs.param.mediaQuality() === '240p') {
		$('input[name="video-quality"][value=4]').prop('checked', true);
	} else if (trjs.param.mediaQuality() === '480p') {
		$('input[name="video-quality"][value=3]').prop('checked', true);
	} else if (trjs.param.mediaQuality() === '576p') {
		$('input[name="video-quality"][value=2]').prop('checked', true);
	} else if (trjs.param.mediaQuality() === '720p') {
		$('input[name="video-quality"][value=1]').prop('checked', true);
	} else if (trjs.param.mediaQuality() === '1080p') {
		$('input[name="video-quality"][value=0]').prop('checked', true);
//		} else if (trjs.param.mediaQuality() === '4K') {
//			$('input[name="video-quality"][value=5]').prop('checked', true);
	} else if (trjs.param.mediaQuality() === 'master') {
		$('input[name="video-quality"][value=5]').prop('checked', true);
	} else {
		$('input[name="video-quality"][value=3]').prop('checked', true);
	}
	
	/**
	 * initialisation of multilingual messages
	 */
	document.title = trjs.messgs.namesoftware + ' ' + version.version;

	trjs.dmz.sliderInit();
	trjs.param.synchro.init();

	if (trjs.progress && trjs.param.level >= 'level2') {
		var p = version.WEB_ADDRESS();
		trjs.progress.socket = io.connect(p);
		trjs.progress.init();
	}

    /*
     * initialize zoom and partition and wavefile
     */
    if (trjs.local.get('winsize')) {
    	trjs.dmz.winsize(trjs.local.get('winsize'));
    } else {
    	trjs.dmz.winsize(10);  // 10 sec horizontally
    }
    	
	trjs.dmz.setZoomText();
	
    /* for the small and temporary infomessages */
    trjs.log.init();

	//console.log(uri);
	if (uri.queryKey['ln']) {
		trjs.param.goLine = uri.queryKey['ln'];
	} else
		trjs.param.goLine = null;
	if (uri.queryKey['tm']) {
		trjs.param.goTime = uri.queryKey['tm'];
	} else
		trjs.param.goTime = null;
	if (uri.queryKey['play'] !== undefined)
		trjs.param.goPlay = true;
	else
		trjs.param.goPlay = false;
	if (uri.queryKey['t'] || uri.queryKey['mn'])
		uriLoad = true;
	
	if (trjs.param.restart === 'update' && trjs.param.level >= 'level6') {
		trjs.system.updateClean(
			{},
			function () {
				trjs.log.alert(trjs.messgs.filescleaned);
			},
			function() {
				trjs.log.alert('could not clean files');
			});
		trjs.param.restart = 'done';
		trjs.param.saveStorage();
	}
	trjs.dmz.initVisible();
	setInitParam();
	
	var lg = trjs.param.recentfiles.length;
	if (lg === 0) {
		$('#recentfiles').attr('data-recent', 0);
	} else {
		$('#recentfiles').attr('data-recent', lg);
		$('#recentfiles').next().remove();
		for (var i=lg-1; i >= 0; i--) {
			$('#recentfiles').after('<li><a href="#" onclick=\'trjs.io.loadRecentFile("' + trjs.param.recentfiles[i] + '");\'>' + trjs.param.recentfiles[i] + '</a></li>');
		}
	}

	//console.log(trjs.local.get('saved'));
	//console.log(uriLoad);
	/*
	if ( trjs.local.get('saved') == 'no' && uriLoad == true ) { // last save by trjs.io.innerSave() but not by trjs.io.serverSave() and not loading default page.
		if ( confirm(trjs.messgs.backfile) == false ) {
            var parser = new DOMParser();
            trjs.data.doc = parser.parseFromString(trjs.local.get('transcript'), "text/xml");
			trjs.transcription.loadIntoGrid(); // loading the data stored in local memory
			trjs.io.serverLoadMedia(trjs.local.get('mediaRealFile'));
			return;
		}
	}
	*/
	if ( trjs.local.get('saved') === 'no' && uriLoad === true ) { // last save by trjs.io.innerSave() but not by trjs.io.serverSave() and not loading default page.
		bootbox.confirm(trjs.messgs.backfile, function(result) {
			if (result === false) {
				// get XML ready
				var parser = new DOMParser();
				trjs.data.doc = parser.parseFromString(trjs.local.get('transcript'), "text/xml");
				trjs.transcription.loadIntoGrid(); // loading the data stored in local memory
				trjs.io.serverLoadMedia(trjs.local.get('mediaRealFile'));
				return;
			}
		});
	}
	if (uri.protocol === 'file') {
		if (uri.queryKey.length>0) {
			trjs.log.alert('warning: all parameters with file:/// are ignored');
		}
		trjs.transcription.loadNewGrid();
		
		// could try using the media name in the recording but works only if the media name is in the same directory as transcriberjs.html
		// VERY UNLIKELY, so do not try: trjs.io.serverLoadMedia(trjs.data.mediaName);
	} else {
		var lt, lm;
		trjs.data.recordingUrlPath = '';
		if (uri.queryKey['mn']) { // starts a new transcription with a media
			trjs.transcription.loadNewGrid(); // new transcript
			lm = uri.queryKey['mn'];
			var v = codefn.decodeFilename(lm);
			trjs.local.put('mediaRealFile', v);
			trjs.io.serverLoadMedia(v);
			trjs.data.setNamesInEdit();
		} else if (uri.queryKey['mx']) { // load a media with the currently edited transcription
			lm = uri.queryKey['mx'];
			var v = codefn.decodeFilename(lm);
			trjs.local.put('mediaRealFile', v);
			restoreNameFromLocalStorage();
            var parser = new DOMParser();
            trjs.data.doc = parser.parseFromString(trjs.local.get('transcript'), "text/xml");
			trjs.transcription.loadIntoGrid(); // loading the data stored in local memory
			trjs.io.serverLoadMedia(v);
		} else if (uri.queryKey['t']) { // load a transcription from the server
			lt = uri.queryKey['t']; // use the parameter
			//console.log('t= ' + lt);
			var v = codefn.decodeFilename(lt);
			trjs.local.put('recordingRealFile', v);
			trjs.data.recordingUrlPath = trjs.utils.pathName(v);
			if (!uri.queryKey['m']) {
				trjs.io.serverLoadTranscript(trjs.local.get('recordingRealFile'), true, function(err) {
					console.log("err " + err);
					finalizeLoad();
				} ); // internal load 
				// second parameter means "try to load the video or audio indicated in the transcription name"
			} else { // use the video name provided in the command control
				trjs.io.serverLoadTranscript(trjs.local.get('recordingRealFile'), false, function(err) {
					console.log("err " + err);
					finalizeLoad();
					lm = uri.queryKey['m'];
					//console.log('m= ' + lm);
					var v = codefn.decodeFilename(lm);
					trjs.local.put('mediaRealFile', v);
					trjs.io.serverLoadMedia(v);
				} ); // external load 
			}
		} else { // no parameters: load what is in memory
			if (!trjs.local.get('recordingName')) {
				// first time here
				trjs.transcription.loadNewGrid();
				finalizeLoad();
			} else {
				trjs.data.setRecordingRealFile(trjs.local.get('recordingRealFile'));
				var parser = new DOMParser();
				trjs.data.doc = parser.parseFromString(trjs.local.get('transcript'), "text/xml");
				trjs.transcription.loadIntoGrid(); // loading the data stored in local memory
				finalizeLoad();
				if (trjs.local.get('mediaRealFile'))
					trjs.io.serverLoadMedia(trjs.local.get('mediaRealFile'));
			}
		}
	}
}
/**
 * perform search on the data in the browser
 * @method goSearch
 * @param {string} pattern: string to search for
 * @param {string} flag: choice of column and type of search
 */
function goSearch(search_pattern, flag) {
	trjs.data.search = []; // empty array of line numbers
	if (!search_pattern)
		search_pattern = $('#search-elts')[0].value;
	var withcase = false;
	if (flag === undefined) {
		flag = '/';
		//console.log($('#search-flag-loc'));
		//console.log($('#search-flag-tr'));
		if ($('#search-flag-loc')[0].checked === true)
			flag += 'loc/';
		if ($('#search-flag-tr')[0].checked === true)
			flag += 'tr/';
		if ($('#search-flag-loc')[0].checked === true && $('#search-flag-tr')[0].checked === true)
			flag = '/';
		if ($('#search-casenocase')[0].checked === true)
			withcase = true;
	}
	var count = 0;
	if (search_pattern !== '') {
		var search_regexp;
		try {
			if (withcase)
				search_regexp = new RegExp(search_pattern);
			else
				search_regexp = new RegExp(search_pattern, 'i');
		} catch(e) {
			trjs.log.boxalert(trjs.messgs.esff);
			return;
		}
		var tablelines = trjs.transcription.tablelines();
		for (var i = 0; i < tablelines.length; i++) {
			var td;
			if (flag.indexOf('/loc/') !== -1)
				td = trjs.events.lineGetCell( $(tablelines[i]), trjs.data.CODECOL );
			else if (flag.indexOf('/tr/') !== -1)
				td = trjs.events.lineGetCell( $(tablelines[i]), trjs.data.TRCOL );
			else
				td = trjs.events.lineGetCell( $(tablelines[i]), trjs.data.CODECOL ) + ' ' + trjs.events.lineGetCell( $(tablelines[i]), trjs.data.TRCOL );
			if (td !== null && search_regexp.test(td)) {
				trjs.data.search.push(i);
				$(tablelines[i]).css('background', 'lightpink');
				count++;
			} else {
				$(tablelines[i]).css('background', $(tablelines[i]).attr('backcolor'));
			}
		}
	}
	$('#search-nb-results').text(count);
	$('#search-nbx').text(count);
	$('#search-posx').text(1);
	trjs.data.searchCount = count;
	if (count>0) {
		trjs.data.searchPos = 0;
		trjs.events.goToLine(trjs.data.search[0]+1);
	}
}

/**
 * display previous search position
 * @method prevSearch
 */
function prevSearch() {
	if (trjs.data.searchCount && trjs.data.searchCount > 0) {
		if ( trjs.data.searchPos > 0 ) {
			trjs.data.searchPos --;
			$('#search-posx').text(trjs.data.searchPos+1);
			trjs.events.goToLine(trjs.data.search[trjs.data.searchPos]+1);
		}
	}
}

/**
 * display next search position
 * @method nextSearch
 */
function nextSearch() {
	if (trjs.data.searchCount && trjs.data.searchCount > 0) {
		if ( trjs.data.searchPos < trjs.data.searchCount-1) {
			trjs.data.searchPos ++;
			$('#search-posx').text(trjs.data.searchPos+1);
			trjs.events.goToLine(trjs.data.search[trjs.data.searchPos]+1);
		}
	}
}

/**
 * hide elements of the transcription by performing search on the data in the browser
 * @method hideElements
 * @param {string} flag: choice of column and type of search
*/
function hideElements(search_pattern, flag) {
	if (search_pattern === undefined)
		search_pattern = $('#hide-elts')[0].value;
	if (flag === undefined) {
		flag = '/';
		//console.log($('#search-flag-loc'));
		//console.log($('#search-flag-tr'));
		if ($('#hide-flag-loc')[0].checked === true)
			flag += 'loc/';
		if ($('#hide-flag-tr')[0].checked === true)
			flag += 'tr/';
		if ($('#hide-flag-loc')[0].checked === true && $('#hide-flag-tr')[0].checked === true)
			flag = '/';
	}
	search_pattern = search_pattern.toLowerCase();
	if (search_pattern !== '') {
		var tablelines = trjs.transcription.tablelines();
		for (var i = 0; i < tablelines.length; i++) {
			// var tds = tablelines[i].children();
			var td;
			if (flag.indexOf('/loc/') !== -1)
				td = trjs.events.lineGetCell( $(tablelines[i]), trjs.data.CODECOL );
			else if (flag.indexOf('/tr/') !== -1)
				td = trjs.events.lineGetCell( $(tablelines[i]), trjs.data.TRCOL );
			else
				td = trjs.events.lineGetCell( $(tablelines[i]), trjs.data.CODECOL ) + ' ' + trjs.events.lineGetCell( $(tablelines[i]), trjs.data.TRCOL );
			if (td !== null && td.toLowerCase().indexOf(search_pattern) > -1)
				hideTier($(tablelines[i]));
			else
				showTier($(tablelines[i]));
		}
	}
}

/**
 * show all elements of the transcription that may have been hidden
 * @method resetElements
 */
function resetElements() {
	var tablelines = trjs.transcription.tablelines();
	for (var i = 0; i < tablelines.length; i++) {
		showTier($(tablelines[i]));
	}
	$('#show-elts')[0].value = '';
	$('#hide-elts')[0].value = '';
}

/**
 * show elements of the transcription by performing search on the data in the browser
 * @method showElements
 * @param {string} pattern: string to search for
 * @param {string} flag: choice of column and type of search
 */
function showElements(search_pattern, flag) {
	if (search_pattern === undefined)
		search_pattern = $('#show-elts')[0].value;
	if (flag === undefined) {
		flag = '/';
		//console.log($('#search-flag-loc'));
		//console.log($('#search-flag-tr'));
		if ($('#show-flag-loc')[0].checked === true)
			flag += 'loc/';
		if ($('#show-flag-tr')[0].checked === true)
			flag += 'tr/';
		if ($('#show-flag-loc')[0].checked === true && $('#show-flag-tr')[0].checked === true)
			flag = '/';
	}
	search_pattern = search_pattern.toLowerCase();
	if (search_pattern !== '') {
		var tablelines = trjs.transcription.tablelines();
		for (var i = 0; i < tablelines.length; i++) {
			// var tds = tablelines[i].children();
			var td;
			if (flag.indexOf('/loc/') !== -1)
				td = trjs.events.lineGetCell( $(tablelines[i]), trjs.data.CODECOL );
			else if (flag.indexOf('/tr/') !== -1)
				td = trjs.events.lineGetCell( $(tablelines[i]), trjs.data.TRCOL );
			else
				td = trjs.events.lineGetCell( $(tablelines[i]), trjs.data.CODECOL ) + ' ' + trjs.events.lineGetCell( $(tablelines[i]), trjs.data.TRCOL );
			if (td !== null && td.toLowerCase().indexOf(search_pattern) > -1)
				showTier($(tablelines[i]));
			else
				hideTier($(tablelines[i]));
		}
	}
}

/**
 * jump to a line number as set in the field #goline
 * @method userGoLine
 */
function userGoLine() {
	var line = $('#goline')[0].value;
	if (line !== '')
		trjs.events.goToLine(line);
}

/**
 * jump to a time as set in the field #gotime
 * @method userGoTime
 */
function userGoTime() {
	var tm = $('#gotime')[0].value;
	if (tm !== '' && tm !== null && tm !== undefined) {
		trjs.events.goToTime('partition', tm);
		var t;
		if (tm.indexOf('m') !== 0) {
			t = tm.match(/(\d+)mn?(\d+)s/);
			if (t !== null)
				trjs.events.goToTime('partition', parseInt(t[1]*60)+parseInt(t[2]), true);
		} else {
			t = parseFloat(tm);
			if (!isNaN(t))
				trjs.events.goToTime('partition', t, true);
		}
	}
}

/**
 * hide a line and all dependent lines if necessary
 * @method hideTier
 * @param {jquery-object} line of TR
 */
function hideTier(tr) {
	tr.hide();
	tr.attr('visible', tr.attr('visible') & 2);
	if ( trjs.transcription.typeTier(tr) != 'loc' ) return;
	var next = tr.next();
	while (next !== null && next.length>0) {
		if ( trjs.transcription.typeTier(next) == 'loc' ) return;
		next.hide();
		next.attr('visible', tr.attr('visible') & 2);
		next = next.next();
	}
}

/**
 * show a line and all dependent lines if necessary
 * @method showTier
 * @param {jquery-object} line of TR
 */
function showTier(tr) {
	tr.show();
	tr.attr('visible', (tr.attr('visible') & 2) | 1);
	if ( trjs.transcription.typeTier(tr) != 'loc' ) return;
	var next = tr.next();
	while (next !== null && next.length>0) {
		if ( trjs.transcription.typeTier(next) == 'loc' ) return;
		next.show();
		next.attr('visible', (tr.attr('visible') & 2) | 1);
		next = next.next();
	}
}

/**
 * hide a div and all dependent lines if necessary
 * @method hideDiv
 * @param event
 * @param {jquery-object} line of TR
 */
function hideDiv(e, tr) {
	if (tr === undefined) tr = trjs.data.selectedLine;
	if (trjs.transcription.typeTier(tr) !== 'div') {
		trjs.log.alert(trjs.messgs.ediv);
		return;
	}
	trjs.events.lineSetCell(tr, trjs.data.CODECOL, '=div=');
	tr.attr('visible', tr.attr('visible') & 1);
	var divs = 1;
	var next = tr.next();
	while (next !== null && next.length>0 && divs > 0) {
		if ( trjs.transcription.codeTier(next) === '-div-' )
			divs--;
		else if ( trjs.transcription.codeTier(next) === '+div+' || trjs.transcription.codeTier(next) === '=div=' )
			divs++;
		next.hide();
		next.attr('visible', tr.attr('visible') & 1);
		next = next.next();
	}
}

/**
 * show a lindive and all dependent lines if necessary
 * @method showDiv
 * @param event
 * @param {jquery-object} line of TR
 */
function showDiv(e, tr) {
	if (tr === undefined) tr = trjs.data.selectedLine;
	if (trjs.transcription.typeTier(tr) !== 'div') {
		trjs.log.alert(trjs.messgs.ediv);
		return;
	}
	trjs.events.lineSetCell(tr, trjs.data.CODECOL, '+div+');
	tr.attr('visible', (tr.attr('visible') & 1) | 2);
	var divs = 1;
	var next = tr.next();
	while (next !== null && next.length>0 && divs > 0) {
		if ( trjs.transcription.codeTier(next) === '-div-' )
			divs--;
		else if ( trjs.transcription.codeTier(next) === '+div+' || trjs.transcription.codeTier(next) === '=div=' )
			divs++;
		next.show();
		next.attr('visible', (tr.attr('visible') & 1) | 2);
		next = next.next();
	}
}

function reloadSystem(type) {
	trjs.param.restart = 'update';
	trjs.param.saveStorage();
	var message = (type === 'node')
		? trjs.messgs.emsg1
		: trjs.messgs.emsg2;
	bootbox.confirm(message, function(result) {
		if (result === true)
			window.location.href = "transcriberjs.html";
		else
			trjs.log.boxalert(trjs.messgs.emsg3);
	});
}

function updateCheck() {
	if (trjs.param.level < 'level6') return;
	trjs.system.updateCheck(
		{version: (trjs.param.lastversion?trjs.param.lastversion:version.version)},
		function(mess) {
			if (mess.indexOf('restart:') === 0) {
				trjs.param.lastversion = mess.substr(8);
				trjs.param.saveStorage();
				reloadSystem();
			} else if (mess.indexOf('restartnode:') === 0) {
				trjs.param.lastversion = mess.substr(12);
				trjs.param.saveStorage();
				reloadSystem('node');
			} else if (mess === 'nothing to do')
				trjs.log.alert(trjs.messgs.ennv);
			else
				trjs.log.alert(trjs.messgs.eerup, mess);
		},
		function(data) {
			trjs.log.alert('update_check: ' + data.status + ' ' + data.responseText);
		});
}

function updateClean() {
	if (trjs.param.level < 'level6') return;
	trjs.system.updateClean(
		{},
		function(mess) {
			trjs.log.alert("cleaning installation files " + mess);
		},
		function(data) {
			trjs.log.alert('update_clean: ' + data.status + ' ' + data.responseText);
		});
}

return {
	about: about,
	finalizeLoad: finalizeLoad,
	goHelp: goHelp,
	goHelpLocal: goHelpLocal,
	goSearch: goSearch,
	userGoLine: userGoLine,
	userGoTime: userGoTime,
	hideDiv: hideDiv,
	hideElements: hideElements,
	init: init,
	nextSearch: nextSearch,
	openTranscript: function() { trjs.filetree.initChooseFile('transcript', 'transcript'); },
	openMedia: function() { trjs.filetree.initChooseFile('media', 'mediaload'); },
	ortolang: ortolang,
	prevSearch: prevSearch,
	setReorder: setReorder,
	resetElements: resetElements,
	resizeTranscript: resizeTranscript,
	save: function() { trjs.io.innerSave(); trjs.io.serverSave(); },
	setBackwardStep: setBackwardStep,
	setForwardStep: setForwardStep,
	setFormatTime: setFormatTime,
	setInitParam: setInitParam,
	setInsert: setInsert,
	setLanguage: setLanguage,
	setNbDigits: setNbDigits,
	setNbSaves: setNbSaves,
    setNbVisible: setNbVisible,
	setLocNames: setLocNames,
	setMedia: setMedia,
	setNums: setNums,
	setPartition: setPartition,
	setShowLinkTime: setShowLinkTime,
	setUseQuality: setUseQuality,
	setWave: setWave,
	showCheck: showCheck,
	showDiv: showDiv,
	showElements: showElements,
	showLine: function(e) { showSearch(); $('#goline').focus() },
	showMetadata: showMetadata,
	showOpensaveMedia: showOpensaveMedia,
	showOpensaveTranscript: showOpensaveTranscript,
	showParams: showParams,
	showParticipant: showParticipant,
	showSearch: function(e) { showSearch(); $('#search-elts').focus(); },
	showTemplate: showTemplate,
	showTime: function(e) { showSearch(); $('#gotime').focus() },
	testNotSave: testNotSave,
	toggleInsert: toggleInsert,
	updateCheck: updateCheck,
	updateClean: updateClean,
};
})();
