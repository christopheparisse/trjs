/**
 * trjsexpress.js
 * express implementation of a node.js server
 */

global.applicationTarget = { type: 'html+express', server: 'express', location: 'local' };

var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');
var url = require('url');
var qs = require('querystring');
var childproc = require('child_process');
var filesys = require("fs");

/*
 * load the various other files
 */
var version = require('../editor/version.js');
var codefn = require('../editor/codefn.js');
var ext = require('./external.js');
var medialibrary = require('./medialibrary.js');
var filelookup = require('./filelookup.js');
// var update = require('./update.js');

var TRJSCLIENT_HTML = "trjsclient.html";
//version.setExpress(8103, 'distant');
version.setExpress(8103, 'local');
filelookup.init('/');

var styleFiles = '';

var argv = require('minimist')(process.argv.slice(2));

var usage = function (argument) {
    console.log('trjsexpress.js ' + version.version);
    console.log('');
    console.log('Usage: node trjsexpress.js --debug --help');
    console.log('Usage: node trjsexpress.js --help --nohtml --html file --debug');
    console.log('    --nohtml : the ' + TRJSCLIENT_HTML + ' page is not loaded in the webbrowser');
    console.log('    --html file : the html page given as argument is loaded in the webbrowser');
    console.log('    --help : this message');
    console.log('    --debug : all debug information is displayed');
    console.log('    --debug file : debug for the file given as argument in displayed');
    process.exit(1);
};

if (argv.help === true) usage();
if (argv.debug === true) version.setDebug('__all__', true);
if (typeof argv.debug === 'string') version.setDebug(argv.debug, true);
if (typeof argv.debug === 'object')
    for (var i in argv.debug)
        version.setDebug(argv.debug[i], true);

version.setExpress();

function call_create_dir(json, callback) {
    return ext.create_dir(json['dir'], json['file'], callback);
}

function call_save_transcript(json, callback) {
    return ext.save_transcript(json['file'], json['nbsave'], json['transcript'], callback);
}

function call_save_file(json, callback) {
    return ext.save_file(json['name'], json['data'], callback);
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
    callback(1, 'not available');
}

function call_update_clean(json, callback) {
//	return update.clean(callback);
    callback(1, 'not available');
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
        //console.log('test de ' + dirpath);
        if (!filesys.existsSync(dirpath)) filesys.mkdir(dirpath);
        var tempfn = version.generateName(dirpath, 'subtitles', json['type'] === 'srt' ? '.srt' : '.ass').replace(/\\/g, '/');
        //if (version.debug(__filename))
        // console.log('ecriture de ' + tempfn);
        filesys.writeFileSync(tempfn, json['subtitles']);
        return medialibrary.burnSubtitles([json['media']], null, [tempfn], 2, true, parseInt(json['tmin']), parseInt(json['tmax']), io, json['box'], callback);
        //medialibrary.burnSubtitles = function(mediaFile, output, subtFile, percent, overwrite, begin, end, io, box, callback)
    } catch (e) {
        // Path does not exist, it is ok
        console.log('error: cannot create temporary file before subtitles burning' + tempfn + ' ' + e.toString());
        callback(0, 'error: cannot create temporary file before subtitles burning' + tempfn);
    }
}

/**
 * @method read_binary_file
 * @param {string} input filename
 * @param {function} callback
 */
function read_binary_file(file, callback) {
    // console.log("read binary file: " + file);
    file = codefn.decodeFilename(file);
    if (version.debug(__filename))
        console.log("read binary file (transformed): " + file);
    try {
        var full_path = filesys.realpathSync(file);
        var stat = filesys.statSync(full_path);
        filesys.readFile(full_path, "binary", function (err, data) {
            if (version.debug(__filename))
                console.log('read binary : retour ok');
            callback(0, data);
        });
    } catch (error) {
        console.log('Error ' + error.toString() + ' on reading file: ' + file);
        callback(1, 'Error ' + error.toString() + ' on reading file: ' + file);
    }
}

/*
 * loads the table of equivalence for POST
 */
var post_function_list = {
    'is_nodejs': call_is_nodejs,
    'save_transcript': call_save_transcript,
    'save_file': call_save_file,
    'save_transcript_temporary': call_save_transcript_temporary,
    'format_to_tei': call_format_to_tei,
    'tei_to_format': call_tei_to_format,
    'convert_to_video': call_convert_to_video,
    'convert_to_audio': call_convert_to_audio,
    'convert_to_shortaudio': call_convert_to_shortaudio,
    'create_dir': call_create_dir,
    'read_binary_file': call_read_binary_file,
    'compatible_files': call_compatible_files,
    'test_media_file': call_test_media_file,
    'test_file_exists': call_test_file_exists,
    'update_check': call_update_check,
    'update_clean': call_update_clean,
    'export_media': call_export_media,
    'export_media_subt': call_export_media_subt,
};

