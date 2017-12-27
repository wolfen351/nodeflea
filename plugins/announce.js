/* Announce module for flea */

function ChatModule () {
	
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
	/*this.sendMessage = function(dest, message)
	{
		console.log(dest, " <- ", message);
	}*/

	var messageToAnnounce = "";


	this.messageReceived = function(message, dest, source)
	{
		console.log("Setting announcement for new users to: " + message);
		if (message.replace("@announce", "").length > 1)
		{
		  messageToAnnounce = "Announcement from " + source + " : " + message.replace("@announce","");
		  this.sendMessage(dest, "Announcement set");
		}
		else
		{
	      messageToAnnounce = "";
		  this.sendMessage(dest, "Announcement cleared");
	    }
	}
	
	this.userJoined = function(user, channel, message)
	{
		console.log("Detected new user ("+user+") in channel: "+channel);
		if (messageToAnnounce != "")
		{
			this.sendMessage(channel, messageToAnnounce);
		}
	}

}

exports.commandName = 'announce';
exports.module = new ChatModule();
exports.helpText = 'msg - Tell all joining users msg on join';



