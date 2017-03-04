/**
 * command line tools to convert audio and video files
 * @author Christophe Parisse
 * @date december 2014
 */

/*
if (process.env.TRJSPATH !== undefined)
	process.chdir(process.env.TRJSPATH);
else
	process.chdir('/media/devtranscriberjs');
*/

var version = require('../editor/version.js');
var medialib = require('./medialibrary.js');
global.applicationTarget = {};
global.applicationTarget.type = 'nodejs';

var usage = function (argument) {
	console.log('Process video and audio files ' + version.versionMediaTools);
	console.log('');
	console.log('Usage: mediatools -f format [-i] filename ...');
	console.log('    -f {format} (length subt split mp4 webm ogv mpeg1 concat)');
	console.log('    -v {vertical/height of image} (240 480 720 1080)');
	console.log('    -z {extension} (filter filenames)');
	console.log('    -s {subtitle filename}');
	console.log('    -a {ass subtitle filename}');
	console.log('    -b {start time}');
	console.log('    -e {end time}');
	console.log('    -d {percent tick} (for display - 0 for none)');
	console.log('    -p {number of concurrent processes} (default 2)');
	console.log('    -t {number of concurrent threads} (default 2)');
	console.log('    -o {destination file}');
	console.log('    -x (destination extension automatic)');
	console.log('    -y (overwrite destination files)');
	console.log('    --debug [filename]');
	console.log('    -h --help --usage (this message)');
};

/**
 * main procedure
 */

