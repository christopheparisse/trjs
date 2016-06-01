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

var keysToString = function(k, ctrl, alt, shift, meta) {
	var s = '';
	if (ctrl) s += 'Ctrl+';
	if (alt) s += 'Alt+';
	if (shift) s += 'Shift+';
	if (meta) s += 'Cmd+';
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

trjs.keys.modifiersFlags = function(charCode, ctrl, alt, shift, meta) {
	var modifiers = ctrl + alt * 2 + shift * 4; // + e.metaKey * 8; // metakey is not used
	return charCode + trjs.keys[modifiers];
};

trjs.keys.modifiersEvent = function(charCode, e) {
	return trjs.keys.modifiersFlags(charCode, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey);
};

trjs.keys.init = function() {
	if (trjs.tablekeys !== undefined && trjs.tablekeys !== null) {
		delete trjs.tablekeys;
	}
	trjs.tablekeys = {};
    for (var i in trjs.bindings) {
        if (trjs.bindings[i][0] !== -1) {
        	if (!trjs.bindings[i][5])
        		console.log('bindings(' + i + ') key=' + keysToString(trjs.bindings[i][0],  trjs.bindings[i][1],  trjs.bindings[i][2],  trjs.bindings[i][3],  trjs.bindings[i][4]) + ' is undefined');
            trjs.tablekeys[ trjs.keys.modifiersFlags( trjs.bindings[i][0],  trjs.bindings[i][1],  trjs.bindings[i][2],  trjs.bindings[i][3],  trjs.bindings[i][4] ) ] = trjs.bindings[i][5];
        }
    }
};

trjs.keys.colorRed = function() {
	formatSelectedText('red');
};

trjs.keys.colorGreen = function() {
	formatSelectedText('green');
};

trjs.keys.colorBlue = function() {
	formatSelectedText('blue');
};

trjs.keys.bold = function() {
	formatSelectedText('b');
};

trjs.keys.italics = function() {
	formatSelectedText('i');
};

trjs.keys.emphasis = function() {
	formatSelectedText('em');
};

trjs.keys.toHtml = function() {
	var s = '';
    for (var i in trjs.bindings) {
    	var k = trjs.keynames[trjs.bindings[i][0]];
    	if (!k) k = 'Unknown';
        if (trjs.bindings[i][0] !== -1) {
            s += '<p><span class="keysdisplay">' 
            	+ keysToString(k.toUpperCase(), trjs.bindings[i][1], trjs.bindings[i][2], trjs.bindings[i][3], trjs.bindings[i][4])
            	+ '</span><span class="keysdescr">'
            	+ trjs.bindings[i][6]
            	+ '</span></p>';
        }
    }
	return s;
};

trjs.keys.showKeys = function() {
	$('#message-content').html('<p onclick="trjs.keys.printKeys();" style="border: 2px solid blue; font-size:larger;">Print the list of keys</p>' + trjs.keys.toHtml());
	$('#message-bindings').modal({ keyboard: true });
};

trjs.keys.printKeys = function (argument) {
	style = '.p { display:block; margin: 0; padding: 0; } .keysdisplay { font-style: italic; margin-right: 2em; color:#000000; background:#FFFFFF; font-size:larger; } .keysdescr { color:#000000; background:#FFFFFF; } ';
//	var ctn = '<html><head><link href="style/print.css" rel="stylesheet" type="text/css"></head><body>' + trjs.keys.toHtml() + '</body></html>';
	var ctn = '<html><head><style>' + style + '</style></head><body>' + trjs.keys.toHtml() + '</body></html>';
	trjs.utils.printHTML(ctn);
};

trjs.keys.ispress = function(e) {
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
 * structure containing the api keys 
 */
trjs.api = {};

trjs.api.key = function(k) {
    replaceSelectedText(trjs.api.table[k][1]);
    return true;
};

trjs.api.desc = function(k) {
    return trjs.api.table[k][2];
};

/**
 * full api list table 
 */
trjs.api.table = [
// vowels
/* 0 */ ["i", "i", "front closed unrounded vowel English see, Spanish sí, French vite, German mi.e.ten, Italian visto"],
/* 1 */ ["I", "ɪ", "(small capital I) front closed unrounded vowel, but somewhat more centralised and relaxed English city, German mit"],
/* 2 */ ["e", "e", "front half closed unrounded vowel US English bear, Spanish él, French année, German mehr, Italian rete, Catalan més"],
/* 3 */ ["E", "ɛ", "front half open unrounded vowel English bed, French même,German Herr, Männer, Italian ferro, Catalan mes, Spanish perro"],
/* 4 */ ["{", "æ", "ae ligature - front open unrounded vowel English cat"],
/* 5 */ ["y", "y", "front closed rounded vowel French du, German Tür"],
/* 6 */ ["2", "ø", "slashed o - front half closed rounded vowel French deux (hence '2'), German Höhle"],
/* 7 */ ["9", "œ", "ligature oe - front half open rounded vowel French neuf (hence '9'), German Hölle"],
/* 8 */ ["1", "i", "overstroked i - central closed unrounded vowel Russian мыс [m1s] 'cape'"],
/* 9 */ ["@", "ə", "(turned down e) schwa central neutral unrounded vowel English about, winner,German bitte"],
/* 10 */ ["6", "ɐ", "(turned down a) open schwa central neutral unrounded vowel German besser"],
/* 11 */ ["3", "ɜ", "(Greek epsilon mirrored to the left) front half open unrounded vowel, but somewhat more centralised and relaxed English bird"],
/* 12 */ ["a", "a", "central open vowel Spanish da, barra, French bateau, lac, German Haar, Italian pazzo"],
/* 13 */ ["}", "ʉ", "verstroked u - central closed rounded vowel Scottish English pool, Swedish sju"],
/* 14 */ ["8", "ɵ", "overstroked o - central neutral rounded vowel Swedish kust"],
/* 15 */ ["&", "ɶ", "small capital OE ligature -front open rounded vowel American English that"],
/* 16 */ ["M", "ɯ", "(upside-down m) back closed unrounded vowel Japanese fuji, Vietnamese ư Korean 으"],
/* 17 */ ["7", "ɤ", "(squeezed Greek gamma) back half closed unrounded vowel Vietnamese ơ Korean 어"],
/* 18 */ ["V", "ʌ", "(turned down v) back half open unrounded vowel RP and US English run, enough"],
/* 19 */ ["A", "ɑ", "('d' with no upper tail) back open unrounded vowel English arm, US English law, standard French âme"],
/* 20 */ ["u", "u", "back closed rounded vowel English soon, Spanish tú, French goût, German Hut, Mutter, Italian azzurro, tutto"],
/* 21 */ ["U", "ʊ", "(turned down small capital Greek omega) back closed rounded vowel somewhat more centralised and relaxed English put, (non-US)Buddhist"],
/* 22 */ ["o", "o", "back half closed rounded vowel US English sore, Scottish English boat, Spanish yo, French beau, German Sohle, Italian dove, Catalan ona"],
/* 23 */ ["O", "ɔ", "(c mirrored to the left) back half open rounded vowel British English law, caught, Italian cosa, Catalan dona, Spanish ojo, German Wort"],
/* 24 */ ["Q", "ɒ", "('b' with no upper tail) back open rounded vowel British English not, cough"],
// consonants
/* 25 */ ["p", "p", "voiceless bilabial plosive English pen"],
/* 26 */ ["b", "b", "voiced bilabial plosive English but"],
/* 27 */ ["t", "t", "voiceless alveolar plosive English two, Spanish toma ('capture')"],
/* 28 */ ["d", "d", "voiced alveolar plosive English do, Italian cade"],
/* 29 */ ["ts", "ts", "voiceless alveolar affricate Italian calza, German zeit"],
/* 30 */ ["dz", "dz", "voiced alveolar affricate Italian zona ('zone')"],
/* 31 */ ["tS", "tʃ", "voiceless postalveolar affricate English chair, , Spanish mucho ('many')"],
/* 32 */ ["dZ", "dʒ", "voiced postalveolar affricate English gin, Italian giorno"],
/* 33 */ ["c", "c", "voiceless palatal plosive Hungarian tyúk 'hen'"],
/* 34 */ ["J\\", "ɟ", "voiced palatal plosive Hungarian egy 'one'"],
/* 35 */ ["k", "k", "voiceless velar plosive English skill"],
/* 36 */ ["g", "ɡ", "voiced velar plosive English go"],
/* 37 */ ["q", "q", "voiceless uvular plosive Arabic qof"],
/* 38 */ ["p\\", "ɸ", "voiceless bilabial fricative Japanese fu"],
/* 39 */ ["B", "β", "voiced bilabial fricative Catalan roba 'clothes'"],
/* 40 */ ["f", "f", "voiceless labiodental fricative English fool, Spanish and Italian falso ('false')"],
/* 41 */ ["v", "v", "voiced labiodental fricative English voice, German Welt"],
/* 42 */ ["T", "θ", "voiceless dental fricative English thing, Castilian Spanish caza"],
/* 43 */ ["D", "ð", "voiced dental fricative English this"],
/* 44 */ ["s", "s", "voiceless alveolar fricative English see, Spanish sí ('yes')"],
/* 45 */ ["z", "z", "voiced alveolar fricative English zoo, German See"],
/* 46 */ ["S", "ʃ", "voiceless postalveolar fricative English she, French chemin"],
/* 47 */ ["Z", "ʒ", "voiced postalveolar fricative French jour, English pleasure"],
/* 48 */ ["C", "ç", "voiceless palatal fricative Standard German Ich"],
/* 49 */ ["j", "ʝ", "voiced palatal fricative Standard Spanish ayuda"],
/* 50 */ ["x", "x", "voiceless velar fricative Scots loch, Castilian Spanish ajo"],
/* 51 */ ["G", "ɣ", "voiced velar fricative Greek γάλα ('milk')"],
/* 52 */ ["x\\", "ɰ", "velar approximant Spanish algo"],
/* 53 */ ["X\\", "ħ", "voiceless pharyngeal fricative Arabic h.â"],
/* 54 */ ["?\\", "ʕ", "voiced pharyngeal fricative Arabic 'ayn"],
/* 55 */ ["h", "h", "voiceless glottal fricative English ham, German Hand"],
/* 56 */ ["h\\", "ɦ", "voiced glottal fricative Hungarian lehet"],
/* 57 */ ["m", "m", "bilabial nasal English man"],
/* 58 */ ["F", "ɱ", "labiodental nasal Spanish infierno, Hungarian kámfor"],
/* 59 */ ["n", "n", "alveolar nasal English, Spanish and Italian no"],
/* 60 */ ["J", "ɲ", "palatal nasal Spanish año, French oignon"],
/* 61 */ ["N", "ŋ", "velar nasal English ring, Italian bianco, Tagalog ngayón"],
/* 62 */ ["l", "l", "alveolar lateral approximant English left, Spanish largo"],
/* 63 */ ["L", "ʎ", "palatal lateral approximant Italian aglio, Catalan colla,"],
/* 64 */ ["5", "ɫ", "velarized dental lateral English meal Catalan alga"],
/* 65 */ ["4", "ɾ", "alveolar tap Spanish pero, Italian essere"],
/* 66 */ ["r", "r", "alveolar trill Spanish perro"],
/* 67 */ ["r\\", "ɹ", " alveolar approximant English run"],
/* 68 */ ["R", "ʀ", "uvular trill Standard German Reich"],
/* 69 */ ["P", "ʋ", "labiodental approximant Dutch Waar"],
/* 70 */ ["w", "w", "labial-velar approximant English we, French oui"],
/* 71 */ ["H", "ɥ", "labial-palatal approximant French huit"],
/* 72 */ ["j", "j", "palatal approximant English yes, French yeux"],
// others
/* 73 */ [":", "ː", "lengthening of vowel"],
/* 74 */ ["~", "\u0303", "nasal vowel"],
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
 * the binding table is for the user interface and can be inserted in the real binding table trjs.tablekeys
 * the trjs.keys.init function allows to initialize or reinitialize the keys.
 * for the future it would be good to allow to store and modify this list of bindings
 */

trjs.bindings = [];

trjs.keys.initBindings = function() {
/* clé - ctrl alt shift meta function description */
trjs.bindings.push( [9, false, false, false, false, trjs.events.tab, "Tabulation or play from the transcription" ] ); // Tab
trjs.bindings.push( [27, false, false, false, false, trjs.events.escape, "Stops the playing of the media" ] ); // Esc
trjs.bindings.push( [33, false, false, false, false, trjs.events.pageUp, "Moves to page above" ] ); // Page Up
trjs.bindings.push( [34, false, false, false, false, trjs.events.pageDown, "Moves to page below" ] ); // Page Down
trjs.bindings.push( [38, false, false, false, false, trjs.events.keyUp, "Moves to line above" ] ); // Up
trjs.bindings.push( [40, false, false, false, false, trjs.events.keyDown, "Moves to line below" ] ); // Down
trjs.bindings.push( [112, false, false, false, false, trjs.media.playJump, "Plays from the media" ] ); // F1
trjs.bindings.push( [113, false, false, false, false, trjs.media.backwardStep, "Jumps backwards a little bit" ] ); // F2
trjs.bindings.push( [114, false, false, false, false, trjs.media.forwardStep, "Jumps formwards a little bit" ] ); // F3
trjs.bindings.push( [118, false, false, false, false, trjs.events.runCurrentLine, "Plays all the current line" ] ); // F7
trjs.bindings.push( [119, false, false, false, false, trjs.events.goContinuous, "Starts playing continuously" ] ); // F8 

trjs.bindings.push( [35, true, false, false, false, trjs.events.ctrlEnd, "Moves to the end of file" ] ); // Ctrl End
trjs.bindings.push( [36, true, false, false, false, trjs.events.ctrlHome, "Moves to the begining of file" ] ); // Ctrl Home
trjs.bindings.push( [66, true, false, false, false, trjs.media.playSlower, "Plays media slower" ] ); // Ctrl B
trjs.bindings.push( [69, true, false, false, false, trjs.media.playFaster, "Plays media faster" ] ); // Ctrl E
trjs.bindings.push( [70, true, false, false, false, trjs.editor.showSearch, "Show search interface panel" ] ); // Ctrl F
trjs.bindings.push( [76, true, false, false, false, trjs.editor.showLine, "Goes to line number" ] ); // Ctrl L
trjs.bindings.push( [84, true, false, false, false, trjs.editor.showTime, "Show go to time interface panel" ] ); // Ctrl T
trjs.bindings.push( [85, true, false, false, false, trjs.editor.hideDiv, "Hides the div" ] ); // Ctrl U

trjs.bindings.push( [66, true, true, false, false, trjs.media.playReverse, "Plays in reverse" ] ); // Ctrl Alt B
trjs.bindings.push( [69, true, true, false, false, trjs.media.playNormal, "Plays at normal rate" ] ); // Ctrl Alt E
trjs.bindings.push( [85, true, true, false, false, trjs.editor.showDiv, "Shows the hidden div" ] ); // Ctrl Alt U

trjs.bindings.push( [37, false, true, false, false, trjs.media.backwardStep, "Jumps backwards a little bit" ] ); // Alt Left
trjs.bindings.push( [38, false, true, false, false, trjs.events.keyLocUp, "Goes up to the next main line" ] ); // Alt Up
trjs.bindings.push( [39, false, true, false, false, trjs.media.forwardStep, "Jumps forwards a little bit" ] ); // Alt Right
trjs.bindings.push( [40, false, true, false, false, trjs.events.keyLocDown, "Goes down to the next main line" ] ); // Alt Down
trjs.bindings.push( [112, false, true, false, false, trjs.media.playCurrent, "Plays from the current position in the transcription" ] ); // Alt F1
trjs.bindings.push( [113, false, true, false, false, trjs.media.makeSmall, "Reduces the size of the media" ] ); // Alt F2
trjs.bindings.push( [114, false, true, false, false, trjs.media.makeBig, "Increases the size of the media" ] ); // Alt F3
trjs.bindings.push( [115, false, true, false, false, trjs.media.playSlower, "Plays the media two times slower" ] ); // Alt F4
trjs.bindings.push( [116, false, true, false, false, trjs.media.playFaster, "Plays the media two times faster" ] ); // Alt F5
trjs.bindings.push( [118, false, true, false, false, trjs.events.runThreeLines, "Play three main lines around the currento one" ] ); // Alt F7

trjs.bindings.push( [9, false, false, true, false, trjs.events.shiftTab, "Plays from the start of the current line" ] ); // Shift Tab
trjs.bindings.push( [112, false, false, true, false, trjs.media.playPause, "Plays from the current media time" ] ); // Shift F1
};
