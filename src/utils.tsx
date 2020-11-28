import { maxMinuendDefault } from './constants';

export function delay(ms = 200): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function random(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min) + 0.5);
}

export function createOperation(options: CreateOperationOptions): Operation {
  const {
    allowedOperators,
    maxSum,
    maxMinuend,
    maxMultiplier1,
    maxMultiplier2,
    maxDivisor,
    maxQuotient
  } = options;
  const operatorIndex = random(0, allowedOperators.length - 1);
  const operator = allowedOperators[operatorIndex];
  switch (operator) {
    case 'add': return createAdditionOperation({ maxSum });
    case 'subtract': return createSubtractionOperation({ maxMinuend });
    case 'multiply': return createMultiplicationOperation({ maxMultiplier1, maxMultiplier2 });
    case 'divide': return createDivisionOperation({ maxDivisor, maxQuotient });
  }
}

export function createAdditionOperation(options: CreateAdditionOperationOptions): Operation {
  const { maxSum } = options;
  const operator: Operator = 'add';
  const operand1 = random(0, maxSum);
  const operand2 = random(0, maxSum - operand1);
  const answer = operand1 + operand2;
  return { operator, operand1, operand2, answer };
}

export function createSubtractionOperation(options: CreateSubtractionOperationOptions): Operation {
  const { maxMinuend } = options;
  const operator: Operator = 'subtract';
  const addOperation = createAdditionOperation({ maxSum: maxMinuend });
  const operand1 = addOperation.answer;
  const operand2 = random(0, 1) ? addOperation.operand1 : addOperation.operand2;
  const answer = operand1 - operand2;
  return { operator, operand1, operand2, answer };
}

export function createMultiplicationOperation(options: CreateMultiplicationOperationOptions): Operation {
  const { maxMultiplier1, maxMultiplier2 } = options;
  const operator: Operator = 'multiply';
  const operand1 = random(1, maxMultiplier1);
  const operand2 = random(1, maxMultiplier2);
  const answer = operand1 * operand2;
  const swap = !!random(0, 1);
  return { operator, operand1: swap ? operand2 : operand1, operand2: swap ? operand1 : operand2, answer };
}

export function createDivisionOperation(options: CreateDivisionOperationOptions): Operation {
  const { maxDivisor, maxQuotient } = options;
  const operator: Operator = 'divide';
  const multiplyOperation = createMultiplicationOperation({ maxMultiplier1: maxDivisor, maxMultiplier2: maxQuotient });
  const operand1 = multiplyOperation.answer;
  const operand2 = random(0, 1) ? multiplyOperation.operand1 : multiplyOperation.operand2;
  const answer = operand1 / operand2;
  return { operator, operand1, operand2, answer };
}

export function getOperationText(operation: Operation): string {
  const { operator, operand1, operand2 } = operation;
  return `${operand1} ${getOperatorSign(operator)} ${operand2}`;
}

export function getOperatorSign(operator: Operator): string {
  switch (operator) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return '*';
    case 'divide': return ':';
  }
}

export function getOperatorLabel(operator: Operator): string {
  switch (operator) {
    case 'add': return 'Addition';
    case 'subtract': return 'Subtraction';
    case 'multiply': return 'Multiplication';
    case 'divide': return 'Division';
  }
}
