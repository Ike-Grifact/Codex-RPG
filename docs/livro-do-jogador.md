# Codex RPG — Livro do Jogador
## Edição de leitura do portal · v0.1 (9 de novembro de 2026)

> **Documento em desenvolvimento.** A versão normativa de referência é o [SRD de Continuidade v0.22](srd-continuidade-v0.22.md), sobretudo a seção 0-F. Este livro apresenta as regras de modo didático e não consolida valores de playtest. O histórico anterior foi preservado em [arquivo/v0.5](arquivo/livro-do-jogador-v0.5-legado.md).

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
| 0 | 1d4 | 0 | 1d4 | 0 |
| 1 | 1d6 | 1 | 1d10 | 2 |
| 2 | 2d6 | 3 | 2d10 | 8 |
| 3 | 3d6 | 7 | 3d10 | 20 |
| 4 | 2d6 + 1d10 | 15 | 2d10 + 1d12 | 38 |
| 5 | 1d6 + 2d10 | 31 | 1d10 + 2d12 | 66 |
| 6 | 3d10 | 55 | 3d12 | 102 |

**Conhecimentos de referência:** Ciências, Biologia, Engenharia, Erudição, Geografia, Medicina.

**Práticas de referência:** Atletismo, Furtividade, Infiltração, Manufaturas, Mineração, Herborismo, Expressão, Comércio, Sobrevivência. Punhos exige habilitação própria.

O XP adquirido após a criação é livre: pode ser investido em qualquer fonte ou Perícia cujo requisito seja atendido. Grau 6 alcançado cedo **não amplia** automaticamente a quantidade de dados mantidos.

**EXPERIMENTAL — orçamento de criação:** 7 XP em Base (Atributos) + 7 XP em Formação + 5 XP iniciais destinados a Perícias = **19 XP**. O gasto de 5 XP iniciais em Perícias já havia sido decidido, mas sua relação final com os 14 XP históricos ainda precisa ser confirmada. O criador de nível 1 implementa explicitamente **essa hipótese**, sem apresentá-la como oficial.

**Vida máxima:** 3 + Vigor + piso(Força/2).

**DE natural:** Agilidade + piso(Destreza/2).

**Coragem:** começa com 10 e possui teto normal 10. **PP:** 0 nos níveis 1–4.

**Balanço corporal:** Agilidade maior que Vigor → leve; valores iguais → médio; Vigor maior que Agilidade → pesado. Equipamentos podem alterar o peso efetivo conforme carga e requisitos.

## III. Rolar dados e mantê-los

O Codex usa *roll and keep*: reúna uma pilha de dados de fontes pertinentes, role e mantenha apenas os resultados escolhidos. **No máximo nove dados rolados** e **no máximo quatro dados mantidos por ação**; ao menos um dado mantido deve ser de Atributo. Dados descartados **não produzem qualquer efeito**, nem Pavor.

| Níveis | Dados mantidos naturalmente | Com gasto de 1 Coragem |
|---|---:|---:|
| 1–5 | 2 | 3 |
| 6–20 | 3 | 4 |

Gastar Coragem para manter mais um dado **não cria um novo dado na pilha**. Também é possível gastar 1 Coragem para elevar um passo de um dado apropriado **antes** da rolagem: d4→d6→d10→d12, normalmente uma elevação por rodada, com exceções habilitadas.

A elevação de passo permite que personagens tentem tarefas fora da especialização: um guerreiro pouco treinado em estudo pode elevar seu d4 de Inteligência e arriscar uma tarefa que não domina.

### Faces dos dados comuns — DEFINIDO

| Face | d4 | d6 | d10 | d12 |
|---:|---|---|---|---|
| 1–2 | Vazio | Vazio | Vazio | Vazio |
| 3 | P | P | P | P |
| 4 | A+P | P | P | P |
| 5 | — | A+P | A+P | A+P |
| 6 | — | E | E | E |
| 7 | — | — | 2E | 2E |
| 8 | — | — | E+A | E+A |
| 9 | — | — | E+A+P | E+A+P |
| 10 | — | — | 2E+P | 2E+P |
| 11 | — | — | — | E+2A+P |
| 12 | — | — | — | 2P |

O **d20 reforçado G** permanece **EXPERIMENTAL** no SRD. No nível 1 ele não faz parte das rolagens comuns.

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

### Resultados e protagonismo

