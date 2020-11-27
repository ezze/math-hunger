declare module '*.jpg';
declare module '*.png';

declare interface StoreOptions {
  key?: string;
  include?: Array<string>;
  exclude?: Array<string>;
  saveDelayMs?: number;
}

type StoreData = Record<string, any>;

declare class Store {
  constructor(options: StoreOptions);
  init(): Promise<StoreData>;
  load(): Promise<StoreData>;
  save(data: StoreData): Promise<void>;
}

declare class SettingsStore extends Store {
  duration: number;
  setDuration(duration: number): void;
}

declare class GameStore extends Store {
  playing: boolean;
  setPlaying(playing: boolean): void;
}

declare interface GameOptions {
  store: GameStore;
  canvas: HTMLCanvasElement;
  sprites: Sprites;
  duration: number;
}

declare interface SpriteOptions {
  url: string;
  width: number;
  height: number;
  count: number;
}

declare class Sprite {
  url: string;
  width: number;
  height: number;
  count: number;
  image: HTMLImageElement | null;
  sprites: Array<HTMLCanvasElement>;
  constructor(options: SpriteOptions)
  init: () => Promise<void>;
  draw: (context: CanvasRenderingContext2D, index: number, x: number, y: number, scale = 1) => void
}

type Sprites = Record<string, Sprite>;

declare interface WithSpriteOptions {
  sprites: Sprites;
}

type Operator = 'add' | 'subtract' | 'multiply' | 'divide';

interface Operation {
  operator: Operator;
  operand1: number;
  operand2: number;
  answer: number;
}

declare interface Challenge {
  startTime: number;
  duration: number;
  operation: Operation;
  horseRenderFrame: number;
}
