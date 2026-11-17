---
title: "Codex RPG — SRD de Continuidade v0.79: checkpoint de decisões e pendências da revisão"
version: "0.79"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO / EXPERIMENTAL / PENDENTE — checkpoint autoral e implementação parcial de Medicina Avançada na branch"
supersedes: "docs/srd-continuidade-v0.78.md, exclusivamente nos pontos expressamente corrigidos"
---

# Codex RPG — SRD de Continuidade v0.79

## 0-BS. Checkpoint autoral — 17/11/2026

**Objetivo:** preservar as decisões tomadas pelo autor na revisão sequencial de Cravar, conjuração, focos, Hemomancia, Sangramento e tratamento antes de prosseguir com outras pendências. Este documento registra as decisões e seus estados. **Nesta branch**, somente Medicina Avançada (compra e seleção de terceira fonte), seu verbete, o Codex Genético e as referências do Livro do Jogador foram atualizados; **o restante das regras do checkpoint não foi implementado** na ficha, Foundry ou portal. **Não executar mudanças de ficha ou balanceamento por inferência.**

**Precedência:** decisões autorais recentes deste checkpoint prevalecem sobre trechos incompatíveis de SRDs anteriores, Livro do Jogador e comportamento implementado; onde este documento for omisso, permanecem as regras anteriores válidas. Custos, dados, requisitos e efeitos não citados não foram modificados.

**Legenda:** **DEFINIDO** = decisão expressa do autor; **EXPERIMENTAL** = orçamento/hipótese em teste; **PROPOSTO** = alternativa sem aprovação; **PENDENTE** = falta decisão ou procedimento. Nenhum item PENDENTE pode ser tratado como regra pronta.

### 1. Criação de personagem e combinações de aptidões

**DEFINIDO:** o jogador começa com o sistema aberto de Aprendiz e precisa comprar pelo menos **1 Atributo G1** e **1 Conhecimento ou Prática G1**; o XP restante é de distribuição livre entre as categorias e Perícias habilitadas. Não há reservas obrigatórias de XP por categoria ou para Perícias.

**EXPERIMENTAL (última decisão):** orçamento inicial compartilhado de **15 XP**, substituindo, para o novo ciclo de testes, os valores anteriores de 18/19 XP. Manter custos e requisitos vigentes; não extrapolar esta alteração à progressão após a criação. Atributo G1 custa 1 XP; Conhecimento/Prática G1 custa 2 XP; a compra obrigatória mínima de 3 XP deixa 12 XP livres sob a hipótese de 15 XP.

**DEFINIDO — composição nas fichas de jogadores:** permitir iniciar a seleção por qualquer uma das categorias, desde que a combinação normal não repita categorias: **não** combinar Atributo + Atributo, Conhecimento + Conhecimento ou Prática + Prática em uma combinação comum. A ordem de seleção não limita a liberdade de escolha.

**DEFINIDO — habilitações especiais:**
- Com **Disciplina Avançada**, pode-se acrescentar **mais uma fonte/combinação pertinente** à seleção normal, sem escolher Disciplina novamente por essa habilitação.
- **Manejo Duplo** habilita selecionar **Disciplina duas vezes**, segundo sua aplicação própria; não estender esta exceção a outras Práticas nem a quem não possua Manejo Duplo.
- **Criaturas/monstros com ficha somente de Atributos** podem combinar **2 ou 3 Atributos**.
- **Monstros humanoides** seguem a mesma restrição de categorias dos jogadores.
- Combinações continuam sujeitas aos graus, dados e limites de rolagem/manutenção; a exigência de pelo menos um dado de Atributo na pilha permanece, a menos que uma exceção aprovada determine o contrário.

