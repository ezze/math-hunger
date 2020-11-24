import {
  makeObservable,
  observable,
  action
} from 'mobx';

import Store from './Store';

class GameStore extends Store {
  playing = false;

  constructor(options: StoreOptions) {
    super(options);

    makeObservable(this, {
      playing: observable,
      setPlaying: action
    });

    window.setTimeout(() => {
      this.setPlaying(!this.playing);
    }, 2000);
  }

  setPlaying(playing: boolean): void {
    this.playing = playing;
  }
}

export default GameStore;
