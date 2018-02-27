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
 * trjs.apiBindings contains the program or user defined settings for the keys
 *
 * trjs.tablekeys contains the routing table: each cell of the object contains a pointer to the corresponding function.
 * each cell position correspond to the charcode or keycode plus a modifier computed to the KEYS above.
 * trjs.tablekeys is computed automatically according to the bindings defined in the trjs.tablebindings defined by the user
 * or by the default program
 */

var keysToString = function (k, ctrl, alt, shift, meta) {
    var s = '';
    if (!trjs.utils.isMacOS() && ctrl) s += 'Ctrl + ';
    if (alt) s += 'Alt + ';
    if (shift) s += 'Shift + ';
    if (trjs.utils.isMacOS() && meta) s += 'Cmd + ';
    s += k;
    return s;
};

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
trjs.keys[4] = trjs.keys.SHIFTKEYS; // !ctrl !alt shift !meta
trjs.keys[3] = trjs.keys.CTRLALTKEYS; // ctrl alt !shift !meta
trjs.keys[5] = trjs.keys.CTRLSHIFTKEYS; // ctrl !alt shift !meta
trjs.keys[6] = trjs.keys.ALTSHIFTKEYS; // !ctrl alt shift !meta
trjs.keys[7] = trjs.keys.CTRLALTSHIFTKEYS; // ctrl alt shift !meta

trjs.keys.skipModifierKey = [];
trjs.tablekeys = {};
trjs.tablekeysSE1 = {};
trjs.tablekeysSE2 = {};

trjs.keys.modifiersFlags = function (charCode, ctrl, alt, shift, meta) {
    var modifiers = ctrl + alt * 2 + shift * 4;
    return charCode + trjs.keys[modifiers];
};

trjs.keys.modifiersEvent = function (charCode, e) {
    var ctrl = e.ctrlKey;
    var meta = e.metaKey;
    if (trjs.param.server === 'electron') {
        // console.log("xxx");
        if (!e.ctrlKey && e.metaKey) {
            ctrl = true;
            meta = 'ctrl';
        }
    }
    return trjs.keys.modifiersFlags(charCode, ctrl, e.altKey, e.shiftKey, meta);
};

trjs.keys.insertBinding = function (bind, keytable) {
    if (bind[0] !== -1) {
        if (!bind[5]) {
            console.log('bindings key=' + keysToString(bind[0], bind[1], bind[2], bind[3], bind[4]) + ' is undefined');
        }
        if (bind[4] === 'ctrl') {
            // extends control to metakey for compatibility between windows/unix and mac
            keytable[trjs.keys.modifiersFlags(bind[0], true,
                bind[2], bind[3], false)] = bind[5];
        } else {
            // put value dirrectly as it is in the table of codes
            keytable[trjs.keys.modifiersFlags(bind[0], bind[1],
                bind[2], bind[3], bind[4])] = bind[5];
        }
    }
};

trjs.keys.init = function () {
    trjs.keys.initNameToKey();
    trjs.keys.initBindings();
    trjs.keys.initApiBindings();
    trjs.keys.initMacrosBindings();
    trjs.keys.initF1Bindings();
    trjs.keys.initF2Bindings();

    trjs.keys.specialChar1 = trjs.keys.modifiersEvent(nkey("f1"), {
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false
    });
    trjs.keys.specialChar2 = trjs.keys.modifiersEvent(nkey("f2"), {
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false
    });

    if (trjs.tablekeys !== undefined && trjs.tablekeys !== null) {
        delete trjs.tablekeys;
    }
    trjs.tablekeys = {};
    for (var i = 0; i < trjs.bindings.length; i++) {
        trjs.keys.insertBinding(trjs.bindings[i], trjs.tablekeys);
    }
    // if API binding
    for (var i = 0; i < trjs.apiBindings.length; i++) {
        trjs.keys.insertBinding(trjs.apiBindings[i], trjs.tablekeys);
    }
    if (trjs.tablekeysSE1 !== undefined && trjs.tablekeysSE1 !== null) {
        delete trjs.tablekeysSE1;
    }
    trjs.tablekeysSE1 = {};
    for (var i = 0; i < trjs.F1Bindings.length; i++) {
        trjs.keys.insertBinding(trjs.F1Bindings[i], trjs.tablekeysSE1);
    }
    if (trjs.tablekeysSE2 !== undefined && trjs.tablekeysSE2 !== null) {
        delete trjs.tablekeysSE2;
    }
    trjs.tablekeysSE2 = {};
    for (var i = 0; i < trjs.F2Bindings.length; i++) {
        trjs.keys.insertBinding(trjs.F2Bindings[i], trjs.tablekeysSE2);
    }
    // key that are never used in isolation but only to modify other keys
    trjs.keys.skipModifierKey.push(nkey('shift'));
    trjs.keys.skipModifierKey.push(nkey('ctrl'));
    trjs.keys.skipModifierKey.push(nkey('alt'));
    trjs.keys.skipModifierKey.push(nkey('caps lock'));
    trjs.keys.skipModifierKey.push(nkey('cmd'));
};

trjs.keys.colorRed = function () {
    trjs.macros.formatSelectedText('red');
};

trjs.keys.colorGreen = function () {
    trjs.macros.formatSelectedText('green');
};

trjs.keys.colorBlue = function () {
    trjs.macros.formatSelectedText('blue');
};

trjs.keys.bold = function () {
    trjs.macros.formatSelectedText('b');
};

trjs.keys.italics = function () {
    trjs.macros.formatSelectedText('i');
};

trjs.keys.emphasis = function () {
    trjs.macros.formatSelectedText('em');
};

trjs.keys.toHtml = function () {
    var s = '';
    for (var i in trjs.bindings) {
        var k = trjs.keyToName[trjs.bindings[i][0]];
        if (!k) k = 'Unknown';
        if (trjs.bindings[i][0] !== -1) {
            s += '<tr><td>'
                + keysToString(k.toUpperCase(), trjs.bindings[i][1], trjs.bindings[i][2], trjs.bindings[i][3], trjs.bindings[i][4])
                + '</td><td>'
                + trjs.bindings[i][6]
                + '</td></tr>\n';
        }
    }
    return s;
};

trjs.keys.apiToHtml = function () {
    var s = '';
    for (var i in trjs.apiBindings) {
        var k = trjs.keyToName[trjs.apiBindings[i][0]];
        if (!k) k = 'Unknown';
        if (trjs.apiBindings[i][0] !== -1) {
            s += '<tr><td>'
                + keysToString(k.toUpperCase(), trjs.apiBindings[i][1], trjs.apiBindings[i][2], trjs.apiBindings[i][3], trjs.apiBindings[i][4])
                + '</td><td>'
                + trjs.apiBindings[i][7]
                + '</td><td>'
                + trjs.apiBindings[i][6]
                + '</td></tr>\n';
        }
    }
    return s;
};

