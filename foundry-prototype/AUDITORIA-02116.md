# Auditoria do Codex RPG Foundry 0.2.1.16

Auditoria realizada em 19/11/2026. Origem oficial `Ike-Grifact/Codex-RPG`, main no commit `6957ad45032bffef98c10c6160bc85fda1871fd1`. A instalação inicial correspondia ao commit `79dc1e1`, versão 0.2.1.15, Foundry 14.367. O clone estava limpo e acompanhava a branch do PR #4. O sistema foi copiado integralmente para um backup de pré-auditoria antes das alterações.

## Precedência e conclusões normativas

O [SRD Playtest Nível 1 v1.0](../docs/srd-playtest-nivel-1-v1.0.md), atualizado em 18/11/2026, declara expressamente que substitui a continuidade v0.82 como referência ativa. Por isso, os exemplos sobre Druídica contidos no pedido devem ser lidos como históricos. Na referência ativa, a Perícia custa 1 XP, exige Criar Item de Foco e Magia + Terra e habilita as três formas sem Domar. A elevação comum volta a subir um dado na cadeia d4→d6→d10→d12. O reforço que duplicava um dado, implementado na 0.2.1.14, corresponde a uma decisão anterior.

O orçamento atual é 15 XP. As progressões são Atributos 0/1/3/6/9/18/32 e Conhecimentos/Práticas 0/2/4/8/16/32/64. Os 20 VT iniciais continuam experimentais. PP fica guardado como dado histórico, com registro de migração, e as ações atuais utilizam Coragem. A migração conserva o orçamento de formação já concedido de 20 XP nas fichas anteriores e identifica esse valor em `system.creationBudget`. Personagens novos recebem 15 XP. A lista de Perícias, o XP adicional e o histórico permanecem registrados. Os custos atuais recalculam o investimento, incluindo a redução de Druídica para 1 XP.

## Contagem dos registros

- 66 definições verificadas, incluindo quatro registros legados. O site possui 64 registros e o pacote acrescenta os dois protótipos retirados que já existiam em fichas Foundry.
- 26 registros já compatíveis nos campos comparados e 40 atualizados, incluindo 12 registros acrescentados.
- 28 descrições anteriores corrigidas, uma alteração de custo de aquisição, em Druídica, e 11 conjuntos de requisitos anteriores corrigidos.
- 7 aquisições continuam pendentes de custo/regra. Essa contagem de pendências é independente da comparação antes/depois. Os registros são Manejo Perfeito — Armas Corpo a Corpo, Recuperação Vigorosa, Maestria em Recuperação Vigorosa em Movimento, Instinto de Sobrevivência, Maestria Arma Certa, Transfusão, Disparo Tático.
- Após as correções, 64/64 registros da origem conferem nos nomes, custos e descrições. As 66 definições do Compendium conferem com o catálogo usado pelo DNA e pela ficha. O estado de automação de cada efeito consta na definição e em `skill-audit.json`.

## Matriz dos subsistemas