- **Acerto puro:** alcança DE sem Pavor residual.
- **Acerto normal:** alcança DE com Pavor não anulado sem predominância de P sobre E.
- **Acerto com Pavor predominante:** alcança DE com P>E, podendo introduzir consequências graves.
- **Falha limpa:** não alcança DE e não tem consequência negativa automática.
- **Falha com Pavor:** não alcança DE e deixa risco, intervenção e normalmente perda de 1 Coragem; a intensidade da complicação depende da situação.

Enquanto não houver Pavor não anulado, jogadores preservam o fluxo entre si. Inimigos gastam Pavor local para ativar ataques ou capacidades em suas oportunidades; a reserva pública do Narrador começa em 2P e tem limite 2 + número de jogadores.

## V. Defesa e afinidade de peso

O tipo de ataque e a categoria do alvo produzem **Vantagem ou Desvantagem**:

| Ataque \ Alvo | Leve | Médio | Pesado |
|---|---|---|---|
| **Leve** | Normal | Vantagem | Desvantagem |
| **Médio** | Vantagem | Desvantagem | Normal |
| **Pesado** | Desvantagem | Normal | Vantagem |

**Vantagem = +1A**; **Desvantagem = −1A**; **Vantagem absoluta = +1E**; **Desvantagem absoluta = −1E**; **Ação de Sorte = −2E**. Estado situacional e afinidade de arma/peso são origens diferentes, que podem interagir. **Não confundir Vantagem com +1E**.

O alvo de DE alta pode superar a capacidade de um Aprendiz isolado. A coordenação de até **três participantes por ataque conjunto** é uma maneira legítima de enfrentar oponentes muito ágeis.

**EXPERIMENTAL — referências para testar a criação:** DE 1–2 comum, DE 3 treinado e DE 4 excepcional nos níveis 1–5. Não aplicar como obrigação a toda criatura; a DE defensiva resulta da ficha e do equipamento.

## VI. Dano, armadura e Vida

**Dano básico após acertar:** E total + piso(P não anulado/2), ressalvadas propriedades especiais.

**DEFINIDO:** cada Perícia pode acrescentar no máximo **+1E** nas condições previstas. O total de Êxitos adicionais originados em Perícias é **+2E por ação**, independentemente do número de Perícias elegíveis. Esses Êxitos afetam **a DE e o dano**; Êxitos dos dados ou convertidos de Antecipar não são limitados por esse teto.

A armadura **absorve primeiro sua integridade**; o excedente chega à Vida. **Erro não desgasta proteção.** Perfuração especial habilitada pode ignorar integridade ao acertar a DE. Um golpe não colossal causa no máximo **3 Vida**; as faixas exatas de perda entre 1 e 3 Vida seguem **PENDENTES**. Um colossal exige dano corporal de pelo menos **3 × Vida máxima** num único ataque após proteção.

### Cinco categorias de armadura

- **Muito Leve:** esquiva/DE, sem integridade.
- **Leve:** proteção pequena e DE; bônus numérico pendente.
- **Média:** uma resistência.
- **Pesada:** duas resistências.
- **Extrema:** uma imunidade específica pertinente.

**Valores de integridade de entrada para playtest (EXPERIMENTAL, não oficial):** Muito Leve 0, Leve 2, Média 4, Pesada 8, Extrema 12. Requerem confirmação, assim como os bônus de DE sugeridos de +2 Muito Leve e +1 Leve.

**Carga (unidades Alto):** 1 + piso(Força/3) + piso(Vigor/3) + piso(Armas/3) + piso(Atletismo/3). A graduação de Armas e a massa física de equipamentos devem ser registradas corretamente; os dados de composição não equivalem automaticamente à carga real. A ferramenta experimental do nível 1 não possui um catálogo completo de Armas e não calcula seu bônus por grau.

## VII. Conjuração

O Aprendiz de Conjurador possui acesso inicial ao elemento Psíquico. Elementos básicos (Fogo, Água, Raio, Vento, Terra) exigem a habilitação apropriada; Sagrado, Sangue, Trevas e Veneno possuem habilitações especiais.

**Combinação elemental:** no máximo **dois elementos por magia**. A ordem determina o **principal** e o **secundário**. A inclusão do segundo elemento com Perícia pertinente consome **1A**, que não pode ser reutilizado. Misturas habilitadas podem gerar dano básico, mas efeitos extraordinários exigem PP e Especialidade Elemental.

