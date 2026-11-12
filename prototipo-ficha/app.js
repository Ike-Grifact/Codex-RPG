/* Codex RPG — criador e ficha unificados. Regras vigentes do SRD v0.38, com referências experimentais identificadas. */
(function(){
"use strict";
const SAVE_KEY="codex-html-ficha-prototipo-v1",OLD_SAVE_KEY="codex-rpg-ficha-nivel1-v1",THEME_KEY="codex-html-ficha-tema-v1",WIZARD_KEY="codex-html-ficha-wizard-v1";
const A=[["forca","Força"],["agilidade","Agilidade"],["destreza","Destreza"],["inteligencia","Inteligência"],["influencia","Influência"],["vigor","Vigor"]];
const K=[["protecao","Proteção"],["astronomia","Astronomia"],["medicina","Medicina"],["alquimia","Alquimia"],["engenharia","Engenharia"],["erudicao","Erudição"]];
const P=[["armas_conjuracao","Disciplina"],["atletismo","Atletismo"],["furtividade","Furtividade"],["artesao","Artesão"],["apresentacao","Apresentação"],["coleta","Coleta"]];
const GROUPS={attr:A,know:K,practice:P},SOURCE_PROPS={attr:"attributes",know:"knowledges",practice:"practices"};
const DICE_ATTR=[[4],[6],[6,6],[6,6,6],[6,6,10],[6,10,10],[10,10,10]];
const DICE_FORM=[[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
const FACES={
 4:[[0,0,0],[0,0,0],[0,0,1],[0,1,1]],
 6:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0]],
 10:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1]],
 12:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[1,2,1],[0,0,2]],
 20:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,1,0],[2,1,0],[2,1,1],[2,2,1],[2,2,1],[0,0,2],[2,2,0],[3,2,0],[4,2,0],[0,0,4],[4,2,0],[5,2,1],[6,2,1],[8,0,0]]
};
const AT_COST=[0,1,3,7,15,31,55];
const TRAIN_COST=[0,2,8,20,38,66,102];
const CREATE_BUDGET={attr:6,training:8,skills:5}; // 5 XP Perícias DEFINIDO; 6+8 experimentais.
const XP_LEVEL_REFERENCE=[0,19,31,46,64,86,110,137,167,200,235,271,309,349,391,434,478,523,569,616,664]; // EXPERIMENTAL, não fixa nível.
const SKILLS=[
 ["combate","Combate","+1A em combate pertinente.",1],
 ["armas","Armas 1","Habilita uma categoria de arma, inclusive Punhos.",2],
 ["marciais","Artes Marciais","Especialização em Punhos. Requisito provisório em playtest.",1],
 ["montar","Montar Animal","Requer Influência grau 2.",2],
 ["provocacao-sofisticada","Provocação Sofisticada","Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.",1],
 ["combinacao","Combinação de Fontes","Habilita propor a terceira fonte pertinente.",2],
 ["criar-item-foco-magia","Criar Item de Foco e Magia","1 XP · Disciplina 1 + Inteligência 1. SUBSTITUI Aprendiz de Conjurador e Magia Única. Ativa UM efeito Psíquico no acerto por 1 PP/2 Coragens; foco por Artesão recarrega em N rodadas no Grau N. Desde Disciplina 2, pode criar fora de combate magias G2/G3 por 1 PP/2 Coragens e memorizar em slots; Criar Magia reduz 1 ponto do peso mental de magia criada e memorizada, mesmo com foco (G2=1, G3=2, G4=3); peso mínimo de G1 pendente. Capacidade mental é 1 ponto por Grau de Disciplina, não por dado. Pesos nominais G1=1, G2=2, G3=3, G4=4. Conjuração rápida da magia preparada conforme regras ainda pendentes.",1],
 ["escudo-arcano","Escudo Arcano","Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 PP ou 2 Coragens. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 PP/2 Coragens amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa.",1],
 ["conjuracao-equilibrada","Conjuração Equilibrada","1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Por 1 PP ou 2 Coragens altera a magia para Pesada ou Leve. PENDENTE: confirmar se é só peso tático, não mudança do Grau numérico nem dos pesos de slots.",1],
 ["peritoconj","Perito Conjurador","Combinação pertinente à Conjuração.",2],
 ["improviso","Improviso Elemental","Requisitos Disciplina 1, Inteligência 1, Destreza 1 e Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.",1],
 ["mestre","Maestria Elemental","Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. Custo 1 PP ou 2 Coragens para mesclar dois elementos e ativar simultaneamente as propriedades especiais dos dois, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.",1],
 ["fogo","Perícia em Elemento Fogo","1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Permite conjurar magias Leves de Fogo. Em ataque acertado, mesmo sem crítico, 1 PP/2 Coragens ativa UM efeito especial. G1: disparo a distância causa dano à armadura, sem queimadura direta à Vida; iluminar e conduzir chamas com fonte/faísca disponível (lamparina, isqueiro, foco pequeno encantado ou luvas de faísca); não invoca fogo do nada. G2: área 4×4, cone/linha/círculo, dano à Vida e armadura; SEM FOCO invocar fogo custa 1 Coragem ADICIONAL à ativação normal: 1 PP + 1 Coragem ou 3 Coragens. G3: conjurar no final do turno dos aliados, área 8×8, círculo/cone/linha. Pode amplificar pequena faísca em incêndios; dano persistente, unidade das áreas e alcance pendentes. Não automatizado.",1],
 ["agua","Perícia em Elemento Água","1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Habilita magias Leves de Água. Em ataque acertado, mesmo sem crítico, 1 PP/2 Coragens ativa UM efeito especial. G1: Congelar por 1 rodada sem dano no estado Leve; extrair água do ar, mover, molhar e limpar. G2: Perfurar no CRÍTICO ou por ativação paga; dano à Vida e à armadura. G3: conjurar no final do turno dos aliados; Empurrar, Perfurar, Congelar e dano à Vida e à armadura, mantendo propriedades menores pertinentes. Resolução e efeitos exatos não automatizados.",1],
 ["vento","Perícia em Elemento Ar","1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Habilita magias Leves de Ar. No acerto, mesmo sem crítico, gaste 1 PP ou 2 Coragens para escolher UM efeito especial. G1: autoempurrão +4 m de deslocamento; puxar/empurrar objetos; linha, círculo, cone, X. G2: sufocar com dano à Vida ou armadura, puxar, empurrar + derrubar com dano, deslocamento até +8 m. G3: conjurar no final do turno dos aliados, área grande e múltiplos alvos, tornado/rajada, possíveis danos por queda (16 m ainda sem interpretação geométrica). Formas: linha, círculo, cone, X. TAMBÉM pode recuperar Fôlego (Grau, quantidade e gatilho pendentes). Efeitos não automatizados.",1],
 ["terra","Perícia em Elemento Terra","1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Conjuração elemental Leve de Terra. Ao acertar ataque, inclusive não crítico, 1 PP ou 2 Coragens ativa UM efeito escolhido. G1: Desvantagem 2 RODADAS (terra nos olhos), emaranhar pés, derrubar, lançar pequenas pedras, criar plataformas de deslocamento, sentido sísmico 18×18 m para detectar furtivos e armadilhas. G2: enredar e imobilizar, Desvantagem 2 TURNOS, espinhos danificam armadura/proteção, sentido sísmico 32×32. G3: conjurar ao final do turno dos aliados, área 5×5, linha/cone/círculo A PARTIR DO ALVO, dano, empurrão e derrubada, sentido sísmico 64×64. Unidades não informadas e efeitos adicionais não automatizados.",1],
 ["sagrado","Perícia em Elemento Sagrado","Requisitos Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia; magias Leves. Ativação especial 1 PP ou 2 Coragens. Suporte em si ou aliado próximo exige alcançar a DE do beneficiário. Cada E excedente recupera 1 Coragem, cada P não anulado cancela um E destinado a recuperação (não reaproveitado como dano). Em área, todos os aliados beneficiados recuperam igualmente; E excedentes podem causar dano aos inimigos cujas DEs foram alcançadas. Conjurador escolhe enfoque em dano, suporte ou combinação. Aliados não sofrem dano sagrado de suporte. G2/G3 por combinação elemental.",2],
 ["veneno","Perícia em Elemento Veneno","Requisitos Disciplina 2, Inteligência 2, Alquimia 2 e Medicina 2; magias Leves. Ativação especial 1 PP ou 2 Coragens. Acerto em alvo com Sangramento aplica 1 acúmulo por 2 rodadas; novas aplicações não renovam anteriores. Envenenamento compara-se à Vida atual: ao atingir 2/3 aplica Ferido, depois Incapacitado (limiar intermediário pendente), ao alcançar toda a Vida atual fica Inconsciente. Incapacitado custa 1 Coragem/Pavor para agir, Inconsciente custa 2. Imunidades de pedra, mecânicas e outras criaturas pertinentes. G2/G3 por combinação.",2],
 ["sangue","Perícia em Elemento Sangue","Requisitos Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia; magias Leves. Ativação especial 1 PP ou 2 Coragens. Conjurar sem Sangramento próprio custa inicialmente 2 Vida mesmo em falha; autoaplicar Sangramento na conjuração reduz esse custo para 1 Vida; se já estava em Sangramento, o custo inicial é zero. +1P comum na conjuração. Ao acertar alvo em Sangramento ou já danificado na Vida, escolher 2 Vida diretos (não comba com colossal) OU dano convencional de Integridade com sangue coagulado, consumido no uso. Sangue fluido pode ser remanipulado sem aumento de dano, mas alvo único sem mescla. Transfusão é outra Perícia. G2/G3 por combinação.",2],
 ["trevas","Perícia em Elemento Trevas","Requisitos Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia; magias Leves. Ativação especial 1 PP ou 2 Coragens após acerto mesmo sem crítico. Escurecimento, Pavor e maldições. Técnica especializada usa uma única rolagem contra até dois alvos distintos, comparada à DE de cada alvo; depois de acertar soma +2P só ao cálculo do dano, nunca à DE, sem gerar Pavor ou intervenção extras. G2/G3 por combinação.",2],

 ["armas-leves","Perícia em Armas Leves","Armas 1; 2 XP. Crítico ativa efeitos; acerto sem crítico exige 1 PP/2 Coragens. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.",2],
 ["armas-medias","Perícia em Armas Médias","Disciplina 1 + Força 1; 2 XP. Crítico ativa efeitos; acerto não crítico 1 PP/2 Coragens. Ignora Desvantagem de peso contra médios. Não automatizado.",2],
 ["armas-pesadas","Perícia em Armas Pesadas","Disciplina 2 + Força 2; 2 XP. Crítico ativa efeitos; acerto não crítico 1 PP/2 Coragens. Ignora Desvantagem de peso contra leves. Não automatizado.",2],
 ["disciplina-avancada","Disciplina Avançada","Disciplina 2; ao realizar uma ação com Disciplina, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.",1],
 ["manejo-perfeito","Manejo Perfeito — Armas Corpo a Corpo","Disciplina Avançada + Destreza 2. Arma certa: Vantagem Absoluta; se já possui, Golpe Certo. XP e Golpe Certo PENDENTES.",null],
 ["golpe-fulminante","Golpe Fulminante","Disciplina 2 + Força 2 + especialização corpo a corpo. Ativação: 1 PP/2 Coragens; em acerto, Pavor mantido não anulado vale 1 dano cada. Não automatizado.",1],
 ["espalhar-golpe","Espalhar Golpe","Disciplina 2 + Destreza 1 + Golpe Fulminante + especialização corpo a corpo. Raio 2 m centrado no atacante; 1 PP/2 Coragens por alvo ADICIONAL; mesmo resultado da rolagem principal contra a DE de CADA alvo adicional (se inferior, erra); CUSTO CONSUMIDO mesmo em erro do alvo adicional; metade do dano dos Êxitos ARREDONDADA PARA BAIXO; SEM +1E. Não automatizado.",1],
 ["pugilismo","Pugilismo","Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 PP/2 Coragens para mudar peso do soco. Pesos disponíveis PENDENTES.",1],
 ["artista-marcial","Artista Marcial","Disciplina 2 + Pugilismo + Destreza 2. 1 PP/2 Coragens por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.",1],
 ["maestria-arremesso-armas","Maestria em Arremesso de Armas","Armas Leves + FOR 2, DES 2, AGI 1; 1 PP/2 Coragens. Arremessa arma Leve até 24 m e segue efeitos de alojamento. Não automatizado.",1],
 ["disparo-fulminante","Disparo Fulminante","Ramo de distância/arremesso separado de Golpe Fulminante. Requisitos, XP e ativação PENDENTES.",null],
 ["disparo-multiplo","Disparo Múltiplo","Ramo de distância/arremesso; círculo de 2 metros ao redor do ALVO principal. Mesmo resultado do primeiro disparo contra a DE de cada alvo, sem novas rolagens; abaixo da DE erra. Requisitos, XP e detalhes de disparos PENDENTES.",null],
 ["recuperacao-vigorosa","Recuperação Vigorosa","Vigor 3; acelera últimos pontos da caixa Machucado. Custo XP PENDENTE.",null],
 ["recuperacao-movimento","Maestria em Recuperação Vigorosa em Movimento","Recuperação Vigorosa e Vigor 6; cura natural em viagem após 8h sem dano. Custo XP PENDENTE.",null],
 ["recobrar-coragem","Recobrar Coragem","1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.",1],
 ["maestria-manejo-duplo","Maestria em Manejo Duplo","Requisitos anteriores (a esclarecer) + Destreza 2 + Agilidade 1. Um golpe com duas armas; Armas + Armas + Atributo; efeitos das duas em crítico. Compra pendente.",1],
 ["instinto-sobrevivencia","Instinto de Sobrevivência","Vigor 3; ao ficar Incapacitado ignora −1A; −2E permanece. Custo XP PENDENTE.",null],
 ["arma-certa","Maestria Arma Certa","+1E com peso favorável. Custo de XP pendente.",null]
 ["criar-veneno","Criar Veneno","Requisito de Criar Antídoto, mas aquisição, custo e preparo ainda pendentes nesta leva. Compra bloqueada até decisão do autor.",null],
 ["criar-antidoto","Criar Antídoto","Requisitos Artesão 1, Inteligência 2, Alquimia 2, Medicina 2 e Criar Veneno. 1 XP. Preparar doses com materiais venenosos coletados. Ingerir ou aplicar em Sangramento: cada dose não diluída remove 1 acúmulo de Envenenamento. Hemomante pode conduzir por Transfusão à distância com sacrifício de Vida e gasto das doses. Criar Veneno ainda precisa de definição para habilitar compra.",1],
 ["transfusao","Transfusão","Perícia separada de Elemento Sangue, compra e requisitos próprios ainda pendentes. Pode agir em combate se conjurador e alvo estiverem em Sangramento: transfere 1 Vida própria, recuperando 1 Vida do beneficiário. Pode levar Antídoto à distância ao custo de 1 Vida e das doses usadas, sem duplicação. Não gera Vida adicional.",null],
];

