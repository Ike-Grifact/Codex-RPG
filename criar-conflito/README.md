# Criar Conflito — Codex RPG (prévia)

Área de preparação de encontros em `criar-conflito/`. Disponível apenas na branch de teste enquanto o PR #4 estiver em revisão.

## Fichas e regras utilizadas

- **Criatura comum / animal**: Atributos na progressão comum, XP próprio informado pelo Narrador. Não é convertida em monstro extraordinário automaticamente.
- **Monstro extraordinário não humanoide**: Atributos na escala monstruosa de XP acumulado `0/2/8/20/38/66/102`, com dados `d4/d10/2d10/3d10/2d10+d12/d10+2d12/3d12`.
- **Monstro humanoide**: a mesma tabela de XP, Atributos, Conhecimentos, Práticas e Perícias de um personagem. Criação com **20 XP iniciais EXPERIMENTAIS** compartilhados, além do XP extra que o Narrador acrescentar. A compra mínima de um Atributo G1 e um Conhecimento ou Prática G1 continua **DEFINIDA** na criação de personagens.

Múltiplas fichas no mesmo encontro, duplicação, liderança, Vida atual/máxima, DE, Pavor local e reserva pública, planejamento de dados mantidos, texto de capacidades, inventário, notas, salvamento local e importação/exportação em JSON.

- **Pavor local**: limite igual ao grau da ameaça, de 1P a 6P.
- **Pavor público**: teto `2 + número de jogadores`; começa com 2P. Ajuste manual e independente das fichas.
- **Mantidos**: base 2. Monstros não humanoides de graus 1–4 podem manter até 3; graus 5–6 até 4, **1P local por dado adicional** conforme capacidades. A quantidade selecionada é uma preparação, não um ataque automático nem um desconto imediato.
- **Cálculos**: Vida monstruosa `3 + Vigor + ⌊Força/2⌋` (exceção pequena PENDENTE) e DE monstruosa `Agilidade + ⌊Destreza/2⌋` (teto 9). Humanoides usam a defesa de personagens.
- **Carga**: peso convencional em unidades Alto; números alternativos de itens Leves, Médios ou Pesados que ainda cabem. Aviso explícito na inclusão além da capacidade; consequência mecânica ainda PENDENTE.

**PENDENTE**: orçamento máximo monstruoso por Grau, procedimentos da ficha de animais pequenos, requisitos avançados de Perícias (verificar SRD antes da sessão), tabelas de recompensa e graduação do desafio, alocação automática de Pavor entre inimigos e Narrador. O sistema não preenche essas lacunas arbitrariamente.

## Testes

`node --test criar-conflito/rules.test.mjs foundry-prototype/tests/rules.test.mjs` para cálculos.

`node .github/tests/conflito-e2e.cjs` para o fluxo real em navegador Playwright/Chromium. Requer servidor local na raiz do repositório e dependência Playwright com Chromium instalado. O workflow `.github/workflows/criador-e2e.yml` faz a preparação automaticamente.

**Importante**: a ferramenta é independente de autenticação; dados ficam no armazenamento do navegador. Exporte JSON antes de limpar o navegador ou compartilhar outro computador.