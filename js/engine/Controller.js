import * as Utils from './Utils';
import { Vector2 } from './Struct';
import { canvasConfig } from '../Config';
import { Axis, Button, InputMethods } from "./InputManager";
import { mouseConfig, axisConfig, DefaultGamepadControls, DefaultKeyboardControls } from "../Input";
import { Axes, Buttons } from "../Input";
import EventHandler from "./EventHandler";

const generateId = (function () {
	let id = Date.now();
	return function() {
		return `${id++}`;
	};
}());

/**
 * @typedef {Object} AxisKeys
 * @property {(String|Number)} positive The key for the positive value
 * @property {(String|Number)} negative The key for the negative value
 */

 /** 
  * Shorthand for {positive: "positive", negative: "negative"}
  * @returns {AxisKeys} @constructor */
export function AxisKeys(positive, negative) {
	return {positive: positive, negative: negative};
}

/**
 * @abstract
 * @public
 * @class
 */
export class Controller {

	/**
	 * 
	 * @param {Object.<String, (String|Number)>} buttons 
	 * @param {Object.<String, AxisKeys>} axes 
	 */
	constructor(buttons, axes) {
		/** @private @readonly @type {String} */
		this._id = generateId();
		
		/** 
		 * Used to map the button key names to the physical keys
		 * @type {Object.<String, (String|Number)>}
		 * @example
		 * 	this.buttonKeys = {'A': "LeftArrow", 'B': "X" }
		 *  */
		this.buttonKeys = buttons;
		/** 
		 * Used to map the axis names to the physical keys/axises
		 * @type {Object.<String, (String|Number)>}
		 * @example
		 * this.axisKeys = {'Horizontal': {positive: "RightArrow", negative: "LeftArrow"}}
		 *  */
		this.axisKeys = axes;
		this.enabled = true;
		this.setListeners();


		/** @type {Buttons} buttons */
		this.buttons = {};
		for (const key in buttons) {
			if (buttons.hasOwnProperty(key)) {
				this.buttons[key] = new Button();			
			}
		}
		/** @type {Axes} axes */
		this.axes = {};
		for (const key in axes) {
			if (axes.hasOwnProperty(key)) {
				const axis = new Axis();				
				axis.dead = axisConfig[this.type].dead;
				this.axes[key] = axis;
			}
		}
		controllers[this.id] = this;


		newControllerHandler.forEach("default", (listener) => {
			listener(this.input, this.id, this.type);
		});

		this.eventHandler = new EventHandler();

	}

	update() {
		for (const key in this.buttons) {
			if (this.buttons.hasOwnProperty(key)) {
				const button = this.buttons[key];
				const buttonKey = this.buttonKeys[key];
				this.updateButton(button, buttonKey);
			}
		}
		for (const key in this.axes) {
			if (this.axes.hasOwnProperty(key)) {
				const axis = this.axes[key];
				const axisKey = this.axisKeys[key];
				this.updateAxis(axis, axisKey);
			}
		}
	}

	/**
	 * @param {Button} button
	 * @param {String|Number} key
	 */
	updateButton(button, key) {
		if (button.state == 1 || button.state == -1)
			button.state++;
	}

	/** @param {Axis} axis */
	/** @param {String|Number} key */
	updateAxis(axis, key) {
		if (axis.state * axis.toValue < 0)
			axis.state = 0;
		const conf = axisConfig[this.type];
		let multiplier = (axis.toValue == 0) ? conf.gravity : conf.sensivity;
		axis.state = Utils.moveTowards(axis.state, axis.toValue, Math.abs(axis.state - axis.toValue) * multiplier);
	}

	get id() { return this._id; }

	/** @type {Number} */
	get type() {}

	/**
	 * @param {String} buttonKey 
	 * @param {String|Number} key 
	 */
	setButtonKey(buttonKey, key) { this.buttonKeys[buttonKey] = key; }

	/**
	 * @param {String} buttonKey 
	 * @param {Number} key 
	 */
	setAxisKey(axisKey, key) { this.axisKeys[axisKey] = key; }

	/** 
	 * Sets the DOM listeners for the Controller
	 * @protected
	 */
	setListeners() {}

