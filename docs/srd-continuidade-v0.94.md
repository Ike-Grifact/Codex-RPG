# Codex RPG — SRD de Continuidade v0.94

**Data:** 23/11/2026  
**Estado:** **DEFINIDO** — correção autoral da escolha elemental gratuita do Lucker Puro.  
**Precedência:** substitui **somente** as opções elementais de origem do Lucker Puro descritas na v0.93 e nas versões históricas v0.55. Mantém a v0.92 (carga), as demais decisões da v0.93 e a regra de Runa Espinhos da v0.84.

## 1. Lucker Puro — concessão elemental inicial [DEFINIDO]

**Ao criar um Lucker Puro, escolher exatamente UMA Perícia elemental gratuita dentre:**
- **Fogo** (`fogo`)
- **Água** (`agua`)
- **Ar** (`vento`, identificador interno)
- **Terra** (`terra`)
- **Sagrado** (`sagrado`)

Os quatro primeiros são os elementos básicos dessa escolha; **Sagrado também é permitido**. O jogador recebe **somente a Perícia escolhida**, não todas as cinco.

**Sangue, Trevas e Veneno estão excluídos da escolha inicial gratuita.** Esta decisão substitui a regra antiga da v0.55 (Sangue/Trevas/Veneno) e a conclusão provisória da v0.93 que considerava Veneno a única opção remanescente. A exclusão da gratuidade **não proíbe aquisição posterior por XP** quando os requisitos próprios forem atendidos. A exclusividade de **Transfusão Sanguinária** para o Lucker de Sangue continua inalterada.

O Lucker Puro mantém **Inteligência 1 e Destreza 1 automáticos (0 XP)**, **Criar Item de Foco e Magia gratuitamente** e suas faixas raciais de custo aprovadas (Força e Atletismo elevados). **Psíquico/Psique** continua seguindo a regra da Perícia de Foco, **não é uma sexta escolha de Perícia elemental racial gratuita**.

## 2. Fichas antigas e compatibilidade [DEFINIDO]

Ao carregar/importar um Lucker Puro cuja escolha antiga `pureElement` seja `sangue`, `trevas` ou `veneno`:

1. Desativar aquela **concessão racial gratuita**, sem convertê-la em compra, sem conceder outro elemento em silêncio e sem descontar XP.
2. Registrar o elemento antigo nas **notas históricas** da ficha, uma única vez; preservar o campo `skills` e as Perícias **efetivamente adquiridas com XP**.
3. Permitir **uma seleção de regularização** de Fogo/Água/Ar/Terra/Sagrado. Se a ficha já estiver concluída e não tiver escolha racial válida, a seleção ficará disponível no painel racial. Após registrar uma escolha válida, a ficha concluída não poderá alterná-la livremente.
4. Em ficha ainda em criação, usar o seletor normal da origem; não concluir sem uma escolha válida.
5. Não alterar atributos, XP gasto, dados, equipamentos, inventário, importação/exportação ou demais campos em função desta correção.

**Nota técnica:** o identificador do elemento Ar no criador é `vento`. Não duplicar Ar e Vento como Perícias distintas.

## 3. Runa Espinhos [DEFINIDO — sem alteração]

Preservar a regra da v0.84: apenas **um elemento gratuito entre Ar, Água, Terra e Fogo**, mais **Escudo Rúnico** no lugar do segundo elemento antigo. As demais concessões e restrições já aprovadas permanecem.

## 4. Validação

Conferir a lista de cinco opções no criador, os efeitos de concessões raciais, a persistência e o tratamento de escolhas antigas no navegador, a tabela de linhagens de `livro.html`, o capítulo II de `docs/livro-do-jogador.md` e o guia de criação. Testar que Veneno/Sangue/Trevas nunca entram como Perícia **racial gratuita** do Lucker Puro, mas compras reais continuam preservadas.

**Fora do escopo:** custo de Perícias, dano, comportamento de magias especiais, Escudo Rúnico, capacidade de carga, pontos de Vida, orçamento de XP e outros sistemas.
