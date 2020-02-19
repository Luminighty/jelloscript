/* jshint esversion: 6 */
const socketIO = require('socket.io');
/** @type {SocketIO.Server} */
var io = null;

exports.init = (PORT) => {
	io = socketIO(PORT);
	io.on('connect', onConnect);
};

/** @param {SocketIO.Socket} socket */
function onConnect(socket) {

	const addr = socket.client.conn.remoteAddress;
	const log = (message) => { console.log(`${addr}: ${message}`); };
	/** @type {Lobby} */
	let currentLobby = null;

	const updateSocketState = () => {
		currentLobby.host.emit("get state", function(state) {
			socket.emit();
		});
	};

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
		/** @deprecated ? */
		socket.to(lobby.roomName).emit("new connection");
		socket.join(lobby.roomName);
		currentLobby = lobby;
		updateSocketState();
	});

	socket.on("update state", updateSocketState);

	socket.on("list lobbies", (options) => {
		socket.emit("update lobbies", Lobby.getLobbiesAsArray(options));
	});

	socket.on("get controllers", () => {
		for (const id in currentLobby.controllers) {
			if (currentLobby.controllers.hasOwnProperty(id)) {
				const contr = currentLobby.controllers[id];
				if (contr.socketId == socket.client.id)
					continue;
				socket.emit("new controller", contr.buttons, contr.axes, contr.type, contr.id);
			}
		}
	});


	socket.on("new controller", (controller) => {
		const contr = new Controller(socket.client.id, controller);
		currentLobby.addController(contr);
		socket.broadcast.emit("new controller", contr.buttons, contr.axes, contr.type, contr.id);
	});

	socket.on("update controller", (id, isButton, key, value) => {
		const controller = currentLobby.controllers[id];
		const input = (isButton) ? controller.buttons : controller.axes;
		input[key] = value;
		socket.broadcast.emit("update controller", id, isButton, key, value);
	});
}

class Controller {

	/**
	 * 
	 * @param {String} socketId 
	 * @param {{type: Number, buttons: Object.<string, Number>, axes: Object.<string, Number>}} controller 
	 */
	constructor(socketId, controller) {
		this.socketId = socketId;
		this.id = `${socketId}-${generateId()}`;
		this.type = controller.type;
		this.buttons = controller.buttons;
		this.axes = controller.axes;
	}
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
		this.id = generateId();
		this.lobbyName = lobbyName;
		this.limit = connectionLimit;
		this.data = data;
		/** @type {Controller[]} */
		this.controllers = {};
		Lobby.lobbies[this.id] = this;
	}

	get roomName() {
		return `${this.id}-${this.lobbyName}`;
	}

	/** @param {Controller} controller */
	addController(controller) {
		this.controllers[controller.id] = controller;
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

const generateId = (function() {
	let lastId = Date.now();
	return () => { return lastId++;	};
}());

Lobby.getLobbiesAsArray = function(options) {
	const arr = [];
	const name = (options.search) ? options.search : "";
	for (const lobby of Lobby.lobbies) {
		if (name == "" || lobby.lobbyName.includes(name))
			arr.push(lobby.lobbyData);
	}
	return arr;
};