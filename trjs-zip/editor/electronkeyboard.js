/* global tableEdit */

'use strict';

const ipcRenderer = require('electron').ipcRenderer;

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
    ipcRenderer.on('newtranscript', function(event, arg) {
        trjs.transcription.loadNewGrid(true);
    });
    ipcRenderer.on('opentranscript', function(event, arg) {
        fsio.chooseFile('transcript', 'transcript');
    });
    ipcRenderer.on('readtranscript', function(event, arg) {
        fsio.openTranscript(0, arg);
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
    ipcRenderer.on('export', function(event, arg) {
        $("#openexports").modal();
    });
    ipcRenderer.on('showparameters', function(event, arg) {
        $("#openparam").modal();
    });
    ipcRenderer.on('insert', function(event, arg) {
        trjs.event.insertLine();
    });
    ipcRenderer.on('delete', function(event, arg) {
        trjs.event.deleteLine();
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
        trjs.events.checkFinal();
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
    ipcRenderer.on('helplocal', function(event, arg) {
        trjs.editor.goHelpLocal();
    });
    ipcRenderer.on('help', function(event, arg) {
        trjs.editor.goHelp();
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
