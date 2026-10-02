// Teste sem dependências e sem enviar eventos ao Google: node qa/check-growth.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/analytics.js'), 'utf8');

function analytics(url, referrer = '', allowed = true) {
  const listeners = {}, scripts = [], windowListeners = {};
  const window = { location: new URL(url), addEventListener: (type, callback) => { windowListeners[type] = callback; } };
  if (allowed !== null) window.gcTechConsent = { analyticsAllowed: () => allowed };
  const document = {
    referrer,
    querySelector: () => null,
    createElement: () => ({}),
    head: { appendChild: item => scripts.push(item) },
    addEventListener: (type, callback) => { listeners[type] = callback; }
  };
  const context = vm.createContext({ window, document, URL, Date });
  vm.runInContext(source, context);
  return { window, scripts, listeners, context, setConsent(value) { allowed = value; windowListeners['gc-tech-consent-change'](); } };
}
function click(state, href, placement = '.hero') {
  const link = { href, closest: selector => selector.split(', ').includes(placement) ? {} : null };
  if (state.listeners.click) state.listeners.click({ target: { closest: () => link } });
}
function events(state) {
  return (state.window.dataLayer || []).map(item => Array.from(item)).filter(item => item[0] === 'event');
}
function configuration(state) { return state.window.dataLayer.map(item => Array.from(item)).find(item => item[0] === 'config'); }
for (const allowed of [false, null]) {
  const state = analytics('https://gctech.pro/', '', allowed);
  assert.equal(state.scripts.length, 0);
  assert.equal(state.window.dataLayer, undefined, 'sem consentimento: nem ping sem cookies');
}
const pending = analytics('https://gctech.pro/', '', false);
click(pending, 'https://wa.me/5541995372084');
pending.setConsent(true);
assert.equal(pending.scripts.length, 1);
assert.equal(events(pending).length, 1, 'não reproduzir clique anterior ao aceite');
pending.setConsent(true);
assert.equal(pending.scripts.length, 1, 'aceite repetido não duplica a tag');
pending.setConsent(false);
click(pending, 'https://wa.me/5541995372084');
assert.equal(events(pending).length, 1, 'revogação bloqueia novos eventos');
for (const url of ['http://127.0.0.1:8771/', 'http://localhost/', 'https://gcanonica.github.io/gctech-site/', 'http://gctech.pro/', 'https://gctech.pro.evil.test/', 'file:///tmp/index.html']) {
  const state = analytics(url);
  assert.equal(state.scripts.length, 0, url);
  assert.equal(state.window.dataLayer, undefined, url);
}
const home = analytics('https://gctech.pro/?utm_source=facebook&utm_medium=social&utm_campaign=gc_tech_202610&utm_content=post&email=private@example.com#private');
assert.equal(home.scripts.length, 1);
assert.equal(events(home)[0][1], 'view_home');
const config = configuration(home);
const consent = home.window.dataLayer.map(item => Array.from(item)).filter(item => item[0] === 'consent');
assert.equal(consent[0][1], 'default');
assert(Object.values(consent[0][2]).every(value => value === 'denied'));
assert.equal(consent[1][1], 'update');
assert.equal(consent[1][2].analytics_storage, 'granted');
for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(consent[1][2][key], 'denied');
assert.equal(config[2].allow_google_signals, false);
assert.equal(config[2].allow_ad_personalization_signals, false);
assert.equal(config[2].cookie_expires, 15552000);
assert.equal(config[0], 'config');
assert.equal(config[1], 'G-071CJDZME7');
assert.equal(config[2].page_location, 'https://gctech.pro/?utm_source=facebook&utm_medium=social&utm_campaign=gc_tech_202610');
assert(!JSON.stringify(home.window.dataLayer).includes('private'));
const unsafe = analytics('https://gctech.pro/?utm_source=joao&utm_medium=41995372084&utm_campaign=ana&utm_content=joao&utm_term=41995372084&utm_id=41995372084&gclid=private');
assert.equal(configuration(unsafe)[2].page_location, 'https://gctech.pro/');
const referring = analytics('https://gctech.pro/', 'https://referrer.example/cliente/joao.silva%40example.com?phone=41995372084');
assert.equal(configuration(referring)[2].page_referrer, 'https://referrer.example');
click(home, 'https://wa.me/5541995372084?text=private', '.hero');
assert.equal(events(home).filter(item => item[1] === 'click_whatsapp').length, 1);
assert.equal(events(home).at(-1)[2].link_location, 'hero');
assert(!JSON.stringify(events(home)).includes('private'));
click(home, 'https://wa.me.evil.test/5541995372084');
click(home, 'https://evil.test/?redirect=https://wa.me/5541995372084');
click(home, 'https://wa.me/5500000000000');
click(home, 'not a URL');
assert.equal(events(home).filter(item => item[1] === 'click_whatsapp').length, 1);
click(home, 'tel:+5541995372084', 'footer');
assert.equal(events(home).at(-1)[1], 'phone_click');
const count = home.window.dataLayer.length;
vm.runInContext(source, home.context);
assert.equal(home.window.dataLayer.length, count, 'carregamento duplicado');
assert.equal(home.scripts.length, 1);
for (const route of ['cftv', 'redes-wifi', 'computadores', 'dispositivos', 'empresas/suporte-ti', 'sites/criacao-de-sites', 'sites/sites-sob-medida']) {
  const state = analytics('https://gctech.pro/' + route + '/');
  assert.equal(events(state)[0][1], 'service_page_view');
  click(state, 'https://api.whatsapp.com/send?phone=5541995372084', '.whats-float');
  assert.equal(events(state).at(-1)[2].link_location, 'floating');
  assert.equal(events(state).at(-1)[2].service_name, route.split('/')[0]);
  assert(!events(state).some(item => ['request_quote', 'generate_lead', 'purchase', 'whatsapp_click'].includes(item[1])));
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(item => item[1]);
assert.equal(urls.length, 17);
assert.equal(new Set(urls).size, 17);
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const file = path.join(root, pathname, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, pathname);
  assert(html.includes('href="' + url + '"'), 'canonical: ' + pathname);
  assert(!/<meta[^>]*name="robots"[^>]*noindex/i.test(html), pathname);
  assert(!html.includes('googletagmanager.com/gtag/js'), 'carregador inline: ' + pathname);
  assert(!/\bgtag\s*\(/.test(html), 'config inline: ' + pathname);
  assert.equal((html.match(/src="[^"]*assets\/js\/analytics\.js[^"]*"/g) || []).length, 1, pathname);
  assert.equal((html.match(/src="[^"]*assets\/js\/consent\.js[^"]*"/g) || []).length, 1, pathname);
  assert(html.indexOf('assets/js/consent.js') < html.indexOf('assets/js/analytics.js'), 'ordem do consentimento: ' + pathname);
  for (const script of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(script[1]);
  for (const item of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(item[1])) continue;
    const targetUrl = new URL(item[1], url);
    let target = path.join(root, decodeURIComponent(targetUrl.pathname));
    if (targetUrl.pathname.endsWith('/')) target = path.join(target, 'index.html');
    assert(fs.existsSync(target), pathname + ' -> ' + item[1]);
  }
  if (['/rio-branco-do-sul/', '/itaperucu/', '/colombo/'].includes(pathname)) {
    for (const service of ['computadores', 'dispositivos', 'cftv', 'redes-wifi']) assert(html.includes('href="../' + service + '/"'), pathname);
    for (const faq of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      const data = JSON.parse(faq[1]);
      if (data['@type'] === 'FAQPage') for (const question of data.mainEntity) {
        assert(html.includes('<summary>' + question.name + '</summary>'), pathname);
        assert(html.includes('<p>' + question.acceptedAnswer.text + '</p>'), pathname);
      }
    }
  }
}
console.log('PASS: consentimento básico, anúncios negados, isolamento GA4, eventos/duplicação/URLs, campanhas, 17 páginas, schema, FAQs e links locais.');
