---
title: "Codex RPG — SRD de Continuidade v0.22"
version: "0.22"
system: "Codex RPG"
updated: "2026-11-09"
---

# CODEX RPG — SRD DE CONTINUIDADE v0.22

**Data:** 9 de novembro de 2026. **Consolidação de regras recentes de XP, Graus, Coragem/PP, d20, magia elemental e propostas de integridade/conflitos.**

**Ordem de precedência:** decisão mais recente do autor > seção 0-F desta edição > seção 0-E histórica > seção 0-D > 0-C > documentos históricos. O Livro do Jogador v0.5 ainda contém passagens anteriores e **não foi editado nesta publicação**.

**Estados:** **DEFINIDO** = aprovado expressamente; **EXPERIMENTAL** = hipótese numérica adotada apenas para testes; **PROPOSTO** = alternativa ainda não aprovada; **PENDENTE** = exige decisão. Não transformar uma proposta em regra oficial.


## 0-F. Consolidação autoral da progressão, dano, magia e recursos — 9 de novembro de 2026

**Precedência normativa da v0.22:** decisões explícitas recentes do autor > seção **0-F** > seção **0-E** (v0.21, preservada abaixo) > 0-D > 0-C > históricos. O SRD v0.21 e seu candidato de d20 são preservados integralmente para rastreabilidade; números e restrições anteriores que conflitem com esta seção não estão vigentes. O Livro do Jogador v0.5 **não foi modificado** nesta atualização. Esta seção registra tanto regras definidas quanto parâmetros ainda experimentais, sem confundi-los.

**Estados:** DEFINIDO = confirmado pelo autor; EXPERIMENTAL = para simulação/playtest; PROPOSTO = sugestão não aprovada; PENDENTE = falta procedimento ou decisão. A adoção da tabela reforçada **G** do d20 como candidata preferida para teste é **EXPERIMENTAL**, não substituição oficial da tabela publicada. O teto de **DE 30 permanece DEFINIDO**.

### 0-F.1. Êxitos concedidos por Perícias, dano e risco [DEFINIDO / PENDENTE]

- Uma Perícia que conceda bônus de Êxito fornece **no máximo +1E por aplicação**, conforme seus requisitos próprios (ainda por catalogar). Perícias diferentes podem oferecer condições e aplicações distintas, inclusive favorecendo Vantagem, Desvantagem, controle, abertura e técnicas; nenhuma é um +1E universal sem condição.
- **Teto cumulativo de +2E originados em Perícias por ação**, independentemente de quantas Perícias distintas sejam ativadas e quantas condições cumpridas. O terceiro bônus +1E de Perícia não eleva o teto. Este limite é a decisão autoral mais recente, em substituição aos protótipos históricos de +3E e +4E concedidos diretamente por técnicas físicas.
- Todo **Êxito acrescido** por Perícia que não esteja expressamente marcado como “exclusivo para dano” contribui para **atingir a DE e causar dano**, inclusive na classificação de predominância E/P. Êxitos obtidos nos dados e Êxitos convertidos de Antecipar também entram normalmente; não são limitados pelos +2E provenientes de Perícias.
- Dano básico continua **E total + piso(P não anulado / 2)**, salvo propriedade expressa. A quantidade de Pavor residual não é anulada por bônus de E e ainda pode ser transferida e dar oportunidade ao inimigo; apenas a sua predominância sobre E pode mudar. Resultados com Pavor e sem Pavor não são equivalentes.
- Condições e técnicas que acrescentem Êxitos **exclusivamente ao dano** (ex.: antigas afinidades de +2E para dano) exigem revisão frente ao novo multiplicador de vulnerabilidade, para evitar dupla amplificação; **não adotar cumulativamente** bônus legados sem validação. O que conta como bônus não proveniente de Perícia na limitação de +2E ainda é PENDENTE.

### 0-F.2. Elementos primário e secundário, resistências e imunidades [DEFINIDO / PENDENTE]

- Conjuração comum possui um elemento, e combinações habilitadas comportam **no máximo dois elementos**. A **ordem declarada** determina o **elemento principal (primeiro)** e o **secundário (segundo)**; inverter a ordem pode mudar a interação com defesas e propriedades.
- **Resistente apenas ao elemento secundário:** quando o elemento principal não encontra resistência, a combinação causa **dano normal**, sem amplificar efeitos. **Resistente a ambos os elementos:** causa **metade do dano dos Êxitos**, sem componente de dano por Pavor.
- **Imune ao elemento principal, mas não ao secundário:** causa **metade do dano dos Êxitos**, sem componente de dano por Pavor. **Imune aos dois:** dano elemental **zero**. A imunidade não apaga o Pavor da rolagem nem o gasto de Antecipar; Pavor residual segue o fluxo de transferência/intervenção.
- **Vulnerabilidade elemental efetivamente explorada:** cada E aplicado ao dano vale **o dobro**; não duplica E para alcançar DE. O componente P do dano segue **piso(P/2)** quando não existir resistência/imunidade que o suprima. Bônus de +1E de Perícias, respeitado o teto cumulativo +2E, também são duplicados no **dano** quando a vulnerabilidade se aplica.
- **Exemplos de cálculo**, com 7E (incluindo os bônus) + 2P não anulados: normal = 8 de dano; vulnerabilidade válida = 15; resistente a ambos = metade de 7E, sem P; imune ao principal apenas = mesma metade, sem P; imune a ambos = 0. **Arredondamento de E ímpar pela metade é PENDENTE** (piso foi usado apenas ilustrativamente em cálculos anteriores). Resistência a apenas um elemento **principal** quando o secundário não é resistente, interação entre resistência e vulnerabilidade no mesmo alvo, e efeitos mistos com dano físico estão PENDENTES.
- **Princípio de identidade elemental:** elementos **não se anulam automaticamente** por serem opostos; a própria natureza de um elemental pode justificar imunidade ao mesmo elemento (ex.: elemental de Água imune a Água). Vulnerabilidade dos naturais exige normalmente **combinação contextual** de elementos, não um “triângulo de vantagens” automático.
- **Vulnerabilidades exemplificadas pelo autor para exploração combinada:** contra elemental de Água, **Fogo + Ar** ou **Fogo + Terra**; contra Fogo, **Água + Ar** ou **Água + Terra**; **Água + Terra** para dissipar Ar; contra Terra, **Água + Ar** ou **Água + Fogo** são possibilidades em análise. A matriz completa de naturais, o elemento Raio, casos de contexto e o papel de elemento principal continuam **PENDENTES**; não instituir vulnerabilidades universais apenas com base nestes exemplos.
- **Sagrado e Trevas** possuem fraqueza recíproca: Sagrado contra Trevas e Trevas contra Sagrado causam **dobro do dano dos E** nas condições pertinentes, mesmo como confronto elemental simples. **Veneno e Psique não possuem fraqueza elemental universal**; isso não os torna imunes à resistência específica de uma criatura.
- Os efeitos elementais de Vida, integridade, movimentação e status continuam exigindo suas habilitações e custos; o multiplicador de dano não remove o limite comum de **3 Vida por ataque não colossal**, nem o procedimento de integridade e dano colossal. **Fogo avançado pode afetar integridade e Vida**, mas a divisão operacional desses componentes em ataque misto ainda é PENDENTE.

### 0-F.3. Antecipar para combinar elementos; PP de magia extraordinária [DEFINIDO / PENDENTE]

- **Mestre Elementalista:** Perícia existente que habilita criar conscientemente o segundo elemento e concede **+1A** ao teste de conjuração, conforme catálogo anterior. **Agora é obrigatório gastar 1A para efetivamente adicionar o segundo elemento**, respeitando o máximo de dois. O A gasto não serve também para anular P, passar protagonismo ou converter 2A em 1E. Improviso Mágico continua permitindo a inclusão de elementos disponíveis na cena mediante suas condições; a interação entre as duas Perícias e o custo de 1A para cada caso específico pode ser detalhada em catálogo.
- Adicionar o segundo elemento **não concede mais dados nem mais E** por si. A mistura habilitada pode aplicar o dano elemental básico; **efeitos especiais** de elemento, área extraordinária, dano direto à Vida e propriedades avançadas exigem a Especialidade Elemental pertinente e gasto próprio de PP.
- **Magia extraordinária Grau 7 com 1d20** é a fonte principal de d20 a partir do marco de nível 10 (observados os requisitos). No nível 20, **converter um d10 de Inteligência para d20 custa 2 PP**, fornecendo até dois d20 na mesma pilha, se fontes e ação forem compatíveis.
- **2 PP pela conversão de Inteligência, sem o PP adicional da Especialidade:** exemplo autorizado de magia de **alvo único** com dano elemental **básico**, sem acionar efeitos especiais e sem criar automaticamente uma grande área que atinja aliados. **3 PP (2 conversão + 1 Especialidade)**: combinação extraordinária que pode manifestar **área e efeitos especiais**, quando habilitados, inclusive atingir aliados dentro da área. Isso não significa que toda magia de 1d20 tenha custo fixo 2 PP: o custo de 2 PP é **da conversão do dado de Inteligência**, não do dado da magia ou arma já comprado.
- **Fogo + Ar extraordinários** podem formar tempestade/área de fogo e vento, com perigo para aliados. **16 × 16 metros** foi citado como exemplo de abrangência de grande conjuração, mas se refere a área quadrada, diâmetro ou raio e como escalar por Grau é **PENDENTE**; não registrar como raio oficial. Magias pesadas podem levar mais tempo, ainda PENDENTE.
- A possibilidade de renunciar à Especialidade para concentrar a magia em alvo único resolve a preocupação de dano colateral sem outro talento. **“Tecelão Arcano” DESCARTADO**: não é Perícia adotada, não reduz área mediante Coragem, não possui preço em XP e não deve constar do catálogo como regra.
- Se a vulnerabilidade combinada ×2 é efeito básico da combinação ou requer a Especialidade Elemental de +1 PP **não foi confirmado expressamente**; manter **PENDENTE** antes de tratar dano dobrado em ataques básicos contra todos os alvos.

### 0-F.4. Sete Graus, d20, composição e carga [DEFINIDO / EXPERIMENTAL / PENDENTE]

- A progressão de **Armas e Conjuração passa a comportar sete Graus de acesso**, com **Grau 7 extraordinário**, habilitando fontes de **1d20** a partir do **nível 10**. Grau não concede composição, dados, arma ou magia gratuitamente: compra de Prática, perícias de uso, equipamentos, fontes e XP continuam obrigatórias. A distribuição intermediária dos Graus 1–6 (exemplo 1/2/4/6/8/9) é **EXPERIMENTAL**, não tabela oficial.
- **Nível 5:** primeiro PP; **nível 10:** segundo PP, Talento Perícia em Coragem, possibilidade de **primeiro d20** proveniente de Grau 7 em arma/golpe desarmado/magia; **nível 20:** terceiro PP e acesso à **conversão de um dado de Atributo para o segundo d20** por 2 PP mediante Maestria. São **Marcos de habilitação**, não dados distribuídos gratuitamente.
- **Dado d12 custa 3 pontos de composição**; **d20 custa 10 pontos de composição**. Portanto, **3d12 = 9 pontos** e **1d20 = 10 pontos**. A antiga correspondência d20=6 pontos do SRD histórico está substituída. Dados físicos rolados continuam limitados a 9, com retenção até 4 segundo o Marco e Coragem, mantendo ao menos um dado de Atributo.
- **Peso real:** arma de 3d12 ocupa **3 unidades Alto**; arma de d20 ocupa **3 unidades Alto**. Um foco físico de conjuração equivalente conta no inventário; elementos obtidos do **ambiente** dispensam carregar esse foco quando a fonte existe e é válida. O **Monge** paga a mesma evolução de dados e técnicas desarmadas, mas o peso do golpe é sua capacidade corporal, não uma arma física no inventário. Deve cumprir requisitos de Prática, Atletismo, Vigor e Maestrias para golpes pesados; diferenciação detalhada ainda PENDENTE.
- **Capacidade de carga Alto** revisada por decisão autoral: **1 + piso(Força/3) + piso(Vigor/3) + piso(Armas/3) + piso(Atletismo/3)**, com os graus pertinentes da ficha. O bônus de Armas e Atletismo é cumulativo e cada um acrescenta +1 Alto a cada 3 graus completos. A distinção entre equipamento carregado, carga do inventário e composição de dados permanece obrigatória. No máximo de grau 6 nas quatro fontes, resulta **9 Altos**.
- **Armaduras** mantêm **cinco categorias** (Muito Leve, Leve, Média, Pesada, Extrema), não “sete armaduras”; propriedades e requisitos físicos independem do Grau 7 das armas. O catálogo histórico (incluindo lança-granadas G5 com descrição de 3d20) **precisa ser recatalogado**; os números antigos não permitem a um jogador contornar o limite de **dois d20 na mesma ação**.

### 0-F.5. Maestrias extraordinárias, builds híbridas e três d20 [DEFINIDO / PROPOSTO]

- Existem **seis Maestrias extraordinárias de conversão**, uma relacionada a cada Atributo humanoide: Força, Agilidade, Destreza, Inteligência, Influência e Vigor. Exemplos de aplicação: golpe colossal de mãos vazias; velocidade e esquiva; precisão; proteção e resistência; influência social e manobras com criatura; Inteligência Arcana/conjuração. Os nomes finais e pré-requisitos individuais ainda são PENDENTES.
- **Requisito de habilitação:** pelo menos **100 XP anteriormente investidos no conjunto de Perícias**, cumulativamente, independentemente de serem de uma profissão pura ou híbrida; ao menos **um Atributo-chave no grau 6**, pertinente à Maestria. Cada **Maestria de conversão custa outros 100 XP** e exige os requisitos específicos de fontes/Práticas/Conhecimentos. Os 100 XP prévios são requisito global **atingido uma única vez**, e não nova taxa por Maestria; cada Maestria comprada, contudo, paga seus próprios 100 XP.
- **Ativação:** converter um dado do Atributo habilitado em d20 custa **2 PP**, ao alcançar o nível 20. É possível **comprar diversas Maestrias**, mas apenas **uma conversão de Atributo por ação**; não é permitido combinar duas conversões na mesma ação, nem usando Coragem/recuperação de PP para superar a restrição.
- **Limite de jogador normal = até 2d20 na mesma ação:** um d20 de fonte extraordinária Grau 7 mais um de Atributo convertido. Não acumular d20 adicionais por portar várias armas ou comprar várias Maestrias de um mesmo caminho. Builds híbridas que cumpram requisitos podem usar fontes distintas conjuntamente; ainda são regidas por XP, carga, custo em PP, nove rolados/quatro mantidos e mínimo um de Atributo.
- **Pós-Desafio Divino:** hipótese **PROPOSTA**, não adotada: conquista excepcional permitiria comprar Maestria para elevar um dado de Conhecimento ou Prática específica (d12→d20 por Coragem pertinente), alcançando até **3d20 mantidos** em ocasiões extraordinárias. Não conceder este terceiro d20 nem aumentar teto de quatro mantidos antes de decisão expressa. Monstros excepcionais/chefes compostos continuam podendo ter **3–4d20** por suas regras e custos próprios.

### 0-F.6. Coragem, PP e Cavaleiro do Terror [DEFINIDO / PENDENTE]

- **Talento passivo “Perícia em Coragem” é adquirido automaticamente no nível 10**, sem custo adicional de XP: permite **converter 2 Coragens em 1 PP**, **no máximo uma conversão por turno**. **Recupera PP na reserva** (até seu teto), não paga diretamente uma ativação como Coragem e não aumenta PP máximos. É impossível converter 4 Coragens em 2 PP no mesmo turno por esta capacidade. A janela de uso, em especial quando o ganho de Coragem excederia teto 10, é PENDENTE; não presumir conversão reflexa ilimitada.
- Reserva individual normal de Coragem **10**; PP máximos são **0** (níveis 1–4), **1** (5–9), **2** (10–19) e **3** (nível 20). Coragem permite manter um dado além da retenção natural do Marco (teto 4), elevar um passo permitido de dado, ações de saúde e demais usos reconhecidos. **Antecipar**, não Coragem, é quem normalmente anula **1P próprio por 1A**. Nova conversão é decisão de troca: gastar Coragem em PP diminui as oportunidades de melhorar rolagens.
- **Cavaleiro do Terror** usa Pavor acumulado no lugar de Coragem pelos mesmos custos pertinentes; reserva particular até **10P** e teto de Coragem própria **1**. Na versão desse Talento, pode converter **2P acumulados da sua reserva própria em 1 PP** uma vez por turno; os **2P gastos produzem exatamente 2P de Pavor encaminhado ao adversário, NUNCA 4P**, após a ação/ativação pertinente. Seu Pavor mantido na rolagem e não anulado é contabilizado **separadamente** e segue normalmente transferência e consequências. Não trata a conversão como Pavor extra convertido novamente em mais 2P.
- Outras recuperações específicas de PP já aprovadas permanecem: troca habilitada de tipos de arma (até três recuperações por combate), Conjurador Versátil e Sorte Mágica; todas respeitam a reserva e seus próprios requisitos.
- **A diferença entre Coragem e PP continua central:** a primeira influencia retenção e passos, o segundo alimenta Perícias; recuperação de Coragem via Pavor inimigo e regras de críticos devem ser conferidas com a versão recente. Penalidades por Pânico e valores quantitativos finais ainda PENDENTES.

### 0-F.7. Escala de conflitos, método de balanceamento e DE [EXPERIMENTAL / DEFINIDO]

- Balancear **sempre** com dados retidos por Coragem e elevações de passos disponíveis, comparando também cenários sem gasto: uma ação com 3 dados naturais não basta para medir a força real de uma build capaz de **manter quatro**. Marcos vigentes: nível 1–5 mantém 2 normalmente ou 3 por Coragem; níveis 6–20 mantêm 3 ou 4 por Coragem. Uma elevação comum de passo custa 1 Coragem e a via excepcional segue condições específicas. O limite de 4 permanece absoluto.
- **Faixas pretendidas para playtest**, sem impor pagamento fixo: **Fácil** aceita gastos de 0–2 Coragens em momentos relevantes e risco baixo; **Normal** pode exigir combinações de Perícias/Coragem próximas de 1–3 por rodada relevante, ferimentos sem morte habitual caso haja recursos; **Difícil** cobra uso frequente de Coragem, PP, defesa, manobra e maior risco de morte; **Extremo/Divino** expõe a possível morte em poucos turnos, exigindo boa preparação, cooperação e uso intensivo dos recursos. A quantidade de Coragem **não é custo obrigatório de uma categoria**; é medida observada por ficha/nível/ambiente.
- Medir **acerto puro**, **acerto normal P≤E**, **acerto com Pavor predominante P>E**, falhas limpas/com Pavor, dano após resistência/imunidade/vulnerabilidade, Pavor transferido e Coragem recuperada, duração de PP, integridade e Vida, controle/posicionamento, quantidade de rodadas até conclusão e risco de morte. Distinguir teste de área para três alvos distintos de chefe composto com ficha única.
- DE defensiva base vigente **Agilidade + piso(Destreza/2)**; **DE 30 é teto absoluto** para obstáculos/defesa conjunta e chefes nas condições habilitadas. Tabelas antigas de probabilidade com **três d20 mantidos por jogador** não representam mais a construção regular de nível 20 (máximo de dois, salvo pós-Divino ainda proposto); seus percentuais permanecem **históricos**, não métricas de encontro atual.
- **d20 candidato G reforçado e DE30** permanecem teste EXPERIMENTAL escolhido pelo autor por ampliar a frequência de **Acerto Puro**. Não considerar o protótipo DE24 vigente. Não declarar benchmarks de simulação anteriores “validados” sem reconstrução e reprodutibilidade de seleção, conversões de A, Coragem e composição da pilha.
- Personagens sem d20 podem contribuir por controle, ação conjunta, apoio, equipamentos, posições, vantagem/desvantagem e Perícias; medir sua viabilidade real, **não presumir** que +2E basta para equipará-los a 2d20 em todos os confrontos.

### 0-F.8. Curva de XP por nível [EXPERIMENTAL — NÃO DEFINIDA]

- **XP livre após criação** e custo da progressão permanecem DEFINIDOS; **não existe redistribuição/redefinição da build**: corrigir escolhas é possível comprando novas capacidades com XP futuro. Personagens não precisam comprar d20 para participar de desafios.
- Hipótese de criação **19 XP** (14 de Base/Formação + 5 de Perícias) ainda exige validação; curva **EXPERIMENTAL de 664 XP acumulados no nível 20** substitui para os testes a referência antiga **561 XP** que não incluía as Maestrias de 100 XP. São números de **planejamento**, não orçamento oficial nem limite por categoria:

| Nível | XP total hipotético | Nível | XP total hipotético |
|---:|---:|---:|---:|
| 1 | 19 | 11 | 271 |
| 2 | 31 | 12 | 309 |
| 3 | 46 | 13 | 349 |
| 4 | 64 | 14 | 391 |
| 5 | 86 | 15 | 434 |
| 6 | 110 | 16 | 478 |
| 7 | 137 | 17 | 523 |
| 8 | 167 | 18 | 569 |
| 9 | 200 | 19 | 616 |
| 10 | 235 | 20 | 664 |

- Referências de custo já publicadas: **Atributo 6 = 55 XP** (3d10), **Conhecimento/Prática 6 = 102 XP** (3d12). Exemplo nível 10, um Atributo6 + uma Prática6 = **157 XP**, restando **78 XP** na hipótese de 235; **a aquisição da composição Grau7 ainda precisa ser precificada**, então não afirmar que o primeiro d20 já é matematicamente viável. Exemplo nível20: dois Atributos6 (110) + duas Práticas6 (204) + 100 XP prévios em Perícias + Maestria de conversão de 100 XP = **514 XP**, restando 150 na curva hipotética **antes** dos requisitos adicionais/elementos/equipamentos. O orçamento por nível e os preços de composição continuam PENDENTES.
- Companheiros/monstros e desafios devem ser aferidos por **XP efetivo** e capacidades, não apenas nível/Grau ou custo total; uma opção híbrida que compra um segundo d20 pode abrir mão de defesas e mobilidade.

### 0-F.9. Integridade das armaduras — tabela para playtest [EXPERIMENTAL]

**Estrutura vigente:** armadura é proteção de **integridade separada**, absorve dano primeiro e apenas excedente atinge Vida; erro do atacante **não** desgasta proteção. Integridade é propriedade do equipamento, **nunca DE multiplicada da ficha**. Perfuração especial habilitada ignora integridade (inclusive escudo mágico) quando acerta a DE; imunidades e resistências seguem suas condições. Extrema possui imunidade específica pertinente; Média possui uma resistência, Pesada duas; Muito Leve favorece DE, não absorção.

**Hipótese inicial de integridade por categoria e qualidade**, NÃO aprovada como regra oficial:

| Categoria | Básica | Aprimorada | Lendária |
|---|---:|---:|---:|
| Muito Leve | 0 | 0 | 0 |
| Leve | 0 | 0 | 0 |
| Média | 8 | 16 | 24 |
| Pesada | 16 | 36 | 64 |
| Extrema | 24 | 56 | 80 |

- **Leve = integridade zero** é proposta de padronização numérica para confronto, não regra aprovada; o SRD 0-E admite pequena proteção e a divergência deve ser resolvida expressamente. A escala de **qualidade Básica/Aprimorada/Lendária** e seus requisitos de compra, materiais e efeitos de Grau seguem PENDENTES.
- Para dimensionamento simples, com **dano bruto médio de 8 por acerto** uma proteção de 36 dura aproximadamente **4,5 acertos equivalentes**; com **dano médio 10**, integridade 80 dura **8 acertos equivalentes**. São razões de integridade/dano, **não simulações reais de rodadas**, pois DE, bônus +2E de Perícias, vulnerabilidades ×2, fogo direto na Vida, resistência, área e chances de acerto modificam a duração. Recontar impactos com dano que exceda a integridade no último golpe.
- Dano corporal não colossal causa no máximo **3 Vida por ataque**; a exceção **colossal** exige, num único ataque, dano **após atravessar integridade** igual a **3 × Vida máxima**. Não conceder o colossal por simples soma de golpes ou ignorar armadura ao calculá-lo.
- Testar separadamente armaduras sob **1d20** de nível10, **2d20** de nível20, técnicas sem d20 com +1/+2E condicionais, combinados com/sem vulnerabilidade, ataque conjunto, perfuração especial, resistência dupla e imunidade; comparar também perda de PP e Coragem do defensor. **Nenhuma integridade deve ser consolidada antes desses testes.**

### 0-F.10. Lista objetiva de pendências antes de fechar o Livro do Jogador

1. Tabela final de Graus 1–7 (acesso intermediário), composição por Grau, preços dos pontos de composição, procedimentos de compra de armas, punhos e magias; catálogo de armas de fogo e reclassificação do lança-granadas.
2. Procedimento completo de resistência apenas ao elemento **principal**; vulnerabilidade combinada versus resistência/imunidade simultâneas; relação do Raio, matriz natural, arredondamentos das metades, dano físico + elemental, e se ×2 da combinação demanda +1 PP de Especialidade.
3. Alcances exatos, geometria e duração de áreas avançadas (inclusive “16 × 16”), custo de efeitos simultâneos, slots das magias de Grau 7 versus tabela de slots históricos Graus 1–4, tempo de conjuração, fontes/focos e regras de área para cada elemento.
4. Requisitos de Atletismo, Vigor, Práticas e Maestrias de cada arma/punho; seis Maestrias de 100 XP, recarga de PP, entrega de Pavor do Cavaleiro do Terror, ganho de Coragem quando reserva já está em 10 e ordem da conversão.
5. Tabela definitiva de XP por nível/Marco e ritmo de ganho por sessão; orçamento de companheiros e adversários; efeito efetivo de terceiro d20 pós-Divino.
6. Testes reproduzíveis de acerto puro/normal/com Pavor, taxa de dano por rodada, gastos líquidos de Coragem/PP, duração de proteção, fatalidade e valor da Vantagem/Desvantagem. Confirmar se o crítico recupera Coragem sob a revisão mais recente.

### 0-F.11. Identidade cromática dos símbolos [DEFINIDO]

| Símbolo | Runa | Cor HEX |
|---|---|---|
| Êxito (E) | Sowilo ᛋ | **#267A45** |
| Antecipar (A) | Ansuz ᚨ | **#2369BB** |
| Pavor (P) | Thurisaz ᚦ | **#542176** |

---

### Histórico íntegro: seção 0-E da versão 0.21 e versões anteriores

