import Sprite from './Sprite';

import formulaCarWheelUrl from '../img/formula-1-wheel.png';

class FormulaCarWheelSprite extends Sprite {
  constructor(type: 'front' | 'rear') {
    super({
      url: formulaCarWheelUrl,
      width: 50,
      height: 50,
      offsetX: type === 'front' ? 248 : 21,
      offsetY: 65,
      count: 12
    });
  }
}

export default FormulaCarWheelSprite;