| Regra ou capacidade | Site / referência ativa | Foundry 0.2.1.15 | Correção e estado | Implementação responsável | Verificação |
| --- | --- | --- | --- | --- | --- |
| Criação e custos | 15 XP e tabelas atuais | 20 XP e tabelas antigas | DEFINIDO. Novos personagens usam a v1.0. Formação antiga identificada e compras preservadas | rules.xpLedger, advancement.gradeDetails, rules-migration.migrateRules | conformance-1.0, evolution, rules-migration e compra real no DNA |
| Improviso | Disciplina 1 + Inteligência 1 + Destreza 1, 1 XP | Exigia Foco | DEFINIDO. Requisito de Foco retirado e +1A pertinente integrado | skill-catalog, advancement, rules.passiveAnticipar | Casos positivos, ausência de cada requisito e teste real sem Foco |
| Elementos | Requisitos individuais sem Foco | Sete elementos ainda exigiam Foco | DEFINIDO. Validação e compra assistida corrigidas. A fonte ambiental é confirmada pelo Narrador | skill-catalog, roll-workflow, roll-resolution | Compra de Fogo e conjuração real sem Item de foco |
| Druídica | v1.0, Foco + Terra, 1 XP, três formas | 2 XP e toda a cadeia de Domar | DEFINIDO na aquisição. Transformação registra porte e Atributos, cobra 0/1 Coragem, bloqueia conjuração e armadura. Dados expressamente definidos são aplicados | transformations, rules.sourceDice, equipment-logic | Compra sem Domar, Grande, reversão e bloqueio de conjuração |
| Aprimoramento animal | 2d6+1d10 → 2d10+1d12; demais composições e Vida dependem de procedimento | Modelo histórico de outra ficha animal | PENDENTE em outras composições. A forma pode ser declarada, mas a rolagem automática exige adjudicação nesses casos. Graus e Vida real são conservados | animalTransformationPlan, preparePendingRoll | Caso aprovado, Vigor proibido na Pequena e dados pendentes |
| Transformação Elemental | Foco + elemento, duração E−P positiva, imunidade 0, resistência E/2 | Definição ausente | DEFINIDO nas fórmulas. PENDENTE em fontes/DE/unidade e registro de frações. Funções consultivas conservam frações | elementalDuration, elementalDamage, skill-catalog | Casos positivos, duração negativa e dano 1,5 sem arredondamento |
| Perícias Avançadas | Doze fontes, Grau 2, 1 XP e demais requisitos próprios | Apenas parte do conjunto | DEFINIDO. Compra, pacote e terceira fonte pertinente compartilham o catálogo | ADVANCED_SOURCES, mayComplement, advancement | Todos os registros e alternativas |
| Domar | Média exige Pequena, Grande exige cadeia | Requisitos incompletos | DEFINIDO. Relações corrigidas. O uso narrativo do companheiro continua sob adjudicação | requirements, planSkillPackage | Alternativas completas e remoção de cada requisito |
| PP e Coragem | Reserva única 10/11/12/13; crítico recupera 1 ou 2 Coragens | UI/ativação/recuperação ainda ofereciam PP, teto fixo 10 | DEFINIDO. PP fora dos controles e do pagamento. Saldo antigo registrado. Descanso curto exige Recobrar, longo recupera Vigor+1 | roll-resolution, pavor-panel, rest na fila do Narrador | Custos, crítico, teto, descanso e chat real sem PP |
| Elevação comum | Subir um dado, uma vez por rodada, 1 Coragem | Duplicava o dado | DEFINIDO na v1.0. Elevação muda a categoria até d12 e conserva a quantidade | buildPool, preparePendingRoll | Pilha, cobrança única, limite por rodada e d20 excluído |
| Faces / retenção / crítico | Tabelas simbólicas atuais, até 9 rolados e 4 mantidos quando habilitados | Faces já alinhadas | DEFINIDO. Faces conservadas, Atributo obrigatório na pilha e dados descartados sem efeitos | FACES, sourcePairError, resolveRoll | Testes de faces, retenção, crítico e dados rúnicos |
| Defesa e armadura | Modificador de armadura em toda defesa; teto natural 9 e final 12 | Bônus leve restrito à Esquiva | DEFINIDO. Bônus aplicado uma vez, Grau e Muito Pesada condicionados às habilitações. Formas removem a proteção física | equippedArmor, defenseDE, defenseDisplay | Alvos públicos/reservados e categorias de armadura |
| Carga e Cravar | Peso de arma cravada conta na carga. −1E de Cravar pertence a Levantar Escudo. Alcance automático de sobrecarga permanece pendente no Livro | Carga de arma cravada ausente | DEFINIDO no peso cadastrado. Abrangência da sobrecarga, múltiplas armas e consequências abertas continuam sob adjudicação | carriedWeight, Inventário e controles Cravar | Peso físico, filtros e ausência de penalidade geral inventada |
| Pavor e oportunidade | Pavor válido vai ao alvo declarado, com limites de sua reserva. Antecipar só é gasto uma vez | Fluxo de adjudicação existente | Conferido. Teto de Coragem corrigido. Direção, múltiplos alvos e decisões de cena continuam manuais quando pendentes | roll-targets, combat-adjudication, pavor-panel, joint-attack | Cifra de DE, alvo do mapa, Pavor residual e publicação única |
| Maestrias / alquimia / engenharia / tratamento | Identidades novas adiadas. Descrições aprovadas e requisitos específicos disponíveis | Textos e referências históricos | Catálogo revisado integralmente. Gatilhos adiados e efeitos classificados como manuais continuam sem concessão automática | skill-catalog, Perícias e Compendium | Comparativo completo e bloqueio das sete aquisições pendentes |
| Origem / efeitos raciais | Regras próprias do criador, com identidade racial estruturada | Origem de texto livre | A migração conserva origem e aquisições. A associação de uma origem textual antiga a uma raça depende de confirmação do Narrador, e não concede Perícias durante a migração | creation, rules-migration, dados originais de importação | IDs desconhecidos, compras e registros históricos preservados |
| Compendiums | Catálogo oficial compartilhado | Ausentes | Equipamentos com 90 Items e Perícias com 66 Items, registrados no manifesto e compilados em LevelDB | compendium-data, build-compendiums, system.json | Conteúdo binário completo, índice nativo, consulta e arrasto |
| Permissões | Loja cobra VT, Narrador pode conceder Item | Loja por autoridade, sem pacote nativo | Jogador usa Loja. Arrasto direto ao Actor é recusado para jogador. Narrador pode conceder equipamento sem cobrança oculta. Item de Perícia não altera Actor.system.skills | preCreateItem, preUpdateActor, purchasePlan | Dois clientes, arrasto real e compra normal |

