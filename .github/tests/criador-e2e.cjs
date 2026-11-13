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
      if (!spent.includes('17 XP')) {
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
      if(!mapRect||mapRect.x<0||mapRect.x+mapRect.width>1281)
        throw new Error('Mapa ultrapassa a largura disponível: '+JSON.stringify(mapRect));
      if(!await page.locator('#gene-builder-map .fp-gene-double-helix').count())
        throw new Error('DNA de dupla hélice não renderizado');
      if(!await page.locator('#gene-builder-map .fp-gene-die-inline .fp-gene-die-poly path').count())
        throw new Error('Dados poliédricos não têm os traços do rolador');
      const potentials=page.locator('#gene-builder-map .fp-gene-skill.is-potential');
      if(!await potentials.count())throw new Error('Perícias sem requisitos, mas com XP, não aparecem em roxo');
      await potentials.first().locator('.fp-gene-dot').click();
      await page.waitForSelector('#gene-builder-detail:not([hidden])');
      const detailText=await page.locator('#gene-builder-detail').innerText();
      if(!detailText.includes('requisitos pendentes'))
        throw new Error('Detalhes do nó roxo não explicam requisitos pendentes: '+detailText.slice(0,160));
      const detailBox=await page.locator('#gene-builder-detail').boundingBox();
      if(!detailBox||detailBox.x<mapRect.x||detailBox.x+detailBox.width>mapRect.x+mapRect.width+2)
        throw new Error('Inspector flutuante sai da lateral do mapa: '+JSON.stringify(detailBox));
      await page.locator('#gene-builder-detail [data-action="gene-close-detail"]').click();
      if(!await page.locator('#gene-builder-detail').isHidden())
        throw new Error('Não foi possível fechar o inspector');
      // Ajustes são prévias. Confirmação é obrigatória antes de afetar a ficha.
      await page.locator('#gene-builder-map [data-gene-grade="1"][data-gene-id="attr:agilidade"]').click();
      const budgetDraft=await page.locator('#gene-build-budget').innerText();
      if(!budgetDraft.includes('16 XP')||!budgetDraft.includes('4 XP'))
        throw new Error('Prévia de XP incorreta: '+budgetDraft);
      const spentBefore=await page.locator('#wizard-summary').innerText();
      if(!spentBefore.includes('17 XP'))throw new Error('Alteração foi debitada antes de confirmar: '+spentBefore.slice(0,280));
      await page.locator('#gene-build-actions button[data-action="gene-confirm"]').click();
      const afterConfirm=await page.locator('#wizard-summary').innerText();
      if(!afterConfirm.includes('16 XP')||!afterConfirm.includes('4 / 20 XP'))
        throw new Error('Evolução não confirmada no XP compartilhado: '+afterConfirm.slice(0,300));
      const attrCard=page.locator('#gene-builder-map [data-gene-id="attr:agilidade"].fp-gene-card');
      if(!await attrCard.count())throw new Error('Grau comprado sumiu no mapa após confirmar');
      await page.locator('#wizard-content button[data-action="gene-future"]').click();
      if(!await page.locator('#gene-builder-map .fp-gene-skill.is-locked').count())
        throw new Error('O modo de ramificações futuras não mostra opções bloqueadas');
      await page.locator('#wizard-content button[data-action="gene-future"]').click();
      if(await page.locator('#gene-builder-map .fp-gene-skill.is-locked').count())
        throw new Error('Opções futuras não foram ocultadas de novo');
      // Ramificações conectadas como no grafo temático, não como pré-requisitos.
      const branchLines=await page.locator('#gene-builder-map .fp-gene-skill-link').count();
      if(branchLines<1)throw new Error('O grafo de Perícias não tem conexões de ramificação');
      const mount=page.locator('#gene-builder-map .fp-gene-skill.is-potential[data-gene-id="montar"]');
      if(await mount.count()!==1)throw new Error('Montar Animal deve mostrar pacote roxo com XP suficiente');
      await mount.locator('.fp-gene-dot').click();
      const buyAll=page.locator('#gene-builder-detail [data-action="gene-auto-buy"][data-id="montar"]');
      if(!await buyAll.count())throw new Error('Falta o botão comprar Perícia + requisitos');
      const preBuyText=await page.locator('#gene-builder-detail').innerText();
      if(!preBuyText.includes('5 XP'))throw new Error('Pacote Montar não calcula Influence 2 + Perícia por 5 XP: '+preBuyText);
      page.once('dialog', async dialog => {
        if(!dialog.message().includes('Influência 0 → 2')||!dialog.message().includes('Montar Animal'))
          throw new Error('Confirmação não lista todos os requisitos: '+dialog.message());
        await dialog.accept();
      });
      await buyAll.click();
      const autoSpent=await page.locator('#wizard-summary').innerText();
      if(!autoSpent.includes('11 XP')||!autoSpent.includes('9 / 20 XP'))
        throw new Error('Compra automática não debitou os 5 XP completos: '+autoSpent.slice(0,350));
      const influence=page.locator('#gene-builder-map .fp-gene-card[data-gene-id="attr:influencia"]');
      if(!await influence.textContent().then(t=>t.includes('GRAU 2')))
        throw new Error('Compra automática não elevou Influência a grau 2');
      if(await influence.locator('.fp-gene-die-inline').count()!==2)
        throw new Error('Influência grau 2 deveria exibir dois dados reais');
      if(!await page.locator('#gene-builder-map .fp-gene-skill.is-owned[data-gene-id="montar"]').count())
        throw new Error('Montar Animal não foi incorporada como Perícia adquirida');
      // Fechar a ficha lateral antes de interagir com os nós atrás dela.
      await page.locator('#gene-builder-detail [data-action="gene-close-detail"]').click();
      // Evoluir Agilidade para grau 3 produz 3 ícones de dados; descartar não gasta XP.
      await page.locator('#gene-builder-map [data-gene-grade="1"][data-gene-id="attr:agilidade"]').click();
      await page.locator('#gene-builder-map [data-gene-grade="1"][data-gene-id="attr:agilidade"]').click();
      if(await page.locator('#gene-builder-map [data-gene-id="attr:agilidade"] .fp-gene-die-inline').count()!==3)
        throw new Error('Grau 3 não exibe três dados entre − e +');
      await page.locator('#gene-build-actions [data-action="gene-reset"]').click();
      if(!await page.locator('#wizard-summary').innerText().then(t=>t.includes('11 XP')))
        throw new Error('Descartar evolução de três dados alterou o saldo real');
      await page.locator('#wizard-content button[data-action="wizard-mode"][data-mode="list"]').click();
      await page.locator('#wizard-content button[data-action="wizard-tab"][data-group="attr"]').click();
      if(!await page.locator('#wizard-content [data-action="grade"][data-group="attr"][data-key="agilidade"]').count())
        throw new Error('Alternância de volta às listas perdeu o Atributo comprado');
      if(exceptions.length)throw new Error('Erros Javascript no Codex Genético: '+exceptions.join(' | '));
      console.log('[TRACE] Codex Genético reorganizado e evolução confirmada:',testCase.name,
                  'categorias=',JSON.stringify(counters),'saldo=16 XP');
      // O assistente agora inclui 20 VT experimentais para comprar os itens iniciais.
      await page.locator('#wizard-controls [data-action="wizard-next"]').click();
      await page.waitForSelector('#wizard-content .fp-wiz-shop-catalog');
      const tradeScreen=await page.locator('#wizard-content').innerText();
      if(!tradeScreen.includes('20 VT')||!tradeScreen.includes('VT DISPONÍVEIS'))
        throw new Error('Etapa de VT não abriu corretamente');
      if(await page.locator('#wizard-content [data-wizard-vt-draft]').count()!==5)
        throw new Error('Faltam os cinco tipos de recursos de troca');
      await page.locator('#wizard-content [data-action="wizard-shop-category"][data-category="weapon"]').click();
      page.once('dialog', dialog => dialog.accept());
      await page.locator('#wizard-content [data-action="wizard-buy-item"][data-item="Faca"]').click();
      if(!await page.locator('#wizard-content').innerText().then(t=>t.includes('18')&&t.includes('Faca')))
        throw new Error('Compra de Faca não atualizou saldo VT e inventário inicial');
      if(!await page.locator('#wizard-summary').innerText().then(t=>t.includes('18 VT')&&t.includes('11 XP')))
        throw new Error('Compra com VT afetou indevidamente o saldo de XP ou VT');
      await page.locator('#wizard-controls [data-action="wizard-next"]').click();
      await page.waitForSelector('#wizard-content .fp-wiz-review-hero');
      page.once('dialog', dialog => dialog.accept());
      await page.locator('#wizard-controls [data-action="wizard-finish"]').click();
      await page.waitForSelector('#full-sheet:not([hidden])');
      await page.locator('#sheet-navigation button[data-sheet-page="genetic"]').click();
      await page.waitForSelector('#genetic-view:not([hidden])');
      if (!await page.locator('#gene-sheet-budget .fp-gene-dashboard').count()||
          !await page.locator('#gene-sheet-actions [data-action="gene-confirm"]').count())
        throw new Error('A ficha final não apresenta saldo ou confirmação do Codex Genético');
      if (await page.locator('#gene-map .fp-gene-card').count() !== 18)
        throw new Error('O mapa da ficha final perdeu uma fonte');
      await page.locator('#gene-map [data-gene-grade="1"][data-gene-id="attr:destreza"]').click();
      if (!await page.locator('#gene-sheet-budget').innerText().then(t => t.includes('10 XP')))
        throw new Error('Saldo prévio de XP na ficha final não responde aos dados');
      await page.locator('#gene-sheet-actions [data-action="gene-reset"]').click();
      if (!await page.locator('#gene-sheet-budget').innerText().then(t => t.includes('11 XP')))
        throw new Error('Descartar evolução falhou na ficha final');
      if(exceptions.length)throw new Error('Erros Javascript na ficha final: '+exceptions.join(' | '));
      console.log('PASS', testCase.name);
      await page.close();
    }

    // Navegação em tela estreita: o mapa pode rolar horizontalmente,
    // mas o inspector e os controles precisam caber no viewport.
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    const mobileErrors = [];
    mobile.on('pageerror', e => mobileErrors.push(e.message));
    await mobile.goto('http://127.0.0.1:8000/prototipo-ficha/', {waitUntil: 'domcontentloaded'});
    await mobile.locator('input[data-wizard-field="name"]').fill('Aprendiz móvel');
    await mobile.locator('#wizard-controls [data-action="wizard-next"]').click();
    await mobile.locator('[data-action="wizard-starter-attr"][data-key="forca"]').click();
    await mobile.locator('[data-action="wizard-starter-training"][data-group="practice"][data-key="atletismo"]').click();
    await mobile.locator('#wizard-controls [data-action="wizard-next"]').click();
    await mobile.locator('#wizard-content [data-action="wizard-mode"][data-mode="genetic"]').click();
    const shell = await mobile.locator('#wizard-content .fp-gene-canvas-shell').boundingBox();
    if (!shell || shell.x < -1 || shell.x + shell.width > 392)
      throw new Error('Mapa genético ultrapassa o viewport móvel: '+JSON.stringify(shell));
    await mobile.locator('#gene-builder-map .fp-gene-skill.is-potential .fp-gene-dot').first().click();
    await mobile.waitForSelector('#gene-builder-detail:not([hidden])');
    const inspector = await mobile.locator('#gene-builder-detail').boundingBox();
    if (!inspector || inspector.x < -1 || inspector.x + inspector.width > 392)
      throw new Error('Inspector lateral cortado no celular: '+JSON.stringify(inspector));
    await mobile.locator('#gene-builder-detail [data-action="gene-close-detail"]').click();
    await mobile.locator('#wizard-controls [data-action="wizard-next"]').click();
    await mobile.waitForSelector('#wizard-content .fp-wiz-vt-stats');
    if (mobileErrors.length) throw new Error('Erro JS móvel: '+mobileErrors.join(' | '));
    console.log('PASS Layout móvel de mapa, inspector e VT');
    await mobile.close();
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err.stack || err); process.exitCode=1; });
