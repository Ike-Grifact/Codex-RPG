# Codex RPG — Protótipo Foundry VTT

**Estado:** protótipo experimental 0.1.0, independente do site e do criador de Aprendizes.

**Alvo técnico:** Foundry VTT **v14**. O projeto usa \`ActorSheetV2\`, \`HandlebarsApplicationMixin\`, \`TypeDataModel\` e \`Roll\` da API oficial. **Não foi executado em uma instância real do Foundry**; validamos a sintaxe e parte das regras puras. Não é versão pronta para campanha.

## Isolamento do protótipo

Todo o código deste sistema está em \`foundry-prototype/\`. Nenhum arquivo do site \`index.html\`, \`criador.html\`, \`livro.html\` ou das bibliotecas web originais precisa ser substituído.

A pasta é um **sistema Foundry independente**, não um módulo para instalar em cima de outro sistema. Para Foundry reconhecer \`system.json\`, o conteúdo desta pasta deve ser instalado com o nome de sistema \`codex-rpg-foundry\`.

## Instalação manual para testes

1. Faça download/clone do repositório \`Ike-Grifact/Codex-RPG\` na sua máquina.
2. Copie **todo o conteúdo** de \`foundry-prototype/\` para a pasta de dados do Foundry \`Data/systems/codex-rpg-foundry/\`, mantendo \`system.json\` na raiz dessa pasta.
3. Reinicie a instalação do Foundry, selecione **Codex RPG — Protótipo Foundry** na criação de um mundo e crie um Actor do tipo **Personagem**.
4. Abra a ficha. Edite conceito, nível, origem, virtude e personalidade; ajuste os graus e ative Perícias de teste conforme necessário.

Não existe, ainda, URL de instalação por manifesto nem ZIP de release publicado. O link para um arquivo \`system.json\` dentro de uma subpasta do repositório **não é por si só um instalador automático**.

## O que já existe

- Ficha nativa \`ActorSheetV2\` com portrait, identidade, Vida, Coragem, PP, DE, balanço e carga teórica.
- Dados geométricos SVG para os cinco formatos e identidade visual própria, incluindo logo vetorizada.
- Seis Atributos, seis Conhecimentos e **seis Práticas**, sendo **Armas ou Conjuração uma única Prática compartilhada**.
- Clique em Conhecimento/Prática para escolher a **Base**. Clique em Atributo para completar a composição: **abre a preparação automaticamente sem rolar**.
- Terceiro Conhecimento/Prática, opcional, somente se houver Perícia de combinação pertinente e validação contextual expressa. **A terceira fonte não entra automaticamente por possuir uma Perícia qualquer**.
- A Base determina a natureza da ação. \`Armas + Força + Apresentação\` e \`Apresentação + Força + Armas\` conservam ordens e significados distintos.
- O uso marcial ou mágico da Prática compartilhada depende de Armas 1 ou Aprendiz de Conjurador. Nunca duplica a graduação nem o dado por possuir as duas.
- Pilha limitada a nove dados; retenção natural de dois ou três conforme nível, com um adicional mediante Coragem, teto quatro e mínimo um dado de Atributo.
- Faces simbólicas d4, d6, d10, d12 e d20 reforçado G; dados descartados não entram no cálculo.
- Seleção de dados mantidos depois de rolar, conversões básicas de Antecipar, cálculo de DE, classificação de risco com Pavor e dano básico.
- Rolagem já executada é guardada em \`flags.codex-rpg-foundry.pendingRoll\` para não abrir um novo teste gratuitamente por fechar a janela. No botão **Finalizar**, os custos de Coragem da preparação são aplicados e a ação é registrada no chat.
- Equipamentos básicos persistidos como Items: cadastro, estado equipado, peso e integridade.
- Temas claro/escuro e interface adaptável para telas menores.

## Limitações importantes

Este é um protótipo de validação de interação e motor. **Ainda não automatiza:** compra de XP, todos os requisitos das Perícias, composição avançada de armas/magias, especialidades elementais, munição, defesa e resistência de todas as peças, recuperação médica automática, Furtividade especial, dinâmica completa de Pavor adversário, economia de turnos, inimigos e lançamento de efeitos sobre Tokens.

A seleção de Perícias serve, nesta fase, **para habilitação em playtest**, sem desconto automático de XP. O grau da Prática ou Conhecimento pode ser ajustado manualmente; o orçamento de criação 7+7+5 continua **EXPERIMENTAL**.

A pertinência da terceira fonte precisa de confirmação contextual. Isso **não pretende** criar uma regra de que qualquer par é sempre permitido com a Perícia genérica: o catálogo de combinações ainda deve ser fechado.

A carga que envolve a Prática Armas ou Conjuração é apresentada como **cálculo provisório**, pois seu efeito quando utilizada exclusivamente para conjurar precisa de decisão.

O resultado de rolagem é persistido ao executar, mas transações multijogador/concorrentes, permissões por tipo de usuário e despesas de vários recursos ainda precisam de testes de integração e endurecimento. Evite usar o protótipo em mundos de campanha que não tenham backup.

## Estrutura

\`\`\`text
foundry-prototype/
  system.json
  assets/codex-logo.svg
  lang/pt-BR.json
  module/
    main.mjs
    data-model.mjs
    rules.mjs
    roll-engine.mjs
    sheet.mjs
  templates/character-sheet.hbs
  styles/codex-sheet.css
  tests/rules.test.mjs
  README.md
\`\`\`

O \`rules.mjs\` é independente da API do Foundry para viabilizar testes e reaproveitamento futuro. A ficha e o lançador de dados são adaptadores para o Foundry.

## Testes

Na raiz \`foundry-prototype/\`, execute:

\`\`\`sh
node --test tests/rules.test.mjs
\`\`\`

O teste verifica catálogos, faces, base e ordem de ação, requisito da terceira fonte, acesso marcial/mágico, retenção, DE, Pavor e Antecipar. Ainda é necessário realizar teste funcional **dentro de um Foundry v14 real** (cliques, renderização, criação de Actor, permissões e mensagens).

## Identidade e escopo

O protótipo preserva a paleta \`#267A45\` (Êxito ᛋ), \`#2369BB\` (Antecipar ᚨ), \`#542176\` (Pavor ᚦ), a logo SVG transparente, a geometria dos dados e os temas Codex.

Não contém código, mecânicas, recursos nem identidade visual de Assimilação RPG. A auditoria externa serviu exclusivamente de referência de engenharia da interface.

O SRD de Continuidade permanece um documento de desenvolvimento; **o protótipo não oferece links públicos para o SRD**.

**Próximos passos:** validar a experiência de seleção e a ordem da Base em Foundry; fechar as Perícias de combinação; testar equipamentos como fontes independentes; implementar progressão e sistema de combate completo.
