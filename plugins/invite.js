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
        this.sendMessage(dest, "Thanks for the invite to channel: " + channel);
        pluginLogger.debug("[" + dest + "] Thanks for the invite to channel: " + channel);
        this.sendRaw("JOIN", channel);
    };
}

exports.commandName = 'invite';
exports.module = new ChatModule();
exports.helpText = '#channel - Invite the bot to join a channel ';



