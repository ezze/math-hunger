export type Operator = 'add' | 'subtract' | 'multiply' | 'divide';

export interface Operation {
  operator: Operator;
  operand1: number;
  operand2: number;
  answer: number;
}

export interface CreateAdditionOperationOptions {
  maxSum: number;
}

export interface CreateSubtractionOperationOptions {
  maxMinuend: number;
}

export interface CreateMultiplicationOperationOptions {
  maxMultiplier1: number;
  maxMultiplier2: number;
}

export interface CreateDivisionOperationOptions {
  maxDivisor: number;
  maxQuotient: number;
}

export interface CreateOperationOptions extends
  CreateAdditionOperationOptions, CreateSubtractionOperationOptions,
  CreateMultiplicationOperationOptions, CreateDivisionOperationOptions {
  allowedOperators: Array<Operator>;
}

export declare interface Challenge {
  numericId: number;
  startTime: number;
  duration: number;
  fadeOutStartTime: number;
  operation: Operation;
  renderFrame: number;
  answer?: number;
  correct?: boolean;
}

export declare interface BestResult {
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

export type SettingsTab = 'basic' | 'math' | 'gameplay';
