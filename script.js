const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = 1;
canvas.style.pointerEvents = "none";

/// 🧩 PERSONALIZAÇÃO:
const PARTICLE_DENSITY = 11000;        // Quanto menor, mais partículas
const PARTICLE_COLOR = "#ffffff";      // Cor das partículas
const LINE_COLOR = "#1f1f6c";          // Cor das linhas entre partículas
const CONNECT_DISTANCE = 120;          // Distância máxima entre partículas conectadas

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initParticles() {
    const area = canvas.width * canvas.height;
    const particleCount = Math.floor(area / PARTICLE_DENSITY);
    particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: 2
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // desenha partículas
    for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.fill();
    }

    // desenha conexões
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECT_DISTANCE) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = LINE_COLOR;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    update();
    requestAnimationFrame(draw);
}

function update() {
    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }
}

// ⬇ Responsividade dinâmica
window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
});

// Inicialização inicial
resizeCanvas();
initParticles();
draw();




document.addEventListener("DOMContentLoaded", () => {
  const keyEl = document.getElementById("key-text");
  const copyBtn = document.getElementById("copy-btn");
  const reloadBtn = document.getElementById("reload-btn");
  const statusEl = document.getElementById("status");

  // Rotas em cascata (maior chance de sucesso)
  const SOURCES = [
    "https://raw.githubusercontent.com/Jhona852804/Script-roblox/main/key.txt",
    "https://cdn.jsdelivr.net/gh/Jhona852804/Script-roblox@main/key.txt",
    // GitHub API (base64) — último fallback
    "https://api.github.com/repos/Jhona852804/Script-roblox/contents/key.txt?ref=main"
  ];

  function setStatus(msg) {
    statusEl.textContent = msg || "";
  }

  function fetchWithTimeout(url, ms = 10000, opts = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    return fetch(url, { ...opts, signal: controller.signal })
      .finally(() => clearTimeout(id));
  }

  async function loadFromApiJson(response) {
    const json = await response.json();
    if (!json || !json.content) throw new Error("Resposta da API inválida");
    const decoded = atob(json.content.replace(/\n/g, ""));
    return decoded.trim();
  }

  async function loadKey() {
  keyEl.textContent = "Carregando...";
  copyBtn.disabled = true;
  setStatus("Buscando key…");

  let lastErr = null;

  for (const url of SOURCES) {
    try {
      const res = await fetchWithTimeout(url, 12000, {
        headers: { "Accept": url.includes("/contents/") ? "application/vnd.github+json" : "text/plain" },
        mode: "cors",
        cache: "no-store",
        credentials: "omit"
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);

      let text;
      if (url.includes("/contents/")) {
        text = await loadFromApiJson(res);
      } else {
        text = await res.text();
      }

      // remove quebras extras mas mantém a key
      text = text.replace(/\r?\n/g, "").trim();

      if (!text) throw new Error("Arquivo vazio");

      keyEl.textContent = text;
      copyBtn.disabled = false;   // ✅ sempre habilita quando tem texto
      setStatus(`Carregado de: ${new URL(url).hostname}`);
      return;
    } catch (err) {
      lastErr = err;
    }
  }

  keyEl.textContent = "Erro ao carregar a key";
  copyBtn.disabled = true;
  setStatus(lastErr ? String(lastErr) : "Falha desconhecida");
  console.error("Falha ao obter key:", lastErr);
  }
  async function copyKey() {
    const text = keyEl.textContent.trim();
    if (!text || text === "Carregando..." || text.startsWith("Erro")) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback legacy
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      const original = copyBtn.textContent;
      copyBtn.textContent = "Copiado ✓";
      setStatus("Key copiada para a área de transferência.");
      setTimeout(() => {
        copyBtn.textContent = original;
        setStatus("");
      }, 1400);
    } catch (e) {
      setStatus("Não foi possível copiar automaticamente.");
      console.error(e);
    }
  }

  copyBtn.addEventListener("click", copyKey);
  reloadBtn.addEventListener("click", loadKey);

  loadKey();
});
