/**
 * utilities to convert audio and video files
 * @author Christophe Parisse
 * @date december 2014
 */

var fs = require('fs');
var os = require('os');
var path = require('path');
var async = require("async");
var glob = require("glob");
var childproc = require('child_process');
var filelookup = require('./filelookup.js');
var version = require('../editor/version.js');
var codefn = require('../editor/codefn.js');

var medialibrary = exports;

var backgroundImage = 'style/black.png';
// var backgroundImage = 'style/blue.png';

/*
 * starts an external program and redirect the standard oupput and error output
 * the output is kept in memory and returned at the end of the program
 * @method callProgram
 * @param {string} location of program
 * @param {array} artugment of the call
 * @param callback function
 */
function callProgram(cmd, cmdargs, callback) {
	// executes cmd
	var resultout = [];
	var resulterr = [];
	try {
		var ffmpeg = childproc.spawn(cmd, cmdargs);
	} catch(e) {
		console.log('command : ' + cmd.join(' ') + ' : error with code ' + e.toString());
		callback(1, { code:-1, out: [], err: [e.toString()] });
	}
	ffmpeg.stdout.on('data', function (data) {
		// if (version.debug(__filename)) console.log('FFMPEG out: ' + data);
		resultout.push(String(data));
	});
	ffmpeg.stderr.on('data', function (data) {
		// if (version.debug(__filename)) console.log('FFMPEG err: ' + data);
		resulterr.push(String(data));
	});
	ffmpeg.on('close', function (code) {
		if (version.debug(__filename)) console.log('FFMPEG process exited with code ' + code);
		callback(0, { code: code, out: resultout, err: resulterr });
	});
}

/*
 * starts ffprobe and redirect the standard oupput and error output
 * the output is kept in memory and returned at the end of the program
 * @method callFFPROBE
 * @param {array} artugment of the call
 * @param callback function
 */
function callFFPROBE(args, callback) {
	if (version.debug(__filename)) console.log('Silent FFPROBE ' + version.ffprobeLoc() + ' ' + args.join(' '));
	callProgram(version.ffprobeLoc(), args, function(err, data) {
		if (version.debug(__filename)) console.log('err ' + err);
		if (version.debug(__filename)) console.log(data);
		if (err === 0)
			var js = JSON.parse(data.out.join('\n'));
		else
			var js = JSON.parse(data.out.join('\n') + data.err.join('\n'));
		callback(err, js);
	});
}

/**
 * executes an ffMPEG command and allows displaying intermediate processing
 * @method callFFMPEG
 * @params {array} arguments of the ffmpeg commmand, one argument per word
 * @params {integer} percentage from 0 to 100: ticks the timing of the calling of the display function
 * @params {float} if diff from 0, duration of destination else duration is the total duration and is computed online
 * @params {function (percentage)} function called for display purposes at each tick (second parameter) with percentage as an argument
 * @params {function} function called when processing is ended: first argument : error code, second argument : message
 */
function callFFMPEG(args, percent, duration, display, callback) {
	// console.log("callFFMPEG " + version.ffmpegLoc());
	if (percent === 0) {
		if (version.debug(__filename)) console.log('Silent FFMPEG ' + args.join(' '));
		callProgram(version.ffmpegLoc(), args, function(err, data) {
			if (err === 1)
				callback(err, data.err);
			else
				callback(data.code, data.out.join('\n'));
		});
	} else {
		// executes args
		var pcBeforeFFmpeg = 0;
		try {
			var ffmpeg = childproc.spawn(version.ffmpegLoc(), args);
		} catch(e) {
			console.log('error with code ' + e.toString());
			callback(1, 'end conversion : error ' + e.toString());
			return;
		}
		var npercent = percent;
		var mp4started = false;
		ffmpeg.stdout.on('data', function (data) {
			if (version.debug(__filename)) console.log('xFFMPEG out: ' + data);
		});
		ffmpeg.stderr.on('data', function (data) {
			if (mp4started === false) {
				// display('start conversion');
				mp4started = true;
				if (version.debug(__filename)) console.log('xFFMPEG err: 0%');
				display(0);
			}
			// find   Duration: 00:32:23.88, start: 0.000000, bitrate: 1353 kb/s
			// find   time=00:00:48.83 
			// and to the math
			if (version.debug(__filename)) console.log('xFFMPEG err: ' + data);
			var str = String(data);
			if (str.indexOf('already exists') >= 0) {
				if (version.debug(__filename)) console.log(str);
				return;
			}
			if (duration === 0) {
				var p = str.indexOf('Duration:');
				if ( p !== -1) {
					var s = str.substr(p);
					var re = new RegExp('(\\d{2}):(\\d{2}):(\\d{2})');
					var nh = re.exec(s);
					if (nh)
						duration = (parseInt(nh[1]) * 3600 + parseInt(nh[2]) * 60 + parseInt(nh[3])) * 1.06;
					if (version.debug(__filename)) console.log('s ' + s.substr(0,25) + ' ' + nh + ' duration is: ' + duration + ' percent: ' + percent + ' -- ');
				}
			} else {
				if (percent === 0 || duration === 0) return;
				var p = str.indexOf('time=');
				if ( p !== -1) {
					var s = str.substr(p+5);
					var timecur = parseInt(s.substr(0,2)) * 3600 + parseInt(s.substr(3,2)) * 60 + parseInt(s.substr(6,2));
					var pc = Math.round((timecur/duration)*100);
					if (version.debug(__filename)) console.log('s ' + s.substr(0,10) + ' pc ' + pc + ' pcbefore ' + pcBeforeFFmpeg);
					if (pc > pcBeforeFFmpeg) {
						pcBeforeFFmpeg = pc;
						// display('notyet ' + parseInt(pc) + '%');
						if (pc>npercent) {
							display(parseInt(pc));
							if (version.debug(__filename)) console.log('DISPLAY: ' + pc + '%');
							npercent += percent;
						}
						if (version.debug(__filename)) console.log('xFFMPEG out: ' + pc + '%');
					}
				}
			}
		});
		ffmpeg.on('close', function (code) {
			if (version.debug(__filename)) console.log('xFFMPEG process exited with code ' + code);
			if (code === 0)
				callback(0, 'end of conversion');
			else
				callback(code, 'end conversion : error ' + code);
		});
	}
}


