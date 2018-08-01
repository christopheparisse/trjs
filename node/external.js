/**
 * conversion between external formats and teiml
 * move file to garbage
 * clean garbarge files
 * save file to disk
 * @author Christophe Parisse
 * @date october 2013
 */

var fs = require('fs');
var path = require('path');
var glob = require("glob");
var childproc = require('child_process');
var filelookup = require('./filelookup.js');
var docx = require("../js/teidocx.js");
var teiTools = require("../js/teiconverttools.js");
/*
var version = require('../editor/version.js');
var codefn = require('../editor/codefn.js');
*/

function chattotei() {
    return '"' + version.javaLoc() + '" -cp "' + version.ffmpegdirLoc() + '/conversions.jar" fr.ortolang.teicorpo.ClanToTei';
};
function elantotei() {
    return '"' + version.javaLoc() + '" -cp "' + version.ffmpegdirLoc() + '/conversions.jar" fr.ortolang.teicorpo.ElanToTei';
};
function trstotei() {
    return '"' + version.javaLoc() + '" -cp "' + version.ffmpegdirLoc() + '/conversions.jar" fr.ortolang.teicorpo.TranscriberToTei';
};
function praattotei() {
    return '"' + version.javaLoc() + '" -cp "' + version.ffmpegdirLoc() + '/conversions.jar" fr.ortolang.teicorpo.PraatToTei';
};

/**
 * @method format_to_tei
 * @param {string} format
 * @param filein
 * @param fileout
 * @param callback
 */
exports.format_to_tei = function (format, filein, fileout, callback) {
    filein = codefn.decodeFilename(filein);
    fileout = codefn.decodeFilename(fileout);
    try {
        var fin = fs.realpathSync(filein);
        // var fout = fs.realpathSync(fileout);
    } catch (error) {
        console.log('Error on the conversion of ' + filein + ' to ' + fileout);
        return;
    }
    if (format === 'chat')
        var cmd = chattotei() + ' -i "' + fin + '" -o "' + fileout + '"';
    else if (format === 'elan')
        var cmd = elantotei() + ' -i "' + fin + '" -o "' + fileout + '"';
    else if (format === 'praat')
        var cmd = praattotei() + ' -i "' + fin + '" -o "' + fileout + '"';
    else if (format === 'transcriber')
        var cmd = trstotei() + ' -i "' + fin + '" -o "' + fileout + '"';
    else if (format === 'docx') {
        try {
            if (version.debug(__filename)) console.log('docx readfile');
            var docxContent = fs.readFileSync(fin);
            if (version.debug(__filename)) console.log("XXXX" + typeof docxContent);
            if (version.debug(__filename)) console.log(docxContent);
            var tei = teiTools.docxToTEI(docxContent);
            if (version.debug(__filename)) console.log('now write to : ' + fileout);
            fs.writeFileSync(fileout, tei, function (err) {
                if (err)
                    callback(1, "error saving to " + fileout);
                else
                    callback(0, "saved to " + fileout);
            });
        } catch (error) {
            console.log('caught error');
            console.log(error);
            callback(1, error); // .toString());
        }
        return;
    }
    //if (version.debug(__filename))
    console.log(cmd);

    // executes cmd
    childproc.exec(cmd, function (error, stdout, stderr) {
        //console.log('stdout: ' + stdout);
        //console.log('stderr: ' + stderr);
        if (error !== null) {
            // the command has failed
            // tries to find another java executable ?
            if (version.debug(__filename)) console.log('exec error: ' + error);
        }
        callback(error, stdout);
    });
};

exports.extendedExtname = function (name) {
    var ext = path.extname(name);
    var base = path.basename(name, ext);
    var listofext = version.KNOWN_EXTENSIONS_SUP.split('|');
    for (var i in listofext) {
        if (base.lastIndexOf(listofext[i]) === (base.length - listofext[i].length))
            return listofext[i] + ext;
    }
    return ext;
};

