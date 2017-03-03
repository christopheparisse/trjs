// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var SpellChecker = require('electron-spellchecker');
var SpellCheckHandler = SpellChecker.SpellCheckHandler;
var ContextMenuListener = SpellChecker.ContextMenuListener;
var ContextMenuBuilder = SpellChecker.ContextMenuBuilder;

window.spellCheckHandler = new SpellCheckHandler();
window.spellCheckHandler.attachToInput();

// Start off as US English, America #1 (lol)
window.spellCheckHandler.switchLanguage(trjs.param.checkLanguage);

var contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler);
var contextMenuListener = new ContextMenuListener(function (info) {
        contextMenuBuilder.showPopupMenu(info);
});
