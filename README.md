# 🌊 Ripple

**A gentle nudge to take care of yourself while you work.**

Ripple is a lightweight Chrome extension that quietly reminds you to hydrate,
stretch, blink, or breathe — every so often, without breaking your flow. No
account, no tracking, no cloud sync of your data. It runs entirely on your
machine.

<!-- Add a screenshot or GIF of the card appearing here once you have one:
![Ripple nudge card](./screenshot.png) -->

## What it does

- Shows a small card in the corner of your screen every N minutes (you
  choose the interval)
- Rotates between four nudges: **Sip**, **Stretch**, **Blink**, **Breathe**
- Snooze a nudge for 10 minutes if you're mid-thought
- Auto-dismisses on its own after 12 seconds if you ignore it — never gets
  in your way
- Works on every site, but never touches or reads anything on the page
  it appears over

## Install

Ripple isn't on the Chrome Web Store yet — for now, install it manually:

1. Download or clone this folder
2. Open `chrome://extensions` in Chrome
3. Turn on **Developer mode** (toggle, top-right)
4. Click **Load unpacked** and select the `ripple-extension` folder
5. That's it — Ripple is running. Click its icon in your toolbar and hit
   **"Show a nudge now"** to see it in action right away

## Using it

Click the Ripple icon in your toolbar any time to:
- See whether nudges are on and how often they fire
- Trigger a nudge manually
- Jump into **Settings** to change the interval, pause everything, or
  turn individual nudge types on/off

Your settings are saved automatically when you hit **Save changes** in
the settings page.

## Permissions, and why Ripple asks for them

| Permission | Why |
|---|---|
| `alarms` | Powers the recurring reminder timer |
| `storage` | Saves your interval and preferences |
| `tabs` + `host_permissions` | Lets Ripple show a nudge on whichever tab you're actively using, even if you haven't clicked anything recently |

Ripple does not read page content, does not track browsing history, and
does not make any network requests. You can verify this yourself — the
entire source is in this folder, nothing is minified or hidden.

## Project structure

```
ripple-extension/
├── manifest.json     # extension config & permissions
├── background.js     # the timer — decides when to fire a nudge
├── content.js         # renders the nudge card on the page
├── options.html/.js   # settings page
├── popup.html/.js     # toolbar popup
└── README.md
```

## Status

This is an early, personal-use build — functional, but still evolving.
Not yet published to the Chrome Web Store.


## Contributing

This started as a personal tool, so it's small and opinionated by design —
but suggestions, bug reports, and pull requests are welcome. If you're
picking this up to extend it, the whole thing is four small files with no
build step and no dependencies, so cloning and editing directly is the
fastest way in.

## License

MIT — do whatever you'd like with it.

## Author

Developed by **Akash Shahade** — [linkedin.com/in/akashshahade](https://linkedin.com/in/akashshahade)
