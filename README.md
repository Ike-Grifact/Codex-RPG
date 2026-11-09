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
| SRD integral e histórico | [docs/srd-continuidade-v0.22.md](docs/srd-continuidade-v0.22.md) | **Continuidade v0.22 preservada integralmente** |
| Livro anterior, para histórico | [docs/arquivo/livro-do-jogador-v0.5-legado.md](docs/arquivo/livro-do-jogador-v0.5-legado.md) | Arquivo histórico |
| Ícones oficiais dos símbolos | [assets/icons/](assets/icons/) | SVG vetoriais |

## Usar o criador

Abra **criador.html** pelo portal. Ele permite:

- Nome, conceito e estilo de combate sem classe obrigatória.
- Distribuição de Atributos (progressão oficial de dados e custos acumulados).
- Escolha de Conhecimentos e Práticas com custos reais.
- Compra de Perícias iniciais documentadas, com requisitos disponíveis.
- Cálculo automático de Vida, DE, balanço corporal e Coragem.
- Laboratório de rolagem d4/d6/d10/d12: seleção **manual** de dados mantidos, requisito de um Atributo, gasto de Coragem, afinidade entre pesos, conversão de Antecipar, classificação de acerto e Pavor.
- Salvamento **local no navegador**, importação e exportação em JSON, impressão da ficha.

**Importante:** a hipótese de criação nível 1 é **7 XP de Atributos + 7 XP de Formação + 5 XP de Perícias = 19 XP**. A distribuição inicial ainda é **EXPERIMENTAL**; não substituir decisões definitivas do SRD por suposições da ferramenta.

**Limitações intencionais v0.1:** não há catálogo completo de armas, preço de Grau 7, compra de equipamento, bônus final de DE de armadura ou cálculo completo da carga da Perícia Armas. O laboratório é de estudo, não substitui todas as regras de Narrador, crítico, fonte de dano, ações conjuntas ou efeitos elementais. O custo em XP e as condições de todas as Perícias futuras ainda dependem de design.

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

A fonte normativa atual é o **SRD v0.22**, com seção 0-F. Ordem:

1. Decisão explícita mais recente do autor.
2. Seção 0-F do SRD v0.22.
3. Histórico v0.21 e anteriores, onde não houver conflito.
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
