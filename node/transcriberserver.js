/**
 * transcriberserver.js
 * 
 * Processing Requests for Node.js
 * @author Christophe Parisse
 * @date 22/09/2013
 */

/*
 * load the various external libraries
 */
global.applicationTarget = { type: 'html+nodejs', server: 'nodejs', location: 'local' };

var http = require('http'),
    url = require('url'),
	sys = require("sys"),  
	childproc = require('child_process'),
    path = require("path"),
    mime = require("mime"),
    filesys = require("fs"),
    qs = require('querystring');

/*
 * load the various other files
 */
var	version = require('../editor/version.js');
var codefn = require('../editor/codefn.js');
var ext = require('./external.js');
var medialibrary = require('./medialibrary.js');
var filelookup = require('./filelookup.js');
// var update = require('./update.js');

version.setNodeJs();
filelookup.init('/');
  
var styleFiles = '';

var argv = require('minimist')(process.argv.slice(2));

var usage = function (argument) {
	console.log('transcriberserver.js ' + version.version);
	console.log('');
	console.log('Usage: node transcriberserver.js --help --nohtml --html file --debug');
	console.log('    --help : this message');
	console.log('    --nohtml : the transcriberjs.html page is not loaded in the webbrowser');
	console.log('    --html file : the html page given as argument is loaded in the webbrowser');
	console.log('    --debug : all debug information is displayed');
	console.log('    --debug file : debug for the file given as argument in displayed');
	process.exit(1);
};

if (argv.help===true) usage();
if (argv.debug===true) version.setDebug('__all__', true);
if (typeof argv.debug==='string') version.setDebug(argv.debug, true);
if (typeof argv.debug==='object') 
	for (var i in argv.debug)
		version.setDebug(argv.debug[i], true);

/*
 * creates the server for the application
 */
var server = http.createServer( function(req, res) { // Handle headers
    if (req.headers.dnt == 1) {
        if (version.debug(__filename)) console.log('Do Not Track');
    }
    // What type of request is this
	if (version.debug(__filename)) console.log('Request Url: ' + req.url);
    // Parse the URL
    var url_parsed = url.parse(req.url, true);
    // What type of request is this
	if (version.debug(__filename)) (url_parsed.toString());
    if (req.method === 'GET') {
        handleGetRequest(req, res, url_parsed);
        // load_file(url_parsed.pathname, req, res); // here all the gets are interpreted as change URL
    } else if (req.method === 'POST') {
        handlePostRequest(req, res, url_parsed);
    } else {
	    if (version.debug(__filename)) {
		    console.log("method not supported" + req.method);
			console.log(url_parsed.pathname);
	    }	    
        res.end('Method not supported');
    }
});

var startHtml = function(fn) {
		console.log('start ' + fn);
		if (filelookup.testSystem() == 'windows')
		    var childHtml = childproc.spawn('cmd', ['/c', 'start', 'http://localhost:8101/' + fn]);
		else
			var childHtml = childproc.spawn('open', ['http://localhost:8101/' + fn]);
};

var startHtmls = function() {
	if (argv.html === undefined || argv.html === true)
		startHtml('transcriberjs.html');
	if (typeof argv.html === 'string')
		startHtml(argv.html);
	if (typeof argv.html === 'object')
		for (var i in argv.html)
			startHtml(argv.html[i]);
};

/*
 * checks if port already buzy
 * or deals with errors
 */
server.once('error', function(err) {
	if (err.code == 'EADDRINUSE' && version.serverType == 'local') {
		// port is currently in use
		console.log('version ' + version.version + ' server started : closing!');
		console.log('version ' + version.version + ' start html!');
		// console.log('system is : ' + filelookup.testSystem());
		startHtmls();
		process.exit(1);
	}
});

var startedHtml = false;
/*
 * checks if port already buzy
 */
server.on('listening', function(err) {
	console.log('listening !');
	if (startedHtml == false && version.location === 'local' && !argv.nohtml) {
		// html not started
		console.log('version ' + version.version + ' start html!');
		startHtmls();
	}
});

/*
 * starts listening for http
 */

var trjsLoc = version.trjsLoc();
console.log('version ' + version.version + ' started in : ' + process.cwd() + ' trjsLoc= ' + trjsLoc);
process.chdir(trjsLoc);
console.log('now in ' + process.cwd());

server.listen(version.HTTP_PORT);

