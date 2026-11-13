# Criar Conflito — Codex RPG (prévia)

Área de preparação de encontros em `criar-conflito/`. Disponível apenas na branch de teste enquanto o PR #4 estiver em revisão.

## Fichas e regras utilizadas

- **Criatura comum / animal**: Atributos na progressão comum, XP próprio informado pelo Narrador. Não é convertida em monstro extraordinário automaticamente.
- **Monstro extraordinário não humanoide**: Atributos na escala monstruosa de XP acumulado `0/2/8/20/38/66/102`, com dados `d4/d10/2d10/3d10/2d10+d12/d10+2d12/3d12`.
- **Humanoide comum / NPC**: a mesma tabela de XP, Atributos, Conhecimentos, Práticas e Perícias de um personagem. Criação com **20 XP iniciais EXPERIMENTAIS** compartilhados, além do XP extra que o Narrador acrescentar. A compra mínima de um Atributo G1 e um Conhecimento ou Prática G1 continua **DEFINIDA** na criação de personagens.

Múltiplas fichas no mesmo encontro, duplicação, liderança, Vida atual/máxima, DE, Pavor local e reserva pública, planejamento de dados mantidos, texto de capacidades, inventário, notas, salvamento local e importação/exportação em JSON.

- **Pavor local**: limite igual ao grau da ameaça, de 1P a 6P.
- **Pavor público**: teto `2 + número de jogadores`; começa com 2P. Ajuste manual e independente das fichas.
- **Mantidos**: base 2. Monstros não humanoides de graus 1–4 podem manter até 3; graus 5–6 até 4, **1P local por dado adicional** conforme capacidades. A quantidade selecionada é uma preparação, não um ataque automático nem um desconto imediato.
- **Cálculos**: Vida monstruosa `3 + Vigor + ⌊Força/2⌋` (exceção pequena PENDENTE) e DE monstruosa `Agilidade + ⌊Destreza/2⌋` (teto 9). Humanoides usam a defesa de personagens.
- **Carga**: peso convencional em unidades Alto; números alternativos de itens Leves, Médios ou Pesados que ainda cabem. Aviso explícito na inclusão além da capacidade; consequência mecânica ainda PENDENTE.

**PENDENTE**: orçamento máximo monstruoso por Grau, procedimentos da ficha de animais pequenos, requisitos avançados de Perícias (verificar SRD antes da sessão), tabelas de recompensa e graduação do desafio, alocação automática de Pavor entre inimigos e Narrador. O sistema não preenche essas lacunas arbitrariamente.

## Criação rápida de humanoides pelo Codex Genético

Em **Criar Conflito**, use **+ Humano comum no DNA** para abrir `prototipo-ficha/?modo=humanoide-rapido` diretamente na etapa de distribuição de XP, com o Codex Genético ativo. O fluxo é independente da criação guiada de jogadores e usa outras chaves de armazenamento local, evitando substituir a ficha de Aprendiz.

- Formação inicial de conveniência: Força G1 + Disciplina G1 (3 XP). O Narrador pode redistribuir os graus; o requisito mínimo definido continua obrigatório.
- Orçamento: 20 XP iniciais compartilhados (EXPERIMENTAL), com campo opcional de XP adicional concedido pelo Narrador.
- Nós **roxos**: clicando na bolinha da Perícia, o inspector permite comprar a Perícia e todos os requisitos num pacote. Os graus, os custos e as Perícias intermediárias são apresentados para confirmação; nenhuma compra é feita automaticamente pelo clique.
- **Adicionar ao conflito** transfere a build, os graus e as Perícias para a lista de humanoides do encontro. O pacote é consumido uma vez para evitar duplicação ao recarregar.
- **+ Humano básico imediato** permanece disponível, sem abrir o mapa, para adicionar um oponente simples. A edição normal no painel do conflito continua possível.
- O modo rápido cria um humanoide com as regras humanas. Não muda o tipo para monstro extraordinário nem concede habilidades gratuitas.

A área do DNA e a área de conflitos precisam estar sob a **mesma origem** (host e porta) para que o envio via armazenamento local funcione. O modo rápido funciona independentemente do sistema Foundry e não instala Actors diretamente no mundo.

## Testes

`node --test criar-conflito/rules.test.mjs foundry-prototype/tests/rules.test.mjs` para cálculos.

`node .github/tests/conflito-e2e.cjs` e `node .github/tests/humanoide-rapido-e2e.cjs` para os fluxos reais em navegador Playwright/Chromium. Requer servidor local na raiz do repositório e dependência Playwright com Chromium instalado. O workflow `.github/workflows/criador-e2e.yml` faz a preparação automaticamente.

**Importante**: a ferramenta é independente de autenticação; dados ficam no armazenamento do navegador. Exporte JSON antes de limpar o navegador ou compartilhar outro computador.