<script>
  let { ramUsed = 0, ramTotal = 524288 } = $props();
  let used = $derived(ramUsed);
  let total = $derived(ramTotal);
  let percent = $derived(Math.min(100, Math.round((used / total) * 100)));
  let color = $derived(percent > 90 ? '#f44336' : percent > 70 ? '#ff9800' : '#4caf50');
</script>

<div class="ram-bar">
  <div class="ram-label">RAM: {used.toLocaleString()} / {total.toLocaleString()} bytes ({percent}%)</div>
  <div class="ram-track">
    <div class="ram-fill" style="width: {percent}%; background: {color};"></div>
  </div>
</div>

<style>
  .ram-bar {
    padding: 4px 12px;
    font-family: monospace;
    font-size: 12px;
    color: #ccc;
    min-width: 200px;
  }
  .ram-label {
    margin-bottom: 2px;
  }
  .ram-track {
    height: 8px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
  }
  .ram-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.2s, background 0.2s;
  }
</style>
