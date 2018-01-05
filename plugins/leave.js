/* invite to channel module for flea */

function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
    this.messageReceived = function (message, dest, source)
    {
        var words = message.split(' ');
        var channel = words[1];
        this.sendMessage(dest, "Bye bye! (Leaving " + dest + ")");
        pluginLogger.debug("[" + dest + "] Bye bye! (Leaving " + dest + ")");
        this.sendRaw("PART", dest);
    };
}

exports.commandName = 'leave';
exports.module = new ChatModule();
exports.helpText = '- Make the bot leave the current chanel ';
