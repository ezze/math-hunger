import Store from './Store';
import SettingsStore from './SettingsStore';
import GameStore from './GameStore';

let stores: Record<string, Store>;

async function getStores(): Promise<Record<string, Store>> {
  if (!stores) {
    const settingsStore = new SettingsStore({ key: 'settings' });
    const gameStore = new GameStore();
    stores = {
      settingsStore,
      gameStore
    };
    await Promise.allSettled(Object.keys(stores).map(name => stores[name].init()));
  }
  return stores;
}

export {
  getStores
};
