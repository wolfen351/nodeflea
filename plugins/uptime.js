/* uptime module for flea */

var moment = require("moment")

function ChatModule () {
	
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
	/*this.sendMessage = function(dest, message)
	{
		console.log(dest, " <- ", message);
	}*/
	
	function secondsToTime(inputSeconds) {
		return moment().subtract(inputSeconds, 'seconds').calendar();
	}

	this.messageReceived = function(message, dest, source)
	{
		this.sendMessage(dest, "I've been has been online since " + secondsToTime(process.uptime()));
	}

}

exports.commandName = 'uptime';
exports.module = new ChatModule();
exports.helpText = '- Says how long the bot is connected';



