/**
 * update files from a repository to a local server
 * @date: october 2014
 * @author Christophe Parisse
 */

'use strict';

var http = require('http');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var async = require('async');

var version = require('../editor/version.js');

var update = exports;

var ongoingDownloads = 0;
var ongoingTests = 0;
var totalDownloads = 0;
var intervalDownloads = null;
var cbGlobal = null;
var changesInNode = false;
var transcriberLastVersion = '/transcriberjs/lastupdate/';
var transcriberWebAddress = 'ct3.ortolang.fr';
var transcriberCurrentVersion = './';
var transcriberTemporary = 'temporary/';
var transcriberVersionInfo = 'update_info.json';
var newVersionNumber = '';

var isNewerFile = function(urldate, cb) {
	/*
	 * first get time date of remote file
	 */
	if (version.debug(__filename)) console.log('file: '+transcriberWebAddress + transcriberLastVersion + urldate.name);
	if (version.debug(__filename)) console.log(urldate.date);
	/*
	 * get time of local file
	 */
	if (version.debug(__filename)) console.log('compare to ' + transcriberCurrentVersion + urldate.name);
	fs.stat(transcriberCurrentVersion + urldate.name, function(err, stats) {
		if (!err) {
			if (version.debug(__filename)) console.log(urldate.date.toString() + ' -- ' + stats.mtime.toString());
			var tdlast = new Date(urldate.date.toString());
			if (version.debug(__filename)) console.log(tdlast.getTime() + ' -- ' + stats.mtime.getTime());
			if (tdlast.getTime() > stats.mtime.getTime())
				cb(true, urldate.name);
			else
				cb(false, urldate.name);
		} else {
			// the local file does not exist	
			cb(true, urldate.name);
			//console.log('cannot find '+ local + url);
		}
	});	
};

var downloadTemporary = function(url, cb) {
	var fn = transcriberTemporary + url;
	if (version.debug(__filename)) console.log('download this file: ' + 'http://' + transcriberWebAddress + transcriberLastVersion + url);
	if (version.debug(__filename)) console.log('to this location: ' + fn);
	var request = http.get('http://' + transcriberWebAddress + transcriberLastVersion + url, function(response) {
		var file = null;
		if (response.statusCode !== 200) {
			console.log("status " + response.statusCode + ' for ' + 'http://' + transcriberWebAddress + transcriberLastVersion + url);
			ongoingTests--;
			ongoingDownloads--;
		 } else {
			var pathfn = path.dirname(fn);
			if (version.debug(__filename)) console.log('path: ' + pathfn);
			if (!fs.existsSync(pathfn)) {
				if (version.debug(__filename)) console.log('mkdirs');
				fse.mkdirsSync(pathfn);
			}
			file = fs.createWriteStream(fn);
			response.pipe(file);
			file.on('finish', function() {
				ongoingTests--;
				ongoingDownloads--;
				file.close(cb);
				// close() is async, call cb after close completes.
			});
		}
	    // Add timeout to stop waiting indefinitely
	    request.setTimeout(12000, function () {
	        request.abort();
	    });
	}).on('error', function(err) {// Handle errors
		try {
			fs.unlinkSync(fn);
		} catch (e) {
			; // nothing
		}
		// Delete the file async. (But we don't check the result)
		if (cb)
			cb("error at " + url + " (" + err.message + ")");
	});
};

var endDownloadFile = function(mess) {
	if (mess) {
		console.log("Cancel: " + mess);
		endProcessedError(mess);
	}
	else {
		// console.log("end of download");
	}
};

var processListAndDownload = function(data, callback) {
	cbGlobal = callback;
	ongoingTests = data.listfiles.length; // allows to check that all file tests are done
	if (version.debug(__filename)) console.log('first check downloads: ' + ongoingTests + ' ' + ongoingDownloads);
	if (version.debug(__filename)) console.log('nb lines lis of files: ' + data.listfiles.length);

	for (var i in data.listfiles) {
		if (version.debug(__filename)) console.log('line: '+data.listfiles[i].name);
		if (version.debug(__filename)) console.log('testing ' + data.listfiles[i].name);
		isNewerFile(data.listfiles[i], function(newer, filename) {
			if (newer) {
				if (data.listfiles[i].name.indexOf('node') === 0)
					changesInNode = true; // dirname starts with node or node_modules
				// this file has changed: download it.
				ongoingDownloads++; // one more file to download
				console.log('downloading '+filename);
				totalDownloads++;
				downloadTemporary(filename, endDownloadFile); // when finished ongoingDownloads will descrease
			} else {
//				console.log('not downloading '+filename);
				ongoingTests--;
			}
		});
	}
	// all downloads have started: wait for the end
	intervalDownloads = setInterval(checkEndOfDownload, 1000);
};