exports.compatible_files = function (file, browser, browserversion, format, callback) {
    try {
        if (version.debug(__filename)) console.log('compatible files ' + file);
        var fn = fs.realpathSync(codefn.decodeFilename(file));
        if (version.debug(__filename)) console.log('compatible files ' + fn);
        var dir = path.dirname(fn);
        if (version.debug(__filename)) console.log('compatible files ' + dir);
        var contents = fs.readdirSync(dir);
    } catch (error) {
        console.log('no compatible file (' + file + ') ' + error.toString());
        callback(1, 'cannot read directory');
        return;
    }
    var base = path.basename(fn, path.extname(fn));
    for (var c in contents) {
        var f = contents[c];
        if (f.indexOf('.') === 0) continue;
        if (f.indexOf(exports.shortAudioWav) !== -1) continue;
        if (f.indexOf(exports.shortAudioRaw) !== -1) continue;
        try {
            var stat = fs.statSync(path.join(dir, f));
        } catch (error) {
            // ignore error
            // (callback)(1, 'error ' + error + ' on file ' + path.join(dir, f) );
            console.log('error ' + error + ' on file ' + path.join(dir, f));
            continue;
        }
        if (stat.isFile()) {
            var extf = exports.extendedExtname(f);
            var realext = path.extname(f);
            var basef = path.basename(f, extf);
            if (version.debug(__filename)) console.log('TEST: ' + f + ' - []' + extf + '[] -- []' + realext + '[]');
            if (version.debug(__filename)) console.log('TEST2: ' + basef + '[] -- []' + base + '[]');
            if (basef === base) { // same base file name with extended extensions
                console.log('FOUND COMPATIBLE check browser for format and extension ' + format + ' ' + realext);
                var ok = version.testExtensionForBrowser(browser, browserversion, format, realext);
                if (ok) {
                    console.log('FOUND COMPATIBLE for browser ' + browser + ' ' + browserversion + ' ' + filelookup.addslash(dir) + f);
                    callback(0, codefn.encodeFilename(filelookup.addslash(dir) + f));
//					callback(0, filelookup.addslash(dir) + f);
                    return;
                }
            }
        }
    }
    ;
    // if not found
    var ok = version.testExtensionForBrowser(browser, browserversion, format, path.extname(file));
    if (ok)
        callback(0, '');
    else
        callback(0, 'notcompatible');
};

exports.test_media_file = function (file, browser, browserversion, format, quality, callback) {
    // this function check whether the file exists with the correct format for the browser and try to find another file is the extension is incorrect (done by do_test_media_file)
    if (version.debug(__filename)) console.log('TEST_media_file ' + file + ' ' + browser + ' ' + browserversion + ' ' + format + ' ' + quality);
    if (format === 'html5MediaAudio') {
        // audio - test only one format but no qualities
        // the format wav vs. mp3 is choosen by the caller no here
        var r = do_test_media_file(file, browser, browserversion, format);
        if (r.indexOf('*') !== 0) {
            callback(0, r);
        } else
            callback(0, r);
        return;
    }
    if (quality === '') {
        // check if the file exists with no quality
        if (version.debug(__filename)) console.log('TEST_media_file with no quality: ' + file);
        var r = do_test_media_file(file, browser, browserversion, format);
        if (r.indexOf('*') !== 0) {
            callback(0, r);
            return;
        } else
            quality = 'master'; // now test existing files for all qualities starting with higher quality
    }
    if (version.debug(__filename)) console.log('test all qualites starting with ' + quality);
    var fn = version.addQualityFuzzy(file, quality);
    if (version.debug(__filename)) console.log('initial quality: ' + quality + ' ' + fn);
    var r = do_test_media_file(fn, browser, browserversion, format, 'fuzzy');
    if (r.indexOf('*') !== 0) {
        callback(0, r);
    } else if (r === '*notcompatible*') {
        if (version.debug(__filename)) console.log('find a media with a smaller quality');
        // find a media with a smaller quality
        for (quality = version.inferiorQuality(quality); ; quality = version.inferiorQuality(quality)) {
            fn = version.addQualityFuzzy(file, quality);
            if (version.debug(__filename)) console.log('inferior quality: ' + quality + ' ' + fn);
            r = do_test_media_file(fn, browser, browserversion, format, 'fuzzy');
            if (r.indexOf('*') !== 0) {
                callback(0, r);
                return;
            }
            if (quality === '') break;
        }
        callback(0, '*notexist*');
    } else
        callback(0, r);
};

