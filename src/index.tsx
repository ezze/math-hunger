import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import { getStores } from './store';

import './index.less';

import App from './components/app/App';

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
  const stores = await getStores();
  render(
    <Provider {...stores}>
      <App />
    </Provider>,
    appContainer
  );
}

document.addEventListener('DOMContentLoaded', onDocumentReady);
