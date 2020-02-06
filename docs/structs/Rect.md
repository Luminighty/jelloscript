# Rect

Used to define a rectangle
 - x : Number
 - y : Number
 - w : Number (Width)
 - h : Number (Height)
```javascript
let rect = {x: 3, y: 5, w: 8, h: 8}; 
```
For easier usage and additional methods the Rect class exists inside the `Struct.js` module

```javascript
import {Rect} from './engine/Struct';

// the default constructor
let rect1 = new Rect(3, 5, 10, 12);
// It is possible to use an array for the constructor
let rect2 = new Rect([3, 5, 10, 12]);
// You can convert the other to a class
let rect3 = new Rect({x: 3, y: 5, w:10, h:12});
```

## Properties
| Name | Description | Type |
| --- | --- | --- |
| x | The x value for the top left position | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| y | The y value for the top left position | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| w | The width of the rect | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| position | Returns the (x,y) value as a Vector2 | [Vector2](./Vector2.md) |
| size | Returns the (w,h) value as a Vector2 | [Vector2](./Vector2.md) |
| minX | The smaller value on the X axis | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| minY | The smaller value on the Y axis | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| maxX | The larger value on the X axis | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| maxY | The larger value on the Y axis | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| topLeft | Top Left position in Vector2 | [Vector2](./Vector2.md) |
| topRight | Top Right position in Vector2 | [Vector2](./Vector2.md) |
| bottomLeft | Bottom Left position in Vector2 | [Vector2](./Vector2.md) |
| bottomRight | Bottom Right position in Vector2 | [Vector2](./Vector2.md) |
| center | The center of the rect in Vector2 | [Vector2](./Vector2.md) |
|  |  |  |

## Methods
| Name | Description | Returns |
| --- | --- | --- |
| multiply | Multiplies the rect with the number using type | Rect |
| contains | Returns true if the rect contains the 'other' rect | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) |
| intersects | Returns true if the rect intersects the 'other' rect | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) |


## Static methods
| Name | Description | Returns |
| --- | --- | --- |
| initFromPositions | Creates a rect with 2 position | Rect |
| zero | Shorthand for new Rect(0,0,0,0) | Rect |

<sub>See also [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean), [Vector2](./Vector2.md)</sub>

[Back to Sections](../../ReadMe.md)