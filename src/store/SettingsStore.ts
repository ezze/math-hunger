import {
  makeObservable,
  observable,
  action,
  computed
} from 'mobx';

import objectHash from 'object-hash';

import {
  operatorsAvailable,
  durationsAvailable,
  settingsTabDefault,
  durationDefault,
  operatorsDefault,
  maxSumDefault,
  maxMinuendDefault,
  maxMultiplierDefault,
  maxDivisorDefault,
  maxQuotientDefault,
  challengeConcurrencyDefault,
  maxChallengesCountDefault,
  minChallengeDurationDefault,
  maxChallengeDurationDefault,
  minChallengeDelayDefault,
  maxChallengeDelayDefault
} from '../constants';

import Store from './Store';

class SettingsStore extends Store {
  tab: SettingsTab = settingsTabDefault;
  duration = durationDefault;
  operators: Array<Operator> = operatorsDefault;
  maxSum = maxSumDefault;
  maxMinuend = maxMinuendDefault;
  maxMultiplier1 = maxMultiplierDefault;
  maxMultiplier2 = maxMultiplierDefault;
  maxDivisor = maxDivisorDefault;
  maxQuotient = maxQuotientDefault;
  challengeConcurrency = challengeConcurrencyDefault;
  maxChallengesCount = maxChallengesCountDefault;
  minChallengeDuration = minChallengeDurationDefault;
  maxChallengeDuration = maxChallengeDurationDefault;
  minChallengeDelay = minChallengeDelayDefault;
  maxChallengeDelay = maxChallengeDelayDefault;

  constructor(options: StoreOptions) {
    super({
      ...options,
      include: [
        'tab',
        'duration',
        'operators',
        'maxSum',
        'maxMinuend',
        'maxMultiplier1',
        'maxMultiplier2',
        'maxDivisor',
        'maxQuotient',
        'challengeConcurrency',
        'maxChallengesCount',
        'minChallengeDuration',
        'maxChallengeDuration',
        'minChallengeDelay',
        'maxChallengeDelay'
      ]
    });

    makeObservable(this, {
      tab: observable,
      duration: observable,
      operators: observable.shallow,
      maxSum: observable,
      maxMinuend: observable,
      maxMultiplier1: observable,
      maxMultiplier2: observable,
      maxDivisor: observable,
      maxQuotient: observable,
      challengeConcurrency: observable,
      maxChallengesCount: observable,
      minChallengeDuration: observable,
      maxChallengeDuration: observable,
      minChallengeDelay: observable,
      maxChallengeDelay: observable,
      hash: computed,
      setTab: action,
      setDuration: action,
      setOperators: action,
      setMaxSum: action,
      setMaxMinuend: action,
      setMaxMultiplier1: action,
      setMaxMultiplier2: action,
      setMaxDivisor: action,
      setMaxQuotient: action,
      setChallengeConcurrency: action,
      setMaxChallengesCount: action,
      setMinChallengeDuration: action,
      setMaxChallengeDuration: action,
      setMinChallengeDelay: action,
      setMaxChallengeDelay: action
    });
  }

  get hash(): string {
    const object = {
      duration: this.duration,
      operators: this.operators,
      challengeConcurrency: this.challengeConcurrency,
      maxChallengesCount: this.maxChallengesCount,
      minChallengeDuration: this.minChallengeDuration,
      maxChallengeDuration: this.maxChallengeDuration,
      minChallengeDelay: this.minChallengeDelay,
      maxChallengeDelay: this.maxChallengeDelay
    };

    if (this.operators.includes('add')) {
      Object.assign(object, {
        maxSum: this.maxSum
      });
    }

    if (this.operators.includes('subtract')) {
      Object.assign(object, {
        maxMinuend: this.maxMinuend
      });
    }

    if (this.operators.includes('multiply')) {
      Object.assign(object, {
        maxMultiplier1: this.maxMultiplier1,
        maxMultiplier2: this.maxMultiplier2
      });
    }

    if (this.operators.includes('divide')) {
      Object.assign(object, {
        maxDivisor: this.maxDivisor,
        maxQuotient: this.maxQuotient
      });
    }

    return objectHash(object).slice(0, 6);
  }

  setTab(tab: SettingsTab): void {
    this.tab = tab;
  }

  setDuration(duration: number): void {
    if (durationsAvailable.includes(duration)) {
      this.duration = duration;
    }
  }

  setOperators(operators: Array<Operator>): void {
    const orderedOperators = new Array<Operator>();
    operatorsAvailable.forEach(operator => {
      if (operators.includes(operator)) {
        orderedOperators.push(operator);
      }
    });
    this.operators = orderedOperators;
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

  setChallengeConcurrency(challengeConcurrency: number): void {
    this.challengeConcurrency = challengeConcurrency;
  }

  setMaxChallengesCount(maxChallengesCount: number): void {
    this.maxChallengesCount = maxChallengesCount;
  }

  setMinChallengeDuration(minChallengeDuration: number): void {
    this.minChallengeDuration = minChallengeDuration;
  }

  setMaxChallengeDuration(maxChallengeDuration: number): void {
    this.maxChallengeDuration = maxChallengeDuration;
  }

  setMinChallengeDelay(minChallengeDelay: number): void {
    this.minChallengeDelay = minChallengeDelay;
  }

  setMaxChallengeDelay(maxChallengeDelay: number): void {
    this.maxChallengeDelay = maxChallengeDelay;
  }
}

export default SettingsStore;
