/* =========================
   CONFIG (EDITA QUI)
   ========================= */
const CONFIG = {
  // SOLO numeri, senza +, spazi o trattini. Esempio: 393331234567
  WHATSAPP_NUMBER: "39XXXXXXXXXX",

  // tel: con + (apre tastiera con numero precompilato)
  PHONE_NUMBER_TEL: "+39XXXXXXXXXX",

  EMAIL: "info@frasheri.it"
};

function buildWhatsAppLink(message) {
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

  // Phone: bottom bar + call button
  setLink(document.getElementById("bottomPhone"), phoneHref);
  setLink(document.getElementById("callBtn"), phoneHref);

  // WhatsApp: hero + bottom bar
  const waHref = buildWhatsAppLink(defaultMessage());
  setLink(document.getElementById("heroWhatsApp"), waHref);
  setLink(document.getElementById("bottomWhatsApp"), waHref);
}

function sanitize(value) {
  return (value || "").toString().trim();
}

function formatDate(isoDate) {
  return isoDate || "";
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

  if (nome) lines.unshift(`Ciao, sono ${nome}.`);
  return lines.join("\n");
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
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
   TOOLTIP INFO (WhatsApp)
   ========================= */
function wireWhatsAppInfo() {
  const btn = document.getElementById("waInfoBtn");
  const tip = document.getElementById("waInfo");
  if (!btn || !tip) return;

  const toggle = () => {
    const isOpen = !tip.hidden;
    tip.hidden = isOpen;
    btn.setAttribute("aria-expanded", String(!isOpen));
  };

  btn.addEventListener("click", toggle);

  // Chiudi cliccando fuori
  document.addEventListener("click", (e) => {
    if (tip.hidden) return;
    const target = e.target;
    if (!tip.contains(target) && target !== btn) {
      tip.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
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
      hint.textContent = "Configura il numero WhatsApp in assets/js/main.js (CONFIG.WHATSAPP_NUMBER).";
      hint.style.color = "#b00020";
      return;
    }

    const data = new FormData(form);
    const message = buildFormMessage(data);
    const link = buildWhatsAppLink(message);

    window.open(link, "_blank", "noopener,noreferrer");
  });

  copyBtn?.addEventListener("click", async () => {
    const data = new FormData(form);
    const message = buildFormMessage(data);
    const ok = await copyToClipboard(message);

    hint.textContent = ok
      ? "Testo copiato! Ora puoi incollarlo su WhatsApp."
      : "Non riesco a copiare automaticamente: seleziona e copia manualmente.";
    hint.style.color = ok ? "" : "#b00020";
  });
}

/* =========================
   INIT
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  wireMobileMenu();
  wireWhatsAppInfo();
  wireQuickLinks();
  wireQuoteForm();
});
