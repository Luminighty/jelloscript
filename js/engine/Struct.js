
export class Vector2 {

	constructor(x,y) {
		if (y == null) {
			if (Array.isArray(x))
				x = {x:x[0], y:x[1]};
			y = x.x;
			x = x.x;
		}
		this.x = x;
		this.y = y;
	}

	get(index) {
		index %= 2;
		return (index == 0) ? this.x : this.y;
	}

	add(other) { return new Vector2(this.x + other.x, this.y + other.y); }
	substract(other) { return this.add(other.negate()); }
	negate() { return new Vector2(-this.x, -this.y); }
	multiply(number) { return new Vector2(this.x * number, this.y * number); }

	get magnitude() { return Math.sqrt(this.sqrMagnitude());}
	get sqrMagnitude() { return this.x * this.x + this.y * this.y; }

	static get zero()  { return new Vector2( 0, 0); }
	static get one()   { return new Vector2( 1, 1); }
	static get right() { return new Vector2( 1, 0); }
	static get left()  { return new Vector2(-1, 0); }
	static get up()    { return new Vector2( 0, 1); }
	static get down()  { return new Vector2( 0,-1); }

}

export class Rect {

	constructor(x,y,w,h) {
		if (y == null) {
			if (Array.isArray(x))
				x = {x:x[0], y:x[1], w:x[2], h:x[3]};
			y = x.y;
			w = x.w;
			h = x.h;
			x = x.x;
		}
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	static get zero() {return new Rect(0,0,0,0);}

}