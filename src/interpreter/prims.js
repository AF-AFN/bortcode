export function primPut(arg, context) {
  let textVal = evaluateExpression(arg, context);
  context.outputBuffer += textVal + '\n';
}

export function primClear(arg, context) {
  context.outputBuffer = '';
}

export function primWait(arg, context) {
  let seconds = parseFloat(evaluateExpression(arg, context)) || 0;
  return seconds * 1000; 
}

function evaluateExpression(expr, context) {
  if (!expr) return '';
  expr = expr.trim();
  
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