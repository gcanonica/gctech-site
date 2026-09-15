(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initHeroVariant() {
    var path = window.location.pathname;
    var isPreviewVariant = path.indexOf("/variantes/") !== -1;
    var variant = path.indexOf("/variantes/resumo/") !== -1 ? "summary" : path.indexOf("/variantes/expansao/") !== -1 || document.body.hasAttribute("data-panel-expand") ? "expand" : "";
    if (!variant) return;

    document.body.classList.add("variant-" + variant);
    var product = document.querySelector(".hero-product");
    if (!product) return;

    if (isPreviewVariant) {
      var notice = document.createElement("p");
      notice.className = "variant-notice";
      notice.textContent = variant === "summary" ? "Variante A · painel resumido" : "Variante B · painel expansível";
      notice.setAttribute("aria-label", notice.textContent);
      document.querySelector(".hero .shell").appendChild(notice);
    }

    if (variant !== "expand") return;

    var toolbar = product.querySelector(".product-toolbar");
    if (!toolbar) return;
    var button = document.createElement("button");
    button.className = "panel-toggle";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Expandir painel";
    toolbar.appendChild(button);
    button.addEventListener("click", function () {
      var open = product.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "Recolher painel" : "Expandir painel";
    });
  }

  function initServiceLead() {
    var path = window.location.pathname;
    var leads = {
      "/cftv/": { label: "Agendar avaliação de CFTV", message: "Olá! Quero agendar uma avaliação de CFTV. É para uma casa ou empresa e quantos ambientes preciso monitorar?" },
      "/redes-wifi/": { label: "Diagnosticar meu Wi-Fi", message: "Olá! Meu Wi-Fi está com problemas. Em quais ambientes o sinal falha e quantos pontos preciso conectar?" },
      "/computadores/": { label: "Agendar diagnóstico", message: "Olá! Meu computador ou notebook precisa de diagnóstico. Qual é o modelo e o que aconteceu?" },
      "/dispositivos/": { label: "Pedir orçamento de reparo", message: "Olá! Preciso de orçamento para reparar meu celular, tablet, videogame ou controle. Vou enviar o modelo e o problema." },
      "/empresas/": { label: "Agendar diagnóstico gratuito", message: "Olá! Quero agendar um diagnóstico gratuito de TI. Quantas pessoas e equipamentos a empresa possui e qual é o principal problema hoje?" },
      "/sites/": { label: "Pedir proposta de site", message: "Olá! Quero pedir uma proposta de site. Qual é o meu negócio, objetivo e prazo para colocar no ar?" }
    };
    var key = Object.keys(leads).find(function (route) { return path.indexOf(route) !== -1; });
    if (!key) return;

    var lead = leads[key];
    var href = "https://wa.me/5541995372084?text=" + encodeURIComponent(lead.message);
    document.querySelectorAll(".service-hero .button-whatsapp, .cta-band .button-whatsapp, .nav-cta, .whatsapp-float").forEach(function (link) {
      if (link.classList.contains("whatsapp-float")) {
        link.setAttribute("aria-label", lead.label);
        link.setAttribute("title", lead.label);
      } else {
        link.textContent = lead.label;
      }
      link.setAttribute("href", href);
    });
  }

  function normalizeInternalHomeLinks() {
    var homeHref = "/";
    document.querySelectorAll("a.brand, .footer-bottom a").forEach(function (link) {
      link.setAttribute("href", homeHref);
    });
    document.querySelectorAll('a[href*="?v=2026091418"]').forEach(function (link) {
      var label = link.textContent.trim().toLowerCase();
      link.setAttribute("href", link.closest("nav") && /serviços|servicos/.test(label) ? "/#servicos" : homeHref);
    });
    document.querySelectorAll("nav a").forEach(function (link) {
      var label = link.textContent.trim().toLowerCase();
      if (/^serviços$|^servicos$|todos os serviços|todos os servicos/.test(label)) {
        link.setAttribute("href", "/#servicos");
      }
    });
  }

  function initLeadChoices() {
    document.querySelectorAll("[data-lead-message]").forEach(function (link) {
      var message = link.getAttribute("data-lead-message");
      if (!message) return;
      link.setAttribute("href", "https://wa.me/5541995372084?text=" + encodeURIComponent(message));
      if (!link.getAttribute("aria-label")) link.setAttribute("aria-label", link.textContent.trim());
    });
  }

  function initMarquee() {
    var track = document.querySelector(".marquee-track");
    var group = track && track.querySelector(".marquee-group");
    if (!track || !group || reduceMotion) return;

    if (!track.querySelector(".marquee-group + .marquee-group")) {
      var clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }
  }

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.textContent = willOpen ? "Fechar" : "Menu";
      menu.classList.toggle("is-open", willOpen);
      document.body.classList.toggle("menu-open", willOpen);
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  initHeroVariant();
  initServiceLead();
  normalizeInternalHomeLinks();
  initLeadChoices();
  initMarquee();

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  var revealTargets = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (node) {
      node.classList.add("reveal");
      observer.observe(node);
    });
  }
}());