/**
 * get files from list of files and directories
 * @method getFiles
 * @param array of filename or directory names (wildcard accepted)
 * @param extension to filter the names (optional)
 */
function getFiles(names, ext) {
	var expnames = [];
	if (ext !== undefined)
		var re = new RegExp("\\." + ext);
	if (typeof names === 'string') {
		if (ext !== undefined) {
			if (re.test(d[j]))
				return [names];
			else
				return [];
		} else
			return [names];
	}
	for (var i in names) {
		try {
			var stats = fs.lstatSync(names[i]);
			if (stats.isDirectory()) {
				var n = names[i] + '/*';
			} else {
				var n = names[i];
			}
			try {
				var d = glob.glob.sync(n);
			} catch(e) { // if glob does not work
				var d = [names[i]];
			}
			if (ext !== undefined) {
				for (var j in d)
				// filter n with ext
					if (re.test(d[j]))
						expnames.push(d[j]);
			} else
				expnames = expnames.concat(n);
		} catch (e) {
			console.log(names[i] + ' does not exist or cannot be accessed (' + e.toString() + ')');
		}
	}
	return expnames;
}

/**
 * get length of media files
 * @method getMediaLength
 * @param array of filename or directory names (wildcard accepted)
 * @param callback function = err + json= {code:, total:, values: [{name: length:}]}
 */
medialibrary.getMediaLength = function(names, ext, callback) {
	var expnames = getFiles(names, ext);
	var times = [];
	var args = ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams'];
	var nbstart = 0;
	for (var i in expnames) {
		nbstart++;
		callFFPROBE(args.concat([expnames[i]]), function(err, data) {
			if (err === 0 && data.streams !== undefined && data.streams.length>0) {
				times.push({name: data.format.filename, length: data.streams[0].duration});
			} else {
				console.log('ERROR: ' + data.toString());
			}
			nbstart--;
		});
	};
	var interval;
	var check = function() {
		// console.log('!!! check at ' + Date());
		if (nbstart <= 0) {
			clearInterval(interval);
			var sum = 0;
			for (var i in times) {
				sum += parseFloat(times[i].length);
			}
			callback({total: sum, values: times});
			return;
		}
	};
	interval = setInterval(check, 2000);
};

/**
 * @method getStream
 * @param {string}
 */
function getStream(name, json) {
	for (var i in json.streams) {
		if ( json.streams[i].codec_type === name)
			return i;
	}
	return -1;
}

function tok(x) { 
	return Math.round(x/1000) + 'k';
}

function min(x,y) { return (x<y)?x:y; }

function changeExtension(x, ext) {
	x = String(x);
	var p = x.lastIndexOf('.');
	if (p === -1)
		return x + '.' + ext;
	else
		return x.substr(0, p) + '.' + ext;
}

