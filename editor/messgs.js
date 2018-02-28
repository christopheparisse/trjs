/**
 * list of string for multilingual versions
 * Date: october 2013
 * @module Messgs
 * @author Christophe Parisse
 */

'use strict';

var trjs = {};

trjs.messgs_eng = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    fileserver: 'File server',
    namesoftware: 'TRJS',

    chooseaction: 'Choose Other Action for transcription files',
    display: 'Display and edit transcription (and/or media)',
    backtrjs: 'Go back to TRJS without reloading a file',
    cvtteiml: 'Convert transcription to TEI',
    cvtclan: 'Convert transcription to CLAN',
    cvttrs: 'Convert transcription to Transcriber',
    deltranscription: 'Delete transcription(s) from server',
    newtranscription: 'Create a new transcript with the media file',
    loadmedia: 'Load the media file',
    cvthtml5med: 'Convert media to HTML5 video (mp4 and ogv): Medium size 480p',
    cvthtml5low: 'Convert media to HTML5 video (mp4 and ogv): Small size 240p',
    cvtmp4720: 'Convert to MP4 720p (HTML5 Large size)',
    cvtogv720: 'Convert to OGV 720p (HTML5 Large size)',
    cvtmpeg480: 'Convert to MPEG 480p (Medium size)',
    cvtmov480: 'Convert to MOV 480p (Medium size)',
    cvtmov720: 'Convert to MOV 720p (Large size)',
    extractaudio: 'Extract audio from video for HTML5',
    delmedia: 'Delete media(s) from server',
    messagelist: 'Show/hide message list',
    clearmru: 'Clear recent file list',
    rmgarbage: 'Delete files in garbage container',

    gotext: 'Choose action for transcription',
    gomedia: 'Choose action for media',

    bdisplay: 'View',
    bbacktrjs: 'Back',
    bcvtteiml: 'TEI',
    bcvtclan: 'CLAN',
    bcvttrs: 'Transcriber',
    bdeltranscription: 'Delete transcription',
    bnewtranscription: 'New file',
    bloadmedia: 'Load',
    bcvthtml5med: 'Medium video',
    bcvthtml5low: 'Small video',
    bcvtmp4720: 'MP4 large',
    bcvtogv720: 'OGG large',
    bcvtmpeg480: 'MPEG medium',
    bcvtmov480: 'MOV medium',
    bcvtmov720: 'MOV large',
    bextractaudio: 'To audio',
    bdelmedia: 'Delete media',
    bmessagelist: 'Message list',
    bclearmru: 'Clear recent files',
    brmgarbage: 'Clear garbage',
    bnoaction: 'No action selected',
    bsinglemultiple: 'Toggle single/multiple choice',
    bdeselect: 'Unselect all',
    bsaveasfile: 'Save transcription as',

    bgotext: 'Transcriptions',
    bgomedia: 'Medias',
    bgoother: 'Others',

    selectedmsg: 'Selected files',
    infodirs: 'Please navigate within your file system',
    infofiles: 'Please choose transcription and/or media file',
    infoaction: 'Please choose an action to perform',
    maininfoaction: 'Action to be performed',
    defchoiceaction: 'not set (see below)',
    selectmultiple: '(multiple selection available)',
    selectsingle: '(select only one file)',
    alertmessages: 'Alert messages',
    help: 'Help',
    newfile: "new document",
    exporttrans: "Export as ",
    exportname: " named as ",
    exporterror: " Export error ",

    reload: 'RELOAD',
    up: 'UP',
    home: 'HOME',

    askrename: 'Do you really want to rename the recording (name of transcription file) from ',
    filenm: 'File ',
    movedto: ' was moved to ',
    mustfn: 'You must choose a file name to save your new file. Internal save performed only.',
    mustsave: 'Changes have been made to the current file: do you want quit without saving the changes ?',
    haschanged: 'The file has changed : do you want to save it?',
    backfile: 'Last changed were not saved. Hit cancel if you want to go back to editing the previous file?',
    wantback: "The file has been changed but not saved. Please come back if you want to save it.",
    errorfile: "Error on processing file : ",
    errorformat: 'ERROR: incorrect xml format: loading might be incorrect - please check results or try another format - nodeName=',
    errorloading: "error on loading file : ",
    initdiv: "(put here description of scene or recording)",
    inittrs: "(start transcription here)",
    notallowedemptyfile: "Error : cannot have empty name in recordingName field",
    cannotmove: 'Cannot move file ',
    bcreatedir: 'Create a folder',
    berasedir: 'Erase a folder',

    nodivminus: 'There is not div to close: impossible to add -div-',
    noteif: 'Not a TEI file.',

    menustopspan: 'Menus',
    searchtopspan: 'Search',
    filestopspan: 'Files',
    files: 'Files',
    fopentrs: 'Open a transcript file',
    infopentrs: 'Keypad function: Ctrl + O',
    fopenmedia: 'Choose a media',
    infopenmedia: 'Keypad function: Ctrl + Alt + O',
    fnewtrs: 'New transcription',
    frecentfiles: 'Recent files',
    fhrecentfiles: 'File list',
    frecentfilesempty: '...recent files...',
    feraserecentfiles: 'Erase recent files',
    fsave: 'Save',
    infsave: 'Keypad function: Ctrl + S',
    fsaveas: 'Save as...',
    fsavecache: 'Save in the cache',
    fdownload: 'Local export',
    fexporttext: 'Export to Text (.txt)',
    fexportrtf: 'Export to Rtf (.rtf)',
    fexportdocx: 'Export to Docx (.docx)',
    fexporttrs: 'Export to Transcriber (.trs)',
    fexportclan: 'Export to Clan (.cha)',
    fexportpraat: 'Export to Praat (.textgrid)',
    fexportelan: 'Export to Elan (.eaf)',
    fexportcsv: 'Export to Csv (.csv)',
    fexportexcel: 'Export to Excel (.xlsx)',
    fopenlocaltrs: 'Open a local transcription',
    fopenlocalmedia: 'Open a local media',

    fmult: 'Multiple selection',
    fmultshow: 'Show/hide multiple selection',
    fmultselect: 'Select all',
    fmultdeselect: 'Deselect all',
    fmultcut: 'Cut lines',
    fmultcopy: 'Copy lines',
    fmultpaste: 'Paste',
    fmulttotei: 'Export selection to TEIML',
    fmulttotxt: 'Export selection to Text/Spreadsheet',
    fmulttomedia: 'Extract selection to media without subtitles',
    fmulttosubt: 'Extract selection to media with subtitles',
    fmulttosubtall: 'Extract all file to media with subtitles',
    fmulttosubttextonlysrt: 'Extract selection to subtitles without media (.srt file)',
    fmulttosubttextonlyallsrt: 'Extract all file to subtitles without media (.srt file)',
    fmulttosubttextonlyass: 'Extract selection to subtitles without media (.ass file)',
    fmulttosubttextonlyallass: 'Extract all file to subtitles without media (.ass file)',
    fconvertmedia: 'Convert a media file',

    eedition: 'Edition',
    emetadata: 'Metadata',
    eparticip: 'Persons',
    estruct: 'Templates',
    echeck: 'Check transcription',
    emodec: 'Control mode',
    emodeb: 'Lock mode',
    emodel: 'Free mode',
    eparam: 'Parameters',
    eundo: 'Undo',
    elistundo: 'List of undo',
    eredo: 'Redo',
    ineundo: 'Keypad function: Ctrl + Z',
    ineredo: 'Keypad function: Ctrl + Y',

    search: ' Search',
    insearch: 'Keypad function: Ctrl + F',
    shelp: 'Help',
    squickhelp: 'Quick help',
    sextensivehelp: 'Extensive help (website)',
    skeypadfunctions: 'List of keypads functions',
    supdate: 'Software update',
    smessgs: 'Messages',
    sabouttrjs: 'About TranscriberJS',

    savetopspan: 'Save',
    paramspan: 'Parameters',
    pparam: 'Parameters',
    dochelp: 'Quick help (local)',
    gohelp: 'Full help (server)',
    messagesspan: 'Show messages.',
    ppartition: ' Display partition',
    pwave: ' Display wave intensity',
    pbackstep: 'Value for backward step (F2) :',
    pforwstep: 'Value for forward step (F3) :',
    pfmtlinktime: 'Format of linked time:',
    pdigitlinktime: 'Number of digits in milliseconds :',
    pshowlinktime: ' Show link time',
    pnbsaves: 'Number of save versions :',
    pshownames: ' Show names or codes',
    pshownumbers: ' Show line numbers',
    pmode: 'Edition of display areas :',
    pinsertreplace: 'Edition of transcription :',
    pinsert: 'Insert',
    preplace: "Replace",
    pcheckatsave: 'Check transcription when saving',
    pusequality: 'Method for quality selection of the video : ',
    pquality: 'Video quality: ',
    inpusequality: 'Automatic selection considers best quality rapport with internet debit',
    inpquality: 'Quality (from high to low definition)',
    preorder: 'Reorder lines dynamically ',
    checkspan: 'Check current file',
    icheck: 'Check file ',
    checkfe: 'Founded errors :',

    tools: 'Tools',

    o1: 'Load Transcription from local file :',
    o2: 'Load Media from local file :',
    o3: 'Please click above to select a transcript file or a media file on your computer or drag a file in the input field above.',
    o4: 'Load Transcription from the web server :',
    o5: 'Go to server!',
    o6: 'Load Media from the web server :',
    o8: 'Save on web server :',
    o9: 'Save!',
    o10: 'Save in cache memory :',
    o9a: 'Save!',
    o11: 'Export to downloading area :',
    o12: 'Save transcript as ...',
    o13: 'Export to excel :',
    o14: 'Export to Excel ...',
    o15: 'Please click to save the transcript file.',
    o16: 'Start a new transcription :',
    o17: 'Start!',
    o18: 'Start a new transcription from a media on the web server :',
    conversions: 'The format of the media is not suitable to be used with TranscriberJS: format conversion is necessary. Do you want to convert automatically the files ? Please wait for end of conversion !',
    notcompatibleHTMLMedia1: "The media file ",
    notcompatibleHTMLMedia2: " is not in a compatible Transcriberjs format (HTML5 format). You can either choose another file, or wait for file conversion (this might take some time)",
    notcompatTitle: "Non compatible media format",
    convertMediaTitle: "Converting a media file",
    notcompatibleConvertHTMLMedia1: "The media file ",
    notcompatibleConvertHTMLMedia2: " is not in a compatible Transcriberjs format (HTML5 format). You must choose another file or convert it by other means.",
    notcompatibleNotexist1: "The media file ",
    notcompatibleNotexist2: " does not exist. You must choose another file.",
    notcompatNotexistTitle: "Non compatible media format",
    notcompatCompatibleTitle: "Not existing media",
    labelotherfile: "Choose another file",
    labelsmallvideo: "Small format",
    labelmediumvideo: "Medium format",
    labellargevideo: "Large  format",
    labelaudio: "Audio format",
    labelcancel: "Cancel",
    labelconvert: "Converting",
    convertfromchat: "The file should be converted from CHAT/CLAN format",
    convertfromtrs: "The file should be converted from Transcriber format",
    convertfromelan: "The file should be converted from ELAN/EAF format",
    convertfrompraat: "The file should be converted from Praat/TextGrid format",
    convertfromtxt: "The file should be converted from Text format",
    convertfromcsv: "The file should be converted from CSV format (spreadsheet)",
    filescleaned: 'Installation files cleaned',

    undolist: 'History of changes (can undo)<br/>',
    redolist: '<br/>Redo history (can redo)<br/>',
    nomoreundo: 'nothing more to undo',
    nomoreredo: 'nothing more to redo',

    nomedia: 'No media',
    loading: "Loading...",
    askforerase: "Do you want to erase the old file named ",

    oflab1: 'Save a transcription as ',
    oflab2: 'Open a file (all types) ',
    oflab3: 'Open a transcription ',
    oflab4: 'Choose a media for ',
    oflab5: 'Choose a media ',
    ofcancel: 'Cancel',
    ofchoice: 'Choose file',
    oftrsfiles: 'Transcripts',
    ofallfiles: 'All files',
    ofmediafiles: 'Medias',
    ofsaveas: 'Save as',

    mediarepl1: 'Media ',
    mediarepl2: ' is used in replacement of ',
    convertMedia: 'Convert media : ',

    metadataspan: "Metadata",
    infodc: "(informations about Dublin-Core)",
    participantspan: "List of speakers",
    templatespan: "List of tiers",
    searchspan: "Search current file",
    ssearch: "Search word or string :  ",
    tisgotoline: "Ctrl L",
    tisgototime: "Ctrl T",

    pplang: "Language",
    ppdisplay: " Display",
    ppem: "Edition modes",
    ppsettings: " Settings",
    ppchecking: " Checking",
    ppconversion: "Conversion",

    insertreplacemodeInsert: "Insert mode",
    insertreplacemodeReplace: "Replace mode",
    headloc: "Locutor",
    headts: "Start",
    headte: "End",
    wavei: "Wave intensity",
    controlm: "Control mode",
    lockm: "Lock mode",
    freem: "Free mode",
    eshifttime: "Shift all time links ",
    shifttimelinks: 'You have lines selected. Do you really want to shift time only on the selected lines?',
    askshifttimelinks: 'Please give value of time shift: ',

    warning: 'Warning: important information',
    warningLocalTranscript: 'Local transcript loading: saving the file is possible only locally using export functions.',
    warningLocalMedia: 'Local media loading: WARNING - Displaying the wavefile is not possible with this feature.',
    labelnotagain: 'Do not display this warning again',
    sresetwarnings: 'Reset all warnings',
    labelok: 'Ok',

    timeEndSmallerBegin: 'Cannot set end time smaller than begin time',
    timeBeginGreaterEnd: 'Cannot set begin time greater than end time',
    checknoerror: 'No errors in the document',

    ftnotrsf: 'No transcript file available here',
    ftnomedf: 'No media file available here',
    ftnof: 'No file available here',

    cbwarning1: 'The media ',
    cbwarning2: ' is not in a format compatible with the current browser. Please choose another media file or use another browser.',

    about: '<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">'
    + '<img alt="Licence Creative Commons" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />'
    + '<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">TranscriberJS</span> by'
    + '<span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName"> Christophe Parisse </span>'
    + 'is available under <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">'
    + ' Creative Commons Attribution Licence -  Share as Conditions 4.0 International</a>.<br />'
    + 'Created at <a xmlns:dct="http://purl.org/dc/terms/" href="http://ct3.ortolang.fr/trjs/" rel="dct:source">http://ct3.ortolang.fr/trjs/</a>.<br />'
    + 'Download the full version: <a href="http://ct3.ortolang.fr/trjs/">http://ct3.ortolang.fr/trjs/</a><br />'
    + 'Download the beta version under development: <a href="http://ct3.ortolang.fr/trjs/doku.php?id=doc:vbeta">http://ct3.ortolang.fr/trjs/doku.php?id=doc:vbeta</a><br />'
    + 'Inserm/Modyco (CNRS/Université Paris Ouest Nanterre) - DGLFLF - Ortolang (<a href="http://www.ortolang.fr">www.ortolang.fr</a>)<br />',
    aboutlib: 'Tools and external librairies used to develop the software:<br />'
    + 'HTML5, Node.js, jQuery, Bootstrap, Ffmpeg<br />'
    + 'FileSaver.js, parseUri, Electron, Bootbox.js, Rangy<br />'
    + 'Font Awesome by Dave Gandy - http://fontawesome.io<br />',

    esff: 'Uncorrect searching pattern format: search unable',
    ediv: 'Must be on div to hide it.',
    emsg1: "A new version has been installed. Full installation will require a full restart. Partial update is possible with local restart. Do you want to do it now?",
    emsg2: "A new version has been installed. Do you want to restart now?",
    emsg3: "A new version has been installed. It will take effect the new time TRJS is started.",
    ennv: "No new version available.",
    eerup: "Error updating TranscriberJS: ",

    sssearch: "Search",
    ssearchrepl: "Replace",
    sdisplay: "Display",
    sgoto: "Go to",
    sfields: "In field(s) : ",
    sloc: "Locutors",
    signore: "Ignore lower/upper case letters",
    sresu: "Founded results: ",
    ssearchrep: "Search word or string : ",
    sreplfields: "In field(s) : ",
    sreplloc: "Locutors",
    sreplignore: "Ignore lower/upper case letters",
    sreplresu: "Founded results: ",
    sreplrep: "Replace by word or string : ",
    sshow: "Show locutors or tiers : ",
    sshowfields: "In field(s) : ",
    sshowloc: "Locutors",
    shide: "Hide locutors or tiers : ",
    shidefields: "In field(s) : ",
    shideloc: "Locutors",
    sgotoline: "Go to line : ",
    sgototime: "Go to time : ",

    exportit: "Export and download",
    exportfile: "All file",
    exportselect: "Selection",
    exportmenufile: "Export to...",
    exportmenuselect: "Export selection to...",
    exportmediafile: "Export to media...",
    exportmediaselect: "Export selection to media...",
    exportclose: "Close",

    infodownload: "Download",
    infocontrol: "In Control or Standard mode, transcription area only rules media area. You can navigate through the media without modification in transcription area (it is a easy way to check and correct temporal alignment). ",
    infolock: "In Lock mode, transcription and media are are synchronized. Media area rules transcription (with buttons).",
    infofree: "In Free mode, transcription and media area are totally independent.",

    tytitle: "Title",
    tyname: "Name",
    tyloc: "Location",
    tydate: "Date",
    typlacen: "Place name",
    tymname: "Name",
    tymrelloc: "Relative location",
    tymloc: "Location",
    tymtype: "Type",
    tymdur: "Duration",

    infotytitle: "Description of transcription",
    infotyname: "Transcription file name",
    infotyloc: "Location of the recording (pathname only)",
    infotydate: "Date of recording",
    infotyplacen: "Recording place name",
    infotymname: "Audio or video file name",
    infotymrelloc: "Audio or video relative location",
    infotymloc: "Location for audio or video (pathname only)",
    infotymtype: "Media type (audio or video)",
    infotymdur: "Media duration",

    temptitle: "Title",
    tempcreator: "Creator",
    tempsubject: "Subject",
    tempdesc: "Description",
    temppub: "Publisher",
    tempcontr: "Contributor",
    tempdate: "Date",
    temptype: "Type",
    tempformat: "Format",
    tempid: "Identifier",
    tempsrc: "Source",
    templang: "Language",
    temprel: "Relation",
    tempcov: "Coverage",
    temprig: "Rights",

    codecode: "Code",
    codespeaker: "Speaker's Name",
    codecontent: "Content",
    codedesc: "Description",

    tierstier: "Tier",
    tierstype: "Type",
    tiersparent: "Parent",
    tiersspeaker: "Speaker's Name",
    tierscontent: "Content",
    tiersdesc: "Description",

    personID: "ID",
    personage: "Age",
    personname: "Name",
    personsex: "Sex",
    personlanguage: "Language",
    persongroup: "Group",
    personrole: "Role",
    personSES: "SES",
    personeduc: "Education",
    personsrc: "Source",
    personinfo: "Information",

    tititle: "Title of the document",
    ticreator: "Creator of the document",
    tisubject: "Subject and key-words",
    tidesc: "Description of the document",
    tipub: "Publisher of the document",
    ticontr: "Contributor of the document",
    tidate: "Date of an event in the cycle life of the document",
    titype: "Nature or genre of the content",
    tiformat: "Format of the document",
    tiid: "Unambiguous identifier",
    tisrc: "Resource that document drift",
    tilang: "Language of the document",
    tirel: "Link to a related resource",
    ticov: "Document Scope",
    tirig: "Rights to the resource",

    intititle: "Document title : main title of the document.",
    inticreator: "Document creator : names of the person and organisation or service at the origin of writing document.",
    intisubject: "Subject et key-words : key-words, abstract phrases, or classification codes. It is best to use keywords selected through a classification policy. For example, it is possible to use the Library of Congress codes ( LCSH and LCC ), the medical vocabulary (MESH ) or decimal notation librarians (DDC and UDC) .",
    intidesc: "Document description : abstract, table of contents, or free text.",
    intipub: "Document publisher : names of the person and organisation or service at the origin of writing document.",
    inticontr: "Document contributor : names of the person and organisation or service that contributes or has contributed to the development of the document.",
    intidate: "Date of an event in the life cycle of the document : creation date or the date of availability. It is recommended to specify the date in the W3CDTF format (AAAA-MM-JJ).",
    intitype: "Nature or genre of the content : major categories of document. It is recommended to use clearly defined terms of its organization. For example, the Dublin Core defines a few types in the vocabulary DCMITypes.",
    intiformat: "Document format: physical or electronic format of the document. For example, media type or size (size, duration). You can specify the hardware and software necessary to access the document. It is recommended to use clear terms, eg MIME types.",
    intiid: "Unambiguous identifier : It is recommended to use an accurate reference system, for example, the URI or ISBN numbers.",
    intisrc: "Resource that document drift : the document may result in whole or in part of the resource. It is recommended to use a formal naming of resources, such as their URI.",
    intilang: "Language of the document: it is recommended to use a language code conforms to RFC4646 format.",
    intirel: "Link to a related resource: It is recommended to use a formal naming of resources, such as their URI.",
    inticov: "Document Scope : The scope includes a geographic domain, a time, or jurisdiction (name of an administrative entity). It is recommended to use standardized representations of these types of data, such TGN ( Thesaurus of Geographic Names, a place names dictionary), ISO3166, or Box Point for the spatial range, or W3CDTF Period for the temporal scope.",
    intirig: "Rights to the resource : to provide information on the status of the rights of the document, such as the presence of a copyright or a link to the copyright holder . The absence of this property does not assume that the document is copyright free.",

    symbasso: 'Symbolic association',
    orthol: 'Orthographic line',
    phonl: 'Phonetic line',

    savepref: "Save preferences",
    converr1: "Conversion error of file format ",
    converr2: " to format Teiml (",
    errload1: "Error ",
    errload2: " loading the file : ",
    errload: "Error loading the file : ",
    unkform: "Unknown format for file ",
    mederrab: "You aborted the video playback.",
    mederrnet: "A network error caused the audio download to fail.",
    mederrdec: "The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.",
    mederrsrc: "The video audio not be loaded, either because the server or network failed or because the format is not supported.",
    mederr: "An unknown error occurred.",
    convnotst: "Cannot start conversion: wait for previous conversion to finish.",
    mednotcor: "The media described in the metadata does not correspond to a known media format: please choose another media.",
    mednotex: "The media does not exist. Please choose another media file",
    mednotop: "The media could not be opened. Please choose another media file.",

    infoinsert: "Insert mode (Alt + F6) insert a blank line with current time.",
    inforeplace: "Replace mode (Ctrl + M) stores time to end of current line and beginning of next line then jumps to line; at the end of a file, also inserts a line (realignment processing). ",
    endconv: "End of conversion.",
    cannoterase: "Impossible to delete.",
    cannotinsert: "Impossible to insert a line here. New metadata could be inserted only after Dublin Core section.",
    cannotdelete: "Impossible to delete a line here. New metadata could be inserted only before Dublin Core section.",
    cannotlast: 'Impossible to delete last line.',

    int1: "Play/Pause: TAB",
    int2: "Set beginning of line to current time: F4",
    int3: "Set end of line to current time: F5",
    int4: "Insert a blank line: F6",
    int5: "Play current line: F7",
    int6: "Start playing continuously: F8",
    iconzoomin: "Zoom in",
    iconzoomout: "Zoom out",
    buttonpageleft: "Previous page",
    buttonpageright: "Next page",

    intp1: "Open transcription: Ctrl O",
    intp2: "Open media: Ctrl Alt O",
    intp3: "Save: Ctrl S",
    intp4: "Search: Ctrl Alt F",
    intp5: "Select all lines: Ctrl A",
    intp6: "Undo: Ctrl Z",
    intp7: "Redo: Ctrl Y",
    intp8: "Insert a blank line: Ctrl I",
    intp8b: "Insert a blank line with time: Ctrl Alt I",
    intp9: "Modify time (end of current line, start blank line): Ctrl M",
    intp10: "Delete line: Ctrl D",
    intp11: "Join line: Ctrl J",
    intp12: "Duplicate line: Ctrl R",
    intp13: "Split line: Ctrl Alt R",
    intp14: "Play slower: Ctrl B",
    intp15: "Play faster: Ctrl E",
    intp16: "Make big: Alt F3",
    intp17: "make small: Alt F2",

    intpp1: "Show/hide multiple selection: Ctrl Alt F8",
    intpp2: "Select all",
    intpp3: "Deselect all",
    intpp4: "Cut selection",
    intpp5: "Copy selection",
    intpp6: "Paste selection",
    intpp7: "Download selection",

    mprop: "Property",
    mval: "Value",

    tree: "Select a file from the tree.",

    opensavespan: "Load and save data",
    trsize: " size: ",
    annul: "Cancel",
    askforreorder: "Using automatic reordering changes radically the way time alignement edition is performed. Are you sure?",

    bin9: "Tabulation or play from the transcription", // Tab
    bin10: "Store time to end of current line and begining of next line and jumps to next line. Also inserts a line if Inset mode in on or if at the end of the file", // return Key
    bin13: "Store time to end of current line and begining of next line and jumps to next line. Also inserts a line if Inset mode in on or if at the end of the file", // return Key
    bin27: "Stop the playing of the media", // Esc
    bin33: "Move to page above", // Page Up
    bin34: "Move to page below", // Page Down
    bin38: "Move to line above", // Up
    bin40: "Move to line below", // Down
    bin112: "Play from the media", // F1
    bin113: "Jump backwards a little bit", // F2
    bin114: "Jump formwards a little bit", // F3
    bin115: "Set the beginning of the line to the current time", // F4
    bin116: "Set the end of the line to the current time", // F5
    bin117: "Insert a blank line with current locutor", // F6
    bin118: "Play all the current line", // F7
    bin119: "Start playing continuously", // F8

    ctrlbin49: "Set line as 1st locutor", // Ctrl 1
    ctrlbin50: "Set line as 2nd locutor", // Ctrl 2
    ctrlbin51: "Set line as 3rd locutor", // Ctrl 3
    ctrlbin52: "Set line as 4th locutor", // Ctrl 4
    ctrlbin53: "Set line as 5th locutor", // Ctrl 5
    ctrlbin54: "Set line as 6th locutor", // Ctrl 6
    ctrlbin55: "Set line as 7th locutor", // Ctrl 7
    ctrlbin56: "Set line as 8th locutor", // Ctrl 8
    ctrlbin57: "Set line as 9th locutor", // Ctrl 9

    ctrlbin35: "Move to the end of file", // Ctrl End
    ctrlbin36: "Move to the begining of file", // Ctrl Home
    ctrlbin66: "Play media slower", // Ctrl B
    ctrlbin68: "Delete current line", // Ctrl D
    ctrlbin69: "Play media faster", // Ctrl E
    ctrlbin71: "Insert the start of a div", // Ctrl G
    ctrlbin73: "Insert an empty line", // Ctrl I
    ctrlbin74: "Join the current line with the next one", // Ctrl J
    ctrlbin76: "Go to line number", // Ctrl L
    ctrlbin77: "Store time to end of current main line and begining of next line and jumps to next line", // Ctrl M
    ctrlbin79: "Open a transcription", // Ctrl O
    ctrlbin82: "Duplicate current line", // Ctrl R
    ctrlbin83: "Save the current file", // Ctrl S
    ctrlbin84: "Show go to time interface panel", // Ctrl T
    ctrlbin85: "Hide the div", // Ctrl U
