# Revisão do feedback do jogador Aquiles e da economia de magia — 14/11/2026

**Fontes:** relato escrito do jogador, conversa de Discord sobre arquétipos e recursos, observação do autor de que cerca de **20 XP previstos para a oposição não foram utilizados** no confronto anterior; SRD v0.42 revisado e nova seção **0-AC do [SRD v0.43](../srd-continuidade-v0.43.md)**. Nenhuma sugestão do jogador se torna regra apenas por constar no relatório.

**Ponto central:** o jogador gostou da **escolha tática de dados, fluidez das antecipações e liberdade de construir profissão**, mas relatou **falta de especializações reconhecíveis, pouca sensação de dano real, armaduras como segunda barra de Vida, papel coletivo da oposição pouco claro, testes triviais de Conhecimentos e catálogo de itens/economia pouco desenvolvido**. Prefere um mago que resolva ataques e defesa com magia, inclusive barreiras, em vez de depender de combate físico.

## 1. Registro das observações e decisões

| Tema | Evidência no feedback | Regra/estado após a discussão | Próximo passo |
|---|---|---|---|
| Identidade de conjuradores | Deseja mago exclusivamente mágico e mais Conhecimentos/Perícias temáticos | **DEFINIDO:** profissões emergem livremente de build; **PENDENTE:** catálogo detalhado de Necromante/Druida/Invocador e habilidades específicas | Projetar árvores de efeitos sem impor classes obrigatórias |
| Economia de recursos | Mago parece depender fortemente de PP e Coragem; autor cogitou apresentar “Mana” | **DEFINIDO v0.43:** custo-base pago 1 PP ou 1 Coragem; efeito elemental com foco e Perícia grátis; **PROPOSTO:** nome visual “Mana” | Simular sustentabilidade e clareza do recurso único antes de renomear |
| Primeiro ato do confronto | Jogador sugere iniciativa inicial por Agilidade ou Perícia passiva | **PROPOSTO:** critério de abertura, não aprovado. Fluxo posterior por Antecipar e Pavor permanece | Teste narrativo com abertura livre versus disputa inicial, sem mudar ambos ao mesmo tempo |
| Dano e armadura | Quase ninguém perdeu Vida; armaduras pareceram ser o HP verdadeiro | **EXPERIMENTAL:** Integridade G1 10/15/20 em leves/médias/pesadas; não tratar como balanceada | Medir desgaste, dano efetivo e ataques necessários para romper |
| Oposição | Inimigos pareciam nem individuais nem grupo completo | **DEFINIDO:** reservas local/pública distintas, Líder e oportunidade; saldo local G1=4P a G5–6=8P, cheio no início | Exibir no guia diferença entre ação individual, antecipação e golpe conjunto |
| Conhecimento fora de combate | Astronomia de alto grau não deveria rolar para fatos rotineiros | **PROPOSTO:** informação e tarefas triviais automáticas por proficiência, teste só diante de incerteza relevante | Definir critérios de rotina sem números arbitrários por Grau |
| Itens | Pedidos de efeitos passivos condicionados a alcance, impulso e manejo | Características e afinidades existem parcialmente; novas passivas não aprovadas | Auditar tabelas de alcance/afinidade antes de acrescentar bônus |
| Compras | Poucas escolhas de consumíveis e pouca utilidade monetária | **DEFINIDO v0.43:** incluir pedras elementais por VT remanescente; **PENDENTE:** preços/carga/função de Pedra da Alma | Ampliar catálogo por utilidade em cena |
| Barreira | Jogador gostou da rolagem única e sugeriu fortificação com Coragem ou integridade por recurso | **DEFINIDO:** E/P da rolagem constituem defesa/integridade simbólica; **PROPOSTO:** gasto extra para reforço | Testar custo de reforço separadamente, sem inventá-lo |
| D4 e capacidade inicial | Jogador sentiu d4 fraco; autor explicou mínimo de capacidade e chances de risco | **DEFINIDO:** faces do d4 e d6 não alteradas | Explicar diferença entre “consegue tentar” e “consegue acertar sem Pavor” |
| Invocador/Necromante/Druida | Propostas de roubos de rostos/corpos, metamorfose, pets e engenharia/alquimia/medicina | **PROPOSTO/PENDENTE:** ideias de profissões emergentes, não Perícias adquiríveis automaticamente | Definir requisitos, limites, ação do pet e custos antes de automatizar |

## 2. Diagnóstico matemático limitado — d4 não é um d6 fraco

O **d4 atual** tem 4 faces: **0/4 geram Êxito (0%)**, **2/4 geram Pavor (50%)** e **1/4 gera Antecipar (25%, junto de Pavor)**. Sua função é representar capacidade mínima e oportunidade de tentar, **não** autonomia para êxitos limpos.

Para pilha **1d4+1d6**, com **ambos mantidos**, **sem Antecipar gasto, Perícia, Vantagem ou bônus**, a enumeração exata das **24 combinações equiprováveis** produz:

| DE | Acerto limpo | Acerto com Pavor | Falha limpa | Falha com Pavor |
|---|---:|---:|---:|---:|
| 1 | 2/24 = **8,3%** | 18/24 = **75,0%** | 4/24 = **16,7%** | **0%** |
| 2 | **0%** | 8/24 = **33,3%** | 6/24 = **25,0%** | 10/24 = **41,7%** |
| 3 | **0%** | **0%** | 6/24 = **25,0%** | 18/24 = **75,0%** |

