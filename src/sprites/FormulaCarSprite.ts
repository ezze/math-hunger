import Sprite from './Sprite';

import formulaCarUrl from '../img/formula-1.png';

class FormulaCarSprite extends Sprite {
  constructor() {
    super({
      url: formulaCarUrl,
      width: 350,
      height: 150,
      count: 1
    });
  }
}

export default FormulaCarSprite;
