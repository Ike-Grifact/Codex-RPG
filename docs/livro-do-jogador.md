# Codex RPG — Livro do Jogador
## Edição de leitura do portal · v0.6 (10 de novembro de 2026)

> **Documento em desenvolvimento.** A continuidade normativa está consolidada no [SRD de Continuidade v0.27](srd-continuidade-v0.27.md). Este livro apresenta as regras de modo didático e diferencia regras definidas, hipóteses de playtest e pontos pendentes. O histórico anterior foi preservado em [arquivo/v0.5](arquivo/livro-do-jogador-v0.5-legado.md).

### Estado das regras
**DEFINIDO** — confirmado pelo autor. **EXPERIMENTAL** — números para playtest. **PROPOSTO** — alternativa não aprovada. **PENDENTE** — procedimento incompleto.

## I. O que é Codex RPG?

Codex RPG é um sistema independente de fantasia, narrativa emergente e combate tático. Cada jogador começa como **Aprendiz**. Sua profissão resulta da combinação de **Atributos, Conhecimentos, Práticas, Perícias, equipamentos e técnicas** — não é necessário escolher uma classe obrigatória. Diferentes ramos de desenvolvimento podem cruzar-se e abrir novos caminhos, mesmo sem comprar todas as capacidades anteriores de um caminho.

### Três símbolos

| Símbolo | Runa | Cor | Significado |
|---|---|---|---|
| Êxito (E) | Sowilo **ᛋ** | **#267A45** | Execução, domínio e dano |
| Antecipar (A) | Ansuz **ᚨ** | **#2369BB** | Adaptação, coordenação e controle de Pavor |
| Pavor (P) | Thurisaz **ᚦ** | **#542176** | Tensão, risco e oportunidade de intervenção |

Um resultado pode alcançar o objetivo e ainda deixar Pavor para o adversário.

## II. Criar o Aprendiz

Todos têm seis Atributos: **Força, Agilidade, Destreza, Inteligência, Influência e Vigor**.

| Grau | Dados de Atributo | XP acumulado | Dados de Conhecimento/Prática | XP acumulado |
|---:|---|---:|---|---:|
| 0 | 1d4 | 0 | **1d6** | 0 |
| 1 | 1d6 | 1 | 1d10 | 2 |
| 2 | 2d6 | 3 | 2d10 | 8 |
| 3 | 3d6 | 7 | 3d10 | 20 |
| 4 | 2d6 + 1d10 | 15 | 2d10 + 1d12 | 38 |
| 5 | 1d6 + 2d10 | 31 | 1d10 + 2d12 | 66 |
| 6 | 3d10 | 55 | 3d12 | 102 |

**Conhecimentos DEFINIDOS:** Proteção, Astronomia, Medicina, Alquimia, Engenharia, Erudição.

**Práticas DEFINIDAS (6):** **Armas ou Conjuração** (Prática compartilhada), Atletismo, Furtividade, Artesão, Apresentação e Coleta.

**Armas ou Conjuração é UMA ÚNICA Prática**, com uma única graduação, pilha e compra de XP de Formação. Seus dados servem a combate ou magia segundo as **Perícias habilitadoras**. É possível ter as duas famílias de Perícias no mesmo personagem sem duplicar o grau comprado, a fonte nem seu 1d6 gratuito. **Exemplo:** grau 1 da Prática compartilhada custa **2 XP de Formação** e fornece **1d10**; obter uma Perícia de Conjuração não exige pagar outros 2 XP para criar outra Prática. Os custos específicos das **Perícias** (inclusive Aprendiz de Conjurador) continuam próprios. Punhos é especialização marcial, não outra Prática.

**Fichas antigas:** os valores anteriormente separados como Armas e Conjuração são conciliados provisoriamente pelo maior grau, com anotação histórica dos valores antigos; não se somam os dados nem os custos.

**DEFINIDO:** o grau 0 de **cada Conhecimento e Prática pertinente** oferece **seu próprio 1d6 gratuito** (um dado por fonte), equivalente ao 1d4 gratuito por Atributo. O primeiro treinamento troca esse d6 por 1d10, não acrescenta outro dado gratuito. Armas na especialização de Punhos continua exigindo habilitação específica.

O XP adquirido após a criação é livre: pode ser investido em qualquer fonte ou Perícia cujo requisito seja atendido. Grau 6 alcançado cedo **não amplia** automaticamente a quantidade de dados mantidos.

