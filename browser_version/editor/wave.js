/**
 * wave.js
 * opening and visualizing wave files
 * Date: feburary 2014
 * @module wave
 * @author Christophe Parisse
 * 
 * the read and initial display are adaptated from http://thiscouldbebetter.wordpress.com/2012/12/20/rendering-a-wav-file-using-html5-and-javascript/
 * 
1) tester zoom mini et max de wave seul

fonctions pour wave

EXTERNAL - these functions might called from outside the wave module

highlightElement
	- positionne et redessine tout le signal si nécessaire
	- dessine une zone du signal dans une couleur appropriée
	- color = basic, selected, running
	- change la valeur zoomLeftPos

computeScrollPos
	- calcule le point gauche de l'affichage du temps demandé
	- pas d'effet de bord

drawWave
	- dessin de toute la partie visible du signal pour un point gauche donné
	- change la valeur zoomLeftPos (par drawWaveInternal)

load
	- chargement initial du signal
	- mise en place du zoom par défaut et premier affichage
	- initialisation de toutes les valeurs

Effets de bords externes
	- dans le cas de maniement de la souris, on peut:
		mouseWave.downWave(e)
		- utiliser la sélection wave pour changer le temps dans la transcription
		- utiliser la sélection wave pour jouer un morceau
		mouseWave.upWave(e)
		- utiliser le clic dans la wave pour positionner le média

INTERNE - should not be called from outside the wave module

computeZoom
	- en fonction de la winsize et de la taille de la wave, créer une image son dont l'échantillonnage permet d'avoir un point par échantillon - elle sera utilisée pour le dessin
	- change la valeur de winsize
drawWaveInternal
	- dessine le signal
	- réinitialize à zéro tous les champs basic, running et prevselected
 *
 * trjs.wave handles the drawing of the wave zone of the display
 * setVisible(true/false)
 * isVisible()
 * isReady() eq. to trjs.wave.isReady()
 * runningLeft:  previous position of the left of the highlighted (running) part
 * runningRight:  previous position of the right of the highlighted (running) part
 * waveHeight(pixels) --> value of the height of the window for the wave - if (pixels) set value. always return current value
 * 
 */

// "use strict";

/*
 * @module wave
 * @methods 
 */

