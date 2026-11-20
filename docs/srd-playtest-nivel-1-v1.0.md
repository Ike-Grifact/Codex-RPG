---
title: "Codex RPG — SRD Playtest Nível 1 v1.0"
version: "1.0"
cycle: "playtest-nivel-1"
updated: "2026-11-19"
status: "DEFINIDO / PENDENTE DE PROCEDIMENTO"
supersedes_as_active: "docs/srd-continuidade-v0.82.md"
repository: "Ike-Grifact/Codex-RPG"
---

# Codex RPG — SRD Playtest Nível 1 · v1.0

> **Referência principal para o ciclo de Playtest Nível 1.** A contagem foi reiniciada por decisão autoral de **18/11/2026**. As versões `srd-continuidade-v0.XX.md` permanecem disponíveis como **histórico**, não como numeração ativa. Este documento registra as decisões mais recentes sem apagar regras anteriores que não foram revogadas. Em divergência: decisão autoral mais recente > este SRD > Livro do Jogador atualizado > código > arquivos históricos. **Código implementado não significa regra aprovada.**

> **Revisão do ciclo — 19/11/2026 (DEFINIDO):** a escolha **Elevar dado** substitui a conversão histórica de uma face individual (d4→d6→d10→d12) por **+1 Grau temporário à fonte selecionada**, usando toda a composição de dados da tabela (1 Coragem, sem XP). Os contornos e etiquetas de **XP reduzido / aumentado** só aparecem na área de fontes da ficha ao ativar **Modo edição**; no Codex Genético de criação continuam visíveis para orientar compras. Os limites de 9 dados rolados e retenção permanecem.

## Adendo normativo — Perícia Resistência a Fogo (20/11/2026)

**DEFINIDO — compra:** **Resistência a Fogo** custa **1 XP** e exige **Ferreiro Elemental + Perícia em Elemento Fogo + Vigor 2**. Ferreiro Elemental e Perícia em Elemento Fogo devem ter sido **adquiridas**, sem substituir nenhuma das compras anteriores. Todos os requisitos indiretos de Ferreiro Elemental continuam válidos.

**DEFINIDO — efeito e destinatário (esclarecimento autoral de 20/11/2026):** **o próprio personagem que comprou Resistência a Fogo recebe resistência pessoal ao elemento Fogo**, como benefício da aquisição, sem precisar encantar arma, armadura ou escudo. **Não é imunidade.** A resistência segue integralmente a regra geral vigente: **somente contra dano do elemento Fogo, cada Êxito válido do ataque representa 0,5 de dano e o Pavor representa 0 de dano** (sem excluir as demais consequências de Pavor); dano de outros elementos não recebe essa redução. A Perícia é um benefício da própria ficha enquanto adquirida, sem custo adicional de ativação especificado; nenhum teste adicional ou duração temporária foi definido. **PENDENTE:** a resolução automática de frações de dano na ficha e eventual interação/cumulação com resistência ao Fogo de equipamento; não inventar imunidade, efeito em aliados ou acumulação de reduções.

**Implementação do cadastro:** a Perícia pode ser comprada com **1 XP** assim que os requisitos forem atendidos; a ficha deve **exibir que seu portador possui Resistência pessoal a Fogo** após a aquisição. A redução deve ser aplicada conforme a regra geral na resolução dos ataques de Fogo; automatizar dano fracionário e interação com itens somente quando existir procedimento completo, sem alterar cálculos de dano não previstos.

---

## Adendo normativo — Encantar com Elemento (20/11/2026)

**DEFINIDO — aquisição:** **Encantar com Elemento** custa **1 XP** e exige **uma Perícia Elemental adquirida** e **Criar Item de Foco e Magia**. Qualquer uma das Perícias em **Fogo, Água, Ar, Terra, Sagrado, Sangue, Trevas ou Veneno** satisfaz a exigência de especialização elemental. O elemento aplicado deve ser aquele efetivamente habilitado na ficha. O foco não substitui a Perícia Elemental nem concede elementos automaticamente.

**DEFINIDO — armadura ou escudo:** gastar **1 Coragem** para aplicar **resistência ao elemento escolhido** ao equipamento. Contra o elemento resistido, **cada Êxito válido do ataque causa 0,5 de dano e Pavor não causa dano desse elemento**, sem anular outros efeitos de Pavor nem conceder imunidade. O encantamento é temporário e sua **duração = E − P, somente com E − P > 0**, calculada pelos símbolos válidos da rolagem.

