import { playSound } from './sound';

import {
  random,
  createOperation,
  getOperationText
} from './utils';

import {
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
  maxChallengeDelayDefault,
  operationZoneWidth,
  splitGapSize,
  colors
} from './constants';

const challengeFadeTimeoutMs = 1000;
const maxAnswerDigitsCount = 3;

class Game {
  store: GameStore;
  canvas: HTMLCanvasElement;
  sprites: Sprites;

  operators: Array<Operator>;
  maxSum: number;
  maxMinuend: number;
  maxMultiplier1: number;
  maxMultiplier2: number;
  maxDivisor: number;
  maxQuotient: number;

  challengeConcurrency: number;
  maxChallengesCount: number;
  minChallengeDuration: number;
  maxChallengeDuration: number;
  minChallengeDelay: number;
  maxChallengeDelay: number;

  challenges: Array<Challenge | null>;
  challengeDelay = 0;
  activeChallengeIndex: number | null = null;

  horseZoneWidth: number;
  horseLastStartTime: number | null = null;
  horseLastEndTime: number | null = null;

  destroyed = false;

  constructor(options: GameOptions) {
    const {
      store,
      canvas,
      sprites,
      operators = operatorsDefault,
      maxSum = maxSumDefault,
      maxMinuend = maxMinuendDefault,
      maxMultiplier1 = maxMultiplierDefault,
      maxMultiplier2 = maxMultiplierDefault,
      maxDivisor = maxDivisorDefault,
      maxQuotient = maxQuotientDefault,
      challengeConcurrency = challengeConcurrencyDefault,
      maxChallengesCount = maxChallengesCountDefault,
      minChallengeDuration = minChallengeDurationDefault,
      maxChallengeDuration = maxChallengeDurationDefault,
      minChallengeDelay = minChallengeDelayDefault,
      maxChallengeDelay = maxChallengeDelayDefault
    } = options;

    this.store = store;
    this.canvas = canvas;
    this.sprites = sprites;

    this.operators = operators;
    this.maxSum = maxSum;
    this.maxMinuend = maxMinuend;
    this.maxMultiplier1 = maxMultiplier1;
    this.maxMultiplier2 = maxMultiplier2;
    this.maxDivisor = maxDivisor;
    this.maxQuotient = maxQuotient;

    this.challengeConcurrency = challengeConcurrency;
    this.maxChallengesCount = maxChallengesCount;
    this.minChallengeDuration = minChallengeDuration;
    this.maxChallengeDuration = maxChallengeDuration;
    this.minChallengeDelay = minChallengeDelay;
    this.maxChallengeDelay = maxChallengeDelay;

    this.challenges = new Array(this.maxChallengesCount).fill(null);

    this.horseZoneWidth = this.calculateHorseZoneWidth();

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    document.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('resize', this.onWindowResize);

    this.animationFrame = this.animationFrame.bind(this);
    window.requestAnimationFrame(this.animationFrame);
  }

  destroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('resize', this.onWindowResize);
    this.challenges.forEach((challenge, challengeIndex) => {
      this.challenges[challengeIndex] = null;
    });
    this.destroyed = true;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      this.moveToPreviousChallenge();
    }
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      this.moveToNextChallenge();
    }
    else if (event.keyCode >= 48 && event.keyCode <= 57) {
      this.addAnswerDigit(parseInt(event.key, 10));
    }
    else if (event.key === 'Enter') {
      this.checkAnswer();
    }
    else if (event.key === 'Backspace') {
      this.removeAnswerDigit();
    }
    else if (event.key === 'Escape') {
      this.clearAnswer();
    }
    else if (event.ctrlKey && event.key === 'c') {
      this.store.interrupt();
    }
  }

  onWindowResize(): void {
    this.horseZoneWidth = this.calculateHorseZoneWidth();
  }

  get challengesCount(): number {
    return this.challenges.reduce((count, challenge) => {
      return challenge ? count + 1 : count;
    }, 0);
  }

  getActiveChallenge(): Challenge | null {
    if (this.activeChallengeIndex !== null && this.challenges[this.activeChallengeIndex]) {
      return this.challenges[this.activeChallengeIndex];
    }
    return null;
  }

  moveToPreviousChallenge(): void {
    if (this.activeChallengeIndex !== null) {
      this.activeChallengeIndex--;
      if (this.activeChallengeIndex < 0) {
        this.activeChallengeIndex = this.challenges.length - 1;
      }
    }
  }

  moveToNextChallenge(): void {
    if (this.activeChallengeIndex !== null) {
      this.activeChallengeIndex++;
      if (this.activeChallengeIndex >= this.challenges.length) {
        this.activeChallengeIndex = 0;
      }
    }
  }

  finalizeChallenge(challengeIndex: number, force = false): void {
    const challenge = this.challenges[challengeIndex];
    if (!challenge) {
      return;
    }
    if (force || typeof challenge.correct !== 'boolean') {
      if (typeof challenge.correct !== 'boolean') {
        this.store.increaseMissedCount();
      }
      this.challenges[challengeIndex] = null;
    }
    else {
      if (challenge.correct) {
        playSound('correct').catch(e => console.log(e));
        this.store.increaseCorrectCount();
      }
      else {
        playSound('wrong').catch(e => console.log(e));
        this.store.increaseWrongCount();
      }
      window.setTimeout(() => this.challenges[challengeIndex] = null, challengeFadeTimeoutMs);
    }
  }

  addAnswerDigit(digit: number): void {
    const challenge = this.getActiveChallenge();
    if (!challenge) {
      return;
    }
    if (challenge.answer === undefined) {
      challenge.answer = digit;
    }
    else if (`${challenge.answer}`.length < maxAnswerDigitsCount) {
      challenge.answer = challenge.answer * 10 + digit;
    }
  }

  checkAnswer(): void {
    const challenge = this.getActiveChallenge();
    if (!challenge || challenge.answer === undefined || typeof challenge.correct === 'boolean') {
      return;
    }
    challenge.correct = challenge.answer === challenge.operation.answer;
    const { activeChallengeIndex: challengeIndex } = this;
    this.finalizeChallenge(challengeIndex as number);
  }

  removeAnswerDigit(): void {
    const challenge = this.getActiveChallenge();
    if (!challenge || challenge.answer === undefined) {
      return;
    }
    challenge.answer = (challenge.answer - challenge.answer % 10) / 10 || undefined;
  }

  clearAnswer(): void {
    const challenge = this.getActiveChallenge();
    if (!challenge) {
      return;
    }
    challenge.answer = undefined;
  }

  calculateHorseZoneWidth(): number {
    return this.canvas.width - operationZoneWidth;
  }

  updateChallengeDelay(): void {
    this.challengeDelay = random(this.minChallengeDelay, this.maxChallengeDelay);
  }

  detectHorseLastStartTime(): number | null {
    return this.challenges.reduce((lastEventTime: number | null, challenge) => {
      if (!challenge || (lastEventTime && challenge.startTime <= lastEventTime)) {
        return lastEventTime;
      }
      return challenge.startTime;
    }, null);
  }

  animationFrame(time: number): void {
    if (this.destroyed) {
      return;
    }
    this.updateChallenges(time);
    const context = this.canvas.getContext('2d');
    if (context) {
      this.render(context, time);
    }
    window.requestAnimationFrame(this.animationFrame);
  }

  updateChallenges(time: number): void {
    // Checking whether time for some challenges are over
    this.challenges.forEach((challenge, challengeIndex) => {
      if (!challenge) {
        return;
      }
      const { startTime, duration, fadeOutStartTime, correct } = challenge;
      if (typeof correct === 'boolean' && time < fadeOutStartTime) {
        challenge.fadeOutStartTime = time;
      }
      else if (time > startTime + duration * 1000) {
        this.finalizeChallenge(challengeIndex, true);
        if (!this.horseLastEndTime) {
          this.horseLastEndTime = time;
        }
      }
    });

    const { challengesCount } = this;
    if (challengesCount === this.challengeConcurrency || (
      challengesCount > 0 && (
        (this.horseLastStartTime && this.horseLastStartTime + this.challengeDelay * 1000 >= time) ||
        (this.horseLastEndTime && this.horseLastEndTime + this.challengeDelay * 1000 >= time)
      )
    )) {
      return;
    }

    const duration = random(this.minChallengeDuration, this.maxChallengeDuration);
    const challenge: Challenge = {
      startTime: time,
      duration,
      fadeOutStartTime: time + duration * 1000 - challengeFadeTimeoutMs,
      operation: createOperation({
        allowedOperators: this.operators,
        maxSum: this.maxSum,
        maxMinuend: this.maxMinuend,
        maxMultiplier1: this.maxMultiplier1,
        maxMultiplier2: this.maxMultiplier2,
        maxDivisor: this.maxDivisor,
        maxQuotient: this.maxQuotient
      }),
      horseRenderFrame: 0
    };

    let index;
    do {
      index = random(0, this.challenges.length - 1);
    }
    while (this.challenges[index] !== null);
    this.challenges[index] = challenge;
    this.horseLastStartTime = this.detectHorseLastStartTime();
    if (this.horseLastEndTime) {
      this.horseLastEndTime = null;
    }
    this.updateChallengeDelay();
    if (this.activeChallengeIndex === null) {
      this.activeChallengeIndex = index;
    }
  }

  render(context: CanvasRenderingContext2D, time: number): void {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Preparing some basic constants for rendering
    const { horse } = this.sprites;
    const scalePoint = horse.height * this.maxChallengesCount;
    const scale = this.canvas.height < scalePoint ? this.canvas.height / scalePoint : 1;
    const offsetHeight = this.canvas.height < scalePoint ? 0 : (this.canvas.height - scalePoint) / 2;
    const horseRenderFramesPerSpriteFrame = 3;
    const horseRenderFrames = horse.count * horseRenderFramesPerSpriteFrame;

    this.challenges.forEach((challenge, challengeIndex) => {
      // Render active challenge marker
      if (this.activeChallengeIndex === challengeIndex) {
        let markerColor = '#319fe3';
        if (challenge && typeof challenge.correct === 'boolean') {
          markerColor = challenge.correct ? '#090' : '#c00';
        }
        context.beginPath();
        context.strokeStyle = markerColor;
        context.lineWidth = 8;
        context.lineCap = 'round';
        const startY = offsetHeight + challengeIndex * horse.height * scale + splitGapSize;
        const endY = startY + horse.height * scale - 2 * splitGapSize;
        context.moveTo(this.horseZoneWidth + splitGapSize + 0.5, startY);
        context.lineTo(this.horseZoneWidth + splitGapSize + 0.5, endY);
        context.stroke();
      }

      if (!challenge) {
        return;
      }

      const {
        startTime,
        duration,
        fadeOutStartTime,
        operation,
        horseRenderFrame,
        answer
      } = challenge;

      // Render a horse
      const horseSpriteFrame = Math.floor(horseRenderFrame / horseRenderFramesPerSpriteFrame);
      const horseX = (time - startTime) / (duration * 1000) * (this.horseZoneWidth - horse.width * scale);
      const horseY = offsetHeight + challengeIndex * horse.height * scale;
      let opacity = 1;
      if (time - startTime < challengeFadeTimeoutMs) {
        opacity = (time - startTime) / challengeFadeTimeoutMs;
      }
      else if (time > fadeOutStartTime && time < fadeOutStartTime + challengeFadeTimeoutMs) {
        opacity = (fadeOutStartTime + challengeFadeTimeoutMs - time) / challengeFadeTimeoutMs;
      }
      context.globalAlpha = opacity;
      horse.draw(context, horseSpriteFrame, horseX, horseY, scale);

      // Render operation
      const operationFontSize = 36;
      const operationX = this.horseZoneWidth + 2 * splitGapSize;
      const operationY = offsetHeight + (challengeIndex + 0.5) * horse.height * scale;
      const operationWidth = operationZoneWidth - 3 * splitGapSize;
      context.font = `${operationFontSize}px Ubuntu Mono`;
      context.fillStyle = colors[challengeIndex % colors.length];
      context.textBaseline = 'middle';
      const operationText = `${getOperationText(operation)} = ${typeof answer === 'number' ? answer : ''}`;
      context.fillText(operationText, operationX, operationY, operationWidth);
      context.globalAlpha = 1;

      // Render split line
      context.beginPath();
      context.strokeStyle = '#eee';
      context.lineWidth = 1;
      context.moveTo(this.horseZoneWidth + 0.5, splitGapSize);
      context.lineTo(this.horseZoneWidth + 0.5, this.canvas.height - splitGapSize);
      context.stroke();

      challenge.horseRenderFrame++;
      if (challenge.horseRenderFrame === horseRenderFrames) {
        challenge.horseRenderFrame = 0;
      }
    });
  }
}

export default Game;