**DEFINIDO — padronização de Perícias Avançadas de Conhecimento e Prática (decisão posterior neste ciclo):**
- O **custo de aquisição é 1 XP** para toda Perícia de **Conhecimento Avançado ou Prática Avançada**. Essa regra não concede gratuitamente a Perícia nem altera o custo de elevar o Grau da aptidão.
- A Perícia Avançada habilita usar **a fonte especializada X como base/predominante e acrescentar até duas fontes pertinentes**: **X + fonte 2 + fonte 3**, ou seja, **até três fontes no total**, não duas fontes além de uma combinação já completa. Respeitar o teto normal de dados rolados/mantidos, manter pelo menos um dado de Atributo na pilha e não repetir a própria fonte X. Não acumular automaticamente duas Perícias Avançadas para criar uma quarta fonte.
- **Medicina Avançada**: exige **Medicina G2**, compra **1 XP**, permite **Medicina predominante + até duas fontes pertinentes** e habilita o tratamento para remover Sangrando com teste próprio (seção 6).
- **Disciplina Avançada**: conserva requisito **Disciplina G2**, custo **1 XP** e aplicação apenas quando Disciplina for a fonte principal.
- **Furtividade Avançada**: conserva requisito **Furtividade G2 + Perícia em Furtividade**, custo **1 XP** e aplicação apenas quando Furtividade for a fonte principal.
- **DEFINIDO — requisito universal (resposta A do autor, 17/11/2026):** todas as Perícias Avançadas de Conhecimentos e Práticas exigem **Grau 2 na própria fonte** e custam **1 XP**. Para as especializações previamente existentes, quaisquer requisitos adicionais publicados permanecem vigentes (ex.: Perícia em Furtividade para Furtividade Avançada).

**IMPLEMENTADO NESTA BRANCH DE REVISÃO:** **12 Perícias Avançadas**, cobrindo **6 Conhecimentos** (Proteção, Astronomia, Medicina, Alquimia, Engenharia e Erudição) e **6 Práticas** (Disciplina, Atletismo, Furtividade, Artesão, Apresentação e Coleta). As **9 especializações novas**, além de Medicina, Disciplina e Furtividade Avançadas, são:

| Conhecimento Avançado | Prática Avançada |
|---|---|
| Proteção Avançada | Atletismo Avançado |
| Astronomia Avançada | Artesão Avançado |
| Alquimia Avançada | Apresentação Avançada |
| Engenharia Avançada | Coleta Avançada |
| Erudição Avançada | — |

**Compras, terceira fonte do compositor, Codex Genético e verbetes individuais:** registrados na branch. Disciplina Avançada e Furtividade Avançada preservam requisitos individuais. As nove novas concedem **somente o benefício genérico aprovado** de até três fontes pertinentes, não magias, ataques ou efeitos novos. O tratamento automático da condição Sangrando **não** foi implementado nesta etapa porque a ficha ainda não modela o alvo da intervenção.

**PENDENTE:** detalhes especiais da relação entre fontes, dados e Grau para monstros; as 12 especializações Avançadas de jogadores têm compra e requisitos mínimos definidos. Não inventar efeitos temáticos adicionais.

### 2. Cravar, retirada e Sobrecarga

**DEFINIDO — retirada de Cravar (complementa e corrige v0.78):** exige rolagem combinada pertinente que inclua **Força, Atletismo ou Vigor**, junto de outra fonte válida. Não vale rolar uma fonte isolada. A **DE depende da categoria de peso da arma cravada**: **Leve 1; Média 2; Pesada 3**, com **teto geral 4**. Acertar a DE retira a arma; falhar mantém a condição. Nenhum custo de PP/Coragem ou Perícia de arma foi acrescentado à retirada.

**IMPORTANTE:** v0.77/v0.78 só autorizam a **aplicação de Cravar** com arma **Média ou Pesada** e seus gatilhos já aprovados; a existência de uma DE de retirada para arma Leve **não libera, por si só, armas Leves para cravar**. Conservar a restrição até decisão explícita.

**DEFINIDO — penalidade corrigida:** enquanto a arma estiver cravada, **Levantar Escudo sofre −1E** (substitui −2E na v0.77/v0.78 e no Livro). **Somente** Levantar Escudo recebe essa penalidade de Cravar; não a aplicar a qualquer teste.

**DEFINIDO — Sobrecarga:** a condição de Sobrecarga aplica **−1E em todos os testes**. O peso natural, a dimensão e as proteções de criaturas devem aproveitar as regras já existentes para o porte, sem criar novas tabelas ou algoritmos.