trjs.wave = ( function() {

/*
 * move the mouse in the canvas section
 */
var mouseWave = ( function() {
	var mouseDownWave = false;
	var waveStartSelection = -1;
	var waveEndSelection = -1;
	var movement = 0; // stores the last movement of the mouse: -1 left, 1 right, 0 no move
	
	return {
		downWave: function(e) {
			if (e.which === 1) {
				e.preventDefault();
				if ( waveStartSelection !== -1 || waveEndSelection !== -1) { // if there is something selected
					if (e.pageX >= waveStartSelection && e.pageX <= waveEndSelection) { // the clic is within the selected part: play sound
						/**** EXTERNAL SIDE EFFECT ****/
						if (e.shiftKey) {
							// set the current selected line with the time limit of the selected area
							trjs.events.setTimeSelectedLine(trjs.wave.visualizer.pixelXToSecond(waveStartSelection), trjs.wave.visualizer.pixelXToSecond(waveEndSelection) );
						} else
							trjs.media.runFromTo( trjs.wave.visualizer.pixelXToSecond(waveStartSelection), trjs.wave.visualizer.pixelXToSecond(waveEndSelection) );
						/**** END EXTERNAL SIDE EFFECT ****/
						return;
					} else {  // outside: erase the selection
						trjs.wave.visualizer.drawWavePart(trjs.wave.visualizer.pixelXToSecond(waveStartSelection), trjs.wave.visualizer.pixelXToSecond(waveEndSelection)+1, 'selected', false);
						waveStartSelection = -1;
						waveEndSelection = -1;
						mouseDownWave = false;
						// continue to handle the clic
					}
				}
				mouseDownWave = true;
				waveStartSelection = e.pageX;
				waveEndSelection = e.pageX;
				trjs.wave.graphics.fillStyle='rgba(200,0,0,0.3)';
				trjs.wave.graphics.fillRect(e.pageX, trjs.wave.visualizer.TOPTICKS, 1, trjs.wave.viewport.size.y - trjs.wave.visualizer.TOPTICKS);
				movement = 0;
			}
		},
		
		moveWave: function(e) {
			if (e.which === 1) {
				e.preventDefault();
				if (mouseDownWave === true) {
					trjs.wave.graphics.fillStyle='rgba(200,0,0,0.3)';
					//  value of  e.pageX ::  case1    |:=waveStartSelection   case2  |:=waveEndSelection   case3
					if (e.pageX >= waveEndSelection) {  // case3: the user is going to the right side
						trjs.wave.graphics.fillRect(waveEndSelection+1, trjs.wave.visualizer.TOPTICKS, (e.pageX-waveEndSelection), trjs.wave.viewport.size.y - trjs.wave.visualizer.TOPTICKS);
						waveEndSelection = e.pageX;
						movement = 1;
					} else if (e.pageX <= waveStartSelection) {  // case1: the user is going to the left side
						// console.log(e.pageX + ' ' + waveStartSelection + ' ' + waveEndSelection);
						trjs.wave.graphics.fillRect(e.pageX, trjs.wave.visualizer.TOPTICKS, (waveStartSelection-e.pageX), trjs.wave.viewport.size.y - trjs.wave.visualizer.TOPTICKS);
						waveStartSelection = e.pageX;
						movement = -1;
					} else {  // case3: the user is going back inside the previous selected block
						if (movement === -1) {
							// mouse was going to left, now goes to the right
							trjs.wave.visualizer.drawWavePart(trjs.wave.visualizer.pixelXToSecond(waveStartSelection), trjs.wave.visualizer.pixelXToSecond(e.pageX), 'selected', false);
							waveStartSelection = e.pageX;
						} else if (movement === 1) {
							// mouse was going to the right, now goes to the left
							trjs.wave.visualizer.drawWavePart(trjs.wave.visualizer.pixelXToSecond(e.pageX), trjs.wave.visualizer.pixelXToSecond(waveEndSelection+1), 'selected', false);
							waveEndSelection = e.pageX;
						} else {
							// no move. should not happen. do nothing
						}
					}
				}
			}
		},
		
		upWave: function(e) {
			if (e.which === 1) {
				e.preventDefault();
				if (mouseDownWave === true) {
					//trjs.wave.graphics.fillStyle='rgba(200,0,0,0.3)';
					//trjs.wave.graphics.fillRect(waveEndSelection+1, 0, (e.pageX-waveEndSelection), trjs.wave.viewport.size.y);
					if (movement === -1)
						waveStartSelection = e.pageX;
					else
						waveEndSelection = e.pageX;
					trjs.wave.visualizer.drawWavePart(trjs.wave.visualizer.pixelXToSecond(waveStartSelection), trjs.wave.visualizer.pixelXToSecond(waveEndSelection), 'selected', true);
					/**** EXTERNAL SIDE EFFECT ****/
					if (trjs.param.synchro.block() === true) {
						trjs.events.goToTime('wave', trjs.wave.visualizer.pixelXToSecond(waveStartSelection));
					}
					/**** END EXTERNAL SIDE EFFECT ****/
				}
			}
			mouseDownWave = false;
		},
		reinit: function(start, end) {
			if (start !== undefined && waveStartSelection !== -1) {
				trjs.wave.visualizer.drawWavePart(trjs.wave.visualizer.pixelXToSecond(waveStartSelection), trjs.wave.visualizer.pixelXToSecond(waveEndSelection), 'basic', true);
			}
			waveStartSelection = -1;
			waveEndSelection = -1;
			mouseDownWave = false;
			movement = 0;
		},
	};
})();

/*
 * @object Taps : parameters used for filtering the sound data
 */
var tapsWave = {
	size : 0,
	data: null,
	delay: null,
	fillTaps: function(factor)  {
		// h <- function(x,ft) {sin(2*pi*ft*x)/(pi*x)}
		// h(-factor:factor,0.001)
		var ft = 1/(factor);
		var k = 0, i;
		for (i = - factor; i < 0 ; i++) {
			this.data[k] = Math.sin(2 * Math.PI * ft * i) / (Math.PI * i);
			k++;
		}
		for (i = 1; i <= factor ; i++) {
			this.data[k] = Math.sin(2 * Math.PI * ft * i) / (Math.PI * i);
			k++;
		}
/*		var sum = 0;
		for (i=0;i<this.size;i++) sum += this.data[i];
		console.log('Taps: ', this.size, ' : ', sum);
*/
	},
	init: function(factor) {
		this.size = 2 * factor;
		this.data = new Array(this.size);
		this.delay = new Array(this.size);
		this.fillTaps(factor);
	},
};

var visualizerWave = {
	
	/*
	 * set of colors for visualizing the wave
	 */
	TOPTICKS: 10,

	/*
	 * drawing scheme
	 * three situations: 
	 *   basic (all background window, removing running returns to basic)
	 *   running (selection that corresponds to the current line)
	 *       --> position = runningPosLeft and runningPosRight
	 *   selected (for hand selections in the wave itself: removing selected returns to mix of basic and running)
	 *       --> position = selectedPosLeft and selectedPosRight
	 * 
	 * drawWaveInternal : erase everything and draw a basic background
	 * drawWavePart : 'running' := when call erase selected if exists and old running if exists
	 * drawWavePart : 'selected' + true := when call draw above all the rest
	 * drawWavePart : 'selected' + false := when call redraw basic on selected zone and redraw running if it is set
	 * 
	 * drawWaveLine : draw a vertical line - color is computed accorded to position and old line if exists is erased and background redrawn according to position
	 * 
	 * Information about the position of the various zones (in trjs.wave object)
	 *  zoomLeftPos():  left position of wave window
	 *  posLine:  previous position for cursor on wave file (vertical line)
	 */

	/*
	 * initialize the data for visualizing the wave
	 */
	initCanvas: function() {
		// create viewport the size of the main window
		trjs.wave.viewport = new Viewport
		(
			"Viewport0",
			new Coords($(window).width(), trjs.wave.waveHeight() )
		);
		if (trjs.wave.canvas != null) { // not null and not undefined
			if (screen.width > trjs.wave.canvas.width) {  // screen has changed
				var wavediv = document.getElementById("wave");
				wavediv.removeChild(trjs.wave.canvas);
				delete trjs.wave.canvas;
				trjs.wave.canvas = null;
			} else {
				// new size is already set in trjs.wave.viewport
				return;
			}
		}
		trjs.wave.canvas = document.createElement("canvas");
		trjs.wave.canvas.width = screen.width;
		trjs.wave.canvas.height = trjs.wave.waveHeight();
		var wavediv = document.getElementById("wave");
		wavediv.textContent = '';
		wavediv.appendChild(trjs.wave.canvas);
		trjs.wave.graphics = trjs.wave.canvas.getContext("2d");
	},
	
	clearCanvas: function() {
		if (trjs.wave.isReady()) {
			// first draw the whole rectangle
			trjs.wave.graphics.fillStyle = trjs.dmz.basic;
			trjs.wave.graphics.fillRect(0, 0, trjs.wave.viewport.size.x, trjs.wave.viewport.size.y);		   
		}
	},
	
	/*
	 * this function is used to compute the data that will be presented to the screen from the basic wave file
	 * it is called for every new zoom size
	 * the main data are:
	 * -- a wavefile located in trjs.wave.file : it contains a large number of sound samples
	 *     -- size = numberOfSamples
	 * -- an intermediate sound data element in trjs.wave.viewdata : it contains a zoom from the total sound (the size varies according to the zoom factor)
	 *     -- size = trjs.wave.viewdata.size
	 * -- a canvas viewport in trjs.wave.viewport : it contains the actual screen display and the size is the width of the window
	 *     -- size = trjs.wave.viewport.size.x
	 * ++ three zoom cases:
	 *    ++ max zoom out: all the sound fits in the window
	 *       ++ the intermediate data has the size of the viewport window
	 *    ++ max zoom in: every pixel correspond to one sound sample (with the frequency of the sound (xxxHz), this correspond to ONE second for xxx pixels)
	 * 	         where xxx is the sample frequency of the signal
	 *       ++ the intermediate data has the size of the sound samples
	 *    ++ intermediary zoom: the sound in the wavefile in reduced by the zoom factor to fit in the intermediate data
	 *       ++ the intermediate data has the size in between sound file and viewport
	 */
	computeZoom: function(winsize) {
		//trjs.log.dbg.put('computeZoom');
		if (trjs.wave.viewdata != null) { // test null and undefined
			if (trjs.wave.viewdata.samples != null) // test null and undefined
				delete trjs.wave.viewdata.samples;
			delete trjs.wave.viewdata;
			trjs.wave.viewdata = null;
		}
		trjs.wave.winsize(winsize);
		// the size of the sound samples is the same for all zoom factors
		var allSamples = trjs.wave.file.samplesForChannels[0];
		var numberOfSamples = allSamples.length;
		var duration = trjs.wave.file.durationInSamples(); // other way to compute number of samples
		var durationSeconds = trjs.wave.file.durationInSeconds(); // other way to compute number of samples
		/*
		 * numberOfSamples : size of sound sample
		 * trjs.wave.viewdata.size : size of viewdata (buffer)
		 * trjs.wave.viewport.size.x : size of viewport
		 */
		trjs.wave.sizeOfSecondValue = trjs.wave.viewport.size.x / trjs.wave.winsize(); // number of pixels of window divided by number of seconds per windows
		var factor = parseInt(Math.floor(trjs.wave.file.samplingInfo.samplesPerSecond / trjs.wave.sizeOfSecondValue)); // int value of factor to get from n samples per sec to n pixels per sec
		if (factor < 1) factor = 1;
		// factor must be an integer, so it is necessary to adjust the size of second in pixels and thus the winsize
		var roundedSizeOfViewdata = Math.floor( numberOfSamples / factor ) + 1; // roundedSizeOfViewdata - 1 is the new number of samples
		trjs.wave.effectiveNumberOfSamples = roundedSizeOfViewdata - 1; // the effective new number of samples
		trjs.wave.secondsPerSample = durationSeconds / trjs.wave.effectiveNumberOfSamples; // this the length of a sample (and a pixel) in seconds

/*		// TODO check if this is needed
		winsize = trjs.wave.secondsPerSample * trjs.wave.viewport.size.x;  // this is the new winsize
		trjs.wave.sizeOfSecondValue = 1 / trjs.wave.secondsPerSample; // computes the size of seconds in pixels
		trjs.wave.winsize(winsize); // store it
*/		// TODO check if this is needed

		var taps = trjs.wave.taps; // data for the filter for the sample reduction
		taps.init(factor); // creates the filter for the sample reduction
		// Creates a viewdata of the correct size
		trjs.wave.viewdata = new Viewdata(roundedSizeOfViewdata);
		trjs.wave.viewdata.size = trjs.wave.decimation(factor, taps.size, taps.data, taps.delay, numberOfSamples, allSamples, trjs.wave.viewdata.samples);
		trjs.wave.normalize_volume(trjs.wave.viewdata.size, trjs.wave.viewdata.samples);
		// decim returns the real size of the viewdata buffer
		// trjs.wave.viewdata.size est le max de ce qui peut être affiché avec un échantillon = un pixel
		//console.log('normal zoom ' + trjs.wave.winsize() + 'sec/window ' + numberOfSamples + " > " + factor + " " + taps.size + " in " + trjs.wave.viewdata.size + " >> " + trjs.wave.sizeOfSecondValue + "/px per sec " + trjs.wave.viewport.size.x);

/*		// TODO check if this is needed
		trjs.dmz.sizeOfSecond(trjs.wave.sizeOfSecondValue);
		trjs.dmz.winsize(trjs.wave.winsize());
*/		// TODO check if this is needed
		//trjs.log.dbg.put('computeZoom end zoom normal');
	},
	
	drawTicks: function(startfrom, endto) {
		trjs.wave.graphics.fillStyle="#932C3D";
		var jump, jumpsec;
		if (trjs.wave.winsize()<=10)
			jumpsec = 1;
		else if (trjs.wave.winsize()<=20)
			jumpsec = 2;
		else if (trjs.wave.winsize()<=30)
			jumpsec = 3;
		else if (trjs.wave.winsize()<=60)
			jumpsec = 6;
		else if (trjs.wave.winsize()<=120)
			jumpsec = 12;
		else
			jumpsec = 20;
		jump = Math.floor(jumpsec * trjs.wave.sizeOfSecondValue);
		var start0 = Math.floor(trjs.wave.zoomLeftPos());
		if ((start0 - trjs.wave.zoomLeftPos()) < 0)
			start0++;
		var px = start0 -  trjs.wave.zoomLeftPos();
		for (var i = start0 * trjs.wave.sizeOfSecondValue, sec = start0 ; (i < trjs.wave.viewdata.size) && (px < trjs.wave.viewport.size.x) ; i += jump, px += jump, sec += jumpsec) {
			if (startfrom && sec<startfrom) continue;
			if (endto && sec>endto) continue;
			// trjs.wave.graphics.fillText(sec+'s', px, 10);
			var mn = parseInt(Math.floor(sec/60));
			var dispsec = parseInt(Math.floor(sec%60));
			var txt = mn+'m '+dispsec+'s';
			var t = trjs.wave.graphics.measureText(txt);
			trjs.wave.graphics.fillText(txt, px-(t.width/2), 10);
			// trjs.wave.graphics.fillRect(px, 10, 1, trjs.wave.viewport.size.y - 9);
		}
		//trjs.log.dbg.put('end ticks');
	},
	
	/*
	 * draws the vertical line of the cursor in the wave canvas
	 * @method drawWaveLine
	 * draw a vertical line - color is computed accorded to position and old line if exists is erased and background redrawn according to position
	 */
	drawWaveLine: function(start) {
		if (trjs.wave.posLine !== -1)
			this.drawWaveLineInternal(trjs.wave.posLine, false);
		this.drawWaveLineInternal(start, true);
		trjs.wave.posLine = start;
		/**** EXTERNAL SLIDER INTEFACE ****/
		if (trjs.dmz.waveSlider===true) trjs.slider.repopulateWave(start);
		/**** END EXTERNAL SLIDER INTEFACE ****/
	},

	/*
	 * draws the vertical line of the cursor in the wave canvas
	 * not to be used outside this module
	 */
	drawWaveLineInternal: function(start, positive) {
		var vy = (trjs.wave.viewport.size.y - trjs.wave.visualizer.TOPTICKS)/2 + trjs.wave.visualizer.TOPTICKS; // the middle half vertically taking into account the ticks on top
		var dy = trjs.wave.viewport.sizeHalf.y - (trjs.wave.visualizer.TOPTICKS/2); // the size of middle half vertically taking into account the ticks on top
		var vs = trjs.wave.viewdata.samples; // array of samples
		var firstPixel = Math.floor((start - trjs.wave.zoomLeftPos()) * trjs.wave.sizeOfSecondValue);
		
		if (positive === false)  {
			var bg, fg;
			if (start>trjs.wave.prevSelectedLeft && start<trjs.wave.prevSelectedRight) {
				bg = trjs.dmz.selected;
				fg = trjs.dmz.selectedWave;
			} else if (start>trjs.wave.runningLeft && start<trjs.wave.runningRight) {
				bg = trjs.dmz.running;
				fg = trjs.dmz.runningWave;
			} else {
				bg = trjs.dmz.basic;
				fg = trjs.dmz.basicWave;
			}

			trjs.wave.graphics.fillStyle = bg;
			trjs.wave.graphics.fillRect(firstPixel, trjs.wave.visualizer.TOPTICKS, 2, trjs.wave.viewport.size.y-trjs.wave.visualizer.TOPTICKS);
			// var sx is used to find the starting point and to point to the samples and to end drawing when the end of the samples is found
			var sx = Math.floor(start * trjs.wave.sizeOfSecondValue);
			var r = vs[sx];
			if (r>1.0) r = 1.0;
			var df = r * dy;
			trjs.wave.graphics.fillStyle = fg;
			trjs.wave.graphics.fillRect(firstPixel, vy-df, 2, (2*df));
		} else {
			// only draw the vertical line
			/* if we wanted to have different color lines we would do that
			if (start>trjs.wave.prevSelectedLeft && start<trjs.wave.prevSelectedRight)
				trjs.wave.graphics.fillStyle = trjs.dmz.selectedLine;
			else if (start>trjs.wave.runningLeft && start<trjs.wave.runningRight)
				trjs.wave.graphics.fillStyle = trjs.dmz.runningLine;
			else
				trjs.wave.graphics.fillStyle = trjs.dmz.basicLine;
			*/
			trjs.wave.graphics.fillStyle = trjs.dmz.basicLine;
			trjs.wave.graphics.fillRect(firstPixel, trjs.wave.visualizer.TOPTICKS, 2, trjs.wave.viewport.size.y - trjs.wave.visualizer.TOPTICKS);
		}
	},
	
	pixelXToSecond: function(pixel) {
		return (pixel/trjs.wave.sizeOfSecondValue) + trjs.wave.zoomLeftPos();
	},
	
	secondToPixelX: function(second) {
		return Math.floor((second - trjs.wave.zoomLeftPos()) * trjs.wave.sizeOfSecondValue);
	},

	/*
	 * real draw of a wave. Not to be used directly outside this module
	 */
	drawWaveInternal: function(start) {
		//trjs.log.dbg.put('draw wnd');
		trjs.wave.posLine = -1;
		trjs.wave.runningLeft = -1;
		trjs.wave.runningRight = -1; 
		trjs.wave.prevSelectedLeft = -1;
		trjs.wave.prevSelectedRight = -1;
		trjs.wave.mouse.reinit();

		// trjs.wave.infoWave();

		// first draw the whole rectangle
		trjs.wave.graphics.fillStyle = trjs.dmz.basic;
		trjs.wave.graphics.fillRect(0, 0, trjs.wave.viewport.size.x, trjs.wave.viewport.size.y);		   
		// set color for wave		   
		trjs.wave.graphics.fillStyle = trjs.dmz.basicWave;

		var vy = (trjs.wave.viewport.size.y - trjs.wave.visualizer.TOPTICKS)/2 + trjs.wave.visualizer.TOPTICKS; // the middle half vertically taking into account the ticks on top
		var dy = trjs.wave.viewport.sizeHalf.y - (trjs.wave.visualizer.TOPTICKS/2); // the size of middle half vertically taking into account the ticks on top
		var vs = trjs.wave.viewdata.samples; // array of samples
		// var s is used to draw the points from left to right
		// draw all the window without any set location (uniform draw)
		// each of the element in the array correspond to one point on the screen (thank to the transformation computed by decim)

		// var sx is used to find the starting point and to point to the samples and to end drawing when the end of the samples is found
		var sx = Math.floor(start * trjs.wave.sizeOfSecondValue);

		// for (var i = 0; i < 10 ; i++) console.log(i, vs[i]);
		for (var s = 0; (s < trjs.wave.viewport.size.x) && (sx < trjs.wave.viewdata.size) ; s++, sx++) {
			//console.log(s, vs[sx]);
			var r = vs[sx];
			if (r>1.0) r = 1.0;
			var df = r * dy;
			trjs.wave.graphics.fillRect(s, vy-df, 1, (2*df));
		}
		//trjs.log.dbg.put('end draw before ticks');
		this.drawTicks();
	},

	/*
	 * draws a part of the wave canvas - highlights an element according to the third and fourth parameters
	 * @method: drawWavePart
	 * drawWavePart : 'running', null := when call erase selected if exists and old running if exists
	 * drawWavePart : 'selected', true := when call draw above all the rest
	 * drawWavePart : 'selected', false := when call redraw basic on selected zone and redraw running if it is set
	 */
	drawWavePart: function(start, end, color, state) {
		if (trjs.param.isContinuousPlaying !== true) trjs.media.setTime(start);
		if (color === 'running') {
			if (trjs.wave.runningLeft != -1 && trjs.wave.runningRight != -1)
				this.drawWavePartInternal(trjs.wave.runningLeft, trjs.wave.runningRight, 'basic');
			trjs.wave.mouse.reinit(start, end);
			this.drawWavePartInternal(start, end, 'running');
			trjs.wave.runningLeft = start;
			trjs.wave.runningRight = end;
		} else if (color === 'selected') {
			if (state === true) {
				this.drawWavePartInternal(start, end, 'selected');
				trjs.wave.prevSelectedLeft = start;
				trjs.wave.prevSelectedRight = end;
				return;
			}
			// erase selected zone
			this.drawWavePartInternal(start, end, 'basic');
			trjs.wave.prevSelectedLeft = -1;
			trjs.wave.prevSelectedRight = -1;
			if (trjs.wave.runningLeft != -1 && trjs.wave.runningRight != -1)
				this.drawWavePartInternal(trjs.wave.runningLeft, trjs.wave.runningRight, 'running');
		} else {
			this.drawWavePartInternal(start, end, 'basic');
		}
	},
	
	drawWavePartInternal: function(start, end, color) {
		// color can be: 'basic', 'running', 'selected'
		
		var bg, fg;
		if (color === 'basic') {
			bg = trjs.dmz.basic;
			fg = trjs.dmz.basicWave;
		} else if (color === 'running') {
			bg = trjs.dmz.running;
			fg = trjs.dmz.runningWave;
		} else {
			bg = trjs.dmz.selected;
			fg = trjs.dmz.selectedWave;
		}

		var vy = (trjs.wave.viewport.size.y - trjs.wave.visualizer.TOPTICKS)/2 + trjs.wave.visualizer.TOPTICKS; // the middle half vertically taking into account the ticks on top
		var dy = trjs.wave.viewport.sizeHalf.y - (trjs.wave.visualizer.TOPTICKS/2); // the size of middle half vertically taking into account the ticks on top
		var vs = trjs.wave.viewdata.samples; // array of samples
		var firstPixel = Math.floor((start - trjs.wave.zoomLeftPos()) * trjs.wave.sizeOfSecondValue);
		var lastPixel = Math.floor((end - trjs.wave.zoomLeftPos()) * trjs.wave.sizeOfSecondValue);
		// var sx is used to find the starting point and to point to the samples and to end drawing when the end of the samples is found
		var sx = Math.floor(start * trjs.wave.sizeOfSecondValue);
		var fx = Math.floor(end * trjs.wave.sizeOfSecondValue);
		
		// first draw the new rectangle
		trjs.wave.graphics.fillStyle = bg;
		// do not erase ticks on top
		trjs.wave.graphics.fillRect(firstPixel, trjs.wave.visualizer.TOPTICKS, lastPixel-firstPixel, trjs.wave.viewport.size.y-trjs.wave.visualizer.TOPTICKS);
		// set new color for wave		   
		trjs.wave.graphics.fillStyle = fg;
	
		// var s is used to draw the points from left to right
		for (var s = firstPixel; (s <= trjs.wave.viewport.size.x) && (sx < fx) ; s++, sx++) {
			//console.log(s, vs[sx]);
			var r = vs[sx];
			if (r>1.0) r = 1.0;
			var df = r * dy;
			trjs.wave.graphics.fillRect(s, vy-df, 1, (2*df));
		}
		this.drawTicks(start, end);
	},

	highlightElementWave: function(start, end, id, color) {
		if (start && end && trjs.wave.isReady()) {
			trjs.wave.visualizer.drawWavePart(start, end, color);
		}
	},
	
	redrawWave: function() {
		// Redraw all
		if (trjs.wave.isReady()) {
			trjs.wave.visualizer.drawWave( trjs.wave.winsize(), trjs.wave.zoomLeftPos() );
			if (trjs.wave.runningLeft !== -1 && trjs.wave.runningRight !== -1) {
				this.highlightElementWave(trjs.wave.runningLeft, trjs.wave.runningRight, trjs.wave.runningId, 'running');			
			}
		}
	},

	loadFileAndInitialize_LoadComplete: function()
	{
//		try {
			// this sets or reintialize a wave file
//			console.log("LOADCOMPLETE");
			trjs.wave.show();
			this.initCanvas();
			trjs.wave.fileWaveLoaded = true;
			trjs.wave.lengthInSeconds = trjs.wave.file.samplesForChannels[0].length / trjs.wave.file.samplingInfo.samplesPerSecond;
			if (trjs.wave.file.samplingInfo.samplesPerSecond < trjs.wave.viewport.size.x) {
				var minwinsize = Math.floor(trjs.wave.viewport.size.x / trjs.wave.file.samplingInfo.samplesPerSecond)+1;
				trjs.wave.minWinsize = parseInt(minwinsize);
			} else
				trjs.wave.minWinsize = 1;
			trjs.wave.waveReady = true;
			trjs.wave.zoomLeftPos(0);  // TODO: this initial value could be ajusted better later
			trjs.wave.prevPosLeft = -1;
			trjs.wave.prevPosRight = -1;
			trjs.wave.initializing = false;
			this.drawWave( trjs.wave.winsize(), trjs.wave.zoomLeftPos() );
			trjs.dmz.setZoomText();
			if (trjs.dmz.sliderWave===true) trjs.slider.populateWave();
			if (trjs.dmz.sliderPartition===true) {
				trjs.slider.populatePartition();
			}
/*		} catch(e) {
			trjs.log.boxalert('Load&Initialize Wave: ' + e.name + ' - ' + e.message + ' - ' + e.lineNumber);
		}
*/	
	},
	/*
	 * draws a full window and compute the zoom accordingly
	 * all the highlighted element are removed
	 */
	drawWave: function(winsize, start) {
		if (trjs.wave.waveReady !== true) return;
		var moved = trjs.dmz.computeScrollPos(start);
//		console.log("moved " + moved + ' ' + winsize + ' ' + start);
		if (moved >= 0)
			trjs.wave.zoomLeftPos(moved);
		if (trjs.wave.isReady() && trjs.wave.winsize() === winsize && trjs.wave.newWinsize !== true) {
//			console.log("READY ???");
			// the zoom has not changed
			// simply display the relevant part corresponding to the start value.
			this.drawWaveInternal(start);
		} else {
//			console.log("COMPUTE ZOOM");
			this.computeZoom(winsize);
			this.drawWaveInternal(start);
		}
	},
	
	/*
	 * draw the wave at a certain time.
	 * set the start of the wave if necessary
	 * @method highlightElement
	 * @param {float} time of begining of sound in seconds
	 * @param {float} time of end of sound in seconds
	 * @param {integer} id of element (transcription line) // NOT USED HERE
	 * @param {string} color of display
	 */
	highlightElement: function(start, end, id, color) {
		if (trjs.utils.isNE(start) || trjs.utils.isNE(end)) return;
		var moved = trjs.dmz.computeScrollPos(start);
		if (moved >= 0) {
			trjs.wave.zoomLeftPos(moved); // sets the new position
			this.drawWaveInternal(start);
		}
		trjs.wave.visualizer.drawWavePart(start, end, color);
	},
};

function ByteStreamLittleEndian(bytes)
{
	this.bytes = bytes;  

	this.numberOfBytesTotal = this.bytes.length;
	this.byteIndexCurrent = 0;
}
{
	var prototype = ByteStreamLittleEndian.prototype;

	prototype.peekBytes = function(numberOfBytesToRead)
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.bytes[this.byteIndexCurrent + b];
		}

		return returnValue;
	};

	prototype.readBytes = function(numberOfBytesToRead)
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.readByte();
		}

		return returnValue;
	};

	prototype.readByte = function()
	{
		var returnValue = this.bytes.charCodeAt(this.byteIndexCurrent);

		this.byteIndexCurrent++;

		return returnValue;
	};

	prototype.readInt = function()
	{
		var returnValue =
		(
			(this.readByte() & 0xFF)
			| ((this.readByte() & 0xFF) << 8 )
			| ((this.readByte() & 0xFF) << 16)
			| ((this.readByte() & 0xFF) << 24)
		);

		return returnValue;
	};

	prototype.readShort = function()
	{
		var returnValue =
		(
			(this.readByte() & 0xFF)
			| ((this.readByte() & 0xFF) << 8 )
		);

		return returnValue;
	};
}