var endItemAsync = function() { console.log('done for '+item); };

var checkEndOfDownload = function(arraycb) {
	if (version.debug(__filename)) console.log('check downloads: ' + ongoingTests + ' ' + ongoingDownloads);
	if (ongoingTests>0) return;
	if (ongoingDownloads>0) return;
	clearInterval(intervalDownloads);
	cbGlobal(0, "new version available - total downloads: " + totalDownloads);
};

/*
var checkEndOfDownloadAsync = function(err) {
	if (version.debug(__filename)) console.log('check downloads: ' + ongoingTests + ' ' + ongoingDownloads);
	// console.log('remaining files: tests: ' + ongoingTests + ' downloads: ' + ongoingDownloads);
	cbGlobal(0, "new version available - total downloads: " + totalDownloads);
};
*/

var endDownloadError = function(mess) {
	clearInterval(intervalDownloads);
	cbGlobal(1, "error in the downloads: " + mess + ' but total downloads: ' + totalDownload);
	process.exit(1);
};

update.checkAndDownloadVersion = function(versionnumber, callback) {
	ongoingTests++;
	ongoingDownloads++;
	downloadTemporary(transcriberVersionInfo, function(m) {
		if (m) {
			// an error has occurred
			callback(1, "error on version file");
		} else {
			// read the version file and check version number
			fse.readJson(transcriberTemporary + transcriberVersionInfo, 'utf8', function(err, data) {
				if (err) {
					callback(1, 'error on file version: ' + err);
				}
				if (version.debug(__filename)) console.log('check downloads: ' + ongoingTests + ' ' + ongoingDownloads);
				if (version.debug(__filename)) console.log(data, versionnumber);
				if (data.version > versionnumber) {
					// if (version.debug(__filename))
					console.log('new version ' + data.version + ' vs. ' +  versionnumber +  ' process files');
					newVersionNumber = data.version;
					processListAndDownload(data, callback);
				} else
					callback(0, "no new version available");
			}); 
		}
	});
};

var testAndCopyFiles = function(files) {
	if (fs.existsSync(transcriberTemporary + files)) {
		console.log('copy ' + transcriberTemporary+files + ' to ' + transcriberCurrentVersion+files);
		fse.copySync(transcriberTemporary+files, transcriberCurrentVersion+files);
	}
};

update.copyNewFilesToExecPosition = function(callback) {
	testAndCopyFiles('transcriberjs.html');
	testAndCopyFiles('transcriberjskwiclex.html');
	testAndCopyFiles('favicon.ico');
	testAndCopyFiles('needupdatebrowser.html');
	testAndCopyFiles('trjs.ico');
	testAndCopyFiles( 'doc');
	testAndCopyFiles( 'editor');
	testAndCopyFiles( 'js');
	testAndCopyFiles( 'node');
	testAndCopyFiles( 'style');
	testAndCopyFiles( 'tools');
	testAndCopyFiles( 'node_modules/async');
	testAndCopyFiles( 'node_modules/forever');
	testAndCopyFiles( 'node_modules/minimist');
	testAndCopyFiles( 'node_modules/mime');
	testAndCopyFiles( 'node_modules/pegjs');
	testAndCopyFiles( 'node_modules/require');
	testAndCopyFiles( 'node_modules/socket.io');
	testAndCopyFiles( 'node_modules/xml2js');
	testAndCopyFiles( 'node_modules/xmldom');
	testAndCopyFiles( 'node_modules/xpath');
	testAndCopyFiles( 'node_modules/trash');
	testAndCopyFiles( 'node_modules/fs-extra');
	callback(0, 'ok');
};

/*
 * clean unecessary files
 * this should be done when we start again
 */
