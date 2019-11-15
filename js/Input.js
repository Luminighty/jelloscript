import { Axis, Button, Mouse } from "./engine/InputManager";

/** @enum {Button} */
export const Buttons = {
	A: new Button("A", "KeyX", 0), 
	B: new Button("B", "KeyC", 1)
};
/** @enum {Axis} */
export const Axes = {
	Horizontal: new Axis("Horizontal", "ArrowRight", "ArrowLeft", 0),
	Vertical: new Axis("Vertical", "ArrowDown", "ArrowUp", 1)
};

/**
 * @typedef TouchInput
 * @type {object}
 * @property {("Axis"|"Button")} type The touch input's type
 * @property {(string[]|string)} key The corresponding button or axes
 * @property {string} image The path to the button's or axis' image
 * @property {string} css The css the element will have
 */
export const TouchInputs = [
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

/**
 * Gravity: The speed the axis will fall back to 0
 * Sensivity: The speed the axis will reach 1, -1
 * dead: The minimum value the axis needs in order to return anything other than 0
 * radius: The axis radius for touch inputs above which the axis value will be capped 1
 * { GAMEPAD: 0, KEYBOARD: 1, TOUCH: 2 }
 */
export const axisConfig = {
	1: {
		gravity: 0.3,
		sensivity: 0.5,
		dead: 0.1
	},
	0: {
		dead: 0.1
	},
	2: {
		dead: 0.1,
		radius: 50
	}
};

export const mouseConfig = {
	allowOutsideMousePosition: false
};

export {Mouse};