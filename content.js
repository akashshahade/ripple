// content.js — injects the nudge card into whatever page is active.
// Uses Shadow DOM so our styles are 100% isolated from the host page,
// and the host page's CSS can never leak in and break our card.

(function () {
  const HOST_ID = 'ripple-nudge-host';

  function buildCard(payload) {
    // Remove any existing card first (don't stack multiples)
    const existing = document.getElementById(HOST_ID);
    if (existing) existing.remove();

    const host = document.createElement('div');
    host.id = HOST_ID;
    // Keep the host element itself out of page layout/flow entirely
    host.style.all = 'initial';
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        :host { all: initial; }

        .stage {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2147483647;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .card {
          position: relative;
          width: 280px;
          padding: 22px 22px 20px;
          border-radius: 16px;
          background: #132420;
          color: #F1EDE2;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0,0,0,0.2);
          overflow: hidden;
          transform: translateY(24px);
          opacity: 0;
          animation: rise 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes rise {
          to { transform: translateY(0); opacity: 1; }
        }

        .ripple-wrap {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 90px;
          height: 90px;
          pointer-events: none;
        }

        .ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid #7FB3A3;
          opacity: 0;
          animation: ripple 2400ms ease-out infinite;
        }
        .ring.r2 { animation-delay: 700ms; }
        .ring.r3 { animation-delay: 1400ms; }

        @keyframes ripple {
          0%   { transform: scale(0.2); opacity: 0.55; }
          80%  { opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }

        .dot {
          position: absolute;
          top: 40px;
          right: 40px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E3A857;
          box-shadow: 0 0 10px rgba(227, 168, 87, 0.8);
        }

        .headline {
          margin: 0 0 6px;
          font-family: Georgia, "Iowan Old Style", ui-serif, serif;
          font-size: 26px;
          font-weight: 500;
          letter-spacing: 0.2px;
          color: #F1EDE2;
        }

        .body {
          margin: 0 0 18px;
          font-size: 13.5px;
          line-height: 1.5;
          color: #9FB3AA;
          max-width: 200px;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        button {
          all: unset;
          cursor: pointer;
          font-size: 12.5px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 999px;
          transition: transform 120ms ease, opacity 120ms ease;
        }
        button:hover { transform: translateY(-1px); }
        button:active { transform: translateY(0); }

        .primary {
          background: #7FB3A3;
          color: #0E1A17;
        }

        .secondary {
          background: transparent;
          color: #9FB3AA;
          border: 1px solid rgba(159, 179, 170, 0.35);
        }

        .card.leaving {
          animation: fall 260ms ease-in forwards;
        }
        @keyframes fall {
          to { transform: translateY(12px); opacity: 0; }
        }
      </style>

      <div class="stage">
        <div class="card" role="status" aria-live="polite">
          <div class="ripple-wrap">
            <div class="ring r1"></div>
            <div class="ring r2"></div>
            <div class="ring r3"></div>
            <div class="dot"></div>
          </div>
          <p class="headline">${payload.headline}</p>
          <p class="body">${payload.body}</p>
          <div class="actions">
            <button class="primary" id="dismiss">Got it</button>
            <button class="secondary" id="snooze">Snooze 10m</button>
          </div>
        </div>
      </div>
    `;

    const card = shadow.querySelector('.card');

    function close() {
      card.classList.add('leaving');
      setTimeout(() => host.remove(), 260);
    }

    shadow.getElementById('dismiss').addEventListener('click', close);
    shadow.getElementById('snooze').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'RIPPLE_SNOOZE' });
      close();
    });

    // Auto-dismiss after 12s if the person just ignores it
    setTimeout(() => {
      if (document.getElementById(HOST_ID)) close();
    }, 12000);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'RIPPLE_SHOW_NUDGE') {
      buildCard(message.payload);
    }
  });
})();
