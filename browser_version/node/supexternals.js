
function garbageLoc() { return process.cwd() + "/__garbage"; }

/**
 * @method move_to_garbage
 * @param {string} input filename
 * @param {object} socket.io
 */
exports.move_to_garbage = function(files, myio, callback) {
	//console.log('files=' + files.length);
	//console.log('files=' + files);
	if (files == undefined) {
		console.log('error the call to move ' + files + ' to garbage');
		callback(1, 'error the call to move ' + files + ' to garbage');
		return;
	}
	for (var i=0; i < files.length; i++) {
		files[i] = codefn.decodeFilename(files[i]);
		var fn = '';
		try {
			var fn = fs.realpathSync(files[i]);
		} catch (error) {
			callback(1, 'error (realpathSync) on the move ' + files[i] + ' to garbage');
			return;
		}
	 	if ( !fs.existsSync(garbageLoc()) ) fs.mkdir(garbageLoc());
		
		var ext = path.extname(fn);
		var newfn = garbageLoc() + '/' + path.basename(fn, ext);
		if (fs.existsSync(newfn + ext)) {
			var i = 0;
			do {
				i++;
				nm = newfn + "(" + i + ")" + ext;
			} while ( fs.existsSync( nm ) );
		} else {
			nm = newfn + ext;
		}
		
		try {
			console.log( "moved " + fn + " to " + nm);
			fs.renameSync(fn, nm);
			//callback(0, 'moved ' + fn + ' to garbage');
			myio.sockets.emit('delete', { msg: 'moved ' + fn + ' to garbage' });
		} catch (error) {
			callback(1, 'error (renameSync) on the move ' + fn + ' to garbage');
			return;
		}
	}
};

/**
 * @method remove_garbage
 * @param {object} socket.io
 */
exports.remove_garbage = function(myio, callback) {
	try {
		var contents = fs.readdirSync(garbageLoc());
		contents.forEach( function(f) {
			//console.log('remove ' + f + ' == ' + path.join(garbageLoc(), f));
			fs.unlinkSync( path.join(garbageLoc(), f) );
		});
		myio.sockets.emit('delete', { msg: 'all garbage files deleted' });
	} catch (error) {
		callback(1, 'error cannot clean garbage box');
		return;
	}
};

exports.save_transcript_temporary = function(transcript, callback) {
	var dirpath = filelookup.getUserHome() + '/temp';
	//console.log('test de ' + dirpath);
	if (! fs.existsSync(dirpath)) fs.mkdir(dirpath);
	try {
		var tempfn = dirpath + '/temporary.teiml';
		//console.log('ecriture de ' + tempfn);
		fs.writeFileSync( tempfn, transcript );
		callback(0, "saved to " + tempfn);
	} catch (error) {
		// Path does not exist, it is ok
		callback(1, 'error: cannot save temporary file ' + tempfn);
		return;
	}
};

exports.erase_dir = function(dir, callback) {
	try {
		//console.log('suppression de ' + dir);
		fs.rmdirSync( dir );
	} catch (error) {
		// Path does not exist, it is ok
		callback(1, 'error: cannot erase folder ' + dir);
		return;
	}
};

exports.rename_temporary_as = function(dir, file, callback) {
	try {
		var dirpath = filelookup.getUserHome() + '/temp';
		var tempfn = dirpath + '/temporary.teiml';
		
		var dest = dir + '/' + file;
		
		//console.log('rename de ' + tempfn + ' vers ' + dest);
		if ( fs.existsSync( dest ) ) {
			var destbck = dest + '.back';
			if ( fs.existsSync(destbck) )
				fs.unlinkSync(destbck);
			fs.renameSync(dest, destbck);
		}
		fs.renameSync( tempfn, dest );
		callback(0, "saved to " + tempfn);
	} catch (error) {
		// Path does not exist, it is ok
		callback(1, 'error: cannot save temporary file ' + tempfn);
		return;
	}
};

