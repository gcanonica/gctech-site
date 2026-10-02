(function () {
  "use strict";
  if (window.gcTechConsent) return;

  var key = "gc-tech-consent-v1";
  var maxAge = 180 * 24 * 60 * 60 * 1000;
  var measurementId = "G-071CJDZME7";
  var choice = readChoice();
  var previousFocus;

  function readChoice() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(key));
      if (saved && saved.version === 1 && typeof saved.analytics === "boolean" &&
          typeof saved.updatedAt === "number" && saved.updatedAt <= Date.now() &&
          Date.now() - saved.updatedAt < maxAge) return saved;
    } catch (_) { /* Sem armazenamento válido, não há consentimento. */ }
    return null;
  }

  function removeAnalyticsCookies() {
    // Remove apenas cookies conhecidos da medição, nunca cookies de sessão do cliente.
    document.cookie.split(";").forEach(function (part) {
      var name = part.trim().split("=")[0];
      if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_gcl_)/.test(name)) return;
      var paths = ["/"];
      var segments = window.location.pathname.split("/").filter(Boolean);
      while (segments.length) { paths.push("/" + segments.join("/"), "/" + segments.join("/") + "/"); segments.pop(); }
      var domains = ["", "; domain=" + window.location.hostname];
      if (window.location.hostname === "gctech.pro") domains.push("; domain=.gctech.pro");
      paths.forEach(function (path) {
        domains.forEach(function (domain) { document.cookie = name + "=; Max-Age=0; path=" + path + domain; });
      });
    });
  }

  function blockAnalytics() {
    window["ga-disable-" + measurementId] = true;
    removeAnalyticsCookies();
  }

  function announceChoice() {
    window.dispatchEvent(new CustomEvent("gc-tech-consent-change"));
  }

  window.gcTechConsent = {
    analyticsAllowed: function () { return !!(choice && choice.analytics); },
    open: function () {
      analyticsInput.checked = window.gcTechConsent.analyticsAllowed();
      previousFocus = document.activeElement;
      dialog.showModal();
    }
  };
  if (!window.gcTechConsent.analyticsAllowed()) blockAnalytics();

  var banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-labelledby", "gc-cookie-title");
  banner.innerHTML = '<div class="cookie-banner-copy"><h2 id="gc-cookie-title">Sua privacidade</h2>' +
    '<p>Usamos cookies de estatísticas para melhorar o site, se você permitir.</p>' +
    '<a href="/politica-de-privacidade/#cookies">Política de privacidade</a></div>' +
    '<div class="cookie-actions"><button type="button" data-consent="accept">Aceitar</button>' +
    '<button type="button" data-consent="reject">Rejeitar</button>' +
    '<button type="button" data-consent="configure">Preferências</button></div>';
  banner.hidden = !!choice;
  document.body.appendChild(banner);

  var dialog = document.createElement("dialog");
  dialog.className = "cookie-dialog";
  dialog.setAttribute("aria-labelledby", "gc-cookie-settings-title");
  dialog.innerHTML = '<h2 id="gc-cookie-settings-title">Preferências de cookies</h2>' +
    '<p>Você pode mudar sua escolha a qualquer momento. Ela será lembrada neste navegador por até 180 dias.</p>' +
    '<label class="cookie-option"><input type="checkbox" checked disabled> Necessários — guardam esta preferência; sempre ativos.</label>' +
    '<label class="cookie-option"><input id="gc-cookie-analytics" type="checkbox"> Estatísticas — Google Analytics: visitas, páginas e intenção de contato.</label>' +
    '<p>Publicidade: nenhum pixel Google Ads ou Meta está ativo. O consentimento de estatísticas não autoriza publicidade.</p>' +
    '<p><a href="/politica-de-privacidade/#cookies">Política de privacidade e cookies</a></p>' +
    '<p class="cookie-status" role="status"></p>' +
    '<div class="cookie-actions"><button type="button" data-consent="reject">Rejeitar não necessários</button>' +
    '<button type="button" data-consent="save">Salvar preferências</button>' +
    '<button type="button" data-consent="close">Fechar</button></div>';
  document.body.appendChild(dialog);
  var analyticsInput = dialog.querySelector("#gc-cookie-analytics");
  var status = dialog.querySelector(".cookie-status");
  dialog.addEventListener("close", function () { if (previousFocus && previousFocus.isConnected) previousFocus.focus(); });

  var settingsButton = document.createElement("button");
  settingsButton.type = "button";
  settingsButton.className = "cookie-settings";
  settingsButton.textContent = "Preferências de cookies";
  settingsButton.addEventListener("click", window.gcTechConsent.open);
  var footer = document.querySelector(".footer-bottom");
  (footer || document.body).appendChild(settingsButton);

  function saveChoice(analytics) {
    var wasAllowed = window.gcTechConsent.analyticsAllowed();
    choice = { version: 1, analytics: analytics, updatedAt: Date.now() };
    var persisted = false;
    try {
      window.localStorage.setItem(key, JSON.stringify(choice));
      persisted = JSON.parse(window.localStorage.getItem(key)).analytics === analytics;
    } catch (_) { /* A decisão nesta página continua válida; não fingir persistência. */ }
    if (!analytics) blockAnalytics();
    banner.hidden = true;
    analyticsInput.checked = analytics;
    announceChoice();
    if (!persisted) {
      status.textContent = "Sua escolha vale nesta página, mas o navegador não permitiu salvá-la. Para revogar uma escolha anterior também nas próximas visitas, apague os dados deste site no navegador.";
      if (!dialog.open) window.gcTechConsent.open();
      return;
    }
    status.textContent = "";
    dialog.close();
    // A tag já carregada não pode ser descarregada com segurança: recarregar sem ela.
    if (wasAllowed && !analytics && window.gcTechAnalyticsLoaded) window.location.reload();
  }

  function handleAction(event) {
    var button = event.target.closest("button[data-consent]");
    if (!button) return;
    var action = button.getAttribute("data-consent");
    if (action === "reject") saveChoice(false);
    if (action === "accept") saveChoice(true);
    if (action === "save") saveChoice(analyticsInput.checked);
    if (action === "configure") window.gcTechConsent.open();
    if (action === "close") dialog.close();
  }
  banner.addEventListener("click", handleAction);
  dialog.addEventListener("click", handleAction);
  window.addEventListener("storage", function (event) {
    if (event.key !== key && event.key !== null) return;
    var wasAllowed = window.gcTechConsent.analyticsAllowed();
    choice = readChoice();
    banner.hidden = !!choice;
    analyticsInput.checked = window.gcTechConsent.analyticsAllowed();
    if (!window.gcTechConsent.analyticsAllowed()) blockAnalytics();
    announceChoice();
    if (wasAllowed && !window.gcTechConsent.analyticsAllowed() && window.gcTechAnalyticsLoaded) window.location.reload();
  });
})();
