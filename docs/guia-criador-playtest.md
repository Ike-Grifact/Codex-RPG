# Laboratório de Aprendizes — guia de playtest

O [Criador de Ficha nível 1](../criador.html) ajuda a testar construções iniciais e a futura árvore de Perícias do Codex RPG. As regras de referência são mantidas em notas internas de continuidade; o portal não publica atalhos para esses documentos.

> **Atualização normativa em 18/11/2026:** a referência ativa agora é [SRD Playtest Nível 1 v1.0](srd-playtest-nivel-1-v1.0.md). **15 XP iniciais fixos (DEFINIDO)**, com 12 XP livres após o mínimo de 3 XP para um Humano sem descontos raciais. A Druídica requer Foco + Terra, sem Domar, e Transformação Elemental é nova Perícia (Foco + elemento); a compra é validada, mas os efeitos de transformação permanecem manuais quando procedimentos estão pendentes. Este guia conserva explicações antigas apenas para o fluxo da interface; a seção normativa do novo SRD prevalece.

## Criação nível 1: investimentos mínimos e XP livre

**DEFINIDO:** para concluir a criação, tenha **pelo menos um Atributo grau 1** (inclusive o Grau 1 racial automático, quando aplicável) e compre **pelo menos um Conhecimento ou Prática grau 1**. Depois, **todo XP restante fica livre** para Atributos, Conhecimentos, Práticas e Perícias. Não existem cotas obrigatórias por categoria nem 5 XP exclusivos para Perícias.

**DEFINIDO (orçamento fechado):** a ferramenta usa **15 XP iniciais compartilhados**, sem revisão do montante neste ciclo. Custos mínimos: Atributo grau 1 = 1 XP; Conhecimento/Prática grau 1 = 2 XP; no cenário de 15 XP restam 12 XP sem reserva por categoria. O sistema impede concluir a criação sem as duas compras mínimas.

As antigas repartições 6/8/5 e 7/7/5 permanecem somente como histórico do SRD v0.38. Consulte [SRD de Continuidade v0.44](srd-continuidade-v0.44.md), seção 0-AD (Conjuração Refinada, Integridade G1 7/12/17, pedras raras 3× comuns e cálculo probabilístico da DE), 0-AC (ativação e foco), 0-AB (Trevas), 0-AA (Pavor do alvo), 0-Z (dados e Coragem) e 0-Y (criação).

Cada Atributo em grau 0 fornece 1d4 gratuito; cada Conhecimento ou Prática pertinente em grau 0 fornece **1d6 gratuito individual**.

**Conhecimentos:** Proteção, Astronomia, Medicina, Alquimia, Engenharia, Erudição.

**Práticas (6):** **Disciplina**, Atletismo, Furtividade, Artesão, Apresentação e Coleta. Disciplina é a Prática compartilhada para aplicações marciais e mágicas, sob as habilitações pertinentes; não se compram Armas e Conjuração como duas fontes independentes. Punhos permanece uma especialização marcial. O grau 1 de Disciplina custa 2 XP, pagos uma vez, e oferece 1d10. A criação não impõe profissão obrigatória.

## Fluxo guiado da criação

