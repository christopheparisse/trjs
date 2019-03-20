/**
 * table and bindings for hadlings the keyboard interface.
 * one table (trjs.bindingsDef) contains the initial and default bindings that are matched to the software actions
 * one table (trjs.bindingsUser) contains the bindings that are a copy of the default and can be changed dynamically by the user
 * one table (trjs.tablekeys) contains the actual bindings that fire events (injected from trjs.bindingsUser
 * trjs.tablekeys contains the routing table: each cell of the object contains a pointer to the corresponding function.
 * each cell position correspond to the charcode or keycode plus a modifier computed to the KEYS above.
 * trjs.tablekeys is computed automatically according to the bindings defined in the trjs.tablebindings defined by the user
 * or by the default program
 * supplementary bindings can be added to handle the API keys and F1/F2 keys.
 * API and F1/F2 keys bindings are first added to the trjs.bindingsDef table and then transmitted to trjs.bindingsUser
 * @author Christophe Parisse & Clémentine Gross
 * Date: july 2014
 * @module tablekeyboard
 * @author
 */

function modifiersToString(ctrl, alt, shift, meta, supl) {
    var s = '';
    var s1 = false;
    if (supl && supl !== 'api') {
        s += supl + ' + ';
    }
    if (trjs.utils.isMacOS()) {
        if (meta) {
            s += 'Cmd';
            s1 = true;
        }
    } else {
        if (ctrl) {
            s += 'Ctrl';
            s1 = true;
        }
    }
    if (alt) {
        if (s1 === true) s += '/';
        s += 'Alt';
        s1 = true;
    }
    if (shift) {
        if (s1 === true) s += '/';
        s += 'Shift';
    }
    return s;
}

function modifiers2ToString(ctrl, alt, shift, meta, supl) {
    var s = '';
    var s1 = false;
    if (trjs.utils.isMacOS()) {
        if (meta) {
            s += 'Cmd';
            s1 = true;
        }
    } else {
        if (ctrl) {
            s += 'Ctrl';
            s1 = true;
        }
    }
    if (alt) {
        if (s1 === true) s += '/';
        s += 'Alt';
        s1 = true;
    }
    if (shift) {
        if (s1 === true) s += '/';
        s += 'Shift';
    }
    return s;
}

function prefixToString(supl) {
    var s = '';
    if (supl && supl !== 'api') {
        s += supl;
    }
    return s;
}

trjs.keys = {};
trjs.keys.kc = null; // intermediary variable to edit key binding changes
trjs.keys.updated = false; // allow to check if change to the key binding should be changed

trjs.keys.printkey = function(kc) {
    return modifiersToString(kc.ctrl, kc.alt, kc.shift, kc.ctrl, kc.supl) + '/' + kc.key.toUpperCase();
}

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
trjs.keys[4] = trjs.keys.SHIFTKEYS; // !ctrl !alt shift !meta
trjs.keys[3] = trjs.keys.CTRLALTKEYS; // ctrl alt !shift !meta
trjs.keys[5] = trjs.keys.CTRLSHIFTKEYS; // ctrl !alt shift !meta
trjs.keys[6] = trjs.keys.ALTSHIFTKEYS; // !ctrl alt shift !meta
trjs.keys[7] = trjs.keys.CTRLALTSHIFTKEYS; // ctrl alt shift !meta

var BINDKEY = 0;
var BINDCTRL = 1;
var BINDALT = 2;
var BINDSHIFT = 3;
var BINDMETA = 4;
var BINDSUPL = 5;
var BINDFUN = 6;
var NOKEY = 0;

trjs.bindingsDef = [];
trjs.bindingsUser = [];

trjs.keys.skipModifierKey = [];
trjs.tablekeys = {};
trjs.tablekeysSE1 = {};
trjs.tablekeysSE2 = {};

trjs.keys.modifiersFlags = function (charCode, ctrl, alt, shift, meta) {
    var modifiers = ctrl + alt * 2 + shift * 4;
    return charCode + trjs.keys[modifiers];
};

trjs.keys.modifiersEvent = function (charCode, e) {
    var ctrl = e.ctrlKey;
    var meta = e.metaKey;
    if (trjs.param.server === 'electron') {
        if (!e.ctrlKey && e.metaKey) {
            ctrl = true;
            meta = 'ctrl';
        }
    }
    return trjs.keys.modifiersFlags(charCode, ctrl, e.altKey, e.shiftKey, meta);
};

trjs.keys.insertBinding = function (bind, keytable) {
    if (bind[BINDKEY] !== NOKEY) {
        if (!bind[BINDFUN]) {
            console.log('bindings key=' + bind[BINDKEY] + ' ' + modifiersToString(bind[BINDKEY],
                bind[BINDCTRL], bind[BINDALT], bind[BINDSHIFT], bind[BINDMETA], bind[BINDSUPL]) + ' is undefined');
            return;
        }
        if (!trjs.keys.functions[bind[BINDFUN]]) {
            console.log("missing function:", bind[BINDFUN], "for", bind);
            return;
        }
        // console.log(bind, keytable, bind[BINDFUN]);
        if (bind[BINDMETA] === 'ctrl') {
            // extends control to metakey for compatibility between windows/unix and mac
            keytable[trjs.keys.modifiersFlags(bind[BINDKEY], true,
                bind[BINDALT], bind[BINDSHIFT], false)] = trjs.keys.functions[bind[BINDFUN]][0];
        } else {
            // put value directly as it is in the table of codes
            keytable[trjs.keys.modifiersFlags(bind[BINDKEY], bind[BINDCTRL],
                bind[BINDALT], bind[BINDSHIFT], bind[BINDMETA])] = trjs.keys.functions[bind[BINDFUN]][0];
        }
    }
};

trjs.keys.initTablekeys = function() {

    if (trjs.tablekeys !== undefined && trjs.tablekeys !== null) {
        delete trjs.tablekeys;
    }
    trjs.tablekeys = {};
    for (var i = 0; i < trjs.bindingsUser.length; i++) {
        if (trjs.bindingsUser[i][BINDSUPL] && trjs.bindingsUser[i][BINDSUPL] !== "api") continue;
        trjs.keys.insertBinding(trjs.bindingsUser[i], trjs.tablekeys);
    }
    // F1/F2 binding
    if (trjs.tablekeysSE1 !== undefined && trjs.tablekeysSE1 !== null) {
        delete trjs.tablekeysSE1;
    }
    trjs.tablekeysSE1 = {};
    for (var i = 0; i < trjs.bindingsUser.length; i++) {
        if (trjs.bindingsUser[i][BINDSUPL] !== "F1") continue;
        trjs.keys.insertBinding(trjs.bindingsUser[i], trjs.tablekeysSE1);
    }
    if (trjs.tablekeysSE2 !== undefined && trjs.tablekeysSE2 !== null) {
        delete trjs.tablekeysSE2;
    }
    trjs.tablekeysSE2 = {};
    for (var i = 0; i < trjs.bindingsUser.length; i++) {
        if (trjs.bindingsUser[i][BINDSUPL] !== "F2") continue;
        trjs.keys.insertBinding(trjs.bindingsUser[i], trjs.tablekeysSE2);
    }
}

function loadUserBindings() {
//    trjs.bindingsDef.push([nkey("page up"), false, false, false, false, "", "pageUp"]); // Page Up
    var bu = trjs.local.get('bindingsUser');
    if (bu) {
        var v = JSON.parse(bu);
        // tests if TAB is set, otherwise this is strange and it is better to reset the keys.
        for (var i=0; i < v.length; v++) {
            if (v[i][BINDFUN] === "playTab") {
                if (v[i][BINDKEY] === "") {
                    // TAB is not set, so reset all keys
                    trjs.keys.resetKeys();
                    console.log("Tab found not set: reset of keys");
                    return;
                } else {
                    // TAB set this is ok
                    trjs.bindingsUser = v;
                    console.log("init keys was ok");
                    return;
                }
            }
        }
        // TAB was not found at all
        // this should not happen normally
        // but at least we try to reset the normal keys
        trjs.keys.resetKeys();
        console.log("Tab not found: reset of keys");
    } else {
        trjs.keys.resetKeys();
    }
}

trjs.keys.resetKeys = function() {
    trjs.bindingsUser = [];
    // BINDKEY BINDCTRL BINDALT BINDSHIFT BINDMETA BINDSUPL BINDFUN
    for (var i = 0; i < trjs.bindingsDef.length; i++) {
        trjs.bindingsUser.push([ trjs.bindingsDef[i][BINDKEY],
            trjs.bindingsDef[i][BINDCTRL], trjs.bindingsDef[i][BINDALT],
            trjs.bindingsDef[i][BINDSHIFT], (trjs.bindingsDef[i][BINDMETA] === 'ctrl'
                ? true : trjs.bindingsDef[i][BINDMETA]),
            trjs.bindingsDef[i][BINDSUPL], trjs.bindingsDef[i][BINDFUN] ]);
    }
}

trjs.keys.saveUserBindings = function () {
    trjs.keys.updated = false;
    trjs.local.put('bindingsUser', JSON.stringify(trjs.bindingsUser));
    trjs.messgs_init();
}

trjs.keys.init = function () {
    trjs.keys.initNameToKey();
    // generate all initial bindings
    trjs.keys.initBindings();
    trjs.keys.initApiBindings();
    trjs.keys.initF1Bindings();
    trjs.keys.initF2Bindings();
    // load the Macros
    // and they are added to trjs.keys.functions table
    trjs.keys.initMacrosBindings();
    // the macros bindings will go In the user bindings

    // LOAD USER BINDINGS IF THERE EXIST ELSE COPY bindingsDef to bindingsUser
    loadUserBindings();
    // add unbounded functions to the list so that the user can change the bindings
    trjs.keys.noBindings();

    trjs.keys.specialChar1 = trjs.keys.modifiersEvent(nkey("f1"), {
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false
    });
    trjs.keys.specialChar2 = trjs.keys.modifiersEvent(nkey("f2"), {
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false
    });

    trjs.keys.initTablekeys();
    // key that are never used in isolation but only to modify other keys
    trjs.keys.skipModifierKey.push(nkey('shift'));
    trjs.keys.skipModifierKey.push(nkey('ctrl'));
    trjs.keys.skipModifierKey.push(nkey('alt'));
    trjs.keys.skipModifierKey.push(nkey('caps lock'));
//    trjs.keys.skipModifierKey.push(nkey('cmd'));
    trjs.keys.skipModifierKey.push(nkey('left window key'));
    trjs.keys.skipModifierKey.push(nkey('right window key'));
};

trjs.keys.colorRed = function () {
    trjs.macros.formatSelectedText('red');
};

trjs.keys.colorGreen = function () {
    trjs.macros.formatSelectedText('green');
};

trjs.keys.colorBlue = function () {
    trjs.macros.formatSelectedText('blue');
};

trjs.keys.bold = function () {
    trjs.macros.formatSelectedText('b');
};

trjs.keys.italics = function () {
    trjs.macros.formatSelectedText('i');
};

trjs.keys.emphasis = function () {
    trjs.macros.formatSelectedText('em');
};

/**
 * intermediary table to store the potential changes to the keyboard bingings
 * initiated by trjs.keys.initKeyChanging()
 * changes saved by trjs.keys.storeChangeKeys() if trjs.keys.updated === true
 * @type {Array}
 */
trjs.keys.keyChanging = []; // change

trjs.keys.storeChangeKeys = function() {
    for (var i in trjs.keys.keyChanging) {
        //  trjs.keys.keyChanging[i] = { fun: fun, key: key, ctrl: ctrl||meta, alt: alt, shift: shift, supl: supl, changed: false };
        //  trjs.bindingsUser.push([nkey("tab"), false, false, false, false, "", "tab"]); // Tab
        if (i === '__editedmacrokey__' || !trjs.keys.keyChanging[i].changed) continue;
        // console.log("changing", i, trjs.keys.keyChanging[i]);
        for (var k in trjs.bindingsUser) {
            if (trjs.bindingsUser[k][BINDFUN] === trjs.keys.keyChanging[i].fun) {
                //console.log("copy bindings1:", trjs.keys.keyChanging[i]);
                //console.log("copy bindings2:", trjs.keys.nameToKey[trjs.keys.keyChanging[i].key]);
                trjs.bindingsUser[k][BINDKEY] = Number(trjs.keys.nameToKey[trjs.keys.keyChanging[i].key]);
                trjs.bindingsUser[k][BINDCTRL] = trjs.keys.keyChanging[i].ctrl;
                trjs.bindingsUser[k][BINDALT] = trjs.keys.keyChanging[i].alt;
                trjs.bindingsUser[k][BINDSHIFT] = trjs.keys.keyChanging[i].shift;
                trjs.bindingsUser[k][BINDMETA] = trjs.keys.keyChanging[i].ctrl ? 'ctrl' : false;
                trjs.bindingsUser[k][BINDSUPL] = trjs.keys.keyChanging[i].supl;
                //console.log("copy bindings3:", trjs.bindingsUser[k]);
            }
        }
    }
//    console.log("storeChangeKeys", trjs.keys.keyChanging, trjs.bindingsUser);
    // regenerate the actual bindings to trjs.tablekeys
    trjs.keys.initTablekeys();
    trjs.keys.saveUserBindings();
}

