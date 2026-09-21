(() => {
  const canvas = document.getElementById("universe");
  const intro = document.getElementById("intro");
  const startButton = document.getElementById("startButton");
  const experience = document.getElementById("experience");

  document.body.classList.add("locked");

  // Registrar primero la interacción principal para que el botón funcione
  // incluso si cualquier efecto visual falla más adelante.
  if (startButton) {
    startButton.addEventListener("click", () => {
      intro?.classList.add("hidden");
      experience?.classList.add("visible");
      experience?.setAttribute("aria-hidden", "false");
      document.body.classList.remove("locked");

      setTimeout(() => {
        document.querySelector(".hero .reveal")?.classList.add("visible");
      }, 350);
    });
  }

  // Animaciones de aparición.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.18 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  // Estrellas interactivas.
  const starMessage = document.getElementById("starMessage");
  let messageTimer;

  document.querySelectorAll(".wish-star").forEach((star) => {
    star.addEventListener("click", () => {
      if (!starMessage) return;
      clearTimeout(messageTimer);
      starMessage.textContent = star.dataset.message || "✨";
      starMessage.classList.add("show");
      messageTimer = setTimeout(() => starMessage.classList.remove("show"), 2200);
    });
  });

  // Universo nativo en Canvas. Sin dependencias externas.
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let pointerX = 0;
  let pointerY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let scrollDepth = 0;
  let stars = [];
  let goldenDust = [];

  const STAR_COUNT_DESKTOP = 900;
  const STAR_COUNT_MOBILE = 480;
  const GOLD_COUNT_DESKTOP = 90;
  const GOLD_COUNT_MOBILE = 50;

  function createParticle(golden = false) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.15 + Math.random() * 0.85,
      size: golden ? 0.7 + Math.random() * 1.4 : 0.35 + Math.random() * 1.35,
      alpha: golden ? 0.2 + Math.random() * 0.6 : 0.2 + Math.random() * 0.75,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.85
    };
  }

  function populate() {
    const mobile = width < 768;
    const starCount = mobile ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
    const goldCount = mobile ? GOLD_COUNT_MOBILE : GOLD_COUNT_DESKTOP;

    stars = Array.from({ length: starCount }, () => createParticle(false));
    goldenDust = Array.from({ length: goldCount }, () => createParticle(true));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    populate();
  }

  window.addEventListener("pointermove", (event) => {
    pointerX = (event.clientX / width - 0.5) * 2;
    pointerY = (event.clientY / height - 0.5) * 2;
  }, { passive: true });

  window.addEventListener("scroll", () => {
    scrollDepth = window.scrollY * 0.015;
  }, { passive: true });

  function wrapParticle(p) {
    if (p.x < -40) p.x = width + 40;
    if (p.x > width + 40) p.x = -40;
    if (p.y < -40) p.y = height + 40;
    if (p.y > height + 40) p.y = -40;
  }

  function drawParticle(p, time, golden = false) {
    const depthX = smoothX * 22 * p.z;
    const depthY = smoothY * 16 * p.z;
    const scrollY = (scrollDepth * p.z) % (height + 80);

    let x = p.x + depthX;
    let y = p.y + depthY + scrollY;

    while (y > height + 40) y -= height + 80;
    while (y < -40) y += height + 80;

    const pulse = 0.72 + Math.sin(time * 0.0018 * p.speed + p.twinkle) * 0.28;
    const radius = p.size * (0.65 + p.z * 0.9);
    const alpha = Math.max(0.05, p.alpha * pulse);

    if (golden) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 7);
      glow.addColorStop(0, `rgba(255, 226, 105, ${alpha})`);
      glow.addColorStop(0.18, `rgba(255, 205, 62, ${alpha * 0.5})`);
      glow.addColorStop(1, "rgba(255, 190, 30, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 7, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      if (p.z > 0.78 && pulse > 0.88) {
        ctx.strokeStyle = `rgba(255, 245, 190, ${alpha * 0.35})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x - radius * 4, y);
        ctx.lineTo(x + radius * 4, y);
        ctx.moveTo(x, y - radius * 4);
        ctx.lineTo(x, y + radius * 4);
        ctx.stroke();
      }
    }
  }

  function animate(time = 0) {
    ctx.clearRect(0, 0, width, height);

    smoothX += (pointerX - smoothX) * 0.025;
    smoothY += (pointerY - smoothY) * 0.025;

    // Fondo con ligera profundidad azul/negra.
    const background = ctx.createRadialGradient(
      width * (0.48 + smoothX * 0.015),
      height * (0.42 + smoothY * 0.015),
      0,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    background.addColorStop(0, "rgba(12, 12, 35, 0.32)");
    background.addColorStop(0.55, "rgba(5, 5, 20, 0.17)");
    background.addColorStop(1, "rgba(2, 2, 10, 0)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    stars.forEach((p) => drawParticle(p, time, false));
    goldenDust.forEach((p) => drawParticle(p, time, true));

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  requestAnimationFrame(animate);
})();
