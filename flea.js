const config = require('./config.json');
const log4js = require('log4js');
const sqlite3 = require('sqlite3');
const logger = log4js.getLogger();
// INIT COMMAND STORAGE
const legalCommands = [];
const responseEngine = {};
const helpText = {};

/**
 *
 */
function initLogger() {
    log4js.configure(config.logging);
}

/**
 *
 */
function initDB() {
    const db = new sqlite3.Database(':memory:');

    db.serialize(function() {
        db.run('CREATE TABLE lorem (info TEXT)');

        const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
        for (let i = 0; i < 10; i++) {
            stmt.run('Ipsum ' + i);
        }
        stmt.finalize();

        db.each('SELECT rowid AS id, info FROM lorem', function(err, row) {
            console.log(row.id + ': ' + row.info);
        });
    });

    db.close();
}

initLogger();
initDB();
logger.info('Starting...');

/**
 *
 * @param {*} command
 * @param {*} chatmodule
 * @param {*} helpTextPart
 */
function registerPlugin(command, chatmodule, helpTextPart) {
    try {
        //        logger.debug("Plugin internals: ", chatmodule);
        if (chatmodule.init) {
            chatmodule.init(log4js, config.plugin[command]);
        }
        responseEngine['@' + command.toUpperCase()] = chatmodule;
        legalCommands.push('@' + command.toUpperCase());
        helpText['@' + command.toUpperCase()] = helpTextPart;
        chatmodule.sendMessage = sendMessage;
        logger.info('Plugin for command ' + command + ' is ready!');
    } catch (e) {
        logger.error('Error setting up module', e);
    }
}

/**
 *
 * @param {*} destination
 * @param {*} response
 */
function sendMessage(destination, response) {
    logger.info(destination, ' => ', response);
    client.say(destination, response);
}

/**
 *
 * @param {*} rawmessage
 * @param {*} arg1
 */
function sendRaw(rawmessage, arg1) {
    logger.info('RAW MESSAGE: ', rawmessage, arg1);
    client.send(rawmessage, arg1);
}

// INIT PLUGINS

const glob = require('glob');
const path = require('path');
glob.sync('./plugins/**/*.js').forEach(function(file) {
    logger.info('Init plugin: ' + file);
    const plugin = require(path.resolve(file));
    registerPlugin(plugin.commandName, plugin.module, plugin.helpText);
});

logger.info('Plugins all loaded');
// INIT IRC
const irc = require('irc');
const client = new irc.Client(config.server, config.botname, {
    userName: config.username,
    realName: config.realname,
    channels: config.channels
});

client.addListener('message', function(from, to, message) {
    logger.info(from + ' => ' + to + ': ' + message);
    /* Check each command to see if it matches the message */
    legalCommands.forEach(function(command) {
        /* Detect command */
        if (message.toUpperCase().indexOf(command.toUpperCase()) > -1) {
            logger.debug('Command Detected:' + command + ' from user ' + from);
            /* Calc the other party */
            let otherParty = from;
            let requestor = to;
            if (to.indexOf('#') > -1) {
                otherParty = to;
                requestor = from;
            }

            /* Notify the module of the new message */
            try {
                const response = responseEngine[command].messageReceived(message, otherParty, requestor);
            } catch (e) {
                logger.error('Error notifying plugin of new message', e);
            }
        }
    });
});
client.addListener('error', function(message) {
    logger.info('error: ', message);
});
client.addListener('raw', function(message) {
    logger.debug('RAW: ', message.rawCommand, message.command, message.args.join(' '));
});
/* Set up the special HELP command */

/**
 *
 */
function HelpModule() {
    this.messageReceived = function(message, dest, source) {
        let response = 'Commands Available:\n\n';
        legalCommands.forEach(function(command) {
            response += command + ' ' + helpText[command] + '\n';
        });
        this.sendMessage(dest, response);
    };
}
registerPlugin('HELP', new HelpModule(), 'This command returns the help text');
logger.info('Ready!');