O texto a seguir reproduz a v0.21 **como histórico**, com data e redação original, para rastreabilidade das decisões. Sempre que houver divergência, **prevalece a seção 0-F desta versão**.

## 0-E. Atualização normativa de 9 de novembro de 2026

### 0-E.1. Resultado, Pavor e fluxo de oportunidades [DEFINIDO]

- Apenas os símbolos dos **dados mantidos** entram na ação. Dados descartados não geram Pavor, críticos, recursos ou consequências. Até nove rolados e até quatro mantidos conforme Marcos e custos, com ao menos um dado mantido de Atributo.
- A **DE efetiva** considera Êxitos mais Pavor mantido não anulado e conversões permitidas de Antecipar. O dano básico é Êxitos mais metade inteira do Pavor mantido não anulado, salvo propriedades específicas.
- **Acerto Puro:** alcança a DE sem Pavor mantido restante, seja por não ter obtido Pavor, seja por ter anulado todos os próprios Pavor. Não transfere Pavor nem cria oportunidade inimiga por essa rolagem.
- **Acerto Normal:** alcança a DE e contém Pavor residual **sem predominância sobre Êxitos** (P menor ou igual a E). O Pavor residual é transferido e pode dar oportunidade ao inimigo se não houver Antecipação; não é automaticamente uma complicação maior.
- **Acerto com Pavor:** alcança a DE **com Pavor predominante sobre Êxitos** (P maior que E). Transfere Pavor e pode causar complicações proporcionais ao número de Pavor e ao contexto: atingir aliado, matar alvo que se pretendia poupar, cair, soltar arma, danificar equipamento, travar arma de fogo etc. Um Pavor isolado, em geral, transfere oportunidade e recurso, sem obrigar uma complicação extrema.
- **Falha sem Pavor:** não alcança a DE, sem consequência negativa automática, e passa oportunidade aos aliados.
- **Falha com Pavor residual sem predominância:** falha, ainda transfere o Pavor e pode passar a oportunidade aos inimigos. **Falha com Pavor predominante:** falha e sujeita-se também a complicações. A perda de 1 Coragem em falhas com Pavor prevista historicamente permanece como referência, mas sua aplicação exata aos casos intermediários exige conferência em playtest.
- As classificações valem **também para rolagens inimigas**. Complicações inimigas podem derrubar um monstro enorme pela própria ação, ainda que um jogador não conseguisse impor essa condição diretamente. Pavor inimigo mantido gera Coragem para jogadores segundo a distribuição vigente.
- Pavor próprio não anulado é transferido prioritariamente ao **inimigo mais próximo** do personagem que agiu, mesmo em ações de múltiplos alvos. Empates: inimigo de **maior Grau**, depois o de **menor integridade ou Vida**, depois escolha livre. Quando não existir inimigo elegível, vai à reserva pública de Pavor do Narrador, respeitando o teto de **2 + número de jogadores**.
- A antiga economia paralela de **Pressão** não existe: há Pavor público e Pavor local. Não confundir a reserva pública para iniciar conflitos e comandar com o Pavor local das ameaças para ativação.
- Um **Líder** pode pagar **1P da reserva pública** para comandar um aliado inimigo mais distante, em vez da seleção normal por proximidade. O alcance exato é PENDENTE. Esse comando difere da ação conjunta ofensiva: a v0.20 estabelecia Líder mais **3P públicos** para coordenar inimigos; o custo específico da ação conjunta, após essa nova regra de comando, ainda precisa de confirmação para evitar dupla cobrança ou substituição não autorizada.

### 0-E.2. Antecipar, adaptação e ataque de oportunidade [DEFINIDO]

- Usos básicos: **1A anula 1P próprio**; **1A passa a oportunidade a aliado** antes de intervenção inimiga **sem anular P**; **2A se convertem em 1E**. Cada símbolo só pode ser gasto uma vez.
- Com Perícia apropriada, após perceber que sua ação iria falhar, o jogador pode gastar **1A para adaptar a ação** (fugir, carregar/proteger/empurrar aliado, reposicionar-se etc.). Com A restantes, pode anular P e, se ainda houver A, passar a oportunidade ao aliado. Se mantiver Pavor e não conseguir passar a oportunidade, o inimigo intervém, observada a regra de proximidade. Mudar a ação não converte automaticamente a falha em acerto.
- **Exceção de coordenação:** para chamar um aliado que **já atuou**, são necessários **2A**; chamar um aliado ainda disponível custa 1A. Isso modifica a proibição absoluta antiga de antecipar um turno já realizado; os critérios exatos de encadeamento, momento da nova rolagem e limites por rodada permanecem PENDENTES.
- Ao se movimentar **a até 1 metro de inimigo desocupado**, que **não esteja comprometido atacando outro alvo**, o personagem provoca **um único ataque de oportunidade** se a **DE defensiva do inimigo for maior que a do personagem**. O ataque ocorre antes do deslocamento: é **ataque simples com exatamente dois dados mantidos, sem modificações**. Ainda deve superar a DE do alvo. Pode gerar Coragem aos jogadores mediante Pavor mantido pelo inimigo. A frequência total de reações de um inimigo por rodada permanece PENDENTE.
- A mobilidade protege atiradores de DE alta contra aproximações de adversários menos ágeis; terrenos, imobilizações e bloqueios continuam pertinentes.

### 0-E.3. Grupos, soma de DE e encontros [DEFINIDO]

- **Ações conjuntas ofensivas** envolvem no máximo **três participantes** dos dois lados. Podem somar resultados/dano para formar um impacto conjunto, respeitadas as regras de ativação; detalhes de compartilhamento dos símbolos ainda PENDENTES. Dois outros membros de um grupo de cinco podem prestar apoio, preparar defesa ou atuar em sequência por Antecipar, mas não tornam o mesmo ataque uma ação de cinco.
- **Defesa conjunta:** participantes próximos e efetivamente coordenados **somam suas DE defensivas iniciais**. Bônus posteriores (ex.: Escudo Mágico) acrescentam-se à soma inicial, com **teto absoluto de DE 30**, aplicável inclusive a monstros individuais e compostos. O valor de DE 30 está atualmente **DEFINIDO** e só será substituído após nova decisão.
- **Alvos separados vs criatura composta:** magia ou ataque em área que alcance a DE conjunta e cubra os **três inimigos separados** aplica seu dano a **cada ficha** atingida. Ataques de alvo único escolhem uma das criaturas. Quando uma criatura separada é eliminada, sua DE deixa de contribuir para a defesa conjunta. Um chefe **composto de uma única ficha** recebe **um único dano** pela área, preservando DE e capacidade conjunta até sofrer efeito específico; área não multiplica dano contra suas partes abstratas.
- **Chefe composto** pode reunir orçamento de XP e Pavor local dos componentes de Grau pertinente e, quando habilitado por sua construção excepcional, **manter até quatro d20** numa ação (ainda respeitando limite de quatro dados mantidos e nove rolados).
- **Ativar um turno do chefe composto custa 3P**. Esse custo é da ativação do chefe; não deve ser confundido com o comando de 1P público de Líder nem com a antiga habilitação de ação conjunta inimiga de 3P públicos.
- **Vida e DE naturais** não são multiplicadas gratuitamente por Grau ou número de cabeças: são calculadas por Atributos e compras reais. Vida = 3 + Vigor + piso(Força/2); DE = Agilidade + piso(Destreza/2), mais ajustes autorizados. Armadura/integridade não surgem naturalmente como uma barra extra de monstros.
- **Compras monstruosas de d20** custam **100 XP por conversão habilitada**, podendo repetir compras conforme a construção, substituindo o limite histórico de uma única compra permanente por criatura. Quando se elevam três dados para d20 em Vigor, o ganho é +3 Vida; em Força, +1 Vida (após arredondamento); em Agilidade, +3 DE; em Destreza, +1 DE. O teto final de DE continua 30. O limite de compras por Grau e a forma de disponibilizar quatro d20 em chefes de vários componentes ainda exigem testes.
- **Humanoides monstruosos** combinam o XP humanoide e o monstruoso pertinentes; os Atributos monstruosos podem começar com dados d10 e evoluir; Perícias são limitadas pelo investimento humanoide efetivo, sem ganhar gratuitamente o repertório do Grau monstruoso. Monstro puro **não possui PP**. Componente humanoide Grau 1 não tem PP; Grau 2 possui acesso progressivo; Grau 4 pode chegar a 3 PP. A correspondência exata entre Grau humanoide e níveis/XP precisa ser formalizada.
- **Humanoide composto com três componentes de 3 PP** pode reunir **9 PP de reserva**, mas a criatura unificada gasta **no máximo 3 PP por turno**. Três humanoides com fichas independentes podem gastar até 3 PP cada nas suas respectivas oportunidades, podendo totalizar 9, mas devem coordenar suas DE e são vulneráveis separadamente.

### 0-E.4. PP e Maestrias de recuperação [DEFINIDO]

- PP são uma reserva **global por personagem**, não por Perícia. Teto simultâneo conforme nível: 0 PP (1–4), 1 PP (5–9), 2 PP (10–19), 3 PP (20). Recuperação normal **entre cenas fora de combate**; exceções seguintes foram aprovadas.
- Uma Perícia específica de **troca entre tipos diferentes de armas**, incluindo armas de fogo, permite recuperar **1 PP por troca válida**, até **3 eventos de recuperação por combate**, respeitando o teto simultâneo do personagem. Exige portar tipos apropriados e possuir a Perícia. Alternância repetida entre os mesmos dois tipos e condições exatas de ativação PENDENTES; não transformar toda troca de arma comum em recuperação automática.
- **Conjurador Versátil**, Maestria de fim de jogo com requisitos altos: após **três conjurações bem-sucedidas de magias diferentes**, recupera **1 PP**; magias que falham contra a DE não contam. Repetição de sequências no mesmo combate PENDENTE.
- **Sorte Mágica**, Maestria de fim de jogo com requisitos altos: após um **crítico mágico que também atinja a DE**, recupera **1 PP**. Crítico que falha não recupera. Magias leves podem gerar crítico; a dificuldade de afetar inimigos resistentes é o contrapeso.
- Ativações especiais ordinárias custam geralmente **1 PP**. Transformar um dado de Inteligência em d20 extraordinário custa **2 PP**. Poder extraordinário de tiro no nível 20 pode gastar até 3 PP e causar até 3 Vida sob suas condições; custo/efeito final PENDENTE.

### 0-E.5. Carga e peso [DEFINIDO / correspondências em teste]

- Classes de carga do inventário: **Muito Leve, Leve, Médio, Alto/Pesado e Extremo**. **10 Muito Leves = 1 Leve; 4 Leves = 1 Médio; 2 Médios = 1 Alto; 2 Altos = 1 Extremo.** Portanto, em equivalentes Muito Leves: 1, 10, 40, 80, 160.
- Capacidade de carga expressa em unidades **Alto**: **1 Alto gratuito + piso(Força/3) + piso(Vigor/3)**. Com Força 6 e Vigor 6 são **5 Altos**: permite dois escudos Extremos (2+2 Altos) e uma armadura Pesada (1 Alto), sem excesso de carga. Empunhadura e mãos disponíveis são restrições diferentes da capacidade de carregar.
- **d4 = Muito Leve; d20 = Extremo** [DEFINIDO]; correspondências intermediárias d6/Leve, d10/Médio e d12/Alto são **PROPOSTAS**, sujeitas ao catálogo. **Peso de inventário** não é automaticamente igual aos **pontos de composição de dados** (escala histórica d4=0,5; d6=1; d10=2; d12=3; d20=6).
- Pesos reais de focos mágicos, munições, itens de arremesso e suprimentos contam no inventário. **Focos para graus elevados, inclusive Grau 4/Extremo, exigem capacidade de carga apropriada**. A tabela exata de peso de foco por Grau é PENDENTE.

### 0-E.6. Armaduras, escudos físicos e perfuração [DEFINIDO / integridade PENDENTE]

- **Muito Leve:** aumenta DE, mas possui **0 integridade**. **Leve:** proteção menor, bônus de DE sujeito ao playtest. **Média:** tem **1 resistência**. **Pesada:** **2 resistências**. **Extrema:** maior integridade e **imunidade a uma propriedade/tipo pertinente**, a especificar; nenhuma imunidade genérica universal. Integridades numéricas e os demais bônus/penalidades de DE PENDENTES.
- **Escudo físico Grau 4:** peso **Extremo = 2 Altos**, composição **2d12**, **sem d20**, requisito **Força 6 E Vigor 6**. Escudos podem defender por reação segundo Perícia, pagando PP ou integridade conforme modalidade. Bloqueio acima do dano nega tudo; igualdade bloqueia mas desgasta 1 integridade; inferior bloqueia parcialmente. Resultado exato de bloqueio e dupla cobrança ao ativar com integridade PENDENTES.
- **Escudo como arma:** causa **metade do dano por Êxitos**; Pavor não causa dano de escudo, embora contribua para DE e siga as transferências. Pode **empurrar ou derrubar** quando habilitado. Arredondamento de Êxitos ímpares PENDENTE. Dois escudos Extremos são possíveis pelo inventário de personagem com capacidade suficiente.
- **Perfuração especial:** quando habilitada por arma, Perícia ou crítico e quando **acerta a DE**, **ignora a integridade de qualquer proteção**, inclusive armadura ou Escudo Mágico; atinge diretamente Vida, até **3 Vida** por ataque não colossal. Não ignora a DE nem garante acerto.
- **Erro não desgasta integridade** de armadura, escudo físico ou mágico.

### 0-E.7. Escudo Mágico [DEFINIDO]

- Perícia de meio de jogo: o conjurador gasta **1 PP + sua ação** e rola os dados da magia utilizada para criar um escudo de **integridade temporária = Êxitos mantidos + piso(Pavor mantido não anulado/2)**. O Pavor ainda é transferido normalmente; conjurar proteção não suspende a intervenção adversária.
- O escudo adiciona **+1 DE por elemento incorporado**: um elemento, +1; dois elementos, +2. O bônus dura **até o primeiro ataque que alcance a DE aumentada** ou até a chegada do próximo turno do mago, completando a rodada, o que acontecer primeiro. A integridade remanescente persiste após o fim desse bônus, até ser destruída.
- Conhecer a mistura elemental permite preparar escudos com múltiplos elementos. **Mais 1 PP**, além do custo inicial, ativa efeitos especiais elementais correspondentes: ex., retaliar com Fogo quem ataca corpo a corpo; se incorporar dois elementos e possuir as Especialidades pertinentes, pode aplicar ambos os efeitos. Natureza/intensidade dependem do grau das magias utilizadas e Perícias compradas.
- **Ataques que erram não consomem integridade nem derrubam o bônus de DE.** O acerto pode reduzir integridade. Resistências elementais de escudos devem se relacionar aos elementos escolhidos. Frequência dos efeitos reativos, redução por resistência e desgaste preciso por acerto PENDENTES.
- A acumulação com equipamentos não é, por si só, proibida. Conjuradores investem XP, slots, PP, Atributos e preparação para isso.

### 0-E.8. Conjuração, espaços e focos [DEFINIDO]

- O máximo é **9 slots de magia**; uma magia de **Grau 1/2/3/4 ocupa 1/2/3/4 slots**, respectivamente. Cada magia preparada conserva seu próprio elemento atrelado ao espaço. Preparar três pesadas ocupa 9 slots; misturar magias não devolve slots.
- **Habilitação elemental**, **Perícia de mistura de magias** e **Especialidade Elemental** são investimentos distintos. Misturar magias com a Perícia adequada combina efeitos **básicos**. Ativar efeitos especiais, sobretudo de Graus 2 e 3 e combinações elementais poderosas, exige Especialidade pertinente e gasto de **PP** conforme técnica.
- **Magia de Grau maior herda as possibilidades dos Graus menores** do seu elemento. Magias pesadas custam mais tempo de conjuração; tabela temporal e custos de múltiplos efeitos simultâneos PENDENTES.
- **Condições físicas** como congelamento/enredamento elevam a DE exigida em **+1 por cada bloco de 3 em Força e Vigor do alvo** (interpretação atual por Atributo: piso(Força/3)+piso(Vigor/3)). Se atingir a DE normal e não a elevada da condição, a magia pode causar seu dano normal sem imobilizar.
- Elementos podem ser obtidos do **ambiente** ou de **foco físico carregado**. Foco requer **recarga em rodadas igual ao Grau da magia**: 1/2/3/4 rodadas. O foco permite conjuração em ambiente que não fornece naturalmente o elemento. Pedra/natureza contam como Terra; sol desobstruído como Sagrado; escuridão/noite sem lua como Trevas; Sagrado e Trevas contrapõem-se e podem neutralizar seus ambientes. Ar e Psique são normalmente acessíveis; disponibilidade em combate submerso e casos especiais exige adjudicação. Fonte de Veneno ou foco correspondente é relevante. Focos não concedem dados gratuitos.
- **Utilidades elementais:** Água+Terra permite cultivo; Ar+Fogo acende ou sustenta iluminação; Terra ergue/desloca terreno; Terra mais Domar Feras habilita o caminho de Perícia para transformação animal, com requisitos ainda PENDENTES.

### 0-E.9. Propriedades elementais aprovadas em conceito [DEFINIDO / efeitos quantitativos PENDENTES]

| Elemento | Leve / Grau 1 | Médio / Grau 2 | Pesado / Grau 3 |
|---|---|---|---|
| Água | Congelar e imobilizar por 1 rodada, com desvantagem, sem dano | Perfuração **no crítico** | Empurra e causa dano; herda condições leves |
| Fogo | Disparo à distância sem queimadura direta à Vida | Área reduzida e proximidade de 8 m, com efeitos ofensivos | Dano à armadura e Vida (até 3 Vida), em área, cone ou linha, podendo acertar aliados |
| Terra | Desvantagem por 2 rodadas (ex.: terra nos olhos) | Enreda e imobiliza, espinhos danificam armadura | Dano, empurrar e derrubar |
| Ar | Aumenta movimentação, puxa/empurra ou desloca objetos | Sufoca, empurra/puxa/derruba, com possível dano | Grande área que desloca vários alvos; quedas podem causar dano |

- Os efeitos só se aplicam **se a conjuração atingir a DE apropriada** e possuir a Especialidade/ativação que os habilita. A potência superior não elimina propriedades leves.
- **Sangue:** efeitos sobre Vida e sangue manipulável. Ar+Sangue causa dano à Vida e desloca; Terra+Sangue solidifica armas corpo a corpo ou projéteis; Água+Sangue pode congelar e lesar Vida; Fogo+Sangue pode produzir **2 de dano à Vida**.
- **Sagrado:** Coragem, acalmar, purificação e contenção; Fogo+Sagrado ilumina; Ar+Sagrado inspira e acalma; Água+Sagrado remove maldições/venenos em condições apropriadas; Sangue+Sagrado habilita cura hemomântica especializada.
- **Trevas:** Pavor, escurecer, maldições e incremento arriscado de acerto; aplicações incluem atingir dois alvos ou incorporar **+2P** para acertar um alvo sob técnica pertinente. Água+Trevas pode gerar maldição/desvantagem, congelamento ou vários alvos. Momento e custo de injeção dos 2P PENDENTES.
- **Psique:** natureza neutra; técnica de conversão de efeito para neutro permite enfrentar imunidades elementais, conforme requisitos e custos.
- **Veneno:** penalidades mais duradouras, inclusive reduzir Êxitos efetivos sem remover Vida diretamente.
- Misturas como **Fogo+Ar** geram tornado de fogo, podendo puxar ou projetar chamas; **Fogo+Água** permite aplicações menos letais. O jogador escolhe propriedades possíveis conforme criatividade, Grau, Especialidades, PP, alcance, tempo e julgamento do Narrador, sem acumular automaticamente todas as propriedades.

### 0-E.10. Armas, graus e munições [DEFINIDO / catálogo final PENDENTE]

- Armas corpo a corpo, arcos, pistolas e magias compartilham **referência de Grau e categorias de peso**, com efeitos e economias próprios. Armas cortantes podem abrir Sangramento sem dano por tempo; perfurantes habilitadas ignoram integridade; pesadas podem derrubar; armas longas podem criar espaço com Antecipar. Perícia pode adicionar Êxitos e habilitar efeitos; infusões elementais são possíveis.
- **Duas armas** podem, com Perícia apropriada, combinar **Armas + Armas + um Atributo**, sem conceder automaticamente Vantagem Absoluta. Pilha continua até nove rolados e quatro mantidos; empunhar duas armas limita uso de escudo.
- **Armas de fogo:** munição é comprada em dados adequados ao calibre; o carregador limita disparos e recargas, e vários disparos consomem dados de munição. Travamentos por Pavor exigem a classificação de **acerto/falha com Pavor predominante**, e não a simples presença de P residual. Limpeza de travamento usa Engenharia sem dados da arma, DE ligada ao Grau. Revólver não trava.
- Catálogo em elaboração: **Pistola G3** (Perícia básica 5 XP, avançada +5 XP em estudo), **Revólver G2** (básica 3 XP, sem travamento), **Metralhadora G3** (básica 5 XP, avançada 10 XP, alcance normal 16 m), **Doze G3** (básica 5 XP, avançada 10 XP, dano em cone e derrubada, não perfurante), **Rifle G4** (básica 6 XP, avançada 12 XP, opção avançada de derrubar ou atravessar dois alvos em linha), **Lança-granadas G5** (básica 10 XP, avançada 20 XP, 3d20 rolados especiais, custo 1 PP por disparo, área circular 8 m, alcance normal 16 m, penalidade a 8 m e desvantagem absoluta a 24 m). Alcance, retentivas e custos exatos em catálogo ainda sujeitos à harmonização.
- Recuo de Doze/Rifle/Lança-granadas sem treinamento pode derrubar quando ultrapassa Vida **máxima**, não remanescente. Avançado de Lança-granadas requer Engenharia 6, Armas 6, Destreza 6; 1 PP adicional pode redirecionar o disparo para área vazia após falha técnica reconhecida. Falha com Pavor pode explodir no atirador, acerto com Pavor pode ferir aliados. Raio versus diâmetro dos 8 m, custo total da Perícia e interpretação de 3d20 rolados/mantidos PENDENTES.

### 0-E.11. Revisão de DE máxima e do d20 [PROPOSTO — NÃO APROVADO]

**Problema:** a tabela d20 da v0.20 tem faces **13 e 14 vazias**, além das faces 1 e 2. Com a tabela antiga, uma equipe de três participantes rolando e mantendo **3d20 cada** alcança DE 30 com **1,73%** de probabilidade (sem outras fontes, habilidades, equipamentos ou aprimoramentos). DE 30 pode ser excessiva para confrontos finais se o alvo de design for aproximadamente 50% em equipe.

**Protótipo de d20 em estudo:** manter faces 1–12 exatamente como na tabela v0.20 e modificar apenas:

| Face | Tabela v0.20 | Protótipo PROPOSTO |
|---:|---|---|
| 13 | vazio | 2E |
| 14 | vazio | 2E + 1A |
| 15 | 2A | 3E + 2A |
| **16** | **4P** | **4P (inalterada)** |
| 17 | E + 2A + P | 3E + A + P |
| 18 | 2E + 2A + 2P | 4E + A + P |
| 19 | 3E + 2A + 2P | 5E + 2A + P |
| 20 | 4E | 6E |

**Teto máximo DE 24 — PROPOSTO**, não substitui o teto aprovado 30 enquanto não houver decisão. A face 16 permanece extremamente arriscada por seus 4P.

**Benchmark exato** (enumerando símbolos por convolução; três participantes com **3d20 mantidos cada**, A convertido em E aos pares dentro de cada rolagem, sem anulações, itens, seleção de dados extras, custos ou Perícias):

| DE | d20 v0.20 | d20 protótipo |
|---:|---:|---:|
| 24 | 14,97% | **49,15%** |
| 26 | 8,07% | 35,78% |
| 30 | 1,73% | 15,17% |

Com o protótipo, três participantes **mantendo quatro d20 cada** alcançam **DE 24 em 89,61%** dos casos, antes de custos/efeitos. Para o trio de 3d20 em DE 24, o **acerto sem qualquer Pavor é de apenas 0,013%**; 49,15% de acerto não significa acerto sem risco. Este benchmark é intencionalmente restrito e **não valida** sozinho o teto ou os novos símbolos. Verificar também número médio de Pavor, Coragem inimiga, custos XP, dificuldade para adquirir d20, 9 dados rolados/4 mantidos e builds com d10/d12.

**PENDENTE:** decisão autoral sobre a nova face 20, a distribuição das demais faces, a eventual redução da DE máxima, DE 30 histórica de Ressurreição e integração com a curva de XP por nível. Enquanto isso, a **tabela d20 publicada v0.20 e DE máxima 30 permanecem vigentes**.


**Alternativa G — manter a DE máxima 30 e reforçar mais o d20 [PROPOSTO, não aprovado].** Em vez de reduzir imediatamente o teto para 24, outra hipótese é deslocar resultados úteis para faces mais baixas e aumentar o potencial do extraordinário. As **faces 1 e 2 continuam vazias** e a face **16 conserva 4P**; os demais dados não mudam.

| Face | d20 atual | Candidato G — PROPOSTO |
|---:|---|---|
| 1–2 | vazio | vazio |
| 3–4 | P | P |
| 5 | A+P | A+P |
| 6 | E | E |
| 7 | 2E | 2E+A |
| 8 | E+A | 2E+A |
| 9 | E+A+P | 2E+A+P |
| 10 | 2E+P | 2E+2A+P |
| 11 | E+2A+P | 2E+2A+P |
| 12 | 2P | 2P |
| 13 | vazio | 2E+2A |
| 14 | vazio | 3E+2A |
| 15 | 2A | 4E+2A |
| **16** | **4P** | **4P** |
| 17 | E+2A+P | 4E+2A |
| 18 | 2E+2A+2P | 5E+2A+P |
| 19 | 3E+2A+2P | 6E+2A+P |
| 20 | 4E | 8E |

**Comparação exata dos dois caminhos**, com três participantes, cada um mantendo exatamente três d20, convertendo 2A em 1E dentro de sua própria rolagem, sem escolher entre dados rolados adicionais:

| Cenário [PROPOSTO] | DE de referência | Chance total de atingir | Acerto Puro após anular P com A | Trio mantendo 4d20 cada |
|---|---:|---:|---:|---:|
| Protótipo anterior + teto 24 | 24 | **49,15%** | **3,47%** | **89,61%** |
| Candidato G + teto 30 | 30 | **49,07%** | **9,26%** | **89,34%** |

