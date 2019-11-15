import GameObject from './engine/GameObject';
import {sprites, sounds} from './Assets';
import * as Input from './Input';
import { Vector2 } from './engine/Struct';
import * as Utils from './engine/Utils';
import Animator from "./engine/Animator";
import BoxCollider from './engine/BoxCollider';
import { colliderTags } from './Config';
import { onAnyKeyboardKey, onAnyGamepadButtons, setKeyboardKey, setKeyboardKeyOnNextPress } from './engine/InputManager';
import Camera from './engine/Camera';

class PlayerAnimator extends Animator {
	constructor(gameObject) {
		super(gameObject, sprites.player, sprites.player.getSpriteRect(0,0));


	}

	animate() {
		const isMoving = this.isMoving;

		if (isMoving && Math.floor(this.tick / 10) % 2 == 0) {
			this.spriteRect = sprites.player.getSpriteRect(1,0);
		} else {
			this.spriteRect = sprites.player.getSpriteRect(0,0);
		}
		const positionX =   this.getKeyFrameValue(
							[0,  30,  70, 150, 200],
							[0, 5, -2,   0,   0],
							0, Animator.PROGRESSIONS.linear
						);
		//this.gameObject.localPosition = new Vector2(positionX, this.gameObject.localPosition.y);
		
	}

	get isMoving() {
		return Input.Axes.Horizontal.value != 0 || Input.Axes.Vertical.value != 0;
	}

}

export default class Player extends GameObject {
	constructor(x=10, y=10) {
		super();
		this.position = {x: x, y: y};
		this.sprite = sprites.player;
		this.addComponent(new PlayerAnimator());
		this.addComponent(new BoxCollider(colliderTags.player, [6,6], [0,1]));
		this.addComponent(new Camera());
		sounds.MUSIC.test.volume = 0.1;
		//sounds.MUSIC.test.play();
	}

	update(tick) {
		
		const horizontal = Input.Axes.Horizontal.value;
		const vertical = Input.Axes.Vertical.value;

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
