(function () {
  const timerEl   = document.getElementById('timerEl');
  const mainBtn   = document.getElementById('mainBtn');
  const btnLabel  = document.getElementById('btnLabel');
  const btnHint   = document.getElementById('btnHint');
  const btnWrap   = document.getElementById('btnWrap');
  const verdictEl = document.getElementById('verdictEl');
  const varianceEl= document.getElementById('varianceEl');
  const shareBtn  = document.getElementById('shareBtn');
  const copiedMsg = document.getElementById('copiedMsg');

  const HIDE_AT    = 3;
  const TARGET     = 10;

  let startTime = 0, raf = null, running = false, finalScore = 0;
  let phase = 'idle'; // idle | running | done

  function loop() {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed >= HIDE_AT) {
      timerEl.textContent = '??.??';
      timerEl.style.color = '#E24B4A';
    } else {
      timerEl.textContent = elapsed.toFixed(2);
      timerEl.style.color = 'var(--text)';
    }
    raf = requestAnimationFrame(loop);
  }

  function start() {
    phase = 'running';
    running = true;
    startTime = Date.now();
    timerEl.style.color = 'var(--text)';
    btnLabel.textContent = 'STOP';
    btnHint.textContent = 'press to stop';
    btnWrap.classList.add('pulsing');
    verdictEl.classList.remove('show');
    varianceEl.classList.remove('show');
    shareBtn.style.display = 'none';
    copiedMsg.textContent = '';
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    phase = 'done';
    running = false;
    cancelAnimationFrame(raf);
    btnWrap.classList.remove('pulsing');

    finalScore = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
    timerEl.textContent = finalScore.toFixed(2);

    const variance = Math.abs(TARGET - finalScore);
    const v = variance.toFixed(2);

    if (variance === 0) {
      timerEl.style.color = '#1D9E75';
      verdictEl.style.color = '#1D9E75';
      verdictEl.textContent = 'PERFECT. ABSOLUTE LEGEND.';
      varianceEl.textContent = 'exactly 10.00 — are you even human?';
    } else if (variance <= 0.05) {
      timerEl.style.color = '#1D9E75';
      verdictEl.style.color = '#1D9E75';
      verdictEl.textContent = 'INCREDIBLE';
      varianceEl.textContent = 'off by ' + v + 's — elite timing';
    } else if (variance <= 0.15) {
      timerEl.style.color = '#BA7517';
      verdictEl.style.color = '#BA7517';
      verdictEl.textContent = 'SO CLOSE';
      varianceEl.textContent = 'off by ' + v + 's — nearly there';
    } else if (variance <= 0.50) {
      timerEl.style.color = '#BA7517';
      verdictEl.style.color = '#BA7517';
      verdictEl.textContent = 'DECENT';
      varianceEl.textContent = 'off by ' + v + 's — you can do better';
    } else {
      timerEl.style.color = '#E24B4A';
      verdictEl.style.color = '#E24B4A';
      verdictEl.textContent = 'NOT EVEN CLOSE';
      varianceEl.textContent = 'off by ' + v + 's — try again';
    }

    // Animate in verdict
    requestAnimationFrame(() => {
      verdictEl.classList.add('show');
      varianceEl.classList.add('show');
    });

    btnLabel.textContent = 'RESET';
    btnHint.textContent = 'go again';
    shareBtn.style.display = 'block';
  }

  function reset() {
    phase = 'idle';
    timerEl.textContent = '0.00';
    timerEl.style.color = 'var(--text)';
    btnLabel.textContent = 'START';
    btnHint.textContent = 'press to begin';
    verdictEl.classList.remove('show');
    varianceEl.classList.remove('show');
    shareBtn.style.display = 'none';
    copiedMsg.textContent = '';
  }

  mainBtn.addEventListener('click', () => {
    if (phase === 'idle')    start();
    else if (phase === 'running') stop();
    else                    reset();
  });

  shareBtn.addEventListener('click', () => {
    const diff = (TARGET - finalScore).toFixed(2);
    const ev = diff === '0.00' ? 'PERFECT 10.00!' : 'off by ' + Math.abs(diff) + 's';
    const txt = 'PERFECT 10.00 CHALLENGE\nMy time: ' + finalScore.toFixed(2) + 's (' + ev + ')\nCan you hit a blind 10.00? Test your internal clock!';
    navigator.clipboard.writeText(txt).then(() => {
      copiedMsg.textContent = 'copied to clipboard';
      setTimeout(() => { copiedMsg.textContent = ''; }, 2000);
    }).catch(() => {
      copiedMsg.textContent = 'copy failed';
    });
  });
})();