**Resistência dupla:** metade do dano dos Êxitos; Pavor não entra no dano. **Imune apenas ao elemento principal:** metade dos Êxitos e Pavor sem dano. **Imune aos dois:** dano zero. **Vulnerabilidade corretamente explorada:** o dano dos Êxitos dobra, mas a DE não. Sagrado e Trevas possuem vulnerabilidade mútua; Psique e Veneno não possuem fraquezas elementais universais. A matriz natural completa, arredondamentos e casos mistos permanecem pendentes.

Magia extraordinária com d20 pode ser desenvolvida a partir do nível 10 com o Grau 7 e requisitos. No nível 20, uma Maestria especial pode converter um dado de Inteligência em d20 por **2 PP**; gastar **+1 PP** ativa uma Especialidade Elemental habilitada com efeitos como área, atingindo aliados se presentes. A conjuração sem ativar tal Especialidade pode permanecer **alvo único** e dano elemental básico. O talento “Tecelão Arcano” foi descartado.

## VIII. Perícias e profissões emergentes

Perícias têm preços e requisitos específicos; numerosas opções baratas podem se combinar em árvores abertas. Um ramo pode se conectar a outro sem exigir comprar toda uma sequência de uma “classe” tradicional.

Exemplos documentados de Perícias iniciais:

| Perícia | XP | Função |
|---|---:|---|
| Combate | 1 | +1A em combate pertinente |
| Armas 1 | 2 | Habilitação e primeira especialização de arma |
| Artes Marciais | 1 | Combinação desarmada, após Armas e Punhos |
| Aprendiz de Conjurador | 2 | Conjuração grau 1 |
| Magia Única | 1 | Uma magia inicial |
| Perito Conjurador | 2 | Fontes pertinentes adicionais |
| Improviso Mágico | 1 | Elemento disponível no ambiente |
| Mestre Elementalista | 5 | Segundo elemento criado conscientemente e +1A |
| Conjuração Elemental (elemento básico) | 1 cada | Elemento adicional |
| Magia Sagrada / de Sangue / de Trevas / de Veneno | 3 cada | Habilitação especial, sujeita a graus |
| Montar Animal | 2 | Montaria comum, requer Influência 2 |
| Combinação geral de fontes | 2 | Habilita fontes pertinentes, respeitando a ação |

**Punhos 1 não é uma Perícia adicional de 2 XP no orçamento de Perícias:** é o **primeiro grau da Prática Punhos**, adquirido com **2 XP de Formação**, após a habilitação específica. A sequência inicial completa de Armas 1 (2 XP de Perícias) + Punhos 1 (2 XP de Formação) + Artes Marciais (1 XP de Perícias) é possível quando os requisitos estão atendidos.

A lista completa ainda será desenhada pelo autor. A ferramenta de criação expõe somente as capacidades documentadas e não cria poderes inéditos.

## IX. Níveis, Marcos e XP

PP máximos: **0** (níveis 1–4), **1** (níveis 5–9), **2** (níveis 10–19) e **3** (nível 20). O nível 10 concede automaticamente o Talento passivo **Perícia em Coragem**, que converte 2 Coragens em 1 PP uma vez por turno, até o teto da reserva. O Cavaleiro do Terror usa 2P próprios em vez disso, transferindo **exatamente 2P**, sem duplicação.

Armas e Conjuração possuem **sete Graus de acesso**, com Grau 7 habilitando o primeiro d20 desde o nível 10 mediante compras e requisitos. No nível 20, uma Maestria de Atributo pode fornecer segundo d20 por 2 PP; exige ao menos um Atributo-chave no grau 6, 100 XP anteriores em Perícias e mais 100 XP para adquirir a própria Maestria. Não é possível converter dois dados de Atributo em uma ação.

A curva de **664 XP acumulados no nível 20 é EXPERIMENTAL**, assim como a alternativa de 600. O orçamento final aguarda os custos do catálogo completo de Perícias e a composição do Grau 7.

## X. Referência de continuidade

O sistema ainda precisa finalizar a geometria de magias, bônus de DE, integridade de armaduras, limiares de ferimentos, classificação quantitativa de encontros e a árvore completa de Perícias. As decisões e estudos estão registrados no **[SRD v0.22](srd-continuidade-v0.22.md)**. A antiga redação do Livro v0.5 foi mantida em arquivo para comparação histórica; **não sobrescreve a seção mais recente do SRD**.
