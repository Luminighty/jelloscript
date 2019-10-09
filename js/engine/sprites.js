export default class Sprite {
        
    /**
     * @param path Physical file path
     * @param {string} path String
     * @param {array} size [Width, Height] 
     * @param {array} offset [OffsetX, OffsetY] 
     * @param {dictionary} labels {"LABELNAME" : {x: OffsetX, y: OffsetY}, ...}
     * Offset as tiles, NOT PIXELS
     * @returns sprite
     */
    constructor(path, size, offset=[0,0], labels={}) {
        this.path = path;
        this.size = {x: size[0], y: size[1]};
		this.offset = {x: offset[0], y: offset[1]};
        this.labels = labels;
        this._element = null;
    }

    get element() {
        if(this._element === null) this.load(); return this._element;
    }

	unload() {_element.remove();}

    
    getSpriteRect(x = 0, y = 0) {
        return {
            x: (this.offset.x + this.size.x) * x,
            y: (this.offset.y + this.size.y) * y,
            w: this.size.x,
            h: this.size.y
        }
    }

    getSpriteFromLabel(label, offsetX=0, offsetY=0) {
        const l = this.labels[label.toUpperCase()];
        return this.getSpriteRect(l.x+offsetX, l.y+offsetY);
    }

    load() {
        this._element = document.createElement("img");
        this._element.src = this.path;
        this._element.style.display = "none";
        this._element.style.scale = 10;
    }
}



export const sprites = {
    grass: new Sprite("./grass.png", [16,16], [0,0], {
                        "DRY": {x:0, y:0},
                        "NORMAL": {x:0, y:3},
                        "WET": {x:0, y:6}
					}),
	player: new Sprite("./player.png", [8,8])
};
