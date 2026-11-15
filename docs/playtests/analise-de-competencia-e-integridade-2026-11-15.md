# Análise técnica de competência, DE narrativa e redução da Integridade — 15/11/2026

**Referência normativa:** [SRD de Continuidade v0.44](../srd-continuidade-v0.44.md), seção 0-AD. Cálculo realizado a partir das **faces dos dados do criador e do motor Foundry atuais**, sem mudar essas faces. **Objetivo:** estudar em quais dificuldades um personagem pode ser considerado competente em tarefas rotineiras de Conhecimentos/Práticas, antes de aprovar eventual regra de sucesso sem rolagem.

## 1. Premissas e limites

- **DE narrativa experimental atual do Livro do Mestre:** **DE 1–2 comum**, **DE 3 exige treinamento**, **DE 4 excepcional**. Não confundir com a DE defensiva de um personagem/monstro com ficha.
- Atributos por Grau: **G0 d4; G1 d6; G2 2d6; G3 3d6; G4 2d6+d10; G5 d6+2d10; G6 3d10**.
- Conhecimentos ou Práticas por Grau: **G0 d6; G1 d10; G2 2d10; G3 3d10; G4 2d10+d12; G5 d10+2d12; G6 3d12**.
- Na resolução, o personagem rola as fontes habilitadas e escolhe livremente os dados mantidos. **2 mantidos normais até nível 5; 3 a partir de nível 6; quarto dado exige gasto/habilitação conforme regra vigente.** O teto global de até 9 rolados/4 mantidos persiste.
- Os percentuais usam **somente um Atributo e um Conhecimento OU Prática**. Enumeram **todas as faces equiprováveis**, com escolha ótima dos dados mantidos para superar a DE, permitindo **2 Antecipar → 1 Êxito** quando isso aumenta o resultado. Anular Pavor é opcional e **não** foi usado para maximizar acerto. Crítico em 3 dados mantidos com todas as faces máximas acrescenta +1 Êxito conforme regra atual. Não há bônus de equipamento, Perícias, vantagens, preparação, fontes adicionais, elevação de dados ou custo de coragem, exceto o quarto dado explicitamente pago.
- Chance de superar a DE é **diferente de acerto limpo e de sucesso narrativo sem consequências**. Pavor mantido não anulado alimenta risco e oportunidades inimigas. O teste é **matematicamente exato dentro dessas hipóteses**, não resultado de amostragem.

## 2. Resultados exatos (arredondados para 2 casas)

| Construção | Mantidos | DE 1 | DE 2 | DE 3 | DE 4 | DE 5 | DE 6 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Atributo G0 + Formação G0 (d4 + d6) | 2 | 83,33% | 33,33% | 4,17% | 0% | 0% | 0% |
| Atributo G1 + Formação G1 (d6 + d10) | 2 | 93,33% | 63,33% | 23,33% | 3,33% | 0% | 0% |
| Atributo G2 + Formação G2 (2d6 + 2d10) | 2 | 99,56% | 95,56% | 60,47% | 23,11% | 4,00% | 0% |
| Atributo G2 + Formação G2, 3 mantidos autorizados | 3 | 99,56% | 95,56% | 82,22% | 52,14% | 22,56% | 4,78% |
| Atributo G3 + Formação G3 (3d6 + 3d10) | 3 | 99,97% | 99,57% | 97,44% | 78,34% | 46,63% | 15,94% |
| Atributo G4 + Formação G4 (2d6+d10 + 2d10+d12) | 3 | 99,99% | 99,78% | 98,63% | 88,08% | 65,15% | 34,37% |
| Atributo G4 + Formação G4, 4 mantidos **pagos** | 4 | 99,99% | 99,78% | 98,63% | 94,99% | 83,61% | 62,17% |

**Atenção a arredondamentos:** caso A4+F4 com quarto mantido tem **94,985%** de chance em DE 4, valor **inferior a 95%**, ainda que exiba 94,99% com duas casas. A0+F0 DE 3 é **1 em 24** (4,1667%), pela combinação em que o Antecipar conservado permite conversão, apesar da ausência de Êxito direto no d4.

