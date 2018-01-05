/* ipcalc module for flea */

var IpSubnetCalculator = require('ip-subnet-calculator')

function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */

    var self = this;

    this.messageReceived = function (message, dest, source)
    {
        var words = message.split(' ');
        var network = words[1]; // example 192.168.1.4/24

        words = network.split("/");
        var addresspart = words[0];
        var maskpart = words[1];

        var calc1 = IpSubnetCalculator.calculateSubnetMask(addresspart, maskpart);
        var calc2 = IpSubnetCalculator.calculateSubnetMask(calc1.ipLow + 1, 32);
        var calc3 = IpSubnetCalculator.calculateSubnetMask(calc1.ipHigh - 1, 32);

        if (maskpart == "32") {
            pluginLogger.debug("[" + dest + "] Network: (none) Hostmin: " + calc1.ipLowStr + " HostMax: " + calc1.ipLowStr + " Broadcast: (none) Addresses: 1 (single ip)");
            self.sendMessage(dest, "Network: (none) Hostmin: " + calc1.ipLowStr + " HostMax: " + calc1.ipLowStr + " Broadcast: (none) Addresses: 1 (single ip)");
        } else if (maskpart == "31") {
            pluginLogger.debug("[" + dest + "] Network: " + calc1.ipLowStr + "(use lower) Hostmin: " + calc1.ipLowStr + " HostMax: " + calc1.ipHighStr + " Broadcast: " + calc1.ipHighStr + "(use upper) Addresses: 2");
            self.sendMessage(dest, "Network: " + calc1.ipLowStr + "(use lower) Hostmin: " + calc1.ipLowStr + " HostMax: " + calc1.ipHighStr + " Broadcast: " + calc1.ipHighStr + "(use upper) Addresses: 2");
        } else {
            pluginLogger.debug("[" + dest + "] Network: " + calc1.ipLowStr + " Hostmin: " + calc2.ipLowStr + " HostMax: " + calc3.ipLowStr + " Broadcast: " + calc1.ipHighStr + " Usable Addresses: " + (calc1.invertedMask - 1));
            self.sendMessage(dest, "Network: " + calc1.ipLowStr + " Hostmin: " + calc2.ipLowStr + " HostMax: " + calc3.ipLowStr + " Broadcast: " + calc1.ipHighStr + " Usable Addresses: " + (calc1.invertedMask - 1));
        }

    };

}

exports.commandName = 'ipcalc';
exports.module = new ChatModule();
exports.helpText = 'ip/mask - Shows the Network, Broadcast, Min and Max ips for the range ';