**PENDENTE:** situações de múltiplas armas cravadas, destino da arma ao ser retirada e demais procedimentos que não tenham sido expressamente aprovados. A implementação atual ainda pode conter −2E e DE manual.

### 3. Conjuração: graus e preparação

**DEFINIDO — novo padrão geral de preparação elemental:**
- Magia elemental **G2**: **2 turnos de preparação** sem aceleração.
- É possível **reduzir uma magia para G1** a fim de lançá-la **instantaneamente**.
- Magia **G3**: **3 turnos de preparação** sem aceleração.
- Um **foco mágico comum** pode reduzir a preparação de uma conjuração em **até 1 turno**, gastando **1 carga**. Não somar acelerações do mesmo foco para reduzir mais de um turno da mesma conjuração sem aprovação específica.
- Exemplo: **foco G1 (1 carga) + magia G2 (2 turnos) = lançamento no mesmo turno**, seguido do regime de recarga do foco.

**PENDENTE:** como a redução de G2 para G1 altera dano, alcance, área e propriedades; regra geral de tempo para magia G4; cronologia detalhada de declaração/conclusão e compatibilidade com magia memorizada; como esta regra prevalece sobre antigas tabelas de G1/G2/G3 e conjuração ao fim do turno dos aliados. Não inferir efeitos ou custos novos.

**DEFINIDO — Conjuração Refinada:** aumenta o alcance das magias em **+8 metros**, corrigindo a pendência de alcance no Livro do Jogador; conservar os requisitos/custo históricos até eventual revisão explícita.

### 4. Focos mágicos: carga, recarga e exceção

**DEFINIDO:** capacidade máxima de cargas do foco corresponde a seu Grau:

| Foco | Cargas máximas | Recuperação automática após esgotar |
|---|---:|---|
| G1 | 1 | 1 carga por rodada |
| G2 | 2 | 1 carga por rodada |
| G3 | 3 | 1 carga por rodada |
| G4 | 4 | 1 carga por rodada |

- **Cada aceleração** de até **1 turno** consome **1 carga**, independentemente de a magia acelerada ser G2 ou G3.
- O foco **entra em recarga quando todas as cargas se esgotam**, não a cada carga gasta.
- Depois de esgotado, **recupera 1 carga automaticamente no final de cada rodada**, **após a troca de fluxo entre jogadores e inimigos**. Não exige ação, PP ou Coragem, inclusive em combate.
- As cargas já recuperadas **podem ser usadas imediatamente nas próximas oportunidades**, ainda que o foco não esteja cheio. Usar uma carga recuperada não exige que se aguardem todas as demais.
- O foco G4 possui peso físico **Muito Pesado**. Não converter automaticamente este peso em um número de carga não publicado.
- A redação histórica de “Grau N → N rodadas para recarregar” fica **especificada** como **recuperação gradual de 1 carga por rodada até a capacidade total após esgotamento**, e não restauração integral após N rodadas.

**PENDENTE:** se o esgotamento ocorre antes do encerramento de uma rodada, esclarecer eventuais casos-limite de primeira recuperação nesse mesmo encerramento; sem alterar a posição aprovada do gatilho: **final da rodada após a troca de fluxo**.

**DEFINIDO — Pedra da Alma:** é um foco especial de magia de Sangue; muito raro e caro, acessível **a partir do nível 15** com risco/dificuldade, não comprável no nível 1. Obedece à capacidade de cargas do Grau, mas **não recarrega naturalmente**. Somente a futura Perícia **Fixar Alma** poderá possibilitar sua recarga; efeitos, custo, requisitos, prazo e riscos de Fixar Alma seguem **PENDENTES**. Não implementar recarga automática na Pedra.

### 5. Hemomancia: condição, pagamento, tempo e interrupção

**DEFINIDO — condição de uso:** para conjurar **magia de Sangue**, o Hemomante precisa **estar Sangrando**, exceto quando utiliza **Pedra da Alma equipada**. A condição não é, por si, um pagamento adicional.

