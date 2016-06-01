/**
 * <p>Handling undo and redo in the modifications of the transcription</p> 
 * <p>Undo and redo are only handled at cell and line level. Locol undo and redo is handled by the browser</p>
 * <p>Three actions are memorized and can be changed and undone redone:
 *      replace a cell (code loc, time start, time end, transcription)
 * 		insert a full line
 * 		remove a full line</p>
 * Date: august 2014
 * @module Undo
 * @author Christophe Parisse
 */

trjs.undo = ( function() {

/*
 * changes with information about type, line and content
 */
var modification = {
	line: -1,
	type: '', // replace_code, replace_ts, replace_te, replace_trans, insert_line, delete_line
	previous: '',
	content: '',
	init: function(type, line, previous, content) {
		this.type = type;
		this.line = line;
		this.previous = previous;
		this.content = content;
		return this;
	},
	typeToString: function(s) {
		if (s === trjs.data.CODECOL)
			return 'code';
		else if (s === trjs.data.TSCOL)
			return 'time_start';
		else if (s === trjs.data.TECOL)
			return 'time_end';
		else if (s === trjs.data.TRCOL)
			return 'transcription';
		else
			return s;
	},
};

/*
 * container for the changes
 */
var history = [];
var pointer = 0;
var historyLastLine = null;

/**
 * storing the information
 */
var replace = function(field, line, old, code) {
	if (field === trjs.data.TRCOL)
		lineTrackChanges.reprotect(line, code);
	if (history.length !== pointer) { // undo redo ongoing
		history.splice(pointer, history.length);
	}
	history.push(Object.create(modification).init(field, line, old, code));
	pointer++;
	historyLastLine = line;
	trjs.param.changed = true;
};
var insertLine = function(line) {
	if (history.length !== pointer) { // undo redo ongoing
		history.splice(pointer, history.length);
	}
	history.push(Object.create(modification).init('insert_line', line, '', ''));
	historyLastLine = line;
	pointer++;
};
var deleteLine = function(line, oldcontent) {
	if (history.length !== pointer) { // undo redo ongoing
		history.splice(pointer, history.length);
	}
	history.push(Object.create(modification).init('delete_line', line, oldcontent, ''));
	historyLastLine = line;
	pointer++;
};

var getContentOfLine = function(line) {
	var code = trjs.events.lineGetCell(line, trjs.data.CODECOL);
	var ts = trjs.events.lineGetCell(line, trjs.data.TSCOL);
	var te = trjs.events.lineGetCell(line, trjs.data.TECOL);
	var tr = trjs.events.lineGetCellHtml(line, trjs.data.TRCOL);
	return code + '§[]§' + ts + '§[]§' + te + '§[]§' + tr;
};

function getPointerWithLineNumber(ln) {
	// console.log("line to be found: " + ln);
	var tablelines = trjs.transcription.tablelines();
	for (var i=0; i<tablelines.length; i++) {
		var l = trjs.transcription.getLine($(tablelines[i]));
		// console.log(':: ' + i + ' ' + l);
		if (l === ln)
			return $(tablelines[i]);
	}
	return null;
}

var undoCode = function(line, previous, content) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	var prev = trjs.transcription.findCode(previous);
	if (prev === 'loc') prev = 'main loc';
	trjs.transcription.setType(ptr, prev);	
	trjs.transcription.setCode(ptr, previous);
	historyLastLine = line;
};

var redoCode = function(line, previous, content) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	trjs.transcription.setType(ptr, trjs.transcription.findCode(content));	
	trjs.transcription.setCode(ptr, content);
	historyLastLine = line;
};

var undoTS = function(line, previous, content) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	trjs.events.lineSetCell(ptr, trjs.data.TSCOL, previous);
	trjs.events.lineSetCell(ptr, trjs.data.VTSCOL, trjs.transcription.formatTime(previous));
	historyLastLine = line;
};

var redoTS = function(line, previous, content) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	trjs.events.lineSetCell(ptr, trjs.data.TSCOL, content);
	trjs.events.lineSetCell(ptr, trjs.data.VTSCOL, trjs.transcription.formatTime(content));
	historyLastLine = line;
};

var undoTE = function(line, previous, content) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	trjs.events.lineSetCell(ptr, trjs.data.TECOL, previous);
	trjs.events.lineSetCell(ptr, trjs.data.VTECOL, trjs.transcription.formatTime(previous));
	historyLastLine = line;
};

var redoTE = function(line, previous, content) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	trjs.events.lineSetCell(ptr, trjs.data.TECOL, content);
	trjs.events.lineSetCell(ptr, trjs.data.VTECOL, trjs.transcription.formatTime(content));
	historyLastLine = line;
};

