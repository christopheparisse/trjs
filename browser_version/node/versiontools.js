/**
 * main for versiontools.js as an external command.
 */

var update = require('./update.js');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
// console.log(allFiles);
fs.writeFileSync('update_info.json', JSON.stringify(update.listFiles(argv.nomodules===true?false:true)), 'utf8');
