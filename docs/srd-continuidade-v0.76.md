---
title: "Codex RPG — SRD de Continuidade v0.76: Fogo G2 Queimar e Fogo G3 Derreter"
version: "0.76"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO — G2 Queimar danifica Integridade com 1 por Pavor; G3 Derreter danifica armadura e causa 1 Vida direta"
---

# Codex RPG — SRD de Continuidade v0.76

## 0-BP. Fogo: Queimar e Derreter — decisão autoral em 17/11/2026

### Fogo G1 — preservado [DEFINIDO]

**Disparo de Fogo** acerta e causa dano convencional à proteção, conforme as regras vigentes. Não acrescenta queimadura direta à Vida. Iluminar e conduzir chamas, com fonte de chama/faísca, e os demais requisitos do Grau 1 permanecem inalterados.

### Fogo G2 — Queimar [DEFINIDO]

A propriedade **Queimar**, disponível com a habilitação de Fogo **Grau 2**, usa o princípio de **Perfurante contra a Integridade da armadura**, mas com identidade de Fogo.

- Em **acerto**, cada **Pavor (P) mantido e não anulado** vale **1 ponto de dano à Integridade**, **substituindo**, não somando, o efeito convencional `⌊P/2⌋` desse mesmo Pavor.
- Portanto, o dano **potencial contra a Integridade** da armadura é **E válidos + P não anulado** (antes de modificadores/críticos vigentes). É o mesmo princípio numérico de Perfurante físico, **mas não concede a propriedade Perfurante física**, nem passa a ser anulado pelos mesmos escudos anti-Perfurante por presunção.
- Queimar **não acrescenta dano direto à Vida**: caso exista excedente convencional após acabar a Integridade, resolver pelo fluxo defensivo normal, sem fingir que o ataque ignora armadura.
- **Falha na DE** não desgasta armadura nem causa dano à Vida pela propriedade.
- Preservada a área **4 × 4**, escolhendo **cone, linha ou círculo**.
- Preservado o custo conhecido: efeitos elementais seguem sua habilitação e custo-base vigente; com **Criar Item de Foco e Magia + foco válido do elemento Fogo + Perícia em Elemento Fogo** o efeito já habilitado pode ter ativação-base gratuita. **Sem foco**, a invocação de fogo inexistente na cena, quando usada no G2, exige **1 Coragem ADICIONAL** à ativação-base: **1 PP + 1 Coragem** ou **2 Coragens**. Não transformar o adicional em custo universal de Queimar se a chama já existe.

### Fogo G3 — Derreter [DEFINIDO]

Em ataque de **Fogo Grau 3** habilitado que acerte, **Derreter** causa:

1. **Dano à Integridade da armadura** no mesmo cálculo de **Queimar**: `E + P` (antes de crítico/modificadores legítimos);
2. **Exatamente 1 ponto direto de dano à Vida** do alvo, **além do dano à Integridade**, e não o dano integral da magia à Vida.

O ponto adicional direto à Vida é **fixo**, não vira `E+P`, não aumenta para `1 por Pavor` e **não é multiplicado pelo crítico** sem nova decisão explícita. Caso a armadura chegue a 0, o **excedente convencional**, quando existir, segue o fluxo normal, independentemente desse ponto fixo. Não aplicar `E+P` uma segunda vez à Vida.

**Exemplo (sem crítico, alvo com Integridade suficiente):** ataque de Fogo G3 que acerta com **3E e 2P** causa **5 à Integridade e 1 diretamente à Vida**. G2 Queimar com os mesmos símbolos causa **5 à Integridade e 0 de dano direto à Vida**, além de eventual excedente convencional se a armadura não suportar.

**Conservados G3:** área **8 × 8**, formatos **círculo/cone/linha** e possibilidade de conjurar **ao fim do turno dos aliados**, respeitando requisitos da magia e riscos de afetar aliados existentes. Esta revisão não concede qualquer uma dessas funcionalidades a G2.

**Imunidades e outras barreiras:** preservam as interações já aprovadas de defesa elemental. Uma imunidade efetiva a Fogo deve ser resolvida antes de atribuir o ponto de Vida como dano inevitável. **PENDENTE:** procedimento exato contra escudos arcanos, barreiras elementais, resistências específicas, incêndios persistentes, geometria e distância da área; não conceder ignorar escudos ou imunidades gratuitamente.

### Escopo e precedência

**DEFINIDO:** Fogo G2 passa a Queimar (ênfase em Integridade) e **não** causa dano direto à Vida por essa propriedade. Fogo G3 Derreter danifica simultaneamente armadura e Vida, mas com **apenas +1 dano direto fixo à Vida**. Substitui expressamente a redação antiga da Perícia em Elemento Fogo e do Livro do Jogador que atribuía dano direto à Vida já em G2 ou repetição do dano integral à Vida e armadura em G3.

**Não alterar:** Perfurante da v0.69, Sangramento da v0.70, Hemomancia v0.74/v0.75, custos de compra, requisitos, limites simbólicos, dados, áreas nem custos existentes de Fogo. Dano à Vida por **Hemomancia** é efeito exclusivo daquela build e continua distinto de Derreter.

**PENDENTE:** os critérios exatos de aquisição/habilitação dos Graus superiores de Fogo ainda precisam ser conciliados com a única Perícia de compra **1 XP**. **Nenhum Grau novo é concedido por esta versão.**

### Protótipo de ficha — implementação

O rolador pode **exibir o cálculo potencial do Fogo G2/G3** quando o jogador declarar manualmente que a magia de Fogo está habilitada para aquele Grau (sob validação do Narrador). A ficha distingue **dano à Integridade** de **1 Vida direta fixa de Derreter**. O registro **não desconta automaticamente Integridade/Vida de outras fichas**, não habilita Graus sem requisito, nem altera recursos/dados já definidos. Custos de ativação são verificados de acordo com foco, pagamento escolhido e eventual invocação sem foco; se faltar recurso, a rolagem não pode ser finalizada.

**Histórico preservado:** v0.75 Escudo Arcano de Sangue; v0.74 dano integral de Hemomancia; v0.73 custo alternativo de Sangue; v0.72 geração de Sangue; v0.70 Sangramento; v0.69 Perfurante.
