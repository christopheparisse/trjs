/**
 * chatter.js
 * Interface with CHATTER program from Franklin Chen, CHILDES
 * @author Christophe Parisse
 */

var cp = require('child_process');
var fs = require('fs');
var version = require('../editor/version.js');

exports.chatter0 = function(utt, lang, callback) {
    var text = '';
    text += '@UTF8\n';
    text += '@Begin\n';
    text += '@Languages:\t' + lang + '\n';
    text += '@Participants:	SP01 Participant\n';
    text += '@ID:\t' + lang + '|change_corpus_later|SP01|||||Participant|||\n';
    text += '*SP01:\t' + utt + '\n';
    text += '@End\n';
    fs.writeFileSync('tempchatfile.cha', text);

    var output = '', error = '';
    var analyzer = cp.spawn(version.javaLoc(), ['-cp', version.ffmpegdirLoc() + '/chatter.jar',
        'org.talkbank.chatter.App', 'tempchatfile.cha']);

    analyzer.stdout.on('data', function(data) {
        if (data) output += data;
        // console.log("out", data.toString());
    });

    analyzer.stderr.on('data', function(data) {
        if (data) error += data;
        // console.log("err", data.toString());
    });

    analyzer.on('close', function(code) {
        if (code === 0) {
            callback(0, output);
            return;
        } else {
            callback(1, error);
            return;
        }
    });
}

exports.chatter = function(utt, lang, callback) {
    exports.chatter0(utt, lang, function (err, messg) {
        if (err) {
            var errors = [], m;
            // filter messgs for line and column
            var re = /line (\w+), column (\w+): (.*?)$/gm;
            do {
                m = re.exec(messg);
                if (m && m[3].indexOf('internal error') < 0) {
                    // console.log(m[1], m[2]-7);
                    errors.push([m[1], m[2]-7, m[3]]);
                }
            } while (m);
            callback(1, errors);
        } else {
            // <u who="SP01" uID="u0">
            var xml = '';
            // filter <u ..>.*</u>
            var re = /<u who=\"SP01\" uID=\"u0\">([\s\S]*)<\/u>/m;
            var m = re.exec(messg);
            // console.log(m);
            if (m) {
                // console.log(m[1]);
                xml = m[1];
            }
            callback(0, xml);
        }
    });
}
