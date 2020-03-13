import GameObject from "./engine/GameObject";
import { Vector2 } from "./engine/Struct";
import { sprites } from "./Assets";
import BoxCollider from "./engine/BoxCollider";
import { colliderTags } from "./Config";


export default class Missile extends GameObject {

	/**
	 * @param {String} label 
	 * @param {GameObject} ship 
	 * @param {Vector2} offset 
	 * @param {Number} damage
	 */
	constructor(label, ship, offset, damage = 10) {
		super();
		this.sprite = sprites.missile;
		this.spriteRect = this.sprite.getSpriteFromLabel(label);
		this.position = ship.position.add(new Vector2(offset));

		this.damage = damage;
		
		this.destroy(this.lifeTime);
		this.addComponent(new BoxCollider(colliderTags.playerMissile, [5, 8], [0,0], false, true));
	}

	get lifeTime() {return 10000;}

	update(tick) {
		this.position = this.position.add(this.velocity);
	}

	get velocity() {
		return new Vector2(0, -4);
	}

	/** @param {import("./engine/Collider").Collider} other */
	onTriggerEnter(other) {
		if (other.tag == colliderTags.enemy) {
			other.gameObject.hit(this.damage);
			this.destroy();
		}
	}

}