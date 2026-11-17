# Codex RPG — Livro do Jogador
## Edição de leitura do portal · v0.13 (12 de novembro de 2026)

> **Documento em desenvolvimento.** A definição mais recente está no [SRD de Continuidade v0.78](srd-continuidade-v0.78.md) (retirar Cravar com Força e/ou Atletismo contra DE pelo peso, máximo 4), após o [SRD v0.77](srd-continuidade-v0.77.md) (Cravar arma no escudo), após o [SRD v0.76](srd-continuidade-v0.76.md) (Fogo G2 Queimar e G3 Derreter), após o [SRD v0.75](srd-continuidade-v0.75.md) (Escudo Arcano de Sangue contra Hemomancia), após o [SRD v0.74](srd-continuidade-v0.74.md) (dano integral da magia de Sangue amplificada à Vida), após o [SRD v0.73](srd-continuidade-v0.73.md) (Hemomancia: sem Extração separada, 1 Vida própria ou 3 Sangues inimigos para amplificar), após [SRD v0.72](srd-continuidade-v0.72.md) (1 marca de Sangue por ponto de Vida perdido); a revisão experimental de Hemomancia está no [SRD v0.71](srd-continuidade-v0.71.md) (rework da Hemomancia, protótipo de contador e Transfusão Sanguinária), sucedendo o [SRD v0.70](srd-continuidade-v0.70.md) (Sangramento como estado que atravessa armadura), seguido do [SRD v0.69](srd-continuidade-v0.69.md) (Perfurante, Pavor e Barulhenta); seguida do [SRD v0.68](srd-continuidade-v0.68.md) (afinidade por armadura do alvo; peso natural de criaturas pendente), após [v0.67](srd-continuidade-v0.67.md) (Balanço por carga), e [v0.66](srd-continuidade-v0.66.md) (DE de armaduras para todas as defesas; teto total 12), seguida do [SRD v0.65](srd-continuidade-v0.65.md) (VT experimental de armas G1), seguida do [SRD v0.64](srd-continuidade-v0.64.md) (visualização de custos raciais), seguida do [SRD v0.63](srd-continuidade-v0.63.md) (troca de raça sem herdar o Atributo escolhido anteriormente), seguida do [SRD v0.62](srd-continuidade-v0.62.md) (Lucker Puro: Inteligência + Destreza), seguida do [SRD v0.61](srd-continuidade-v0.61.md) (mapa como padrão), que sucede o [SRD v0.60](srd-continuidade-v0.60.md) (múltiplas fichas de jogadores), mantendo o [SRD v0.59](srd-continuidade-v0.59.md) (identidade), que define **Origem como Raça** na identidade; o orçamento de **18 XP iniciais [EXPERIMENTAL]** continua no [SRD v0.58](srd-continuidade-v0.58.md), sobre as tabelas da [v0.56](srd-continuidade-v0.56.md) e sucede a [v0.55](srd-continuidade-v0.55.md) (linhagens), v0.54 (escudos) e v0.53 (Domar). A `main` inclui essas revisões publicadas. Este livro apresenta as regras de modo didático e diferencia regras definidas, hipóteses de playtest e pontos pendentes. O histórico anterior foi preservado em [arquivo/v0.5](arquivo/livro-do-jogador-v0.5-legado.md).

### Estado das regras
**DEFINIDO** — confirmado pelo autor. **EXPERIMENTAL** — números para playtest. **PROPOSTO** — alternativa não aprovada. **PENDENTE** — procedimento incompleto.

### Linhagens de Aprendizes — custos revistos em 17/11/2026 [SRD v0.56]

**Criação e Codex Genético [DEFINIDO, SRD v0.61]:** ao escolher Lucker de Sangue, **Vigor 1 + Agilidade 1** entram automaticamente na ficha; Lucker Puro recebe **Inteligência 1 + Destreza 1**; Runa Espinhos, **Vigor 1 + Força 1**. Esses dois Graus 1 têm **0 XP** na tabela racial, contam para o requisito mínimo de Atributo e ficam visíveis no mapa. Humano não recebe Grau de Atributo automático. O botão **“Começar com”** compra imediatamente o Grau 1 de outro Atributo pelo custo da raça, quando necessário. **O Codex Genético é o modo de construção principal**, mas o visualizador por listas continua opcional. **Ainda é obrigatório comprar um Conhecimento ou Prática G1.** A v0.61 substitui a exigência da v0.56 de selecionar manualmente cada Grau 1 favorecido; a **v0.62 corrige o par do Lucker Puro**, devolve Influência ao preço normal e impede acumular Graus exclusivamente por sucessivos cliques em “Começar com”. A **v0.63 faz a troca de raça reiniciar a seleção “Começar com”**, evitando herdar Força da Runa ou Agilidade do Lucker de Sangue. Para fichas legadas, **Revisar graus extras** exige confirmação e pode remover G1 comprados; exporte antes.

**Gerenciador de fichas [DEFINIDO, SRD v0.60]:** o mesmo navegador pode manter vários personagens de raças diferentes, cada um com XP, compras, itens, rolagens e progresso independentes. Na barra **Minhas fichas de jogadores**, use **Nova ficha**, **Duplicar**, **Excluir** ou selecione outro Aprendiz. Importar JSON adiciona uma ficha; exportar JSON salva uma cópia externa. Fichas antigas são migradas sem exclusão do salvamento legado. Não há sincronização entre dispositivos.

**Identidade [DEFINIDO, SRD v0.59]:** **Origem é a Raça**. Na Etapa 1, o seletor **Origem / Raça** ocupa a posição antes usada por “Origem narrativa”, ao lado do Conceito. Não há dois campos de origem nem seleção de linhagem repetida embaixo. Conceito, Virtude e Personalidade continuam livres; fichas legadas preservam seu campo narrativo antigo em JSON, sem convertê-lo em raça.

Todos começam como **Aprendizes**, sem classe fixa. A linhagem concede benefícios gratuitos e escolhe a faixa de XP de fontes específicas:

| Linhagem | Atributos com desconto | Atributos elevados | Práticas elevadas | Benefício inicial |
|---|---|---|---|---|
| **Lucker de Sangue** | Vigor e Agilidade | Influência | Apresentação | Elemento Sangue |
| **Lucker Puro** | Inteligência e Destreza | Força | Atletismo | Criar Item de Foco e Magia + Sangue, Trevas **ou** Veneno |
| **Runa Espinhos** | Vigor e Força | Agilidade e Destreza | — | Pugilismo, Criar Item de Foco e Magia + dois elementos distintos entre Ar/Água/Terra/Fogo |
| **Humano** | — | — | — | Perseverança Humana: rerrolar um teste por descanso longo |

As três faixas **desconto / normal / elevado** estão tabeladas no [SRD v0.56](srd-continuidade-v0.56.md). **No Codex Genético e nas listas (SRD v0.64), ↓ XP reduzido indica desconto racial e ↑ XP aumentado indica custo elevado; contornos diferentes distinguem as fontes e não concedem Graus automaticamente.** Uma fonte elevada **não custa automaticamente o dobro**: aplica-se a coluna elevada. As Perícias raciais gratuitas não consomem XP nem concedem Graus de fontes. A criação ainda exige uma compra de Atributo G1 e uma de Conhecimento/Prática G1.

**Perseverança Humana:** a ficha controla manualmente uso e recarga; a rerrolagem automatizada, o momento de declaração e o tratamento de recursos já gastos continuam pendentes.

### Atualização defensiva de 17/11/2026 — DE geral de armaduras [DEFINIDO, SRD v0.66]

**Decisão posterior do autor (substitui a restrição antiga de esquiva):** a Armadura **Muito Leve concede +2 DE**, a **Leve concede +1 DE** e esses bônus valem **em todas as defesas**, não somente ao esquivar. Armadura Média modifica 0; Pesada −1; Muito Pesada −2. Aplique após a DE natural (teto 9) e respeite **teto máximo absoluto de 12 na DE defensiva final**. O bônus da mesma armadura não pode ser somado novamente por postura de esquiva. O exemplo da ficha com DE natural 1 e Armadura Leve equipada deve mostrar **DE defensiva 2**. Sem armadura, volta a 1. Integridade é proteção separada; não altera a fórmula de DE.

### Atualização defensiva de 16/11/2026 — Levantar Escudo e Perfurante [DEFINIDO / PENDENTE]

**Escudo físico:** usar a ação **Levantar Escudo** e rolar **Disciplina**; escolher os dados mantidos e formar a Integridade extra com **E + P válidos mantidos**, usando o desgaste simbólico do Escudo Arcano. Permite deslocamento normal, mas **só bloqueia o primeiro ataque frontal**. Depois de resolvê-lo (mesmo que erre), a postura acaba; atacar também encerra a postura. Dano não bloqueado segue para **armadura → Vida**. Não é reação.

**Escudo Arcano Psíquico:** anula **Perfurante de arma física** sem apagar o dano. Escudo físico levantado também anula essa característica quando bloqueia o primeiro ataque frontal. **Perfurar de Água não é anulado** por essas defesas anti-Perfurante. A barreira arcana protege de todas as direções em **círculo** ou **forma pessoal/corpo a corpo**; a parede linear não. Custos e duração arcana de 1 rodada continuam. Ver [SRD v0.54](srd-continuidade-v0.54.md), seção 0-AQ.

**PENDENTE:** relação entre a Integridade simbólica rolada e a Integridade/Durabilidade material do escudo, ângulo frontal exato, ataques não frontais e múltiplos, coexistência de barreiras, interação detalhada de Perfurar de Água com a DE/Integridade dos escudos e efeitos específicos de Fogo. Os valores materiais G1 6/9/12 permanecem PROPOSTOS.


## Domar Média e ativações de Perícias — decisão de 16/11/2026 [DEFINIDO, SRD v0.52]

**Ativação comum de Perícia:** **1 PP OU 1 Coragem**, escolhendo o recurso disponível. Isto substitui os antigos valores de 2 Coragens em verbetes de golpes, disparos, manobras, Perícias de armas, Domar e conjurações com ativação paga. O custo de compra em XP não mudou. **Custos que não são ativações comuns**, incluindo conversão de Coragem em PP, despesas para agir Inconsciente, preparação de magias fora de combate e exceções explicitamente declaradas, não são reduzidos automaticamente. Para efeito elemental com foco/habilitação completos, continua válida a gratuidade específica da v0.43.

**Domar Criatura Média:** compra por **1 XP**; exige **Influência 3 + Apresentação 1 + Inteligência 1 + Perícia Domar Criatura Pequena já comprada**. A tentativa de domesticação custa **1 PP ou 1 Coragem**. Domar Grande não recebeu requisito adicional nesta decisão. [Ver Domar Média](../pericias/domar-criatura-media.html).

**Olhos de Águia:** é passiva; paga **1 XP somente na compra**, nunca PP ou Coragem para aplicar os +8 m. O SRD histórico permanece preservado em [v0.51](srd-continuidade-v0.51.md), e o vigente é a [v0.52](srd-continuidade-v0.52.md).

## Olhos de Águia e validade da concentração — decisão de 16/11/2026 [DEFINIDO]

**Olhos de Águia — Perícia.** Compra de **1 XP**; requisitos: **Destreza 3 + Disciplina 3 + (Perícia em Armas de Longo Alcance OU Perícia em Armas de Fogo)**. Aumenta em **8 m o alcance efetivo** de armas à distância e armas de fogo habilitadas. Se uma arma tem alcance base R, seu alcance com esta Perícia é **R + 8 m**; penalidades por ultrapassar o alcance passam a ser contadas a partir do novo valor. Exemplo de catálogo: Arco Curto 24 → 32 m; Revólver 16 → 24 m. Não se estende automaticamente a armas de arremesso, magia nem golpes corpo a corpo. [Ver Perícia Olhos de Águia](../pericias/olhos-de-aguia.html).

**Antecipação e Concentração Refinada — validade DEFINIDA:** o **1A guardado**, ou o **1E convertido e a Vantagem** concedidos pela Concentração Refinada, persistem até **serem usados, até o personagem realizar outra ação ou até terminar um descanso longo — o que ocorrer primeiro**. O A vira E **ao ser guardado**, mas o E não altera a rolagem que o gerou: fica reservado para a ação seguinte. Ao terminar a próxima ação, os benefícios não utilizados expiram. Não duplicar o símbolo original nem acumular reservas indefinidamente.

## Antecipação e Concentração Refinada — decisão de 16/11/2026 [DEFINIDO, atualizado na v0.51]

**Antecipação — mecânica, sem custo de XP.** Em uma rolagem que use **Disciplina**, você pode se concentrar para **guardar 1 Antecipar (1A) de um dado mantido para a sua próxima rolagem**. Esse símbolo não pode ser gasto duas vezes: se foi guardado, não pode também anular Pavor, ser convertido por outro uso ou passar o turno na ação atual. Leia a [regra de Antecipação](../mecanicas/antecipacao.html).

**Concentração Refinada — Perícia, custa 1 XP, requer Disciplina 2.** Quando usa Antecipação para guardar 1A, o símbolo guardado **vira automaticamente 1 Êxito (1E)** e você ganha a **condição Vantagem** (a condição comum, não Vantagem Absoluta). **Não pode usar a Perícia com inimigos a até 8 metros de você.** Os usos normais de Antecipar e a Antecipação básica permanecem permitidos nessas situações. Leia o [verbete da Perícia](../pericias/concentracao-refinada.html).

**DEFINIDO posteriormente no SRD v0.51:** o Antecipar é convertido em Êxito guardado no momento de guardar; o Êxito e a Vantagem podem ser aproveitados na ação subsequente, expirando ao serem usados, ao realizar uma ação ou ao completar descanso longo. A compra é validada no criador; a aplicação automática da reserva durante rolagens ainda requer integração específica.

**Invocação Elemental:** a [página da Perícia](../pericias/invocacao-elemental.html) foi reescrita como orientação ao jogador: escolher elemento e porte, pagar a ativação, preparar ficha, agir ou ajudar um personagem, e só depois consultar tipos especiais e pendências. Não houve alteração mecânica na seção 0-AL.

## Improviso Elemental, Maestria e separação de invocações — decisão posterior de 16/11/2026 [DEFINIDO / PENDENTE]

**Combinação de elementos:** exige **Improviso Elemental + Maestria Elemental** (as Perícias já existentes), mais a habilitação de cada elemento. Invocar com dois elementos custa **+1 Coragem** além da invocação normal. Aplicar Maestria para os efeitos especiais da criatura custa **+1 PP ou +1 Coragem** adicional, respeitando seus gatilhos. Não comprar uma terceira Perícia chamada Combinar Magia Elemental.

**Tokens de uma mesma invocação:** podem ficar juntos, usando **uma ficha**, ou ser **separados**, distribuindo o XP e a Vida da invocação pela quantidade de tokens. Cada token separado mantém o **mesmo nível de DE da ficha original** e resolve como ficha individual quando for escolhido para agir. **Dano de área funciona normalmente** nos tokens atingidos. Ex.: uma ficha Grande com **60 XP/12 Vida** repartida em três zumbis Médios gera **20 XP/4 Vida para cada token**, sem criar XP ou Vida. Se XP e Vida não forem divisíveis igualmente, a distribuição dos restos é **PENDENTE**; não arredondar silenciosamente.

**Dados e ação conjunta [DEFINIDO]:** Pequena rola **1 dado de Atributo** (mantém até 1); Média **2 dados**, um por parte (mantém até 2); Grande **3 dados**, um por parte (mantém até 3). O jogador escolhe quais dados de Atributo utilizar e quais resultados manter. A invocação pode agir por conta própria ou **ajudar somente um personagem por ação conjunta**: o conjurador ou outro aliado. Ao escolher ajudar, **todos os dados mantidos selecionados são passados ao mesmo personagem como contribuição à resolução normal de uma única ação conjunta**. Assim, uma invocação Grande pode ajudar o mesmo personagem com **os três dados mantidos**, sem dividi-los entre aliados e sem criar três ataques ou três turnos. Os dados mantêm seus símbolos e não podem ser reutilizados; os limites e custos normais da ação conjunta continuam válidos para cada participante. Uma parte isolada usa apenas seu dado. Registre dado, parte, face, símbolos e destinatário único. Divisão inexata de XP/Vida e recombinação continuam **PENDENTES**.

**Um turno antecipável:** o conjurador **só antecipa um único turno da invocação**, ainda que existam vários tokens. Pode usar uma parte isolada ou concentrar todas as partes na **mesma ação conjunta com um único personagem**, passando até três dados se a invocação for Grande. Seguem válidos os custos normais de Antecipar e da ação conjunta, sem turnos gratuitos para as outras partes.

## Limites de controle — decisão mais recente de 16/11/2026 [DEFINIDO]

**Invocação:** cada conjurador controla no máximo **uma invocação ativa e uma ficha mecânica**, qualquer que seja o porte. **Uma ficha pode conter várias criaturas reais na cena**. Exemplo: **três zumbis Médios** coexistem e são controlados como uma única invocação de porte Grande, compartilhando **uma ficha Grande**, a Vida e os recursos mecânicos dessa ficha e **um orçamento de XP contado uma vez**. Isso exige Domar Grande; não concede três ações ou três fichas. Dano de área nos tokens separados é normal, conforme a atualização acima. Como dividir restos não inteiros de XP/Vida e recombinar os tokens continua PENDENTE.

**Domar:** cada domador pode controlar diretamente **até duas fichas de criaturas domesticadas**, ainda respeitando **uma criatura por porte**. Uma eventual terceira criatura já domesticada não passa a ter ficha sob controle direto; seu procedimento de participação é PENDENTE. O limite de uma invocação não consome automaticamente vaga de Domar.

## Invocação Elemental — decisão de 16/11/2026 [DEFINIDO / PENDENTE]

**Custo: 1 XP. Requisitos:** Criar Item de Foco e Magia, Domar Criatura Pequena e um elemento habilitado. **Criar Item de Foco e Magia é a própria Perícia de Psique**, então já permite invocações de Psique, sem outra Perícia elemental. Para Fogo, Água, Ar, Terra, Sagrado, Veneno, Sangue e Trevas, possuir a Perícia específica continua obrigatório. A invocação custa **1 PP ou 1 Coragem**. O tamanho é limitado a **Pequena**, **Média** ou **Grande** conforme a correspondente Perícia Domar. A criatura temporária possui ficha com **XP total igual ao do invocador**, é imune ao próprio elemento e causa dano desse elemento. Ao ficar **Incapacitado (debilitado)** ou **Inconsciente**, o conjurador perde a invocação.

O invocador também pode **imbuir uma criatura domesticada**, concedendo **resistência** ao elemento escolhido (diferente da imunidade da criatura invocada). Se possuir **Improviso Elemental + Maestria Elemental** e as habilitações dos dois elementos, pode invocar com **dois elementos por +1 Coragem**. Com **Maestria Elemental**, pode pagar **+1 PP ou +1 Coragem** para permitir que a invocação ative efeitos especiais elementais, sem dispensar seus gatilhos.

**Necromancia:** Sangue e Trevas, com corpo portador de Vida que não se regenera e imune a Trevas, reinvocável até destruição definitiva por **Sagrado ou Fogo levando a Vida a 0**. **Psique:** a invocação é a **projeção da mente do próprio conjurador**, cujo **corpo físico permanece parado enquanto a projeção está ativa**. A projeção pode manifestar-se como fantasma imune a elementos neutros e sem dano neutro; com Maestria pode assombrar/possuir um corpo, provocando **Desvantagem Absoluta**. **Psique + Trevas:** assombrações; **Psique + Sagrado:** seres angelicais e fantásticos, como fadas e unicórnios.

**DEFINIDO:** Psique é habilitada por Criar Item de Foco e Magia; invocar Psique deixa o corpo físico do conjurador parado enquanto a mente se projeta. **PENDENTE:** resolver ataques contra o corpo, interrupção e retorno da mente; condições de controle, duração, possessão e resistência. **DEFINIDO:** Combinar Elementos usa Improviso + Maestria, não uma terceira Perícia. O verbete completo está em [Invocação Elemental](../pericias/invocacao-elemental.html). Norma mais recente: [SRD v0.49](srd-continuidade-v0.49.md), seção 0-AL.

## Decisões recentes — 16/11/2026 [DEFINIDO / PENDENTE]

A [continuidade v0.48](srd-continuidade-v0.48.md), seção 0-AK, prevalece sobre os quadros históricos abaixo.

**Domar Pequena/Média/Grande:** Influência mínima **2/3/4**, Apresentação 1, Inteligência 1; aquisição de **1 XP cada** e ativação de **1 PP ou 1 Coragem**. Testes com Influência + Apresentação contra a DE defensiva do domador. Uma criatura de cada porte por personagem, com XP próprio somado ao orçamento do grupo em conflitos.

**Pequena:** enquanto apoio comum não exige ficha completa de combate. Em missão separada ou outro perigo independente possui **1 ponto de Vida próprio**, além de conceder +1 Vida ao domador. **Ficha independente opcional:** XP total igual ao do jogador, com **Força e Vigor custando o dobro da tabela normal de Atributos**. Os demais Atributos seguem a escala normal. A Pequena tem **1 Vida base**, mas a ficha desenvolvida pode ampliar a Vida própria por `1 + Vigor + piso(Força/2)`; os custos de **Força e Vigor são dobrados desde o Grau 1**. O orçamento de XP da criatura acompanha o **XP total atualizado do jogador**. Aumento de Vida máxima não cura ferimentos automaticamente. A aplicação das quatro faixas a criaturas de menos de 4 Vida permanece PENDENTE. Médias/Grandes têm Vida conforme a ficha; cada porte concede +1 Vida ao domador. A alocação do bônus nas quatro faixas permanece pendente.

