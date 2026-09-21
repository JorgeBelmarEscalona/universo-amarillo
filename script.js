(() => {
  document.body.classList.add("locked");
  const canvas = document.getElementById("universe");
  const intro = document.getElementById("intro");
  const startButton = document.getElementById("startButton");
  const experience = document.getElementById("experience");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 6;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x03030b, 1);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = innerWidth < 768 ? 1100 : 2200;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 38;
    positions[i3 + 1] = (Math.random() - 0.5) * 38;
    positions[i3 + 2] = (Math.random() - 0.5) * 30;
  }
  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.028, transparent: true, opacity: 0.85, sizeAttenuation: true });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  const goldGeometry = new THREE.BufferGeometry();
  const goldCount = innerWidth < 768 ? 120 : 250;
  const goldPositions = new Float32Array(goldCount * 3);
  for (let i = 0; i < goldCount; i++) {
    const i3 = i * 3;
    goldPositions[i3] = (Math.random() - 0.5) * 32;
    goldPositions[i3 + 1] = (Math.random() - 0.5) * 32;
    goldPositions[i3 + 2] = (Math.random() - 0.5) * 24;
  }
  goldGeometry.setAttribute("position", new THREE.BufferAttribute(goldPositions, 3));
  const goldMaterial = new THREE.PointsMaterial({ color: 0xffd84d, size: 0.045, transparent: true, opacity: 0.7, sizeAttenuation: true });
  const goldStars = new THREE.Points(goldGeometry, goldMaterial);
  scene.add(goldStars);

  let targetX = 0, targetY = 0, scrollTarget = 0;
  window.addEventListener("pointermove", (event) => {
    targetX = (event.clientX / innerWidth - 0.5) * 0.9;
    targetY = (event.clientY / innerHeight - 0.5) * 0.65;
  }, { passive: true });
  window.addEventListener("scroll", () => { scrollTarget = window.scrollY * 0.00065; }, { passive: true });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    stars.rotation.y += (targetX * 0.0011 - stars.rotation.y * 0.001);
    stars.rotation.x += (-targetY * 0.001 - stars.rotation.x * 0.001);
    stars.rotation.z = Math.sin(t * 0.04) * 0.02 + scrollTarget * 0.04;
    goldStars.rotation.y = -t * 0.008;
    goldStars.rotation.x = Math.sin(t * 0.05) * 0.05;
    camera.position.x += (targetX * 0.28 - camera.position.x) * 0.03;
    camera.position.y += (-targetY * 0.22 - camera.position.y) * 0.03;
    renderer.render(scene, camera);
  }
  animate();

  startButton.addEventListener("click", () => {
    intro.classList.add("hidden");
    experience.classList.add("visible");
    experience.setAttribute("aria-hidden", "false");
    document.body.classList.remove("locked");
    setTimeout(() => document.querySelector(".hero .reveal")?.classList.add("visible"), 400);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
  }, { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  const starMessage = document.getElementById("starMessage");
  let messageTimer;
  document.querySelectorAll(".wish-star").forEach((star) => {
    star.addEventListener("click", () => {
      clearTimeout(messageTimer);
      starMessage.textContent = star.dataset.message;
      starMessage.classList.add("show");
      messageTimer = setTimeout(() => starMessage.classList.remove("show"), 2200);
    });
  });

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();
