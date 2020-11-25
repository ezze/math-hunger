import {
  makeObservable,
  observable,
  action
} from 'mobx';

import Store from './Store';

import { durations } from '../constants';

class GameStore extends Store {
  playing = false;
  duration = durations[0];

  constructor(options: StoreOptions) {
    super({
      ...options,
      include: [
        'duration'
      ]
    });

    makeObservable(this, {
      playing: observable,
      setPlaying: action,
      duration: observable,
      setDuration: action
    });
  }

  setPlaying(playing: boolean): void {
    this.playing = playing;
  }

  setDuration(duration: number): void {
    if (durations.includes(duration)) {
      this.duration = duration;
    }
  }
}

export default GameStore;
