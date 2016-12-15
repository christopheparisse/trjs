/**
 * table and bindings for hadlings the keyboard interface.
 * one table (trjs.tablekeys) contains the actual bindings
 * one table (trjs.bindings) contains the potential bindings that have to be initialized and can be changed dynamically by the user
 * supplementary bindings can be added to handle the API keys.
 * API keys bindings are first added to the trjs.bindings table (controlled by the user) and then transmitted to trjs.tablekeys
 * @author Christophe Parisse & Clémentine Gross
 * Date: july 2014
 * @module Tablekeyboard
 * @author
 */

/**
 * trjs.keys contains the actual motor of the keys bindings
 * trjs.bindings contains the program or user defined settings for the keys
 * trjs.api contains the short cut and values that can be used to insert phonetic symbols
 *
 * trjs.tablekeys contains the routing table: each cell of the object contains a pointer to the corresponding function.
 * each cell position correspond to the charcode or keycode plus a modifier computed to the KEYS above.
 * trjs.tablekeys is computed automatically according to the bindings defined in the trjs.tablebindings defined by the user
 * or by the default program
 */

var keysToString = function (k, ctrl, alt, shift, meta) {
    var s = '';
    if (ctrl) s += 'Ctrl + ';
    if (alt) s += 'Alt + ';
    if (shift) s += 'Shift + ';
    if (meta) s += 'Cmd + ';
    s += k;
    return s;
};

function replaceSelectedText(text) {
    var sel, range, textNode;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            textNode = document.createTextNode(text);
            range.insertNode(textNode);

            // Move caret to the end of the newly inserted text node
            range.setStart(textNode, textNode.length);
            range.setEnd(textNode, textNode.length);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.pasteHTML(text);
    }
}

function formatSelectedText(style) {
    var sel, range, textNode;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            var selected = $(range.startContainer).text();
            var endselected = $(range.endContainer).text();
            if (endselected !== selected)
                return;
            // var newtext = selected.substring(0,range.startOffset) + '<' + style + '>' + selected.substring(range.startOffset, range.endOffset) + '</' + style + '>' + + selected.substring(range.endOffset);
            var currentline = trjs.events.getSelectedLine();
            var node = document.createElement(style);
            node.innerHTML = selected.substring(range.startOffset, range.endOffset);
            range.deleteContents();
            range.insertNode(node);

            /*
             // Move caret to the end of the newly inserted text node
             range.setStart(textNode, textNode.length);
             range.setEnd(textNode, textNode.length);
             sel.removeAllRanges();
             sel.addRange(range);
             */
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.pasteHTML(stylehead + selected + styletail);
    }
}

trjs.keys = {};

trjs.keys.CTRLKEYS = 300;
trjs.keys.ALTKEYS = 600;
trjs.keys.SHIFTKEYS = 900;
trjs.keys.CTRLALTKEYS = 1200;
trjs.keys.CTRLSHIFTKEYS = 1500;
trjs.keys.ALTSHIFTKEYS = 1800;
trjs.keys.CTRLALTSHIFTKEYS = 2100;

trjs.keys[0] = 0;
trjs.keys[1] = trjs.keys.CTRLKEYS; // ctrl !alt !shift !meta
trjs.keys[2] = trjs.keys.ALTKEYS; // !ctrl alt !shift !meta
trjs.keys[3] = trjs.keys.SHIFTKEYS; // !ctrl !alt shift !meta
trjs.keys[4] = trjs.keys.CTRLALTKEYS; // ctrl alt !shift !meta
trjs.keys[5] = trjs.keys.CTRLSHIFTKEYS; // ctrl !alt shift !meta
trjs.keys[6] = trjs.keys.ALTSHIFTKEYS; // !ctrl alt shift !meta
trjs.keys[7] = trjs.keys.CTRLALTSHIFTKEYS; // ctrl alt shift !meta

trjs.keys.modifiersFlags = function (charCode, ctrl, alt, shift, meta) {
    var modifiers = ctrl + alt * 2 + shift * 4;
    return charCode + trjs.keys[modifiers];
};

trjs.keys.modifiersEvent = function (charCode, e) {
    var ctrl = e.ctrlKey;
    var meta = e.metaKey
    if (trjs.param.server === 'electron') {
        // console.log("xxx");
        if (!e.ctrlKey && e.metaKey) {
            ctrl = true;
            meta = 'ctrl';
        }
    }
    return trjs.keys.modifiersFlags(charCode, ctrl, e.altKey, e.shiftKey, meta);
};

