import './less/game-field.less';

import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';

import { withSprites } from '../sprites';
import Game from '../Game';

import InjectionError from './helpers/InjectionError';

interface GameFieldProps extends React.HTMLAttributes<HTMLDivElement>, WithSpriteOptions {
  settingsStore?: SettingsStore;
  gameStore?: GameStore;
}

const GameField: React.FunctionComponent<GameFieldProps> = props => {
  const { settingsStore, gameStore, sprites } = props;
  if (!settingsStore) {
    throw new InjectionError('Settings store');
  }
  if (!gameStore) {
    throw new InjectionError('Game store');
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { duration } = settingsStore;

  useEffect(() => {
    const game = new Game({
      store: gameStore,
      canvas: canvasRef.current as HTMLCanvasElement,
      sprites,
      duration
    });
    return () => {
      game.destroy();
    };
  }, []);

  return (
    <div className="game-field">
      <canvas ref={canvasRef} className="game-field-canvas"></canvas>
    </div>
  );
};

export default withSprites(inject('settingsStore', 'gameStore')(observer(GameField)));
