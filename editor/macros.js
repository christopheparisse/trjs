/**
 * structure containing the macro keys
 */
trjs.macros = {};

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
        range.pasteHTML(style + selected + style);
    }
}

trjs.macros.desc = function (key) {
    return (trjs.macros.table[key][1])
        ? trjs.macros.table[key][1]
        : "";
};

trjs.macros.content = function (key) {
    return (trjs.macros.table[key][0])
        ? trjs.macros.table[key][0]
        : "";
};

trjs.macros.macro0 = function () {
    if (trjs.macros.table[0][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[0][0]);
        return true;
    }
    return false;
};

trjs.macros.macro1 = function () {
    if (trjs.macros.table[1][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[1][0]);
        return true;
    }
    return false;
};

trjs.macros.macro2 = function () {
    if (trjs.macros.table[2][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[2][0]);
        return true;
    }
    return false;
};

trjs.macros.macro3 = function () {
    if (trjs.macros.table[3][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[3][0]);
        return true;
    }
    return false;
};

trjs.macros.macro4 = function () {
    if (trjs.macros.table[4][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[4][0]);
        return true;
    }
    return false;
};

trjs.macros.macro5 = function () {
    if (trjs.macros.table[5][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[5][0]);
        return true;
    }
    return false;
};

trjs.macros.macro6 = function () {
    if (trjs.macros.table[6][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[6][0]);
        return true;
    }
    return false;
};

trjs.macros.macro7 = function () {
    if (trjs.macros.table[7][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[7][0]);
        return true;
    }
    return false;
};

trjs.macros.macro8 = function () {
    if (trjs.macros.table[8][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[8][0]);
        return true;
    }
    return false;
};

trjs.macros.macro9 = function () {
    if (trjs.macros.table[9][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[9][0]);
        return true;
    }
    return false;
};

trjs.macros.macro10 = function () {
    if (trjs.macros.table[10][0]) {
        trjs.macros.replaceSelectedText(trjs.macros.table[10][0]);
        return true;
    }
    return false;
};

trjs.macros.macrofunction = function (key) {
    switch (key) {
        case 0:
            return trjs.macros.macro0;
        case 1:
            return trjs.macros.macro1;
        case 2:
            return trjs.macros.macro2;
        case 3:
            return trjs.macros.macro3;
        case 4:
            return trjs.macros.macro4;
        case 5:
            return trjs.macros.macro5;
        case 6:
            return trjs.macros.macro6;
        case 7:
            return trjs.macros.macro7;
        case 8:
            return trjs.macros.macro8;
        case 9:
            return trjs.macros.macro9;
        case 10:
            return trjs.macros.macro10;
    }
    return undefined;
};

trjs.macros.generic = function () {
    $("#insertmacro").modal();
    trjs.macros.choice();
};

var __mapkeymacro = [
    'Ctrl F2',
    'Ctrl F3',
    'Ctrl F4',
    'Ctrl F5',
    'Ctrl F6',
    'Ctrl F7',
    'Ctrl F8',
    'Ctrl F9',
    'Ctrl F10',
    'Ctrl F11',
    'Ctrl F12',
];