function replaceExtension(x, ext, format) {
	var p = x.lastIndexOf('.');
	var h = (p === -1) ? x : x.substr(0, p);
	var re = new RegExp("(.*)([\-_\.](original|master|240p|480p|576p|720p|1080p|4K))");
	var nh = re.exec(h);
	if (format !== '') {
		if (nh)
			return nh[1] + '-' + format.substr(1) + '.' + ext;
		else
			return h + '-' + format.substr(1) + '.' + ext;
	} else {
		if (nh)
			return nh[1] + '.' + ext;
		else
			return h + '.' + ext;
	}
}

function chooseVideoRate(height, bit_rate) {	
	// '2500k';
	//console.log("BIT RATE "+ bit_rate);
	
	if (height <= 240) {
		// low quality
		return tok(min(parseInt(bit_rate), 500000));
	} else if (height <= 480) {
		// middle quality
		return tok(min(parseInt(bit_rate), 1500000));
	} else if (height <= 720) {
		// middle-high quality
		return tok(min(parseInt(bit_rate), 2500000));
	} else if (height <= 1080) {
		// height quality
		return tok(min(parseInt(bit_rate), 4000000));
	} else if (height <= 2160) {
		// height quality
		return tok(min(parseInt(bit_rate), 8000000));
	} else
		// master or original or 4K quality
		// return tok(bit_rate);
		return tok(min(parseInt(bit_rate), 16000000));
}

function round2(x) {
	var n = Math.floor(x);
	var r = x % 2;
	if (r < 1)
		return n;
	else
		return n+1;
}

function chooseSize(height, heightSource, widthSource) {
	if (!height) return '';
	// '1024x720';
	heightSource = parseInt(heightSource);
	height = parseInt(height);
	widthSource = parseInt(widthSource);
	// console.log("chooseSize: " + height + ' ' + widthSource);
	if (height === -1)
		return widthSource + 'x' + heightSource;
	height = min(heightSource, height);
	var width = (widthSource/heightSource) * height;
	// console.log("chooseSize: " + height + ' ' + width);
	return round2(width) + 'x' + round2(height);
}

function chooseRatio(height, display_aspect_ratio) {
	if (!height) return '';
	// '16:9';
	if (display_aspect_ratio === '0:1')
		return null;
	else
		return display_aspect_ratio;
} 

function chooseAudioRate(height, bit_rate) {
	if (!height) return '';
	// '320000';
	if (height <= 240) {
		// low quality
		return tok(min(bit_rate, 128000));
	} else if (height <= 480) {
		// low quality
		return tok(min(bit_rate, 192000));
	} else if (height <= 1080) {
		// low quality
		return tok(min(bit_rate, 256000));
	} else
		return tok(min(bit_rate, 320000));
} 

function chooseChannels(height, channels) {
	if (!height) return 1;
	// '2';
	if (height <= 480) {
		// low quality one channel only
		return 1;
	} else if (channels > 0) {
		return 2;
	} else {
		return 1;
	}
}

/**
 * batch conversion of a set of files
 * @method medialibrary.batchConvert
 * @param array of filename or directory names (wildcard accepted)
 * @param extension name of source files
 * @param output
 * @param percent
 * @param maxstart
 * @param threads
 * @param overwrite
 * @param format
 * @param vcodec
 * @param acodec,
 * @param height of video destination - 240 - 480 - 720 - 1080
 * @param callback function = err + json= {code:, total:, values: [{name: length:}]}
 */
medialibrary.batchConvert = function(names, ext, output, percent, maxstart, threads, overwrite, format, vcodec, acodec, height, callback) {
	var expnames = getFiles(names, ext);
	var times = [];
	var nbstart = 0;
	var started = 0;
	var convert = function(name) {
		nbstart++;
		if (format === 'mp3' || format === 'wav')
			medialibrary.processAudio(name, output, percent, threads, overwrite, format, -1, -1,
				function(mess, filein, fileout) { console.log(filein + ' --> ' + fileout + ' ' + mess + '%'); },
				function(err, mess) {
					if (err>0)
						console.log('ERROR: ' + name + ' ' + mess);
					else
						console.log(mess);
					nbstart--;
				}
			);
//medialibrary.processAudio = function(name, output, percent, threads, overwrite, format, begin, end, callprintout, callback)
		else
			medialibrary.processVideo(name, output, null, percent, threads, overwrite, format, vcodec, acodec, height, -1, -1,
				function(mess, filein, fileout) { console.log(filein + ' --> ' + fileout + ' ' + mess + '%'); },
				function(err, mess) {
					if (err>0)
						console.log('ERROR: ' + name + ' ' + mess);
					else
						console.log(mess);
					nbstart--;
				}
			);
//medialibrary.processVideo = function(name, output, subtitles, percent, threads, overwrite, format, vcodec, acodec, height, begin, end, callprintout, callback)			
	};
	var interval;
	var check = function() {
		// console.log('-check at ' + Date() + ' ' + started + ' ' + nbstart );
		// check if we can start something
		if (started < expnames.length && nbstart < maxstart) {
			convert(expnames[started]);
			started++;
			return;
		}
		// check if everything is finished
		if (nbstart <= 0) {
			clearInterval(interval);
			callback('all conversions finished');
			return;
		}
	};
	for (var i=0; i<maxstart; i++)
		check(); // first maxstart start(s) are now
	interval = setInterval(check, percent<0 ? 100 : 10000);
};