**EXPERIMENTAL — orçamento de criação no nível 1:** **6 XP em Atributos + 8 XP em Formação + 5 XP em Perícias = 19 XP**. Esta distribuição de playtest substitui a hipótese 7/7/5, sem mudar a curva de custos por Grau; o total de 19 XP permanece experimental, não oficial. O XP conquistado após a criação continua livre. Com 8 XP de Formação pode-se alcançar o Grau 2 de uma fonte (2d10), enquanto o Grau 3 de um Atributo (7 XP) não cabe nos 6 XP iniciais desta categoria.

**Vida máxima:** 3 + Vigor + piso(Força/2).

**DE (Dificuldade de Êxito) defensiva natural:** **Agilidade + (Destreza ÷ 2, arredondada para baixo)**. Exemplo: Agilidade **4**, Destreza **3** → metade de Destreza é 1,5, arredondada para baixo fica **1** → **DE = 4 + 1 = 5**. A metade é arredondada antes de somar Agilidade.

**Coragem:** começa com 10 e possui teto normal 10. **PP (Pontos de Perícia):** 0 nos níveis 1–4. O primeiro PP e a Perícia em Coragem são obtidos no nível 5.

**Balanço corporal:** Agilidade maior que Vigor → leve; valores iguais → médio; Vigor maior que Agilidade → pesado. Equipamentos podem alterar o peso efetivo conforme carga e requisitos.

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

Gastar Coragem para manter mais um dado **não cria um novo dado na pilha**. Gastar 1 Coragem para elevar um passo permitido de um dado antes da rolagem segue d4→d6→d10→d12, em suas condições normais.

### Faces de referência — d4, d6, d10 e d12 DEFINIDOS; d20 reforçado G DEFINIDO

A numeração da face **não se soma à Dificuldade de Êxito (DE)**: identifica a quantidade de símbolos. Esta tabela inclui a distribuição **d20 reforçado G consolidada pelo autor em 9/11/2026**, substituindo o protótipo experimental anterior.

**Runas e identidade cromática:** **ᛋ Êxito (E)** — verde `#267A45`; **ᚨ Antecipar (A)** — azul `#2369BB`; **ᚦ Pavor (P)** — roxo `#542176`. ○ é uma face vazia; — indica face inexistente naquele dado.

| Face | d4 | d6 | d10 | d12 | d20 |
|---:|---|---|---|---|---|
| 1 | ○ | ○ | ○ | ○ | ○ |
| 2 | ○ | ○ | ○ | ○ | ○ |
| 3 | ᚦ | ᚦ | ᚦ | ᚦ | ᚦ |
| 4 | ᚨ+ᚦ | ᚦ | ᚦ | ᚦ | ᚦ |
| 5 | — | ᚨ+ᚦ | ᚨ+ᚦ | ᚨ+ᚦ | ᚨ+ᚦ |
| 6 | — | ᛋ | ᛋ | ᛋ | ᛋ |
| 7 | — | — | 2ᛋ | 2ᛋ | 2ᛋ+ᚨ |
| 8 | — | — | ᛋ+ᚨ | ᛋ+ᚨ | 2ᛋ+ᚨ |
| 9 | — | — | ᛋ+ᚨ+ᚦ | ᛋ+ᚨ+ᚦ | 2ᛋ+ᚨ+ᚦ |
| 10 | — | — | 2ᛋ+ᚦ | 2ᛋ+ᚦ | 2ᛋ+2ᚨ+ᚦ |
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

A face 16 do d20 contém **4ᚦ** (quatro símbolos de Pavor). As faces 1 e 2 são vazias. O **d20 é extraordinário** e exige fonte Grau 7, XP e habilitações; acesso a partir do nível 10 nas condições definidas e possível segundo dado em nível 20 por Maestria. O máximo normal por ação é de dois d20 na pilha, mesmo com outras fontes. **DE 30** permanece o teto absoluto definido.


## IV. Resolver ações

1. Declare o objetivo e escolha as fontes de Atributo, Conhecimento ou Prática pertinentes.
2. Estabeleça a DE adequada ao alvo ou tarefa. A DE natural defensiva não é substituída por uma dificuldade inventada se houver ficha.
3. Role a pilha permitida e escolha os dados mantidos.
4. Conte Êxitos (E), Antecipar (A) e Pavor (P) **somente dos dados mantidos**.
5. Gaste Antecipar:
   - **1A anula 1P próprio**;
   - **1A passa a oportunidade a aliado**, preservando Pavor não anulado;
   - **2A convertem-se em 1E**;
   - outras aplicações específicas requerem Perícias.
