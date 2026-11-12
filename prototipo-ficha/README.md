## Criador e ficha unificados

**Página única e canônica:** `prototipo-ficha/`. O endereço histórico `criador.html` agora redireciona para cá, sem remover o registro antigo do navegador.

A nova ficha usa colunas **Atributos à esquerda**, **Práticas no centro** e **Conhecimentos à direita**. O usuário pode selecionar o Atributo ou a Base primeiro, mas a pilha ainda deve **rolar pelo menos um dado de Atributo**. A regra não exige Atributo mantido.

**Migração:** caso a ferramenta nova ainda não tenha personagem salvo, tenta trazer a ficha antiga armazenada sob `codex-rpg-ficha-nivel1-v1`. Nunca apaga o registro anterior. O botão **Importar ficha antiga** permite refazer a importação deliberadamente (com confirmação de substituição da ficha nova). Perícias personalizadas ou IDs sem tradução automática são documentados nas notas da ficha e continuam disponíveis na cópia antiga do navegador. Exportar JSON antes de substituir personagens continua recomendado.

## Provocar e Provocação Sofisticada

**Provocar** é ação tática básica: teste de Influência **≥ DE** do inimigo para provocar. No turno do alvo, ataques contra aliados do provocador têm **Desvantagem (−1A)**; ataques contra quem o provocou têm **Vantagem (+1A)**. **Provocação Sofisticada** exige **Influência 2** e custa **1 XP**; **benefício adicional distinto ainda PENDENTE**, porque a descrição fornecida repete o efeito básico. A ficha informa isso, sem automatizar condições de inimigos.

# Codex RPG — Criador e ficha jogável unificados

**Estado:** criador e ficha jogável unificados, com regras experimentais identificadas; adaptação Foundry. Não é o Livro do Jogador, nem substitui o criador atual.

## Acessar

**Versão web** (após o GitHub Pages disponibilizar os arquivos): https://ike-grifact.github.io/Codex-RPG/prototipo-ficha/

**Código:** https://github.com/Ike-Grifact/Codex-RPG/tree/main/prototipo-ficha

Também é possível baixar o repositório e abrir `prototipo-ficha/index.html` diretamente em um navegador. O projeto referencia o CSS e a logo que já existem em `../assets/`.

Esta pasta é a **única interface ativa** para criação e ficha. O antigo `criador.html` direciona para ela; o programa antigo `assets/creator.js` fica como código histórico, sem executar no site. A ficha usa sua chave própria de `localStorage`, pode importar os dados legados da chave antiga e **não apaga** a ficha original armazenada.

## Como experimentar — fluxo de criação

**Ao abrir uma ficha nova**, você vê o **construtor em cinco telas independentes**, não a ficha jogável de uma vez:

1. **Identidade** — nome obrigatório, conceito, origem, virtude, personalidade e portrait. A logo padrão usa fundo marfim no escuro para preservar o contraste; uma imagem enviada usa corte fotográfico normal.
2. **Atributos** — seis fontes com seu Grau, dados gratuitos, custos incrementais e botões de investimento; orçamento inicial **6 XP (EXPERIMENTAL)**.
3. **Formação** — seis Conhecimentos e seis Práticas, incluindo **uma única Prática Disciplina**; todos têm 1d6 gratuito no Grau 0, e compartilham **8 XP (EXPERIMENTAL)**.
4. **Perícias** — seleção de habilidades com preços, requisitos e custo efetivamente cobrado do orçamento inicial **5 XP (DEFINIDO)**. Maestria Arma Certa aparece como **PENDENTE para compra**, já que seu custo final ainda não foi fixado.
5. **Revisão** — identificação, dados de combate derivados, investimento por categoria e todas as compras. O botão **Concluir e abrir a ficha** consolida a criação e mostra **somente então** a ficha jogável completa.

