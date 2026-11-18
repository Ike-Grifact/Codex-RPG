---
title: "Codex RPG — SRD Playtest Nível 1 v1.0"
version: "1.0"
cycle: "playtest-nivel-1"
updated: "2026-11-18"
status: "DEFINIDO / PENDENTE DE PROCEDIMENTO"
supersedes_as_active: "docs/srd-continuidade-v0.82.md"
repository: "Ike-Grifact/Codex-RPG"
---

# Codex RPG — SRD Playtest Nível 1 · v1.0

> **Referência principal para o ciclo de Playtest Nível 1.** A contagem foi reiniciada por decisão autoral de **18/11/2026**. As versões `srd-continuidade-v0.XX.md` permanecem disponíveis como **histórico**, não como numeração ativa. Este documento registra as decisões mais recentes sem apagar regras anteriores que não foram revogadas. Em divergência: decisão autoral mais recente > este SRD > Livro do Jogador atualizado > código > arquivos históricos. **Código implementado não significa regra aprovada.**

## 1. Estados e limites da revisão

- **DEFINIDO:** aprovado pelo autor. **EXPERIMENTAL:** em playtest. **PROPOSTO:** hipótese não homologada. **PENDENTE:** falta definição operacional.
- **DEFINIDO e fixado pelo autor:** **15 XP iniciais compartilhados no nível 1**. Não continuar variando entre 15, 18 e 19 XP neste ciclo. **Uma compra de Atributo G1** e **uma de Conhecimento ou Prática G1** são obrigatórias; o restante é livre entre aptidões e Perícias, conforme custos e requisitos. Para um humano sem redução racial: custo mínimo 1 + 2 = **3 XP**, restando **12 XP**. Não há reserva obrigatória de XP para Perícias nem divisão por categorias.
- **DEFINIDO:** não recalcular custos de Atributos, Conhecimentos, Práticas, Perícias, dados, raça, armas ou equipamentos nesta revisão. O orçamento do nível 1 passa a ser **fechado**, não uma hipótese de revisão recorrente.
- **DEFINIDO:** todas as personagens começam como Aprendizes, sem classes impostas. A profissão emerge da combinação da ficha. As seis Práticas são Disciplina, Atletismo, Furtividade, Artesão, Apresentação e Coleta; Disciplina é uma só Prática, com habilitações marciais e mágicas.
- **DEFINIDO:** continuam Êxito (E, ᛋ), Antecipar (A, ᚨ) e Pavor (P, ᚦ). Roll & Keep segue as faces e limites vigentes no Livro do Jogador e nos registros posteriores à v0.44: até **9 dados rolados e 4 mantidos** quando habilitados. Não restabelecer regras revogadas de dados descartados, PP, conjuração memorizada ou profissões automáticas.
- **DEFINIDO:** os elementos **Ar, Água, Terra, Fogo, Sagrado, Sangue, Trevas e Veneno** não dependem de comprar Criar Item de Foco e Magia (decisão histórica v0.81). **Improviso Elemental** também não depende desse Foco: custa **1 XP**, exige Disciplina 1 + Inteligência 1 + Destreza 1 e mantém seus efeitos. Isso **não** elimina o requisito próprio de Foco de outras Perícias.
- **PENDENTE DE RECONCILIAÇÃO:** trechos do Livro e guias antigos que ainda descrevem requisitos ou valores históricos. Quando não houver decisão explícita aqui, **não inventar** novos custos, DE, durações nem opções automáticas.

## 2. Coragem simples — sem desenvolver Maestrias neste ciclo

**DEFINIDO — simplificação autoral de 18/11/2026:**

- **Coragem inicial: 3 pontos**, conforme a referência a “3 Coragens” na decisão deste ciclo. **Teto base: 3** para o Aprendiz; a evolução neutra acrescenta **+1 ao teto no nível 5, +1 no nível 10 e +1 no nível 20**, sem compra de Maestria (tetos base **3 / 4 / 5 / 6** por intervalo de nível). A confirmação textual do significado exato de “3 Coragens” permanece **PENDENTE DE REVISÃO** antes de substituir todas as reservas históricas de 10 nos sistemas, para não apagar saldos de personagens antigos por uma interpretação equivocada. **Até então o código legado mantém 10.**
- **DEFINIDO:** Coragem é **reserva única**. Não reintroduzir PP ou a conversão antiga de PP.
- **DEFINIDO:** recuperar Coragem por **crítico**, preservando a tabela de crítico aprovada: com **2 dados máximos mantidos +1**, com **3 ou 4 dados máximos mantidos +2**, sem ultrapassar o teto disponível. Crítico não devolve PP.
- **DEFINIDO:** em combate, quando um **inimigo mantém Pavor**, ele gera Coragem para o personagem que é alvo do ataque, pela equivalência anterior **1 Pavor mantido e não anulado → 1 Coragem**, até o teto. Não conceder Coragem por Pavor descartado ou cancelado.
- **DEFINIDO:** **descanso curto** recupera Coragem **somente se possuir a Perícia Recobrar Coragem**. Conserva-se o benefício já publicado dessa Perícia (**2 Coragens** após descanso e cena narrativa) enquanto o autor não alterar a quantidade. Sem a Perícia, descanso curto não restaura Coragem por esta regra.
- **DEFINIDO:** **descanso longo** recupera **Vigor + 1 Coragem**, sempre limitado ao teto do personagem, com ou sem Perícia. A Perícia de descanso curto não adiciona automaticamente outra recuperação no mesmo descanso longo; eventual acúmulo fica **PENDENTE**.
- **CONGELADO:** não comprar, desenvolver nem conceder agora efeitos de Maestrias especializadas, gatilhos de Precisão/Combo/Mestre de Armas nem bônus de +2/+3 de Maestria. Tais projetos seguem arquivados/adiados, **não autorizados para o Playtest Nível 1**. A Perícia histórica *Maestria Elemental* de conjuração permanece distinta e não é convertida automaticamente em uma identidade de recuperação.