function Viewdata(sz)
{
	this.samples = new Array(sz);
	this.truesize = sz;
	this.size = -1;
}

function Coords(x, y)
{
	this.x = x;
	this.y = y;
}
{
	var prototype = Coords.prototype;

	prototype.clone = function()
	{
		return new Coords(this.x, this.y);
	};

	prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;

		return this;
	};
}

function Viewport(name, size)
{
	this.name = name;
	this.size = size;
	this.sizeHalf = this.size.clone().divideScalar(2);
}

var fileWave = {
	filePath: '',
	samplingInfo: null,
	samplesForChannels: 0,
	
	init: function(fp, si, sfc) {
		this.filePath = fp;
		this.samplingInfo = si;
		this.samplesForChannels = sfc;
		 // hack
		if (this.samplingInfo === undefined) {
			this.samplingInfo = SamplingInfo.buildDefault();
		}
	
		if (this.samplesForChannels === undefined)
		{
			var numberOfChannels = this.samplingInfo.numberOfChannels; 
	
			this.samplesForChannels = [];
			for (var c = 0; c < numberOfChannels; c++)
			{
				this.samplesForChannels[c] = [];
			}
		}
	},
	defBitsPerByte: 8,
	defNumberOfBytesInRiffWaveAndFormatChunks: 36,

	readFromFile: function(fileToReadFrom) {
		if (trjs.wave.initializing === true) return;
		trjs.wave.initializing = true;

		this.init(fileToReadFrom.name, undefined, undefined);

		var fileReader = new FileReader();
		fileReader.onloadend = function(fileLoadedEvent)
		{
			if (fileLoadedEvent.target.readyState == FileReader.DONE)
			{
				var bytesFromFile = fileLoadedEvent.target.result;
				var reader = new ByteStreamLittleEndian(bytesFromFile);

				this.readFromFilePath_ReadChunks(reader);
			}
			// CALLBACK from readFromFile
			trjs.wave.visualizer.loadFileAndInitialize_LoadComplete();
		};

		fileReader.readAsBinaryString(fileToReadFrom);
	},

	serverReadFromFile: function(fileToReadFrom) {
		// console.log('serverReadFromFile ' + fileToReadFrom);
		if (trjs.wave.initializing === true) return;
		trjs.wave.initializing = true;
		if (trjs.utils.extensionName(fileToReadFrom).toLowerCase() === '.raw') {
			// console.log('read file');
			this.init(fileToReadFrom, undefined, 1);
			this.samplingInfo.samplesPerSecond = version.WAVESAMPLING;
			$.post('read_binary_file', 
				{ file: fileToReadFrom })
				.done( function(data) {
					try {
						var reader = new ByteStreamLittleEndian(data);
						trjs.wave.file.readFromFilePath_ReadRaw(reader);
						// CALLBACK from readFromFile
					} catch(e) {
						trjs.log.alert('Read Wave: ' + e.name + ' - ' + e.message + ' - ' + e.lineNumber);
					}
					trjs.wave.visualizer.loadFileAndInitialize_LoadComplete();
					trjs.wave.initializing = false;
				})
				.fail( function(data) {
					trjs.log.alert('Cannot read raw file : ' + fileToReadFrom + ' - error:' + data.status);
					// console.log('Fail cannot read short wave file : ' + fileToReadFrom + ' - error:' + data.status);
					// console.log(data);
					trjs.wave.initializing = false;
				});
		} else if (trjs.utils.extensionName(fileToReadFrom).toLowerCase() === '.wav') {
			this.init(fileToReadFrom, undefined, undefined);
			$.post('read_binary_file', 
				{ file: fileToReadFrom })
				.done( function (data) {
					var reader = new ByteStreamLittleEndian(data);
					trjs.wave.file.readFromFilePath_ReadChunks(reader);
					// CALLBACK from readFromFile
					trjs.wave.visualizer.loadFileAndInitialize_LoadComplete();
					trjs.wave.initializing = false;
				})
				.fail( function(data) {
					trjs.log.alert('Cannot read short wave file : ' + fileToReadFrom + ' - error:' + data.status);
					// console.log('Fail cannot read short wave file : ' + fileToReadFrom + ' - error:' + data.status);
					// console.log(data);
					trjs.wave.initializing = false;
				});
		}
	},

	readFromFilePath_ReadRaw: function(reader) {
		this.samplingInfo.chunkSizeInBytes = reader.bytes.length;

		var samplesForChannelsMixedAsBytes = reader.readBytes(reader.bytes.length);

		var samplesForChannels = Sample.buildManyFromBytes
		(
			this.samplingInfo,
			samplesForChannelsMixedAsBytes
		);

		this.samplesForChannels = samplesForChannels;	
	},

	readFromFilePath_ReadChunks: function(reader) {
		var riffStringAsBytes = reader.readBytes(4);
		// console.log("riffStringAsBytes " + riffStringAsBytes);
		var numberOfBytesInFile = reader.readInt();
		// console.log("numberOfBytesInFile " + numberOfBytesInFile);
		var waveStringAsBytes = reader.readBytes(4);
		// console.log("waveStringAsBytes " + waveStringAsBytes);
		this.readFromFile_ReadChunks_Format(reader);
		this.readFromFile_ReadChunks_Data(reader);
	},

	readFromFile_ReadChunks_Format: function(reader) {
		var fmt_StringAsBytes = reader.readBytes(4);
		// console.log("fmt_StringAsBytes " + fmt_StringAsBytes);
		var chunkSizeInBytes = reader.readInt();
		// console.log("chunkSizeInBytes " + chunkSizeInBytes);
		var formatCode = reader.readShort();
		// console.log("formatCode " + formatCode);

		var numberOfChannels = reader.readShort();
		// console.log("numberOfChannels " + numberOfChannels);
		var samplesPerSecond = reader.readInt();
		// console.log("samplesPerSecond " + samplesPerSecond);

		var bytesPerSecond = reader.readInt();
		// console.log("bytesPerSecond " + bytesPerSecond);
		var bytesPerSampleMaybe = reader.readShort();
		// console.log("bytesPerSampleMaybe " + bytesPerSampleMaybe);
		var bitsPerSample = reader.readShort();
		// console.log("bitsPerSample " + bitsPerSample);

		var remainerOfChunkSize = chunkSizeInBytes - 16;
		if (remainerOfChunkSize>0) {
		    var remainer = reader.readBytes(remainerOfChunkSize);
		    // console.log("remainer " + remainer);
		}
		var samplingInfo = new SamplingInfo
		(
			"[from file]",
			chunkSizeInBytes,
			formatCode,
			numberOfChannels,
			samplesPerSecond,
			bitsPerSample	
		);

		this.samplingInfo = samplingInfo;
	},

	readFromFile_ReadChunks_Data: function(reader) {
		var dataStringAsBytes = reader.readBytes(4);
		// console.log("dataStringAsBytes " + dataStringAsBytes);
		var subchunk2SizeInBytes = reader.readInt();
		// console.log("subchunk2SizeInBytes " + subchunk2SizeInBytes);

		var samplesForChannelsMixedAsBytes = reader.readBytes(subchunk2SizeInBytes);

		var samplesForChannels = Sample.buildManyFromBytes
		(
			this.samplingInfo,
			samplesForChannelsMixedAsBytes
		);

		this.samplesForChannels = samplesForChannels;	
	},

	// instance methods

	durationInSamples: function() {
		var returnValue = 0;
		if (this.samplesForChannels != null)
		{
			if (this.samplesForChannels.length > 0)
			{
				returnValue = this.samplesForChannels[0].length;
			}
		}

		return returnValue;		
	},

	durationInSeconds: function() {
		return this.durationInSamples() / this.samplingInfo.samplesPerSecond;
	},

	extendOrTrimSamples: function(numberOfSamplesToExtendOrTrimTo) {
		var numberOfChannels = this.samplingInfo.numberOfChannels;
		var samplesForChannelsNew = [];

		for (var c = 0; c < numberOfChannels; c++)
		{
			var samplesForChannelOld = this.samplesForChannels[c];
			var samplesForChannelNew = new Sample[numberOfSamplesToExtendOrTrimTo];

			for (var s = 0; s < samplesForChannelOld.length && s < numberOfSamplesToExtendOrTrimTo; s++)
			{
				samplesForChannelNew[s] = samplesForChannelOld[s];				
			}

			var samplePrototype = this.samplingInfo.samplePrototype();

			for (var s = samplesForChannelOld.length; s < numberOfSamplesToExtendOrTrimTo; s++)
			{
				samplesForChannelNew[s] = samplePrototype.build();
			}

			samplesForChannelsNew[c] = samplesForChannelNew;
		}

		this.samplesForChannels = samplesForChannelsNew;
	},
};

