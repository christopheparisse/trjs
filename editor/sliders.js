/**
 * implementation of the sliders (for wave and for partition)
 * @author Christophe Parisse
 * @date august 2014
 */

trjs.slider = ( function() {
	var slider = {
		type: '',	// 'wave' vs. 'partition'
		canvas: null,
		graphics: null,
		timelength: 0,  // total duration of the media
		step: 1,		// space between two ticks
		npxpersec: 1,  // number of pixels per second
		minimalStep: 1, // minimal distance between two redraw of populate
		previousPopulate: 0,
		init: function(div, type) {
			this.canvas = document.createElement("canvas");
			this.canvas.width = div.width();
			this.canvas.height = 24; // div.height();
			div[0].appendChild(this.canvas);
			this.graphics = this.canvas.getContext("2d");
			this.type = type;
		},
		computeParams: function() {
			if (this.timelength <= 0) return;
			this.npxpersec = this.canvas.width / this.timelength;
			if (this.timelength < 20) // less than 20 seconds
				this.step = 1;
			else if (this.timelength < 40) // less than 40 seconds
				this.step = 2;
			else if (this.timelength < 100) // less than 1mn 40s
				this.step = 5;
			else if (this.timelength < 200) // less than 3mn 20s
				this.step = 10;
			else if (this.timelength < 600) // less than 10mn
				this.step = 30;
			else if (this.timelength < 1200) // less than 20mn
				this.step = 60;
			else if (this.timelength < 2400) // less than 40mn
				this.step = 120;
			else if (this.timelength < 3600) // less than 60mn
				this.step = 180;
			else if (this.timelength < 4800) // less than 1h 30mn
				this.step = 270;
			else if (this.timelength < 6200) // less than 2h
				this.step = 360;
			else if (this.timelength < 12400) // less than 4h
				this.step = 720;
			else
				this.step = this.timelength / 20;
			this.minimalStep = 5 * (1/this.npxpersec); // 5 times the number of seconds per pixel
		},
	};

	/**
	 * initialization of timelength and other values
	 * can be reused if necessary if media duration is better computed
	 */
	slider.initializeDuration = function() {
		if (this.type === 'wave') {
			this.initializeDurationWave();
			this.computeParams();
		} else {
			this.initializeDurationPartition();
			this.computeParams();
		}
		return;
	};

	/**
	 * initialization of timelength and other values
	 * this is based on information only in the media
	 * @method initializeDurationWave
	 */
	slider.initializeDurationWave = function() {
		this.timelength = 0;
		if (trjs.wave && trjs.wave.isReady()) { // best way to comute media duration
			this.timelength = trjs.wave.file.durationInSeconds();
			trjs.data.setMediaDuration(this.timelength);
			this.computeParams();
			return;
		}
		var media = $('#media-display')[0].firstElementChild;
		if (media.duration != 'NaN' && media.duration > 0) { // this does not seem to work ?
			this.timelength = media.duration;
			this.computeParams();
			return;
		}
		return;
	};

	/**
	 * initialization of timelength and other values
	 * this is based on information not in the media
	 * @method initializeDurationPartition
	 */
	slider.initializeDurationPartition = function() {
		this.timelength = 0;
		if (trjs.wave && trjs.wave.isReady()) { // best way to comute media duration
//			this.timelength = trjs.wave.file.durationInSeconds();
			this.timelength = trjs.wave.lengthInSeconds;
			trjs.data.setMediaDuration(this.timelength);
			this.computeParams();
			return;
		}
		if (trjs.data.mediaDuration()) { // correct only if correctly computed in the datafile
			this.timelength = trjs.data.mediaDuration();
			this.computeParams();
			return;
		}
		if (trjs.data.maxLinkingTime>0)
			this.timelength = trjs.data.maxLinkingTime;
		else
			this.timelength = 1000;
		this.computeParams();
		return;
	};
	
	var colorsWave = {
		background: '#EEEEEE',
		fill: '#BBAAFF',
		tics: '#0077FF',
		text: '#0077FF',
	};
	
	var colorsPartition = {
		background: '#FFFFFF',
		fill: '#FFBBAA',
		tics: '#FF7700',
		text: '#FF7700',
	};

	/**
	 * draws the material inside the sliders
	 * the drawing is different for the wave slider and the partition slider
	 * @method slider.populate
	 * @param time where to indicate the time position in the recording
	 */
	slider.populate = function(time, colorTheme) {
		if (this.timelength <= 0) { // initialization of timelength and other values only the first time
			this.initializeDuration();
		}
		if (time===undefined) time = 0;
		this.graphics.fillStyle = colorTheme.background;
		this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.graphics.fillStyle = colorTheme.fill;
		this.graphics.fillRect(0, this.canvas.height*0.5, time*this.npxpersec, this.canvas.height);
		this.graphics.fillStyle = colorTheme.tics;
		for (var t = 0; t < this.timelength; t += this.step) {
			this.graphics.fillRect(t*this.npxpersec, 0, 2, this.canvas.height*0.2); //this.canvas.height*0.7);
		}
		this.graphics.fillStyle = colorTheme.text;
		for (var t = 0; t < this.timelength; t += this.step) {
			this.graphics.fillText(trjs.transcription.formatTime(Math.floor(t)), t*this.npxpersec+3, this.canvas.height*0.4);
		}
		this.previousPopulate = time;
	};
	slider.repopulate = function(time, colorTheme) {
		if (this.timelength <= 0) { // initialization of timelength and other values only the first time
			this.populate(time, colorTheme);
			return;
		}
		if (time===undefined) time = 0;
		if (Math.abs(time - this.previousPopulate) < this.minimalStep) return;
		this.graphics.fillStyle = colorTheme.background;
		this.graphics.fillRect(0, this.canvas.height*0.5, this.canvas.width, this.canvas.height); 
		this.graphics.fillStyle = colorTheme.fill;
		this.graphics.fillRect(0, this.canvas.height*0.5, time*this.npxpersec, this.canvas.height);
		this.previousPopulate = time;
	};
	
	/**
	 * finds the time in seconds corresponding to the click position
	 * @method slider.getPosition
	 * @param event
	 */
	slider.getPosition = function(e) {
		//console.log(e.pageX);
		var r = e.target.getBoundingClientRect();
		var pc = (e.pageX - r.left) / this.canvas.width;
		return pc * this.timelength;
	};
	
	var sliderWave = Object.create(slider);
	var sliderPartition = Object.create(slider);
	
	return {
		sp: sliderPartition,
		/**
		 * initializes the sliders
		 */
		initWave: function() {
			if (sliderWave.canvas) return;
			$('.slider').css({'cursor': 'url(style/triangle-orange.cur), default'}); // cursor by Pedro Alves at www.cursor.cc
			$('#canvas-wave').click(trjs.slider.clickWave);
			// creates the sliders and a canvas for the sliders
			sliderWave.init($('#canvas-wave'), 'wave');
		},
		initPartition: function() {
			if (sliderPartition.canvas) return;
			$('.slider').css({'cursor': 'url(style/triangle-orange.cur), default'}); // cursor by Pedro Alves at www.cursor.cc
			$('#canvas-partition').click(trjs.slider.clickPartition);
			// creates the sliders and a canvas for the sliders
			sliderPartition.init($('#canvas-partition'), 'partition');
		},

		/**
		 * draws the bases for the sliders
		 */
		populateWave: function(t) {
			sliderWave.initializeDurationWave();
			sliderWave.populate(t, colorsWave);
		},
		populatePartition: function(t) {
			sliderPartition.initializeDurationPartition();
			sliderPartition.populate(t, colorsPartition);
		},
		repopulateWave: function(t) {
			sliderWave.repopulate(t, colorsWave);
		},
		repopulatePartition: function(t) {
			sliderPartition.repopulate(t, colorsPartition);
		},
		clickWave: function(e) {
			var x = sliderWave.getPosition(e);
			sliderWave.populate(x, colorsWave);
			var p = x - (trjs.wave.winsize()/2);
			if (p<0) p = 0;
			trjs.wave.visualizer.drawWave(trjs.wave.winsize(), p);
			trjs.wave.visualizer.drawWaveLine(x);
			var media = $('#media-display')[0].firstElementChild;
			if (media) media.currentTime = x;
			if (trjs.param.synchro.block() === true) {
				trjs.events.goToTime('wave', x);
			}
		},
		clickPartition: function(e) {
			var x = sliderPartition.getPosition(e);
			sliderPartition.populate(x, colorsPartition);
			if (trjs.param.synchro.free() !== true && trjs.wave && trjs.wave.isReady()) {
				trjs.events.goToTime('partition',x);
			}
		},
	};
} )();
