// INIT COMMAND STORAGE
var legalCommands = [];
var responseEngine = { };
var helpText = { };
var config = require('./config.json');

function registerPlugin(command, chatmodule, helpTextPart) {
	try {
	   console.log("Plugin internals: ", chatmodule);
	   responseEngine['@' + command.toUpperCase()] = chatmodule;
	   legalCommands.push('@' + command.toUpperCase());
	   helpText['@' + command.toUpperCase()] = helpTextPart;
	   chatmodule.sendMessage = sendMessage;
	   console.log("Plugin for command " + command + " is ready!");
	}
	catch (e) {
		console.log("Error setting up module", e);
	}
}

function sendMessage(destination, response) {
   console.log(destination, " => ", response);
   client.say(destination, response);
}

// INIT PLUGINS
var glob = require( 'glob' )
  , path = require( 'path' );

glob.sync( './plugins/**/*.js' ).forEach( function( file ) {
  console.log("Init plugin: " + file);
  var plugin = require( path.resolve( file ) );
  registerPlugin(plugin.commandName, plugin.module, plugin.helpText);
});
console.log("Plugins all loaded");

// INIT IRC
var irc = require('irc');
var client = new irc.Client(config.server, config.botName, {
	userName: config.username,
	realName: config.realname,
	channels: config.channels
});

client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);

    /* Check each command to see if it matches the message */
    legalCommands.forEach(function(command)
    {
        /* Detect command */
        if (message.toUpperCase().indexOf(command.toUpperCase())>-1)  {
           console.log("Command Detected:" + command);

           /* Calc the other party */
           var otherParty = from;
           var requestor = to;
           if (to.indexOf("#")>-1)
           {
              otherParty = to;
              requestor = from;
           }

           /* Notify the module of the new message */
           try {
			   console.log(responseEngine[command]);
			var response = responseEngine[command].messageReceived(message, otherParty, requestor);
           
		   }
           catch (e) {
			   console.log("Error notifying plugin of new message", e);
		   }
         }
    });
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});

client.addListener('raw', function(message) {
	console.log("RAW: ", message.rawCommand, message.command, message.args.join(" "));
});

/* Set up the special HELP command */
function helpResponse(message) {
  var response = "Commands Available:\n\n";
  legalCommands.forEach(function(command) {
    response += command + " " + helpText[command] + "\n";
  });
  return response;
}

registerPlugin("HELP", helpResponse, "This command returns the help text");


console.log("Ready!");
