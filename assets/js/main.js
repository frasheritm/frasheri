const CONFIG = {
  // SOLO numeri, senza +, spazi o trattini. Es: 393331234567
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
  setLink(document.getElementById("bottomPhone"), phoneHref);

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

  const lines = [];

  if (nome) lines.push(`Ciao, sono ${nome}.`);
  lines.push("Vorrei un preventivo:");
  lines.push("");
  lines.push(`• Servizio: ${servizio || "-"}`);
  lines.push(`• Zona ritiro: ${zona || "-"}`);
  lines.push(`• Destinazione: ${destinazione || "-"}`);
  lines.push(`• Data: ${data || "-"}`);
  lines.push(`• Telefono: ${telefono || "-"}`);
  lines.push(`• Dettagli: ${descrizione || "-"}`);
  lines.push("");
  lines.push("Posso allegare foto in chat.");

  return lines.join("\n");
}

function wireMobileMenu() {
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("closeMenu");
  const overlay = document.getElementById("drawerOverlay");

  if (!burger || !drawer) return;

  const open = () => {
    drawer.hidden = false;
    drawer.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  };

  const close = () => {
    drawer.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");

    // aspetta la fine dell'animazione
    window.setTimeout(() => {
      drawer.hidden = true;
    }, 230);
  };

  burger.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);

  drawer.querySelectorAll("a[href^='#']").forEach(a => {
    a.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !drawer.hidden) close();
  });
}


/* POPUP INFO WhatsApp */
function wireWhatsAppModal() {
  const openBtn = document.getElementById("waInfoBtn");
  const modal = document.getElementById("waModal");
  const close1 = document.getElementById("waModalClose1");
  const close2 = document.getElementById("waModalClose2");

  if (!openBtn || !modal) return;

  const open = () => {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", open);
  close1?.addEventListener("click", close);
  close2?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
}

/* FORM -> WhatsApp + Email */
function wireQuoteForm() {
  const form = document.getElementById("quoteForm");
  const hint = document.getElementById("hint");
  const emailBtn = document.getElementById("emailBtn");

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

  emailBtn?.addEventListener("click", () => {
    const data = new FormData(form);
    const message = buildFormMessage(data);

    const subject = "Richiesta preventivo - Frasheri";
    const mailto = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    window.location.href = mailto;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  wireMobileMenu();
  wireWhatsAppModal();
  wireQuickLinks();
  wireQuoteForm();
});
