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

/* SCREEN */

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
    this.setColour(160);
    this.setTooltip('Clears the screen.');
    this.setHelpUrl('');
  }
};

/* CONTROL */

// wait [n] secs
Blockly.Blocks['bart_wait'] = {
  init: function() {
    this.appendValueInput('SECONDS')
        .setCheck('Number')
        .appendField('wait');
    this.appendDummyInput()
        .appendField('secs');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Pauses execution for a specified number of seconds.');
    this.setHelpUrl('');
  }
};


/* ARGUMENTS */

/* STRINGS */

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

// join [str] [str]
Blockly.Blocks['bart_join'] = {
  init: function() {
    this.appendValueInput('STR1')
        .setCheck('String')
        .appendField('join');
    this.appendValueInput('STR2')
        .setCheck('String');
    this.setOutput(true, 'String');
    this.setColour(230);
    this.setTooltip('Joins two strings together.');
    this.setHelpUrl('');
  }
};

/* NUMBERS */

// number
Blockly.Blocks['bart_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('1', Blockly.FieldTextInput.numberValidator), 'VALUE');
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('A literal number.');
    this.setHelpUrl('');
  }
};