A taxa **0,013%** citada acima para o protótipo anterior significa **não rolar Pavor algum em nenhum dado** no cenário de DE24, e não o verdadeiro **Acerto Puro após anulações por Antecipar**, que é aproximadamente **3,47%**. É essencial separar ausência bruta de P da ausência de P **residual**. Para a alternativa G, o resultado sem qualquer P nas faces é cerca de **0,073%**, mas o Acerto Puro após anulação é **9,26%**.

Com o candidato G, um único participante mantendo 4d20 tem máximo teórico **DE32** pelos símbolos (face 19 ou 20, ambos 8 pontos), mas **apenas 0,045%** de chance de atingir DE30 sem outros recursos. A meta de 50% é, portanto, **uma referência coletiva de três participantes com três dados mantidos cada**, não a probabilidade de um único chefe ou personagem. Se os três mantêm quatro d20, ambas as propostas aproximam 90%, mostrando que custos de Coragem, Pavor, PP e acesso efetivo a d20 precisam ser incluídos na decisão final.

**Recomendação de teste, não decisão autoral:** comparar o par **protótipo anterior + DE24** com o par **candidato G + DE30** em builds reais dos Marcos III e IV, observando também Pavor residual, acerto puro, dano e defesa. **Nenhuma das duas distribuições substitui o d20 oficial** e o teto **30 continua DEFINIDO** até aprovação expressa.

### 0-E.12. Prioridades de próximo balanceamento [PENDENTE]

1. Curva de XP total por nível/Marco e correspondência entre Grau humanoide e acesso a PP.
2. Probabilidades de **acerto puro, acerto normal com P residual, acerto com P dominante, falhas, dano e Pavor transferido**, não somente chance de alcançar DE.
3. Orçamentos de XP de inimigos simples, grupos e chefes compostos; custo e requisitos de cada d20, quatro d20 mantidos, economia de ações e ataques de oportunidade.
4. Integridade absoluta por armadura/escudo, proteção contra perfuração, resistências e ordem de resolução, inclusive Escudo Mágico.
5. Custos XP das Especialidades Elementais, slots, graduação do foco, conjuração pesada, combinações, efeitos simultâneos e catálogo de armas de fogo.
6. Revisão do Livro do Jogador e estudos de balanceamento após aprovação dos novos números; **não editar silenciosamente** suas regras nesta atualização exclusiva de SRD.

---

## Histórico integral da versão anterior (v0.20)

Este conteúdo fica arquivado para rastrear decisões anteriores. Se divergir da seção 0-E, **vale a seção 0-E**, que reflete as decisões mais recentes; propostas novas continuam não aprovadas.


# SRD de Continuidade v0.20 — histórico preservado

**Versão:** 0.20 — decisões recentes de profissões, Perícias, magia e armas  
**Data:** 8 de novembro de 2026  
**Precedência:** decisões recentes > seção normativa 0-D > v0.19 > versões anteriores.

> O histórico abaixo é preservado para continuidade, mas não revoga decisões recentes. Não confundir Codex RPG com Assimilação RPG.

## 0-D. Atualização normativa v0.20 — PP, profissões, Furtividade, Hemomancia e armas

A seção **0-D** prevalece sobre qualquer passagem contraditória das versões v0.19 e anteriores. **DEFINIDO** é decisão autoral; **EXPERIMENTAL** é valor em playtest; **PROPOSTO** não é regra oficial; **PENDENTE** requer decisão.

### 0-D.1. Pontos de Perícia [DEFINIDO]

- **PP são uma reserva global única:** níveis 1–4 têm **0 PP**; a partir do nível **5, 1 PP**; do **10, 2 PP**; do **20, 3 PP** (teto máximo). Comprar outras Perícias não amplia a reserva, apenas oferece novos usos. PP se recuperam **a cada troca de cena, fora de combate**, nunca por rodada.
- Uma ativação especial de Perícia custa **1 PP**, salvo a conversão extraordinária de um dado de **Inteligência em d20**, que custa **2 PP**. Coragem permanece independente e pode continuar aprimorando a rolagem; a compra da Perícia com XP não equivale ao pagamento de sua ativação.
- Perícias podem ter efeitos passivos, críticos ou alternativas expressas de uso com Coragem. **PENDENTE:** orçamento total de XP por Marco e interação dos 5 XP iniciais de Perícias com os 14 XP da criação antiga.

### 0-D.2. Crítico e Antecipar [DEFINIDO / bônus antigo PENDENTE]

- Crítico exige que **TODOS os dados efetivamente mantidos** (mínimo de dois, com ao menos um dado de Atributo) mostrem suas **próprias faces numéricas máximas**. É permitido manter menos que o limite autorizado para buscar o crítico. Todos os símbolos das faces críticas mantidas convertem-se em **Êxitos, um por símbolo**; descartes não contam.
- **Efeitos especiais de arma só ocorrem se o ataque atingir a DE.** O bônus histórico de **+1E e +1 Coragem** da versão anterior **não está confirmado** para acumular com a nova conversão e fica **PENDENTE**.
- O **Pavor adicional gerado pelos gastos do Cavaleiro do Terror** entra **depois da rolagem e da resolução do crítico**. Logo, esse Pavor **não** se converte em Êxitos pelo crítico.
- Antecipar reordena as oportunidades, mas **nenhum personagem pode ter seu turno antecipado mais de uma vez por rodada** ou atuar duas vezes por esse mecanismo. A intervenção inimiga continua possível pelas regras de Pavor.

### 0-D.3. Cavaleiro do Terror e Clérigo Acalmador [DEFINIDO / requisitos específicos PENDENTES]

- O **Cavaleiro do Terror**, vinculado a **Trevas**, pode interceptar Pavor dos aliados e mantê-lo em uma reserva com **teto 10P**, enquanto sua Coragem própria fica limitada a **1**. Pavor substitui Coragem pelos **mesmos custos e limites normais** de manutenção de dados, elevação de passos e capacidades. **Cada 1P gasto acrescenta +1P ao resultado da própria ação** após rolagem/crítico. É imune a **Apavorado**; suas ações continuam podendo permitir reação inimiga.
- O **Clérigo Acalmador**, vinculado a **Sagrado**, age primeiro, paga Coragem para preparar proteção, recebe **1A** para passar oportunidade e dedica Êxitos de sua rolagem ao suporte, não ao ataque. **Cada 1E reservado neutraliza as consequências de 1P de um aliado próximo**, sem apagar o símbolo: **P continua P e contribui normalmente à DE**, mas não é transferido ao inimigo enquanto protegido. Proteção pode ser distribuída entre aliados **durante a rodada inteira**, enquanto restarem Êxitos, e **expira ao fim da rodada**.
- O Clérigo pode atuar mesmo com medo e pode recuperar Coragem ao efetivamente proteger, mas **quantidade recuperada e custo exato em Coragem PENDENTES**. O Pavor que ele protege **não** pode simultaneamente ser absorvido pelo Cavaleiro; o Cavaleiro recebe Pavor não protegido e seu gasto gera **novo** Pavor que poderá alcançar os inimigos.

### 0-D.4. Ladino, fuga e ocultação [DEFINIDO / nova ativação PROPOSTA]

- Uma Perícia de Ladino permite **aproveitar Êxitos mesmo quando a ação principal falha**: **1E** permite fugir; cada E adicional aumenta a distância ou favorece uma nova ocultação conforme a dificuldade. **1A** pode desvencilhá-lo e **1E** permite correr. Uma nova rolagem de ocultação na mesma sequência **por 1 PP** está **PROPOSTA**, ainda não confirmada.
- Compara-se o resultado de **Furtividade** do Ladino à **DE defensiva de cada inimigo** (Agilidade e Destreza): DE maior → sabe onde está; DE menor → não sabe; DE igual → pode realizar busca ativa. Saber a posição não obriga o inimigo a persegui-lo.
- A **busca ativa** exige **reproduzir todas as faces numéricas mantidas pelo Ladino, incluindo repetições**, com os próprios dados mantidos do buscador (até quatro, se habilitado). É uma verificação aberta a jogador e Narrador, não arbitrária. Contra alvo efetivamente oculto, atacar usa **Furtividade como referência**, não a DE defensiva usual.
- Busca ou ataque à distância são possíveis, mas o afastamento aplica desvantagens, podendo chegar à **Desvantagem Absoluta**. Fuga física não é ocultação mágica. Ocultação elemental avançada depende de **Inteligência, Conjuração e elementos disponíveis no ambiente**; técnicas específicas e distâncias permanecem **PENDENTES**.

### 0-D.5. Sangramento, Hemomancia e transferência de Pavor [DEFINIDO]

- **Sangramento é um estado de abertura por onde o sangue pode fluir**, não hemorragia, dano por tempo ou perda de Vida automática. Hemomante pode autoaplicar Sangramento sem lesar a Vida. Logo, o requisito histórico de causar dano direto à Vida para obter sangue **não é mais universal**.
- **Somente o Hemomante** possui as técnicas discutidas de **conter perda de Vida e cura de Vida**, com especialização em **Inteligência, Destreza e Agilidade**. Técnicas não garantem sobrevivência; golpes letais/colossais são difíceis.
- **Contenção, custo 1 PP:** após o ataque inimigo determinar o dano, antes de consolidar a perda de Vida, Hemomante usa **o sangue do próprio aliado, sem custo de Vida própria**. Rola para neutralizar **1E contra 1E**, **1P contra 1P**, e **1E convertido de 2A contra 1E**. Recalcula dano corporal a partir do ataque residual e só então a faixa de Vida. Exemplo: aliado com 2 Vida que sofreria 9 de dano (3 Vida perdidas) pode sobreviver com 1 Vida se a contenção reduzir o dano residual a 5 (1 Vida perdida).
- **Cura especial, custo 1 PP:** é uma magia **separada** que executa teste normal contra **DE igual ao dano do ataque** (por exemplo DE 9 para dano 9), em vez de neutralização proporcional. **PENDENTE:** quantificação exata da cura/restauração e limites contra colossais.
- **TODO Pavor mantido na rolagem de contenção**, incluindo o **utilizado para neutralizar Pavor do inimigo**, é transferido aos inimigos. A consequência da transferência não é apagada pela neutralização proporcional. Respeita-se o **teto local por grau** e o **teto público do Narrador = 2 + número de jogadores**. O Pavor mantido pelo inimigo pode igualmente gerar Coragem aos jogadores conforme regra normal. Não confundir com a anulação comum do próprio Pavor por 1A.
- Ação conjunta pode apoiar a intervenção (até três participantes); aliados podem carregar o ferido ou protegê-lo fisicamente. A ajuda pode gerar Pavor, e o inimigo continua podendo reagir; Hemomancia não suspende oportunidades adversárias.

### 0-D.6. Habilitação elemental, grau e espaços [DEFINIDO / numeração de slots PROPOSTA]

| Compra de habilitação elemental | XP [DEFINIDO] |
|---|---:|
| **Sagrado** | **6 XP** |
| **Trevas** | **5 XP** |
| **Sangue** | **4 XP** |
| **Psique** | **3 XP** |

A compra é **somente a habilitação**, não a Perícia de utilização nem a autorização para conjurar abaixo do grau permitido. Permanecem os mínimos de grau já estabelecidos (inclusive os de **Trevas e Sangue**). As técnicas mais fortes são pensadas para personagens avançados, aproximadamente nível 10, sem transformar isso num requisito universal que não foi aprovado. **PENDENTE:** harmonizar a antiga disponibilidade inicial de Psíquico para Aprendizes com a nova compra de Psique por 3 XP.

**DEFINIDO como princípio:** magias de grau maior ocupam mais espaço **proporcionalmente ao grau**; composição de dados e espaços de magia são economias distintas. **PROPOSTO, não confirmado:** 1/2/3/4 slots para graus 1/2/3/4.

### 0-D.7. Efeitos de armas e propriedades combinadas [DEFINIDO como direção / catálogo PENDENTE]

- **Cortante:** pode causar **Sangramento (estado, não dano por tempo)**. **Perfurante:** pode atingir **Vida diretamente**, ignorando integridade de armadura equipada; ainda limitado a **até 3 Vida por ataque não colossal**. **Pesada:** pode **derrubar**. **Longa:** pode gerar **Antecipar especial no crítico**, para desengajar/empurrar ou aumentar dano conforme técnica (valores PENDENTES).
- Esses efeitos exigem **acerto** e respeitam imunidades. Também podem ser ativados sem crítico por Perícia (ativação normal 1 PP, ou alternativas específicas usando Coragem); manobras podem exigir **teste próprio contra a DE do alvo**.
- Propriedades podem se **combinar**: machado cortante-pesado; facas perfurantes; **lança pesada de duas mãos**, sem possibilidade de escudo, com eventual **escolha entre empurrar e perfurar** no crítico. Esses exemplos são **PROPOSTOS/EM CONCEPÇÃO**, não fichas publicadas. Seleção, custos, modificadores e imunidades detalhadas são PENDENTES.
- **Armas de fogo** permanecem em concepção. Neutralidade de afinidade, dados consumidos por disparo, recarga e alcance **não são procedimentos finais aprovados** e devem ser analisados antes das armaduras.

### 0-D.8. Armaduras, XP e pontos ainda em análise [EXPERIMENTAL / PENDENTE]

Sem alteração numérica nesta edição: armadura leve **+1 DE [EXPERIMENTAL]**, média **+0 DE**, pesada **+0 DE** com requisitos usuais ou **−2 DE** abaixo deles, integridade proporcional **1:2:4 [EXPERIMENTAL]**. Permanecem **PENDENTES** integridade absoluta por grau, XP por Marco, possível volta do bônus maior da armadura leve, efeitos críticos extra (+1E/+1 Coragem), testes e catálogo final de armas híbridas e armas de fogo.

## REFERÊNCIA HERDADA — SRD v0.19 (histórico integral)

## 0-C. Correções normativas da v0.19

### 0-C.1. XP inicial de Perícias [DEFINIDO; soma de orçamentos sujeita a validação]

- **[DEFINIDO]** A reserva inicial destinada à compra de **Perícias passa a 5 XP**, para que o Aprendiz tenha acesso às capacidades que definem seu estilo desde a criação. A referência anterior a 3 XP iniciais de Perícias está superada.
- **[HIPÓTESE DE PLAYTEST]** Se a criação conservar os **14 XP de Base + Formação (7+7)** e acrescentar a reserva de **5 XP de Perícias**, o personagem inicia com **19 XP totais** para comparar orçamento de grupo e inimigos. Caso a reserva de Perícias seja uma redistribuição interna, o total será diferente; essa relação de orçamentos não foi explicitamente encerrada.
- Não aumentar automaticamente a quantidade de dados mantidos: níveis 1–5 mantêm dois naturalmente e podem manter o terceiro gastando 1 Coragem.

### 0-C.2. Progressão exclusiva dos Atributos de monstros não humanoides [DEFINIDO]

- **[DEFINIDO — correção expressa]** Monstros **compram d10 diretamente no grau 1 de seus Atributos**, e não o d6 da progressão de Atributos humanos.
- **[DEFINIDO]** A progressão monstruosa de Atributos segue integralmente **a mesma tabela de XP e dados de Conhecimentos e Práticas**, incluindo acesso a d12 nos graus altos.
- **[REVOGADO]** O custo monstruoso antigo `0 / 1 / 3 / 7 / 15 / 31 / 55 XP`, típico de Atributos de jogador, **não se aplica aos monstros**. Também fica revogada a descrição de que essa escala monstruosa até d12 seria apenas uma alternativa experimental; o sistema de compra de d10/d12 por essa tabela foi confirmado pelo autor.
- **[DEFINIDO]** Não alterar com essa regra a progressão dos Atributos de jogadores: grau 1 humano ainda oferece **1d6** pelo custo de **1 XP**.

| Grau do Atributo monstruoso | Dados | XP deste avanço | XP acumulado |
|---:|---|---:|---:|
| 0 | 1d4 | 0 | 0 |
| 1 | **1d10** | 2 | 2 |
| 2 | **2d10** | 6 | 8 |
| 3 | **3d10** | 12 | 20 |
| 4 | **2d10+1d12** | 18 | 38 |
| 5 | **1d10+2d12** | 28 | 66 |
| 6 | **3d12** | 36 | **102** |

**Exemplo — criatura de 18 XP:** Força 2 (**8 XP**, 2d10), Agilidade 2 (**8 XP**, 2d10), Vigor 1 (**2 XP**, 1d10); Destreza 0. Ela dispõe de **4d10** para uma ação pertinente que combine Força e Agilidade, respeitando o teto global de nove rolados e a retenção normal de **dois dados**, ou maior apenas quando o grau e os gastos permitirem. Pela fórmula comum, tem **Vida 5** e **DE 2** antes de qualquer modificação natural.

**Consequência em graus altos:** quatro Atributos monstruosos no grau 6 custam **408 XP**, e não os 220 XP calculados pela antiga tabela humana. A compra única de um d20 permanente por **100 XP**, condicionada a grau 6 e Atributo grau 6, exige pelo menos **202 XP** no Atributo relevante e no d20, ou **508 XP** no exemplo com quatro Atributos grau 6 e um d20. A disponibilidade desse orçamento por grau de monstro permanece **PENDENTE**.

### 0-C.3. Vida e DE como proteção natural dos monstros [DEFINIDO]

- **[DEFINIDO]** Todas as criaturas começam com **Vida-base 3**, **exceto criaturas pequenas**, que seguem a exceção própria. **[PENDENTE]** Publicar o valor específico da exceção para criaturas pequenas, se ainda não estiver definido na respectiva ficha.
- **[DEFINIDO]** A robustez natural dos monstros já é representada pela **Vida máxima = 3 + Vigor + ⌊Força/2⌋**. Não criar uma barra separada de armadura natural, integridade natural extra ou multiplicador de Vida por grau. **A armadura efetivamente equipada**, quando houver, segue separadamente as regras de equipamentos.
- **[DEFINIDO]** Um monstro com **Vigor 6 e Força 6** tem **12 Vida**. Se for **grau 6** e comprar seu **único d20 permanente de 100 XP em Vigor**, obtém **+1 Vida máxima**, chegando a **13 Vida**. Comprar esse d20 em outro Atributo não concede o bônus de Vigor. O bônus é uma exceção específica ao máximo ordinário de 12.
- **[DEFINIDO]** O limiar de dano colossal num único ataque é **3 × Vida máxima do alvo**. Assim, **12 Vida → 36 de dano corporal**; **13 Vida → 39 de dano corporal**, ambos após eventuais armaduras efetivamente equipadas. O limiar não impede dano cumulativo por ataques comuns.
- **[DEFINIDO]** Monstros elevam naturalmente a **DE defensiva = Agilidade + ⌊Destreza/2⌋** ao investir XP nesses Atributos, em vez de ganhar um bônus gratuito de esquiva por grau. Exemplos: Agilidade 2 + Destreza 0 → **DE 2**; Agilidade 4 + Destreza 2 → **DE 5**; Agilidade 6 + Destreza 6 → **DE 9**, antes de equipamento.
- **[DEFINIDO]** A melhoria de Vida, DE e capacidade ofensiva compete pelo mesmo orçamento de XP monstruoso. O grau do monstro também limita sua reserva local de Pavor.
- **[EXPERIMENTAL]** A escala intermediária que converte dano corporal em 1, 2 ou 3 pontos de Vida continua em teste. **Cinco pontos de Vida não garantem cinco ataques necessários para matar**: um golpe comum pode retirar até três pontos de Vida.

| Exemplo | Vida máxima | Limiar de colossal | DE natural, se Atributos indicados |
|---|---:|---:|---:|
| Força 2, Vigor 1, Agilidade 2, Destreza 0 | 5 | 15 | 2 |
| Força 6, Vigor 6, Agilidade 4, Destreza 2 | 12 | 36 | 5 |
| Mesmo monstro, com d20 permanente comprado em Vigor | **13** | **39** | 5 |

### 0-C.4. Comparação exata para o playtest de nível 1 [ANÁLISE; não é regra]

**Hipóteses:** faces atuais de d6 e d10; seleção ótima de até dois ou três dados mantidos, exigindo pelo menos um dado de Atributo; 2A→1E; anulação própria de Pavor para acertos limpos; crítico +1E em dois dados de face máxima. Percentuais **exatos**, enumerando todas as combinações equiprováveis. Os percentuais de acerto total incluem decisões que conservam Pavor e concedem Coragem ao outro lado. Não consideram custo de ativação nem armadura eventualmente equipada no cálculo de dano.

**Monstro de referência com 18 XP:** Força 2, Agilidade 2 e Vigor 1, atacando de modo pertinente com **4d10** e mantendo **dois dados**. Para uma criatura de grau 1, a reserva local tem teto **1P**. O acesso prático ao terceiro dado mantido depende de como o custo de ativar e aprimorar é pago; **não presumir retenção de três gratuita**.

| Configuração | DE 2 (total/limpo) | DE 3 (total/limpo) | DE 4 (total/limpo) | DE 5 (total/limpo) |
|---|---:|---:|---:|---:|
| Monstro: 4d10, mantém 2 | **98,24% / 64,76%** | **83,11% / 36,68%** | **56,95% / 5,23%** | **24,84% / 0%** |
| Monstro: 4d10, mantém 3 *se puder pagar* | 98,24% / 64,76% | 92,56% / 41,48% | **77,99% / 19,90%** | 55,59% / 5,87% |
| Humano ofensivo: 3d6+2d10, mantém 2 | **97,30% / 39,92%** | **65,07% / 14,01%** | **25,46% / 0%** | 8,00% / 0% |
| Humano ofensivo: 3d6+2d10, mantém 3 *com 1 Coragem* | 98,22% / 46,14% | 91,59% / 23,32% | **64,93% / 8,92%** | 33,56% / 2,60% |

**Importante:** a pilha humana `3d6+2d10` representa um Aprendiz que investiu em Atributo e em fontes de Formação e adquiriu a Perícia que habilita uma terceira fonte pertinente; não equivale a conceder essa pilha a todos os Aprendizes. O exemplo de defesa **DE 4** presume um **outro personagem defensivo**, com Agilidade 2, Destreza 2 e armadura leve +1 DE [EXPERIMENTAL], não o mesmo personagem que investiu todo seu XP de Base em Força 3.

**Interpretação:** o monstro com 4d10 não é incapaz de acertar um esquivador inicial de DE 4: acerta potencialmente em **56,95%** dos ataques com dois mantidos. Mas quase todos esses acertos conservam Pavor, gerando **Coragem aos jogadores**. A criatura pode escolher uma ação menos arriscada. A mesma ameaça tem **Vida 5, sem segunda barra de armadura natural**, então sua duração depende de acertos *efetivos* e não de um número fixo de turnos.

### 0-C.5. XP total e matriz de encontros [ANÁLISE; parâmetros PENDENTES]

Se, **somente como hipótese de playtest**, cada Aprendiz tiver **19 XP** (14 + 5 de Perícias), então três, quatro e cinco jogadores somam, respectivamente, **57, 76 e 95 XP**. Três, quatro e cinco monstros de **18 XP** somam **54, 72 e 90 XP**: **ficam abaixo do grupo** e, pela regra atual de recompensa, não dão XP pelo enfrentamento. Para alcançar ou superar o XP total do grupo com monstros deste modelo, seriam necessários **4, 5 ou 6 monstros**, respectivamente. Isso **não os torna automaticamente encontros Perito**: a quantidade de ativações e a economia de Pavor devem ser simuladas.

**PENDENTE:** orçamento de XP de cada grau de monstro, exceção da Vida-base de criaturas pequenas, custo completo das ativações grau 1, frequência real de Coragem e fórmula de recompensa/ranqueamento Aprendiz–Perito–Elite–Divino. Não publicar uma matriz definitiva de quantidades antes desses parâmetros.

---

## REFERÊNCIA HERDADA — SRD v0.18 (histórico integral)

As referências herdadas a custos monstruosos de **55 XP por Atributo grau 6**, a monstros grau 1 com **d6 comprado em Atributos**, ou a **3 XP iniciais de Perícias**, estão **REVOGADAS** pela seção **0-C** da v0.19 acima.

---

# CODEX RPG — SRD DE CONTINUIDADE

**Versão:** 0.18 — retificações de Marcos, equipamento, Pavor e companheiros  
**Data:** 8 de novembro de 2026  
**Precedência:** decisões explícitas mais recentes > seção normativa v0.18 > seção normativa v0.17 > conteúdo histórico da v0.16 > edições anteriores.  
**Estados:** DEFINIDO (aprovado), EXPERIMENTAL (playtest), PROPOSTO (alternativa), PENDENTE (sem procedimento fechado).

> O histórico abaixo é conservado para rastreabilidade, mas as instruções revogadas **não são vigentes**. Codex RPG é um sistema independente. Não importar mecânicas, símbolos ou recursos de Assimilação RPG.

## 0-B. Retificações normativas da v0.18

### 0-B.1. Marcos, retenção e Coragem [DEFINIDO]

- **[DEFINIDO]** Até o nível 5, o personagem mantém **2 dados naturalmente**; pode gastar **1 Coragem** para manter **um terceiro** na mesma ação.
- **[DEFINIDO]** A partir do nível 6, o personagem mantém **3 dados naturalmente**; pode gastar **1 Coragem** para manter **um quarto**, respeitando a disponibilidade da pilha.
- **[DEFINIDO]** Marcos III e IV não ampliam novamente a retenção comum: representam avanço de poder, acúmulo de habilidades e especializações. Portanto, a exigência histórica de esperar até o Marco IV ou comprar uma habilidade exclusiva para alcançar o quarto dado é **REVOGADA**.
- **[DEFINIDO]** O teto absoluto continua em **4 dados mantidos** por participante e **9 dados rolados na pilha total**, mesmo quando armas, ferramentas e magias oferecem muitos dados. É permitido manter menos que o máximo. Ao menos um dado mantido deve vir de um Atributo.
- **[DEFINIDO]** Manter o dado extra é uma opção por rolagem, não uma modificação permanente da ficha. O custo consome Coragem normalmente; manter o quarto dado não exige pagar duas vezes por já ter obtido três naturais.
- **[PENDENTE]** Casos de exceções particulares explicitamente descritas em habilidades; não inventar bônus de retenção de Marco III/IV.

| Níveis | Retenção natural | Retenção com 1 Coragem |
|---|---:|---:|
| 1–5 (Marco I) | 2 | **3** |
| 6–10 (Marco II) | 3 | **4** |
| 11–15 (Marco III) | 3 | **4** |
| 16–20 (Marco IV) | 3 | **4** |

