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
| SRD de Continuidade v0.34 | [docs/srd-continuidade-v0.34.md](docs/srd-continuidade-v0.34.md) | **Versão mais recente (11/11/2026)** |
| Livro do Mestre — Provocação e Liderança | [docs/livro-do-mestre.md](docs/livro-do-mestre.md) · [Ler no site](narrador.html) | Atualizado conforme SRD v0.34 |
| Livro anterior, para histórico | [docs/arquivo/livro-do-jogador-v0.5-legado.md](docs/arquivo/livro-do-jogador-v0.5-legado.md) | Arquivo histórico |
| Ícones oficiais dos símbolos | [assets/icons/](assets/icons/) | SVG vetoriais |

## Usar o criador

Abra **criador.html** pelo portal. Ele permite:

- Nome, conceito/profissão emergente, origem, Virtude e personalidade; sem estilo de combate obrigatório.
- Distribuição de Atributos (progressão oficial de dados e custos acumulados).
- Escolha de Conhecimentos e Práticas com custos reais.
- Compra de Perícias iniciais documentadas, com requisitos disponíveis.
- **Editor de Perícias experimentais:** definir nome, custo, requisitos e efeito; comprar o rascunho na ficha sem torná-lo regra oficial.
- Simular manualmente **+1E ou +2E de Perícias condicionais** para comparar hipóteses de build.
- Cálculo automático de Vida, DE, balanço corporal e Coragem.
- Laboratório de rolagem d4/d6/d10/d12: seleção **manual** de dados mantidos, requisito de um Atributo, gasto de Coragem, afinidade entre pesos, conversão de Antecipar, classificação de acerto e Pavor.
- Salvamento **local no navegador**, importação e exportação em JSON, impressão da ficha.

**Importante:** a hipótese de criação nível 1 é **7 XP de Atributos + 7 XP de Formação + 5 XP de Perícias = 19 XP**. A distribuição inicial ainda é **EXPERIMENTAL**; não substituir decisões definitivas do SRD por suposições da ferramenta.

**Limitações intencionais v0.1:** não há catálogo completo de armas, preço de Grau 7, compra de equipamento, bônus final de DE de armadura ou cálculo completo da carga da Perícia Armas. O laboratório é de estudo, não substitui todas as regras de Narrador, crítico, fonte de dano, ações conjuntas ou efeitos elementais. O custo em XP e as condições de todas as Perícias futuras ainda dependem de design.

[**Guia de criação de Perícias e playtest nível 1**](docs/guia-criador-playtest.md)

## Rodar localmente

O portal é composto por **HTML, CSS, JavaScript puro e Markdown**. Não exige Node, bundler ou instalação de dependências.

Para testar as páginas e o armazenamento local com uma origem HTTP (recomendado):

    python3 -m http.server 8000

Depois abra: http://localhost:8000/

O projeto não coleta nem envia a ficha a um servidor; o navegador armazena o progresso em localStorage. Exporte JSON se quiser preservar ou compartilhar a ficha.

## Publicar com GitHub Pages

Se o GitHub Pages ainda não estiver ativado:

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Selecione **main** e **/(root)**, depois **Save**.
4. Aguarde a publicação indicada pelo próprio GitHub e visite o endereço informado pela página de configuração.

Endereço normalmente usado para este nome de repositório: https://ike-grifact.github.io/Codex-RPG/ — **verifique a publicação efetiva em Settings → Pages** antes de compartilhar.

## Regras, estados e precedência

A fonte normativa atual é o **SRD de Continuidade v0.34**, com seção **0-R** para Provocação, Liderança, Antecipar de inimigos e disputa de influência. Ordem:

1. Decisão explícita mais recente do autor.
2. Seção 0-R da continuidade v0.34, nos assuntos que regula.
3. Seções históricas 0-Q e anteriores do mesmo SRD, onde não houver conflito.
4. Livro de leitura, que não altera sozinho regras do SRD.

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

O criador agora apresenta todos os Conhecimentos e Práticas pertinentes com **1d6 gratuito individual no grau 0** (Atributos continuam com 1d4), ícones poliédricos e seleção por clique. O Livro mostra as runas coloridas e a tabela **d20 reforçado G consolidada**, além da definição de **DE = Dificuldade de Êxito**, **PP = Ponto de Perícia**, **Perícia em Coragem no nível 5**, Furtividade, afinidades de peso, usos criativos dos elementos e a progressão de armadura por Grau (integridade inicial; primeira resistência no Grau 2, equipável a partir do nível 5; segunda no Grau 3 para peças aptas; imunidade específica no Grau 4 quando habilitada). A reserva de 19 XP permanece experimental.

**Revisão v0.24:** leitura dos efeitos individuais de Água, Fogo, Terra, Ar, Psique, Sagrado, Trevas, Sangue, Veneno e Raio; catálogo conceitual de armas e armas de fogo; recuperação de Vida em três caixas; Ladino perde rastreamento dos inimigos ao mover-se após Furtividade; Dificuldade de Êxito expressa como Agilidade + (Destreza ÷ 2, arredondada para baixo). Profissões performáticas e efeitos futuros foram registrados apenas como propostas. O portal não oferece links para o documento interno de continuidade.

**Fontes consolidadas na v0.26:** Conhecimentos = **Proteção, Astronomia, Medicina, Alquimia, Engenharia e Erudição**. Práticas = **Armas ou Conjuração (Prática única)**, Atletismo, Furtividade, Artesão, Apresentação e Coleta. A mesma Prática atende a ambos os usos segundo as Perícias e tem apenas um custo de Formação e uma pilha de dados. Não se paga mais 2 XP de Formação para começar a conjurar por possuir a Prática Armas; a Perícia habilitadora de magia mantém seu custo próprio. Punhos é especialização marcial. Na criação experimental, dependências de Artes Marciais aguardam ratificação. Fichas antigas migram a graduação de Conjuração para a Prática única usando provisoriamente o maior grau e preservando o registro original.
