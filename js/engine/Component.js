import GameObject from "./GameObject";

export default class Component extends GameObject {

    constructor() {
        super();
    }


    

    get hidden() {return true;}
    get sprite() {return null;}
    get spriteFlipX() {return false;}
    get spriteFlipY() {return false;}
    get spriteRect() {return null;}
}