//	ctrlbin88: "" , // Ctrl X
    ctrlbin89: "Redo last change", // Ctrl Y
    ctrlbin90: "Undo last change", // Ctrl Z

    ctrlshiftbin49: "Set the current line as the start of a div", // Ctrl Shift 1
    ctrlshiftbin50: "Set the current line as the end of a div", // Ctrl Shift 2
    ctrlshiftbin71: "Close all currently opened divs", // Ctrl Shift G

    ctrlaltbin49: "Set line as 1st template", // Ctrl Alt 1
    ctrlaltbin50: "Set line as 2nd template", // Ctrl Alt 2
    ctrlaltbin51: "Set line as 3rd template", // Ctrl Alt 3
    ctrlaltbin52: "Set line as 4th template", // Ctrl Alt 4
    ctrlaltbin53: "Set line as 5th template", // Ctrl Alt 5
    ctrlaltbin54: "Set line as 6th template", // Ctrl Alt 6
    ctrlaltbin55: "Set line as 7th template", // Ctrl Alt 7
    ctrlaltbin56: "Set line as 8th template", // Ctrl Alt 8
    ctrlaltbin57: "Set line as 9th template", // Ctrl Alt 9

    ctrlaltbin65: "Select line", // Ctrl Alt A
    ctrlaltbin66: "Play in reverse", // Ctrl Alt B
    ctrlaltbin68: "Delete the current group of lines", // Ctrl Alt D
    ctrlaltbin69: "Play at normal rate", // Ctrl Alt E
    ctrlaltbin70: "Show search interface panel", // Ctrl F
    ctrlaltbin71: "Insert a closing div", // Ctrl Alt G
    ctrlaltbin73: "Insert a line with setting the current time", // Ctrl Alt I
    ctrlaltbin74: "Join the current main line with the next main line", // Ctrl Alt J

    ctrlaltbin77: "Store time to end of current line and begining of next line", // Ctrl Alt M
    ctrlaltbin79: "Load a media", // Ctrl Alt O
    ctrlaltbin82: "Split the line at the cursor", // Ctrl Alt R
    ctrlaltbin85: "Show the hidden div", // Ctrl Alt U

    ctrlbin119: "Zoom Out (all window)", // Ctrl F8
    ctrlbin120: "Zoom In (all window)", // Ctrl F9

    ctrlaltbin113: "Set the color of the selected text to red", // Ctrl Alt F2
    ctrlaltbin114: "Set the color of the selected text to green", // Ctrl Alt F3
    ctrlaltbin115: "Set the color of the selected text to blue", // Ctrl Alt F4
    ctrlaltbin116: "Set the format of the selected text to bold", // Ctrl Alt F5
    ctrlaltbin117: "Set the format of the selected text to italics", // Ctrl Alt F6
    ctrlaltbin118: "Set the format of the selected text to emphasis", // Ctrl Alt F7
    ctrlaltbin119: "Set/unset multiple selection", // Ctrl Alt F8
    ctrlaltbin120: "Extract selection to subtitles (srt format)", // Ctrl Alt F9
    ctrlaltbin121: "Extract selection to subtitles (ass format)", // Ctrl Alt F10
    ctrlaltbin122: "Extract selection to subtitles with media", // Ctrl Alt F11
    ctrlaltbin123: "Extract selection to media", // Ctrl Alt F12

    altbin37: "Jump backwards a little bit", // Alt Left
    altbin38: "Go up to the next main line", // Alt Up
    altbin39: "Jump forwards a little bit", // Alt Right
    altbin40: "Go down to the next main line", // Alt Down
    altbin112: "Play from the current position in the transcription", // Alt F1
    altbin113: "Reduce the size of the media", // Alt F2
    altbin114: "Increase the size of the media", // Alt F3
    altbin115: "Play the media two times slower", // Alt F4
    altbin116: "Play the media two times faster", // Alt F5
    altbin117: "Insert any empty line begining at the current time and with the current locutor information", // Alt F6
    altbin118: "Play three main lines around the current one", // Alt F7

    shiftbin9: "Play from the start of the current line", // Shift Tab
    shiftbin112: "Play from the current media time", // Shift F1

