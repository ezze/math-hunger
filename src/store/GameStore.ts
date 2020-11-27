import {
  makeObservable,
  observable,
  computed,
  action
} from 'mobx';

import { sprintf } from 'sprintf-js';

import Store from './Store';

class GameStore extends Store {
  playing = false;
  correctCount = 0;
  wrongCount = 0;
  missedCount = 0;
  endTime: number | null = null;
  timeUpdater: number | null = null;
  leftTime: number | null = null;

  constructor(options: StoreOptions = {}) {
    super(options);

    makeObservable(this, {
      playing: observable,
      start: action,
      end: action,
      interrupt: action,
      correctCount: observable,
      increaseCorrectCount: action,
      wrongCount: observable,
      increaseWrongCount: action,
      missedCount: observable,
      increaseMissedCount: action,
      overallCount: computed,
      leftTime: observable,
      leftTimeFormatted: computed,
      updateLeftTime: action
    });
  }

  start(duration: number): void {
    this.playing = true;
    this.leftTime = duration * 60 * 1000;
    this.endTime = new Date().getTime() + this.leftTime;
    this.timeUpdater = window.setInterval(() => {
      if (!this.endTime) {
        return;
      }
      this.updateLeftTime(this.endTime - new Date().getTime());
      if (this.leftTime && this.leftTime < 0) {
        this.end();
      }
    }, 100);
  }

  end(): void {
    // TODO
    this.playing = false;
    this.endTime = null;
    if (this.timeUpdater) {
      window.clearInterval(this.timeUpdater);
      this.timeUpdater = null;
    }
  }

  interrupt(): void {
    this.playing = false;
    this.endTime = null;
    if (this.timeUpdater) {
      window.clearInterval(this.timeUpdater);
      this.timeUpdater = null;
    }
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

  get overallCount(): number {
    return this.correctCount + this.wrongCount + this.missedCount;
  }

  get leftTimeFormatted(): string {
    if (this.leftTime === null) {
      return '--:--';
    }
    const overallSeconds = Math.floor(this.leftTime / 1000);
    const seconds = overallSeconds % 60;
    const minutes = (overallSeconds - seconds) / 60;
    return sprintf('%02d:%02d', minutes, seconds);
  }

  updateLeftTime(leftTime: number): void {
    this.leftTime = leftTime;
  }
}

export default GameStore;
