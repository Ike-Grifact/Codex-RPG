# Criar Conflito — Codex RPG (prévia)

Área de preparação de encontros em `criar-conflito/`. Ferramenta web experimental em `criar-conflito/`, incorporada ao portal na revisão v0.44. A transferência de humanoides comuns pelo Codex Genético está implementada.

## Três tipos de ameaça — decisão autoral de 15/11/2026

| Tipo novo | Atributos — XP acumulado G0–G6 | Conhecimentos/Práticas | Perícias |
|---|---|---|---|
| **Humanoide** | 0 / 1 / 3 / 7 / 15 / 31 / 55 | 0 / 2 / 8 / 20 / 38 / 66 / 102 | Sim, por seus custos próprios |
| **Criatura/Monstro** | 0 / 2 / 8 / 20 / 38 / 66 / 102 | Não participam da compra normal deste tipo | Não |
| **Humanoide Monstro** | 0 / 2 / 8 / 20 / 38 / 66 / 102 | 0 / 2 / 8 / 20 / 38 / 66 / 102 | Sim, por seus custos próprios |

**DEFINIDO:** a seleção para novas ameaças contém exatamente os três tipos acima. Humanoide comum recebe os **20 XP iniciais experimentais** da Ficha; para os dois tipos de monstro o orçamento de XP é inserido pelo Narrador, pois não foi definido outro valor inicial. O nível, os graus e o orçamento não atribuem recompensas automaticamente.

**IMPLEMENTAÇÃO / PENDENTE:** até definição de escala própria, o Humanoide Monstro rola uma Base (Conhecimento ou Prática) + Atributo com os dados e retenção humanoides já existentes; sua tabela monstruosa altera o **custo da compra**, não inventa automaticamente novos dados nem outro custo de Coragem/Pavor. Criatura/Monstro mantém as faces monstruosas anteriores. A edição de Perícias do Humanoide Monstro preserva requisitos e XP.

**Fichas históricas:** o identificador `criatura` (animal comum da versão anterior) continua aceito na importação/localStorage, sem conversão silenciosa de dados ou XP. Não aparece entre as três escolhas para criar uma nova ameaça.

**Perito Conjurador [REVOGADO pelo autor em 15/11/2026]:** não consta entre as Perícias, não habilita a terceira fonte e novas compras são bloqueadas. Fichas antigas com o identificador peritoconj são normalizadas sem ele; o custo histórico de 2 XP deixa de ser debitado, preservando o saldo para redistribuição.


Múltiplas fichas no mesmo encontro, duplicação, liderança, Vida atual/máxima, DE, Pavor local e reserva pública, planejamento de dados mantidos, texto de capacidades, inventário, notas, salvamento local e importação/exportação em JSON.

- **Pavor local [DEFINIDO — v0.41]**: inicia cheio por novo confronto, com G1 4P, G2 5P, G3 6P, G4 7P, G5–G6 8P; não é dado gratuitamente novamente a cada rodada.
- **Pavor público**: teto `2 + número de jogadores`; começa com 2P. Ajuste manual e independente das fichas.
- **Mantidos**: base 2. Monstros não humanoides de graus 1–4 podem manter até 3; graus 5–6 até 4, **1P local por dado adicional** conforme capacidades. A quantidade selecionada é uma preparação, não um ataque automático nem um desconto imediato.
- **Cálculos**: Vida monstruosa `3 + Vigor + ⌊Força/2⌋` (exceção pequena PENDENTE) e DE monstruosa `Agilidade + ⌊Destreza/2⌋` (teto 9). Humanoides usam a defesa de personagens.
- **Carga**: peso convencional em unidades Alto; números alternativos de itens Leves, Médios ou Pesados que ainda cabem. Aviso explícito na inclusão além da capacidade; consequência mecânica ainda PENDENTE.

**PENDENTE**: orçamento máximo monstruoso por Grau, procedimentos da ficha de animais pequenos, requisitos avançados de Perícias (verificar SRD antes da sessão), tabelas de recompensa e graduação do desafio, alocação automática de Pavor entre inimigos e Narrador. O sistema não preenche essas lacunas arbitrariamente.

