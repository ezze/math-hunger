import { IReactionDisposer, reaction } from 'mobx';
import { initMusic, playMusic, stopMusic } from './music';
import { initSounds, playSound } from './sounds';
import { Stores } from '../store/types';

export async function initAudio(stores: Stores): Promise<Array<IReactionDisposer>> {
  const { settingsStore, gameStore } = stores;

  await initSounds();
  await initMusic();

  const disposeCorrect = reaction(() => gameStore.correctCount, (correctCount, prevCorrectCount) => {
    if (settingsStore.sound && correctCount > prevCorrectCount) {
      playSound('correct').catch(e => console.error(e));
    }
  });

  const disposeWrong = reaction(() => gameStore.wrongCount, (wrongCount, prevWrongCount) => {
    if (settingsStore.sound && wrongCount > prevWrongCount) {
      playSound('wrong').catch(e => console.error(e));
    }
  });

  const disposeGameOver = reaction(() => gameStore.gameOver, (gameOver, prevGameOver) => {
    if (settingsStore.sound && gameOver && !prevGameOver) {
      playSound('gameOver').catch(e => console.error(e));
    }
  });

  const disposeAnimationType = reaction(() => settingsStore.animationType, () => {
    if (settingsStore.music) {
      stopMusic();
      playMusic(settingsStore.animationType).catch(e => console.error(e));
    }
  });

  const disposeMusic = reaction(() => settingsStore.music, music => {
    if (music) {
      playMusic(settingsStore.animationType).catch(e => console.error(e));
    }
    else {
      stopMusic().catch(e => console.error(e));
    }
  });

  return [
    disposeCorrect,
    disposeWrong,
    disposeGameOver,
    disposeAnimationType,
    disposeMusic
  ];
}