**DEFINIDO — três formas de aplicar Sangrando a si mesmo:**
1. **Perícia pertinente de arma:** pagar **1 Coragem** e aplicar a condição, respeitando a habilitação; não acrescentar dano direto à Vida sem decisão.
2. **Mescla Psíquico + Sangue com Maestria Elemental:** pagar **1 Coragem total** para a mescla e ativação. O **autoderrame não exige rolagem**, aplica **Sangrando** e **não causa dano à própria Vida**.
3. **Autoataque desarmado/sem armadura:** fazer **rolagem e acertar efetivamente**, causando dano real para provocar Sangrando, com **0 Coragem** adicional; manter Pavor e riscos normais da rolagem.

**DEFINIDO — formas ALTERNATIVAS de pagar por uma conjuração de Sangue:**
- Consumir **3 marcas de Sangue** disponíveis; **OU**
- Utilizar **3 alvos atualmente Sangrando** como fonte, sem consumir ou encerrar a condição deles; **OU**
- Sacrificar **1 ponto da própria Vida**.
Não cobrar as três formas cumulativamente.

**DEFINIDO — tempos:** pagamento de **3 marcas** ou **1 Vida** permite conjurar **instantaneamente na própria ação**. Usar os **3 alvos Sangrando** exige **3 turnos totais de preparação**, com declaração no primeiro; só **uma conjuração em preparação** por vez. Os mesmos três alvos podem sustentar outras conjurações enquanto continuarem Sangrando; esse uso não causa automaticamente dano à Vida dos alvos, nem lhes remove a condição.

**DEFINIDO — resolução e interrupção da preparação com 3 alvos:**
- O Hemomante **rola e escolhe os dados mantidos no primeiro turno**, quando declara a conjuração; o resultado fica pendente.
- Um ataque recebido interrompe a preparação quando a **força do ataque for maior ou igual à força da conjuração**.
- Para essa comparação de interrupção, a força é **E + piso(P/2)**, calculada com símbolos válidos dos dados mantidos; não é E+P bruto.
- Exemplo: magia **3E + 2P = força 4** e ataque **4E = força 4**; o ataque interrompe por empate.
- A magia se conclui no **terceiro turno**, caso não seja interrompida.

**PENDENTE:** determinar se qualquer ataque que alcance essa força interrompe independentemente de acertar a DE defensiva e como o consumo de recursos funciona quando a preparação é interrompida; não adotar uma das respostas por suposição.

**DEFINIDO — Pedra da Alma equipada:** dispensa **estar Sangrando** e o **pagamento convencional em marcas/3 alvos/Vida**, permitindo conjuração de Sangue **instantânea**. Sua recarga continua excepcional (seção 4), não transformar essa dispensa em cargas infinitas.

**DEFINIDO — alcance:** magia de Hemomancia possui **8 metros de alcance**.

**DEFINIDO — ataque derrame Psíquico + Sangue contra inimigo:**
- Exige **rolagem contra a DE do alvo** e o acerto da DE; não é automático como o autoderrame.
- No acerto, causa **dano direto à Vida = E + piso(P/2)** e aplica **Sangrando**, respeitando defesas mágicas específicas já habilitadas. Em falha não aplica Sangrando nem o dano.
- O P do cálculo é o válido mantido e não anulado; conservar consequências normais de Pavor. A interpretação provisória de **1 Vida fixa** para este ataque foi **REVOGADA**.

**DEFINIDO — amplificação de Sangue:** quando uma magia de Sangue amplificada acerta e cumpre seus gatilhos, o **dano normal integral calculado do ataque** incide diretamente na **Vida**, não um +1 fixo. **Somente Escudo Arcano com elemento Sangue** ativo/aplicável pode neutralizar a propriedade de atravessar a armadura; escudos físicos e escudos arcanos de outros elementos não a neutralizam por si. A defesa específica não elimina automaticamente o ataque básico. Usar 3 alvos Sangrando como fonte não exige um segundo pagamento apenas para amplificação.

**DEFINIDO — marcas:** para cada 1 ponto de dano **realmente causado à Vida de inimigos** pelas fontes aprovadas, registrar **1 marca**. Aplicar Sangrando sem dano não gera marca; não conceder marcas fictícias pelo autoderrame sem perda de Vida.