Navegue com **Continuar** e **Voltar**. As etapas já visitadas ficam disponíveis na trilha superior. Se sair ou atualizar o navegador, os campos e a etapa são lembrados localmente. Para voltar a uma criação nova após finalizar, use **Novo personagem**; exporte a ficha anterior antes, pois essa operação a substitui.

**Na ficha completa:** experimente a composição **Armas → Força → Apresentação** e sua inversão, prepare a rolagem, escolha os dados mantidos e finalize. Inventário, Coragem, PP, XP e movimentação continuam disponíveis.

**Carregar exemplo** abre diretamente uma ficha já consolidada, para testar a parte jogável sem passar pelas cinco telas. **Importar** retoma o construtor para personagens ainda em criação e abre a ficha completa para personagens com criação concluída.

## Correções visuais desta versão

- **Modo escuro:** a logo SVG original contém grandes áreas cinza-escuro e não pode ficar sobre fundo escuro. Um fundo marfim permanente e `object-fit: contain` foram aplicados ao emblema padrão do personagem; o pequeno logo do cabeçalho ganhou a mesma base clara. Retratos personalizados permanecem sem o fundo de emblema.
- O criador agora usa painéis distintos por etapa e um resumo lateral de XP, progresso e estatísticas. Na conclusão, exibe a ficha integral já existente. Telas menores recebem layout responsivo.
- A identidade cromática anterior dos dados permanece: d4 roxo, d6 azul, d10 verde, d12 cinza e d20 dourado.

## Regras respeitadas

- São **6 Atributos, 6 Conhecimentos e 6 Práticas**. Disciplina é uma única Prática, e as Perícias determinam o uso marcial ou mágico.
- Todo teste começa por um **Conhecimento ou Prática (Base)** e recebe um **Atributo** como segundo componente. Uma terceira fonte é opcional, de Conhecimento ou Prática, com habilitação apropriada.
- Terceira fonte só aparece com Perícia habilitadora e **confirmação de pertinência**: a lista detalhada de combinações ainda exige decisão autoral.
- Até 9 dados rolados; retenção de 2 normalmente até o nível 5, 3 a partir do nível 6, ou mais 1 com Coragem, teto 4.
- Ao menos um dado mantido é de Atributo.
- Só dados mantidos produzem símbolos E/A/P. O resultado distingue acertos puros, acertos com Pavor normal/predominante e falhas.
- A DE defensiva é Agilidade + metade de Destreza arredondada para baixo; Vida máxima é 3 + Vigor + metade de Força arredondada para baixo.
- Perícia em Coragem a partir do nível 5; recuperação de PP 2 Coragem → 1 PP, no máximo uma vez por turno.
- Recuperação de Vida por faixas 3/3, 2/3 e 1/3 é apresentada sem criar um temporizador de cura não aprovado.

## Limites e hipóteses do protótipo

- **A compra de graus e Perícias agora calcula e consome XP**. Os custos acumulados das fontes são os mesmos do criador: Atributos 0/1/3/7/15/31/55 e Formação 0/2/8/20/38/66/102. As Perícias são cobradas conforme os preços documentados no catálogo.
- **O nível 1 possui 5 XP iniciais de Perícias [DEFINIDO].** Os 6 XP de Atributos e 8 XP de Formação ainda são **EXPERIMENTAIS**. Uma compra que exceda seu orçamento de categoria requer XP de evolução livre.
- **XP por nível segue PENDENTE.** A tabela de referência 19/31/46/.../664 XP é apenas uma curva de playtest; o protótipo não exige esses valores para subir de nível e não os concede automaticamente.
- **Antes de concluir a criação**, pode reorganizar compras. **Depois**, não permite reduzir graus nem desfazer Perícias; evolução é feita comprando com novos XP.
- **Maestria Arma Certa** aparece para consulta com seu efeito definido (+1E no peso favorável); seu custo de XP e requisitos finais continuam PENDENTES, por isso ainda não é comprável.
- Equipamentos não acrescentam dados nem resistência automática: a composição específica e os valores de integridade ainda dependem do catálogo final. A carga está apresentada com a contribuição da Prática compartilhada de forma **experimental**.
- A terceira fonte possui confirmação manual em vez de um catálogo exaustivo de compatibilidades.
- **Deslocamento — DEFINIDO nesta revisão:** 8 m básicos + 1 m por grau de Agilidade + 1 m por cada 3 graus completos de Atletismo. O resultado é exibido no cabeçalho. Alterações por terreno, equipamentos e condições não são automatizadas.
- **Identidade cromática dos dados:** d4 roxo (Pavor), d6 azul (Antecipar), d10 verde (Êxito), d12 cinza e d20 dourado; o tema escuro foi ajustado e a legenda exibe todos os cinco formatos.
- Furtividade, magias especiais, recursos de ameaça, Pavor público/local, efeitos de armaduras e combates grupais não estão totalmente automatizados.
- O rebalanceamento recente de peso, Vantagem absoluta e Arma Certa ainda não foi integralmente incorporado ao motor de rolagens; não confundir a prévia visual com a tabela definitiva de combate.
- Rolagens já reveladas ficam salvas e só podem ser descartadas com confirmação expressa.
- Não é um motor autoritativo online/multijogador e não implementa Foundry. O propósito é **testar a experiência HTML antes de aprovar sua adaptação**.

