/**
 * @module jqtree
 * @author Christophe Parisse
 * interface with the jqTree library
 */

/* global $ */

var filetree = {};

filetree.typeChooseFile = null;  // stores the type of file to be asked for in the interface
filetree.destChooseFile = null;  // stores the type of file to be send as result
filetree.selection = null; // current selected value + end value then ok is clicked
filetree.selectedPath = null; // current selected path + end value

filetree.setfocuschoicePrev = undefined;
filetree.setfocuschoice = function (e) {
    var ptr = $(this);
    if (filetree.setfocuschoicePrev !== undefined) {
        filetree.setfocuschoicePrev.css('background-color', 'white');
        filetree.setfocuschoicePrev.css('border', 'none');
        filetree.setfocuschoicePrev.css('padding', '0');
    }
    ptr.css('background-color', '#b8f5f2');
    ptr.css('border', 'solid 1px black');
    ptr.css('padding', '2px');
    //ptr.css('background-color','#18e7c1');
    filetree.selection = ptr.text();
    filetree.setfocuschoicePrev = ptr;
    if (filetree.destChooseFile === 'transcriptsaveas')
        $('#transcriptfiles_name').val(filetree.selection.substr(1));
//	$('.content').focus();
};

filetree.setchoice = function (e) {
    var ptr = $(this);
    filetree.selection = ptr.text();
    if (filetree.destChooseFile === 'transcriptsaveas')
        $('#transcriptfiles_name').val(filetree.selection.substr(1));
    filetree.endChooseFile();
    $('#openfile').modal('hide');
};

filetree.keyboard = function (e) {
    var charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
    //console.log('keydown ' + e.toString());
    if (charCode === 13) {
        filetree.endChooseFile();
        $('#openfile').modal('hide');
    } else if (charCode === 27) {
        trjs.aideclose();
        $('#openfile').modal('hide');
    }
};

var displayTitleBox = function (fn) {
    if (filetree.typeChooseFile === 'transcript') {
        if (filetree.destChooseFile === 'transcriptsaveas')
            $('#openfilelabel').html(trjs.messgs.oflab1 + ' <i class="fa fa-arrow-circle-right"></i> ' + fn);
        else
            $('#openfilelabel').html(trjs.messgs.oflab3 + ' <i class="fa fa-arrow-circle-right"></i> ' + fn);
    } else if (filetree.typeChooseFile === 'media') {
        var name = $('#transcript-name');
        if (name) {
            name = name.text();
            $('#openfilelabel').html(trjs.messgs.oflab4 + name + ' <i class="fa fa-arrow-circle-right"></i> ' + fn);
        } else
            $('#openfilelabel').html(trjs.messgs.oflab5 + ' <i class="fa fa-arrow-circle-right"></i> ' + fn);
    } else {
        $('#openfilelabel').html(trjs.messgs.oflab2 + ' <i class="fa fa-arrow-circle-right"></i> ' + fn);
    }
};

filetree.initChooseFile = function (dest, type) {
    if (type === 'transcriptsaveas' || type === 'media' || type === 'mediaconvert') {
        filetree.__initChooseFile(dest, type);
        return;
    }
    trjs.editor.testNotSave(function (yesno) {
        if (yesno === true) {  // the user does not want to save the modified file or the file is not modified since last save
            filetree.__initChooseFile(dest, type);
        }
    });
}

