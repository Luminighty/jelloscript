/* jshint expr: true */
import GameObject from "./GameObject";

let currentId = 0;

export default class Component {

    constructor(gameObject, enabled = true) {
		/** @private */
		this._id = currentId++;
		/** 
		 * @type {GameObject}
		 */
		this.gameObject = gameObject;
		/** @private */
		this._enabled = enabled;
		this.start();
	}

	/** @type {Boolean} */
	get enabled() {return this._enabled; }
	set enabled(enabled) {
		if(this._enabled != enabled)
			(enabled) ? this.onEnabled() : this.onDisabled();
		this._enabled = enabled;

	}

	/** @type {Number} */
	get id() {return this._id;}
	equals(other) { return other != null && other.id == this.id; }

	/** @public */
	onEnabled() {}
	/** @public */
	onDisabled() {}
	/** @public */
	onDestroy() {}
	/** @public */
	start() {}
	/** @public */
	update(tick) {}

	/**
	 * 
	 * @param {Collider} other 
	 */
	onCollisionEnter(other) {}
	/**
	 * 
	 * @param {Collider} other 
	 */
	onCollisionStay(other) {}
	/**
	 * 
	 * @param {Collider} other 
	 */
	onCollisionExit(other) {}

	/**
	 * 
	 * @param {Collider} other 
	 */
	onTriggerEnter(other) {}
	/**
	 * 
	 * @param {Collider} other 
	 */
	onTriggerStay(other) {}
	/**
	 * 
	 * @param {Collider} other 
	 */
	onTriggerExit(other) {}


	/**
	 * Destroys the gameObject
	 * @param {GameObject} object 
	 * @param {Number} delay Delay before deleting the gameObject
	 */
	static destroy(object, delay=0) {
		const gameObject = object.gameObject;
		const des = function() {
			const layer = gameObjects[gameObject.updateLayer];
			layer.splice(layer.indexOf(gameObject), 1);
			for (const component of gameObject.components)
				if (component != null)
					component.onDestroy();
			gameObject.onDestroy();
		};
		if (delay <= 0) {
			des();
		} else { setTimeout(() => { des(); }, delay); }
	}
}