// Facetas servem à navegação: uma associação temática nunca se torna pré-requisito.
const SKILL_AFFINITY={
 combate:["practice:armas_conjuracao"],armas:["practice:armas_conjuracao"],marciais:["practice:armas_conjuracao"],
 montar:["attr:influencia"],"provocacao-sofisticada":["attr:influencia","practice:apresentacao"],
 combinacao:[],
 "criar-item-foco-magia":["practice:armas_conjuracao","attr:inteligencia","practice:artesao"],
 "escudo-arcano":["practice:armas_conjuracao","attr:inteligencia","attr:vigor"],
 "conjuracao-equilibrada":["practice:armas_conjuracao","attr:inteligencia","attr:destreza"],peritoconj:["practice:armas_conjuracao"],
 improviso:["practice:armas_conjuracao","attr:destreza","attr:inteligencia"],mestre:["practice:armas_conjuracao","attr:destreza","attr:inteligencia"],
 fogo:["practice:armas_conjuracao","attr:inteligencia","know:alquimia"],agua:["practice:armas_conjuracao","attr:inteligencia"],
 vento:["practice:armas_conjuracao","attr:inteligencia"],terra:["practice:armas_conjuracao","attr:inteligencia","know:engenharia"],
 sagrado:["practice:armas_conjuracao","attr:inteligencia","know:medicina"],veneno:["practice:armas_conjuracao","know:alquimia"],
 sangue:["practice:armas_conjuracao","know:medicina"],trevas:["practice:armas_conjuracao"],
 "criar-veneno":["know:alquimia","know:medicina"],"criar-antidoto":["practice:artesao","know:alquimia","know:medicina","attr:inteligencia"],transfusao:["practice:armas_conjuracao","know:medicina"],
 "armas-leves":["practice:armas_conjuracao"],"armas-medias":["practice:armas_conjuracao","attr:forca"],
 "armas-pesadas":["practice:armas_conjuracao","attr:forca"],"disciplina-avancada":["practice:armas_conjuracao"],
 "manejo-perfeito":["practice:armas_conjuracao","attr:destreza"],
 "golpe-fulminante":["practice:armas_conjuracao","attr:forca"],
 "espalhar-golpe":["practice:armas_conjuracao","attr:destreza"],
 pugilismo:["practice:armas_conjuracao","attr:forca","attr:destreza"],
 "artista-marcial":["practice:armas_conjuracao","attr:destreza"],
 "maestria-arremesso-armas":["practice:armas_conjuracao","attr:forca","attr:destreza","attr:agilidade"],
 "disparo-fulminante":["practice:armas_conjuracao"],"disparo-multiplo":["practice:armas_conjuracao"],
 "recuperacao-vigorosa":["attr:vigor","know:medicina"],
 "recuperacao-movimento":["attr:vigor","practice:atletismo","know:medicina"],
 "recobrar-coragem":["attr:influencia","practice:apresentacao"],
 "maestria-manejo-duplo":["practice:armas_conjuracao","attr:destreza","attr:agilidade"],
 "instinto-sobrevivencia":["attr:vigor","know:protecao"],
 "arma-certa":["practice:armas_conjuracao"]
};
const SKILL_BRANCHES=[
 ["armas","armas-leves","maestria-arremesso-armas","disparo-fulminante","disparo-multiplo"],
 ["armas","armas-leves","armas-medias","armas-pesadas","golpe-fulminante","espalhar-golpe","manejo-perfeito","maestria-manejo-duplo"],
 ["pugilismo","artista-marcial","golpe-fulminante","espalhar-golpe"],
 ["disciplina-avancada","manejo-perfeito","maestria-manejo-duplo"],
 ["recuperacao-vigorosa","recuperacao-movimento","instinto-sobrevivencia"],
 ["criar-item-foco-magia","escudo-arcano","conjuracao-equilibrada","peritoconj","improviso","mestre","fogo","agua","vento","terra","sagrado","veneno","sangue","trevas","criar-veneno","criar-antidoto","transfusao"],
 ["provocacao-sofisticada","combate","montar","recobrar-coragem"]
];

const CARD_REQUIREMENTS={
 "criar-item-foco-magia":"Disciplina 1, Inteligência 1",
 "escudo-arcano":"Inteligência 2, Vigor 1, Criar Foco",
 "conjuracao-equilibrada":"Disciplina 2, Inteligência 2, Destreza 2, Criar Foco",
 improviso:"Disciplina 1, Inteligência 1, Destreza 1, Criar Foco",
 mestre:"Disciplina 3, Inteligência 3, Destreza 3, Improviso, Criar Foco, Elemento",
 fogo:"Disciplina 1, Inteligência 1, Criar Foco",
 agua:"Disciplina 1, Inteligência 1, Criar Foco",
 vento:"Disciplina 1, Inteligência 1, Criar Foco",
 terra:"Disciplina 1, Inteligência 1, Criar Foco",
 sagrado:"Disciplina 2, Inteligência 2, Criar Foco",
 veneno:"Disciplina 2, Inteligência 2, Alquimia 2, Medicina 2",
 sangue:"Disciplina 2, Inteligência 2, Criar Foco",
 trevas:"Disciplina 2, Inteligência 2, Criar Foco",
 "criar-antidoto":"Artesão 1, Inteligência 2, Alquimia 2, Medicina 2, Criar Veneno"
};

const CARD_EFFECTS={
 "criar-item-foco-magia":"Prepara magias, focos e efeito Psíquico inicial.",
 "escudo-arcano":"Protege por 1 rodada; DE e Integridade vêm de E+P.",
 "conjuracao-equilibrada":"Altera a categoria da magia para Leve ou Pesada.",
 improviso:"+1A e elemento disponível na cena sem efeito especial.",
 mestre:"+1A cumulativo e dois efeitos de elementos habilitados.",
 fogo:"Fogo leve, dano e manipulação de chamas.",
 agua:"Água leve, congelamento e manipulação.",
 vento:"Ar leve, movimento e deslocamento.",
 terra:"Terra leve, terreno e percepção sísmica.",
 sagrado:"Êxitos excedentes recuperam Coragem; P anula recuperação.",
 veneno:"Envenena alvo em Sangramento; limiares usam Vida atual.",
 sangue:"Manipula Sangue: 2 Vida diretos ou dano à Integridade.",
 trevas:"Até dois alvos; +2P exclusivamente para dano após acerto.",
 "criar-veneno":"Preparo de Veneno ainda sem custo/regras definidos.",
 "criar-antidoto":"Uma dose não diluída neutraliza um acúmulo.",
 transfusao:"Transfere 1 Vida ou aplica Antídoto à distância."
};

const CARD_BRIEFS={
 "criar-item-foco-magia":"Inicia a conjuração Psíquica, permite preparar magias e fabricar focos. Efeitos especiais requerem acerto e ativação.",
 "escudo-arcano":"Escudo por uma rodada. A rolagem fornece DE/Integridade em E e P. Parede ou círculo; imunidade ao elemento e reações com Maestria.",
 "conjuracao-equilibrada":"Ajusta uma magia à categoria Leve ou Pesada mediante gasto, sem liberar dados nem novos Graus gratuitamente.",
 improviso:"Adiciona +1 Antecipar e um elemento presente na cena. O elemento ajuda no impacto e afinidades, mas não ativa sua propriedade especial.",
 mestre:"Mescla dois elementos em uma conjuração; aplica as propriedades de ambos se as duas Perícias tiverem sido adquiridas. +1A acumula com Improviso.",
 sagrado:"Recupera Coragem por Êxitos excedentes depois da DE. Pavor cancela recuperação sem voltar a virar dano. Em área, aliados recuperam igualmente.",
 trevas:"Escolhe até dois alvos usando a mesma rolagem; +2 Pavor são exclusivos para dano após o acerto, não para atingir DE nem gerar reserva.",
 sangue:"Sacrifício depende do Sangramento próprio: 2 Vida sem o estado, 1 ao autoaplicar e zero se já estiver Sangrando. Dano direto à Vida ou Integridade.",
 veneno:"Exige Sangramento no alvo. Cada aplicação soma um acúmulo por duas rodadas. Penalidades dependem da Vida atual, não da máxima.",
 "criar-antidoto":"Cada dose produzida com material venenoso neutraliza um acúmulo. Pode ser ingerida ou aplicada em Sangramento; exige a Perícia Criar Veneno.",
 "criar-veneno":"A compra de Criar Veneno ainda carece de custo e requisitos definidos pelo autor; não pode ser oferecida como compra final.",
 transfusao:"Perícia separada, utilizável em combate: transfere exatamente 1 Vida do Hemomante ao aliado ou leva Antídoto à distância consumindo doses.",
 fogo:"Manipula fogo disponível e técnicas especiais conforme Grau. Na versão inicial, o disparo não causa queimadura direta à Vida.",
 agua:"Manipula água, produz congelamento leve e abre efeitos de perfuração nos Graus superiores, com os custos pertinentes.",
 vento:"Manipula deslocamento e correntes de ar, incluindo autoempurrão e diferentes formas de manifestação.",
 terra:"Manipula terreno, dificulta movimentação e ajuda a detectar ameaças pelo sentido sísmico."
};

const CARD_ACTIVATIONS={
 "criar-item-foco-magia":"1 PP ou 2 Coragens para efeito Psíquico",
 "escudo-arcano":"1 PP ou 2 Coragens (+ custo por expansão)",
 "conjuracao-equilibrada":"1 PP ou 2 Coragens",
 improviso:"Passiva",mestre:"1 PP ou 2 Coragens",
 fogo:"1 PP ou 2 Coragens",agua:"1 PP ou 2 Coragens",vento:"1 PP ou 2 Coragens",
 terra:"1 PP ou 2 Coragens",sagrado:"1 PP ou 2 Coragens",veneno:"1 PP ou 2 Coragens",
 sangue:"1 PP ou 2 Coragens; Vida se aplicável",trevas:"1 PP ou 2 Coragens",
 "criar-veneno":"Pendente","criar-antidoto":"Dose preparada",transfusao:"Custo de Vida; PP/Coragem a confirmar"
};

function skillCompactCard([id,name,detail,cost],wizard){
 const owned=state.skills.includes(id),req=skillReq(id),affordable=Number.isInteger(cost)&&canAfford("skills",cost);
 const disabled=!!state.pending||(!owned&&(!!req||!affordable))||(owned&&state.creationLocked&&!editMode);
 const act=CARD_ACTIVATIONS[id]||(/1 PP|2 Coragens/i.test(detail)?"1 PP / 2 Coragens":"Passiva / consultar");
 const practical=CARD_EFFECTS[id]||detail.replace(/^\\d+ XP [·•] /,"").split(". ")[0].slice(0,105);
 const warning=req||(!owned&&!affordable?"XP insuficiente.":"");
 const button=owned?(state.creationLocked&&!editMode?"Adquirida ✓":"Desfazer"):cost===null?"Pendente":"Comprar · "+cost+" XP";
 return '<article tabindex="0" class="fp-skill fp-skill-compact'+(wizard?' fp-wiz-skill':'')+(owned?' owned selected':'')+'" data-skill-open="'+esc(id)+'" aria-label="Abrir detalhes de '+esc(name)+'">'+
 '<div class="fp-skill-content"><strong>'+esc(name)+'</strong><dl class="fp-skill-quick">'+
 '<div><dt>Requisitos</dt><dd>'+esc(CARD_REQUIREMENTS[id]||"Consultar verbete")+'</dd></div>'+
 '<div><dt>XP</dt><dd>'+esc(cost===null?"Pendente":cost+" XP")+'</dd></div>'+
 '<div><dt>Ativação</dt><dd>'+esc(act)+'</dd></div>'+
 '<div><dt>Efeito prático</dt><dd>'+esc(practical)+'</dd></div></dl></div>'+
 '<div class="fp-skill-preview" role="tooltip"><strong>Resumo</strong><p>'+esc(CARD_BRIEFS[id]||detail.slice(0,240))+'</p><small>Clique para abrir explicação completa.</small></div>'+
 '<div class="fp-skill-controls"><button type="button" data-action="skill" data-id="'+esc(id)+'" aria-pressed="'+owned+'" title="'+esc(warning)+'"'+(disabled?' disabled':'')+'>'+esc(button)+'</button>'+
 (warning?'<small class="fp-skill-req">'+esc(warning)+'</small>':'')+'</div></article>';
}
function openSkillDetails(id){
 const skill=SKILLS.find(item=>item[0]===id),dlg=$("skill-detail-dialog");if(!skill||!dlg)return;
 const [key,name,detail,cost]=skill;
 $("skill-detail-title").textContent=name;
 $("skill-detail-body").innerHTML='<dl class="fp-skill-modal-meta"><div><dt>Requisitos</dt><dd>'+esc(CARD_REQUIREMENTS[key]||"Consultar descrição")+'</dd></div>'+
 '<div><dt>XP</dt><dd>'+esc(cost===null?"Pendente":cost+" XP")+'</dd></div></dl>'+
 '<h4>Explicação completa</h4><p>'+esc(detail)+'</p>'+
 (skillReq(key)?'<p class="fp-skill-modal-warning">Para adquirir: '+esc(skillReq(key))+'</p>':'')+
 '<p class="fp-skill-modal-hint"><a href="../livro.html#conjuracao">Livro do Jogador — Conjuração</a>.</p>';
 if(!dlg.open)dlg.showModal();
}

const skillFilter={scope:"all",ready:false,query:""};
function skillRequirementsMet(id){
 if(id==="manejo-perfeito")return state.skills.includes("disciplina-avancada")&&(state.attributes.destreza||0)>=2;
 if(["maestria-manejo-duplo","disparo-fulminante","disparo-multiplo","arma-certa"].includes(id))return false;
 return !skillReq(id);
}
function filteredSkills(){
 const query=skillFilter.query.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 return SKILLS.filter(([id,name,description])=>{
  if(skillFilter.ready&&!skillRequirementsMet(id))return false;
  if(skillFilter.scope==="related"){
   if(!SKILL_BRANCHES.some(branch=>branch.includes(id)&&branch.some(k=>state.skills.includes(k))))return false;
  }else if(skillFilter.scope!=="all"&&!(SKILL_AFFINITY[id]||[]).includes(skillFilter.scope))return false;
  const str=(name+" "+description).toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  return !query||str.includes(query);
 });
}
function skillFilterControls(){
 const opt=(value,label)=>'<option value="'+value+'"'+(skillFilter.scope===value?" selected":"")+'>'+esc(label)+'</option>';
 const category=(label,group,items)=>'<optgroup label="'+label+'">'+items.map(([id,name])=>opt(group+":"+id,name)).join("")+'</optgroup>';
 return '<div class="fp-skill-filters">'+
  '<label>Pesquisar Perícia<input type="search" data-skill-search placeholder="Nome ou efeito..." value="'+esc(skillFilter.query)+'"></label>'+
  '<label>Organizar por<select data-skill-scope>'+opt("all","Todas as Perícias")+opt("related","Relacionadas às adquiridas")+
   category("Por Atributo","attr",A)+category("Por Conhecimento","know",K)+category("Por Prática","practice",P)+'</select></label>'+
  '<label class="fp-skill-ready"><input data-skill-ready type="checkbox"'+(skillFilter.ready?" checked":"")+'> Requisitos atingidos</label>'+
  '<p class="fp-skill-filter-hint">Atributos, Conhecimentos e Práticas organizam por requisito ou afinidade temática, não criam requisitos novos. <strong>'+filteredSkills().length+' de '+SKILLS.length+'</strong> Perícias exibidas.</p></div>';
}
function syncSkillFilterControls(){
 document.querySelectorAll("[data-skill-scope]").forEach(el=>el.value=skillFilter.scope);
 document.querySelectorAll("[data-skill-ready]").forEach(el=>el.checked=skillFilter.ready);
 document.querySelectorAll("[data-skill-search]").forEach(el=>{if(el!==document.activeElement)el.value=skillFilter.query;});
 document.querySelectorAll(".fp-skill-filter-hint strong").forEach(el=>el.textContent=filteredSkills().length+" de "+SKILLS.length);
}
function renderWizardSkillCards(){
 const container=$("wizard-skill-cards");
 if(container)container.innerHTML=wizardSkillCardsMarkup();
}