filetree.__initChooseFile = function (dest, type) {
    filetree.load();
    $('#openfile').modal();
    if (dest !== undefined) filetree.destChooseFile = dest;
    if (type !== undefined) filetree.typeChooseFile = type;
    if (dest === 'transcript' && type === 'transcript') trjs.aidecontextuelle('op-trs', false);
    if (dest === 'media' && type === 'media') trjs.aidecontextuelle('choose-media', false);
    if (filetree.typeChooseFile === 'transcriptsaveas') {
        $('#transcriptfiles_namelabel').show();
        $('#transcriptfiles_name').show();
        $('#openfilelabel').text(trjs.messgs.oflab1);
        $('#mediafiles_label').hide();
        $('#transcriptfiles_label').show();
        $('#transcriptfiles_choice').prop('checked', true);
        $('#cancelChoice').text(trjs.messgs.ofcancel);
        $('#validateFileChoice').text(trjs.messgs.ofsaveas);
        $('#transcriptionFiles').text(trjs.messgs.oftrsfiles);
        $('#allFiles').text(trjs.messgs.ofallfiles);
        $('#mediaFiles').text(trjs.messgs.ofmediafiles);

        if (filetree.destChooseFile === 'transcript') {
            $('#transcriptfiles_label').show();
            $('#transcriptfiles_choice').prop('checked', true);
            $('#qualselect').hide();
        } else {
            $('#openfilelabel').text(trjs.messgs.oflab2);
            $('#allfiles_choice').prop('checked', true);
            $('#qualselect').show();
        }
    } else {
        $('#transcriptfiles_namelabel').hide();
        $('#transcriptfiles_name').hide();
        $('#cancelChoice').text(trjs.messgs.ofcancel);
        $('#validateFileChoice').text(trjs.messgs.ofchoice);
        $('#transcriptionFiles').text(trjs.messgs.oftrsfiles);
        $('#allFiles').text(trjs.messgs.ofallfiles);
        $('#mediaFiles').text(trjs.messgs.ofmediafiles);
        if (filetree.destChooseFile === 'transcript') {
            $('#openfilelabel').text(trjs.messgs.oflab3);
            $('#mediafiles_label').hide();
            $('#transcriptfiles_label').show();
            $('#transcriptfiles_choice').prop('checked', true);
            $('#qualselect').hide();
        } else if (filetree.destChooseFile === 'media') {
            var name = $('#transcript-name');
            if (name) {
                name = name.text();
                $('#openfilelabel').text(trjs.messgs.oflab4 + name);
            } else
                $('#openfilelabel').text(trjs.messgs.oflab5);
            $('#transcriptfiles_label').hide();
            $('#mediafiles_label').show();
            $('#mediafiles_choice').prop('checked', true);
            $('#qualselect').show();
        } else if (filetree.typeChooseFile === 'mediaconvert') {
            $('#openfilelabel').text(trjs.messgs.oflab5);
            $('#transcriptfiles_label').hide();
            $('#mediafiles_label').show();
            $('#mediafiles_choice').prop('checked', true);
            $('#qualselect').show();
        } else {
            $('#openfilelabel').text(trjs.messgs.oflab2);
            $('#allfiles_choice').prop('checked', true);
            $('#qualselect').hide();
        }
    }
    $('#selection-folder').text('');
    if (filetree.selectedPath)
        filetree.getFolder(filetree.selectedPath);
    if (filetree.selectedPath)
        displayTitleBox(filetree.selectedPath);
    $('#openfile').modal();
};

function toLowerCaseSystem(str) {
    if (!str) return '';
    if (window.navigator.platform.indexOf('Linux') === -1)
        return str.toLowerCase();
    else
        return str;
}

filetree.testChooseFile = function (fn) {
    if (!fn) return false;
    fn = toLowerCaseSystem(fn);
    if (filetree.typeChooseFile === 'transcript') {
        var exts = version.KNOWN_EXTENSIONS_TRANSCRIPTIONS.split('|');
        for (var i in exts) {
            if (exts[i] && fn.endsWith(exts[i])) return true;
        }
    } else if (filetree.typeChooseFile === 'media' || filetree.typeChooseFile === 'mediaload' || filetree.typeChooseFile === 'mediaconvert' || filetree.typeChooseFile === 'medianew') {
        var exts = version.KNOWN_EXTENSIONS_MEDIA.split('|');
        for (var i in exts) {
            if (exts[i] && fn.endsWith(exts[i])) return true;
        }
    } else
        return true; // all files
    return false;
};

filetree.chooseIconFile = function (fn) {
    // var ext = trjs.utils.extensionName(fn);
    fn = toLowerCaseSystem(fn);
    var exts = version.BASIC_EXT.split('|');
    for (var i in exts) {
        if (exts[i] && fn.endsWith(exts[i])) return '<i class="fa fa-pencil-square-o"></i>';
    }
    if (fn.endsWith('.cha')) return '<i class="fa fa-file-text-o"></i>';
    if (fn.endsWith('.trs')) return '<i class="fa fa-file-text-o"></i>';
    if (fn.endsWith('mp4')) return '<i class="fa fa-file-video-o"></i>';
    if (fn.endsWith('ogv')) return '<i class="fa fa-file-video-o"></i>';
    if (fn.endsWith('webm')) return '<i class="fa fa-file-video-o"></i>';
    if (fn.endsWith('wav')) return '<i class="fa fa-file-audio-o"></i>';
    if (fn.endsWith('mp3')) return '<i class="fa fa-file-audio-o"></i>';
    return '<i class="fa fa-file-o"></i>';
};

/**
 * call for an action associated by a file choose by filetree.js
 * @method endChooseFile
 */
