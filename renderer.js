// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

// Start off as US English, America #1 (lol)
window.spellCheckHandler.switchLanguage(trjs.param.checkLanguage);
//window.spellCheckHandler.provideHintText('This is probably the language that you want to check in');
//window.spellCheckHandler.autoUnloadDictionariesOnBlur();

var contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler, null, true);
var contextMenuListener = new ContextMenuListener(function (info) {
        contextMenuBuilder.showPopupMenu(info);
});
