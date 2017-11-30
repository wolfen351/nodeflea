/* maintenance module for flea */


function ChatModule () {
	
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
	/*this.sendMessage = function(dest, message)
	{
		console.log(dest, " <- ", message);
	}*/
	

	this.messageReceived = function(message, dest, source)
	{
		var words = message.substr(message.indexOf(" ") + 1);	
		
		this.sendMessage(dest, "Shutting down for maintenance: " + words);
		process.exit( );
	}

}

exports.commandName = 'maintenance';
exports.module = new ChatModule();
exports.helpText = 'message - Shuts down flea for maintenance';