trjs.keys.f1f2ToHtml = function () {
    var s = '';
    for (var i in trjs.F1Bindings) {
        var k = trjs.keyToName[trjs.F1Bindings[i][0]];
        if (!k) k = 'Unknown';
        if (trjs.F1Bindings[i][0] !== -1) {
            s += '<tr><td>'
                + 'F1 /fb/ ' + keysToString(k.toUpperCase(), trjs.F1Bindings[i][1], trjs.F1Bindings[i][2], trjs.F1Bindings[i][3], trjs.F1Bindings[i][4])
                + '</td><td>'
                + trjs.utils.notnull(trjs.F1Bindings[i][7])
                + '</td><td>'
                + trjs.utils.notnull(trjs.F1Bindings[i][6])
                + '</td></tr>\n';
        }
    }
    for (var i in trjs.F2Bindings) {
        var k = trjs.keyToName[trjs.F2Bindings[i][0]];
        if (!k) k = 'Unknown';
        if (trjs.F2Bindings[i][0] !== -1) {
            s += '<tr><td>'
                + 'F2 /fb/ ' + keysToString(k.toUpperCase(), trjs.F2Bindings[i][1], trjs.F2Bindings[i][2], trjs.F2Bindings[i][3], trjs.F2Bindings[i][4])
                + '</td><td>'
                + trjs.utils.notnull(trjs.F2Bindings[i][7])
                + '</td><td>'
                + trjs.utils.notnull(trjs.F2Bindings[i][6])
                + '</td></tr>\n';
        }
    }
    return s;
};


trjs.keys.showKeys = function () {
    $('#bindings-content').html(
        '<p><button id="printbkeys" onclick="trjs.keys.printKeys();">' +
        '<i class="fa fa-print"></i><span id="printkeys"> Print the list of keys</span></button></p>' +
        '<table id="tableid" class="display"><thead><tr><th id="tkey">Keys</th><th id="tbin">Bindings</th></tr></thead>' +
        '<tbody>' + trjs.keys.toHtml() + '</tbody></table>');
    $('#tableid').dataTable({
        "scrollY": "350px",
        "scrollCollapse": true,
        "paging": false
    });
    $('#message-bindings').modal({keyboard: true});
};

trjs.keys.showApiKeys = function () {
    $('#apibindings-content').html(
        '<p><button id="printbapikeys" onclick="trjs.keys.printApiKeys();">' +
        '<i class="fa fa-print"></i><span id="printapikeys"> Print the list of API keys</span></button></p>' +
        '<table id="tableidapi" class="display"><thead><tr><th id="tapikey">Keys</th><th id="tapibin">API</th><th>Info</th></tr></thead>' +
        '<tbody>' + trjs.keys.apiToHtml() + '</tbody></table>');
    $('#tableidapi').dataTable({
        "scrollY": "350px",
        "scrollCollapse": true,
        "paging": false
    });
    $('#message-bindings').modal({keyboard: true});
};

trjs.keys.showF1F2Keys = function () {
    $('#F1F2bindings-content').html(
        '<p><button id="printbapikeys" onclick="trjs.keys.printF1F2Keys();">' +
        '<i class="fa fa-print"></i><span id="printF1F2keys"> Print the list of F1/F2 keys</span></button></p>' +
        '<table id="tableidF1F2" class="display"><thead><tr><th id="tF1F2key">Keys</th><th id="tF1F2bin">Value</th><th>Info</th></tr></thead>' +
        '<tbody>' + trjs.keys.f1f2ToHtml() + '</tbody></table>');
    $('#tableidF1F2').dataTable({
        "scrollY": "350px",
        "scrollCollapse": true,
        "paging": false
    });
    $('#message-bindings').modal({keyboard: true});
};

trjs.keys.printKeys = function (argument) {
    var style = '.p { display:block; margin: 0; padding: 0; } .keysdisplay { font-style: italic; margin-right: 2em; color:#000000; background:#FFFFFF; font-size:larger; } .keysdescr { color:#000000; background:#FFFFFF; } ';
//	var ctn = '<html><head><link href="style/print.css" rel="stylesheet" type="text/css"></head><body>' + trjs.keys.toHtml() + '</body></html>';
    var ctn = '<html><head><style>' + style + '</style></head><body>' + trjs.keys.toHtml() + '</body></html>';
    trjs.utils.printHTML(ctn);
};

trjs.keys.printApiKeys = function (argument) {
    var style = '.p { display:block; margin: 0; padding: 0; } .keysdisplay { font-style: italic; margin-right: 2em; color:#000000; background:#FFFFFF; font-size:larger; } .keysdescr { color:#000000; background:#FFFFFF; } ';
//	var ctn = '<html><head><link href="style/print.css" rel="stylesheet" type="text/css"></head><body>' + trjs.keys.toHtml() + '</body></html>';
    var ctn = '<html><head><style>' + style + '</style></head><body>' + trjs.keys.apiToHtml() + '</body></html>';
    trjs.utils.printHTML(ctn);
};

