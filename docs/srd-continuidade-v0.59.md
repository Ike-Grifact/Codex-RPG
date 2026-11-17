---
title: "Codex RPG — SRD de Continuidade v0.59: Origem e Raça na Identidade"
version: "0.59"
system: "Codex RPG"
updated: "2026-11-17"
status: "definido — identidade; playtest experimental de XP mantido"
---

# Codex RPG — SRD de Continuidade v0.59

## 0-AV. Origem é a Raça na criação — 17/11/2026

**DEFINIDO — decisão explícita mais recente do autor:** na **Etapa 1 — Identidade** do Criador de Aprendizes, **Origem** significa a **Linhagem/Raça** do personagem. O seletor das quatro origens jogáveis (**Humano, Lucker de Sangue, Lucker Puro e Runa Espinhos**) deve estar **na posição superior anteriormente ocupada pelo texto “Origem narrativa”**, ao lado de **Conceito / Profissão emergente**.

**A interface não deve pedir duas origens independentes.** Retirar o campo textual de “Origem narrativa” da criação e a seleção racial duplicada na parte inferior. Manter **Nome, Conceito, Origem/Raça, Virtude, Personalidade** e retrato. Os detalhes e elementos raciais condicionais continuam visíveis após a escolha; não remover a explicação de custos ou benefícios de origem. A ficha final também exibe **Origem / Raça** uma única vez.

**Precedência:** esta decisão **substitui apenas** a orientação da [v0.55](srd-continuidade-v0.55.md) segundo a qual o seletor racial deveria ser um campo separado de “Origem” narrativa. O **Conceito** continua sendo livre e narrativo; pode incluir local, história ou cultura se o jogador desejar, sem interferir na Raça escolhida.

**Compatibilidade [DEFINIDO]:** preservar, na leitura de fichas JSON antigas, o valor textual legado `origin` (se existente) sem convertê-lo automaticamente em raça nem apagar a informação importada. A raça mecânica continua registrada na chave `race`. Não inferir raça de texto narrativo.

**Sem alterações mecânicas:** benefícios das quatro linhagens, faixas de XP raciais, requisitos, custos, graus e progressão não mudam. O nível 1 continua em **18 XP iniciais compartilhados [EXPERIMENTAL]** pelo [SRD v0.58](srd-continuidade-v0.58.md), com referência de **260 XP totais** no nível 20.

**PENDENTE:** apenas eventuais ajustes visuais após testar a interface no computador e no celular; esta decisão não altera a criação matemática.