### O que poderia dispensar rolagem se adotássemos 95% [PROPOSTO, não DEFINIDO]

- Com fontes **G2 + G2**, DE 2 se enquadra (95,56%), DE 3 não.
- Com fontes **G3 + G3**, DE 3 se enquadra (97,44%), DE 4 não.
- Com fontes **G4 + G4**, DE 3 se enquadra (98,63%), DE 4 não, mesmo comprando quarto dado: **94,985% < 95%**.
- A porcentagem é **um critério de modelagem**, não uma autorização de “nunca falhar” nas mesas. O Narrador ainda pode exigir teste quando houver pressão, oposição, risco de Pavor, consequências significativas ou conflito tático, conforme futura regra.

**Por que os dados não dão garantia matemática de 100%:** cada d4, d6, d10 e d12 oferece faces vazias e essas faces podem ocorrer simultaneamente. Na combinação A3+F3 (3d6+3d10), **64/216.000** resultados possíveis têm **todos os seis dados vazios**; logo a chance absoluta de atingir DE positiva permanece abaixo de 100% sem bônus fixos. Uma regra de conhecimento automático deve ser assumida como competência narrativa, não confundida com distribuição de dados.

### Nível versus Grau [PENDENTE]

A progressão aberta permite que dois personagens do **mesmo nível** comprem graus diferentes: não existe um dado único por nível. Além disso, o **orçamento inicial de 20 XP está EXPERIMENTAL**, enquanto a tabela `XP_LEVEL_REFERENCE` ainda traz referência experimental de **19 XP no nível 1**. Esses números não devem ser misturados silenciosamente para declarar um **Grau garantido por nível**. Primeiro definir orçamento, requisitos e Marcos por nível, depois produzir uma tabela de **cenários mínimos/médios/máximos de builds possíveis** — nunca “Atributo G3 é obrigatório no nível X”.

## 3. Proteção: consequências imediatas da redução de 3

A decisão de reduzir 3 pontos está **DEFINIDA**; a adequação dos valores G1 continua sob playtest.

| Armadura G1 | Antes | Depois | Redução relativa |
|---|---:|---:|---:|
| Muito Leve | 0 | 0 | — |
| Leve | 10 | **7** | **30%** |
| Média | 15 | **12** | **20%** |
| Pesada | 20 | **17** | **15%** |

Se cada golpe **acertado** desgastar **exatamente 2 pontos de Integridade efetiva**, **sem resistências, regeneração, esquiva, efeitos especiais nem excedentes**, a quantidade de golpes aproximada para esgotar a armadura passa de: Leve **5 → 4**, Média **8 → 6**, Pesada **10 → 9**. Isso **não corresponde diretamente a golpes para matar**: após esgotar Integridade, a Vida segue regras próprias; dano real e crítico precisam ser medidos.

**Não alterado:** escudos G1 6/9/12 continuam PROPOSTOS, Escudo Arcano mantém sua resolução simbólica, não há regra nova de iniciativa, Perícia Conjuração Refinada não fornece dados ou alcance numérico ainda.

## 4. Próxima coleta de playtest

Em cada cena com Conhecimentos/Práticas, anotar **Grau do Atributo + Grau da Formação, composição exata de dados, limite mantido, DE, símbolos mantidos, gastos de Antecipar, presença de Pavor e efeito de falha**. Para combate, anotar **Integridade antes/depois, gasto de Coragem/PP/Pavor, dano à Vida, grau da armadura, oportunidades reais e quantidade de inimigos e XP utilizados**.

**Prioridades:** 1) testar armaduras antigas contra novas isoladamente, mantendo o mesmo encontro completo; 2) medir a vantagem real da conjuração elemental gratuita, inclusive Trevas; 3) definir um critério narrativo para testes automáticos fora de combate; 4) concluir a reescrita de alcance de Conjuração Refinada e o preço-base das pedras. Os ramos de profissões, economia e equipamentos continuam em desenvolvimento sem preços ou efeitos inventados.
