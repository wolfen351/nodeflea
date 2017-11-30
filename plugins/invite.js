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
		this.sendMessage(dest, "Thanks for the invite to channel: " + channel);
		this.sendRaw("JOIN", channel);
	}

}

exports.commandName = 'invite';
exports.module = new ChatModule();
exports.helpText = '#channel - Invite the bot to join a channel ';



