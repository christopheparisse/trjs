/**
 * <p>Parameters for the software</p>
 * date: august 2013
 * @module Params
 * @author Christophe Parisse
 */

/**
 * data to store the parameters of the current editor
 * these parameters are stored in localStorage
 */

var trjsFormatCHAT = 'CHAT';
var trjsFormatXMLTEI = 'XMLTEI';
var trjsFormatNone = 'None';

/**
 * variable to contains all data about the transcription (to be removed in future versions)
 * @constructor trjs.param
 */
trjs.param = {
    language: 'fra',
    checkLanguage: 'fr-FR',
    versionFormat: "0.4",
    modeinsert: false,
    showLinkTime: true,
    backwardskip: 3.0,
    forwardskip: 3.0,
    number: false,
    nbversions: 3,
    formatTime: "0:00:00",
    nbdigits: 0,
    goLine: null,
    goTime: null,
    goPlay: false,
    __changed: false,
    change: function(val) {
        this.__changed = val;
        var remote = require('electron').remote;
        var id = remote.getCurrentWindow().id;
        for (var i=0; i < remote.process.listWindows.length; i++) {
            if (remote.process.idWindows[i] === id) {
                remote.process.ischangedWindows[i] = val;
                return;
            }
        }
        if (val === true) {
            trjs.local.put('crashed', 'yes');
        } else {
            trjs.local.put('crashed', 'no');
        }
    },
    ischanged: function() {
        return this.__changed;
    },
    locnames: true,
    isContinuousPlaying: false,
    showPartition: true,
    showWave: true,
    videoHeight: 240, // default height of the video
    lastDataLocation: '', // last value for the location of the data to be opened on the server (local or distant)
    restart: '',
    useQuality: true,
    medQuality: '', // quality of diffusion of the media, if it is available
    warningLocalTranscript: true,
    warningLocalMedia: true,
    checkAtSave: true,
    reorder: false,
    showMedia: true,
    alwaysCheckOverlap: false,
    nbRecentFiles: 4,
    decalagePxProp: 5,
    nbVisible: 3,
    MINHEIGHTTRANSCRIPT: 500,
    NORMALHEIGHTTRANSCRIPT: 800,
    paletteFile: false,
    paletteEdit: false,
    final: true,
    wavesampling: version.WAVESAMPLINGINITIAL,
    format: trjsFormatCHAT, // CHAT or XMLTEI or None
    exportSaveAs: false,
    reloadLastFile: false,

    mode: 'readwrite',

    location: 'local',
    // local --> renomage des fichiers locaux en /*local*/ et décodage pour l'affichage mais pas pour les pages html
    //	location: racine des données sur le serveur local - décidée par le serveur
    // distant --> aucun renomage : les vhost sont gérés par le serveur
    //	location: un vhost ou l'adresse principale du site - décidée par le serveur

    server: 'nodejs',
    // server: php, nodejs, express --> utile pour les astuces techniques (encodage des noms de fichiers par exemple)

    level: 'level6',
    // values for levels
    // level0 no special server: distant teiml and media - no $.post working
    // level1 partition display
    // level2 media quality choice, read different formats of transcription
    // level3 subtitle extraction, local saveas clan, transcriber
    // level4 wave visualisation
    // level5 media conversion - choice of media extension
    // level6 file open and save choice - file conversion and export (user the server)

    /*
     * list of the server calls
     * $.get(filename) --> loading a normal file --> returns text content
     * $.get('operation=...', json) --> get information about local files --> returns json
     * $.post('convert_to_shortaudio', json) --> convert media in raw audio format --> raw audio filename
     * $.post('read_binary_file', json) --> load binary file --> data
     * $.post('update_check', json) --> check update files --> status
     * $.post('update_clean', json) --> clean up update files --> status
     * $.post('export_media_subt', json) --> create a part of media file with subtitles --> status
     * $.post('export_media', json) --> create a part of a media file --> status
     * $.post('format_to_tei', json) --> convert between file and tei --> status
     * $.post('convert_to_media', json) --> convert video files --> status
     * $.post('convert_to_audio', json) --> convert audio files --> status
     * $.post('compatible_files', json) --> find video files that might correspond to the file required --> name of file or status
     * $.post('test_media_file', json) --> find video files with right format and quality -->  name of file or status
     * $.post('save_transcript', json) --> save file on server --> status
     * $.post('teiml_to', json) --> convert tei file to other formats --> text content or status
     * $.post('tei_to_format', json) --> save file on server in xxx format --> status
     * $.post('save_file', json) --> save file on server  --> status
     * $.post('save_transcript', json) --> save teifile on server  --> status
     * $.post('move_recording', json) --> rename file --> status
     * $.post('test_file_exists', json) --> test if file exists --> status
     */

    init: function (modify, location, server, level) {

        trjs.messgs_init();

        $('.dropdown-submenu > a').submenupicker();
        trjs.param.mode = (modify) ? modify : 'readwrite';
        trjs.param.location = (location) ? location : 'local';
        trjs.param.server = (server) ? server : 'nodejs';
        trjs.param.level = (level) ? level : 'level6';
        if (trjs.param.server === 'nodejs')
            version.setNodeJs(8101, trjs.param.location);
        else if (trjs.param.server === 'express')
            version.setExpress(8103, trjs.param.location);
        else if (trjs.param.server === 'electron')
            version.setElectron(trjs.param.location);
        else if (trjs.param.server === 'php')
            version.setPhp(80, trjs.param.location);
        else if (trjs.param.server === 'none')
            version.setNone();
        else
            alert('unknown server type: ' + server);

        if (trjs.param.mode !== 'readwrite') {
            $('#id-files-readwrite').hide();
            $('#id-edit-cut').hide();
            $('#id-edit-paste').hide();
            $('#id-edit-divider1').hide();
            $('#id-edit-undo').hide();
            $('#id-tools').hide();
            $('#id-files-readonly').show();
        } else {
            $('#id-files-readonly').hide();
        }
        if (trjs.param.level <= 'level0')
            trjs.param.features.settingsT();
        else if (trjs.param.level <= 'level3')
            trjs.param.features.settingsTP();
        else
            trjs.param.features.settingsTPW();

        if (trjs.param.level <= 'level2') {
            $('#id-edit-mediasubt').hide();
            $('#id-edit-media').hide();
        }

        trjs.local.init();
        trjs.param.loadStorage();
        trjs.keys.init();
        version.WAVESAMPLING = trjs.param.wavesampling;

        trjs.editor.init();
        if (trjs.param.level >= 'level2' && global.applicationTarget.type !== 'electron' && filetree) {
            filetree.init();
        }
        if (trjs.param.server === 'electron') {
            trjs.init.electronkeyboard();
        }

        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        $('#myTab a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

        $('#myTab2 a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

        $('#aidecontext').hide();

        /*
         * set the timing for checking new updates
        if (trjs.param.level >= 'level1' && trjs.param.server !== 'express' && trjs.param.server !== 'nodejs') {
            setTimeout(trjs.editor.updateCheck, 2 * 60 * 1000); // check two minutes after initial start
            setInterval(trjs.editor.updateCheck, 6 * 60 * 60 * 1000); // every six hours
        }
         */
        trjs.param.spelling();
    },

    resetDefault: function () {
        this.language = 'fra';
        this.checkLanguage = 'fr-FR';
        this.versionFormat = "0.4";
        this.modeinsert = false;
        this.showLinkTime = true;
        this.backwardskip = 3.0;
        this.forwardskip = 3.0;
        this.number = false;
        this.nbversions = 2;
        this.formatTime = "0:00:00";
        this.nbdigits = 0;
        this.locnames = true;
        this.showPartition = true;
        this.showWave = true;
        this.videoHeight = 240; // default height of the video
        this.lastDataLocation = ''; // last value for the location of the data to be opened on the server (local or distant)
        this.useQuality = true; // automatic use of quality
        this.medQuality = ''; // quality of diffusion of the media, if it is available
        this.checkAtSave = true;
        this.reorder = false;
        this.showMedia = true;
        this.recentfiles = [];
        this.nbRecentFiles = 4;
        this.paletteFile = false;
        this.paletteEdit = false;
        this.reloadLastFile = false;
        this.final = true;
        this.format = trjsFormatCHAT;
        this.wavesampling = 4000;
    },
    resetWarnings: function () {
        this.warningLocalTranscript = true;
        this.warningLocalMedia = true;
        this.saveStorage();
    },

    setMediaQuality: function (arg) {
        this.medQuality = arg;
        trjs.param.saveStorage();
    },
    mediaQuality: function () {
        return this.medQuality;
    },

    loadStorage: function () {
        if (!trjs.local.id) {
            trjs.param.resetDefault();
            return;
        }
        this.language = this.testUndefString(trjs.local.get('param_language'), "fra");
        this.checkLanguage = this.testUndefString(trjs.local.get('param_checklanguage'), 'fr-FR');
        this.modeinsert = this.testUndefBoolean(trjs.local.get('param_modeinsert'), false);
        this.number = this.testUndefBoolean(trjs.local.get('param_number'), false);
        this.locnames = this.testUndefBoolean(trjs.local.get('param_locnames'), false);
        this.backwardskip = this.testUndefFloat(trjs.local.get('param_backwardskip'), 3.0);
        this.forwardskip = this.testUndefFloat(trjs.local.get('param_forwardskip'), 3.0);
        this.param_nbversions = this.testUndefInt(trjs.local.get('param_nbversions'), 3);
        this.formatTime = this.testUndefString(trjs.local.get('param_formatTime'), "0:00:00");
        this.showPartition = this.testUndefBoolean(trjs.local.get('param_showPartition'), true);
        this.showWave = this.testUndefBoolean(trjs.local.get('param_showWave'), true);
        this.showLinkTime = this.testUndefBoolean(trjs.local.get('param_showLinkTime'), true);
        this.versionFormat = this.testUndefString(trjs.local.get('param_versionFormat'));
        this.nbdigits = this.testUndefInt(trjs.local.get('param_nbdigits'), 0);
        this.nbRecentFiles = this.testUndefInt(trjs.local.get('param_nbRecentFiles'), 4);
        this.videoHeight = this.testUndefInt(trjs.local.get('param_videoHeight'), 240);
        this.mediaTime = this.testUndefFloat(trjs.local.get('param_mediaTime'), 0);
        this.lastDataLocation = this.testUndefString(trjs.local.get('param_lastDataLocation'), '');
        this.restart = this.testUndefString(trjs.local.get('param_restart'), '');
        this.lastversion = this.testUndefString(trjs.local.get('param_lastversion'), '');
        this.useQuality = this.testUndefBoolean(trjs.local.get('param_useQuality'), true);
        this.medQuality = this.testUndefString(trjs.local.get('param_medQuality'), '');
        this.warningLocalTranscript = this.testUndefBoolean(trjs.local.get('param_warningLocalTranscript'), true);
        this.warningLocalMedia = this.testUndefBoolean(trjs.local.get('param_warningLocalMedia'), true);
        this.checkAtSave = this.testUndefBoolean(trjs.local.get('param_checkAtSave'), true);
        // this.reorder = this.testUndefBoolean(trjs.local.get('param_reorder'), false);
        this.showMedia = this.testUndefBoolean(trjs.local.get('param_showMedia'), true);
        this.paletteFile = this.testUndefBoolean(trjs.local.get('param_paletteFile'), false);
        this.paletteEdit = this.testUndefBoolean(trjs.local.get('param_paletteEdit'), false);
        this.reloadLastFile = this.testUndefBoolean(trjs.local.get('param_reloadLastFile'), false);
        this.nbVisible = this.testUndefInt(trjs.local.get('param_nbVisible'), 3);
        this.final = this.testUndefBoolean(trjs.local.get('param_final'), true);
        this.format = this.testUndefString(trjs.local.get('param_format'), trjsFormatCHAT);
        this.wavesampling = this.testUndefInt(trjs.local.get('param_wavesampling'), version.WAVESAMPLINGINITIAL);
        if (this.wavesampling > version.WAVESAMPLINGMAX) this.wavesampling = version.WAVESAMPLINGMAX;
        var rf = this.testUndefString(trjs.local.get('param_recentfiles'), '');
        if (rf === '')
            this.recentfiles = [];
        else
            this.recentfiles = JSON.parse(rf);
    },

    saveStorage: function () {
        if (!trjs.local.id)
            trjs.local.init();
        trjs.local.put('param_language', this.language);
        trjs.local.put('param_checklanguage', this.checkLanguage);
        trjs.local.put('param_modeinsert', this.modeinsert);
        trjs.local.put('param_backwardskip', this.backwardskip);
        trjs.local.put('param_forwardskip', this.forwardskip);
        trjs.local.put('param_number', this.number);
        trjs.local.put('param_locnames', this.locnames);
        trjs.local.put('param_nbversions', this.nbversions);
        trjs.local.put('param_formatTime', this.formatTime);
        trjs.local.put('param_showPartition', this.showPartition);
        trjs.local.put('param_showWave', this.showWave);
        trjs.local.put('param_showLinkTime', this.showLinkTime);
        trjs.local.put('param_versionFormat', this.versionFormat);
        trjs.local.put('param_nbdigits', this.nbdigits);
        trjs.local.put('param_nbRecentFiles', this.nbRecentFiles);
        trjs.local.put('param_videoHeight', this.videoHeight);
        trjs.local.put('param_lastDataLocation', this.lastDataLocation);
        trjs.local.put('param_restart', this.restart);
        trjs.local.put('param_lastversion', this.lastversion);
        trjs.local.put('param_useQuality', this.useQuality);
        trjs.local.put('param_medQuality', this.medQuality);
        trjs.local.put('param_warningLocalTranscript', this.warningLocalTranscript);
        trjs.local.put('param_warningLocalMedia', this.warningLocalMedia);
        trjs.local.put('param_checkAtSave', this.checkAtSave);
        // trjs.local.put('param_reorder', this.reorder);
        trjs.local.put('param_showMedia', this.showMedia);
        trjs.local.put('param_paletteFile', this.paletteFile);
        trjs.local.put('param_paletteEdit', this.paletteEdit);
        trjs.local.put('param_reloadLastFile', this.reloadLastFile);
        trjs.local.put('param_nbVisible', this.nbVisible);
        trjs.local.put('param_final', this.final);
        trjs.local.put('param_wavesampling', this.wavesampling);
        trjs.local.put('param_format', this.format);

        var media = $('#media-display')[0].firstElementChild;
        if (media) {
            trjs.local.put('param_mediaTime', this.currentTime);
            this.mediaTime = media.currentTime;
        }
        trjs.local.put('param_recentfiles', JSON.stringify(this.recentfiles));
    },

    testUndefFloat: function (val, def) {
        if (val == undefined)
            return def;
        if (val == 'NaN')
            return def;
        var t = parseFloat(val);
        if (val == NaN)
            return def;
        return t;
    },

    testUndefInt: function (val, def) {
        if (val == undefined)
            return def;
        if (val == 'NaN')
            return def;
        var t = parseInt(val);
        if (val == NaN)
            return def;
        return t;
    },

    testUndefBoolean: function (val, def) {
        if (val == undefined)
            return def;
        if (val == 'false')
            return false;
        return true;
    },

    testUndefString: function (val, def) {
        if (val == undefined)
            return def;
        if (val == 'undefined')
            return def;
        return val;
    },


    setTooltip: function() {
        $('[data-toggle="tooltip"]').tooltip({
            animation: true,
            delay: { show: 50, hide: 10 }
        });
        $("button").on("mousedown", function() {
            $('[data-toggle="tooltip"]').tooltip("hide");
        });
        $('[data-toggle="tooltip"]').on("mouseleave", function() {
            $('[data-toggle="tooltip"]').tooltip("hide");
        });
    },

// version control: list of features available
    // they should not be used to display or hide the partition and wave (which is a temporary choice)
    // but to avoid loading these elements if they are not necessary or the computer is slow
    // or to control the available version
    features: {
        settings: '-textual-partition-wave-',  // default
        settingsTPW: function () {
            this.settings = '-textual-partition-wave-';
        },
        settingsTP: function () {
            this.settings = '-textual-partition-';
            trjs.wave = null; // delete all wave function from memory. -- setting cannot be called
            // twice because we cannot (yet) reload in the sources in realtime - page reload is mandatory
            $('#askforwave').hide();
        },
        settingsT: function () {
            this.settings = '-textual-';
        },
        value: function (val) {
            if (val === undefined) return this.settings;
            this.settings = val;
        },
        // possible values: '-textual-partition-wave-interlinear-readonly-'
        partition: function () {
            return this.settings.indexOf('-partition-') < 0 ? false : true;
        },
        wave: function () {
            return this.settings.indexOf('-wave-') < 0 ? false : true;
        },
    },

    /* ajusting the different blocs of display
     * first bloc: media/wave/slider-wave
     * second bloc: partition/transcription/slider-partition
     * three possible situations
     * bloc: time of media <=> time of transcription
     * control: time of media <= time of transcription but not opposite
     * free: time of media != time of transcription
     */
    synchro: {
        setting: 'control', // possible values: block, control, free
        check: function (p, val) {
            if (p === true) {
                if (val === 'block') {
                    this.setting = val;
                } else if (val === 'free') {
                    this.setting = val;
                } else if (val === 'control') {
                    this.setting = val;
                } else
                    return false;
                return true;
            }
            return (this.setting === val) ? true : false;
        },
        block: function (p) {
            return this.check(p, 'block');
        },
        control: function (p) {
            return this.check(p, 'control');
        },
        free: function (p) {
            return this.check(p, 'free');
        },
        init: function (p) {
            this.setting = 'control';
        },
        swap: function (e) {
            if (trjs.param.synchro.setting === 'control')
                trjs.param.synchro.check(true, 'block');
            else if (trjs.param.synchro.setting === 'block')
                trjs.param.synchro.check(true, 'free');
            else
                trjs.param.synchro.check(true, 'control');
        },
        witch: function() {
            return this.setting;
        }
    },
};

trjs.param.spelling = function() {
    var SpellChecker = require('electron-spellchecker');
    var SpellCheckHandler = SpellChecker.SpellCheckHandler;
    var ContextMenuListener = SpellChecker.ContextMenuListener;
    var ContextMenuBuilder = SpellChecker.ContextMenuBuilder;

    /*
    var SpellCheckHandler = require('./lib/spell-check-handler').default;
    var ContextMenuListener = require('./lib/context-menu-listener').default;
    var ContextMenuBuilder = require('./lib/context-menu-builder').default;
    */

    window.spellCheckHandler = new SpellCheckHandler();
    setTimeout(function() { window.spellCheckHandler.attachToInput(); } , 1000);

// Start off as US English
    window.spellCheckHandler.switchLanguage(trjs.param.checkLanguage);
//window.spellCheckHandler.provideHintText('This is probably the language that you want to check in');
//window.spellCheckHandler.autoUnloadDictionariesOnBlur();

    var contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler, null, true);
    var contextMenuListener = new ContextMenuListener(function (info) {
        contextMenuBuilder.showPopupMenu(info);
    });
}
