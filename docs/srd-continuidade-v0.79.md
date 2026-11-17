---
title: "Codex RPG — SRD de Continuidade v0.79: checkpoint de decisões e pendências da revisão"
version: "0.79"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO / EXPERIMENTAL / PENDENTE — checkpoint autoral consolidado em PR revisável"
supersedes: "docs/srd-continuidade-v0.78.md, exclusivamente nos pontos expressamente corrigidos"
---

# Codex RPG — SRD de Continuidade v0.79

## 0-BS. Checkpoint autoral — 17/11/2026

**Objetivo:** preservar as decisões tomadas pelo autor na revisão sequencial de Cravar, conjuração, focos, Hemomancia, Sangramento e tratamento antes de prosseguir com outras pendências. Este documento registra as decisões e seus estados. **Nesta branch**, as **12 Perícias Avançadas** foram cadastradas no criador e no Codex Genético, com verbetes e referências atualizadas, enquanto decisões sobre conjuração, condições e demais procedimentos foram consolidadas **principalmente na documentação**. **Não declarar automatizações de foco, tratamento, Cravar, Sobrecarga ou Foundry como concluídas.** Não executar mudanças de ficha ou balanceamento por inferência.

**Precedência:** decisões autorais recentes deste checkpoint prevalecem sobre trechos incompatíveis de SRDs anteriores, Livro do Jogador e comportamento implementado; onde este documento for omisso, permanecem as regras anteriores válidas. Custos, dados, requisitos e efeitos não citados não foram modificados.

**Legenda:** **DEFINIDO** = decisão expressa do autor; **EXPERIMENTAL** = orçamento/hipótese em teste; **PROPOSTO** = alternativa sem aprovação; **PENDENTE** = falta decisão ou procedimento. Nenhum item PENDENTE pode ser tratado como regra pronta.

### 1. Criação de personagem e combinações de aptidões

**DEFINIDO:** o jogador começa com o sistema aberto de Aprendiz e precisa comprar pelo menos **1 Atributo G1** e **1 Conhecimento ou Prática G1**; o XP restante é de distribuição livre entre as categorias e Perícias habilitadas. Não há reservas obrigatórias de XP por categoria ou para Perícias.

**EXPERIMENTAL (última decisão):** orçamento inicial compartilhado de **15 XP**, substituindo, para o novo ciclo de testes, os valores anteriores de 18/19 XP. Manter custos e requisitos vigentes; não extrapolar esta alteração à progressão após a criação. Atributo G1 custa 1 XP; Conhecimento/Prática G1 custa 2 XP; a compra obrigatória mínima de 3 XP deixa 12 XP livres sob a hipótese de 15 XP.

**DEFINIDO — composição nas fichas de jogadores:** permitir iniciar a seleção por qualquer uma das categorias, desde que a combinação normal não repita categorias: **não** combinar Atributo + Atributo, Conhecimento + Conhecimento ou Prática + Prática em uma combinação comum. A ordem de seleção não limita a liberdade de escolha.

**DEFINIDO — esclarecimento autoral sobre duas fontes de Atributo (17/11/2026):** quando houver **Conhecimento ou Prática como fonte central da combinação de três fontes**, as **outras duas podem ser dois Atributos diferentes**, desde que pertinentes à ação e que a composição de três fontes seja **habilitada pela Perícia Avançada ou regra especial já aprovada**. Ex.: **Medicina (Conhecimento) + Inteligência + Destreza** ou **Disciplina (Prática) + Força + Agilidade**, nas respectivas condições de habilitação. A simples posse de um Conhecimento ou Prática **não substitui requisitos de Perícias Avançadas** nem habilita automaticamente três fontes. A restrição contra repetir o **mesmo Atributo** continua válida.

