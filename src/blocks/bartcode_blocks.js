import * as Blockly from 'blockly';

/* COMMANDS */

// put
Blockly.Blocks['bart_put'] = {
  init: function() {
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField('put');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('Prints text to the 80x30 console.');
    this.setHelpUrl('');
  }
};

/* ARGUMENTS */

// string
Blockly.Blocks['bart_string'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('"')
        .appendField(new Blockly.FieldTextInput('Hello World'), 'VALUE')
        .appendField('"');
    this.setOutput(true, 'String');
    this.setColour(230);
    this.setTooltip('A literal string.');
    this.setHelpUrl('');
  }
};