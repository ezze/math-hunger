import React from 'react';

import HorseSprite from './HorseSprite';
import FormulaCarSprite from './FormulaCarSprite';
import FormulaCarWheelSprite from './FormulaCarWheelSprite';

const formulaCarColors = ['blue', 'cyan', 'green', 'orange', 'pink', 'red', 'yellow'];
const formulaCarWheelColors = ['blue', 'green', 'purple', 'red', 'yellow'];

let sprites: Sprites;
export async function getSprites(): Promise<Sprites> {
  if (!sprites) {
    sprites = {
      horse: [new HorseSprite()],
      formulaCar: [
        formulaCarColors.map(color => new FormulaCarSprite(color)),
        formulaCarWheelColors.map(color => new FormulaCarWheelSprite('front', color)),
        formulaCarWheelColors.map(color => new FormulaCarWheelSprite('rear', color))
      ]
    };
    await Promise.allSettled(Object.keys(sprites).map((type => {
      sprites[type as AnimationType].forEach(sprite => {
        if (Array.isArray(sprite)) {
          return Promise.allSettled(sprite.map(sprite => sprite.init()));
        }
        return sprite.init();
      });
    })));
  }
  return sprites;
}

const SpritesContext = React.createContext<Sprites | null>(null);
const { Provider: SpritesProvider, Consumer: SpritesConsumer } = SpritesContext;

const withSprites = <P extends WithSpriteOptions>(WrappedComponent: React.ComponentType<P>):
  React.FunctionComponent<Omit<P, keyof WithSpriteOptions>> => {
  return props => {
    return (
      <SpritesConsumer>
        {sprites => {
          return (
            <WrappedComponent {...props as P} sprites={sprites} />
          );
        }}
      </SpritesConsumer>
    );
  };
};

export {
  SpritesProvider,
  withSprites
};
