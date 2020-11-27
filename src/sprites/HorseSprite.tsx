import Sprite from './Sprite';

import horseUrl from '../img/horse.png';

class HorseSprite extends Sprite {
  constructor() {
    super({
      url: horseUrl,
      width: 227,
      height: 149,
      count: 8
    });
  }
}

export default HorseSprite;