/**
 * conversion of a media (as colled from web client)
 * @param file to be converted
 * @param format (mp4, webm, ogv
 * @param height of video (number of lines)
 * @param pointer to socket.io object
 * @param pointer to display window for progress
 * @param callabck at the end of the start of the call (not the end of the conversion: use box for this)
 */
medialibrary.convertToVideo = function(file, format, height, io, box, callback) {
	var vcodec = 'libx264';
	var acodec = 'aac';
	if (format === 'mp4') {
		vcodec = 'libx264';
		acodec = 'aac';
	} else if (format === 'webm') {
		vcodec = 'libvpx';
		acodec = 'libvorbis';
	} else if (format === 'ogv' || format === 'ogg') {
		format = 'ogg';
		vcodec = 'theora';
		acodec = 'libvorbis';
	}
	file = codefn.decodeFilename(file);
	io.sockets.emit(box, { start: 'conversion of ' + file + ' to ' + format });
	if (version.debug(__filename)) console.log('box: ' + box + ' ' + io.toString());
	var newfile = replaceExtension(file, format, (height === '240' ? '+240p' : (height === '480' ? '+480p' : (height === '720' ? '+720p' : ''))));
//medialibrary.processVideo = function(name, output, subtitles, percent, threads, overwrite, format, vcodec, acodec, height, begin, end, callprintout, callback)			
	medialibrary.processVideo(file, newfile, null, 2, 1, true, format, vcodec, acodec, height, -1, -1,
		function(mess, filein, fileout) { 
			if (version.debug(__filename)) console.log(filein + ' --> ' + fileout + ' ' + mess +'% box: ' + box);
			io.sockets.emit(box, { processed: mess, name: fileout, box: box });
		},
		function(err, mess) {
			if (version.debug(__filename)) console.log('conversion of ' + file + ' ended box: ' + box);
			io.sockets.emit(box, { end: 'conversion of ' + file + ' ended' });
		}
	);
	callback(0, 'start conversion of : ' + file + ' to ' + format);
};

/*
 * extraction of a part of a whole file
 * @param file to be converted
 * @param name of result file
 * @param ticks for output during processing
 * @param true if overwrite result file
 * @param start of time to be extracted
 * @param length of time to be extracted
 * @param pointer to socket.io object
 * @param pointer to display window for progress
 * @param callabck at the end of the start of the call (not the end of the conversion: use box for this)
 */
medialibrary.mediaExtract = function(mediaFile, output, percent, overwrite, begin, end, io, box, callback) {
	if (version.debug(__filename))
		console.log('medialibrary.mediaExtract: ' + mediaFile + '  ' + output + '  ' + percent + '  ' 
			+ overwrite + '  ' + begin + '  ' + end + '  ' + io + '  ' + box + '  ' + callback);
	if (io) {
		var extname = path.extname(mediaFile);
		if (extname === '.mp3' || extname === '.wav')
			medialibrary.processAudio(mediaFile, output, percent, 1, overwrite, extname.substr(1), begin, end,
				function(mess, oname, nname) { 
					if (version.debug(__filename)) console.log(oname + ' --> ' + nname + ' ' +  mess +'% box: ' + box);
					io.sockets.emit(box, { processed: mess, name: nname, box: box });
				},
				function(err, mess) {
					if (version.debug(__filename)) console.log('extraction for ' + mediaFile + ' ended box: ' + box);
					io.sockets.emit(box, { end: 'extraction for ' + mediaFile + ' ended (' + mess + ')'});
				}
			);
// medialibrary.processAudio = function(name, output, percent, threads, overwrite, format, begin, end, callprintout, callback)
		else
			medialibrary.processVideo(mediaFile, output, null, percent, 1, overwrite, 'mp4', 'libx264', 'aac', -1, begin, end,
				function(mess, oname, nname) { 
					if (version.debug(__filename)) console.log(oname + ' --> ' + nname + ' ' +  mess +'% box: ' + box);
					io.sockets.emit(box, { processed: mess, name: nname, box: box });
				},
				function(err, mess) {
					if (version.debug(__filename)) console.log('extraction for ' + mediaFile + ' ended box: ' + box);
					io.sockets.emit(box, { end: 'extraction for' + mediaFile + ' ended (' + mess + ')'});
				}
			);
	} else {
		var extname = path.extname(mediaFile);
		if (extname === '.mp3' || extname === '.wav')
			medialibrary.processAudio(mediaFile, output, percent, 1, overwrite, extname.substr(1), begin, end,
				function(mess, oname, nname) { console.log(oname + ' --> ' + nname + ' ' + mess + '%'); },
				function(err, str) { console.log('end of extraction: ' + err + ' - ' + str); }
			);
		else
			medialibrary.processVideo(mediaFile, output, null, percent,  1, overwrite, 'mp4', 'libx264', 'aac', -1, begin, end,
				function(mess, oname, nname) { console.log(oname + ' --> ' + nname + ' ' + mess + '%'); },
				function(err, str) { console.log('end of extraction: ' + err + ' - ' + str); }
			);
	}
	callback(0, 'start extraction: ' + mediaFile);
};

