---
title: "Codex RPG — SRD de Continuidade v0.62: correção de Atributos raciais e seleção inicial"
version: "0.62"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO — correção autoral das origens; orçamento de XP ainda EXPERIMENTAL"
---

# Codex RPG — SRD de Continuidade v0.62

## 0-AY. Lucker Puro: Inteligência e Destreza; impedir acúmulos raciais incorretos — 17/11/2026

**DEFINIDO — decisão explícita mais recente do autor:** a linhagem **Lucker Puro** tem **Inteligência e Destreza** como seus dois Atributos favorecidos, e não Inteligência e Influência. Essa correção **substitui expressamente a célula de Lucker Puro da tabela racial na [v0.56](srd-continuidade-v0.56.md)** e o par automático informado na [v0.61](srd-continuidade-v0.61.md). **Influência volta ao custo normal para Lucker Puro**, sem Grau gratuito. A desvantagem de **Força e Atletismo** dessa linhagem permanece na faixa elevada; nenhum outro custo foi alterado.

### Pares raciais válidos na criação [DEFINIDO]

| Origem / Raça | Graus 1 concedidos automaticamente | Custo dos dois G1 | Outros Atributos |
|---|---|---:|---|
| **Lucker de Sangue** | **Vigor 1 e Agilidade 1** | 0 XP | Influência elevada; demais normais |
| **Lucker Puro** | **Inteligência 1 e Destreza 1** | 0 XP | Força elevada; Influência normal; demais normais |
| **Runa Espinhos** | **Vigor 1 e Força 1** | 0 XP | Agilidade e Destreza elevadas; demais normais |
| **Humano** | Nenhum Grau automático | — | Todos normais |

**Atenção:** a Prática **Apresentação** continua elevada para Lucker de Sangue; a Prática **Atletismo** continua elevada para Lucker Puro. O único ajuste das faixas raciais da v0.56 é **trocar Influência por Destreza entre os Atributos favorecidos do Lucker Puro**. No Lucker Puro, Destreza G1 custa 0 XP e Destreza G1→G2 custa 2 XP; Influência G1 custa 1 XP e Influência G1→G2 custa 2 XP adicionais (3 XP acumulados no G2). Para outras raças, usar as tabelas vigentes.

### Auditoria do criador e do Codex Genético [DEFINIDO]

- **Somente os dois Graus 1 favorecidos da raça escolhida são automáticos**, nunca os pares das outras raças. Atributos em G1 comprados manualmente permanecem registrados e consomem XP conforme a linhagem vigente; não devem ser confundidos com benefícios gratuitos. Não gerar Graus adicionais ao alternar origens.
- O Codex Genético **identifica visualmente o Grau 1 concedido pela origem** e não permite reduzi-lo abaixo de G1 enquanto essa raça estiver selecionada. Graus superiores, comprados por XP, preservam sua progressão e o custo por faixa.
- Na Etapa 2, **“Começar com” compra imediatamente o G1 do Atributo escolhido**, conforme a v0.61. Entretanto, **se o jogador voltar e escolher outro Atributo inicial, o grau comprado exclusivamente pelo botão anterior é substituído**, não acumulado, desde que não seja um requisito adquirido posteriormente. Compras independentes realizadas no Codex Genético ou nas listas **não são desfeitas** por essa troca.
- **Ao mudar de raça antes de concluir a criação**, remover somente G1 que tenha sido marcado como concessão automática da raça anterior e que não seja mais favorecido, desde que ainda esteja G1 e não tenha sido explicitamente escolhido como Atributo inicial. Preservar compras manuais e graus G2+; recalcular todos os custos. Se a mudança gerar XP insuficiente ou Perícias inválidas, a troca é negada sem perder a ficha antiga.

### Compatibilidade de fichas v0.61 [DEFINIDO]

Para um **Lucker Puro** salvo na v0.61 com `racialInitialAttributes` identificando **Influência** como G1 de origem, corrigir esse **benefício comprovadamente indevido**: conceder Destreza G1 e retirar Influência somente se ela estiver **exatamente em G1** e identificada como concessão racial. Se Influência já estiver no G2 ou mais alto, **preservar o avanço manual**, agora com custo normal. Se a Influência G1 não tiver marcador de concessão racial, **preservá-la como compra**, sem convertê-la automaticamente. A correção não se aplica genericamente a todas as fichas antigas e não apaga Atributos comprados voluntariamente.

O jogador pode ainda ter outros Atributos G1 no mapa, pois **eles podem ser compras legítimas**, não concessões de outras raças. O orçamento permanece **18 XP iniciais compartilhados [EXPERIMENTAL]** e a referência total do nível 20 permanece **260 XP [EXPERIMENTAL]**. Continua obrigatório possuir ao menos um Conhecimento **OU** uma Prática G1; os Graus de origem cumprem a exigência inicial de Atributo.

**PENDENTE:** aferir no playtest o efeito dos pares raciais corrigidos no equilíbrio relativo. **Não** rebalancear o valor total de XP nem alterar custos adicionais sem decisão autoral.
