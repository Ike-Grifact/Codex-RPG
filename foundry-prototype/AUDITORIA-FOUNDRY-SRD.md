# Auditoria Codex RPG para Foundry VTT v14

Candidato de playtest 0.2.1.11, tag prevista `foundry-playtest-v0.2.1.11`. Base Foundry do PR #4 em `94215ce`; site e continuidade em `4824e3b`, sucessor de `4354ed1` e `aa2ba31`. Referências de precedência em [SRD v0.51](../docs/srd-continuidade-v0.51.md), [SRD v0.50](../docs/srd-continuidade-v0.50.md), [SRD v0.49](../docs/srd-continuidade-v0.49.md), [Livro do Jogador](../docs/livro-do-jogador.md) e [Livro do Mestre](../docs/livro-do-mestre.md).

## Matriz funcional

| Funcionalidade | Site atual | SRD | Foundry 0.2.1.10 | Diferença e correção | Estado no candidato |
| --- | --- | --- | --- | --- | --- |
| Codex Genético | Núcleo e constelações; mapa SVG com câmera | Famílias temáticas organizam o mapa; requisitos vêm das regras | Mapa anterior, estilos Foundry e compra nativa | Mesma fonte do site no ZIP, dez famílias, CSS preto/dourado e linhas reais de requisitos | Implementado |
| Compra de Perícias | 52 registros, 50 visíveis; comparação por ID abaixo | Custo e requisitos por Perícia; futuras e legadas exigem tratamento distinto | 39 registros; faltavam Domar, Druídica, Invocação e outras | 52 registros web e duas entradas históricas exclusivas. Futuros aparecem bloqueados, legados aparecem a quem os possui | Implementado para compra e persistência |
| Invocação Elemental | Compra e funções verificáveis de porte, partes, divisão e ação | v0.49 §0-AL: foco habilita Psique, Domar por porte, 1 XP e ativação 1 PP ou 1 Coragem | Ausente | Compra nativa e planejador de habilitações, recursos, dados e divisão exata com DE preservada; usa funções compartilhadas com o site | Parcial: Narrador mantém a ficha ativa, resolve ação conjunta, área, encarnação, controle e dissipação |
| Invocação em grupo e projeção | Funções verificam um beneficiário, um turno e dados por porte | Uma ficha por conjurador, uma economia de ações; dano de área normal; corpo imóvel em Psique | Ausente | Planejador apresenta os limites e projeta de 1 a 3 dados. Funções compartilhadas validam a distribuição dos dados em testes | Parcial: execução no mapa, trava da ficha ativa, imobilidade e integração ao rolador dependem do Narrador |
| Invocação com dois elementos e Maestria | Improviso e Maestria com ambas as habilitações | +1 Coragem por segundo elemento, Maestria adicional por 1 PP ou 1 Coragem; Sangue + Trevas é Necromancia | Ausente | Planejamento de pagamentos cumulativos e identificação de Necromancia; divisão inexata gera aviso | Parcial: cobrança, dano, imunidades, resistência e reinvocação ainda manuais |
| Domar e Druídica | Domar por porte, Druídica como compra única, ficha opcional Pequena | Três compras Domar de 1 XP; Druídica custa 2 XP e exige as três, foco, Terra e Influência 2. Duas fichas domesticadas sob controle direto. Restos, saúde da Pequena e transições específicas têm partes pendentes | Ausente do catálogo | As quatro aquisições e dependências entram no Actor. Fichas genéricas de criatura continuam disponíveis | Parcial: vínculo, ficha por porte, transformação e gestão das criaturas são manuais |
| Conjuração | Psique, elementos, foco visual, dados de equipamento e ferramentas de preparação | Gratuidade base condicionada, 1 PP ou Coragem quando aplicável, especializações e restrições próprias; combinação na Invocação exige Improviso e Maestria | Foco e acesso por elemento ligados ao dado extra, características e recursos genéricos | Descrições e requisitos alinhados. Focos reconhecem o ID real do elemento, incluindo Ar, Água e Psique. Planejamento de combinação restrito à Invocação | Parcial: efeitos de elemento, condições, Escudo, recargas, amplificação, Sangue/Trevas/Sagrado e possessão exigem adjudicação |
| d4 e Roll & Keep | d4 E, A, P e vazio; até 9 na pilha. Fluxos web de combinação e comparação | v0.46 fixa as quatro faces e mantém a face numérica 4 para crítico | d4 anterior; retenção, comparador, runas, autorização e resolução nativas | d4 homologado, texturas geradas e versão da rolagem prévia preservada | Implementado; escolha das fontes no Foundry conserva adaptações aprovadas do PR |
| Seleção de fontes | Atributo e formação como padrão visual; complementos por Perícia | Pertinência, habilitação para complementos e regras próprias de criaturas | Modos Jogar/Editar, cartões compactos, categorias distintas e bloqueio Disciplina sem Atributo | Preservado; combinação Conhecimento + Prática sem Disciplina mantém o fluxo autorizado no PR | Implementado no escopo local |
| Saúde | Quatro faixas e modificadores/custo no jogador | Base 4 + Vigor + piso(Força/2); Pavor da Saúde conta para DE. Recuperação lenta tem prazos e lacunas | Base 3, texto de recuperação antigo | Vida máxima e estado corrigidos; personagens aplicam penalidades e cobram Coragem uma vez na confirmação. Vida corrente existente preservada | Parcial: não cobra Saúde automaticamente para NPCs e monstros; recuperação segue adjudicação |
| XP inicial e progressão | 20 XP experimentais compartilhados; nível independente e previsão de progressão | Um Atributo G1 e um Conhecimento OU Prática G1; saldo livre na criação. Progressão e XP por ameaça seguem a tabela pertinente | Orçamento único e compras no Actor; XP extra é editável | Compras passam pela autoridade do Narrador; custos históricos preservados | Parcial: orçamento e requisitos funcionam; progressão avançada e XP de criaturas por porte não são integralmente automatizados |
| Equipamento, VT, armadura e DE | Catálogo G1, inventário, VT, Redução/Integridade, distinção de Defesa e Esquiva | Armaduras G1 −3 de Integridade sobre tabela inicial, DE específica de esquiva; consequências dependem do tipo | Equipamento nativo, carga, migração de armadura G1 com dano preservado e DE de Token | Preservado. Transferência de dano e consequências continua com Narrador | Parcial: fórmulas existentes disponíveis; VT/consumo, reparos e condições especiais sem automação integral |
| Pavor e oportunidades | Reservas, efeitos simbólicos, descarte e funções de teste no simulador | Teto público 2 + jogadores, reservas locais e excedente do Narrador sem tarifa autoral definitiva | HUD, crítico local/público, Pavor residual, chat e autoridade GM | Preservado; critérios de intervenção excedente e tarifa continuam com Narrador | Parcial |
| Antecipação e Concentração Refinada | Verbetes atualizados e aquisição de Concentração Refinada; reserva anotada pela mesa | v0.51 define conversão ao guardar e expiração até uso, próxima ação ou descanso longo. Refinada exige Disciplina G2, 1 XP e ausência de inimigo até 8 m | Anular, converter e passar oportunidade; sem Antecipação persistente | Aquisição, requisito e descrição atualizados | Parcial: reserva, expiração fora da rolagem e alcance do inimigo adjudicados pelo Narrador |
| Olhos de Águia | Compra e alcance efetivo no inventário | v0.51 §0-AN: 1 XP, Destreza 3 + Disciplina 3 + uma das duas especializações; +8 m com habilitação pertinente | Ausente | Compra e alcance efetivo no inventário e na preparação, sem gravar no Item um alcance base diferente | Parcial: a medida e as penalidades no mapa continuam adjudicadas |
| Perícias de combate | Catálogo com arremesso, disparo, Golpe Colossal e efeitos específicos | Ataque comum tem alvo principal; técnicas cobram recursos e podem comparar a mesma rolagem com DE de cada alvo | Dado extra habilitado, alvo primário, características, DE reservada e publicação idempotente | Aquisição e requisitos sincronizados, preservado o fluxo de um alvo | Parcial: técnicas específicas e alvos adicionais ainda manuais |
| Actor, Item, chat, multiplayer | Importação e exportação no criador web | Persistência respeita a ficha e a mesa | Cinco tipos de Actor, Item, importação, armazenamento, chat e reconexão nativos | Atualização parcial de Actor preserva os campos irmãos quando a rolagem altera recursos e registra a publicação em uma gravação | Implementado no escopo anterior; telas estreitas verificadas separadamente |
| Versão, ZIP e atualização | `main` tem protótipo anterior 0.2.0 | Procedimento do repositório protege o canal estável | PR #4 playtest 0.2.1.10 e instalador com backup | Candidato 0.2.1.11 construído pelo script, manifesto e ZIP verificados | Implementado em User Data de teste; portátil principal aguarda aprovação |