var do_test_media_file = function (file, browser, browserversion, format, fuzzy) {
    try {
        if (version.debug(__filename)) console.log('test_media_file (xxx) ' + file + ' ' + codefn.decodeFilename(file));
        if (version.debug(__filename)) console.log('do_test_media_file ' + fn + ' ' + browser + ' ' + browserversion + ' ' + format + ' ' + fuzzy);
        // var fn = fs.realpathSync(codefn.decodeFilename(file));
        var fn = codefn.decodeFilename(file);
        var realext = path.extname(fn);
        var allext = version.allExtensionForBrowser(browser, browserversion, format);

        if (version.debug(__filename)) console.log('test media file --> ' + fn + ' ' + browser + ' ' + format + ' ' + realext + ' ' + allext);
        // console.log(allext);

        if (allext.indexOf(realext.substr(1)) >= 0) {
            if (fuzzy === 'fuzzy') {
                var mf = glob.glob.sync(fn);
                if (mf.length >= 1)
                    return codefn.encodeFilename(mf[0]);
            } else {
                if (fs.existsSync(fn))
                    return codefn.encodeFilename(fn);
            }
        }
        // now test other extensions
        if (version.debug(__filename)) console.log('TEST EXT');
        for (e in allext) {
            if (version.debug(__filename)) console.log('test of ' + allext[e]);
            if (allext[e] === realext.substr(1)) continue; // do not test again
            var newfn = fn.substr(0, fn.length - realext.length + 1) + allext[e];
            if (version.debug(__filename)) console.log('test of ' + newfn + ' ' + fn);
            if (fuzzy === 'fuzzy') {
                var mf = glob.glob.sync(newfn);
                if (mf.length >= 1)
                    return codefn.encodeFilename(mf[0]);
            } else {
                if (fs.existsSync(newfn))
                    return codefn.encodeFilename(newfn);
            }
//			if (fs.existsSync(newfn))
//				return codefn.encodeFilename(newfn);
        }

        if (allext.indexOf(realext.substr(1)) >= 0)
            return '*notexist*';
        else
            return '*notcompatible*';
    } catch (error) {
        console.log('no test_media_file (' + file + ') ' + error.toString());
        return '*error*';
    }
};

exports.test_file_exists = function (fn, callback) {
    // console.log('test de ' + fn + ' ' + codefn.decodeFilename(fn));
    if (fs.existsSync(codefn.decodeFilename(fn)))
        callback(0, 'true');
    else
        callback(0, 'false');
};

function teitotrs() {
    return '"' + version.javaLoc() + '" -cp "' + version.ffmpegdirLoc() + '/conversions.jar" fr.ortolang.teicorpo.TeiToTranscriber';
};
function teitochat() {
    return '"' + version.javaLoc() + '" -cp "' + version.ffmpegdirLoc() + '/conversions.jar" fr.ortolang.teicorpo.TeiToClan';
};
function teitoelan() {
    return '"' + version.javaLoc() + '" -cp "' + version.ffmpegdirLoc() + '/conversions.jar" fr.ortolang.teicorpo.TeiToElan';
};
function teitopraat() {
    return '"' + version.javaLoc() + '" -cp "' + version.ffmpegdirLoc() + '/conversions.jar" fr.ortolang.teicorpo.TeiToPraat';
};

/**
 * @method tei_to_format
 * @param {string} format
 * @param {string} teiml filename
 * @param {string} content of teiml file
 */
exports.tei_to_format = function (format, transcript, output, callback) {
    try {
        if (version.debug(__filename)) console.log('TEI_TO_FORMAT ' + format + ' ' + output);
        // CREATE TEMP FiLE for transcript
        var dirpath = filelookup.getUserHome() + '/temp';
        // console.log('test de ' + dirpath);
        if (!fs.existsSync(dirpath)) fs.mkdir(dirpath);
        var tempfn = dirpath + '/temporary' + version.SOFT_EXT;
        if (version.debug(__filename)) console.log('ecriture de ' + tempfn);
        fs.writeFileSync(tempfn, transcript);

        if (format === 'clan' || format === '.cha') {
            var extension = '.cha';
        } else if (format === 'elan' || format === '.eaf') {
            var extension = '.eaf';
        } else if (format === 'praat' || format === '.textgrid') {
            var extension = '.textgrid';
        } else if (format === 'transcriber' || format === '.trs') {
            var extension = '.trs';
        }
        if (version.debug(__filename)) console.log(extension);

        // create temporary name for output if result in console
        if (output !== '*console*') {
            var fileout = codefn.decodeFilename(output);
        } else {
            var fileout = version.generateName(dirpath, 'tei_to_format', extension);
        }

        if (extension === '.cha') {
            var cmd = teitochat() + ' -i "' + tempfn + '" -o "' + fileout + '"';
        } else if (extension === '.eaf') {
            var cmd = teitoelan() + ' -i "' + tempfn + '" -o "' + fileout + '"';
        } else if (extension === '.textgrid') {
            var cmd = teitopraat() + ' -i "' + tempfn + '" -o "' + fileout + '"';
        } else if (extension === '.trs') {
            var cmd = teitotrs() + ' -i "' + tempfn + '" -o "' + fileout + '"';
        }
        if (version.debug(__filename)) console.log(cmd);

        if (version.debug(__filename)) console.log(fileout);
        // executes cmd
        child = childproc.exec(cmd, function (error, stdout, stderr) {
            if (version.debug(__filename)) console.log('stdout: ' + stdout);
            if (version.debug(__filename)) console.log('stderr: ' + stderr);
            if (error !== null) {
                if (version.debug(__filename)) console.log('exec error: ' + error);
            }
            if (output === '*console*' && error === 0)
                callback(0, fs.readFileSync(fileout, {encoding: 'utf8'}));
            else if (error === 0)
                callback(error, 'conversion finished');
            else
                callback(error, stdout);
        });
    } catch (error) {
        // Path does not exist, it is ok
        callback(1, 'error: cannot save temporary file before conversion to transcriber' + tempfn);
        return;
    }
};

