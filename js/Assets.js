import Sound from "./engine/Sound";
import Sprite from "./engine/Sprite";


export const sounds = {
	MUSIC: {
		test: new Sound("./media/magicka.wav", true)
	},
	SOUND: {
		test: new Sound("./media/sound.wav")
	}
};

export const sprites = {
    grass: new Sprite("./media/grass.png", [16,16], [0,0], [0.5, 0.5], {
                        "DRY": {x:0, y:0},
                        "NORMAL": {x:0, y:3},
                        "WET": {x:0, y:6}
					}),
	player: new Sprite("./media/player.png", [8,8], [1,0]),
	water: new Sprite("./media/water.png", [16,16]),
	flame: new Sprite("./media/flame.png", [4,4]),
};