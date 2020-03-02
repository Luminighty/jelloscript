import {Controller, OnNewControllerListener, foreachController} from "./Controller";
import {networkConfig, axisConfig} from "../Input";
import { Axis, Button } from "./InputManager";
import EventHandler from "./EventHandler";


const socket = window.io(/*networkConfig.host*/);

socket.on("connect", () => {
	console.log("connected");
});

/**
 * A remote player representation for a controller
 */
class NetworkController extends Controller {
	constructor(buttons, axes, type, id) {
		super(buttons, axes, false);
		this.networkId = id;
		/** @type {Number} */
		this._type = type;
		for (const key in buttons) {
			if (buttons.hasOwnProperty(key)) {
				const state = buttons[key];
				this.buttons[key].state = state;
			}
		}

		for (const key in axes) {
			if (axes.hasOwnProperty(key)) {
				const state = axes[key];
				this.axes[key].state = state;
				this.axes[key].dead = axisConfig[this.type].dead;
			}
		}
	}

	get type() {return (this._type) ? this._type : 0; }

	setListeners() {
		socket.on("update controller", (id, key, value, isButton) => {
			if(id != this.networkId)
				return;
			
			const input = (isButton) ? this.buttons : this.axes;
			if (isButton && (input[key].state < 1 || value != 1)) {
				const listenerType = (value == 1) ? Button.listenerTypes.Pressed : Button.listenerTypes.Released;
				input[key].callListener(listenerType);
			}
			input[key].state = value;
		});
	}

	/** The axis gets updated from the listeners */
	updateAxis(axis, key) {}

}

/** Converts the inputs to only have their states */
function inputToValues(inputs) {
	/** @type {Object.<string, number>} */
	const axes = {};
	/** @type {Object.<string, number>} */
	const buttons = {};
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
	return {axes, buttons};
}

/** Sends a new controller to the server. Only if it's a local controller */
function addController(inputs, id, type, isLocal) {
	if (!isLocal)
		return;
	
	const {axes, buttons} = inputToValues(inputs);
	socket.emit("new controller", {axes, buttons, id, type});
	inputs.Controller.onInputReceived((key, state, isButton) => {
		socket.emit("update controller", id, key, state, isButton);
	});
}

// On new controller we add it to the lobby
OnNewControllerListener(addController);


/**
 * @typedef {Object} Lobby
 * @property {Number} id 
 * @property {String} lobbyName 
 * @property {Number} connectionLimit 
 * @property {any} data 
 */

/**
 * Container for lobby data
 * @param {Number} id The ID for the lobby
 * @param {String} lobbyName The display name for a lobby.
 * @param {Number} connectionLimit The maximum number users can connect to a lobby
 * @param {any} data Optional data (description, lobby type, ect.)
 */

/**
 * Hosts a lobby
 * @param {String} lobbyName The display name of the lobby
 * @param {Object} options Any data that can be attached to the lobby (Type, Level, Minimum Score, ...)
 * @param {Number} connectionLimit Maximum amount of clients that can be connected to the lobby
 */
function host(lobbyName, options = {}, connectionLimit = 8) {
	const defaultLimit = networkConfig.defaultConnectionLimit;
	const limit = (connectionLimit == undefined) ? defaultLimit : connectionLimit;
	socket.emit("host lobby", lobbyName, options, limit);
}

/**
 * Connects to the lobby passed to the function
 * @param {Lobby} lobby 
 */
function connect(lobby) {
	if (lobby == undefined || lobby.id == undefined)
		throw "Not a lobby!";
	socket.emit("connect lobby", lobby.id);
}

/**
 * Refreshes the lobbies list
 * @param {Object} options Options for the query
 */
function refreshLobbies(options) {
	socket.emit("list lobbies", (options) ? options : {});
}

/**
 * Sets a function that should return the current state of the game used by the StateSetter
 * @param {CallableFunction} callback 
 */
function setStateGetter(callback) {
	getState = callback;
}

/**
 * Sets a function that should set the current state of the game (returned by the StateGetter)
 * @param {CallableFunction} callback 
 */
function setStateSetter(callback) {
	getState = callback;
}

/**
 * Updates the current state of the game after asking for an update from the host
 */
function updateState() {
	socket.emit("update state");
}

socket.on("get state", (sendState) => {
	sendState(getState());
});

socket.on("set state", (state) => {
	setState(state);
});



let getState = function () { return {}; };
let setState = function (state) {};


socket.on("update lobbies", (lobbies) => {
	NetworkManager.lobbies = lobbies;
	events.call("lobby refresh", lobbies);
});

/** @deprecated Don't really have to call this */
socket.on("new connection", () => {
	console.log("New connection");
});

socket.on("new controller", (buttons, axes, type, id) => {
	new NetworkController(buttons, axes, type, id);
});

socket.on("get controllers", () => {
	foreachController(addController);
});


const events = new EventHandler();

/**
 * 
 * @param {CallableFunction} callback 
 */
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
	/** @type {Lobby[]} */
	lobbies: []
};



export default NetworkManager;