**Armadura Muito Leve G1:** **3 de Integridade**, preservando o bônus de esquiva, Leve 7, Média 12 e Pesada 17. **Druídica:** danos sofridos antes da transformação reduzem ponto por ponto a Vida atual inicial da forma animal; ferimentos novos no retorno exigem definição.

**Pavor sem alvo**, como em Escudo Arcano, vai para a reserva pública do Narrador até o teto. O excedente ativa intervenção inimiga, selecionando preferencialmente o mais próximo do último jogador ativo; em empate, maior DE, depois maior Vida, a critério da cena. Tarifa de múltiplos excedentes ainda pendente.

**Recuperação:** Saudável 1 dia/vida; Ferido tempos progressivos 1, 2, 3... dias conforme os pontos da faixa; Incapacitado 1 semana e tratamento avançado; Inconsciente 1 semana e transfusão de 1 Sangue. 1 Êxito em tratamento reduz 1 dia exigido. **Exemplo aprovado:** 7 Êxitos e transfusão de 1 Sangue levam alguém Inconsciente a Ferido após um descanso longo. A aplicação de casos parciais continua pendente.

## Atualização normativa — 15/11/2026: revisão definitiva das faces do d4 [DEFINIDO]

**Faces do d4:** **1 = 1 Êxito (ᛋ)**; **2 = 1 Antecipar (ᚨ)**; **3 = 1 Pavor (ᚦ)**; **4 = vazia (○)**. A face 2 **não possui Pavor**, conforme a decisão autoral mais recente. Essa distribuição substitui integralmente as versões anteriores do d4; **d6, d10, d12 e d20 não mudam**. A face 4 continua sendo a face numérica máxima para identificação de crítico, embora vazia.

**Análise exata de nível 1:** usando d4+d6, a chance de alcançar DE 1 permanece **83,33%**, DE 2 muda de **33,33% para 37,50%** e DE 3 muda de **4,17% para 0%**; o acerto limpo em DE 1 sobe de **16,67% para 37,50%**. Com d4+d10, DE 1 continua **90,00%**, DE 2 aumenta de **55,00% para 60,00%**, DE 3 permanece **20,00%** e DE 4 cai de **5,00% para 0%**. A progressão d6+d10 não muda. São cenários de fontes pertinentes, mantendo até dois dados, sem equipamento ou Coragem gasta, com escolha estratégica de Antecipar. A tabela completa por acerto limpo, acerto com Pavor e falha está no [relatório de rebalanceamento](playtests/rebalanceamento-d4-nivel-1-2026-11-15.md).

**Importante:** o d4 novo reduz a ocorrência de Pavor de 50% para **25%** por dado e acrescenta 25% de Êxito direto, mas pode perder resultados extremos oferecidos anteriormente pelo ᚨ+ᚦ da face 4. Não há alteração de XP, distribuição de fontes ou limites de Marcos. [SRD de Continuidade v0.46](srd-continuidade-v0.46.md).

## Revisão de Vida e Saúde — quatro estados e Força mantida [DEFINIDO — 16/11/2026]

A Vida máxima do personagem agora é **4 + Grau de Vigor + piso(Grau de Força/2)**. Assim, **Força continua aumentando a Vida** como antes, e a base muda de 3 para **4 pontos**, um em cada estado: **Saudável, Ferido, Incapacitado e Inconsciente**. Incapacitado e Inconsciente têm sempre **1 ponto**. Para distribuir os demais, some `X = Vigor + piso(Força/2)` e aloque os `X` pontos alternadamente entre **Saudável** e **Ferido**, começando por Saudável.

**Divisão das caixas:** `Saudável = 1 + teto(X/2)`; `Ferido = 1 + piso(X/2)`; `Incapacitado = 1`; `Inconsciente = 1`.

| Vigor | Força | Saudável | Ferido | Incapacitado | Inconsciente | Vida máxima |
|---:|---:|---:|---:|---:|---:|---:|
| 0 | 0 | 1 | 1 | 1 | 1 | 4 |
| 1 | 0 | 2 | 1 | 1 | 1 | 5 |
| 2 | 0 | 2 | 2 | 1 | 1 | 6 |
| 3 | 0 | 3 | 2 | 1 | 1 | 7 |
| 3 | 2 | **3** | **3** | 1 | 1 | **8** |
| 4 | 4 | **4** | **4** | 1 | 1 | **10** |

| Estado | Efeito na rolagem | Custo por ação |
|---|---|---|
| **Saudável** | nenhum | gratuito |
| **Ferido** | **−1A** | gratuito |
| **Incapacitado** | **−1E e +1P** | **1 Coragem** |
| **Inconsciente** | **−2E e +2P** | **2 Coragens** |
| **Morto (0 Vida)** | não age | — |

As penalidades **não se acumulam entre estados**. Os custos de Coragem são necessários **para agir** e não anulam os modificadores. Eles se somam a outros custos da ação. Se não houver Coragem suficiente, a ação não é permitida por essa regra — não há exceção gratuita implícita.

**DEFINIDO — risco como escolha narrativa:** o Pavor vindo do estado de Saúde **conta na soma da DE** exatamente como o Pavor dos dados mantidos. Um personagem Inconsciente pode alcançar DE usando Pavor, mesmo com seus Êxitos reduzidos, mas deve pagar **2 Coragens por ação** e aceitar as consequências do Pavor não anulado. **Não excluir esse Pavor da DE:** o autor manteve expressamente o benefício arriscado para preservar agência na adversidade. Um acerto com Pavor não é um acerto limpo. [Análise probabilística exata](playtests/analise-saude-quatro-estados-2026-11-16.md).

**Implementação e pendências:** o criador passa a usar quatro caixas, fórmula com Força e modificadores de Saúde nas rolagens. Fichas já salvas preservam a Vida atual numérica, sem cura gratuita devido ao ponto adicional de base. Recuperação natural, Recuperação Vigorosa, Instinto de Sobrevivência, Veneno e conversão de ferimentos da Druídica ainda exigem revisão nas novas faixas. As rolagens de **personagens no protótipo Foundry** também incluem custos e modificadores de Saúde. Em **Criar Conflito**, a Vida máxima e o cálculo do estado foram atualizados; os custos automáticos dos NPCs e monstros permanecem pendentes.

## Domar Criaturas e Pavor Druídico — decisão de 16/11/2026 [DEFINIDO / PENDENTE]

Cada personagem pode manter **uma criatura domesticada de cada categoria: Pequena, Média e Grande**. Elas aumentam o **XP do grupo no conflito**, usando o XP da criatura quando conhecido ou valor informado pelo Narrador. Não é XP novo para gastar no personagem.

**Domar Criatura Pequena (1 XP)** exige **Influência 2 + Apresentação 1 + Inteligência 1**. Ativação **1 PP ou 1 Coragem**, teste de Influência contra a DE da criatura; sucesso a domestica e atacá-la cancela o efeito. Em combate, pode tentar pacificá-la para domar depois. A criatura pequena não tem ficha de combate, concede **+1A em combate e +1 Vida** ao domador e pode sacrificar-se diante de dano fatal, ou o domador pode protegê-la e sofrer o dano fatal fazendo-a fugir. Com Criar Item de Foco e Magia, permite domesticar pequenas mágicas. **PENDENTE:** posicionar esse ponto extra e a proteção letal nas novas quatro caixas de Saúde. [Verbete](../pericias/domar-criatura-pequena.html).

**Domar Média e Domar Grande** têm limite e papel de requisitos Druídicos definidos, mas **custos, requisitos e procedimentos individuais ainda PENDENTES**. [Verbetes](../pericias/).

**Druídica Grau 3:** ao transformar, pagar **1 PP ou 1 Coragem**, combinar **três Atributos pertinentes** e manter **três dados naturalmente**. **Somente Pavor mantido não cancelado por Antecipar** encerra a forma depois da ação. Um Antecipar cancela um Pavor; dados descartados não contam. A memória de formas permanece ilimitada, independentemente do limite de companheiros.

## Perícia Druídica — decisão revisada em 15/11/2026 [DEFINIDO / PENDENTE]

**Compra ÚNICA de 2 XP — sem custo adicional por Grau**. Os três Graus de transformação são efeitos da **mesma Perícia Druídica**; nenhum Grau é comprado separadamente. **Requisitos cumulativos:** Influência 2, Criar Item de Foco e Magia, **Domar Criatura Pequena, Domar Criatura Média e Domar Criatura Grande**, além de Perícia em Elemento Terra. Esses requisitos são custosos por si mesmos, não justificando cobrar mais 2 XP por cada forma. O druida memoriza **quantas formas quiser**, desde que sejam de criaturas que **efetivamente domou**.

| Grau de transformação | Aquisição e requisitos | Forma e características |
|---|---|---|
| **1 — Pequena** | Perícia Druídica de **2 XP** + Domar Criatura Pequena | Transformação **gratuita**, sem teste, **Leve**, Vantagem Absoluta em Furtividade; ficha animal de **19 XP** (distribuição pendente) |
| **2 — Média** | **Sem XP adicional**; Domar Criatura Média já exigida | Ativar por **1 PP ou 1 Coragem**, sem teste; **Leve**; mantém **2 dados naturalmente**, Vantagem em Agilidade/Destreza; **falha com Pavor** cancela a forma |
| **3 — Grande** | **Sem XP adicional**; Domar Criatura Grande já exigida | Ativar por **1 PP ou 1 Coragem**, sem teste; **Leve**; **combina três Atributos e mantém 3 dados naturalmente**; somente **Pavor mantido não cancelado por Antecipar** encerra a forma após a resolução da ação |

**XP das formas média e grande:** a ficha animal recebe **a mesma quantidade de XP que o jogador**, para investir em Atributos animais segundo a **tabela normal de Atributos da v0.56**; o texto histórico anterior usava a **tabela de Conhecimentos e Práticas** (acumulados 2/8/20/38/66/102 nos Graus 1–6), e não segundo a tabela de Atributos dos jogadores. A base exata de XP total/obtido/gasto ainda está **PENDENTE** de padronização. A transformação usa a Vida animal e, ao retornar, recupera os próprios Atributos.

### Vida Druídica e novo modelo de quatro faixas [PENDENTE na conversão]

A divisão anterior de ferimentos em **três terços**, incluindo humano 4 = 2/1/1 e urso 6 = 2/2/2, foi **substituída** pela nova decisão de Saúde em **quatro estados**. Na nova distribuição de base + Vigor, humano com Vida 4 teria **1/1/1/1** e urso com Vida 6 teria **2/2/1/1**. A morte em forma animal continua implicando morte do druida.

**PROPOSTO (não aprovado para transferência automática):** cada faixa animal completamente perdida descontaria a faixa humana de mesma posição. Com 4/6, o novo exemplo seria: urso perde 0–1 → humano 4; perde 2–3 → humano 3; perde 4 → humano 2; perde 5 → humano 1; perde 6 → morto. Este é **um efeito diferente do exemplo antigo de três terços**. A transferência entre as novas faixas precisa de aprovação autoral; não combinar as duas tabelas e não automatizar cura, ferimentos prévios ou alternância de formas.

**Implementação:** a compra permanece bloqueada no criador até que as Perícias de Domar estejam cadastradas, sem contornar os requisitos. As formas e conversão de Vida ainda não são automatizadas. [Verbete completo](../pericias/pericia-druidica.html) e [SRD v0.47](srd-continuidade-v0.47.md).

## Atualização normativa — 15/11/2026: proteção, Conjuração Refinada, pedras e competência [DEFINIDO / PROPOSTO]

**Conjuração Refinada [DEFINIDO no nome e propósito]:** substitui Conjuração Equilibrada. Sua finalidade será **ampliar o alcance de disparos e efeitos mágicos**; metros, custo e procedimento serão reescritos pelo autor. Mantém o identificador de aquisição legado e histórico de XP. **A antiga alteração de peso tático Leve/Pesada por essa Perícia está revogada**. Amplificação de peso por 1 Coragem e redução gratuita com recarga são regras independentes da técnica, conforme SRD v0.43.

**Integridade de armaduras G1 [DEFINIDO o abatimento; valores sujeitos a playtest]:** Muito Leve **0**, Leve **7**, Média **12**, Pesada **17**; redução de 3 em cada peça convencional. Escudos G1 **6/9/12** permanecem **PROPOSTOS e inalterados**. Escudo Arcano permanece **sem mudança**. **Não haverá nova regra de iniciativa.** Para G2–G4, aplicar −3 apenas sobre valores-base existentes; onde o valor anterior não foi aprovado, a Integridade permanece PENDENTE.

**Pedras elementais [DEFINIDO]:** preço comum = **B VT**, preço de **Veneno, Sagrado e Trevas = 3B VT**. As comuns compartilham preço e Sangue/Pedra da Alma não se compra no nível 1. **B é PENDENTE** em VT oficial; a ficha aceita referência **EXPERIMENTAL de mesa** e calcula 3B automaticamente.

**Conhecimento fora de combate [ANÁLISE, ainda não é regra de dispensa]:** DE 1–2 é desafio comum, **DE 3** exige treinamento e **DE 4** é excepcional na escala narrativa experimental. O resultado depende do Grau e dos dados concretos da build, não só do nível. Com Atributo 3 (3d6) + Formação 3 (3d10), mantendo 3 dados de escolha ótima e usando 2A→1E quando pertinente, a chance exata de alcançar DE 3 é **97,44%**; isso não é 100% nem garante acerto limpo. **Limiar 95% para não rolar está somente PROPOSTO**, pendente de aprovação e critérios narrativos. Detalhes no [SRD v0.44](srd-continuidade-v0.44.md), seção 0-AD.

### Histórico de 14/11/2026 [SUBSTITUÍDO nas matérias acima]

## Atualização normativa — 14/11/2026: custos de Perícias e conjuração com foco [DEFINIDO / procedimentos PENDENTES]

**Ativação paga de Perícia: 1 PP OU 1 Coragem** como custo-base; **não** modificar custos de compra em XP. Com **Criar Item de Foco e Magia + foco equipado válido + Perícia do elemento**, a escolha de **um efeito elemental habilitado é gratuita** (0 PP/0 Coragem), sem eliminar DE, Pavor, condições, limites de Grau ou requisitos. Amplificar até o maior peso **já permitido** custa **+1 Coragem**; reduzir Grau/intensidade é gratuito mas **preserva a recarga**. **PENDENTE:** distinção exata entre Grau, peso tático e slot, teto de amplificação e recarga em redução; papel de Conjuração Equilibrada.

**Pedras elementais:** poderão ser compradas usando VT restante no criador. Fogo/Água/Terra/Ar/Psique compartilham faixa comum; Veneno/Sagrado/Trevas compartilham faixa mais cara; Sangue/Pedra da Alma não é comprável no nível 1. **PENDENTE:** preços oficiais em VT, carga e relação com Cristal inicial. A ficha pode registrar preços de mesa explicitamente EXPERIMENTAIS.

**As versões anteriores do SRD guardam o histórico de 2 Coragens; os custos apresentados nesta edição de leitura estão atualizados para 1 Coragem**; esta atualização de 14/11 substitui a ativação-base, não os requisitos da Perícia nem as taxas excepcionais não revisadas.

## Atualização normativa — 13/11/2026: características e Perícias [HISTÓRICO nos custos]

**Ativação:** ataque comum acertado pode gastar **1 PP ou 1 Coragem para ativar uma característica especial escolhida**; um crítico que acertar pode ativar **uma característica gratuitamente**, e **mais uma** mediante novo pagamento. Não ativar todos os efeitos de arma mista automaticamente. Efeitos passivos não exigem pagamento. **Criar Item de Foco e Magia (1 XP)** agora exige **Disciplina 1 + Inteligência 1 + Artesão 1**; criar foco usa teste de Artesão. O conjurador com Criar Magia recebe um Cristal Elemental inicial do elemento escolhido. **VT** significa Valor de Troca, não moeda física; recursos comuns são Ervas, Espólios, Couro, Comida e Minérios, com o mesmo valor-base por Grau. Armaduras G1 **7/12/17 de Integridade são valores em playtest após redução de 3**, e 20 VT iniciais são hipótese econômica de playtest. Limites de características especiais em G1: **2 Leve, 2 Média, 3 Pesada**; Elemental, Precisa e Explosiva não são G1. Veja a seção 0-X do SRD para o catálogo e os estados.

## I. O que é Codex RPG?

Codex RPG é um sistema independente de fantasia, narrativa emergente e combate tático. Cada jogador começa como **Aprendiz**. Sua profissão resulta da combinação de **Atributos, Conhecimentos, Práticas, Perícias, equipamentos e técnicas** — não é necessário escolher uma classe obrigatória. Diferentes ramos de desenvolvimento podem cruzar-se e abrir novos caminhos, mesmo sem comprar todas as capacidades anteriores de um caminho.

### Três símbolos

| Símbolo | Runa | Cor | Significado |
|---|---|---|---|
| Êxito (E) | Sowilo **ᛋ** | **#267A45** | Execução, domínio e dano |
| Antecipar (A) | Ansuz **ᚨ** | **#2369BB** | Adaptação, coordenação e controle de Pavor |
| Pavor (P) | Thurisaz **ᚦ** | **#542176** | Tensão, risco e oportunidade de intervenção |

Um resultado pode alcançar o objetivo e ainda deixar Pavor para o adversário.

### Filosofia de jogo: escolhas e consequências

No Codex, todo personagem começa como **Aprendiz** e constrói sua profissão pela combinação de Atributos, Conhecimentos, Práticas (inclusive Disciplina), Perícias e equipamentos. A liberdade de construir um personagem híbrido não é um bônus gratuito: cada investimento abre possibilidades e deixa outras para depois. O grupo pode favorecer **interpretação narrativa**, **combate tático** ou alternar ambos, usando as mesmas regras centrais de dados e símbolos.

**Ajudar um aliado também é protagonismo.** Quando a ação permite, um jogador pode passar voluntariamente a oportunidade a outro, sem ficar obrigado a agir até perder a iniciativa.

### Os Luckers — guia de interpretação [DEFINIDO no cenário; linhagens v0.55]

> **Orientação ao jogador.** Este capítulo apresenta como interpretar os Luckers sem revelar as causas do **Infortúnio**. O conhecimento que um personagem possui sobre os eventos antigos depende de sua história e do Narrador. As descrições culturais abaixo **não criam efeitos adicionais além das linhagens agora aprovadas na seção de regras acima**. O criador permite escolher Humanos, Luckers de Sangue, Luckers Puros e Runa Espinhos. Sua economia de XP reduzida ou majorada sem fórmula numérica permanece **PENDENTE**; a seleção de linhagem não revoga os limites e requisitos gerais.

#### Dois destinos para um povo antigo

Há cerca de **20 mil anos**, a Queda e o chamado **Infortúnio dos Luckers** marcaram o destino desse povo. Guerras mágicas, cidades perdidas e tradições contraditórias obscureceram o passado. A causa verdadeira do Infortúnio **não é conhecimento público**: lendas podem falar em castigo, mas não são uma explicação confirmada para os personagens.

- **Luckers Puros — imortalidade com vida.** Conservam vitalidade sem envelhecer até morrer e continuam capazes de sentir o mundo e suas emoções. **Podem ser mortos se forem abatidos.** As guerras reduziram seu número, e hoje restam poucos. Um Puro pode temer uma batalha, amar alguém, cultivar hábitos e escolher o que fazer com o tempo — não é obrigado a ser solene nem a conhecer toda a história.
- **Luckers de Sangue — permanência sem sensação.** A condição que os atingiu retirou-lhes a experiência das sensações físicas e das emoções, mas **não a consciência, a cognição ou a capacidade de aprender**. São imortais de maneira literal: não alcançam a morte definitiva. A existência pode prosseguir mesmo quando o corpo é ferido, aprisionado ou soterrado. A maneira exata de representar destruição corporal extrema **não está definida para personagens** e cabe à condução do Narrador, sem imunidades mecânicas presumidas.

Um Puro possui uma vida que pode ser interrompida. Um Lucker de Sangue possui uma existência que não consegue encerrar, sem poder experimentá-la como os demais. **Ambos continuam sendo pessoas distintas**, não modelos fixos de personalidade.

#### Interpretar um Lucker Puro

Um Puro **sente**, e sua longevidade altera sobretudo sua relação com o tempo. Ele pode pensar em séculos, mas também agir impulsivamente, mudar de opinião, errar, esquecer e aprender. Ter vivido muito **não concede conhecimento automático**, principalmente sobre acontecimentos que não presenciou.

Perguntas para construir sua interpretação:

1. Quais perdas, compromissos ou lugares marcaram sua história?
2. Ele se aproxima dos povos mortais ou evita vínculos que podem terminar?
3. A possibilidade de morrer em combate o torna prudente, corajoso ou indiferente ao risco?
4. O que ele ainda deseja descobrir, construir ou preservar?

**Exemplo de diálogo:**

> **Humano:** “Você acredita que esta cidade vai durar?”
>
> **Lucker Puro:** “Eu vi duas cidades erguidas neste vale. Esta ainda pode ser a que aprende com as anteriores.”

#### Interpretar um Lucker de Sangue

**A regra central da interpretação é separar compreender de sentir.** Um Lucker de Sangue pode reconhecer uma ameaça, identificar sinais de tristeza, estudar o amor e entender o valor de um compromisso. Ele não precisa experimentar dor, medo, alegria ou afeto para **tomar decisões**.

