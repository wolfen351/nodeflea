/* wget module for flea */


function ChatModule () {

    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
    /*this.sendMessage = function(dest, message)
    {
    	console.log(dest, " <- ", message);
    }*/

    var self = this;
    var http = require('http');
    var util = require('util');
    const URL = require('url');

    this.messageReceived = function(message, dest, source)
    {
        var words = message.split(' ');

        var urlToProcess = words[1];

        self.wgetUrl(dest, urlToProcess);
    }

    this.wgetUrl = function(dest, urlToProcess)
    {
        var urlToFetch = URL.parse( urlToProcess );
        var redirLocation;
        var options = {method: 'HEAD', host: urlToFetch.host, port: urlToFetch.port, path: urlToFetch.pathname};
        var req = http.request(options, function(res) {
            var extra = "";
            if (res.headers["content-length"])
                extra = " - " + res.headers["content-length"] + " bytes";
            if (res.headers["location"])
            {
                redirLocation = res.headers["location"];
                extra += " - Redirected to: " + res.headers["location"];
            }
            self.sendMessage(dest, "Status: " + res.statusCode + " - " + res.statusMessage + " " + extra);
            if (redirLocation)
              self.wgetUrl(dest, redirLocation);
        });
        req.end();
    }
}

exports.commandName = 'wget';
exports.module = new ChatModule();
exports.helpText = 'url - Download a html file';