const WEIGHTS={muito_leve:["Muito leve",.0125],leve:["Leve",.125],medio:["Médio",.5],alto:["Alto / Pesado",1],extremo:["Extremo",2]};
const SITUATIONS={normal:["Normal",0,0],vantagem:["Vantagem (+1A)",0,1],desvantagem:["Desvantagem (−1A)",0,-1],absoluta:["Vantagem absoluta (+1E)",1,0],desv_absoluta:["Desvantagem absoluta (−1E)",-1,0],sorte:["Ação de Sorte (−2E)",-2,0]};
const $=id=>document.getElementById(id),esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
const key=x=>x?x.group+"."+x.key:"";
const same=(a,b)=>!!a&&!!b&&key(a)===key(b);
const pad=n=>Number(n).toLocaleString("pt-BR",{maximumFractionDigits:4});
const getId=()=>typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"item-"+Date.now()+"-"+Math.floor(Math.random()*1e6);
function defaultState(){return{
 schema:"codex-html-playtest-v1",name:"",concept:"",origin:"Humano",virtue:"",personality:"",portrait:"",
 level:1,attributes:{},knowledges:{},practices:{},skills:[],weaponFocus:"leve",creationLocked:false,creationBudgetSnapshot:null,
 xpEarned:0,legacyXPRefund:0,xpHistory:[],life:3,courage:10,pp:0,xp:0,
 items:[],notes:"",pending:null,history:[],courageUsedTurn:false
};}
let state=defaultState(),draft=null,toastTimer=null,wizardStep=0,wizardReached=0,viewMode="builder",editMode=false;
const WIZARD_STEPS=[
 ["Identidade","Quem é seu Aprendiz?","Nome, origem e conceito"],
 ["Atributos","Defina suas capacidades","Distribua os XP de Atributos"],
 ["Formação","Escolha seus caminhos","Práticas e Conhecimentos"],
 ["Perícias","Desperte suas habilidades","Especialize sua construção"],
 ["Revisão","Sua história começa aqui","Confira e confirme a ficha"]
];
const freshDraft=()=>({base:null,attribute:null,third:null,mode:"normal",de:1,situation:"normal",
  extraKeep:false,step:false,combatBonus:false,weightEnabled:false,attackWeight:"leve",targetWeight:"medio",
  contextOK:false});
function load(){
 let migrated=false,legacyAvailable=false;
 try{
  const saved=localStorage.getItem(SAVE_KEY);
  const oldRaw=localStorage.getItem(OLD_SAVE_KEY);
  legacyAvailable=!!oldRaw;
  if(saved)state=normalize(JSON.parse(saved));
  else if(oldRaw){
   const old=JSON.parse(oldRaw);
   const character=old?.character||old;
   const hasData=character&&typeof character==="object"&&(
    !!String(character.name||"").trim()||
    Object.values(character.attributes||{}).some(v=>Number(v)>0)||
    Object.values(character.sources||{}).some(v=>Number(v)>0)||
    (Array.isArray(character.skills)&&character.skills.length>0));
   if(hasData){
    const converted=fromCreator(old);
    converted.creationLocked=!!String(character.name||"").trim();
    state=normalize(converted);
    migrated=true;
   }
  }
 }catch(e){console.warn("Codex: falha ao recuperar ficha anterior",e);}
 draft=freshDraft();
 try{
  const w=JSON.parse(localStorage.getItem(WIZARD_KEY)||"{}");
  wizardStep=clamp(Math.floor(w.step||0),0,4);
  wizardReached=clamp(Math.floor(w.reached||wizardStep),wizardStep,4);
 }catch(e){wizardStep=0;wizardReached=0;}
 viewMode=state.creationLocked?"sheet":"builder";
 try{document.documentElement.dataset.theme=localStorage.getItem(THEME_KEY)==="light"?"light":"dark";}catch(e){}
 syncFields();render();
 $("import-old-creator").hidden=!legacyAvailable;
 if(migrated){
  save();
  toast("Ficha do antigo criador migrada. Dados originais preservados; confira as anotações.");
 }
}
function normalize(v){
 const s=defaultState();
 if(!v||typeof v!=="object")return s;
 for(const id of ["name","concept","origin","virtue","personality","notes"]){
  if(typeof v[id]==="string")s[id]=v[id].slice(0,id==="notes"?5000:100);
 }
 if(typeof v.portrait==="string"&&v.portrait.startsWith("data:image/")&&v.portrait.length<1600000)s.portrait=v.portrait;
 s.level=clamp(Math.floor(v.level||1),1,20);
 for(const group of Object.keys(GROUPS)){
  for(const [id] of GROUPS[group])s[SOURCE_PROPS[group]][id]=clamp(Math.floor(v[SOURCE_PROPS[group]]?.[id]||0),0,6);
 }
 const rawSkills=Array.isArray(v.skills)?[...new Set(v.skills.filter(x=>typeof x==="string"))]:[];
 const legacyCost=(rawSkills.includes("aprendiz")?2:0)+(rawSkills.includes("magia")?1:0);
 const qualifiesForFocus=(s.practices.armas_conjuracao||0)>=1&&(s.attributes.inteligencia||0)>=1;
 const shouldMigrateFocus=legacyCost>0&&qualifiesForFocus&&!rawSkills.includes("criar-item-foco-magia");
 const legacyDifference=legacyCost-(shouldMigrateFocus?1:0);
 s.skills=[...new Set(rawSkills.filter(x=>SKILLS.some(y=>y[0]===x&&Number.isInteger(y[3]))))];
 if(shouldMigrateFocus)s.skills.push("criar-item-foco-magia");
 if(legacyCost>0&&!s.notes.includes("Migração conjuração 2026:")){
  const outcome=qualifiesForFocus?"Perícias antigas substituídas por Criar Item de Foco e Magia (1 XP).":
   "Perícias antigas encerradas, mas a nova exige Disciplina 1 e Inteligência 1; o XP correspondente foi liberado, adquira a nova Perícia após cumprir requisitos.";
  s.notes=(s.notes+String.fromCharCode(10)+"Migração conjuração 2026: "+outcome+" Crédito calculado sem duplicar reembolso.").trim().slice(0,5000);
 }
 if(Array.isArray(v.skills)&&v.skills.includes("raio")&&!s.notes.includes("Legado Raio:")){
  s.notes=(s.notes+"\nLegado Raio: habilitação antiga removida; Raio agora é condição, não elemento. O XP da compra antiga foi liberado para redistribuição.").trim().slice(0,5000);
 }
 s.weaponFocus=["leve","medio","pesado","distancia","Punhos"].includes(v.weaponFocus)?v.weaponFocus:"leve";
 s.xpEarned=clamp(Math.floor(v.xpEarned??v.xp??0),0,1000000);
 s.legacyXPRefund=clamp(Math.floor(v.legacyXPRefund||0),0,1000000);
 s.creationLocked=!!v.creationLocked||s.level>1;
 // Snapshot da criação: preservar a distribuição anterior ao substituir as Perícias antigas.
 if(s.creationLocked){
  const used=rawCreationCosts(s),saved=v.creationBudgetSnapshot;
  const formerSkillsCost=used.skills+legacyDifference;
  s.creationBudgetSnapshot=saved&&["attr","training","skills"].every(k=>Number.isInteger(saved[k])&&saved[k]>=0&&saved[k]<=CREATE_BUDGET[k])?
   {attr:saved.attr,training:saved.training,skills:saved.skills}:
   {attr:Math.min(used.attr,CREATE_BUDGET.attr),training:Math.min(used.training,CREATE_BUDGET.training),
    skills:Math.min(formerSkillsCost,CREATE_BUDGET.skills)};
  if(legacyCost>0&&legacyDifference>0){
   const oldGeneral=Math.max(0,formerSkillsCost-s.creationBudgetSnapshot.skills);
   const newGeneral=Math.max(0,used.skills-s.creationBudgetSnapshot.skills);
   const alreadyRefunded=oldGeneral-newGeneral;
   s.legacyXPRefund+=Math.max(0,legacyDifference-alreadyRefunded);
  }
 }
 s.xpHistory=Array.isArray(v.xpHistory)?v.xpHistory.slice(0,60).map(x=>({
  at:String(x.at||"").slice(0,40),amount:clamp(Math.floor(x.amount),0,1000000),note:String(x.note||"").slice(0,100)
 })):[];
 s.life=clamp(Math.floor(v.life),0,maxLife(s));
 s.courage=clamp(Math.floor(v.courage??10),0,10);
 s.pp=clamp(Math.floor(v.pp),0,maxPP(s.level));
 s.xp=clamp(Math.floor(v.xp),0,1e9);
 s.items=Array.isArray(v.items)?v.items.slice(0,150).map(item=>normalizeItem(item)):[];
 for(const item of s.items)if(item.equipped&&item.type==="armadura"&&!canEquipArmor(s,item))item.equipped=false;
 s.history=Array.isArray(v.history)?v.history.slice(0,20):[];
 s.courageUsedTurn=!!v.courageUsedTurn;
 if(v.pending&&Array.isArray(v.pending.dice)&&Array.isArray(v.pending.selected)&&v.pending.dice.length<=9){
  s.pending={...v.pending,selected:v.pending.selected.filter(x=>typeof x==="string")};
 }
 return s;
}
function normalizeItem(it={}){
 const type=["arma","armadura","escudo","foco","ferramenta","outro"].includes(it.type)?it.type:"outro";
 const grade=clamp(Math.floor(it.grade??1),1,4),qty=clamp(Math.floor(it.qty??1),1,99);
 const weight=Object.hasOwn(WEIGHTS,it.weight)?it.weight:"leve";
 const max=type==="armadura"&&weight==="muito_leve"?0:clamp(Math.floor(it.max??0),0,999);
 return {id:String(it.id||getId()).slice(0,80),name:String(it.name||"Item sem nome").slice(0,90),
  type,weight,grade,qty,max,hp:clamp(Math.floor(it.hp??max),0,max),equipped:!!it.equipped,
  elementalResistance:String(it.elementalResistance||"").slice(0,70),
  secondResistance:String(it.secondResistance||"").slice(0,70),specificImmunity:String(it.specificImmunity||"").slice(0,70),
  g4ElementalMode:it.g4ElementalMode==="immunity"?"immunity":"resistances"}; // Campo legado preservado, não concede proteção na nova regra.
}
function save(){
 try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));$("save-indicator").textContent="Salvo neste navegador";}catch(e){
  $("save-indicator").textContent="Não foi possível salvar; exporte a ficha.";console.warn(e);
 }
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800);}
function maxLife(s=state){return 3+(s.attributes.vigor||0)+Math.floor((s.attributes.forca||0)/2);}
function maxPP(l=state.level){return l>=20?3:l>=10?2:l>=5?1:0;}
function rawCreationCosts(s=state){
 return {attr:A.reduce((n,[k])=>n+AT_COST[s.attributes[k]||0],0),
  training:K.reduce((n,[k])=>n+TRAIN_COST[s.knowledges[k]||0],0)+P.reduce((n,[k])=>n+TRAIN_COST[s.practices[k]||0],0),
  skills:s.skills.reduce((n,id)=>n+(SKILLS.find(x=>x[0]===id)?.[3]||0),0)};
}
function unusedInitialXP(spent){
 return ["attr","training","skills"].reduce((n,k)=>n+Math.max(0,CREATE_BUDGET[k]-spent[k]),0);
}
function xpCosts(s=state){
 const spent=rawCreationCosts(s),attributes=spent.attr,training=spent.training,skills=spent.skills;
 const budget=s.creationLocked&&s.creationBudgetSnapshot?s.creationBudgetSnapshot:CREATE_BUDGET;
 const generalSpent=["attr","training","skills"].reduce((n,k)=>n+Math.max(0,spent[k]-budget[k]),0);
 const initialCarryover=s.creationLocked&&s.creationBudgetSnapshot?unusedInitialXP(budget):0;
 const free=(s.xpEarned||0)+(s.legacyXPRefund||0)+initialCarryover-generalSpent;
 return {attributes,training,skills,total:attributes+training+skills,generalSpent,free,initialCarryover,
  initialRemaining:Math.max(0,initialCarryover-generalSpent),
  evolutionRemaining:Math.max(0,(s.xpEarned||0)-Math.max(0,generalSpent-initialCarryover))};
}
function lockCreation(){
 if(state.creationLocked)return 0;
 const spent=rawCreationCosts(state);
 state.creationBudgetSnapshot={attr:Math.min(CREATE_BUDGET.attr,spent.attr),
  training:Math.min(CREATE_BUDGET.training,spent.training),skills:Math.min(CREATE_BUDGET.skills,spent.skills)};
 state.creationLocked=true;
 return unusedInitialXP(state.creationBudgetSnapshot);
}
function xpStepCost(group,k,delta){
 const table=group==="attr"?AT_COST:TRAIN_COST,field=SOURCE_PROPS[group];
 const g=state[field][k]||0,next=clamp(g+delta,0,6);
 return Math.max(0,table[next]-table[g]);
}
function canAfford(group,cost){
 const totals=xpCosts(),cat=group==="attr"?"attributes":group==="skills"?"skills":"training";
 const category=group==="attr"?"attr":group==="skills"?"skills":"training";
 const cap=(state.creationLocked&&state.creationBudgetSnapshot?state.creationBudgetSnapshot:CREATE_BUDGET)[category];
 const additional=Math.max(0,totals[cat]+cost-cap)-Math.max(0,totals[cat]-cap);
 return cost>=0&&totals.free>=additional;
}
function skillReq(id,s=state){
 const has=x=>s.skills.includes(x);
 const disc=s.practices.armas_conjuracao||0;
 const strength=s.attributes.forca||0,dex=s.attributes.destreza||0,agi=s.attributes.agilidade||0,vig=s.attributes.vigor||0;
 const meleeSpecialty=["armas-leves","armas-medias","armas-pesadas","pugilismo"].some(has);
 // Perícia em Manejo Duplo continua sem definição/publicação neste catálogo e não pode habilitar a compra por ora.
 if(id==="armas-leves"&&!has("armas"))return"Requer Perícia Armas 1.";
 if(id==="armas-medias"&&(disc<1||strength<1))return"Requer Disciplina 1 e Força 1.";
 if(id==="armas-pesadas"&&(disc<2||strength<2))return"Requer Disciplina 2 e Força 2.";
 if(id==="disciplina-avancada"&&disc<2)return"Requer Disciplina 2.";
 if(id==="criar-item-foco-magia"&&(disc<1||(s.attributes.inteligencia||0)<1))return"Requer Disciplina 1 e Inteligência 1.";
 if(["vento","agua","terra","fogo"].includes(id)&&(disc<1||(s.attributes.inteligencia||0)<1||!has("criar-item-foco-magia")))return"Requer Disciplina 1, Criar Item de Foco e Magia e Inteligência 1.";
 if(id==="sagrado"&&(disc<2||(s.attributes.inteligencia||0)<2||!has("criar-item-foco-magia")))return"Requer Disciplina 2, Criar Item de Foco e Magia e Inteligência 2.";
 if(id==="escudo-arcano"&&((s.attributes.inteligencia||0)<2||vig<1||!has("criar-item-foco-magia")))return"Requer Inteligência 2, Vigor 1 e Criar Item de Foco e Magia.";
 if(id==="conjuracao-equilibrada"&&(disc<2||(s.attributes.inteligencia||0)<2||dex<2||!has("criar-item-foco-magia")))return"Requer Disciplina 2, Criar Item de Foco e Magia, Inteligência 2 e Destreza 2.";
 if(id==="golpe-fulminante"&&(disc<2||strength<2||!meleeSpecialty))return"Requer Disciplina 2, Força 2 e especialização corpo a corpo (Armas Leves/Médias/Pesadas, Manejo Duplo ou Pugilismo). Maestria em Arremesso não habilita este golpe.";
 if(id==="espalhar-golpe"&&(disc<2||dex<1||!has("golpe-fulminante")||!meleeSpecialty))return"Requer Disciplina 2, Destreza 1, Golpe Fulminante e especialização corpo a corpo.";
 if(id==="pugilismo"&&(disc<1||strength<2||dex<1))return"Requer Disciplina 1, Força 2 e Destreza 1.";
 if(id==="artista-marcial"&&(disc<2||dex<2||!has("pugilismo")))return"Requer Disciplina 2, Destreza 2 e Pugilismo.";
 if(id==="maestria-arremesso-armas"&&(!has("armas-leves")||strength<2||dex<2||agi<1))return"Requer Perícia em Armas Leves, Força 2, Destreza 2 e Agilidade 1.";
 if(["recuperacao-vigorosa","instinto-sobrevivencia"].includes(id)&&vig<3)return"Requer Vigor 3; custo XP pendente.";
 if(id==="recuperacao-movimento"&&(vig<6||!has("recuperacao-vigorosa")))return"Requer Recuperação Vigorosa e Vigor 6; custo XP pendente.";
 if(id==="manejo-perfeito")return"Requer Disciplina Avançada e Destreza 2; XP e Golpe Certo pendentes.";
 if(id==="maestria-manejo-duplo")return"Destreza 2 e Agilidade 1 definidos, mas combinação dos demais requisitos de Manejo Duplo está pendente; compra bloqueada.";
 if(["disparo-fulminante","disparo-multiplo"].includes(id))return"Ramo de distância/arremesso; requisitos e XP serão definidos pelo autor.";
 if(id==="arma-certa")return"Custo de XP e requisitos definitivos ainda pendentes.";
 if(id==="marciais"&&(!has("armas")||s.weaponFocus!=="Punhos"||disc<1))
  return"EXPERIMENTAL: requer Armas 1 (foco Punhos) e Disciplina grau 1.";
 if(id==="montar"&&(s.attributes.influencia||0)<2)return"Requer Influência grau 2.";
 if(id==="provocacao-sofisticada"&&(s.attributes.influencia||0)<2)return"Requer Influência grau 2.";
 if(id==="improviso"&&(disc<1||(s.attributes.inteligencia||0)<1||dex<1||!has("criar-item-foco-magia")))return"Requer Disciplina 1, Inteligência 1, Destreza 1 e Criar Item de Foco e Magia.";
 if(id==="mestre"&&(disc<3||(s.attributes.inteligencia||0)<3||dex<3||!has("criar-item-foco-magia")||!has("improviso")||!["vento","sangue","agua","fogo","terra","veneno","sagrado","trevas"].some(has)))return"Requer Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e uma Perícia elemental.";
 if(["sangue","trevas"].includes(id)&&(disc<2||(s.attributes.inteligencia||0)<2||!has("criar-item-foco-magia")))return"Requer Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia.";
 if(id==="veneno"&&(disc<2||(s.attributes.inteligencia||0)<2||(s.knowledges.alquimia||0)<2||(s.knowledges.medicina||0)<2))return"Requer Disciplina 2, Inteligência 2, Alquimia 2 e Medicina 2.";
 if(id==="criar-antidoto"&&((s.practices.artesao||0)<1||(s.attributes.inteligencia||0)<2||(s.knowledges.alquimia||0)<2||(s.knowledges.medicina||0)<2||!has("criar-veneno")))return"Requer Artesão 1, Inteligência 2, Alquimia 2, Medicina 2 e Criar Veneno.";
 if(id==="criar-veneno"||id==="transfusao")return"Compra ainda pendente de custo ou regras de aquisição.";
 if(id==="peritoconj"&&!has("criar-item-foco-magia"))return"Requer Criar Item de Foco e Magia.";
 return null;
}
function dependentsValid(testState){
 const invalid=testState.skills.find(id=>skillReq(id,testState));
 return invalid?skillReq(invalid,testState):null;
}
function movement(s=state){return 8+(s.attributes.agilidade||0)+Math.floor((s.practices.atletismo||0)/3);}
function renderXP(){
 const x=xpCosts();
 $("xp-total-spent").textContent=x.total+" XP";
 $("xp-earned-text").textContent=(state.xpEarned||0)+" XP";
 $("xp-free-text").textContent=(x.free<0?"−":"")+Math.abs(x.free)+" XP";
 $("xp-free-text").classList.toggle("fp-negative",x.free<0);
 $("build-status").textContent=editMode?"Modo edição · corrigindo a ficha":state.creationLocked?"Progressão · compras permanentes":"Aprendiz · orçamento experimental";
 $("lock-creation").disabled=state.creationLocked||!!state.pending||x.free<0;
 $("lock-creation").textContent=state.creationLocked?"Criação concluída ✓":"Concluir criação";
 $("level-up").disabled=state.level>=20||!!state.pending||x.free<0;
 $("xp-award").disabled=!!state.pending;
 $("xp-next-level").textContent=state.level>=20?"Nível máximo":XP_LEVEL_REFERENCE[state.level+1]+" XP*";
 for(const [type,used,id] of [["attr",x.attributes,"xp-attr"],["training",x.training,"xp-training"],["skills",x.skills,"xp-skill"]]){
  const cap=CREATE_BUDGET[type];
  $(id+"-caption").textContent=used+" / "+cap+" XP"+(used>cap?" · XP adicional":"");
  const bar=$(id+"-bar");bar.style.width=Math.min(100,used/cap*100)+"%";bar.classList.toggle("over",used>cap);
 }
 $("xp-feedback").textContent=x.free<0?"Saldo insuficiente: faltam "+Math.abs(x.free)+" XP. Adicione XP ou reorganize as compras ainda não consolidadas.":
  (state.creationLocked?"XP inicial não utilizado e liberado: "+x.initialCarryover+"; disponível dessa sobra: "+x.initialRemaining+". ":"5 XP de Perícias definidos no nível 1; 6 XP de Atributos e 8 de Formação experimentais. ")+
  (state.legacyXPRefund?"Crédito de migração de Perícias de conjuração: "+state.legacyXPRefund+" XP. ":"")+"Avanços consomem o saldo livre."+ (editMode?" Modo edição: use + e − para corrigir graus e XP; isso não é reembolso de campanha.":state.creationLocked?" Após a criação não há reembolso livre.":"");
 $("char-level").value=state.level;
}
function deNatural(s=state){
 return Math.min(9,(s.attributes.agilidade||0)+Math.floor((s.attributes.destreza||0)/2)+
  Math.floor((s.attributes.vigor||0)/2)+Math.floor((s.practices.atletismo||0)/3));
}
function canEquipArmor(s=state,it=null){
 if(!it||it.type!=="armadura")return true;
 const minLevel=it.grade===4?20:it.grade===3?10:it.grade===2?5:1;
 if(s.level<minLevel)return false;
 if(it.weight==="extremo"&&((s.attributes.vigor||0)<6||(s.practices.atletismo||0)<6))return false;
 return true;
}
function equippedArmor(s=state){return s.items.find(it=>it.type==="armadura"&&it.equipped&&canEquipArmor(s,it))||null;}
function armorDePenalty(s=state){
 const it=equippedArmor(s);
 return it?.weight==="alto"?1:it?.weight==="extremo"?2:0;
}
function armorDodgeBonus(s=state){
 const it=equippedArmor(s);
 return it?.weight==="muito_leve"?2:it?.weight==="leve"?1:0;
}
function deDefense(s=state){return Math.max(0,deNatural(s)-armorDePenalty(s));}
function deDodge(s=state){return deDefense(s)+armorDodgeBonus(s);}
function balance(){const a=state.attributes.agilidade||0,v=state.attributes.vigor||0;return a>v?"Leve":a<v?"Pesado":"Médio";}
function capacity(){return 1+Math.floor((state.attributes.forca||0)/3)+Math.floor((state.attributes.vigor||0)/3)+Math.floor((state.practices.armas_conjuracao||0)/3)+Math.floor((state.practices.atletismo||0)/3);}
function loadUsed(){return state.items.reduce((n,it)=>n+WEIGHTS[it.weight][1]*it.qty,0); /* Focos usam carga física convencional; não são anulados por slots mentais. */}
function keepLimit(extra=false){return Math.min(4,(state.level>=6?3:2)+(extra?1:0));}
function face(sides,number){return FACES[sides]?.[number-1]||[0,0,0];}
function dataDice(g,grade){return [...(g==="attr"?DICE_ATTR:DICE_FORM)[grade||0]];}
function mentalSlotCapacity(s=state){
 // DEFINIDO: cada Grau investido em Disciplina vale 1 ponto de capacidade mental.
 // A quantidade de dados da rolagem não altera essa capacidade.
 return clamp(Math.floor(s.practices.armas_conjuracao||0),0,6);
}
function label(g,k){
 const source=(GROUPS[g]||[]).find(x=>x[0]===k);return source?.[1]||k;
}
function dieIcon(n){
 const shapes={
 4:'<polygon points="21,4 39,36 3,36"/><path d="M21 4 L21 27 L3 36 M21 27 L39 36"/>',
 6:'<polygon points="21,3 37,12 37,30 21,39 5,30 5,12"/><path d="M5 12 L21 21 L37 12 M21 21 L21 39"/>',
 10:'<polygon points="21,2 35,14 32,32 21,40 10,32 7,14"/><path d="M7 14 L21 9 L35 14 M21 9 L21 40 M7 14 L21 25 L35 14 M21 25 L10 32 M21 25 L32 32"/>',
 12:'<polygon points="21,2 35,8 40,21 34,34 21,40 8,34 2,21 7,8"/><path d="M21 9 L31 16 L28 29 L14 29 L11 16 Z M21 2 L21 9 M35 8 L31 16 M40 21 L31 16 M34 34 L28 29 M21 40 L28 29 M8 34 L14 29 M2 21 L11 16 M7 8 L11 16"/>',
 20:'<polygon points="21,2 34,8 40,21 34,35 21,40 8,35 2,21 8,8"/><path d="M21 2 L21 40 M8 8 L34 35 M34 8 L8 35 M2 21 L40 21 M8 8 L21 21 L34 8 M8 35 L21 21 L34 35"/>'
 };
 return '<svg viewBox="0 0 42 42" aria-hidden="true">'+(shapes[n]||shapes[4])+'</svg>';
}
function faceRunesMarkup(symbols,criticalFace=false){
 const glyphs=["ᛋ","ᚨ","ᚦ"];
 if(!symbols.some(Boolean))return'<span class="fp-blank-rune" aria-label="Face sem símbolos">—</span>';
 return symbols.map((n,i)=>Array.from({length:n},()=>'<span class="fp-face-rune '+["e","a","p"][i]+
  (criticalFace?' fp-critical-glyph':'')+'">'+glyphs[i]+'</span>').join("")).join("");
}
function symbolMarkup(symbols,criticalFace=false){
 if(!symbols.some(Boolean))return'<span>—</span>';
 return ['e','a','p'].map((type,i)=>symbols[i]?'<span class="'+type+'">'+symbols[i]+
  '<span'+(criticalFace?' class="fp-critical-glyph"':'')+'>'+['ᛋ','ᚨ','ᚦ'][i]+'</span></span>':"").join("");
}
function syncFields(){
 for(const [id,key] of [["char-name","name"],["char-concept","concept"],["char-origin","origin"],["char-virtue","virtue"],["char-personality","personality"],["char-notes","notes"]]){
  $(id).value=state[key];
 }
 $("char-level").value=state.level;
 $("portrait-image").src=state.portrait||"../assets/codex-logo.svg";
 $("portrait-trigger").classList.toggle("fp-has-portrait",!!state.portrait);
}
function renderDiceLegend(){
 $("dice-legend").innerHTML=[4,6,10,12,20].map(n=>'<span class="fp-die-badge fp-die-d'+n+'">'+dieIcon(n)+'<b>d'+n+'</b></span>').join("");
}
function render(){renderVitals();renderXP();renderDiceLegend();renderSources();renderComposer();renderSkills();renderInventory();renderWizard();}

