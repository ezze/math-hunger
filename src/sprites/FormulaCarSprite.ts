import formulaCarBlueUrl from '../img/formula-1-car-blue.png';
import formulaCarCyanUrl from '../img/formula-1-car-cyan.png';
import formulaCarGreenUrl from '../img/formula-1-car-green.png';
import formulaCarOrangeUrl from '../img/formula-1-car-orange.png';
import formulaCarPinkUrl from '../img/formula-1-car-pink.png';
import formulaCarRedUrl from '../img/formula-1-car-red.png';
import formulaCarYellowUrl from '../img/formula-1-car-yellow.png';

import Sprite from './Sprite';

const colorUrlMap: Record<string, string> = {
  blue: formulaCarBlueUrl,
  cyan: formulaCarCyanUrl,
  green: formulaCarGreenUrl,
  orange: formulaCarOrangeUrl,
  pink: formulaCarPinkUrl,
  red: formulaCarRedUrl,
  yellow: formulaCarYellowUrl
};

class FormulaCarSprite extends Sprite {
  constructor(color: string) {
    super({
      url: colorUrlMap[color],
      width: 350,
      height: 150,
      count: 1
    });
  }
}

export default FormulaCarSprite;
