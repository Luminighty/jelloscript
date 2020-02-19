/*jshint esversion: 6 */
const jello = require("./jelloLobby");
const express = require("express");
const app = express();
var http = require('http').createServer(app);

const PORT = 8080;

jello.init(http);


app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
	console.log(`http://localhost:${PORT}/`);			
});

app.use(express.static("..", {extensions: ['html', 'js']}));

http.listen(3000, function(){
	console.log('listening on *:3000');
});