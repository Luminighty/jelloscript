import GameObject from "./engine/GameObject";
import Animator from "./engine/Animator";
import { sprites } from "./Assets";
import Sprite from "./engine/Sprite";
import { Vector2 } from "./engine/Struct";
import { colliderTags } from "./Config";


class ShipAnimator extends Animator {
	/**
	 * @param {Sprite} sprite 
	 * @param {string} label 
	 */
	constructor(sprite, label) {
		super(null, sprite, sprite.getSpriteFromLabel(label, 0,0));
		this.move = Vector2.zero;
		this.label = label;
		/**
		 * @type {{
		 * 	default: [Number, Number],
		 * 	right: [Number, Number],
		 * 	left: [Number, Number],
		 * }}
		 */
		this.rects = {
			default: [0,0],
			right: [0,1],
			left: [0,2],
		};
		this.deadTime = 0;
	}

	get isMovingHorizontal() {
		return Math.abs(this.move.x) > 0.2;
	}

	get isMoving() {
		return Math.abs(this.move.x) > 0.2 || Math.abs(this.move.y) > 0.2;
	}

	get isDead() { return this.deadTime > 0; }

	animate() {
		if (this.isDead) {
			const frame = this.tick - this.deadTime;

		} else {
			this.spriteRect = this.sprite.getSpriteFromLabel(this.label, ...this.rect);
		}
	}

	get rect() {
		if (!this.isMovingHorizontal)
			return this.rects.default;

		return (this.move.x < 0) ?
			this.rects.left :
			this.rects.right;
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

export default class Ship extends GameObject {
	
	/**
	 * @param {Sprite} sprite 
	 * @param {string} label Sprite label
	 * @param {Number} health
	 */
	constructor(sprite, label, health = 100) {
		super();
		this.sprite = sprite;
		this._label = label;
		/** @type {ShipAnimator} */
		this.anim = this.addComponent(new ShipAnimator(sprite, label));
		this.lifetime = 0;
		this._health = health;
		this._maxHealth = health;
		this.thrusters = [];
		this.addThrusters();
	}

	hit(damage) {
		this.health -= damage;
		if (this.health <= 0)
			this.onDeath();
	}

	onDeath() {
		this.anim.deadTime = GameObject.tick;
	}

	/** @type {Number} */
	get health() {return this._health;}
	set health(value) { this._health = Math.min(value, this.maxHealth); }

	/** @type {Number} */
	get maxHealth() {return this._maxHealth;}
	set maxHealth(value) { this._maxHealth = value; this.health = this.health;}

	/** @type {String} */
	get label() {return this._label; }
	set label(value) {
		this._label = value;
		this.anim.label = value;
		this.clearThrusters();
		this.addThrusters();
	}

	clearThrusters() {
		for (const thruster of this.thrusters) {
			thruster.object.destroy();
		}
		this.thrusters = [];
	}

	/**
	 * Adds a thruster to the gameobject
	 * @param {Vector2} defaultOffset 
	 * @param {Vector2} leftOffset 
	 * @param {Vector2} rightOffset 
	 */
	addThruster(defaultOffset, leftOffset, rightOffset, flipX = false, flipY = false) {
		const object = GameObject.init(new Thruster(this), 10);
		object.spriteFlipX = flipX;
		object.spriteFlipY = flipY;
		object.localPosition = new Vector2(defaultOffset);
		this.thrusters.push({object, offsets: {
			default: new Vector2(defaultOffset),
			left: new Vector2(leftOffset),
			right: new Vector2(rightOffset),
		}});
	}

	/** @type {String} */
	set thrusterType(type) {
		for (const thruster of this.thrusters) {
			thruster.object.type = type;
		}
	}
	get thrusterType() {
		return this.thrusters[0].type || Thruster.types.normal;
	}

	/**
	 * @abstract
	 * Should call addThruster for each thruster
	 */
	addThrusters() {}

	/**
	 * The vector should be normalized, however it is not required
	 * @abstract
	 * @type {Vector2}
	 */
	get move() { return Vector2.zero;}

	/** @type {Number} */
	get speed() {return 1;}

	update(tick) {
		this.lifetime++;
		const move = this.move;
		this.position = this.position.add(move.multiply(this.speed));
		this.anim.move = move;
		this.updateThrusters(move);
		this.afterUpdate(tick);
	}

	/** Called every frame. This should be used instead of update */
	afterUpdate(tick) {}

	/**
	 * @param {Vector2} move The value returned from this.move
	 */
	updateThrusters(move) {
		const horizontal = move.x;
		const vertical = move.y;
	
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

	/** Sets the thrusters' localposition to match their assigned position */
	setThrusterWay(way) {
		for (const thruster of this.thrusters) {
			thruster.object.localPosition = thruster.offsets[way];
		}
	}
}