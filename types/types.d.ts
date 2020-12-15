declare const appVersion: string;
declare module '*.jpg';
declare module '*.png';
declare module '*.mp3';

type Stores = Record<string, Store>;
type StoreData = Record<string, any>;
type SettingsTab = 'basic' | 'math' | 'gameplay';
type Sprites = Record<string, Sprite>;
type Operator = 'add' | 'subtract' | 'multiply' | 'divide';
type Sound = 'correct' | 'wrong' | 'gameOver';
type SoundBlobs = Record<Sound | string, Blob | null>;

declare interface StoreOptions {
  key?: string;
  include?: Array<string>;
  exclude?: Array<string>;
  saveDelayMs?: number;
}

declare class Store {
  constructor(options: StoreOptions);
  init(): Promise<StoreData>;
  load(): Promise<StoreData>;
  save(data: StoreData): Promise<void>;
}

declare class SettingsStore extends Store {
  tab: SettingsTab;
  language: string;
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
  sound: boolean;
  music: boolean;
  hash: string;
  setTab(tab: SettingsTab): void;
  setLanguage(language: string): void;
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
  setSound(sound: boolean): void;
  setMusic(music: boolean): void;
}

declare class GameStore extends Store {
  playing: boolean;
  gameOver: boolean;
  lastResult: BestResult | null;
  correctCount: number;
  wrongCount: number;
  missedCount: number;
  overallCount: number;
  score: number;
  leftTimeFormatted: string;
  start(duration: number): void;
  end(): void;
  interrupt(): void;
  reset(): void;
  finish(): void;
  increaseCorrectCount(): void;
  increaseWrongCount(): void;
  increaseMissedCount(): void;
}

declare class BestResultsStore extends Store {
  name: string;
  bestResults: Record<string, Array<BestResult>> = {};
  setName(name: string): void;
  add(hash: string, bestResult: BestResult): void
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
  startTime: number;
  duration: number;
  fadeOutStartTime: number;
  operation: Operation;
  horseRenderFrame: number;
  answer?: number;
  correct?: boolean;
}

declare interface BestResult {
  name: string;
  correctCount: number;
  wrongCount: number;
  missedCount: number;
  score: number;
  time: string;
}