**DEFINIDO — arma:** encantar uma arma temporariamente, tornando-a do **elemento habilitado** na ficha. A arma utiliza **a mesma duração E − P > 0** que armaduras e escudos, sem base adicional. Não acrescentar automaticamente dados, Êxitos, dano extra, propriedades elementais de outras Perícias ou efeitos de Grau superior. O tipo elemental é aplicado à arma enquanto o encantamento durar.

**PENDENTE de procedimento:** unidade temporal exata de **E − P** (turnos/rodadas), fontes/DE do teste, tratamento das anulações de Pavor, gasto caso a duração não seja positiva, **custo de Coragem para encantar arma** (o custo de **1 Coragem** foi explicitado para armaduras e escudos), acúmulo de resistências de equipamento, troca de alvo e automação de estados e inventário. Não inventar duração diferente para armas, armaduras ou escudos.

**DEFINIDO — interação com Ferreiro Elemental:** Encantar com Elemento passa a ser **Perícia comprável por 1 XP**; ela continua sendo requisito de **Ferreiro Elemental**. Comprar Ferreiro Elemental exige possuir Ferreiro, Inteligência 2, Destreza 2, Improviso Elemental, Criar Item de Foco e Magia e Encantar com Elemento. A compra de uma não concede automaticamente a outra.

---

## Adendo normativo — Ferreiro Elemental (20/11/2026)

**DEFINIDO — decisão autoral:** a Perícia **Ferreiro Elemental** custa **1 XP**. Requisitos informados: **Ferreiro + Inteligência 2 + Destreza 2 + Improviso Elemental + Criar magia + item de foco + Encantar com Elemento**. Para a nomenclatura do catálogo vigente, a expressão «Criar magia + item de foco» foi vinculada à única Perícia existente **Criar Item de Foco e Magia**; não foi criada uma segunda compra de Criar Magia, que aparece historicamente como descrição de conjuração livre, não como uma Perícia separada atual.

**DEFINIDO — efeito:** habilita **criar armas elementais e pedras elementais**. Não atribui grau de arma/pedra, novos símbolos, novas características, bônus de rolagem, imunidades, recarga, receitas ou automatização de itens. O +1E de **Ferreiro** continua específico aos testes efetivamente caracterizados como **Forja**, sem extensão automática a toda criação elemental.

**DEFINIDO — requisito agora adquirível:** **Encantar com Elemento** foi cadastrada com custo de **1 XP** e exigência de **uma Perícia Elemental + Criar Item de Foco e Magia**. Ferreiro Elemental só pode ser comprada depois da aquisição de **todos** os requisitos, inclusive Encantar; não conceder gratuitamente nenhum deles.

**PENDENTE — fabricação:** ingredientes, custos, ferramentas, DE, tempo, quais elementos podem ser vinculados, atributos e graus de armas/pedras, processo de encantamento, interações com itens existentes e fluxo de inventário. A criação de itens não é efetuada automaticamente ao comprar a Perícia.

---

## Adendo normativo — Perícia Ferreiro (20/11/2026)

**DEFINIDO — decisão autoral de 20/11/2026:** a Perícia **Ferreiro** custa **1 XP** e exige **Artesão 1 + Força 1 + Destreza 1 + Inteligência 1 + Artesão Avançado**. A Perícia **Artesão Avançado**, pré-requisito, já exige **Artesão 2** e custa 1 XP. Logo, um personagem que cumpra todos os requisitos de Ferreiro precisa, na prática, de **Artesão 2**, sem dispensar a aquisição de Artesão Avançado. A menção a Artesão 1 é preservada conforme a decisão autoral, sem reduzir exigências indiretas.

**DEFINIDO — habilitações:** Ferreiro permite **criar armas e armaduras Médias e Pesadas de Grau 1; consertar e modificar armas; preparar minérios e metais**. **Bônus de +1 Êxito (E) em testes de Forja**, não uma condição Vantagem nem um bônus genérico a qualquer teste que use a Prática Artesão. Preservar DE, composição, limites de dados e demais resultados da rolagem.

