import SettingsStore from './SettingsStore';
import GameStore from './GameStore';
import BestResultsStore from './BestResultsStore';
import { Stores } from './types';
import Store from './Store';

let stores: Stores;

export async function getStores(): Promise<Stores> {
  if (!stores) {
    const settingsStore = new SettingsStore({ key: 'settings' });
    const gameStore = new GameStore();
    const bestResultsStore = new BestResultsStore({ key: 'bestResults' });
    const orderedStores: Array<Store> = [settingsStore, gameStore, bestResultsStore];
    await Promise.allSettled(orderedStores.map(store => store.init()));
    stores = { settingsStore, gameStore, bestResultsStore };
  }
  return stores;
}
