import * as Utils from './Utils';



/*  ---------------------------------------------------------------------------------
	For the controls scroll down to the bottom of the file (classes can't be hoisted)
	---------------------------------------------------------------------------------    */

const inputMethods = { GAMEPAD: 0, KEYBOARD: 1 }
let currentInputMethod = inputMethods.KEYBOARD;


class Button {
	state = 0;
	
	/**
	 * Initializes a new Button input
	 * @param {String} keyName Name of the key, should equals with the Buttons' index
	 * @param {key.code} defaultKey Default keyboard control, see keyboardevent.code for the possible values
	 * @param {Number} defaultButton Index for the button on a gamepad
	 * @param {Boolean} isAxis Used for Axes, do not set this value
	 */
	constructor(keyName, defaultKey, defaultButton, isAxis = false) {
		this.key = keyName;
		if (isAxis)
			return;
		keys.keyboard[keyName] = defaultKey;
		keys.gamepad[keyName] = defaultButton;
	}
	get isPressed() {return this.state == 1;}
	get isDown() {return this.state > 0;}
	get isUp() {return this.state < 0;}
}

class Axis extends Button {
	toValue = 0;

	/**
	 * Initializes a new Axis input
	 * @param {String} axisName Name of the key, should equals with the Axes' index
	 * @param {key.code} positiveKey Default positive key on the keyboard
	 * @param {key.code} negativeKey Default negative key on the keyboard
	 * @param {Number} gamepadAxis Index for the axis on a gamepad
	 */
	constructor(axisName, positiveKey, negativeKey, gamepadAxis) {
		super(axisName, "", "", true);
		this.axis = axisName;
		keys.keyboard[axisName + "+"] = positiveKey;
		keys.keyboard[axisName + "-"] = negativeKey;
		keyToAxis[positiveKey] = [axisName,  1];
		keyToAxis[negativeKey] = [axisName, -1];
		gamepadToAxis[axisName] = gamepadAxis;
	}
	get value() {return (Math.abs(this.state) > axisConfig[currentInputMethod].dead) ? this.state : 0;}
}

export function update() {
	if (checkGamePadInputs())
		currentInputMethod = inputMethods.GAMEPAD;
	
	for (const btnKey in Buttons) {
		if (!Buttons.hasOwnProperty(btnKey))
			continue;
		const btn = Buttons[btnKey];
		if (btn.state == 1 || btn.state == -1)
			btn.state++;
	}
	
	currentInputMethod == inputMethods.KEYBOARD ? updateAxisKeyboard() : updateAxisGamepad();
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

// TODO: Write these functions for settings keys
export function setKeyboardKey(key, code) {
	keys.keyboard[key] = code;
	// TODO: check if it's already used
}

export function setGamepadKey(key, code) {
	
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
}

/**
 * Converts a key to the corresponding axis
 * Returns [AxisName, +1/-1]
 */
const keyToAxis = {}


/** The axis index used when fetching gamepad's data */
let gamepadToAxis = {}











/*	--------------------------
			CONTROLS
	--------------------------  */

export let Buttons = {
	A: new Button("A", "KeyX", 0), 
	B: new Button("B", "KeyC", 1)
}
export let Axes = {
	Horizontal: new Axis("Horizontal", "ArrowRight", "ArrowLeft", 0),
	Vertical: new Axis("Vertical", "ArrowDown", "ArrowUp", 1)
}

/**
 * Gravity: The speed the axis will fall back to 0
 * Sensivity: The speed the axis will reach 1, -1
 * dead: The minimum value the axis needs in order to return anything other than 0
 * { GAMEPAD: 0, KEYBOARD: 1 }
 */
let axisConfig = {
	1: {
		gravity: 0.3,
		sensivity: 0.5,
		dead: 0.1
	},
	0: {
		dead: 0.1
	}
}