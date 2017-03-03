
function ffmpeg2theoraLoc() {
	if (filelookup.testSystem() === 'windows')
		return ffmpegdirLoc() + "/ffmpeg2theora.exe";
	else
		return ffmpegdirLoc() + "/ffmpeg2theora";
}
function soxLoc() {
	if (filelookup.testSystem() === 'windows')
		return ffmpegdirLoc() + "/sox.exe";
	else
		return ffmpegdirLoc() + "/sox";
}

/**
 * @method convert_to_html240p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
exports.convert_to_html240p = function(file, myio, box1, box2, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert html240p: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to 240p');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
//	var cmd1 = ' -i "' + fin + '" -threads auto -strict experimental -f mp4 -vcodec libx264 -b:v 500k -acodec aac -ab 192000 -ac 2 -s 320x240 -aspect 16:9 -y "' + base + '-240p.mp4"';
	var cmd1 = new Array();
	cmd1.push('-i');
	cmd1.push(fin);
	cmd1.push('-threads');
	cmd1.push('auto');
	cmd1.push('-strict');
	cmd1.push('experimental');
	cmd1.push('-f');
	cmd1.push('mp4');
	cmd1.push('-vcodec');
	cmd1.push('libx264');
	cmd1.push('-b:v');
	cmd1.push('500k');
	cmd1.push('-acodec');
	cmd1.push('aac');
	cmd1.push('-ab');
	cmd1.push('192000');
	cmd1.push('-ac');
	cmd1.push('2');
	cmd1.push('-s');
	cmd1.push('320x240');
	cmd1.push('-aspect');
	cmd1.push('16:9');
	cmd1.push('-y');
	cmd1.push(base + '-240p.mp4');
//	var cmd2 = '"' + fin + '" --videoquality 4 --audioquality 4 --frontend -A192 -V500 -y240 -o "' + base + '-240p.ogv"';
	var cmd2 = new Array();
	cmd2.push(fin);
	cmd2.push('--videoquality');
	cmd2.push('4');
	cmd2.push('--audioquality');
	cmd2.push('4');
	cmd2.push('--frontend');
	cmd2.push('-A192');
	cmd2.push('-V500');
	cmd2.push('-y240');
	cmd2.push('-o');
	cmd2.push(base + '-240p.ogv');
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
	if (version.debug(__filename)) console.log(ffmpeg2theoraLoc() + ' ' + cmd2.join(' '));
	callFFMPEG(base, basedisp, myio, 'mp4 240p', box1, cmd1);
	callTheora(base, basedisp, myio, 'ogv 240p', box2, cmd2);
	callback(0, 'conversion(s) to 240p mp4 and ogv started');
};
 */

