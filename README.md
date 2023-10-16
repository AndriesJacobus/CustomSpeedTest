# CustomSpeedTest
Get the speed of the network using a node file server and client.

## Setup

Run `yarn` or `npm install` to setup the required packages.

## Approach

### The File Server

Using `file-server.js` you can spin up a basic nodejs express file server with the following endpoints:

* check_download_speed (GET): endpoint used to download a file from the file server
* check_upload_speed (POST): endpoint used to upload a file from to file server

You can run this server executing `node file-server.js` in its own terminal.

### The Speed Test

Using `speed-test.js` you can run a client that connects to the file server.<br/>
It periodically uses the above mentioned two endpoints to upload and download a file over the network.<br/>
The average speed for the session can be seen in the terminal, while a log of the measured speeds is saved to a csv file.

You can run this server executing `node speed-test.js` in its own terminal.
