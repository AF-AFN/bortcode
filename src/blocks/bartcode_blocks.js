import * as Blockly from 'blockly';

/* CAPS */

Blockly.Blocks['bart_on_run'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('on run');
    this.setPreviousStatement(false, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Entry point when the program runs.');
    this.setHelpUrl('');
  }
};

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
    this.setTooltip('Prints text to the screen.');
    this.setHelpUrl('');
  }
};

// clear
Blockly.Blocks['bart_clear'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('clear console');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip('Clears the screen.');
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