## Arquivos

```
prototipo-ficha/
  index.html   # visual da ficha e acessibilidade básica
  styles.css   # identidade visual Codex e responsividade
  app.js       # estado, escolha de fontes, dados, rolagens e salvamento local
  README.md    # instruções e limites
```

**Atenção:** os documentos internos de SRD não estão vinculados nesta página; apenas o Livro e o criador originais são acessíveis pela navegação.

## Modo edição e runas nas faces — atualização de 11/11/2026

Na ficha jogável, o botão **Editar ficha** alterna entre o modo normal (clicar nas fontes para montar a rolagem) e o modo de edição (botões **+** e **−** para corrigir graus e XP de Atributos, Conhecimentos e Práticas). Nesse modo também é possível desfazer Perícias adquiridas, desde que não invalide seus requisitos. O modo edição não funciona durante rolagem pendente. O XP investido e o XP livre são recalculados automaticamente; **isso corrige a ficha, não cria uma regra de reembolso de XP em campanha**.

A fonte compartilhada passou a se chamar **Disciplina**. Fichas existentes com o identificador interno `armas_conjuracao` mantêm seus graus e XP: só mudou o nome visível, não os dados salvos.

Nos dados rolados, o destaque principal mostra **as runas reais da face repetidas uma vez por símbolo** (por exemplo, **ᛋ ᛋ ᚦ**, em vez de uma face numérica grande). As contagens menores continuam sob o dado e os valores numéricos das faces permanecem preservados para cálculo, acessibilidade e críticos.

**Retenção corrigida:** ao menos um dado de Atributo deve ser **rolado**, mas o jogador é livre para descartá-lo e manter apenas outros dados válidos. O crítico de duas ou mais faces máximas também não exige Atributo mantido.


## Armaduras por tipo e Grau (SRD v0.38)

O tipo de armadura é independente do Grau: **Muito Leve** (sem Integridade, +2 DE na esquiva), **Leve** (Integridade baixa, +1 DE na esquiva), **Média** (0 DE), **Pesada** (−1 DE) e **Muito Pesada** (−2 DE, imunidade física natural e requisitos Vigor 6 + Atletismo 6 em qualquer Grau).

A ficha mostra **DE base** e, quando for relevante, o valor de **DE para esquiva**. O teto 9 é aplicado à DE natural antes dos modificadores. O peso da peça não é alterado automaticamente ao escolher Grau 3 ou Grau 4. Uma Muito Leve não pode ter Integridade. Ao equipar, o protótipo verifica nível mínimo: G1 nível 1, G2 nível 5, G3 nível 10, G4 nível 20. Por conveniência técnica, o protótipo deixa apenas uma armadura equipada de cada vez; **não é uma nova regra oficial de sobreposição**.