6. Compare **E + P mantido não anulado** à DE. Decida o resultado e calcule dano e consequências quando aplicável.

Não se pode gastar o mesmo A duas vezes. A transferência de oportunidade por A não equivale a anular P.

### Crítico [DEFINIDO quanto à revisão documentada; bônus antigo PENDENTE]

Conforme a **última revisão específica documentada no SRD (v0.20, seção 0-D.2)**, ocorre um **crítico quando todos os dados efetivamente mantidos**, no mínimo dois e incluindo pelo menos um dado de Atributo, mostram **suas próprias faces numéricas máximas**. Nessa situação, **todos os símbolos dessas faces mantidas se convertem em Êxitos, um por símbolo**. Dados descartados não contam.

**Exemplo:** manter um d4 na face 4 e um d10 na face 10 satisfaz o gatilho (4 e 10 são os máximos de seus respectivos dados). Os símbolos dessas faces convertidos em Êxitos constituem o efeito crítico; a numeração das faces não é somada à DE. Efeitos especiais de uma arma ainda exigem **acertar a DE**, mesmo quando houve crítico.

**Divergência histórica:** uma regra mais antiga exigia apenas **dois dados mantidos em suas faces máximas** e concedia **+1E e recuperação de 1 Coragem**. A revisão posterior passou a exigir **todos os mantidos máximos**, com conversão de símbolos, e deixou a acumulação do bônus antigo **PENDENTE**. Não aplicar os dois modelos ao mesmo tempo sem nova decisão do autor.

### Resultados e protagonismo

- **Acerto puro:** alcança DE sem Pavor residual. **Mantém o protagonismo:** o mesmo jogador pode agir novamente ou passar voluntariamente a oportunidade a um aliado, sem limitar a continuidade a apenas dois ataques.
- **Acerto normal:** alcança DE com Pavor não anulado sem predominância de P sobre E.
- **Acerto com Pavor predominante:** alcança DE com P>E, podendo introduzir consequências graves.
- **Falha limpa:** não alcança DE e não tem consequência negativa automática.
- **Falha com Pavor:** não alcança DE e deixa risco, intervenção e normalmente perda de 1 Coragem; a intensidade da complicação depende da situação.

Enquanto não houver Pavor não anulado, jogadores preservam o fluxo entre si. Inimigos gastam Pavor local para ativar ataques ou capacidades em suas oportunidades; a reserva pública do Narrador começa em 2P e tem limite 2 + número de jogadores.

## V. Defesa, Vantagem e peso

**DE = Dificuldade de Êxito.** O tipo de ataque e o balanço do alvo produzem condições de Vantagem ou Desvantagem, conforme a situação.

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

### Afinidade entre peso do ataque e balanço do alvo

| Ataque / Alvo | Leve | Médio | Pesado |
|---|---|---|---|
| **Leve** | Normal | Vantagem | Desvantagem |
| **Médio** | Vantagem | Desvantagem | Normal |
| **Pesado** | Desvantagem | Normal | Vantagem |

O peso efetivo de cada ataque depende das **armas, Perícias e abordagem**. Um personagem não escolhe estilo obrigatório na criação. O balanço natural deriva de Agilidade e Vigor, com alterações pertinentes de equipamentos e circunstâncias.

### Criatividade em combate e fora dele

**No conflito**, um ataque leve pode explorar passagem estreita, um ataque pesado pode tentar deslocar um obstáculo, e o grupo pode combinar Força + Atletismo, Inteligência + Engenharia ou outros recursos pertinentes para atingir o objetivo. Uma terceira fonte depende da Perícia habilitadora.

**Fora do conflito**, a mesma lógica permite construir proteções, investigar ruínas, negociar, atravessar terreno, improvisar ferramentas ou resgatar um aliado. **Nenhum exemplo concede bônus automático**; o Narrador avalia a Dificuldade de Êxito, a posição, as fontes e as consequências. O peso pode ser uma vantagem real para um objetivo e um inconveniente para outro.

Até **três participantes** podem coordenar um ataque conjunto; a DE defensiva conjunta respeita o teto 30. **EXPERIMENTAL:** referências iniciais de DE 1–2 comum, 3 treinado e 4 excepcional para Aprendizes, sem substituir a defesa calculada na ficha.