## Criação de humanoides integrada ao Codex Genético

Em **Criar Conflito**, o botão **+ NPC básico imediato** cria um humanoide de forma rápida com os investimentos mínimos de criação e permite editar graus, Perícias e itens no painel da ameaça.

**IMPLEMENTADO (interface experimental de playtest):** o botão **Criar humano comum pelo DNA** abre `prototipo-ficha/?npc=1`, com o Codex Genético e salvamento separado da Ficha de jogador. Use **Enviar NPC ao Conflito** para transferir Atributos, Conhecimentos, Práticas, Perícias, nível, XP e recursos básicos. Equipamentos continuam manuais no conflito, assim como efeitos não automatizados.

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

`node .github/tests/conflito-e2e.cjs`, `node .github/tests/conflito-rolagens-e2e.cjs`, `node .github/tests/conflito-humanoides-e2e.cjs` e `node .github/tests/conflito-playtest-historico-e2e.cjs` para os fluxos reais em navegador Playwright/Chromium. Requer servidor local na raiz do repositório e dependência Playwright com Chromium instalado. O workflow `.github/workflows/conflitos-e2e.yml` executa essas verificações e os testes matemáticos automaticamente.

**Importante**: a ferramenta é independente de autenticação; dados ficam no armazenamento do navegador. Exporte JSON antes de limpar o navegador ou compartilhar outro computador.
## Ficha de conflito: edição e rolagem (15/11/2026)

- **Modo Edição:** ficha, capacidades e graus, Perícias, recursos, equipamentos e Integridade. O modo **Rolagem** apresenta fontes clicáveis; basta escolher uma Base (Conhecimento/Prática) e Atributo para humanoides, ou dois Atributos para criaturas/monstros. Os seletores abaixo permitem ajustes e conferência de pertinência.
- **Elevar dado [DEFINIDO v0.40]:** escolher ANTES de rolar um dado elegível (d4→d6→d10→d12). Em humanoides: 1 Coragem, debitada ao confirmar; em monstros extraordinários: 1P local sob capacidade e aprovação do Narrador. Não há d12→d20 automático.
- **Retenção [DEFINIDO]:** humanoide nível 1–5 mantém 2 normalmente ou 3 por 1 Coragem; nível 6+ mantém 3 ou 4 por 1 Coragem. Monstros preservam a retenção própria e gasto de Pavor local. Nenhum recurso é gasto durante a prévia.
- **Terceira fonte:** exige Perícia/capacidade válida e confirmação do Narrador; clicar na seleção não concede Perícias nem fontes adicionais.
- **Histórico de playtests:** até 300 rolagens confirmadas em armazenamento local, com data, fontes, DE, dados rolados/mantidos, E/A/P, crítico, dano básico e recursos gastos. Faz parte do JSON de conflito existente; CSV exportável. Dano e consequências sobre alvos continuam manuais.
- **Integridade:** armaduras e escudos do catálogo G1 mostram valor atual/máximo, com ajustes manuais e persistência. Armaduras G1 Leve 7, Média 12, Pesada 17, Muito Leve 0; graus não documentados permanecem PENDENTES.

A ferramenta web continua experimental quanto ao fluxo e a recursos opcionais de playtest. Nenhuma das regras deste módulo substitui o SRD v0.44.


### Rolador lado a lado
Na aba **Rolagem**, fontes com SVGs aparecem à esquerda; Armas, Elementos, Perícias compradas e controles de rolagem ficam à direita. A escolha de uma ação registra seu nome, sem conceder benefícios gratuitos; histórico/CSV/JSON guardam a declaração.

**Compatibilidade de Perícias:** a Ficha apresenta Combate (1 XP) e Armas 1 (2 XP), custos já definidos e agora reconhecidos no Conflito para NPCs importados. Perícias de custo ainda PENDENTE não recebem valor nem efeito fictício.
