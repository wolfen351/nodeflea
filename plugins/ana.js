/* LOS Analysis module for flea */
var pluginLogger;
var pluginDAO;
var pluginConfig;
var wugutils = require('../lib/wugutils.js');

function ChatModule() {
    this.init = function (logger, config) {
        pluginLogger = logger.getLogger(exports.commandName);
		if (config)
		{
		  pluginConfig = config;

		  wugutils.init(logger);
		  wugutils.getKMZ(pluginConfig.kmzurl);
		  
		}
    };

    this.messageReceived = function (message, dest, source)
    {
        this.sendMessage(dest, "Analysis of LOS from [] to []. Please see url: ");
    };
}

exports.commandName = 'ana';
exports.module = new ChatModule();
exports.helpText = 'This command returns a url for analysis of LOS between 2 named locations';