/*
 * starts listen for sockets
 */
var io = require('socket.io').listen(server);

/*
 * be ready to emit (and receive even if receive is not used much in this application)
 */
io.sockets.on('connection', function (socket) {
	/*
	 * receiving can be used to stop or control processes (not used yet)
	 */
	socket.on('trjsclient', function(data) {
		/*
		 * print info for control: not used otherwise
		 */
		if (version.debug(__filename)) console.log('receive for client socket ' + data);
	}); 
});

function call_create_dir(json, callback) {
	return ext.create_dir(json['dir'], json['file'], callback);
}

function call_save_transcript(json, callback) {
	return ext.save_transcript(json['file'], json['nbsave'], json['transcript'], callback);		
}

function call_tei_to_format(json, callback) {
	return ext.tei_to_format(json['format'], json['transcript'], json['output'], callback);		
}

function call_format_to_tei(json, callback) {
	return ext.format_to_tei(json['format'], json['file'], json['output'], callback);		
}

function call_save_transcript_temporary(json, callback) {
	return ext.save_transcript_temporary(json['transcript'], callback);		
}

function call_convert_to_video(json, callback) {
	return medialibrary.convertToVideo(json['file'], json['format'], json['height'], io, json['box'], callback);
}

function call_convert_to_audio(json, callback) {
	return medialibrary.convertToAudio(json['file'], json['format'], io, json['box'], callback);
}

function call_convert_to_shortaudio(json, callback) {
	return ext.convert_to_shortaudio(json['file'], callback);
}

function call_compatible_files(json, callback) {
	return ext.compatible_files(json['name'], json['browser'], json['browserversion'], json['format'], callback);
}

function call_test_media_file(json, callback) {
	return ext.test_media_file(json['name'], json['browser'], json['browserversion'], json['format'], json['quality'], callback);
}

function call_read_binary_file(json, callback) {
	return read_binary_file(json['file'], callback);
}

function call_test_file_exists(json, callback) {
	return ext.test_file_exists(json['fn'], callback);
}

function call_update_check(json, callback) {
//	return update.check(json['version'], callback);
	callback(1, "not available");
}

function call_update_clean(json, callback) {
//	return update.clean(callback);
	callback(1, "not available");
}

function call_is_nodejs(json, callback) {
	callback(0, 'true');
}

function call_export_media(json, callback) {
	return medialibrary.mediaExtract([json['media']], null, 2, true, parseInt(json['tmin']), parseInt(json['tmax']), io, json['box'], callback);
}

function call_export_media_subt(json, callback) {
	try {
		var dirpath = filelookup.getUserHome() + '/temp';
		if (version.debug(__filename)) console.log('test de ' + dirpath);
		if (! filesys.existsSync(dirpath)) filesys.mkdir(dirpath);
		var tempfn = version.generateName(dirpath, 'subtitles', json['type'] === 'srt' ? '.srt' : '.ass').replace(/\\/g,'/');
		if (version.debug(__filename)) console.log('ecriture de ' + tempfn);
		filesys.writeFileSync( tempfn, json['subtitles'] );
		return medialibrary.burnSubtitles([json['media']], null, [tempfn], 2, true, parseInt(json['tmin']), parseInt(json['tmax']), io, json['box'], callback);
	} catch(e) {
		// Path does not exist, it is ok
		callback('error: cannot create temporary file before subtitles burning' + tempfn);
	}
}

/*
 * loads the table of equivalence for POST
 */
var post_function_list = {
	'/is_nodejs' : call_is_nodejs,
	'/save_transcript' : call_save_transcript,
	'/save_transcript_temporary' : call_save_transcript_temporary,
	'/format_to_tei' : call_format_to_tei,
	'/tei_to_format': call_tei_to_format,
	'/convert_to_video': call_convert_to_video,
	'/convert_to_audio': call_convert_to_audio,
	'/convert_to_shortaudio': call_convert_to_shortaudio,
	'/create_dir': call_create_dir,
	'/read_binary_file': call_read_binary_file,
	'/compatible_files': call_compatible_files,
	'/test_media_file': call_test_media_file,
	'/test_file_exists': call_test_file_exists,
	'/update_check': call_update_check,
	'/update_clean': call_update_clean,
	'/export_media': call_export_media,
	'/export_media_subt': call_export_media_subt,
};

/*
 * loads the table of equivalence for GET
 */
