
/**
 * A random function where the chances can be set
 * @param {Array : Number} chances The chances of one of them being the outcome [10,30,20]
 * @param {Array : Any} options The results of the chances, by default it's 0..chances.length-1
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


export function moveTowards(value, to, stepSize) {
	if (typeof value === "number")
		return moveTowardsInt(value, to, stepSize);

	
}

function moveTowardsInt(value, to, stepSize) {
	let dif = to - value;
	const sign = Math.sign(dif);
	if (dif * sign > stepSize)
		dif = stepSize * sign;
	return value + dif;
}