/*
 * burn subtitles in a part or a whole file
 * @param file to be converted
 * @param name of result file
 * @param name of subtitle file
 * @param ticks for output during processing
 * @param true if overwrite result file
 * @param start of time to be extracted
 * @param length of time to be extracted
 * @param pointer to socket.io object
 * @param pointer to display window for progress
 * @param callabck at the end of the start of the call (not the end of the conversion: use box for this)
 */
medialibrary.burnSubtitles = function(mediaFile, output, subtFile, percent, overwrite, begin, end, io, box, callback) {
	if (subtFile === undefined) {
		callback(1, 'subtitle file must be defined');
		return;
	}
	var subtname = getFiles(subtFile);
	if (subtname.length != 1) {
		callback(1, subtname.length>1 ? 'cannot have more than one subtitle file at a time' : 'subtitle file not found');
		return;
	}
	if (version.debug(__filename))
		console.log('medialibrary.burnSubtitles: ' + mediaFile + '  ' + output + '  ' + subtFile + '  ' + percent + '  ' 
			+ overwrite + '  ' + begin + '  ' + end + '  ' + io + '  ' + box + '  ' + callback);
	if (io) {
		medialibrary.processVideo(mediaFile, output, subtname[0], percent, 1, overwrite, 'mp4', 'libx264', 'aac', -1, begin, end,
			function(mess, oname, nname) { 
				if (version.debug(__filename)) console.log(oname + ' --> ' + nname + ' ' +  mess +'% box: ' + box);
				io.sockets.emit(box, { processed: mess, name: nname, box: box });
			},
			function(err, mess) {
				if (version.debug(__filename)) console.log('burning subt for ' + mediaFile + ' ended box: ' + box);
				io.sockets.emit(box, { end: 'burning subtitles for ' + mediaFile + ' ended (' + mess + ')'});
			}
		);
	} else {
		medialibrary.processVideo(mediaFile, output, subtname[0], percent, 1, overwrite, 'mp4', 'libx264', 'aac', -1, begin, end,
			function(mess, oname, nname) { console.log(oname + ' --> ' + nname + ' ' + mess + '%'); },
			function(err, str) { console.log('end of burn subtitles: ' + err + ' - ' + str); }
		);
	}
	callback(0, 'start burning subtiltes of : ' + mediaFile);
};

