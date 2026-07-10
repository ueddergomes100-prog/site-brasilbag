const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const scene = document.querySelector("[data-bag-scene]");
const bag = document.querySelector("[data-bag]");
const bagFill = document.querySelector("[data-bag-fill]");
const bagThread = document.querySelector("[data-bag-thread]");
const progressBar = document.querySelector("[data-progress-bar]");
const storyText = document.querySelector("[data-story-text]");
const quoteForm = document.querySelector(".quote-form");
const bottomThread = document.querySelector("[data-bottom-thread]");
const qualityTag = document.querySelector("[data-quality-tag]");
const stageCallout = document.querySelector("[data-stage-callout]");
const stageButtons = document.querySelectorAll("[data-step]");
const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieAccept = document.querySelector("[data-cookie-accept]");
const cookieDecline = document.querySelector("[data-cookie-decline]");

const storySteps = [
  {
    title: "Preparacao",
    text: "O tecido e posicionado, alinhado e marcado para corte, dobra e fechamento.",
    note: "Base alinhada para corte e dobra."
  },
  {
    title: "Estrutura",
    text: "A bag ganha volume, reforco e corpo para acompanhar o uso industrial.",
    note: "Volume e reforco simulados pelo scroll."
  },
  {
    title: "Impressao",
    text: "A tela de impressao aplica marca, dados do produto e identidade visual da empresa.",
    note: "A marca entra quando a impressao passa pela frente."
  },
  {
    title: "Acabamento",
    text: "Com costura, etiqueta de controle e revisao, a embalagem fica pronta para sair da fabrica.",
    note: "Costura final e liberacao de qualidade."
  }
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
}

function updateBagScene() {
  if (!scene || !bag) return;

  const rect = scene.getBoundingClientRect();
  const scrollable = scene.offsetHeight - window.innerHeight;
  const progress = clamp(-rect.top / scrollable, 0, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  const fill = clamp((progress - 0.08) / 0.42, 0, 1);
  const thread = clamp((progress - 0.66) / 0.26, 0, 1);
  const bottom = clamp((progress - 0.76) / 0.18, 0, 1);
  const quality = clamp((progress - 0.84) / 0.12, 0, 1);
  const stepIndex = clamp(Math.floor(progress * storySteps.length), 0, storySteps.length - 1);
  const step = storySteps[stepIndex];

  scene.style.setProperty("--bag-progress", eased.toFixed(3));
  bag.style.setProperty("--bag-progress", eased.toFixed(3));
  bagFill.style.height = `${Math.round(fill * 100)}%`;
  bagThread.style.opacity = thread.toFixed(3);
  bagThread.style.transform = `scaleX(${thread.toFixed(3)})`;
  if (bottomThread) {
    bottomThread.style.opacity = bottom.toFixed(3);
    bottomThread.style.transform = `scaleX(${bottom.toFixed(3)})`;
  }
  if (qualityTag) {
    qualityTag.style.opacity = quality.toFixed(3);
    qualityTag.style.transform = `scale(${(0.5 + quality * 0.5).toFixed(3)}) rotate(${(-18 + quality * 18).toFixed(2)}deg)`;
  }
  progressBar.style.width = `${Math.round(progress * 100)}%`;
  storyText.textContent = step.text;
  stageButtons.forEach((item, index) => item.classList.toggle("is-active", index <= stepIndex));
  if (stageCallout) {
    stageCallout.querySelector("strong").textContent = step.title;
    stageCallout.querySelector("span").textContent = step.note;
  }
}

menuButton?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

mobileNav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    mobileNav.classList.remove("is-open");
    menuButton?.setAttribute("aria-label", "Abrir menu");
  }
});

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const nome = data.get("nome") || "";
  const empresa = data.get("empresa") || "";
  const mensagem = data.get("mensagem") || "";
  const text = [
    "Ola, quero solicitar um orcamento com a Brasil Bag.",
    nome && `Nome: ${nome}`,
    empresa && `Empresa: ${empresa}`,
    mensagem && `Necessidade: ${mensagem}`
  ]
    .filter(Boolean)
    .join("\n");

  window.open(`https://wa.me/5500000000000?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});

function setupRevealAnimations() {
  const targets = document.querySelectorAll(".intro-grid article, .solution, .process-grid article, .quality-media img, .quality-copy, .gallery-grid figure, .faq details, .contact > *, .legal-card, .about-split > *");
  targets.forEach((target) => target.setAttribute("data-reveal", ""));

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  targets.forEach((target) => observer.observe(target));
}

function setupCookies() {
  if (!cookieBanner) return;
  const saved = localStorage.getItem("brasilBagCookies");
  if (!saved) cookieBanner.classList.add("is-visible");

  const saveChoice = (choice) => {
    localStorage.setItem("brasilBagCookies", choice);
    cookieBanner.classList.remove("is-visible");
  };

  cookieAccept?.addEventListener("click", () => saveChoice("accepted"));
  cookieDecline?.addEventListener("click", () => saveChoice("declined"));
}

window.addEventListener("scroll", () => {
  updateHeader();
  updateBagScene();
}, { passive: true });

window.addEventListener("resize", updateBagScene);

if (window.lucide) {
  window.lucide.createIcons();
}

setupRevealAnimations();
setupCookies();
updateHeader();
updateBagScene();
