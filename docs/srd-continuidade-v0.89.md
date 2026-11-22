---
title: "Codex RPG — SRD de Continuidade v0.89: conjuração declarada, dado por Grau, DE e XP"
date: "2026-11-22"
status: "DEFINIDO; equilíbrio das novas rolagens EXPERIMENTAL; interrupção PENDENTE"
supersedes: "Correção da fórmula de DE registrada incorretamente na v0.88; hipótese de +1E fixo por tempo de conjuração; bônus de dado fornecido pelo foco; orçamentos iniciais históricos de 18/19/20 XP"
previous: "srd-continuidade-v0.88.md"
---

# SRD de Continuidade v0.89 — Decisões de 22/11/2026

> **Fonte prioritária para o playtest:** decisões explícitas do autor nesta continuidade. A v0.88 continua preservada como histórico, mas **sua fórmula `1 + Vigor + ⌊Destreza/2⌋` está corrigida nesta versão**. O SRD Playtest Nível 1 v1.0 e o Livro do Jogador devem ser lidos à luz desta errata.

## 1. XP inicial e criação — DEFINIDO

- **15 XP iniciais compartilhados**, sem separação obrigatória entre categorias. São os únicos XP iniciais válidos para um Aprendiz humanoide comum neste ciclo.
- Obrigatório comprar pelo menos **um Atributo G1** (custo normal 1 XP) e pelo menos **um Conhecimento ou Prática G1** (custo normal 2 XP). Os **12 XP restantes** são livres para compras legais, respeitados os custos, requisitos e eventuais modificadores de origem.
- A progressão de referência preserva **260 XP acumulados no nível 20**, dos quais 15 iniciais e até 245 posteriores. Níveis não entregam XP automaticamente.
- **18, 19 e 20 XP iniciais, assim como as reservas compulsórias 6/8/5 ou 7/7/5, são históricos e não são opções vigentes.** Valores existentes em SRDs de versões anteriores não devem orientar fichas, NPCs ou simulações novas.
- Não alterar a tabela vigente de custos de Graus ou de Perícias.

## 2. DE defensiva humana — DEFINIDO (correção da v0.88)

```text
DE base = min(9, Agilidade + piso((Vigor + Destreza)/2) + piso(Atletismo/3))
DE final = min(12, max(0, DE base + modificador da armadura + bônus defensivos válidos))
```

**Somar Vigor e Destreza ANTES de dividir por 2 e arredondar para baixo**. Agilidade conta integralmente. Atletismo concede +1 DE para cada três Graus completos. **Não existe +1 de base**, nem Vigor inteiro somado em separado. Exemplos sem armadura:

| Agilidade | Vigor | Destreza | Atletismo | DE base |
|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 0 | 2 |
| 1 | 3 | 1 | 0 | 3 |
| 1 | 2 | 2 | 3 | 4 |

As defesas extraordinárias de monstros não humanoides seguem sua regra própria; não importar a fórmula humana para elas sem decisão autoral específica.

### Armadura Muito Leve e Roupas Simples — DEFINIDO

O modificador da **única armadura válida equipada** vale **em TODAS as defesas**, inclusive esquiva, e incide uma vez após o cálculo da DE base:

| Tipo de armadura | Modificador da DE defensiva |
|---|---:|
| **Muito Leve (incluindo Roupas Simples)** | **+2** |
| Leve | +1 |
| Média | 0 |
| Pesada | −1 |
| Muito Pesada (se requisitos atendidos) | −2 |

**Esquivar não soma esse bônus novamente.** Integridade material é separada da DE; valores do catálogo não são convertidos em bônus de DE. Maestria em Escudos, quando habilitada com escudo físico equipado, acrescenta +1 DE após a armadura, uma única vez. Teto 12 da DE final.

## 3. Conjuração por Grau — DEFINIDO; probabilidades EXPERIMENTAIS

**O dado mágico adicional pertence ao GRAU DA MAGIA, e NÃO ao foco.** Para cada conjuração habilitada, acrescentar exatamente **um** dado mágico à pilha, conforme o Grau declarado:

| Magia | Dado extra do Grau | Preparação básica |
|---|---|---|
| G1 | **+1d6** | 1 turno, imediata |
| G2 | **+1d10** | 2 turnos sem aceleração |
| G3 | **+1d12** | 3 turnos sem aceleração |
| G4 | **PENDENTE** (não extrapolar d20 ou outro dado) | G4 plena: 6 turnos, mínimo 3, conforme regras existentes |

