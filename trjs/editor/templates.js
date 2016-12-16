/**
 * <p>Procedures permettant de gérer toutes les données du format TEI hors la transcription.</p>
 * contient principalement les fonctions permettant de gérer:
 * les metadonnées
 * les locuteurs
 * les templates de transcription
 * @module Template
 * @author Christophe Parisse
 * date July 2013
 * @module Template
 */

trjs.template = (function () {

    /**
     * Information about persons
     * @constructor Person
     */
    function Person() {
        this.color = 'black';
        this.backcolor = 'white';
        this.code = '';
        this.age = '';
        this.name = '';
        this.role = '';
        this.sex = '';
        this.source = '';
        this.group = '';
        this.ses = '';
        this.educ = '';
        this.xml_id = '';
        this.xml_lang = '';
        this.custom = '';
    }

    /**
     * Store contents of a note in the TEI
     * @constructor Note
     */
    function Note() {
        this.maintype = '';
        this.subtype = '';
        this.text = '';
        this.xml_id = '';
        this.custom = '';
    }

    /**
     * Store contents of a text descriptor in the TEI
     * @constructor TextDesc
     */
    function TextDesc() {
        this.text = '';
        this.xml_id = '';
//	this.custom = '';
    }

    /**
     * Store contents of a media descriptor in the TEI
     * @constructor MediaDesc
     */
    function MediaDesc() {
        this.name = ''; // name of media file -- this always set automatically according to real media file name
        this.loc = ''; // path to the location of the media file (the directory)
        this.type = ''; // type of media: video vs. audio
        this.relLoc = ''; // relative path to the location of the media file
        this.duration = ''; // length of media
        this.realFile = ''; // real file name of media on disk
    }

    /**
     * init contents of a media descriptor in the TEI
     * @method setMedia
     */
    function setMedia(m) {
        m.name = '';
        m.loc = '';
        m.relLoc = '';
        m.type = '';
        m.duration = '';
        m.realFile = '';
        m.maxLinkingTime = 0;
    }

    /**
     * Store contents of a basic template information in the TEI
     * @constructor TemplateInfo
     */
    function TemplateInfo() {
        this.code = '';
        this.type = '';
        this.parent = '';
        this.description = '';
    }


    /**
     * Store contents of a basic metadata information in the TEI
     * @constructor Metadatainfo
     */
    function MetadataInfo() {
        this.type = '';
        this.property = '';
        this.value = '';
        this.info = '';
    }

    /**
     * Ensemble de fonctions liées à la lecture et au runtime des templates, métadata et personnes
     * TemplatesMetadataPersons
     */

    /**
     * creates a string containing the metadata
     * add possibility of onblur="trjs.data.checkNames(event);" for some lines
     * @method stringLine4Val
     * @param {string} tag (to specific a class)
     * @param {string} type
     * @param {string} prop
     * @param {string} val
     * @param {string} inf
     * @return {string} constructed html string
     */
    function stringLine4Val(tag, type, prop, val, inf, edit) {
        if (trjs.param.mode === 'readonly')
            return '<tr><td class="textcell1 nedit" ' + tag + '" >' + trjs.dataload.checkstring(type)
                + '</td><td class="textcell2 nedit" >' + trjs.dataload.checkstring(prop)
                + '</td><td class="textcell3 nedit" >' + trjs.dataload.checkstring(val)
                + '</td><td class="textcell4 nedit" >' + trjs.dataload.checkstring(inf)
                + '</td></tr>';
        else if (edit === 'readonly')
            return '<tr><td class="textcell1 nedit" ' + tag + '" >' + trjs.dataload.checkstring(type)
                + '</td><td class="textcell2 nedit" >' + trjs.dataload.checkstring(prop)
                + '</td><td class="textcell3 nedit" >' + trjs.dataload.checkstring(val)
                + '</td><td class="textcell4 nedit" >' + trjs.dataload.checkstring(inf)
                + '</td></tr>';
        else if (edit === 'writehalfblur')
            return '<tr><td class="textcell1 nedit" ' + tag + '" >' + trjs.dataload.checkstring(type)
                + '</td><td class="textcell2 nedit" >' + trjs.dataload.checkstring(prop)
                + '</td><td class="textcell3 cedit" contenteditable="true" onblur="trjs.data.checkNames(event);">' + trjs.dataload.checkstring(val)
                + '</td><td class="textcell4 cedit" contenteditable="true">' + trjs.dataload.checkstring(inf)
                + '</td></tr>';
        else if (edit === 'writehalf')
            return '<tr><td class="textcell1 nedit" ' + tag + '" >' + trjs.dataload.checkstring(type)
                + '</td><td class="textcell2 nedit" >' + trjs.dataload.checkstring(prop)
                + '</td><td class="textcell3 cedit" contenteditable="true" >' + trjs.dataload.checkstring(val)
                + '</td><td class="textcell4 nedit" >' + trjs.dataload.checkstring(inf)
                + '</td></tr>';
        else
            return '<tr><td class="textcell1 nedit" ' + tag + '" contenteditable="true">' + trjs.dataload.checkstring(type)
                + '</td><td class="textcell2 cedit" contenteditable="true">' + trjs.dataload.checkstring(prop)
                + '</td><td class="textcell3 cedit" contenteditable="true">' + trjs.dataload.checkstring(val)
                + '</td><td class="textcell4 cedit" contenteditable="true">' + trjs.dataload.checkstring(inf)
                + '</td></tr>';
    }

    /**
     * creates a string containing the templates
     * add possibility of onblur="trjs.data.checkNames(event);" for some lines
     * @method stringLine5Val
     * @param {string} code
     * @param {string} type
     * @param {string} parent
     * @param {string} name
     * @param {string} description
     * @return {string} constructed html string
     */
    function stringLineMeta(type, prop, value, inf) {
        return '<tr><td class="textcell1 cedit" contenteditable="true">' + trjs.dataload.checkstring(type)
            + '</td><td class="textcell4 cedit" contenteditable="true">' + trjs.dataload.checkstring(prop)
            + '</td><td class="textcell6 cedit" contenteditable="true">' + trjs.dataload.checkstring(value)
            + '</td><td class="textcell5 cedit" contenteditable="true">' + trjs.dataload.checkstring(inf)
            + '</td></tr>';
    }

    function stringLineCodes(code, name, ct, inf) {
        return '<tr><td class="textcell1 cedit" contenteditable="true" onblur="trjs.template.checkCodeName(event); trjs.template.imbricationLevels(event);">' + trjs.dataload.checkstring(code)
            + '</td><td class="textcell4 cedit" contenteditable="true" onblur="trjs.template.checkCodeName(event);">' + trjs.dataload.checkstring(name)
            + '</td><td class="textcell6 cedit" contenteditable="true" onblur="trjs.template.checkContentType(event);">' + trjs.dataload.checkstring(ct)
            + '</td><td class="textcell5 cedit" contenteditable="true">' + trjs.dataload.checkstring(inf)
            + '</td></tr>';
    }

    function stringLineTiers(code, type, parent, name, ct, inf) {
        return '<tr><td class="textcell1 cedit" contenteditable="true" onblur="trjs.template.checkCodeName(event); trjs.template.imbricationLevels(event);">' + trjs.dataload.checkstring(code)
            + '</td><td class="textcell2 cedit" contenteditable="true" onblur="trjs.template.checkTierType(event);" oncontextmenu="trjs.template.definedTierType(event);">' + trjs.dataload.checkstring(type)
            + '</td><td class="textcell3 cedit" contenteditable="true" onblur="trjs.template.imbricationLevels(event);">' + trjs.dataload.checkstring(parent)
            + '</td><td class="textcell6 cedit" contenteditable="true" onblur="trjs.template.checkContentType(event);">' + trjs.dataload.checkstring(name)
            + '</td><td class="textcell4 cedit" contenteditable="true" onblur="trjs.template.checkCodeName(event);">' + trjs.dataload.checkstring(ct)
            + '</td><td class="textcell5 cedit" contenteditable="true">' + trjs.dataload.checkstring(inf)
            + '</td></tr>';
    }


    /**
     * handle keys pressed down in the transcript editor and metadata editor
     * @method eventKeydownTMCodes
     * @param {event} e
     */
    function eventKeydownTMMeta(e) {
        eventKeydownBasic(e, stringLineMeta('---', '', '', ''));
    }

    /**
     * handle keys pressed down in the transcript editor and metadata editor
     * @method eventKeydownTMCodes
     * @param {event} e
     */
    function eventKeydownTMCode(e) {
        eventKeydownBasic(e, stringLineCodes('---', '', '', ''));
    }

    /**
     * handle keys pressed down in the transcript editor and metadata editor
     * @method eventKeydownTMTiers
     * @param {event} e
     */
    function eventKeydownTMTier(e) {
        eventKeydownBasic(e, stringLineTiers('---', '', '', '', '', ''));
    }

    function checkCodeName(e) {
        var table = $("#participant");
        var allnames = {};
        trjs.data.codesnames = {};
        var tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            allnames[trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 1))] = 'participant';  // names
        }

        table = $("#template-code");
        tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
            var iname = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 1));

            trjs.data.codesnames[icode] = iname;
            if (!allnames[iname]) {
                trjs.log.alert('Name: ' + iname + ' does not exist');
            }
        }
        table = $("#template-tier");
        tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
            var iname = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 3));

            trjs.data.codesnames[icode] = iname;
            if (!allnames[iname]) {
                trjs.log.alert('Name of tier: ' + iname + ' does not exist');
            }
        }
    }

    function checkCodeType(e) {
        //console.log('check code type');
        //console.log(e);
        var code = $(e.target).text().toLowerCase();
        if (code === '') return; // this ok, there can be no code (free format)
        var table = $("#template-tier");
        var tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
            if (icode.toLowerCase() === code) return; // Ok the type of the code is in the list of tiers
        }
        trjs.log.alert('attention: la valeur "' + code + '" n\'est un tiers identifié.');
    }

    function checkTierType(e) {
        //console.log('check tier type');
        //console.log(e);
        var type = $(e.target).text().toLowerCase();
        //console.log(type);
        //console.log(["symbolic association", "time subdivision", "symbolic subdivision", "included in", "point"].indexOf(type));
        if (type === '') return; // this ok, there can be no code (free format)
        if (["symbolic association", "time subdivision", "symbolic subdivision", "included in", "point"].indexOf(type) === -1) {
            trjs.log.boxalert('Type: ' + type + ' is not a predefined value');
        }
    }

    function checkContentType(params) {
        return;
    }

    /*
     * link variable to close in definedTierType() the window element element opened in definedTierType()
     */
    var eltDefTierType = null;
    var eltTargetTierType = null;

    function definedTierType(e) {
        e.preventDefault();
        eltTargetTierType = $(e.target);
        var s = "<table><thead><th data-cancel=1>Type of tier</th></thead>";
        s += "<tr><td>symbolic association</td></tr>";
        s += "<tr><td>time subdivision</td></tr>";
        s += "<tr><td>symbolic subdivision</td></tr>";
        s += "<tr><td>included in</td></tr>";
        s += "<tr><td>point</td></tr>";
        s += "<tfoot><th data-cancel=1>Cancel</th></tfoot>";
        s += "</table>";
        if (eltDefTierType !== null) {
            document.body.removeChild(eltDefTierType);
            eltDefTierType = null;
        }
        eltDefTierType = document.createElement("div");
        $(eltDefTierType).html(s);
        $(eltDefTierType).click(function (evt) {
            //console.log(evt.target);
            var ln = $(e.target).parent();
            // e.target.textContent = evt.target.textContent;
            if ($(evt.target).data('cancel') == 1) {
                document.body.removeChild(eltDefTierType);
                eltClickLoc = null;
            } else {
                eltTargetTierType.text($(evt.target).text());
                document.body.removeChild(eltDefTierType);
                eltDefTierType = null;
            }
        });
        var r = e.target.getBoundingClientRect();
        var c = window.document.documentElement.getBoundingClientRect();
        eltDefTierType.setAttribute("style", "position:fixed;top:-1000px;left:0px;background-color:lightblue;border:2px solid blue;font-size:1em;");
        document.body.appendChild(eltDefTierType);
        var x = eltDefTierType.getBoundingClientRect();
        var nt = r.top;
        if (r.top + x.height > c.bottom) nt = c.bottom - x.height;
        eltDefTierType.setAttribute("style", "position:fixed;top:" + nt + "px;left:" + (r.right) + "px;background-color:lightblue;border:2px solid blue;font-size:1em;");
        $(eltDefTierType).focus();
        return true;
    }

    /**
     * Load metadata from the object trjs.data.metadata wich contains information store in the XML file.
     * @method loadMetadata
     * @return : none
     */
    function loadMetadata() {
        var s = '<thead><td class="textcell1">Type</td><td class="textcell2"><span id="mprop"></span></td><td class="textcell3"><span id="mval"></span></td><td class="textcell4">Information</td></thead>';
        s += '<tbody>';
        s += stringLine4Val('codeMetadata', '<span id="tytitle">-</span>', '-', '', '<span id="infotytitle">-</span>', 'writehalf');
        s += stringLine4Val('codeMetadata', 'Transcription', '<span id="tyname">-</span>', '', '<span id="infotyname">-</span>', 'writehalf'); // put 'readonly' if edit the filename in metadata is not permitted anymore
        s += stringLine4Val('codeMetadata', 'Transcription', '<span id="tyloc">-</span>', '', '<span id="infotyloc">-</span>', 'readonly');
        s += stringLine4Val('codeMetadata', 'Transcription', '<span id="tydate">-</span>', '', '<span id="infotydate">-</span>', 'writehalf');
        s += stringLine4Val('codeMetadata', 'Transcription', '<span id="typlacen">-</span>', '', '<span id="infoplacen">-</span>', 'writehalf');
        s += stringLine4Val('codeMetadata', 'Media', '<span id="tymname">-</span>', '', '<span id="infotymname">-</span>', 'readonly');
        s += stringLine4Val('codeMetadata', 'Media', '<span id="tymrelloc">-</span>', '', '<span id="infotymrelloc">-</span>', 'readonly');
        s += stringLine4Val('codeMetadata', 'Media', '<span id="tymloc">-</span>', '', '<span id="infotymloc">-</span>', 'readonly');
        s += stringLine4Val('codeMetadata', 'Media', '<span id="tymtype">-</span>', '', '<span id="infotymtype">-</span>', 'readonly');
        s += stringLine4Val('codeMetadata', 'Media', '<span id="tymdur">-</span>', '', '<span id="infotymdur">-</span>', 'readonly');
        s += stringLine4Val('codeMetadata', '-', '-', '-', '---', 'readonly');
        /*
         * et on y ajoute les notes s'il y en a (compatibilité anciens formats)
         */
        if (trjs.data.note) {
            for (var i = 0; i < trjs.data.note.length; i++) {
                s += stringLine4Val('codeMetadata', trjs.data.note[i]['type'], trjs.data.note[i]['property'], trjs.data.note[i]['value'], trjs.data.note[i]['info']);
            }
        }
        s += stringLine4Val('codeMetadata', '-', '-', '-', '---', 'readonly');
        if (trjs.data.metadata) {
            for (var i = 0; i < trjs.data.metadata.length; i++) {
                s += stringLine4Val('codeMetadata', trjs.data.metadata[i]['type'], trjs.data.metadata[i]['property'], trjs.data.metadata[i]['value'], trjs.data.metadata[i]['info']);
            }
        }
        s += '</tbody>';
        $('#metadata').html(s);
    }

    /**
     * Structure of Dublin Core properties in metadata
     * @property dublinCoreProperties
     */
    var dublinCoreProperties = [
        'temptitle',
        'tempcreator',
        'tempsubject',
        'tempdesc',
        'temppub',
        'tempcont',
        'tempdate',
        'temptype',
        'tempformat',
        'tempid',
        'tempsrc',
        'templang',
        'temprel',
        'tempcov',
        'temprig'
    ];

    /**
     * Information about Dublin Core properties in metadata
     * @property dublinCoreShortInformation
     */
    var dublinCoreShortInformation = [
        'tititle',
        'ticreator',
        'tisubject',
        'tidesc',
        'tipub',
        'ticont',
        'tidate',
        'titype',
        'tiformat',
        'tiid',
        'tisrc',
        'tilang',
        'tirel',
        'ticov',
        'tiprig'
    ];

    /**
     * Full information about Dublin Core properties in metadata
     * @property dublinCoreInformation
     */
    var dublinCoreInformation = [
        'intititle',
        'inticreator',
        'intisubject',
        'intidesc',
        'intipub',
        'inticont',
        'intidate',
        'intitype',
        'intiformat',
        'intiid',
        'intisrc',
        'intilang',
        'intirel',
        'inticov',
        'intiprig'
    ];

    /**
     * read templates in the object trjs.data.template from information store in the XML file.
     * @method readTemplates
     * @param XML data structure (as loaded by DOMParser().parseFromString() )
     * @return none - data is in trjs.data.template and trjs.data.tiers
     * @see loadTemplates
     */
    function readTemplates(xml) {
        /*
         * Lecture des éléments du template au format de stockage définitif.
         * Si pas d'élément template, voir ci-deesous 'else'
         */
        if (!xml) return;
        var eltDesc = $(xml).find("templateDesc");
        if (eltDesc.length > 0) {
            trjs.log.alert('Old format: check and change file if possible');
            readTemplatesOldVersion(xml);
            return;
        }
        trjs.data.codesxml = [];
        trjs.data.tiersxml = [];
        var notesStmt = $(xml).find("notesStmt");
        if (notesStmt.length <= 0) return;
        var notes = $(notesStmt[0]).children();
        for (var n = 0; n < notes.length; n++) {
            if (notes[n].nodeName !== 'note') continue;
            if ($(notes[n]).attr("type") === "TEMPLATE_DESC") {
                var elt = $(notes[n]).children();
                for (var i = 0; i < elt.length; i++) {
                    if (elt[i].nodeName !== 'note') continue;
//				console.log('readTemplates '+i);
//				console.log(elt[i]);
                    var notetemplate = $(elt[i]).children();
                    // a note in TEMPLATE_DESC contains 3 notes with info for a given entry : code, parent, type, description
                    var e = new TemplateInfo();
                    for (var k = 0; k < notetemplate.length; k++) {
                        if (notetemplate[k].nodeName !== 'note') continue;
                        var attr = $(notetemplate[k]).attr('type');
                        switch (attr) {
                            case 'code':
                                e['code'] = $(notetemplate[k]).text();
                                break;
                            case 'type':
                                e['type'] = $(notetemplate[k]).text();
                                break;
                            case 'parent':
                                e['parent'] = $(notetemplate[k]).text();
                                break;
                            case 'description':
                                e['description'] = $(notetemplate[k]).text();
                                break;
                            // future for vc
                            case 'contentType':
                                e['contentType'] = $(notetemplate[k]).text();
                                break;
                            default:
                                break;
                        }
                    }
                    // normalisation
                    // - for parent in file, no parent, means main line
                    // annotationgrp for parent in file means dependent line
                    // *** for parent in file means dependent line
                    // INTERNAL VALUES
                    // none means main line (no parent)
                    // main means any type of secondary line (parent is main line)
                    if (!e['parent']) e['parent'] = 'none'; // is main line means no parent
                    if (e['parent'] === '-') e['parent'] = 'none';

                    // if (e['parent'] === 'none') e['parent'] = 'none';
                    if (e['parent'] === '***') e['parent'] = 'main';
                    if (e['parent'].toLowerCase() === 'annotationgrp') e['parent'] = 'main';
                    if (e['code'].toLowerCase() === 'annotationgrp') e['code'] = 'main';

                    if (e['parent'] === 'none') {
                        trjs.data.codesxml.push(e);
                    } else {
                        trjs.data.tiersxml.push(e);
                    }
                }
            }
        }
    }

    function readTemplatesOldVersion(xml) {
        /*
         * Lecture des éléments du template au format de stockage définitif.
         * Si pas d'élément template, voir ci-deesous 'else'
         */
        if (!xml) return;
        var eltDesc = $(xml).find("templateDesc");
        trjs.data.codesxml = [];
        trjs.data.tiersxml = [];
        if (eltDesc && eltDesc.length > 0) {
            var elt = eltDesc.children();
            if (elt && elt.length > 0) {
                for (var i = 0; i < elt.length; i++) {
                    if (elt[i].nodeName !== 'template') continue;
//				console.log('readTemplates '+i);
//				console.log(elt[i]);
                    var e = new TemplateInfo();
                    e['code'] = $(elt[i]).attr('code');
                    e['type'] = $(elt[i]).attr('type');
                    e['parent'] = $(elt[i]).attr('parent');
                    if (!e['parent']) e['parent'] = 'none';
                    if (e['parent'] === '-') e['parent'] = 'none';

                    if (e['parent'] === 'none') e['parent'] = 'none';
                    if (e['parent'] === '***') e['parent'] = 'main';
                    if (e['parent'].toLowerCase() === 'annotationgrp') e['parent'] = 'main';
                    if (e['code'].toLowerCase() === 'annotationgrp') e['code'] = 'ortho';
                    e['description'] = $(elt[i]).text();

                    if (e['parent'] === 'none') {
                        trjs.data.codesxml.push(e);
                    } else {
                        trjs.data.tiersxml.push(e);
                    }
                }
            }
        }
    }

    /**
     * initialize editing table for templates
     * @method initTableCodes
     * @param hdata data stored in memory
     */
    function initTableCodes(data) {
        var s = '<thead><td class="textcell1">Code</td><td class="textcell4"><span id="pmetaname">Name</span></td><td class="textcell6">Content</td><td class="textcell5">Description</td></thead>';
        s += '<tbody>';
        if (data.length < 1) {
            s += stringLineCodes('---', '', '', '');
        } else
            for (var i = 0; i < data.length; i++) {
                var c = data[i]['code'];
                var name = codeToName(c);
                s += stringLineCodes(c, name, data[i]['contentType'], data[i]['description']);
            }
        s += '</tbody>';
        $('#template-code').html(s);
    }

    /**
     * initialize editing table for templates
     * @method initTableTiers
     * @param hdata data stored in memory
     */
    function initTableTiers(data) {
        var s = '<thead><td class="textcell1">Tiers</td><td class="textcell2">Type</td><td class="textcell3">Parent</td><td class="textcell4"><span id="pmetaname">Name</span></td><td class="textcell6">Content</td><td class="textcell5">Description</td></thead>';
        s += '<tbody>';
        if (data.length < 1) {
            s += stringLineTiers('---', '', '', '', '', '');
        } else
            for (var i = 0; i < data.length; i++) {
                var c = data[i]['code'];
                var name = codeToName(c);
                s += stringLineTiers(c, data[i]['type'], data[i]['parent'], name, data[i]['contentType'], data[i]['description']);
            }
        s += '</tbody>';
        $('#template-tier').html(s);
    }

    /**
     * Load templates from the object trjs.data.template wich contains information store in the XML file.
     * @method loadTemplates
     * @return none
     * @see loadTemplates
     */
    function createTableTemplates() {
        /*
         * Initialize the codes (from the xml in templates, the names in xml, and the transcription to cover all information)
         */
        var done = {};
        if (trjs.data.codesxml) {
            /*
             * if template exists
             */
            for (var i = 0; i < trjs.data.codesxml.length; i++) {
                done[trjs.data.codesxml[i]["code"]] = true;
            }
        } else {
            trjs.data.codesxml = {}; // creates it
        }

        /*
         * Initialize now codesxml with data from transcription if missing information.
         */
        for (var i in trjs.data.codesdata) {
            if (done[i] !== true)
                trjs.data.codesxml.push({
                    'code': i,
                    'type': '-',
                    'parent': 'none',
                    'description': '',
                });
        }

        /*
         * Initialize the tiers (from the xml in templates, and the transcription to cover all information)
         */
        done = {};

        if (trjs.data.tiersxml) {
            /*
             * if template exists
             */
            for (var i = 0; i < trjs.data.tiersxml.length; i++) {
                var code = trjs.data.tiersxml[i]["code"];
                done[code] = true;
            }
        } else {
            trjs.data.tiersxml = {};
        }
        /*
         * Initialize now pdata with data from transcription if missing information.
         */
        for (var i in trjs.data.tiersdata) {
            if (done[i] !== true)
                trjs.data.tiersxml.push({
                    'code': i,
                    'type': trjs.data.ASSOC,
                    'parent': 'main',
                    'description': '',
                });
        }
    }

    function tableTemplates() {
        createTableTemplates();
        return {codes: trjs.data.codesxml, tiers: trjs.data.tiersxml};
    }

    function loadTemplates() {
        createTableTemplates();
        /*
         * init DOM
         */
        initTableCodes(trjs.data.codesxml);

        /*
         * init DOM
         */
        initTableTiers(trjs.data.tiersxml);
        imbricationLevels(); // compute the deepth of different tiers (relationship beetween parent and child) for clear output and saving
        /*
         contextMenu: ['row_above', 'row_below', 'remove_row', 'hsep1', 'undo', 'redo'],
         type: 'autocomplete',
         source: ['Symbolic Association', 'Time Subdivision', 'Symbolic Subdivision','Included In'],
         */
    }

    /**
     * read persons information in the object trjs.data.persons from information store in the XML file.
     * @method readPersons
     * @param XML data structure (as loaded by DOMParser().parseFromString() )
     * @return none - data is in trjs.data.persons
     * @see loadTemplates
     */
    function readPersons(xml) {
        var i, k;
        if (!xml) return;
        var partic = $(xml).find("particDesc");
        if (!partic || partic.length < 1) {
            trjs.data.persons = null;
            return;
        }
        var elt = $(partic[0]).find("person");
        if (!elt || elt.length < 1) {
            trjs.data.persons = null;
            return;
        }
        trjs.data.persons = new Array(elt.length);
        trjs.data.codesnames = {};
        for (i = 0; i < elt.length; i++) {
            trjs.data.persons[i] = new Person();
            trjs.data.persons[i]["age"] = trjs.dataload.checkstring($(elt[i]).attr('age'));
            trjs.data.persons[i]["role"] = trjs.dataload.checkstring($(elt[i]).attr('role'));
            var sx = trjs.dataload.checkstring($(elt[i]).attr('sex'));
            trjs.data.persons[i]["sex"] = (sx === "1") ? "M" : (sx === "2") ? "F" : "X";
            trjs.data.persons[i]["source"] = trjs.dataload.checkstring(elt[i].getAttribute('source'));
            var e = $(elt[i]).find('persName');
            if (e && e.length > 0)
                trjs.data.persons[i]["name"] = trjs.dataload.checkstring($(e[0]).text());
            else
                trjs.data.persons[i]["name"] = '';
            var e = $(elt[i]).find('socecStatus');
            if (e && e.length > 0)
                trjs.data.persons[i]["ses"] = trjs.dataload.checkstring($(e[0]).text());
            else
                trjs.data.persons[i]["ses"] = '';
            e = $(elt[i]).find('education');
            if (e && e.length > 0)
                trjs.data.persons[i]["educ"] = trjs.dataload.checkstring($(e[0]).text());
            else
                trjs.data.persons[i]["educ"] = '';
            e = $(elt[i]).find('langKnowledge');
            if (e && e.length > 0) {
                var esub = $(e[0]).find('langKnown');
                trjs.data.persons[i]["xml_lang"] = '';
                for (k = 0; k < esub.length - 1; k++)
                    trjs.data.persons[i]["xml_lang"] += trjs.dataload.checkstring($(esub[k]).text()) + ',';
                trjs.data.persons[i]["xml_lang"] += trjs.dataload.checkstring($(esub[k]).text());
            }
            else
                trjs.data.persons[i]["xml_lang"] = '';
            e = $(elt[i]).find('note');
            if (e && e.length > 0) {
                trjs.data.persons[i]["group"] = '';
                trjs.data.persons[i]["custom"] = '';
                trjs.data.persons[i]["id"] = 'x';
                for (k = 0; k < e.length; k++) {
                    if ($(e[k]).attr('type') === 'group')
                        trjs.data.persons[i]["group"] = trjs.dataload.checkstring($(e[k]).text());
                    if ($(e[k]).attr('type') === 'customField')
                        trjs.data.persons[i]["custom"] = trjs.dataload.checkstring($(e[k]).text());
                }
            }
            var lcode = trjs.dataload.checkstring($(elt[i]).attr('code'));
            /*
             * Old style
             */
            if (lcode)
                trjs.data.codesnames[lcode] = trjs.data.persons[i]["name"];
            /*
             * New style
             */
            var codes = elt[i].getElementsByTagName('altGrp');
            if (!codes || codes.length < 1) continue;
            codes = codes[0].getElementsByTagName('alt');
            if (!codes || codes.length < 1) continue;
            for (var k = 0; k < codes.length; k++) {
                var c = trjs.dataload.checkstring(codes[k].getAttribute('type'));
                trjs.data.codesnames[c] = trjs.data.persons[i]["name"];
            }
        }
    }

    /**
     * read metadata information in the object trjs.data.metadata from information store in the XML file.
     * @method readMediaInfo
     * @param XML data structure (as loaded by DOMParser().parseFromString() )
     * @param name of the trancription file
     * @return none - data is in trjs.data.persons
     * @see loadTemplates
     */
    function readMediaInfo(xml) {
        var elt = $(xml).find("TEI");
        if (!elt || elt.length < 1) {
            trjs.data.setRecordingLang('unk');
            /*
             if (trjs.log)
             trjs.log.alert(trjs.messgs.noteif);
             else
             console.log(trjs.messgs.noteif);
             */
            return;
        }
        elt = $(elt[0]);
        trjs.data.setRecordingLang(elt.attr('xml:lang'));
        var ver = elt.attr('version');
        if (ver)
            trjs.data.version = ver;
        else
            trjs.data.version = 'unknown';
        elt = $(xml).find("publicationStmt");
        if (elt && elt.length > 0)
            trjs.data.publicationStmt = $(elt[0]).html();
        else
            trjs.data.publicationStmt = '';
        elt = $(xml).find("settingDesc");
        if (elt && elt.length > 0) {
            elt2 = $(elt[0]).find("place");
            if (elt2 && elt2.length > 0) {
                var pn = $(elt2[0]).find('placeName');
                if (pn && pn.length > 0)
                    trjs.data.setRecordingPlaceName($(pn[0]).text()); // elt2.textContent;
            }
            elt2 = $(elt[0]).find("setting");
            if (elt2 && elt2.length > 0) {
                trjs.data.textDesc = [];
                for (var i = 0; i < elt2.length; i++) {
                    var tdiv = new TextDesc();
                    tdiv['xml_id'] = $(elt2[i]).attr('xml:id');
                    var desc = $(elt2[i]).attr("activity");
                    if (desc && desc.length > 0)
                        tdiv['text'] = $(desc[0]).text();
                    else
                        tdiv['text'] = "";
                    trjs.data.textDesc.push(tdiv);
                }
            }
        } else
            trjs.data.textDesc = null;
        /*
         * load the headers (with the exception of template already read)
         */
        elt = xml.getElementsByTagName("title");
        if (elt != null && elt.length > 0)
            trjs.data.setRecordingTitle(trjs.dataload.checkstring(elt[0].textContent));
        var eltStmt = xml.getElementsByTagName("recordingStmt");
        if (eltStmt != null && eltStmt.length > 0) {
            elt = eltStmt[0].getElementsByTagName("recording");
            if (elt != null && elt.length > 0) {
                // get information about media
                var elt2 = elt[0].getElementsByTagName("date");
                if (elt2 && elt2.length > 0) {
                    trjs.data.setRecordingDate(trjs.dataload.checkstring(elt2[0].textContent));
                    trjs.data.setMediaDuration(elt2[0].getAttribute('dur'));
                }
                elt2 = elt[0].getElementsByTagName("time");
                if (elt2 && elt2.length > 0) {
                    trjs.data.setRecordingTime(elt2[0].getAttribute('when'));
                }

                // there can be an unlimited number of <media> fields
                elt2 = elt[0].getElementsByTagName("media");
                if (elt2 && elt2.length > 0) {
                    trjs.data.media = new Array(elt2.length);
                    for (var k = 0; k < elt2.length; k++) {
                        trjs.data.media[k] = new MediaDesc();
                        var url = trjs.dataload.checkstring(elt2[0].getAttribute('url'));
                        if (!url) {
                            trjs.data.media[k].name = trjs.dataload.checkstring(elt2[0].getAttribute('mediaName'));
                            trjs.data.media[k].loc = trjs.dataload.checkstring(elt2[0].getAttribute('mediaLocation'));
                        } else {
                            var fp = trjs.utils.urlToPath(url);
                            trjs.data.media[k].name = fp.name;
                            trjs.data.media[k].loc = fp.loc;
                        }
                        trjs.data.media[k].type = elt2[0].getAttribute('mimeType');
                        trjs.data.media[k].realFile = trjs.data.media[k].loc + '/' + trjs.data.media[k].name;
                    }
                }
            }
        }
        /*
         * load the encoding information (information about the sofware)
         */
        elt = xml.getElementsByTagName("encodingDesc");
        if (elt != null && elt.length != 0) {
            elt2 = elt[0].getElementsByTagName("appInfo");
            if (elt2 && elt2.length != 0) {
                var elt3 = elt2[0].getElementsByTagName("application");
                if (elt3 && elt3.length != 0) {
                    trjs.data.setAppInfo(elt3[0].getAttribute('ident'));
                }
            }
        }

        /*
         * load the revision information (information about the sofware)
         */
        trjs.data.revision = [];
        elt = xml.getElementsByTagName("revisionDesc");
        if (elt != null && elt.length != 0) {
            elt = elt[0].getElementsByTagName("list");
            if (elt != null && elt.length != 0) {
                elt2 = elt[0].getElementsByTagName("note");
                if (elt2 && elt2.length != 0) {
                    for (var k = 0; k < elt2.length; k++) {
                        var a = elt2[k].getAttribute('type');
                        if (a === 'url' || a === 'name' || a === 'lastsave') continue;
                        var c = elt2[k].textContent;
                        trjs.data.revision.push({type: a, value: c});
                    }
                }
            }
        }
        if (trjs.data.getAppInfo() !== trjs.data.appName) {
            trjs.data.revision.push({type: 'original', value: trjs.data.getAppInfo()});
            trjs.data.setAppInfo(trjs.data.appName);
        }
    }

    function createEmptyMetadata() {
        trjs.data.metadata = [];
        /*
         * sinon on crée un nouveau template (pour les fichiers nouveaux).
         */
        for (var i = 0; i < 15; i++) {
            if (dublinCoreProperties[i] === 'temptitle')
                trjs.data.metadata.push({
                    'type': 'DublinCore',
                    'property': '<span id="' + dublinCoreProperties[i] + '">-</span>',
                    'value': trjs.data.recTitle,
                    'info': '<span id="' + dublinCoreShortInformation[i] + '" data-toggle="tooltip" data-placement="right" title="-">-</span>',
                });
            else
                trjs.data.metadata.push({
                    'type': 'DublinCore',
                    'property': '<span id="' + dublinCoreProperties[i] + '">-</span>',
                    'value': '',
                    'info': '<span id="' + dublinCoreShortInformation[i] + '" data-toggle="tooltip" data-placement="right" title="-">-</span>',
                });
        }
    }

    /**
     * read metadata information in the object trjs.data.metadata from information store in the XML file.
     * @method readMetadata
     * @param XML data structure (as loaded by DOMParser().parseFromString() )
     * @return none - data is in trjs.data.persons
     * @see loadTemplates
     */
    function readMetadata(xml) {
        /*
         * lecture des notes et des métadonnées
         */
        if (!xml) return;
        trjs.data.metadata = [];
        trjs.data.note = [];
        var notesStmt = $(xml).find("notesStmt");
        if (notesStmt.length <= 0) return;
        var notes = $(notesStmt[0]).children();
        for (var n = 0; n < notes.length; n++) {
            if (notes[n].nodeName !== 'note') continue;
            if ($(notes[n]).attr("type") === "COMMENTS_DESC") {
                var elt = $(notes[n]).children();
                for (var i = 0; i < elt.length; i++) {
                    if (elt[i].nodeName !== 'note') continue;
                    // a note in COMMENTS_DESC contains an attribute type and its value (text)
                    var value = $(elt[i]).text();
                    var type = $(elt[i]).attr('type');
                    trjs.data.note.push({info: '', type: 'Note', value: value, property: type});
                }
            }
            if ($(notes[n]).attr("type") === "METADATA_DESC") {
                var elt = $(notes[n]).children();
                for (var i = 0; i < elt.length; i++) {
                    if (elt[i].nodeName !== 'note') continue;
                    var notetemplate = $(elt[i]).children();
                    // a note in METADATA_DESC contains 4 notes with info for a given entry : info, property, value, type
                    var info = '', type = '', value = '', property = '';
                    for (var k = 0; k < notetemplate.length; k++) {
                        if (notetemplate[k].nodeName !== 'note') continue;
                        var attr = $(notetemplate[k]).attr('type');
                        switch (attr) {
                            case 'info':
                                info = $(notetemplate[k]).text();
                                break;
                            case 'value':
                                value = $(notetemplate[k]).text();
                                break;
                            case 'type':
                                type = $(notetemplate[k]).text();
                                break;
                            case 'property':
                                property = $(notetemplate[k]).text();
                                break;
                            default:
                                break;
                        }
                    }
                    trjs.data.metadata.push({info: info, type: type, value: value, property: property});
                }
            }
        }
        if (trjs.data.metadata.length < 1) createEmptyMetadata();
        if (trjs.data.note.length < 1) {
            trjs.data.note.push({info: 'Note', type: '', value: '', property: ''});
        }
    }

    /**
     * Load persons information from the object trjs.data.persons wich contains information store in the XML file.
     * @method loadPersons
     * @return : none
     */
    function tablePersons() {
        var pdata = [];
        if (trjs.data.persons) {
            for (var i = 0; i < trjs.data.persons.length; i++) {
                pdata.push({
                    // 'Code': trjs.data.persons[i]["code"],
                    'ID': trjs.data.persons[i]["id"],
                    'Name': trjs.data.persons[i]["name"],
                    'Age': trjs.data.persons[i]["age"],
                    'Role': trjs.data.persons[i]["role"],
                    'Sex': trjs.data.persons[i]["sex"],
                    'Lang': trjs.data.persons[i]["xml_lang"],
                    'Group': trjs.data.persons[i]["group"],
                    'SES': trjs.data.persons[i]["ses"],
                    'Educ': trjs.data.persons[i]["educ"],
                    'Source': trjs.data.persons[i]["source"],
                    'Info': trjs.data.persons[i]["custom"]
                });
            }
            if (pdata.length === 0) {
                pdata.push({
                    // 'Code': "xxx",
                    'ID': "x",
                    'Name': "---",
                    'Age': "",
                    'Role': "",
                    'Sex': "",
                    'Lang': "",
                    'Group': "",
                    'SES': "",
                    'Educ': "",
                    'Source': "",
                    'Info': "",
                });
            }
        } else {
            pdata.push({
                // 'Code': "xxx",
                'ID': "x",
                'Name': "---",
                'Age': "",
                'Role': "",
                'Sex': "",
                'Lang': "",
                'Group': "",
                'SES': "",
                'Educ': "",
                'Source': "",
                'Info': "",
            });
        }
        return pdata;
    }

    function loadPersons() {
        var pdata = tablePersons();
        initTablePersons(pdata);
    }

    function codeToName(code) {
        if (trjs.data.codesnames[code])
            return trjs.data.codesnames[code];
        return '';
        /*
         var table = $("#participant");
         var tablelines = $('tr', table[0]);
         for (var i = 1; i < tablelines.length; i++) {
         var icode = trjs.dataload.checkstring(trjs.events.lineGetCell( $(tablelines[i]), 0));  // codes
         var iname = trjs.dataload.checkstring(trjs.events.lineGetCell( $(tablelines[i]), 2));  // names
         if (icode === code)
         return iname ? iname : code;
         }
         */
    };

    function codeToNameInit(code) {
        for (i in trjs.data.persons)
            if (code === trjs.data.persons[i].code)
                return (trjs.data.persons[i].name) ? trjs.data.persons[i].name : code;
        return code;
    };

    function nameToCode(name) {
        for (var i in trjs.data.codesnames) {
            if (trjs.data.codesnames[i] === name)
                return i;
        }
        return '';
        /*
         var table = $("#participant");
         var tablelines = $('tr', table[0]);
         for (var i = 1; i < tablelines.length; i++) {
         var icode = trjs.dataload.checkstring(trjs.events.lineGetCell( $(tablelines[i]), 0));  // codes
         var iname = trjs.dataload.checkstring(trjs.events.lineGetCell( $(tablelines[i]), 2));  // names
         if (iname === name)
         return icode ? icode : name;
         }
         */
    };

    /**
     * creates a string containing the persons
     * @method stringLine11Val
     * @param {string} id
     * @param {string} name
     * @param {string} age
     * @param {string} role
     * @param {string} sex
     * @param {string} xmllang
     * @param {string} group
     * @param {string} ses
     * @param {string} educ
     * @param {string} source
     * @param {string} custom
     * @return {string} constructed html string
     */
    function stringLine11Val(id, name, age, role, sex, xmllang, group, ses, educ, source, custom) {
        return '<tr><td class="textcell2" contenteditable="true">' + trjs.dataload.checkstring(id)
            + '</td><td class="textcell3" contenteditable="true">' + trjs.dataload.checkstring(name)
            + '</td><td class="textcell4" contenteditable="true">' + trjs.dataload.checkstring(age)
            + '</td><td class="textcell5" contenteditable="true">' + trjs.dataload.checkstring(role)
            + '</td><td class="textcell6" contenteditable="true">' + trjs.dataload.checkstring(sex)
            + '</td><td class="textcell7" contenteditable="true">' + trjs.dataload.checkstring(xmllang)
            + '</td><td class="textcell8" contenteditable="true">' + trjs.dataload.checkstring(group)
            + '</td><td class="textcell9" contenteditable="true">' + trjs.dataload.checkstring(ses)
            + '</td><td class="textcell10" contenteditable="true">' + trjs.dataload.checkstring(educ)
            + '</td><td class="textcell11" contenteditable="true">' + trjs.dataload.checkstring(source)
            + '</td><td class="textcell12" contenteditable="true">' + trjs.dataload.checkstring(custom)
            + '</td></tr>';
    }

    /**
     * initialize editing table for persons
     * @method initTablePersons
     * @param hdata data stored in memory
     */
    function initTablePersons(data) {
        var s = '<thead><td class="textcell2">ID</td><td class="textcell3"><span id="ppname">Name</span></td><td class="textcell4">Age</td>';
        s += '<td class="textcell5">Role</td><td class="textcell6"><span id="ppsex">Sex</span></td><td class="textcell7"><span id="pplangu">Lang</span></td><td class="textcell8"><span id="ppgroup">Group</span></td>';
        s += '<td class="textcell9">SES</td><td class="textcell10">Education</td><td class="textcell11">Source</td><td class="textcell12">Information</td></thead>';
        s += '<tbody>';
        if (data.length < 1)
            s += stringLine11Val('-', '---', '',
                '', '', '', '',
                '', '', '', '');
        else
            for (var i = 0; i < data.length; i++) {
                s += stringLine11Val(data[i]['ID'], data[i]['Name'], data[i]['Age'],
                    data[i]['Role'], data[i]['Sex'], data[i]['Lang'], data[i]['Group'],
                    data[i]['SES'], data[i]['Educ'], data[i]['Source'], data[i]['Info']);
            }
        s += '</tbody>';
        $('#participant').html(s);
    }

    /**
     * slits the text of a div into type and subtype
     * @method splitDoubleText
     * @param {string} text of div
     * @returns {object} an object with type and subtype fields
     */
    function splitDoubleText(div) {
        try {
            var a = $(div);
            var type = a.find('.ttype').text();
            if (type.length < 1) {
                return {type: '#', subtype: a.text()};
            }
            var subtype = a.find('.tsubtype').text();
            return {type: type, subtype: subtype};
        } catch (e) {
            return {type: '#', subtype: div};
        }
    }

    /**
     * compute the deepth of different tiers (relationship beetween parent and child) for clear output and saving
     * can be called after each update
     * @method imbricationLevels
     * @returns true if the values have changed since last time
     */
    function imbricationLevels() {
        var newvalues = {}; // this will hold the new values computed

        var table = $("#template-code");
        var tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
            if (newvalues[icode]) {
                continue;
            }
            // we found a code that is not described.
            newvalues[icode] = 1;
        }

        table = $("#template-tier");
        tablelines = $('tr', table[0]);
        var ntodo = tablelines.length;
        while (ntodo > 0) {
            var didsomething = false;
            for (var i = 1; i < tablelines.length; i++) {
                var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
                var ipar = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 2));
                if (newvalues[icode]) {
                    continue;
                }
                // we found a code that is not described.
                if (ipar === '-' || !ipar) { // if no parent
                    newvalues[icode] = 1;
                    ntodo--;
                    didsomething = true;
                    continue;
                }
                var p = newvalues[ipar];
                if (!p) // connot process because we have no information about the parent
                    continue;
                newvalues[icode] = p + 1; // imbrication is one more than the parent
                ntodo--;
                didsomething = true;
            }
            if (didsomething === false) // the complete computation cannot be performed because the data are not correct
                break;
        }
        if (!trjs.data.imbrication) {
            trjs.data.imbrication = newvalues;
            return true;
        }
        var changed = false;
        for (i in newvalues) {
            if (trjs.data.imbrication[i] !== newvalues[i]) {
                changed = true;
                trjs.data.imbrication[i] = newvalues[i];
            }
        }
        // suppress unused old values
        for (i in trjs.data.imbrication) {
            if (!newvalues[i]) {
                delete trjs.data.imbrication[i];
                changed = true;
            }
        }
        return changed;
    }

    function mimeType(url, type) {
        var ext = trjs.utils.extensionName(url);
        switch (ext) {
            case '.wav':
                return 'audio/wav';
            case '.mp3':
                return 'audio/mpeg';
            case '.mp4':
                return 'video/mp4';
            case '.webm':
                return 'video/webm';
        }
        return type;
    }

    /**
     * write down all data from the tables for metadata, persons, and templates in
     * the header for the TEI format
     * @method saveTEIHeaderToString
     * @return string containing xml format
     */
    function saveTEIHeaderToString() {
        trjs.data.getNamesFromEdit();
        var s = '<teiHeader>\n<fileDesc>\n<titleStmt>\n<title>' + trjs.dataload.checkstring(trjs.data.title) + '</title>\n</titleStmt>\n';
        s += '<publicationStmt>';
        s += trjs.utils.notnull(trjs.data.publicationStmt);
        s += '</publicationStmt>\n';

        // for (p in trjs.data) { console.log(p); console.log(typeof trjs.data[p]); 	}

        s += '<notesStmt>\n';

        s += '<note type="COMMENTS_DESC">\n';
        var table = $("#metadata");
        var tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var itype = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
            var iprop = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 1));
            var ival = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 2));
            var iinf = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 3));
            if (!itype || itype === '-' || itype.toLowerCase() !== 'note') continue;
            if (itype.toLowerCase() !== 'media' && itype.toLowerCase() !== 'transcription' && itype.toLowerCase() !== 'title' && itype.toLowerCase() !== 'titre') {
                s += '<note type="' + iprop + '">' + ival + '</note>\n';
            }
        }
        s += '</note>\n';

        s += '<note type="METADATA_DESC">\n';
        var table = $("#metadata");
        var tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var itype = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
            var iprop = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 1));
            var ival = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 2));
            var iinf = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 3));
            if (!itype || itype === '-' || itype.toLowerCase() === 'note') continue;
            if (itype.toLowerCase() !== 'media' && itype.toLowerCase() !== 'transcription' && itype.toLowerCase() !== 'title' && itype.toLowerCase() !== 'titre') {
                s += '<note>\n';
                s += '<note type="property">' + iprop + '</note>\n';
                s += '<note type="type">' + itype + '</note>\n';
                s += '<note type="value">' + ival + '</note>\n';
                s += '<note type="info">' + iinf + '</note>\n';
                s += '</note>\n';
            }
        }
        s += '</note>\n';

        s += '<note type="TEMPLATE_DESC">\n';
        table = $("#template-code");
        tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
            var iname = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 1));
            var ict = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 2));
            var idesc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 3));
            if (icode == '' && itype === '' && ict === '' && idesc == '') continue;
            s += '<note>\n';
            s += '<note type="code">' + icode + '</note>\n';
            s += '<note type="contentType">' + ict + '</note>\n';
            s += '<note type="parent">none</note>\n';
            s += '<note type="description">' + idesc + '</note>\n';
            s += '</note>\n';
        }
        table = $("#template-tier");
        tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var icode = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
            var itype = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 1));
            var iparent = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 2));
            // var iname = trjs.dataload.checkstring(trjs.events.lineGetCell( $(tablelines[i]), 3));
            var ict = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 4));
            var idesc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 5));
            if (icode == '' && itype === '' && ict === '' && idesc == '') continue;
            s += '<note>\n';
            s += '<note type="code">' + icode + '</note>\n';
            s += '<note type="type">' + itype + '</note>\n';
            if (!iparent) iparent = 'none';
            if (iparent === '-') iparent = 'main';
            s += '<note type="parent">' + iparent + '</note>\n';
            s += '<note type="contentType">' + ict + '</note>\n';
            s += '<note type="description">' + idesc + '</note>\n';
            s += '</note>\n';
        }
        s += '</note>\n';
        s += '</notesStmt>\n';

        s += '<sourceDesc>\n<recordingStmt>';
        s += '<recording>\n';
        if (trjs.data.media)
            for (var i = 0; i < trjs.data.media.length; i++) {
                s += '<media url="' + trjs.data.media[i].loc + '/' + trjs.data.media[i].name
                    + '" mediaType="' + mimeType(trjs.data.media[i].name, trjs.data.media[i].type) + '" />\n';
                s += '<date dur="' + trjs.data.mediaDuration() + '">' + trjs.dataload.checkstring(trjs.data.recordingDate()) + '</date>\n';
            }
        s += '</recording>\n';
        s += '</recordingStmt>\n</sourceDesc>\n';

        s += '</fileDesc>\n';

        s += '<profileDesc>\n';
        s += '<settingDesc>\n';
        s += '<place>\n';
        s += '<placeName>' + trjs.dataload.checkstring(trjs.data.recordingPlaceName()) + '</placeName>\n';
        s += '</place>\n';
        // lister tous les @div+
        var tablelines = trjs.transcription.tablelines();
        if (trjs.data.textDesc != null) delete trjs.data.textDesc;
        trjs.data.textDesc = [];
        var k = 0;
        for (var i = 0; i < tablelines.length; i++) {
            var iloc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), trjs.data.CODECOL));
            if (iloc === '+div+') {
                var itrans = trjs.dataload.checkstring(trjs.events.lineGetCellHtml($(tablelines[i]), trjs.data.TRCOL));
                if (itrans !== '') {
                    var divtext = splitDoubleText(itrans);
                    if (divtext.subtype !== '') {
                        var tdiv = new TextDesc();
                        tdiv['xml_id'] = 'd' + k;
                        k++;
                        tdiv['text'] = trjs.transcription.xmlEntitiesEncode(divtext.subtype);
                        trjs.data.textDesc.push(tdiv);
                    }
                }
            }
        }
        if (trjs.data.textDesc != null)
            for (var i = 0; i < trjs.data.textDesc.length; i++) {
                s += '<setting xml:id="' + trjs.data.textDesc[i]["xml_id"] + '">\n';
                s += '<activity>' + trjs.data.textDesc[i]["text"] + '</activity></setting>\n';
            }
        s += '</settingDesc>\n';
        s += '<particDesc><listPerson>\n';

        table = $("#participant");
        tablelines = $('tr', table[0]);
        for (var i = 1; i < tablelines.length; i++) {
            var iid = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 0));
            var iname = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 1));
            var iage = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 2));
            var irol = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 3));
            var isex = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 4));
            var ilg = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 5));
            var igrp = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 6));
            var ises = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 7));
            var ieduc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 8));
            var isrc = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 9));
            var icust = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[i]), 10));
            if (iid === '' && iname === '' && iage === '' && irol === '' && isrc === '') continue;

            s += '<person\n';
            if (trjs.transcription.isnotbl(iid)) s += 'xml:id="' + iid + '"\n';
            if (trjs.transcription.isnotbl(iage)) s += 'age="' + iage + '"\n';
            if (trjs.transcription.isnotbl(irol)) s += 'role="' + irol + '"\n';
            if (trjs.transcription.isnotbl(isex)) {
                if (isex.toLowerCase() === 'm')
                    s += 'sex="1"\n';
                else if (isex.toLowerCase() === 'f')
                    s += 'sex="2"\n';
                else
                    s += 'sex="9"\n';
            }
            if (trjs.transcription.isnotbl(isrc)) s += 'source="' + isrc + '"\n';
            s += '>\n';
            if (trjs.transcription.isnotbl(iname))
                s += '<persName>' + iname + '</persName>\n';
            if (trjs.transcription.isnotbl(ilg)) {
                var ilgs = ilg.split(/[,\s]/);
                s += '<langKnowledge>\n';
                for (var ll = 0; ll < ilgs.length; ll++)
                    s += '<langKnown>' + ilgs[ll] + '</langKnown>\n';
                s += '</langKnowledge>';
            }
            if (trjs.transcription.isnotbl(ises)) s += '<socecStatus>' + ises + '</socecStatus>\n';
            if (trjs.transcription.isnotbl(ieduc)) s += '<education>' + ieduc + '</education>\n';
            if (trjs.transcription.isnotbl(igrp)) {
                s += '<note type="group">' + igrp + '</note>\n';
            }
            if (trjs.transcription.isnotbl(icust)) {
                s += '<note type="customField=">' + icust + '</note>\n';
            }
            s += '<altGrp>';
            for (var k in trjs.data.codesnames) {
                if (trjs.data.codesnames[k] === iname)
                    s += '<alt type="' + k + '" />';
            }
            s += '</altGrp>';
            s += '</person>';
        }
        s += '</listPerson></particDesc>\n</profileDesc>\n';

        s += '<encodingDesc>\n';
        s += '<appInfo>\n';
        s += '<application ident="' + version.appName + '" />\n';
        s += '</appInfo>\n';
        s += '</encodingDesc>\n';

        s += '<revisionDesc>\n';
        s += '<list>\n';
        for (i = 0; i < trjs.data.revision.length; i++) {
            s += '<item>' + trjs.data.revision[i].type + ' ' + trjs.data.revision[i].value + '</item>\n';
        }
        var d = new Date();
        s += '<item>lastsave: ' + d.toString() + '</item>\n';
        s += '<item>url: ' + trjs.data.recordingLoc() + '/' + trjs.data.recordingName() + '</item>\n';
        s += '<item>name: ' + trjs.data.recTitle + '</item>\n';
        s += '</list>\n';
        s += '</revisionDesc>\n';

        s += '</teiHeader>\n';
        return s;
    }

    /**
     * handle keys pressed down in the transcript editor and metadata editor
     * @method eventKeydownParticipant
     * @param {event} e
     */
    function eventKeydownParticipant(e) {
        var s = '<tr><td class="textcell1" contenteditable="true">xxx</td><td class="textcell2" contenteditable="true"></td><td class="textcell3" contenteditable="true"></td><td class="textcell4" contenteditable="true"></td>';
        s += '<td class="textcell5" contenteditable="true"></td><td class="textcell6" contenteditable="true"></td><td class="textcell7" contenteditable="true"></td><td class="textcell8" contenteditable="true"></td>';
        s += '<td class="textcell9" contenteditable="true"></td><td class="textcell10" contenteditable="true"></td><td class="textcell11" contenteditable="true"></td><td class="textcell12" contenteditable="true"></td>';
        s += '</tr>';
        eventKeydownBasic(e, s);
    }

    /**
     * handle keys pressed down in the transcript editor and metadata editor and person editor
     * @method eventKeydownBasic
     * @param {event} e
     * @param {string} default value for new lines
     */
    function eventKeydownBasic(e, pat) {
        var selectedLine = $(e.target).parent();
        var selectedClass = $(e.target).attr('class');
        var k = selectedClass.indexOf(' ');
        trjs.data.eventAnnex = true;
        if (k > -1)
            selectedClass = selectedClass.substr(0, k);
        // if (trjs.events.eventKeydownDefault(e) === true) return;
        if (e.keyCode === 9) { // Tab
            if (e.altKey === true) return false;
            if (e.ctrlKey === true) return false;
            if (e.metaKey === true) return false;
            e.preventDefault();
            var selectedCell = $(e.target);
            if (e.shiftKey === true) {
                var newfocus = selectedCell.prev();
                if (newfocus.length >= 1)
                    $(newfocus[0]).focus();
            } else {
                var newfocus = selectedCell.next();
                if (newfocus.length >= 1)
                    $(newfocus[0]).focus();
            }
            return true;
        }
        if (e.keyCode === 38) { // Key Up
            e.preventDefault();
            var prevline = selectedLine.prev();
            if (prevline.length >= 1) {
                $('.' + selectedClass, prevline[0]).focus();
            }
            return true;
        }
        if (e.keyCode === 40) { // Key Down
            e.preventDefault();
            var nextline = selectedLine.next();
            if (nextline.length >= 1) {
                $('.' + selectedClass, nextline[0]).focus();
            }
            return true;
        }
        if (e.keyCode === 68) { // ctrl D
            if (e.ctrlKey === true) {
                e.preventDefault();
                var all = selectedLine.parent();
                if (all.children().length < 2) {
                    trjs.log.alert(trjs.messgs.cannotlast);
                    return;
                }
                if ((all.parent())[0].id == 'metadata' && selectedLine[0].sectionRowIndex < 26) {
                    trjs.log.alert(trjs.messgs.cannotdelete);
                    return;
                }
                var prevline = selectedLine.prev();
                selectedLine.remove(); // delete current line
                $('.' + selectedClass, prevline[0]).focus();
            }
            return true;
        }
        if (e.keyCode === 73) { // ctrl I
            if (e.ctrlKey === true) {
                e.preventDefault();
                /*console.log(selectedLine.parent().parent());
                 console.log(selectedLine);
                 console.log(selectedLine.parent().parent().id);
                 console.log(selectedLine[0].sectionRowIndex);*/
                if ((selectedLine.parent().parent())[0].id == 'metadata' && selectedLine[0].sectionRowIndex < 26) {
                    trjs.log.alert(trjs.messgs.cannotinsert);
                    return;
                }
                var s = pat;
                selectedLine.after(s); // inserts after current sibbling ?
                var nextline = selectedLine.next();
                $('.' + selectedClass, nextline[0]).focus();
            }
            return true;
        }
        if (e.keyCode === 13) { // return Key
            e.preventDefault();
            var nextline = selectedLine.next();
            if (nextline.length < 1) {
                // create a new line at the end
                var s = pat;
                selectedLine.parent().append(s); // inserts at the end
                var nextline = selectedLine.next();
                $('.' + selectedClass, nextline[0]).focus();
            } else {
                $('.' + selectedClass, nextline[0]).focus();
            }
            return true;
        }
        return false;
    }

    return {
        checkCodeName: checkCodeName,
        checkCodeType: checkCodeType,
        checkTierType: checkTierType,
        checkContentType: checkContentType,
        codeToName: codeToName,
        definedTierType: definedTierType,
        codeToNameInit: codeToNameInit,
        eventKeydownParticipant: eventKeydownParticipant,
        eventKeydownTMCode: eventKeydownTMCode,
        eventKeydownTMTier: eventKeydownTMTier,
        eventKeydownTMMeta: eventKeydownTMMeta,
        imbricationLevels: imbricationLevels,
        loadMetadata: loadMetadata,
        loadPersons: loadPersons,
        loadTemplates: loadTemplates,
        nameToCode: nameToCode,
        MediaDesc: MediaDesc,
        Person: Person,
        readMediaInfo: readMediaInfo,
        readTemplates: readTemplates,
        readMetadata: readMetadata,
        readPersons: readPersons,
        saveTEIHeaderToString: saveTEIHeaderToString,
        setMedia: setMedia,
        splitDoubleText: splitDoubleText,
        tablePersons: tablePersons,
        tableTemplates: tableTemplates,
        TemplateInfo: TemplateInfo,
    };
})();
