import './less/game-field.less';

import { observer } from 'mobx-react-lite';
import React, { useRef, useState, useEffect } from 'react';
import { sprintf } from 'sprintf-js';

import Game from '../Game';
import { useSpritesContext } from '../sprites/utils';
import { useStoresContext } from '../store/utils';

interface CanvasSize {
  width: number;
  height: number;
}

const GameField = observer(() => {
  const { settingsStore, gameStore } = useStoresContext();
  const sprites = useSpritesContext();

  const {
    operators,
    maxSum,
    maxMinuend,
    maxMultiplier1,
    maxMultiplier2,
    maxDivisor,
    maxQuotient,
    challengeConcurrency,
    maxChallengesCount,
    minChallengeDuration,
    maxChallengeDuration,
    minChallengeDelay,
    maxChallengeDelay,
    animationType
  } = settingsStore;

  const {
    correctCount,
    wrongCount,
    missedCount,
    overallCount,
    score,
    leftTimeFormatted
  } = gameStore;

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
      const animationSprites = sprites[animationType];
      game = new Game({
        store: gameStore,
        canvas: canvasRef.current as HTMLCanvasElement,
        animationSprites,
        operators,
        maxSum,
        maxMinuend,
        maxMultiplier1,
        maxMultiplier2,
        maxDivisor,
        maxQuotient,
        challengeConcurrency,
        maxChallengesCount,
        minChallengeDuration,
        maxChallengeDuration,
        minChallengeDelay,
        maxChallengeDelay
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
  let scoreSign = ' ';
  if (score > 0) {
    scoreSign = '+';
  }
  else if (score < 0) {
    scoreSign = '-';
  }
  return (
    <div ref={gameFieldRef} className="game-field">
      {canvas}
      <div className="game-field-score">
        <div className="game-field-score-overall">
          {scoreSign}{sprintf('%03d', Math.abs(score))} / {sprintf('%03d', overallCount)}
        </div>
        <div className="game-field-score-correct">{sprintf('%03d', correctCount)}</div>
        <div className="game-field-score-wrong">{sprintf('%03d', wrongCount)}</div>
        <div className="game-field-score-missed">{sprintf('%03d', missedCount)}</div>
      </div>
      <div className="game-field-time">
        <div>{leftTimeFormatted}</div>
      </div>
    </div>
  );
});

export default GameField;
