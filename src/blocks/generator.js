import * as Blockly from 'blockly';
import './bartcode_blocks.js';

export const bartcodeGenerator = new Blockly.CodeGenerator('Bartcode');

bartcodeGenerator.ORDER_ATOMIC = 0;
bartcodeGenerator.ORDER_NONE = 99;

/* CAPS */

// unused
bartcodeGenerator.forBlock['bart_on_run'] = function(block, generator) {
  let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  let nextCode = nextBlock ? generator.blockToCode(nextBlock) : '';
  return nextCode;
};

/* COMMANDS */

bartcodeGenerator.forBlock['bart_put'] = function(block, generator) {
  let textCode = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || '""';
  return 'PRINT ' + textCode + '\n';
};

bartcodeGenerator.forBlock['bart_clear'] = function(block, generator) {
  return 'CLEAR\n';
};

bartcodeGenerator.forBlock['bart_wait'] = function(block, generator) {
  let timeVal = generator.valueToCode(block, 'SECONDS', generator.ORDER_NONE) || '1';
  return 'WAIT ' + timeVal + '\n';
};

/* ARGUMENTS */

bartcodeGenerator.forBlock['bart_string'] = function(block, generator) {
  let textValue = block.getFieldValue('VALUE');
  return ['"' + textValue + '"', bartcodeGenerator.ORDER_ATOMIC];
};

bartcodeGenerator.forBlock['bart_number'] = function(block, generator) {
  let numValue = block.getFieldValue('VALUE');
  return [numValue, bartcodeGenerator.ORDER_ATOMIC];
};

bartcodeGenerator.forBlock['bart_join'] = function(block, generator) {
  let str1 = generator.valueToCode(block, 'STR1', generator.ORDER_NONE) || '""';
  let str2 = generator.valueToCode(block, 'STR2', generator.ORDER_NONE) || '""';
  return ['JOIN(' + str1 + ', ' + str2 + ')', bartcodeGenerator.ORDER_ATOMIC];
};

bartcodeGenerator.scrub_ = function(block, code, thisOnly) {
  let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  let nextCode = '';
  if (nextBlock) {
    if (!thisOnly) {
      nextCode = bartcodeGenerator.blockToCode(nextBlock);
    }
  }
  return code + nextCode;
};