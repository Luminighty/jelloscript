# Sound
<sub>Extends [Resource](./Resource.md)</sub>

Sounds are used to play sound effects or music for the player.

## Properties
| Name | Description | Type |
| --- | --- | --- |
| element | The DOM element, if it's value is null when trying to acces it, it'll load it first | [AudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement) |
| path | The resource's physical file path | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| paused | Whenever the audio is paused or not | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) |
| volume | The volume of the sound in the interval [0, 1] | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| muted | Whenever the audio is muted or not | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) |
| duration | The length of the sound (readonly) | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |
| loop | Whenever the audio is looping or not | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) |
| currentTime | The current playback time in seconds | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |

## Methods
| Name | Description | Returns |
| --- | --- | --- |
| play(time=0) | Plays the sound from `time` | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) |
| playOnce(volume, time=0) | Plays the sound once from `time` with setting the volume to `volume`. Used for sound effects that can played at the same time. |  |
| resume | Shorthand for `sound.paused = false;` |  |

## Usage Example:
```javascript
import {sounds} from './Assets';
import Sound from './engine/Sound';

/*	
	path : String
			The string used for the <audio> element's src attribute
	loop : Boolean
			Should the sound be looped?
*/
let sound = new Sound(path, size);

sound.volume = 0.8;
sound.play();
```

<sub>See also [AudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement), [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean), [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</sub>

[Back to Sections](../../ReadMe.md)