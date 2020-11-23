import React from 'react';
import { render } from 'react-dom';

import App from './components/app/App';

function onDocumentReady() {
  const appElement = document.createElement('div');
  appElement.className = 'app';
  document.body.appendChild(appElement);
  render(<App />, appElement);
}

document.addEventListener('DOMContentLoaded', onDocumentReady);