**PENDENTE de procedimento:** custos, materiais e tempos de fabricação; DE aplicável a cada tarefa; alcance das modificações de armas; procedimento de conserto; automação de fabricar/consertar/modificar/consumir materiais no inventário. O bônus é anotado na Perícia e deve ser aplicado manualmente em teste declarado como Forja até existir campo de contexto confiável no rolador. Não atribuir +1E a qualquer rolagem com Artesão nem criar equipamento ao comprar a Perícia.

---

## 1. Estados e limites da revisão

- **DEFINIDO:** aprovado pelo autor. **EXPERIMENTAL:** em playtest. **PROPOSTO:** hipótese não homologada. **PENDENTE:** falta definição operacional.
- **DEFINIDO e fixado pelo autor:** **15 XP iniciais compartilhados no nível 1**. Não continuar variando entre 15, 18 e 19 XP neste ciclo. **Uma compra de Atributo G1** e **uma de Conhecimento ou Prática G1** são obrigatórias; o restante é livre entre aptidões e Perícias, conforme custos e requisitos. Para um humano sem redução racial: custo mínimo 1 + 2 = **3 XP**, restando **12 XP**. Não há reserva obrigatória de XP para Perícias nem divisão por categorias.
- **DEFINIDO:** não recalcular custos de Atributos, Conhecimentos, Práticas, Perícias, dados, raça, armas ou equipamentos nesta revisão. O orçamento do nível 1 passa a ser **fechado**, não uma hipótese de revisão recorrente.
- **DEFINIDO:** todas as personagens começam como Aprendizes, sem classes impostas. A profissão emerge da combinação da ficha. As seis Práticas são Disciplina, Atletismo, Furtividade, Artesão, Apresentação e Coleta; Disciplina é uma só Prática, com habilitações marciais e mágicas.
- **DEFINIDO:** continuam Êxito (E, ᛋ), Antecipar (A, ᚨ) e Pavor (P, ᚦ). Roll & Keep segue as faces e limites vigentes no Livro do Jogador e nos registros posteriores à v0.44: até **9 dados rolados e 4 mantidos** quando habilitados. Não restabelecer regras revogadas de dados descartados, PP, conjuração memorizada ou profissões automáticas.
- **DEFINIDO:** os elementos **Ar, Água, Terra, Fogo, Sagrado, Sangue, Trevas e Veneno** não dependem de comprar Criar Item de Foco e Magia (decisão histórica v0.81). **Improviso Elemental** também não depende desse Foco: custa **1 XP**, exige Disciplina 1 + Inteligência 1 + Destreza 1 e mantém seus efeitos. Isso **não** elimina o requisito próprio de Foco de outras Perícias.
- **PENDENTE DE RECONCILIAÇÃO:** trechos do Livro e guias antigos que ainda descrevem requisitos ou valores históricos. Quando não houver decisão explícita aqui, **não inventar** novos custos, DE, durações nem opções automáticas.

## 1-A. Núcleo jogável para criar e rolar um Aprendiz (nível 1)

**DEFINIDO — transcrição das regras atuais do Livro do Jogador, posteriores à continuidade v0.9 antiga.** Este quadro evita que a ficha de Playtest Nível 1 dependa de tabelas de XP e faces desatualizadas.

### Atributos, Conhecimentos e Práticas

**Seis Atributos:** Força, Agilidade, Destreza, Inteligência, Influência e Vigor.

**Seis Conhecimentos:** Proteção, Astronomia, Medicina, Alquimia, Engenharia e Erudição.

**Seis Práticas:** Disciplina, Atletismo, Furtividade, Artesão, Apresentação e Coleta. Disciplina integra usos marciais e mágicos na mesma graduação; as Perícias pertinentes determinam suas habilitações. **Não existem duas Práticas separadas de Armas e Conjuração.**

| Grau | Dados de Atributo | XP acumulado | Dados de Conhecimento/Prática | XP acumulado |
|---:|---|---:|---|---:|
| 0 | 1d4 | 0 | 1d6 | 0 |
| 1 | 1d6 | 1 | 1d10 | 2 |
| 2 | 2d6 | 3 | 2d10 | 4 |
| 3 | 3d6 | 6 | 3d10 | 8 |
| 4 | 2d6 + 1d10 | 9 | 2d10 + 1d12 | 16 |
| 5 | 1d6 + 2d10 | 18 | 1d10 + 2d12 | 32 |
| 6 | 3d10 | 32 | 3d12 | 64 |