/**
 * @method convert_to_html240p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_html240p = function(file, myio, box1, browser, callback) {
	if (browser.indexOf('Firefox')>=0 || browser.indexOf('Chrome')>=0)
		exports.convert_to_webm_240p(file, myio, box1, callback);
	else if (browser.indexOf('Opera')>=0)
		exports.convert_to_ogv_240p(file, myio, box1, callback);
	else
		exports.convert_to_mp4_240p(file, myio, box1, callback);
	callback(0, 'conversion(s) to 240p for html started');
};

/**
 * @method convert_to_mp4_240p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_mp4_240p = function(file, myio, box1, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert html mp4_240p: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to mp4 240p');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
//	var cmd1 = ' -i "' + fin + '" -threads auto -strict experimental -f mp4 -vcodec libx264 -b:v 500k -acodec aac -ab 192000 -ac 2 -s 320x240 -aspect 16:9 -y "' + base + '-240p.mp4"';
	var cmd1 = new Array();
	cmd1.push('-i');
	cmd1.push(fin);
	cmd1.push('-threads');
	cmd1.push('auto');
	cmd1.push('-strict');
	cmd1.push('experimental');
	cmd1.push('-f');
	cmd1.push('mp4');
	cmd1.push('-vcodec');
	cmd1.push('libx264');
	cmd1.push('-b:v');
	cmd1.push('500k');
	cmd1.push('-acodec');
	cmd1.push('aac');
	cmd1.push('-ab');
	cmd1.push('192000');
	cmd1.push('-ac');
	cmd1.push('2');
	cmd1.push('-s');
	cmd1.push('320x240');
//	cmd1.push('-aspect');
//	cmd1.push('16:9');
	cmd1.push('-y');
	cmd1.push(base + '-240p.mp4');
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
	callFFMPEG(base, basedisp, myio, 'mp4 240p', box1, cmd1);
	callback(0, 'conversion(s) to 240p mp4 started');
};

/**
 * @method convert_to_webm_240p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_webm_240p = function(file, myio, box, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert html webm_240p: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to webm 240p');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
	//ffmpeg -i xxx.mp4 -f webm -vcodec libvpx -acodec libvorbis -ab 160000 -crf 22 xxx.webm
	var cmd = new Array();
	cmd.push('-i');
	cmd.push(fin);
	cmd.push('-threads');
	cmd.push('auto');
	cmd.push('-f');
	cmd.push('webm');
	cmd.push('-vcodec');
	cmd.push('libvpx');
	cmd.push('-b:v');
	cmd.push('500k');
	cmd.push('-acodec');
	cmd.push('libvorbis');
	cmd.push('-ab');
	cmd.push('192000');
	cmd.push('-crf');
	cmd.push('22');	
	cmd.push('-ac');
	cmd.push('2');
	cmd.push('-s');
	cmd.push('320x240');
//	cmd.push('-aspect');
//	cmd.push('16:9');
	cmd.push('-y');
	cmd.push(base + '-240p.webm');
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd.join(' '));
	callFFMPEG(base, basedisp, myio, 'webm 240p', box, cmd);
	callback(0, 'conversion(s) to 240p webm started');
};

/**
 * @method convert_to_ogv_240p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_ogv_240p = function(file, myio, box2, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert html ogv_240p: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to ogv 240p');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
//	var cmd2 = '"' + fin + '" --videoquality 4 --audioquality 4 --frontend -A192 -V500 -y240 -o "' + base + '-240p.ogv"';
	var cmd2 = new Array();
	cmd2.push(fin);
	cmd2.push('--videoquality');
	cmd2.push('4');
	cmd2.push('--audioquality');
	cmd2.push('4');
	cmd2.push('--frontend');
	cmd2.push('-A192');
	cmd2.push('-V500');
	cmd2.push('-y240');
	cmd2.push('-o');
	cmd2.push(base + '-240p.ogv');
	if (version.debug(__filename)) console.log(ffmpeg2theoraLoc() + ' ' + cmd2.join(' '));
	callTheora(base, basedisp, myio, 'ogv 240p', box2, cmd2);
	callback(0, 'conversion(s) to 240p ogv started');
};

/**
 * @method convert_to_html480p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_html480p = function(file, myio, box1, box2, callback) {
	exports.convert_to_mp4_480p(file, myio, box1, callback);
	exports.convert_to_ogv_480p(file, myio, box2, callback);
	callback(0, 'conversion(s) to 480p mp4 and ogv started');
};

/**
 * @method convert_to_mp4_480p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_mp4_480p = function(file, myio, box1, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert mp4_480p: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to mp4 480p');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
// ffmpeg -i video.MP4 -threads 0 -strict experimental -f mp4 -vcodec libx264 -vpre slow -vpre ipod640 -b 1200k -acodec aac -ab 160000 -ac 2 -s 480x320 video.ipod.mp4
//	var cmd1 = ' -i "' + fin + '" -threads auto -strict experimental -f mp4 -vcodec libx264 -b:v 1500k -acodec aac -ab 320000 -ac 2 -s 640x480 -y "' + base + '-480p.mp4"';
	var cmd1 = new Array();
	cmd1.push('-i');
	cmd1.push(fin);
	cmd1.push('-threads');
	cmd1.push('auto');
	cmd1.push('-strict');
	cmd1.push('experimental');
	cmd1.push('-f');
	cmd1.push('mp4');
	cmd1.push('-vcodec');
	cmd1.push('libx264');
	cmd1.push('-b:v');
	cmd1.push('1500k');
	cmd1.push('-acodec');
	cmd1.push('aac');
	cmd1.push('-ab');
	cmd1.push('320000');
	cmd1.push('-ac');
	cmd1.push('2');
	cmd1.push('-s');
	cmd1.push('640x480');
	cmd1.push('-aspect');
	cmd1.push('16:9');
	cmd1.push('-y');
	cmd1.push(base + '-480p.mp4');
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
	callFFMPEG(base, basedisp, myio, 'mp4 480p', box1, cmd1);
	callback(0, 'conversion(s) to 480p mp4 started');
};

/**
 * @method convert_to_webm_480p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_webm_480p = function(file, myio, box1, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert webm_480p: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to webm 480p');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
	//ffmpeg -i xxx.mp4 -f webm -vcodec libvpx -acodec -b:v 1500k libvorbis -ab 320000 -crf 22 xxx.webm
//	var cmd1 = ' -i "' + fin + '" -threads auto -strict experimental -f mp4 -vcodec libx264 -b:v 1500k -acodec aac -ab 320000 -ac 2 -s 640x480 -y "' + base + '-480p.mp4"';
	var cmd1 = new Array();
	cmd1.push('-i');
	cmd1.push(fin);
	cmd1.push('-strict');
	cmd1.push('experimental');
	cmd1.push('-f');
	cmd1.push('mp4');
	cmd1.push('-vcodec');
	cmd1.push('libvpx');
	cmd1.push('-b:v');
	cmd1.push('1500k');
	cmd1.push('-acodec');
	cmd1.push('libvorbis');
	cmd1.push('-ab');
	cmd1.push('320000');
	cmd1.push('-crf');
	cmd1.push('22');
	cmd1.push('-ac');
	cmd1.push('2');
	cmd1.push('-s');
	cmd1.push('640x480');
	cmd1.push('-aspect');
	cmd1.push('16:9');
	cmd1.push('-y');
	cmd1.push(base + '-480p.webm');
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
	callFFMPEG(base, basedisp, myio, 'webm 480p', box1, cmd1);
	callback(0, 'conversion(s) to 480p webm started');
};

/**
 * @method convert_to_ogv_480p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_ogv_480p = function(file, myio, box2, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert ogv_480p: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to ogv_480p');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
//	var cmd2 = '"' + fin + '" --videoquality 6 --audioquality 8 --frontend -A256 -V1500 -y480 -o "' + base + '-480p.ogv"';
	var cmd2 = new Array();
	cmd2.push(fin);
	cmd2.push('--videoquality');
	cmd2.push('6');
	cmd2.push('--audioquality');
	cmd2.push('8');
	cmd2.push('--frontend');
	cmd2.push('-A256');
	cmd2.push('-V1500');
	cmd2.push('-y480');
	cmd2.push('-o');
	cmd2.push(base + '-480p.ogv');
	if (version.debug(__filename)) console.log(ffmpeg2theoraLoc() + ' ' + cmd2.join(' '));
	callTheora(base, basedisp, myio, 'ogv 480p', box2, cmd2);
	callback(0, 'conversion(s) to 480p ogv started');
};

/**
 * @method convert_to_mp4
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_mp4 = function(file, myio, box1, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert mp4: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to mp4');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
//	var cmd1 = ' -i "' + fin + '" -threads auto -strict experimental -f mp4 -vcodec libx264 -b:v 2500k -acodec aac -ab 320000 -ac 2 -s 1024x720 -y "' + base + '.mp4"';
	var cmd1 = new Array();
	cmd1.push('-i');
	cmd1.push(fin);
	cmd1.push('-threads');
	cmd1.push('auto');
	cmd1.push('-strict');
	cmd1.push('experimental');
	cmd1.push('-f');
	cmd1.push('mp4');
	cmd1.push('-vcodec');
	cmd1.push('libx264');
	cmd1.push('-b:v');
	cmd1.push('2500k');
	cmd1.push('-acodec');
	cmd1.push('aac');
	cmd1.push('-ab');
	cmd1.push('320000');
	cmd1.push('-ac');
	cmd1.push('2');
	cmd1.push('-s');
	cmd1.push('1024x720');
	cmd1.push('-aspect');
	cmd1.push('16:9');
	cmd1.push('-y');
	cmd1.push(base + '.mp4');
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
	callFFMPEG(base, basedisp, myio, 'mp4', box1, cmd1);
	callback(0, 'conversion(s) to mp4 started');
};

/**
 * @method convert_to_mpeg
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_mpeg = function(file, myio, box1, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert mpeg: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to mpeg');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
//	var cmd1 = ' -i "' + fin + '" -threads auto -f mpegts -b:v 1500k -ab 192000 -ac 1 -s 720x480 -y "' + base + '.mpeg"';
	var cmd1 = new Array();
	cmd1.push('-i');
	cmd1.push(fin);
	cmd1.push('-threads');
	cmd1.push('auto');
	cmd1.push('-f');
	cmd1.push('mpegts');
	cmd1.push('-b:v');
	cmd1.push('1500k');
	cmd1.push('-ab');
	cmd1.push('192000');
	cmd1.push('-ac');
	cmd1.push('1');
	cmd1.push('-s');
	cmd1.push('720x480');
	cmd1.push('-aspect');
	cmd1.push('16:9');
	cmd1.push('-y');
	cmd1.push(base + '.mpeg');
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
	callFFMPEG(base, basedisp, myio, 'mpeg', box1, cmd1);
	callback(0, 'conversion(s) to mpeg started');
};

/**
 * @method convert_to_mov
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_mov = function(file, myio, box1, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert mov: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to mov');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
//	var cmd1 = ' -i "' + fin + '" -threads auto -strict experimental -f mov -b:v 2500k -ab 320000 -ac 2 -y "' + base + '.mov"';
	var cmd1 = new Array();
	cmd1.push('-i');
	cmd1.push(fin);
	cmd1.push('-threads');
	cmd1.push('auto');
	cmd1.push('-strict');
	cmd1.push('experimental');
	cmd1.push('-f');
	cmd1.push('mov');
	cmd1.push('-b:v');
	cmd1.push('2500k');
	cmd1.push('-ac');
	cmd1.push('2');
	cmd1.push('-ab');
	cmd1.push('320000');
	cmd1.push('-y');
	cmd1.push(base + '.mov');
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
	callFFMPEG(base, basedisp, myio, 'mov', box1, cmd1);
	callback(0, 'conversion(s) to mov started');
};

/**
 * @method convert_to_mov480p
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_mov480p = function(file, myio, box1, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert 480p mov: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to 480p mov');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
	var cmd1 = new Array();
	cmd1.push('-i');
	cmd1.push(fin);
	cmd1.push('-threads');
	cmd1.push('auto');
	cmd1.push('-strict');
	cmd1.push('experimental');
	cmd1.push('-f');
	cmd1.push('mov');
	cmd1.push('-b:v');
	cmd1.push('1500k');
	cmd1.push('-ac');
	cmd1.push('2');
	cmd1.push('-s');
	cmd1.push('640x480');
	cmd1.push('-aspect');
	cmd1.push('16:9');
	cmd1.push('-y');
	cmd1.push(base + '-480p.mov');
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
	callFFMPEG(base, basedisp, myio, 'mov 480p', box1, cmd1);
	callback(0, 'conversion(s) to -480p.mov started');
};

/**
 * @method convert_to_ogv
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_ogv = function(file, myio, box1, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert ogv: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to ogv');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );
//	var cmd2 = '"' + fin + '" --videoquality 8 --audioquality 10 --frontend -A320 -V2500 -y720 -o "' + base + '.ogv"';
	var cmd2 = new Array();
	cmd2.push(fin);
	cmd2.push('--videoquality');
	cmd2.push('8');
	cmd2.push('--audioquality');
	cmd2.push('10');
	cmd2.push('--frontend');
	cmd2.push('-A320');
	cmd2.push('-V2500');
	cmd2.push('-y720');
	cmd2.push('-o');
	cmd2.push(base + '.ogv');
	if (version.debug(__filename)) console.log(ffmpeg2theoraLoc() + ' ' + cmd2.join(' '));
	callTheora(base, basedisp, myio, 'ogv', box1, cmd2);
	callback(0, 'conversion(s) to ogv started');
};

/**
 * @method convert_to_htmlaudio
 * @param {string} input filename
 * @param {object} socket
 * @param {function} callback
 */
