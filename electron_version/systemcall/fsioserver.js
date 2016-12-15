/**
 * fsioserver.js
 * @author Christophe Parisse
 * interface to node.js and express as a server
 */

/* global fsio */

/* use strict */

var fsio = {};

/**
 * available in main
 */
fsio.chooseFile = function(dest, type) {
    filetree.initChooseFile(dest, type);
};

/**
 * available in main
 */
fsio.readFile = function(fname, callbackDone, callbackFail) {
    //console.log('LOADFILE: ' + fname);
    var nn = codefn.encodeFilename(fname);
    var p = $.get(nn)
        .done( callbackDone )
        .fail( callbackFail );
};

fsio.readBinaryFile = function(fname, callbackDone, callbackFail) {
    $.post('read_binary_file', {file: fname})
        .done(callbackDone)
        .fail(callbackFail);
};

fsio.saveTranscript = function(args, doneFunction, failFunction) {
    $.post('save_transcript', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.saveFile = function(args, doneFunction, failFunction) {
    var p = $.post('save_file', args);
    console.log(p);
    if (doneFunction) p.done( doneFunction );
    if (failFunction) p.fail( failFunction );
}

fsio.saveBlob = function(args, doneFunction, failFunction) {
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
}

function uploadFinished(evt) {
    if (this.status == 200) {
        console.log('uploadFinished OK');
    } else {
        console.log('uploadFinished error: ' + this.status);
    }
}

fsio.teiToFormat = function(args, doneFunction, failFunction) {
    $.post('tei_to_format', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.formatToTei = function(args, doneFunction, failFunction) {
    $.post('format_to_tei', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.convertToVideo = function(args, doneFunction, failFunction) {
    $.post('convert_to_video', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.convertToAudio = function(args, doneFunction, failFunction) {
    $.post('convert_to_audio', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.compatibleFiles = function(args, doneFunction, failFunction) {
    $.post('compatible_files', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.testMediaFile = function(args, doneFunction, failFunction) {
    $.post('test_media_file', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.moveRecording = function(args, doneFunction, failFunction) {
    $.post('move_recording', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.testFileExists = function(args, doneFunction, failFunction) {
    $.post('test_file_exists', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.convertToShortAudio = function(args, doneFunction, failFunction) {
    $.post('convert_to_shortaudio', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.updateCheck = function(args, doneFunction, failFunction) {
    $.post('update_check', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.updateClean = function(args, doneFunction, failFunction) {
    $.post('update_clean', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.exportMediaSubt = function(args, doneFunction, failFunction) {
    $.post('export_media_subt', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.exportMedia = function(args, doneFunction, failFunction) {
    $.post('export_media', args)
        .done( doneFunction )
        .fail( failFunction );
}

fsio.clearMRU = function() {
    var m = $('#recentfiles');
    var l = $('#recentfiles-end');
    m.after('<li><a href="#">...recent files...</a></li>');
    m = m.next().next();
    while (m && m.attr('id') !== l.attr('id')) {
        var mr = m;
        m = m.next();
        mr.remove();
    }
    $('#recentfiles').attr('data-recent', 0);
    trjs.param.recentfiles = [];
    trjs.param.saveStorage();
}

/**
 * update the names of the files in the Most Recent Files list
 * @method setMRU
 * @param {string} name
 */
fsio.setMRU = function(name) {
    var n = parseInt($('#recentfiles').attr('data-recent'));
    if (n === 0) {
        $('#recentfiles').next().remove();
        $('#recentfiles').after('<li><a href="#" onclick=\'trjs.io.loadRecentFile("' + name + '");\'>' + name + '</a></li>');
        $('#recentfiles').attr('data-recent', 1);
        trjs.param.recentfiles = [name];
    } else {
        var m = $('#recentfiles').next();
        var found = -1;
        for (var i = 0; i < n; i++) {
            var mt = m.html();
            if (mt.indexOf('>' + name + '<') !== -1) {
                found = i;
                break;
            }
            m = m.next();
        }
        if (found !== -1) {
            if (found !== 0) {// if 0 then the filename is the last one already: nothing to do
                // exchange the 'found' filename with the first one
                // m is the pointer the line to be moved
                var first = $('#recentfiles');
                first.after(m);
                // insert at begining
                trjs.param.recentfiles.splice(i, 1);
                trjs.param.recentfiles.unshift(name);
            }
        } else {
            if (n < trjs.param.nbRecentFiles) {
                $('#recentfiles').after('<li><a href="#" onclick=\'trjs.io.loadRecentFile("' + name + '");\'>' + name + '</a></li>');
                $('#recentfiles').attr('data-recent', n + 1);
                trjs.param.recentfiles.unshift(name);
            } else {
                $('#recentfiles').after('<li><a href="#" onclick=\'trjs.io.loadRecentFile("' + name + '");\'>' + name + '</a></li>');
                $('#recentfiles-end').prev().remove();
                trjs.param.recentfiles.unshift(name);
                trjs.param.recentfiles.pop();
            }
        }
    }
}

