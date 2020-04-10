import Sound from "./engine/Sound";
import Sprite from "./engine/Sprite";

export const sprites = {
	player: new Sprite("./media/temp/player.png", [8,8], [1,0])
};

export const sounds = {
	temp: { test: new Sound("./media/temp/sound.wav"), }
};