- **Observação não é experiência.** Ele pode estudar o choro e reconhecer o luto sem conhecer internamente a tristeza. A percepção e a comunicação necessárias à cena existem na ficção, mas os meios precisos pelos quais isso ocorre ainda não constituem regras mecânicas.
- **Ausência de sensação não é ausência de caráter.** Um Lucker pode ser gentil, cruel, ético, protetor, irônico, paciente ou obstinado. Suas decisões podem vir de princípios, memória, hábitos, cálculos ou promessas, sem emoção correspondente.
- **Não sentir dor não o torna invencível em jogo.** Ferimentos, restrições, captura, incapacidade de agir e conflitos continuam relevantes. A maldição não concede benefícios automáticos à ficha.
- **Intensidade não é cura.** Um golpe mais forte, uma batalha ou uma grande demonstração de carinho não faz um Lucker voltar a sentir por padrão. Qualquer exceção pertence à história conduzida pelo Narrador, não a um recurso livre do jogador.
- **Nem todos pensam ou falam da mesma forma.** Alguns usam linguagem objetiva, outros aprenderam gestos sociais, metáforas, humor ou estilos muito próprios. Não é necessário interpretar um robô, falar apenas com números ou responder tudo literalmente.

**Exemplo de diálogo:**

> **Companheiro:** “Você não tem medo de entrar?”
>
> **Lucker de Sangue:** “Não experimento medo. Mas reconheço a possibilidade de ficarmos presos e prefiro preservar nossa passagem.”

Outro Lucker poderia responder apenas “É perigoso. Vamos por outro caminho”. Ambos são interpretações válidas.

#### Diários, memória e linguagem própria

Muitos Luckers de Sangue mantêm **diários** para registrar experiências observadas, decisões, vínculos e mudanças de comportamento. Não são obrigados a esquecer o que viveram: os registros podem ajudá-los a **organizar a identidade e compreender experiências que não conseguem sentir**.

Alguns criaram maneiras próprias de falar, com palavras para padrões de comportamento que os humanos chamariam de saudade, carinho, prazer ou sofrimento. O jogador pode inventar expressões, mas deve explicar seu significado ao grupo para não transformar a interpretação em obstáculo à mesa.

**Exemplo de registro fictício:**

> **Registro 4.821.** Ela afirmou ter sentido alegria ao meu retorno. Reconheci os sinais que descreveu em outros encontros. Minha presença parece ser importante para ela. Registrei que continuarei voltando a este lugar.

Os números e as pessoas do exemplo são ilustrativos, não cronologia oficial do cenário.

#### Vinte mil anos não criam uma única resposta

Alguns Luckers de Sangue procuram uma forma de se libertar da condição. Outros desenvolveram modos próprios de existir. Há indivíduos que ficaram profundamente desorganizados após épocas de isolamento, exploração e aprisionamento; isso **não significa que todos sejam violentos ou incapazes de raciocinar**.

A imortalidade também os tornou alvos de **escravização e utilização como ferramentas**. Há relatos de Luckers perdidos em cavernas e ruínas, soterrados por milênios; uma formação que parece apenas pedra pode ocultar um deles. O tempo de cativeiro não torna esses indivíduos automaticamente sábios nem hostis.

O personagem pode ser um guardião, estudioso, errante, escriba, viajante ou qualquer outra pessoa com objetivos próprios. Esses são **conceitos de interpretação**, não profissões, Perícias ou benefícios de ficha.

#### Interpretar vínculos com os vivos

Um Lucker de Sangue pode preservar relações, cuidar de alguém, viver em família e cumprir promessas. **Vínculo e emoção não são a mesma coisa** neste contexto: para ele, a ligação pode existir como compromisso, lembrança e escolha consciente.

> **Humana:** “Por que continua me acompanhando, se não sente amizade?”
>
> **Lucker de Sangue:** “Prometi estar aqui. Continuo considerando essa promessa importante.”

O jogador não precisa repetir a maldição em toda conversa. Mostre a diferença quando ela realmente importar para uma decisão, um conflito ou um diálogo.

#### Oficina de interpretação: sete maneiras de ser um Lucker

**DEFINIDO no conceito, ORIENTAÇÃO na atuação:** a maldição determina a ausência de sensações dos Luckers de Sangue, mas **não obriga a mesma personalidade, voz ou comportamento**. A interpretação aparece nas palavras, no silêncio, na postura e em hábitos aprendidos. Escolha um estilo principal e um contraste; não precisa representar todos os cacoetes toda hora.

Use marcações breves como *[pausa]*, *[observa o diário]* e *[repete a palavra]*. Uma pausa funciona quando tem motivo: recordar, medir, escolher uma fórmula social ou organizar lembranças. **Nenhum exemplo abaixo cria Perícias, imunidades, condições ou habilidades mecânicas.**

##### 1. O Lógico — a razão como abrigo

**Conceito:** Procura causas, padrões e explicações. Não é onisciente, nem incapaz de fazer escolhas pessoais que pareçam ineficientes.

- **Voz:** Ritmo regular; respostas objetivas; distingue fato, hipótese e opinião; pode corrigir a própria frase.
- **Olhar e postura:** Observa portas, posições, objetos e reações do grupo, mais do que encarar os olhos.
- **Pausa:** Conta silenciosamente ou reconstrói as circunstâncias antes de responder.
- **Cacoete:** Alinha objetos e repete 'Corrigindo...' quando encontra um erro.
- **Contraste:** Cumpre uma promessa mesmo quando isso não é a opção mais eficiente.

> **Aliado: 'Você vai ficar comigo?'**
>
> **Lucker de Sangue:** [olha a saída, pausa] 'Sim. Minha presença reduz o risco de você permanecer sozinho. ... E eu prometi ficar.'

**Cuidado na mesa:** Não use números inventados como poderes de previsão nem faça o personagem ter razão em tudo.

##### 2. O Vazio — apatia sem paralisia

**Conceito:** Aparenta não responder aos acontecimentos, mas continua capaz de tomar decisões, defender seus princípios e cuidar de outras pessoas.

- **Voz:** Tom baixo e uniforme, frases curtas, nenhuma explicação além do necessário.
- **Olhar e postura:** Fica imóvel por longos períodos; o olhar repousa num detalhe qualquer; move-se de maneira econômica.
- **Pausa:** Deixa o silêncio se prolongar antes de responder, sem procurar preenchê-lo.
- **Cacoete:** Alisa uma dobra da roupa ou fecha o diário na mesma posição.
- **Contraste:** Age imediatamente para salvar alguém, embora permaneça sem expressão.

> **Aliada: 'Ela morreu. Você não vai dizer nada?'**
>
> **Lucker de Sangue:** [permanece imóvel, longa pausa] 'Não sei o que acrescentar. Vou guardar os objetos dela.'

**Cuidado na mesa:** Apatia não é desculpa para ficar fora do jogo ou impedir a aventura de avançar.

##### 3. O Fragmentado — o 'louco' aos olhos dos outros

**Conceito:** Após séculos de sepultamento, escravidão ou isolamento, embaralha a ordem de certos acontecimentos. Sua memória pode conservar informações úteis mesmo quando a fala parece desorganizada. É uma possibilidade ficcional, não um diagnóstico de psicose.

- **Voz:** Começa relatos com precisão e os interrompe com referências a épocas remotas; retoma frases antigas mais tarde.
- **Olhar e postura:** Conta rachaduras, marca paredes e observa sinais que associa a lugares perdidos.
- **Pausa:** Fica em silêncio ao ouvir uma palavra ligada ao passado; depois retoma de onde parou.
- **Cacoete:** Risca datas na pedra ou repete o início de uma anotação: 'Registro... registro...'.
- **Contraste:** Percebe com lucidez um perigo que o grupo não notou.

> **Aliado: 'Há quanto tempo você está soterrado?'**
>
> **Lucker de Sangue:** 'Quarenta e dois invernos. ... Não. Quarenta e duas dinastias.' [risca a parede] 'Não encoste na coluna norte. Ela cede primeiro.'

**Cuidado na mesa:** Não transforme sofrimento psíquico em piada, violência automática ou gritos aleatórios; combine o tom com a mesa.

##### 4. O Eco — o imitador de emoções

**Conceito:** Aprendeu expressões humanas pela observação e procura reproduzi-las para facilitar o convívio, sem experimentar a emoção correspondente.

- **Voz:** Repete fórmulas sociais; às vezes usa um cumprimento ou uma entonação no momento inadequado.
- **Olhar e postura:** Observa os rostos dos outros antes de sorrir ou oferecer um gesto de consolo.
- **Pausa:** Espera um instante para verificar como os demais reagem.
- **Cacoete:** Ensaia expressões no reflexo de metal ou anota que palavras funcionaram.
- **Contraste:** Quando percebe que a imitação incomoda, prefere explicar suas intenções diretamente.

> **Humana: 'Estou feliz que você voltou!'**
>
> **Lucker de Sangue:** [observa o sorriso dela e sorri atrasado] 'Também estou feliz.' [pausa] 'A frase corresponde à situação? Eu quis dizer que escolhi voltar por você.'

**Cuidado na mesa:** Não faça da imitação uma piada repetitiva nem trate gestos aprendidos como cura da maldição.

##### 5. O Guardião — a promessa acima da emoção

**Conceito:** Sustenta a identidade em um juramento, clã, lugar ou pessoa. A lealdade é uma escolha preservada em registros e ações, não um sentimento recuperado.

- **Voz:** Frases firmes e diretas; recita compromissos como se fossem fórmulas antigas.
- **Olhar e postura:** Mantém-se perto de quem protege; observa rotas de fuga; ocupa a entrada sem chamar atenção.
- **Pausa:** Consulta mentalmente ou no diário suas promessas antes de aceitar outra obrigação.
- **Cacoete:** Ajeita uma fita, um medalhão ou uma lista de nomes.
- **Contraste:** Aprende que respeitar a vontade de alguém pode exigir mudar a forma de cumprir uma promessa.

> **Criança: 'Por que você nunca vai embora?'**
>
> **Lucker de Sangue:** [ajeita a fita no braço] 'Prometi que esperaria.' [pausa] 'Mas posso partir, se você desejar.'

**Cuidado na mesa:** Não transforme proteção em controle sobre os outros personagens nem em obediência sem autonomia.

##### 6. O Investigador — estudar o que não pode sentir

**Conceito:** Observa e registra o que os mortais descrevem como prazer, saudade e medo. Não é automaticamente um fanático antigo nem conhece a causa secreta do Infortúnio.

- **Voz:** Perguntas específicas; reformula hipóteses; usa expressões como 'Segundo meus registros...'.
- **Olhar e postura:** Acompanha expressões alheias, protege seus cadernos e compara suas observações.
- **Pausa:** Interrompe uma pergunta ao perceber que o interlocutor não deseja ser estudado.
- **Cacoete:** Repete três perguntas fixas e assinala contradições com um símbolo próprio.
- **Contraste:** Decide respeitar a intimidade de alguém mesmo quando perde a chance de aprender.

> **Aliada: 'Não quero explicar o que estou sentindo.'**
>
> **Lucker de Sangue:** [fecha o caderno] 'Entendido. ... Não registrarei nada sem sua permissão.'

**Cuidado na mesa:** O desejo de conhecer não autoriza manipular pessoas ou inventar revelações do cenário.

##### 7. O Puro Ancestral — longa vida, emoções presentes

**Conceito:** Não compartilha a ausência de sensações dos de Sangue. Pode sentir medo, ternura, tristeza e raiva, mesmo após milênios de existência; ainda pode morrer se for abatido.

- **Voz:** Pode usar expressões de épocas diferentes, hesitar ao falar de mortos ou mudar de tom ao lembrar de algo.
- **Olhar e postura:** Guarda uma relíquia, toca um medalhão ou se detém diante de arquitetura antiga.
- **Pausa:** Emudece ao reconhecer um nome ou lugar que acreditava perdido.
- **Cacoete:** Chama ruínas por antigos nomes ou corrige datas segundo calendários esquecidos.
- **Contraste:** Apesar de milênios de experiência, pode ser apaixonado, imprudente e temer a própria morte.

> **Companheiro: 'Você está com medo?'**
>
> **Lucker Puro:** [aperta o medalhão] 'Estou. Sobrevivi a guerras demais para confundir medo com covardia.'

**Cuidado na mesa:** Não confunda longevidade com sabedoria absoluta, frieza emocional ou invulnerabilidade.

##### A mesma cena, seis interpretações

**Situação:** o grupo encontra um aliado morto numa ruína. Um Lucker de Sangue o conhecia havia décadas. A situação não devolve sensações a nenhum deles.

| Estilo | Primeira fala | O que faz |
|---|---|---|
| Lógico | 'Precisamos determinar a causa antes de mover o corpo.' | Registra sinais e organiza a saída. |
| Vazio | 'Ele não vai nos acompanhar.' [silêncio] | Recolhe os pertences sem fazer comentários. |
| Fragmentado | 'Já aconteceu nesta passagem... ou naquela era?' | Marca a parede e lembra um detalhe útil. |
| Eco | [observa os demais] 'Sinto muito.' | Tenta oferecer um gesto de consolo aprendido. |
| Guardião | 'Ele estava sob minha responsabilidade.' | Fica junto ao corpo até decidirem como proceder. |
| Investigador | 'Ele dizia que partir é diferente de desaparecer.' | Guarda a frase em seu diário. |

##### Exercício: um personagem reconhecível em cinco escolhas

1. **Ritmo:** fala rápido, mantém longos silêncios ou retoma frases fora de ordem?
2. **Gestos:** escolha **um ou dois** movimentos recorrentes; de onde vieram?
3. **Expressão:** “Corrigindo...”, “Segundo meus registros...”, “Permaneço”, “Na última vez...”. Escolha a sua.
4. **Gatilho:** o que interrompe o padrão — uma promessa, um número, um nome, um rosto, uma porta selada?
5. **Contradição:** em que momento sua atitude surpreende os outros sem trair seus valores?

**Treine uma fala curta:** uma frase normal, uma pausa com propósito e um gesto significativo. Se repetir o mesmo recurso a cada sentença, ele perde efeito e atrapalha o ritmo da mesa. O Lucker pode aprender linguagem social e mudar seus hábitos **sem recuperar sensações**. Desorganização após isolamento não significa que todos sejam violentos ou que sofrimento psicológico seja motivo de humor. Combine limites de interpretação com o grupo.

#### Exercício rápido para o jogador

Antes de interpretar um Lucker, responda:

1. Ele é **Puro** ou **de Sangue**? Como isso afeta sua relação com a vida e o tempo?
2. O que **presenciou** e o que conhece apenas por relatos? O que **não sabe**?
3. Quais compromissos, objetivos e hábitos orientam suas escolhas?
4. Que relação mantém com outros povos? O que pensa sobre sua própria condição?
5. Se for de Sangue, ele usa **diários**, símbolos, rotinas ou linguagem própria? Como se comunica com seus aliados?
6. O que seus companheiros descobrem sobre ele **pelas ações**, sem que precise explicar tudo?

**Evite estes equívocos:** interpretar todos os Puros como seres perfeitos; transformar todos os de Sangue em máquinas frias, vilões ou indivíduos desorganizados; tratar ausência de emoção como ausência de ética; presumir conhecimento de segredos antigos; usar a imortalidade narrativa para ignorar as consequências das regras.

**Em resumo:** o Lucker Puro pode viver por eras, mas ainda pode morrer. O Lucker de Sangue pode continuar existindo por eras sem experimentar o que os outros chamam de viver. **Como cada um responde a isso é o que torna o personagem único.**


## II. Criar o Aprendiz

Todos têm seis Atributos: **Força, Agilidade, Destreza, Inteligência, Influência e Vigor**.

| Grau | Dados de Atributo | XP acumulado | Dados de Conhecimento/Prática | XP acumulado |
|---:|---|---:|---|---:|
| 0 | 1d4 | 0 | **1d6** | 0 |
| 1 | 1d6 | 1 | 1d10 | 2 |
| 2 | 2d6 | 3 | 2d10 | 4 |
| 3 | 3d6 | 6 | 3d10 | 8 |
| 4 | 2d6 + 1d10 | 9 | 2d10 + 1d12 | 16 |
| 5 | 1d6 + 2d10 | 18 | 1d10 + 2d12 | 32 |
| 6 | 3d10 | 32 | 3d12 | 64 |

**Conhecimentos DEFINIDOS:** Proteção, Astronomia, Medicina, Alquimia, Engenharia, Erudição.

**Práticas DEFINIDAS (6):** **Disciplina** (Prática compartilhada para ataques, defesas e conjurações), Atletismo, Furtividade, Artesão, Apresentação e Coleta.

**Disciplina é UMA ÚNICA Prática**, com uma única graduação, pilha e compra de XP de Formação. Seus dados servem a técnicas ofensivas, defensivas ou mágicas segundo as **Perícias habilitadoras**. É possível ter as duas famílias de Perícias no mesmo personagem sem duplicar o grau comprado, a fonte nem seu 1d6 gratuito. **Exemplo:** grau 1 da Prática compartilhada custa **2 XP de Formação** e fornece **1d10**; obter uma Perícia de Conjuração não exige pagar outros 2 XP para criar outra Prática. Os custos específicos das **Perícias** (inclusive Aprendiz de Conjurador) continuam próprios. Punhos é especialização marcial, não outra Prática.

**Fichas antigas:** os valores anteriormente separados como Armas e Conjuração são conciliados provisoriamente pelo maior grau, com anotação histórica dos valores antigos; não se somam os dados nem os custos.

**DEFINIDO:** o grau 0 de **cada Conhecimento e Prática pertinente** oferece **seu próprio 1d6 gratuito** (um dado por fonte), equivalente ao 1d4 gratuito por Atributo. O primeiro treinamento troca esse d6 por 1d10, não acrescenta outro dado gratuito. Armas na especialização de Punhos continua exigindo habilitação específica.

O XP adquirido após a criação é livre: pode ser investido em qualquer fonte ou Perícia cujo requisito seja atendido. Grau 6 alcançado cedo **não amplia** automaticamente a quantidade de dados mantidos.

**DEFINIDO — distribuição inicial:** para concluir o Aprendiz, o jogador compra **pelo menos um Atributo no grau 1** e **pelo menos um Conhecimento ou Prática no grau 1**. Depois desses dois investimentos mínimos, **todo o XP restante é livre**, podendo financiar qualquer Atributo, Conhecimento, Prática ou Perícia cujo custo e requisitos sejam atendidos. Não há limite ou reserva exclusiva de XP por categoria. A antiga vinculação de 5 XP somente a Perícias e as distribuições 6/8/5 ou 7/7/5 foram substituídas.

**EXPERIMENTAL — orçamento total:** a ferramenta utiliza **18 XP iniciais compartilhados**, cujo valor total ainda aguarda homologação. Atributo grau 1 custa 1 XP; Conhecimento/Prática grau 1 custa 2 XP, restando **15 XP de escolha livre** neste orçamento de playtest. O XP conquistado depois da criação continua livre. Os custos e os dados por grau da tabela acima não mudam.

**Vida máxima:** 3 + Vigor + piso(Força/2).

**DE (Dificuldade de Êxito) defensiva natural:** **Agilidade + (Destreza ÷ 2, arredondada para baixo)**. Exemplo: Agilidade **4**, Destreza **3** → metade de Destreza é 1,5, arredondada para baixo fica **1** → **DE = 4 + 1 = 5**. A metade é arredondada antes de somar Agilidade.

**Coragem:** começa com 10 e possui teto normal 10. **PP (Pontos de Perícia):** 0 nos níveis 1–4. O primeiro PP e a Perícia em Coragem são obtidos no nível 5.

**Balanço corporal por carga [DEFINIDO — 17/11/2026]:** a classificação do personagem depende da **porcentagem de carga física utilizada** e não da comparação entre Agilidade e Vigor. Calcule `100 × Carga carregada ÷ Capacidade total`, usando as unidades de carga existentes no inventário; todos os itens e recursos físicos transportados entram na soma, inclusive itens de foco e armaduras. Vigor continua contribuindo para ampliar a capacidade de carga, conforme a fórmula vigente, sem alterar o Atributo Agilidade.

| Capacidade utilizada | Balanço do personagem |
|---|---|
| Menos de 25% | **Muito Leve** |
| De 25% até menos de 50% | **Leve** |
| De 50% até menos de 75% | **Médio** |
| De 75% até menos de 100% | **Pesado** |
| 100% ou mais | **Muito Pesado** |

**Visualização na ficha:** 20 blocos representam 100% da capacidade (5% por bloco), com preenchimento parcial quando necessário; mostrar também a porcentagem exata e quanto cada item ocupa na capacidade. Ultrapassar 100% continua gerando o alerta já existente de carga excedida; nenhum novo custo ou penalidade por excesso foi aprovado. Esta mudança **não redefine o Tipo da armadura**, seus modificadores de DE, Integridade ou a categoria tática de armas e magias.

### Deslocamento [DEFINIDO]

O movimento padrão é **8 metros + 1 metro por grau de Agilidade + 1 metro a cada 3 graus completos de Atletismo**.

**Fórmula:** Deslocamento = 8 + Agilidade + parte inteira de (Atletismo ÷ 3), em metros.

**Exemplo:** Agilidade 2 e Atletismo 3 permitem **11 metros** de deslocamento padrão. O valor do movimento e o alcance de uma arma são propriedades diferentes; alcance corpo a corpo e distância efetiva são tratados no capítulo VIII.