**Exemplo:** um Aprendiz de nível 4 que reúna 6 dados rola os seis e mantém 2, ou 3 gastando 1 Coragem. No nível 6, naturalmente mantém 3 e pode manter 4 gastando 1 Coragem; o Marco III não aumenta esse teto.

### 0-B.2. Peso, composição de dados e dados rolados [DEFINIDO / PENDENTE]

- **[DEFINIDO]** Armas, ferramentas especiais e conjurações podem oferecer **quantidades variáveis de dados para rolar** conforme a composição permitida por seus pontos de peso, custos e tetos próprios. Uma arma pode privilegiar muitos d4 ou menos dados maiores. Esses dados entram na **pilha total de até 9** e não aumentam por si sós o número mantido.
- **[DEFINIDO]** A composição do equipamento não fica artificialmente limitada a três dados se o peso comporta mais d4; prevalece o teto global de nove dados rolados e os requisitos de uso.
- **[DEFINIDO]** A tabela de peso por dado passa a ser `d4 = 0,5`, `d6 = 1`, `d10 = 2`, `d12 = 3`, **`d20 = 6`**. A antiga tabela com d20 = 5 fica **REVOGADA**.
- **[DEFINIDO]** Arma **pesada** de **grau 2 tem peso 3**; **grau 3, peso 5**; **grau 4, peso 7**.
- **[DEFINIDO]** A mesma lógica de peso se aplica às composições de **conjurações** e de **ferramentas especiais**, sob seus próprios limites de grau, fonte, requisito e habilitação.
- **[PENDENTE]** Os pesos de armas de outras categorias e graus, a interação com múltiplos equipamentos e qual capacidade habilita dados extraordinários em cada tipo. O fato de uma arma de grau 4 poder comportar um d20 no orçamento **não concede acesso automático ao d20** sem habilitação.
- **[DEFINIDO]** Focos elementais (água, terreno, sangue, item sagrado etc.) **não concedem dados por si**: são condições para a conjuração. Diferenciar componente ambiental da composição comprada da magia.

| Dado | Peso |
|---|---:|
| d4 | 0,5 |
| d6 | 1 |
| d10 | 2 |
| d12 | 3 |
| d20 | **6** |

| Arma pesada | Peso | Exemplos dentro do orçamento (sujeitos ao teto global da pilha) |
|---|---:|---|
| Grau 2 | 3 | `6d4`, `3d6`, `1d12` |
| Grau 3 | 5 | `2d10+1d6`, `1d12+1d10` |
| Grau 4 | 7 | `2d12+1d6`, `1d20+1d6` **se houver habilitação de d20** |

**Exemplo:** `3d10` de Atributo + `6d4` de arma pesada grau 2 formam 9 dados rolados; somente 2, 3 ou 4 serão mantidos de acordo com o nível e eventual gasto de Coragem. O mesmo peso 3 pode ser usado em um único d12, oferecendo menos escolha porém um dado de maior potencial.

### 0-B.3. Distribuição de Coragem [DEFINIDO / PENDENTE no desempate]

- **[DEFINIDO]** Pavor não anulado de dados **mantidos** pelo inimigo gera Coragem para jogadores na proporção vigente, **1P → 1 Coragem**.
- **[DEFINIDO]** A Coragem é destinada ao **jogador atacado** ou aos **aliados mais próximos do inimigo**, de acordo com quem recebeu ou assumiu o risco da ação; não distribuir automaticamente a integrantes distantes.
- **[PENDENTE]** Ordem formal de prioridade quando há simultaneamente alvo atacado e múltiplos aliados equidistantes, divisão de vários pontos e desempates. Não inventar repartição proporcional.
- A Coragem permanece sujeita ao limite individual e às demais regras da reserva; Pavor anulado com Antecipar não conta.

### 0-B.4. Reserva pública de Pavor e ação conjunta hostil [DEFINIDO]

- **[DEFINIDO]** O antigo limite geral de **gastar apenas 1P público por oportunidade** está **REVOGADO**. O Narrador pode pagar um custo público válido integralmente de uma só vez quando o gatilho estiver habilitado. Isso **não** elimina o teto da reserva pública nem concede oportunidades ilimitadas de ação.
- **[DEFINIDO]** A reserva pública do Narrador conserva seu teto de **2 + número de jogadores** e saldo entre sessões, segundo a regra anterior. Seus usos atualmente identificados são **iniciar conflitos** após sucessivas falhas dos jogadores e **habilitar ações conjuntas de inimigos com Líder**.
- **[DEFINIDO]** Para realizar uma ação conjunta de monstros/inimigos, até três participantes, o Narrador paga **3P públicos instantaneamente** e ao menos **um participante deve possuir a característica Líder**. O gasto não substitui as condições e os custos de ativação dos participantes; a ação pode falhar.
- **[DEFINIDO]** Os jogadores não pagam Pavor para realizar ações conjuntas de até três participantes. O dano conjunto constitui **um único impacto** após a resolução coletiva da DE.
- **[PENDENTE]** O preço específico e gatilhos formais para iniciar conflitos, detalhes de como cada monstro financia sua participação, compartilhamento de Antecipar/críticos e regras finas de Pavor na ação conjunta. A existência de um Líder não concede automaticamente sucesso ou dano colossal.
- **[DEFINIDO]** Antecipar gasto para passar protagonismo **só passa a oportunidade**, não é uma ação conjunta gratuita.

### 0-B.5. Dano e faixas da Saúde [DEFINIDO]

- **[DEFINIDO]** `Dano = Êxitos + ⌊Pavor não anulado / 2⌋`, usando os símbolos aplicáveis após as conversões; **arredondamento para baixo**. Esta fórmula deixa de ser experimental.
- **[DEFINIDO]** A armadura absorve primeiro a integridade restante. Um ataque **não colossal** pode retirar **no máximo 3 Vida**; dano **colossal** num único ataque que atravesse a armadura e alcance `3 × Vida máxima` ainda provoca morte instantânea.
- **[DEFINIDO]** Dividir a Vida máxima entre os três estados **Saudável / Machucado / Incapacitado**. Quando não é múltipla de três, a divisão usa grupos inteiros e atribui as sobras às faixas anteriores, do mais saudável ao mais grave (por exemplo **4 → 2/1/1**, **5 → 2/2/1**, **7 → 3/2/2**). Isto formaliza a regra de arredondamento inferior e as sobras na faixa anterior.
- **[EXPERIMENTAL]** A conversão integral de cada quantidade de dano corporal em 1, 2 ou 3 pontos de Vida continua em teste, exceto o exemplo confirmado `9 de dano corporal → 3 Vida`.
- **[PENDENTE]** A interação de efeitos devastadores separados com essa escala e o custo exato de agir incapacitado.

| Vida máxima | Saudável | Machucado | Incapacitado |
|---:|---:|---:|---:|
| 3 | 1 | 1 | 1 |
| 4 | **2** | **1** | **1** |
| 5 | 2 | 2 | 1 |
| 7 | 3 | 2 | 2 |
| 12 | 4 | 4 | 4 |

### 0-B.6. Perícias de Domar Animais [DEFINIDO]

| Perícia | Custo | Requisitos |
|---|---:|---|
| Domar Animal Pequeno | **2 XP** | **Influência 1** |
| Domar Animal Médio | **3 XP** | Influência 2 |
| Domar Animal Grande | **4 XP** | Influência 3 |
| Domar Animal Exótico, Gigante ou Alado | **5 XP** | **Influência 6 e Inteligência 3** |

As habilitações de **Montar Animais** continuam separadas e não mudam com a revisão de Domar. Animais e montarias com ficha própria podem usar armaduras normais.

### 0-B.7. Observações de balanceamento [EXPERIMENTAL — não são novas regras]

**Metodologia.** Simulação computacional de **100.000 rolagens independentes por cenário**, com tabelas de faces oficiais, d4/d6/d10/d12/d20; retenção de até 2, 3 ou 4 dados, conforme a hipótese, exigindo ao menos um dado de Atributo. Para a chance máxima de alcançar a DE, o jogador escolhe entre subconjuntos permitidos, pode converter 2A em 1E, considera o +1E do crítico e conserva Pavor quando ele ajuda a atingir a DE. Isto é **limite de eficácia para quem prioriza acerto**, não descreve automaticamente acerto limpo nem gasto de recursos da ficha. Erro amostral no pior caso aproximadamente **±0,31 ponto percentual (95%)**.

| Pilha hipotética | Manter | Atingir DE 7 | Atingir DE 10 |
|---|---:|---:|---:|
| `3d6+3d10` | 3 | 8,16% | 0% |
| `3d6+3d10` | 4 | 27,58% | 1,14% |
| `3d6+6d10` | 3 | 26,26% | 0% |
| `3d6+6d10` | 4 | **64,69%** | **10,39%** |
| `3d10+6d12` | 3 | 67,87% | 1,93% |
| `3d10+6d12` | 4 | **92,36%** | **38,35%** |
| `9d12` (monstro, exemplo) | 4 | 95,06% | 47,55% |
| `1d20+8d12` (monstro, exemplo) | 4 | 95,57% | 56,26% |

**Cuidado:** as pilhas são hipóteses matemáticas que dependem de XP, fontes, presença de equipamentos e capacidades válidas. O ganho na DE não representa acertos limpos; uma seleção que maximize DE pode reter muito Pavor. Para `3d6+6d10`, a melhor seleção para DE com três dados contém algum Pavor em cerca de **91,35%** das rolagens e com quatro, em cerca de **95,64%**; isso é custo tático, não erro.

**Composição de peso 3:** com uma base de Atributo `3d10`, uma arma de `6d4` (peso 3) produz cerca de **51,26%** de chance de alcançar DE 7 com quatro dados mantidos; uma arma de `1d12` (também peso 3) produz **27,39%**. Comparação isolada; não prova que a arma de seis d4 seja superior em todos os confrontos. A arma mais fragmentada consome mais do teto de nove dados e pode elevar o Pavor mantido; equipamentos, especializações e dano devem ser avaliados em conjunto.

**Pavor e liderança:** com três jogadores a reserva pública do Narrador tem teto **5P**, e uma ação conjunta custa **3P** (60% da capacidade total). A disponibilidade efetiva de Pavor público, a sobrevivência de um Líder e o custo de oportunidade de ativar inimigos ainda precisam ser medidos em simulações de encontro. Não presumir que três inimigos possam atacar juntos em toda oportunidade.

**Recomendação para o próximo playtest:** medir frequência de Coragem suficiente para a quarta retenção; chance de atingir a DE com e sem Pavor; ganho de Pavor local e Coragem da seleção; vantagem real de armas de muitos d4 versus poucos dados grandes; tempo necessário para o Narrador reunir 3P públicos; efeito de eliminar o Líder. **Não** reforçar a esquiva/armaduras novamente sem observar essas interações.

### 0-B.8. Revisão multiescala de balanceamento: DE 3 até DE 30 [ANÁLISE / EXPERIMENTAL]

**Motivação:** não avaliar precisão apenas na DE 7. O Codex possui dificuldades de escala baixa, defesa individual e desafios coletivos extraordinários. Os números desta seção **não modificam regras** nem autorizam bônus de equipamentos.

**Método:** Monte Carlo com **100.000 rolagens por pilha**, respeitando as faces da seção normativa, crítico por duas faces máximas, conversão 2A → 1E, no máximo nove dados rolados e quatro mantidos, sendo ao menos um dado de Atributo. Um personagem pode manter menos dados para evitar Pavor. Para cada rolagem, foram examinadas todas as escolhas válidas de dados mantidos. Tabela de **acerto máximo** = possibilidade de escolher um resultado que alcance a DE, mesmo conservando Pavor; tabela **acerto limpo** = possibilidade de atingir a DE após anular todo o próprio Pavor com Antecipar. Não pressupõe bônus de Perícias, armas, Coragem gratuita ou custos de Pavor já disponíveis. Erro estatístico máximo aproximadamente ±0,31 ponto percentual a 95%.

#### A. Acerto individual, considerado o risco

Cada célula mostra **acerto limpo / acerto total possível**, em porcentagem. Se o acerto total supera o limpo, a diferença é a frequência em que só se acerta **conservando Pavor**.

| Pilha / retenção | DE 3 | DE 5 | DE 7 | DE 9 | DE 10 | DE 11 | DE 12 | DE 15 | DE 20 | DE 30 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Aprendiz 6d6 / 2 | 22,1/41,3 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |
| Aprendiz 6d6 / 3 (Coragem) | 25,9/90,4 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |
| Híbrido 3d10+6d12 / 3 | 89,2/100 | 35,0/97,2 | 0/68,0 | 0/13,2 | 0/1,9 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |
| Híbrido 3d10+6d12 / 4 (Coragem) | 90,5/100 | 65,4/99,6 | 11,4/92,4 | 0/62,2 | 0/38,4 | 0/17,6 | 0/5,2 | 0/0 | 0/0 | 0/0 |
| Monstro 9d12 / 4 | 91,0/100 | 67,1/99,8 | 10,1/95,0 | 0/70,7 | 0/47,6 | 0/22,7 | 0/4,3 | 0/0 | 0/0 | 0/0 |
| Monstro 1d20+8d12 / 4 | 92,4/100 | 70,6/99,8 | 17,7/95,6 | 1,8/75,2 | 0,1/56,0 | ~0/34,8 | ~0/17,1 | 0/0,7 | 0/0 | 0/0 |
| Monstro 3d20+6d12 / 4 | 94,4/100 | 76,8/99,8 | 31,4/96,7 | 7,3/82,4 | 2,2/69,1 | 0,9/53,7 | 0,6/38,0 | 0/7,5 | 0/0 | 0/0 |

**Interpretação-chave:** monstro 9d12/4 pode alcançar DE 10 em **47,6%**, porém **0% desses acertos é limpo sem bônus externos**. Para acertar, ele necessariamente deixa Pavor não anulado e concede Coragem, embora esse mesmo Pavor também ajude na DE e no dano. Um inimigo inteligente pode preferir outro alvo, outra ação ou até uma falha limpa, em vez de insistir em alimentar a Coragem dos defensores. Não equiparar 47,6% de acertos possíveis a 47,6% de ataques que o Narrador racionalmente escolheria fazer.

A presença de d20 permite alguns resultados limpos maiores, mas não elimina o problema: com 3d20+6d12/4 contra DE 11, **53,7%** das rolagens poderiam acertar; apenas **0,9%** apresentam opção de acerto limpo. Habilidades que deem Êxitos sem Pavor mudariam o quadro e devem ser testadas separadamente.

#### A.1. Quatro desfechos para um monstro que prioriza acertar sem Pavor, quando possível

A política computacional deste exemplo prefere **acerto limpo**, depois **acerto com Pavor**; se nenhum acerto for possível, prefere **falha limpa** à falha com Pavor. O Narrador pode racionalmente preferir **falha limpa até mesmo quando existe um acerto arriscado**, a depender do custo de conceder Coragem.

| Pilha contra DE 10 | Acerto limpo | Acerto com Pavor | Falha limpa | Falha com Pavor inevitável |
|---|---:|---:|---:|---:|
| Monstro 9d12, 4 mantidos | **0%** | **47,6%** | **51,8%** | **0,6%** |
| Monstro 1d20+8d12, 4 mantidos | **0,1%** | **55,9%** | **43,6%** | **0,4%** |
| Monstro 3d20+6d12, 4 mantidos | **2,2%** | **66,9%** | **30,7%** | **0,2%** |

**Limitação decisiva:** estes números **não** dizem a decisão real do Narrador em cada rolagem; mostram o que seria alcançável seguindo a prioridade indicada. O custo de gerar Coragem e a necessidade de causar dano precisam definir uma política de seleção mais realista em playtest. Falhar sem Pavor não equivale a perder Vida ou conceder ação extra por si só, mas consome a oportunidade do inimigo.

#### B. Saúde e custo da quarta retenção

Com 3d10+6d12, quatro dados mantidos e DE 10, a chance máxima de acerto (incluindo Pavor) é **38,4% quando Saudável**, **17,6% quando Machucado (−1E)** e **5,2% quando Incapacitado (−2E)**. Trata-se de deslocamento na DE efetiva, **10 → 11 → 12**, sob essa hipótese de efeitos sem modificadores adicionais. Portanto, investir Coragem no quarto dado pode ser racional para evitar dano e penalidades futuras. Não presumir Coragem inesgotável; acompanhar sua geração por Pavor dos inimigos e o limite individual.

#### C. Comparação de armas por peso em várias DE

Hipótese: mesma base **3d10** de Atributo; comparar arma pesada grau 2 com **6d4 (peso 3)** ou **1d12 (peso 3)**; quatro dados mantidos. **Acerto máximo**, incluindo Pavor:

| Pilha | DE 5 | DE 7 | DE 9 | DE 10 | DE 11 | DE 12 |
|---|---:|---:|---:|---:|---:|---:|
| 3d10+6d4 | 87,8% | **51,4%** | **10,8%** | 2,6% | 0,3% | 0% |
| 3d10+1d12 | 67,0% | 27,7% | 6,0% | 2,2% | **0,7%** | **0,2%** |

**Conclusão:** dados pequenos numerosos favorecem consistência em dificuldades acessíveis; um dado grande preserva maior teto em dificuldades altas. A análise com DE 7 isolada favorecia indevidamente a primeira composição. Comparar também integridade, dano, crítico, Pavor e espaço na pilha antes de alterar custos.

#### D. DE 30 coletiva, sem confundir com dano colossal

Sob a hipótese **EXPERIMENTAL** de três participantes, cada um com sua própria pilha de nove dados e até quatro mantidos, os resultados individuais máximos da DE são somados **após conversão de seus próprios A**. Os resultados abaixo são **probabilidades condicionais de completar a rolagem**, **não** chances de reunir os recursos, sobreviver ou habilitar a ação conjunta. Para inimigos, somam-se o custo de **3P públicos**, a característica **Líder**, oportunidades de ativação e demais custos.

| Três participantes idênticos | Atingir DE 20 | Atingir DE 30 | Atingir DE 30 sem Pavor |
|---|---:|---:|---:|
| Cada um 9d10, mantém 4 | 96,1% | **9,6%** | ~0% |
| Cada um 9d12, mantém 4 | 99,8% | **26,8%** | **0%** |
| Cada um 1d20+8d12, mantém 4 | 99,9% | **47,7%** | **0%** |
| Cada um 3d20+6d12, mantém 4 | 99,9% | **75,3%** | ~0,04% |

**Teto individual:** um personagem sem bônus externos, mantendo quatro dados da tabela de faces oficial, atinge no máximo **DE 24** (quatro d20 na face 19, convertendo Antecipar). DE 30 exige **ação conjunta ou modificadores especiais**; não é uma DE defensiva cotidiana. Com 4d20 fixos, a chance **exata** de atingir DE 10 é **32,87%**, incluindo Pavor e crítico.

**Dano NÃO é DE.** Com três monstros e dano definido `E+⌊P/2⌋`, selecionando dados para **maximizar dano**, em **120.000 ofensivas conjuntas simuladas** após habilitação, a chance ilustrativa de alcançar pelo menos **36 de dano bruto** foi **0% observado** para 9d12 por monstro, **0% observado** para 1d20+8d12 por monstro e aproximadamente **0,60%** para 3d20+6d12 por monstro. O máximo teórico de um monstro de **9d12 mantendo quatro é 10 de dano**; assim três desses não alcançam 36. Já três com mais d20 podem, mas ainda precisam atravessar a armadura. O resultado **0% observado** de uma simulação **não** significa impossibilidade matemática para 1d20+8d12; tampouco constitui chance incondicional de morte colossal.

**Limites desta avaliação:** a conversão individual de A e o arredondamento de P são feitos por participante na simulação de dano; a regra de arredondamento após agregar Pavor de diferentes participantes ainda está **PENDENTE** e pode alterar o dano final em até 1 ponto numa equipe de três, conforme os restos. Especializações, proteção, redução de dano, equipamentos, custos de Coragem/Pavor, escolha de ação do Narrador, queda de participantes, ataques em área e a dinâmica da reserva não foram modelados.

**Recomendação experimental:** usar DE 3–6 para a faixa de Aprendiz, DE 7–12 ao avaliar ataques contra proteções relevantes, DE 15–20 para testes individuais excepcionais com habilitações e DE 20–30 para cenários cooperativos. São **faixas de análise, não nova tabela oficial de dificuldades**; os patamares definitivos dependem da calibração das capacidades. Medir quatro desfechos (acerto limpo, acerto arriscado, falha limpa, falha com Pavor) e acompanhar Coragem, Pavor e penalidades de Saúde durante encontros completos.

## REFERÊNCIA HERDADA — SRD v0.17 (histórico integral)

**Atenção:** as seções abaixo são transcrições da versão anterior. Referências à espera até Marco IV para reter o quarto dado, d20 com peso 5, limitação de 1P público por oportunidade, exigência de preparação do ataque conjunto ou requisitos pendentes de Domar estão **revogadas pela v0.18**. Em conflito, prevalece sempre a seção **0-B** acima.

---

# CODEX RPG — SRD DE CONTINUIDADE

**Versão:** 0.17 — consolidação editorial das decisões de 8 de novembro de 2026  
**Data de referência:** 8 de novembro de 2026  
**Estado:** regras aprovadas, parâmetros de playtest e questões não resolvidas explicitamente separados.  
**Base:** SRD v0.16, preservado abaixo como referência histórica, com retificações desta edição.  
**Regra de precedência:** decisões expressas mais recentes > atualização normativa v0.17 > seções herdadas da v0.16 > livro anterior.

> Este arquivo **não** autoriza importar regras de Assimilação RPG. Não confundir Êxito, Antecipar e Pavor com economias anteriores. Quando as seções herdadas abaixo contradisserem a atualização normativa, prevalece **exclusivamente** a atualização v0.17.

## 0-A. Atualização normativa e erratas da v0.17

### 0-A.1. Limites de dados e construção de ameaças [DEFINIDO / EXPERIMENTAL]

- **[DEFINIDO]** Uma pilha possui **no máximo nove dados rolados**; cada participante mantém no máximo **quatro**, quando habilitado. Nenhum valor de XP, grau, Atributo, Perícia, magia ou combinação permite rolar 12 ou 18 dados na mesma ação. Os dados descartados não produzem efeitos.
- **[DEFINIDO]** Monstros não humanoides de **grau 5** podem mobilizar até **três Atributos** em uma ativação; de **grau 6**, até **quatro Atributos**, sempre escolhendo dados até o teto de nove rolados e quatro mantidos. Quatro Atributos usados não correspondem a 12 dados rolados.
- **[DEFINIDO]** Uma criatura não humanoide pode desenvolver vários Atributos até grau 6, comprando seus graus com os custos de Atributos usados para animais: grau 0–6 acumulado **0, 1, 3, 7, 15, 31, 55 XP**, respectivamente. O número de Atributos maximizados não aumenta, por si, o limite de nove dados por ativação. **[PENDENTE]** Orçamento total de XP autorizado por grau de monstro, distinto dos tetos de XP por porte dos animais.
- **[EXPERIMENTAL]** Monstros podem investir **Pavor para acrescentar Atributos pertinentes à composição** da ativação, em vez de receber Êxitos fixos. Testar **1P por Atributo adicional** acima das duas fontes básicas, sem confundir esse custo com o de manter o terceiro ou quarto dado. A progressão monstruosa experimental pode usar a escala de **dados de Conhecimentos/Práticas** para representar d12 em grau alto; não mudar silenciosamente a progressão de Atributos dos jogadores.
- **[DEFINIDO — atualização atual]** Monstro **grau 6** que tenha ao menos **um Atributo no grau 6** pode investir **100 XP** para substituir permanentemente **um d12 desse Atributo por um d20**. **Apenas uma compra permanente por criatura.** Esta compra não acrescenta um dado à pilha; requer pagar o XP dentro do orçamento da ficha, ainda por estabelecer.
- **[DEFINIDO como limite de construção]** A criatura de grau 6 pode chegar a **3d20** numa ativação; **apenas 1d20 comprado por XP**, e os demais dependem das elevações habilitadas e do Pavor correspondente. O d20 permanente não dispensa ativação, retenção ou combinação de fontes.
- **[DEFINIDO]** Inimigos humanoides usam a mesma arquitetura de XP, Perícias, equipamentos e fontes que personagens jogadores. Animais e montarias com ficha podem equipar armadura seguindo a mesma regra comum.

**Retificação expressa:** referências da v0.16 a “no máximo 2d20 monstruosos”, ou a Atributos grau 6 com rolamento livre de 12d12/18d12, ficam substituídas pelos limites acima; resultados matemáticos obtidos com pilhas ilegais não descrevem a ficha atual.

### 0-A.2. Ações conjuntas, Pavor e protagonistas [DEFINIDO / PENDENTE]

- **[DEFINIDO]** Ações conjuntas permitem **até três participantes** de cada lado; o teto vale também para monstros e chefes.
- **[DEFINIDO]** Os resultados pertinentes e **o dano são reunidos em um único ataque conjunto**. A ação pode falhar; compartilhar dano não garante acerto.
- **[DEFINIDO]** Jogadores **não pagam Pavor** para formar uma ação conjunta; monstros/inimigos só podem combinar suas ações mediante **gasto de 3P da reserva pública do Narrador**. Não usar o saldo local de um chefe como substituto desse custo coletivo.
- **[DEFINIDO]** Antecipar gasto para passar protagonismo **apenas passa a oportunidade a um aliado**; não cria automaticamente uma ação conjunta e não cancela Pavor retido. Seus outros usos básicos (1A anular 1P, 2A converter em 1E) permanecem.
- **[DEFINIDO]** O Narrador conserva o limite geral de **1P público gasto por oportunidade**. **[PENDENTE]** Como os 3P coletivos são financiados e declarados respeitando esse teto (preparação por várias oportunidades ou exceção expressa); não autorizar desembolso instantâneo de 3P por mera inferência.
- **[PENDENTE]** Ordem exata de distribuição de Pavor, conversão de A e aplicação do crítico no ataque conjunto; o dano conjunto é único, mas não se deve duplicar símbolos nem crítico.

### 0-A.3. Proteção, dano corporal e Saúde [DEFINIDO / EXPERIMENTAL / PENDENTE]

