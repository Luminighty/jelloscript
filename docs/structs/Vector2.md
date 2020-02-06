# Vector2

Used to define a point in a 2D enviroment
 - x : Number
 - y : Number
```javascript
let vec = {x: 3, y: 5}; 
```
For easier usage and additional methods the Vector2 class exists inside the `Struct.js` module

```javascript
import {Vector2} from './engine/Struct';

// the default constructor
let vec = new Vector2(3, 5);
// It is possible to use an array for the constructor
let vec = new Vector2([3, 5]);
// You can convert the other to a class
let vec = new Vector2({x: 3, y: 5});
```

## Properties
| Name | Description | Type |
| --- | --- | --- |
| x | The x value for the position | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| y | The y value for the position | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| magnitude | The length of the vector | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| sqrMagnitude | The length of the vector squared (faster than magnitude) | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| normalized | Returns the vector with a magnitude of 1 | Vector2 |

## Methods
| Name | Description | Returns |
| --- | --- | --- |
| get | Get X or Y value | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| add | Adds the vector's components to the other one and returns with the new Vector2 | Vector2 |
| subtract | Subtracts the vector's components to the other one and returns with the new Vector2 | Vector2 |
| multiply | Multiplies the vector's components and returns with a new Vector2 | Vector2 |
| divide | Divides the vector's components and returns with a new Vector2 | Vector2 |
| negate | Negates the vector's components and returns with a new Vector2 | Vector2 |

## Static methods
| Name | Description | Returns |
| --- | --- | --- |
| zero | Shorthand for new Vector(0,0) | Vector2 |
| one | Shorthand for new Vector(1,1) | Vector2 |
| right | Shorthand for new Vector(1,0) | Vector2 |
| left | Shorthand for new Vector(-1,0) | Vector2 |
| up | Shorthand for new Vector(0,1) | Vector2 |
| down | Shorthand for new Vector(0,-1) | Vector2 |
| dot | Calculates the dot product of 2 vectors (x1\*x2 + y1\*y2) | Number |
| angle | Calculates the angle between 2 vectors | Number |
| moveTowards | Calculates a position between the two values moving no farther than the distance specified by maxDelta | Vector2 |

<sub>See also [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</sub>

[Back to Sections](../../ReadMe.md)