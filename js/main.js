/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */

// ✅ Fecha real del evento: 28/03/2026 21:30 (Argentina)
const FECHA_EVENTO = new Date("2026-03-28T21:30:00").getTime();

// Duraciones animaciones (ms)
const TIEMPO_APERTURA_SOBRE = 600;
const TIEMPO_MOSTRAR_CONTENIDO = 1200;

// ✅ WhatsApp real
const WHATSAPP_NUMERO = "xxxxxxxx";

// ✅ Apps Script (Fotos)
const DRIVE_UPLOAD_SCRIPT_URL =
  "https://script.google.com";

// ✅ Apps Script (Playlist → Sheet)
const PLAYLIST_SCRIPT_URL =
  "https://script.google.com";

/* =========================================================
   HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const safeSetText = (el, text) => {
  if (!el) return;
  el.textContent = text;
};

const safeSetHTML = (el, html) => {
  if (!el) return;
  el.innerHTML = html;
};

const openInNewTab = (url) => window.open(url, "_blank", "noopener");

// ✅ Fix: limpiar backdrop si Bootstrap no lo hace (pantalla oscura)
function limpiarBackdropModal() {
  document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
  document.body.classList.remove("modal-open");
  document.body.style.removeProperty("padding-right");
  document.body.style.removeProperty("overflow");
}

// ✅ cerrar modal de forma segura + limpiar backdrop
function cerrarModalSeguro(modalEl) {
  if (!modalEl) return;

  const instance =
    bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);

  modalEl.addEventListener(
    "hidden.bs.modal",
    () => {
      limpiarBackdropModal();
    },
    { once: true }
  );

  instance.hide();
  setTimeout(limpiarBackdropModal, 650);
}

/* =========================================================
   ✅ PROGRESO (barras)
   - con no-cors NO hay % real, pero hacemos progreso por pasos
========================================================= */

function setProgress(barEl, percent) {
  if (!barEl) return;
  const p = Math.max(0, Math.min(100, percent));
  barEl.style.width = `${p}%`;
}

function resetProgress(barEl) {
  setProgress(barEl, 0);
}

/* =========================================================
   ELEMENTOS DOM
========================================================= */

// Portada / contenido
const cover = $("cover");
const contenido = $("contenido");

// Música
const musica = $("musica");

// Sobre clickeable
const envelope = document.querySelector(".envelope");
const envelopeOpen = $("envelopeOpen");

// Contador
const diasEl = $("dias");
const horasEl = $("horas");
const minutosEl = $("minutos");
const segundosEl = $("segundos");

// Modal REGALO
const btnCopiarAlias = $("btnCopiarAlias");
const aliasTexto = $("aliasTexto");

// Botón menú (WhatsApp)
const btnMenuWhatsApp = $("btnMenuWhatsApp");

// Galería: subir fotos
const btnSubirFotos = $("btnSubirFotos");
const inputFotos = $("inputFotos");
const uploadStatus = $("uploadStatus");
// ✅ barra progreso fotos (agregar en HTML: #uploadProgressBar)
const uploadProgressBar = $("uploadProgressBar");

// Modal ENTRADA (asistencia + pago)
const btnAbrirEntrada = $("btnAbrirEntrada");
const aliasEntradaEl = $("aliasEntrada");
const btnCopiarEntrada = $("btnCopiarEntrada");
const btnEnviarComprobante = $("btnEnviarComprobante");
const modalEntrada = $("modalEntrada");

// Modal PLAYLIST
const modalPlaylistEl = $("modalPlaylist");
const formPlaylist = $("formPlaylist");
const plNombre = $("plNombre");
const plCancion = $("plCancion");
const plArtista = $("plArtista");
const plComentario = $("plComentario");
const btnEnviarPlaylist = $("btnEnviarPlaylist");
const playlistStatus = $("playlistStatus");
// ✅ barra progreso playlist (agregar en HTML: #playlistProgressBar)
const playlistProgressBar = $("playlistProgressBar");

/* =========================================================
   APERTURA INVITACIÓN
========================================================= */

let yaAbrio = false;

function abrirInvitacion() {
  if (yaAbrio) return;
  yaAbrio = true;

  // 1) abrir sobre
  if (envelope) envelope.classList.add("open");

  // 2) música
  if (musica) {
    musica.volume = 0.5;
    musica.play().catch(() => {});
  }

  // 3) esconder portada
  setTimeout(() => {
    if (cover) cover.classList.add("is-hidden");
  }, TIEMPO_APERTURA_SOBRE);

  // 4) mostrar contenido
  setTimeout(() => {
    if (cover) cover.style.display = "none";
    if (contenido) {
      contenido.classList.remove("d-none");
      contenido.classList.add("fade-in");
    }
  }, TIEMPO_MOSTRAR_CONTENIDO);
}

