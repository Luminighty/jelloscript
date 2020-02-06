import { canvasConfig } from '../Config';
import * as InputManager from './InputManager';
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

	if(mobileAndTabletcheck())
		InputManager.addTouchInputs();

	let tick = 0;
	canvas.save();

	onStart();

	return setInterval(() => {
		Update(tick);
		canvas.clearRect(0,0,canvasConfig.size.x, canvasConfig.size.y);
		Draw(canvas, tick);
		DrawDebug(canvas);
		InputManager.update();
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


 /** @returns If the browser is a mobile or tablet */
function mobileAndTabletcheck() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}