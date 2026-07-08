const DEFAULTS = {
  enabled: true,
  intervalMinutes: 20,
  nudges: { hydrate: true, stretch: true, blink: true, breathe: true },
};

const enabledEl = document.getElementById('enabled');
const intervalEl = document.getElementById('interval');
const chips = Array.from(document.querySelectorAll('.chip'));
const statusEl = document.getElementById('status');

function applyChipState(nudges) {
  chips.forEach((chip) => {
    const key = chip.dataset.key;
    chip.classList.toggle('on', !!nudges[key]);
  });
}

function readChipState() {
  const nudges = {};
  chips.forEach((chip) => {
    nudges[chip.dataset.key] = chip.classList.contains('on');
  });
  return nudges;
}

async function load() {
  const settings = await chrome.storage.sync.get(DEFAULTS);
  enabledEl.checked = settings.enabled;
  intervalEl.value = String(settings.intervalMinutes);
  applyChipState(settings.nudges);
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => chip.classList.toggle('on'));
});

document.getElementById('save').addEventListener('click', async () => {
  const settings = {
    enabled: enabledEl.checked,
    intervalMinutes: Number(intervalEl.value),
    nudges: readChipState(),
  };
  await chrome.storage.sync.set(settings);
  await chrome.runtime.sendMessage({ action: 'RIPPLE_RESCHEDULE' });

  statusEl.textContent = 'Saved.';
  setTimeout(() => (statusEl.textContent = ''), 1600);
});

load();
