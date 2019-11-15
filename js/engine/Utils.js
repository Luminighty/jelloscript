import { Vector2 } from "./Struct";

/**
 * A random function where the chances can be set
 * @param {[Number]} chances The chances of one of them being the outcome [10,30,20]
 * @param {[Any]} options The results of the chances, by default it's 0..chances.length-1
 * @returns {Any} An element of options or an index of chances
 */
export function decide(chances, options = []) {
	let sum = 0;
	for (const c of chances)
		sum += c;
	let res = Math.random() * sum;
	
	for (let i = 0; i < chances.length; i++) {
		const element = chances[i];
		res -= element;
		if (res <= 0)
			return (options.length <= i || options == []) ? i : options[i];
	}
}


/**
 * Calculates a position between the two values moving no farther than the distance specified by maxDelta
 * @param {Number, Vector2} current The start position to move from
 * @param {Number, Vector2} target The target position to move towards
 * @param {Number, Vector2} maxDelta The maximum distance to move
 * @returns {Number, Vector2} The new position
 */
export function moveTowards(current, target, maxDelta) {
	if (typeof current === "number")
		return moveTowardsInt(current, target, maxDelta);
	if (current instanceof Vector2)
		return Vector2.moveTowards(current, target, maxDelta);
	
}

function moveTowardsInt(value, to, stepSize) {
	let dif = to - value;
	const sign = Math.sign(dif);
	if (dif * sign > stepSize)
		dif = stepSize * sign;
	return value + dif;
}


/**
 * @returns The angle in degrees
 * @param {Number} angle An angle in radians
 */
export function toDegree(angle) {
	return angle * (180 / Math.PI);
}

/**
 * @returns The angle in radians
 * @param {Number} angle An angle in degrees
 */
export function toRadian(angle) {
	return angle * (Math.PI / 180);
}
