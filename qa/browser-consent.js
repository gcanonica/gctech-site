// Playwright CLI -s=gc-tech-consent run-code --filename=qa/browser-consent.js
async page => {
  const context = page.context();
  const key = 'gc-tech-consent-v1';
  const requests = [], errors = [];
  const check = (condition, label) => { if (!condition) throw new Error(label); };
  page.on('pageerror', error => errors.push(error.message));
  // Produção simulada, respostas locais e nenhuma transmissão de Analytics/Ads/Meta.
  await context.route(/googletagmanager|google-analytics|doubleclick|facebook\.net|facebook\.com\/tr/, route => {
    requests.push(route.request().url());
    return route.abort();
  });
  await context.route('https://gctech.pro/**', async route => {
    const url = new URL(route.request().url());
    const response = await page.request.get('http://127.0.0.1:8771' + url.pathname + url.search);
    await route.fulfill({ response });
  });
  await page.goto('https://gctech.pro/', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  check(await page.locator('.cookie-banner').isVisible(), 'banner inicial');
  check(await page.locator('.cookie-banner p').innerText() === 'Usamos cookies de estatísticas para melhorar o site, se você permitir.', 'aviso curto');
  check(JSON.stringify(await page.locator('.cookie-banner button').allTextContents()) === JSON.stringify(['Aceitar', 'Rejeitar', 'Preferências']), 'três escolhas com rótulos curtos');
  check(await page.evaluate(() => typeof window.gtag === 'undefined'), 'nenhuma tag antes de escolher');
  check(requests.length === 0, 'nenhum ping antes do aceite');
  const reports = 'E:/Sites/site-builder/sites/gc-tech/reports';
  for (const width of [320, 360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'banner overflow ' + width);
    check(await page.locator('.cookie-banner').evaluate(element => element.getBoundingClientRect().width <= 420 && element.scrollWidth <= element.clientWidth), 'banner compacto ' + width);
    check(await page.locator('.cookie-banner button').evaluateAll(elements => elements.every(element => element.getBoundingClientRect().height >= 44 && element.scrollWidth <= element.clientWidth)), 'botões legíveis e clicáveis ' + width);
    if (width === 390 || width === 1280) await page.screenshot({ path: reports + '/2026-10-01-cookies-compacto-' + width + '.png' });
  }
  await page.locator('.cookie-banner [data-consent="configure"]').click();
  check(await page.locator('.cookie-dialog').evaluate(element => element.open), 'dialog nativo');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: reports + '/2026-10-01-cookies-preferencias.png' });
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    // O navegador pode levar Tab à barra de endereço; nunca ao conteúdo atrás do modal.
    check(await page.evaluate(() => !document.hasFocus() || !!document.activeElement.closest('.cookie-dialog')), 'foco não escapa para a página');
  }
  await page.keyboard.press('Escape');
  check(await page.locator('.cookie-banner [data-consent="configure"]').evaluate(element => document.activeElement === element), 'retorno de foco');
  await page.locator('.cookie-banner [data-consent="reject"]').click();
  check(await page.evaluate(k => JSON.parse(localStorage.getItem(k)).analytics === false, key), 'rejeição persistida');
  await page.reload({ waitUntil: 'networkidle' });
  check(!await page.locator('.cookie-banner').isVisible() && requests.length === 0, 'rejeição lembrada sem ping');
  await page.locator('.cookie-settings').click();
  await page.locator('#gc-cookie-analytics').check();
  await page.locator('.cookie-dialog [data-consent="save"]').click();
  await page.waitForFunction(() => typeof window.gtag === 'function');
  check(await page.evaluate(() => {
    const rows = dataLayer.map(item => Array.from(item));
    return rows.filter(item => item[0] === 'config').length === 1 &&
      rows.find(item => item[0] === 'consent' && item[1] === 'update')[2].ad_storage === 'denied';
  }), 'aceite inicia apenas Analytics');
  await page.waitForTimeout(100);
  check(requests.length === 1 && requests[0].includes('G-071CJDZME7'), 'apenas loader GA4 após aceite');
  await page.context().addCookies([
    { name: '_ga', value: 'test', domain: 'gctech.pro', path: '/', secure: true },
    { name: 'unrelated', value: 'keep', domain: 'gctech.pro', path: '/', secure: true }
  ]);
  // A revogação em uma aba deve bloquear e recarregar a outra também.
  const other = await context.newPage();
  await other.goto('https://gctech.pro/', { waitUntil: 'networkidle' });
  check(await other.evaluate(() => typeof window.gtag === 'function'), 'aceite lembrado na segunda aba');
  await page.locator('.cookie-settings').click();
  await Promise.all([page.waitForEvent('load'), page.locator('.cookie-dialog [data-consent="reject"]').click()]);
  await page.waitForLoadState('networkidle');
  await other.waitForFunction(() => typeof window.gtag === 'undefined');
  check(await page.evaluate(() => typeof window.gtag === 'undefined'), 'revogação remove a biblioteca por recarga');
  const cookies = await context.cookies('https://gctech.pro/');
  check(!cookies.some(item => item.name === '_ga'), 'cookie GA removido');
  check(cookies.some(item => item.name === 'unrelated'), 'cookie não relacionado preservado');
  await other.close();
  for (const invalid of ['invalid', JSON.stringify({ version: 1, analytics: true, updatedAt: Date.now() - 181 * 86400000 }), JSON.stringify({ version: 1, analytics: true, updatedAt: Date.now() + 86400000 })]) {
    await page.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: key, v: invalid });
    const count = requests.length;
    await page.reload({ waitUntil: 'networkidle' });
    check(await page.locator('.cookie-banner').isVisible(), 'escolha inválida/expirada exige novo aceite');
    check(await page.evaluate(() => typeof window.gtag === 'undefined') && requests.length === count, 'escolha inválida sem ping');
  }
  await page.evaluate(k => localStorage.setItem(k, JSON.stringify({ version: 1, analytics: true, updatedAt: Date.now() })), key);
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => {
    Storage.prototype.setItem = function () { throw new Error('writes blocked'); };
    document.addEventListener('click', event => { if (event.target.closest('a[href*="wa.me"]')) event.preventDefault(); }, true);
  });
  await context.addCookies([{ name: '_ga', value: 'test', domain: 'gctech.pro', path: '/', secure: true }]);
  await page.locator('.cookie-settings').click();
  await page.locator('.cookie-dialog [data-consent="reject"]').click();
  check(await page.evaluate(() => window['ga-disable-G-071CJDZME7'] === true && !gcTechConsent.analyticsAllowed()), 'revogar com falha de escrita desativa GA imediatamente');
  check(await page.locator('.cookie-status').innerText().then(text => text.includes('não permitiu salvá-la')), 'revogação não persistida é explícita');
  check(!(await context.cookies('https://gctech.pro/')).some(item => item.name === '_ga'), 'revogação não persistida limpa cookie GA');
  await page.locator('.cookie-dialog [data-consent="close"]').click();
  const beforeClick = await page.evaluate(() => dataLayer.length);
  await page.locator('.hero .button-whatsapp').click();
  check(await page.evaluate(() => dataLayer.length) === beforeClick, 'sem novo evento após revogação não persistida');
  await page.evaluate(() => localStorage.clear());
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('storage blocked'); } });
  });
  await page.reload({ waitUntil: 'networkidle' });
  check(await page.evaluate(() => typeof window.gtag === 'undefined'), 'armazenamento bloqueado: falha fechada');
  await page.locator('.cookie-banner [data-consent="reject"]').click();
  check(await page.locator('.cookie-status').innerText().then(text => text.includes('não permitiu salvá-la')), 'aviso de escolha não persistida');
  check(errors.length === 0, 'sem erros JS: ' + errors.join('; '));
  return { result: 'PASS', cases: 'aviso compacto, sem escolha, rejeitar, aceitar, revogar, outras abas, expiração, valor inválido, armazenamento bloqueado, teclado e 5 larguras', externalTracking: 'todos os requests abortados, sem entrega real ao Google/Meta' };
}
