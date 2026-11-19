// Leonida Meme Lab — client-side GTA VI meme generator.
// Draws on a 1024x1024 canvas from the embedded scene + ghost (assets.js).
// No network, no keys, no uploads: everything happens in the browser.
(function () {
  'use strict';

  var canvas = document.getElementById('meme');
  var ctx = canvas.getContext('2d');
  var S = 1024;

  // Geometry of the scene, measured on the 1024x1024 artwork.
  var SIGN = { x0: 671, y0: 403, x1: 991, y1: 613 };      // green highway sign
  var GHOST_SPOT = { cx: 845, feetY: 851 };              // grass by the sign pole

  var state = {
    template: 'welcome',
    topText: 'WELCOME TO LEONIDA',
    cap1: 'POPULATION: EVERYONE WHO',
    cap2: 'CALLED IN SICK TODAY',
    ghostOn: true,
    ghostSize: 176,
  };

  var sceneImg = new Image();
  var ghostImg = new Image();
  var loaded = 0;

  function ready() {
    loaded += 1;
    if (loaded === 2) render();
  }
  sceneImg.onload = ready;
  ghostImg.onload = ready;
  sceneImg.src = SCENE_DATA;
  ghostImg.src = GHOST_DATA;

  function fitFont(text, maxWidth, startPx, weight) {
    var px = startPx;
    ctx.font = weight + ' ' + px + 'px "Arial Black", "DejaVu Sans", sans-serif';
    while (px > 20 && ctx.measureText(text).width > maxWidth) {
      px -= 2;
      ctx.font = weight + ' ' + px + 'px "Arial Black", "DejaVu Sans", sans-serif';
    }
    return px;
  }

  function outlined(text, cx, y, px, fill) {
    ctx.font = 'bold ' + px + 'px "Arial Black", "DejaVu Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = Math.max(3, px / 14);
    ctx.strokeText(text, cx, y);
    ctx.fillStyle = fill || '#fff';
    ctx.fillText(text, cx, y);
    return px;
  }

  function splitSign(text) {
    // "WELCOME TO LEONIDA" -> ["WELCOME TO", "LEONIDA"]; short text stays one line.
    var words = text.trim().split(/\s+/);
    if (words.length < 2) return [text];
    var half = Math.ceil(words.length / 2);
    return [words.slice(0, half).join(' '), words.slice(half).join(' ')];
  }

  function drawGhost() {
    if (!state.ghostOn) return;
    var h = state.ghostSize;
    var w = Math.round(h * ghostImg.width / ghostImg.height);
    var x = GHOST_SPOT.cx - w / 2;
    var y = GHOST_SPOT.feetY - h;
    // soft contact shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(GHOST_SPOT.cx, GHOST_SPOT.feetY + 4, w * 0.42, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(ghostImg, x, y, w, h);
  }

  function drawWelcome() {
    var lines = splitSign(state.topText);
    var cx = (SIGN.x0 + SIGN.x1) / 2;
    if (lines.length === 2) {
      var p1 = fitFont(lines[0], SIGN.x1 - SIGN.x0 - 24, 35, 'bold');
      outlined(lines[0], cx, SIGN.y0 + 14, p1);
      var p2 = fitFont(lines[1], SIGN.x1 - SIGN.x0 - 24, 54, 'bold');
      outlined(lines[1], cx, SIGN.y0 + 14 + p1 + 8, p2);
    } else {
      var p = fitFont(lines[0], SIGN.x1 - SIGN.x0 - 24, 48, 'bold');
      outlined(lines[0], cx, SIGN.y0 + 60, p);
    }
    if (state.cap1) outlined(state.cap1, S / 2, 883, 56);
    if (state.cap2) outlined(state.cap2, S / 2, 944, 56);
    drawGhost();
  }

  function drawWasted() {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, S, S);
    ctx.font = 'bold 170px "Arial Black", "DejaVu Sans", sans-serif';
    try { ctx.letterSpacing = '10px'; } catch (e) {}
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#d8d8d8';
    ctx.fillText('WASTED', S / 2, S / 2 - 40);
    try { ctx.letterSpacing = '0px'; } catch (e) {}
    if (state.cap1) outlined(state.cap1, S / 2, S / 2 + 80, 44, '#e8e8e8');
    if (state.cap2) outlined(state.cap2, S / 2, S / 2 + 140, 44, '#e8e8e8');
    if (state.ghostOn) {
      var h = 130, w = Math.round(h * ghostImg.width / ghostImg.height);
      ctx.drawImage(ghostImg, S - w - 40, S - h - 40, w, h);
    }
  }

  function drawLoading() {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, S, S);
    outlined('LOADING LEONIDA...', S / 2, 400, 64);
    // progress bar, 99%
    var bx = 162, bw = S - 324, by = 500, bh = 34;
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = '#c41c83';
    ctx.fillRect(bx, by, Math.round(bw * 0.99), bh);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, bw, bh);
    outlined('99%', S / 2, by + 48, 40);
    if (state.cap1) outlined('TIP: ' + state.cap1, S / 2, 640, 34, '#ffe9f6');
    if (state.cap2) outlined(state.cap2, S / 2, 690, 34, '#ffe9f6');
    drawGhost();
  }

  function render() {
    ctx.clearRect(0, 0, S, S);
    ctx.drawImage(sceneImg, 0, 0, S, S);
    if (state.template === 'wasted') drawWasted();
    else if (state.template === 'loading') drawLoading();
    else drawWelcome();
  }

  // ---- controls ----
  document.querySelectorAll('.templates button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.templates button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      state.template = b.getAttribute('data-template');
      render();
    });
  });
  document.getElementById('topText').addEventListener('input', function (e) { state.topText = e.target.value.toUpperCase(); render(); });
  document.getElementById('cap1').addEventListener('input', function (e) { state.cap1 = e.target.value.toUpperCase(); render(); });
  document.getElementById('cap2').addEventListener('input', function (e) { state.cap2 = e.target.value.toUpperCase(); render(); });
  document.getElementById('ghostOn').addEventListener('change', function (e) { state.ghostOn = e.target.checked; render(); });
  document.getElementById('ghostSize').addEventListener('input', function (e) { state.ghostSize = +e.target.value; render(); });

  document.getElementById('featured').addEventListener('click', function () {
    state.template = 'welcome';
    state.topText = 'WELCOME TO LEONIDA';
    state.cap1 = 'POPULATION: EVERYONE WHO';
    state.cap2 = 'CALLED IN SICK TODAY';
    state.ghostOn = true;
    state.ghostSize = 176;
    document.getElementById('topText').value = state.topText;
    document.getElementById('cap1').value = state.cap1;
    document.getElementById('cap2').value = state.cap2;
    document.getElementById('ghostOn').checked = true;
    document.getElementById('ghostSize').value = 176;
    document.querySelectorAll('.templates button').forEach(function (x) {
      x.classList.toggle('active', x.getAttribute('data-template') === 'welcome');
    });
    render();
  });

  document.getElementById('download').addEventListener('click', function () {
    canvas.toBlob(function (blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'leonida-meme.png';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    }, 'image/png');
  });
})();
