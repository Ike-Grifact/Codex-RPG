/* Codex RPG — espelho de catálogo da ficha de jogador.
   Origem: prototipo-ficha/app.js, branch main em 23/11/2026.
   TESTE de sincronização compara integralmente IDs, nomes, descrições, custos e requisito.
   Não introduz custos, compras gratuitas ou Perícias novas. */
const SOURCE_PROPS={attr:"attributes",know:"knowledges",practice:"practices"};
function racialGrants(s){
 switch(s.race){
  case "humano":return ["maestria-armas-fogo"];
  case "lucker_sangue":return ["sangue"];
  case "lucker_puro":return ["criar-item-foco-magia",...(["fogo","agua","vento","terra","sagrado"].includes(s.pureElement)?[s.pureElement]:[])];
  case "runa_espinhos":return ["pugilismo","criar-item-foco-magia","escudo-arcano",...(["vento","agua","terra","fogo"].includes(s.runeElements?.[0])?[s.runeElements[0]]:[])];
  default:return [];
 }
}
function ownsSkill(id,s){return (s.skills||[]).includes(id)||racialGrants(s).includes(id);}

export const ADVANCED_SOURCE_DEFS=[{"id":"disciplina-avancada","group":"practice","key":"armas_conjuracao","label":"Disciplina"},{"id":"furtividade-avancada","group":"practice","key":"furtividade","label":"Furtividade"},{"id":"medicina-avancada","group":"know","key":"medicina","label":"Medicina"},{"id":"protecao-avancada","name":"Proteção Avançada","group":"know","key":"protecao","label":"Proteção","ref":"k:protecao:3"},{"id":"astronomia-avancada","name":"Astronomia Avançada","group":"know","key":"astronomia","label":"Astronomia","ref":"k:astronomia:3"},{"id":"alquimia-avancada","name":"Alquimia Avançada","group":"know","key":"alquimia","label":"Alquimia","ref":"k:alquimia:3"},{"id":"engenharia-avancada","name":"Engenharia Avançada","group":"know","key":"engenharia","label":"Engenharia","ref":"k:engenharia:3"},{"id":"erudicao-avancada","name":"Erudição Avançada","group":"know","key":"erudicao","label":"Erudição","ref":"k:erudicao:3"},{"id":"atletismo-avancado","name":"Atletismo Avançado","group":"practice","key":"atletismo","label":"Atletismo","ref":"p:atletismo:3"},{"id":"artesao-avancado","name":"Artesão Avançado","group":"practice","key":"artesao","label":"Artesão","ref":"p:artesao:3"},{"id":"apresentacao-avancada","name":"Apresentação Avançada","group":"practice","key":"apresentacao","label":"Apresentação","ref":"p:apresentacao:3"},{"id":"coleta-avancada","name":"Coleta Avançada","group":"practice","key":"coleta","label":"Coleta","ref":"p:coleta:3"}];