var undoTR = function(line, previous, content) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	trjs.events.lineSetCellHtml(ptr, trjs.data.TRCOL, previous);
	historyLastLine = line;
};

var redoTR = function(line, previous, content) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	trjs.events.lineSetCellHtml(ptr, trjs.data.TRCOL, content);
	historyLastLine = line;
};

var undoInsert = function(line) {
	var ptr = getPointerWithLineNumber(Number(line)+1);
	if (ptr === null) return;
	trjs.events.deleteSelectedLine(ptr);	
	historyLastLine = line;
};

var redoInsert = function(line) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	trjs.events.createRowAfterWith(ptr, 'loc', '---', '', '', '');	
	historyLastLine = line;
};

var undoDelete = function(line, previous) {
	if (line == '0')
		var ptr = getPointerWithLineNumber(0);
	else
		var ptr = getPointerWithLineNumber(Number(line)-1);
	if (ptr === null) return;
	var f = previous.split('§[]§');
	trjs.events.createRowAfterWith(ptr, trjs.transcription.findCode(f[0]), f[0], f[1], f[2], f[3]);
	historyLastLine = line;
};

var redoDelete = function(line, previous) {
	var ptr = getPointerWithLineNumber(line);
	if (ptr === null) return;
	trjs.events.deleteSelectedLine(ptr);
	historyLastLine = line;
};

var opinit = function(op) {
	if (history.length !== pointer) { // undo redo ongoing
		history.splice(pointer, history.length);
	}
	history.push(Object.create(modification).init('open_operation', '', op, ''));
	pointer++;
};

var opclose = function(op) {
	if (history.length !== pointer) { // undo redo ongoing
		history.splice(pointer, history.length);
	}
	history.push(Object.create(modification).init('close_operation', '', op, ''));
	pointer++;
};

var undoOperation = function() {
	while (pointer > 0) {
		pointer--;
		if (history[pointer].type === 'open_operation') return;
		if (history[pointer].type === 'close_operation') return;
		if (history[pointer].type === trjs.data.CODECOL)
			undoCode(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TSCOL)
			undoTS(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TECOL)
			undoTE(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TRCOL)
			undoTR(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === 'insert_line')
			undoInsert(history[pointer].line);
		else if (history[pointer].type === 'delete_line')
			undoDelete(history[pointer].line, history[pointer].previous);
	}
};

var undo = function(event) {
	if (pointer > 0) {
		pointer--;
		if (history[pointer].type === trjs.data.CODECOL)
			undoCode(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TSCOL)
			undoTS(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TECOL)
			undoTE(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TRCOL)
			undoTR(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === 'insert_line')
			undoInsert(history[pointer].line);
		else if (history[pointer].type === 'delete_line')
			undoDelete(history[pointer].line, history[pointer].previous);
		else if (history[pointer].type === 'close_operation')
			undoOperation();
		else if (history[pointer].type === 'open_operation')
			trjs.log.alert("abnormal undo: report error");
		trjs.dmz.redraw('partition');
		trjs.events.goToLine(historyLastLine, true);  // history[pointer].line
		return true;
	} else {
		trjs.log.alert(trjs.messgs.nomoreundo, 'normal');
	}
	return false;
};


var redoOperation = function() {
	while (pointer < history.length) {
		if (history[pointer].type === 'close_operation' || history[pointer].type === 'open_operation') {
			pointer++;
			return;
		}
		if (history[pointer].type === trjs.data.CODECOL)
			redoCode(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TSCOL)
			redoTS(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TECOL)
			redoTE(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TRCOL)
			redoTR(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === 'insert_line')
			redoInsert(history[pointer].line);
		else if (history[pointer].type === 'delete_line')
			redoDelete(history[pointer].line, history[pointer].previous);
		pointer++;
	}
};

var redo = function(event) {
	if (pointer < history.length) {
		if (history[pointer].type === trjs.data.CODECOL)
			redoCode(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TSCOL)
			redoTS(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TECOL)
			redoTE(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === trjs.data.TRCOL)
			redoTR(history[pointer].line, history[pointer].previous, history[pointer].content);
		else if (history[pointer].type === 'insert_line')
			redoInsert(history[pointer].line);
		else if (history[pointer].type === 'delete_line')
			redoDelete(history[pointer].line, history[pointer].previous);
		else if (history[pointer].type === 'open_operation') {
			pointer++;
			redoOperation();
			trjs.dmz.redraw('partition');
			trjs.events.goToLine(historyLastLine, true);  // history[pointer].line
			return true;
		}
		else if (history[pointer].type === 'close_operation')
			trjs.log.alert("abnormal redo: report error");
		trjs.dmz.redraw('partition');
		trjs.events.goToLine(historyLastLine, true);  // history[pointer].line
		pointer++;
		return true;
	} else {
		trjs.log.alert(trjs.messgs.nomoreredo, 'normal');
	}
	return false;
};