## Comparativo por Perícia

Os requisitos abaixo são os tokens estruturados compartilhados pelo validador e pelos Compendiums. `a` representa Atributo, `k` Conhecimento, `p` Prática e `s` Perícia adquirida. A consulta nativa mostra seus nomes por extenso. O JSON de auditoria contém as descrições e os requisitos antigos e novos completos.

| Perícia | Custo anterior | Custo atual | Requisitos atuais | Estado | Resultado |
| --- | --- | --- | --- | --- | --- |
| Combate | 1 XP | 1 XP | Sem requisito adicional | LEGADO | Conferida |
| Armas 1 | 2 XP | 2 XP | Sem requisito adicional | LEGADO | Conferida |
| Montar Animal | 2 XP | 2 XP | a:influencia:2 | DEFINIDO | Conferida |
| Provocação Sofisticada | 1 XP | 1 XP | a:influencia:2 | DEFINIDO | Conferida |
| Criar Item de Foco e Magia | 1 XP | 1 XP | p:armas_conjuracao:1 + a:inteligencia:1 + p:artesao:1 | DEFINIDO | Corrigida |
| Escudo Arcano | 1 XP | 1 XP | a:inteligencia:2 + a:vigor:1 + s:criar-item-foco-magia | DEFINIDO | Corrigida |
| Conjuração Refinada | 1 XP | 1 XP | p:armas_conjuracao:2 + a:inteligencia:2 + a:destreza:2 + s:criar-item-foco-magia | DEFINIDO | Conferida |
| Improviso Elemental | 1 XP | 1 XP | p:armas_conjuracao:1 + a:inteligencia:1 + a:destreza:1 | DEFINIDO | Corrigida |
| Maestria Elemental | 1 XP | 1 XP | p:armas_conjuracao:3 + a:inteligencia:3 + a:destreza:3 + s:criar-item-foco-magia + s:improviso + s:vento OU p:armas_conjuracao:3 + a:inteligencia:3 + a:destreza:3 + s:criar-item-foco-magia + s:improviso + s:sangue OU p:armas_conjuracao:3 + a:inteligencia:3 + a:destreza:3 + s:criar-item-foco-magia + s:improviso + s:agua OU p:armas_conjuracao:3 + a:inteligencia:3 + a:destreza:3 + s:criar-item-foco-magia + s:improviso + s:fogo OU p:armas_conjuracao:3 + a:inteligencia:3 + a:destreza:3 + s:criar-item-foco-magia + s:improviso + s:terra OU p:armas_conjuracao:3 + a:inteligencia:3 + a:destreza:3 + s:criar-item-foco-magia + s:improviso + s:veneno OU p:armas_conjuracao:3 + a:inteligencia:3 + a:destreza:3 + s:criar-item-foco-magia + s:improviso + s:sagrado OU p:armas_conjuracao:3 + a:inteligencia:3 + a:destreza:3 + s:criar-item-foco-magia + s:improviso + s:trevas | DEFINIDO | Corrigida |
| Perícia em Elemento Fogo | 1 XP | 1 XP | p:armas_conjuracao:1 + a:inteligencia:1 | DEFINIDO | Corrigida |
| Perícia em Elemento Água | 1 XP | 1 XP | p:armas_conjuracao:1 + a:inteligencia:1 | DEFINIDO | Corrigida |
| Perícia em Elemento Ar | 1 XP | 1 XP | p:armas_conjuracao:1 + a:inteligencia:1 | DEFINIDO | Corrigida |
| Perícia em Elemento Terra | 1 XP | 1 XP | p:armas_conjuracao:1 + a:inteligencia:1 | DEFINIDO | Corrigida |
| Perícia em Elemento Sagrado | 2 XP | 2 XP | p:armas_conjuracao:2 + a:inteligencia:2 | DEFINIDO | Corrigida |
| Perícia em Elemento Veneno | 2 XP | 2 XP | p:armas_conjuracao:2 + a:inteligencia:2 + k:alquimia:2 + k:medicina:2 | DEFINIDO | Corrigida |
| Perícia em Elemento Sangue | 2 XP | 2 XP | p:armas_conjuracao:2 + a:inteligencia:2 | DEFINIDO | Corrigida |
| Perícia em Elemento Trevas | 2 XP | 2 XP | p:armas_conjuracao:2 + a:inteligencia:2 | DEFINIDO | Corrigida |
| Perícia em Armas Leves | 2 XP | 2 XP | p:armas_conjuracao:1 | DEFINIDO | Corrigida |
| Perícia em Armas Médias | 2 XP | 2 XP | p:armas_conjuracao:1 + a:forca:1 | DEFINIDO | Corrigida |
| Perícia em Armas Pesadas | 2 XP | 2 XP | p:armas_conjuracao:2 + a:forca:2 | DEFINIDO | Corrigida |
| Disciplina Avançada | 1 XP | 1 XP | p:armas_conjuracao:2 | DEFINIDO | Conferida |
| Concentração Refinada | 1 XP | 1 XP | p:armas_conjuracao:2 | DEFINIDO | Conferida |
| Manejo Perfeito — Armas Corpo a Corpo | Pendente | Pendente | a:destreza:2 + s:disciplina-avancada | PENDENTE | Conferida |
| Golpe Fulminante | 1 XP | 1 XP | p:armas_conjuracao:2 + a:forca:2 + s:armas-leves OU p:armas_conjuracao:2 + a:forca:2 + s:armas-medias OU p:armas_conjuracao:2 + a:forca:2 + s:armas-pesadas OU p:armas_conjuracao:2 + a:forca:2 + s:maestria-manejo-duplo OU p:armas_conjuracao:2 + a:forca:2 + s:pugilismo | DEFINIDO | Conferida |
| Golpe Colossal | 1 XP | 1 XP | p:armas_conjuracao:2 + a:destreza:1 + a:agilidade:1 + s:golpe-fulminante + s:armas-leves OU p:armas_conjuracao:2 + a:destreza:1 + a:agilidade:1 + s:golpe-fulminante + s:armas-medias OU p:armas_conjuracao:2 + a:destreza:1 + a:agilidade:1 + s:golpe-fulminante + s:armas-pesadas OU p:armas_conjuracao:2 + a:destreza:1 + a:agilidade:1 + s:golpe-fulminante + s:maestria-manejo-duplo OU p:armas_conjuracao:2 + a:destreza:1 + a:agilidade:1 + s:golpe-fulminante + s:pugilismo | DEFINIDO | Conferida |
| Pugilismo | 1 XP | 1 XP | p:armas_conjuracao:1 + a:forca:2 + a:destreza:1 | DEFINIDO | Corrigida |
| Artista Marcial | 1 XP | 1 XP | p:armas_conjuracao:2 + a:destreza:2 + s:pugilismo | DEFINIDO | Corrigida |
| Perícia em Arremesso de Armas | 1 XP | 1 XP | a:forca:2 + a:destreza:2 + a:agilidade:1 + s:armas-leves OU a:forca:2 + a:destreza:2 + a:agilidade:1 + s:armas-medias OU a:forca:2 + a:destreza:2 + a:agilidade:1 + s:armas-pesadas | DEFINIDO | Corrigida |
| Disparo Fulminante | 1 XP | 1 XP | p:armas_conjuracao:2 + a:destreza:2 + a:forca:1 + s:armas-longo-alcance OU p:armas_conjuracao:2 + a:destreza:2 + a:forca:1 + s:maestria-arremesso-armas | DEFINIDO | Conferida |
| Disparo Múltiplo | 1 XP | 1 XP | p:armas_conjuracao:2 + a:destreza:2 + a:agilidade:2 + s:armas-longo-alcance + s:disparo-fulminante OU p:armas_conjuracao:2 + a:destreza:2 + a:agilidade:2 + s:maestria-arremesso-armas + s:disparo-fulminante | DEFINIDO | Corrigida |
| Recuperação Vigorosa | Pendente | Pendente | a:vigor:3 | PENDENTE | Conferida |
| Maestria em Recuperação Vigorosa em Movimento | Pendente | Pendente | a:vigor:6 + s:recuperacao-vigorosa | PENDENTE | Conferida |
| Recobrar Coragem | 1 XP | 1 XP | Sem requisito adicional | DEFINIDO | Conferida |
| Perícia em Manejo Duplo | 1 XP | 1 XP | a:forca:2 + a:destreza:2 + a:agilidade:1 + s:disciplina-avancada + s:armas-leves OU a:forca:2 + a:destreza:2 + a:agilidade:1 + s:disciplina-avancada + s:armas-medias OU a:forca:2 + a:destreza:2 + a:agilidade:1 + s:disciplina-avancada + s:armas-pesadas OU a:forca:2 + a:destreza:2 + a:agilidade:1 + s:disciplina-avancada + s:maestria-arremesso-armas OU a:forca:2 + a:destreza:2 + a:agilidade:1 + s:disciplina-avancada + s:armas-fogo OU a:forca:2 + a:destreza:2 + a:agilidade:1 + s:disciplina-avancada + s:armas-longo-alcance | DEFINIDO | Corrigida |
| Instinto de Sobrevivência | Pendente | Pendente | a:vigor:3 | PENDENTE | Conferida |
| Maestria Arma Certa | Pendente | Pendente | Sem requisito adicional | PENDENTE | Conferida |
| Criar Veneno | 1 XP | 1 XP | p:artesao:1 + a:inteligencia:2 + k:alquimia:2 + k:medicina:2 | DEFINIDO | Corrigida |
| Criar Antídoto | 1 XP | 1 XP | p:artesao:1 + a:inteligencia:2 + k:alquimia:2 + k:medicina:2 + s:criar-veneno | DEFINIDO | Conferida |
| Transfusão | Pendente | Pendente | Sem requisito adicional | PENDENTE | Conferida |
| Transfusão Sanguinária (protótipo) | Ausente | 1 XP | s:transfusao + s:sangue | DEFINIDO | Adicionada |
| Perícia em Armas de Longo Alcance | 2 XP | 2 XP | p:armas_conjuracao:1 + a:destreza:2 | DEFINIDO | Corrigida |
| Disparo Violento | 1 XP | 1 XP | p:armas_conjuracao:2 + a:destreza:2 + a:forca:2 + s:armas-longo-alcance OU p:armas_conjuracao:2 + a:destreza:2 + a:forca:1 + p:atletismo:1 + s:armas-longo-alcance OU p:armas_conjuracao:2 + a:destreza:2 + a:forca:2 + s:maestria-arremesso-armas OU p:armas_conjuracao:2 + a:destreza:2 + a:forca:1 + p:atletismo:1 + s:maestria-arremesso-armas | DEFINIDO | Conferida |
| Disparo Tático | Pendente | Pendente | Sem requisito adicional | PENDENTE | Conferida |
| Perícia em Armas de Fogo | 3 XP | 3 XP | p:armas_conjuracao:2 + a:destreza:2 | DEFINIDO | Corrigida |
| Olhos de Águia | 1 XP | 1 XP | a:destreza:3 + p:armas_conjuracao:3 + s:armas-longo-alcance OU a:destreza:3 + p:armas_conjuracao:3 + s:armas-fogo | DEFINIDO | Conferida |
| Golpe Baixo | 1 XP | 1 XP | a:destreza:2 + a:forca:1 + a:agilidade:1 | DEFINIDO | Conferida |
| Perícia em Furtividade | 1 XP | 1 XP | p:furtividade:2 + a:destreza:2 + a:agilidade:1 | DEFINIDO | Conferida |
| Proteção Avançada | Ausente | 1 XP | k:protecao:2 | DEFINIDO | Adicionada |
| Astronomia Avançada | Ausente | 1 XP | k:astronomia:2 | DEFINIDO | Adicionada |
| Alquimia Avançada | Ausente | 1 XP | k:alquimia:2 | DEFINIDO | Adicionada |
| Engenharia Avançada | Ausente | 1 XP | k:engenharia:2 | DEFINIDO | Adicionada |
| Erudição Avançada | Ausente | 1 XP | k:erudicao:2 | DEFINIDO | Adicionada |
| Atletismo Avançado | Ausente | 1 XP | p:atletismo:2 | DEFINIDO | Adicionada |
| Artesão Avançado | Ausente | 1 XP | p:artesao:2 | DEFINIDO | Adicionada |
| Apresentação Avançada | Ausente | 1 XP | p:apresentacao:2 | DEFINIDO | Adicionada |
| Coleta Avançada | Ausente | 1 XP | p:coleta:2 | DEFINIDO | Adicionada |
| Medicina Avançada | Ausente | 1 XP | k:medicina:2 | DEFINIDO | Adicionada |
| Furtividade Avançada | 1 XP | 1 XP | p:furtividade:2 + s:furtividade | DEFINIDO | Conferida |
| Domar Criatura Pequena | 1 XP | 1 XP | a:influencia:2 + a:inteligencia:1 + p:apresentacao:1 | DEFINIDO | Corrigida |
| Domar Criatura Média | 1 XP | 1 XP | a:influencia:3 + a:inteligencia:1 + p:apresentacao:1 + s:domar-criatura-pequena | DEFINIDO | Corrigida |
| Domar Criatura Grande | 1 XP | 1 XP | a:influencia:4 + a:inteligencia:1 + p:apresentacao:1 + s:domar-criatura-pequena + s:domar-criatura-media | DEFINIDO | Corrigida |
| Invocação Elemental | 1 XP | 1 XP | s:criar-item-foco-magia + s:domar-criatura-pequena | DEFINIDO | Corrigida |
| Perícia Druídica | 2 XP | 1 XP | s:criar-item-foco-magia + s:terra | DEFINIDO | Corrigida |
| Transformação Elemental | Ausente | 1 XP | s:criar-item-foco-magia + s:vento OU s:criar-item-foco-magia + s:agua OU s:criar-item-foco-magia + s:terra OU s:criar-item-foco-magia + s:fogo OU s:criar-item-foco-magia + s:sagrado OU s:criar-item-foco-magia + s:sangue OU s:criar-item-foco-magia + s:trevas OU s:criar-item-foco-magia + s:veneno | DEFINIDO | Adicionada |
| Artes Marciais | 1 XP | 1 XP | p:armas_conjuracao:1 | LEGADO | Conferida |
| Combinação de Fontes | 2 XP | 2 XP | Sem requisito adicional | LEGADO | Conferida |

