var detector = require('../');
var http = require('http');
var https = require('https');
var spawn = require('child_process').spawn;

var fs = require('fs');
var opts = {
    key : fs.readFileSync(__dirname + '/../keys/privatekey.pem'),
    cert : fs.readFileSync(__dirname + '/../keys/certificate.pem'),
};

var servers = {
    http : http.createServer(function (req, res) {
        res.setHeader('content-type', 'text/plain');
        res.end('HTTP!');
    }),
    https : https.createServer(opts, function (req, res) {
        res.setHeader('content-type', 'text/plain');
        res.end('HTTPS!');
    }),
};

var test = require('tap').test;
test('switch', function (t) {
    var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);
    
    t.plan(2);
    
    servers.http.listen(port + 1, ready);
    servers.https.listen(port + 2, ready);
    var d = detector({ http : port + 1, https : port + 2 });
    d.listen(port, ready);
    
    var pending = { ready : 3, finish : 2 };
    
    function ready () {
        if (--pending.ready !== 0) return;
        
        http.get({ port : port }, function (res) {
            var data = '';
            res.on('data', function (buf) { data += buf });
            res.on('end', function () {
                t.equal(data, 'HTTP!');
                servers.http.close();
                finish();
            });
        });
        
        https.get({ port : port }, function (res) {
            var data = '';
            res.on('data', function (buf) { data += buf });
            res.on('end', function () {
                t.equal(data, 'HTTPS!');
                servers.https.close();
                finish();
            });
        });
    }
    
    function finish () {
        if (--pending.finish === 0) {
            d.close();
            t.end();
        }
    }
});
