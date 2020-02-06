# Input

The input manager contains the input keys the player can use.
To configure it open `input.js` and scroll to the bottom.
## Buttons
A dictionary consisting the possible keys. Just insert new entries to add more buttons.
```javascript
/*	
	name : String
			Has to be the same as the button's key in the Buttons dictionary
	defaultKey : KeyboardEvent.code
			The default keyboard setting.
	defaultButton : Number
			The default index for the gamepad's buttons
*/
let btn = new Button(name, defaultKey, defaultButton);

export let Buttons = {
	A: new Button("A", "KeyX", 0), 
	B: new Button("B", "KeyC", 1),
	X: new Button("X", "KeyS", 2),
	Y: new Button("Y", "KeyD", 3),
}
```

## Axes
A dictionary consisting the possible axes. Just insert new entries to add more axes.
```javascript
/*	
	name : String
			Has to be the same as the axis' key in the Axes dictionary
	positiveKey : KeyboardEvent.code
			The default key for the positive value
	negativeKey : KeyboardEvent.code
			The default key for the negative value
	gamepadAxis : Number
			The index of the gamepad's axes array
*/
let axis = new Axis(name, positiveKey, negativeKey, gamepadAxis);

export let Axes = {
	Horizontal: new Axis("Horizontal", "ArrowRight", "ArrowLeft", 0),
	Vertical: new Axis("Vertical", "ArrowDown", "ArrowUp", 1)
}
```

## axisConfig

```javascript
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
```
Smaller numbers mean faster in this context
- gravity: The speed the axis will fall back to 0 
- sensivity: The speed the axis will reach 1, -1
- dead: The minimum value the axis needs in order to return anything other than 0

The first key represents the input mode where
{ GAMEPAD: 0, KEYBOARD: 1 }

<sub>See also [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code), [GamepadButton](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/axes)</sub>

[Back to Sections](../ReadMe.md)