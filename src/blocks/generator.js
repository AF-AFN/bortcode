import * as Blockly from 'blockly';
import './bartcode_blocks.js';

export const bartcodeGenerator = new Blockly.CodeGenerator('Bartcode');

bartcodeGenerator.ORDER_ATOMIC = 0;
bartcodeGenerator.ORDER_NONE = 99;

/* COMMANDS */
bartcodeGenerator.forBlock['bart_put'] = function(block, generator) {
  let argument0 = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || '""';
  return 'PRINT ' + argument0 + '\n';
};

/* ARGUMENTS */
bartcodeGenerator.forBlock['bart_string'] = function(block, generator) {
  let textValue = block.getFieldValue('VALUE');
  return ['"' + textValue + '"', bartcodeGenerator.ORDER_ATOMIC];
};

bartcodeGenerator.scrub_ = function(block, code, thisOnly) {
  let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  let nextCode = '';
  if (nextBlock) {
    if (!thisOnly) {
      nextCode = '\n' + bartcodeGenerator.blockToCode(nextBlock);
    }
  }
  return code + nextCode;
};