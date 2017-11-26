/* 8ball module for flea */

function calcResponse(message, dest, source)
{
  return "PING " + message + " for " + dest;
}

exports.commandName = 'ping;;
exports.responseFunction = calcResponse;
exports.helpText = 'dns/ip [count] - Ping the IP or DNS entry, count is optional (up to 4)';