trjs.keys.updateKCSupl = function(element)
{
    var idx = element.target.selectedIndex;
    var val = element.target.options[idx].value;
//    console.log(idx, val, trjs.keys.kc, element);
    trjs.keys.kc.supl = val === '--' ? '' : val;
    trjs.keys.kc.changed = true;
//    console.log("supl", trjs.keys.kc);
}
trjs.keys.updateKCCtrl = function(element)
{
    var val = element.target.checked;
    trjs.keys.kc.ctrl = val;
    trjs.keys.kc.meta = val;
    trjs.keys.kc.changed = true;
}
trjs.keys.updateKCAlt = function(element)
{
    var val = element.target.checked;
    trjs.keys.kc.alt = val;
    trjs.keys.kc.changed = true;
}
trjs.keys.updateKCShift = function(element)
{
    var val = element.target.checked;
    trjs.keys.kc.shift = val;
    trjs.keys.kc.changed = true;
}
trjs.keys.updateKCKey = function(element)
{
    var idx = element.target.selectedIndex;
    var val = element.target.options[idx].value;
    trjs.keys.kc.key = trjs.keyToName[val];
    trjs.keys.kc.changed = true;
}

trjs.keys.testKeyAvailable = function(kc, nth) {
    // check if keyChanging has unwanted consequences
    var listOfFun = [];
    nth = String(nth);
    if (kc.key !== trjs.keyToName[NOKEY]) {
        // in this case the previous associated key with the same meaning should tested
        for (var k in trjs.keys.keyChanging) {
            if (!trjs.keys.keyChanging[k]) continue;
            if (k !== nth && trjs.keys.keyChanging[k].key === kc.key
                && trjs.keys.keyChanging[k].ctrl === kc.ctrl
                && trjs.keys.keyChanging[k].alt === kc.alt
                && trjs.keys.keyChanging[k].shift === kc.shift
                //                && trjs.keys.keyChanging[k].meta === kc.meta
                && trjs.keys.keyChanging[k].supl === kc.supl
            ) {
                // this old setting is overridden by the new one
                listOfFun.push(trjs.keys.keyChanging[k].fun);
            }
        }
    } // else the function is only removing a key association
    if (listOfFun.length < 1) {
        trjs.keys.validateKey(kc, nth);
    } else {
        s = "The key association of these functions will be removed: ";
        s += listOfFun.join(" ");
        s += ". Are you ok with this?";
        bootbox.confirm(s,
            function (rep) {
                if (rep !== true)
                    return;
                else {
                    trjs.keys.validateKey(kc, nth);
                    return;
                }
            }
        );
    }
}

trjs.keys.validateKey = function(kc, nth) {
    // store the new state of keyChanging
    trjs.keys.updated = true;
    // signal to the user to save the keys
    var s = document.getElementById('storebChangeKeys');
    if (s) s.style.cssText += 'font-size: larger; border: 5px solid blue; background-color: orange;';
    // if macro editing this is not visible and saving will be done automatically

    nth = String(nth);
    trjs.keys.keyChanging[nth].key = kc.key;
    trjs.keys.keyChanging[nth].changed = true;
    trjs.keys.keyChanging[nth].ctrl = kc.ctrl;
    trjs.keys.keyChanging[nth].alt = kc.alt;
    trjs.keys.keyChanging[nth].shift = kc.shift;
    trjs.keys.keyChanging[nth].meta = kc.meta;
    trjs.keys.keyChanging[nth].supl = kc.supl;

    if (trjs.keys.keyChanging[nth].key !== trjs.keyToName[NOKEY]) {
        // in this case the previous associated key with the same meaning should removed
        for (var k in trjs.keys.keyChanging) {
            // k = Number(k);
            // console.log(k,nth,trjs.keys.keyChanging[k], trjs.keys.keyChanging[nth]);
            if (!trjs.keys.keyChanging[k]) continue;
            if (k !== nth && trjs.keys.keyChanging[k].key === trjs.keys.keyChanging[nth].key
                && trjs.keys.keyChanging[k].ctrl === trjs.keys.keyChanging[nth].ctrl
                && trjs.keys.keyChanging[k].alt === trjs.keys.keyChanging[nth].alt
                && trjs.keys.keyChanging[k].shift === trjs.keys.keyChanging[nth].shift
//                && trjs.keys.keyChanging[k].meta === trjs.keys.keyChanging[nth].meta
                && trjs.keys.keyChanging[k].supl === trjs.keys.keyChanging[nth].supl
                ) {
                // this old setting is overridden by the new one
                trjs.keys.keyChanging[k].key = trjs.keyToName[NOKEY];
                trjs.keys.keyChanging[k].changed = true;
                trjs.keys.keyChanging[k].ctrl = false;
                trjs.keys.keyChanging[k].alt = false;
                trjs.keys.keyChanging[k].shift = false;
                trjs.keys.keyChanging[k].meta = false;
                trjs.keys.keyChanging[k].supl = '';
                //console.log("replace key", k);
            }
        }
    } // else the function is only removing a key association
    trjs.keys.updateKeyBindings();
}

trjs.keys.editKey = function (event, nth, callback) {
    // trjs.keys.keyChanging[nth] = { fun: fun, key: key, ctrl: ctrl||meta, alt: alt, shift: shift, supl: supl, changed: false };
    trjs.keys.kc = trjs.keys.keyChanging[nth]; // the element to edit
    var h = 'Function <span class="chgFunname">' + trjs.keys.kc.fun + '</span> = ';

    h += 'Prefix <select class="chgSuplkey" onchange="trjs.keys.updateKCSupl(event);">';
    h += '<option value="--" ';
    if (trjs.keys.kc.supl === '') h += 'selected="selected" ';
    h += '>--</option>';
    h += '<option value="F1" ';
    if (trjs.keys.kc.supl === 'F1') h += 'selected="selected" ';
    h += '>F1</option>';
    h += '<option value="F2" ';
    if (trjs.keys.kc.supl === 'F2') h += 'selected="selected" ';
    h += '>F2</option>';
    h += '</select>';

    h += '<span class="chgBlock">';
    h += '<input type="checkbox" id="chgCtrlChoice" onchange="trjs.keys.updateKCCtrl(event)" ';
    if (trjs.keys.kc.ctrl) h += 'checked ';
    h += '><label for="chgCtrlChoice">' + (trjs.utils.isMacOS() ? 'CMD' : 'CTRL') + '</label>';
    h += '</span>';

    h += '<span class="chgBlock">';
    h += '<input type="checkbox" id="chgAltChoice" onchange="trjs.keys.updateKCAlt(event)" ';
    if (trjs.keys.kc.alt) h += 'checked ';
    h += '><label for="chgAltChoice">ALT</label>';
    h += '</span>';

    h += '<span class="chgBlock">';
    h += '<input type="checkbox" id="chgShiftChoice" onchange="trjs.keys.updateKCShift(event)" ';
    if (trjs.keys.kc.shift) h += 'checked ';
    h += '><label for="chgShiftChoice">SHIFT</label>';
    h += '</span>';

    h += '<select class="chgKeyname" onchange="trjs.keys.updateKCKey(event);">';
    for (var i in trjs.keyToName) {
        h += '<option value="' + i + '" ';
        if (trjs.keyToName[i] === trjs.keys.kc.key) h += 'selected="selected" ';
        h += '>' + trjs.keyToName[i].toUpperCase() + '</option>';
    }
    h += '</select>';

    bootbox.dialog({
        message: h,
        title: trjs.messgs.editKey,
        buttons: {
            ok: {
                label: trjs.messgs.labelok,
                className: "btn-success",
                callback: function () {
                    // change values of trjs.keys.keyChanging[nth]
                    // trjs.keys.keyChanging[nth] = { fun: fun, key: key, ctrl: ctrl||meta, alt: alt, shift: shift, supl: supl, changed: false };
                    // trjs.keys.validateKey(trjs.keys.kc, nth);
                    trjs.keys.testKeyAvailable(trjs.keys.kc, nth);
                    if (callback) callback();
                }
            },
            cancel: {
                label: trjs.messgs.labelcancel,
                className: "btn-default",
                callback: function () {
                    return;
                }
            },
            /*
            help: {
                label: trjs.messgs.helpInfo,
                className: "btn-default btn-sm",
                callback: function () {
                    return;
                }
            },
            */
        },
    });
}

trjs.keys.initKeyChanging = function () {
    trjs.keys.keyChanging = [];
    trjs.keys.updated = false;
    for (var i in trjs.bindingsUser) {
        // ?? remove bindings to unexistant functions ??
        //  trjs.keys.keyChanging[i] = { fun: fun, key: key, ctrl: ctrl||meta, alt: alt, shift: shift, supl: supl, changed: false };
        var k = trjs.keyToName[trjs.bindingsUser[i][BINDKEY]];
        var kc = {
            fun: trjs.bindingsUser[i][BINDFUN],
            key: k,
            ctrl: trjs.bindingsUser[i][BINDCTRL] || trjs.bindingsUser[i][BINDMETA],
            alt: trjs.bindingsUser[i][BINDALT],
            shift: trjs.bindingsUser[i][BINDSHIFT],
            supl: trjs.bindingsUser[i][BINDSUPL],
            changed: false
        };
        trjs.keys.keyChanging.push(kc);
    }
};

trjs.keys.funToKeyString = function (funame) {
    for (var i in trjs.bindingsUser) {
        if (trjs.bindingsUser[i][BINDFUN] === funame) {
            var k = trjs.keyToName[trjs.bindingsUser[i][BINDKEY]];
            var m = modifiers2ToString(trjs.bindingsUser[i][BINDCTRL] || trjs.bindingsUser[i][BINDMETA],
                trjs.bindingsUser[i][BINDALT],
                trjs.bindingsUser[i][BINDSHIFT],
                trjs.bindingsUser[i][BINDSUPL]);
            var s = trjs.bindingsUser[i][BINDSUPL];
            return s ? (s + ' ' + m + ' ' + k) : (m + ' ' + k);
        }
    }
    return trjs.messgs.nokeyfor + funame;
};

trjs.keys.toHtml = function () {
    var s = '';
    for (var i in trjs.keys.keyChanging) {
        if (trjs.keys.keyChanging[i].supl) continue;
        var k = trjs.keys.keyChanging[i].key;
        if (!k) k = 'Unknown';
        if (trjs.keys.keyChanging[i].key !== "no key" && trjs.keys.functions[trjs.keys.keyChanging[i].fun]) {
            s += '<tr><td>'
                + prefixToString(trjs.keys.keyChanging[i].supl)
                + '</td><td>'
                + modifiers2ToString(trjs.keys.keyChanging[i].ctrl, trjs.keys.keyChanging[i].alt,
                    trjs.keys.keyChanging[i].shift, trjs.keys.keyChanging[i].ctrl)
                + '</td><td>'
                + k.toUpperCase()
                + '</td><td>'
                + trjs.keys.functions[trjs.keys.keyChanging[i].fun][1]
                + '</td></tr>\n';
        }
    }
    return s;
};

trjs.keys.apiToHtml = function () {
    var s = '';
    for (var i in trjs.keys.keyChanging) {
        if (trjs.keys.keyChanging[i].supl !== "api") continue;
        var k = trjs.keys.keyChanging[i].key;
        if (!k) k = 'Unknown';
        if (trjs.keys.keyChanging[i].key !== "no key") {
            s += '<tr><td>'
                + prefixToString(trjs.keys.keyChanging[i].supl)
                + '</td><td>'
                + modifiers2ToString(trjs.keys.keyChanging[i].ctrl, trjs.keys.keyChanging[i].alt,
                    trjs.keys.keyChanging[i].shift, trjs.keys.keyChanging[i].ctrl)
                + '</td><td>'
                + k.toUpperCase()
                + '</td><td>'
                + trjs.keys.functions[trjs.keys.keyChanging[i].fun][2]
                + '</td><td>'
                + trjs.keys.functions[trjs.keys.keyChanging[i].fun][1]
                + '</td></tr>\n';
        }
    }
    return s;
};

