import { primitiveSpecs } from './specs.js';

export function runBartcode(code) {
  if (!code || typeof code !== 'string') {
    return 'ready...\n';
  }

  let lines = code.split('\n');
  let context = {
    outputBuffer: ''
  };
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    let spaceIndex = line.indexOf(' ');
    let keyword = spaceIndex === -1 ? line : line.substring(0, spaceIndex);
    let arg = spaceIndex === -1 ? '' : line.substring(spaceIndex + 1);
    if (primitiveSpecs[keyword]) {
      primitiveSpecs[keyword](arg, context);
    }
  }
  
  return context.outputBuffer || 'ready...\n';
}