medialibrary.processVideo = function(name, output, subtitles, percent, threads, overwrite, format, vcodec, acodec, height, begin, end, callprintout, callback) {
	if (version.debug(__filename))
		console.log('medialibrary.processVideo: ' + name + '  ' + output + '  ' + subtitles + ' ' + percent + '  ' + threads + ' ' 
			+ overwrite + '  ' + format + '  ' + vcodec + '  ' + acodec + '  ' + height + '  ' + begin + '  ' + end + '  ' + callprintout + '  ' + callback);
	/*
	 * normalizes begin, end and filename
	 */
	var extname = path.extname(name);
	var duration = 0;
	if (begin !== -1) {
		begin = Math.floor(begin);
		var nend = Math.floor(end);
		if (nend - end > 0.001) nend++;
		duration = nend;
		nend -= begin;
		if (!output) {
			if (subtitles) {
				if (extname === ".mp3" || extname === '.wav') {
					format = 'mp4';
					var newname = changeExtension(name, 'subt-' + begin + '-' + nend + ".mp4");
				} else
					var newname = changeExtension(name, 'subt-' + begin + '-' + nend + extname);
			} else
				var newname = changeExtension(name, begin + '-' + nend + extname);
		}
		else
			var newname = output;
	} else {			
		var nend = end;
		if (subtitles && (extname === ".mp3" || extname === '.wav'))
				format = 'mp4';
		if (!output) // output === '' or null or undefined or 0
			var newname = changeExtension(name, format);
		else if (output.indexOf('+') === 0)
			var newname = replaceExtension(name, format, output);
		else
			var newname = output;
	}

	if (!overwrite && fs.existsSync(newname)) {
		callback(1, "file exists and cannot be overwritten");
		return;
	}

	var extAudio = false;
	if (extname === '.wav' || extname === '.mp3' || extname === '.aac')
		extAudio = true;

	/*
	 * First check the size and quality and format of the media file
	 */
	var args = ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams'];
	if (version.debug(__filename)) console.log('Convert to video ' + name + ' ' + begin + ' ' + end + ' ' + callprintout + ' ' + callback);
	callFFPROBE(args.concat([name]), function(err, data) {
		if (version.debug(__filename)) console.log('ffprobe: ' + err + ' ' + data);
		// Checks the existence of audio or video information
		if (err !== 0 || data.streams === undefined || data.streams.length<=0) {
			callback(1, data.toString());
			return;
		}
		if (version.debug(__filename)) console.log(data.format.filename + ' ' + data.streams[0].duration);
		var nVid = getStream('video', data); // get number of first video stream
		var nAud = getStream('audio', data); // get number of first audio stream
		// create a temporary filename
		var temporary = newname + '.tmp';

		// conversion of an audio file to video with subtitles
		// ffmpeg -loop 1 -i Aerial06.jpg -ss 28 -t 17 -i ESLO1_CONSCMPP_702.wav 
		// -c:v libx264 -strict experimental -c:a aac -b:a 192k -pix_fmt yuv420p -s 640x480 -aspect 16:10 -shortest 
		// -vf subtitles=/Users/cp/temp/subtitles-11533-433-u5uqz2.srt -y out5.mp4

		// normal conversion
		// ffmpeg -i filename -threads 0 -strict experimental -f format -vcodec vcodec -b:v videorate 
		// -acodec acodec -ab audiorate -ac audiochannels -s videosize

		var argsffmpeg = ['-threads', threads];
		/* sets the input information */
		// if audio input file or no video, use image
		if (nVid === -1 || extAudio === true)
				argsffmpeg.push.apply(argsffmpeg, ['-loop', 1, '-i', backgroundImage]);
		// if only part of the file.
		if (begin !== -1 && end !== -1)
				argsffmpeg.push.apply(argsffmpeg, ['-ss', begin, '-t', nend]);
		argsffmpeg.push.apply(argsffmpeg, ['-i', data.format.filename]);

		/* general format for output */
		argsffmpeg.push.apply(argsffmpeg, ['-f', format]);
		/* choose output options */
		if (nVid === -1 || extAudio === true) { // no video on input
			var audiorate = chooseAudioRate(height, data.streams[nAud].bit_rate); // '320000';
			var audiochannels = chooseChannels(height, data.streams[nAud].channels); // '320000';
			if (height)
				argsffmpeg.push.apply(argsffmpeg, ['-c:v', vcodec,
					'-c:a', acodec, '-strict', 'experimental', '-b:a', audiorate, '-ac', audiochannels, '-s', '640x480', '-aspect', '16:9']);
			else
				argsffmpeg.push.apply(argsffmpeg, ['-c:v', vcodec,
					'-c:a', acodec, '-strict', 'experimental']);
		} else if (nAud === -1) { // no audio on input
			var videorate = chooseVideoRate(height, data.format.bit_rate); // '2500k';
			var videosize = chooseSize(height, data.streams[nVid].height, data.streams[nVid].width); // '1024x720';
			var videoratio = chooseRatio(height, data.streams[nVid].display_aspect_ratio); // '1024x720';
			if (height)
				argsffmpeg.push.apply(argsffmpeg, ['-c:v', vcodec, '-b:v', videorate, '-s', videosize]);
			else
				argsffmpeg.push.apply(argsffmpeg, ['-c:v', vcodec]);
			if (videoratio)
				argsffmpeg.push.apply(argsffmpeg, ['-aspect', videoratio]);
		} else { // audio and video
			var videorate = chooseVideoRate(height, data.format.bit_rate); // '2500k';
			var videosize = chooseSize(height, data.streams[nVid].height, data.streams[nVid].width); // '1024x720';
			var videoratio = chooseRatio(height, data.streams[nVid].display_aspect_ratio); // '1024x720';
			var audiorate = chooseAudioRate(height, data.streams[nAud].bit_rate); // '320000';
			var audiochannels = chooseChannels(height, data.streams[nAud].channels); // '320000';
			if (height)
				argsffmpeg.push.apply(argsffmpeg, ['-c:v', vcodec, '-b:v', videorate, 
					'-c:a', acodec, '-strict', 'experimental', '-b:a', audiorate, '-ac', audiochannels, '-s', videosize]);
			else
				argsffmpeg.push.apply(argsffmpeg, ['-c:v', vcodec, '-c:a', acodec, '-strict', 'experimental']);
			if (videoratio)
				argsffmpeg.push.apply(argsffmpeg, ['-aspect', videoratio]);
		}

		if (subtitles) {
			if (subtitles.toLowerCase().lastIndexOf('.srt') === subtitles.length-4)
				argsffmpeg.push.apply(argsffmpeg, ['-vf', 'subtitles='+subtitles.replace(/\:/,'\\\\\\:')]);
			else
				argsffmpeg.push.apply(argsffmpeg, ['-vf', 'ass='+subtitles.replace(/\:/,'\\\\\\:')]);
			if (os.platform() === 'darwin')
				process.env['FONTCONFIG_PATH'] = '/opt/X11/lib/X11/fontconfig';
			else {
				process.env['FONTCONFIG_PATH'] = version.ffmpegdirLoc();
				process.env['FONTCONFIG_FILE'] = version.ffmpegdirLoc() + '/fonts.conf';
				process.env['FC_CONFIG_DIR'] = version.ffmpegdirLoc();
			}
		}

		if (nVid === -1 || extAudio === true)
				argsffmpeg.push.apply(argsffmpeg, ['-pix_fmt', 'yuv420p']);

		if ((begin !== -1 && end !== -1) || subtitles || nVid === -1 || extAudio === true)
				argsffmpeg.push('-shortest');

		if (overwrite) argsffmpeg.push('-y'); else argsffmpeg.push('-n');
		
		if (percent < 0) {
			callback(0,version.ffmpegLoc() + ' ' + argsffmpeg.join(' ') + ' ' + newname);
			return;
		}
		argsffmpeg.push(temporary);
		if (version.debug(__filename))
			console.log('FFMPEG arguments: ffmpeg ' + argsffmpeg.join(' '));
		else
			console.log('ffmpeg ' + argsffmpeg.join(' '));
		callFFMPEG(argsffmpeg,
			percent,
			duration,
			function(mess) { callprintout(mess, data.format.filename, newname); },
			function(err, info) {
				if (version.debug(__filename))
					console.log('END: ' + err + ' ' + info);
				if (overwrite && fs.existsSync(newname))
					fs.unlinkSync(newname);
				if (err===0)
					fs.renameSync(temporary, newname);
				else
					fs.unlinkSync(temporary);
				callback(err, (err>0)
					? ('ERROR processing ' + data.format.filename + ' (' + info.toString() + ')')
					: ('End processing ' + data.format.filename));
			}
		);
	});
};

