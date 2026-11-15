# Criar Conflito — Codex RPG (prévia)

Área de preparação de encontros em `criar-conflito/`. Ferramenta web experimental em `criar-conflito/`, incorporada ao portal na revisão v0.44. O atalho de transferência direta do DNA de humanoides permanece **PENDENTE** e desabilitado.

## Fichas e regras utilizadas

- **Criatura comum / animal**: Atributos na progressão comum, XP próprio informado pelo Narrador. Não é convertida em monstro extraordinário automaticamente.
- **Monstro extraordinário não humanoide**: Atributos na escala monstruosa de XP acumulado `0/2/8/20/38/66/102`, com dados `d4/d10/2d10/3d10/2d10+d12/d10+2d12/3d12`.
- **Humanoide comum / NPC**: a mesma tabela de XP, Atributos, Conhecimentos, Práticas e Perícias de um personagem. Criação com **20 XP iniciais EXPERIMENTAIS** compartilhados, além do XP extra que o Narrador acrescentar. A compra mínima de um Atributo G1 e um Conhecimento ou Prática G1 continua **DEFINIDA** na criação de personagens.

Múltiplas fichas no mesmo encontro, duplicação, liderança, Vida atual/máxima, DE, Pavor local e reserva pública, planejamento de dados mantidos, texto de capacidades, inventário, notas, salvamento local e importação/exportação em JSON.

- **Pavor local [DEFINIDO — v0.41]**: inicia cheio por novo confronto, com G1 4P, G2 5P, G3 6P, G4 7P, G5–G6 8P; não é dado gratuitamente novamente a cada rodada.
- **Pavor público**: teto `2 + número de jogadores`; começa com 2P. Ajuste manual e independente das fichas.
- **Mantidos**: base 2. Monstros não humanoides de graus 1–4 podem manter até 3; graus 5–6 até 4, **1P local por dado adicional** conforme capacidades. A quantidade selecionada é uma preparação, não um ataque automático nem um desconto imediato.
- **Cálculos**: Vida monstruosa `3 + Vigor + ⌊Força/2⌋` (exceção pequena PENDENTE) e DE monstruosa `Agilidade + ⌊Destreza/2⌋` (teto 9). Humanoides usam a defesa de personagens.
- **Carga**: peso convencional em unidades Alto; números alternativos de itens Leves, Médios ou Pesados que ainda cabem. Aviso explícito na inclusão além da capacidade; consequência mecânica ainda PENDENTE.

**PENDENTE**: orçamento máximo monstruoso por Grau, procedimentos da ficha de animais pequenos, requisitos avançados de Perícias (verificar SRD antes da sessão), tabelas de recompensa e graduação do desafio, alocação automática de Pavor entre inimigos e Narrador. O sistema não preenche essas lacunas arbitrariamente.

## Criação rápida de humanoides e integração pendente com o Codex Genético

Em **Criar Conflito**, o botão **+ NPC básico imediato** cria um humanoide de forma rápida com os investimentos mínimos de criação e permite editar graus, Perícias e itens no painel da ameaça.

**PENDENTE:** transferência automática do Codex Genético do criador de Aprendizes para a ficha do conflito. O botão correspondente fica desabilitado para não prometer uma integração que a versão pública do criador ainda não suporta. Fichas do conflito são salvas localmente e importadas/exportadas em JSON por um formato próprio.

A ficha de humanoide usa o orçamento experimental de 20 XP (com saldo livre após as compras mínimas). Não usa a progressão extraordinária de monstros.

## Rolagens básicas e gasto de Pavor (playtest do editor web)

- **Monstros extraordinários e criaturas comuns:** seção de rolagem básica com dois Atributos pertinentes, faces oficiais simbólicas, seleção dos dados mantidos e DE escolhida. A interface não deve ser confundida com a composição avançada: Atributos extras, d20 especial comprado, equipamento, efeitos de Perícias e ações conjuntas ainda exigem a ficha/fluxo completo.
- **Antecipar:** permite anular Pavor (1A por P), converter 2A em 1E ou reservar 1A para passar oportunidade, sem gastar o mesmo A duas vezes. A prévia não debita recursos.
- **Retenção monstruosa:** custa 1P **local** por dado mantido além de dois; desconto somente após confirmação explícita e desde que haja saldo. Críticos geram Pavor segundo o SRD, primeiro até o teto local do monstro, depois na reserva pública. Pavor descartado não conta.
- **Ação conjunta hostil:** para Líder vivo com participantes disponíveis, gasto público de **1P para o Líder + 1 aliado** ou **2P para Líder + 2 aliados**, conforme seção 0-R.4 da v0.39. O histórico de custo fixo de 3P está **REVOGADO**. Os participantes, o alvo, os demais custos locais e a rolagem conjunta permanecem procedimentos manuais.
- **Não automatizados:** iniciar um conflito com gasto público de custo **PENDENTE**, aplicar dano corporal à Vida, transferir Pavor residual por proximidade e distribuir Coragem entre alvos com empates. Não presumir que cliques manuais da reserva pública sejam uma ativação automática.
- **Humanoides [IMPLEMENTADO no editor v0.44]:** rolagem básica própria com Atributo + Conhecimento ou Prática (inclui fontes no grau 0), uso dos símbolos oficiais, seleção dos dados mantidos do Marco, Anulação/Conversão de Antecipar, confirmação e registro do Pavor crítico. Disciplina armada/conjuração exige Perícia habilitadora; o botão informa quando faltar requisito. Efeitos próprios de Perícias, dados extras de equipamento e gastos de Coragem para retenção adicional não são automatizados; não existem bônus gratuitos.
- **Limitação:** o resultado confirmado deve ser registrado pelo Narrador e verificado quanto a pertinência; até aqui não há sincronização da ferramenta web com Actors/combate no cliente Foundry.

## Testes

`node --test criar-conflito/rules.test.mjs criar-conflito/roll-engine.test.mjs foundry-prototype/tests/rules.test.mjs` para cálculos.

`node .github/tests/conflito-e2e.cjs`, `node .github/tests/conflito-rolagens-e2e.cjs` e `node .github/tests/conflito-humanoides-e2e.cjs` para os fluxos reais em navegador Playwright/Chromium. Requer servidor local na raiz do repositório e dependência Playwright com Chromium instalado. O workflow `.github/workflows/conflitos-e2e.yml` executa essas verificações e os testes matemáticos automaticamente.

**Importante**: a ferramenta é independente de autenticação; dados ficam no armazenamento do navegador. Exporte JSON antes de limpar o navegador ou compartilhar outro computador.