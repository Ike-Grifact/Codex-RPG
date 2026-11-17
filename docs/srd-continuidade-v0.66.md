---
title: "Codex RPG — SRD de Continuidade v0.66: DE geral das armaduras e teto 12"
version: "0.66"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO — modificador geral das armaduras e teto defensivo 12; Integridades inalteradas"
---

# Codex RPG — SRD de Continuidade v0.66

## 0-BC. Bônus e penalidades de armadura para **todas** as defesas — 17/11/2026

**DEFINIDO — decisão explícita do autor de 17/11/2026.** As armaduras equipadas alteram a **DE defensiva total do personagem contra qualquer ataque**. Não há restrição dos bônus de armadura Leve e Muito Leve apenas à postura de esquiva. O **teto absoluto de DE defensiva total é 12**.

Esta decisão **substitui** especificamente o trecho anterior do Livro do Jogador, capítulo “Armaduras: cinco tipos independentes do Grau”, que dizia que o bônus da armadura Leve e Muito Leve só valia para esquiva. Não substitui o cálculo da DE natural, a Integridade, os requisitos de uso, as resistências ou os preços.

| Armadura equipada | Modificador geral de DE | Estado |
|---|---:|---|
| Muito Leve | **+2** | DEFINIDO |
| Leve | **+1** | DEFINIDO |
| Média | **0** | DEFINIDO |
| Pesada | **−1** | DEFINIDO |
| Muito Pesada | **−2** | DEFINIDO |

### Cálculo

1. Calcular **DE natural = min(9, Agilidade + ⌊Destreza / 2⌋ + ⌊Vigor / 2⌋ + ⌊Atletismo / 3⌋)** para personagens que seguem esta fórmula. A regra própria de criaturas não humanoides continua onde se aplicar.
2. Aplicar **uma vez** o modificador da armadura efetivamente equipada e permitida. Não empilhar várias armaduras; a ficha de jogador admite somente uma armadura equipada.
3. Aplicar **DE defensiva final = min(12, max(0, DE natural + modificador da armadura))**.
4. Usar essa DE final em **todas as defesas**. **Esquivar não soma novamente** o bônus da armadura. A Integridade material é recurso separado.

**Exemplo da correção solicitada:** DE natural 1 com **Armadura Leve** equipada (Integridade 7/7) resulta em **DE defensiva 2**. Ao desequipar a armadura, retorna à **DE 1**, independentemente do valor de Integridade registrado.

**Teto:** natural **9**; após modificadores de armadura e outros efeitos legalmente aplicáveis ao cálculo, **máximo 12**. A tabela vigente de armaduras chega a 11 a partir da DE natural 9 com Muito Leve +2; o teto 12 também protege contra combinações futuras, sem concedê-las.

### Implementação e compatibilidade

- **DEFINIDO e implementado:** `prototipo-ficha/app.js` usa a DE total no painel vital, no resumo e na revisão do criador; `foundry-prototype/module/equipment-logic.mjs` e `simulador-combate/logic.mjs` aplicam o mesmo modificador geral e teto.
- **Sem alterações:** fichas existentes, compras, XP, VT, carga, dados, Graduação/Graus das armaduras, Integridade 7/12/17 do catálogo G1, propriedades de resistência e limites de equipar.
- **Histórico preservado:** SRD v0.65 permanece responsável apenas pela revisão experimental de VT de armas. A presente v0.66 é uma decisão normativa posterior.
- **EXPERIMENTAL preservado:** valores quantitativos de Integridade e preços de catálogo ainda dependem de playtest.
- **PENDENTE:** método de adicionar outras fontes de DE caso sejam aprovadas e regras para sobreposição excepcional de armaduras. Nenhuma dessas possibilidades foi concedida automaticamente.

