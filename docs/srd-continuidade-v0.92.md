# Codex RPG — SRD de Continuidade v0.92

**Data:** 23/11/2026  
**Estado:** decisão autoral sobre carga e melhoria da compra de equipamentos.  
**Precedência:** complementa o SRD v0.91 e substitui somente a fórmula de capacidade de carga e o procedimento de aviso pré-compra onde versões antigas divergem. Nenhuma outra regra foi revista.

## 1. Capacidade física de carga — DEFINIDO

A capacidade máxima, medida em unidades **Alto**, passa a ser:

```
Capacidade = 1 + piso((Força + Vigor + Atletismo) / 3)
```

Somar os graus **antes** da divisão por três e arredondar uma única vez para baixo. **Disciplina não integra essa fórmula**. A capacidade mínima é 1 Alto; com Força, Vigor e Atletismo no grau 6, o valor é 7 Altos. Os graus representam as fontes efetivamente compradas na ficha (inclusive graus de origem válidos).

Exemplos: FOR 2, VIG 1, ATL 1 → capacidade 2 Altos; FOR 1, VIG 1, ATL 0 → capacidade 1 Alto; FOR 3, VIG 3, ATL 3 → capacidade 4 Altos.

**Regras substituídas:** a capacidade antiga `1 + piso(FOR/3) + piso(VIG/3) + piso(Disciplina/3) + piso(ATL/3)` e variações documentais que falavam em `Armas/3`. Não atribuir bônus separados por atributo; usar o piso sobre a soma.

## 2. Pesos e balanço — NÃO ALTERADOS

As unidades de carga existentes continuam: **Muito Leve 0,0125**, **Leve 0,125**, **Médio 0,5**, **Pesado/Alto 1** e **Extremo 2** Altos, com os modificadores já cadastrados em itens específicos. A contagem inclui itens transportados equipados ou guardados, itens de foco, escudos transportados e recursos físicos de troca, preservadas as exceções específicas do código.

O balanço continua sendo calculado sobre `100 × carga utilizada / capacidade`:
- abaixo de 25%: **Muito Leve**;
- 25% a menos de 50%: **Leve**;
- 50% a menos de 75%: **Médio**;
- 75% a menos de 100%: **Pesado**;
- 100% ou mais: **Muito Pesado**.

Ultrapassar 100% mantém o aviso de capacidade excedida; chegar exatamente a 100% classifica como Muito Pesado. A referência de **−1 Êxito em sobrepeso** continua com abrangência e automação **PENDENTES**, conforme Livro do Jogador; não estabelecer penalidade nova por esta decisão.

## 3. Prévia de carga no comércio — DEFINIDO (comportamento de interface)

**Antes da confirmação da compra**, tanto na etapa de patrimônio inicial do criador quanto no mercado da ficha já criada, mostrar:
- carga atual e capacidade máxima;
- peso do item escolhido e carga líquida projetada **após** a compra;
- percentual ocupado e novo balanço;
- aviso destacado se a compra resultar em **Pesado (≥75%)** ou **Muito Pesado (≥100%)**.

A compra de itens com VT usa os recursos da ficha para o pagamento, e esses recursos têm peso físico. Portanto, a prévia **soma o novo item e subtrai o peso dos recursos efetivamente gastos**; não pode somar o item sem considerar a saída dos recursos. A confirmação de compra deve reapresentar a carga prevista, permitindo **confirmar ou cancelar** mesmo quando houver sobrepeso. O alerta é informativo: não bloqueia compras, não troca automaticamente equipamentos por leves e não cria um limite numérico adicional.

Na revisão final do Aprendiz, apresentar a carga e o balanço reais para evitar surpresas depois de concluir o personagem. Atualizar o mapa de capacidade do inventário para explicitar a contribuição conjunta dos três graus, em vez de apresentar os pisos antigos por fonte.

## 4. Validação e limites

**DEFINIDO:** nova fórmula e alerta pré-compra descritos acima.

**EXPERIMENTAL:** preços de compra em VT e patrimônio inicial mantidos como no catálogo/playtest vigente.

**PENDENTE:** abrangência e aplicação automática da penalidade por Muito Pesado/sobrepeso. Outros custos, penalidades ou mudanças de categoria de equipamento não são introduzidos.

**Não alterar:** XP, dados e Perícias, dano, Integridade, escudos, afinidade tática de peso de armas e armaduras, sistemas de VT, salvamento local, importação/exportação e capacidade de focos.
