# Codex RPG — Análise matemática dos quatro estados de Saúde

**Data:** 16/11/2026  
**Base:** SRD v0.47, seção 0-AH, com a nova distribuição de Saúde informada pelo autor.  
**Estado:** quatro estados, custos, Pavor contando na DE e fórmula de Vida com bônus de Força **DEFINIDOS**. A hipótese anterior de retirar Pavor de Saúde da DE foi **REJEITADA** pelo autor em 16/11/2026.

## 1. Regra de estados

**Vida máxima DEFINIDA = 4 + Vigor + piso(Força/2).** Os quatro pontos básicos distribuem-se 1/1/1/1 em Saudável/Ferido/Incapacitado/Inconsciente. Cada ponto adicional de **Vigor** e **piso(Força/2)** entra alternadamente em Saudável, depois Ferido. Incapacitado e Inconsciente permanecem com 1 ponto. Seja `X=Vigor+piso(Força/2)`: a distribuição completa é `[1+teto(X/2), 1+piso(X/2), 1, 1]`.

| Estado | ΔE | ΔA | ΔP | Coragem para agir |
|---|---:|---:|---:|---:|
| Saudável | 0 | 0 | 0 | 0 |
| Ferido | 0 | −1 | 0 | 0 |
| Incapacitado | −1 | 0 | +1 | 1 |
| Inconsciente | −2 | 0 | +2 | 2 |

## 2. Chance exata com d6 + d10

**60 combinações equiprováveis de faces**; nível 1, um Atributo G1 (d6) e uma Formação G1 (d10), até **dois dados mantidos**, sem Vantagem, equipamento, terceiros dados, aumento de Grau ou gasto de Coragem para dados adicionais. O custo obrigatório da condição **não entra como bônus nem é considerado gratuito**; as probabilidades são **condicionais à ação ser permitida** mediante o pagamento informado. Motor de referência: `criar-conflito/codex-rules.mjs`, que implementa face 10 do d10 = **2E+1A**, conforme SRD oficial. Pode-se gastar 1A para anular 1P e 2A para converter em 1E; cada símbolo só pode ser usado uma vez.

Para cada combinação de faces, avalia-se o melhor subconjunto de até dois dados mantidos, com prioridade: alcançar a DE, conseguir acerto sem Pavor se possível, minimizar Pavor, maximizar E/resultados. **Isso modela uma política racional de escolha declarada**, não o comportamento obrigatório de todo jogador.

| Estado | DE 1 | DE 2 | DE 3 | DE 4 |
|---|---:|---:|---:|---:|
| Saudável | 93,33% | 63,33% | 23,33% | 3,33% |
| Ferido | 93,33% | 63,33% | 20,00% | 0,00% |
| Incapacitado | **100,00%** | **83,33%** | **36,67%** | 3,33% |
| Inconsciente | **100,00%** | **100,00%** | **73,33%** | **21,67%** |

### 2.1. DE 2: sucesso limpo e risco

| Estado | Acerto limpo | Acerto com Pavor | Falha limpa | Falha com Pavor | Total |
|---|---:|---:|---:|---:|---:|
| Saudável | 25,00% | 38,33% | 36,67% | 0,00% | 100% |
| Ferido | 23,33% | 40,00% | 36,67% | 0,00% | 100% |
| Incapacitado | 1,67% | **81,67%** | 3,33% | 13,33% | 100% |
| Inconsciente | **0,00%** | **100,00%** | 0,00% | 0,00% | 100% |

**Resultado de balanceamento:** os estados não penalizam estritamente a chance de sucesso: o Pavor adicional contribui numericamente para `E + P` e em alguns resultados aumenta a pontuação total. Exemplo extremo: sem E/P naturais, `Inconsciente` gera +2P e pode superar DE 2, embora somente mediante **2 Coragens** e com riscos de Pavor. O aumento de acertos arriscados e possíveis efeitos sobre Pavor transferido, dano, Coragem e protagonismo pode ou não compensar esse ganho — isso precisa de playtest.

## 3. Decisão autoral: aceitar a eficiência arriscada [DEFINIDO]

Em 16/11/2026, o autor decidiu **não excluir o Pavor adicional de Saúde da DE**. A vantagem aritmética em alcançar dificuldades enquanto Incapacitado ou Inconsciente é deliberada e contrabalançada pelo **custo por ação** (1 ou 2 Coragens) e pelas consequências de Pavor. A mecânica visa preservar a possibilidade de agir sob extrema pressão, sem transformar automaticamente falhas em acertos limpos. **A alternativa anteriormente sugerida — contar o Pavor de estado somente como consequência, sem pontuar DE — foi REJEITADA, não está pendente.**

**Limite prático:** os percentuais da tabela são condicionais ao pagamento do custo. Com menos de 2 Coragens, um personagem Inconsciente não consegue agir por essa regra, ainda que o Pavor pudesse atingir a DE. Não presumir uma ação gratuita, nem criar uma exceção de desespero sem autorização posterior. Com 2 Coragens, o jogador pode agir com todos os riscos; depois do gasto, ficará sem reservas suficientes para uma segunda ação nessas condições, salvo recuperação ou intervenção.

## 4. Consequências de integração

- **Força:** o bônus `piso(Força/2)` foi expressamente mantido. Vida total = `4+Vigor+piso(Força/2)`, com pontos adicionais alocados alternadamente nas duas primeiras faixas.
- **Cura:** quatro estados exigem reatribuir procedimentos antes vinculados às três caixas.
- **Instinto de Sobrevivência:** anulava −1A do antigo Incapacitado; agora esse estado recebe −1E/+1P, tornando a habilidade anterior sem efeito tal como escrita.
- **Efeitos de Veneno:** estados provocados por condições não são automaticamente equivalentes a entrar numa caixa de Vida.
- **Druídica:** a conversão histórica por três terços está superada. Mapear quatro faixas entre criatura e humano ainda é hipótese não aprovada.
- **Implementação:** o módulo `prototipo-ficha/health-stages.mjs` testa a distribuição com Vigor e Força; a ficha web agora exibe quatro faixas e aplica os modificadores de Saúde e respectivos gastos de Coragem nas rolagens. O protótipo **Foundry agora aplica modificadores e Coragem nas rolagens de personagens**, mantendo a distribuição atualizada e o estado visível. O Criar Conflito recebeu o máximo de Vida e a leitura de estado, mas ainda precisa integrar os custos automáticos de monstros e NPCs, que possuem reservas próprias.

**Status das regras:** quatro estados, penalidades, Coragem, Força na Vida e Pavor contando DE estão **DEFINIDOS**. Integração em todos os motores, compatibilidade de Perícias, cura e transformação Druídica ainda têm pontos **PENDENTES**. A exclusão do Pavor de Saúde da DE está **REJEITADA**.