**Compatibilidade:** qualquer mudança de teto inicial em fichas já salvas exigirá migração explícita sem perda silenciosa de Coragem. Enquanto a ambiguidade da expressão “3 Coragens” não for definitivamente verificada, as regras de recuperação e os três marcos de progressão estão aprovados, mas **a aplicação automática do novo teto está suspensa**.

## 3. Transformação Druídica — novo ramo animal

**DEFINIDO — substitui a cadeia de aquisição e as fichas animais da Druídica v0.82.**

- **Nome:** Perícia Druídica. **Custo:** **1 XP**, compra única.
- **Requisitos:** possuir **Criar Item de Foco e Magia** **E** **Perícia em Elemento Terra**. **Não exige** Influência, Domar Criatura Pequena/Média/Grande, uma espécie domada nem ficha de animal separada.
- **DEFINIDO:** o druida transforma o próprio corpo, usando **os Atributos da ficha original**, com aprimoramento temporário por porte. **Não distribui XP em outra ficha animal**. A transformação não altera permanentemente o Grau comprado nem concede novas fontes de Conhecimentos/Práticas.
- **DEFINIDO:** em forma animal, a composição de rolagem substitui a regra normal de combinação por **Atributos distintos**. **Não se combinam Conhecimentos nem Práticas** na rolagem da forma. Pequena e Média permitem até **dois Atributos diferentes**; Grande permite **três Atributos diferentes**. Não repetir o mesmo Atributo.
- **DEFINIDO:** **formas animais não recebem armadura física**; se uma proteção aplicável não interceptar o ataque, o dano atinge a Vida. Proteções mágicas já habilitadas, como Escudo Arcano, seguem seus próprios procedimentos, sem novo benefício gratuito.

| Forma | Ativação | Aprimoramento temporário | Vantagem / rolagem | Cancelamento |
|---|---|---|---|---|
| **G1 — Pequena** | **0 Coragem** | Eleva **1 Atributo**, **exceto Vigor** | Vantagem em testes pertinentes à **Furtividade**; até 2 Atributos distintos | **Ao receber dano**, encerra a forma |
| **G2 — Média** | **1 Coragem** | Eleva **2 Atributos**, **podendo incluir Vigor** | Vantagem em testes pertinentes ao **Atletismo**; até 2 Atributos distintos | **Quando o resultado tem mais Pavor do que Êxito**, seja acerto ou falha, encerra a forma |
| **G3 — Grande** | **1 Coragem** | Eleva **3 Atributos** | Até **3 Atributos distintos** na mesma rolagem | **Qualquer Pavor mantido e não anulado** encerra a forma |

**Aprimoramento ilustrado e expressamente aprovado:** quando o Atributo selecionado tiver **2d6 + 1d10**, na forma passa a **2d10 + 1d12**. Isso é avanço **temporário dos dados desse Atributo**, não compra gratuita de Grau e não autoriza extrapolar passos além de d12. Aplicação para outras composições, fontes extraordinárias e d20: **PENDENTE**.

**Vida e Saúde — decisão autoral:**
- Ganhos de Vida decorrentes da forma **não criam uma ficha de Saúde animal separada**.
- Se a forma elevar a Vida e o personagem já estiver ferido, a Vida adicional **preenche primeiro as caixas inferiores** até chegar novamente à faixa **Saudável**.
- Quando o ganho elevar o valor além da Vida real máxima aplicável, o **excedente é Vida temporária**, inclusive nas formas em que houver esse ganho; não se transforma em cura real permanente.
- **PENDENTE:** exatidão de quantos pontos resultam do aumento de Vigor, registro de ferimentos e perda de Vida temporária na reversão, ordem de preenchimento das caixas em cada caso, sucessões de forma e tratamento de dano simultâneo à interrupção. **Não reutilizar automaticamente** a antiga comparação de Vida máxima de fichas animais.