**PENDENTE:** limite/ativação de **uma amplificação por turno**, custos/gatilhos restantes de técnicas G2/G3, nuances entre a conjuração instantânea específica de Sangue e a preparação elemental geral da seção 3.

### 6. Sangramento: duração, remoção e interações elementais

**DEFINIDO:** **Sangrando persiste** até receber tratamento, cura ou outro efeito que o remova. **Não** expira automaticamente pelo número de turnos ou rodadas. Aplicar a condição por si só **não causa dano à Vida** nem dano periódico; manter as especificidades de ataques que causem dano em separado.

**DEFINIDO — intervenção com Medicina Avançada:**
- Para **tratar e remover Sangrando**, exige-se a **Perícia Medicina Avançada**.
- O teste usa **Medicina como primeira fonte / aptidão predominante** da combinação; Medicina é um **Conhecimento**, não um Atributo.
- O teste enfrenta a **DE defensiva do alvo que recebe a intervenção**, com **Desvantagem (−1A)** conforme o modificador geral vigente.
- **Sucesso:** remove Sangrando. **Falha:** a condição permanece.
- As demais fontes da rolagem precisam respeitar as combinações e a exigência geral de Atributo na pilha; não criar exceção para dispensar essa fonte.

**DEFINIDO — aquisição:** Medicina Avançada exige **Medicina 2** e custa **1 XP**, conforme a regra geral das especializações Avançadas de Conhecimento/Prática. Ela permite a combinação **Medicina predominante + duas fontes adicionais pertinentes** (três fontes ao todo). **IMPLEMENTADO na branch deste checkpoint:** compra e composição no criador; resolução automática do estado do alvo ainda é **PENDENTE DE IMPLEMENTAÇÃO**.

**DEFINIDO — Fogo, Sagrado, Queimar e Água/Gelo:**
- **DEFINIDO — opção B confirmada pelo autor:** **Queimar remove Sangrando e desfaz Congelamento** no alvo. **Congelar não remove Sangrando** por si só.
- **Fogo G1 mesclado com Sagrado** pode **aplicar Queimar sem causar dano**.
- **Fogo G1 sem essa mescla** conserva **dano convencional à armadura**, sem conceder dano direto à Vida por inferência.
- **Congelar** (efeito de Água/Gelo) **imobiliza o alvo**; a duração aplicável do G1 deve ser lida na habilitação vigente (atualmente **1 rodada**), até revisão específica.
- **DEFINIDO:** um conjurador com **magia de Água** pode **remover Congelamento**. Essa remoção não implica dano ou aplicação de Sangrando.
- Preservar **Fogo G2 Queimar = E + P à Integridade** e **G3 Derreter = E + P à Integridade mais 1 Vida direta fixa** conforme v0.76 enquanto não houver modificação expressa desses efeitos.

**RESOLVIDO — esclarecimento autoral em 17/11/2026:** a frase “queimar tira sangramento e congelamento tb” corresponde à **opção B**: Queimar remove **Sangrando** e **Congelamento**. O autor acrescentou que **magia de Água também pode remover Congelamento**. A mera aplicação de Congelar não elimina Sangrando. **PENDENTE:** decidir se a remoção por magia de Água exige teste contra DE ou é automática, e qual Grau/procedimento se aplica; não inventar valores, custos ou ação gratuita.

### 7. Pendências preservadas e divergências de implementação

