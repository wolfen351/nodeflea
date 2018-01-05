/* wget module for flea */

function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */

    var self = this;
    var http = require('http');
    var util = require('util');
    const URL = require('url');
    var request = require('request');

    this.messageReceived = function (message, dest, source)
    {
        var words = message.split(' ');

        var urlToProcess = words[1];

        self.wgetUrl(dest, urlToProcess, 0);
    };

    this.wgetUrl = function (dest, urlToProcess, level)
    {
        // prevent infinite recursion
        level++;
        if (level >= 5)
            return;

        var url = URL.parse(urlToProcess);
        var urlString = URL.format(url);
        if (!url.protocol)
            urlString = "http://" + URL.format(url);

        pluginLogger.info("Will get url header: " + urlString);
        request(urlString, {method: 'HEAD', followRedirect: false}, function (err, res, body) {
            var redirLocation;
            var extra = "";

            if (err)
            {
                self.sendMessage(dest, err);
                pluginLogger.error("[" + dest + "] " + err);
                return;
            }

            if (res.headers["content-length"])
                extra = " - " + res.headers["content-length"] + " bytes";
            if (res.headers["location"])
            {
                redirLocation = res.headers["location"];
                extra += " - Redirected to: " + res.headers["location"];
            }
            self.sendMessage(dest, "Status: " + res.statusCode + " - " + res.statusMessage + " " + extra);
            pluginLogger.info("[" + dest + "] " + "Status: " + res.statusCode + " - " + res.statusMessage + " " + extra);
            if (redirLocation)
                self.wgetUrl(dest, redirLocation, level);
        });
    };
}

exports.commandName = 'wget';
exports.module = new ChatModule();
exports.helpText = 'url - Download a html file';

