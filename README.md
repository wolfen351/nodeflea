# nodeflea

## Overview
This node application is an implementation of the "irc-flea" code that was written in .NET. This conversion is still in progress, but the bot is operational and usable for simple tasks.

## Requirements
* On 'nix servers' this application needs to run as 'root' as some of the base function like 'ping' require access to sockets

## Getting started

* Set up the config - this involves creating a config.json file 

    cp config.json.sample config.json

* npm install --save
* sudo node flea.js



## Troubleshooting
So far the only issue you'll have is that this application requires root access