- **[DEFINIDO]** `Vida máxima = 3 + Vigor + ⌊Força/2⌋`, usando os valores da ficha, **não a Vida atual** como base dos limiares.
- **[DEFINIDO]** A armadura absorve a integridade restante primeiro; o **excedente** chega ao corpo e é comparado aos limiares de ferimento. Se a armadura possui 7 de integridade e o ataque aplica 12 de dano, restam 5 de dano corporal após romper a armadura. A armadura **não é ignorada automaticamente** pelo dano colossal.
- **[DEFINIDO]** Um ataque corporal não colossal retira **no máximo 3 pontos de Vida**, mesmo quando seu dano bruto é muito maior. **9 de dano que alcança diretamente o corpo → perda de 3 Vida.** Os intervalos entre 1, 2 e 3 Vida (por exemplo 1–5 / 6–8 / 9+) são **EXPERIMENTAIS**, não escala oficial fechada.
- **[DEFINIDO]** **Dano colossal** mantém sua exceção de **morte instantânea** quando, em **um único ataque**, o dano que efetivamente atravessa a armadura alcança **3 × Vida máxima**. Para Vida máxima 12, o limiar é **36 de dano corporal no mesmo ataque**; não se acumulam danos de ataques separados para declarar um colossal. O teto de 3 Vida **não impede** o efeito especial colossal.
- **[DEFINIDO]** Ataques conjuntos podem somar dano de até três participantes, criando em tese um golpe colossal mesmo quando os chefes não alcançariam o limiar individualmente; a viabilidade depende de custos, DE, proteção e economia de Pavor.
- **[DEFINIDO]** Existem três faixas de Saúde: **Saudável** (sem penalidade), **Machucado** (−1E), **Incapacitado** (−2E e custo de Coragem para agir); Vida 0 é morte. **[PENDENTE]** Arredondamento de caixas em vidas máximas não múltiplas de 3 e como o antigo efeito “devastador” interage com o teto de perda de 3 Vida.
- **[EXPERIMENTAL]** `Dano = E + ⌊P/2⌋`. Resistência comum ao tipo remove o componente P **do dano**, sem apagar o P do resultado; Resistência maior ignora P e reduz **2E de dano** até mínimo zero (**EXPERIMENTAL**); imunidade ignora dano desse tipo.
- **[DEFINIDO]** DE defensiva base = **Agilidade + ⌊Destreza/2⌋**, modificada pela categoria da armadura.
- **[EXPERIMENTAL — números a recalibrar]** Leve **+1DE** no grau inicial, Média **+0DE**, Pesada **+0DE** se `Força + Vigor ≥ 9`, caso contrário **−2DE**. Valores de +2DE para a leve, bônus de esquiva nas armaduras médias superiores e redução de uma resistência média foram discutidos mas **ainda não receberam valor/escala definitiva**, portanto permanecem **PROPOSTOS**. Integridade leve:média:pesada de **1:2:4** é **EXPERIMENTAL**; pontos básicos por grau, requisitos de resistências, tabela por material e peso continuam **PENDENTES**.

**Retificação expressa:** o texto herdado da v0.16 que descreve armaduras leves +3DE, médias +2DE ou proporção de integridade 1:2:3, e dano colossal que ignore a armadura, é **histórico e não vigente**.

### 0-A.4. Fontes mágicas e ressurreição [DEFINIDO / PENDENTE]

- **[DEFINIDO]** Focos e componentes mágicos **não concedem dados extras** por si mesmos; são a presença material ou contextual necessária para usar o elemento mágico.
- **[DEFINIDO]** Água precisa estar disponível para conjurar Água. Se um vulcão não possuir componente mágico de Água, a magia de Água sofre **Desvantagem Absoluta**. Outros focos podem ser terreno, itens sagrados/amaldiçoados, a própria mente (quando houver custo de Coragem) ou sangue.
- **[DEFINIDO]** Sangue de inimigo exige que ele **já tenha sofrido dano diretamente à Vida**: danificar só a armadura não faz o sangue estar disponível como foco.
- **[DEFINIDO]** Não existe magia comum de **cura de Vida**. Há **Ritual de Ressurreição**, realizado em até **sete dias** da morte com corpo vitalmente inteiro: falta de cabeça ou partes vitais inviabiliza a ressurreição verdadeira; uma eventual animação incompleta seria morto-vivo, **não recuperação da pessoa**.
- **[DEFINIDO]** O ritual combina **Trevas, Sagrado, Psíquico e Sangue**, com **três conjuradores** numa ação conjunta, **2d20 de cada um** e **quatro dados mantidos por conjurador**, total **12 mantidos**, numa **DE 30** coletiva. A soma deve terminar com **mais Êxitos que Pavor**. **Antecipar pode anular Pavor**; nenhum símbolo pode ser gasto duas vezes.
- **[PENDENTE]** Requisitos exatos para cada conjurador acessar seus 2d20, rituais sucessivos, consequências das falhas e modo de agregação de A entre participantes. As probabilidades calculadas considerando **apenas 6d20 mantidos** estão revogadas como comparação incompleta.

### 0-A.5. XP de conflitos e ranks de missão [DEFINIDO / PENDENTE]

- **[DEFINIDO]** Para aferir elegibilidade a XP pelo enfrentamento, comparar **o XP total de todos os inimigos no encontro** com **o XP total de todo o grupo de jogadores**, não ficha contra ficha. Ex.: dez inimigos com 80 XP = **800 XP de ameaças**.
- **[DEFINIDO]** Se o XP total inimigo for **menor** que o XP total do grupo, a luta **não concede XP pelo enfrentamento**. Se for igual, concede a recompensa-base; se maior, a recompensa pode crescer. **[PENDENTE]** Fórmula de quanto XP individual e coletivo é concedido, multiplicadores e como contabilizar objetivos sem mortes.
- **[DEFINIDO como nomenclatura adotada]** Ranks de desafio/missão: **Aprendiz, Perito, Elite e Divino** (substituem Fácil, Médio, Difícil e Mortal, respectivamente). Rank mede dificuldade efetiva, não grau individual nem somente razão entre totais de XP.
- **[DEFINIDO]** Um encontro **Divino** normalmente põe o grupo em clara desvantagem; uma vitória pode conceder **recompensas extraordinárias em XP e ouro**. **[PENDENTE]** Intervalos numéricos, tabelas de ouro, fórmula de recompensa e influência do objetivo da missão.
- **[PENDENTE]** Algoritmo de dificuldade que considere precisão, dano após armadura, Vida, frequência de ativações, Pavor, posicionamento, quantidade de inimigos e ações conjuntas; não atribuir ranks com base somente em XP bruto.

### 0-A.6. Diretrizes editoriais de publicação [DEFINIDO / PENDENTE]

- A apresentação pública segue a leitura de um Livro do Jogador: identidade, conceito, regra completa, requisitos, custo, procedimento, exemplo, limites e referências; **não copia conteúdo nem economia de outro sistema**.
- As Maestrias de jogadores existentes no portal de Árborius pertencem ao outro sistema e são somente **referência editorial**. Codex RPG recebe catálogo próprio de Perícias, habilidades e futuras Maestrias aprovadas; **não atribuir Maestrias inventadas**.
- Maestrias avançadas e requisitos concretos ainda **PENDENTES** não devem parecer compras disponíveis no livro; marcar os pontos não resolvidos claramente.

---

## REFERÊNCIA HERDADA — SRD v0.16 (histórico integral)

> As seções abaixo são preservadas para consulta técnica e rastreabilidade; várias regras foram alteradas pela seção **0-A**. Sempre aplicar **0-A** em caso de divergência.

# CODEX RPG — SRD DE CONTINUIDADE

**Versão:** 0.16 — retenção excepcional de quatro dados por monstros de graus 5–6 e validação matemática  
**Data de referência:** 8 de novembro de 2026 (inclui a decisão de retenção extraordinária após a v0.15)  
**Estado:** consolidação de decisões autorais recentes; inclui propostas e pendências expressamente identificadas.  
**Base histórica:** `Codex_RPG_SRD_Continuidade_v0.15_2026-11-08.md` (preserva as versões anteriores como registros históricos)  
**Livro do Jogador:** https://ike-grifact.github.io/Codex-de-Arb-rius/codex-rpg/livro-do-jogador/  
**Repositório:** https://github.com/Ike-Grifact/Codex-de-Arb-rius  
**Arquivo do livro:** `src/pages/codex-rpg/livro-do-jogador.md`

> Este arquivo substitui a v0.15 **para fins de continuidade da conversa**, não publica regras no Livro do Jogador nem modifica o repositório. É o sistema **Codex RPG**, não Assimilação RPG. As decisões explícitas do autor mais recentes prevalecem. Não transformar uma hipótese de playtest em regra aprovada.

## 0. Estados e vocabulário

- **[DEFINIDO]** Aprovado explicitamente pelo autor ou reafirmado sem ressalvas.
- **[EXPERIMENTAL]** Em uso como referência de teste, sujeito a balanceamento.
- **[PROPOSTO]** Alternativa ou ideia levantada, ainda não aprovada como procedimento final.
- **[PENDENTE]** Informação necessária que não pode ser inventada.
- Termo atual: **Dificuldade de Êxito (DE)**. A expressão **DT** aparece em versões históricas, mas não é a nomenclatura atual.
- **E** = Êxito (às vezes chamado de *Sucesso* no histórico); **A** = Antecipar (antigo *Improviso*); **P** = Pavor (antiga *Pressão*). **Não existe uma segunda economia chamada Pressão:** o nome correto é **Pavor** tanto para o símbolo mostrado pelo dado quanto para os pontos acumulados nas reservas do Narrador e dos inimigos. A expressão *Improviso Mágico* permanece o nome próprio de uma Perícia, não o nome do símbolo A. Modificadores de afinidade e de condição são conceitualmente distintos mesmo quando se somam na ação.

## 1. Filosofia, origens e construção [DEFINIDO]

Codex RPG integra narrativa, combate tático, preparação para missões e personagens de construção aberta. Todos começam como **Aprendizes**. Não há classes rígidas obrigatórias: profissões surgem da combinação de Atributos, Conhecimentos, Práticas, Perícias, equipamentos e técnicas. Builds híbridas devem funcionar e continuar distintas de especialistas. **Preparação, investigação de resistências, escolha de armas/elementos e obtenção de informações** são partes centrais da progressão horizontal.

Cenário: fantasia sombria pós-colapso, Espinhas do Mundo, cristais, ruínas, exploração, manufatura e facções. Povos: Humanos, Luckers e Runa-Espinhos. A criação inicial completa disponível no playtest é a humana. **Luckers** têm relação de origem com os elementos especiais **sangue** e **psíquico**; **Runa-Espinhos** com elementos, incluindo **terra**. As três **Origens** são as raças do cenário e **modificam os custos de XP** em áreas diferentes: algumas compras ficam mais baratas e outras mais caras, conforme cada Origem. Os modificadores numéricos ainda estão **PENDENTES**. Uma luta não precisa terminar em morte.

### Personalidade e sua evolução [DEFINIDO / PENDENTE]

**[DEFINIDO]** Na criação, cada personagem escolhe uma **Personalidade**, distinta da Origem e da profissão emergente. Exemplos mencionados: **Corajoso, Medroso, Covarde, Assustador e Intuitivo**. Cada uma oferece interações mecânicas próprias. O personagem pode **manter ou modificar sua Personalidade nos Marcos**, representando evolução, mudança ou persistência de sua identidade.

- **Corajoso:** direção autoral de possuir mais Coragem; quantidade e interação com o teto geral de 10 **PENDENTES**.
- **Medroso:** dispõe de interações características com Pavor; efeitos e custos **PENDENTES**.
- **Covarde:** pode **aproveitar Pavor mantido em sua própria ação** para **desengajar e fugir**, aumentando fortemente o deslocamento. **Esse Pavor continua indo para a reserva inimiga**; usar a face para correr não a apaga. O autor citou **dobrar os pontos de movimento por Pavor aproveitado**; a combinação de múltiplos P na mesma fuga (multiplicativa ou aditiva) está **PENDENTE**. A identidade é deixar o risco para os aliados por posicionamento, não simplesmente receber bônus de ataque.
- **Assustador, Intuitivo:** citadas como opções, mecânicas **PENDENTES**.

**[PENDENTE]** Custos e descontos das três Origens, modificações de Personalidade nos Marcos (restrições, momento, manutenção de investimentos), e tabela de capacidades de cada Personalidade. Não inventar números ou confundir Personalidade com classe.

## 2. Dados, símbolos e faces [DEFINIDO]

| Símbolo | Runa | Cor | Sentido |
|---|---|---|---|
| **Êxito (E)** | ᛋ Sowilo | `#267A45` | Execução, controle e realização. |
| **Antecipar (A)** | ᚨ Ansuz | `#2369BB` | Adaptação, coordenação, controle de Pavor. |
| **Pavor (P)** | ᚦ Thurisaz | `#542176` | Risco, intervenção e pontos de Pavor para o adversário. |

Distribuições por face numérica; `○` é face vazia e `—` é face inexistente:

| Face | d4 | d6 | d10 | d12 | d20 extraordinário |
|---:|:---:|:---:|:---:|:---:|:---:|
| 1 | ○ | ○ | ○ | ○ | ○ |
| 2 | ○ | ○ | ○ | ○ | ○ |
| 3 | P | P | P | P | P |
| 4 | A+P | P | P | P | P |
| 5 | — | A+P | A+P | A+P | A+P |
| 6 | — | E | E | E | E |
| 7 | — | — | 2E | 2E | 2E |
| 8 | — | — | E+A | E+A | E+A |
| 9 | — | — | E+A+P | E+A+P | E+A+P |
| 10 | — | — | 2E+P | 2E+P | 2E+P |
| 11 | — | — | — | E+2A+P | E+2A+P |
| 12 | — | — | — | 2P | 2P |
| 13 | — | — | — | — | ○ |
| 14 | — | — | — | — | ○ |
| 15 | — | — | — | — | 2A |
| 16 | — | — | — | — | 4P |
| 17 | — | — | — | — | E+2A+P |
| 18 | — | — | — | — | 2E+2A+2P |
| 19 | — | — | — | — | 3E+2A+2P |
| 20 | — | — | — | — | 4E |

**[DEFINIDO]** As faces 1–12 do d20 repetem literalmente as do d12. As faces 13–20 foram estabelecidas depois. O d20 é extraordinário e não faz parte da progressão comum de Atributos, que termina em d10. Na conjuração especial de área, uma capacidade pode permitir **dois d20 na mesma pilha** (seção 14); monstros extraordinários também podem atingir **dois d20**, com habilidades próprias e custo em Pavor (§6). O limite de retenção é **quatro dados para jogadores habilitados**; **monstros não humanoides de graus 1–4 mantêm no máximo três dados**, e **monstros de graus 5–6 podem manter até quatro dados**, pagando Pavor e cumprindo as capacidades aplicáveis. O teto de quatro não é gratuito nem automático.

## 3. Testes, fontes e resultados [DEFINIDO]

- Regra comum: **duas fontes pertinentes**, em geral Atributo + Conhecimento, Prática ou dados do equipamento. Uma Perícia de combinação pode habilitar **terceira fonte**. A fonte pode ter até **três dados**; Fonte grau 0 fornece normalmente 1d4 em ação pertinente.
- O jogador rola a pilha e escolhe os dados mantidos permitidos. **Pelo menos um dado mantido precisa ser de Atributo**, inclusive em conjuração.
- **[DEFINIDO — revisão v0.14] SOMENTE dados mantidos produzem efeitos.** E, A e P de qualquer dado **descartado** são ignorados para todos os fins: DE, dano, crítico, recuperação de Coragem, geração de Pavor, habilidades, conversões, desengajamento ou qualquer outro benefício/consequência da face. Dados adicionais **rolados** ampliam opções de seleção, **não** alimentam reservas por si só.
- **Ao manter Pavor, o jogador pode aproveitar o símbolo na ação e ainda transfere o Pavor não anulado para a reserva adversária.** O mesmo P pode participar da DE, do cálculo de dano, de uma técnica compatível ou da fuga do Covarde, **sem impedir sua transferência**. Usar a face não a faz desaparecer. O jogador não paga esse efeito com uma remoção da face; **somente a anulação expressa com A** retira o P e impede seus efeitos.
- **Se um inimigo mantém Pavor não anulado**, ele pode aproveitá-lo no próprio resultado e, **tenha acertado ou falhado**, gera **Coragem para os jogadores**; adota-se a relação já registrada de **1P → 1 Coragem** a distribuir, respeitando o teto de cada reserva. **[PENDENTE]** Forma de distribuição entre jogadores.
- **DE = E + P mantidos e não anulados**, após conversões e modificadores aplicáveis. A só entra na DE quando convertido em E; bônus externos de Perícias e magias seguem seu próprio texto, **não resgatam faces descartadas**.
- Não há rolagem separada de dano: os mesmos símbolos **mantidos** alimentam o cálculo após o acerto.

**Exemplo curto:** cinco dados são rolados, três mantidos. Se os dois descartados mostram três P no total e os mantidos mostram `2E + 1P`, somente **1P** pode alimentar a reserva inimiga (e pode participar da ação). O P dos descartados não existe para a resolução.

### Antecipar [DEFINIDO]

| Gasto | Efeito |
|---|---|
| 1A | **Anula** 1P próprio **mantido**, suprimindo seus efeitos e a transferência correspondente. |
| 1A | Passa a ação a aliado antes da intervenção imediata do Narrador, **sem anular o P mantido**, que segue para a reserva adversária. |
| 2A | Converte em 1E; não exige Perícia. |

Cada A só pode ser alocado uma vez a um desses usos. **Aproveitar P em dano, DE ou capacidades não o anula:** diferenciar **uso do símbolo** e **anulação expressa por A**. Sem Pavor, passar o protagonismo voluntariamente não custa A. A expressão "gastar Pavor" em capacidades como Covarde se refere a aproveitar P mantido e não cancela o envio desse P ao adversário; já o gasto de **pontos acumulados numa reserva** reduz de fato o saldo daquela reserva.

### Crítico [DEFINIDO — decisão mais recente]

Se **ao menos dois dados mantidos** mostrarem suas respectivas **faces numéricas máximas**, a rolagem recebe **+1E** e o personagem recupera **1 Coragem**, respeitando o teto. O crítico pode ocorrer sem acertar e não anula P automaticamente; d4 face 4 e d12 face 12 contam mesmo sem E na face. Não conceder bônus adicionais por novos pares na mesma rolagem, salvo decisão futura.

## 4. Marcos, retenção e capacidades [DEFINIDO / PENDENTE]

| Marco | Níveis | Dados normalmente mantidos | Condição para o teto superior |
|---|---:|---:|---|
| I | 1–5 | 2 | Máximo 2, salvo regra específica ainda não definida. |
| II | 6–10 | 3 | Máximo 3, salvo regra específica ainda não definida. |
| III | 11–15 | 3 | Máximo 3, salvo regra específica ainda não definida. |
| IV | 16–20 | 3; até **4** | Manter o quarto exige capacidade especial de Origem ou Perícia e gasto de **1 Coragem** para dado adicional conforme o caso. |

**Limite absoluto geral: 4 dados mantidos por uma criatura habilitada; monstros não humanoides de graus 1–4 ficam limitados a 3, enquanto os de graus 5–6 podem pagar para alcançar 4.** Mais dados rolados não alteram o teto nem geram Pavor adicional por dados descartados: apenas melhoram a escolha entre resultados. **[PENDENTE]** Detalhar precisamente quais habilidades permitem a retenção adicional, o custo em ativações diferentes e como se aplica a cada Marco. Não afirmar que todo personagem de Marco IV mantém quatro dados gratuitamente.

## 5. Protagonismo e ação conjunta [DEFINIDO / PENDENTE]

| Resultado | Fluxo |
|---|---|
| Acerto sem P não anulado | O próprio jogador pode agir novamente ou passar livremente a um aliado. |
| Falha sem P não anulado | A oportunidade passa ao próximo jogador, sem revés automático. Se a circulação esgotar as oportunidades dos jogadores e chegar a vez inimiga, resolver essa vez segundo as regras de ação básica ou fuga; não supor que somente Pavor permite qualquer oportunidade inimiga. |
| Acerto com P não anulado | O Narrador normalmente intervém; 1A passa a um aliado e adia a intervenção, conservando P. |
| Falha com P não anulado | O Narrador normalmente intervém; **−1 Coragem**; 1A pode adiar a intervenção passando ao aliado. |

**Ações conjuntas:** até **três personagens** são a referência central de combate cooperativo; a soma dos seus resultados é usada para alcançar uma única DE, respeitando as fontes e retenções individuais. **[PENDENTE]** O método definitivo de compartilhar ou somar A, de resolver crítico e dano conjunto, de distribuir P e de resolver ações que falham parcialmente. Participação de quatro ou cinco personagens foi considerada, mas o objetivo mais recente é que **três personagens muito poderosos possam superar DE 30 com frequência após preparo e investimento**, sem precisar de grupo maior.

**[DEFINIDO — objetivo de escala]** DE **30 é a máxima do sistema** e refere-se a dificuldades coletivas extraordinárias; **DE 25 é o limite individual desejado**, com DE maior que 25 impossível individualmente mesmo no ápice. **[PENDENTE]** O mecanismo mecânico que garante o teto individual e as probabilidades reais com XP de fichas completas.

## 6. Pavor, oportunidades inimigas e reserva pública do Narrador [DEFINIDO / PENDENTE]

**[DEFINIDO — prioridade autoral sobre os textos antigos]** O nome de símbolo e recurso acumulado é sempre **Pavor (P)**. Não criar uma segunda economia chamada Pressão. Somente símbolos dos **dados mantidos**, e bônus de P efetivamente incorporados à ação, contam. **Pavor não anulado** pode ser aproveitado na DE, no dano e em capacidades como a fuga do Covarde e **simultaneamente** alimentar a reserva adversária. Pavor anulado com A não é transferido. Pavor de dados descartados não existe para a resolução.

### 6.1. Reservas locais e teto por grau da ameaça [DEFINIDO]

| Grau da ameaça | Máximo de Pavor local acumulado | Observação |
|---:|---:|---|
| **1** | **1P** | O 1P para ativação ofensiva **é um custo**, não um ponto adicional concedido gratuitamente. |
| **2** | **2P** | Maior disponibilidade para combinar efeitos. |
| **3** | **3P** | Idem. |
| **4** | **4P** | Idem. |
| **5** | **5P** | Pode gastar **todos os 5P** numa oportunidade habilitada. |
| **6** | **6P** | Pode gastar **todos os 6P** numa oportunidade habilitada. |

O **grau da ameaça** não é automaticamente o Marco de um jogador, o grau de um Atributo ou seu XP: a correspondência deve ser estabelecida com fichas e testes. Pavor não acumulado não se transforma em ação automática. Inimigos de grau 5–6 **não** estão presos ao limite anterior de 5P por ativação: o autor confirmou que podem gastar toda a reserva local. O limite de **1P do Narrador por oportunidade** é independente e não aumenta automaticamente o estoque local máximo do monstro.

**[DEFINIDO]** Inimigos humanoides convencionais podem ser montados pelas regras de jogadores (Atributos, Conhecimentos, Práticas, Perícias, equipamentos e XP comparáveis). Monstros **não humanoides extraordinários** possuem Atributos, capacidades naturais e eventualmente técnicas únicas. **Graus 1–4: até 3 dados mantidos. Graus 5–6: até 4 dados mantidos, conforme pagamento dos dados adicionais e capacidades aplicáveis.** Suas capacidades extraordinárias podem formar até **2d20 na mesma pilha** ao pagar elevações e cumprir as condições; os d20 não dispensam os gastos de retenção. Um boss não precisa comprar uma Perícia humana para justificar um golpe corporal natural em área.

### 6.2. Usos básicos de Pavor nas oportunidades inimigas [DEFINIDO / PENDENTE operacional]

| Efeito | Gasto-base informado | Notas |
|---|---:|---|
| **Ativação ofensiva/aprimorada** | **1P** | Habilita a ofensiva com recurso; não garante acerto. |
| **Ataque à distância** | **1P** | É o custo de acesso a essa ofensiva: **não somar automaticamente outro 1P de ativação pela mesma finalidade**. A composição com outras capacidades obedece às exigências do ataque. |
| **Ataque em área** | **1P** | Criaturas gigantes podem atingir área naturalmente sem esse custo; pagar 1P pode **ampliar** sua área natural. |
| **Elevar um passo de dado** | **1P por passo** | Ex.: d10 → d12 → d20 custa dois passos, conforme capacidade extraordinária. |
| **Correr / disparada na ativação** | **1P** | Modifica a mobilidade, não garante acerto ou uma segunda ação. |
| **Manter um dado adicional** | **1P por dado adicional** | A partir da base de dois dados: o terceiro custa 1P e o quarto custa mais 1P. O quarto só é acessível a monstros não humanoides de **graus 5–6** com dados disponíveis e condições aplicáveis; o teto absoluto é quatro. |
| **Efeito particular** (arremessar personagem, arremessar objeto, ampliar área, outras técnicas) | **Custo específico** | Arremessos foram mencionados como usos possíveis, mas o custo exato de cada ação ainda está **PENDENTE**. |

O gasto é feito a partir do **saldo local** da ameaça ou, nas condições restritas da seção 6.4, com **até 1P da reserva do Narrador**. Os valores são referências para **capacidades distintas**, sem cobranças duplicadas do mesmo efeito. Se uma habilidade exigir mais de uma capacidade (ex.: corrida e golpe em área ampliada), seus custos pertinentes se combinam. O Narrador deve declarar o gasto, a capacidade ativada e o saldo resultante; o acerto é sempre determinado pela rolagem e pela DE do alvo.

**Ação básica sem Pavor:** uma ameaça que receba oportunidade pode realizar uma ação básica com **até 2 dados mantidos**, sem habilidades especiais e **sem mudar passos**. Isso não revoga a **fuga de inimigos inteligentes sem líder**, que prevalece quando estão sem Pavor ou sem meio de alcançar o alvo. O alcance à distância, se exigir a capacidade de 1P, não se torna gratuito apenas porque o inimigo pode agir basicamente. As condições exatas de ataque básico de um arqueiro sem Pavor seguem **PENDENTES** se o ataque depender dessa capacidade.

**Aproximação de inimigo corpo a corpo:** alcançar e atacar alvo **adjacente = 1P total**; em **média distância = 2P total**; em **longa distância = 3P total**. **Já incluem o 1P da ativação padrão**, não somar outra ativação ao custo anunciado. Não impor esses custos automaticamente a arqueiros e conjuradores que já podem atingir o alvo sem correr até ele. O deslocamento normal, a disparada e os efeitos de Agilidade ainda precisam da fórmula de movimento completa (§6.6).

