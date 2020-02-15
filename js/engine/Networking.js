import { Controller, lastUsed } from "./Controller";
import { Axes, Buttons } from "../Input";
import { networkConfig } from "../Input";

const io = require('socket.io-client');
const socket = io(networkConfig.host);


class NetworkController extends Controller {
	constructor(buttons, axes) {
		super(buttons, axes);

		this.type = 22222222222;

	}

	updateInput() {

	}
}

/**
 * Container for lobby data
 * @param {Number} id The ID for the lobby
 * @param {*} lobbyName The display name for a lobby.
 * @param {*} connectionLimit The maximum number users can connect to a lobby
 * @param {*} data Optional data (description, lobby type, ect.)
 */
function Lobby(id, lobbyName, connectionLimit, data) {
	return {
		id, lobbyName, connectionLimit, data
	};
}

function host(lobbyName, options, connectionLimit) {
	const defaultLimit = networkConfig.defaultConnectionLimit;
	const limit = (connectionLimit == undefined) ? defaultLimit : connectionLimit;
	socket.emit("host lobby", lobbyName, options, limit);
}

function connect(lobby) {
	if (lobby == undefined || lobby.id == undefined)
		throw "Not a lobby!";
	socket.emit("connect lobby", lobby.id);
}

function refreshLobbies(options) {
	socket.emit("list lobbies");
}

function setStateGetter(callback) { 
	getState = callback; 
}
function setStateSetter(callback) { 
	getState = callback; 
}


socket.on("update lobbies", (lobbies) => {
	NetworkManager.lobbies = lobbies;
});

socket.on("new connection", (data) => {

});

socket.on("get state", (sendState) => {
	sendState(getState());
});
socket.on("set state", (state) => {
	setState(state);
});

let getState = function() { return {}; };
let setState = function(state) {  };

export const NetworkManager = {
	host, connect, refreshLobbies, setStateGetter, setStateSetter, lobbies: []
};
