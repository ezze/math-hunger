import './less/game-field.less';

import React, { useRef, useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import { withSprites } from '../sprites';
import Game from '../Game';

import InjectionError from './helpers/InjectionError';

interface GameFieldProps extends React.HTMLAttributes<HTMLDivElement>, WithSpriteOptions {
  settingsStore?: SettingsStore;
  gameStore?: GameStore;
}

interface CanvasSize {
  width: number;
  height: number;
}

const GameField: React.FunctionComponent<GameFieldProps> = props => {
  const { settingsStore, gameStore, sprites } = props;
  if (!settingsStore) {
    throw new InjectionError('Settings store');
  }
  if (!gameStore) {
    throw new InjectionError('Game store');
  }

  const { duration } = settingsStore;

  const gameFieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getGameFieldSize = () => {
    const { offsetWidth: width, offsetHeight: height } = gameFieldRef.current as HTMLDivElement;
    return { width, height };
  };

  const [size, setSize] = useState<CanvasSize | null>(null);

  useEffect(() => {
    setSize(getGameFieldSize);
    const onResize = () => {
      setSize(getGameFieldSize());
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

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

  const width = size ? size.width : undefined;
  const height = size ? size.height : undefined;

  return (
    <div ref={gameFieldRef} className="game-field">
      <canvas ref={canvasRef} className="game-field-canvas" width={width} height={height}></canvas>
    </div>
  );
};

export default withSprites(inject('settingsStore', 'gameStore')(observer(GameField)));