**Ataque em área:** o inimigo faz a rolagem e compara o resultado à **DE de cada alvo** na área. Um alvo pode esquivar, outro resistir e outro sofrer dano grave. O alcance/área **não é acerto automático**. Para o mesmo golpe, o Pavor produzido pelo inimigo vem somente de seus símbolos mantidos efetivos, **não se multiplica por número de alvos atingidos** (salvo habilidade específica posteriormente aprovada).

### 6.3. Seleção do alvo, inteligência, liderança e protagonismo [DEFINIDO / PENDENTE]

- Os protagonistas conduzem as ações enquanto não houver P não anulado que permita intervenção ou outra oportunidade válida no fluxo. **P acumulado não concede automaticamente ataques consecutivos**.
- Ao receber oportunidade, **inimigo com Inteligência, sem líder e sem Pavor útil para atingir o alvo** tende a **fugir**, inclusive quando jogadores produziram falhas limpas suficientes para a vez inimiga chegar. Ferimentos, moral, objetivos e a cena podem modificar a decisão.
- Um inimigo com líder, sem inteligência relevante ou outra razão suficiente para permanecer pode usar **ação básica de até dois dados** quando chega sua vez sem Pavor, observadas restrições do ataque escolhido.
- Um inimigo de ataque à distância pode responder sem pagar o custo de **aproximação corpo a corpo**. A habilidade de disparo ainda segue seu gasto pertinente.
- Quando a oportunidade inimiga se encerra, **o fluxo retorna aos jogadores**. Somente numa **nova oportunidade de intervenção** é possível o Narrador gastar novamente de sua reserva. Não permitir que saldo alto compre uma cadeia de turnos sem nova passagem válida.
- **Pavor não anulado mantido por inimigo** gera **Coragem ao grupo de jogadores** mesmo em acerto; proporção de referência previamente estabelecida: **1P → 1 Coragem**, distribuição entre PJs **PENDENTE**. A falha inimiga interrompe seu fluxo segundo o princípio geral.

### 6.4. Reserva pública do Narrador [DEFINIDO / PENDENTE no fluxo exato]

**[DEFINIDO]** Saldo do Narrador é **público e deve ser informado aos jogadores**. O registro histórico inicia a campanha com **2P**, teto **2 + número de jogadores** e saldo persistente entre sessões; nenhum desses números foi revogado expressamente. Sua função autoral **mais recente**, porém, é:

1. **Intervir em cenas** nas quais somente os jogadores vêm agindo, inclusive diante de repetidas falhas sem Pavor e ausência de ameaça capaz de atacar imediatamente.
2. **Complementar uma ativação especial de boss perigoso**, por exemplo pagando **o único Pavor que falta** para uma combinação mais forte.

**Gasto limitado: no máximo 1P da reserva do Narrador por oportunidade de intervenção.** Se o Narrador usa esse 1P para ativar um inimigo, **não** pode usar mais um 1P de sua própria reserva para reforçar a habilidade na mesma oportunidade. Se usa 1P para complementar o boss, também não pode usá-la outra vez antes de o fluxo voltar legitimamente ao Narrador. O boss pode gastar seu **saldo local** normalmente dentro de suas capacidades. O custo e o efeito são anunciados e o saldo público é atualizado.

**Acúmulo condicionado à cena:** o Narrador **não** recebe P automaticamente sempre que o limite local de um inimigo for excedido. O autor restringiu a alimentação da reserva do Narrador a momentos em que **não há possibilidade de inimigo atingir um jogador imediatamente naquela oportunidade**, e a pontos legitimamente obtidos em momentos anteriores. Primeiro, verificar a ameaça elegível mais próxima, seu limite local e se ela pode intervir; somente então encaminhar ao Narrador aquilo que a regra de fluxo permitir. **[PENDENTE]** Distribuição exata quando há várias ameaças elegíveis, quando uma está cheia mas outra pode atacar, e o destino de excesso para o qual não haja gatilho de acúmulo do Narrador. Não inventar uma transferência universal de excedentes.

**Exemplo autoral:** um arqueiro distante mantém 2P contra inimigo corpo a corpo de **grau 1** e sem liderança. O inimigo pode reter **no máximo 1P local**, não dispõe dos **3P** necessários para correr até o arqueiro e atacá-lo, e tende a fugir quando sua oportunidade chegar. **Se nenhuma ameaça puder intervir de imediato**, o segundo P pode alimentar a reserva pública do Narrador, respeitando seu limite. Os dois P continuam contando para a ação do arqueiro porque foram mantidos e não anulados.

**Divergência histórica expressa:** as versões anteriores descreviam a reserva do Narrador como destinada exclusivamente a **iniciar conflitos**. A decisão mais recente substituiu a exclusividade por intervenções de cena e complemento limitado a chefes. **[PENDENTE]** Se e em quais condições a abertura de conflitos permanece caso particular dessas intervenções; não usá-la como custo novo automático.

### 6.5. Exemplo de orçamento extremo — monstro de grau 6 [EXPERIMENTAL, custos definidos]

Considere um monstro não humanoide de **grau 6**, com reserva local cheia em **6P**, acesso extraordinário a **dois passos de elevação em dois dados d10** e capacidade para reter três dados. Em uma oportunidade:

| Uso | Pavor local pago |
|---|---:|
| Ativação ofensiva | 1P |
| Elevar dois d10 até d20 (**2 passos por dado**) | 4P |
| Manter o terceiro dado (sobre base de dois) | 1P |
| **Total** | **6P** |

A pilha hipotética pode terminar com **2d20 + 1d10 mantidos**. **Não sobra P local** para corrida, ampliação de área ou outra capacidade onerosa: o monstro precisará reduzir investimentos, possuir uma habilidade natural que dispense algum custo ou receber **até 1P** da reserva pública do Narrador **numa oportunidade válida**. Isso ilustra uma *escolha*, não uma conversão gratuita de todos os d10 em d20. O passo real de cada dado e a elegibilidade da transformação dependem da ficha e da capacidade extraordinária.

### 6.5-A. Quarto dado nos monstros de graus 5–6 [DEFINIDO / aplicação experimental]

**[DEFINIDO — decisão posterior à v0.15]** Monstros não humanoides de **graus 5 e 6 podem manter quatro dados**. O pagamento segue a economia normal de **1P por dado mantido além dos dois básicos**, sujeito às características e aos dados efetivamente disponíveis da criatura. Monstros de graus 1–4 preservam o teto de três dados. O quarto dado não concede êxitos automáticos, não revoga o limite absoluto de quatro e não altera a regra de que somente dados mantidos produzem efeitos.

**Exemplos contábeis para um grau 6 com 6P local**, tomando dados já disponíveis na pilha e supondo capacidade de elevar d10→d12→d20 (dois passos por dado):

| Configuração de ataque | Ativação | Elevações | Retenção (terceiro e quarto) | Total |
|---|---:|---:|---:|---:|
| **4d10 mantidos** | 1P | 0P | 2P | **3P** |
| **1d20 + 3d10 mantidos** | 1P | 2P | 2P | **5P** |
| **2d20 + 2d10 mantidos** | 1P | 4P | 2P | **7P** |

Na última linha, **6P locais não bastam**. O monstro de grau 6 só executa essa composição completa numa oportunidade se possuir redução de custos/capacidade natural apropriada ou se o Narrador puder **complementar exatamente 1P de sua reserva pública naquela oportunidade**. Esse único P do Narrador não pode ser gasto novamente na mesma intervenção. Um monstro de grau 5, com 5P locais, também pode manter quatro dados, mas não paga essa composição de 7P sem outra capacidade. O acesso a dois d20 requer a capacidade extraordinária pertinente; não é um direito automático de todo inimigo de grau 5 ou 6.

**[PENDENTE]** Especificar as habilidades naturais que dispensam gastos, a pilha inicial de cada monstro e como as limitações de grau se aplicam a criaturas sem capacidade de reter quatro; essa permissão não dá automaticamente todos os poderes aos monstros do grau.

### 6.6. Alcance, movimento e desengajar [DEFINIDO / PENDENTE]

- Três faixas táticas: **corpo a corpo**, **média** (conjuração usual) e **longa** (atiradores). As habilidades podem ampliar ou mudar o alcance (ex.: arqueiro mágico).
- Cada ponto de **Agilidade** aumenta tanto deslocamento mínimo quanto máximo. O autor citou disparada de **21m em 6 segundos** como exemplo, mas fórmula de deslocamento e faixas em metros **PENDENTES**.
- **Desengajar com 1A** permite deixar um alvo adjacente de forma controlada; consequências de fugir sem desengajar ainda **PENDENTES**.
- Personalidade **Covarde** aproveita P mantido na ação para fugir, sem impedir a transferência ao inimigo. Fórmula com múltiplos P **PENDENTE**.
- Conjuração pesada conclui depois dos demais, exigindo teste de concentração por Vigor se interrompida; barreiras, movimento e invocações seguem habilitações pertinentes.

### 6.7. Estilos e combinações táticas [DEFINIDO como direção / PENDENTE custos]

- **Corpo a corpo:** contenção espacial, proteção e iniciativa de interceptação.
- **Conjuradores:** alcance usual médio, dano/controle em área, obstáculos e apoio; vulneráveis durante preparação de magia pesada.
- **Atiradores:** alcance longo, precisão em alvo único e uso de terreno para reduzir a exposição a Pavor; distância não gera vantagem situacional automática, depende da situação.
- **Barreira elemental:** Perícia defensiva de imunidade temporária a um elemento **PROPOSTA**, com custo, duração, alvo protegido e interações **PENDENTES**.
- **Híbridos:** encantamento de arma/armadura, projéteis mágicos, magia furtiva, cavalaria, alquimia, domadores e conjuradores de combate surgem de Perícias de habilitação e combinação, não de classes obrigatórias.

## 7. Coragem, Pânico e Saúde [DEFINIDO / PROPOSTO / PENDENTE]

**Coragem inicial e teto normal: 10.** A reserva é individual; crítico recupera 1 até o máximo, e falha com Pavor tira 1. Todo P não anulado mantido em uma rolagem inimiga pode recuperá-la para o grupo, mesmo se o inimigo acertar; distribuição pendente.

| Uso | Preço | Condições |
|---|---:|---|
| Manter **um dado adicional** | **1 Coragem** | Respeita o teto de 4 e requisitos de habilidade para retenção especial. |
| Elevar o passo de **um dado** | **1 Coragem** | Antes da rolagem; **uma elevação comum por rodada**. Cadeia usual d4 → d6 → d10 → d12. |
| Elevar **dois passos** em conjuração habilitada | **2 Coragens** | Exceção de conjuradores com Inteligência, inclusive a conversão extraordinária d10 → d20 em magia de área; precisa da capacidade apropriada. |
| Ignorar penalidade de Saúde | **1 Coragem** | Duração e aplicação exata ainda pendentes. |
| Mover-se em estado crítico de Saúde | **1 Coragem** | Duração e limites pendentes. |
| **Reduzir voluntariamente** o passo de um dado próprio | **Custo pendente** | Opção autoral para moderar efeito/Pavor, por exemplo ao poupar um alvo; não garante menos P em toda face. |

O controle de **uma alteração de passo por rodada** precisa ser interpretado no sistema de protagonismo fluido; a exceção conjuradora permite dois passos pela capacidade e custo indicados, não duas alterações gratuitas. Redução de d20 a d12 e sua interação com o limite de passos continuam dependentes de descrição precisa.

### Pânico [PROPOSTO — atualização mais recente]

- Ao atingir **0 Coragem**, o personagem entra em **Pânico**.
- Aplica **Desvantagem grau 3 / Ação de Sorte: −2E**.
- O autor também **propôs adicionar +1P à rolagem e retirar 1A** durante o Pânico, para distingui-lo de outras condições. **Não tratar esses dois componentes como aprovados definitivamente** até fechar momento de aplicação, mínimo de símbolos e geração de Pavor pelo P extra.
- **[PENDENTE]** Quando começa/termina o Pânico, momento do gasto da última Coragem, possibilidade de resultado negativo, e se o P acrescentado participa automaticamente da DE e da transferência de Pavor ao adversário.

### Ferimentos [DEFINIDO como direção; detalhes PENDENTES]

A Saúde possui limiares que podem causar **perda de Êxitos**. O autor citou o primeiro limiar após **quatro pontos de Vida perdidos** em um personagem de 12 Vida, mas tabela geral, escalonamento por Vida e efeitos exatos ainda não foram formalizados. Coragem pode ignorar penalidades e permitir movimento crítico conforme custos acima.

## 8. Atributos, Vida, defesa e peso corporal [DEFINIDO]

Seis Atributos: **Força, Agilidade, Destreza, Inteligência, Influência e Vigor**.

- **Vida máxima base = 3 + Vigor + ⌊Força/2⌋.** Com Vigor 6 e Força 6, máximo teórico de atributos **12 Vida**. É preciso pagar os graus em XP; não atribuir simultaneamente outros máximos sem orçamento.
- **DE defensiva dos atributos = Agilidade + ⌊Destreza/2⌋.** Com Agilidade 6 e Destreza 6, máximo teórico de contribuição **9 DE**, antes de equipamento e habilidades. O **mínimo de DE defensiva geral** não está definitivamente aprovado; um infectado inicial de **DE 1** é referência de playtest.
- **Peso corporal:** Agilidade maior que Vigor → **leve**; iguais → **médio**; Vigor maior que Agilidade → **pesado**. Armadura, escudo e arma podem alterar o peso efetivo, conforme a capacidade de carga.
- **Não reduzir Agilidade automaticamente por vestir armadura pesada.** O custo vem de requisitos de Força/Vigor, distribuição de XP e carga efetiva.
- **[PENDENTE]** Fórmula definitiva que combina Agilidade, Vigor, Força, capacidade de carga, armas, escudos, inventário e condição de sobrecarga.

### Criação humana e progressão de fontes [DEFINIDO histórico / PENDENTE atualização de XP]

Na v0.9, criação humana começa com **14 XP** (7 de Base/Atributos, 7 de Formação) e 10 Coragens. O autor propôs posteriormente **3 XP iniciais voltados a Perícias**, mas ainda precisa fixar se esses 3 estão dentro dos 14 ou são uma concessão adicional. **Após a criação o XP é livre**, podendo ser gasto em qualquer categoria sem cotas obrigatórias.

**Atributos: máximo grau 6 = 3d10; custo acumulado 55 XP por Atributo.**

| Grau | Dados | Custo do avanço | Acumulado |
|---:|---|---:|---:|
| 0 | 1d4 | 0 | 0 |
| 1 | 1d6 | 1 | 1 |
| 2 | 2d6 | 2 | 3 |
| 3 | 3d6 | 4 | 7 |
| 4 | 2d6+1d10 | 8 | 15 |
| 5 | 1d6+2d10 | 16 | 31 |
| 6 | 3d10 | 24 | 55 |

**Conhecimentos e Práticas: máximo grau 6 = 3d12; custo acumulado 102 XP por fonte.**

| Grau | Dados | Custo do avanço | Acumulado |
|---:|---|---:|---:|
| 0 | 1d4 | 0 | 0 |
| 1 | 1d10 | 2 | 2 |
| 2 | 2d10 | 6 | 8 |
| 3 | 3d10 | 12 | 20 |
| 4 | 2d10+1d12 | 18 | 38 |
| 5 | 1d10+2d12 | 28 | 66 |
| 6 | 3d12 | 36 | 102 |

Conhecimentos de referência: Ciências, Biologia, Engenharia, Erudição, Geografia e Medicina. Práticas de referência: Atletismo, Furtividade, Infiltração, Manufaturas, Mineração, Herborismo, Expressão, Comércio, Sobrevivência; Punhos requer habilitação específica.

## 9. XP livre, níveis, Marcos e ascensão divina [DEFINIDO / EXPERIMENTAL]

- **[DEFINIDO] XP adquirido é livre.** Não separar cotas obrigatórias para Atributos, Conhecimentos/Práticas e Perícias; o autor aceita grau 6 cedo se a ficha conseguir pagar, já que Marcos, custo de Coragem e habilidades limitam quantos dados podem ser mantidos.
- **[PROPOSTO] Referência para orçamento de nível 20:** dois Atributos grau 6 (**110 XP**) + quatro Conhecimentos/Práticas grau 6 (**408 XP**) + **43 XP** de Perícias = **561 XP totais**. **É cálculo de orçamento, não limite de compra por categoria ou quantidade máxima de fontes grau 6.**
- **[PROPOSTO]** Perícias podem custar individualmente 1, 2, 3, 4 ou 5 XP; uma profissão completa de alto nível pode exigir **pelo menos 40 XP só de Perícias**, além dos requisitos. 43 XP representa um referencial de construção, não cota exclusiva.
- **[PENDENTE]** Tabela de XP concedido por nível 1–20 e mecanismo de ganho de nível. Referência antiga de 5 XP por nível (109 total) **não sustenta** a meta nova de 561; não misturar ambas como se fossem compatíveis.
- **[PROPOSTO] Ascensão divina:** após missão excepcional, personagem **permanece no nível 20**, mas pode seguir recebendo XP por muito tempo. Amplia repertório/versatilidade; não rompe automaticamente teto de quatro dados mantidos, DE individual 25 ou DE coletiva 30.
- **[DEFINIDO como método]** Inimigos podem ser montados com orçamentos de XP comparáveis aos dos personagens do mesmo nível/Marco. XP equivalente **não garante** ameaça equivalente: avaliar DE, integridade, dano, imunidade, Pavor e quantidade de inimigos.

## 10. Perícias e profissões emergentes [DEFINIDO / PENDENTE]

Cada Perícia possui custo e requisitos próprios; **não deduzir seu efeito a partir do preço**. Exemplos registrados:

| Perícia | Custo | Efeito |
|---|---:|---|
| Combate | 1 XP | +1A em teste de combate pertinente. |
| Montar Animal | 2 XP | Habilita montaria comum com **Influência 2**; não substitui Domar Animal para obter um companheiro próprio. |
| Armas 1 | 2 XP | Habilitação sem dados próprios, inclui primeira especialização (leve, média, pesada, distância ou Punhos). |
| Especialização adicional de Armas | 2 XP | Nova categoria; manejo especializado pode ignorar requisito de Atributo do item e dar +1A. |
| Técnica Marcial | 2 XP | Permite combinação pertinente de terceira fonte com arma equipada; a fonte que fundamenta a ação determina o que se pode executar. |
| Artes Marciais | 1 XP | Após Punhos, combina Atributo+Punhos+terceira fonte pertinente. |
| Furto, Acrobata, Alquimia, Comércio | 2 XP cada | Habilitam respectivas combinações específicas de três fontes. |

**Punhos** é Prática com dados adquirida após habilitação: Armas 1 (2 XP) + Punhos 1 (2 XP) + Artes Marciais (1 XP) = **5 XP** para a base de luta desarmada, antes de outras fontes. Equipamento armado fornece seus próprios dados; Armas 1 não produz d10 grátis.

**[DEFINIDO]** Perícias gerais de **combinação de fontes custam 2 XP**, inclusive as que permitem combinar Conhecimentos, Práticas e Atributos diversos, desde que pertinentes. A **fonte principal da ação** determina o tipo de efeito autorizado: um Perito em Armas pode combinar Armas + Alquimia + Inteligência para **atacar**; para **preparar, envenenar ou encantar** uma arma como procedimento alquímico, precisa ser **Perito em Alquimia**, com a Alquimia como fundamento. Comprar combinação de três fontes **não** significa manter três dados automaticamente. Maestrias e Perícias com pré-requisitos podem ampliar retenção; antes disso, pode haver uso de Coragem, sempre respeitando o máximo de quatro dados e as condições dos Marcos. Fontes pouco desenvolvidas contribuem apenas com seus dados efetivos — grau 0 normalmente **1d4**. A relação exata entre Maestria inicial, Coragem e retenção extra no Marco I continua **PENDENTE**.

**[PROPOSTO / PENDENTE]** Perícias futuras podem anular Desvantagem de arma específica contra determinado alvo. **REVISÃO DE TÉCNICAS FÍSICAS:** o autor passou a preferir **+3E** como referência do ápice da técnica fixa, próximo do nível 20, ou uma **Finalização que dobra E** quando estabelece uma abertura severa. A antiga hipótese de até **+4E** fica como histórico não consolidado. Técnicas físicas podem conceder +1E/+2E, +P ou manipulações condicionais, conforme especialização, requisitos, custo e playtest. **Armas e profissões físicas normalmente não recebem d20**; acesso excepcional depende de especialização mais caótica. **[PENDENTE]** Custo de Coragem para cada faixa, se o bônus afeta DE/dano/ambos, limitação por ação e acúmulo com Perícias, crítico, afinidade e situações; reavaliar a meta de **DE individual máxima 25**. A interpretação histórica de 2 Coragens por E ainda não foi confirmada expressamente. Interações entre múltiplas Perícias de A e bônus externos precisam de condições próprias.


### Catálogo de Perícias de conjuração — decisão autoral recente [DEFINIDO, ressalvadas as pendências indicadas]

**Conjuradores iniciantes dispõem de conjuração psíquica como elemento padrão.** A conjuração de outro elemento exige a habilitação apropriada, inclusive quando o elemento básico normalmente é comum. O acesso psíquico inicial **não equivale** a adquirir gratuitamente todas as capacidades psíquicas avançadas ou as afinidades raciais dos Luckers.

| Perícia | XP | Efeito autoral |
|---|---:|---|
| **Aprendiz de Conjurador** | **2** | Concede a capacidade de **Conjuração grau 1**; sua relação exata com a compra de **1 ponto de arma/conjuração** ainda deve ser especificada. |
| **Magia Única** | **1** | Permite **criar uma magia inicial de grau 1**. |
| **Perito Conjurador** | **2** | Permite agregar outras capacidades/habilidades pertinentes à conjuração, além da própria Conjuração. Quais fontes e como se aplicam seguem as restrições da técnica; não presumir bônus de dados automático. |
| **Improviso Mágico** | **1** | Permite adicionar elementos obtidos da cena, a critério do Narrador ou do jogador conforme a situação; não cria livremente um elemento que não esteja disponível. |
| **Mestre Elementalista** | **5** | Permite criar conscientemente **um segundo elemento** na magia e concede **+1A (Antecipar)** nos testes de conjuração. |
| **Conjuração Elemental — cada elemento básico** | **1 por elemento** | Habilita o elemento básico escolhido em conjurações (fogo, água, raio, vento e terra). |
| **Magia Sagrada** | **3** | Habilita Sagrado; concede **+1E**, que pode ser **convertido em 1 Coragem** para sustentar/abençoar o próprio conjurador ou um aliado. **Máximo 1E→1 Coragem por conjuração/turno**; o E convertido deixa de estar disponível para outros usos. Procedimentos de efeitos específicos de bênção e a duração ficam pendentes. |
| **Magia de Sangue** | **3** | Habilita Sangue; acrescenta **+1P ao teste**. O conjurador **perde obrigatoriamente 1 Vida ao conjurar, mesmo se errar**. Se acertar um alvo com sangue, retira **exatamente 1 Vida do alvo**, ignorando armadura; falhar não retira Vida do alvo. **Seres sem sangue são imunes** ao efeito sanguíneo. O P adiciona risco de intervenção e possível contra-ataque, conforme a economia de Pavor. |
| **Magia de Veneno** | **3** | Habilita Veneno; aplica **penalidade de Saúde sem retirar Vida pelo veneno em si**. **Uma aplicação: 1 acúmulo por 2 oportunidades em que o alvo age ou tenta agir. Duas aplicações: efeito máximo, com 4 oportunidades do alvo.** O alvo pode gastar **1 Coragem (jogador)** ou **1 ponto de Pavor acumulado do inimigo/Narrador (inimigo)** para remover **1 acúmulo**. Identificação da reserva inimiga e momento exato do gasto ficam pendentes. |
| **Magia de Trevas** | **3** | Habilita Trevas; adiciona **+2P na única rolagem** e permite **selecionar dois alvos distintos no campo de visão** para resolver com esse mesmo teste. Não duplicar o Pavor nem a geração de Pavor por usar dois alvos; a comparação contra cada DE e a distribuição de dano ainda precisam ser fechadas. |
| **Perícia especial de Conjurador (nome pendente)** | **5** | Um dos requisitos para acessar **d20 e conjuração extraordinária de área**; requer **Inteligência grau 6, Conjuração grau 6 e outras especializações envolvendo dano e área**, ainda a enumerar. Não é acesso automático somente pelo pagamento de 5 XP. |

**[DEFINIDO]** As Perícias têm preços próprios, não substituem o XP necessário para evoluir Inteligência ou Conjuração, nem dispensam os requisitos anteriores. Os elementos Sagrado, Sangue, Trevas e Veneno **não** usam a compra comum de 1 XP por elemento: cada um possui habilitação própria de **3 XP**, com efeitos específicos.

**[PENDENTE]** Ordem das compras e pré-requisitos completos de cada Perícia; limite de aplicações de +1A/+1E/+P por teste; seleção de destinatário, efeitos de bênção e duração de benefícios sagrados (o limite de conversão **1E→1 Coragem por conjuração/turno já está definido**); como adicionar mais de um componente de dano à magia; momento e reserva exata de **Pavor acumulado** do inimigo usados para remover Veneno; catálogo futuro de Encantamento de Armas, área, Precisão Mágica e outras especializações.

**Cálculo mínimo parcial, não uma build completa:** Aprendiz de Conjurador (2) + Magia Única (1) = **3 XP em Perícias**, antes de comprar aumentos de Conjuração. Se incluir a Perícia especial de Conjurador (5), chega a **8 XP em Perícias já identificadas**, mas ainda faltam Inteligência 6 (**55 XP no esquema atual**), Conjuração 6 (custo a definir) e demais requisitos de dano/área. Logo, o preço mínimo real de acesso ao d20 **não pode ser fechado** ainda.
### Domar animais, montarias e Maestrias associadas [DEFINIDO / PENDENTE]

**[DEFINIDO]** Criaturas domesticadas não são um acréscimo gratuito a uma ficha guerreira completa. Investir em **Influência, Destreza, Domar, Montar e coordenação** reduz o XP disponível para Força, Agilidade, equipamento e outras Perícias; em compensação, a criatura oferece **Atributos, mobilidade, proteção e ações próprias**, conforme sua categoria. O mesmo vale para animais dos inimigos: todo recurso de construção acessível aos jogadores também pode existir na ficha de humanoides adversários.

