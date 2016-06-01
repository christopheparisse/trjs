/*
 * partition.js
 * @author Christophe Parisse
 * @Date april 2014
 * @purpose display horizontal representation of transcription
 */

/*
 * trjs.partition handles the drawing of the partition zone of the display
 *
 * common interface (all the is visible to other part of the software)
 *
 * isVisible()
 * resetWidth() // when the window width changes, the partition must be redisplayed
 * sizeOfSecond()  eq. to var sizeOfSecondValue (is computed in the same way in partition and wave)
 *
 * init(state) // inits the partition by loading values from the transcription (is handled even if not displayed)
 *   if (state===false) reinitialize
 *   if (state===true) initialize partition
 * highlight(start, end, id, color) // highlights a point according to the color of the third parameter for partition
 * winsize(value) - sets the width of the viewed part (useful for init) - if value===false returns value of winsize
 *
 * partitionHeight(pixels) --> value of the height of the window for the partition - if (pixels) set value. always return current value
 *
 * redrawPartition() // redraw the partition as it is
 * drawPartition(winsize, start) // draw the window and adjust zoom if necessary
 * drawPartitionPart(start, end, color) // the partition at this point is highlighted and the previous highlighted (if there is one) is unhighlighted
 *       // color correspond to selected (line) or running (line)
 * add: function(loc, text, start, stop) // crée un élément de partition
 * del: function(start, stop) // supprime un élément de partition
 *
 * isReady()
 * zoomLeftPos() this is computed intenally but useful for positioning
 *
 * setZoomText() - writes the value of the current zoom to the main window
 * setCurrentTimeText() - write the current time value in the main window
 *
 * trjs.partition.effectiveWidth depends on the father window
 *
 * When creating the partition information is added to the table of transcription lines indicating the level where the participant should be displayed in the partition
 */

/*
 * @module partition
 * @methods
 */