function main() {
	var argv = require('minimist')(process.argv.slice(2));
	
	if (argv.debug===true) version.setDebug('__all__', true);
	if (typeof argv.debug==='string') version.setDebug(argv.debug, true);
	if (typeof argv.debug==='object') 
		for (var i in argv.debug)
			version.setDebug(argv.debug[i], true);
	
	if (version.debug(__filename)) console.log(argv);
	
	if (argv.h !== undefined || argv.help === true || argv.usage === true) {
		usage();
		process.exit(1);
	}
	
	if (argv.i !== undefined && argv.i.length > 0) {
	    if (argv._.length === 0)
		argv._ = argv.i
            else
                argv._.concat(argv.i);
        }
	if (argv._.length < 1) {
		console.log('at least one input file must be defined');
		process.exit();
	}

	if (argv.f === undefined) {
		console.log('one format must be defined: length subt split mp4 webm ogv mpeg1');
		process.exit();
	} else if (typeof argv.f === 'string')
		var format = argv.f;
	else {
		console.log('only one option for format');
		process.exit();
	}
	
	if (argv.y === undefined)
		var overwrite = false;
	else {
		var overwrite = true;
	}
	
	if (argv.x === undefined)
		var extauto = false;
	else {
		var extauto = true;
	}
	
	if (argv.o === undefined)
		var output = undefined;
	else if (typeof argv.o === 'string')
		var output = argv.o;
	else {
		console.log('only one option for output');
		process.exit();
	}
	
	if (argv.v === undefined)
		var height = 0;
	else if (typeof argv.v === 'string')
		var height = argv.v;
	else if (typeof argv.v === 'number')
		var height = parseInt(argv.v);
	else {
		console.log('only one option for height');
		process.exit();
	}
	
	if (argv.p === undefined)
		var maxstart = 2;
	else if (typeof argv.p === 'string')
		var maxstart = parseInt(argv.p);
	else if (typeof argv.p === 'number')
		var maxstart = parseInt(argv.p);
	else {
		console.log('only one option for process');
		process.exit();
	}
	
	if (argv.t === undefined)
		var threads = 2;
	else if (typeof argv.t === 'string') {
		var threads = 0;
		if (argv.t !== 'auto') {
			console.log('bad option for thread: number or option:' + argv.t);
			process.exit();
		}
	} else if (typeof argv.t === 'number')
		var threads = parseInt(argv.t);
	else {
		console.log('only one option for thread');
		process.exit();
	}
	
	if (argv.s === undefined)
		var subtFile = undefined;
	else if (typeof argv.s === 'string')
		var subtFile = argv.s;
	else {
		console.log('only one option for subtitle filename');
		process.exit();
	}
	
	if (argv.a === undefined)
		var subtFile = undefined;
	else if (typeof argv.a === 'string')
		var subtFile = argv.a;
	else {
		console.log('only one option for subtitle filename');
		process.exit();
	}
	
	if (argv.b === undefined)
		var begin = -1;
	else if (typeof argv.b === 'number')
		var begin = argv.b;
	else {
		console.log('only one option for start');
		process.exit();
	}
	
	if (argv.e === undefined)
		var end = -1;
	else if (typeof argv.e === 'number')
		var end = argv.e;
	else {
		console.log('only one option for end');
		process.exit();
	}
	
	if (argv.d === undefined)
		var percent = 10;
	else if (typeof argv.d === 'string') {
		if (argv.d === 'display')
			var percent = -10;
		else
			var percent = parseInt(argv.d);
	}
	else if (typeof argv.d === 'number')
		var percent = parseInt(argv.d);
	else {
		console.log('only one option for percent');
		process.exit();
	}
	
	if (argv.z === undefined)
		var ext = undefined;
	else if (typeof argv.z === 'string')
		var ext = argv.z;
	else
		var ext = '(' + argv.z.join('|') + ')';
	
	if (extauto && output) {
		console.log('Choisir entre option output et extension automatique');
		process.exit();
	}
	
	if (extauto) {
		if (format.indexOf('mp3') === 0)
			output = '';
		else if (format.indexOf('wav') === 0)
			output = '';
		else if (height === 240)
			output = '+240p';
		else if (height === 480)
			output = '+480p';
		else if (height === 576)
			output = '+576p';
		else if (height === 720)
			output = '+720p';
		else if (height === 1080)
			output = '+1080p';
		else if (height === 2160)
			output = '+4K';
		else if (typeof height === 'string' && height.toUpperCase() === '4K')
			output = '+4K';
		else if (typeof height === 'string' && height.toUpperCase() === 'MASTER')
			output = '+master';
	}
	if (typeof height === 'string' && height.toUpperCase() === '4K')
		height = 2160;
	if (typeof height === 'string' && height.toUpperCase() === 'MASTER')
		height = 4320;
	
	if (format.indexOf('length') === 0) {
		medialib.getMediaLength(argv._, ext, function(data) {
			// console.log(JSON.stringify(data));
			for (i in data.values)
				console.log(data.values[i].name + ' ' + data.values[i].length);
			console.log(data.total);
		});
	} else if (format.indexOf('concat') === 0) {
		if (output == undefined) {
			console.log('Output must be defined for concat');
			return;
		}
		medialib.mediaConcat(argv._, output, percent, overwrite, null, null, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log(data);
		});
	} else if (format.indexOf('split') === 0) {
		medialib.mediaExtract(argv._, output, percent, overwrite, begin, end, null, null, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log(data);
		});
	} else if (format.indexOf('subt') === 0) {
		if (!subtFile) {
			console.log('the subtitle file is missing');
			process.exit();
		}
		if (subtFile.toLowerCase().lastIndexOf('.srt') !== subtFile.length-4 && subtFile.toLowerCase().lastIndexOf('.ass') !== subtFile.length-4) {
			console.log('subt option expects SRT format');
			process.exit();
		}
		medialib.burnSubtitles(argv._[0], output, [subtFile], percent, overwrite, begin, end, null, null, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log('error: ' + data);
		});
	} else if (format.indexOf('ass') === 0) {
		if (!subtFile) {
			console.log('the subtitle file is missing');
			process.exit();
		}
		if (subtFile.toLowerCase().lastIndexOf('.ass') !== subtFile.length-4) {
			console.log('subt option expects ASS format');
			process.exit();
		}
		medialib.burnSubtitles(argv._, output, [subtFile], percent, overwrite, begin, end, null, null, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log('error: ' + data);
		});
	} else if (format.indexOf('mp4') === 0) {
		medialib.batchConvert(argv._, ext, output, percent, maxstart, threads, overwrite, 'mp4', 'libx264', 'aac', height, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log('error: ' + data);
		});
	} else if (format.indexOf('ogv') === 0 || format.indexOf('ogg') === 0) {
		medialib.batchConvert(argv._, ext, output, percent, maxstart, threads, overwrite, 'ogg', 'theora', 'libvorbis', height, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log('error: ' + data);
		});
	} else if (format.indexOf('webm') === 0) {
		medialib.batchConvert(argv._, ext, output, percent, maxstart, threads, overwrite, 'webm', 'libvpx', 'libvorbis', height, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log('error: ' + data);
		});
	} else if (format.indexOf('mp3') === 0) {
		medialib.batchConvert(argv._, ext, output, percent, maxstart, threads, overwrite, 'mp3', null, null, null, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log('error: ' + data);
		});
	} else if (format.indexOf('wav') === 0) {
		medialib.batchConvert(argv._, ext, output, percent, maxstart, threads, overwrite, 'wav', null, null, null, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log('error: ' + data);
		});
	} else if (format.indexOf('mpeg1') === 0) {
		medialib.batchConvert(argv._, ext, output, percent, maxstart, threads, overwrite, 'mpeg', 'mpeg1video', 'mp2', height, function(data) {
			// console.log(JSON.stringify(data));
			if (data != 0) console.log('error: ' + data);
		});
	} else {
		console.log('unknown format: ' + format);
	}
}

// run it

main();
