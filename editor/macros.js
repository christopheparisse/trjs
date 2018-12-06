/**
 * structure containing the macro keys
 */
trjs.macros = {};

/**
 * full macros list table
 */
trjs.macros.table = {
    copyright: { content: "copyright Christophe Parisse (2018) - sponsored by Ortolang/Modyco/DGLFLF", desc: "copyright of software", key: "" }
};

trjs.macros.onblur = function (event) {
    trjs.undo.line.check(event);
    trjs.macros.storeSelectedText();
};

trjs.macros.storeSelectedText = function() {
    var sel, range, textNode;
    if (window.getSelection) {
        // récupérer contenu et position de la ligne sélectionnée en cours
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            trjs.data.range = sel.getRangeAt(0);
        }
    }
}

trjs.macros.insertSelectedText = function(text) {
    var sel, range, textNode;
    if (trjs.data.range && trjs.data.selectedLine) {
        trjs.data.range.deleteContents();
        textNode = document.createTextNode(text);
        trjs.data.range.insertNode(textNode);

        // Move caret to the end of the newly inserted text node
        trjs.data.range.setStart(textNode, textNode.length);
        trjs.data.range.setEnd(textNode, textNode.length);
        //sel.removeAllRanges();
        //sel.addRange(range);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.pasteHTML(text);
    }
}

trjs.macros.replaceSelectedText = function(text) {
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

trjs.macros.formatSelectedText = function(style) {
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
        var selected = $(range.startContainer).text();
        range.pasteHTML(style + selected + style);
    }
}