exports.convert_to_htmlaudio = function(file, myio, box1, box2, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("convert html audio: " + file);
	try {
		var fin = fs.realpathSync(file);
	} catch (error) {
		console.log('Error on the conversion of ' + file + ' to html audio');
		return;
	}

	var ext = path.extname(fin);
	var basedisp = path.basename(fin, ext);
	var base = path.join( path.dirname(fin), basedisp );

	var cmd1 = new Array();
	cmd1.push('-i');
	cmd1.push(fin);
	cmd1.push('-threads');
	cmd1.push('auto');
	cmd1.push('-f');
	cmd1.push('wav');
	cmd1.push('-ar');
	cmd1.push('44100');
	cmd1.push('-ac');
	cmd1.push('2');
	cmd1.push('-y');
	cmd1.push(base + '.wav');

	var cmd2 = new Array();
	cmd2.push('-i');
	cmd2.push(fin);
	cmd2.push('-threads');
	cmd2.push('auto');
	cmd2.push('-f');
	cmd2.push('mp3');
	cmd2.push('-ac');
	cmd2.push('2');
	cmd2.push('-ab');
	cmd2.push('192000');
	cmd2.push('-y');
	cmd2.push(base + '.mp3');
	
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd1.join(' '));
	if (version.debug(__filename)) console.log(ffmpegLoc() + ' ' + cmd2.join(' '));
	callFFMPEG(base, basedisp, myio, 'wav', box1, cmd1);
	callFFMPEG(base, basedisp, myio, 'mp3', box2, cmd2);
	callback(0, 'conversion(s) to html audio started');
};

