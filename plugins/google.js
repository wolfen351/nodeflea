/* google module for flea */


function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */

    this.messageReceived = function (message, dest, source)
    {
        var words = message.substr(message.indexOf(" ") + 1);

        this.sendMessage(dest, "http://www.google.com/search?q=" + escape(words) + "+&btnI");
        pluginLogger.info("[" + dest + "] " + "http://www.google.com/search?q=" + escape(words) + "+&btnI");
    };
}

exports.commandName = 'google';
exports.module = new ChatModule();
exports.helpText = 'search - return google i\'m feeling lucky url ';