filetree.endChooseFile = function () {
//	alert(filetree.selectedPath + ' !!! ' + filetree.selection);
    trjs.aideclose();
    if (!filetree.selectedPath) return;
    if (filetree.destChooseFile === 'transcriptsaveas') {
        var result = $('#transcriptfiles_name').val();
        if (result) {
            var exts = version.BASIC_EXT.split('|');
            var withExt = false;
            for (var i in exts) {
                if (exts[i] && toLowerCaseSystem(result).endsWith(exts[i])) {
                    withExt = true;
                    break;
                }
                ;
            }
            if (!withExt)
                result += version.SOFT_EXT;
            // test if file exist already
            trjs.io.testFileExists(filetree.selectedPath + '/' + result, function (exists, fn) {
                if (exists === true) {
                    bootbox.confirm(trjs.messgs.askforerase + fn + " ?", function (ok) {
                        if (ok !== true)
                            return;
                        trjs.data.setRecordingName(result);
                        trjs.io.setMRU(filetree.selectedPath + '/' + result);
                        if (filetree.selectedPath !== null)
                            trjs.data.setRecordingLoc(filetree.selectedPath);
                        trjs.data.setNamesInEdit();
                        trjs.io.serverSave();
                    });
                    return;
                } else {
                    trjs.data.setRecordingName(result);
                    trjs.io.setMRU(filetree.selectedPath + '/' + result);
                    if (filetree.selectedPath !== null)
                        trjs.data.setRecordingLoc(filetree.selectedPath);
                    trjs.data.setNamesInEdit();
                    trjs.io.serverSave();
                }
            });
        }
        return;
    }
    var fn = filetree.selectedPath + '/' + filetree.selection.substr(1); // ignore the white space at the head of filetree.selection
    fn = fn.replace(/\\/g, '/');
    if (filetree.destChooseFile === 'transcript') {
        if (typeof trjs !== undefined) {
            trjs.local.put('recordingRealFile', fn);
            // console.log('>>recording destChooseFile ' + fn + ' :-: encoded ' + fn);
            trjs.io.serverLoadTranscript(fn, true, function (err) {
                trjs.data.setNamesInEdit();
                // trjs.io.innerSave();
                if (!err) trjs.editor.finalizeLoad();
            }); // internal load
        } else
            alert('transcript ' + f);
    } else if (filetree.destChooseFile === 'mediaconvert') {
        if (typeof trjs !== undefined) {
            // console.log('>>media convert destChooseFile ' + fn);
            trjs.io.convertMediaFile(fn, 'convertonly');
        } else
            alert('media' + f);
    } else if (filetree.destChooseFile === 'media') {
        if (typeof trjs !== undefined) {
            trjs.param.changed = true;
            trjs.local.put('mediaRealFile', fn);
            // console.log('>>media destChooseFile ' + fn + ' :-: encoded ' + fn);
            trjs.io.serverLoadMedia(fn);
        } else
            alert('media' + f);
    }
};

/*
 * cette fonction est lancée au chargement de la page transcriberjs.html
 */
filetree.init = function () {
    $(window).resize(function () {
        var h = Math.max(($(window).height() - 0) * 0.5, 320);
        $('#container, #data, #tree').height(h); //.filter('.default').css('lineHeight', h + 'px');
    }).resize();
    // filetree.load();
};

filetree.load = function () {
    // $('#container').html('<div id="tree"></div><div id="data"><div class="content default" style="text-align:left;">Select a file from the tree.</div></div>');
    // $('#tree').html('');
    // finds the last location called: it is in trjs.param.lastDataLocation
    if (trjs.param.lastDataLocation) {
        // console.log('previous location: ' + trjs.param.lastDataLocation);
        var dirs = toLowerCaseSystem(trjs.param.lastDataLocation).split(/[\\\/]/);
        // console.log(dirs);
        filetree.getNode('#', undefined, function () {
            if (trjs.utils.isWindows())
                var current = dirs[0] + '/';
            else
                var current = '/';
            var tree = $('#tree');
            var js = tree.tree('toJson');
            // console.log(dirs);
            // console.log(js);
            var ptr = tree.tree('getNodeById', current);
            filetree.getNode(current, ptr, function () {
                var addNewDir = function (current, nth) {
                    if (nth >= dirs.length) {
                        filetree.getFolder(filetree.selectedPath);
                        return;
                    } else {
                        current += '/' + dirs[nth];
                        // console.log(current);
                        var ptr = tree.tree('getNodeById', current);
                        if (ptr)
                            filetree.getNode(current, ptr, function () {
                                addNewDir(current, nth + 1);
                            });
                    }
                };
                addNewDir((trjs.utils.isWindows()) ? dirs[0] : '', 1);
            });
        });
    } else
        filetree.getNode('#');
};

var servercmd = 'filelookup.js'; // version.serverCommand('filelookup'); // select name of command according to server type