function callFFMPEG(base, basedisp, myio, type, box, cmdlist1) {
	// executes cmdlist1
	var duration = 0;
	var pcBeforeFFmpeg = 0;
	try {
		var ffmpeg = childproc.spawn(ffmpegLoc(), cmdlist1);
	} catch(e) {
		myio.sockets.emit(box, { end: 'conversion of ' + basedisp + ' to ' + type + ' : error with code ' + e.toString() });
		return;
	}
	var mp4started = false;
	ffmpeg.stdout.on('data', function (data) {
		if (version.debug(__filename)) console.log('FFMPEG out: ' + data);
	});
	ffmpeg.stderr.on('data', function (data) {
		if (mp4started === false) {
			myio.sockets.emit(box, { start: 'conversion of ' + basedisp + ' to ' + type });
			if (version.debug(__filename)) console.log('box[' + box + '] conversion of ' + basedisp + ' to ' + type + ' started');
			mp4started = true;
			myio.sockets.emit(box, { processed: 0.0, name: basedisp + type, box: box });
		}
		// find   Duration: 00:32:23.88, start: 0.000000, bitrate: 1353 kb/s
		// find   time=00:00:48.83 
		// and to the math
		if (version.debug(__filename)) console.log('FFMPEG err: ' + data);
		var str = String(data);
		if (duration === 0) {
			var p = str.indexOf('Duration:');
			if ( p !== -1) {
				var s = str.substr(p+10);
				duration = (s.substr(0,2) * 3600 + s.substr(3,2) * 60 + s.substr(6,2)) * 1.06;
			}
		} else {
			var p = str.indexOf('time=');
			if ( p !== -1) {
				var s = str.substr(p+5);
				var timecur = s.substr(0,2) * 3600 + s.substr(3,2) * 60 + s.substr(6,2);
				var pc = Math.round((timecur/duration)*100);
				if (pc > pcBeforeFFmpeg) {
					pcBeforeFFmpeg = pc;
					myio.sockets.emit(box, { processed: pc, name: basedisp + type, box: box });
					if (version.debug(__filename)) console.log('box{' + box + '} FFMPEG: ' + duration + ' ' + timecur + ' ' + pc + '%');
				}
			}
		}
	});
	ffmpeg.on('close', function (code) {
		if (version.debug(__filename)) console.log('box(' + box + ') FFMPEG process exited with code ' + code);
		if (code === 0)
			myio.sockets.emit(box, { end: 'conversion of ' + basedisp + ' to ' + type + ' ended' });
		else
			myio.sockets.emit(box, { end: 'conversion of ' + basedisp + ' to ' + type + ' : error with code ' + code });
	});
}

