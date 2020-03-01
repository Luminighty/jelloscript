/* jshint esversion: 6 */
const socketIO = require('socket.io');
/** @type {SocketIO.Server} */
var io = null;

exports.init = (server) => {
	io = socketIO(server);
	io.on('connect', onConnect);
	console.log("Jello Lobby started...");
};


/** @param {SocketIO.Socket} socket */
function onConnect(socket) {

	const addr = socket.id;
	const log = (message) => { console.log(`${addr}: ${message}`); };
	/** @type {Lobby} */
	let currentLobby = null;
	log("connected");

	const updateSocketState = () => {
		//const currentLobby = currentLobbies.get(socket);
		currentLobby.host.emit("get state", function(state) {
			socket.emit();
		});
	};

	const sendControllers = () => {
		socket.emit("clear controllers");
		for (const id in currentLobby.controllers) {
			if (currentLobby.controllers.hasOwnProperty(id)) {
				const contr = currentLobby.controllers[id];
				if (contr.socketId == socket.id)
					continue;
				log(`Adding new controller ${contr.id}`);
				socket.emit("new controller", contr.buttons, contr.axes, contr.type, contr.id);
			}
		}
	};

	socket.on("host lobby", (lobbyName, options, limit) => {
		const lobby = new Lobby(socket, lobbyName, options, limit);
		log(`Creating lobby: ${lobby.lobbyName}#${lobby.id}`);
		currentLobby = lobby;
		//currentLobbies.set(socket, lobby);
		//console.log(`New current lobby: ${currentLobbies.get(socket)}`);
		
		//currentLobby = lobby;
		socket.join(lobby.roomName);
		socket.emit("get controllers");
	});

	socket.on("connect lobby", (id) => {
		if (Lobby.lobbies[id] == undefined)
			throw "Lobby not found!";
		const lobby = Lobby.lobbies[id];
		/** @deprecated ? */
		socket.to(lobby.roomName).emit("new connection");
		socket.join(lobby.roomName);
		currentLobby = lobby;
		log(`Connected to lobby: ${lobby.lobbyName}#${lobby.id}`);
		//currentLobbies.set(socket, lobby);
		socket.emit("get controllers");
		updateSocketState();
		sendControllers();
	});

	socket.on("update state", updateSocketState);

	socket.on("list lobbies", (options) => {
		socket.emit("update lobbies", Lobby.getLobbiesAsArray(options));
	});

	socket.on("get controllers", sendControllers);


	socket.on("new controller", (controller) => {
		//const currentLobby = currentLobbies.get(socket);
		if (currentLobby == null)
			return;
		log("Connected a new controller");
		const contr = new Controller(socket, controller);
		currentLobby.addController(contr);
		socket.to(currentLobby.roomName).emit("new controller", contr.buttons, contr.axes, contr.type, contr.id);
	});

	socket.on("update controller", (id, key, value, isButton) => {
		//const currentLobby = currentLobbies.get(socket);
		if (currentLobby == null)
			return;
		const controller = currentLobby.controllers[Controller.toId(socket, id)];
		if (controller == null) {
			console.error(`Controller with Id '${Controller.toId(socket, id)}' not found!`);
			console.log(Object.keys(currentLobby.controllers));
			return;
		}
		const input = (isButton) ? controller.buttons : controller.axes;
		input[key] = value;
		//console.log("controller updated :)");
		socket.to(currentLobby.roomName).emit("update controller", controller.id, key, value, isButton);
	});
}

class Controller {
	/**@param {SocketIO.Socket} socket 
	 * @param {{type: Number, buttons: Object.<string, Number>, axes: Object.<string, Number>}} controller 
	 */
	constructor(socket, controller) {
		this.socketId = socket.id;
		this.id = Controller.toId(socket, controller.id);
		this.type = controller.type;
		this.buttons = controller.buttons;
		this.axes = controller.axes;
	}
}

/** @param {SocketIO.Socket} socket */
Controller.toId = function (socket, controllerId) { 
	return `${socket.id}-${controllerId}`;
};



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
	for (const key in Lobby.lobbies) {
		const lobby = Lobby.lobbies[key];
		if (name == "" || lobby.lobbyName.includes(name))
			arr.push(lobby.lobbyData);
	}
	return arr;
};