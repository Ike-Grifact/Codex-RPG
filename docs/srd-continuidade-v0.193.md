# Codex RPG — SRD de Continuidade v0.193 — balanceamento de conjuração nível 1 (em revisão)

**Data:** 27/11/2026. Base main v0.192. Decisões explícitas do autor após análise de builds de nível 1. Registro em branch revisável; não migra automações nem publica na main.

## DEFINIDO — habilitação de conjuração

Criar Item de Foco e Magia é obrigatória para conjurar qualquer elemento, incluindo Psique, os elementos conhecidos por Perícia e os obtidos por Improviso. Substitui a independência de conjuração elemental da v0.81–0.82 e os textos correspondentes das v0.182–0.190. Não torna Criar Item de Foco e Magia pré-requisito para **adquirir** conhecimento elemental: a Perícia elemental por si representa domínio do elemento e pode ser utilizada em atividades pertinentes, como Artesão e forja, conforme habilitações existentes, mas não concede conjuração. Preservar XP, requisitos de aquisição e concessões raciais de Perícias; não confundir a compra gratuita racial da Perícia Criar Foco com um item físico gratuito. Não criar novos benefícios de fabricação.

## DEFINIDO — Improviso Elemental

Ativa: gastar 1 Coragem para obter um elemento disponível na cena para a conjuração, sem conceder sua propriedade especial nem elevar Grau automaticamente. Exige a habilitação geral de conjuração para conjurar. Revoga o +1A passivo e o custo de 1A do Improviso da v0.189. Preservar aquisição 1 XP e requisitos Disciplina 1, Inteligência 1 e Destreza 1. Não presumir que um foco alheio ou elemento inexistente seja fonte válida. **Interpretação:** "apenas a pegar um elemento da cena" restringe Improviso à obtenção desse elemento, sem conceder mistura automática; confirmar se a antiga troca/mescla de natureza sem propriedades permanece como aplicação do novo custo. Maestria mantém a habilitação de mistura de propriedades, seu próprio +1A e requisitos vigentes, mas não acumula um +1A de Improviso que foi revogado. Seus custos específicos e interações continuam em revisão.

## DEFINIDO — invocação Pequena

Ao atuar em ataque conjunto, a invocação Pequena fornece somente 1A, não transfere dado de Atributo inteiro nem todos os símbolos de uma rolagem. Quando separada da ficha do conjurador, tem apenas 1 de Vida (equivalente às quatro faixas básicas), sem armadura. Ao sofrer 1 dano à Vida, já fica Ferida. **Interpretação para revisão:** uma unidade por faixa (Saudável, Ferido, Incapacitado e Inconsciente), total operacional de quatro unidades de Vida, sem acréscimo por ficha de XP, Força ou Vigor; confirmar representação e conversão de dano bruto contra invocação sem armadura, pois a métrica geral de ataques sem armadura ainda possui pendência. Não confundir 1 dano à Vida com qualquer 1 ponto de dano bruto sem verificar a regra de conversão. Preservar custo de Invocação, requisitos, imunidade elemental, limites de ação e portes superiores onde não modificados. Duração, ataque independente e eventual acumulação de bônus de companheiro domesticado com invocação continuam PENDENTES. Não multiplicar ações ou fichas por representação de corpos.

## DEFINIDO — Trevas: Divisão das Sombras

Em G3, se a mesma rolagem alcançar a DE individual de ambos os alvos, cada um recebe o mesmo dano calculado do ataque, antes de suas próprias proteções, resistências e condições. Se alcançar apenas uma DE, apenas o alvo atingido recebe dano. Não dividir dano entre eles nem aplicar a soma das DEs por analogia com Golpe Colossal. Preservar +2T (substitui +1T), preparação e limites de alvos vigentes. **Interpretação para revisão:** o Temor da rolagem é transferido uma vez aos recursos da oposição, sem duplicar a reserva por acertar dois alvos; confirmar alocação entre alvos e interação com recuperação de Coragem. Dano igual não implica repetir o gasto de um símbolo nem duplicar Temor disponível.

## DEFINIDO — focos: recarga e economia

Cada carga de foco comum se recupera após dois turnos do próprio mago, não ao final de uma rodada de todos os combatentes. Capacidade física e elemental preservada: Leve 1, Médio 2, Pesado 3, cada carga de seu elemento. Pedra da Alma mantém exceção de ausência de recarga natural. Revoga a concessão de item de foco/cristal físico gratuito na criação; o item deve ser comprado. Não retirar a concessão racial de XP da Perícia de criação de foco. Preços unitários e classificações da v0.188 permanecem em revisão, sem alteração de patrimônio inicial. **PENDENTE:** início da contagem (após gasto parcial ou apenas esgotamento, conforme regra anterior), se o turno da utilização conta e momento exato de disponibilidade. PROPOSTO para playtest: contar dois turnos próprios posteriores ao gasto antes de restaurar uma carga, repetindo enquanto em recarga; validar gatilho antes de automatizar. Preservar lógica de aceleração por carga; não alterar o peso físico quando cargas são consumidas.

## Análise de nível 1 — sem novas regras

15 XP; retenção natural 2, ou 3 por 1 Coragem. Faces conferidas no app.js da main v0.192. Enumeração exata de resultados equiprováveis, todas as seleções não vazias até o limite, 1A cancela 1T, 2A gera 1E, crítico conforme faces oficiais. Política: priorizar acerto, minimizar T residual, maximizar dano e então recuperação de Coragem. Sem passagem de ação, resistências, alcance, saúde, interferência ou custo adicional de Grau. Não é simulação de encontro.

| Lucker Puro Disciplina 3, Inteligência 3 | Pilha | Retenção | Acerto DE3 | Limpo | Dano médio à Integridade |
|---|---|---:|---:|---:|---:|
| G2 anterior +1A | 3d10+3d6 | 2 | 92,588% | 51,753% | 2,625 |
| G2 novo | 3d10+3d6 | 2 | 79,656% | 27,850% | 2,122 |
| G2 novo | 3d10+3d6 | 3 | 97,481% | 37,667% | 2,781 |
| G3 Queimar | 4d10+2d6 | 2 | 86,908% | 39,320% | 2,907 |
| G4 Derreter | 5d10+1d6 | 2 | 91,613% | 49,827% | 3,079 |

Dano direto fixo de Derreter não incluído na média de Integridade. Exemplo de build legal: Lucker Puro Disciplina 3 (8), Inteligência 3 (4), Artesão 1 (2), Vigor 1 (1), Criar Foco 0 e elemento racial Fogo 0. Humano Disciplina 3 (8), Inteligência 2 (3), Artesão 1 (2), Criar Foco (1), Fogo (1) = 15 XP. Ambas sem Improviso. Não alterar XP nem faces. Trevas merece teste de dois alvos: Lucker Puro Disciplina 3 (8), Inteligência 2 (2), Artesão 1 (2), Trevas (2), Vigor 1 (1), Criar Foco 0, elemento racial gratuito diferente de Trevas; G3 3d10+3d6, +2T, DE3, retenção 2: acerto 99,970%, limpo 0%, T médio residual 1,772, dano convencional médio 2,699 por alvo com DE3 antes das proteções. Resultado isolado, sem contabilizar eventual transferência de Temor duplicada, que não foi autorizada.

**Escopo:** somente decisões e análise, não alterações do livro, comércio, Perícias públicas, ficha, simulador ou Foundry. Pendências explícitas continuam para decisão autoral.
