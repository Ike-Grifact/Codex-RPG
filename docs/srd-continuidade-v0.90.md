# Codex RPG — SRD de Continuidade v0.90

**Data:** 22/11/2026  
**Estado:** revisão de playtest com decisão autoral e correções de interface  
**Precedência:** complementa o SRD v0.89 e o Playtest Nível 1 v1.0; somente os pontos expressamente alterados abaixo substituem os anteriores.

## 1. Integridade de armaduras G1 — DEFINIDO

Decisão explícita do autor em 22/11/2026, após o playtest:

| Armadura G1 | Integridade anterior | Integridade nova |
|---|---:|---:|
| Muito Leve / Roupas Simples | 3 | **2** |
| Leve | 7 | **5** |
| Média | 12 | **8** |
| Pesada | 17 | **12** |

O ajuste altera **somente a Integridade material**; a DE defensiva, a categoria de peso, o preço, os dados e requisitos de equipamentos **não mudam** por esta decisão.

**Migração de itens já registrados:** conservar o dano sofrido (máximo anterior − Integridade anterior), subtraí-lo do novo máximo e limitar o resultado a zero. Não curar automaticamente. Os sistemas também devem reconhecer históricos anteriores com máximos 10/15/20 para as armaduras convencionais, sem repetição de abatimento. **Escudos e armaduras acima de G1 não são nerfados por extrapolação.**

## 2. Igualdade de penalidades de Saúde entre lados — DEFINIDO

Com o aumento anterior de Vida máxima, **inimigos utilizam a mesma tabela de estados e penalidades de Saúde dos jogadores**: Saudável (0), Ferido (−1A), Incapacitado (−1E, +1P), Inconsciente (−2E, +2P) e Morto (sem ação). Os limites de Vida vêm das capacidades da própria ficha. Penalidades de estados se **substituem**, não se acumulam entre si.

Para humanoides com Coragem, preservam-se os custos de agir da tabela: 0 / 0 / 1 / 2; nenhuma Perícia é concedida automaticamente. **PENDENTE:** custo operacional para criaturas que possuem somente Pavor local (sem recurso Coragem) quando Incapacitadas ou Inconscientes; aplicar os símbolos de Saúde, mas não inventar conversão de Coragem em Pavor.

## 3. Simulador/Comparador — comportamento de interface

- **Elevação de fonte [DEFINIDO v0.89 e Playtest v1.0]:** escolhe uma única fonte realmente presente na pilha, eleva temporariamente seu Grau inteiro (até G6), aplica a tabela completa de dados do Grau seguinte, pode acrescentar dados e custa 1 Coragem. A ficha não compra Grau e não perde XP.
- **Monstros e Pavor [DEFINIDO nas regras precedentes]:** reserva G1 = 4P; acrescentar 1P por Grau até 8P. Monstros gastam Pavor local para manter dados acima dos dois naturais, dentro do limite por Grau. Humanoides hostis conservam sua regra específica de Coragem para retenção extra. A interface deve exibir máximo, disponível e gasto.
- **Peso tático [DEFINIDO]:** aplicar o modificador da tabela própria quando existir armadura equipada no alvo humanoide e arma/ataque identificáveis. Peso, situação e estado de Saúde são origens distintas, sem atribuir peso natural automático a inimigos sem armadura ou criaturas com porte ainda não definido.
- **Proveniência de runas [interface]:** cada dado mantido identifica a fonte real, a face e os símbolos E/A/P; condição situacional, afinidade, Saúde, crítico e conversões são listados separadamente. Dados descartados não contribuem.
- **Ativação de Perícias adquiridas [interface]:** permitir selecionar uma Perícia existente na ficha e registrar e descontar a Coragem **explicitamente declarada e conferida na regra da Perícia**. O desconto compõe o teto de 5 Coragens por rolagem junto da Saúde, retenção e elevação. A interface não inventa custo, gatilho ou aplicação de efeitos especializados.

## 4. Não alterado / PENDENTE

Não alterar faces de dados, custo de compra de Perícias, fonte obrigatória, limites 9 rolados/4 mantidos, danos diretos, regras de magia ou equilíbrio entre classes/profissões. O patamar de 5 E+P para 2 de Vida sem armadura mantém o adendo de 22/11/2026; dano inferior e transbordo da Integridade continuam **PENDENTES**. Sem inventar tabelas gerais de peso natural de criaturas, procedimentos das Perícias ou custos de ação de monstros incapacitados.

**Validação:** regressões de migração das armaduras G1, elevação de Grau, estados de Saúde, Pavor por Grau, custo conjunto e origem dos símbolos. Documentar os pontos ainda dependentes de deliberação do autor.
