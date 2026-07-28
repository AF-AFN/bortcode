import { primPut, primClear, primWait, primIf, primElseif, primElse, primEndif, primSwitch, primDefault, primEndswitch, primMove } from './prims.js';

export const primitiveSpecs = {
  'PRINT': primPut,
  'CLEAR': primClear,
  'WAIT': primWait,
  'IF': primIf,
  'ELSEIF': primElseif,
  'ELSE': primElse,
  'ENDIF': primEndif,
  'SWITCH': primSwitch,
  'DEFAULT': primDefault,
  'ENDSWITCH': primEndswitch,
  'MOVE': primMove
};