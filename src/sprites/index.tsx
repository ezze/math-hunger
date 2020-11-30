import React from 'react';

import HorseSprite from './HorseSprite';

let sprites: Sprites;
export async function getSprites(): Promise<Sprites> {
  if (!sprites) {
    sprites = {
      horse: new HorseSprite()
    };
    await Promise.allSettled(Object.keys(sprites).map(name => sprites[name].init()));
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