medialibrary.convertToAudio = function(file, format, io, box, callback) {
	file = codefn.decodeFilename(file);
	io.sockets.emit(box, { start: 'conversion of ' + file + ' to ' + format });
	if (version.debug(__filename)) console.log('box: ' + box + ' ' + io.toString());
	medialibrary.processAudio(file, '+', 1, 'auto', true, format, -1, -1,
		function(mess, filein, fileout) { 
			if (version.debug(__filename)) console.log(filein + ' --> ' + fileout + ' ' + mess +'% ' + '(' + box + ')');
			io.sockets.emit(box, { processed: mess, name: fileout, box: box });
		},
		function(err, mess) {
			if (version.debug(__filename)) console.log('conversion of ' + file + ' ended ' + box);
			io.sockets.emit(box, { end: 'conversion of ' + file + ' ended' });
		}
	);
	callback(0, 'start conversion of : ' + file + ' to ' + format);
};

medialibrary.processAudio = function(name, output, percent, threads, overwrite, format, begin, end, callprintout, callback) {
	/*
	 * First check the size and quality and format of the media file
	 */
	var args = ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams'];
	callFFPROBE(args.concat([name]), function(err, data) {
		if (err === 0 && data.streams !== undefined && data.streams.length>0) {
			var nAud = getStream('audio', data); // get number of first audio stream
			if (nAud === -1) {
				callback(1, data.toString());
			} else {
				var duration = 0;
				if (begin !== -1) {
					begin = Math.floor(begin);
					var nend = Math.floor(end);
					if (nend - end > 0.001) nend++;
					duration = nend;
					nend -= begin;
					if (!output)
						var newname = changeExtension(name, begin + '-' + nend + '.' + format);
					else
						var newname = output;
				} else {			
					var nend = end;
					if (!output) // output === '' or null or undefined or 0
						var newname = changeExtension(data.format.filename, format);
					else if (output.indexOf('+') === 0)
						var newname = replaceExtension(data.format.filename, format, '');
					else
						var newname = output;
				}
				console.log("conversion audio " + name + " " + newname);
				if (!overwrite && fs.existsSync(newname)) {
					callback(1, "file exists and cannot be overwritten");
					return;
				}
				// create a temporary filename
				var temporary = newname + '.tmp';
				if (version.debug(__filename)) console.log(data.format.filename + ' ' + data.streams[0].duration);
				/*
				data.format.bit_rate
				data.streams[nAud].bit_rate
				data.streams[nAud].sample_rate
				data.streams[nAud].channels
				*/
				var audiorate = chooseAudioRate(720, data.streams[nAud].bit_rate); // '320000';
				var audiochannels = chooseChannels(720, data.streams[nAud].channels); // '320000';
				// if only part of the file.
				var argsffmpeg = ['-threads', threads]; 
				if (begin !== -1 && end !== -1)
						argsffmpeg.push.apply(argsffmpeg, ['-ss', begin, '-t', end]);
				argsffmpeg.push.apply(argsffmpeg, ['-i', name]); 
				argsffmpeg.push.apply(argsffmpeg,
					['-f', format, 
					'-b:a', audiorate, '-ac', audiochannels ]);
				if (begin !== -1 && end !== -1)
						argsffmpeg.push('-shortest');
				argsffmpeg.push('-y');
				argsffmpeg.push(temporary);
				if (version.debug(__filename)) console.log('FFMPEG arguments: ' + argsffmpeg.join(' '));
				//console.log(data.format.filename);>0
				if (percent < 0) {
					// console.log(version.ffmpegLoc() + ' ' + argsffmpeg.join(' '));
					callback(0,'End processing ' + data.format.filename);
					return;
				}
				callFFMPEG(argsffmpeg,
					percent,
					duration,
					function(mess) { callprintout(mess, data.format.filename, newname); },
					function(err, info) {
						if (overwrite && fs.existsSync(newname))
							fs.unlinkSync(newname);
						if (err===0)
							fs.renameSync(temporary, newname);
						else
							fs.unlinkSync(temporary);
						callback(err, (err>0)
							? ('ERROR processing ' + data.format.filename + ' (' + info.toString() + ')')
							: ('End processing ' + data.format.filename));
					}
				);
			}
		} else {
			callback(1, data.toString());
		}
	});
};