**DEFINIDO — habilitações especiais:**
- Com **Disciplina Avançada**, pode-se acrescentar **mais uma fonte/combinação pertinente** à seleção normal, sem escolher Disciplina novamente por essa habilitação.
- **Manejo Duplo** habilita selecionar **Disciplina duas vezes**, segundo sua aplicação própria; não estender esta exceção a outras Práticas nem a quem não possua Manejo Duplo.
- **DEFINIDO — monstros/criaturas com ficha somente de Atributos (17/11/2026, decisão posterior por porte):** constituem **exceção** à exigência de Conhecimento ou Prática na composição comum. Criaturas/monstros **Grandes** podem combinar **até 3 Atributos distintos** pertinentes à ação (ex.: **Força + Agilidade + Vigor**). Criaturas/monstros **Pequenos e Médios** podem combinar **até 2 Atributos distintos** pertinentes à ação (ex.: **Força + Agilidade**). **Nunca** escolher duas vezes o mesmo Atributo. O terceiro Atributo para criatura sem Conhecimentos/Práticas **exige ser do tipo Grande**. Isso não altera dados por Grau nem limites gerais de rolagem/manutenção.
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

**DEFINIDO:** qualquer combinação autorizada de Atributos diferentes **não permite repetir o mesmo Atributo**. Jogadores e humanoides podem usar **Conhecimento/Prática predominante + 2 Atributos distintos** quando habilitados. **Exceção definida por tipo de monstro:** ficha só de Atributos permite **até 2** fontes para Pequenos/Médios e **até 3** para **Grandes**, sempre Atributos distintos, sem exigir Conhecimento/Prática na ficha excepcional. **PENDENTE:** demais relações entre fontes, dados e Grau de monstros não especificadas neste checkpoint. Não inventar efeitos temáticos adicionais.

### 2. Cravar, retirada e Sobrecarga

**DEFINIDO — retirada de Cravar (correção autoral posterior, 17/11/2026; substitui a combinação mais aberta da v0.78):** exige **uma rolagem combinando exatamente uma Prática entre Disciplina ou Atletismo com exatamente um Atributo entre Força, Vigor ou Destreza**, conforme a ação. São combinações permitidas: **Disciplina + Força; Disciplina + Vigor; Disciplina + Destreza; Atletismo + Força; Atletismo + Vigor; Atletismo + Destreza**. Não vale usar apenas a Prática ou apenas o Atributo, trocar a Prática por outra fonte, somar duas Práticas ou escolher dois Atributos nessa retirada padrão. A **DE depende da categoria de peso da arma cravada**: **Leve 1; Média 2; Pesada 3**, com **teto geral 4**. Acertar a DE retira a arma; falhar mantém a condição. Nenhum custo de PP/Coragem ou Perícia de arma foi acrescentado à retirada. **Esta regra é específica de retirar Cravar e não altera as combinações gerais de outras ações.**

**DEFINIDO — tipo de ação (opção A, 17/11/2026):** tentar **retirar uma arma cravada exige gastar uma ação própria do personagem** em seu turno, inclusive quando a tentativa falha. A retirada **não pode ser executada como parte de Levantar Escudo** ou de outra ação. Uma tentativa é dirigida à arma escolhida e respeita o teste e a DE definidos; esta decisão **não concede ação adicional nem cria custo de PP ou Coragem**.

**DEFINIDO — destino após retirada bem-sucedida (opções A e B, 17/11/2026):** o personagem **pode tentar retirar uma arma cravada mesmo sem mão livre**, usando o teste e a DE de retirada já definidos. **Se tiver uma mão livre e obtiver sucesso**, a arma **vai imediatamente para essa mão**, sem exigir outra ação de coleta. **Se estiver com as duas mãos ocupadas e obtiver sucesso**, a arma **se desprende e cai no chão**; não fica equipada nem passa automaticamente ao inventário. **Em falha**, permanece cravada no escudo. Em ambos os sucessos, a arma deixa de acrescentar peso ao escudo e elimina somente seu próprio −1E em Levantar Escudo. Não criar penalidade de rolagem, ação ou custo adicional para o caso sem mão livre.

