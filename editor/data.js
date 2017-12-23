/**
 * <p>Data of the software</p>
 * date: june 2014
 * @module Data
 * @author Christophe Parisse
 */

'use strict';

/**
 * object for storing information about the opened files
 * @constructor trjs.data
 */
trjs.data = {
    version: '0.8', // last version of TEI for Oral (trjs version)
    appName: 'ortolang_tei_corpo',
    leftBracket: '❮', // 27EA - '❮', // '⟨' 27E8 - '❬'
    rightBracket: '❯', // 27EB - '❯', // '⟩' 27E9 - '❭' - 276C à 2771 ❬ ❭ ❮ ❯ ❰ ❱
    leftEvent: '[', // 27E6 - '『', // 300E - '⌈', // u2308 '⟦'
    rightEvent: ']', // 27E7 - '』', // 300F - '⌋', // u230b '⟧'
	leftParent: '⌈', // 2045 // '⁘', // 2058 // '⁑' // 2051 '⁅'
	rightParent: '⌋', // 2046 // '⁘', // 2058 '⁆'
	leftCode: '{', // 231C - '⁌', // 204C '⌜' // ▷ 25B7
	rightCode: '}', // 231F - '⁍', // 204D '⌟' // ◁ 25C1

	NEWRECNAME: 'new.trjs',
	NOMEDIA: '*NoMedia*',
	LOCALDIR: '*Local*',
    UNKNOWNDIR: '*Unknown*',
	// MARK: '∿',
	MARK: '✖',

	// general information about a recording
	recTitle: '', // the title of the transcription
	recPlaceName: '', // recording place name
	recDate: '', // recording date
	recLang: '', // language(s) for the transcription

	// the two names above contains the names as coded in the server (escaped characters and special codes for file location)
	// they are also used as temporary file names and to store data in localStorage (to be replaced later by database storage)
	recRealFile: '', // the full file name of the transcript as loaded from the disk

	// names of files as presented to the user
	recName: '', // name of the recording (the file) - should be the same as recordingRealFile but can be temporarily different for editing purposes
	recLoc: this.UNKNOWNDIR, // location of the recording (the directory)

	maxLinkingTime: 0, // highest number in the linking information -- used to correct medDuration if this data is not available

	media: [],  // set of media files

	selectedLine: null, // currently selected line
	prevSelectedLineColor: null, // previous color of selected line

	isMediaReady: false,

	lastLoc: '', // last location for files
	getLastLoc: function() { return this.lastLoc; },
	setLastLoc: function(loc) { this.lastLoc = loc; },

	lastSelected: -1, // last line where a selection was done
	selectedPart: false, // if false means nothing is currently selected
	multipleSelect: false, // no multiple selection by default

	initRec: function() {
		this.multipleSelect = false; // no multiple selection by default
	    this.recTitle = '';
	    this.recDate = '';
	    this.recPlaceName = '';
	    this.recLang = '';
	    this.recRealFile = '';
	},

	initMedia: function() {
		this.media = [];
		this.media[0] = new trjs.template.MediaDesc();
		trjs.template.setMedia(this.media[0]);
	},

	// direct access to the data (the access to the media will be extended later to several medias)
	recordingTitle: function() {
		return this.recTitle;
	},
	recordingPlaceName: function() {
		return this.recPlaceName;
	},
	recordingDate: function() {
		return this.recDate;
	},
	recordingTime: function() {
		return this.recTime;
	},
	recordingLang: function() {
		return this.recLang;
	},
	recordingRealFile: function() {
		return this.recRealFile;
	},
	recordingName: function() {
		return this.recName;
	},
	recordingLoc: function() {
		return this.recLoc;
	},
	mediaRealFile: function() {
		if (this.media.length>0)
			return this.media[0].realFile;
		else
			return '';
	},
	mediaName: function() {
		if (this.media.length>0)
			return this.media[0].name;
		else
			return '';
	},
	mediaLoc: function() {
		if (this.media.length>0)
			return this.media[0].loc;
		else
			return '';
	},
	mediaType: function() {
		if (this.media.length>0)
			return this.media[0].type;
		else
			return '';
	},
	mediaDuration: function() {
		if (this.media.length>0)
			return this.media[0].duration;
		else
			return '';
	},
	mediaRelLoc: function() {
		if (this.media.length>0)
			return this.media[0].relLoc;
		else
			return '';
	},

	__recRealFileFromOther: function() {
		this.recRealFile = this.recLoc + '/' + this.recName;
	},

	__medRealFileFromOther: function() {
		if (this.media.length>0)
			this.media[0].realFile = this.media[0].loc + '/' + this.media[0].name;
	},

	__setMedRelLoc: function() {
		if (this.media.length>0)
			this.media[0].relLoc = '';
		// TODO: do the real thing
	},

	// setting the values: using function allows to control in one place what we do
	setInitialValues: function() {
		this.multipleSelect = false; // no multiple selection by default
		if (trjs.utils.isNE(this.recLoc))
			this.setCurrentRecLoc();
		if (trjs.utils.isNE(this.recRealFile) && trjs.utils.isNE(this.recName)) {
			this.recName = trjs.data.NEWRECNAME;
			if (trjs.utils.isNE(this.recLoc))
				this.setCurrentRecLoc();
			this.__recRealFileFromOther();
		} else if (trjs.utils.isNE(this.recRealFile)) {
			if (trjs.utils.isNE(this.recLoc))
				this.setCurrentRecLoc();
			this.__recRealFileFromOther();
		} else if (trjs.utils.isNE(this.recName)) {
			this.recName = trjs.utils.lastName(this.recRealFile);
			this.recLoc = firstName(this.recRealFile);
		}
	},

	// set the name of the application that created the data
	setAppInfo: function(i) {
		this.appInfo = i;
	},

	// get the name of the application that created the data
	getAppInfo: function() {
		return this.appInfo;
	},

	/**
	 * call the server to know where a new file will be stored
	 * setting the values for recLoc and medLoc default
	 * the system function is an asynchonous call so this is done in two steps.
	 * @method getCurrentRecordingLoc
	 */
	setCurrentRecLoc: function() {
		if (this.lastLoc !== '') {
			this.recLoc = this.lastLoc;
			return;
		}
		if (trjs.param.lastDataLocation) {
				trjs.data.recLoc = trjs.param.lastDataLocation;
				// change the display information
				trjs.data.setNamesInEdit();
		} else {
			trjs.log.alert('Cannot find file current repertory');
			trjs.data.recLoc = codefn.UNKNOWNDIR;
		}
	},

	/**
	 * call the server to know where a new file will be stored
	 * setting the values for recLoc and medLoc default
	 * the system function is an asynchonous call so this is done in two steps.
	 * @method getCurrentRecordingLoc
	 */
	setCurrentMedLoc: function() {
		if (this.lastLoc !== '' && this.media.length>0) {
			this.media[0].loc = this.lastLoc;
			return;
		}
		if (trjs.param.lastDataLocation) {
				trjs.data.recLoc = trjs.param.lastDataLocation;
				// change the display information
				trjs.data.setNamesInEdit();
		} else {
			trjs.log.alert('Cannot find file current repertory');
			trjs.data.recLoc = codefn.UNKNOWNDIR;
		}
	},

	setRecordingRealFile: function(arg) {
		if (!trjs.utils.isNE(arg)) {
			this.recName = trjs.utils.lastName(arg);
			this.recLoc = trjs.utils.pathName(arg);
			this.recRealFile = arg;
		}
	},

	setRecordingName: function(arg) {
		if (!trjs.utils.isNE(arg)) {
			this.recName = arg;
			if (trjs.utils.isNE(this.recLoc))
				this.setCurrentRecLoc();
			this.__recRealFileFromOther();
		} else { // reinit
			this.recName = trjs.data.NEWRECNAME;
			if (trjs.utils.isNE(this.recLoc))
				this.setCurrentRecLoc();
			this.__recRealFileFromOther();
		}
	},

	setRecordingLoc: function(arg) {
		if (!trjs.utils.isNE(arg)) {
			if (trjs.utils.isNE(this.recName))
				this.recName = trjs.data.NEWRECNAME;
			this.recLoc = arg;
			this.__recRealFileFromOther();
		} else { // reinit
			this.setCurrentRecLoc();
			this.__recRealFileFromOther();
		}
	},

	setRecordingNameLoc: function(arg1, arg2) {
		if (!trjs.utils.isNE(arg1) && !trjs.utils.isNE(arg2)) {
			this.recName = arg1;
			this.recLoc = arg2;
			this.__recRealFileFromOther();
		}
	},

	setMediaRealFile: function(arg) {
		if (this.media.length<1) {
			this.media = new Array(1);
			this.media[0] = new trjs.template.MediaDesc();
		}
		if (!trjs.utils.isNE(arg)) {
			this.media[0].name = trjs.utils.lastName(arg);
			this.media[0].loc = trjs.utils.pathName(arg);
			this.media[0].realFile = arg;
			this.__setMedRelLoc();
			this.setMediaTypeFromFile(arg);
		}
	},

	setMediaName: function(arg) {
		if (this.media.length<1) {
			this.media = new Array(1);
			this.media[0] = new trjs.template.MediaDesc();
		}
		if (!trjs.utils.isNE(arg)) {
			this.media[0].name = arg;
			if (trjs.utils.isNE(this.media[0].loc))
				this.setCurrentMedLoc();
			this.__setMedRelLoc();
			this.__medRealFileFromOther();
			this.setMediaTypeFromFile(arg);
		} else {
			this.media[0].name = '';
			this.setCurrentMedLoc();
			this.__setMedRelLoc();
			this.media[0].realFile = '';
			this.media[0].type = '';
		}
	},

	setMediaLoc: function(arg) {
		if (this.media.length<1) {
			this.media = new Array(1);
			this.media[0] = new trjs.template.MediaDesc();
		}
		if (!trjs.utils.isNE(arg)) {
			if (trjs.utils.isNE(this.media[0].name))
				this.media[0].name = '';
			this.media[0].loc = arg;
			this.__setMedRelLoc();
			this.__medRealFileFromOther();
		}
	},

	setMediaNameLoc: function(arg1, arg2) {
		if (this.media.length<1) {
			this.media = new Array(1);
			this.media[0] = new trjs.template.MediaDesc();
		}
		if (!trjs.utils.isNE(arg1) && !trjs.utils.isNE(arg2)) {
			this.media[0].name = arg1;
			this.media[0].loc = arg2;
			this.__setMedRelLoc();
			this.__medRealFileFromOther();
		}
	},

	setMediaRelLoc: function(arg) {
		if (this.media.length<1) {
			this.media = new Array(1);
			this.media[0] = new trjs.template.MediaDesc();
		}
		if (!trjs.utils.isNE(arg)) {
			this.media[0].relLoc = arg;
			this.__medRealFileFromOther();
		}
	},

	setRecordingLang: function(arg) {
		this.recLang = arg;
	},

	setRecordingTitle: function(arg) {
		this.recTitle = arg;
	},

	setRecordingDate: function(arg) {
		this.recDate = arg;
	},

	setRecordingTime: function(arg) {
		this.recTime = arg;
	},

	setRecordingPlaceName: function(arg) {
		this.recPlaceName = arg;
	},

	setMediaTypeFromFile: function(name) {
		var ext = trjs.utils.extensionName(name).toLowerCase();
		if (ext === ".mp3" || ext === ".oga" || ext === ".wav" || ext === ".aif" || ext === ".aiff" || ext === ".aac")
			this.media[0].type = 'audio';
		else
			this.media[0].type = 'video';
	},

	setMediaType: function(arg) {
        if (this.media.length>0)
    		this.media[0].type = arg;
	},

	setMediaDuration: function(arg) {
        if (this.media.length>0)
    		this.media[0].duration = arg;
	},

	setSelectedLine: function(line) {
		if (this.prevSelectedLineColor !== null && this.selectedLine !== null)
			this.selectedLine.css( "background-color", this.prevSelectedLineColor );
		this.selectedLine = line;
		if (trjs.param.isContinuousPlaying !== true) {
			this.prevSelectedLineColor = this.selectedLine.css( "background-color" );
			this.selectedLine.css('background-color', "#FFFFAA");
		}
	},

	setNamesInWindow: function() {
		document.title = trjs.messgs.namesoftware + ' ' + version.version + ' - ' + this.recLoc + '/' + this.recName;
		$("#transcript-name").text(this.recName);
		$('#insertreplacemode').text( trjs.messgs.insertreplacemode );
		$('#headloc').text( trjs.messgs.headloc);
		$('#headts').text( trjs.messgs.headts);
		$('#headte').text( trjs.messgs.headte);
	},

	/**
	 * update the contents of the recording and media locations to allow visualisation and edition
	 * @method setNamesInEdit
	 */
	setNamesInEdit: function() {
		var table = $("#metadata");
		if (table != null && table.length > 0) {
			var tablelines = $('tr', table[0]);
			if (tablelines != null && tablelines.length > 0) {
				trjs.events.lineSetCell($(tablelines[1]), 2, this.recordingTitle());
				trjs.events.lineSetCell($(tablelines[2]), 2, this.recordingName());
				trjs.events.lineSetCell($(tablelines[3]), 2, this.recordingLoc());
				trjs.events.lineSetCell($(tablelines[4]), 2, this.recordingDate());
				trjs.events.lineSetCell($(tablelines[5]), 2, this.recordingPlaceName());
				trjs.events.lineSetCell($(tablelines[6]), 2, this.mediaName());
				trjs.events.lineSetCell($(tablelines[7]), 2, this.mediaRelLoc());
				trjs.events.lineSetCell($(tablelines[8]), 2, this.mediaLoc());
				trjs.events.lineSetCell($(tablelines[9]), 2, this.mediaType());
				trjs.events.lineSetCell($(tablelines[10]), 2, this.mediaDuration());
			}
		}
		this.setNamesInWindow();
	},

	/**
	 * reinitialize the media data in trjs.data after edition by the user
	 * @method getNamesFromEdit
	 */
	getNamesFromEdit: function() {
		var table = $("#metadata");
		if (table != null && table.length > 0) {
			var tablelines = $('tr', table[0]);
			if (tablelines != null && tablelines.length > 0) {
				this.recTitle = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[1]), 2));
				// Title
				this.setRecordingName(trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[2]), 2)));
				//  transcription filename
				this.setRecordingLoc(trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[3]), 2)));
				//  transcription Loc
				this.recDate = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[4]), 2));
				//  recording Date
				this.recPlaceName = trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[5]), 2));
				//  recording PlaceName
				this.setMediaName(trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[6]), 2)));
				//  Media Name
				this.setMediaRelLoc(trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[7]), 2)));
				//  Media RelLoc
				this.setMediaLoc(trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[8]), 2)));
				//  Media Loc
				this.setMediaType(trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[9]), 2)));
				//  Media Type
				this.setMediaDuration(trjs.dataload.checkstring(trjs.events.lineGetCell($(tablelines[10]), 2)));
				//  Media Duration
			}
		}
		this.setNamesInWindow();
	},
	/**
	 * clean up the recording and media locations
	 * check coherence of real transcrit name and the name in the metadata
	 */

	/**
	 * check the changes in the metadata to update name location and rename if necessary the files
	 * update the contents of the recording and media locations to allow visualisation and edition
	 * @method checkNames
	 * @param {object}
	 */
	checkNames: function(event) {
		if (trjs.data.checkNamesInProcess === true) return; // the event is sometimes sent two times.
		trjs.data.checkNamesInProcess = true;
		var table = $("#metadata");
		var tablelines = $('tr', table[0]);
		var recN = trjs.events.lineGetCell($(tablelines[2]), 2);
		if (recN == null || recN === '') {
			trjs.log.boxalert(trjs.messgs.notallowedemptyfile);
			trjs.data.checkNamesInProcess = false;
			return true;
		}

		// TODO not used yet in real time but saved at the end.
		//trjs.data. -- var recordingLoc = trjs.events.lineGetCell( $(tablelines[3]), 2 );
		//trjs.data.mediaName = trjs.events.lineGetCell( $(tablelines[6]), 2 );
		//trjs.data.mediaLoc = trjs.events.lineGetCell( $(tablelines[7]), 2 );
		//trjs.data.mediaRelLoc = trjs.events.lineGetCell( $(tablelines[8]), 2 );

		if (this.recordingName() == trjs.data.NEWRECNAME) {
			this.getNamesFromEdit(); // update trjs.data to maintain coherent information
			if (recN !== trjs.data.NEWRECNAME) {
				// the new file schema has been renamed for the first time
				this.setRecordingName(recN);
				// TODO: deal with recordingLoc - presently this field cannot be changed in the transcriberjs window
				this.setNamesInWindow();
			}
			trjs.data.checkNamesInProcess = false;
			return true;
		}

		if (this.recordingName() != recN) {  // changed the name of the file
			var message = trjs.messgs.askrename + this.recordingName() + ' to ' + recN + ' ?';
			bootbox.confirm(message, function(rep) {
				// console.log(rep);
				trjs.data.checkNamesInProcess = false;
				if (rep === true) {
					trjs.io.moveRecording(trjs.data.recordingRealFile(), recN, null); // change name if move successful
				} else {
					// put again the old name !
					trjs.events.lineSetCell($(tablelines[2]), 2, trjs.data.recName);
				}
				trjs.data.getNamesFromEdit(); // update trjs.data to maintain coherent information
			});
			return true;
		}
	},
	// old names
	// reinitMediaInfo getNamesFromEdit
	// recordingInfoDataToDom setNamesInEdit
	// checkMetadata checkNames

	/**
	 * variable to contains all data about the transcription
	 * @property trjs.data
	 * object for storing the transcription and the data
	 * RecordingData
	 */
	doc: null, // the original DOM document.
	// transName: '', // Name of transcription (not always filename) - better use title
	// below values according the xml file (TEIML)

	/**
	 * DATA for metadata, persons, and templates
	 * the real data is stored in the HTML DOM. (one table for each metadata, persons and templates)
	 * the first three variables (metadata, persons and templates) are temporary variables for loading external files
	 * note and textDesc are also used of temporary storage of the div and notes information
	 * tiers and codes are updated in real time and used to edit and check the transcription in real time
	 */
	metadata: null, // store all metadata information in one block (to be inserted in the TEI as save time)
	persons: null, // list of participants (using the object class person)
	codesxml: null, // list of codes (locutors) with properties (from the xml files and final version)
	tiersxml: null, // list of tiers (templates) with properties (from the xml files and final version)
	codesdata: {}, // alternate list of codes extracted from the data, not from the xml file - temporary version
	tiersdata: {}, // alternate list of tiers extracted from the data, not from the xml file - temporary version
	codesnames: {}, // liste of relationship between locs (or tiers) and names
    dependency: {}, // relation between child and parent (dependency[child] = parent) computed from the xml file
	note: null, // contains the text of the divs
	textDesc: null, // intermediate buffer to store the file as a string for saving purposes
    revision: [], // list of file revisions and various information
    imbrication: null, // empty at begining

	search: null, // results of search
//	videoHeight: 240, // default height of the video
	installURL: '*transcriber.js*',

    ASSOC: 'Symbolic_Association',
    SYMBDIV: 'Symbolic_Division',
    TEMPDIV: 'Temporal_Division',
    INCL: 'Included_In',
    POINT: 'Point',

	LINECOL: 0,
	INFOCOL: 1,
	CODECOL: 2,
	TSCOL: 3,
	TECOL: 4,
	VTSCOL: 5,
	VTECOL: 6,
	TRCOL: 7,
	INFOSUPCOL: 8,

	// for Kwic
	// for Utterances
	KWICFILENAMECOL: 1,
	KWICLOCCOL: 2,
	KWICVTSCOL: 3,
	KWICVTECOL: 4,
	KWICLCCOL: 5,
	KWICCOL: 6,
	KWICRCCOL: 7,

	// for Lexicon
	LEXENTRY: 1,
	LEXCOUNT: 2,
	LEXOCC: 3,

};