## III. Rolar dados e mantê-los

O Codex usa *roll and keep*: reúna uma pilha de dados de fontes pertinentes, role e mantenha apenas os resultados escolhidos. **No máximo nove dados rolados** e **no máximo quatro dados mantidos por ação**; ao menos um dado mantido deve ser de Atributo. Dados descartados **não produzem qualquer efeito**, nem Pavor.

| Níveis | Dados mantidos naturalmente | Com gasto de 1 Coragem |
|---|---:|---:|
| 1–5 | 2 | 3 |
| 6–20 | 3 | 4 |

Gastar Coragem para manter mais um dado **não cria um novo dado na pilha**. Gastar 1 Coragem permite escolher **qual dado elegível da pilha** elevar em um passo antes da rolagem, incluindo Atributo, Conhecimento, Prática ou dado adicional habilitado de equipamento. A cadeia comum é d4→d6→d10→d12, com uma elevação comum por rodada e sem alterar limites de rolagem ou retenção.

### Faces de referência — d4, d6, d10 e d12 DEFINIDOS; d20 reforçado G DEFINIDO

A numeração da face **não se soma à Dificuldade de Êxito (DE)**: identifica a quantidade de símbolos. Esta tabela inclui a distribuição **d20 reforçado G consolidada pelo autor em 9/11/2026**, substituindo o protótipo experimental anterior.

**Runas e identidade cromática:** **ᛋ Êxito (E)** — verde `#267A45`; **ᚨ Antecipar (A)** — azul `#2369BB`; **ᚦ Pavor (P)** — roxo `#542176`. ○ é uma face vazia; — indica face inexistente naquele dado.

| Face | d4 | d6 | d10 | d12 | d20 |
|---:|---|---|---|---|---|
| 1 | ᛋ | ○ | ○ | ○ | ○ |
| 2 | ᚨ | ○ | ○ | ○ | ○ |
| 3 | ᚦ | ᚦ | ᚦ | ᚦ | ᚦ |
| 4 | ○ | ᚦ | ᚦ | ᚦ | ᚦ |
| 5 | — | ᚨ+ᚦ | ᚨ+ᚦ | ᚨ+ᚦ | ᚨ+ᚦ |
| 6 | — | ᛋ | ᛋ | ᛋ | ᛋ |
| 7 | — | — | 2ᛋ | 2ᛋ | 2ᛋ+ᚨ |
| 8 | — | — | ᛋ+ᚨ | ᛋ+ᚨ | 2ᛋ+ᚨ |
| 9 | — | — | ᛋ+ᚨ+ᚦ | ᛋ+ᚨ+ᚦ | 2ᛋ+ᚨ+ᚦ |
| 10 | — | — | 2ᛋ+ᚨ | 2ᛋ+ᚦ | 2ᛋ+2ᚨ+ᚦ |
| 11 | — | — | — | ᛋ+2ᚨ+ᚦ | 2ᛋ+2ᚨ+ᚦ |
| 12 | — | — | — | 2ᚦ | 2ᚦ |
| 13 | — | — | — | — | 2ᛋ+2ᚨ |
| 14 | — | — | — | — | 3ᛋ+2ᚨ |
| 15 | — | — | — | — | 4ᛋ+2ᚨ |
| 16 | — | — | — | — | 4ᚦ |
| 17 | — | — | — | — | 4ᛋ+2ᚨ |
| 18 | — | — | — | — | 5ᛋ+2ᚨ+ᚦ |
| 19 | — | — | — | — | 6ᛋ+2ᚨ+ᚦ |
| 20 | — | — | — | — | 8ᛋ |

A **face 10 do d10** é **2ᛋ+ᚨ (2E+1A), sem Pavor**, conforme decisão autoral **DEFINIDA em 14/11/2026**; ela é a face numérica máxima do d10. As faces 10 do d12 e d20 mantêm seus valores próprios, não alterados por esta decisão. A face 16 do d20 contém **4ᚦ** (quatro símbolos de Pavor). As faces 1 e 2 dos dados **d6, d10, d12 e d20** são vazias. No **d4 revisado**, a face 1 é ᛋ (Êxito), a face 2 é ᚨ (Antecipar), a face 3 é ᚦ (Pavor) e a face 4 é vazia; **a face 4 continua sendo a máxima numérica para crítico, embora não contenha símbolos**. O **d20 é extraordinário** e exige fonte Grau 7, XP e habilitações; acesso a partir do nível 10 nas condições definidas e possível segundo dado em nível 20 por Maestria. O máximo normal por ação é de dois d20 na pilha, mesmo com outras fontes. **DE 30** permanece o teto absoluto definido.


## IV. Resolver ações

1. Declare o objetivo e escolha as fontes de Atributo, Conhecimento ou Prática pertinentes.
2. Estabeleça a DE adequada ao alvo ou tarefa. A DE natural defensiva não é substituída por uma dificuldade inventada se houver ficha.
3. Role a pilha permitida, **incluindo pelo menos um dado de Atributo**, e escolha livremente os dados mantidos, **sem precisar manter nenhum dado de Atributo**. Respeite o limite de retenção.
4. Conte Êxitos (E), Antecipar (A) e Pavor (P) **somente dos dados mantidos**.
5. Gaste Antecipar:
   - **1A anula 1P próprio**;
   - **1A passa a oportunidade a aliado**, preservando Pavor não anulado;
   - **2A convertem-se em 1E**;
   - outras aplicações específicas requerem Perícias.
6. Compare **E + P mantido não anulado** à DE. Decida o resultado e calcule dano e consequências quando aplicável.

Não se pode gastar o mesmo A duas vezes. A transferência de oportunidade por A não equivale a anular P.

### Crítico — faces máximas e benefícios cumulativos [DEFINIDO]

Um **crítico** exige que **todos os dados escolhidos para manter** estejam em sua **respectiva face numérica máxima**, com **pelo menos dois dados mantidos**. O Atributo precisa integrar a **rolagem**, mas **pode ser descartado**. É permitido descartar outros dados da pilha e manter menos que o máximo autorizado. Dados descartados não contribuem com Êxitos ou Antecipar para o crítico; o Pavor descartado ainda obedece às regras da pilha. As faces críticas são: **4 no d4, 6 no d6, 10 no d10, 12 no d12 e 20 no d20**.

| Recompensa acumulada | 2 mantidos | 3 mantidos | 4 mantidos |
|---|:---:|:---:|:---:|
| Converter **1P próprio em 1E** | Sim | Sim | Sim |
| Êxito adicional | — | **+1E** | **+1E** |
| Antecipar adicional | — | **+1A** | **+1A** |
| Recuperação de PP | **1 PP** | **2 PP** | **2 PP** |
| Recuperação de Coragem | **1** | **2** | **2** |
| Dobrar dano | Não | Não | **Sim** |

**Os benefícios são cumulativos:** três máximos também incluem o benefício de dois; quatro máximos incluem os benefícios anteriores e acrescentam dano dobrado. **Converter 1P em 1E substitui a antiga regra que convertia todos os símbolos da face em Êxitos**. Caso não exista Pavor próprio, essa conversão não produz Êxito grátis, mas os demais benefícios continuam.

**Exemplo:** um d6 na face **6** (1E) e um d10 na face **10** (2E + 1A), ambos mantidos, formam o crítico de dois com **3E + 1A e nenhum Pavor**. Como não há Pavor próprio, o benefício crítico de converter 1P em 1E não é aplicado. A rolagem recupera até 1 PP e 1 Coragem dentro dos respectivos tetos. A ação deve **alcançar a DE** para aplicar danos/efeitos que exijam acerto; crítico não garante sucesso automático.

**Reservas:** a Coragem individual tem teto normal 10. O máximo de PP é **0 nos níveis 1–4**, **1 nos níveis 5–9**, **2 nos níveis 10–19** e **3 no nível 20**. Recuperação que ultrapasse o teto não se acumula. **PENDENTE:** a ordem exata do dano dobrado contra integridade, resistências, vulnerabilidades e limites de Vida, e detalhes de aplicação de bônus durante a resolução da rolagem.

**Sinalização visual [DEFINIDO]:** apenas os **ícones dos símbolos da face numérica máxima** são destacados em **dourado**. O fundo, o número e o contorno do dado não mudam de cor por ser uma face crítica. O destaque indica potencial de crítico, que só se confirma depois da escolha dos mantidos.

### Resultados e protagonismo

- **Acerto puro:** alcança DE sem Pavor residual. **Mantém o protagonismo:** o mesmo jogador pode agir novamente ou passar voluntariamente a oportunidade a um aliado, sem limitar a continuidade a apenas dois ataques.
- **Acerto normal:** alcança DE com Pavor não anulado sem predominância de P sobre E.
- **Acerto com Pavor predominante:** alcança DE com P>E, podendo introduzir consequências graves.
- **Falha limpa:** não alcança DE e não tem consequência negativa automática.
- **Falha com Pavor:** não alcança DE e deixa risco, intervenção e normalmente perda de 1 Coragem; a intensidade da complicação depende da situação.

Enquanto não houver Pavor não anulado, jogadores preservam o fluxo de oportunidades entre si. **Em ataque contra um adversário declarado como alvo, o Pavor dos dados mantidos que não foi anulado entra na reserva local do próprio adversário atacado, mesmo que ele esteja distante e mesmo se o ataque falhar — nunca na reserva do inimigo mais próximo.** O alvo só pode aproveitar esse recurso quando tiver uma oportunidade válida. O teto local do inimigo começa em **4P no Grau 1**, e sobe até **8P nos Graus 5–6**; inimigos começam o conflito com saldo cheio. Ataques contra vários alvos/área e ações sem adversário atacado ainda têm distribuição PENDENTE. A economia de Pavor exclusiva de inimigos e as intervenções do Narrador estão detalhadas no [Guia do Narrador](../narrador.html) e no [SRD v0.41](srd-continuidade-v0.41.md).

### Rodadas, oportunidades e protagonismo [DEFINIDO]

Uma **rodada** organiza a passagem das oportunidades em conflito; a sequência **não** impõe alternância automática entre jogador e inimigo. Enquanto não surgir Pavor não anulado que dê ocasião para intervenção, o grupo mantém o protagonismo e **pode transferir voluntariamente a ação** ao aliado mais adequado. Uma **falha limpa** não impõe consequência negativa automática e a oportunidade passa a outro jogador. Com **Pavor residual**, o Narrador normalmente pode intervir; gastar **1A** permite passar a ação a um aliado antes dessa intervenção, **sem apagar o Pavor nem gerar outro**.

O uso de Coragem, PP e técnicas continua sujeito a seus custos específicos; o fato de uma pessoa agir mais de uma vez não concede recursos extras.

### Coragem e seus usos [DEFINIDO]

**Coragem** é um recurso de decisão. A reserva normal tem teto **10**, e o personagem pode utilizá-la para:
- **Gastar 1 Coragem** para manter um dado adicional à sua retenção natural, até o teto do Marco.
- **Gastar 1 Coragem** para escolher e elevar um passo de **um dado elegível da pilha** antes de rolar (d4 → d6 → d10 → d12), inclusive um dado de Conhecimento ou Prática e uma fonte complementar habilitada por Perícia avançada. Uma elevação comum por rodada.
- Pagar custos de técnicas e de Saúde quando a regra específica permitir. **Falhar com Pavor também retira 1 Coragem**.
- A partir do nível 5, o Talento automático **Perícia em Coragem** permite gastar **2 Coragens para recuperar 1 PP**, uma vez por turno e sem ultrapassar o máximo de PP.

**Não é necessário gastar Coragem para passar voluntariamente a ação depois de um acerto limpo.** O máximo de PP por nível permanece 0 (1–4), 1 (5–9), 2 (10–19) e 3 (nível 20).

### Como jogar narrativamente

Declare **o que deseja alcançar** e **como seu personagem tenta fazê-lo**. Escolha as fontes pertinentes à abordagem, role a pilha e interprete os símbolos. Um Êxito pode representar a realização do objetivo; Antecipar permite reagir ou cooperar; Pavor introduz tensão e oportunidade para a situação mudar. A **falha limpa** não precisa causar dano ou humilhação narrativa. Não é obrigatório usar todas as opções de posicionamento, peso ou equipamentos em toda cena. Em desafios conjuntos, as ações dos aliados podem ser coordenadas conforme as regras específicas.

### Provocar: ação tática básica [DEFINIDO]

**Qualquer personagem pode Provocar**, sem comprar Perícia. Declare que deseja atrair a atenção de **um inimigo** e realize um teste normal de **Influência** contra a **DE do inimigo**:

- **Resultado maior ou igual à DE:** o inimigo **fica provocado por você**. Resultado igual **é sucesso**.
- **Resultado inferior à DE:** a provocação **falha**, sem impor Vantagem ou Desvantagem ao inimigo.
- **Enquanto provocado, nos ataques do turno desse inimigo**, atacar **um aliado seu** impõe **Desvantagem (−1 Antecipar)**; atacar **você** concede **Vantagem (+1 Antecipar)** ao inimigo.
- O bônus ou a penalidade dependem de **quem o inimigo realmente escolhe atacar**, não do mero anúncio do ataque. Não se aplica custo adicional de PP ou Coragem à ação básica sem uma regra que o defina.

**Exemplo:** se sua ação de Influência resultar em 3 contra **DE 3**, você provocou o inimigo. No turno afetado, atacar um aliado concede −1A ao inimigo; atacar você concede +1A. Resultado 2 não provoca.

### Provocação Sofisticada [DEFINIDO: requisito e XP; efeito exclusivo PENDENTE]

A Perícia **Provocação Sofisticada** exige **Influência Grau 2** e custa **1 XP**. Sua descrição fornecida até aqui **repete o efeito da ação Provocar básica**. Portanto, **não há benefício adicional distinto aprovado**: não empilhar Vantagens ou Desvantagens, não ampliar automaticamente a duração e não adicionar outros alvos. **A compra não é exigida para usar Provocar.**

**PENDENTE:** definir o que diferencia a Perícia, a duração além do turno afetado, alcance e conflito entre múltiplas provocações. Não importar essas propriedades de outros RPGs.

## V. Defesa, Vantagem e peso

**DE = Dificuldade de Êxito.** O tipo de ataque e a **armadura equipada do alvo humanoide** produzem condições de Vantagem ou Desvantagem, conforme a matriz abaixo. Contra criaturas não humanoides, o Narrador considera porte e classificação de peso natural, não carga do inventário.

### DE defensiva — Vigor e Atletismo [DEFINIDO]

A **Dificuldade de Êxito (DE) defensiva natural** considera o treinamento de mobilidade, precisão e resistência física:

**DE natural = mínimo entre 9 e Agilidade + parte inteira(Destreza ÷ 2) + parte inteira(Vigor ÷ 2) + parte inteira(Atletismo ÷ 3).** **DE defensiva final = mínimo(12, máximo(0, DE natural + modificador da armadura equipada))**, aplicável a toda defesa.

```text
DE natural = min(9, AGI + ⌊DES/2⌋ + ⌊VIG/2⌋ + ⌊ATL/3⌋)
```

Arredonde cada divisão **para baixo antes de somar**. Cada 3 graus completos de Atletismo aumentam a defesa em **1 DE**: graus 0–2 concedem 0, graus 3–5 concedem +1, e grau 6 concede **+2 DE**. O limite 9 se refere à **DE individual natural**. Defesas conjuntas continuam com seu **teto 30**, nas condições já definidas.

**Exemplo:** Agilidade 2, Destreza 0, Vigor 6 e Atletismo 6 → 2 + 0 + 3 + 2 = **DE natural 7**. Vestindo armadura **Leve**, fica com **DE 8** (+1 em toda defesa); com armadura **Pesada**, **DE 6** (−1); com armadura **Muito Pesada**, **DE 5** (−2), **independentemente do Grau**.

**DE mínima no protótipo:** 0, respeitando o limite inferior do cálculo já implementado. **Teto final definido:** 12 após a armadura; o teto natural permanece 9. Nenhuma defesa negativa é permitida.

### Condições da ação

| Condição | Efeito |
|---|---|
| Vantagem absoluta | +1E |
| Vantagem | +1A |
| Normal | Nenhum |
| Desvantagem | −1A |
| Desvantagem absoluta | −1E |
| Ação de Sorte | −2E |

**Não confundir Vantagem com +1E**: a Vantagem comum concede **Antecipar**, não Êxito automático. Estado situacional e afinidade de peso/arma são fontes distintas e podem interagir conforme as regras; condições ambientais iguais não se acumulam livremente.

### Afinidade entre peso do ataque e armadura do alvo [DEFINIDO — SRD v0.68]

| Ataque / Armadura equipada do alvo humanoide | Muito Leve ou Leve | Média | Pesada ou Muito Pesada |
|---|---|---|---|
| **Leve** | Normal | Vantagem (+1A) | Desvantagem (−1A) |
| **Médio** | Vantagem (+1A) | Desvantagem (−1A) | Normal |
| **Pesado** | Desvantagem (−1A) | Normal | Vantagem (+1A) |

**Regra de referência:** contra humanoides, a coluna da matriz decorre **exclusivamente da armadura equipada**, não da carga do inventário. Armadura Muito Leve conta como Leve; Muito Pesada conta como Pesada. O peso tático de cada ataque depende de armas, Perícias e abordagem. Requisitos, efeitos, dados e Vantagens de especializações existentes não se alteram.

**Balanço por carga da v0.67:** indica **sobrecarga**, e não a coluna de afinidade. O autor definiu a penalidade **−1E no estado de sobrepeso/Muito Pesado**, mas a abrangência e o procedimento automático de aplicação estão **PENDENTES**; isso não altera por si só a armadura Muito Pesada (que mantém −2 DE).

**Criaturas:** o Narrador considera **tamanho/porte natural, Força e Vigor**, com a referência de 50% ainda sem fórmula operacional aprovada. Humanoides inimigos seguem a armadura. **PENDENTE:** tratamento de humanoides sem armadura, cálculo do peso natural de monstros e formas druídicas. Não conceder automaticamente bônus por um critério não decidido.

### Criatividade em combate e fora dele

**No conflito**, um ataque leve pode explorar passagem estreita, um ataque pesado pode tentar deslocar um obstáculo, e o grupo pode combinar Força + Atletismo, Inteligência + Engenharia ou outros recursos pertinentes para atingir o objetivo. Uma terceira fonte depende da Perícia habilitadora.

**Fora do conflito**, a mesma lógica permite construir proteções, investigar ruínas, negociar, atravessar terreno, improvisar ferramentas ou resgatar um aliado. **Nenhum exemplo concede bônus automático**; o Narrador avalia a Dificuldade de Êxito, a posição, as fontes e as consequências. O peso pode ser uma vantagem real para um objetivo e um inconveniente para outro.

