import Component from "./Component";
import { Vector2, Rect } from "./Struct";
import GameObject from "./GameObject";
import Sprite from "./Sprite";
import EventHandler from "./EventHandler";
import { asFunction } from "./Utils";

class ParticleObject extends GameObject {
	/**
	 * 
	 * @param {Particle} particle 
	 * @param {EventHandler} listeners
	 */
	constructor(particle, parent, listeners) {
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

		this._listeners = listeners;
	}

	update(tick) {
		this.localPosition = this.localPosition.add(this.velocity);
		this.velocity = this.velocity.add(this.gravity);
		this._currentLifeSpan++;
		if (this.spriteAlphaCallback)
			this.spriteAlpha = this.spriteAlphaCallback(this._currentLifeSpan / this.lifespan);
		if (this._currentLifeSpan >= this.lifespan)
			this.destroy();
		this._listeners.call("update", this);
	}

	/** 
	 * The current percentage of the particle's life,
	 * 1.0 is dead,
	 * 0.0 is newborn
	 * @type {Number} */
	get lifePercent() {
		return this._currentLifeSpan / this.lifespan;
	}
}

export class Particle {

	/**
	 * 
	 * @param {{
	 * 	position: Vector2|Function, 
	 * 	velocity: Vector2|Function, 
	 * 	gravity: Vector2|Function, 
	 * 	size: Vector2|Function,
	 * 	lifespan: Number|Function,
	 * 	sprite: Sprite|Function,
	 * 	spriteRect: Rect|Function,
	 * 	spriteAlpha: Number|Function,
	 * 	renderingLayer: Number}} options 
	 * 	
	 */
	constructor(options) {
		if (options == null)
			options = {};
		/** @private @type {Function} */
		this._size     = asFunction(options.size, Vector2.one);
		/** @private @type {Function} */
		this._position = asFunction(options.position, Vector2.one);
		/** @private @type {Function} */
		this._velocity = asFunction(options.velocity, Vector2.one);
		/** @private @type {Function} */
		this._gravity  = asFunction(options.gravity, Vector2.one);
		/** @private @type {Function} */
		this._lifespan = asFunction(options.lifespan, 60);
		/** @private @type {Function} */
		this._sprite = asFunction(options.sprite);
		/** @private @type {Function} */
		this._spriteRect = asFunction(options.spriteRect);
		/** @private @type {Function} */
		this._renderingLayer = asFunction(options.renderingLayer, 0);
		/** @private @type {Function} */
		this._spriteAlpha = asFunction(options.spriteAlpha, 1.0);

		this._listeners = new EventHandler();
	}

	setValue(key, value) {
		this[key] = asFunction(value);
	}

	/** @type {Vector2} */
	get size() {return this._size(); }
	/** @type {Vector2} */
	get position() {return this._position(); }
	/** @type {Vector2} */
	get velocity() {return this._velocity(); }
	/** @type {Vector2} */
	get gravity() {return this._gravity(); }
	/** @type {Number} */
	get lifespan() {return this._lifespan(); }
	/** @type {Sprite} */
	get sprite() {return this._sprite(); }
	/** @type {Rect} */
	get spriteRect() {return this._spriteRect(); }
	/** @type {Number} */
	get renderingLayer() {return this._renderingLayer(); }
	/** @type {Number} */
	get spriteAlpha() {return this._spriteAlpha(); }

	/** @param {Vector2|Function} value */
	set size(value) 			{this._size = asFunction(value); }
	/** @param {Vector2|Function} value */
	set position(value) 		{this._position = asFunction(value); }
	/** @param {Vector2|Function} value */
	set velocity(value) 		{this._velocity = asFunction(value); }
	/** @param {Vector2|Function} value */
	set gravity(value) 			{this._gravity = asFunction(value); }
	/** @param {Number|Function} value */
	set lifespan(value) 		{this._lifespan = asFunction(value); }
	/** @param {Sprite|Function} value */
	set sprite(value) 			{this._sprite = asFunction(value); }
	/** @param {Rect|Function} value */
	set spriteRect(value) 		{this._spriteRect = asFunction(value); }
	/** @param {Number|Function} value */
	set renderingLayer(value)	{this._renderingLayer = asFunction(value); }
	/** @param {Number|Function} value */
	set spriteAlpha(value)		{this._spriteAlpha = asFunction(value); }

	get values() {
		return {
			size: new Vector2(this.size),
			position: new Vector2(this.position),
			velocity: new Vector2(this.velocity),
			gravity: new Vector2(this.gravity),
			lifespan: this.lifespan,
			sprite: this.sprite,
			spriteRect: this.spriteRect,
			renderingLayer: this.renderingLayer,
			spriteAlpha: this.spriteAlpha
		};
	}

	/**
	 * @callback ParticleUpdateCallback
	 * @param {ParticleObject} particle
	 */

	/**
	 * Calls the callback on every frame for the particle 
	 * @param {ParticleUpdateCallback} callback 
	 */
	onUpdate(callback) {
		this._listeners.on("update", callback);
	}

	spawn(parent) {
		return GameObject.init(new ParticleObject(this.values, parent, this._listeners), this.renderingLayer);
	}
}

export class ParticleSystem extends Component {

	/**
	 * @callback indexCallback
	 * @param {Number} length The length of the array to pick from
	 * @returns {Number} The index for the next particle in the particle array
	 */


	/**
	 * 
	 * @param {GameObject} gameObject The parent element for the component
	 * @param {{
	 * 	particles: Particle[] | Function,
	 * 	nextIndex: indexCallback,
	 * 	delay: Number | Function}} options 
	 * @param {Boolean} enabled 
	 */
	constructor(options, enabled = false) {
		super(null, enabled);

		/** @type {Particle[]} */
		this.particles = asFunction(options.particles, []);
		this.nextIndex = options.nextIndex || ((length) => Math.floor(Math.random() * length));
		this.delay = asFunction(options.delay, 20);
		this._currentDelay = this.delay();
	}

	/** 
	 * Shorthand for particleSystem.particles.push(particle)
	 * @param {Particle} particle
	 */
	addParticle(particle) {
		this.particles.push(particle);
	}

	update(tick) {
		this._currentDelay--;
		if (this._currentDelay > 0)
			return;
		this._currentDelay = this.delay();
		
		const particleIndex = this.nextIndex(this.particles.length);
		this.particles()[particleIndex].spawn(this.gameObject);
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