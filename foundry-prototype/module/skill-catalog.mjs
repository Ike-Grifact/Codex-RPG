// Catálogo único revisado contra o SRD ativo. Gerado por scripts/sync-skill-catalog.mjs.
export const SKILLS=[
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "+1A em combate pertinente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "+1A em combate pertinente.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Habilita uma categoria de arma, inclusive Punhos.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Habilita uma categoria de arma, inclusive Punhos.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "montar",
    "name": "Montar Animal",
    "detail": "Requer Influência grau 2.",
    "cost": 2,
    "legacy": false,
    "family": "influencia",
    "requirements": [
      [
        "a:influencia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Requer Influência grau 2.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Requer Influência grau 2.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Disciplina 1 + Inteligência 1 + Artesão 1. SUBSTITUI Aprendiz de Conjurador e Magia Única. Ativação-base G1/G2 Psíquica gratuita com a Perícia e o Grau habilitados; foco por Artesão recarrega em N rodadas no Grau N. Magias são criadas e narradas livremente na própria ação, conforme conceitos dos elementos, Perícias adquiridas, Graus, fontes e combinações habilitadas. Não há magias memorizadas, spellslots, peso mental, desconto de −1 por Criar Magia nem custo de 2 Coragens por criação fora de combate. Preparação G2/G3/G4 é tempo de conjuração em cena, não memorização, mantendo custos, DE, Pavor, focos e outros requisitos publicados.",
        "kind": "ativo ou narrativo",
        "activation": "G1/G2 Psíquico: ativação-base gratuita",
        "conditions": "1 XP · Disciplina 1 + Inteligência 1 + Artesão 1. SUBSTITUI Aprendiz de Conjurador e Magia Única. Ativação-base G1/G2 Psíquica gratuita com a Perícia e o Grau habilitados; foco por Artesão recarrega em N rodadas no Grau N. Magias são criadas e narradas livremente na própria ação, conforme conceitos dos elementos, Perícias adquiridas, Graus, fontes e combinações habilitadas. Não há magias memorizadas, spellslots, peso mental, desconto de −1 por Criar Magia nem custo de 2 Coragens por criação fora de combate. Preparação G2/G3/G4 é tempo de conjuração em cena, não memorização, mantendo custos, DE, Pavor, focos e outros requisitos publicados.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 Coragem. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 Coragem amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa. NOVA regra v0.54: Escudo Arcano Psíquico ATIVO anula Perfurante de armas físicas, sem anular acerto ou dano; Perfurar da magia de Água não é anulado. Escudo pessoal ou circular protege de todas as direções; parede linear apenas segundo sua geometria. Levantar Escudo físico é ação com rolagem de Disciplina, E+P válidos mantidos para Integridade extra; só defende o primeiro ataque frontal e abaixa após resolvê-lo, mesmo que erre; excedente vai para armadura e depois Vida. A aplicação automática do bloqueio físico ainda não foi implementada.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem (+ custo por expansão)",
        "conditions": "Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 Coragem. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 Coragem amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa. NOVA regra v0.54: Escudo Arcano Psíquico ATIVO anula Perfurante de armas físicas, sem anular acerto ou dano; Perfurar da magia de Água não é anulado. Escudo pessoal ou circular protege de todas as direções; parede linear apenas segundo sua geometria. Levantar Escudo físico é ação com rolagem de Disciplina, E+P válidos mantidos para Integridade extra; só defende o primeiro ataque frontal e abaixa após resolvê-lo, mesmo que erre; excedente vai para armadura e depois Vida. A aplicação automática do bloqueio físico ainda não foi implementada.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
        "automation": "manual"
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Destinada a aumentar a distância de disparos e efeitos mágicos. PENDENTE: alcance adicional, custo e procedimento até a reescrita pelo autor. NÃO altera peso/dados automaticamente. ID de compra preservado.",
        "kind": "ativo ou narrativo",
        "activation": "PENDENTE",
        "conditions": "1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Destinada a aumentar a distância de disparos e efeitos mágicos. PENDENTE: alcance adicional, custo e procedimento até a reescrita pelo autor. NÃO altera peso/dados automaticamente. ID de compra preservado.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "family": "conjuracao",
    "requirements": [
      [
        "p:armas_conjuracao:1",
        "a:inteligencia:1",
        "a:destreza:1"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Requisitos Disciplina 1, Inteligência 1 e Destreza 1, sem Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "Requisitos Disciplina 1, Inteligência 1 e Destreza 1, sem Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "mestre",
    "name": "Maestria Elemental",
    "detail": "Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. A mistura consciente do segundo elemento custa 1A; o custo próprio histórico da Maestria para ativar duas propriedades especiais está PENDENTE de reconciliação, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.",
    "cost": 1,
    "legacy": false,
    "family": "conjuracao",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. A mistura consciente do segundo elemento custa 1A; o custo próprio histórico da Maestria para ativar duas propriedades especiais está PENDENTE de reconciliação, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.",
        "kind": "passivo ou condicionado",
        "activation": "Mistura: 1A; custo próprio da Maestria PENDENTE",
        "conditions": "Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. A mistura consciente do segundo elemento custa 1A; o custo próprio histórico da Maestria para ativar duas propriedades especiais está PENDENTE de reconciliação, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Disciplina 2; ao realizar uma ação com Disciplina, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.",
        "kind": "passivo ou condicionado",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 2; ao realizar uma ação com Disciplina, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "family": "armas",
    "requirements": [
      [
        "p:armas_conjuracao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Requisito: Disciplina 2. Ao usar a mecânica Antecipação para guardar 1A de uma rolagem com Disciplina para a próxima rolagem, o A reservado converte-se em 1E e você recebe a condição Vantagem. Não pode usar Concentração Refinada com inimigo a 8 m ou menos. O 1A é convertido em 1E guardado ao se concentrar; o 1E e a Vantagem duram até uso, próxima ação ou descanso longo. A compra é automatizada; a reserva ainda é anotada manualmente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "1 XP. Requisito: Disciplina 2. Ao usar a mecânica Antecipação para guardar 1A de uma rolagem com Disciplina para a próxima rolagem, o A reservado converte-se em 1E e você recebe a condição Vantagem. Não pode usar Concentração Refinada com inimigo a 8 m ou menos. O 1A é convertido em 1E guardado ao se concentrar; o 1E e a Vantagem duram até uso, próxima ação ou descanso longo. A compra é automatizada; a reserva ainda é anotada manualmente.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina Avançada + Destreza 2. Arma certa: Vantagem Absoluta; se já possui, Golpe Certo. XP e Golpe Certo PENDENTES.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina Avançada + Destreza 2. Arma certa: Vantagem Absoluta; se já possui, Golpe Certo. XP e Golpe Certo PENDENTES.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Após acerto, pagar a ativação transforma cada Pavor mantido não anulado em 1 dano. Pavor continua gerando risco e Pressão. Especializações: Armas Leves, Médias, Pesadas, Manejo Duplo ou Pugilismo. Arremesso não satisfaz esse requisito. Crítico NÃO isenta o custo da técnica.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem; crítico não dispensa",
        "conditions": "Após acerto, pagar a ativação transforma cada Pavor mantido não anulado em 1 dano. Pavor continua gerando risco e Pressão. Especializações: Armas Leves, Médias, Pesadas, Manejo Duplo ou Pugilismo. Arremesso não satisfaz esse requisito. Crítico NÃO isenta o custo da técnica.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SEM bônus de +1E. Não espalha automaticamente o dano de Pavor de Golpe Fulminante. Arremesso não é especialização aceita. Centro da área PENDENTE.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem por até 2 alvos adicionais",
        "conditions": "Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SEM bônus de +1E. Não espalha automaticamente o dano de Pavor de Golpe Fulminante. Arremesso não é especialização aceita. Centro da área PENDENTE.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 Coragem para mudar peso do soco. Pesos disponíveis PENDENTES.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 Coragem para mudar peso do soco. Pesos disponíveis PENDENTES.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Disciplina 2 + Pugilismo + Destreza 2. 1 Coragem por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Disciplina 2 + Pugilismo + Destreza 2. 1 Coragem por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem ao acertar para ativar efeitos",
        "conditions": "Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem; crítico não dispensa",
        "conditions": "Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem a cada até 2 alvos adicionais",
        "conditions": "A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Vigor 3; adaptação da recuperação à nova Saúde em quatro estados PENDENTE. Custo XP PENDENTE.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Vigor 3; adaptação da recuperação à nova Saúde em quatro estados PENDENTE. Custo XP PENDENTE.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Recuperação Vigorosa e Vigor 6; cura natural em viagem após 8h sem dano. Custo XP PENDENTE.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Recuperação Vigorosa e Vigor 6; cura natural em viagem após 8h sem dano. Custo XP PENDENTE.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "family": "influencia",
    "requirements": [
      []
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 Coragem. Efeitos próprios, como perfurar, sangrar ou envenenar, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem no acerto normal; crítico gratuito",
        "conditions": "Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 Coragem. Efeitos próprios, como perfurar, sangrar ou envenenar, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Vigor 3; antigo efeito de remover −1A em Incapacitado está incompatível com −1E/+1P. Novo efeito PENDENTE, sem aplicar bônus automático.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "Vigor 3; antigo efeito de remover −1A em Incapacitado está incompatível com −1E/+1P. Novo efeito PENDENTE, sem aplicar bônus automático.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "+1E com peso favorável. Custo de XP pendente.",
        "kind": "ativo ou narrativo",
        "activation": "Consultar descrição normativa",
        "conditions": "+1E com peso favorável. Custo de XP pendente.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento (estado que ignora armadura, sem causar dano à Vida). Aplicação por magia de Sangue foi autorizada conceitualmente, mas entrega, custos e habilitações permanecem pendentes. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se os efeitos de ambas forem ativados, um de cada arma. Veneno usa VIDA ATUAL: a partir de 2/3 da Vida atual o alvo fica Ferido; ao atingir total de Vida atual em acúmulos, fica Incapacitado. Fica INCONSCIENTE caso esteja Envenenado com exatamente 2 de Vida atual OU ao atingir 12 acúmulos ativos, independentemente da Vida. Cada acúmulo dura 2 rodadas individualmente. Amplificar Veneno será futura Perícia PENDENTE. Graus 2/3 exigem combinação elemental (sem tornar a alquimia magia).",
        "kind": "ativo ou narrativo",
        "activation": "Preparação alquímica; ativação conforme arma",
        "conditions": "Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento (estado que ignora armadura, sem causar dano à Vida). Aplicação por magia de Sangue foi autorizada conceitualmente, mas entrega, custos e habilitações permanecem pendentes. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se os efeitos de ambas forem ativados, um de cada arma. Veneno usa VIDA ATUAL: a partir de 2/3 da Vida atual o alvo fica Ferido; ao atingir total de Vida atual em acúmulos, fica Incapacitado. Fica INCONSCIENTE caso esteja Envenenado com exatamente 2 de Vida atual OU ao atingir 12 acúmulos ativos, independentemente da Vida. Cada acúmulo dura 2 rodadas individualmente. Amplificar Veneno será futura Perícia PENDENTE. Graus 2/3 exigem combinação elemental (sem tornar a alquimia magia).",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos forem atendidos; aquisição de Transfusão ainda pendente.",
        "kind": "ativo ou narrativo",
        "activation": "1 dose remove 1 acúmulo",
        "conditions": "Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos forem atendidos; aquisição de Transfusão ainda pendente.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Perícia separada de Elemento Sangue, compra e requisitos próprios ainda pendentes. Pode agir em combate se conjurador e alvo estiverem em Sangramento: transfere 1 Vida própria, recuperando 1 Vida do beneficiário. Pode levar Antídoto à distância ao custo de 1 Vida e das doses usadas, sem duplicação. Não gera Vida adicional.",
        "kind": "ativo ou narrativo",
        "activation": "Custo de Vida; custo de ativação PENDENTE",
        "conditions": "Perícia separada de Elemento Sangue, compra e requisitos próprios ainda pendentes. Pode agir em combate se conjurador e alvo estiverem em Sangramento: transfere 1 Vida própria, recuperando 1 Vida do beneficiário. Pode levar Antídoto à distância ao custo de 1 Vida e das doses usadas, sem duplicação. Não gera Vida adicional.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "transfusao-sanguinaria",
    "name": "Transfusão Sanguinária (protótipo)",
    "detail": "Compra 1 XP; exige Transfusão e Perícia em Elemento Sangue. Conjuração ATIVA: a cada 3 marcas disponíveis de sangue derramado de inimigos registra recuperação de 1 Vida (até o máximo), após resolver a técnica com o Narrador. Cada 1 Vida efetivamente perdida pelo inimigo gera 1 marca; Sangramento sem dano e dano à Integridade não geram marcas. Não existe reserva extraída separada. As mesmas marcas não podem ser gastas em outra magia e depois na Transfusão. Procedimento, duração, alcance e ativação ainda pendentes.",
    "cost": 1,
    "legacy": false,
    "family": "alquimia",
    "requirements": [
      [
        "s:transfusao",
        "s:sangue"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Compra 1 XP; exige Transfusão e Perícia em Elemento Sangue. Conjuração ATIVA: a cada 3 marcas disponíveis de sangue derramado de inimigos registra recuperação de 1 Vida (até o máximo), após resolver a técnica com o Narrador. Cada 1 Vida efetivamente perdida pelo inimigo gera 1 marca; Sangramento sem dano e dano à Integridade não geram marcas. Não existe reserva extraída separada. As mesmas marcas não podem ser gastas em outra magia e depois na Transfusão. Procedimento, duração, alcance e ativação ainda pendentes.",
        "kind": "ativo ou narrativo",
        "activation": "Conjuração ativa · custo e procedimento pendentes",
        "conditions": "Compra 1 XP; exige Transfusão e Perícia em Elemento Sangue. Conjuração ATIVA: a cada 3 marcas disponíveis de sangue derramado de inimigos registra recuperação de 1 Vida (até o máximo), após resolver a técnica com o Narrador. Cada 1 Vida efetivamente perdida pelo inimigo gera 1 marca; Sangramento sem dano e dano à Integridade não geram marcas. Não existe reserva extraída separada. As mesmas marcas não podem ser gastas em outra magia e depois na Transfusão. Procedimento, duração, alcance e ativação ainda pendentes.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 Coragem ativa uma segunda; acerto normal exige 1 Coragem.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem no acerto comum; crítico gratuito",
        "conditions": "Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 Coragem ativa uma segunda; acerto normal exige 1 Coragem.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crítico.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem; crítico não dispensa",
        "conditions": "Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crítico.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "O autor confirmou compatibilidade com Perícia em Arremesso de Armas. Requisitos completos, custo, efeitos e ativação ainda PENDENTES. Não habilitar compra nem automatizar efeitos.",
        "kind": "ativo ou narrativo",
        "activation": "PENDENTE",
        "conditions": "O autor confirmou compatibilidade com Perícia em Arremesso de Armas. Requisitos completos, custo, efeitos e ativação ainda PENDENTES. Não habilitar compra nem automatizar efeitos.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Perfurante, quando presente na arma de fogo, ativa passivamente no acerto, sem custo de ativação; Barulhenta concede +1P passivo até mesmo no crítico. Crítico ativa UMA OUTRA característica escolhida gratuitamente; acerto normal custa 1 Coragem para outras características. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem no acerto comum; crítico gratuito para efeitos da arma",
        "conditions": "Perfurante, quando presente na arma de fogo, ativa passivamente no acerto, sem custo de ativação; Barulhenta concede +1P passivo até mesmo no crítico. Crítico ativa UMA OUTRA característica escolhida gratuitamente; acerto normal custa 1 Coragem para outras características. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Destreza 3 + Disciplina 3 + (Perícia em Armas de Longo Alcance OU Perícia em Armas de Fogo). Aumenta em 8 m o alcance efetivo de armas à distância e armas de fogo habilitadas, sem alterar alcance de arremessos comuns ou magia. Benefício passivo, sem custo adicional de ativação.",
        "kind": "passivo ou condicionado",
        "activation": "Consultar descrição normativa",
        "conditions": "1 XP. Destreza 3 + Disciplina 3 + (Perícia em Armas de Longo Alcance OU Perícia em Armas de Fogo). Aumenta em 8 m o alcance efetivo de armas à distância e armas de fogo habilitadas, sem alterar alcance de arremessos comuns ou magia. Benefício passivo, sem custo adicional de ativação.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, mesmo após terminar a rodada de Desvantagem. Não concede movimentação ou turno gratuito.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem",
        "conditions": "Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, mesmo após terminar a rodada de Desvantagem. Não concede movimentação ou turno gratuito.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Proteção 2. Com Proteção como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Proteção 2. Com Proteção como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Astronomia 2. Com Astronomia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Astronomia 2. Com Astronomia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "family": "conhecimentos-avancados",
    "requirements": [
      [
        "k:alquimia:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Alquimia 2. Com Alquimia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Alquimia 2. Com Alquimia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Engenharia 2. Com Engenharia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Engenharia 2. Com Engenharia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Erudição 2. Com Erudição como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Erudição 2. Com Erudição como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "family": "praticas-avancadas",
    "requirements": [
      [
        "p:atletismo:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Atletismo 2. Com Atletismo como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Atletismo 2. Com Atletismo como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "family": "praticas-avancadas",
    "requirements": [
      [
        "p:artesao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Artesão 2. Com Artesão como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Artesão 2. Com Artesão como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
        "automation": "parcial"
      }
    ]
  },
  {
    "id": "apresentacao-avancada",
    "name": "Apresentação Avançada",
    "detail": "1 XP. Requisito: Apresentação 2. Com Apresentação como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
    "cost": 1,
    "legacy": false,
    "family": "praticas-avancadas",
    "requirements": [
      [
        "p:apresentacao:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Apresentação 2. Com Apresentação como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Apresentação 2. Com Apresentação como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "family": "praticas-avancadas",
    "requirements": [
      [
        "p:coleta:2"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito: Coleta 2. Com Coleta como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "1 XP. Requisito: Coleta 2. Com Coleta como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "1 XP. Requisito Medicina 2. Em teste com Medicina como Base, acrescenta até duas fontes pertinentes (total de três), incluindo Atributo na pilha. Para tratar Sangrando, testa contra a DE defensiva do alvo com Desvantagem (−1A); sucesso remove o estado, falha mantém. Não dispensa rolagem nem concede cura automática.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva para compor fontes; tratamento exige teste",
        "conditions": "1 XP. Requisito Medicina 2. Em teste com Medicina como Base, acrescenta até duas fontes pertinentes (total de três), incluindo Atributo na pilha. Para tratar Sangrando, testa contra a DE defensiva do alvo com Desvantagem (−1A); sucesso remove o estado, falha mantém. Não dispensa rolagem nem concede cura automática.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "parcial",
    "effects": [
      {
        "description": "Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.",
        "kind": "passivo ou condicionado",
        "activation": "Passiva",
        "conditions": "Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP · Influência 2, Apresentação 1, Inteligência 1. Domar por 1 Coragem e teste de Influência + Apresentação contra a DE defensiva atual do domador. A Perícia não domestica automaticamente. Uma Pequena começa com 1 Vida própria quando exposta a risco direto; com ficha independente opcional de mesmo XP total atual do jogador, pode ganhar Vida própria por Vigor e Força (base 1 + Vigor + piso(Força/2)), pagando 2x XP para esses Atributos desde G1. Uma Pequena aliada por personagem, concedendo +1A em combate e +1 ponto de Vida (integração às quatro caixas PENDENTE). Atacar a criatura cancela a domesticação; pacificação durante combate tem procedimento PENDENTE. Pode sacrificar-se contra dano letal, ou o personagem pode protegê-la, receber o golpe fatal e fazê-la fugir. Criar Item de Foco e Magia permite domar criaturas pequenas mágicas. XP da pequena sem ficha PENDENTE; companheiros contam no XP do grupo em Criar Conflito.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem + teste de Influência + Apresentação",
        "conditions": "1 XP · Influência 2, Apresentação 1, Inteligência 1. Domar por 1 Coragem e teste de Influência + Apresentação contra a DE defensiva atual do domador. A Perícia não domestica automaticamente. Uma Pequena começa com 1 Vida própria quando exposta a risco direto; com ficha independente opcional de mesmo XP total atual do jogador, pode ganhar Vida própria por Vigor e Força (base 1 + Vigor + piso(Força/2)), pagando 2x XP para esses Atributos desde G1. Uma Pequena aliada por personagem, concedendo +1A em combate e +1 ponto de Vida (integração às quatro caixas PENDENTE). Atacar a criatura cancela a domesticação; pacificação durante combate tem procedimento PENDENTE. Pode sacrificar-se contra dano letal, ou o personagem pode protegê-la, receber o golpe fatal e fazê-la fugir. Criar Item de Foco e Magia permite domar criaturas pequenas mágicas. XP da pequena sem ficha PENDENTE; companheiros contam no XP do grupo em Criar Conflito.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Influência 3, Apresentação 1, Inteligência 1 e Domar Criatura Pequena. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem + teste de Influência + Apresentação",
        "conditions": "1 XP. Influência 3, Apresentação 1, Inteligência 1 e Domar Criatura Pequena. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP. Influência 4, Apresentação 1, Inteligência 1, Domar Criatura Pequena e Domar Criatura Média. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem + teste de Influência + Apresentação",
        "conditions": "1 XP. Influência 4, Apresentação 1, Inteligência 1, Domar Criatura Pequena e Domar Criatura Média. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "family": "conjuracao",
    "requirements": [
      [
        "s:criar-item-foco-magia",
        "s:domar-criatura-pequena"
      ]
    ],
    "state": "DEFINIDO",
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP; exige Criar Item de Foco e Magia, Domar Criatura Pequena e elemento habilitado. Criar Item de Foco e Magia já habilita Psique; outros elementos exigem Perícia própria. Invoca por 1 Coragem; tamanho Pequeno/Médio/Grande limitado às Perícias Domar adquiridas; elemento precisa estar habilitado. Uma ficha de invocação pode conter várias criaturas reais; três zumbis Médios podem compartilhar uma ficha Grande sem multiplicar Vida mecânica, ações ou XP. Dados da invocação: Pequena rola um dado de Atributo e mantém até 1; Média rola dois dados, um por parte, mantém até 2; Grande rola três dados, um por parte, mantém até 3. Registrar resultados das partes separadamente, sem conceder turnos extras. O jogador escolhe os dados de Atributo e quais manter. A invocação age sozinha ou ajuda um ÚNICO personagem (o conjurador ou um aliado) em ação conjunta normal, passando TODOS os dados mantidos para esse mesmo personagem (até 3 dados na Grande). Não distribuir entre dois personagens nem multiplicar ações, dados, Pavor ou símbolos. Uma única ficha e um único turno antecipável; limites individuais e regras normais da ação conjunta aplicam-se. Em Psique, a mente é projetada e o corpo do conjurador permanece parado. Ficha da invocação com XP total do conjurador, imunidade ao elemento e dano elemental; dissipa quando conjurador fica Incapacitado ou Inconsciente. Imbuir criatura domada concede resistência elemental. Dois elementos custam +1 Coragem e exigem Improviso Elemental + Maestria Elemental adquiridos, além das habilitações de ambos os elementos; Maestria Elemental na invocação custa +1 Coragem para habilitar efeitos especiais. Necromancia Sangue/Trevas: Vida não regenera, imune a Trevas, corpo reinvocável até destruição por Fogo/Sagrado à Vida zero. Psique: fantasmas imunes a neutro e sem dano neutro, Maestria permite assombrar/possuir com Desvantagem Absoluta; Psique+Trevas assombrações, Psique+Sagrado seres angelicais/fantásticos. Psique é habilitada por Criar Item de Foco e Magia; pode projetar a mente com corpo parado. Separar tokens divide XP/Vida e mantém a DE da invocação. Dano de área é normal. Apenas um turno antecipável para uma ficha, mesmo com vários tokens: agir sozinho ou ajudar conjurador/aliado em ação conjunta. Não automatizar possessão e divisões inexatas.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem; segundo elemento +1 Coragem (Improviso + Maestria); efeitos especiais +1 Coragem",
        "conditions": "1 XP; exige Criar Item de Foco e Magia, Domar Criatura Pequena e elemento habilitado. Criar Item de Foco e Magia já habilita Psique; outros elementos exigem Perícia própria. Invoca por 1 Coragem; tamanho Pequeno/Médio/Grande limitado às Perícias Domar adquiridas; elemento precisa estar habilitado. Uma ficha de invocação pode conter várias criaturas reais; três zumbis Médios podem compartilhar uma ficha Grande sem multiplicar Vida mecânica, ações ou XP. Dados da invocação: Pequena rola um dado de Atributo e mantém até 1; Média rola dois dados, um por parte, mantém até 2; Grande rola três dados, um por parte, mantém até 3. Registrar resultados das partes separadamente, sem conceder turnos extras. O jogador escolhe os dados de Atributo e quais manter. A invocação age sozinha ou ajuda um ÚNICO personagem (o conjurador ou um aliado) em ação conjunta normal, passando TODOS os dados mantidos para esse mesmo personagem (até 3 dados na Grande). Não distribuir entre dois personagens nem multiplicar ações, dados, Pavor ou símbolos. Uma única ficha e um único turno antecipável; limites individuais e regras normais da ação conjunta aplicam-se. Em Psique, a mente é projetada e o corpo do conjurador permanece parado. Ficha da invocação com XP total do conjurador, imunidade ao elemento e dano elemental; dissipa quando conjurador fica Incapacitado ou Inconsciente. Imbuir criatura domada concede resistência elemental. Dois elementos custam +1 Coragem e exigem Improviso Elemental + Maestria Elemental adquiridos, além das habilitações de ambos os elementos; Maestria Elemental na invocação custa +1 Coragem para habilitar efeitos especiais. Necromancia Sangue/Trevas: Vida não regenera, imune a Trevas, corpo reinvocável até destruição por Fogo/Sagrado à Vida zero. Psique: fantasmas imunes a neutro e sem dano neutro, Maestria permite assombrar/possuir com Desvantagem Absoluta; Psique+Trevas assombrações, Psique+Sagrado seres angelicais/fantásticos. Psique é habilitada por Criar Item de Foco e Magia; pode projetar a mente com corpo parado. Separar tokens divide XP/Vida e mantém a DE da invocação. Dano de área é normal. Apenas um turno antecipável para uma ficha, mesmo com vários tokens: agir sozinho ou ajudar conjurador/aliado em ação conjunta. Não automatizar possessão e divisões inexatas.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
        "automation": "manual"
      }
    ]
  },
  {
    "id": "transformacao-elemental",
    "name": "Transformação Elemental",
    "detail": "1 XP; requer Criar Item de Foco e Magia e uma Perícia Elemental. Ativação 1 Coragem. Imune ao elemento escolhido e intangível, exceto Terra (tangível, imune a Terra e efeitos aplicáveis das armas). Sem armadura; dano não protegido por imunidade ou Escudo Arcano chega diretamente à Vida. Duração elemental = E - P, exigindo E - P > 0, sem duração-base. Fonte e DE pendentes. Imunidade: zero dano do elemento; resistência: E/2 dano e P=0 dano só no elemento resistido. Foco pode amplificar (procedimento pendente); ambiente favorável exige 3 turnos de preparação. Resistência citada além de imunidade aguarda interpretação; Escudo Arcano é compatível.",
    "cost": 1,
    "legacy": false,
    "family": "natureza",
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
    "source": "SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária",
    "sourceCommit": "6957ad45032bffef98c10c6160bc85fda1871fd1",
    "grades": [
      1,
      2,
      3
    ],
    "automation": "manual",
    "effects": [
      {
        "description": "1 XP; requer Criar Item de Foco e Magia e uma Perícia Elemental. Ativação 1 Coragem. Imune ao elemento escolhido e intangível, exceto Terra (tangível, imune a Terra e efeitos aplicáveis das armas). Sem armadura; dano não protegido por imunidade ou Escudo Arcano chega diretamente à Vida. Duração elemental = E - P, exigindo E - P > 0, sem duração-base. Fonte e DE pendentes. Imunidade: zero dano do elemento; resistência: E/2 dano e P=0 dano só no elemento resistido. Foco pode amplificar (procedimento pendente); ambiente favorável exige 3 turnos de preparação. Resistência citada além de imunidade aguarda interpretação; Escudo Arcano é compatível.",
        "kind": "ativo ou narrativo",
        "activation": "1 Coragem. Ambiente favorável: 3 turnos. Duração = E-P (>0); unidade, fontes, DE e amplificação pendentes.",
        "conditions": "1 XP; requer Criar Item de Foco e Magia e uma Perícia Elemental. Ativação 1 Coragem. Imune ao elemento escolhido e intangível, exceto Terra (tangível, imune a Terra e efeitos aplicáveis das armas). Sem armadura; dano não protegido por imunidade ou Escudo Arcano chega diretamente à Vida. Duração elemental = E - P, exigindo E - P > 0, sem duração-base. Fonte e DE pendentes. Imunidade: zero dano do elemento; resistência: E/2 dano e P=0 dano só no elemento resistido. Foco pode amplificar (procedimento pendente); ambiente favorável exige 3 turnos de preparação. Resistência citada além de imunidade aguarda interpretação; Escudo Arcano é compatível.",
        "source": "6957ad45032bffef98c10c6160bc85fda1871fd1",
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
export const showSkill=(row,system)=>!row.legacy||Boolean(system.skills?.includes(row.id));
const normalizeName=value=>value.normalize("NFD").replace(/\p{M}/gu,"").toLocaleLowerCase("pt-BR");
export const searchSkills=(query,system)=>SKILLS.filter(row=>showSkill(row,system)&&normalizeName(row.name).includes(normalizeName(query.trim())));