## Catálogo por ID

O custo apresentado como “pendente” mantém a Perícia visível nas ramificações futuras e bloqueia a aquisição. “Legado” permite exibição para quem já possui a Perícia e preserva seu ID. Recuperação Vigorosa mantém 1 XP no histórico dos Actors Foundry que já a adquiriram, e novas compras aguardam o custo autoral. Os nomes, custos e textos web vigentes são comparados literalmente em `tests/dna-layout.test.mjs`. Os requisitos em alternativas cumulativas constam em [skill-catalog.mjs](module/skill-catalog.mjs). Descrição no catálogo e aquisição de uma Perícia não representam automação do seu efeito.

| ID | Perícia | 0.2.1.10 | Compra no candidato | Requisitos |
| --- | --- | --- | --- | --- |
| `combate` | Combate | Ausente | Legado | — |
| `armas` | Armas 1 | Ausente | Legado | — |
| `montar` | Montar Animal | Presente | 2 XP | A influencia:2 |
| `provocacao-sofisticada` | Provocação Sofisticada | Presente | 1 XP | A influencia:2 |
| `criar-item-foco-magia` | Criar Item de Foco e Magia | Descrição anterior | 1 XP | P armas_conjuracao:1 + A inteligencia:1 + P artesao:1 |
| `escudo-arcano` | Escudo Arcano | Descrição anterior | 1 XP | A inteligencia:2 + A vigor:1 + criar-item-foco-magia |
| `conjuracao-equilibrada` | Conjuração Refinada | Descrição anterior | 1 XP | P armas_conjuracao:2 + A inteligencia:2 + A destreza:2 + criar-item-foco-magia |
| `improviso` | Improviso Elemental | Presente | 1 XP | P armas_conjuracao:1 + A inteligencia:1 + A destreza:1 + criar-item-foco-magia |
| `mestre` | Maestria Elemental | Descrição anterior | 1 XP | P armas_conjuracao:3 + A inteligencia:3 + A destreza:3 + criar-item-foco-magia + improviso + vento ou P armas_conjuracao:3 + A inteligencia:3 + A destreza:3 + criar-item-foco-magia + improviso + sangue ou P armas_conjuracao:3 + A inteligencia:3 + A destreza:3 + criar-item-foco-magia + improviso + agua ou P armas_conjuracao:3 + A inteligencia:3 + A destreza:3 + criar-item-foco-magia + improviso + fogo ou P armas_conjuracao:3 + A inteligencia:3 + A destreza:3 + criar-item-foco-magia + improviso + terra ou P armas_conjuracao:3 + A inteligencia:3 + A destreza:3 + criar-item-foco-magia + improviso + veneno ou P armas_conjuracao:3 + A inteligencia:3 + A destreza:3 + criar-item-foco-magia + improviso + sagrado ou P armas_conjuracao:3 + A inteligencia:3 + A destreza:3 + criar-item-foco-magia + improviso + trevas |
| `fogo` | Perícia em Elemento Fogo | Descrição anterior | 1 XP | P armas_conjuracao:1 + A inteligencia:1 + criar-item-foco-magia |
| `agua` | Perícia em Elemento Água | Descrição anterior | 1 XP | P armas_conjuracao:1 + A inteligencia:1 + criar-item-foco-magia |
| `vento` | Perícia em Elemento Ar | Descrição anterior | 1 XP | P armas_conjuracao:1 + A inteligencia:1 + criar-item-foco-magia |
| `terra` | Perícia em Elemento Terra | Descrição anterior | 1 XP | P armas_conjuracao:1 + A inteligencia:1 + criar-item-foco-magia |
| `sagrado` | Perícia em Elemento Sagrado | Descrição anterior | 2 XP | P armas_conjuracao:2 + A inteligencia:2 + criar-item-foco-magia |
| `veneno` | Perícia em Elemento Veneno | Descrição anterior | 2 XP | P armas_conjuracao:2 + A inteligencia:2 + C alquimia:2 + C medicina:2 |
| `sangue` | Perícia em Elemento Sangue | Descrição anterior | 2 XP | P armas_conjuracao:2 + A inteligencia:2 + criar-item-foco-magia |
| `trevas` | Perícia em Elemento Trevas | Descrição anterior | 2 XP | P armas_conjuracao:2 + A inteligencia:2 + criar-item-foco-magia |
| `armas-leves` | Perícia em Armas Leves | Presente | 2 XP | P armas_conjuracao:1 |
| `armas-medias` | Perícia em Armas Médias | Presente | 2 XP | P armas_conjuracao:1 + A forca:1 |
| `armas-pesadas` | Perícia em Armas Pesadas | Presente | 2 XP | P armas_conjuracao:2 + A forca:2 |
| `disciplina-avancada` | Disciplina Avançada | Descrição anterior | 1 XP | P armas_conjuracao:2 |
| `concentracao-refinada` | Concentração Refinada | Ausente | 1 XP | P armas_conjuracao:2 |
| `manejo-perfeito` | Manejo Perfeito — Armas Corpo a Corpo | Ausente | Pendente | A destreza:2 + disciplina-avancada |
| `golpe-fulminante` | Golpe Fulminante | Presente | 1 XP | P armas_conjuracao:2 + A forca:2 + armas-leves ou P armas_conjuracao:2 + A forca:2 + armas-medias ou P armas_conjuracao:2 + A forca:2 + armas-pesadas ou P armas_conjuracao:2 + A forca:2 + maestria-manejo-duplo ou P armas_conjuracao:2 + A forca:2 + pugilismo |
| `espalhar-golpe` | Golpe Colossal | Presente | 1 XP | P armas_conjuracao:2 + A destreza:1 + A agilidade:1 + golpe-fulminante + armas-leves ou P armas_conjuracao:2 + A destreza:1 + A agilidade:1 + golpe-fulminante + armas-medias ou P armas_conjuracao:2 + A destreza:1 + A agilidade:1 + golpe-fulminante + armas-pesadas ou P armas_conjuracao:2 + A destreza:1 + A agilidade:1 + golpe-fulminante + maestria-manejo-duplo ou P armas_conjuracao:2 + A destreza:1 + A agilidade:1 + golpe-fulminante + pugilismo |
| `pugilismo` | Pugilismo | Descrição anterior | 1 XP | P armas_conjuracao:1 + A forca:2 + A destreza:1 |
| `artista-marcial` | Artista Marcial | Descrição anterior | 1 XP | P armas_conjuracao:2 + A destreza:2 + pugilismo |
| `maestria-arremesso-armas` | Perícia em Arremesso de Armas | Descrição anterior | 1 XP | A forca:2 + A destreza:2 + A agilidade:1 + armas-leves ou A forca:2 + A destreza:2 + A agilidade:1 + armas-medias ou A forca:2 + A destreza:2 + A agilidade:1 + armas-pesadas |
| `disparo-fulminante` | Disparo Fulminante | Presente | 1 XP | P armas_conjuracao:2 + A destreza:2 + A forca:1 + armas-longo-alcance ou P armas_conjuracao:2 + A destreza:2 + A forca:1 + maestria-arremesso-armas |
| `disparo-multiplo` | Disparo Múltiplo | Descrição anterior | 1 XP | P armas_conjuracao:2 + A destreza:2 + A agilidade:2 + armas-longo-alcance + disparo-fulminante ou P armas_conjuracao:2 + A destreza:2 + A agilidade:2 + maestria-arremesso-armas + disparo-fulminante |
| `recuperacao-vigorosa` | Recuperação Vigorosa | Custo anterior 1 XP | Pendente | A vigor:3 |
| `recuperacao-movimento` | Maestria em Recuperação Vigorosa em Movimento | Ausente | Pendente | A vigor:6 + recuperacao-vigorosa |
| `recobrar-coragem` | Recobrar Coragem | Presente | 1 XP | — |
| `maestria-manejo-duplo` | Perícia em Manejo Duplo | Descrição anterior | 1 XP | A forca:2 + A destreza:2 + A agilidade:1 + disciplina-avancada + armas-leves ou A forca:2 + A destreza:2 + A agilidade:1 + disciplina-avancada + armas-medias ou A forca:2 + A destreza:2 + A agilidade:1 + disciplina-avancada + armas-pesadas ou A forca:2 + A destreza:2 + A agilidade:1 + disciplina-avancada + maestria-arremesso-armas ou A forca:2 + A destreza:2 + A agilidade:1 + disciplina-avancada + armas-fogo ou A forca:2 + A destreza:2 + A agilidade:1 + disciplina-avancada + armas-longo-alcance |
| `instinto-sobrevivencia` | Instinto de Sobrevivência | Ausente | Pendente | A vigor:3 |
| `arma-certa` | Maestria Arma Certa | Ausente | Pendente | — |
| `criar-veneno` | Criar Veneno | Presente | 1 XP | P artesao:1 + A inteligencia:2 + C alquimia:2 + C medicina:2 |
| `criar-antidoto` | Criar Antídoto | Presente | 1 XP | P artesao:1 + A inteligencia:2 + C alquimia:2 + C medicina:2 + criar-veneno |
| `transfusao` | Transfusão | Ausente | Pendente | — |
| `armas-longo-alcance` | Perícia em Armas de Longo Alcance | Descrição anterior | 2 XP | P armas_conjuracao:1 + A destreza:2 |
| `disparo-violento` | Disparo Violento | Presente | 1 XP | P armas_conjuracao:2 + A destreza:2 + A forca:2 + armas-longo-alcance ou P armas_conjuracao:2 + A destreza:2 + A forca:1 + P atletismo:1 + armas-longo-alcance ou P armas_conjuracao:2 + A destreza:2 + A forca:2 + maestria-arremesso-armas ou P armas_conjuracao:2 + A destreza:2 + A forca:1 + P atletismo:1 + maestria-arremesso-armas |
| `disparo-tatico` | Disparo Tático | Ausente | Pendente | — |
| `armas-fogo` | Perícia em Armas de Fogo | Presente | 3 XP | P armas_conjuracao:2 + A destreza:2 |
| `olhos-de-aguia` | Olhos de Águia | Ausente | 1 XP | A destreza:3 + P armas_conjuracao:3 + armas-longo-alcance ou A destreza:3 + P armas_conjuracao:3 + armas-fogo |
| `golpe-baixo` | Golpe Baixo | Presente | 1 XP | A destreza:2 + A forca:1 + A agilidade:1 |
| `furtividade` | Perícia em Furtividade | Presente | 1 XP | P furtividade:2 + A destreza:2 + A agilidade:1 |
| `furtividade-avancada` | Furtividade Avançada | Presente | 1 XP | P furtividade:2 + furtividade |
| `domar-criatura-pequena` | Domar Criatura Pequena | Ausente | 1 XP | A influencia:2 + A inteligencia:1 + P apresentacao:1 |
| `domar-criatura-media` | Domar Criatura Média | Ausente | 1 XP | A influencia:3 + A inteligencia:1 + P apresentacao:1 |
| `domar-criatura-grande` | Domar Criatura Grande | Ausente | 1 XP | A influencia:4 + A inteligencia:1 + P apresentacao:1 |
| `invocacao-elemental` | Invocação Elemental | Ausente | 1 XP | criar-item-foco-magia + domar-criatura-pequena |
| `pericia-druidica` | Perícia Druídica | Ausente | 2 XP | A influencia:2 + criar-item-foco-magia + terra + domar-criatura-pequena + domar-criatura-media + domar-criatura-grande |
| `marciais` | Artes Marciais | Presente | Legado | P armas_conjuracao:1 |
| `combinacao` | Combinação de Fontes | Presente | Legado | — |