// inner classes

function Sample()
{
	// do nothing
}
{
	var prototype = Sample.prototype;

	prototype.build = function() {};
	prototype.setFromBytes = function(valueAsBytes) {};
	prototype.setFromDouble = function(valueAsDouble) {};
	prototype.convertToBytes = function() {};
	prototype.convertToDouble = function() {};

   	Sample.buildManyFromBytes = function
	(
		samplingInfo,
		bytesToConvert
	)
	{
		var numberOfBytes = bytesToConvert.length;

		var numberOfChannels = samplingInfo.numberOfChannels;

		var returnSamples = [];

		var bytesPerSample = samplingInfo.bitsPerSample / trjs.wave.file.defBitsPerByte;

		var samplesPerChannel =
			numberOfBytes
			/ bytesPerSample
			/ numberOfChannels;

		for (var c = 0; c < numberOfChannels; c++)
		{
			returnSamples[c] = [];
		}

		var b = 0;

		var halfMaxValueForEachSample = Math.pow
		(
			2, trjs.wave.file.defBitsPerByte * bytesPerSample - 1
		);

		var samplePrototype = samplingInfo.samplePrototype();

		var sampleValueAsBytes = [];

		for (var s = 0; s < samplesPerChannel; s++)
		{				
			for (var c = 0; c < numberOfChannels; c++)
			{
				for (var i = 0; i < bytesPerSample; i++)
				{
					sampleValueAsBytes[i] = bytesToConvert[b];
					b++;
				}

				returnSamples[c][s] = samplePrototype.build().setFromBytes
				(
					sampleValueAsBytes
				);
			}
		}

		return returnSamples;
	};

	prototype.convertManyToBytes = function
	(
		samplesToConvert,
		samplingInfo
	)
	{
		var returnBytes = null;

		var numberOfChannels = samplingInfo.numberOfChannels;

		var samplesPerChannel = samplesToConvert[0].length;

		var bitsPerSample = samplingInfo.bitsPerSample;

		var bytesPerSample = bitsPerSample / trjs.wave.file.defBitsPerByte;

		var numberOfBytes =
			numberOfChannels
			* samplesPerChannel
			* bytesPerSample;

		returnBytes = [];

		var halfMaxValueForEachSample = Math.pow
		(
			2, trjs.wave.file.defBitsPerByte * bytesPerSample - 1
		);

		var b = 0;

		for (var s = 0; s < samplesPerChannel; s++)
		{
			for (var c = 0; c < numberOfChannels; c++)
			{
				var sample = samplesToConvert[c][s];	

				var sampleAsBytes = sample.convertToBytes();

				for (var i = 0; i < bytesPerSample; i++)
				{
					returnBytes[b] = sampleAsBytes[i];
					b++;
				}
			}						
		}

		return returnBytes;
	};
}