	/** @type import("./InputManager").Inputs */
	get input() {
		return {
			Buttons: this.buttons,
			Axes: this.axes
		};
	}

	/** 
	 * Returns a button from a physical key
	 * or null if not found
	 * @returns {Button}
	 */
	getButton(key) {
		for (const buttonName in this.buttonKeys) {
			if (this.buttonKeys.hasOwnProperty(buttonName)) {
				const buttonKey = this.buttonKeys[buttonName];
				if (buttonKey == key)
					return this.buttons[buttonName];
			}
		}
		return null;
	}

	/** 
	 * Returns an axis from a physical key
	 * or null if not found
	 * @returns {Axis}
	 */
	getAxis(key) {
		for (const axisName in this.axisKeys) {
			if (this.axisKeys.hasOwnProperty(axisName)) {
				const axisKey = this.axisKeys[axisName];
				if (axisKey == key)
					return this.axes[axisName];
			}
		}
		return null;
	}

	/** Returns the current state of the controller */
	get states() {
		/** @type {Number[]} */
		const axes = [];
		/** @type {Number[]} */
		const buttons = [];
		for (const key in this.axes) {
			if (this.axes.hasOwnProperty(key)) {
				/** @type {Axis} */
				const axis = this.axes[key];
				axes[key] = axis.state;
			}
		}
		for (const key in this.buttons) {
			if (this.buttons.hasOwnProperty(key)) {
				/** @type {Button} */
				const btn = this.buttons[key];
				buttons[key] = btn.state;
			}
		}

		return {
			axes: axes,
			buttons: buttons
		};
	}

	/**
	 * @callback ControllerStateCallback
	 * @param {{axes: Number[], buttons: Number[]}} state
	 */

	/** @param {ControllerStateCallback} callback */
	onInputReceived(callback) {
		this.eventHandler.on("input", callback);
	}

	/** @protected */
	callInputReceived() {
		this.eventHandler.call("input", this.states);
	}
}

class KeyboardController extends Controller {

	/**
	 * 
	 * @param {Object.<String, (String|Number)} buttons 
	 * @param {Object.<String, AxisKeys} axes 
	 * 
	 * @example
	 *  const Buttons = { A: new Button(), B: new Button() };
	 *  const Axes = { Horizontal: new Axis()};
	 * 
	 * 	new KeyboardController(
	 * 		{ A: "X", B: "C"},
	 * 		{ Horizontal: AxisKeys("LeftArrow", "RightArrow"));
	 */
	constructor(buttons, axes) {
		super(buttons, axes);
		KeyboardPlayerIds.push(this._id);
	}

	get type() { return InputMethods.KEYBOARD; }

	setAxisPositive(axisKey, positiveKey) { this.axisKeys[axisKey].positive = positiveKey; }

	setAxisNegative(axisKey, negativeKey) { this.axisKeys[axisKey].negative = negativeKey; }

	setAxisKey(axisKey, positiveKey, negativeKey) {
		super.setAxisKey(axisKey, {
			positive: positiveKey,
			negative: negativeKey
		});
	}

	/** 
	 * Returns an axis from a physical key with the value (-1, +1)
	 * or null if not found
	 * @returns {?{axis: Axis, value: Number}}
	 */
	getAxis(key) {
		for (const axisName in this.axisKeys) {
			if (this.axisKeys.hasOwnProperty(axisName)) {
				const axisKey = this.axisKeys[axisName];
				if (axisKey.positive == key)
					return {axis: this.axes[axisName], value: 1};
				if (axisKey.negative == key)
					return {axis: this.axes[axisName], value: -1};
			}
		}
		return null;
	}