## VI. Dano, armadura e Vida

**Dano básico após alcançar a Dificuldade de Êxito:** total de **Êxitos válidos + piso(Pavor mantido não anulado ÷ 2)**, salvo efeitos específicos. Cada **par completo de Pavor** acrescenta 1 ao dano básico; os símbolos residuais ainda podem gerar intervenção. Esta redação substitui a abreviação ambígua `P/2` sem mudar a matemática.

**DEFINIDO:** uma Perícia pertinente pode conceder no máximo +1E, respeitando o teto de **+2E de Perícias por ação**. Esse Êxito vale para a DE e para dano, salvo efeito explicitamente exclusivo de dano.

Armadura equipada possui **integridade**, que absorve primeiro o dano; excedentes podem alcançar Vida. **Ataques que falham não desgastam integridade.** Perfuração especial habilitada ignora integridade ao acertar a DE. O golpe não colossal causa até **3 Vida**; limiares precisos seguem PENDENTES. Golpe colossal exige dano efetivo após proteção de ao menos **3 × Vida máxima** em um único ataque.


### Caixas de Vida, penalidades e Coragem [DEFINIDO]

A Vida máxima é dividida em **Saudável / Machucado / Incapacitado**. Divida a Vida máxima por 3, atribua a quantidade inteira a cada caixa e coloque **todos os pontos restantes na caixa Saudável**. Exemplo: **7 Vida → 3 / 2 / 2**; **11 Vida → 5 / 3 / 3**.

| Estado da Saúde | Penalidade | Coragem para agir |
|---|---|---|
| **Saudável (3/3)** | Nenhuma | Sem custo adicional de Saúde |
| **Machucado (2/3)** | **−1A** | Pode pagar **1 Coragem** para ignorar a penalidade nessa ação |
| **Incapacitado (1/3)** | **−2E e −1A** | **1 Coragem para agir** com penalidade; **2 Coragens no total** para agir e ignorar as penalidades dessa ação |
| **Morto (0 Vida)** | Não pode agir | Não se aplica |

As penalidades de cada caixa **substituem** as da caixa anterior, sem somar penalidades de duas caixas. Gastar Coragem para ignorar a penalidade não cura Vida, não anula Pavor e não isenta de outros custos de Perícias.

### Recuperação natural de Vida [DEFINIDO]

| Caixa em recuperação | Tempo por ponto de Vida |
|---|---|
| **Saudável (3/3)** | **1 dia** |
| **Machucado (2/3)** | **1 semana** |
| **Incapacitado (1/3)** | **Tratamento médico obrigatório** e depois **1 semana** |

O prazo vale para **cada ponto recuperado**, não para a caixa inteira. As condições de repouso, interrupção e duração do tratamento seguem **PENDENTES**.

### Perícia Recuperação Vigorosa [DEFINIDO]

**Requisito: Vigor 3. Compra: 1 XP.** Para cada **3 graus completos de Vigor**, o personagem acelera a recuperação de **um dos últimos pontos da caixa Machucado**: passa de **1 semana para 1 dia por ponto**, até o limite de pontos dessa caixa. Não acelera a caixa Incapacitado nem remove a necessidade de tratamento médico.

**Exemplo com 6 Vida:** Vigor 3, Força 0 → caixas **2 / 2 / 2**. Se a ficha está em **0 / 1 / 2**, a Perícia permite passar a **0 / 2 / 2 em 1 dia**.

**Exemplo com 12 Vida, caixas 4 / 4 / 4, e Vigor 6:** dois últimos pontos intermediários recebem o benefício: **0 / 1 / 4 → 0 / 2 / 4** ainda demora **1 semana**, depois **0 / 2 / 4 → 0 / 3 / 4** leva **1 dia** e **0 / 3 / 4 → 0 / 4 / 4** leva **1 dia**.

### Proteções por Grau [DEFINIDO quanto ao acesso e propriedades]

| Grau da armadura | Efeitos permitidos | Acesso |
|---|---|---|
| **1** | Somente integridade; nenhuma resistência ou imunidade automática | Inicial, conforme requisitos da peça |
| **2** | Primeira resistência, apenas se a armadura puder recebê-la | **Equipar somente a partir do nível 5** |
| **3** | Segunda resistência, se o modelo comportar | Nível e requisitos específicos pendentes |
| **4** | Imunidade específica, quando habilitada | Nível e requisitos específicos pendentes |

