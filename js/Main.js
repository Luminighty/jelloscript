import { main } from "./engine/run";
import GameObject from './engine/GameObject';
import { sounds, sprites } from "./Assets";
import Player from './Player';
import * as Input from "./Input";
import NetworkManager from "./engine/Networking";
import { ParticleSystem, Particle } from "./engine/ParticleSystem";
import { Vector2 } from "./engine/Struct";
import * as Utils from "./engine/Utils";

document.title = "Test Game";

window.players = [];


window.main = main(() => {
	
	Input.OnNewControllerListener((input, id) => {
		const player = new Player(input);
		Input.OnGetControllerState(id, () => {
			return {position: player.localPosition, color: player.shipColor};
		});

		Input.OnSetControllerState(id, (data) => {
			if (data) {
				player.localPosition = data.position;
				player.shipColor = data.color;
			}
		});
		GameObject.init(player, 10);
	});

	InitStarParticles();
});


function InitStarParticles() {
	const holder = GameObject.init(new GameObject(), 0);
	const particle = new Particle({
		position: () => [Math.random() * 640, -5],
		velocity: () => [0, Math.random() * 0.3 + 0.5],
		gravity: Vector2.zero,
		sprite: sprites.stars,
		spriteRect: () => {
			const value = Utils.decide([100, 10, 1]);
			return sprites.stars.getSpriteRect(value, 0);
			},
		lifespan: 1000,
		renderingLayer: 0,
	});

	const particleSystem = new ParticleSystem({
		particles: [particle],
		delay: 10
	}, true);
	holder.addComponent(particleSystem);
}


let lobbies = [];
let firstLobby = null;
NetworkManager.onLobbiesRefreshed((newLobbies) => {
	lobbies = newLobbies;
	console.log(lobbies);
});

document.querySelector("#btn-connect").addEventListener("click", (e) => {
	NetworkManager.connect(lobbies[lobbies.length - 1]);
});
document.querySelector("#btn-host").addEventListener("click", NetworkManager.host);
document.querySelector("#btn-refresh").addEventListener("click", NetworkManager.refreshLobbies);

window.connectLobby = function(id) {
	NetworkManager.connect(lobbies[id]);
};

window.hostLobby = () => {
	NetworkManager.host();
	console.log("Hosting...");
};
window.refreshLobbies = NetworkManager.refreshLobbies;

/*
const socket = window.io();
socket.on("connect", () => {
	console.log(`connected`);
});*/