---
title: "Codex RPG — SRD de Continuidade v0.90: limiar de 5 Êxitos e resumo de combate"
date: "2026-11-22"
status: "Dano de 5 Êxitos DEFINIDO; ferramenta EXPERIMENTAL; exceções PENDENTES"
previous: "srd-continuidade-v0.89.md"
supersedes: "Parâmetro de 1 Vida para todo ataque físico comum, independentemente da quantidade de Êxitos"
---

# SRD de Continuidade v0.90 — Decisão de 22/11/2026

> **Este documento registra apenas o novo limiar de dano e sua implementação experimental.** Todas as decisões da v0.89 permanecem vigentes; especialmente 15 XP iniciais, DE defensiva, modificadores de armadura, conjuração por Grau e foco sem dado.

## 1. Dano à Vida com 5 Êxitos — DEFINIDO

**Decisão autoral:** **5 Êxitos agora causam 2 pontos de dano à Vida**, para recompensar a manutenção de mais dados.

Para o **ataque físico comum** resolvido no comparador de combate, depois de alcançar a DE:

1. Calcular o dano básico conforme a composição vigente de **Êxitos e Pavor não anulado dos dados mantidos**, preservando efeitos válidos de crítico.
2. Aplicar o dano à **Integridade da proteção** antes da Vida.
3. Se **não houver dano que atravesse a Integridade**, não retirar Vida por esse ataque.
4. Se o dano alcançar a Vida, **5 ou mais Êxitos válidos** retiram **2 Vida**; com menos de 5 Êxitos, conservar **1 Vida** no ataque físico comum.
5. Essa mudança **não** duplica o dano à Integridade, não transforma Pavor em Êxito e **não** eleva o teto de **3 Vida por ataque comum não colossal**.

**Exemplo:** ataque acerta, registra **5E** e produz **5 de dano básico**, contra armadura de Integridade **3**. Perde 3 de Integridade; a parcela restante alcança o corpo e causa 2 de Vida. Se a armadura tivesse Integridade 7, perderia 5 e o corpo perderia **0 Vida**.

**PENDENTE:** como aplicar o patamar nos efeitos extraordinários que já causam dano direto à Vida (incluindo Sangue amplificado, Derreter, perfurações específicas, crítico de 4 mantidos, dano colossal, resistências e conversões especiais). Não acumular automaticamente o novo patamar com dano direto já estabelecido por uma Perícia. O livro e o restante do rolador devem receber harmonização específica após análise, sem inventar interações.

## 2. Resumo de combate sem VTT — EXPERIMENTAL

O painel em **Criar Conflito** permite carregar **cópias** das fichas de personagem salvas no mesmo navegador e comparar rolagens contra a DE do alvo, escolher arma/peso, registrar Integridade e Vida, transferir Pavor local ou reserva pública e distribuir Coragem por falha inimiga com Pavor.

- **DEFINIDO:** dados oficiais, rolador 9/4, Antecipar, limites, reserva pública distinta de Pavor local, defesa vigente da v0.89 e absorção da Integridade antes da Vida.
- **EXPERIMENTAL (interface):** seleção e associação manual de combatentes, aplicação do dano físico comum em operação separada, registro de histórico e estado local do encontro.
- **PENDENTE:** oposições ativas com rolagem defensiva própria, elegibilidade/proximidade entre alvos, magia G1–G4 no comparador, efeitos condicionais de armas, bloqueios e resistências, iniciativa e posicionamento sem VTT.

As operações do comparador **não alteram as fichas originais dos jogadores** e não as sincronizam de volta automaticamente. Ameaças continuam sendo editadas no armazenamento do próprio encontro. A interface não converte ações do Foundry em um combate automático sem validação do Narrador.
