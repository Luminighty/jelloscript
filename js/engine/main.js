import GameObject, {gameObjects, Grass} from './GameObject';
import Player from './../Player';

// Canvas settings
const canvasConfig = {
	size: {x: 1600, y: 900},
	scale: {x: 4, y: 4}
}

function Main() {
	// code here
}

// the main loop can be stopped using clearInterval(window.main)





























/*
	Engine Main function
*/

import * as Input from './Input';
function $(query) {return document.querySelector(query);}
function $$(query) {return document.querySelectorAll(query);}

// Main

for(let i = 0; i < 25; i++) 
	for(let j = 0; j < 15; j++) {
		gameObjects.push(new Grass(i*16,j*16, "NORMAL"));
	}

gameObjects.push(new Player());
const main = (function() {
	const canvasElement = $("#mainCanvas");
	const canvas = canvasElement.getContext("2d");
	canvasElement.height = canvasConfig.size.y;
	canvasElement.width = canvasConfig.size.x;
	canvas.scale(canvasConfig.scale.x,canvasConfig.scale.y);
	canvas.imageSmoothingEnabled = false;
	let tick = 0;
	canvas.save();
	Main();
	return setInterval(() => {
		Update(tick);
		Draw(canvas, tick)
		Input.update();
		tick++;
	}, 1000/60);
} ());
window.main = main;

function Update(tick) {
	for (const gameObject of gameObjects)
		if (gameObject.enabled)
			gameObject.update(tick);
}

function Draw(canvas, tick) {

	for (const gameObject of gameObjects) {
		try {
			if(gameObject.hidden || !gameObject.enabled)
				continue;
			

			const sprite = gameObject.sprite;
			if (sprite == null)
				continue;
			
			// TODO: Implement Flip rendering
			const flipX = (gameObject.spriteFlipX ? -1 : 1) * canvasConfig.size.x;
			const flipY = (gameObject.spriteFlipY ? -1 : 1) * canvasConfig.size.y;
			
			const rect = gameObject.spriteRect;
			const size = gameObject.size;
			const position = gameObject.position;
			
			//canvas.scale(flipX, flipY);
			
			canvas.drawImage(sprite.element, rect.x, rect.y, rect.w, rect.h, position.x, position.y, size.x, size.y);	
			canvas.restore();
		} catch (error) {
			console.log(error);
		}
	}
}
