(function() {
    'use strict';

    var express = require('express');
    var proxy = require('express-http-proxy');

    var http = require('http');

    var WebSocketServer = require('websocket').server;
    const app = express();
    const server = http.createServer(app);
    app.use('/', proxy('localhost:4200', {
         forwardPath: function(req, res) {
            return require('url').parse(req.url).path;
         }}));

    const wsServer = new WebSocketServer({
        httpServer: server,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false
    });

    function originIsAllowed(origin) {
        // TODO
        return true;
    }

    wsServer.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
            request.reject();
            console.log((new Date()) + ' Connection fron origin ' + request.origin + ' rejected.');
            return;
        }

        var connection = request.accept('sinedata', request.origin);

        observableSineWave(this, .1, 20);

        connection.on('message', function(message) {
            connection.sendUTF(message.utf8Data);
        });

        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnection. Reason: ' + reasonCode);
        });

    });

    server.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });

    function deg2rad(val) {
      return val * 0.0174533;
    }

    function observableSineWave(serverSocket, period) {
        let waveVal = 0;
        setInterval(function() {
            waveVal = waveVal == 360 ? 0 : waveVal + 0.1;
            serverSocket.broadcast(JSON.stringify({ value: Math.sin(deg2rad(waveVal)) }));
        }, period);
    }

}());