## Instalação e retorno

A primeira instalação deve usar uma User Data de teste. Confira o ID `codex-rpg-foundry` e a versão `0.2.1.11` no manifesto extraído. Faça backup do mundo de teste pelo Setup do Foundry ou copie sua pasta para um destino fora de `Data/worlds` com o servidor fechado. Para instalar a partir do clone na revisão deste PR, execute com Node.js 24:

```powershell
node foundry-prototype/scripts/install.mjs --user-data "CAMINHO_DA_USER_DATA_DE_TESTE" --dry-run
node foundry-prototype/scripts/install.mjs --user-data "CAMINHO_DA_USER_DATA_DE_TESTE"
```

A simulação informa destino, versão e ID. A instalação exige Foundry encerrado e valida o pacote promovido. Guarde o caminho `Backup:` impresso pelo instalador. O ZIP e o manifesto entregues são o mesmo conteúdo verificado em testes. A URL de atualização do manifesto aponta para o canal de playtest e depende da publicação da release correspondente para instalação por URL.

Para restaurar o sistema anterior, encerre o Foundry, confira se o manifesto em `Backup:` tem o ID do sistema e a versão anterior, e confirme que o diretório de destino é exatamente `<User Data>/Data/systems/codex-rpg-foundry`. Mova somente esse diretório para fora de `Data/systems`, mantendo uma cópia da tentativa, e copie para o destino a pasta `codex-rpg-foundry` do backup. Confirme a versão no Setup. Se um mundo já tiver sido aberto com a revisão nova e precisar de reversão, use o backup do próprio mundo pelo Setup. O rollback do pacote não reverte migrações de mundo.

A User Data principal está em `F:/FoundryVTT-WindowsPortable-14.364`. A troca nela exige aprovação e backup próprio antes de repetir o procedimento.