1. **Identidade:** informar nome, conceito, **Origem / Raça** (seletor no alto, no lugar de “Origem narrativa”), virtude e personalidade. A origem é a raça; os benefícios raciais aparecem logo após os demais campos, sem outro seletor duplicado.
2. **Escolhas iniciais:** ao escolher a raça, os **dois Atributos favorecidos são colocados automaticamente no Grau 1 (0 XP)**: **Lucker de Sangue — Vigor e Agilidade; Lucker Puro — Inteligência e Destreza; Runa Espinhos — Vigor e Força**; Humano não recebe graus automáticos. Em seguida, escolher **um Atributo principal** entre os seis, apresentados individualmente com função, exemplos e dados. O botão **“Começar com” compra imediatamente o Grau 1** caso ainda não tenha sido adquirido, com custo dependente da raça. Voltar e escolher outro Atributo inicial **substitui a compra feita somente pelo botão anterior**, não acumula graus. **Trocar a raça reinicia a seleção do Atributo inicial e da formação**, removendo os G1 automáticos da origem anterior que não forem mais favorecidos. Compras manuais no mapa são preservadas. Graus gratuitos aparecem como **“GRAU 1 · ORIGEM”** no Codex Genético. Para fichas criadas antes da correção, a opção **“Revisar graus extras”** identifica G1 fora do par da raça, mas **somente os remove após confirmação**; ela também pode retirar um G1 comprado manualmente. Exporte JSON antes. Depois selecionar **um Conhecimento ou uma Prática**, entre os seis de cada categoria, também apresentados individualmente. Conhecimento e Prática são alternativas para o segundo investimento obrigatório, **não duas compras exigidas**. O grau 1 custa 2 XP. Uma confirmação efetua as duas compras, sem gasto ao apenas navegar ou comparar as opções. “Principal” não concede bônus.
3. **Distribuir XP:** **Codex Genético é o modo principal** ao entrar na distribuição livre; todos os graus reais, inclusive os automáticos de raça e a primeira compra, aparecem nos nós do mapa. **Contorno e seta ↓ XP reduzido** identificam Atributos ou Práticas favorecidos da raça; **contorno tracejado e seta ↑ XP aumentado** identificam custos elevados. A legenda aparece no mapa; o preço real do próximo Grau continua exibido separadamente. São indicadores, não compras adicionais. As **listas são uma alternativa** e usam a mesma ficha, o mesmo saldo e as mesmas compras.
4. **VT e itens iniciais:** o playtest utiliza **20 VT experimentais**, valor separado dos 15 XP, distribuídos entre cinco recursos comuns. O catálogo G1 oferece compras opcionais com preços ainda **PROPOSTOS**, sem itens gratuitos presumidos. Equipamentos adquiridos entram no inventário da ficha.
5. **Revisão:** finalizar somente após ter Atributo grau 1 e Conhecimento ou Prática grau 1, conferindo também recursos e itens.

**DEFINIDO:** liberdade de compra após o mínimo de 1+2 XP. **DEFINIDO:** total compartilhado de 15 XP; saldo livre de 12 XP se ambas as escolhas estavam no grau 0. Outros investimentos não são reembolsados automaticamente ao voltar ao guia.

No Codex Genético, as fontes ficam ao redor de uma dupla hélice; os dados usam a geometria, cores e rótulos dN do rolador **entre os botões − e +**, expandindo até três dados por fonte. As ramificações de Perícias formam um grafo de afinidades conectado no estilo visual Obsidian. Perícias **roxas** têm uma compra automática possível: o XP cobre o custo dos graus e Perícias necessários e da própria Perícia. A ferramenta mostra o pacote e exige confirmação explícita antes de gastar. Perícias **azuis** já atendem seus requisitos. Os detalhes abrem sobre o mapa; as conexões representam afinidades temáticas, não requisitos.

## O que funciona

- Distribuir XP em seis Atributos, Conhecimentos, Práticas e Perícias iniciais com seus preços.
- Ver Vida, **Dificuldade de Êxito (DE)** natural, balanço corporal, carga parcial, Coragem e resumo da ficha. **DE = Agilidade + (Destreza ÷ 2, arredondada para baixo)**; exemplo: Agilidade 4, Destreza 3 → **DE 5**.
- Comprar Perícias documentadas, com uma verificação conservadora dos requisitos conhecidos.
- Criar **rascunhos de Perícias personalizadas**, de 1 a 5 XP, com nome, requisitos e efeito. Elas entram como opções na ficha, não no catálogo oficial.
- Selecionar Atributo e fontes de dados, rolar d4/d6/d10/d12, manter manualmente dois dados (ou três mediante Coragem) e converter Antecipar.
- Testar o bônus **condicional de +1E ou +2E** concedido por Perícias distintas mediante um seletor manual; não ultrapassar +2E por ação.
- Aplicar afinidades entre peso do ataque (leve, médio, pesado) e balanço defensivo do alvo (leve, médio, pesado): Vantagem +1A / Desvantagem −1A.
- Calcular DE atingida, classificação do resultado, dano básico por Êxitos e por pares completos de Pavor mantido não anulado, e gastos de Coragem.
- Salvar localmente no navegador **múltiplas fichas independentes de jogadores**, importar/exportar JSON e imprimir.
- Usar **Minhas fichas de jogadores** para alternar entre Humanos, Lucker de Sangue, Lucker Puro e Runa Espinhos. **Nova ficha** cria outro personagem sem apagar a anterior; **Duplicar** copia a build para testes separados; **Excluir ficha** pede confirmação e não remove as demais. O assistente retoma a etapa correspondente a cada ficha.
- Ao **Importar JSON**, adicionar a ficha à lista em vez de substituir a selecionada. A migração da ficha salva pelo criador antigo também preserva sua cópia original. Cada navegador/dispositivo tem seu próprio armazenamento: **exporte JSON para backup ou para trocar de aparelho**. Muitos retratos podem esgotar o espaço local.
- O modo NPC `?npc=1` continua separado das fichas de jogadores e não as altera.

