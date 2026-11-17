---
title: "Codex RPG — SRD de Continuidade v0.67: Balanço corporal pela carga"
version: "0.67"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO — classificação corporal pelo percentual de carga; PENDENTE — adaptação da afinidade tática"
---

# Codex RPG — SRD de Continuidade v0.67

## 0-BD. Balanço corporal determinado pela carga transportada [17/11/2026]

**DEFINIDO por decisão do autor em 17/11/2026.** Esta seção substitui **somente** a classificação anterior de Balanço por comparação entre Agilidade e Vigor. A **v0.66** permanece vigente para DE defensiva, modificadores gerais de armadura, limites e Integridade. A classificação tática de armas e magias, o peso físico de itens e seus custos de carga continuam conceitos distintos.

### Classificação

A ficha mede quanto da **capacidade de carga física disponível** está ocupada por itens, armaduras, focos e recursos transportados. Calcular:

`ocupação (%) = 100 × carga física total / capacidade de carga total`

| Percentual efetivo utilizado | Balanço corporal |
|---|---|
| `0 ≤ uso < 25%` | **Muito Leve** |
| `25% ≤ uso < 50%` | **Leve** |
| `50% ≤ uso < 75%` | **Médio** |
| `75% ≤ uso < 100%` | **Pesado** |
| `uso ≥ 100%` | **Muito Pesado** |

Classificar pelo percentual **sem arredondá-lo para decidir o limite**. Valores exibidos podem ser arredondados sem alterar a classe. O cálculo acompanha automaticamente a mudança do inventário e da capacidade, inclusive quando uma evolução de **Vigor** aumenta a capacidade de transporte.

**Capacidade pré-existente preservada:** a implementação da ficha mantém a fórmula de capacidade em unidades **Alto** já presente no Livro do Jogador e no protótipo, incorporando graus válidos de Força, Vigor, Disciplina e Atletismo. **Não foi aprovada** nova equivalência de quilos, custo de XP, penalidade de sobrecarga nem mudança de Agilidade, DE ou deslocamento.

### Exibição na ficha do jogador [IMPLEMENTADO NA BRANCH DE REVISÃO]

- Manter o quadro de **Carga** (usada / capacidade total) e substituir o quadro **Balanço Agilidade × Vigor** por **Balanço por Carga**.
- Mostrar **20 blocos visuais** representando a capacidade total: cada bloco corresponde a **5%**, admitindo preenchimento parcial quando o peso de um item equivale a fração de bloco.
- Apresentar percentual e classe atuais e a contribuição de cada item em unidades **Alto** e em porcentagem da capacidade atual.
- **100% ou mais** é **Muito Pesado**; o alerta anterior de **capacidade excedida** aparece apenas quando o peso **ultrapassa 100%**. Não bloquear itens nem aplicar penalidades novas automaticamente.
- Preservar quantidades e pesos dos itens já cadastrados, inclusive peso físico de focos e recursos de troca.

### Elementos preservados [DEFINIDO]

- A **DE defensiva natural**, incluindo Vigor e Agilidade onde previsto, e os modificadores da armadura da **v0.66**, continuam intactos.
- Os **tipos de armaduras** Muito Leve, Leve, Média, Pesada e Muito Pesada mantêm seus bônus de DE, Integridade, requisitos e propriedades.
- As categorias próprias de **armas, efeitos elementais e magias** não são substituídas automaticamente pelo Balanço da carga corporal.
- Para criaturas que usam ficha própria, não presumir que a simples ausência de inventário implique corpo Muito Leve.

### Pendências [PENDENTE]

1. A matriz histórica de **afinidade entre peso do ataque e Balanço do alvo** possui só três colunas (Leve/Médio/Pesado). A nova classificação possui cinco. Não aplicar conversões ou criar novos modificadores até o autor definir o confronto para Muito Leve e Muito Pesado.
2. Classificação corporal de criaturas não humanoides, corpos naturais e transformações druídicas com ficha de criatura.
3. Consequência mecânica específica de **ultrapassar** a capacidade, além do aviso já existente; não criar punição automática.
4. Reavaliar em playtest o impacto da capacidade inicial pequena sobre as classes: com capacidade de 1 Alto, carregar 1 Alto já ocupa 100% e classifica como Muito Pesado. **Não aumentar o orçamento de carga sem decisão expressa.**

**Implementação parcial e compatibilidade:** a branch `proposta/balanco-por-carga-v067` atualiza o site do jogador (`prototipo-ficha/app.js`, `index.html`, `styles.css`) e o Livro do Jogador. A interface histórica de afinidade manual Leve/Médio/Pesado permanece, **pendente de nova tabela**, assim como possíveis adaptações à ficha de conflitos e ao Foundry. Nenhuma alteração foi aplicada diretamente à `main`.

---
**Histórico:** SRD v0.66 (17/11/2026), modificadores gerais de armadura e teto defensivo 12, mantido.
