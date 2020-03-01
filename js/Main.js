import { main } from "./engine/run";
import GameObject from './engine/GameObject';
import { sounds } from "./Assets";
import Player from './Player';
import Grass from "./Grass";
import Water from './Water';
import * as Input from "./Input";
import NetworkManager from "./engine/Networking";

document.title = "Test Game";

window.main = main(() => {
	//console.log("Hello World");
	
	for(let i = 0; i < 25; i++) 
	for(let j = 0; j < 15; j++)
		GameObject.init(new Grass(i*16,j*16, "NORMAL"), 0);
	
	Input.OnNewControllerListener((input, id) => {
		GameObject.init(new Player(input), 1000);
	});

	//GameObject.init(new Player(), 1000);
	GameObject.init(new Water(30,30));
	//sounds.MUSIC.test.play();

});


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

window.hostLobby = NetworkManager.host;
window.refreshLobbies = NetworkManager.refreshLobbies;

/*
const socket = window.io();
socket.on("connect", () => {
	console.log(`connected`);
});*/