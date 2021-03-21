import Sprite from './Sprite';

import formulaCarWheelBlueUrl from '../img/formula-1-car-wheel-blue.png';
import formulaCarWheelGreenUrl from '../img/formula-1-car-wheel-green.png';
import formulaCarWheelPurpleUrl from '../img/formula-1-car-wheel-purple.png';
import formulaCarWheelRedUrl from '../img/formula-1-car-wheel-red.png';
import formulaCarWheelYellowUrl from '../img/formula-1-car-wheel-yellow.png';

const colorUrlMap: Record<string, string> = {
  blue: formulaCarWheelBlueUrl,
  green: formulaCarWheelGreenUrl,
  purple: formulaCarWheelPurpleUrl,
  red: formulaCarWheelRedUrl,
  yellow: formulaCarWheelYellowUrl
};

class FormulaCarWheelSprite extends Sprite {
  constructor(type: 'front' | 'rear', color: string) {
    super({
      url: colorUrlMap[color],
      width: 50,
      height: 50,
      offsetX: type === 'front' ? 248 : 21,
      offsetY: 65,
      count: 12
    });
  }
}

export default FormulaCarWheelSprite;
