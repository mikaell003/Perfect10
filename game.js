(function () {

  const timerEl = document.getElementById('timerEl');
  const mainBtn = document.getElementById('mainBtn');
  const btnLabel = document.getElementById('btnLabel');
  const btnHint = document.getElementById('btnHint');
  const btnWrap = document.getElementById('btnWrap');

  const verdictEl = document.getElementById('verdictEl');
  const varianceEl = document.getElementById('varianceEl');

  const shareBtn = document.getElementById('shareBtn');
  const xBtn = document.getElementById('xBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');

  const copiedMsg = document.getElementById('copiedMsg');

  const HIDE_AT = 3;
  const TARGET = 10;

  let startTime = 0;
  let raf = null;
  let finalScore = 0;
  let phase = "idle";

  function loop() {

    const elapsed = (Date.now() - startTime) / 1000;

    if (elapsed >= HIDE_AT) {
      timerEl.textContent = "??.??";
      timerEl.style.color = "#E24B4A";
    } else {
      timerEl.textContent = elapsed.toFixed(2);
      timerEl.style.color = "var(--text)";
    }

    raf = requestAnimationFrame(loop);
  }

  function start() {

    phase = "running";
    startTime = Date.now();

    btnLabel.textContent = "STOP";
    btnHint.textContent = "press to stop";

    btnWrap.classList.add("pulsing");

    verdictEl.classList.remove("show");
    varianceEl.classList.remove("show");

    shareBtn.style.display = "none";
    xBtn.style.display = "none";
    whatsappBtn.style.display = "none";

    copiedMsg.textContent = "";

    raf = requestAnimationFrame(loop);
  }

  function stop() {

    phase = "done";

    cancelAnimationFrame(raf);

    btnWrap.classList.remove("pulsing");

    finalScore = parseFloat(
      ((Date.now() - startTime) / 1000).toFixed(2)
    );

    timerEl.textContent = finalScore.toFixed(2);

    const variance = Math.abs(TARGET - finalScore);
    const v = variance.toFixed(2);

    if (variance === 0) {

      timerEl.style.color = "#1D9E75";
      verdictEl.style.color = "#1D9E75";

      verdictEl.textContent = "PERFECT. ABSOLUTE LEGEND.";
      varianceEl.textContent = "exactly 10.00 — are you even human?";

    } else if (variance <= 0.05) {

      timerEl.style.color = "#1D9E75";
      verdictEl.style.color = "#1D9E75";

      verdictEl.textContent = "INCREDIBLE";
      varianceEl.textContent = "off by " + v + "s — elite timing";

    } else if (variance <= 0.15) {

      timerEl.style.color = "#BA7517";
      verdictEl.style.color = "#BA7517";

      verdictEl.textContent = "SO CLOSE";
      varianceEl.textContent = "off by " + v + "s — nearly there";

    } else if (variance <= 0.50) {

      timerEl.style.color = "#BA7517";
      verdictEl.style.color = "#BA7517";

      verdictEl.textContent = "DECENT";
      varianceEl.textContent = "off by " + v + "s — you can do better";

    } else {

      timerEl.style.color = "#E24B4A";
      verdictEl.style.color = "#E24B4A";

      verdictEl.textContent = "NOT EVEN CLOSE";
      varianceEl.textContent = "off by " + v + "s — try again";
    }

    requestAnimationFrame(() => {
      verdictEl.classList.add("show");
      varianceEl.classList.add("show");
    });

    btnLabel.textContent = "RESET";
    btnHint.textContent = "go again";

    shareBtn.style.display = "block";
    xBtn.style.display = "block";
    whatsappBtn.style.display = "block";
  }

  function reset() {

    phase = "idle";

    timerEl.textContent = "0.00";
    timerEl.style.color = "var(--text)";

    btnLabel.textContent = "START";
    btnHint.textContent = "press to begin";

    verdictEl.classList.remove("show");
    varianceEl.classList.remove("show");

    shareBtn.style.display = "none";
    xBtn.style.display = "none";
    whatsappBtn.style.display = "none";

    copiedMsg.textContent = "";
  }

  mainBtn.addEventListener("click", () => {

    if (phase === "idle") {
      start();
    }
    else if (phase === "running") {
      stop();
    }
    else {
      reset();
    }

  });

  function shareText() {

    const diff = Math.abs(TARGET - finalScore).toFixed(2);

    return `🎯 PERFECT 10.00 Challenge

My time: ${finalScore.toFixed(2)}s
Off by: ${diff}s

Can you beat me?

https://perfect-10.netlify.app`;
  }

  shareBtn.addEventListener("click", () => {

    navigator.clipboard.writeText(shareText());

    copiedMsg.textContent = "Copied to clipboard";

    setTimeout(() => {
      copiedMsg.textContent = "";
    }, 2000);
  });

  xBtn.addEventListener("click", () => {

    window.open(
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(shareText()),
      "_blank"
    );

  });

  whatsappBtn.addEventListener("click", () => {

    window.open(
      "https://wa.me/?text=" +
      encodeURIComponent(shareText()),
      "_blank"
    );

  });

})();
