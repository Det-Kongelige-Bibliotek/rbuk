#!/usr/bin/env node

var argv = require('optimist').argv,
    express = require('express'),
    app = express(),
    app2 = express();

app.use(express.static(__dirname + '/http-pub'));
app.listen(8001);

console.log('Webservers now listening to port 8001');

function logMsg(msg) {
    if ((argv.verbose) && (msg.indexOf('favicon.ico') < 0)) { // favicons requests just clutter up the log for no reason!
        console.log(new Date().getTime() + ': ' + msg);
    }
}