**Criação, exemplo de Humano sem descontos:** escolha Atributo G1 (1 XP) e Conhecimento ou Prática G1 (2 XP). Dos **15 XP iniciais fixos**, **12 XP ficam livres** para quaisquer compras legais. Não exigir compra compulsória em uma terceira categoria nem obrigatoriedade de 5 XP em Perícias. As particularidades raciais já aprovadas continuam válidas e não são alteradas por esta nova numeração. Os **20 VT iniciais** permanecem **EXPERIMENTAIS**, independentes do XP.

### Dados e faces simbólicas do Playtest Nível 1

As faces são símbolos, não valores numéricos para somar à DE. **Êxito (E) ᛋ** `#267A45`, **Antecipar (A) ᚨ** `#2369BB`, **Pavor (P) ᚦ** `#542176`.

| Face | d4 | d6 | d10 | d12 |
|---:|---|---|---|---|
| 1 | E | ○ | ○ | ○ |
| 2 | A | ○ | ○ | ○ |
| 3 | P | P | P | P |
| 4 | ○ | P | P | P |
| 5 | — | A+P | A+P | A+P |
| 6 | — | E | E | E |
| 7 | — | — | 2E | 2E |
| 8 | — | — | E+A | E+A |
| 9 | — | — | E+A+P | E+A+P |
| 10 | — | — | **2E+A** | 2E+P |
| 11 | — | — | — | E+2A+P |
| 12 | — | — | — | 2P |

A **face 4 do d4 é vazia**, mas continua sendo a face numérica máxima para críticos. A **face 10 do d10 é 2E+A**, sem Pavor (correção definida em 14/11/2026). Não reutilizar a distribuição antiga da continuidade v0.9. O **d20 extraordinário** está definido em fonte posterior, mas **não é compra comum de Aprendiz nível 1** e fica fora desta tabela de referência rápida.

### Combinar, rolar e manter

- **Composição comum do jogador:** iniciar a seleção por qualquer categoria e usar duas fontes pertinentes, sem repetir categorias: Atributo + Conhecimento, Atributo + Prática ou Conhecimento + Prática quando a regra aplicável permitir e houver Atributo presente na pilha; a exigência de Atributo na pilha permanece para o procedimento normal. Não combinar duas vezes a mesma fonte.
- **Perícia Avançada** com a fonte predominante G2 e compra de **1 XP** habilita essa fonte + até duas outras fontes pertinentes, totalizando **até três fontes**, respeitando os requisitos adicionais próprios. **Conhecimento/Prática + dois Atributos diferentes** é permitido com habilitação pertinente; não habilita automaticamente uma terceira fonte pela mera existência de uma formação.
- **Manejo Duplo** é exceção própria para duas seleções de Disciplina. A exceção **da transformação Druídica** restringe a rolagem às combinações de Atributos distintos por porte, conforme a seção 3.
- **Limites absolutos:** até **9 dados rolados** e **4 mantidos** quando habilitado. No **nível 1**, manter **2 dados naturalmente** ou **3 com 1 Coragem**, desde que estejam na pilha; essa Coragem **não cria um novo dado**. No nível 1, não manter quatro sem habilitação posterior.
- **Atributo é obrigatório na pilha, mas não entre os dados mantidos**, conforme a regra posterior do Livro do Jogador. Os símbolos de dados descartados não participam da resolução e **não geram Pavor/Coragem/Êxitos**.
- **Antecipar:** cada 1A pode anular 1P próprio **ou** passar oportunidade para um aliado; 2A podem gerar 1E. Não gastar o mesmo A duas vezes. O jogador compara **E + P mantidos e não anulados** com a **Dificuldade de Êxito (DE)**: alcançar ou superar a DE cumpre a ação, mas acerto com Pavor não é acerto limpo. Pavor residual pode alimentar a reserva do adversário ou permitir intervenção na cena.
- **Elevar uma fonte com Coragem [DEFINIDO — correção autoral de 19/11/2026]:** ao gastar **1 Coragem** antes de rolar, escolher **uma fonte que componha a rolagem** (Atributo, Conhecimento ou Prática) com Grau inferior a 6 e aplicar **temporariamente os dados do Grau seguinte**, conforme a tabela desta seção. Não se compra Grau, não se gasta XP e a ficha permanece no Grau anterior após a rolagem. O efeito **pode acrescentar um dado à pilha**, quando a tabela do Grau seguinte o acrescentar, sempre respeitando o teto de **9 dados rolados** e de dados mantidos do Marco. Exemplos: **Agilidade G2, 2d6 → G3, 3d6**; **Disciplina G2, 2d10 → G3, 3d10**; **Disciplina G3, 3d10 → G4, 2d10 + 1d12**. A elevação comum não se aplica a dados de equipamento, não concede Perícia ou habilitação e não extrapola G6; continua sendo **uma fonte por rolagem**. A elevação de Atributos da transformação Druídica mantém seu procedimento específico.
- **Crítico:** todos os dados escolhidos para manter precisam estar nas **faces máximas**, com ao menos dois dados mantidos. O crítico recupera Coragem de acordo com a tabela atual (2 dados: 1; 3 ou 4: 2), sem conceder PP. A face máxima d4 vazia pode integrar esse critério.

