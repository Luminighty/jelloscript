import GameObject from './engine/GameObject';
import {sprites, sounds} from './Assets';
import * as Input from './Input';
import { Vector2 } from './engine/Struct';
import * as Utils from './engine/Utils';
import Animator from "./engine/Animator";
import BoxCollider from './engine/BoxCollider';
import { colliderTags } from './Config';
import Camera from './engine/Camera';

class PlayerAnimator extends Animator {
	constructor(gameObject) {
		super(gameObject, sprites.player, sprites.player.getSpriteRect(0,0));
		this.move = Vector2.zero;
	}

	animate() {
		const isMoving = this.isMoving;

		if (isMoving && Math.floor(this.tick / 10) % 2 == 0) {
			this.spriteRect = sprites.player.getSpriteRect(1,0);
		} else {
			this.spriteRect = sprites.player.getSpriteRect(0,0);
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

	get isMoving() {
		return this.move.x != 0 || this.move.y != 0;
	}

}

export default class Player extends GameObject {
	constructor(input, x=10, y=10) {
		super();
		this.position = {x: x, y: y};
		this.sprite = sprites.player;
		this.anim = this.addComponent(new PlayerAnimator());
		this.addComponent(new BoxCollider(colliderTags.player, [6,6], [0,1]));
		this.addComponent(new Camera());
		sounds.MUSIC.test.volume = 0.1;

 		/** @type {import("./engine/InputManager").Inputs} input */
		this.input = input;
		this.input.Buttons.A.onPressed(this.onShoot);
		this.input.Buttons.B.onPressed(this.onB);
		this.input.Buttons.A.onReleased(() => {
			//console.log("A released");
		});
		this.input.Buttons.B.onReleased(() => {
			//console.log("B released");
		});
	}

	onShoot() {
		//console.log("A pressed");
	}

	onB() {
		//console.log("B pressed");
	}

	update(tick) {
		
		const horizontal = this.input.Axes.Horizontal.value;
		const vertical = this.input.Axes.Vertical.value;

		this.anim.move = new Vector2(horizontal, vertical);
		
		//console.log(`${horizontal} - ${vertical}`);
		

		let pos = this.position;
		pos.x += horizontal;
		pos.y += vertical;
		this.position = pos;
		if (horizontal != 0)
			this.spriteFlipX = horizontal < 0;

		if (Input.Buttons.A.isPressed)
			sounds.SOUND.test.playOnce();
	}

}
