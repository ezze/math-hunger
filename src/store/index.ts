import BestResultsStore from './BestResultsStore';
import GameStore from './GameStore';
import SettingsStore from './SettingsStore';
import Store from './Store';
import { Stores } from './types';

let stores: Stores;

export async function getStores(): Promise<Stores> {
  if (!stores) {
    const settingsStore = new SettingsStore({ key: 'settings' });
    const gameStore = new GameStore();
    const bestResultsStore = new BestResultsStore({ key: 'bestResults' });
    const orderedStores: Array<Store> = [settingsStore, gameStore, bestResultsStore];
    await Promise.allSettled(orderedStores.map((store) => store.init()));
    stores = { settingsStore, gameStore, bestResultsStore };
  }
  return stores;
}
