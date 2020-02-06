# Resource
<sub>Implementing classes: [Sprite](./Sprite.md), [Sound](./Sound.md)</sub>

Abstract base class for any DOM element resource. Other resource types should be inherited from this class.

## Properties
| Name | Description | Type |
| --- | --- | --- |
| element | The DOM element, if it's value is null when trying to acces it, it'll load it first | [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) |
| path | The resource's physical file path | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |

## Methods
| Name | Description | Returns |
| --- | --- | --- |
| load | Creates a new [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) and sets it as a reference to the `element` property |  |
| unload | Unloads the resource for memory management issues. |  |

<sub>See also [Sprite](./Sprite.md), [Sound](./Sound.md), [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</sub>

[Back to Sections](../../ReadMe.md)