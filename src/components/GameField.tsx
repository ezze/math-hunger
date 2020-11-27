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
  const { correctCount, wrongCount, missedCount, overallCount } = gameStore;

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
    let game: Game;
    const createGame = () => {
      if (!canvasRef.current) {
        window.setTimeout(createGame, 50);
        return;
      }
      game = new Game({
        store: gameStore,
        canvas: canvasRef.current as HTMLCanvasElement,
        sprites,
        duration
      });
    };
    createGame();

    return () => {
      if (game) {
        game.destroy();
      }
    };
  }, []);

  const canvas = size ? (
    <canvas ref={canvasRef} className="game-field-canvas" width={size.width} height={size.height}></canvas>
  ) : null;
  return (
    <div ref={gameFieldRef} className="game-field">
      {canvas}
      <div className="game-field-score">
        <div>{correctCount} / {wrongCount} / {missedCount}</div>
        <div>{overallCount}</div>
      </div>
    </div>
  );
};

export default withSprites(inject('settingsStore', 'gameStore')(observer(GameField)));
