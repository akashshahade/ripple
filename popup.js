async function init() {
  const { enabled = true, intervalMinutes = 20 } = await chrome.storage.sync.get([
    'enabled',
    'intervalMinutes',
  ]);
  document.getElementById('statusLine').textContent = enabled
    ? `On · every ${intervalMinutes} min`
    : 'Paused';
}

document.getElementById('testNudge').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'RIPPLE_TEST_NUDGE' });
  window.close();
});

document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

init();