trjs.keys.init = function () {
    if (trjs.tablekeys !== undefined && trjs.tablekeys !== null) {
        delete trjs.tablekeys;
    }
    trjs.tablekeys = {};
    for (var i in trjs.bindings) {
        if (trjs.bindings[i][0] !== -1) {
            if (!trjs.bindings[i][5]) {
                console.log('bindings(' + i + ') key=' + keysToString(trjs.bindings[i][0], trjs.bindings[i][1], trjs.bindings[i][2], trjs.bindings[i][3], trjs.bindings[i][4]) + ' is undefined');
            }
            if (trjs.bindings[i][4] === 'ctrl') {
                // extends control to metakey for compatibility between windows/unix and mac
                trjs.tablekeys[trjs.keys.modifiersFlags(trjs.bindings[i][0], true,
                    trjs.bindings[i][2], trjs.bindings[i][3], false)] = trjs.bindings[i][5];
            } else {
                // put value dirrectly as it is in the table of codes
                trjs.tablekeys[trjs.keys.modifiersFlags(trjs.bindings[i][0], trjs.bindings[i][1],
                    trjs.bindings[i][2], trjs.bindings[i][3], trjs.bindings[i][4])] = trjs.bindings[i][5];
            }
        }
    }
};

trjs.keys.colorRed = function () {
    formatSelectedText('red');
};

trjs.keys.colorGreen = function () {
    formatSelectedText('green');
};

trjs.keys.colorBlue = function () {
    formatSelectedText('blue');
};

trjs.keys.bold = function () {
    formatSelectedText('b');
};

trjs.keys.italics = function () {
    formatSelectedText('i');
};

trjs.keys.emphasis = function () {
    formatSelectedText('em');
};

trjs.keys.toHtml = function () {
    var s = '';
    for (var i in trjs.bindings) {
        var k = trjs.keynames[trjs.bindings[i][0]];
        if (!k) k = 'Unknown';
        if (trjs.bindings[i][0] !== -1) {
            s += '<tr><td>'
                + keysToString(k.toUpperCase(), trjs.bindings[i][1], trjs.bindings[i][2], trjs.bindings[i][3], trjs.bindings[i][4])
                + '</td><td>'
                + trjs.bindings[i][6]
                + '</td></tr>';
        }
    }
    return s;
};

trjs.keys.apitoHtml = function () {
    var s = '';
    for (var i in trjs.apibindings) {
        var k = trjs.keynames[trjs.apibindings[i][0]];
        if (!k) k = 'Unknown';
        if (trjs.apibindings[i][0] !== -1) {
            s += '<tr><td>'
                + keysToString(k.toUpperCase(), trjs.apibindings[i][1], trjs.apibindings[i][2], trjs.apibindings[i][3], trjs.apibindings[i][4])
                + '</td><td>'
                + trjs.apibindings[i][6]
                + '</td></tr>';
        }
    }
    return s;
};


trjs.keys.showKeys = function () {
    $('#bindings-content').html('<p><button id="printikeys" onclick="trjs.keys.printKeys();"><i class="fa fa-print"></i><span id="printkeys"> Print the list of keys</span></button></p><table id="tableid" class="display"><thead><tr><th id="tkey">Keys</th><th id="tbin">Bindings</th></tr></thead><tbody>' + trjs.keys.toHtml() + '</tbody></table>');
    $('#tableid').dataTable({
        "scrollY": "350px",
        "scrollCollapse": true,
        "paging": false
    });
    $('#message-bindings').modal({keyboard: true});
};

trjs.keys.showApiKeys = function () {
    $('#apibindings-content').html('<p><button id="printiapikeys" onclick="trjs.keys.printApiKeys();"><i class="fa fa-print"></i><span id="printapikeys"> Print the list of API keys</span></button></p><table id="tableidapi" class="display"><thead><tr><th id="tapikey">API Keys</th id="tapibin"><th>Bindings</th></tr></thead><tbody>' + trjs.keys.apitoHtml() + '</tbody></table>');
    $('#tableidapi').dataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        "paging": false
    });
    $('#message-bindings').modal({keyboard: true});
};

trjs.keys.printKeys = function (argument) {
    style = '.p { display:block; margin: 0; padding: 0; } .keysdisplay { font-style: italic; margin-right: 2em; color:#000000; background:#FFFFFF; font-size:larger; } .keysdescr { color:#000000; background:#FFFFFF; } ';
//	var ctn = '<html><head><link href="style/print.css" rel="stylesheet" type="text/css"></head><body>' + trjs.keys.toHtml() + '</body></html>';
    var ctn = '<html><head><style>' + style + '</style></head><body>' + trjs.keys.toHtml() + '</body></html>';
    trjs.utils.printHTML(ctn);
};

trjs.keys.ispress = function (e) {
    if (trjs.data.currentBrowserName === 'Chrome') {
        if (e.keyCode === 188 || e.keyCode === 190 || e.keyCode === 222)
            return true;
    } else if (trjs.data.currentBrowserName === 'Firefox') {
        if (e.keyCode === 60 || e.keyCode === 51)
            return true;
    } else if (trjs.data.currentBrowserName === 'Safari') {
        if (e.keyCode === 188 || e.keyCode === 190 || e.keyCode === 222)
            return true;
    }
    return false;
};

/**
 * structure containing the macro keys
 */
trjs.macros = {};

trjs.macros.key = function (k) {
    replaceSelectedText(trjs.macros.table[k][0]);
    return true;
};

