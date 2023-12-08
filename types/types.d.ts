type TypedKeys<T, V> = keyof { [ P in keyof T as T[P] extends V ? P : never ] : P };

type StoreData = Record<string, unknown>;
type SettingsTab = 'basic' | 'math' | 'gameplay';

type Operator = 'add' | 'subtract' | 'multiply' | 'divide';
type Sound = 'correct' | 'wrong' | 'gameOver';
type SoundBlobs = Record<Sound | string, Blob | null>;

declare interface StoreOptions {
  key?: string;
  include?: Array<string>;
  exclude?: Array<string>;
  saveDelayMs?: number;
}

declare interface GameOptions {
  store: GameStore;
  canvas: HTMLCanvasElement;
  animationSprites: AnimationSprites;
  operators?: Array<Operator>;
  maxSum?: number;
  maxMinuend?: number;
  maxMultiplier1?: number;
  maxMultiplier2?: number;
  maxDivisor?: number;
  maxQuotient?: number;
  challengeConcurrency?: number;
  maxChallengesCount?: number;
  minChallengeDuration?: number;
  maxChallengeDuration?: number;
  minChallengeDelay?: number;
  maxChallengeDelay?: number;
}

declare interface SpriteOptions {
  url: string;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
  count?: number;
  framesPerSprite?: number;
}

declare class Sprite {
  url: string;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  count: number;
  framesPerSprite: number;
  image: HTMLImageElement | null;
  sprites: Array<HTMLCanvasElement>;
  constructor(options: SpriteOptions)
  init: () => Promise<void>;
  draw: (context: CanvasRenderingContext2D, index: number, x: number, y: number, scale = 1) => void
}

declare interface WithSpriteOptions {
  sprites: Sprites;
}

interface CreateAdditionOperationOptions {
  maxSum: number;
}

interface CreateSubtractionOperationOptions {
  maxMinuend: number;
}

interface CreateMultiplicationOperationOptions {
  maxMultiplier1: number;
  maxMultiplier2: number;
}

interface CreateDivisionOperationOptions {
  maxDivisor: number;
  maxQuotient: number;
}

interface CreateOperationOptions extends
  CreateAdditionOperationOptions, CreateSubtractionOperationOptions,
  CreateMultiplicationOperationOptions, CreateDivisionOperationOptions {
  allowedOperators: Array<Operator>;
}

interface Operation {
  operator: Operator;
  operand1: number;
  operand2: number;
  answer: number;
}

declare interface Challenge {
  numericId: number;
  startTime: number;
  duration: number;
  fadeOutStartTime: number;
  operation: Operation;
  renderFrame: number;
  answer?: number;
  correct?: boolean;
}

declare interface BestResult {
  name: string;
  correctCount: number;
  wrongCount: number;
  missedCount: number;
  score: number;
  incorrectItems: Array<{
    type: string;
    operation: string;
  }>;
  time: string;
}