/* Cinco telas reais: construímos primeiro; a ficha completa só aparece depois. */
function wizardPersist(){
 try{localStorage.setItem(WIZARD_KEY,JSON.stringify({step:wizardStep,reached:wizardReached}));}
 catch(e){console.warn("Codex: etapa não persistida",e);}
}
function wizardSelectStep(next){
 if(viewMode!=="builder"||state.creationLocked||next<0||next>4||next>wizardReached+1)return;
 if(wizardStep===0&&next>0&&!state.name.trim()){
  toast("Escolha um nome para o Aprendiz antes de continuar.");$("wizard-content").querySelector?.('[data-wizard-field="name"]')?.focus?.();return;
 }
 wizardStep=next;wizardReached=Math.max(wizardReached,wizardStep);wizardPersist();renderWizard();
 $("builder-root").scrollIntoView?.({behavior:"smooth",block:"start"});
}
function wizardFinalize(){
 if(viewMode!=="builder"||state.pending||state.creationLocked)return;
 if(!state.name.trim()){toast("O personagem precisa de um nome.");wizardSelectStep(0);return;}
 const xp=xpCosts();
 if(xp.free<0){toast("A ficha tem mais XP investidos do que disponíveis.");return;}
 const unused=["attr","training","skills"].map((k,i)=>CREATE_BUDGET[k]-[xp.attributes,xp.training,xp.skills][i]);
 const message=unused.some(n=>n>0)?
  "Concluir a criação? "+unused.reduce((n,v)=>n+Math.max(0,v),0)+" XP inicial(is) não gasto(s) passa(m) a ser LIVRE(S) para qualquer Atributo, Conhecimento, Prática ou Perícia. Esse saldo não é XP de evolução.":
  "Concluir a criação? As compras serão consolidadas; correções exigem Editar ficha.";
 if(!confirm(message))return;
 const residual=lockCreation();viewMode="sheet";wizardStep=4;wizardReached=4;wizardPersist();
 syncFields();render();save();toast("Aprendiz criado! XP inicial livre: "+residual+".");
 window.scrollTo?.({top:0,behavior:"smooth"});
}
function wizardDice(group,id,grade){
 return dataDice(group,grade).map(n=>'<span class="fp-die-badge fp-die-d'+n+'">'+dieIcon(n)+'<b>d'+n+'</b></span>').join("");
}
function wizardSource(group,item){
 const [id,name]=item,g=state[SOURCE_PROPS[group]][id]||0;
 const next=xpStepCost(group,id,1),raised=g<6&&canAfford(group,next);
 const lower=g>0&&!state.creationLocked&&!state.pending;
 return '<article class="fp-wiz-source">'+
  '<div class="fp-wiz-source-title"><strong>'+esc(name)+'</strong><span>GRAU '+g+'</span></div>'+
  '<div class="fp-wiz-source-dice">'+wizardDice(group,id,g)+'</div>'+
  '<div class="fp-wiz-source-actions">'+
  '<span class="fp-wiz-cost">'+(g>=6?'Grau máximo':'Próximo avanço: '+next+' XP')+'</span>'+
  '<div class="fp-wiz-stepper"><button data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="-1" type="button" aria-label="Reduzir grau de '+esc(name)+'"'+(lower?'':' disabled')+'>−</button><b>'+g+'</b><button data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="1" type="button" aria-label="Comprar grau de '+esc(name)+'"'+(raised?'':' disabled')+'>+</button></div>'+
  '</div></article>';
}
function wizardSkillCardsMarkup(){
 const items=filteredSkills();
 return items.length?items.map(item=>skillCompactCard(item,true)).join(""):'<div class="fp-skill-empty">Nenhuma Perícia corresponde aos filtros.</div>';
}
function wizardSkills(){
 return skillFilterControls()+
  '<div id="wizard-skill-cards" class="fp-wiz-skills">'+wizardSkillCardsMarkup()+'</div>'+
  (state.skills.includes("armas")?'<div class="fp-wiz-focus"><label>Especialização de Armas 1<select data-wizard-focus aria-label="Especialização de Armas 1">'+
   [["leve","Leve"],["medio","Média"],["pesado","Pesada"],["distancia","Distância"],["Punhos","Punhos"]]
    .map(([v,label])=>'<option value="'+v+'"'+(state.weaponFocus===v?' selected':'')+'>'+label+'</option>').join("")+
   '</select></label><small>Esta escolha se refere à habilitação Armas 1, não à rolagem básica de Disciplina.</small></div>':'');
}
function wizardReview(){
 const x=xpCosts(),life=maxLife(),move=movement();
 const sourceSummary=(group,items)=>items.filter(([k])=>(state[SOURCE_PROPS[group]][k]||0)>0)
  .map(([k,name])=>'<li>'+esc(name)+' <b>G'+state[SOURCE_PROPS[group]][k]+'</b></li>').join("")||'<li class="fp-wiz-muted">Nenhum avanço comprado</li>';
 const skillList=SKILLS.filter(([id])=>state.skills.includes(id)).map(([id,name])=>'<li>'+esc(name)+'</li>').join("")||'<li class="fp-wiz-muted">Nenhuma Perícia comprada</li>';
 return '<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 05 · REVISÃO FINAL</span><h3>Este é seu Aprendiz.</h3>'+
  '<p>Confira os investimentos antes de abrir a ficha completa. Depois da confirmação, as compras realizadas deixam de ter reembolso livre.</p></div>'+
  '<div class="fp-wiz-review-hero"><div class="fp-wiz-avatar"><img src="'+esc(state.portrait||"../assets/codex-logo.svg")+'" alt=""'+(state.portrait?' class="custom"':'')+'></div>'+
  '<div><small>APRENDIZ · NÍVEL '+state.level+'</small><h4>'+esc(state.name||"Sem nome")+'</h4><p>'+esc(state.concept||"Profissão por descobrir")+' · '+esc(state.origin||"Origem não informada")+'</p></div></div>'+
  '<div class="fp-wiz-review-stats"><div><small>VIDA</small><b>'+life+'</b></div><div><small>DE DEFENSIVA</small><b>'+deNatural()+'</b></div><div><small>DESLOCAMENTO</small><b>'+move+' m</b></div><div><small>XP INVESTIDO</small><b>'+x.total+'</b></div></div>'+
  '<div class="fp-wiz-review-list"><section><h4>Atributos</h4><ul>'+sourceSummary("attr",A)+'</ul></section>'+
  '<section><h4>Conhecimentos</h4><ul>'+sourceSummary("know",K)+'</ul></section>'+
  '<section><h4>Práticas</h4><ul>'+sourceSummary("practice",P)+'</ul></section>'+
  '<section><h4>Perícias</h4><ul>'+skillList+'</ul></section></div>'+
  '<div class="fp-wiz-reminder"><strong>5 XP de Perícias definidos · 6/8 XP em playtest</strong>'+
  '<p>Atributos: '+x.attributes+'/6 XP · Formação: '+x.training+'/8 XP · Perícias: '+x.skills+'/5 XP. O saldo não utilizado será livre após concluir a criação. A curva de XP por nível não é definitiva.</p></div>';
}
function wizardOverview(){
 const spent=xpCosts(),categories=[
  ["Atributos",spent.attributes,CREATE_BUDGET.attr],["Formação",spent.training,CREATE_BUDGET.training],["Perícias",spent.skills,CREATE_BUDGET.skills]
 ];
 const sum=categories.map(([name,used,cap])=>'<div class="fp-wiz-budget-row"><span>'+name+'</span><b>'+used+' / '+cap+' XP</b>'+
  '<div class="fp-wiz-meter"><span style="width:'+Math.min(100,used/cap*100)+'%"></span></div></div>').join("");
 const totalDone=categories.reduce((n,[,v])=>n+v,0);
 return '<div class="fp-wiz-summary-top"><small>SEU PERSONAGEM</small><strong>'+esc(state.name||"Novo Aprendiz")+'</strong>'+
  '<p>'+esc(state.concept||"Seu caminho ainda está por ser escrito")+'</p></div>'+
  '<div class="fp-wiz-sidebar-title">INVESTIMENTO INICIAL</div>'+sum+
  '<div class="fp-wiz-summary-total"><span>TOTAL INVESTIDO</span><strong>'+totalDone+' XP</strong></div>'+
  '<div class="fp-wiz-sidebar-title">ESTATÍSTICAS ATUAIS</div>'+
  '<div class="fp-wiz-pairs"><span>Vida máxima</span><b>'+maxLife()+'</b><span>Deslocamento</span><b>'+movement()+' m</b>'+
  '<span>DE defensiva</span><b>'+deNatural()+'</b><span>Coragem</span><b>'+state.courage+'</b></div>'+
  '<p class="fp-wiz-sidebar-note">Cada Atributo começa com 1d4. Cada Conhecimento ou Prática começa com 1d6. O custo de XP compra melhorias, não a existência da fonte.</p>';
}
function renderWizard(){
 const builder=$("builder-root"),sheet=$("full-sheet");
 const show=viewMode==="builder"&&!state.creationLocked;
 builder.hidden=!show;sheet.hidden=show;
 const editButton=$("edit-sheet");
 editButton.hidden=show;
 editButton.disabled=!!state.pending;
 editButton.setAttribute("aria-pressed",String(editMode));
 editButton.textContent=editMode?"Concluir edição":"Editar ficha";
 $("edit-sheet-help").hidden=show||!editMode;
 $("source-grid").classList.toggle("fp-edit-mode",editMode);
 $("xp-shortcut").hidden=show;$("start-wizard").hidden=show;
 $("page-title").innerHTML=show?'Construa seu <span>Aprendiz.</span>':'Ficha de personagem <span>jogável.</span>';
 $("page-subtitle").textContent=show?
  "Cinco etapas de criação. Distribua XP, escolha suas Perícias e veja a ficha completa ao concluir.":
  "Criação, evolução, edição e rolagens em uma única ficha do Codex RPG.";
 if(!show)return;
 $("wizard-steps").innerHTML=WIZARD_STEPS.map(([title,,desc],i)=>{
  const clickable=i<=wizardReached&&(i===0||!!state.name.trim());
  const active=i===wizardStep;
  return '<button type="button" data-action="wizard-go" data-step="'+i+'" class="fp-wiz-nav-item'+(active?' active':'')+(i<wizardStep?' complete':'')+'"'+
   (clickable?'':' disabled')+(active?' aria-current="step"':'')+'>'+
   '<span class="fp-wiz-nav-index">'+String(i+1).padStart(2,"0")+'</span><span><b>'+title+'</b><small>'+desc+'</small></span></button>';
 }).join("");
 const stage=wizardStep;
 let content="";
 if(stage===0){
  content='<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 01 · IDENTIDADE</span><h3>Quem você quer ser?</h3><p>Todo personagem começa como Aprendiz. O conceito não limita a combinação de fontes nem impõe uma classe.</p></div>'+
   '<div class="fp-wiz-identity"><button class="fp-wiz-portrait'+(state.portrait?' custom':'')+'" type="button" data-action="wizard-portrait" aria-label="Escolher retrato">'+
   '<img src="'+esc(state.portrait||"../assets/codex-logo.svg")+'" alt="Emblema de personagem"><span>Escolher retrato</span></button>'+
   '<div class="fp-wiz-input-grid">'+[
    ["name","Nome do personagem","Como seu Aprendiz se chama?",70],
    ["concept","Conceito / profissão emergente","Um caminho que deseja seguir",100],
    ["origin","Origem","Humano",80],
    ["virtue","Virtude","O que o move?",60],
    ["personality","Personalidade","Como reage ao mundo?",100]
   ].map(([field,label,placeholder,max])=>'<label class="fp-wiz-field'+(field==="name"?' wide':'')+'">'+label+
    '<input data-wizard-field="'+field+'" type="text" maxlength="'+max+'" placeholder="'+placeholder+'" value="'+esc(state[field])+'"></label>').join("")+
   '</div></div><div class="fp-wiz-reminder"><b>Liberdade de construção</b><p>O conceito é narrativo. A profissão emerge dos Atributos, Conhecimentos, Práticas, Perícias e escolhas feitas durante o jogo.</p></div>';
 }else if(stage===1){
  content='<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 02 · ATRIBUTOS</span><h3>Seu potencial natural.</h3><p>Distribua até <strong>6 XP de Atributos</strong> no orçamento inicial experimental. Cada atributo começa no Grau 0 com 1d4. Um avanço tem custo incremental.</p></div>'+
   '<div class="fp-wiz-source-grid">'+A.map(item=>wizardSource("attr",item)).join("")+'</div>';
 }else if(stage===2){
  content='<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 03 · FORMAÇÃO</span><h3>O que você sabe fazer?</h3><p>Conhecimentos e Práticas compartilham os <strong>8 XP de Formação</strong> iniciais. Cada fonte começa no Grau 0 com 1d6 gratuito.</p></div>'+
   '<div class="fp-wiz-formation"><section><h4>Conhecimentos</h4><div class="fp-wiz-source-grid">'+K.map(item=>wizardSource("know",item)).join("")+
   '</div></section><section><h4>Práticas</h4><div class="fp-wiz-source-grid">'+P.map(item=>wizardSource("practice",item)).join("")+'</div></section></div>'+
   '<div class="fp-wiz-reminder"><b>Disciplina é uma única Prática.</b><p>As Perícias específicas habilitam seu uso com armas, conjuração e defesa; não se compra outra fonte ao adquirir habilitações diferentes.</p></div>';
 }else if(stage===3){
  content='<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 04 · PERÍCIAS</span><h3>Escolha suas especializações.</h3><p>Use os <strong>5 XP de Perícias definidos no nível 1</strong>. As habilidades exigem requisitos e seus custos são cobrados. Opções ainda pendentes não podem ser compradas.</p></div>'+wizardSkills();
 }else content=wizardReview();
 $("wizard-content").innerHTML=content;
 $("wizard-summary").innerHTML=wizardOverview();
 $("wizard-controls").innerHTML='<div class="fp-wiz-footer-left"><span>ETAPA '+(stage+1)+' DE 5</span><small>'+esc(WIZARD_STEPS[stage][1])+'</small></div>'+
  '<div class="fp-wiz-footer-buttons"><button type="button" class="fp-secondary" data-action="wizard-back"'+(stage===0?' disabled':'')+'>← Voltar</button>'+
  '<button type="button" class="fp-primary-btn" data-action="'+(stage===4?'wizard-finish':'wizard-next')+'">'+
  (stage===4?'Concluir e abrir a ficha →':'Continuar →')+'</button></div>';
}

