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
  const keyElement = document.getElementById("key-text");

  // URL bruta do GitHub (exemplo: https://raw.githubusercontent.com/user/repo/branch/key.txt)
  const keyURL = "https://raw.githubusercontent.com/Jhona852804/Script-roblox/main/key.txt";

  fetch(keyURL)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar a key");
      return response.text();
    })
    .then(data => {
      keyElement.textContent = data.trim();
    })
    .catch(error => {
      keyElement.textContent = "Erro ao carregar a key";
      console.error(error);
    });
});
