/* global tableEdit */

'use strict';

var ipcRenderer = require('electron').ipcRenderer;

trjs.init.electronkeyboard = function () {
    // load previous data
    /*
    try {
        if (localStorage.previousKeyboard) {
            var js = JSON.parse(localStorage.previousKeyboard);
        }
    } catch (error) {
    }
    */
    /*
     $('body').keydown(bodyKeys);
     */
    ipcRenderer.on('debug', function(event, arg) {
        console.log(event, arg);
    });
    ipcRenderer.on('newtranscript', function(event, arg) {
        trjs.transcription.loadNewGrid(true);
    });
    ipcRenderer.on('opentranscript', function(event, arg) {
        fsio.chooseFile('transcript', 'transcript');
    });
    ipcRenderer.on('readtranscript', function(event, arg) {
        trjs.init.testNotSave(function (yesno) {
            if (yesno === true) {  // the user does not want to save the modified file or the file is not modified since last save
                if (typeof arg === 'object') {
                    if (arg.commandline.length > 1 && arg.commandline[1] !== 'index.js')
                        fsio.openTranscript(0, arg.commandline[1]);
                    else if (arg.commandline.length > 2)
                        fsio.openTranscript(0, arg.commandline[2]);
                } else {
                    fsio.openTranscript(0, arg);
                }
            }
        });
    });
    ipcRenderer.on('openmedia', function(event, arg) {
        fsio.chooseFile('media', 'media');
    });
    ipcRenderer.on('save', function(event, arg) {
        trjs.io.doSave();
    });
    ipcRenderer.on('saveas', function(event, arg) {
        trjs.io.doSaveAs();
    });
    ipcRenderer.on('innersave', function(event, arg) {
        trjs.io.innerSave();
    });
    ipcRenderer.on('clearmru', function(event, arg) {
        fsio.clearMRU();
    });
    ipcRenderer.on('wndzoomin', function(event, arg) {
        trjs.editor.zoomGlobalIn();
    });
    ipcRenderer.on('wndzoomout', function(event, arg) {
        trjs.editor.zoomGlobalOut();
    });
    ipcRenderer.on('wndzoomreset', function(event, arg) {
        trjs.editor.zoomGlobalReset();
    });
    ipcRenderer.on('export', function(event, arg) {
        $("#openexports").modal();
    });
    ipcRenderer.on('showparameters', function(event, arg) {
        $("#openparam").modal();
    });
    ipcRenderer.on('checktranscript', function(event, arg) {
        trjs.check.checkFinal();
    });
    ipcRenderer.on('insert', function(event, arg) {
        trjs.events.insertLine();
    });
    ipcRenderer.on('delete', function(event, arg) {
        trjs.events.deleteLine();
    });
    ipcRenderer.on('insertmacro', function(event, arg) {
        trjs.macros.generic();
    });
    ipcRenderer.on('undo', function(event, arg) {
        trjs.undo.undo();
    });
    ipcRenderer.on('undolist', function(event, arg) {
        trjs.undo.undoList();
    });
    ipcRenderer.on('redo', function(event, arg) {
        trjs.undo.redo();
    });
    ipcRenderer.on('showhidemsel', function(event, arg) {
        trjs.transcription.setMultipleSelection();
    });
    ipcRenderer.on('selectmsel', function(event, arg) {
        trjs.transcription.selectAllMS();
    });
    ipcRenderer.on('deselectmsel', function(event, arg) {
        trjs.transcription.deselectAllMS();
    });
    ipcRenderer.on('cutmsel', function(event, arg) {
        trjs.transcription.cutMultipleSelection();
    });
    ipcRenderer.on('copymsel', function(event, arg) {
        trjs.transcription.copyMultipleSelection();
    });
    ipcRenderer.on('pastemsel', function(event, arg) {
        trjs.transcription.pasteMultipleSelection();
    });
    ipcRenderer.on('parameters', function(event, arg) {
        trjs.editor.showParams();
    });
    ipcRenderer.on('showmeta', function(event, arg) {
        trjs.editor.showMetadata();
    });
    ipcRenderer.on('showpart', function(event, arg) {
        trjs.editor.showParticipant();
    });
    ipcRenderer.on('showtemp', function(event, arg) {
        trjs.editor.showTemplate();
    });
    ipcRenderer.on('palettefile', function(event, arg) {
        trjs.palette.file();
    });
    ipcRenderer.on('paletteedit', function(event, arg) {
        trjs.palette.edit();
    });
    ipcRenderer.on('check', function(event, arg) {
        trjs.check.checkFinal();
    });
    ipcRenderer.on('shifttime', function(event, arg) {
        trjs.transcription.doShiftTimeLinks();
    });
    ipcRenderer.on('mediaconvert', function(event, arg) {
        fsio.chooseFile('media', 'mediaconvert');
    });
    ipcRenderer.on('search', function(event, arg) {
        trjs.editor.showSearch();
    });
    ipcRenderer.on('helpstart', function(event, arg) {
        trjs.editor.goHelpStart();
    });
    ipcRenderer.on('helptranscribe', function(event, arg) {
        trjs.editor.goHelpTranscribe();
    });
    ipcRenderer.on('helpedit', function(event, arg) {
        trjs.editor.goHelpEdit();
    });
    ipcRenderer.on('helpimportexport', function(event, arg) {
        trjs.editor.goHelpImportExport();
    });
    ipcRenderer.on('helpparams', function(event, arg) {
        trjs.editor.goHelpParams();
    });
    ipcRenderer.on('help', function(event, arg) {
        trjs.editor.goHelp();
    });
    ipcRenderer.on('helpfirststeps-eng', function(event, arg) {
        trjs.editor.goHelpFirstSteps('eng');
    });
    ipcRenderer.on('helpfirststeps-fra', function(event, arg) {
        trjs.editor.goHelpFirstSteps('fra');
    });
    // message-bindings
    ipcRenderer.on('messagebindings', function(event, arg) {
        trjs.keys.viewKeyBindings();
    });
    // trjs.macros.generic
    ipcRenderer.on('macros', function(event, arg) {
        trjs.macros.generic();
    });
    ipcRenderer.on('messages', function(event, arg) {
        trjs.log.show();
    });
    ipcRenderer.on('resetmessages', function(event, arg) {
        trjs.param.resetWarnings();
    });
    ipcRenderer.on('about', function(event, arg) {
        trjs.editor.about();
    });
};
