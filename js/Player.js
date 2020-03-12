import GameObject from './engine/GameObject';
import {sprites, sounds} from './Assets';
import * as Input from './Input';
import { Vector2 } from './engine/Struct';
import * as Utils from './engine/Utils';
import Animator from "./engine/Animator";
import BoxCollider from './engine/BoxCollider';
import { colliderTags } from './Config';
import Camera from './engine/Camera';
import { ParticleSystem, Particle } from "./engine/ParticleSystem";

class PlayerAnimator extends Animator {
	constructor(color) {
		super(null, sprites.playership, sprites.playership.getSpriteFromLabel(color,0,0));
		this.move = Vector2.zero;
		this.color = color;
	}

	animate() {

		if (!this.isHorizontalMoving) {
			this.spriteRect = sprites.playership.getSpriteFromLabel(this.color, 0,0);
		} else if (this.move.x < 0) {
			this.spriteRect = sprites.playership.getSpriteFromLabel(this.color, 0,2);
		} else {
			this.spriteRect = sprites.playership.getSpriteFromLabel(this.color,0,1);
		}
		/*
		const positionX = this.getKeyFrameValue(
							[0,  30,  70, 150, 200],
							[0,   5,  -2,   0,   0],
							0, Animator.PROGRESSIONS.linear
						);
		this.gameObject.localPosition = new Vector2(positionX, this.gameObject.localPosition.y);
		*/
	}

	get isHorizontalMoving() {
		return Math.abs(this.move.x) > 0.2;
	}

	get isMoving() {
		return this.move.x != 0 || this.move.y != 0;
	}

}

class Thruster extends GameObject {
	constructor(parent) {
		super();

		this.parent = parent;
		this.type = Thruster.types.normal;
		this.sprite = sprites.thruster;
	}

	update(tick) {
		const frame = Math.floor(tick / 4) % 3;
	
		this.spriteRect = this.sprite.getSpriteFromLabel(this.type, 0, frame);
	}

}
Thruster.types = {normal: "NORMAL", back: "BACK", forward: "FORWARD"};

export default class Player extends GameObject {
	constructor(input, x=120, y=120) {
		super();

		this._shipColor = Utils.decide([1,1,1], ["PURPLE", "GREEN", "BLUE"]);

		this.position = {x: x, y: y};
		this.sprite = sprites.playership;
		/** @type {PlayerAnimator} */
		this.anim = this.addComponent(new PlayerAnimator(this.shipColor));
		this.addComponent(new BoxCollider(colliderTags.player, [6,6], [0,1]));

 		/** @type {import("./engine/InputManager").Inputs} input */
		this.input = input;
		this.input.Buttons.A.onPressed(() => {this.onShoot();} );
		this.input.Buttons.B.onPressed(() => {this.onB();} );

		/** @type {{object: Thruster, offsets: {default: Vector2, left: Vector2, right: Vector2}}[]} */
		this.thrusters = [];
		this.addThrusters();
	}

	set shipColor(value) {
		this._shipColor = value;
		this.anim.color = value;
		this.addThrusters();
	}

	get shipColor() {return this._shipColor; }

	addThrusters() {
		for (const thruster of this.thrusters) {
			thruster.object.destroy();
		}

		this.thrusters = [];
		switch (this.shipColor) {
			default:
			case "PURPLE":
				this.addThruster([-6, 21], [-9, 21], [0, 21]);
				this.addThruster([6, 21], [0, 21], [9, 21]);
				break;
			case "BLUE":
				this.addThruster([0, 21], [0, 21], [0, 21]);
				break;
			case "GREEN":
				this.addThruster([0, 21], [0, 21], [0, 21]);
				break;
		}
	}

	/**
	 * @param {Vector2} defaultOffset 
	 * @param {Vector2} leftOffset 
	 * @param {Vector2} rightOffset 
	 */
	addThruster(defaultOffset, leftOffset, rightOffset) {
		const object = GameObject.init(new Thruster(this));
		object.localPosition = new Vector2(defaultOffset);
		this.thrusters.push({object, offsets: {
			default: new Vector2(defaultOffset),
			left: new Vector2(leftOffset),
			right: new Vector2(rightOffset),
		}});
	}
	set thrusterType(type) {
		for (const thruster of this.thrusters) {
			thruster.object.type = type;
		}
	}
	get thrusterType() {
		return this.thrusters[0].type || Thruster.types.normal;
	}
	setThrusterWay(way) {
		for (const thruster of this.thrusters) {
			thruster.object.localPosition = thruster.offsets[way];
		}
	}

	onShoot() {

	}

	onB() {

	}

	update(tick) {
		const horizontal = this.input.Axes.Horizontal.value;
		const vertical = this.input.Axes.Vertical.value;

		this.anim.move = new Vector2(horizontal, vertical);
		
		this.move(horizontal, vertical);
		this.updateThrusters(horizontal, vertical);
	}

	move(horizontal, vertical) {
		let pos = this.position;
		const speed = 1.5;
		pos.x += horizontal * speed;
		pos.y += vertical * speed;
		pos = Vector2.min(pos, new Vector2(620, 340));
		pos = Vector2.max(pos, new Vector2(20, 20));
		this.position = pos;
	}

	updateThrusters(horizontal, vertical) {
		if (Math.abs(vertical) < 0.2) {
			this.thrusterType = Thruster.types.normal;
		} else if (vertical < 0) {
			this.thrusterType = Thruster.types.forward;
		} else {
			this.thrusterType = Thruster.types.back;
		}

		if (Math.abs(horizontal) < 0.2) {
			this.setThrusterWay("default");
		} else if (horizontal > 0) {
			this.setThrusterWay("right");
		} else {
			this.setThrusterWay("left");
		}
	}

}
