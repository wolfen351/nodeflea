/* Ping module for flea */

const dns = require('dns');
var ping = require ("net-ping");

function ChatModule () {
	
    /* THIS METHOD WILL BE PROVIDED BY THE HOST - CALL IT TO SEND MESSAGES */
	/* this.sendMessage = function(dest, message)                          */
	
	var self = this;
	
	function doneCb (error, target) {
    if (error)
        self.sendMessage("#botville", target + ": " + error.toString ());
    else
        self.sendMessage("#botville", target + ": Done");
	}

	this.traceTheAddress = function(hostname, ipToPing, dest)
	{
		var self = this;

   	    self.sendMessage(dest, "Tracing to " + ipToPing + " (" + hostname + ")");

		var session = ping.createSession ({packetSize: 64, retries: 1});
        var hop = 0;
        
		session.traceRoute (ipToPing, 30, function (error, target, ttl, sent, rcvd) {
			var ms = rcvd - sent;
			hop++;
						
			if (error) {
				
				dns.reverse(error.source, function(err, hostnames) {
					if (hostnames)
						if (error instanceof ping.TimeExceededError) {
							self.sendMessage(dest, "Hop " + hop + ":  " + ms + "ms  " + error.source + " (" + hostnames[0] + ")"); // NORMAL CASE
						} else {
							self.sendMessage(dest, "Hop " + hop + ":  " + ms + "ms  " + error.message + " from " + error.source); // ANOTHER ERROR
						}
					else 
						if (error instanceof ping.TimeExceededError) {
							self.sendMessage(dest, "Hop " + hop + ":  " + ms + "ms  " + error.source); // NORMAL CASE
						} else {
							self.sendMessage(dest, "Hop " + hop + ":  " + ms + "ms  " + error.message + " from " + error.source); // ANOTHER ERROR
						}
				} );

				
			} else {
					self.sendMessage(dest, "Hop " + hop + ":  " + ms + "ms  " + target + " (" + hostname + ")"); // FINAL HOP
			}
		}, doneCb);
	}

	this.messageReceived = function(message, dest, source)
	{
	  var words = message.split(' ');
	  var thingToPing = words[1];

	  var expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
      var me = this;

	  if (expression.test(thingToPing)) {
		console.log("IP address detected");
		var ipToPing = words[1];
		dns.reverse(ipToPing, function(err, hostnames) {
			    if (hostnames)
				  me.traceTheAddress(hostnames[0], ipToPing, dest);
				else 
				  me.traceTheAddress(ipToPing, ipToPing, dest);
			} );
	  }
	  else {
		this.resolveDnsAndPing(thingToPing, dest);
	  }
	}


	this.resolveDnsAndPing = function(hostName, dest)
	{
	  var ip;
	  dns.resolve4(hostName, (err, addresses) => {
		 if (err) 
		   { 
			  this.sendMessage(dest, err);
			  return;
		   }
		 console.log(`addresses: ${JSON.stringify(addresses)}`);
		 var ipToPing = addresses[0];
		 this.traceTheAddress(hostName, ipToPing, dest);
	  });
	}
}

exports.commandName = 'trace';
exports.helpText = 'dns/ip - Returns TraceRoute ';
exports.module = new ChatModule();




