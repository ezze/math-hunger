class Game {
  store: GameStore;
  canvas: HTMLCanvasElement;
  sprites: Sprites;
  duration: number;
  i = 0;

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

    this.animationFrame = this.animationFrame.bind(this);
    window.requestAnimationFrame(this.animationFrame);
  }

  destroy() {
    // TODO
  }

  animationFrame(time: number) {
    const context = this.canvas.getContext('2d');
    if (context) {
      this.render(context, time);
    }
    window.requestAnimationFrame(this.animationFrame);
  }

  render(context: CanvasRenderingContext2D, time: number): void {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const { horse } = this.sprites;
    const delay = 3;
    const index = Math.floor(this.i / delay);
    const horseCount = 3;
    const scalePoint = horse.height * horseCount;
    const offsetHeight = this.canvas.height < scalePoint ? 0 : (this.canvas.height - scalePoint) / 2;
    const scale = this.canvas.height < scalePoint ? this.canvas.height / scalePoint : 1;
    for (let horseIndex = 0; horseIndex < horseCount; horseIndex++) {
      horse.draw(context, index, 0, offsetHeight + horse.height * horseIndex, scale);
    }
    this.i++;
    if (this.i === delay * horse.count) {
      this.i = 0;
    }
  }
}

export default Game;
