# Codex RPG — Rebalanceamento do d4 e nível 1

**Data:** 15/11/2026  
**Norma:** SRD de Continuidade v0.46, seção 0-AF.  
**Estado:** Faces do d4 **DEFINIDAS** pelo autor; resultados probabilísticos **ANÁLISE**; outras mudanças de mecânica **NÃO APROVADAS**.

## 1. Antes e depois

| Face d4 | Antes | Depois [DEFINIDO] |
|---:|---|---|
| 1 | ○ | **1E (ᛋ)** |
| 2 | ○ | **1A (ᚨ)** |
| 3 | 1P (ᚦ) | **1P (ᚦ)** |
| 4 | 1A+1P | **○** |

A versão intermediária da conversa (face 2 = A+P) foi **expressamente corrigida**: a face 2 nova contém **somente Antecipar**, sem Pavor. A numeração da face crítica **permanece 4**, que agora é vazia. Não foram modificados d6, d10, d12, d20, quantidades de dados, custos ou Marcos.

| Indicador por dado isolado | d4 anterior | **d4 novo** | d6 vigente |
|---|---:|---:|---:|
| Êxitos diretos esperados | 0 | **0,2500** | 0,1667 |
| Antecipar esperado | 0,2500 | **0,2500** | 0,1667 |
| Pavor esperado | 0,5000 | **0,2500** | 0,5000 |
| Face completamente vazia | 50,00% | **25,00%** | 33,33% |
| P(E+P ≥ 1), sem gastar A | 50,00% | **50,00%** | 66,67% |

Os números de E, A e P esperados são médias *de símbolos*, não chances de acerto. O novo d4 causa **menos Pavor** que o d6, mas o d6 pode superar mais DE graças às faces com Pavor. Êxitos sem Pavor são qualitativamente diferentes dos acertos arriscados.

## 2. Procedimento exato

Enumeradas **todas as faces equiprováveis** (não é Monte Carlo) para cada pilha. Premissas: Atributo rolado + Formação pertinente; nível 1 mantém **até 2 dados gratuitamente**; pode manter apenas parte da pilha; Atributo precisa ser rolado, mas **não necessariamente mantido**. Cada resultado é avaliado com as opções existentes de gastar **1A para anular 1P** e **2A para converter em 1E**, sem duplicar gastos. DE é atingida por **E + P mantido não anulado**. No crítico (mínimo dois dados mantidos com todas as faces numéricas máximas), converte-se **até 1P próprio em 1E, se existir P**; não há +1E gratuito em crítico de dois dados. Os efeitos adicionais do crítico (recuperação de Coragem/PP) não foram somados como dano.

**Escopo do motor de referência:** os cálculos de d10 usam a face **10 = 2E+1A (sem Pavor)**, conforme SRD vigente, criador principal e motor de Criar Conflito. **Divergência de implementação PENDENTE:** o protótipo Foundry ainda mantém no seu motor a face 10 do d10 como **2E+1P**, uma cópia anterior. Os percentuais de d4+d10 deste relatório **não são os exibidos por esse Foundry desatualizado**. Esta alteração deliberadamente **não corrige d10 nem outros dados**, para isolar o impacto do d4 e respeitar o escopo do rebalanceamento. A sincronização do Foundry fica pendente em alteração separada.

**Política de escolha declarada:** entre escolhas de dados e gastos de A, priorizar (1) alcançar DE, (2) alcançar DE sem Pavor quando possível, (3) minimizar Pavor residual, (4) maximizar Êxitos restantes, (5) preservar A e aproveitar crítico. Isso modela um personagem que busca sucesso mas evita consequências quando a chance de sucesso não se reduz; **outros estilos de jogo podem produzir outra distribuição de acertos limpos/riscosos**, sem alterar os máximos de chance de atingir DE. Sem Vantagem, Desvantagem, bônus de armas, habilidades pagas, equipamento, dado elevado ou gastos de Coragem na tabela principal. **Dados descartados não produzem E, A, P, Pressão nem Pavor** nas regras atuais.

## 3. Chance exata de alcançar a DE: 2 dados mantidos