**IMPORTANTE:** v0.77/v0.78 só autorizam a **aplicação de Cravar** com arma **Média ou Pesada** e seus gatilhos já aprovados; a existência de uma DE de retirada para arma Leve **não libera, por si só, armas Leves para cravar**. Conservar a restrição até decisão explícita.

**DEFINIDO — penalidade cumulativa (opção B, 17/11/2026):** **cada arma cravada no mesmo escudo impõe −1E** exclusivamente na ação de **Levantar Escudo**. As penalidades **se acumulam por arma**: 1 arma = −1E; 2 = −2E; 3 = −3E; 4 = −4E, sempre sujeitas às regras gerais de resolução dos Êxitos, sem criar novo teto de armas. A remoção de cada arma **retira o −1E correspondente**, mantendo a penalidade das demais ainda presas. O valor anterior de **−2E fixos** da v0.77/v0.78 está revogado. A penalidade de Cravar **não se aplica aos demais testes**; **Sobrecarga** permanece condição independente (−1E em todos os testes). A aplicação de Cravar conserva armas Médias/Pesadas e demais gatilhos definidos.

**DEFINIDO — Sobrecarga:** a condição de Sobrecarga aplica **−1E em todos os testes**. O peso natural, a dimensão e as proteções de criaturas devem aproveitar as regras já existentes para o porte, sem criar novas tabelas ou algoritmos.

**DEFINIDO:** múltiplas armas cravadas acumulam −1E por arma em Levantar Escudo. Retirar uma arma exige **ação própria** do personagem, separada de Levantar Escudo; em sucesso, **com mão livre → arma na mão de quem retirou; sem mão livre → arma no chão**. Os procedimentos centrais de Cravar deste checkpoint estão **RESOLVIDOS**. Eventuais casos não descritos não recebem exceções automáticas. **PENDENTE DE IMPLEMENTAÇÃO:** interfaces podem usar −2E fixos, DE manual ou posse antiga da arma; reconciliar com estas decisões.

### 3. Conjuração: graus e preparação

**DEFINIDO — novo padrão geral de preparação elemental:**
- Magia elemental **G2**: **2 turnos de preparação** sem aceleração.
- É possível **reduzir uma magia para G1** a fim de lançá-la **instantaneamente**.
- **DEFINIDO — opção A (17/11/2026):** ao reduzir voluntariamente uma **magia elemental G2 para G1**, ela passa a utilizar **somente os efeitos, propriedades, dano e área previstos para G1**. **Não mantém** efeitos de G2, nem mesmo parcialmente, e a conjuração reduzida pode ser lançada **imediatamente**. Isso não concede novas propriedades de G1 nem altera custos, requisitos, dados e limites já aprovados.
- **DEFINIDO — G3 integral:** magia elemental G3 leva **3 turnos de preparação sem foco**, preservando os efeitos completos de G3.
- **DEFINIDO — aceleração por carga (correção de 17/11/2026):** cada **1 carga** gasta de um **foco mágico comum** reduz a preparação em **1 turno**. **É permitido gastar 2 cargas na mesma conjuração G3**. A aceleração **não reduz o Grau, dano, efeitos ou propriedades**. Exemplo G3: **0 cargas = 3 turnos; 1 carga = 2 turnos; 2 cargas = 1 turno**. O foco precisa ter as cargas disponíveis e as consome normalmente. A restrição anterior de somente uma carga por magia fica revogada. **DEFINIDO — contagem de turnos (17/11/2026):** **1 turno significa lançar a magia no próprio turno do conjurador, instantaneamente**. Assim, uma magia G3 acelerada com **2 cargas já é instantânea**, com todos os efeitos de G3; uma terceira carga não é necessária e não há necessidade de contar 0 turno.
- Exemplo: **foco G1 (1 carga) + magia G2 (2 turnos) = lançamento no mesmo turno**, seguido do regime de recarga do foco.

