/**
 * All functions that allows to control the medio (sound or text)
 * Date: july 2013
 * @author Christophe Parisse
 * @module Media
 */

'use strict';

trjs.media = (function () {

    /*
     * event listeners
     */
    var media_clock = null;
    var media = null;

    function setMedia() {
        if (!media) media = $('#media-display')[0].firstElementChild;
    }

    function resetMedia() {
        media = null;
    }

    function setTimer(event) {
        if (event === 'standard') {
            clearInterval(media_clock);
            // media.removeEventListener('timeupdate', ctrlFromTo);
            media.removeEventListener('timeupdate', ctrlContinuousFromTo);
            media.addEventListener('timeupdate', timeUpdateListener, false);
        } else if (event === 'fromto') {
            media.removeEventListener('timeupdate', timeUpdateListener);
            media.removeEventListener('timeupdate', ctrlContinuousFromTo);
            // media.addEventListener("timeupdate", ctrlFromTo, false);
            media_clock = setInterval(ctrlFromTo, 100);
        } else if (event === 'continuous') {
            clearInterval(media_clock);
            // media.removeEventListener('timeupdate', ctrlFromTo);
            media.removeEventListener('timeupdate', timeUpdateListener);
            media.addEventListener('timeupdate', ctrlContinuousFromTo, false);
        }
    }

    /**
     * test the position of the media and move transcription if it has changed a lot since last time
     * @method timeUpdateListener
     */
    function timeUpdateListener() {
        setMedia();
        try {
            if (media) adjustRealInfo.show(media);
        } catch(e) {
            console.log(e);
        }
    }

    /**
     * adjust the partition time to the time of the media
     * do not adjust if the differences are smaller than 1/1000 of seconds
     * @method adjustRealInfo.show
     */
    var adjustRealInfo = (function () {
        var otm = 0;
        return {
            show: function (media) {
                try {
                    var ct = media.currentTime;
                } catch (e) {
                    return;
                }
                var ntm = Math.floor(ct * 1000);
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
        setMedia();
        if (media.currentTime >= media.endplay) {
            setTimer('standard');
            media.pause();
            media.lastPosition = media.currentTime;
            media.lastTime = (new Date()).getTime();
            if (media.s1) dehighlight(media.s1);
            if (media.s2) dehighlight(media.s2);
            if (media.s3) dehighlight(media.s3);
            media.s1 = null;
            media.s2 = null;
            media.s3 = null;
            media.currentTime = media.endplay;
            adjustRealInfo.show(media);
            media.endplay = -1;
            trjs.param.isContinuousPlaying = false;
        } else
            adjustRealInfo.show(media);
    }

    /**
     * jump transcript when playing media at the time value set in media.endplay and element in media.nextElement
     * to next cell with time in it
     * @method ctrlContinuousFromTo
     */
    function ctrlContinuousFromTo() {
        setMedia();
        if (!media.play) {
            // media not loaded
            trjs.log.alert("media not loaded or not ready: cannot play");
            return;
        }
        if (media.currentTime >= media.endplay) {
            console.log("in>", media.currentTime, media.endplay, media.currentElement, media.nextElement);
            if (media.nextElement === null) {
                endContinuousPlay();
                return;
            }
            console.log("go on!");
            dehighlight(media.currentElement);
            highlight(media.nextElement);
            media.currentElement = media.nextElement;
            media.endplay = trjs.events.lineGetCell(media.currentElement, trjs.data.TECOL);

            var d = $('#transcription-bench');
            var m = trjs.utils.notVisibleInContainer(d, media.currentElement);
            if (m != 0) {
                //console.log("should scroll");
                var vPos = d.scrollTop();
                d.animate({scrollTop: vPos + m}, 0);
            }

            // find next element to be highlighted
            var nxt = nextHighlight(media.nextElement);
            // set nxt to be selected

            if (nxt === null) {
                // set nxt to be selected next time
                media.nextElement = null;
            } else {
                media.nextElement = nxt;
            }
            // display the current and remaining times
            console.log("out>", media.currentTime, media.endplay, media.currentElement, media.nextElement);
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
        setMedia();
        if (media.paused) {
            media.play();
            setTimer('standard');
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
        setMedia();
        trjs.events.goToTime('wave');  // synchronizes the partition and transcription with the current time in the media : the wave is already set
        if (media.paused) {
            media.play();
            setTimer('standard');
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
        setMedia();
        if (media.paused) {
            try {
                var pt = Number(media.currentTime);
            } catch (e) {
                return;
            }
            var s = trjs.events.lineGetCell(trjs.data.selectedLine, trjs.data.TSCOL);
            var e = trjs.events.lineGetCell(trjs.data.selectedLine, trjs.data.TECOL);
            // do not change time if not necessary
            if (s !== '' && e !== '' && (pt < Number(s) || pt > Number(e))) // the media is not in the current line.
                media.currentTime = Number(s);
            media.play();
            setTimer('standard');
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
        setMedia();
        media.pause();
        var sel = trjs.data.selectedLine;
        sel = trjs.events.findLineToStart(sel);
        if (sel == null) return;
        var ts = trjs.events.lineGetCell(sel, trjs.data.TSCOL);
        if (ts !== '') media.currentTime = ts;
// not necessary:   	trjs.events.goToTime('wave');
        media.play();
        setTimer('standard');
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

        setTimer('fromto');
        trjs.param.isContinuousPlaying = true;
        media.play();
    }

    /**
     * find the next line with time end information
     * @method nextHighlight
     * @param tr jQuery pointer to a TR line
     * @return pointer to a TR line (jquery-object)
     */
    function nextHighlight(tr) {
        while (true) {
            //console.log(tr);
            tr = tr.next();
            if (!tr || tr.length === 0) {
                //endContinuousPlay();
                return null;
            }
            var te = trjs.events.lineGetCell(tr, trjs.data.TSCOL);
            if (!te) // te === null or te === 0 or te === ''
                return null;
            else
                return tr;
        }
    }

    /**
     * highlight the current TR table line and dependent lines and other locutors with no time references
     * @method highlight
     * @param jQuery pointer to a TR line
     */
    function highlight(tr) {
        while (tr && tr.length > 0) {
            tr = highlight0(tr);
            if (trjs.events.lineGetCell(tr, trjs.data.TSCOL) || trjs.events.lineGetCell(tr, trjs.data.TECOL))
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
        while (next != null && next.length > 0) {
            if (trjs.transcription.typeTier(next) == 'loc') break;
            next.css('background-color', '#CCF');
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
            if (trjs.events.lineGetCell(tr, trjs.data.TSCOL) != '' || trjs.events.lineGetCell(tr, trjs.data.TECOL) != '')
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
        while (next != null && next.length > 0) {
            if (trjs.transcription.typeTier(next) == 'loc') break;
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
        setMedia();
        if (media.pause) media.pause();
        dehighlight(media.currentElement);
        media.lastPosition = media.currentTime;
        media.lastTime = (new Date()).getTime();

        setTimer('standard');

        media.endplay = -1;
        media.nextElement = null;
        trjs.param.isContinuousPlaying = false;
    }

    /**
     * run lines of transcription in continuous fashion
     * play the media from one time continuously (uses media.endplay and media.nextElement)
     * @method runContinuous
     * @param {float} timestart
     * @param {object} current tr of transcript table
     */
    function runContinuous(start, currentTR) {
        if (trjs.param.isContinuousPlaying === true) {
            endContinuousPlay();
            return;
        }
        setMedia();
        if (!media.play) {
            // media not loaded
            trjs.log.alert("media not loaded or not ready: cannot play");
            return;
        }
        media.currentTime = start;
        media.endplay = trjs.events.lineGetCell(currentTR, trjs.data.TECOL);
        var playPromise = media.play();
        if (playPromise !== undefined) {
            playPromise.then(function(_) {
                // playback started!
                // We can now safely pause video...
                //console.log(currentTR);
                highlight(currentTR);
                trjs.events.setSelectedLine(currentTR);
                media.currentElement = currentTR;
                // find next element to be highlihted
                var nxt = nextHighlight(currentTR);

                if (nxt === null) {
                    // set nxt to be selected next time
                    media.nextElement = null;
                } else {
                    media.nextElement = nxt;
                }
                //  display the current and remaining times
                setTimer('continuous');
                trjs.param.isContinuousPlaying = true;
            })
            .catch(function(error) {
                    // play was prevented
                    // do nothing.
                trjs.log.alert('cannot play mdeia');
            });
        }
    }

    function display(p) {
        if (p === undefined || p === true || p === 'loaded') {
            $('.imedia').show();
            if (trjs.wave && trjs.wave.isVisible()) $('#wave').show();
            $('#media-display').unbind('click');
        } else if (p === 'notloaded') {
            $('.imedia').hide();
            $('#wave').hide();
            $('#media-display').click(function (e) {
                // console.log(trjs.media.openMediaRunning);
                if (trjs.media.openMediaRunning === true) return;
                trjs.media.openMediaRunning = true;
                // console.log(e);
                if (trjs.param.mode === 'readwrite') {
//              trjs.editor.openMedia();
                    fsio.chooseFile('media', 'media');
                    $('#media-display').unbind('click');
                }
                else {
                    trjs.editor.showOpensaveMedia();
                    $('#media-display').unbind('click');
                }
                //trjs.media.openMediaRunning = false;
            });
        }
    }

    function playSlower(e) {
        setMedia();
        media.playbackRate = media.playbackRate / 2;
    }

    function playFaster(e) {
        setMedia();
        media.playbackRate = media.playbackRate * 2;
    }
    /*
        function playReverse(e) {
            setMedia();
            media.playbackRate = -media.playbackRate;
        }
    */
    function playNormal(e) {
        setMedia();
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
        setMedia();
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
        if (ns > 480) ns = 480;
        if (ns < 120) ns = 120;
        changeToSize(ns);
    }

    /**
     * change size of media to small
     * @method changeToSize
     */
    function changeToSize(size) {
        setMedia();
        media.height = size;
        var ratio = media.videoWidth / media.videoHeight;
        $('#media-bench').width(media.height * ratio);
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
        if (ns > 480) ns = 480;
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
        if (ns < 120) ns = 120;
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
        setMedia();
        if (media) {
            if (media.currentTime === "NaN") {
                trjs.log.alert('The media is not working. Cannot insert time mark.');
                return '';
            }
            return media.currentTime;
        } else {
            trjs.log.alert('The media is not initiatized. Cannot insert time mark.');
            return '';
        }
    }

    /**
     * set the time of the current media
     * @method setTime
     * @param {number} time to set to media.currentTime
     */
    function setTime(pt) {
        if (pt === '') return;
        setMedia();
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
        setMedia();
        if (media.currentTime > trjs.dmz.winsize())
            media.currentTime = media.currentTime - (trjs.dmz.winsize() * trjs.dmz.pagePercentage);
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
        setMedia();
        media.currentTime = media.currentTime + (trjs.dmz.winsize() * trjs.dmz.pagePercentage);
        if (trjs.param.synchro.block() === true) {
            trjs.events.goToTime('partition', media.currentTime); // the wave is not already set
        }
    }

    /**
     * rewind the media by backwardskip seconds
     * @method backwardStep
     */
    function backwardStep(e) {
        setMedia();
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
        setMedia();
        media.currentTime = media.currentTime + trjs.param.forwardskip;
    }

    return {
        openMediaRunning: false,
        backwardStep: backwardStep,
        changeToBig: changeToBig,
        changeToMedium: changeToMedium,
        changeToDefault: changeToDefault,
        changeToStandard: changeToStandard,
        changeToSmall: changeToSmall,
        display: display,
        endContinuousPlay: endContinuousPlay,
        forwardStep: forwardStep,
        getTime: getTime,
        setTime: setTime,
        makeBig: makeBig,
        makeSmall: makeSmall,
        pageleft: pageleft,
        pageright: pageright,
        playCurrent: playCurrent,
        playFaster: playFaster,
        playFromWave: function (e) {
            if (trjs.param.synchro.block())
                trjs.events.goContinuous(e);
            else if (trjs.param.synchro.control())
                trjs.media.playJump(e);
            else
                trjs.media.playPause(e);
        },
        playFromPartition: function (e) {
            if (trjs.param.synchro.block())
                trjs.events.goContinuous(e);
            else
                trjs.media.playCurrent();
        },
        playJump: playJump,
        playNormal: playNormal,
        playPause: playPause,
        playSlower: playSlower,
        playStartLine: playStartLine,
        runContinuous: runContinuous,
        runFromTo: runFromTo,
        setMedia: setMedia,
        resetMedia: resetMedia,
        timeUpdateListener: timeUpdateListener,
    };
})();
