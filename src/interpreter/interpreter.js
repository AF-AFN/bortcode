import { primitiveSpecs } from './specs.js';

export function runBartcode(code, onOutputUpdate) {
  if (!code || typeof code !== 'string') {
    onOutputUpdate('ready...\n');
    return;
  }

  let lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let context = {
    outputBuffer: ''
  };

  let pc = 0;

  function step() {
    if (pc >= lines.length) {
      onOutputUpdate(context.outputBuffer || 'ready...\n');
      return;
    }

    let line = lines[pc];
    pc++;

    let spaceIndex = line.indexOf(' ');
    let keyword = spaceIndex === -1 ? line : line.substring(0, spaceIndex);
    let arg = spaceIndex === -1 ? '' : line.substring(spaceIndex + 1);

    if (primitiveSpecs[keyword]) {
      let result = primitiveSpecs[keyword](arg, context);

      if (typeof result === 'number' && result > 0) {
        onOutputUpdate(context.outputBuffer);
        setTimeout(step, result);
        return;
      }
    }

    onOutputUpdate(context.outputBuffer);
    step();
  }

  step();
}