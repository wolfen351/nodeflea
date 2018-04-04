/* LOS Analysis module for flea */
var pluginLogger;
var pluginDAO;
var pluginConfig;
var wugutils = require('../lib/wugutils.js');
var urlFormat = "http://flea.wolfen.za.net/FleaAnalyse.aspx?Name1=**n1**&Name2=**n2**&Id1=**id1**&Id2=**id2**&Lat1=**lat1**&Lat2=**lat2**&Lon1=**lon1**&Lon2=**lon2**";

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

		url = url.replace("**n1**", sourceN.name);
		url = url.replace("**n2**", destN.name);

		url = url.replace("**lat1**", sourceN.lat);
		url = url.replace("**lat2**", destN.lat);

		url = url.replace("**lon1**", sourceN.lon);
		url = url.replace("**lon2**", destN.lon);
		
        this.sendMessage(dest, "Analysis of LOS from ["+ sourceN.name +"] to ["+destN.name+"]:");
		this.sendMessage(dest, url);
    };
}

exports.commandName = 'ana';
exports.module = new ChatModule();
exports.helpText = 'This command returns a url for analysis of LOS between 2 named locations';