update.clean = function(callback) {
	/*
	 * first list all present files and check them against the list of new files
	 * suppress the files unaccounted for 
	 */
	// read the version file and check version number
	fse.readJson(transcriberTemporary + transcriberVersionInfo, 'utf8', function(err, updateinfo) {
		if (err) {
			callback(1, 'error no file description: ' + err);
			return;
		}
		var oldinfo = update.listFiles(true);
		for (var k in oldinfo.listfiles) {
			var found = false;
			for (var n in updateinfo.listfiles) {
//				console.log('!= ' + oldinfo.listfiles[k].name + ' ' + updateinfo.listfiles[n].name);
				if (oldinfo.listfiles[k].name === updateinfo.listfiles[n].name) {
					found = true;
					break;
				}
			}
			if (found === false) {
				console.log('delete ' + transcriberCurrentVersion+oldinfo.listfiles[k].name);
				try {
					fs.unlinkSync(transcriberCurrentVersion+oldinfo.listfiles[k].name);
				} catch(e) {
					; // nothing ignore
				}
			}
		}
		/*
		 * second clean the temporary files
		 */
		try {
			fse.removeSync(transcriberTemporary);
		} catch(e) {
			; // nothing ignore
		}
		callback(0, 'all files cleaned');
	});
};

/*
 * check, download and copy files for update
 * if update is done further file cleaning is necessary
 */
update.check = function(versionnumber, postcallback) {
	/*
	 * find and download files to be modified
	 */
	update.checkAndDownloadVersion(versionnumber, function(err, m) {
		if (err>0) {
			console.log('error on update: ' + m);
			postcallback(1, 'error');
			return;
		}
		if (m.indexOf('no') === 0) {
			// nothing to do
			postcallback(0, 'nothing to do');
			return;
		}
		/*
		 * copy the files to the actual position
		 */
		update.copyNewFilesToExecPosition(function(err, m) {
			if (err>0)
				postcallback(1, 'error');
			/*
			 * restart the system
			 */
			else {
				// utiliser forever devrait faire le boulot pour le redémarrage de node
				// il est difficile de redemarrer avec d'autres parametres que le premier lancement
				// donc redemarrer node de suite pose des problèmes -- utiliser forever seulement pour les crashes est plus justifié
				if (changesInNode === true)
					postcallback(0, 'restartnode:'+newVersionNumber); // indicates that the main soft should be restarted manually
				else
					postcallback(0, 'restart:'+newVersionNumber); // only the current page will be restarted
			}
		});
	});
};

function getFiles(dir, files_) {
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_=[];
    var files = fs.readdirSync(dir);
    for(var i in files) {
    	if (files[i].indexOf('.') === 0) continue; // ignore files starting with .
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        var stat = fs.statSync(name);
        if (stat.isDirectory()){
            getFiles(name,files_);
        } else {
            files_.push({name:name,date:stat.mtime.toString()});
        }
    }
    return files_;
}

function getFile(fn, files_) {
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_=[];
   	if (fn.indexOf('.') === 0) return files_; // ignore files starting with .
    var stat = fs.statSync(fn);
    files_.push({name:fn,date:stat.mtime.toString()});
    return files_;
}

update.listFiles = function(modules) {
	var allFiles = [];
	allFiles = getFile('transcriberjs.html', allFiles);
	allFiles = getFile('transcriberjskwiclex.html', allFiles);
	allFiles = getFile('favicon.ico', allFiles);
	allFiles = getFile('needupdatebrowser.html', allFiles);
	allFiles = getFile('trjs.ico', allFiles);
	allFiles = getFiles( 'doc', allFiles);
	allFiles = getFiles( 'editor', allFiles);
	allFiles = getFiles( 'js', allFiles);
	allFiles = getFiles( 'node', allFiles);
	allFiles = getFiles( 'style', allFiles);
	allFiles = getFiles( 'tools', allFiles);
	if (modules===true) {
		allFiles = getFiles( 'node_modules/async', allFiles);
		allFiles = getFiles( 'node_modules/forever', allFiles);
		allFiles = getFiles( 'node_modules/minimist', allFiles);
		allFiles = getFiles( 'node_modules/mime', allFiles);
		allFiles = getFiles( 'node_modules/pegjs', allFiles);
		allFiles = getFiles( 'node_modules/require', allFiles);
		allFiles = getFiles( 'node_modules/socket.io', allFiles);
		allFiles = getFiles( 'node_modules/xml2js', allFiles);
		allFiles = getFiles( 'node_modules/xmldom', allFiles);
		allFiles = getFiles( 'node_modules/xpath', allFiles);
		allFiles = getFiles( 'node_modules/trash', allFiles);
		allFiles = getFiles( 'node_modules/fs-extra', allFiles);
	}
	return {
		version: version.version,
		listfiles: allFiles,	
	};
};