trjs.keys.f1f2ToHtml = function () {
    var s = '';
    for (var i in trjs.keys.keyChanging) {
        if (trjs.keys.keyChanging[i].supl !== "F1") continue;
        var k = trjs.keys.keyChanging[i].key;
        if (!k) k = 'Unknown';
        //console.log("F1", trjs.keys.keyChanging[i].fun, trjs.keys.keyChanging[i]);
        if (!trjs.keys.functions[trjs.keys.keyChanging[i].fun]) continue;
        var d = trjs.keys.functions[trjs.keys.keyChanging[i].fun][2];
        if (trjs.keys.keyChanging[i].key !== "no key") {
            s += '<tr><td>'
                + prefixToString(trjs.keys.keyChanging[i].supl)
                + '</td><td>'
                + modifiers2ToString(trjs.keys.keyChanging[i].ctrl, trjs.keys.keyChanging[i].alt,
                    trjs.keys.keyChanging[i].shift, trjs.keys.keyChanging[i].ctrl)
                + '</td><td>'
                + k.toUpperCase()
                + '</td><td>'
                + (d === null ? "" : d)
                + '</td><td>'
                + trjs.keys.functions[trjs.keys.keyChanging[i].fun][1]
                + '</td></tr>\n';
        }
    }
    for (var i in trjs.keys.keyChanging) {
        if (trjs.keys.keyChanging[i].supl !== "F2") continue;
        var k = trjs.keys.keyChanging[i].key;
        if (!k) k = 'Unknown';
        //console.log("F2", trjs.keys.keyChanging[i].fun, trjs.keys.keyChanging[i]);
        if (!trjs.keys.functions[trjs.keys.keyChanging[i].fun]) continue;
        var d = trjs.keys.functions[trjs.keys.keyChanging[i].fun][2];
        if (trjs.keys.keyChanging[i].key !== -1) {
            s += '<tr><td>'
                + prefixToString(trjs.keys.keyChanging[i].supl)
                + '</td><td>'
                + modifiers2ToString(trjs.keys.keyChanging[i].ctrl, trjs.keys.keyChanging[i].alt,
                    trjs.keys.keyChanging[i].shift, trjs.keys.keyChanging[i].ctrl)
                + '</td><td>'
                + k.toUpperCase()
                + '</td><td>'
                + (d === null ? "" : d)
                + '</td><td>'
                + trjs.keys.functions[trjs.keys.keyChanging[i].fun][1]
                + '</td></tr>\n';
        }
    }
    return s;
};

trjs.keys.chgToHtml = function () {
    var s = '';
    for (var i in trjs.keys.keyChanging) {
        if (!trjs.keys.functions[trjs.keys.keyChanging[i].fun]) continue;
        var k = trjs.keys.keyChanging[i].key;
        if (!k) k = 'Unknown';
        var f = trjs.keys.keyChanging[i].fun;
        if (!f) console.log("key with no function?", i, trjs.keys.keyChanging[i]);
        else {
            s += '<tr><td><button class="chgButton" onclick="trjs.keys.editKey(event,' + i + ');">Edit</button></td><td>';
            s += '<span class="chgFunname">' + trjs.keys.keyChanging[i].fun + '</span>';
            s += '</td><td>';
            s += prefixToString(trjs.keys.keyChanging[i].supl);
            s += '</td><td>';
            s += modifiers2ToString(trjs.keys.keyChanging[i].ctrl, trjs.keys.keyChanging[i].alt,
                trjs.keys.keyChanging[i].shift, trjs.keys.keyChanging[i].ctrl);
            s += '</td><td>';
            s += '<span class="chgKeyname">' + k.toUpperCase() + '</span>';
            s += '</td><td>';
            var c = trjs.keys.functions[trjs.keys.keyChanging[i].fun][2];
            if (c) {
                s += '<span class="chgCompl">' + c + '</span>';
            }
            s += '</td><td>';
            s += '<span class="chgInfo">' + trjs.keys.functions[trjs.keys.keyChanging[i].fun][1] + '</span>';
            s += '</td></tr>\n';
        }
    }
    return s;
};

trjs.keys.showKeys = function () {
    $('#bindings-content').html(
        '<p><button id="printbkeys" onclick="trjs.keys.printKeys();">' +
        '<i class="fa fa-print"></i><span id="printkeys"> Print the list of keys </span></button></p>' +
        '<table id="tableid" class="display"><thead><tr>' +
        '<th id="tCHGprefix">Prefix</th>' +
        '<th id="tCHGmodif">Modifiers</th>' +
        '<th id="tCHGkey">Key</th>' +
        '<th id="tCHGbin">Function</th>' +
        '</tr></thead>' +
        '<tbody id="bodyKeys">' + trjs.keys.toHtml() + '</tbody></table>');
    var h = $(window).height();
    if (h>400)
        $('#tableid').dataTable({
            "scrollY": (h-400) + "px",
            "scrollCollapse": true,
            "paging": false
        });
    else
        $('#tableid').dataTable({
            "scrollY": "auto",
            "scrollCollapse": true,
            "paging": false
        });
    $('#message-bindings').modal({keyboard: true});
};

trjs.keys.updateKeys = function () {
    $('#bodyKeys').html(trjs.keys.toHtml());
}

trjs.keys.showApiKeys = function () {
    $('#apibindings-content').html(
        '<p><button id="printbapikeys" onclick="trjs.keys.printApiKeys();">' +
        '<i class="fa fa-print"></i><span id="printapikeys"> Print the list of API keys</span></button></p>' +
        '<table id="tableidapi" class="display"><thead><tr>' +
        '<th id="tapiprefix">Prefix</th>' +
        '<th id="tapimodif">Modifiers</th>' +
        '<th id="tapikey">Key</th>' +
        '<th id="tapibin">API</th>' +
        '<th>Info</th>' +
        '</tr></thead>' +
        '<tbody id="bodyApiKeys">' + trjs.keys.apiToHtml() + '</tbody></table>');
    $('#tableidapi').dataTable({
        "scrollY": "auto",
        "scrollCollapse": true,
        "paging": false
    });
    $('#message-bindings').modal({keyboard: true});
};

trjs.keys.updateApiKeys = function () {
    $('#bodyApiKeys').html(trjs.keys.apiToHtml());
}

trjs.keys.showF1F2Keys = function () {
    $('#F1F2bindings-content').html(
        '<p><button id="printbf1f2keys" onclick="trjs.keys.printF1F2Keys();">' +
        '<i class="fa fa-print"></i><span id="printF1F2keys"> Print the list of F1/F2 keys</span></button></p>' +
        '<table id="tableidF1F2" class="display"><thead><tr>' +
        '<th id="tF1F2prefix">Prefix</th>' +
        '<th id="tF1F2modif">Modifiers</th>' +
        '<th id="tF1F2key">Key</th>' +
        '<th id="tF1F2bin">Value</th>' +
        '<th>Info</th></tr></thead>' +
        '<tbody id="bodyF1F2Keys">' + trjs.keys.f1f2ToHtml() + '</tbody></table>');
    $('#tableidF1F2').dataTable({
        "scrollY": "auto",
        "scrollCollapse": true,
        "paging": false
    });
    $('#message-bindings').modal({keyboard: true});
};

trjs.keys.updateF1F2Keys = function () {
    $('#bodyF1F2Keys').html(trjs.keys.f1f2ToHtml());
}

trjs.keys.showChangeKeys = function () {
    $('#bindings-change').html(
        '<p><button id="storebChangeKeys" onclick="trjs.keys.storeChangeKeys();">' +
        '<i class="fa fa-save"></i><span id="storeChangeKeys"> Save the new keys associations</span></button>' +
        '<button id="resetbkeys" onclick="trjs.keys.resetKeys();"> Reset the default keys </button></p>' +
        '<table id="tableidCHG" class="display"><thead><tr>' +
        '<th id="tckaction">-</th>' +
        '<th id="tckfun">Function</th>' +
        '<th id="tcprefix">Prefix</th>' +
        '<th id="tcmod">Modifiers</th>' +
        '<th id="tckey">Key</th>' +
        '<th id="tcchars">Chars</th>' +
        '<th id="tcdesc">Description</th>' +
        '</tr></thead>' +
        '<tbody id="bodyChgKeys">' + trjs.keys.chgToHtml() + '</tbody></table>');
    var h = $(window).height();
    if (h>400)
        $('#tableidCHG').dataTable({
            "scrollY": (h-400) + "px",
            "scrollCollapse": true,
            "paging": false
        });
    else
        $('#tableidCHG').dataTable({
            "scrollY": "auto",
            "scrollCollapse": true,
            "paging": false
        });
    $("#message-bindings").on("hidden.bs.modal", function (event) {
        // put your default event here
        console.log("call to hidden", event);
        console.trace();
        if (trjs.keys.updated === true) {
            bootbox.confirm({
                message: trjs.messgs.savekeybindings,
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(rep) {
                    if (rep === true) trjs.keys.storeChangeKeys();
                }
            });
        }
    });
    $('#message-bindings').modal({keyboard: true});
};

trjs.keys.updateChangeKeys = function () {
    $('#bodyChgKeys').html(trjs.keys.chgToHtml());
}

trjs.keys.printKeys = function (argument) {
    var style = '.p { display:block; margin: 0; padding: 0; } .keysdisplay { font-style: italic; margin-right: 2em; color:#000000; background:#FFFFFF; font-size:larger; } .keysdescr { color:#000000; background:#FFFFFF; } ';
//	var ctn = '<html><head><link href="style/print.css" rel="stylesheet" type="text/css"></head><body>' + trjs.keys.toHtml() + '</body></html>';
    var ctn = '<html><head><style>' + style + '</style></head><body>' + trjs.keys.toHtml() + '</body></html>';
    trjs.utils.printHTML(ctn);
};

trjs.keys.printApiKeys = function (argument) {
    var style = '.p { display:block; margin: 0; padding: 0; } .keysdisplay { font-style: italic; margin-right: 2em; color:#000000; background:#FFFFFF; font-size:larger; } .keysdescr { color:#000000; background:#FFFFFF; } ';
//	var ctn = '<html><head><link href="style/print.css" rel="stylesheet" type="text/css"></head><body>' + trjs.keys.toHtml() + '</body></html>';
    var ctn = '<html><head><style>' + style + '</style></head><body>' + trjs.keys.apiToHtml() + '</body></html>';
    trjs.utils.printHTML(ctn);
};

trjs.keys.printF1F2Keys = function (argument) {
    var style = '.p { display:block; margin: 0; padding: 0; } .keysdisplay { font-style: italic; margin-right: 2em; color:#000000; background:#FFFFFF; font-size:larger; } .keysdescr { color:#000000; background:#FFFFFF; } ';
//	var ctn = '<html><head><link href="style/print.css" rel="stylesheet" type="text/css"></head><body>' + trjs.keys.toHtml() + '</body></html>';
    var ctn = '<html><head><style>' + style + '</style></head><body>' + trjs.keys.f1f2ToHtml() + '</body></html>';
    trjs.utils.printHTML(ctn);
};

