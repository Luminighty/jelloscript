import { Axis, Button, InputMethods, lastUsed } from "./InputManager";
import { axisConfig, Axes, Buttons, DefaultGamepadControls, DefaultKeyboardControls } from "../Input";
import { mobileAndTabletCheck } from "./run";
import * as Utils from "./Utils";


const generateId = (function () {
	let id = 0;
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
class Controller {

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
		this.axisKeys = buttons;
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
	}

	update() {
		for (const key in this.buttons) {
			if (this.buttons.hasOwnProperty(key)) {
				const button = this.buttons[key];
				const buttonKey = this.axisKeys[key];
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

	setButtonKey(buttonKey, key) { this.axisKeys[buttonKey] = key; }

	setAxisKey(axisKey, key) { this.axisKeys[axisKey] = key; }

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
		for (const buttonName in this.axisKeys) {
			if (this.axisKeys.hasOwnProperty(buttonName)) {
				const buttonKey = this.axisKeys[buttonName];
				if (buttonKey == key)
					return this.buttons[buttonKey];
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
					return this.axes[axisKey];
			}
		}
		return null;
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
					return {axis: this.axes[axisKey], value: 1};
				if (axisKey.negative == key)
					return {axis: this.axes[axisKey], value: -1};
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
			if (btn != null) {
				btn.state = value;
				lastUsed(this);
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
				
				lastUsed(this);
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
			lastUsed(this);
		}
		if (!this.gamepad.buttons[key].pressed && button.state >= 0) {
			button.state = -1;
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
				lastUsed(controller);
			});
			element.addEventListener("touchend", (e) => {
				e.preventDefault();
				/** @type {Button} */
				const btn = controller.buttons[key];
				btn.state = -1;
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
export function addTouchInput(layoutConfig, onlyPhone = true) {
	if (!onlyPhone || mobileAndTabletCheck())
		new TouchController(layoutConfig, Buttons, Axes);
}






export function initControllers() {

	if (!mobileAndTabletCheck()) {
		for (const keyboard of DefaultKeyboardControls) {
			new KeyboardController(keyboard.Buttons, keyboard.Axes);
		}
	}

	window.addEventListener("gamepadconnected", (e) => {
		/** @type {Gamepad} */
		const gamepad = e.gamepad;
		lastUsedController = new GamepadController(
			gamepad.index, 
			DefaultGamepadControls.Buttons, 
			DefaultGamepadControls.Axes
		);
	});
}

