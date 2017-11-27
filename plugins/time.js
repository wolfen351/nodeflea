/* time module for flea */

var moment = require("moment")

function ChatModule () {
	
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
	/*this.sendMessage = function(dest, message)
	{
		console.log(dest, " <- ", message);
	}*/
	

	this.messageReceived = function(message, dest, source)
	{
		this.sendMessage(dest, "The current time is " + moment().format('MMMM Do YYYY, h:mm:ss a'));
	}

}

exports.commandName = 'time';
exports.module = new ChatModule();
exports.helpText = '- Return the current time';