function renderVitals(){
 const lifeMaxValue=maxLife();state.life=clamp(state.life,0,lifeMaxValue);state.pp=clamp(state.pp,0,maxPP());
 $("life-text").textContent=state.life+" / "+lifeMaxValue;
 $("courage-text").textContent=state.courage+" / 10";
 $("pp-text").textContent=state.pp+" / "+maxPP();
 $("de-text").textContent=deDefense();$("balance-text").textContent=balance();
 $("de-caption").textContent=armorDePenalty()?"DE natural "+deNatural()+" − "+armorDePenalty()+" (armadura "+(armorDePenalty()===2?"Muito Pesada":"Pesada")+")":armorDodgeBonus()?"DE base "+deDefense()+" · Esquiva "+deDodge()+" (+"+armorDodgeBonus()+" da armadura)": "DE natural: teto 9 · AGI + ⌊DES/2⌋ + ⌊VIG/2⌋ + ⌊ATL/3⌋";
 $("load-text").textContent=pad(loadUsed())+" / "+capacity();
 $("move-text").textContent=movement()+" m";
 $("move-caption").textContent="8 + "+(state.attributes.agilidade||0)+" Agilidade + ⌊"+(state.practices.atletismo||0)+"/3⌋ Atletismo";
 const ratio=lifeMaxValue?state.life/lifeMaxValue:0;
 const tier=ratio>2/3?3:ratio>1/3?2:1;
 $("life-boxes").innerHTML=[1,2,3].map(i=>'<span class="'+(i<=tier?"filled":"")+(tier===1?" critical":"")+'"></span>').join("");
 $("life-recovery").textContent=state.life===0?"Vida zerada · procedimento pendente":tier===3?"Faixa 3/3 · 1 Vida por dia":tier===2?"Faixa 2/3 · 1 semana por Vida":"Faixa 1/3 · Medicina + 1 semana por Vida";
}
function renderSources(){
 for(const group of ["attr","practice","know"]){
  const html=GROUPS[group].map(([id,name])=>{
   const g=state[SOURCE_PROPS[group]][id]||0,source={group,key:id};
   const nextCost=xpStepCost(group,id,1),canEdit=(viewMode==="builder"&&!state.creationLocked)||editMode;
   const canRaise=(canEdit||state.creationLocked)&&!state.pending&&g<6&&canAfford(group,nextCost);
   const canReduce=canEdit&&g>0&&!state.pending;
   const isBase=same(source,draft.base),isAttr=same(source,draft.attribute),isThird=same(source,draft.third);
   const flag=isBase?"BASE":isAttr?"ATRIBUTO":isThird?"COMPLEMENTO":"";
   const title=label(group,id),dice=dataDice(group,g);
   return '<div class="fp-source-item '+(isBase?"fp-is-base":isAttr?"fp-is-attr":isThird?"fp-is-third":"")+'">'+
    '<button type="button" class="fp-source-pick" data-action="source" data-group="'+group+'" data-key="'+id+'" aria-pressed="'+!!flag+'" title="'+(editMode?"Modo edição: use + ou −":"Selecionar fonte")+'" '+(state.pending||editMode?"disabled":"")+'>'+
    '<span class="fp-src-title"><span>'+esc(title)+'</span>'+(flag?'<span class="fp-flag">'+flag+'</span>':"")+'</span>'+
    '<span class="fp-dice-list">'+dice.map(n=>'<span class="fp-die-badge fp-die-d'+n+'">'+dieIcon(n)+'<span>d'+n+'</span></span>').join("")+'</span></button>'+
    '<div class="fp-grade-controls"><button type="button" data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="1" aria-label="Aumentar grau de '+esc(title)+'" '+(!canRaise||state.pending?"disabled":"")+'>+</button>'+
    '<b>'+g+'</b><button type="button" data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="-1" aria-label="Reduzir grau de '+esc(title)+'" '+(!canReduce?"disabled":"")+'>−</button><small class="fp-xp-step-cost">'+(g<6?'+'+nextCost+' XP':'MAX')+'</small></div></div>';
  }).join("");
  $({know:"knowledge-list",attr:"attribute-list",practice:"practice-list"}[group]).innerHTML=html;
 }
}
function usingDiscipline(){return draft.base?.group==="practice"&&draft.base.key==="armas_conjuracao";}
function disciplineAdvancedActive(){return usingDiscipline()&&state.skills.includes("disciplina-avancada")&&(state.practices.armas_conjuracao||0)>=2;}
function mayThird(){return disciplineAdvancedActive()||state.skills.includes("combinacao")||
 (usingDiscipline()&&draft.mode==="conjuracao"&&state.skills.includes("peritoconj"));}