// Create an express application
var app = express();
// app.use(express.favicon());

// register a middleware
if (version.debug(__filename))
    console.log('trjsLoc()=' + version.trjsLoc());
app.use(serveStatic(version.trjsLoc()));

app.post('/:cmd', function (req, res) {
    try {
        if (version.debug(__filename)) {
            console.log(req.headers);
            console.log(req.url);
            console.log(req.params.cmd);
        }
        var data = "";
        req.on("data", function (chunk) {
            data += chunk;
            if (data.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                req.connection.destroy();
            }
        });
        req.on("end", function () {
            // console.log("raw: " + data);
            var json = qs.parse(data);
            if (version.debug(__filename))
                console.log('post: ' + JSON.stringify(json));
            // call function
            var fun = post_function_list[req.params.cmd];
            if (version.debug(__filename)) console.log('for fun=' + req.url + ' found:' + fun);
            if (fun === undefined) {
                if (version.debug(__filename)) console.log('cannot find function: ' + req.params.cmd);
                res.write('error: cannot find function: ' + req.params.cmd);
                res.end('');
            } else {
                // asynchonous version
                fun(json, function (err, result) {
                    if (err > 0) {
                        res.writeHeader(400, {"Content-Type": "text/plain"});
                        res.write(result); // synchronous version
                    } else {
                        if (version.debug(__filename)) console.log("err === 0");
                        res.writeHeader(200, {"Content-Type": "text/plain"});
                        res.write(result); // synchronous version
                    }
                    res.end();
                    if (version.debug(__filename)) console.log('end fun=' + err + ' ' + req.url);
                });
            }
        });
    } catch (error) {
        console.log('error caught on post: ' + error);
    }
});

app.get('/filelookup.js', function (req, res) {
    try {
        // console.log('get: ' + req.originalUrl);
        //	console.log(req.params.cmd);
        if (version.debug(__filename)) {
            console.log('GET: ' + req.url);
            console.log(req._parsedUrl.query);
            console.log(url.parse(req.url, true));
        }
        filelookup.process(req, res, url.parse(req.url, true));
    } catch (error) {
        console.log('error caught on get/filelookup: ' + error);
    }
});

app.get('/', function (req, res) {
    try {
        // console.log('get ROOT: /');
        if (version.debug(__filename)) {
            console.log('ROOT: /');
            console.log('GET: ' + req.url);
            console.log(req._parsedUrl.query);
            console.log(url.parse(req.url, true));
        }
        res.redirect('' + TRJSCLIENT_HTML);
    } catch (error) {
        console.log('error caught on get: ' + error);
    }
});

// Register with http
var server = http.createServer(app);

var startHtml = function (fn) {
    console.log('start ' + fn);
    if (filelookup.testSystem() == 'windows')
        var childHtml = childproc.spawn('cmd', ['/c', 'start', 'http://localhost:' + version.HTTP_PORT + fn.replace('\\', '/')]);
    else
        var childHtml = childproc.spawn('open', ['http://localhost:' + version.HTTP_PORT + fn]);
};

var startHtmls = function () {
    if (argv.html === undefined || argv.html === true)
        startHtml('/' + TRJSCLIENT_HTML);
    if (typeof argv.html === 'string')
        startHtml('/' + TRJSCLIENT_HTML + '?t=' + argv.html);
    if (typeof argv.html === 'object')
        for (var i in argv.html)
            startHtml('/' + TRJSCLIENT_HTML + '?t=' + argv.html[i]);
};

/*
 * checks if port already buzy
 * or deals with errors
 */
server.once('error', function (err) {
    if (err.code === 'EADDRINUSE' && version.location === 'local') {
        // port is currently in use
        console.log('version ' + version.version + ' server started : closing!');
        console.log('version ' + version.version + ' start html!');
        // console.log('system is : ' + filelookup.testSystem());
        startHtmls();
//		process.exit(1);
    }
});

/*
 * checks if port already buzy
 */
server.on('listening', function (err) {
    console.log('listening !');
    if (version.location === 'local' && !argv.nohtml) {
        // html not started
        console.log('version ' + version.version + ' start html!');
        startHtmls();
    }
});

server.listen(version.HTTP_PORT);
console.log('version ' + version.version + ' started in : ' + process.cwd() + ' ' + version.server + ' ' + version.location);

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
    socket.on('trjsclient', function (data) {
        /*
         * print info for control: not used otherwise
         */
        if (version.debug(__filename)) console.log('receive for client socket ' + data);
    });
});
