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
    context.fillStyle = 'green';
    context.fillRect(0, 0, 100, 100);
    const { horse } = this.sprites;
    horse.draw(context, 0, 0, 0);
  }
}

export default Game;
