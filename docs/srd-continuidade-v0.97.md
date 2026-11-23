# Codex RPG — SRD de Continuidade v0.97

**Data:** 23/11/2026  
**Estado:** **DEFINIDO** — revisão explícita de Perícia em Armas Leves, automatização e definição numérica de Golpe Certo.  
**Precedência:** atualização pontual sobre o SRD v0.96. Substitui a marcação **PENDENTE** de Golpe Certo presente em v0.87 e documentos anteriores, sem reescrever versões históricas. Mantém todos os demais requisitos, dados simbólicos, custos de fonte, progressão, combate e regras raciais das versões vigentes.

## 1. Perícia em Armas Leves [DEFINIDO]

- **Aquisição:** **2 XP**; requisito **Disciplina 1** (Prática única de combate e conjuração).
- **Habilitação:** os efeitos abaixo exigem a Perícia adquirida e um ataque efetivo com **arma Leve** compatível. Não concedem propriedades inexistentes à arma.
- **Acerto comum:** permite escolher e ativar **UMA característica própria da arma Leve por 1 Coragem**. Em um acerto que não ativa característica, não existe cobrança dessa ativação. Sem acerto, a ativação condicionada não produz efeito nem consome essa Coragem.
- **Crítico em um acerto:** ativa **UMA característica própria da arma Leve sem custo de Coragem**. O custo de uma eventual segunda característica distinta, quando permitido pela regra vigente, continua em **1 Coragem**; não inventar uma segunda gratuidade ou repetir a mesma característica. Maestrias específicas conservam seus próprios limites e benefícios quando seus requisitos são cumpridos.
- **Afinidade de peso:** ao atacar com arma Leve contra alvo com **armadura Pesada ou Muito Pesada equipada**, o usuário ignora **somente a Desvantagem natural de peso (−1 Antecipar, −1A)**. O resultado torna-se neutro quanto a esse modificador; **não** recebe +1A ou +1E por esse cancelamento. Outras Desvantagens independentes permanecem.
- O teste básico Disciplina + Atributo continua possível sem Perícia, mas **ativar uma característica especializada da arma Leve** depende dessa habilitação. Não confundir peso físico, peso da arma e dificuldade da situação. As demais classes de peso mantêm as próprias regras.

**Automação:** o rolador da ficha e o simulador com alvo usam a arma realmente equipada, sua categoria, propriedades, a Perícia adquirida, a rolagem, o resultado crítico, o acerto e o saldo de Coragem. Um monstro ou humanoide hostil continua sujeito à economia de Pavor definida no SRD; isso não concede Coragem a inimigos. A ficha ou o rolador isolado sem alvo equipado conhecido não deve inventar afinidade de peso.

## 2. Golpe Certo [DEFINIDO]

**Golpe Certo é uma MECÂNICA**, não uma Perícia comprável e não custa XP de aquisição próprio. Na escala de condições, situa-se **acima de Vantagem Absoluta**: Golpe Certo (+2E total) / Vantagem Absoluta (+1E) / Vantagem (+1A). **Não é uma condição livremente selecionável** sem gatilho de Perícia ou efeito que a habilite.

**Efeito: +2 Êxitos (2E ᛋ) NO TOTAL.** É o grau de vantagem quando uma ação já em **Vantagem Absoluta (+1E)** recebe a melhoria de **Manejo Perfeito** habilitado, em uma situação de peso/arma favorável. O efeito é **+2E no total da condição somada ao Manejo, não +2E adicionais à Vantagem Absoluta**: a implementação acrescenta somente **mais +1E** ao +1E preexistente e **não** soma o +1A natural de afinidade de peso substituído.

### Resolução de Manejo Perfeito

Mantêm-se os requisitos de compra e ativação aprovados: **Manejo Perfeito**, **Disciplina Avançada válida (Disciplina 3)**, **Destreza 2**, arma corpo a corpo física equipada e correta para o confronto, ação marcial e afinidade de peso **favorável ao atacante** (o alvo tem a Desvantagem natural perante essa arma).

| Situação da ação antes de Manejo | Sem Manejo | Com Manejo Perfeito válido |
|---|---|---|
| Condição Normal, afinidade favorável | +1A por peso | **+1E por Vantagem Absoluta**, sem +1A por peso |
| Já estava em Vantagem Absoluta, afinidade favorável | +1E da condição e +1A de peso | **Golpe Certo: +2E totais**, sem +1A de peso |
| Condição sem afinidade favorável ou Perícia/requisitos ausentes | Regra normal da situação e do peso | Nenhum bônus de Manejo/Golpe Certo |

O total de Êxitos resultante participa normalmente da DE e do cálculo de dano de acordo com as regras vigentes; não concede crítico automático, não duplica efeitos, não gera Antecipar e não apaga Pavor. Se uma ficha antiga possui Manejo Perfeito ou Disciplina Avançada, mas não cumpre os graus atuais, a habilidade fica registrada sem habilitar esse bônus até cumprir seus requisitos; sem cobrança ou reembolso retroativo.

## 3. Área Mecânicas no site [DEFINIDO — documentação]

Criar categoria navegável **Mecânicas** separada de **Perícias**, com:
- **Vantagens e Desvantagens** — escala das condições, afinidade de ataque/armadura e exceções específicas.
- **Golpe Certo** — +2E e interação com Manejo Perfeito, sem ser uma Perícia independente.
- **Antecipação** — preservar e incorporar a página que já existia.

Relacionar os verbetes Perícia em Armas Leves e Manejo Perfeito, o catálogo de Perícias, o Livro do Jogador e a navegação principal à nova categoria.

## 4. Compatibilidade, implementação e pendências

- **Não alterar:** os 2 XP e Disciplina 1 de Armas Leves, os requisitos e 1 XP de Manejo Perfeito, limites de dados, recursos, tabelas de peso aprovadas, efeitos de armas Médias/Pesadas, Maestrias e versões históricas.
- **DEFINIDO:** o simulador deve distinguir bônus situacionais de afinidade e explicitar que Golpe Certo adiciona no máximo +1E em cima do +1E anterior.
- **PENDENTE:** peso de oponentes sem armadura e de monstros quando não houver enquadramento aprovado do Narrador. O editor de conflitos sem alvo selecionado não tem informação para calcular automaticamente afinidade do defensor.
- Testes de regressão: Armas Leves G1/2 XP, critério de arma equipada, característica cadastrada, acerto/fracasso, ativação de crítico/Coragem, alvo Pesado, outras Desvantagens intactas, Manejo com e sem Vantagem Absoluta, Golpe Certo +2E sem +3E, migração de compra e fichas legadas.

**Este documento acrescenta somente as decisões acima. O SRD v0.96 e todas as demais definições posteriores vigentes continuam aplicáveis.**