**DEFINIDO — distinção entre Grau e tempo de preparação (17/11/2026):** uma magia pode ser **elevada de G2 para G3**, preservando os efeitos e o tempo próprio de G3, ou **reduzida a G1** para utilizar exclusivamente os efeitos G1 com lançamento imediato. **Acelerar G3 com 1 ou 2 cargas do foco preserva todos os seus efeitos de G3**; não se trata de conjurar como G2. Uma conjuração efetuada em G2 não recebe propriedades exclusivas de G3 ou G4. O autor não aprovou redução intermediária livre G3→G2. Permanecem PENDENTES o tempo geral de G4, integração com magias memorizadas e detalhes de aceleração ainda não especificados.

**DEFINIDO — Conjuração Refinada:** aumenta o alcance das magias em **+8 metros**, corrigindo a pendência de alcance no Livro do Jogador; conservar os requisitos/custo históricos até eventual revisão explícita.

### 4. Focos mágicos: carga, recarga e exceção

**DEFINIDO:** capacidade máxima de cargas do foco corresponde a seu Grau:

| Foco | Cargas máximas | Recuperação automática após esgotar |
|---|---:|---|
| G1 | 1 | 1 carga por rodada |
| G2 | 2 | 1 carga por rodada |
| G3 | 3 | 1 carga por rodada |
| G4 | 4 | 1 carga por rodada |

- **Cada 1 carga gasta** reduz a preparação em **1 turno**, independentemente de a conjuração acelerada ser G2 ou G3. **Duas cargas podem ser gastas na mesma magia G3**, se disponíveis, reduzindo de 3 para **1 turno, isto é, lançamento instantâneo no turno do conjurador**. Gastar cargas não muda Grau ou efeitos.
- O foco **entra em recarga quando todas as cargas se esgotam**, não a cada carga gasta.
- **DEFINIDO — opção A, 17/11/2026:** quando a **última carga do foco comum é gasta durante uma rodada**, o foco recupera **1 carga já no encerramento dessa mesma rodada**, depois de concluído o fluxo de jogadores **e** inimigos. A recarga é automática, inclusive em combate, e não exige ação, PP ou Coragem. Se o foco continuar abaixo do máximo, recupera **1 carga no fim de cada rodada seguinte** até encher. Não adiantar essa recuperação para o fim do turno individual de um personagem.
- As cargas já recuperadas **podem ser usadas imediatamente nas próximas oportunidades**, ainda que o foco não esteja cheio. Usar uma carga recuperada não exige que se aguardem todas as demais.
- O foco G4 possui peso físico **Muito Pesado**. Não converter automaticamente este peso em um número de carga não publicado.
- A redação histórica de “Grau N → N rodadas para recarregar” fica **especificada** como **recuperação gradual de 1 carga por rodada até a capacidade total após esgotamento**, e não restauração integral após N rodadas.

**RESOLVIDO — borda temporal da recarga:** o esgotamento durante a rodada inicia a recuperação no **encerramento da própria rodada** (após os dois fluxos). Exemplo: foco comum G2 com 2 cargas, gasta ambas durante a rodada 1 → **fim da rodada 1: 1 carga disponível** → **fim da rodada 2: volta a 2 cargas**, se nenhuma carga for gasta no intervalo. **Exceção preservada:** Pedra da Alma não se recarrega naturalmente; a futura Perícia Fixar Alma permanece PENDENTE. Não confundir o limite de 1 carga por rodada com a quantidade de cargas que podem ser gastas para acelerar uma magia.

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
- **DEFINIDO (opção A):** um ataque só interrompe a preparação se **(1)** alcançar ou superar a **DE defensiva do Hemomante** **e (2)** sua força for **igual ou superior** à força da magia em preparação. Ambas as condições são obrigatórias; superar a força sem acertar a DE **não interrompe**.
- Para essa comparação de interrupção, a força é **E + piso(P/2)**, calculada com símbolos válidos dos dados mantidos; não é E+P bruto.
- Exemplo: magia **3E + 2P = força 4** e ataque **4E = força 4**. O empate de força **interrompe somente se o ataque também atingir a DE defensiva do Hemomante**. Não alcançar a DE conserva a canalização, mesmo com força suficiente.
- A magia se conclui no **terceiro turno**, caso não seja interrompida.
- **DEFINIDO — opção A (17/11/2026):** quando um ataque válido interrompe a canalização, **a conjuração em preparação é perdida**, inclusive a rolagem e os dados mantidos anteriormente. Para tentar conjurar novamente, o Hemomante precisa **declarar uma nova conjuração, realizar nova rolagem e começar outros três turnos de preparação**. Não pode retomar o tempo nem o resultado anteriores.