trjs.macros.desc = function (k) {
    return trjs.macros.table[k][1];
};

/**
 * full macros list table
 */
trjs.macros.table = [
    ["copyright Christophe Parisse (2016) - sponsored by Ortolang/Modyco/DGLFLF", "copyright of software"],
];

/**
 * structure containing the api keys
 */
trjs.api = {};

trjs.api.key = function (k) {
    replaceSelectedText(trjs.api.table[k][1]);
    return true;
};

trjs.api.desc = function (k) {
    return trjs.api.table[k][2];
};

/**
 * full api list table
 */
trjs.api.table = [

// vowels
    /* 0 */ ["i", "i", trjs.messgs.api0],
    /* 1 */ ["I", "ɪ", trjs.messgs.api1],
    /* 2 */ ["e", "e", trjs.messgs.api2],
    /* 3 */ ["E", "ɛ", trjs.messgs.api3],
    /* 4 */ ["{", "æ", trjs.messgs.api4],
    /* 5 */ ["y", "y", trjs.messgs.api5],
    /* 6 */ ["2", "ø", trjs.messgs.api6],
    /* 7 */ ["9", "œ", trjs.messgs.api7],
    /* 8 */ ["1", "i", trjs.messgs.api8],
    /* 9 */ ["@", "ə", trjs.messgs.api9],
    /* 10 */ ["6", "ɐ", trjs.messgs.api10],
    /* 11 */ ["3", "ɜ", trjs.messgs.api11],
    /* 12 */ ["a", "a", trjs.messgs.api12],
    /* 13 */ ["}", "ʉ", trjs.messgs.api13],
    /* 14 */ ["8", "ɵ", trjs.messgs.api14],
    /* 15 */ ["&", "ɶ", trjs.messgs.api15],
    /* 16 */ ["M", "ɯ", trjs.messgs.api16],
    /* 17 */ ["7", "ɤ", trjs.messgs.api17],
    /* 18 */ ["V", "ʌ", trjs.messgs.api18],
    /* 19 */ ["A", "ɑ", trjs.messgs.api19],
    /* 20 */ ["u", "u", trjs.messgs.api20],
    /* 21 */ ["U", "ʊ", trjs.messgs.api21],
    /* 22 */ ["o", "o", trjs.messgs.api22],
    /* 23 */ ["O", "ɔ", trjs.messgs.api23],
    /* 24 */ ["Q", "ɒ", trjs.messgs.api24],
// consonants
    /* 25 */ ["p", "p", trjs.messgs.api25],
    /* 26 */ ["b", "b", trjs.messgs.api26],
    /* 27 */ ["t", "t", trjs.messgs.api27],
    /* 28 */ ["d", "d", trjs.messgs.api28],
    /* 29 */ ["ts", "ts", trjs.messgs.api29],
    /* 30 */ ["dz", "dz", trjs.messgs.api30],
    /* 31 */ ["tS", "tʃ", trjs.messgs.api31],
    /* 32 */ ["dZ", "dʒ", trjs.messgs.api32],
    /* 33 */ ["c", "c", trjs.messgs.api33],
    /* 34 */ ["J\\", "ɟ", trjs.messgs.api34],
    /* 35 */ ["k", "k", trjs.messgs.api35],
    /* 36 */ ["g", "ɡ", trjs.messgs.api36],
    /* 37 */ ["q", "q", trjs.messgs.api37],
    /* 38 */ ["p\\", "ɸ", trjs.messgs.api38],
    /* 39 */ ["B", "β", trjs.messgs.api39],
    /* 40 */ ["f", "f", trjs.messgs.api40],
    /* 41 */ ["v", "v", trjs.messgs.api41],
    /* 42 */ ["T", "θ", trjs.messgs.api42],
    /* 43 */ ["D", "ð", trjs.messgs.api43],
    /* 44 */ ["s", "s", trjs.messgs.api44],
    /* 45 */ ["z", "z", trjs.messgs.api45],
    /* 46 */ ["S", "ʃ", trjs.messgs.api46],
    /* 47 */ ["Z", "ʒ", trjs.messgs.api47],
    /* 48 */ ["C", "ç", trjs.messgs.api48],
    /* 49 */ ["j", "ʝ", trjs.messgs.api49],
    /* 50 */ ["x", "x", trjs.messgs.api50],
    /* 51 */ ["G", "ɣ", trjs.messgs.api51],
    /* 52 */ ["x\\", "ɰ", trjs.messgs.api52],
    /* 53 */ ["X\\", "ħ", trjs.messgs.api53],
    /* 54 */ ["?\\", "ʕ", trjs.messgs.api54],
    /* 55 */ ["h", "h", trjs.messgs.api55],
    /* 56 */ ["h\\", "ɦ", trjs.messgs.api56],
    /* 57 */ ["m", "m", trjs.messgs.api57],
    /* 58 */ ["F", "ɱ", trjs.messgs.api58],
    /* 59 */ ["n", "n", trjs.messgs.api59],
    /* 60 */ ["J", "ɲ", trjs.messgs.api60],
    /* 61 */ ["N", "ŋ", trjs.messgs.api61],
    /* 62 */ ["l", "l", trjs.messgs.api62],
    /* 63 */ ["L", "ʎ", trjs.messgs.api63],
    /* 64 */ ["5", "ɫ", trjs.messgs.api64],
    /* 65 */ ["4", "ɾ", trjs.messgs.api65],
    /* 66 */ ["r", "r", trjs.messgs.api66],
    /* 67 */ ["r\\", "ɹ", trjs.messgs.api67],
    /* 68 */ ["R", "ʀ", trjs.messgs.api68],
    /* 69 */ ["P", "ʋ", trjs.messgs.api69],
    /* 70 */ ["w", "w", trjs.messgs.api70],
    /* 71 */ ["H", "ɥ", trjs.messgs.api71],
    /* 72 */ ["j", "j", trjs.messgs.api72],
// others
    /* 73 */ [":", "ː", trjs.messgs.api73],
    /* 74 */ ["~", "\u0303", trjs.messgs.api74],
    /* 75 */ ["~E", "\u0303ɛ", trjs.messgs.api75],
    /* 76 */ ["~9", "\u0303œ", trjs.messgs.api76],
    /* 77 */ ["~O", "\u0303ɔ", trjs.messgs.api77],
    /* 78 */ ["~A", "\u0303ɑ", trjs.messgs.api78],
];