| Tema | Estado e próximo passo |
|---|---|
| **Requisitos de Perícias Avançadas** | **DEFINIDO:** Grau 2 da própria fonte, 1 XP, até três fontes pertinentes; 12 especializações cadastradas na branch |
| **Queimar × Congelar × Sangrando** | **DEFINIDO:** Queimar remove Sangrando e Congelamento; Água também pode remover Congelamento; Congelar por si não remove Sangrando |
| **Remoção de Congelamento com magia de Água** | **PENDENTE — PRÓXIMA PERGUNTA:** exige teste de DE ou pode remover automaticamente? Grau e procedimento específicos ainda não decididos |
| Redução voluntária da magia para G1 | **PENDENTE**: efeitos, custos, força e limites da redução |
| Tempos gerais de conjuração vs magias memorizadas e exceção de Sangue | **PENDENTE**: integração sem revogar silenciosamente Perícias anteriores |
| Hemomancia — interrupção e amplificação | **PENDENTE**: necessidade de ataque acertar DE; destino de recursos; limite de amplificação |
| Pedra da Alma — Fixar Alma | **PENDENTE**: definição futura completa |
| Focos — borda temporal da primeira recarga | **PENDENTE**: se esgotamento imediatamente antes do fim de rodada inicia recuperação no mesmo encerramento |
| Medicina Avançada no criador e Foundry | **IMPLEMENTADO na branch do criador:** compra 1 XP, Medicina 2, terceira fonte. **PENDENTE:** automatizar tratamento de Sangrando no alvo, integrar Foundry e mesclar branch |
| Cravar e Sobrecarga nas interfaces | **PENDENTE DE IMPLEMENTAÇÃO/VALIDAÇÃO**: −1E para Levantar Escudo, DE por peso e −1E geral da Sobrecarga |
| 15 XP iniciais | **EXPERIMENTAL**: revisar balanceamento; ainda não alterar a progressão fora do início |

**Divergências conhecidas frente ao Livro do Jogador e versões históricas:**
- v0.78 declara DE de retirada por peso a cargo do Narrador e −2E em Levantar Escudo: **substituir por tabela 1/2/3 e −1E somente nessa ação**.
- Livro do Jogador descreve recarga de focos em N rodadas sem detalhar cargas e início de recuperação: **aplicar capacidade = Grau e recuperação gradual automática no encerramento de rodada, após esgotamento**, com exceção da Pedra da Alma.
- Livro contém descrições de conjuração elemental/G1 e velocidade de G3 anteriores à revisão: **o padrão G2=2 turnos, G3=3, redução para G1 e foco −1 turno** governa onde aplicável; **conteúdos mecânicos da redução ainda pendentes**.
- Livro apresenta Conjuração Refinada com alcance pendente: **+8 m está definido**.
- O criador e o Livro ainda podem usar **orçamento inicial diferente de 15 XP**, regra ainda **EXPERIMENTAL**.
- **Atualização posterior neste checkpoint:** as **12 Perícias Avançadas** estão cadastradas no criador desta branch com **Grau 2 e custo 1 XP**, preservados os requisitos adicionais publicados; as nove novas contam com verbetes e catálogo. A implementação será efetiva no site oficial somente após integrar a branch; a ficha da `main` ainda permanece na versão anterior.

### 8. Protocolo para retomar a revisão

O autor confirmou, após este checkpoint, **requisito universal Grau 2** e **custo 1 XP** para **todas** as Perícias Avançadas de Conhecimento e Prática. Cada uma usa a própria fonte como predominante e pode adicionar **até duas fontes pertinentes**. Foram cadastradas na branch as **12 especializações** correspondentes aos seis Conhecimentos e seis Práticas; requisitos adicionais já existentes foram preservados.

**Próximo ponto exato — perguntar apenas uma coisa:** “Para remover Congelamento usando uma magia de Água, o conjurador precisa **realizar uma rolagem contra a DE do alvo** ou a **remoção ocorre automaticamente**?”

**Depois da resposta**, registrar o procedimento de remoção de Congelamento com Água, mantendo a regra de Queimar e as demais decisões já aprovadas. **Não voltar a perguntar** sobre a opção B, requisito Grau 2, custo-padrão das Avançadas, Medicina 2, autoderrame sem dano, dano E+piso(P/2), recarga automática ou momento de recarga.

**Histórico:** documentos v0.77 e v0.78 permanecem preservados; este v0.79 é aditivo e corrige somente os tópicos listados. **Alterações nesta branch:** cadastro/seleção de 12 Perícias Avançadas no criador e Codex Genético, com verbetes, catálogo e Livro do Jogador atualizados. **Não foram alterados** os dados simbólicos, custos de Perícias não avançadas, mecânicas de Cravar/Hemomancia/focos no código ou Foundry. A PR continua revisável sem alterar a `main`.