| Fontes pertinentes | Distribuição | DE 1 | DE 2 | DE 3 | DE 4 | DE 5 |
|---|---|---:|---:|---:|---:|---:|
| Atributo G0 + Formação G0 (d4+d6) | Antiga | 83,33% | 33,33% | 4,17% | 0% | 0% |
| Atributo G0 + Formação G0 (d4+d6) | **Nova** | **83,33%** | **37,50%** | **0%** | 0% | 0% |
| Atributo G0 + Formação G1 (d4+d10) | Antiga | 90,00% | 55,00% | 20,00% | 5,00% | 0% |
| Atributo G0 + Formação G1 (d4+d10) | **Nova** | **90,00%** | **60,00%** | **20,00%** | **0%** | 0% |
| Atributo G1 + Formação G1 (d6+d10) | Sem alteração | 93,33% | 63,33% | 23,33% | 3,33% | 0% |
| Atributo G0 + Formação G2 (d4+2d10) | Antiga | 98,00% | 86,00% | 54,00% | 22,00% | 4,00% |
| Atributo G0 + Formação G2 (d4+2d10) | **Nova** | **98,00%** | **88,00%** | **51,00%** | **17,00%** | **4,00%** |
| Atributo G1 + Formação G2 (d6+2d10) | Sem alteração | 98,67% | 89,33% | 54,33% | 20,33% | 4,00% |
| Atributo G2 + Formação G2 (2d6+2d10) | Sem alteração | 99,56% | 95,56% | 60,47% | 23,11% | 4,00% |

**Contagens exatas:** d4+d6 = **24** resultados equiprováveis; d4+d10 = **40**; d4+2d10 = **400**; d6+d10 = **60**; 2d6+2d10 = **3.600** resultados.

**Validade da criação:** os pares G0+G0 ou G0+G1 são **fontes de uma ação**, não uma ficha inicial sem compras obrigatórias. Na criação, o personagem já comprou ao menos **um Atributo G1** e **um Conhecimento OU Prática G1**, podendo usar outras fontes ainda em G0 numa ação pertinente. O orçamento inicial compartilhado no criador permanece **20 XP EXPERIMENTAIS**, sem reservas obrigatórias por categoria.

## 4. Acertos limpos, acertos com Pavor e falhas

**Valores são porcentagem sobre todas as rolagens**, não somente sobre sucessos; as quatro colunas de categoria somam 100%. A estratégia de decisão é a definida acima.

| Pilha, DE | Faces | Acerto limpo | Acerto com Pavor | Falha limpa | Falha com Pavor |
|---|---|---:|---:|---:|---:|
| d4+d6, DE 1 | Antigas | 16,67% | 66,67% | 16,67% | 0% |
| d4+d6, DE 1 | **Novas** | **37,50%** | **45,83%** | 16,67% | 0% |
| d4+d6, DE 2 | Antigas | 4,17% | 29,17% | 66,67% | 0% |
| d4+d6, DE 2 | **Novas** | 4,17% | **33,33%** | 62,50% | 0% |
| d4+d6, DE 3 | Antigas | 0% | 4,17% | 87,50% | 8,33% |
| d4+d6, DE 3 | **Novas** | 0% | **0%** | 91,67% | 8,33% |
| d4+d10, DE 1 | Antigas | 50,00% | 40,00% | 10,00% | 0% |
| d4+d10, DE 1 | **Novas** | **62,50%** | **27,50%** | 10,00% | 0% |
| d4+d10, DE 2 | Antigas | 20,00% | 35,00% | 45,00% | 0% |
| d4+d10, DE 2 | **Novas** | **30,00%** | **30,00%** | 40,00% | 0% |
| d4+d10, DE 3 | Antigas | 2,50% | 17,50% | 75,00% | 5,00% |
| d4+d10, DE 3 | **Novas** | **7,50%** | **12,50%** | 75,00% | 5,00% |
| d4+d10, DE 4 | Antigas | 2,50% | 2,50% | 90,00% | 5,00% |
| d4+d10, DE 4 | **Novas** | 0% | **0%** | 95,00% | 5,00% |
| d6+d10, DE 2 | Inalteradas | 25,00% | 38,33% | 36,67% | 0% |

