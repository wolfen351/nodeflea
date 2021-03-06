/* Traceroute module for flea */

const dns = require('dns');
var ping = require("net-ping");

function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */

    var self = this;
    function doneCb(error, target) {
        if (error)
            self.sendMessage("#botville", target + ": " + error.toString());
        self.catchUpMessages();
    }

    self.lastHopReported = 0;
    self.messageQueue = [];
    self.queueMessage = function (hop, dest, message)
    {
        if (hop == self.lastHopReported + 1)
        {
            self.sendMessage(dest, message);
            self.lastHopReported = hop;
        } else
        {
            var cached = {hop: hop, message: message, dest: dest};
            self.messageQueue.push(cached);
        }

        this.catchUpMessages();
    };

    this.catchUpMessages = function () {

        var somethingSent = true;

        while (somethingSent)
        {
            somethingSent = false;
            self.messageQueue.forEach(function (toSend)
            {
                if (toSend.hop == self.lastHopReported + 1)
                {
                    self.sendMessage(toSend.dest, toSend.message);
                    self.lastHopReported = toSend.hop;
                    somethingSent = true;
                }
            });
        }
    };

    this.traceTheAddress = function (hostname, ipToPing, dest) {
        var self = this;

        self.sendMessage(dest, "Tracing to " + ipToPing + " (" + hostname + ")");
        self.lastHopReported = 0;
        self.messageQueue = [];
        var session = ping.createSession({packetSize: 64, retries: 1});
        var mainhop = 0;

        session.traceRoute(ipToPing, 30, function (error, target, ttl, sent, rcvd) {
            var ms = rcvd - sent;
            mainhop++;
            var hop = mainhop;
            if (error) {
                if (error.source)
                {
                    pluginLogger.info("Query rdns: " + error.source);
                    dns.reverse(error.source, function (err, hostnames) {
                        if (hostnames)
                            if (error instanceof ping.TimeExceededError) {
                                self.queueMessage(hop, dest, "Hop " + hop + ":  " + ms + "ms  " + error.source + " (" + hostnames[0] + ")"); // NORMAL CASE
                            } else {
                                self.queueMessage(hop, dest, "Hop " + hop + ":  " + ms + "ms  " + error.message + " from " + error.source); // ANOTHER ERROR
                            }
                        else if (error instanceof ping.TimeExceededError) {
                            self.queueMessage(hop, dest, "Hop " + hop + ":  " + ms + "ms  " + error.source); // NORMAL CASE
                        } else {
                            self.queueMessage(hop, dest, "Hop " + hop + ":  " + ms + "ms  " + error.message + " from " + error.source); // ANOTHER ERROR
                        }
                    }
                    );
                } else
                {
                    if (error instanceof ping.TimeExceededError) {
                        self.queueMessage(hop, dest, "Hop " + hop + ":  " + ms + "ms  " + error.source); // NORMAL CASE
                    } else {
                        self.queueMessage(hop, dest, "Hop " + hop + ":  " + ms + "ms  " + error.message + " from " + error.source); // ANOTHER ERROR
                    }
                }


            } else {
                self.queueMessage(hop, dest, "Hop " + hop + ":  " + ms + "ms  " + target + " (" + hostname + ")"); // FINAL HOP
            }
        }, doneCb);
    };

    this.messageReceived = function (message, dest, source)
    {
        var words = message.split(' ');
        var thingToPing = words[1];

        var expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;

        var me = this;

        if (expression.test(thingToPing)) {
            pluginLogger.info("IP address detected");
            var ipToPing = words[1];
            dns.reverse(ipToPing, function (err, hostnames) {
                if (hostnames)
                    me.traceTheAddress(hostnames[0], ipToPing, dest);
                else
                    me.traceTheAddress(ipToPing, ipToPing, dest);
            });
        } else {
            this.resolveDnsAndPing(thingToPing, dest);
        }
    };


    this.resolveDnsAndPing = function (hostName, dest)
    {
        var ip;
        dns.resolve4(hostName, (err, addresses) => {
            if (err)
            {
                this.sendMessage(dest, err);
                return;
            }
            logger.info(`addresses: ${JSON.stringify(addresses)}`);
            var ipToPing = addresses[0];
            this.traceTheAddress(hostName, ipToPing, dest);
        });
    };
}

exports.commandName = 'trace';
exports.helpText = 'dns/ip - Returns TraceRoute ';
exports.module = new ChatModule();

