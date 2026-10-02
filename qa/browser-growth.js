// Playwright CLI -s=gc-tech-improvements run-code --filename=qa/browser-growth.js
async page => {
  function check(condition, label) { if (!condition) throw new Error(label); }
  const externalAnalytics = [];
  await page.context().route(/googletagmanager|google-analytics/, route => {
    externalAnalytics.push(route.request().url());
    return route.abort();
  });
  const paths = ['/', '/cftv/', '/redes-wifi/', '/computadores/', '/dispositivos/', '/empresas/', '/sites/', '/empresas/suporte-ti/', '/sites/criacao-de-sites/', '/sites/sites-sob-medida/', '/rio-branco-do-sul/', '/itaperucu/', '/colombo/', '/avaliacoes/', '/sobre/', '/politica-de-privacidade/', '/termos/'];
  for (const pathname of paths) {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto('http://127.0.0.1:8771' + pathname, { waitUntil: 'networkidle' });
    check(response.status() === 200, pathname + ' HTTP');
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), pathname + ' overflow');
    check(await page.locator('script[src*="googletagmanager"]').count() === 0, pathname + ' loader local');
    check(await page.evaluate(() => typeof window.gtag) === 'undefined', pathname + ' gtag local');
    const toggle = page.locator('[data-menu-toggle]');
    await toggle.click();
    check(await toggle.getAttribute('aria-expanded') === 'true', pathname + ' abrir menu');
    await page.locator('[data-mobile-menu] a').first().click();
    check(await toggle.getAttribute('aria-expanded') === 'false', pathname + ' fechar menu');
  }
  check(externalAnalytics.length === 0, 'Local tentou carregar Analytics');
  await page.goto('http://127.0.0.1:8771/', { waitUntil: 'networkidle' });
  check(await page.locator('.footer-bottom a').nth(0).getAttribute('href') === 'politica-de-privacidade/', 'Privacidade');
  check(await page.locator('.footer-bottom a').nth(1).getAttribute('href') === 'termos/', 'Termos');
  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'home ' + width);
  }
  for (const route of ['computadores', 'dispositivos', 'cftv', 'redes-wifi', 'empresas', 'sites', 'empresas/suporte-ti', 'sites/criacao-de-sites', 'sites/sites-sob-medida']) {
    await page.goto('http://127.0.0.1:8771/' + route + '/', { waitUntil: 'networkidle' });
    const cta = page.locator('.button-whatsapp, .btn-whats').first();
    const href = new URL(await cta.getAttribute('href'));
    check(href.hostname === 'wa.me' && href.pathname === '/5541995372084', route + ' destinatário');
    check(href.searchParams.get('text'), route + ' CTA sem mensagem');
  }
  // Domínio de produção simulado com respostas locais: nenhum acesso real ao site.
  await page.route('https://gctech.pro/**', async route => {
    const pathname = new URL(route.request().url()).pathname;
    const response = await page.request.get('http://127.0.0.1:8771' + pathname);
    await route.fulfill({ response });
  });
  await page.goto('https://gctech.pro/?utm_source=facebook&utm_medium=social&utm_campaign=gc_tech_202610', { waitUntil: 'networkidle' });
  await page.locator('.cookie-banner [data-consent="accept"]').click();
  await page.evaluate(() => {
    document.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link && (link.hostname === 'wa.me' || link.protocol === 'tel:')) event.preventDefault();
    }, true);
  });
  await page.locator('.hero .button-whatsapp').click();
  const events = await page.evaluate(() => window.dataLayer.map(item => Array.from(item)).filter(item => item[0] === 'event'));
  check(events.filter(item => item[1] === 'click_whatsapp').length === 1, '1 clique');
  check(events.find(item => item[1] === 'click_whatsapp')[2].link_location === 'hero', 'CTA hero');
  check(!events.some(item => ['request_quote', 'generate_lead', 'purchase'].includes(item[1])), 'lead falso');
  await page.unroute('https://gctech.pro/**');
  await page.goto('http://127.0.0.1:8771/', { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reports = 'E:/Sites/site-builder/sites/gc-tech/reports';
  await page.screenshot({ path: reports + '/2026-10-01-home-final-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: reports + '/2026-10-01-home-final-desktop.png', fullPage: true });
  return { result: 'PASS', pages: 17, homeWidths: [360, 390, 768, 1280], serviceCTAs: 9, productionSimulation: '1 clique, 0 lead falso; coleta externa bloqueada' };
}
