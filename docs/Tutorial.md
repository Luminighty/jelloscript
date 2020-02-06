# Quick Start

This engine uses [GameObjects](#GameObjects) to run the game, somewhat similary to Unity.

To get you started follow this walking simulator:

Create a script called `player.js` in the js folder:
```javascript
import GameObject from './engine/GameObject';
import {sprites} from './engine/Sprite';
import * as Input from './engine/input';

export default class Player extends GameObject {
	constructor() {
		super();
		this.position = {x: 20, y: 20}
		this.sprite = sprites.player;
	}

	update(tick) {
		this.position.x += Input.Axes.Horizontal.value;
		this.position.y += Input.Axes.Vertical.value;
	}
}
```

Edit the Main function in `main.js` (found in /js/engine/):
```javascript
function Main() {
	GameObject.init(new Player());
}
```

Add a player sprite in `sprites.js` (found in /js/engine/):
```javascript
// look for the sprites variable and add this
export const sprites = {
	player: new Sprite("./player.png", [16,16])
};
```

Put the player image next to the `index.html` file (found in readme_img).

<span style="background-color: lightgray; padding: 5px 5px 2px 5px; border-radius: 10px">
	<a href="./img/player.png" target="_blank">
		<img src="./img/player.png" height="16" width="16" alt="player.png" />
	</a>
</span>

Your file structure should look similar to this:
 - `index.html`
 - `player.png`
 - `js/`
   - `player.js`
   - `engine/`
     - `main.js`
	 - `sprites.js`
	 - `...`


[Back to Sections](../ReadMe.md)