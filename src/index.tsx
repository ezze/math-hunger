import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { getStores } from './store';
import { getSprites, SpritesProvider } from './sprites';
import { initI18n } from './i18n';
import { initAudio } from './audio';
import { Provider } from 'mobx-react';
import App from './components/App';

document.addEventListener('DOMContentLoaded', async () => {
  const rootElement = document.getElementById('root');
  if (rootElement === null) {
    throw new TypeError('Root element is not found');
  }

  const stores = await getStores();
  const sprites = await getSprites();
  await initI18n(stores);
  await initAudio(stores);

  // const loadingSpinner = document.querySelector('.loading-spinner');
  // if (loadingSpinner) {
  //   loadingSpinner.remove();
  // }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider {...stores}>
        <SpritesProvider value={sprites}>
          <App />
        </SpritesProvider>
      </Provider>,
      <App />
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