const WEAPON_MASTERY_TYPES=Object.freeze([
 {id:"maestria-adagas",name:"Especialização em Armas — Adagas e Facas",family:"adagas",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-espadas",name:"Especialização em Armas — Espadas",family:"espadas",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-machados",name:"Especialização em Armas — Machados",family:"machados",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-hastes",name:"Especialização em Armas — Lanças e Hastes",family:"hastes",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-cajados",name:"Especialização em Armas — Cajados e Bastões",family:"cajados",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-arcos",name:"Especialização em Armas — Arcos",family:"arcos",activationReq:"Perícia em Armas de Longo Alcance"},
 {id:"maestria-bestas",name:"Especialização em Armas — Bestas",family:"bestas",activationReq:"Perícia em Armas de Longo Alcance"},
 {id:"maestria-arremessos",name:"Especialização em Armas Arremessadas",family:"arremessos",activationReq:"Perícia em Arremesso de Armas e Perícia de Armas do peso"},
 {id:"maestria-punhos",name:"Especialização em Armas de Punho",family:"punhos",activationReq:"Pugilismo"},
 {id:"maestria-longo-alcance",name:"Especialização em Armas de Longo Alcance Diversas",family:"longo-alcance",activationReq:"Perícia em Armas de Longo Alcance"},
 {id:"maestria-armas-fogo",name:"Especialização em Armas de Fogo",family:"fogo",activationReq:"Perícia em Armas de Fogo"},
]);
const APPROVED_WEAPON_MASTERY_PURCHASE=Object.freeze({
 "maestria-hastes":"Força 2 + Agilidade 1 + Destreza 1",
 "maestria-espadas":"Força 2 + Destreza 2",
 "maestria-adagas":"Agilidade 2 + Destreza 2",
 "maestria-machados":"Força 2 + Destreza 1",
 "maestria-cajados":"Destreza 2",
 "maestria-punhos":"Força 1 + Agilidade 1 + Destreza 1 + Vigor 1"
});

const SKILLS=[
 ["dueto-improvisado","Dueto Improvisado","PROPOSTO: transferir 1A musical ao parceiro de dueto sem duplicar símbolo. XP de compra PENDENTE.",null],
 ["contratempo","Contratempo","PROPOSTO: interferir na seleção de dados mantidos pelo inimigo; custos e procedimento pendentes. XP de compra PENDENTE.",null],
 ["solo-provocador","Solo Provocador","PROPOSTO: usar Apresentação e Influência para chamar atenção, sem controle mental automático. XP de compra PENDENTE.",null],
 ["cancoes-sustentadas","Canções Sustentadas","PROPOSTO: uma composição musical ativa por Bardo; duração, interrupção e ação pendentes. XP de compra PENDENTE.",null],
 ["pericia-em-instrumentos","Perícia em Instrumentos","Meio instrumental para habilidades do Bardo. Efeitos próprios e XP pendentes.",null],
 ["maestria-em-apresentacao","Maestria em Apresentação","EXPERIMENTAL — Perícia ÚNICA do Bardo. Requer Apresentação 4, Influência 4, Destreza 4, Apresentação Avançada e Perícia em Instrumentos. Gera até 3A musicais totais de apoio, distribuídos conforme a DE de cada aliado. Repertório interno: Inspiração 3A→1 Coragem, Ressonância Arcana 3A→1 carga de foco, Acorde de Proteção 1A→anula 1P, Acorde Triunfal 2A→1E, passagem de protagonismo, Ritmo Acelerado e Harmonia Musical. Desarmonia após falha com Pavor. Melodia Psíquica é opção condicional com Disciplina 4 + Criar Item de Foco e Magia e instrumento para até dois alvos; procedimentos de alvos pendentes. Custo de aquisição XP PENDENTE.",null],
 ["voz-encantadora","Voz Encantadora","EXPERIMENTAL: Influência 4 + Apresentação 4 + Vigor 3. Voz substitui instrumento para apresentações comuns, sem substituir instrumentos específicos da Melodia Psíquica. XP pendente.",null],
 ["ritmo-de-batalha","Ritmo de Batalha","EXPERIMENTAL: apoiar na mesma rodada de ataque ou conjuração. Não habilita duas Práticas na mesma pilha nem ação extra. Procedimento e XP pendentes.",null],
 ["inspiracao","Inspiração","EXPERIMENTAL: 3A musicais para recuperar 1 Coragem de um aliado, sem ultrapassar seu teto. XP pendente.",null],
 ["ressonancia-arcana","Ressonância Arcana","EXPERIMENTAL: 3A musicais para recuperar 1 carga de foco de aliado, sem ultrapassar sua capacidade. XP pendente.",null],
 ["acorde-de-protecao","Acorde de Proteção","EXPERIMENTAL: 1A musical para anular 1 Pavor mantido de aliado antes de encerrar sua rolagem. XP pendente.",null],
 ["acorde-triunfal","Acorde Triunfal","EXPERIMENTAL: 2A musicais para conceder 1E a aliado elegível, sem duplicação. XP pendente.",null],
 ["compasso-adiantado","Compasso Adiantado","EXPERIMENTAL: 1A musical para favorecer protagonismo de aliado, sem turno extra; procedimento pendente.",null],
 ["ritmo-acelerado","Ritmo Acelerado","EXPERIMENTAL: distribuir 3A totais entre até três aliados, máximo de 1A cada. XP pendente.",null],
 ["harmonia-musical","Harmonia Musical","EXPERIMENTAL: neutraliza Vantagem/Desvantagem comuns em área 16x16 m, inclui inimigos. Duração e XP pendentes.",null],
 ["piada-infame","Piada Infame","PROPOSTO: rerrolar um dado de inimigo; novo resultado vale mesmo se melhor. Custos e procedimento pendentes.",null],
 ["elevacao-harmonica","Elevação Harmônica","PROPOSTO: elevar um passo de um dado por aliado, sem d20. Custos e procedimento pendentes.",null],
 ["acao-em-conjunto-musical","Ação em Conjunto","EXPERIMENTAL: proposta Apresentação + Disciplina + Influência com +1E e +1A, mas combinar duas Práticas ainda não autorizado.",null],
 ["presenca-de-palco","Presença de Palco","EXPERIMENTAL: proposta +1E em apresentações; condições e compra XP pendentes.",null],
 ["melodia-psiquica","Melodia Psíquica","EXPERIMENTAL: Disciplina 4 + Criar Item de Foco e Magia. Instrumento canaliza efeitos de armas OU psíquicos em até 2 alvos; não duplica dados/dano nem concede perícias. XP e procedimentos pendentes.",null],
 [
  "maos-leves","Mãos Leves","1 XP. Requisitos: Furtividade 3 + Disciplina 3 + Proteção 2. Em combate, remove itens de inventário inimigo (armas, escudos ou armaduras), rolando Disciplina + Furtividade. DE = DE inimiga + Grau do item + peso, somente se equipado. Ex.: DE 3 + item G1 equipado Leve = DE 5; Médio = DE 6. A combinação de duas Práticas é exceção específica desta Perícia e não é habilitada genericamente.",1
 ],
 [
  "pericia-armadilha","Perícia em Armadilha","1 XP. Requisitos: Artesão 1 + Disciplina 1 + Engenharia 1 + Destreza 1 + Inteligência 1 + Proteção 2 + Furtividade 1. Concede Vantagem ao armar ou desarmar armadilhas; os testes utilizam Proteção. Vantagem segue a regra geral de +1A e não concede dado extra.",1
 ],
 [
  "golpe-furtivo","Golpe Furtivo","1 XP. Requisitos: Disciplina 2 + Furtividade 2. Ao atacar furtivamente, adiciona mais um dado da arma à pilha, respeitando o limite geral de dados e a habilitação da arma. Não adiciona dado ao ataque que não seja furtivo nem converte dado em dano automático.",1
 ],
 [
  "bioetica","Bioética","1 XP. Requisitos: Alquimia 3 + Inteligência 3 + Destreza 3 + Perícia em Sangue + Criar Item de Foco e Magia + outra Perícia Elemental + Domar Criatura Média. Permite criar homúnculos: criaturas elementais de carne formadas pela mistura do DNA de duas outras criaturas. Destreza 3 confirmada. O homúnculo usa ficha própria, separada da ficha do criador, com XP próprio igual ao XP total atual do criador, seguindo as regras e tabelas de Atributos das criaturas domadas conforme porte. A criação exige sangue e tecidos vivos. Porte e quantidades de materiais permanecem pendentes.",1
 ],
 [
  "pesquisa-avancada-pocoes","Pesquisa Avançada em Poções","1 XP. Requisitos: Alquimia 3 + Improviso Elemental + Artesão 3 + Destreza 2. Concede +1 Êxito (E) aos testes de criação de poções e habilita a criação de poções elementais. Receitas, custo de materiais, graus e efeitos específicos não foram definidos.",1
 ],
 [
  "corpo-fechado","Corpo Fechado","1 XP. Requisitos: Vigor 4 + Artista Marcial. Gasta 1 Coragem para não sofrer efeitos nem dano de golpes de armas físicas em sua Vitalidade por 1 rodada. Não protege automaticamente Integridade da armadura nem concede imunidade a magia; resolução do tempo de rodada pelo Narrador.",1
 ],
 [
  "invocar-esfera-espiritual","Invocar Esfera Espiritual","1 XP. Requisitos: Criar Item de Foco e Magia + Destreza 4 + Inteligência 3 + Vigor 3. Converte Coragem em Esferas Espirituais, com limite de 5 criações por rodada e teto de 5 esferas armazenadas. Ao reunir 5 esferas permite transformar um dado em d20 para o golpe corpo a corpo de Disciplina conhecido como Punho Supremo de Asura. Cada esfera custa 1 Coragem; até 5 podem ser criadas na rodada, com teto de 5 armazenadas. Punho Supremo de Asura consome 5 esferas e 1 Coragem ao finalizar um golpe corpo a corpo com Disciplina, substituindo um dado escolhido por d20; o d20 contribui para atingir a DE e calcular o dano básico por seus símbolos mantidos; esse dano é sempre neutro e não tem parcela extra.",1
 ],
 [
  "passo-etereo","Passo Etéreo","1 XP. Requisitos: Invocar Esfera Espiritual. Arremessa uma Esfera Espiritual e se projeta em deslocamento rápido de até 8 metros, consumindo 1 esfera. Movimento e obstáculos dependem do mapa do combate.",1
 ],
 [
  "absorver-esferas","Absorver Esferas","1 XP. Requisitos: Invocar Esfera Espiritual. Recupera Coragem em quantidade igual ao total de Esferas Espirituais; consome TODAS as esferas disponíveis. Recupera 1 Coragem por esfera consumida, limitada ao teto; esferas ficam em zero após a absorção.",1
 ],
 [
  "disparo-esferas-espirituais","Disparo de Esferas Espirituais","1 XP. Requisitos: Invocar Esfera Espiritual. Permite ataques físicos à distância por disparo de Esferas Espirituais, gastando 1 esfera por golpe. Alcance, dados, DE e cálculo de dano não informados; não presumir ataque de magia.",1
 ],
 [
  "dilema","Dilema","1 XP. Requisitos: Vigor 4 + Artista Marcial. Desafia um inimigo para pacto de combate que impede ambos de se moverem até que um dos dois fique inconsciente. Procedimentos de resistência, interrupção, distância e condição em caso de fuga não foram especificados.",1
 ],
 [
  "impacto-psiquico","Impacto Psíquico","1 XP. Requisitos: Criar Item de Foco e Magia + Artista Marcial. Por 1 Coragem permite golpes psíquicos que aplicam efeitos de armas. Dados, classificação de efeitos elegíveis e interação com proteção física requerem decisão; não supor dano extra.",1
 ],
 ...WEAPON_MASTERY_TYPES.map(({id,name,family,activationReq})=>[
  id,name,
  (family==="fogo"?"Custo nominal 1 XP; exclusiva de Humanos e concedida gratuitamente pela origem. ":APPROVED_WEAPON_MASTERY_PURCHASE[id]?"1 XP. Requisitos de compra: "+APPROVED_WEAPON_MASTERY_PURCHASE[id]+". ":"1 XP. Requisitos de compra ainda PENDENTES. ")+"Especialização passiva por família de arma, sem custo próprio de ativação: no acerto comum, uma característica da arma é gratuita. Para tentar uma segunda, declare e pague 1 Coragem antes de rolar; no crítico com acerto, a recuperação normal do crítico compensa esse custo, deixando duas características diferentes gratuitas no saldo. Uma terceira diferente exige mais 1 Coragem declarada antecipadamente, quando a arma permitir; falha não devolve gastos e a recuperação do crítico ocorre somente uma vez. Exige "+activationReq+" para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
  1
 ]),
 [
  "combate",
  "Combate",
  "+1A em combate pertinente.",
  1
 ],
 [
  "armas",
  "Armas 1",
  "Habilita uma categoria de arma, inclusive Punhos.",
  2
 ],
 [
  "montar",
  "Montar Animal",
  "2 XP. Requer Influência 2. Nos testes com montaria concede Vantagem, não +1A. Vantagem e Antecipar são benefícios distintos.",
  2
 ],
 [
  "pericia-montaria",
  "Perícia em Montaria",
  "Requisitos: Influência 1 + Destreza 2. Concede +1A (um símbolo Antecipar) nos testes com montaria, não Vantagem nem dado extra. Custo de XP PENDENTE; compra bloqueada até decisão autoral.",
  null
 ],
 [
  "montaria-epica",
  "Montaria Épica",
  "PROPOSTO / PENDENTE: Cavalaria para montarias gigantes, aladas ou exóticas. Requisitos, custo de XP e efeitos ainda não definidos; não concede montaria, voo ou bônus automaticamente.",
  null
 ],
 [
  "provocacao-sofisticada",
  "Provocação Sofisticada",
  "Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.",
  1
 ],
 [
  "criar-item-foco-magia",
  "Criar Item de Foco e Magia",
  "1 XP · Disciplina 1 + Inteligência 1 + Artesão 1. SUBSTITUI Aprendiz de Conjurador e Magia Única. Ativação-base G1/G2 Psíquica gratuita com a Perícia e o Grau habilitados; foco por Artesão recarrega em N rodadas no Grau N. Magias são criadas e narradas livremente na própria ação, conforme conceitos dos elementos, Perícias adquiridas, Graus, fontes e combinações habilitadas. Não há magias memorizadas, spellslots, peso mental, desconto de −1 por Criar Magia nem custo de 2 Coragens por criação fora de combate. Preparação G2/G3/G4 é tempo de conjuração em cena, não memorização, mantendo custos, DE, Pavor, focos e outros requisitos publicados.",
  1
 ],
 [
  "escudo-arcano",
  "Escudo Arcano",
  "Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 Coragem. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 Coragem amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa. NOVA regra v0.54: Escudo Arcano Psíquico ATIVO anula Perfurante de armas físicas, sem anular acerto ou dano; Perfurar da magia de Água não é anulado. Escudo pessoal ou circular protege de todas as direções; parede linear apenas segundo sua geometria. Levantar Escudo físico é ação com rolagem de Disciplina, E+P válidos mantidos para Integridade extra; só defende o primeiro ataque frontal e abaixa após resolvê-lo, mesmo que erre; excedente vai para armadura e depois Vida. A aplicação automática do bloqueio físico ainda não foi implementada.",
  1
 ],
 [
  "conjuracao-equilibrada",
  "Conjuração Refinada",
  "1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Destinada a aumentar a distância de disparos e efeitos mágicos. PENDENTE: alcance adicional, custo e procedimento até a reescrita pelo autor. NÃO altera peso/dados automaticamente. ID de compra preservado.",
  1
 ],
 [
  "improviso",
  "Improviso Elemental",
  "Requisitos Disciplina 1, Inteligência 1 e Destreza 1, sem Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.",
  1
 ],
 [
  "cancelar-magia",
  "Cancelar Magia",
  "1 XP. Requer Criar Item de Foco e Magia, Improviso Elemental, Inteligência 4, Agilidade 4 e Destreza 4. Ao perceber magia em conjuração até 8 m cuja rolagem manteve Pavor, pode gastar 1 Coragem para tentar cancelá-la; o resultado de cancelamento deve IGUALAR OU SUPERAR (≥) a DE da magia lançada, considerando todos os valores mantidos conforme a declaração do Narrador. Empate cancela a magia. Exige possuir a Perícia do elemento que pretende cancelar. Sem resolução automática do lançamento inimigo.",
  1
 ],
 [
  "desencantar",
  "Desencantar",
  "1 XP. Requer Cancelar Magia. Remove elementos ou imunidades até 8 m. Pode remover elementos ou imunidades a até 8 m (inclusive em alvos encantados), exceto o elemento natural constituinte de criatura realmente feita daquele elemento. Custo, teste e duração pendentes; não destruir automaticamente objeto ou criatura.",
  1
 ],
 [
  "espelho-magico",
  "Espelho Mágico",
  "1 XP. Requer Cancelar Magia. Passivo: permite refletir contra o conjurador a parcela do dano mágico causada pelos Pavor(es) mantidos por ele na rolagem. Reflete a parcela mágica de dano de Pavor calculada ANTES de a armadura do alvo absorver ou anular o dano; mesmo quando a armadura bloqueia tudo. Não reflete ataques físicos nem Pavor que não causaria dano antes da proteção. Proteção do conjurador e cumulação com Escudo Refletor pendentes.",
  1
 ],
 [
  "encantar-com-elemento",
  "Encantar com Elemento",
  "1 XP. Requisitos: uma Perícia Elemental adquirida + Criar Item de Foco e Magia. Armaduras ou escudos: 1 Coragem para resistência ao elemento habilitado; dano do elemento resistido é 0,5 por Êxito de ataque, Pavor causa 0 dano (não elimina riscos). Armas: tornam-se temporariamente do elemento escolhido. Duração igual para arma, armadura e escudo: E-P, somente com E-P>0. Unidade temporal, DE/fontes e custo específico de arma pendentes; sem efeitos extras ou automação.",
  1
 ],
 [
  "mestre",
  "Maestria Elemental",
  "Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. A mistura consciente do segundo elemento custa 1A; o custo próprio histórico da Maestria para ativar duas propriedades especiais está PENDENTE de reconciliação, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.",
  1
 ],
 [
  "fogo",
  "Perícia em Elemento Fogo",
  "1 XP · Disciplina 1 + Inteligência 1. G1: disparo de Fogo, iluminação e conduzir chamas existentes, sem dano direto extra à Vida. G2 QUEIMAR: em acerto, E válidos + 1 dano por Pavor não anulado à Integridade da armadura, substituindo a parcela padrão de Pavor, área 4×4 em cone/linha/círculo, sem dano direto adicional à Vida. G1/G2 com Perícia e Grau habilitados: ativação-base gratuita, inclusive sem foco se a fonte elemental estiver disponível no ambiente; não há adicional de Coragem em G2. G3: 1 Coragem para elevar o efeito. Na G4 conjunta: 1 Coragem pela elevação de Fogo a G3, respeitando o custo separado do outro elemento e 1 Antecipar da mistura. G3 DERRETER: mesmo dano de Queimar à armadura + exatamente 1 Vida direta fixa (não dobrada por crítico); área 8×8, conjurar ao final do turno dos aliados. Graus superiores e procedimento contra imunidade/barreiras exigem confirmação do Narrador.",
  1
 ],
 [
  "agua",
  "Perícia em Elemento Água",
  "1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Água. Em ataque acertado, mesmo sem crítico, a ativação-base de um efeito G1/G2 habilitado é gratuita. G1: Congelar por 1 rodada sem dano no estado Leve; extrair água do ar, mover, molhar e limpar. G2: Perfurar no CRÍTICO ou por ativação paga; dano à Vida e à armadura. G3: conjurar no final do turno dos aliados; Empurrar, Perfurar, Congelar e dano à Vida e à armadura, mantendo propriedades menores pertinentes. Resolução e efeitos exatos não automatizados.",
  1
 ],
 [
  "vento",
  "Perícia em Elemento Ar",
  "1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Ar. No acerto, mesmo sem crítico, escolha gratuitamente UM efeito G1/G2 habilitado. G1: autoempurrão +4 m de deslocamento; puxar/empurrar objetos; linha, círculo, cone, X. G2: sufocar com dano à Vida ou armadura, puxar, empurrar + derrubar com dano, deslocamento até +8 m. G3: conjurar no final do turno dos aliados, área grande e múltiplos alvos, tornado/rajada, possíveis danos por queda (16 m ainda sem interpretação geométrica). Formas: linha, círculo, cone, X. TAMBÉM pode recuperar Fôlego (Grau, quantidade e gatilho pendentes). Efeitos não automatizados.",
  1
 ],
 [
  "terra",
  "Perícia em Elemento Terra",
  "1 XP · Disciplina 1 + Inteligência 1. Conjuração elemental Leve de Terra. Ao acertar ataque, inclusive não crítico, escolha gratuitamente UM efeito G1/G2 habilitado. G1: Desvantagem 2 RODADAS (terra nos olhos), emaranhar pés, derrubar, lançar pequenas pedras, criar plataformas de deslocamento, sentido sísmico 18×18 m para detectar furtivos e armadilhas. G2: enredar e imobilizar, Desvantagem 2 TURNOS, espinhos danificam armadura/proteção, sentido sísmico 32×32. G3: conjurar ao final do turno dos aliados, área 5×5, linha/cone/círculo A PARTIR DO ALVO, dano, empurrão e derrubada, sentido sísmico 64×64. Unidades não informadas e efeitos adicionais não automatizados.",
  1
 ],
 [
  "sagrado",
  "Perícia em Elemento Sagrado",
  "Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação-base gratuita em G1/G2 quando habilitada. Suporte em si ou aliado próximo exige alcançar a DE do beneficiário. Cada E excedente recupera 1 Coragem, cada P não anulado cancela um E destinado a recuperação (não reaproveitado como dano). Em área, todos os aliados beneficiados recuperam igualmente; E excedentes podem causar dano aos inimigos cujas DEs foram alcançadas. Conjurador escolhe enfoque em dano, suporte ou combinação. Aliados não sofrem dano sagrado de suporte. G2/G3 por combinação elemental.",
  2
 ],
 [
  "veneno",
  "Perícia em Elemento Veneno",
  "Conjuração distinta da alquimia Criar Veneno. No acerto em alvo com Sangramento, aplica gratuitamente 1 acúmulo G1/G2 habilitado por 2 rodadas sem renovar os anteriores. A partir de 2/3 da Vida atual, Ferido; se acúmulos alcançam Vida atual, Incapacitado. Se estiver Envenenado com exatamente 2 de Vida atual OU atingir 12 acúmulos ativos, Inconsciente. Não causa dano direto à Vida; criaturas biologicamente incompatíveis podem ser imunes. Graus 2 e 3 exigem combinação elemental.",
  2
 ],
 [
  "sangue",
  "Perícia em Elemento Sangue",
  "Rework v0.74: Sangue puro atinge proteção normalmente. Quando uma magia de Sangue acerta e foi amplificada para dano direto, TODO o dano calculado atinge a Vida sem passar pela Integridade da armadura; não soma bônus nem desgasta a armadura em paralelo. Custo: 1 Vida própria OU 3 marcas inimigas, uma vez por turno, em alternativa a manter ou elevar dado. O Pavor continua gerando risco. Extração como técnica segue revogada. Cada Vida de inimigo realmente perdida gera 1 marca.",
  2
 ],
 [
  "trevas",
  "Perícia em Elemento Trevas",
  "Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação-base G1/G2 gratuita com Perícia e Grau habilitados, respeitando gatilhos. Escurecimento, Pavor e maldições. Técnica especializada usa uma única rolagem contra um ou dois alvos e soma +2P ANTES da DE, contando para acerto, dano e risco. Pavor não anulado é dividido entre os dois alvos de modo equilibrado ou focado em um, sem duplicar; um só alvo é permitido. G2/G3 exigem mescla.",
  2
 ],
 [
  "armas-leves",
  "Perícia em Armas Leves",
  "Disciplina 1; 2 XP. Antes de rolar um ataque com arma Leve, gaste 1 Coragem para tentar ativar UMA característica própria; o gasto é mantido mesmo na falha e o efeito só ocorre no acerto. Em crítico com acerto, o personagem recupera 1 Coragem já paga, usando a recuperação normal do crítico (sem bônus duplicado); assim, essa característica fica gratuita no saldo final. Outra característica distinta, quando permitida, exige Coragem declarada antes da rolagem. Ignora somente −1A da Desvantagem natural de peso contra armadura Pesada/Muito Pesada; demais penalidades permanecem.",
  2
 ],
 [
  "armas-medias",
  "Perícia em Armas Médias",
  "Disciplina 1 + Força 1; 2 XP. Antes de rolar um ataque com arma Média, gaste 1 Coragem para tentar ativar UMA característica própria; o gasto é mantido mesmo na falha e o efeito só ocorre no acerto. Em crítico com acerto, o personagem recupera 1 Coragem já paga, usando a recuperação normal do crítico (sem bônus duplicado); assim, essa característica fica gratuita no saldo final. Outra característica distinta, quando permitida, exige Coragem declarada antes da rolagem. Ignora somente −1A da Desvantagem natural de peso contra armadura Média; demais penalidades permanecem.",
  2
 ],
 [
  "armas-pesadas",
  "Perícia em Armas Pesadas",
  "Disciplina 2 + Força 2; 2 XP. Antes de rolar um ataque com arma Pesada, gaste 1 Coragem para tentar ativar UMA característica própria; o gasto é mantido mesmo na falha e o efeito só ocorre no acerto. Em crítico com acerto, o personagem recupera 1 Coragem já paga, usando a recuperação normal do crítico (sem bônus duplicado); assim, essa característica fica gratuita no saldo final. Outra característica distinta, quando permitida, exige Coragem declarada antes da rolagem. Ignora somente −1A da Desvantagem natural de peso contra armadura Leve/Muito Leve; demais penalidades permanecem.",
  2
 ],
 [
  "disciplina-avancada",
  "Disciplina Avançada",
  "Perícia passiva — sem custo de ativação. Disciplina 3; ao realizar uma ação com Disciplina como fonte principal, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.",
  1
 ],
 [
  "concentracao-refinada",
  "Concentração Refinada",
  "1 XP. Requisito: Disciplina 2. Ao usar a mecânica Antecipação para guardar 1A de uma rolagem com Disciplina para a próxima rolagem, o A reservado converte-se em 1E e você recebe a condição Vantagem. Não pode usar Concentração Refinada com inimigo a 8 m ou menos. O 1A é convertido em 1E guardado ao se concentrar; o 1E e a Vantagem duram até uso, próxima ação ou descanso longo. A compra é automatizada; a reserva ainda é anotada manualmente.",
  1
 ],
 [
  "manejo-perfeito",
  "Manejo Perfeito — Armas Corpo a Corpo",
  "1 XP. Requer Disciplina Avançada (Disciplina 3) + Destreza 2. Perícia passiva — sem custo de ativação. Ao utilizar a arma correta contra um oponente que possui Desvantagem natural contra ela, você recebe Vantagem Absoluta (+1E). Se a ação já estiver em Vantagem Absoluta, aplica Golpe Certo (+2E no total). Consulte as mecânicas Vantagens e Desvantagens e Golpe Certo.",
  1
 ],
 [
  "golpe-fulminante",
  "Golpe Fulminante",
  "Ativação custa 1 Coragem, inclusive no crítico: eleva temporariamente UM dado da arma antes de rolar (d6→d10; d10→d12; d12→2d12). Se acertar, cada Pavor mantido não anulado vale 1 dano, conservando risco e Pressão. Requer especialização corpo a corpo; Arremesso não satisfaz Golpe Fulminante. Máximo 9 dados.",
  1
 ],
 [
  "espalhar-golpe",
  "Golpe Colossal",
  "Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SEM bônus de +1E. Não espalha automaticamente o dano de Pavor de Golpe Fulminante. Arremesso não é especialização aceita. Centro da área PENDENTE.",
  1
 ],
 [
  "pugilismo",
  "Pugilismo",
  "Combate desarmado: socos de peso Médio por padrão. Por 1 Coragem, altere o peso para Leve ou Pesado antes da rolagem.",
  1
 ],
 [
  "artista-marcial",
  "Artista Marcial",
  "Combate desarmado: 1 Coragem por tentativa de manobra, ou sem custo adicional ao ativar Pugilismo. No acerto, aplica uma manobra: Empurrar, Agarrar, Derrubar ou Desarmar.",
  1
 ],
 [
  "maestria-escudos",
  "Maestria em Escudos",
  "1 XP. Requisitos: Destreza 2 + Vigor 2. Ao usar escudo físico equipado, ganha +1 à DE defensiva (teto 12, sem acumular por vários escudos) e +1 de Integridade material nesse escudo. O ponto adicional não altera Integridade-base nem E+P de Levantar Escudo.",
  1
 ],
 [
  "sacrificio-heroico",
  "Sacrifício Heroico",
  "1 XP. Requer Vigor 4. Permite se colocar à frente de alguém a até 8 m e receber o dano no lugar da pessoa, mesmo sem antecipação do próprio turno. Dano vai à armadura ou Vida do protetor conforme as defesas aplicáveis. Sem custo de Coragem informado; posição e dano exigem confirmação do Narrador.",
  1
 ],
 [
  "escudo-refletor",
  "Escudo Refletor",
  "1 XP. Requer Maestria em Escudos. Com escudo físico equipado, ao receber dano reflete ao inimigo atacante os pontos de dano efetivamente causados por Pavor. Não reflete dano de Êxitos ou Pavor que não causou dano; dano original permanece. Aplicação manual conforme Narrador.",
  1
 ],
 [
  "escudo-bumerangue",
  "Escudo Bumerangue",
  "1 XP. Requisitos: Destreza 2 + Força 3 + Perícia em Arremesso de Armas + Maestria em Escudos. Permite ataque com escudo a até 8 m, rolando Disciplina (Armas) + Atributo(s) escolhido(s). Se alcançar a DE, escudo retorna no MESMO TURNO, com ou sem Pavor; se falhar, cai no chão conforme Arremesso de Armas: falha limpa no caminho (1A pode permitir correr e recuperar); com Pavor próximo ao alvo, podendo atingir aliado próximo se alcançar sua DE. Queda em metros: E mantidos + P não anulado + E convertido de 2A. Lançar custa 1 Coragem; no acerto, causa dano físico normal da rolagem (E válidos + piso(P/2), com crítico) e permite características da peça conforme gatilhos e custos normais. Obstáculos e economia de ação permanecem PENDENTES.",
  1
 ],
 [
  "maestria-arremesso-armas",
  "Perícia em Arremesso de Armas",
  "Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.",
  1
 ],
 [
  "disparo-fulminante",
  "Disparo Fulminante",
  "Técnica somática de arco, besta ou arremesso, exceto armas de fogo. Ativação 1 Coragem (inclusive no crítico): eleva UM dado da arma antes da rolagem (d6→d10, d10→d12 ou d12→2d12); no acerto, cada Pavor não anulado causa 1 dano, preservando risco. Combina com outras técnicas pagas, respeitando 9 dados e 5 Coragens por rodada.",
  1
 ],
 [
  "disparo-multiplo",
  "Disparo Múltiplo",
  "A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.",
  1
 ],
 [
  "recuperacao-vigorosa",
  "Recuperação Vigorosa",
  "Vigor 3; adaptação da recuperação à nova Saúde em quatro estados PENDENTE. Custo XP PENDENTE.",
  null
 ],
 [
  "recuperacao-movimento",
  "Maestria em Recuperação Vigorosa em Movimento",
  "Recuperação Vigorosa e Vigor 6; cura natural em viagem após 8h sem dano. Custo XP PENDENTE.",
  null
 ],
 [
  "recobrar-coragem",
  "Recobrar Coragem",
  "1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.",
  1
 ],
 [
  "maestria-manejo-duplo",
  "Perícia em Manejo Duplo",
  "Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 Coragem. Efeitos próprios, como perfurar, sangrar ou envenenar, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.",
  1
 ],
 [
  "instinto-sobrevivencia",
  "Instinto de Sobrevivência",
  "Vigor 3; antigo efeito de remover −1A em Incapacitado está incompatível com −1E/+1P. Novo efeito PENDENTE, sem aplicar bônus automático.",
  null
 ],
 [
  "criar-veneno",
  "Criar Veneno",
  "Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento (estado que ignora armadura, sem causar dano à Vida). Aplicação por magia de Sangue foi autorizada conceitualmente, mas entrega, custos e habilitações permanecem pendentes. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se os efeitos de ambas forem ativados, um de cada arma. Veneno usa VIDA ATUAL: a partir de 2/3 da Vida atual o alvo fica Ferido; ao atingir total de Vida atual em acúmulos, fica Incapacitado. Fica INCONSCIENTE caso esteja Envenenado com exatamente 2 de Vida atual OU ao atingir 12 acúmulos ativos, independentemente da Vida. Cada acúmulo dura 2 rodadas individualmente. Amplificar Veneno será futura Perícia PENDENTE. Graus 2/3 exigem combinação elemental (sem tornar a alquimia magia).",
  1
 ],
 [
  "criar-antidoto",
  "Criar Antídoto",
  "Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos forem atendidos; aquisição de Transfusão ainda pendente.",
  1
 ],
 [
  "transfusao",
  "Transfusão",
  "Perícia separada de Elemento Sangue, compra e requisitos próprios ainda pendentes. Pode agir em combate se conjurador e alvo estiverem em Sangramento: transfere 1 Vida própria, recuperando 1 Vida do beneficiário. Pode levar Antídoto à distância ao custo de 1 Vida e das doses usadas, sem duplicação. Não gera Vida adicional.",
  null
 ],
 [
  "transfusao-sanguinaria",
  "Transfusão Sanguinária (exclusiva Lucker de Sangue)",
  "Exclusiva de Lucker de Sangue; compra 1 XP, exige Transfusão e Perícia em Elemento Sangue. Não é concedida pela origem. Conjuração ATIVA: a cada 3 marcas disponíveis de sangue derramado de inimigos registra recuperação de 1 Vida (até o máximo), após resolver a técnica com o Narrador. Cada 1 Vida efetivamente perdida pelo inimigo gera 1 marca; Sangramento sem dano e dano à Integridade não geram marcas. Não existe reserva extraída separada. As mesmas marcas não podem ser gastas em outra magia e depois na Transfusão. Procedimento, duração, alcance e ativação ainda pendentes.",
  1
 ],
 [
  "armas-longo-alcance",
  "Perícia em Armas de Longo Alcance",
  "Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 Coragem ativa uma segunda; acerto normal exige 1 Coragem.",
  2
 ],
 [
  "disparo-violento",
  "Disparo Violento",
  "Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crítico.",
  1
 ],
 [
  "disparo-tatico",
  "Disparo Tático",
  "O autor confirmou compatibilidade com Perícia em Arremesso de Armas. Requisitos completos, custo, efeitos e ativação ainda PENDENTES. Não habilitar compra nem automatizar efeitos.",
  null
 ],
 [
  "armas-fogo",
  "Perícia em Armas de Fogo",
  "Perfurante, quando presente na arma de fogo, ativa passivamente no acerto, sem custo de ativação; Barulhenta concede +1P passivo até mesmo no crítico. Crítico ativa UMA OUTRA característica escolhida gratuitamente; acerto normal custa 1 Coragem para outras características. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.",
  3
 ],
 [
  "olhos-de-aguia",
  "Olhos de Águia",
  "1 XP. Destreza 3 + Disciplina 3 + (Perícia em Armas de Longo Alcance OU Perícia em Armas de Fogo). Aumenta em 8 m o alcance efetivo de armas à distância e armas de fogo habilitadas, sem alterar alcance de arremessos comuns ou magia. Benefício passivo, sem custo adicional de ativação.",
  1
 ],
 [
  "golpe-baixo",
  "Golpe Baixo",
  "Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, mesmo após terminar a rodada de Desvantagem. Não concede movimentação ou turno gratuito.",
  1
 ],
 [
  "furtividade",
  "Perícia em Furtividade",
  "Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.",
  1
 ],
 [
  "protecao-avancada",
  "Proteção Avançada",
  "1 XP. Requisito: Proteção 3. Com Proteção como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "astronomia-avancada",
  "Astronomia Avançada",
  "1 XP. Requisito: Astronomia 3. Com Astronomia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "alquimia-avancada",
  "Alquimia Avançada",
  "1 XP. Requisito: Alquimia 3. Com Alquimia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "engenharia-avancada",
  "Engenharia Avançada",
  "1 XP. Requisito: Engenharia 3. Com Engenharia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "erudicao-avancada",
  "Erudição Avançada",
  "1 XP. Requisito: Erudição 3. Com Erudição como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "atletismo-avancado",
  "Atletismo Avançado",
  "1 XP. Requisito: Atletismo 3. Com Atletismo como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "artesao-avancado",
  "Artesão Avançado",
  "1 XP. Requisito: Artesão 3. Com Artesão como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "maestria-martelos",
  "Especialização em Armas — Martelos, Maças e Clavas",
  "1 XP. Compra: Força 3 + Destreza 1 + Vigor 1. Especialização passiva, sem custo próprio de ativação. Ataque com martelo, maça ou clava e Perícia em Armas do peso: acerto comum ativa 1 característica gratuitamente; crítico ativa 2 características diferentes gratuitamente e pode gastar 1 Coragem para uma terceira, se a arma possuir três. A Perícia do peso é requisito da ativação, não da compra. Sem acerto, sem gratuidade; não cria características ou dano extra.",
  1
 ],
 [
  "ferreiro",
  "Ferreiro",
  "1 XP. Requisitos: Artesão 1 + Força 1 + Destreza 1 + Inteligência 1 + Artesão Avançado (que exige Artesão 3). Habilita criar armas, armaduras Médias e Pesadas de Grau 1, consertar e modificar armas e preparar minérios e metais. +1 Êxito (E) apenas em testes de Forja; demais procedimentos de fabricação pendentes.",
  1
 ],
 [
  "ferreiro-elemental",
  "Ferreiro Elemental",
  "1 XP. Requisitos: Ferreiro + Inteligência 2 + Destreza 2 + Improviso Elemental + Criar Item de Foco e Magia + Encantar com Elemento. Permite criar armas elementais e pedras elementais. Encantar com Elemento ainda não possui aquisição definida: compra bloqueada até existir a Perícia. Receitas e efeitos dos itens pendentes.",
  1
 ],
 [
  "resistencia-a-fogo",
  "Resistência a Fogo",
  "1 XP. Requisitos: Ferreiro Elemental + Perícia em Elemento Fogo + Vigor 2. Somente o próprio personagem reduz pela metade o dano de Fogo que atingiria a Vida. O +1 direto à Vida de Derreter G3 é anulado (0), sem reduzir E+P de dano à Integridade de armadura. Não é imunidade. Frações e interação com outras resistências pendentes.",
  1
 ],
 [
  "apresentacao-avancada",
  "Apresentação Avançada",
  "1 XP. Requisito: Apresentação 3. Com Apresentação como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "coleta-avancada",
  "Coleta Avançada",
  "1 XP. Requisito: Coleta 3. Com Coleta como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "medicina-avancada",
  "Medicina Avançada",
  "1 XP. Requisito Medicina 3. Em teste com Medicina como Base, acrescenta até duas fontes pertinentes (total de três), incluindo Atributo na pilha. Para tratar Sangrando, testa contra a DE defensiva do alvo com Desvantagem (−1A); sucesso remove o estado, falha mantém. Não dispensa rolagem nem concede cura automática.",
  1
 ],
 [
  "furtividade-avancada",
  "Furtividade Avançada",
  "1 XP. Requisitos: Furtividade 3 + Perícia em Furtividade. Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.",
  1
 ],
 [
  "domar-criatura-pequena",
  "Domar Criatura Pequena",
  "1 XP · Influência 2, Inteligência 1 (Apresentação não é requisito de compra). Domar por 1 Coragem e teste de Influência + Apresentação contra a DE defensiva atual do domador. A Perícia não domestica automaticamente. Uma Pequena começa com 1 Vida própria quando exposta a risco direto; com ficha independente opcional de mesmo XP total atual do jogador, pode ganhar Vida própria por Vigor e Força (base 1 + Vigor + piso(Força/2)), pagando 2x XP para esses Atributos desde G1. Uma Pequena aliada por personagem, concedendo +1A em combate e +1 ponto de Vida (integração às quatro caixas PENDENTE). Atacar a criatura cancela a domesticação; pacificação durante combate tem procedimento PENDENTE. Pode sacrificar-se contra dano letal, ou o personagem pode protegê-la, receber o golpe fatal e fazê-la fugir. Criar Item de Foco e Magia permite domar criaturas pequenas mágicas. XP da pequena sem ficha PENDENTE; companheiros contam no XP do grupo em Criar Conflito.",
  1
 ],
 [
  "domar-criatura-media","Domar Criatura Média",
  "1 XP. Influência 3, Apresentação 1, Inteligência 1 e Domar Criatura Pequena. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
  1
 ],
 [
  "domar-criatura-grande","Domar Criatura Grande",
  "1 XP. Influência 4, Apresentação 2, Inteligência 1, Domar Criatura Pequena e Domar Criatura Média. Tentativa 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
  1
 ],
 [
  "invocacao-elemental",
  "Invocação Elemental",
  "1 XP; exige Criar Item de Foco e Magia, Domar Criatura Pequena e elemento habilitado. Criar Item de Foco e Magia já habilita Psique; outros elementos exigem Perícia própria. Invoca por 1 Coragem; tamanho Pequeno/Médio/Grande limitado às Perícias Domar adquiridas; elemento precisa estar habilitado. Uma ficha de invocação pode conter várias criaturas reais; três zumbis Médios podem compartilhar uma ficha Grande sem multiplicar Vida mecânica, ações ou XP. Dados da invocação: Pequena rola um dado de Atributo e mantém até 1; Média rola dois dados, um por parte, mantém até 2; Grande rola três dados, um por parte, mantém até 3. Registrar resultados das partes separadamente, sem conceder turnos extras. O jogador escolhe os dados de Atributo e quais manter. A invocação age sozinha ou ajuda um ÚNICO personagem (o conjurador ou um aliado) em ação conjunta normal, passando TODOS os dados mantidos para esse mesmo personagem (até 3 dados na Grande). Não distribuir entre dois personagens nem multiplicar ações, dados, Pavor ou símbolos. Uma única ficha e um único turno antecipável; limites individuais e regras normais da ação conjunta aplicam-se. Em Psique, a mente é projetada e o corpo do conjurador permanece parado. Ficha da invocação com XP total do conjurador, imunidade ao elemento e dano elemental; dissipa quando conjurador fica Incapacitado ou Inconsciente. Imbuir criatura domada concede resistência elemental. Dois elementos custam +1 Coragem e exigem Improviso Elemental + Maestria Elemental adquiridos, além das habilitações de ambos os elementos; Maestria Elemental na invocação custa +1 Coragem para habilitar efeitos especiais. Necromancia Sangue/Trevas: Vida não regenera, imune a Trevas, corpo reinvocável até destruição por Fogo/Sagrado à Vida zero. Psique: fantasmas imunes a neutro e sem dano neutro, Maestria permite assombrar/possuir com Desvantagem Absoluta; Psique+Trevas assombrações, Psique+Sagrado seres angelicais/fantásticos. Psique é habilitada por Criar Item de Foco e Magia; pode projetar a mente com corpo parado. Separar tokens divide XP/Vida e mantém a DE da invocação. Dano de área é normal. Apenas um turno antecipável para uma ficha, mesmo com vários tokens: agir sozinho ou ajudar conjurador/aliado em ação conjunta. Não automatizar possessão e divisões inexatas.",
  1
 ],
 [
  "pericia-druidica",
  "Perícia Druídica",
  "Transforma-se nas formas Pequena (0 Coragem, eleva 1 Atributo), Média (1 Coragem, eleva 2) ou Grande (1 Coragem, eleva 3). Não conjura nem usa armadura enquanto transformado; a Vida temporária desaparece ao reverter. Regras e cancelamentos no verbete completo.",
  1
 ],
 [
  "sentido-elemental",
  "Sentido Elemental",
  "1 XP. Requer Inteligência 3 e Improviso Elemental. Gasta 1 Coragem para analisar um alvo e descobrir sua afinidade elemental, informada pelo Narrador. Não cria bônus de combate, dados ou DE novos.",
  1
 ],
 [
  "mudanca-elemental",
  "Mudança Elemental",
  "1 XP. Requer Transformação Elemental, Destreza 4 e Inteligência 4. Permite mudar o elemento de criatura, armadura ou ambiente a até 8 m para um elemento cuja Perícia o personagem possua. Duração E − P, válida apenas quando E − P > 0. Unidade temporal, resistência e custo de ativação pendentes; aplicar manualmente, sem conceder outras imunidades automaticamente.",
  1
 ],
 [
  "transformacao-elemental",
  "Transformação Elemental",
  "1 XP; requer Criar Item de Foco e Magia e uma Perícia Elemental. Ativação 1 Coragem. Imune ao elemento escolhido e intangível, exceto Terra (tangível, imune a Terra e efeitos aplicáveis das armas). Sem armadura; dano não protegido por imunidade ou Escudo Arcano chega diretamente à Vida. Duração elemental = E - P, exigindo E - P > 0, sem duração-base. Fonte e DE pendentes. Aura Sagrada: quando a Transformação Elemental em Sagrado se concretiza, pessoas num raio de 3 m recebem 1 Coragem até o teto de cada ficha. Sem recuperação periódica definida. Imunidade: zero dano do elemento; resistência: E/2 dano e P=0 dano só no elemento resistido. Foco pode amplificar (procedimento pendente); ambiente favorável exige 3 turnos de preparação. Resistência citada além de imunidade aguarda interpretação; Escudo Arcano é compatível.",
  1
 ]
];

function skillReq(id,s){
 if(id==="transfusao-sanguinaria"&&s.race!=="lucker_sangue")return"Transfusão Sanguinária é exclusiva de Lucker de Sangue; outras linhagens não podem comprar nem usar.";
 if(id==="maestria-armas-fogo"&&s.race!=="humano")return"Especialização em Armas de Fogo é exclusiva dos Humanos, concedida gratuitamente pela origem.";
 if(id!=="maestria-armas-fogo"&&WEAPON_MASTERY_TYPES.some(x=>x.id===id)&&!APPROVED_WEAPON_MASTERY_PURCHASE[id])return"Preço definido em 1 XP; requisitos de aquisição ainda PENDENTES. Compra bloqueada até definição dos graus pelo autor.";
 if(racialGrants(s).includes(id))return null;
 const has=x=>ownsSkill(x,s);
 if(id==="invocacao-elemental"&&(!has("criar-item-foco-magia")||!has("domar-criatura-pequena")))
  return"Requer Criar Item de Foco e Magia e Domar Criatura Pequena. O próprio foco habilita Psique; os demais elementos exigem suas Perícias.";
 if(id==="domar-criatura-media"&&!has("domar-criatura-pequena"))return"Requer a Perícia Domar Criatura Pequena antes de comprar Domar Criatura Média.";
 if(id==="domar-criatura-grande"&&(!has("domar-criatura-pequena")||!has("domar-criatura-media")))
  return"Requer Domar Criatura Pequena e Domar Criatura Média antes de comprar Domar Criatura Grande.";
 if((id==="domar-criatura-media"||id==="domar-criatura-grande")&&((s.attributes.influencia||0)<(id==="domar-criatura-media"?3:4)||(s.attributes.inteligencia||0)<1||(s.practices.apresentacao||0)<(id==="domar-criatura-media"?1:2)))return"Requer Influência "+(id==="domar-criatura-media"?3:4)+", Inteligência 1 e Apresentação "+(id==="domar-criatura-media"?1:2)+".";
 if(id==="domar-criatura-pequena"&&((s.attributes.influencia||0)<2||(s.attributes.inteligencia||0)<1))return"Requer Influência 2 e Inteligência 1.";
 if(id==="pericia-druidica" && !["criar-item-foco-magia","terra"].every(has))return"Compra única de 1 XP: exige Criar Item de Foco e Magia e Perícia Terra; não exige Domar nem Influência.";
 if(id==="transformacao-elemental" && (!has("criar-item-foco-magia")||!["vento","agua","terra","fogo","sagrado","sangue","trevas","veneno"].some(has)))return"Requer Criar Item de Foco e Magia e pelo menos uma Perícia em Elemento.";

 const disc=s.practices.armas_conjuracao||0;
 const strength=s.attributes.forca||0,dex=s.attributes.destreza||0,agi=s.attributes.agilidade||0,vig=s.attributes.vigor||0;
 const meleeSpecialty=["armas-leves","armas-medias","armas-pesadas","maestria-manejo-duplo","pugilismo"].some(has);
 const rangedSpecialty=has("armas-longo-alcance")||has("maestria-arremesso-armas");
 const intelligence=s.attributes.inteligencia||0,art=s.practices.artesao||0,alch=s.knowledges.alquimia||0,med=s.knowledges.medicina||0,stealth=s.practices.furtividade||0;
 // Requisitos explícitos das Perícias experimentais de Bardo; XP null continua bloqueando compras.
 if(id==="maestria-em-apresentacao"&&((s.practices.apresentacao||0)<4||(s.attributes.influencia||0)<4||dex<4||!has("apresentacao-avancada")||!has("pericia-em-instrumentos")))
  return"Requer Apresentação 4, Influência 4, Destreza 4, Apresentação Avançada e Perícia em Instrumentos.";
 if(id==="voz-encantadora"&&((s.attributes.influencia||0)<4||(s.practices.apresentacao||0)<4||vig<3))
  return"Requer Influência 4, Apresentação 4 e Vigor 3.";
 // Melodia Psíquica é um modo da Maestria, não outra compra.
 if(id==="melodia-psiquica")return"Integrada à Maestria em Apresentação; para usar, requer Disciplina 4, Criar Item de Foco e Magia e instrumento.";
 if(id==="montaria-epica")return"Requisitos, custo e efeito de Montaria Épica ainda PENDENTES de decisão autoral.";
  // Perícias definidas em 21/11/2026: compras por 1 XP; sem graus ou elementos gratuitos.
  const protection=s.knowledges.protecao||0,engineering=s.knowledges.engenharia||0;
  if(id==="maos-leves"&&(stealth<3||disc<3||protection<2))return"Requer Furtividade 3, Disciplina 3 e Proteção 2.";
  if(id==="pericia-armadilha"&&(art<1||disc<1||engineering<1||dex<1||intelligence<1||protection<2||stealth<1))
    return"Requer Artesão 1, Disciplina 1, Engenharia 1, Destreza 1, Inteligência 1, Proteção 2 e Furtividade 1.";
  if(id==="golpe-furtivo"&&(disc<2||stealth<2))return"Requer Disciplina 2 e Furtividade 2.";
  if(id==="bioetica"&&(alch<3||intelligence<3||dex<3||!has("sangue")||!has("criar-item-foco-magia")||
    !["vento","agua","terra","fogo","sagrado","trevas","veneno"].some(has)||!has("domar-criatura-media")))
    return"Requer Alquimia 3, Inteligência 3, Destreza 3, Perícia em Sangue, Criar Item de Foco e Magia, outra Perícia elemental (diferente de Sangue) e Domar Criatura Média.";
  if(id==="pesquisa-avancada-pocoes"&&(alch<3||!has("improviso")||art<3||dex<2))
    return"Requer Alquimia 3, Improviso Elemental, Artesão 3 e Destreza 2.";
  if(id==="corpo-fechado"&&(vig<4||!has("artista-marcial")))return"Requer Vigor 4 e Artista Marcial (Artes Marciais).";
  if(id==="invocar-esfera-espiritual"&&(!has("criar-item-foco-magia")||dex<4||intelligence<3||vig<3))
    return"Requer Criar Item de Foco e Magia, Destreza 4, Inteligência 3 e Vigor 3.";
  if(["passo-etereo","absorver-esferas","disparo-esferas-espirituais"].includes(id)&&!has("invocar-esfera-espiritual"))
    return"Requer Invocar Esfera Espiritual.";
  if(id==="dilema"&&(vig<4||!has("artista-marcial")))return"Requer Vigor 4 e Artista Marcial (Artes Marciais).";
  if(id==="impacto-psiquico"&&(!has("criar-item-foco-magia")||!has("artista-marcial")))
    return"Requer Criar Item de Foco e Magia e Artista Marcial (Artes Marciais).";

 if(id==="armas-longo-alcance"&&(disc<1||dex<2))return"Requer Disciplina 1 e Destreza 2.";
 if(id==="olhos-de-aguia"&&(dex<3||disc<3||!(has("armas-longo-alcance")||has("armas-fogo"))))return"Requer Destreza 3, Disciplina 3 e Armas de Longo Alcance OU Armas de Fogo.";
 if(id==="armas-fogo"&&(disc<2||dex<2))return"Requer Disciplina 2 e Destreza 2.";
 if(id==="disparo-fulminante"&&(disc<2||dex<2||strength<1||!rangedSpecialty))return"Requer Disciplina 2, Destreza 2, Força 1 e Armas Longo Alcance OU Arremesso.";
 if(id==="disparo-multiplo"&&(disc<2||dex<2||agi<2||!has("disparo-fulminante")||!rangedSpecialty))return"Requer Disciplina 2, Destreza 2, Agilidade 2, Disparo Fulminante e Longo Alcance OU Arremesso.";
 if(id==="disparo-violento"&&(disc<2||dex<2||!(strength>=2||(strength>=1&&(s.practices.atletismo||0)>=1))||!rangedSpecialty))return"Requer Disciplina 2, Destreza 2, Força 2 OU Força 1 + Atletismo 1, Longo Alcance OU Arremesso.";
 if(id==="disparo-tatico")return"Regras, requisitos e XP pendentes.";
 if(id==="golpe-baixo"&&(dex<2||strength<1||agi<1))return"Requer Destreza 2, Força 1 e Agilidade 1.";
 if(id==="furtividade"&&(stealth<2||dex<2||agi<1))return"Requer Furtividade 2, Destreza 2 e Agilidade 1.";
 if(id==="furtividade-avancada"&&(stealth<3||!has("furtividade")))return"Requer Furtividade 3 e Perícia em Furtividade.";
  const advancedSource=ADVANCED_SOURCE_DEFS.find(row=>row.id===id);
  if(advancedSource&&(s[SOURCE_PROPS[advancedSource.group]][advancedSource.key]||0)<3)
   return"Requer "+advancedSource.label+" 3.";
 if(id==="maestria-punhos"&&(strength<1||agi<1||dex<1||vig<1))return"Requer Força 1, Agilidade 1, Destreza 1 e Vigor 1 para comprar. Pugilismo é exigido somente para ativar os efeitos da Especialização.";
 if(id==="maestria-martelos"&&(strength<3||dex<1||vig<1))return"Requer Força 3, Destreza 1 e Vigor 1 para comprar. A Perícia de Armas conforme peso da arma será exigida somente ao ativar o efeito.";
  if(id==="maestria-adagas"&&(agi<2||dex<2))return"Requer Agilidade 2 e Destreza 2 para comprar. A Perícia de Armas do peso é exigida só para ativar.";
  if(id==="maestria-machados"&&(strength<2||dex<1))return"Requer Força 2 e Destreza 1 para comprar. A Perícia de Armas do peso é exigida só para ativar.";
  if(id==="maestria-cajados"&&dex<2)return"Requer Destreza 2 para comprar. A Perícia de Armas do peso é exigida só para ativar.";
  if(id==="maestria-hastes"&&(strength<2||agi<1||dex<1))return"Requer Força 2, Agilidade 1 e Destreza 1. Perícia em Armas do peso exigida somente para ativar a Especialização.";
  if(id==="maestria-espadas"&&(strength<2||dex<2))return"Requer Força 2 e Destreza 2. Perícia em Armas do peso exigida somente para ativar a Especialização.";
 if(id==="ferreiro"&&(art<3||strength<1||dex<1||intelligence<1||!has("artesao-avancado")))return"Requer Artesão 1, Força 1, Destreza 1, Inteligência 1 e Artesão Avançado (que exige Artesão 3).";
 if(id==="ferreiro-elemental"&&(!has("ferreiro")||intelligence<2||dex<2||!has("improviso")||!has("criar-item-foco-magia")))return"Requer Ferreiro, Inteligência 2, Destreza 2, Improviso Elemental e Criar Item de Foco e Magia.";
 if(id==="ferreiro-elemental"&&!has("encantar-com-elemento"))return"Requer comprar Encantar com Elemento antes de Ferreiro Elemental.";
 if(id==="resistencia-a-fogo"&&(!has("ferreiro-elemental")||!has("fogo")||vig<2))return"Requer Ferreiro Elemental, Perícia em Elemento Fogo e Vigor 2."; 
 if(id==="encantar-com-elemento"&&(!has("criar-item-foco-magia")||!["vento","agua","terra","fogo","sagrado","sangue","trevas","veneno"].some(has)))return"Requer Criar Item de Foco e Magia e pelo menos uma Perícia Elemental adquirida (Ar, Água, Terra, Fogo, Sagrado, Sangue, Trevas ou Veneno).";
 if(id==="criar-veneno"&&(art<1||intelligence<2||alch<2||med<2))return"Requer Artesão 1, Inteligência 2, Alquimia 2 e Medicina 2.";
 // IDs antigos das Perícias renomeadas preservados para compatibilidade de fichas salvas.
 if(id==="armas-leves"&&disc<1)return"Requer Disciplina 1.";
 if(id==="armas-medias"&&(disc<1||strength<1))return"Requer Disciplina 1 e Força 1.";
 if(id==="armas-pesadas"&&(disc<2||strength<2))return"Requer Disciplina 2 e Força 2.";
 if(id==="disciplina-avancada"&&disc<3)return"Requer Disciplina 3.";
 if(id==="concentracao-refinada"&&disc<2)return"Requer Disciplina 2.";
 if(id==="criar-item-foco-magia"&&(disc<1||(s.attributes.inteligencia||0)<1||art<1))return"Requer Disciplina 1, Inteligência 1 e Artesão 1.";
 if(["vento","agua","terra","fogo"].includes(id)&&(disc<1||(s.attributes.inteligencia||0)<1))return"Requer Disciplina 1 e Inteligência 1. Criar Foco é opcional.";
 if(id==="sagrado"&&(disc<2||(s.attributes.inteligencia||0)<2))return"Requer Disciplina 2 e Inteligência 2. Criar Foco é opcional.";
 if(id==="escudo-arcano"&&((s.attributes.inteligencia||0)<2||vig<1||!has("criar-item-foco-magia")))return"Requer Inteligência 2, Vigor 1 e Criar Item de Foco e Magia.";
 if(id==="conjuracao-equilibrada"&&(disc<2||(s.attributes.inteligencia||0)<2||dex<2||!has("criar-item-foco-magia")))return"Requer Disciplina 2, Criar Item de Foco e Magia, Inteligência 2 e Destreza 2.";
 if(id==="golpe-fulminante"&&(disc<2||strength<2||!meleeSpecialty))return"Requer Disciplina 2, Força 2 e especialização corpo a corpo (Armas Leves/Médias/Pesadas, Manejo Duplo ou Pugilismo). Perícia em Arremesso não habilita este golpe.";
 if(id==="espalhar-golpe"&&(disc<2||dex<1||agi<1||!has("golpe-fulminante")||!meleeSpecialty))return"Requer Disciplina 2, Destreza 1, Agilidade 1, Golpe Fulminante e especialização corpo a corpo.";
 if(id==="pugilismo"&&(disc<1||strength<2||dex<1))return"Requer Disciplina 1, Força 2 e Destreza 1.";
 if(id==="artista-marcial"&&(disc<2||dex<2||(s.practices.atletismo||0)<1||!has("pugilismo")))return"Requer Disciplina 2, Destreza 2, Atletismo 1 e Pugilismo.";
 if(id==="cancelar-magia"&&(!has("criar-item-foco-magia")||!has("improviso")||intelligence<4||agi<4||dex<4))return"Requer Criar Item de Foco e Magia, Improviso Elemental, Inteligência 4, Agilidade 4 e Destreza 4.";
  if(id==="mudanca-elemental"&&(!has("transformacao-elemental")||intelligence<4||dex<4))return"Requer Transformação Elemental, Inteligência 4 e Destreza 4.";
  if(id==="desencantar"&&!has("cancelar-magia"))return"Requer Cancelar Magia.";
  if(id==="espelho-magico"&&!has("cancelar-magia"))return"Requer Cancelar Magia.";
  if(id==="sacrificio-heroico"&&vig<4)return"Requer Vigor 4.";
  if(id==="escudo-refletor"&&!has("maestria-escudos"))return"Requer Maestria em Escudos.";
  if(id==="sentido-elemental"&&(intelligence<3||!has("improviso")))return"Requer Inteligência 3 e Improviso Elemental.";
  if(id==="maestria-escudos"&&(dex<2||vig<2))return"Requer Destreza 2 e Vigor 2.";
 if(id==="escudo-bumerangue"&&(dex<2||strength<3||!has("maestria-arremesso-armas")||!has("maestria-escudos")))return"Requer Destreza 2, Força 3, Perícia em Arremesso de Armas e Maestria em Escudos.";
 if(id==="maestria-arremesso-armas"&&(!["armas-leves","armas-medias","armas-pesadas"].some(has)||strength<2||dex<2||agi<1))return"Requer Armas Leves OU Médias OU Pesadas, Força 2, Destreza 2 e Agilidade 1.";
 if(["recuperacao-vigorosa","instinto-sobrevivencia"].includes(id)&&vig<3)return"Requer Vigor 3; custo XP pendente.";
 if(id==="recuperacao-movimento"&&(vig<6||!has("recuperacao-vigorosa")))return"Requer Recuperação Vigorosa e Vigor 6; custo XP pendente.";
 if(id==="manejo-perfeito"&&(!has("disciplina-avancada")||disc<3||dex<2))return"Requer Disciplina Avançada (Disciplina 3) adquirida e Destreza 2.";
 if(id==="maestria-manejo-duplo"&&(strength<2||dex<2||agi<1||disc<3||!has("disciplina-avancada")||!["armas-leves","armas-medias","armas-pesadas","maestria-arremesso-armas","armas-fogo","armas-longo-alcance"].some(has)))return"Requer Força 2, Destreza 2, Agilidade 1, Disciplina Avançada e especialização de armas.";
 
 if(id==="montar"&&(s.attributes.influencia||0)<2)return"Requer Influência grau 2.";
 if(id==="pericia-montaria"&&((s.attributes.influencia||0)<1||dex<2))return"Requer Influência 1 e Destreza 2.";
 if(id==="pericia-montaria")return"Custo XP de Perícia em Montaria PENDENTE: compra indisponível até a definição autoral.";
 if(id==="provocacao-sofisticada"&&(s.attributes.influencia||0)<2)return"Requer Influência grau 2.";
 if(id==="improviso"&&(disc<1||(s.attributes.inteligencia||0)<1||dex<1))return"Requer Disciplina 1, Inteligência 1 e Destreza 1. Criar Foco não é requisito.";
 if(id==="mestre"&&(disc<3||(s.attributes.inteligencia||0)<3||dex<3||!has("criar-item-foco-magia")||!has("improviso")||!["vento","sangue","agua","fogo","terra","veneno","sagrado","trevas"].some(has)))return"Requer Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e uma Perícia elemental.";
 if(["sangue","trevas"].includes(id)&&(disc<2||(s.attributes.inteligencia||0)<2))return"Requer Disciplina 2 e Inteligência 2. Criar Foco é opcional.";
 if(id==="veneno"&&(disc<2||(s.attributes.inteligencia||0)<2||(s.knowledges.alquimia||0)<2||(s.knowledges.medicina||0)<2))return"Requer Disciplina 2, Inteligência 2, Alquimia 2 e Medicina 2.";
 if(id==="criar-antidoto"&&((s.practices.artesao||0)<1||(s.attributes.inteligencia||0)<2||(s.knowledges.alquimia||0)<2||(s.knowledges.medicina||0)<2||!has("criar-veneno")))return"Requer Artesão 1, Inteligência 2, Alquimia 2, Medicina 2 e Criar Veneno.";
 if(id==="transfusao-sanguinaria"&&(!has("transfusao")||!has("sangue")))
  return"Requer Transfusão e Perícia em Elemento Sangue. Transfusão original ainda tem aquisição pendente.";
 if(id==="transfusao")return"Compra ainda pendente de custo ou regras de aquisição.";
 return null;
}

export const PLAYER_SKILLS=Object.freeze(SKILLS.map(([id,name,detail,cost])=>Object.freeze({id,name,detail,cost})));
export function playerSkillRequirement(id,character){return skillReq(id,character);}

// Não ofertar efeitos internos de Bardo e IDs históricos como Perícias individuais.
 // Espelho literal das exclusões do criador (app.js); a CI verifica sincronização.
const BARD_INTERNAL_EFFECTS=Object.freeze(["dueto-improvisado","contratempo","solo-provocador","cancoes-sustentadas","ritmo-de-batalha","inspiracao","ressonancia-arcana","acorde-de-protecao","acorde-triunfal","compasso-adiantado","ritmo-acelerado","harmonia-musical","piada-infame","elevacao-harmonica","acao-em-conjunto-musical","presenca-de-palco","melodia-psiquica"]);
const HIDDEN_CATALOG_SKILLS=new Set(["combate","armas",...BARD_INTERNAL_EFFECTS]);
const RETIRED_PROTOTYPES=new Set(["marciais","combinacao","peritoconj"]);
export const HIDDEN_PLAYER_SKILL_IDS=Object.freeze([...HIDDEN_CATALOG_SKILLS]);
const hiddenPlayerSet=new Set(HIDDEN_PLAYER_SKILL_IDS);
export const isVisiblePlayerSkill=id=>PLAYER_SKILLS.some(row=>row.id===id)&&!hiddenPlayerSet.has(id);
