/* =======================
   CONFIGURACIÓN GENERAL
======================= */

// ✅ Fecha real del evento: 28/03/2026 21:30 (Argentina)
const FECHA_EVENTO = new Date("2026-03-28T21:30:00").getTime();

// Duraciones animaciones (ms)
const TIEMPO_APERTURA_SOBRE = 600;
const TIEMPO_MOSTRAR_CONTENIDO = 1200;

// ✅ WhatsApp (cambiá por el real)
const WHATSAPP_NUMERO = "5492344502066";

/* =======================
   ELEMENTOS DOM
======================= */

// Portada / contenido
const cover = document.getElementById("cover");
const contenido = document.getElementById("contenido");

// Música <audio id="musica" ...>
const musica = document.getElementById("musica");

// Sobre clickeable
const envelope = document.querySelector(".envelope");
const envelopeOpen = document.getElementById("envelopeOpen");

// Contador
const diasEl = document.getElementById("dias");
const horasEl = document.getElementById("horas");
const minutosEl = document.getElementById("minutos");
const segundosEl = document.getElementById("segundos");

// Modal REGALO (ya lo tenías)
const btnCopiarAlias = document.getElementById("btnCopiarAlias");
const aliasTexto = document.getElementById("aliasTexto");

/* =======================
   APERTURA INVITACIÓN
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

/* ✅ Evento: click/tecla en el sobre */
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
  btnCopiarAlias.addEventListener("click", async () => {
    const texto = aliasTexto.textContent.trim();

    try {
      await navigator.clipboard.writeText(texto);
      btnCopiarAlias.innerHTML = "✔ Alias copiado";

      setTimeout(() => {
        btnCopiarAlias.innerHTML =
          '<i class="bi bi-clipboard"></i> Copiar alias';
      }, 2000);
    } catch (e) {
      alert("No se pudo copiar automáticamente. Alias: " + texto);
    }
  });
}

/* =======================
   MODAL ENTRADA (ASISTENCIA + PAGO) - ARMÓNICO
   ✅ Sin botón "Confirmar" separado:
   - Confirmación = click en "Enviar comprobante"
======================= */

// IDs del modal de entrada (del HTML)
const btnAbrirEntrada = document.getElementById("btnAbrirEntrada");
const aliasEntradaEl = document.getElementById("aliasEntrada");
const btnCopiarEntrada = document.getElementById("btnCopiarEntrada");
const btnEnviarComprobante = document.getElementById("btnEnviarComprobante");

// Modal element
const modalEntrada = document.getElementById("modalEntrada");

// Arma el link de WhatsApp con mensaje automático
function linkWhatsAppConMensaje() {
  const alias = aliasEntradaEl ? aliasEntradaEl.textContent.trim() : "joni.lincina.dj";

  const mensaje =
    `Hola! 👋\n` +
    `Te envío el comprobante de la entrada para los 15 de Zoe.\n\n` +
    `✅ Transferí a alias: ${alias}\n` +
    `Adultos: $25.000 | Niños: $15.000\n\n` +
    `Adjunto comprobante.`;

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

// 1) Copiar alias de entrada
if (btnCopiarEntrada && aliasEntradaEl) {
  btnCopiarEntrada.addEventListener("click", async () => {
    const texto = aliasEntradaEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(texto);
      btnCopiarEntrada.innerHTML = "✔ Alias copiado";
      setTimeout(() => {
        btnCopiarEntrada.innerHTML =
          '<i class="bi bi-clipboard"></i> Copiar alias';
      }, 1800);
    } catch (e) {
      alert("No se pudo copiar automáticamente. Alias: " + texto);
    }
  });
}

// 2) Cuando abre la modal, setea el link con mensaje automático
if (modalEntrada) {
  modalEntrada.addEventListener("show.bs.modal", () => {
    if (btnEnviarComprobante) {
      btnEnviarComprobante.setAttribute("href", linkWhatsAppConMensaje());
    }
  });
}

// 3) ✅ Confirmación armónica: al tocar "Enviar comprobante"
//    - marca el botón de la card como Confirmado
//    - cierra la modal
if (btnEnviarComprobante && modalEntrada && btnAbrirEntrada) {
  btnEnviarComprobante.addEventListener("click", () => {
    // Cambia el botón de la card
    btnAbrirEntrada.innerHTML =
      '<i class="bi bi-check2-circle"></i> Confirmado';
    btnAbrirEntrada.classList.add("is-confirmed");

    // Cierra la modal
    const instance =
      bootstrap.Modal.getInstance(modalEntrada) ||
      new bootstrap.Modal(modalEntrada);
    instance.hide();
  });
}

/* =======================
   INICIALIZACIÓN
======================= */

actualizarContador();
setInterval(actualizarContador, 1000);