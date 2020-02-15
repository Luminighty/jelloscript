/*jshint esversion: 6 */
var io = require('socket.io')(80);

io.on('connect', onConnect);

/** @param {SocketIO.Socket} socket */
function onConnect(socket) {

	const addr = socket.client.conn.remoteAddress;
	const log = (message) => { console.log(`${addr}: ${message}`); };
	let currentLobby = null;

	socket.on("host lobby", (lobbyName, options, limit) => {
		const lobby = new Lobby(lobbyName, options, limit);
		log(`Creating lobby: ${lobby.lobbyName}#${lobby.id}`);
		currentLobby = lobby;
		socket.join(lobby.roomName);
	});

	socket.on("connect lobby", (id) => {
		if (Lobby.lobbies[id] == undefined)
			throw "Lobby not found!";
		const lobby = Lobby.lobbies[id];
		socket.to(lobby.roomName).emit("new connection");
		socket.join(lobby.roomName);
		currentLobby = lobby;
		lobby.host.emit("get state", function(state) {
			socket.emit("set state", state);
		});
	});


	socket.on("list lobbies", (options) => {
		socket.emit("update lobbies", Lobby.getLobbiesAsArray());
	});
}


class Lobby {
	/**
	 * @param {SocketIO.Socket} host
	 * @param {Number} id 
	 * @param {String} lobbyName 
	 * @param {Number} connectionLimit 
	 * @param {Object} data 
	 */
	constructor(host, lobbyName, data, connectionLimit) {
		this.host = host;
		this.id = Lobby.generateLobbyId();
		this.lobbyName = lobbyName;
		this.limit = connectionLimit;
		this.data = data;

		Lobby.lobbies[this.id] = this;
	}

	get roomName() {
		return `${this.id}-${this.lobbyName}`;
	}

	get lobbyData() {
		return {
			id: this.id,
			lobbyName: this.lobbyName,
			connectionLimit: this.limit,
			data: this.data
		};
	}
}

/** @type {Lobby[]} */
Lobby.lobbies = {};

Lobby.generateLobbyId = (function() {
	let lastId = Date.now();
	return () => { return lastId++;	};
}());

Lobby.getLobbiesAsArray = function() {
	const arr = [];
	for (const lobby of Lobby.lobbies) {
		arr.push(lobby.lobbyData);
	}
	return arr;
};