if (envelopeOpen) {
  envelopeOpen.addEventListener("click", abrirInvitacion);

  envelopeOpen.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirInvitacion();
    }
  });
}

/* =========================================================
   CONTADOR REGRESIVO
========================================================= */

function setContador(d, h, m, s) {
  safeSetText(diasEl, String(d).padStart(2, "0"));
  safeSetText(horasEl, String(h).padStart(2, "0"));
  safeSetText(minutosEl, String(m).padStart(2, "0"));
  safeSetText(segundosEl, String(s).padStart(2, "0"));
}

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

/* =========================================================
   COPIAR ALIAS (REGALO)
========================================================= */

if (btnCopiarAlias && aliasTexto) {
  btnCopiarAlias.addEventListener("click", async () => {
    const texto = aliasTexto.textContent.trim();

    try {
      await navigator.clipboard.writeText(texto);
      safeSetHTML(btnCopiarAlias, "✔ Alias copiado");
      setTimeout(() => {
        safeSetHTML(btnCopiarAlias, '<i class="bi bi-clipboard"></i> Copiar alias');
      }, 2000);
    } catch {
      alert("No se pudo copiar automáticamente. Alias: " + texto);
    }
  });
}

/* =========================================================
   MENÚ → WhatsApp (Completar menú)
========================================================= */

function linkWhatsAppMenu() {
  const mensaje =
    `Hola 👋\n\n` +
    `Te comparto mi información para el menú del cumple de 15 de Zoe 💛\n\n` +
    `Nombre:\n` +
    `Voy con:\n` +
    `Restricción alimentaria:\n`;

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

if (btnMenuWhatsApp) {
  btnMenuWhatsApp.setAttribute("href", linkWhatsAppMenu());
}

/* =========================================================
   SUBIR FOTOS A DRIVE (GALERÍA) + PROGRESO
========================================================= */

function setUploadStatus(msg) {
  safeSetText(uploadStatus, msg);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result); // dataURL base64
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function subirFotosADrive(files) {
  try {
    if (!files || !files.length) return;

    const MAX_MB = 8;

    for (const f of files) {
      const mb = f.size / (1024 * 1024);
      if (mb > MAX_MB) {
        setUploadStatus(`⚠️ "${f.name}" pesa ${mb.toFixed(1)}MB. Subí fotos de hasta ${MAX_MB}MB.`);
        resetProgress(uploadProgressBar);
        return;
      }
    }

    // UX inicio
    resetProgress(uploadProgressBar);
    setUploadStatus(`⏳ Preparando ${files.length} foto(s)…`);
    setProgress(uploadProgressBar, 10);

    // ✅ más estable: subir 1 por 1 (evita fallos por payload grande)
    let subidas = 0;

    for (const f of files) {
      const current = subidas + 1;
      setUploadStatus(`⏳ Subiendo ${current}/${files.length}…`);

      // Paso pesado: base64
      const dataBase64 = await fileToBase64(f);

      // Progreso por pasos (aprox)
      const base = 10;
      const range = 80; // 10% a 90%
      const percent = base + Math.round((subidas / files.length) * range);
      setProgress(uploadProgressBar, percent);

      await fetch(DRIVE_UPLOAD_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: [{
            name: `${Date.now()}-${f.name}`.replace(/\s+/g, "-"),
            type: f.type,
            dataBase64,
          }],
        }),
      });

      subidas++;
      const percentAfter = base + Math.round((subidas / files.length) * range);
      setProgress(uploadProgressBar, percentAfter);
    }

    setProgress(uploadProgressBar, 100);
    setUploadStatus(`✅ ¡Listo! Se enviaron ${subidas} foto(s). Gracias 💛`);

    // opcional: reset suave
    setTimeout(() => resetProgress(uploadProgressBar), 2500);
  } catch (err) {
    console.error(err);
    setUploadStatus("❌ Error al subir. Probá otra vez.");
    resetProgress(uploadProgressBar);
  }
}

if (btnSubirFotos && inputFotos) {
  btnSubirFotos.addEventListener("click", () => inputFotos.click());

  inputFotos.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files || []);
    await subirFotosADrive(files);
    inputFotos.value = "";
  });
}

