/* google module for flea */


function ChatModule () {
	
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
	/*this.sendMessage = function(dest, message)
	{
		console.log(dest, " <- ", message);
	}*/
	

	this.messageReceived = function(message, dest, source)
	{
		var words = message.substr(message.indexOf(" ") + 1);	
		
		this.sendMessage(dest, "http://www.google.com/search?q="+escape(words)+"+&btnI");
	}

}

exports.commandName = 'google';
exports.module = new ChatModule();
exports.helpText = 'search - return google i\'m feeling lucky url ';