//	shiftbin114: "Specific function (trjs.keys.special1)" , // Shift F3
    shiftbin115: "Local save in HTML format", // Shift F4
    shiftbin117: "Insert a blank line with current locutor before the current line", // shift F6

    api0: "Front closed unrounded vowel English see, Spanish sí, French vite, German mi.e.ten, Italian visto",
    api1: "(small capital I) Front closed unrounded vowel, but somewhat more centralised and relaxed English city, German mit",
    api2: "Front half closed unrounded vowel US English bear, Spanish él, French année, German mehr, Italian rete, Catalan més",
    api3: "Front half open unrounded vowel English bed, French même,German Herr, Männer, Italian ferro, Catalan mes, Spanish perro",
    api4: "(ae ligature) Front open unrounded vowel English cat",
    api5: "Front closed rounded vowel French du, German Tür",
    api6: "(slashed o) Front half closed rounded vowel French deux (hence '2'), German Höhle",
    api7: "(ligature oe) Front half open rounded vowel French neuf (hence '9'), German Hölle",
    api8: "(overstroked i) Central closed unrounded vowel Russian мыс [m1s] 'cape'",
    api9: "(turned down e) Schwa central neutral unrounded vowel English about, winner,German bitte",
    api10: "(turned down a) Open schwa central neutral unrounded vowel German besser",
    api11: "(Greek epsilon mirrored to the left) Front half open unrounded vowel, but somewhat more centralised and relaxed English bird",
    api12: "Central open vowel Spanish da, barra, French bateau, lac, German Haar, Italian pazzo",
    api13: "(overstroked u) Central closed rounded vowel Scottish English pool, Swedish sju",
    api14: "(overstroked o) Central neutral rounded vowel Swedish kust",
    api15: "(small capital OE ligatur) Front open rounded vowel American English that",
    api16: "(upside-down m) Back closed unrounded vowel Japanese fuji, Vietnamese ư Korean 으",
    api17: "(squeezed Greek gamma) Back half closed unrounded vowel Vietnamese ơ Korean 어",
    api18: "(turned down v) Back half open unrounded vowel RP and US English run, enough",
    api19: "('d' with no upper tail) Back open unrounded vowel English arm, US English law, standard French âme",
    api20: "Back closed rounded vowel English soon, Spanish tú, French goût, German Hut, Mutter, Italian azzurro, tutto",
    api21: "(turned down small capital Greek omega) Back closed rounded vowel somewhat more centralised and relaxed English put, (non-US)Buddhist",
    api22: "Back half closed rounded vowel US English sore, Scottish English boat, Spanish yo, French beau, German Sohle, Italian dove, Catalan ona",
    api23: "(c mirrored to the left) Back half open rounded vowel British English law, caught, Italian cosa, Catalan dona, Spanish ojo, German Wort",
    api24: "('b' with no upper tail) Back open rounded vowel British English not, cough",
// consonants
    api25: "Voiceless bilabial plosive English pen",
    api26: "Voiced bilabial plosive English but",
    api27: "Voiceless alveolar plosive English two, Spanish toma ('capture')",
    api28: "Voiced alveolar plosive English do, Italian cade",
    api29: "Voiceless alveolar affricate Italian calza, German zeit",
    api30: "Voiced alveolar affricate Italian zona ('zone')",
    api31: "Voiceless postalveolar affricate English chair, , Spanish mucho ('many')",
    api32: "Voiced postalveolar affricate English gin, Italian giorno",
    api33: "Voiceless palatal plosive Hungarian tyúk 'hen'",
    api34: "Voiced palatal plosive Hungarian egy 'one'",
    api35: "Voiceless velar plosive English skill",
    api36: "Voiced velar plosive English go",
    api37: "Voiceless uvular plosive Arabic qof",
    api38: "Voiceless bilabial fricative Japanese fu",
    api39: "Voiced bilabial fricative Catalan roba 'clothes'",
    api40: "Voiceless labiodental fricative English fool, Spanish and Italian falso ('false')",
    api41: "Voiced labiodental fricative English voice, German Welt",
    api42: "Voiceless dental fricative English thing, Castilian Spanish caza",
    api43: "Voiced dental fricative English this",
    api44: "Voiceless alveolar fricative English see, Spanish sí ('yes')",
    api45: "Voiced alveolar fricative English zoo, German See",
    api46: "Voiceless postalveolar fricative English she, French chemin",
    api47: "Voiced postalveolar fricative French jour, English pleasure",
    api48: "Voiceless palatal fricative Standard German Ich",
    api49: "Voiced palatal fricative Standard Spanish ayuda",
    api50: "Voiceless velar fricative Scots loch, Castilian Spanish ajo",
    api51: "Voiced velar fricative Greek γάλα ('milk')",
    api52: "Velar approximant Spanish algo",
    api53: "Voiceless pharyngeal fricative Arabic h.â",
    api54: "Voiced pharyngeal fricative Arabic 'ayn",
    api55: "Voiceless glottal fricative English ham, German Hand",
    api56: "Voiced glottal fricative Hungarian lehet",
    api57: "Bilabial nasal English man",
    api58: "Labiodental nasal Spanish infierno, Hungarian kámfor",
    api59: "Alveolar nasal English, Spanish and Italian no",
    api60: "Palatal nasal Spanish año, French oignon",
    api61: "Velar nasal English ring, Italian bianco, Tagalog ngayón",
    api62: "Alveolar lateral approximant English left, Spanish largo",
    api63: "Palatal lateral approximant Italian aglio, Catalan colla,",
    api64: "Velarized dental lateral English meal Catalan alga",
    api65: "Alveolar tap Spanish pero, Italian essere",
    api66: "Alveolar trill Spanish perro",
    api67: "Alveolar approximant English run",
    api68: "Uvular trill Standard German Reich",
    api69: "Labiodental approximant Dutch Waar",
    api70: "Labial-velar approximant English we, French oui",
    api71: "Labial-palatal approximant French huit",
    api72: "Palatal approximant English yes, French yeux",
// others
    api73: "Lengthening of vowel",
    api74: "Nasal vowel",
    api75: "Front half closed unrounded nasal vowel brin",
    api76: "Back closed rounded nasal vowel French ton",
    api77: "Back open unrounded nasal vowel French temps",
    api78: "Front half open rounded nasal vowel French brun",
    api79: "R parisien",

    bincon: "Table of keys",
    apibincon: "Table of API keys",
    messagetitle: "Bindings for the keyboard",
    printkeys: "Print the list of the keys",
    printapikeys: "Print the list of the API keys",
    tkey: "Keys",
    tapikey: "Keys",
    tbin: "Bindings",
    tapibin: "API",
    generic: "Basic macro menu",
};

