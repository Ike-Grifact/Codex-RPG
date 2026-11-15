# Simulador de Combate (VTT de playtest)

**Status: EXPERIMENTAL** — ferramenta de ensaio de combate, não implementação normativa de iniciativa, cobertura, dano corporal ou absorção do Escudo Arcano.

**Acesso:** \`simulador-combate/\` no GitHub Pages, vinculado aos menus do portal e do Criar Conflito.

## Fluxo

1. **Carregar confronto 3×3:** Mago com armadura Muito Leve, Guerreiro, Tank; Lobo ágil, Atirador e Lobo pesado G2. Ou **Importar fichas deste navegador** para adicionar a Ficha do jogador (\`codex-html-ficha-prototipo-v1\`) e o plantel de ameaças (\`codex-rpg-criar-conflito-v1\`). Também aceita JSON de Ficha, Criar Conflito ou playtest.
2. **Selecionar combatente e alvo** clicando nas fichas ou nos tokens. Ver distância em metros, parede que obstrui a linha de visão e cobertura parcial que precisa de arbitragem do Narrador.
3. **Mover** clicando num espaço vazio. O deslocamento é calculado por 8 + AGI + piso(Atletismo/3), com contagem de casas não diagonais e paredes intransponíveis no cenário experimental. **O mapa usa 1 célula = 1 m apenas para medição visual**; não canoniza a regra de diagonais, uma nova economia de ações nem ataques de oportunidade.
4. **Escolher fontes** de Prática ou Conhecimento + Atributo (humanoide) ou dois Atributos (Criatura/Monstro), incluindo modo Disciplina. A ação se baseia em \`composeActionPool\`, \`rollCreatureFaces\`, \`previewHumanoidRoll\`, \`previewCreatureRoll\` e \`resolveRoll\` do Criar Conflito.
5. **Marcar dados a manter, usar Antecipar e confirmar**. Há sugestão tática priorizando acertos sem Pavor, com limite de retenção e recursos do próprio motor. A terceira fonte pode ser selecionada com pertinência aprovada pelo Narrador; o dado de arma equipada entra somente quando a ficha possui a Perícia habilitadora correspondente (espada, revólver e demais armas cadastradas). A sugestão **não** automatiza efeitos condicionais de Perícias ou gastos de ativação.
6. **Esquiva:** Muito Leve +2 DE, Leve +1 DE **somente quando alvo declarou esquiva**, sem adicionar bônus de armadura a todos os testes. Armadura Muito Leve tem **0 Integridade**. Penalidades de armaduras Pesada e Muito Pesada respeitam a fórmula atual.
7. **Magia:** Grau 2 é padrão, ataque mágico pode causar dano; reduzir para Grau 1 mantém somente efeitos, sem dano à Vida ou Integridade. Decisão autoral de 15/11/2026; aplica-se o grau ao dano potencial da rolagem e não à composição das fontes.
8. **Escudo Arcano:** use **Rolar Escudo Arcano em si** para conjurar pelo motor oficial, registrar E+P como DE de ruptura e indicar uma área circular visual aproximada de 3×3 m por uma rodada; confirme custo de PP/Coragem manualmente. Há também **Declarar Escudo Arcano** para registrar uma resolução manual já feita. **Não** criar bônus de esquiva, Integridade numérica, imunidade física ou proteção balística automática. O SRD identifica relação DE/Integridade como PENDENTE e proteção contra ataques elementais com regras próprias.
9. **Aplicar recursos manualmente** ao alvo após a rolagem (Integridade, Vida, Coragem, Pavor local) e exportar histórico CSV ou JSON completo do cenário.

## Status das fontes

- **DEFINIDO:** dados oficiais, fontes, XP, limite geral 9/4, limites por Grau de ameaça, movimento em metros, bonificação de DE de esquiva por armadura Muito Leve/Leve, Escudo Arcano de 1 rodada, custos/habilitações publicados.
- **EXPERIMENTAL:** grade de 1 metro, percurso ortogonal, escolha tática sugerida, posicionamento do confronto exemplo, e representação gráfica da cobertura.
- **PENDENTE:** modificador numérico de cobertura parcial, geometria exata de áreas, alcance de cada magia e ataques especiais, iniciativa formal, procedimento integral de dano à Vida, custo detalhado de ativação/recarga interativos, bônus de equipamentos não verificados, como os sucessos rompem/absorvem a Integridade de Escudo Arcano.
- **EXPLICITAMENTE NÃO IMPLEMENTADO:** ataques/monstros autônomos, efeitos de área e condição automática, dano à Vida automático, conceder cobertura +DE sem decisão, escudo bloqueando tiros sem confirmação.

A operação **não altera fichas originais salvas**: importa cópias para a chave isolada \`codex-rpg-simulador-tatico-v1\`. Todas as operações persistem neste navegador. O histórico não é telemetria remota.

## Testes

- \`node --test simulador-combate/logic.test.mjs\`: distância, bloqueio de visada, paredes e cobertura, movimentação, esquiva e saneamento do terreno.
- \`node .github/tests/simulador-tatico-e2e.cjs\`: interface, preset 3×3, alcance, obstáculos, rolagens G1, recurso/escudo manual, histórico, e largura mobile.

## Decisões a tomar antes de automatizar combate

1. Relação física entre a DE de ruptura do Escudo Arcano e Integridade/dano, especialmente disparos não elementais.
2. Bônus/Desvantagem de cobertura e ação de defesa, com gasto de oportunidades e distância.
3. Permissão e custo de mover + atacar na mesma oportunidade, diagonais e terreno difícil.
4. Consequência corporal exata do dano líquido de Integridade e requisitos de ataque de arma/foco.
5. Pontos de partida, obstáculos, alcance e recarga de magias para os playtests reproduzíveis.