Categorias existentes: **Muito Leve, Leve, Média, Pesada e Extrema**. Categoria e Grau são coisas distintas. Uma armadura Média ou Pesada no Grau 1 **não começa com resistência**; a evolução depende do seu Grau e do tipo de peça. Imunidade não é universal.

**EXPERIMENTAL:** os valores numéricos de integridade por categoria/qualidade, bônus de DE e requisitos por peça seguem em teste. Não importar como oficiais os números históricos das tabelas v0.22.

**Capacidade de carga (unidades Alto):** 1 + piso(Força/3) + piso(Vigor/3) + piso(Armas/3) + piso(Atletismo/3), conforme as fontes de grau válidas. Pontos de composição dos dados não equivalem automaticamente a peso real de equipamento.


## VII. Conjuração, elementos e possibilidades

O Aprendiz de Conjurador começa com o elemento **Psíquico**. Fogo, Água, Raio, Vento, Terra e elementos especiais dependem das habilitações próprias.

**Combinação de até dois elementos:** a ordem define o **principal** e o **secundário**. Incluir o segundo elemento conscientemente com a Perícia adequada gasta **1A**, não reutilizável. A mistura por si só **não soma dados nem Êxitos**, e efeitos avançados exigem os Pontos de Perícia (PP) e as Especialidades pertinentes.

### Elementos individuais e seus efeitos [DEFINIDO conceitualmente / detalhes PENDENTES]

Os elementos **têm utilidades próprias** e não dependem de estarem combinados. A tabela organiza os efeitos por **peso/Grau do efeito** na referência de continuidade; um personagem não ganha efeitos pesados só por conhecer o elemento. Toda aplicação exige fonte, habilitação pertinente e sucesso na **Dificuldade de Êxito**; custos de Pontos de Perícia, distância, área e efeitos avançados ainda dependem dos requisitos.

| Elemento | Leve / Grau 1 | Médio / Grau 2 | Pesado / Grau 3 |
|---|---|---|---|
| **Água** | Congelar e imobilizar por 1 rodada com Desvantagem, sem dano automático | Perfuração no crítico habilitado | Empurrar e causar dano; mantém condições menores pertinentes |
| **Fogo** | Disparar à distância sem queimadura direta à Vida | Área reduzida e proximidade histórica de 8 m | Dano à integridade e Vida em cone, linha ou área, podendo afetar aliados |
| **Terra** | Desvantagem por 2 rodadas | Enredar, imobilizar e espinhos que desgastam proteção | Dano, empurrar e derrubar |
| **Ar / Vento** | Mover mais rápido, puxar/empurrar objetos | Sufocar, deslocar e derrubar | Grande área, vários alvos e possíveis danos de queda |
| **Raio** | Pendente | Pendente | Pendente |

**Elementos especiais:**

- **Psíquico / Psique:** elemento inicial de natureza neutra; técnicas específicas podem neutralizar a natureza de um efeito e contornar certas imunidades.
- **Sagrado:** apoiar, acalmar, purificar, recuperar Coragem. A especialização documentada permite converter um **Êxito em 1 Coragem** para si ou aliado, até uma conversão por conjuração/turno; o E gasto não conta para a DE nem para dano.
- **Trevas:** escuridão, maldições e Pavor; técnica habilitada pode acrescentar **2 Pavor em uma rolagem**, com até dois alvos distintos sob condições ainda detalhadas no catálogo.
- **Sangue:** manipular sangue/efeitos ligados à Vida; especialização custa **1 Vida do conjurador**, mesmo em falha, e acrescenta **1 Pavor**; um acerto pode retirar **1 Vida** de alvo com sangue, contornando integridade.
- **Veneno:** inflige penalidades de Saúde por turnos do alvo em até dois acúmulos, **não provoca dano automático à Vida**.
- **Raio:** habilitado como elemento básico, mas sem progressão autoral de efeitos individuais por Grau concluída. Não inventar atordoamento automático.

**Peso elemental e físico:** Sagrado e Veneno são leves na referência; Psíquico é médio; Sangue e Trevas são pesados; elementos naturais variam conforme a forma da magia e seus dados. Isso não é a mesma coisa que carga no inventário ou afinidade automática de arma.

### Exemplos de combinação criativa em diferentes cenas

