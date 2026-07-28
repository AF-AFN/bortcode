const pressedKeys = new Set();
let lastKey = '';

export function initKeyboard() {
  window.addEventListener('keydown', (e) => {
    pressedKeys.add(e.key);
    lastKey = e.key;
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      if (e.key !== ' ' || !isInput) {
        e.preventDefault();
      }
    }
  });
  window.addEventListener('keyup', (e) => {
    pressedKeys.delete(e.key);
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      if (e.key !== ' ' || !isInput) {
        e.preventDefault();
      }
    }
  });
}

export function isKeyPressed(key) {
  return pressedKeys.has(key);
}

export function getLastKey() {
  return lastKey;
}

export function isAnyKeyPressed() {
  return pressedKeys.size > 0;
}