	setListeners() {
		/**
		 * Updates the states based on the keydown(+1) and keyup(-1) events
		 * @param {KeyboardController} controller 
		 * @param {String} keycode 
		 * @param {Number} value 
		 */
		const updateKeyFromKeyboard = function(controller, keycode, value) {
			const btn = controller.getButton(keycode);

			/** Only set the state if we're releasing the button, or if we've just pressed it */
			if (btn != null && (value != 1 || btn.state < 1)) {
				btn.state = value;

				const listenerType = (value == 1) ? Button.listenerTypes.Pressed : Button.listenerTypes.Released;
				btn.callListener(listenerType);
				lastUsed(controller);
			}

			const axisValue = controller.getAxis(keycode);
			if (axisValue != null) {
				const axis = axisValue.axis;
				const sign = axisValue.value;
				/*
					Change the toValue if it recieved a new input
					OR
					on releasing the key AND the current input is the same as the one we're releasing
				*/
				if (value > 0 || axis.toValue * sign > 0)
					axis.toValue = (value > 0) ? sign : 0;
				
				lastUsed(controller);
			}
		};

		window.addEventListener("keydown", (e) => {
			updateKeyFromKeyboard(this, e.code, 1);
		});

		window.addEventListener("keyup", (e) => {
			updateKeyFromKeyboard(this, e.code, -1);
		});
	}
}

class GamepadController extends Controller {

	constructor(gamepadIndex, buttons, axes) {
		super(buttons, axes);
		/** @type {Number} */
		this.index = gamepadIndex;
		/** @type {Gamepad} */
		this.gamepad = navigator.getGamepads()[gamepadIndex];
	}

	get type() { return InputMethods.GAMEPAD; }

	update() {
		this.gamepad = navigator.getGamepads()[this.index];
		super.update();
	}

	/** @param {Axis} axis */
	/** @param {Number} key */
	updateAxis(axis, key) {
		axis.state = this.gamepad.axes[key];
		if (Math.abs(axis.state) > 0.1)
			lastUsed(this);
	}


	/** 
	 * @param {Button} button
	 * @param {Number} key 
	 * */
	updateButton(button, key) {
		super.updateButton(button, key);
		if (this.gamepad.buttons[key].pressed && button.state <= 0) {
			button.state = 1;
			button.callListener(Button.listenerTypes.Pressed);
			lastUsed(this);
		}
		if (!this.gamepad.buttons[key].pressed && button.state > 0) {
			button.state = -1;
			button.callListener(Button.listenerTypes.Released);
			lastUsed(this);
		}
	}

}

class TouchController extends Controller {

	constructor(layout, buttons, axes) {
		super(buttons, axes);
		this.layout = inputs;
	}

	addEventListener() {

		/** @param {HTMLImageElement} element 
		 * @param {TouchController} controller
		 * */
		const addAxisTouch = function(controller, element, keys) {
			const startPosition = new Vector2(0,0);
			/** @type {Axis} */
			const horizontal = controller.axes[keys[0]];
			/** @type {Axis} */
			const vertical = controller.axes[keys[1]];

			element.addEventListener("touchstart", (e) => {
				e.preventDefault();
				startPosition.x = e.targetTouches[0].clientX;
				startPosition.y = e.targetTouches[0].clientY;
				lastUsed(controller);
			});
			element.addEventListener("touchmove", (e) => {
				e.preventDefault();
				const touch = e.targetTouches[0];
				let delta = new Vector2(touch.clientX, touch.clientY).substract(startPosition).divide(axisConfig[InputMethods.TOUCH].radius);
				if (delta.magnitude > 1)
					delta = delta.normalized;
				horizontal.state = delta.x;
				vertical.state = delta.y;
			});
			
			element.addEventListener("touchend", (e) => {
				e.preventDefault();
				horizontal.state = 0;
				vertical.state = 0;
			});
		};

		/** @param {HTMLImageElement} element 
		 * @param {TouchController} controller
		*/
		const addButtonTouch = function(controller, element, key) {
			element.addEventListener("touchstart", (e) => {
				e.preventDefault();
				/** @type {Button} */
				const btn = controller.buttons[key];
				btn.state = 1;
				btn.callListener(Button.listenerTypes.Pressed);
				lastUsed(controller);
			});
			element.addEventListener("touchend", (e) => {
				e.preventDefault();
				/** @type {Button} */
				const btn = controller.buttons[key];
				btn.state = -1;
				btn.callListener(Button.listenerTypes.Released);
			});
		};



		const listeners = {"axis": addAxisTouch, "button": addButtonTouch};
		for (const touchInput of this.layout) {
			/** @type {HTMLImageElement} */
			const element = document.createElement("img");
			element.src = touchInput.image;
			element.style.cssText = touchInput.css;
			document.body.appendChild(element);
			const addListener = listeners[touchInput.type.toLowerCase()];
			addListener(this, element, touchInput.key);
		}
	}