**DEFINIDO:** a interrupção exige acertar a DE defensiva do Hemomante e igualar ou superar a força da magia; se ocorrer, a preparação e a rolagem são perdidas, e a próxima tentativa exige três turnos e nova rolagem. **DEFINIDO — opção A (17/11/2026):** **PP, Coragem e cargas de foco já efetivamente pagos na tentativa interrompida não são devolvidos**. Recursos não pagos não passam a ser cobrados em razão da interrupção. Os três alvos Sangrando não perdem sua condição apenas por sustentarem a conjuração.

**DEFINIDO — Pedra da Alma equipada:** dispensa **estar Sangrando** e o **pagamento convencional em marcas/3 alvos/Vida**, permitindo conjuração de Sangue **instantânea**. Sua recarga continua excepcional (seção 4), não transformar essa dispensa em cargas infinitas.

**DEFINIDO — alcance:** magia de Hemomancia possui **8 metros de alcance**.

**DEFINIDO — ataque derrame Psíquico + Sangue contra inimigo:**
- Exige **rolagem contra a DE do alvo** e o acerto da DE; não é automático como o autoderrame.
- No acerto, causa **dano direto à Vida = E + piso(P/2)** e aplica **Sangrando**, respeitando defesas mágicas específicas já habilitadas. Em falha não aplica Sangrando nem o dano.
- O P do cálculo é o válido mantido e não anulado; conservar consequências normais de Pavor. A interpretação provisória de **1 Vida fixa** para este ataque foi **REVOGADA**.

**DEFINIDO — amplificação de Sangue:** quando uma magia de Sangue amplificada acerta e cumpre seus gatilhos, o **dano normal integral calculado do ataque** incide diretamente na **Vida**, não um +1 fixo. **Somente Escudo Arcano com elemento Sangue** ativo/aplicável pode neutralizar a propriedade de atravessar a armadura; escudos físicos e escudos arcanos de outros elementos não a neutralizam por si. A defesa específica não elimina automaticamente o ataque básico. Usar 3 alvos Sangrando como fonte não exige um segundo pagamento apenas para amplificação.

**DEFINIDO — marcas:** para cada 1 ponto de dano **realmente causado à Vida de inimigos** pelas fontes aprovadas, registrar **1 marca**. Aplicar Sangrando sem dano não gera marca; não conceder marcas fictícias pelo autoderrame sem perda de Vida.

**DEFINIDO — opção A (17/11/2026):** o Hemomante pode realizar **somente uma amplificação de Sangue por turno**, mesmo quando possui recursos para pagar mais de uma. Preservar a escolha exclusiva histórica entre amplificar a magia, manter dado adicional ou elevar dado, conforme custos e requisitos já válidos; não acumular múltiplas ativações no mesmo turno. **PENDENTE:** custos/gatilhos restantes de técnicas G2/G3 e nuances entre a conjuração instantânea específica de Sangue e a preparação elemental geral da seção 3.

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
- **DEFINIDO — Grau e procedimento (opção A, 17/11/2026):** **Água Grau 1** já permite remover Congelamento. Um conjurador habilitado realiza **rolagem de magia de Água G1 contra a DE defensiva do alvo**. Se **alcançar a DE**, remove Congelamento e encerra a imobilização por essa condição. Se **falhar**, Congelamento permanece até ser removido ou expirar pela duração pertinente. A remoção não causa dano nem aplica Sangrando por si só. Conservar os custos e requisitos já aprovados para conjurar.
- Preservar **Fogo G2 Queimar = E + P à Integridade** e **G3 Derreter = E + P à Integridade mais 1 Vida direta fixa** conforme v0.76 enquanto não houver modificação expressa desses efeitos.

