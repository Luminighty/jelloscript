import { canvasConfig } from '../Config';
import * as InputManager from './InputManager';
import * as Controller from './Controller';
import { initControllers } from "./Controller";
import { Vector2 } from './Struct';
import GameObject, {gameObjects} from './GameObject';
import { currentDebugs } from "./Debug";
import Camera from "./Camera";

function $(query) {return document.querySelector(query);}
function $$(query) {return document.querySelectorAll(query);}

/** @type HTMLCanvasElement */
const canvasElement = $(canvasConfig.canvasQuery);

/**
 * Starts the game
 * @param {Function} onStart Code to run when the game got initialized
 * @returns {number} The ID used for clearInterval()
 */
export function main(onStart) {

	const canvas = canvasElement.getContext("2d");
	canvasElement.height = canvasConfig.size.y;
	canvasElement.width = canvasConfig.size.x;
	setCanvasSize();
	canvas.scale(canvasConfig.scale.x,canvasConfig.scale.y);
	canvas.imageSmoothingEnabled = !canvasConfig.pixelPerfectPosition;
	canvasElement.style.imageRendering = canvasConfig.imageRendering;

	let tick = 0;
	canvas.save();

	onStart();
	initControllers();

	return setInterval(() => {
		Update(tick);
		canvas.clearRect(0,0,canvasConfig.size.x, canvasConfig.size.y);
		Draw(canvas, tick);
		DrawDebug(canvas);
		Controller.updateControllers();
		tick++;
	}, 1000/60);
}

function Update(tick) {
	for (let layer of gameObjects)
	if (layer != null)
	for (const gameObject of layer)
		if (gameObject.enabled)
			gameObject.tick(tick);
}

/**
 * @param {CanvasRenderingContext2D} canvas 
 */
function DrawDebug(canvas) {
	for (const debug of currentDebugs)
		debug(canvas);
}

/**
 * @param {CanvasRenderingContext2D} canvas 
 * @param {Number} tick 
 */
function Draw(canvas, tick) {
	for (let layer of gameObjects)
	if (layer != null)
	for (const gameObject of layer) {
		try {
			if(gameObject.hidden || !gameObject.enabled)
				continue;
			

			const sprite = gameObject.sprite;
			if (sprite == null)
				continue;
			
			const flipX = gameObject.spriteFlipX;
			const flipY = gameObject.spriteFlipY;
			const flipXSize = (gameObject.spriteFlipX ? -1 : 1) * 1;
			const flipYSize = (gameObject.spriteFlipY ? -1 : 1) * 1;
			
			const rect = gameObject.spriteRect;
			let size = gameObject.size;
			size.x *= rect.w;
			size.y *= rect.h;
			let pos = gameObject.position;

			if(Camera.main != null) {
				const cameraPosition = Camera.main.gameObject.position;
				
				pos.x -= cameraPosition.x - (canvasConfig.size.x / 2);
				pos.y -= cameraPosition.y - (canvasConfig.size.y / 2);
			}
			
			pos.x -= size.x * sprite.pivot.x;
			pos.y -= size.y * sprite.pivot.y;
			if (flipX) {
				pos.x *= -1;
				pos.x -= size.x;
			}
			if (flipY) {
				pos.y *= -1;
				pos.y -= size.y;
			}
			if(canvasConfig.pixelPerfectPosition) {
				pos = new Vector2(Math.round(pos.x), Math.round(pos.y));
				size = new Vector2(Math.round(size.x), Math.round(size.y));
			}
			canvas.save();
			canvas.globalAlpha = gameObject.spriteAlpha;
			canvas.scale(flipXSize, flipYSize);
			canvas.drawImage(sprite.element, rect.x, rect.y, rect.w, rect.h, pos.x, pos.y, size.x, size.y);	
			canvas.restore();
		} catch (error) {
			console.error(error);
		}
	}
}


window.addEventListener("resize", (e) => {
	setCanvasSize();
});

function setCanvasSize() {
	
	const size = {
		x: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
		y: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	};
	const ratio = canvasConfig.ratio;
	const fillPer = canvasConfig.fillPercentage;
	const forceIntScale = canvasConfig.forceIntegerScaling;
	const ratioValue = ratio.x / ratio.y;
	const canvasSize = canvasConfig.size;
	
	let newSize = {x:0, y:0};

	/** @media (min-aspect-ratio:16/9) */
	if ((size.x / size.y) > ratioValue) {
		newSize.x = (size.y * fillPer) * ratioValue;
		newSize.y = (size.y * fillPer);
	} else {
		newSize.x = (size.x * fillPer);
		newSize.y = (size.x * fillPer) / ratioValue;
	}
	if (forceIntScale) {
		newSize.x = toMultiplier(newSize.x, canvasSize.x, 0.5);
		newSize.y = toMultiplier(newSize.y, canvasSize.y, 0.5);
	}
	console.log(newSize);
	
	canvasElement.style.height = `${newSize.y}px`;
	canvasElement.style.width = `${newSize.x}px`;
}

/**
 * @param {Number} value The original value
 * @param {Number} to The value the original value will be a multiplier of
 * @param {Number} divider If it's too small then it'll start dividing with this value
 */
function toMultiplier(value, to, divider) {
	value = parseInt(value);
	if (value < to && divider != null)
		return toMultiplier(value / divider, to) * divider;
	return value - (value % to);
}



if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('service-worker.js')
	  .catch(function(err) {
		console.error(err);
	});
 }