function canUseShared(){
 if(!usingDiscipline())return true;
 // Disciplina permite rolagem marcial sem Perícia habilitadora; a conjuração requer sua habilitação.
 return draft.mode==="armas"||(draft.mode==="conjuracao"&&state.skills.includes("criar-item-foco-magia"));
}
function selectSource(group,k){
 if(editMode){toast("Edição ativa: use + ou − para ajustar graus.");return;}
 if(state.pending){toast("Finalize ou descarte a rolagem pendente primeiro.");return;}
 const source={group,key:k};
 if(group==="attr"){
  if(disciplineAdvancedActive()&&draft.attribute&&!same(source,draft.attribute)){
   draft.third=same(source,draft.third)?null:source;
   draft.contextOK=false;
  }else{
   draft.attribute=same(source,draft.attribute)?null:source;
   if(!draft.attribute){draft.third=null;draft.contextOK=false;}
  }
 }else if(!draft.base){
  const selectedAttribute=draft.attribute;
  draft=freshDraft();draft.base=source;draft.attribute=selectedAttribute;
  draft.mode=k==="armas_conjuracao"?modeDefault():"normal";
 }else if(same(source,draft.base)){
  const selectedAttribute=draft.attribute;
  draft=freshDraft();draft.attribute=selectedAttribute;
 }else if(!draft.attribute){
  draft.base=source;draft.mode=k==="armas_conjuracao"?modeDefault():"normal";
 }else{
  if(!mayThird()){toast("Terceira fonte exige uma Perícia pertinente de combinação.");return;}
  draft.third=same(source,draft.third)?null:source;draft.contextOK=false;
 }
 renderSources();renderComposer();
 if(draft.base&&draft.attribute&&!draft.third)toast("Combinação básica pronta. Revise a preparação antes de rolar.");
}
function modeDefault(){return "armas";}
function buildPool(){
 const errors=[],pool=[];
 if(!draft.base||!draft.attribute)return{errors:["Selecione Base e Atributo."],pool};
 if(draft.third){
  if(same(draft.third,draft.base)||same(draft.third,draft.attribute))errors.push("Não duplique a mesma fonte.");
  if(draft.third.group==="attr"&&!disciplineAdvancedActive())errors.push("Segundo Atributo só é permitido com Disciplina Avançada numa ação com Disciplina.");
  if(!mayThird())errors.push("Falta Perícia pertinente para a terceira fonte.");
  else if(!draft.contextOK)errors.push("Confirme a pertinência da terceira fonte com o Narrador.");
 }
 if(!canUseShared())errors.push("Conjuração exige Criar Item de Foco e Magia (a Perícia substitui Aprendiz de Conjurador e Magia Única). Uso marcial básico de Disciplina é livre.");
 for(const s of [draft.base,draft.attribute,...(draft.third?[draft.third]:[])]){
  const grade=state[SOURCE_PROPS[s.group]][s.key]||0;
  dataDice(s.group,grade).forEach((sides,index)=>pool.push({id:key(s)+":"+index,group:s.group,key:s.key,sides}));
 }
 if(draft.step){
  const attr=pool.find(d=>d.group==="attr");const next={4:6,6:10,10:12}[attr?.sides];
  if(next)attr.sides=next;
  else errors.push("Esse dado de Atributo não permite elevação comum.");
 }
 if(pool.length>9)errors.push("A pilha ultrapassa o limite de 9 dados rolados.");
 if(Number(draft.extraKeep)+Number(draft.step)>state.courage)errors.push("Coragem insuficiente para os custos de preparação.");
 if(draft.de<0||draft.de>30)errors.push("DE deve ficar entre 0 e 30.");
 return{errors,pool};
}
function renderComposer(){
 const box=$("composer-content"),stat=$("composer-status");
 if(state.pending){stat.textContent="Rolagem pendente";box.innerHTML=renderPending();return;}
 if(!draft.base){
  stat.textContent=draft.attribute?"Escolha a Base":"Selecione suas fontes";
  const chosen=draft.attribute?'<p><strong>'+esc(label(draft.attribute.group,draft.attribute.key))+'</strong> já está selecionado. Agora escolha uma Prática ou Conhecimento para definir a Base.</p>':
   '<p>Selecione um Atributo à esquerda e uma Base em Práticas ou Conhecimentos. A ordem dos cliques é livre.</p>';
  box.innerHTML='<div class="fp-empty"><div class="fp-empty-glyph">ᚨ</div><h4>Seu teste começa aqui.</h4>'+chosen+'</div>'+
   '<div class="fp-alert">Experimente <strong>Disciplina + Força</strong>. Com Disciplina Avançada, acrescente uma terceira fonte pertinente. A composição numérica pode ser igual, mas o tipo de teste muda.</div>'+
   (state.history.length?'<p class="fp-caption">Última ação: '+esc(state.history[0].name)+' · '+esc(state.history[0].outcome)+'</p>':"");
  return;
 }
 stat.textContent=draft.attribute?"Revisar antes de rolar":"Escolha um Atributo";
 const step='<div class="fp-selection-steps"><div class="fp-step-box base"><small>01 · BASE</small><strong>'+esc(label(draft.base.group,draft.base.key))+'</strong></div>'+
 '<div class="fp-step-box attr"><small>02 · ATRIBUTO</small><strong>'+(draft.attribute?esc(label(draft.attribute.group,draft.attribute.key)):"Selecione...")+'</strong></div>'+
 '<div class="fp-step-box third"><small>03 · COMPLEMENTO</small><strong>'+(draft.third?esc(label(draft.third.group,draft.third.key)):"Opcional")+'</strong></div></div>';
 if(!draft.attribute){
  box.innerHTML=step+'<p class="fp-prepare-description">A Base já foi definida. Clique em um Atributo na coluna à esquerda. Nenhum dado será rolado sem sua confirmação.</p>'+
   '<div class="fp-composer-actions"><button type="button" class="fp-secondary" data-action="clear">Limpar seleção</button></div>';return;
 }
 const {errors,pool}=buildPool(),cost=Number(draft.extraKeep)+Number(draft.step);
 const isShared=draft.base.group==="practice"&&draft.base.key==="armas_conjuracao";
 const usage=isShared?(draft.mode==="conjuracao"?"Disciplina · Conjuração":"Disciplina · Armas"):label(draft.base.group,draft.base.key);
 const select=(field,values,selected)=>'<select data-option="'+field+'">'+values.map(([id,name])=>'<option value="'+id+'"'+(selected===id?" selected":"")+'>'+esc(name)+'</option>').join("")+'</select>';
 const modes=[["armas","Disciplina — Armas"],["conjuracao","Disciplina — Conjuração"]];
 const weight=[["leve","Leve"],["medio","Médio"],["pesado","Pesado"]];
 const checks= '<label class="fp-checkline"><input type="checkbox" data-option="extraKeep"'+(draft.extraKeep?" checked":"")+'> Manter 1 dado adicional (1 Coragem)</label>'+
 '<label class="fp-checkline"><input type="checkbox" data-option="step"'+(draft.step?" checked":"")+'> Elevar o primeiro dado de Atributo (1 Coragem)</label>'+
 (state.skills.includes("combate")?'<label class="fp-checkline full"><input type="checkbox" data-option="combatBonus"'+(draft.combatBonus?" checked":"")+'> Aplicar Combate +1A (somente quando pertinente)</label>':"")+
 '<label class="fp-checkline full"><input type="checkbox" data-option="weightEnabled"'+(draft.weightEnabled?" checked":"")+'> Aplicar afinidade de peso do ataque × balanço do alvo (se pertinente)</label>'+
 (draft.third?'<label class="fp-checkline fp-context full"><input type="checkbox" data-option="contextOK"'+(draft.contextOK?" checked":"")+'> Confirmo que a Perícia permite este complemento na ação declarada, sob validação do Narrador.</label>':"");
 const options='<div class="fp-form-grid">'+(isShared?'<label class="fp-form-field full">Uso da Prática compartilhada '+select("mode",modes,draft.mode)+'</label>':"")+
 '<label class="fp-form-field">Dificuldade de Êxito <input data-option="de" type="number" min="0" max="30" value="'+draft.de+'"></label>'+
 '<label class="fp-form-field">Condição da ação '+select("situation",Object.entries(SITUATIONS).map(([k,v])=>[k,v[0]]),draft.situation)+'</label>'+
 (draft.weightEnabled?'<label class="fp-form-field">Peso do ataque '+select("attackWeight",weight,draft.attackWeight)+'</label><label class="fp-form-field">Balanço do alvo '+select("targetWeight",weight,draft.targetWeight)+'</label>':"")+
 checks+'</div>';
 const poolHTML='<div class="fp-pill-row">'+pool.map(d=>'<span class="fp-pool-die">'+dieIcon(d.sides)+' d'+d.sides+' <span>'+esc(label(d.group,d.key))+'</span></span>').join("")+'</div>';
 box.innerHTML=step+'<div class="fp-prepare-title">'+esc(usage)+'</div><p class="fp-prepare-description">A Base determina o tipo de ação. Atributo e complemento não alteram sua natureza automaticamente.</p>'+
 options+'<p class="fp-caption" style="margin-top:10px">Pilha: '+pool.length+'/9 dados · Retenção: '+keepLimit(false)+' ou '+keepLimit(true)+' com Coragem · Custo previsto: '+cost+' Coragem.</p>'+poolHTML+
 (draft.third?'<p class="fp-caption">Para trocar o complemento, escolha outra fonte pertinente. Com Disciplina Avançada, pode acrescentar inclusive outro Atributo quando a Base é Disciplina.</p>':
 '<p class="fp-caption">'+(mayThird()?"Uma terceira fonte pode ser acrescentada por clique, respeitando a habilitação e a confirmação contextual.":"Sem Perícia de combinação, a ação mantém duas fontes. Disciplina Avançada permite uma terceira fonte somente em ações com Disciplina.")+'</p>')+
 errors.map(x=>'<div class="fp-alert invalid">'+esc(x)+'</div>').join("")+
 '<div class="fp-composer-actions"><button class="fp-secondary" type="button" data-action="clear">Limpar</button>'+
 '<button class="fp-primary-btn" type="button" data-action="roll"'+(errors.length?" disabled":"")+'>Rolar dados →</button></div>';
}
function randomFace(n){
 if(typeof crypto!=="undefined"&&crypto.getRandomValues){
  const limit=0x100000000-(0x100000000%n),buf=new Uint32Array(1);
  do{crypto.getRandomValues(buf);}while(buf[0]>=limit);
  return(buf[0]%n)+1;
 }
 return Math.floor(Math.random()*n)+1;
}
function roll(){
 if(editMode){toast("Conclua a edição antes de rolar.");return;}
 if(state.pending){toast("Uma rolagem anterior aguarda finalização.");return;}
 const data=buildPool();
 if(data.errors.length){toast(data.errors[0]);renderComposer();return;}
 state.pending={created:new Date().toISOString(),base:{...draft.base},attribute:{...draft.attribute},
  third:draft.third?{...draft.third}:null,mode:draft.mode,
  opts:{de:draft.de,situation:draft.situation,extraKeep:draft.extraKeep,step:draft.step,combatBonus:draft.combatBonus,
    weightEnabled:draft.weightEnabled,attackWeight:draft.attackWeight,targetWeight:draft.targetWeight},
  dice:data.pool.map(d=>({...d,face:randomFace(d.sides)})),selected:[],cancelP:0,pairs:0,pass:0};
 draft=freshDraft();save();render();
 toast("Dados rolados. Mantenha quaisquer dados da pilha, respeitando o limite.");
}
function affinity(attack,target){
 const matrix={leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}};
 return matrix[attack]?.[target]||0;
}
function score(){
 const p=state.pending;if(!p)return null;
 const dice=p.dice.filter(x=>p.selected.includes(x.id)),errs=[];
 if(dice.length===0)errs.push("Selecione os dados que deseja manter.");
 if(dice.length>keepLimit(p.opts.extraKeep))errs.push("Limite de retenção excedido.");
 if(!p.dice.some(x=>x.group==="attr"))errs.push("É obrigatório rolar pelo menos um dado de Atributo.");
 const raw=[0,0,0];
 for(const d of dice){const f=face(d.sides,d.face);for(let i=0;i<3;i++)raw[i]+=f[i];}
 const critTier=dice.length>=2&&dice.every(d=>d.face===d.sides)?dice.length:0;
 const criticalConverted=critTier&&raw[2]>0?1:0;
 const pAvailable=Math.max(0,raw[2]-criticalConverted);
 const situation=SITUATIONS[p.opts.situation]||SITUATIONS.normal;
 const w=p.opts.weightEnabled?affinity(p.opts.attackWeight,p.opts.targetWeight):0;
 const eBase=Math.max(0,raw[0]+situation[1]+criticalConverted+(critTier>=3?1:0));
 const aPool=Math.max(0,raw[1]+situation[2]+w+(p.opts.combatBonus?1:0)+(critTier>=3?1:0));
 const cancel=clamp(Math.floor(p.cancelP),0,999),pairs=clamp(Math.floor(p.pairs),0,999),pass=clamp(Math.floor(p.pass),0,1);
 if(cancel>pAvailable)errs.push("Não há tantos Pavor restantes para anular.");
 if(cancel+2*pairs+pass>aPool)errs.push("Antecipar insuficiente para os gastos selecionados.");
 const E=eBase+pairs,P=Math.max(0,pAvailable-cancel),remainingA=Math.max(0,aPool-cancel-2*pairs-pass);
 const reached=E+P,success=reached>=p.opts.de;
 const outcome=success?(P===0?"Acerto puro":P>E?"Acerto com Pavor predominante":"Acerto normal com Pavor")
 :(P===0?"Falha limpa":P>E?"Falha com Pavor predominante":"Falha com Pavor");
 const courageCost=Number(p.opts.extraKeep)+Number(p.opts.step);
 if(courageCost>state.courage)errs.push("Coragem insuficiente para a rolagem preparada.");
 const critRecovery=critTier>=3?2:critTier>=2?1:0;
 const damageBasic=success?E+Math.floor(P/2):0;
 return{dice,raw,E,P,remainingA,reached,success,outcome,damage:damageBasic*(critTier===4?2:1),damageBasic,errors:errs,
  aPool,courageCost,pAvailable,critTier,critRecovery,criticalConverted};
}
function renderPending(){
 const p=state.pending,s=score(),de=p.opts.de,cost=s.courageCost;
 const desc=esc(label(p.base.group,p.base.key))+" + "+esc(label(p.attribute.group,p.attribute.key))+
  (p.third?" + "+esc(label(p.third.group,p.third.key)):"");
 const dice='<div class="fp-rolled-dice">'+p.dice.map(d=>'<button type="button" class="fp-roll-die fp-die-d'+d.sides+' '+(p.selected.includes(d.id)?"kept":"")+'" data-action="keep" data-id="'+esc(d.id)+'" title="Face '+d.face+' do d'+d.sides+'" aria-label="'+esc(label(d.group,d.key))+' · d'+d.sides+' · face '+d.face+'" aria-pressed="'+p.selected.includes(d.id)+'">'+dieIcon(d.sides)+
  '<strong class="fp-face-runes" aria-hidden="true">'+faceRunesMarkup(face(d.sides,d.face),d.face===d.sides)+'</strong><span class="fp-die-source">'+esc(label(d.group,d.key))+' · d'+d.sides+'</span><span class="fp-symbol-line">'+symbolMarkup(face(d.sides,d.face),d.face===d.sides)+'</span></button>').join("")+'</div>';
 const selectNumber=(k,labelText,max,value)=>'<label class="fp-form-field">'+labelText+'<select data-pending="'+k+'">'+
 Array.from({length:Math.max(1,max+1)},(_,i)=>'<option value="'+i+'"'+(Number(value)===i?" selected":"")+'>'+i+'</option>').join("")+'</select></label>';
 const controls='<div class="fp-form-grid">'+
 selectNumber("cancelP","Anular Pavor (1A por 1P)",Math.min(s.pAvailable,s.aPool),p.cancelP)+
 selectNumber("pairs","Converter 2A em 1E",Math.floor(s.aPool/2),p.pairs)+
 selectNumber("pass","Passar ação ao aliado (1A)",1,p.pass)+'</div>';
 const criticalNote=s.critTier?'<div class="fp-alert"><strong>Crítico de '+s.critTier+' dados mantidos!</strong> '+
  (s.criticalConverted?'1P convertido em 1E. ':'Sem Pavor próprio para converter. ')+
  (s.critTier>=3?'+1E e +1A. ':'')+
  'Recuperação de até '+s.critRecovery+' PP e '+s.critRecovery+' Coragem (respeitando os tetos). '+
  (s.critTier===4?'Dano básico dobrado; interação com proteções ainda pendente. ':'')+'</div>':'';
 const stats='<div class="fp-outcome"><h4>'+esc(s.outcome)+'</h4>'+criticalNote+'<div class="fp-outcome-stats">'+
 '<div class="fp-outcome-stat">DE alcançada<b>'+s.reached+' / '+de+'</b></div>'+
 '<div class="fp-outcome-stat"><span class="fp-rune fp-rune-e">Êxito ᛋ</span><b>'+s.E+'</b></div>'+
 '<div class="fp-outcome-stat"><span class="fp-rune fp-rune-a">Antecipar ᚨ</span><b>'+s.remainingA+'</b></div>'+
 '<div class="fp-outcome-stat"><span class="fp-rune fp-rune-p">Pavor ᚦ</span><b>'+s.P+'</b></div></div>'+
 '<p class="fp-caption" style="margin-top:9px">Dano básico se acertar: '+s.damage+'. Pavor não anulado conserva o risco e a transferência pertinente.</p></div>';
 return '<div class="fp-alert"><strong>Resultado já sorteado.</strong> '+desc+'. A rolagem ficará salva até ser finalizada ou descartada explicitamente.</div>'+
 '<p class="fp-caption" style="margin:11px 0">Mantenha até '+keepLimit(p.opts.extraKeep)+' dados à sua escolha. Atributo é obrigatório na rolagem, não entre os mantidos. '+s.dice.length+' selecionado(s). Custo previsto: '+cost+' Coragem.</p>'+dice+controls+
 (s.dice.length?stats:"<p class=\"fp-caption\" style=\"margin-top:10px\">Clique nos dados que deseja manter. Só eles geram símbolos.</p>")+
 s.errors.filter(x=>x!=="Selecione os dados que deseja manter.").map(x=>'<div class="fp-alert invalid">'+esc(x)+'</div>').join("")+
 (s.dice.length&&!s.errors.length?"":'<div class="fp-alert">A finalização só fica disponível após uma retenção válida.</div>')+
 '<div class="fp-composer-actions"><button class="fp-secondary" data-action="discard" type="button">Descartar teste...</button>'+
 '<button class="fp-primary-btn" data-action="finalize" type="button"'+(s.errors.length?" disabled":"")+'>Finalizar ação</button></div>';
}
function finalize(){
 const p=state.pending,s=score();
 if(!p||s.errors.length){toast(s?.errors?.[0]||"Rolagem inválida.");return;}
 state.courage=clamp(state.courage-s.courageCost,0,10);
 const oldCourage=state.courage,oldPP=state.pp;
 if(s.critRecovery){
  state.courage=clamp(state.courage+s.critRecovery,0,10);
  state.pp=clamp(state.pp+s.critRecovery,0,maxPP());
 }
 const gainedCourage=state.courage-oldCourage,gainedPP=state.pp-oldPP;
 const baseName=p.base.group==="practice"&&p.base.key==="armas_conjuracao"?"Disciplina ("+(p.mode==="conjuracao"?"Conjuração":"Armas")+")":label(p.base.group,p.base.key);
 const name=baseName+" + "+label(p.attribute.group,p.attribute.key)+(p.third?" + "+label(p.third.group,p.third.key):"");
 state.history.unshift({date:new Date().toISOString(),name,outcome:s.outcome,de:p.opts.de,reached:s.reached,
  E:s.E,A:s.remainingA,P:s.P,critTier:s.critTier,critConverted:s.criticalConverted,
  ppRecovered:gainedPP,courageRecovered:gainedCourage,damage:s.damage,
  faces:s.dice.map(d=>({id:d.id,sides:d.sides,face:d.face}))});
 state.history=state.history.slice(0,20);state.pending=null;save();render();
 toast((s.critTier?"Crítico de "+s.critTier+" dados! · ":"")+s.outcome+" · DE "+s.reached+"/"+p.opts.de);
}
function updateGrade(group,id,delta){
 if(state.pending){toast("Finalize a rolagem antes de modificar fontes.");return;}
 if(state.creationLocked&&!editMode&&delta<0){toast("Ative Editar ficha para reduzir graus. Avanços positivos podem usar XP livre.");return;}
 const p=SOURCE_PROPS[group];if(!p||!GROUPS[group].some(x=>x[0]===id)||![-1,1].includes(delta))return;
 const old=state[p][id]||0,next=clamp(old+delta,0,6);
 if(next===old)return;
 const purchaseCost=delta>0?xpStepCost(group,id,1):0;
 if(delta>0){
  if(!canAfford(group,purchaseCost)){toast("XP insuficiente: este avanço custa "+purchaseCost+" XP.");return;}
 }else{
  const tmp=structuredClone(state);tmp[p][id]=next;
  const problem=dependentsValid(tmp);
  if(problem){toast("Não é possível reduzir: "+problem);return;}
 }
 state[p][id]=next;
 for(const item of state.items)if(item.equipped&&item.type==="armadura"&&!canEquipArmor(state,item))item.equipped=false;
 render();save();
 if(delta>0)toast("Grau "+next+" comprado por "+purchaseCost+" XP.");
 else toast("Grau reduzido para "+next+". XP da ficha recalculado.");
}
function adjustResource(resource,delta){
 const max=resource==="life"?maxLife():resource==="pp"?maxPP():10;
 state[resource]=clamp(state[resource]+delta,0,max);renderVitals();save();
}
function renderSkills(){
 const bar=$("skills-filterbar");if(bar&&!bar.firstChild)bar.innerHTML=skillFilterControls();
 $("skills-list").innerHTML=filteredSkills().map(item=>skillCompactCard(item,false)).join("")||'<div class="fp-skill-empty">Nenhuma Perícia corresponde aos filtros.</div>';
 $("weapon-focus-wrap").hidden=!state.skills.includes("armas");
 $("weapon-focus").value=state.weaponFocus;
 $("weapon-focus").disabled=(state.creationLocked&&!editMode)||!!state.pending;
 $("convert-courage").disabled=state.level<5||state.courage<2||state.pp>=maxPP()||state.courageUsedTurn;
 $("courage-skill-message").textContent=state.level<5?"Perícia em Coragem: disponível a partir do nível 5.":state.courageUsedTurn?"Conversão já usada neste turno.":"A conversão pode ser usada uma vez por turno.";
}
function inventorySelect(field,value,values,id){
 return'<select data-item-field="'+field+'" data-id="'+esc(id)+'">'+values.map(([k,v])=>'<option value="'+k+'"'+(k===value?" selected":"")+'>'+esc(v)+'</option>').join("")+'</select>';
}
function renderInventory(){
 const load=loadUsed(),max=capacity(),fill=$("load-bar-fill");
 fill.style.width=Math.min(100,max?load/max*100:0)+"%";fill.classList.toggle("over",load>max);
 $("load-caption").textContent="Ocupação física estimada: "+pad(load)+" / "+max+" Alto"+(load>max?" · capacidade excedida":"")+". Focos usam carga convencional, sem anulação por spellslots.";
 const mental=$("mental-slot-caption");
 if(mental){
  const points=mentalSlotCapacity();
  const canCreateG2=(state.practices.armas_conjuracao||0)>=2;
  mental.textContent="Slots mentais: "+points+" ponto"+(points===1?"":"s")+" de capacidade (1 por Grau investido em Disciplina, NÃO por dado). "+
   "Criar Magia reduz 1 ponto do peso das magias criadas e memorizadas: G2=1, G3=2, G4=3. "+
   (canCreateG2?"Pode memorizar até "+points+" magia"+(points===1?"":"s")+" G2 criada"+(points===1?"":"s")+", conforme demais requisitos. ":"Criar magia G2 exige Disciplina 2. ")+
   "G1 após −1: peso mínimo PENDENTE. Os itens de foco seguem contando como carga física.";
 }
 $("inventory-list").innerHTML=state.items.length?state.items.map(it=>{
  const types=[["arma","Arma"],["armadura","Armadura"],["escudo","Escudo"],["foco","Foco"],["ferramenta","Ferramenta"],["outro","Outro"]];
  const canResist1=it.weight==="extremo"?it.grade>=2:(it.weight==="alto"||it.weight==="medio")?it.grade>=2:it.grade>=3;
  const canResist2=it.weight==="alto"&&it.grade>=3;
  const canImmunize=it.weight==="extremo"&&it.grade>=4;
  const armorFields=it.type!=="armadura"?"":(
   (it.weight==="muito_leve"?'<div class="fp-item-hint"><strong>Muito Leve:</strong> sem Integridade; +2 DE apenas na esquiva.</div>':"")+
   (it.weight==="leve"?'<div class="fp-item-hint"><strong>Leve:</strong> +1 DE na esquiva; resistência disponível desde Grau 3.</div>':"")+
   (it.weight==="medio"?'<div class="fp-item-hint"><strong>Média:</strong> 0 DE; resistência específica desde Grau 2.</div>':"")+
   (it.weight==="alto"?'<div class="fp-item-hint"><strong>Pesada:</strong> −1 DE; resistência no Grau 2, segunda resistência no Grau 3.</div>':"")+
   (it.weight==="extremo"?'<div class="fp-item-hint"><strong>Muito Pesada:</strong> −2 DE, exige Vigor 6/Atletismo 6 e tem imunidade física em QUALQUER Grau. G4 pode acumular imunidade elemental sobre a resistência de G2.</div>':"")+
   (canResist1?`<div class="fp-item-hint"><label>Resistência elemental da peça: <input type="text" data-item-field="elementalResistance" data-id="${esc(it.id)}" value="${esc(it.elementalResistance)}" maxlength="70" placeholder="Elemento autorizado"></label></div>`:"")+
   (canResist2?`<div class="fp-item-hint"><label>Segunda resistência (Pesada Grau 3+): <input type="text" data-item-field="secondResistance" data-id="${esc(it.id)}" value="${esc(it.secondResistance)}" maxlength="70" placeholder="Outro elemento da peça"></label></div>`:"")+
   (canImmunize?`<div class="fp-item-hint"><label>Imunidade elemental adicional (Muito Pesada G4): <input type="text" data-item-field="specificImmunity" data-id="${esc(it.id)}" value="${esc(it.specificImmunity)}" maxlength="70" placeholder="Elemento específico; soma à resistência"></label></div>`:"")+
   '<div class="fp-item-hint">Acesso por Grau: G1 desde nível 1 · G2 desde 5 · G3 desde 10 · G4 desde 20. Integridade numérica pendente de balanceamento.</div>'
  );
  return'<div class="fp-item"><input type="text" value="'+esc(it.name)+'" data-id="'+esc(it.id)+'" data-item-field="name" maxlength="90" aria-label="Nome do item">'+
  inventorySelect("type",it.type,types,it.id)+
  inventorySelect("weight",it.weight,Object.entries(WEIGHTS).map(([id,values])=>[id,values[0]]),it.id)+
  '<div class="fp-item-controls"><button type="button" data-action="integrity" data-id="'+esc(it.id)+'" data-delta="-1" aria-label="Reduzir integridade">−</button><b>'+it.hp+'/'+it.max+'</b>'+
  '<button type="button" data-action="integrity" data-id="'+esc(it.id)+'" data-delta="1" aria-label="Aumentar integridade">+</button>'+
  '<button type="button" class="'+(it.equipped?"fp-item-equipped":"")+'" data-action="equip" data-id="'+esc(it.id)+'" title="Equipar/guardar">'+(it.equipped?"✓":"○")+'</button>'+
  '<button type="button" data-action="delete-item" data-id="'+esc(it.id)+'" title="Excluir item">×</button></div>'+
  '<div class="fp-item-hint"><label>Grau <input type="number" data-item-field="grade" data-id="'+esc(it.id)+'" min="1" max="4" value="'+it.grade+'" style="width:40px"></label> · '+
  '<label>Qtd. <input type="number" data-item-field="qty" data-id="'+esc(it.id)+'" min="1" max="99" value="'+it.qty+'" style="width:44px"></label> · '+
  '<label>Integridade máxima <input type="number" data-item-field="max" data-id="'+esc(it.id)+'" min="0" max="999" value="'+it.max+'" style="width:50px" '+(it.type==="armadura"&&it.weight==="muito_leve"?"disabled":"")+'> </label>'+
  ' · '+(it.equipped?"Equipado":"No inventário")+'</div>'+
  armorFields+'</div>';
 }).join(""):'<div class="fp-empty-list">Nenhum item cadastrado. Use <strong>+ Item</strong> para simular equipamento e carga.</div>';
}
function demo(){
 const s=defaultState();
 s.name="Aprendiz de exemplo";s.concept="Artista de combate";s.origin="Humano";s.virtue="Determinação";s.personality="Criativo";
 s.level=6;s.attributes={forca:2,agilidade:3,destreza:2,inteligencia:1,influencia:1,vigor:3};
 s.knowledges={alquimia:1,medicina:0,protecao:1};
 s.practices={armas_conjuracao:2,atletismo:1,furtividade:1,apresentacao:2};
 s.skills=["armas","criar-item-foco-magia","combinacao","combate"];
 s.creationLocked=true;s.xpEarned=80;s.weaponFocus="medio";
 s.xpHistory=[{at:new Date().toISOString(),amount:80,note:"XP de exemplo para testar evolução"}];
 s.courage=8;s.pp=1;s.life=maxLife(s)-1;
 s.items=[normalizeItem({name:"Espada de treinamento",type:"arma",weight:"medio",grade:1,qty:1,equipped:true,max:0,hp:0}),
  normalizeItem({name:"Armadura de demonstração",type:"armadura",weight:"alto",grade:2,qty:1,equipped:true,max:5,hp:4}),
  normalizeItem({name:"Bolsa de suprimentos",type:"outro",weight:"leve",grade:1,qty:1})];
 s.notes="Exemplo ilustrativo para navegar e testar a interface. Os equipamentos não representam fichas oficiais.";
 return s;
}
function download(){
 const blob=new Blob([JSON.stringify({schema:"codex-html-playtest-v1",exportedAt:new Date().toISOString(),character:state},null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="codex-ficha-prototipo.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
}
function fromCreator(v){
 const s=defaultState(),old=v?.character||v||{};
 for(const x of ["name","concept","origin","virtue","personality","notes"])if(typeof old[x]==="string")s[x]=old[x];
 const attrNames={Força:"forca",Agilidade:"agilidade",Destreza:"destreza",Inteligência:"inteligencia",Influência:"influencia",Vigor:"vigor"};
 const sources={Proteção:"protecao",Astronomia:"astronomia",Medicina:"medicina",Alquimia:"alquimia",Engenharia:"engenharia",Erudição:"erudicao",Armas:"armas_conjuracao",Conjuração:"armas_conjuracao",Disciplina:"armas_conjuracao",Atletismo:"atletismo",Furtividade:"furtividade",Artesão:"artesao",Apresentação:"apresentacao",Coleta:"coleta"};
 for(const [name,id] of Object.entries(attrNames))s.attributes[id]=clamp(Math.floor(old.attributes?.[name]||0),0,6);
 for(const [name,id] of Object.entries(sources)){
  const degree=Math.max(Number(old.sources?.[name]||0),Number(old.legacySources?.[name]||0));
  if(degree>0){
   const dest=K.some(x=>x[0]===id)?"knowledges":"practices";
   s[dest][id]=Math.max(s[dest][id]||0,clamp(Math.floor(degree),0,6));
  }
 }
 const supported=new Set(SKILLS.filter(x=>Number.isInteger(x[3])).map(x=>x[0]));
 const oldSkills=Array.isArray(old.skills)?old.skills.filter(x=>typeof x==="string"):[];
 s.skills=[...new Set(oldSkills.filter(id=>supported.has(id)))];
 const unrecognized=oldSkills.filter(id=>!supported.has(id)&&id!=="raio");
 const notes=[];
 if(oldSkills.includes("raio"))notes.push("Raio era uma habilitação antiga. Agora é condição, não elemento; seu XP não permanece investido.");
 if(Array.isArray(old.customSkills)&&old.customSkills.length){
  notes.push("Perícias personalizadas do criador anterior (preservadas em texto; não automatizadas): "+
   old.customSkills.slice(0,50).map(x=>String(x.name||x.id||"Sem nome")+" ("+String(x.cost||"?")+" XP)").join(", "));
 }
 if(unrecognized.length)notes.push("Perícias antigas sem equivalente automático: "+unrecognized.join(", "));
 if(notes.length)s.notes=(s.notes+"\n"+notes.join("\n")).trim().slice(0,5000);
 s.weaponFocus=["leve","medio","pesado","distancia","Punhos"].includes(old.weaponFocus)?old.weaponFocus:"leve";
 s.courage=old.courage??10;
 s.xpEarned=Math.max(0,Math.floor(Number(old.xpEarned)||0));
 s.life=maxLife(s);
 return s;
}
async function importFile(file){
 try{const txt=await file.text();if(txt.length>2500000)throw Error("Arquivo muito grande.");
  const input=JSON.parse(txt),raw=input.character||input;
  const isNew=raw.schema==="codex-html-playtest-v1";
  const v=isNew?raw:fromCreator(input);
  if(!confirm("Substituir a ficha atual pelos dados importados?"))return;
  state=normalize(v);draft=freshDraft();editMode=false;viewMode=state.creationLocked?"sheet":"builder";
  wizardStep=0;wizardReached=0;wizardPersist();syncFields();render();save();
  toast(isNew?"Ficha importada.":"Ficha do criador importada parcialmente. Confira os dados.");
 }catch(e){toast("Falha ao importar: "+e.message);}
}
function setWeaponFocus(selected){
 if((state.creationLocked&&!editMode)||state.pending)return;
 if(!["leve","medio","pesado","distancia","Punhos"].includes(selected))return;
 const previous=state.weaponFocus;
 state.weaponFocus=selected;
 const reason=dependentsValid(state);
 if(reason){state.weaponFocus=previous;toast("Especialização bloqueada: "+reason);render();return;}
 render();save();
}
function onClick(event){
 const button=event.target.closest("button");if(!button)return;
 const action=button.dataset.action;
 if(!action)return;
 const {group,key:source,delta,id}=button.dataset;
 switch(action){
 case "wizard-next":wizardSelectStep(wizardStep+1);break;
 case "wizard-back":wizardSelectStep(wizardStep-1);break;
 case "wizard-go":wizardSelectStep(Number(button.dataset.step));break;
 case "wizard-finish":wizardFinalize();break;
 case "wizard-portrait":$("portrait-input").click();break;
 case "source":selectSource(group,source);break;
 case "grade":updateGrade(group,source,Number(delta));break;
 case "clear":draft=freshDraft();renderSources();renderComposer();break;
 case "roll":roll();break;
 case "keep":{
  const p=state.pending;if(!p)return;
  const selected=new Set(p.selected);
  if(selected.has(id))selected.delete(id);
  else if(selected.size>=keepLimit(p.opts.extraKeep)){toast("Limite de dados mantidos atingido.");return;}
  else selected.add(id);
  p.selected=[...selected];p.cancelP=0;p.pairs=0;p.pass=0;save();renderComposer();break;
 }
 case "finalize":finalize();break;
 case "discard":
  if(!state.pending)return;
  if(confirm("Descartar a rolagem já revelada? Isso deve ocorrer apenas por decisão do Narrador; os dados não serão reaproveitados.")){
   state.pending=null;save();render();toast("Rolagem descartada por confirmação.");
  }break;
 case "skill":{
  if(state.pending){toast("Finalize a rolagem antes de modificar Perícias.");return;}
  const skill=SKILLS.find(x=>x[0]===id);if(!skill)return;
  const existing=state.skills.indexOf(id);
  if(existing<0){
   const reason=skillReq(id);
   if(reason){toast(reason);return;}
   if(!Number.isInteger(skill[3])){toast("Custo pendente.");return;}
   if(!canAfford("skills",skill[3])){toast("XP insuficiente: "+skill[3]+" XP necessários.");return;}
   state.skills.push(id);toast("Perícia comprada: "+skill[1]+" · "+skill[3]+" XP.");
  }else{
   if(state.creationLocked&&!editMode){toast("Ative Editar ficha para corrigir esta Perícia.");return;}
   const tmp=structuredClone(state);tmp.skills=tmp.skills.filter(x=>x!==id);
   const problem=dependentsValid(tmp);if(problem){toast("Outra Perícia depende desta: "+problem);return;}
   state.skills.splice(existing,1);toast("Compra de criação desfeita.");
  }
  if(draft.third&&!mayThird())draft.third=null;
  if(draft.base?.key==="armas_conjuracao")draft.mode=modeDefault();
  render();save();break;
 }
 case "integrity":{
  const it=state.items.find(x=>x.id===id);if(it){it.hp=clamp(it.hp+Number(delta),0,it.max);renderInventory();save();}break;
 }
 case "equip":{
  const it=state.items.find(x=>x.id===id);if(!it)return;
  if(!it.equipped&&it.type==="armadura"&&!canEquipArmor(state,it)){toast("Não pode equipar: G2 exige nível 5, G3 nível 10, G4 nível 20; Muito Pesada exige Vigor 6 e Atletismo 6.");return;}
  if(!it.equipped&&it.type==="armadura")for(const other of state.items)if(other.type==="armadura"&&other!==it)other.equipped=false; // Restrição técnica da ficha; sobreposição é PENDENTE.
  it.equipped=!it.equipped;renderInventory();renderVitals();save();break;
 }
 case "delete-item":{
  const it=state.items.find(x=>x.id===id);if(!it)return;
  if(confirm('Excluir "'+it.name+'"?')){state.items=state.items.filter(x=>x.id!==id);renderInventory();renderVitals();save();}break;
 }
 }
}
function onChange(event){
 const el=event.target;
 if(el.dataset.skillScope!==undefined||el.dataset.skillReady!==undefined){
  if(el.dataset.skillScope!==undefined)skillFilter.scope=el.value;
  if(el.dataset.skillReady!==undefined)skillFilter.ready=el.checked;
  syncSkillFilterControls();renderWizardSkillCards();renderSkills();syncSkillFilterControls();return;
 }
 if(el.dataset.option){
  const k=el.dataset.option;
  if(!Object.hasOwn(draft,k))return;
  draft[k]=el.type==="checkbox"?el.checked:el.type==="number"?clamp(Math.floor(el.value),0,30):el.value;
  if(k==="mode"){draft.third=null;draft.contextOK=false;}
  renderSources();renderComposer();return;
 }
 if(el.dataset.pending&&state.pending){
  const k=el.dataset.pending;
  if(!["cancelP","pairs","pass"].includes(k))return;
  state.pending[k]=clamp(Math.floor(el.value),0,k==="pass"?1:20);save();renderComposer();return;
 }
 if(el.dataset.itemField){
  const it=state.items.find(x=>x.id===el.dataset.id);if(!it)return;
  const k=el.dataset.itemField;
  if(k==="name")it.name=el.value.slice(0,90);
  else if(k==="type"){it.type=["arma","armadura","escudo","foco","ferramenta","outro"].includes(el.value)?el.value:"outro";}
  else if(k==="weight"){it.weight=Object.hasOwn(WEIGHTS,el.value)?el.value:"leve";}
  else if(k==="qty")it.qty=clamp(Math.floor(el.value),1,99);
  else if(k==="grade"){it.grade=clamp(Math.floor(el.value),1,4);}
  else if(k==="max"){it.max=it.type==="armadura"&&it.weight==="muito_leve"?0:clamp(Math.floor(el.value),0,999);it.hp=clamp(it.hp,0,it.max);}
  else if(k==="elementalResistance"){it.elementalResistance=String(el.value).slice(0,70);}
  else if(k==="secondResistance"){it.secondResistance=String(el.value).slice(0,70);}
  else if(k==="specificImmunity"){it.specificImmunity=String(el.value).slice(0,70);}
  if(it.type==="armadura"&&it.weight==="muito_leve"){it.max=0;it.hp=0;}
  if(it.equipped&&it.type==="armadura"&&!canEquipArmor(state,it)){it.equipped=false;toast("Armadura desequipada: nível ou requisitos do tipo/Grau não atendidos.");}
  renderInventory();renderVitals();save();return;
 }
}
function bind(){
 document.addEventListener("click",onClick);
 document.addEventListener("click",event=>{
  const dlg=$("skill-detail-dialog");
  if(event.target.closest("#skill-detail-close")){dlg.close();return;}
  if(event.target===dlg){dlg.close();return;}
  const card=event.target.closest("[data-skill-open]");
  if(card&&!event.target.closest("button, a, input, select"))openSkillDetails(card.dataset.skillOpen);
 });
 document.addEventListener("keydown",event=>{
  if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-skill-open]")){
   event.preventDefault();openSkillDetails(event.target.dataset.skillOpen);
  }
 });
 document.addEventListener("click",event=>{
  const b=event.target.closest("button[data-resource]");if(b)adjustResource(b.dataset.resource,Number(b.dataset.delta));
 });
 document.addEventListener("change",onChange);
 document.addEventListener("input",event=>{
  if(event.target?.dataset?.skillSearch!==undefined){
   skillFilter.query=String(event.target.value).slice(0,100);
   renderWizardSkillCards();renderSkills();syncSkillFilterControls();return;
  }
  const field=event.target?.dataset?.wizardField;
  if(viewMode!=="builder"||!["name","concept","origin","virtue","personality"].includes(field))return;
  state[field]=String(event.target.value).slice(0,field==="name"?70:100);
  save();
  const heading=$("wizard-summary")?.querySelector?.(".fp-wiz-summary-top strong");
  if(heading)heading.textContent=state.name||"Novo Aprendiz";
 });
 document.addEventListener("change",event=>{
  if(event.target?.matches?.("[data-wizard-focus]"))setWeaponFocus(event.target.value);
 });
 for(const [id,field] of [["char-name","name"],["char-concept","concept"],["char-origin","origin"],["char-virtue","virtue"],["char-personality","personality"],["char-notes","notes"]]){
  $(id).addEventListener("input",function(){state[field]=this.value;save();});
 }
 $("char-level").addEventListener("change",function(){this.value=state.level;});
 $("xp-award").addEventListener("click",()=>{
  if(state.pending){toast("Finalize a rolagem antes de conceder XP.");return;}
  const amount=Math.floor(Number($("xp-award-amount").value));
  if(!Number.isSafeInteger(amount)||amount<1||amount>9999){toast("Informe de 1 a 9999 XP.");return;}
  if(state.xpEarned+amount>1000000){toast("XP acumulado acima do limite desta ferramenta.");return;}
  if(!state.creationLocked){lockCreation();toast("Criação concluída com saldo inicial não gasto livre.");}
  state.xpEarned+=amount;
  state.xpHistory.unshift({at:new Date().toISOString(),amount,note:"XP concedidos manualmente"});
  state.xpHistory=state.xpHistory.slice(0,60);
  render();save();toast("+"+amount+" XP de evolução disponíveis para compra.");
 });
 $("lock-creation").addEventListener("click",()=>{
  if(state.pending||state.creationLocked||xpCosts().free<0)return;
  if(!confirm("Concluir a criação do Aprendiz? O XP inicial não gasto ficará livre para qualquer categoria. Reduções exigem Editar ficha."))return;
  const residual=lockCreation();render();save();toast("Criação concluída! XP inicial livre: "+residual+".");
 });
 $("level-up").addEventListener("click",()=>{
  if(state.pending||state.level>=20||xpCosts().free<0)return;
  const next=state.level+1;
  if(!confirm("Evoluir para o nível "+next+"? A curva de XP é experimental: nenhuma quantidade será concedida automaticamente."))return;
  if(!state.creationLocked)lockCreation();state.level=next;
  render();save();toast("Nível "+next+" alcançado. Distribua o XP recebido conforme a campanha.");
 });
 $("weapon-focus").addEventListener("change",event=>setWeaponFocus(event.target.value));
 $("theme-toggle").addEventListener("click",()=>{
  const next=document.documentElement.dataset.theme==="light"?"dark":"light";
  document.documentElement.dataset.theme=next;
  localStorage.setItem(THEME_KEY,next);
 });
 $("edit-sheet").addEventListener("click",()=>{
  if(state.pending){toast("Finalize ou descarte a rolagem antes de editar.");return;}
  if(viewMode!=="sheet")return;
  editMode=!editMode;draft=freshDraft();render();save();
  toast(editMode?"Edição ativa: use + ou − para ajustar graus e XP.":"Edição concluída. Selecione fontes para rolar.");
 });
 $("demo-load").addEventListener("click",()=>{
  if(!confirm("Carregar uma ficha de exemplo? A ficha atual será substituída (você pode exportá-la antes)."))return;
  state=demo();draft=freshDraft();editMode=false;viewMode="sheet";wizardStep=4;wizardReached=4;
  wizardPersist();syncFields();render();save();toast("Exemplo carregado. Experimente selecionar Disciplina → Força; Disciplina Avançada permite uma terceira fonte.");
 });
 $("start-wizard").addEventListener("click",()=>{
  if(!confirm("Iniciar um novo Aprendiz? Exporte antes a ficha atual se quiser preservá-la."))return;
  state=defaultState();draft=freshDraft();editMode=false;viewMode="builder";wizardStep=0;wizardReached=0;
  wizardPersist();syncFields();render();save();toast("Nova criação iniciada.");
 });
 $("reset-sheet").addEventListener("click",()=>{
  if(!confirm("Reiniciar a ficha atual? Exporte o personagem antes se quiser preservar uma cópia."))return;
  state=defaultState();draft=freshDraft();editMode=false;viewMode="builder";wizardStep=0;wizardReached=0;
  wizardPersist();syncFields();render();save();toast("Nova criação iniciada.");
 });
 $("export-json").addEventListener("click",download);
 $("import-trigger").addEventListener("click",()=>$("import-json").click());
 $("import-old-creator").addEventListener("click",()=>{
  let raw;
  try{raw=localStorage.getItem(OLD_SAVE_KEY);}catch(e){}
  if(!raw){toast("Nenhuma ficha do criador anterior encontrada neste navegador.");return;}
  if(!confirm("Importar a ficha do criador anterior? Isso substituirá a ficha atual. Exporte a ficha atual antes se quiser preservá-la. A ficha antiga continuará guardada."))return;
  try{
   const converted=fromCreator(JSON.parse(raw));
   converted.creationLocked=!!converted.name.trim();
   state=normalize(converted);draft=freshDraft();editMode=false;
   viewMode=state.creationLocked?"sheet":"builder";
   wizardStep=0;wizardReached=0;wizardPersist();syncFields();render();save();
   toast("Ficha antiga importada. Confira as anotações e investimentos em XP.");
  }catch(e){toast("Não foi possível importar a ficha antiga: "+e.message);}
 });
 $("import-json").addEventListener("change",async event=>{const f=event.target.files?.[0];if(f)await importFile(f);event.target.value="";});
 $("portrait-trigger").addEventListener("click",()=>$("portrait-input").click());
 $("portrait-input").addEventListener("change",event=>{
  const f=event.target.files?.[0];if(!f)return;
  if(f.size>1000000||!["image/jpeg","image/png","image/webp"].includes(f.type)){toast("Use PNG, JPG ou WebP de até 1 MB.");return;}
  const reader=new FileReader();
  reader.onload=()=>{if(String(reader.result).length>1550000){toast("Imagem grande demais para o salvamento local.");return;}
   state.portrait=String(reader.result);$("portrait-image").src=state.portrait;
   $("portrait-trigger").classList.toggle("fp-has-portrait",true);renderWizard();
   save();toast("Retrato atualizado.");};
  reader.readAsDataURL(f);event.target.value="";
 });
 $("add-item").addEventListener("click",()=>{
  state.items.push(normalizeItem({name:"Novo equipamento",type:"outro",weight:"leve",grade:1,max:0}));renderInventory();renderVitals();save();
 });
 $("convert-courage").addEventListener("click",()=>{
  if(state.level<5||state.courageUsedTurn||state.courage<2||state.pp>=maxPP())return;
  state.courage-=2;state.pp++;state.courageUsedTurn=true;renderVitals();renderSkills();save();toast("Perícia em Coragem: 2 Coragens convertidas em 1 PP.");
 });
 $("reset-turn").addEventListener("click",()=>{state.courageUsedTurn=false;renderSkills();save();toast("Nova oportunidade: conversão em Coragem liberada.");});
 window.addEventListener("storage",event=>{if(event.key===SAVE_KEY&&event.newValue){toast("A ficha foi alterada em outra aba. Recarregue para sincronizar.");}});
}
bind();load();
})();