/* LOS Analysis module for flea */
var pluginLogger;
var pluginDAO;
var pluginConfig;
var wugutils = require('../lib/wugutils.js');
var urlFormat = "http://www.wug.za.net/newlos2.php?fl=**id1**&tl=**id2**";

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
        var words = message.split(' ');
		var sourceNode = words[1];
		var destNode = words[2];
		
		pluginLogger.debug("Searching for matching node for: "+sourceNode);
		pluginLogger.debug("Searching for matching node for: "+destNode);

		var sourceN = wugutils.getNodeByName(sourceNode);
		var destN = wugutils.getNodeByName(destNode);

		if (!sourceN)
		{
	        this.sendMessage(dest, "Unable to find: " + sourceNode);
			return;
		}
		if (!destN)
		{
	        this.sendMessage(dest, "Unable to find: " + destNode);
			return;
		}
		  
		pluginLogger.debug("sourceNode : "+JSON.stringify(sourceN));
		pluginLogger.debug("destNode : "+JSON.stringify(destN));
		 
		var url = urlFormat.replace("**id1**", sourceN.id);
		url = url.replace("**id2**", destN.id);
		
        this.sendMessage(dest, "Simple LOS from ["+ sourceN.name +"] to ["+destN.name+"]:");
		this.sendMessage(dest, url);
    };
}

exports.commandName = 'los';
exports.module = new ChatModule();
exports.helpText = 'This command returns a url for simple LOS between 2 named locations';
