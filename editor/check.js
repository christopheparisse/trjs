/**
 * implementation of various check of the transcription lines
 *  @author Christophe Parisse
 *  @module check
 */

'use strict';

var gramchat = require("./editor/checkclanmain.js");
var chatter = require('./node/chatter.js');

trjs.check = (function () {
    function testChatlines(text, callback) {
        try {
            for (var i in text) {
                text[i] = trjs.transcription.transcriptEncoding(text[i]);
            }
            chatter.chatter(text, "eng", function(err, messg) {
                if (err) {
                    var ret = [];
                    for (var i = 0; i < messg.length; i++)
                        ret.push({ message: messg[i][2], line: messg[i][0], column: messg[i][1] });
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
        if (testMark(s)) return;
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
        var tablelines = trjs.transcription.tablelines();
        console.log(tablelines);
        checklines(tablelines, false);
    }

    /*
     * check all lines for possible incomplete locutors or errors in transcription
     */
    function checklines(lgns, jq) {
        trjs.data.check = []; // empty array of line numbers
        trjs.data.checkCount = 0;
        trjs.data.checkAddMsg = function(line, err) {
            trjs.data.checkCount++;
            trjs.data.check.push({ n: line, message: err });
        }
        trjs.data.checkText = function(nth) {
            return 'line: ' + trjs.data.check[nth].n + ' ' + trjs.data.check[nth].message;
        }
        var text = []; // text values of utterances
        var sels = []; // pointers to DOM elements
        var n = []; // line numbers
        for (var i = 0; i < lgns.length; i++) {
            var sel = jq ? lgns[i] : $(lgns[i]);
            var loc = trjs.transcription.getCode(sel);
            var type = trjs.transcription.findCode(loc);
            if (loc === '---') {
                trjs.data.checkAddMsg(i+1, 'error on locutor');
            }
            if (checkOverlapNext(sel)) {
                trjs.data.checkAddMsg(i+1, 'overlap on same locutor');
                loc = setMark(loc);
                trjs.transcription.setCode(sel, loc);
            } else if (testMark(loc)) {
                loc = trimMark(loc);
                trjs.transcription.setCode(sel, loc);
            }
            if (loc === '-div-' && trjs.dataload.checkstring(trjs.events.lineGetCell(sel, trjs.data.TRCOL)) !== '') {
                trjs.data.checkAddMsg(i+1, 'end of div with comment (not allowed)');
            }
            if (type === 'loc' && trjs.param.format === 'CHAT') {
                cleanTranscription(sel);
                text.push(trjs.events.lineGetCell(sel, trjs.data.TRCOL));
                sels.push(sel);
                n.push(i+1);
            }
        }
        if (trjs.param.format === 'CHAT')
            checkTranscription(text, sels, n);
    }

    /*
     * check current line for possible incomplete locutors or errors in transcription
     */
    function checkCurrentLine(e, sel) {
        if (sel === undefined) sel = trjs.data.selectedLine;
        console.log(sel);
        checklines([sel], true);
    }

    /**
     * check a line for whichever method is set for the file (by defaut CHAT but can be other transcription systems)
     * @method checkTranscription
     */
    function checkTranscription(text, sels, n) {
        testChatlines(text, function(ck) {
            console.log("result", ck.value, ck.list);
            if (ck.value !== 'ok') {
                for (var el=0; el < ck.list.length; ) {
                    // process all element with the same line and then just to next one
                    var ln = ck.list[el].line;
                    var utt = sels[ln-1];
                    // change the speaker information
                    var loc = trjs.transcription.getCode(utt);
                    loc = setMark(loc);
                    trjs.transcription.setCode(utt, loc);
                    // indicate in the transcription where the error is.
                    // there can be several elements for this
                    var u = text[ln-1]; // initial string
                    var w = ''; // result string.
                    var p = 0; // pointer to next element to copy from u
                    // iterate through ct.list from the starting point 'el'
                    do {
                        var m = '<error data-toggle="tooltip" title="' + ck.list[el].message + '">'; // the first part of the message
                        trjs.data.checkAddMsg(n[ln-1], 'column: ' + ck.list[el].column + ' ' + ck.list[el].message);
                        if (ck.list[el].column >= u.length) {
                            // copy the rest of u
                            w += u.substring(p) + m + trjs.data.errorMarker + '</error>';
                            p = u.length; // at the end
                            // this should be the end unless there are more than one error message at the end
                        } else {
                            var gauche = u.substring(p, ck.list[el].column);
                            p = ck.list[el].column;
                            w += gauche + m + trjs.data.errorMarker + '</error>';
                        }
                        el ++;
                    } while(el < ck.list.length && ck.list[el].line === ln);
                    if (p < u.length) w += u.substring(p);
                    trjs.events.lineSetCellHtml(sels[ln-1], trjs.data.TRCOL, w);
                }
                trjs.param.setTooltip();
                $('#check-nb-results').text(trjs.data.checkCount);
                $('#check-nbx').text(trjs.data.checkCount);
                if (text.length < 2) {
                    if (trjs.data.checkCount >= 1) {
                        var s = '';
                        for (var e in trjs.data.check) {
                            s += trjs.data.check[e].message + '<br/>';
                        }
                        trjs.log.boxalert(s);
                    }
                } else {
                    if (trjs.data.checkCount >= 1) {
                        var s = '';
                        for (var e in trjs.data.check) {
                            s += trjs.data.checkText(e) + '<br/>';
                        }
                        trjs.log.boxalert(s);

                        trjs.data.checkPos = 0;
                        $('#check-posx').text(1);
                        trjs.events.goToLine(trjs.data.check[0].n);
                        $('#check-valx').text(trjs.data.checkText(0));
                        trjs.editor.showCheck(true);
                    } else {
                        trjs.log.boxalert(trjs.messgs.checknoerror);
                    }
                }
            } else {
                if (trjs.data.checkCount < 1) {
                    if (text.length < 2) {
                        trjs.log.alert(trjs.messgs.checkcorrectline);
                    } else {
                        trjs.log.boxalert(trjs.messgs.checknoerror);
                    }
                } else {
                    if (text.length < 3) {
                        var s = '';
                        for (var e in trjs.data.check) {
                            s += trjs.data.check[e].message + '<br/>';
                        }
                        s += trjs.data.checkCount + trjs.messgs.checkerr;
                        trjs.log.boxalert(s);
                    }
                }

            }
        });
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
        if (t.indexOf('<error') < 0) {
            // nothing to erase ?
            trjs.events.lineSetCell(sel, trjs.data.TRCOL, t);
            return;
        }
        t = cleanErrors(t);
        trjs.events.lineSetCell(sel, trjs.data.TRCOL, t);
    }

    /**
     * check all lines for possible incomplete locutors or overlaps
     * @method checkFinal
     */
    function checkFinal() {
        goCheck();
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
                trjs.events.goToLine(trjs.data.check[trjs.data.checkPos].n);
                $('#check-valx').text(trjs.data.checkText(trjs.data.checkPos));
            } else {
                $('#check-posx').text(1);
                trjs.events.goToLine(trjs.data.check[0].n);
                $('#check-valx').text(trjs.data.checkText(0));
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
                trjs.events.goToLine(trjs.data.check[trjs.data.checkPos].n );
                $('#check-valx').text(trjs.data.checkText(trjs.data.checkPos));
            } else {
                $('#check-posx').text(trjs.data.checkCount);
                trjs.events.goToLine(trjs.data.check[trjs.data.checkCount - 1].n);
                $('#check-valx').text(trjs.data.checkText(trjs.data.checkCount - 1));
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
        trimMark: trimMark,
    };
})();