exports.create_dir = function (dir, file, callback) {
    try {
        var dest = dir + '/' + file;
        if (fs.existsSync(dest)) {
            callback(1, 'error: folder ' + dest + ' exists already ');
            return;
        }
        fs.mkdirSync(dest);
        callback(0, dest + " was created.");
    } catch (error) {
        // Path does not exist, it is ok
        callback(1, 'error: cannot create folder ' + dest);
        return;
    }
};

exports.save_file = function (file, data, callback) {
    if (version.debug(__filename)) console.log('Save path and file: ' + file);
    file = codefn.decodeFilename(file);
    filepath = path.dirname(file);
    if (filepath.indexOf(codefn.UNKNOWNDIR) != -1 || filepath.indexOf(codefn.LOCALDIR) != -1) {
        var ln = path.basename(file);
        filepath = filelookup.getUserHome();
        file = path.join(filepath, ln);
    }
    try {
        var filename = fs.realpathSync(file);
        var stat = fs.statSync(filename);
        if (stat.isDirectory()) {
            callback(1, 'error: try to write a directory on saving ' + file);
            return;
        }
    } catch (error) {
        // Path does not exist, it is ok
        filename = file;
    }
    if (version.debug(__filename)) console.log('saveFile ' + filename);
    try {
        fs.writeFile(filename, data, function (err) {
            if (err)
                callback(1, "error saving to " + filename);
            else
                callback(0, "saved to " + filename);
        });
    } catch (e) {
        callback(1, "error saving to " + filename);
    }
}

