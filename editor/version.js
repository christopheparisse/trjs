/*
 * version.js
 * @module version
 * @author Christophe Parisse
 * lists all versions and system configuration variables
 */

if (typeof exports !== 'undefined') {
    var version = exports;
    var path = require('path');
    var os = require('os');
} else {
    var version = {};
    var path = require('path');
    var os = require('os');
}

version.appName = 'TRJS';
version.version = 'v0.6.3';
version.versionLexFind = 'v0.2.0';
version.versionMediaTools = 'v0.1.0';
version.date = new Date(2018, 1, 16); // year, month, day : warning minus 1 (-1) for months : janvier === 0

version.preservedPages = 3;

/*
 * Default values correspoding to the local nodejs version
 */
version.lastPath = '/';
version.HTTP_PORT = 8101;
version.home = '/'; // for distant servers

/*
 * function that set version values for a certain type of server.
 */
version.setPhp = function (port, location, home) {
    /*
     * pour localhost:80
     */
    if (port === undefined)
        version.HTTP_PORT = 80;
    else
        version.HTTP_PORT = port;
    global.applicationTarget.location = (location) ? location : 'distant';
    global.applicationTarget.server = 'php';
    if (home !== undefined) version.home = home;
};

version.setNodeJs = function (port, location, home) {
    /*
     * pour localhost:8101
     */
    if (port === undefined)
        version.HTTP_PORT = 8101;
    else
        version.HTTP_PORT = port;
    global.applicationTarget.location = (location) ? location : 'local';
    global.applicationTarget.server = 'nodejs';
    if (home !== undefined) version.home = home;
};

version.setExpress = function (port, location, home) {
    /*
     * pour localhost:8103
     */
    if (port === undefined)
        version.HTTP_PORT = 8103;
    else
        version.HTTP_PORT = port;
    global.applicationTarget.location = (location) ? location : 'local';
    global.applicationTarget.server = 'express';
    if (home !== undefined) version.home = home;
};

version.setElectron = function (location, home) {
    /*
     * pour localhost:8103
     */
    global.applicationTarget.location = (location) ? location : 'electron';
    global.applicationTarget.server = 'electron';
    if (home !== undefined) version.home = home;
};

version.setNone = function () {
    global.applicationTarget.location = 'file';
    global.applicationTarget.server = 'none';
    version.home = '/';
}

version.WEB_ADDRESS = function () {
    return 'http://localhost:' + version.HTTP_PORT;
};
version.SOFT_EXT = '.trjs';
version.MARK_EXT = '.tei_corpo';
version.BASIC_EXT = '|.teiml|.xml|' + version.SOFT_EXT + '|';
version.FULL_EXT = version.MARK_EXT + version.SOFT_EXT;
version.KNOWN_EXTENSIONS_AUDIO_HTML = '|.oga|.mp3|.wav|';
version.KNOWN_EXTENSIONS_AUDIO = '|.oga|.mp3|.wav|.aiff|.aif|.aac|.m4a|';
version.KNOWN_EXTENSIONS_VIDEO_HTML = '|.mp4|.ogv|.webm|';
version.KNOWN_EXTENSIONS_VIDEO = '|.mp4|.mov|.mpeg|.mpg|.avi|.mkv|.ogv|.webm|.flv|.vob|.ts|.mts|.ogg|';
version.KNOWN_EXTENSIONS_MEDIA = version.KNOWN_EXTENSIONS_AUDIO + version.KNOWN_EXTENSIONS_VIDEO;
version.KNOWN_EXTENSIONS_TRANSCRIPTION_CONVERSIONS = '|.cha|.trs|.eaf|.textgrid|';
version.KNOWN_EXTENSIONS_TRANSCRIPTIONS = version.BASIC_EXT + version.KNOWN_EXTENSIONS_TRANSCRIPTION_CONVERSIONS;
version.KNOWN_EXTENSIONS = version.BASIC_EXT + version.KNOWN_EXTENSIONS_TRANSCRIPTION_CONVERSIONS + version.KNOWN_EXTENSIONS_MEDIA;
version.KNOWN_EXTENSIONS_SUP = '-240p|-480p|-720p|-1080p';
version.WAVESAMPLINGINITIAL = 1000;
version.WAVESAMPLINGMAX = 8000;
version.WAVESAMPLING = version.WAVESAMPLINGINITIAL;

