import Sprite from './Sprite';

import horseUrl from '../img/horse.png';

class HorseSprite extends Sprite {
  constructor() {
    super({
      url: horseUrl,
      width: 272,
      height: 233,
      count: 16,
      framesPerSprite: 3
    });
  }
}

export default HorseSprite;
