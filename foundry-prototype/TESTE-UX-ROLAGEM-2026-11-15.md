# Playtest Foundry v14 — correções visuais da rolagem (15/11/2026)

**Objetivo:** eliminar a ambiguidade da seleção de fontes, os polígonos sobrepostos às cartas 2D e os rótulos PNG desproporcionais nas faces 3D. Garantir que cada dado rolado apareça no chat com seu número e símbolos rúnicos, sem alterar o motor matemático.

**Escopo:** protótipo na branch `feat/criar-conflito-foundry-carga-20261113` (PR #4); **não é uma release instalada nem homologada**. Prioridade absoluta é instalar no Foundry portátil local só depois de backup e testes. Não alterar o simulador web nem o SRD.

## Problemas observados nas capturas do playtest 0.2.1.5

1. Criatura / Monstro: a grade de Atributos ocupa um terço da ficha; área vazia à direita. Não fica claro que o clique no nome seleciona a fonte, enquanto −/+ investem Grau.
2. A rolagem pendente bloqueia novas fontes sem explicação; o painel de preparação está abaixo do rolamento da ficha.
3. Os ícones de poliedro nas cartas 2D da seleção ficam fora dos cartões e se sobrepõem ao número da face e às runas.
4. Dice So Nice: PNG das faces com grafismos internos sobre a geometria branca, runas muito pequenas. O desenho novo usa rótulos Unicode de runa e tema escuro, sem PNG; **precisa ser conferido visualmente** (fontes e orientação do d4).
5. Chat final: mostrava somente "d4 · face 2", sem os símbolos individuais e sem discriminar descarte.

## Casos de aceitação na instalação local

1. **Criatura G1**, todos Atributos Grau 0: clique no **nome Força**, depois no **nome Vigor**. Ambos devem indicar visualmente 1ª/2ª fontes e a ficha deve localizar a preparação; somar a pilha prevista. Os botões −/+ não escolhem fontes. Descartar e preparar outro par.
2. **Aprendiz**, Conhecimento Medicina + Atributo Inteligência: deve aparecer a combinação base+atributo e permitir rolar se as regras/requisitos forem válidos; não aceitar duas Práticas como fontes primárias sem habilitação prevista no SRD.
3. **Rolagem pendente:** ao clicar em outra fonte, ver aviso "Finalize ou descarte" e ir aos cartões. Selecionar até o teto, confirmar e iniciar outra rolagem. Atualização/reconexão deve preservar faces e seleção.
4. **Cartas 2D:** para cada dado, tipo, origem, valor numérico e runas estão dentro do cartão; realce "MANTIDO" deve reagir ao clique, sem sobreposição do d4 ou d10.
5. **Chat:** uma mensagem por `rollId`; mostra TODOS os dados originais, cada face e sua combinação E/A/P, marcando mantido ou descartado. Somente mantidos contam para DE, crítico, Pavor e dano.
6. **Dice So Nice ligado:** toda mesa deve ver exatamente os resultados registrados no Actor; d4 em faces distintas e d10 face 10 (`2E + 1A + 0P`). Runas nas faces sem desenho duplicado de poliedro; tema escuro não deve esconder o texto. Se aparecer quadrado de fonte ausente, registrar a falha.
7. **Dice So Nice desligado:** cartas 2D e chat ainda mostram corretamente faces/símbolos; sem rolagem repetida.
8. **Dois clientes:** jogador confirma, Narrador vê a animação; falha temporária no chat e duas tentativas de confirmação não cobram recursos duas vezes.
9. **Compatibilidade:** inventário, Pavor local/público, edição de Grau, criação de Actor, Items e importação antiga preservados.

## Critérios para instalação

- Testes de Node 24: `node --test foundry-prototype/tests/*.test.mjs`.
- Regerar pacote e testar instalação com o Foundry fechado, usando o instalador existente: `node foundry-prototype/scripts/install.mjs --user-data "F:/FoundryVTT-WindowsPortable-14.364"`.
- Fazer backup antes, sem apagar `Data/worlds` ou `Config`.
- Avaliar visualmente o Dice So Nice em **dois clientes**, especialmente d4 e fontes rúnicas. A alteração de rótulos é **PROPOSTA de apresentação**, não uma regra aprovada.
- Se qualquer etapa falhar, não afirmar que o playtest local foi atualizado; registrar logs e retornar ao snapshot anterior.

As correções visuais são independentes da escala de Pavor, da matemática de dados e de custos. Manter o PR #4 em rascunho e não publicar versão estável sem aprovação autoral.