version.trjsLoc = function () {
    var htmlTrjsPath = process.cwd().replace(/\\/g, '/');
    console.log("ffmpegdirLoc:type " + global.applicationTarget.type);
    console.log("ffmpegdirLoc:process " + htmlTrjsPath);
    console.log("ffmpegdirLoc:dirname " + __dirname);
    if (__dirname !== undefined) {
        var dirname = __dirname.replace(/\\/g, '/');
        console.log('dirname (v2) ', dirname);
        if (dirname.indexOf('app.asar') > 0) {
            htmlTrjsPath = dirname.substring(0, dirname.indexOf('app.asar')-1);
        } else if (dirname.indexOf('/editor') > 0 || dirname.indexOf('/node') > 0)
            htmlTrjsPath = dirname + "/..";
        else
            htmlTrjsPath = dirname;
    } else {
        console.log('process');
        // nothing to do
    }
    console.log('path= ' + htmlTrjsPath);
    return htmlTrjsPath;
};

version.ffmpegdirLoc = function () {
    return version.trjsLoc() + "/tools";
};

version.javaLoc = function () {
    if (os.platform() === 'win32') {
        if (os.arch() === 'x64')
            return version.ffmpegdirLoc() + "/java-x64/bin/java.exe";
        else
            return version.ffmpegdirLoc() + "/java-x86/bin/java.exe";
    } else if (os.platform() === 'darwin') {
//		if (os.release() < '14.1.0')
        return version.ffmpegdirLoc() + "/java-osx/bin/java";
//		else
//			return version.ffmpegdirLoc() + "/java-osx3264";
    } else if (os.platform() === 'linux') {
        return "java";
    }
};

version.ffmpegLoc = function () {
    if (os.platform() === 'win32') {
        if (os.arch() === 'x64')
            return version.ffmpegdirLoc() + "/ffmpeg-x64.exe";
        else
            return version.ffmpegdirLoc() + "/ffmpeg-x86.exe";
    } else if (os.platform() === 'darwin') {
        if (os.release() < '14.1.0')
            return version.ffmpegdirLoc() + "/ffmpeg_10_6";
        else
            return version.ffmpegdirLoc() + "/ffmpeg";
    } else if (os.platform() === 'linux') {
        return "ffmpeg";
    }
};

version.ffprobeLoc = function () {
    if (os.platform() === 'win32') {
        if (os.arch() === 'x64')
            return version.ffmpegdirLoc() + "/ffprobe-x64.exe";
        else
            return version.ffmpegdirLoc() + "/ffprobe-x86.exe";
    } else if (os.platform() === 'darwin') {
        if (os.release() < '14.1.0')
            return version.ffmpegdirLoc() + "/ffprobe_10_6";
        else
            return version.ffmpegdirLoc() + "/ffprobe";
    } else if (os.platform() === 'linux') {
        return "ffprobe";
    }
};

var debugList = {};
version.setDebug = function (fn, setting) {
    if (typeof path === 'object' && path.basename !== undefined)
        fn = path.basename(fn);
    else
        fn = trjs.utils.lastName(fn);
    if (setting)
        debugList[fn] = true;
    else
        debugList[fn] = undefined;
};

version.debug = function (fn) {
    if (debugList['__all__'] === true) return true;
    if (typeof path === 'object' && path.basename !== undefined)
        fn = path.basename(fn);
    else
        fn = trjs.utils.lastName(fn);
    return debugList[fn] === true;
};