## Como desenhar uma Perícia experimental

Quando estiver disponível o editor de Perícias experimentais, preencha os seguintes campos:

1. **Nome:** distinto e curto.
2. **Custo em XP:** hipótese de 1 a 5.
3. **Requisitos:** Atributo, Conhecimento, Prática, Perícia, tipo de arma ou situação.
4. **Efeito:** exatamente o que o personagem faz e em quais condições.

Clique **“Registrar como rascunho”**. Ela aparecerá em uma categoria separada e poderá ser comprada com o XP da ficha. As Perícias experimentais são salvas e exportadas junto ao personagem, mas **o criador não verifica automaticamente seus requisitos nem aplica seus bônus**. O autor ou Narrador deve validar caso a caso.

**Exemplo PROPOSTO, não oficial:** Passo Calculado — 1 XP, requer Agilidade 1 e espaço livre; concede +1E em uma manobra de reposicionamento quando a condição é cumprida. Respeita o teto +2E de Perícias por ação.

Na ficha jogável, os **contornos/etiquetas de XP reduzido e aumentado** ficam ocultos durante as ações e aparecem apenas no **Modo edição**, quando é possível revisar os graus e seus custos. No Codex de criação, continuam visíveis para orientar escolhas.

## Como testar no laboratório

1. Crie um Aprendiz e utilize o catálogo de equipamentos G1 do protótipo. Itens sem preço aprovado e focos de fabricação não podem ser comprados por zero VT.
2. Escolha Atributo e fonte adicional. A terceira fonte depende de Perícia de combinação e pertinência **acordada verbalmente com o Narrador**; não há checkbox de confirmação. Clicar em arma/foco equipado no Repertório apenas monta a ação: revise a preparação e pressione **Rolar dados** quando estiver pronto.
3. Escolha DE de teste e balanço do alvo. Nos níveis 1–5, DE 2 é uma referência de confronto comum para playtest, DE 3 treinado e DE 4 excepcional — todas EXPERIMENTAIS, não obrigações.
4. Se desejar, gaste **1 Coragem** para **elevar uma fonte participante (Atributo, Conhecimento ou Prática) em um Grau temporário**, substituindo os dados dessa fonte pela composição do Grau seguinte. Exemplos: **2d6 → 3d6**, **2d10 → 3d10**, **3d10 → 2d10 + 1d12**. Não eleva dado de equipamento isolado, não gasta XP nem altera o Grau comprado; o aumento pode acrescentar um dado à pilha, até o limite de 9 dados rolados.
5. Role e **selecione livremente os dados mantidos**. É obrigatório **rolar** pelo menos um dado de Atributo, mas **não mantê-lo**. O terceiro dado mantido nos níveis 1–5 custa 1 Coragem.
6. Declare, quando pertinente, +1E ou +2E de Perícias. O criador disponibiliza esse valor para testes e pressupõe que os requisitos foram cumpridos.
7. Gaste Antecipar para cancelar Pavor e converter pares em Êxito. Não reutilize símbolos.
8. Finalize a ação para atualizar a Coragem da ficha.

Compare os resultados nos diferentes perfis de DE e peso. O Pavor remanescente não causa automaticamente uma ativação inimiga a cada símbolo; o Narrador usa as reservas e oportunidades.

## Limitações explícitas

O requisito provisório de Artes Marciais usa Armas 1 (foco Punhos) e Prática Armas grau 1; a equivalência deve ser confirmada na revisão normativa.

Ainda não há cálculo automático de críticos, dano elemental específico, armas físicas, escudos, integridade da armadura, dano à Vida, combate de grupos, condições de Saúde, alcance ou ações conjuntas. O laboratório mostra **dano básico**, não a totalidade de um combate. A capacidade de carga está parcialmente implementada e não soma o grau completo de Armas, ainda não modelado no protótipo.

Bônus de múltiplas Vantagens/Desvantagens até estados absolutos permanecem PENDENTES e não são simulados automaticamente. O d20 reforçado G está **DEFINIDO**, porém não é um dado comum de Aprendiz de nível 1; exige fonte extraordinária e requisitos de acesso.

O laboratório é uma ferramenta para desenhar e comparar hipóteses, **não converte Perícias experimentais em regras DEFINIDAS**.

## Próxima etapa

Criar as primeiras árvores abertas de Perícias com caminhos especializados e cruzamentos entre profissões, requisitos verificáveis, custos apropriados e efeitos distintos de dano, defesa, controle, mobilidade e suporte. Depois implementar combate conjunto, inventário, magia e playtest de várias rodadas.
