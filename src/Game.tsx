import { random, createOperation } from './utils';

class Game {
  store: GameStore;
  canvas: HTMLCanvasElement;
  horseZoneWidth: number;
  sprites: Sprites;
  duration: number;
  challenges: Array<Challenge | null>;
  challengeConcurrency = 5;
  maxChallengesCount = 5;
  minChallengeDuration = 5;
  maxChallengeDuration = 10;

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

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    this.animationFrame = this.animationFrame.bind(this);
    window.requestAnimationFrame(this.animationFrame);
  }

  destroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize(): void {
    this.horseZoneWidth = this.calculateHorseZoneWidth();
  }

  calculateHorseZoneWidth(): number {
    return this.canvas.width - 200;
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
      }
    });

    if (this.challengesCount === this.challengeConcurrency) {
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
  }

  render(context: CanvasRenderingContext2D, time: number): void {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const horseRenderFramesPerSpriteFrame = 3;
    const horseRenderFrames = this.sprites.horse.count * horseRenderFramesPerSpriteFrame;
    this.challenges.forEach((challenge, challengeIndex) => {
      if (!challenge) {
        return;
      }

      const { startTime, duration, operation, horseRenderFrame } = challenge;

      // Render a horse
      const { horse } = this.sprites;
      const horseSpriteFrame = Math.floor(horseRenderFrame / horseRenderFramesPerSpriteFrame);
      const scalePoint = horse.height * this.maxChallengesCount;
      const offsetHeight = this.canvas.height < scalePoint ? 0 : (this.canvas.height - scalePoint) / 2;
      const scale = this.canvas.height < scalePoint ? this.canvas.height / scalePoint : 1;
      const horseX = (time - startTime) / (duration * 1000) * (this.horseZoneWidth - horse.width * scale);
      const horseY = offsetHeight + horse.height * scale * challengeIndex;
      horse.draw(context, horseSpriteFrame, horseX, horseY, scale);

      // Split horze zone and action zone
      const splitVerticalGap = 15;
      context.beginPath();
      context.strokeStyle = '#eee';
      context.moveTo(this.horseZoneWidth + 0.5, splitVerticalGap);
      context.lineWidth = 1;
      context.lineTo(this.horseZoneWidth + 0.5, this.canvas.height - splitVerticalGap);
      context.stroke();

      challenge.horseRenderFrame++;
      if (challenge.horseRenderFrame === horseRenderFrames) {
        challenge.horseRenderFrame = 0;
      }

      // Render operation
    });
  }
}

export default Game;
