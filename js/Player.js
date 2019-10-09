import GameObject from './engine/GameObject';
import {sprites} from './engine/Sprites';
import * as Input from './engine/Input';

export default class Player extends GameObject {
	constructor(x=10, y=10) {
		super();
		this.position = {x: x, y: y}
		this.sprite = sprites.player;
	}

	update(tick) {
		//console.log(this);
		this.position.x += Input.Axes.Horizontal.value;
		this.position.y += Input.Axes.Vertical.value;

		if (Input.Buttons.A.isPressed)
			console.log("A");
		
		if (Input.Buttons.B.isPressed)
			console.log("B");
			
	}
}