trjs.messgs_fra = {
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    fileserver: 'Serveur de fichiers',
    namesoftware: 'TRJS',

    chooseaction: 'Choisir une autre action pour les fichiers de transcription',
    display: 'Afficher ou éditer une transcription (et un média)',
    backtrjs: 'Revenir à TRJS sans recharger de fichier',
    cvtteiml: 'Convertir une transcription vers le format TEI',
    cvtclan: 'Convert transcription to CLAN',
    cvttrs: 'Convert transcription to Transcriber',
    deltranscription: 'Supprimer une transcription du serveur (mettre dans la corbeille)',
    newtranscription: "Créer une nouvelle transcription à partir d'un média",
    loadmedia: 'Charger un fichier média',
    cvthtml5med: 'Convertir un media vers HTML5 vidéo (mp4 and ogv): taille moyenne 480p',
    cvthtml5low: 'Convertir un media vers HTML5 vidéo (mp4 and ogv): petite taille 240p',
    cvtmp4720: 'Convertir vers MP4 720p (HTML5 grande taille)',
    cvtogv720: 'Convertir vers OGV 720p (HTML5 grande taille)',
    cvtmpeg480: 'Convertir vers MPEG 480p (taille moyenne)',
    cvtmov480: 'Convertir vers MOV 480p (taille moyenne)',
    cvtmov720: 'Convertir vers MOV 720p (grande taille)',
    extractaudio: "Extraire l'audio de la vidéo pour HTML5",
    delmedia: 'Supprimer le media du serveur (mettre dans la corbeille)',
    messagelist: 'Montrer les messages',
    clearmru: 'Vider la liste des noms de fichiers récemment utilisés',
    rmgarbage: 'Supprimer définitivement les fichiers de la corbeille',

    gotext: 'Choisir une action pour les transcriptions',
    gomedia: 'Choisir une action pour les medias',

    bdisplay: 'Voir',
    bbacktrjs: 'Revenir',
    bcvtteiml: 'TEI',
    bcvtclan: 'CLAN',
    bcvttrs: 'Transcriber',
    bdeltranscription: 'Supprimer transcription',
    bnewtranscription: 'Nouveau fichier',
    bloadmedia: 'Charger',
    bcvthtml5med: 'Vidéo moyenne',
    bcvthtml5low: 'Petite vidéo',
    bcvtmp4720: 'Grand MP4',
    bcvtogv720: 'Grand OGV',
    bcvtmpeg480: 'MPEG moyen',
    bcvtmov480: 'MOV moyen',
    bcvtmov720: 'Grand MOV',
    bextractaudio: 'Vers audio',
    bdelmedia: 'Supprimer média',
    bmessagelist: 'Liste des messages',
    bclearmru: 'Vider fichiers récents',
    brmgarbage: 'Vider corbeille',
    bnoaction: 'Pas d\'action sélectionnée',
    bsinglemultiple: 'Inverser choix simple/multiple',
    bdeselect: 'Réinitialiser les sélections',
    bsaveasfile: 'Enregistrer sous un nouveau nom',
    bcreatedir: 'Créer un nouveau dossier',
    berasedir: 'Supprimer un dossier',

    bgotext: 'Transcriptions',
    bgomedia: 'Médias',
    bgoother: 'Autres',

    selectedmsg: 'Fichiers sélectionnés',
    infodirs: 'Naviger dans votre système de fichiers',
    infofiles: 'Choisir une transcription et/ou un fichier média',
    infoaction: 'Choisir une action',
    maininfoaction: 'Action à réaliser >>>',
    defchoiceaction: 'pas sélectionnée (voir ci-dessous)',
    selectmultiple: '(sélection multiple possible)',
    selectsingle: '(sélectionner un seul fichier)',
    alertmessages: "Messages d'alerte",
    help: 'Aide',
    newfile: "nouveau document",
    exporttrans: "Exporté comme ",
    exportname: " sous le nom ",
    exporterror: " Erreur d'export ",

    reload: 'RECHARGER',
    up: 'REMONTER',
    home: 'HOME',

    askrename: 'Voulez vous vraiment renommer la transcrition (le nom du fichier transcription) de ',
    filenm: 'Fichier ',
    movedto: ' a été déplacé de ',
    mustfn: 'Vous devez choisir un nom pour sauver votre fichier. Sauvegarde interne seulement.',
    mustsave: 'Le fichier a changé. Voulez vous quitter sans sauver ?',
    haschanged: 'Le fichier a changé. Voulez-vous le sauver ?',
    backfile: "Les dernières modifications n'ont pas été sauvegardées. Cliquer annuler pour revenir à l'édition du document précédent.",
    wantback: "Le fichier a été changé mais pas sauvé. Revenez si vous voulez le sauver.",
    errorfile: "Erreur de traitement de fichier : ",
    errorformat: 'ERREUR - format XML incorrect - le chargement peut être incomplet. Vérifier les résultats et utilisez un autre format - nodeName=',
    errorloading: "Erreur de chargement de fichier : ",
    initdiv: "(mettre ici une description de l'enregistrement ou de la transcription)",
    inittrs: "(commencer à transcrire ici)",
    notallowedemptyfile: "Erreur : impossible d'avoir un nom vide dans le champ recordingName",
    cannotmove: 'Impossible de déplacer le fichier ',

    nodivminus: "Il n'y a pas de \'div\' à fermer ici: impossible d'ajouter un -div-",
    noteif: "Il ne s'agit pas d'un fichier TEI.",

    menustopspan: 'Menus',
    searchtopspan: 'Recherche',
    filestopspan: 'Fichiers',
    files: 'Fichiers',
    fopentrs: 'Ouvrir une transcription',
    infopentrs: 'Raccourci clavier: Ctrl + O',
    fopenmedia: 'Choisir un média',
    infopenmedia: 'Raccourci clavier: Ctrl + Alt + O',
    fnewtrs: 'Nouvelle transcription',
    frecentfiles: 'Fichiers récents',
    fhrecentfiles: 'Liste des fichiers',
    frecentfilesempty: '...fichiers récents...',
    feraserecentfiles: 'Effacer fichiers récents',
    fsave: 'Enregistrer',
    infsave: 'Raccourci clavier: Ctrl + S',
    fsaveas: 'Enregistrer sous...',
    fsavecache: 'Sauver dans le cache',
    fdownload: 'Export local',
    fexporttext: 'Export vers Texte (.txt)',
    fexportrtf: 'Export vers Word Rtf (.rtf)',
    fexportdocx: 'Export vers Word Docx (.docx)',
    fexporttrs: 'Export vers Transcriber (.trs)',
    fexportclan: 'Export vers Clan (.cha)',
    fexportpraat: 'Export vers Praat (.textgrid)',
    fexportelan: 'Export vers Elan (.eaf)',
    fexportcsv: 'Export vers Csv (.csv)',
    fexportexcel: 'Export vers Excel (.xlsx)',
    fopenlocaltrs: 'Importer une transcription locale',
    fopenlocalmedia: 'Importer un média local',

    fmult: 'Sélection multiple',
    fmultshow: 'Montrer/cacher la sélection multiple',
    fmultselect: 'Sélectionner tout',
    fmultdeselect: 'Désélectionner tout',
    fmultcut: 'Couper la sélection',
    fmultcopy: 'Copier la sélection',
    fmultpaste: 'Coller',
    fmulttotei: 'Exporter la sélection au format TEIML',
    fmulttotxt: 'Exporter la sélection au format Texte/Spreadsheet',
    fmulttomedia: 'Extraire le média sans sous-titres pour la sélection',
    fmulttosubt: 'Extraire le média avec les sous-titres pour la sélection',
    fmulttosubtall: 'Extraire tout le média avec les sous-titres',
    fmulttosubttextonlysrt: 'Extraire les sous-titres sans vidéo pour la sélection (fichier .srt)',
    fmulttosubttextonlyallsrt: 'Extraire les sous-titres sans vidéo pour tout le fichier (fichier .srt)',
    fmulttosubttextonlyass: 'Extraire les sous-titres sans vidéo pour la sélection (fichier .ass)',
    fmulttosubttextonlyallass: 'Extraire les sous-titres sans vidéo pour tout le fichier (fichier .ass)',
    fconvertmedia: 'Convertir un média',

    eedition: 'Edition',
    emetadata: 'Métadonnées',
    eparticip: 'Participants',
    estruct: 'Structure',
    echeck: 'Vérifier la transcription',
    emodec: 'Mode contrôle',
    emodeb: 'Mode bloqué',
    emodel: 'Mode libre',
    eparam: 'Paramètres',
    eundo: 'Annuler',
    elistundo: 'Liste des annulations',
    eredo: 'Refaire',
    ineundo: 'Raccourci clavier: Ctrl + Z',
    ineredo: 'Raccourci clavier: Ctrl + Y',

    search: ' Recherche',
    insearch: 'Raccourci clavier: Ctrl + F',
    shelp: 'Aide',
    squickhelp: 'Aide rapide',
    sextensivehelp: 'Aide complète (site)',
    skeypadfunctions: 'Liste des fonctions du clavier',
    supdate: 'Mise à jour du logiciel',
    smessgs: 'Messages',
    sabouttrjs: 'A propos de TranscriberJS',

    savetopspan: 'Sauver',
    paramspan: 'Paramètres',
    pparam: 'Paramètres',
    dochelp: 'Aide rapide (local)',
    gohelp: 'Aide complète (site)',
    messagesspan: 'Montrer les messages',
    ppartition: ' Affichage de la partition',
    pwave: ' Affichage du signal (intensité)',
    pbackstep: 'Valeur de retour en arrière (F2) :',
    pforwstep: 'Valeur de saut en avant (F3) :',
    pfmtlinktime: 'Format pour les repères temporels :',
    pdigitlinktime: 'Nombre de chiffres pour les millisecondes :',
    pshowlinktime: ' Afficher les temps des alignements',
    pnbsaves: 'Nombre de versions de sauvegarde :',
    pshownames: ' Afficher les noms de participants à la place des codes',
    pshownumbers: ' Afficher les numéros de lignes',
    pmode: 'Edition des zones d\'affichage :',
    pinsertreplace: 'Edition de la transcription :',
    pinsert: 'Insertion',
    preplace: 'Remplacement',
    pusequality: 'Méthode de sélection de qualité de vidéo : ',
    inpusequality: 'La sélection automatique préserve le meilleur rapport de qualité de la vidéo par rapport au débit internet dont vous disposez.',
    pquality: 'Qualité vidéo: ',
    inpquality: 'Qualité décroissante (de très haute définition en terme de pixels à basse définition)',
    pcheckatsave: ' Vérifier la transcription lors de la sauvegarde',
    preorder: 'Réorganiser les lignes dynamiquement',
    checkspan: 'Vérifier le fichier courant',
    icheck: 'Vérifier le fichier ',
    checkfe: 'Erreurs trouvées :',

    tools: 'Outils',

    o1: 'Charger une transcription depuis un fichier local :',
    o2: 'Charger un média depuis un fichier local :',
    o3: 'Cliquer ci-dessus pour sélectionner une transcription ou faire glisser un nom de fichier',
    o4: 'Charger une transcription depuis le serveur :',
    o5: 'Aller sur le serveur !',
    o6: 'Charger un média depuis le serveur :',
    o8: 'Sauver sur le serveur :',
    o9: 'Sauver !',
    o10: 'Sauver en mémoire cache :',
    o9a: 'Sauver !',
    o11: 'Exporter vers le répertoire Téléchargements :',
    o12: 'Sauver la transcription sous ...',
    o13: 'Exporter vers Excel :',
    o14: 'Exporter vers Excel ...',
    o15: "Cliquer s'il vous plaît pour sauver la transcription",
    o16: 'Démarrer une nouvelle transcription :',
    o17: 'Démarrer !',
    o18: 'Démarrer une nouvelle transcription depuis un média sur le serveur :',
    conversions: 'Le format du media n\'est pas compatible avec TranscriberJS: une conversion de format est nécessaire. Voulez vous convertir les fichiers automatiquement ? Si oui, attendez la fin de conversion pour éditer ce fichier !',
    notcompatibleHTMLMedia1: "Le format du media ",
    notcompatibleHTMLMedia2: " n\'est pas compatible avec TranscriberJS (format HTML5). Vous pouvez choisir un autre fichier ou attendre la fin de la conversion (ceci peut prendre du temps)",
    notcompatTitle: "Format média non compatible",
    convertMediaTitle: "Convertir un fichier media",
    notcompatibleConvertHTMLMedia1: "Le format du média ",
    notcompatibleConvertHTMLMedia2: " n\'est pas compatible avec TranscriberJS (HTML5 format). Vous devez le convertir.",
    notcompatibleNotexist1: "Le média ",
    notcompatibleNotexist2: " n'existe pas. Vous devez choisir un autre fichier.",
    notcompatNotexistTitle: "Fichier inexistant",
    notcompatCompatibleTitle: "Format média incompatible",
    labelotherfile: "Choisir un autre fichier",
    labelsmallvideo: "Petit format", // "Convertir dans un format vidéo de petite taille",
    labelmediumvideo: "Format moyen",
    labellargevideo: "Grand format", // "Convertir dans un format vidéo de grande taille<br>(long et non recommandé pour petits écrans et portables)",
    labelaudio: "Audio seul",
    labelcancel: "Annuler",
    labelconvert: "Conversion",
    convertfromchat: "Le ficher doit être converti depuis le format CHAT/CLAN",
    convertfromtrs: "Le ficher doit être converti depuis le format Transcriber",
    convertfromelan: "Le ficher doit être converti depuis le format ELAN/EAF",
    convertfrompraat: "Le ficher doit être converti depuis le format Praat/TextGrid",
    convertfromtxt: "Le ficher doit être converti depuis le format Texte",
    convertfromcsv: "Le ficher doit être converti depuis le format Csv (tableur)",
    filescleaned: "Fichiers d'installation effacés",

    undolist: 'Liste des changements (annulation possible)<br/>',
    redolist: '<br/>Commandes pouvant être refaites<br/>',
    nomoreundo: 'Plus rien à annuler',
    nomoreredo: 'Plus rien à refaire',

    nomedia: 'Pas de media',
    loading: "Chargement...",
    askforerase: "Voulez vous écraser l'ancien fichier du même nom ",

    oflab1: 'Enregistrer la transcription sous ',
    oflab2: 'Ouvrir un fichier (tous types) ',
    oflab3: 'Ouvrir une transcription ',
    oflab4: 'Choisir un média pour ',
    oflab5: 'Choisir un média ',
    ofcancel: 'Annuler',
    ofchoice: 'Choisir un fichier',
    oftrsfiles: 'Transcriptions',
    ofallfiles: 'Tous les fichiers',
    ofmediafiles: 'Médias',
    ofsaveas: 'Enregistrer',

    mediarepl1: 'Le media ',
    mediarepl2: ' est utilisé en remplacement de ',
    convertMedia: 'Convertir le média : ',

    metadataspan: "Métadonnées",
    infodc: "(informations sur le format Dublin-Core)",
    participantspan: "Liste des locuteurs",
    templatespan: "Liste des tiers",
    searchspan: "Rechercher dans le fichier courant",
    ssearch: "Chercher un mot ou une chaîne de caractère : ",

    pplang: "Langue",
    ppdisplay: " Affichage",
    ppem: "Modes d'édition",
    ppsettings: " Réglages",
    ppchecking: " Vérification",
    ppconversion: "Conversion",

    insertreplacemodeInsert: "Mode Insertion",
    insertreplacemodeReplace: "Mode Remplacement",
    headloc: "Locuteur",
    headts: "Début",
    headte: "Fin",
    wavei: "Signal (intensité)",
    controlm: "Mode Contrôle",
    lockm: "Mode Bloqué",
    freem: "Mode Libre",
    eshifttime: "Décaler tous les repères temporels ",
    shifttimelinks: 'Une sélection est en cours. Voulez-vous décaler les repères temporels seulement sur la sélection ?',
    askshifttimelinks: 'Donnez une valeur temporelle (en secondes) pour le décalage: ',

    warning: 'Attention: information importante',
    warningLocalTranscript: "Chargement de transcription locale: sauver le fichier n'est possible qu'avec les fonctions d'exportation.",
    warningLocalMedia: "Chargement de média local: Afficher le signal n'est pas possible avec cette fonction.",
    labelnotagain: 'Ne pas afficher ce message à nouveau.',
    sresetwarnings: "Réinitialiser tous les messages d'aide",
    labelok: 'Ok',

    timeEndSmallerBegin: 'Impossible de mettre un temps de fin avant un temps de début',
    timeBeginGreaterEnd: 'Impossible de mettre un temps de début après un temps de fin',
    checknoerror: "Pas d'erreur dans le document",

    ftnotrsf: 'Aucun fichier de transcription disponible ici',
    ftnomedf: 'Aucun fichier media disponible ici',
    ftnof: 'Aucun fichier disponible ici',

    cbwarning1: 'Le media ',
    cbwarning2: ' n\'est pas compatible avec votre navigateur. Merci de choisir un autre format pour ce media ou d\'utiliser un navigateur différent.',

    about: '<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">'
    + '<img alt="Licence Creative Commons" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />'
    + '<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">TranscriberJS</span> de'
    + '<span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName"> Christophe Parisse </span>'
    + 'est mis à disposition selon les termes de la <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">'
    + 'licence Creative Commons Attribution -  Partage dans les mêmes Conditions 4.0 International</a>.<br />'
    + 'Fondé(e) sur une œuvre à <a xmlns:dct="http://purl.org/dc/terms/" href="http://ct3.ortolang.fr/trjs/" rel="dct:source">http://ct3.ortolang.fr/trjs/</a>.<br />'
    + 'Téléchargement de la version complète: <a href="http://ct3.ortolang.fr/trjs/">http://ct3.ortolang.fr/trjs/</a><br />'
    + 'Téléchargement de la version beta en développement: <a href="http://ct3.ortolang.fr/trjs/doku.php?id=doc:vbeta">http://ct3.ortolang.fr/trjs/doku.php?id=doc:vbeta</a><br />'
    + 'Soutien Inserm/Modyco (CNRS/Université Paris Ouest Nanterre) - DGLFLF - Ortolang (<a href="http://www.ortolang.fr">www.ortolang.fr</a>)<br />',
    aboutlib: 'Outils et libraires externes utilisées pour la réalisation du logiciel:<br />'
    + 'HTML5, Node.js, jQuery, Bootstrap, Ffmpeg<br />'
    + 'FileSaver.js, parseUri, Electron, Bootbox.js, Rangy<br />'
    + 'Font Awesome by Dave Gandy - http://fontawesome.io<br />',

    esff: 'Mauvais format de motif de recherche: recherche impossible.',
    ediv: 'Doit appartenir au \'div\' pour être masqué.',
    emsg1: "Une nouvelle version a été installée. L'installation complète nécessite un redémarrage. Il est possible de mettre à jour une version partielle en redémarrant en local. Voulez-vous redémarrer en local?",
    emsg2: "Une nouvelle version a été installée. Voulez-vous redémarrer maintenant?",
    emsg3: "Une nouvelle version a été installée. Elle prendra effet au prochain démarrage de TRJS.",
    ennv: "Pas de nouvelle version disponible.",
    eerup: "Erreur de mise à jour de TranscriberJS: ",

    sssearch: "Rechercher",
    ssearchrepl: "Remplacer",
    sdisplay: "Affichage",
    sgoto: "Aller à",
    sfields: "Dans le(s) champ(s) : ",
    sloc: "Locuteurs",
    signore: "Ignorer minuscules/majuscules",
    sresu: "Résultats trouvés : ",
    ssearchrep: "Rechercher le mot ou la chaîne de caractère suivante : ",
    sreplfields: "Dans le(s) champ(s) : ",
    sreplloc: "Locuteurs",
    sreplignore: "Ignorer minuscules/majuscules",
    sreplresu: "Résultats trouvés : ",
    sreplrep: "Remplacer par : ",
    sshow: "Afficher les locuteurs ou lignes suivantes : ",
    sshowfields: "Dans le(s) champ(s) : ",
    sshowloc: "Locuteurs",
    shide: "Cacher les locuteurs ou lignes suivantes : ",
    shidefields: "Dans le(s) champ(s) : ",
    shideloc: "Locuteurs",
    sgotoline: "Aller à la ligne : ",
    sgototime: "Aller au repère temporel : ",
    tisgotoline: "Ctrl L",
    tisgototime: "Ctrl T",

    exportit: "Export et téléchargement",
    exportfile: "Tout le fichier",
    exportselect: "Sélection",
    exportmenufile: "Exporter vers...",
    exportmenuselect: "Exporter la sélection...",
    exportmediafile: "Exporter le média...",
    exportmediaselect: "Exporter la sélection du média...",
    exportclose: "Fermer",

    infodownload: "Téléchargement",
    infocontrol: "En mode Contrôle ou Standard, la zone transcription commande la zone média mais pas l'inverse. Cela permet de déplacer le média sans se déplacer dans la transcription et ainsi de corriger l'alignement temps - transcription de manière aisée. ",
    infolock: "En mode Bloqué, les zones transcription et média sont synchronisées. Il est possible de commander la transcription depuis le média (des touches spéciales visio existent à cet effet).",
    infofree: "En mode Libre, la zone transcription et la zone média sont complétement indépendantes.",

    tytitle: "Titre",
    tyname: "Nom",
    tyloc: "Emplacement",
    tydate: "Date",
    typlacen: "Lieu",
    tymname: "Nom",
    tymrelloc: "Emplacement relatif",
    tymloc: "Emplacement",
    tymtype: "Type",
    tymdur: "Durée",

    infotytitle: "Description de la transcription",
    infotyname: "Nom du fichier de transcription",
    infotyloc: "Emplacement du fichier (chemin seulement)",
    infotydate: "Date de l'enregistrement",
    infotyplacen: "Lieu de l'enregistrement",
    infotymname: "Nom du fichier audio or vidéo",
    infotymrelloc: "Emplacement relatif du fichier audio or vidéo",
    infotymloc: "Emplacement du fichier audio or vidéo (chemin seulement)",
    infotymtype: "Type du média type (audio ou vidéo)",
    infotymdur: "Durée du média",

    temptitle: "Titre",
    tempcreator: "Créateur",
    tempsubject: "Sujet",
    tempdesc: "Description",
    temppub: "Editeur",
    tempcontr: "Contributeur",
    tempdate: "Date",
    temptype: "Type de ressource",
    tempformat: "Format",
    tempid: "Identifiant de la ressource",
    tempsrc: "Source",
    templang: "Langue",
    temprel: "Relation",
    tempcov: "Couverture",
    temprig: "Droits",

    codecode: "Code",
    codespeaker: "Nom locuteur",
    codecontent: "Contenu",
    codedesc: "Description",

    tierstier: "Tier",
    tierstype: "Type",
    tiersparent: "Parent",
    tiersspeaker: "Nom locuteur",
    tierscontent: "Contenu",
    tiersdesc: "Description",

    personID: "ID",
    personage: "Age",
    personname: "Nom",
    personsex: "Sexe",
    personlanguage: "Langue",
    persongroup: "Groupe",
    personrole: "Role",
    personSES: "SES",
    personeduc: "Education",
    personsrc: "Source",
    personinfo: "Information",

    tititle: "Titre du document",
    ticreator: "Créateur du document",
    tisubject: "Sujet et mots-clefs",
    tidesc: "Description du document",
    tipub: "Editeur du document",
    ticontr: "Contributeur au document",
    tidate: "Date d'un événement dans le cycle de vie du document",
    titype: "Nature ou genre du contenu",
    tiformat: "Format du document",
    tiid: "Identificateur non ambigu",
    tisrc: "Ressource dont dérive le document",
    tilang: "Langue du document",
    tirel: "Lien vers une ressource liée",
    ticov: "Portée du document",
    tirig: "Droits relatifs à la ressource",

    intititle: "Titre du document : il s'agit a priori du titre principal du document.",
    inticreator: "Créateur du document : nom de la personne, de l'organisation ou du service à l'origine de la rédaction du document.",
    intisubject: "Sujet et mots-clefs : mots-clefs, phrases de résumé, ou codes de classement. Il est préférable d'utiliser des mots-clefs choisis dans le cadre d'une politique de classement. Par exemple, on peut utiliser les codages de la bibliothèque du congrès (LCSH et LCC), le vocabulaire médical (MESH), ou les notations décimales des bibliothécaires (DDC et UDC).",
    intidesc: "Description du document : résumé, table des matières, ou texte libre.",
    intipub: "Publicateur du document : nom de la personne, de l'organisation ou du service à l'origine de la publication du document.",
    inticontr: "Contributeur au document : nom d'une personne, d'une organisation ou d'un service qui contribue ou a contribué à l'élaboration du document.",
    intidate: "Date d'un événement dans le cycle de vie du document : il peut s'agir par exemple de la date de création ou de la date de mise à disposition. Il est recommandé de spécifier la date au format W3CDTF (AAAA-MM-JJ).",
    intitype: "Nature ou genre du contenu : grandes catégories de document. Il est recommandé d'utiliser des termes clairement définis au sein de son organisation. Par exemple, le Dublin Core définit quelques types dans le vocabulaire DCMITypes.",
    intiformat: "Format du document : format physique ou électronique du document. Par exemple, type de média ou dimensions (taille, durée). On peut spécifier le matériel et le logiciel nécessaires pour accéder au document. Il est recommandé d'utiliser des termes clairement définis, par exemple les types MIME.",
    intiid: "Identificateur non ambigu : il est recommandé d'utiliser un système de référencement précis, par exemple les URI ou les numéros ISBN.",
    intisrc: "Ressource dont dérive le document : le document peut découler en totalité ou en partie de la ressource en question. Il est recommandé d'utiliser une dénomination formelle des ressources, par exemple leur URI.",
    intilang: "Langue du document : il est recommandé d'utiliser un code de langue conforme au format RFC4646.",
    intirel: "Lien vers une ressource liée : il est recommandé d'utiliser une dénomination formelle des ressources, par exemple leur URI.",
    inticov: "Portée du document : la portée inclut un domaine géographique, un laps de temps, ou une juridiction (nom d'une entité administrative). Il est recommandé d'utiliser des représentations normalisées de ces types de données, par exemple TGN (Thesaurus of Geographic Names, un dictionnaire de noms de lieux), ISO3166, Point ou Box pour la portée spatiale, Period ou W3CDTF pour la portée temporelle.",
    intirig: "Droits relatifs à la ressource : permet de donner des informations sur le statut des droits du document, par exemple la présence d'un copyright, ou un lien vers le détenteur des droits. L'absence de cette propriété ne présume pas que le document est libre de droits.",

    symbasso: 'Association symbolique',
    orthol: 'Ligne orthographique',
    phonl: 'Ligne phonétique',

    savepref: "Enregistrer les préférences",
    converr1: "Erreur de conversion du fichier ",
    converr2: " vers le format Teiml (",
    errload1: "Erreur ",
    errload2: " de chargement du fichier : ",
    errload: "Erreur de chargement du fichier : ",
    unkform: "Format inconnu pour le fichier ",
    mederrab: "Vous avez stoppé la lecture de la vidéo.",
    mederrnet: "Une erreur de réseau a stoppé le téléchargement du fichier audio.",
    mederrdec: "La lecture audio a été stoppée en raison d'un problème de corruption de fichier ou parce que le format n'est pas supporté par le navigateur.",
    mederrsrc: "Le média ne peut pas être chargé, soit en raison d'un problème de connexion serveur ou réseau, soit parce que le média n'est pas supporté.",
    mederr: "Une erreur inconnue est survenue.",
    convnotst: "Impossible de lancer la conversion: veuillez attendre que la conversion précédente soit terminée.",
    mednotcor: "Le média décrit dans les métadonnées ne correspond pas à un format média connu: merci de choisir un autre média.",
    mednotex: "Le média n'existe pas. Merci de choisir un autre fichier média.",
    mednotop: "Le média ne s'ouvre pas. Merci de choisir un autre fichier média.",

    infoinsert: "Le mode Insertion (Alt + F6) insère une ligne et note le temps courant.",
    inforeplace: "Le mode Remplacement (Ctrl + M) aligne la fin de l'énoncé avec le temps courant et saute à la ligne suivante; si on est en fin de fichier, alors une ligne est insérée (ce mode permet de réaligner des lignes déjà transcrites).",
    endconv: "Fin de la conversion.",
    cannoterase: "Impossible d'effacer.",
    cannotinsert: "Impossible d'insérer une ligne ici. Une nouvelle métadonnée ne peut être insérée qu'après la section Dublin Core section seulement.",
    cannotdelete: "Impossible de supprimer une ligne ici. Une nouvelle métadonnée ne peut être supprimée qu'après la section Dublin Core section seulement.",
    cannotlast: 'Impossible de supprimer la dernière ligne.',

    int1: "Lecture simple/Pause: TAB",
    int2: "Saisir le temps de début: F4",
    int3: "Saisir le temps de fin: F5",
    int4: "Insérer une ligne vide: F6",
    int5: "Lecture de la ligne courante: F7",
    int6: "Lecture continue: F8",
    iconzoomin: "Zoom +",
    iconzoomout: "Zoom -",
    buttonpageleft: "Page précédente",
    buttonpageright: "Page suivante",

    intp1: "Ouvrir une transcription: Ctrl O",
    intp2: "Ouvrir un média: Ctrl Alt O",
    intp3: "Enregistrer: Ctrl S",
    intp4: "Rechercher: Ctrl Alt F",
    intp5: "Tout sélectionner: Ctrl A",
    intp6: "Annuler: Ctrl Z",
    intp7: "Refaire: Ctrl Y",
    intp8: "Insérer une ligne vide: Ctrl I",
    intp8b: "Insérer une ligne vide + temps: Ctrl Alt I",
    intp9: "Modifier temps (fin ligne courante, début précédente): Ctrl M",
    intp10: "Supprimer la ligne: Ctrl D",
    intp11: "Joindre la ligne: Ctrl J",
    intp12: "Dupliquer la ligne: Ctrl R",
    intp13: "Diviser la ligne: Ctrl Alt R",
    intp14: "Lecture ralentie: Ctrl B",
    intp15: "Lecture accélérée: Ctrl E",
    intp16: "Agrandir: Alt F3",
    intp17: "Rétrécir: Alt F2",

    intpp1: "Montrer/cacher sélection multiple: Ctrl Alt F8",
    intpp2: "Sélectionner tout",
    intpp3: "Désélectionner tout",
    intpp4: "Couper sélection",
    intpp5: "Copier la sélection",
    intpp6: "Coller la sélection",
    intpp7: "Télécharger la sélection",

    mprop: "Propriété",
    mval: "Valeur",

    tree: "Choisir un fichier dans l'arborescence.",

    opensavespan: "Charger et sauver le fichier ",
    trsize: " taille : ",
    annul: "Annuler",
    askforreorder: "La réorganisation automatique des lignes modifie profondément la manière d'aligner temporellement. Etes-vous sûr de vouloir l'utiliser ?",

    bin9: "Lecture à partir du début de la ligne courante, pause (ou tab)", // Tab
    bin10: "Marquer le temps de fin de la ligne courante principale et le temps de début de la suivante et sauter à la ligne suivante", // return Key
    bin13: "Marquer le temps de fin de la ligne courante principale et le temps de début de la suivante et sauter à la ligne suivante", // return Key
    bin27: "Pause", // Esc
    bin33: "Aller en haut de la page", // Page Up
    bin34: "Aller en bas de la page", // Page Down
    bin38: "Aller à la ligne précédente", // Up
    bin40: "Aller à la ligne suivante", // Down
    bin112: "Lecture simple et pause", // F1
    bin113: "Revenir en arrière", // F2
    bin114: "Aller en avant", // F3
    bin115: "Alignement du début de l'énoncé avec le temps courant", // F4
    bin116: "Alignement de la fin de l'énoncé avec le temps courant", // F5
    bin117: "Insertion d'une nouvelle ligne avec le locuteur courant ", // F6
    bin118: "Lecture de la ligne courante", // F7
    bin119: "Lecture continue à partir de la ligne courante", // F8

    ctrlbin49: "Rappel du 1er locuteur", // Ctrl 1
    ctrlbin50: "Rappel du 2nd locuteur", // Ctrl 2
    ctrlbin51: "Rappel du 3ème locuteur", // Ctrl 3
    ctrlbin52: "Rappel du 4ème locuteur", // Ctrl 4
    ctrlbin53: "Rappel du 5ème locuteur", // Ctrl 5
    ctrlbin54: "Rappel du 6ème locuteur", // Ctrl 6
    ctrlbin55: "Rappel du 7ème locuteur", // Ctrl 7
    ctrlbin56: "Rappel du 8ème locuteur", // Ctrl 8
    ctrlbin57: "Rappel du 9ème locuteur", // Ctrl 9

    ctrlbin35: "Aller à la fin du fichier", // Ctrl End
    ctrlbin36: "Aller au début du fichier", // Ctrl Home
    ctrlbin66: "Jouer le média plus lentement", // Ctrl B
    ctrlbin68: "Supprimer la ligne courante", // Ctrl D
    ctrlbin69: "Jouer le média plus rapidement", // Ctrl E
    ctrlbin71: "Créer une division du texte (séquence ou saynète)", // Ctrl G
    ctrlbin73: "Insérer une ligne vide", // Ctrl I
    ctrlbin74: "Joindre deux lignes (ligne courante et la suivante)", // Ctrl J
    ctrlbin76: "Aller au numéro de ligne...", // Ctrl L
    ctrlbin77: "Marquer le temps de fin de la ligne courante principale et le temps de début de la suivante et sauter à la ligne suivante", // Ctrl M
    ctrlbin79: "Ouvrir une transcription", // Ctrl O
    ctrlbin82: "Dupliquer la ligne courante", // Ctrl R
    ctrlbin83: "Sauvegarder", // Ctrl S
    ctrlbin84: "Aller au repère temporel...", // Ctrl T
    ctrlbin85: "Cacher les divisions du texte", // Ctrl U
//	ctrlbin88: "" , // Ctrl X
    ctrlbin89: "Refaire la dernière modification", // Ctrl Y
    ctrlbin90: "Annuler la dernière modification", // Ctrl Z

    ctrlshiftbin49: "Marquer la ligne courante comme début d'une division", // Ctrl Shift 1
    ctrlshiftbin50: "Marquer la ligne courante comme fin d'une division", // Ctrl Shift 2
    ctrlshiftbin71: "Fermer toutes les divisions ouvertes", // Ctrl Shift G

    ctrlaltbin49: "Rappel de la 1ère structure", // Ctrl Alt 1
    ctrlaltbin50: "Rappel de la 2ème structure", // Ctrl Alt 2
    ctrlaltbin51: "Rappel de la 3ème structure", // Ctrl Alt 3
    ctrlaltbin52: "Rappel de la 4ème structure", // Ctrl Alt 4
    ctrlaltbin53: "Rappel de la 5ème structure", // Ctrl Alt 5
    ctrlaltbin54: "Rappel de la 6ème structure", // Ctrl Alt 6
    ctrlaltbin55: "Rappel de la 7ème structure", // Ctrl Alt 7
    ctrlaltbin56: "Rappel de la 8ème structure", // Ctrl Alt 8
    ctrlaltbin57: "Rappel de la 9ème structure", // Ctrl Alt 9

    ctrlaltbin65: "Sélectionner la ligne", // Ctrl Alt A
    ctrlaltbin66: "Lecture à l'envers", // Ctrl Alt B
    ctrlaltbin68: "Supprimer une ligne et tous celles qui en dépendent", // Ctrl Alt D
    ctrlaltbin69: "Lecture à une rythme normal", // Ctrl Alt E
    ctrlaltbin70: "Faire une recherche", // Ctrl F
    ctrlaltbin71: "Marquer la fin d'une division", // Ctrl Alt G
    ctrlaltbin73: "Insérer une ligne vide avec le temps courant", // Ctrl Alt I
    ctrlaltbin74: "Joindre la ligne courante principale avec la ligne principale suivante", // Ctrl Alt J

    ctrlaltbin77: "Marquer le temps de fin de la ligne courante et le temps de début de la suivante", // Ctrl Alt M
    ctrlaltbin79: "Charger un média", // Ctrl Alt O
    ctrlaltbin82: "Scinder une ligne en deux (à l'endroit où se trouve le curseur) sans indication temporelle", // Ctrl Alt R
    ctrlaltbin85: "Montrer les divisions cachées", // Ctrl Alt U

    ctrlbin119: "Diminuer le zoom (toute la fenêtre)", // Ctrl F8
    ctrlbin120: "Augmenter le zoom (toute la fenêtre)", // Ctrl F9

    ctrlaltbin113: "Colorer le texte sélectionné en rouge", // Ctrl Alt F2
    ctrlaltbin114: "Colorer le texte sélectionné en vert", // Ctrl Alt F3
    ctrlaltbin115: "Colorer le texte sélectionné en bleu", // Ctrl Alt F4
    ctrlaltbin116: "Mettre le texte sélectionné en gras", // Ctrl Alt F5
    ctrlaltbin117: "Mettre le texte sélectionné en italique", // Ctrl Alt F6
    ctrlaltbin118: "Mettre le texte sélectionné en petites majuscules (EM: emphasis)", // Ctrl Alt F7
    ctrlaltbin119: "Afficher/cacher la sélection multiple", // Ctrl Alt F8
    ctrlaltbin120: "Extraire la sélection en soustitres (format .srt)", // Ctrl Alt F9
    ctrlaltbin121: "Extraire la sélection en soustitres (format .ass)", // Ctrl Alt F10
    ctrlaltbin122: "Extraire la sélection en soustitres avec le média", // Ctrl Alt F11
    ctrlaltbin123: "Extraire la sélection en média", // Ctrl Alt F12

    altbin37: "Revenir en arrière", // Alt Left
    altbin38: "Aller à la ligne principale précédente", // Alt Up
    altbin39: "Aller en avant", // Alt Right
    altbin40: "Aller à la ligne principale suivante", // Alt Down
    altbin112: "Lecture à partir de l'endroit où le curseur est situé, pause", // Alt F1
    altbin113: "Réduire la taille de la vidéo", // Alt F2
    altbin114: "Agrandir la taille de la vidéo", // Alt F3
    altbin115: "Jouer la vidéo moins vite", // Alt F4
    altbin116: "Jouer la vidéo plus vite", // Alt F5
    altbin117: "Insérer une ligne vide sous un locuteur en notant le temps courant", // Alt F6
    altbin118: "Jouer 3 lignes autour de la ligne courante", // Alt F7

    shiftbin9: "Lecture à partir du début de la ligne courante", // Shift Tab
    shiftbin112: "Lecture à partir du temps du média, pause", // Shift F1

//	shiftbin114: "specific function (trjs.keys.special1)" , // Shift F3
    shiftbin115: "Sauvegarde locale au format HTML", // Shift F4
    shiftbin117: "Inserer une ligne blanche au dessus de la ligne courante", // shift F6

    api0: "Voyelle antérieure fermée non arrondie English see, Spanish sí, French vite, German mi.e.ten, Italian visto",
    api1: "Voyelle quasi-antérieure non arrondie ",
    api2: "Voyelle antérieure mi-fermée non arrondie US English bear, Spanish él, French année, German mehr, Italian rete, Catalan més",
    api3: "Voyelle antérieure mi-ouverte non arrondie English bed, French même,German Herr, Männer, Italian ferro, Catalan mes, Spanish perro",
    api4: "(e dans l'a) Voyelle antérieure ouverte non arrondie English cat",
    api5: "Voyelle antérieure fermée arrondie French du, German Tür",
    api6: "Voyelle moyenne supérieure antérieure arrondie ",
    api7: "Voyelle moyenne inférieure antérieure arrondie",
    api8: "(overstroked i) Voyelle centrale fermée non arrondie Russian мыс [m1s] 'cape'",
    api9: "(e inversé) Voyelle schwa centrale neutre non arrondie English about, winner,German bitte",
    api10: "(a inversé) Voyelle ouverte schwa centrale neutre non arrondie German besser",
    api11: "(epsilon Grec inversé vers la gauche) Voyelle antérieure mi-ouverte non arrondie, but somewhat more centralised and relaxed English bird",
    api12: "Voyelle centrale ouverte Spanish da, barra, French bateau, lac, German Haar, Italian pazzo",
    api13: "(u barré) Voyelle centrale fermée arrondie Scottish English pool, Swedish sju",
    api14: "(o barré) Voyelle centrale neutre arrondie Swedish kust",
    api15: "(e dans l'o en petites capitales) Voyelle front ouverte arrondie American English that",
    api16: "(m inversé) Voyelle postérieure fermée non arrondie Japanese fuji, Vietnamese ư Korean 으",
    api17: "(gamma Grec) Voyelle postérieure mi-fermée non arrondie Vietnamese ơ Korean 어",
    api18: "(v inversé) Voyelle postérieure mi-ouverte non arrondie RP and US English run, enough",
    api19: "Voyelle postérieure postérieure non arrondie",
    api20: "Voyelle postérieure fermée arrondie English soon, Spanish tú, French goût, German Hut, Mutter, Italian azzurro, tutto",
    api21: "(omega grec inversé en petites capitales) Voyelle postérieure fermée arrondie somewhat more centralised and relaxed English put, (non-US)Buddhist",
    api22: "Voyelle postérieure mi-fermée arrondie US English sore, Scottish English boat, Spanish yo, French beau, German Sohle, Italian dove, Catalan ona",
    api23: "Voyelle moyenne inférieure postérieure arrondie ",
    api24: "('b' sans barre) Voyelle postérieure ouverte arrondie British English not, cough",
// consonants
    api25: "Consonne bilabiale plosive sourde English pen",
    api26: "Consonne bilabiale plosive voisée English but",
    api27: "Consonne alvéolaire plosive sourde English two, Spanish toma ('capture')",
    api28: "Consonne alvéolaire plosive voisée English do, Italian cade",
    api29: "Consonne alvéolaire affriquée sourde Italian calza, German zeit",
    api30: "Consonne alvéolaire affriquée voisée Italian zona ('zone')",
    api31: "Consonne post alvéolaire affriquée sourde English chair, , Spanish mucho ('many')",
    api32: "Consonne post alvéolaire affriquée voisée English gin, Italian giorno",
    api33: "Consonne palatale plosive sourde Hungarian tyúk 'hen'",
    api34: "Consonne palatale plosive voisée Hungarian egy 'one'",
    api35: "Consonne velaire plosive sourde English skill",
    api36: "Consonne velaire plosive voisée English go",
    api37: "Consonne uvulaire plosive sourde Arabic qof",
    api38: "Consonne bilabiale fricative sourde Japanese fu",
    api39: "Consonne bilabiale fricative voisée Catalan roba 'clothes'",
    api40: "Consonne labiodentale fricative sourde English fool, Spanish and Italian falso ('false')",
    api41: "Consonne labiodentale fricative voisée English voice, German Welt",
    api42: "Consonne dentale fricative sourde English thing, Castilian Spanish caza",
    api43: "Consonne dentale fricative voisée English this",
    api44: "Consonne alvéolaire fricative sourde English see, Spanish sí ('yes')",
    api45: "Consonne alvéolaire fricative voisée English zoo, German See",
    api46: "Consonne fricative post-alvéolaire sourde French chemin",
    api47: "Consonne fricative post-alvéolaire voisée French jour, English pleasure",
    api48: "Consonne palatale fricative sourde Standard German Ich",
    api49: "Consonne palatale fricative voisée Standard Spanish ayuda",
    api50: "Consonne vélaire fricative sourde Scots loch, Castilian Spanish ajo",
    api51: "Consonne vélaire fricative voisée Greek γάλα ('milk')",
    api52: "Consonne vélaire approximante Spanish algo",
    api53: "Consonne pharyngale fricative sourde Arabic h.â",
    api54: "Consonne pharyngale fricative voisée Arabic 'ayn",
    api55: "Consonne glottale fricative sourde English ham, German Hand",
    api56: "Consonne glottale fricative voisée Hungarian lehet",
    api57: "Consonne bilabiale nasale English man",
    api58: "Consonne labiodentale nasale Spanish infierno, Hungarian kámfor",
    api59: "Consonne alvéolaire nasale English, Spanish and Italian no",
    api60: "Consonne occlusive nasale palatale voisée Spanish año, French oignon",
    api61: "Consonne vélaire nasale English ring, Italian bianco, Tagalog ngayón",
    api62: "Consonne alvéolaire latérale approximante English left, Spanish largo",
    api63: "Consonne palatale latérale approximante Italian aglio, Catalan colla,",
    api64: "Consonne vélarisée dentale latérale English meal Catalan alga",
    api65: "Consonne alvéolaire tap Spanish pero, Italian essere",
    api66: "Consonne alvéolaire trill Spanish perro",
    api67: "Consonne alvéolaire approximante English run",
    api68: "Consonne roulée uvulaire voisée",
    api69: "Consonne labiodentale approximante Dutch Waar",
    api70: "Consonne labiale-vélaire approximante English we, French oui",
    api71: "Consonne spirante labio-palatale voisée French huit",
    api72: "Consonne palatale approximante English yes, French yeux",
// others
    api73: "Allongement de voyelle",
    api74: "Voyelle nasale",
    api75: "Voyelle antérieure mi-ouverte non arrondie nasale French brin",
    api76: "Voyelle moyenne supérieure antérieure arrondie nasale French ton",
    api77: "Voyelle moyenne inférieure postérieure arrondie nasale French temps",
    api78: "Voyelle postérieure postérieure non arrondie nasale French brun",
    api79: "R parisien",

    bincon: "Tableau des raccourcis claviers",
    apibincon: "Tableau des raccourcis claviers API",
    messagetitle: "Fonctions du clavier",
    printkeys: "Imprimer la liste des commandes claviers",
    printapikeys: "Imprimer la liste des commandes claviers pour l'API",
    tkey: "Raccourcis clavier",
    tapikey: "Raccourcis clavier",
    tbin: "Fonctions",
    tapibin: "API",
    generic: "Menu macro de base",
};

