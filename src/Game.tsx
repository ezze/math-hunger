import { random, createOperation } from './utils';

class Game {
  store: GameStore;
  canvas: HTMLCanvasElement;
  sprites: Sprites;
  duration: number;
  challenges: Array<Challenge | null>;
  challengeConcurrency = 2;
  maxChallengesCount = 3;
  minChallengeDuration = 20;
  maxChallengeDuration = 40;

  constructor(options: GameOptions) {
    const {
      store,
      canvas,
      sprites,
      duration
    } = options;

    this.store = store;
    this.canvas = canvas;
    this.sprites = sprites;
    this.duration = duration;
    this.challenges = new Array(this.maxChallengesCount).fill(null);

    this.animationFrame = this.animationFrame.bind(this);
    window.requestAnimationFrame(this.animationFrame);
  }

  destroy(): void {
    // TODO
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
      this.render(context);
    }
    window.requestAnimationFrame(this.animationFrame);
  }

  updateChallenges(time: number): void {
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

  render(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const horseRenderFramesPerSpriteFrame = 3;
    const horseRenderFrames = this.sprites.horse.count * horseRenderFramesPerSpriteFrame;
    this.challenges.forEach((challenge, challengeIndex) => {
      if (!challenge) {
        return;
      }

      const { horse } = this.sprites;
      const spriteFrame = Math.floor(challenge.horseRenderFrame / horseRenderFramesPerSpriteFrame);
      const scalePoint = horse.height * this.maxChallengesCount;
      const offsetHeight = this.canvas.height < scalePoint ? 0 : (this.canvas.height - scalePoint) / 2;
      const scale = this.canvas.height < scalePoint ? this.canvas.height / scalePoint : 1;
      horse.draw(context, spriteFrame, 0, offsetHeight + horse.height * challengeIndex, scale);

      challenge.horseRenderFrame++;
      if (challenge.horseRenderFrame === horseRenderFrames) {
        challenge.horseRenderFrame = 0;
      }
    });
  }
}

export default Game;
