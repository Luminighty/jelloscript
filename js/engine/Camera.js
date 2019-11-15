import Component from "./Component";
import { Vector2 } from "./Struct";
import { canvasConfig } from "../Config";

export default class Camera extends Component {
	constructor(isMainCamera = false) {
		super();
		if (Camera.main == null || isMainCamera)
			Camera.main = this;
	}

	toScreenPosition(position) {
		const pos = this.gameObject.position;
		position = new Vector2(position);
		position.x -= pos.x - (canvasConfig.size.x / 2);
		position.y -= pos.y - (canvasConfig.size.y / 2);
		return position;
	}

	toWorldPosition(position) {
		const pos = this.gameObject.position;
		position = new Vector2(position);
		position.x += pos.x - (canvasConfig.size.x / 2);
		position.y += pos.y - (canvasConfig.size.y / 2);
		return position;
	}

	static toScreenPosition(position) {
		if (Camera.main == null)
			return new Vector2(position);
		return Camera.main.toScreenPosition(position);
	}

	static toWorldPosition(position) {
		if (Camera.main == null)
			return new Vector2(position);
		return Camera.main.toWorldPosition(position);
	}
}

/** @type {Camera} */
Camera.main = null;