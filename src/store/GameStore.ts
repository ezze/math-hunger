import {
  makeObservable,
  observable,
  computed,
  action
} from 'mobx';
import { sprintf } from 'sprintf-js';

import { BestResult, Operation } from '../types';
import { getOperationText } from '../utils';

import Store, { StoreOptions } from './Store';

class GameStore extends Store {
  name = '';
  playing = false;
  gameOver = false;
  correctCount = 0;
  wrongCount = 0;
  missedCount = 0;
  incorrectItems: Array<{
    type: string;
    operation: string;
  }> = [];
  endTime: number | null = null;
  lastResult: BestResult | null = null;
  timeUpdater: number | null = null;
  leftTime: number | null = null;

  constructor(options: StoreOptions = {}) {
    super(options);

    makeObservable(this, {
      name: observable,
      playing: observable,
      gameOver: observable,
      correctCount: observable,
      wrongCount: observable,
      missedCount: observable,
      incorrectItems: observable.shallow,
      overallCount: computed,
      score: computed,
      leftTime: observable,
      leftTimeFormatted: computed,
      start: action,
      end: action,
      interrupt: action,
      reset: action,
      finish: action,
      increaseCorrectCount: action,
      increaseWrongCount: action,
      increaseMissedCount: action,
      updateLeftTime: action
    });
  }

  get overallCount(): number {
    return this.correctCount + this.wrongCount + this.missedCount;
  }

  get score(): number {
    return this.correctCount - this.wrongCount - this.missedCount;
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

  start(duration: number): void {
    this.playing = true;
    this.gameOver = false;
    this.leftTime = duration * 60 * 1000;
    this.endTime = new Date().getTime() + this.leftTime;
    this.lastResult = null;
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
    this.playing = false;
    this.gameOver = true;
    this.endTime = null;
    this.lastResult = {
      name: '',
      correctCount: this.correctCount,
      wrongCount: this.wrongCount,
      missedCount: this.missedCount,
      score: this.score,
      incorrectItems: this.incorrectItems,
      time: new Date().toISOString()
    };
    this.reset();
    if (this.timeUpdater) {
      window.clearInterval(this.timeUpdater);
      this.timeUpdater = null;
    }
  }

  interrupt(): void {
    this.playing = false;
    this.gameOver = false;
    this.reset();
    this.endTime = null;
    this.lastResult = null;
    if (this.timeUpdater) {
      window.clearInterval(this.timeUpdater);
      this.timeUpdater = null;
    }
  }

  reset(): void {
    this.correctCount = 0;
    this.wrongCount = 0;
    this.missedCount = 0;
    this.incorrectItems = [];
  }

  finish(): void {
    this.gameOver = false;
  }

  increaseCorrectCount(): void {
    this.correctCount++;
  }

  increaseWrongCount(operation: Operation): void {
    this.wrongCount++;
    this.incorrectItems.push({ type: 'wrong', operation: getOperationText(operation) });
  }

  increaseMissedCount(operation: Operation): void {
    this.missedCount++;
    this.incorrectItems.push({ type: 'missed', operation: getOperationText(operation) });
  }

  updateLeftTime(leftTime: number): void {
    this.leftTime = leftTime;
  }
}

export default GameStore;