trjs.keys.ispress = function (e) {
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

trjs.keys.initMacrosBindings = function() {
    trjs.macros.loadTable();
    for (var i in trjs.macros.table) {
        trjs.keys.functions[i] = [ trjs.macros.macrofunction(i), trjs.macros.desc(i), trjs.macros.content(i) ];
    }
};

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
trjs.keyToName = {
    0: "no key",  // equivalent NOKEY
    8: "backspace",
    9: "tab",
    10: "newline",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause/break",
    20: "caps lock",
    27: "escape",
    32: "<",
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
    60: "lesser than", // bug on mac: this code is never produced for keydown but for keypress
    62: "greater than", // bug on mac: this code is never produced for keydown but for keypress
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
    93: "right window key",
    // 93: "select key",
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
    168: "open parenthesis",
    169: "close parenthesis",
    170: "asterisk",
    186: "semi-colon",
    // 187: "equal sign",
    61: "equal sign",
    188: "comma", // bug on mac: this code is produced for , and <
    189: "dash",
    190: "period", // bug on mac: this code is produced for . and >
    191: "forward slash",
    192: "grave accent",
    219: "open square bracket",
    220: "back slash",
    221: "close square bracket",
    222: "single quote",
    224: "cmd",
    162: "double quote",
    174: "open curly bracket",
    175: "close curly bracket",
};

trjs.keys.nameToKey = {};

trjs.keys.initNameToKey = function() {
    for (var i in trjs.keyToName) {
        trjs.keys.nameToKey[ trjs.keyToName[i] ] = i;
    }
}

var nkey = function (key) {
    return Number(trjs.keys.nameToKey[ key ]);
}
trjs.keys.nkey = nkey;

/*
 * default binding table
 * the binding table is for the user interface and can be inserted in the real binding table trjs.tablekeys
 * the trjs.keys.init function allows to initialize or reinitialize the keys.
 * for the future it would be good to allow to store and modify this list of bindings
 */

trjs.keys.initBindings = function () {
    /*
     trjs.keys.special1 = function() { console.timeEnd("page"); };
     trjs.bindings.push( [114, false, false, true, false, "special1", trjs.mess]); // Shift F3
     trjs.bindings.push([115, false, false, true, false, "htmlSave"]); // Shift F4
     */
    // reserved for special characters: trjs.bindings.push([nkey("f1"), false, false, false, false, function() {}, trjs.messgs.binxxx]); // F1
    // reserved for special characters: trjs.bindings.push([nkey("f2"), false, false, false, false, function() {}, trjs.messgs.binxxx]); // F2

    // key ctrl alt shift meta supl function_name
    // BINDKEY BINDCTRL BINDALT BINDSHIFT BINDMETA BINDSUPL BINDFUN
    // here supl = ""
    trjs.bindingsDef.push([nkey("tab"), false, false, false, false, "", "playTab"]); // Tab
    trjs.bindingsDef.push([nkey("newline"), false, false, false, false, "", "enter"]); // return Key
    trjs.bindingsDef.push([nkey("enter"), false, false, false, false, "", "enter"]); // return Key
    trjs.bindingsDef.push([nkey("escape"), false, false, false, false, "", "escape"]); // Esc
    trjs.bindingsDef.push([nkey("page up"), false, false, false, false, "", "pageUp"]); // Page Up
    trjs.bindingsDef.push([nkey("page down"), false, false, false, false, "", "pageDown"]); // Page Down
    trjs.bindingsDef.push([nkey("up arrow"), false, false, false, false, "", "keyUp"]); // Up
    trjs.bindingsDef.push([nkey("down arrow"), false, false, false, false, "", "keyDown"]); // Down
    trjs.bindingsDef.push([nkey("f3"), false, false, false, false, "", "insertWithTimeLoc"]); // F3
    trjs.bindingsDef.push([nkey("f4"), false, false, false, false, "", "setStart"]); // F4
    trjs.bindingsDef.push([nkey("f5"), false, false, false, false, "", "setEnd"]); // F5
    trjs.bindingsDef.push([nkey("f6"), false, false, false, false, "", "insertBlankLineLoc"]); // F6
    trjs.bindingsDef.push([nkey("f7"), false, false, false, false, "", "playCurrentLine"]); // F7
    trjs.bindingsDef.push([nkey("f8"), false, false, false, false, "", "playContinuous"]); // F8

    trjs.bindingsDef.push([nkey("lesser than"), false, false, false, false, "", "leftBracket"]); // <
    trjs.bindingsDef.push([nkey("greater than"), false, false, false, false, "", "rightBracket"]); // >

    trjs.bindingsDef.push([nkey("1"), true, false, false, 'ctrl', "", "setNthLoc1"]); // Ctrl 1
    trjs.bindingsDef.push([nkey("2"), true, false, false, 'ctrl', "", "setNthLoc2"]); // Ctrl 2
    trjs.bindingsDef.push([nkey("3"), true, false, false, 'ctrl', "", "setNthLoc3"]); // Ctrl 3
    trjs.bindingsDef.push([nkey("4"), true, false, false, 'ctrl', "", "setNthLoc4"]); // Ctrl 4
    trjs.bindingsDef.push([nkey("5"), true, false, false, 'ctrl', "", "setNthLoc5"]); // Ctrl 5
    trjs.bindingsDef.push([nkey("6"), true, false, false, 'ctrl', "", "setNthLoc6"]); // Ctrl 6
    trjs.bindingsDef.push([nkey("7"), true, false, false, 'ctrl', "", "setNthLoc7"]); // Ctrl 7
    trjs.bindingsDef.push([nkey("8"), true, false, false, 'ctrl', "", "setNthLoc8"]); // Ctrl 8
    trjs.bindingsDef.push([nkey("9"), true, false, false, 'ctrl', "", "setNthLoc9"]); // Ctrl 9

    trjs.bindingsDef.push([nkey("end"), true, false, false, 'ctrl', "", "ctrlEnd"]); // Ctrl End
    trjs.bindingsDef.push([nkey("home"), true, false, false, 'ctrl', "", "ctrlHome"]); // Ctrl Home
    trjs.bindingsDef.push([nkey("b"), true, false, false, 'ctrl', "", "splitLineLoc"]); // Ctrl B
    trjs.bindingsDef.push([nkey("d"), true, false, false, 'ctrl', "", "deleteLine"]); // Ctrl D
    trjs.bindingsDef.push([nkey("e"), true, false, false, 'ctrl', "", "checkCurrentLine",]); // Ctrl E
    trjs.bindingsDef.push([nkey("f"), true, false, false, 'ctrl', "", "showSearch"]); // Ctrl F
    trjs.bindingsDef.push([nkey("g"), true, false, false, 'ctrl', "", "setDivPlusInsert"]); // Ctrl G
    trjs.bindingsDef.push([nkey("i"), true, false, false, 'ctrl', "", "insertBlankLine"]); // Ctrl I
    trjs.bindingsDef.push([nkey("j"), true, false, false, 'ctrl', "", "joinLine"]); // Ctrl J
    trjs.bindingsDef.push([nkey("l"), true, false, false, 'ctrl', "", "showLine"]); // Ctrl L
    trjs.bindingsDef.push([nkey("m"), true, false, false, 'ctrl', "", "insertWithTimeLoc"]); // Ctrl M
    trjs.bindingsDef.push([nkey("o"), true, false, false, 'ctrl', "", "openTranscript"]); // Ctrl O
    trjs.bindingsDef.push([nkey("r"), true, false, false, 'ctrl', "", "replicateLine"]); // Ctrl R
    trjs.bindingsDef.push([nkey("s"), true, false, false, 'ctrl', "", "save"]); // Ctrl S
    trjs.bindingsDef.push([nkey("t"), true, false, false, 'ctrl', "", "showTime"]); // Ctrl T
    trjs.bindingsDef.push([nkey("u"), true, false, false, 'ctrl', "", "hideDiv"]); // Ctrl U
    trjs.bindingsDef.push([nkey("y"), true, false, false, 'ctrl', "", "redo"]); // Ctrl Y
    trjs.bindingsDef.push([nkey("z"), true, false, false, 'ctrl', "", "undo"]); // Ctrl Z

    trjs.bindingsDef.push([nkey("f8"), true, false, false, 'ctrl', "", "zoomGlobalOut"]); // Ctrl F8
    trjs.bindingsDef.push([nkey("f9"), true, false, false, 'ctrl', "", "zoomGlobalIn"]); // Ctrl F9

    trjs.bindingsDef.push([nkey("1"), true, false, true, 'ctrl', "", "setDivPlus"]); // Ctrl Shift 1
    trjs.bindingsDef.push([nkey("2"), true, false, true, 'ctrl', "", "setDivMinus"]); // Ctrl Shift 2
    trjs.bindingsDef.push([nkey("e"), true, false, true, 'ctrl', "", "cleanCurrentLine"]); // Ctrl Shift E
    trjs.bindingsDef.push([nkey("g"), true, false, true, 'ctrl', "", "setDivMissingMinus"]); // Ctrl Shift G

    trjs.bindingsDef.push([nkey("a"), true, true, false, 'ctrl', "", "selectAllMS"]); // Ctrl Alt A
    trjs.bindingsDef.push([nkey("b"), true, true, false, 'ctrl', "", "splitLine"]); // Ctrl Alt B
    trjs.bindingsDef.push([nkey("d"), true, true, false, 'ctrl', "", "deleteLineLoc"]); // Ctrl Alt D
    trjs.bindingsDef.push([nkey("e"), true, true, false, 'ctrl', "", "goCheck"]); // Ctrl Alt E
    // trjs.bindingsDef.push([70, true, false, false, 'ctrl', "", "showSearch"]); // Ctrl F
    trjs.bindingsDef.push([nkey("g"), true, true, false, 'ctrl', "", "setDivMinusInsert"]); // Ctrl Alt G
    if (trjs.utils.isWindows()) {
        trjs.bindingsDef.push([nkey("h"), true, true, false, 'ctrl', "", "joinLineLoc"]); // Ctrl Alt H
    } else {
        trjs.bindingsDef.push([nkey("j"), true, true, false, 'ctrl', "", "joinLineLoc"]); // Ctrl Alt J
    }
    trjs.bindingsDef.push([nkey("k"), true, true, false, 'ctrl', "", "chooseInputDevice"]); // Ctrl Alt K
    trjs.bindingsDef.push([nkey("m"), true, true, false, 'ctrl', "", "setTimeReplace"]); // Ctrl Alt M
    trjs.bindingsDef.push([nkey("o"), true, true, false, 'ctrl', "", "openMedia"]); // Ctrl Alt O
    trjs.bindingsDef.push([nkey("r"), true, true, false, 'ctrl', "", "splitLine"]); // Ctrl Alt R
    trjs.bindingsDef.push([nkey("u"), true, true, false, 'ctrl', "", "showDiv"]); // Ctrl Alt U

    //trjs.bindingsDef.push([119, true, true, false, 'ctrl', "", "setMultipleSelection"]); // Ctrl Alt F8
    //trjs.bindingsDef.push([120, true, true, false, 'ctrl', "", "exportMStoSubtSrt"]); // Ctrl Alt F9
    //trjs.bindingsDef.push([121, true, true, false, 'ctrl', "", "exportMStoSubtAss"]); // Ctrl Alt F10
    //trjs.bindingsDef.push([122, true, true, false, 'ctrl', "", "exportMStoMediaSubt"]); // Ctrl Alt F11
    trjs.bindingsDef.push([nkey("f12"), true, true, false, 'ctrl', "", "exportMStoMedia"]); // Ctrl Alt F12

    trjs.bindingsDef.push([nkey("f1"), false, true, true, false, "", "generic"]); // Alt Shift F1
    /* 113 à 123 for Alt Shift F2 à F12 might be used for macros */

    trjs.bindingsDef.push([nkey("left arrow"), false, true, false, false, "", "backwardStep"]); // Alt Left
    trjs.bindingsDef.push([nkey("up arrow"), false, true, false, false, "", "keyLocUp"]); // Alt Up
    trjs.bindingsDef.push([nkey("right arrow"), false, true, false, false, "", "forwardStep"]); // Alt Right
    trjs.bindingsDef.push([nkey("down arrow"), false, true, false, false, "", "keyLocDown"]); // Alt Down

    trjs.bindingsDef.push([nkey("f1"), false, true, false, false, "", "playTab"]); // Alt F1
    trjs.bindingsDef.push([nkey("f2"), false, true, false, false, "", "makeSmall"]); // Alt F2
    trjs.bindingsDef.push([nkey("f3"), false, true, false, false, "", "makeBig"]); // Alt F3
    trjs.bindingsDef.push([nkey("f6"), false, true, false, false, "", "insertWithTime"]); // Alt F6
    trjs.bindingsDef.push([nkey("f7"), false, true, false, false, "", "playThreeLines"]); // Alt F7
    trjs.bindingsDef.push([nkey("f11"), false, true, false, false, "", "sort"]); // Alt F11
    trjs.bindingsDef.push([nkey("f12"), false, true, false, false, "", "undoList"]); // Alt F12
    trjs.bindingsDef.push([nkey("tab"), false, true, false, false, "", "playPause"]); // Alt Tab

    trjs.bindingsDef.push([nkey("tab"), false, false, true, false, "", "playStartLine"]); // Shift Tab
    trjs.bindingsDef.push([nkey("f1"), false, false, true, false, "", "playFromWave"]); // Shift F1
    trjs.bindingsDef.push([nkey("f2"), false, false, true, false, "", "playSlower" ]); // shift F2
    trjs.bindingsDef.push([nkey("f3"), false, false, true, false, "", "playFaster" ]); // shift F3
//    trjs.bindingsDef.push([nkey("f4"), false, false, true, false, "", "playReverse" ]); // shift F4
    trjs.bindingsDef.push([nkey("f5"), false, false, true, false, "", "playNormal" ]); // shift F5
    trjs.bindingsDef.push([nkey("f6"), false, false, true, false, "", "insertBlankLineLocBefore"]); // Shift F6
    trjs.bindingsDef.push([nkey("f7"), false, false, true, false, "", "playPause"]); // Shift F7
    trjs.bindingsDef.push([nkey("f8"), false, false, true, false, "", "playFromMedia"]); // Shift F8
    trjs.bindingsDef.push([nkey("f9"), false, false, true, false, "", "playPauseCurrent"]); // Shift F9
};

/**
 * structure containing the api keys
 */
trjs.api = {};

trjs.api.key = function (k) {
    trjs.macros.replaceSelectedText(trjs.api.table[k][1]);
    return true;
};

trjs.api.keyValue = function (k) {
    return trjs.api.table[k][1];
};

trjs.api.desc = function (k) {
    return trjs.api.table[k][2];
};

/**
 * full api list table
 */
trjs.api.table = [

// vowels
    /* 0 */ ["i", "i", trjs.messgs.api0],
    /* 1 */ ["I", "ɪ", trjs.messgs.api1],
    /* 2 */ ["e", "e", trjs.messgs.api2],
    /* 3 */ ["E", "ɛ", trjs.messgs.api3],
    /* 4 */ ["{", "æ", trjs.messgs.api4],
    /* 5 */ ["y", "y", trjs.messgs.api5],
    /* 6 */ ["2", "ø", trjs.messgs.api6],
    /* 7 */ ["9", "œ", trjs.messgs.api7],
    /* 8 */ ["1", "i", trjs.messgs.api8],
    /* 9 */ ["@", "ə", trjs.messgs.api9],
    /* 10 */ ["6", "ɐ", trjs.messgs.api10],
    /* 11 */ ["3", "ɜ", trjs.messgs.api11],
    /* 12 */ ["a", "a", trjs.messgs.api12],
    /* 13 */ ["}", "ʉ", trjs.messgs.api13],
    /* 14 */ ["8", "ɵ", trjs.messgs.api14],
    /* 15 */ ["&", "ɶ", trjs.messgs.api15],
    /* 16 */ ["M", "ɯ", trjs.messgs.api16],
    /* 17 */ ["7", "ɤ", trjs.messgs.api17],
    /* 18 */ ["V", "ʌ", trjs.messgs.api18],
    /* 19 */ ["A", "ɑ", trjs.messgs.api19],
    /* 20 */ ["u", "u", trjs.messgs.api20],
    /* 21 */ ["U", "ʊ", trjs.messgs.api21],
    /* 22 */ ["o", "o", trjs.messgs.api22],
    /* 23 */ ["O", "ɔ", trjs.messgs.api23],
    /* 24 */ ["Q", "ɒ", trjs.messgs.api24],
// consonants
    /* 25 */ ["p", "p", trjs.messgs.api25],
    /* 26 */ ["b", "b", trjs.messgs.api26],
    /* 27 */ ["t", "t", trjs.messgs.api27],
    /* 28 */ ["d", "d", trjs.messgs.api28],
    /* 29 */ ["ts", "ts", trjs.messgs.api29],
    /* 30 */ ["dz", "dz", trjs.messgs.api30],
    /* 31 */ ["tS", "tʃ", trjs.messgs.api31],
    /* 32 */ ["dZ", "dʒ", trjs.messgs.api32],
    /* 33 */ ["c", "c", trjs.messgs.api33],
    /* 34 */ ["J\\", "ɟ", trjs.messgs.api34],
    /* 35 */ ["k", "k", trjs.messgs.api35],
    /* 36 */ ["g", "ɡ", trjs.messgs.api36],
    /* 37 */ ["q", "q", trjs.messgs.api37],
    /* 38 */ ["p\\", "ɸ", trjs.messgs.api38],
    /* 39 */ ["B", "β", trjs.messgs.api39],
    /* 40 */ ["f", "f", trjs.messgs.api40],
    /* 41 */ ["v", "v", trjs.messgs.api41],
    /* 42 */ ["T", "θ", trjs.messgs.api42],
    /* 43 */ ["D", "ð", trjs.messgs.api43],
    /* 44 */ ["s", "s", trjs.messgs.api44],
    /* 45 */ ["z", "z", trjs.messgs.api45],
    /* 46 */ ["S", "ʃ", trjs.messgs.api46],
    /* 47 */ ["Z", "ʒ", trjs.messgs.api47],
    /* 48 */ ["C", "ç", trjs.messgs.api48],
    /* 49 */ ["j", "ʝ", trjs.messgs.api49],
    /* 50 */ ["x", "x", trjs.messgs.api50],
    /* 51 */ ["G", "ɣ", trjs.messgs.api51],
    /* 52 */ ["x\\", "ɰ", trjs.messgs.api52],
    /* 53 */ ["X\\", "ħ", trjs.messgs.api53],
    /* 54 */ ["?\\", "ʕ", trjs.messgs.api54],
    /* 55 */ ["h", "h", trjs.messgs.api55],
    /* 56 */ ["h\\", "ɦ", trjs.messgs.api56],
    /* 57 */ ["m", "m", trjs.messgs.api57],
    /* 58 */ ["F", "ɱ", trjs.messgs.api58],
    /* 59 */ ["n", "n", trjs.messgs.api59],
    /* 60 */ ["J", "ɲ", trjs.messgs.api60],
    /* 61 */ ["N", "ŋ", trjs.messgs.api61],
    /* 62 */ ["l", "l", trjs.messgs.api62],
    /* 63 */ ["L", "ʎ", trjs.messgs.api63],
    /* 64 */ ["5", "ɫ", trjs.messgs.api64],
    /* 65 */ ["4", "ɾ", trjs.messgs.api65],
    /* 66 */ ["r", "r", trjs.messgs.api66],
    /* 67 */ ["r\\", "ɹ", trjs.messgs.api67],
    /* 68 */ ["R", "ʁ", trjs.messgs.api68],
    /* 69 */ ["P", "ʋ", trjs.messgs.api69],
    /* 70 */ ["w", "w", trjs.messgs.api70],
    /* 71 */ ["H", "ɥ", trjs.messgs.api71],
    /* 72 */ ["j", "j", trjs.messgs.api72],
// others
    /* 73 */ [":", "ː", trjs.messgs.api73],
    /* 74 */ ["~", "~", trjs.messgs.api74],
    /* 75 */ ["~E", "ɛ̃", trjs.messgs.api75],
    /* 76 */ ["~O", "ɔ̃", trjs.messgs.api76],
    /* 77 */ ["~A", "ɑ̃", trjs.messgs.api77],
    /* 78 */ ["~9", "œ̃", trjs.messgs.api78],
    /* 79 */ ["^R", "ʀ", trjs.messgs.api79],
    /* 80 */ ["X", "χ", trjs.messgs.api80],
    /* 81 */ ["D", "ɖ", trjs.messgs.api81],
];

trjs.apiBindings = [];

trjs.keys.initApiBindings = function () {
    // BINDKEY BINDCTRL BINDALT BINDSHIFT BINDMETA BINDSUPL BINDFUN
    // here supl = "api"
    trjs.bindingsDef.push([nkey("a"), false, true, false, false, "api", "api.key(19)"]); // Alt A
    trjs.bindingsDef.push([nkey("a"), false, true, true, false, "api", "api.key(77)"]); // Shift Alt A
    trjs.bindingsDef.push([nkey("c"), false, true, false, false, "api", "api.key(48)"]); // Alt C
    trjs.bindingsDef.push([nkey("d"), false, true, false, false, "api", "api.key(43)"]); // Alt D
    trjs.bindingsDef.push([nkey("d"), false, true, true, false, "api", "api.key(81)"]); // Alt Shift D
    trjs.bindingsDef.push([nkey("e"), false, true, false, false, "api", "api.key(3)"]); // Alt E
    trjs.bindingsDef.push([nkey("e"), false, true, true, false, "api", "api.key(75)"]); // Shift Alt E
    trjs.bindingsDef.push([nkey("g"), false, true, false, false, "api", "api.key(51)"]); // Alt G
    trjs.bindingsDef.push([nkey("h"), false, true, false, false, "api", "api.key(71)"]); // Alt H
    trjs.bindingsDef.push([nkey("i"), false, true, false, false, "api", "api.key(1)"]); // Alt I
    trjs.bindingsDef.push([nkey("j"), false, true, false, false, "api", "api.key(60)"]); // Alt J
    trjs.bindingsDef.push([nkey("l"), false, true, false, false, "api", "api.key(63)"]); // Alt L
    trjs.bindingsDef.push([nkey("n"), false, true, false, false, "api", "api.key(61)"]); // Alt N
    trjs.bindingsDef.push([nkey("n"), false, true, true, false, "api", "api.key(74)"]); // Shift Alt N
    trjs.bindingsDef.push([nkey("o"), false, true, false, false, "api", "api.key(23)"]); // Alt O
    trjs.bindingsDef.push([nkey("o"), false, true, true, false, "api", "api.key(76)"]); // Shift Alt O
    trjs.bindingsDef.push([nkey("q"), false, true, false, false, "api", "api.key(24)"]); // Alt Q
    trjs.bindingsDef.push([nkey("r"), false, true, false, false, "api", "api.key(68)"]); // Alt R
    trjs.bindingsDef.push([nkey("r"), false, true, true, false, "api", "api.key(79)"]); // Shift Alt R
    trjs.bindingsDef.push([nkey("s"), false, true, false, false, "api", "api.key(46)"]); // Alt S
    trjs.bindingsDef.push([nkey("t"), false, true, false, false, "api", "api.key(42)"]); // Alt T
    trjs.bindingsDef.push([nkey("u"), false, true, false, false, "api", "api.key(21)"]); // Alt U
    trjs.bindingsDef.push([nkey("v"), false, true, false, false, "api", "api.key(18)"]); // Alt V
    trjs.bindingsDef.push([nkey("x"), false, true, true, false, "api", "api.key(80)"]); // Shift Alt X
    trjs.bindingsDef.push([nkey("z"), false, true, false, false, "api", "api.key(47)"]); // Alt Z
    trjs.bindingsDef.push([nkey("2"), false, true, false, false, "api", "api.key(6)"]); // Alt 2
    trjs.bindingsDef.push([nkey("9"), false, true, false, false, "api", "api.key(7)"]); // Alt 9
    trjs.bindingsDef.push([nkey("9"), false, true, true, false, "api", "api.key(78)"]); // Shift Alt 9
    trjs.bindingsDef.push([nkey("@"), false, true, false, false, "api", "api.key(9)"]); // Alt 0 et Alt @
    trjs.bindingsDef.push([nkey("semi-colon"), false, true, false, false, "api", "api.key(73)"]); // Alt :

// liste des caractère nom de domaine internationaux pour le français : ß à á â ã ä å æ ç è é ê ë ì í î ï ñ ò ó ô õ ö ù ú û ü ý ÿ œ
};

trjs.F1 = {};

trjs.F1.table = [
    //        Character Name, Char,  Function, F1 +, Unicode
    /* 0 */ [ "up-arrow", "↑", "shift to high pitch", "up arrow", "2191" ],
    /* 1 */ [ "down-arrow", "↓", "shift to low pitch", "down arrow", "2193" ],
    /* 2 */ [ "double arrow tilted up", "⇗", "rising to high (?)", "1", "21D7" ],
    /* 3 */ [ "single arrow tilted up", "↗", "rising to mid (¿)", "2", "2197" ],
    /* 4 */ [ "level arrow", "→", "level (,)", "3", "2192" ],
    /* 5 */ [ "single arrow tilted down", "↘", "falling to mid (;)", "4", "2198" ],
    /* 6 */ [ "double arrow tilted down", "⇘", "falling to low (.)", "5", "21D8" ],
    /* 7 */ [ "infinity mark", "∞", "unmarked ending", "6", "221E" ],
    /* 8 */ [ "double wavy equals", "≈", "+≈ continuation within speaker", "=", "2248" ],
    /* 9 */ [ "triple wavy equals", "≋", "+≋ continuation across other speaker", "+", "224B" ],
    /* 10 */ [ "triple equal", "≡", "≡uptake (turn internal)", "u", "2261" ],
    /* 11 */ [ "raised period", "∙", "inhalation", ".", "2219" ],
    /* 12 */ [ "open bracket top", "⌈", "top begin overlap", "[", "2308" ],
    /* 13 */ [ "close bracket top", "⌉", "top end overlap", "]", "2309" ],
    /* 14 */ [ "open bracket bottom", "⌊", "bottom begin overlap", "shift [", "230A" ],
    /* 15 */ [ "closed bracket bottom", "⌋", "bottom end overlap", "shift ]", "230B" ],
    /* 16 */ [ "up triangle", "∆", "∆faster∆ \"> <\"", "right arrow", "2206" ],
    /* 17 */ [ "down triangle", "∇", "∇slower∇ \"< >\"", "left arrow", "2207" ],
    /* 18 */ [ "low asterisk", "⁎", "⁎creaky⁎", "*", "204E" ],
    /* 19 */ [ "double question mark", "⁇", "⁇unsure⁇", "/", "2047" ],
    /* 20 */ [ "degree sign", "°", "°softer°", "zero", "00B0" ],
    /* 21 */ [ "fisheye", "◉", "◉louder◉", ")", "25C9" ],
    /* 22 */ [ "low bar", "▁", "▁low pitch▁", "d", "2581" ],
    /* 23 */ [ "high bar", "▔", "▔high pitch▔", "h", "2594" ],
    /* 24 */ [ "smiley", "☺", "☺smile voice☺", "l", "263A" ],
    /* 25 */ [ "breathy", "♋", "♋breathy♋", "b", "264B" ],
    /* 26 */ [ "double integral", "∬", "∬whisper∬", "w", "222C" ],
    /* 27 */ [ "upsilon with dialytika", "Ϋ", "Ϋ yawn Ϋ", "y", "03AB" ],
    /* 28 */ [ "clockwise contour integral", "∲", "∲ singing ∲", "s", "222E" ],
    /* 29 */ [ "section marker", "§", "§ precise§", "p", "00A7" ],
    /* 30 */ [ "tilde", "∾", "constriction∾", "n", "223E" ],
    /* 31 */ [ "half circle", "↻", "↻pitch reset", "r", "21BB" ],
    /* 32 */ [ "capital H with dasia", "Ἡ", "laugh in a word", "c", "1F29" ],
];

trjs.F1.key = function (k) {
    trjs.macros.replaceSelectedText(trjs.F1.table[k][1]);
    return true;
};

trjs.F1.keyValue = function (k) {
    return trjs.F1.table[k][1];
};

trjs.F1.desc = function (k) {
    return trjs.F1.table[k][0] + " = " + trjs.F1.table[k][2];
};

trjs.F1Bindings = [];

trjs.keys.initF1Bindings = function () {
    // BINDKEY BINDCTRL BINDALT BINDSHIFT BINDMETA BINDSUPL BINDFUN
    // here supl = "F1"
    trjs.bindingsDef.push([nkey("up arrow"), false, false, false, false, "F1", "F1.key(0)"]); // up arrow
    trjs.bindingsDef.push([nkey("down arrow"), false, false, false, false, "F1", "F1.key(1)"]); //
    trjs.bindingsDef.push([nkey("1"), false, false, false, false, "F1", "F1.key(2)"]); //
    trjs.bindingsDef.push([nkey("2"), false, false, false, false, "F1", "F1.key(3)"]); //
    trjs.bindingsDef.push([nkey("3"), false, false, false, false, "F1", "F1.key(4)"]); //
    trjs.bindingsDef.push([nkey("4"), false, false, false, false, "F1", "F1.key(5)"]); //
    trjs.bindingsDef.push([nkey("5"), false, false, false, false, "F1", "F1.key(6)"]); //
    trjs.bindingsDef.push([nkey("6"), false, false, false, false, "F1", "F1.key(7)"]); //
    trjs.bindingsDef.push([nkey("equal sign"), false, false, false, false, "F1", "F1.key(8)"]); //
    trjs.bindingsDef.push([nkey("add"), false, false, true, false, "F1", "F1.key(9)"]); //
    trjs.bindingsDef.push([nkey("u"), false, false, false, false, "F1", "F1.key(10)"]); //
    trjs.bindingsDef.push([nkey("period"), false, false, false, false, "F1", "F1.key(11)"]); //
    trjs.bindingsDef.push([nkey("open square bracket"), false, false, false, false, "F1", "F1.key(12)"]); //
    trjs.bindingsDef.push([nkey("close square bracket"), false, false, false, false, "F1", "F1.key(13)"]); //
    trjs.bindingsDef.push([nkey("open square bracket"), false, false, true, false, "F1", "F1.key(14)"]); //
    trjs.bindingsDef.push([nkey("close square bracket"), false, false, true, false, "F1", "F1.key(15)"]); //
    trjs.bindingsDef.push([nkey("right arrow"), false, false, false, false, "F1", "F1.key(16)"]); //
    trjs.bindingsDef.push([nkey("left arrow"), false, false, false, false, "F1", "F1.key(17)"]); //
    trjs.bindingsDef.push([nkey("star"), false, false, false, false, "F1", "F1.key(18)"]); //
    trjs.bindingsDef.push([nkey("forward slash"), false, false, true, false, "F1", "F1.key(19)"]); //
    trjs.bindingsDef.push([nkey("close parenthesis"), false, false, false, false, "F1", "F1.key(20)"]); //
    trjs.bindingsDef.push([nkey("d"), false, false, false, false, "F1", "F1.key(21)"]); //
    trjs.bindingsDef.push([nkey("h"), false, false, false, false, "F1", "F1.key(22)"]); //
    trjs.bindingsDef.push([nkey("l"), false, false, false, false, "F1", "F1.key(23)"]); //
    trjs.bindingsDef.push([nkey("b"), false, false, false, false, "F1", "F1.key(24)"]); //
    trjs.bindingsDef.push([nkey("w"), false, false, false, false, "F1", "F1.key(25)"]); //
    trjs.bindingsDef.push([nkey("y"), false, false, false, false, "F1", "F1.key(26)"]); //
    trjs.bindingsDef.push([nkey("s"), false, false, false, false, "F1", "F1.key(27)"]); //
    trjs.bindingsDef.push([nkey("p"), false, false, false, false, "F1", "F1.key(28)"]); //
    trjs.bindingsDef.push([nkey("n"), false, false, false, false, "F1", "F1.key(29)"]); //
    trjs.bindingsDef.push([nkey("r"), false, false, false, false, "F1", "F1.key(30)"]); //
    trjs.bindingsDef.push([nkey("c"), false, false, false, false, "F1", "F1.key(31)"]); //
};

trjs.F2 = {};

trjs.F2.table = [
    //        Character Name, Char,  Function, F2 +, Unicode
    /* 34 */ [ "lower quote", "„", "tag or sentence final particle", "t", "201E" ],
    /* 35 */ [ "double dagger", "‡", "vocative or summons", "v", "2021" ],
    /* 36 */ [ "dot", "ạ", "Arabic dot", ",", "323" ],
    /* 37 */ [ "raised h", "ʰ", "Arabic aspiration", "H", "02B0" ],
    /* 38 */ [ "macron", "ā", "Hebrew stressed syllable", "-", "304" ],
    /* 39 */ [ "glottal", "ʔ", "glottal stop", "q", "294" ],
    /* 40 */ [ "reverse glottal", "ʕ", "Hebrew glottal", "Q", "295" ],
    /* 41 */ [ "caron", "š", "caron", ";", "030C" ],
    /* 42 */ [ "raised stroke", "ˈ", "primary stress", "1", "02C8" ],
    /* 43 */ [ "lowered stroke", "ˌ", "secondary stress", "2", "02CC" ],
    /* 44 */ [ "open paren", "‹", "begin phono group", "<", "2039" ],
    /* 45 */ [ "closed paren", "›", "end phono group", ">", "203A" ],
    /* 46 */ [ "open paren", "〔", "begin sign group", "{", "3014" ],
    /* 47 */ [ "closed paren", "〕", "end sign group", "}", "3015" ],
    /* 48 */ [ "open double quote", "“", "begin quote", "\'", "201C" ],
    /* 49 */ [ "closed double quote", "”", "end quote", "\"", "201D" ],
];

trjs.F2.key = function (k) {
    trjs.macros.replaceSelectedText(trjs.F2.table[k][1]);
    return true;
};

trjs.keys.leftBracket = function (k) {
    trjs.macros.replaceSelectedText(trjs.data.leftBracket);
    return true;
}; 

trjs.keys.rightBracket = function (k) {
    trjs.macros.replaceSelectedText(trjs.data.rightBracket);
    return true;
};

trjs.F2.keyValue = function (k) {
    return trjs.F2.table[k][1];
};

trjs.F2.desc = function (k) {
    return trjs.F2.table[k][0] + " = " + trjs.F2.table[k][2];
};

trjs.F2Bindings = [];

trjs.keys.initF2Bindings = function () {
    // BINDKEY BINDCTRL BINDALT BINDSHIFT BINDMETA BINDSUPL BINDFUN
    // here supl = "F2"
    trjs.bindingsDef.push([nkey("t"), false, false, false, false, "F2", "F2.key(0)"]); // up arrow
    trjs.bindingsDef.push([nkey("v"), false, false, false, false, "F2", "F2.key(1)"]); //
    trjs.bindingsDef.push([nkey("comma"), false, false, false, false, "F2", "F2.key(2)"]); //
    trjs.bindingsDef.push([nkey("h"), false, false, false, false, "F2", "F2.key(3)"]); //
    trjs.bindingsDef.push([nkey("minus"), false, false, false, false, "F2", "F2.key(4)"]); //
    trjs.bindingsDef.push([nkey("q"), false, false, false, false, "F2", "F2.key(5)"]); //
    trjs.bindingsDef.push([nkey("q"), false, false, true, false, "F2", "F2.key(6)"]); //
    trjs.bindingsDef.push([nkey("semi-colon"), false, false, false, false, "F2", "F2.key(7)"]); //
    trjs.bindingsDef.push([nkey("1"), false, false, false, false, "F2", "F2.key(8)"]); //
    trjs.bindingsDef.push([nkey("2"), false, false, false, false, "F2", "F2.key(9)"]); //
    trjs.bindingsDef.push([nkey("lesser than"), false, false, false, false, "F2", "F2.key(10)"]); //
    trjs.bindingsDef.push([nkey("greater than"), false, false, false, false, "F2", "F2.key(11)"]); //
    trjs.bindingsDef.push([nkey("open curly bracket"), false, false, false, false, "F2", "F2.key(12)"]); //
    trjs.bindingsDef.push([nkey("close curly bracket"), false, false, false, false, "F2", "F2.key(13)"]); //
    trjs.bindingsDef.push([nkey("single quote"), false, false, false, false, "F2", "F2.key(14)"]); //
    trjs.bindingsDef.push([nkey("double quote"), false, false, false, false, "F2", "F2.key(15)"]); //

    trjs.bindingsDef.push( [nkey("1"), true, false, false, false, "F2", "setNthTier1" ]); // F2 ctrl 1
    trjs.bindingsDef.push( [nkey("2"), true, false, false, false, "F2", "setNthTier2" ]); // F2 ctrl 2
    trjs.bindingsDef.push( [nkey("3"), true, false, false, false, "F2", "setNthTier3" ]); // F2 ctrl 3
    trjs.bindingsDef.push( [nkey("4"), true, false, false, false, "F2", "setNthTier4" ]); // F2 ctrl 4
    trjs.bindingsDef.push( [nkey("5"), true, false, false, false, "F2", "setNthTier5" ]); // F2 ctrl 5
    trjs.bindingsDef.push( [nkey("6"), true, false, false, false, "F2", "setNthTier6" ]); // F2 ctrl 6
    trjs.bindingsDef.push( [nkey("7"), true, false, false, false, "F2", "setNthTier7" ]); // F2 ctrl 7
    trjs.bindingsDef.push( [nkey("8"), true, false, false, false, "F2", "setNthTier8" ]); // F2 ctrl 8
    trjs.bindingsDef.push( [nkey("9"), true, false, false, false, "F2", "setNthTier9" ]); // F2 ctrl 9

    trjs.bindingsDef.push( [nkey("f5"), false, true, false, false, "F2", "colorRed" ]); // 'RED' ] ); // F2 alt F5
    trjs.bindingsDef.push( [nkey("f6"), false, true, false, false, "F2", "colorGreen" ]); // 'GREEN' ] ); // F2 alt F6
    trjs.bindingsDef.push( [nkey("f7"), false, true, false, false, "F2", "colorBlue" ]); // 'BLUE' ] ); // F2 alt F7
    trjs.bindingsDef.push( [nkey("f8"), false, true, false, false, "F2", "bold" ]); // 'BOLD' ] ); // F2 alt F8
    trjs.bindingsDef.push( [nkey("f9"), false, true, false, false, "F2", "italics" ]); // 'ITALICS' ] ); // F2 alt F9
    trjs.bindingsDef.push( [nkey("f10"), false, true, false, false, "F2", "emphasis" ]); // 'EMPHASIS' ] ); // F2 alt F10

    //trjs.bindingsDef.push([119, true, true, false, 'ctrl', "F2", "setMultipleSelection"]); // Ctrl Alt F8
    //trjs.bindingsDef.push([120, true, true, false, 'ctrl', "F2", "exportMStoSubtSrt"]); // Ctrl Alt F9
    //trjs.bindingsDef.push([121, true, true, false, 'ctrl', "F2", "exportMStoSubtAss"]); // Ctrl Alt F10
    //trjs.bindingsDef.push([122, true, true, false, 'ctrl', "F2", "exportMStoMediaSubt"]); // Ctrl Alt F11
    //trjs.bindingsDef.push([nkey("f12"), false, false, false, false, trjs.transcription.exportMStoMedia, trjs.messgs.ctrlaltbin123]); // Ctrl Alt F12
};

trjs.keys.noBindings = function() {
    // list all keys that are set and check if there are unintended doubles
    var funnames = {};
    for (var i in trjs.bindingsUser) {
        if (funnames[trjs.bindingsUser[i][BINDFUN]] === true) {
            // double
            console.log(i, trjs.bindingsUser[i][BINDFUN], "has two key bindings (not an error)");
        } else {
            funnames[trjs.bindingsUser[i][BINDFUN]] = true;
        }
    }
    for (var i in trjs.keys.functions) {
        if (funnames[i] !== true) {
            trjs.bindingsUser.push([ NOKEY, false, false, false, false, "", i ]);
        }
    }
}

trjs.keys.viewKeyBindings = function() {
    trjs.keys.initKeyChanging();
    trjs.keys.showKeys();
    trjs.keys.showApiKeys();
    trjs.keys.showF1F2Keys();
    trjs.keys.showChangeKeys();
}

trjs.keys.updateKeyBindings = function() {
    trjs.keys.updateKeys();
    trjs.keys.updateApiKeys();
    trjs.keys.updateF1F2Keys();
    trjs.keys.updateChangeKeys();
}

/**
 * table of all available functions
 */
trjs.keys.functions = {
    "about": [ trjs.editor.about, "About TRJS", null],
    "leftBracket": [ trjs.keys.leftBracket, "Write left bracket character", null],
    "rightBracket": [ trjs.keys.rightBracket, "Write right bracket character", null],
    "viewKeyBindings": [ trjs.keys.viewKeyBindings, "View and change key bindings", null],
    "backwardStep": [ trjs.media.backwardStep, trjs.messgs.altbin37, null],
    "bold": [ trjs.keys.bold, trjs.messgs.ctrlaltbin116, null],
    "checkCurrentLine": [ trjs.check.checkCurrentLine, 'Check current line', null],
    "cleanCurrentLine": [ trjs.check.cleanCurrentLine, "remove all special information (e.g. syntax checking) from the current line", null],
    "chooseInputDevice": [ trjs.events.chooseInputDevice, 'Choose output sound device', null],
    "colorBlue": [ trjs.keys.colorBlue, trjs.messgs.ctrlaltbin115, null],
    "colorGreen": [ trjs.keys.colorGreen, trjs.messgs.ctrlaltbin114, null],
    "colorRed": [ trjs.keys.colorRed, trjs.messgs.ctrlaltbin113, null],
    "ctrlEnd": [ trjs.events.ctrlEnd, trjs.messgs.ctrlbin35, null],
    "ctrlHome": [ trjs.events.ctrlHome, trjs.messgs.ctrlbin36, null],
    "deleteLine": [ trjs.events.deleteLineAndRedraw, trjs.messgs.ctrlbin68, null],
    "deleteLineLoc": [ trjs.events.deleteLineLocAndRedraw, trjs.messgs.ctrlaltbin68, null],
    "emphasis": [ trjs.keys.emphasis, trjs.messgs.ctrlaltbin118, null],
    "enter": [ trjs.events.enter, trjs.messgs.cmdenter, null],
    "escape": [ trjs.events.escape, trjs.messgs.bin27, null],
    "exportMStoMedia": [ trjs.transcription.exportMStoMedia, trjs.messgs.ctrlaltbin123, null],
    "exportMStoMediaSubt": [ trjs.transcription.exportMStoMediaSubt, trjs.messgs.ctrlaltbin122, null],
    "exportMStoSubtAss": [ trjs.transcription.exportMStoSubtAss, trjs.messgs.ctrlaltbin121, null],
    "exportMStoSubtSrt": [ trjs.transcription.exportMStoSubtSrt, trjs.messgs.ctrlaltbin120, null],
    "generic": [ trjs.macros.generic, trjs.messgs.generic, null],
    "goCheck": [ trjs.check.goCheck, 'Check all file', null],
    "hideDiv": [ trjs.editor.hideDiv, trjs.messgs.ctrlbin85, null],
    "htmlSave": [ trjs.io.htmlSave, trjs.messgs.shiftbin115, null],
    "insertBlankLine": [ trjs.events.insertBlankLineAndRedraw, trjs.messgs.insertBlankLine, null],
    "insertBlankLineLoc": [ trjs.events.insertBlankLineLocAndRedraw, trjs.messgs.insertBlankLineLoc, null],
    "insertBlankLineLocBefore": [ trjs.events.insertBlankLineLocBeforeAndRedraw, trjs.messgs.insertBlankLineLocBeforeAndRedraw, null],
    "insertWithTime": [ trjs.events.insertWithTimeAndRedraw, trjs.messgs.insertWithTime, null],
    "insertWithTimeLoc": [ trjs.events.insertWithTimeLocAndRedraw, trjs.messgs.insertWithTimeLoc, null],
    "italics": [ trjs.keys.italics, trjs.messgs.ctrlaltbin117, null],
    "joinLine": [ trjs.events.joinLine, trjs.messgs.ctrlbin74, null],
    "joinLineLoc": [ trjs.events.joinLineLoc, trjs.messgs.ctrlaltbin74, null],
    "keyDown": [ trjs.events.keyDown, trjs.messgs.bin40, null],
    "keyLocDown": [ trjs.events.keyLocDown, trjs.messgs.altbin40, null],
    "keyLocUp": [ trjs.events.keyLocUp, trjs.messgs.altbin38, null],
    "keyUp": [ trjs.events.keyUp, trjs.messgs.bin38, null],
    "makeBig": [ trjs.media.makeBig, trjs.messgs.altbin114, null],
    "makeSmall": [ trjs.media.makeSmall, trjs.messgs.altbin113, null],
    "openMedia": [ trjs.editor.openMedia, trjs.messgs.ctrlaltbin79, null],
    "openTranscript": [ trjs.editor.openTranscript, trjs.messgs.ctrlbin79, null],
    "forwardStep": [ trjs.media.forwardStep, trjs.messgs.altbin39, null],
    "pageLeft": [ trjs.partition.pageleft, "go one page left", null],
    "pageRight": [ trjs.partition.pageright, "go one page right", null],
    "pageDown": [ trjs.events.pageDown, trjs.messgs.bin34, null],
    "pageUp": [ trjs.events.pageUp, trjs.messgs.bin33, null],

    "playContinuous": [ trjs.events.goContinuous, trjs.messgs.playContinuous, null],
    "playPauseCurrent": [ trjs.media.playPauseCurrent, trjs.messgs.playPauseCurrent, null],
    "playCurrentLine": [ trjs.events.runCurrentLine, trjs.messgs.playCurrentLine, null],
    "playFaster": [ trjs.media.playFaster, trjs.messgs.playFaster, null],
    "playFromMedia": [ trjs.media.playFromMedia, trjs.messgs.playFromMedia, null],
    "playNormal": [ trjs.media.playNormal, trjs.messgs.playNormal, null],
    "playPause": [ trjs.media.playPause, trjs.messgs.playPause, null],
//    "playReverse": [ trjs.media.playReverse, trjs.messgs.playReverse, null],
    "playSlower": [ trjs.media.playSlower, trjs.messgs.playSlower, null],
    "playStartLine": [ trjs.media.playStartLine, trjs.messgs.playStartLine, null],
    "playTab": [ trjs.events.playTab, trjs.messgs.playTab, null],
    "playThreeLines": [ trjs.events.runThreeLines, trjs.messgs.playThreeLines, null],
    "playFromWave": [ trjs.media.playFromWave, trjs.messgs.playFromWave, null],

    "redo": [ trjs.undo.redo, trjs.messgs.ctrlbin89, null],
    "replicateLine": [ trjs.events.replicateLineAndRedraw, trjs.messgs.ctrlbin82, null],
    "save": [ trjs.editor.save, trjs.messgs.ctrlbin83, null],
    "selectAllMS": [ trjs.transcription.selectAllMS, trjs.messgs.ctrlaltbin65, null],
    "setDivMinus": [ trjs.events.setDivMinus, trjs.messgs.ctrlshiftbin50, null],
    "setDivMinusInsert": [ trjs.events.setDivMinusInsert, trjs.messgs.ctrlaltbin71, null],
    "setDivMissingMinus": [ trjs.events.setDivMissingMinus, trjs.messgs.ctrlshiftbin71, null],
    "setDivPlus": [ trjs.events.setDivPlus, trjs.messgs.ctrlshiftbin49, null],
    "setDivPlusInsert": [ trjs.events.setDivPlusInsert, trjs.messgs.ctrlbin71, null],
    "setEnd": [ trjs.events.setEndAndRedraw, trjs.messgs.bin116, null],
    "setMultipleSelection": [ trjs.transcription.setMultipleSelection, trjs.messgs.ctrlaltbin119, null],
    "setNthLoc1": [ trjs.events.setNthLoc1, trjs.messgs.ctrlbin49, null],
    "setNthLoc2": [ trjs.events.setNthLoc2, trjs.messgs.ctrlbin50, null],
    "setNthLoc3": [ trjs.events.setNthLoc3, trjs.messgs.ctrlbin51, null],
    "setNthLoc4": [ trjs.events.setNthLoc4, trjs.messgs.ctrlbin52, null],
    "setNthLoc5": [ trjs.events.setNthLoc5, trjs.messgs.ctrlbin53, null],
    "setNthLoc6": [ trjs.events.setNthLoc6, trjs.messgs.ctrlbin54, null],
    "setNthLoc7": [ trjs.events.setNthLoc7, trjs.messgs.ctrlbin55, null],
    "setNthLoc8": [ trjs.events.setNthLoc8, trjs.messgs.ctrlbin56, null],
    "setNthLoc9": [ trjs.events.setNthLoc9, trjs.messgs.ctrlbin57, null],
    "setNthTier1": [ trjs.events.setNthTier1, trjs.messgs.ctrlaltbin49, null],
    "setNthTier2": [ trjs.events.setNthTier2, trjs.messgs.ctrlaltbin50, null],
    "setNthTier3": [ trjs.events.setNthTier3, trjs.messgs.ctrlaltbin51, null],
    "setNthTier4": [ trjs.events.setNthTier4, trjs.messgs.ctrlaltbin52, null],
    "setNthTier5": [ trjs.events.setNthTier5, trjs.messgs.ctrlaltbin53, null],
    "setNthTier6": [ trjs.events.setNthTier6, trjs.messgs.ctrlaltbin54, null],
    "setNthTier7": [ trjs.events.setNthTier7, trjs.messgs.ctrlaltbin55, null],
    "setNthTier8": [ trjs.events.setNthTier8, trjs.messgs.ctrlaltbin56, null],
    "setNthTier9": [ trjs.events.setNthTier9, trjs.messgs.ctrlaltbin57, null],
    "setStart": [ trjs.events.setStartAndRedraw, trjs.messgs.bin115, null],
    "setTimeReplace": [ trjs.events.setTimeReplaceAndRedraw, trjs.messgs.ctrlaltbin77, null],
    "setTimeReplaceLoc": [ trjs.events.setTimeReplaceLocAndRedraw, trjs.messgs.ctrlaltbin73, null],
    "playStartLine": [ trjs.events.playStartLine, trjs.messgs.playStartLine, null],
    "showDiv": [ trjs.editor.showDiv, trjs.messgs.ctrlaltbin85, null],
    "showLine": [ trjs.editor.showLine, trjs.messgs.ctrlbin76, null],
    "showSearch": [ trjs.editor.showSearch, trjs.messgs.ctrlaltbin70, null],
    "showTime": [ trjs.editor.showTime, trjs.messgs.ctrlbin84, null],
    "sort": [ trjs.transcription.sort, "sort all lines by times", null],
    "splitLine": [ trjs.events.splitLineAndRedraw, trjs.messgs.cmdsplitLine, null],
    "splitLineLoc": [ trjs.events.splitLineLocAndRedraw, trjs.messgs.cmdsplitLineLoc, null],
    "undo": [ trjs.undo.undo, trjs.messgs.ctrlbin90, null],
    "undoList": [ trjs.undo.undoList, "display undo/redo list", null],
    "zoomGlobalIn": [ trjs.editor.zoomGlobalIn, trjs.messgs.ctrlbin120, null],
    "zoomGlobalOut": [ trjs.editor.zoomGlobalOut, trjs.messgs.ctrlbin119, null],
    "zoomIn": [ trjs.dmz.zoomIn, "zoom in wave and partition", null],
    "zoomOut": [ trjs.dmz.zoomOut, "zoom out wave and partition", null],

    "api.key(1)": [ function () { trjs.api.key(1); }, trjs.api.desc(1), trjs.api.keyValue(1)], // Alt I
    "api.key(3)": [ function () { trjs.api.key(3); }, trjs.api.desc(3), trjs.api.keyValue(3)], // Alt E
    "api.key(6)": [ function () { trjs.api.key(6); }, trjs.api.desc(6), trjs.api.keyValue(6)], // Alt 2
    "api.key(7)": [ function () { trjs.api.key(7); }, trjs.api.desc(7), trjs.api.keyValue(7)], // Alt 9
    "api.key(9)": [ function () { trjs.api.key(9); }, trjs.api.desc(9), trjs.api.keyValue(9)], // Alt 0 et Alt @
    "api.key(18)": [ function () { trjs.api.key(18); }, trjs.api.desc(18), trjs.api.keyValue(18)], // Alt V
    "api.key(19)": [ function () { trjs.api.key(19); }, trjs.api.desc(19), trjs.api.keyValue(19)], // Alt A
    "api.key(21)": [ function () { trjs.api.key(21); }, trjs.api.desc(21), trjs.api.keyValue(21)], // Alt U
    "api.key(23)": [ function () { trjs.api.key(23); }, trjs.api.desc(23), trjs.api.keyValue(23)], // Alt O
    "api.key(24)": [ function () { trjs.api.key(24); }, trjs.api.desc(24), trjs.api.keyValue(24)], // Shift Alt Q
    "api.key(43)": [ function () { trjs.api.key(43); }, trjs.api.desc(43), trjs.api.keyValue(43)], // Alt D
    "api.key(42)": [ function () { trjs.api.key(42); }, trjs.api.desc(42), trjs.api.keyValue(42)], // Alt T
    "api.key(46)": [ function () { trjs.api.key(46); }, trjs.api.desc(46), trjs.api.keyValue(46)], // Alt S
    "api.key(47)": [ function () { trjs.api.key(47); }, trjs.api.desc(47), trjs.api.keyValue(47)], // Alt Z
    "api.key(48)": [ function () { trjs.api.key(48); }, trjs.api.desc(48), trjs.api.keyValue(48)], // Alt C
    "api.key(51)": [ function () { trjs.api.key(51); }, trjs.api.desc(51), trjs.api.keyValue(51)], // Alt X
    "api.key(60)": [ function () { trjs.api.key(60); }, trjs.api.desc(60), trjs.api.keyValue(60)], // Alt J
    "api.key(61)": [ function () { trjs.api.key(61); }, trjs.api.desc(61), trjs.api.keyValue(61)], // Alt N
    "api.key(63)": [ function () { trjs.api.key(63); }, trjs.api.desc(63), trjs.api.keyValue(63)], // Alt L
    "api.key(68)": [ function () { trjs.api.key(68); }, trjs.api.desc(68), trjs.api.keyValue(68)], // Alt R
    "api.key(71)": [ function () { trjs.api.key(71); }, trjs.api.desc(71), trjs.api.keyValue(71)], // Alt H
    "api.key(73)": [ function () { trjs.api.key(73); }, trjs.api.desc(73), trjs.api.keyValue(73)], // Alt :
    "api.key(74)": [ function () { trjs.api.key(74); }, trjs.api.desc(74), trjs.api.keyValue(74)], // Alt Shift N
    "api.key(75)": [ function () { trjs.api.key(75); }, trjs.api.desc(75), trjs.api.keyValue(75)], // Shift Alt E
    "api.key(76)": [ function () { trjs.api.key(76); }, trjs.api.desc(76), trjs.api.keyValue(76)], // Shift Alt 9
    "api.key(77)": [ function () { trjs.api.key(77); }, trjs.api.desc(77), trjs.api.keyValue(77)], // Shift Alt O
    "api.key(78)": [ function () { trjs.api.key(78); }, trjs.api.desc(78), trjs.api.keyValue(78)], // Shift Alt A
    "api.key(79)": [ function () { trjs.api.key(79); }, trjs.api.desc(79), trjs.api.keyValue(79)], // Shift Alt R
    "api.key(80)": [ function () { trjs.api.key(80); }, trjs.api.desc(80), trjs.api.keyValue(80)], // Shift Alt X
    "api.key(81)": [ function () { trjs.api.key(81); }, trjs.api.desc(81), trjs.api.keyValue(81)], // Shift Alt D

    "F1.key(0)": [ function () { trjs.F1.key(0); }, trjs.F1.desc(0), trjs.F1.keyValue(0)],
    "F1.key(1)": [ function () { trjs.F1.key(1); }, trjs.F1.desc(1), trjs.F1.keyValue(1)],
    "F1.key(2)": [ function () { trjs.F1.key(2); }, trjs.F1.desc(2), trjs.F1.keyValue(2)],
    "F1.key(3)": [ function () { trjs.F1.key(3); }, trjs.F1.desc(3), trjs.F1.keyValue(3)],
    "F1.key(4)": [ function () { trjs.F1.key(4); }, trjs.F1.desc(4), trjs.F1.keyValue(4)],
    "F1.key(5)": [ function () { trjs.F1.key(5); }, trjs.F1.desc(5), trjs.F1.keyValue(5)],
    "F1.key(6)": [ function () { trjs.F1.key(6); }, trjs.F1.desc(6), trjs.F1.keyValue(6)],
    "F1.key(7)": [ function () { trjs.F1.key(7); }, trjs.F1.desc(7), trjs.F1.keyValue(7)],
    "F1.key(8)": [ function () { trjs.F1.key(8); }, trjs.F1.desc(8), trjs.F1.keyValue(8)],
    "F1.key(9)": [ function () { trjs.F1.key(9); }, trjs.F1.desc(9), trjs.F1.keyValue(9)],
    "F1.key(10)": [ function () { trjs.F1.key(10); }, trjs.F1.desc(10), trjs.F1.keyValue(10)],
    "F1.key(11)": [ function () { trjs.F1.key(11); }, trjs.F1.desc(11), trjs.F1.keyValue(11)],
    "F1.key(12)": [ function () { trjs.F1.key(12); }, trjs.F1.desc(12), trjs.F1.keyValue(12)],
    "F1.key(13)": [ function () { trjs.F1.key(13); }, trjs.F1.desc(13), trjs.F1.keyValue(13)],
    "F1.key(14)": [ function () { trjs.F1.key(14); }, trjs.F1.desc(14), trjs.F1.keyValue(14)],
    "F1.key(15)": [ function () { trjs.F1.key(15); }, trjs.F1.desc(15), trjs.F1.keyValue(15)],
    "F1.key(16)": [ function () { trjs.F1.key(16); }, trjs.F1.desc(16), trjs.F1.keyValue(16)],
    "F1.key(17)": [ function () { trjs.F1.key(17); }, trjs.F1.desc(17), trjs.F1.keyValue(17)],
    "F1.key(18)": [ function () { trjs.F1.key(18); }, trjs.F1.desc(18), trjs.F1.keyValue(18)],
    "F1.key(19)": [ function () { trjs.F1.key(19); }, trjs.F1.desc(19), trjs.F1.keyValue(19)],
    "F1.key(20)": [ function () { trjs.F1.key(20); }, trjs.F1.desc(20), trjs.F1.keyValue(20)],
    "F1.key(21)": [ function () { trjs.F1.key(21); }, trjs.F1.desc(21), trjs.F1.keyValue(21)],
    "F1.key(22)": [ function () { trjs.F1.key(22); }, trjs.F1.desc(22), trjs.F1.keyValue(22)],
    "F1.key(23)": [ function () { trjs.F1.key(23); }, trjs.F1.desc(23), trjs.F1.keyValue(23)],
    "F1.key(24)": [ function () { trjs.F1.key(24); }, trjs.F1.desc(24), trjs.F1.keyValue(24)],
    "F1.key(25)": [ function () { trjs.F1.key(25); }, trjs.F1.desc(25), trjs.F1.keyValue(25)],
    "F1.key(26)": [ function () { trjs.F1.key(26); }, trjs.F1.desc(26), trjs.F1.keyValue(26)],
    "F1.key(27)": [ function () { trjs.F1.key(27); }, trjs.F1.desc(27), trjs.F1.keyValue(27)],
    "F1.key(28)": [ function () { trjs.F1.key(28); }, trjs.F1.desc(28), trjs.F1.keyValue(28)],
    "F1.key(29)": [ function () { trjs.F1.key(29); }, trjs.F1.desc(29), trjs.F1.keyValue(29)],
    "F1.key(30)": [ function () { trjs.F1.key(30); }, trjs.F1.desc(30), trjs.F1.keyValue(30)],
    "F1.key(31)": [ function () { trjs.F1.key(31); }, trjs.F1.desc(31), trjs.F1.keyValue(31)],

    "F2.key(0)": [ function () { trjs.F2.key(0); }, trjs.F2.desc(0), trjs.F2.keyValue(0)],
    "F2.key(1)": [ function () { trjs.F2.key(1); }, trjs.F2.desc(1), trjs.F2.keyValue(1)],
    "F2.key(2)": [ function () { trjs.F2.key(2); }, trjs.F2.desc(2), trjs.F2.keyValue(2)],
    "F2.key(3)": [ function () { trjs.F2.key(3); }, trjs.F2.desc(3), trjs.F2.keyValue(3)],
    "F2.key(4)": [ function () { trjs.F2.key(4); }, trjs.F2.desc(4), trjs.F2.keyValue(4)],
    "F2.key(5)": [ function () { trjs.F2.key(5); }, trjs.F2.desc(5), trjs.F2.keyValue(5)],
    "F2.key(6)": [ function () { trjs.F2.key(6); }, trjs.F2.desc(6), trjs.F2.keyValue(6)],
    "F2.key(7)": [ function () { trjs.F2.key(7); }, trjs.F2.desc(7), trjs.F2.keyValue(7)],
    "F2.key(8)": [ function () { trjs.F2.key(8); }, trjs.F2.desc(8), trjs.F2.keyValue(8)],
    "F2.key(9)": [ function () { trjs.F2.key(9); }, trjs.F2.desc(9), trjs.F2.keyValue(9)],
    "F2.key(10)": [ function () { trjs.F2.key(10); }, trjs.F2.desc(10), trjs.F2.keyValue(10)],
    "F2.key(11)": [ function () { trjs.F2.key(11); }, trjs.F2.desc(11), trjs.F2.keyValue(11)],
    "F2.key(12)": [ function () { trjs.F2.key(12); }, trjs.F2.desc(12), trjs.F2.keyValue(12)],
    "F2.key(13)": [ function () { trjs.F2.key(13); }, trjs.F2.desc(13), trjs.F2.keyValue(13)],
    "F2.key(14)": [ function () { trjs.F2.key(14); }, trjs.F2.desc(14), trjs.F2.keyValue(14)],
    "F2.key(15)": [ function () { trjs.F2.key(15); }, trjs.F2.desc(15), trjs.F2.keyValue(15)],
};
