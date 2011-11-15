var net = require('net');
var EventEmitter = require('events').EventEmitter;

module.exports = function (opts) {
    var server = net.createServer(function (stream) {
        detect(stream, handler);
    });
    
    function handler (proto, stream, buf) {
        var target = opts[proto];
        if (typeof target === 'object' && target.write) {
            target.write(buf);
            stream.pipe(target);
            target.pipe(stream);
        }
        else {
            if (!Array.isArray(target)) {
                target = [ target ];
            }
            
            stream.pause();
            var c = net.createConnection.apply(null, target);
            c.on('connect', function () {
                c.write(buf);
                c.pipe(stream);
                stream.pipe(c);
                stream.resume();
            });
        }
    }
    return server;
};

function detect (stream, cb) {
    stream.once('data', function (buf) {
        if (buf.slice(0,8).toString().match(/^([A-Za-z]+) /)) {
            cb('http', stream, buf);
        }
        else {
            cb('https', stream, buf);
        }
    });
}
