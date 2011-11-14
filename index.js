var net = require('net');
var EventEmitter = require('events').EventEmitter;

var exports = module.exports = function (opts) {
    var server = net.createServer(detect, function (proto, stream, buf) {
        var target = opts[proto];
        if (typeof target === 'object' && target.write) {
            target.write(buf);
            stream.pipe(target);
            target.pipe(stream);
        }
        else {
            stream.pause();
            var c = net.createConnection.apply(null, target);
            c.on('connect', function () {
                c.write(buf);
                c.pipe(stream);
                stream.pipe(c);
                stream.resume();
            });
        }
    });
    return server;
};

var detect = exports.detect = function (stream, cb) {
    stream.once('data', function (buf) {
        if (buf.slice(0,8).toString().match(/^([A-Za-z]+) /)) {
            cb('http', stream, buf);
        }
        else {
            cb('https', stream, buf);
        }
    });
};
