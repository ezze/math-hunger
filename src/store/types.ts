import SettingsStore from './SettingsStore';
import GameStore from './GameStore';
import BestResultsStore from './BestResultsStore';

export type Stores = {
  settingsStore: SettingsStore;
  gameStore: GameStore;
  bestResultsStore: BestResultsStore;
}
