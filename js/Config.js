
/* -------------------------------------
  				  CANVAS
   ------------------------------------- */
export const canvasConfig = {
	/** The query used for finding the canvas */
	canvasQuery: "#mainCanvas",
	/** Canvas size in pixels */
	size: {x: 320, y: 180},
	/** Canvas ratio */
	ratio: {x: 16, y: 9},
	/** How much does the canvas fill of the screen in percentage */
	fillPercentage: 1,
	/** Whenever each pixel should be forced to be a whole number or not 
	 * Mostly used for pixelart games */
	forceIntegerScaling: true,
	/** Upscaling used for the rendering */
	scale: {x: 1, y: 1},
	/** Rounds the position and size for rendering */
	pixelPerfectPosition: true,
	/** See: https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering */
	imageRendering: "pixelated"
};

export const debugMode = {
	isDebugOn: true,
	Collider: {
		bounds: false
	}
};



/* -------------------------------------
  				COLLISION
   ------------------------------------- */

/**
 * Possible collision tags
 */
export const colliderTags = {
	default: "default",
	background: "background",
	player: "player",
	wall: "wall"
};

/** The collision tags that will be ignored by the collision component */
/**
 * @type {Object.<string, Array.<string>>}
 */
export const collisionIgnoreMatrix = {
	default: [colliderTags.background],
	player: [colliderTags.player],
};

/** How many times should the collision be checked between 2 positions */
export const collisionIterations = 4;

/** How close does 2 colliders can be before they collide */
export const minCollisionDistance = 0.4;