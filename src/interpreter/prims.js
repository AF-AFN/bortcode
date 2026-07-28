export function primPut(arg, context) {
  let textVal = evaluateExpression(arg, context);
  context.cursorX = context.cursorX || 0;
  context.cursorY = context.cursorY || 0;
  for (let i = 0; i < textVal.length; i++) {
    let char = textVal[i];
    if (context.cursorX < context.width && context.cursorY < context.height) {
      context.grid[context.cursorY][context.cursorX] = char;
      context.cursorX++;
    }
  }
  context.cursorX = 0;
  context.cursorY++;
}

export function primClear(arg, context) {
  context.grid = Array.from({ length: context.height }, () => Array(context.width).fill(' '));
  context.cursorX = 0;
  context.cursorY = 0;
}

export function primWait(arg, context) {
  let seconds = parseFloat(evaluateExpression(arg, context)) || 0;
  return seconds * 1000; 
}

export function primIf(arg, context) {
  let condition = evaluateExpression(arg, context);
  context.controlStack = context.controlStack || [];
  context.controlStack.push({ type: 'IF', condition: condition === 'true' || condition === true, skip: !(condition === 'true' || condition === true), matched: condition === 'true' || condition === true });
}

export function primElseif(arg, context) {
  context.controlStack = context.controlStack || [];
  let top = context.controlStack[context.controlStack.length - 1];
  if (top && top.type === 'IF') {
    let condition = evaluateExpression(arg, context);
    let conditionResult = condition === 'true' || condition === true;
    // Skip if we already matched a condition or if this condition is false
    top.skip = top.matched || !conditionResult;
    if (conditionResult) {
      top.matched = true;
    }
  }
}

export function primElse(arg, context) {
  context.controlStack = context.controlStack || [];
  let top = context.controlStack[context.controlStack.length - 1];
  if (top && top.type === 'IF') {
    top.skip = top.matched; // Skip else if we already matched a condition
  }
}

export function primEndif(arg, context) {
  context.controlStack = context.controlStack || [];
  context.controlStack.pop();
}

export function primSwitch(arg, context) {
  let value = evaluateExpression(arg, context);
  context.controlStack = context.controlStack || [];
  context.controlStack.push({ type: 'SWITCH', value: value, matched: false });
}

export function primDefault(arg, context) {
  context.controlStack = context.controlStack || [];
  let top = context.controlStack[context.controlStack.length - 1];
  if (top && top.type === 'SWITCH') {
    top.skip = top.matched;
  }
}

export function primEndswitch(arg, context) {
  context.controlStack = context.controlStack || [];
  context.controlStack.pop();
}

function evaluateExpression(expr, context) {
  if (!expr) return '';
  expr = expr.trim();
  
  // Math operations
  const mathOps = ['ADD', 'SUB', 'MUL', 'DIV'];
  for (let op of mathOps) {
    if (expr.startsWith(op + '(') && expr.endsWith(')')) {
      let inner = expr.substring(op.length + 1, expr.length - 1);
      let splitIndex = findCommaSplitIndex(inner);
      let leftExpr = inner.substring(0, splitIndex).trim();
      let rightExpr = inner.substring(splitIndex + 1).trim();
      let left = parseFloat(evaluateExpression(leftExpr, context)) || 0;
      let right = parseFloat(evaluateExpression(rightExpr, context)) || 0;
      
      switch (op) {
        case 'ADD': return (left + right).toString();
        case 'SUB': return (left - right).toString();
        case 'MUL': return (left * right).toString();
        case 'DIV': return right !== 0 ? (left / right).toString() : '0';
      }
    }
  }
  
  // EQ comparison
  if (expr.startsWith('EQ(') && expr.endsWith(')')) {
    let inner = expr.substring(3, expr.length - 1);
    let splitIndex = findCommaSplitIndex(inner);
    let leftExpr = inner.substring(0, splitIndex).trim();
    let rightExpr = inner.substring(splitIndex + 1).trim();
    let left = evaluateExpression(leftExpr, context);
    let right = evaluateExpression(rightExpr, context);
    return (left === right).toString();
  }
  
  // Logical operators
  const logicalOps = ['AND', 'OR', 'NOR', 'XAND', 'XOR', 'XNOR'];
  for (let op of logicalOps) {
    if (expr.startsWith(op + '(') && expr.endsWith(')')) {
      let inner = expr.substring(op.length + 1, expr.length - 1);
      let splitIndex = findCommaSplitIndex(inner);
      let leftExpr = inner.substring(0, splitIndex).trim();
      let rightExpr = inner.substring(splitIndex + 1).trim();
      let left = evaluateExpression(leftExpr, context) === 'true' || evaluateExpression(leftExpr, context) === true;
      let right = evaluateExpression(rightExpr, context) === 'true' || evaluateExpression(rightExpr, context) === true;
      
      switch (op) {
        case 'AND': return (left && right).toString();
        case 'OR': return (left || right).toString();
        case 'NOR': return (!(left || right)).toString();
        case 'XAND': return (!(left && right)).toString();
        case 'XOR': return (left !== right).toString();
        case 'XNOR': return (left === right).toString();
      }
    }
  }
  
  // NOT operator
  if (expr.startsWith('NOT(') && expr.endsWith(')')) {
    let inner = expr.substring(4, expr.length - 1);
    let val = evaluateExpression(inner, context) === 'true' || evaluateExpression(inner, context) === true;
    return (!val).toString();
  }
  
  if (expr.startsWith('JOIN(') && expr.endsWith(')')) {
    let inner = expr.substring(5, expr.length - 1);
    let splitIndex = findCommaSplitIndex(inner);
    let leftExpr = inner.substring(0, splitIndex).trim();
    let rightExpr = inner.substring(splitIndex + 1).trim();
    return evaluateExpression(leftExpr, context) + evaluateExpression(rightExpr, context);
  }

  if ((expr.startsWith('"') && expr.endsWith('"')) || 
      (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.slice(1, -1);
  }
  
  return expr;
}

export function primMove(arg, context) {
  let inner = arg.trim();
  if (inner.startsWith('(') && inner.endsWith(')')) {
    inner = inner.substring(1, inner.length - 1);
  }

  let parts = splitByCommaOutsideQuotes(inner);
  let fromCol = parseInt(evaluateExpression(parts[0], context), 10) || 0;
  let fromRow = parseInt(evaluateExpression(parts[1], context), 10) || 0;
  let toCol = parseInt(evaluateExpression(parts[2], context), 10) || 0;
  let toRow = parseInt(evaluateExpression(parts[3], context), 10) || 0;

  if (fromRow >= 0 && fromRow < context.height && fromCol >= 0 && fromCol < context.width &&
      toRow >= 0 && toRow < context.height && toCol >= 0 && toCol < context.width) {
    
    let charToMove = context.grid[fromRow][fromCol];

    context.grid[fromRow][fromCol] = ' ';
    context.grid[toRow][toCol] = charToMove;
  }
}

function splitByCommaOutsideQuotes(str) {
  let result = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if ((char === '"' || char === "'") && (i === 0 || str[i - 1] !== '\\')) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
    }
    
    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function findCommaSplitIndex(str) {
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if ((char === '"' || char === "'") && (i === 0 || str[i - 1] !== '\\')) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
    }
    if (char === ',' && !inQuotes) {
      return i;
    }
  }
  return str.length;
}