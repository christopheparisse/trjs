/**
 * transcription.js
 *
 * <p>Handling all global variables and methods used to store the data read from a xml string
 * and to put them back into a string before exporting</p>
 * Date: july 2013
 * @module Transcription
 * @author Christophe Parisse
 */

'use strict';

trjs.transcription = (function () {

    /*
     * allows to know when everything is set and ready.
     */
    var initialLoadFlag = false;

    /**
     * load a XMT TEI transcription into memory
     */

    /**
     * format an integer into 2-digit values
     * @method intFormat2
     * @param {integer} value
     * @return {string} formatted value
     */
    function intFormat2(v) {
        if (v < 10)
            return "0" + v;
        else
            return v;
    }

    /**
     * format the presentation of time in the transcript
     * @method formatTime
     * @param {float} time in seconds
     * @return {string} time as string
     */
    function formatTime(t) {
        if (t === undefined || t === null || t === '') return '';
        var newval = parseFloat(t) - Math.floor(parseFloat(t));
        if (isNaN(newval)) return '';

        var d = new Date(t * 1000);
        var h = d.getUTCHours();
        var r;
        if (trjs.param.formatTime === 'hms') {
            if (h > 0)
                r = h + 'h' + d.getUTCMinutes() + "m" + d.getSeconds() + "s";
            else
                r = d.getUTCMinutes() + "m" + d.getSeconds() + "s";
        } else if (trjs.param.formatTime === '00:00') {
            r = intFormat2(h * 60 + d.getUTCMinutes()) + ':' + intFormat2(d.getSeconds());
        } else if (trjs.param.formatTime === '?:00:00') {
            if (h > 0)
                r = h + ':' + intFormat2(d.getUTCMinutes()) + ':' + intFormat2(d.getSeconds());
            else
                r = intFormat2(d.getUTCMinutes()) + ':' + intFormat2(d.getSeconds());
        } else { // 0:00:00
            if (h > 0)
                r = h + ':' + intFormat2(d.getUTCMinutes()) + ':' + intFormat2(d.getSeconds());
            else
                r = h + ':' + intFormat2(d.getUTCMinutes()) + ':' + intFormat2(d.getSeconds());
        }

        var ms = '';
        if (newval === 0.0)
            ms = '0.000';
        else
            ms = newval.toString();
        if (trjs.param.nbdigits === 0)
            return r;
        if (trjs.param.nbdigits === 3)
            ms = ms.substring(2, 5);
        else if (trjs.param.nbdigits === 2)
            ms = ms.substring(2, 4);
        else if (trjs.param.nbdigits === 1)
            ms = ms.substring(2, 3);
        if (trjs.param.formatTime === 'hms')
            return r + ms;
        else
            return r + '.' + ms;
    }

    /**
     * return text content with problematic < and >
     * @method transcriptEncoding
     * @param string
     * @return string
     */
    function transcriptEncoding(s, style) {
        var reLeft = new RegExp(trjs.data.leftBracket, "g");
        var reRight = new RegExp(trjs.data.rightBracket, "g");
        s = s.replace(reLeft, '<'); // 60 3C
        s = s.replace(reRight, '>'); // 62 3E
        return s;
    }

    /**
     * convert text to XML format
     * @method xmlEntitiesEncode
     * @param plain text
     * @return xml coded text
     */
    function xmlEntitiesEncode(texte) {
        texte = texte.replace(/\<br.*?\/\s?br\>/g, '\n'); // 10
        texte = texte.replace(/\<br\s*\/?\>/g, '\n'); // 10
        texte = texte.replace(/"/g, '&quot;'); // 34 22
        texte = texte.replace(/&/g, '&amp;'); // 38 26
        texte = texte.replace(/\'/g, '&#39;'); // 39 27
        texte = texte.replace(/\</g, '&lt;'); // 60 3C
        texte = texte.replace(/\>/g, '&gt;'); // 62 3E
        //texte = texte.replace(/\^/g,'&circ;'); // 94 5E
        return texte;
    }

    /**
     * create a line that will make it possible to edit two field (used for div fields)
     * @method createDivEditField
     * @param default value of first field
     * @param default value of second field
     */
    function createDivEditField(ty, st) {
        return '<table><tr><td class="divtxt ttype">' + ty + '</td><td class="divtxt tsubtype">' + st + '</td></tr></table>';
    }

    /**
     * create a line that will make it possible to edit two field (used for note fields)
     * @method createNoteEditField
     * @param default value of first field
     * @param default value of second field
     */
    function createNoteEditField(ty, st) {
        return '<table><tr><td class="notetxt ttype">' + ty + '</td><td class="notetxt tsubtype">' + st + '</td></tr></table>';
    }

    /**
     * return the type of a TR line of the transcription table
     * @method typeTier
     * @param jquery-object line of TR
     * @return {string} 'div' or 'loc' or 'prop' but not main which is used to differentiate the main table from sub tables.
     */
    function typeTier(line) {
        var k = line;
        var t = k.attr('class');
        if (t) t = t.split(' ');
        for (k in t) if (t[k] !== 'main') return t[k];
        return '';
    }

    /**
     * return the code of a TR line of the transcription table
     * @method codeTier
     * @param {jquery-object} line of TR
     * @return {string} tag for the code
     */
    function codeTier(line) {
        return line.attr('code');
    }

    /**
     * return the line number of a TR line of the transcription table
     * @method lineTier
     * @param jquery-object line of TR
     * @return {int} line number
     */
    function lineTier(line) {
        return $('.num', line[0]).text();
    }

    /**
     * variable to keep values between intervals.
     * @property trjsTable
     */
    var trjsTable = null;

    /**
     * second step of loading the information
     * main transcription
     * -- processing is divided into slices using the interval feature
     * @method loadIntoGrid2
     * @param current slice for the interval
     * @return next slice for the interval processing
     */
    function loadIntoGrid2(nth) {
        // nth va de 5% à 95%
        // lecture de la transcription
        // get container ready

        function lDIG1() {
            // console.log(trjs.data.version);
            if (trjs.data.version < '0.4') {
                // old version not used any more
                // throw("wrong version of teiml format");
                trjs.log.alert('wrong version of teiml format');
                loadNewGrid();
                updateCSS();
                return;
            }

            if (trjs.data.version <= '0.6')
                trjsTable = trjs.dataload05.loadTEI05(trjs.data.doc);
            else
                trjsTable = trjs.dataload.loadTEI(trjs.data.doc);
            if (!trjsTable) {
                newTable();
                updateCSS();
                return;
            }
        }

        if (nth === 10) {
            lDIG1();
            return 50;
        }
        if (nth === 50) {
            initTable(trjsTable);
            return 95;
        }
        trjs.log.alert('ERROR: error on nth', 2008);
    }

    /**
     * formats a line of the main transcription table according to a scheme (partly defined by the user)
     * it is based dynamically upon the information of the speaker names and the sub-tier names
     * @method trUpdateCSS
     * @param {jquery-object} line to be formatted
     */
    function trUpdateCSS(line, loc) {
        /*
         * adjust the place of the tier names, cells and participants
         */
        //console.log(line);
        //console.log(line.attr('class'));
        //console.log(trjs.events.lineGetCell(line, trjs.events.firstLoc));
        if (line.attr('class').indexOf('prop') !== -1) {
            if (!loc) loc = trjs.events.lineGetCell(line, trjs.data.CODECOL);
            var level = trjs.data.imbrication[loc];
            if (level)
                var px = (trjs.param.decalagePxProp + 10 * (level - 1)) + 'px';
            else
                var px = trjs.param.decalagePxProp + 'px';
            line.find('.prop').css('padding-left', px);
//		line.find('.prop').css('padding-left', '20px');
            /*
             * change the color of the associated tiers if linked to a main tier with color
             */
            var prev = line.prev();
            while (prev != null && prev.length > 0) {
                if (typeTier(prev) === 'loc') {
                    if (codeTier(prev) === 'CHI') {
                        line.css('background-color', '#EEE').attr('backcolor', '#EEE');
                    }
                    break;
                }
                prev = prev.prev();
            }
        } else if (line.attr('class').indexOf('loc') !== -1) {
            line.find('.loc').css('padding-left', '0px');
            line.css('border-top', '1px solid lightgrey');
            if (codeTier(line) === 'CHI')
                line.css('border-top', '1px solid lightgray').css('background-color', '#DDD').attr('backcolor', '#DDD');
        } else if (line.attr('class').indexOf('div') !== -1) {
            line.find('.div').css('padding-left', '0px');
            line.css('color', 'brown');
        }
        /*
         * show or not the lines
         */
        if (trjs.param.number == true)
            line.find('.num').show();
        else
            line.find('.num').hide();
        if (trjs.data.multipleSelect === true) {
            line.find('td.info').show();
        }
    }

    /**
     * set multiple selection input
     * @method setMultipleSelection
     */
    function setMultipleSelection() {
        if (trjs.data.multipleSelect === true) {
            trjs.data.multipleSelect = false;
            $('table td.info').hide();
//		$('table td.info').css('display','none');
        }
        else {
            trjs.data.multipleSelect = true;
            $('table td.info').show();
//		$('table td.info').css('display','block');
        }
    }

    function copyMultipleSelection() {
        trjs.data.copyMS = [];
        trjs.data.copyMSLines = [];
        var tablelines = trjs.transcription.tablelines();
        // console.log(d + ' ' + f + ' ' + v);
        for (var i = 0; i < tablelines.length; i++) {
            var td = $(tablelines[i]).find('td.info');
            if (td[0].data_select === true) {
                trjs.data.copyMS.push(i + 1);
                trjs.data.copyMSLines.push(trjs.events.copyLine($(tablelines[i])));
            }
        }
    }

    function cutMultipleSelection() {
        copyMultipleSelection();
        var tablelines = trjs.transcription.tablelines();
        for (var i = tablelines.length - 1; i >= 0; i--) {
            var td = $(tablelines[i]).find('td.info');
            if (td[0].data_select === true) {
                trjs.events.deleteLine(null, $(tablelines[i]));
            }
        }
    }

    function pasteMultipleSelection() {
        var sel = trjs.data.selectedLine;
        trjs.events.insertLineLoc(sel, trjs.data.copyMSLines);
        $('table td.info').show();
    }

    /**
     * save current file on the downloading area
     * @method exportMStoTei
     */
    function exportMStoTei() {
        var s = trjs.transcription.saveTranscriptToString(true);
        // var dump = $('#dump1').text(s);
        var blob = new Blob([s], {type: "text/plain;charset=utf-8"}); // {type: 'text/css'});
        saveAs(blob, 'export' + version.FULL_EXT);
    }

    /**
     * save current file on the downloading area
     * @method localSave
     */
    function exportMStoCsv() {
        var s = saveTranscriptToCsvString(true);
        // var dump = $('#dump1').text(s);
        var blob = new Blob([s], {type: "text/plain;charset=utf-8"}); // {type: 'text/css'});
        saveAs(blob, 'export.csv');
    }

    function selectRange(d, f, v) {
        if (d > f) {
            var x = f;
            f = d;
            d = x;
        }
        var tablelines = trjs.transcription.tablelines();
        // console.log(d + ' ' + f + ' ' + v);
        for (var i = d; i <= f; i++) {
            var td = $(tablelines[i - 1]).find('td.info');
//		console.log($(tablelines[i-1]));
//		console.log(td);
//		console.log(i + ' ' + td.length);
            if (v) {
                td[0].data_select = true;
                $(td[0]).html('<i class="fa fa-check-square-o" onclick="trjs.transcription.clickMS(event, ' + i + ');"></i>');
            } else {
                td[0].data_select = false;
                $(td[0]).html('<i class="fa fa-square-o" onclick="trjs.transcription.clickMS(event, ' + i + ');"></i>');
            }
        }
    }

    function selectAllMS(e) {
        var tablelines = trjs.transcription.tablelines();
        var td = $(tablelines[0]).find('td.info');
        trjs.data.selectedPart = 'all';
        trjs.data.lastSelected = 0;
        for (var i = 0; i < tablelines.length; i++) {
            var td = $(tablelines[i]).find('td.info');
            var l = i + 1;
            td[0].data_select = true;
            $(td[0]).html('<i class="fa fa-check-square-o" onclick="trjs.transcription.clickMS(event, ' + l + ');"></i>');
        }
    }

    function deselectAllMS(e) {
        var tablelines = trjs.transcription.tablelines();
        var td = $(tablelines[0]).find('td.info');
        trjs.data.selectedPart = false;
        trjs.data.lastSelected = -1;
        for (var i = 0; i < tablelines.length; i++) {
            var td = $(tablelines[i]).find('td.info');
            var l = i + 1;
            td[0].data_select = false;
            $(td[0]).html('<i class="fa fa-square-o" onclick="trjs.transcription.clickMS(event, ' + l + ');"></i>');
        }
    }

    function clickMS(e, l) {
//	console.log("clickMS " + l + ' ' + e.shiftKey);
//	console.log(e);
        var p = $(e.target).parent();
//	console.log(p);
        if (p[0].data_select === true) {
            p[0].data_select = false;
            if (e.shiftKey === true && trjs.data.lastSelected !== -1)
                selectRange(trjs.data.lastSelected, l, false);
            else
                p.html('<i class="fa fa-square-o" onclick="trjs.transcription.clickMS(event, ' + l + ');"></i>');
        }
        else {
            p[0].data_select = true;
            if (e.shiftKey === true && trjs.data.lastSelected !== -1)
                selectRange(trjs.data.lastSelected, l, true);
            else
                p.html('<i class="fa fa-check-square-o" onclick="trjs.transcription.clickMS(event, ' + l + ');"></i>');
        }
        trjs.data.lastSelected = l;
        trjs.data.selectedPart = true;
    }

    /**
     * compute the color scheme for the main transcription table (could be partly defined by the user)
     * it is based dynamically upon the information of the number of utterances for each participants
     * @method updateCSS0
     */
    function updateCSS0() {	//
        var nb = trjs.dmz.nbSortLoc();
        trjs.transcription.loc1 = '';
        trjs.transcription.loc2 = '';
        trjs.transcription.loc3 = '';
        if (nb < 1) return;
        trjs.transcription.loc1 = trjs.dmz.sortLoc(0);
        if (nb < 2) return;
        trjs.transcription.loc2 = trjs.dmz.sortLoc(1);
        if (nb < 3) return;
        trjs.transcription.loc3 = trjs.dmz.sortLoc(2);
    }

    /**
     * formats the main transcription table according to a scheme (partly defined by the user)
     * it is based dynamically upon the information of the speaker names and the sub-tier names
     * ::- adjust the place of the tier names
     * @method updateCSS1
     */
    function updateCSS1() {	//
        if (trjs.data.imbrication) {
            var lns = $('td.prop');
            for (var i = 0; i < lns.length; i++) {
                var t = $(lns[i]).text();
                var level = trjs.data.imbrication[t];
                if (level)
                    var px = (trjs.param.decalagePxProp + 10 * (level - 1)) + 'px';
                else
                    var px = trjs.param.decalagePxProp + 'px';
                $(lns[i]).css('padding-left', px);
            }
        }

        /*
         * do something about all the cells of the participants
         */
        $('tr.loc').css('border-top', '1px solid lightgrey');
        $('tr.main.div').css('color', 'brown');
        /*
         * show or not the lines
         */
        if (trjs.param.number === true) {
            $('td.num').show();
            $('th.num').show();
        } else {
            $('td.num').hide();
            $('th.num').hide();
        }
        /*
         * show or not the llink time
         */
        if (trjs.param.showLinkTime === true) {
            $('td.vts').show();
            $('th.vts').show();
            $('td.vte').show();
            $('th.vte').show();
        } else {
            $('td.vts').hide();
            $('th.vts').hide();
            $('td.vte').hide();
            $('th.vte').hide();
        }

        if (trjs.data.multipleSelect === true) {
            $('td.info').show();
        }
    }

    /**
     * formats the main transcription table according to a scheme (partly defined by the user)
     * it is based dynamically upon the information of the speaker names and the sub-tier names
     * ::- change the color of the locutor CHI and all the assotiated tiers
     * @method updateCSS2
     */
    function updateCSS2() {	//
        $('tr.main.loc').each(function (index, elem) {
            if (codeTier($(elem)) === trjs.transcription.loc1) {
                $(elem).css('border-top', '1px solid lightgray').css('background-color', '#DDD').attr('backcolor', '#DDD');
                var next = $(elem).next();
                while (next != null && next.length > 0) {
                    // if (next[0].className.indexOf('prop') == -1) break;
                    if (typeTier(next) === 'loc') break;
                    next.css('background-color', '#EEE').attr('backcolor', '#EEE');
                    next = next.next();
                }
            }
            if (codeTier($(elem)) === trjs.transcription.loc3) {
                $(elem).css('border-top', '1px solid lightgray').css('background-color', '#BBC').attr('backcolor', '#CCD');
                var next = $(elem).next();
                while (next != null && next.length > 0) {
                    // if (next[0].className.indexOf('prop') == -1) break;
                    if (typeTier(next) === 'loc') break;
                    next.css('background-color', '#DDE').attr('backcolor', '#DDE');
                    next = next.next();
                }
            }
        });
    }

    /**
     * formats the main transcription table according to a scheme (partly defined by the user)
     * groups together the two parts updateCSS1 & 2 (they are divided some that it is possible to use better asynchronous loading)
     * @method updateCSS
     */
    function updateCSS() {
        updateCSS0();
        updateCSS1();
        updateCSS2();
    }

    /**
     * reformats the time information in second and third columns
     * @method updateTimecode
     */
    function updateTimecode() {
        var tablelines = trjs.transcription.tablelines();
        for (var i = 0; i < tablelines.length; i++) {
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            if (its !== '') trjs.events.lineSetCell($(tablelines[i]), trjs.data.VTSCOL, formatTime(its));
            if (ite !== '') trjs.events.lineSetCell($(tablelines[i]), trjs.data.VTECOL, formatTime(ite));
        }
    }

    /**
     * rewrite the name of the locutors as code or name
     * @method updateLocNames
     */
    function updateLocNames() {
        var tablelines = trjs.transcription.tablelines();
        for (var i = 0; i < tablelines.length; i++) {
            if (typeTier($(tablelines[i])) !== 'loc') continue;
            var marked = false;
            var locval = trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL);
            if (trjs.events.testMark(locval)) {
                marked = true;
                locval = trjs.events.trimMark(locval);
            }
            if (trjs.param.locnames === true)
                locval = trjs.template.codeToName(locval);
            else
                locval = trjs.template.nameToCode(locval);
            trjs.events.lineSetCell($(tablelines[i]), trjs.data.CODECOL, (marked === true) ? trjs.events.setMark(locval) : locval);
        }
    }


    /**
     * third step of loading the information
     * metadata and persons information
     * @method loadIntoGrid3
     */
    function loadIntoGrid3() {
        // chargement à partir des valeurs stokées dans trjs.data.
        trjs.template.loadPersons();
        trjs.template.loadTemplates();
        trjs.template.loadMetadata();
    }

    /**
     * load data from a file into a grid
     * -- processing is divided into slices using the interval feature
     * @method loadIntoGrid
     * @param {string} xmlString text string containing xml information (content of the file)
     * @return none - data ready in the DOM and trjs.data.
     */
    function loadIntoGrid(loadMediaAfter) {
        // console.time('loadteiml');
        freeGrid();

        $("#transcript-name").text('0%');
        var processed = 0;
//	trjs.log.resetLog();

        if (!trjs.data.doc) {
            trjs.log.boxalert("cannot load xml file: probably bad or wrong file", 2009);
            loadNewGrid(false);
            return;
        }
        //try {
            trjs.template.readMediaInfo(trjs.data.doc); // initialize trjs.data according to info in document
            if (trjs.data.mediaLoc() === '.') {
                trjs.data.setMediaLoc(trjs.data.recordingLoc());
            } else if (trjs.data.mediaLoc() === '') {
                if (trjs.data.mediaRelLoc() === '' || trjs.data.mediaRelLoc() === '.') {
                    trjs.data.setMediaLoc(trjs.data.recordingLoc());
                }
            }
            if (loadMediaAfter === true)
                trjs.io.serverLoadMediaRecording();

            $("#transcript-name").text('5%');

            var processor = setInterval(function () {
                if (processed < 10) {
                    trjs.template.readTemplates(trjs.data.doc);
                    trjs.template.readMetadata(trjs.data.doc);
                    trjs.template.readPersons(trjs.data.doc);
                    processed = 10;
                    $("#transcript-name").text('10%');
                    return;
                }
                if (processed >= 10 && processed < 95) {
                    processed = loadIntoGrid2(processed);
                    $("#transcript-name").text(processed + '%');
                    return;
                }
                if (processed === 95) {
                    loadIntoGrid3();
                    processed = 96;
                    return;
                }
                if (processed === 96) {
                    trjs.dmz.freeLoc();	// count and sort the locutors
                    trjs.dmz.countLoc();	// count and sort the locutors
                    updateCSS0(); // compute the colors of the locutors
                    processed = 97;
                    return;
                }
                if (processed === 97) {
                    updateCSS1();
                    processed = 98;
                    return;
                }
                if (processed === 98) {
                    updateCSS2();
                    processed = 99;
                    return;
                }
                if (processed === 99) {
                    processed = 100;
                    clearInterval(processor);
                    trjs.data.setNamesInWindow();
                    trjs.data.setNamesInEdit();
                    trjs.editor.resizeTranscript();
                    trjs.messgs_init();
                    trjs.param.changed = false;
                    trjs.local.put('saved', 'yes');
                    if (trjs.param.features.partition() === true)
                        trjs.dmz.init('partition');
                    var l = trjs.events.firstLoc();
                    if (l) trjs.events.setSelectedLine(l);
//				trjs.log.resultLog();
                    initialLoadFlag = true;
                    if (trjs.param.goLine !== null)
                        trjs.events.goToLine(trjs.param.goLine);
                    if (trjs.param.goTime !== null)
                        trjs.events.goToTime('partition', trjs.param.goTime, true);
                    else if (trjs.param.mediaTime !== 0)
                        trjs.events.goToTime('partition', trjs.param.mediaTime, true);
                    if (trjs.param.goPlay === true) {
                        var sel = undefined;
                        if (trjs.param.goTime === null) {
                            sel = trjs.events.findLineToStart();
                            if (!sel)
                                sel = trjs.events.findLineToFollow();
                        }
                        trjs.events.goContinuous(undefined, sel); // TODO : wait for loading the video or audio
                    }
                    if ($('#check-bench').is(':visible'))
                        trjs.events.goCheck();
                    if (trjs.param.mode === 'readonly')
                        trjs.param.synchro.block(true);
                    // console.timeEnd('loadteiml');
                    return;
                }
            }, 100);
        //} catch (e) {
        //    trjs.log.boxalert(trjs.messgs.errorloading + ' - ' + e.name + ' - ' + e.message + ' - ' + e.lineNumber);
        //}
    }

    function loadCsvIntoGrid(data, name) {
        freeGrid();
        trjs.data.setRecordingName(name); // sets new file name
        trjs.data.setMediaName(null); // sets new file name
        trjs.data.initMedia();
        trjs.io.initEmptyMedia();
        // get XML ready
        trjs.data.doc = null;
        /*
         * Initialisation des éléments du template au format de stockage définitif.
         */
        trjs.data.tiersxml = new Array(2);
        trjs.data.tiersxml[0] = new trjs.template.TemplateInfo();
        trjs.data.tiersxml[0]['code'] = 'ortho';
        trjs.data.tiersxml[0]['type'] = 'Symbolic Association';
        trjs.data.tiersxml[0]['parent'] = '-';
        trjs.data.tiersxml[0]['description'] = 'Orthographic line';
        trjs.data.tiersxml[1] = new trjs.template.TemplateInfo();
        trjs.data.tiersxml[1]['code'] = 'phono';
        trjs.data.tiersxml[1]['type'] = 'Symbolic Association';
        trjs.data.tiersxml[1]['parent'] = '-';
        trjs.data.tiersxml[1]['description'] = 'Phonetic line';

        /*
         * lecture des notes et des métadonnées
         */
        trjs.data.metadata = null;
        trjs.data.note = null;
        trjs.data.tiersdata = {};
        trjs.data.codesdata = {};

        // initialisation de la transcription
        // get container ready
        trjsTable = [
            {loc: "", ts: "", te: "", tx: "", type: ""}
        ];
        var locs = {};
        for (var l in data) {
            locs[data[l][0]]++;
            var ts = data[l][1];
            var te = data[l][2];
            ts = parseFloat(ts);
            if (isNaN(ts)) ts = '';
            te = parseFloat(te);
            if (isNaN(te)) te = '';
            trjsTable.push({loc: data[l][0], ts: ts, te: te, tx: data[l][3], type: 'loc'});
        }

        trjs.data.persons = [];
        for (var l in locs) {
            var p = new trjs.template.Person();
            p.code = l;
            p.name = l;
            p.role = 'participant';
            trjs.data.persons.push(p);
        }
        trjs.data.textDesc = null;

        trjs.template.loadPersons();
        trjs.template.loadTemplates();
        trjs.template.loadMetadata();

        initTable(trjsTable);

        trjs.dmz.countLoc();	// count and sort the locutors
        updateCSS(); // compute the colors of the locutors
        // chargement à partir des valeurs stokées dans trjs.data.
        // load the headers (with the exception of template already read)
        trjs.data.title = trjs.messgs.newfile;
        trjs.data.setNamesInEdit();
        trjs.data.setRecordingTitle('CSV import');
        // trjs.data.transName = trjs.data.recordingName();
        trjs.data.setRecordingLang('fra');
        trjs.data.setNamesInWindow();
        trjs.data.setNamesInEdit();
        trjs.messgs_init();
        trjs.dmz.init('partition');
        trjs.dmz.sliderPopulate();
        trjs.io.innerSave();
    }

    function convertFromTxtToCsv(data, sepdelimiter, sepcolumn, seplocutor) {
        if (!sepdelimiter) sepdelimiter = '\"';
        if (!sepcolumn) sepcolumn = '\t';
        if (!seplocutor) seplocutor = '\\s';
        var s = $.csv.toArrays(data, {separator: sepcolumn, delimiter: sepdelimiter});
        var t = [];
        var re = new RegExp("(.*?)" + seplocutor + "(.*)");
        for (var i in s) {
            if (s[i].length > 1) {
                t.push([s[i][0], '', '', s[i].slice(1).join(' ')]);
            } else if (s[i].length === 1) {
                var nh = re.exec(s[i][0]);
                if (nh) {
                    if (nh[1] === '')
                        t.push(['---', '', '', nh[2]]);
                    else
                        t.push([nh[1], '', '', nh[2]]);
                } else {
                    t.push(['---', '', '', s[i][0]]);
                }
            }
        }
        return t;
    }

    function readCsv(data, sepdelimiter, sepcolumn) {
        if (!sepdelimiter) sepdelimiter = '\"';
        if (!sepcolumn) sepcolumn = '\t';
        var s = $.csv.toArrays(data, {separator: sepcolumn, delimiter: sepdelimiter});
        // 'file\tline\tmedia\tstart\tend\tloc\tdata\n';
        if (s.length < 1) return [];
        var t = [];
        for (var i in s) {
            t.push([s[i][5], s[i][3], s[i][4], s[i].slice(6).join(' ')]);
        }
        return t;
    }

    /**
     * creates a XMT TEI transcription into memory
     * creates a new empty grid
     * @method loadNewGrid
     */
    function loadNewGrid(askformedia) {
        trjs.editor.testNotSave(function (yesno) {
            if (yesno === true) {  // the user does not want to save the modified file or the file is not modified since last save
                freeGrid();
                trjs.data.setRecordingName(''); // sets new file name
                trjs.data.setMediaName(''); // sets new file name
                trjs.data.initMedia();
                trjs.io.initEmptyMedia();
                // get XML ready
                trjs.data.doc = null;
                /*
                 * Initialisation des éléments du template au format de stockage définitif.
                 */
                trjs.data.codesxml = new Array(1);
                trjs.data.codesxml[0] = new trjs.template.TemplateInfo();
                trjs.data.codesxml[0]['code'] = 'LOC';
                trjs.data.codesxml[0]['type'] = 'ortho';
                trjs.data.codesxml[0]['name'] = 'locutor';
                trjs.data.codesxml[0]['description'] = '';
                trjs.data.tiersxml = new Array(2);
                trjs.data.tiersxml[0] = new trjs.template.TemplateInfo();
                trjs.data.tiersxml[0]['code'] = 'ortho';
                trjs.data.tiersxml[0]['type'] = 'Symbolic Association';
                trjs.data.tiersxml[0]['parent'] = '-';
                trjs.data.tiersxml[0]['description'] = 'Orthographic line';
                trjs.data.tiersxml[1] = new trjs.template.TemplateInfo();
                trjs.data.tiersxml[1]['code'] = 'phono';
                trjs.data.tiersxml[1]['type'] = 'Symbolic Association';
                trjs.data.tiersxml[1]['parent'] = '-';
                trjs.data.tiersxml[1]['description'] = 'Phonetic line';

                trjs.data.persons = new Array(1);
                trjs.data.persons[0] = new trjs.template.Person();
                trjs.data.persons[0]['name'] = 'locutor';
                trjs.data.persons[0]['role'] = 'Target_Adult';
                trjs.data.textDesc = null;
                /*
                 * lecture des notes et des métadonnées
                 */
                trjs.data.metadata = null;
                trjs.data.note = null;
                trjs.data.tiersdata = {};
                trjs.data.codesdata = {};
                trjs.data.codesnames = {};
                trjs.data.persons = null;

                // initialisation de la transcription
                // get container ready
                newTable();

                trjs.dmz.countLoc();	// count and sort the locutors
                updateCSS(); // compute the colors of the locutors
                // chargement à partir des valeurs stokées dans trjs.data.
                trjs.template.loadPersons();
                trjs.template.loadTemplates();
                trjs.template.loadMetadata();
                // load the headers (with the exception of template already read)
                trjs.data.title = trjs.messgs.newfile;
                trjs.data.setNamesInEdit();
                trjs.data.setRecordingTitle('new');
                // trjs.data.transName = trjs.data.recordingName();
                trjs.data.setRecordingLang('fra');
                trjs.data.setNamesInWindow();
                trjs.data.setNamesInEdit();
                trjs.messgs_init();
                trjs.dmz.init('partition');
                trjs.dmz.sliderPopulate();
                trjs.io.innerSave();
                trjs.aidecontextuelle('new-trs', false);
                trjs.param.changed = false;
                if (askformedia === true) {
                    //$('#openfile').modal();
                    fsio.chooseFile('media', 'media');
                }
            }
        });
    }

    function freeGrid() {
        trjs.data.initRec();
        if (trjs.data.textDesc != null) delete trjs.data.textDesc;
        if (trjs.data.metadata != null) delete trjs.data.metadata;
        if (trjs.data.note != null) delete trjs.data.note;
        if (trjs.data.tiersxml != null) delete trjs.data.tiersxml;
        if (trjs.data.codesxml != null) delete trjs.data.codesxml;
        if (trjs.data.tiersdata) delete trjs.data.tiersdata;
        if (trjs.data.codesdata) delete trjs.data.codesdata;
        if (trjs.data.codesnames) delete trjs.data.codesnames;
        if (trjs.data.persons != null) delete trjs.data.persons;
        if (trjs.data.search != null) delete trjs.data.search;
        trjs.data.textDesc = null;
        trjs.data.metadata = null;
        trjs.data.note = null;
        trjs.data.tiersxml = [];
        trjs.data.tiersdata = {};
        trjs.data.codesxml = [];
        trjs.data.codesdata = {};
        trjs.data.codesnames = {};
        trjs.data.persons = null;
        trjs.data.search = null;

        /*
         * clean wave, partition and media
         */
        trjs.dmz.clear();
    }

    /**
     * save an XML TEI transcrition from memory
     */

    /**
     * test if string neither null nor empty
     * @method isnotbl
     * @param string
     * @return boolean yes or no
     */
    function isnotbl(s) {
        if (s != null && s != '') return true;
        return false;
    }

    /**
     * Find whether a row of transcription is empty (four last elements tested)
     * @method isEmptyRow
     * @param pointer to a jQuery tr DOM element
     * @return true or false
     */
    function isEmptyRow(row) {
        if (isnotbl(trjs.events.lineGetCell(row, trjs.data.CODECOL))) return false;
        if (isnotbl(trjs.events.lineGetCell(row, trjs.data.TSCOL))) return false;
        if (isnotbl(trjs.events.lineGetCell(row, trjs.data.TECOL))) return false;
        if (isnotbl(trjs.events.lineGetCell(row, trjs.data.TRCOL))) return false;
        return true;
    }

    /**
     * find the id corresponding to a div
     * @method findIdOf
     * @param {string} content of div description
     */
    function findIdOf(d) {
        for (var i = 0; i < trjs.data.textDesc.length; i++) {
            //console.log(d);
            //console.log(trjs.data.textDesc[i]);
            //console.log(trjs.data.textDesc[i]['text']);
            if (d === trjs.data.textDesc[i]['text'])
                return trjs.data.textDesc[i]['xml_id'];
        }
        return 'dx';
    }

    /**
     * transforms a transcripted line into XML codes: to be improved later
     * @method xmlTranscription
     * @param string (chaine à transformer en xml)
     * @return string (chaine xml encodée)
     */
    function xmlTranscription(s) {
        s = xmlEntitiesEncode(s);
        // s = '<seg>' + s + '</seg>';
        return s;
    }

    /**
     * save data contained in the editing tables into a string
     * last version of TEIML
     * @method saveTranscriptToString
     * @return string with the data
     */
    function saveTranscriptToString(partof) {
        var s = '';
        s += '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
        s += '<!DOCTYPE TEI SYSTEM "http://ct3.ortolang.fr/tei-corpo/tei_corpo.dtd">\n';
        s += '<TEI version="0.9" subversion="trjs" xmlns="http://www.tei-c.org/ns/1.0"';
        if (trjs.data.recordingLang())
            s += ' xml:lang="' + trjs.data.recordingLang() + '"';
        s += '>\n';

        s += trjs.template.saveTEIHeaderToString();

        /*
         * saving the text part of the file
         */
        s += '<text>\n';
        var localID = 0;
        var openedAU = false;	// an annotationBlock is opened
        var tablelines = trjs.transcription.tablelines();
        var id = 0;
        var timeline = {'0': 'T0'};
        for (var i = 0; i < tablelines.length; i++) {
            if (partof === true && type !== 'div') {
                var td = $(tablelines[i]).find('td.info');
                if (td[0].data_select !== true) continue;
            }
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            if (its !== '') {
                if (timeline[its] === undefined) {
                    id++;
                    timeline[its] = 'T' + id;
                }
            }
            if (ite !== '') {
                if (timeline[ite] === undefined) {
                    id++;
                    timeline[ite] = 'T' + id;
                }
            }
        }
        /*
         * sort timeline if necessary
         */
        var timelineSorted = Object.keys(timeline).sort(function (a, b) {
            if (a === b) return 0;
            var na = Number(a);
            var nb = Number(b);
            if (isNaN(na) || isNaN(nb)) return (a < b) ? -1 : (a > b) ? 1 : 0;
            return (na < nb) ? -1 : (na > nb) ? 1 : 0;
        });
        s += '<timeline unit="s">\n';
        s += '<when absolute="0" xml:id="T0"/>\n';
        for (var i in timelineSorted) {
            if (i === '0') continue;
            s += '<when interval="' + timelineSorted[i] + '" since="#T0" xml:id="' + timeline[timelineSorted[i]] + '"/>\n';
        }
        s += '</timeline>\n';
        s += '<body>\n';
        var level = 1;
        var prevLoc = [];
        for (var i = 0; i < tablelines.length; i++) {
            if (partof === true && type !== 'div') {
                var td = $(tablelines[i]).find('td.info');
                if (td[0].data_select !== true) continue;
            }
            var type = typeTier($(tablelines[i]));
            var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            var itrans = trjs.dataload.checkstring(trjs.events.lineGetCellHtml($(tablelines[i]), trjs.data.TRCOL));
            if (!iloc === '' && its === '' && ite === '' && itrans === '') continue;
            if (trjs.events.testMark(iloc))
                iloc = trjs.events.trimMark(iloc);
            if (trjs.param.locnames === true) {
                if (type === 'loc') {
                    var ll = trjs.template.nameToCode(iloc);
                    if (ll) iloc = ll;
                }
            }
            if (its !== '' && parseFloat(its) < trjs.data.maxLinkingTime) trjs.data.maxLinkingTime = parseFloat(its);
            if (ite !== '' && parseFloat(ite) < trjs.data.maxLinkingTime) trjs.data.maxLinkingTime = parseFloat(ite);
//		var code = codeTier( $(tablelines[i]) );
//		code = trjs.events.trimMark(code);

            if (type === 'div') {
                while (level > 1) {
                    level--;
                    s += '</span>\n';
                    s += '</spanGrp>\n';
                }
                if (openedAU) {
                    s += '</annotationBlock>\n';
                    openedAU = false;
                }
                if (iloc === '+div+') {
                    s += '<div ';
                    if (itrans !== '' && itrans != null) {
                        var divtext = trjs.template.splitDoubleText(itrans);
                        if (divtext.type !== '')
                            s += 'type="' + xmlEntitiesEncode(divtext.type) + '" ';
                        if (divtext.subtype !== '')
                            s += 'subtype="' + findIdOf(xmlEntitiesEncode(divtext.subtype)) + '" ';
                    }
                    s += '>\n';
                    if (its !== '' || ite !== '') {
                        s += '<head>\n';
                        if (its !== '') s += '<note type="start">#' + timeline[its] + '</note>\n';
                        if (ite !== '') s += '<note type="start">#' + timeline[ite] + '</note>\n';
                        s += '</head>\n';
                    }
                } else {
                    itrans = xmlEntitiesEncode(itrans);
                    if (itrans !== '' && itrans != null) {
                        s += '<incident type="comment"><desc>{' + itrans + '}</desc></incident>\n';
                        // console.log('{' + itrans + '}');
                    }
                    s += '</div>\n';
                }
                prevLoc[level] = iloc;
            } else if (type === 'prop') {
                var newlevel = trjs.data.imbrication[iloc];
                // console.log('K', iloc, level, newlevel);
                if (!newlevel) {
                    //console.log('pas d indication de level');
                    s += '<spanGrp type="' + iloc + '">';
                    s += '<span';
                    if (its !== '') s += ' from="#' + timeline[its] + '"';
                    if (ite !== '') s += ' to="#' + timeline[ite] + '"';
                    s += '>\n';
                    s += xmlEntitiesEncode(itrans);
                    s += '</span>\n';
                    s += '</spanGrp>\n';
                } else if (newlevel > level) {
                    // the current span is lower in the hierarchy than the previous one
                    // do not close spanGrp
                    //console.log('AUGMENTATION');
                    while (level < newlevel - 1) { // Cas où l'on sauterait plusieurs niveaux d'un coup
                        level++;
                        s += '<span>\n';
                        s += '<spanGrp>\n';
                    }
                    level++;
                    //console.log('A', iloc, level, newlevel);
                    s += '<spanGrp type="' + iloc + '">';
                    s += '<span';
                    if (its !== '') s += ' from="#' + timeline[its] + '"';
                    if (ite !== '') s += ' to="#' + timeline[ite] + '"';
                    s += '>\n';
                    s += xmlEntitiesEncode(itrans);
                } else if (newlevel < level) {
                    // the current span is higher in the hierarchy than the previous one
                    // close all previous span and continue
                    //console.log('DIMINUTION');
                    if (iloc !== prevLoc[newlevel]) {
                        // first close the open elements
                        s += '</span>\n';
                        s += '</spanGrp>\n';
                        // now close imbrication
                        while (level > newlevel) {
                            level--;
                            s += '</span>\n';
                            s += '</spanGrp>\n';
                        }
                        s += '<spanGrp type="' + iloc + '">\n';
                    } else {
                        // first close the open elements
                        s += '</span>\n';
                        // now close imbrication
                        while (level > newlevel) {
                            level--;
                            s += '</spanGrp>\n';
                            s += '</span>\n';
                        }
                    }
                    //console.log('D', iloc, level, newlevel);
                    s += '<span';
                    if (its !== '') s += ' from="#' + timeline[its] + '"';
                    if (ite !== '') s += ' to="#' + timeline[ite] + '"';
                    s += '>\n';
                    s += xmlEntitiesEncode(itrans);
                } else {
                    // same level as before: close one span and continue
                    //console.log('IDEM');
                    if (iloc !== prevLoc[level]) {
                        //console.log('chg LOC');
                        s += '</span>\n';
                        s += '</spanGrp>\n';
                        s += '<spanGrp type="' + iloc + '">';
                    } else
                        s += '</span>\n';
                    s += '<span';
                    //console.log('I', iloc, level, newlevel);
                    if (its !== '') s += ' from="#' + timeline[its] + '"';
                    if (ite !== '') s += ' to="#' + timeline[ite] + '"';
                    s += '>\n';
                    s += xmlEntitiesEncode(itrans);
                }
                prevLoc[level] = iloc;
            } else {
                while (level > 1) {
                    level--;
                    s += '</span>\n';
                    s += '</spanGrp>\n';
                }
                if (openedAU) {
                    s += '</annotationBlock>\n';
                    openedAU = false;
                }
                if (iloc === '+note+') {
                    var itranstype = '';
                    var itransval = '';
                    s += '<annotationBlock>';
                    if (itrans != '') {
                        var divtext = trjs.template.splitDoubleText(itrans);
                        if (divtext.type !== '')
                            itranstype = xmlEntitiesEncode(divtext.type);
                        if (divtext.subtype !== '')
                            itransval = xmlEntitiesEncode(divtext.subtype);
                    }
                    s += '<note type="' + itranstype + '">' + itransval + '</note>';
                    s += '</annotationBlock>';
                } else { // classic annotation
                    s += '<annotationBlock ';
                    if (its !== '') s += 'start="#' + timeline[its] + '" ';
                    if (ite !== '') s += 'end="#' + timeline[ite] + '" ';
                    if (iloc !== '') s += 'who="' + iloc + '" ';
                    s += 'xml:id="u' + localID + '" ';
                    localID++;
                    s += '>\n';
                    s += '<u>' + xmlTranscription(itrans) + '</u>\n';
                    openedAU = true;
                }
                prevLoc[level] = iloc;
            }
        }
        while (level > 1) {
            level--;
            s += '</span>\n';
            s += '</spanGrp>\n';
        }
        if (openedAU) {
            s += '</annotationBlock>\n';
            openedAU = false;
        }
        var nbm = nbMissingDiv(tablelines);
        for (var i = 0; i < nbm; i++)
            s += '</div>\n';
        s += '</body>\n';
        s += '</text>\n</TEI>\n';
        // console.log(s);
        return s;
    }

    /**
     * find the value of a certain dependent tier below the main transcription
     * @method getValueProp
     * @param {object} transcription table
     * @param {int} line number
     * @param {string} name of tier to look for
     * @return {string} value of tier
     */
    function getValueProp(table, ln, prop) {
        while (ln < table.length) {
            if (typeTier($(table[ln])) !== 'prop')
                return '';
            if (codeTier($(table[ln])) === prop)
                return trjs.events.lineGetCellHtml($(table[ln]), trjs.data.TRCOL);
            ln++;
        }
        return '';
    }

    /**
     * export data contained in the editing tables into a string for csv reading
     * @method saveTranscriptToCsvString
     * @return string with the data
     */
    function saveTranscriptToCsvString(partof, subfields) {
        var s = '';
        /*
         * saving the text part of the file
         * format of a csv string
         * transcription name + line + media name + start time + end time + locutor + transcription
         */
        s += 'file\tline\tmedia\tstart\tend\tloc\ttranscription\n';
        var tablelines = trjs.transcription.tablelines();
        for (var i = 0; i < tablelines.length; i++) {
            if (partof === true) {
                var td = $(tablelines[i]).find('td.info');
                if (td[0].data_select !== true) continue;
            }
            var type = typeTier($(tablelines[i]));
            if (type !== 'loc') continue;
            // var code = codeTier( $(tablelines[i]) );
            var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TRCOL));
            var line = getLine($(tablelines[i]));
            if (iloc == '' && itrans == '') continue;
            if (iloc === undefined || iloc === null) iloc = '';
            if (trjs.events.testMark(iloc))
                iloc = trjs.events.trimMark(iloc);
            s += trjs.data.recordingLoc() + "/" + trjs.data.recordingName() + "\t" + line + "\t";  // name of transcription
            s += trjs.data.mediaLoc() + '/' + trjs.data.mediaName() + "\t" + its + "\t" + ite + "\t"; // name of media and times
            // s += trjs.data.installURL + "/transcriberjs.html?t=" + trjs.data.recordingLoc() + '/' + trjs.data.recordingName() + "&ln=" + trjs.events.lineGetCell($(tablelines[i]), trjs.events.firstLoc) + "&play";
            if (trjs.param.locnames === true)
                iloc = trjs.template.nameToCode(iloc);
            s += iloc + "\t" + '"' + itrans.replace('\"', '\"\"', 'g') + '"'; // data
//		s += getValueProp(tablelines, i+1, 'phon'); // optional phonological data
            s += "\n";
        }
        return s;
    }

    /**
     * count number of missing -div- up to a certain line number
     * @method nbMissingDiv
     * @param {array-of-DOM-elements}
     * @param {jquery-object} optional: line to end of the counting
     */
    function nbMissingDiv(table, sel) {
        var nbdiv = 0;
        var end;
        if (sel === undefined)
            end = table.length;
        else
            end = lineTier(sel);
        for (var i = 0; i < end; i++) {
            if (typeTier($(table[i])) === 'div') {
                var a = codeTier($(table[i]));
                if (trjs.events.trimMark(a) === '+div+')
                    nbdiv++;
                else
                    nbdiv--;
            }
        }
        return nbdiv;
    }

    /**
     * initialize and reinitialize data to store transcrition
     * @method newTable
     */
    function newTable() {
        var hot = [
            {loc: "+div+", ts: "", te: "", tx: "", stx: "", type: 'div'}, // trjs.messgs.initdiv
            {loc: "LOC", ts: 0, te: "", tx: "", type: 'loc'} // trjs.messgs.inittrs
        ];
        initTable(hot);
    }

    /**
     * find the the value of the code in the loc part
     * @method findCode
     * @param {string} string of the loc/prop/div name
     * @return {string} type of loc
     */
    function findCode(loc) {
        if (trjs.events.testMark(loc))
            loc = trjs.events.trimMark(loc);
        if (loc === '---') {
            return '---';	// temporary fillers
        } else if (loc === '+div+') {
            return 'div';
        } else if (loc === '+incident+') {
            return 'incident';
        } else if (loc === '+note+') {
            return 'note';
        } else if (loc === '+pause+') {
            return 'pause';
        } else if (loc === '-div-') {
            return 'div';
        } else if (loc === '=div=') {
            return 'div';
        } else {
            var table = $("#template-code");
            var tablelines = $('tr', table[0]);
            for (var i = 1; i < tablelines.length; i++) {
                var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
                if (icode === loc) {
                    return 'loc';
                }
            }
            table = $("#template-tier");
            tablelines = $('tr', table[0]);
            for (i = 1; i < tablelines.length; i++) {
                var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
                if (icode === loc) {
                    return 'prop';
                }
            }
            // it's nothing
            return '---';
        }
    }

    /**
     * set the type of the line
     * @method setType
     * @param {object} pointer to a jquery-object describing a line of table TR
     * @param {string} value to be set
     */
    function setType(sel, type) {
        // console.log('setType: ',type);
        sel.attr('class', type);
        var tds = sel.children();
        if (type.indexOf('main ') === 0)
            $(tds[trjs.data.CODECOL]).attr('class', type.substr(5));
        else
            $(tds[trjs.data.CODECOL]).attr('class', type);
    }

    /**
     * set the code of the line
     * @method setCode
     * @param {object} pointer to a jquery-object describing a line of table TR
     * @param {string} value to be set
     */
    function setCode(sel, code) {
        sel.attr('code', code);
        trjs.events.lineSetCell(sel, trjs.data.CODECOL, code);
    }

    /**
     * get the code of the line
     * @method getCode
     * @param {object} pointer to a jquery-object describing a line of table TR
     * @returns {string} value of code
     */
    function getCode(sel) {
        return trjs.events.lineGetCell(sel, trjs.data.CODECOL);
    }

    /**
     * get the number of the line
     * @method getLine
     * @param {object} pointer to a jquery-object describing a line of table TR
     * @returns {int} line number
     */
    function getLine(sel) {
        return parseInt(trjs.events.lineGetCell(sel, trjs.data.LINECOL));
    }

    /**
     * creates a string containing the table html code of a line of transcription
     * @method stringLineTranscript
     * @param {string} type of line
     * @param {string} locutor
     * @param {string} time start
     * @param {string} time end
     * @param {string} visualisation time start
     * @param {string} visualisation time end
     * @param {string} transcription
     * @param {int} ln line number for lines
     * @return {string} constructed html string
     */
    function stringLineTranscript(type, loc, ts, te, vts, vte, tr, ln) {
        var s = '<tr class="main ' + type + '" code="' + loc + '" visible=3 backcolor="white" >'; // locuteur name + type of line
        s += '<td class="num">' + ln + '</td>'; // line numbers
        s += '<td class="info"><i class="fa fa-square-o" onclick="trjs.transcription.clickMS(event, ' + ln + ');"></i></td>'; // for the future
        if (trjs.param.mode === 'readonly') {
            s += '<td class="' + type + '" oncontextmenu="trjs.events.clickLoc(event);">' + loc;
            s += '</td><td class="ts">' + trjs.dataload.checknumber(ts)
                + '</td><td class="te">' + trjs.dataload.checknumber(te)
                + '</td><td class="vts">' + trjs.dataload.checkstring(vts)
                + '</td><td class="vte">' + trjs.dataload.checkstring(vte)
                + '</td><td class="transcription">' + trjs.dataload.checkstring(tr)
                + '</td><td class="infosup"></td></tr>';
        } else {
            s += '<td class="' + type + '" contenteditable="true" oncontextmenu="trjs.events.clickLoc(event);" onfocus="trjs.undo.code.protect(event);" onblur="trjs.events.checkLoc(event);">' + loc;
            s += '</td><td class="ts">' + trjs.dataload.checknumber(ts)
                + '</td><td class="te">' + trjs.dataload.checknumber(te)
                + '</td><td class="vts" contenteditable="true" onfocus="trjs.events.putTime(event);" onblur="trjs.events.checkTime(event);">' + trjs.dataload.checkstring(vts)
                + '</td><td class="vte" contenteditable="true" onfocus="trjs.events.putTime(event);" onblur="trjs.events.checkTime(event);">' + trjs.dataload.checkstring(vte)
                + '</td><td class="transcription" contenteditable="true" onfocus="trjs.undo.line.protect(event);" onblur="trjs.macros.onblur(event);">' + trjs.dataload.checkstring(tr)
                + '</td><td class="infosup"></td></tr>';
        }

        return s;
    }

    /**
     * store all loc and prop values in the transcript to be used if they are not in the template
     */
    function locPropList(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].loc !== '') {
                if (data[i].type !== 'loc') {
                    if (!trjs.data.tiersdata[loc])
                        trjs.data.tiersdata[loc] = '-';
                    // names of the tiers found in the transcript in case persons description is incomplete
                } else {
                    if (!trjs.data.codesdata[loc])
                        trjs.data.codesdata[loc] = '-';
                    // names of the locutors found in the transcript in case persons description is incomplete
                }
            }
        }
    }

    /**
     * initialize transcrition in editing table from data stored in memory
     * @method initTable
     * @param hdata data stored in memory (array for version 0.0.1, html string otherwise)
     */
    function initTable(data) {
        var s = '<thead><th class="num">-</th><th class="info"></th><th class="loc"><span id="headloc">Locutor</span></th><th class="ts">Ts</th><th class="te">Te</th><th class="vts"><span id="headts">Start</span></th><th class="vte"><span id="headte">End</span></th><th class="transcription">Transcription</th><th class="infosup"></th></thead>';
        $('#transcript-head').html(s);
        if (!data || !data.length) {
            s = stringLineTranscript('loc', 'xxx', '', '', '', '', '', '');
            $('#transcript').html(s);
            return;
        }
        s = '';
        var vts, vte;
        for (var i = 0; i < data.length - 1; i++) { // ignores the last -div-
            var locval = data[i]['loc'];
            if (trjs.param.locnames === true && data[i]['type'] === 'loc') {
                var ll = trjs.template.codeToName(locval);
                if (ll) locval = ll;
            }
            vts = formatTime(data[i]['ts']);
            vte = formatTime(data[i]['te']);
            if (data[i]['loc'] === '+div+') {
                var divtx = createDivEditField(data[i]['tx'], data[i]['stx']);
                s += stringLineTranscript(data[i]['type'], locval, data[i]['ts'], data[i]['te'], vts, vte, divtx, i + 1);
            } else if (data[i]['loc'] === '+note+') {
                var notetx = createNoteEditField(data[i]['tx'], data[i]['stx']);
                s += stringLineTranscript(data[i]['type'], locval, data[i]['ts'], data[i]['te'], vts, vte, notetx, i + 1);
            } else {
                var k = data[i]['tx'];
                s += stringLineTranscript(data[i]['type'], locval, data[i]['ts'], data[i]['te'], vts, vte, k, i + 1);
            }
        }
        vts = formatTime(data[data.length - 1]['ts']);
        vte = formatTime(data[data.length - 1]['te']);
        if (data[data.length - 1]['type'] !== 'div') // add last if not a div
            s += stringLineTranscript(data[data.length - 1]['type'], data[data.length - 1]['loc'], data[data.length - 1]['ts'], data[data.length - 1]['te'],
                vts, vte, data[data.length - 1]['tx'], data.length);
        // console.log(s);
        $('#transcript').html(s);
    }

    function findLowestSelectedTime(tablelines) {
        if (tablelines === undefined)
            tablelines = trjs.transcription.tablelines();
        var tmin = -1;
        for (var i = 0; i < tablelines.length; i++) {
            var td = $(tablelines[i]).find('td.info');
            if (td[0].data_select !== true) continue;
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            if (its !== '') {
                if (tmin === -1)
                    tmin = its;
                else if (its < tmin)
                    tmin = its;
            }
            if (ite !== '') {
                if (tmin === -1)
                    tmin = ite;
                else if (ite < tmin)
                    tmin = ite;
            }
        }
        return tmin;
    }

    function findHighestSelectedTime(tablelines) {
        if (tablelines === undefined)
            tablelines = trjs.transcription.tablelines();
        var tmax = 0;
        for (var i = 0; i < tablelines.length; i++) {
            var td = $(tablelines[i]).find('td.info');
            if (td[0].data_select !== true) continue;
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            if (its !== '') {
                if (tmax < its)
                    tmax = its;
            }
            if (ite !== '') {
                if (tmax < ite)
                    tmax = ite;
            }
        }
        return tmax;
    }

    function exportMStoMediaSubt(all) {
        if (trjs.param.level < 'level3') return;
        // find one pgBox
        var pgb1 = trjs.progress.find();
        if (pgb1 === -1) {
            trjs.log.boxalert("cannot start extraction: wait for previous media computation to finish");
            return;
        }
        trjs.progress.setIO(pgb1);
        if (all === 'all' || trjs.data.selectedPart === false || trjs.data.selectedPart === 'all') {
            trjs.progress.closedefine(pgb1, function () {
                console.log("fin de traitement de l'extraction des sous-titres (fichier complet) : " + trjs.data.mediaRealFile());
            });
            var s = saveTranscriptToSubtitles(false, false, 'ass', true, 'gls');
            fsio.exportMediaSubt(
                {media: trjs.data.mediaRealFile(), tmin: -1, tmax: -1, subtitles: s, type: 'ass', box: pgb1},
                function (mess) {
                    trjs.log.alert(mess);
                },
                function (data) {
                    trjs.log.alert('error: ' + data.status + ' ' + data.responseText);
                });
        } else {
            // starts waiting for messages
            var tdeb = findLowestSelectedTime();
            var tend = findHighestSelectedTime();
            trjs.progress.closedefine(pgb1, function () {
                console.log("fin de traitement de l'extraction des sous-titres : " + trjs.data.mediaRealFile() + ' ' + tdeb + ' ' + tend);
            });
            var s = saveTranscriptToSubtitles(true, true, 'ass', true, 'gls');
            fsio.exportMediaSubt(
                {media: trjs.data.mediaRealFile(), tmin: tdeb, tmax: tend, subtitles: s, type: 'ass', box: pgb1},
                function (mess) {
                    trjs.log.alert(mess);
                },
                function (data) {
                    trjs.log.alert('error: ' + data.status + ' ' + data.responseText);
                });
        }
        /*
         // this can be useful for testing
         var tmin = findLowestSelectedTime();
         var tmax = findHighestSelectedTime();
         var blob = new Blob([s], {type: 'text/css'});
         saveAs(blob, 'export-' + tmin + '-' + tmax + '.srt');
         */
    }

    function exportMStoSubt(format, all) {
        if (all === 'all' || trjs.data.selectedPart === false || trjs.data.selectedPart === 'all') {
            if (format === 'srt')
                var s = saveTranscriptToSubtitles(false, false, 'srt', true, 'gls');
            else
                var s = saveTranscriptToSubtitles(false, false, 'ass', true, 'gls');
            var blob = new Blob([s], {type: "text/plain;charset=utf-8"}); // {type: 'text/css'});
            saveAs(blob, format === 'srt' ? 'export.srt' : 'export.ass');
        } else {
            if (format === 'srt')
                var s = saveTranscriptToSubtitles(true, true, 'srt', true, 'gls');
            else
                var s = saveTranscriptToSubtitles(true, true, 'ass', true, 'gls');
            var blob = new Blob([s], {type: "text/plain;charset=utf-8"}); // {type: 'text/css'});
            var tmin = findLowestSelectedTime();
            var tmax = findHighestSelectedTime();
            saveAs(blob, 'export-' + tmin + '-' + tmax + (format === 'srt' ? '.srt' : '.ass'));
        }
    }

    function exportMStoMedia() {
        if (trjs.param.level < 'level3') return;
        if (trjs.data.selectedPart === false || trjs.data.selectedPart === 'all')
            trjs.log.boxalert('no part of the media was selected');
        else {
            // find one pgBox
            var pgb1 = trjs.progress.find();
            if (pgb1 === -1) {
                trjs.log.boxalert("cannot start extraction: wait for previous media computation to finish");
                return;
            }
            trjs.progress.setIO(pgb1);
            // starts waiting for messages
            var tdeb = findLowestSelectedTime();
            var tend = findHighestSelectedTime();
            trjs.progress.closedefine(pgb1, function () {
                console.log("fin de traitement de l'extraction de l'extrait : " + trjs.data.mediaRealFile() + ' ' + tdeb + ' ' + tend);
            });
            fsio.exportMedia(
                {media: trjs.data.mediaRealFile(), tmin: tdeb, tmax: tend, box: pgb1},
                function (mess) {
                    trjs.log.alert(mess);
                },
                function (data) {
                    trjs.log.alert('error: ' + data.status + ' ' + data.responseText);
                });
        }
    }

    /**
     * export data contained in the editing tables into a string for subtitiles
     * @method saveTranscriptToSubtitles
     * @param {boolean} part of file or complete file
     * @param {boolean} use relative times or absolute times
     * @param {string} format for subtibles: 'srt' or 'ass'
     * @param {string or array of strings} list of tiers that should go in the subtitles
     * @return string with the data
     */
    function saveTranscriptToSubtitles(partof, reset, format, locs, tiers) {
        if (format === 'srt')
            return saveTranscriptToSubtitlesSrt(partof, reset, locs, tiers);
        else
            return saveTranscriptToSubtitlesAss(partof, reset, locs, tiers);
    }

    /**
     * export data contained in the editing tables into a string for subtitiles
     * srt format
     * @method saveTranscriptToSubtitlesSrt
     * @param {boolean} part of file or complete file
     * @param {boolean} use relative times or absolute times
     * @param {boolean or string or array of string} true for all locs, false for no loc information, else list of locs
     * @param {string or array of strings} list of tiers that should go in the subtitles
     * @return string with the data
     */
    function saveTranscriptToSubtitlesSrt(partof, reset, locs, tiers) {
        /*
         * saving the text part of the file
         */
        var tablelines = trjs.transcription.tablelines();
        var tmin = 0;
        if (partof === true && reset === true) {
            tmin = findLowestSelectedTime(tablelines);
        }

        /*
         * parameters settings
         */
        var s = '';
        var allLocs = true;
        var noLocs = false;
        if (typeof locs === 'boolean') {
            if (locs === false) {
                noLocs = true;
                allLocs = false;
            } else {
                allLocs = true;
                noLocs = false;
            }
        } else if (typeof locs === 'string') {
            allLocs = false;
            locs = [locs];
        } else // array of string
            allLocs = false;
        if (typeof tiers === 'string')
            tiers = [tiers];

        /*
         * extraction of data
         */
        var nl = 0;
        var completeFirst = '';
        for (var i = 0; i < tablelines.length; i++) {
            if (partof === true) {
                var td = $(tablelines[i]).find('td.info');
                if (td[0].data_select !== true) continue;
            }
            var type = typeTier($(tablelines[i]));
            // var code = codeTier( $(tablelines[i]) );
            var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
            if (type === 'loc') {
                if (noLocs === true) continue;
                if (!allLocs && locs.indexOf(iloc) < 0) continue;
            } else {
                if (!tiers || tiers.indexOf(iloc) < 0) continue;
            }
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TRCOL));
            itrans = itrans.replace(/\{/g, '\\{'); // 60 3C
            itrans = itrans.replace(/\}/g, '\\}'); // 62 3E

            if (iloc == '' && itrans == '') continue;
            if (trjs.events.testMark(iloc))
                iloc = trjs.events.trimMark(iloc);

            /*
             * writes content of subtitles in srt format
             */
            if (its !== '' && ite !== '') {
                if (reset) {
                    its -= tmin;
                    ite -= tmin;
                }
                its = new Date(its * 1000);
                ite = new Date(ite * 1000);
                nl++;
                if (nl === 1)
                    s += '1\n';
                else
                    s += '\n' + nl + '\n';
                s += sprintf("%02d:%02d:%02d,%03d --> %02d:%02d:%02d,%03d\n",
                    its.getUTCHours(), its.getUTCMinutes(), its.getSeconds(), its.getMilliseconds(),
                    ite.getUTCHours(), ite.getUTCMinutes(), ite.getSeconds(), ite.getMilliseconds());
                if (completeFirst !== '') {
                    s += completeFirst;
                    completeFirst = '';
                }
                if (type !== 'loc')
                    s += '%' + iloc + ': ' + itrans + "\n";
                else
                    s += iloc + ': ' + itrans + "\n";
            } else {
                if (nl === 0) {
                    completeFirst += iloc + ': ' + itrans + "\n";
                } else {
                    if (type !== 'loc')
                        s += '%' + iloc + ': ' + itrans + "\n";
                    else
                        s += iloc + ': ' + itrans + "\n";
                }
            }
        }
        return s;
    }

    /**
     * export data contained in the editing tables into a string for subtitiles
     * @method saveTranscriptToSubtitles
     * @param {boolean} part of file or complete file
     * @param {boolean} use relative times or absolute times
     * @param {boolean or string or array of string} true for all locs, false for no loc information, else list of locs
     * @param {string or array of strings} list of tiers that should go in the subtitles
     * @return string with the data
     */
    function saveTranscriptToSubtitlesAss(partof, reset, locs, tiers) {
        /*
         * header of the ass file
         */
        var s = '';
        s += '[Script Info]\n';
        s += '; Script generated by transcriberjs\n';
        s += '; http://modyco.inist.fr\n';
//	s += 'Title: ' + trjs.data.recTitle + '\n';
        s += 'Original Script: Transcriberjs\n';
        s += 'ScriptType: v4.00\n';
        s += 'Collisions: Normal\n';
        s += 'PlayResY: 720\n';
        s += 'PlayResX: 1200\n';
//	s += 'PlayDepth: 0\n';
//	s += 'Timer: 100,0000\n';
//	s += 'Video Aspect Ratio: 0';
//	s += 'Video Zoom: 6';
//	s += 'Video Position: 0';

        s += '[V4 Styles]\n';
        s += 'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding\n';
        s += 'Style: Default,Arial,40,&H00ffff,&H00ffff,&H00ffff,&H0,-1,0,1,3,0,2,30,30,30,0,0\n'; // first format

//	s += '[V4+ Styles]';
//	s += 'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding';
//	s += 'Style: MainLine, Arial,28,&H00B4FCFC,&H00B4FCFC,&H00000008,&H80000008,-1,0,0,0,100,100,0.00,0.00,1,1.00,2.00,2,30,30,30,0';

        s += '[Events]\n';
        s += 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
        // example
        //s += 'Dialogue: Marked=0,0:02:40.65,0:02:41.79,Default,Cher,0000,0000,0000,,Et les enregistrements de ses ondes delta ?

        /*
         * parameters settings
         */
        var allLocs = true;
        var noLocs = false;
        if (typeof locs === 'boolean') {
            if (locs === false) {
                noLocs = true;
                allLocs = false;
            } else {
                allLocs = true;
                noLocs = false;
            }
        } else if (typeof locs === 'string') {
            allLocs = false;
            locs = [locs];
        } else // array of string
            allLocs = false;
        if (typeof tiers === 'string')
            tiers = [tiers];

        /*
         * saving the text part of the file
         */
        var tablelines = trjs.transcription.tablelines();
        var tmin = 0;
        if (partof === true && reset === true) {
            tmin = findLowestSelectedTime(tablelines);
        }
        var previts = new Date(0);
        var previte = new Date(5); // default 0 to 5 seconds
        if (noLocs === true) { // noLocs uses a different procedure
            ;
        } else if (!tiers) { // noTiers uses a different procedure
            for (var i = 0; i < tablelines.length; i++) {
                if (partof === true) {
                    var td = $(tablelines[i]).find('td.info');
                    if (td[0].data_select !== true) continue;
                }
                var type = typeTier($(tablelines[i]));
                if (type !== 'loc') continue;
                var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
                if (trjs.events.testMark(iloc))
                    iloc = trjs.events.trimMark(iloc);
                if (!allLocs && locs.indexOf(iloc) < 0) continue;

                var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
                var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
                var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TRCOL));
                itrans = itrans.replace(/\{/g, '\\{'); // 60 3C
                itrans = itrans.replace(/\}/g, '\\}'); // 62 3E

                if (iloc == '' && itrans == '') continue;

                /*
                 * checks the time of the transcription
                 */
                if (its !== '' && ite !== '') {
                    if (reset) {
                        its -= tmin;
                        ite -= tmin;
                    }
                    its = new Date(its * 1000);
                    ite = new Date(ite * 1000);
                    previts = its;
                    previte = ite;
                }
                /*
                 * writes content of subtitles in ass format
                 */
                s += 'Dialogue: Marked=0,';
                s += sprintf("%01d:%02d:%02d.%02d,%01d:%02d:%02d.%02d,",
                    previts.getUTCHours(), previts.getUTCMinutes(), previts.getSeconds(), Math.floor(previts.getMilliseconds() / 10),
                    previte.getUTCHours(), previte.getUTCMinutes(), previte.getSeconds(), Math.floor(previte.getMilliseconds() / 10));
                s += 'Default,' + iloc + ',0,0,0,,';
                s += iloc + ': ' + itrans + "\n";
            }
        } else { // some or all locs and some (or all) tiers
            for (var i = 0; i < tablelines.length;) {
                if (partof === true) {
                    var td = $(tablelines[i]).find('td.info');
                    if (td[0].data_select !== true) {
                        i++;
                        continue;
                    }
                }
                var type = typeTier($(tablelines[i]));
                var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
                if (trjs.events.testMark(iloc))
                    iloc = trjs.events.trimMark(iloc);
                if (type === 'loc') {
                    if (!allLocs && locs.indexOf(iloc) < 0) {
                        // skip the loc and the tiers
                        i++;
                        while (i < tablelines.length) {
                            type = typeTier($(tablelines[i]));
                            if (type === 'loc') break;
                            i++;
                        }
                        continue;
                    }
                    /*
                     * checks the time of the transcription
                     */
                    var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
                    var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
                    if (its !== '' && ite !== '') {
                        if (reset) {
                            its -= tmin;
                            ite -= tmin;
                        }
                        its = new Date(its * 1000);
                        ite = new Date(ite * 1000);
                        previts = its;
                        previte = ite;
                    }
                    /*
                     * write the locs subtitles
                     * but first gather the tiers and store the locs
                     */
                    var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TRCOL));
                    itrans = itrans.replace(/\{/g, '\\{'); // 60 3C
                    itrans = itrans.replace(/\}/g, '\\}'); // 62 3E
                    s += 'Dialogue: Marked=0,';
                    s += sprintf("%01d:%02d:%02d.%02d,%01d:%02d:%02d.%02d,",
                        previts.getUTCHours(), previts.getUTCMinutes(), previts.getSeconds(), Math.floor(previts.getMilliseconds() / 10),
                        previte.getUTCHours(), previte.getUTCMinutes(), previte.getSeconds(), Math.floor(previte.getMilliseconds() / 10));
                    s += 'Default,' + iloc + ',0,0,0,,';
                    s += iloc + ': ' + itrans;
                    for (var t in tiers) {
                        var k = i + 1;
                        while (k < tablelines.length) {
                            type = typeTier($(tablelines[k]));
                            if (type === 'loc') break;
                            var itier = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[k]), trjs.data.CODECOL));
                            if (trjs.events.testMark(itier))
                                itier = trjs.events.trimMark(itier);
                            if (tiers.indexOf(itier) > -1) {
                                // writes the tier in the file
                                var ittrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[k]), trjs.data.TRCOL));
                                ittrans = ittrans.replace(/\{/g, '\\{'); // 60 3C
                                ittrans = ittrans.replace(/\}/g, '\\}'); // 62 3E
                                s += '\\N{\\b0}{\\c&HFFFFFF&}%' + itier + ': ' + ittrans;
                            }
                            k++;
                        }
                    }
                    s += "\n";

                    // skip the loc and the tiers
                    i++;
                    while (i < tablelines.length) {
                        type = typeTier($(tablelines[i]));
                        if (type === 'loc') break;
                        i++;
                    }
                }
            }
        }
        return s;
    }

    /**
     * export data contained in the editing tables into a string for text
     * @method saveTranscriptToText
     * @return string with the data
     */
    function saveTranscriptToText(partof, reset, time) {
        /*
         * saving the text part of the file
         */
        var tablelines = trjs.transcription.tablelines();
        var tmin = 0;
        if (trjs.data.selectedPart === false) {
            trjs.log.alert('no current selection: all text will be exported');
            partof = false;
            reset = false;
        }
        if (partof === true && reset === true) {
            tmin = findLowestSelectedTime(tablelines);
        }

        var nl = 0;
        var s = '';
        for (var i = 0; i < tablelines.length; i++) {
            if (partof === true) {
                var td = $(tablelines[i]).find('td.info');
                if (td[0].data_select !== true) continue;
            }
            var type = typeTier($(tablelines[i]));
            // if (type != 'loc') continue;
            // var code = codeTier( $(tablelines[i]) );
            var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
            var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TRCOL));
            if (iloc == '' && itrans == '') continue;
            if (trjs.events.testMark(iloc))
                iloc = trjs.events.trimMark(iloc);
            if (type === 'prop') {
                s += '\t';
                var level = trjs.data.imbrication[iloc];
                if (level) {
                    for (var ii = 0; ii < level; ii++)
                        s += ' ';
                    s += '    ';
                } else
                    s += '    ';
            } else {
                nl++;
                s += nl + '\t';
            }
            s += iloc + '\t';
            s += transcriptEncoding(itrans) + '\t';
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            if (time !== undefined && (its !== '' || ite != '')) {
                /*
                 * writes content of subtitles in txt format
                 */
                if (its !== '') {
                    if (reset)
                        its -= tmin;
                    its = new Date(its * 1000);
                    // s += sprintf("%02d:%02d:%02d,%03d", its.getUTCHours(), its.getUTCMinutes(), its.getSeconds(), its.getMilliseconds() );
                    s += sprintf("%02d:%02d:%02d", its.getUTCHours(), its.getUTCMinutes(), its.getSeconds());
                }
                s += '\t';
                if (ite !== '') {
                    if (reset)
                        ite -= tmin;
                    ite = new Date(ite * 1000);
                    // s += sprintf("%02d:%02d:%02d,%03d", ite.getUTCHours(), ite.getUTCMinutes(), ite.getSeconds(), ite.getMilliseconds() );
                    s += sprintf("%02d:%02d:%02d", ite.getUTCHours(), ite.getUTCMinutes(), ite.getSeconds());
                }
            }
            s += '\n';
        }
        return s;
    }

    /**
     * export data contained in the editing tables into a string for text
     * @method saveTranscriptToDocx
     * @return string with the data
     */
    function saveTranscriptToHtml(partof, reset, time) {
        /*
         * saving the text part of the file
         */
        var tablelines = trjs.transcription.tablelines();
        var tmin = 0;
        if (trjs.data.selectedPart === false) {
            trjs.log.alert('no current selection: all text will be exported');
            partof = false;
            reset = false;
        }
        if (partof === true && reset === true) {
            tmin = findLowestSelectedTime(tablelines);
        }

        var nl = 0;
        var s = '<table>';
        for (var i = 0; i < tablelines.length; i++) {
            s += '<tr><td>';
            if (partof === true) {
                var td = $(tablelines[i]).find('td.info');
                if (td[0].data_select !== true) continue;
            }
            var type = typeTier($(tablelines[i]));
            // if (type != 'loc') continue;
            // var code = codeTier( $(tablelines[i]) );
            var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
            var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TRCOL));
            if (iloc == '' && itrans == '') continue;
            if (trjs.events.testMark(iloc))
                iloc = trjs.events.trimMark(iloc);
            if (type === 'prop') {
                s += '</td>';
                var level = trjs.data.imbrication[iloc];
                if (level) {
                    for (var ii = 0; ii < level; ii++)
                        s += ' ';
                    s += '    ';
                } else
                    s += '    ';
            } else {
                nl++;
                s += nl + '</td>';
            }
            s += '<td>' + iloc + '</td>';
            s += '<td>' + transcriptEncoding(itrans) + '</td><td>';
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            if (time !== undefined && (its !== '' || ite != '')) {
                /*
                 * writes content of subtitles in txt format
                 */
                if (its !== '') {
                    if (reset)
                        its -= tmin;
                    its = new Date(its * 1000);
                    // s += sprintf("%02d:%02d:%02d,%03d", its.getUTCHours(), its.getUTCMinutes(), its.getSeconds(), its.getMilliseconds() );
                    s += sprintf("%02d:%02d:%02d", its.getUTCHours(), its.getUTCMinutes(), its.getSeconds());
                }
                s += '</td><td>';
                if (ite !== '') {
                    if (reset)
                        ite -= tmin;
                    ite = new Date(ite * 1000);
                    // s += sprintf("%02d:%02d:%02d,%03d", ite.getUTCHours(), ite.getUTCMinutes(), ite.getSeconds(), ite.getMilliseconds() );
                    s += sprintf("%02d:%02d:%02d", ite.getUTCHours(), ite.getUTCMinutes(), ite.getSeconds());
                }
            }
            s += '</td></tr>';
        }
        return s;
    }

    /*
     function string_as_unicode_escape(input) {
     function pad_four(input) {
     var l = input.length;
     if (l == 0) return '0000';
     if (l == 1) return '000' + input;
     if (l == 2) return '00' + input;
     if (l == 3) return '0' + input;
     return input;
     }
     var output = '';
     for (var i = 0, l = input.length; i < l; i++)
     output += '\\u' + pad_four(input.charCodeAt(i).toString(16));
     return output;
     }
     */
    function string_as_unicode_escape(input) {
        var output = '';
        for (var i = 0, l = input.length; i < l; i++) {
            var c = input.charCodeAt(i);
            if (c < 128)
                output += input[i];
            else
                output += '\\u' + c + '?';
        }
        return output;
    }

    /**
     * export data contained in the editing tables into a string for rtf format
     * @method saveTranscriptToRtf
     * @return string with the data
     */
    function saveTranscriptToRtf(partof, reset, time, table) {
        // table = true;
        /*
         * saving the text part of the file
         */
        var tablelines = trjs.transcription.tablelines();
        var tmin = 0;
        if (trjs.data.selectedPart === false) {
            trjs.log.alert('no current selection: all text will be exported');
            partof = false;
            reset = false;
        }
        if (partof === true && reset === true) {
            tmin = findLowestSelectedTime(tablelines);
        }

        var nl = 0;
        var s = '';
        if (table) {
            s += '{\\rtf1\\ansi\\deff0\\uc1\n';
            s += '\\trowd\\trautofit1\n';
            s += '\\intbl\n';
            s += '\\row\n';
            s += '\\par\n';
            s += '\\trowd\\trautofit1\n';
            s += '\\intbl\n';
            s += '\\clftsWidth2\\clwWidth7000\\cellx1\n';
            s += trjs.data.recName + '\\cell\\row\n';
            s += '\\intbl\n';
            s += '\\clftsWidth2\\clwWidth7000\\cellx1\n';
            s += trjs.data.recRealFile + '\\cell\\row\n';
            s += '\\intbl\n';
            s += '\\clftsWidth2\\clwWidth7000\\cellx1\n';
            s += Date() + '\\intbl\\cell\\row\n';
            s += '\\par\n\n';
        } else {
            s += '{\\rtf1\\ansi\\deff0\\uc1\n';
            s += trjs.data.recName + '\\line\n';
            s += trjs.data.recRealFile + '\\line\n';
            s += Date() + '\\line\n';
        }
        for (var i = 0; i < tablelines.length; i++) {
            if (table) {
                s += '\\trowd\\trautofit1\n'
                s += '\\intbl\n';
                s += '\\clftsWidth2\\clwWidth400\\cellx1\n';
                s += '\\clftsWidth2\\clwWidth800\\cellx2\n';
                s += '\\clftsWidth2\\clwWidth4300\\cellx3\n';
                s += '\\clftsWidth2\\clwWidth750\\cellx4\n';
                s += '\\clftsWidth2\\clwWidth750\\cellx5\n';
            }
            if (partof === true) {
                var td = $(tablelines[i]).find('td.info');
                if (td[0].data_select !== true) continue;
            }
            var type = typeTier($(tablelines[i]));
            // if (type != 'loc') continue;
            // var code = codeTier( $(tablelines[i]) );
            var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
            var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TRCOL));
            if (iloc == '' && itrans == '') continue;
            if (trjs.events.testMark(iloc))
                iloc = trjs.events.trimMark(iloc);
            if (type === 'prop') {
                s += (table ? ' \\cell\n' : '\t');
                var level = trjs.data.imbrication[iloc];
                if (level) {
                    for (var ii = 0; ii < level; ii++)
                        s += ' ';
                    s += '    ';
                } else
                    s += '    ';
            } else if (type === 'div') {
                s += (table ? ' \\cell\n' : '\t');
            } else {
                nl++;
                s += nl + (table ? '\\cell\n' : '\t');
            }
            s += string_as_unicode_escape(iloc) + (table ? '\\cell\n' : '\t');
            s += string_as_unicode_escape(transcriptEncoding(itrans)) + (table ? '\\cell\n' : '\t');
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            if (time !== undefined && (its !== '' || ite != '')) {
                /*
                 * writes content of subtitles in txt format
                 */
                if (its !== '') {
                    if (reset)
                        its -= tmin;
                    its = new Date(its * 1000);
                    // s += sprintf("%02d:%02d:%02d,%03d", its.getUTCHours(), its.getUTCMinutes(), its.getSeconds(), its.getMilliseconds() );
                    s += sprintf("%02d:%02d:%02d", its.getUTCHours(), its.getUTCMinutes(), its.getSeconds());
                }
                s += (table ? '\\cell\n' : '\t');
                if (ite !== '') {
                    if (reset)
                        ite -= tmin;
                    ite = new Date(ite * 1000);
                    // s += sprintf("%02d:%02d:%02d,%03d", ite.getUTCHours(), ite.getUTCMinutes(), ite.getSeconds(), ite.getMilliseconds() );
                    s += sprintf("%02d:%02d:%02d", ite.getUTCHours(), ite.getUTCMinutes(), ite.getSeconds());
                }
            }
            s += (table ? '\\cell\n\\row\n' : '\\line\n');
        }
        return s + '\n}\n';
    }

    /**
     * shift all times in a transcription
     * @method shiftTimeLinks
     * @params {float} time to shift
     */
    function shiftTimeLinks(time) {
        time = parseFloat(time);
        if (isNaN(time)) {
            trjs.log.alert('a valid time must be provided to shift time links');
            return;
        }
        /*
         * listing of the lines
         */
        var tablelines = trjs.transcription.tablelines();
        for (var i = 0; i < tablelines.length; i++) {
            if (trjs.data.selectedPart !== false) {  // if a part in selected, shift only in the selected part
                var td = $(tablelines[i]).find('td.info');
                if (td[0].data_select !== true) continue;
            }
            var type = typeTier($(tablelines[i]));
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            if (its !== '') {
                its += time;
                if (its < 0) its = 0;
                trjs.events.lineSetCell($(tablelines[i]), trjs.data.TSCOL, its);
                trjs.events.lineSetCell($(tablelines[i]), trjs.data.VTSCOL, formatTime(its));
            }
            if (ite !== '') {
                ite += time;
                if (ite < 0) ite = 0;
                trjs.events.lineSetCell($(tablelines[i]), trjs.data.TECOL, ite);
                trjs.events.lineSetCell($(tablelines[i]), trjs.data.VTECOL, formatTime(ite));
            }
        }
    }

    function doShiftTimeLinks() {
        if (trjs.data.selectedPart !== false) {
            bootbox.confirm(trjs.messgs.shifttimelinks,
                function (rep) {
                    if (rep !== true)
                        return;
                    else {
                        doAskShiftTimeLinks();
                        return;
                    }
                }
            );
        }
        doAskShiftTimeLinks();
    }

    function doAskShiftTimeLinks() {
        bootbox.prompt(trjs.messgs.askshifttimelinks,
            function (value) {
                if (value) {
                    value = value.replace(/,/, ".");
                    shiftTimeLinks(value);
                }
            }
        );
    }

    /*
     * sort all lines according to the start time or end time
     */
    function sort() {
        var tabData = [];
        var prevts = 0;
        var prevte = 0;
        var tablelines = trjs.transcription.tablelines();
        for (var i = 0; i < tablelines.length - 1; i++) {
            var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
            var itrans = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TRCOL));
            var its = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TSCOL));
            var ite = trjs.dataload.checknumber(trjs.events.lineGetCell($(tablelines[i]), trjs.data.TECOL));
            //console.log('iloc ' + iloc + ' its (' + its + ') ite (' + ite + ') itrans ' + itrans);
            if (its === '') { // if the starting time is null, provide an alternative
                var compts = prevts;
            } else {
                var compts = its;
                prevts = its;
            }
            if (ite === '') { // if the starting time is null, provide an alternative
                var compte = prevte;
            } else {
                var compte = ite;
                prevte = ite;
            }
            tabData.push({loc: iloc, tx: itrans, ts: its, te: ite, cts: compts, cte: compte, type: findCode(iloc)});
        }
        // console.log(tabData);
        // sort the data
        tabData.sort(function (a, b) {
            // compares start time
            if (a.cts > b.cts)
                return 1;
            if (a.cts < b.cts)
                return -1;
            // start time a equals start time b
            if (a.loc !== '+div+' && b.loc === '+div+')
                return 1;
            if (a.loc === '+div+' && b.loc !== '+div+')
                return -1;

            if (a.cte > b.cte)
                return 1;
            if (a.cte < b.cte)
                return -1;
            // a equals b
            return 0;
        });
        // put back the data.
        $('#transcript').html('<table class="transcribertable" id="transcript" onclick="trjs.events.transcriptGotFocus(event);"></table>');
        initTable(tabData);
        updateCSS(); // compute the colors of the locutors
    }

    return {
        clickMS: function (e, l) {
            clickMS(e, l);
        },
        codeTier: function (p) {
            return codeTier(p);
        },
        convertFromTxtToCsv: function (p) {
            return convertFromTxtToCsv(p);
        },
        copyMultipleSelection: function () {
            copyMultipleSelection();
        },
        createDivEditField: function (p1, p2) {
            return createDivEditField(p1, p2);
        },
        cutMultipleSelection: function () {
            cutMultipleSelection();
        },
        deselectAllMS: function (e) {
            deselectAllMS(e);
        },
        doShiftTimeLinks: function () {
            doShiftTimeLinks();
        },
        exportMStoCsv: function () {
            exportMStoCsv();
        },
        exportMStoMedia: function () {
            exportMStoMedia();
        },
        exportMStoMediaSubt: function (p) {
            exportMStoMediaSubt(p);
        },
        exportMStoSubt: function (p1, p2) {
            exportMStoSubt(p1, p2);
        },
        exportMStoSubtSrt: function (p) {
            exportMStoSubt('srt', p);
        },
        exportMStoSubtAss: function (p) {
            exportMStoSubt('ass', p);
        },
        exportMStoTei: function () {
            exportMStoTei();
        },
        findCode: function (p) {
            return findCode(p);
        },
        formatTime: function (p) {
            return formatTime(p);
        },
        getCode: function (p) {
            return getCode(p);
        },
        getLine: function (p) {
            return getLine(p);
        },
        setType: function (p1, p2) {
            setType(p1, p2);
        },
        initialLoadFinished: function () {
            return initialLoadFlag;
        },
        isEmptyRow: function (p) {
            return isEmptyRow(p);
        },
        isnotbl: function (p) {
            return isnotbl(p);
        },
        loadCsvIntoGrid: function (p1, p2) {
            return loadCsvIntoGrid(p1, p2);
        },
        loadIntoGrid: function (p1, p2) {
            return loadIntoGrid(p1, p2);
        },
        loadNewGrid: function () {
            loadNewGrid();
        },
        nbMissingDiv: function (p1, p2) {
            return nbMissingDiv(p1, p2);
        },
        pasteMultipleSelection: function () {
            pasteMultipleSelection();
        },
        print: function (range) {
            trjs.utils.printByID('transcript');
        },
        readCsv: function (p) {
            return readCsv(p);
        },
        saveTranscriptToCsvString: function () {
            return saveTranscriptToCsvString();
        },
        saveTranscriptToString: saveTranscriptToString,
        saveTranscriptToText: function (p1, p2, p3) {
            return saveTranscriptToText(p1, p2, p3);
        },
        saveTranscriptToRtf: function (p1, p2, p3, p4) {
            return saveTranscriptToRtf(p1, p2, p3, p4);
        },
        saveTranscriptToHtml: saveTranscriptToHtml,
        selectAllMS: selectAllMS,
        setCode: function (p1, p2) {
            setCode(p1, p2);
        },
        setMultipleSelection: function () {
            return setMultipleSelection();
        },
        stringLineTranscript: stringLineTranscript,
        sort: function () {
            sort();
        },
        tablelines: function () {
            var table = $("#transcript");
            return $('tr.main', table[0]);
        },
        tablelinesLoc: function () {
            var table = $("#transcript");
            return $('tr.main.loc', table[0]);
        },
        trUpdateCSS: function (p, q) {
            trUpdateCSS(p, q);
        },
        typeTier: function (p) {
            return typeTier(p);
        },
        updateCSS: function (p) {
            updateCSS(p);
        },
        updateLocNames: function () {
            updateLocNames();
        },
        updateTimecode: function () {
            updateTimecode();
        },
        xmlEntitiesEncode: function (p) {
            return xmlEntitiesEncode(p);
        },
    };
})();
