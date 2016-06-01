/**
 * All functions that allows to control the medio (sound or text)
 * Date: july 2013
 * @author Christophe Parisse
 * @module Media
 */

'use strict';

trjs.media = (function(){

/*
 * event listeners
 */

/**
 * test the position of the media and move transcription if it has changed a lot since last time
 * @method timeUpdateListener
 */
function timeUpdateListener() {
    var media = $('#media-display')[0].firstElementChild;
    if (media) adjustRealInfo.show(media);
}

/**
 * adjust the partition time to the time of the media
 * do not adjust if the differences are smaller than 1/1000 of seconds
 * @method adjustRealInfo.show
 */
var adjustRealInfo = ( function() {
	var otm = 0;
	return {
		show: function(media) {
			try {
				var ct = media.currentTime;
			} catch(e) {
				return;
			}
		    var ntm = Math.floor(ct*1000);
		    if (ntm !== otm) {
			    trjs.dmz.setCurrentTimeText(ct, "wave"); // draw the time text, the vertical line and the wave - if block mode, draws the partition and sets the lime
			    otm = ntm;
		    }
		},
	};
})();

/**
 * stop the playing media at the time value set in media.endplay 
 * @method ctrlFromTo
 */
function ctrlFromTo() {
    var media = $('#media-display')[0].firstElementChild;
    if (media.currentTime >= media.endplay) {
        media.pause();
        media.lastPosition = media.currentTime;
	    media.lastTime = (new Date()).getTime();
        media.removeEventListener('timeupdate', ctrlFromTo);
        media.addEventListener('timeupdate', timeUpdateListener, false);
	    if (media.s1) dehighlight(media.s1);
	    if (media.s2) dehighlight(media.s2);
	    if (media.s3) dehighlight(media.s3);
	    media.s1 = null;
	    media.s2 = null;
	    media.s3 = null;
        media.endplay = -1;
	    trjs.param.isContinuousPlaying = false;
    } else
	    adjustRealInfo.show(media);
}

/**
 * jump transcript when playing media at the time value set in media.endplay and element in media.endElement
 * to next cell with time in it 
 * @method ctrlContinuousFromTo
 */
function ctrlContinuousFromTo() {
    var media = $('#media-display')[0].firstElementChild;
    if (media.currentTime >= media.endplay) {
    	if (media.endElement == null) return;
	    dehighlight(media.startElement);
	    highlight(media.endElement);
	    
	    var d = $('#transcription-bench');
	    var m = trjs.utils.notVisibleInContainer(d, media.endElement);
	    if (m != 0) {
	    	//console.log("should scroll");
	    	var vPos = d.scrollTop();
	    	d.animate( {scrollTop: vPos+m}, 0);
	    }
	    // find next element to be highlihted
	    var nxt = nextHighlight(media.endElement);

		// set nxt to be selected
		// trjs.events.setSelectedLine(media.endElement, 'nowave');  // the wave is drawn by adjustRealInfo
			
	    media.startElement = media.endElement;
		media.endElement = nxt;
	    media.endplay = trjs.events.lineGetCell(nxt, trjs.data.TSCOL);
	    // display the current and remaining times
	    // media.addEventListener("timeupdate", ctrlContinuousFromTo, false);
    }
    adjustRealInfo.show(media);
}

/*
 * list of other functions
 */

/**
 * starts and stop media (on/off)
 * @method playPause
 */
function playPause(e) {
	if (trjs.param.isContinuousPlaying === true) {
		endContinuousPlay();
		return;
	}
    var media = $('#media-display')[0].firstElementChild;
    if (media.paused) {
        media.play();
		media.addEventListener('timeupdate', timeUpdateListener, false);
    } else
        media.pause();
}

/**
 * starts and stop media (on/off)
 * but jump where the video/audio time is.
 * @method playJump
 */
function playJump(e) {
	if (trjs.param.isContinuousPlaying === true) {
		endContinuousPlay();
		return;
	}
    var media = $('#media-display')[0].firstElementChild;
   	trjs.events.goToTime('wave');  // synchronizes the partition and transcription with the current time in the media : the wave is already set
    if (media.paused) {
        media.play();
		media.addEventListener('timeupdate', timeUpdateListener, false);
    } else
        media.pause();
}

/**
 * starts and stop media (on/off)
 * or if the current media time is not in the current line of transcription
 * starts media from begining line
 * @method playCurrent
 */
function playCurrent(e) {
	if (trjs.param.isContinuousPlaying === true) {
		endContinuousPlay();
		return;
	}
    var media = $('#media-display')[0].firstElementChild;
    if (media.paused) {
		try {
			var pt = Number(media.currentTime);
		} catch (e) {
			return;
		}
	    var s = trjs.events.lineGetCell(trjs.data.selectedLine, trjs.data.TSCOL);
	    var e = trjs.events.lineGetCell(trjs.data.selectedLine, trjs.data.TECOL);
	    if (s !== '' && e !== '' && (pt < Number(s) || pt > Number(e))) // the media is not in the current line.
	    	media.currentTime = Number(s);
        media.play();
		media.addEventListener('timeupdate', timeUpdateListener, false);
    } else
        media.pause();
}

/**
 * starts media from begining line but do not stop.
 * @method playStartLine
 */
function playStartLine(e) {
	if (trjs.param.isContinuousPlaying === true) {
		endContinuousPlay();
		return;
	}
    var media = $('#media-display')[0].firstElementChild;
    media.pause();
	var sel = trjs.data.selectedLine;
	sel = trjs.events.findLineToStart(sel);
	if (sel == null) return;
	var ts = trjs.events.lineGetCell(sel, trjs.data.TSCOL);
	if (ts !== '') media.currentTime = ts;
// not necessary:   	trjs.events.goToTime('wave');
    media.play();
	media.addEventListener('timeupdate', timeUpdateListener, false);
}

function playSlower(e)  {
    var media = $('#media-display')[0].firstElementChild;
	media.playbackRate = media.playbackRate / 2;
}

function playFaster(e)  {
    var media = $('#media-display')[0].firstElementChild;
	media.playbackRate = media.playbackRate * 2;
}

function playReverse(e)  {
    var media = $('#media-display')[0].firstElementChild;
	media.playbackRate = - media.playbackRate;
}

function playNormal(e)  {
    var media = $('#media-display')[0].firstElementChild;
	media.playbackRate = 1;
}

/**
 * change size of media to big
 * @method changeToBig
 */
function changeToBig(e) {
	changeToSize(480);
}

/**
 * change size of media to medium
 * @method changeToNormal
 */
function changeToMedium(e) {
	changeToSize(240);
}

/**
 * change size of media to small
 * @method changeToSmall
 * @deprecated
 */
function changeToSmall(e) {
	changeToSize(120);
}

/**
 * change size of media to medium
 * @method changeToStandard
 */
function changeToStandard(e) {
    var media = $('#media-display')[0].firstElementChild;
    media.height = media.videoHeight;
    $('#media-bench').width(media.videoWidth);
	trjs.editor.resizeTranscript();
}

/**
 * change size of media to param value
 * @method changeToDefault
 */
function changeToDefault(e) {
	var ns = trjs.param.videoHeight;
	if (ns>480) ns = 480;
	if (ns<120) ns = 120;
	changeToSize(ns);
}

/**
 * change size of media to small
 * @method changeToSize
 */
function changeToSize(size) {
    var media = $('#media-display')[0].firstElementChild;
    media.height = size;
    var ratio = media.videoWidth / media.videoHeight;
    $('#media-bench').width(media.height*ratio);
	trjs.editor.resizeTranscript();
}

/**
 * control the size of the media window : 120 small - 480 big
 * @property trjs.data.videoWidth 
 */

/**
 * change size of media to bigger than before or big as maximum
 * @method makeBig
 */
function makeBig(e) {
	var ns = trjs.param.videoHeight * 1.2;
	if (ns>480) ns = 480;
	changeToSize(ns);
	trjs.param.videoHeight = ns;
	trjs.param.saveStorage();
}

/**
 * change size of media to smaller than before or small as maximum
 * @method makeSmall
 */
function makeSmall(e) {
	var ns = trjs.param.videoHeight / 1.2;
	if (ns<120) ns = 120;
	changeToSize(ns);
	trjs.param.videoHeight = ns;
	trjs.param.saveStorage();
}

/**
 * get the value of the current time of the media
 * @method getTime
 * @return {float} time in seconds
 */
function getTime() {
    var media = $('#media-display')[0].firstElementChild;
    if (media && media.currentTime)
	    return media.currentTime;
	else
		return '';
}

/**
 * set the time of the current media
 * @method setTime
 * @param {number} time to set to media.currentTime
 */
function setTime(pt) {
	if (pt==='') return;
    var media = $('#media-display')[0].firstElementChild;
	pt = Number(pt);
    if (media && media.currentTime && !isNaN(pt)) {
	    media.currentTime = pt;
    }
}

/**
 * rewind the media by one scroll
 * @method backwardStep
 */
function pageleft(e) {
    var media = $('#media-display')[0].firstElementChild;
    if (media.currentTime > trjs.dmz.winsize())
        media.currentTime = media.currentTime - (trjs.dmz.winsize()*trjs.dmz.pagePercentage);
    else
        media.currentTime = 0;
    if (trjs.param.synchro.block() === true) {
    	trjs.events.goToTime('partition', media.currentTime); // the wave is not already set
    }
}

/**
 * fast-forward the media by one scroll
 * @method forwardStep
 */
function pageright(e) {
    var media = $('#media-display')[0].firstElementChild;
    media.currentTime = media.currentTime + (trjs.dmz.winsize()*trjs.dmz.pagePercentage);
    if (trjs.param.synchro.block() === true) {
    	trjs.events.goToTime('partition', media.currentTime); // the wave is not already set
    }
}

/**
 * rewind the media by backwardskip seconds
 * @method backwardStep
 */
function backwardStep(e) {
    var media = $('#media-display')[0].firstElementChild;
    if (media.currentTime > trjs.param.backwardskip)
        media.currentTime = media.currentTime - trjs.param.backwardskip;
    else
        media.currentTime = 0;
}

/**
 * fast-forward the media by forwardskip seconds
 * @method forwardStep
 */
function forwardStep(e) {
    var media = $('#media-display')[0].firstElementChild;
    media.currentTime = media.currentTime + trjs.param.forwardskip;
}

/**
 * play the media from one time to another (uses media.endplay) 
 * @method runFromTo
 * @param {float} starting point in time
 * @param {float} ending point in time
 * @param {jquery-object} headline to be highlighted
 * @param {jquery-object} headline to be highlighted
 * @param {jquery-object} headline to be highlighted
 */
function runFromTo(start, end, s1, s2, s3) {
    var media = $('#media-display')[0].firstElementChild;
    media.pause();
    media.currentTime = start;
    media.endplay = end;
    if (s1) highlight(s1);
    if (s2) highlight(s2);
    if (s3) highlight(s3);
    media.s1 = s1;
    media.s2 = s2;
    media.s3 = s3;
    //  display the current and remaining times
    media.addEventListener("timeupdate", ctrlFromTo, false);
    trjs.param.isContinuousPlaying = true;
    media.play();
}

/**
 * find the next line with time end information
 * @method nextHighlight
 * @param jQuery pointer to a TR line
 * @return pointer to a TR line (jquery-object)
 */
function nextHighlight(tr) {
//	if (tr == null) return;
	while(true) {
	    //console.log(tr);
		tr = tr.next();
		if (tr == null || tr.length === 0) {
			endContinuousPlay();
			return null;
		}
		var te = trjs.events.lineGetCell(tr, trjs.data.TSCOL);
		if (te !== '' && te > 0)
			return tr;
	}
}

/**
 * highlight the current TR table line and dependent lines and other locutors with no time references
 * @method highlight
 * @param jQuery pointer to a TR line
 */
function highlight(tr) {
	while (tr != null && tr.length > 0) {
		tr = highlight0(tr);
		if ( trjs.events.lineGetCell(tr, trjs.data.TSCOL) != '' || trjs.events.lineGetCell(tr, trjs.data.TECOL) != '' )
			break;
	}
}

/**
 * highlights the current TR table line and dependent lines
 * @method highlight0
 * @param jQuery pointer to a TR line
 * @return next line
 */
function highlight0(tr) {
	tr.css('background-color', '#BBF');
	var next = tr.next();
	while (next != null && next.length>0) {
		if ( trjs.transcription.typeTier(next) == 'loc' ) break;
		next.css('background-color','#CCF');
		next = next.next();
	}
	return next;
}

/**
 * remove highlight from the current TR table line and dependent lines and other locutors with no time references
 * @method dehighlight
 * @param jQuery pointer to a TR line
 */
function dehighlight(tr) {
	while (tr != null && tr.length > 0) {
		tr = dehighlight0(tr);
		if ( trjs.events.lineGetCell(tr, trjs.data.TSCOL) != '' || trjs.events.lineGetCell(tr, trjs.data.TECOL) != '' )
			break;
	}
}

/**
 * remove highlight from the current TR table line and dependent lines
 * @method dehighlight0
 * @param jQuery pointer to a TR line
 */
function dehighlight0(tr) {
	tr.css('background-color', tr.attr('backcolor'));
	var next = tr.next();
	while (next != null && next.length>0) {
		if ( trjs.transcription.typeTier(next) == 'loc' ) break;
		next.css('background-color', next.attr('backcolor'));
		next = next.next();
	}
	return next;
}

/**
 * stop continuous play
 * @method endContinuousPlay
 */
function endContinuousPlay() {
    var media = $('#media-display')[0].firstElementChild;
    media.pause();
    dehighlight(media.startElement);
    media.lastPosition = media.currentTime;
    media.lastTime = (new Date()).getTime();
    media.removeEventListener('timeupdate', ctrlFromTo);
	media.addEventListener('timeupdate', timeUpdateListener, false);
    media.endplay = -1;
    media.endElement = null;
    trjs.param.isContinuousPlaying = false;
}

/**
 * run lines of transcription in continuous fashion
 * play the media from one time continuously (uses media.endplay and media.endElement) 
 * @method runContinuous
 * @param {float} timestart
 * @param {object} current tr of transcript table
 */
function runContinuous(start, currentTR) {
	if (trjs.param.isContinuousPlaying === true) {
		endContinuousPlay();
		return;
	}
    var media = $('#media-display')[0].firstElementChild;
    media.currentTime = start;
    media.play();
    //console.log(currentTR);
    highlight(currentTR);
    media.startElement = currentTR;
    // find next element to be highlihted
    var nxt = nextHighlight(currentTR);

	// set nxt to be selected
	trjs.events.setSelectedLine(currentTR);

	media.endElement = nxt;
    media.endplay = trjs.events.lineGetCell(nxt, trjs.data.TSCOL);
    //  display the current and remaining times
    media.addEventListener("timeupdate", ctrlContinuousFromTo, false);
    trjs.param.isContinuousPlaying = true;
}

function display(p) {
	if (p === undefined || p === true || p === 'loaded') {
		$('.imedia').show();
		if (trjs.wave && trjs.wave.isVisible()) $('#wave').show();
		$('#media-display').unbind('click');
	} else if (p === 'notloaded') {
		$('.imedia').hide();
		$('#wave').hide();
		$('#media-display').click(function() {
            if (trjs.param.mode === 'readwrite')
//              trjs.editor.openMedia();
                trjs.filetree.initChooseFile('media', 'media'); 
            else
                trjs.editor.showOpensaveMedia();
        });
	}
}

return {
	backwardStep: function(e) { backwardStep(e); },
	changeToBig: function(e) { changeToBig(e); },
	changeToMedium: function(e) { changeToMedium(e); },
	changeToDefault: function(e) { changeToDefault(e); },
	changeToStandard: function(e) { changeToStandard(e); },
	changeToSmall: function(e) { changeToSmall(e); },
	display: function(p) { display(p); },
	endContinuousPlay: function(e) { endContinuousPlay(e); },
	forwardStep: function(e) { forwardStep(e); },
	getTime: function() { return getTime(); },
	setTime: function(t) { setTime(t); },
	makeBig: function(e) { makeBig(e); },
	makeSmall: function(e) { makeSmall(e); },
	pageleft: function() { pageleft(); },
	pageright: function() { pageright(); },
	playCurrent: function(e) { playCurrent(e); },
	playFaster: function(e) { playFaster(e); },
	playFromWave: function(e) {
		if (trjs.param.synchro.block())
			trjs.events.goContinuous(e);
		else if (trjs.param.synchro.control())
			trjs.media.playJump(e);
		else
			trjs.media.playPause(e);
	},
	playFromPartition: function(e) {
		if (trjs.param.synchro.block())
			trjs.events.goContinuous(e);
		else
			trjs.media.playCurrent();
	},
	playJump: function(e) { playJump(e); },
	playNormal: function(e) { playNormal(e); },
	playPause: function(e) { playPause(e); },
	playReverse: function(e) { playReverse(e); },
	playSlower: function(e) { playSlower(e); },
	playStartLine: function(e) { playStartLine(e); },
	runContinuous: function(s, c) { runContinuous(s, c); },
	runFromTo: function(s, e, p1, p2, p3) { runFromTo(s, e, p1, p2, p3); },
	timeUpdateListener: function() { timeUpdateListener(); },
};
})();
