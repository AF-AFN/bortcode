import * as Blockly from 'blockly';

/* events */

Blockly.Blocks['bart_on_run'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('When run');
    this.setPreviousStatement(false, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Runs the attached blocks when the run button is clicked. Blocks not connected to this event will not run.');
    this.setHelpUrl('');
    this.hat = 'cap';
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
    this.setInputsInline(true);
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

// move cursor
Blockly.Blocks['bart_move'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('move c:');
    this.appendValueInput('FROM_COL')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('r:');
    this.appendValueInput('FROM_ROW')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('to c:');
    this.appendValueInput('TO_COL')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('r:');
    this.appendValueInput('TO_ROW')
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('Moves cursor from one position to another.');
    this.setHelpUrl('');
  }
};

// focus
Blockly.Blocks['bart_focus'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('focus screen');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('Focuses the screen for input.');
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
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Pauses execution for a specified number of seconds.');
    this.setHelpUrl('');
  }
};

// repeat times
Blockly.Blocks['bart_repeat'] = {
  init: function() {
    this.appendValueInput('TIMES')
        .setCheck('Number')
        .appendField('repeat');
    this.appendStatementInput('DO')
        .appendField('times');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Repeats the contained blocks a specified number of times.');
    this.setHelpUrl('');
  }
};

// while do
Blockly.Blocks['bart_while'] = {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('while');
    this.appendStatementInput('DO')
        .appendField('do');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Repeats the contained blocks while the condition is true.');
    this.setHelpUrl('');
  }
};

// if/else
Blockly.Blocks['bart_if_else'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('if');
    this.appendValueInput('CONDITION')
        .setCheck('Boolean');
    this.appendStatementInput('DO')
        .appendField('do');
    this.appendDummyInput('CONFIG')
        .appendField('mode:')
        .appendField(new Blockly.FieldDropdown([
          ['if', 'IF'],
          ['if-else', 'IF_ELSE'],
          ['if-elseif-else', 'IF_ELSEIF_ELSE']
        ]), 'MODE');
    this.appendDummyInput('ELSEIF_COUNT_INPUT')
        .appendField('elseif count:')
        .appendField(new Blockly.FieldTextInput('0', Blockly.FieldTextInput.numberValidator), 'ELSEIF_COUNT');
    this.appendStatementInput('ELSE')
        .appendField('else');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('If/else conditional statement. Use mode dropdown to configure.');
    this.setHelpUrl('');
    this.elseifCount_ = 0;
    this.updateShape();
  },
  onchange: function(event) {
    if (event.type === Blockly.Events.BLOCK_CHANGE) {
      if (event.name === 'MODE' || event.name === 'ELSEIF_COUNT') {
        this.updateShape();
      }
    }
  },
  updateShape: function() {
    let mode = this.getFieldValue('MODE');
    let elseifCount = parseInt(this.getFieldValue('ELSEIF_COUNT'), 10) || 0;
    if (elseifCount < 0) elseifCount = 0;
    if (elseifCount > 10) elseifCount = 10;
    
    // Handle elseif inputs
    for (let i = 1; i <= this.elseifCount_; i++) {
      if (this.getInput('ELSEIF' + i)) {
        this.removeInput('ELSEIF' + i);
      }
      if (this.getInput('DO' + i)) {
        this.removeInput('DO' + i);
      }
    }
    
    for (let i = 1; i <= elseifCount; i++) {
      this.appendValueInput('ELSEIF' + i)
          .setCheck('Boolean')
          .appendField('elseif ' + i);
      this.appendStatementInput('DO' + i)
          .appendField('do');
    }
    
    this.elseifCount_ = elseifCount;
    
    // Handle else input based on mode
    if (mode === 'IF') {
      if (this.getInput('ELSE')) {
        this.removeInput('ELSE');
      }
    } else {
      if (!this.getInput('ELSE')) {
        this.appendStatementInput('ELSE')
            .appendField('else');
      }
    }
    
    // Show/hide elseif count input based on mode
    if (mode === 'IF_ELSEIF_ELSE') {
      if (!this.getInput('ELSEIF_COUNT_INPUT')) {
        this.appendDummyInput('ELSEIF_COUNT_INPUT')
            .appendField('elseif count:')
            .appendField(new Blockly.FieldTextInput('0', Blockly.FieldTextInput.numberValidator), 'ELSEIF_COUNT');
      }
    } else {
      if (this.getInput('ELSEIF_COUNT_INPUT')) {
        this.removeInput('ELSEIF_COUNT_INPUT');
      }
    }
  }
};

// switch/case
Blockly.Blocks['bart_switch_case'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .appendField('switch');
    this.appendStatementInput('CASES')
        .appendField('cases');
    this.appendDummyInput('CONFIG')
        .appendField('has default:')
        .appendField(new Blockly.FieldDropdown([
          ['yes', 'YES'],
          ['no', 'NO']
        ]), 'HAS_DEFAULT');
    this.appendStatementInput('DEFAULT')
        .appendField('default');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Switch/case statement. Use dropdown to show/hide default.');
    this.setHelpUrl('');
    this.updateShape();
  },
  onchange: function(event) {
    if (event.type === Blockly.Events.BLOCK_CHANGE && event.name === 'HAS_DEFAULT') {
      this.updateShape();
    }
  },
  updateShape: function() {
    let hasDefault = this.getFieldValue('HAS_DEFAULT') === 'YES';
    
    if (hasDefault) {
      if (!this.getInput('DEFAULT')) {
        this.appendStatementInput('DEFAULT')
            .appendField('default');
      }
    } else {
      if (this.getInput('DEFAULT')) {
        this.removeInput('DEFAULT');
      }
    }
  }
};