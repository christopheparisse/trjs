
/**
 * main procedure
 */

var chatter = require('./chatter.js');
global.applicationTarget = {};
global.applicationTarget.type = 'nodejs';

function main() {
    var argv = require('minimist')(process.argv.slice(2));

    console.log(argv);
    var txt = (typeof argv._ === 'string') ? [argv._] : argv._;
    chatter.chatter0(txt, "eng", function(err, messg) {
        if (err) {
            console.log('ERROR');
            console.log("[[", messg);
        } else {
            console.log('OK');
            console.log("{{", messg);
        }
    });

    chatter.chatter(txt, "eng", function(err, messg) {
        if (err) {
            console.log('NotGood:', messg);
        } else {
            console.log('Perfect:', messg);
        }
    });
}

main();
