import {
  makeObservable,
  observable,
  computed,
  action
} from 'mobx';

import Store from './Store';

class GameStore extends Store {
  playing = false;
  correctCount = 0;
  wrongCount = 0;
  missedCount = 0;

  constructor(options: StoreOptions = {}) {
    super({
      ...options,
      include: [
        'duration'
      ]
    });

    makeObservable(this, {
      playing: observable,
      correctCount: observable,
      increaseCorrectCount: action,
      wrongCount: observable,
      increaseWrongCount: action,
      missedCount: observable,
      increaseMissedCount: action,
      overallCount: computed,
      setPlaying: action
    });
  }

  setPlaying(playing: boolean): void {
    this.playing = playing;
  }

  get overallCount(): number {
    return this.correctCount + this.wrongCount + this.missedCount;
  }

  increaseCorrectCount(): void {
    this.correctCount++;
  }

  increaseWrongCount(): void {
    this.wrongCount++;
  }

  increaseMissedCount(): void {
    this.missedCount++;
  }
}

export default GameStore;
