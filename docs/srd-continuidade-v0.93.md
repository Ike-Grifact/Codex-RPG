# Codex RPG — SRD de Continuidade v0.93

**Data:** 23/11/2026  
**Escopo:** elementos iniciais das linhagens Lucker Puro e Runa Espinhos; correção do Livro do Jogador, portal e criador.  
**Precedência:** complementa a v0.92 e consolida a decisão posterior do autor sobre Lucker Puro; preserva as demais regras da v0.91 e do SRD v0.84. Não reescrever SRDs históricos.

## 1. Lucker Puro: elementos gratuitos — DEFINIDO / PENDENTE

**DEFINIDO (correção autoral em 23/11/2026):** **Sangue e Trevas não podem ser elementos iniciais gratuitos do Lucker Puro.** Esta decisão revoga expressamente essas duas alternativas da lista de origem documentada na v0.55. Concede-se uma única Perícia elemental gratuita, nunca múltiplas.

**Veneno** é a **única opção ainda válida da lista antiga** (Sangue/Trevas/Veneno). É a única habilitada no seletor de origem enquanto o autor não decidir se haverá outras alternativas. **PENDENTE:** outras opções de elemento inicial que poderiam substituir Sangue/Trevas; não introduzir Fogo/Água/Ar/Terra/Sagrado ou Psíquico como concessões raciais adicionais sem aprovação.

Mantêm-se os demais benefícios já definidos: **Inteligência 1 + Destreza 1** raciais (0 XP), **Criar Item de Foco e Magia** gratuitamente e faixas de custo racial vigentes (Força e Atletismo elevados). A habilidade de Foco não entrega novas Perícias elementais gratuitas; o acesso básico Psíquico segue suas regras próprias.

**Compatibilidade:** para fichas antigas com `pureElement` = `sangue` ou `trevas`, a seleção racial deixa de ser concedida, mas seu valor original é registrado nas **notas históricas** sem cobrar XP nem converter para compra. Perícias verdadeiramente adquiridas por XP e registradas separadamente em `skills` permanecem na ficha. Não conceder Veneno automaticamente na migração da escolha antiga: o jogador pode revisar a opção inicial da origem no criador quando permitido. Fichas concluídas não ganham Perícia nova em silêncio.

A aquisição posterior de Sangue ou Trevas, caso admitida pelos **custos e requisitos próprios**, não foi proibida por esta decisão. **Transfusão Sanguinária permanece exclusiva dos Luckers de Sangue**.

## 2. Runa Espinhos: um elemento + Escudo Rúnico — DEFINIDO, ratificação da v0.84

O SRD v0.84 (21/11/2026) já revogou a concessão de dois elementos diferentes. A origem concede:
- **Vigor 1 e Força 1** automáticos sem XP;
- **Pugilismo** e **Criar Item de Foco e Magia** sem XP;
- **exatamente um elemento inicial à escolha entre Ar, Água, Terra e Fogo**;
- **Escudo Arcano racial (Escudo Rúnico)** gratuito, que **substitui o segundo elemento antigo**.

O Escudo Rúnico mantém **uma ativação base gratuita por dia**, resistência elemental da barreira conforme a escolha habilitada na utilização e a conversão defensiva de 2P em 1E aplicável somente à formação. Runa Espinhos **não pode equipar armaduras físicas**. Essas mecânicas não foram alteradas.

Fichas antigas podem conservar o segundo elemento no campo histórico `runeElements[1]`, **sem recebê-lo como Perícia gratuita**. Sua aquisição deve seguir compra normal ou revisão do Narrador, sem cobrança automática nem apagamento silencioso.

## 3. Publicação e testes

A tabela racial em `livro.html`, o capítulo de criação em `docs/livro-do-jogador.md`, a descrição no `prototipo-ficha/app.js` e as orientações no guia de criação devem ser coerentes.

Validar:
1. Lucker Puro começa com Foco e uma Perícia elemental gratuita possível (Veneno), nunca Sangue/Trevas.
2. Importação de escolha racial antiga Sangue/Trevas não gera concessão gratuita; registrar a escolha nas notas sem remover Perícias compradas.
3. Runa Espinhos recebe um elemento válido e Escudo Rúnico, sem segunda Perícia elemental gratuita.
4. As demais linhagens, faixas de XP, Perícias compradas, custo de equipamentos, salvamento e regras gerais permanecem intactos.

**Nenhuma regra de dano, custo de XP ou categoria de equipamento foi alterada por este documento.**
