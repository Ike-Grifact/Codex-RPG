---
title: "Codex RPG — SRD de Continuidade v0.65: ajuste de VT em armas de característica única"
version: "0.65"
system: "Codex RPG"
updated: "2026-11-17"
status: "EXPERIMENTAL — valores de troca G1 para playtest; sem alteração de regras de combate"
---

# Codex RPG — SRD de Continuidade v0.65

## 0-BB. Desconto em armas G1 de característica única — 17/11/2026

**DEFINIDO — direção solicitada pelo autor:** armas com apenas uma característica não devem custar o mesmo que equipamentos equivalentes em categoria e dados que oferecem mais opções de efeito sem contrapartida relevante. Exemplo: a **Espada Larga** (Média, d10, somente Cortante) não deve custar os mesmos 5 VT da **Espada Longa** (Média, d10, Cortante + Perfurante). **Nota de nomenclatura:** o exemplo descrito como "espada curva" não consta com esse nome no catálogo atual; a entrada comparável existente é "Espada Larga". Não houve renomeação de item.

**EXPERIMENTAL — nova precificação de playtest**, substituindo somente os preços abaixo do catálogo G1 (até então PROPOSTOS):

| Item | Categoria | Característica | VT anterior | VT para playtest |
|---|---|---|---:|---:|
| Espada Curta | Leve, d6 | Cortante | 3 | **2** |
| Maça Curta | Leve, d6 | Contundente | 3 | **2** |
| Chicote | Leve, d6 | Enganchar | 3 | **2** |
| Espada Larga | Média, d10 | Cortante | 5 | **4** |
| Lança de Arremesso | Média, d10 | Cravar | 5 | **4** |
| Martelo de Guerra | Pesada, d12 | Perfurante | 8 | **7** |

### Critério limitado para este teste

- **EXPERIMENTAL:** arma de corpo a corpo G1 com uma característica e alcance de 1 m não deve superar **2 VT (Leve), 4 VT (Média) ou 7 VT (Pesada)**, considerando os itens já disponíveis; isso **não é uma nova fórmula universal de preços**.
- **Preservado:** Faca e Punhal continuam 2 VT; Marreta permanece 7 VT, pois já custa menos do que outras armas Pesadas.
- **Preservado:** Espada Longa (5 VT; duas características), Lança (5 VT; Longa e Perfurante), Machado Barbado (6 VT; duas características), Machado de Guerra (8 VT; duas características) e Montante (9 VT; três características) mantêm os respectivos preços.
- **EXCEÇÃO DELIBERADA:** arcos, bestas, zarabatana e armas de fogo têm alcance, operação e outras vantagens/restrições próprias; a propriedade «À Distância» não deve ser avaliada apenas como uma característica de combate corpo a corpo. Nenhum preço dessas armas foi alterado. A Lança de Arremesso foi incluída expressamente neste teste, com alcance original de 8 m preservado.
- **FORA DO ESCOPO:** escudos, armaduras, focos e armas cujos preços estavam **PENDENTES** mantêm seus valores/pendências. Não foram inventados preços de cajados, bastões ou focos.

**Integridade dos dados:** somente os seis campos `priceVT` listados foram alterados em `prototipo-ficha/catalog.js` e `foundry-prototype/module/catalog.mjs`; dados, peso, alcance, características, requisitos, efeitos e saldo inicial de **20 VT (EXPERIMENTAL)** continuam iguais. Nos **32 itens compartilhados**, o catálogo do site e o catálogo do Foundry devem concordar; o site conserva **11 itens adicionais** que ainda não constam no Foundry. **Compras antigas:** fichas já salvas mantêm os preços efetivamente pagos e seus registros históricos; o desconto se aplica a novas compras, sem reembolso automático.

**PENDENTE:** validar equilíbrio em playtest comparando a utilidade da característica com alcance, porte e requisitos, principalmente Lança de Arremesso, Chicote e Perfurante; homologar a tabela final de VT e eventual regra para graus superiores. Esta v0.65 não torna preços experimentais definitivos.
