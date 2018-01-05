/* maintenance module for flea */
function ChatModule() {
    this.init = function (logger) {
        pluginLogger = logger.getLogger(exports.commandName);
    };
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */

    this.messageReceived = function (message, dest, source)
    {
        var words = message.substr(message.indexOf(" ") + 1);

        pluginLogger.error("[" + dest + "] " + "Shutting down for maintenance: " + words);
        this.sendMessage(dest, "Shutting down for maintenance: " + words);
        process.exit( );
    };
}

exports.commandName = 'maintenance';
exports.module = new ChatModule();
exports.helpText = 'message - Shuts down flea for maintenance';