**Propriedades por Grau:** Muito Leve e Leve recebem campo de resistência G3+; Média G2+; Pesada G2+ com segunda resistência G3+; Muito Pesada G2+ com resistência e G4 com **imunidade elemental adicional cumulativa**. A ficha apenas registra os elementos e mostra a imunidade física natural da Muito Pesada, **não calcula resistências nem dano recebido**. A natureza **neutra do Psíquico** impede que seja tratado como dano físico automaticamente. Integridades numéricas aguardam análise do dano das Perícias iniciais.

## Perícias autorais e orçamento de criação

**5 XP de Perícias no nível 1 [DEFINIDO]**; Atributos 6 XP + Formação 8 XP permanecem EXPERIMENTAIS. O catálogo da ficha apresenta as 15 Perícias fornecidas pelo autor, os dois novos Disparos pendentes e as opções anteriores. Só libera compra das Perícias com custo informado e pré-requisitos verificáveis; **Manejo Perfeito, Recuperação Vigorosa, sua Maestria em Movimento e Instinto de Sobrevivência têm custo PENDENTE**, e Maestria em Manejo Duplo aguarda especificação dos requisitos.

A ficha **não executa automaticamente** efeitos de Golpe Fulminante/Espalhar Golpe/Disparos pendentes, mudança de peso de Pugilismo, manobras, alojamento de armas, recuperação em movimento ou inclusão de fonte extra de Disciplina Avançada. A aquisição registra a Perícia, não inventa procedimentos. A descrição e a lista de decisões estão no [SRD v0.38](../docs/srd-continuidade-v0.38.md).


## Críticos cumulativos (SRD v0.29)

O rolador de dados da ficha HTML reconhece **crítico quando todos os dados escolhidos para manter estão em suas faces máximas**, exigindo pelo menos dois mantidos e um dado de Atributo. Apenas a **runa nos símbolos das faces máximas** ganha dourado: o número, o corpo e o contorno do dado não recebem nova cor por ser uma face candidata a crítico.

- **2 mantidos:** converte até 1 Pavor próprio em 1 Êxito e recupera até 1 PP e 1 Coragem.
- **3 mantidos:** benefícios anteriores, mais +1 Êxito, +1 Antecipar, total de até 2 PP e 2 Coragens recuperados.
- **4 mantidos:** todos os benefícios anteriores e **dano básico dobrado**; a interação final com proteções e limites de Vida ainda está pendente, portanto o valor exibido é anterior à resolução de armadura.

A recuperação respeita os tetos: **PP máximo 0 nos níveis 1–4**, 1 nos níveis 5–9, 2 nos níveis 10–19 e 3 no nível 20; Coragem máxima normal 10. O terceiro dado mantido no nível 1 ainda consome 1 Coragem; as recuperações são aplicadas após esse gasto. Os críticos ficam registrados no histórico do personagem.

**Os críticos dos monstros foram documentados no Livro e SRD**, com conversão de recuperações em Pavor (2P/4P/4P), mas **não são simulados no rolador da ficha de jogador**. O protótipo não automatiza os gastos do Narrador nem a alocação local-primeiro do Pavor crítico dos monstros, cujo excedente segue para a reserva pública até seu teto.


## Redistribuição experimental para o nível 1 (6/8/5)

A distribuição de playtest usa **6 XP Atributos / 8 XP Formação [EXPERIMENTAIS] + 5 XP Perícias [DEFINIDO]**. O total de 19 XP não é definitivo enquanto os dois primeiros orçamentos não forem aprovados. A curva de XP dos níveis superiores não foi alterada.

**Impacto para playtest:** a Formação Grau 2 custa 8 XP acumulados e passa a ser acessível na criação para uma única fonte (2d10), enquanto o Atributo Grau 3 custa 7 XP e deixa de caber no orçamento inicial de Atributos. A progressão ainda usa os mesmos custos acumulados; o excedente de categorias necessita XP de evolução.

