(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initServiceLead() {
    var path = window.location.pathname;
    var leads = {
      "/cftv/": { label: "Agendar avaliação de CFTV", message: "Olá! Vim pelo site da GC Tech e preciso de CFTV. Vou informar minha cidade, se é para casa ou empresa e os ambientes que quero monitorar." },
      "/redes-wifi/": { label: "Diagnosticar meu Wi-Fi", message: "Olá! Vim pelo site da GC Tech e preciso de ajuda com a rede ou Wi-Fi. Vou informar minha cidade e onde o sinal falha." },
      "/computadores/": { label: "Agendar diagnóstico", message: "Olá! Vim pelo site da GC Tech e preciso de diagnóstico de computador ou notebook. Vou informar minha cidade, modelo e o que aconteceu." },
      "/dispositivos/": { label: "Pedir orçamento de reparo", message: "Olá! Preciso de orçamento para reparar meu celular, tablet, videogame ou controle. Vou enviar o modelo e o problema." },
      "/empresas/": { label: "Agendar diagnóstico gratuito", message: "Olá! Vim pelo site da GC Tech e quero agendar um diagnóstico gratuito de TI para minha empresa. Vou informar a cidade, quantidade de equipamentos e principal problema." },
      "/sites/": { label: "Pedir proposta de site", message: "Olá! Vim pelo site da GC Tech e quero uma proposta de site. Vou informar o tipo de negócio, objetivo e prazo desejado." }
    };
    var key = Object.keys(leads).find(function (route) { return (path + "/").indexOf(route) === 0; });
    if (!key) return;

    var lead = leads[key];
    var href = "https://wa.me/5541995372084?text=" + encodeURIComponent(lead.message);
    document.querySelectorAll(".button-whatsapp, .btn-whats, .nav-cta, .whatsapp-float, .whats-float").forEach(function (link) {
      if (link.classList.contains("whatsapp-float") || link.classList.contains("whats-float")) {
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
    document.querySelectorAll("a.brand").forEach(function (link) {
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

    function updateMarqueeDistance() {
      var width = group.getBoundingClientRect().width;
      if (width > 0) track.style.setProperty("--gc-marquee-distance", width + "px");
    }

    updateMarqueeDistance();
    window.addEventListener("load", updateMarqueeDistance, { once: true });
    window.addEventListener("resize", updateMarqueeDistance, { passive: true });
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
