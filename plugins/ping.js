/* Ping module for flea */

const dns = require('dns');
var ping = require("net-ping");

function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
    /* this.sendMessage = function(dest, message)                          */

    this.pingTheAddress = function (hostname, ipToPing, dest)
    {
        var self = this;
        var headline = "PING " + hostname + " (" + ipToPing + ").";
        this.sendMessage(dest, headline);

        var session = ping.createSession({packetSize: 64, retries: 1});

        for (var pingIteration = 0; pingIteration < 4; pingIteration++)
        {
            session.pingHost(ipToPing, function (error, target, sent, rcvd) {
                var ms = rcvd - sent;
                if (error) {
                    self.sendMessage(dest, target + ": " + error.toString() + "(ms=" + ms + ")");
                    pluginLogger.error("[" + dest + "] " + target + ": " + error.toString() + "(ms=" + ms + ")");
                } else {
                    //	64 bytes from 8.8.8.8: icmp_seq=1 ttl=57 time=17.0 ms
                    self.sendMessage("#botville", "64 bytes from " + target + ": time=" + ms + " ms");
                    pluginLogger.info("[" + dest + "] " + "64 bytes from " + target + ": time=" + ms + " ms");
                }

            });
        }
    };

    this.messageReceived = function (message, dest, source)
    {
        var words = message.split(' ');
        var thingToPing = words[1];

        var expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
        var me = this;

        if (expression.test(thingToPing)) {
            mod_ping_logger.info("IP address detected");
            var ipToPing = words[1];
            dns.reverse(ipToPing, function (err, hostnames) {
                if (hostnames)
                    me.pingTheAddress(hostnames[0], ipToPing, dest);
                else
                    me.pingTheAddress(ipToPing, ipToPing, dest);
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
            mod_ping_logger.info(`addresses: ${JSON.stringify(addresses)}`);
            var ipToPing = addresses[0];
            this.pingTheAddress(hostName, ipToPing, dest);
        });
    };
}

exports.commandName = 'ping';
exports.helpText = 'dns/ip [count] - Ping the IP or DNS entry, count is optional (up to 4)';
exports.module = new ChatModule();
