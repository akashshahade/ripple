// background.js — the "clock" of the extension.
// Chrome kills service workers when idle, so we never rely on in-memory
// state here — everything is read fresh from chrome.storage each time.

const ALARM_NAME = 'ripple-nudge';
const DEFAULTS = {
  enabled: true,
  intervalMinutes: 20,
  nudges: { hydrate: true, stretch: true, blink: true, breathe: true },
};

const NUDGES = {
  hydrate: {
    headline: 'Sip.',
    body: 'Grab some water — your brain runs on it.',
  },
  stretch: {
    headline: 'Stretch.',
    body: 'Roll your shoulders back. Stand up if you can.',
  },
  blink: {
    headline: 'Blink.',
    body: 'Look at something 20 feet away for 20 seconds.',
  },
  breathe: {
    headline: 'Breathe.',
    body: 'One slow breath in. One slow breath out.',
  },
};

async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULTS);
  return { ...DEFAULTS, ...stored };
}

async function scheduleAlarm() {
  const settings = await getSettings();
  await chrome.alarms.clear(ALARM_NAME);
  if (!settings.enabled) return;
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: Math.max(1, Number(settings.intervalMinutes) || 20),
  });
}

function pickNudgeType(enabledMap) {
  const active = Object.entries(enabledMap)
    .filter(([, on]) => on)
    .map(([key]) => key);
  if (active.length === 0) return null;
  return active[Math.floor(Math.random() * active.length)];
}

async function fireNudge() {
  const settings = await getSettings();
  if (!settings.enabled) return;

  const type = pickNudgeType(settings.nudges);
  if (!type) return;

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab || !activeTab.id) return;

  try {
    await chrome.tabs.sendMessage(activeTab.id, {
      action: 'RIPPLE_SHOW_NUDGE',
      payload: NUDGES[type],
    });
  } catch (err) {
    // Content script isn't present on this page (e.g. chrome:// pages,
    // the Web Store, or a tab that hasn't loaded yet). Safe to ignore.
  }
}

chrome.runtime.onInstalled.addListener(() => {
  scheduleAlarm();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) fireNudge();
});

// Options page calls this after saving settings so the alarm picks up
// the new interval / enabled state immediately.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'RIPPLE_RESCHEDULE') {
    scheduleAlarm().then(() => sendResponse({ ok: true }));
    return true; // keep the message channel open for the async response
  }
  if (message.action === 'RIPPLE_TEST_NUDGE') {
    fireNudge().then(() => sendResponse({ ok: true }));
    return true;
  }
});
