
# GameObject
The super class for every GameObject

## Properties
| Name | Description | Type |
| --- | --- | --- |
| position | The position of the object  | [Vector2](../structs/Vector2.md) |
| size | The size of the object, this is used for collision and rendering by default  | [Vector2](../structs/Vector2.md) |
| enabled | If set to false the object won't call Update() and won't be shown in the game | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
| hidden | If set to true the object won't be rendered, however it'll still call the Update() method | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
| sprite | The sprite to be rendered | [Sprite](./Sprite.md)
| spriteRect | Stores the sprite's rect, should be updated when sprite is called | [Rect](../structs/Rect.md)
| spriteFlipX | True if the sprite should be flipped on the X axis | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
| spriteFlipY | True if the sprite should be flipped on the Y axis | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
## Methods
| Name | Description | Returns |
| --- | --- | --- |
| update(tick) | Called every tick | |
| onEnabled() | Called whenever the object was active and got disabled. Note it isn't called on initialization. Use the constructor for that |
| onDisabled() | Called whenever the object was deactive and got activated |
| onHidden() | Called whenever the object was shown and got hidden |
| onShown() | Called whenever the object was hidden and got shown |
| onDestroy() | Called whenever the object was destroyed |
| GameObject.init(GameObject) | Initializes a gameobject and adds it to the gameObjects list |

## Usage Example:
```javascript
import GameObject from './engine/GameObject';
import {sprites} from './engine/Sprite';
import * as Input from './engine/input';

// It isn't necessary to export it, however it's very likely that you'll have to access it at one point in a different file
export default class Player extends GameObject {
	constructor() {
		super(); // the super constructor should always be called
		this.position = {x: 10, y: 10};
		this.sprite = sprites.player;
	}

	// Called every tick
	update(tick) {
		this.position.x += Input.Axes.Horizontal.value;
		this.position.y += Input.Axes.Vertical.value;
	}

	onEnabled() {
		console.log("Player enabled");
	}
}

// initializing a player object
GameObject.init(new Player());
```

<sub>See also [Sprite](./Sprite.md), [Vector2](../structs/Vector2.md), [Rect](../structs/Rect.md),  [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</sub>

[Back to Sections](../../ReadMe.md)