class Sprite {
  url: string;
  width: number;
  height: number;
  count: number;
  rotationFrames: number | null = null;
  imageWidth: number | null = null;
  imageHeight: number | null = null;
  image: HTMLImageElement | null = null;
  sprites: Array<HTMLCanvasElement> = [];

  constructor(options: SpriteOptions) {
    const { url, width, height, count, rotationFrames } = options;
    this.url = url;
    this.width = width;
    this.height = height;
    this.count = count;
    this.rotationFrames = rotationFrames || null;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = this.image = new Image();
      image.onload = () => {
        try {
          const { width: imageWidth, height: imageHeight } = image;
          this.imageWidth = imageWidth;
          this.imageHeight = imageHeight;
          this.crop();
          resolve();
        }
        catch (e) {
          reject(e);
        }
      };
      image.onerror = e => reject(e);
      image.src = this.url;
    });
  }

  crop(): void {
    if (this.image === null || this.imageWidth === null || this.imageHeight === null) {
      throw new TypeError('Image is not loaded');
    }
    this.sprites = [];
    const columns = Math.floor(this.imageWidth / this.width);
    for (let index = 0; index < this.count; index++) {
      const sprite = document.createElement('canvas');
      sprite.width = this.width;
      sprite.height = this.height;
      const row = Math.floor(index / columns);
      const column = index - row * columns;
      const x = column * this.width;
      const y = row * this.height;
      const context = sprite.getContext('2d');
      if (!context) {
        throw new Error('Unable to get 2D context');
      }
      context.drawImage(this.image, x, y, this.width, this.height, 0, 0, this.width, this.height);
      this.sprites.push(sprite);
    }
  }

  draw(context: CanvasRenderingContext2D, index: number, x: number, y: number, scale = 1, frame = 0): void {
    if (index < 0 || index >= this.count) {
      throw new RangeError('Sprite index is out of bounds');
    }
    const sprite = this.sprites[index];
    const sx = 0;
    const sy = 0;
    const sw = sprite.width;
    const sh = sprite.height;
    const dx = x;
    const dy = y;
    const dw = sprite.width * scale;
    const dh = sprite.height * scale;
    
    if (this.rotationFrames && this.rotationFrames > 1) {
      const rotationFrame = frame % this.rotationFrames;
      context.rotate((rotationFrame / this.rotationFrames) * 2 * Math.PI);
    }
    context.drawImage(sprite, sx, sy, sw, sh, dx, dy, dw, dh);
    context.rotate(0);
  }
}

export default Sprite;
