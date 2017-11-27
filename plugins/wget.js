/* wget module for flea */

function ChatModule () {
	
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
	/*this.sendMessage = function(dest, message)
	{
		console.log(dest, " <- ", message);
	}*/
	

	this.messageReceived = function(message, dest, source)
	{
		//this.sendMessage(dest, "The current time is " + moment().format('Do MMMM YYYY, h:mm:ss A'));
	}

}

exports.commandName = 'wget';
exports.module = new ChatModule();
exports.helpText = 'url - Download a html file';



