# nodeflea

## Overview
This node application is an implementation of the "irc-flea" code that was written in .NET. This conversion is still in progress, but the bot is operational and usable for simple tasks.

## Requirements
* On 'nix servers' this application needs to run as 'root' as some of the base function like 'ping' require access to sockets

## Getting started

To use this program you need NODE.js version 8 or above as well as root access to your linux pc.

### Part 1: Install Node

The following instructions are what I used to get nodejs on my new ubuntu 16.04 machine, look for instructions for your distro as appropriate.

Source: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04

    cd ~
    curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh   ;# Get the repo maker script
    nano nodesource_setup.sh                                               ;# EYEBALL to ensure no nasty code
    sudo bash nodesource_setup.sh                                          ;# Setup the repo
    sudo apt-get install nodejs                                            ;# Install nodejs 8
    nodejs -v                                                              ;# check the version


### Part 2: Setup and run

* Set up the config - this involves creating a config.json file 

    cp config.json.sample config.json

* npm install --save
* sudo node flea.js



## Troubleshooting
So far the only issue you'll have is that this application requires root access