var get_function_list = {
	'/filelookup.js': filelookup.process,
};

var previousFile = null;
var previousResponse = null;

/**
 * @method read_binary_file
 * @param {string} input filename
 * @param {function} callback
 */
function read_binary_file(file, callback) {
	file = codefn.decodeFilename(file);
	if (version.debug(__filename)) console.log("read binnary file: " + file);
	try {
		var full_path = filesys.realpathSync(file);
	    var stat = filesys.statSync(full_path);
		filesys.readFile(full_path, "binary", function(err, data) {
			callback(0, data);
		});    
	} catch (error) {
		console.log('Error ' + error.toString() + ' on reading file: ' + file);
		callback(1, 'Error ' + error.toString() + ' on reading file: ' + file);
	}
}

/**
 * @method loadFile load a file and send it to the client
 * @param original request
 * @param response to be filled 
 * @param my_path path for the file to be loaded
 */
function load_file(request, response, my_path) {
	// default files names
	if (my_path == null || my_path == '/' || my_path == '/transcriberjs') my_path = '/transcriberjs.html';
	if (my_path == '/transcriberfiles' || my_path == '/transcriberjsfiles') my_path = '/transcriberfiles.html';
	
	// console.log('ask for ' + my_path);
    var full_path = codefn.decodeFilename(my_path);
	if (version.debug(__filename)) console.log('ask again for ' + full_path);
    if (filesys.existsSync(full_path)) {  
    	try {
			//console.log('file exists: ' + my_path);
		    var stat = filesys.statSync(full_path);
		    if (!stat.isFile()) {
		    	response.writeHeader(403, {"Content-Type": "text/plain"});    
	            response.write("Directory access is forbidden\n");    
	            response.end();
	            return;
		    }
       		// test the extension to know the content-type
     		var mimetypeauto = mime.lookup(full_path);
			// console.log(mimetypeauto);
			var ext = path.extname(full_path).toLowerCase();
		    var total = stat.size;
			// console.log('Extension is : ' + ext + ' size is : ' + total);
        	if (ext == '.wav' || ext == '.oga' || ext == '.mp3' || ext == '.ogv' || ext == '.ogm' || ext == '.ogg' || ext == '.mp4' || ext == '.webm') {
        		// console.log('load media de ' + full_path);
 				/*var mimetype = 'video/mp4';
 				if (ext == '.wav')
 					mimetype = 'audio/wav';
 				else if (ext == '.oga')
 					mimetype = 'audio/ogg';
 				else if (ext == '.mp3')
 					mimetype = 'audio/mp3';
 				else if (ext == '.ogm')
 					mimetype = 'audio/ogg';
 				else if (ext == '.ogv')
 					mimetype = 'video/ogg';
 				else if (ext == '.ogg')
 					mimetype = 'video/ogg';
 				else if (ext == '.webm')
 					mimetype = 'video/webm';
 				// else video/mp4 
 				*/
				//console.log(mimetypeauto);
				// console.log(mimetype);

				//console.log('range= ' + request.headers['range']);
				if (request.headers['range']) {
					try {
						var range = request.headers.range;
						var parts = range.replace(/bytes=/, "").split("-");
						var partialstart = parts[0];
						var partialend = parts[1];
	
						var start = parseInt(partialstart, 10);
						var end = partialend ? parseInt(partialend, 10) : total - 1;
						var chunksize = (end - start) + 1;
						if (version.debug(__filename)) console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
						
						if (start>end) {
							// error start should be smaller than end
							if (version.debug(__filename)) console.log('error on file size: ' + full_path + ' start:' + start + ' end:' + end);
							return;
						}

						if (previousFile) previousFile.unpipe(previousResponse);
	
						var file = filesys.createReadStream(full_path, {
							start : start,
							end : end
						});
						response.writeHead(206, {
							'Content-Range' : 'bytes ' + start + '-' + end + '/' + total,
							'Accept-Ranges' : 'bytes',
							'Content-Length' : chunksize,
							'Content-Type' : mimetypeauto
						});
						file.pipe(response);
						previousFile = file;
						previousResponse = response;
					} catch(error) {
						console.trace('erreur sur lecture range');
						console.log(error);
					}
				} else {
					try {
						if (version.debug(__filename)) console.log('ALL: ' + total);
						response.writeHead(200, {
							'Content-Length' : total,
							'Content-Type' : mimetypeauto
						});
						filesys.createReadStream(full_path).pipe(response);
					} catch(error) {
						console.trace('erreur sur lecture globale');
						console.log(error);
					}
				}
        	} else {
/*
					response.setHeader('Content-Type', mimetypeauto);
					response.statusCode = 200; // no error
					var file = filesys.createReadStream(full_path);
					file.on("open", function() { file.pipe(response); });
					file.on("error", function(err) { console.log(err); });
*/
	            filesys.readFile(full_path, "binary", function(err, file) {    
	                 if (err) {    
	                    response.writeHead(500, {"Content-Type": 'text/html'});    
	                    response.write(err + "\n");    
	                    response.end();    
					    if (version.debug(__filename)) console.log('not loaded: ' + full_path);                 
	                 } else {  
	                    response.writeHead(200, {
							'Content-Type' : mimetypeauto
						});    
	                    response.write(file, "binary");    
	                    response.end();  
					    // console.log('loaded');
	                }        
	            });
        	}
		} catch (error) {
			console.trace('catch général');
			console.log(error);
		}
	} else {
		// console.log('file does not exist: ' + my_path);
	    if (version.debug(__filename)) console.log('file does not exist: full path: ' + full_path);
        response.writeHeader(404, {"Content-Type": "text/plain"});    
        response.write("404 Not Found\n");    
        response.end();  
	}
}  

