/**
 * implementation of various check of the transcription lines
 *  @author Christophe Parisse
 *  @module check
 */

'use strict';

var gramchat = require("./editor/checkclanmain.js");

trjs.check = (function () {
    function testChatline(t) {
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
                var ck = checkTranscription(sel);
                if (trjs.param.final === true && ck.value !== 'ok' && ck.value !== 'unavailable') {
                    errs.push(ck.message);
                }
            }
            if (errs.length > 0) {
                trjs.data.check.push({n: i, message: errs.join("<br/>")});
                trjs.data.checkCount++;
            }
        }
        $('#check-nb-results').text(trjs.data.checkCount);
        $('#check-nbx').text(trjs.data.checkCount);
    }

    /*
     * check current line for possible incomplete locutors or errors in transcription
     */
    function currentLineCheck(e, sel) {
        if (sel === undefined) sel = trjs.data.selectedLine;
        var errs = [];
        var loc = trjs.transcription.getCode(sel);
        var type = trjs.transcription.findCode(loc);
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
            var ck = checkTranscription(sel);
            if (ck.value !== 'ok' && ck.value !== 'unavailable') {
                errs.push(ck.message);
            }
        }
        if (errs.length > 0) {
            trjs.log.boxalert(errs.join("<br/>"));
        }
    }

    /**
     * check a line for whichever method is set for the file (by defaut CHAT but can be other transcription systems)
     * @method checkTranscription
     */
    function checkTranscription(sel) {
        // if the transcription is not correct, modify the line and return false
        // else return true
        if (trjs.param.format === 'CHAT') {
            var t = trjs.events.lineGetCell(sel, trjs.data.TRCOL);
            var ck = trjs.check.testChatline(t);
            if (ck.value !== 'ok') {
                var loc = trjs.transcription.getCode(sel);
                loc = setMark(loc);
                trjs.transcription.setCode(sel, loc);
                return ck;
            }
            return ck;
        } else
            return { value: 'unavailable' };
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
        currentLineCheck: currentLineCheck,
        goCheck: goCheck,
        nextCheck: nextCheck,
        prevCheck: prevCheck,
        setMark: setMark,
        testMark: testMark,
        testChatline: testChatline,
        trimMark: trimMark,
    };
})();
