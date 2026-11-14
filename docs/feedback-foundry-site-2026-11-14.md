# Feedback de playtest do Codex RPG no Foundry v14

Base da comparação em 14 de novembro de 2026. O site está na branch do PR #4, revisão `0cd2975`. O relatório também usa o Dice So Nice 6.2.6 e o Assimilação RPG 0.0.1 disponíveis na instalação local.

## Rolagem e retenção

| Aspecto | Site | Foundry 0.2.1.4 | Feedback |
| --- | --- | --- | --- |
| Pilha de Aprendiz e humanoide | Atributo + Conhecimento ou Prática, complemento e equipamentos quando habilitados. | Mesma composição básica, teto de nove dados, situação, afinidade, DE informada ou de um Token em combate. | A ficha deve indicar a fonte de cada dado e a origem dos modificadores. O Foundry ainda tem menos automações por Perícia e característica que o site. |
| Roll & Keep | A rolagem fica pendente e o usuário escolhe os dados. O Criar Conflito exige a quantidade de mantidos planejada para a ameaça. | Faces geradas uma vez pelo Roll nativo. A seleção pendente persiste no Actor, pode ser descartada sem gasto e pode ser comparada antes da confirmação. O número de mantidos continua tratado como limite no Foundry. | A referência do Assimilação é a escolha manual com limites visíveis e confirmação separada. A interface da ficha agora mostra a quantidade selecionada e as runas de cada face. A seleção pelo chat, como no Assimilação, continua ausente. |
| Faces e críticos | A soma conta só os mantidos. Crítico exige no mínimo dois dados mantidos, todos na face máxima. Antecipar pode anular Pavor ou converter 2A em 1E. | Mesma economia de símbolos no motor compartilhado com Criar Conflito. d4, d6, d10, d12 e d20 têm o mesmo mapeamento em ficha e em 3D. O d20 tem faces preparadas, com uso especial condicionado às regras. | O Simulador do Aprendiz ainda tem uma implementação própria. A prioridade seguinte é testar paridade de modificadores de características e Perícias, especialmente Furtividade, Precisa, Longa e Silenciosa. |
| Pavor e combate | Criar Conflito pré-visualiza custos locais, mostra a passagem de oportunidade com Antecipar e verifica requisitos de ação conjunta. | HUD mostra o saldo com runas preenchidas e vazias. O total da rodada conta Pavor que entrou na reserva. A ficha usa Pavor local da ameaça e a resolução publica no chat. | Passar oportunidade, ação conjunta, seleção de múltiplos alvos e efeitos avançados seguem pendentes de implementação ou de decisão da regra. |
| Consequências | O site permite simular dano e manipular Vida/Integridade e equipamentos. | O Foundry anuncia o resultado, consulta a DE e registra o gasto, com procedimentos ainda experimentais de transferência no combate. | Testar com dois clientes antes de usar a transferência automática em campanha. Dano à Vida e à Integridade, condições e efeitos de Perícias ainda dependem de adjudicação. |

Fontes do código web desta revisão. [Criador do site](https://github.com/Ike-Grifact/Codex-RPG/blob/0cd2975/prototipo-ficha/app.js), [motor de Criar Conflito](https://github.com/Ike-Grifact/Codex-RPG/blob/0cd2975/criar-conflito/roll-engine.mjs), [SRD v0.39](https://github.com/Ike-Grifact/Codex-RPG/blob/0cd2975/docs/srd-continuidade-v0.39.md).

## Dice So Nice

Com Dice So Nice ativado no mundo, o Foundry anima para quem rolou a mesma pilha que aparece na seleção de mantidos. Os cinco presets usam imagens das runas de Êxito, Antecipar e Pavor. Um losango dourado identifica a face máxima, inclusive quando o mesmo conjunto de runas aparece em outra face. O crítico continua sendo calculado pela seleção combinada. A confirmação publica o resultado simbólico no chat.

O Assimilação instalado registra presets próprios, associa as faces numeradas aos seus símbolos e conserva os resultados em uma mensagem com seleção manual e confirmação. O Codex aproveita o padrão de interação. As faces, a retenção e o cálculo continuam regidos pelo Codex. [Documentação dos presets do Dice So Nice](https://riccisi.gitlab.io/foundryvtt-dice-so-nice/api/customization/), [API de sistemas](https://riccisi.gitlab.io/foundryvtt-dice-so-nice/api/dice-systems/).

## Criação de fichas e itens

- **Actors → Criar ficha Codex** abre a criação com identidade, tipo e orçamento. Para Aprendiz ou humanoide é possível escolher Atributo G1 e Formação G1, usar Força + Disciplina ou abrir uma ficha em branco. Na ficha aberta, distribua XP e escolha Perícias.
- **Criatura comum** usa os dados comuns de Atributo, com orçamento do Narrador e retenção de até dois dados. **Monstro extraordinário** usa a escala de Atributos monstruosa e a retenção ampliada conforme o Grau. Humanoides usam Atributos e Formação humanos.
- **Actors → Importar do site** aceita o JSON exportado pelo Criador ou pelo Criar Conflito. O primeiro cria Aprendiz ou humanoide com equipamentos e recursos de troca. O segundo cria o elenco como documentos separados e leva inventário básico, notas, capacidades, liderança e Pavor local. O saldo público do arquivo de conflito pertence ao encontro de origem.
- **Items → Criar item Codex** oferece o catálogo G1 ou item personalizado. **+ Novo equipamento**, na ficha, abre as mesmas opções para o inventário daquele Actor. O preço continua uma referência de playtest.

O **Codex Genético**, os pacotes de pré-requisitos e a distribuição/compra com VT ainda são mais completos no site. A ligação disponível hoje é montar e exportar no site e importar no Foundry. A importação leva o estado da ficha e do inventário. Histórico, retrato, mapa genético e automações particulares de Perícias ficam no arquivo de origem. As Perícias conhecidas são copiadas e os IDs sem equivalente ficam anotados.

## Roteiro de homologação

1. Em um mundo de teste, confirmar a HUD com 3 de 6P e duas rodadas. Verificar no segundo cliente que os controles aparecem apenas para o Narrador.
2. Ativar o Dice So Nice, rolar, conferir a face 3D com a carta correspondente e escolher os mantidos. Repetir com o módulo desativado. Verificar em particular a orientação do d4 e a face máxima do d10.
3. Criar os quatro tipos de ficha e importar uma ficha do Criador e um conflito com itens. Comparar XP, dados, Vida, Proteção, Carga e Pavor local antes de testar efeitos automáticos.
