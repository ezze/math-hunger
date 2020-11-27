import {
  makeObservable,
  observable,
  action
} from 'mobx';

import Store from './Store';

class GameStore extends Store {
  playing = false;

  constructor(options: StoreOptions = {}) {
    super({
      ...options,
      include: [
        'duration'
      ]
    });

    makeObservable(this, {
      playing: observable,
      setPlaying: action
    });
  }

  setPlaying(playing: boolean): void {
    this.playing = playing;
  }
}

export default GameStore;
