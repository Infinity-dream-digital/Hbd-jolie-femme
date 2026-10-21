const revealElements = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const wishButton = document.querySelector("#wish-button");
const hiddenWish = document.querySelector("#hidden-wish");

wishButton.addEventListener("click", () => {
  const isVisible = hiddenWish.classList.toggle("is-visible");
  wishButton.setAttribute("aria-expanded", String(isVisible));
  wishButton.querySelector("span").textContent = isVisible ? "−" : "↗";
  wishButton.firstChild.textContent = isVisible ? "Refermer le dernier mot " : "Garder un dernier mot ";
});

const soundButton = document.querySelector("#sound-toggle");
const soundLabel = document.querySelector("#sound-label");
let audioContext;
let oscillators = [];

soundButton.addEventListener("click", async () => {
  if (soundButton.getAttribute("aria-pressed") === "true") {
    oscillators.forEach((oscillator) => oscillator.stop());
    oscillators = [];
    soundButton.setAttribute("aria-pressed", "false");
    soundLabel.textContent = "SON OFF";
    return;
  }

  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") await audioContext.resume();
  const master = audioContext.createGain();
  master.gain.value = 0.018;
  master.connect(audioContext.destination);

  [220, 277.18, 329.63].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const voice = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    voice.gain.value = index === 0 ? 0.48 : 0.25;
    oscillator.connect(voice);
    voice.connect(master);
    oscillator.start();
    oscillators.push(oscillator);
  });

  soundButton.setAttribute("aria-pressed", "true");
  soundLabel.textContent = "SON ON";
});

const cursorGlow = document.querySelector(".cursor-glow");
if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
} else {
  cursorGlow.remove();
}
