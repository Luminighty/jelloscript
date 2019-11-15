import * as Utils from './Utils';
import { axisConfig, Buttons, Axes, mouseConfig, TouchInputs } from "../Input";
import { Vector2 } from './Struct';
import { canvasConfig } from '../Config';

const inputMethods = { GAMEPAD: 0, KEYBOARD: 1, TOUCH: 2 };
let currentInputMethod = inputMethods.KEYBOARD;


/**
 * @public
 * @class
 */
export class Button {
	
	/**
	 * Initializes a new Button input
	 * @param {String} keyName Name of the key, should equals with the Buttons' index
	 * @param {key.code} defaultKey Default keyboard control, see keyboardevent.code for the possible values
	 * @param {Number} defaultButton Index for the button on a gamepad
	 */
	constructor(keyName, defaultKey, defaultButton) {
		/**
		 * The button's name
		 * @private
		 * @readonly
		 */
		this.key = keyName;
		/**
		 * The current state of the button
		 * @private
		 * @readonly
		 */
		this.state = 0;
		if (this instanceof Axis)
			return;
		keys.keyboard[keyName] = defaultKey;
		keys.gamepad[keyName] = defaultButton;
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

export class Axis extends Button {
	/**
	 * Initializes a new Axis input
	 * @param {String} axisName Name of the key, should equals with the Axes' index
	 * @param {key.code} positiveKey Default positive key on the keyboard
	 * @param {key.code} negativeKey Default negative key on the keyboard
	 * @param {Number} gamepadAxis Index for the axis on a gamepad
	 */
	constructor(axisName, positiveKey, negativeKey, gamepadAxis) {
		super(axisName, "", "");
		this.axis = axisName;
		this.toValue = 0;
	
		keys.keyboard[axisName + "+"] = positiveKey;
		keys.keyboard[axisName + "-"] = negativeKey;
		keyToAxis[positiveKey] = [axisName,  1];
		keyToAxis[negativeKey] = [axisName, -1];
		gamepadToAxis[axisName] = gamepadAxis;
	}
	/** 
	 * Return the current value of the axis. A number between [-1,1]
	 * @public
	 * @type Number 
	 */
	get value() {return (Math.abs(this.state) > axisConfig[currentInputMethod].dead) ? this.state : 0;}
}

/**
 * @private
 */
export function update() {
	Mouse.wheel = 0;
	if (checkGamePadInputs())
		currentInputMethod = inputMethods.GAMEPAD;
	
	for (const btnKey in Buttons) {
		if (!Buttons.hasOwnProperty(btnKey))
			continue;
		const btn = Buttons[btnKey];
		if (btn.state == 1 || btn.state == -1)
			btn.state++;
	}
	
	(currentInputMethod == inputMethods.KEYBOARD) ? updateAxisKeyboard() : updateAxisGamepad();
}

function updateAxisKeyboard() {
	for (const axisKey in Axes) {
		if (!Axes.hasOwnProperty(axisKey))
			continue;
		const axis = Axes[axisKey];
		if (axis.state * axis.toValue < 0)
			axis.state = 0;
		let multiplier = (axis.toValue == 0) ? axisConfig[currentInputMethod].gravity : axisConfig[currentInputMethod].sensivity;
		axis.state = Utils.moveTowards(axis.state, axis.toValue, Math.abs(axis.state - axis.toValue) * multiplier);
	}
}

function updateAxisGamepad() {
	if(currentGamePad == null)
		return;
	
	const gamepadButtons = keys.gamepad;
	for (const btn in gamepadButtons) {
		if (gamepadButtons.hasOwnProperty(btn)) {
			const index = gamepadButtons[btn];
			
			if (currentGamePad.buttons[index].pressed && Buttons[btn].state == 0)
				Buttons[btn].state = 1;
			if (!currentGamePad.buttons[index].pressed && Buttons[btn].state == 2)
				Buttons[btn].state = -1;

		}
	}

	for (const axis in gamepadToAxis) {
		if (gamepadToAxis.hasOwnProperty(axis)) {
			const axisIndex = gamepadToAxis[axis];
			const value = currentGamePad.axes[axisIndex];
			if (Math.abs(value) > axis[1].dead)
				currentInputMethod = inputMethods.GAMEPAD;

			Axes[axis].state = value;
		}
	}
	
}

function checkGamePadInputs() {
	if (currentGamePad == null)
		return false;
	for (const gamePad of navigator.getGamepads()) {
		if (gamePad == null)
			continue;
		
		for (const value of currentGamePad.axes)
			if(Math.abs(value) > axisConfig[inputMethods.GAMEPAD].dead) {
				currentGamePad = gamePad;
				return true;
			}

		for (const btn of currentGamePad.buttons) {
			if(btn.pressed) {
				currentGamePad = gamePad;
				return true;
			}
		}
	}
	currentGamePad = navigator.getGamepads()[currentGamePad.index];
	
	return false;
}

window.addEventListener("keydown", (e) => {
	updateKeyFromKeyboard(e.code, 1);
});

window.addEventListener("keyup", (e) => {
	updateKeyFromKeyboard(e.code, -1);
});

let currentGamePad;
window.addEventListener("gamepadconnected", (e) => {
	if(currentGamePad == null)
		currentGamePad = e.gamepad;
});

/*
	Updates the buttons and axes when the user presses a button on the keyboard
	keycode is the recieved input, while value is the new value the button will have

	for axes if the value is -1 it's set to go towards 0, while if it's 1, then it'll recieve the
	new value from keyToAxis
*/
function updateKeyFromKeyboard(keycode, value) {
	currentInputMethod = inputMethods.KEYBOARD;
	let keyboardKeys = keys.keyboard;
	for (const key in keyboardKeys) {
		if (!keyboardKeys.hasOwnProperty(key))
			continue;
		const element = keyboardKeys[key];	
		if (element == keycode) {
			if (Buttons[key] != null && (Buttons[key].state < 1 || value == -1)) {
				Buttons[key].state = value;
			}
			
			if (keyToAxis[element] != null) {
				let axis = Axes[keyToAxis[element][0]];
				
				/*
					Change the toValue if it recieved a new input
					OR
					on losing input and the current input is the same as the one we're losing
				*/
				if (value > 0 || axis.toValue * keyToAxis[element][1] > 0)
					axis.toValue = (value > 0) ? keyToAxis[element][1] : 0;

			}
		}
	}
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

export function setKeyboardKey(key, code) {
	keys.keyboard[key] = code;
}

export function setGamepadKey(key, code) {
	keys.gamepad[key] = code;
}

/**
 * The default control settings
 * 		'BUTTON': 'Default key'
 * 
 * keyboard uses KeyboardEvent.code
 * gamepad uses the gamepad button's index
 */
let keys = {
	keyboard: {},
	gamepad: {}
};

/**
 * Converts a key to the corresponding axis
 * @returns [AxisName, +1/-1]
 */
const keyToAxis = {};


/** The axis index used when fetching gamepad's data */
let gamepadToAxis = {};

export const Mouse = {
	position: Vector2.zero,
	pressed: [],
	isPressed: function(key) {
		for (const btn of this.pressed)
			if (btn == key)
				return true;
		return false;
	},
	wheel: 0
};

/** @type {HTMLCanvasElement} */
const canvas = document.body.querySelector("canvas");

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
 */
function isOutsideOfCanvas(position) {
	return position.x < 0 || position.y < 0	|| position.x > canvasConfig.size.x || position.y > canvasConfig.size.y;
}


/** @param {HTMLImageElement} element */
function addAxisTouch(element, keys) {
	const startPosition = new Vector2(0,0);
	element.addEventListener("touchstart", (e) => {
		e.preventDefault();
		startPosition.x = e.targetTouches[0].clientX;
		startPosition.y = e.targetTouches[0].clientY;
		currentInputMethod = inputMethods.TOUCH;
	});
	element.addEventListener("touchmove", (e) => {
		e.preventDefault();
		const touch = e.targetTouches[0];
		let delta = new Vector2(touch.clientX, touch.clientY).substract(startPosition).divide(axisConfig[inputMethods.TOUCH].radius);
		if (delta.magnitude > 1)
			delta = delta.normalized;
		
		/** @type {Axis} */
		const horizontal = Axes[keys[0]];
		/** @type {Axis} */
		const vertical = Axes[keys[1]];
		horizontal.state = delta.x;
		vertical.state = delta.y;
		currentInputMethod = inputMethods.TOUCH;
	});
	element.addEventListener("touchend", (e) => {
		e.preventDefault();
		/** @type {Axis} */
		const horizontal = Axes[keys[0]];
		/** @type {Axis} */
		const vertical = Axes[keys[1]];
		horizontal.state = 0;
		vertical.state = 0;
	});
}
/** @param {HTMLImageElement} element */
function addButtonTouch(element, key) {
	element.addEventListener("touchstart", (e) => {
		e.preventDefault();
		/** @type {Button} */
		const btn = Buttons[key];
		btn.state = 1;
		currentInputMethod = inputMethods.TOUCH;
	});
	element.addEventListener("touchend", (e) => {
		e.preventDefault();
		const btn = Buttons[key];
		btn.state = -1;
	});
}

export function addTouchInputs() {
	const listeners = {"axis": addAxisTouch, "button": addButtonTouch};
	for (const touchInput of TouchInputs) {
		/** @type {HTMLImageElement} */
		const element = document.createElement("img");
		element.src = touchInput.image;
		element.style.cssText = touchInput.css;
		document.body.appendChild(element);
		const addListener = listeners[touchInput.type.toLowerCase()];
		addListener(element, touchInput.key);
	}	
}