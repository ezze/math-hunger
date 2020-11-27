class Game {
  store: GameStore;
  canvas: HTMLCanvasElement;
  sprites: Sprites;
  duration: number;

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

    console.log(this.sprites);
  }

  async init() {

  }

  destroy() {

    // TODO
  }

  animationFrame(time: number) {
    window.requestAnimationFrame(this.animationFrame);
  }
}

export default Game;
