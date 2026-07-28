<script>
  import { onMount } from 'svelte';
  import * as Blockly from 'blockly';
  import { bartcodeGenerator } from './blocks/generator.js';
  import { runBartcode } from './interpreter/interpreter.js';
  import { toolboxXML } from './blocks/toolbox.js';
  import { initKeyboard } from './keyboard.js';
  import RamBar from './RamBar.svelte';
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

  function handleRun() {
    if (running && stopBartcode) {
      stopBartcode.stop();
    }
    const code = bartcodeGenerator.workspaceToCode(workspace);
    running = true;
    stopBartcode = runBartcode(code, (newOutput) => {
      consoleOutput = newOutput;
    }, (used, total) => {
      ramUsed = used;
      ramTotal = total;
    }, () => {
      running = false;
      stopBartcode = null;
    });
  }

  function handleStop() {
    if (stopBartcode) {
      stopBartcode.stop();
      stopBartcode = null;
    }
    running = false;
  }

  function handleRendererChange(e) {
    let newRenderer = e.target.value;
    if (newRenderer === renderer) return;
    let state = Blockly.serialization.workspaces.save(workspace);
    workspace.dispose();
    renderer = newRenderer;
    workspace = Blockly.inject(blocklyDiv, {
      toolbox: toolboxXML,
      renderer: renderer,
      theme: Blockly.Theme.defineTheme('scratchTheme', {
        'base': Blockly.Themes.Classic,
        'startHats': true
      })
    });
    Blockly.serialization.workspaces.load(state, workspace);
  }

  function handleSave() {
    fileOpen = false;
    let state = Blockly.serialization.workspaces.save(workspace);
    let json = JSON.stringify(state, null, 2);
    let blob = new Blob([json], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'project.bcp';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleLoad(e) {
    fileOpen = false;
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (event) => {
      try {
        let state = JSON.parse(event.target.result);
        Blockly.serialization.workspaces.load(state, workspace);
      } catch (err) {
        alert('Failed to load project: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleKeydown(e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }

  function closeFileMenu(e) {
    if (fileOpen && !e.target.closest('.file-menu')) {
      fileOpen = false;
    }
  }

  onMount(() => {
    initKeyboard();
    workspace = Blockly.inject(blocklyDiv, {
      toolbox: toolboxXML,
      renderer: renderer,
      theme: Blockly.Theme.defineTheme('scratchTheme', {
        'base': Blockly.Themes.Classic,
        'startHats': true
      })
    });
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', closeFileMenu);
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
  </div>
</div>