/**
 * variable containing the code for api characters without modificator
 * @enum apiChars
 var apiChars = {
 "A": "\u0251",
 "E": "\u025B",
 "O": "\u0254",
 "9": "\u0153",
 "2": "\u00F8",
 "@": "\u0259",
 "0": "\u0259",
 "R": "\u0280",
 "S": "\u0283",
 "Z": "\u0292",
 "N": "\u014B",
 "H": "\u0265",
 "J": "\u0272",
 "T": "\u03B8",
 "D": "\u00F0",
 "I": "\u026A",
 "Q": "\u0252",
 "V": "\u028C",
 "U": "\u028A",
 "X": "\u03C7",
 ":": "\u02D0",
};
 */


/**
 * variable containing the code for api characters with modificator (for nasals and others)
 * @enum apiCharsPlus
 var apiCharsPlus = {
 "A": "\u0251\u0303",
 "E": "\u025B\u0303",
 "9": "\u0153\u0303",
 "N": "\u014B",
 "O": "\u0254\u0303",
 "Q": "\u00E6",
 "R": "\u0281"
};
 */

/**
 * table of the names of the keys for user help display
 */
trjs.keynames = {
    8: "backspace",
    9: "tab",
    10: "newline",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause/break",
    20: "caps lock",
    27: "escape",
    33: "page up",
    34: "page down",
    35: "end",
    36: "home",
    37: "left arrow",
    38: "up arrow",
    39: "right arrow",
    40: "down arrow",
    45: "insert",
    46: "delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: "left window key",
    92: "right window key",
    93: "select key",
    96: "numpad 0",
    97: "numpad 1",
    98: "numpad 2",
    99: "numpad 3",
    100: "numpad 4",
    101: "numpad 5",
    102: "numpad 6",
    103: "numpad 7",
    104: "numpad 8",
    105: "numpad 9",
    106: "multiply",
    107: "add",
    109: "subtract",
    110: "decimal point",
    111: "divide",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    144: "num lock",
    145: "scroll lock",
    186: "semi-colon",
    187: "equal sign",
    188: "comma",
    189: "dash",
    190: "period",
    191: "forward slash",
    192: "grave accent",
    219: "open bracket",
    220: "back slash",
    221: "close braket",
    222: "single quote",
};

/*
 * default binding table
 * the binding table is for the user internationauxrface and can be inserted in the real binding table trjs.tablekeys
 * the trjs.keys.init function allows to initialize or reinitialize the keys.
 * for the future it would be good to allow to store and modify this list of bindings
 */

trjs.bindings = [];

