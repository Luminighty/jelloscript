import Sprite, {sprites} from './Sprites';
import * as Input from './Input';
import {Vector2, Rect} from './Struct';

export let gameObjects = [];

export default class GameObject {
	/**
	 * Size of the sprite
	 */
	size = {x: 16,y: 16}

	/**
	 * @type GameObject
	 * The parent object for this gameobject
	 */
	parent = null;
	/**
	 * @type [Component]
	 * The object's components
	 */
	components = [];

	constructor(enabled = true, hidden = false) {
		this._position = new Vector2(0,0);
		this._enabled = enabled;
		this._hidden = hidden;
		this._spriteRect = new Rect(0,0,this.size.x,this.size.y);
		this._spriteFlip = {x:false, y:false};
	}

	update(tick) {}



	get position() {
		if(this.parent == null)
			return this.localPosition;
		
	}

	set position(value) {

	}

	get localPosition() {return this._position;}
	set localPosition(value) {this._position = value;}

	get enabled() {return this._enabled;}
	set enabled(value) {
		if (value == this._enabled)
			return;
		(value) ? this.onEnabled() : this.onDisabled();
		this._enabled = value;
	}
	onEnabled() {}
	onDisabled() {}

	get hidden() {return this._hidden;}
	set hidden(value) {
		if (value == this._hidden)
			return;
		(value) ? this.onHidden() : this.onShown();
		this._hidden = value;
	}
	onHidden() {}
	onShown() {}

	/**
	 * @returns Sprite
	 */
	get sprite() {return this._sprite;}
	set sprite(sprite) {this._sprite = sprite;}
	/**
	 * @returns Rect
	 */
	get spriteRect() {return this._spriteRect;}
	set spriteRect(spriteRect) {this._spriteRect = spriteRect;}

	get spriteFlipX() 		{return this._spriteFlip.x;}
	set spriteFlipX(value)  {this._spriteFlip.x = value;}
	get spriteFlipY() 		{return this._spriteFlip.y;}
	set spriteFlipY(value)  {this._spriteFlip.y = value;}

	static init(object) {
		gameObjects.push();
	}
}

import {decide} from './Utils';
export class Grass extends GameObject {
	constructor(x=0,y=0,label="NORMAL") {
		super();
		this.position = {x: x, y:y}
		this.sprite = sprites.grass;
		this.spriteRect = this.sprite.getSpriteFromLabel(label, 0, decide([35,10,3]));

	}
	
	update(tick) {
	}
}