Até **três participantes** podem coordenar um ataque conjunto; a DE defensiva conjunta respeita o teto 30. Referências experimentais para preparar DE sem ficha pertencem ao [Guia do Narrador](../narrador.html#dificuldades).


## VI. Dano, armadura e Vida

**Dano básico após alcançar a Dificuldade de Êxito:** total de **Êxitos válidos + piso(Pavor mantido não anulado ÷ 2)**, salvo efeitos específicos. Cada **par completo de Pavor** acrescenta 1 ao dano básico; os símbolos residuais ainda podem gerar intervenção. Esta redação substitui a abreviação ambígua `P/2` sem mudar a matemática.

**DEFINIDO:** uma Perícia pertinente pode conceder no máximo +1E, respeitando o teto de **+2E de Perícias por ação**. Esse Êxito vale para a DE e para dano, salvo efeito explicitamente exclusivo de dano.

Armadura equipada possui **integridade**, que absorve primeiro o dano; excedentes podem alcançar Vida. **Ataques que falham não desgastam integridade.** **Perfurante físico habilitado não ignora mais a armadura:** o ataque acertado causa **E válidos + 1 dano por Pavor mantido não anulado** à Integridade, **em substituição** à contribuição padrão de `⌊P/2⌋` nesse efeito. Se Perfurante for neutralizado por Escudo Arcano Psíquico ativo ou Levantar Escudo físico frontal, resta o dano básico normal (`E + ⌊P/2⌋`), sujeito às proteções. Sem armadura, a propriedade não concede dano extra direto à Vida. O golpe não colossal causa até **3 Vida**; limiares precisos seguem PENDENTES. Golpe colossal exige dano efetivo após proteção de ao menos **3 × Vida máxima** em um único ataque.


### Levantar Escudo físico [DEFINIDO — 16/11/2026]

Levantar Escudo **consome uma ação**; o defensor realiza um **teste de Disciplina** e escolhe os dados mantidos dentro dos limites normais. A Integridade simbólica extra é **E + P válidos dos dados mantidos**. O desgaste usa as equivalências já definidas: **1E do ataque anula 1E do escudo ou 2P; 1P anula 1P; 2P anulam 1E**. Antecipar não concede Integridade automaticamente. **Não é reação**.

O escudo físico bloqueia **somente pela frente**. Pode-se mover normalmente sem abaixá-lo; **atacar encerra o bloqueio**. A postura protege contra **o primeiro ataque frontal recebido** e termina **depois da resolução desse ataque**, inclusive se ele não atingir. Se houver dano excedente, aplica-se à **armadura** e, depois, à **Vida**. Enquanto protege, anula a característica **Perfurante de armas físicas**, mas não o **Perfurar de Água**. **Cravar [DEFINIDO — SRD v0.77]:** uma arma **Média ou Pesada com a característica Cravar** pode ficar presa ao escudo físico quando o ataque **alcançar a DE** e a característica for habilitada por **crítico** ou **Perícia de Armas correspondente** (em acerto não crítico, 1 PP ou 1 Coragem). Escudo físico **Pesado** só pode ser cravado por **arma Pesada**. **Cravar cumulativo [DEFINIDO — SRD v0.79, 17/11/2026]:** cada arma cravada no mesmo escudo impõe **−1E em Levantar Escudo**, acumulando-se por arma (2 armas = −2E; 3 = −3E). A retirada de uma arma elimina o −1E dessa arma, mas preserva as penalidades das demais. Não reduzir Pavor/Antecipar nem penalizar outras ações por Cravar. O peso de cada arma acompanha a carga do escudo enquanto estiver presa. O registro do alvo permanece manual no protótipo.

**PENDENTE:** interação com Integridade/Durabilidade material do escudo, cobertura precisa, ataque vindo de trás e ataques múltiplos, coexistência com Escudo Arcano e detalhes do efeito Perfurar de Água. Os valores materiais G1 6/9/12 continuam PROPOSTOS e não são somados automaticamente ao resultado rolado.

### Histórico superado — antigas três caixas de Vida, penalidades e Coragem [SUBSTITUÍDO EM 16/11/2026]

A Vida máxima é dividida em **Saudável / Machucado / Incapacitado**. Divida a Vida máxima por 3, atribua a quantidade inteira a cada caixa e coloque **todos os pontos restantes na caixa Saudável**. Exemplo: **7 Vida → 3 / 2 / 2**; **11 Vida → 5 / 3 / 3**.

| Estado da Saúde | Penalidade | Coragem para agir |
|---|---|---|
| **Saudável (3/3)** | Nenhuma | Sem custo adicional de Saúde |
| **Machucado (2/3)** | **−1A** | Pode pagar **1 Coragem** para ignorar a penalidade nessa ação |
| **Incapacitado (1/3)** | **−2E e −1A** | **1 Coragem para agir** com penalidade; **2 Coragens no total** para agir e ignorar as penalidades dessa ação |
| **Morto (0 Vida)** | Não pode agir | Não se aplica |

As penalidades de cada caixa **substituem** as da caixa anterior, sem somar penalidades de duas caixas. Gastar Coragem para ignorar a penalidade não cura Vida, não anula Pavor e não isenta de outros custos de Perícias.

### Histórico de recuperação em três caixas [PENDENTE DE ADAPTAÇÃO]

| Caixa em recuperação | Tempo por ponto de Vida |
|---|---|
| **Saudável (3/3)** | **1 dia** |
| **Machucado (2/3)** | **1 semana** |
| **Incapacitado (1/3)** | **Tratamento médico obrigatório** e depois **1 semana** |

O prazo vale para **cada ponto recuperado**, não para a caixa inteira. As condições de repouso, interrupção e duração do tratamento seguem **PENDENTES**.

### Perícia Recuperação Vigorosa [DEFINIDO]

**Requisito: Vigor 3. Compra: XP PENDENTE (1 XP constava em versão anterior sem confirmação neste lote).** Para cada **3 graus completos de Vigor**, o personagem acelera a recuperação de **um dos últimos pontos da caixa Machucado**: passa de **1 semana para 1 dia por ponto**, até o limite de pontos dessa caixa. Não acelera a caixa Incapacitado nem remove a necessidade de tratamento médico.

**Exemplo com 6 Vida:** Vigor 3, Força 0 → caixas **2 / 2 / 2**. Se a ficha está em **0 / 1 / 2**, a Perícia permite passar a **0 / 2 / 2 em 1 dia**.

**Exemplo com 12 Vida, caixas 4 / 4 / 4, e Vigor 6:** dois últimos pontos intermediários recebem o benefício: **0 / 1 / 4 → 0 / 2 / 4** ainda demora **1 semana**, depois **0 / 2 / 4 → 0 / 3 / 4** leva **1 dia** e **0 / 3 / 4 → 0 / 4 / 4** leva **1 dia**.

### Armaduras: cinco tipos independentes do Grau [DEFINIDO]

**Tipo** determina categoria, Integridade, DE e proteção natural. **Grau** determina acesso a propriedades adicionais. Uma armadura Muito Leve de Grau 4 **continua Muito Leve**; uma Muito Pesada de Grau 1 já tem imunidade física natural.

| Tipo | Integridade | DE | Progressão elemental |
|---|---|---|---|
| **Muito Leve** | **Nenhuma** | **+2 DE em todas as defesas** | **Grau 3+:** pode ter resistência elemental |
| **Leve** | Baixa; valor **PENDENTE** | **+1 DE em todas as defesas** | **Grau 3+:** pode ter resistência elemental |
| **Média** | Média; valor **PENDENTE** | **0** | **Grau 2+:** pode receber resistências específicas |
| **Pesada** | Maior Integridade das armaduras convencionais; valor **PENDENTE** | **−1 DE** | **Grau 2:** resistência; **Grau 3:** pode ter duas resistências diferentes |
| **Muito Pesada** | Valor **PENDENTE** | **−2 DE** | **Qualquer Grau:** imunidade física; **Grau 2:** resistência elemental; **Grau 4:** **imunidade elemental adicional que se soma à resistência anterior** |

**Acesso por Grau [DEFINIDO]:** Grau 1 pode ser usado desde o início, conforme requisitos do tipo; Grau 2 requer **nível 5**; Grau 3 requer **nível 10**; Grau 4 requer **nível 20**. O peso não aumenta obrigatoriamente com o Grau.

**Muito Pesada [DEFINIDO]:** exige **Vigor 6 e Atletismo 6** independentemente do Grau. Concede **imunidade natural a todo dano físico comum**, sem perda de Integridade nem Vida decorrente desse dano. A penalidade é de **−2 DE**, e não benefício de Grau 4. Sua resistência elemental de Grau 2 **é conservada** ao obter imunidade elemental adicional de Grau 4; as propriedades são fixas na peça comprada ou fabricada. Ex.: imunidade física + resistência a Fogo + imunidade a Gelo, se presentes no modelo.

**Modificadores gerais de armadura [DEFINIDO — decisão de 17/11/2026, SRD v0.66]:** +2 (Muito Leve), +1 (Leve), 0 (Média), −1 (Pesada) e −2 (Muito Pesada) se aplicam à **DE defensiva em todos os ataques e abordagens de defesa**, inclusive esquiva. Calcule primeiro a **DE natural com teto 9**, depois aplique o modificador da **única armadura equipada válida**, limitando a **DE defensiva final entre 0 e 12**. **Esquivar não adiciona o bônus pela segunda vez**. Os pontos de Integridade continuam separados da DE. Não empilhar modificadores de várias armaduras sem procedimento aprovado.

**Imunidade física não protege contra Psíquico**, que é elemento neutro. Também não cancela Pavor ou efeitos habilitados como derrubar/afastar/Sangramento superficial. Perfuração excepcional habilitada segue seus gatilhos; a arma Perfurante comum não atravessa imunidade gratuitamente.

**Integridade quantitativa [PENDENTE POR DECISÃO DO AUTOR]:** os valores serão estabelecidos **após a definição das Perícias iniciais e análise da distribuição de dano**. Não criar números provisórios. Custos/catálogo de peças, equipamento simultâneo e resolução de dano misto/colossal também aguardam decisão.

**Capacidade de carga (unidades Alto):** 1 + piso(Força/3) + piso(Vigor/3) + piso(Armas/3) + piso(Atletismo/3), conforme as fontes de grau válidas. Pontos de composição dos dados não equivalem automaticamente a peso real de equipamento.


## VII. Conjuração, elementos e possibilidades

**Criar Item de Foco e Magia (1 XP; Disciplina 1 + Inteligência 1)** substitui **Aprendiz de Conjurador** e **Magia Única**. As duas Perícias antigas deixam de ser oferecidas para compra. O conjurador inicia com Psíquico; outros elementos mantêm suas habilitações próprias.

**Combinação de até dois elementos:** a ordem define o **principal** e o **secundário**. Incluir o segundo elemento conscientemente com a Perícia adequada gasta **1A**, não reutilizável. A mistura por si só **não soma dados nem Êxitos**, e efeitos avançados exigem os Pontos de Perícia (PP) e as Especialidades pertinentes.

### Criar Item de Foco e Magia [DEFINIDO / efeitos avançados PENDENTES]

**Custo: 1 XP. Requisitos: Disciplina 1 + Inteligência 1.** Habilita os efeitos iniciais de **Psíquico**, magias **Leves**, criação de itens de foco e moldagem de magias segundo a capacidade de conjuração.

**Efeitos especiais de Psíquico:** **ao acertar um ataque**, independentemente de crítico, pode gastar **1 PP ou 1 Coragem** para aplicar **um efeito escolhido** do elemento, dentro do Grau habilitado. Não presumir gratuidade no crítico.

| Grau | Exemplos do elemento Psíquico, neutro e não físico |
|---|---|
| **G1** | Amassar armadura, arrancar objeto, lançar pedra, ler mente, impor pensamento ou sentir presenças; manifestações psicológicas/telecinéticas |
| **G2** | Controlar **um alvo para atacar a si próprio** (**rolagem de Influência**) ou arremessar pequenos objetos mentalmente |
| **G3** | Controlar **dois alvos para que um ataque o outro**, com **rolagem de Influência** e **Conjuração**; somente com **Psíquico puro ou combinado com Trevas** |

**Foco:** o personagem faz a **rolagem de criação com Artesão**. Itens de foco permitem conjurar magias elementais **sem depender da presença do elemento na cena**, dentro das habilitações adquiridas. Cada grau investido em **Disciplina** aumenta a capacidade de criar Graus mais elevados de magias e itens; a correspondência numérica exata entre o Grau de Disciplina e o limite de fabricação ainda é **PENDENTE**. O **peso físico do foco** aumenta proporcionalmente ao Grau da magia, mas sem números de inventário definidos.

**Recarga dos focos comuns [DEFINIDO — SRD v0.79, 17/11/2026]:** a capacidade máxima do foco é igual ao seu Grau (G1 = 1 carga, G2 = 2, G3 = 3, G4 = 4). Depois de gastar a **última carga durante a rodada**, o foco recupera automaticamente **1 carga no encerramento dessa mesma rodada**, depois que jogadores e inimigos concluírem seus fluxos. Recupera mais **1 carga ao fim de cada rodada seguinte** até atingir a capacidade máxima. Cargas já recuperadas podem ser utilizadas antes de encher o foco. **Pedra da Alma não recarrega naturalmente**; depende da futura Perícia Fixar Alma. Assim, a descrição histórica “Grau N → N rodadas” indica **recuperação gradual**, não espera de N rodadas por uma restauração integral. **Criar Magia:** permite moldar elementos dentro das habilitações adquiridas, sem conceder outras gratuitamente.

**Redução voluntária de Grau na conjuração [DEFINIDO — SRD v0.79, 17/11/2026]:** o conjurador pode **reduzir uma magia elemental G2 para G1 e lançá-la imediatamente**. A magia reduzida passa a utilizar **somente os efeitos e propriedades de G1**, inclusive dano e área de G1 quando definidos, **perdendo por completo os efeitos exclusivos de G2**. Ex.: a versão reduzida de Fogo G2 não mantém o dano especial E+P à Integridade de Queimar G2; usa a manifestação de Fogo G1 pertinente. Não criar custo extra ou bônus automático por essa escolha. A redução intermediária livre G3→G2 não foi aprovada. **PENDENTE:** integração da redução com magias memorizadas.

**Conjuração G3 e foco [DEFINIDO — SRD v0.79, 17/11/2026]:** o **Grau da magia** e o **tempo de preparação** são grandezas distintas. Uma magia **G3 demora 3 turnos sem foco**, com seus efeitos completos de G3. Gastar **1 carga de foco** reduz a preparação para **2 turnos**; gastar **2 cargas do mesmo foco** reduz para **1 turno**, que significa **lançamento instantâneo no próprio turno do conjurador**. **A aceleração não transforma G3 em G2 nem retira efeitos G3**. O foco precisa possuir as cargas gastas; elas são consumidas normalmente. Não existe necessidade de gastar uma terceira carga para tornar G3 instantânea, pois isso já ocorre em um turno. Esta decisão substitui a limitação antiga de uma única carga por conjuração.

**Elevação e redução de Grau [DEFINIDO — SRD v0.79]:** elevar G2 para G3 permite usar os efeitos G3 respeitando a preparação do grau; a redução voluntária para G1 usa apenas os efeitos G1, com lançamento imediato. Conjurar uma magia com efeitos de G2 não preserva efeitos exclusivos de G3/G4; gastar foco **não** equivale a alterar o Grau. A redução intermediária livre G3→G2 não foi aprovada. Conservar as demais exigências de conjuração.

**Criação e memorização [DEFINIDO]:** a partir de **Disciplina 2**, pode criar magias de **Grau 2 e Grau 3**, **fora de combate**, pagando **1 PP ou 2 Coragens por criação**, e deixá-las **memorizadas em um slot mágico** para conjurá-las rapidamente depois. Não há autorização automática para preparar Grau 4 nessa regra.

| Grau de magia | Peso nominal |
|---|---:|
| **1** | 1 |
| **2** | 2 |
| **3** | 3 |
| **4** | 4 |

**Criar Magia e peso mental [DEFINIDO]:** a habilitação de **Criar Magia**, incluída em **Criar Item de Foco e Magia**, **reduz em 1 o peso de cada magia criada e memorizada**. O desconto pertence à magia criada, **não depende de estar sem item de foco**. Peso nominal: G1=1, G2=2, G3=3, G4=4; peso mental reduzido: G2=1, G3=2, G4=3. **PENDENTE:** se o mínimo de peso de magia G1 deve ser 0 ou 1, para evitar memorização ilimitada. Esta redução não altera peso físico de foco, Grau de magia, nem os dados de Disciplina.

**Spellslots mentais [DEFINIDO]:** cada **ponto investido em Disciplina** concede **1 ponto de capacidade mental**; não é a quantidade de dados rolados. A capacidade vai de **0 a 6** nos Graus atuais da Prática, sem acréscimos de Inteligência ou de equipamentos.

| Grau de Disciplina | Capacidade mental | Magias G2 criadas e memorizadas (peso 1 cada) |
|---:|---:|---:|
| 0 | 0 | 0 |
| 1 | 1 | 1* |
| 2 | 2 | 2 |
| 3 | 3 | 3 |
| 4 | 4 | 4 |
| 5 | 5 | 5 |
| 6 | 6 | **6** |

*Capacidade ilustrativa: **criar magias de Grau 2 exige Disciplina 2**, conforme a regra de criação.*

**Exemplo no máximo:** Disciplina 6 fornece 6 pontos mentais. Uma magia criada G2 pesa 2 − 1 = **1 ponto**. Assim, o personagem memoriza **seis magias G2**, sem modificar os dados da Prática. A divergência anteriormente apontada entre “3 dados” e “6 magias” está **RESOLVIDA**: são seis **pontos investidos**, não seis dados.

**Itens de foco e carga física [DEFINIDO]:** todos os itens de foco **ocupam as cargas convencionais do inventário**, sem serem anulados pelo fato de uma magia estar memorizada ou não exigir foco. A referência a **Potência com Força e Atletismo** para carregar equipamentos permanece em revisão técnica quanto à fórmula; isso não cria slots mentais. O foco comum criado com Artesão recupera **1 carga no encerramento da própria rodada do esgotamento**, e depois mais 1 no fim de cada rodada até encher, conforme seu Grau. A Pedra da Alma é exceção.

**PENDENTE:** limites de controle mental, testes dos alvos, duração, alcance, magias memorizadas e tempo efetivo da conjuração rápida. Não transformar exemplos em efeitos automáticos.

### Escudo Arcano [DEFINIDO / detalhes de aplicação PENDENTES]

**Custo de aquisição: 1 XP. Requisitos vigentes: Inteligência 2 + Vigor 1 + Criar Item de Foco e Magia.**

**Ativação:** **1 PP ou 1 Coragem** cria escudo pessoal, parede linear inicial de 3 m ou **área circular de 3×3 metros**, com **duração de 1 rodada**. A conjuração usa **Disciplina + Atributo pertinente** (mais uma fonte pertinente se houver Disciplina Avançada). O total de **E + P válidos nos dados mantidos** forma a **DE inicial e a Integridade simbólica** da barreira. No desgaste, **1E do ataque anula 1E do escudo ou 2P; 1P anula 1P; 2P anulam 1E**. Não criar Vida extra para a proteção.

**Direção:** o **círculo** e o **escudo pessoal/corpo a corpo** protegem de todas as direções; a **parede linear** protege segundo sua geometria. **Escudo Arcano Psíquico ativo anula a propriedade Perfurante de armas físicas**, não o acerto nem o dano: o excedente segue para outras proteções, armadura e Vida. **Perfurar de Água não perde seu efeito mágico** por esta anulação de Perfurante físico.

**Hemomancia [DEFINIDO — v0.75]:** só o **Escudo Arcano com elemento Sangue** ativo e aplicável anula a propriedade de uma magia de Sangue amplificada de atravessar toda a armadura para atingir diretamente a Vida. **Escudos físicos e Escudos Arcanos de outros elementos, inclusive Psíquico, não anulam essa propriedade.** Neutralizado o efeito especial, resolver o ataque e o eventual excedente pelas regras comuns do Escudo Arcano, sem eliminar o acerto ou o dano convencional automaticamente. A defesa continua usando as mesmas habilitações, custos, rolagens, duração e formatos de Escudo Arcano; não é nova Perícia.

**Elementos e interior:** aplicam-se as imunidades do elemento incorporado, não uma imunidade gratuita a todos os elementos. Se um inimigo entrar na área e atacar ou conjurar corpo a corpo **a partir de dentro**, ignora essa barreira na interação. Cada **1 PP ou 1 Coragem adicional** amplia a parede em 3 m ou o círculo em mais 3×3 m, conforme a forma escolhida.

**PENDENTE:** geometria exata da ampliação circular, resistência a efeitos reativos e mistos, convivência com escudo físico e interação detalhada do Perfurar de Água com os símbolos/Integridade. **Formato e duração já são DEFINIDOS.**

### Conjuração Refinada [DEFINIDO no nome / alcance PENDENTE]

**Compra histórica: 1 XP. Requisitos mantidos enquanto a técnica não for reescrita: Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2.**

Substitui a antiga **Conjuração Equilibrada** sem perder a compra salva. Seu novo objetivo é **ampliar o alcance de disparos e efeitos de magias**. Os metros adicionais, custo e condições ainda serão escritos pelo autor. A antiga mudança de peso Leve/Pesada mediante esta Perícia está **revogada** e não habilita dados maiores automaticamente. **A amplificação comum de 1 Coragem da v0.43 não depende desta Perícia.** Consulte [verbete atual](../pericias/conjuracao-refinada.html).

### Perícia em Elemento Ar [DEFINIDO / detalhamento PENDENTE]

**Custo: 1 XP. Requisitos: Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1.** Habilita magias elementais **Leves de Ar**. Em ataques acertados, independentemente de crítico, **1 PP ou 1 Coragem** ativa **um efeito especial escolhido**.

| Grau | Efeitos e formas |
|---|---|
| **G1** | Autoempurrão para aumentar deslocamento em **4 m**; puxar ou empurrar objetos; linha reta, círculo, cone, X |
| **G2** | **Sufocar**, causando dano à Vida ou armadura; puxar, empurrar + derrubar com dano; deslocamento até **8 m**; linha reta, círculo, cone, X |
| **G3** | Conjurar ao **final do turno dos aliados**; grandes áreas e múltiplos alvos, tornado/rajada, possíveis danos por queda e referência de **16 m**; linha reta, círculo, cone, X |

**Ar também pode recuperar Fôlego [DEFINIDO no efeito].** **PENDENTE:** em qual Grau, quanto Fôlego recupera, quem recebe e qual gatilho/custo; não confundir Fôlego com PP, Coragem ou Vida.

**Nome atualizado:** esta é a habilitação antes registrada como **Elemento: Vento**; as duas denominações correspondem ao **mesmo elemento**, não a duas compras. A ficha preserva o identificador antigo.

**PENDENTE:** interpretar 16 m, duração e dano de Sufocar/queda, geometrias dos formatos e ações não ofensivas.

### Perícia em Elemento Água [DEFINIDO / detalhamento PENDENTE]

**Custo: 1 XP. Requisitos: Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1.** Habilita **magias elementais Leves de Água**. Ao acertar um ataque, independentemente de crítico, **1 PP ou 1 Coragem** permite aplicar **um efeito escolhido** de Água; G2 também possui gatilho alternativo de crítico para Perfurar.

| Grau | Efeitos |
|---|---|
| **G1** | **Congelar por 1 rodada**, **sem causar dano** na forma Leve; extrair água do ar, mover água, molhar ou limpar |
| **G2** | **Perfurar** ao obter **crítico nos dados** **ou** por ativação paga de efeito (1 PP ou 1 Coragem); causa dano à **Vida e armadura** |
| **G3** | **Conjurar ao final do turno dos aliados**; efeitos **Empurrar, Perfurar e Congelar**, com dano à Vida e armadura e preservação das propriedades menores pertinentes |

**DEFINIDO — SRD v0.79:** magia de Água pode **remover Congelamento** de um alvo. Congelar continua imobilizando e **não remove Sangrando** por si só. **DEFINIDO:** o conjurador realiza uma **rolagem contra a DE defensiva do alvo**; sucesso remove Congelamento e a imobilização causada por ele, falha mantém a condição. **DEFINIDO:** **Água G1** já permite essa remoção mediante o teste descrito; não exige G2. Não presumir custo adicional.

**Perfurar no crítico** pode ser ativado por esse gatilho sem exigir o gasto alternativo de 1 PP ou 1 Coragem. O congelamento G1 Leve, sozinho, não causa dano. A descrição atual não confirma a **Desvantagem** mencionada numa tabela histórica de Água; o modificador **não é acrescentado automaticamente** nesta Perícia sem nova aprovação.

**Nome atualizado:** a antiga entrada **Elemento: Água** da ficha corresponde à mesma habilidade, agora denominada **Perícia em Elemento Água**, sem segunda compra nem exclusão de personagens anteriores.

**PENDENTE:** condições mecânicas de Congelar e Perfurar, tempo/alcance, forma exata da conjuração após o turno dos aliados, danos à Vida/armadura e como se preservam ou acumulam efeitos menores no G3. Atos utilitários sem ataque carecem de procedimento específico.

### Perícia em Elemento Terra [DEFINIDO / detalhamento PENDENTE]

**Custo: 1 XP. Requisitos: Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1.** Habilita **magias elementais Leves de Terra**. Ao acertar um ataque, **independentemente de crítico**, pode pagar **1 PP ou 1 Coragem** para ativar **um efeito especial escolhido**, respeitando o Grau de conjuração habilitado.

| Grau | Efeitos de Terra |
|---|---|
| **G1** | **Desvantagem por 2 rodadas** (ex.: terra nos olhos); **emaranhar os pés** ou **derrubar**; mover pedras pequenas em alta velocidade; criar **plataformas de deslocamento**; **sentido sísmico em 18 × 18 m**, permitindo localizar **criaturas furtivas e armadilhas** |
| **G2** | **Enredar e imobilizar**, aplicando **Desvantagem por 2 turnos**; **espinhos causando dano à armadura/proteção**; **sentido sísmico de 32 × 32** |
| **G3** | **Conjurar ao final do turno dos aliados**; área de efeito **5 × 5**, linha, cone ou círculo **a partir do alvo**; **dano, empurrão e derrubada**; **sentido sísmico de 64 × 64** |

**Observação:** os períodos de **2 rodadas (G1)** e **2 turnos (G2)** foram informados de modo distinto e não foram equiparados. Apenas o sentido sísmico G1 especifica expressamente metros; as unidades das dimensões G2/G3 e da área de efeito 5 × 5 ainda são **PENDENTES**.

**PENDENTE:** quantidade de dano de espinhos/ataques, testes resistidos, alcance das formas, detecção sísmica e suas limitações, definição geométrica de “a partir do alvo”, forma de aplicar os efeitos fora de ataques e procedimento de conjuração no fim do turno dos aliados. Os Graus G2 e G3 não ficam automaticamente disponíveis pela compra da Perícia G1.

**Continuidade:** substitui a entrada antiga **Elemento: Terra** da ficha, conservando o identificador e personagens salvos. Não é necessário adquirir as duas versões.

### Perícia em Elemento Fogo [DEFINIDO / detalhamento PENDENTE]

**Custo: 1 XP. Requisitos: Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1.** Habilita **magias elementais Leves de Fogo**. Em ataques que acertem, **independentemente de crítico**, gastar **1 PP ou 1 Coragem** permite aplicar **um efeito especial escolhido** do elemento, conforme o Grau habilitado.

| Grau | Efeitos e manifestações de Fogo |
|---|---|
| **G1** | **Disparo à distância** que **danifica armadura**, mas **não causa queimadura direta à Vida**; **iluminar** ou **conduzir chamas**. **Não produz fogo do nada**: exige chama/faísca, como lamparina a óleo, isqueiro ou foco pequeno encantado (ex.: luvas que produzem faísca ao estalar os dedos) |
| **G2 — Queimar** | Ampliar a área para **4 × 4**, em **cone, linha ou círculo**. Em acerto, **cada Pavor não anulado vale 1 dano à Integridade da armadura**, substituindo a contribuição comum de `⌊P/2⌋`: **E + P à Integridade**, sem dano direto adicional à Vida por Queimar. Excedente após a proteção segue regras usuais. **Sem foco**, invocar fogo custa **1 Coragem adicional** à ativação normal |
| **G3 — Derreter** | Ao acertar, causa o dano de **Queimar à Integridade (E + P)** e acrescenta **exatamente 1 ponto de dano direto à Vida**, sem duplicar o dano integral; este ponto fixo **não dobra no crítico**. Mantém **conjuração ao fim do turno dos aliados** e área **8 × 8**, em **círculo, cone ou linha** |

**Interação de condições [DEFINIDO — SRD v0.79]:** aplicar **Queimar remove Sangrando e desfaz Congelamento**. Fogo G1 mesclado com Sagrado pode aplicar Queimar sem causar dano; Fogo G1 sem essa mescla mantém seu dano convencional à armadura. Uma magia de **Água G1** também pode remover Congelamento mediante **teste contra a DE defensiva do alvo**; não exige G2. Não confundir a remoção da condição com alteração do dano de G2/G3.

**Distinção [DEFINIDO — SRD v0.76]:** Queimar G2 danifica a **Integridade**, sem dano direto de propriedade à Vida; Derreter G3 mantém esse dano e adiciona **1 Vida direta fixa**. Uma rolagem com **3E e 2P** causa **5 à Integridade + 1 Vida direta** em G3; em G2, **5 à Integridade + 0 Vida direta**. Um crítico aplicável pode modificar o dano à Integridade, mas **não multiplica o +1 direto**. O efeito não é o dano integral à Vida exclusivo da Hemomancia. As imunidades elementais e custos já vigentes permanecem, sem automatizar um resultado contra barreiras pendentes.

**Estratégia de um mago de Fogo:** produzir ou carregar **uma pequena faísca** e **ampliá-la magicamente** pode gerar grandes incêndios e devastação. Isso descreve o potencial narrativo do elemento; danos persistentes, propagação e duração dos incêndios **não recebem regras automáticas** sem aprovação.

**Custo adicional de Fogo G2 [DEFINIDO]:** invocar fogo sem item de foco custa **1 Coragem ADICIONAL** à ativação normal de efeito especial: **1 PP + 1 Coragem** ou **2 Coragens** (1 Coragem da ativação + 1 adicional). Não cobrar esse acréscimo em magias de Fogo que não invocam fogo sem foco. **PENDENTE:** unidades e geometria das áreas 4 × 4 e 8 × 8, alcance, valores de dano, interação entre item de foco e criação de faísca, efeitos utilitários sem acerto e funcionamento de conjuração ao fim do turno dos aliados.

**Continuidade:** a entrada antiga da ficha **Elemento: Fogo** foi renomeada **Perícia em Elemento Fogo**, preservando a compra existente. Não cria uma segunda habilidade de Fogo.

### Perícia em Elemento Sagrado [DEFINIDO / procedimentos PENDENTES]

**Custo: 2 XP. Requisitos: Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2.** Concede acesso aos efeitos iniciais de Sagrado e **magias Leves**. Ao acertar um ataque, **mesmo sem crítico**, permite pagar **1 PP ou 1 Coragem** para ativar **um efeito especial escolhido** do elemento.

**Grau 1:** acalmar, purificar, apoiar e recuperar Coragem. **Um Êxito da capacidade sagrada pode ser convertido em 1 Coragem para um participante, uma vez por conjuração/turno.** Esse **Êxito é consumido** e **não conta para atingir a DE nem para causar dano**. Não se concede um Êxito gratuito para financiar a conversão, nem se convertem vários Êxitos no mesmo turno/conjuração.

**Graus 2 e 3:** são obtidos **a partir de combinações com outros elementos**. A compra de Sagrado isoladamente não fornece poderes G2/G3 prontos nem dispensa habilitações de combinação.

**PENDENTE:** procedimento de acalmar/purificar/apoiar sem ataque; momento da escolha de converter um Êxito e o que ocorre se o acerto deixar de alcançar a DE após o gasto; alcance/beneficiários e limites da recuperação de Coragem; exigência de pagamento de ativação (1 PP ou 1 Coragem) para a conversão de Êxito em ações não ofensivas; quais combinações habilitam efeitos de Grau 2 e 3.

**Continuidade:** substitui a antiga entrada **Magia Sagrada** (custo histórico 3 XP) por **Perícia em Elemento Sagrado** (**2 XP**), preservando a Perícia existente no cadastro de personagens.

### Elementos individuais e seus efeitos [DEFINIDO conceitualmente / detalhes PENDENTES]

Os elementos **têm utilidades próprias** e não dependem de estarem combinados. A tabela organiza os efeitos por **peso/Grau do efeito** na referência de continuidade; um personagem não ganha efeitos pesados só por conhecer o elemento. Toda aplicação exige fonte, habilitação pertinente e sucesso na **Dificuldade de Êxito**; custos de Pontos de Perícia, distância, área e efeitos avançados ainda dependem dos requisitos.

| Elemento | Leve / Grau 1 | Médio / Grau 2 | Pesado / Grau 3 |
|---|---|---|---|
| **Água** | Congelar e imobilizar por 1 rodada com Desvantagem, sem dano automático | Perfuração no crítico habilitado | Empurrar e causar dano; mantém condições menores pertinentes |
| **Fogo** | Disparo convencional e conduzir chamas, sem dano direto à Vida | **Queimar:** E + P à Integridade; área 4 × 4 | **Derreter:** E + P à Integridade e **+1 Vida direta fixa**; área 8 × 8 e conjuração ao fim do turno dos aliados |
| **Terra** | Desvantagem por 2 rodadas | Enredar, imobilizar e espinhos que desgastam proteção | Dano, empurrar e derrubar |
| **Ar / Vento** | Mover mais rápido, puxar/empurrar objetos | Sufocar, deslocar e derrubar | Grande área, vários alvos e possíveis danos de queda |

**Elementos especiais:**

- **Psíquico / Psique:** elemento inicial de natureza neutra; técnicas específicas podem neutralizar a natureza de um efeito e contornar certas imunidades.
- **Sagrado:** apoiar, acalmar, purificar e recuperar Coragem. A Perícia em Elemento Sagrado custa 2 XP, exige Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 e permite converter **1 Êxito da capacidade sagrada em 1 Coragem para um participante** no máximo uma vez por conjuração/turno; o Êxito gasto **não conta para DE nem para dano**. Graus 2 e 3 dependem de combinações.
- **Trevas [DEFINIDO, SRD v0.42]:** escuridão, maldições e risco; técnica habilitada concede **+2P válidos à própria rolagem**, antes da DE. Os pontos contam para **acerto, dano e Pavor transferível**, não apenas para dano depois de acertar. O conjurador escolhe **um ou dois alvos**; contra dois, usa **uma única rolagem** comparada com cada DE. O Pavor não anulado é **distribuído tão igualmente quanto possível** entre os dois (se ímpar, o conjurador escolhe quem recebe 1P a mais) **ou concentrado integralmente num alvo**. Não duplicar Pavor; atacar somente um alvo também é válido. Os requisitos **Disciplina 2 + Inteligência 2 + Criar Item de Foco e Magia** e custo **1 PP ou 1 Coragem no acerto** permanecem; fluxo de gasto em falha é PENDENTE.
- **Sangue [REWORK — SRD v0.73]:** a técnica separada **Extração de Sangue está revogada**. Sangue puro conjurado causa dano convencional contra proteção e armadura; sem armadura ou havendo excedente que atinja a Vida, cada ponto de Vida realmente perdido de inimigo gera 1 marca de sangue derramado. Para **amplificar uma magia**, inclusive habilitar dano direto à Vida contornando a armadura, **sacrificar 1 Vida própria OU consumir 3 marcas de sangue derramado de inimigos** (custos alternativos). Amplificação não concede dano numérico gratuito nem cria um dano extra de 1 Vida no alvo. Uma vez por turno, o Hemomante também pode escolher a substituição de Coragem para manter mais um dado ou elevar um dado, usando a mesma regra de pagamento. **Quando uma magia de Sangue acertar e tiver sido amplificada para contornar a armadura, TODO o dano convencional calculado do ataque é aplicado diretamente à Vida do alvo**, sem desgaste simultâneo de Integridade. Usa-se a fórmula vigente de dano e de crítico, **sem bônus numérico gratuito**, e preservam-se Pavor e outros riscos. Um ataque que falhe não causa dano à Vida; os recursos pagos pela amplificação não são devolvidos. **Exclusivo da magia de Sangue dessa construção**, não se estende a Perfurante nem aos demais elementos. O rolador da ficha exibe o resultado para a Vida, mas aplicação em ficha externa ainda é manual. **Escudos físicos (inclusive Levantar Escudo) e Escudos Arcanos de outros elementos NÃO anulam o dano direto da Hemomancia amplificada**; **somente Escudo Arcano de Sangue ativo e aplicável neutraliza essa propriedade**. Nessa exceção, o ataque volta a ser resolvido pelas regras usuais da barreira e das demais proteções, mantendo acerto, dano convencional e riscos, sem aplicar dano integral direto à Vida. Escudo Arcano de Sangue é **Escudo Arcano com elemento Sangue incorporado**, não uma Perícia nova nem um custo adicional presumido. Permanecem **PENDENTES** detalhes de coexistência de defesas, imunidades e aplicação em área.
- **Veneno:** inflige penalidades de Saúde por turnos do alvo em até dois acúmulos, **não provoca dano automático à Vida**.
**Raio não é elemento independente [DEFINIDO].** É uma **condição, manifestação ou efeito** que determinados elementos podem produzir quando a técnica e o ambiente o permitem. Exemplos conceituais: um **raio de Fogo** pode produzir impacto e queimadura; uma magia baseada em fenômeno **natural** pode atrair uma descarga atmosférica até a terra em dia chuvoso; a **Água** pode ser eletrificada; o **Ar/Vento** pode permitir eletrificação e condução pelo corpo. Nenhum desses exemplos concede dano extra, condição automática ou custo próprio não aprovado. **PENDENTE:** gatilhos, requisitos, riscos e valores das técnicas. Não comprar “Elemento: Raio”.

### Hemomancia e Transfusão Sanguinária [DEFINIDO em custos / PENDENTE em dano direto]

**Transfusão Sanguinária** é uma **nova Perícia**, custo de aquisição **1 XP** e requisitos **Transfusão + Perícia em Elemento Sangue**. É uma **conjuração ativa**, não uma cura gratuita passiva. Para cada **3 marcas elegíveis de sangue derivadas de dano direto à Vida**, pode-se recuperar **1 Vida**, até o máximo. Não há mais uma ação de Extração de Sangue nem reserva de sangue extraído separada. As 3 marcas devem estar disponíveis na reserva de **sangue derramado de inimigos**, após qualquer gasto anterior; não contar duas vezes a mesma perda de Vida.

**Geração das marcas [DEFINIDO — SRD v0.72]:** para cada **1 ponto de dano direto aplicado à Vida**, registra-se **1 marca**. Um golpe que causa 3 de dano à Vida produz **3 marcas**, não apenas uma. Dano absorvido pela armadura e Sangramento sem dano não geram marcas. O protótipo registra apenas **sangue derramado de inimigos**; sacrifícios de Vida do próprio Hemomante **não** são automaticamente adicionados a essa reserva.

A ficha do Hemomante possui **uma reserva manual de sangue derramado de inimigos**. Permite registrar de uma só vez o número de pontos de Vida efetivamente perdidos pelos inimigos. Marcas antigas das duas reservas são unificadas uma única vez para migração e devem ter sua procedência conferida. A elegibilidade de fontes e o tratamento de custos de Vida, assim como os custos de conjuração, alcance, duração e coleta, permanecem **PENDENTES**; o registro na ficha serve ao playtest e pressupõe validação do Narrador. **Transfusão**, a Perícia pré-requisito, tem seus próprios custos de compra ainda pendentes, logo a compra da nova Perícia exige primeiro resolver a aquisição da anterior.

**Consumo do Sangue [DEFINIDO]:** marcas de sangue **derramado de inimigos** usadas para conjurar são **consumidas no ato**, inclusive se a magia de Sangue causar apenas dano convencional contra a armadura. Converter a marca em efeito especial também a consome; uma marca gasta não pode ser usada novamente nem financiar Transfusão. A própria Transfusão consome três marcas para recuperar 1 Vida — não exigir uma quarta marca sem outra decisão. A geração de **uma marca por ponto de dano direto à Vida** está DEFINIDA (v0.72); permanecem **PENDENTES** as condições de coleta, quais fontes contam e a quantidade de marcas consumidas por técnicas ainda não detalhadas. A ficha oferece um botão de gasto manual sem efeitos mágicos automáticos.

**Amplificação por Sangue [DEFINIDO — v0.73; limite reafirmado em v0.79, 17/11/2026]:** o Hemomante pode realizar **no máximo uma amplificação de Sangue por turno**, mesmo que possua recursos suficientes para outras. Uma vez por turno, escolher **uma** destas ações: (1) amplificar a magia, incluindo optar por dano direto à Vida apesar da armadura; (2) manter um dado adicional; ou (3) elevar um dado. O custo, **alternativo e não cumulativo**, é **perder 1 Vida do próprio Hemomante OU consumir 3 marcas de sangue já derramado por inimigos**. A ficha registra o pagamento e limita a uma ativação por turno, mas **não modifica o dano ou os dados automaticamente**. Para dano à Vida contornando a armadura, a quantidade de dano aplicável e a interação com barreiras ainda são PENDENTES; o pagamento não causa 1 dano ao alvo por si só.

### Peso padrão dos elementos e mudança de peso [DEFINIDO / Perícia parcialmente PENDENTE]

**Todas as magias elementais começam com peso padrão Leve e Grau 1 [DEFINIDO]**, seja o elemento Fogo, Água, Terra, Ar/Vento, Psique, Sagrado, Sangue, Trevas ou Veneno. Isto **substitui o antigo padrão Médio**. Não há elemento “Raio”; manifestações elétricas são efeitos/condições pertinentes. Técnicas de Graus superiores mantêm seus próprios requisitos e não são liberadas gratuitamente pela escolha de um elemento.

**Conjuração Refinada (1 XP):** passa a ampliar alcance de efeitos mágicos; distância e procedimento PENDENTES. O efeito antigo de alterar peso por esta Perícia foi substituído. Requisitos antigos preservados até nova escrita.

**Os efeitos Leves, Médios e Pesados continuam válidos:** afinidade com Balanço e demais propriedades dependem do peso efetivo da técnica, respeitando a habilitação e o Grau. A tabela apresenta a progressão de efeitos *Leve/Grau 1*, *Médio/Grau 2* e *Pesado/Grau 3*; a magia inicial é Leve/Grau 1, mas isso **não** oferece acesso antecipado às aplicações de Graus superiores.

**Peso da magia** não é **peso físico de inventário** nem sinônimo de Grau ou de dados. A alteração do padrão não remove outros requisitos já definidos para especializações, como os acessos específicos de Sangue e Trevas.

### Exemplos de combinação criativa em diferentes cenas

| Elementos | Durante um conflito | Fora do conflito |
|---|---|---|
| Fogo + Ar | Calor, fumaça ou área perigosa quando habilitada | Forja, ventilação, sinalização |
| Água + Terra | Lama, cobertura, alterar o caminho | Irrigação, moldagem de barro, travessia |
| Água + Ar | Névoa como elemento de ocultação situacional | Refrescar, dispersar vapor |
| Fogo + Terra | Trabalhar obstáculos e materiais | Cerâmica, forja, transformação |
| Água com manifestação elétrica habilitada | Conduzir eletricidade na água, se a técnica e o ambiente permitirem | Investigar condução elétrica e fenômenos naturais |

São **exemplos narrativos**, não um catálogo de bônus ou vulnerabilidades automáticas. O Narrador define DE, efeitos, risco, alvo, recursos, extensão, disponibilidade dos elementos e segurança de aliados. A criatividade deve incentivar **soluções dentro e fora de combate**, sem dispensar perícias e custos.

### Defesas elementais [DEFINIDO / PENDENTE]

- Resistência aos **dois** elementos: metade do dano dos Êxitos, Pavor não causa dano.
- Imunidade ao **principal**, mas não ao secundário: metade dos Êxitos, sem componente de dano de Pavor.
- Imunidade aos **dois** elementos: dano elemental zero.
- Resistência apenas ao secundário, sem resistência ao principal: dano normal.
- Vulnerabilidade **efetivamente explorada**: dobra o dano dos Êxitos, sem duplicar a DE.

Sagrado e Trevas possuem vulnerabilidade mútua. Veneno e Psique não possuem fraquezas elementais universais. A matriz de fraquezas naturais, arredondamentos de metades e efeitos mistos ainda possui pendências.

**Magia extraordinária** com d20 depende do Grau 7 e requisitos desde o nível 10. No nível 20, uma Maestria pode converter um dado de Inteligência em d20 por **2 PP**; gastar +1 PP da Especialidade Elemental pode ativar área e efeitos avançados, eventualmente afetando aliados. Uma conjuração básica sem tais efeitos pode permanecer em um alvo único.


## VIII. Armas e seus efeitos

O tipo de arma, sua categoria de **ataque leve, médio ou pesado**, seu alcance, sua composição e suas Perícias determinam a ação. A profissão do jogador não impõe um estilo fixo. Veja a matriz de Vantagem/Desvantagem do capítulo V.

**Peso da arma e dados não são a mesma coisa [DEFINIDO].** O peso físico não determina automaticamente o tamanho ou a quantidade dos dados da arma. O confronto favorável entre o peso do ataque e o Balanço concede **+1A pela Vantagem natural**, com ou sem Maestria. A Maestria **Arma Certa** acrescenta **+1E somente quando a arma corresponde à categoria favorável contra aquele Balanço**, além do +1A natural. **PENDENTE:** custo de XP e requisitos definitivos para comprar essa Maestria.

### Armas físicas já documentadas [DEFINIDO no conceito / catálogo PENDENTE]

| Tipo | Propriedade possível | Limite |
|---|---|---|
| **Cortante** | **Sangramento superficial** habilitado | Aplica o **estado Sangrando mesmo através da armadura**; a condição **não reduz Vida** nem causa dano periódico por si só |
| **Perfurante** | Em acerto, cada Pavor não anulado vale **1 dano à Integridade** da armadura, substituindo `⌊P/2⌋` (não soma os dois) | Não ignora armadura nem acrescenta dano direto à Vida. Escudo Arcano Psíquico ativo ou bloqueio físico frontal anula essa propriedade, não o dano básico |
| **Cravar** | Arma Média ou Pesada fica presa ao escudo físico após **acertar a DE** e **ativar a característica por crítico ou Perícia de arma correspondente** | Em acerto não crítico com Perícia, custa **1 PP ou 1 Coragem**; crítico ativa uma característica gratuitamente. Escudo Pesado exige arma Pesada. **Cada arma cravada aplica −1E cumulativo** em Levantar Escudo; o peso de cada arma presa é carregado com o escudo |
| **Pesada** | Derrubar, com manobra ou crítico apropriado | Não derruba em toda rolagem |
| **Longa** | Criar espaço, afastar ou desengajar com Antecipar especial | Custo e procedimento da técnica dependem de habilitação |
| **Dupla empunhadura** | Combinar armas com Atributo, com Perícia | Não ganha Vantagem absoluta gratuitamente; dificulta uso de escudo |

**Cravar [DEFINIDO — SRD v0.77]:** não é uma reação gratuita nem um acerto automático. A arma precisa possuir Cravar e ser Média/Pesada; o ataque precisa **alcançar a DE**; o gatilho é **crítico ou Perícia de Armas Médias/Pesadas pertinente**. A Perícia habilita a característica em acerto comum por **1 PP ou 1 Coragem**, enquanto o crítico ativa uma característica gratuitamente. A arma não fere diretamente a Vida por Cravar: ela permanece presa ao escudo físico. Escudo pesado só pode ser cravado por arma pesada. **DEFINIDO — SRD v0.79:** a penalidade é **−1E por arma cravada e cumulativa**, aplicada somente quando o defensor executa **Levantar Escudo**, não nos demais testes. O peso extra acompanha o escudo até abandono ou retirada de cada arma. A retirada por teste combinado e DE conforme peso está definida na sequência. **DEFINIDO — v0.79, opção A:** quem retira com sucesso a arma cravada **recebe-a imediatamente em uma mão livre**, sem deixá-la cair no chão e sem ação adicional para recolhê-la. **PENDENTE:** como resolver a retirada sem mão disponível e vínculo automático entre fichas.

**Retirar Cravar [DEFINIDO — SRD v0.78]:** para retirar do escudo a arma presa, o personagem deve **alcançar a DE correspondente ao peso da arma**, limitada a **DE 4**. Deve formar uma **combinação normal de aptidões que inclua Força, Atletismo ou Vigor**, com outra fonte pertinente: por exemplo, **Força + Atletismo** ou **Vigor + Atletismo**. Outros pares dependem do contexto validado pelo Narrador e das restrições normais de categoria e habilitações. **Não existe exceção para rolar fontes isoladamente.** Não exige Perícia em Armas Médias/Pesadas nem crítico adicional. **Sucesso:** remove a arma, que **passa imediatamente à mão livre de quem realizou a retirada**; não cai automaticamente no chão nem exige nova ação de coleta. Elimina **apenas o −1E correspondente a essa arma** em Levantar Escudo e seu peso deixa de contar como preso ao escudo. A arma passa a integrar a posse de quem a retirou. As demais armas eventualmente cravadas continuam impondo −1E cada uma. **Falha:** a arma continua cravada. **DEFINIDO — SRD v0.79:** DE de retirada por peso da arma: **Leve 1; Média 2; Pesada 3**, teto geral de **DE 4**. A tabela de retirada para arma Leve não concede habilitação para aplicar Cravar com arma Leve; a aplicação continua restrita a arma Média/Pesada com os gatilhos aprovados. No protótipo, a ação é rolada na seção do escudo e a alteração de inventário só é confirmada após o sucesso. Custos adicionais não foram criados pela revisão; detalhes temporais da ação e o procedimento **sem mão disponível** permanecem **PENDENTES**; com uma mão livre, a transferência direta à mão de quem retira está **DEFINIDA**.

**Sangramento [DEFINIDO — SRD v0.70]:** a propriedade cortante habilitada aplica o **estado Sangrando ao alvo, ignorando a armadura apenas para estabelecer a condição**. Não reduz Vida, não acrescenta dano imediato nem periódico e não cria penalidade automática. O **dano normal do golpe**, se existir, continua passando por escudo, Integridade de armadura e eventual excedente; somente **o estado**, não o dano físico, ignora a armadura. A condição exige os gatilhos e habilitações do efeito, não é automática para todo ataque cortante.

O estado Sangrando **permite aplicar veneno fisicamente** (por arma previamente envenenada e habilitada), pode viabilizar a **transmissão de veneno por magia de Sangue** e **habilita as aplicações pertinentes de magia de Sangue**. Nenhuma dessas interações é gratuita: permanecem os requisitos e custos das técnicas e os limites de doses. **PENDENTE:** procedimento e custo da transmissão de veneno com magia de Sangue, além da reconciliação entre a exigência autoral recente de que o próprio conjurador esteja Sangrando e os custos históricos de conjurar sem esse estado.

**Exemplos de equipamentos presentes no projeto:** adagas/facas (perfuração e pontos vitais quando habilitados), espadas (efeito próprio de crítico pendente), machados cortantes-pesados (combinação em conceito), lanças longas e de duas mãos (manobras ainda propostas), arcos (crítico específico pendente), escudos e Punhos/desarmado (requisitos próprios). Não apresentar exemplos de propriedades como efeitos gratuitos já disponíveis.

### Proximidade, armas longas e alcance efetivo [DEFINIDO]

**Próximo / adjacente** significa **até 1 metro** do inimigo. Armas comuns de combate corpo a corpo atingem a **1 m**. Uma **arma longa** atinge a **2 m** e, enquanto mantém o inimigo a essa distância, impede um contra-ataque de quem só possui alcance de 1 m. Um oponente com **outra arma longa** pode responder normalmente no mesmo alcance. Esse efeito protege pela distância, **não anula Pavor**.

A distância máxima normal de uma arma ou técnica é **R**. Para além desse alcance, aplicam-se as condições seguintes:

| Distância | Condição | Modificador |
|---|---|---|
| Até **R** | Normal por alcance | Nenhum |
| **Acima de R** e **abaixo de R + 8 m** | Desvantagem | **−1A** |
| De **R + 8 m** a menos de **R + 16 m** | Desvantagem absoluta | **−1E** |
| A partir de **R + 16 m** | **Acerto de Sorte / Ação de Sorte** | **−2E** |

Os patamares **se substituem**; não se aplica −1A e depois −1E e depois −2E pela mesma fonte de distância. Outros riscos independentes, como aliados a até 1 m do alvo, podem acrescentar condições. A possibilidade e os limites de ataques muito além de R + 16 m continuam **PENDENTES**.

### Maestria em Arremesso de Armas [DEFINIDO / detalhes PENDENTES]

**Nome corrigido:** Maestria em Arremesso de Armas, não “Arremesso de Armas Leves”. **Compra: 1 XP. Requisitos: Perícia em Armas Leves, Força 2, Destreza 2, Agilidade 1. Ativação: 1 PP ou 1 Coragem.** Arremessa **Armas Leves a 24 m**, causando dano e efeitos habilitados, e a arma fica alojada no alvo. Usa os patamares de armas à distância além do alcance, **sem Desvantagem por arremessar próximo do alvo**; aliados próximos do inimigo impõem Desvantagem.

- **Acerto sem Pavor:** pode realizar nova jogada, avançar até o inimigo, retirar a arma e atacar novamente corpo a corpo.
- **Acerto com Pavor:** o inimigo pode tentar pegar a arma alojada e utilizá-la ou arremessá-la.
- **Falha sem Pavor:** arma cai no meio do caminho; **1A** pode permitir correr e recuperá-la.
- **Falha com Pavor:** arma cai perto do alvo ou pode atingir aliado próximo, conforme comparação com a DE do aliado.
- **Retirada resistida quando exigida:** teste **Armas + Força + Atletismo** contra dificuldade determinada por **Força + Vigor + Atletismo do inimigo**, considerando os dados comprados.

**PENDENTE:** gatilho da retirada resistida versus avanço após acerto sem Pavor, conversão de dados inimigos em DE, consequências de alojamento, comparação exata de DE do aliado e se nova jogada muda o fluxo normal. Para requisitos de outras Perícias, usar exclusivamente o nome **Maestria em Arremesso de Armas**.

**Barulhenta [DEFINIDO — SRD v0.69]:** característica **passiva** que fornece **+1P**, inclusive em armas de fogo. **Não depende de crítico** nem de ativação paga. Mesmo no crítico, permanece +1P, não +2P. O Pavor se sujeita aos mesmos riscos e gastos de Antecipar.

**Perfurante em armas de fogo [DEFINIDO — SRD v0.69]:** armas de fogo que **possuem a propriedade Perfurante** utilizam seu dano adicional à Integridade **automaticamente em acertos**, sem gastar 1 PP/1 Coragem para habilitar essa característica e sem precisar ativar a Perícia para esse efeito específico. A arma continua exigindo as habilitações normais para suas outras capacidades; não se atribui Perfurante à escopeta ou a outros modelos sem essa propriedade.

### Armas de fogo — Graus atualizados [DEFINIDO / catálogo PENDENTE]

Armas de fogo dependem de **munição por calibre, carregador, disparos consumidos, recarga, alcance e recuo**. Armas suscetíveis a travamento podem travar com **Pavor predominante**, e não qualquer Pavor; limpar travamento exige Engenharia pertinente sem usar dados da própria arma. **Revólver não trava.**

| Arma | Grau definido | Características em desenvolvimento |
|---|---|---|
| Revólver | **G1** | Não trava; Perícia básica histórica 3 XP |
| Pistola | **G2** | Carregador e travamento; Perícia básica 5 XP |
| Metralhadora | G3 | Vários disparos/munição; alcance histórico 16 m; Perícia básica 5 XP |
| Doze / escopeta | G3 | Cone, derrubada, não perfurante; básica histórica 5 XP |
| Rifle | G4 | Avançada pode derrubar ou atravessar dois alvos alinhados; básica histórica 6 XP |
| Lança-granadas | **G5** | Área, recuo, risco de ferir aliados; Perícia básica histórica 10 XP |

**PENDENTE:** preços finais, composições, dano, alcance e procedimentos de recarga. **A referência antiga de 3d20 do lança-granadas é incompatível com o limite atual de até dois d20 por ação de jogador comum**, devendo ser refeita. Os **Graus acima estão definidos**, mas não se devem tratar como definitivos os preços históricos de Perícias, danos, composições e fichas ainda não aprovados.

## IX. Perícias e profissões emergentes

Perícias têm preços e requisitos específicos; numerosas opções baratas podem se combinar em árvores abertas. Um ramo pode se conectar a outro sem exigir comprar toda uma sequência de uma “classe” tradicional.

### Perícias autorais: corpo a corpo, disparos e recuperação [DEFINIDO / PENDENTE]

O Aprendiz pode investir o **saldo livre de XP** em Perícias, desde que cumpra seus requisitos. Não há reserva exclusiva de 5 XP para esta categoria. Estes ramos são acessíveis por requisitos, não por classes obrigatórias. **Espadachim** é apenas uma inspiração de personagem.

| Perícia | XP | Requisitos (decisões mais recentes) | Função |
|---|---:|---|---|
| **Perícia em Armas Leves** | **2** | **Disciplina 1** | Ignora Desvantagem do confronto com oponente pesado; efeitos da arma ativados em crítico gratuitamente ou no acerto não crítico por **1 PP ou 1 Coragem** |
| **Perícia em Armas Médias** | **2** | **Disciplina 1 + Força 1** | Mesmo gatilho para efeitos; ignora Desvantagem contra oponente médio |
| **Perícia em Armas Pesadas** | **2** | **Disciplina 2 + Força 2** | Mesmo gatilho para efeitos; ignora Desvantagem contra oponente leve |
| **Disciplina Avançada** | **1** | **Disciplina 2** | **Somente em ação com Disciplina**, combina +1 Atributo, Conhecimento ou Prática pertinente |
| **Manejo Perfeito — Armas Corpo a Corpo** | **PENDENTE** | **Disciplina Avançada + Destreza 2** | Arma certa aplica Vantagem Absoluta; se já possui, Golpe Certo (definição pendente) |
| **Golpe Fulminante** | **1** | **Disciplina 2 + Força 2 + especialização corpo a corpo** | Em acerto, 1 PP ou 1 Coragem altera Pavor de ½ para **1 dano por Pavor mantido e não anulado** |
| **Espalhar Golpe** | **1** | **Disciplina 2 + Destreza 1 + Golpe Fulminante + especialização corpo a corpo** | **1 PP ou 1 Coragem por alvo adicional** no **raio de 2 m ao redor do atacante**; cada adicional recebe **metade do dano de Êxitos arredondada para baixo**; **sem +1E** |
| **Pugilismo** | **1** | **Disciplina 1 + Força 2 + Destreza 1** | Desarmado: 1 PP ou 1 Coragem permite mudar o peso do soco; limites pendentes |
| **Artista Marcial** | **1** | **Disciplina 2 + Pugilismo + Destreza 2** | Crítico que ativa Pugilismo ou 1 PP ou 1 Coragem por manobra; **uma por vez**: Empurrar, Agarrar, Derrubar ou Desarmar |
| **Maestria em Arremesso de Armas** | **1** | **Perícia em Armas Leves + Força 2 + Destreza 2 + Agilidade 1** | Arremesso de Arma Leve a 24 m, alojamento e consequências por resultado (ver Armas) |
| **Disparo Fulminante** | **PENDENTE** | **PENDENTE — será definido pelo autor** | Ramo separado para disparos/arremessos; detalhes de ativação e custo aguardam decisão |
| **Disparo Múltiplo** | **PENDENTE** | **PENDENTE — será definido pelo autor** | Ramo separado; **alvos adicionais até 2 m do alvo principal**, não do atacante |
| **Recuperação Vigorosa** | **PENDENTE** | **Vigor 3** | Acelera os últimos pontos da caixa Machucado |
| **Maestria em Recuperação Vigorosa em Movimento** | **PENDENTE** | **Recuperação Vigorosa + Vigor 6** | Recuperação natural em viagem após 8 h sem dano; demais prazos mantidos |
| **Recobrar Coragem** | **1** | Não informado | Descanso curto/longo e cena narrativa proporcionam **2 Coragens** |
| **Maestria em Manejo Duplo** | **1** | Requisitos anteriormente informados, **mais Destreza 2 + Agilidade 1** | Um golpe com duas armas, Armas + Armas + Atributo; dois efeitos em crítico; combinação dos requisitos antigos pendente |
| **Instinto de Sobrevivência** | **PENDENTE** | **Vigor 3** | Ignora **−1A** de Incapacitado, sem apagar **−2E** |

**Requisitos atualizados [DEFINIDO]:** toda menção de Armas 1 como requisito é substituída por Disciplina 1. Armas Leves exige Disciplina 1; Armas Médias e Pesadas mantêm seus requisitos específicos de Disciplina e Força. Os benefícios por crítico e o custo de 1 PP ou 1 Coragem em acerto não crítico permanecem como anteriormente definidos. Desvantagens ignoradas são as da relação de peso indicada, não penalidades independentes.

**Disciplina e composição [DEFINIDO]:** Disciplina é a Prática compartilhada de Armas e Conjuração. O teste marcial básico **Disciplina + Atributo** pode ser rolado **sem Perícia de armas adicional**; as Perícias habilitam efeitos/especializações pertinentes. A conjuração especializada mantém suas habilitações próprias. **Disciplina Avançada (1 XP, Disciplina 2)** permite, **apenas ao realizar ação com Disciplina**, combinar mais **um Atributo, Conhecimento ou Prática** pertinente — inclusive um **segundo Atributo diferente**. A fonte adicional usa seus próprios dados, respeitando a pilha, o limite de retenção e a confirmação contextual do Narrador; não fornece +1 Êxito grátis. Combinação de mais de três fontes com Perícias simultâneas continua PENDENTE.

### Conhecimentos e Práticas Avançadas [DEFINIDO — SRD v0.79]

**Regra autoral mais recente (17/11/2026):** toda Perícia de **Conhecimento Avançado ou Prática Avançada** exige **Grau 2 na fonte especializada** e custa **1 XP**. Quando o personagem possui a Perícia pertinente, pode usar **o Conhecimento ou Prática especializado como fonte principal** e **até duas fontes adicionais pertinentes**, formando uma rolagem de **até três fontes no total**. Uma delas deve fornecer dado de Atributo. Respeitar o máximo de 9 dados rolados, 4 mantidos e a pertinência da ação; não escolher novamente a mesma fonte principal por esta regra. Não há soma automática de duas Perícias Avançadas para uma quarta fonte.

**Medicina Avançada [DEFINIDO]:** custa **1 XP** e requer **Medicina 2**. Em tratamento de **Sangrando**, Medicina deve ser a fonte predominante; fazer teste contra a **DE defensiva do alvo tratado**, com **Desvantagem (−1A)**. Em sucesso, remover Sangrando; em falha, manter. Sangramento não expira automaticamente. Esta habilidade foi adicionada ao criador na branch da revisão v0.79, mas sua remoção automática no alvo ainda não foi implementada.

**Disciplina Avançada [DEFINIDO]:** mantém **Disciplina 2**, custo **1 XP** e emprego de Disciplina como fonte principal. **Furtividade Avançada [DEFINIDO]:** mantém **Furtividade 2 + Perícia em Furtividade**, custo **1 XP**, com Furtividade predominante. **Novas especializações compráveis, todas por 1 XP e Grau 2 da própria fonte:** Proteção Avançada, Astronomia Avançada, Alquimia Avançada, Engenharia Avançada, Erudição Avançada, Atletismo Avançado, Artesão Avançado, Apresentação Avançada e Coleta Avançada. Esses nomes identificam apenas a capacidade de combinação com até três fontes; **não conferem novos efeitos temáticos automáticos**. Medicina Avançada, Disciplina Avançada e Furtividade Avançada completam as **12 especializações**, preservados os requisitos extras de Furtividade Avançada. Os verbetes e compras constam da branch da PR #58; a `main` não está atualizada enquanto a PR não for integrada.

**Interrupção da Hemomancia em canalização com três alvos Sangrando [DEFINIDO — SRD v0.79]:** um ataque recebido só cancela a preparação se **acertar a DE defensiva do Hemomante** **e** se a sua força for **igual ou superior à força da magia** já rolada e mantida na declaração. Nas duas forças, calcular **E + piso(P/2)** com símbolos válidos; não usar E+P bruto. Um empate de força interrompe apenas se também houver acerto na DE defensiva. Se uma das exigências falhar, o ataque não interrompe a preparação. **DEFINIDO — opção A:** ocorrendo uma interrupção válida, **a conjuração é perdida**. O Hemomante precisa **declarar uma nova conjuração, rolar novamente e iniciar mais três turnos completos de preparação**; não pode retomar a rolagem ou a contagem anteriores. **DEFINIDO — opção A:** **PP, Coragem ou cargas de foco já gastos na preparação interrompida são definitivamente consumidos**, sem restituição. A interrupção não cobra recursos adicionais ainda não pagos. A condição Sangrando dos três alvos usados como fonte não é consumida apenas por sustentar uma canalização.

**Referência de precedência:** [SRD de Continuidade v0.79](srd-continuidade-v0.79.md). Este texto prevalece nas matérias expressamente corrigidas em relação a descrições históricas deste Livro.

**Especializações corpo a corpo admitidas para Golpe Fulminante e Espalhar Golpe:** Perícia em Armas Leves, Perícia em Armas Médias, Perícia em Manejo Duplo, Perícia em Armas Pesadas ou Pugilismo. **Maestria em Arremesso de Armas não satisfaz mais esses dois requisitos**; os arremessos terão o ramo **Disparo Fulminante / Disparo Múltiplo**, com requisitos e custos de aquisição PENDENTES.

**XP inicial remanescente [DEFINIDO]:** ao **concluir a criação**, o XP não gasto dos orçamentos iniciais torna-se **saldo livre** para comprar Atributos, Conhecimentos, Práticas ou Perícias sem se limitar à categoria em que sobrou. Ex.: comprar Força 1 (1 XP) e Atletismo 1 (2 XP) libera o uso dos outros 15 XP do orçamento experimental de 18, inclusive em Perícias quando os requisitos forem atendidos. O saldo não gasto na criação continua disponível após a conclusão; compras consolidadas não geram reembolso automático.

**Espalhar Golpe [DEFINIDO]:** o inimigo principal já é atingido pelo ataque normal, sem pagamento de Espalhar Golpe. A cada **1 PP ou 1 Coragem**, **um inimigo adicional** dentro de um círculo de **2 m de raio centrado no personagem atacante** recebe metade do **dano dos Êxitos**. O primeiro pagamento já cobre o primeiro adicional; cada novo pagamento cobre mais um. **DEFINIDO: cada pagamento é consumido mesmo quando a rolagem não atinge a DE do alvo adicional escolhido.** Paga-se pela tentativa de incluí-lo no golpe, não pelo acerto. Essa regra de custo vale para Espalhar Golpe; os custos de Disparo Múltiplo continuam PENDENTES. **Não acrescenta +1 Êxito**. **“Golpe Colossal” era o nome anterior de Espalhar Golpe**, não técnica separada. **DEFINIDO:** a metade do dano dos Êxitos é **sempre arredondada para baixo** (⌊dano dos Êxitos ÷ 2⌋); com 5 de dano de Êxitos, cada alvo adicional recebe 2, antes das defesas. **DEFINIDO:** usa-se **o mesmo resultado da rolagem do ataque principal** contra a **DE de cada alvo adicional**, sem rolar novamente; se ficar **abaixo da DE de um alvo**, esse alvo **não é atingido**. Só os alvos cuja DE foi alcançada podem receber o dano reduzido. A mesma regra de comparação vale para **Disparo Múltiplo**, mas sua área é medida ao redor do alvo principal. **Ordem das defesas [DEFINIDO]:** primeiro obter a metade do dano dos Êxitos e arredondar para baixo, **depois** aplicar Integridade, resistências, imunidades e demais defesas **individualmente para cada alvo atingido**. Não aplicar automaticamente componente de dano de Pavor sobre os adicionais.

| Alvos totais | Adicionais | Gastos de Espalhar Golpe | Equivalente só em Coragem |
|---|---:|---:|---:|
| 1 | 0 | 0 | 0 |
| 2 | 1 | 1 PP ou 1 Coragem | 1 |
| 3 | 2 | 2 PP ou 2 Coragens | 2 |
| 4 | 3 | 3 PP ou 3 Coragens | 3 |

**Golpe Fulminante:** além do requisito de **Força 2**, custa separadamente **1 PP ou 1 Coragem** para aprimorar dano de Pavor no alvo atingido. **Espalhar Golpe** custa seus próprios recursos por alvo adicional. A combinação pressiona a reserva de Coragem e não ignora Pavor, Pressão ou Apavorado.

**Custo-padrão de ativação:** **1 PP ou 1 Coragem** quando explicitamente definido para a Perícia. **Exceção informada:** **Amplificar Atributo custa 2 PP ou 4 Coragens**; seus demais requisitos/efeitos não são introduzidos nesta seção.

**Disparo Múltiplo [DEFINIDO em geometria e DE / PENDENTE no restante]:** o círculo para os outros atingidos terá **2 metros de raio ao redor do alvo principal**; **o resultado do primeiro disparo é comparado à DE de cada alvo adicional, e erro ocorre se o resultado for inferior à DE individual**, sem nova rolagem. O ramo de arremesso é separado para evitar autorizar implicitamente que uma única arma arremessada produza ataques simultâneos; possibilidades como duas armas lançadas ou uma arma grande aguardam o detalhamento de requisitos pelo autor. A Maestria em Arremesso de Armas continua com seus próprios efeitos de alojamento e recuperação.

**Artista Marcial:** cada manobra adicional requer ativação própria e só se aplica uma por vez; o crítico de Pugilismo conserva sua condição anterior. **Recuperação em Movimento:** dano reinicia a contagem de 8 horas e não transforma automaticamente prazos semanais em 8h. **Maestria em Manejo Duplo:** além de DES 2 e AGI 1 agora definidos, falta determinar os requisitos combinados de Maestrias/Disciplina Avançada. **Manejo Perfeito:** requer DES 2, mas custo XP/Golpe Certo continuam pendentes.

**PENDENTES para revisão um a um:** requisitos e custos de Disparo Fulminante / Disparo Múltiplo; proteção e efeitos nos alvos adicionais de Espalhar Golpe e Disparo Múltiplo (a comparação da rolagem única com cada DE já está definida; a metade do dano arredondada para baixo vale para Espalhar Golpe); agrupamento de requisitos e dados de Manejo Duplo; custo de Manejo Perfeito e Golpe Certo; limites de Pugilismo; retirada de armas lançadas e riscos a aliados; custos de Recuperação Vigorosa, sua Maestria e Instinto de Sobrevivência; Disciplina Avançada; frequência de Recobrar Coragem. **Integridade das armaduras será fixada depois da análise de dano.**

### Furtividade após deslocamento [DEFINIDO / procedimento específico PENDENTE]

O Ladino com Perícia pertinente pode usar **1E para fugir** mesmo quando a ação principal falha; outros Êxitos podem ampliar a distância ou favorecer nova ocultação, de acordo com sua capacidade. **1A** pode auxiliar a desvencilhar e **1E** permitir correr.

**Nova decisão:** se o Ladino **realizar Furtividade e depois se mover**, **todos os inimigos deixam de saber onde ele está**, inclusive os que possuem DE defensiva superior ao resultado da Furtividade. O antigo contraste entre DE do adversário e Furtividade aplica-se, quando pertinente, **antes** desse deslocamento; **não anula a ocultação obtida ao mover-se**.

**Ataque para adivinhar a posição:** o inimigo tenta identificar onde o Ladino está durante a **própria rolagem do teste de ataque/dano**, precisando obter **as mesmas faces numéricas que o Ladino manteve na Furtividade, com repetições**. Não basta ter DE defensiva elevada ou acertar por símbolos sem encontrar a posição.

**Exemplo:** se o Ladino manteve **4 e 7**, o atacante precisa reproduzir **4 e 7**, não **4 e 4**. Encontrar essas faces não é dano automático: depois se resolve o ataque normalmente.

**PENDENTE:** confirmar se o atacante deve igualar as faces em todos os dados rolados ou somente nos mantidos, além da ordem de localização e acerto, duração da ocultação e exceções de rastreio.

**PROPOSTO, não adotado:** repetir uma ocultação na mesma sequência ao custo de 1 PP.

Exemplos documentados de Perícias (não necessariamente disponíveis no nível 1):

| Perícia | XP | Função |
|---|---:|---|
| Artes Marciais | 1 | Combinação desarmada com habilitação de Punhos; requisitos revisados ainda em teste |
| **Criar Item de Foco e Magia** | **1** | Disciplina 1 + Inteligência 1; Psíquico, magias Leves, fabricação com Artesão e recarga por Grau |
| **Escudo Arcano** | **1** | Inteligência 2 + Criar Item de Foco e Magia; proteção pessoal ou área circular 3×3 m, duração 1 rodada |
| **Conjuração Refinada** | **1** | Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2; especialização de alcance, metros e custo PENDENTES |
| **Perícia em Elemento Ar** | **1** | Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1; efeitos G1–G3 e recuperação de Fôlego (quantidade pendente), 1 PP ou 1 Coragem ao acertar |
| **Perícia em Elemento Água** | **1** | Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1; Congelar G1 sem dano, Perfurar G2 por crítico ou ativação, efeitos G3 |
| **Perícia em Elemento Terra** | **1** | Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1; Desvantagem e sentido sísmico G1–G3, enredar e espinhos G2, dano/empurrão/derrubada G3 |
| **Perícia em Elemento Fogo** | **1** | Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1; G1 disparo/conduzir chamas, G2 **Queimar E + P à Integridade** (4 × 4), G3 **Derreter: dano à Integridade + 1 Vida direta fixa** (8 × 8, fim do turno dos aliados) |
| Perito Conjurador | 2 | Fontes pertinentes adicionais |
| Improviso Mágico | 1 | Elemento disponível no ambiente |
| Mestre Elementalista | 5 | Segundo elemento criado conscientemente e +1A |
| Conjuração Elemental (elemento básico) | 1 cada | Elemento adicional |
| **Perícia em Elemento Sagrado** | **2** | **Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2**; 1E pode virar 1 Coragem para um participante uma vez por conjuração/turno, sem contar para DE/dano; G2/G3 por combinação |
| Magia de Sangue / de Trevas / de Veneno | 3 cada | Habilitação especial, sujeita a graus |
| Montar Animal | 2 | Montaria comum, requer Influência 2 |
| **Provocação Sofisticada** | **1** | Influência 2; efeito adicional pendente. Provocar é ação básica gratuita |
| Combinação geral de fontes | 2 | Habilita fontes pertinentes, respeitando a ação |
| **Recuperação Vigorosa** | **PENDENTE** | Vigor 3; acelera os últimos pontos da caixa intermediária em 1 dia por ponto |
| **Maestria em Arremesso de Armas** | **1** | Força 2, Destreza 2, Agilidade 1; arremesso até 24 m; ativação 1 PP ou 1 Coragem |

**A Prática Punhos foi retirada da lista atual.** **EXPERIMENTAL/PENDENTE:** Artes Marciais exige Disciplina 1, sem Armas 1 nem foco Punhos obrigatório; demais regras do treino desarmado ainda em playtest.

**Perícia de identificar fraquezas e imunidades [DEFINIDO em conceito / PENDENTE em regras]:** observar um inimigo pode permitir descobrir vulnerabilidades, resistências e imunidades. O nome final, o custo, os requisitos e o teste necessário ainda precisam de definição; não há identificação gratuita sem o procedimento apropriado.

A lista completa ainda será desenhada pelo autor. A ferramenta de criação expõe somente as capacidades documentadas e não cria poderes inéditos.

## X. Níveis, Marcos e XP

**PP = Pontos de Perícia.** PP máximos: **0** (níveis 1–4), **1** (níveis 5–9), **2** (níveis 10–19) e **3** (nível 20). O nível 5 concede automaticamente o Talento passivo **Perícia em Coragem**, que converte 2 Coragens em 1 PP uma vez por turno, até o teto da reserva. O Cavaleiro do Terror usa 2P próprios em vez disso, transferindo **exatamente 2P**, sem duplicação.

Disciplina possui **sete Graus de acesso**, com Grau 7 habilitando o primeiro d20 desde o nível 10 mediante compras e requisitos próprios. **PENDENTE DE REBALANCEAMENTO:** Maestria de Atributo mantém historicamente a exigência de 100 XP anteriores em Perícias e mais 100 XP de compra, incompatível com o novo ritmo de XP e com Perícias de 1–2 XP; este preço excepcional **não foi reduzido automaticamente**. Não é possível converter dois dados de Atributo em uma ação.

A nova referência **experimental** é de **260 XP acumulados no nível 20, incluindo 18 XP iniciais e até 242 de evolução**, contra 664 XP antes. O aumento de nível permanece manual e não concede XP automaticamente. Mais detalhes no [SRD v0.58](srd-continuidade-v0.58.md) e nas tabelas da [v0.56](srd-continuidade-v0.56.md). Alternativas de balanceamento pertencem ao [Guia do Narrador](../narrador.html#encontros).

### Materiais para públicos diferentes

Este documento concentra regras necessárias **aos jogadores**. Para a ficha jogável unificada, use o [Criador de personagem e ficha](../prototipo-ficha/); o antigo endereço `criador.html` encaminha para essa ferramenta. Procedimentos exclusivos de inimigos, gerenciamento de reservas do Narrador, preparação de conflitos e análises de balanceamento estão no [Guia do Narrador](../narrador.html). Regras históricas ou em teste são distinguidas das **DEFINIDAS**.

## XI. Referência de continuidade

O sistema ainda precisa finalizar o catálogo de armas, a geometria de magias, os valores de integridade, a interação avançada entre penalidades de distância, a resolução de retirada resistida de armas arremessadas, as condições de localização de Furtividade e as árvores completas de Perícias. As decisões de continuidade são mantidas em documento interno de desenvolvimento. O Livro histórico v0.5 foi preservado para comparação e não substitui decisões mais recentes.


---

## Atualização das Perícias — 12/11/2026

**Precedência:** as decisões autorais desta seção substituem entradas históricas incompatíveis sobre Espalhar Golpe, Maestria em Arremesso, Maestria em Manejo Duplo, Disparo Múltiplo, Armas de Fogo e Veneno. Não misturar tabelas antigas. Os IDs internos das Perícias renomeadas são mantidos para preservar fichas antigas.

### Ladino e Furtividade [DEFINIDO]

- **Perícia em Furtividade:** compra 1 XP; Furtividade 2 + Destreza 2 + Agilidade 1. Vantagem passiva +1A em testes que usam Furtividade, cumulativa com outras Vantagens (como Concentrado). Inimigos imunes a Furtividade não são afetados pela ocultação.
- **Furtividade Avançada:** compra 1 XP; Furtividade 2 + Perícia em Furtividade. Pode incluir mais um Atributo, Conhecimento ou Prática pertinente no teste com Furtividade, respeitando pilha, limites e pertinência da fonte.
- **Golpe Baixo:** compra 1 XP; Destreza 2 + Força 1 + Agilidade 1; custa 1 PP ou 1 Coragem ao acertar, aplica Desvantagem (−1A) por 1 rodada. Contra alvo de Inteligência grau 0, ignora Provocar e fixa o agressor até eliminação de um dos envolvidos; sem ações ou movimentos gratuitos.

### Ramo corpo a corpo [DEFINIDO / área PENDENTE]

- **Golpe Fulminante:** Disciplina 2 + Força 2 + especialização corpo a corpo (Leves/Médias/Pesadas, Manejo Duplo ou Pugilismo). Ao acertar, por 1 PP ou 1 Coragem, Pavor não anulado passa a causar 1 dano por P; crítico não dispensa ativação. Maestria/Perícia em Arremesso não satisfaz esse requisito.
- **Golpe Colossal:** substitui Espalhar Golpe (nome novo, mesmo ID de ficha). Compra 1 XP; Destreza 1 + Agilidade 1 + Disciplina 2 + Golpe Fulminante + especialização corpo a corpo. Cada 1 PP ou 1 Coragem permite atingir até 2 alvos adicionais dentro de 3 m, com a mesma rolagem contra DE individual e metade do dano dos Êxitos arredondada para baixo; custo consumido ainda que erre alvo adicional. Alvo principal recebe dano integral. Não fornece +1E. Não transmite dano de Pavor de Golpe Fulminante aos adicionais. **PENDENTE:** centro exato da área.
- **Perícia em Manejo Duplo:** compra 1 XP, Disciplina Avançada + Força 2 + Destreza 2 + Agilidade 1 e pelo menos uma das Perícias Leves, Médias, Pesadas, Arremesso, Armas de Fogo ou Armas de Longo Alcance. Permite equipar duas armas, rolar Armas + Armas + Atributo em um único golpe; dano básico não é duplicado. Crítico habilita UMA característica escolhida entre as armas da ação combinada gratuitamente; mediante mais 1 PP ou 1 Coragem pode habilitar outra. Acerto normal por 1 PP ou 1 Coragem habilita UMA característica escolhida.

### Ramo de longa distância, arremesso e técnicas somáticas [DEFINIDO / ressalvas]

- **Perícia em Armas de Longo Alcance:** 2 XP, Disciplina 1 + Destreza 2; crítico ativa efeitos da arma gratuitamente, acerto normal custa 1 PP ou 1 Coragem. Ignora Desvantagens naturais por peso, mantendo Vantagens. Tabela natural (leve/médio/pesado): arco curto −1A/+1A/neutro; arco longo 2 mãos −1A/neutro/+1A; besta pequena neutra em todos; besta de duas mãos −1A/neutro/+1A.
- **Arremesso é ação geral:** qualquer personagem pode arremessar armas, passar armas a aliados e lançar armas inimigas para longe. **Perícia em Arremesso de Armas** (antiga Maestria; ID salvo preservado) custa 1 XP, exige Força 2 + Destreza 2 + Agilidade 1 e Perícia em Armas Leves OU Médias OU Pesadas. Por 1 PP ou 1 Coragem no acerto, ativa os efeitos especiais da arma arremessada além do dano básico. Alcance efetivo leve 12 m, médio 8 m, pesado 4 m; exceder 1 m dá Desvantagem (−1A), 2 m Desvantagem Absoluta (−1E), 3 m Acerto de Sorte (−2E); além do terceiro metro, escalonamento PENDENTE. Não sofre Desvantagem por proximidade, mas aliados próximos do alvo geram Desvantagem. Arma se aloja no alvo com penalidade pertinente. Acerto limpo pode permitir nova jogada, avanço, retirada e ataque corpo a corpo; acerto com Pavor pode permitir ao inimigo utilizar a arma. Falha limpa: cai no caminho, pode gastar 1A para correr e recuperar; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Distância da queda em falha (metros) = E mantidos + P mantidos NÃO anulados + 1E por 2A convertidos; A restante não soma. Retirar arma alojada testa Armas + Força + Atletismo contra resistência Força + Vigor + Atletismo do alvo; conversão da dificuldade ainda PENDENTE.
- **Disparo Fulminante:** compra 1 XP; Destreza 2 + Força 1 + Disciplina 2 + (Longo Alcance OU Arremesso). Ao acertar, pagando 1 PP ou 1 Coragem, Pavor válido causa 1 dano por P no alvo principal; crítico não dispensa. NÃO aplica a armas de fogo.
- **Disparo Múltiplo:** compra 1 XP; Destreza 2 + Agilidade 2 + Disciplina 2 + Disparo Fulminante + (Longo Alcance OU Arremesso). Cada 1 PP ou 1 Coragem cobre até dois alvos adicionais num raio de 3 m ao redor do ALVO PRINCIPAL; rolagem única vs DE individual, custo pago mesmo se errar. Alvo principal dano integral; adicionais metade dos Êxitos arredondada para baixo e 0,5 por Pavor válido, mesmo se Fulminante estiver ativado no principal.
- **Disparo Violento:** compra 1 XP, Destreza 2 + Disciplina 2 + (Força 2 OU Força 1 + Atletismo 1) + (Longo Alcance OU Arremesso). 1 PP ou 1 Coragem no acerto derruba e empurra o inimigo 4 m. Arco longo ou besta de duas mãos; com Arremesso precisa arma MÉDIA ou PESADA. Crítico não dispensa.
- **Disparo Tático:** compatível com Arremesso, demais regras de compra/ativação PENDENTES.
- Técnicas somáticas independentes podem ser ativadas na mesma oportunidade pagando cada custo.

### Armas de Fogo [DEFINIDO / dependência PENDENTE]

- **Perícia em Armas de Fogo:** 3 XP, Disciplina 2 + Destreza 2; crítico ativa gratuitamente **outras características**, e acerto normal custa 1 PP ou 1 Coragem para essas ativações. **Perfurante da própria arma de fogo é passivo e não exige esse gasto.** Remove Desvantagem de peso natural. Valores naturais leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Os Graus existentes de arma de fogo permanecem.
- **Descarregar Tambor:** modalidade de Disparo Múltiplo exclusivamente com arma automática ou semiautomática, alvo ÚNICO, um teste, consome todas as munições disponíveis, custa **1 PP OU 1 Coragem por tiro**. Primeiro tiro dano integral de Êxitos; demais metade dos Êxitos cada (arredondar para baixo). Pavor NÃO causa dano. Um Pavor mantido e não anulado provoca travamento em arma sujeita; P anulado por A ou descartado não trava. O revólver não trava e não é automático. Disparo Fulminante não se aplica a armas de fogo. **PENDENTE:** exceção de acesso a Disparo Múltiplo para especialistas só em armas de fogo, pois seu requisito atual exige Fulminante/Longo Alcance/Arremesso.

### Veneno e Antídoto [DEFINIDO / evolução PENDENTE]

- **Criar Veneno:** compra 1 XP, Artesão 1 + Inteligência 2 + Alquimia 2 + Medicina 2. Preparação alquímica, NÃO concede conjuração. Cria doses não diluídas de materiais venenosos. Cada dose ingerida provoca 1 acúmulo. Máximo de UMA dose por arma; para aplicar com golpe, alvo deve estar em Sangramento, **mesmo que a armadura tenha absorvido o dano do ataque que aplicou o estado**. A possibilidade autoral de transmitir veneno por magia de Sangue depende de procedimento e habilitações ainda PENDENTES. Duas armas envenenadas com Manejo Duplo podem aplicar 2 acúmulos no mesmo ataque (um por arma, se ambos os efeitos forem ativados).
- **Envenenamento (alquímico e elemental):** cada acúmulo dura 2 rodadas individualmente e não é renovado por aplicação posterior. Usa **Vida ATUAL, nunca Vida máxima**. 2/3 da Vida atual em acúmulos ativa Ferido. Acúmulos iguais à Vida atual ativam Incapacitado. Se estiver envenenado com **exatamente 2 de Vida atual**, ou se houver **12 acúmulos ativos**, ativa Inconsciente. Graus 2 e 3 elementais exigem combinação. **Amplificar Veneno** fica PENDENTE para futura decisão, sem multiplicar doses por arma agora.
- **Criar Antídoto:** 1 XP; Artesão 1 + Inteligência 2 + Alquimia 2 + Medicina 2 + Criar Veneno. Produz antídoto de materiais venenosos coletados; uma dose não diluída remove 1 acúmulo, ingerida ou aplicada ao alvo em Sangramento. Duas doses removem dois acúmulos. Transfusão mantém regra própria sem aquisição definida.

---


> **Decisão autoral posterior — 12/11/2026 [DEFINIDO]:** qualquer requisito Armas 1 é substituído por Disciplina 1, sem Perícia intermediária. Armas 1 e Combate não estão disponíveis para novas compras. IDs e custos antigos permanecem em fichas anteriores para compatibilidade, sem reembolso automático.
