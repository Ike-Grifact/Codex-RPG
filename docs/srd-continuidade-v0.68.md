---
title: "Codex RPG — SRD de Continuidade v0.68: Afinidade por armadura do alvo"
version: "0.68"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO — afinidade contra armadura do humanoide; PENDENTE — classe natural de criaturas e escopo da penalidade de sobrepeso"
---

# Codex RPG — SRD de Continuidade v0.68

## 0-BE. Afinidade de peso considera a armadura, não o inventário [17/11/2026]

**DEFINIDO pelo autor em 17/11/2026.** Para **alvos humanoides**, o peso de referência usado ao comparar o ataque Leve, Médio ou Pesado é a **armadura efetivamente equipada** no alvo, e **não** a classe de carga ou a relação entre Agilidade e Vigor. A matriz de afinidade preexistente é preservada, sem novas Vantagens, Desvantagens, dados ou custos.

| Categoria do alvo humanoide | Coluna de afinidade preexistente |
|---|---|
| Armadura **Muito Leve** ou **Leve** | **Leve** |
| Armadura **Média** | **Médio** |
| Armadura **Pesada** ou **Muito Pesada** | **Pesado** |

### Matriz preservada [DEFINIDO]

| Peso tático do ataque / Armadura do alvo | Muito Leve ou Leve | Média | Pesada ou Muito Pesada |
|---|---|---|---|
| Leve | Normal | Vantagem (+1A) | Desvantagem (−1A) |
| Médio | Vantagem (+1A) | Desvantagem (−1A) | Normal |
| Pesado | Desvantagem (−1A) | Normal | Vantagem (+1A) |

**Vocabulário:** a redação das afinidades e das Perícias de armas deve dizer **contra armadura Leve/Média/Pesada** quando o alvo for um humanoide, incluindo as equivalências acima. O próprio peso tático da arma/magia continua independente do peso físico do item.

**Balanço por carga da v0.67 não determina vantagem de ataque:** permanece como indicador de carga transportada e de **sobrepeso**. As faixas de carga (<25%, 25–<50%, 50–<75%, 75–<100%, ≥100%) permanecem intactas, assim como o mapa retangular do inventário e a capacidade com Força, Vigor, Disciplina e Atletismo. A penalidade de **−1E para Muito Pesado/sobrepeso**, informada pelo autor na revisão desta matéria, está registrada como **DEFINIDA no valor**, mas o momento de aplicação, a abrangência dos testes e sua integração automática permanecem **PENDENTES**; não aplicar esta penalidade à armadura Muito Pesada por si só. A armadura Muito Pesada mantém seu próprio modificador de **−2 DE** da v0.66.

### Criaturas e NPCs [DEFINIDO no princípio / PENDENTE no cálculo]

- Inimigos não humanoides conservam uma classe de peso por **porte/tamanho natural**, considerando também **Força e Vigor**. Isso orienta o Narrador; não equiparar ausência de inventário a Muito Leve.
- O autor também mencionou referência de **50%** para estimativa do peso natural das criaturas, mas **não foi estabelecida expressão numérica operacional** para combinar porte, Força, Vigor e esse percentual. Não implementar cálculo presumido.
- **Humanoides**, incluindo inimigos humanoides, seguem a tabela de armaduras deste documento. A classificação de um humanoide **sem armadura** ainda exige regra de referência; não atribuir bônus por inferência sem decidir.
- A situação de corpos de monstros e de formas druídicas permanece pendente de procedimento próprio.

### Mudanças desta versão

A v0.68 **substitui expressamente** a parte da v0.67 que supunha que seria necessário ampliar a matriz de afinidade para cinco classes de alvo. As cinco classes de **carga** continuam existindo para o inventário; na **afinidade tática de ataques** são usadas as **três** colunas antigas, determinadas pela armadura equipada no humanoide ou pela classificação natural pertinente à criatura.

**DEFINIDO:** armaduras não perdem Integridade, DE nem propriedades por esta revisão. A regra de dano direto à Vida, Perfurar, Sangramento, Fogo e Cravar será revisada **separadamente**, conforme as novas decisões posteriores do autor; esta versão não altera cálculos de dano.

**IMPLEMENTAÇÃO nesta branch:** atualizar a descrição da tabela no Livro do Jogador e o rótulo do seletor manual de afinidade no criador. Não alterar a matriz numérica nem assumir novas regras para inimigos desarmados ou para o cálculo de massa natural de criaturas.

**Histórico:** preservados os SRDs anteriores, incluindo v0.67 (mapa de inventário) e v0.66 (DE geral das armaduras).
