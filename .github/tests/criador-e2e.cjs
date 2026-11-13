const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const cases = [
    { name: 'Atributo + Conhecimento em tema escuro', group: 'know', id: 'medicina', theme: 'dark' },
    { name: 'Atributo + Prática em tema claro', group: 'practice', id: 'atletismo', theme: 'light' }
  ];

  try {
    for (const testCase of cases) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      const exceptions = [];
      const logs = [];
      page.on('pageerror', error => exceptions.push(error.stack || error.message));
      page.on('console', msg => { if (msg.type() === 'error') logs.push(msg.text()); });
      const url = 'http://127.0.0.1:8000/prototipo-ficha/';
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.locator('input[data-wizard-field="name"]').fill('Aprendiz de teste');
      await page.locator('#wizard-controls [data-action="wizard-next"]').click();
      await page.waitForSelector('button[data-action="wizard-starter-attr"][data-key="forca"]');
      console.log('[TRACE]', testCase.name, 'entrou na etapa 2');
      await page.locator('button[data-action="wizard-starter-attr"][data-key="forca"]').click();
      await page.waitForSelector('button[data-action="wizard-starter-training"][data-group="' + testCase.group + '"][data-key="' + testCase.id + '"]');
      console.log('[TRACE]', testCase.name, 'selecionou atributo');
      await page.locator('button[data-action="wizard-starter-training"][data-group="' + testCase.group + '"][data-key="' + testCase.id + '"]').click();
      await page.waitForSelector('#wizard-controls [data-action="wizard-next"]:not([disabled])');
      console.log('[TRACE]', testCase.name, 'confirmacao pronta');
      console.log('[TRACE]', await page.locator('#wizard-content').innerText().then(t=>t.slice(0,320)));
      await page.locator('#wizard-controls [data-action="wizard-next"]').click();
      await page.waitForTimeout(250);
      const summary = await page.locator('#wizard-steps').innerText();
      const content = await page.locator('#wizard-content').innerText();
      const spent = await page.locator('#wizard-summary').innerText();
      console.log('[TRACE]', testCase.name, 'navigation:', summary.replace(/\n/g, ' | '));
      console.log('[TRACE]', testCase.name, 'page:', content.slice(0,420).replace(/\n/g, ' | '));
      console.log('[TRACE]', testCase.name, 'xp:', spent.slice(0,300).replace(/\n/g, ' | '));
      console.log('[TRACE]', testCase.name, 'exceptions:', JSON.stringify(exceptions));
      console.log('[TRACE]', testCase.name, 'consoleErrors:', JSON.stringify(logs));
      if (!content.includes('ETAPA 03') || !content.includes('Distribuição livre de XP')) {
        throw new Error('Falha de navegacao na etapa 2→3: ' + testCase.name + ' | ' + content.slice(0,300) + ' | Errors: ' + exceptions.join(' | '));
      }
      if (!spent.includes('16 XP')) {
        throw new Error('XP incorreto após confirmação: ' + spent.slice(0,450));
      }
      if (exceptions.length > 0) {
        throw new Error('Erro JavaScript em navegação: '+exceptions.join(' | '));
      }
      const tabs=page.locator('#wizard-content [data-action="wizard-tab"]');
      if (await tabs.count() !== 4) throw new Error('Etapa 3 não oferece as quatro abas');
      await page.locator('#wizard-content button[data-action="wizard-tab"][data-group="practice"]').click();
      if (!await page.locator('#wizard-content [data-action="grade"][data-group="practice"]').count()) {
        throw new Error('Lista de Práticas não carrega na etapa 3');
      }
      await page.locator('#wizard-content button[data-action="wizard-mode"][data-mode="genetic"]').click();
      if (!await page.locator('#gene-builder-map').count()) throw new Error('Alternância para o Codex Genético falhou');
      console.log('PASS', testCase.name);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err.stack || err); process.exitCode=1; });
