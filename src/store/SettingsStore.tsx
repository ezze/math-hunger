import {
  makeObservable,
  observable,
  action
} from 'mobx';

import Store from './Store';

import { durations } from '../constants';

class SettingsStore extends Store {
  duration = durations[0];

  constructor(options: StoreOptions) {
    super({
      ...options,
      include: [
        'duration'
      ]
    });

    makeObservable(this, {
      duration: observable,
      setDuration: action
    });
  }

  setDuration(duration: number): void {
    if (durations.includes(duration)) {
      this.duration = duration;
    }
  }
}

export default SettingsStore;