### Vida, estados e proteções básicos

A Vida máxima do personagem é **4 + Grau de Vigor + piso(Grau de Força / 2)**. Se `X = Vigor + piso(Força/2)`, distribuir quatro caixas: **Saudável = 1 + teto(X/2)**; **Ferido = 1 + piso(X/2)**; **Incapacitado = 1**; **Inconsciente = 1**. Morte ocorre em 0 de Vida.

| Estado atual | Modificador da rolagem | Custo para agir |
|---|---|---|
| Saudável | nenhum | 0 |
| Ferido | −1A | 0 |
| Incapacitado | −1E e +1P | 1 Coragem |
| Inconsciente | −2E e +2P | 2 Coragens |
| Morto | não age | — |

Modificadores de Saúde **substituem**, não acumulam, os de estados anteriores. Pavor do próprio estado conta normalmente para o risco e DE, se não anulado. Não curar automaticamente por transformação de formas sem o procedimento específico pendente da seção 3.

**Armaduras G1 do catálogo de playtest:** Muito Leve 3, Leve 7, Média 12, Pesada 17 de Integridade, conforme as decisões vigentes posteriores à v0.44. Os modificadores de DE por tipo e efeitos de Escudo Arcano continuam de acordo com as regras recentes do Livro. As **formas Druídica e Elemental não utilizam armadura física**, conforme suas respectivas seções. Não conceder defesa ou dano suplementar sem texto aprovado.

**DEFINIDO:** inimigos Grau 1 iniciam o conflito com a reserva local de Pavor estabelecida nas regras atuais (4P). Pavor **mantido e não anulado do ataque de um jogador** contra um adversário declarado vai à reserva do **alvo atacado**, não automaticamente ao inimigo mais próximo; a distribuição entre múltiplos alvos e ações sem alvo continua com regras próprias ainda incompletas. **Pavor mantido pelo inimigo em ataque** concede Coragem ao alvo jogador conforme a seção 2. Não recuperar a antiga mecânica genérica de **Pressão por dados descartados** da continuidade v0.9.

## 2. Coragem simples — sem desenvolver Maestrias neste ciclo

**DEFINIDO — simplificação autoral de 18/11/2026:**

