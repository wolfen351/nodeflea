/* invite to channel module for flea */

function ChatModule () {
	
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
	/*this.sendMessage = function(dest, message)
	{
		console.log(dest, " <- ", message);
	}*/


	this.messageReceived = function(message, dest, source)
	{
	    var words = message.split(' ');
	    var channel = words[1];
		this.sendMessage(dest, "Bye bye! (Leaving " + dest + ")");
		this.sendRaw("PART", dest);
	}

}

exports.commandName = 'leave';
exports.module = new ChatModule();
exports.helpText = '- Make the bot leave the current chanel ';