A face 2 do novo d4 dá **Antecipar sozinho**, que pode converter-se com outro A mas **não adiciona Pavor à DE**. A antiga face 4 dava **A+P** e podia fornecer mais resultado total em conjunção com d10, especialmente após conversões ou crítico. Assim, ganhar limpeza e perder tetos de DE são efeitos simultâneos, não uma contradição.

## 5. Custo de oportunidade: terceiro dado no nível 1

**Cenário à parte:** o nível 1 pode gastar **1 Coragem** para manter um terceiro dado elegível. Isso não altera a quantidade rolada. Para **d4+2d10** (Atributo G0 + Formação G2), enumeraram-se 400 combinações; crítico de três dados já aplica bônus específicos conforme motor. Mostrar o efeito com e sem a Coragem:

| Pilha | Dado mantido | DE 2 | DE 3 | DE 4 | DE 5 |
|---|---|---:|---:|---:|---:|
| d4+2d10 anterior | Até 2, grátis | 86,00% | 54,00% | 22,00% | 4,00% |
| d4+2d10 novo | Até 2, grátis | **88,00%** | **51,00%** | **17,00%** | **4,00%** |
| d4+2d10 anterior | Até 3, custa 1 Coragem | 86,00% | 61,50% | 35,00% | 14,50% |
| d4+2d10 novo | Até 3, custa 1 Coragem | **88,00%** | **64,50%** | **34,00%** | **11,50%** |
| d6+2d10 (G1+G2) | Até 3, custa 1 Coragem | 89,33% | 66,33% | 37,67% | 15,33% |

**Importante:** gastar 1 Coragem por tentativa é custo real; não comparar terceira retenção como se fosse gratuita. Em nível 1, **PP máximo é 0**, salvo regra específica; não substituir Coragem gratuitamente por PP.

## 6. Avaliação técnica e recomendação [ANÁLISE / PROPOSTO]

**Efeitos positivos:** o d4 iniciante passa a dar Êxito próprio; Pavor esperado cai pela metade (0,50 → 0,25 por dado); melhora expressivamente a chance de **acerto limpo** nas DE baixas. Favorece estilos cautelosos, ajuda um personagem a agir com fontes não treinadas e preserva o protagonismo quando Pavor é evitado.

**Contrapesos:** em DE intermediárias/altas o d4 perdeu a face A+P que podia gerar Pavor útil à DE, combinando com outro A e com crítico. Por exemplo, com d4+d10, DE 4 caiu de 5% para **0%**. No mesmo teste a formação com Atributo G1 (d6+d10) tem **3,33%**, preservando ganho de alcançar DE mais alta.

**Ponto de atenção:** embora o d6 de Atributo G1 ainda apresente *maior chance de superar as DE 1–4* que o d4 ao lado de um mesmo d10, o d4 revisado gera **mais acertos limpos** em certos patamares: com d4+d10 em DE 2, são **30% limpos**, contra **25%** com d6+d10. O incentivo para comprar Atributo G1 não é uma dominância estrita de todos os indicadores. Build híbrida, combate e geração de Coragem/Pavor exigem playtest, sem alterar custos por hipótese.

**Recomendação PROPOSTA de playtest:** testar em DE 1, 2 e 3 e registrar, por 30–50 ações de cada tipo, (i) tipo de acerto/falha, (ii) Pavor não anulado transferido, (iii) Coragem gasta para manter/elevar, (iv) impacto em dano e defesa e (v) repetições de protagonismo. **Não** alterar automaticamente XP do Atributo G1, dados d6 ou escala da DE. A nova face do d4 é a única decisão mecânica DEFINIDA nesta revisão.

---

**Referências normativas:** SRD v0.46, seção 0-AF; Livro do Jogador atualizado; implementações de d4 na ficha, Criar Conflito, Foundry e criador legado. O relatório anterior de competência de 15/11/2026 permanece histórico para simulações que não envolvam a nova face do d4.
