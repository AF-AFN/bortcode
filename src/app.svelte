<script>
  import { onMount } from 'svelte';
  import * as Blockly from 'blockly';
  import { bartcodeGenerator } from './blocks/generator.js';

  let blocklyDiv;
  let workspace;
  let consoleOutput = '';

  onMount(() => {
    workspace = Blockly.inject(blocklyDiv, {
        // temporary
      toolbox: `
        <xml>
          <block type="bart_put"></block>
          <block type="bart_string"></block>
        </xml>
      `
    });

    workspace.addChangeListener(() => {
      consoleOutput = bartcodeGenerator.workspaceToCode(workspace);
    });
  });
</script>

<!-- also temporary -->
<style>
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

<div class="editor-container">
  <div bind:this={blocklyDiv} class="workspace"></div>
  <div class="console">
    {consoleOutput || 'ready'}
  </div>
</div>