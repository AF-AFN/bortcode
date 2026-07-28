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

  function handleRun() {
    const code = bartcodeGenerator.workspaceToCode(workspace);
    runBartcode(code, (newOutput) => {
      consoleOutput = newOutput;
    }, (used, total) => {
      ramUsed = used;
      ramTotal = total;
    });
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
  });
</script>

<nav class="navbar">
  <div class="navbar-brand">Bartcode</div>
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
  </div>
</nav>

<div class="editor-container">
  <div bind:this={blocklyDiv} class="workspace"></div>
  <div class="console">
    {consoleOutput}
  </div>
</div>
