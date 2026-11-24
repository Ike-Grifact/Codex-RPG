# Codex RPG — SRD de Continuidade v0.120

**Data:** 24/11/2026  
**DEFINIDO:** distinção autoral entre turno, rodada e protagonismo; contagem de ações em conjunto. Substitui a formulação anterior de rodada sem contagem explícita e o encaminhamento automático da falha limpa ofensiva ao próximo jogador. Demais regras da v0.119 preservadas.

Um **turno** corresponde a uma ação realizada por um personagem jogador ou inimigo. Uma **rodada** corresponde à passagem de tantos turnos quanto o total de combatentes presentes na cena: personagens jogadores + inimigos. Em um conflito com 3 PJs e 3 inimigos, a rodada termina após 6 turnos realizados, independentemente da ordem ou de quem realizou cada um. A rodada mede o tempo do conflito; não é uma fila de iniciativa e não exige que cada combatente aja exatamente uma vez.

O **protagonismo** indica qual lado tem a oportunidade de agir. Um acerto puro (acerto sem Pavor residual) permite ao jogador continuar ou ceder voluntariamente a ação. Gastar Antecipar permite passar a oportunidade a um aliado elegível, antecipando seu turno individual sem anular Pavor. Se um ataque não resultar em acerto puro nem houver passagem válida por Antecipar, o protagonismo passa à oposição, inclusive na falha limpa ofensiva. A falha limpa continua sem punição negativa automática. Fora dessa regra de ataque em conflito, a falha limpa mantém o fluxo geral entre aliados.

Quando todos os jogadores já tiverem agido na sequência de protagonismo do grupo, inclusive por antecipações sucessivas, a oportunidade passa aos inimigos. Os inimigos podem encadear ações de aliados enquanto tiverem Antecipar válido para passar a oportunidade; quando não conseguirem fazê-lo, o protagonismo retorna aos jogadores. O acerto puro do inimigo, por si só, não prolonga essa sequência sem Antecipar. A troca de lado não encerra nem reinicia automaticamente a rodada.

Pavor pode abrir oportunidade de intervenção ou contra-ataque, mudando o protagonismo antes de completar uma rodada. Um contra-ataque que constitua uma ação conta como turno; a mera transferência de símbolos, a passagem de protagonismo e uma intervenção narrativa sem ação de combatente não contam como novos turnos. Permanecem os requisitos e custos de ativação válidos da oposição e as restrições de Antecipar; o Pavor disponível não concede automaticamente uma ação gratuita.

Uma **ação em conjunto** utiliza simultaneamente **um turno de cada participante**. Dois participantes contam dois turnos; três contam três. Não é um turno gratuito para quem ajuda, nem uma sequência de ataques individuais. Mantêm-se as regras próprias de resolução, os limites vigentes de até três participantes em ataques conjuntos, os custos e os requisitos aplicáveis. Passar protagonismo com Antecipar, por si só, não é uma ação em conjunto.

Perícias, magias e condições que indicam duração em **turnos** contam ações; aquelas que indicam **rodadas** contam ciclos completos de turnos equivalentes ao total de combatentes. Não tratar os dois termos como sinônimos nem alterar durações já publicadas. O tratamento de entradas e saídas de combatentes durante uma rodada, de ações conjuntas que cruzam o limite de uma rodada e o momento exato de expiração de efeitos específicos ainda precisam de definição.

**Exemplo:** três PJs (A, B e C) enfrentam três inimigos (X, Y e Z). A age e antecipa B; B age e antecipa C; C age. Já são três turnos, e a oportunidade passa à oposição. X age e antecipa Y; Y age sem Antecipar disponível para passar a ação. Após cinco turnos o protagonismo volta aos jogadores. A age: sexto turno, fim da primeira rodada. Z não precisou agir e A agiu duas vezes. Se A e B realizassem uma ação conjunta, ela contaria dois turnos simultâneos, não um.

## Continuidade e limites

- Mantêm-se as regras de Pavor local/público, Coragem, habilitações, custos e restrições de Antecipar já definidos, inclusive o limite vigente de antecipações de um combatente inimigo por rodada. Não importar custos ou procedimentos históricos contraditórios.
- A contagem da rodada não garante ação individual, alternância fixa ou iniciativa por atributo. Não se altera a duração numérica de nenhuma Perícia, magia ou condição.
- **Interpretação editorial:** “todos agirem” refere-se à sequência de protagonismo do grupo, não à necessidade de que todos os combatentes da cena ajam uma vez por rodada. Essa sequência não é uma nova unidade de duração.
- **PENDENTE:** ajuste da quantidade de turnos por rodada quando combatentes entram ou saem; travessia de limite de rodada em ação conjunta; procedimento de expiração dos efeitos em curso e interação de restrições de antecipação específicas com o novo fluxo, quando não expressamente previstas. Não criar automatismos para esses casos.
- **Implementação:** documentação nos Livros do Jogador e do Mestre (Markdown e portal) e em Mecânicas. Contadores, automações de duração e passagem de protagonismo no simulador/Foundry ainda não implementados nesta revisão.