## Construção e validação

As definições de Perícias são geradas do código oficial fixado no commit de origem, revisadas contra o SRD ativo e consumidas pelo mesmo catálogo em DNA, ficha e Compendium. O comparativo verifica o catálogo inteiro e também executa a função clássica skillReq do site em 128 fichas humanas por Perícia comprável, além dos casos de alternativa e de cada requisito ausente.

Para preparar as ferramentas, use Node.js 24 e execute `npm ci --prefix foundry-prototype --ignore-scripts`. Os Compendiums usam o mesmo formato ClassicLevel 3 do Foundry 14.367. Para reproduzir as bases em uma pasta nova, execute `node foundry-prototype/scripts/build-compendiums.mjs --out <pasta-nova>`. O parâmetro `--foundry <App/resources/app>` permite usar a biblioteca do próprio Foundry. A geração mantém os IDs por chave canônica. Uma atualização substitui o pacote de definições, com backup da instalação anterior, e conserva os Items existentes nos Actors.

A compra de Fogo e Improviso foi realizada no DNA por jogador, com Narrador conectado, saldo de 15 para 11 e depois 9 XP. O teste nativo detectou e permitiu corrigir uma regressão de migração em atualizações parciais. A consulta pela ficha de Perícia nativa mostrou os requisitos sem Foco. O teste de conjuração confirmou a fonte ambiental, o bônus de Improviso, o fluxo normal de dados e o chat sem PP. O arrasto de equipamento foi recusado ao jogador e permitido ao Narrador sem custo oculto. Uma compra adicional na Loja debitou VT. Arma habilitada rolou um dado de equipamento e arma sem Perícia foi bloqueada.

