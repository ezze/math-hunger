class Sprite {
  url: string;
  width: number;
  height: number;
  count: number;
  imageWidth: number | null = null;
  imageHeight: number | null = null;
  image: HTMLImageElement | null = null;
  sprites: Array<HTMLCanvasElement> = [];

  constructor(options: SpriteOptions) {
    const { url, width, height, count } = options;
    this.url = url;
    this.width = width;
    this.height = height;
    this.count = count;
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
      throw new TypeError('Image is not loaded.');
    }
    this.sprites = [];
    const columns = Math.floor(this.imageWidth / this.width);
    const row = Math.floor(this.imageHeight / this.height);
    for (let i = 0; i < this.count; i++) {
      const sprite = document.createElement('canvas');
      sprite.width = this.width;
      sprite.height = this.height;
      const column = i - row * columns;
      const x = column * this.width;
      const y = row * this.height;
      const context = sprite.getContext('2d');
      if (!context) {
        throw new Error('Unable to get 2D context.');
      }
      context.drawImage(this.image, x, y, this.imageWidth, this.imageHeight, 0, 0, this.width, this.height);
      this.sprites.push(sprite);
    }
  }

  draw(context: CanvasRenderingContext2D, index: number, x: number, y: number): void {
    if (index < 0 || index >= this.count) {
      throw new RangeError('Sprite index is out of bounds');
    }
    const sprite = this.sprites[index];
    context.drawImage(sprite, x, y);
  }
}

export default Sprite;