	get type() { return InputMethods.TOUCH; }
}

/** @type {Object.<string, Controller>} Controllers */
const controllers = {};

/**
 * @returns {import("./InputManager").Inputs}
 * @param {String} id 
 */
export function FromPlayer(id) {
	return controllers[id].input;
}

export const KeyboardPlayerIds = [];

/**
 * The method called when a new controller was attached
 * 
 * @callback newControllerCallback
 * @param {import("./InputManager").Inputs} input
 * @param {String} id
 */

const newControllerHandler = new EventHandler();

/**
 * Adds a listener that is called whenever a new Controller was attached
 * @param {newControllerCallback} listener 
 */
export function OnNewControllerListener(listener) {
	newControllerHandler.on("default", listener);
}

export function updateControllers() {
	for (const key in controllers) {
		if (controllers.hasOwnProperty(key)) {
			const element = controllers[key];
			element.update();
		}
	}
}

/**
 * Adds a mobile touch layout for the game
 * @param {import("../Input").TouchInputLayout} layoutConfig
 * @param {Boolean} onlyPhone Whenever it should be added only when played on the phone (true by default) 
 */
export function addTouchInput(layoutConfig, buttons, axes, onlyPhone = true) {
	if (!onlyPhone || Utils.mobileAndTabletCheck())
		new TouchController(layoutConfig, buttons, axes);
}


export function initControllers() {
	if (!Utils.mobileAndTabletCheck()) {
		for (const keyboard of DefaultKeyboardControls) {
			new KeyboardController(keyboard.Buttons, keyboard.Axes);
		}
	}

	window.addEventListener("gamepadconnected", (e) => {
		/** @type {Gamepad} */
		const gamepad = e.gamepad;
		lastUsed(new GamepadController(
			gamepad.index, 
			DefaultGamepadControls.Buttons, 
			DefaultGamepadControls.Axes
		));
	});
}


let lastUsedController = null;
/** @param {Controller} controller */
export function lastUsed(controller) {
	if (lastUsedController !== null && lastUsedController._id === controller._id)
		return;

	lastUsedController = controller;
	for (const key in controller.buttons) {
		if (controller.buttons.hasOwnProperty(key)) {
			const element = controller.buttons[key];
			Buttons[key] = element;
		}
	}

	for (const key in controller.axes) {
		if (controller.axes.hasOwnProperty(key)) {
			const element = controller.axes[key];
			Axes[key] = element; 
		}
	}
}






// ------ MOUSE START ------
export const Mouse = (function() {
	const Mouse = {
		position: Vector2.zero,
		/** @type {[Number]} */
		pressed: [],
		/** @param {Number} key */
		isPressed: function(key) {
			for (const btn of this.pressed)
				if (btn == key)
					return true;
			return false;
		},
		wheel: 0
	};


	/** @type {HTMLCanvasElement} */
	const canvas = document.body.querySelector(canvasConfig.canvasQuery);

	window.addEventListener("mousemove", (e) => {
		const rect = canvas.getBoundingClientRect();
		const size = canvasConfig.size;
		const scale = {x: rect.width / size.x, y: rect.height / size.y };

		const newPosition = {x: (e.clientX - rect.x) / scale.x, y: (e.clientY - rect.y) / scale.y};
		if (!mouseConfig.allowOutsideMousePosition && isOutsideOfCanvas(newPosition, rect))
			return;
		Mouse.position = new Vector2(newPosition.x, newPosition.y);
	});

	window.addEventListener("mousedown", (e) => {
		Mouse.pressed.push(e.button);
	});
	window.addEventListener("mouseup", (e) => {
		Mouse.pressed.splice(Mouse.pressed.indexOf(e.button), 1);
	});
	window.addEventListener("mousewheel", (e) => {
		Mouse.wheel = e.deltaY;
	});

	/**
	 * @param {Vector2} position 
	 * @returns {Boolean}
	 */
	function isOutsideOfCanvas(position) {
		return position.x < 0 || position.y < 0	|| position.x > canvasConfig.size.x || position.y > canvasConfig.size.y;
	}

	return Mouse;
}());


// ------ MOUSE END ------