declare module '*.jpg';
declare module '*.png';
declare module 'sprintf-js';

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

type SettingsTab = 'basic' | 'math' | 'gameplay';

declare class SettingsStore extends Store {
  tab: SettingsTab;
  duration: number;
  operators: Array<Operator>;
  maxSum: number;
  maxMinuend: number;
  maxMultiplier1: number;
  maxMultiplier2: number;
  maxDivisor: number;
  maxQuotient: number;
  challengeConcurrency: number;
  maxChallengesCount: number;
  minChallengeDuration: number;
  maxChallengeDuration: number;
  minChallengeDelay: number;
  maxChallengeDelay: number;
  setTab(tab: SettingsTab): void;
  setDuration(duration: number): void;
  setOperators(operators: Array<Operator>): void;
  setMaxSum(maxSum: number): void;
  setMaxMinuend(maxMinuend: number): void;
  setMaxMultiplier1(maxMultiplier1: number): void;
  setMaxMultiplier2(maxMultiplier2: number): void;
  setMaxDivisor(maxDivisor: number): void;
  setMaxQuotient(maxQuotient: number): void;
  setChallengeConcurrency(challengeConcurrency: number): void;
  setMaxChallengesCount(maxChallengesCount: number): void;
  setMinChallengeDuration(minChallengeDuration: number): void;
  setMaxChallengeDuration(maxChallengeDuration: number): void;
  setMinChallengeDelay(minChallengeDelay: number): void;
  setMaxChallengeDelay(maxChallengeDelay: number): void;
}

declare class GameStore extends Store {
  playing: boolean;
  start(duration: number): void;
  end(): void;
  interrupt(): void;
  correctCount: number;
  increaseCorrectCount(): void;
  wrongCount: number;
  increaseWrongCount(): void;
  missedCount: number;
  increaseMissedCount(): void;
  overallCount: number;
  leftTimeFormatted: string;
}

declare interface GameOptions {
  store: GameStore;
  canvas: HTMLCanvasElement;
  sprites: Sprites;
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

declare class Game {
  constructor(options: GameOptions);
  destroy(): void;
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
  startTime: number;
  duration: number;
  fadeOutStartTime: number;
  operation: Operation;
  horseRenderFrame: number;
  answer?: number;
  correct?: boolean;
}