| Habilitação | Custo da Perícia | Requisito de Atributo confirmado | Comentário |
|---|---:|---|---|
| **Domar Animal Pequeno** | **2 XP** | **PENDENTE** | Pequeno não tem ficha nem ataque independente. |
| **Domar Animal Médio** | **3 XP** | **Influência 2** | Companheiro com ficha, XP, risco de vida e ações próprias. |
| **Domar Animal Grande** | **4 XP** | **Influência 3** | Companheiro grande pode servir de montaria quando houver a Perícia de montar pertinente. |
| **Domar Animal Exótico, Gigante ou Alado** | **5 XP** | **Requisito específico de Domar PENDENTE** | Pode ter voo, magia ou porte especial; não confundir com requisito de **montar**. |
| **Montar Animal** | **2 XP** | **Influência 2** | Habilita montaria comum. |
| **Montar Animal Exótico** | **4 XP** | **Influência 4** | Habilita montaria exótica; pré-requisitos cumulativos PENDENTES. |
| **Montar Animal Voador/Alado** | **5 XP** | **Influência 4 + Destreza 4** | Habilita controle montado em voo; pré-requisitos cumulativos PENDENTES. |

**[DEFINIDO]** Animal pequeno **não ataca independentemente** para não criar perigo e Pavor por uma segunda rolagem, **não possui ficha**, e pode acrescentar **Êxitos ou efeitos de apoio à ação do dono** somente nas ativações e condições de Perícias pertinentes. O valor numérico de cada ativação **PENDENTE**; não estabelecer +1E permanente universal.

**[DEFINIDO]** Animal **médio ou maior** tem ficha separada e **ações próprias**, com risco de ferimento/morte e **XP próprio** inferior ao ganho normal dos jogadores. Animais investem XP **somente em Atributos** (sem progressão humana de Conhecimentos, Práticas ou Perícias); usam combinações pertinentes dos próprios Atributos. **Não possuem Coragem para elevar passo ou contornar limitações**, e não ganham automaticamente habilidades de Perícias humanas. O animal não pode ser **domado acima do nível do personagem**: se adquirido no nível N, sua ficha inicial deve ter **nível equivalente ou inferior a N**. Depois pode evoluir junto do dono, respeitando ganhos e limites da categoria.

| Categoria com ficha | Teto de XP próprio em Atributos | Justificativa do orçamento |
|---|---:|---|
| Médio | **110 XP** | Equivalente ao custo de 2 Atributos no grau 6 (2 × 55). |
| Grande | **165 XP** | Equivalente a 3 Atributos no grau 6 (3 × 55). |
| Exótico/gigante/alado | **220 XP** | Equivalente a 4 Atributos no grau 6 (4 × 55). |

Esses números são **tetos de XP total do animal**, não exigência de maximizar exatamente dois/três/quatro Atributos. Um animal pode distribuir sua experiência entre vários Atributos respeitando o próprio teto. **[PENDENTE]** Taxa de XP por nível/sessão, orçamento de entrada no momento da domesticação e diferença de nível máxima para criaturas obtidas depois. Não permitir que uma compra de Perícia crie imediatamente um companheiro com 110/165/220 XP e nível acima do dono.

**[DEFINIDO]** Perícias pertinentes de domador/cavaleiro podem conceder **+1A para passar a oportunidade ao animal ou à montaria**, preservando o Pavor mantido e a regra geral de passagem de protagonismo. Quando a ação do dono não tem Pavor não anulado, a passagem livre já funciona pelo procedimento normal: o bônus não gera por si só um turno adicional. Animal médio ou maior pode contribuir numa **ação conjunta** como outro participante com rolagem e ficha próprias. Mantém-se a referência de **até três participantes por ação conjunta**, contando o animal; não se cria automaticamente uma quarta contribuição ou dados mantidos além do teto individual.

**[DEFINIDO]** Um animal grande que o caçador domesticou **pode também ser montaria**, desde que o caçador tenha a Perícia de montaria adequada. Montar não concede gratuitamente nova ficha ou segunda ação. A montaria compensa a **Agilidade não desenvolvida do cavaleiro por deslocamento/posicionamento**, e o animal pode compensar dados e requisitos de armas que o dono não adquiriu, **atuando por sua própria ficha**; não transfere seus Atributos para a DE ou ataque do dono automaticamente.

**[PENDENTE]** Retenção inicial de dados do animal e quando treinamento permite terceiro mantido (máximo de **3** para arquitetura não humanoide extraordinária, sem criar quinto dado do cavaleiro), quantidade simultânea de companheiros ativos, requisitos cumulativos de Domar/Montar, custos e efeitos de Maestrias de Cavalaria, condições de ordens e ações conjuntas montadas, duração dos benefícios de apoio, XP inicial do animal, seleção de liderança de montaria inimiga. **[PROPOSTO]** Limitar inicialmente a um companheiro ativo com ficha por personagem, sujeito a teste; ainda **não aprovado**.

### Arquitetura das ameaças e equivalência com jogadores [DEFINIDO / PENDENTE]

1. **Humanoides comuns:** fichas pelas mesmas regras de XP, Atributos, Conhecimentos, Práticas, Perícias e equipamentos dos jogadores, com acesso a companheiros, montarias e builds híbridas. O nível e o orçamento de XP são referências, **não equivalências garantidas de dificuldade**.
2. **Companheiros animais e animais inimigos:** fichas de Atributos e experiência próprias; um inimigo pode ter a mesma parceria que um caçador jogador.
3. **Monstros extraordinários não humanoides:** Atributos, habilidades naturais e reservas locais por grau; **até três dados mantidos nos graus 1–4 e até quatro nos graus 5–6 mediante Pavor**, podendo alcançar **dois d20** em casos especiais e mediante custos/capacidade apropriada. Efeitos únicos não exigem árvore convencional de Perícias humanas.

**Exemplo conceitual — Colosso de Carne Fétida:** morto-vivo gigante e pesado, **imune a Sangue e Veneno**, golpes em área por porte e possibilidade de ampliar área ou arremessar alvos/objetos mediante habilidades e gastos de Pavor. Seu tamanho não precisa impor DE defensiva alta. Valores de Vida, integridade, grau, DE e dados ainda exigem ficha própria e balanceamento; não os preencher a partir da descrição.

## 11. Economia unificada de dados de armas e magias [DEFINIDO]

**Pontos de composição não são XP.** Armas e conjurações seguem a **mesma tabela de custos por dado**:

| Dado | Pontos de composição |
|---|---:|
| d4 | **0,5** |
| d6 | **1** |
| d10 | **2** |
| d12 | **3** |
| d20 | **5** |

Exemplos: `2d6` = 2 pontos; `1d10` = 2; `1d10+1d6` = 3; `1d20+1d12` = **8**. Diferentes combinações podem rolar mais ou menos dados; nada disso supera o limite de dados **mantidos** do Marco e das capacidades.

**Armas e conjuração compartilham investimento de composição:** ao escolher **a especialização de Conjuração em vez da de armas**, o personagem aplica os **mesmos pontos que seriam destinados aos dados da arma** à **Conjuração**, adquirindo sua composição de magias e os **slots correspondentes**. Não se ganha uma arma e uma magia gratuitamente pelo mesmo ponto; a equivalência é de **destinação de compra**. O autor confirmou que **cada ponto que iria para armas passa a Conjuração/spellslots** no caminho do conjurador. **[PENDENTE]** Se há conversão reversível, equipagem múltipla e a tabela exata de custo de XP dos pontos e seus limites.

**Armas:** os **graus das armas utilizam essa mesma economia de composição**, assim como magias. **[PENDENTE]** Tabela de pontos de composição disponíveis em **cada grau de arma** e os requisitos exatos por categoria. A antiga referência geral de arma até 3 pontos era experimental e não deve ser usada como teto universal após a regra de graus. Dado d20 em arma não é acesso normal sem capacidade extraordinária aprovada.

## 12. DE de combate, condições e afinidades [DEFINIDO / EXPERIMENTAL]

**DE é o limiar para acertar**; ao acertar, calcula-se dano e resolve-se armadura, resistência, imunidade e ferimentos. Dano de elemento e peso não deve ser confundido com bônus de acerto: **há modificadores de ataque (afetam a DE alcançada) e modificadores de dano (afetam a força do impacto)**.

### Estados situacionais e soma de fontes

- **[DEFINIDO] Estado situacional** é individual, decidido pelo Narrador e **não acumula com outras circunstâncias situacionais**: condições favoráveis/desfavoráveis normalmente se neutralizam, ficando Normal.
- **[DEFINIDO] Modificadores de ataque/arma, peso, elemento e armadura** podem somar-se ao estado situacional e entre origens compatíveis. São fontes de penalidade/benefício diferentes, não duas condições ambientais empilhadas.

| Estado final | Efeito no teste |
|---|---|
| Vantagem absoluta | +1E |
| Vantagem | +1A |
| Normal | Nenhum |
| Desvantagem | −1A |
| Desvantagem absoluta | −1E |
| Ação de Sorte / Desvantagem grau 3 | −2E |

Exemplo autoral: lutar no escuro contra quem enxerga no escuro (Desvantagem condicional) **mais** golpe pesado contra alvo leve (Desvantagem de ataque) → **Desvantagem absoluta**. Uma terceira penalidade relevante leva a Ação de Sorte (−2E), além de eventual redução de dano. **[PENDENTE]** Algoritmo completo para mais de três condições, vantagens absolutas empilhadas e resolução de E/A inexistentes ou abaixo de zero.

### Afinidade de peso — ponto de vista do atacante [DEFINIDO]

| Categoria defensiva | Ataque leve | Ataque médio | Ataque pesado |
|---|---|---|---|
| **Leve** | Neutro | Favorável | Desfavorável |
| **Média** | Favorável | Desfavorável | Neutro |
| **Pesada** | Desfavorável | Neutro | Favorável |

As afinidades podem alterar **tanto os modificadores de ataque quanto o dano**, conforme propriedades da arma, alvo e armadura; o bônus **+E de afinidade exclusivamente de dano** não conta para superar DE. Perícias específicas podem anular uma incompatibilidade de arma sem anular automaticamente a condição situacional. A interação exata entre armadura e corpo protegido ainda precisa de procedimento fechado.

## 13. Vida, dano, armadura e imunidades [DEFINIDO / EXPERIMENTAL]

### Dano

**[EXPERIMENTAL] Dano calculado = E mantidos + ⌊P mantidos não anulados / 2⌋**, após conversão de A em E e aplicação dos modificadores de dano pertinentes. Ex.: `4E+2P` → **5 de dano**. **E convertido de Antecipar continua sendo E** e conta para acertar e para dano; **resistência não apaga E convertido**.

- **[DEFINIDO] Resistência ao componente/tipo:** esse componente **ignora a contribuição do Pavor mantido para o dano** (A nunca causa dano diretamente sem conversão). Êxitos permanecem, inclusive os convertidos de A. O Pavor mantido não anulado **continua a ser transferido ao adversário**, mesmo quando não conta para dano devido à resistência.
- **[DEFINIDO] Imunidade:** o tipo imune **não causa dano**, mesmo se o ataque superar a DE. O sucesso pode informar o jogador da imunidade ou possibilitar investigação/inferência. **Pavor mantido e não anulado ainda é transferido**, mesmo que o ataque não cause dano por imunidade.
- **[PENDENTE]** Em ataques mistos, como espada física com fogo, definir quais componentes continuam afetando o alvo quando um tipo for imune e como dividir o dano entre eles.
- **[DEFINIDO conceitualmente]** Afinidade favorável de combinação pode conceder **+2E exclusivamente para dano**, nunca para a DE; soma e limites de composições múltiplas ainda exigem procedimento completo.

### Corpo, ferimentos e colossal

- **Vida máxima = 3 + Vigor + ⌊Força/2⌋.**
- **[EXPERIMENTAL]** Um ataque corporal comum que ultrapasse a proteção retira **1 Vida**, mesmo quando o dano calculado for maior. Armaduras equipadas possuem integridade separada; dano recebido pela armadura não remove simultaneamente a mesma quantidade de Vida.
- **[DEFINIDO — critério autoral]** **Dano colossal** exige dano calculado aplicável **≥ 3 × Vida máxima do alvo** e atinge diretamente a Vida, ignorando a armadura, com efeito fatal/decisivo a especificar formalmente. **[PENDENTE]** Se, em armadura natural integrada ao corpo, o limiar usa Vida base ou integridade corporal multiplicada; e como se resolve efeito exato após atingir limiar.
- **[PENDENTE]** Limiar de ferimentos, transbordamento de armadura, nocaute, ferimentos graves, descanso e cura. A referência histórica de recuperação era **1 Vida por descanso efetivo**.

### Armaduras equipadas [DEFINIDO como estrutura / EXPERIMENTAL numérico]

**A integridade vem do grau próprio do equipamento e de sua categoria, não da DE defensiva do usuário.** O autor corrigiu explicitamente qualquer fórmula que multiplique diretamente a DE do personagem.

| Categoria | Peso de equipamento | Multiplicador de integridade | Bônus de esquiva no grau inicial [EXPERIMENTAL] |
|---|---:|---:|---:|
| **Leve** | **0** | **×1** | **+3 DE** |
| **Média** | **1 ou 2** | **×2** | **+2 DE** |
| **Pesada** | **3** | **×3** | **+0 DE** |

**[PENDENTE]** Tabela do valor-base de integridade por grau de armadura, escala total por categoria e grau, bônus de DE em graus superiores, requisitos de Força/Vigor, escudos, inventário, cobertura, quebra e materiais. **Não** usar DE do personagem para calcular integridade. **Não** impor redução automática da Agilidade por armadura pesada.

Meta **[EXPERIMENTAL]**: armadura pesada de alto nível suportar da ordem de **8 golpes efetivos** com dano médio de aproximadamente **5**, antes de proteção elemental e resistências; por exemplo, 36 pontos permitem 8 golpes de dano fixo 5. Uma ficha com Vida 12 pode suportar ferimentos corporais adicionais. Isso é **acertos efetivos**, não turnos, e depende da probabilidade de acertar.

### Armadura natural de criaturas [PROPOSTO]

- Proteção natural de dragões, carapaças e criaturas minerais pode ser a **própria integridade corporal**, **sem barra separada de armadura + Vida**.
- Fórmula em análise: **Integridade corporal = Vida básica × multiplicador do grau de dificuldade da criatura**.
- Exemplos autorais: **grau 1 → ×1**; **grau de dificuldade 5 → ×6**. A tabela intermediária está **PENDENTE**, não presumir uma progressão sem decisão.
- Dragão de pedra: Vida básica 12, grau de dificuldade 5, **integridade corporal 72** em uma só reserva; DE de chefe **30** é uma referência de desafio cooperativo extraordinário. Colosso de carne sem armadura natural: **Vida 12**, sem multiplicador de proteção, mesmo sendo fisicamente enorme.
- Meta de duração: aproximadamente 12 **golpes efetivos** de dano médio 6 para reduzir 72; dano médio 5 exigiria em torno de 15. Inimigos de chefe e armaduras comuns podem ter economias de defesa diferentes, respeitando sempre as mesmas regras de teste.

### Peso efetivo, armas, escudos e inventário [DEFINIDO em princípio / PENDENTE fórmula]

- **Armadura leve pesa 0, média pesa 1 ou 2, pesada pesa 3.** Armas e escudos também interferem no balanço de peso, e carga de mochila/inventário ocupa capacidade.
- **Força e Vigor aumentam a capacidade de carregar**, de modo que um personagem forte consegue usar equipamento mais pesado sem automaticamente adquirir condição de sobrecarga. Um fraco tem inventário menor.
- Um personagem corporalmente leve com escudo médio pode tornar-se médio, dependendo da ficha; faca + escudo leve pode preservar categoria leve.
- **Sobrecarga severa / peso excessivo** pode impor Desvantagem condicional. Distinguir ser *categoria pesada por atributos* de estar *sobrecarregado*.
- **[PENDENTE]** Cálculo da capacidade, pesos de armas/escudos, limiares de peso efetivo e interação exata com bônus defensivos.

## 14. Conjuração, graus de magias e especializações [DEFINIDO / PENDENTE]

### Aprendizado, XP, aumentos e slots

- **[DEFINIDO]** Ao optar pela especialização de **Conjuração**, o personagem pode **destinar cada ponto da economia de armas à Conjuração e seus slots de magia**, em vez de usar esses pontos para dados de armas. O valor de cada dado é igual nas duas especializações e não concede arma e magia simultaneamente pelo mesmo investimento. **[PENDENTE]** Custos exatos dos aumentos de Conjuração em XP, limite de slots e regras de troca de especialização. Conjuradores utilizam **slots de magia e pontos de composição** em lugar de comprar dados de armas para conjurar. A composição de dados usa os mesmos valores que a arma (seção 11). Comprar a Perícia **Aprendiz de Conjurador (2 XP)** dá acesso à **Conjuração grau 1**; **Magia Única (1 XP)** permite criar uma magia inicial de grau 1.
- **[DEFINIDO]** O elemento padrão de um Aprendiz de Conjurador é **psíquico**. Outros elementos básicos exigem **Conjuração Elemental (1 XP por elemento)**; Sagrado, Sangue, Trevas e Veneno têm as habilitações próprias de **3 XP** descritas na seção 10. Exceções por Origem podem modificar o acesso, sem conceder gratuitamente todas as especializações.
- **[DEFINIDO]** Cada **aumento de Conjuração** acrescenta **um slot**; a cada **três aumentos**, o conjurador pode **tecer uma magia inicial**, conforme a declaração histórica recente. A cada **três graus de Inteligência**, recebe também **+1 slot**. **[PENDENTE]** Interação entre esse direito de tecer e a Perícia *Magia Única*, gasto/ocupação de slots e custo de XP para comprar aumentos de Conjuração.
- **[DEFINIDO]** O **grau de desenvolvimento de Conjuração** chega pelo menos a **6**, conforme o pré-requisito de conjuração extraordinária. **Não confundir** Conjuração grau 6 com **magia grau 4**: trata-se de escalas citadas distintamente pelo autor, ainda a formalizar em tabela completa de compras.

| Grau da magia | Pontos de composição de dados | Observações |
|---|---:|---|
| **1** | **2** | Ex.: `2d6`, `1d10` ou `4d4` como custo matemático; limites de dados por fonte e Perícias ainda restringem a composição efetiva. |
| **2** | **4** | **Confirmado pelo autor na revisão atual.** d12 custa 3 pontos e fica disponível. |
| **3** | **6** | Permite composições maiores, sujeitas a peso, fonte e retenção. |
| **4** | **8** | Capacidade extraordinária; a composição pode incluir **um d20 (5 pontos)** quando requisitos forem atendidos. |

**[PENDENTE — distinção essencial]** A frase «grau 2 é 4 pontos de dado; precisa ter Inteligência 6, Perícia especial de 5 XP...» antecede uma reafirmação de que **Inteligência 6, Conjuração 6 e a Perícia especial de 5 XP** são requisitos para a **especialização extraordinária do d20**. Registrar esses requisitos como **certos para o d20**, sem presumir silenciosamente que **toda magia de grau 2** também exige Inteligência 6. O acesso normal a cada grau de magia precisa de requisitos explícitos.

### Perícia extraordinária de Conjurador e segundo d20 de área

- **[DEFINIDO]** A Perícia especial de Conjurador custa **5 XP**, mas só é habilitada com **Inteligência grau 6**, **Conjuração grau 6** e **outras especializações relativas a dano e efeitos em área**. Seus nomes e custos de pré-requisito ainda **PENDENTES**. A Perícia, isoladamente, **não concede automaticamente** o d20.
- **[DEFINIDO]** O **segundo d20** de uma magia extraordinária de área **vem de um dado de Inteligência convertido**, não dos pontos de composição de magia.
- **Exemplo demonstrativo válido após cumprir os requisitos:** magia grau 4 formada por `1d20+1d12` usa **5+3 = 8 pontos** de composição. O conjurador dispõe de Inteligência grau 6 (`3d10`) e eleva **um d10 de Inteligência por dois passos até d20**, mediante capacidade extraordinária e **2 Coragens**. A pilha pode, assim, conter `1d20 (magia) + 1d20 (Inteligência) + 1d12 (magia)` mais dados pertinentes do Atributo; não são **10 pontos comprados** na magia.
- **[DEFINIDO]** Mesmo com dois d20, o limite absoluto é de **quatro dados mantidos**, ao menos **um de Atributo**; custos de retenção adicional e restrições por Marco permanecem. A elevação extraordinária em dois passos está ligada à capacidade e não torna toda conjuração capaz de produzir dois d20.
- **[PENDENTE]** Definir em detalhe o que conta como **magia de área**, os pré-requisitos concretos de dano e área, a origem de cada dado na pilha, acesso à elevação de dois passos, frequência de conversão por rodada e custos de retenção.

### Elementos e composição

- **[DEFINIDO]** Magias comuns possuem **um único elemento**. O Conjurador Aprendiz começa pelo **psíquico**. Elementos básicos: fogo, água, raio, vento e terra; em conjuração seu **peso pode variar** segundo composição. Sagrado, Sangue, Trevas e Psíquico são elementos especiais; **Veneno** possui sua habilitação própria.
- **[DEFINIDO]** **Sangue e Trevas** são pesados e exigem **magia no mínimo grau 2**; podem ser enfraquecidos depois. Sagrado é leve, Psíquico é médio e Veneno é leve na tipologia de referência. Os **dados** também contribuem para peso: d6/d10 tendem ao leve, d12 ao médio, dois componentes médios podem gerar pesado, d20 torna a magia pesada. **[PENDENTE]** Algoritmo completo que combina peso do elemento, peso da magia e equipamento sem contradizer a regra de mudança de peso dos elementos básicos.
- **[DEFINIDO]** **Improviso Mágico (1 XP)** permite agregar elemento obtido na cena, conforme o contexto arbitrado; **Mestre Elementalista (5 XP)** cria **um segundo elemento conscientemente** e concede +1A nos testes de conjuração. Outras combinações podem vir de alquimia, encantamentos, roubo/absorção do alvo ou ambiente, sempre com as Perícias e condições pertinentes.
- **[DEFINIDO]** O limite de equilíbrio da composição informado anteriormente é de **8 pontos**; há composições extraordinárias de grau 4 pesadas. A redução voluntária do d20 para d12 pode alterar a categoria da magia, mediante Coragem e conforme o restante da composição. **[PENDENTE]** Quantos pontos de peso/carga são atribuídos por dado e qual o custo efetivo da redução de passo.

### Efeitos específicos elementais e riscos [DEFINIDO / PENDENTE]

| Especialização | Efeito autoral confirmado | Procedimento ainda pendente |
|---|---|---|
| **Sagrado (3 XP)** | Concede **+1E** que pode ser convertido em **1 ponto de Coragem**, para o conjurador ou um aliado, **no máximo uma conversão por conjuração/turno**. Serve de base para bênçãos e sustentação, inclusive para recuperar alguém do Pânico; um E gasto na conversão não vale também para DE ou dano. | Duração e limite dos efeitos de bênção (ex.: aumento de Agilidade), instante de recuperação e resolução do Pânico ao passar de 0 Coragem. |
| **Sangue (3 XP)** | **+1P obrigatório por conjuração; −1 Vida do conjurador sempre, inclusive se falhar; −1 Vida do alvo apenas se acertar**, ignorando a armadura. **Alvos sem sangue são imunes** ao dano sanguíneo. | Se o P adicional pode ser anulado por A e em que momento; como outras imunidades, conjuração composta e efeitos colossais interagem com esse 1 de Vida fixo. |
| **Veneno (3 XP)** | Aplica penalidade de Saúde **sem reduzir a Vida diretamente**. Uma aplicação = **1 acúmulo e 2 turnos do alvo**; duas aplicações = **máximo de 2 acúmulos, por 4 turnos do alvo**. Contar turno **quando o alvo agir ou tentar agir**, não por passagem abstrata de rodada. Alvo jogador gasta **1 Coragem** para anular **1 acúmulo**; inimigo controlado pelo Narrador gasta **1 ponto de Pavor acumulado** indicado pelo autor para o mesmo. | O termo oficial é Pavor tanto para a face quanto para a reserva: definir exatamente **qual reserva de Pavor acumulado o inimigo debita**; intensidade da penalidade, momento de gasto, persistência e reinício da duração. |
| **Trevas (3 XP)** | Adiciona **+2P a uma única rolagem** e permite selecionar **dois alvos distintos no campo de visão** com ela. O bônus P não é multiplicado pelo número de alvos. | Como comparar uma única rolagem à DE de cada alvo e aplicar dano a cada um; destino do Pavor e interação com o fluxo de ativações. |

**Sangue é uma escolha de risco real:** paga-se a Vida do conjurador **antes de saber se vai acertar**; o +1P torna mais provável a intervenção do Narrador, mas não dá ao alvo **um ataque gratuito garantido**. Pelas regras de combate, Pavor não anulado alimenta a reserva de Pavor adversária, e a ativação aprimorada inimiga ainda precisa ser paga. **A imunidade de alvos sem sangue não recupera a Vida sacrificada**.

**Sagrado e Pânico:** o E concedido pode virar Coragem de apoio e ajudar um aliado que está em zero; o **limite de uma conversão por conjuração/turno** está definido. A condição exata para encerrar Pânico ao restaurar Coragem ainda não foi fechada e não deve ser inventada.

**[DEFINIDO]** Os P adicionais expressamente acrescentados à conjuração, como **+1P de Sangue** e **+2P de Trevas**, integram a ação e alimentam a reserva adversária **se não anulados**, mesmo quando contribuem para acerto ou dano; não são P de dados descartados. **[PENDENTE]** Ordem de aplicação, interação com A, imunidades, conversão por Precisão Mágica e resolução contra múltiplos alvos. É proibido contabilizar o mesmo E sagrado como gasto em Coragem e simultaneamente para DE/dano.

### Tempo de conjuração, concentração e Precisão Mágica

- **[DEFINIDO] Magia pesada:** os demais participantes agem primeiro e o conjurador **dispara por último**. Se for atingido antes da conclusão, deve **manter a concentração com base em Vigor**. **[PENDENTE]** DE da concentração, perdas, interrupções, ordem da ação e critérios de concluir a magia sob protagonismo fluido.
- **[DEFINIDO como caminhos de especialização]** Conjuradores podem ampliar o efeito de **Pavor em dano de área**, desenvolver Perícias para **remover Pavor** das magias ou transformá-lo em **Êxito em magias de alvo único** por **Precisão Mágica**. **[PENDENTE]** Custos, razões de conversão, requisitos e quais efeitos permanecem após gastar/cancelar os símbolos.
- **[PENDENTE]** Perícias de Encantamento de Armas, alquimia elemental avançada e outras formas de conjuração híbrida; elas não devem ser supostas gratuitamente pela compra de Conjuração.