trjs.macros.parse = function (m) {
    var re;
    var nh;
    if (m.indexOf(trjs.data.rightEvent) === 0) {
        return {
            type: 'value',
            subtype: '',
            content: m
        };
    } else if (m.length > 5 && m.lastIndexOf('/N'+ trjs.data.rightEvent) === m.length-3) {
        var re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/N' + trjs.data.rightEvent);
        var nh = re.exec(m);
        if (nh) {
            return {
                type: 'noise',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/N' + trjs.data.rightEvent);
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
        re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/E' + trjs.data.rightEvent);
        nh = re.exec(m);
        if (nh) {
            return {
                type: 'event',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/E' + trjs.data.rightEvent);
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
        var re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/COM' + trjs.data.rightEvent);
        var nh = re.exec(m);
        if (nh) {
            return {
                type: 'comment',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/COM' + trjs.data.rightEvent);
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
        re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/VOC' + trjs.data.rightEvent);
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
        var re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/LX' + trjs.data.rightEvent);
        var nh = re.exec(m);
        if (nh) {
            return {
                type: 'lexical',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/LX' + trjs.data.rightEvent);
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
        var re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/NE' + trjs.data.rightEvent);
        var nh = re.exec(m);
        if (nh) {
            return {
                type: 'entities',
                subtype: nh[2],
                content: nh[1]
            };
        } else {
            re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/NE' + trjs.data.rightEvent);
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
        var re = new RegExp(trjs.data.leftEvent + ' ' + '/(.*?)' + '/LG' + trjs.data.rightEvent);
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
            var re = new RegExp(trjs.data.leftEvent + ' ' + '/(.*)/LG:(.*)' + trjs.data.rightEvent);
            var nh = re.exec(m);
            if (nh) {
                return {
                    type: 'language',
                    subtype: nh[1],
                    content: nh[2]
                };
            } else {
                var re = new RegExp(trjs.data.leftEvent + ' ' + '/LG:(.*)' + trjs.data.rightEvent);
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

trjs.macros.choice = function () {
    var k = parseInt($('#keyshortcut').val());
    if (trjs.macros.table[k] && trjs.macros.table[k][0]) {
        var p = trjs.macros.parse(trjs.macros.table[k][0]);
        $('#event-type').val(p.type);
        $('#event-subtype').val(p.subtype);
        $('#event-content').val(p.content);
        /*
         var re;
         var nh;
         var m = trjs.macros.table[k][0];
         if (m.indexOf(trjs.data.rightEvent) === 0) {
         $('#event-type').val('value');
         $('#event-subtype').val('');
         $('#event-content').val(m);
         } else if (m.length > 5 && m.lastIndexOf('/N'+ trjs.data.rightEvent) === m.length-3) {
         $('#event-type').val('noise');
         var re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/N' + trjs.data.rightEvent);
         var nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val(nh[2]);
         $('#event-content').val(nh[1]);
         } else {
         re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/N' + trjs.data.rightEvent);
         nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val('');
         $('#event-content').val(nh[1]);
         } else {
         $('#event-subtype').val('error');
         $('#event-content').val(m);
         }
         }
         } else if (m.length > 5 && m.lastIndexOf('/E'+ trjs.data.rightEvent) === m.length-3) {
         $('#event-type').val('event');
         re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/E' + trjs.data.rightEvent);
         nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val(nh[2]);
         $('#event-content').val(nh[1]);
         } else {
         re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/E' + trjs.data.rightEvent);
         nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val('');
         $('#event-content').val(nh[1]);
         } else {
         $('#event-subtype').val('error');
         $('#event-content').val(m);
         }
         }
         } else if (m.length > 5 && m.lastIndexOf('/COM'+ trjs.data.rightEvent) === m.length-5) {
         $('#event-type').val('comment');
         var re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/COM' + trjs.data.rightEvent);
         var nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val(nh[2]);
         $('#event-content').val(nh[1]);
         } else {
         re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/COM' + trjs.data.rightEvent);
         nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val('');
         $('#event-content').val(nh[1]);
         } else {
         $('#event-subtype').val('error');
         $('#event-content').val(m);
         }
         }

         } else if (m.length > 5 && m.lastIndexOf('/VOC'+ trjs.data.rightEvent) === m.length-5) {
         $('#event-type').val('vocal');
         re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/VOC' + trjs.data.rightEvent);
         nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val('');
         $('#event-content').val(nh[1]);
         } else {
         $('#event-subtype').val('error');
         $('#event-content').val(m);
         }
         } else if (m.length > 5 && m.lastIndexOf('/LX'+ trjs.data.rightEvent) === m.length-4) {
         $('#event-type').val('lexical');
         var re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/LX' + trjs.data.rightEvent);
         var nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val(nh[2]);
         $('#event-content').val(nh[1]);
         } else {
         re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/LX' + trjs.data.rightEvent);
         nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val('');
         $('#event-content').val(nh[1]);
         } else {
         $('#event-subtype').val('error');
         $('#event-content').val(m);
         }
         }
         } else if (m.length > 5 && m.lastIndexOf('/NE'+ trjs.data.rightEvent) === m.length-4) {
         $('#event-type').val('entities');
         var re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/(.*?)' + '/NE' + trjs.data.rightEvent);
         var nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val(nh[2]);
         $('#event-content').val(nh[1]);
         } else {
         re = new RegExp(trjs.data.leftEvent + ' ' + '(.*)' + ' ' + '/NE' + trjs.data.rightEvent);
         nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val('');
         $('#event-content').val(nh[1]);
         } else {
         $('#event-subtype').val('error');
         $('#event-content').val(m);
         }
         }
         } else if (m.length > 5 && m.lastIndexOf('/LG'+ trjs.data.rightEvent) === m.length-4) {
         $('#event-type').val('language');
         var re = new RegExp(trjs.data.leftEvent + ' ' + '/(.*?)' + '/LG' + trjs.data.rightEvent);
         var nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val(nh[1]);
         $('#event-content').val('');
         } else {
         $('#event-subtype').val('');
         $('#event-content').val(m);
         }
         } else if (m === '#') {
         $('#event-type').val('shortpause');
         $('#event-subtype').val('');
         $('#event-content').val('');
         } else if (m === '##') {
         $('#event-type').val('middlepause');
         $('#event-subtype').val('');
         $('#event-content').val('');
         } else if (m === '###') {
         $('#event-type').val('longpause');
         $('#event-subtype').val('');
         $('#event-content').val('');
         } else if (m.indexOf('#') === 0 && m.lastIndexOf('#') === m.length-1) {
         $('#event-type').val('verylongpause');
         $('#event-subtype').val('');
         $('#event-content').val(m.substr(1,m.length-2));
         } else {
         if (m.length > 5 && m.lastIndexOf('/LG:') > 0) {
         // LG:val
         $('#event-type').val('language');
         var re = new RegExp(trjs.data.leftEvent + ' ' + '/(.*)/LG:(.*)' + trjs.data.rightEvent);
         var nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val(nh[1]);
         $('#event-content').val(nh[2]);
         } else {
         var re = new RegExp(trjs.data.leftEvent + ' ' + '/LG:(.*)' + trjs.data.rightEvent);
         var nh = re.exec(m);
         if (nh) {
         $('#event-subtype').val('');
         $('#event-content').val(nh[1]);
         } else {
         $('#event-subtype').val('LG:');
         $('#event-content').val(m);
         }
         }
         } else {
         $('#event-type').val('value');
         $('#event-subtype').val('');
         $('#event-content').val(m);
         }
         }
         */
    } else {
        $('#event-type').val('value');
        $('#event-subtype').val('');
        $('#event-content').val('');
    }
};

trjs.macros.form = function () {
    var t = $('#event-type').val();
    var s = $('#event-subtype').val();
    var c = $('#event-content').val();
    console.log(t,s,c);
    var f = '';
    switch(t) {
        case 'value':
            return c;
        case 'noise':
            return trjs.data.leftEvent + ' ' + c + ' ' + (s?'/'+s:'') + '/N' + trjs.data.rightEvent;
        case 'event':
            return trjs.data.leftEvent + ' ' + c + ' ' + (s?'/'+s:'') + '/E' + trjs.data.rightEvent;
        case 'language':
            return trjs.data.leftEvent + ' ' + (s?'/'+s:'') + '/LG' + (c?':'+c:'') + trjs.data.rightEvent;
        case 'comment':
            return trjs.data.leftEvent + ' ' + c + ' ' + (s?'/'+s:'') + '/COM' + trjs.data.rightEvent;
        case 'vocal':
            return trjs.data.leftEvent + ' ' + c + ' /VOC' + trjs.data.rightEvent;
        case 'shortpause':
            return '#';
        case 'middlepause':
            return '##';
        case 'longpause':
            return '###';
        case 'verylongpause':
            return '#' + c + '#';
        case 'lexical':
            return trjs.data.leftEvent + ' ' + c + ' ' + (s?'/'+s:'') + '/LX' + trjs.data.rightEvent;
        case 'entities':
            return trjs.data.leftEvent + ' ' + c + ' ' + (s?'/'+s:'') + '/NE' + trjs.data.rightEvent;
    }
    return f;
};

trjs.macros.save = function () {
    var s = trjs.macros.form();
    var k = parseInt($('#keyshortcut').val());
    trjs.macros.table[k] = [s, "macro " + __mapkeymacro[k]];
    trjs.keys.insertBinding( [ 113+k, true, false, false, 'ctrl', trjs.macros.macrofunction(k), trjs.macros.desc(k) ] ); // Ctrl F(2+i)
    trjs.macros.saveTable();
};

trjs.macros.insert = function () {
    var s = trjs.macros.form();
    trjs.macros.insertSelectedText(s);
};

/**
 * full macros list table
 */
trjs.macros.table = [
    ["copyright Christophe Parisse (2016) - sponsored by Ortolang/Modyco/DGLFLF", "copyright of software"],
];

trjs.macros.saveTable = function() {
    // Ctrl F2 === 113 et Ctrl F12 = 123
    for (var i=0; i<11; i++) {
        if (trjs.macros.table[i] && trjs.macros.table[i][0]) {
            trjs.local.put('macros'+i, trjs.macros.table[i][0]);
        }
    }
};

trjs.macros.loadTable = function() {
    // Ctrl F2 === 113 et Ctrl F12 = 123
    for (var i=0; i<11; i++) {
        var s = trjs.local.get('macros'+i);
        if (s)
            trjs.macros.table[i] = [ s, "macro " + __mapkeymacro[i] ];
    }
};
