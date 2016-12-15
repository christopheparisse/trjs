/**
 * Utils.js
 * @author Christophe Parisse
 * sets of utilities to manipulate filenames and to display messages on the screen
 * Date: october 2013
 * @module utils
 * @author Christophe Parisse
 */

trjs.utils = ( function() {
	
	/**
	 * @method urlToPath
	 * @param url
	 */
	var urlToPath = function(url) {
		var ln = lastName(url);
		if (!ln) return { loc: url, name: '' };
		var pt = pathName(url);
		if (!pt) return { loc: url, name: '' };
		if (pt.indexOf('file://') === 0) pt = pt.substr(7);
		return { loc: pt, name: ln };
	};
	
	/**
	 * extract extension from filename
	 * @method extensionName
	 * @param {string} full name of file
	 * @return {string} extension
	 */
	var extensionName = function(s) {
		var i = s.lastIndexOf(".");
		var r;
		if (i <= 0) {
		    r = '';
		} else {
		    r = s.substr(i);
		}
		return r;
	};
	
	/**
	 * remove extension from filename
	 * @method headName
	 * @param {string} full name of file
	 * @return {string} filename without extension
	 */
	var headName = function(s) {
		var i = s.lastIndexOf(".");
		var r;
		if (i <= 0) {
		    r = s;
		} else {
		    r = s.substr(0, i);
		}
		return r;
	};
	
	/**
	 * remove extension from filename including -240p, -480p, -720p, -1080p, -master, -4K
	 * @method headName2
	 * @param {string} full name of file
	 * @return {string} filename without extension
	 */
	var headName2 = function(s) {
		var base = headName(s);
		var listofext = version.KNOWN_EXTENSIONS_SUP.split('|');
		for (var i in listofext) {
			if (base.lastIndexOf(listofext[i]) === (base.length - listofext[i].length))
				return base.substring(0, base.length - listofext[i].length);
		}
		return base;
	};
	
	/**
	 * filename from full pathname
	 * @method lastName
	 * @param {string} full pathname
	 * @return {string} name of file
	 */
	var lastName = function(s) {
		var i = s.lastIndexOf("/");
		var r;
		if (i <= 0) {
		    r = s;
		} else {
		    r = s.substr(i+1);
		}
		return r;
	};
	
	/**
	 * pathname from full filename
	 * @method pathName
	 * @param {string} full pathname
	 * @return {string} path of filename
	 */
	var pathName = function(s) {
		var i = s.lastIndexOf("/");
		var r;
		if (i <= 0) {
		    r = '.';
		} else {
		    r = s.substr(0, i);
		}
		return r;
	};

	/**
	 * detect the browser name and version
	 * results in variables 	currentBrowserName, currentFullVersion, and currentMajorVersion
	 * @method detectBrowser
	 */
	function detectBrowser() {
		var nVer = navigator.appVersion;
		var nAgt = navigator.userAgent;
		var browserName = navigator.appName;
		var fullVersion = '' + parseFloat(navigator.appVersion);
		var majorVersion = parseInt(navigator.appVersion, 10);
		var nameOffset, verOffset, ix;
	
		// In Opera, the true version is after "Opera" or after "Version"
		if (( verOffset = nAgt.indexOf("Opera")) != -1) {
			browserName = "Opera";
			fullVersion = nAgt.substring(verOffset + 6);
			if (( verOffset = nAgt.indexOf("Version")) != -1)
				fullVersion = nAgt.substring(verOffset + 8);
		}
		// In MSIE, the true version is after "MSIE" in userAgent
		else if (( verOffset = nAgt.indexOf("MSIE")) != -1) {
			browserName = "Microsoft Internet Explorer";
			fullVersion = nAgt.substring(verOffset + 5);
		}
		// In Chrome, the true version is after "Chrome"
		else if (( verOffset = nAgt.indexOf("Chrome")) != -1) {
			browserName = "Chrome";
			fullVersion = nAgt.substring(verOffset + 7);
		}
		// In Safari, the true version is after "Safari" or after "Version"
		else if (( verOffset = nAgt.indexOf("Safari")) != -1) {
			browserName = "Safari";
			fullVersion = nAgt.substring(verOffset + 7);
			if (( verOffset = nAgt.indexOf("Version")) != -1)
				fullVersion = nAgt.substring(verOffset + 8);
		}
		// In Firefox, the true version is after "Firefox"
		else if (( verOffset = nAgt.indexOf("Firefox")) != -1) {
			browserName = "Firefox";
			fullVersion = nAgt.substring(verOffset + 8);
		}
		// In most other browsers, "name/version" is at the end of userAgent
		else if (( nameOffset = nAgt.lastIndexOf(' ') + 1) < ( verOffset = nAgt.lastIndexOf('/'))) {
			browserName = nAgt.substring(nameOffset, verOffset);
			fullVersion = nAgt.substring(verOffset + 1);
			if (browserName.toLowerCase() == browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}
		// trim the fullVersion string at semicolon/space if present
		if (( ix = fullVersion.indexOf(";")) != -1)
			fullVersion = fullVersion.substring(0, ix);
		if (( ix = fullVersion.indexOf(" ")) != -1)
			fullVersion = fullVersion.substring(0, ix);
	
		majorVersion = parseInt('' + fullVersion, 10);
		if (isNaN(majorVersion)) {
			fullVersion = '' + parseFloat(navigator.appVersion);
			majorVersion = parseInt(navigator.appVersion, 10);
		}
	
		/*
		console.log('' 
			+ 'Browser name  = ' + browserName 
			+ ' Full version  = ' + fullVersion 
			+ ' Major version = ' + majorVersion 
			+ ' navigator.appName = ' + navigator.appName 
			+ ' navigator.userAgent = ' + navigator.userAgent 
			+ '');
		*/
		
		trjs.data.currentBrowserName = browserName;
		trjs.data.currentFullVersion = fullVersion;
		trjs.data.currentMajorVersion = majorVersion;
		
		trjs.data.OSName="Unknown OS";
		if (navigator.appVersion.indexOf("Win")!=-1) trjs.data.OSName="Windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) trjs.data.OSName="MacOS";
		if (navigator.appVersion.indexOf("X11")!=-1) trjs.data.OSName="UNIX";
		if (navigator.appVersion.indexOf("Linux")!=-1) trjs.data.OSName="Linux";

	}

	/**
	 * check whether browser support the function necessary for Transcriber.js
	 * @method checkStorageSupport
	 */
	function checkStorageSupport() {
		// sessionStorage and localStorage
		// Check for the various File API support.
		/*
		if (!window.sessionStorage || !window.localStorage || !window.File || !window.FileReader || !window.FileList || !window.Blob) {
			trjs.log.boxalert('Your browser is ' + trjs.data.currentBrowserName + ' version ' + trjs.data.currentFullVersion + '<br/>You need to update your browser to run Transcriber.js');
			window.location.href = "needupdatebrowser.html";
		}
		*/
	}

	/**
	 * utility function to avoid null value in incomplete attribute and text fields
	 * @method notnull
	 * @param string
	 * @return string or '' if null
	 */
	function notnull(s) {
	    return s != null ? s : '';
	}
	
	/**
	 * test if an element is visible in another
	 * @method notVisibleInContainer
	 * @param {jquery-object} container scrollable
	 * @param {jquery-object} element to check
	 * @return 0 if nothing to do or number of pixel to move the scroll to be ok
	 */
	function notVisibleInContainer(p, e)
	{
	    var cont = (p[0]).getBoundingClientRect();
	    var part = (e[0]).getBoundingClientRect();
	
	/*	console.log(cont);
		console.log(part);
	*/
	    //check style visiblilty and off-limits
	    var movt = part.bottom - cont.bottom;
	    if (movt > 0) return part.top - cont.top;  // up to top of cont
	    movt = part.top - cont.top;
	    if (movt < 0) return movt; // down to top of cont
	    return 0; 
	}
	
	/**
	 * same function as isNE but also test if not unknown directory
	 */
	var isNotSet = function(s) {
		if ( isNE(s) || s === codefn.UNKNOWNDIR )
			return true;
		else
			return false;
	};

	/**
	 * test if string is not null, not empty string, but can be 0 and not inf to 0
	 */
	var isNE = function(s) {
		if ( s===null || s === '' || s < 0)
			return true;
		else
			return false;
	};
	
	return {
		checkStorageSupport: checkStorageSupport,
		detectBrowser: detectBrowser,
		extensionName: extensionName,
		isNE: isNE,
		isNotSet: isNotSet,
		isWindows: function() { return trjs.data.OSName==="Windows" ? true : false; },
		isMacOS: function() { return trjs.data.OSName==="MacOS" ? true : false; },
		isLinux: function() { return trjs.data.OSName==="Linux" ? true : false; },
		headName: headName,
		headName2: headName2,
		lastName: lastName,
		pathName: pathName,
		notnull: notnull,
		notVisibleInContainer: notVisibleInContainer,
		urlToPath: urlToPath,
	};

})();

trjs.utils.printByID = function(strid) {
    var prtContent = document.getElementById(strid);
    $('#printform').attr('src', 'trjs-' + trjs.data.recName);
    trjs.utils.printHTML(prtContent.innerHTML);
};

trjs.utils.printHTML = function(str) {
    window.frames["print_frame"].document.body.innerHTML= str;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
/*	
    var winPrint = window.open('', '', 'letf=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status=0');
    winPrint.document.write(str);
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();
*/
};
