/* jshint expr: true */
import GameObject from "./GameObject";

let currentId = 0;

export default class Component {

    constructor(gameObject, enabled = true) {
		/** @private */
		this._id = currentId++;
		/** 
		 * Gameobject to which the component is attached to
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

	/**
	 * unique id for every component instance 
	 * @type {Number} */
	get id() {return this._id;}
	/**
	 * @returns {Boolean} True if the component and the other component are the same. By default when their ID is the same
	 * @param {Component} other 
	 */
	equals(other) { return other != null && other.id == this.id; }

	/**
	 * Called when the component's state is set to enabled
	 * @public */
	onEnabled() {}
	/** 
	 * Called when the component's state is set to disabled
	 * @public
	 *  */
	onDisabled() {}
	/** 
	 * Called before the component gets destroyed
	 * @public
	 *  */
	onDestroy() {}
	/** 
	 * Called fater the constructor
	 * @public 
	 * */
	start() {}
	/** 
	 * Called every frame
	 * @public 
	 * */
	update(tick) {}

	/**
	 * Called when the gameobject starts colliding with another collider
	 * @param {Collider} other 
	 */
	onCollisionEnter(other) {}
	/**
	 * Called every frame when the gameobject collides with another collider
	 * @param {Collider} other 
	 */
	onCollisionStay(other) {}
	/**
	 * Called when the gameobject stops colliding with another collider
	 * @param {Collider} other 
	 */
	onCollisionExit(other) {}

	/**
	 * Called when the attached gameobject enters a trigger
	 * @param {Collider} other 
	 */
	onTriggerEnter(other) {}
	/**
	 * Called every frame when the attached gameobject is in a trigger
	 * @param {Collider} other 
	 */
	onTriggerStay(other) {}
	/**
	 * Called when the attached gameobject leaves a trigger
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

	/**
	 * Class-level equality check. Used if either objectA or objectB can be null
	 * @returns {Boolean} True if both are null or objectA.equals(objectB) is true
	 * @param {Component} objectA 
	 * @param {Component} objectB 
	 */
	static equals(objectA, objectB) {
		if (objectA == null)
			return objectB == null;
		return objectA.equals(objectB);
	}
}