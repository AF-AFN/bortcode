<script>
  import { onMount } from 'svelte';
  import * as Blockly from 'blockly';
  import { bartcodeGenerator } from './blocks/generator.js';
  import { runBartcode } from './interpreter/interpreter.js';
  import { toolboxXML } from './blocks/toolbox.js';
  import './blocks/bartcode_blocks.js';

  let blocklyDiv;
  let workspace;
  let consoleOutput = 'ready...\n';

  function handleRun() {
    const code = bartcodeGenerator.workspaceToCode(workspace);
    runBartcode(code, (newOutput) => {
      consoleOutput = newOutput;
    });
  }

  onMount(() => {
    workspace = Blockly.inject(blocklyDiv, {
      toolbox: toolboxXML,
      renderer: 'zelos',
      theme: Blockly.Theme.defineTheme('scratchTheme', {
        'base': Blockly.Themes.Classic,
        'startHats': true
      })
    });
  });
</script>

<!-- also temporary -->
<style>
    .toolbar {
        margin-bottom: 10px;
    }
    .toolbar button {
        padding: 8px 16px;
        font-size: 1rem;
        font-weight: bold;
        background: #28a745;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 4px;
    }
    .toolbar button:hover {
        background: #218838;
    }
  .editor-container {
    display: flex;
    height: calc(100vh - 80px);
    gap: 10px;
  }
  .workspace {
    flex: 1;
    height: 100%;
  }
  .console {
    width: 640px;
    height: 480px;
    background: #000;
    color: #00ff00;
    font-family: monospace;
    padding: 10px;
    box-sizing: border-box;
    white-space: pre;
    overflow: auto;
    border: 2px solid #444;
  }
</style>

<h1>Bartcode</h1>

<div class="toolbar">
  <button on:click={handleRun}>Run code</button>
</div>

<div class="editor-container">
  <div bind:this={blocklyDiv} class="workspace"></div>
  <div class="console">
    {consoleOutput}
  </div>
</div>