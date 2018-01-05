/* check port module for flea */


var checkservice = require('checkservice');



function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
    /*this.sendMessage = function(dest, message)
     {
     logger.info(dest, " <- ", message);
     }*/

    var self = this;

    this.messageReceived = function (message, dest, source)
    {
        var words = message.split(' ');
        var hostname = words[1];
        var portNumber = words[2];

        checkservice(hostname, portNumber, function (err, res) {
            if (err) {
                pluginLogger.error("[" + dest + "] " + 'Error! No service could be reached on ' + hostname + ' tcp port ' + portNumber + ' ERR: ' + err);
                self.sendMessage(dest, 'Error! No service could be reached on ' + hostname + ' tcp port ' + portNumber, err);
            } else if (res) {
                pluginLogger.info("[" + dest + "] " + 'Error! No service could be reached on ' + hostname + ' tcp port ' + portNumber);
                self.sendMessage(dest, 'Success! A service is listening on ' + hostname + ' tcp port ' + portNumber);
            }
        });
    };
}

exports.commandName = 'checkport';
exports.module = new ChatModule();
exports.helpText = 'ip port - Checks if a specified port is open (it\'s ip<space>port)';



