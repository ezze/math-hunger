import BestResultsStore from './BestResultsStore';
import GameStore from './GameStore';
import SettingsStore from './SettingsStore';

export type Stores = {
  settingsStore: SettingsStore;
  gameStore: GameStore;
  bestResultsStore: BestResultsStore;
}
