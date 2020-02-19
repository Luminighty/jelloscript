import {Controller,lastUsed, OnNewControllerListener} from "./Controller";
import {networkConfig} from "../Input";
import { Axis, Button } from "./InputManager";
import EventHandler from "./EventHandler";


let socket = window.io(networkConfig.host);


class NetworkController extends Controller {
	constructor(buttons, axes, type, id) {
		super(buttons, axes);
		this.type = type;
		this.networkId = id;

		for (const key in buttons) {
			if (buttons.hasOwnProperty(key)) {
				const state = buttons[key];
				this.buttons[key] = state;
			}
		}

		for (const key in axes) {
			if (axes.hasOwnProperty(key)) {
				const state = axes[key];
				this.axes[key] = state;
			}
		}
	}

	setListeners() {
		socket.on("update controller", (id, isButton, key, value) => {
			if(id != this.networkId)
				return;
			
			const input = (isButton) ? this.buttons : this.axes;
			if (isButton && (input[key].state < 1 || value != 1)) {
				const listenerType = (value == 1) ? Button.listenerTypes.Pressed : Button.listenerTypes.Released;
				input[key].callListener(listenerType);
			}
			input[key] = value;
		});
	}
}

OnNewControllerListener((inputs, id, type) => {
	/** @type {Number[]} */
	const axes = [];
	/** @type {Number[]} */
	const buttons = [];
	for (const key in inputs.Axes) {
		if (inputs.Axes.hasOwnProperty(key)) {
			/** @type {Axis} */
			const axis = inputs.Axes[key];
			axes[key] = axis.state;
		}
	}
	for (const key in inputs.Buttons) {
		if (inputs.Buttons.hasOwnProperty(key)) {
			/** @type {Button} */
			const btn = inputs.Buttons[key];
			buttons[key] = btn.state;
		}
	}

	socket.emit("new controller", {axes, buttons, id, type});
});


/**
 * Container for lobby data
 * @param {Number} id The ID for the lobby
 * @param {*} lobbyName The display name for a lobby.
 * @param {*} connectionLimit The maximum number users can connect to a lobby
 * @param {*} data Optional data (description, lobby type, ect.)
 */
function Lobby(id, lobbyName, connectionLimit, data) {
	return {
		id,
		lobbyName,
		connectionLimit,
		data
	};
}

function host(lobbyName, options = {}, connectionLimit = 8) {
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
	socket.emit("list lobbies", options);
}

function setStateGetter(callback) {
	getState = callback;
}

function setStateSetter(callback) {
	getState = callback;
}

function updateState() {
	socket.emit("update state");
}



socket.on("update lobbies", (lobbies) => {
	NetworkManager.lobbies = lobbies;
	events.call("lobby refresh", lobbies);
});

/** @deprecated ? */
socket.on("new connection", (data) => {
	console.log(data);
});

socket.on("get state", (sendState) => {
	sendState(getState());
});

socket.on("set state", (state) => {
	setState(state);
});

socket.on("new controller", (buttons, axes, type, id) => {
	new NetworkController(buttons, axes, type, id);
});

let getState = function () { return {}; };
let setState = function (state) {};

const events = new EventHandler();

function onLobbiesRefreshed(callback) {
	events.on("lobby refresh", callback);
}

const NetworkManager = {
	host,
	connect,
	refreshLobbies,
	onLobbiesRefreshed,
	setStateGetter,
	setStateSetter,
	updateState,
	/** @type Lobby */
	lobbies: []
};

export default NetworkManager;