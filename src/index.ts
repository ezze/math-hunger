import React from 'react';
import { render } from 'react-dom';

function onDocumentReady() {
  const appElement = document.createElement('div');
  appElement.className = 'app';
  document.body.appendChild(appElement);
}

document.addEventListener('DOMContentLoaded', onDocumentReady);
