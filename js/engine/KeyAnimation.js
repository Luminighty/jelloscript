import Component from "./Component";
import Animator from "./Animator";

export default class KeyAnimator extends Animator {

	constructor(gameObject, sprite, spriteRect) {
		super(gameObject, sprite, spriteRect);
		this.tick = 0;
	}

	update(tick) {
		this.tick = tick;
		this.animate();
	}

	animate() {}


	getKeyFrameValue(frames, values, )

}