/*jshint esversion: 6 */
const jello = require("./jelloLobby");
const express = require("express");
const app = express();
var server = require('http').Server(app);

const PORT = 12345;
const HOST = 'localhost';

server.listen(PORT, HOST, () => {
	console.log(`Listening on ${PORT}`);
	console.log(`http://${HOST}:${PORT}/`);		
	jello.init(server, jello.logLevels.All);
});

app.use(express.static(`${__dirname}/..`, {extensions: ['html', 'js']}));
/*
http.listen(PORT, function(){
	console.log('listening on *:3000');
});*/