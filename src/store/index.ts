import Store from './Store';
import SettingsStore from './SettingsStore';
import GameStore from './GameStore';
import BestResultsStore from './BestResultsStore';

let stores: Record<string, Store>;

async function getStores(): Promise<Stores> {
  if (!stores) {
    const settingsStore = new SettingsStore({ key: 'settings' });
    const gameStore = new GameStore();
    const bestResultsStore = new BestResultsStore({ key: 'bestResults' });
    stores = {
      settingsStore,
      gameStore,
      bestResultsStore
    };
    await Promise.allSettled(Object.keys(stores).map(name => stores[name].init()));
  }
  return stores;
}

export {
  getStores
};
