/**
 * handles the drawing, moving and zooming of partition(s), and wave(s) and media(s)
 * this modules centralizes the interactions between the media(s), the partition(s) and the wave(s)
 * the relationships can be a little complex when there are several elements and, depending
 * from the situation, there are moving together or not.
 *
 * @author Christophe Parisse
 */

trjs.dmz = ( function() {

	var winsizeValue = 10; // size of window in second
	var sizeOfSecondValue = 100;

	var locs = {}; // names and number of elements for the locutors
	var sortLocs = null; // names of locs sorted by inverse frequency

	var zoomInMaxSet = false;
	var zoomOutMaxSet = false;
	var zoomInMax = function(flag) {
		if (flag === true) {
			if (zoomInMaxSet === true) return;
			$('#iconzoomin').html('<i class="iconcur fa fa-plus-square-o fa-lg" onclick=""></i>');
			zoomInMaxSet = true;
		} else {
			if (zoomOutMaxSet === false) return;
			$('#iconzoomout').html('<i class="iconcur fa fa-search-minus fa-lg" onclick="trjs.dmz.zoomOut();"></i>');
			zoomOutMaxSet = false;
		}
	};
	var zoomOutMax = function(flag) {
		if (flag === true) {
			if (zoomOutMaxSet === true) return;
			$('#iconzoomout').html('<i class="iconcur fa fa-minus-square-o fa-lg" onclick=""></i>');
			zoomOutMaxSet = true;
		} else {
			if (zoomInMaxSet === false) return;
			$('#iconzoomin').html('<i class="iconcur fa fa-search-plus fa-lg" onclick="trjs.dmz.zoomIn();"></i>');
			zoomInMaxSet = false;
		}
	};
/*
 * <span id='iconzoomin'><i class="iconcur fa fa-search-plus fa-lg" onclick="trjs.dmz.zoomIn();"></i></span>
 * <span id='iconzoomout'><i class="iconcur fa fa-search-minus fa-lg" onclick="trjs.dmz.zoomOut();"></i></span>
 */

	/**
	 * count number of occurences of all locutors
	 * @method countLoc
	 * @param {array-of-DOM-elements}
	 * sets locs and nblocs
	 */
	var countLoc = function() {
		var tablelines = trjs.transcription.tablelines();
		for (var i = 0; i < tablelines.length; i++) {
			var type = trjs.transcription.typeTier( $(tablelines[i]) );
			if ( type === 'div' || type === 'prop' ) continue;
			var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell( $(tablelines[i]), trjs.data.CODECOL));
			if (!locs[iloc]) {
				// create the loc and count.
				locs[iloc] = 1;
			} else
				locs[iloc]++;
		}
		sortLocs = Object.keys(locs).sort( function(a, b) { return -(locs[a] - locs[b]); } );
	};

	/**
	 * resets number of occurences of all locutors
	 * @method freeLoc
	 * unsets locs and nblocs
	 */
	var freeLoc = function() {
		locs = {}; // names and number of elements for the locutors
		sortLocs = null; // names of locs sorted by inverse frequency
	};

	return {

		/***********************************************************************
		 *
		 * COLORS
		 *
		 **********************************************************************/

		participantBackground: '#ee8a58', // color of the background for participant information at the right side of the partition
		participantText: '#000000', // color of the text for participant information at the right side of the partition
		drawRectStandard: '#88EAFF', // background of all partition rectangles
		drawRectRunning: '#B9FFB5', // background of the partition rectangle currently selected
		drawRectText: '#000000', // text of partition elements
		drawPartitionBackground: '#E3E3E3', // background for the whole partition
		basic: "#C2C2C2",
		basicWave: "#932C3D",
		basicLine: "#E18122",
		running: "#99FFCC",
		runningWave: "#2C3D93",
		selected: "#88BBFF",
		selectedWave: "#2C3D93",

		/***********************************************************************
		 *
		 * LOCUTORS
		 *
		 **********************************************************************/

		countLoc: function() { countLoc(); },
		freeLoc: function() { freeLoc(); },
		sortLoc: function(x) { return sortLocs[x]; },
		nbSortLoc: function() { return sortLocs === null ? 0 : sortLocs.length; },
		nbVisible: function() { if (trjs.partition) return trjs.partition.nbVisible(); else return 0; },
		// freeLoc();

		/***********************************************************************
		 *
		 * GENERAL
		 *
		 **********************************************************************/
		pagePercentage: 0.5, // size of page in proportion of a screen time width
		sliderWave: false, // true if slider wave is used and visible
		sliderPartition: true, // true if slider wave is used and visible

		adjustPartition: function() {
			// we may have changed the size of the wave winsize
			// we have to redaw the partition accordingly
			if (trjs.wave && trjs.wave.isReady() && trjs.partition.winsize() != trjs.wave.winsize()) {
				// adjust the winsize of the partition - toujours en fonction de wave.
				trjs.partition.winsize(trjs.wave.winsize());
				trjs.partition.sizeOfSecond(trjs.wave.sizeOfSecondValue);
			} else
				trjs.partition.sizeOfSecond(trjs.partition.effectiveWidth / trjs.partition.winsize());
		},
		clear: function() {
			trjs.io.mediaClear();
			if (trjs.wave) trjs.wave.clear();
			if (trjs.partition) trjs.partition.clear();
		},
		draw: function(start) {
		    if (trjs.wave && trjs.wave.isReady() && trjs.wave.isVisible())
				trjs.wave.visualizer.drawWave(trjs.wave.winsize(), start);
		    if (trjs.partition && trjs.partition.isReady() && trjs.partition.isVisible())
				trjs.partition.drawPartition(trjs.partition.winsize(), start);
		},
		/**
		 * display information about the location of the window
		 * method infoWindow
		 */
		infoWindow: function() {
			$('#startwindow').text(trjs.transcription.formatTime(trjs.dmz.zoomLeftPos()));
			$('#stopwindow').text(trjs.transcription.formatTime(trjs.dmz.zoomLeftPos()+trjs.dmz.winsize()));
		},
		init: function() {
            trjs.partition.setNbVisible(trjs.param.nbVisible);
			// init partition
			if (trjs.partition)
				trjs.partition.init();
			// init wave
			// this is done when the signal image is loaded
			trjs.dmz.sliderInit();
		},
		initVisible: function() {
			if (trjs.partition)
				trjs.partition.setVisible(trjs.param.showPartition);
			if (trjs.wave)
				trjs.wave.setVisible(trjs.param.showWave);
		},
		isPartition: function() {
			if (trjs.partition && trjs.partition.isVisible()) return true;
		},
		isWave: function() {
			if (trjs.wave && trjs.wave.isVisible()) return true;
		},
		redraw: function(value) {
			if ((value === 'wave' || value === undefined) && trjs.wave && trjs.wave.isReady())
				trjs.wave.visualizer.drawWave(trjs.wave.winsize(), trjs.wave.zoomLeftPos());
			if ((value === 'partition' || value === undefined) && trjs.partition && trjs.partition.isReady())
				trjs.partition.redrawPartition();
		},
		resetWidth: function() {
			if (trjs.wave && trjs.wave.isVisible()) {
				// if width has changed the canvas must be redisplayed
				trjs.wave.resetWidth();
			}
			if (trjs.partition && trjs.partition.isVisible()) {
				// if width has changed the canvas must be redisplayed
				trjs.partition.resetWidth();
			}
		},
		setVisible: function(value, pos) {
			if ((value === 'wave' || value === undefined) && trjs.wave) {
				trjs.wave.setVisible(pos);
				if (pos) {
					$('#zoomdisplay').show();
					$('#timewindow').show();
					$('#wave').show();
				} else {
					$('#timewindow').hide();
					$('#wave').hide();
					if (!trjs.partition.isVisible()) $('#zoomdisplay').hide();
				}
			}
			if ((value === 'partition' || value === undefined) && trjs.partition) {
				trjs.partition.setVisible(pos);
				if (pos) {
					$('#zoomdisplay').show();
					$('#button-page-left').show();
					$('#button-page-right').show();
				} else {
					$('#button-page-left').hide();
					$('#button-page-right').hide();
					if (!trjs.wave.isVisible()) $('#zoomdisplay').hide();
				}
			}
			if (value === 'media') {
				// trjs.media.setVisible(pos);
				if (pos)
					$('#media-cell').show();
				else
					$('#media-cell').hide();
			}
		},
		sizeOfSecond: function(v) { if (v !== undefined) sizeOfSecondValue = v;  return sizeOfSecondValue; },  // size of second in pixels
		sliderInit: function(t) {
			// if (trjs.wave) trjs.slider.initWave();
			if (trjs.partition) trjs.slider.initPartition();
		},
		sliderPopulate: function(t) {
			// if (trjs.wave && trjs.wave.isVisible('wave')) trjs.slider.populateWave(t);
			if (trjs.partition && trjs.partition.isVisible('partition')) trjs.slider.populatePartition(t);
		},

		/*
		 * draw at a certain time interval.
		 * set the start of the display window if necessary
		 * @method highlight
		 * @param {float} time of begining of sound in seconds
		 * @param {float} time of end of sound in seconds
		 * @param {integer} id of element (transcription line) // NOT USED HERE
		 * @param {string} color of display
		 */
		highlight: function(start, end, id, color, origin) {
			var notset1 = false, notset2 = false;
			if (trjs.partition && trjs.partition.isReady()) {
				trjs.dmz.infoWindow();
				trjs.partition.highlight(start, end, id, color);
				if (!trjs.wave && trjs.param.synchro.free() !== true && origin !== 'wave' && trjs.param.isContinuousPlaying !== true)
					trjs.media.setTime(start);
			} else
				notset1 = true;
			if (trjs.wave && trjs.wave.isReady() && trjs.param.synchro.free() !== true && origin !== 'wave') {
				// trjs.wave.infoWave();
				trjs.wave.highlight(start, end, id, color);
			} else
				notset2 = true;
			if (notset1 && notset2)
				trjs.media.setTime(start);
		},

		/*
		 * sets the display of the value of the time and draw the vertical line of the wave according to the media
		 * @method setZoomText
		 * @param {integer} time
		 */
		setCurrentTimeText: function(tm, origin) {
		    $('#currenttime').text(trjs.transcription.formatTime(tm));
		    var moved = -1;
		    if (trjs.wave) {
				moved = trjs.dmz.computeScrollPos(tm);
				if (trjs.wave.isReady()) {
					if (moved >= 0) {
						trjs.wave.zoomLeftPos(moved);
						trjs.wave.visualizer.drawWave(trjs.wave.winsize(), trjs.wave.zoomLeftPos());
					}
					trjs.wave.visualizer.drawWaveLine(tm);
				}
		    }
			if (trjs.param.synchro.block() || trjs.param.isContinuousPlaying === true) { // do this only in block mode or if explicitely called by runContinuous for example
				if (!trjs.partition || !trjs.partition.isReady()) {
					// it is not possible to use the partition to move: just move the text
					if (origin !== 'wave') // trjs.param.isContinuousPlaying !== true
						trjs.events.goToTime(origin); // sets the position of the current displayed line - time is not reset here
					return;
				}
				if (moved < 0 && trjs.partition) moved = trjs.dmz.computeScrollPos(tm);
				if (moved < 0) return;
				if (trjs.partition.isReady()) {
					trjs.partition.zoomLeftPos(moved);
					trjs.partition.drawPartition( trjs.partition.winsize(), trjs.partition.zoomLeftPos() );
					if (origin !== 'wave') // trjs.param.isContinuousPlaying !== true
						trjs.events.goToTime(origin); // sets the position of the current displayed line - time is not reset here
				}
			}
		},

		/*
		 * sets the display of the value of the zoom
		 * @method setZoomText
		 */
		setZoomText: function() {
		    var z = '0%';
		    if (trjs.dmz.winsize() === -1)
		    	z = 'Zoom Min';
		    else if (trjs.dmz.winsize() === 0)
		    	z = 'Zoom Max';
		    else if (trjs.dmz.winsize()) {
		    	z = (Math.round(trjs.dmz.winsize()*10)/10) + 'sec.';
		    }
		    $('#zoomvalue').text(z);
		    $('#currenttime').text(trjs.transcription.formatTime(0));
		    $('#starttime').text('');
		    $('#stoptime').text('');
		    $('#startwindow').text('');
		    $('#stoptwindow').text('');
		},

		/*
		 *  gets the position size in seconds of zoom windows
		 */
		zoomLeftPos: function() {
				if (trjs.wave) return trjs.wave.zoomLeftPos();
				if (trjs.partition) return trjs.partition.zoomLeftPos();
		},
		/*
		 *  gets and sets size in seconds of zoom windows
		 */
		winsize: function(p) {
			if (p !== undefined) {
				winsizeValue = p;
				if (trjs.partition) trjs.partition.winsize(p); // sets size in seconds of zoom windows
				if (trjs.wave) trjs.wave.winsize(p); // sets size in seconds of zoom windows
			}
			return winsizeValue;
		}, // gets size in seconds of zoom windows


		/***********************************************************************
		 *
		 * LOADING the FILES
		 *
		 **********************************************************************/

		/**
		 * load the image of the wave file
		 * @method localLoadWaveImage
		 * @param {string} filename
		 */
		localLoadWaveImage: function(f) {
			if (!trjs.wave || !trjs.wave.isVisible()) return;
			if (f.name.lastIndexOf('.wav') !== f.name.length-4)
				return false; // not a wave file
			var dataObject = window.URL.createObjectURL(oFiles[0]);
			trjs.wave.load(dataObject);
			return true;
		},

		/**
		 * load the image of the wave file
		 * @method serverLoadWaveImage
		 * @param {string} filename
		 */
		serverLoadWaveImage: function(name) {
			if (trjs.param.level < 'level4') return;
			// console.log("serverLoadImage " + name);
			if (!trjs.wave || !trjs.wave.isVisible()) return;
			trjs.system.convertToShortAudio(
				{ file: codefn.encodeFilename(name) },
				function (data) {
					// console.log('return from short wave ' + ok);
					trjs.wave.load(data);
				},
				function (data) {
					// console.log('return from short wave ' + ok);
					trjs.log.alert('Cannot find short wave file : ' + name + ' ++ ' + data);
				});
		},

		/***********************************************************************
		 *
		 * DRAWING the DATA
		 *
		 **********************************************************************/



		/*
		 * computes the new scroll position: used for wave and partition
		 * wave takes precedence other partition if both exist
		 * to be used only when jumping around
		 * @method computeScrollPos
		 * @param start time for the left part of the window
	     * @param notest : if true always returns the value of the left position
	     * @returns -1 if the scroll does not change, the value of the left position if it does change
		 */
		computeScrollPos: function (start, notest) {
		    if (trjs.wave && trjs.wave.isReady()) {
				// if start is in the current window do nothing
				if (start >= trjs.wave.zoomLeftPos() && start < trjs.wave.zoomLeftPos()+trjs.wave.winsize())
					return (notest===true) ? trjs.wave.zoomLeftPos() : -1;
				if (start < trjs.wave.zoomLeftPos()) {
					var diff = trjs.wave.zoomLeftPos() - start;
					diff = Math.floor(diff/trjs.wave.winsize())+1;
					diff = trjs.wave.zoomLeftPos() - (diff*trjs.wave.winsize());
					if (diff < 0) diff = 0;
					return diff;
				} else {
					var diff = start - trjs.wave.zoomLeftPos();
					diff = Math.floor(diff/trjs.wave.winsize());
					diff = trjs.wave.zoomLeftPos() + (diff*trjs.wave.winsize());
					var maxi = trjs.wave.file.durationInSeconds() - trjs.wave.winsize();
					if (diff > maxi) diff = maxi;
					return diff;
				}
		    }
		    if (trjs.partition && trjs.partition.isReady()) {
				// if start is in the current window do nothing
				if (start > trjs.partition.zoomLeftPos() && start < trjs.partition.zoomLeftPos()+trjs.partition.winsize())
					return (notest===true) ? trjs.partition.zoomLeftPos() : -1;
				if (start < trjs.partition.zoomLeftPos()) {
					var diff = trjs.partition.zoomLeftPos() - start;
					diff = Math.floor(diff/trjs.partition.winsize())+1;
					diff = trjs.partition.zoomLeftPos() - (diff*trjs.partition.winsize());
					if (diff < 0) diff = 0;
					return diff;
				} else {
					var diff = start - trjs.partition.zoomLeftPos();
					diff = Math.floor(diff/trjs.partition.winsize());
					diff = trjs.partition.zoomLeftPos() + (diff*trjs.partition.winsize());
					var maxi = trjs.partition.durationInSeconds() - trjs.partition.winsize();
					if (diff > maxi) diff = maxi;
					return diff;
				}
			}
			return (notest===true) ? 0 : -1;
		},

		/*
		 * change the zoom ratio to zoom out
		 * @method zoomOut
		 */
		zoomOut: function() {
			zoomOutMax(false);
			var r, l, d;
			var ws = trjs.dmz.winsize();
/*			if (ws === -1) return; // zoom Out Max
			if (ws === 0) { //
				if (trjs.wave && trjs.wave.isReady()) {
					ws = trjs.wave.file.durationInSeconds();
				} else {
					ws = 1; // une seconde
				}
			} else {
*/				ws = ws * 2;
				// zoom Out Max is limited to the length of the sound data
				if (ws > trjs.partition.durationInSeconds()) {
					ws = trjs.partition.durationInSeconds();
					zoomOutMax(true);
				}
//			}
			trjs.dmz.winsize(ws); // sets wave and partition
			// REDRAW the wave and the highlight if there is one
			trjs.dmz.redraw('wave');
			// TODO
			trjs.dmz.adjustPartition();
			trjs.dmz.redraw('partition');
			trjs.dmz.setZoomText();
		},

		/*
		 * change the zoom ratio to zoom in
		 * @method zoomIn
		 */
		zoomIn: function() {
			zoomInMax(false);
			var ws = trjs.dmz.winsize();
/*			if (ws === 0) return; // zoom In Max : no change
			if (ws === -1) // were in zoom Out Max and we switch to normal zoom
				ws = 240;
			else {
*/				ws = ws / 2;
				// zoom IN Max is limited to the number of the sound sample data
				if (trjs.wave && trjs.wave.isReady()) {
					if (ws < trjs.wave.minWinsize) {
						ws = trjs.wave.minWinsize;
						zoomInMax(true);
					}
					if (trjs.wave.viewport.size.x >= trjs.wave.file.durationInSamples()) {
						this.winsizeValue = trjs.wave.file.durationInSeconds();
					}
						// max zoom in - not necessary if this zoom IN at higher precision than wave rate is possible in wave.js
				}
//			}
			trjs.dmz.winsize(ws); // sets wave and partition
			// REDRAW the wave and the highlight if there is one
			trjs.dmz.redraw('wave');
			// TODO
			trjs.dmz.adjustPartition();
			trjs.dmz.redraw('partition');
			trjs.dmz.setZoomText();
		},
	};
} )();
