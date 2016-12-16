
/**
 * load a transcription from a FILE object (for internal purposes)
 * @method localLoadTranscriptFile
 * @param {file} object
 */

var systemCall = {};

systemCall.openLocalFile = function(fn) {
    var nBytes = 0,
        oFiles = $("#upload-input-transcript")[0].files,
        nBytes = oFiles[0].size;
    var sOutput = nBytes + " bytes";
    // optional code for multiples approximation
    for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
        nMultiple = 0,
        nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
        sOutput = nApprox.toFixed(1) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }
    // end of optional code
    $("#transcript-file-size").html(sOutput);
    readTranscriptObj(oFiles[0]);
};

/**
 * read a transcription from a FILE object with FileReader
 * @method readTranscriptObj
 * @param File object
 */

var readTranscriptObjCallback = null;

function readTranscriptObj(file) {
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
            $('#divopenfile').hide();
            if (readTranscriptObjCallback) {
                readTranscriptObjCallback(0, file.name, e.target.result);
            }
        };
    })(file);

    // Read in the image file as a data URL.
    reader.readAsText(file);
}

/**
 * available in main
 */
systemCall.chooseOpenFile = function(callback) {
    readTranscriptObjCallback = callback;
    $('#divopenfile').show();
};

systemCall.saveFileLocal = function(type, name, data) {
    var blob = new Blob([data], {
        type : "text/plain;charset=utf-8"
    });
    // {type: 'text/css'});
    var p1 = name.lastIndexOf('/');
    var p2 = name.lastIndexOf('\\');
    if (p1 < p2) p1 = p2;
    if (p1 === -1) p1 = 0;
    var l = name.substr(p1);
    saveAs(blob, l);
};