medialibrary.mediaConcat = function(mediaFile, output, percent, overwrite, io, box, callback) {
	var medias = getFiles(mediaFile);
	if (medias.length <= 1) {
		callback(1, medias.length>0 ? 'cannot have only than one media to concat' : 'media file not found');
		return;
	}
	if (version.debug(__filename))
		console.log('medialibrary.mediaConcat: ' + mediaFile + '  ' + output + '  ' + medias + '  ' + percent + '  ' 
			+ overwrite + '  ' + io + '  ' + box + '  ' + callback);
	if (io) {
		medialibrary.concat(medias, output, percent, overwrite,
			function(mess) {
				if (version.debug(__filename)) console.log(' --> ' + output + ' ' +  mess +'% box: ' + box);
				io.sockets.emit(box, { processed: mess, name: nname, box: box });
			},
			function(err, mess) {
				if (version.debug(__filename)) console.log('concat for ' + output + ' ended box: ' + box);
				io.sockets.emit(box, { end: 'concat for ' + output + ' ended (' + mess + ')'});
			}
		);
	} else {
		medialibrary.concat(medias, output, percent, overwrite,
			function(mess) { console.log(' --> ' + output + ' ' + mess + '%'); },
			function(err, str) { console.log('end of burn subtitles: ' + err + ' - ' + str); }
		);
	}
	callback(0, 'start concat medias : ' + medias);
};

medialibrary.concat = function(files, output, percent, overwrite, callprintout, callback) {
	if (!output) output = 'concat.mp4';
	var s = '';
	for (var i in files)
		s += "file '" + files[i] + "'\n";
	var tempfn = version.generateName('.', 'concat', '.txt');
	if (version.debug(__filename))
		console.log('ecriture de ' + tempfn);
	fs.writeFileSync( tempfn, s );
	var argsffmpeg = ['-f', 'concat', '-i', tempfn, '-c', 'copy']; 
	if (overwrite)
			argsffmpeg.push('-y');
		else
			argsffmpeg.push('-n');
	argsffmpeg.push(output);
	if (version.debug(__filename))
		console.log('FFMPEG arguments: ' + argsffmpeg.join(' '));
	callFFMPEG(argsffmpeg,
		percent,
		0,
		function(mess) { callprintout(mess); },
		function(err, info) {
			fs.unlinkSync(tempfn);
			callback(err, (err>0)
				? ('ERROR processing ' + output + ' (' + info.toString() + ')')
				: ('End processing ' + output));
		}
	);
};