filetree.getFolder = function (fn, callback) {
    // console.log('getfolder' + fn);
    filetree.setfocuschoicePrev = undefined;
    $.get(servercmd + '?operation=get_folder', {'id': fn})
        .done(function (d) {
            var htmltext = '';
            var n = 0;
            // console.log(d);
            for (var i in d) {
                // console.log(i + ' ' + d[i]);
                d[i] = d[i].replace(/\\/g, '/');
                if (filetree.testChooseFile(d[i])) {
                    n++;
                    htmltext += '<span class="filechoice">' + filetree.chooseIconFile(d[i]) + ' ' + trjs.utils.lastName(d[i]) + '</span><br/>';
                }
            }
            if (n < 1) {
                var msg;
                if (filetree.typeChooseFile === 'transcript')
                    msg = trjs.messgs.ftnotrsf;
                else if (filetree.typeChooseFile === 'media' || filetree.typeChooseFile === 'mediaload' || filetree.typeChooseFile === 'mediaconvert' || filetree.typeChooseFile === 'medianew')
                    msg = trjs.messgs.ftnomedf;
                else
                    msg = trjs.messgs.ftnof;
                $('#data .default').html(msg).show();
                return;
            }
            $('#data .default').html(htmltext).show();
            $('#data .default .filechoice').click(filetree.setfocuschoice).css('cursor', 'pointer').dblclick(filetree.setchoice).keydown(filetree.keyboard);
            if (callback) callback(0, 'ok');
        })
        .fail(function () {
            // data.instance.refresh();
            console.log('getFolder fail');
            if (callback) callback(1, "fail");
        });
};

filetree.getNode = function (fn, ptr, callback) {
    // console.log('getnode ' + fn);
    $.get(servercmd + '?operation=get_node', {'id': fn})
        .done(function (d) {
            // add d to the tree at ptr
            if (ptr === undefined) { // this is the first call: all the data is initialized
                var t = $('#tree');
                if (t.children().length > 0) {
                    //console.log("déja rempli");
                    t.tree('loadData', d);
                } else {
                    //console.log('tree vide');
                    t.tree({
                        data: d,
                        selectable: true,
                        closedIcon: $('<i class="fa fa-folder-o"></i>'),
                        openedIcon: $('<i class="fa fa-folder-open-o"></i>'),
                        onCanSelectNode: function (node) {
                            // all nodes are updated even if opened before
                            displayTitleBox(node.id);
                            $.get(servercmd + '?operation=get_node', {'id': node.id})
                                .done(function (data) {
                                    // console.log(data);
                                    $('#tree').tree('loadData', data, node);
                                    filetree.selectedPath = node.id;
                                    filetree.getFolder(node.id);
                                });
                            return;
                        },
                        onCreateLi: function (node, $li) {
                            // '<div class="jqtree-element jqtree_common"><span class="jqtree-title jqtree_common">Home</span></div>'
                            // Add an icom to the begining of the label
                            if (node.type === 'home')
                                $li.find('.jqtree-title').append(' <i class="fa fa-home"></i>');
                            else if (node.type === 'desktop')
                                $li.find('.jqtree-title').append(' <i class="fa fa-desktop"></i>');
                            else if (node.type === 'documents')
                                $li.find('.jqtree-title').append(' <i class="fa fa-columns"></i>');
                            else if (node.type === 'computer')
                                $li.find('.jqtree-title').append(' <i class="fa fa-laptop"></i>');
                            else if (node.type === 'volume')
                                $li.find('.jqtree-title').append(' <i class="fa fa-hdd-o"></i>');
                        },
                    });
                    t.bind(
                        'tree.dblclick',
                        function (event) {
                            // event.node is the clicked node
                            // console.log(event.node);
                            var tree = $('#tree');
                            var states = tree.tree('getState');
                            for (var i in states.open_nodes) {
                                //					    if ($.inArray(event.node.id, states.open_nodes))
                                if (states.open_nodes[i] === event.node.id) {
                                    tree.tree('closeNode', event.node);
                                    return;
                                }
                            }
                            tree.tree('openNode', event.node);
                        }
                    );
                    t.keydown(filetree.keyboard); //  onkeydown="filetree.keyboard(event);"
                }
                if (callback) callback(0, 'ok');
            } else {
                $('#tree').tree('loadData', d, ptr);
                $('#tree').tree('openNode', ptr);
                filetree.selectedPath = ptr.id;
                if (callback) callback(0, "ok");
            }
        })
        .fail(function () {
            // data.instance.refresh();
            console.log('getNode fail');
            if (callback) callback(1, "fail");
        });
};