- **DEFINIDO — correção expressa de 18/11/2026:** **Coragem inicial = 10**; os **três pontos mencionados pelo autor** são **três aumentos de teto de +1**, concedidos automaticamente nos níveis **5, 10 e 20**. Não são três Coragens iniciais. Sem Maestrias especializadas: teto **10 (níveis 1–4), 11 (5–9), 12 (10–19) e 13 (20)**. Nenhuma migração de 10 para 3 deve ocorrer; as fichas existentes já usam essa progressão. O limite absoluto histórico de 15 não cria bônus sem Maestria.
- **DEFINIDO:** Coragem é **reserva única**. Não reintroduzir PP ou a conversão antiga de PP.
- **DEFINIDO — teto de gasto por rolagem (19/11/2026):** o personagem pode **gastar no máximo 5 Coragens em uma mesma rolagem**. Somam-se os custos de condição de Vida, manter mais um dado, elevar uma fonte, Perícias, propriedades e ativações associados ao mesmo teste. O limite é de **gasto**, não reduz a reserva ou o teto permanente de Coragem; os efeitos podem custar menos, mas não mais de 5 Coragens no mesmo teste. Custos declarados e custos condicionais são somados na resolução; se ultrapassarem 5, a ativação/rolagem conjunta não é válida e deve ser revista.
- **DEFINIDO — uso de interface:** clicar em arma ou foco equipado **prepara a ação**, selecionando Disciplina, Atributo e equipamento, **sem rolar automaticamente**. O jogador escolhe retenção extra e/ou elevação no painel e só então usa **Rolar dados**. A elevação de fonte usa **um seletor único**, sem checkbox de confirmação redundante. A pertinência narrativa de um terceiro complemento é acordada **verbalmente com o Narrador**; não exige checkbox na ficha, mas a Perícia pertinente continua obrigatória.

- **DEFINIDO:** recuperar Coragem por **crítico**, preservando a tabela de crítico aprovada: com **2 dados máximos mantidos +1**, com **3 ou 4 dados máximos mantidos +2**, sem ultrapassar o teto disponível. Crítico não devolve PP.
- **DEFINIDO:** em combate, quando um **inimigo mantém Pavor**, ele gera Coragem para o personagem que é alvo do ataque, pela equivalência anterior **1 Pavor mantido e não anulado → 1 Coragem**, até o teto. Não conceder Coragem por Pavor descartado ou cancelado.
- **DEFINIDO:** **descanso curto** recupera Coragem **somente se possuir a Perícia Recobrar Coragem**. Conserva-se o benefício já publicado dessa Perícia (**2 Coragens** após descanso e cena narrativa) enquanto o autor não alterar a quantidade. Sem a Perícia, descanso curto não restaura Coragem por esta regra.
- **DEFINIDO:** **descanso longo** recupera **Vigor + 1 Coragem**, sempre limitado ao teto do personagem, com ou sem Perícia. A Perícia de descanso curto não adiciona automaticamente outra recuperação no mesmo descanso longo; eventual acúmulo fica **PENDENTE**.
- **CONGELADO:** não comprar, desenvolver nem conceder agora efeitos de Maestrias especializadas, gatilhos de Precisão/Combo/Mestre de Armas nem bônus de +2/+3 de Maestria. Tais projetos seguem arquivados/adiados, **não autorizados para o Playtest Nível 1**. A Perícia histórica *Maestria Elemental* de conjuração permanece distinta e não é convertida automaticamente em uma identidade de recuperação.

**Compatibilidade:** fica **REVOGADA** a interpretação anterior desta própria v1.0 que registrava 3 Coragens iniciais. O comportamento já implementado de **10/11/12/13** está correto e deve ser preservado no criador, nos NPCs humanoides e no Foundry, sem rebaixar reservas salvas. Maestrias especializadas continuam **ADIADAS**.

## 3. Transformação Druídica — novo ramo animal

**DEFINIDO — substitui a cadeia de aquisição e as fichas animais da Druídica v0.82.**

- **Nome:** Perícia Druídica. **Custo:** **1 XP**, compra única.
- **Requisitos:** possuir **Criar Item de Foco e Magia** **E** **Perícia em Elemento Terra**. **Não exige** Influência, Domar Criatura Pequena/Média/Grande, uma espécie domada nem ficha de animal separada.
- **DEFINIDO:** a **compra única de 1 XP libera imediatamente as três formas, Pequena, Média e Grande**, sem custos de XP adicionais, nível mínimo novo ou Domar. O jogador escolhe a forma ao se transformar e paga apenas a ativação da tabela. O druida transforma o próprio corpo, usando **os Atributos da ficha original**, com aprimoramento temporário por porte. **Não distribui XP em outra ficha animal**. A transformação não altera permanentemente o Grau comprado nem concede novas fontes de Conhecimentos/Práticas.
- **DEFINIDO:** em forma animal, a composição de rolagem substitui a regra normal de combinação por **Atributos distintos**. **Não se combinam Conhecimentos nem Práticas** na rolagem da forma. Pequena e Média permitem até **dois Atributos diferentes**; Grande permite **três Atributos diferentes**. Não repetir o mesmo Atributo.
- **DEFINIDO:** **formas animais não recebem armadura física**; se uma proteção aplicável não interceptar o ataque, o dano atinge a Vida. **Não é permitido conjurar enquanto estiver transformado em qualquer das três formas animais**, mesmo com Perícias de conjuração já compradas. Escudo Arcano conjurado **antes** da transformação continua válido pelo prazo original se ainda ativo; essa proteção não autoriza uma nova conjuração dentro da forma.

