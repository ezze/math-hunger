import Sprite from './Sprite';

import formulaCarWheelUrl from '../img/formula-1-wheel.png';

class FormulaCarWheelSprite extends Sprite {
  constructor() {
    super({
      url: formulaCarWheelUrl,
      width: 50,
      height: 50,
      count: 1,
      rotationFrames: 12
    });
  }
}

export default FormulaCarWheelSprite;
