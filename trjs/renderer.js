// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var SpellChecker = require('spellchecker');
var webFrame = require('electron').webFrame;

webFrame.setSpellCheckProvider('en-US', false, {
    spellCheck: function (text) {
        console.log('check', text);
        console.log(SpellChecker.isMisspelled(text));
        return !SpellChecker.isMisspelled(text);
    }
});

/*
var SpellChecker = require('electron-spellchecker');
var SpellCheckHandler = SpellChecker.SpellCheckHandler;
var ContextMenuListener = SpellChecker.ContextMenuListener;
var ContextMenuBuilder = SpellChecker.ContextMenuBuilder;

window.spellCheckHandler = new SpellCheckHandler();
window.spellCheckHandler.attachToInput();

// Start off as US English, America #1 (lol)
window.spellCheckHandler.switchLanguage('en-US');

var contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler);
var contextMenuListener = new ContextMenuListener(function (info) {
        contextMenuBuilder.showPopupMenu(info);
});
*/

/*
// Enables spell-checking and the right-click context menu in text editors.
// Electron (`webFrame.setSpellCheckProvider`) only underlines misspelled words;
// we must manage the menu ourselves.
// Run this in the renderer process.

var remote = require('electron').remote;
var webFrame = require('electron').webFrame;
var SpellCheckProvider = require('electron-spell-check-provider');
var buildEditorContextMenu = require('electron-editor-context-menu');

var selection;
function resetSelection() {
    selection = {
        isMisspelled: false,
        spellingSuggestions: []
    };
}
resetSelection();

// Reset the selection when clicking around, before the spell-checker runs and the context menu shows.
window.addEventListener('mousedown', resetSelection);

function resetSpellCheckProvider() {
    // The spell-checker runs when the user clicks on text and before the 'contextmenu' event fires.
    // Thus, we may retrieve spell-checking suggestions to put in the menu just before it shows.
    webFrame.setSpellCheckProvider(
        trjs.param.checkLanguage,
        // Not sure what this parameter (`autoCorrectWord`) does: https://github.com/atom/electron/issues/4371
        // The documentation for `webFrame.setSpellCheckProvider` passes `true` so we do too.
        true,
        new SpellCheckProvider(trjs.param.checkLanguage).on('misspelling', function(suggestions) {
            // Prime the context menu with spelling suggestions _if_ the user has selected text. Electron
            // may sometimes re-run the spell-check provider for an outdated selection e.g. if the user
            // right-clicks some misspelled text and then an image.
            if (window.getSelection().toString()) {
                selection.isMisspelled = true;
                // Take the first five suggestions if any.
                if (suggestions.length > 5)
                    selection.spellingSuggestions = suggestions.slice(0, 5);
                else
                    selection.spellingSuggestions = suggestion;
            }
        }));
}

resetSpellCheckProvider();

window.addEventListener('contextmenu', function(e) {
    // e.preventDefault();
    // Only show the context menu in text editors.
    if (!e.target.closest('textarea, input, [contenteditable="true"]')) return;

    var menu = buildEditorContextMenu(selection);

    // The 'contextmenu' event is emitted after 'selectionchange' has fired but possibly before the
    // visible selection has changed. Try to wait to show the menu until after that, otherwise the
    // visible selection will update after the menu dismisses and look weird.
    setTimeout(function() {
        menu.popup(remote.getCurrentWindow());
    }, 30);
});
*/

/*
// Enables spell-checking and the right-click context menu in text editors.
// Electron (`webFrame.setSpellCheckProvider`) only underlines misspelled words;
// we must manage the menu ourselves.
// Run this in the renderer process.

var remote = require('electron').remote;
var webFrame = require('electron').webFrame;
var SpellChecker = require('spellchecker');
var buildEditorContextMenu = require('electron-editor-context-menu');

var selection;
function resetSelection() {
    selection = {
        isMisspelled: false,
        spellingSuggestions: []
    };
}
resetSelection();

// Reset the selection when clicking around, before the spell-checker runs and the context menu shows.
window.addEventListener('mousedown', resetSelection);

function resetSpellCheckProvider() {
    // The spell-checker runs when the user clicks on text and before the 'contextmenu' event fires.
    // Thus, we may retrieve spell-checking suggestions to put in the menu just before it shows.
    webFrame.setSpellCheckProvider(
        trjs.param.checkLanguage,
        // Not sure what this parameter (`autoCorrectWord`) does: https://github.com/atom/electron/issues/4371
        // The documentation for `webFrame.setSpellCheckProvider` passes `true` so we do too.
        false,
        {
            spellCheck: function (text) {
                //console.log('check', text);
                //console.log(SpellChecker.isMisspelled(text));
                if (SpellChecker.isMisspelled(text)) {
                    selection.isMisspelled = true;
                    // Take the first five suggestions if any.
                    if (suggestions.length > 5)
                        selection.spellingSuggestions = suggestions.slice(0, 5);
                    else
                        selection.spellingSuggestions = suggestion;
                    return false;
                } else
                    return true;
            }
        });
}

resetSpellCheckProvider();

window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    // Only show the context menu in text editors.
    if (!e.target.closest('textarea, input, [contenteditable="true"]')) return;

    var menu = buildEditorContextMenu(selection);

    // The 'contextmenu' event is emitted after 'selectionchange' has fired but possibly before the
    // visible selection has changed. Try to wait to show the menu until after that, otherwise the
    // visible selection will update after the menu dismisses and look weird.
    setTimeout(function() {
        menu.popup(remote.getCurrentWindow());
    }, 30);
});
*/
