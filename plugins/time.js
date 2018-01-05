/* time module for flea */

var moment = require("moment");

function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
    /*this.sendMessage = function(dest, message)
     {
     logger.info(dest, " <- ", message);
     }*/

    /* We're using "YYYY/MM/DD HH:mm:ss.SSS" because ISO8601*/
    var dtformat = "YYYY/MM/DD HH:mm:ss.SSS";
    this.messageReceived = function (message, dest, source)
    {
        this.sendMessage(dest, "The current time is " + moment().format(dtformat));
        pluginLogger.info("[" + dest + "] " + "The current time is " + moment().format(dtformat));
    };

}

exports.commandName = 'time';
exports.module = new ChatModule();
exports.helpText = '- Return the current time';

