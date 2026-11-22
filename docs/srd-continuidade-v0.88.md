---
title: "Codex RPG — SRD de Continuidade v0.88: DE base humana substitutiva"
version: "0.88"
system: "Codex RPG"
updated: "2026-11-22"
status: "DEFINIDO / EQUILÍBRIO EXPERIMENTAL"
supersedes: "Fórmula anterior da DE natural para personagens e humanoides; demais decisões de v0.87 e do SRD Playtest Nível 1 v1.0 permanecem"
---

# Codex RPG — SRD de Continuidade v0.88

## Decisão autoral — 22/11/2026: DE base defensiva

**DEFINIDO:** a fórmula anterior de **DE natural de personagens e humanoides** deixa de ser aplicada. Em seu lugar existe um **único cálculo de DE base**, sem somar um valor anterior nem um segundo bônus de DE natural:

**DE base = mínimo(9; 1 + Agilidade + Vigor + ⌊Destreza / 2⌋ + ⌊Atletismo / 3⌋).**

- Agilidade e Vigor contribuem com os respectivos **Graus inteiros**.
- Destreza contribui com metade do Grau, arredondada para baixo.
- Atletismo contribui com um ponto por três Graus completos.
- **1 DE base** é conferido a todos os personagens e humanoides elegíveis, inclusive quem ainda possui esses Graus em 0.
- Aplica-se o teto **9** ao cálculo base. Em seguida, permanecem os modificadores da **única armadura válida equipada**, as Perícias defensivas e a Maestria em Escudos quando aplicável; a **DE defensiva final permanece de 0 a 12**. Não atribuir novamente o ponto base ao aplicar modificadores.
- Aplica-se aos **Aprendizes/personagens**, **NPCs humanoides** e **humanoides monstros** construídos pelo modelo de fontes humanoides, independentemente do lado do conflito.
- **Monstros extraordinários não humanoides** preservam sua fórmula separada **mínimo(9; Agilidade + ⌊Destreza / 2⌋)**, sem Vigor inteiro e sem +1 DE base, até nova decisão explícita.
- **Não alterados:** dados simbólicos, DE de tarefas sem ficha defensiva, investimento de XP, custos, fontes, Vida, Pavor, Coragem, dano, características de armas, defesa de armaduras e escudos, Integridade, retenção de dados e regras de críticos.

### Verificação de substituição (DEFINIDO)

Personagem humanoide com Agilidade 1, Destreza 2, Vigor 3 e Atletismo 3: **DE base = 1 + 1 + 1 + 3 + 1 = 7**. O cálculo anterior seria diferente e **não se soma** a 7. Com armadura Leve (+1), DE final = **8**; com armadura Pesada (−1), DE final = **6**, salvo outras condições/Perícias.

Exemplos do playtest nível 1, já considerando armadura e Maestria em Escudos previamente selecionadas: Samurai **5**, Guerreiro **5**, Mago **5**, Berserker **5**, Tanque com armadura Pesada **5**, Atirador **7**. Valores de fichas específicas, não bônus gerais.

## Estado, riscos e testes

**DEFINIDO:** substituição da fórmula de personagens/humanoides, base fixa de 1 DE, contribuição integral de Vigor, pisos de Destreza e Atletismo e manutenção dos tetos/modificadores anteriores.

**EXPERIMENTAL:** o equilíbrio dessa DE no nível 1 e nos Marcos posteriores, impacto no acerto limpo ou com Pavor, eficiência de ataques com armas/foco e gasto de Coragem. O primeiro confronto 3 × 3 servirá para medir tempo para acertar, custo de oportunidade e durabilidade de escudos/armaduras. Nenhuma outra regra foi ajustada como compensação.

**IMPLEMENTAÇÃO:** unificar a fórmula no criador/ficha, na ferramenta Criar Conflito e no Foundry, respeitando a diferença entre humanoides e monstros não humanoides. Recalcular DE pela ficha atual sem alterar Graus, XP nem registros de ataques históricos. Validar DE com fontes zeradas, Vigor ímpar, teto 9, armaduras, Maestria em Escudos, NPCs humanoides e não humanoides, inclusive em testes de interface.

**Histórico:** substituir apenas a fórmula humana anterior, que continha `⌊Vigor/2⌋` e nenhuma base fixa. A v0.87 (Manejo Perfeito), SRD Playtest Nível 1 v1.0 e demais documentos anteriores permanecem históricos e vigentes nos demais tópicos não revogados.
