---
title: "Codex RPG — SRD de Continuidade v0.63: limpar escolha inicial ao trocar raça"
version: "0.63"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO — correção de interface e persistência; orçamento EXPERIMENTAL preservado"
---

# Codex RPG — SRD de Continuidade v0.63

## 0-AZ. Não herdar o Atributo inicial de outras origens — 17/11/2026

**DEFINIDO — correção solicitada após playtest:** escolher uma raça diferente durante a criação **não mantém o Atributo selecionado por “Começar com” na raça anterior**, mesmo quando esse Atributo era o Grau 1 gratuito daquela raça. A cada mudança de **Origem / Raça**, o Criador desfaz somente a compra G1 vinculada exclusivamente à escolha inicial anterior (se existente), remove os Graus 1 com concessão racial registrada da antiga origem e aplica **apenas o par gratuito da nova**. Limpa o seletor da escolha inicial, retornando o fluxo à Etapa 1 para nova seleção, sem apagar nome, conceito, identidade, investimentos independentes ou uma evolução manual acima de Grau 1.

Isso corrige a herança indesejada confirmada em imagens do playtest: **Runa Espinhos → Lucker de Sangue não deve deixar Força 1** da antiga raça; **Lucker de Sangue → Lucker Puro não deve deixar Agilidade 1** da antiga raça. Se Força ou Agilidade tiverem sido **compradas separadamente** no Codex Genético ou em listas, as compras legítimas continuam na ficha, com custo recalculado. O sistema não confunde tais compras com concessões automáticas.

**Pares raciais DEFINIDOS, reafirmados pela [v0.62](srd-continuidade-v0.62.md):**

| Raça | Graus iniciais automáticos | Custo |
|---|---|---:|
| Humano | Nenhum | — |
| Lucker de Sangue | Vigor 1 e Agilidade 1 | 0 XP |
| Lucker Puro | Inteligência 1 e Destreza 1 | 0 XP |
| Runa Espinhos | Vigor 1 e Força 1 | 0 XP |

O Codex Genético continua a visualização principal. Não se alteram as tabelas de preços, progressão por grau, custos de Perícias, bônus, pré-requisitos, outras linhagens, rolador ou escolha de equipamentos. **18 XP iniciais compartilhados [EXPERIMENTAL]** permanecem inalterados.

### Fichas antigas com graus residuais [DEFINIDO]

Um **G1 adicional fora do par favorecido** pode ser uma **compra legítima** ou um grau residual salvo por versões anteriores. Como as fichas legadas não registravam todo o histórico da origem da compra, **não é possível apagá-lo automaticamente com segurança**.

Na etapa de identidade, o Criador identifica os **Atributos G1 extras** e oferece a ação **Revisar graus extras**. Essa ação exige confirmação explícita e informa quais Atributos G1 seriam removidos, incluindo o risco de atingir uma compra manual. Nunca remove atributos G2 ou superiores. Se a limpeza invalidar os requisitos de Perícias, ela é bloqueada. O jogador pode cancelar para preservar os investimentos. Fichas existentes não são automaticamente apagadas; recomenda-se exportar JSON antes de uma limpeza.

**PENDENTE:** comparar no playtest fichas antigas com compras independentes e confirmar a clareza do fluxo de troca de raça e da revisão de G1 extras no celular.