exports.save_transcript = function (file, nbs, transcript, callback) {
    if (version.debug(__filename)) console.log('ST path and file: ' + file + ' #' + nbs);
    file = codefn.decodeFilename(file);
    filepath = path.dirname(file);
    if (filepath.indexOf(codefn.UNKNOWNDIR) != -1 || filepath.indexOf(codefn.LOCALDIR) != -1) {
        var ln = path.basename(file);
        filepath = filelookup.getUserHome();
        file = path.join(filepath, ln);
    }
    try {
        var filename = fs.realpathSync(file);
        var stat = fs.statSync(filename);
        if (stat.isDirectory()) {
            callback(1, 'error: try to write a directory on saving ' + file);
            return;
        }
    } catch (error) {
        // Path does not exist, it is ok
        filename = file;
    }
    if (version.debug(__filename)) console.log('saveas ' + filename + ' nbs=' + nbs);
    var ext = path.extname(filename);
    var base = path.join(filepath, path.basename(filename, ext));
    var i = 0;
    if (nbs < 1) {
        do {
            i++;
            filename = base + "(" + i + ")" + ext;
        } while (fs.existsSync(filename));
        try {
            fs.writeFile(filename, transcript, function (err) {
                if (err)
                    callback(1, "error saving to " + filename);
                else
                    callback(0, "saved to " + filename);
            });
        } catch (e) {
            callback(1, "error saving to " + filename);
        }
        return;
    } else {
        if (nbs == 1) {
            /* delete last file */
            var tf = base + "_backup1" + ext;
            if (fs.existsSync(tf)) fs.unlinkSync(filename);
            try {
                fs.renameSync(filename, tf);
                /* rename the only file */
                fs.writeFile(filename, transcript, function (err) {
                    if (err)
                        callback(1, "error saving to " + filename);
                    else
                        callback(0, "saved to " + filename + " - backup to " + tf);
                });
            } catch (e) {
                callback(1, "error saving to " + filename);
            }
            return;
        } else if (nbs == 2) {
            /* delete last file */
            var etat = 0;
            var tf2 = base + "_backup2" + ext;
            try {
                if (fs.existsSync(tf2)) {
                    fs.unlinkSync(tf2);
                    etat++;
                }
                var tf1 = base + "_backup1" + ext;
                if (fs.existsSync(tf1)) {
                    fs.renameSync(tf1, tf2);
                    etat++;
                }
                if (fs.existsSync(filename)) {
                    fs.renameSync(filename, tf1);
                    /* rename the only file */
                    etat++;
                }
                fs.writeFile(filename, transcript, function (err) {
                    if (err)
                        callback(1, "error saving to " + filename);
                    else {
                        if (etat > 0)
                            callback(0, "saved to " + filename + " - backup to " + tf1 + " (+" + etat + " files)");
                        else
                            callback(0, "saved to " + filename + " - no backup yet ");
                    }
                });
            } catch (e) {
                callback(1, "error saving to " + filename);
            }
            return;
        } else {
            /* delete last file */
            // console.log('nbs := 3');
            var etat = 0;
            var tf3 = base + "_backup3" + ext;
            try {
                if (fs.existsSync(tf3)) {
                    fs.unlinkSync(tf3);
                    //console.log('tf3');
                    etat++;
                }
                var tf2 = base + "_backup2" + ext;
                if (fs.existsSync(tf2)) {
                    fs.renameSync(tf2, tf3);
                    //console.log('tf2');
                    etat++;
                }
                var tf1 = base + "_backup1" + ext;
                if (fs.existsSync(tf1)) {
                    fs.renameSync(tf1, tf2);
                    //console.log('tf1');
                    etat++;
                }
                if (fs.existsSync(filename)) {
                    fs.renameSync(filename, tf1);
                    /* rename the only file */
                    //console.log('tf0');
                    etat++;
                }
                // console.log('write to ' + filename);
                fs.writeFile(filename, transcript, function (err) {
                    if (err)
                        callback(1, "error saving to " + filename);
                    else {
                        if (etat > 0)
                            callback(0, "saved to " + filename + " - backup to " + tf1 + " (+" + etat + " files)");
                        else {
                            if (etat > 1)
                                callback(0, "saved to " + filename + " - backup to " + tf1 + " (+" + etat + " files)");
                            else if (etat == 1)
                                callback(0, "saved to " + filename + " - backup to " + tf1);
                            else
                                callback(0, "saved to " + filename + " - no backup yet ");
                        }
                    }
                });
            } catch (e) {
                callback(1, "error saving to " + filename);
            }
            return;
        }
    }
};

/**
 * @method convert_to_shortaudio
 * @param {string} input filename
 * @param {function} callback
 */
exports.convert_to_shortaudio = function (file, callback) {
    file = codefn.decodeFilename(file);
    if (version.debug(__filename))
        console.log("convert wave short file audio: " + file);
    try {
        var fin = fs.realpathSync(file);
    } catch (error) {
        if (version.debug(__filename))
            console.log('Error on the conversion of ' + file + ' to wave short file audio :' + error.toString());
        callback(1, 'Error on the conversion of ' + file + ' to wave short file audio :' + error.toString());
    }

    var ext = path.extname(fin);
    var basedisp = path.basename(fin, ext);
    var base = path.join(path.dirname(fin), basedisp);

    // rawVersion
    var audioname = base + filelookup.shortAudioRaw;
    if (fs.existsSync(audioname)) {
        if (version.debug(__filename))
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

    //if (version.debug(__filename))
        console.log(version.ffmpegLoc() + ' ' + cmd1.join(' '));
    //callFFMPEG(base, basedisp, myio, '-shortdisplay.wav', box, cmd1);
    var ffmpeg = childproc.spawn(version.ffmpegLoc(), cmd1);
    ffmpeg.stdout.on('data', function (data) {
        if (version.debug(__filename)) console.log('short wave: ffmpeg stdout: ' + data);
    });
    ffmpeg.stderr.on('data', function (data) {
        if (version.debug(__filename)) console.log('short wave: ffmpeg stderr: ' + data);
    });
    ffmpeg.on('close', function (code) {
//		if (version.debug(__filename))
        console.log('short wave: FFMPEG process exited with code ' + code);
        callback(code, codefn.encodeFilename(audioname)); // 'conversion to wave short file audio ended');
    });
};
