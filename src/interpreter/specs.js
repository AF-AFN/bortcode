import { primPut, primClear, primWait, primIf, primElseif, primElse, primEndif, primSwitch, primDefault, primEndswitch, primMove, primEndRepeat, primRepeat, primWhile, primEndWhile, primStore, primFlushRam, primFunction, primEndFunction, primCall, primReturn } from './prims.js';

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
  'MOVE': primMove,
  'REPEAT': primRepeat,
  'ENDREPEAT': primEndRepeat,
  'WHILE': primWhile,
  'ENDWHILE': primEndWhile,
  'STORE': primStore,
  'FLUSHRAM': primFlushRam,
  'FUNCTION': primFunction,
  'ENDFUNCTION': primEndFunction,
  'CALL': primCall,
  'RETURN': primReturn
};