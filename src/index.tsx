import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { getStores } from './store';
import { getSprites } from './sprites';
import { initI18n } from './i18n';
import { initAudio } from './audio';
import App from './components/App';
import { createStoresContext } from './store/utils';
import { createSpritesContext } from './sprites/utils';

import './index.less';

document.addEventListener('DOMContentLoaded', async () => {
  const rootElement = document.getElementById('root');
  if (rootElement === null) {
    throw new TypeError('Root element is not found');
  }

  const stores = await getStores();
  const sprites = await getSprites();
  await initI18n(stores);
  await initAudio(stores);

  const StoresContext = createStoresContext();
  const SpritesContext = createSpritesContext();

  // const loadingSpinner = document.querySelector('.loading-spinner');
  // if (loadingSpinner) {
  //   loadingSpinner.remove();
  // }

  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <StoresContext.Provider value={stores}>
        <SpritesContext.Provider value={sprites}>
          <App />
        </SpritesContext.Provider>
      </StoresContext.Provider>
    </StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
