import {
  makeObservable,
  observable,
  action
} from 'mobx';

import {
  durationsAvailable,
  durationDefault,
  operatorsDefault,
  maxSumDefault,
  maxMinuendDefault,
  maxMultiplierDefault,
  maxDivisorDefault,
  maxQuotientDefault
} from '../constants';

import Store from './Store';

class SettingsStore extends Store {
  duration = durationDefault;
  operators: Array<Operator> = operatorsDefault;
  maxSum = maxSumDefault;
  maxMinuend = maxMinuendDefault;
  maxMultiplier1 = maxMultiplierDefault;
  maxMultiplier2 = maxMultiplierDefault;
  maxDivisor = maxDivisorDefault;
  maxQuotient = maxQuotientDefault;

  constructor(options: StoreOptions) {
    super({
      ...options,
      include: [
        'duration',
        'operators',
        'maxSum',
        'maxMinuend',
        'maxMultiplier1',
        'maxMultiplier2',
        'maxDivisor',
        'maxQuotient'
      ]
    });

    makeObservable(this, {
      duration: observable,
      operators: observable,
      maxSum: observable,
      maxMinuend: observable,
      maxMultiplier1: observable,
      maxMultiplier2: observable,
      maxDivisor: observable,
      maxQuotient: observable,
      setDuration: action,
      setOperators: action,
      setMaxSum: action,
      setMaxMinuend: action,
      setMaxMultiplier1: action,
      setMaxMultiplier2: action,
      setMaxDivisor: action,
      setMaxQuotient: action
    });
  }

  setDuration(duration: number): void {
    if (durationsAvailable.includes(duration)) {
      this.duration = duration;
    }
  }

  setOperators(operators: Array<Operator>): void {
    this.operators = operators;
  }

  setMaxSum(maxSum: number): void {
    this.maxSum = maxSum;
  }

  setMaxMinuend(maxMinuend: number): void {
    this.maxMinuend = maxMinuend;
  }

  setMaxMultiplier1(maxMultiplier1: number): void {
    this.maxMultiplier1 = maxMultiplier1;
  }

  setMaxMultiplier2(maxMultiplier2: number): void {
    this.maxMultiplier2 = maxMultiplier2;
  }

  setMaxDivisor(maxDivisor: number): void {
    this.maxDivisor = maxDivisor;
  }

  setMaxQuotient(maxQuotient: number): void {
    this.maxQuotient = maxQuotient;
  }
}

export default SettingsStore;
