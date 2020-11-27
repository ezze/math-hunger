export function delay(ms = 200): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function random(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min) + 0.5);
}

export function createOperation(options: {
  allowedOperators: Array<Operator>;
}): Operation {
  const { allowedOperators } = options;
  const operatorIndex = random(0, allowedOperators.length - 1);
  const operator = allowedOperators[operatorIndex];
  switch (operator) {
    case 'add': return createAddOperation();
    case 'subtract': return createSubractOperation();
    case 'multiply': return createMultiplyOperation();
    case 'divide': return createDivideOperation();
  }
}

const maxSumResult = 30;

export function createAddOperation(): Operation {
  const operator: Operator = 'add';
  const operand1 = random(0, maxSumResult);
  const operand2 = random(0, maxSumResult - operand1);
  const answer = operand1 + operand2;
  return { operator, operand1, operand2, answer };
}

export function createSubractOperation(): Operation {
  const operator: Operator = 'subtract';
  const addOperation = createAddOperation();
  const operand1 = addOperation.answer;
  const operand2 = random(0, 1) ? addOperation.operand1 : addOperation.operand2;
  const answer = operand1 - operand2;
  return { operator, operand1, operand2, answer };
}

const maxMultiplyOperand1 = 10;
const maxMultiplyOperand2 = 10;

export function createMultiplyOperation(): Operation {
  const operator: Operator = 'multiply';
  const operand1 = random(1, maxMultiplyOperand1);
  const operand2 = random(1, maxMultiplyOperand2);
  const answer = operand1 * operand2;
  return { operator, operand1, operand2, answer };
}

export function createDivideOperation(): Operation {
  const operator: Operator = 'divide';
  const multiplyOperation = createMultiplyOperation();
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