/* =========================================================
   MODAL ENTRADA (ASISTENCIA + PAGO)
========================================================= */

function linkWhatsAppConMensajeEntrada() {
  const alias = aliasEntradaEl ? aliasEntradaEl.textContent.trim() : "joni.lincina.dj";

  const mensaje =
    `Hola! 👋\n` +
    `Te envío el comprobante de la entrada del cumple de 15 de Zoe.\n\n` +
    `✅ Transferencia realizada a:\n` +
    `Alias: ${alias}\n\n` +
    `💛 Muchas gracias.\n` +
    `Adjunto el comprobante.`;

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

if (btnCopiarEntrada && aliasEntradaEl) {
  btnCopiarEntrada.addEventListener("click", async () => {
    const texto = aliasEntradaEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(texto);
      safeSetHTML(btnCopiarEntrada, "✔ Alias copiado");
      setTimeout(() => {
        safeSetHTML(btnCopiarEntrada, '<i class="bi bi-clipboard"></i> Copiar alias');
      }, 1800);
    } catch {
      alert("No se pudo copiar automáticamente. Alias: " + texto);
    }
  });
}

if (modalEntrada) {
  modalEntrada.addEventListener("show.bs.modal", () => {
    if (btnEnviarComprobante) {
      btnEnviarComprobante.setAttribute("href", linkWhatsAppConMensajeEntrada());
    }
  });
}

if (btnEnviarComprobante && modalEntrada && btnAbrirEntrada) {
  btnEnviarComprobante.addEventListener("click", (e) => {
    e.preventDefault();

    const waLink =
      btnEnviarComprobante.getAttribute("href") || linkWhatsAppConMensajeEntrada();

    safeSetHTML(btnAbrirEntrada, '<i class="bi bi-check2-circle"></i> Confirmado');
    btnAbrirEntrada.classList.add("is-confirmed");

    cerrarModalSeguro(modalEntrada);
    openInNewTab(waLink);
  });
}

/* =========================================================
   PLAYLIST → Google Sheet (modal) + PROGRESO
   - evita recargar / subir al inicio
   - cierra modal bien y limpia backdrop
========================================================= */

function setPlaylistStatus(msg) {
  safeSetText(playlistStatus, msg);
}

if (modalPlaylistEl) {
  modalPlaylistEl.addEventListener("show.bs.modal", () => {
    setPlaylistStatus("");
    resetProgress(playlistProgressBar);

    if (formPlaylist) formPlaylist.reset();
    if (btnEnviarPlaylist) {
      btnEnviarPlaylist.disabled = false;
      btnEnviarPlaylist.textContent = "Enviar";
    }
  });
}

if (formPlaylist) {
  formPlaylist.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nombre = (plNombre?.value || "").trim();
    const cancion = (plCancion?.value || "").trim();
    const artista = (plArtista?.value || "").trim();
    const comentario = (plComentario?.value || "").trim();

    if (!nombre || !cancion) {
      setPlaylistStatus("⚠️ Completá tu nombre y la canción.");
      resetProgress(playlistProgressBar);
      return;
    }

    try {
      resetProgress(playlistProgressBar);
      setProgress(playlistProgressBar, 20);
      setPlaylistStatus("⏳ Validando…");

      if (btnEnviarPlaylist) {
        btnEnviarPlaylist.disabled = true;
        btnEnviarPlaylist.textContent = "Enviando…";
      }

      setProgress(playlistProgressBar, 55);
      setPlaylistStatus("⏳ Enviando…");

      await fetch(PLAYLIST_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          cancion,
          artista,
          comentario,
          page: location.href,
        }),
      });

      setProgress(playlistProgressBar, 100);
      setPlaylistStatus("✅ ¡Listo! Canción enviada 💛");
      formPlaylist.reset();

      setTimeout(() => {
        cerrarModalSeguro(modalPlaylistEl);
        setTimeout(() => {
          setPlaylistStatus("");
          resetProgress(playlistProgressBar);
        }, 700);
      }, 700);
    } catch (err) {
      console.error(err);
      setPlaylistStatus("❌ Error al enviar. Probá otra vez.");
      resetProgress(playlistProgressBar);
    } finally {
      if (btnEnviarPlaylist) {
        btnEnviarPlaylist.disabled = false;
        btnEnviarPlaylist.textContent = "Enviar";
      }
    }
  });
}

/* =========================================================
   INICIALIZACIÓN
========================================================= */

actualizarContador();
setInterval(actualizarContador, 1000);