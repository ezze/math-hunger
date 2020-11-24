import Store from './Store';
import GameStore from './GameStore';

let stores: Record<string, Store>;

async function getStores(): Promise<Record<string, Store>> {
  if (!stores) {
    const gameStore = new GameStore({ key: 'game' });
    stores = {
      gameStore
    };
    await Promise.allSettled(Object.keys(stores).map(name => stores[name].init()));
  }
  return stores;
}

export {
  getStores
};
