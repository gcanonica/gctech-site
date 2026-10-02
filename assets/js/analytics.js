(function () {
  "use strict";

  function consentGranted() { return !!(window.gcTechConsent && window.gcTechConsent.analyticsAllowed()); }
  function startAnalytics() {
  if (!consentGranted()) return;
  // Não coleta prévias, localhost ou domínios que não sejam a produção.
  if (window.location.protocol !== "https:" || window.location.hostname !== "gctech.pro" || window.gcTechAnalyticsLoaded) return;
  window.gcTechAnalyticsLoaded = true;

  var measurementId = "G-071CJDZME7";
  window["ga-disable-" + measurementId] = false;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  // Consent Mode básico: nenhuma tag/ping antes do aceite; publicidade permanece negada.
  window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  var pageUrl = new URL(window.location.origin + window.location.pathname);
  var incoming = new URL(window.location.href);
  // Catálogo controlado em docs/campaigns.csv: regex genérica também aceitaria nomes/telefones.
  var campaignValues = {
    utm_source: ["instagram", "facebook", "whatsapp", "google", "material_impresso"],
    utm_medium: ["social", "referral", "organic", "offline"],
    utm_content: ["bio", "post_servicos", "status", "indicacao", "site", "cartao", "cftv", "sites"]
  };
  Object.keys(campaignValues).forEach(function (name) {
    var value = incoming.searchParams.get(name);
    if (campaignValues[name].indexOf(value) !== -1) pageUrl.searchParams.set(name, value);
  });
  var campaign = incoming.searchParams.get("utm_campaign");
  if (campaign === "perfil_empresa" || /^gc_tech_20\d{2}(0[1-9]|1[0-2])$/.test(campaign)) pageUrl.searchParams.set("utm_campaign", campaign);
  window.gtag("js", new Date());
  var referrer = "";
  try { var referringUrl = new URL(document.referrer); referrer = referringUrl.origin; } catch (_) { /* Sem referenciador. */ }
  window.gtag("config", measurementId, { page_location: pageUrl.href, page_referrer: referrer, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 15552000 });

  // O site é estático: injeta o carregador do GA4 para todas as rotas.
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    var loader = document.createElement("script");
    loader.async = true;
    loader.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(loader);
  }

  function locationName(link) {
    if (link.closest(".whatsapp-float, .whats-float")) return "floating";
    if (link.closest("header, .header, .mobile-nav")) return "navigation";
    if (link.closest("footer")) return "footer";
    if (link.closest(".cta-band, .cta-box")) return "contact";
    if (link.closest(".hero, .service-hero, .page-hero")) return "hero";
    return "content";
  }

  document.addEventListener("click", function (event) {
    if (!consentGranted() || window["ga-disable-" + measurementId]) return;
    var target = event.target;
    var link = target && target.closest ? target.closest("a") : null;
    if (!link) return;
    var destination;
    try { destination = new URL(link.href); } catch (_) { return; }
    var isWhatsApp = destination.protocol === "https:" && (
      (destination.hostname === "wa.me" && destination.pathname === "/5541995372084") ||
      (["api.whatsapp.com", "web.whatsapp.com", "whatsapp.com"].indexOf(destination.hostname) !== -1 && destination.searchParams.get("phone") === "5541995372084")
    );
    var isPhone = destination.protocol === "tel:" && destination.pathname === "+5541995372084";
    var parameters = { link_location: locationName(link), service_name: serviceMatch ? serviceMatch[1] : "general" };

    if (isWhatsApp) {
      window.gtag("event", "click_whatsapp", parameters);
    }
    if (isPhone) window.gtag("event", "phone_click", parameters);
  });

  var serviceMatch = window.location.pathname.match(/^\/(cftv|redes-wifi|computadores|dispositivos|empresas|sites)(?:\/|$)/);
  if (serviceMatch) {
    window.gtag("event", "service_page_view", {
      service_path: window.location.pathname,
      service_name: serviceMatch[1]
    });
  }

  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    window.gtag("event", "view_home");
  }
  }
  window.addEventListener("gc-tech-consent-change", startAnalytics);
  startAnalytics();
})();
