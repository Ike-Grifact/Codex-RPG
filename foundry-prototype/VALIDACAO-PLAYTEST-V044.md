# Foundry v14 · execução do playtest SRD v0.44

## Auditoria

| Estado | Regra ou funcionalidade |
| --- | --- |
| DEFINIDO | d10 face 10: 2E + 1A, sem P. Textura com marca de máxima. Crítico exige duas ou mais faces máximas mantidas. Teto de nove dados lançados e quatro mantidos. |
| DEFINIDO | Elevação por 1 Coragem, um passo até d12 e escolha de dado elegível. A Coragem é gravada com a pilha antes da animação. Em combate, a elevação comum só pode ser usada uma vez por rodada. Os custos de retenção e ativação são cobrados na confirmação. |
| DEFINIDO | Pavor local 4/5/6/7/8/8 por Grau, com preenchimento uma vez pelo comando do Narrador. Retenção extraordinária custa 1P por dado efetivamente mantido além dos dois naturais. Humanoide G2+ tem três dados naturais e paga 1 Coragem se mantiver o quarto. |
| DEFINIDO | Ativação-base paga de personagem 1 PP ou 1 Coragem. Conjuração Refinada conserva o ID. Perito Conjurador legado permanece salvo e seus 2 XP estão livres no cálculo. |
| DEFINIDO | Armaduras padrão G1 0/7/12/17. O Narrador pode atualizar uma peça antiga correspondente na ficha do Item, após backup. A operação desconta três do máximo e do atual, com piso zero. Escudos e peças personalizadas permanecem com seus valores. |
| EXPERIMENTAL | Humanoide normal usa 20 XP compartilhados. Humanoide Monstro usa as tabelas de XP mais altas e o orçamento dado pelo Narrador. Seus dados e composição usam provisoriamente o modelo humanoide, além do teto por Grau definido na decisão posterior. |
| PROPOSTO | Dispensa de teste por probabilidade. Preços dos escudos G1 usados no catálogo continuam de playtest. |
| PENDENTE | Novo alcance da Conjuração Refinada, escala própria do Humanoide Monstro, economia de exceções e efeitos especiais elementais, reforços, integração completa de ações conjuntas e condições. Sem iniciativa automática. |

## Roll & Keep

O jogador solicita a rolagem ao cliente do Narrador ativo usando `User.query`. A consulta é automática. É necessária a permissão nativa **Consultar Usuário** e um Narrador conectado. A fila por Actor ordena preparação, seleção e confirmação, inclusive entre clientes. O Actor guarda as faces e a seleção. Na confirmação, custos e publicação são gravados juntos. O chat usa um ID fixo derivado do `rollId`. Se houver falha, **Retomar publicação** usa a mesma decisão sem novo pagamento.

Enquanto a pilha 3D é animada, o cliente que iniciou o teste aguarda. O Dice So Nice usa a pilha avaliada no próprio Foundry e distribui a animação à mesa. O cliente sem módulo usa as cartas. A mensagem final é única e contém os dados mantidos, o total e as consequências a validar.

## Combate de mesa

- Escolha o alvo antes da rolagem e indique **Alvo usa Esquiva** quando aplicável. A DE é fixada na pilha para permitir comparar alternativas.
- O Narrador pode aplicar Pavor residual ao alvo pela mensagem. A aplicação é registrada na ficha para impedir duplicidade. Excedentes de Pavor por crítico são apresentados para adjudicação na HUD pública.
- Pode-se reservar 1 Antecipar e indicar o aliado. O Narrador valida a passagem no chat, com limite de um recebimento por aliado e rodada. A condução da oportunidade, dano, Vida, Integridade e condições fica com o Narrador.
- O custo público de golpe conjunto com Líder é 1P por aliado, com até três participantes. A HUD permite planejar líder, aliados e alvo e registra o custo previsto no chat. Gasto, execução e aplicação conjunta continuam supervisionados pelo Narrador.

## Registro sugerido no caderno

Anote ficha e Grau, alvo e DE geral ou Esquiva, pilha, dado elevado, mantidos, E/A/P antes e depois das conversões, Coragem/PP/Pavor antes e depois, dano em Integridade e Vida e arbitragens. Para o primeiro teste, use um Aprendiz e um Humanoide G2, com outro cliente como Narrador. Confirme uma rolagem, reabra a ficha e confira que o chat e os recursos registraram a ação uma única vez. Repita com Dice So Nice desligado.