exports.move_recording = function(from, toname, toloc, callback) {
	if (version.debug(__filename)) console.log('move file: ' + from + ' to ' + toname + ' at ' + (toloc ? toloc : "same place"));
	from = codefn.decodeFilename(from);
	if (version.debug(__filename)) console.log('move file (decoded): ' + from);
/*	try {
		var ffrom = fs.realpathSync(from);
	} catch (error) {
		callback(1, ':error: (realpathSync) on moving ' + from);
		return;
	}
*/	if (toloc) {
		toloc = codefn.decodeFilename(toloc);
		var fto = toloc + '/' + toname;
	} else
		var fto = path.dirname(from) + '/' + toname;
	if (version.debug(__filename)) console.log('move file: [' + from + '] [' + fto + ']');
	try {
		fs.renameSync(from, fto);
		callback(0, codefn.encodeFilename(fto));
	} catch (error) {
		callback(1, ':error: cannot rename ' + from + ' to ' + fto);
	}
};

/**
 * @method convert_to_shortaudio
 * @param {string} input filename
 * @param {function} callback
 */
exports.convert_to_shortaudio = function(file, callback) {
	file = codefn.decodeFilename(file);
//	if (version.debug(__filename))
		console.log("convert wave short file audio: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
//		if (version.debug(__filename)) 
			console.log('Error on the conversion of ' + file + ' to wave short file audio :' + error.toString());
		callback(1, 'Error on the conversion of ' + file + ' to wave short file audio :' + error.toString());
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );

 	// the wave version that uses the sox tools is much slower than the raw version of ffmpeg
 	// also sox cannot work with files other than wave files
	var wavVersion = false;
	if (wavVersion) {
		var audioname = base + filelookup.shortAudioRaw;
		if (fs.existsSync(audioname)) {
//			if (version.debug(__filename))
				console.log('short wave exists : ' + audioname);
			callback(0, codefn.encodeFilename(audioname));  // 'conversion to wave short file audio not needed'
			return;		
		}
		// sox-14.4.1/sox ESLO1_ENT_005.wav -r "version.WAVESAMPLING" -c 1 ESLO1_ENT_005-shortaudiotrjs.wav
		var cmd1 = new Array();
		cmd1.push(fin);
		cmd1.push('-r');
		cmd1.push(version.WAVESAMPLING);
		cmd1.push('-c');
		cmd1.push('1');
		cmd1.push(audioname);
	
		if (version.debug(__filename)) console.log(soxLoc() + ' ' + cmd1.join(' '));
		//callFFMPEG(base, basedisp, myio, '-shortdisplay.wav', box, cmd1);
		var sox = childproc.spawn(soxLoc(), cmd1);
		sox.stdout.on('data', function (data) {
			if (version.debug(__filename)) console.log('short wave: sox stdout: ' + data);
		});
		sox.stderr.on('data', function (data) {
			if (version.debug(__filename)) console.log('short wave: sox stderr: ' + data);
		});
		sox.on('close', function (code) {
//			if (version.debug(__filename))
				console.log('short wave: SOX process exited with code ' + code);
			callback(code, codefn.encodeFilename(audioname)); // 'conversion to wave short file audio ended');
		});
	} else

	{ // rawVersion
		var audioname = base + filelookup.shortAudioRaw;
		if (fs.existsSync(audioname)) {
//			if (version.debug(__filename))
				console.log('short wave exists : ' + audioname);
			callback(0, codefn.encodeFilename(audioname));  // 'conversion to raw file audio not needed'
			return;		
		}
		// ffmpeg -i ESLO1_ENT_005.wav -f u16le -ar "version.WAVESAMPLING" -ac 1 ESLO1_ENT_005-shortaudiotrjs.raw
		var cmd1 = new Array();
		cmd1.push('-i');
		cmd1.push(fin);
		cmd1.push('-f');
		cmd1.push('s16le');
		cmd1.push('-ar');
		cmd1.push(version.WAVESAMPLING);
		cmd1.push('-ac');
		cmd1.push('1');
		cmd1.push(audioname);
	
		if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
		//callFFMPEG(base, basedisp, myio, '-shortdisplay.wav', box, cmd1);
		var ffmpeg = childproc.spawn(ffmpegLoc(), cmd1);
		ffmpeg.stdout.on('data', function (data) {
			if (version.debug(__filename)) console.log('short wave: ffmpeg stdout: ' + data);
		});
		ffmpeg.stderr.on('data', function (data) {
			if (version.debug(__filename)) console.log('short wave: ffmpeg stderr: ' + data);
		});
		ffmpeg.on('close', function (code) {
//			if (version.debug(__filename))
				console.log('short wave: FFMPEG process exited with code ' + code);
			callback(code, codefn.encodeFilename(audioname)); // 'conversion to wave short file audio ended');
		});
	}
};
