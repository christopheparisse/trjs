/**
 * implementation of various check of the transcription lines
 *  @author Christophe Parisse
 *  @module check
 */

'use strict';

var gramchat = require("./editor/checkclanmain.js");
var chatter = require('./node/chatter.js');

trjs.check = (function () {
    function testChatline(t, callback) {
        try {
            t = trjs.transcription.transcriptEncoding(t);
            chatter.chatter(t, "eng", function(err, messg) {
                if (err) {
                    var ret = [];
                    for (var i = 0; i < messg.length; i++)
                        ret.push({ message: messg[i][2], column: messg[i][1] });
                    callback({ value: 'error', list: ret });
                    console.log('NotGood:', messg, ret);
                } else {
                    callback({ value: 'ok' });
                    // console.log('Perfect:', messg);
                }
            });
        } catch (e) {
            console.log(e);
            trjs.log.boxalert(e);
        }
        /*
        try {
            t = trjs.transcription.transcriptEncoding(t);
            var r = gramchat.parse(t);
            if (r.startsWith('warning:'))
                return { value: 'warning', message: r};
            return { value: 'ok', message: r }; // line is ok
        } catch (e) {
            // console.log(e);
            if (e.location && e.location.start)
                return { value: 'error', message: "error at column " + e.location.start.column };
            else
                return { value: 'error', message: " - reason: " + e.message };
        }
        */
    }

    function trimMark(s) {
        if (s.indexOf(trjs.data.MARK) === 0)
            s = s.substr(1);
        else
            return s;
        if (s.lastIndexOf(trjs.data.MARK) === s.length - 1)
            return s.substr(0, s.length - 1);
        else
            return s;
    }

    function setMark(s) {
        return trjs.data.MARK + s + trjs.data.MARK;
    }

    function testMark(s) {
        return s.indexOf(trjs.data.MARK) === 0;
    }

    /**
     * check if the current line has an overlap in time with the same locuteur in the previous and next utterance of the locutor
     */
    function checkOverlap(sel) {
        //console.log('checkOverlap');
        var loc = trjs.transcription.getCode(sel);
        if (loc.indexOf('+') === 0 || loc.indexOf('-') === 0 || loc.indexOf('=') === 0) return;
        var chg = false;
        if (testMark(loc)) {
            loc = trimMark(loc);
            chg = true;
        }
        var start = trjs.events.lineGetCell(sel, trjs.data.TSCOL);
        var end = trjs.events.lineGetCell(sel, trjs.data.TECOL);
        if (start === '') return;
        if (end === '') return;

        var p = sel.prev();
        while (p && p.length > 0) {
            var pLoc = trimMark(trjs.transcription.getCode(p));
            var pEnd = trjs.events.lineGetCell(p, trjs.data.TECOL);
            //console.log('>' + loc + ' ' + pLoc + ' ' + pEnd);
            if (pLoc !== loc || pEnd === '') {
                p = p.prev();
                continue;
            }
            if (parseFloat(pEnd) <= parseFloat(start)) {
                //console.log('not overlap before');
                if (chg) trjs.transcription.setCode(sel, loc);
                break; // no overlap before
            }
            trjs.transcription.setCode(sel, setMark(loc));
            trjs.log.alert('Overlap with the same locutor. Please check.', 'high');
            return;
        }

        p = sel.next();
        while (p && p.length > 0) {
            var pLoc = trimMark(trjs.transcription.getCode(p));
            var pStart = trjs.events.lineGetCell(p, trjs.data.TSCOL);
            //console.log('<' + loc + ' ' + pLoc + ' ' + pStart);
            if (pLoc !== loc || pStart === '') {
                p = p.next();
                continue;
            }
            if (parseFloat(pStart) >= parseFloat(end)) {
                //console.log('not overlap after');
                if (chg) trjs.transcription.setCode(sel, loc);
                break; // no overlap after
            }
            trjs.transcription.setCode(sel, setMark(loc));
            trjs.log.alert('Overlap with the same locutor. Please check.', 'high');
            return;
        }
    }

    /**
     * check if the current line has an overlap in time with the same locuteur in the next utterance of the locutor
     * @param {jquery object} pointer to tablelines
     * @returns true if this is the case
     */
    function checkOverlapNext(sel) {
        var loc = trjs.transcription.getCode(sel);
        var chg = false;
        if (testMark(loc)) {
            loc = trimMark(loc);
            chg = true;
        }
        if (loc === '+div+') return;
        var end = trjs.events.lineGetCell(sel, trjs.data.TECOL);
        if (end === '') return;

        var p = sel.next();
        while (p && p.length > 0) {
            var pLoc = trimMark(trjs.transcription.getCode(p));
            var pStart = trjs.events.lineGetCell(p, trjs.data.TSCOL);
            if (pLoc !== loc || pStart === '') {
                p = p.next();
                continue;
            }
            if (parseFloat(pStart) >= parseFloat(end)) {
                if (chg) trjs.transcription.setCode(sel, loc);
                break; // no overlap after
            }
            //console.log('check '+trjs.transcription.getLine(sel)+' '+trjs.transcription.getLine(p)+' '+loc+' '+end+' '+pStart);
            trjs.transcription.setCode(sel, setMark(loc));
            return true;
        }
    }

    /*
     * check all lines for possible incomplete locutors or errors in transcription
     */
    function goCheck() {
        trjs.data.check = []; // empty array of line numbers
        trjs.data.checkCount = 0;
        trjs.data.checkToDo = 0;
        trjs.data.checkDone = 0;
        trjs.data.checkAddMsg = function(m) {
            // {n: i, message: errs.join("<br/>")}
            trjs.data.checkCount++;
            trjs.data.check.push({ n: trjs.data.checkCount, message: errs.join("<br/>")});
        }
        var tablelines = trjs.transcription.tablelines();
        for (var i = 0; i < tablelines.length - 1; i++) {
            var sel = $(tablelines[i]);
            var loc = trjs.transcription.getCode(sel);
            var type = trjs.transcription.findCode(loc);
            var errs = [];
            if (loc === '---') {
                errs.push('error on locutor');
            }
            if (checkOverlapNext(sel)) {
                errs.push('overlap on same locutor');
            }
            if (loc === '-div-' && trjs.dataload.checkstring(trjs.events.lineGetCell(sel, trjs.data.TRCOL)) !== '') {
            }
            if (type === 'loc') {
                trjs.data.checkToDo++;
                checkTranscription(sel, errs, true);
            }
        }
        /*
         wait for all to display results
         */
        $('#check-nb-results').text(trjs.data.checkCount);
        $('#check-nbx').text(trjs.data.checkCount);
    }

    /*
     * check current line for possible incomplete locutors or errors in transcription
     */
    function checkCurrentLine(e, sel) {
        if (sel === undefined) sel = trjs.data.selectedLine;
        var loc = trjs.transcription.getCode(sel);
        var type = trjs.transcription.findCode(loc);
        var errs = [];
        if (loc === '---') {
            errs.push('error on locutor');
        }
        if (checkOverlapNext(sel)) {
            errs.push('overlap on same locutor');
        }
        if (loc === '-div-' && trjs.dataload.checkstring(trjs.events.lineGetCell(sel, trjs.data.TRCOL)) !== '') {
            errs.push('end of div with comment (not allowed)');
        }
        if (type === 'loc') {
            cleanTranscription(sel);
            checkTranscription(sel, errs, false);
        }
    }

    /**
     * check a line for whichever method is set for the file (by defaut CHAT but can be other transcription systems)
     * @method checkTranscription
     */
    function checkTranscription(sel, errs, all) {
        // if the transcription is not correct, modify the line and return false
        // else return true
        if (trjs.param.format === 'CHAT') {
            var t = trjs.events.lineGetCell(sel, trjs.data.TRCOL);
            console.log("check", t);
            trjs.check.testChatline(t, function(ck) {
                trjs.data.checkDone++;
                console.log("result", ck.value, ck.list);
                if (ck.value !== 'ok') {
                    var loc = trjs.transcription.getCode(sel);
                    loc = setMark(loc);
                    trjs.transcription.setCode(sel, loc);
                    // indicate in the transcription where the error is.
                    var u = trjs.events.lineGetCell(sel, trjs.data.TRCOL);
                    var m = '<error data-toggle="tooltip" title="' + ck.list[0].message + '">';
                    if (ck.list[0].column >= u.length)
                        u = u + m + trjs.data.errorMarker + '</error>';
                    else
                        u = u.substring(0, ck.list[0].column) + m + u.substring(ck.list[0].column) + '</error>';
                    trjs.events.lineSetCellHtml(sel, trjs.data.TRCOL, u);
                    trjs.param.setTooltip();
                    errs.push(ck.message);
                    if (all === false) {
                        if (errs.length > 0) {
                            trjs.log.boxalert(errs.join("<br/>"));
                        }
                    } else {
                        if (errs.length > 0) {
                            trjs.data.checkAddMsg(errs.join("<br/>"));
                            trjs.data.checkCount++;
                        }
                    }
                }
            });
        }
        // return { value: 'unavailable' };
    }

    /**
     * remove error messages from a transcription
     * @param t
     * @returns {void | string}
     */
    function cleanErrors(t) {
        // t = t.replace(/<error.*?>.*?<\/error>/g, '');
        console.log("clean: ",t);
        /*
        var re = RegExp(trjs.data.leftBracket + "error.*?" + trjs.data.rightBracket, "g");
        re = RegExp(trjs.data.leftBracket + "\/error" + trjs.data.rightBracket, "g");
        */
        t = t.replace(RegExp('<error.*?>' + trjs.data.errorMarker + '<\/error>', 'g'), '');
        t = t.replace(/<error.*?>/g, '');
        t = t.replace(/<\/error>/g, '');
        t = t.replace(/&nbsp;/g, ' ');
        console.log("cleanOut: ",t);
        return t;
    }

    /**
     * remove all special information (e.g. syntax checking) from the current line
     */
    function cleanCurrentLine() {
        var sel = trjs.data.selectedLine;
        cleanTranscription(sel);
    }

    function cleanTranscription(sel) {
        var t = trjs.events.lineGetCell(sel, trjs.data.TRCOL);
        if (t.indexOf('<error') < 0) return; // nothing to clean
        t = cleanErrors(t);
        trjs.events.lineSetCell(sel, trjs.data.TRCOL, t);
    }

    /**
     * check all lines for possible incomplete locutors or overlaps
     * @method checkFinal
     */
    function checkFinal() {
        goCheck();
        if (trjs.data.checkCount > 0) {
            trjs.data.checkPos = 0;
            $('#check-posx').text(1);
            trjs.events.goToLine(trjs.data.check[0].n + 1);
            $('#check-valx').text(trjs.data.check[0].message);
            trjs.editor.showCheck(true);
        } else
            trjs.log.boxalert(trjs.messgs.checknoerror);
    }

    /**
     * display previous check position
     * @method prevCheck
     */
    function prevCheck() {
        if (trjs.data.check.length > 0 && trjs.data.checkCount > 0) {
            if (trjs.data.checkPos > 0) {
                trjs.data.checkPos--;
                $('#check-posx').text(trjs.data.checkPos + 1);
                trjs.events.goToLine(trjs.data.check[trjs.data.checkPos].n + 1);
                $('#check-valx').text(trjs.data.check[trjs.data.checkPos].message);
            } else {
                $('#check-posx').text(1);
                trjs.events.goToLine(trjs.data.check[0].n + 1);
                $('#check-valx').text(trjs.data.check[0].message);
            }
        }
    }

    /**
     * display next check position
     * @method nextCheck
     */
    function nextCheck() {
        if (trjs.data.check.length > 0 && trjs.data.checkCount > 0) {
            if (trjs.data.checkPos < trjs.data.checkCount - 1) {
                trjs.data.checkPos++;
                $('#check-posx').text(trjs.data.checkPos + 1);
                trjs.events.goToLine(trjs.data.check[trjs.data.checkPos].n + 1);
                $('#check-valx').text(trjs.data.check[trjs.data.checkPos].message);
            } else {
                $('#check-posx').text(trjs.data.checkCount);
                trjs.events.goToLine(trjs.data.check[trjs.data.checkCount - 1].n + 1);
                $('#check-valx').text(trjs.data.check[trjs.data.checkCount - 1].message);
            }
        }
    }

    return {
        checkFinal: checkFinal,
        checkOverlap: checkOverlap,
        cleanErrors: cleanErrors,
        cleanCurrentLine: cleanCurrentLine,
        cleanTranscription: cleanTranscription,
        checkCurrentLine: checkCurrentLine,
        goCheck: goCheck,
        nextCheck: nextCheck,
        prevCheck: prevCheck,
        setMark: setMark,
        testMark: testMark,
        testChatline: testChatline,
        trimMark: trimMark,
    };
})();
