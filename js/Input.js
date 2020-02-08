import { Axis, Button, Mouse, AxisKeys } from "./engine/InputManager";
import { addTouchInput, FromPlayer, initControllers } from "./engine/Controller";

/** @typedef {Buttons} Button */
export const Buttons = {
	A: new Button(), 
	B: new Button()
};
/** @typedef {Axes} Axis */
export const Axes = {
	Horizontal: new Axis(),
	Vertical: new Axis()
};


 /** @type {[import("./engine/InputManager").KeyboardControls]} */
export const DefaultKeyboardControls = [
	{
		Buttons: {
			A: "KeyX",
			B: "KeyC"
		},
		Axes: {
			Horizontal: AxisKeys("ArrowRight", "ArrowLeft"),
			Vertical:   AxisKeys("ArrowDown"   , "ArrowDown")
		}
	},
	{
		Buttons: {
			A: "KeyF",
			B: "KeyG"
		},
		Axes: {
			Horizontal: AxisKeys("ArrowRight", "ArrowLeft"),
			Vertical:   AxisKeys("KeyS"   , "KeyW")
		}
	}
];

/** @typedef {GamepadControls} GamepadControls */
export const DefaultGamepadControls = {
	Buttons: {
		A: 0,
		B: 1
	},
	Axes: {
		Horizontal: 0,
		Vertical: 1
	}
};


/**
 * @typedef {Object} TouchInputLayout
 * @property {("Axis"|"Button")} type The touch input's type
 * @property {(string[]|string)} key The corresponding button or axes
 * @property {string} image The path to the button's or axis' image
 * @property {string} css The css the element will have
 */
const TouchInputs = [
	{
		type: "Axis",
		key: ["Horizontal", "Vertical"],
		image: "./media/input/axis.png",
		css: `
			left: 100px;
			bottom: 100px;
			position: absolute;
			background-color: #ffffff3d;
			border-radius: 9999px;
			z-index: 100;`
	},
	{
		type: "Button",
		key: "A",
		image: "./media/input/btn_a.png",
		css: `
			right: 150px;
			bottom: 50px;
			position: absolute;
			background-color: #ffffff3d;
			border-radius: 9999px;
			z-index: 100;`
	},
	{
		type: "Button",
		key: "B",
		image: "./media/input/btn_b.png",
		css: `
			right: 50px;
			bottom: 50px;
			position: absolute;
			background-color: #ffffff3d;
			border-radius: 9999px;
			z-index: 100;`
	}
];

addTouchInput(TouchInputs);

/**
 * Gravity: The speed the axis will fall back to 0
 * Sensivity: The speed the axis will reach 1, -1
 * dead: The minimum value the axis needs in order to return anything other than 0
 * radius: The axis radius for touch inputs above which the axis value will be capped 1
 * { GAMEPAD: 0, KEYBOARD: 1, TOUCH: 2 }
 */
/** @typedef {Object} axisConfig */
export const axisConfig = {
	0: {	// Gamepad
		dead: 0.1
	},
	1: {	// Keyboard
		gravity: 0.3,
		sensivity: 0.5,
		dead: 0.1
	},
	2: {	// Touch
		dead: 0.1,
		radius: 50
	}
};

/** @typedef {Object} mouseConfig */
export const mouseConfig = {
	allowOutsideMousePosition: false
};




// Re-exporting for easier access
export {Mouse, FromPlayer};
initControllers();