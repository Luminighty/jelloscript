import Ship from "./Ship";
import { asFunction } from "./engine/Utils";
import { Vector2, Rect } from "./engine/Struct";
import GameObject from "./engine/GameObject";
import Sprite from "./engine/Sprite";
import { sprites } from "./Assets";
import BoxCollider from "./engine/BoxCollider";
import { colliderTags } from "./Config";

/** @public */
export default class Enemy extends Ship {

	/**
	 * @param {Vector2} position
	 * @param {Object} options
	 * @param {Vector2 | function(Number):Vector2} options.move
	 * @param {Number | function(Number):Vector2} options.speed
	 * @param {Sprite | function(Number):Sprite} options.sprite
	 * @param {Rect | function(Number):Rect} options.spriteRect
	*/
	constructor(position, options) {
		const _sprite = asFunction(options.sprite, sprites.enemies.basic);
		super(_sprite(0), "BASIC", 50);
		
		if (options == null)
			options = {};
		this.spriteGetter = _sprite;
		this.spriteRectGetter = asFunction(options.spriteRect, sprites.enemies.basic.getSpriteRect());
		this.position = position;
		/** @type {function():Vector2}*/
		this._move = asFunction(options.movement, new Vector2(0, 1));
		/** @type {function():Number}*/
		this._speed = asFunction(options.speed, 1);

		this.addComponent(new BoxCollider(colliderTags.enemy, [20, 20], [0,0], false, true));
	
		//this.sprite = this.spriteGetter(0);
		this.spriteRect = this.spriteRectGetter(0);
		this.spriteFlipY = true;
		this.destroy(5000);
	}



	get speed() {return this._speed(this.lifetime);}

	get move() { return this._move(this.lifetime); }
}




/** @public */
export class Spawner extends GameObject {

	constructor() {
		super();
		this.hidden = true;
		this.currentDelay = this.delay;
	}

	update() {
		this.currentDelay--;
		if (this.currentDelay > 0)
			return;
		
		GameObject.init(new Enemy(this.position, {}), 20);
		this.currentDelay = this.delay;
	}


	get position() {
		return Vector2.right.multiply(Math.random() * 580 + 30);
	}

	get delay() {
		return Math.floor(Math.random() * 50 + 10);
	}

}