## Atualização operacional — Disciplina e XP residual (SRD v0.38)

- **Disciplina** é a Prática compartilhada para armas ou conjuração; testes marciais básicos podem ser rolados com Disciplina + Atributo sem comprar Armas 1. Habilitações específicas permanecem para efeitos próprios, e a conjuração especializada conserva os requisitos pertinentes.
- **Disciplina Avançada:** somente quando a ação usa Disciplina, permite acrescentar um Atributo, Conhecimento ou Prática pertinente; a ficha passa a montar essa terceira fonte, inclusive outro Atributo, sem elevar a retenção.
- **Filtros do catálogo:** busca, Atributos, Conhecimentos, Práticas, relacionadas às adquiridas e requisitos atingidos. A categorização temática não estabelece requisitos.
- **Saldo inicial livre:** XP não gasto durante o orçamento inicial passa a ser livre para novas compras após concluir a criação. Compras reduzem o saldo, sem permitir reembolso livre automático de compras consolidadas. Os 5 XP iniciais de Perícias são DEFINIDOS; 6 XP Atributos/8 XP Formação são EXPERIMENTAIS.
- **Espalhar Golpe:** metade do dano dos Êxitos arredondada para baixo é calculada antes de aplicar a Integridade e as resistências de cada alvo adicional que tenha sido acertado conforme sua DE individual.

## Conjuração atualizada — substituição e preparação de magias (12/11/2026)

**Criar Item de Foco e Magia**, 1 XP, Disciplina 1 + Inteligência 1, **substitui** as antigas Perícias Aprendiz de Conjurador (2 XP) e Magia Única (1 XP). A ficha não oferece mais compra das antigas. Fichas salvas são migradas: quando os requisitos atuais são satisfeitos, a nova Perícia substitui as antigas; o investimento excedente é reconciliado no XP livre, sem conceder o reembolso duas vezes. Quando os requisitos não são satisfeitos, a compra não é concedida automaticamente e o XP anterior fica liberado; o histórico é anotado na ficha.

A partir de **Disciplina 2**, o personagem pode **criar magias de Grau 2 ou Grau 3 fora de combate** (1 PP ou 2 Coragens por criação) para **memorizá-las em slots mágicos** e conjurá-las rapidamente. **Pesos nominais de magias:** G1=1, G2=2, G3=3, G4=4. Uma magia criada **sem foco** recebe **−1 de peso**. Não existe procedimento aprovado para determinar se G1 pode ocupar zero peso ou se isso se refere exatamente à ocupação do slot; portanto, a ficha **não calcula slots disponíveis nem os consome automaticamente**. Histórico do SRD: 1 slot por aumento de Conjuração, +1 slot por 3 Inteligência e, em outra seção, limite 9; a nova lembrança 1 capacidade por Grau de Inteligência permanece PENDENTE.

**Itens de foco:** fabricação com Artesão, recarga após N rodadas conforme seu Grau, possibilitando elementos habilitados ausentes no ambiente. O peso físico do foco depende de **Potência, Força e Atletismo**, mas a fórmula exata de conversão para carga ainda requer decisão; a ficha não a calcula como regra oficial.

**Escudo Arcano:** 1 XP; Inteligência 2 + Criar Item de Foco e Magia; escudo pessoal ou **círculo 3×3 metros**, com **duração de 1 rodada**. Ativa com 1 PP/2 Coragens; rolagem de Conjuração dá DE para romper, proteção semelhante à Integridade; ataque ou conjuração inimiga corpo a corpo dentro da área ignora sua proteção. Mais 1 PP/2 Coragens amplia a área em 3×3, geometria circular exata PENDENTE. Não automatizado.

**Conjuração Equilibrada:** 1 XP, requer **Disciplina 2, Criar Item de Foco e Magia, Inteligência 2 e Destreza 2**. Ao pagar 1 PP ou 2 Coragens, permite alterar a magia para **Pesada ou Leve**. Sua compra e os requisitos estão automatizados; o efeito sobre Grau numérico, peso tático e peso nominal dos slots aguarda confirmação, não se cria aumento automático de Grau ou dano.