| Elementos | Durante um conflito | Fora do conflito |
|---|---|---|
| Fogo + Ar | Calor, fumaça ou área perigosa quando habilitada | Forja, ventilação, sinalização |
| Água + Terra | Lama, cobertura, alterar o caminho | Irrigação, moldagem de barro, travessia |
| Água + Ar | Névoa como elemento de ocultação situacional | Refrescar, dispersar vapor |
| Fogo + Terra | Trabalhar obstáculos e materiais | Cerâmica, forja, transformação |
| Raio + Água | Explorar condução, quando houver meio apropriado | Investigar mecanismos e fenômenos |

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
| **Cortante** | Abrir Sangramento | É uma abertura, **não** dano automático a cada turno |
| **Perfurante** | Técnica habilitada ignora integridade e atinge Vida | Exige acerto, até 3 Vida em golpe não colossal |
| **Pesada** | Derrubar, com manobra ou crítico apropriado | Não derruba em toda rolagem |
| **Longa** | Criar espaço, afastar ou desengajar com Antecipar especial | Custo e procedimento da técnica dependem de habilitação |
| **Dupla empunhadura** | Combinar armas com Atributo, com Perícia | Não ganha Vantagem absoluta gratuitamente; dificulta uso de escudo |

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

### Perícia Arremesso de Armas Leves [DEFINIDO / detalhes PENDENTES]

**Compra: 1 XP. Requisitos: Força 2, Destreza 2 e Agilidade 1. Ativação: 1 Ponto de Perícia (PP) ou 2 Coragens.**

Permite arremessar uma **arma leve**, causar dano e aplicar seus efeitos pertinentes. **Alcance normal de 24 m**: até **24 m**, normal; acima de 24 m e abaixo de **32 m**, Desvantagem (−1A); de **32 m** até abaixo de **40 m**, Desvantagem absoluta (−1E); a partir de **40 m**, Acerto de Sorte (−2E). A técnica **não sofre Desvantagem por estar muito perto**, mas continua sujeita à presença de aliados próximos do alvo (**até 1 m**).

- **Acerto sem Pavor:** a arma fica alojada no inimigo, e o jogador pode aproveitar a continuidade do protagonismo para avançar, **retirar normalmente a arma sem teste** e realizar novo ataque corpo a corpo, ou passar a oportunidade a um aliado. A Perícia não concede uma ação extra separada: acerto sem Pavor já permite continuar agindo.
- **Acerto com Pavor:** a arma fica alojada; o adversário pode tentar tomá-la e utilizá-la quando obtiver oportunidade pertinente, sem ganhar turno automático apenas pela existência da arma.
- **Falha sem Pavor:** a arma cai no caminho; **1A** permite correr até ela e recuperá-la.
- **Falha com Pavor predominante (P > E):** a arma cai perto do alvo ou pode atingir um aliado a **até 1 m do inimigo**. Se o resultado **não alcançou a DE do inimigo, mas alcança a DE do aliado**, atinge o aliado; caso contrário, cai perto deles.
- **Retirada resistida quando exigida:** teste **Armas + Força + Atletismo** contra dificuldade baseada em **Força + Vigor + Atletismo do inimigo**, considerando seus dados comprados. A forma exata de converter esses dados em uma DE numérica permanece **PENDENTE**.

**PENDENTE:** efeitos precisos por tipo de arma alojada, procedimento para vários aliados próximos, distância extrema e resolução detalhada da retirada resistida. Essas Perícias não são restritas à criação de nível 1; seus requisitos podem exigir evolução.

### Armas de fogo — catálogo histórico em revisão

Armas de fogo dependem de **munição por calibre, carregador, disparos consumidos, recarga, alcance e recuo**. Armas suscetíveis a travamento podem travar com **Pavor predominante**, e não qualquer Pavor; limpar travamento exige Engenharia pertinente sem usar dados da própria arma. **Revólver não trava.**

| Arma | Grau indicado historicamente | Características em desenvolvimento |
|---|---|---|
| Revólver | G2 | Não trava; Perícia básica histórica 3 XP |
| Pistola | G3 | Carregador e travamento; Perícia básica 5 XP |
| Metralhadora | G3 | Vários disparos/munição; alcance histórico 16 m; Perícia básica 5 XP |
| Doze / escopeta | G3 | Cone, derrubada, não perfurante; básica histórica 5 XP |
| Rifle | G4 | Avançada pode derrubar ou atravessar dois alvos alinhados; básica histórica 6 XP |
| Lança-granadas | G5 histórico | Área, recuo, risco de ferir aliados; Perícia básica histórica 10 XP |