trjs.keys.initBindings = function () {
    /* clé - ctrl alt shift meta function description */
    trjs.bindings.push([9, false, false, false, false, trjs.events.tab, trjs.messgs.bin9]); // Tab
    trjs.bindings.push([10, false, false, false, false, trjs.events.enter, trjs.messgs.bin10]); // return Key
    trjs.bindings.push([13, false, false, false, false, trjs.events.enter, trjs.messgs.bin13]); // return Key
    trjs.bindings.push([27, false, false, false, false, trjs.events.escape, trjs.messgs.bin27]); // Esc
    trjs.bindings.push([33, false, false, false, false, trjs.events.pageUp, trjs.messgs.bin33]); // Page Up
    trjs.bindings.push([34, false, false, false, false, trjs.events.pageDown, trjs.messgs.bin34]); // Page Down
    trjs.bindings.push([38, false, false, false, false, trjs.events.keyUp, trjs.messgs.bin38]); // Up
    trjs.bindings.push([40, false, false, false, false, trjs.events.keyDown, trjs.messgs.bin40]); // Down
    trjs.bindings.push([112, false, false, false, false, trjs.media.playJump, trjs.messgs.bin112]); // F1
    trjs.bindings.push([113, false, false, false, false, trjs.media.backwardStep, trjs.messgs.bin113]); // F2
    trjs.bindings.push([114, false, false, false, false, trjs.media.forwardStep, trjs.messgs.bin114]); // F3
    trjs.bindings.push([115, false, false, false, false, trjs.events.setStartAndRedraw, trjs.messgs.bin115]); // F4
    trjs.bindings.push([116, false, false, false, false, trjs.events.setEndAndRedraw, trjs.messgs.bin116]); // F5
    trjs.bindings.push([117, false, false, false, false, trjs.events.insertBlankLineLocAndRedraw, trjs.messgs.bin117]); // F6
    trjs.bindings.push([118, false, false, false, false, trjs.events.runCurrentLine, trjs.messgs.bin118]); // F7
    trjs.bindings.push([119, false, false, false, false, trjs.events.goContinuous, trjs.messgs.bin119]); // F8

    trjs.bindings.push([49, true, false, false, 'ctrl', trjs.events.setNthLoc1, trjs.messgs.ctrlbin49]); // Ctrl 1
    trjs.bindings.push([50, true, false, false, 'ctrl', trjs.events.setNthLoc2, trjs.messgs.ctrlbin50]); // Ctrl 2
    trjs.bindings.push([51, true, false, false, 'ctrl', trjs.events.setNthLoc3, trjs.messgs.ctrlbin51]); // Ctrl 3
    trjs.bindings.push([52, true, false, false, 'ctrl', trjs.events.setNthLoc4, trjs.messgs.ctrlbin52]); // Ctrl 4
    trjs.bindings.push([53, true, false, false, 'ctrl', trjs.events.setNthLoc5, trjs.messgs.ctrlbin53]); // Ctrl 5
    trjs.bindings.push([54, true, false, false, 'ctrl', trjs.events.setNthLoc6, trjs.messgs.ctrlbin54]); // Ctrl 6
    trjs.bindings.push([55, true, false, false, 'ctrl', trjs.events.setNthLoc7, trjs.messgs.ctrlbin55]); // Ctrl 7
    trjs.bindings.push([56, true, false, false, 'ctrl', trjs.events.setNthLoc8, trjs.messgs.ctrlbin56]); // Ctrl 8
    trjs.bindings.push([57, true, false, false, 'ctrl', trjs.events.setNthLoc9, trjs.messgs.ctrlbin57]); // Ctrl 9

    trjs.bindings.push([35, true, false, false, 'ctrl', trjs.events.ctrlEnd, trjs.messgs.ctrlbin35]); // Ctrl End
    trjs.bindings.push([36, true, false, false, 'ctrl', trjs.events.ctrlHome, trjs.messgs.ctrlbin36]); // Ctrl Home
    trjs.bindings.push([66, true, false, false, 'ctrl', trjs.media.playSlower, trjs.messgs.ctrlbin66]); // Ctrl B
    trjs.bindings.push([68, true, false, false, 'ctrl', trjs.events.deleteLineAndRedraw, trjs.messgs.ctrlbin68]); // Ctrl D
    trjs.bindings.push([69, true, false, false, 'ctrl', trjs.media.playFaster, trjs.messgs.ctrlbin69]); // Ctrl E
    trjs.bindings.push([70, true, false, false, 'ctrl', trjs.editor.showSearch, trjs.messgs.ctrlaltbin70]); // Ctrl F
    trjs.bindings.push([71, true, false, false, 'ctrl', trjs.events.setDivPlusInsert, trjs.messgs.ctrlbin71]); // Ctrl G
    trjs.bindings.push([73, true, false, false, 'ctrl', trjs.events.insertBlankLineAndRedraw, trjs.messgs.ctrlbin73]); // Ctrl I
    trjs.bindings.push([74, true, false, false, 'ctrl', trjs.events.joinLine, trjs.messgs.ctrlbin74]); // Ctrl J
    trjs.bindings.push([76, true, false, false, 'ctrl', trjs.editor.showLine, trjs.messgs.ctrlbin76]); // Ctrl L
    trjs.bindings.push([77, true, false, false, 'ctrl', trjs.events.setTimeReplaceLocAndRedraw, trjs.messgs.ctrlbin77]); // Ctrl M
    trjs.bindings.push([79, true, false, false, 'ctrl', trjs.editor.openTranscript, trjs.messgs.ctrlbin79]); // Ctrl O
    trjs.bindings.push([82, true, false, false, 'ctrl', trjs.events.replicateLineAndRedraw, trjs.messgs.ctrlbin82]); // Ctrl R
    trjs.bindings.push([83, true, false, false, 'ctrl', trjs.editor.save, trjs.messgs.ctrlbin83]); // Ctrl S
    trjs.bindings.push([84, true, false, false, 'ctrl', trjs.editor.showTime, trjs.messgs.ctrlbin84]); // Ctrl T
    trjs.bindings.push([85, true, false, false, 'ctrl', trjs.editor.hideDiv, trjs.messgs.ctrlbin85]); // Ctrl U
// trjs.bindings.push( [88, true, false, false, 'ctrl', trjs.events.insertBlankLineLocAndRedraw, "" ] ); // Ctrl X
    trjs.bindings.push([89, true, false, false, 'ctrl', trjs.undo.redo, trjs.messgs.ctrlbin89]); // Ctrl Y
    trjs.bindings.push([90, true, false, false, 'ctrl', trjs.undo.undo, trjs.messgs.ctrlbin90]); // Ctrl Z

    trjs.bindings.push([49, true, false, true, 'ctrl', trjs.events.setDivPlus, trjs.messgs.ctrlshiftbin49]); // Ctrl Shift 1
    trjs.bindings.push([50, true, false, true, 'ctrl', trjs.events.setDivMinus, trjs.messgs.ctrlshiftbin50]); // Ctrl Shift 2
    trjs.bindings.push([71, true, false, true, 'ctrl', trjs.events.setDivMissingMinus, trjs.messgs.ctrlshiftbin71]); // Ctrl Shift G

    trjs.bindings.push([49, true, true, false, 'ctrl', trjs.events.setNthTier1, trjs.messgs.ctrlaltbin49]); // Ctrl Alt 1
    trjs.bindings.push([50, true, true, false, 'ctrl', trjs.events.setNthTier2, trjs.messgs.ctrlaltbin50]); // Ctrl Alt 2
    trjs.bindings.push([51, true, true, false, 'ctrl', trjs.events.setNthTier3, trjs.messgs.ctrlaltbin51]); // Ctrl Alt 3
    trjs.bindings.push([52, true, true, false, 'ctrl', trjs.events.setNthTier4, trjs.messgs.ctrlaltbin52]); // Ctrl Alt 4
    trjs.bindings.push([53, true, true, false, 'ctrl', trjs.events.setNthTier5, trjs.messgs.ctrlaltbin53]); // Ctrl Alt 5
    trjs.bindings.push([54, true, true, false, 'ctrl', trjs.events.setNthTier6, trjs.messgs.ctrlaltbin54]); // Ctrl Alt 6
    trjs.bindings.push([55, true, true, false, 'ctrl', trjs.events.setNthTier7, trjs.messgs.ctrlaltbin55]); // Ctrl Alt 7
    trjs.bindings.push([56, true, true, false, 'ctrl', trjs.events.setNthTier8, trjs.messgs.ctrlaltbin56]); // Ctrl Alt 8
    trjs.bindings.push([57, true, true, false, 'ctrl', trjs.events.setNthTier9, trjs.messgs.ctrlaltbin57]); // Ctrl Alt 9

    trjs.bindings.push([65, true, true, false, 'ctrl', trjs.transcription.selectAllMS, trjs.messgs.ctrlaltbin65]); // Ctrl Alt A
    trjs.bindings.push([66, true, true, false, 'ctrl', trjs.media.playReverse, trjs.messgs.ctrlaltbin66]); // Ctrl Alt B
    trjs.bindings.push([68, true, true, false, 'ctrl', trjs.events.deleteLineLocAndRedraw, trjs.messgs.ctrlaltbin68]); // Ctrl Alt D
    trjs.bindings.push([69, true, true, false, 'ctrl', trjs.media.playNormal, trjs.messgs.ctrlaltbin69]); // Ctrl Alt E
//    trjs.bindings.push([70, true, false, false, 'ctrl', trjs.editor.showSearch, trjs.messgs.ctrlaltbin70]); // Ctrl F
    trjs.bindings.push([71, true, true, false, 'ctrl', trjs.events.setDivMinusInsert, trjs.messgs.ctrlaltbin71]); // Ctrl Alt G
    trjs.bindings.push([73, true, true, false, 'ctrl', trjs.events.insertWithTimeAndRedraw, trjs.messgs.ctrlaltbin73]); // Ctrl Alt I
    if (trjs.utils.isWindows()) {
        trjs.bindings.push([72, true, true, false, 'ctrl', trjs.events.joinLineLoc, trjs.messgs.ctrlaltbin74]); // Ctrl Alt H
    } else {
        trjs.bindings.push([74, true, true, false, 'ctrl', trjs.events.joinLineLoc, trjs.messgs.ctrlaltbin74]); // Ctrl Alt J
    }
    trjs.bindings.push([77, true, true, false, 'ctrl', trjs.events.setTimeReplaceAndRedraw, trjs.messgs.ctrlaltbin77]); // Ctrl Alt M
    trjs.bindings.push([79, true, true, false, 'ctrl', trjs.editor.openMedia, trjs.messgs.ctrlaltbin79]); // Ctrl Alt O
    trjs.bindings.push([82, true, true, false, 'ctrl', trjs.events.splitLineAndRedraw, trjs.messgs.ctrlaltbin82]); // Ctrl Alt R
    trjs.bindings.push([85, true, true, false, 'ctrl', trjs.editor.showDiv, trjs.messgs.ctrlaltbin85]); // Ctrl Alt U

    trjs.bindings.push( [113, true, true, false, 'ctrl', trjs.keys.colorRed, trjs.messgs.ctrlaltbin113 ] ); // Ctrl Alt F2
    trjs.bindings.push( [114, true, true, false, 'ctrl', trjs.keys.colorGreen, trjs.messgs.ctrlaltbin114 ] ); // Ctrl Alt F3
    trjs.bindings.push( [115, true, true, false, 'ctrl', trjs.keys.colorBlue, trjs.messgs.ctrlaltbin115 ] ); // Ctrl Alt F4
    trjs.bindings.push( [116, true, true, false, 'ctrl', trjs.keys.bold, trjs.messgs.ctrlaltbin116 ] ); // Ctrl Alt F5
    trjs.bindings.push( [117, true, true, false, 'ctrl', trjs.keys.italics, trjs.messgs.ctrlaltbin117 ] ); // Ctrl Alt F6
    trjs.bindings.push( [118, true, true, false, 'ctrl', trjs.keys.emphasis, trjs.messgs.ctrlaltbin118 ] ); // Ctrl Alt F7

    //trjs.bindings.push([119, true, true, false, false, trjs.media.playSlower, trjs.messgs.ctrlaltbin115]); // Ctrl Alt F8
    //trjs.bindings.push([120, true, true, false, false, trjs.media.playFaster, trjs.messgs.ctrlaltbin116]); // Ctrl Alt F9

    trjs.bindings.push([119, true, true, false, 'ctrl', trjs.transcription.setMultipleSelection, trjs.messgs.ctrlaltbin119]); // Ctrl Alt F8
    trjs.bindings.push([120, true, true, false, 'ctrl', trjs.transcription.exportMStoSubtSrt, trjs.messgs.ctrlaltbin120]); // Ctrl Alt F9
    trjs.bindings.push([121, true, true, false, 'ctrl', trjs.transcription.exportMStoSubtAss, trjs.messgs.ctrlaltbin121]); // Ctrl Alt F10
    trjs.bindings.push([122, true, true, false, 'ctrl', trjs.transcription.exportMStoMediaSubt, trjs.messgs.ctrlaltbin122]); // Ctrl Alt F11
    trjs.bindings.push([123, true, true, false, 'ctrl', trjs.transcription.exportMStoMedia, trjs.messgs.ctrlaltbin123]); // Ctrl Alt F12

    trjs.bindings.push([37, false, true, false, false, trjs.media.backwardStep, trjs.messgs.altbin37]); // Alt Left
    trjs.bindings.push([38, false, true, false, false, trjs.events.keyLocUp, trjs.messgs.altbin38]); // Alt Up
    trjs.bindings.push([39, false, true, false, false, trjs.media.forwardStep, trjs.messgs.altbin39]); // Alt Right
    trjs.bindings.push([40, false, true, false, false, trjs.events.keyLocDown, trjs.messgs.altbin40]); // Alt Down
    trjs.bindings.push([112, false, true, false, false, trjs.media.playCurrent, trjs.messgs.altbin112]); // Alt F1
    trjs.bindings.push([113, false, true, false, false, trjs.media.makeSmall, trjs.messgs.altbin113]); // Alt F2
    trjs.bindings.push([114, false, true, false, false, trjs.media.makeBig, trjs.messgs.altbin114]); // Alt F3
    trjs.bindings.push([117, false, true, false, false, trjs.events.insertWithTimeLocAndRedraw, trjs.messgs.altbin117]); // Alt F6
    trjs.bindings.push([118, false, true, false, false, trjs.events.runThreeLines, trjs.messgs.altbin118]); // Alt F7
    trjs.bindings.push([122, false, true, false, false, trjs.transcription.sort, "sort all lines by times"]); // Alt F11
    trjs.bindings.push([123, false, true, false, false, trjs.undo.undoList, "display undo/redo list"]); // Alt F12

    trjs.bindings.push([9, false, false, true, false, trjs.events.shiftTab, trjs.messgs.shiftbin9]); // Shift Tab
    trjs.bindings.push([112, false, false, true, false, trjs.media.playPause, trjs.messgs.shiftbin112]); // Shift F1

    /*
     trjs.keys.special1 = function() { console.timeEnd("page"); };
     trjs.bindings.push( [114, false, false, true, false, trjs.keys.special1, trjs.messgs.shiftbin114 ] ); // Shift F3
     */
    trjs.bindings.push([115, false, false, true, false, trjs.io.htmlSave, trjs.messgs.shiftbin115]); // Shift F4
};

