<script>
  import { onMount, onDestroy } from 'svelte';
  import { initShader } from './CRTShader.js';

  let { text = '' } = $props();

  let canvas;
  let shader;
  let animId;
  let ro;

  function tick() {
    animId = requestAnimationFrame(tick);
    if (shader) shader.draw(text);
  }

  onMount(() => {
    shader = initShader(canvas);
    if (!shader) {
      console.warn('CrtOverlay: WebGL init failed');
      return;
    }

    function syncSize() {
      let parent = canvas.parentElement;
      if (!parent) return;
      let rect = parent.getBoundingClientRect();
      shader.resize(Math.round(rect.width), Math.round(rect.height), window.devicePixelRatio || 1);
    }

    syncSize();
    ro = new ResizeObserver(syncSize);
    ro.observe(canvas.parentElement);
    tick();
  });

  onDestroy(() => {
    if (animId) cancelAnimationFrame(animId);
    if (ro) ro.disconnect();
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
    display: block;
  }
</style>