/**
 * sets of functions used to store the information about the changes made by the user
 * the trackChanges object allows to follow automatically the changes
 */
var trackChanges = {
	previousEdited: '', // stores the image of the previously selected line
	previousEditedNumber: -1, // stores the line numbe fo the previously selected line
	currentEdited: '', // stores the image of the currently selected line
	currentEditedNumber: -1, // stores the line numbe fo the currently selected line
	field: -1,

	init: function(field) {
		this.field = field;
		return this;
	},

	reprotect: function(number, content) {
		if (this.previousEditedNumber === number)
			this.previousEdited = content;
		if (this.currentEditedNumber === number)
			this.currentEdited = content;
	},
	
	protect: function(event) {
		this.previousEdited = this.currentEdited;
		this.previousEditedNumber = this.currentEditedNumber;
		// if this function is called the cell of a line has gained the focus or is selected
		this.currentEdited = trjs.events.lineGetCell($(event.target).parent(), this.field);
		this.currentEditedNumber = trjs.transcription.getLine($(event.target).parent());
	},

	check: function(event) {
		// if this function is called the cell of a line has lost the focus
		var resultEdited = trjs.events.lineGetCell($(event.target).parent(), this.field);
		var resultEditedNumber = trjs.transcription.getLine($(event.target).parent());
		if (resultEditedNumber !== this.currentEditedNumber) { // then the order of focus and blur is (next focus first, last blur second)
			if (resultEditedNumber !== this.previousEditedNumber) {
				console.log('incoherent lines (previous): ' + resultEditedNumber + ' ' + this.currentEditedNumber + ' ' + this.previousEditedNumber);
				return;
			}
			if (resultEdited !== this.previousEdited) {
				//console.log('Line: ' + this.previousEditedNumber + ' (' + resultEditedNumber + ')' + ' has been modified');
				//console.log('From: :-: ' + this.previousEdited);
				//console.log('To :-: ' + resultEdited);
				replace(this.field, this.previousEditedNumber, this.previousEdited, resultEdited);
			}
		} else {  // then the order of focus and blur is (last blur first, next focus second)
			if (resultEditedNumber !== this.currentEditedNumber) {
				console.log('incoherent lines (current): ' + resultEditedNumber + ' ' + this.currentEditedNumber + ' ' + this.previousEditedNumber);
				return;
			}
			if (resultEdited !== this.currentEdited) {
				//console.log('Line: ' + this.currentEditedNumber + ' (' + resultEditedNumber + ')' + ' has been modified');
				//console.log('From: :-: ' + this.currentEdited);
				//console.log('To :-: ' + resultEdited);
				replace(this.field, this.currentEditedNumber, this.currentEdited, resultEdited);
			}
		}
	},
};

var lineTrackChanges = Object.create(trackChanges).init(trjs.data.TRCOL);
var codeTrackChanges = Object.create(trackChanges).init(trjs.data.CODECOL);
var tsTrackChanges = Object.create(trackChanges).init(trjs.data.TSCOL);
var teTrackChanges = Object.create(trackChanges).init(trjs.data.TECOL);

var pretty = function(l) {
	var f = l.split('§[]§');
	if (f.length<2)
		return l;
	else
		return '(' + f[0] + ';' + f[1] + ';' + f[2] + ';' + f[3] + ')';
};

var init = function() {
/*	var h = trjs.local.get('history');
	if (h) {
		history = JSON.parse(h);
		pointer = trjs.local.get('pointer');
		savepoint = trjs.local.get('savepoint');
		if (savepoint < pointer) { // this means that there was no save at the last point in the undo list
			// recover
		}
	} else {
		trjs.local.put('history', JSON.stringify([]));
*/
		history = [];
		pointer = 0;
		savepoint = 0;
//	}
};

var setSavePoint = function() {
	savepoint = pointer;
};

var fraTextUndo = {
	'insertBlankLineAndRedraw': 'Insérer ligne blanche', 
	'insertBlankLineLocAndRedraw': 'Insérer ligne blanche locuteur',
	'insertWithTimeAndRedraw': 'Insérer ligne et marquer le temps',
	'insertWithTimeLocAndRedraw': 'Insérer ligne locuteur et marquer le temps',
	'joinLine': 'Joindre deux lignes',
	'joinLineLoc': 'Joindre deux lignes locuteur',
	'replicateLineAndRedraw': 'Dupliquer une ligne',
	'setDivPlus': 'Mettre ouverture de div',
	'setDivPlusInsert': 'Ouvrir un div',
	'setDivMinus': 'Mettre fermeture de div',
	'setDivMinusInsert': 'Fermer un div',
	'setDivMissingMinus': 'Fermer tous divs',
	'setNthLoc': 'Changer le locuteur',
	'setNthTier': 'Changer le tier',
	'code': 'Modification locuteur',
	'time_start': 'Modification de temps de début',
	'time_end': 'Modification de temps de fin',
	'transcription': 'Modification de transcription',
	'insert_line': 'Insertion de ligne',
	'delete_line': 'Suppression de ligne',
	'open_operation': 'ouvrir opération',
	'close_operation': 'clore opération',
	'ln': ' Ligne: ',
};