trjs.keys.initApiBindings = function () {
    /* clé - ctrl alt shift meta function description */
    trjs.bindings.push([48, false, true, false, false, function () {
        trjs.api.key(9);
    }, trjs.api.desc(9)]); // Alt 0 et Alt @
    trjs.bindings.push([50, false, true, false, false, function () {
        trjs.api.key(6);
    }, trjs.api.desc(6)]); // Alt 2
    trjs.bindings.push([57, false, true, false, false, function () {
        trjs.api.key(7);
    }, trjs.api.desc(7)]); // Alt 9
    trjs.bindings.push([58, false, true, false, false, function () {
        trjs.api.key(73);
    }, trjs.api.desc(73)]); // Alt :
    trjs.bindings.push([65, false, true, false, false, function () {
        trjs.api.key(19);
    }, trjs.api.desc(19)]); // Alt A
    trjs.bindings.push([68, false, true, false, false, function () {
        trjs.api.key(43);
    }, trjs.api.desc(43)]); // Alt D
    trjs.bindings.push([69, false, true, false, false, function () {
        trjs.api.key(3);
    }, trjs.api.desc(3)]); // Alt E
    trjs.bindings.push([72, false, true, false, false, function () {
        trjs.api.key(71);
    }, trjs.api.desc(71)]); // Alt H
    trjs.bindings.push([73, false, true, false, false, function () {
        trjs.api.key(1);
    }, trjs.api.desc(1)]); // Alt I
    trjs.bindings.push([74, false, true, false, false, function () {
        trjs.api.key(60);
    }, trjs.api.desc(60)]); // Alt J
    trjs.bindings.push([78, false, true, false, false, function () {
        trjs.api.key(61);
    }, trjs.api.desc(61)]); // Alt N
    trjs.bindings.push([79, false, true, false, false, function () {
        trjs.api.key(23);
    }, trjs.api.desc(23)]); // Alt O
    trjs.bindings.push([81, false, true, false, false, function () {
        trjs.api.key(24);
    }, trjs.api.desc(24)]); // Alt Q
    trjs.bindings.push([82, false, true, false, false, function () {
        trjs.api.key(68);
    }, trjs.api.desc(68)]); // Alt R
    trjs.bindings.push([83, false, true, false, false, function () {
        trjs.api.key(46);
    }, trjs.api.desc(46)]); // Alt S
    trjs.bindings.push([84, false, true, false, false, function () {
        trjs.api.key(42);
    }, trjs.api.desc(42)]); // Alt T
    trjs.bindings.push([85, false, true, false, false, function () {
        trjs.api.key(21);
    }, trjs.api.desc(21)]); // Alt U
    trjs.bindings.push([86, false, true, false, false, function () {
        trjs.api.key(18);
    }, trjs.api.desc(18)]); // Alt V
    trjs.bindings.push([88, false, true, false, false, function () {
        trjs.api.key(51);
    }, trjs.api.desc(51)]); // Alt X
    trjs.bindings.push([90, false, true, false, false, function () {
        trjs.api.key(47);
    }, trjs.api.desc(47)]); // Alt Z
    trjs.bindings.push([78, false, true, true, false, function () {
        trjs.api.key(74);
    }, trjs.api.desc(74)]); // Alt Shift N
    trjs.bindings.push([69, false, true, true, false, function () {
        trjs.api.key(75);
    }, trjs.api.desc(75)]); // Shift Alt E
    trjs.bindings.push([58, false, true, true, false, function () {
        trjs.api.key(76);
    }, trjs.api.desc(76)]); // Shift Alt 9
    trjs.bindings.push([81, false, true, true, false, function () {
        trjs.api.key(77);
    }, trjs.api.desc(77)]); // Shift Alt O
    trjs.bindings.push([43, false, true, true, false, function () {
        trjs.api.key(78);
    }, trjs.api.desc(78)]); // Shift Alt A

// liste des caractère nom de domaine internationaux pour le français : ß à á â ã ä å æ ç è é ê ë ì í î ï ñ ò ó ô õ ö ù ú û ü ý ÿ œ

//trjs.bindings.push( [57, ALTSHIFTKEYS, function() { trjs.api.key(?) } "" ] ); // Alt Shift 9
//trjs.bindings.push( [65, ALTSHIFTKEYS, function() { trjs.api.key(?) } "" ] ); // Alt Shift A
//trjs.bindings.push( [69, ALTSHIFTKEYS, function() { trjs.api.key(?) } "" ] ); // Alt Shift E
//trjs.bindings.push( [79, ALTSHIFTKEYS, function() { trjs.api.key(?) } "" ] ); // Alt Shift O
//trjs.bindings.push( [81, ALTSHIFTKEYS, function() { trjs.api.key(?) } "" ] ); // Alt Shift Q
//trjs.bindings.push( [82, ALTSHIFTKEYS, function() { trjs.api.key(?) } "" ] ); // Alt Shift R
};

trjs.keys.initMacrosBindings = function () {
    /* clé - ctrl alt shift meta function description */
    trjs.bindings.push([48, true, true, true, false, function () {
        trjs.macros.key(0);
    }, trjs.macros.desc(0)]); // ctrl+alt+shift 0
};