function Sample16(value)
{
	this.value = value;
}
{
	Sample16.MaxValue = Math.pow(2, 15) - 1;
	Sample16.DoubleMaxValue = Math.pow(2, 16);

	var prototype = Sample16.prototype;

	// Sample members
	prototype.build = function()
	{
		return new Sample16(0);
	};

	prototype.setFromBytes = function(valueAsBytes)
	{
		this.value =
		(
			(valueAsBytes[0] & 0xFF)
			| ((valueAsBytes[1] & 0xFF) << 8 )
		);

		if (this.value > Sample16.MaxValue) 
		{
			this.value -= Sample16.DoubleMaxValue;
		}

		return this;
	};

	prototype.setFromDouble = function(valueAsDouble)
	{
		this.value =
		(
			valueAsDouble * Sample16.MaxValue
		);

		return this;
	};

	prototype.convertToBytes = function()
	{
		var v =
		[
			((this.value) & 0xFF),
			((this.value >>> 8 ) & 0xFF)
		];
		return v;
	};	

	prototype.convertToDouble = function()
	{
		return 1.0 * this.value / Sample16.MaxValue;
	};
}

function Sample24(value)
{
	this.value = value;
}
{
	Sample24.MaxValue = Math.pow(2, 23) - 1;
	Sample24.DoubleMaxValue = Math.pow(2, 24);

	// Sample members

	var prototype = Sample24.prototype;

	prototype.build = function()
	{
		return new Sample24(0);
	};

	prototype.setFromBytes = function(valueAsBytes)
	{
		this.value =
		(
			((valueAsBytes[0] & 0xFF))
			| ((valueAsBytes[1] & 0xFF) << 8 )
			| ((valueAsBytes[2] & 0xFF) << 16)
		);

		if (this.value > Sample24.MaxValue) 
		{
			this.value -= Sample24.DoubleMaxValue;
		}

		return this;
	};

	prototype.setFromDouble = function(valueAsDouble)
	{
		this.value = 
		(
			valueAsDouble
			* Sample24.MaxValue
		);

		return this;
	};

	prototype.convertToBytes = function()
	{
		var v =
		[
			((this.value) & 0xFF),
			((this.value >>> 8 ) & 0xFF),
			((this.value >>> 16) & 0xFF)
		];
		return v;
	};

	prototype.convertToDouble = function()
	{
		return 1.0 * this.value / Sample24.MaxValue;
	};
}