function callTheora(base, basedisp, myio, type, box, cmdlist2) {
	var ogvstarted = false;
	var pcBeforeTheora = 0;
	var ffmpeg2theora = childproc.spawn(ffmpeg2theoraLoc(), cmdlist2);
	ffmpeg2theora.stdout.on('data', function (data) {
		if (ogvstarted == false) {
			myio.sockets.emit(box, { start: 'conversion of ' + basedisp + ' to ' + type });
			if (version.debug(__filename)) console.log('conversion of ' + basedisp + ' to ' + type + ' started');
			ogvstarted = true;
		}
		// find "duration": 1943.880000, "position": 1.48
		// and do the math
		//console.log('ffmpeg2theora out: ' + data);
		var str = String(data);
		var p = str.indexOf('duration');
		if (p !== -1) {
			var s = str.substr(p);
			var dur = s.match(/\d+\.\d+/);
			p = str.indexOf('position');
			var s = str.substr(p);
			var pos = s.match(/\d+\.\d+/);
			var pc = Math.round((pos/dur)*100);
				if (pc > pcBeforeTheora) {
					pcBeforeTheora = pc;
					myio.sockets.emit(box, { processed: pc, name: basedisp + 'to' + type, box: box });
					if (version.debug(__filename)) console.log('theora: ' + dur + ' ' + pos + ' ' + pc + '%');
				}
		}
	});
	ffmpeg2theora.stderr.on('data', function (data) {
		//console.log('ffmpeg2theora err: ' + data);
	});
	ffmpeg2theora.on('close', function (code) {
		if (version.debug(__filename)) console.log('ffmpeg2theora process exited with code ' + code);
		if (code == 0)
			myio.sockets.emit(box, { end: 'conversion of ' + basedisp + ' to ' + type + ' ended' });
		else
			myio.sockets.emit(box, { end: 'conversion of ' + basedisp + ' to ' + type + ' : error with code ' + code });
	});
}
