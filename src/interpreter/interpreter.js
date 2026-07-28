import { primitiveSpecs } from './specs.js';

export function runBartcode(code, onOutputUpdate) {
  if (!code || typeof code !== 'string') {
    onOutputUpdate('ready...\n');
    return;
  }

  let lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const WIDTH = 80;
  const HEIGHT = 30;
  let grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(' '));

  let context = {
    outputBuffer: '',
    grid: grid,
    width: WIDTH,
    height: HEIGHT,
    controlStack: [] 
  };

  let pc = 0;

  const CONTROL_KEYWORDS = ['IF', 'ELSE', 'ENDIF', 'REPEAT', 'ENDREPEAT'];

  function renderGrid() {
    return context.grid.map(row => row.join('')).join('\n');
  }

  function step() {
    if (pc >= lines.length) {
      onOutputUpdate(renderGrid());
      return;
    }

    let line = lines[pc];
    pc++;

    let spaceIndex = line.indexOf(' ');
    let parenIndex = line.indexOf('(');
    let splitIndex = spaceIndex;
    if (parenIndex !== -1 && (spaceIndex === -1 || parenIndex < spaceIndex)) {
      splitIndex = parenIndex;
    }

    let keyword = splitIndex === -1 ? line : line.substring(0, splitIndex);
    let arg = splitIndex === -1 ? '' : line.substring(splitIndex);

    let top = context.controlStack[context.controlStack.length - 1];
    let shouldSkip = top && top.skip;
    let isControlFlow = CONTROL_KEYWORDS.includes(keyword);

    if (primitiveSpecs[keyword]) {
      if (!shouldSkip || isControlFlow) {
        let result = primitiveSpecs[keyword](arg, context);

        if (typeof result === 'number' && result > 0) {
          onOutputUpdate(renderGrid());
          setTimeout(step, result);
          return;
        }
      }
    }

    onOutputUpdate(renderGrid());
    step();
  }

  step();
}