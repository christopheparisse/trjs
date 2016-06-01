/**
 * codefn.js
 *
 * encode and decode filenames to be processed by a client
 * @author Christophe Parisse
 */

if (typeof window === 'undefined') {
	var qs = require('querystring');
	/*
	 * load the various other files
	 */
	var	version = require('../editor/version.js');
	var codefn = exports;
} else {
	var qs = undefined;
	var codefn = {};
}

// var path = require('path'); // TODO implement real require for client

/**
 * the variables are used to encode and decode pathnames
 */
var labelNode = '/local/';
var labelDevice = '/dev/';

codefn.UNKNOWNDIR = '*Unknown*';
codefn.LOCALDIR = '*Local*';

/**
 * encode the filename so that it won't be recognized as a normal filename or url
 * this allows to avoid the limitations of cross domain access in client and web server
 * also node will know if a name is a local file to be served or a file name under the 'normal' file tree of a web server
 * this correspond more or less to function of virual alias in apache
 * also filename cannot look like filename in opera and chrome so this is necessary
 * this includes also escaping the string
 * @method encodeFilename
 * @param string {name} realfilename
 * @return string {newname} pseudofilename
 */
codefn.encodeFilename  = function(name) {
	name = name.replace(/\\/, '/');
	if (version.location === 'distant') {
		// console.log('distant: ' + name);
		if (version.server === 'php' || version.server === 'express')
			return name;
		else
			return codefn.encodeRawFilename(name); // it seems php and express internally do not need encoded file names
	} else if (version.location === 'local') {
		// console.log('encode:local: ' + name + ' ' + version.server);
		if (version.server === 'nodejs' || version.server === 'express') {
			if ( name.substr(1,1) === ':' ) { // case of windows filenames
				if (name.substr(2,1) === '/') // it is a namepath begining with /
					name = labelNode + name.slice(0,1) + labelDevice + name.slice(3);
			} else {
				if (name.substr(0,1) === '/') // it is a namepath begining with /
					name = labelNode + name.substr(1);
			}
		}
		// console.log('encode:local: ' + name);
		if (version.server === 'php' || version.server === 'express')
			return name;
		else
			return codefn.encodeRawFilename(name); // it seems php and express internally do not need encoded file names
	} else {
		alert('Unkown server type in codefn.encodeFilename - version.server should be set!');
		throw new Error("version.server should be set! (encode)");
		return name;
	}
};

/**
 * decode version of the function above
 * takes into account the potential addition of a '/' at the begining of the name by the client
 * this includes also unescaping the string
 * @method decodeFilename
 * @param string {name} pseudofilename
 * @return string {newname} realfilename
 */
codefn.decodeFilename = function(name) {
	if (!name) return name;

	if (version.location === 'distant') {
		// console.log('distant: ' + name);
		if (version.server === 'php' || version.server === 'express')
			return name;
		else
			return codefn.decodeRawFilename(name); // it seems php and express internally do not need encoded file names
	} else if (version.location === 'local') {
		// console.log('decode:local: ' + name + ' ' + version.server);
		if (version.server === 'php')
			return name;
		name = codefn.decodeRawFilename(name);
		var p = name.indexOf(labelNode);
		if ( p >= 0 && p <= 2 ) {
			name = name.slice(p + labelNode.length -1);
			p = name.indexOf(labelDevice);
			if (p !== -1)
				name = name.substr(1, 1) + ':' + name.slice(p + labelDevice.length -1);
				// path = path.substr(1,1) + ':' + path.slice(p + labelDevice.length -1);
			// console.log('decode:local: ' + name);
			return name;
		} else {
			if (qs === undefined || qs.unescape === undefined) return name; // if in client
			// console.log('local-not client: ' + name);
			return process.cwd() + (name.substr(0,1) == '/' ? name : '/' + name); // if in server : path relative to the running node command
			// TODO use path functions return path.join(process.cwd(), name);
		}
	} else {
		alert('Unkown server type in codefn.decodeFilename - version.server should be set!');
		throw new Error("version.server should be set! (decode)");
		return name;
	}
};

codefn.encodeRawFilename  = function(name) {
	name = name.replace(/\\/, '/');
	if (qs === undefined || qs.escape === undefined) {
		name = encodeURIComponent(name);
	}
	else {
		name = qs.escape(name);
	}
	return name;
};

/**
 * decode version without taking into account labelNode
 * deals with pure filenames without modifiers
 * @method decodeRawFilename
 * @param string {name} pseudofilename
 * @return string {newname} realfilename
 */
codefn.decodeRawFilename = function(name) {
//	console.log('decode: ' + name);
	if (!name) return name;
	if (qs === undefined || qs.unescape === undefined) {
		name = decodeURIComponent(name);
//		console.log('decode URI: ' + name);
	}
	else {
		name = qs.unescape(name);
//		console.log('decode unescape: ' + name);
	}
	return name;
};

/**
 * creates a url with file:// extension
 */
codefn.fileFilename  = function(name) {
	return 'file://' + name;
};
