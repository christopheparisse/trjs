/**
 * <p>Handling the external files for the transcript and the media
 * </p>
 * Date: july 2013
 * @module OpenSave
 * @author Christophe Parisse
 */

'use strict';

/**
 * access to the file, local or remote
 */

var remote = require('electron').remote;

trjs.io = (function () {

    //////////////////////////
    // LOCAL FUNCTIONS
    //////////////////////////

    /**
     * load a media file using the name given in the media input field
     * @method localLoadMedia
     */
    function localLoadMedia() {
        trjs.data.isMediaReady = false;
        trjs.data.initMedia();
        trjs.media.resetMedia();
        var nBytes = 0;
        var oFiles = $("#upload-media")[0].files;
        nBytes = oFiles[0].size;
        var sOutput = nBytes + " bytes";
        // optional code for multiples approximation
        for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
                 nMultiple = 0,
                 nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
            sOutput = nApprox.toFixed(1) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
        }
        // end of optional code
        $("#media-file-size").html(sOutput);

        var objectURL = window.URL.createObjectURL(oFiles[0]);
        var f = oFiles[0];
        trjs.data.setMediaNameLoc(f.name, trjs.data.LOCALDIR);

        trjs.local.put('mediaObject', objectURL);
        trjs.local.put('mediaRealFile', trjs.data.mediaRealFile());
        innerLoadMedia(f.name, objectURL);
        trjs.data.setNamesInEdit();
        trjs.data.setNamesInWindow();
        trjs.data.isMediaReady = true;

        if (!trjs.dmz.localLoadWaveImage(f)) {+
            // hides wave.
            trjs.dmz.setVisible('wave', false);
            $('#askforwave').hide();
            // TODO check if this works and hides corretly this field
        }

        trjs.media.display('loaded');
        var media = $('#media-element')[0].firstElementChild;
        if (media)
            media.addEventListener('timeupdate', trjs.media.timeUpdateListener, false);
        trjs.media.setTime(0);
        trjs.editor.showOpensaveMedia('hide');
    }

    /**
     * load a media file from a blob object (for internal purposes)
     * @method innerLoadMedia
     * @param {file} name
     * @param {blob} object
     */
    function innerLoadMedia(name, obj) {
        var ext = trjs.utils.extensionName(name).toLowerCase();
        trjs.media.setTime(0);
        trjs.media.resetMedia();
        if (ext === ".mp3" || ext === ".oga" || ext === ".wav" || ext === "aif" || ext === "aiff") {
            // sets the audio
            setAudio();
            setAudioFiles(name, obj);
            loadAudio();
        } else {
            // sets the video
            setVideo();
            setVideoFiles(name, obj);
            loadVideo();
        }
    }

    /**
     * load a transcription from a FILE object (for internal purposes)
     * @method localLoadTranscriptFile
     * @param {file} object
     */
    function localLoadTranscriptFile(fn) {
        var file = new File(fn);
        var nBytes = file.size;
        var sOutput = nBytes + " bytes";
        // optional code for multiples approximation
        for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
                 nMultiple = 0,
                 nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
            sOutput = nApprox.toFixed(1) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
        }
        // end of optional code
        $("#transcript-file-size").html(sOutput);
        readTranscriptObj(file);
    }

    /**
     * load a transcription using the object given in the media input field
     * @method localLoadTranscript
     */
    function localLoadTranscript() {
        trjs.init.testNotSave(function (yesno) {
            if (yesno === true) {  // the user does not want to save the modified file or the file is not modified since last save
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
                trjs.editor.showOpensaveTranscript('hide');
                trjs.undo.clear();
            }
        });
    }

    /**
     * read a transcription from a FILE object with FileReader
     * @method readTranscriptObj
     * @param File object
     */

    function readTranscriptObj(f) {
        var reader = new FileReader();
        var xmlString = "";
        //$("#media-name").html("xx+" + f.name);
        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                // get XML ready
                var parser = new DOMParser();
                trjs.data.doc = parser.parseFromString(e.target.result, "text/xml");
                trjs.transcription.loadIntoGrid();
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsText(f);
        trjs.data.setRecordingNameLoc(f.name, trjs.data.LOCALDIR);
    }

    /**
     * save the data in all local storage
     * @method doSave
     */
    function doSave() {
        innerSave();
        serverSave();
        trjs.data.setNamesInWindow();
    }

    /**
     * save the data in all local storage
     * @method doSave
     */
    function doSaveAs() {
        innerSave();
        fsio.chooseFile("transcript", "transcriptsaveas");
        fsio.setMRU(trjs.data.recordingRealFile());
    }

    /**
     * save the data in inner local storage
     * @method innerSave
     * @param {boolean} true if the material saved does not need to be stored on hard disk
     */
    function innerSave(nosaveperm) {
        var s = trjs.transcription.saveTranscriptToString();
        trjs.data.transcriptInner = s;
        // var dump = $('#dump1').text(s);
        trjs.param.saveStorage();
        trjs.local.put('transcript', s);
        trjs.local.put('winsize', trjs.dmz.winsize());
        trjs.local.put('recordingName', trjs.data.recordingName());
        trjs.local.put('recordingRealFile', trjs.data.recordingRealFile());
        trjs.local.put('mediaRealFile', trjs.data.mediaRealFile());
        trjs.local.put('crashed', 'no');
        if (nosaveperm === undefined && trjs.param.ischanged())
            trjs.local.put('saved', 'no');
        return s;
    }

    /**
     * save current file on the downloading area
     * @method localSave
     */
    function localSave() {
        $("#openexports").modal('hide');
        if (trjs.param.checkAtSave)
            trjs.check.checkFinal();
        var s = (!trjs.data.transcriptInner) ? trjs.transcription.saveTranscriptToString() : trjs.data.transcriptInner;
        trjs.data.transcriptInner = null;
        // var dump = $('#dump1').text(s);
        var blob = new Blob([s], {
            type: "text/plain;charset=utf-8"
        });
        // {type: 'text/css'});
        saveAs(blob, (trjs.data.recordingName() ? trjs.data.recordingName() : "export"));
    }

    /**
     * save current file on the downloading area as a csv file
     * @method exportCsv
     */
    function exportCsv() {
        $("#openexports").modal('hide');
        var s = trjs.transcription.saveTranscriptToCsvString(false, false);
        saveExportFile(s, "text/plain;charset=utf-8", ".csv", 'Csv Files', ['csv', 'txt'], 'CSV');
    }

    /**
     * save the exported string to a format
     */
    function saveExportFile(s, mime, ext, extInfo, extFiles, extBOLD) {
        if (trjs.param.server !== 'electron' || trjs.param.exportSaveAs === true) {
            // {type: 'text/css'});
            var blob = new Blob([s], {
                type: mime
            });
            saveAs(blob, (trjs.data.recordingName() ? trjs.data.recordingName() : "export") + ext);
        } else {
            // automatic save in the same folder as the main file
            var fn = (trjs.data.recordingRealFile() ? trjs.data.recordingRealFile() : "export") + ext;
            // var dump = $('#dump1').text(s);
            // test if file exists
            fsio.testFileExists(fn,
                function (mess) { // true
                    // ask for new name
                    try {
                        var fl = remote.dialog.showSaveDialog({
                            title: 'Export transcription file',
                            filters: [
                                { name: extInfo, extensions: extFiles },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        });
                        if (fl) {
                            fsio.saveFile({data: s, name: fl},
                                function (params) {
                                    trjs.log.alert('file saved in ' + extBOLD + ' format as ' + fl);
                                },
                                function (params) {
                                    trjs.log.boxalert('file ' + fl + ' could not be saved');
                                });
                        } else {
                            trjs.log.alert('export cancelled');
                        }
                    } catch (error) {
                        console.log(error);
                        callback(1, error);
                    }
                },
                function (mess) { // false
                    fsio.saveFile({data: s, name: fn},
                        function (params) {
                            trjs.log.alert('file saved in ' + extBOLD + ' format as ' + fn);
                        },
                        function (params) {
                            trjs.log.boxalert('file ' + fn + ' could not be saved');
                        });
                });
        }
    }

    /**
     * save current file on the downloading area as a text file
     * @method exportText
     */
    function exportText(style) {
        $("#openexports").modal('hide');
        var s = trjs.transcription.saveTranscriptToText(false, false, style);
        saveExportFile(s, "text/plain;charset=utf-8", ".txt", 'Text Files', ['txt', 'text'], 'TXT');
    }

    /**
     * save current file on the downloading area as a RTF file
     * @method exportRtf
     */
    function exportRtf(style) {
        $("#openexports").modal('hide');
        var s = trjs.transcription.saveTranscriptToRtf(true, true, true, style);
        saveExportFile(s, "text/plain;charset=utf-8", ".rtf", 'Rtf Files', ['rtf'], 'RTF');
    }

    function getEditTable() {
        var et = [];
        var tablelines = trjs.transcription.tablelines();
        for (var i = 0; i < tablelines.length; i++) {
            var type = trjs.transcription.typeTier($(tablelines[i]));
            // if (type != 'loc') continue;
            // var code = codeTier( $(tablelines[i]) );
            var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
            var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TRCOL));
            if (iloc == '' && itrans == '') continue;
            if (trjs.check.testMark(iloc)) {
                iloc = trjs.check.trimMark(iloc);
                itrans = trjs.check.cleanErrors(itrans);
            }
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            et.push({loc: iloc, ts: its, te: ite, tx: itrans, type: type});
        }
        return et;
    }

    /**
     * save current file on the downloading area as a RTF file
     * @method exportDocx
     */
    function exportDocx(style) {
        $("#openexports").modal('hide');
        var content, s;
        if (style === 'html') {
            s = trjs.transcription.saveTranscriptToHtml(true, true, true);
            content = '<!DOCTYPE html><html><body>' + s + '</body></html>';
        } else if (style === 'raw') {
            // var dump = $('#dump1').text(s);
            s = document.getElementById('edition');
            content = '<!DOCTYPE html><html><body>' + s.outerHTML + '</body></html>';
        } else {
            var corpus = getEditTable();
            if (style === 'tab')
                content = teiConvertTools.tableToDocx(corpus, ';tab;time2;', 3);
            else
                content = teiConvertTools.tableToDocx(corpus, ';table;time2;', 3);
        }
        saveExportFile(content, 'appplication/docx', ".docx", 'Docx Files', ['docx'], 'DOCX');
    }

    /**
     * save current file on the downloading area as a RTF file
     * @method exportXlsx
     */
    function exportXlsx() {
        $("#openexports").modal('hide');
        var corpus = getEditTable();
        var content = teiExportXlsx.tableToXlsx(corpus, 8);
        saveExportFile(content, 'appplication/xlsx', ".xlsx", 'Xlsx Files', ['xlsx'], 'XLSX');
    }

    ///////////////////
    // SERVER FUNCTIONS
    ///////////////////

    /**
     * load a transcrition from the server
     * @method serverLoadTranscript
     * @param name of file (on the server)
     * @param {boolean} later try loading media from TEI file info
     */
    function serverLoadTranscript(name, loadMediaAfter, callback) {
        // test if the transcription is in another format (clan, transcriber, ...)
        trjs.data.setLastLoc(trjs.utils.pathName(name));
        var ext = trjs.utils.extensionName(name).toLowerCase();
        if (ext === '.cha') {
            if (trjs.param.level < 'level4') return;
            trjs.log.alert(trjs.messgs.convertfromchat);
            fsio.setMRU(name);
            var cmd = "format_to_tei";
            var teimlfile = trjs.utils.headName(name) + "_chat" + version.SOFT_EXT;
            var data = {
                format: 'chat',
                file: codefn.encodeFilename(name),
                output: codefn.encodeFilename(teimlfile)
            };
            // console.log(data);
            fsio.formatToTei(data, function (r) {
                // console.log(r);
                serverLoadTeiml(teimlfile, loadMediaAfter, callback);
            }, function (data) {
                trjs.log.boxalert(trjs.messgs.converr1 + 'CLAN ' + name + trjs.messgs.converr2 + data.responseText + ')');
            });
        } else if (ext === '.trs') {
            if (trjs.param.level < 'level4') return;
            trjs.log.alert(trjs.messgs.convertfromtrs);
            fsio.setMRU(name);
            var cmd = "format_to_tei";
            var teimlfile = trjs.utils.headName(name) + "_trs" + version.SOFT_EXT;
            var data = {
                format: 'transcriber',
                file: codefn.encodeFilename(name),
                output: codefn.encodeFilename(teimlfile)
            };
            // console.log(data);
            fsio.formatToTei(data, function (r) {
                // console.log(r);
                serverLoadTeiml(teimlfile, loadMediaAfter, callback);
            }, function (data) {
                trjs.log.boxalert(trjs.messgs.converr1 + 'Transcriber ' + name + trjs.messgs.converr2 + data.responseText + ')');
            });
        } else if (ext === '.eaf') {
            if (trjs.param.level < 'level4') return;
            trjs.log.alert(trjs.messgs.convertfromelan);
            fsio.setMRU(name);
            var cmd = "format_to_tei";
            var teimlfile = trjs.utils.headName(name) + "_eaf" + version.SOFT_EXT;
            var data = {
                format: 'elan',
                file: codefn.encodeFilename(name),
                output: codefn.encodeFilename(teimlfile)
            };
            //console.log("start conversion eaf");
            //console.log(data);
            fsio.formatToTei(data, function (r) {
                // console.log(r);
                serverLoadTeiml(teimlfile, loadMediaAfter, callback);
            }, function (data) {
                trjs.log.boxalert(trjs.messgs.converr1 + 'ELAN ' + name + trjs.messgs.converr2 + data.responseText + ')');
            });
        } else if (ext === '.textgrid') {
            if (trjs.param.level < 'level4') return;
            trjs.log.alert(trjs.messgs.convertfrompraat);
            fsio.setMRU(name);
            var cmd = "format_to_tei";
            var teimlfile = trjs.utils.headName(name) + "_textgrid" + version.SOFT_EXT;
            var data = {
                format: 'praat',
                file: codefn.encodeFilename(name),
                output: codefn.encodeFilename(teimlfile)
            };
            //console.log("start conversion textgrid");
            //console.log(data);
            fsio.formatToTei(data, function (r) {
                // console.log(r);
                serverLoadTeiml(teimlfile, loadMediaAfter, callback);
            }, function (data) {
                trjs.log.boxalert(trjs.messgs.converr1 + 'TextGrid ' + name + trjs.messgs.converr2 + data.responseText + ')');
            });
        } else if (ext === '.txt') {
            trjs.log.alert(trjs.messgs.convertfromtxt);
            fsio.setMRU(name);
            serverLoadFile(name, function (err, data) {
                if (err >= 1) {
                    var s = trjs.messgs.errload + name;
                    if (data.indexOf('ENOENT') >= 0) s += trjs.messgs.errloadnotexist;
                    trjs.log.boxalert(s);
                } else if (err === 0) {
                    var teimlfile = trjs.utils.headName(name) + "_txt" + version.SOFT_EXT;
                    var cvt = trjs.transcription.convertFromTxtToCsv(data);
                    // console.log(cvt);
                    trjs.transcription.loadCsvIntoGrid(cvt, teimlfile);
                    trjs.data.setRecordingRealFile(teimlfile);
                    trjs.data.setNamesInWindow();
                    trjs.undo.clear();
                }
            });
        } else if (ext === '.csv') {
            trjs.log.alert(trjs.messgs.convertfromcsv);
            fsio.setMRU(name);
            serverLoadFile(name, function (err, data) {
                if (err >= 1) {
                    var s = trjs.messgs.errload + name;
                    if (data.indexOf('ENOENT') >= 0) s += trjs.messgs.errloadnotexist;
                    trjs.log.boxalert(s);
                } else if (err === 0) {
                    var teimlfile = trjs.utils.headName(name) + "_csv" + version.SOFT_EXT;
                    var cvt = trjs.transcription.readCsv(data);
                    // console.log(cvt);
                    trjs.transcription.loadCsvIntoGrid(cvt);
                    trjs.data.setRecordingRealFile(teimlfile);
                    trjs.data.setNamesInWindow();
                    trjs.undo.clear();
                }
            });
        } else if (ext === '.docx') {
            if (trjs.param.level < 'level4') return;
            trjs.log.alert(trjs.messgs.convertfromdocx);
            fsio.setMRU(name);
            var cmd = "format_to_tei";
            var teimlfile = trjs.utils.headName(name) + "_docx" + version.SOFT_EXT;
            var data = {
                format: 'docx',
                file: codefn.encodeFilename(name),
                output: codefn.encodeFilename(teimlfile)
            };
            // console.log(data);
            fsio.formatToTei(data, function (r) {
                // console.log(r);
                serverLoadTeiml(teimlfile, loadMediaAfter, callback);
            }, function (data) {
                trjs.log.boxalert(trjs.messgs.converr1 + 'Docx ' + name + trjs.messgs.converr2 + data.responseText + ')');
            });
        } else {
            var exts = version.BASIC_EXT.split('|');
            for (var i in exts) {
                if (exts[i] && name.endsWith(exts[i])) {
                    serverLoadTeiml(name, loadMediaAfter, callback);
                    return;
                }
            }
            trjs.log.boxalert(trjs.messgs.unkform + name);
        }
    }

    /**
     * load a transcrition from the server
     * @method serverLoadTeiml
     * @param name of file (on the server)
     * @param {boolean} later try loading media from TEI file info
     */
    function serverLoadTeiml(name, loadMediaAfter, callback) {
        //console.log("serverLoadTeiml "+loadMediaAfter);
        trjs.param.lastDataLocation = trjs.utils.pathName(name);
        trjs.data.setLastLoc(trjs.utils.pathName(name));
        trjs.data.setRecordingName(trjs.utils.lastName(name));
        trjs.data.setRecordingLoc(trjs.utils.pathName(name));
        // these two values above are set by the application automatically
        // according to the real names of the filenames
        fsio.setMRU(name);
        trjs.param.saveStorage();
        return serverLoadFile(name, function (err, data) {
            if (err === 1) {
                trjs.data.initRec();
                // maybe not really necessary but cleaning the data might be a good thing to do
                trjs.data.setInitialValues();
                trjs.transcription.loadNewGrid(false);
                // new transcript
                trjs.data.setNamesInWindow();
                trjs.undo.clear();
            } else if (err > 1) {
                var s = trjs.messgs.errload + name;
                if (data.indexOf('ENOENT') >= 0) s += trjs.messgs.errloadnotexist;
                trjs.log.boxalert(s);
            } else if (err === 0) {
                if (typeof data === 'object') {
                    trjs.data.doc = data;
                } else {
                    // get XML ready
                    var parser = new DOMParser();
                    trjs.data.doc = parser.parseFromString(data, "text/xml");
                }
                trjs.transcription.loadIntoGrid(loadMediaAfter);
                trjs.data.setRecordingRealFile(name);
                trjs.data.setNamesInWindow();
                trjs.undo.clear();
            }
            callback(err);
        });
    }

    /**
     * load a transcription
     * @method serverLoadFile
     * @param name of file
     * @param {boolean} later try loading media from TEI file info
     */
    function serverLoadFile(name, callback) {
        if (!name) {
            callback(1, null);
            return;
        }
        fsio.readFile(name,
            function(data) {
                callback(0, data);
            },
            function(data) {
                callback(2, data);
            }
        );
    }

    function finalizeLoadMedia() {
        trjs.media.resetMedia();
        trjs.media.setTime(0);
        trjs.editor.resizeTranscript();
        trjs.dmz.sliderPopulate();
    }

    /**
     * sets the audio : changes the html and load the audio
     */
    function setAudio() {
        trjs.data.setMediaType('audio');
        $('.span-media').css('display', 'inline');
        $('#media-display').html('<audio id="media-element" controls preload="auto" controls="controls">' +
            '<source id="mp3-src" src="" type="audio/mp3"></source><source id="wav-src" src="" type="audio/wav">' +
            '</source><source id="oga-src" src="" type="audio/ogg"></source></audio>');

        window.addEventListener('blur', function () {
            var mediaPlayer = document.getElementById("media-element");
            if (mediaPlayer) mediaPlayer.pause();
        });
    }

    function setAudioFilesVariants(name) {
        trjs.media.display('loaded');
        //console.log('setAudioFilesVariants '+name);
        var hname = trjs.utils.headName(name);
        if (trjs.param.cors === true) {
            $("#mp3-src")[0].src = codefn.fileFilename(hname + ".mp3");
            $("#wav-src")[0].src = codefn.fileFilename(hname + ".wav");
            $("#oga-src")[0].src = codefn.fileFilename(hname + ".oga");
        } else {
            $("#mp3-src")[0].src = codefn.encodeFilename(hname + ".mp3");
            $("#wav-src")[0].src = codefn.encodeFilename(hname + ".wav");
            $("#oga-src")[0].src = codefn.encodeFilename(hname + ".oga");
        }

        $('audio').on('error', function failed(e) {
            // audio playback failed - show a message saying why
            // to get the source of the audio element use $(this).src
            switch (e.target.error.code) {
                case e.target.error.MEDIA_ERR_ABORTED:
                    alert(trjs.messgs.mederrab);
                    break;
                case e.target.error.MEDIA_ERR_NETWORK:
                    alert(trjs.messgs.mederrnet);
                    break;
                case e.target.error.MEDIA_ERR_DECODE:
                    alert(trjs.messgs.mederrdec);
                    break;
                case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    alert(trjs.messgs.mederrsrc);
                    break;
                default:
                    alert(trjs.messgs.mederr);
                    break;
            }
        }, true);

    }

    function setAudioFileUniq(name) {
        trjs.media.display('loaded');
        /*
         * check quality requirement and apply
         */
        var ext = trjs.utils.extensionName(name);
        if (trjs.param.cors === true) {
            if (ext === '.mp3')
                $("#mp3-src")[0].src = codefn.fileFilename(name);
            else if (ext === '.wav')
                $("#wav-src")[0].src = codefn.fileFilename(name);
            else if (ext === '.oga' || ext === '.ogg')
                $("#oga-src")[0].src = codefn.fileFilename(name);
        } else {
            if (ext === '.mp3')
                $("#mp3-src")[0].src = codefn.encodeFilename(name);
            else if (ext === '.wav')
                $("#wav-src")[0].src = codefn.encodeFilename(name);
            else if (ext === '.oga' || ext === '.ogg')
                $("#oga-src")[0].src = codefn.encodeFilename(name);
        }

        $('#media-element').on('error', function failed(e) {
            // audio playback failed - show a message saying why
            // to get the source of the audio element use $(this).src
            switch (e.target.error.code) {
                case e.target.error.MEDIA_ERR_ABORTED:
                    alert(trjs.messgs.mederrab);
                    break;
                case e.target.error.MEDIA_ERR_NETWORK:
                    alert(trjs.messgs.mederrnet);
                    break;
                case e.target.error.MEDIA_ERR_DECODE:
                    alert(trjs.messgs.mederrdec);
                    break;
                case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    alert(trjs.messgs.mederrsrc);
                    break;
                default:
                    alert(trjs.messgs.mederr);
                    break;
            }
        }, true);
    }

    function setAudioFiles(name, obj) {
        $("#media-name").html(name + "/audio");
        $("#wav-src")[0].src = obj;
        $("#oga-src")[0].src = obj;
        $("#mp3-src")[0].src = obj;
    }

    function loadAudio() {
        //console.log('load ' + trjs.data.mediaRealFile());
        var a = $('#media-element');
        if (a && a.length > 0)
            a[0].load();
        trjs.data.setNamesInWindow();
        trjs.editor.resizeTranscript();
        if (trjs.data.currentBrowserName === 'Chrome') {
            // a[0].onloadedmetadata( trjs.editor.resizeTranscript );
            setTimeout(finalizeLoadMedia, 2000);
        } else {
            a.on('loadedmetadata', finalizeLoadMedia);
        }
    }

    /**
     * sets the video : changes the html and load the video
     */
    function setVideo() {
        trjs.data.setMediaType('video');
        $('.span-media').css('display', 'block');
        $('#media-display').html('<video id="media-element" preload="auto" controls="controls">' +
            '<source id="webm-src" src="" type="video/webm"></source>' +
            '<source id="mp4-src" src="" type="video/mp4"></source>' +
            '<source id="ogv-src" src="" type="video/ogg"></source></video>');

        window.addEventListener('blur', function () {
            var mediaPlayer = document.getElementById("media-element");
            if (mediaPlayer) mediaPlayer.pause();
        });
    }

    function setVideoFilesVariants(name) {
        trjs.media.display('loaded');
        //console.log('setVideoFilesVariants '+name);

        var hname = trjs.utils.headName(name);
        if (trjs.param.mode !== 'readwrite')
            $("#media-name").html(hname + "/video");
        if (trjs.param.cors === true) {
            // console.log('local: '+name);
            $("#mp4-src")[0].src = codefn.fileFilename(hname + ".mp4");
            $("#webm-src")[0].src = codefn.fileFilename(hname + ".webm");
            $("#ogv-src")[0].src = codefn.fileFilename(hname + ".ogv");
        } else {
            $("#mp4-src")[0].src = codefn.encodeFilename(hname + ".mp4");
            $("#webm-src")[0].src = codefn.encodeFilename(hname + ".webm");
            $("#ogv-src")[0].src = codefn.encodeFilename(hname + ".ogv");
        }

        //$("#mp4-src")[0].src = codefn.encodeFilename(name);
    }

    function setVideoFileUniq(name) {
        trjs.media.display('loaded');
        /*
         * check quality requirement and apply
         */
        var ext = trjs.utils.extensionName(name);
        if (trjs.param.cors === true) {
            if (ext === '.mp4') {
                $("#mp4-src").attr('src', codefn.fileFilename(name));
            } else if (ext === '.webm') {
                $("#webm-src")[0].src = codefn.fileFilename(name);
            } else if (ext === '.ogv' || ext === '.ogg') {
                $("#ogv-src")[0].src = codefn.fileFilename(name);
            }
        } else {
            if (ext === '.mp4')
                $("#mp4-src")[0].src = codefn.encodeFilename(name);
            else if (ext === '.webm')
                $("#webm-src")[0].src = codefn.encodeFilename(name);
            else if (ext === '.ogv' || ext === '.ogg')
                $("#ogv-src")[0].src = codefn.encodeFilename(name);
        }
    }

    function setVideoFiles(name, obj) {
        $("#media-name").html(name + "/video");
        $("#webm-src")[0].src = obj;
        $("#mp4-src")[0].src = obj;
        $("#ogv-src")[0].src = obj;
    }

    function loadVideo() {
        var a = $('#media-element');
        if (a && a.length > 0)
            a[0].load();
        trjs.data.setNamesInWindow();
        trjs.media.changeToDefault();
        // trjs.editor.resizeTranscript(); // done in change to default
        if (trjs.data.currentBrowserName === 'Chrome') {
            //		a[0].onloadedmetadata( trjs.editor.resizeTranscript );
            setTimeout(finalizeLoadMedia, 2000);
        } else {
            a.on('loadedmetadata', finalizeLoadMedia);
        }
    }

    var testMediaFormat = function (fn) {
        var ext = '|' + trjs.utils.extensionName(fn) + '|';
        ext = ext.toLowerCase();
        if (ext === '||')
            return 'none';
        if (version.BASIC_EXT.indexOf(ext) >= 0)
            return 'teiml';
        if (version.KNOWN_EXTENSIONS_TRANSCRIPTION_CONVERSIONS.indexOf(ext) >= 0)
            return 'otherTranscription';
        if (version.KNOWN_EXTENSIONS_AUDIO_HTML.indexOf(ext) >= 0)
            return 'html5MediaAudio';
        if (version.KNOWN_EXTENSIONS_AUDIO.indexOf(ext) >= 0)
            return 'otherMediaAudio';
        if (version.KNOWN_EXTENSIONS_VIDEO_HTML.indexOf(ext) >= 0)
            return 'html5MediaVideo';
        if (version.KNOWN_EXTENSIONS_VIDEO.indexOf(ext) >= 0)
            return 'otherMediaVideo';
        return 'unknown';
    };

    var tohtml240p = function (name) {
        var base = trjs.utils.headName2(name);
        return base + '-240p.mp4';
    };

    var tohtml480p = function (name) {
        var base = trjs.utils.headName2(name);
        return base + '-480p.mp4';
    };

    var tohtml720p = function (name) {
        var base = trjs.utils.headName2(name);
        return base + '-720p.mp4';
    };

    var tomp3 = function (name) {
        var base = trjs.utils.headName2(name);
        return base + '.mp3';
    };

    var towav = function (name) {
        var base = trjs.utils.headName2(name);
        return base + '.wav';
    };

    var convertMediaFile = function (name, flag) {
        // console.log('convertMediaFile: ' + name);
        if (trjs.param.level < 'level5') return;
        // ask the used for conversion or a new file
        var format = version.bestExtensionForBrowser(trjs.data.currentBrowserName, trjs.data.currentMajorVersion, 'html5MediaVideo');
        var m = {
            message: (flag === 'notcompat-load') ? (trjs.messgs.notcompatibleHTMLMedia1 + name + trjs.messgs.notcompatibleHTMLMedia2) : (trjs.messgs.convertMedia + name),
            title: (flag === 'notcompat-load') ? trjs.messgs.notcompatTitle : trjs.messgs.convertMediaTitle,
            buttons: {
                convertsmall: {
                    label: trjs.messgs.labelsmallvideo,
                    className: "btn-primary",
                    callback: function () {
                        // find one pgBox
                        var pgb1 = trjs.progress.find();
                        if (pgb1 === -1) {
                            trjs.log.boxalert(trjs.messgs.convnotst);
                            return;
                        }
                        trjs.progress.setIO(pgb1);
                        // starts waiting for messages
                        trjs.progress.closedefine(pgb1, function () {
                            console.log(trjs.messgs.endconv + tohtml240p(name));
                            if (flag === 'notcompat-load')
                                trjs.io.serverLoadMedia(tohtml240p(name));
                        });
                        fsio.convertToVideo({
                            format: format,
                            height: '240',
                            file: codefn.encodeFilename(name),
                            box: pgb1
                        }, function (r) {
                            // console.log('END POST: convert_to_video: ' + r);
                            trjs.log.alert(r.toString());
                        }, function (data) {
                            trjs.log.alert('convert_to_video: error: ' + data.status + ' ' + data.responseText);
                        });
                    }
                },
                convertmedium: {
                    label: trjs.messgs.labelmediumvideo,
                    className: "btn-primary",
                    callback: function () {
                        // find two pgBox
                        var pgb1 = trjs.progress.find();
                        if (pgb1 === -1) {
                            trjs.log.boxalert(trjs.messgs.convnotst);
                            return;
                        }
                        trjs.progress.setIO(pgb1);
                        // starts waiting for messages
                        trjs.progress.closedefine(pgb1, function () {
                            if (flag === 'notcompat-load')
                                trjs.io.serverLoadMedia(tohtml480p(name));
                        });
                        fsio.convertToVideo({
                            format: format,
                            height: '480',
                            file: codefn.encodeFilename(name),
                            box: pgb1
                        }, function (r) {
                            //console.log('END POST: convert_to_video: ' + r);
                            trjs.log.alert(r.toString());
                        }, function (data) {
                            trjs.log.alert('convert_to_video: error: ' + data.status + ' ' + data.responseText);
                        });
                    }
                },
                convertlarge: {
                    label: trjs.messgs.labellargevideo,
                    className: "btn-primary",
                    callback: function () {
                        // find two pgBox
                        var pgb1 = trjs.progress.find();
                        if (pgb1 === -1) {
                            trjs.log.boxalert(trjs.messgs.convnotst);
                            return;
                        }
                        trjs.progress.setIO(pgb1);
                        // starts waiting for messages
                        trjs.progress.closedefine(pgb1, function () {
                            if (flag === 'notcompat-load')
                                trjs.io.serverLoadMedia(tohtml720p(name));
                        });
                        fsio.convertToVideo({
                            format: format,
                            height: '720',
                            file: codefn.encodeFilename(name),
                            box: pgb1
                        }, function (r) {
                            //console.log('END POST: convert_to_video: ' + r);
                            trjs.log.alert(r.toString());
                        }, function (data) {
                            trjs.log.alert('convert_to_video: error: ' + data.status + ' ' + data.responseText);
                        });
                    }
                },
                convertaudio: {
                    label: trjs.messgs.labelaudio,
                    className: "btn-primary",
                    callback: function () {
                        // find two pgBox
                        var pgb1 = trjs.progress.find();
                        if (pgb1 === -1) {
                            trjs.log.boxalert(trjs.messgs.convnotst);
                            return;
                        }
                        trjs.progress.setIO(pgb1);
                        // starts waiting for messages
                        if (version.testExtensionForBrowser(trjs.data.currentBrowserName, trjs.data.currentMajorVersion, 'html5MediaAudio', '.mp3') === true) {
                            trjs.progress.closedefine(pgb1, function () {
                                //console.log('fini load: ' + tomp3(name));
                                if (flag === 'notcompat-load')
                                    trjs.io.serverLoadMedia(tomp3(name));
                            });
                            fsio.convertToAudio({
                                format: 'mp3',
                                file: codefn.encodeFilename(name),
                                box: pgb1
                            }, function (r) {
                                // console.log(r);
                                trjs.log.alert(r);
                            }, function (data) {
                                trjs.log.alert('convert_to_audio: error: ' + data.status + ' ' + data.responseText);
                            });
                        } else if (version.testExtensionForBrowser(trjs.data.currentBrowserName, trjs.data.currentMajorVersion, 'html5MediaAudio', '.wav') === true) {
                            trjs.progress.closedefine(pgb1, function () {
                                //console.log('fini load: ' + towav(name));
                                if (flag === 'notcompat-load' || flag === 'convert-load')
                                    trjs.io.serverLoadMedia(towav(name));
                            });
                            fsio.convertToAudio({
                                format: 'wav',
                                file: codefn.encodeFilename(name),
                                box: pgb1
                            }, function (r) {
                                // console.log(r);
                                trjs.log.alert(r);
                            }, function (data) {
                                trjs.log.alert('convert_to_audio: error: ' + data.status + ' ' + data.responseText);
                            });
                        }
                    }
                },
            },
        };
        if (flag === 'notcompat-load')
            m.buttons.otherfile = {
                label: trjs.messgs.labelotherfile,
                className: "btn-success",
                callback: function () {
                    fsio.chooseFile('media', 'media');
                }
            };
        m.buttons.cancel = {
            label: trjs.messgs.labelcancel,
            className: "btn-default",
            callback: function () {
                return;
            }
        };
        bootbox.dialog(m);
    };

    var askForNewMedia = function (name, mediaFormat) {
        if (trjs.param.level < 'level6') return;
        // first test if a correct file exist with another extension
        fsio.compatibleFiles({
            name: codefn.encodeFilename(name),
            browser: trjs.data.currentBrowserName,
            browserversion: trjs.data.currentMajorVersion,
            format: mediaFormat
        }, function (newname) {
            // console.log('retour de compat: ' + newname + ' ' + mediaFormat + ' for ' + name);
            // newname = codefn.decodeFilename(newname);
            if (newname !== '' && newname !== name) {
                trjs.log.alert(trjs.messgs.mediarepl1 + newname + trjs.messgs.mediarepl2 + name);
                trjs.io.serverLoadMedia(codefn.decodeFilename(newname));
                return;
            }
            if (mediaFormat === 'otherMediaVideo')
                convertMediaFile(name, 'notcompat-load');
            else if (newname === 'notcompatible')
            // ask the used for a new file
                bootbox.dialog({
                    message: (trjs.messgs.notcompatibleConvertHTMLMedia1 + name + trjs.messgs.notcompatibleConvertHTMLMedia2),
                    title: trjs.messgs.notcompatCompatibleTitle,
                    buttons: {
                        cancel: {
                            label: trjs.messgs.labelcancel,
                            className: "btn-default",
                            callback: function () {
                                return;
                            }
                        },
                        convert: {
                            label: trjs.messgs.labelconvert,
                            className: "btn-success",
                            callback: function () {
                                convertMediaFile(name, 'notcompat-load');
                            }
                        },
                        otherfile: {
                            label: trjs.messgs.labelotherfile,
                            className: "btn-success",
                            callback: function () {
                                $('#openfile').modal();
                                fsio.chooseFile('media', 'media');
                            }
                        },
                    }
                });
            else
            // ask the used for a new file
                bootbox.dialog({
                    message: (trjs.messgs.notcompatibleNotexist1 + name + trjs.messgs.notcompatibleNotexist2),
                    title: trjs.messgs.notcompatNotexistTitle,
                    buttons: {
                        cancel: {
                            label: trjs.messgs.labelcancel,
                            className: "btn-default",
                            callback: function () {
                                return;
                            }
                        },
                        otherfile: {
                            label: trjs.messgs.labelotherfile,
                            className: "btn-success",
                            callback: function () {
                                $('#openfile').modal();
                                fsio.chooseFile('media', 'media');
                            }
                        },
                    }
                });
        }, function (data) {
            trjs.log.alert('compatible_files: error: ' + data.status + ' ' + data.responseText + ' for ' + name);
        });
    };

    function finishMedia(name, mediaFormat, variants) {
        trjs.data.initMedia();
        trjs.data.setMediaRealFile(name);
        trjs.data.setNamesInEdit();
        trjs.data.isMediaReady = true;
        trjs.media.resetMedia();
        if (mediaFormat === 'html5MediaAudio') {
            // sets the audio
            setAudio();
            if (variants === true)
                setAudioFilesVariants(name);
            else
                setAudioFileUniq(name);
            loadAudio();
        } else if (mediaFormat === 'html5MediaVideo') {
            // sets the video
            setVideo();
            if (variants === true)
                setVideoFilesVariants(name);
            else
                setVideoFileUniq(name);
            loadVideo();
        }
        if (trjs.param.features.wave() === true)
            trjs.dmz.serverLoadWaveImage(name);
        var media = $('#media-element')[0].firstElementChild;
        if (media)
            media.addEventListener('timeupdate', trjs.media.timeUpdateListener, false);
    }

    /**
     * load a media file from a file name
     * @method serverLoadMedia
     * @param {file} name
     * */
    function serverLoadMedia(name, mediatype) {
        // console.log('XXX serverLoadMedia ' + name + ' ' + mediatype);
        trjs.data.isMediaReady = false;
        trjs.media.resetMedia();
        // clean the previous media, so if not loaded, this will be seen
        trjs.dmz.clear();
        // if there is no pathname, we create a pathnome
        var pn = trjs.utils.pathName(name);
        // console.log('++serverLoadMedia test pathname(' + name + ')=' + pn + ' ' + ((pn&&pn!=='.')?'pas pathname vide':'on rajoute le pathname du record'));
        if (pn !== '' && pn !== '.')
            trjs.data.setLastLoc(trjs.utils.pathName(name));
        else {
            if (name.indexOf('./') === 0)
                name = name.substr(2);
            if (trjs.data.recordingUrlPath)
                name = trjs.data.recordingUrlPath + '/' + name;
            else if (trjs.data.recordingLoc())
                name = trjs.data.recordingLoc() + '/' + name;
            else
                name = trjs.data.getLastLoc() + '/' + name;
            if (name.indexOf('//') >= 0)
                name = name.replace('/\/\\/g', '/');
        }

        // console.log('full path ready: ' + name);

        if (!name) return;
        var mediaFormat = testMediaFormat(name);
        // here we have a name for the media - so we find the format.
        // console.log('mediaFormat found ' + mediaFormat);
        /*
         * if the media format is not standard, then we try to adapt
         * if there is no extension, we try to add an extension
         * if this is no a standard type, then we try to find another file
         */
        if (mediaFormat === 'none') {
            if (mediatype === 'audio') {
                name += '.mp3';
                mediaFormat = 'html5MediaAudio';
            } else if (mediatype === 'video') {
                name += '.mp4';
                mediaFormat = 'html5MediaVideo';
            } else if (mediatype === undefined) {
                if (trjs.data.mediaType() === 'audio') {
                    name += '.mp3';
                    mediaFormat = 'html5MediaAudio';
                } else {
                    name += '.mp4';
                    mediaFormat = 'html5MediaVideo';
                }
            } else {
                trjs.log.boxalert(trjs.messgs.mednotcor);
                return;
            }
        } else if (mediaFormat !== 'html5MediaAudio' && mediaFormat !== 'html5MediaVideo') {// find another file
            // console.log('Not official media format : ask for another one');
            if (trjs.param.mode === 'readwrite')
                askForNewMedia(name, mediaFormat);
            return;
        }

        if (trjs.param.level <= 'level1') {
            // console.log('no media cheking in the server= ' + name);
            /*
             if (version.testExtensionForBrowser(trjs.data.currentBrowserName, trjs.data.currentMajorVersion, mediaFormat, trjs.utils.extensionName(name)) !== true) {
             var s = trjs.messgs.cbwarning1 + name + trjs.messgs.cbwarning2;
             // s += trjs.data.bestFormatForCurrentBrowser() + ' is the recommended format for your browser.';
             trjs.log.boxalert(s);
             }*/
            finishMedia(name, mediaFormat, true);  // use extension variants
        } else {
            // here we try to limit to the media compatible with the browser and test if the file exists
            // console.log('Normal mode: test quality of file. Default quality is : ' + trjs.param.mediaQuality() + ' ' + name + ' ' + trjs.data.currentBrowserName + ' ' + trjs.data.currentMajorVersion + ' ' + mediaFormat);
            fsio.testMediaFile({
                name: codefn.encodeFilename(name),
                browser: trjs.data.currentBrowserName,
                browserversion: trjs.data.currentMajorVersion,
                format: mediaFormat,
                quality: (trjs.param.useQuality ? trjs.param.mediaQuality() : '')
            }, function (data) {
                // console.log("serverLoadMedia: " + data + " " + name);
                if (data === '*notcompatible*') {
                    // var s = 'The media is not in a format compatible with the current browser. Please choose another media file or use another browser.';
                    // s += trjs.data.bestFormatForCurrentBrowser() + ' is the recommended format for your browser.';
                    // trjs.log.boxalert(s);
                    // ask the used for conversion or a new file
                    bootbox.dialog({
                        message: (trjs.messgs.notcompatibleConvertHTMLMedia1 + name + trjs.messgs.notcompatibleConvertHTMLMedia2),
                        title: trjs.messgs.notcompatNotexistTitle,
                        buttons: {
                            cancel: {
                                label: trjs.messgs.labelcancel,
                                className: "btn-default",
                                callback: function () {
                                    return;
                                }
                            },
                            otherfile: {
                                label: trjs.messgs.labelotherfile,
                                className: "btn-success",
                                callback: function () {
                                    $('#openfile').modal();
                                    fsio.chooseFile('media', 'media');
                                }
                            },
                        }
                    });

                } else if (data === '*notexist*') {
//					console.log("serverLoadMedia: " + data + " " + name);
                    trjs.log.boxalert(trjs.messgs.mednotex);
                } else if (data === '*error*') {
                    trjs.log.boxalert(trjs.messgs.mednotop);
                } else {
                    data = codefn.decodeFilename(data);
                    finishMedia(data, mediaFormat);
                }
            }, function (data) {
                // trjs.log.alert('test_media_file: error: ' + data.status + ' ' + data.responseText);
                // the absence of result will be visible
            });
        }
    }

    function setMediaNone() {
        $('#media-display').html('<div class="nomedia-div"><p class="nomedia-text">' + trjs.messgs.nomedia + '</p></div>');
        trjs.media.display('notloaded');
    }

    function initEmptyMedia(audio) {
        if (audio === true) {
            //setAudio();
            setMediaNone();
        } else {
            //setVideo();
            setMediaNone();
        }
    }

    /**
     * load a media file from the data in the transcription
     * @method serverLoadMediaRecording
     * @param {file} name
     * */
    function serverLoadMediaRecording() {
        // console.log('serverLoadMediaRecording [' + trjs.data.mediaRealFile() + ']');
        if (trjs.data.mediaRealFile())
            serverLoadMedia(trjs.data.mediaRealFile());
    }

    /**
     * save current file on the server
     * @method serverSave
     * @param {string} conditions
     */
    function serverSave(param) {
        if (trjs.param.level < 'level6') return;
        if (trjs.data.recordingName() == trjs.data.NEWRECNAME && param != 'nonew') {
            //trjs.log.alert(trjs.messgs.mustfn);
            trjs.io.doSaveAs();
            return;
        }
        if (trjs.param.checkAtSave)
            trjs.check.checkFinal();
        // console.log('SERVER SAVE');
        var s = (!trjs.data.transcriptInner) ? trjs.transcription.saveTranscriptToString() : trjs.data.transcriptInner;
        trjs.data.transcriptInner = null;
        // var dump = $('#dump1').text(s);
        fsio.saveTranscript({
            file: codefn.encodeFilename(trjs.data.recordingRealFile()),
            transcript: s,
            nbsave: trjs.param.nbversions
        }, function (data) {
            $("#save-server-response").html(data);
            trjs.param.change(false);
            trjs.local.put('saved', 'yes');
            trjs.log.alert(data);
        }, function (data) {
            console.log('save_transcript: error: ' + data.status + ' ' + data.responseText);
            trjs.log.alert('save_transcript: error: ' + data.status + ' ' + data.responseText);
        });
    }

    /**
     * save current file on the server in Transcriber format
     * @method exportTransLocal
     */
    function exportTransLocal(format) {
        if (trjs.param.level < 'level4') return;
        var s = innerSave();
        if (trjs.data.recordingName() === trjs.data.NEWRECNAME) {
            //trjs.log.boxalert(trjs.messgs.mustfn);
            trjs.io.doSaveAs();
        }
        fsio.teiToFormat({
            format: format,
            output: '*console*',
            transcript: s
        }, function (data) {
            // $("#save-server-response").html(data);
            trjs.param.change(false);
            trjs.local.put('saved', 'yes');
            // local export
            var blob = new Blob([s], {
                type: "text/plain;charset=utf-8"
            });
            // {type: 'text/css'});
            saveAs(blob, (trjs.data.recordingName() ? trjs.data.recordingName() : "export"));
        }, function (data) {
            trjs.log.alert('tei_to_format ' + format + ': error: ' + data.status + ' ' + data.responseText);
        });
    }

    /**
     * export current file on the server in a transcription format
     * check whether file exists or not and ask for new name if necessary
     * @method exportTrans
     */
    function exportTrans(format, fileoutput, force) {
        function saveTheFile(fname) {
            fsio.teiToFormat({
                format: format,
                output: codefn.encodeFilename(fname),
                transcript: s,
            }, function (data) {
                // $("#save-server-response").html(data);
                trjs.log.boxalert(trjs.messgs.exporttrans + format + trjs.messgs.exportname + fname);
            }, function (data) {
                trjs.log.boxalert(trjs.messgs.exporterror + " " + format + " " + data);
            });
        }
        $("#openexports").modal('hide');
        if (trjs.param.level < 'level6') return;
        var s = innerSave();
        if (trjs.data.recordingName() === trjs.data.NEWRECNAME) {
            //trjs.log.alert(trjs.messgs.mustfn);
            trjs.io.doSaveAs();
        }
        if (!fileoutput) fileoutput = trjs.utils.headName(trjs.data.recordingRealFile()) + version.MARK_EXT + (format);
        if (force === true) {
            saveTheFile(fileoutput);
            return;
        }
        fsio.testFileExists(fileoutput,
            function (mess) {
                // ask for new name
                try {
                    var fl = remote.dialog.showSaveDialog({
                        title: 'Export transcription file in ' + format + ' format',
                        defaultPath: fileoutput,
                        filters: [
                            { name: "Transcription files", extensions: ['cha', 'trs', 'eaf', 'textgrid'] },
                            { name: 'All Files', extensions: ['*'] }
                        ]
                    });
                    if (fl) {
                        saveTheFile(fl);
                    } else {
                        trjs.log.alert('export cancelled');
                    }
                } catch (error) {
                    console.log(error);
                    callback(1, error);
                }
            },
            function (mess) { // false
                saveTheFile(fileoutput);
            });
    }

    /**
     * save current file on the server in a transcription format
     * do not check for existing file (erase old file automatically)
     * @method saveToFormatTrans
     */
    function saveToFormatTrans(format) {
        $("#openexports").modal('hide');
        if (trjs.param.level < 'level6') return;
        var s = innerSave();
        if (trjs.data.recordingName() === trjs.data.NEWRECNAME) {
            //trjs.log.alert(trjs.messgs.mustfn);
            trjs.io.doSaveAs();
        }
        var fileoutput = trjs.utils.headName(trjs.data.recordingRealFile()) + (format);
        fsio.teiToFormat({
            format: format,
            output: codefn.encodeFilename(fileoutput),
            transcript: s,
        }, function (data) {
            // $("#save-server-response").html(data);
            trjs.log.boxalert(trjs.messgs.exporttrans + format + trjs.messgs.exportname + fileoutput);
        }, function (data) {
            trjs.log.boxalert(trjs.messgs.exporterror + " " + format + " " + data);
        });
    }

    /**
     * save current file in html format
     * @method htmlSave
     */
    function htmlSave() {
        var s = innerSave();
        var h = '<!DOCTYPE html ><html lang="en">' + $('html').html() + '</html>';
        // local export
        var blob = new Blob([h], {
            type: "text/plain;charset=utf-8"
        });
        // {type: 'text/css'});
        saveAs(blob, (trjs.data.recordingName() ? trjs.data.recordingName() : "export"));
    }

    /**
     * move a file on the server
     * @method moveRecording
     * @param {string} old real file
     * @param {string} new name or null if same name
     * @param {string} new location or null if same location
     */
    function moveRecording(oldrealname, newname, newloc) {
        if (trjs.param.level < 'level6') return;
        fsio.moveRecording({
            fromrealname: codefn.encodeFilename(oldrealname),
            toname: newname,
            toloc: codefn.encodeFilename(newloc)
        }, function (data) {
            if (data.indexOf(':error:') !== 0) {
                trjs.data.setRecordingRealFile(data);
                //				trjs.log.alert(trjs.messgs.filenm + codefn.decodeFilename(oldrealname) + trjs.messgs.movedto + codefn.decodeFilename(data) );
                trjs.log.alert(trjs.messgs.filenm + oldrealname + trjs.messgs.movedto + data);
                trjs.data.setNamesInWindow();
            } else {
                //				trjs.log.boxalert(trjs.messgs.cannotmove + codefn.decodeFilename(oldrealname) + ' -> ' + newname );
                trjs.log.boxalert(trjs.messgs.cannotmove + oldrealname + ' -> ' + newname);
            }
        });
    }

    /**
     * test if a file exists on the server
     * @method testFileExists
     * @param {string} file name
     * @param {function} action to do after test: first param of action: true (file exist) false (file do not exist) second param : name of file tested
     */
    function testFileExists(fn, action) {
        if (trjs.param.level < 'level6') return;
        fsio.testFileExists(codefn.encodeFilename(fn),
            function (data) {
                action(true, fn);
            },
            function (data) {
                action(false, fn);
            });
    }

    return {
        convertMediaFile: convertMediaFile,
        doSave: doSave,
        doSaveAs: doSaveAs,
        exportTrans: exportTrans,
        exportCsv: exportCsv,
        exportText: exportText,
        exportRtf: exportRtf,
        exportDocx: exportDocx,
        exportXlsx: exportXlsx,
        htmlSave: htmlSave,
        initEmptyMedia: initEmptyMedia,
        innerSave: innerSave,
        loadRecentFile: function (fn) {
            trjs.init.testNotSave(function (yesno) {
                if (yesno === true) {  // the user does not want to save the modified file or the file is not modified since last save
                    serverLoadTeiml(fn, true, function (err) {
                        if (!err)
                            trjs.editor.finalizeLoad();
                    });
                }
            });
        },
        localLoadMedia: localLoadMedia,
        localLoadTranscript: localLoadTranscript,
        localSave: localSave,
        mediaClear: function (p) {
            if (p === undefined)
                initEmptyMedia('audio');
            else
                initEmptyMedia(p);
        },
        moveRecording: moveRecording,
        serverLoadFile: serverLoadFile,
        serverLoadMedia: serverLoadMedia,
        serverLoadMediaRecording: serverLoadMediaRecording,
        serverLoadTranscript: serverLoadTranscript,
        serverSave: serverSave,
        testFileExists: testFileExists,
    };
})();
