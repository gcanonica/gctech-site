(function () {
  "use strict";

  var measurementId = "G-071CJDZME7";
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
  }

  // O site é estático: injeta o carregador do GA4 para todas as rotas.
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    var loader = document.createElement("script");
    loader.async = true;
    loader.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(loader);
  }

  function locationName(link) {
    return link.getAttribute("aria-label") || link.textContent.trim().replace(/\s+/g, " ").slice(0, 80) || "link";
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    var link = target && target.closest ? target.closest("a") : null;
    if (!link) return;
    var label = locationName(link);
    var isWhatsApp = link.href.indexOf("wa.me/") !== -1 || link.href.indexOf("whatsapp.com/") !== -1;
    var isPhone = link.protocol === "tel:";

    if (isWhatsApp) {
      gtag("event", "click_whatsapp", { link_location: label });
      if (link.classList.contains("btn-whats") || link.classList.contains("lead-choice") || /orçamento|diagnóstico|falar|conversar|consertar|orçar/i.test(label)) {
        gtag("event", "request_quote", { link_location: label });
      }
    }
    if (isPhone) gtag("event", "click_phone", { link_location: label });
  });

  var serviceMatch = window.location.pathname.match(/^\/(cftv|redes-wifi|computadores|dispositivos|empresas|sites)(?:\/|$)/);
  if (serviceMatch) {
    gtag("event", "view_service", {
      service_path: window.location.pathname,
      service_name: serviceMatch[1]
    });
  }

  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    gtag("event", "view_home");
  }
})();
