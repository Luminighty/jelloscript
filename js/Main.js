import { main } from "./engine/run";
import GameObject from './engine/GameObject';
import { sounds } from "./Assets";
import Player from './Player';
import Grass from "./Grass";
import Water from './Water';

document.title = "Test Game";

window.main = main(() => {
	console.log("Hello World");
	
	for(let i = 0; i < 25; i++) 
	for(let j = 0; j < 15; j++)
		GameObject.init(new Grass(i*16,j*16, "NORMAL"), 0);
	
	GameObject.init(new Player(), 1000);
	GameObject.init(new Water(30,30));

});