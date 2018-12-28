/**
 * <p>Handling the dynamic modifications of the transcription</p>
 * <p>Editing the data in the tables of transcription</p>
 * Date: august 2013
 * @module Event
 * @author Christophe Parisse
 */

/**
 * edit dynamically an XML TEI transcription into memory
 */

'use strict';

trjs.events = (function () {

    /**
     * modify the content of the nth td in a jQuery DOM tr element
     * @method lineSetCell
     * @param pointer to a jQuery DOM tr element
     * @param td index
     * @param value of the td
     */
    function lineSetCell(line, col, value) {
        var tds = line.children();
        //console.log(tds);
        $(tds[col]).text(value);
    }

    /**
     * find the content of the nth td in a jQuery DOM tr element
     * @method lineGetCell
     * @param pointer to a jQuery DOM tr element
     * @param td index
     * @return string of the td
     */
    function lineGetCell(line, col) {
        if (!line) {
            console.log('line is null');
            console.trace();
            return '';
        }
        var tds = line.children();
        //console.log(tds);
        return $(tds[col]).text();
    }

    /**
     * modify the html content of the nth td in a jQuery DOM tr element
     * @method lineSetCellHtml
     * @param pointer to a jQuery DOM tr element
     * @param td index
     * @param value of the td
     */
    function lineSetCellHtml(line, col, value) {
        var tds = line.children();
        //console.log(tds);
        $(tds[col]).html(value);
    }

    /**
     * find the html content of the nth td in a jQuery DOM tr element
     * @method lineGetCellHtml
     * @param pointer to a jQuery DOM tr element
     * @param td index
     * @return value of the td
     */
    function lineGetCellHtml(line, col) {
        if (!line) {
            console.log('line not valid');
            return '';
        }
        var tds = line.children();
        //console.log(tds);
        return $(tds[col]).html();
    }

    /**
     * find which line of the transcript table is selected
     * @method getSelectedLine
     * @return pointer to a jQuery DOM tr element
     */
    function getSelectedLine() {
        var sel = document.activeElement;
        return $(sel).parent();
    }

    /**
     * find which cell of the transcript table is selected
     * @method getSelectedCell
     * @return pointer to a jQuery DOM tr element
     */
    function getSelectedCell() {
        var sel = document.activeElement;
        return $(sel);
    }

    /**
     * find the next main line
     * @method getNextMainline
     * @param sel line
     * @return line
     */
    function getNextMainline(sel) {
        var nxt;
        while (true) {
            nxt = sel.next();
            if (nxt == null) return null;
            if (nxt.length < 1) return null;
            var t = trjs.transcription.typeTier(nxt);
            if (t !== 'prop') return nxt;
            sel = nxt;
        }
    }

    /**
     * find the last tier after a main line
     * @method getLastTierline
     * @param a line
     * @return line
     */
    function getLastTierline(sel) {
        var nxt;
        while (true) {
            nxt = sel.next();
            if (nxt == null) return sel;
            if (nxt.length < 1) return sel;
            var t = trjs.transcription.typeTier(nxt);
            if (t != 'prop') return sel;
            sel = nxt;
        }
    }

    /**
     * find the previous main line
     * @method getPreviousMainline
     * @param a line
     * @return line
     */
    function getPreviousMainline(sel) {
        while (true) {
            var nxt = sel.prev();
            if (nxt == null) return null;
            if (nxt.length < 1) return null;
            var t = trjs.transcription.typeTier(nxt);
            if (t != 'prop') return nxt;
            sel = nxt;
        }
    }

    /**
     * @method fillRowWith
     */
    function fillRowWith(sel, type, loc, ts, te, tr) {
        trjs.param.change(true);
        trjs.transcription.setCode(sel, loc);
        trjs.transcription.setType(sel, type); // adjust the attributes according to the value of the code in the loc part
        lineSetCell(sel, trjs.data.TSCOL, ts);
        lineSetCell(sel, trjs.data.TECOL, te);
        lineSetCell(sel, trjs.data.VTSCOL, trjs.transcription.formatTime(ts));
        lineSetCell(sel, trjs.data.VTECOL, trjs.transcription.formatTime(te));
        lineSetCellHtml(sel, trjs.data.TRCOL, tr);
    }

    /**
     * add a row to a table after the current selected element
     * @method createRowAfterWith
     * @param {object} current line
     * @param {string} type of line
     * @param {string} locutor
     * @param {string} time start
     * @param {string} time end
     * @param {string} transcription
     */
    function createRowAfterWith(sel, type, loc, ts, te, tr) {
        trjs.param.change(true);
        var ln = trjs.transcription.getLine(sel);
        ln++;
        var s = trjs.transcription.stringLineTranscript(type, loc, ts, te, trjs.transcription.formatTime(ts), trjs.transcription.formatTime(te), tr, ln);
        sel.after(s); // inserts after current sibbling
        var next = sel.next();
        trjs.transcription.trUpdateCSS(next, loc);
        next = next.next();
        while (next != null && next.length > 0) {
            ln++;
            lineSetCell(next, trjs.data.LINECOL, ln);
            next = next.next();
        }
    }

    /**
     * insert a row to a table before the current selected element
     * @method createRowBeforeWith
     * @param {object} current line
     * @param {string} type of line
     * @param {string} locutor
     * @param {string} time start
     * @param {string} time end
     * @param {string} transcription
     */
    function createRowBeforeWith(sel, type, loc, ts, te, tr) {
        trjs.param.change(true);
        var ln = trjs.transcription.getLine(sel);
        var s = trjs.transcription.stringLineTranscript(type, loc, ts, te, trjs.transcription.formatTime(ts), trjs.transcription.formatTime(te), tr, ln);
        sel.before(s); // inserts before current sibbling
        trjs.transcription.trUpdateCSS(sel, loc);
        var next = sel.next();
        while (next != null && next.length > 0) {
            ln++;
            lineSetCell(next, trjs.data.LINECOL, ln);
            next = next.next();
        }
    }

    /**
     * add a row at the end of the table
     * @method createRowAtEnd
     * @param {object} current line
     * @param {string} type of line
     * @param {string} locutor
     * @param {string} time start
     * @param {string} time end
     * @param {string} transcription
     */
    function createRowAtEnd(sel, type, loc, ts, te, tr) {
        trjs.param.change(true);
        var ln = trjs.transcription.getLine(sel);
        ln++;
        var s = trjs.transcription.stringLineTranscript(type, loc, ts, te, trjs.transcription.formatTime(ts), trjs.transcription.formatTime(te), tr, ln);
        sel.parent().append(s); // inserts at the end
        trjs.transcription.trUpdateCSS(sel.next(), loc);
    }

    function setTimeSelectedLine(start, end) {
        if (!trjs.data.selectedLine) return;
        var l = trjs.transcription.getLine(trjs.data.selectedLine);
        trjs.undo.replaceTS(l, lineGetCell(trjs.data.selectedLine, trjs.data.TSCOL), start);
        trjs.undo.replaceTE(l, lineGetCell(trjs.data.selectedLine, trjs.data.TECOL), end);
        lineSetCell(trjs.data.selectedLine, trjs.data.TSCOL, start);
        lineSetCell(trjs.data.selectedLine, trjs.data.VTSCOL, trjs.transcription.formatTime(start));
        lineSetCell(trjs.data.selectedLine, trjs.data.TECOL, end);
        lineSetCell(trjs.data.selectedLine, trjs.data.VTECOL, trjs.transcription.formatTime(end));
        if (start !== '') reorder(l); // check if l is at right position and reorder if necessary
        if (trjs.param.alwaysCheckOverlap === true) trjs.check.checkOverlap(trjs.data.selectedLine);
        trjs.dmz.redraw('partition'); // TODO: check if this works correctly
    }

    /*
     */
    function swapBefore(oldplace, newplace) {
        trjs.log.alert('attention ligne déplacée');
        var tablelines = trjs.transcription.tablelines();

        var op = $(tablelines[oldplace]);
        var lc = copyLineLoc(op);
        deleteLineLoc(null, op);

        if (newplace >= tablelines.length) {
            // add to the last line
            insertLineLoc($(tablelines[tablelines.length - 1]), lc);
        } else if (newplace <= 0) {
            // find the first non div
            for (var i = 0; i < tablelines.length; i++)
                if (trjs.transcription.getCode($(tablelines[i])) !== 'div') break;
            if (i > 0)
                insertLineLoc($(tablelines[i - 1]), lc);
            else
                insertLineLoc($(tablelines[0]), lc);
            // the first element is a div so insert after the div
        } else {
            insertLineLoc($(tablelines[newplace - 1]), lc);
        }
    }

    /*
     * check if a line is at right position and reorder if necessary
     * @method reorder
     * @param {integer} line number
     */
    function reorder(line) {
        // there can be more that one not ordered line
        // but only if reorder is optional
        // the checking does not cover all cases if there is multiple non ordered lines
        // a complete sort must be performed in this case
        if (trjs.param.reorder === false) return;
        var tablelines = trjs.transcription.tablelines();
        line = parseInt(line);
        if (line < 0 || line >= tablelines.length) return;
        // check that LINECOL correspond to this number
        for (var i = 0; i < tablelines.length; i++)
            if (trjs.transcription.getLine($(tablelines[i])) === line) break;
        if (i === tablelines.length)
            return; // not found the line !!!
        line = i; // index in tablelines instead of line number
        var s = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[line]), trjs.data.TSCOL));
        var testsomething = false;
        for (var l = line - 1; l >= 0; l--) {
            if (trjs.transcription.typeTier($(tablelines[l])) !== 'loc') continue;
            var b = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[l]), trjs.data.TSCOL));
            if (b === '') continue;
            testsomething = true;
            if (b <= s) // the one just before is well placed
                break;
            else {
                // -------b(v2)---s(v1) : v1<v2
                // line should be moved before l.
                var lastloc = l; // last locutor : insertion should be just before this one.
                var n = l - 1; // find the previous point that is greater than line
                for (; n >= 0; n--) {
                    if (trjs.transcription.typeTier($(tablelines[n])) !== 'loc') continue;
                    b = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[n]), trjs.data.TSCOL));
                    if (b === '') continue;
                    if (b <= s) {
                        // the first found that is smaller or equal to the time to be inserted
                        // ---n(v3)-lastloc---b(v2)---s(v1) : v1<v2 v3<v1
                        swapBefore(line, lastloc);
                        return;
                    }
                    lastloc = n; // new value for last locutor
                }
                swapBefore(line, 0);
                return;
            }
        }
        if (testsomething !== false) { // it testsomething === false was the first element so we don't know if it is correct or not
            if (l <= 0) {
                // special case where the element is to be put at the first position
                // put it after the set of div
                swapBefore(line, 0);
                return;
            }
        }
        for (l = line + 1; l < tablelines.length; l++) {
            if (trjs.transcription.typeTier($(tablelines[l])) !== 'loc') continue;
            var b = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[l]), trjs.data.TSCOL));
            if (b === '') continue;
            if (b >= s) // the one just before is well placed
                break;
            else {
                // s(v1)---b(v2)------- : v2<v1
                // line should be moved after l.
                var n = l + 1; // find the next point that is greater than line
                for (; n < tablelines.length; n++) {
                    if (trjs.transcription.typeTier($(tablelines[n])) !== 'loc') continue;
                    b = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[n]), trjs.data.TSCOL));
                    if (b === '') continue;
                    if (b >= s) {
                        // s(v1)---b(v2)---n(v3)---- : v2<v1 v3>v2
                        // the first found that is greater or equal to the time to be inserted
                        swapBefore(line, n);
                        return;
                    }
                    lastloc = n; // new value for last locutor
                }
                swapBefore(line, tablelines.length);
                return;
            }
        }
        if (l >= tablelines.length) {
            // special case where the element is to be put at the end
            swapBefore(line, tablelines.length);
            return;
        }
    }

    /**
     * @method transcriptGotFocus
     * @param {event} e
     */
    function transcriptGotFocus(e) {
        setSelectedLine($(e.target).parent(), 'partition');
        // redraw the selection if necessary
    }

    /**
     * @method setFocus
     */
    function setFocus() {
        var sel = trjs.data.selectedLine;
        // put current line in focus if this is not the case
        setTimeout(function() {
            $('.transcription', sel).focus();
        }, 1000);
    }

    /**
     * continuous display of lines starting from the last selected line
     * @method goContinuous
     * @param event
     * @param {object} line of transcription table
     */
    function goContinuous(e, sel) {
        if (!sel) sel = trjs.data.selectedLine;
        if (!sel) return;
        if (trjs.param.isContinuousPlaying === true) {
            trjs.media.endContinuousPlay();
            return;
        } else {
            sel = findLineToStart(sel);
            if (sel === null) return;
            setSelectedLine(sel);
            var start = lineGetCell(sel, trjs.data.TSCOL);
            if (!start && Number(start) !== 0) {
                console.log("gc", start);
                console.log("gc stop at start");
                trjs.log.alert("cannot run current line with no time start: use TAB (playpause function)");
                return;
            }
            trjs.media.runContinuous(start, sel);
        }
    }

    /**
     * change color of an element of the nth td in a jQuery DOM tr element
     * @method lineNotify
     * @param pointer to a jQuery DOM tr element
     * @param td index
     * @param value of the td
     */
    function lineNotify(line, col, value) {
        var tds = line.children();
        //console.log(tds);
        var old = $(tds[col]).css('background-color');
        $(tds[col]).css('background-color', value);
        setTimeout(function(){ $(tds[col]).css('background-color', old); }, 1000);
//        $(tds[col]).animate({'background-color': old}, 1000);
    }

    /**
     * put the time stamp in the last selected line
     * @method setStart()
     * @param event
     * @param {object} line of transcription table
     */
    function setStart() {
        var sel = trjs.data.selectedLine;
        // put current line in focus if this is not the case
        $('.transcription', sel).focus();
        trjs.param.change(true);
        var t = trjs.media.getTime();
        if (t === '') return;
        var l = trjs.transcription.getLine(sel);
        var prev = lineGetCell(sel, trjs.data.TSCOL);
        var end = lineGetCell(sel, trjs.data.TECOL);
        if (end !== '' && end < t) {
            // warning begining time cannot be above end time
            trjs.log.alert(trjs.messgs.timeBeginGreaterEnd, 'high');
            console.log(trjs.messgs.timeBeginGreaterEnd, end, t);
            // modification of the end time
            lineSetCell(sel, trjs.data.TECOL, '');
            lineSetCell(sel, trjs.data.VTECOL, '');
            trjs.undo.replaceTE(l, end, '');
        }
        lineSetCell(sel, trjs.data.TSCOL, t);
        lineSetCell(sel, trjs.data.VTSCOL, trjs.transcription.formatTime(t));
        trjs.undo.replaceTS(l, prev, t);
        reorder(l); // check if l is at right position and reorder if necessary
        // redraw wave if possible
        setSelectedLine(sel);
        // flash the number so that a feedback is seen
        lineNotify(sel, trjs.data.VTSCOL, 'cyan');
        trjs.check.checkOverlap(sel);
    }

    /**
     * put the time stamp in the last selected line
     * @method setEnd()
     * @param event
     * @param {object} line of transcription table
     */
    function setEnd() {
        var sel = trjs.data.selectedLine;
        // put current line in focus if this is not the case
        $('.transcription', sel).focus();
        trjs.param.change(true);
        var t = trjs.media.getTime();
        if (t === '') return;
        var l = trjs.transcription.getLine(sel);
        var prev = lineGetCell(sel, trjs.data.TECOL);
        var begin = lineGetCell(sel, trjs.data.TSCOL);
        if (begin !== '' && begin > t) {
            // warning begining time cannot be above end time
            trjs.log.alert(trjs.messgs.timeEndSmallerBegin, 'high');
            console.log(trjs.messgs.timeEndSmallerBegin, begin, t);
            return;
        }
        lineSetCell(sel, trjs.data.TECOL, t);
        lineSetCell(sel, trjs.data.VTECOL, trjs.transcription.formatTime(t));
        trjs.undo.replaceTE(l, prev, t);
        // redraw wave if possible
        setSelectedLine(sel);
        // flash the number so that a feedback is seen
        lineNotify(sel, trjs.data.VTECOL, 'cyan');
        trjs.check.checkOverlap(sel);
    }

    /**
     * find the previous (starting for param sel or global selectedLine)
     * line which is a main line or div and has time information
     * @method findLineToStart()
     * @param {object} line of transcription table
     * @return {object} line of transcription table
     */
    function findLineToStart(sel) {
        if (!sel) sel = trjs.data.selectedLine;
        var t = trjs.transcription.typeTier(sel);
        if (t !== 'loc' && t !== 'div') {
            sel = getPreviousMainline(sel);
            if (!sel) return;
        }
        var start = lineGetCell(sel, trjs.data.TSCOL);
        var end = lineGetCell(sel, trjs.data.TECOL);
        while (t !== 'div' && (start === '' || end === '')) {
            sel = getPreviousMainline(sel);
            if (!sel) {
                trjs.log.alert('cannot play this line', 'normal');
                return null;
            }
            t = trjs.transcription.typeTier(sel);
            start = lineGetCell(sel, trjs.data.TSCOL);
            end = lineGetCell(sel, trjs.data.TECOL);
        }
        if (start === '' || end === '') {
            trjs.log.alert('cannot play this line', 'normal');
            return null;
        }
        return sel;
    }

    /**
     * find the next (starting for param sel or global selectedLine)
     * line which is a main line or div and has time information
     * @method findLineToFollow()
     * @param {object} line of transcription table
     * @return {object} line of transcription table
     */
    function findLineToFollow(sel) {
        if (!sel) sel = trjs.data.selectedLine;
        sel = getNextMainline(sel);
        if (!sel) return null;
        var t = trjs.transcription.typeTier(sel);
        var start = lineGetCell(sel, trjs.data.TSCOL);
        var end = lineGetCell(sel, trjs.data.TECOL);
        while (t != 'div' && (start == '' || end == '')) {
            sel = getNextMainline(sel);
            t = trjs.transcription.typeTier(sel);
            start = lineGetCell(sel, trjs.data.TSCOL);
            end = lineGetCell(sel, trjs.data.TECOL);
            if (!sel) return null;
        }
        if (start == '' || end == '') {
            trjs.log.alert('cannot play this line', 'normal');
            return null;
        }
        return sel;
    }

    /**
     * plays the current selected line
     * @method runCurrentLine()
     * @param event
     * @param {object} line of transcription table
     */
    function runCurrentLine(e, sel) {
        if (!sel) sel = trjs.data.selectedLine;
        if (trjs.param.isContinuousPlaying == true)
            trjs.media.endContinuousPlay();
        if (!sel) return;
        sel = findLineToStart(sel);
        if (!sel) return;
        setSelectedLine(sel);
        var start = lineGetCell(sel, trjs.data.TSCOL);
        var end = lineGetCell(sel, trjs.data.TECOL);
        if (!start && Number(start) !== 0) {
            console.log("stop at start", start, end);
            trjs.log.alert("cannot run current line with no time start: use TAB (playpause function)");
            return;
        }
        if (!end && Number(end) !== 0) {
            console.log("stop at end", start, end);
            trjs.log.alert("cannot run current line with no time end: use TAB (playpause function)");
            return;
        }
        trjs.media.runFromTo(start, end, sel);
    }

    /**
     * plays three lines around the current selected line
     * @method runThreeLines()
     * @param event
     * @param {object} line of transcription table
     */
    function runThreeLines(e, sel) {
        if (!sel) sel = trjs.data.selectedLine;
        if (trjs.param.isContinuousPlaying == true)
            trjs.media.endContinuousPlay();
        if (!sel) return;
        var prevline = findLineToStart(sel);
        if (prevline == null) return;
        prevline = getPreviousMainline(prevline);
        if (prevline == null) return;
        var nextline = findLineToFollow(nextline);
        if (nextline == null) return;
        setSelectedLine(prevline);
        var start = lineGetCell(prevline, trjs.data.TSCOL);
        var end = lineGetCell(nextline, trjs.data.TECOL);
        if (!start && Number(start) !== 0) {
            console.log("r3", start, end);
            console.log("stop at start");
            trjs.log.alert("cannot run current line with no time start: use TAB (playpause function)");
            return;
        }
        if (!end && Number(end) !== 0) {
            console.log("r3", start, end);
            console.log("stop at end");
            trjs.log.alert("cannot run current line with no time end: use TAB (playpause function)");
            return;
        }
        trjs.media.runFromTo(start, end, prevline, sel, nextline);
    }

    /**
     * move the current selected line one line up
     * @method keyUp
     * @param event
     * @param sel (selected line)
     */
    function keyUp(e, sel) {
        if (e.transcript !== true) return false;
        e.preventDefault();
        if (!sel) sel = trjs.data.selectedLine;
        var prevline = sel.prev();
        if (prevline.length >= 1) {
            $('.transcription', prevline[0]).focus();
            setSelectedLine(prevline);
        }
        return true;
    }

    /**
     * move the current selected line one line down
     * @method keyDown
     * @param event
     * @param sel (selected line)
     */
    function keyDown(e, sel) {
        if (e.transcript !== true) return false;
        e.preventDefault();
        if (!sel) sel = trjs.data.selectedLine;
        var nextline = sel.next();
        if (nextline.length >= 1) {
            $('.transcription', nextline[0]).focus();
            setSelectedLine(nextline);
        }
        return true;
    }

    /**
     * move the current selected line one page up
     * @method pageUp
     * @param event
     * @param sel (selected line)
     */
    function pageUp(e, sel) {
        if (e.transcript !== true) return false;
        e.preventDefault();
        if (!sel) sel = trjs.data.selectedLine;
        var prevline = sel.prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev();
        if (prevline.length >= 1) {
            $('.transcription', prevline[0]).focus();
            setSelectedLine(prevline);
        }
        return true;
    }

    /**
     * move the current selected line one page down
     * @method pageDown
     * @param event
     * @param sel (selected line)
     */
    function pageDown(e, sel) {
        if (e.transcript !== true) return false;
        e.preventDefault();
        if (!sel) sel = trjs.data.selectedLine;
        var nextline = sel.next().next().next().next().next().next().next().next().next().next().next();
        if (nextline.length >= 1) {
            $('.transcription', nextline[0]).focus();
            setSelectedLine(nextline);
        }
        return true;
    }

    /**
     * move the current selected line to the top of the file
     * @method ctrlHome
     * @param e event
     * @param sel (selected line)
     */
    function ctrlHome(e, sel) {
        if (e.transcript !== true) return false;
        trjs.events.goToLine(1);
        return true;
    }

    /**
     * move the current selected line to bottom of the file
     * @method ctrlEnd
     * @param e event
     * @param sel (selected line)
     */
    function ctrlEnd(e, sel) {
        if (e.transcript !== true) return false;
        var tablelines = trjs.transcription.tablelines();
        trjs.events.goToLine(tablelines.length);
        return true;
    }

    /**
     * move the current selected line up to the previous main line
     * @method keyLocUp
     * @param e event
     * @param sel (selected line)
     */
    function keyLocUp(e, sel) {
        if (e && e.transcript !== true) return false;
        if (!sel) sel = trjs.data.selectedLine;
        var prevline = getPreviousMainline(sel);
        if (prevline != null && prevline.length >= 1) {
            $('.transcription', prevline[0]).focus();
            setSelectedLine(prevline);
        }
        return true;
    }

    /**
     * move the current selected line up to the next main line
     * @method keyLocDown
     * @param e event
     * @param sel (selected line)
     */
    function keyLocDown(e, sel) {
        if (e && e.transcript !== true) return false;
        if (!sel) sel = trjs.data.selectedLine;
        var nextline = getNextMainline(sel);
        if (nextline != null && nextline.length >= 1) {
            $('.transcription', nextline[0]).focus();
            setSelectedLine(nextline);
        }
        return true;
    }

    /**
     * internal remove a line function
     * delete the line pointed by the parameter
     */
    function deleteSelectedLine(sel) {
        // check if at last one line
        var tablelines = trjs.transcription.tablelines();
        if (tablelines.length < 2) {
            // create a new empty file
            trjs.log.boxalert("You removed the last line. The file is automatically initialized with an empty line.");
            trjs.transcription.newTable();
            return;
        }
        var ln = trjs.transcription.getLine(sel);
        var sl = sel.prev();
        if (sl == null || sl.length === 0) {
            var next = sel.next();
            var snext = next;
            sel.remove();
            while (next != null && next.length > 0) {
                lineSetCell(next, trjs.data.LINECOL, ln);
                ln++;
                next = next.next();
            }
            $('.transcription', snext).focus();
            return;
        }
        sel.remove();
        var next = sl ? sl.next() : null;
        while (next != null && next.length > 0) {
            lineSetCell(next, trjs.data.LINECOL, ln);
            ln++;
            next = next.next();
        }
        var nl = sl.next(); // the line that takes place of the old one
        $('.transcription', nl).focus();
        return nl;
    }

    /**
     * remove a line
     * @method deleteLine
     * @param event
     * @param sel (selected line)
     */
    function deleteLine(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        trjs.undo.deleteLine(trjs.transcription.getLine(sel), trjs.undo.getContentOfLine(sel));
        deleteSelectedLine(sel);
    }

    /**
     * remove a line up to the previous mail line and all corresponding dependent lines
     * @method deleteLineLoc
     * @param event
     * @param sel (selected line)
     */
    function deleteLineLoc(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var type = trjs.transcription.typeTier(sel);
        if (type != 'loc' && type != 'div') sel = getPreviousMainline(sel);
        trjs.undo.deleteLine(trjs.transcription.getLine(sel), trjs.undo.getContentOfLine(sel));
        sel = deleteSelectedLine(sel); // deleteSelectedLine returns the next line
        while (sel.length >= 1 && trjs.transcription.typeTier(sel) === 'prop') {
            trjs.undo.deleteLine(trjs.transcription.getLine(sel), trjs.undo.getContentOfLine(sel));
            sel = deleteSelectedLine(sel); // deleteSelectedLine returns the next line
        }
    }

    var copyLine = function (line) {
        var code = trjs.events.lineGetCell(line, trjs.data.CODECOL);
        var ts = trjs.events.lineGetCell(line, trjs.data.TSCOL);
        var te = trjs.events.lineGetCell(line, trjs.data.TECOL);
        var tr = trjs.events.lineGetCellHtml(line, trjs.data.TRCOL);
        return [code, ts, te, tr];
    };

    /**
     * copy a line and the dependent lines in an array
     * @method copyLineLoc
     * @param sel (selected line)
     * @return {array} with 4 values from copyLine
     */
    function copyLineLoc(sel) {
        if (!sel) sel = trjs.data.selectedLine;
        var type = trjs.transcription.typeTier(sel);
        if (type != 'loc' && type != 'div') sel = getPreviousMainline(sel);
        var copy = [copyLine(sel)];
        sel = sel.next();
        while (sel.length >= 1 && trjs.transcription.typeTier(sel) === 'prop') {
            copy.push(copyLine(sel));
            sel = sel.next();
        }
        return copy;
    }

    function insertLineLoc(ptr, copy) {
        for (var i = 0; i < copy.length; i++) {
            var line = trjs.transcription.getLine(ptr);
            trjs.undo.insertLine(line);
            trjs.undo.replaceCode(line + 1, '', copy[i][0]);
            trjs.undo.replaceTS(line + 1, '', copy[i][1]);
            trjs.undo.replaceTE(line + 1, '', copy[i][2]);
            trjs.undo.replaceTrans(line + 1, '', copy[i][3]);
            trjs.events.createRowAfterWith(ptr, trjs.transcription.findCode(copy[i][0]), copy[i][0], copy[i][1], copy[i][2], copy[i][3]);
            ptr = ptr.next();
        }
    }

    /**
     * duplicate a line to the next line
     * @method replicateLine
     * @param event
     * @param sel (selected line)
     */
    function replicateLine(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var line = trjs.transcription.getLine(sel);
        var code = lineGetCell(sel, trjs.data.CODECOL);
        var ts = lineGetCell(sel, trjs.data.TSCOL);
        var te = lineGetCell(sel, trjs.data.TECOL);
        var tr = lineGetCellHtml(sel, trjs.data.TRCOL);
        trjs.undo.insertLine(line);
        // trjs.undo.replaceCode(line+1, '', code);
        trjs.undo.replaceTS(line + 1, '', ts);
        trjs.undo.replaceTE(line + 1, '', te);
        trjs.undo.replaceTrans(line + 1, '', tr);
        createRowAfterWith(sel, trjs.transcription.typeTier(sel), code, ts, te, tr);
    }

    /**
     * internal function for joinLine and joinLineLoc
     * @method __joinLines
     * @param first line to join
     * @param second line to join
     */
    function __joinLines(sel, next) {
        var prevline = trjs.transcription.getLine(sel);
        var nextline = trjs.transcription.getLine(next);
        var prevtr = lineGetCellHtml(sel, trjs.data.TRCOL);
        var nexttr = lineGetCellHtml(next, trjs.data.TRCOL);
        var prevte = lineGetCell(sel, trjs.data.TECOL);
        var nextte = lineGetCell(next, trjs.data.TECOL);
        lineSetCell(sel, trjs.data.TECOL, nextte);
        lineSetCellHtml(sel, trjs.data.TRCOL, prevtr + ' ' + nexttr);
        checkTranscription(sel);
        trjs.undo.replaceTE(prevline, prevte, nextte);
        trjs.undo.replaceTrans(prevline, prevtr, prevtr + ' ' + nexttr);
        trjs.undo.deleteLine(nextline, trjs.undo.getContentOfLine(next));
        deleteSelectedLine(next);
    }

    /**
     * join the current line to the next line
     * @method joinLine
     * @param event
     * @param sel (selected line)
     */
    function joinLine(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var next = sel.next();
        if (next != null && next.length > 0)
            __joinLines(sel, next);
    }

    /**
     * join the previous main (or current) main line to the next main line
     * @method joinLineLoc
     * @param event
     * @param sel (selected line)
     */
    function joinLineLoc(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var type = trjs.transcription.typeTier(sel);
        if (type != 'loc' && type != 'div') sel = getPreviousMainline(sel);
        var next = getNextMainline(sel);
        if (next != null && next.length > 0)
            __joinLines(sel, next);
    }

    /**
     * internal function for insertWithTime and insertWithTimeLoc
     * @method __insertWithTimeHere
     * @param current line
     * @param where to insert line
     */
    function __insertWithTimeHere(sel, nextsel) {
        var tm = trjs.media.getTime();
        var ftm = trjs.transcription.formatTime(tm);
        var te = lineGetCell(sel, trjs.data.TECOL);
        var ts = lineGetCell(sel, trjs.data.TSCOL);
        if (tm !== '' && ts !== '' && tm < ts) {
            // warning begining time cannot be above end time
            trjs.log.alert(trjs.messgs.timeEndSmallerBegin, 'high');
            console.log(trjs.messgs.timeEndSmallerBegin, tm, ts);
            return;
        }
        var linenumber = trjs.transcription.getLine(sel);
        lineSetCell(sel, trjs.data.TECOL, tm);
        lineSetCell(sel, trjs.data.VTECOL, ftm);
        trjs.undo.replaceTE(linenumber, te, tm);
        if (tm !== '' && tm > te) te = Number(tm) + 1;
        var type = trjs.transcription.typeTier(sel);
        var code = lineGetCell(sel, trjs.data.CODECOL);
        if (type === 'div') {
            type = 'main loc';
            code = '---';
        }
        createRowAfterWith(nextsel, type, code, tm, te, "");
        linenumber = trjs.transcription.getLine(nextsel);
        trjs.undo.insertLine(linenumber);
        trjs.undo.replaceCode(linenumber + 1, '', code);
        trjs.undo.replaceTS(linenumber + 1, '', tm);
        trjs.undo.replaceTE(linenumber + 1, '', te);
        $('.transcription', nextsel.next()).focus();
        if (tm !== '') reorder(linenumber + 1); // check if l is at right position and reorder if necessary
        if (trjs.param.alwaysCheckOverlap === true) trjs.check.checkOverlap(nextsel);
    }

    /**
     * insert a new main line after the last dependence of the current main line and copy the current time
     * to the end of the current main line and the begining of the next (created) main line
     * @method insertWithTimeLoc
     * @param event
     * @param sel (selected line)
     */
    function insertWithTimeLoc(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        $('.transcription', sel).focus();
        __insertWithTimeHere(sel, getLastTierline(sel));
    }

    /**
     * insert a line after the current line and copy the current time
     * to the end of the current line and the begining of the next (created) line
     * @method insertWithTime
     * @param event
     * @param sel (selected line)
     */
    function insertWithTime(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        $('.transcription', sel).focus();
        __insertWithTimeHere(sel, sel);
    }

    /**
     * insert a new empty main line after the current or above main line
     * @method insertBlankLineLoc
     * @param event
     * @param sel (selected line)
     */
    function insertBlankLineLoc(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        $('.transcription', sel).focus();
        var type = trjs.transcription.typeTier(sel);
        if (type === 'prop') sel = getPreviousMainline(sel);
        type = trjs.transcription.typeTier(sel);
        if (type === 'div') type = 'main loc';
        var nl = getLastTierline(sel);
        var linenumber = trjs.transcription.getLine(nl);
        createRowAfterWith(nl, type, '---', '', '', "");
        trjs.undo.insertLine(linenumber);
        $('.transcription', getLastTierline(sel).next()).focus();
        return getLastTierline(sel).next();
    }

    /**
     * insert a new empty main line before the current or above main line
     * @method insertBlankLineLocBefore
     * @param event
     * @param sel (selected line)
     */
    function insertBlankLineLocBefore(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        $('.transcription', sel).focus();
        var type = trjs.transcription.typeTier(sel);
        if (type === 'prop') sel = getPreviousMainline(sel);
        type = trjs.transcription.typeTier(sel);
        if (type === 'div') type = 'main loc';
        var nl = getLastTierline(sel);
        var linenumber = trjs.transcription.getLine(nl);
        createRowBeforeWith(nl, type, '---', '', '', "");
        trjs.undo.insertLine(linenumber);
        $('.transcription', getLastTierline(sel).prev()).focus();
        return getLastTierline(sel).prev();
    }

    /**
     * insert a new empty main line after the current line
     * @method insertBlankLine
     * @param event
     * @param sel (selected line)
     */
    function insertBlankLine(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        $('.transcription', sel).focus();
        var type = trjs.transcription.typeTier(sel);
        if (type === 'div') type = 'main loc';
        var linenumber = trjs.transcription.getLine(sel);
        createRowAfterWith(sel, type, '---', '', '', "");
        trjs.undo.insertLine(linenumber);
        $('.transcription', sel.next()).focus();
        return sel.next();
    }

    /**
     * set begining of div for current line
     * @method setDivPlus
     * @param event
     * @param sel (selected line)
     */
    function setDivPlus(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var linenumber = trjs.transcription.getLine(sel);
        var pc = lineGetCell(sel, trjs.data.CODECOL);
        trjs.transcription.setType(sel, 'main div');
        trjs.transcription.setCode(sel, '+div+');
        trjs.undo.replaceCode(linenumber, pc, '+div+');
        var t = lineGetCell(sel, trjs.data.TRCOL);
        var f = trjs.transcription.createDivEditField(t, '');
        lineSetCellHtml(sel, trjs.data.TRCOL, f);
        trjs.transcription.trUpdateCSS(sel);
    }

    /**
     * set end of div for current line
     * @method setDivMinus
     * @param event
     * @param sel (selected line)
     */
    function setDivMinus(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var linenumber = trjs.transcription.getLine(sel);
        var pc = lineGetCell(sel, trjs.data.CODECOL);
        var tablelines = trjs.transcription.tablelines();
        var upto = sel.prev();
        if (upto.length > 0) {
            var nbm = trjs.transcription.nbMissingDiv(tablelines, upto);
            if (nbm < 2) {
                trjs.log.alert(trjs.messgs.nodivminus, 'high');
                return;
            }
        }
        trjs.transcription.setType(sel, 'main div');
        trjs.transcription.setCode(sel, '-div-');
        trjs.undo.replaceCode(linenumber, pc, '-div-');
        trjs.transcription.trUpdateCSS(sel);
    }

    /**
     * insert a new empty begining of div after current line
     * @method setDivPlusInsert
     * @param event
     * @param sel (selected line)
     */
    function setDivPlusInsert(e, sel) {
        trjs.param.change(true);
        var linenumber = trjs.transcription.getLine(sel);
        if (!sel) sel = trjs.data.selectedLine;
        createRowAfterWith(sel, 'main div', '+div+', '', '', trjs.transcription.createDivEditField('', ''));
        trjs.undo.insertLine(linenumber);
        trjs.undo.replaceCode(linenumber + 1, '', '+div+');
        $('.transcription', sel[0]).focus();
    }

    /**
     * add a new end of div after current line and any number of missing div as needed
     * @method setDivMissingMinus
     * @param event
     * @param sel (selected line)
     */
    function setDivMissingMinus(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var tablelines = trjs.transcription.tablelines();
        var nbm = trjs.transcription.nbMissingDiv(tablelines, sel) - 1;
        var prev = sel.prev();
        for (var i = 0; i < nbm; i++) { // add all necessary -div- (end of divs)
            var linenumber = trjs.transcription.getLine(prev);
            createRowAfterWith(prev, 'main div', '-div-', '', '', '');
            trjs.undo.insertLine(linenumber);
            trjs.undo.replaceCode(linenumber, '', '-div-');
            prev = prev.next();
        }
        $('.transcription', sel[0]).focus();
    }

    /**
     * add a new end of div after current line
     * @method setDivMinusInsert
     * @param event
     * @param sel (selected line)
     */
    function setDivMinusInsert(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var linenumber = trjs.transcription.getLine(sel);
        var tablelines = trjs.transcription.tablelines();
        var nbm = trjs.transcription.nbMissingDiv(tablelines, sel);
        if (nbm < 2) {
            trjs.log.alert(trjs.messgs.nodivminus, 'high');
            return;
        }
        createRowAfterWith(sel, 'main div', '-div-', '', '', '');
        trjs.undo.insertLine(linenumber);
        trjs.undo.replaceCode(linenumber + 1, '', '-div-');
        $('.transcription', sel[0]).focus();
    }

    /**
     * set the nth participant name as the name of locutor for current line
     * @method setNthLoc
     * @param sel (selected line)
     * @param int (nth locutor)
     */
    function setNthLoc(sel, nth) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var table = $("#template-code");
        var tablelines = $('tr', table[0]);
        if (nth >= tablelines.length) return;
        var n = 1;
        for (var i = 1; i < tablelines.length; i++) {
            if (n === nth) {
                var loc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
                if (trjs.param.locnames === true)
                    loc = trjs.data.codes[loc];
                var linenumber = trjs.transcription.getLine(sel);
                var pc = trjs.transcription.getCode(sel);
                if (pc === '+div+' || pc === '-div-') {
                    var t = lineGetCell(sel, trjs.data.TRCOL); // removes the html information
                    lineSetCell(sel, trjs.data.TRCOL, t);
                }
                pc = lineGetCell(sel, trjs.data.CODECOL);
                trjs.transcription.setType(sel, 'main loc');
                trjs.transcription.setCode(sel, loc);
                trjs.undo.replaceCode(linenumber, pc, loc);
                trjs.transcription.trUpdateCSS(sel, loc);
                return;
            }
            n++;
        }
        return;
    }

    /**
     * set the nth template tier name as the name of tier for current line
     * @method setNthTier
     * @param sel (selected line)
     * @param int (nth tier)
     */
    function setNthTier(sel, nth) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var table = $("#template-tier");
        var tablelines = $('tr', table[0]);
        if (nth >= tablelines.length) return;
        var n = 1;
        for (var i = 1; i < tablelines.length; i++) {
            if (n === nth) {
                var loc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
                var linenumber = trjs.transcription.getLine(sel);
                var pc = trjs.transcription.getCode(sel);
                if (pc === '+div+' || pc === '-div-') {
                    var t = lineGetCell(sel, trjs.data.TRCOL); // removes the html information
                    lineSetCell(sel, trjs.data.TRCOL, t);
                }
                pc = lineGetCell(sel, trjs.data.CODECOL);
                trjs.transcription.setType(sel, 'main prop');
                trjs.transcription.setCode(sel, loc);
                trjs.undo.replaceCode(linenumber, pc, loc);
                trjs.transcription.trUpdateCSS(sel, loc);
                return;
            }
            n++;
        }
        return;
    }

    /**
     * internal function for setTimeReplace and setTimeReplaceLoc
     * @method __setTimeReplace
     * @param line with previous time
     * @param line with new time
     */
    function __setTimeReplace(prevline, nextline) {
        var tm = trjs.media.getTime();
        if (tm === '') {
            setSelectedLine(nextline);
            return;
        }
        var linenumber = trjs.transcription.getLine(prevline);
        var begin = lineGetCell(prevline, trjs.data.TSCOL);
        if (begin !== '' && begin > tm) {
            // warning begining time cannot be above end time
            trjs.log.alert(trjs.messgs.timeEndSmallerBegin, 'high');
            console.log(trjs.messgs.timeEndSmallerBegin, begin, tm);
            return;
        }
        var ft = lineGetCell(prevline, trjs.data.TECOL);
        lineSetCell(prevline, trjs.data.TECOL, tm);
        var ftm = trjs.transcription.formatTime(tm);
        lineSetCell(prevline, trjs.data.VTECOL, ftm);
        trjs.undo.replaceTE(linenumber, ft, tm);
        linenumber = trjs.transcription.getLine(nextline);
        ft = lineGetCell(nextline, trjs.data.TSCOL);
        lineSetCell(nextline, trjs.data.TSCOL, tm);
        lineSetCell(nextline, trjs.data.VTSCOL, ftm);
        trjs.undo.replaceTS(linenumber, ft, tm);
        $('.transcription', nextline[0]).focus();
        setSelectedLine(nextline);
        reorder(linenumber); // check if l is at right position and reorder if necessary
        if (trjs.param.alwaysCheckOverlap === true) trjs.check.checkOverlap(nextline);
    }

    /**
     * set current time at end of current line and at begining of next line
     * @method setTimeReplace
     * @param event
     * @param sel (selected line)
     */
    function setTimeReplace(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var nextline = sel.next();
        if (nextline.length >= 1)
            __setTimeReplace(sel, nextline);
    }

    /**
     * set current time at end of current or above main line and at begining of next line
     * @method setTimeReplace
     * @param event
     * @param sel (selected line)
     */
    function setTimeReplaceLoc(e, sel) {
        trjs.param.change(true);
        if (!sel) sel = trjs.data.selectedLine;
        var type = trjs.transcription.typeTier(sel);
        var prevline = (type == 'loc' || type == 'div') ? sel : getPreviousMainline(sel);
        var nextline = getNextMainline(sel);
        if (nextline && nextline.length >= 1)
            __setTimeReplace(prevline, nextline);
    }

    /**
     * jump to line by number and display it
     * @method goToLine
     * @param int (number of line)
     */
    function goToLine(ln) {
        var tablelines = trjs.transcription.tablelines();
        if (ln < 1 || ln > tablelines.length) {
            console.log('erroneous line number', ln);
            return;
        }
        var d = $('#transcription-bench');
        var m = trjs.utils.notVisibleInContainer(d, $(tablelines[ln - 1]));
        setSelectedLine($(tablelines[ln - 1]));
        if (m != 0) {
            //console.log("should scroll");
            var vPos = d.scrollTop();
            d.animate({scrollTop: vPos + m}, 0);
        }
        $('.transcription', tablelines[ln - 1]).focus();
    }

    /**
     * returns a pointer to the very first loc of a transcript
     * @method firstLoc
     */
    function firstLoc() {
        var tablelines = trjs.transcription.tablelines();
        for (var i = 0; i < tablelines.length; i++) {
            if (trjs.transcription.typeTier($(tablelines[i])) == 'loc') return $(tablelines[i]);
        }
        return null;
    }

    /**
     * implements enter key differently if it is in insert or replace mode or at the end of the file
     * @method enter
     * @param event
     * @param sel (selected line)
     */
    function enter(e, sel) {
        if (e) {
            if (e.transcript !== true) return;
            if ($(e.target).attr('class') !== 'transcription') { // we are not in the main line
                // just go down next line
                var nextline = sel.next();
                $('.transcription', nextline[0]).focus();
                return;
            }
        }
        if (!sel) sel = trjs.data.selectedLine;
        var tm = trjs.media.getTime();
        var ts = lineGetCell(sel, trjs.data.TSCOL);
        if (tm !== '' && ts !== '' && tm < ts) {
            // warning begining time cannot be above end time
            trjs.log.alert(trjs.messgs.timeEndSmallerBegin, 'high');
            console.log(trjs.messgs.timeEndSmallerBegin, tm, ts);
            return;
        }
        /*
         if (trjs.param.modeinsert === true) {
         //insertWithTimeLoc(undefined, sel);
         splitLineLoc(undefined, sel);
         trjs.dmz.redraw('partition');
         return true;
         }
         */
        var nextline = sel.next();
        if (nextline === null || nextline.length < 1) {
            // create a new line at the end
            insertWithTime(undefined, sel);
        } else if (trjs.transcription.isEmptyRow(nextline)) {
            var linenumber = trjs.transcription.getLine(sel);
            var prevTE = lineGetCell(sel, trjs.data.TECOL);
            lineSetCell(sel, trjs.data.TECOL, tm);
            lineSetCell(sel, trjs.data.VTECOL, trjs.transcription.formatTime(tm));
            trjs.undo.replaceTE(linenumber, prevTE, tm);
            var type = trjs.transcription.typeTier(nextline);
            var code = lineGetCell(nextline, trjs.data.CODECOL);
            if (type === 'div') {
                type = 'main loc';
                code = 'main ---';
            }
            fillRowWith(nextline, type, code, tm, '', " ");
            trjs.undo.replaceCode(linenumber + 1, '', code);
            trjs.undo.replaceTS(linenumber + 1, '', tm);
            trjs.transcription.trUpdateCSS(nextline, code);
            $('.transcription', nextline[0]).focus();
            if (tm !== '') reorder(linenumber + 1); // check if l is at right position and reorder if necessary
            if (trjs.param.alwaysCheckOverlap === true) trjs.check.checkOverlap(nextline);
        } else {
            setTimeReplaceLoc(undefined, sel);
        }
        trjs.dmz.redraw('partition');
        return true;
    }

    /**
     * split a line in two parts around the cursor
     * do not change time values
     * @param event
     * @method splitLine
     * @param line to be splitted
     */
    function splitLine(e, line) {
        trjs.param.change(true);
        var range = rangy.createRange();
        // All DOM Range methods and properties supported
        range.selectNodeContents(document.body);
        // Selection object based on those in Mozilla, WebKit and Opera
        var sel = rangy.getSelection();
        var deb = sel.anchorOffset;
        var ctn = lineGetCellHtml(line, trjs.data.TRCOL);
        var nl = insertBlankLine(undefined, line);
        var linenumber = trjs.transcription.getLine(line);
        var firstpart = ctn.substr(0, deb);
        if (firstpart !== '') {
            lineSetCellHtml(line, trjs.data.TRCOL, firstpart);
            trjs.undo.replaceTrans(linenumber, ctn, firstpart);
        } else {
            lineSetCell(line, trjs.data.TRCOL, '');
            trjs.undo.replaceTrans(linenumber, ctn, '');
        }
        var secondpart = ctn.substr(deb);
        if (secondpart !== '') {
            lineSetCellHtml(nl, trjs.data.TRCOL, secondpart);
            trjs.undo.replaceTrans(linenumber + 1, '', secondpart);
        }
        lineSetCell(nl, trjs.data.CODECOL, lineGetCell(line, trjs.data.CODECOL));
        trjs.undo.replaceCode(linenumber + 1, '', lineGetCell(line, trjs.data.CODECOL));
    }

    /**
     * split a line in two parts around the cursor
     * inserts new time values if loc line
     * @method splitLineLoc
     * @param event
     * @param line to be splitted
     */
    function splitLineLoc(e, line) {
        trjs.param.change(true);
        var tm = trjs.media.getTime();
        var range = rangy.createRange();
        // All DOM Range methods and properties supported
        range.selectNodeContents(document.body);
        // Selection object based on those in Mozilla, WebKit and Opera
        var sel = rangy.getSelection();
        var deb = sel.anchorOffset;
        var ctn = lineGetCellHtml(line, trjs.data.TRCOL);
        // TEST if the current line is a main line or a secondary line or a div line
        var type = trjs.transcription.typeTier(line);
        if (type === 'loc') {
            var nl = insertBlankLineLoc(undefined, line);
            var linenumber = trjs.transcription.getLine(line);
            var firstpart = ctn.substr(0, deb);
            if (firstpart !== '') {
                lineSetCellHtml(line, trjs.data.TRCOL, firstpart);
                trjs.undo.replaceTrans(linenumber, ctn, firstpart);
            } else {
                lineSetCell(line, trjs.data.TRCOL, '');
                trjs.undo.replaceTrans(linenumber, ctn, '');
            }
            var secondpart = ctn.substr(deb);
            if (secondpart !== '') {
                lineSetCellHtml(nl, trjs.data.TRCOL, secondpart);
                trjs.undo.replaceTrans(linenumber + 1, '', secondpart);
            }
            lineSetCell(nl, trjs.data.CODECOL, lineGetCell(line, trjs.data.CODECOL));
            trjs.undo.replaceCode(linenumber + 1, '', lineGetCell(line, trjs.data.CODECOL));
            var t1 = lineGetCell(line, trjs.data.TSCOL);
            var t2 = lineGetCell(line, trjs.data.TECOL);
            lineSetCell(line, trjs.data.TECOL, tm);
            lineSetCell(line, trjs.data.VTECOL, trjs.transcription.formatTime(tm));
            trjs.undo.replaceTE(linenumber, t2, tm);
            lineSetCell(nl, trjs.data.TSCOL, tm);
            lineSetCell(nl, trjs.data.VTSCOL, trjs.transcription.formatTime(tm));
            trjs.undo.replaceTS(linenumber + 1, '', tm);
            if (tm !== '') reorder(linenumber + 1); // check if l is at right position and reorder if necessary
            if (tm === '' || (tm >= t1 && tm <= t2)) {
                // the current time is between the start and end of the current occurrence
                // use it to split the time in two parts
                lineSetCell(nl, trjs.data.TECOL, t2);
                lineSetCell(nl, trjs.data.VTECOL, trjs.transcription.formatTime(t2));
                trjs.undo.replaceTE(linenumber + 1, '', t2);
            } else {
                lineSetCell(nl, trjs.data.TECOL, tm + 1);
                lineSetCell(nl, trjs.data.VTECOL, trjs.transcription.formatTime(tm + 1));
                trjs.undo.replaceTE(linenumber + 1, '', tm + 1);
            }
        } else {
            var nl = insertBlankLine(undefined, line);
            var linenumber = trjs.transcription.getLine(line);
            var firstpart = ctn.substr(0, deb);
            var secondpart = ctn.substr(deb);
            lineSetCellHtml(line, trjs.data.TRCOL, firstpart);
            lineSetCellHtml(nl, trjs.data.TRCOL, secondpart);
            lineSetCell(nl, trjs.data.CODECOL, lineGetCell(line, trjs.data.CODECOL));
            trjs.undo.replaceTrans(linenumber, ctn, firstpart);
            trjs.undo.replaceTrans(linenumber + 1, '', secondpart);
            trjs.undo.replaceCode(linenumber + 1, '', lineGetCell(line, trjs.data.CODECOL));
        }
    }

    function escape(e) {
        if (trjs.param.isContinuousPlaying == true) {
            trjs.media.endContinuousPlay();
            e.preventDefault();
            return true;
        }
        var media = $('#media-display')[0].firstElementChild;
        if (media && media.pause && !media.paused) {
            media.pause();
            e.preventDefault();
            return true;
        }
        return false;
    }

    function shiftTab(e) {
        if (e) {
            if (e.transcript !== true) return false;
            e.preventDefault();
        }
        trjs.media.playStartLine(e);
        return true;
    }

    function tab(e) {
        if (e) {
            // if (e.transcript !== true) return false;
            e.preventDefault();
        }
        console.log("tab:", trjs.param.synchro.witch());
        if (trjs.param.isContinuousPlaying == true) {
            trjs.media.endContinuousPlay();
            return true;
        }
        if (trjs.param.synchro.control())
            trjs.media.playCurrent();
        else if (trjs.param.synchro.block())
            trjs.media.playJump();
        else if (trjs.param.synchro.free())
            trjs.media.playPause();
        return true;
    }

    function chooseInputDevice() {
        navigator.mediaDevices.enumerateDevices().then(
            function(devices) {
                var audiooutputDevices = devices.filter(function(device) { return device.kind === 'audiooutput'; } );
                var mediaEltStr = "";
                for (var i = 0; i < audiooutputDevices.length ; i++)
                    mediaEltStr += i + " " + audiooutputDevices[i].label + " ;<br/> ";
                var mediaElt = document.getElementById('media-element');
                bootbox.prompt({
                    title: "Choose media device in:<br/>" + mediaEltStr,
                    //: "Audio output device",
                    inputType: 'number',
                    callback: function (p) {
                        console.log('chooseInputDevice', mediaEltStr);
                        var n = parseInt(p);
                        console.log('setSinkId', n);
                        if (n && n !== 'NaN') {
                            mediaElt.setSinkId(audiooutputDevices[n].deviceId);
                            console.log('Audio is being played on ' + mediaElt.sinkId);
                            console.log(mediaElt);
                        }
                    }
                    /*
                    buttons: {
                        ok: {
                            label: trjs.messgs.labelok,
                            className: "btn-success",
                            callback: function () {
                                p =
                                var n = parseInt(p);
                                if (n && n !== 'NaN') {
                                    mediaElt.setSinkId(audiooutputDevices[n].deviceId);
                                    console.log('Audio is being played on ' + mediaElt.sinkId);
                                    console.log(mediaElt);
                                }
                            }
                        },
                        cancel: {
                            label: trjs.messgs.labelcancel,
                            className: "btn-default",
                            callback: function () {
                                return;
                            }
                        },
                    },
                    */
                });
            },
            function(d) { console.log('devices not found: ', d); alert('devices not found'); }
        );
    }

    /**
     * handle keys pressed down in the software
     * @method eventKeydown
     * @param {event} e
     */
    var specialEvent1 = false;
    var specialEvent2 = false;
    function enterKeydown(e) {
        var charCode = (typeof e.which === undefined) ? e.keyCode : e.which;
        if (charCode !== 13) return false;
        return eventKeydown(e, true);
    }
    function eventKeydown(e, enter) {
        /*
         console.log('keyCode '+ e.keyCode);
         console.log('charCode '+ e.charCode);
         console.log('ctrl '+ e.ctrlKey);
         console.log('alt '+ e.altKey);
         console.log('shift '+ e.shiftKey);
         console.log('meta '+ e.metaKey);
        */
        /*
         console.log(e);
         console.log(trjs.data.currentBrowserName);
         console.log(e.keyIdentifier.toString());

         if (trjs.data.currentBrowserName === 'Safari' && e.keyCode === 222) {
         console.log(e.keyIdentifier + ' \u0027 \u0022');
         if (e.keyIdentifier.toString() === '\u0022') e.keyCode = 51;
         else if (e.keyIdentifier == 22) e.keyCode = 52;
         }
         console.log('keyCode '+ e.keyCode);
         console.log('charCode '+ e.charCode);
         */
        var charCode = (typeof e.which === undefined) ? e.keyCode : e.which;
        var keyptr = trjs.keys.modifiersEvent(charCode, e);
        // console.log("keydown", charCode, e.altKey?"alt":"", keyptr);
        if (enter !== true && charCode === 13) return false;
        if (trjs.param.server !== 'electron') {
            var m = $('#openfile').data('bs.modal');
            if (m && m.isShown) {
                if (filetree) filetree.keyboard(e);
                return true;
            }
        }
        if (trjs.keys.ispress(e))
            return false;

        if (trjs.data.eventAnnex === true) {
            trjs.data.eventAnnex = false;
            return true;
        }

        if (trjs.param.mode === 'readonly') {
            if (trjs.data.selectedLine)
                e.transcript = true;
        } else {
            var istr = $(e.target).parents('#transcript');
            if (istr.length > 0) {
                var l = $(e.target).parent(); // if in transcript find the current line.
                trjs.data.setSelectedLine(l);
                e.transcript = true;
            }
        }

        // if modifier only key, skip it
        if (trjs.keys.skipModifierKey.indexOf(charCode) >= 0) return true;
        // var keyptr = trjs.keys.modifiersEvent(charCode, e);
        // console.log("KEYPTR= ", keyptr);
        if (isNaN(keyptr)) return true;

        if (keyptr === trjs.keys.specialChar1) {
            specialEvent1 = true;
            return true;
        } else if (keyptr === trjs.keys.specialChar2) {
            specialEvent2 = true;
            return true;
        }

        // Not necessary if it goes through here it is handled by the macros
        // if (charCode === 62) {
        //     e.preventDefault();
        //     trjs.macros.replaceSelectedText(trjs.data.rightBracket); // '\u27E9');
        //     return true;
        // }

        if (specialEvent1 === true) {
            specialEvent1 = false;
            var f = trjs.tablekeysSE1[keyptr];
            //console.log("F= ", f);
            //console.log("SE1 " + charCode + ' ' + keyptr + ' ' + f);
            if (f !== undefined) {
                e.preventDefault();
                return f(e, trjs.data.selectedLine);
                // if e.transcript is undefined then we are not in the transcript editing area
                // e can be useful in some functions were we have to process an input field
            }
            return false;
        } else if (specialEvent2 === true) {
            specialEvent2 = false;
            var f = trjs.tablekeysSE2[keyptr];
            //console.log("F= ", f);
            //console.log("SE2 " + charCode + ' ' + keyptr + ' ' + f);
            if (f !== undefined) {
                e.preventDefault();
                return f(e, trjs.data.selectedLine);
                // if e.transcript is undefined then we are not in the transcript editing area
                // e can be useful in some functions were we have to process an input field
            }
            return false;
        } else {
            var f = trjs.tablekeys[keyptr];
            //console.log("F= ", f);
            // console.log("normal " + charCode + ' ' + keyptr + ' ' + f);
            if (f !== undefined) {
                e.preventDefault();
                return f(e, trjs.data.selectedLine);
                // if e.transcript is undefined then we are not in the transcript editing area
                // e can be useful in some functions were we have to process an input field
            }
            return false;
        }
    }

    /**
     * handle keys pressed in the software
     * this is necessary for some keys and some browsers
     * @method eventKeypress
     * @param {event} e
     */
    function eventKeypress(e) {
        /*
         console.log('keyCode '+ e.keyCode);
         console.log('charCode '+ e.charCode);
         console.log('ctrl '+ e.ctrlKey);
         console.log('alt '+ e.altKey);
         console.log('shift '+ e.shiftKey);
         console.log('meta '+ e.metaKey);
         console.log('ident ' + e.keyIdentifier);
         */
        var charCode = (typeof e.which === undefined) ? e.keyCode : e.which;
        var keyptr = trjs.keys.modifiersEvent(charCode, e);
        // console.log("keypress", charCode, e.altKey?"alt":"", keyptr);
        switch (charCode) {
            /*
            case 10: // newline
            case 13: // return
                e.preventDefault();
                enter(e);
                return true;
            */
            case 60: //
                e.preventDefault();
                trjs.macros.replaceSelectedText(trjs.data.leftBracket); //'\u27E8');
                return true;
            case 62:
                e.preventDefault();
                trjs.macros.replaceSelectedText(trjs.data.rightBracket); // '\u27E9');
                return true;
            /*
            case 34:
                e.preventDefault();
                if (e.ctrlKey) {
                    if (e.altKey)
                        trjs.events.setNthTier3();
                    else
                        trjs.events.setNthLoc3();
                }
                else
                    trjs.macros.replaceSelectedText('"');
                return true;
            case 39:
                e.preventDefault();
                if (e.ctrlKey) {
                    if (e.altKey)
                        trjs.events.setNthTier4();
                    else
                        trjs.events.setNthLoc4();
                }
                else
                    trjs.macros.replaceSelectedText("'");
                return true;
            case 51:
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (e.altKey)
                        trjs.events.setNthTier3();
                    else
                        trjs.events.setNthLoc3();
                    return true;
                }
                return false;
            case 52:
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (e.altKey)
                        trjs.events.setNthTier4();
                    else
                        trjs.events.setNthLoc4();
                    return true;
                }
                return false;
            */
        }
        return false;
    }

    /*
     * reset uncorrect value in time editing zone
     */
    function resetTimeEditing(event) {
        var p = $(event.target).attr('class');
        if (p === 'vts') {
            var v = lineGetCell($(event.target).parent(), trjs.data.TSCOL);
            lineSetCell($(event.target).parent(), trjs.data.VTSCOL, trjs.transcription.formatTime(v));
        }
        else {
            var v = lineGetCell($(event.target).parent(), trjs.data.TECOL);
            lineSetCell($(event.target).parent(), trjs.data.VTECOL, trjs.transcription.formatTime(v));
        }
    }

    /**
     * check and modify the value of the time edited directly by the user
     * @method checkTime
     * @param event
     */
    function checkTime(event) {
        //console.log(event);
        //console.log(event.target);
        event.preventDefault();
        // découper en parties
        var tx = event.target.textContent;
        if (tx === '' || tx === 0 || tx === null) {
            var p = $(event.target).attr('class');
            if (p === 'vts') {
                lineSetCell($(event.target).parent(), trjs.data.TSCOL, '');
                lineSetCell($(event.target).parent(), trjs.data.VTSCOL, '');
                trjs.undo.ts.check(event);  // store undo information
                trjs.dmz.redraw('partition');
            }
            else {
                lineSetCell($(event.target).parent(), trjs.data.TECOL, '');
                lineSetCell($(event.target).parent(), trjs.data.VTECOL, '');
                trjs.undo.te.check(event);  // store undo information
                trjs.dmz.redraw('partition');
            }
            return;
        }
        if (trjs.param.formatTime === 'hms') {
            var m = tx.split(/[hmsHMS]/);
            if (m.length !== 3) {
                trjs.log.alert('Mauvais format de temps. Format correct: HhMmSs.ms', 'normal');
                resetTimeEditing(event);
                return;
            }
            var h = parseInt(m[0]);
            var mn = parseInt(m[1]);
            var s = parseFloat(m[2]);
            if (mn > 59 || mn < 0) {
                trjs.log.alert('Mauvais format des minutes: entre 0 et 59', 'normal');
                resetTimeEditing(event);
                return;
            }
            if (s > 59 || s < 0) {
                trjs.log.alert('Mauvais format des secondes: entre 0 et 59', 'normal');
                resetTimeEditing(event);
                return;
            }
            var newt = h * 3600 + mn * 60 + s;
        } else {
            var m = tx.split(':');
            if (m.length === 1) {
                var newt = parseFloat(m[0]);
                var p = $(event.target).attr('class');
                if (p === 'vts') {
                    lineSetCell($(event.target).parent(), trjs.data.TSCOL, newt);
                    lineSetCell($(event.target).parent(), trjs.data.VTSCOL, trjs.transcription.formatTime(newt));
                    trjs.undo.ts.check(event);  // store undo information
                    trjs.dmz.redraw('partition');
                }
                else {
                    lineSetCell($(event.target).parent(), trjs.data.TECOL, newt);
                    lineSetCell($(event.target).parent(), trjs.data.VTECOL, trjs.transcription.formatTime(newt));
                    trjs.undo.te.check(event);  // store undo information
                    trjs.dmz.redraw('partition');
                }
                return;
            }
            if (m.length === 2) {
                var mn = parseInt(m[0]);
                var s = parseFloat(m[1]);
                var newt = mn * 60 + s;
                var p = $(event.target).attr('class');
                if (p === 'vts') {
                    lineSetCell($(event.target).parent(), trjs.data.TSCOL, newt);
                    lineSetCell($(event.target).parent(), trjs.data.VTSCOL, trjs.transcription.formatTime(newt));
                    trjs.undo.ts.check(event);  // store undo information
                    trjs.dmz.redraw('partition');
                }
                else {
                    lineSetCell($(event.target).parent(), trjs.data.TECOL, newt);
                    lineSetCell($(event.target).parent(), trjs.data.VTECOL, trjs.transcription.formatTime(newt));
                    trjs.undo.te.check(event);  // store undo information
                    trjs.dmz.redraw('partition');
                }
                return;
            }
            if (m.length !== 3) {
                trjs.log.alert('Mauvais format de temps. Format correct: H:M:S.ms', 'normal');
                resetTimeEditing(event);
                return;
            }
            var h = parseInt(m[0]);
            var mn = parseInt(m[1]);
            var s = parseFloat(m[2]);
            if (mn > 59 || mn < 0) {
                trjs.log.alert('Mauvais format des minutes: entre 0 et 59', 'normal');
                resetTimeEditing(event);
                return;
            }
            if (s > 59 || s < 0) {
                trjs.log.alert('Mauvais format des secondes: entre 0 et 59', 'normal');
                resetTimeEditing(event);
                return;
            }
            var newt = h * 3600 + mn * 60 + s;
        }
        var p = $(event.target).attr('class');
        var sel = $(event.target).parent();
        if (p === 'vts') {
            var end = lineGetCell(sel, trjs.data.TECOL);
            if (end !== '' && end < newt) {
                // warning begining time cannot be above end time
                trjs.log.alert(trjs.messgs.timeBeginGreaterEnd, 'high');
                console.log(trjs.messgs.timeBeginGreaterEnd, end, newt);
                var oldtime = lineGetCell(sel, trjs.data.TSCOL);
                lineSetCell(sel, trjs.data.VTSCOL, trjs.transcription.formatTime(oldtime));
                return;
            }
            lineSetCell(sel, trjs.data.TSCOL, newt);
            lineSetCell(sel, trjs.data.VTSCOL, trjs.transcription.formatTime(newt));
            trjs.undo.ts.check(event);  // store undo information
            trjs.dmz.redraw('partition');
            var l = trjs.transcription.getLine(sel);
            if (newt !== '') reorder(l);
        }
        else {
            var begin = lineGetCell(sel, trjs.data.TSCOL);
            if (begin !== '' && begin > newt) {
                // warning begining time cannot be above end time
                trjs.log.alert(trjs.messgs.timeEndSmallerBegin, 'high');
                console.log(trjs.messgs.timeEndSmallerBegin, begin, newt);
                var oldtime = lineGetCell(sel, trjs.data.TECOL);
                lineSetCell(sel, trjs.data.VTECOL, trjs.transcription.formatTime(oldtime));
                return;
            }
            lineSetCell(sel, trjs.data.TECOL, newt);
            lineSetCell(sel, trjs.data.VTECOL, trjs.transcription.formatTime(newt));
            trjs.undo.te.check(event);  // store undo information
            trjs.dmz.redraw('partition');
        }
        trjs.check.checkOverlap(sel);
    }

    /**
     * change the value of the time in order to be edited directly by the user
     * @method putTime
     * @param event
     */
    function putTime(event) {
        //console.log(event);
        //console.log(event.target);
        event.preventDefault();
        // select cell
        var p = $(event.target).attr('class');
        if (p === 'vts') {
            trjs.undo.ts.protect(event);  // stores undo information
            var realval = lineGetCell($(event.target).parent(), trjs.data.TSCOL);
            var editval = lineGetCell($(event.target).parent(), trjs.data.VTSCOL);
            var newval = realval - Math.floor(realval);
            if (trjs.param.nbdigits === 0)
                var val = editval + newval.toString().substring(1, 5);
            else if (trjs.param.nbdigits === 1)
                var val = editval + newval.toString().substring(3, 5);
            else if (trjs.param.nbdigits === 2)
                var val = editval + newval.toString().substring(4, 5);
            lineSetCell($(event.target).parent(), trjs.data.VTSCOL, val);
        }
        else {
            trjs.undo.te.protect(event);  // stores undo information
            var realval = lineGetCell($(event.target).parent(), trjs.data.TECOL);
            var editval = lineGetCell($(event.target).parent(), trjs.data.VTECOL);
            var newval = realval - Math.floor(realval);
            if (trjs.param.nbdigits === 0)
                var val = editval + newval.toString().substring(1, 5);
            else if (trjs.param.nbdigits === 1)
                var val = editval + newval.toString().substring(3, 5);
            else if (trjs.param.nbdigits === 2)
                var val = editval + newval.toString().substring(4, 5);
            lineSetCell($(event.target).parent(), trjs.data.VTECOL, val);
        }
    }

    /*
     * link variable to close in checkLoc() the window element element opened in clickLoc()
     */
    var eltClickLoc = null;

    /**
     * check whether the current content of a locutor column is correct
     * if not, change the content to '---' and send a message
     * @method checkLoc
     * @param event
     */
    function checkLoc(event) {
        //console.log(event);
        //console.log(event.target);
        trjs.undo.code.check(event);  // stores undo information
        event.preventDefault();
        //console.log("checkLoc1");
        if (eltClickLoc != null) {
            //console.log("checkLoc2");
            // under firefox on windows onblur is called before the click on the context menu
            return;
            //document.body.removeChild(eltClickLoc);
            //eltClickLoc = null;
        }
        if (event.target.textContent === '+lex+') {
            return; // it's ok (lexicon)
        }
        var type = trjs.transcription.findCode(event.target.textContent);
        console.log("checkLoc3: " + type + ' ' + event.target.textContent);
        if (type === '---') {
            trjs.log.alert('You have to create code names for users and templates before using them. <b>'
                + event.target.textContent + '</b> cannot be used unless you edit persons or templates first.', 'high');
            // event.target.textContent = '---';
            var p = $(event.target).parent();
            if (!trjs.check.testMark(event.target.textContent))
                trjs.transcription.setCode(p, trjs.check.setMark(event.target.textContent));
            // trjs.undo.replaceCode(trjs.transcription.getLine($(event.target).parent()), event.target.textContent, '---');
            trjs.editor.showParticipant();
            trjs.editor.showTemplate();
        } else {
            if (event.target.textContent === '+div+') {
                setDivPlus(undefined, $(event.target).parent());
            } else if (event.target.textContent === '-div-') {
                setDivMinus(undefined, $(event.target).parent());
            } else if (event.target.textContent === '+incident+') {
            } else if (event.target.textContent === '+pause+') {
            } else if (event.target.textContent === '+note+') {
            } else {
                var p = $(event.target).parent();
                if (type === 'prop') {
                    trjs.transcription.setType(p, 'main prop');
                    trjs.transcription.setCode(p, event.target.textContent);
                } else if (type === 'loc') {
                    trjs.transcription.setType(p, 'main loc');
                    trjs.transcription.setCode(p, event.target.textContent);
                }
            //$(event.target).attr('class', type);
            //var p = $(event.target).parent();
            //p.attr('class', type);
            }
            trjs.transcription.trUpdateCSS(p);
            trjs.dmz.redraw('partition');
        }
    }

    /**
     * display a menu to choose the content of a locutor column
     * if not, change the content to '---' and send a message
     * @method clickLoc
     * @param event (method used only for CMD+click)
     */
    function clickLoc(e) {
        e.preventDefault();
        var s = "<table><thead><th data-cancel=1>Person</th><th data-cancel=1>Template</th></thead>";
        s += "<tr><td>+div+</td><td>-div-</td></tr>";
        s += "<tr><td>+incident+</td><td>+pause+</td></tr>";
        s += "<tr><td>+note+</td><td>---</td></tr>";
        // creates two separate lists of main tiers and sub tiers
        var m = [];
        var t = [];
        var table = $("#template-code");
        var tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
        //m.push(icode.toUpperCase());
            m.push(icode);
        }
        table = $("#template-tier");
        tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
        //t.push(icode.toLowerCase());
            t.push(icode);
        }
        var l = m.length > t.length ? m.length : t.length;
        for (var i = 0; i < l; i++) {
            s += "<tr>";
            if (i < m.length)
                s += "<td>" + m[i] + "</td>";
            else
                s += "<td></td>";
            if (i < t.length)
                s += "<td>" + t[i] + "</td>";
            else
                s += "<td></td>";
            s += "</tr>";
        }
        s += "<tfoot><th data-cancel=1>Cancel</th><th data-cancel=1>Cancel</th></tfoot>";
        s += "</table>";
        if (eltClickLoc !== null) {
            document.body.removeChild(eltClickLoc);
            eltClickLoc = null;
        }
        eltClickLoc = document.createElement("div");
        //elt.innerHTML = s;
        $(eltClickLoc).html(s);
        $(eltClickLoc).click(function (evt) {
            //console.log(evt.target);
            var ln = $(e.target).parent();
            // e.target.textContent = evt.target.textContent;
            if ($(evt.target).data('cancel') == 1) {
                // if the user uses cancel then it might have edited by hand the line and put a wrong value
                // so we need to check this before closing.
                document.body.removeChild(eltClickLoc);
                eltClickLoc = null;
                var type = trjs.transcription.findCode(trjs.transcription.getCode(ln));
                if (type === '') {
                    trjs.log.alert('You have to create code names for users and templates before using them. <b>'
                        + event.target.textContent + '</b> cannot be used unless you edit persons or templates first.', 'high');
                    event.target.textContent = '---';
                    trjs.undo.code.check(e);
                    trjs.editor.showParticipant();
                    trjs.editor.showTemplate();
                }
            } else {
                if (evt.target.textContent === '+div+') {
                    setDivPlus(undefined, ln);
                } else if (evt.target.textContent === '-div-') {
                    setDivMinus(undefined, ln);
                } else if (evt.target.textContent === '+pause+') {
                    trjs.transcription.setCode(ln, '+pause+');
                    trjs.transcription.setType(ln, 'main loc');
                } else if (evt.target.textContent === '+incident+') {
                    trjs.transcription.setCode(ln, '+incident+');
                    trjs.transcription.setType(ln, 'main loc');
                } else {
                    var pc = trjs.transcription.getCode(ln);
                    if (pc === '+div+' || pc === '-div-') {
                        var t = lineGetCell(ln, trjs.data.TRCOL); // removes the html information
                        lineSetCell(ln, trjs.data.TRCOL, t);
                    }
                    if (evt.target.cellIndex === 0)
                        trjs.transcription.setType(ln, 'main loc');
                    else
                        trjs.transcription.setType(ln, 'main prop');
                    trjs.transcription.setCode(ln, evt.target.textContent);
                }
                trjs.undo.code.check(e);
                trjs.transcription.trUpdateCSS(ln);
                trjs.dmz.redraw('partition');
                document.body.removeChild(eltClickLoc);
                eltClickLoc = null;
            }
        });
        var r = e.target.getBoundingClientRect();
        var c = window.document.documentElement.getBoundingClientRect();
        eltClickLoc.setAttribute("style", "position:fixed;top:-1000px;left:0px;background-color:lightblue;border:2px solid blue;font-size:1em;");
        document.body.appendChild(eltClickLoc);
        var x = eltClickLoc.getBoundingClientRect();
        var nt = r.top;
        if (r.top + x.height > c.bottom) nt = c.bottom - x.height;
        eltClickLoc.setAttribute("style", "position:fixed;top:" + nt + "px;left:" + (r.right + 40) + "px;background-color:lightblue;border:2px solid blue;font-size:1em;");
        $(eltClickLoc).focus();
        return true;
    }

    /**
     * set the value of the current selected line and redraw display accordingly
     * method setSelectedLine
     */
    function setSelectedLine(line, origin) {
        trjs.data.setSelectedLine(line);
        var start = lineGetCell(line, trjs.data.TSCOL);
        var end = lineGetCell(line, trjs.data.TECOL);
        var type = trjs.transcription.typeTier(line);

        if (start)
            $('#starttime').text(trjs.transcription.formatTime(start));
        else
            $('#starttime').text(' ');
        if (end)
            $('#stoptime').text(trjs.transcription.formatTime(end));
        else
            $('#stoptime').text(' ');
        if (type !== 'div')
            trjs.dmz.highlight(start, end, line, 'running', origin); // draw partition and allows setting the time in media.currentTime
    }

    /**
     * check if the locuteur at the current time in the partition is the one that is expected
     */
    function sameLoc(loc, line) {
        if (loc === undefined) return true;
        var lineloc = trjs.transcription.getCode(line);
        if (loc === lineloc) return true;
        if (loc === '...') {
            if (trjs.dmz.isPartition())  // not to do if there is no partition
                for (var i = 0; i < trjs.dmz.nbVisible() - 1; i++)
                    if (trjs.dmz.sortLoc(i) === lineloc) return false;
            return true;
        }
        return false;
    }

    /**
     * find the line corresponding to the time in the media
     * and jump to that line
     * @method goToTime
     * @param {number} time to go to (if null then use media.currentTime)
     */
    function goToTime(origin, pt, withfocus, loc) {
        var media = $('#media-display')[0].firstElementChild;
        try {
            if (pt === undefined) {  // time does not need to be reset
                pt = Number(media.currentTime);
            } else {
                pt = Number(pt);
                media.currentTime = pt; // will redisplay the wave
            }
        } catch (e) {
            return;
        }
        if (trjs.data.selectedLine) {
            var s = trjs.dataload.checknumber(trjs.events.lineGetCell(trjs.data.selectedLine, trjs.data.TSCOL));
            var e = trjs.dataload.checknumber(trjs.events.lineGetCell(trjs.data.selectedLine, trjs.data.TECOL));
            if (pt >= s && pt <= e && sameLoc(loc, trjs.data.selectedLine)) return false; // it is the current line.
        }
        /*
         * if the current selected line does not the job, then we try to find the exact line (locuteur included)
         * or if the clic was not on the locutor, the first locutor that is at the same time or the first locuteur after the clic time
         */
        var tablelines = trjs.transcription.tablelines();
        var firstOK = null; // exact value found or first value that could be OK
        for (var i = 0; i < tablelines.length - 1; i++) {
            if (trjs.transcription.typeTier($(tablelines[i])) === 'div') continue;
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            if (its === '' || ite === '' || ite < pt) continue;
            if (its <= pt && pt <= ite && sameLoc(loc, $(tablelines[i]))) {
                firstOK = i;
                break;
            }
            if (its <= pt && pt <= ite)
                if (firstOK === null) firstOK = i;
            if (its > pt)
                break;
        }
        if (firstOK === null) return;
        /*
         * if not at the end of the array of transcription
         * and we found something
         * select the line and put in at the top of display
         * also display the partition element located
         */
        var d = $('#transcription-bench');
        var m = trjs.utils.notVisibleInContainer(d, $(tablelines[firstOK]));
        if (m != 0) {
            //console.log("should scroll");
            var vPos = d.scrollTop();
            d.animate({scrollTop: vPos + m}, 0);
        }
        var f = $('.transcription', tablelines[firstOK]);
        // document.activeElement = f[0];
        if (withfocus === true) f.focus();
        trjs.events.setSelectedLine($(tablelines[firstOK]), origin);  // wave is draw when the time is set above (with media.currentTime)
        return true;
    }

    return {
        checkLoc: checkLoc,
        checkTime: checkTime,
        chooseInputDevice: chooseInputDevice,
        clickLoc: clickLoc,
        copyLine: copyLine,
        createRowAfterWith: createRowAfterWith,
        ctrlEnd: ctrlEnd,
        ctrlHome: ctrlHome,
        deleteLine: deleteLine,
        deleteLineAndRedraw: function (e, p) {
            trjs.undo.opinit('deleteLineAndRedraw');
            deleteLine(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('deleteLineAndRedraw');
            return true;
        },
        deleteLineLocAndRedraw: function (e, p) {
            trjs.undo.opinit('deleteLineLocAndRedraw');
            deleteLineLoc(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('deleteLineLocAndRedraw');
            return true;
        },
        deleteSelectedLine: deleteSelectedLine,
        enter: enter,
        eventKeydown: eventKeydown,
        enterKeydown: enterKeydown,
        eventKeypress: eventKeypress,
        escape: escape,
        findLineToFollow: findLineToFollow,
        findLineToStart: findLineToStart,
        firstLoc: firstLoc,
        getSelectedLine: getSelectedLine,
        goContinuous: goContinuous,
        goToLine: goToLine,
        goToTime: goToTime,
        insertBlankLineAndRedraw: function (e, p) {
            trjs.undo.opinit('insertBlankLineAndRedraw');
            insertBlankLine(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('insertBlankLineAndRedraw');
            return true;
        },
        insertBlankLineLocAndRedraw: function (e, p) {
            trjs.undo.opinit('insertBlankLineLocAndRedraw');
            insertBlankLineLoc(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('insertBlankLineLocAndRedraw');
            return true;
        },
        insertBlankLineLocBeforeAndRedraw: function (e, p) {
            trjs.undo.opinit('insertBlankLineLocAfterAndRedraw');
            insertBlankLineLocBefore(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('insertBlankLineLocAfterAndRedraw');
            return true;
        },
        insertLineLoc: insertLineLoc,
        insertWithTimeAndRedraw: function (e, p) {
            trjs.undo.opinit('insertWithTimeAndRedraw');
            insertWithTime(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('insertWithTimeAndRedraw');
            return true;
        },
        insertWithTimeLocAndRedraw: function (e, p) {
            trjs.undo.opinit('insertWithTimeLocAndRedraw');
            insertWithTimeLoc(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('insertWithTimeLocAndRedraw');
            return true;
        },
        joinLine: function (e, p) {
            trjs.undo.opinit('joinLine');
            joinLine(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('joinLine');
            return true;
        },
        joinLineLoc: function (e, p) {
            trjs.undo.opinit('joinLineLoc');
            joinLineLoc(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('joinLineLoc');
            return true;
        },
        keyUp: keyUp,
        keyDown: keyDown,
        keyLocUp: keyLocUp,
        keyLocDown: keyLocDown,
        lineGetCell: lineGetCell,
        lineGetCellHtml: lineGetCellHtml,
        lineSetCell: lineSetCell,
        lineSetCellHtml: lineSetCellHtml,
        pageUp: pageUp,
        pageDown: pageDown,
        putTime: putTime,
        replicateLineAndRedraw: function (e, p) {
            trjs.undo.opinit('replicateLineAndRedraw');
            replicateLine(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('replicateLineAndRedraw');
            return true;
        },
        runCurrentLine: runCurrentLine,
        runThreeLines: runThreeLines,
        setDivPlus: function (e, p) {
            trjs.undo.opinit('setDivPlus');
            var r = setDivPlus(e, p);
            trjs.undo.opclose('setDivPlus');
            return r;
        },
        setDivMinus: function (e, p) {
            trjs.undo.opinit('setDivMinus');
            var r = setDivMinus(e, p);
            trjs.undo.opclose('setDivMinus');
            return r;
        },
        setDivMissingMinus: function (e, p) {
            trjs.undo.opinit('setDivMissingMinus');
            var r = setDivMissingMinus(e, p);
            trjs.undo.opclose('setDivMissingMinus');
            return r;
        },
        setDivPlusInsert: function (e, p) {
            trjs.undo.opinit('setDivPlusInsert');
            var r = setDivPlusInsert(e, p);
            trjs.undo.opclose('setDivPlusInsert');
            return r;
        },
        setDivMinusInsert: function (e, p) {
            trjs.undo.opclose('setDivMinusInsert');
            var r = setDivMinusInsert(e, p);
            trjs.undo.opinit('setDivMinusInsert');
            return r;
        },
        setEnd: setEnd,
        setFocus: setFocus,
        setEndAndRedraw: function (e) {
            trjs.undo.opinit('setEndAndRedraw');
            setEnd(e);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('setEndAndRedraw');
            return true;
        },
        setNthLoc: function (e, p) {
            trjs.undo.opinit('setNthLoc');
            var r = setNthLoc(e, p);
            trjs.undo.opclose('setNthLoc');
            return r;
        },
        setNthTier: function (e, p) {
            trjs.undo.opinit('setNthTier');
            var r = setNthTier(e, p);
            trjs.undo.opclose('setNthTier');
            return r;
        },
        setSelectedLine: setSelectedLine,
        setStart: setStart,
        setStartAndRedraw: function (e) {
            trjs.undo.opinit('setStartAndRedraw');
            setStart(e);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('setStartAndRedraw');
            return true;
        },
        setTimeReplaceAndRedraw: function (e, p) {
            trjs.undo.opinit('setTimeReplaceAndRedraw');
            setTimeReplace(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('setTimeReplaceAndRedraw');
            return true;
        },
        setTimeReplaceLocAndRedraw: function (e, p) {
            trjs.undo.opinit('setTimeReplaceLocAndRedraw');
            setTimeReplaceLoc(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('setTimeReplaceLocAndRedraw');
            return true;
        },
        setTimeSelectedLine: setTimeSelectedLine,
        shiftTab: shiftTab,
        splitLineAndRedraw: function (e, p) {
            trjs.undo.opinit('splitLineAndRedraw');
            splitLine(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('splitLineAndRedraw');
            return true;
        },
        splitLineLocAndRedraw: function (e, p) {
            trjs.undo.opinit('splitLineLocAndRedraw');
            splitLineLoc(e, p);
            trjs.dmz.redraw('partition');
            trjs.undo.opclose('splitLineLocAndRedraw');
            return true;
        },
        tab: tab,
        transcriptGotFocus: transcriptGotFocus,
    };
})();

/*
 * tables of functions for keyboard mapping
 */
trjs.events.setNthLoc1 = function (e) {
    trjs.events.setNthLoc(undefined, 1);
    trjs.dmz.redraw('partition');
};  // Ctrl 1
trjs.events.setNthLoc2 = function (e) {
    trjs.events.setNthLoc(undefined, 2);
    trjs.dmz.redraw('partition');
};  // Ctrl 2
trjs.events.setNthLoc3 = function (e) {
    trjs.events.setNthLoc(undefined, 3);
    trjs.dmz.redraw('partition');
};  // Ctrl 3
trjs.events.setNthLoc4 = function (e) {
    trjs.events.setNthLoc(undefined, 4);
    trjs.dmz.redraw('partition');
};  // Ctrl 4
trjs.events.setNthLoc5 = function (e) {
    trjs.events.setNthLoc(undefined, 5);
    trjs.dmz.redraw('partition');
};  // Ctrl 5
trjs.events.setNthLoc6 = function (e) {
    trjs.events.setNthLoc(undefined, 6);
    trjs.dmz.redraw('partition');
};  // Ctrl 6
trjs.events.setNthLoc7 = function (e) {
    trjs.events.setNthLoc(undefined, 7);
    trjs.dmz.redraw('partition');
};  // Ctrl 7
trjs.events.setNthLoc8 = function (e) {
    trjs.events.setNthLoc(undefined, 8);
    trjs.dmz.redraw('partition');
};  // Ctrl 8
trjs.events.setNthLoc9 = function (e) {
    trjs.events.setNthLoc(undefined, 9);
    trjs.dmz.redraw('partition');
};  // Ctrl 9
trjs.events.setNthTier1 = function (e) {
    trjs.events.setNthTier(undefined, 1);
    trjs.dmz.redraw('partition');
};  // Ctrl Alt 1
trjs.events.setNthTier2 = function (e) {
    trjs.events.setNthTier(undefined, 2);
    trjs.dmz.redraw('partition');
};  // Ctrl Alt 2
trjs.events.setNthTier3 = function (e) {
    trjs.events.setNthTier(undefined, 3);
    trjs.dmz.redraw('partition');
};  // Ctrl Alt 3
trjs.events.setNthTier4 = function (e) {
    trjs.events.setNthTier(undefined, 4);
    trjs.dmz.redraw('partition');
};  // Ctrl Alt 4
trjs.events.setNthTier5 = function (e) {
    trjs.events.setNthTier(undefined, 5);
    trjs.dmz.redraw('partition');
};  // Ctrl Alt 5
trjs.events.setNthTier6 = function (e) {
    trjs.events.setNthTier(undefined, 6);
    trjs.dmz.redraw('partition');
};  // Ctrl Alt 6
trjs.events.setNthTier7 = function (e) {
    trjs.events.setNthTier(undefined, 7);
    trjs.dmz.redraw('partition');
};  // Ctrl Alt 7
trjs.events.setNthTier8 = function (e) {
    trjs.events.setNthTier(undefined, 8);
    trjs.dmz.redraw('partition');
};  // Ctrl Alt 8
trjs.events.setNthTier9 = function (e) {
    trjs.events.setNthTier(undefined, 9);
    trjs.dmz.redraw('partition');
};  // Ctrl Alt 9