trjs.macros.parse = function (m) {
    var re;
    var nh;
    var leftEvt = '\\' + trjs.data.leftEvent;
    var rightEvt = '\\' + trjs.data.rightEvent;
    if (m.indexOf(trjs.data.rightEvent) === 0) {
        return {
            type: 'value',
            subtype: '',
            content: m
        };
    } else if (m.length > 5 && m.lastIndexOf('/N'+ trjs.data.rightEvent) === m.length-3) {
        var re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/(.*?)' + '/N' + rightEvt);
        var nh = re.exec(m);
        if (nh) {
            return {
                type: 'noise',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/N' + rightEvt);
            nh = re.exec(m);
            if (nh) {
                return {
                    type: 'noise',
                    subtype: '',
                    content: nh[1]
                };
            } else {
                return {
                    type: 'noise',
                    subtype: 'error',
                    content: m
                };
            }
        }
    } else if (m.length > 5 && m.lastIndexOf('/E'+ trjs.data.rightEvent) === m.length-3) {
        re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/(.*?)' + '/E' + rightEvt);
        nh = re.exec(m);
        if (nh) {
            return {
                type: 'event',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/E' + rightEvt);
            nh = re.exec(m);
            if (nh) {
                return {
                    type: 'event',
                    subtype: '',
                    content: nh[1]
                };
            } else {
                return {
                    type: 'event',
                    subtype: 'error',
                    content: m
                };
            }
        }
    } else if (m.length > 5 && m.lastIndexOf('/COM'+ trjs.data.rightEvent) === m.length-5) {
        var re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/(.*?)' + '/COM' + rightEvt);
        var nh = re.exec(m);
        if (nh) {
            return {
                type: 'comment',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/COM' + rightEvt);
            nh = re.exec(m);
            if (nh) {
                return {
                    type: 'comment',
                    subtype: '',
                    content: nh[1]
                };
            } else {
                return {
                    type: 'comment',
                    subtype: 'error',
                    content: m
                };
            }
        }

    } else if (m.length > 5 && m.lastIndexOf('/VOC'+ trjs.data.rightEvent) === m.length-5) {
        re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/VOC' + rightEvt);
        nh = re.exec(m);
        if (nh) {
            return {
                type: 'vocal',
                subtype: '',
                content: nh[1]
            };
        } else {
            return {
                type: 'vocal',
                subtype: 'error',
                content: m
            };
        }
    } else if (m.length > 5 && m.lastIndexOf('/LX'+ trjs.data.rightEvent) === m.length-4) {
        var re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/(.*?)' + '/LX' + rightEvt);
        var nh = re.exec(m);
        if (nh) {
            return {
                type: 'lexical',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/LX' + rightEvt);
            nh = re.exec(m);
            if (nh) {
                return {
                    type: 'lexical',
                    subtype: '',
                    content: nh[1]
                };
            } else {
                return {
                    type: 'lexical',
                    subtype: 'error',
                    content: m
                };
            }
        }
    } else if (m.length > 5 && m.lastIndexOf('/NE'+ trjs.data.rightEvent) === m.length-4) {
        var re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/(.*?)' + '/NE' + rightEvt);
        var nh = re.exec(m);
        if (nh) {
            return {
                type: 'entities',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(leftEvt + ' ' + '(.*)' + ' ' + '/NE' + rightEvt);
            nh = re.exec(m);
            if (nh) {
                return {
                    type: 'entities',
                    subtype: '',
                    content: nh[1]
                };
            } else {
                return {
                    type: 'entities',
                    subtype: 'error',
                    content: m
                };
            }
        }
    } else if (m.length > 5 && m.lastIndexOf('/LG'+ trjs.data.rightEvent) === m.length-4) {
        var re = new RegExp(leftEvt + ' ' + '/(.*?)' + '/LG' + rightEvt);
        var nh = re.exec(m);
        if (nh) {
            return {
                type: 'language',
                subtype: nh[1],
                content: ''
            };
        } else {
            return {
                type: 'language',
                subtype: 'error',
                content: m
            };
        }
    } else if (m === '#') {
        return {
            type: 'shortpause',
            subtype: '',
            content: ''
        };
    } else if (m === '##') {
        return {
            type: 'middlepause',
            subtype: '',
            content: ''
        };
    } else if (m === '###') {
        return {
            type: 'longpause',
            subtype: '',
            content: ''
        };
    } else if (m.indexOf('#') === 0 && m.lastIndexOf('#') === m.length-1) {
        return {
            type: 'verylongpause',
            subtype: '',
            content: m.substr(1,m.length-2)
        };
    } else {
        if (m.length > 5 && m.lastIndexOf('/LG:') > 0) {
            // LG:val
            var re = new RegExp(leftEvt + ' ' + '/(.*)/LG:(.*)' + rightEvt);
            var nh = re.exec(m);
            if (nh) {
                return {
                    type: 'language',
                    subtype: nh[1],
                    content: nh[2]
                };
            } else {
                var re = new RegExp(leftEvt + ' ' + '/LG:(.*)' + rightEvt);
                var nh = re.exec(m);
                if (nh) {
                    return {
                        type: 'language',
                        subtype: '',
                        content: nh[1]
                    };
                } else {
                    return {
                        type: 'language',
                        subtype: 'LG:',
                        content: m
                    };
                }
            }
        } else {
            return {
                type: 'value',
                subtype: '',
                content: m
            };
        }
    }
};

trjs.macros.form = function () {
    var t = $('#event-type').val();
    var s = $('#event-subtype').val();
    var c = $('#event-content').val();
    if (!t) t = '';
    if (!s) s = '';
    if (!c) c = '';
    // console.log(t,s,c);
    if (trjs.param.format === 'CHAT') {
        switch(t) {
            case 'value':
                return c;
            case 'interposedword':
                return '&*' + c + (s?':'+s:'');
            case 'complexlocalevents':
                return trjs.data.leftEvent + '^ ' + c + trjs.data.rightEvent;
            case 'shortpause':
                return '(.)';
            case 'middlepause':
                return '(..)';
            case 'longpause':
                return '(...)';
            case 'verylongpause':
                return '(' + c + ')';
            case 'longevent':
                return '&{l=* ' + c + ' &}l=*';
            case 'longnonverbalevent':
                return '&{n=* ' + c + ' &}n=*';
            case 'trailingoff':
                return '+...';
            case 'interruption':
                return '+/.';
            case 'quotationfollows':
                return '+"/.';
            case 'quotationprecedes':
                return '+".';
            case 'selfcompletion':
                return '+,';
            case 'othercompletion':
                return '++';
            case 'stressing':
                return '[!]';
            case 'contrastivestressing':
                return '[!!]';
            case 'bestguess':
                return '[?]';
            case 'overlapfollows':
                return '[>]';
            case 'overlapprecedes':
                return '[<]';
            case 'lazyoverlap':
                return '+<';
            case 'repetition':
                return '[/]';
            case 'retracing':
                return '[//]';
            case 'reformulation':
                return '[///]';
            case 'paralinguitic':
                return trjs.data.leftEvent + '=! ' + c + ' ' + s + trjs.data.rightEvent;
            case 'explanation':
                return trjs.data.leftEvent + '= ' + c + ' ' + s + trjs.data.rightEvent;
            case 'duration':
                return trjs.data.leftEvent + '# ' + c + ' ' + s + trjs.data.rightEvent;
            case 'replacement':
                return trjs.data.leftEvent + ': ' + c + ' ' + s + trjs.data.rightEvent;
            case 'replacementrealword':
                return trjs.data.leftEvent + ':: ' + c + ' ' + s + trjs.data.rightEvent;
            case 'alternative':
                return trjs.data.leftEvent + '=? ' + c + ' ' + s + trjs.data.rightEvent;
            case 'comment':
                return trjs.data.leftEvent + '% ' + c + ' ' + s + trjs.data.rightEvent;
            default:
                return f+s+c;
        }
    } else {
        switch(t) {
            case 'value':
                return c;
            case 'noise':
                return trjs.data.leftEvent + ' ' + c + ' ' + (s?'/'+s:'') + '/N' + trjs.data.rightEvent;
            case 'event':
                return trjs.data.leftEvent + ' ' + c + ' ' + (s?'/'+s:'') + '/PE' + trjs.data.rightEvent;
            case 'language':
                return trjs.data.leftCode + ' ' + (s?'/'+s:'') + '/LG' + (c?':'+c:'') + trjs.data.rightCode;
            case 'comment':
                return trjs.data.leftEvent + ' ' + c + ' ' + (s?'/'+s:'') + '/COM' + trjs.data.rightEvent;
            case 'vocal':
                return trjs.data.leftCode + ' ' + (s?'/'+s:'') + ' /VOC' + trjs.data.rightCode;
            case 'abbr':
                return trjs.data.leftCode + ' ' + c + '/' + s + ' /A' + trjs.data.rightCode;
            case 'var':
                return trjs.data.leftCode + ' ' + c + '/' + s + ' /VAR' + trjs.data.rightCode;
            case 'shortpause':
                return '#';
            case 'middlepause':
                return '##';
            case 'longpause':
                return '###';
            case 'verylongpause':
                return '#' + c + '#';
            case 'lexical':
                return trjs.data.leftCode + ' ' + c + ' ' + (s?'/'+s:'') + '/LEX' + trjs.data.rightCode;
            case 'entities':
                return trjs.data.leftCode + ' ' + c + ' ' + (s?'/'+s:'') + '/NE' + trjs.data.rightCode;
            default:
                return f+s+c;
        }
    }
};

trjs.macros.desc = function(k) {
    return (trjs.macros.table[k])
        ? trjs.macros.table[k].desc
        : "";
};

trjs.macros.key = function(k) {
    return (trjs.macros.table[k])
        ? trjs.macros.table[k].key
        : "";
};

trjs.macros.content = function(k) {
    return (trjs.macros.table[k])
        ? trjs.macros.table[k].content
        : "";
};

trjs.macros.macrofunction = function(k) {
    return function() {
        if (trjs.macros.table[k]) {
            trjs.macros.replaceSelectedText(trjs.macros.table[k].content);
            return true;
        }
        return false;
    }
};

trjs.macros.generic = function () {
    var s = '';
    s += '<option value="newmacro">' + trjs.messgs.newmacro + '</option>';
    for (var k in trjs.macros.table) {
        s += '<option value="' + k + '">' + k + '</option>';
    }
    $('#accessmacro').html(s);
    trjs.keys.initKeyChanging(); // get ready to define new key associations
    // add an empty
    if (!trjs.keys.keyChanging['__editedmacrokey__']) {
        var kc = {
            fun: "",
            key: "",
            ctrl: false,
            alt: false,
            shift: false,
            supl: "",
            changed: false
        };
        trjs.keys.keyChanging['__editedmacrokey__'] = kc;
    } else {
        trjs.keys.keyChanging['__editedmacrokey__'].key = "";
        trjs.keys.keyChanging['__editedmacrokey__'].ctrl = false;
        trjs.keys.keyChanging['__editedmacrokey__'].alt = false;
        trjs.keys.keyChanging['__editedmacrokey__'].shift = false;
        trjs.keys.keyChanging['__editedmacrokey__'].ctrl = false;
        trjs.keys.keyChanging['__editedmacrokey__'].changed = false;
        trjs.keys.keyChanging['__editedmacrokey__'].sup = "";
    }

    if (trjs.param.format === 'CHAT') {
        s = '<option value="value">Any value</option>'
            + '<option value="interposedword">Interposed word</option>'
            + '<option value="complexlocalevents">Complex Local Events</option>'
            + '<option value="shortpause">Short pause</option>'
            + '<option value="middlepause">Middle pause</option>'
            + '<option value="longpause">Long pause</option>'
            + '<option value="verylongpause">Very long pause</option>'
            + '<option value="longevent">Long event</option>'
            + '<option value="longnonverbalevent">Long nonverbal event</option>'
            + '<option value="trailingoff">Trailing off</option>'
            + '<option value="interruption">Interruption</option>'
            + '<option value="quotationfollows">Quotation follows</option>'
            + '<option value="quotationprecedes">Quotation precedes</option>'
            + '<option value="selfcompletion">Self completion</option>'
            + '<option value="othercompletion">Other completion</option>'
            + '<option value="paralinguitic">Paralinguistic</option>'
            + '<option value="explanation">Explanation</option>'
            + '<option value="stressing">Stressing</option>'
            + '<option value="contrastivestressing">Contrastive stressing</option>'
            + '<option value="duration">Duration</option>'
            + '<option value="replacement">Replacement</option>'
            + '<option value="replacementrealword">Replacement real word</option>'
            + '<option value="alternative">Alternative transcription</option>'
            + '<option value="comment">Comment</option>'
            + '<option value="bestguess">Best guess</option>'
            + '<option value="overlapfollows">Overlap follows</option>'
            + '<option value="overlapprecedes">Overlap precedes</option>'
            + '<option value="lazyoverlap">Lazy Overlap</option>'
            + '<option value="repetition">Repetition</option>'
            + '<option value="retracing">Retracing</option>'
            + '<option value="reformulation">Reformulation</option>';
    } else {
        s = '<option value="value">Any value</option>'
            + '<option value="noise">Noise</option>'
            + '<option value="event">Event</option>'
            + '<option value="abbr">Abbreviation</option>'
            + '<option value="var">Variant</option>'
            + '<option value="language">Language</option>'
            + '<option value="comment">Comment</option>'
            + '<option value="vocal">Vocal</option>'
            + '<option value="shortpause">Short pause</option>'
            + '<option value="middlepause">Middle pause</option>'
            + '<option value="longpause">Long pause</option>'
            + '<option value="verylongpause">Very long pause</option>'
            + '<option value="lexical">Lexical</option>'
            + '<option value="entities">Entities</option>';
    }

    $('#event-type').html(s);
    $('#insertmacro').modal();
};

/**
 * use macroname to locate and load a macro
 * should ckeck if the present edited macro was saved if it was modified
 */
trjs.macros.find = function () {
    var k = $('#accessmacro').val();
    if (k === 'newmacro' || !trjs.macros.table[k]) {
        $('#event-type').val('value');
        $('#event-subtype').val('');
        $('#event-content').val('');
    } else {
        var p = trjs.macros.parse(trjs.macros.content(k));
        $('#event-type').val(p.type);
        $('#event-subtype').val(p.subtype);
        $('#event-content').val(p.content);
        $('#macroname').val("");
        $('#macrodesc').val(trjs.macros.desc(k));
        // find k in bindingsUser and update it if necessary
        var s = trjs.macros.key(k);
        for (var i in trjs.bindingsUser) {
            if (trjs.bindingsUser[i][BINDFUN] === k) {
                // BINDKEY BINDCTRL BINDALT BINDSHIFT BINDMETA BINDSUPL BINDFUN
                s = modifiersToString(
                    trjs.bindingsUser[i][BINDCTRL],
                    trjs.bindingsUser[i][BINDALT],
                    trjs.bindingsUser[i][BINDSHIFT],
                    trjs.bindingsUser[i][BINDCTRL],
                    trjs.bindingsUser[i][BINDSUPL])
                    + '/' + trjs.keyToName[trjs.bindingsUser[i][BINDKEY]].toUpperCase();
            }
        }
        $('#vkeyshortcut').text(s);
    }
};

/**
 * save the macro which is currently edited
 */
trjs.macros.save = function () {
    var s = trjs.macros.form();
    var n = $('#macroname').val();
    var d = $('#macrodesc').val();
    var a = $('#accessmacro').val();
    var k = $('#vkeyshortcut').text();
    // four thing to do
    // save the macros
    // create a function for the new macro or replace function for the old one
    // add keyChanging __editedmacrokey__ to bindingUser unless it exists then modify it
    var cm = (a === 'newmacro') ? n : a; // cm is the name of the actual macro processed - new or old
    trjs.macros.table[cm] = { content: s, desc: d, key: k };
    trjs.macros.saveTable();
    trjs.keys.functions[cm] = [ trjs.macros.macrofunction(cm), d, s];
    // functions do not need to be saved - they are reconstructed automatically
    if (trjs.keys.updated) {
        var foundInBindings = false;
        for (var k in trjs.bindingsUser) {
            if (trjs.bindingsUser[k][BINDFUN] === cm) {
                // update
                console.log("update kb:", trjs.bindingsUser[k], trjs.keys.keyChanging['__editedmacrokey__']);
                console.log("ukb2:", trjs.keys.nameToKey[trjs.keys.keyChanging['__editedmacrokey__'].key]);
                foundInBindings = true;
                // BINDKEY BINDCTRL BINDALT BINDSHIFT BINDMETA BINDSUPL BINDFUN
                trjs.bindingsUser[k][BINDKEY] = Number(trjs.keys.nameToKey[trjs.keys.keyChanging['__editedmacrokey__'].key]);
                trjs.bindingsUser[k][BINDCTRL] = trjs.keys.keyChanging['__editedmacrokey__'].ctrl;
                trjs.bindingsUser[k][BINDALT] = trjs.keys.keyChanging['__editedmacrokey__'].alt;
                trjs.bindingsUser[k][BINDSHIFT] = trjs.keys.keyChanging['__editedmacrokey__'].shift;
                trjs.bindingsUser[k][BINDMETA] = trjs.keys.keyChanging['__editedmacrokey__'].ctrl;
                trjs.bindingsUser[k][BINDSUPL] = trjs.keys.keyChanging['__editedmacrokey__'].supl;
                break;
            }
        }
        if (foundInBindings !== true) {
            trjs.bindingsUser.push([
                // BINDKEY BINDCTRL BINDALT BINDSHIFT BINDMETA BINDSUPL BINDFUN
                Number(trjs.keys.nameToKey[trjs.keys.keyChanging['__editedmacrokey__'].key]),
                trjs.keys.keyChanging['__editedmacrokey__'].ctrl,
                trjs.keys.keyChanging['__editedmacrokey__'].alt,
                trjs.keys.keyChanging['__editedmacrokey__'].shift,
                trjs.keys.keyChanging['__editedmacrokey__'].ctrl,
                trjs.keys.keyChanging['__editedmacrokey__'].supl,
                cm
            ]);
        }
        // regenerate the actual bindings to trjs.tablekeys
        trjs.keys.initTablekeys();
        trjs.keys.saveUserBindings();
    }
};

trjs.macros.insert = function () {
    var s = trjs.macros.form();
    trjs.macros.insertSelectedText(s);
};

trjs.macros.saveTable = function() {
    var d = JSON.stringify(trjs.macros.table);
    trjs.local.put('macros', d);
};

trjs.macros.loadTable = function() {
    var s = trjs.local.get('macros');
    if (s)
        trjs.macros.table = JSON.parse(s);
};

trjs.macros.selectShortcut = function() {
    var k = $('#accessmacro').val();
    if (k === "newname")
        k = $('#macroname').val();
    trjs.keys.keyChanging["__editedmacrokey__"] = { fun: k, key: '', ctrl: false, alt: false, shift: false, supl: '', changed: false };
    trjs.keys.editKey(null, "__editedmacrokey__", function() {
        if (trjs.keys.keyChanging["__editedmacrokey__"].changed == true) {
            var s = trjs.keys.printkey(trjs.keys.keyChanging["__editedmacrokey__"]);
            $('#vkeyshortcut').text(s);
        }
    });
};