O dado do Grau **substitui** o de Graus anteriores: G2 recebe **+1d10, não +1d6+1d10**. Não se aplica +1E fixo pela preparação, não se concede dado duplicado pelo foco e não se acrescenta dado a uma ação que não seja conjuração de Grau habilitado. Respeitar até **9 dados rolados** e a retenção por Marco (**nível 1: 2; até 3 gastando 1 Coragem**). Não transformar a elevação temporária de uma fonte por Coragem em elevação automática do Grau da magia, de seus efeitos ou do dado adicional.

### Foco — DEFINIDO

- **O foco NÃO adiciona dado**: nem d6, nem d10, nem outro. Ele permite usar seu elemento quando válido e **acelerar** a preparação, respeitando cargas e requisitos. Não alterar dados de Atributos/Conhecimentos/Práticas.
- **G2 com foco compatível** pode ser conjurada em **1 turno**, conservando o dado de Grau **+1d10** e os efeitos G2; sem foco, exige **2 turnos**. Consumo exato de carga G2: **PENDENTE de formalização** (não inventar preço automático além de procedimento expressamente aprovado; interface experimental pode usar 1 carga mediante confirmação do Narrador).
- **G3 com foco:** regras de aceleração já definidas permanecem: 3 turnos sem carga, 2 turnos com 1 carga, 1 turno com 2 cargas do foco correspondente. G4 plena mantém sua regra própria, inclusive o mínimo de 3 turnos.
- Um foco precisa corresponder ao elemento; **basta estar no inventário**. Graus, efeitos, fontes elementais, preparação e cargas permanecem sujeitos às habilitações existentes. O foco não cria uma Perícia, Grau nem dado adicional.

## 4. Rolagem no início da preparação — DEFINIDO

1. **Na declaração da magia, rolar imediatamente a pilha completa**, incluindo o dado do Grau da magia. Escolher os dados mantidos e aplicar os usos de Antecipar antes de fixar o resultado da conjuração.
2. A rolagem e seus símbolos ficam **públicos no início** da preparação, mesmo quando o efeito só será concluído após mais de um turno.
3. **Pavor mantido e não anulado** conserva o risco e pode entregar oportunidade ao adversário / Narrador durante a preparação. O inimigo pode perceber a conjuração e tentar **atacar, fugir, buscar cobertura ou atrapalhar**, respeitando suas ações, alcance e a situação, sem acerto nem fuga automáticos. Os símbolos descartados não transferem Pavor.
4. **1A** pode passar a oportunidade a um aliado para distrair, conter ou proteger; **esse mesmo A não anula Pavor**. A passagem não garante interrupção da resposta inimiga nem nova ação gratuita.
5. **Resolver o efeito da magia somente quando os turnos exigidos se completarem** e o Narrador confirmar que a conjuração continua válida. Uma magia G2 acelerada a 1 turno não abre a janela adicional de espera, mas seus símbolos de Pavor continuam relevantes.
6. **PENDENTE:** critérios gerais de interrupção da magia quando o conjurador é atacado, ferido, deslocado ou perde o alvo durante a preparação; momento exato de consumo dos custos ao falhar ou ser interrompido. Não presumir que todo ataque interrompe ou que qualquer Pavor cancela a magia. Manter regras específicas de canalização já aprovadas (como Hemomancia) quando aplicáveis.

## 5. Coragem, Pavor, equipamentos e testes

- Permanece o teto **5 Coragens gastas por rolagem** já publicado; o teto por rodada discutido em simulações é uma hipótese separada e não substitui o teto normativo sem decisão explícita.
- **Elevar uma fonte** custa 1 Coragem e aplica o próximo Grau temporário à composição de dados daquela fonte; **manter um dado adicional** custa outra Coragem. Um dado mágico de Grau não recebe essa elevação de fonte.
- O acerto continua exigindo **E + P válido ≥ DE**; acerto com Pavor não é acerto limpo. **1A** anula 1P, **2A** convertem 1E e **1A** pode passar a oportunidade; cada símbolo só é utilizado uma vez.
- Armas, armaduras, propriedades, focos, Perícias, dano, Integridade, progresso e ações não explicitamente alteradas aqui conservam seus requisitos e regras vigentes.

## 6. Implementação e pendências

**Implementar no criador/ficha, simulação e superfícies compatíveis:** 15 XP iniciais e nenhuma reserva 6/8/5; DE com Agilidade + metade da soma Vigor/Destreza + Atletismo/3; Roupas Simples/Muito Leve +2 em qualquer defesa; conjuração rola ao declarar, recebe um dado por Grau, e não recebe dado do foco; foco acelera conforme Grau e cargas, sem efeitos numéricos inventados.

**PENDENTE:** Grau 4 e seu dado, custos específicos de G2 com foco e procedimento universal para interrupções. **EXPERIMENTAL:** balanceamento de acertos limpos, acertos com Pavor, oportunidades de resposta, mobilidade de atiradores e eficiência dos conjuradores com 15 XP.