| Forma | Ativação | Aprimoramento temporário | Vantagem / rolagem | Cancelamento |
|---|---|---|---|---|
| **G1 — Pequena** | **0 Coragem** | Eleva **1 Atributo**, **exceto Vigor** | Vantagem em testes pertinentes à **Furtividade**; até 2 Atributos distintos | **Ao receber dano**, encerra a forma |
| **G2 — Média** | **1 Coragem** | Eleva **2 Atributos**, **podendo incluir Vigor** | Vantagem em testes pertinentes ao **Atletismo**; até 2 Atributos distintos | **Quando o resultado tem mais Pavor do que Êxito**, seja acerto ou falha, encerra a forma |
| **G3 — Grande** | **1 Coragem** | Eleva **3 Atributos** | Até **3 Atributos distintos** na mesma rolagem | **Qualquer Pavor mantido e não anulado** encerra a forma |

**Aprimoramento ilustrado e expressamente aprovado:** quando o Atributo selecionado tiver **2d6 + 1d10**, na forma passa a **2d10 + 1d12**. Isso é avanço **temporário dos dados desse Atributo**, não compra gratuita de Grau e não autoriza extrapolar passos além de d12. Aplicação para outras composições, fontes extraordinárias e d20: **PENDENTE**.

**Vida e Saúde — decisão autoral:**
- Ganhos de Vida decorrentes da forma **não criam uma ficha de Saúde animal separada**.
- Se a forma elevar a Vida e o personagem já estiver ferido, a Vida adicional **preenche primeiro as caixas inferiores** até chegar novamente à faixa **Saudável**.
- Quando o ganho elevar o valor além da Vida real máxima aplicável, o **excedente é Vida temporária**, inclusive nas formas em que houver esse ganho; **a Vida temporária só existe enquanto a forma animal estiver ativa e desaparece completamente ao destransformar**. O preenchimento de faixas feridas pela transformação **também é provisório e não se converte em cura permanente**: preserve o estado de ferimentos reais anterior e os danos reais posteriores para a reversão. Trocar de forma não deve criar Vida infinita.
- **PENDENTE DE PROCEDIMENTO:** número de pontos provenientes do aumento de Vigor, ordem operacional das caixas e repartição do dano real ao cancelar a forma (especialmente em transformações sucessivas). **O desaparecimento da Vida temporária ao terminar a forma está DEFINIDO** e não depende desses detalhes. Não reutilizar a antiga comparação de máximos de fichas animais.

**DEFINIDO:** **G1, G2 e G3 estão disponíveis desde a aquisição da Perícia Druídica**, sem compra nem desbloqueio secundário. A vantagem da forma Pequena é **Vantagem**, não Vantagem Absoluta. **PENDENTE:** o momento preciso da reversão por dano ou resultado, em situações simultâneas, não altera os gatilhos já definidos.

## 4. Transformação Elemental — novo ramo independente

**DEFINIDO — nova Perícia (1 XP).**

