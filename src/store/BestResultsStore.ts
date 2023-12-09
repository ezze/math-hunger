import {
  makeObservable,
  observable,
  action
} from 'mobx';

import { BestResult } from '../types';

import Store, { StoreOptions } from './Store';

const maxCount = 10;

class BestResultsStore extends Store {
  name = '';
  bestResults: Record<string, Array<BestResult>> = {};

  constructor(options: StoreOptions) {
    super({
      ...options,
      include: [
        'name',
        'bestResults'
      ]
    });

    makeObservable(this, {
      name: observable,
      bestResults: observable.ref,
      setName: action,
      add: action
    });
  }

  setName(name: string): void {
    this.name = name;
  }

  add(hash: string, result: BestResult): void {
    let bestResults = this.bestResults[hash];
    if (!bestResults) {
      bestResults = [];
    }

    let i = 0;
    while (i < bestResults.length) {
      const bestResult = bestResults[i];
      if (
        result.score > bestResult.score ||
        (result.score === bestResult.score && result.correctCount > bestResult.correctCount) ||
        (
          result.score === bestResult.score &&
          result.correctCount === bestResult.correctCount &&
          result.wrongCount < bestResult.wrongCount
        )
      ) {
        break;
      }
      i++;
    }

    if (i < maxCount) {
      bestResults.splice(i, 0, result);
    }

    while (bestResults.length > maxCount) {
      bestResults.pop();
    }

    this.bestResults = {
      ...this.bestResults,
      [hash]: bestResults
    };
  }
}

export default BestResultsStore;
