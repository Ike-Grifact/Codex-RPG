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
      // Mapa reorganizado: seis Atributos centrais, seis Conhecimentos à esquerda e seis Práticas à direita.
      const counters = await Promise.all(['attr','know','practice'].map(group =>
        page.locator('#gene-builder-map .fp-gene-card.type-' + group).count()));
      if (counters.some(x=>x!==6)) throw new Error('Fontes não estão no mapa: '+JSON.stringify(counters));
      const unlocked=await page.locator('#gene-builder-map .fp-gene-skill.is-locked').count();
      if (unlocked!==0) throw new Error('Ramificações bloqueadas aparecendo sem pedir: '+unlocked);
      const mapRect=await page.locator('#gene-builder-map').boundingBox();
      const detailRect=await page.locator('#gene-builder-detail').boundingBox();
      if(!mapRect||!detailRect||detailRect.y<mapRect.y+mapRect.height-10||
          detailRect.x<0||detailRect.x+detailRect.width>1281)
        throw new Error('Mapa/painel se sobrepõem ou são cortados: '+JSON.stringify({mapRect,detailRect}));
      // Ajustes são prévias. Confirmação é obrigatória antes de afetar a ficha.
      await page.locator('#gene-builder-map [data-gene-grade="1"][data-gene-id="attr:agilidade"]').click();
      const budgetDraft=await page.locator('#gene-build-budget').innerText();
      if(!budgetDraft.includes('15 XP')||!budgetDraft.includes('4 XP'))
        throw new Error('Prévia de XP incorreta: '+budgetDraft);
      const spentBefore=await page.locator('#wizard-summary').innerText();
      if(!spentBefore.includes('16 XP'))throw new Error('Alteração foi debitada antes de confirmar: '+spentBefore.slice(0,280));
      await page.locator('#gene-build-actions button[data-action="gene-confirm"]').click();
      const afterConfirm=await page.locator('#wizard-summary').innerText();
      if(!afterConfirm.includes('15 XP')||!afterConfirm.includes('4 / 19 XP'))
        throw new Error('Evolução não confirmada no XP compartilhado: '+afterConfirm.slice(0,300));
      const attrCard=page.locator('#gene-builder-map [data-gene-id="attr:agilidade"].fp-gene-card');
      if(!await attrCard.count())throw new Error('Grau comprado sumiu no mapa após confirmar');
      await page.locator('#wizard-content button[data-action="gene-future"]').click();
      if(!await page.locator('#gene-builder-map .fp-gene-skill.is-locked').count())
        throw new Error('O modo de ramificações futuras não mostra opções bloqueadas');
      await page.locator('#wizard-content button[data-action="gene-future"]').click();
      if(await page.locator('#gene-builder-map .fp-gene-skill.is-locked').count())
        throw new Error('Opções futuras não foram ocultadas de novo');
      await page.locator('#wizard-content button[data-action="wizard-mode"][data-mode="list"]').click();
      await page.locator('#wizard-content button[data-action="wizard-tab"][data-group="attr"]').click();
      if(!await page.locator('#wizard-content [data-action="grade"][data-group="attr"][data-key="agilidade"]').count())
        throw new Error('Alternância de volta às listas perdeu o Atributo comprado');
      if(exceptions.length)throw new Error('Erros Javascript no Codex Genético: '+exceptions.join(' | '));
      console.log('[TRACE] Codex Genético reorganizado e evolução confirmada:',testCase.name,
                  'categorias=',JSON.stringify(counters),'saldo=15 XP');
      console.log('PASS', testCase.name);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err.stack || err); process.exitCode=1; });
