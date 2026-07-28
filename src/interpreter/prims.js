export function primPut(arg, context) {
  let textVal = arg.trim();
  if ((textVal.startsWith('"') && textVal.endsWith('"')) || 
      (textVal.startsWith("'") && textVal.endsWith("'"))) {
    textVal = textVal.slice(1, -1);
  }
  context.outputBuffer += textVal + '\n';
}

export function primClear(arg, context) {
  context.outputBuffer = '';
}