/*
 * routine initializing the html page
 * @module init.js
 * @author Christophe Parisse
 * 
 * this routine checks the url used to start the page
 * the value of port is used to set the type of server
 * 8101 for node.js
 * 8103 for express.js
 * 
 * the parameter of url mode can be use to set the server type (but not overridding the port information) and type of software
 * the first letter is server type p = php (or other standard server types), n for node.js, e for express.js
 * the rest of the parameter is used to set the type of software. There is no special convention, it has to be in the 
 * list below.
 */

'use strict';

trjs.init = function(force) {
	if (force) {
		var mode = force;
	} else {
		var sURL = window.document.URL.toString();
		var uri = parseUri(sURL);
		// console.log(uri);
		// console.log(uri.queryKey['mode']);
		var mode = uri.queryKey['mode'];
		if (uri.port === '8101') {
			// node.js
			if (mode)
				mode = 'n' + mode.substr(1);
			else
				mode = 'n6';
		} else if (uri.port === '8103') {
			// express.js
			if (mode)
				mode = 'e' + mode.substr(1);
			else
				mode = 'e6';
		} else if (uri.protocol === 'file') {
			// file://
			if (mode)
				mode = 'f' + mode.substr(1);
			else
				mode = 'f1';
		}
	}
	// console.log("Mode="+mode);
	if (mode) {
		switch (mode) {
		case 'n6':
			$(document).ready(function() {
				trjs.param.init('readwrite', 'local', 'nodejs', 'level6');
			});
			break;
		case 'n1':
			$(document).ready(function() {
				trjs.param.init('readonly', 'local', 'nodejs', 'level1');
			});
			break;
		case 'n0':
			$(document).ready(function() {
				trjs.param.init('readonly', 'local', 'nodejs', 'level0');
			});
			break;
		case 'e1':
			$(document).ready(function() {
				trjs.param.init('readonly', 'local', 'express', 'level1');
			});
			break;
		case 'e6':
			$(document).ready(function() {
				trjs.param.init('readwrite', 'local', 'express', 'level6');
			});
			break;
		case 'p1':
			$(document).ready(function() {
				trjs.param.init('readonly', 'distant', 'php', 'level1');
			});
			break;
		case 'p0':
			$(document).ready(function() {
				trjs.param.init('readonly', 'distant', 'php', 'level0');
			});
			break;
		case 'electron':
			$(document).ready(function() {
				trjs.param.init('readwrite', 'electron', 'electron', 'level6');
                window.onbeforeunload = function (e) {
                    console.log('I test to be closed');
                    trjs.param.saveStorage();
                    if (trjs.param.changed === true) {
                        trjs.io.innerSave();
                        if (trjs.editor.testNotSave() === false)
                        	e.returnValue = false;
                    }
                    // Unlike usual browsers that a message box will be prompted to users, returning
                    // a non-void value will silently cancel the close.
                    // It is recommended to use the dialog API to let the user confirm closing the
                    // application.
                };
			});
			break;
/*
		case 'f2':
			$(document).ready(function() {
				trjs.param.init('readwrite', 'local', 'nodejs', 'level6');
                trjs.param.cors = true; // to be tested and implemented in the nodejs server
                // not functionnal right now
			});
			break;
*/
		case 'f1':
			$(document).ready(function() {
				trjs.param.init('readwritelocal', 'file', 'none', 'level1');
			});
			break;
		case 'f0':
			$(document).ready(function() {
				trjs.param.init('readwritelocal', 'file', 'none', 'level0');
			});
			break;
		default:
			$(document).ready(function() {
				trjs.param.init('readonly', 'distant', 'php', 'level0');
			});
			break;
		}
	} else {
		$(document).ready(function() {
			trjs.param.init('readonly', 'distant', 'php', 'level0');
		});
	}
};