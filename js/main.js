/* =======================
   CONFIGURACIÓN GENERAL
======================= */

// ✅ Fecha real del evento: 28/03/2026 21:30 (Argentina)
const FECHA_EVENTO = new Date("2026-03-28T21:30:00").getTime();

// Duraciones animaciones (ms)
const TIEMPO_APERTURA_SOBRE = 600;
const TIEMPO_MOSTRAR_CONTENIDO = 1200;

/* =======================
   ELEMENTOS DOM
======================= */

// ❌ Ya no usamos btnOpen
const cover = document.getElementById("cover");
const contenido = document.getElementById("contenido");
const musica = document.getElementById("musica");

// El sobre clickeable (id nuevo)
const envelope = document.querySelector(".envelope");
const envelopeOpen = document.getElementById("envelopeOpen");

const diasEl = document.getElementById("dias");
const horasEl = document.getElementById("horas");
const minutosEl = document.getElementById("minutos");
const segundosEl = document.getElementById("segundos");

const btnCopiarAlias = document.getElementById("btnCopiarAlias");
const aliasTexto = document.getElementById("aliasTexto");

/* =======================
   APERTURA INVITACIÓN (FIX + CSS is-hidden)
======================= */

let yaAbrio = false;

function abrirInvitacion() {
  if (yaAbrio) return;
  yaAbrio = true;

  // 1) Abrir solapa del sobre
  if (envelope) envelope.classList.add("open");

  // 2) Iniciar música (si existe)
  if (musica) {
    musica.volume = 0.5;
    musica.play().catch(() => {});
  }

  // 3) Fade out portada usando clase CSS
  setTimeout(() => {
    if (cover) cover.classList.add("is-hidden");
  }, TIEMPO_APERTURA_SOBRE);

  // 4) Ocultar cover + mostrar contenido
  setTimeout(() => {
    if (cover) cover.style.display = "none";

    if (contenido) {
      contenido.classList.remove("d-none");
      contenido.classList.add("fade-in");
    }
  }, TIEMPO_MOSTRAR_CONTENIDO);
}

/* ✅ Evento: click en el sobre */
if (envelopeOpen) {
  envelopeOpen.addEventListener("click", abrirInvitacion);

  envelopeOpen.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirInvitacion();
    }
  });
}


/* =======================
   CONTADOR REGRESIVO
======================= */

function actualizarContador() {
  const ahora = Date.now();
  const distancia = FECHA_EVENTO - ahora;

  if (distancia <= 0) {
    setContador("00", "00", "00", "00");
    return;
  }

  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((distancia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((distancia / (1000 * 60)) % 60);
  const segundos = Math.floor((distancia / 1000) % 60);

  setContador(dias, horas, minutos, segundos);
}

function setContador(d, h, m, s) {
  if (diasEl) diasEl.textContent = String(d).padStart(2, "0");
  if (horasEl) horasEl.textContent = String(h).padStart(2, "0");
  if (minutosEl) minutosEl.textContent = String(m).padStart(2, "0");
  if (segundosEl) segundosEl.textContent = String(s).padStart(2, "0");
}

/* =======================
   COPIAR ALIAS (REGALO)
======================= */

if (btnCopiarAlias && aliasTexto) {
  btnCopiarAlias.addEventListener("click", () => {
    const texto = aliasTexto.textContent.trim();

    navigator.clipboard.writeText(texto).then(() => {
      btnCopiarAlias.innerHTML = "✔ Alias copiado";

      setTimeout(() => {
        btnCopiarAlias.innerHTML =
          '<i class="bi bi-clipboard"></i> Copiar alias';
      }, 2000);
    });
  });
}

/* =======================
   INICIALIZACIÓN
======================= */

actualizarContador();
setInterval(actualizarContador, 1000);
