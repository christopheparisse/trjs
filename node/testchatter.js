
/**
 * main procedure
 */

var chatter = require('./chatter.js');
global.applicationTarget = {};
global.applicationTarget.type = 'nodejs';

function main() {
    var argv = require('minimist')(process.argv.slice(2));

    console.log(argv);
    chatter.chatter0(argv._, "eng", function(err, messg) {
        if (err) {
            console.log('ERROR');
            console.log("[[", messg);
        } else {
            console.log('OK');
            console.log("{{", messg);
        }
    });

    chatter.chatter(argv._, "eng", function(err, messg) {
        if (err) {
            console.log('NotGood:', messg);
        } else {
            console.log('Perfect:', messg);
        }
    });
}

main();