**RESOLVIDO — esclarecimento autoral em 17/11/2026:** a frase “queimar tira sangramento e congelamento tb” corresponde à **opção B**: Queimar remove **Sangrando** e **Congelamento**. O autor acrescentou que **magia de Água também pode remover Congelamento**. A mera aplicação de Congelar não elimina Sangrando. **DEFINIDO:** remover Congelamento com magia de Água **exige teste contra a DE defensiva do alvo**, não é automático. **DEFINIDO:** **G1 é suficiente**, sem requisito de G2. Os custos e requisitos gerais de conjuração permanecem; particularidades não regulamentadas seguem PENDENTES, sem criar custo extra.

### 7. Pendências preservadas e divergências de implementação

| Tema | Estado e próximo passo |
|---|---|
| **Requisitos de Perícias Avançadas** | **DEFINIDO:** Grau 2 da própria fonte, 1 XP, até três fontes pertinentes; 12 especializações cadastradas na branch |
| **Queimar × Congelar × Sangrando** | **DEFINIDO:** Queimar remove Sangrando e Congelamento; Água também pode remover Congelamento; Congelar por si não remove Sangrando |
| **Remoção de Congelamento com magia de Água** | **DEFINIDO:** rolar contra a DE defensiva do alvo; sucesso remove Congelamento e a imobilização correspondente, falha não remove |
| **Grau mínimo para descongelar com Água** | **DEFINIDO:** Água G1 já permite remover Congelamento mediante teste contra DE defensiva do alvo |
| **Grau da magia e aceleração por foco** | **DEFINIDO:** G3 pleno demora 3 turnos; 1 carga reduz para 2 e 2 cargas reduzem para **1 turno = instantâneo no turno do conjurador**, mantendo Grau/efeitos G3. Redução voluntária a G1 também é imediata, mas usa só efeitos G1. **Terceira carga não é necessária.** |
| Tempos gerais de conjuração vs magias memorizadas e exceção de Sangue | **PENDENTE**: integração sem revogar silenciosamente Perícias anteriores |
| Hemomancia — interrupção e amplificação | **DEFINIDO:** ataque acerta a DE defensiva **e** força ≥ à magia; perde a canalização, reinicia com três turnos e nova rolagem, e **não recupera PP/Coragem/cargas já gastos**. **DEFINIDO:** apenas uma amplificação de Sangue por turno |
| Pedra da Alma — Fixar Alma | **PENDENTE**: definição futura completa |
| Focos — borda temporal da primeira recarga | **DEFINIDO:** quando o foco comum esgota durante a rodada, recupera 1 carga **no fim dessa mesma rodada**, depois do fluxo de jogadores e inimigos; Pedra da Alma é exceção |
| Medicina Avançada no criador e Foundry | **IMPLEMENTADO na branch do criador:** compra 1 XP, Medicina 2, terceira fonte. **PENDENTE:** automatizar tratamento de Sangrando no alvo, integrar Foundry e mesclar branch |
| Cravar e Sobrecarga nas interfaces | **PENDENTE DE IMPLEMENTAÇÃO/VALIDAÇÃO**: exigir **Disciplina ou Atletismo + Força, Vigor ou Destreza** na retirada, aplicar **−1E cumulativo por arma cravada somente em Levantar Escudo**, retirar a penalidade por arma removida, calcular DE por peso e colocar arma removida com sucesso **na mão livre de quem retirou ou no chão quando não houver mão livre**, além do −1E geral independente da Sobrecarga |
| 15 XP iniciais | **EXPERIMENTAL**: revisar balanceamento; ainda não alterar a progressão fora do início |

### 7.1. Auditoria de pendências deste checkpoint (17/11/2026)

