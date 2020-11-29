import './index.less';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import { initAudio } from './sound';
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

async function createApp(appContainer: HTMLElement) {
  await initAudio();
  const sprites = await getSprites();
  const stores = await getStores();

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