/**
 * @method handlePostRequest process POST request
 * @param {Object} req
 * @param {Object} res
 * @param {Object} url_parsed
 */
var handlePostRequest = function (req, res, url_parsed) {
    if (version.debug(__filename)) console.log('POST pathname ' + url_parsed.pathname + ' href: ' + url_parsed.href);
    var data = "";
    req.on("data", function(chunk) {
        data += chunk;
        if (data.length > 1e6) { 
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            req.connection.destroy();
        }
    });

    req.on("end", function() {
        // console.log("raw: " + data);
        var json = qs.parse(data);
        if (version.debug(__filename)) console.log('post: ' + JSON.stringify(json) );
        // call function
        var fun = post_function_list[url_parsed.pathname];
        if (version.debug(__filename)) console.log('for fun=' + url_parsed.pathname + ' found:' + fun);
        if (fun == undefined) {
	        if (version.debug(__filename)) console.log('cannot find function: ' + url_parsed.pathname);
	        res.write('error: cannot find function: ' + url_parsed.pathname);
	        res.end('');
        } else {
			// asynchonous version
	        fun(json, function(err, result) {
	        	if (version.debug(__filename)) console.log('POST: ' + err);
	        	if (err>0) {
			        res.writeHeader(400, {"Content-Type": "text/plain"});
			        res.write( result ); // synchronous version
	        	} else {
//	        		if (version.debug(__filename)) console.log(result);
			        res.writeHeader(200, {"Content-Type": "text/plain"});
			        res.write( result ); // synchronous version
	        	}
		        res.end();
		        if (version.debug(__filename)) console.log('end fun=' + err + ' ' + url_parsed.pathname);
	        });
        }
    });
};

function functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

/**
 * centralize get requests
 */
var handleGetRequest = function(req, res, url_parsed) {
/*  
	if (version.debug(__filename)) console.log('getRequest: ' + JSON.stringify(url_parsed) );
	if (version.debug(__filename)) console.log('search: ' + url_parsed.search);
    if (version.debug(__filename)) console.log('query: ' + JSON.stringify(url_parsed.query));
    if (version.debug(__filename)) console.log('pathname: ' + url_parsed.pathname);
    if (version.debug(__filename)) console.log('path: ' + url_parsed.path);
    if (version.debug(__filename)) console.log('href: ' + url_parsed.href);
*/
	var getcmd = (url_parsed.pathname !== undefined) ? url_parsed.pathname : undefined;
	if (version.debug(__filename)) console.log('getcmd is ' + getcmd);
    var fun = get_function_list[getcmd];
    if (fun !== undefined) {
	    if (version.debug(__filename)) console.log('GET (fun)' + functionName(fun) + ' ' + codefn.decodeFilename(req.url) );
    	fun(req, res, url_parsed);
	    return;
    }
	// if (version.debug(__filename)) console.log('GET(file) ' + req.url );
    load_file(req, res, url_parsed.pathname); // here all the gets are interpreted as change URL
};
