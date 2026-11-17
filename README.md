# Codex RPG

**Sistema independente de RPG narrativo e tático.** Todos os personagens começam como **Aprendizes** e constroem suas profissões por combinações de Atributos, Conhecimentos, Práticas, Perícias e equipamentos.

Este repositório é o **novo lar independente** das regras, do Livro do Jogador e do criador de fichas do Codex RPG. A continuidade foi migrada de [Codex-de-Arb-rius](https://github.com/Ike-Grifact/Codex-de-Arb-rius), mas os projetos não compartilham regras automaticamente.

## O que há aqui

| Recurso | Arquivo | Estado |
|---|---|---|
| Portal de entrada | [index.html](index.html) | Pronto para visualização |
| Livro do Jogador (página navegável) | [livro.html](livro.html) | Primeira edição do novo portal |
| Criador de Aprendizes nível 1 | [criador.html](criador.html) | **Protótipo de playtest funcional** |
| Livro do Jogador (Markdown editável) | [docs/livro-do-jogador.md](docs/livro-do-jogador.md) | Primeira edição de leitura |
| **SRD de Continuidade v0.62 (atual)** | [docs/srd-continuidade-v0.62.md](docs/srd-continuidade-v0.62.md) | **Lucker Puro = Inteligência e Destreza G1**, sem Influência gratuita; seleção inicial não acumula compras e mapa sinaliza Graus raciais. |
| **SRD de Continuidade v0.61 (histórico de interface vigente)** | [docs/srd-continuidade-v0.61.md](docs/srd-continuidade-v0.61.md) | Codex Genético padrão e concessões automáticas G1; o par do Lucker Puro foi corrigido na v0.62. |
| **SRD de Continuidade v0.60 (histórico de implementação vigente)** | [docs/srd-continuidade-v0.60.md](docs/srd-continuidade-v0.60.md) | **Múltiplas fichas independentes** de Aprendizes, sem alterações de mecânica. |
| **SRD de Continuidade v0.59 (identidade vigente)** | [docs/srd-continuidade-v0.59.md](docs/srd-continuidade-v0.59.md) | **Origem = Raça** na Etapa 1, sem campo de origem narrativa nem seletor racial duplicado. |
| **SRD de Continuidade v0.58 (histórico de XP vigente)** | [docs/srd-continuidade-v0.58.md](docs/srd-continuidade-v0.58.md) | **18 XP iniciais [EXPERIMENTAL]** mantidos, custos compactos preservados e 260 XP totais no nível 20. |
| **SRD de Continuidade v0.57 (histórico)** | [docs/srd-continuidade-v0.57.md](docs/srd-continuidade-v0.57.md) | Orçamento anterior de 15 XP, substituído após teste de builds. |
| **SRD de Continuidade v0.52 (histórico)** | [docs/srd-continuidade-v0.52.md](docs/srd-continuidade-v0.52.md) | **Ativações comuns 1 PP ou 1 Coragem**, Olhos de Águia passiva, e **Domar Média exige Domar Pequena** além dos requisitos anteriores. Exceções e preparação de magia não são alteradas automaticamente. |
| **SRD de Continuidade v0.51 (histórico)** | [docs/srd-continuidade-v0.51.md](docs/srd-continuidade-v0.51.md) | **Olhos de Águia:** 1 XP, Destreza 3 + Disciplina 3 + (Armas de Longo Alcance ou Armas de Fogo), +8 m de alcance efetivo; **Antecipação, Êxito guardado e Vantagem** expiram no uso, após ação subsequente ou descanso longo. |
| **SRD de Continuidade v0.50 (histórico)** | [docs/srd-continuidade-v0.50.md](docs/srd-continuidade-v0.50.md) | **Antecipação** e **Concentração Refinada (1 XP, Disciplina 2, Vantagem, inimigo a até 8 m)**, com pendências de timing/duração; versão completa com histórico preservado. |
| **SRD de Continuidade v0.49 (histórico)** | [docs/srd-continuidade-v0.49.md](docs/srd-continuidade-v0.49.md) | **Invocação Elemental, criaturas temporárias, necromancia, Psique e custos especiais**, com pendências técnicas explícitas. |
| **SRD de Continuidade v0.48 (histórico)** | [docs/srd-continuidade-v0.48.md](docs/srd-continuidade-v0.48.md) | **Domar e ficha opcional da Pequena, Saúde e recuperação, Pavor excedente, Muito Leve G1 com 3 Integridade**. Prevalece sobre versões anteriores. |
| SRD de Continuidade v0.44 (histórico) | [docs/srd-continuidade-v0.44.md](docs/srd-continuidade-v0.44.md) | **Conjuração Refinada (alcance pendente), armaduras G1 7/12/17, pedras especiais 3× comuns e análise exata de DE** |
| Livro do Mestre — Provocação e Liderança | [docs/livro-do-mestre.md](docs/livro-do-mestre.md) · [Ler no site](narrador.html) | Regras do Mestre complementadas pela seção 0-AA do SRD v0.41 |
| Livro anterior, para histórico | [docs/arquivo/livro-do-jogador-v0.5-legado.md](docs/arquivo/livro-do-jogador-v0.5-legado.md) | Arquivo histórico |
| Ícones oficiais dos símbolos | [assets/icons/](assets/icons/) | SVG vetoriais |

## Atualização de concentração e Invocação (16/11/2026)

- [Invocação Elemental — explicação para jogadores](pericias/invocacao-elemental.html): passos de compra, ativação, porte, dados, ajuda conjunta e variações.
- [Antecipação — mecânica](mecanicas/antecipacao.html): em rolagem com Disciplina, guardar 1A mantido para o próximo teste.
- [Concentração Refinada — Perícia](pericias/concentracao-refinada.html): 1 XP, Disciplina 2. Ao reservar 1A, converte em 1E e recebe Vantagem, desde que não haja inimigo a até 8 metros. No SRD v0.51, a conversão acontece ao guardar e o 1E e a Vantagem são válidos até uso, ação posterior ou descanso longo.

[Olhos de Águia](pericias/olhos-de-aguia.html) acrescenta +8 m ao alcance efetivo de armas à distância ou de fogo habilitadas, com requisitos de compra verificados na ficha. Os alcances iniciais do catálogo continuam referências de playtest.

## Atualização de requisitos e recursos — 16/11/2026

- [Domar Criatura Média](pericias/domar-criatura-media.html) requer **Domar Pequena já adquirida**, Influência 3, Inteligência 1 e Apresentação 1. A ficha e o Codex Genético verificam a dependência.
- [Olhos de Águia](pericias/olhos-de-aguia.html) é **passiva**, sem custo de ativação: +8 m de alcance efetivo.
- Todas as ativações comuns das Perícias usam **1 PP ou 1 Coragem** nos verbetes atuais, inclusive as características pagas no protótipo Foundry. Custos de preparação e exceções permanecem distintos.

## Usar o criador

Abra **criador.html** pelo portal. Ele permite:

- Nome, conceito/profissão emergente, **Origem / Raça** (seletor único ao lado do conceito), Virtude e Personalidade; sem estilo de combate obrigatório.
- Etapa guiada para escolher entre Atributos, Conhecimentos e Práticas, com exemplos, dados e custos para iniciantes.
- **Codex Genético como modo principal** para comprar graus e Perícias; **listas como alternativa**, com as mesmas compras e XP.
- Codex Genético com dupla hélice, dados do rolador entre − e +, ramificações de Perícias interligadas como grafo, compra assistida de requisitos quando o pacote completo cabe no XP e detalhes em inspector lateral.
- Etapa própria de **VT e itens iniciais**, com distribuição dos recursos e compras opcionais G1 do catálogo de preços propostos; XP e VT permanecem separados.
- Distribuição de Atributos (progressão oficial de dados e custos acumulados).
- Escolha de Conhecimentos e Práticas com custos reais.
- Compra de Perícias iniciais documentadas, com requisitos disponíveis.
- **Editor de Perícias experimentais:** definir nome, custo, requisitos e efeito; comprar o rascunho na ficha sem torná-lo regra oficial.
- Simular manualmente **+1E ou +2E de Perícias condicionais** para comparar hipóteses de build.
- Cálculo automático de Vida, DE, balanço corporal e Coragem.
- Laboratório de rolagem d4/d6/d10/d12: seleção **manual** de dados mantidos, requisito de um Atributo, gasto de Coragem, afinidade entre pesos, conversão de Antecipar, classificação de acerto e Pavor.
- Salvamento **local no navegador**, importação e exportação em JSON, impressão da ficha.

**Criação nível 1 [DEFINIDO]:** o personagem precisa comprar **pelo menos um Atributo no grau 1** e **pelo menos um Conhecimento ou Prática no grau 1**. Depois, **todo XP restante é livre**, inclusive para Perícias, respeitando os requisitos; não há cotas fixas por categoria. O criador usa **18 XP totais compartilhados [EXPERIMENTAL quanto ao montante]**. As antigas divisões 6/8/5 e 7/7/5 e a reserva obrigatória de 5 XP exclusivamente em Perícias foram superadas. Não confundir XP com Pontos de Perícia (PP).

**Limitações intencionais:** ainda não há catálogo completo de armas, preço de Grau 7 nem valores finais de Integridade. A ficha exibe os modificadores por tipo de armadura e a lista de Perícias autorais, mas não resolve automaticamente seus efeitos, dano de ataques recebidos ou a carga definitiva da Perícia Armas. O laboratório é de estudo, não substitui todas as regras de Narrador, crítico, fonte de dano, ações conjuntas ou efeitos elementais. O custo em XP e as condições de todas as Perícias futuras ainda dependem de design.

[**Guia de criação de Perícias e playtest nível 1**](docs/guia-criador-playtest.md)

## Rodar localmente

O portal é composto por **HTML, CSS, JavaScript puro e Markdown**. Não exige Node, bundler ou instalação de dependências.

Para testar as páginas e o armazenamento local com uma origem HTTP (recomendado):

    python3 -m http.server 8000

Depois abra: http://localhost:8000/

O projeto não coleta nem envia as fichas a um servidor; o navegador armazena cada personagem em uma chave própria de localStorage. É possível criar, duplicar, alternar e excluir personagens pelo seletor **Minhas fichas de jogadores**. Fichas antigas individuais são recuperadas automaticamente sem apagar a chave original. Exporte JSON para fazer backup, transportar fichas ou contornar limites de espaço do navegador.

## Publicar com GitHub Pages

Se o GitHub Pages ainda não estiver ativado:

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Selecione **main** e **/(root)**, depois **Save**.
4. Aguarde a publicação indicada pelo próprio GitHub e visite o endereço informado pela página de configuração.

Endereço normalmente usado para este nome de repositório: https://ike-grifact.github.io/Codex-RPG/ — **verifique a publicação efetiva em Settings → Pages** antes de compartilhar.

## Regras, estados e precedência

Na versão atual para playtest, a referência mais recente é o **[SRD de Continuidade v0.62](docs/srd-continuidade-v0.62.md)** (correção racial), seguida do **[SRD v0.61](docs/srd-continuidade-v0.61.md)** (graus raciais e Codex Genético), seguida da **[v0.60](docs/srd-continuidade-v0.60.md)** (múltiplas fichas), mantendo o **[SRD v0.59](docs/srd-continuidade-v0.59.md)** para identidade e o **[SRD v0.58](docs/srd-continuidade-v0.58.md)** para XP; as versões anteriores permanecem preservadas como histórico. A seção **0-AD** fecha armaduras −3, renomeação da Conjuração Refinada, preço relativo 3× e análise probabilística sem regra automática; a seção **0-AC** revê custos e conjuração com foco e registra a compra de pedras com valores VT pendentes; a seção **0-AB** homologa Trevas +2P para DE/dano/risco e a distribuição ou concentração de Pavor entre até dois alvos; a seção **0-AA** define o Pavor local inicial cheio (G1=4P a G6=8P) e o destino do Pavor no alvo atacado, sem turnos adicionais; a seção **0-Z** homologa a face crítica do d10 (**2E+1A**) e a escolha livre do dado elevado com Coragem; a seção **0-Y** define a distribuição livre de XP na criação; **0-X** rege características de armas e outras decisões de 13/11. As seções **0-W** e **0-V** continuam vigentes nos assuntos não modificados. Ordem de precedência:

1. Decisão explícita mais recente do autor.
2. Seção 0-AD da v0.44 para Conjuração Refinada, armaduras, pedras 3× e DE de competência; depois 0-AC para custo e elementos, 0-AB para Trevas, 0-AA para Pavor local, 0-Z para faces e elevação com Coragem, 0-Y para criação e 0-X para armas.
3. Seções históricas somente onde não haja decisão mais recente conflitante.
4. Livro de leitura e implementação, que não aprovam por si sós regras novas.

**DEFINIDO** é uma regra aprovada. **EXPERIMENTAL** é um número ou procedimento de teste. **PROPOSTO** é uma alternativa não aprovada. **PENDENTE** requer decisão. O projeto não deve tratar as categorias como equivalentes.

### Três símbolos do Codex

| Nome | Runa | Cor |
|---|---|---|
| Êxito | ᛋ Sowilo | `#267A45` |
| Antecipar | ᚨ Ansuz | `#2369BB` |
| Pavor | ᚦ Thurisaz | `#542176` |

## Próximos passos

- Desenhar as árvores abertas de profissões e Perícias baratas, com requisitos claros.
- Fechar a tabela de Graus e pontos de composição de armas/conjuração.
- Reavaliar a criação e a progressão de XP com os custos reais das Perícias.
- Executar playtests de DE, afinidade de pesos, Pavor, Coragem, Vida, ações conjuntas e integridade das armaduras.
- Aprimorar o criador para níveis mais altos, inventário, magias, fichas de inimigos e confronto de grupos.

**Projeto autoral Codex RPG.** Não importar mecânicas de outros sistemas de RPG sem decisão explícita.

## Consolidações de 9/11/2026 — continuidade interna v0.26

O criador agora apresenta todos os Conhecimentos e Práticas pertinentes com **1d6 gratuito individual no grau 0** (Atributos continuam com 1d4), ícones poliédricos e seleção por clique. O Livro mostra as runas coloridas e a tabela **d20 reforçado G consolidada**, além da definição de **DE = Dificuldade de Êxito**, **PP = Ponto de Perícia**, **Perícia em Coragem no nível 5**, Furtividade, afinidades de peso, usos criativos dos elementos e a progressão de armadura por Grau (integridade inicial; primeira resistência no Grau 2, equipável a partir do nível 5; segunda no Grau 3 para peças aptas; imunidade específica no Grau 4 quando habilitada). A reserva de 20 XP permanece experimental.

**Revisão v0.24:** leitura dos efeitos individuais de Água, Fogo, Terra, Ar, Psique, Sagrado, Trevas, Sangue, Veneno e Raio; catálogo conceitual de armas e armas de fogo; recuperação de Vida em três caixas; Ladino perde rastreamento dos inimigos ao mover-se após Furtividade; Dificuldade de Êxito expressa como Agilidade + (Destreza ÷ 2, arredondada para baixo). Profissões performáticas e efeitos futuros foram registrados apenas como propostas. O portal não oferece links para o documento interno de continuidade.

**Histórico de nomenclatura da v0.26 (superado em parte):** Conhecimentos = **Proteção, Astronomia, Medicina, Alquimia, Engenharia e Erudição**. Práticas na nomenclatura atual = **Disciplina (Prática única)**, Atletismo, Furtividade, Artesão, Apresentação e Coleta. A mesma Prática atende a ambos os usos segundo as Perícias e tem apenas um custo de Formação e uma pilha de dados. Não se paga mais 2 XP de Formação para começar a conjurar por possuir a Prática Armas; a Perícia habilitadora de magia mantém seu custo próprio. Punhos é especialização marcial. Na criação experimental, dependências de Artes Marciais aguardam ratificação. Fichas antigas migram a graduação de Conjuração para a Prática única usando provisoriamente o maior grau e preservando o registro original.
