const pressedKeys = new Set();

export function initKeyboard() {
  window.addEventListener('keydown', (e) => {
    pressedKeys.add(e.key);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', (e) => {
    pressedKeys.delete(e.key);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
  });
}

export function isKeyPressed(key) {
  return pressedKeys.has(key);
}
