import './index.less';

import React from 'react';
import { render } from 'react-dom';
import { reaction } from 'mobx';
import { Provider } from 'mobx-react';

import { initI18n } from './i18n';
import { initSounds, initMusic, playSound, playMusic, stopMusic } from './sound';
import { getStores } from './store';

import App from './components/App';

import { SpritesProvider, getSprites } from './sprites';

function onDocumentReady() {
  const appContainer = createAppContainer();
  createApp(appContainer).catch(e => console.error(e));
}

function createAppContainer(): HTMLElement {
  const appContainer = document.createElement('div');
  appContainer.className = 'container';
  document.body.appendChild(appContainer);
  return appContainer;
}

async function initAudio(stores: Stores) {
  const settingsStore = stores.settingsStore as SettingsStore;
  const gameStore = stores.gameStore as GameStore;
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

async function createApp(appContainer: HTMLElement) {
  const stores = await getStores();
  const sprites = await getSprites();
  await initI18n(stores);
  await initAudio(stores);

  const loadingSpinner = document.querySelector('.loading-spinner');
  if (loadingSpinner) {
    loadingSpinner.remove();
  }

  render(
    <Provider {...stores}>
      <SpritesProvider value={sprites}>
        <App />
      </SpritesProvider>
    </Provider>,
    appContainer
  );
}

document.addEventListener('DOMContentLoaded', onDocumentReady);
