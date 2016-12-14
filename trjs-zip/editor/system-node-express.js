/**
 * system-node-express.js
 * @author Christophe Parisse
 * interface to node.js and express as a server
 */

trjs.system = {};

trjs.system.saveTranscript = function(args, doneFunction, failFunction) {
    $.post('save_transcript', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.saveFile = function(args, doneFunction, failFunction) {
    var p = $.post('save_file', args);
    console.log(p);
    if (doneFunction) p.done( doneFunction );
    if (doneFunction) p.fail( failFunction );
}

trjs.system.saveBlob = function(args, doneFunction, failFunction) {
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

trjs.system.teiToFormat = function(args, doneFunction, failFunction) {
    $.post('tei_to_format', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.formatToTei = function(args, doneFunction, failFunction) {
    $.post('format_to_tei', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.convertToVideo = function(args, doneFunction, failFunction) {
    $.post('convert_to_video', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.convertToAudio = function(args, doneFunction, failFunction) {
    $.post('convert_to_audio', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.compatibleFiles = function(args, doneFunction, failFunction) {
    $.post('compatible_files', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.testMediaFile = function(args, doneFunction, failFunction) {
    $.post('test_media_file', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.moveRecording = function(args, doneFunction, failFunction) {
    $.post('move_recording', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.testFileExists = function(args, doneFunction, failFunction) {
    $.post('test_file_exists', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.convertToShortAudio = function(args, doneFunction, failFunction) {
    $.post('convert_to_shortaudio', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.updateCheck = function(args, doneFunction, failFunction) {
    $.post('update_check', args)
    .done( doneFunction )
    .fail( failFunction );
}

trjs.system.updateClean = function(args, doneFunction, failFunction) {
    $.post('update_clean', args)
    .done( doneFunction )
    .fail( failFunction );
}