**PENDENTE:** preços finais, composições, dano, alcance e procedimentos de recarga. **A referência antiga de 3d20 do lança-granadas é incompatível com o limite atual de até dois d20 por ação de jogador comum**, devendo ser refeita. Não usar o catálogo histórico como lista de compras definitiva.

## IX. Perícias e profissões emergentes

Perícias têm preços e requisitos específicos; numerosas opções baratas podem se combinar em árvores abertas. Um ramo pode se conectar a outro sem exigir comprar toda uma sequência de uma “classe” tradicional.

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
| Combate | 1 | +1A em combate pertinente |
| Armas 1 | 2 | Habilitação e primeira especialização de arma |
| Artes Marciais | 1 | Combinação desarmada com habilitação de Punhos; requisitos revisados ainda em teste |
| Aprendiz de Conjurador | 2 | Conjuração grau 1 |
| Magia Única | 1 | Uma magia inicial |
| Perito Conjurador | 2 | Fontes pertinentes adicionais |
| Improviso Mágico | 1 | Elemento disponível no ambiente |
| Mestre Elementalista | 5 | Segundo elemento criado conscientemente e +1A |
| Conjuração Elemental (elemento básico) | 1 cada | Elemento adicional |
| Magia Sagrada / de Sangue / de Trevas / de Veneno | 3 cada | Habilitação especial, sujeita a graus |
| Montar Animal | 2 | Montaria comum, requer Influência 2 |
| Combinação geral de fontes | 2 | Habilita fontes pertinentes, respeitando a ação |
| **Recuperação Vigorosa** | **1** | Vigor 3; acelera os últimos pontos da caixa intermediária em 1 dia por ponto |
| **Arremesso de Armas Leves** | **1** | Força 2, Destreza 2, Agilidade 1; arremesso até 24 m; ativação 1 PP ou 2 Coragens |

**A Prática Punhos foi retirada da lista atual.** Punhos permanece como especialização habilitada por Armas 1. **EXPERIMENTAL/PENDENTE:** para preservar um teste funcional, o criador exige Armas 1 com foco Punhos e Prática Armas grau 1 como requisitos de Artes Marciais. Essa equivalência e os custos do treino desarmado precisam de confirmação; não se trata de nova regra aprovada.

**Perícia de identificar fraquezas e imunidades [DEFINIDO em conceito / PENDENTE em regras]:** observar um inimigo pode permitir descobrir vulnerabilidades, resistências e imunidades. O nome final, o custo, os requisitos e o teste necessário ainda precisam de definição; não há identificação gratuita sem o procedimento apropriado.

A lista completa ainda será desenhada pelo autor. A ferramenta de criação expõe somente as capacidades documentadas e não cria poderes inéditos.

## X. Níveis, Marcos e XP

**PP = Pontos de Perícia.** PP máximos: **0** (níveis 1–4), **1** (níveis 5–9), **2** (níveis 10–19) e **3** (nível 20). O nível 5 concede automaticamente o Talento passivo **Perícia em Coragem**, que converte 2 Coragens em 1 PP uma vez por turno, até o teto da reserva. O Cavaleiro do Terror usa 2P próprios em vez disso, transferindo **exatamente 2P**, sem duplicação.

Armas e Conjuração possuem **sete Graus de acesso**, com Grau 7 habilitando o primeiro d20 desde o nível 10 mediante compras e requisitos. No nível 20, uma Maestria de Atributo pode fornecer segundo d20 por 2 PP; exige ao menos um Atributo-chave no grau 6, 100 XP anteriores em Perícias e mais 100 XP para adquirir a própria Maestria. Não é possível converter dois dados de Atributo em uma ação.

A curva de **664 XP acumulados no nível 20 é EXPERIMENTAL**, assim como a alternativa de 600. O orçamento final aguarda os custos do catálogo completo de Perícias e a composição do Grau 7.

## XI. Referência de continuidade

O sistema ainda precisa finalizar o catálogo de armas, a geometria de magias, os valores de integridade, a interação avançada entre penalidades de distância, a resolução de retirada resistida de armas arremessadas, as condições de localização de Furtividade e as árvores completas de Perícias. As decisões de continuidade são mantidas em documento interno de desenvolvimento. O Livro histórico v0.5 foi preservado para comparação e não substitui decisões mais recentes.