**PENDENTE:** qual conquista/nível habilita **G2 e G3** agora que Domar deixou de ser necessário; se pequeno recebe *Vantagem* ou *Vantagem Absoluta* (a decisão nova diz apenas “vantagem”); qual o momento exato do encerramento em rolagens com Pavor. A compra de G1 **não libera automaticamente G2/G3** sem esse procedimento.

## 4. Transformação Elemental — novo ramo independente

**DEFINIDO — nova Perícia (1 XP).**

- **Requisitos:** possuir **Criar Item de Foco e Magia** e **pelo menos uma Perícia em Elemento** válida.
- **Ativação:** **1 Coragem** para transformar-se no elemento escolhido dentre os que possui habilitados. O elemento da transformação é declarado.
- **Proteção:** a forma é **imune ao próprio elemento** e, normalmente, **intangível**. Não usa a armadura física equipada; contra danos não impedidos por imunidade ou Escudo Arcano, o dano chega **diretamente à Vida**, sem Integridade de armadura física. **Pode usar Escudo Arcano** se seus requisitos e procedimentos forem atendidos.
- **Exceção Terra:** o corpo permanece **tangível**, mas é **imune aos efeitos aplicáveis das armas** e ao próprio **elemento Terra**. Essa defesa funciona como uma grande proteção inerente à forma, **não como uma armadura equipada com Integridade inventada**.
- **Resistência:** a manifestação se aplica o elemento escolhido e menciona **resistência** a ele, além da **imunidade** já declarada. **PENDENTE:** quando a resistência se aplica de maneira distinta da imunidade; não somar uma redução de dano inexistente nem conceder imunidade a outros elementos.
- **Duração conforme o teste de transformação:** **cada Êxito válido aumenta a duração em 1 unidade; cada Pavor válido reduz a duração em 1 unidade**. **PENDENTE:** duração-base, unidade de tempo, DE do teste, fontes da rolagem, valor mínimo e se o Pavor considerado é exclusivamente mantido/não anulado. Sem esses dados, **não automatizar cronômetro, término ou sucesso de ativação**.
- **Fonte elemental:** pode usar o elemento de um **item de foco apropriado** para amplificar a transformação ou **o elemento do ambiente** quando disponível. **Com ambiente favorável, a conjuração exige 3 turnos** segundo a decisão deste ciclo. **PENDENTE:** o que significa “amplificar” em números, tempo-base quando usa foco, relação entre a preparação ambiental de 3 turnos e a abundância ambiental de outras magias e regras de sustentação.
- **PENDENTE:** interação detalhada da intangibilidade com ataques físicos, deslocamento, objetos segurados, efeitos mentais e magias não elementais. Não declarar invulnerabilidade geral.

**Diferença entre ramos:** Druídica é **forma animal com melhoria temporária de Atributos e rolagem só de Atributos**; Transformação Elemental é **forma de um elemento com imunidade própria, regra especial de Terra, duração por símbolos e proteção contra dano**. Não adicionar requisito de Domar à segunda Perícia. **Ambas exigem Criar Item de Foco e Magia**, mesmo que comprar os elementos isoladamente e comprar Improviso Elemental **não** exija Foco.

## 5. Publicação, código e testes

- **Regras fixadas nesta v1.0:** orçamento de 15 XP; criação livre após mínimos; suspensão das Maestrias especializadas; gatilhos de recuperação e progressão neutra; nova aquisição da Druídica; dois ramos de transformação, seus custos e efeitos descritos.
- **Implementação permitida imediatamente:** atualizar custo/requisito/compra assistida e catálogo das duas Perícias; marcar G2/G3 e transformações como **efeitos manuais até definição dos gatilhos**; corrigir documentos que ainda indiquem 18/19 XP ou exijam Domar/Influência para Druídica; preservar JSON existente e compras anteriores.
- **Implementação não autorizada por inferência:** ficha animal paralela, cura gratuita permanente, resistência cumulativa à imunidade, duração elemental arbitrária, tornar G2/G3 compráveis sem gatilho, substituir Perícia Maestria Elemental por identidade passiva, alterar custo geral de dados ou níveis.
- **Prioridades de validação:** compras de 15 XP e requisitos mínimos, compra Druídica sem Domar, bloqueio sem Foco/Terra, compra Transformação Elemental com Foco + um elemento, recompra negada, compatibilidade com fichas antigas, UI clássica e Codex Genético compartilhando as compras.
- **Histórico:** versão anterior mais recente [SRD de Continuidade v0.82](srd-continuidade-v0.82.md). Decisões anteriores não explicitamente revogadas permanecem como referência subsidiária, nunca como autorização para recuperar regras contrárias a este novo ciclo.