var engTextUndo = {
	'insertBlankLineAndRedraw': 'Insert empty line', 
	'insertBlankLineLocAndRedraw': 'Insert empty loc line',
	'insertWithTimeAndRedraw': 'Insert line and mark time',
	'insertWithTimeLocAndRedraw': 'Insert loc line and mark time',
	'joinLine': 'Join two lines',
	'joinLineLoc': 'Join two loc lines',
	'replicateLineAndRedraw': 'Duplicate a line',
	'setDivPlus': 'Set div start',
	'setDivPlusInsert': 'Insert a new div',
	'setDivMinus': 'Set div end',
	'setDivMinusInsert': 'Insert a end of div',
	'setDivMissingMinus': 'Close all opened divs',
	'setNthLoc': 'Change loc',
	'setNthTier': 'Change tier',
	'code': 'Changing locutor',
	'time_start': 'Changing start time',
	'time_end': 'Changing end time',
	'transcription': 'Changing transcription',
	'insert_line': 'Insert line',
	'delete_line': 'Delete line',
	'open_operation': 'open operation',
	'close_operation': 'close operation',
	'ln': ' Line: ',
};

var textUndo = engTextUndo;

return {
	setLang: function(l) {
		if (l === 'fra')
			textUndo = fraTextUndo;
		else // if (l === 'eng') : default
			textUndo = engTextUndo;
	},
	line: lineTrackChanges,
	code: codeTrackChanges,
	ts: tsTrackChanges,
	te: teTrackChanges,
	replaceCode: function(line, old, code) { return replace(trjs.data.CODECOL, line, old, code); },
	replaceTS: function(line, old, code) { return replace(trjs.data.TSCOL, line, old, code); },
	replaceTE: function(line, old, code) { return replace(trjs.data.TECOL, line, old, code); },
	replaceTrans: function(line, old, code) { return replace(trjs.data.TRCOL, line, old, code); },
	insertLine: function(line) { return insertLine(line); },
	deleteLine: function(ln, oldline) { return deleteLine(ln, oldline); },
	getContentOfLine: function(line) { return getContentOfLine(line); },
	undo: function(e) { undo(e); },
	redo: function(e) { redo(e); },
	opinit: function(op) { opinit(op); },
	opclose: function(op) { opclose(op); },
	undoList: function() { // lists undo/redo history
		var s = trjs.messgs.undolist;
		var mask = false;
		for (var i = 0; i < pointer; i++) {
			if (history[i].type === 'open_operation') {
				mask = true;
				var t = textUndo[history[i].previous];
				if (t)
					s += t + '<br/>';
				else
					s += pretty(history[i].previous) + '<br/>';
			} else if (history[i].type === 'close_operation') {
				mask = false;
			} else {
				if (!mask) {
					var t = textUndo[modification.typeToString(history[i].type)];
					if (t)
						s += t + textUndo['ln'] + history[i].line + '<br/>';
					else
						s += history[i].line + ' ' + modification.typeToString(history[i].type) + ' ' + pretty(history[i].previous) + ' --> ' + history[i].content + '<br/>';
				}
			}
		}
		if (pointer !== history.length) {
			s += trjs.messgs.redolist;
			for (var i = pointer; i < history.length; i++) {
				if (history[i].type === 'open_operation') {
					mask = true;
					var t = textUndo[history[i].previous];
					if (t)
						s += t + '<br/>';
					else
						s += pretty(history[i].previous) + '<br/>';
				} else if (history[i].type === 'close_operation') {
					mask = false;
				} else {
					if (!mask) {
						var t = textUndo[modification.typeToString(history[i].type)];
						if (t)
							s += t + textUndo['ln'] + history[i].line + '<br/>';
						else
							s += history[i].line + ' ' + modification.typeToString(history[i].type) + ' ' + pretty(history[i].previous) + ' --> ' + history[i].content + '<br/>';
					}
				}
			}
		}
		bootbox.alert(s, function() {});;
	},
	clear: function() {  // clear all undo/redo history
		history = [];
		pointer = 0;
	},
	setSavePoint: function() { setSavePoint(); },
	init: function() { init(); },
};

})();
