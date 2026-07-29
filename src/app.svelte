<script>
  import { onMount } from 'svelte';
  import * as Blockly from 'blockly';
  import { bartcodeGenerator } from './blocks/generator.js';
  import { runBartcode } from './interpreter/interpreter.js';
  import { toolboxXML } from './blocks/toolbox.js';
  import { initKeyboard } from './keyboard.js';
  import RamBar from './RamBar.svelte';
  import CrtOverlay from './CrtOverlay.svelte';
  import './blocks/bartcode_blocks.js';
  import './app.css';

  let blocklyDiv;
  let workspace;
  let consoleOutput = 'ready...\n';
  let ramUsed = 0;
  let ramTotal = 524288;
  let renderer = 'zelos';
  let running = false;
  let stopBartcode = null;
  let fileOpen = false;
  let fileInput;
  let toolsOpen = false;
  let prefsOpen = false;
  let shadersEnabled = false;

  function handleRun() {
    if (running && stopBartcode) {
      stopBartcode.stop();
    }

    const code = bartcodeGenerator.workspaceToCode(workspace);

    running = true;

    stopBartcode = runBartcode(
      code,
      (newOutput) => {
        consoleOutput = newOutput;
      },
      (used, total) => {
        ramUsed = used;
        ramTotal = total;
      },
      () => {
        running = false;
        stopBartcode = null;
      }
    );
  }

  function handleStop() {
    if (stopBartcode) {
      stopBartcode.stop();
      stopBartcode = null;
    }

    running = false;
  }

  function handleRendererChange(e) {
    const newRenderer = e.target.value;

    if (newRenderer === renderer) return;

    localStorage.setItem('bartcode_renderer', newRenderer);

    const state = Blockly.serialization.workspaces.save(workspace);

    workspace.dispose();

    renderer = newRenderer;

    workspace = Blockly.inject(blocklyDiv, {
      toolbox: toolboxXML,
      renderer,
      theme: Blockly.Theme.defineTheme('scratchTheme', {
        base: Blockly.Themes.Classic,
        startHats: true
      })
    });

    Blockly.serialization.workspaces.load(state, workspace);
  }

  onMount(() => {
    renderer = localStorage.getItem('bartcode_renderer') || 'zelos';
    shadersEnabled = localStorage.getItem('bartcode_shaders') === 'true';

    initKeyboard();

    try {
      workspace = Blockly.inject(blocklyDiv, {
        toolbox: toolboxXML,
        renderer,
        theme: Blockly.Theme.defineTheme('scratchTheme', {
          base: Blockly.Themes.Classic,
          startHats: true
        })
      });

      console.log('Blockly loaded successfully');
    } catch (err) {
      console.error('Blockly failed:', err);
      consoleOutput = 'Failed to load Blockly:\n' + err.message;
    }

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', closeMenus);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('click', closeMenus);

      if (workspace) {
        workspace.dispose();
      }
    };
  });
</script>

<nav class="navbar">
  <div class="navbar-left">
    <div class="navbar-brand">Bartcode</div>
    <div class="file-menu">
      <button class="file-btn" on:click={() => fileOpen = !fileOpen}>File</button>
      {#if fileOpen}
        <div class="file-dropdown">
          <button class="dropdown-item" on:click={handleSave}>Save</button>
          <button class="dropdown-item" on:click={() => { fileOpen = false; fileInput.click(); }}>Load</button>
        </div>
      {/if}
    </div>
    <div class="tools-menu">
      <button class="file-btn" on:click={() => toolsOpen = !toolsOpen}>Tools</button>
      {#if toolsOpen}
        <div class="file-dropdown">
          <button class="dropdown-item" on:click={() => { toolsOpen = false; prefsOpen = true; }}>Preferences</button>
        </div>
      {/if}
    </div>
  </div>
  <RamBar {ramUsed} {ramTotal} />
  <div class="toolbar">
    <label class="renderer-label">
      Renderer:
      <select on:change={handleRendererChange}>
        <option value="geras" selected={renderer === 'geras'}>Geras</option>
        <option value="thrasos" selected={renderer === 'thrasos'}>Thrasos</option>
        <option value="zelos" selected={renderer === 'zelos'}>Zelos</option>
      </select>
    </label>
    <button on:click={handleRun}>Run code</button>
    <button class="stop-btn" on:click={handleStop} disabled={!running}>Stop code</button>
  </div>
</nav>

<input type="file" accept=".bcp" bind:this={fileInput} on:change={handleLoad} style="display: none">

<div class="editor-container">
  <div bind:this={blocklyDiv} class="workspace"></div>
  <div class="console">
    {consoleOutput}
    {#if shadersEnabled}
      <CrtOverlay text={consoleOutput} />
    {/if}
  </div>
</div>

{#if prefsOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-overlay" on:click={closePrefs}></div>
  <div class="modal">
    <div class="modal-header">
      <span>Preferences</span>
      <button class="modal-close" on:click={closePrefs}>&times;</button>
    </div>
    <div class="modal-body">
      <label class="pref-row">
        <input type="checkbox" bind:checked={shadersEnabled} on:change={() => localStorage.setItem('bartcode_shaders', shadersEnabled)} />
        <span>Special Shaders (CRT effect)</span>
      </label>
    </div>
  </div>
{/if}