- **Requisitos:** possuir **Criar Item de Foco e Magia** e **pelo menos uma Perícia em Elemento** válida.
- **Ativação:** **1 Coragem** para transformar-se no elemento escolhido dentre os que possui habilitados. O elemento da transformação é declarado.
- **Proteção:** a forma é **imune ao próprio elemento** e, normalmente, **intangível**. Não usa a armadura física equipada; contra danos não impedidos por imunidade ou Escudo Arcano, o dano chega **diretamente à Vida**, sem Integridade de armadura física. **Pode usar Escudo Arcano** se seus requisitos e procedimentos forem atendidos.
- **Exceção Terra:** o corpo permanece **tangível**, mas é **imune aos efeitos aplicáveis das armas** e ao próprio **elemento Terra**. Essa defesa funciona como uma grande proteção inerente à forma, **não como uma armadura equipada com Integridade inventada**.
- **DEFINIDO — proteção elemental:** **Imunidade** = o elemento ao qual se é imune provoca **0 dano**. **Resistência** = para ataques **do elemento ao qual se é resistente**, cada Êxito válido representa **0,5 de dano** e **Pavor representa 0 de dano**, embora continue produzindo suas consequências normais de risco/DE quando aplicáveis. Dano de **outros elementos** segue seu cálculo normal, sem a redução de resistência. A forma Elemental é **imune ao seu elemento**, logo não soma "meia resistência" à imunidade já total. Imunidade e resistência são estados diferentes; conceder imunidade não significa ser imune a todos os elementos. **PENDENTE:** tratamento de frações de dano no registro inteiro de Vida; não arredondar sem decisão.
- **DEFINIDO — duração exclusivamente pela rolagem:** **Duração = E − P**, considerando os símbolos válidos da resolução; **a forma só terá duração positiva se E − P > 0**. **Não há duração-base adicional**. Por exemplo, 3E e 1P produzem duração 2; 1E e 2P não sustentam a transformação. **PENDENTE:** unidade de duração (turnos/rodadas), fontes e DE do teste, filtragem de Pavor anulado e se o custo é consumido ao não sustentar a forma. O valor E − P pode ser calculado sem inventar duração-base.
- **Fonte elemental:** pode usar o elemento de um **item de foco apropriado** para amplificar a transformação ou **o elemento do ambiente** quando disponível. **Com ambiente favorável, a preparação exige 3 turnos** segundo a decisão deste ciclo. **PENDENTE:** o efeito numérico da amplificação pelo foco, tempo-base quando usa foco e interações com abundância ambiental; **a duração-base não está pendente porque foi substituída por E − P**.
- **PENDENTE:** interação detalhada da intangibilidade com ataques físicos, deslocamento, objetos segurados, efeitos mentais e magias não elementais. Não declarar invulnerabilidade geral.

**Diferença entre ramos:** Druídica é **forma animal com melhoria temporária de Atributos e rolagem só de Atributos**; Transformação Elemental é **forma de um elemento com imunidade própria, regra especial de Terra, duração por símbolos e proteção contra dano**. Não adicionar requisito de Domar à segunda Perícia. **Ambas exigem Criar Item de Foco e Magia**, mesmo que comprar os elementos isoladamente e comprar Improviso Elemental **não** exija Foco.

## 5. Publicação, código e testes

- **Regras fixadas nesta v1.0:** orçamento de 15 XP; criação livre após mínimos; suspensão das Maestrias especializadas; gatilhos de recuperação e progressão neutra; nova aquisição da Druídica; dois ramos de transformação, seus custos e efeitos descritos.
- **Implementação permitida imediatamente:** atualizar custo/requisito/compra assistida e catálogo das duas Perícias; **liberar G1/G2/G3 com a compra única**, bloquear conjuração durante as três formas animais, remover Vida temporária ao retornar, calcular duração elemental E − P com exigência de valor positivo e aplicar imunidade/resistência conforme acima. Manter manual somente o que depende de procedimento pendente. Preservar JSON existente e compras anteriores.
- **Implementação não autorizada por inferência:** ficha animal paralela, cura gratuita permanente, resistência cumulativa à imunidade, duração elemental arbitrária/extra, compra ou requisitos adicionais para G2/G3, arredondamento de 0,5 de dano sem decisão, substituir Maestria Elemental por identidade passiva ou alterar custos gerais.
- **Prioridades de validação:** 15 XP e requisitos mínimos; Coragem inicial 10 e aumentos em 5/10/20; Druídica sem Domar (Foco + Terra), G1/G2/G3 disponíveis com uma compra, sem conjurar na forma e com Vida temporária limitada à transformação; Elemental com Foco + elemento, duração E−P positiva, imunidade zero e resistência E/2 (P não causa dano); recompra negada, fichas antigas, visualização clássica e Codex Genético compartilhando compras.
- **Histórico:** versão anterior mais recente [SRD de Continuidade v0.82](srd-continuidade-v0.82.md). Decisões anteriores não explicitamente revogadas permanecem como referência subsidiária, nunca como autorização para recuperar regras contrárias a este novo ciclo.