trjs.partition = ( function() {
	/*
	 * list of internal variables
	 */
	var trLines = null; // pointer to a DOM element containing the line of transcription (used for redisplay)
	var lastId = 0; // ids to be used for fast access to redisplay data
	var visibleLines = 3; // number of visible lines (including the last multiple line)
	var partitionHeightValue = 45; // default min size
    var partitionReady = false; // flag to be set if the partition can be displayed
    var partitionVisible = true;
    var zoomLeftPosValue = 0;
	var sizeOfSecondValue = 100;

	var firstTS = null; // to remember the first drawn rectangles
	var firstTE = null;
	var firstID = null;

	var mouseDownPartition = function(e) {
		if (e.which === 1) {
			e.preventDefault();
			var t = pixelsToSeconds(e.pageX);
			var p = $('#partition').offset();
			var hpos = e.pageY - p.top;
			var n = Math.floor(hpos / (trjs.partition.partitionHeight()/visibleLines));
			var loc = '...';
			if (n < visibleLines-1)
				loc = trjs.dmz.sortLoc(n);
			trjs.events.goToTime('partition', t, true, loc);
		}
	};

	/*
	 * @param: true is partition must be redrawn even if the winsize value is not changed
	 */
	var redrawPartition = function() {
		// Redraw partition
		if (trjs.partition.isReady()) {
			drawPartition( trjs.partition.winsize(), trjs.partition.zoomLeftPos() );
			// display the currently selected line
			var s = trjs.events.getSelectedLine();
			var ts = trjs.events.lineGetCell(s, trjs.data.TSCOL);
			var te = trjs.events.lineGetCell(s, trjs.data.TECOL);
			if ( !trjs.utils.isNE(te) && !trjs.utils.isNE(ts))
				drawPartitionPart(s, 'running');
		}
	};

	/*
	 * draw the partition and wave at a certain time.
	 * set the start of the wave if necessary
	 * @method highlightElement
	 * @param {float} time of begining of sound in seconds
	 * @param {float} time of end of sound in seconds
	 * @param {integer} id of partition element (transcription line)
	 * @param {string} color of display
	 */
	var highlightElement = function(start, end, id, color) {
		if (trjs.utils.isNE(start) || trjs.utils.isNE(end)) return;
		if (!trjs.partition.isReady()) return;
		var moved = trjs.dmz.computeScrollPos(start);
		if (trjs.partition.isReady()) {
			if (moved >= 0) {
				trjs.partition.zoomLeftPos(moved);
				drawPartition( trjs.partition.winsize(), trjs.partition.zoomLeftPos() );
			}
			drawPartitionPart(id, color);
		}
	};

	var drawPartitionPart = function(id, color) {
		var ts = trjs.dataload.checknumber(trjs.events.lineGetCell( id, trjs.data.TSCOL));
		var te = trjs.dataload.checknumber(trjs.events.lineGetCell( id, trjs.data.TECOL));
		if (ts === '' || te === '')
			return;
		else {
			ts = parseFloat(ts);
			te = parseFloat(te);
		}
		// change color of previous element
		if (trjs.partition.runningId != null) {
			var rts = trjs.dataload.checknumber(trjs.events.lineGetCell( trjs.partition.runningId, trjs.data.TSCOL));
			var rte = trjs.dataload.checknumber(trjs.events.lineGetCell( trjs.partition.runningId, trjs.data.TECOL));
			drawRectangle(trjs.partition.runningId, rts, rte);
		}
		// draw current element
		trjs.partition.runningId = id;
		drawRectangle(id, ts, te, 'running');
	};

	var pointsToSeconds = function(pixel) {
		return pixel / trjs.partition.sizeOfSecond();
	};

	var secondsToPoints = function(second) {
		return parseInt(Math.floor(second * trjs.partition.sizeOfSecond()));
	};

	var pixelsToSeconds = function(pixel) {
		return ((pixel / trjs.partition.sizeOfSecond()) + trjs.partition.zoomLeftPos());
	};

	var secondsToPixels = function(second) {
		return Math.floor((second - trjs.partition.zoomLeftPos()) * trjs.partition.sizeOfSecond());
	};

	/*
	 * draws an utterance within a rectangle
	 */
	var drawRectangle = function(id, ts, te, color) {
		var xrect = secondsToPixels(ts);
		if (xrect > trjs.partition.effectiveWidth) return; // this rectangle is outside the screen coordinates
		var szrect = secondsToPoints(te-ts);
		if (xrect+szrect < 0) return; // this rectangle is outside the screen coordinates
		var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell( id, trjs.data.CODECOL));
		var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell( id, trjs.data.TRCOL));
		//console.log('Rect ' + iloc + ' ' + itrans);
		for (var l = 0; l < visibleLines-1 ; l++) if (iloc === trjs.dmz.sortLoc(l)) break;
		var ypos = l * (trjs.partition.partitionHeight()/visibleLines);
		if (l === visibleLines-1)
			label = iloc + ' :- ' + itrans;
		else
			label = itrans;
		var background = trjs.dmz.drawRectStandard;
		if (color === 'running')
			background = trjs.dmz.drawRectRunning;
		if (xrect < 0) {
			// change label accordingly
			szrect -= (-xrect);
			xrect = 0;
		} else if (xrect+szrect > trjs.partition.effectiveWidth) {
			// change label accordingly
			szrect = trjs.partition.effectiveWidth - xrect;
		}
		if (xrect+szrect>trjs.partition.effectiveWidth-trjs.partition.locInfo) // do not hide right part information
			szrect -= (xrect+szrect) - (trjs.partition.effectiveWidth-trjs.partition.locInfo);
		trjs.partition.graphics.fillStyle = background;
		trjs.partition.graphics.fillRect( xrect, ypos, szrect, 20);
		trjs.partition.graphics.fillStyle = trjs.dmz.drawRectText;
		trjs.partition.graphics.strokeRect( xrect, ypos, szrect, 20);
		if (szrect>4)
			trjs.partition.graphics.fillText( label, xrect+2, ypos+16, szrect-4 );
			//console.log(label + ' ' + (xrect+2) + ' ' + (ypos+16) + ' ' + (szrect-4));
	};

	/*
	 * finds the transcript line with time in it just before a line
	 */
	var findLineOKBefore = function(i) {
		for ( ; i>0 ; i--) {
			var type = trjs.transcription.typeTier( $(trLines[i]) );
			if ( type === 'div' || type === 'prop' ) continue;
			var ts = trjs.dataload.checknumber(trjs.events.lineGetCell( $(trLines[i]), trjs.data.TSCOL));
			var te = trjs.dataload.checknumber(trjs.events.lineGetCell( $(trLines[i]), trjs.data.TECOL));
			if (ts === '' || te === '')
				continue;
			else {
				return i;
			}
		}
		return 0;
	};

	/*
	 * finds the transcript line just before a start value
	 */
	var findLineBefore = function(start, l, r) {
		var i = parseInt(Math.floor((l+r)/2));
		i = findLineOKBefore(i);
		if (i === l) return i;
		if (i === 0) return 0;
		var ts = parseFloat(trjs.dataload.checknumber(trjs.events.lineGetCell( $(trLines[i]), trjs.data.TSCOL)));
		var te = parseFloat(trjs.dataload.checknumber(trjs.events.lineGetCell( $(trLines[i]), trjs.data.TECOL)));
		if (ts <= start && start <= te) return i;
		if (start < ts) return findLineBefore(start, l, i);
		return findLineBefore(start, i, r);
	};

	var print_line = function(p) {
		var loc = trjs.events.lineGetCell( p, trjs.data.CODECOL);
		var ts = trjs.dataload.checknumber(trjs.events.lineGetCell( p, trjs.data.TSCOL));
		var te = trjs.dataload.checknumber(trjs.events.lineGetCell( p, trjs.data.TECOL));
		var tr = trjs.events.lineGetCell( p, trjs.data.TRCOL);
		return loc + ' ' + ts + ' ' + te + ' ' + tr;
	};

	/*
	 * sets the horizontal position of the partition according to the time display
	 */
	var drawPartition = function(winsize, start) {
		firstTS = null; // to remember the first drawn rectangles
		// zoom has been redrawn
		// partition must be adjusted too.
		if (winsize !== winsizeValue) {
			winsizeValue = winsize; // TODO should recreate canvas ?
			// reset the sizeOfSecond in partition.
			trjs.partition.effectiveWidth = $(window).width();
			trjs.partition.sizeOfSecond(trjs.partition.effectiveWidth / winsizeValue); // TODO adjust to wave
		}
		trjs.slider.repopulatePartition(start);
		start = parseFloat(start);
		winsize = parseFloat(winsize);
		trjs.partition.runningId = null; // the previous selection will be redrawn just now so there will be no current selection displayed
		/* dessiner le fond */
		trjs.partition.graphics.fillStyle = trjs.dmz.drawPartitionBackground;
		trjs.partition.graphics.fillRect(0, 0, trjs.partition.effectiveWidth, trjs.partition.canvas.height);
		/* dessiner les parties de elts correspondantes */
		var nstop = 2; // stop later to allow a leeway of superpositions
		trLines = trjs.transcription.tablelines();
		for ( var i = findLineBefore(start, 0, trLines.length-1); i < trLines.length; i++) {
			//console.log(i + ' :- ' + print_line($(trLines[i])));
			var type = trjs.transcription.typeTier( $(trLines[i]) );
			if ( type === 'div' || type === 'prop' ) continue;
			var ts = trjs.dataload.checknumber(trjs.events.lineGetCell( $(trLines[i]), trjs.data.TSCOL));
			var te = trjs.dataload.checknumber(trjs.events.lineGetCell( $(trLines[i]), trjs.data.TECOL));
			if (ts === '' || te === '')
				continue;
			else {
				ts = parseFloat(ts);
				te = parseFloat(te);
			}
			if (ts > start+winsize) {
				nstop--;
				if (nstop === 0) break;
			}
			if (te > start) {
				if (firstTS === null) {
					firstTS = ts;
					firstTE = te;
					firstID = $(trLines[i]);
				}
				drawRectangle($(trLines[i]), ts, te);
				continue;
			}
		}
		// draw the indications of the name of the participants on the right of the partition.
		for (var l = 0; l < visibleLines-1 ; l++) {
			trjs.partition.graphics.fillStyle = trjs.dmz.participantBackground;
			trjs.partition.graphics.fillRect( trjs.partition.effectiveWidth-trjs.partition.locInfo, l*(trjs.partition.canvas.height/visibleLines), trjs.partition.locInfo, (trjs.partition.partitionHeight()/visibleLines) );
			trjs.partition.graphics.fillStyle = trjs.dmz.participantText;
			trjs.partition.graphics.strokeRect( trjs.partition.effectiveWidth-30, l*(trjs.partition.canvas.height/visibleLines), trjs.partition.locInfo, (trjs.partition.partitionHeight()/visibleLines) );
			trjs.partition.graphics.fillText( trjs.dmz.sortLoc(l), trjs.partition.effectiveWidth-trjs.partition.locInfo+2, l*(trjs.partition.canvas.height/visibleLines) + 16 );
		}
	};

	var highlightFirst =function() {
		if (firstTS !== null) {
//			drawRectangle(firstID, firstTS, firstTE, 'running');
			drawPartitionPart(firstID, 'running');
			// select line ?
		}
	};

	var redrawPartition = function() {
		if (trjs.partition.isReady())
			drawPartition( trjs.partition.winsize(), trjs.partition.zoomLeftPos() );
	};

	var redrawHighlight = function(start, end, id, color) {
		redraw();
		if (trjs.partition.isReady())
			highlightElement(start, end, id, color);
	};

	var redrawPartitionHighlight = function(start, end, id, color) {
		redrawPartition();
		if (trjs.partition.isReady())
			highlightElement(start, end, id, color);
	};

	/***********************************************************************
	 *
	 * INITIALIZES and CREATES the DATA to be displayed
	 *
	 **********************************************************************/

	var resetWidthPartition = function() {
		if (partitionReady === false) return;
		if (trjs.param.showPartition === false) return;
		if ($(window).width() > trjs.partition.canvas.width) {  // means the window changed screen
			var p = document.getElementById("partition");
			p.removeChild(trjs.partition.canvas);
			delete trjs.partition.canvas;
			trjs.partition.canvas = null;
			initPartition();
			// then continue as for the first time
		} else {
			// only redraw because the old canvas is big enough
			var newWidth = $(window).width();
			var oldWidth = trjs.partition.effectiveWidth;
			trjs.partition.effectiveWidth = newWidth;
			trjs.partition.winsize( trjs.partition.winsize() * (newWidth / oldWidth) );
			trjs.partition.sizeOfSecond(trjs.partition.effectiveWidth / trjs.partition.winsize()); // TODO
			drawPartition( trjs.partition.winsize(), trjs.partition.zoomLeftPos() ); // 0 == init this drawPartition.
			return;
		}
	};

	/*
	 * initializes and fills the items in the div based on the table of transcriptions
	 * @method init
	 * @param tableOfTranscriptionLines
	 * @param {int} for zoon its the value in seconds of the visible part
	 * @return table of ids for each line in the data
	 */
	var initPartition = function() {
		trjs.slider.populatePartition();
		if (trjs.partition.initializing === true) return;
		if (! trjs.partition.isVisible() ) return;

		// Creating the data that will be displayed
		// the data from the DOM is copied to make it easier and faster to use.
		// organise the horizontal position in the partition
		var table = $("#transcript");
		if (!table) {
			trjs.partition.initializing = false;
			return;
		}
		trLines = trjs.transcription.tablelines();
		if (trjs.dmz.nbSortLoc() === 0) trjs.dmz.countLoc();

		trjs.partition.initializing = true;
		trjs.partition.show();
		partitionReady = false;
		/* partition contains the location as placed in the normal flow */
		var partition = $('#partition');
		partitionHeightValue = partition.height();
		// Creating the canvas
		if (!trjs.partition.canvas) {
			trjs.partition.canvas = document.createElement("canvas");
			trjs.partition.canvas.width = screen.width;
			// reset the sizeOfSecond in partition.
			trjs.partition.effectiveWidth = $(window).width();
			trjs.partition.sizeOfSecond(trjs.partition.effectiveWidth / winsizeValue); // TODO
			trjs.partition.canvas.height = trjs.partition.partitionHeight();
			var p = document.getElementById("partition");
			if (!p) {
				trjs.partition.initializing = false;
				trjs.partition.hide();
				return;
			}
			p.textContent = '';
			p.appendChild(trjs.partition.canvas);
			trjs.partition.graphics = trjs.partition.canvas.getContext("2d");
		}
		partitionReady = true;
		trjs.partition.zoomLeftPos(0);
		drawPartition( trjs.partition.winsize(), trjs.partition.zoomLeftPos() ); // 0 == init this drawPartition.
		trjs.partition.initializing = false;
		trjs.editor.resizeTranscript();
	};

	var toID = function(start, end) {
		return parseInt(Math.floor((start*100) + (end*100)));
	};

	/**
	 * rewind the partition by one scroll
	 * @method backwardStep
	 */
	function pageleft(e) {
/*	    var s = trjs.dataload.checknumber(trjs.events.lineGetCell(trjs.data.selectedLine, trjs.data.TSCOL));
	    if (s === '') { // no time in current line
			trjs.events.keyLocUp(); // params = (undefined, undefined)
			trjs.partition.redrawPartition();
			return;
		}
*/		if (trjs.partition.isReady()) {
			var target;
		    if (trjs.partition.zoomLeftPos() > trjs.partition.winsize())
		        target = trjs.partition.zoomLeftPos() - (trjs.partition.winsize()*0.5);
		    else
		        target = 0;
		    trjs.partition.zoomLeftPos(target);
			drawPartition(trjs.partition.winsize(), target);
			if (trjs.param.synchro.free() !== true && trjs.wave && trjs.wave.isReady()) {
			    trjs.wave.zoomLeftPos(target);
				trjs.wave.visualizer.drawWave(trjs.wave.winsize(), target);
			}
			// TODO Allumer la partition courante
			highlightFirst(target);
		}
	}

	/**
	 * fast-forward the partition by one scroll
	 * @method forwardStep
	 */
	function pageright(e) {
/*	    var s = trjs.dataload.checknumber(trjs.events.lineGetCell(trjs.data.selectedLine, trjs.data.TSCOL));
	    if (s === '') { // no time in current line
			trjs.events.keyLocDown(); // params = (undefined, undefined)
			trjs.partition.redrawPartition();
			return;
		}
*/		if (trjs.partition.isReady()) {
		    var target = trjs.partition.zoomLeftPos() + (trjs.partition.winsize()*0.5);
		    trjs.partition.zoomLeftPos(target);
			drawPartition(trjs.partition.winsize(), target);
			if (trjs.param.synchro.free() !== true && trjs.wave && trjs.wave.isReady()) {
			    trjs.wave.zoomLeftPos(target);
				trjs.wave.visualizer.drawWave(trjs.wave.winsize(), target);
			}
			// TODO Allumer la partition courante
			highlightFirst(target);
		}
	}

	return {
		/*
		 * variables accessed by partition
		 */
		canvas: null, // store the canvas
		effectiveWidth: 800, // size of the partition drawn (in pixels)
		initializing: false, // is the file just being loading
		locInfo:30, // size of left part reserved for locutor information
		winsizeValue: 10, // size of zoom (in seconds) -- if (0) correspond to minimalSize, if (-1) correspond to maximumSize

		/*
		 * functions accessed from outside the partition object
		 */
		adjustPartition: function() { adjustPartition(); },
		clear: function() { // ok. frees partition.
			if (partitionReady === true) {
				/* dessiner le fond */
				trjs.partition.graphics.fillStyle = trjs.dmz.drawPartitionBackground;
				trjs.partition.graphics.fillRect(0, 0, trjs.partition.effectiveWidth, trjs.partition.canvas.height);
			}
//			partitionReady = false;
		},
		drawPartition: function(p1, p2) { return drawPartition(p1, p2); },
		durationInSeconds: function() { if (trjs.wave && trjs.wave.isReady()) return trjs.wave.file.durationInSeconds(); else return trjs.slider.sp.timelength; },
		hide: function() { 	var p = $('#partition'); var sp = $('#slider-partition'); if (p) p.hide(); if (sp) sp.hide(); },
		highlight: function(start, end, id, color) { return highlightElement(start, end, id, color); }, // ok. (set highlight of partition)

		init: function() { // ok. loads partition.
			return initPartition();
		},
		isReady: function() {
			return partitionReady;
		},
		isVisible: function() {
			return partitionVisible;
		},
		mouseDownPartition: function(e) { mouseDownPartition(e); },
		nbVisible: function() { return visibleLines; },
		pageleft: function() { pageleft(); },
		pageright: function() { pageright(); },
		partitionHeight: function(pixels) { if (pixels !== undefined) partitionHeightValue = pixels; return partitionHeightValue; },
		redrawHighlight: function(start, end, id, color) { redrawHighlight(start, end, id, color); },
		redrawPartitionHighlight: function(start, end, id, color) { redrawPartitionHighlight(start, end, id, color); },
		redrawPartition: function() { redrawPartition(); },
		resetWidth: function() { // ok. resets width of partition
			resetWidthPartition();
		},
		setVisible: function(choice) { // shows and hides partition
			if (choice === true) {
				partitionVisible = true;
				if (trjs.partition.isReady())
					trjs.partition.show();
				else if (trjs.transcription.initialLoadFinished()) {
					trjs.partition.show();
					trjs.partition.init();
				}
			} else {
				partitionVisible = false;
				trjs.partition.hide();
			}
		},
		setNbVisible: function(l) { if (l>0 && l<10) visibleLines = l; },
		show: function() { 	var p = $('#partition'); var sp = $('#slider-partition'); if (p) p.show(); if (sp) sp.show(); },
		sizeOfSecond: function(v) { if (v !== undefined) sizeOfSecondValue = v;  return sizeOfSecondValue; },  // size of second in pixels
		winsize: function(p) { // ok. gets and sets the size of the display window in seconds
			if (p !== undefined) {
				var v = parseFloat(p); // size in seconds of zoom windows
				if (isNaN(v))
					trjs.log.alert('Incoherent value for partition winsize');
				else
					winsizeValue = v; // sets size in seconds of zoom windows
			}
			return winsizeValue;
		}, // gets size in seconds of zoom windows
		zoomLeftPos: function (argument) { // this is different than partition
			if (argument !== undefined)
				trjs.partition.zoomLeftPosValue = argument; // sets the left position of wave window
			return trjs.partition.zoomLeftPosValue; // left position of wave window
		},
	};
}());
