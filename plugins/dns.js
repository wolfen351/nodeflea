/* DNS module for flea */

const dns = require('dns');

function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
    /* this.sendMessage = function(dest, message)                          */

    this.messageReceived = function (message, dest, source)
    {
        var words = message.split(' ');
        var thingToPing = words[1];

        var expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
        var self = this;

        if (expression.test(thingToPing)) {
            mod_dns_logger.info("IP address detected");
            var ipToPing = words[1];
            dns.reverse(ipToPing, function (err, hostnames) {
                if (err)
                    pluginLogger.error("[" + dest + "] " + 'Error! No hostnames found ' + hostnames + ' ERR: ' + err);
                if (hostnames) {
                    pluginLogger.info("[" + dest + "] " + 'Hostnames on this ip: ' + hostnames.join(", "));
                    self.sendMessage(dest, "Hostnames on this ip: " + hostnames.join(", "));
                } else {
                    self.sendMessage(dest, "No hostnames found :'(");
                    pluginLogger.debug("[" + dest + "] " + 'No hostnames found : ' + hostnames.join(", "));
                }
            });
        } else {
            this.resolveDns(thingToPing, dest);
        }
    };

    this.resolveDns = function (hostName, dest)
    {
        var ip;
        dns.resolve4(hostName, (err, addresses) => {
            if (err)
            {
                this.sendMessage(dest, err);
                return;
            }
            this.sendMessage(dest, `Addresses on this hostname: ${addresses.join(", ")}`);
        });
    };
}

exports.commandName = 'dns';
exports.helpText = 'dns/ip - Get DNS info';
exports.module = new ChatModule();

