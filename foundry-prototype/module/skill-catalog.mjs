// Catálogo único revisado contra o SRD ativo. Gerado por scripts/sync-skill-catalog.mjs.
export const SKILLS=[
  {
    "id": "pericia-em-instrumentos",
    "name": "Perícia em Instrumentos",
    "detail": "Meio instrumental para habilidades do Bardo. Efeitos próprios e XP pendentes.",
    "cost": null,
    "legacy": false,
    "family": "apresentacao",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Meio instrumental para habilidades do Bardo. Efeitos próprios e XP pendentes.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Meio instrumental para habilidades do Bardo. Efeitos próprios e XP pendentes.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-em-apresentacao",
    "name": "Maestria em Apresentação",
    "detail": "EXPERIMENTAL — Perícia ÚNICA do Bardo. Requer Apresentação 4, Influência 4, Destreza 4, Apresentação Avançada e Perícia em Instrumentos. Gera até 3A musicais totais de apoio, distribuídos conforme a DE de cada aliado. Repertório interno: Inspiração 3A→1 Coragem, Ressonância Arcana 3A→1 carga de foco, Acorde de Proteção 1A→anula 1P, Acorde Triunfal 2A→1E, passagem de protagonismo, Ritmo Acelerado e Harmonia Musical. Desarmonia após falha com Pavor. Melodia Psíquica é opção condicional com Disciplina 4 + Criar Item de Foco e Magia e instrumento para até dois alvos; procedimentos de alvos pendentes. Custo de aquisição XP PENDENTE.",
    "cost": null,
    "legacy": false,
    "family": "apresentacao",
    "requirements": [
      [
        "p:apresentacao:4",
        "a:influencia:4",
        "a:destreza:4",
        "s:apresentacao-avancada",
        "s:pericia-em-instrumentos"
      ]
    ],
    "state": "EXPERIMENTAL",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "id": "dueto-improvisado",
        "name": "Dueto Improvisado",
        "description": "Transferência dirigida de 1A sem duplicar símbolo",
        "state": "PROPOSTO",
        "conditions": "requisitos e momento pendentes",
        "automation": "manual"
      },
      {
        "id": "contratempo",
        "name": "Contratempo",
        "description": "Interferir na seleção de dados mantidos pelo inimigo",
        "state": "PROPOSTO",
        "conditions": "custo/teste/momento pendentes",
        "automation": "manual"
      },
      {
        "id": "solo-provocador",
        "name": "Solo Provocador",
        "description": "Apresentação para chamar atenção de ameaça",
        "state": "PROPOSTO",
        "conditions": "sem controle mental gratuito",
        "automation": "manual"
      },
      {
        "id": "cancoes-sustentadas",
        "name": "Canções Sustentadas",
        "description": "Sustentar modalidades de ritmo, harmonia ou ressonância",
        "state": "PROPOSTO",
        "conditions": "manutenção, duração e troca pendentes",
        "automation": "manual"
      },
      {
        "id": "ritmo-de-batalha",
        "name": "Ritmo de Batalha",
        "description": "Apoiar enquanto ataca/conjura com ação normalmente habilitada",
        "state": "EXPERIMENTAL",
        "conditions": "resolução de combinação pendente",
        "automation": "manual"
      },
      {
        "id": "inspiracao",
        "name": "Inspiração",
        "description": "3A → 1 Coragem recuperada por aliado",
        "state": "EXPERIMENTAL",
        "conditions": "respeita teto de Coragem",
        "automation": "manual"
      },
      {
        "id": "ressonancia-arcana",
        "name": "Ressonância Arcana",
        "description": "3A → 1 carga de foco de aliado",
        "state": "EXPERIMENTAL",
        "conditions": "respeita capacidade original do foco",
        "automation": "manual"
      },
      {
        "id": "acorde-de-protecao",
        "name": "Acorde de Proteção",
        "description": "1A → anula 1 Pavor mantido por aliado",
        "state": "EXPERIMENTAL",
        "conditions": "antes de finalizar resultado",
        "automation": "manual"
      },
      {
        "id": "acorde-triunfal",
        "name": "Acorde Triunfal",
        "description": "2A → 1 Êxito para aliado",
        "state": "EXPERIMENTAL",
        "conditions": "não retroativo",
        "automation": "manual"
      },
      {
        "id": "compasso-adiantado",
        "name": "Compasso Adiantado",
        "description": "1A para favorecer passagem do protagonismo",
        "state": "EXPERIMENTAL",
        "conditions": "não concede outro turno/ação",
        "automation": "manual"
      },
      {
        "id": "ritmo-acelerado",
        "name": "Ritmo Acelerado",
        "description": "Distribui até 3A totais entre até três aliados, máx. 1A a cada",
        "state": "EXPERIMENTAL",
        "conditions": "",
        "automation": "manual"
      },
      {
        "id": "harmonia-musical",
        "name": "Harmonia Musical",
        "description": "Neutraliza Vantagem/Desvantagem comuns em área 16 × 16 m, inclusive inimigos",
        "state": "EXPERIMENTAL",
        "conditions": "duração/sustentação pendentes",
        "automation": "manual"
      },
      {
        "id": "piada-infame",
        "name": "Piada Infame",
        "description": "Inimigo rerrola um dado e aceita novo resultado",
        "state": "PROPOSTO",
        "conditions": "custo/DE/timing pendentes",
        "automation": "manual"
      },
      {
        "id": "elevacao-harmonica",
        "name": "Elevação Harmônica",
        "description": "Elevar um dado de aliado",
        "state": "PROPOSTO",
        "conditions": "custo/teto/momento pendentes, nunca d20",
        "automation": "manual"
      },
      {
        "id": "acao-em-conjunto-musical",
        "name": "Ação em Conjunto",
        "description": "Proposta anterior de +1E e +1A com Apresentação + Disciplina + Influência",
        "state": "PROPOSTO",
        "conditions": "não libera duas Práticas em mesma pilha",
        "automation": "manual"
      },
      {
        "id": "presenca-de-palco",
        "name": "Presença de Palco",
        "description": "Proposta anterior de +1E em Apresentações",
        "state": "PROPOSTO",
        "conditions": "não é bônus geral de ataque",
        "automation": "manual"
      },
      {
        "id": "melodia-psiquica",
        "name": "Melodia Psíquica",
        "description": "Intenção autoral: utilizar instrumento para canalizar efeitos de armas OU psíquicos em até dois alvos, preservando as Perícias, equipamentos, habilitações, dados, recursos e Graus que o personagem já possui.",
        "state": "EXPERIMENTAL",
        "conditions": "EXPERIMENTAL. Para utilizar a opção Melodia Psíquica da Maestria, o Bardo deve cumprir Disciplina 4 + Criar Item de Foco e Magia (a Perícia vigente que substitui a referência informal “Criar Magia”), além de utilizar instrumento. Não há compra independente de Melodia Psíquica neste playtest consolidado. PROPOSTO para o teste mais conservador: uma única ação e uma única rolagem, avaliando separadamente a DE de cada alvo; nenhum novo ataque ou dano duplicado é gerado automaticamente. PENDENTE: alcance, duplicação ou divisão de E/P e dano, propriedades de arma transmitidas pelo instrumento, interação com cargas e tempo de conjuração, alvo aliado versus inimigo, interrupção e custo de uso. Não automatizar Melodia Psíquica antes dessa definição.",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "voz-encantadora",
    "name": "Voz Encantadora",
    "detail": "EXPERIMENTAL: Influência 4 + Apresentação 4 + Vigor 3. Voz substitui instrumento para apresentações comuns, sem substituir instrumentos específicos da Melodia Psíquica. XP pendente.",
    "cost": null,
    "legacy": false,
    "family": "apresentacao",
    "requirements": [
      [
        "a:influencia:4",
        "p:apresentacao:4",
        "a:vigor:3"
      ]
    ],
    "state": "EXPERIMENTAL",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "EXPERIMENTAL: Influência 4 + Apresentação 4 + Vigor 3. Voz substitui instrumento para apresentações comuns, sem substituir instrumentos específicos da Melodia Psíquica. XP pendente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "EXPERIMENTAL: Influência 4 + Apresentação 4 + Vigor 3. Voz substitui instrumento para apresentações comuns, sem substituir instrumentos específicos da Melodia Psíquica. XP pendente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maos-leves",
    "name": "Mãos Leves",
    "detail": "1 XP. Requisitos: Furtividade 3 + Disciplina 3 + Proteção 2. Em combate, remove itens de inventário inimigo (armas, escudos ou armaduras), rolando Disciplina + Furtividade. DE = DE inimiga + Grau do item + peso, somente se equipado. Ex.: DE 3 + item G1 equipado Leve = DE 5; Médio = DE 6. A combinação de duas Práticas é exceção específica desta Perícia e não é habilitada genericamente.",
    "cost": 1,
    "legacy": false,
    "family": "furtividade",
    "requirements": [
      [
        "p:furtividade:3",
        "p:armas_conjuracao:3",
        "k:protecao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisitos: Furtividade 3 + Disciplina 3 + Proteção 2. Em combate, remove itens de inventário inimigo (armas, escudos ou armaduras), rolando Disciplina + Furtividade. DE = DE inimiga + Grau do item + peso, somente se equipado. Ex.: DE 3 + item G1 equipado Leve = DE 5; Médio = DE 6. A combinação de duas Práticas é exceção específica desta Perícia e não é habilitada genericamente.",
        "kind": "passivo ou condicionado",
        "activation": "Teste de Disciplina + Furtividade; confirmação do Narrador para inventário/DE.",
        "conditions": "1 XP. Requisitos: Furtividade 3 + Disciplina 3 + Proteção 2. Em combate, remove itens de inventário inimigo (armas, escudos ou armaduras), rolando Disciplina + Furtividade. DE = DE inimiga + Grau do item + peso, somente se equipado. Ex.: DE 3 + item G1 equipado Leve = DE 5; Médio = DE 6. A combinação de duas Práticas é exceção específica desta Perícia e não é habilitada genericamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "pericia-armadilha",
    "name": "Perícia em Armadilha",
    "detail": "1 XP. Requisitos: Artesão 1 + Disciplina 1 + Engenharia 1 + Destreza 1 + Inteligência 1 + Proteção 2 + Furtividade 1. Concede Vantagem ao armar ou desarmar armadilhas; os testes utilizam Proteção. Vantagem segue a regra geral de +1A e não concede dado extra.",
    "cost": 1,
    "legacy": false,
    "family": "furtividade",
    "requirements": [
      [
        "p:artesao:1",
        "p:armas_conjuracao:1",
        "k:engenharia:1",
        "a:destreza:1",
        "a:inteligencia:1",
        "k:protecao:2",
        "p:furtividade:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos: Artesão 1 + Disciplina 1 + Engenharia 1 + Destreza 1 + Inteligência 1 + Proteção 2 + Furtividade 1. Concede Vantagem ao armar ou desarmar armadilhas; os testes utilizam Proteção. Vantagem segue a regra geral de +1A e não concede dado extra.",
        "kind": "ativo ou narrativo",
        "activation": "Vantagem contextual (+1A) em teste com Proteção para armar ou desarmar armadilhas.",
        "conditions": "1 XP. Requisitos: Artesão 1 + Disciplina 1 + Engenharia 1 + Destreza 1 + Inteligência 1 + Proteção 2 + Furtividade 1. Concede Vantagem ao armar ou desarmar armadilhas; os testes utilizam Proteção. Vantagem segue a regra geral de +1A e não concede dado extra.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "golpe-furtivo",
    "name": "Golpe Furtivo",
    "detail": "1 XP. Requisitos: Disciplina 2 + Furtividade 2. Ao atacar furtivamente, adiciona mais um dado da arma à pilha, respeitando o limite geral de dados e a habilitação da arma. Não adiciona dado ao ataque que não seja furtivo nem converte dado em dano automático.",
    "cost": 1,
    "legacy": false,
    "family": "furtividade",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "p:furtividade:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisitos: Disciplina 2 + Furtividade 2. Ao atacar furtivamente, adiciona mais um dado da arma à pilha, respeitando o limite geral de dados e a habilitação da arma. Não adiciona dado ao ataque que não seja furtivo nem converte dado em dano automático.",
        "kind": "passivo ou condicionado",
        "activation": "Dado da arma adicional no ataque furtivo; sem custo de Coragem informado.",
        "conditions": "1 XP. Requisitos: Disciplina 2 + Furtividade 2. Ao atacar furtivamente, adiciona mais um dado da arma à pilha, respeitando o limite geral de dados e a habilitação da arma. Não adiciona dado ao ataque que não seja furtivo nem converte dado em dano automático.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "bioetica",
    "name": "Bioética",
    "detail": "1 XP. Requisitos: Alquimia 3 + Inteligência 3 + Destreza 3 + Perícia em Sangue + Criar Item de Foco e Magia + outra Perícia Elemental + Domar Criatura Média. Permite criar homúnculos: criaturas elementais de carne formadas pela mistura do DNA de duas outras criaturas. Destreza 3 confirmada. O homúnculo usa ficha própria, separada da ficha do criador, com XP próprio igual ao XP total atual do criador, seguindo as regras e tabelas de Atributos das criaturas domadas conforme porte. A criação exige sangue e tecidos vivos. Porte e quantidades de materiais permanecem pendentes.",
    "cost": 1,
    "legacy": false,
    "family": "alquimia",
    "requirements": [
      [
        "k:alquimia:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:sangue",
        "s:criar-item-foco-magia",
        "s:vento",
        "s:domar-criatura-media"
      ],
      [
        "k:alquimia:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:sangue",
        "s:criar-item-foco-magia",
        "s:agua",
        "s:domar-criatura-media"
      ],
      [
        "k:alquimia:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:sangue",
        "s:criar-item-foco-magia",
        "s:terra",
        "s:domar-criatura-media"
      ],
      [
        "k:alquimia:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:sangue",
        "s:criar-item-foco-magia",
        "s:fogo",
        "s:domar-criatura-media"
      ],
      [
        "k:alquimia:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:sangue",
        "s:criar-item-foco-magia",
        "s:sagrado",
        "s:domar-criatura-media"
      ],
      [
        "k:alquimia:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:sangue",
        "s:criar-item-foco-magia",
        "s:trevas",
        "s:domar-criatura-media"
      ],
      [
        "k:alquimia:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:sangue",
        "s:criar-item-foco-magia",
        "s:veneno",
        "s:domar-criatura-media"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos: Alquimia 3 + Inteligência 3 + Destreza 3 + Perícia em Sangue + Criar Item de Foco e Magia + outra Perícia Elemental + Domar Criatura Média. Permite criar homúnculos: criaturas elementais de carne formadas pela mistura do DNA de duas outras criaturas. Destreza 3 confirmada. O homúnculo usa ficha própria, separada da ficha do criador, com XP próprio igual ao XP total atual do criador, seguindo as regras e tabelas de Atributos das criaturas domadas conforme porte. A criação exige sangue e tecidos vivos. Porte e quantidades de materiais permanecem pendentes.",
        "kind": "ativo ou narrativo",
        "activation": "Cria homúnculo com ficha própria e XP como Domar Criaturas, conforme porte; materiais e procedimento pendentes.",
        "conditions": "1 XP. Requisitos: Alquimia 3 + Inteligência 3 + Destreza 3 + Perícia em Sangue + Criar Item de Foco e Magia + outra Perícia Elemental + Domar Criatura Média. Permite criar homúnculos: criaturas elementais de carne formadas pela mistura do DNA de duas outras criaturas. Destreza 3 confirmada. O homúnculo usa ficha própria, separada da ficha do criador, com XP próprio igual ao XP total atual do criador, seguindo as regras e tabelas de Atributos das criaturas domadas conforme porte. A criação exige sangue e tecidos vivos. Porte e quantidades de materiais permanecem pendentes.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "pesquisa-avancada-pocoes",
    "name": "Pesquisa Avançada em Poções",
    "detail": "1 XP. Requisitos: Alquimia 3 + Improviso Elemental + Artesão 3 + Destreza 2. Concede +1 Êxito (E) aos testes de criação de poções e habilita a criação de poções elementais. Receitas, custo de materiais, graus e efeitos específicos não foram definidos.",
    "cost": 1,
    "legacy": false,
    "family": "alquimia",
    "requirements": [
      [
        "k:alquimia:3",
        "s:improviso",
        "p:artesao:3",
        "a:destreza:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisitos: Alquimia 3 + Improviso Elemental + Artesão 3 + Destreza 2. Concede +1 Êxito (E) aos testes de criação de poções e habilita a criação de poções elementais. Receitas, custo de materiais, graus e efeitos específicos não foram definidos.",
        "kind": "passivo ou condicionado",
        "activation": "+1E na criação de poções; habilita poções elementais.",
        "conditions": "1 XP. Requisitos: Alquimia 3 + Improviso Elemental + Artesão 3 + Destreza 2. Concede +1 Êxito (E) aos testes de criação de poções e habilita a criação de poções elementais. Receitas, custo de materiais, graus e efeitos específicos não foram definidos.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "corpo-fechado",
    "name": "Corpo Fechado",
    "detail": "1 XP. Requisitos: Vigor 4 + Artista Marcial. Gasta 1 Coragem para não sofrer efeitos nem dano de golpes de armas físicas em sua Vitalidade por 1 rodada. Não protege automaticamente Integridade da armadura nem concede imunidade a magia; resolução do tempo de rodada pelo Narrador.",
    "cost": 1,
    "legacy": false,
    "family": "corporal",
    "requirements": [
      [
        "a:vigor:4",
        "s:artista-marcial"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisitos: Vigor 4 + Artista Marcial. Gasta 1 Coragem para não sofrer efeitos nem dano de golpes de armas físicas em sua Vitalidade por 1 rodada. Não protege automaticamente Integridade da armadura nem concede imunidade a magia; resolução do tempo de rodada pelo Narrador.",
        "kind": "passivo ou condicionado",
        "activation": "1 Coragem; protege Vitalidade de efeitos e danos de armas físicas por 1 rodada.",
        "conditions": "1 XP. Requisitos: Vigor 4 + Artista Marcial. Gasta 1 Coragem para não sofrer efeitos nem dano de golpes de armas físicas em sua Vitalidade por 1 rodada. Não protege automaticamente Integridade da armadura nem concede imunidade a magia; resolução do tempo de rodada pelo Narrador.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "invocar-esfera-espiritual",
    "name": "Invocar Esfera Espiritual",
    "detail": "1 XP. Requisitos: Criar Item de Foco e Magia + Destreza 4 + Inteligência 3 + Vigor 3. Converte Coragem em Esferas Espirituais, com limite de 5 criações por rodada e teto de 5 esferas armazenadas. Ao reunir 5 esferas permite transformar um dado em d20 para o golpe corpo a corpo de Disciplina conhecido como Punho Supremo de Asura. Cada esfera custa 1 Coragem; até 5 podem ser criadas na rodada, com teto de 5 armazenadas. Punho Supremo de Asura consome 5 esferas e 1 Coragem ao finalizar um golpe corpo a corpo com Disciplina, substituindo um dado escolhido por d20; o d20 contribui para atingir a DE e calcular o dano básico por seus símbolos mantidos; esse dano é sempre neutro e não tem parcela extra.",
    "cost": 1,
    "legacy": false,
    "family": "psiquico",
    "requirements": [
      [
        "s:criar-item-foco-magia",
        "a:destreza:4",
        "a:inteligencia:3",
        "a:vigor:3"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisitos: Criar Item de Foco e Magia + Destreza 4 + Inteligência 3 + Vigor 3. Converte Coragem em Esferas Espirituais, com limite de 5 criações por rodada e teto de 5 esferas armazenadas. Ao reunir 5 esferas permite transformar um dado em d20 para o golpe corpo a corpo de Disciplina conhecido como Punho Supremo de Asura. Cada esfera custa 1 Coragem; até 5 podem ser criadas na rodada, com teto de 5 armazenadas. Punho Supremo de Asura consome 5 esferas e 1 Coragem ao finalizar um golpe corpo a corpo com Disciplina, substituindo um dado escolhido por d20; o d20 contribui para atingir a DE e calcular o dano básico por seus símbolos mantidos; esse dano é sempre neutro e não tem parcela extra.",
        "kind": "passivo ou condicionado",
        "activation": "1 Coragem por esfera · Até 5 criadas por rodada e 5 armazenadas",
        "conditions": "1 XP. Requisitos: Criar Item de Foco e Magia + Destreza 4 + Inteligência 3 + Vigor 3. Converte Coragem em Esferas Espirituais, com limite de 5 criações por rodada e teto de 5 esferas armazenadas. Ao reunir 5 esferas permite transformar um dado em d20 para o golpe corpo a corpo de Disciplina conhecido como Punho Supremo de Asura. Cada esfera custa 1 Coragem; até 5 podem ser criadas na rodada, com teto de 5 armazenadas. Punho Supremo de Asura consome 5 esferas e 1 Coragem ao finalizar um golpe corpo a corpo com Disciplina, substituindo um dado escolhido por d20; o d20 contribui para atingir a DE e calcular o dano básico por seus símbolos mantidos; esse dano é sempre neutro e não tem parcela extra.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "passo-etereo",
    "name": "Passo Etéreo",
    "detail": "1 XP. Requisitos: Invocar Esfera Espiritual. Arremessa uma Esfera Espiritual e se projeta em deslocamento rápido de até 8 metros, consumindo 1 esfera. Movimento e obstáculos dependem do mapa do combate.",
    "cost": 1,
    "legacy": false,
    "family": "psiquico",
    "requirements": [
      [
        "s:invocar-esfera-espiritual"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisitos: Invocar Esfera Espiritual. Arremessa uma Esfera Espiritual e se projeta em deslocamento rápido de até 8 metros, consumindo 1 esfera. Movimento e obstáculos dependem do mapa do combate.",
        "kind": "passivo ou condicionado",
        "activation": "1 esfera; deslocamento rápido de 8 m.",
        "conditions": "1 XP. Requisitos: Invocar Esfera Espiritual. Arremessa uma Esfera Espiritual e se projeta em deslocamento rápido de até 8 metros, consumindo 1 esfera. Movimento e obstáculos dependem do mapa do combate.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "absorver-esferas",
    "name": "Absorver Esferas",
    "detail": "1 XP. Requisitos: Invocar Esfera Espiritual. Recupera Coragem em quantidade igual ao total de Esferas Espirituais; consome TODAS as esferas disponíveis. Recupera 1 Coragem por esfera consumida, limitada ao teto; esferas ficam em zero após a absorção.",
    "cost": 1,
    "legacy": false,
    "family": "psiquico",
    "requirements": [
      [
        "s:invocar-esfera-espiritual"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisitos: Invocar Esfera Espiritual. Recupera Coragem em quantidade igual ao total de Esferas Espirituais; consome TODAS as esferas disponíveis. Recupera 1 Coragem por esfera consumida, limitada ao teto; esferas ficam em zero após a absorção.",
        "kind": "passivo ou condicionado",
        "activation": "Recupera Coragem = total de esferas; consome todas as esferas.",
        "conditions": "1 XP. Requisitos: Invocar Esfera Espiritual. Recupera Coragem em quantidade igual ao total de Esferas Espirituais; consome TODAS as esferas disponíveis. Recupera 1 Coragem por esfera consumida, limitada ao teto; esferas ficam em zero após a absorção.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "disparo-esferas-espirituais",
    "name": "Disparo de Esferas Espirituais",
    "detail": "1 XP. Requisitos: Invocar Esfera Espiritual. Permite ataques físicos à distância por disparo de Esferas Espirituais, gastando 1 esfera por golpe. Alcance, dados, DE e cálculo de dano não informados; não presumir ataque de magia.",
    "cost": 1,
    "legacy": false,
    "family": "psiquico",
    "requirements": [
      [
        "s:invocar-esfera-espiritual"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisitos: Invocar Esfera Espiritual. Permite ataques físicos à distância por disparo de Esferas Espirituais, gastando 1 esfera por golpe. Alcance, dados, DE e cálculo de dano não informados; não presumir ataque de magia.",
        "kind": "passivo ou condicionado",
        "activation": "1 esfera por ataque físico à distância; alcance/dano pendentes.",
        "conditions": "1 XP. Requisitos: Invocar Esfera Espiritual. Permite ataques físicos à distância por disparo de Esferas Espirituais, gastando 1 esfera por golpe. Alcance, dados, DE e cálculo de dano não informados; não presumir ataque de magia.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "dilema",
    "name": "Dilema",
    "detail": "1 XP. Requisitos: Vigor 4 + Artista Marcial. Desafia um inimigo para pacto de combate que impede ambos de se moverem até que um dos dois fique inconsciente. Procedimentos de resistência, interrupção, distância e condição em caso de fuga não foram especificados.",
    "cost": 1,
    "legacy": false,
    "family": "corporal",
    "requirements": [
      [
        "a:vigor:4",
        "s:artista-marcial"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos: Vigor 4 + Artista Marcial. Desafia um inimigo para pacto de combate que impede ambos de se moverem até que um dos dois fique inconsciente. Procedimentos de resistência, interrupção, distância e condição em caso de fuga não foram especificados.",
        "kind": "ativo ou narrativo",
        "activation": "Pacto impede movimento de ambos até um ficar inconsciente; custo de ativação não informado.",
        "conditions": "1 XP. Requisitos: Vigor 4 + Artista Marcial. Desafia um inimigo para pacto de combate que impede ambos de se moverem até que um dos dois fique inconsciente. Procedimentos de resistência, interrupção, distância e condição em caso de fuga não foram especificados.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "impacto-psiquico",
    "name": "Impacto Psíquico",
    "detail": "1 XP. Requisitos: Criar Item de Foco e Magia + Artista Marcial. Por 1 Coragem permite golpes psíquicos que aplicam efeitos de armas. Dados, classificação de efeitos elegíveis e interação com proteção física requerem decisão; não supor dano extra.",
    "cost": 1,
    "legacy": false,
    "family": "psiquico",
    "requirements": [
      [
        "s:criar-item-foco-magia",
        "s:artista-marcial"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisitos: Criar Item de Foco e Magia + Artista Marcial. Por 1 Coragem permite golpes psíquicos que aplicam efeitos de armas. Dados, classificação de efeitos elegíveis e interação com proteção física requerem decisão; não supor dano extra.",
        "kind": "passivo ou condicionado",
        "activation": "1 Coragem; golpe psíquico pode aplicar efeitos de armas.",
        "conditions": "1 XP. Requisitos: Criar Item de Foco e Magia + Artista Marcial. Por 1 Coragem permite golpes psíquicos que aplicam efeitos de armas. Dados, classificação de efeitos elegíveis e interação com proteção física requerem decisão; não supor dano extra.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "maestria-adagas",
    "name": "Maestria em Adagas e Facas",
    "detail": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "armas",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
        "conditions": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-espadas",
    "name": "Maestria em Espadas",
    "detail": "1 XP. Requisitos de aquisição: Força 2 + Destreza 2. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": 1,
    "legacy": false,
    "family": "armas",
    "requirements": [
      [
        "a:forca:2",
        "a:destreza:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos de aquisição: Força 2 + Destreza 2. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "1 XP; Força 2 + Destreza 2. Ao acertar: 1 característica grátis; crítico mantém 2 diferentes grátis e terceira diferente por 1 Coragem. Exige Perícia em Armas do peso.",
        "conditions": "1 XP. Requisitos de aquisição: Força 2 + Destreza 2. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-machados",
    "name": "Maestria em Machados",
    "detail": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "armas",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
        "conditions": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-macas",
    "name": "Maestria em Maças e Clavas",
    "detail": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "armas",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
        "conditions": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-hastes",
    "name": "Maestria em Lanças e Hastes",
    "detail": "1 XP. Requisitos de aquisição: Força 2 + Agilidade 1 + Destreza 1. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": 1,
    "legacy": false,
    "family": "armas",
    "requirements": [
      [
        "a:forca:2",
        "a:agilidade:1",
        "a:destreza:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos de aquisição: Força 2 + Agilidade 1 + Destreza 1. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "1 XP; Força 2 + Agilidade 1 + Destreza 1. Ao acertar: 1 característica grátis; crítico mantém 2 diferentes grátis e terceira diferente por 1 Coragem. Exige Perícia em Armas do peso.",
        "conditions": "1 XP. Requisitos de aquisição: Força 2 + Agilidade 1 + Destreza 1. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-cajados",
    "name": "Maestria em Cajados e Bastões",
    "detail": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "armas",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
        "conditions": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Armas Leves/Médias/Pesadas conforme peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-arcos",
    "name": "Maestria em Arcos",
    "detail": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Longo Alcance para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Longo Alcance para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
        "conditions": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Longo Alcance para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-bestas",
    "name": "Maestria em Bestas",
    "detail": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Longo Alcance para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Longo Alcance para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
        "conditions": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Longo Alcance para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-arremessos",
    "name": "Maestria em Armas Arremessadas",
    "detail": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Maestria em Arremesso de Armas e Perícia de Armas do peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Maestria em Arremesso de Armas e Perícia de Armas do peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
        "conditions": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Maestria em Arremesso de Armas e Perícia de Armas do peso para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-punhos",
    "name": "Maestria em Armas de Punho",
    "detail": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Pugilismo para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "corporal",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Pugilismo para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
        "conditions": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Pugilismo para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-longo-alcance",
    "name": "Maestria em Armas de Longo Alcance Diversas",
    "detail": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Longo Alcance para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Longo Alcance para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
        "conditions": "Custo de XP e atributos de compra PENDENTES. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Longo Alcance para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-armas-fogo",
    "name": "Maestria em Armas de Fogo",
    "detail": "Exclusiva de Humanos: gratuita desde a criação. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Fogo para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
    "cost": null,
    "legacy": false,
    "origin": "humano",
    "family": "disparos",
    "requirements": [
      [
        "s:armas-fogo"
      ]
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Exclusiva de Humanos: gratuita desde a criação. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Fogo para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Racial Humano · 0 XP; efeitos dependem de Perícia em Armas de Fogo.",
        "conditions": "Exclusiva de Humanos: gratuita desde a criação. Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige Perícia em Armas de Fogo para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "combate",
    "name": "Combate",
    "detail": "+1A em combate pertinente.",
    "cost": 1,
    "legacy": true,
    "family": "outros",
    "requirements": [
      []
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "+1A em combate pertinente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "+1A em combate pertinente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "armas",
    "name": "Armas 1",
    "detail": "Habilita uma categoria de arma, inclusive Punhos.",
    "cost": 2,
    "legacy": true,
    "family": "outros",
    "requirements": [
      []
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Habilita uma categoria de arma, inclusive Punhos.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Habilita uma categoria de arma, inclusive Punhos.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "montar",
    "name": "Montar Animal",
    "detail": "2 XP. Requer Influência 2. Nos testes com montaria concede Vantagem, não +1A. Vantagem e Antecipar são benefícios distintos.",
    "cost": 2,
    "legacy": false,
    "family": "cavalaria",
    "requirements": [
      [
        "a:influencia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "2 XP. Requer Influência 2. Nos testes com montaria concede Vantagem, não +1A. Vantagem e Antecipar são benefícios distintos.",
        "kind": "ativo ou narrativo",
        "activation": "Vantagem nos testes com montaria; não é +1A",
        "conditions": "2 XP. Requer Influência 2. Nos testes com montaria concede Vantagem, não +1A. Vantagem e Antecipar são benefícios distintos.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "pericia-montaria",
    "name": "Perícia em Montaria",
    "detail": "Requisitos: Influência 1 + Destreza 2. Concede +1A (um símbolo Antecipar) nos testes com montaria, não Vantagem nem dado extra. Custo de XP PENDENTE; compra bloqueada até decisão autoral.",
    "cost": null,
    "legacy": false,
    "family": "cavalaria",
    "requirements": [
      [
        "a:influencia:1",
        "a:destreza:2"
      ]
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Requisitos: Influência 1 + Destreza 2. Concede +1A (um símbolo Antecipar) nos testes com montaria, não Vantagem nem dado extra. Custo de XP PENDENTE; compra bloqueada até decisão autoral.",
        "kind": "ativo ou narrativo",
        "activation": "+1A em testes com montaria; não é Vantagem; aquisição PENDENTE",
        "conditions": "Requisitos: Influência 1 + Destreza 2. Concede +1A (um símbolo Antecipar) nos testes com montaria, não Vantagem nem dado extra. Custo de XP PENDENTE; compra bloqueada até decisão autoral.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "montaria-epica",
    "name": "Montaria Épica",
    "detail": "PROPOSTO / PENDENTE: Cavalaria para montarias gigantes, aladas ou exóticas. Requisitos, custo de XP e efeitos ainda não definidos; não concede montaria, voo ou bônus automaticamente.",
    "cost": null,
    "legacy": false,
    "family": "cavalaria",
    "requirements": [
      []
    ],
    "state": "PROPOSTO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "PROPOSTO / PENDENTE: Cavalaria para montarias gigantes, aladas ou exóticas. Requisitos, custo de XP e efeitos ainda não definidos; não concede montaria, voo ou bônus automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "PROPOSTO / PENDENTE: Cavalaria para montarias gigantes, aladas ou exóticas. Requisitos, custo de XP e efeitos ainda não definidos; não concede montaria, voo ou bônus automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "provocacao-sofisticada",
    "name": "Provocação Sofisticada",
    "detail": "Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.",
    "cost": 1,
    "legacy": false,
    "family": "influencia",
    "requirements": [
      [
        "a:influencia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "criar-item-foco-magia",
    "name": "Criar Item de Foco e Magia",
    "detail": "1 XP · Disciplina 1 + Inteligência 1 + Artesão 1. SUBSTITUI Aprendiz de Conjurador e Magia Única. Ativação-base G1/G2 Psíquica gratuita com a Perícia e o Grau habilitados; foco por Artesão recarrega em N rodadas no Grau N. Magias são criadas e narradas livremente na própria ação, conforme conceitos dos elementos, Perícias adquiridas, Graus, fontes e combinações habilitadas. Não há magias memorizadas, spellslots, peso mental, desconto de −1 por Criar Magia nem custo de 2 Coragens por criação fora de combate. Preparação G2/G3/G4 é tempo de conjuração em cena, não memorização, mantendo custos, DE, Pavor, focos e outros requisitos publicados.",
    "cost": 1,
    "legacy": false,
    "family": "conjuracao",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:inteligencia:1",
        "p:artesao:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Disciplina 1 + Inteligência 1 + Artesão 1. SUBSTITUI Aprendiz de Conjurador e Magia Única. Ativação-base G1/G2 Psíquica gratuita com a Perícia e o Grau habilitados; foco por Artesão recarrega em N rodadas no Grau N. Magias são criadas e narradas livremente na própria ação, conforme conceitos dos elementos, Perícias adquiridas, Graus, fontes e combinações habilitadas. Não há magias memorizadas, spellslots, peso mental, desconto de −1 por Criar Magia nem custo de 2 Coragens por criação fora de combate. Preparação G2/G3/G4 é tempo de conjuração em cena, não memorização, mantendo custos, DE, Pavor, focos e outros requisitos publicados.",
        "kind": "ativo ou narrativo",
        "activation": "G1/G2 Psíquico: ativação-base gratuita",
        "conditions": "1 XP · Disciplina 1 + Inteligência 1 + Artesão 1. SUBSTITUI Aprendiz de Conjurador e Magia Única. Ativação-base G1/G2 Psíquica gratuita com a Perícia e o Grau habilitados; foco por Artesão recarrega em N rodadas no Grau N. Magias são criadas e narradas livremente na própria ação, conforme conceitos dos elementos, Perícias adquiridas, Graus, fontes e combinações habilitadas. Não há magias memorizadas, spellslots, peso mental, desconto de −1 por Criar Magia nem custo de 2 Coragens por criação fora de combate. Preparação G2/G3/G4 é tempo de conjuração em cena, não memorização, mantendo custos, DE, Pavor, focos e outros requisitos publicados.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "escudo-arcano",
    "name": "Escudo Arcano",
    "detail": "Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 Coragem. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 Coragem amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa. NOVA regra v0.54: Escudo Arcano Psíquico ATIVO anula Perfurante de armas físicas, sem anular acerto ou dano; Perfurar da magia de Água não é anulado. Escudo pessoal ou circular protege de todas as direções; parede linear apenas segundo sua geometria. Levantar Escudo físico é ação com rolagem de Disciplina, E+P válidos mantidos para Integridade extra; só defende o primeiro ataque frontal e abaixa após resolvê-lo, mesmo que erre; excedente vai para armadura e depois Vida. A aplicação automática do bloqueio físico ainda não foi implementada.",
    "cost": 1,
    "legacy": false,
    "family": "conjuracao",
    "requirements": [
      [
        "a:inteligencia:2",
        "a:vigor:1",
        "s:criar-item-foco-magia"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 Coragem. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 Coragem amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa. NOVA regra v0.54: Escudo Arcano Psíquico ATIVO anula Perfurante de armas físicas, sem anular acerto ou dano; Perfurar da magia de Água não é anulado. Escudo pessoal ou circular protege de todas as direções; parede linear apenas segundo sua geometria. Levantar Escudo físico é ação com rolagem de Disciplina, E+P válidos mantidos para Integridade extra; só defende o primeiro ataque frontal e abaixa após resolvê-lo, mesmo que erre; excedente vai para armadura e depois Vida. A aplicação automática do bloqueio físico ainda não foi implementada.",
        "kind": "passivo ou condicionado",
        "activation": "1 Coragem (+ custo por expansão)",
        "conditions": "Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 Coragem. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 Coragem amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa. NOVA regra v0.54: Escudo Arcano Psíquico ATIVO anula Perfurante de armas físicas, sem anular acerto ou dano; Perfurar da magia de Água não é anulado. Escudo pessoal ou circular protege de todas as direções; parede linear apenas segundo sua geometria. Levantar Escudo físico é ação com rolagem de Disciplina, E+P válidos mantidos para Integridade extra; só defende o primeiro ataque frontal e abaixa após resolvê-lo, mesmo que erre; excedente vai para armadura e depois Vida. A aplicação automática do bloqueio físico ainda não foi implementada.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "conjuracao-equilibrada",
    "name": "Conjuração Refinada",
    "detail": "1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Destinada a aumentar a distância de disparos e efeitos mágicos. PENDENTE: alcance adicional, custo e procedimento até a reescrita pelo autor. NÃO altera peso/dados automaticamente. ID de compra preservado.",
    "cost": 1,
    "legacy": false,
    "family": "conjuracao",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:inteligencia:2",
        "a:destreza:2",
        "s:criar-item-foco-magia"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Destinada a aumentar a distância de disparos e efeitos mágicos. PENDENTE: alcance adicional, custo e procedimento até a reescrita pelo autor. NÃO altera peso/dados automaticamente. ID de compra preservado.",
        "kind": "ativo ou narrativo",
        "activation": "PENDENTE",
        "conditions": "1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Destinada a aumentar a distância de disparos e efeitos mágicos. PENDENTE: alcance adicional, custo e procedimento até a reescrita pelo autor. NÃO altera peso/dados automaticamente. ID de compra preservado.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "improviso",
    "name": "Improviso Elemental",
    "detail": "Requisitos Disciplina 1, Inteligência 1 e Destreza 1, sem Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:inteligencia:1",
        "a:destreza:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Requisitos Disciplina 1, Inteligência 1 e Destreza 1, sem Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "Requisitos Disciplina 1, Inteligência 1 e Destreza 1, sem Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "cancelar-magia",
    "name": "Cancelar Magia",
    "detail": "1 XP. Requer Criar Item de Foco e Magia, Improviso Elemental, Inteligência 4, Agilidade 4 e Destreza 4. Ao perceber magia em conjuração até 8 m cuja rolagem manteve Pavor, pode gastar 1 Coragem para tentar cancelá-la; o resultado de cancelamento deve IGUALAR OU SUPERAR (≥) a DE da magia lançada, considerando todos os valores mantidos conforme a declaração do Narrador. Empate cancela a magia. Exige possuir a Perícia do elemento que pretende cancelar. Sem resolução automática do lançamento inimigo.",
    "cost": 1,
    "legacy": false,
    "family": "conjuracao",
    "requirements": [
      [
        "s:criar-item-foco-magia",
        "s:improviso",
        "a:inteligencia:4",
        "a:agilidade:4",
        "a:destreza:4"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requer Criar Item de Foco e Magia, Improviso Elemental, Inteligência 4, Agilidade 4 e Destreza 4. Ao perceber magia em conjuração até 8 m cuja rolagem manteve Pavor, pode gastar 1 Coragem para tentar cancelá-la; o resultado de cancelamento deve IGUALAR OU SUPERAR (≥) a DE da magia lançada, considerando todos os valores mantidos conforme a declaração do Narrador. Empate cancela a magia. Exige possuir a Perícia do elemento que pretende cancelar. Sem resolução automática do lançamento inimigo.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem por tentativa, em até 8 m; exige Pavor mantido na magia",
        "conditions": "1 XP. Requer Criar Item de Foco e Magia, Improviso Elemental, Inteligência 4, Agilidade 4 e Destreza 4. Ao perceber magia em conjuração até 8 m cuja rolagem manteve Pavor, pode gastar 1 Coragem para tentar cancelá-la; o resultado de cancelamento deve IGUALAR OU SUPERAR (≥) a DE da magia lançada, considerando todos os valores mantidos conforme a declaração do Narrador. Empate cancela a magia. Exige possuir a Perícia do elemento que pretende cancelar. Sem resolução automática do lançamento inimigo.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "desencantar",
    "name": "Desencantar",
    "detail": "1 XP. Requer Cancelar Magia. Remove elementos ou imunidades até 8 m. Pode remover elementos ou imunidades a até 8 m (inclusive em alvos encantados), exceto o elemento natural constituinte de criatura realmente feita daquele elemento. Custo, teste e duração pendentes; não destruir automaticamente objeto ou criatura.",
    "cost": 1,
    "legacy": false,
    "family": "conjuracao",
    "requirements": [
      [
        "s:cancelar-magia"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requer Cancelar Magia. Remove elementos ou imunidades até 8 m. Pode remover elementos ou imunidades a até 8 m (inclusive em alvos encantados), exceto o elemento natural constituinte de criatura realmente feita daquele elemento. Custo, teste e duração pendentes; não destruir automaticamente objeto ou criatura.",
        "kind": "ativo ou narrativo",
        "activation": "Remoção elemental a 8 m; custo de ativação não informado",
        "conditions": "1 XP. Requer Cancelar Magia. Remove elementos ou imunidades até 8 m. Pode remover elementos ou imunidades a até 8 m (inclusive em alvos encantados), exceto o elemento natural constituinte de criatura realmente feita daquele elemento. Custo, teste e duração pendentes; não destruir automaticamente objeto ou criatura.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "espelho-magico",
    "name": "Espelho Mágico",
    "detail": "1 XP. Requer Cancelar Magia. Passivo: permite refletir contra o conjurador a parcela do dano mágico causada pelos Pavor(es) mantidos por ele na rolagem. Reflete a parcela mágica de dano de Pavor calculada ANTES de a armadura do alvo absorver ou anular o dano; mesmo quando a armadura bloqueia tudo. Não reflete ataques físicos nem Pavor que não causaria dano antes da proteção. Proteção do conjurador e cumulação com Escudo Refletor pendentes.",
    "cost": 1,
    "legacy": false,
    "family": "conjuracao",
    "requirements": [
      [
        "s:cancelar-magia"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requer Cancelar Magia. Passivo: permite refletir contra o conjurador a parcela do dano mágico causada pelos Pavor(es) mantidos por ele na rolagem. Reflete a parcela mágica de dano de Pavor calculada ANTES de a armadura do alvo absorver ou anular o dano; mesmo quando a armadura bloqueia tudo. Não reflete ataques físicos nem Pavor que não causaria dano antes da proteção. Proteção do conjurador e cumulação com Escudo Refletor pendentes.",
        "kind": "ativo ou narrativo",
        "activation": "Passiva; devolve dano mágico originado de Pavor mantido",
        "conditions": "1 XP. Requer Cancelar Magia. Passivo: permite refletir contra o conjurador a parcela do dano mágico causada pelos Pavor(es) mantidos por ele na rolagem. Reflete a parcela mágica de dano de Pavor calculada ANTES de a armadura do alvo absorver ou anular o dano; mesmo quando a armadura bloqueia tudo. Não reflete ataques físicos nem Pavor que não causaria dano antes da proteção. Proteção do conjurador e cumulação com Escudo Refletor pendentes.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "encantar-com-elemento",
    "name": "Encantar com Elemento",
    "detail": "1 XP. Requisitos: uma Perícia Elemental adquirida + Criar Item de Foco e Magia. Armaduras ou escudos: 1 Coragem para resistência ao elemento habilitado; dano do elemento resistido é 0,5 por Êxito de ataque, Pavor causa 0 dano (não elimina riscos). Armas: tornam-se temporariamente do elemento escolhido. Duração igual para arma, armadura e escudo: E-P, somente com E-P>0. Unidade temporal, DE/fontes e custo específico de arma pendentes; sem efeitos extras ou automação.",
    "cost": 1,
    "legacy": false,
    "family": "conjuracao",
    "requirements": [
      [
        "s:criar-item-foco-magia",
        "s:vento"
      ],
      [
        "s:criar-item-foco-magia",
        "s:agua"
      ],
      [
        "s:criar-item-foco-magia",
        "s:terra"
      ],
      [
        "s:criar-item-foco-magia",
        "s:fogo"
      ],
      [
        "s:criar-item-foco-magia",
        "s:sagrado"
      ],
      [
        "s:criar-item-foco-magia",
        "s:sangue"
      ],
      [
        "s:criar-item-foco-magia",
        "s:trevas"
      ],
      [
        "s:criar-item-foco-magia",
        "s:veneno"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos: uma Perícia Elemental adquirida + Criar Item de Foco e Magia. Armaduras ou escudos: 1 Coragem para resistência ao elemento habilitado; dano do elemento resistido é 0,5 por Êxito de ataque, Pavor causa 0 dano (não elimina riscos). Armas: tornam-se temporariamente do elemento escolhido. Duração igual para arma, armadura e escudo: E-P, somente com E-P>0. Unidade temporal, DE/fontes e custo específico de arma pendentes; sem efeitos extras ou automação.",
        "kind": "ativo ou narrativo",
        "activation": "Armadura/escudo: 1 Coragem. Arma: custo PENDENTE. Duração E-P>0 para ambos",
        "conditions": "1 XP. Requisitos: uma Perícia Elemental adquirida + Criar Item de Foco e Magia. Armaduras ou escudos: 1 Coragem para resistência ao elemento habilitado; dano do elemento resistido é 0,5 por Êxito de ataque, Pavor causa 0 dano (não elimina riscos). Armas: tornam-se temporariamente do elemento escolhido. Duração igual para arma, armadura e escudo: E-P, somente com E-P>0. Unidade temporal, DE/fontes e custo específico de arma pendentes; sem efeitos extras ou automação.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "mestre",
    "name": "Maestria Elemental",
    "detail": "Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. A mistura consciente do segundo elemento custa 1A; o custo próprio histórico da Maestria para ativar duas propriedades especiais está PENDENTE de reconciliação, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:criar-item-foco-magia",
        "s:improviso",
        "s:vento"
      ],
      [
        "p:armas_conjuracao:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:criar-item-foco-magia",
        "s:improviso",
        "s:sangue"
      ],
      [
        "p:armas_conjuracao:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:criar-item-foco-magia",
        "s:improviso",
        "s:agua"
      ],
      [
        "p:armas_conjuracao:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:criar-item-foco-magia",
        "s:improviso",
        "s:fogo"
      ],
      [
        "p:armas_conjuracao:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:criar-item-foco-magia",
        "s:improviso",
        "s:terra"
      ],
      [
        "p:armas_conjuracao:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:criar-item-foco-magia",
        "s:improviso",
        "s:veneno"
      ],
      [
        "p:armas_conjuracao:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:criar-item-foco-magia",
        "s:improviso",
        "s:sagrado"
      ],
      [
        "p:armas_conjuracao:3",
        "a:inteligencia:3",
        "a:destreza:3",
        "s:criar-item-foco-magia",
        "s:improviso",
        "s:trevas"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. A mistura consciente do segundo elemento custa 1A; o custo próprio histórico da Maestria para ativar duas propriedades especiais está PENDENTE de reconciliação, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.",
        "kind": "passivo ou condicionado",
        "activation": "Mistura: 1A; custo próprio da Maestria PENDENTE",
        "conditions": "Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. A mistura consciente do segundo elemento custa 1A; o custo próprio histórico da Maestria para ativar duas propriedades especiais está PENDENTE de reconciliação, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "fogo",
    "name": "Perícia em Elemento Fogo",
    "detail": "1 XP · Disciplina 1 + Inteligência 1. G1: disparo de Fogo, iluminação e conduzir chamas existentes, sem dano direto extra à Vida. G2 QUEIMAR: em acerto, E válidos + 1 dano por Pavor não anulado à Integridade da armadura, substituindo a parcela padrão de Pavor, área 4×4 em cone/linha/círculo, sem dano direto adicional à Vida. G1/G2 com Perícia e Grau habilitados: ativação-base gratuita, inclusive sem foco se a fonte elemental estiver disponível no ambiente; não há adicional de Coragem em G2. G3: 1 Coragem para elevar o efeito. Na G4 conjunta: 1 Coragem pela elevação de Fogo a G3, respeitando o custo separado do outro elemento e 1 Antecipar da mistura. G3 DERRETER: mesmo dano de Queimar à armadura + exatamente 1 Vida direta fixa (não dobrada por crítico); área 8×8, conjurar ao final do turno dos aliados. Graus superiores e procedimento contra imunidade/barreiras exigem confirmação do Narrador.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:inteligencia:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Disciplina 1 + Inteligência 1. G1: disparo de Fogo, iluminação e conduzir chamas existentes, sem dano direto extra à Vida. G2 QUEIMAR: em acerto, E válidos + 1 dano por Pavor não anulado à Integridade da armadura, substituindo a parcela padrão de Pavor, área 4×4 em cone/linha/círculo, sem dano direto adicional à Vida. G1/G2 com Perícia e Grau habilitados: ativação-base gratuita, inclusive sem foco se a fonte elemental estiver disponível no ambiente; não há adicional de Coragem em G2. G3: 1 Coragem para elevar o efeito. Na G4 conjunta: 1 Coragem pela elevação de Fogo a G3, respeitando o custo separado do outro elemento e 1 Antecipar da mistura. G3 DERRETER: mesmo dano de Queimar à armadura + exatamente 1 Vida direta fixa (não dobrada por crítico); área 8×8, conjurar ao final do turno dos aliados. Graus superiores e procedimento contra imunidade/barreiras exigem confirmação do Narrador.",
        "kind": "ativo ou narrativo",
        "activation": "G1/G2: gratuito com Perícia e Grau habilitados, com ou sem foco se houver fonte elemental; G3: 1 Coragem; G4: 1 Coragem pela elevação de Fogo (2 no total se os dois elementos chegam a G3)",
        "conditions": "1 XP · Disciplina 1 + Inteligência 1. G1: disparo de Fogo, iluminação e conduzir chamas existentes, sem dano direto extra à Vida. G2 QUEIMAR: em acerto, E válidos + 1 dano por Pavor não anulado à Integridade da armadura, substituindo a parcela padrão de Pavor, área 4×4 em cone/linha/círculo, sem dano direto adicional à Vida. G1/G2 com Perícia e Grau habilitados: ativação-base gratuita, inclusive sem foco se a fonte elemental estiver disponível no ambiente; não há adicional de Coragem em G2. G3: 1 Coragem para elevar o efeito. Na G4 conjunta: 1 Coragem pela elevação de Fogo a G3, respeitando o custo separado do outro elemento e 1 Antecipar da mistura. G3 DERRETER: mesmo dano de Queimar à armadura + exatamente 1 Vida direta fixa (não dobrada por crítico); área 8×8, conjurar ao final do turno dos aliados. Graus superiores e procedimento contra imunidade/barreiras exigem confirmação do Narrador.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "agua",
    "name": "Perícia em Elemento Água",
    "detail": "1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Água. Em ataque acertado, mesmo sem crítico, a ativação-base de um efeito G1/G2 habilitado é gratuita. G1: Congelar por 1 rodada sem dano no estado Leve; extrair água do ar, mover, molhar e limpar. G2: Perfurar no CRÍTICO ou por ativação paga; dano à Vida e à armadura. G3: conjurar no final do turno dos aliados; Empurrar, Perfurar, Congelar e dano à Vida e à armadura, mantendo propriedades menores pertinentes. Resolução e efeitos exatos não automatizados.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:inteligencia:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Água. Em ataque acertado, mesmo sem crítico, a ativação-base de um efeito G1/G2 habilitado é gratuita. G1: Congelar por 1 rodada sem dano no estado Leve; extrair água do ar, mover, molhar e limpar. G2: Perfurar no CRÍTICO ou por ativação paga; dano à Vida e à armadura. G3: conjurar no final do turno dos aliados; Empurrar, Perfurar, Congelar e dano à Vida e à armadura, mantendo propriedades menores pertinentes. Resolução e efeitos exatos não automatizados.",
        "kind": "ativo ou narrativo",
        "activation": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
        "conditions": "1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Água. Em ataque acertado, mesmo sem crítico, a ativação-base de um efeito G1/G2 habilitado é gratuita. G1: Congelar por 1 rodada sem dano no estado Leve; extrair água do ar, mover, molhar e limpar. G2: Perfurar no CRÍTICO ou por ativação paga; dano à Vida e à armadura. G3: conjurar no final do turno dos aliados; Empurrar, Perfurar, Congelar e dano à Vida e à armadura, mantendo propriedades menores pertinentes. Resolução e efeitos exatos não automatizados.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "vento",
    "name": "Perícia em Elemento Ar",
    "detail": "1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Ar. No acerto, mesmo sem crítico, escolha gratuitamente UM efeito G1/G2 habilitado. G1: autoempurrão +4 m de deslocamento; puxar/empurrar objetos; linha, círculo, cone, X. G2: sufocar com dano à Vida ou armadura, puxar, empurrar + derrubar com dano, deslocamento até +8 m. G3: conjurar no final do turno dos aliados, área grande e múltiplos alvos, tornado/rajada, possíveis danos por queda (16 m ainda sem interpretação geométrica). Formas: linha, círculo, cone, X. TAMBÉM pode recuperar Fôlego (Grau, quantidade e gatilho pendentes). Efeitos não automatizados.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:inteligencia:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Ar. No acerto, mesmo sem crítico, escolha gratuitamente UM efeito G1/G2 habilitado. G1: autoempurrão +4 m de deslocamento; puxar/empurrar objetos; linha, círculo, cone, X. G2: sufocar com dano à Vida ou armadura, puxar, empurrar + derrubar com dano, deslocamento até +8 m. G3: conjurar no final do turno dos aliados, área grande e múltiplos alvos, tornado/rajada, possíveis danos por queda (16 m ainda sem interpretação geométrica). Formas: linha, círculo, cone, X. TAMBÉM pode recuperar Fôlego (Grau, quantidade e gatilho pendentes). Efeitos não automatizados.",
        "kind": "ativo ou narrativo",
        "activation": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
        "conditions": "1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Ar. No acerto, mesmo sem crítico, escolha gratuitamente UM efeito G1/G2 habilitado. G1: autoempurrão +4 m de deslocamento; puxar/empurrar objetos; linha, círculo, cone, X. G2: sufocar com dano à Vida ou armadura, puxar, empurrar + derrubar com dano, deslocamento até +8 m. G3: conjurar no final do turno dos aliados, área grande e múltiplos alvos, tornado/rajada, possíveis danos por queda (16 m ainda sem interpretação geométrica). Formas: linha, círculo, cone, X. TAMBÉM pode recuperar Fôlego (Grau, quantidade e gatilho pendentes). Efeitos não automatizados.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "terra",
    "name": "Perícia em Elemento Terra",
    "detail": "1 XP · Disciplina 1 + Inteligência 1. Conjuração elemental Leve de Terra. Ao acertar ataque, inclusive não crítico, escolha gratuitamente UM efeito G1/G2 habilitado. G1: Desvantagem 2 RODADAS (terra nos olhos), emaranhar pés, derrubar, lançar pequenas pedras, criar plataformas de deslocamento, sentido sísmico 18×18 m para detectar furtivos e armadilhas. G2: enredar e imobilizar, Desvantagem 2 TURNOS, espinhos danificam armadura/proteção, sentido sísmico 32×32. G3: conjurar ao final do turno dos aliados, área 5×5, linha/cone/círculo A PARTIR DO ALVO, dano, empurrão e derrubada, sentido sísmico 64×64. Unidades não informadas e efeitos adicionais não automatizados.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:inteligencia:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Disciplina 1 + Inteligência 1. Conjuração elemental Leve de Terra. Ao acertar ataque, inclusive não crítico, escolha gratuitamente UM efeito G1/G2 habilitado. G1: Desvantagem 2 RODADAS (terra nos olhos), emaranhar pés, derrubar, lançar pequenas pedras, criar plataformas de deslocamento, sentido sísmico 18×18 m para detectar furtivos e armadilhas. G2: enredar e imobilizar, Desvantagem 2 TURNOS, espinhos danificam armadura/proteção, sentido sísmico 32×32. G3: conjurar ao final do turno dos aliados, área 5×5, linha/cone/círculo A PARTIR DO ALVO, dano, empurrão e derrubada, sentido sísmico 64×64. Unidades não informadas e efeitos adicionais não automatizados.",
        "kind": "ativo ou narrativo",
        "activation": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
        "conditions": "1 XP · Disciplina 1 + Inteligência 1. Conjuração elemental Leve de Terra. Ao acertar ataque, inclusive não crítico, escolha gratuitamente UM efeito G1/G2 habilitado. G1: Desvantagem 2 RODADAS (terra nos olhos), emaranhar pés, derrubar, lançar pequenas pedras, criar plataformas de deslocamento, sentido sísmico 18×18 m para detectar furtivos e armadilhas. G2: enredar e imobilizar, Desvantagem 2 TURNOS, espinhos danificam armadura/proteção, sentido sísmico 32×32. G3: conjurar ao final do turno dos aliados, área 5×5, linha/cone/círculo A PARTIR DO ALVO, dano, empurrão e derrubada, sentido sísmico 64×64. Unidades não informadas e efeitos adicionais não automatizados.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "sagrado",
    "name": "Perícia em Elemento Sagrado",
    "detail": "Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação-base gratuita em G1/G2 quando habilitada. Suporte em si ou aliado próximo exige alcançar a DE do beneficiário. Cada E excedente recupera 1 Coragem, cada P não anulado cancela um E destinado a recuperação (não reaproveitado como dano). Em área, todos os aliados beneficiados recuperam igualmente; E excedentes podem causar dano aos inimigos cujas DEs foram alcançadas. Conjurador escolhe enfoque em dano, suporte ou combinação. Aliados não sofrem dano sagrado de suporte. G2/G3 por combinação elemental.",
    "cost": 2,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:inteligencia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação-base gratuita em G1/G2 quando habilitada. Suporte em si ou aliado próximo exige alcançar a DE do beneficiário. Cada E excedente recupera 1 Coragem, cada P não anulado cancela um E destinado a recuperação (não reaproveitado como dano). Em área, todos os aliados beneficiados recuperam igualmente; E excedentes podem causar dano aos inimigos cujas DEs foram alcançadas. Conjurador escolhe enfoque em dano, suporte ou combinação. Aliados não sofrem dano sagrado de suporte. G2/G3 por combinação elemental.",
        "kind": "ativo ou narrativo",
        "activation": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
        "conditions": "Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação-base gratuita em G1/G2 quando habilitada. Suporte em si ou aliado próximo exige alcançar a DE do beneficiário. Cada E excedente recupera 1 Coragem, cada P não anulado cancela um E destinado a recuperação (não reaproveitado como dano). Em área, todos os aliados beneficiados recuperam igualmente; E excedentes podem causar dano aos inimigos cujas DEs foram alcançadas. Conjurador escolhe enfoque em dano, suporte ou combinação. Aliados não sofrem dano sagrado de suporte. G2/G3 por combinação elemental.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "veneno",
    "name": "Perícia em Elemento Veneno",
    "detail": "Conjuração distinta da alquimia Criar Veneno. No acerto em alvo com Sangramento, aplica gratuitamente 1 acúmulo G1/G2 habilitado por 2 rodadas sem renovar os anteriores. A partir de 2/3 da Vida atual, Ferido; se acúmulos alcançam Vida atual, Incapacitado. Se estiver Envenenado com exatamente 2 de Vida atual OU atingir 12 acúmulos ativos, Inconsciente. Não causa dano direto à Vida; criaturas biologicamente incompatíveis podem ser imunes. Graus 2 e 3 exigem combinação elemental.",
    "cost": 2,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:inteligencia:2",
        "k:alquimia:2",
        "k:medicina:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "Conjuração distinta da alquimia Criar Veneno. No acerto em alvo com Sangramento, aplica gratuitamente 1 acúmulo G1/G2 habilitado por 2 rodadas sem renovar os anteriores. A partir de 2/3 da Vida atual, Ferido; se acúmulos alcançam Vida atual, Incapacitado. Se estiver Envenenado com exatamente 2 de Vida atual OU atingir 12 acúmulos ativos, Inconsciente. Não causa dano direto à Vida; criaturas biologicamente incompatíveis podem ser imunes. Graus 2 e 3 exigem combinação elemental.",
        "kind": "ativo ou narrativo",
        "activation": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
        "conditions": "Conjuração distinta da alquimia Criar Veneno. No acerto em alvo com Sangramento, aplica gratuitamente 1 acúmulo G1/G2 habilitado por 2 rodadas sem renovar os anteriores. A partir de 2/3 da Vida atual, Ferido; se acúmulos alcançam Vida atual, Incapacitado. Se estiver Envenenado com exatamente 2 de Vida atual OU atingir 12 acúmulos ativos, Inconsciente. Não causa dano direto à Vida; criaturas biologicamente incompatíveis podem ser imunes. Graus 2 e 3 exigem combinação elemental.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "sangue",
    "name": "Perícia em Elemento Sangue",
    "detail": "Rework v0.74: Sangue puro atinge proteção normalmente. Quando uma magia de Sangue acerta e foi amplificada para dano direto, TODO o dano calculado atinge a Vida sem passar pela Integridade da armadura; não soma bônus nem desgasta a armadura em paralelo. Custo: 1 Vida própria OU 3 marcas inimigas, uma vez por turno, em alternativa a manter ou elevar dado. O Pavor continua gerando risco. Extração como técnica segue revogada. Cada Vida de inimigo realmente perdida gera 1 marca.",
    "cost": 2,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:inteligencia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "Rework v0.74: Sangue puro atinge proteção normalmente. Quando uma magia de Sangue acerta e foi amplificada para dano direto, TODO o dano calculado atinge a Vida sem passar pela Integridade da armadura; não soma bônus nem desgasta a armadura em paralelo. Custo: 1 Vida própria OU 3 marcas inimigas, uma vez por turno, em alternativa a manter ou elevar dado. O Pavor continua gerando risco. Extração como técnica segue revogada. Cada Vida de inimigo realmente perdida gera 1 marca.",
        "kind": "ativo ou narrativo",
        "activation": "1 Vida própria OU 3 Sangues de inimigos · 1 uso/turno",
        "conditions": "Rework v0.74: Sangue puro atinge proteção normalmente. Quando uma magia de Sangue acerta e foi amplificada para dano direto, TODO o dano calculado atinge a Vida sem passar pela Integridade da armadura; não soma bônus nem desgasta a armadura em paralelo. Custo: 1 Vida própria OU 3 marcas inimigas, uma vez por turno, em alternativa a manter ou elevar dado. O Pavor continua gerando risco. Extração como técnica segue revogada. Cada Vida de inimigo realmente perdida gera 1 marca.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "trevas",
    "name": "Perícia em Elemento Trevas",
    "detail": "Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação-base G1/G2 gratuita com Perícia e Grau habilitados, respeitando gatilhos. Escurecimento, Pavor e maldições. Técnica especializada usa uma única rolagem contra um ou dois alvos e soma +2P ANTES da DE, contando para acerto, dano e risco. Pavor não anulado é dividido entre os dois alvos de modo equilibrado ou focado em um, sem duplicar; um só alvo é permitido. G2/G3 exigem mescla.",
    "cost": 2,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:inteligencia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação-base G1/G2 gratuita com Perícia e Grau habilitados, respeitando gatilhos. Escurecimento, Pavor e maldições. Técnica especializada usa uma única rolagem contra um ou dois alvos e soma +2P ANTES da DE, contando para acerto, dano e risco. Pavor não anulado é dividido entre os dois alvos de modo equilibrado ou focado em um, sem duplicar; um só alvo é permitido. G2/G3 exigem mescla.",
        "kind": "ativo ou narrativo",
        "activation": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
        "conditions": "Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação-base G1/G2 gratuita com Perícia e Grau habilitados, respeitando gatilhos. Escurecimento, Pavor e maldições. Técnica especializada usa uma única rolagem contra um ou dois alvos e soma +2P ANTES da DE, contando para acerto, dano e risco. Pavor não anulado é dividido entre os dois alvos de modo equilibrado ou focado em um, sem duplicar; um só alvo é permitido. G2/G3 exigem mescla.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "armas-leves",
    "name": "Perícia em Armas Leves",
    "detail": "Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.",
    "cost": 2,
    "legacy": false,
    "family": "armas",
    "requirements": [
      [
        "p:armas_conjuracao:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "armas-medias",
    "name": "Perícia em Armas Médias",
    "detail": "Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.",
    "cost": 2,
    "legacy": false,
    "family": "armas",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:forca:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "armas-pesadas",
    "name": "Perícia em Armas Pesadas",
    "detail": "Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.",
    "cost": 2,
    "legacy": false,
    "family": "armas",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:forca:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "disciplina-avancada",
    "name": "Disciplina Avançada",
    "detail": "Disciplina 2; ao realizar uma ação com Disciplina, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.",
    "cost": 1,
    "legacy": false,
    "family": "armas",
    "requirements": [
      [
        "p:armas_conjuracao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Disciplina 2; ao realizar uma ação com Disciplina, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.",
        "kind": "passivo ou condicionado",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 2; ao realizar uma ação com Disciplina, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "concentracao-refinada",
    "name": "Concentração Refinada",
    "detail": "1 XP. Requisito: Disciplina 2. Ao usar a mecânica Antecipação para guardar 1A de uma rolagem com Disciplina para a próxima rolagem, o A reservado converte-se em 1E e você recebe a condição Vantagem. Não pode usar Concentração Refinada com inimigo a 8 m ou menos. O 1A é convertido em 1E guardado ao se concentrar; o 1E e a Vantagem duram até uso, próxima ação ou descanso longo. A compra é automatizada; a reserva ainda é anotada manualmente.",
    "cost": 1,
    "legacy": false,
    "family": "conjuracao",
    "requirements": [
      [
        "p:armas_conjuracao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisito: Disciplina 2. Ao usar a mecânica Antecipação para guardar 1A de uma rolagem com Disciplina para a próxima rolagem, o A reservado converte-se em 1E e você recebe a condição Vantagem. Não pode usar Concentração Refinada com inimigo a 8 m ou menos. O 1A é convertido em 1E guardado ao se concentrar; o 1E e a Vantagem duram até uso, próxima ação ou descanso longo. A compra é automatizada; a reserva ainda é anotada manualmente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "1 XP. Requisito: Disciplina 2. Ao usar a mecânica Antecipação para guardar 1A de uma rolagem com Disciplina para a próxima rolagem, o A reservado converte-se em 1E e você recebe a condição Vantagem. Não pode usar Concentração Refinada com inimigo a 8 m ou menos. O 1A é convertido em 1E guardado ao se concentrar; o 1E e a Vantagem duram até uso, próxima ação ou descanso longo. A compra é automatizada; a reserva ainda é anotada manualmente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "manejo-perfeito",
    "name": "Manejo Perfeito — Armas Corpo a Corpo",
    "detail": "Disciplina Avançada + Destreza 2. Arma certa: Vantagem Absoluta; se já possui, Golpe Certo. XP e Golpe Certo PENDENTES.",
    "cost": null,
    "legacy": false,
    "family": "armas",
    "requirements": [
      [
        "a:destreza:2",
        "s:disciplina-avancada"
      ]
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina Avançada + Destreza 2. Arma certa: Vantagem Absoluta; se já possui, Golpe Certo. XP e Golpe Certo PENDENTES.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina Avançada + Destreza 2. Arma certa: Vantagem Absoluta; se já possui, Golpe Certo. XP e Golpe Certo PENDENTES.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "golpe-fulminante",
    "name": "Golpe Fulminante",
    "detail": "Após acerto, pagar a ativação transforma cada Pavor mantido não anulado em 1 dano. Pavor continua gerando risco e Pressão. Especializações: Armas Leves, Médias, Pesadas, Manejo Duplo ou Pugilismo. Arremesso não satisfaz esse requisito. Crítico NÃO isenta o custo da técnica.",
    "cost": 1,
    "legacy": false,
    "family": "corporal",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:forca:2",
        "s:armas-leves"
      ],
      [
        "p:armas_conjuracao:2",
        "a:forca:2",
        "s:armas-medias"
      ],
      [
        "p:armas_conjuracao:2",
        "a:forca:2",
        "s:armas-pesadas"
      ],
      [
        "p:armas_conjuracao:2",
        "a:forca:2",
        "s:maestria-manejo-duplo"
      ],
      [
        "p:armas_conjuracao:2",
        "a:forca:2",
        "s:pugilismo"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Após acerto, pagar a ativação transforma cada Pavor mantido não anulado em 1 dano. Pavor continua gerando risco e Pressão. Especializações: Armas Leves, Médias, Pesadas, Manejo Duplo ou Pugilismo. Arremesso não satisfaz esse requisito. Crítico NÃO isenta o custo da técnica.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem; crítico não dispensa",
        "conditions": "Após acerto, pagar a ativação transforma cada Pavor mantido não anulado em 1 dano. Pavor continua gerando risco e Pressão. Especializações: Armas Leves, Médias, Pesadas, Manejo Duplo ou Pugilismo. Arremesso não satisfaz esse requisito. Crítico NÃO isenta o custo da técnica.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "espalhar-golpe",
    "name": "Golpe Colossal",
    "detail": "Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SEM bônus de +1E. Não espalha automaticamente o dano de Pavor de Golpe Fulminante. Arremesso não é especialização aceita. Centro da área PENDENTE.",
    "cost": 1,
    "legacy": false,
    "family": "corporal",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:destreza:1",
        "a:agilidade:1",
        "s:golpe-fulminante",
        "s:armas-leves"
      ],
      [
        "p:armas_conjuracao:2",
        "a:destreza:1",
        "a:agilidade:1",
        "s:golpe-fulminante",
        "s:armas-medias"
      ],
      [
        "p:armas_conjuracao:2",
        "a:destreza:1",
        "a:agilidade:1",
        "s:golpe-fulminante",
        "s:armas-pesadas"
      ],
      [
        "p:armas_conjuracao:2",
        "a:destreza:1",
        "a:agilidade:1",
        "s:golpe-fulminante",
        "s:maestria-manejo-duplo"
      ],
      [
        "p:armas_conjuracao:2",
        "a:destreza:1",
        "a:agilidade:1",
        "s:golpe-fulminante",
        "s:pugilismo"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SEM bônus de +1E. Não espalha automaticamente o dano de Pavor de Golpe Fulminante. Arremesso não é especialização aceita. Centro da área PENDENTE.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem por até 2 alvos adicionais",
        "conditions": "Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SEM bônus de +1E. Não espalha automaticamente o dano de Pavor de Golpe Fulminante. Arremesso não é especialização aceita. Centro da área PENDENTE.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "pugilismo",
    "name": "Pugilismo",
    "detail": "Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 Coragem para mudar peso do soco. Pesos disponíveis PENDENTES.",
    "cost": 1,
    "legacy": false,
    "family": "corporal",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:forca:2",
        "a:destreza:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 Coragem para mudar peso do soco. Pesos disponíveis PENDENTES.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 Coragem para mudar peso do soco. Pesos disponíveis PENDENTES.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "artista-marcial",
    "name": "Artista Marcial",
    "detail": "Disciplina 2 + Pugilismo + Destreza 2. 1 Coragem por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.",
    "cost": 1,
    "legacy": false,
    "family": "corporal",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:destreza:2",
        "s:pugilismo"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 2 + Pugilismo + Destreza 2. 1 Coragem por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 2 + Pugilismo + Destreza 2. 1 Coragem por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-escudos",
    "name": "Maestria em Escudos",
    "detail": "1 XP. Requisitos: Destreza 2 + Vigor 2. Ao usar escudo físico equipado, ganha +1 à DE defensiva (teto 12, sem acumular por vários escudos) e +1 de Integridade material nesse escudo. O ponto adicional não altera Integridade-base nem E+P de Levantar Escudo.",
    "cost": 1,
    "legacy": false,
    "family": "escudos",
    "requirements": [
      [
        "a:destreza:2",
        "a:vigor:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos: Destreza 2 + Vigor 2. Ao usar escudo físico equipado, ganha +1 à DE defensiva (teto 12, sem acumular por vários escudos) e +1 de Integridade material nesse escudo. O ponto adicional não altera Integridade-base nem E+P de Levantar Escudo.",
        "kind": "ativo ou narrativo",
        "activation": "Passiva com escudo físico equipado · +1 DE e +1 Integridade da peça",
        "conditions": "1 XP. Requisitos: Destreza 2 + Vigor 2. Ao usar escudo físico equipado, ganha +1 à DE defensiva (teto 12, sem acumular por vários escudos) e +1 de Integridade material nesse escudo. O ponto adicional não altera Integridade-base nem E+P de Levantar Escudo.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "sacrificio-heroico",
    "name": "Sacrifício Heroico",
    "detail": "1 XP. Requer Vigor 4. Permite se colocar à frente de alguém a até 8 m e receber o dano no lugar da pessoa, mesmo sem antecipação do próprio turno. Dano vai à armadura ou Vida do protetor conforme as defesas aplicáveis. Sem custo de Coragem informado; posição e dano exigem confirmação do Narrador.",
    "cost": 1,
    "legacy": false,
    "family": "escudos",
    "requirements": [
      [
        "a:vigor:4"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requer Vigor 4. Permite se colocar à frente de alguém a até 8 m e receber o dano no lugar da pessoa, mesmo sem antecipação do próprio turno. Dano vai à armadura ou Vida do protetor conforme as defesas aplicáveis. Sem custo de Coragem informado; posição e dano exigem confirmação do Narrador.",
        "kind": "ativo ou narrativo",
        "activation": "Intervenção protetora até 8 m mesmo fora do turno; ativação sem custo adicional informado",
        "conditions": "1 XP. Requer Vigor 4. Permite se colocar à frente de alguém a até 8 m e receber o dano no lugar da pessoa, mesmo sem antecipação do próprio turno. Dano vai à armadura ou Vida do protetor conforme as defesas aplicáveis. Sem custo de Coragem informado; posição e dano exigem confirmação do Narrador.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "escudo-refletor",
    "name": "Escudo Refletor",
    "detail": "1 XP. Requer Maestria em Escudos. Com escudo físico equipado, ao receber dano reflete ao inimigo atacante os pontos de dano efetivamente causados por Pavor. Não reflete dano de Êxitos ou Pavor que não causou dano; dano original permanece. Aplicação manual conforme Narrador.",
    "cost": 1,
    "legacy": false,
    "family": "escudos",
    "requirements": [
      [
        "s:maestria-escudos"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requer Maestria em Escudos. Com escudo físico equipado, ao receber dano reflete ao inimigo atacante os pontos de dano efetivamente causados por Pavor. Não reflete dano de Êxitos ou Pavor que não causou dano; dano original permanece. Aplicação manual conforme Narrador.",
        "kind": "ativo ou narrativo",
        "activation": "Passiva com escudo físico equipado ao sofrer dano de Pavor",
        "conditions": "1 XP. Requer Maestria em Escudos. Com escudo físico equipado, ao receber dano reflete ao inimigo atacante os pontos de dano efetivamente causados por Pavor. Não reflete dano de Êxitos ou Pavor que não causou dano; dano original permanece. Aplicação manual conforme Narrador.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "escudo-bumerangue",
    "name": "Escudo Bumerangue",
    "detail": "1 XP. Requisitos: Destreza 2 + Força 3 + Perícia em Arremesso de Armas + Maestria em Escudos. Permite ataque com escudo a até 8 m, rolando Disciplina (Armas) + Atributo(s) escolhido(s). Se alcançar a DE, escudo retorna no MESMO TURNO, com ou sem Pavor; se falhar, cai no chão conforme Arremesso de Armas: falha limpa no caminho (1A pode permitir correr e recuperar); com Pavor próximo ao alvo, podendo atingir aliado próximo se alcançar sua DE. Queda em metros: E mantidos + P não anulado + E convertido de 2A. Lançar custa 1 Coragem; no acerto, causa dano físico normal da rolagem (E válidos + piso(P/2), com crítico) e permite características da peça conforme gatilhos e custos normais. Obstáculos e economia de ação permanecem PENDENTES.",
    "cost": 1,
    "legacy": false,
    "family": "escudos",
    "requirements": [
      [
        "a:destreza:2",
        "a:forca:3",
        "s:maestria-arremesso-armas",
        "s:maestria-escudos"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos: Destreza 2 + Força 3 + Perícia em Arremesso de Armas + Maestria em Escudos. Permite ataque com escudo a até 8 m, rolando Disciplina (Armas) + Atributo(s) escolhido(s). Se alcançar a DE, escudo retorna no MESMO TURNO, com ou sem Pavor; se falhar, cai no chão conforme Arremesso de Armas: falha limpa no caminho (1A pode permitir correr e recuperar); com Pavor próximo ao alvo, podendo atingir aliado próximo se alcançar sua DE. Queda em metros: E mantidos + P não anulado + E convertido de 2A. Lançar custa 1 Coragem; no acerto, causa dano físico normal da rolagem (E válidos + piso(P/2), com crítico) e permite características da peça conforme gatilhos e custos normais. Obstáculos e economia de ação permanecem PENDENTES.",
        "kind": "ativo ou narrativo",
        "activation": "Arremesso de escudo: Disciplina + Atributo(s), 8 m; acerto retorna no mesmo turno, falha cai conforme Arremesso de Armas. Custa 1 Coragem para lançar; dano físico normal e características registradas na peça conforme habilitação",
        "conditions": "1 XP. Requisitos: Destreza 2 + Força 3 + Perícia em Arremesso de Armas + Maestria em Escudos. Permite ataque com escudo a até 8 m, rolando Disciplina (Armas) + Atributo(s) escolhido(s). Se alcançar a DE, escudo retorna no MESMO TURNO, com ou sem Pavor; se falhar, cai no chão conforme Arremesso de Armas: falha limpa no caminho (1A pode permitir correr e recuperar); com Pavor próximo ao alvo, podendo atingir aliado próximo se alcançar sua DE. Queda em metros: E mantidos + P não anulado + E convertido de 2A. Lançar custa 1 Coragem; no acerto, causa dano físico normal da rolagem (E válidos + piso(P/2), com crítico) e permite características da peça conforme gatilhos e custos normais. Obstáculos e economia de ação permanecem PENDENTES.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-arremesso-armas",
    "name": "Perícia em Arremesso de Armas",
    "detail": "Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.",
    "cost": 1,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      [
        "a:forca:2",
        "a:destreza:2",
        "a:agilidade:1",
        "s:armas-leves"
      ],
      [
        "a:forca:2",
        "a:destreza:2",
        "a:agilidade:1",
        "s:armas-medias"
      ],
      [
        "a:forca:2",
        "a:destreza:2",
        "a:agilidade:1",
        "s:armas-pesadas"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem ao acertar para ativar efeitos",
        "conditions": "Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "disparo-fulminante",
    "name": "Disparo Fulminante",
    "detail": "Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados.",
    "cost": 1,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:destreza:2",
        "a:forca:1",
        "s:armas-longo-alcance"
      ],
      [
        "p:armas_conjuracao:2",
        "a:destreza:2",
        "a:forca:1",
        "s:maestria-arremesso-armas"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem; crítico não dispensa",
        "conditions": "Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "disparo-multiplo",
    "name": "Disparo Múltiplo",
    "detail": "A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.",
    "cost": 1,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:destreza:2",
        "a:agilidade:2",
        "s:armas-longo-alcance",
        "s:disparo-fulminante"
      ],
      [
        "p:armas_conjuracao:2",
        "a:destreza:2",
        "a:agilidade:2",
        "s:maestria-arremesso-armas",
        "s:disparo-fulminante"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem a cada até 2 alvos adicionais",
        "conditions": "A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "recuperacao-vigorosa",
    "name": "Recuperação Vigorosa",
    "detail": "Vigor 3; adaptação da recuperação à nova Saúde em quatro estados PENDENTE. Custo XP PENDENTE.",
    "cost": null,
    "legacy": false,
    "legacyCost": 1,
    "family": "recuperacao",
    "requirements": [
      [
        "a:vigor:3"
      ]
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Vigor 3; adaptação da recuperação à nova Saúde em quatro estados PENDENTE. Custo XP PENDENTE.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Vigor 3; adaptação da recuperação à nova Saúde em quatro estados PENDENTE. Custo XP PENDENTE.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "recuperacao-movimento",
    "name": "Maestria em Recuperação Vigorosa em Movimento",
    "detail": "Recuperação Vigorosa e Vigor 6; cura natural em viagem após 8h sem dano. Custo XP PENDENTE.",
    "cost": null,
    "legacy": false,
    "family": "recuperacao",
    "requirements": [
      [
        "a:vigor:6",
        "s:recuperacao-vigorosa"
      ]
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Recuperação Vigorosa e Vigor 6; cura natural em viagem após 8h sem dano. Custo XP PENDENTE.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Recuperação Vigorosa e Vigor 6; cura natural em viagem após 8h sem dano. Custo XP PENDENTE.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "recobrar-coragem",
    "name": "Recobrar Coragem",
    "detail": "1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.",
    "cost": 1,
    "legacy": false,
    "family": "recuperacao",
    "requirements": [
      []
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "maestria-manejo-duplo",
    "name": "Perícia em Manejo Duplo",
    "detail": "Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 Coragem. Efeitos próprios, como perfurar, sangrar ou envenenar, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.",
    "cost": 1,
    "legacy": false,
    "family": "armas",
    "requirements": [
      [
        "a:forca:2",
        "a:destreza:2",
        "a:agilidade:1",
        "s:disciplina-avancada",
        "s:armas-leves"
      ],
      [
        "a:forca:2",
        "a:destreza:2",
        "a:agilidade:1",
        "s:disciplina-avancada",
        "s:armas-medias"
      ],
      [
        "a:forca:2",
        "a:destreza:2",
        "a:agilidade:1",
        "s:disciplina-avancada",
        "s:armas-pesadas"
      ],
      [
        "a:forca:2",
        "a:destreza:2",
        "a:agilidade:1",
        "s:disciplina-avancada",
        "s:maestria-arremesso-armas"
      ],
      [
        "a:forca:2",
        "a:destreza:2",
        "a:agilidade:1",
        "s:disciplina-avancada",
        "s:armas-fogo"
      ],
      [
        "a:forca:2",
        "a:destreza:2",
        "a:agilidade:1",
        "s:disciplina-avancada",
        "s:armas-longo-alcance"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 Coragem. Efeitos próprios, como perfurar, sangrar ou envenenar, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem no acerto normal; crítico gratuito",
        "conditions": "Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 Coragem. Efeitos próprios, como perfurar, sangrar ou envenenar, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "instinto-sobrevivencia",
    "name": "Instinto de Sobrevivência",
    "detail": "Vigor 3; antigo efeito de remover −1A em Incapacitado está incompatível com −1E/+1P. Novo efeito PENDENTE, sem aplicar bônus automático.",
    "cost": null,
    "legacy": false,
    "family": "recuperacao",
    "requirements": [
      [
        "a:vigor:3"
      ]
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Vigor 3; antigo efeito de remover −1A em Incapacitado está incompatível com −1E/+1P. Novo efeito PENDENTE, sem aplicar bônus automático.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Vigor 3; antigo efeito de remover −1A em Incapacitado está incompatível com −1E/+1P. Novo efeito PENDENTE, sem aplicar bônus automático.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "arma-certa",
    "name": "Maestria Arma Certa",
    "detail": "+1E com peso favorável. Custo de XP pendente.",
    "cost": null,
    "legacy": false,
    "family": "armas",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "+1E com peso favorável. Custo de XP pendente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "+1E com peso favorável. Custo de XP pendente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "criar-veneno",
    "name": "Criar Veneno",
    "detail": "Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento (estado que ignora armadura, sem causar dano à Vida). Aplicação por magia de Sangue foi autorizada conceitualmente, mas entrega, custos e habilitações permanecem pendentes. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se os efeitos de ambas forem ativados, um de cada arma. Veneno usa VIDA ATUAL: a partir de 2/3 da Vida atual o alvo fica Ferido; ao atingir total de Vida atual em acúmulos, fica Incapacitado. Fica INCONSCIENTE caso esteja Envenenado com exatamente 2 de Vida atual OU ao atingir 12 acúmulos ativos, independentemente da Vida. Cada acúmulo dura 2 rodadas individualmente. Amplificar Veneno será futura Perícia PENDENTE. Graus 2/3 exigem combinação elemental (sem tornar a alquimia magia).",
    "cost": 1,
    "legacy": false,
    "family": "alquimia",
    "requirements": [
      [
        "p:artesao:1",
        "a:inteligencia:2",
        "k:alquimia:2",
        "k:medicina:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento (estado que ignora armadura, sem causar dano à Vida). Aplicação por magia de Sangue foi autorizada conceitualmente, mas entrega, custos e habilitações permanecem pendentes. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se os efeitos de ambas forem ativados, um de cada arma. Veneno usa VIDA ATUAL: a partir de 2/3 da Vida atual o alvo fica Ferido; ao atingir total de Vida atual em acúmulos, fica Incapacitado. Fica INCONSCIENTE caso esteja Envenenado com exatamente 2 de Vida atual OU ao atingir 12 acúmulos ativos, independentemente da Vida. Cada acúmulo dura 2 rodadas individualmente. Amplificar Veneno será futura Perícia PENDENTE. Graus 2/3 exigem combinação elemental (sem tornar a alquimia magia).",
        "kind": "ativo ou narrativo",
        "activation": "Preparação alquímica; ativação conforme arma",
        "conditions": "Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento (estado que ignora armadura, sem causar dano à Vida). Aplicação por magia de Sangue foi autorizada conceitualmente, mas entrega, custos e habilitações permanecem pendentes. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se os efeitos de ambas forem ativados, um de cada arma. Veneno usa VIDA ATUAL: a partir de 2/3 da Vida atual o alvo fica Ferido; ao atingir total de Vida atual em acúmulos, fica Incapacitado. Fica INCONSCIENTE caso esteja Envenenado com exatamente 2 de Vida atual OU ao atingir 12 acúmulos ativos, independentemente da Vida. Cada acúmulo dura 2 rodadas individualmente. Amplificar Veneno será futura Perícia PENDENTE. Graus 2/3 exigem combinação elemental (sem tornar a alquimia magia).",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "criar-antidoto",
    "name": "Criar Antídoto",
    "detail": "Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos forem atendidos; aquisição de Transfusão ainda pendente.",
    "cost": 1,
    "legacy": false,
    "family": "alquimia",
    "requirements": [
      [
        "p:artesao:1",
        "a:inteligencia:2",
        "k:alquimia:2",
        "k:medicina:2",
        "s:criar-veneno"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos forem atendidos; aquisição de Transfusão ainda pendente.",
        "kind": "ativo ou narrativo",
        "activation": "1 dose remove 1 acúmulo",
        "conditions": "Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos forem atendidos; aquisição de Transfusão ainda pendente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "transfusao",
    "name": "Transfusão",
    "detail": "Perícia separada de Elemento Sangue, compra e requisitos próprios ainda pendentes. Pode agir em combate se conjurador e alvo estiverem em Sangramento: transfere 1 Vida própria, recuperando 1 Vida do beneficiário. Pode levar Antídoto à distância ao custo de 1 Vida e das doses usadas, sem duplicação. Não gera Vida adicional.",
    "cost": null,
    "legacy": false,
    "family": "alquimia",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Perícia separada de Elemento Sangue, compra e requisitos próprios ainda pendentes. Pode agir em combate se conjurador e alvo estiverem em Sangramento: transfere 1 Vida própria, recuperando 1 Vida do beneficiário. Pode levar Antídoto à distância ao custo de 1 Vida e das doses usadas, sem duplicação. Não gera Vida adicional.",
        "kind": "ativo ou narrativo",
        "activation": "Custo de Vida; custo de ativação PENDENTE",
        "conditions": "Perícia separada de Elemento Sangue, compra e requisitos próprios ainda pendentes. Pode agir em combate se conjurador e alvo estiverem em Sangramento: transfere 1 Vida própria, recuperando 1 Vida do beneficiário. Pode levar Antídoto à distância ao custo de 1 Vida e das doses usadas, sem duplicação. Não gera Vida adicional.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "transfusao-sanguinaria",
    "name": "Transfusão Sanguinária (exclusiva Lucker de Sangue)",
    "detail": "Exclusiva de Lucker de Sangue; compra 1 XP, exige Transfusão e Perícia em Elemento Sangue. Não é concedida pela origem. Conjuração ATIVA: a cada 3 marcas disponíveis de sangue derramado de inimigos registra recuperação de 1 Vida (até o máximo), após resolver a técnica com o Narrador. Cada 1 Vida efetivamente perdida pelo inimigo gera 1 marca; Sangramento sem dano e dano à Integridade não geram marcas. Não existe reserva extraída separada. As mesmas marcas não podem ser gastas em outra magia e depois na Transfusão. Procedimento, duração, alcance e ativação ainda pendentes.",
    "cost": 1,
    "legacy": false,
    "origin": "lucker_sangue",
    "family": "alquimia",
    "requirements": [
      [
        "s:transfusao",
        "s:sangue"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Exclusiva de Lucker de Sangue; compra 1 XP, exige Transfusão e Perícia em Elemento Sangue. Não é concedida pela origem. Conjuração ATIVA: a cada 3 marcas disponíveis de sangue derramado de inimigos registra recuperação de 1 Vida (até o máximo), após resolver a técnica com o Narrador. Cada 1 Vida efetivamente perdida pelo inimigo gera 1 marca; Sangramento sem dano e dano à Integridade não geram marcas. Não existe reserva extraída separada. As mesmas marcas não podem ser gastas em outra magia e depois na Transfusão. Procedimento, duração, alcance e ativação ainda pendentes.",
        "kind": "ativo ou narrativo",
        "activation": "Conjuração ativa · custo e procedimento pendentes",
        "conditions": "Exclusiva de Lucker de Sangue; compra 1 XP, exige Transfusão e Perícia em Elemento Sangue. Não é concedida pela origem. Conjuração ATIVA: a cada 3 marcas disponíveis de sangue derramado de inimigos registra recuperação de 1 Vida (até o máximo), após resolver a técnica com o Narrador. Cada 1 Vida efetivamente perdida pelo inimigo gera 1 marca; Sangramento sem dano e dano à Integridade não geram marcas. Não existe reserva extraída separada. As mesmas marcas não podem ser gastas em outra magia e depois na Transfusão. Procedimento, duração, alcance e ativação ainda pendentes.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "armas-longo-alcance",
    "name": "Perícia em Armas de Longo Alcance",
    "detail": "Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 Coragem ativa uma segunda; acerto normal exige 1 Coragem.",
    "cost": 2,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:destreza:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 Coragem ativa uma segunda; acerto normal exige 1 Coragem.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem no acerto comum; crítico gratuito",
        "conditions": "Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 Coragem ativa uma segunda; acerto normal exige 1 Coragem.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "disparo-violento",
    "name": "Disparo Violento",
    "detail": "Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crítico.",
    "cost": 1,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:destreza:2",
        "a:forca:2",
        "s:armas-longo-alcance"
      ],
      [
        "p:armas_conjuracao:2",
        "a:destreza:2",
        "a:forca:1",
        "p:atletismo:1",
        "s:armas-longo-alcance"
      ],
      [
        "p:armas_conjuracao:2",
        "a:destreza:2",
        "a:forca:2",
        "s:maestria-arremesso-armas"
      ],
      [
        "p:armas_conjuracao:2",
        "a:destreza:2",
        "a:forca:1",
        "p:atletismo:1",
        "s:maestria-arremesso-armas"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crítico.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem; crítico não dispensa",
        "conditions": "Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crítico.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "disparo-tatico",
    "name": "Disparo Tático",
    "detail": "O autor confirmou compatibilidade com Perícia em Arremesso de Armas. Requisitos completos, custo, efeitos e ativação ainda PENDENTES. Não habilitar compra nem automatizar efeitos.",
    "cost": null,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      []
    ],
    "state": "PENDENTE",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "O autor confirmou compatibilidade com Perícia em Arremesso de Armas. Requisitos completos, custo, efeitos e ativação ainda PENDENTES. Não habilitar compra nem automatizar efeitos.",
        "kind": "ativo ou narrativo",
        "activation": "PENDENTE",
        "conditions": "O autor confirmou compatibilidade com Perícia em Arremesso de Armas. Requisitos completos, custo, efeitos e ativação ainda PENDENTES. Não habilitar compra nem automatizar efeitos.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "armas-fogo",
    "name": "Perícia em Armas de Fogo",
    "detail": "Perfurante, quando presente na arma de fogo, ativa passivamente no acerto, sem custo de ativação; Barulhenta concede +1P passivo até mesmo no crítico. Crítico ativa UMA OUTRA característica escolhida gratuitamente; acerto normal custa 1 Coragem para outras características. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.",
    "cost": 3,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      [
        "p:armas_conjuracao:2",
        "a:destreza:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Perfurante, quando presente na arma de fogo, ativa passivamente no acerto, sem custo de ativação; Barulhenta concede +1P passivo até mesmo no crítico. Crítico ativa UMA OUTRA característica escolhida gratuitamente; acerto normal custa 1 Coragem para outras características. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem no acerto comum; crítico gratuito para efeitos da arma",
        "conditions": "Perfurante, quando presente na arma de fogo, ativa passivamente no acerto, sem custo de ativação; Barulhenta concede +1P passivo até mesmo no crítico. Crítico ativa UMA OUTRA característica escolhida gratuitamente; acerto normal custa 1 Coragem para outras características. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "olhos-de-aguia",
    "name": "Olhos de Águia",
    "detail": "1 XP. Destreza 3 + Disciplina 3 + (Perícia em Armas de Longo Alcance OU Perícia em Armas de Fogo). Aumenta em 8 m o alcance efetivo de armas à distância e armas de fogo habilitadas, sem alterar alcance de arremessos comuns ou magia. Benefício passivo, sem custo adicional de ativação.",
    "cost": 1,
    "legacy": false,
    "family": "disparos",
    "requirements": [
      [
        "a:destreza:3",
        "p:armas_conjuracao:3",
        "s:armas-longo-alcance"
      ],
      [
        "a:destreza:3",
        "p:armas_conjuracao:3",
        "s:armas-fogo"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Destreza 3 + Disciplina 3 + (Perícia em Armas de Longo Alcance OU Perícia em Armas de Fogo). Aumenta em 8 m o alcance efetivo de armas à distância e armas de fogo habilitadas, sem alterar alcance de arremessos comuns ou magia. Benefício passivo, sem custo adicional de ativação.",
        "kind": "passivo ou condicionado",
        "activation": "Consultar descrição normativa",
        "conditions": "1 XP. Destreza 3 + Disciplina 3 + (Perícia em Armas de Longo Alcance OU Perícia em Armas de Fogo). Aumenta em 8 m o alcance efetivo de armas à distância e armas de fogo habilitadas, sem alterar alcance de arremessos comuns ou magia. Benefício passivo, sem custo adicional de ativação.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "golpe-baixo",
    "name": "Golpe Baixo",
    "detail": "Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, mesmo após terminar a rodada de Desvantagem. Não concede movimentação ou turno gratuito.",
    "cost": 1,
    "legacy": false,
    "family": "corporal",
    "requirements": [
      [
        "a:destreza:2",
        "a:forca:1",
        "a:agilidade:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, mesmo após terminar a rodada de Desvantagem. Não concede movimentação ou turno gratuito.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem",
        "conditions": "Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, mesmo após terminar a rodada de Desvantagem. Não concede movimentação ou turno gratuito.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "furtividade",
    "name": "Perícia em Furtividade",
    "detail": "Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.",
    "cost": 1,
    "legacy": false,
    "family": "furtividade",
    "requirements": [
      [
        "p:furtividade:2",
        "a:destreza:2",
        "a:agilidade:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "protecao-avancada",
    "name": "Proteção Avançada",
    "detail": "1 XP. Requisito: Proteção 2. Com Proteção como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "conhecimentos-avancados",
    "requirements": [
      [
        "k:protecao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Proteção 2. Com Proteção como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Proteção 2. Com Proteção como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "astronomia-avancada",
    "name": "Astronomia Avançada",
    "detail": "1 XP. Requisito: Astronomia 2. Com Astronomia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "conhecimentos-avancados",
    "requirements": [
      [
        "k:astronomia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Astronomia 2. Com Astronomia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Astronomia 2. Com Astronomia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "alquimia-avancada",
    "name": "Alquimia Avançada",
    "detail": "1 XP. Requisito: Alquimia 2. Com Alquimia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "alquimia",
    "requirements": [
      [
        "k:alquimia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Alquimia 2. Com Alquimia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Alquimia 2. Com Alquimia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "engenharia-avancada",
    "name": "Engenharia Avançada",
    "detail": "1 XP. Requisito: Engenharia 2. Com Engenharia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "conhecimentos-avancados",
    "requirements": [
      [
        "k:engenharia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Engenharia 2. Com Engenharia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Engenharia 2. Com Engenharia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "erudicao-avancada",
    "name": "Erudição Avançada",
    "detail": "1 XP. Requisito: Erudição 2. Com Erudição como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "conhecimentos-avancados",
    "requirements": [
      [
        "k:erudicao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Erudição 2. Com Erudição como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Erudição 2. Com Erudição como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "atletismo-avancado",
    "name": "Atletismo Avançado",
    "detail": "1 XP. Requisito: Atletismo 2. Com Atletismo como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "atletismo",
    "requirements": [
      [
        "p:atletismo:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Atletismo 2. Com Atletismo como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Atletismo 2. Com Atletismo como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "artesao-avancado",
    "name": "Artesão Avançado",
    "detail": "1 XP. Requisito: Artesão 2. Com Artesão como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "artesao",
    "requirements": [
      [
        "p:artesao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Artesão 2. Com Artesão como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Artesão 2. Com Artesão como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "maestria-martelos",
    "name": "Maestria em Martelos",
    "detail": "1 XP. Compra: Força 3 + Destreza 1 + Vigor 1. Ataque com martelo e Perícia em Armas do peso: acerto comum ativa 1 característica gratuitamente; crítico ativa 2 características diferentes gratuitamente e pode gastar 1 Coragem para uma terceira, se a arma possuir três. A Perícia do peso é requisito da ativação, não da compra. Sem acerto, sem gratuidade; não cria características ou dano extra.",
    "cost": 1,
    "legacy": false,
    "family": "armas",
    "requirements": [
      [
        "a:forca:3",
        "a:destreza:1",
        "a:vigor:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Compra: Força 3 + Destreza 1 + Vigor 1. Ataque com martelo e Perícia em Armas do peso: acerto comum ativa 1 característica gratuitamente; crítico ativa 2 características diferentes gratuitamente e pode gastar 1 Coragem para uma terceira, se a arma possuir três. A Perícia do peso é requisito da ativação, não da compra. Sem acerto, sem gratuidade; não cria características ou dano extra.",
        "kind": "ativo ou narrativo",
        "activation": "Acerto comum: 1 efeito grátis. Crítico: 2 efeitos diferentes grátis e uma terceira por 1 Coragem; requer arma e Perícia de peso habilitadas. Escolha manual",
        "conditions": "1 XP. Compra: Força 3 + Destreza 1 + Vigor 1. Ataque com martelo e Perícia em Armas do peso: acerto comum ativa 1 característica gratuitamente; crítico ativa 2 características diferentes gratuitamente e pode gastar 1 Coragem para uma terceira, se a arma possuir três. A Perícia do peso é requisito da ativação, não da compra. Sem acerto, sem gratuidade; não cria características ou dano extra.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "ferreiro",
    "name": "Ferreiro",
    "detail": "1 XP. Requisitos: Artesão 1 + Força 1 + Destreza 1 + Inteligência 1 + Artesão Avançado (que exige Artesão 2). Habilita criar armas, armaduras Médias e Pesadas de Grau 1, consertar e modificar armas e preparar minérios e metais. +1 Êxito (E) apenas em testes de Forja; demais procedimentos de fabricação pendentes.",
    "cost": 1,
    "legacy": false,
    "family": "artesao",
    "requirements": [
      [
        "p:artesao:1",
        "a:forca:1",
        "a:destreza:1",
        "a:inteligencia:1",
        "s:artesao-avancado"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos: Artesão 1 + Força 1 + Destreza 1 + Inteligência 1 + Artesão Avançado (que exige Artesão 2). Habilita criar armas, armaduras Médias e Pesadas de Grau 1, consertar e modificar armas e preparar minérios e metais. +1 Êxito (E) apenas em testes de Forja; demais procedimentos de fabricação pendentes.",
        "kind": "ativo ou narrativo",
        "activation": "Passiva no teste de Forja; produção/alterações aguardam procedimento",
        "conditions": "1 XP. Requisitos: Artesão 1 + Força 1 + Destreza 1 + Inteligência 1 + Artesão Avançado (que exige Artesão 2). Habilita criar armas, armaduras Médias e Pesadas de Grau 1, consertar e modificar armas e preparar minérios e metais. +1 Êxito (E) apenas em testes de Forja; demais procedimentos de fabricação pendentes.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "ferreiro-elemental",
    "name": "Ferreiro Elemental",
    "detail": "1 XP. Requisitos: Ferreiro + Inteligência 2 + Destreza 2 + Improviso Elemental + Criar Item de Foco e Magia + Encantar com Elemento. Permite criar armas elementais e pedras elementais. Encantar com Elemento ainda não possui aquisição definida: compra bloqueada até existir a Perícia. Receitas e efeitos dos itens pendentes.",
    "cost": 1,
    "legacy": false,
    "family": "artesao",
    "requirements": [
      [
        "a:inteligencia:2",
        "a:destreza:2",
        "s:ferreiro",
        "s:improviso",
        "s:criar-item-foco-magia",
        "s:encantar-com-elemento"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos: Ferreiro + Inteligência 2 + Destreza 2 + Improviso Elemental + Criar Item de Foco e Magia + Encantar com Elemento. Permite criar armas elementais e pedras elementais. Encantar com Elemento ainda não possui aquisição definida: compra bloqueada até existir a Perícia. Receitas e efeitos dos itens pendentes.",
        "kind": "ativo ou narrativo",
        "activation": "Habilitação de criação; procedimentos de fabricação pendentes",
        "conditions": "1 XP. Requisitos: Ferreiro + Inteligência 2 + Destreza 2 + Improviso Elemental + Criar Item de Foco e Magia + Encantar com Elemento. Permite criar armas elementais e pedras elementais. Encantar com Elemento ainda não possui aquisição definida: compra bloqueada até existir a Perícia. Receitas e efeitos dos itens pendentes.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "resistencia-a-fogo",
    "name": "Resistência a Fogo",
    "detail": "1 XP. Requisitos: Ferreiro Elemental + Perícia em Elemento Fogo + Vigor 2. Somente o próprio personagem reduz pela metade o dano de Fogo que atingiria a Vida. O +1 direto à Vida de Derreter G3 é anulado (0), sem reduzir E+P de dano à Integridade de armadura. Não é imunidade. Frações e interação com outras resistências pendentes.",
    "cost": 1,
    "legacy": false,
    "family": "artesao",
    "requirements": [
      [
        "a:vigor:2",
        "s:ferreiro-elemental",
        "s:fogo"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisitos: Ferreiro Elemental + Perícia em Elemento Fogo + Vigor 2. Somente o próprio personagem reduz pela metade o dano de Fogo que atingiria a Vida. O +1 direto à Vida de Derreter G3 é anulado (0), sem reduzir E+P de dano à Integridade de armadura. Não é imunidade. Frações e interação com outras resistências pendentes.",
        "kind": "ativo ou narrativo",
        "activation": "Passiva pessoal: metade do dano de Fogo à Vida e 0 Vida direta por Derreter. Não protege Integridade; cálculos automáticos pendentes",
        "conditions": "1 XP. Requisitos: Ferreiro Elemental + Perícia em Elemento Fogo + Vigor 2. Somente o próprio personagem reduz pela metade o dano de Fogo que atingiria a Vida. O +1 direto à Vida de Derreter G3 é anulado (0), sem reduzir E+P de dano à Integridade de armadura. Não é imunidade. Frações e interação com outras resistências pendentes.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "apresentacao-avancada",
    "name": "Apresentação Avançada",
    "detail": "1 XP. Requisito: Apresentação 2. Com Apresentação como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "apresentacao",
    "requirements": [
      [
        "p:apresentacao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Apresentação 2. Com Apresentação como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Apresentação 2. Com Apresentação como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "coleta-avancada",
    "name": "Coleta Avançada",
    "detail": "1 XP. Requisito: Coleta 2. Com Coleta como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "coleta",
    "requirements": [
      [
        "p:coleta:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Coleta 2. Com Coleta como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Coleta 2. Com Coleta como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "medicina-avancada",
    "name": "Medicina Avançada",
    "detail": "1 XP. Requisito Medicina 2. Em teste com Medicina como Base, acrescenta até duas fontes pertinentes (total de três), incluindo Atributo na pilha. Para tratar Sangrando, testa contra a DE defensiva do alvo com Desvantagem (−1A); sucesso remove o estado, falha mantém. Não dispensa rolagem nem concede cura automática.",
    "cost": 1,
    "legacy": false,
    "family": "recuperacao",
    "requirements": [
      [
        "k:medicina:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito Medicina 2. Em teste com Medicina como Base, acrescenta até duas fontes pertinentes (total de três), incluindo Atributo na pilha. Para tratar Sangrando, testa contra a DE defensiva do alvo com Desvantagem (−1A); sucesso remove o estado, falha mantém. Não dispensa rolagem nem concede cura automática.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva para compor fontes; tratamento exige teste",
        "conditions": "1 XP. Requisito Medicina 2. Em teste com Medicina como Base, acrescenta até duas fontes pertinentes (total de três), incluindo Atributo na pilha. Para tratar Sangrando, testa contra a DE defensiva do alvo com Desvantagem (−1A); sucesso remove o estado, falha mantém. Não dispensa rolagem nem concede cura automática.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "furtividade-avancada",
    "name": "Furtividade Avançada",
    "detail": "Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.",
    "cost": 1,
    "legacy": false,
    "family": "furtividade",
    "requirements": [
      [
        "p:furtividade:2",
        "s:furtividade"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "domar-criatura-pequena",
    "name": "Domar Criatura Pequena",
    "detail": "1 XP · Influência 2, Apresentação 1, Inteligência 1. Domar por 1 Coragem e teste de Influência + Apresentação contra a DE defensiva atual do domador. A Perícia não domestica automaticamente. Uma Pequena começa com 1 Vida própria quando exposta a risco direto; com ficha independente opcional de mesmo XP total atual do jogador, pode ganhar Vida própria por Vigor e Força (base 1 + Vigor + piso(Força/2)), pagando 2x XP para esses Atributos desde G1. Uma Pequena aliada por personagem, concedendo +1A em combate e +1 ponto de Vida (integração às quatro caixas PENDENTE). Atacar a criatura cancela a domesticação; pacificação durante combate tem procedimento PENDENTE. Pode sacrificar-se contra dano letal, ou o personagem pode protegê-la, receber o golpe fatal e fazê-la fugir. Criar Item de Foco e Magia permite domar criaturas pequenas mágicas. XP da pequena sem ficha PENDENTE; companheiros contam no XP do grupo em Criar Conflito.",
    "cost": 1,
    "legacy": false,
    "family": "natureza",
    "requirements": [
      [
        "a:influencia:2",
        "a:inteligencia:1",
        "p:apresentacao:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Influência 2, Apresentação 1, Inteligência 1. Domar por 1 Coragem e teste de Influência + Apresentação contra a DE defensiva atual do domador. A Perícia não domestica automaticamente. Uma Pequena começa com 1 Vida própria quando exposta a risco direto; com ficha independente opcional de mesmo XP total atual do jogador, pode ganhar Vida própria por Vigor e Força (base 1 + Vigor + piso(Força/2)), pagando 2x XP para esses Atributos desde G1. Uma Pequena aliada por personagem, concedendo +1A em combate e +1 ponto de Vida (integração às quatro caixas PENDENTE). Atacar a criatura cancela a domesticação; pacificação durante combate tem procedimento PENDENTE. Pode sacrificar-se contra dano letal, ou o personagem pode protegê-la, receber o golpe fatal e fazê-la fugir. Criar Item de Foco e Magia permite domar criaturas pequenas mágicas. XP da pequena sem ficha PENDENTE; companheiros contam no XP do grupo em Criar Conflito.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem + teste de Influência + Apresentação",
        "conditions": "1 XP · Influência 2, Apresentação 1, Inteligência 1. Domar por 1 Coragem e teste de Influência + Apresentação contra a DE defensiva atual do domador. A Perícia não domestica automaticamente. Uma Pequena começa com 1 Vida própria quando exposta a risco direto; com ficha independente opcional de mesmo XP total atual do jogador, pode ganhar Vida própria por Vigor e Força (base 1 + Vigor + piso(Força/2)), pagando 2x XP para esses Atributos desde G1. Uma Pequena aliada por personagem, concedendo +1A em combate e +1 ponto de Vida (integração às quatro caixas PENDENTE). Atacar a criatura cancela a domesticação; pacificação durante combate tem procedimento PENDENTE. Pode sacrificar-se contra dano letal, ou o personagem pode protegê-la, receber o golpe fatal e fazê-la fugir. Criar Item de Foco e Magia permite domar criaturas pequenas mágicas. XP da pequena sem ficha PENDENTE; companheiros contam no XP do grupo em Criar Conflito.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "domar-criatura-media",
    "name": "Domar Criatura Média",
    "detail": "1 XP. Influência 3, Apresentação 1, Inteligência 1 e Domar Criatura Pequena. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
    "cost": 1,
    "legacy": false,
    "family": "natureza",
    "requirements": [
      [
        "a:influencia:3",
        "a:inteligencia:1",
        "p:apresentacao:1",
        "s:domar-criatura-pequena"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Influência 3, Apresentação 1, Inteligência 1 e Domar Criatura Pequena. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem + teste de Influência + Apresentação",
        "conditions": "1 XP. Influência 3, Apresentação 1, Inteligência 1 e Domar Criatura Pequena. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "domar-criatura-grande",
    "name": "Domar Criatura Grande",
    "detail": "1 XP. Influência 4, Apresentação 1, Inteligência 1, Domar Criatura Pequena e Domar Criatura Média. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
    "cost": 1,
    "legacy": false,
    "family": "natureza",
    "requirements": [
      [
        "a:influencia:4",
        "a:inteligencia:1",
        "p:apresentacao:1",
        "s:domar-criatura-pequena",
        "s:domar-criatura-media"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Influência 4, Apresentação 1, Inteligência 1, Domar Criatura Pequena e Domar Criatura Média. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem + teste de Influência + Apresentação",
        "conditions": "1 XP. Influência 4, Apresentação 1, Inteligência 1, Domar Criatura Pequena e Domar Criatura Média. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "invocacao-elemental",
    "name": "Invocação Elemental",
    "detail": "1 XP; exige Criar Item de Foco e Magia, Domar Criatura Pequena e elemento habilitado. Criar Item de Foco e Magia já habilita Psique; outros elementos exigem Perícia própria. Invoca por 1 Coragem; tamanho Pequeno/Médio/Grande limitado às Perícias Domar adquiridas; elemento precisa estar habilitado. Uma ficha de invocação pode conter várias criaturas reais; três zumbis Médios podem compartilhar uma ficha Grande sem multiplicar Vida mecânica, ações ou XP. Dados da invocação: Pequena rola um dado de Atributo e mantém até 1; Média rola dois dados, um por parte, mantém até 2; Grande rola três dados, um por parte, mantém até 3. Registrar resultados das partes separadamente, sem conceder turnos extras. O jogador escolhe os dados de Atributo e quais manter. A invocação age sozinha ou ajuda um ÚNICO personagem (o conjurador ou um aliado) em ação conjunta normal, passando TODOS os dados mantidos para esse mesmo personagem (até 3 dados na Grande). Não distribuir entre dois personagens nem multiplicar ações, dados, Pavor ou símbolos. Uma única ficha e um único turno antecipável; limites individuais e regras normais da ação conjunta aplicam-se. Em Psique, a mente é projetada e o corpo do conjurador permanece parado. Ficha da invocação com XP total do conjurador, imunidade ao elemento e dano elemental; dissipa quando conjurador fica Incapacitado ou Inconsciente. Imbuir criatura domada concede resistência elemental. Dois elementos custam +1 Coragem e exigem Improviso Elemental + Maestria Elemental adquiridos, além das habilitações de ambos os elementos; Maestria Elemental na invocação custa +1 Coragem para habilitar efeitos especiais. Necromancia Sangue/Trevas: Vida não regenera, imune a Trevas, corpo reinvocável até destruição por Fogo/Sagrado à Vida zero. Psique: fantasmas imunes a neutro e sem dano neutro, Maestria permite assombrar/possuir com Desvantagem Absoluta; Psique+Trevas assombrações, Psique+Sagrado seres angelicais/fantásticos. Psique é habilitada por Criar Item de Foco e Magia; pode projetar a mente com corpo parado. Separar tokens divide XP/Vida e mantém a DE da invocação. Dano de área é normal. Apenas um turno antecipável para uma ficha, mesmo com vários tokens: agir sozinho ou ajudar conjurador/aliado em ação conjunta. Não automatizar possessão e divisões inexatas.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "s:criar-item-foco-magia",
        "s:domar-criatura-pequena"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP; exige Criar Item de Foco e Magia, Domar Criatura Pequena e elemento habilitado. Criar Item de Foco e Magia já habilita Psique; outros elementos exigem Perícia própria. Invoca por 1 Coragem; tamanho Pequeno/Médio/Grande limitado às Perícias Domar adquiridas; elemento precisa estar habilitado. Uma ficha de invocação pode conter várias criaturas reais; três zumbis Médios podem compartilhar uma ficha Grande sem multiplicar Vida mecânica, ações ou XP. Dados da invocação: Pequena rola um dado de Atributo e mantém até 1; Média rola dois dados, um por parte, mantém até 2; Grande rola três dados, um por parte, mantém até 3. Registrar resultados das partes separadamente, sem conceder turnos extras. O jogador escolhe os dados de Atributo e quais manter. A invocação age sozinha ou ajuda um ÚNICO personagem (o conjurador ou um aliado) em ação conjunta normal, passando TODOS os dados mantidos para esse mesmo personagem (até 3 dados na Grande). Não distribuir entre dois personagens nem multiplicar ações, dados, Pavor ou símbolos. Uma única ficha e um único turno antecipável; limites individuais e regras normais da ação conjunta aplicam-se. Em Psique, a mente é projetada e o corpo do conjurador permanece parado. Ficha da invocação com XP total do conjurador, imunidade ao elemento e dano elemental; dissipa quando conjurador fica Incapacitado ou Inconsciente. Imbuir criatura domada concede resistência elemental. Dois elementos custam +1 Coragem e exigem Improviso Elemental + Maestria Elemental adquiridos, além das habilitações de ambos os elementos; Maestria Elemental na invocação custa +1 Coragem para habilitar efeitos especiais. Necromancia Sangue/Trevas: Vida não regenera, imune a Trevas, corpo reinvocável até destruição por Fogo/Sagrado à Vida zero. Psique: fantasmas imunes a neutro e sem dano neutro, Maestria permite assombrar/possuir com Desvantagem Absoluta; Psique+Trevas assombrações, Psique+Sagrado seres angelicais/fantásticos. Psique é habilitada por Criar Item de Foco e Magia; pode projetar a mente com corpo parado. Separar tokens divide XP/Vida e mantém a DE da invocação. Dano de área é normal. Apenas um turno antecipável para uma ficha, mesmo com vários tokens: agir sozinho ou ajudar conjurador/aliado em ação conjunta. Não automatizar possessão e divisões inexatas.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem; segundo elemento +1 Coragem (Improviso + Maestria); efeitos especiais +1 Coragem",
        "conditions": "1 XP; exige Criar Item de Foco e Magia, Domar Criatura Pequena e elemento habilitado. Criar Item de Foco e Magia já habilita Psique; outros elementos exigem Perícia própria. Invoca por 1 Coragem; tamanho Pequeno/Médio/Grande limitado às Perícias Domar adquiridas; elemento precisa estar habilitado. Uma ficha de invocação pode conter várias criaturas reais; três zumbis Médios podem compartilhar uma ficha Grande sem multiplicar Vida mecânica, ações ou XP. Dados da invocação: Pequena rola um dado de Atributo e mantém até 1; Média rola dois dados, um por parte, mantém até 2; Grande rola três dados, um por parte, mantém até 3. Registrar resultados das partes separadamente, sem conceder turnos extras. O jogador escolhe os dados de Atributo e quais manter. A invocação age sozinha ou ajuda um ÚNICO personagem (o conjurador ou um aliado) em ação conjunta normal, passando TODOS os dados mantidos para esse mesmo personagem (até 3 dados na Grande). Não distribuir entre dois personagens nem multiplicar ações, dados, Pavor ou símbolos. Uma única ficha e um único turno antecipável; limites individuais e regras normais da ação conjunta aplicam-se. Em Psique, a mente é projetada e o corpo do conjurador permanece parado. Ficha da invocação com XP total do conjurador, imunidade ao elemento e dano elemental; dissipa quando conjurador fica Incapacitado ou Inconsciente. Imbuir criatura domada concede resistência elemental. Dois elementos custam +1 Coragem e exigem Improviso Elemental + Maestria Elemental adquiridos, além das habilitações de ambos os elementos; Maestria Elemental na invocação custa +1 Coragem para habilitar efeitos especiais. Necromancia Sangue/Trevas: Vida não regenera, imune a Trevas, corpo reinvocável até destruição por Fogo/Sagrado à Vida zero. Psique: fantasmas imunes a neutro e sem dano neutro, Maestria permite assombrar/possuir com Desvantagem Absoluta; Psique+Trevas assombrações, Psique+Sagrado seres angelicais/fantásticos. Psique é habilitada por Criar Item de Foco e Magia; pode projetar a mente com corpo parado. Separar tokens divide XP/Vida e mantém a DE da invocação. Dano de área é normal. Apenas um turno antecipável para uma ficha, mesmo com vários tokens: agir sozinho ou ajudar conjurador/aliado em ação conjunta. Não automatizar possessão e divisões inexatas.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "pericia-druidica",
    "name": "Perícia Druídica",
    "detail": "Transforma-se nas formas Pequena (0 Coragem, eleva 1 Atributo), Média (1 Coragem, eleva 2) ou Grande (1 Coragem, eleva 3). Não conjura nem usa armadura enquanto transformado; a Vida temporária desaparece ao reverter. Regras e cancelamentos no verbete completo.",
    "cost": 1,
    "legacy": false,
    "family": "natureza",
    "requirements": [
      [
        "s:criar-item-foco-magia",
        "s:terra"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "Transforma-se nas formas Pequena (0 Coragem, eleva 1 Atributo), Média (1 Coragem, eleva 2) ou Grande (1 Coragem, eleva 3). Não conjura nem usa armadura enquanto transformado; a Vida temporária desaparece ao reverter. Regras e cancelamentos no verbete completo.",
        "kind": "ativo ou narrativo",
        "activation": "Pequena: 0 Coragem; Média e Grande: 1 Coragem",
        "conditions": "Transforma-se nas formas Pequena (0 Coragem, eleva 1 Atributo), Média (1 Coragem, eleva 2) ou Grande (1 Coragem, eleva 3). Não conjura nem usa armadura enquanto transformado; a Vida temporária desaparece ao reverter. Regras e cancelamentos no verbete completo.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "sentido-elemental",
    "name": "Sentido Elemental",
    "detail": "1 XP. Requer Inteligência 3 e Improviso Elemental. Gasta 1 Coragem para analisar um alvo e descobrir sua afinidade elemental, informada pelo Narrador. Não cria bônus de combate, dados ou DE novos.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "a:inteligencia:3",
        "s:improviso"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requer Inteligência 3 e Improviso Elemental. Gasta 1 Coragem para analisar um alvo e descobrir sua afinidade elemental, informada pelo Narrador. Não cria bônus de combate, dados ou DE novos.",
        "kind": "passivo ou condicionado",
        "activation": "1 Coragem por análise",
        "conditions": "1 XP. Requer Inteligência 3 e Improviso Elemental. Gasta 1 Coragem para analisar um alvo e descobrir sua afinidade elemental, informada pelo Narrador. Não cria bônus de combate, dados ou DE novos.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "mudanca-elemental",
    "name": "Mudança Elemental",
    "detail": "1 XP. Requer Transformação Elemental, Destreza 4 e Inteligência 4. Permite mudar o elemento de criatura, armadura ou ambiente a até 8 m para um elemento cuja Perícia o personagem possua. Duração E − P, válida apenas quando E − P > 0. Unidade temporal, resistência e custo de ativação pendentes; aplicar manualmente, sem conceder outras imunidades automaticamente.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "s:transformacao-elemental",
        "a:destreza:4",
        "a:inteligencia:4"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requer Transformação Elemental, Destreza 4 e Inteligência 4. Permite mudar o elemento de criatura, armadura ou ambiente a até 8 m para um elemento cuja Perícia o personagem possua. Duração E − P, válida apenas quando E − P > 0. Unidade temporal, resistência e custo de ativação pendentes; aplicar manualmente, sem conceder outras imunidades automaticamente.",
        "kind": "ativo ou narrativo",
        "activation": "Mudança de elemento a 8 m; custo de ativação não informado",
        "conditions": "1 XP. Requer Transformação Elemental, Destreza 4 e Inteligência 4. Permite mudar o elemento de criatura, armadura ou ambiente a até 8 m para um elemento cuja Perícia o personagem possua. Duração E − P, válida apenas quando E − P > 0. Unidade temporal, resistência e custo de ativação pendentes; aplicar manualmente, sem conceder outras imunidades automaticamente.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "transformacao-elemental",
    "name": "Transformação Elemental",
    "detail": "1 XP; requer Criar Item de Foco e Magia e uma Perícia Elemental. Ativação 1 Coragem. Imune ao elemento escolhido e intangível, exceto Terra (tangível, imune a Terra e efeitos aplicáveis das armas). Sem armadura; dano não protegido por imunidade ou Escudo Arcano chega diretamente à Vida. Duração elemental = E - P, exigindo E - P > 0, sem duração-base. Fonte e DE pendentes. Aura Sagrada: quando a Transformação Elemental em Sagrado se concretiza, pessoas num raio de 3 m recebem 1 Coragem até o teto de cada ficha. Sem recuperação periódica definida. Imunidade: zero dano do elemento; resistência: E/2 dano e P=0 dano só no elemento resistido. Foco pode amplificar (procedimento pendente); ambiente favorável exige 3 turnos de preparação. Resistência citada além de imunidade aguarda interpretação; Escudo Arcano é compatível.",
    "cost": 1,
    "legacy": false,
    "family": "elementos",
    "requirements": [
      [
        "s:criar-item-foco-magia",
        "s:vento"
      ],
      [
        "s:criar-item-foco-magia",
        "s:agua"
      ],
      [
        "s:criar-item-foco-magia",
        "s:terra"
      ],
      [
        "s:criar-item-foco-magia",
        "s:fogo"
      ],
      [
        "s:criar-item-foco-magia",
        "s:sagrado"
      ],
      [
        "s:criar-item-foco-magia",
        "s:sangue"
      ],
      [
        "s:criar-item-foco-magia",
        "s:trevas"
      ],
      [
        "s:criar-item-foco-magia",
        "s:veneno"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0 e decisões autorais de continuidade até v0.85",
    "sourceCommit": "874de82d788228ca5fb3c01b1ac06733218585a2",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP; requer Criar Item de Foco e Magia e uma Perícia Elemental. Ativação 1 Coragem. Imune ao elemento escolhido e intangível, exceto Terra (tangível, imune a Terra e efeitos aplicáveis das armas). Sem armadura; dano não protegido por imunidade ou Escudo Arcano chega diretamente à Vida. Duração elemental = E - P, exigindo E - P > 0, sem duração-base. Fonte e DE pendentes. Aura Sagrada: quando a Transformação Elemental em Sagrado se concretiza, pessoas num raio de 3 m recebem 1 Coragem até o teto de cada ficha. Sem recuperação periódica definida. Imunidade: zero dano do elemento; resistência: E/2 dano e P=0 dano só no elemento resistido. Foco pode amplificar (procedimento pendente); ambiente favorável exige 3 turnos de preparação. Resistência citada além de imunidade aguarda interpretação; Escudo Arcano é compatível.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem. Ambiente favorável: 3 turnos. Duração = E-P (>0); unidade, fontes, DE e amplificação pendentes.",
        "conditions": "1 XP; requer Criar Item de Foco e Magia e uma Perícia Elemental. Ativação 1 Coragem. Imune ao elemento escolhido e intangível, exceto Terra (tangível, imune a Terra e efeitos aplicáveis das armas). Sem armadura; dano não protegido por imunidade ou Escudo Arcano chega diretamente à Vida. Duração elemental = E - P, exigindo E - P > 0, sem duração-base. Fonte e DE pendentes. Aura Sagrada: quando a Transformação Elemental em Sagrado se concretiza, pessoas num raio de 3 m recebem 1 Coragem até o teto de cada ficha. Sem recuperação periódica definida. Imunidade: zero dano do elemento; resistência: E/2 dano e P=0 dano só no elemento resistido. Foco pode amplificar (procedimento pendente); ambiente favorável exige 3 turnos de preparação. Resistência citada além de imunidade aguarda interpretação; Escudo Arcano é compatível.",
        "source": "874de82d788228ca5fb3c01b1ac06733218585a2",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "marciais",
    "name": "Artes Marciais",
    "detail": "Especialização desarmada. Exige Disciplina 1; outras regras em playtest.",
    "cost": 1,
    "legacy": true,
    "state": "LEGADO",
    "requirements": [
      [
        "p:armas_conjuracao:1"
      ]
    ],
    "family": "outros",
    "grades": [],
    "effects": [
      {
        "description": "Especialização desarmada. Exige Disciplina 1; outras regras em playtest.",
        "automation": "manual"
      }
    ],
    "automation": "manual",
    "source": "Registro histórico 0.2.1.15"
  },
  {
    "id": "combinacao",
    "name": "Combinação de Fontes",
    "detail": "Habilita propor a terceira fonte pertinente.",
    "cost": 2,
    "legacy": true,
    "state": "LEGADO",
    "requirements": [],
    "family": "outros",
    "grades": [],
    "effects": [
      {
        "description": "Habilita propor a terceira fonte pertinente.",
        "automation": "manual"
      }
    ],
    "automation": "manual",
    "source": "Registro histórico 0.2.1.15"
  }
];
export const requirements=Object.fromEntries(SKILLS.map(row=>[row.id,row.requirements]));
export const ADVANCED_SOURCES=[{"id":"disciplina-avancada","group":"practice","key":"armas_conjuracao","label":"Disciplina"},{"id":"furtividade-avancada","group":"practice","key":"furtividade","label":"Furtividade"},{"id":"medicina-avancada","group":"know","key":"medicina","label":"Medicina"},{"id":"protecao-avancada","name":"Proteção Avançada","group":"know","key":"protecao","label":"Proteção","ref":"k:protecao:2"},{"id":"astronomia-avancada","name":"Astronomia Avançada","group":"know","key":"astronomia","label":"Astronomia","ref":"k:astronomia:2"},{"id":"alquimia-avancada","name":"Alquimia Avançada","group":"know","key":"alquimia","label":"Alquimia","ref":"k:alquimia:2"},{"id":"engenharia-avancada","name":"Engenharia Avançada","group":"know","key":"engenharia","label":"Engenharia","ref":"k:engenharia:2"},{"id":"erudicao-avancada","name":"Erudição Avançada","group":"know","key":"erudicao","label":"Erudição","ref":"k:erudicao:2"},{"id":"atletismo-avancado","name":"Atletismo Avançado","group":"practice","key":"atletismo","label":"Atletismo","ref":"p:atletismo:2"},{"id":"artesao-avancado","name":"Artesão Avançado","group":"practice","key":"artesao","label":"Artesão","ref":"p:artesao:2"},{"id":"apresentacao-avancada","name":"Apresentação Avançada","group":"practice","key":"apresentacao","label":"Apresentação","ref":"p:apresentacao:2"},{"id":"coleta-avancada","name":"Coleta Avançada","group":"practice","key":"coleta","label":"Coleta","ref":"p:coleta:2"}];
export const BARD_MASTERY_SUMMARY="Ao realizar atuação válida que envolva Apresentação + Influência e um complemento pertinente quando aplicável, usando instrumento ou Voz Encantadora habilitada, o Bardo pode gerar 3 Antecipares (3A) musicais no total, para distribuir ou converter em apoio coletivo. São três por atuação, não três por aliado, não entram automaticamente no ataque/dano ou na própria DE e não duplicam os A naturais da rolagem. A reserva adicional não se acumula entre rodadas e cada A só financia um efeito.";
export const XP_LEVEL_REFERENCE=[0,15,28,37,46,56,66,77,88,100,112,125,138,152,166,181,196,212,228,245,260];
export const showSkill=(row,system)=>!row.legacy||Boolean(system.skills?.includes(row.id));
const normalizeName=value=>value.normalize("NFD").replace(/\p{M}/gu,"").toLocaleLowerCase("pt-BR");
export const searchSkills=(query,system)=>SKILLS.filter(row=>showSkill(row,system)&&normalizeName(row.name).includes(normalizeName(query.trim())));