trjs.messgs = trjs.messgs_eng;

trjs.messgs_init = function () {
    $('#menus-top-span').text(trjs.messgs.menustopspan);
    $('#search-top-span').text(trjs.messgs.searchtopspan);
    $('#files-top-span').text(trjs.messgs.filestopspan);
    $('#save-top-span').text(trjs.messgs.savetopspan);
    $('#dochelp').text(trjs.messgs.dochelp);
    $('#gohelp').text(trjs.messgs.gohelp);
    $('#help-top-span').text(trjs.messgs.help);
    $('#param-span').text(trjs.messgs.paramspan);
    $('#pparam').text(trjs.messgs.pparam);
    $('#messages-span').text(trjs.messgs.messagesspan);
    $('#ppartition').text(trjs.messgs.ppartition);
    $('#pwave').text(trjs.messgs.pwave);
    $('#pbackstep').text(trjs.messgs.pbackstep);
    $('#pforwstep').text(trjs.messgs.pforwstep);
    $('#pfmtlinktime').text(trjs.messgs.pfmtlinktime);
    $('#pdigitlinktime').text(trjs.messgs.pdigitlinktime);
    $('#pshowlinktime').text(trjs.messgs.pshowlinktime);
    $('#pnbsaves').text(trjs.messgs.pnbsaves);
    $('#pshownames').text(trjs.messgs.pshownames);
    $('#pshownumbers').text(trjs.messgs.pshownumbers);
    $('#pmode').text(trjs.messgs.pmode);
    $('#pinsertreplace').text(trjs.messgs.pinsertreplace);
    $('#pinsert').text(trjs.messgs.pinsert);
    $('#preplace').text(trjs.messgs.preplace);
    $('#pcheckatsave').text(trjs.messgs.pcheckatsave);
    $('#pTEIMLliteformat').text(trjs.messgs.pTEIMLliteformat);
    $('#preorder').text(trjs.messgs.preorder);
    $('#metadata-span').text(trjs.messgs.metadataspan);
    $('#infodc').text(trjs.messgs.infodc);
    $('#participant-span').text(trjs.messgs.participantspan);
    $('#template-span').text(trjs.messgs.templatespan);
    $('#messages-span').text(trjs.messgs.messagesspan);
    $('#search-span').text(trjs.messgs.searchspan);
    $('#ssearch').text(trjs.messgs.ssearch);
    $('#sshow').text(trjs.messgs.sshow);
    $('#shide').text(trjs.messgs.shide);
    $('#sgotoline').text(trjs.messgs.sgotoline);
    $('#sgototime').text(trjs.messgs.sgototime);
    $('#sgotoline').attr('title', trjs.messgs.tisgotoline);
    $('#sgototime').attr('title', trjs.messgs.tisgototime);
    $('#check-span').text(trjs.messgs.checkspan);
    $('#icheck').text(trjs.messgs.icheck);
    $('#checkfe').text(trjs.messgs.checkfe);

    $('#tools').text(trjs.messgs.tools);

    $('#o1').text(trjs.messgs.o1);
    $('#o2').text(trjs.messgs.o2);
    $('#o3').text(trjs.messgs.o3);
    $('#o4').text(trjs.messgs.o4);
    $('#o5').text(trjs.messgs.o5);
    $('#o6').text(trjs.messgs.o6);
    $('#o8').text(trjs.messgs.o8);
    $('#o9').text(trjs.messgs.o9);
    $('#o10').text(trjs.messgs.o10);
    $('#o9a').text(trjs.messgs.o9a);
    $('#o11').text(trjs.messgs.o11);
    $('#o12').text(trjs.messgs.o12);
    $('#o13').text(trjs.messgs.o13);
    $('#o14').text(trjs.messgs.o14);
    $('#o15').text(trjs.messgs.o15);
    $('#o16').text(trjs.messgs.o16);
    $('#o17').text(trjs.messgs.o17);
    $('#o18').text(trjs.messgs.o18);

    $('#files').text(trjs.messgs.files);
    $('#fopentrs').text(trjs.messgs.fopentrs);
    $('#fopentrs').attr('title', trjs.messgs.infopentrs);
    $('#fopenmedia').text(trjs.messgs.fopenmedia);
    $('#fopenmedia').attr('title', trjs.messgs.infopenmedia);
    $('#fnewtrs').text(trjs.messgs.fnewtrs);
    $('#frecentfiles').text(trjs.messgs.frecentfiles);
    $('#fhrecentfiles').text(trjs.messgs.fhrecentfiles);
    $('#frecentfilesempty').text(trjs.messgs.frecentfilesempty);
    $('#feraserecentfiles').text(trjs.messgs.feraserecentfiles);
    $('#fsave').text(trjs.messgs.fsave);
    $('#fsave').attr('title', trjs.messgs.infsave);
    $('#fsaveas').text(trjs.messgs.fsaveas);
    $('#fsavecache').text(trjs.messgs.fsavecache);
    $('#fdownload').text(trjs.messgs.fdownload);
    $('#fexporttext').text(trjs.messgs.fexportext);
    $('#fexporttrs').text(trjs.messgs.fexporttrs);
    $('#fexportclan').text(trjs.messgs.fexportclan);
    $('#fexportexcel').text(trjs.messgs.fexportexcel);
    $('#fexportcsv').text(trjs.messgs.fexportcsv);
    $('#fopenlocaltrs').text(trjs.messgs.fopenlocaltrs);
    $('#fopenlocalmedia').text(trjs.messgs.fopenlocalmedia);
    $('#fmult').text(trjs.messgs.fmult);
    $('#fmultshow').text(trjs.messgs.fmultshow);
    $('#fmultselect').text(trjs.messgs.fmultselect);
    $('#fmultdeselect').text(trjs.messgs.fmultdeselect);
    $('#fmultcut').text(trjs.messgs.fmultcut);
    $('#fmultcopy').text(trjs.messgs.fmultcopy);
    $('#fmultpaste').text(trjs.messgs.fmultpaste);
    $('#fmulttotei').text(trjs.messgs.fmulttotei);
    $('#fmulttotxt').text(trjs.messgs.fmulttotxt);
    $('#fmulttomedia').text(trjs.messgs.fmulttomedia);
    $('#fmulttosubt').text(trjs.messgs.fmulttosubt);
    $('#fmulttosubtall').text(trjs.messgs.fmulttosubtall);
    $('#fmulttosubttextonlysrt').text(trjs.messgs.fmulttosubttextonlysrt);
    $('#fmulttosubttextonlyallsrt').text(trjs.messgs.fmulttosubttextonlyallsrt);
    $('#fmulttosubttextonlyass').text(trjs.messgs.fmulttosubttextonlyass);
    $('#fmulttosubttextonlyallass').text(trjs.messgs.fmulttosubttextonlyallass);
    $('#fconvertmedia').text(trjs.messgs.fconvertmedia);

    $('#eedition').text(trjs.messgs.eedition);
    $('#emetadata').text(trjs.messgs.emetadata);
    $('#eparticip').text(trjs.messgs.eparticip);
    $('#estruct').text(trjs.messgs.estruct);
    $('#echeck').text(trjs.messgs.echeck);
    $('#emodec').text(trjs.messgs.emodec);
    $('#emodeb').text(trjs.messgs.emodeb);
    $('#emodel').text(trjs.messgs.emodel);
    $('#eparam').text(trjs.messgs.eparam);
    $('#eundo').text(trjs.messgs.eundo);
    $('#eundo').attr('title', trjs.messgs.ineundo);
    $('#elistundo').text(trjs.messgs.elistundo);
    $('#eredo').text(trjs.messgs.eredo);
    $('#eredo').attr('title', trjs.messgs.ineredo);

    $('#search').text(trjs.messgs.search);
    $('#search').attr('title', trjs.messgs.insearch);
    $('#shelp').text(trjs.messgs.shelp);
    $('#squickhelp').text(trjs.messgs.squickhelp);
    $('#sextensivehelp').text(trjs.messgs.sextensivehelp);
    $('#skeypadfunctions').text(trjs.messgs.skeypadfunctions);
    $('#supdate').text(trjs.messgs.supdate);
    $('#smessgs').text(trjs.messgs.smessgs);
    $('#sresetwarnings').text(trjs.messgs.sresetwarnings);
    $('#sabouttrjs').text(trjs.messgs.sabouttrjs);

    $('#insertreplacemode').text(trjs.messgs.insertreplacemode);
    $('#insertreplacemodeInsert').text(trjs.messgs.insertreplacemodeInsert);
    $('#insertreplacemodeReplace').text(trjs.messgs.insertreplacemodeReplace);

    $('#headloc').text(trjs.messgs.headloc);
    $('#headts').text(trjs.messgs.headts);
    $('#headte').text(trjs.messgs.headte);
    $('#wavei').text(trjs.messgs.wavei);
    $('#controlm').text(trjs.messgs.controlm);
    $('#lockm').text(trjs.messgs.lockm);
    $('#freem').text(trjs.messgs.freem);
    $('#eshifttime').text(trjs.messgs.eshifttime);

    $('#pplang').text(trjs.messgs.pplang);
    $('#ppdisplay').text(trjs.messgs.ppdisplay);
    $('#ppem').text(trjs.messgs.ppem);
    $('#ppsettings').text(trjs.messgs.ppsettings);
    $('#ppchecking').text(trjs.messgs.ppchecking);
    $('#ppconversion').text(trjs.messgs.ppconversion);

    $('#sssearch').text(trjs.messgs.sssearch);
    $('#ssearchrepl').text(trjs.messgs.ssearchrepl);
    $('#sdisplay').text(trjs.messgs.sdisplay);
    $('#sgoto').text(trjs.messgs.sgoto);
    $('#sfields').text(trjs.messgs.sfields);
    $('#sloc').text(trjs.messgs.sloc);
    $('#strs').text(trjs.messgs.strs);
    $('#signore').text(trjs.messgs.signore);
    $('#sresu').text(trjs.messgs.sresu);
    $('#ssearchrep').text(trjs.messgs.ssearchrep);
    $('#sreplfields').text(trjs.messgs.sreplfields);
    $('#sreplloc').text(trjs.messgs.sreplloc);
    $('#srepltrs').text(trjs.messgs.srepltrs);
    $('#sreplignore').text(trjs.messgs.sreplignore);
    $('#sreplresu').text(trjs.messgs.sreplresu);
    $('#sreplrep').text(trjs.messgs.sreplrep);
    $('#sshow').text(trjs.messgs.sshow);
    $('#sshowfields').text(trjs.messgs.sshowfields);
    $('#sshowloc').text(trjs.messgs.sshowloc);
    $('#sshowtrs').text(trjs.messgs.sshowtrs);
    $('#shide').text(trjs.messgs.shide);
    $('#shidefields').text(trjs.messgs.shidefields);
    $('#shideloc').text(trjs.messgs.shideloc);
    $('#shidetrs').text(trjs.messgs.shidetrs);
    $('#sgotoline').text(trjs.messgs.sgotoline);
    $('#sgototime').text(trjs.messgs.sgototime);

    $('#exporttit').text(trjs.messgs.exportit);
    $('#exportfile').text(trjs.messgs.exportfile);
    $('#exportselect').text(trjs.messgs.exportselect);
    $('#exportmenufile').text(trjs.messgs.exportmenufile);
    $('#exportmenuselect').text(trjs.messgs.exportmenuselect);
    $('#exportmediafile').text(trjs.messgs.exportmediafile);
    $('#exportmediaselect').text(trjs.messgs.exportmediaselect);
    $('#exportclose').text(trjs.messgs.exportclose);
    $('#savepref').text(trjs.messgs.savepref);

    $('#tititle').text(trjs.messgs.tititle);
    $('#ticreator').text(trjs.messgs.ticreator);
    $('#tisubject').text(trjs.messgs.tisubject);
    $('#tidesc').text(trjs.messgs.tidesc);
    $('#tipub').text(trjs.messgs.tipub);
    $('#ticont').text(trjs.messgs.ticont);
    $('#tidate').text(trjs.messgs.tidate);
    $('#titype').text(trjs.messgs.titype);
    $('#tiformat').text(trjs.messgs.tiformat);
    $('#tiid').text(trjs.messgs.tiid);
    $('#tisrc').text(trjs.messgs.tisrc);
    $('#tilang').text(trjs.messgs.tilang);
    $('#tirel').text(trjs.messgs.tirel);
    $('#ticov').text(trjs.messgs.ticov);
    $('#tiprig').text(trjs.messgs.tiprig);

    $('#symbasso').text(trjs.messgs.symbasso);
    $('#orthol').text(trjs.messgs.orthol);
    $('#phonl').text(trjs.messgs.phonl);

    $('#tititle').attr('title', trjs.messgs.intititle);
    $('#ticreator').attr('title', trjs.messgs.inticreator);
    $('#tisubject').attr('title', trjs.messgs.intisubject);
    $('#tidesc').attr('title', trjs.messgs.intidesc);
    $('#tipub').attr('title', trjs.messgs.intipub);
    $('#ticont').attr('title', trjs.messgs.inticont);
    $('#tidate').attr('title', trjs.messgs.intidate);
    $('#titype').attr('title', trjs.messgs.intitype);
    $('#tiformat').attr('title', trjs.messgs.intiformat);
    $('#tiid').attr('title', trjs.messgs.intiid);
    $('#tisrc').attr('title', trjs.messgs.intisrc);
    $('#tilang').attr('title', trjs.messgs.intilang);
    $('#tirel').attr('title', trjs.messgs.intirel);
    $('#ticov').attr('title', trjs.messgs.inticov);
    $('#tiprig').attr('title', trjs.messgs.intiprig);

    $('#temptitle').text(trjs.messgs.temptitle);
    $('#tempcreator').text(trjs.messgs.tempcreator);
    $('#tempsubject').text(trjs.messgs.tempsubject);
    $('#tempdesc').text(trjs.messgs.tempdesc);
    $('#temppub').text(trjs.messgs.temppub);
    $('#tempcont').text(trjs.messgs.tempcont);
    $('#tempdate').text(trjs.messgs.tempdate);
    $('#temptype').text(trjs.messgs.temptype);
    $('#tempformat').text(trjs.messgs.tempformat);
    $('#tempid').text(trjs.messgs.tempid);
    $('#tempsrc').text(trjs.messgs.tempsrc);
    $('#templang').text(trjs.messgs.templang);
    $('#temprel').text(trjs.messgs.temprel);
    $('#tempcov').text(trjs.messgs.tempcov);
    $('#tempprig').text(trjs.messgs.tempprig);

    $('#controlm').attr('title', trjs.messgs.infocontrol);
    $('#lockm').attr('title', trjs.messgs.infolock);
    $('#freem').attr('title', trjs.messgs.infofree);

    $('#tytitle').text(trjs.messgs.tytitle);
    $('#tyname').text(trjs.messgs.tyname);
    $('#tyloc').text(trjs.messgs.tyloc);
    $('#tydate').text(trjs.messgs.tydate);
    $('#typlacen').text(trjs.messgs.typlacen);
    $('#tymname').text(trjs.messgs.tymname);
    $('#tymrelloc').text(trjs.messgs.tymrelloc);
    $('#tymloc').text(trjs.messgs.tymloc);
    $('#tymtype').text(trjs.messgs.tymtype);
    $('#tymdur').text(trjs.messgs.tymdur);

    $('#infotytitle').text(trjs.messgs.infotytitle);
    $('#infotyname').text(trjs.messgs.infotyname);
    $('#infotyloc').text(trjs.messgs.infotyloc);
    $('#infotydate').text(trjs.messgs.infotydate);
    $('#infotyplacen').text(trjs.messgs.infotyplacen);
    $('#infotymname').text(trjs.messgs.infotymname);
    $('#infotymrelloc').text(trjs.messgs.infotymrelloc);
    $('#infotymloc').text(trjs.messgs.infotymloc);
    $('#infotymtype').text(trjs.messgs.infotymtype);
    $('#infotymdur').text(trjs.messgs.infotymdur);

    $('#pinsert').attr('title', trjs.messgs.infoinsert);
    $('#preplace').attr('title', trjs.messgs.inforeplace);
    $('#fdownload').attr('title', trjs.messgs.infodownload);

    $('#t1').attr('title', trjs.messgs.int1);
    $('#t2').attr('title', trjs.messgs.int2);
    $('#t3').attr('title', trjs.messgs.int3);
    $('#t4').attr('title', trjs.messgs.int4);
    $('#t5').attr('title', trjs.messgs.int5);
    $('#t6').attr('title', trjs.messgs.int6);
    $('#iconzoomin').attr('title', trjs.messgs.iconzoomin);
    $('#iconzoomout').attr('title', trjs.messgs.iconzoomout);
    $('#button-page-left').attr('title', trjs.messgs.buttonpageleft);
    $('#button-page-right').attr('title', trjs.messgs.buttonpageright);

    $('#tp1').attr('title', trjs.messgs.intp1);
    $('#tp2').attr('title', trjs.messgs.intp2);
    $('#tp3').attr('title', trjs.messgs.intp3);
    $('#tp4').attr('title', trjs.messgs.intp4);
    $('#tp5').attr('title', trjs.messgs.intp5);
    $('#tp6').attr('title', trjs.messgs.intp6);
    $('#tp7').attr('title', trjs.messgs.intp7);
    $('#tp8').attr('title', trjs.messgs.intp8);
    $('#tp8b').attr('title', trjs.messgs.intp8b);
    $('#tp9').attr('title', trjs.messgs.intp9);
    $('#tp10').attr('title', trjs.messgs.intp10);
    $('#tp11').attr('title', trjs.messgs.intp11);
    $('#tp12').attr('title', trjs.messgs.intp12);
    $('#tp13').attr('title', trjs.messgs.intp13);
    $('#tp14').attr('title', trjs.messgs.intp14);
    $('#tp15').attr('title', trjs.messgs.intp15);
    $('#tp16').attr('title', trjs.messgs.intp16);
    $('#tp17').attr('title', trjs.messgs.intp17);

    $('#tpp1').attr('title', trjs.messgs.intpp1);
    $('#tpp2').attr('title', trjs.messgs.intpp2);
    $('#tpp3').attr('title', trjs.messgs.intpp3);
    $('#tpp4').attr('title', trjs.messgs.intpp4);
    $('#tpp5').attr('title', trjs.messgs.intpp5);
    $('#tpp6').attr('title', trjs.messgs.intpp6);
    $('#tpp7').attr('title', trjs.messgs.intpp7);

    $('#mprop').text(trjs.messgs.mprop);
    $('#mval').text(trjs.messgs.mval);
    $('#tree').text(trjs.messgs.tree);

    $('#pusequality').text(trjs.messgs.pusequality);
    $('#pquality').text(trjs.messgs.pquality);
    $('#pusequality').attr('title', trjs.messgs.inpusequality);
    $('#pquality').attr('title', trjs.messgs.inpquality);
    $('#opensavespan').text(trjs.messgs.opensavespan);
    $('#trsize').text(trjs.messgs.trsize);
    $('#annul').text(trjs.messgs.annul);
    $('#bincon').text(trjs.messgs.bincon);
    $('#apibincon').text(trjs.messgs.apibincon);
    $('#message-title').text(trjs.messgs.messagetitle);
    $('#printkeys').text(trjs.messgs.printkeys);
    $('#printapikeys').text(trjs.messgs.printapikeys);
    $('#tkey').text(trjs.messgs.tkey);
    $('#tapikey').text(trjs.messgs.tapikey);
    $('#tbin').text(trjs.messgs.tbin);
    $('#tapibin').text(trjs.messgs.tapibin);
};
