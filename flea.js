// INIT COMMAND STORAGE
var legalCommands = [];
var responseEngine = { };
var helpText = { };
var config = require('./config.json');

function registerPlugin(command, functionToRun, helpTextPart) {
   responseEngine['@' + command.toUpperCase()] = functionToRun;
   legalCommands.push('@' + command.toUpperCase());
   helpText['@' + command.toUpperCase()] = helpTextPart;
   console.log("Plugin for command " + command + " is ready!");
}

// INIT PLUGINS
var glob = require( 'glob' )
  , path = require( 'path' );

glob.sync( './plugins/**/*.js' ).forEach( function( file ) {
  console.log("Init plugin: " + file);
  var plugin = require( path.resolve( file ) );
  registerPlugin(plugin.commandName, plugin.responseFunction, plugin.helpText);
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
           if (to.indexOf("#")>-1)
              otherParty = to;

           /* Calc the response */
           var response = responseEngine[command](message, otherParty);
           console.log("Responding with " + response);

           /* Respond to PM with PM and channel message with channel message */
           client.say(otherParty, response);
        }
    });
});

client.addListener('error', function(message) {
    console.log('error: ', message);
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