## Spellslots mentais e Perícia em Elemento Ar (12/11/2026)

**Capacidade mental [DEFINIDO em fonte]:** determinada **somente pelos dados da Prática Disciplina**; não incluir bônus de Inteligência, foco, inventário ou a fórmula histórica baseada em graus. **PENDENTE:** quantos pontos de capacidade cada dado de Disciplina representa, e se o limite histórico de 9 ainda se aplica. Por isso, a ficha exibe os **dados de Disciplina** como referência, mas não inventa nem calcula capacidade numérica de slots.

**Itens de foco:** **sempre** entram na carga física convencional do inventário. A ficha soma todos os itens do tipo Foco como qualquer outro equipamento, segundo seu peso cadastrado. Os pesos de cada foco por Grau e a relação de Potência com Força e Atletismo ainda dependem de especificação; não há peso físico gratuito.

**Perícia em Elemento Ar:** custo 1 XP, requer **Disciplina 1, Criar Item de Foco e Magia e Inteligência 1**. Substitui o rótulo anterior **Elemento: Vento** mantendo o identificador técnico `vento` para preservar personagens que já o adquiriram. A compra e os requisitos estão verificados. O efeito especial custa **1 PP ou 2 Coragens**, condiciona-se a acerto mesmo sem crítico e aplica **um** dos efeitos do Ar: G1 autoempurrão e deslocamento +4m ou manipular objetos, G2 sufocar/dano à Vida ou armadura, empurrar/derrubar e deslocamento 8m, G3 conjuração ao final do turno dos aliados, tornado/rajada e possíveis danos por queda com referência 16m. Formatos linha/círculo/cone/X são opções mencionadas, não geometria calculada. Resolução de dano, duração e interpretação de 16m não estão automatizadas.

## Água, Fôlego de Ar e slots por dado — 12/11/2026

**Capacidade mental agora DEFINIDA:** cada dado fornecido pela Prática **Disciplina** concede **1 unidade de peso mental**. O cálculo é o número de dados da fonte, independentemente de ser d6/d10/d12. **Não** soma Inteligência. A ficha mostra essa capacidade numericamente, mas não automatiza a lista de magias preparadas, nem sua distribuição por compartimentos; não cria nenhum dado adicional. A tabela de Disciplina atual tem, no Grau 6, **3d12**, portanto **3 unidades**, em conflito com o exemplo desejado de memorizar **6 magias G2**. Divergência numérica PENDENTE; a tabela de dados **não foi alterada**. Com G2 de peso nominal 2 cabe 1 G2; com peso −1 sem foco, até 3 G2, condicionado à confirmação da ocupação efetiva. O mínimo de peso G1 sem foco também permanece pendente.

**Ar:** além dos efeitos G1–G3 anteriores, pode **recuperar Fôlego**. Quantidade, Grau, duração, beneficiários e ativação ficam PENDENTES; a ficha não assume que Fôlego seja PP, Coragem ou Vida e não calcula a recuperação.

**Perícia em Elemento Água** (1 XP) exige **Disciplina 1, Criar Item de Foco e Magia e Inteligência 1**. Mantém o identificador interno `agua` da antiga entrada "Elemento: Água" para conservar fichas. Ao acertar, com ou sem crítico, **1 PP ou 2 Coragens** ativa um efeito escolhido: **G1 Congelar 1 rodada sem dano na forma Leve**, extrair água do ar, mover, molhar e limpar; **G2 Perfurar** ao obter crítico **OU** gastar os recursos de ativação, podendo causar dano à Vida e à armadura; **G3** conjurar no final do turno dos aliados, Empurrar, Perfurar, Congelar e causar dano à Vida/armadura com propriedades menores pertinentes. A ficha somente compra e descreve as Perícias; não automatiza congelamento, perfuração, efeitos G3 ou dano.

