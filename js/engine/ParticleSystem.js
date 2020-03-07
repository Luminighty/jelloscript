import Component from "./Component";
import { Vector2, Rect } from "./Struct";
import GameObject from "./GameObject";
import Sprite from "./Sprite";

class ParticleObject extends GameObject {
	/**
	 * 
	 * @param {Particle} particle 
	 */
	constructor(particle, parent) {
		super(particle.size);
		this.parent = parent;
		/** @type {Vector2} */
		this.localPosition = particle.position.clone();
		/** @type {Vector2} */
		this.velocity = particle.velocity.clone();
		/** @type {Vector2} */
		this.gravity = particle.gravity.clone();
		this.lifespan = particle.lifespan;
		this._currentLifeSpan = 0;
		this.sprite = particle.sprite;
		this.spriteRect = (particle.spriteRect) ? particle.spriteRect : this.spriteRect;
		this.spriteAlphaCallback = particle.spriteAlphaCallback;
	}

	update(tick) {
		this.localPosition = this.localPosition.add(this.velocity);
		this.velocity = this.velocity.add(this.gravity);
		this._currentLifeSpan++;
		if (this.spriteAlphaCallback)
			this.spriteAlpha = this.spriteAlphaCallback(this._currentLifeSpan / this.lifespan);
		if (this._currentLifeSpan >= this.lifespan)
			this.destroy();
	}
}

export class Particle {

	/**
	 * 
	 * @param {{
	 * 	position: Vector2, 
	 * 	velocity: Vector2, 
	 * 	gravity: Vector2, 
	 * 	size: Vector2,
	 * 	lifespan: Number,
	 * 	sprite: Sprite,
	 * 	spriteRect: Rect,
	 * 	spriteAlpha: callback,
	 * 	renderingLayer: Number}} options 
	 * 	
	 */
	constructor(options) {
		if (options == null)
			options = {};
		this.size     = (options.size     != null) ? new Vector2(options.size)     : Vector2.one;
		this.position = (options.position != null) ? new Vector2(options.position) : Vector2.zero;
		this.velocity = (options.velocity != null) ? new Vector2(options.velocity) : Vector2.zero;
		this.gravity  = (options.gravity  != null) ? new Vector2(options.gravity)  : Vector2.zero;
		this.lifespan = (options.lifespan) || 60;
		this.sprite = options.sprite;
		this.spriteRect = options.spriteRect;
		this.renderingLayer = options.renderingLayer || 0;
		this.spriteAlphaCallback = options.spriteAlpha;
	}

	spawn(parent) {
		return GameObject.init(new ParticleObject(this, parent), this.renderingLayer);
	}
}

export class ParticleSystem extends Component {

	/**
	 * 
	 * @param {GameObject} gameObject The parent element for the component
	 * @param {{particles: Particle[], delay: Number, spawnOffset: Vector2}} options 
	 * @param {Boolean} enabled 
	 */
	constructor(options, enabled = false) {
		super(null, enabled);

		/** @type {Particle[]} */
		this.particles = options.particles || [];
		this.delay = options.delay;
		this.spawnOffset = new Vector2(options.spawnOffset);
		this._currentDelay = 0;
	}

	/** 
	 * Shorthand for particleSystem.particles.push(particle)
	 * @param {Particle} particle
	 */
	addParticle(particle) {
		this.particles.push(particle);
	}

	update(tick) {
		this._currentDelay++;
		if (this.delay > this._currentDelay)
			return;
		this._currentDelay = 0;
		console.log("Spawn");
		
		const particleIndex = Math.floor(Math.random() * this.particles.length);
		const obj = this.particles[particleIndex].spawn(this.gameObject);
		const offset = this.getOffset();
		obj.position = obj.position.add(offset);
	}

	/**
	 * Calculates the offset based on spawnOffset
	 * The x and y components go both way
	 */
	getOffset() {
		const x = this.spawnOffset.x;
		const y = this.spawnOffset.y;

		const offsetX = (Math.random() * x * 2) - x;
		const offsetY = (Math.random() * y * 2) - y;
		return new Vector2(offsetX, offsetY);
	}
}