function Sample32(value)
{
	this.value = value;
}
{
	Sample32.MaxValue = Math.pow(2, 32);
	Sample32.MaxValueHalf = Math.pow(2, 31);

	// Sample members

	prototype.build = function()
	{
		return new Sample32(0);
	};

	prototype.setFromBytes = function(valueAsBytes)
	{
		this.value = 
		(
			((valueAsBytes[0] & 0xFF))
			| ((valueAsBytes[1] & 0xFF) << 8 )
			| ((valueAsBytes[2] & 0xFF) << 16)
			| ((valueAsBytes[3] & 0xFF) << 24)
		);

		if (this.value > Sample32.MaxValue) 
		{
			this.value -= Sample32.DoubleMaxValue;
		}

		return this;
	};

	prototype.setFromDouble = function(valueAsDouble)
	{
		this.value = 
		(
			valueAsDouble
			* Sample32.MaxValue
		);

		return this;
	};

	prototype.convertToBytes = function()
	{
		var v =
		[
			((this.value) & 0xFF),
			((this.value >>> 8 ) & 0xFF),
			((this.value >>> 16) & 0xFF),
			((this.value >>> 24) & 0xFF)
		];
		return v;
	};

	prototype.convertToDouble = function()
	{
		return 1.0 * this.value / Sample32.MaxValue;
	};
}