trjs.keys.printF1F2Keys = function (argument) {
    var style = '.p { display:block; margin: 0; padding: 0; } .keysdisplay { font-style: italic; margin-right: 2em; color:#000000; background:#FFFFFF; font-size:larger; } .keysdescr { color:#000000; background:#FFFFFF; } ';
//	var ctn = '<html><head><link href="style/print.css" rel="stylesheet" type="text/css"></head><body>' + trjs.keys.toHtml() + '</body></html>';
    var ctn = '<html><head><style>' + style + '</style></head><body>' + trjs.keys.f1f2ToHtml() + '</body></html>';
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

trjs.keys.initMacrosBindings = function() {
    trjs.macros.loadTable();
    // Ctrl F2 === 113 et Ctrl F12 = 123
    for (var i=0; i<11; i++) {
        if (trjs.macros.table[i] && trjs.macros.table[i][0])
            trjs.bindings.push([113+i, true, false, false, 'ctrl', trjs.macros.macrofunction(i), trjs.macros.desc(i) ] ); // Ctrl F(2+i)
    }
};

/**
 * structure containing the api keys
 */
trjs.api = {};

trjs.api.key = function (k) {
    trjs.macros.replaceSelectedText(trjs.api.table[k][1]);
    return true;
};

trjs.api.keyValue = function (k) {
    return trjs.api.table[k][1];
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
    /* 68 */ ["R", "ʁ", trjs.messgs.api68],
    /* 69 */ ["P", "ʋ", trjs.messgs.api69],
    /* 70 */ ["w", "w", trjs.messgs.api70],
    /* 71 */ ["H", "ɥ", trjs.messgs.api71],
    /* 72 */ ["j", "j", trjs.messgs.api72],
// others
    /* 73 */ [":", "ː", trjs.messgs.api73],
    /* 74 */ ["~", "~", trjs.messgs.api74],
    /* 75 */ ["~E", "ɛ̃", trjs.messgs.api75],
    /* 76 */ ["~9", "œ̃", trjs.messgs.api76],
    /* 77 */ ["~O", "ɔ̃", trjs.messgs.api77],
    /* 78 */ ["~A", "ɑ̃", trjs.messgs.api78],
    /* 79 */ ["^R", "ʀ", trjs.messgs.api79],
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
trjs.keyToName = {
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
    60: "lesser than",
    62: "greater than",
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
    168: "open parenthesis",
    169: "close parenthesis",
    170: "asterisk",
    186: "semi-colon",
    // 187: "equal sign",
    61: "equal sign",
    188: "comma",
    189: "dash",
    190: "period",
    191: "forward slash",
    192: "grave accent",
    219: "open square bracket",
    220: "back slash",
    221: "close square bracket",
    222: "single quote",
    224: "cmd",
    162: "double quote",
    174: "open curly bracket",
    175: "close curly bracket",
};

trjs.keys.nameToKey = {};

trjs.keys.initNameToKey = function() {
    for (var i in trjs.keyToName) {
        trjs.keys.nameToKey[ trjs.keyToName[i] ] = i;
    }
}

var nkey = function (key) {
    return Number(trjs.keys.nameToKey[ key ]);
}
trjs.keys.nkey = nkey;

/*
 * default binding table
 * the binding table is for the user internationauxrface and can be inserted in the real binding table trjs.tablekeys
 * the trjs.keys.init function allows to initialize or reinitialize the keys.
 * for the future it would be good to allow to store and modify this list of bindings
 */

trjs.bindings = [];

trjs.keys.initBindings = function () {
    /* clé - ctrl alt shift meta function description */
    trjs.bindings.push([nkey("tab"), false, false, false, false, trjs.events.tab, trjs.messgs.bin9]); // Tab
    trjs.bindings.push([nkey("newline"), false, false, false, false, trjs.events.enter, trjs.messgs.bin10]); // return Key
    trjs.bindings.push([nkey("enter"), false, false, false, false, trjs.events.enter, trjs.messgs.bin13]); // return Key
    trjs.bindings.push([nkey("escape"), false, false, false, false, trjs.events.escape, trjs.messgs.bin27]); // Esc
    trjs.bindings.push([nkey("page up"), false, false, false, false, trjs.events.pageUp, trjs.messgs.bin33]); // Page Up
    trjs.bindings.push([nkey("page down"), false, false, false, false, trjs.events.pageDown, trjs.messgs.bin34]); // Page Down
    trjs.bindings.push([nkey("up arrow"), false, false, false, false, trjs.events.keyUp, trjs.messgs.bin38]); // Up
    trjs.bindings.push([nkey("down arrow"), false, false, false, false, trjs.events.keyDown, trjs.messgs.bin40]); // Down
    // reserved for special characters: trjs.bindings.push([nkey("f1"), false, false, false, false, function() {}, trjs.messgs.binxxx]); // F1
    // reserved for special characters: trjs.bindings.push([nkey("f2"), false, false, false, false, function() {}, trjs.messgs.binxxx]); // F2
    trjs.bindings.push([nkey("f3"), false, false, false, false, trjs.media.playJump, trjs.messgs.bin1142]); // F3
    trjs.bindings.push([nkey("f4"), false, false, false, false, trjs.events.setStartAndRedraw, trjs.messgs.bin115]); // F4
    trjs.bindings.push([nkey("f5"), false, false, false, false, trjs.events.setEndAndRedraw, trjs.messgs.bin116]); // F5
    trjs.bindings.push([nkey("f6"), false, false, false, false, trjs.events.insertBlankLineLocAndRedraw, trjs.messgs.bin117]); // F6
    trjs.bindings.push([nkey("f7"), false, false, false, false, trjs.events.runCurrentLine, trjs.messgs.bin118]); // F7
    trjs.bindings.push([nkey("f8"), false, false, false, false, trjs.events.goContinuous, trjs.messgs.bin119]); // F8

    trjs.bindings.push([nkey("1"), true, false, false, 'ctrl', trjs.events.setNthLoc1, trjs.messgs.ctrlbin49]); // Ctrl 1
    trjs.bindings.push([nkey("2"), true, false, false, 'ctrl', trjs.events.setNthLoc2, trjs.messgs.ctrlbin50]); // Ctrl 2
    trjs.bindings.push([nkey("3"), true, false, false, 'ctrl', trjs.events.setNthLoc3, trjs.messgs.ctrlbin51]); // Ctrl 3
    trjs.bindings.push([nkey("4"), true, false, false, 'ctrl', trjs.events.setNthLoc4, trjs.messgs.ctrlbin52]); // Ctrl 4
    trjs.bindings.push([nkey("5"), true, false, false, 'ctrl', trjs.events.setNthLoc5, trjs.messgs.ctrlbin53]); // Ctrl 5
    trjs.bindings.push([nkey("6"), true, false, false, 'ctrl', trjs.events.setNthLoc6, trjs.messgs.ctrlbin54]); // Ctrl 6
    trjs.bindings.push([nkey("7"), true, false, false, 'ctrl', trjs.events.setNthLoc7, trjs.messgs.ctrlbin55]); // Ctrl 7
    trjs.bindings.push([nkey("8"), true, false, false, 'ctrl', trjs.events.setNthLoc8, trjs.messgs.ctrlbin56]); // Ctrl 8
    trjs.bindings.push([nkey("9"), true, false, false, 'ctrl', trjs.events.setNthLoc9, trjs.messgs.ctrlbin57]); // Ctrl 9

    trjs.bindings.push([nkey("end"), true, false, false, 'ctrl', trjs.events.ctrlEnd, trjs.messgs.ctrlbin35]); // Ctrl End
    trjs.bindings.push([nkey("home"), true, false, false, 'ctrl', trjs.events.ctrlHome, trjs.messgs.ctrlbin36]); // Ctrl Home
    trjs.bindings.push([nkey("b"), true, false, false, 'ctrl', trjs.events.splitLineLocAndRedraw, trjs.messgs.ctrlbin66]); // Ctrl B
    trjs.bindings.push([nkey("d"), true, false, false, 'ctrl', trjs.events.deleteLineAndRedraw, trjs.messgs.ctrlbin68]); // Ctrl D
    trjs.bindings.push([nkey("e"), true, false, false, 'ctrl', trjs.check.currentLineCheck, 'Check current line']); // Ctrl E
    trjs.bindings.push([nkey("f"), true, false, false, 'ctrl', trjs.editor.showSearch, trjs.messgs.ctrlaltbin70]); // Ctrl F
    trjs.bindings.push([nkey("g"), true, false, false, 'ctrl', trjs.events.setDivPlusInsert, trjs.messgs.ctrlbin71]); // Ctrl G
    trjs.bindings.push([nkey("i"), true, false, false, 'ctrl', trjs.events.insertBlankLineAndRedraw, trjs.messgs.ctrlbin73]); // Ctrl I
    trjs.bindings.push([nkey("j"), true, false, false, 'ctrl', trjs.events.joinLine, trjs.messgs.ctrlbin74]); // Ctrl J
    trjs.bindings.push([nkey("l"), true, false, false, 'ctrl', trjs.editor.showLine, trjs.messgs.ctrlbin76]); // Ctrl L
    trjs.bindings.push([nkey("m"), true, false, false, 'ctrl', trjs.events.insertWithTimeAndRedraw, trjs.messgs.ctrlbin77]); // Ctrl M
    trjs.bindings.push([nkey("o"), true, false, false, 'ctrl', trjs.editor.openTranscript, trjs.messgs.ctrlbin79]); // Ctrl O
    trjs.bindings.push([nkey("r"), true, false, false, 'ctrl', trjs.events.replicateLineAndRedraw, trjs.messgs.ctrlbin82]); // Ctrl R
    trjs.bindings.push([nkey("s"), true, false, false, 'ctrl', trjs.editor.save, trjs.messgs.ctrlbin83]); // Ctrl S
    trjs.bindings.push([nkey("t"), true, false, false, 'ctrl', trjs.editor.showTime, trjs.messgs.ctrlbin84]); // Ctrl T
    trjs.bindings.push([nkey("u"), true, false, false, 'ctrl', trjs.editor.hideDiv, trjs.messgs.ctrlbin85]); // Ctrl U
    trjs.bindings.push([nkey("y"), true, false, false, 'ctrl', trjs.undo.redo, trjs.messgs.ctrlbin89]); // Ctrl Y
    trjs.bindings.push([nkey("z"), true, false, false, 'ctrl', trjs.undo.undo, trjs.messgs.ctrlbin90]); // Ctrl Z

    trjs.bindings.push([nkey("f8"), true, false, false, 'ctrl', trjs.editor.zoomGlobalOut, trjs.messgs.ctrlbin107]); // Ctrl F8
    trjs.bindings.push([nkey("f9"), true, false, false, 'ctrl', trjs.editor.zoomGlobalIn, trjs.messgs.ctrlbin109]); // Ctrl F9

    trjs.bindings.push([nkey("1"), true, false, true, 'ctrl', trjs.events.setDivPlus, trjs.messgs.ctrlshiftbin49]); // Ctrl Shift 1
    trjs.bindings.push([nkey("2"), true, false, true, 'ctrl', trjs.events.setDivMinus, trjs.messgs.ctrlshiftbin50]); // Ctrl Shift 2
    trjs.bindings.push([nkey("g"), true, false, true, 'ctrl', trjs.events.setDivMissingMinus, trjs.messgs.ctrlshiftbin71]); // Ctrl Shift G
    /*
    trjs.bindings.push([nkey("1"), true, true, false, 'ctrl', trjs.events.setNthTier1, trjs.messgs.ctrlaltbin49]); // Ctrl Alt 1
    trjs.bindings.push([nkey("2"), true, true, false, 'ctrl', trjs.events.setNthTier2, trjs.messgs.ctrlaltbin50]); // Ctrl Alt 2
    trjs.bindings.push([nkey("3"), true, true, false, 'ctrl', trjs.events.setNthTier3, trjs.messgs.ctrlaltbin51]); // Ctrl Alt 3
    trjs.bindings.push([nkey("4"), true, true, false, 'ctrl', trjs.events.setNthTier4, trjs.messgs.ctrlaltbin52]); // Ctrl Alt 4
    trjs.bindings.push([nkey("5"), true, true, false, 'ctrl', trjs.events.setNthTier5, trjs.messgs.ctrlaltbin53]); // Ctrl Alt 5
    trjs.bindings.push([nkey("6"), true, true, false, 'ctrl', trjs.events.setNthTier6, trjs.messgs.ctrlaltbin54]); // Ctrl Alt 6
    trjs.bindings.push([nkey("7"), true, true, false, 'ctrl', trjs.events.setNthTier7, trjs.messgs.ctrlaltbin55]); // Ctrl Alt 7
    trjs.bindings.push([nkey("8"), true, true, false, 'ctrl', trjs.events.setNthTier8, trjs.messgs.ctrlaltbin56]); // Ctrl Alt 8
    trjs.bindings.push([nkey("9"), true, true, false, 'ctrl', trjs.events.setNthTier9, trjs.messgs.ctrlaltbin57]); // Ctrl Alt 9
    */
    trjs.bindings.push([nkey("a"), true, true, false, 'ctrl', trjs.transcription.selectAllMS, trjs.messgs.ctrlaltbin65]); // Ctrl Alt A
    trjs.bindings.push([nkey("b"), true, true, false, 'ctrl', trjs.events.splitLineAndRedraw, trjs.messgs.ctrlaltbin66]); // Ctrl Alt B
    trjs.bindings.push([nkey("d"), true, true, false, 'ctrl', trjs.events.deleteLineLocAndRedraw, trjs.messgs.ctrlaltbin68]); // Ctrl Alt D
    trjs.bindings.push([nkey("e"), true, true, false, 'ctrl', trjs.events.chooseInputDevice, 'Choose output sound device']); // Ctrl Shift E
//    trjs.bindings.push([70, true, false, false, 'ctrl', trjs.editor.showSearch, trjs.messgs.ctrlaltbin70]); // Ctrl F
    trjs.bindings.push([nkey("g"), true, true, false, 'ctrl', trjs.events.setDivMinusInsert, trjs.messgs.ctrlaltbin71]); // Ctrl Alt G
    trjs.bindings.push([nkey("i"), true, true, false, 'ctrl', trjs.events.setTimeReplaceLocAndRedraw, trjs.messgs.ctrlaltbin73]); // Ctrl Alt I
    if (trjs.utils.isWindows()) {
        trjs.bindings.push([nkey("h"), true, true, false, 'ctrl', trjs.events.joinLineLoc, trjs.messgs.ctrlaltbin74]); // Ctrl Alt H
    } else {
        trjs.bindings.push([nkey("j"), true, true, false, 'ctrl', trjs.events.joinLineLoc, trjs.messgs.ctrlaltbin74]); // Ctrl Alt J
    }
    trjs.bindings.push([nkey("m"), true, true, false, 'ctrl', trjs.events.setTimeReplaceAndRedraw, trjs.messgs.ctrlaltbin77]); // Ctrl Alt M
    trjs.bindings.push([nkey("o"), true, true, false, 'ctrl', trjs.editor.openMedia, trjs.messgs.ctrlaltbin79]); // Ctrl Alt O
    trjs.bindings.push([nkey("r"), true, true, false, 'ctrl', trjs.events.splitLineAndRedraw, trjs.messgs.ctrlaltbin82]); // Ctrl Alt R
    trjs.bindings.push([nkey("u"), true, true, false, 'ctrl', trjs.editor.showDiv, trjs.messgs.ctrlaltbin85]); // Ctrl Alt U

    /*
    trjs.bindings.push( [nkey("f2"), true, true, false, 'ctrl', trjs.keys.colorRed, trjs.messgs.ctrlaltbin113 ] ); // Ctrl Alt F2
    trjs.bindings.push( [nkey("f3"), true, true, false, 'ctrl', trjs.keys.colorGreen, trjs.messgs.ctrlaltbin114 ] ); // Ctrl Alt F3
    trjs.bindings.push( [nkey("f4"), true, true, false, 'ctrl', trjs.keys.colorBlue, trjs.messgs.ctrlaltbin115 ] ); // Ctrl Alt F4
    trjs.bindings.push( [nkey("f5"), true, true, false, 'ctrl', trjs.keys.bold, trjs.messgs.ctrlaltbin116 ] ); // Ctrl Alt F5
    trjs.bindings.push( [nkey("f6"), true, true, false, 'ctrl', trjs.keys.italics, trjs.messgs.ctrlaltbin117 ] ); // Ctrl Alt F6
    trjs.bindings.push( [nkey("f7"), true, true, false, 'ctrl', trjs.keys.emphasis, trjs.messgs.ctrlaltbin118 ] ); // Ctrl Alt F7

    trjs.bindings.push([nkey("f8"), true, true, false, 'ctrl', trjs.media.playSlower, trjs.messgs.ctrlaltbin115]); // Ctrl Alt F8
    trjs.bindings.push([nkey("f9"), true, true, false, 'ctrl', trjs.media.playFaster, trjs.messgs.ctrlaltbin116]); // Ctrl Alt F9
    trjs.bindings.push([nkey("f10"), true, true, false, 'ctrl', trjs.media.playReverse, trjs.messgs.ctrlaltbin66]); // Ctrl Alt F10
    trjs.bindings.push([nkey("f11"), true, true, false, 'ctrl', trjs.media.playNormal, trjs.messgs.ctrlaltbin69]); // Ctrl Alt F11
    */

    //trjs.bindings.push([119, true, true, false, 'ctrl', trjs.transcription.setMultipleSelection, trjs.messgs.ctrlaltbin119]); // Ctrl Alt F8
    //trjs.bindings.push([120, true, true, false, 'ctrl', trjs.transcription.exportMStoSubtSrt, trjs.messgs.ctrlaltbin120]); // Ctrl Alt F9
    //trjs.bindings.push([121, true, true, false, 'ctrl', trjs.transcription.exportMStoSubtAss, trjs.messgs.ctrlaltbin121]); // Ctrl Alt F10
    //trjs.bindings.push([122, true, true, false, 'ctrl', trjs.transcription.exportMStoMediaSubt, trjs.messgs.ctrlaltbin122]); // Ctrl Alt F11
    trjs.bindings.push([nkey("f12"), true, true, false, 'ctrl', trjs.transcription.exportMStoMedia, trjs.messgs.ctrlaltbin123]); // Ctrl Alt F12

    trjs.bindings.push([nkey("f1"), false, true, true, false, trjs.macros.generic, trjs.messgs.generic ] ); // Alt Shift F1
    /* 113 à 123 pour Alt Shift F2 à F12 à converser pour les macros */

    trjs.bindings.push([nkey("left arrow"), false, true, false, false, trjs.media.backwardStep, trjs.messgs.altbin37]); // Alt Left
    trjs.bindings.push([nkey("up arrow"), false, true, false, false, trjs.events.keyLocUp, trjs.messgs.altbin38]); // Alt Up
    trjs.bindings.push([nkey("right arrow"), false, true, false, false, trjs.media.forwardStep, trjs.messgs.altbin39]); // Alt Right
    trjs.bindings.push([nkey("down arrow"), false, true, false, false, trjs.events.keyLocDown, trjs.messgs.altbin40]); // Alt Down

    trjs.bindings.push([nkey("f1"), false, true, false, false, trjs.events.tab, trjs.messgs.bin9]); // Alt F1
    trjs.bindings.push([nkey("f2"), false, true, false, false, trjs.media.makeSmall, trjs.messgs.altbin113]); // Alt F2
    trjs.bindings.push([nkey("f3"), false, true, false, false, trjs.media.makeBig, trjs.messgs.altbin114]); // Alt F3
    trjs.bindings.push([nkey("f6"), false, true, false, false, trjs.events.insertWithTimeLocAndRedraw, trjs.messgs.altbin117]); // Alt F6
    trjs.bindings.push([nkey("f7"), false, true, false, false, trjs.events.runThreeLines, trjs.messgs.altbin118]); // Alt F7
    trjs.bindings.push([nkey("f11"), false, true, false, false, trjs.transcription.sort, "sort all lines by times"]); // Alt F11
    trjs.bindings.push([nkey("f12"), false, true, false, false, trjs.undo.undoList, "display undo/redo list"]); // Alt F12

    trjs.bindings.push([nkey("tab"), false, false, true, false, trjs.events.shiftTab, trjs.messgs.shiftbin9]); // Shift Tab
    trjs.bindings.push([nkey("f1"), false, false, true, false, trjs.media.playPause, trjs.messgs.shiftbin112]); // Shift F1
    trjs.bindings.push([nkey("f7"), false, false, true, false, trjs.media.playPause, trjs.messgs.shiftbin112]); // Shift F7
    trjs.bindings.push([nkey("f6"), false, false, true, false, trjs.events.insertBlankLineLocBeforeAndRedraw, trjs.messgs.shiftbin117]); // Shift F6

    /*
     trjs.keys.special1 = function() { console.timeEnd("page"); };
     trjs.bindings.push( [114, false, false, true, false, trjs.keys.special1, trjs.messgs.shiftbin114 ] ); // Shift F3
     trjs.bindings.push([115, false, false, true, false, trjs.io.htmlSave, trjs.messgs.shiftbin115]); // Shift F4
     */
};

trjs.apiBindings = [];

trjs.keys.initApiBindings = function () {
    /* clé - ctrl alt shift meta function description */
    trjs.apiBindings.push([48, false, true, false, false, function () { trjs.api.key(9); }, trjs.api.desc(9), trjs.api.keyValue(9)]); // Alt 0 et Alt @
    trjs.apiBindings.push([50, false, true, false, false, function () { trjs.api.key(6); }, trjs.api.desc(6), trjs.api.keyValue(6)]); // Alt 2
    trjs.apiBindings.push([57, false, true, false, false, function () { trjs.api.key(7); }, trjs.api.desc(7), trjs.api.keyValue(7)]); // Alt 9
    trjs.apiBindings.push([58, false, true, false, false, function () { trjs.api.key(73); }, trjs.api.desc(73), trjs.api.keyValue(73)]); // Alt :
    trjs.apiBindings.push([65, false, true, false, false, function () { trjs.api.key(19); }, trjs.api.desc(19), trjs.api.keyValue(19)]); // Alt A
    trjs.apiBindings.push([68, false, true, false, false, function () { trjs.api.key(43); }, trjs.api.desc(43), trjs.api.keyValue(43)]); // Alt D
    trjs.apiBindings.push([69, false, true, false, false, function () { trjs.api.key(3); }, trjs.api.desc(3), trjs.api.keyValue(3)]); // Alt E
    trjs.apiBindings.push([72, false, true, false, false, function () { trjs.api.key(71); }, trjs.api.desc(71), trjs.api.keyValue(71)]); // Alt H
    trjs.apiBindings.push([73, false, true, false, false, function () { trjs.api.key(1); }, trjs.api.desc(1), trjs.api.keyValue(1)]); // Alt I
    trjs.apiBindings.push([74, false, true, false, false, function () { trjs.api.key(60); }, trjs.api.desc(60), trjs.api.keyValue(60)]); // Alt J
    trjs.apiBindings.push([78, false, true, false, false, function () { trjs.api.key(61); }, trjs.api.desc(61), trjs.api.keyValue(61)]); // Alt N
    trjs.apiBindings.push([79, false, true, false, false, function () { trjs.api.key(23); }, trjs.api.desc(23), trjs.api.keyValue(23)]); // Alt O
    trjs.apiBindings.push([81, false, true, false, false, function () { trjs.api.key(24); }, trjs.api.desc(24), trjs.api.keyValue(24)]); // Alt Q
    trjs.apiBindings.push([82, false, true, false, false, function () { trjs.api.key(68); }, trjs.api.desc(68), trjs.api.keyValue(68)]); // Alt R
    trjs.apiBindings.push([83, false, true, false, false, function () { trjs.api.key(46); }, trjs.api.desc(46), trjs.api.keyValue(46)]); // Alt S
    trjs.apiBindings.push([84, false, true, false, false, function () { trjs.api.key(42); }, trjs.api.desc(42), trjs.api.keyValue(42)]); // Alt T
    trjs.apiBindings.push([85, false, true, false, false, function () { trjs.api.key(21); }, trjs.api.desc(21), trjs.api.keyValue(21)]); // Alt U
    trjs.apiBindings.push([86, false, true, false, false, function () { trjs.api.key(18); }, trjs.api.desc(18), trjs.api.keyValue(18)]); // Alt V
    trjs.apiBindings.push([88, false, true, false, false, function () { trjs.api.key(51); }, trjs.api.desc(51), trjs.api.keyValue(51)]); // Alt X
    trjs.apiBindings.push([90, false, true, false, false, function () { trjs.api.key(47); }, trjs.api.desc(47), trjs.api.keyValue(47)]); // Alt Z
    trjs.apiBindings.push([78, false, true, true, false, function () { trjs.api.key(74); }, trjs.api.desc(74), trjs.api.keyValue(74)]); // Alt Shift N
    trjs.apiBindings.push([69, false, true, true, false, function () { trjs.api.key(75); }, trjs.api.desc(75), trjs.api.keyValue(75)]); // Shift Alt E
    trjs.apiBindings.push([57, false, true, true, false, function () { trjs.api.key(76); }, trjs.api.desc(76), trjs.api.keyValue(76)]); // Shift Alt 9
    trjs.apiBindings.push([79, false, true, true, false, function () { trjs.api.key(77); }, trjs.api.desc(77), trjs.api.keyValue(77)]); // Shift Alt O
    trjs.apiBindings.push([65, false, true, true, false, function () { trjs.api.key(78); }, trjs.api.desc(78), trjs.api.keyValue(78)]); // Shift Alt A
    trjs.apiBindings.push([82, false, true, true, false, function () { trjs.api.key(79); }, trjs.api.desc(79), trjs.api.keyValue(79)]); // Shift Alt R

// liste des caractère nom de domaine internationaux pour le français : ß à á â ã ä å æ ç è é ê ë ì í î ï ñ ò ó ô õ ö ù ú û ü ý ÿ œ
};

trjs.F1 = {};

trjs.F1.table = [
    //        Character Name, Char,  Function, F1 +, Unicode
    /* 0 */ [ "up-arrow", "↑", "shift to high pitch", "up arrow", "2191" ],
    /* 1 */ [ "down-arrow", "↓", "shift to low pitch", "down arrow", "2193" ],
    /* 2 */ [ "double arrow tilted up", "⇗", "rising to high (?)", "1", "21D7" ],
    /* 3 */ [ "single arrow tilted up", "↗", "rising to mid (¿)", "2", "2197" ],
    /* 4 */ [ "level arrow", "→", "level (,)", "3", "2192" ],
    /* 5 */ [ "single arrow tilted down", "↘", "falling to mid (;)", "4", "2198" ],
    /* 6 */ [ "double arrow tilted down", "⇘", "falling to low (.)", "5", "21D8" ],
    /* 7 */ [ "infinity mark", "∞", "unmarked ending", "6", "221E" ],
    /* 8 */ [ "double wavy equals", "≈", "+≈ continuation within speaker", "=", "2248" ],
    /* 9 */ [ "triple wavy equals", "≋", "+≋ continuation across other speaker", "+", "224B" ],
    /* 10 */ [ "triple equal", "≡", "≡uptake (turn internal)", "u", "2261" ],
    /* 11 */ [ "raised period", "∙", "inhalation", ".", "2219" ],
    /* 12 */ [ "open bracket top", "⌈", "top begin overlap", "[", "2308" ],
    /* 13 */ [ "close bracket top", "⌉", "top end overlap", "]", "2309" ],
    /* 14 */ [ "open bracket bottom", "⌊", "bottom begin overlap", "shift [", "230A" ],
    /* 15 */ [ "closed bracket bottom", "⌋", "bottom end overlap", "shift ]", "230B" ],
    /* 16 */ [ "up triangle", "∆", "∆faster∆ \"> <\"", "right arrow", "2206" ],
    /* 17 */ [ "down triangle", "∇", "∇slower∇ \"< >\"", "left arrow", "2207" ],
    /* 18 */ [ "low asterisk", "⁎", "⁎creaky⁎", "*", "204E" ],
    /* 19 */ [ "double question mark", "⁇", "⁇unsure⁇", "/", "2047" ],
    /* 20 */ [ "degree sign", "°", "°softer°", "zero", "00B0" ],
    /* 21 */ [ "fisheye", "◉", "◉louder◉", ")", "25C9" ],
    /* 22 */ [ "low bar", "▁", "▁low pitch▁", "d", "2581" ],
    /* 23 */ [ "high bar", "▔", "▔high pitch▔", "h", "2594" ],
    /* 24 */ [ "smiley", "☺", "☺smile voice☺", "l", "263A" ],
    /* 25 */ [ "breathy", "♋", "♋breathy♋", "b", "264B" ],
    /* 26 */ [ "double integral", "∬", "∬whisper∬", "w", "222C" ],
    /* 27 */ [ "upsilon with dialytika", "Ϋ", "Ϋ yawn Ϋ", "y", "03AB" ],
    /* 28 */ [ "clockwise contour integral", "∲", "∲ singing ∲", "s", "222E" ],
    /* 29 */ [ "section marker", "§", "§ precise§", "p", "00A7" ],
    /* 30 */ [ "tilde", "∾", "constriction∾", "n", "223E" ],
    /* 31 */ [ "half circle", "↻", "↻pitch reset", "r", "21BB" ],
    /* 32 */ [ "capital H with dasia", "Ἡ", "laugh in a word", "c", "1F29" ],
];

trjs.F1.key = function (k) {
    trjs.macros.replaceSelectedText(trjs.F1.table[k][1]);
    return true;
};

trjs.F1.keyValue = function (k) {
    return trjs.F1.table[k][1];
};

trjs.F1.desc = function (k) {
    return trjs.F1.table[k][0] + " = " + trjs.F1.table[k][2];
};

trjs.F1Bindings = [];

trjs.keys.initF1Bindings = function () {
    /* clé - ctrl alt shift meta function description value */
    trjs.F1Bindings.push([nkey("up arrow"), false, false, false, false, function () { trjs.F1.key(0); }, trjs.F1.desc(0), trjs.F1.keyValue(0)]); // up arrow
    trjs.F1Bindings.push([nkey("down arrow"), false, false, false, false, function () { trjs.F1.key(1); }, trjs.F1.desc(1), trjs.F1.keyValue(1)]); //
    trjs.F1Bindings.push([nkey("1"), false, false, false, false, function () { trjs.F1.key(2); }, trjs.F1.desc(2), trjs.F1.keyValue(2)]); //
    trjs.F1Bindings.push([nkey("2"), false, false, false, false, function () { trjs.F1.key(3); }, trjs.F1.desc(3), trjs.F1.keyValue(3)]); //
    trjs.F1Bindings.push([nkey("3"), false, false, false, false, function () { trjs.F1.key(4); }, trjs.F1.desc(4), trjs.F1.keyValue(4)]); //
    trjs.F1Bindings.push([nkey("4"), false, false, false, false, function () { trjs.F1.key(5); }, trjs.F1.desc(5), trjs.F1.keyValue(5)]); //
    trjs.F1Bindings.push([nkey("5"), false, false, false, false, function () { trjs.F1.key(6); }, trjs.F1.desc(6), trjs.F1.keyValue(6)]); //
    trjs.F1Bindings.push([nkey("6"), false, false, false, false, function () { trjs.F1.key(7); }, trjs.F1.desc(7), trjs.F1.keyValue(7)]); //
    trjs.F1Bindings.push([nkey("equal sign"), false, false, false, false, function () { trjs.F1.key(8); }, trjs.F1.desc(8), trjs.F1.keyValue(8)]); //
    trjs.F1Bindings.push([nkey("add"), false, false, true, false, function () { trjs.F1.key(9); }, trjs.F1.desc(9), trjs.F1.keyValue(9)]); //
    trjs.F1Bindings.push([nkey("u"), false, false, false, false, function () { trjs.F1.key(10); }, trjs.F1.desc(10), trjs.F1.keyValue(10)]); //
    trjs.F1Bindings.push([nkey("period"), false, false, false, false, function () { trjs.F1.key(11); }, trjs.F1.desc(11), trjs.F1.keyValue(11)]); //
    trjs.F1Bindings.push([nkey("open square bracket"), false, false, false, false, function () { trjs.F1.key(12); }, trjs.F1.desc(12), trjs.F1.keyValue(12)]); //
    trjs.F1Bindings.push([nkey("close square bracket"), false, false, false, false, function () { trjs.F1.key(13); }, trjs.F1.desc(13), trjs.F1.keyValue(13)]); //
    trjs.F1Bindings.push([nkey("open square bracket"), false, false, true, false, function () { trjs.F1.key(14); }, trjs.F1.desc(14), trjs.F1.keyValue(14)]); //
    trjs.F1Bindings.push([nkey("close square bracket"), false, false, true, false, function () { trjs.F1.key(15); }, trjs.F1.desc(15), trjs.F1.keyValue(15)]); //
    trjs.F1Bindings.push([nkey("right arrow"), false, false, false, false, function () { trjs.F1.key(16); }, trjs.F1.desc(16), trjs.F1.keyValue(16)]); //
    trjs.F1Bindings.push([nkey("left arrow"), false, false, false, false, function () { trjs.F1.key(17); }, trjs.F1.desc(17), trjs.F1.keyValue(17)]); //
    trjs.F1Bindings.push([nkey("star"), false, false, false, false, function () { trjs.F1.key(18); }, trjs.F1.desc(18), trjs.F1.keyValue(18)]); //
    trjs.F1Bindings.push([nkey("forward slash"), false, false, true, false, function () { trjs.F1.key(19); }, trjs.F1.desc(19), trjs.F1.keyValue(19)]); //
    trjs.F1Bindings.push([nkey("close parenthesis"), false, false, false, false, function () { trjs.F1.key(20); }, trjs.F1.desc(20), trjs.F1.keyValue(20)]); //
    trjs.F1Bindings.push([nkey("d"), false, false, false, false, function () { trjs.F1.key(21); }, trjs.F1.desc(21), trjs.F1.keyValue(21)]); //
    trjs.F1Bindings.push([nkey("h"), false, false, false, false, function () { trjs.F1.key(22); }, trjs.F1.desc(22), trjs.F1.keyValue(22)]); //
    trjs.F1Bindings.push([nkey("l"), false, false, false, false, function () { trjs.F1.key(23); }, trjs.F1.desc(23), trjs.F1.keyValue(23)]); //
    trjs.F1Bindings.push([nkey("b"), false, false, false, false, function () { trjs.F1.key(24); }, trjs.F1.desc(24), trjs.F1.keyValue(24)]); //
    trjs.F1Bindings.push([nkey("w"), false, false, false, false, function () { trjs.F1.key(25); }, trjs.F1.desc(25), trjs.F1.keyValue(25)]); //
    trjs.F1Bindings.push([nkey("y"), false, false, false, false, function () { trjs.F1.key(26); }, trjs.F1.desc(26), trjs.F1.keyValue(26)]); //
    trjs.F1Bindings.push([nkey("s"), false, false, false, false, function () { trjs.F1.key(27); }, trjs.F1.desc(27), trjs.F1.keyValue(27)]); //
    trjs.F1Bindings.push([nkey("p"), false, false, false, false, function () { trjs.F1.key(28); }, trjs.F1.desc(28), trjs.F1.keyValue(28)]); //
    trjs.F1Bindings.push([nkey("n"), false, false, false, false, function () { trjs.F1.key(29); }, trjs.F1.desc(29), trjs.F1.keyValue(29)]); //
    trjs.F1Bindings.push([nkey("r"), false, false, false, false, function () { trjs.F1.key(30); }, trjs.F1.desc(30), trjs.F1.keyValue(30)]); //
    trjs.F1Bindings.push([nkey("c"), false, false, false, false, function () { trjs.F1.key(31); }, trjs.F1.desc(31), trjs.F1.keyValue(31)]); //
};

trjs.F2 = {};

trjs.F2.table = [
    //        Character Name, Char,  Function, F2 +, Unicode
    /* 34 */ [ "lower quote", "„", "tag or sentence final particle", "t", "201E" ],
    /* 35 */ [ "double dagger", "‡", "vocative or summons", "v", "2021" ],
    /* 36 */ [ "dot", "ạ", "Arabic dot", ",", "323" ],
    /* 37 */ [ "raised h", "ʰ", "Arabic aspiration", "H", "02B0" ],
    /* 38 */ [ "macron", "ā", "Hebrew stressed syllable", "-", "304" ],
    /* 39 */ [ "glottal", "ʔ", "glottal stop", "q", "294" ],
    /* 40 */ [ "reverse glottal", "ʕ", "Hebrew glottal", "Q", "295" ],
    /* 41 */ [ "caron", "š", "caron", ";", "030C" ],
    /* 42 */ [ "raised stroke", "ˈ", "primary stress", "1", "02C8" ],
    /* 43 */ [ "lowered stroke", "ˌ", "secondary stress", "2", "02CC" ],
    /* 44 */ [ "open paren", "‹", "begin phono group", "<", "2039" ],
    /* 45 */ [ "closed paren", "›", "end phono group", ">", "203A" ],
    /* 46 */ [ "open paren", "〔", "begin sign group", "{", "3014" ],
    /* 47 */ [ "closed paren", "〕", "end sign group", "}", "3015" ],
    /* 48 */ [ "open double quote", "“", "begin quote", "\'", "201C" ],
    /* 49 */ [ "closed double quote", "”", "end quote", "\"", "201D" ],
];

trjs.F2.key = function (k) {
    trjs.macros.replaceSelectedText(trjs.F2.table[k][1]);
    return true;
};

trjs.F2.keyValue = function (k) {
    return trjs.F2.table[k][1];
};

trjs.F2.desc = function (k) {
    return trjs.F2.table[k][0] + " = " + trjs.F2.table[k][2];
};

trjs.F2Bindings = [];

trjs.keys.initF2Bindings = function () {
    // clé - ctrl alt shift meta function description value
    trjs.F2Bindings.push([nkey("t"), false, false, false, false, function () { trjs.F2.key(0); }, trjs.F2.desc(0), trjs.F2.keyValue(0)]); // up arrow
    trjs.F2Bindings.push([nkey("v"), false, false, false, false, function () { trjs.F2.key(1); }, trjs.F2.desc(1), trjs.F2.keyValue(1)]); //
    trjs.F2Bindings.push([nkey("comma"), false, false, false, false, function () { trjs.F2.key(2); }, trjs.F2.desc(2), trjs.F2.keyValue(2)]); //
    trjs.F2Bindings.push([nkey("h"), false, false, false, false, function () { trjs.F2.key(3); }, trjs.F2.desc(3), trjs.F2.keyValue(3)]); //
    trjs.F2Bindings.push([nkey("minus"), false, false, false, false, function () { trjs.F2.key(4); }, trjs.F2.desc(4), trjs.F2.keyValue(4)]); //
    trjs.F2Bindings.push([nkey("q"), false, false, false, false, function () { trjs.F2.key(5); }, trjs.F2.desc(5), trjs.F2.keyValue(5)]); //
    trjs.F2Bindings.push([nkey("q"), false, false, true, false, function () { trjs.F2.key(6); }, trjs.F2.desc(6), trjs.F2.keyValue(6)]); //
    trjs.F2Bindings.push([nkey("semi-colon"), false, false, false, false, function () { trjs.F2.key(7); }, trjs.F2.desc(7), trjs.F2.keyValue(7)]); //
    trjs.F2Bindings.push([nkey("1"), false, false, false, false, function () { trjs.F2.key(8); }, trjs.F2.desc(8), trjs.F2.keyValue(8)]); //
    trjs.F2Bindings.push([nkey("2"), false, false, false, false, function () { trjs.F2.key(9); }, trjs.F2.desc(9), trjs.F2.keyValue(9)]); //
    trjs.F2Bindings.push([nkey("lesser than"), false, false, false, false, function () { trjs.F2.key(10); }, trjs.F2.desc(10), trjs.F2.keyValue(10)]); //
    trjs.F2Bindings.push([nkey("greater than"), false, false, false, false, function () { trjs.F2.key(11); }, trjs.F2.desc(11), trjs.F2.keyValue(11)]); //
    trjs.F2Bindings.push([nkey("open curly bracket"), false, false, false, false, function () { trjs.F2.key(12); }, trjs.F2.desc(12), trjs.F2.keyValue(12)]); //
    trjs.F2Bindings.push([nkey("close curly bracket"), false, false, false, false, function () { trjs.F2.key(13); }, trjs.F2.desc(13), trjs.F2.keyValue(13)]); //
    trjs.F2Bindings.push([nkey("single quote"), false, false, false, false, function () { trjs.F2.key(14); }, trjs.F2.desc(14), trjs.F2.keyValue(14)]); //
    trjs.F2Bindings.push([nkey("double quote"), false, false, false, false, function () { trjs.F2.key(15); }, trjs.F2.desc(15), trjs.F2.keyValue(15)]); //

    trjs.F2Bindings.push( [nkey("f3"), false, false, false, false, trjs.events.setNthLoc1, trjs.messgs.ctrlbin49]); // F2 F3
    trjs.F2Bindings.push( [nkey("f4"), false, false, false, false, trjs.events.setNthLoc2, trjs.messgs.ctrlbin50]); // F2 F4
    trjs.F2Bindings.push( [nkey("f5"), false, false, false, false, trjs.events.setNthLoc3, trjs.messgs.ctrlbin51]); // F2 F5
    trjs.F2Bindings.push( [nkey("f6"), false, false, false, false, trjs.events.setNthLoc4, trjs.messgs.ctrlbin52]); // F2 F6
    trjs.F2Bindings.push( [nkey("f7"), false, false, false, false, trjs.events.setNthLoc5, trjs.messgs.ctrlbin53]); // F2 F7
    trjs.F2Bindings.push( [nkey("f8"), false, false, false, false, trjs.events.setNthLoc6, trjs.messgs.ctrlbin54]); // F2 F8
    trjs.F2Bindings.push( [nkey("f9"), false, false, false, false, trjs.events.setNthLoc7, trjs.messgs.ctrlbin55]); // F2 F9
    trjs.F2Bindings.push([nkey("f10"), false, false, false, false, trjs.events.setNthLoc8, trjs.messgs.ctrlbin56]); // F2 F10
    trjs.F2Bindings.push([nkey("f11"), false, false, false, false, trjs.events.setNthLoc9, trjs.messgs.ctrlbin57]); // F2 F11

    trjs.F2Bindings.push( [nkey("f3"), true, true, false, 'ctrl', trjs.events.setNthTier1, trjs.messgs.ctrlaltbin49]); // F2 ctrl alt F3
    trjs.F2Bindings.push( [nkey("f4"), true, true, false, 'ctrl', trjs.events.setNthTier2, trjs.messgs.ctrlaltbin50]); // F2 ctrl alt F4
    trjs.F2Bindings.push( [nkey("f5"), true, true, false, 'ctrl', trjs.events.setNthTier3, trjs.messgs.ctrlaltbin51]); // F2 ctrl alt F5
    trjs.F2Bindings.push( [nkey("f6"), true, true, false, 'ctrl', trjs.events.setNthTier4, trjs.messgs.ctrlaltbin52]); // F2 ctrl alt F6
    trjs.F2Bindings.push( [nkey("f7"), true, true, false, 'ctrl', trjs.events.setNthTier5, trjs.messgs.ctrlaltbin53]); // F2 ctrl alt F7
    trjs.F2Bindings.push( [nkey("f8"), true, true, false, 'ctrl', trjs.events.setNthTier6, trjs.messgs.ctrlaltbin54]); // F2 ctrl alt F8
    trjs.F2Bindings.push( [nkey("f9"), true, true, false, 'ctrl', trjs.events.setNthTier7, trjs.messgs.ctrlaltbin55]); // F2 ctrl alt F9
    trjs.F2Bindings.push([nkey("f10"), true, true, false, 'ctrl', trjs.events.setNthTier8, trjs.messgs.ctrlaltbin56]); // F2 ctrl alt F10
    trjs.F2Bindings.push([nkey("f11"), true, true, false, 'ctrl', trjs.events.setNthTier9, trjs.messgs.ctrlaltbin57]); // F2 ctrl alt F11

    trjs.F2Bindings.push( [nkey("f5"), false, true, false, false, trjs.keys.colorRed, trjs.messgs.ctrlaltbin113, 'RED' ] ); // F2 alt F5
    trjs.F2Bindings.push( [nkey("f6"), false, true, false, false, trjs.keys.colorGreen, trjs.messgs.ctrlaltbin114, 'GREEN' ] ); // F2 alt F6
    trjs.F2Bindings.push( [nkey("f7"), false, true, false, false, trjs.keys.colorBlue, trjs.messgs.ctrlaltbin115, 'BLUE' ] ); // F2 alt F7
    trjs.F2Bindings.push( [nkey("f8"), false, true, false, false, trjs.keys.bold, trjs.messgs.ctrlaltbin116, 'BOLD' ] ); // F2 alt F8
    trjs.F2Bindings.push( [nkey("f9"), false, true, false, false, trjs.keys.italics, trjs.messgs.ctrlaltbin117, 'ITALICS' ] ); // F2 alt F9
    trjs.F2Bindings.push( [nkey("f10"), false, true, false, false, trjs.keys.emphasis, trjs.messgs.ctrlaltbin118, 'EMPHASIS' ] ); // F2 alt F10

    trjs.F2Bindings.push([nkey("f9"), true, true, false, false, trjs.media.playSlower, trjs.messgs.ctrlaltbin115]); // F2 ctrl alt F9
    trjs.F2Bindings.push([nkey("f10"), true, true, false, false, trjs.media.playFaster, trjs.messgs.ctrlaltbin116]); // F2 ctrl alt F10
    trjs.F2Bindings.push([nkey("f11"), true, true, false, false, trjs.media.playReverse, trjs.messgs.ctrlaltbin66]); // F2 ctrl alt F11
    trjs.F2Bindings.push([nkey("f12"), true, true, false, false, trjs.media.playNormal, trjs.messgs.ctrlaltbin69]); // F2 ctrl alt F12

    //trjs.F2Bindings.push([119, false, false, false, false, trjs.transcription.setMultipleSelection, trjs.messgs.ctrlaltbin119]); // Ctrl Alt F8
    //trjs.F2Bindings.push([120, false, false, false, false, trjs.transcription.exportMStoSubtSrt, trjs.messgs.ctrlaltbin120]); // Ctrl Alt F9
    //trjs.F2Bindings.push([121, false, false, false, false, trjs.transcription.exportMStoSubtAss, trjs.messgs.ctrlaltbin121]); // Ctrl Alt F10
    //trjs.F2Bindings.push([122, false, false, false, false, trjs.transcription.exportMStoMediaSubt, trjs.messgs.ctrlaltbin122]); // Ctrl Alt F11
    //trjs.F2Bindings.push([nkey("f12"), false, false, false, false, trjs.transcription.exportMStoMedia, trjs.messgs.ctrlaltbin123]); // Ctrl Alt F12
};
