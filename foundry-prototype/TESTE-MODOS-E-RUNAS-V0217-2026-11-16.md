# Codex RPG Foundry — revisão UX 0.2.1.7 (16/11/2026)

**Estado: playtest validado em mundo isolado no Foundry v14.367.** As mudanças seguem na branch do PR #4.

## Escopo

Apenas interface e apresentação do Foundry, sem mudar faces, símbolos, custos, graus, requisitos, retenção, Pressão, Coragem ou SRD.

1. **Jogar** é o modo inicial: todo o cartão de Atributo, Conhecimento ou Prática seleciona sua fonte. O grau aparece como etiqueta, sem controles `−/+`; clicar no texto, no dado ou no fundo tem o mesmo efeito. Seleção de texto ao clicar foi desativada para reduzir o artefato de linha realçada.
2. **Editar ficha**: botão no cabeçalho libera `−/+` dos graus, identidade, compras de Perícias, importação manual de itens e retrato. Ações e compras continuam usando a lógica e validações existentes; a alternância não altera regras. A edição é bloqueada enquanto houver rolagem pendente.
3. **Resultados 2D**: cada carta mostra somente a face simbólica, com `ᛋ` verde `#267A45`, `ᚨ` azul `#2369BB`, `ᚦ` roxo `#542176` e `○` em faces vazias. Quantidades superiores a um aparecem como `×N`. A numeração da face persiste internamente e na acessibilidade para críticos e sincronização.
4. **Chat**: todos os dados mantidos e descartados exibem as mesmas runas em vez do número grande; dados originais, `rollId` e publicação única continuam preservados.
5. **Dice So Nice**: a etapa de empacotamento gera **20 PNGs 256×256** transparentes, um por combinação de símbolos presente nos dados atuais, usando as cores oficiais. Os rótulos contêm somente runas, sem sobrepor um segundo desenho de poliedro à malha 3D. Mantida a seleção de d4, d6, d10, d12 e d20.

## Validação antes de instalar

No clone atualizado do repositório **`Ike-Grifact/Codex-RPG`**, branch `feat/criar-conflito-foundry-carga-20261113`, executar com **Node.js 24**:

```sh
node --test foundry-prototype/tests/*.test.mjs
node foundry-prototype/scripts/build.mjs --out dist/codex-rpg-foundry
```

Conferir que `dist/codex-rpg-foundry/assets/dice/runes/` contém 20 PNGs com nomes como `e2-a1-p0.png`. **Não instalar a partir do manifesto de release** enquanto não existir a publicação aprovada. Para testar no Foundry portátil, fazer backup, fechar o aplicativo e usar o instalador do README apontando para a User Data correta.

### Roteiro manual no Foundry v14

- Abrir Criatura G1: no modo **Jogar**, clicar no fundo do cartão Força e depois no de Vigor. Confirmar que a fonte inteira responde, sem `−/+` e sem linha de seleção de texto.
- Abrir Aprendiz: clicar em Medicina + Inteligência, confirmar regras de segunda fonte, executar e manter alguns dados. Selecionar/deselecionar pelo cartão inteiro. Recarregar, conferir que não houve rerrolagem.
- Alternar para **Editar ficha**: ajustar um grau com XP suficiente, conferir resultado; voltar para **Jogar**, verificar que o grau permanece e que o clique não o compra.
- Confirmar d4 com face 1 ou 2 (`○`), face 3 (`ᚦ`) e face 4 (`ᚨᚦ`), além de d10 face 10 (`2ᛋ + 1ᚨ`). Verificar cartas, comparador e chat; os números não devem ser a apresentação visual principal.
- Ativar Dice So Nice em dois clientes: conferir cores oficiais, legibilidade e orientação dos polígonos, especialmente d4, d10 e faces múltiplas. Confirmar que todos recebem **os mesmos valores**.
- Repetir com Dice So Nice desligado, em janela estreita/mobile, e verificar falha simulada de publicação, reconexão, confirmação concorrente e inventário.

**Resultados da revisão local.** Passaram os 53 testes Node.js 24. O pacote Windows gerado e extraído contém 76 arquivos, incluindo os 20 PNGs transparentes de 256×256. No Foundry v14.367, dois clientes verificaram os cinco tipos de dado em 3D, as quatro faces do d4 e a correspondência com a pilha avaliada. O roteiro também validou os modos da ficha, toque em janela de 480 px, edição de Grau e Item, Pavor, retomada e publicação única após falha simulada.