function SamplingInfo
(
	 name,	   
	 chunkSizeInBytes,
	 formatCode,
	 numberOfChannels,		
	 samplesPerSecond,
	 bitsPerSample
)
{
	this.name = name;
	this.chunkSizeInBytes = chunkSizeInBytes;
	this.formatCode = formatCode;
	this.numberOfChannels = numberOfChannels;
	this.samplesPerSecond = samplesPerSecond;
	this.bitsPerSample = bitsPerSample;
}
{
	var prototype = SamplingInfo.prototype;

	SamplingInfo.buildDefault = function()
	{
		return new SamplingInfo
		(
			"Default",
			16, // chunkSizeInBytes
			1, // formatCode
			1, // numberOfChannels
			44100,	 // samplesPerSecond
			16 // bitsPerSample
		);
	};

	prototype.bytesPerSecond = function()
	{	
		return this.samplesPerSecond
			* this.numberOfChannels
			* this.bitsPerSample / trjs.wave.file.defBitsPerByte;
	};

	prototype.samplePrototype = function()
	{
		var returnValue = null;

		if (this.bitsPerSample == 16)
		{
			returnValue = new Sample16(0);
		}
		else if (this.bitsPerSample == 24)
		{
			returnValue = new Sample24(0);
		}
		else if (this.bitsPerSample == 32)
		{
			returnValue = new Sample32(0);
		}

		return returnValue;
	};

	prototype.toString = function()
	{
		var returnValue =
			"<SamplingInfo "
			+ "chunkSizeInBytes='" + this.chunkSizeInBytes + "' "
			+ "formatCode='" + this.formatCode + "' "
			+ "numberOfChannels='" + this.numberOfChannels + "' "
			+ "samplesPerSecond='" + this.samplesPerSecond + "' "
			+ "bitsPerSample='" + this.bitsPerSample + "' "
			+ "/>";

		return returnValue;
	};
}