## CORREÇÃO MAIS RECENTE — Capacidade e peso mental (12/11/2026)

**Esta decisão substitui as descrições anteriores de “1 slot por dado” neste arquivo.** A capacidade de spellslots mentais é **igual ao Grau investido em Disciplina**, de 0 a 6, independentemente da quantidade de dados rolados. **Criar Magia reduz em 1 o peso de toda magia criada e memorizada**, independentemente da presença de foco. Os pesos nominais G1/2/3/4 são 1/2/3/4; para magia criada/memorizada, G2=1, G3=2 e G4=3. **G1 após desconto=0** ainda precisa de regra de mínimo para evitar memorização ilimitada. Com **Disciplina 6**, capacidade 6, cabem **seis magias G2 de peso efetivo 1**. A ficha calcula a capacidade numericamente pela Prática e apresenta o exemplo de G2, mas não automatiza a lista de magias preparadas nem consumo de espaço por item. Focos continuam ocupando carga física convencional.

## Perícia em Elemento Terra — 12/11/2026

**Compra definida:** 1 XP, exige Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. A entrada antiga **Elemento: Terra** foi renomeada no catálogo, com ID interno `terra` preservado para manter personagens salvos. Engenharia é uma afinidade temática do filtro, **não um requisito adicional**. Uma ativação de efeito especial após acertar (mesmo sem crítico) custa **1 PP ou 2 Coragens** e aplica **um efeito escolhido**, sem automatização de condições/danos.

**G1:** Desvantagem por **2 rodadas** (terra nos olhos), emaranhar pés, derrubar, pedras pequenas velozes, plataformas de deslocamento e sentido sísmico **18 × 18 m** para detectar criaturas furtivas e armadilhas. **G2:** enredar e imobilizar, Desvantagem por **2 turnos**, espinhos que danificam proteção/armadura e sentido sísmico **32 × 32**. **G3:** conjurar ao final do turno dos aliados, área **5 × 5** ou linha/cone/círculo a partir do alvo, causar dano/empurrão/derrubada e sentido sísmico **64 × 64**. **PENDENTE:** unidades das três últimas dimensões, dano, condições resistidas, limites de detecção, efeitos sem ataque e detalhes de geometria/turno. O protótipo verifica custo e requisitos, mas não presume procedimentos extras.

## Perícia em Elemento Fogo — 12/11/2026

**Perícia em Elemento Fogo:** custo **1 XP**, exige **Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1**. Esta é a atualização da antiga entrada **Elemento: Fogo**, mantendo o identificador interno `fogo`, os personagens existentes e o catálogo de compra sem duplicação. O filtro pode associar Fogo a **Disciplina, Inteligência e Alquimia**; Alquimia é somente afinidade de busca, **não requisito de compra**. Em um ataque acertado, **independentemente de crítico**, gastar **1 PP ou 2 Coragens** ativa **um efeito especial escolhido**.

- **G1:** disparo à distância causa dano à armadura, mas não queima diretamente a Vida; ilumina/conduz chamas, **não cria fogo do nada**. Pode usar lamparina a óleo, isqueiro ou item de foco pequeno encantado (por exemplo, luvas que produzem faísca ao estalar os dedos).
- **G2:** área de disparo **4 × 4**, em cone/linha/círculo, dano à Vida e à armadura; sem item de foco, pode invocar fogo ao gastar **1 Coragem**. **PENDENTE:** se essa Coragem soma-se ou substitui o custo usual de ativação.
- **G3:** conjurar ao **final do turno dos aliados**, com área **8 × 8**, circular, cone ou linha.

**Identidade narrativa:** criar/transportar uma pequena faísca e ampliá-la para grandes incêndios. **PENDENTE:** unidades e geometria de 4 × 4 e 8 × 8, alcance, dano numérico, duração/propagação de incêndios, ações utilitárias e efeitos G3. A ficha registra a Perícia e os pré-requisitos, mas não automatiza esses efeitos.
