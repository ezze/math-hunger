import { random, createOperation, getOperationText } from './utils';

import { operationZoneWidth, splitGapSize, colors } from './constants';

class Game {
  store: GameStore;
  canvas: HTMLCanvasElement;
  sprites: Sprites;
  duration: number;
  challenges: Array<Challenge | null>;
  challengeConcurrency = 5;
  maxChallengesCount = 5;
  minChallengeDuration = 5;
  maxChallengeDuration = 10;
  minChallengeDelay = 1;
  maxChallengeDelay = 3;
  challengeDelay = 0;
  activeChallengeIndex: number | null = null;
  horseZoneWidth: number;
  horseLastStartTime: number | null = null;
  horseLastEndTime: number | null = null;

  constructor(options: GameOptions) {
    const {
      store,
      canvas,
      sprites,
      duration
    } = options;

    this.store = store;
    this.canvas = canvas;
    this.horseZoneWidth = this.calculateHorseZoneWidth();
    this.sprites = sprites;
    this.duration = duration;
    this.challenges = new Array(this.maxChallengesCount).fill(null);

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
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      this.moveToPreviousChallenge();
    }
    else if (event.key === 'ArrowDown') {
      this.moveToNextChallenge();
    }
    else if (event.ctrlKey && event.key === 'c') {
      this.store.setPlaying(false);
    }
  }

  onWindowResize(): void {
    this.horseZoneWidth = this.calculateHorseZoneWidth();
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

  get challengesCount(): number {
    return this.challenges.reduce((count, challenge) => {
      return challenge ? count + 1 : count;
    }, 0);
  }

  animationFrame(time: number): void {
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
      const { startTime, duration } = challenge;
      if (time > startTime + duration * 1000) {
        this.challenges[challengeIndex] = null;
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

    const challenge: Challenge = {
      startTime: time,
      duration: random(this.minChallengeDuration, this.maxChallengeDuration),
      operation: createOperation({
        allowedOperators: ['add', 'subtract', 'multiply', 'divide']
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
        context.beginPath();
        context.strokeStyle = '#e80';
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
        operation,
        horseRenderFrame
      } = challenge;

      // Render a horse
      const horseSpriteFrame = Math.floor(horseRenderFrame / horseRenderFramesPerSpriteFrame);
      const horseX = (time - startTime) / (duration * 1000) * (this.horseZoneWidth - horse.width * scale);
      const horseY = offsetHeight + challengeIndex * horse.height * scale;
      horse.draw(context, horseSpriteFrame, horseX, horseY, scale);

      // Render operation
      const operationFontSize = 36;
      const operationX = this.horseZoneWidth + 2 * splitGapSize;
      const operationY = offsetHeight + (challengeIndex + 0.5) * horse.height * scale;
      const operationWidth = operationZoneWidth - 3 * splitGapSize;
      context.font = `${operationFontSize}px Ubuntu Mono`;
      context.fillStyle = colors[challengeIndex % colors.length];
      context.textBaseline = 'middle';
      context.fillText(getOperationText(operation), operationX, operationY, operationWidth);

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
