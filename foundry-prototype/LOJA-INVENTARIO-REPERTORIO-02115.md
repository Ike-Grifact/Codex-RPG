# Loja, Inventário e Repertório no Foundry 0.2.1.15

## Origem e ambiente

Integração do PR #67, no commit `6957ad45032bffef98c10c6160bc85fda1871fd1`, sobre a revisão local `a6dd61f` da 0.2.1.14. O clone estava limpo no início. O remoto é `Ike-Grifact/Codex-RPG` e a branch local acompanha a branch do PR #4, `feat/criar-conflito-foundry-carga-20261113`.

A User Data confirmada é `F:/FoundryVTT-WindowsPortable-14.364`. O executável e o Setup informam Foundry 14.367. A versão anterior do sistema era 0.2.1.14. A integração usa o catálogo de 90 itens do commit de origem e a classificação funcional da Loja web.

Foram consultados o SRD de Continuidade v0.82 e as decisões posteriores sobre o catálogo e escudos. O catálogo atualizado fornece os preços, categorias, dados e Integridades dos novos equipamentos. A Espada Curta custa 2 VT e o Escudo Médio G1 tem 3 de Integridade. A migração integral do motor histórico para o rework de Coragem/PP da continuidade v0.82 segue pendente de uma revisão própria do sistema. A base de resolução desta integração é a instalação 0.2.1.14, incluindo suas regras de retenção, críticos, recursos e defesa.

## Funcionamento

- Loja com filtros independentes por família e peso, linhas recolhidas e confirmação do custo total por quantidade. O catálogo Foundry é gerado do mesmo arquivo de dados do criador a cada empacotamento. Um teste compara todos os registros.
- O saldo de VT é a soma dos cinco recursos de Grau 1 já representados por Items. Personagens novos recebem a hipótese experimental do site de quatro unidades de cada recurso, totalizando 20 VT e 0,25 Alto. Fichas existentes usam seus recursos cadastrados. Importações conservam os recursos e o registro original de comércio.
- A autoridade do Narrador enfileira cada compra por Actor. A alteração do saldo, a criação do Item e o histórico de compra usam uma única atualização do Actor. O identificador da operação impede repetir a mesma compra. Cada compra registra preço unitário, quantidade, total, recursos gastos, saldo, usuário e data.
- Inventário com filtros visuais por família e peso, agrupamentos, linhas recolhíveis e campos de quantidade, Integridade, munição, equipado, propriedades e equipamentos associados. As alterações de Item atualizam somente os campos escolhidos. Dados personalizados e o registro original dos itens importados são preservados.
- Cravar oferece confirmação manual da perda de Integridade após o ataque acertar e a característica ser ativada. A adjudicação da consequência de Integridade zero e o registro de múltiplas armas cravadas continuam pendentes nas regras.
- Repertório de armas, focos e proteções. As armas e focos identificam a Perícia exigida e o dado habilitável. Armaduras mostram Integridade e o modificador de DE. Escudos mantêm controles de inventário e sua ação própria de bloqueio.
- Rolar pelo equipamento usa a preparação e a publicação existentes, incluindo Roll & Keep, cartas, runas, Dice So Nice e alvo do VTT. O comando Preparar permite trocar o Atributo antes de rolar.
- A conveniência conserva o Atributo treinado selecionado. Na ausência dele, o foco prefere Inteligência treinada. A escolha automática usa o maior Grau, com desempate por Destreza, Força, Agilidade, Vigor, Inteligência e Influência. Essa ordem está documentada em `equipment-workflow.mjs`.

## Verificações executadas

Node.js 24.16.0. A suíte completa `node --test foundry-prototype/tests/*.test.mjs` passou com 89 testes e zero falhas. Os seis testes de `prototipo-ficha/equipment-shop-ui.test.mjs` do commit de origem também passaram.

Dois clientes Chromium conectaram como Narrador e Jogador QA ao Foundry 14.367, com a mesma instalação do executável portátil e uma User Data de QA isolada.