version.serverCommand = function (name) {
    if (version.serverImpl === 'node.js')
        return name + '.js';
    else if (version.serverImpl === 'php')
        return name + '.php';
    else {
        console.log('unimplemented server type');
        if (trjs && trjs.log)
            trjs.log.alert('unimplemented server type');
    }
};

version.testExtensionForBrowser = function (browser, browserversion, format, realext) {
    var l = version.allExtensionForBrowser(browser, browserversion, format);
    if (l.indexOf(realext.substr(1)) >= 0)
        return true;
    else
        return false;
};

version.bestExtensionForBrowser = function (browser, browserversion, format) {
    return version.allExtensionForBrowser(browser, browserversion, format)[0];
};

version.allExtensionForBrowser = function (browser, browserversion, format) {
    // console.log('allExtensionForBrowser ' + browser + ' ' + browserversion);
    if (browser.indexOf('Chrome') >= 0) { // chrome style
        if (format === 'html5MediaAudio')
            return ['wav', 'mp3'];
        else
            return ['mp4', 'webm'];
    } else if (browser.indexOf('Firefox') >= 0) { // firefox style
        if (format === 'html5MediaAudio')
            return ['wav', 'oga'];
        else {
            if (browserversion == 34)
                return ['webm', 'ogv'];
            if (browserversion >= 35)
                return ['mp4', 'webm', 'ogv'];
            return ['ogv'];
        }
    } else if (browser.indexOf('Microsoft Internet Explorer') >= 0) { // internet explorer style
        if (format === 'html5MediaAudio')
            return ['mp3'];
        else
            return ['mp4'];
    } else if (browser.indexOf('Safari') >= 0) { // chrome style
        if (format === 'html5MediaAudio')
            return ['mp3'];
        else
            return ['mp4'];
    } else {
        if (format === 'html5MediaAudio')
            return ['wav'];
        else
            return ['mp4'];
    }
    return false;
};

var qualities = "(.*)([\-_\.](master|240p|480p|576p|720p|1080p|4K))\.(wav|mp3|oga|mp4|webm|ogv|ogg)$";

version.stripQuality = function (hname) {
    /*
     * remove quality information if present
     */
    var re = new RegExp(qualities);
    var nh = re.exec(hname);
    if (nh)
        return nh[1] + '.' + nh[4];
    return hname;
};

version.getQuality = function (hname) {
    /*
     * get quality information if present
     */
    var re = new RegExp(qualities);
    var nh = re.exec(hname);
    if (nh)
        return nh[3];
    else
        return '';
};

version.addQualityFuzzy = function (hname, quality) {
    if (quality === '') return hname;
    /*
     * add quality information
     */
    var re = new RegExp(qualities);
    var nh = re.exec(hname);
    if (nh)
        return nh[1] + '[\-_\.]' + quality + '.' + nh[4];
    else {
        re = new RegExp("(.*)\.(wav|mp3|oga|mp4|webm|ogv|ogg)$");
        nh = re.exec(hname);
        if (nh)
            return nh[1] + '-' + quality + '.' + nh[2];
    }
    return hname + '[\-_\.]' + quality;
};

version.inferiorQuality = function (quality) {
    // master|240p|480p|576p|720p|1080p|4K
    if (quality === '4K' || quality === 'master')
        return '1080p';
    if (quality === '1080p')
        return '720p';
    if (quality === '720p')
        return '576p';
    if (quality === '576p')
        return '480p';
    if (quality === '480p')
        return '240p';
    return '';
};

version.listQuality = function () {
    return ['master', '240p', '480p', '576p', '720p', '1080p', '4K'];
};

version.generateName = function (dir, prefix, suffix) {
    var now = new Date();
    var name = [prefix,
        '-',
        now.getYear(), now.getMonth(), now.getDate(),
        '-',
        process.pid,
        '-',
        (Math.random() * 0x100000000 + 1).toString(36),
        suffix].join('');
    return path.join(dir, name);
};
