# Codex RPG — Análise matemática dos quatro estados de Saúde

**Data:** 16/11/2026  
**Base:** SRD v0.47, seção 0-AH, com a nova distribuição de Saúde informada pelo autor.  
**Estado:** quatro estados e modificadores **DEFINIDOS**; cálculo de Vida máxima incluindo antigo bônus de Força **PENDENTE**; alternativa de Pavor sem pontuar DE **PROPOSTA**, não aprovada.

## 1. Regra de estados

Vida de referência = quatro pontos básicos, um em cada estado; cada Grau de Vigor acrescenta um ponto, alternadamente em **Saudável**, depois **Ferido**, repetindo. Os dois últimos estados têm sempre um ponto. A contribuição da Força ainda precisa de decisão, portanto **4+Vigor é a parte de Vida especificada**, não a revisão completa e definitiva da antiga fórmula `3+Vigor+piso(Força/2)`.

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

## 3. Alternativa PROPOSTA, sem aplicação

**Separar Pavor de Estado de Pavor obtido nos dados para a soma da DE**, mantendo +1P/+2P como risco/consequência depois da comparação, mas **sem pontuá-lo para alcançar a DE**. É apenas uma possível resolução do incentivo paradoxal. Não aprovada; não implementada. Outra possibilidade a analisar seria ajustar a penalidade de Êxito sem alterar Pavor, mas nenhum número alternativo deve ser aplicado sem autorização.

## 4. Consequências de integração

- **Força:** a antiga fórmula de Vida máxima inclui `piso(Força/2)`; a decisão nova especifica Vigor, mas não o destino da contribuição de Força.
- **Cura:** quatro estados exigem reatribuir procedimentos antes vinculados às três caixas.
- **Instinto de Sobrevivência:** anulava −1A do antigo Incapacitado; agora esse estado recebe −1E/+1P, tornando a habilidade anterior sem efeito tal como escrita.
- **Efeitos de Veneno:** estados provocados por condições não são automaticamente equivalentes a entrar numa caixa de Vida.
- **Druídica:** a conversão histórica por três terços está superada. Mapear quatro faixas entre criatura e humano ainda é hipótese não aprovada.
- **Implementação:** o módulo matemático `prototipo-ficha/health-stages.mjs` documenta e testa a distribuição, mas a Vida máxima e a interface antiga de três caixas não foram alteradas em produção por causa das incompatibilidades acima.

**Status das regras:** os quatro estados, penalidades e a distribuição de Vigor estão **DEFINIDOS**. O destino do antigo bônus de Força, integração na ficha, compatibilidade de Perícias e a possibilidade de Pavor de estado não contar para DE permanecem **PENDENTES/PROPOSTOS** conforme descrito.
