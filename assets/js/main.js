/* =========================
   CONFIG (EDITA QUI)
   ========================= */
const CONFIG = {
  // Inserisci SOLO numeri, senza +, spazi o trattini.
  // Esempio Italia: 393331234567
  WHATSAPP_NUMBER: "39XXXXXXXXXX",

  // Per tel: usa formato internazionale con +
  PHONE_NUMBER_TEL: "+39XXXXXXXXXX",

  EMAIL: "info@frasheri.it"
};

function buildWhatsAppLink(message) {
  // Formato ufficiale: https://wa.me/<number>?text=<encoded>
  const base = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}`;
  const text = encodeURIComponent(message);
  return `${base}?text=${text}`;
}

function defaultMessage() {
  return [
    "Ciao! Vorrei un preventivo.",
    "Servizio: ",
    "Zona ritiro: ",
    "Destinazione: ",
    "Data: ",
    "Oggetti/mobili: ",
    "",
    "Posso allegare foto in chat."
  ].join("\n");
}

function setLink(el, href) {
  if (!el) return;
  el.setAttribute("href", href);
}

function wireQuickLinks() {
  const phoneHref = `tel:${CONFIG.PHONE_NUMBER_TEL}`;

  // Phone
  setLink(document.getElementById("headerPhone"), phoneHref);
  setLink(document.getElementById("menuPhone"), phoneHref);
  setLink(document.getElementById("sidePhone"), phoneHref);
  setLink(document.getElementById("bottomPhone"), phoneHref);
  setLink(document.getElementById("callBtn"), phoneHref);

  // WhatsApp (messaggio base)
  const waHref = buildWhatsAppLink(defaultMessage());

  setLink(document.getElementById("headerWhatsApp"), waHref);
  setLink(document.getElementById("menuWhatsApp"), waHref);
  setLink(document.getElementById("sideWhatsApp"), waHref);
  setLink(document.getElementById("bottomWhatsApp"), waHref);
  setLink(document.getElementById("heroWhatsApp"), waHref);
}

function sanitize(value) {
  return (value || "").toString().trim();
}

function formatDate(isoDate) {
  if (!isoDate) return "";
  // Manteniamo semplice: YYYY-MM-DD
  return isoDate;
}

function buildFormMessage(formData) {
  const nome = sanitize(formData.get("nome"));
  const servizio = sanitize(formData.get("servizio"));
  const zona = sanitize(formData.get("zona"));
  const destinazione = sanitize(formData.get("destinazione"));
  const data = formatDate(sanitize(formData.get("data")));
  const telefono = sanitize(formData.get("telefono"));
  const descrizione = sanitize(formData.get("descrizione"));

  const lines = [
    "Ciao! Vorrei un preventivo.",
    servizio ? `Servizio: ${servizio}` : "Servizio: ",
    zona ? `Zona ritiro: ${zona}` : "Zona ritiro: ",
    destinazione ? `Destinazione: ${destinazione}` : "Destinazione: ",
    data ? `Data: ${data}` : "Data: ",
    telefono ? `Telefono: ${telefono}` : "Telefono: ",
    descrizione ? `Dettagli: ${descrizione}` : "Dettagli: ",
    "",
    "Posso allegare foto in chat."
  ];

  // Se nome esiste, mettiamo un saluto più umano
  if (nome) lines.unshift(`Ciao, sono ${nome}.`);

  return lines.join("\n");
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

/* =========================
   MENU MOBILE
   ========================= */
function wireMobileMenu() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("closeMenu");
  const backdrop = document.getElementById("backdrop");

  if (!burger || !menu) return;

  const open = () => {
    menu.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  // Chiudi menu quando clicchi un link
  menu.querySelectorAll("a[href^='#']").forEach(a => {
    a.addEventListener("click", () => close());
  });

  // ESC per chiudere
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) close();
  });
}

/* =========================
   FORM -> WHATSAPP
   ========================= */
function wireQuoteForm() {
  const form = document.getElementById("quoteForm");
  const copyBtn = document.getElementById("copyBtn");
  const hint = document.getElementById("hint");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!CONFIG.WHATSAPP_NUMBER || CONFIG.WHATSAPP_NUMBER.includes("X")) {
      hint.textContent = "Configura il numero WhatsApp in main.js (CONFIG.WHATSAPP_NUMBER).";
      hint.style.color = "#b00020";
      return;
    }

    const data = new FormData(form);
    const message = buildFormMessage(data);
    const link = buildWhatsAppLink(message);

    // Apri WhatsApp
    window.open(link, "_blank", "noopener,noreferrer");
  });

  copyBtn?.addEventListener("click", async () => {
    const data = new FormData(form);
    const message = buildFormMessage(data);
    const ok = await copyToClipboard(message);

    if (ok) {
      hint.textContent = "Testo copiato! Ora puoi incollarlo su WhatsApp.";
      hint.style.color = "";
    } else {
      hint.textContent = "Non riesco a copiare automaticamente: seleziona e copia il testo manualmente.";
      hint.style.color = "#b00020";
    }
  });
}

/* =========================
   INIT
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  wireMobileMenu();

  // Link rapidi
  wireQuickLinks();

  // Form preventivo
  wireQuoteForm();
});
