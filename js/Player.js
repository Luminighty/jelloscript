import GameObject from './engine/GameObject';
import {sprites, sounds} from './Assets';
import * as Input from './Input';
import { Vector2 } from './engine/Struct';
import * as Utils from './engine/Utils';
import BoxCollider from './engine/BoxCollider';
import { colliderTags } from './Config';
import Ship from './Ship';

export default class Player extends Ship {
	constructor(input, label, x=120, y=120) {
		super(sprites.playership, (label) ? label : Utils.decide([1,1,1], ["PURPLE", "GREEN", "BLUE"]));

		/** @type {Vector2} */
		this.position = {x: x, y: y};
		
		this.addComponent(new BoxCollider(colliderTags.player, [6,6], [0,1]));

 		/** @type {import("./engine/InputManager").Inputs} input */
		this.input = input;

		this.input.Buttons.A.onPressed(() => {this.onShoot();} );
		this.input.Buttons.B.onPressed(() => {this.onBack();} );
		this.shootDelay = 0;
	}

	addThrusters() {
		switch (this.label) {
			default:
			case "PURPLE":
				this.addThruster([-6, 21], [-9, 21], [0, 21]);
				this.addThruster([6, 21], [0, 21], [9, 21]);
				break;
			case "BLUE":
				this.addThruster([0, 19], [0, 19], [0, 19]);
				break;
			case "GREEN":
				this.addThruster([0, 21], [0, 21], [0, 21]);
				break;
		}
	}


	onShoot() {
		if (this.shootDelay > 0) {
			sounds.SOUND.wrong.playOnce();
			return;
		}
		this.shootDelay = 60;
		sounds.SOUND.shoot.playOnce();
	}

	onBack() {

	}

	get move() {
		const horizontal = this.input.Axes.Horizontal.value;
		const vertical = this.input.Axes.Vertical.value;

		const vector = new Vector2(horizontal, vertical);
		return (vector.sqrMagnitude > 1) ? vector.normalized : vector;
	}

	get speed() { return 1.5; }

	afterUpdate() {
		let pos = this.position;
		pos = Vector2.min(pos, new Vector2(620, 340));
		pos = Vector2.max(pos, new Vector2(20, 20));
		this.position = pos;

		this.shootDelay--;
	}

}
