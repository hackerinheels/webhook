var express = require('express');
var app = express();
const url = require('url');
var querystring = require('querystring');

var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
getJSON = function(options, onResult)
{
    console.log("rest::getJSON");

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode + options.path);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = eval("(" + output + ")");
            onResult(res.statusCode, obj);
        });
        res.on('error', function() {
            console.log('error');
            var obj = eval("(" + output + ")");
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        res.send('error: ' + err.message);
    });

    req.end();
};


var server = app.listen(3000, function () {
    console.log('Started webhook service...');
})

app.get('/product', function (req, res) {
    var fullpath = '/v1/catalog?' + querystring.stringify({keyword:'shoes'});
    var options = {
        host: 'api-atg.kohls.com',
        port: 80,
        path: fullpath,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-APP-API_KEY':'8c718eee40e998f6ac1cbc0a7038e4cf',
            'Accept':'application/json'
        }
    };

   getJSON(options,
        function(statusCode, result)
        {
            console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
            res.statusCode = statusCode;
            res.send(result);
        });
});
