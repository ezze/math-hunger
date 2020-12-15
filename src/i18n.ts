import i18n from 'i18next';
import { reaction } from 'mobx';
import { initReactI18next } from 'react-i18next';

import en from './translations/en.json';
import ru from './translations/ru.json';

import { languageDefault } from './constants';

export async function initI18n(stores: Stores): Promise<void> {
  const settingsStore = stores.settingsStore as SettingsStore;
  const { language } = settingsStore as SettingsStore;

  reaction(() => settingsStore.language, language => {
    i18n.changeLanguage(language);
  });

  await i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: { ru, en },
      lng: language,
      fallbackLng: languageDefault,
      interpolation: {
        escapeValue: false
      }
    });
}