O teste com dois clientes confirmou a rolagem contra um NPC, a DE reservada, um único dado de arma habilitado, a recuperação da rolagem pendente após reconexão e uma única publicação no chat. Em outro caso, a compra da Druídica exigiu Foco e Terra, dispensou Domar e permitiu a forma Grande por 1 Coragem. A forma bloqueou conjuração e a reversão conservou os graus permanentes.

## Resultado da instalação

- **Foundry portátil 14.367, Codex RPG 0.2.1.16.** O instalador foi executado com Node.js 24.16.0 e o Setup reconheceu a versão. Os 108 arquivos distribuídos conferiram com o ZIP extraído. Os 89 arquivos da versão anterior conferiram com o backup.
- **Testes automatizados.** 101 testes do Foundry e 6 testes web da Loja passaram. A suíte lê as bases LevelDB distribuídas e compara os documentos com o catálogo. O instalador foi testado com arquivos pessoais na raiz e em subpastas, colisão entre arquivo e pasta, pasta bloqueada pelo Windows e atualização sobre uma base de Compendium já usada. Nessa troca, o registro da base antiga permanece no backup e os arquivos pessoais adicionais acompanham a base nova.
- **Teste no Foundry.** Depois do reinício do mundo de QA, XP, Perícias, compras, devoluções, munição, Integridade, dados personalizados e IDs dos Compendiums conferiram com o estado anterior. Uma cópia de Codex Primeiro também abriu com os 2 Actors, 5 Items incorporados e 1 Item global do backup. As capturas de DNA, ficha consultável, Compendiums e alvo reservado foram feitas no Foundry.
- **Dados preservados.** Bancos e manifestos de mundos, arquivos de configuração e `storage` foram comparados antes e depois da troca. O playtest e a abertura da cópia usaram User Data isolada. Na primeira abertura da campanha original com o Narrador ativo, o sistema registra a migração histórica documentada acima.
- **Backups na User Data portátil.** Sistema 0.2.1.15 em `Backups/codex-rpg-system-installer/2026-11-19T04-47-01-135Z-HbQZ8Z/codex-rpg-foundry`. Mundo Codex e configurações em `Backups/codex-rpg-audit-data/20261119-044656`.
- **Pacote validado.** `codex-rpg-foundry.zip`, SHA-256 `26c5c0dc2dbad5488d970fa0895dbf7918ec6df4f8e11867463b7c0351c78bf1`.

## Pendências de procedimento

Permanecem sob adjudicação os aprimoramentos animais fora da composição expressa, o aumento e a repartição de dano/ Vida nas transformações e sucessões, a unidade e as fontes/DE da duração Elemental, frações de dano de resistência, custos de aquisição ainda nulos, critérios de dano dobrado elemental, efeitos individuais de Maestrias adiadas, múltiplos alvos e geometria/frente de escudos, além dos detalhes de Hemomancia, fabricação e condições que o SRD mantém abertos. Os verbetes disponíveis explicitam as restrições. A condição manual de um efeito consta no Compendium e não concede dados ou símbolos por mera presença do Item.