**Método de contagem:** uma **frente** representa um assunto distinto ainda não encerrado; subperguntas e repetições na seção 7 não são somadas como novas frentes. Esta auditoria cobre **somente o SRD v0.79 e as decisões aqui consolidadas**; não é uma contagem de todas as pendências históricas do Livro do Jogador, Foundry ou outras versões. **A decisão sobre a primeira recarga do foco foi resolvida e não integra a contagem.**

**6 frentes de regras ou procedimentos PENDENTES** (a frente de Cravar foi resolvida nesta revisão):

1. **Combinações para monstros:** **DEFINIDO** que monstros só de Atributos **Pequenos/Médios** podem combinar até **2 Atributos distintos**, e os **Grandes**, até **3 distintos**, como exceção à necessidade de Conhecimento/Prática; humanoides usam regra dos jogadores. **PENDENTE:** outros detalhes relativos às fontes, graus e dados de monstros não expressamente fixados.
2. **Conjuração G4:** tempo geral de preparação e limites de aceleração ainda não definidos para esse Grau.
3. **Magias memorizadas e cronologia de conjuração:** compatibilidade de preparação, memorização e exceções de Sangue com os novos tempos elementais e efeitos históricos.
4. **Pedra da Alma — Fixar Alma:** requisitos, XP, procedimento, custo, recuperação de cargas e riscos desta futura Perícia.
5. **Hemomancia avançada:** custos e gatilhos ainda incompletos das técnicas de Sangue G2/G3; a regra de uma amplificação por turno já está DEFINIDA.
6. **Procedimentos elementais não especificados:** pormenores de execução de efeitos utilitários e outras interações de Água/Gelo/Fogo não expressamente resolvidas; não recriar custos nem DE.

**RESOLVIDO nesta revisão — Cravar:** a retirada exige **uma ação própria** e rolagem **Disciplina ou Atletismo + Força, Vigor ou Destreza**, não combinada com Levantar Escudo; a penalidade de −1E é cumulativa por arma, e a retirada bem-sucedida transfere a arma à mão livre de quem a retira ou ao chão quando não houver mão disponível. A execução nas interfaces ainda requer implementação e testes.

**4 frentes de implementação/validação**, distintas de regras aprovadas:

1. **Condições e alvos no criador/Foundry:** automatizar tratamento de Sangrando por Medicina Avançada e remoção de Congelamento por Água/Queimar.
2. **Cravar e Sobrecarga nas interfaces:** a retirada deve **consumir ação própria, separada de Levantar Escudo**, exigir **Disciplina ou Atletismo + Força, Vigor ou Destreza** contra DE por peso e, em sucesso, transferir a arma **à mão livre de quem retirou ou ao chão quando não houver mão livre**; aplicar **−1E por arma cravada** em Levantar Escudo (cumulativo) e −1E geral da Sobrecarga, preservando demais funcionalidades.
3. **Conjuração, focos e Hemomancia:** implementar contagem de turnos, gasto de múltiplas cargas, recarga no encerramento da mesma rodada, interrupção e seus recursos; respeitar a exceção da Pedra da Alma.
4. **Fluxo de criaturas/combinações e testes de regressão:** validar **Conhecimento/Prática com dois Atributos diferentes** quando habilitado; bloquear repetição do mesmo Atributo; aplicar **até 2 Atributos distintos em monstros só de Atributos Pequenos/Médios e até 3 apenas nos Grandes**; validar humanoides, compositor, versões móvel e clássica e compatibilidade com Foundry.

**1 hipótese EXPERIMENTAL separada:** orçamento inicial de **15 XP**, ainda sujeito a playtest e aprovação definitiva; o criador e documentos históricos podem divergir. **Publicação:** a integração da PR #58 à `main` permanece uma etapa de revisão, **não** é uma nova regra PENDENTE.

**Resumo desta auditoria: 6 frentes de regras + 4 frentes de implementação/validação + 1 frente experimental = 11 frentes de acompanhamento.** Não interpretar como exatamente 12 perguntas de sim/não: cada frente pode conter vários detalhes.

