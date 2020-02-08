import * as Utils from './Utils';
import { axisConfig, mouseConfig } from "../Input";
import { Vector2 } from './Struct';
import { canvasConfig } from '../Config';
import { updateControllers, AxisKeys } from "./Controller";

/**
 * @enum {number}
 * @property {GAMEPAD} 0
 * @property {KEYBOARD} 1
 * @property {TOUCH} 2
 */
export const InputMethods = { 
	/** @constant 0 */
	GAMEPAD: 0,
	/** @constant 1 */
	KEYBOARD: 1, 
	/** @constant 2 */
	TOUCH: 2 
};

/** @typedef {Object} KeyboardControls
 * @property {Object.<String, String>} Buttons
 * @property {Object.<String, Object.<String, String>>} Axes
 */

/**
 * @typedef {Object} PlayerControl
 * @property {String} id
 * @property {Inputs} inputs
 * @property {InputMethods} type
 */

/**
 * @typedef {Object} Inputs
 * @property {Axes} Axes
 * @property {Buttons} Buttons
 */


/**
 * @public
 * @class
 * @abstract
 */
class Input {
	/** Initializes a new Input */
	constructor() {
		/**
		 * The current states for the Input
		 * @private
		 * @readonly
		 * @type {Number}
		 */
		this.state = 0;
	}
}

/**
 * @public
 * @class
 */
export class Button extends Input {
	
	/** Initializes a new Button input */
	constructor() {
		super();
	}

	/** 
	 * Returns true during the frame the user pressed the button
	 * @public
	 * @type Boolean 
	 */
	get isPressed() {return this.state == 1;}
	/** 
	 * Return true while the button is held down
	 * @public
	 * @type Boolean 
	 */
	get isDown() {return this.state > 0;}
	/** 
	 * Return true during the frame the user released the button
	 * @public
	 * @type Boolean 
	 */
	get isUp() {return this.state < 0;}
}

export class Axis extends Input {
	
	/** Initializes a new Axis input*/
	constructor() {
		super();
		/**
		 * @private
		 * @readonly
		 * @type {Number}
		 */
		this.dead = 0.0;

		/**
		 * Used for keyboard values
		 * @private
		 * @readonly
		 * @type {Number}
		 */
		this.toValue = 0;
	}

	/** 
	 * Return the current value of the axis. A number between [-1,1]
	 * @public
	 * @type Number 
	 */
	get value() {return (Math.abs(this.state) > this.dead) ? this.state : 0;}
}


/**
 * @private
 */
export function update() {
	Mouse.wheel = 0;
	updateControllers();
}



/** @returns {Promise<KeyboardEvent.code>} */
export function onAnyKeyboardKey() {
	return new Promise(res => {
		const pressEvent = function (e) {
			if (e == null || e.code == null)
				return;
			res(e.code);
			window.removeEventListener("keydown", pressEvent);
		};
		window.addEventListener("keydown", pressEvent);
	});
}
/** @returns {Promise<Number>} */
export function onAnyGamepadButtons() {
	return new Promise(res => {
		const check = setInterval(() => {
			for (const gamePad of navigator.getGamepads()) {
				if(gamePad == null)
					continue;
				for (let id = 0; id < gamePad.buttons.length; id++) {
					const btn = gamePad.buttons[id];
					if (btn.pressed) {
						res(id);
						clearInterval(check);
					}
				}
			}
		}, 1);
	});
}

/** Sets the key on the keyboard then resolves the promise
 * @returns {Promise}
 */
export function setKeyboardKeyOnNextPress(key) {
	return onAnyKeyboardKey()
	.then((code) => {
		setKeyboardKey(key, code);
	});
}
/** Sets the key on the gamepad then resolves the promise
 * @returns {Promise}
 */
export function setGamepadKeyOnNextPress(key) {
	return  onAnyGamepadButtons()
	.then((code) => {
		setGamepadKey(key, code);
	});
}








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


export {AxisKeys};

let lastUsedController = null;
export function lastUsed(controller) {
	if (lastUsedController === controller)
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