**Interpretação:** contra DE 1 há **83,3% de êxito**, mas a enorme maioria inclui Pavor (que **não é acerto limpo**). Contra DE 2 a chance de êxito cai a 33,3%, sempre com Pavor. Isso favorece a intenção de permitir tentativas não treinadas, mas exige exemplos didáticos e testes fora de combate. Não aumentar faces automaticamente por impressão subjetiva.

## 3. Risco de desequilíbrio introduzido por v0.43

**Mecânicas isoladas:**
1. **Custo-base 1 Coragem em vez de 2:** dobra, em termos de orçamento de recurso, a quantidade teórica de ativações pagas que cabem na mesma reserva de 10 Coragens, **antes** de outros gastos, recuperação e limites de oportunidade: até 10 em vez de 5. **Não** implica 10 turnos e não considera consumo para manter/elevar dados.
2. **Efeito elemental gratuito com foco e Perícia:** pode elevar muito a eficiência das builds mágicas sem ampliar a dos especialistas físicos. Registre ações em que o foco foi usado e quantos efeitos foram gratuitos. Magia de **Trevas com +2P para DE** é caso prioritário, sobretudo em dois alvos: ao mesmo tempo aumenta precisão e alimenta o Pavor da oposição. O risco torna o benefício menos equivalente a +2E limpos, mas não necessariamente o neutraliza.
3. **Amplificação de até peso máximo por 1 Coragem:** se o teto fosse interpretado como salto livre de Leve a Pesada ou aumento de dado sem restrições, poderia superar a eficiência da elevação comum de dado. **PENDENTE:** definir conversão e requisitos; não automatizar potência presumida.
4. **Redução gratuita com recarga:** pode permitir alternância eficiente entre conjuração forte e leve; precisa de tabela clara de Grau do foco, recarga e eventual gasto de ação. Nenhuma recarga por rodada fora da regra de foco deve ser criada.

**Hipóteses a comparar:** conjurador puro com foco; conjurador sem foco usando ambiente; usuário de Trevas com um/dois alvos; usuário de Fogo/Água/Terra com controle; arquétipo marcial pago; híbrido arma e magia. Equipamentos, Atributos, Graus, DE e oportunidades devem ser mantidos equivalentes na comparação.

## 4. Dano, proteção e oposição: não concluir prematuramente

O SRD possui Integridade de armaduras G1 **10/15/20, todos valores EXPERIMENTAIS**. Para ilustração, se cada acerto causar **2 de desgaste efetivo** e nenhuma resistência/situação alterar o resultado, seriam necessários aproximadamente **5, 8 e 10 ataques acertados** para esgotar essas reservas. Isso ajuda a explicar a observação de pouca perda de Vida, mas não prova que são os valores corretos: dano pode variar, ataques podem errar, perfuração pode ignorar integridade e outros efeitos podem contornar proteção.

**Confundidor central do último confronto:** o autor reconheceu **aproximadamente 20 XP de orçamento de inimigos não utilizados**. Além disso, regras posteriores aumentaram o Pavor inicial, corrigiram seu destinatário e mudaram os custos de ativação. Portanto, não alterar Vida, dano, Integridade e economia de ações **todos ao mesmo tempo** usando apenas aquele encontro como prova.

**Teste pareado recomendado:** executar o mesmo encontro com oposição e XP integrais, posições iniciais e objetivos iguais; comparar (A) regras efetivamente usadas na sessão, (B) nova reserva local e destino de Pavor, (C) custos revisados de Perícia, (D) magias gratuitas. Medir **rodadas, oportunidades de ataque, acertos limpos/com Pavor, dano à Integridade, dano à Vida, Coragem/PP/Pavor gastos e reação dos jogadores**. Marcar condições que foram esquecidas e não registrar ataques ilegais como resultados normais.

## 5. Ordem sugerida de revisão

1. **P0 — regras e confiabilidade de implementação:** resolver diferença entre Grau e peso, preço de pedras, recurso de magia em falhas, e testar Foundry/criador com foco e elemento. Não deixar um texto prometer ativação grátis e código cobrar 2 Coragens.
2. **P1 — ameaça e dano percebido:** reexecutar confronto com oposição integral, armaduras G1, risco de Pavor, defesa e escudo; separar dano evitado por DE de dano absorvido por Integridade.
3. **P2 — catálogo com identidade sem classe fixa:** detalhar ramos de Necromante/Druida/Invocador e Perícias de informação útil fora de combate, sem conceder novo turno ao pet por padrão.
4. **P3 — iniciativa e UX:** discutir se o primeiro momento depende da ficção, Agilidade ou critério de Perícia; melhorar explicação de papéis e de ações sem rolagem. O fluxo de oportunidades depois da abertura deve ser preservado.
5. **P4 — economia e equipamento:** fixar custo de cristais/pedras e cargas, ampliar consumíveis, rever bônus condicionais a distância e materiais. Não publicar desconto comercial numérico sem aprovação.

**Decisão operacional:** nenhuma sugestão do feedback alterou automaticamente iniciativa, integridade, críticos, faces do d4, Perícias de Necromante/Invocador, escudo ou economia de ações. As novas decisões do autor sobre Perícias e magia estão na seção 0-AC; as demais são hipóteses ou pendências.
