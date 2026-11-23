# Codex RPG — SRD de Continuidade v0.95

**Data:** 23/11/2026  
**Estado:** **DEFINIDO** — correção autoral do custo de aquisição de Criar Item de Foco e Magia para o Lucker Puro.  
**Precedência:** substitui **somente** a concessão automática de Criar Item de Foco e Magia ao Lucker Puro descrita na v0.94 e nas versões históricas; preserva a escolha de um elemento gratuito da v0.94, os graus raciais de Inteligência e Destreza, os custos de fontes aprovados na v0.56, a concessão racial de Runa Espinhos e todas as demais decisões vigentes.

## 1. Lucker Puro — Foco por 0 XP, condicionado aos requisitos [DEFINIDO]

**Criar Item de Foco e Magia não é adquirida automaticamente** pela origem Lucker Puro. Para essa linhagem, **o custo da Perícia é 0 XP**, mas a compra exige **Disciplina grau 1 + Inteligência grau 1 + Artesão grau 1**.

- A origem concede Inteligência 1 e Destreza 1 automaticamente por 0 XP, como já definido anteriormente. Isso satisfaz Inteligência 1 na compra de Foco, **não dispensa Disciplina nem Artesão**.
- Comprar Disciplina 1 e Artesão 1 consome o XP normal de cada Prática. Com ambos no grau 0, são **2 XP + 2 XP = 4 XP** para reunir esses requisitos; Foco então é registrado **por 0 XP**, após compra explícita.
- A Perícia não pode ser usada, anunciada como possuída nem considerada satisfeita como requisito de outra Perícia enquanto não for de fato adquirida.
- O jogador pode comprar manualmente a Perícia com os requisitos preenchidos ou confirmar um pacote no Codex Genético com os graus faltantes. A confirmação não compra requisitos duas vezes nem concede os graus sem XP.
- Para Humano e Lucker de Sangue, o custo-base da Perícia permanece **1 XP**, com os mesmos requisitos. **Runa Espinhos não é alterado** nesta revisão.

**A escolha de exatamente um elemento racial gratuito** do Lucker Puro permanece a da v0.94: **Fogo, Água, Ar, Terra ou Sagrado**. Esse elemento não é Criar Item de Foco e Magia, não concede Psíquico/Foco e não quita suas exigências. Sangue, Trevas e Veneno permanecem fora da seleção elemental gratuita, sem proibição de compra posterior quando permitida.

## 2. Artesão e XP acumulado [DEFINIDO — esclarecimento de interface, sem alterar custos]

A tabela da v0.56 é de **custo acumulado** de Conhecimentos/Práticas normais: Artesão G0 = 0 XP, G1 = 2 XP, G2 = 4 XP. Portanto, após investir 2 XP para chegar a G1, avançar de G1 para G2 exige **mais 2 XP**, total **4 XP**; não é uma segunda cobrança do mesmo grau.

No inspetor do Codex Genético, mostrar separadamente o XP acumulado no grau atual e o gasto adicional para o próximo grau. **Não alterar os custos, a tabela racial do Lucker de Sangue, os dados nem o XP total da ficha** por causa desse esclarecimento.

## 3. Compatibilidade e validação

- Preservar graus e Perícias efetivamente comprados em fichas antigas, sem cobrar novamente graus existentes nem reembolsar despesas gratuitamente.
- Fichas de Lucker Puro que antes recebiam Foco **somente por concessão automática** deixam de tratá-lo como adquirido. O jogador poderá adquiri-lo por 0 XP ao completar os requisitos; não incluir automaticamente a Perícia no registro `skills` por migração.
- Fichas que já possuem Foco em `skills` mantêm a aquisição, e a tabela de XP do Lucker Puro a registra por 0 XP, sem duplicação.
- Confirmar os valores em listas, Codex Genético, prévia de requisitos, compra automática, resumo de XP e devoluções de playtest.
- **PENDENTE:** testes do autor com Runa Espinhos; nenhuma mudança racial para Runa é aprovada por esta revisão.

**Escopo fechado:** esta revisão não altera bônus de raças, custos de fontes, Perícias elementais, armaduras, dano, carga, combate, nem outras regras do sistema.
