document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     APP REGISTRY
     ============================================================ */
  const APPS = {
    about:    { title: 'My Computer — About',        icon: 'img/My Computer.png',                   address: 'My Computer' },
    gallery:  { title: 'My Pictures',                icon: 'img/My Pictures.png',                   address: 'My Computer\\My Pictures' },
    funfacts: { title: 'Notepad — fun_facts.txt',    icon: 'img/Whistler - Help and Support.png',   address: 'My Computer\\My Documents\\fun_facts.txt' },
    games:    { title: 'My Games — Snake',           icon: 'img/My Games.png',                      address: 'My Computer\\My Games\\Snake' },
    contact:  { title: 'Outlook Express — Contact',  icon: 'img/Email.png',                         address: 'My Computer\\Address Book' },
  };


  /* ============================================================
     CLOCK
     ============================================================ */
  const clockEl = document.getElementById('tb-clock');

  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const h   = now.getHours()  .toString().padStart(2, '0');
    const m   = now.getMinutes().toString().padStart(2, '0');
    clockEl.textContent = `${h}:${m}`;
  }

  updateClock();
  setInterval(updateClock, 30_000);


  /* ============================================================
     SNAKE GAME
     ============================================================ */
  function createSnakeGame(container) {
    const canvas  = container.querySelector('.snake-canvas');
    const scoreEl = container.querySelector('.snake-score-val');
    if (!canvas) return null;

    const ctx  = canvas.getContext('2d');
    const W    = canvas.width;
    const H    = canvas.height;
    const CELL = 15;
    const COLS = Math.floor(W / CELL);
    const ROWS = Math.floor(H / CELL);

    let snake, dir, nextDir, food, score, alive, timerId, speed;

    function rand(n) { return Math.floor(Math.random() * n); }

    function spawnFood() {
      let pos;
      do { pos = { x: rand(COLS), y: rand(ROWS) }; }
      while (snake.some(s => s.x === pos.x && s.y === pos.y));
      return pos;
    }

    function start() {
      snake   = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      dir     = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score   = 0;
      speed   = 150;
      alive   = true;
      if (scoreEl) scoreEl.textContent = 0;
      food    = spawnFood();
      clearInterval(timerId);
      timerId = setInterval(tick, speed);
      draw();
    }

    function tick() {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score++;
        if (scoreEl) scoreEl.textContent = score;
        food = spawnFood();
        if (score % 5 === 0 && speed > 70) {
          speed -= 10;
          clearInterval(timerId);
          timerId = setInterval(tick, speed);
        }
      } else {
        snake.pop();
      }

      draw();
    }

    function draw() {
      // Background
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = '#161b22';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
          ctx.strokeRect(x * CELL, y * CELL, CELL, CELL);
        }
      }

      // Food (red pixel with shine)
      const fx = food.x * CELL + 2;
      const fy = food.y * CELL + 2;
      const fs = CELL - 4;
      ctx.fillStyle = '#f44';
      ctx.fillRect(fx, fy, fs, fs);
      ctx.fillStyle = 'rgba(255,200,200,0.5)';
      ctx.fillRect(fx + 2, fy + 1, Math.floor(fs / 3), Math.floor(fs / 3));

      // Snake
      snake.forEach((seg, i) => {
        if (i === 0) {
          ctx.fillStyle = '#4ade80'; // head — bright green
        } else {
          // Fade toward tail
          const fade = Math.max(0.55, 1 - i / snake.length);
          ctx.fillStyle = `rgba(22,163,74,${fade})`;
        }
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);

        // Eyes on head
        if (i === 0) {
          ctx.fillStyle = '#0d1117';
          // Right-side eyes (always visible regardless of direction)
          ctx.fillRect(seg.x * CELL + CELL - 5, seg.y * CELL + 3, 2, 2);
          ctx.fillRect(seg.x * CELL + CELL - 5, seg.y * CELL + CELL - 5, 2, 2);
        }
      });
    }

    function gameOver() {
      alive = false;
      clearInterval(timerId);

      ctx.fillStyle = 'rgba(0,0,0,0.78)';
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign  = 'center';
      ctx.fillStyle  = '#f44';
      ctx.font       = 'bold 22px "Courier New", monospace';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 22);

      ctx.fillStyle  = '#aaa';
      ctx.font       = '14px "Courier New", monospace';
      ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 6);

      ctx.fillStyle  = '#555';
      ctx.font       = '12px "Courier New", monospace';
      ctx.fillText('Space / tap to restart', W / 2, H / 2 + 30);
    }

    // Keyboard controls
    const onKey = (e) => {
      const moves = {
        ArrowUp:    { x: 0,  y: -1 },
        ArrowDown:  { x: 0,  y: 1  },
        ArrowLeft:  { x: -1, y: 0  },
        ArrowRight: { x: 1,  y: 0  },
        w: { x: 0,  y: -1 },
        s: { x: 0,  y: 1  },
        a: { x: -1, y: 0  },
        d: { x: 1,  y: 0  },
      };
      const m = moves[e.key];
      if (m) {
        e.preventDefault();
        if (m.x !== -dir.x || m.y !== -dir.y) nextDir = m;
      }
      if (e.key === ' ' && !alive) start();
    };
    document.addEventListener('keydown', onKey);

    // D-pad buttons
    container.querySelectorAll('.dpad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.dataset.dir;
        if (d === 'restart') { start(); return; }
        const moves = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
        const m = moves[d];
        if (!m) return;
        if (!alive) { start(); return; }
        if (m.x !== -dir.x || m.y !== -dir.y) nextDir = m;
      });
    });

    // Canvas tap to restart on game over
    canvas.addEventListener('click', () => { if (!alive) start(); });

    start();

    return {
      stop() {
        clearInterval(timerId);
        document.removeEventListener('keydown', onKey);
      }
    };
  }


  /* ============================================================
     WINDOW MANAGER
     ============================================================ */
  const overlay      = document.getElementById('xp-overlay');
  const xpWin        = document.getElementById('xp-win');
  const xpTitleEl    = document.getElementById('xp-title');
  const xpAddressEl  = document.getElementById('xp-address');
  const xpBody       = document.getElementById('xp-body');
  const tbWindows    = document.getElementById('tb-windows');

  let openAppId   = null;
  let isMinimised = false;
  let activeGame  = null; // running snake instance (desktop)

  function openApp(id) {
    const app = APPS[id];
    if (!app) return;
    const tpl = document.getElementById(`tpl-${id}`);
    if (!tpl) return;

    // Stop any running game
    if (activeGame) { activeGame.stop(); activeGame = null; }

    openAppId   = id;
    isMinimised = false;

    xpTitleEl.textContent   = app.title;
    if (xpAddressEl) xpAddressEl.textContent = app.address;

    xpBody.innerHTML = '';
    xpBody.appendChild(tpl.content.cloneNode(true));

    xpWin.dataset.app = id;

    // Reset position/maximise
    xpWin.dataset.maximised = '0';
    xpWin.style.cssText = '';

    overlay.setAttribute('aria-hidden', 'false');
    closeStartMenu();

    // Start game if games window opened
    if (id === 'games') {
      activeGame = createSnakeGame(xpBody.querySelector('.cnt-games'));
    }

    renderTaskbar();
  }

  function closeWindow() {
    if (activeGame) { activeGame.stop(); activeGame = null; }
    overlay.setAttribute('aria-hidden', 'true');
    openAppId   = null;
    isMinimised = false;
    renderTaskbar();
  }

  function minimiseWindow() {
    overlay.setAttribute('aria-hidden', 'true');
    isMinimised = true;
    renderTaskbar();
  }

  function toggleMaximise() {
    const isMax = xpWin.dataset.maximised === '1';
    if (isMax) {
      xpWin.dataset.maximised = '0';
      xpWin.style.cssText = '';
    } else {
      xpWin.dataset.maximised = '1';
      xpWin.style.cssText = 'position:fixed;left:0;top:0;width:100vw;max-height:calc(100vh - 40px);';
    }
  }

  function renderTaskbar() {
    tbWindows.innerHTML = '';
    if (!openAppId) return;

    const app = APPS[openAppId];
    const btn = document.createElement('button');
    btn.className = `tb-btn${isMinimised ? '' : ' active'}`;

    const img = document.createElement('img');
    img.src = app.icon;
    img.alt = '';
    btn.appendChild(img);
    btn.appendChild(document.createTextNode(app.title.split(' — ')[0]));

    btn.addEventListener('click', () => {
      if (isMinimised) {
        isMinimised = false;
        overlay.setAttribute('aria-hidden', 'false');
        renderTaskbar();
      } else {
        minimiseWindow();
      }
    });

    tbWindows.appendChild(btn);
  }

  /* Window controls */
  document.getElementById('btn-close')   ?.addEventListener('click', closeWindow);
  document.getElementById('btn-min')     ?.addEventListener('click', minimiseWindow);
  document.getElementById('btn-max')     ?.addEventListener('click', toggleMaximise);
  document.getElementById('btn-nav-back')?.addEventListener('click', closeWindow);
  document.getElementById('btn-nav-home')?.addEventListener('click', closeWindow);

  /* Close on backdrop click */
  overlay?.addEventListener('click', e => {
    if (e.target === overlay) closeWindow();
  });

  /* ESC to close */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay?.getAttribute('aria-hidden') === 'false') closeWindow();
  });


  /* ============================================================
     XP WINDOW DRAG  (by title bar)
     ============================================================ */
  const xpTitlebar = document.getElementById('xp-titlebar');

  if (xpTitlebar) {
    let dragging = false;
    let sx, sy, ox, oy;

    xpTitlebar.addEventListener('pointerdown', e => {
      if (e.target.tagName === 'BUTTON') return;
      if (xpWin.dataset.maximised === '1') return;

      dragging = true;
      sx = e.clientX;
      sy = e.clientY;
      const r = xpWin.getBoundingClientRect();
      ox = r.left;
      oy = r.top;
      xpWin.style.position = 'fixed';
      xpWin.style.left     = ox + 'px';
      xpWin.style.top      = oy + 'px';
      xpTitlebar.setPointerCapture(e.pointerId);
    });

    xpTitlebar.addEventListener('pointermove', e => {
      if (!dragging) return;
      let nx = ox + (e.clientX - sx);
      let ny = oy + (e.clientY - sy);
      nx = Math.max(0, Math.min(nx, window.innerWidth  - xpWin.offsetWidth));
      ny = Math.max(0, Math.min(ny, window.innerHeight - xpWin.offsetHeight - 40));
      xpWin.style.left = nx + 'px';
      xpWin.style.top  = ny + 'px';
    });

    xpTitlebar.addEventListener('pointerup', () => { dragging = false; });
  }


  /* ============================================================
     DESKTOP ICONS  (click to open, drag to reposition)
     ============================================================ */
  document.querySelectorAll('.d-icon').forEach(icon => {
    const id = icon.dataset.app;
    let dragStart = null;
    let hasMoved  = false;

    icon.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      icon.setPointerCapture(e.pointerId);
      hasMoved  = false;
      dragStart = {
        px: e.clientX, py: e.clientY,
        ix: parseInt(icon.style.left, 10) || 0,
        iy: parseInt(icon.style.top,  10) || 0,
      };
    });

    icon.addEventListener('pointermove', e => {
      if (!dragStart) return;
      const dx = e.clientX - dragStart.px;
      const dy = e.clientY - dragStart.py;
      if (!hasMoved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      hasMoved = true;

      const dRect = document.getElementById('desktop').getBoundingClientRect();
      let nx = dragStart.ix + dx;
      let ny = dragStart.iy + dy;
      nx = Math.max(0, Math.min(nx, dRect.width  - icon.offsetWidth));
      ny = Math.max(0, Math.min(ny, dRect.height - icon.offsetHeight - 44));
      icon.style.left = nx + 'px';
      icon.style.top  = ny + 'px';
    });

    icon.addEventListener('pointerup', e => {
      const wasClick = !hasMoved;
      dragStart = null;
      hasMoved  = false;
      try { icon.releasePointerCapture(e.pointerId); } catch (_) {}

      if (wasClick) {
        document.querySelectorAll('.d-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
        openApp(id);
      }
    });

    icon.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openApp(id); }
    });
  });

  /* Click desktop to deselect icons */
  document.getElementById('desktop')?.addEventListener('click', e => {
    if (!e.target.closest('.d-icon')) {
      document.querySelectorAll('.d-icon').forEach(i => i.classList.remove('selected'));
    }
  });


  /* ============================================================
     START MENU
     ============================================================ */
  const startMenu = document.getElementById('start-menu');
  const startBtn  = document.getElementById('start-btn');

  function closeStartMenu() {
    startMenu?.setAttribute('aria-hidden', 'true');
  }

  startBtn?.addEventListener('click', e => {
    e.stopPropagation();
    const hidden = startMenu.getAttribute('aria-hidden') !== 'false';
    startMenu.setAttribute('aria-hidden', hidden ? 'false' : 'true');
  });

  document.addEventListener('click', e => {
    if (startMenu && !startMenu.contains(e.target) && e.target !== startBtn) {
      closeStartMenu();
    }
  });

  startMenu?.querySelectorAll('.sm-item').forEach(btn => {
    btn.addEventListener('click', () => {
      closeStartMenu();
      openApp(btn.dataset.app);
    });
  });


  /* ============================================================
     MOBILE — fill card bodies from templates
     ============================================================ */
  document.querySelectorAll('.m-card').forEach(card => {
    const tpl = document.getElementById(`tpl-${card.dataset.app}`);
    if (tpl) card.querySelector('.m-card-body').appendChild(tpl.content.cloneNode(true));
  });


  /* ============================================================
     MOBILE — horizontal swipe
     ============================================================ */
  const track  = document.getElementById('cards-track');
  const dots   = Array.from(document.querySelectorAll('.dot'));
  const cards  = Array.from(document.querySelectorAll('.m-card'));
  const N      = cards.length;

  let current    = 0;
  let touchSX    = 0, touchSY = 0;
  let swiping    = false;
  let mobileGameStarted = false;

  function gotoCard(index, animate = true) {
    current = Math.max(0, Math.min(index, N - 1));
    track.style.transition = animate
      ? 'transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94)'
      : 'none';
    track.style.transform = `translateX(-${current * 100}vw)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Start snake when user first arrives at games card on mobile
    if (!mobileGameStarted && cards[current]?.dataset.app === 'games') {
      mobileGameStarted = true;
      setTimeout(() => {
        const container = cards[current].querySelector('.cnt-games');
        if (container) createSnakeGame(container); // runs independently on mobile
      }, 350);
    }
  }

  gotoCard(0, false);

  if (track) {
    track.addEventListener('touchstart', e => {
      touchSX  = e.touches[0].clientX;
      touchSY  = e.touches[0].clientY;
      swiping  = false;
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - touchSX;
      const dy = e.touches[0].clientY - touchSY;
      if (!swiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) swiping = true;
      if (!swiping) return;
      track.style.transition = 'none';
      track.style.transform  = `translateX(${-current * window.innerWidth + dx}px)`;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      if (!swiping) return;
      swiping = false;
      const dx = e.changedTouches[0].clientX - touchSX;
      if (dx < -50)     gotoCard(current + 1);
      else if (dx > 50) gotoCard(current - 1);
      else              gotoCard(current);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => gotoCard(+dot.dataset.index));
  });

});
