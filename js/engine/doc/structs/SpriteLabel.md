# Sprite Label

Used at sprite sheets for easier access
 - "LABEL1" : Vector2
 - "LABEL2" : Vector2
 - "LABEL3" : Vector2
 - ...

A sprite label is a dictionary of keys associated with a Vector2
The keys are required to be uppercase. (0,0) is the top-left sprite.


```javascript
let spriteLabel = {
	"WALK": {x:0, y:0},
	"RUN": {x:1, y:0},
	"IDLE": {x:3, y:1}
}; 
```
<sub>See [Sprites](../class/Sprite.md)</sub>

[Back to Sections](../../ReadMe.md)