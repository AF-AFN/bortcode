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
    this.setColour(160);
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
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.setColour(160);
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

// add
Blockly.Blocks['bart_add'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('+');
    this.appendValueInput('B')
        .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('Adds two numbers together.');
    this.setHelpUrl('');
  }
};

// subtract
Blockly.Blocks['bart_subtract'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('-');
    this.appendValueInput('B')
        .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('Subtracts two numbers.');
    this.setHelpUrl('');
  }
};

// multiply
Blockly.Blocks['bart_multiply'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('*');
    this.appendValueInput('B')
        .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('Multiplies two numbers.');
    this.setHelpUrl('');
  }
};

// divide
Blockly.Blocks['bart_divide'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('/');
    this.appendValueInput('B')
        .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('Divides two numbers.');
    this.setHelpUrl('');
  }
};

/* LOGIC */

// logical operators dropdown
Blockly.Blocks['bart_logic_op'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Boolean');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['AND', 'AND'],
          ['OR', 'OR'],
          ['NOR', 'NOR'],
          ['XAND', 'XAND'],
          ['XOR', 'XOR'],
          ['XNOR', 'XNOR']
        ]), 'OP');
    this.appendValueInput('B')
        .setCheck('Boolean');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(210);
    this.setTooltip('Logical operation between two boolean values.');
    this.setHelpUrl('');
  }
};

// NOT
Blockly.Blocks['bart_not'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .setCheck('Boolean')
        .appendField('NOT');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(210);
    this.setTooltip('Logical NOT operation.');
    this.setHelpUrl('');
  }
};

// equals
Blockly.Blocks['bart_equals'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck(null);
    this.appendDummyInput()
        .appendField('=');
    this.appendValueInput('B')
        .setCheck(null);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(210);
    this.setTooltip('Checks if two values are equal.');
    this.setHelpUrl('');
  }
};

/* BOOLEAN LITERALS */

// true
Blockly.Blocks['bart_true'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('true');
    this.setOutput(true, 'Boolean');
    this.setColour(210);
    this.setTooltip('Boolean true value.');
    this.setHelpUrl('');
  }
};

// false
Blockly.Blocks['bart_false'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('false');
    this.setOutput(true, 'Boolean');
    this.setColour(210);
    this.setTooltip('Boolean false value.');
    this.setHelpUrl('');
  }
};

/* MEMORY */

// store
Blockly.Blocks['bart_store'] = {
  init: function() {
    this.appendValueInput('ADDR')
        .setCheck('Number')
        .appendField('store at');
    this.appendValueInput('VALUE')
        .appendField('=');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('Stores a value at memory address (0-511).');
    this.setHelpUrl('');
  }
};

// load
Blockly.Blocks['bart_load'] = {
  init: function() {
    this.appendValueInput('ADDR')
        .setCheck('Number')
        .appendField('load');
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('Loads a value from memory address (0-511).');
    this.setHelpUrl('');
  }
};

// flush ram
Blockly.Blocks['bart_flush_ram'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('flush RAM');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('Resets all memory to empty.');
    this.setHelpUrl('');
  }
};

/* SENSING */

// key pressed sensing
const KEY_OPTIONS = [
  ['space', ' '],
  ['up arrow', 'ArrowUp'],
  ['down arrow', 'ArrowDown'],
  ['left arrow', 'ArrowLeft'],
  ['right arrow', 'ArrowRight'],
  ['shift', 'Shift'],
  ['control', 'Control'],
  ['alt', 'Alt'],
  ['enter', 'Enter'],
  ['escape', 'Escape'],
  ['tab', 'Tab'],
  ['backspace', 'Backspace'],
  ['delete', 'Delete'],
  ['home', 'Home'],
  ['end', 'End'],
  ['page up', 'PageUp'],
  ['page down', 'PageDown'],
  ['caps lock', 'CapsLock'],
  ['a', 'a'],
  ['b', 'b'],
  ['c', 'c'],
  ['d', 'd'],
  ['e', 'e'],
  ['f', 'f'],
  ['g', 'g'],
  ['h', 'h'],
  ['i', 'i'],
  ['j', 'j'],
  ['k', 'k'],
  ['l', 'l'],
  ['m', 'm'],
  ['n', 'n'],
  ['o', 'o'],
  ['p', 'p'],
  ['q', 'q'],
  ['r', 'r'],
  ['s', 's'],
  ['t', 't'],
  ['u', 'u'],
  ['v', 'v'],
  ['w', 'w'],
  ['x', 'x'],
  ['y', 'y'],
  ['z', 'z'],
  ['0', '0'],
  ['1', '1'],
  ['2', '2'],
  ['3', '3'],
  ['4', '4'],
  ['5', '5'],
  ['6', '6'],
  ['7', '7'],
  ['8', '8'],
  ['9', '9']
];

Blockly.Blocks['bart_key_pressed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('key')
        .appendField(new Blockly.FieldDropdown(KEY_OPTIONS), 'KEY')
        .appendField('pressed?');
    this.setOutput(true, 'Boolean');
    this.setColour(290);
    this.setTooltip('Returns true if the specified key is currently pressed.');
    this.setHelpUrl('');
  }
};