- Compra pela interface de Espada Curta a 2 VT, saldo de 20 para 18 VT e Item visível no outro cliente.
- Filtros independentes por família e peso, detalhes recolhíveis e estado equipado persistido.
- Mesmo pedido de compra enviado pelos dois clientes aplicou uma única cobrança e criou um Item. Compra com saldo insuficiente foi recusada.
- Guerreiro com Armas Leves e Disciplina preparou Força já selecionada e preservou DE manual 7. A rolagem pelo cartão incluiu Disciplina d10, Força d6 e um único d6 de equipamento.
- O NPC marcado no mapa foi registrado como alvo da ação. A DE reservada permaneceu selada no fluxo do jogador. As cartas passaram pelo comando normal de retenção e uma mensagem foi publicada no chat. Novo clique durante a pendência conservou o mesmo ID da rolagem.
- Aprendiz sem Perícia teve o ataque por equipamento bloqueado.
- Conjurador com foco habilitado usou Disciplina e Inteligência. O modo Editar bloqueou o ataque. O retorno a Jogar permitiu a rolagem.
- Defensor com Armadura Leve exibiu Integridade 7/7 e modificador +1 DE. O cartão de armadura apresentou somente as informações de proteção.
- Interface verificada em desktop e viewport de 430 px.
- Após reiniciar o Foundry, quatro fichas conservaram exatamente seus dados, compras e inventário. Quantidade 2, munição 5/8, Integridade 2/3, equipamento ativo e descrição e flags personalizadas foram conferidos. Uma ficha anterior da 0.2.1.14 conservou suas Perícias, XP e auditoria de devolução.

Durante a preparação, os testes do instalador recusaram a execução com o servidor de QA aberto. A execução final ocorreu com ele fechado e aprovou toda a suíte. As correções dos roteiros de navegador incluíram os nomes dos botões de confirmação e o encerramento das fichas ApplicationV2 pelo Actor.

## Instalação e recuperação

O instalador foi executado a partir do clone com o Foundry fechado. Conferiu os 86 arquivos anteriores contra o pacote da 0.2.1.14. A inspeção confirmou o armazenamento pessoal em `storage`. A atualização foi instalada e os 89 arquivos finais coincidiram com o ZIP extraído. O backup conferido contém os 86 arquivos anteriores.

O digest dos bancos e manifestos dos mundos, a estrutura e metadados dos demais arquivos dos mundos, as configurações e o armazenamento persistente foram comparados antes e depois da troca. As verificações de preservação passaram.

Backup em `F:/FoundryVTT-WindowsPortable-14.364/Backups/codex-rpg-system-installer/2026-11-19T03-21-05-837Z-lNk81G/codex-rpg-foundry`.

Para atualizar novamente a partir do clone, com Node.js 24 e Foundry fechado, execute:

```powershell
node foundry-prototype/scripts/install.mjs --user-data 'F:/FoundryVTT-WindowsPortable-14.364'
```

O instalador mantém um backup a cada troca e restaura a instalação anterior se a promoção do pacote falhar. Para uma restauração manual, feche o Foundry, mova somente a pasta instalada do sistema para fora de `Data/systems` e copie a pasta do backup para `Data/systems/codex-rpg-foundry`. Preserve a instalação deslocada para recuperar arquivos pessoais recentes de `storage`.

## Arquivos alterados

- `prototipo-ficha/catalog.js` e `foundry-prototype/module/catalog.mjs` recebem o catálogo oficial de origem.
- `module/equipment-catalog.mjs`, `module/equipment-view.mjs` e `module/equipment-workflow.mjs` contêm classificação, apresentação e planos de compra e preparo.
- `module/creation.mjs`, `module/data-model.mjs`, `module/main.mjs`, `module/roll-workflow.mjs`, `module/equipment-logic.mjs` e `module/sheet.mjs` integram Items, recursos, permissões e ações da ficha.
- `templates/character-sheet.hbs` e `styles/codex-sheet.css` apresentam Loja, Inventário e Repertório.
- `scripts/sync-equipment-catalog.mjs` e `scripts/package.mjs` sincronizam a origem durante o empacotamento.
- `tests/equipment-shop.test.mjs` cobre o fluxo novo. `tests/rules.test.mjs` acompanha a Integridade atual de Escudo Pesado no catálogo.
- `system.json` identifica a revisão 0.2.1.15.

Os caminhos acima, exceto o catálogo web, são relativos a `foundry-prototype`. As capturas locais desta validação ficam em `foundry-v14-qa/runner/v02115-*.png`, ao lado do clone.

## Pendências

Preços e dados pendentes de Katana, Naginata e fabricação de focos seguem os estados do catálogo. Consumo automático de munição, capacidade efetiva de recipientes e consequências ainda abertas de Cravar exigem definição e validação próprias. Ajustes manuais de recursos são realizados pelo Narrador. O alinhamento integral dos demais subsistemas com a continuidade v0.82 exige uma migração específica e validação das fichas antigas.