/*
 * externals objects
 */
return {
	// VARIABLES
	canvas: null, // canvas to display the sound signal
	file: fileWave, // pointer for wavefile object
	fileWaveLoaded: false, // true if a file is loaded
	graphics: null, // context of the canvas
	initializing: false, // is the file & wave just being loading
	lengthInSeconds: 0, // width of window in seconds
	mouse: mouseWave, // handling the mouse over the drawing
	newWinsize: false, // store the fact that the size of the displayed wave has changed
	numberOfFramesPerSecond: 0, // if 0 not set
	posLine: -1, // previous position for cursor on wave file (vertical line)
	runningId: null, // previous id of the highlighted (running) part
	runningLeft: -1, // previous position of the left of the highlighted (running) part
	runningRight: -1, // previous position of the right of the highlighted (running) part
	sizeOfSecondValue: 100, // number of pixels to represent a second (in pixels)
	taps: tapsWave, // filter for computing wave
	viewdata: null, // contains data wave to be repainted
	viewport: null, // size of display for wave
	visualizer: visualizerWave, // structure that contains information about the sound signal file and visualize functions and objects
	waveHeightValue: 60, // default height of the wavefile drawing.
	waveReady: false, // the first wavefile has been draw or not
    waveVisible: true,
	winsizeValue: 10, // size of wave displayed in seconds
	zoomLeftPosValue: 0, // left position of the zoom window (in seconds)

	// FUNCTIONS
	clear: function() { // ok. frees wave.
		// reset all data
		trjs.wave.visualizer.clearCanvas();
		trjs.wave.waveReady = false;
	},
	drawWave: function(p1, p2) { return trjs.wave.visualizer.drawWave(p1, p2); },
	hide: function() { 	
		$('#wave').hide();
		$('#button-page-left').hide();
		$('#button-page-right').hide();
		if (trjs.dmz.waveSlider===true) $('#slider-wave').hide();
	},
	highlight: function(start, end, id, color) { return trjs.wave.visualizer.highlightElement(start, end, id, color); }, // ok. (set highlight of wave)

	/**
	 * display information about the location of the wave
	 * method infoWave
	 */
	infoWave: function() {
		$('#startwave').text(trjs.transcription.formatTime(trjs.wave.zoomLeftPos()));
		$('#stopwave').text(trjs.transcription.formatTime(trjs.wave.zoomLeftPos()+trjs.wave.winsize()));
	},
	isReady: function() { if (trjs.wave.fileWaveLoaded && trjs.wave.viewdata && trjs.wave.waveReady) return true; else return false; },
	isVisible: function() {
		return trjs.wave.visualizer.waveVisible;
	},
	load: function(data) {
		if (trjs.wave.isVisible() )
			fileWave.serverReadFromFile(data);
	},
	resetWidth: function() {
		if (trjs.wave.isReady() && trjs.param.showWave) {
			trjs.wave.visualizer.loadFileAndInitialize_LoadComplete();
		}
	},
	setVisible: function(choice) { // shows and hides wave
		if (choice === true) {
			trjs.wave.visualizer.waveVisible = true;
			if (trjs.wave.isReady()) {
				trjs.wave.visualizer.loadFileAndInitialize_LoadComplete();
				trjs.wave.show();
			} else if (trjs.transcription.initialLoadFinished()) {
				trjs.dmz.serverLoadWaveImage(trjs.data.mediaRealFile());
				trjs.wave.show();
			}
		} else {
			trjs.wave.visualizer.waveVisible = false;
			trjs.wave.hide();
		}
	},
	show: function() {
		$('#wave').show();
		$('#button-page-left').show();
		$('#button-page-right').show();
		if (trjs.dmz.waveSlider===true) $('#slider-wave').show();
	},
	waveHeight: function(pixels) { if (pixels !== undefined) trjs.wave.waveHeightValue = pixels; return trjs.wave.waveHeightValue; },
	winsize: function(p) {
		if (p !== undefined) {
			var v = parseFloat(p); // size in seconds of zoom windows
			if (isNaN(v))
				trjs.log.alert('Incoherent value for wave winsize');
			else {
				if (v !== trjs.wave.winsizeValue) // store the fact that the size has changed
					trjs.wave.newWinsize = true;
				trjs.wave.winsizeValue = v; // sets size in seconds of zoom windows
			}
		}
		return trjs.wave.winsizeValue;
	}, // gets size in seconds of zoom windows
	zoomLeftPos: function (argument) { // this is different than partition
		if (argument !== undefined)
			trjs.wave.zoomLeftPosValue = argument; // sets the left position of wave window
		return trjs.wave.zoomLeftPosValue; // left position of wave window
	},
};
})();