**Divergências conhecidas frente ao Livro do Jogador e versões históricas:**
- v0.78 traz retirada por fontes amplas, DE definida pelo Narrador e −2E fixos em Levantar Escudo: **substituir as fontes por Disciplina ou Atletismo + Força, Vigor ou Destreza; aplicar tabela de DE por peso 1/2/3 e −1E por arma cravada, cumulativo, somente em Levantar Escudo**.
- Livro do Jogador descreve recarga de focos em N rodadas sem detalhar cargas e início de recuperação: **aplicar capacidade = Grau e recuperação gradual automática no encerramento de rodada, após esgotamento**, com exceção da Pedra da Alma.
- Livro contém descrições de conjuração elemental/G1 e velocidade de G3 anteriores à revisão: **G2=2 turnos, G3=3 turnos, redução a G1 imediata e foco −1 turno por carga** prevalecem onde aplicáveis. **Duas cargas na mesma G3** reduzem sua preparação a **1 turno, isto é, conjuração instantânea no próprio turno**, sem perder efeitos G3; permanecem pendências de G4 e integração com memorização.
- Livro apresenta Conjuração Refinada com alcance pendente: **+8 m está definido**.
- O criador e o Livro ainda podem usar **orçamento inicial diferente de 15 XP**, regra ainda **EXPERIMENTAL**.
- **Atualização posterior neste checkpoint:** as **12 Perícias Avançadas** estão cadastradas no criador desta branch com **Grau 2 e custo 1 XP**, preservados os requisitos adicionais publicados; as nove novas contam com verbetes e catálogo. A implementação será efetiva no site oficial somente após integrar a branch; a ficha da `main` ainda permanece na versão anterior.

### 8. Protocolo para retomar a revisão

O autor confirmou, após este checkpoint, **requisito universal Grau 2** e **custo 1 XP** para **todas** as Perícias Avançadas de Conhecimento e Prática. Cada uma usa a própria fonte como predominante e pode adicionar **até duas fontes pertinentes**. Foram cadastradas na branch as **12 especializações** correspondentes aos seis Conhecimentos e seis Práticas; requisitos adicionais já existentes foram preservados.

**Próximo ponto exato — perguntar apenas uma coisa:** “Qual é o **tempo-base de preparação de uma magia elemental G4 sem foco**: **4 turnos**, seguindo a progressão G2=2/G3=3, ou **outro tempo** a especificar pelo autor?”

**Depois da resposta**, registrar somente o tempo-base para conjuração elemental G4; não inventar custos, efeitos ou acelerações não aprovadas. Não reabrir a exceção já DEFINIDA de que **monstros Grandes só de Atributos podem combinar até 3 Atributos distintos**, enquanto os Pequenos/Médios podem usar até 2, nem a permissão de **Conhecimento/Prática + dois Atributos diferentes** quando habilitada. Não reabrir a ação própria obrigatória para retirar Cravar, a destinação da arma nem a penalidade cumulativa de −1E por arma. Não reabrir a recarga no encerramento da mesma rodada, nem a definição de que **1 turno é instantâneo no turno do conjurador** e duas cargas aceleram G3 até isso. Não reabrir a regra aprovada de perda de recursos já pagos, nem a DE defensiva, a força ou o reinício integral de três turnos com nova rolagem. Não reabrir o requisito Água G1 ou a necessidade de teste para descongelar. **Não voltar a perguntar** sobre a opção B, requisito Grau 2, custo-padrão das Avançadas, Medicina 2, autoderrame sem dano, dano E+piso(P/2), recarga automática ou momento de recarga.

**Histórico:** documentos v0.77 e v0.78 permanecem preservados; este v0.79 é aditivo e corrige somente os tópicos listados. **Alterações nesta branch:** cadastro/seleção de 12 Perícias Avançadas no criador e Codex Genético, com verbetes, catálogo e Livro do Jogador atualizados. **Não foram alterados** os dados simbólicos, custos de Perícias não avançadas, mecânicas de Cravar/Hemomancia/focos no código ou Foundry. A PR continua revisável sem alterar a `main`.