## 15. Três intenções de ataque [EXPERIMENTAL / PENDENTE]

- **Geral:** atingir normalmente, respeitando a proteção aplicável.
- **Não Letal:** conter, desarmar, atordoar ou incapacitar sem buscar matar; pode causar ferimento real se atingir o corpo, não é automaticamente nocaute.
- **Letal:** procurar vulnerabilidade vital; maior DE, mas não mata automaticamente, nem ignora toda armadura.

Fórmulas **antigas NÃO APROVADAS** do livro: `DE Não Letal = Agilidade + Destreza + proteção` e `DE Letal = 2×(Agilidade + Destreza) + proteção`; DE Geral não foi fechada. **Não aplicar essas fórmulas junto da nova DE defensiva `Agilidade + ⌊Destreza/2⌋` sem revisão**, pois haveria dupla contagem e desproporção entre construções.

### Críticos de categorias de armas [DEFINIDO como princípio / PENDENTE catálogo]

**[DEFINIDO]** O crítico geral continua exigindo **dois dados mantidos em suas faces máximas**, concedendo +1E e recuperando 1 Coragem. Além disso, **cada categoria/tipo de arma poderá aplicar seu efeito especial de crítico**, cuja forma definitiva ainda não foi fechada. Exemplos do autor: **armas pesadas** podem derrubar inimigos ou oferecer uma finalização extraordinária; **adagas** podem alcançar áreas vitais mediante Êxitos suficientes. Os efeitos de espada, arco e demais armas, requisitos de acerto, comparação às intenções Geral/Não Letal/Letal e possibilidade de múltiplos efeitos ainda são **PENDENTES**.

**[PROPOSTO]** Especialistas em finalização podem **dobrar os Êxitos** de um ataque quando o alvo estiver em **Desvantagem Absoluta** (por furtividade, superioridade numérica ou estado vulnerável estabelecido na cena), possivelmente gastando **2 Coragens** e uma Perícia avançada. Isto **não** é bônus universal de armas pesadas: precisa de condição e custo. Outra via física extraordinária em estudo é o bônus fixo **+3E**, próximo ao ápice do nível 20. Não apresentar qualquer uma como Perícia já aprovada; controlar o limite individual desejado DE25 e o acúmulo com outros bônus.

## 16. Alvos de balanceamento para playtest [EXPERIMENTAL / PROPOSTO]

1. **DE base de infectado simples 1**; armaduras iniciais leve +3, média +2, pesada +0 à DE de ataque recebido, conforme seção 13. Comparar com ataques de grau e arma adequados, **incluindo Vantagem e Desvantagem por afinidade**; não concluir com probabilidades sem afinidade.
2. **Referência de DE 15** para defesa individual extremamente especializada, **DE 20** apenas com condições extraordinárias como invisibilidade; **DE 30 máxima** para ações conjuntas excepcionais. DE 20 também pode aparecer como desafio de chefe para grupo avançado. A nomenclatura final das faixas depende de teste.
3. **Meta de armadura pesada:** ordem de 8 golpes efetivos médios em equipamento de altíssimo grau; **referência de dano médio 4–5** (não é média já demonstrada para fichas completas). Jogador robusto ainda possui sua Vida após a integridade da armadura. Medir a alteração com magias de **Sangue (1 Vida direta), Trevas (+2P/dois alvos), Veneno (penalidades por turnos próprios) e Sagrado (recuperação de 1 Coragem)**.
4. **Dragão natural:** exemplo 72 de integridade corporal (12 Vida base, ×6), DE máxima 30 no cenário extremo; a durabilidade também depende de quanto três jogadores realmente acertam e causam dano.
5. Montar fichas **compráveis pelo XP efetivo por nível**: especialista em ataque, híbrido, ágil, robusto, conjurador, chefe e mobs. Para cada uma medir **acerto limpo, acerto com Pavor, falha limpa, falha com Pavor, dano, Pavor gerado/acumulado após anulações, gasto de Coragem, ferimentos, duração da proteção e eficácia de ações conjuntas**.
6. **[PENDENTE]** Confirmar tabela de XP total por nível 1–20 perto da referência 561, custo de graus de armas/conjuração, bônus máximos acumuláveis, grade de dificuldade de criaturas, distribuição de slots e recursos de bossfight. Simular também **+1E, +2E e +3E físicos, e Finalização ×2E sob condição severa, como propostas de técnicas avançadas sem d20 comum**, com custos de XP, Coragem, requisitos e riscos definidos antes de consolidar.

### Primeiro benchmark exato de ameaça — 3 dados mantidos (registro histórico comparativo) [EXPERIMENTAL]

Para iniciar o teste de DE, comparar **duas rolagens hipotéticas que mantêm todos os três dados**, sem dados descartados: (A) **3d10** convencionais; (B) **2d20+1d10**, só com capacidade extraordinária e Pavor suficiente. Contar **E + P + ⌊A/2⌋**, usando 2A→1E para maximizar DE, e **+1E de crítico** quando pelo menos dois dados mantidos mostram suas faces máximas. **Não** anular P, **não** considerar habilidade, Vantagem, armadura, reação, dano nem ordem tática de Antecipar. Enumerar respectivamente **1.000** e **4.000** resultados equiprováveis. Esta hipótese **não** avalia uma build real nem demonstra a frequência de acesso aos dados extraordinários.

| Indicador | 3d10 | 2d20 + 1d10 |
|---|---:|---:|
| **DE máxima bruta possível** | **10** | **15** |
| Pavor médio mantido/gerado pelo inimigo | **1,50P** | **2,20P** |
| Chance de gerar ao menos 1P | **87,50%** | **89,88%** |
| Chance de superar **DE 5** | **33,30%** | **59,10%** |
| Chance de superar **DE 7** | **5,60%** | **30,73%** |
| Chance de superar **DE 10** | **0,10%** | **6,48%** |
| Chance de superar **DE 12** | **0%** | **1,35%** |
| Chance de superar **DE 15** | **0%** | **0,025%** |

**Interpretação:** esta comparação de três dados permanece válida como cenário **sem o quarto dado**; não representa mais o limite absoluto de monstros de graus 5–6. A pilha extraordinária amplia o alcance ofensivo, mas gera **mais Pavor médio aos jogadores em forma de Coragem** quando rola pelo lado inimigo. A principal dificuldade pode ser montar e pagar a pilha, já que o monstro de grau 6 com estoque cheio paga **6P** para ativar, elevar **dois d10 em dois passos cada** e manter três dados. Os resultados de DE incluem **acertos com Pavor**: não confundir acerto bruto com execução segura. Para balancear inimigos humanoides e companheiros, substituir esta referência por fichas com XP e fontes reais, ações conjuntas e efeitos de distância.

### Novo benchmark exato — quarto dado de grau 5–6 [EXPERIMENTAL]

Enumeraram-se todas as faces equiprováveis, **mantendo todos os dados indicados** e sem descartes. Resultado ofensivo considerado: **E + P + ⌊A/2⌋ + 1E por crítico** (ao menos dois dados mantidos nas respectivas faces máximas). Esta é a **estratégia de maximizar DE bruta**, sem anular P; não equivale a uma estratégia de controlar Pavor ou assegurar protagonismo. Não inclui bônus naturais, vantagens, arma, área, dados rolados e descartados, XP, custos de acesso nem modificação de DE do alvo.

| Pilha mantida | Casos exatos | Chance de DE ≥ 5 | Chance de DE ≥ 7 | Chance de DE ≥ 10 | DE bruta máxima | Pavor médio mantido |
|---|---:|---:|---:|---:|---:|---:|
| 3d10 | 1.000 | 33,30% | 5,60% | 0,10% | 10 | 1,50P |
| **4d10** | **10.000** | **63,19%** | **23,69%** | **2,22%** | **13** | **2,00P** |
| 2d20 + 1d10 | 4.000 | 59,10% | 30,73% | 6,48% | 15 | 2,20P |
| **1d20 + 3d10** | **20.000** | **70,92%** | **37,88%** | **7,96%** | **16** | **2,35P** |
| **2d20 + 2d10** | **40.000** | **77,02%** | **49,26%** | **15,62%** | **19** | **2,70P** |

**Conclusão limitada:** reter o quarto dado é relevante, mas **não resolve sozinho ataques contra DE 10**. Um boss deverá depender também de habilidades naturais, fontes de dados, oportunidades táticas, afinidades e escolha entre dano em área, mobilidade e precisão. A quarta retenção tem custo de oportunidade real: obter **2d20 + 2d10** a partir de dois d10 (dois passos por dado) custa **7P incluindo ativação** nas condições do exemplo anterior e exige **1P público adicional**, redução de custo ou fonte natural apropriada. Como Pavor de inimigos mantidos concede Coragem aos jogadores, o aumento de exposição também precisa entrar na análise de risco.

### Checagem exata da alteração "somente dados mantidos" [EXPERIMENTAL — ilustração]

Considerou-se uma pilha de **1d10 de Atributo + 2d10 de Prática** (1.000 resultados equiprováveis), mantendo **dois dados**, sempre incluindo o dado de Atributo. Para tornar a conta reprodutível, entre os dois pares possíveis escolheu-se o de maior **E+P bruto**; no empate, o de **menor P**, e depois maior A. **Não** se gastou A, nem se aplicaram crítico, dano, modificadores ou Coragem. Essa seleção é só uma **estratégia ilustrativa**, não uma regra obrigatória de escolha de dados.

| Medida | Regra antiga incorreta: contar P de todos os rolados | Regra corrigida: contar somente P mantido |
|---|---:|---:|
| Pavor médio transferido por rolagem | **1,50** | **1,05** |
| Probabilidade de transferir pelo menos 1P | **87,5%** | **77,5%** |
| Pavor em 1.000 testes | **1.500** | **1.050** |

**Resultado:** sob estas hipóteses, a correção reduz em **30%** o Pavor médio alimentado ao inimigo; a probabilidade de gerar pelo menos 1P cai **10 pontos percentuais**. A redução efetiva muda com as fontes, a escolha de dados e as decisões de Antecipar. **Não extrapolar** estes números para todas as builds ou para uma taxa completa de protagonismo sem simular acerto, dano e uso de A.

## 17. Divergências expressas com o SRD v0.9 e livro publicado

| Tema | Registro antigo | Decisão atual / cuidado |
|---|---|---|
| Nome do limiar | DT | **DE**. |
| D20 | Faces pendentes | **20 faces identificadas**, 1–12 herdadas de d12; duas unidades possíveis em conjuração de área específica **ou monstros extraordinários habilitados**, mantendo seus tetos de dados. |
| Ativação de inimigo | Até 4 pontos de Pavor totais; v0.14 mantinha teto de 5 gastos | **Ação básica sem Pavor** (até 2 dados, sem habilidades/passo), salvo fuga de inteligentes sem líder; **1P por capacidade pertinente**, estoque local de **grau 1 a 6**, e graus **5/6 gastam tudo** se necessário. Custos de aproximação 1/2/3 já incluem ativação. |
| Vida | `3 + Vigor` | **`3 + Vigor + ⌊Força/2⌋`**. |
| DEF de Atributos | Hipóteses antigas de Não Letal/Letal | **`Agilidade + ⌊Destreza/2⌋`**, sem somar mecanicamente as fórmulas antigas. |
| Coragem e crítico | 1 passo; crítico recupera Coragem | **Crítico também +1E**; quatro dados requerem capacidade e gasto; novos usos de Saúde/Conjuração. |
| XP por nível | 5 por nível e total indicativo 109 | **XP livre**, nova referência **561 totais nível 20** ainda **PROPOSTA**, tabela a definir. |
| d12 de equipamento | Preço pendente | **3 pontos**, mesmo orçamento de dados para armas e magias; **d20 = 5**. |
| Armadura | `2 × grau` | Escala **×1 leve, ×2 média, ×3 pesada** sobre **valor-base do grau do equipamento** (tabela base pendente). |
| Armadura natural | Pouco definida | Pode ser integridade corporal única; multiplicador por grau de dificuldade, exemplos grau 1 ×1 e grau 5 ×6. |
| Elementos e vantagens | Ausentes | Afinidades de arma e conjuração, resistências, imunidades, escalonamento com condição e dano separado da DE. |
| Retenção IV | Até 4 pelo Marco | Requer **capacidade especial** e gasto de **Coragem** para adicional; não gratuita. |
| Conjuração de área | Ausente | **Segundo d20 de Inteligência convertida**, nunca comprado dentro dos 8 pontos de composição da magia. |
| Composição de magia grau 2 | Valor não fechado na v0.10 | **4 pontos de dados**, grau 1/2/3/4 = **2/4/6/8** pontos. |
| Conjurador Aprendiz | Capacidade sem árvore detalhada | **Aprendiz de Conjurador 2 XP, Magia Única 1 XP e elemento inicial Psíquico**; Catálogo de Perícias e requisitos extraordinários em §10/§14. |
| Especializações elementais | Sem preços/efeitos | **Sagrado/Sangue/Veneno/Trevas 3 XP cada**, efeitos específicos; Mestre Elementalista 5 XP e Improviso Mágico 1 XP. |
| Sangue | Dano ao alvo e ao conjurador ainda sem procedimento fechado | **1 Vida do conjurador sempre, 1 Vida do alvo somente no acerto, sem armadura; sem sangue = imunidade; +1P**. |
| Magia Sagrada | Conversão E→Coragem sem quantidade/limite | **No máximo 1E→1 Coragem por conjuração/turno**; pode apoiar aliado e bênçãos. |
| Veneno | Duração geral pouco operacional | **2 turnos do alvo para 1 acúmulo, 4 para 2; um turno passa quando o alvo age ou tenta agir; remover um acúmulo custa 1 Coragem para PJ ou 1 ponto de Pavor acumulado pelo inimigo a precisar**. |
| Trevas | Dois alvos mencionados, divisão imprecisa | **Um único teste seleciona dois alvos visíveis**, com **+2P apenas uma vez na pilha**; comparação das DE de cada alvo ainda pendente. |
| Comércio arma/conjuração | Tabelas de pontos iguais, mas transferência pouco explícita | **Cada ponto que seria de composição da arma pode ser destinado a Conjuração e seus slots** ao escolher essa especialização. |
| Técnicas físicas | Direção histórica de até +2E | **Direção atual para técnicas avançadas: bônus fixo até +3E como proposta e Finalização ×2E sob abertura severa, geralmente sem d20; hipótese antiga de +4E não aprovada**. |
| **Nomenclatura do recurso** | "Pressão" para reserva, "Pavor" para face; "Improviso" para A | **Pavor** para face **e** reserva; **Antecipar** para A. Sem segunda economia. Nomes próprios de Perícias preservados. |
| **Pavor em dados descartados** | v0.13 contabilizava P de toda a pilha | **Revogado:** apenas P dos **dados mantidos** e bônus efetivamente incorporados à ação podem produzir efeitos. Dados descartados não geram recurso, Coragem, crítico, DE nem dano. |
| **Coragem de Pavor inimigo** | v0.13 dizia 1 Coragem por P apenas em falha inimiga | **Qualquer P não anulado mantido pelo inimigo** gera Coragem aos jogadores, **independentemente de acerto ou falha**; rateio pendente. |
| **Uso do Pavor mantido** | Leitura equivocada de que gastar P na técnica poderia impedir a transferência | **Uso não cancela transferência:** o P pode servir à DE, dano ou fuga do Covarde **e** ir para a reserva inimiga. Só anulação expressa com A impede os efeitos. |
| Reserva do Narrador | “Somente iniciar conflito” | **Saldo público**, até **1P por oportunidade**, para intervir em cenas de protagonismo sem resposta inimiga imediata ou complementar boss; início de conflitos pendente. |
| Pavor local inimigo | Reservas sem escala definida, teto antigo de 5P por ativação | **Capacidade local por grau: 1/2/3/4/5/6P**; grau 5–6 pode **gastar tudo** numa oportunidade; 1P de ativação não é bônus grátis. |
| Monstros não humanoides | Tratados parcialmente como jogadores | **Até 3 dados mantidos nos graus 1–4; até 4 nos graus 5–6** mediante custos e capacidades pertinentes. Os dois d20 extraordinários não dispensam o pagamento de retenção; humanoides comuns usam regras de jogador. |
| Animais e montarias | Sem economia consolidada | Pequenos sem ficha/ataque; médios ou maiores têm ficha e XP próprio limitado à categoria, nível ao ser domado **≤ dono**; requisitos de Influência/Destreza. |
| Combinação de fontes | Terceira fonte habilitada, ordem pouco clara | Perícia de combinação **2 XP** e **fonte principal** determina o tipo de ação; combinação não fornece retenção extra automaticamente. |
| Montaria I (1 XP) | Registro anterior | **Montar Animal 2 XP**, Montar Exótico 4 XP, Montar Voador 5 XP, com requisitos autorais atuais. |

## 18. Pendências prioritárias — não preencher sem autorização

1. **XP dos níveis 1–20:** manter XP livre, orçamento de referência 561 no nível 20 **EXPERIMENTAL/PROPOSTO** e fechar tabela de XP acumulado e XP de entrada para animais de cada nível. Criação humana 14 XP versus 3 XP iniciais de Perícias ainda precisa de reconciliação.
2. **Progressão de companheiros:** taxa de XP própria (menor que a do jogador), nível inicial ≤ dono, cálculo do XP máximo por nível, exemplos de animais reais no Marco I–IV e disponibilidade de companheiros ativos. O **teto por categoria 110/165/220 XP já está estabelecido**.
3. **Domar/Montar/Cavalaria:** requisitos cumulativos, requisito de Influência para **domar** exóticos (não confundir com montar), bônus condicionais de pet pequeno, ordens, +1A de passagem, ação conjunta, montaria voadora e retenção do animal. Os preços e requisitos já citados no §10 são atuais.
4. **Fluxo exato do Pavor:** alocação entre ameaças próximas e em grupos, excedentes com outra ameaça capaz de atacar, teste de elegibilidade da reserva do Narrador, gatilho de intervenção nas falhas limpas, visibilidade da reserva e sequência de retorno aos jogadores. O **Narrador gasta no máximo 1P por oportunidade** e **Pavor local máximo = grau 1–6**.
5. **Custos de capacidades inimigas:** diferenciar 1P base de ataque à distância de acréscimos para corrida/área/movimento, preço de arremessos, poderes naturais sem custo, abertura de novos conflitos, possibilidade de 1P público completar boss acima do seu teto local. Não cobrar ativação duas vezes nos custos 1/2/3 de alcance corpo a corpo.
6. **Progressão e retenção do jogador:** interação de Maestrias, Perícias de terceira fonte, pagamento de Coragem e Marcos I–IV; quarto dado exige habilidade apropriada, **teto 4**. Para não humanoides: **até 3 dados mantidos nos graus 1–4, até 4 nos graus 5–6** mediante Pavor.
7. **Armas/Conjuração:** XP por ponto de composição, graus de equipamento, compra de slots, criação de magia a cada três aumentos; requisitos normais dos graus 2–4 e cadeia completa d20 de Inteligência/Conjuração 6.
8. **Ações conjuntas e DE 25/30:** método de somar E/P/A de até três participantes (podendo ser animal com ficha); cálculo de dano composto; efeito de vantagem, resistência e imunidade em cada alvo; condição que torna **DE25** teto individual real.
9. **Vida/armaduras/integridade:** tabela-base por grau de armadura, peso e capacidade de carga, proteção natural, ferimentos e dano colossal; efeitos de arremesso/área nos três tipos de defesa.
10. **Coragem, Pânico, Saúde:** momento e duração dos usos de Coragem, recuperação e distribuição, +1P/−1A de Pânico ainda **PROPOSTOS**, remoção de Pânico e redução voluntária de passo.
11. **Conjuração detalhada:** peso de magia, concentração por Vigor, barreira elemental, tempo da magia pesada, bênçãos, Sangue, Veneno, Trevas e Precisão Mágica — manter custos/efeitos já definidos.
12. **Origens/Personalidades:** modificadores raciais de XP, efeito numérico de Corajoso, Medroso/Assustador/Intuitivo, Covarde (crescimento do movimento por P mantido), alterações nos Marcos.
13. **Crítico por arma e finalizações:** catálogo de armas, requisitos de acerto, efeitos especiais, +3E físico e multiplicação condicional com Desvantagem Absoluta/Coragem. Permanecem PROPOSTOS, não bônus oficiais.
14. **Escala de encontros:** referência de XP e grau, fichas de minions, humanoides com pets, conjuradores e colossos; medir Pavor do inimigo como Coragem gerada aos jogadores e ação básica sem Pavor com fuga de inteligentes sem líder.

## 19. Próximos passos de balanceamento — protocolo acordado [EXPERIMENTAL]

**Ordem recomendada antes de elaborar catálogo amplo de Perícias:**

1. **Fixar cenários de teste sem inventar regras:** fichas comparáveis em **Marco I** (guerreiro sem pet; caçador com pet médio do mesmo nível ou inferior; arqueiro; conjurador; inimigo humanoide) e **Marco II** com montaria ou lobo grande; XP do animal como **variável explícita** até taxa ser aprovada.
2. **Testar economias de ação antes de dano:** para cada rolagem, registrar E, A, P dos **mantidos**, anulação de P, saldo local por grau, excedente elegível, saldo público do Narrador, passagem por 1A, fuga/ação básica e retorno do protagonismo.
3. **Testar custos posicionais e áreas:** corpo a corpo vs conjurador médio (2P para chegar e bater); vs atirador distante (3P); inimigo ranged (1P); gigante golpe em área natural e custo para ampliar, resolvendo individualmente a DE de cada alvo.
4. **Testar companheiros:** animal pequeno somente auxílio condicionado; médio com ficha própria e ação passada por A; grande montado; exótico/alado. Verificar quantas ações independentes aparecem, quando o animal morre/é separado e quais funções do dono ele realmente substitui.
5. **Escala de DE e sobrevivência:** para cada ficha e cenário, medir acerto limpo, acerto com P, falha limpa, falha com P, média de E/A/P mantidos, Coragem fornecida por inimigos, dano, integridade, Vida, movimento e resultados de ação conjunta até DE30.
6. **Só depois** calibrar potência máxima por Perícia, eficácia de Maestrias e custo de graduações/slots. Não confundir fonte adicional com dado mantido adicional nem estourar os tetos 4/3 de jogador/monstro.

Os benchmarks exatos de dados para não humanoides, incluindo a retenção extraordinária de quatro dados, estão na §16. Ele **não substitui** fichas compráveis em XP, terreno, posição, ordem de ação, armaduras ou especializações.

## 20. Registro das decisões incorporadas à v0.15 e atualização v0.16

| Estado | Decisão / ressalva |
|---|---|
| **DEFINIDO** | Reservas locais de inimigos por grau 1–6; grau 5/6 podem gastar todo saldo; Pavor de dados descartados não conta; uso de P mantido pelo rolador não impede transferência. |
| **DEFINIDO** | Narrador mantém Pavor público; pode gastar **apenas 1P por oportunidade**, para intervenções de cena e complemento de chefes; não repete gasto na mesma passagem. |
| **DEFINIDO** | Inimigos gastam P para distância, área, passos, corrida e retenção; não há acerto automático; monstros não humanoides extraordinários de graus 1–4 mantêm **até 3 dados**, e os de graus 5–6 podem manter **até 4 dados**, mediante capacidade e custo; até **2d20 extraordinários** exigem habilitação e Pavor. |
| **DEFINIDO** | Animais médios+ têm ficha, risco e XP próprio menor; nível ao domar ≤ dono; tetos categoria 110/165/220 XP; pequenos apoiam sem ataques próprios; donos podem usar +1A pertinente para passar ação. |
| **DEFINIDO** | Requisitos Influência 2 (pet médio/montaria), Influência 3 (pet grande), Influência 4 (montaria exótica), Influência 4 + Destreza 4 (montaria voadora); Perícias Domar 2/3/4/5 XP, Montar 2/4/5 XP. |
| **DEFINIDO** | Perícias de combinação custam 2 XP; fonte principal determina aplicação da ação; combinação de três fontes não equivale a três dados mantidos. |
| **EXPERIMENTAL** | Benchmark matemático de 3d10 versus 2d20+1d10, sem simulação de encontro; orçamento nível 20 de 561 XP permanece referência ainda não aprovada como tabela. |
| **PROPOSTO** | +3E de técnica física de ápice ou Finalização com ×2E sob Desvantagem Absoluta e possível custo de 2 Coragens; limitar companheiros simultâneos a um por domador em playtest. |
| **PENDENTE** | XP animal por nível, fluxo exato de excedentes com múltiplas ameaças, efeitos de montaria, habilidade de retê-los, Maestrias, preços de arremesso e criação de conflito, catálogo de Perícias e DE por nível. |

### Atualização da v0.16 [DEFINIDO]

- Monstros não humanoides de **graus 5–6** passam a poder **manter até quatro dados**, mediante o custo normal de **1P por dado extra**, sem obter automaticamente dois d20 ou capacidades especiais. Monstros de graus 1–4 conservam **até três** dados mantidos.
- A nova tabela exata da §16 registra o efeito do quarto dado, inclusive a diferença de orçamento entre 3d10, 4d10, 2d20+1d10, 1d20+3d10 e 2d20+2d10.
- O limite de **1P da reserva pública do Narrador por oportunidade** e o teto de **6P locais em grau 6** permanecem inalterados.

## 21. Instrução de continuidade

> A partir de 8 de novembro de 2026, usar **SRD de Continuidade v0.16** como referência de projeto para **Codex RPG**, mantendo o histórico v0.14 sem misturar regras revogadas. Priorizar sempre a decisão explícita mais recente do autor. Símbolos e reservas chamam-se **Êxito, Antecipar e Pavor**; **dados descartados nunca produzem efeitos**; Pavor mantido não anulado tem uso próprio **e** repercussão adversária; P inimigo gera Coragem. **Reserva local por grau 1–6, reserva pública do Narrador com até 1P por oportunidade, monstros não humanoides com até 3 dados mantidos (graus 1–4) ou 4 (graus 5–6, mediante custo), companheiros com XP/nível limitados e Perícias de combinação fundamentadas na fonte principal.** O Livro do Jogador e o repositório **não foram alterados**; só publicar com aprovação expressa. Tudo o que estiver marcado **PROPOSTO, EXPERIMENTAL ou PENDENTE** não deve ser apresentado como regra definitiva.

---

**Fim do SRD de Continuidade v0.16 — Codex RPG.**