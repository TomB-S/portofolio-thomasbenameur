/* =========================================================
   THOMAS BENAMEUR — PORTFOLIO
   Script principal — organisé par fonctionnalité
   ========================================================= */

// ---- Curseur personnalisé qui suit la souris ----
const cursor = document.getElementById("cursor");
window.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
// Le curseur grossit au survol des éléments "magnétiques" (boutons, flèches...)
document.querySelectorAll('[data-cursor="big"]').forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("big"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
});

// ---- Barre de navigation : ajoute une bordure au scroll ----
const nav = document.getElementById("nav");
function updateNav() {
  nav.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", updateNav);
updateNav();

// ---- Apparition des sections au scroll + déclenchement des jauges de compétences ----
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        // Anime les barres de compétences jusqu'à leur niveau (data-level) une fois visibles
        entry.target.querySelectorAll(".gauge-fill").forEach((g) => {
          g.style.width = g.dataset.level + "%";
        });
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---- Cartes d'expérience : clic pour retourner (flip 3D) ----
document.querySelectorAll(".exp-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
});

// ---- Blobs de fond réactifs au mouvement de la souris ----
const blobs = [
  { el: document.getElementById("blob1"), factor: 40 },
  { el: document.getElementById("blob2"), factor: -30 },
  { el: document.getElementById("blob3"), factor: 25 },
];
window.addEventListener("mousemove", (e) => {
  const cx = e.clientX / window.innerWidth - 0.5;
  const cy = e.clientY / window.innerHeight - 0.5;
  blobs.forEach((b) => {
    if (b.el)
      b.el.style.transform = `translate(${cx * b.factor}px, ${cy * b.factor}px)`;
  });
});

/* =========================================================
   MINI TERMINAL — easter egg du hero
   Palette inspirée de VS Code : user@host en rose/violet,
   commandes en orange, flèche de sortie en vert, texte en blanc cassé.
   ========================================================= */
const termBody = document.getElementById("termBody");

// Chaque ligne a un type : "cmd" (commande tapée) ou "output" (résultat affiché)
const termScript = [
  { type: "cmd", user: "thomas@portfolio", text: "whoami" },
  {
    type: "output",
    text: "Dev web fullstack en formation, sensibilité UX. Ex-manager d'équipe.",
  },
  { type: "cmd", user: "thomas@portfolio", text: "./chercher-stage.sh" },
  {
    type: "output",
    text: "Recherche : stage dev web, dispo rapidement. Si tu lis ça, on devrait discuter 👋",
  },
  { type: "cmd", user: "thomas@portfolio", text: "open contact" },
  { type: "output", text: "git checkout contact 🚀" },
];

let termStep = 0;

// Effet machine à écrire, caractère par caractère
function typeLine(text, el, cb) {
  let i = 0;
  function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(step, 18);
    } else if (cb) cb();
  }
  step();
}

// Construit et anime chaque ligne du terminal avec la bonne coloration
function runTerminal() {
  if (termStep >= termScript.length) {
    return;
  }
  const line = termScript[termStep];
  const row = document.createElement("div");
  row.className = "term-line";
  row.style.opacity = 1;

  if (line.type === "cmd") {
    // Ligne de commande : "thomas@portfolio" en rose/violet + commande en orange
    const userSpan = document.createElement("span");
    userSpan.className = "term-user";
    userSpan.textContent = line.user + " $ ";
    const cmdSpan = document.createElement("span");
    cmdSpan.className = "term-cmd";
    row.appendChild(userSpan);
    row.appendChild(cmdSpan);
    termBody.appendChild(row);
    typeLine(line.text, cmdSpan, () => {
      termStep++;
      setTimeout(runTerminal, 500);
    });
  } else {
    // Ligne de sortie : flèche ">" en vert + texte en blanc cassé
    const arrowSpan = document.createElement("span");
    arrowSpan.className = "term-arrow";
    arrowSpan.textContent = "> ";
    const outputSpan = document.createElement("span");
    outputSpan.className = "term-output-text";
    row.appendChild(arrowSpan);
    row.appendChild(outputSpan);
    termBody.appendChild(row);
    typeLine(line.text, outputSpan, () => {
      termStep++;
      setTimeout(runTerminal, 500);
    });
  }
}
setTimeout(runTerminal, 900);

// Clic sur le terminal : redirige vers la section contact
document.querySelector(".term").addEventListener("click", () => {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

/* =========================================================
   CARROUSEL DE PROJETS — glisser + boutons flèches
   ========================================================= */
const track = document.getElementById("carTrack");
const cards = track.querySelectorAll(".proj-card");
const carIdx = document.getElementById("carIdx");

function cardStep() {
  return (
    cards[1].getBoundingClientRect().left -
    cards[0].getBoundingClientRect().left
  );
}

function updateIdx() {
  const step = cardStep();
  const idx = Math.round(track.scrollLeft / step);
  carIdx.textContent = Math.min(idx + 1, cards.length);
}
track.addEventListener("scroll", () => {
  requestAnimationFrame(updateIdx);
});
document
  .getElementById("carNext")
  .addEventListener("click", () =>
    track.scrollBy({ left: cardStep(), behavior: "smooth" }),
  );
document
  .getElementById("carPrev")
  .addEventListener("click", () =>
    track.scrollBy({ left: -cardStep(), behavior: "smooth" }),
  );

// Glisser à la souris (drag to scroll)
let isDown = false,
  startX,
  scrollStart;
track.addEventListener("mousedown", (e) => {
  isDown = true;
  track.classList.add("dragging");
  startX = e.pageX;
  scrollStart = track.scrollLeft;
});
window.addEventListener("mouseup", () => {
  isDown = false;
  track.classList.remove("dragging");
});
window.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  track.scrollLeft = scrollStart - (e.pageX - startX);
});

// ---- Effet tilt 3D au survol des cartes projet ----
document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateY(0) rotateX(0)";
  });
});

// ---- Boutons magnétiques : suivent légèrement le curseur ----
document.querySelectorAll(".btn-magnet").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0)";
  });
});

// ---- Onglets de la section Formation ----
document.querySelectorAll(".edu-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".edu-tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".edu-panel")
      .forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
  });
});
