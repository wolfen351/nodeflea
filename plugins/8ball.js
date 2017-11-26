/* 8ball module for flea */

var words = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it",
             "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes",
             "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again",
             "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];

function calcResponse(message)
{
  var i = Math.floor((Math.random() * 20));
  return "The magic 8ball says: " + words[i];
}

exports.commandName = '8ball';
exports.responseFunction = calcResponse;
exports.helpText = 'This command returns the response of shaking the magic 8ball';




