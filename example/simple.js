var detector = require('../');
var http = require('http');
var https = require('https');

var fs = require('fs');
var opts = {
    key : fs.readFileSync(__dirname + '/../keys/privatekey.pem'),
    cert : fs.readFileSync(__dirname + '/../keys/certificate.pem'),
};

var servers = {
    http : http.createServer(function (req, res) {
        res.setHeader('content-type', 'text/plain');
        res.end('I am an http server!');
    }),
    https : https.createServer(opts, function (req, res) {
        res.setHeader('content-type', 'text/plain');
        res.write('I AM TOTALLY SECURE AND STUFF YOU GUYS.');
        res.end(' SELF SIGNED IS TOTALLY SECURE, WHATEVER.');
    }),
};

servers.http.listen(4051);
servers.https.listen(4052);
detector({ http : 4051, https : 4052 }).listen(4050);
