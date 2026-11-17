---
title: "Codex RPG — SRD de Continuidade v0.71: Rework experimental de Hemomancia e Transfusão Sanguinária"
version: "0.71"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO — nova identidade do elemento Sangue, custo e requisito de Transfusão Sanguinária; EXPERIMENTAL — painel de controle; PENDENTE — economia e gatilhos exatos"
---

# Codex RPG — SRD de Continuidade v0.71

## 0-BI. Identidade da Hemomancia e substituição de Coragem [17/11/2026]

**DEFINIDO na direção autoral:** Sangue passa a ser um **elemento de amplificação**. O Hemomante pode utilizar Sangue no lugar de Coragem para **uma das seguintes finalidades**, **uma vez por turno**: (1) amplificar magia; (2) manter um dado adicional; **ou** (3) elevar um dado. Não conceder as três substituições simultaneamente. O limite usual de dados rolados/mantidos e os requisitos das ações não são revogados.

**PENDENTE:** precisar **qual reserva ou sacrifício** paga a substituição (Vida própria, sangue do terreno ou sangue extraído), quantas unidades são consumidas, quando se paga e como o custo interage com técnicas já gratuitas por foco ou outras reduções. **Não substituir Coragem automaticamente no rolador antes dessa decisão**; no protótipo, registrar apenas se o uso do turno foi declarado.

### Sangue puro e extração [DEFINIDO no conceito]

- **Magia de Sangue puro**, sem efeito especial de extração, causa **dano convencional**, respeitando as proteções normais.
- A **extração ofensiva de Sangue** exige que **o Hemomante e o alvo estejam Sangrando**. Para causar **1 dano direto à Vida do alvo**, o Hemomante **perde 1 de sua própria Vida**. A condição Sangrando por si só continua **sem causar dano à Vida** (SRD v0.70).
- O sangue assim extraído pode amplificar a Hemomancia conforme efeitos que venham a ser detalhados e **PODE contar para Transfusão Sanguinária**, inclusive quando combinado com Trevas. A restrição anterior foi revogada pelo autor. O custo de extração (1 Vida do Hemomante por 1 Vida retirada do alvo) já torna a reciclagem de sangue uma escolha cara. Rastrear a origem do sangue para **não contar o mesmo evento duas vezes**.
- Coágulo interno e hemorragia interna são manifestações ofensivas possíveis; **PENDENTE** definir se acarretam duração, dano ou condições adicionais. Não atribuir efeito mecânico automático além da extração direta expressamente aprovada.
- Os demais efeitos de combate de Sangue consomem **sangue derramado no ambiente**, que deve ser acompanhado separadamente; **PENDENTE** o custo por efeito e sua duração.

**Substituído:** procedimentos antigos que permitiam conjurar Sangue sem Sangramento próprio em troca de 2 Vida (ou 1 ao se autoaplicar Sangramento) e que concediam 2 Vida de dano direto ao alvo apenas por ativação. Não recuperar esses efeitos antigos enquanto o rework é revisado. Outras magias elementais, Perícia Transfusão e custos gerais não são alterados nesta versão.

## 0-BJ. Perícia Transfusão Sanguinária — protótipo

**DEFINIDO pelo autor:** nome **Transfusão Sanguinária**, **custo de compra 1 XP**, **requisitos: Perícia Transfusão + Perícia em Elemento Sangue**. É **uma conjuração ativa**, distinta da Perícia Transfusão existente.

**Efeito em revisão:** para cada **3 unidades elegíveis de sangue contabilizado por dano direto à Vida**, o Hemomante pode **recuperar 1 ponto de Vida**, até seu máximo. **Sangue derramado normalmente e sangue extraído por Hemomancia (inclusive combinação com Trevas) podem financiar a recuperação**, desde que uma mesma perda de Vida gere uma única entrada na contagem e não seja registrada em duas reservas. Exemplo condicional: se três extrações custam 3 Vida própria e geram três marcas, recuperar 1 Vida deixa saldo de −2 Vida ao Hemomante. A unidade geradora exata das marcas continua PENDENTE.

**PENDENTE:** a unidade exata do contador, se cada **ponto de Vida perdido** ou cada **ocorrência de dano** gera uma marca, de quem o sangue pode ser utilizado, como se recolhe, quanto tempo persiste no ambiente, alcance, teste, momento e custo de ativação (PP/Coragem/Sangue). O sangue extraído com Trevas não cria automaticamente marcas extras. Não conceder curas gratuitas automáticas nem determinar o custo por inferência.

**Dependência ainda pendente:** a Perícia **Transfusão** original continua com custo/requisitos de compra pendentes no catálogo. Transfusão Sanguinária aparece na ficha como **compra de 1 XP com pré-requisito real**; isso não autoriza comprar a Transfusão original sem uma decisão posterior.

## 0-BK. Protótipo de ficha de Hemomante — estado experimental

- Painel disponível a personagens que possuam **Perícia em Elemento Sangue**, com contadores independentes para **sangue derramado** e **sangue extraído por Hemomancia**. **Ambos são elegíveis** para Transfusão Sanguinária, sem lançar a mesma marca duas vezes; o total disponível é a soma das duas reservas.
- Contadores são **manuais**, não conectados ao dano de ataque nem a outros personagens, devido à ambiguidade de unidade e origem. Podem ser aumentados/diminuídos para testes de mesa, sem limites inventados além de proteção técnica do registro.
- Indicação manual de **Hemomante Sangrando** e marca **uma substituição de Coragem por turno**, sem gastar recursos na rolagem nem produzir benefícios automáticos antes da definição dos custos.
- Contador de cura potencial **1 Vida a cada 3 marcas elegíveis somadas (derramadas + extraídas)**. Registro manual de Transfusão Sanguinária, quando a Perícia estiver efetivamente adquirida e houver confirmação, consome **3 marcas da soma** e recupera **1 Vida**. Para evitar duplicidade na interface, o registro desconta primeiro marcas derramadas e depois extraídas (mera convenção visual de escrituração, **não** exigência mecânica nem prioridade de uso). Esse controle apenas **registra a conjuração já resolvida pelo Narrador**; não executa testes, não dispensa custos adicionais e não deve ser tratado como automação do poder.
- Persistir por personagem e preservar exportação/importação, duplicação e migração de fichas antigas.

## Sequência de decisões a revisar uma por vez

1. **Qual recurso é consumido ao substituir Coragem?** 1 Vida própria, sangue derramado elegível, sangue extraído ou outra regra — e em qual quantidade.
2. **Como contabilizar sangue derramado?** Uma marca por ponto de Vida perdido ou por ocorrência de dano; quais fontes contam.
3. **Quais são os custos e gatilhos da Transfusão Sanguinária ativa?** Restrições e alcance/tempo de cena.
4. **Quais efeitos ofensivos específicos de coágulo e hemorragia interna?** Limites de dano e condições.

**Preservados:** SRD v0.70 (Sangramento atravessa armadura somente como estado, sem dano), v0.69 (Perfurante e Barulhenta), v0.68 (afinidade por armadura), v0.67 (carga) e v0.66 (DE da armadura).
