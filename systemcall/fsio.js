/* global fsio */
/* global trjs */

/* use strict */

var fs = require('fs');
var path = require('path');
var remote = require('electron').remote;
var externals = require('./node/external.js');
var medialibrary = require('./node/medialibrary.js');
var filelookup = require('./node/filelookup.js');
// var version = require('./editor/version.js');
// var codefn = require('./editor/codefn.js');

var fsio = {};

fsio.typeChooseFile = null;  // stores the type of file to be asked for in the interface
fsio.destChooseFile = null;  // stores the type of file to be send as result
fsio.selection = null; // current selected value + end value then ok is clicked
fsio.selectedPath = null; // current selected path + end value

/**
 * available in all files
 */
fsio.startChooseFile = function(dest, type) {
    if (dest === 'transcript' && type === 'transcript') trjs.contextualhelp('new-trs',false);
    if (dest === 'media' && type === 'media') trjs.contextualhelp('boutons-media',false);
    if (type === 'transcriptsaveas') {
        fsio.__chooseSaveFile('Save transcript as',
            [
                { name: 'Transcription Files', extensions: ['cha', 'cex', 'textgrid', 'eaf', 'trs', 'xml', 'trjs'] },
                { name: 'Chat Files', extensions: ['cha', 'cex'] },
                { name: 'Praat Files', extensions: ['textgrid'] },
                { name: 'Elan Files', extensions: ['eaf'] },
                { name: 'Transcriber Files', extensions: ['trs'] },
                { name: 'Trjs Files', extensions: ['trjs'] }
            ],
            fsio.writeTranscript
        );
    } else if (type === 'mediaconvert') {
        fsio.__chooseOpenFile('Choose media',
            [
                { name: 'Media Files', extensions: ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'avi', 'mpg', 'mpeg', 'wav', 'mp3', 'aif', 'oga', 'flac'] },
                { name: 'Video Files', extensions: ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'avi', 'mpg', 'mpeg'] },
                { name: 'Audio Files', extensions: ['wav', 'mp3', 'aif', 'oga', 'flac'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            fsio.convertMedia
        );
    } else if (dest === 'media') {
        fsio.__chooseOpenFile('Choose media',
            [
                { name: 'Media Files', extensions: ['mp4', 'webm', 'ogg', 'ogv', 'wav', 'mp3', 'oga'] },
                { name: 'Video Files', extensions: ['mp4', 'webm', 'ogg', 'ogv'] },
                { name: 'Audio Files', extensions: ['wav', 'mp3'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            fsio.openMedia
        );
    } else if (dest === 'transcript') {
        fsio.__chooseOpenFile('Choose transcript',
            [
                { name: 'Transcription Files', extensions: ['cha', 'cex', 'textgrid', 'eaf', 'trs', 'xml', 'trjs'] },
                { name: 'Chat Files', extensions: ['cha', 'cex'] },
                { name: 'Praat Files', extensions: ['textgrid'] },
                { name: 'Elan Files', extensions: ['eaf'] },
                { name: 'Transcriber Files', extensions: ['trs'] },
                { name: 'Text Files', extensions: ['txt'] },
                { name: 'Trjs Files', extensions: ['trjs'] }
            ],
            fsio.openTranscript
        );
    } else {
        trjs.log.alert('wrong parametrer for __initChooseFile');
    }
};

/*
 *  @method: fsio.choosefile
 *  @param: dest
 *  @param: type
 */
fsio.chooseFile = function(dest, type) {
    if (type === 'transcriptsaveas' || type === 'media' || type === 'mediaconvert') {
        fsio.startChooseFile(dest, type);
        return;
    }
    trjs.init.testNotSave( function(yesno) {
        if (yesno === true ) {  // the user does not want to save the modified file or the file is not modified since last save
            fsio.startChooseFile(dest, type);
        }
    });
};

fsio.openTranscript = function(code, data) {
    if (code === 0) {
        data = data.replace(/\\/g, '/');
        trjs.local.put('recordingRealFile', data);
        //console.log('>>recording openTranscript ' + data);
        trjs.io.serverLoadTranscript(data, true, function(err) {
            trjs.data.setNamesInEdit();
            // trjs.io.innerSave();
            if (!err) trjs.editor.finalizeLoad();
        } ); // internal load
    } else {
        if (code !== 2)
            trjs.log.alert('error: ' + data);
        // else code===2 --> cancel by user
    }
};

function toLowerCaseSystem(str) {
    if (!str) return '';
    if (window.navigator.platform.indexOf('Linux') === -1)
        return str.toLowerCase();
    else
        return str;
}

fsio.writeTranscript = function(code, data) {
    if (code === 0) {
        trjs.local.put('recordingRealFile', data);
        var exts = version.BASIC_EXT.split('|');
        var withExt = false;
        for (var i in exts) {
            if (exts[i] && toLowerCaseSystem(data).endsWith(exts[i])) {
                withExt = true;
                break;
            }
        }
        if ( !withExt )
            data += version.SOFT_EXT;
        // test if file exist already
        trjs.io.testFileExists(data, function(exists, fn) {
            if (exists === true) {
                bootbox.confirm( trjs.messgs.askforerase + data + " ?", function(ok) {
                    if (ok !== true)
                        return;
                    trjs.data.setRecordingRealFile(data);
                    fsio.setMRU(data);
                    trjs.data.setNamesInEdit();
                    trjs.io.serverSave();
                });
            } else {
                trjs.data.setRecordingRealFile(data);
                fsio.setMRU(data);
                trjs.data.setNamesInEdit();
                trjs.io.serverSave();
            }
        });
    } else {
        if (code !== 2)
            trjs.log.alert('error: ' + data);
        // else code===2 --> cancel by user
    }
};

fsio.openMedia = function(code, data) {
    if (code === 0) {
        data = data.replace(/\\/g, '/');
        //console.log('>>media openMedia ' + data);
        trjs.local.put('Media: trjs.data.mediaRealFile', data);
        trjs.io.serverLoadMedia(data);
    } else {
        if (code !== 2)
            trjs.log.alert('error: ' + data);
        // else code===2 --> cancel by user
 //       if (trjs.media.xxx)
 //           trjs.media.display('notloaded');
    }
};

fsio.convertMedia = function(code, data) {
    if (code === 0) {
        data = data.replace(/\\/g, '/');
        console.log('>>media convertMedia ' + data);
        trjs.io.convertMediaFile(data,'convertonly');
    } else {
        if (code !== 2)
            trjs.log.alert('errorConvert: ' + data);
    }
}

fsio.__chooseOpenFile = function(title, filters, callback) {
    try {
        var fl = remote.dialog.showOpenDialog({
            title: title,
            filters: filters,
            properties: [ 'openFile' ]
        });
        if (fl) {
            callback(0, fl[0]);
        } else
            callback(2, 'cancelled');
    } catch (error) {
        console.log(error);
        callback(1, error);
    }
};

fsio.__chooseSaveFile = function(title, filters, callback) {
    try {
        var fl = remote.dialog.showSaveDialog({
            title: 'Save transcription file',
            filters: filters
        });
        if (fl) {
            callback(0, fl);
        } else
            callback(2, 'cancelled');
    } catch (error) {
        console.log(error);
        callback(1, error);
    }
};

/*
fsio.openFileSync = function(fname, callback) {
    try {
        var tb = fs.readFileSync(fname, 'utf-8');
        callback(0, fname, tb);
    } catch (error) {
        console.log(error);
        callback(1, error, null);
    }
};

fsio.saveFileSync = function(args, callback) {
    try {
        fs.writeFileSync(args.name, args.data, 'utf-8');
        if (callback) callback(0, 'file saved');
    } catch (error) {
        console.log(error);
        if (callback) callback(1, error);
    }
};
*/

fsio.readFile = function(fname, callbackDone, callbackFail) {
    //console.log('LOADFILE: ' + fname);
    try {
        fs.readFile(fname, 'utf-8', function (err, data) {
            if (!err)
                callbackDone(data.replace(/^\uFEFF/, ''));
            else
                callbackFail(err + ' ' + data);
        });
    } catch (error) {
        console.log(error);
        callbackFail(error);
    }
};

fsio.readBinaryFile = function(fname, callbackDone, callbackFail) {
    //console.log('READ BINARY FILE: ' + fname);
    try {
        fs.readFile(fname, function (err, data) {
            if (!err)
                callbackDone(data);
            else
                callbackFail(err + ' ' + data);
        });
    } catch (error) {
        console.log(error);
        callbackFail(error);
    }
};

fsio.saveTranscript = function(args, callbackDone, callbackFail) {
    externals.save_transcript(args.file, args.nbsave, args.transcript,
        function (err) {
            if (!err)
                callbackDone('saved');
            else
                callbackFail(err + ' saving ' + args.file);
        }
    );
};

fsio.saveFile = function(args, doneFunction, failFunction) {
    //console.log('SAVE FILE: ' + args.name);
    try {
        fs.writeFile(args.name, args.data, function (err) {
            if (!err)
                doneFunction(args.name + ' saved');
            else
                failFunction(err + ' ' + args.data);
        });
    } catch (error) {
        console.log(error);
        failFunction(error);
    }
};

fsio.saveBlob = function(args) {
    // Create the request object
    var request = new XMLHttpRequest();
    // Open the asynchronous POST request
    request.open('POST', '/save_file', true);
    //Blob is a Binary Large Object
    request.setRequestHeader('Content-Type', 'application/json');
    // Establish the connection to the server and send the serialized data
    request.addEventListener('load', uploadFinished, false);
    request.send( args );
    /*
     var p = $.post('save_file', args);
     console.log(p);
     if (doneFunction) p.done( doneFunction );
     if (doneFunction) p.fail( failFunction );
     */
};

function uploadFinished() {
    if (this.status == 200) {
        console.log('uploadFinished OK');
    } else {
        console.log('uploadFinished error: ' + this.status);
    }
}

fsio.teiToFormat = function(args, doneFunction, failFunction) {
    externals.tei_to_format(args.format, args.transcript, args.output,
        function (err, mess) {
            if (!err)
                doneFunction(mess);
            else
                failFunction(mess);
        }
    );
};

fsio.formatToTei = function(args, doneFunction, failFunction) {
    externals.format_to_tei(args.format, args.file, args.output,
        function (err, mess) {
            if (!err)
                doneFunction(mess);
            else
                failFunction(mess);
        }
    );
};

fsio.convertToVideo = function(args, doneFunction, failFunction) {
    medialibrary.convertToVideo(args.file, args.format, args.height, 'electron', args.box,
        function (err, mess) {
            if (!err)
                doneFunction(mess);
            else
                failFunction(mess);
        }
    );
};

fsio.convertToAudio = function(args, doneFunction, failFunction) {
    medialibrary.convertToAudio(args.file, args.format, 'electron', args.box,
        function (err, mess) {
            if (!err)
                doneFunction(mess);
            else
                failFunction(mess);
        }
    );
};

fsio.compatibleFiles = function(args, doneFunction, failFunction) {
    externals.compatible_files(args.name, args.browser, args.browserversion, args.format,
        function (err, mess) {
            if (!err)
                doneFunction(mess);
            else
                failFunction(mess);
        }
    );
};

fsio.testMediaFile = function(args, doneFunction, failFunction) {
    externals.test_media_file(args.name, args.browser, args.browserversion, args.format, args.quality,
        function (err, mess) {
            if (!err)
                doneFunction(mess);
            else
                failFunction(mess);
        }
    );
};

fsio.testFileExists = function(args, doneFunction, failFunction) {
    externals.test_file_exists(args.fn,
        function (err, mess) {
            if (!err)
                doneFunction(mess);
            else
                failFunction(mess);
        }
    );
};

fsio.convertToShortAudio = function(args, doneFunction, failFunction) {
    externals.convert_to_shortaudio(args.file,
        function (err, mess) {
            if (!err)
                doneFunction(mess);
            else
                failFunction(mess);
        }
    );
};

fsio.updateCheck = function(args, doneFunction, failFunction) {
    /*
    $.post('update_check', args)
        .done( doneFunction )
        .fail( failFunction );
    */
};

fsio.updateClean = function(args, doneFunction, failFunction) {
    /*
    $.post('update_clean', args)
        .done( doneFunction )
        .fail( failFunction );
    */
};

fsio.exportMediaSubt = function(args, doneFunction, failFunction) {
    var tempfn = 'init function';
    try {
        var dirpath = filelookup.getUserHome() + '/temp';
        //console.log('test de ' + dirpath);
        if (!fs.existsSync(dirpath)) fs.mkdir(dirpath);
        tempfn = version.generateName(dirpath, 'subtitles', args['type'] === 'srt' ? '.srt' : '.ass').replace(/\\/g, '/');
        // if (version.debug(__filename))
        //console.log('ecriture de ' + tempfn);
        fs.writeFileSync(tempfn, args['subtitles']);
        return medialibrary.burnSubtitles(args['media'], null, tempfn, 2, true, parseInt(args['tmin']), parseInt(args['tmax']), 'electron', args['box'],
            function (err, mess) {
                if (!err)
                    doneFunction(mess);
                else
                    failFunction(mess);
            }
        );
        //medialibrary.burnSubtitles = function(mediaFile, output, subtFile, percent, overwrite, begin, end, io, box, callback)
    } catch (e) {
        // Path does not exist, it is ok
        console.log('error: cannot create temporary file before subtitles burning' + tempfn + ' ' + e.toString());
        failFunction('error: cannot create temporary file before subtitles burning' + tempfn);
    }
    /*
    $.post('export_media_subt', args)
        .done( doneFunction )
        .fail( failFunction );
    */
};

fsio.exportMedia = function(args, doneFunction, failFunction) {
    medialibrary.mediaExtract(args.media, null, 2, true, parseInt(args.tmin), parseInt(args.tmax), 'electron', args.box,
        function (err, mess) {
            if (!err)
                doneFunction(mess);
            else
                failFunction(mess);
        }
    );
};

var openFromMenu = function(menuItem, browserWindow, event) {
    fsio.openTranscript(0, menuItem.label);
}

fsio.setMRU = function(name) {
    //const remote = require('electron').remote;
    const Menu = remote.Menu;
    const MenuItem = remote.MenuItem;
    var mn = new MenuItem({label: name, click: openFromMenu});
    var topmn = Menu.getApplicationMenu();
    var recentfiles = (process.platform === 'darwin')
        ? topmn.items[1].submenu.items[9].submenu
        : topmn.items[0].submenu.items[9].submenu;
    recentfiles.clear();
    trjs.param.recentfiles.unshift(name);
    recentfiles.append(mn);
    for (var i=1; i<trjs.param.recentfiles.length && i<trjs.param.nbRecentFiles; i++) {
        //console.log("RF: ", i, trjs.param.recentfiles[i], name);
        if (trjs.param.recentfiles[i] === name) {
            trjs.param.recentfiles.splice(i,1);
            continue;
        }
        mn = new MenuItem({label: trjs.param.recentfiles[i], click: openFromMenu});
        recentfiles.append(mn);
    }
    // clear end of trjs.param.recentfiles
    if (i < trjs.param.recentfiles.length)
        trjs.param.recentfiles.splice(i,trjs.param.recentfiles.length-i);
    Menu.setApplicationMenu(topmn);
    trjs.param.saveStorage();
};

fsio.setMRUInitial = function() {
    //const remote = require('electron').remote;
    const Menu = remote.Menu;
    const MenuItem = remote.MenuItem;

    var topmn = Menu.getApplicationMenu();
    var recentfiles = (process.platform === 'darwin')
        ? topmn.items[1].submenu.items[9].submenu
        : topmn.items[0].submenu.items[9].submenu;

    var lg = trjs.param.recentfiles.length;
    for (var i = 0; i < lg; i++) {
        var mn = new MenuItem({label: trjs.param.recentfiles[i], click: openFromMenu});
        recentfiles.append(mn);
    }
    Menu.setApplicationMenu(topmn);
};

fsio.clearMRU = function() {
    //const remote = require('electron').remote;
    const Menu = remote.Menu;
    const MenuItem = remote.MenuItem;
    var topmn = Menu.getApplicationMenu();
    var recentfiles = topmn.items[1].submenu.items[9].submenu;
    recentfiles.clear();
    Menu.setApplicationMenu(topmn);
};

fsio.openExternal = function(href) {
    remote.shell.openExternal(href);
}
