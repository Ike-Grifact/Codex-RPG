---
title: "Codex RPG — SRD de Continuidade v0.87: Manejo Perfeito unificado"
version: "0.87"
system: "Codex RPG"
updated: "2026-11-21"
status: "DEFINIDO / PENDENTE"
supersedes: "docs/srd-continuidade-v0.86.md, apenas na identificação, disponibilidade e atribuição dos efeitos de Arma Certa e Manejo Perfeito"
---

# Codex RPG — SRD de Continuidade v0.87

## Correção autoral — 21/11/2026

**DEFINIDO:** **Manejo Perfeito — Armas Corpo a Corpo** é o nome único e correto da Perícia anteriormente duplicada como **Arma Certa**. **Arma Certa deixa de existir como Perícia independente.** As versões históricas do SRD não são apagadas; este documento prevalece onde houver divergência.

### Manejo Perfeito — Armas Corpo a Corpo (DEFINIDO)

- **Custo de aquisição:** **1 XP**.
- **Requisitos:** **Disciplina Avançada + Destreza 2** (Disciplina Avançada adquirida; Destreza no Grau 2 ou superior).
- **Descrição:** ao utilizar a arma correta contra o oponente que possui **Desvantagem contra ela**, aplica **Vantagem Absoluta**.
- **Escalonamento:** se a ação **já estiver em Vantagem Absoluta**, aplica **Golpe Certo**.
- **Comparação com a afinidade natural:** a Vantagem Absoluta (+1E) de Manejo Perfeito substitui o +1A natural do **mesmo** confronto favorável; não conceder os dois bônus por um único gatilho. Em caso de Vantagem Absoluta preexistente, registrar Golpe Certo sem aplicar uma segunda Vantagem Absoluta por essa Perícia.
- **Limites conservados:** manter a matriz já existente de afinidade entre peso da arma e oponente/Balanço, os efeitos de armadura e Pavor, as rolagens e os requisitos de armas. Não acrescentar dados, dano, recursos nem multiplicar os efeitos.

**PENDENTE:** procedimento mecânico exato de **Golpe Certo** (efeito, dano, recursos e eventuais interações). Seu gatilho é DEFINIDO, mas não há efeito numérico automático até decisão explícita.

## Substituições e compatibilidade com fichas

- **REVOGADO da v0.86:** a separação das duas perícias, a descrição de Manejo Perfeito como efeito próprio desconhecido e a aprovação de Arma Certa como segunda compra independente.
- **DEFINIDO:** uma única compra de **Manejo Perfeito (1 XP)**. No criador e no Codex Genético manter somente `manejo-perfeito` no catálogo, mapa e requisitos. O ID `arma-certa` deixa de ser uma opção de compra.
- **Migração automática:** fichas salvas ou importadas com `arma-certa` devem converter esse ID em `manejo-perfeito`, preservando a compra e o saldo. Se ambos os IDs vierem em uma mesma ficha, manter **uma única** Perícia sem dupla cobrança. Não migrar ou reescrever registros históricos de rolagens.
- **Links históricos:** o endereço antigo `pericias/maestria-arma-certa.html` pode permanecer como aviso de nomenclatura/ligação para o verbete de Manejo Perfeito, mas não deve oferecer uma Perícia distinta.
- **Validação:** regressão de compra, requisitos, Vantagem Absoluta, gatilho de Golpe Certo, migração/deduplicação e ausência do ID legado nos catálogos.

Outras regras, custos e procedimentos do SRD v0.86 não foram alterados.