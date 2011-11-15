https-detect
============

Detect whether a stream is https or http based on the first buffer on a stream
and forward accordingly.

example
=======

simple.js
---------

Listen on `:4050` routing http traffic to `:4051` and https traffic to `:4052`.

``` js
var httpsDetect = require('https-detect');
httpsDetect({ http : 4051, https : 4052 }).listen(4050);
```

route.js
--------

Fire up http and https servers and route traffic to them based on what the
incoming messages look like.

``` js
var httpsDetect = require('https-detect');
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
        res.end('I am an http server!\r\n');
    }),
    https : https.createServer(opts, function (req, res) {
        res.setHeader('content-type', 'text/plain');
        res.end('I AM TOTALLY SECURE AND STUFF YOU GUYS.'
            + ' SELF SIGNED IS TOTALLY SECURE, WHATEVER.\r\n');
    }),
};

servers.http.listen(4051);
servers.https.listen(4052);
httpsDetect({ http : 4051, https : 4052 }).listen(4050);
```

output:

```
$ curl http://localhost:4050
I am an http server!
$ curl -k https://localhost:4050
I AM TOTALLY SECURE AND STUFF YOU GUYS. SELF SIGNED IS TOTALLY SECURE, WHATEVER.
$ 
```

methods
=======

``` js
var httpsDetect = require('https-detect');
```

httpsDetect(opts)
-----------------

opts should have 2 keys:

* http - the http server `[port,host]`
* https - the https server `[port,host]`

`host` defaults to localhost for both keys.

If the option argument isn't an array it will be lifted to be `[port]`.

install
=======

With [npm](http://npmjs.org), do:

    npm install https-detect

license
=======

MIT/X11
