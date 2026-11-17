/* Codex RPG — criador e ficha unificados. SRD v0.47 (Perícia Druídica 2 XP única; Saúde com Força, quatro estados, modificadores e Coragem nas rolagens); d4 de v0.46 (1E, 1A, 1P, vazio); base v0.44: Conjuração Refinada, armaduras G1 −3 e pedras especiais 3× comuns; 18 XP iniciais experimentais (SRD v0.58). */
(function(){
"use strict";
const NPC_MODE=new URLSearchParams(location.search).get("npc")==="1";
const SAVE_KEY=NPC_MODE?"codex-html-ficha-npc-dna-v1":"codex-html-ficha-prototipo-v1",OLD_SAVE_KEY="codex-rpg-ficha-nivel1-v1",THEME_KEY="codex-html-ficha-tema-v1",WIZARD_KEY=NPC_MODE?"codex-html-ficha-npc-wizard-v1":"codex-html-ficha-wizard-v1";
const CONFLICT_NPC_INBOX="codex-rpg-conflito-humanoide-inbox-v1";
const PLAYER_SHEETS_INDEX="codex-rpg-jogadores-index-v1",PLAYER_SHEET_PREFIX="codex-rpg-jogador-ficha-v1:";
const A=[["forca","Força"],["agilidade","Agilidade"],["destreza","Destreza"],["inteligencia","Inteligência"],["influencia","Influência"],["vigor","Vigor"]];
const K=[["protecao","Proteção"],["astronomia","Astronomia"],["medicina","Medicina"],["alquimia","Alquimia"],["engenharia","Engenharia"],["erudicao","Erudição"]];
const P=[["armas_conjuracao","Disciplina"],["atletismo","Atletismo"],["furtividade","Furtividade"],["artesao","Artesão"],["apresentacao","Apresentação"],["coleta","Coleta"]];
const GROUPS={attr:A,know:K,practice:P},SOURCE_PROPS={attr:"attributes",know:"knowledges",practice:"practices"};
const DICE_ATTR=[[4],[6],[6,6],[6,6,6],[6,6,10],[6,10,10],[10,10,10]];
const DICE_FORM=[[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
const FACES={
 4:[[1,0,0],[0,1,0],[0,0,1],[0,0,0]],
 6:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0]],
 10:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,1,0]],
 12:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[1,2,1],[0,0,2]],
 20:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,1,0],[2,1,0],[2,1,1],[2,2,1],[2,2,1],[0,0,2],[2,2,0],[3,2,0],[4,2,0],[0,0,4],[4,2,0],[5,2,1],[6,2,1],[8,0,0]]
};
// SRD v0.56: XP acumulado por Grau G0–G6 (avanço = diferença).
const AT_COST=[0,1,3,6,9,18,32];
const AT_DISCOUNT=[0,0,2,4,7,12,24];
const AT_ELEVATED=[0,2,4,8,16,32,64];
const TRAIN_COST=[0,2,4,8,16,32,64];
const TRAIN_DISCOUNT=[0,1,3,6,9,18,32];
const TRAIN_ELEVATED=[0,3,6,12,24,48,96];
const RACES={
 humano:["Humano","Perseverança Humana: rerrolar qualquer teste uma vez por descanso longo.","Sem custos raciais adicionais."],
 lucker_sangue:["Lucker de Sangue","Perícia em Elemento Sangue inicial gratuita.","Vigor/Agilidade: desconto; Influência/Apresentação: faixa elevada."],
 lucker_puro:["Lucker Puro","Criar Item de Foco e Magia + um elemento (Sangue, Trevas ou Veneno) gratuitos.","Inteligência/Destreza: desconto; Força/Atletismo: faixa elevada."],
 runa_espinhos:["Runa Espinhos","Pugilismo, Criar Item de Foco e Magia e dois elementos distintos gratuitos.","Vigor/Força: desconto; Agilidade/Destreza: faixa elevada."]
};
const PURE_ELEMENTS=[["sangue","Sangue"],["trevas","Trevas"],["veneno","Veneno"]];
const RUNE_ELEMENTS=[["vento","Ar"],["agua","Água"],["terra","Terra"],["fogo","Fogo"]];
function racialGrants(s=state){
 if(s.race==="lucker_sangue")return ["sangue"];
 if(s.race==="lucker_puro")return ["criar-item-foco-magia",...(PURE_ELEMENTS.some(([id])=>id===s.pureElement)?[s.pureElement]:[])];
 if(s.race==="runa_espinhos")return ["pugilismo","criar-item-foco-magia",...new Set((s.runeElements||[]).filter(id=>RUNE_ELEMENTS.some(([k])=>k===id)))].slice(0,4);
 return [];
}
function ownsSkill(id,s=state){return !!s.skills?.includes(id)||racialGrants(s).includes(id);}
function allOwnedSkills(s=state){return [...new Set([...(s.skills||[]),...racialGrants(s)])];}
function racialCostTable(group,key,s=state){
 const normal=group==="attr"?AT_COST:TRAIN_COST;
 const discount=group==="attr"?AT_DISCOUNT:TRAIN_DISCOUNT;
 const elevated=group==="attr"?AT_ELEVATED:TRAIN_ELEVATED;
 if(s.race==="lucker_sangue"){
  if(group==="attr"&&["vigor","agilidade"].includes(key))return discount;
  if((group==="attr"&&key==="influencia")||(group==="practice"&&key==="apresentacao"))return elevated;
 }else if(s.race==="lucker_puro"){
  if(group==="attr"&&["inteligencia","destreza"].includes(key))return discount;
  if((group==="attr"&&key==="forca")||(group==="practice"&&key==="atletismo"))return elevated;
 }else if(s.race==="runa_espinhos"&&group==="attr"){
  if(["vigor","forca"].includes(key))return discount;
  if(["agilidade","destreza"].includes(key))return elevated;
 }
 return normal;
}
// Sinalização exclusivamente derivada da tabela de custos, sem efeitos mecânicos.
function racialXpBand(group,key,s=state){
 const table=racialCostTable(group,key,s);
 if(table===(group==="attr"?AT_DISCOUNT:TRAIN_DISCOUNT))return "discount";
 if(table===(group==="attr"?AT_ELEVATED:TRAIN_ELEVATED))return "elevated";
 return "normal";
}
function racialXpLabel(band){
 return band==="discount"?"XP reduzido":band==="elevated"?"XP aumentado":"XP normal";
}
function racialXpMarker(group,key,s=state){
 const band=racialXpBand(group,key,s);
 return band==="normal"?"":'<span class="fp-racial-xp-marker is-'+band+'" title="'+racialXpLabel(band)+' pela origem">'+
  (band==="discount"?"↓ XP reduzido":"↑ XP aumentado")+'</span>';
}
function racialXpLegend(){
 return '<div class="fp-racial-xp-legend" aria-label="Custos de XP da origem">'+
  '<span class="fp-racial-xp-marker is-discount">↓ XP reduzido</span>'+
  '<span class="fp-racial-xp-marker is-elevated">↑ XP aumentado</span>'+
  '<small>Os contornos indicam custos raciais, não Graus extras.</small></div>';
}
// SRD v0.61: atributo favorecido da origem começa no Grau 1 (custo zero).
// Atribuições raciais automáticas são distinguidas dos graus comprados manualmente.
function racialStartingAttributes(race){
 if(race==="lucker_sangue")return ["vigor","agilidade"];
 if(race==="lucker_puro")return ["inteligencia","destreza"];
 if(race==="runa_espinhos")return ["vigor","forca"];
 return [];
}
function applyRacialStartingAttributes(s,preserve=[]){
 const favored=racialStartingAttributes(s.race);
 const previous=Array.isArray(s.racialInitialAttributes)?s.racialInitialAttributes:[];
 const keep=new Set(preserve);
 // Remover apenas concessões registradas de uma raça anterior. Graus elevados,
 // escolhas explícitas de início e compras manuais continuam na ficha.
 for(const key of previous){
  if(!favored.includes(key)&&(s.attributes[key]||0)===1&&!keep.has(key))s.attributes[key]=0;
 }
 const granted=previous.filter(key=>favored.includes(key)&&(s.attributes[key]||0)>=1);
 for(const key of favored){
  if((s.attributes[key]||0)<1){s.attributes[key]=1;granted.push(key);}
 }
 s.racialInitialAttributes=[...new Set(granted)];
 return s;
}
function isRacialGradeOne(group,key,s=state){
 return group==="attr"&&racialStartingAttributes(s.race).includes(key);
}
function raceChoicesComplete(s=state){
 return s.race==="lucker_puro"?PURE_ELEMENTS.some(([id])=>id===s.pureElement):
 s.race==="runa_espinhos"?(s.runeElements||[]).length===2&&s.runeElements[0]!==s.runeElements[1]&&
  s.runeElements.every(id=>RUNE_ELEMENTS.some(([k])=>k===id)):true;
}
function raceCaution(s=state){return "";} // Nenhum multiplicador racial pendente na v0.56.

const CREATE_BUDGET={attr:18,training:18,skills:18,total:18}; // EXPERIMENTAL: total 18 XP; DEFINIDO: após um Atributo e um Conhecimento/Prática, saldo livre entre categorias.
const XP_LEVEL_REFERENCE=[0,18,28,37,46,56,66,77,88,100,112,125,138,152,166,181,196,212,228,245,260]; // EXPERIMENTAL: 18 XP no nível 1; níveis 2–20 preservados, nível manual.
const MAX_EARNED_XP=XP_LEVEL_REFERENCE[20]-CREATE_BUDGET.total; // 242 XP novos concedíveis (260 totais − 18 iniciais).
const SKILLS=[
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
  "Requer Influência grau 2.",
  2
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
  "1 XP · Disciplina 1 + Inteligência 1 + Artesão 1. SUBSTITUI Aprendiz de Conjurador e Magia Única. Ativa UM efeito Psíquico no acerto por 1 PP/1 Coragem; foco por Artesão recarrega em N rodadas no Grau N. Desde Disciplina 2, pode criar fora de combate magias G2/G3 por 1 PP/1 Coragem e memorizar em slots; Criar Magia reduz 1 ponto do peso mental de magia criada e memorizada, mesmo com foco (G2=1, G3=2, G4=3); peso mínimo de G1 pendente. Capacidade mental é 1 ponto por Grau de Disciplina, não por dado. Pesos nominais G1=1, G2=2, G3=3, G4=4. Conjuração rápida da magia preparada conforme regras ainda pendentes.",
  1
 ],
 [
  "escudo-arcano",
  "Escudo Arcano",
  "Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 PP ou 1 Coragem. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 PP/1 Coragem amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa. NOVA regra v0.54: Escudo Arcano Psíquico ATIVO anula Perfurante de armas físicas, sem anular acerto ou dano; Perfurar da magia de Água não é anulado. Escudo pessoal ou circular protege de todas as direções; parede linear apenas segundo sua geometria. Levantar Escudo físico é ação com rolagem de Disciplina, E+P válidos mantidos para Integridade extra; só defende o primeiro ataque frontal e abaixa após resolvê-lo, mesmo que erre; excedente vai para armadura e depois Vida. A aplicação automática do bloqueio físico ainda não foi implementada.",
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
  "Requisitos Disciplina 1, Inteligência 1, Destreza 1 e Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.",
  1
 ],
 [
  "mestre",
  "Maestria Elemental",
  "Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. Custo 1 PP ou 1 Coragem para mesclar dois elementos e ativar simultaneamente as propriedades especiais dos dois, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.",
  1
 ],
 [
  "fogo",
  "Perícia em Elemento Fogo",
  "1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Permite conjurar magias Leves de Fogo. Em ataque acertado, mesmo sem crítico, 1 PP/1 Coragem ativa UM efeito especial. G1: disparo a distância causa dano à armadura, sem queimadura direta à Vida; iluminar e conduzir chamas com fonte/faísca disponível (lamparina, isqueiro, foco pequeno encantado ou luvas de faísca); não invoca fogo do nada. G2: área 4×4, cone/linha/círculo, dano à Vida e armadura; SEM FOCO invocar fogo custa 1 Coragem ADICIONAL à ativação normal: 1 PP + 1 Coragem ou 3 Coragens. G3: conjurar no final do turno dos aliados, área 8×8, círculo/cone/linha. Pode amplificar pequena faísca em incêndios; dano persistente, unidade das áreas e alcance pendentes. Não automatizado.",
  1
 ],
 [
  "agua",
  "Perícia em Elemento Água",
  "1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Habilita magias Leves de Água. Em ataque acertado, mesmo sem crítico, 1 PP/1 Coragem ativa UM efeito especial. G1: Congelar por 1 rodada sem dano no estado Leve; extrair água do ar, mover, molhar e limpar. G2: Perfurar no CRÍTICO ou por ativação paga; dano à Vida e à armadura. G3: conjurar no final do turno dos aliados; Empurrar, Perfurar, Congelar e dano à Vida e à armadura, mantendo propriedades menores pertinentes. Resolução e efeitos exatos não automatizados.",
  1
 ],
 [
  "vento",
  "Perícia em Elemento Ar",
  "1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Habilita magias Leves de Ar. No acerto, mesmo sem crítico, gaste 1 PP ou 1 Coragem para escolher UM efeito especial. G1: autoempurrão +4 m de deslocamento; puxar/empurrar objetos; linha, círculo, cone, X. G2: sufocar com dano à Vida ou armadura, puxar, empurrar + derrubar com dano, deslocamento até +8 m. G3: conjurar no final do turno dos aliados, área grande e múltiplos alvos, tornado/rajada, possíveis danos por queda (16 m ainda sem interpretação geométrica). Formas: linha, círculo, cone, X. TAMBÉM pode recuperar Fôlego (Grau, quantidade e gatilho pendentes). Efeitos não automatizados.",
  1
 ],
 [
  "terra",
  "Perícia em Elemento Terra",
  "1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Conjuração elemental Leve de Terra. Ao acertar ataque, inclusive não crítico, 1 PP ou 1 Coragem ativa UM efeito escolhido. G1: Desvantagem 2 RODADAS (terra nos olhos), emaranhar pés, derrubar, lançar pequenas pedras, criar plataformas de deslocamento, sentido sísmico 18×18 m para detectar furtivos e armadilhas. G2: enredar e imobilizar, Desvantagem 2 TURNOS, espinhos danificam armadura/proteção, sentido sísmico 32×32. G3: conjurar ao final do turno dos aliados, área 5×5, linha/cone/círculo A PARTIR DO ALVO, dano, empurrão e derrubada, sentido sísmico 64×64. Unidades não informadas e efeitos adicionais não automatizados.",
  1
 ],
 [
  "sagrado",
  "Perícia em Elemento Sagrado",
  "Requisitos Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia; magias Leves. Ativação especial 1 PP ou 1 Coragem. Suporte em si ou aliado próximo exige alcançar a DE do beneficiário. Cada E excedente recupera 1 Coragem, cada P não anulado cancela um E destinado a recuperação (não reaproveitado como dano). Em área, todos os aliados beneficiados recuperam igualmente; E excedentes podem causar dano aos inimigos cujas DEs foram alcançadas. Conjurador escolhe enfoque em dano, suporte ou combinação. Aliados não sofrem dano sagrado de suporte. G2/G3 por combinação elemental.",
  2
 ],
 [
  "veneno",
  "Perícia em Elemento Veneno",
  "Conjuração distinta da alquimia Criar Veneno. No acerto em alvo com Sangramento, gasta 1 PP ou 1 Coragem para aplicar 1 acúmulo por 2 rodadas sem renovar os anteriores. A partir de 2/3 da Vida atual, Ferido; se acúmulos alcançam Vida atual, Incapacitado. Se estiver Envenenado com exatamente 2 de Vida atual OU atingir 12 acúmulos ativos, Inconsciente. Não causa dano direto à Vida; criaturas biologicamente incompatíveis podem ser imunes. Graus 2 e 3 exigem combinação elemental.",
  2
 ],
 [
  "sangue",
  "Perícia em Elemento Sangue",
  "Rework v0.71: Sangue é amplificação. Uma vez por turno pode substituir Coragem para ampliar uma magia OU manter mais um dado OU elevar um dado; fonte e quantidade do custo ainda pendentes, sem automação. Sangue puro: dano normal contra proteções, armadura primeiro. Toda marca de sangue derramado ou extraído empregada numa conjuração é consumida, inclusive em ataque convencional, não podendo servir depois para Transfusão. Extração: Hemomante e alvo Sangrando, perde 1 Vida própria para causar 1 dano direto à Vida do alvo e obter sangue extraído (não serve para Transfusão Sanguinária). Coágulos e hemorragia interna são manifestações em revisão. Outros efeitos de combate exigem sangue derramado no ambiente, custo por efeito pendente.",
  2
 ],
 [
  "trevas",
  "Perícia em Elemento Trevas",
  "Requisitos Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia; magias Leves. Ativação especial 1 PP ou 1 Coragem após acerto mesmo sem crítico. Escurecimento, Pavor e maldições. Técnica especializada usa uma única rolagem contra um ou dois alvos e soma +2P ANTES da DE, contando para acerto, dano e risco. Pavor não anulado é dividido entre os dois alvos de modo equilibrado ou focado em um, sem duplicar; um só alvo é permitido. G2/G3 exigem mescla.",
  2
 ],
 [
  "armas-leves",
  "Perícia em Armas Leves",
  "Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 PP/1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.",
  2
 ],
 [
  "armas-medias",
  "Perícia em Armas Médias",
  "Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 PP/1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.",
  2
 ],
 [
  "armas-pesadas",
  "Perícia em Armas Pesadas",
  "Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 PP/1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.",
  2
 ],
 [
  "disciplina-avancada",
  "Disciplina Avançada",
  "Disciplina 2; ao realizar uma ação com Disciplina, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.",
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
  "Disciplina Avançada + Destreza 2. Arma certa: Vantagem Absoluta; se já possui, Golpe Certo. XP e Golpe Certo PENDENTES.",
  null
 ],
 [
  "golpe-fulminante",
  "Golpe Fulminante",
  "Após acerto, pagar a ativação transforma cada Pavor mantido não anulado em 1 dano. Pavor continua gerando risco e Pressão. Especializações: Armas Leves, Médias, Pesadas, Manejo Duplo ou Pugilismo. Arremesso não satisfaz esse requisito. Crítico NÃO isenta o custo da técnica.",
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
  "Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 PP/1 Coragem para mudar peso do soco. Pesos disponíveis PENDENTES.",
  1
 ],
 [
  "artista-marcial",
  "Artista Marcial",
  "Disciplina 2 + Pugilismo + Destreza 2. 1 PP/1 Coragem por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.",
  1
 ],
 [
  "maestria-arremesso-armas",
  "Perícia em Arremesso de Armas",
  "Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 PP ou 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.",
  1
 ],
 [
  "disparo-fulminante",
  "Disparo Fulminante",
  "Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados.",
  1
 ],
 [
  "disparo-multiplo",
  "Disparo Múltiplo",
  "A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 PP ou 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.",
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
  "Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 PP ou 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 PP ou 1 Coragem. Efeitos próprios, como perfurar, sangrar ou envenenar, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.",
  1
 ],
 [
  "instinto-sobrevivencia",
  "Instinto de Sobrevivência",
  "Vigor 3; antigo efeito de remover −1A em Incapacitado está incompatível com −1E/+1P. Novo efeito PENDENTE, sem aplicar bônus automático.",
  null
 ],
 [
  "arma-certa",
  "Maestria Arma Certa",
  "+1E com peso favorável. Custo de XP pendente.",
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
  "Transfusão Sanguinária (protótipo)",
  "Compra 1 XP; exige Transfusão e Perícia em Elemento Sangue. Conjuração ATIVA: cada 1 ponto de dano direto à Vida gera 1 marca de sangue (v0.72); a cada 3 marcas elegíveis de dano direto à Vida representadas por sangue derramado, pode registrar recuperação de 1 Vida até o máximo. Sangue extraído magicamente, inclusive combinado com Trevas, TAMBÉM serve para esta técnica, sem dupla contagem. Procedimento, duração, alcance e custo de conjuração ainda pendentes; na ficha, o registro é manual após confirmação do Narrador.",
  1
 ],
 [
  "armas-longo-alcance",
  "Perícia em Armas de Longo Alcance",
  "Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 PP ou 1 Coragem ativa uma segunda; acerto normal exige 1 PP ou 1 Coragem.",
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
  "Perfurante, quando presente na arma de fogo, ativa passivamente no acerto, sem PP/Coragem; Barulhenta concede +1P passivo até mesmo no crítico. Crítico ativa UMA OUTRA característica escolhida gratuitamente; acerto normal custa 1 PP ou 1 Coragem para outras características. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 PP OU 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.",
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
  "furtividade-avancada",
  "Furtividade Avançada",
  "Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.",
  1
 ],
 [
  "domar-criatura-pequena",
  "Domar Criatura Pequena",
  "1 XP · Influência 2, Apresentação 1, Inteligência 1. Domar por 1 PP ou 1 Coragem e teste de Influência + Apresentação contra a DE defensiva atual do domador. A Perícia não domestica automaticamente. Uma Pequena começa com 1 Vida própria quando exposta a risco direto; com ficha independente opcional de mesmo XP total atual do jogador, pode ganhar Vida própria por Vigor e Força (base 1 + Vigor + piso(Força/2)), pagando 2x XP para esses Atributos desde G1. Uma Pequena aliada por personagem, concedendo +1A em combate e +1 ponto de Vida (integração às quatro caixas PENDENTE). Atacar a criatura cancela a domesticação; pacificação durante combate tem procedimento PENDENTE. Pode sacrificar-se contra dano letal, ou o personagem pode protegê-la, receber o golpe fatal e fazê-la fugir. Criar Item de Foco e Magia permite domar criaturas pequenas mágicas. XP da pequena sem ficha PENDENTE; companheiros contam no XP do grupo em Criar Conflito.",
  1
 ],
 [
  "domar-criatura-media","Domar Criatura Média",
  "1 XP. Influência 3, Apresentação 1, Inteligência 1 e Domar Criatura Pequena. Tentativa 1 PP ou 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
  1
 ],
 [
  "domar-criatura-grande","Domar Criatura Grande",
  "1 XP. Influência 4, Apresentação 1, Inteligência 1, Domar Criatura Pequena e Domar Criatura Média. Tentativa 1 PP ou 1 Coragem; teste Influência + Apresentação contra DE defensiva do domador. Ficha independente; +1 Vida ao domador.",
  1
 ],
 [
  "invocacao-elemental",
  "Invocação Elemental",
  "1 XP; exige Criar Item de Foco e Magia, Domar Criatura Pequena e elemento habilitado. Criar Item de Foco e Magia já habilita Psique; outros elementos exigem Perícia própria. Invoca por 1 PP ou 1 Coragem; tamanho Pequeno/Médio/Grande limitado às Perícias Domar adquiridas; elemento precisa estar habilitado. Uma ficha de invocação pode conter várias criaturas reais; três zumbis Médios podem compartilhar uma ficha Grande sem multiplicar Vida mecânica, ações ou XP. Dados da invocação: Pequena rola um dado de Atributo e mantém até 1; Média rola dois dados, um por parte, mantém até 2; Grande rola três dados, um por parte, mantém até 3. Registrar resultados das partes separadamente, sem conceder turnos extras. O jogador escolhe os dados de Atributo e quais manter. A invocação age sozinha ou ajuda um ÚNICO personagem (o conjurador ou um aliado) em ação conjunta normal, passando TODOS os dados mantidos para esse mesmo personagem (até 3 dados na Grande). Não distribuir entre dois personagens nem multiplicar ações, dados, Pavor ou símbolos. Uma única ficha e um único turno antecipável; limites individuais e regras normais da ação conjunta aplicam-se. Em Psique, a mente é projetada e o corpo do conjurador permanece parado. Ficha da invocação com XP total do conjurador, imunidade ao elemento e dano elemental; dissipa quando conjurador fica Incapacitado ou Inconsciente. Imbuir criatura domada concede resistência elemental. Dois elementos custam +1 Coragem e exigem Improviso Elemental + Maestria Elemental adquiridos, além das habilitações de ambos os elementos; Maestria Elemental na invocação custa +1 PP ou +1 Coragem para habilitar efeitos especiais. Necromancia Sangue/Trevas: Vida não regenera, imune a Trevas, corpo reinvocável até destruição por Fogo/Sagrado à Vida zero. Psique: fantasmas imunes a neutro e sem dano neutro, Maestria permite assombrar/possuir com Desvantagem Absoluta; Psique+Trevas assombrações, Psique+Sagrado seres angelicais/fantásticos. Psique é habilitada por Criar Item de Foco e Magia; pode projetar a mente com corpo parado. Separar tokens divide XP/Vida e mantém a DE da invocação. Dano de área é normal. Apenas um turno antecipável para uma ficha, mesmo com vários tokens: agir sozinho ou ajudar conjurador/aliado em ação conjunta. Não automatizar possessão e divisões inexatas.",
  1
 ],
 [
  "pericia-druidica",
  "Perícia Druídica",
  "Compra única de 2 XP para acesso aos três Graus sem custo adicional por Grau. Requisitos cumulativos: Influência 2, Criar Item de Foco e Magia, Domar Criatura Pequena, Domar Criatura Média, Domar Criatura Grande e Perícia em Elemento Terra. Memoriza sem limite formas de criaturas domadas. G1 pequena: gratuita, 19 XP na ficha animal (distribuição ainda pendente), Vantagem Absoluta em Furtividade, Leve. G2 média: 1 PP ou 1 Coragem, XP do personagem na tabela de Formação para Atributos animais, mantém 2 dados naturalmente, Vantagem em Agilidade/Destreza, Leve; falha com Pavor encerra forma. G3 grande: 1 PP ou 1 Coragem, XP do personagem na tabela de Formação para Atributos animais, combina três Atributos pertinentes, mantém 3 dados naturalmente, Leve; somente Pavor mantido não cancelado por Antecipar encerra a forma depois da ação. Atualização 16/11: Vida agora possui quatro caixas (Saudável, Ferido, Incapacitado, Inconsciente) com 1 ponto inicial em cada; Vigor alterna na primeira/segunda, as duas últimas fixas em 1. Conversão de ferimentos da Druídica para as novas quatro caixas ainda PENDENTE; o exemplo anterior com três terços está substituído. Morrer em forma animal mata o druida; transformação não automatizada.",
  2
 ]
];

// IDs de Perícias legadas continuam nas fichas salvas e no cálculo de XP,
// mas não aparecem nas opções novas de compra.
const HIDDEN_CATALOG_SKILLS=new Set(["combate","armas"]);
const RETIRED_PROTOTYPES=new Set(["marciais","combinacao","peritoconj"]);
const visibleSkillCount=()=>SKILLS.length-HIDDEN_CATALOG_SKILLS.size;

// Facetas servem à navegação: uma associação temática nunca se torna pré-requisito.
const SKILL_AFFINITY={
 "invocacao-elemental":["attr:influencia","attr:inteligencia","practice:apresentacao","practice:armas_conjuracao"],
 "domar-criatura-media":["attr:influencia","attr:inteligencia","practice:apresentacao"],
 "domar-criatura-grande":["attr:influencia","attr:inteligencia","practice:apresentacao"],
 "domar-criatura-pequena": ["attr:influencia","attr:inteligencia","practice:apresentacao"],
 "pericia-druidica": ["attr:influencia","practice:apresentacao","practice:armas_conjuracao","attr:inteligencia"],
 "combate": [
  "practice:armas_conjuracao"
 ],
 "armas": [
  "practice:armas_conjuracao"
 ],
 "montar": [
  "attr:influencia"
 ],
 "provocacao-sofisticada": [
  "attr:influencia",
  "practice:apresentacao"
 ],
 "criar-item-foco-magia": [
  "practice:armas_conjuracao",
  "attr:inteligencia",
  "practice:artesao"
 ],
 "escudo-arcano": [
  "practice:armas_conjuracao",
  "attr:inteligencia",
  "attr:vigor"
 ],
 "conjuracao-equilibrada": [
  "practice:armas_conjuracao",
  "attr:inteligencia",
  "attr:destreza"
 ],
 "improviso": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:inteligencia"
 ],
 "mestre": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:inteligencia"
 ],
 "fogo": [
  "practice:armas_conjuracao",
  "attr:inteligencia",
  "know:alquimia"
 ],
 "agua": [
  "practice:armas_conjuracao",
  "attr:inteligencia"
 ],
 "vento": [
  "practice:armas_conjuracao",
  "attr:inteligencia"
 ],
 "terra": [
  "practice:armas_conjuracao",
  "attr:inteligencia",
  "know:engenharia"
 ],
 "sagrado": [
  "practice:armas_conjuracao",
  "attr:inteligencia",
  "know:medicina"
 ],
 "veneno": [
  "practice:armas_conjuracao",
  "know:alquimia"
 ],
 "sangue": [
  "practice:armas_conjuracao",
  "know:medicina"
 ],
 "trevas": [
  "practice:armas_conjuracao"
 ],
 "criar-veneno": [
  "know:alquimia",
  "know:medicina"
 ],
 "criar-antidoto": [
  "practice:artesao",
  "know:alquimia",
  "know:medicina",
  "attr:inteligencia"
 ],
 "transfusao": [
  "practice:armas_conjuracao",
  "know:medicina"
 ],
 "transfusao-sanguinaria": [
  "practice:armas_conjuracao",
  "know:medicina"
 ],
 "armas-leves": [
  "practice:armas_conjuracao"
 ],
 "armas-medias": [
  "practice:armas_conjuracao",
  "attr:forca"
 ],
 "armas-pesadas": [
  "practice:armas_conjuracao",
  "attr:forca"
 ],
 "disciplina-avancada": [
  "practice:armas_conjuracao"
 ],
 "manejo-perfeito": [
  "practice:armas_conjuracao",
  "attr:destreza"
 ],
 "golpe-fulminante": [
  "practice:armas_conjuracao",
  "attr:forca"
 ],
 "espalhar-golpe": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:agilidade"
 ],
 "pugilismo": [
  "practice:armas_conjuracao",
  "attr:forca",
  "attr:destreza"
 ],
 "artista-marcial": [
  "practice:armas_conjuracao",
  "attr:destreza"
 ],
 "maestria-arremesso-armas": [
  "practice:armas_conjuracao",
  "attr:forca",
  "attr:destreza",
  "attr:agilidade"
 ],
 "disparo-fulminante": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:forca"
 ],
 "disparo-multiplo": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:forca"
 ],
 "recuperacao-vigorosa": [
  "attr:vigor",
  "know:medicina"
 ],
 "recuperacao-movimento": [
  "attr:vigor",
  "practice:atletismo",
  "know:medicina"
 ],
 "recobrar-coragem": [
  "attr:influencia",
  "practice:apresentacao"
 ],
 "maestria-manejo-duplo": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:forca"
 ],
 "instinto-sobrevivencia": [
  "attr:vigor",
  "know:protecao"
 ],
 "arma-certa": [
  "practice:armas_conjuracao"
 ],
 "armas-longo-alcance": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:forca"
 ],
 "disparo-violento": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:forca"
 ],
 "disparo-tatico": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:forca"
 ],
 "armas-fogo": [
  "practice:armas_conjuracao",
  "attr:destreza",
  "attr:forca"
 ],
 "golpe-baixo": [
  "attr:destreza",
  "attr:forca",
  "attr:agilidade"
 ],
 "furtividade": [
  "practice:furtividade",
  "attr:destreza",
  "attr:agilidade"
 ],
 "furtividade-avancada": [
  "practice:furtividade",
  "attr:destreza",
  "attr:agilidade"
 ]
};
const SKILL_BRANCHES=[
 ["criar-item-foco-magia","domar-criatura-pequena","invocacao-elemental","pericia-druidica"],
 ["criar-item-foco-magia","terra","domar-criatura-pequena","pericia-druidica"],
 [
  "armas",
  "armas-leves",
  "maestria-arremesso-armas",
  "disparo-fulminante",
  "disparo-multiplo"
 ],
 [
  "armas",
  "armas-leves",
  "armas-medias",
  "armas-pesadas",
  "golpe-fulminante",
  "espalhar-golpe",
  "manejo-perfeito",
  "maestria-manejo-duplo"
 ],
 [
  "pugilismo",
  "artista-marcial",
  "golpe-fulminante",
  "espalhar-golpe"
 ],
 [
  "disciplina-avancada",
  "manejo-perfeito",
  "maestria-manejo-duplo"
 ],
 [
  "recuperacao-vigorosa",
  "recuperacao-movimento",
  "instinto-sobrevivencia"
 ],
 [
  "criar-item-foco-magia",
  "escudo-arcano",
  "conjuracao-equilibrada",
  "improviso",
  "mestre",
  "fogo",
  "agua",
  "vento",
  "terra",
  "sagrado",
  "veneno",
  "sangue",
  "trevas",
  "criar-veneno",
  "criar-antidoto",
  "transfusao",
  "transfusao-sanguinaria"
 ],
 [
  "provocacao-sofisticada",
  "combate",
  "montar",
  "recobrar-coragem"
 ],
 [
  "armas-longo-alcance",
  "maestria-arremesso-armas",
  "disparo-fulminante",
  "disparo-multiplo",
  "disparo-violento",
  "disparo-tatico"
 ],
 [
  "armas-fogo",
  "disparo-multiplo"
 ],
 [
  "furtividade",
  "furtividade-avancada"
 ]
];

const SKILL_PERMALINKS={
 "invocacao-elemental":"invocacao-elemental",
 "domar-criatura-media":"domar-criatura-media",
 "domar-criatura-grande":"domar-criatura-grande",
 "domar-criatura-pequena": "domar-criatura-pequena",
 "pericia-druidica": "pericia-druidica",
 "combate": "combate",
 "armas": "armas-1",
 "montar": "montar-animal",
 "provocacao-sofisticada": "provocacao-sofisticada",
 "criar-item-foco-magia": "criar-item-de-foco-e-magia",
 "escudo-arcano": "escudo-arcano",
 "conjuracao-equilibrada": "conjuracao-refinada",
 "improviso": "improviso-elemental",
 "mestre": "maestria-elemental",
 "fogo": "pericia-em-elemento-fogo",
 "agua": "pericia-em-elemento-agua",
 "vento": "pericia-em-elemento-ar",
 "terra": "pericia-em-elemento-terra",
 "sagrado": "pericia-em-elemento-sagrado",
 "veneno": "pericia-em-elemento-veneno",
 "sangue": "pericia-em-elemento-sangue",
 "trevas": "pericia-em-elemento-trevas",
 "armas-leves": "pericia-em-armas-leves",
 "armas-medias": "pericia-em-armas-medias",
 "armas-pesadas": "pericia-em-armas-pesadas",
 "disciplina-avancada": "disciplina-avancada",
 "manejo-perfeito": "manejo-perfeito-armas-corpo-a-corpo",
 "golpe-fulminante": "golpe-fulminante",
 "espalhar-golpe": "golpe-colossal",
 "pugilismo": "pugilismo",
 "artista-marcial": "artista-marcial",
 "maestria-arremesso-armas": "pericia-em-arremesso-de-armas",
 "disparo-fulminante": "disparo-fulminante",
 "disparo-multiplo": "disparo-multiplo",
 "recuperacao-vigorosa": "recuperacao-vigorosa",
 "recuperacao-movimento": "maestria-em-recuperacao-vigorosa-em-movimento",
 "recobrar-coragem": "recobrar-coragem",
 "maestria-manejo-duplo": "pericia-em-manejo-duplo",
 "instinto-sobrevivencia": "instinto-de-sobrevivencia",
 "arma-certa": "maestria-arma-certa",
 "criar-veneno": "criar-veneno",
 "criar-antidoto": "criar-antidoto",
 "transfusao": "transfusao",
 "transfusao-sanguinaria": "transfusao-sanguinaria",
 "armas-longo-alcance": "pericia-em-armas-de-longo-alcance",
 "disparo-violento": "disparo-violento",
 "disparo-tatico": "disparo-tatico",
 "armas-fogo": "pericia-em-armas-de-fogo",
 "olhos-de-aguia": "olhos-de-aguia",
 "golpe-baixo": "golpe-baixo",
 "furtividade": "pericia-em-furtividade",
 "furtividade-avancada": "furtividade-avancada"
};
const CARD_REQUIREMENTS={
 "invocacao-elemental":"Criar Item de Foco e Magia (habilita Psique) + Domar Criatura Pequena; outros elementos exigem Perícia própria",
 "domar-criatura-media":"Influência 3 + Apresentação 1 + Inteligência 1 + Domar Criatura Pequena",
 "domar-criatura-grande":"Influência 4 + Apresentação 1 + Inteligência 1 + Domar Criatura Pequena + Domar Criatura Média",
 "domar-criatura-pequena": "Influência 2 + Apresentação 1 + Inteligência 1",
 "pericia-druidica": "Influência 2 + Criar Item de Foco e Magia + Domar Criatura Pequena + Domar Criatura Média + Domar Criatura Grande + Perícia em Elemento Terra",
 "criar-item-foco-magia": "Disciplina 1, Inteligência 1, Artesão 1",
 "escudo-arcano": "Inteligência 2, Vigor 1, Criar Foco",
 "conjuracao-equilibrada": "Disciplina 2, Inteligência 2, Destreza 2, Criar Foco",
 "improviso": "Disciplina 1, Inteligência 1, Destreza 1, Criar Foco",
 "mestre": "Disciplina 3, Inteligência 3, Destreza 3, Improviso, Criar Foco, Elemento",
 "fogo": "Disciplina 1, Inteligência 1, Criar Foco",
 "agua": "Disciplina 1, Inteligência 1, Criar Foco",
 "vento": "Disciplina 1, Inteligência 1, Criar Foco",
 "terra": "Disciplina 1, Inteligência 1, Criar Foco",
 "sagrado": "Disciplina 2, Inteligência 2, Criar Foco",
 "veneno": "Disciplina 2 + Inteligência 2 + Alquimia 2 + Medicina 2",
 "sangue": "Disciplina 2, Inteligência 2, Criar Foco",
 "trevas": "Disciplina 2, Inteligência 2, Criar Foco",
 "criar-antidoto": "Artesão 1 + Inteligência 2 + Alquimia 2 + Medicina 2 + Criar Veneno",
 "transfusao-sanguinaria": "Transfusão + Perícia em Elemento Sangue",
 "armas-longo-alcance": "Disciplina 1 + Destreza 2",
 "olhos-de-aguia": "Destreza 3 + Disciplina 3 + Armas de Longo Alcance OU Armas de Fogo",
 "golpe-fulminante": "Disciplina 2 + Força 2 + uma especialização corpo a corpo",
 "espalhar-golpe": "Destreza 1 + Agilidade 1 + Disciplina 2 + Golpe Fulminante + especialização corpo a corpo",
 "maestria-arremesso-armas": "Força 2 + Destreza 2 + Agilidade 1 + Armas Leves OU Médias OU Pesadas",
 "disparo-fulminante": "Destreza 2 + Força 1 + Disciplina 2 + (Armas de Longo Alcance OU Perícia em Arremesso de Armas)",
 "disparo-multiplo": "Destreza 2 + Agilidade 2 + Disciplina 2 + Disparo Fulminante + (Armas de Longo Alcance OU Arremesso)",
 "disparo-violento": "Destreza 2 + Disciplina 2 + (Força 2 OU Força 1 + Atletismo 1) + (Armas de Longo Alcance OU Arremesso)",
 "disparo-tatico": "PENDENTE (compatível com Perícia em Arremesso de Armas)",
 "armas-fogo": "Disciplina 2 + Destreza 2",
 "golpe-baixo": "Destreza 2 + Força 1 + Agilidade 1",
 "maestria-manejo-duplo": "Disciplina Avançada + Força 2 + Destreza 2 + Agilidade 1 + uma Perícia em Armas Leves, Médias, Pesadas, Arremesso, Fogo ou Longo Alcance",
 "criar-veneno": "Artesão 1 + Inteligência 2 + Alquimia 2 + Medicina 2",
 "furtividade": "Furtividade 2 + Destreza 2 + Agilidade 1",
 "furtividade-avancada": "Furtividade 2 + Perícia em Furtividade",
 "armas-leves": "Disciplina 1",
 };

const CARD_EFFECTS={
 "invocacao-elemental":"Uma ficha ativa por conjurador; pode dividir criaturas em tokens com XP/Vida repartidos e DE preservada. Dano de área é normal. Apenas um turno antecipável, para agir sozinho ou ajudar conjurador/aliado em ação conjunta. Dois elementos exigem Improviso + Maestria; Psique projeta a mente e deixa o corpo parado. Divisão inexata pendente.",
 "domar-criatura-media":"Uma companheira Média por personagem; ficha própria e +1 Vida ao domador.",
 "domar-criatura-grande":"Uma companheira Grande por personagem; ficha própria e +1 Vida ao domador.",
 "domar-criatura-pequena": "Companheiro Pequeno: +1A em combate, +1 Vida ao domador; 1 Vida própria inicial, ficha opcional permite +Vida por Vigor/Força (XP 2x desde G1), sacrifício protetor.",
 "pericia-druidica": "2 XP uma única vez pelos três Graus. Memória ilimitada; Vida em quatro estados, conversão animal/humana pendente.",
 "criar-item-foco-magia": "Prepara magias, focos e efeito Psíquico inicial.",
 "escudo-arcano": "Escudo de 1 rodada; E+P mantidos formam DE/Integridade; Psíquico anula Perfurante físico, não dano.",
 "conjuracao-equilibrada": "Especialização de alcance de efeitos mágicos; distância e procedimento pendentes.",
 "improviso": "+1A e elemento disponível na cena sem efeito especial.",
 "mestre": "+1A cumulativo e dois efeitos de elementos habilitados.",
 "fogo": "Fogo leve, dano e manipulação de chamas.",
 "agua": "Água leve, congelamento e manipulação.",
 "vento": "Ar leve, movimento e deslocamento.",
 "terra": "Terra leve, terreno e percepção sísmica.",
 "sagrado": "Êxitos excedentes recuperam Coragem; P anula recuperação.",
 "veneno": "Magia de Veneno: 1 acúmulo em alvo com Sangramento; limiares por Vida atual",
 "sangue": "Amplifica ações uma vez por turno; dano convencional ou extração 1 Vida por 1 Vida quando ambos Sangrando. Economia em revisão.",
 "trevas": "Até dois alvos; +2P válidos para DE, dano e risco; dividir ou concentrar Pavor.",
 "criar-veneno": "Produz venenos; 1 dose por arma e 1 acúmulo por efeito ativado",
 "criar-antidoto": "Fabrica Antídoto; cada dose não diluída remove 1 acúmulo de Envenenamento",
 "transfusao": "Transfere 1 Vida ou aplica Antídoto à distância.",
 "transfusao-sanguinaria": "Protótipo: 3 marcas elegíveis somadas (derramadas + extraídas) permitem registrar +1 Vida; sem contagem dupla.",
 "armas-longo-alcance": "Arcos e bestas: ativa efeitos, remove Desvantagens naturais por peso",
 "golpe-fulminante": "Dano de Pavor válido passa a 1 por P no alvo corpo a corpo",
 "espalhar-golpe": "Raio 3 m, até 2 alvos adicionais por ativação, metade do dano dos Êxitos, SEM +1E",
 "maestria-arremesso-armas": "Ativa Sangramento, Perfuração, Veneno etc. da arma arremessada; arremessar é ação básica",
 "disparo-fulminante": "Pavor válido provoca 1 dano por P no alvo principal",
 "disparo-multiplo": "Principal recebe dano integral; adicionais no raio de 3 m recebem metade dos Êxitos e 0,5 por P",
 "disparo-violento": "Derruba inimigo atingido e empurra 4 m",
 "disparo-tatico": "Técnica futura, com compatibilidade com Arremesso definida",
 "armas-fogo": "Perfurante é passivo quando presente; Barulhenta +1P fixo. Descarregar Tambor contra um alvo",
 "golpe-baixo": "Acerto aplica Desvantagem (−1A) durante 1 rodada",
 "maestria-manejo-duplo": "Uma única rolagem Armas + Armas + Atributo, característica escolhida entre as armas, dano básico uma vez",
 "furtividade": "Recebe Vantagem (+1A) em testes com Furtividade, cumulativa com Concentrado",
 "furtividade-avancada": "Acrescenta mais um Atributo, Conhecimento ou Prática pertinente a teste de Furtividade"
};

const CARD_BRIEFS={
 "invocacao-elemental":"Compra 1 XP; Criar Item de Foco e Magia habilita Psique e Domar Pequena dá o porte inicial. Outros elementos exigem Perícia própria. Invocar: 1 PP ou 1 Coragem.",
 "domar-criatura-media":"1 XP. Influência 3, Apresentação 1, Inteligência 1 e Domar Criatura Pequena.",
 "domar-criatura-grande":"1 XP. Influência 4, Apresentação 1, Inteligência 1, Domar Criatura Pequena e Domar Criatura Média.",
 "domar-criatura-pequena": "1 XP e requisitos Influência 2, Apresentação 1 e Inteligência 1. Domar consome 1 PP ou 1 Coragem e teste de Influência + Apresentação. Compra não é domesticação.",
 "pericia-druidica": "Compra única de 2 XP; exige as três Perícias de Domar. Formas ilimitadas; conversão pela nova Saúde de quatro faixas pendente.",
 "criar-item-foco-magia": "Inicia a conjuração Psíquica, permite preparar magias e fabricar focos. Efeitos especiais requerem acerto e ativação.",
 "escudo-arcano": "Escudo de 1 rodada. E+P válidos mantidos formam DE/Integridade. Escudo Psíquico anula Perfurante físico sem cancelar dano; Perfurar de Água não é anulado. Protege em todas as direções na forma pessoal/circular; parede linear tem cobertura própria. Efeitos de proteção não são automatizados.",
 "conjuracao-equilibrada": "Conjuração Refinada substituirá a mudança de peso por alcance ampliado de magias; números e custos ainda não reescritos pelo autor.",
 "improviso": "Adiciona +1 Antecipar e um elemento presente na cena. O elemento ajuda no impacto e afinidades, mas não ativa sua propriedade especial.",
 "mestre": "Mescla dois elementos em uma conjuração; aplica as propriedades de ambos se as duas Perícias tiverem sido adquiridas. +1A acumula com Improviso.",
 "sagrado": "Recupera Coragem por Êxitos excedentes depois da DE. Pavor cancela recuperação sem voltar a virar dano. Em área, aliados recuperam igualmente.",
 "trevas": "Uma rolagem contra até dois alvos; +2P antes da DE, válidos para dano e transferência. Repartir Pavor igualmente ou concentrar em um alvo; nunca duplicar.",
 "sangue": "Rework v0.71: Sangue amplifica uma magia, retenção OU elevação de dado uma vez por turno, substituindo Coragem (quantia/recurso PENDENTES). Extração exige ambos Sangrando e troca 1 Vida própria por 1 Vida do alvo. Sangue derramado ou extraído é consumido quando utilizado em conjuração, mesmo para dano convencional à armadura, e não pode ser reutilizado em Transfusão.",
 "veneno": "Conjuração distinta da alquimia Criar Veneno. No acerto em alvo com Sangramento, gasta 1 PP ou 1 Coragem para aplicar 1 acúmulo por 2 rodadas sem renovar os anteriores. A partir de 2/3 da Vida atual, Ferido; se acúmulos alcançam Vida atual, Incapacitado. Se estiver Envenenado com exatamen…",
 "criar-antidoto": "Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos f…",
 "criar-veneno": "Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento (estado que ignora armadura, sem causar dano à Vida). Aplicação por magia de Sangue foi autorizada conceitualmente, mas entrega, custos e habilitações permanecem pendentes. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se…",
 "transfusao": "Perícia separada, utilizável em combate: transfere exatamente 1 Vida do Hemomante ao aliado ou leva Antídoto à distância consumindo doses.",
 "transfusao-sanguinaria": "PROTÓTIPO: 1 XP. Requer Transfusão + Elemento Sangue. Conjuração ativa, 3 marcas elegíveis de sangue derramado OU extraído → 1 Vida recuperada. Evitar contagem dupla. Custos e gatilhos pendentes.",
 "fogo": "Manipula fogo disponível e técnicas especiais conforme Grau. Na versão inicial, o disparo não causa queimadura direta à Vida.",
 "agua": "Manipula água, produz congelamento leve e abre efeitos de perfuração nos Graus superiores, com os custos pertinentes.",
 "vento": "Manipula deslocamento e correntes de ar, incluindo autoempurrão e diferentes formas de manifestação.",
 "terra": "Manipula terreno, dificulta movimentação e ajuda a detectar ameaças pelo sentido sísmico.",
 "armas-longo-alcance": "Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especi…",
 "golpe-fulminante": "Após acerto, pagar a ativação transforma cada Pavor mantido não anulado em 1 dano. Pavor continua gerando risco e Pressão. Especializações: Armas Leves, Médias, Pesadas, Manejo Duplo ou Pugilismo. Arremesso não satisfaz esse requisito. Crítico NÃO isenta o custo da técnica.…",
 "espalhar-golpe": "Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SE…",
 "maestria-arremesso-armas": "Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 PP ou 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Al…",
 "disparo-fulminante": "Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados.…",
 "disparo-multiplo": "A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 PP ou 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e some…",
 "disparo-violento": "Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crític…",
 "disparo-tatico": "O autor confirmou compatibilidade com Perícia em Arremesso de Armas. Requisitos completos, custo, efeitos e ativação ainda PENDENTES. Não habilitar compra nem automatizar efeitos.…",
 "armas-fogo": "Crítico ativa UMA característica escolhida gratuitamente; acerto normal custa 1 PP ou 1 Coragem. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escope…",
 "golpe-baixo": "Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, m…",
 "maestria-manejo-duplo": "Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica das duas armas sem custo; acerto comum ativa ambo…",
 "furtividade": "Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.…",
 "furtividade-avancada": "Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite…"
};

const CARD_ACTIVATIONS={
 "invocacao-elemental":"1 PP ou 1 Coragem; segundo elemento +1 Coragem (Improviso + Maestria); efeitos especiais +1 PP ou +1 Coragem",
 "domar-criatura-media":"1 PP ou 1 Coragem + teste de Influência + Apresentação",
 "domar-criatura-grande":"1 PP ou 1 Coragem + teste de Influência + Apresentação",
 "domar-criatura-pequena": "1 PP ou 1 Coragem + teste de Influência + Apresentação",
 "pericia-druidica": "Pequena: 0; média/grande: 1 PP ou 1 Coragem",
 "criar-item-foco-magia": "1 PP ou 1 Coragem para efeito Psíquico",
 "escudo-arcano": "1 PP ou 1 Coragem (+ custo por expansão)",
 "conjuracao-equilibrada": "PENDENTE",
 "improviso": "Passiva",
 "mestre": "1 PP ou 1 Coragem",
 "fogo": "1 PP ou 1 Coragem",
 "agua": "1 PP ou 1 Coragem",
 "vento": "1 PP ou 1 Coragem",
 "terra": "1 PP ou 1 Coragem",
 "sagrado": "1 PP ou 1 Coragem",
 "veneno": "1 PP ou 1 Coragem após acerto",
 "sangue": "Amplificação: 1 uso/turno; custos em revisão",
 "trevas": "1 PP ou 1 Coragem",
 "criar-veneno": "Preparação alquímica; ativação conforme arma",
 "criar-antidoto": "1 dose remove 1 acúmulo",
 "transfusao": "Custo de Vida; PP/Coragem a confirmar",
 "transfusao-sanguinaria": "Conjuração ativa · custo e procedimento pendentes",
 "armas-longo-alcance": "1 PP ou 1 Coragem no acerto comum; crítico gratuito",
 "golpe-fulminante": "1 PP ou 1 Coragem; crítico não dispensa",
 "espalhar-golpe": "1 PP ou 1 Coragem por até 2 alvos adicionais",
 "maestria-arremesso-armas": "1 PP ou 1 Coragem ao acertar para ativar efeitos",
 "disparo-fulminante": "1 PP ou 1 Coragem; crítico não dispensa",
 "disparo-multiplo": "1 PP ou 1 Coragem a cada até 2 alvos adicionais",
 "disparo-violento": "1 PP ou 1 Coragem; crítico não dispensa",
 "disparo-tatico": "PENDENTE",
 "armas-fogo": "1 PP ou 1 Coragem no acerto comum; crítico gratuito para efeitos da arma",
 "golpe-baixo": "1 PP ou 1 Coragem",
 "maestria-manejo-duplo": "1 PP ou 1 Coragem no acerto normal; crítico gratuito",
 "furtividade": "Passiva",
 "furtividade-avancada": "Passiva"
};

function skillCompactCard([id,name,detail,cost],wizard){
 const racial=racialGrants(state).includes(id),owned=ownsSkill(id),req=skillReq(id),affordable=Number.isInteger(cost)&&canAfford("skills",cost);
 const disabled=racial||!!state.pending||(!owned&&(!!req||!affordable));
 const act=CARD_ACTIVATIONS[id]||(id==="olhos-de-aguia"?"Passiva · sem custo":(/1 PP|1 Coragem/i.test(detail)?"1 PP ou 1 Coragem (ativação paga)":"Passiva / consultar"));
 const practical=CARD_EFFECTS[id]||detail.replace(/^\\d+ XP [·•] /,"").split(". ")[0].slice(0,105);
 const warning=req||(!owned&&!affordable?"XP insuficiente.":"");
 const button=racial?"Origem · Gratuita":owned?("Devolver "+(Number.isInteger(cost)?cost:"?")+" XP · playtest"):cost===null?"Pendente":"Comprar · "+cost+" XP";
 return '<article tabindex="0" class="fp-skill fp-skill-compact'+(wizard?' fp-wiz-skill':'')+(owned?' owned selected':'')+'" data-skill-open="'+esc(id)+'" aria-label="Abrir detalhes de '+esc(name)+'">'+
 '<a class="fp-skill-content fp-skill-main-link" href="../pericias/'+SKILL_PERMALINKS[id]+'.html" aria-label="Ler verbete completo de '+esc(name)+'"><strong>'+esc(name)+'</strong><dl class="fp-skill-quick">'+
 '<div><dt>Requisitos</dt><dd>'+esc(CARD_REQUIREMENTS[id]||"Consultar verbete")+'</dd></div>'+
 '<div><dt>XP</dt><dd>'+esc(racial?"0 XP · origem":cost===null?"Pendente":cost+" XP")+'</dd></div>'+
 '<div><dt>Ativação</dt><dd>'+esc(act)+'</dd></div>'+
 '<div><dt>Efeito prático</dt><dd>'+esc(practical)+'</dd></div></dl><span class="fp-skill-link-note">Ler verbete completo ↗</span></a>'+
 '<div class="fp-skill-preview" role="tooltip"><strong>Resumo</strong><p>'+esc(CARD_BRIEFS[id]||detail.slice(0,240))+'</p><small>Clique para abrir explicação completa.</small></div>'+
 '<div class="fp-skill-controls"><button type="button" data-action="skill" data-id="'+esc(id)+'" aria-pressed="'+owned+'" title="'+esc(warning)+'"'+(disabled?' disabled':'')+'>'+esc(button)+'</button>'+
 (warning?'<small class="fp-skill-req">'+esc(warning)+'</small>':'')+'</div></article>';
}
function openSkillDetails(id){
 const slug=SKILL_PERMALINKS[id];
 if(slug)window.location.href="../pericias/"+slug+".html";
}

const skillFilter={scope:"all",ready:false,query:""};
function skillRequirementsMet(id){const s=SKILLS.find(x=>x[0]===id);return !!s&&Number.isInteger(s[3])&&!skillReq(id);}

function filteredSkills(){
 const query=skillFilter.query.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 return SKILLS.filter(([id,name,description])=>{
   if(HIDDEN_CATALOG_SKILLS.has(id))return false;
  if(skillFilter.ready&&!skillRequirementsMet(id))return false;
  if(skillFilter.scope==="related"){
   if(!SKILL_BRANCHES.some(branch=>branch.includes(id)&&branch.some(k=>ownsSkill(k))))return false;
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
  '<p class="fp-skill-filter-hint">Atributos, Conhecimentos e Práticas organizam por requisito ou afinidade temática, não criam requisitos novos. <strong>'+filteredSkills().length+' de '+visibleSkillCount()+'</strong> Perícias exibidas.</p></div>';
}
function syncSkillFilterControls(){
 document.querySelectorAll("[data-skill-scope]").forEach(el=>el.value=skillFilter.scope);
 document.querySelectorAll("[data-skill-ready]").forEach(el=>el.checked=skillFilter.ready);
 document.querySelectorAll("[data-skill-search]").forEach(el=>{if(el!==document.activeElement)el.value=skillFilter.query;});
 document.querySelectorAll(".fp-skill-filter-hint strong").forEach(el=>el.textContent=filteredSkills().length+" de "+visibleSkillCount());
}
function renderWizardSkillCards(){
 const container=$("wizard-skill-cards");
 if(container)container.innerHTML=wizardSkillCardsMarkup();
}

const WEIGHTS={muito_leve:["Muito leve",.0125],leve:["Leve",.125],medio:["Médio",.5],alto:["Alto / Pesado",1],extremo:["Extremo",2]};
const CATALOG=(window.CODEX_G1_CATALOG||[]).filter(x=>x.grade===1);
const RESOURCES=[["ervas","Ervas"],["espolios","Espólios"],["couro","Couro"],["comida","Comida"],["minerios","Minérios"]];
const STARTING_VT=20; // EXPERIMENTAL: patrimônio igual para os Aprendizes; VT não é moeda física.
// SRD v0.43: dois patamares sem preços oficiais. Sangue está vinculado à Pedra da Alma.
const STONE_CATALOG=[["Fogo","common"],["Água","common"],["Ar","common"],["Terra","common"],["Psíquico","common"],
 ["Veneno","rare"],["Sagrado","rare"],["Trevas","rare"]];
const ACTIVE_PROPERTIES=new Set(["Contundente","Cortante","Perfurante","Cravar","Enganchar","Elemental","Explosivo","Muito Leve"]);
const SOUND_KEY="codex-roll-sound-v1";
let soundEnabled=true,audioContext=null,tradeDraft=null,tradeOwner=null;
try{soundEnabled=localStorage.getItem(SOUND_KEY)!=="off";}catch(e){}
function soundUI(){const b=document.getElementById("sound-toggle");if(!b)return;b.textContent=soundEnabled?"Som: ligado":"Som: desligado";b.setAttribute("aria-pressed",String(soundEnabled));b.setAttribute("aria-label",soundEnabled?"Silenciar rolagens":"Ativar som de rolagem");}
function playRollSound(){
 if(!soundEnabled)return;
 try{
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  audioContext=audioContext||new AC();
  if(audioContext.state==="suspended")void audioContext.resume();
  const time=audioContext.currentTime;
  for(let i=0;i<3;i++){
   const osc=audioContext.createOscillator(),gain=audioContext.createGain(),t=time+i*.055;
   osc.type="triangle";osc.frequency.setValueAtTime([610,460,345][i],t);
   osc.frequency.exponentialRampToValueAtTime([310,240,170][i],t+.065);
   gain.gain.setValueAtTime(.0001,t);
   gain.gain.exponentialRampToValueAtTime(.055,t+.009);
   gain.gain.exponentialRampToValueAtTime(.0001,t+.09);
   osc.connect(gain);gain.connect(audioContext.destination);osc.start(t);osc.stop(t+.1);
  }
 }catch(err){console.warn("Codex: áudio indisponível",err);}
}
function tradeDefault(){return {initial:STARTING_VT,resources:Object.fromEntries(RESOURCES.map(([k])=>[k,4])),purchases:[],collected:false,
 stonePrices:{common:null,rare:null},stones:[]};}
function walletValue(s=state){return RESOURCES.reduce((n,[k])=>n+Number(s.trade?.resources?.[k]||0),0);}
function resourceWeight(s=state){return walletValue(s)/10*WEIGHTS.leve[1];} // Lotes G1 pequenos: 10 unidades = 1 Leve (proposta).
function combatItem(item,mode){
 if(!item?.equipped||!["arma","foco"].includes(item.type))return [];
 if(!((item.grade||1)<= (state.level>=20?4:state.level>=10?3:state.level>=5?2:1)))return [];
 const skills=allOwnedSkills(),properties=item.properties||[],range=properties.includes("À Distância");
 const cat=item.category||({leve:"leve",medio:"medio",alto:"pesado"}[item.weight]||"leve");
 const die=[6,10,12].includes(item.die)?item.die:({leve:6,medio:10,pesado:12}[cat]||0);
 if(!die)return [];
 if(mode==="conjuracao"){
  if(item.type!=="foco"||!skills.includes("criar-item-foco-magia"))return [];
  const element=(item.element||"psiquico").toLowerCase();
  const map={ar:"vento",água:"agua",agua:"agua",terra:"terra",fogo:"fogo",sagrado:"sagrado",sangue:"sangue",veneno:"veneno",trevas:"trevas"};
  if(!["psiquico","psíquico"].includes(element)&&!skills.includes(map[element]||element))return [];
  // O peso físico de um cetro G1 não habilita automaticamente magia Média/Pesada.
  return [cat==="leve"?die:6]; // Conjuração Refinada não concede dado maior pelo peso físico do foco (SRD v0.44).
 }
 if(mode!=="armas"||item.type!=="arma")return [];
 if(item.firearm)return skills.includes("armas-fogo")?[die]:[];
 if(range){
  if(!skills.includes("armas-longo-alcance"))return [];
  const double=item.name.toLowerCase()==="besta de uma mão"&&skills.includes("armas-leves");
  return double?[die,die]:[die];
 }
 const id={leve:"armas-leves",medio:"armas-medias",pesado:"armas-pesadas"}[cat];
 return id&&skills.includes(id)?[die]:[];
}
function effectiveWeaponRange(item,skills=allOwnedSkills()){
  const base=Math.max(0,Number(item?.range)||0);
  if(!base||item?.type!=="arma"||!skills.includes("olhos-de-aguia"))return base;
  const eligible=item.firearm?skills.includes("armas-fogo"):
   (item.properties||[]).includes("À Distância")&&skills.includes("armas-longo-alcance");
  return base+(eligible?8:0);
 }
 function normalizedCatalogItem(entry){
 const type=entry.kind==="armor"?"armadura":entry.kind==="shield"?"escudo":entry.kind==="focus"?"foco":"arma";
 const weight=entry.category==="muito-leve"?"muito_leve":entry.category==="pesado"?"alto":entry.category==="medio"?"medio":"leve";
 return normalizeItem({name:entry.name,type,weight,category:entry.category,grade:entry.grade,qty:1,
  max:entry.integrity?.max||0,hp:entry.integrity?.value||0,equipped:false,
  die:entry.die||0,range:entry.range||0,priceVT:entry.priceVT||0,properties:entry.properties||[],
  element:entry.element||"",firearm:entry.kind==="firearm",catalogId:entry.name,
  durability:entry.durability?.value||0,durabilityMax:entry.durability?.max||0});
}

const SITUATIONS={normal:["Normal",0,0],vantagem:["Vantagem (+1A)",0,1],desvantagem:["Desvantagem (−1A)",0,-1],absoluta:["Vantagem absoluta (+1E)",1,0],desv_absoluta:["Desvantagem absoluta (−1E)",-1,0],sorte:["Ação de Sorte (−2E)",-2,0]};
const $=id=>document.getElementById(id),esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
const key=x=>x?x.group+"."+x.key:"";
const same=(a,b)=>!!a&&!!b&&key(a)===key(b);
const pad=n=>Number(n).toLocaleString("pt-BR",{maximumFractionDigits:4});
const getId=()=>typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"item-"+Date.now()+"-"+Math.floor(Math.random()*1e6);
function defaultState(){return{
 schema:"codex-html-playtest-v1",name:"",concept:"",origin:"",race:"humano",pureElement:"",runeElements:["",""],racialInitialAttributes:[],perseverancaUsed:false,virtue:"",personality:"",portrait:"",
 level:1,attributes:{},knowledges:{},practices:{},skills:[],weaponFocus:"leve",creationLocked:false,creationBudgetSnapshot:null,
 xpEarned:0,legacyXPRefund:0,xpHistory:[],life:4,courage:10,pp:0,xp:0,
 items:[],trade:tradeDefault(),elementalCrystal:{element:"",quantity:0},notes:"",pending:null,history:[],courageUsedTurn:false,
 hemomancy:{spilled:0,extracted:0,selfBleeding:false,usedThisTurn:false}
};}
let state=defaultState(),draft=null,toastTimer=null,wizardStep=0,wizardReached=0,viewMode="builder",editMode=false;
let playerSheets=[],activePlayerSheetId="";
let wizardCategory="",wizardTab="attr",wizardMode="genetic";
let wizardStarterPhase="attr",wizardStarterAttribute="",wizardStarterTraining="",wizardStarterPurchased="";
let wizardShopCategory="all",wizardTradePreferred="ervas";
let sheetPage="play",geneFilter="related",geneSelected="",geneSearch="",geneListOpen=false;
let geneShowFuture=false,geneDraft=new Map(),genePendingSkills=new Set(),geneInspectorOpen=false,geneInspectorTop=12;
const WIZARD_STEPS=[
 ["Identidade","Quem é seu Aprendiz?","Nome, raça e conceito"],
 ["Escolhas iniciais","Atributo e formação","1 Atributo + 1 Conhecimento ou Prática"],
 ["Distribuir XP","Compre graus e Perícias","Codex Genético por padrão; listas opcionais"],
 ["VT e Equipamentos","Seu patrimônio inicial","Distribua recursos e escolha itens"],
 ["Revisão","Sua história começa aqui","Confira e confirme a ficha"]
];
// Metadados usados na etapa 3 para explicar as abas do visualizador padrão.
// Restaurados após a separação do guia de escolhas individuais (etapa 2).
const WIZARD_CATEGORIES=[
 {id:"attr",title:"Atributos",description:"Capacidades fundamentais do Aprendiz. Permitem ações físicas, mentais e sociais pertinentes.",dice:"Grau 0: 1d4 · Grau 1: 1d6",cost:"Grau 1: 1 XP"},
 {id:"know",title:"Conhecimentos",description:"Estudo, investigação e compreensão de assuntos especializados.",dice:"Grau 0: 1d6 · Grau 1: 1d10",cost:"Grau 1: 2 XP"},
 {id:"practice",title:"Práticas",description:"Treinamento e execução de técnicas. Disciplina é uma Prática única.",dice:"Grau 0: 1d6 · Grau 1: 1d10",cost:"Grau 1: 2 XP"}
];
// Exemplos didáticos de uso, sem criar efeitos ou bônus de regras.
const WIZARD_ATTRIBUTE_GUIDE={
 forca:["Potência física","Empurrar, erguer, carregar e aplicar força em ações pertinentes.","Para quem deseja enfrentar desafios de esforço e potência corporal."],
 agilidade:["Movimento e reação","Mover-se, reagir, reposicionar-se e evitar ameaças.","Participa da DE defensiva natural e do deslocamento, conforme o SRD."],
 destreza:["Precisão e coordenação","Manipular objetos, executar movimentos finos e agir com precisão.","Contribui para a DE defensiva e ações que dependem de coordenação."],
 inteligencia:["Raciocínio e compreensão","Analisar situações, interpretar pistas e resolver problemas lógicos.","Pode combinar com estudos pertinentes, sem habilitar efeitos automaticamente."],
 influencia:["Presença e interação","Comunicar, convencer, negociar e liderar em situações sociais.","Para caminhos sociais, expressivos e de liderança."],
 vigor:["Resistência física","Suportar cansaço, esforço prolongado e condições adversas.","Representa resistência e capacidade corporal."]
};
const WIZARD_TRAINING_GUIDE={
 "know:protecao":["Estudo das defesas","Compreender proteção, armaduras e formas de reduzir riscos.","Não concede defesa automática."],
 "know:astronomia":["Estudo do céu","Observar astros, ciclos e fenômenos celestes.","Interpretação de informações astronômicas pertinentes."],
 "know:medicina":["Estudo do corpo","Reconhecer ferimentos, sinais e formas de tratamento.","Diagnóstico e cuidados conforme a ação."],
 "know:alquimia":["Estudo de substâncias","Analisar materiais, misturas e transformações.","Compreensão de composições e processos alquímicos."],
 "know:engenharia":["Estudo de estruturas","Investigar mecanismos, construções e projetos.","Examinar ou planejar soluções técnicas."],
 "know:erudicao":["Estudo e cultura","Pesquisar histórias, textos, tradições e saberes diversos.","Interpretação de informações e pesquisa."],
 "practice:armas_conjuracao":["Treinamento disciplinado","Praticar ações marciais e mágicas segundo suas habilitações.","Disciplina é uma única Prática; efeitos específicos exigem Perícias."],
 "practice:atletismo":["Treinamento corporal","Correr, saltar, escalar e superar obstáculos físicos.","Movimentos e esforços treinados."],
 "practice:furtividade":["Treinamento discreto","Ocultar-se e mover-se sem chamar atenção.","Ações furtivas pertinentes."],
 "practice:artesao":["Treinamento de ofício","Criar, ajustar e reparar objetos com técnicas aprendidas.","Fabricação e trabalho manual."],
 "practice:apresentacao":["Treinamento expressivo","Atuar, discursar, cantar e realizar apresentações.","Performances e expressão treinada."],
 "practice:coleta":["Treinamento de obtenção","Localizar, recolher e extrair recursos de um ambiente.","Obtenção técnica de materiais e recursos."]
};
const freshDraft=()=>({base:null,attribute:null,third:null,mode:"normal",de:1,situation:"normal",
  extraKeep:false,step:false,stepDieId:"",combatBonus:false,weightEnabled:false,attackWeight:"leve",targetWeight:"medio",
  contextOK:false,equipmentId:"",trevas:false});
// Múltiplas fichas de jogadores compartilham a lógica da ficha, nunca suas compras ou saldos.
// O SAVE_KEY antigo não é apagado: é cópia de segurança da ficha anterior à migração.
function playerSheetKey(id){return PLAYER_SHEET_PREFIX+id;}
function playerSheetId(){return getId().replace(/[^a-zA-Z0-9_-]/g,"").slice(0,90);}
function playerSheetMeta(s,id,createdAt=new Date().toISOString()){
 return {id,name:String(s.name||"").trim().slice(0,70),race:Object.hasOwn(RACES,s.race)?s.race:"humano",
  level:clamp(Math.floor(s.level||1),1,20),createdAt,updatedAt:new Date().toISOString()};
}
function wizardSnapshot(){
 return {version:4,step:wizardStep,reached:wizardReached,category:wizardCategory,tab:wizardTab,mode:wizardMode,
  starterPhase:wizardStarterPhase,starterAttribute:wizardStarterAttribute,starterTraining:wizardStarterTraining,starterPurchased:wizardStarterPurchased,
  shopCategory:wizardShopCategory,tradePreferred:wizardTradePreferred};
}
function restoreWizard(w={}){
 const oldStep=Math.floor(w.step||0),oldReached=Math.floor(w.reached||oldStep);
 wizardStep=w.version>=4?clamp(oldStep,0,4):w.version>=2?(oldStep>=3?4:clamp(oldStep,0,2)):clamp(oldStep>0?1:0,0,4);
 wizardReached=w.version>=4?clamp(oldReached,wizardStep,4):w.version>=2?(oldReached>=3?4:Math.max(wizardStep,clamp(oldReached,0,2))):wizardStep;
 wizardCategory=["attr","know","practice"].includes(w.category)?w.category:"";
 wizardTab=["attr","know","practice","skills"].includes(w.tab)?w.tab:(wizardCategory||"attr");
 wizardMode=w.mode==="list"?"list":"genetic";
 wizardShopCategory=["all","weapon","firearm","armor","shield"].includes(w.shopCategory)?w.shopCategory:"all";
 wizardTradePreferred=RESOURCES.some(([k])=>k===w.tradePreferred)?w.tradePreferred:"ervas";
 wizardStarterAttribute=A.some(([k])=>k===w.starterAttribute)?w.starterAttribute:"";
 wizardStarterPurchased=A.some(([k])=>k===w.starterPurchased)?w.starterPurchased:"";
 wizardStarterTraining=[...K.map(([k])=>"know:"+k),...P.map(([k])=>"practice:"+k)].includes(w.starterTraining)?w.starterTraining:"";
 wizardStarterPhase=["attr","training","confirm"].includes(w.starterPhase)?w.starterPhase:"attr";
 if(wizardStarterPhase!=="attr"&&!wizardStarterAttribute)wizardStarterPhase="attr";
 if(wizardStarterPhase==="confirm"&&!wizardStarterTraining)wizardStarterPhase="training";
}
function readPlayerSheet(id){
 if(!/^[a-zA-Z0-9_-]{1,90}$/.test(String(id||"")))return null;
 try{
  const payload=JSON.parse(localStorage.getItem(playerSheetKey(id))||"null");
  return payload?.schema==="codex-jogador-ficha-v1"&&payload.character&&typeof payload.character==="object"?
   payload:null;
 }catch(e){console.warn("Codex: ficha de jogador não pôde ser recuperada",e);return null;}
}
function loadPlayerSheets(){
 if(NPC_MODE)return null;
 try{
  const index=JSON.parse(localStorage.getItem(PLAYER_SHEETS_INDEX)||"null");
  if(!index||!Array.isArray(index.sheets))return null;
  const entries=index.sheets.filter(x=>x&&/^[a-zA-Z0-9_-]{1,90}$/.test(x.id))
   .slice(0,40).map(x=>({id:x.id,name:String(x.name||"").slice(0,70),race:Object.hasOwn(RACES,x.race)?x.race:"humano",
    level:clamp(x.level||1,1,20),createdAt:String(x.createdAt||""),updatedAt:String(x.updatedAt||"")}));
  const ordered=[...entries.filter(x=>x.id===index.activeId),...entries.filter(x=>x.id!==index.activeId)];
  for(const entry of ordered){
   const payload=readPlayerSheet(entry.id);
   if(payload){playerSheets=entries;activePlayerSheetId=entry.id;return payload;}
  }
 }catch(e){console.warn("Codex: índice de personagens inválido; tentativa de recuperação da ficha antiga",e);}
 return null;
}
function renderPlayerSheets(){
 const area=$("player-sheets"),select=$("player-sheet-select"),deleteButton=$("player-sheet-delete");
 if(!area||!select)return;
 area.hidden=NPC_MODE;
 if(NPC_MODE)return;
 select.innerHTML=playerSheets.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name||"Aprendiz sem nome")+
  ' · '+esc(RACES[x.race]?.[0]||"Humano")+' · N'+x.level+'</option>').join("");
 select.value=activePlayerSheetId;
 if(deleteButton)deleteButton.disabled=playerSheets.length<2;
 const note=$("player-sheets-count");
 if(note)note.textContent=playerSheets.length+" "+(playerSheets.length===1?"ficha salva":"fichas salvas")+" neste navegador";
}
function resetPlayerView(wizard={}){
 draft=freshDraft();editMode=false;viewMode=state.creationLocked?"sheet":"builder";sheetPage="play";
 tradeDraft=null;tradeOwner=null;
 geneDraft.clear();genePendingSkills.clear();geneSelected="";geneInspectorOpen=false;geneShowFuture=false;
 geneFilter="related";geneSearch="";geneListOpen=false;
 restoreWizard(wizard);
}
function activatePlayerSheet(id){
 if(NPC_MODE||id===activePlayerSheetId)return;
 const payload=readPlayerSheet(id);
 if(!payload){toast("Não foi possível abrir essa ficha. Exporte as outras fichas e verifique o armazenamento.");renderPlayerSheets();return;}
 if(!save()){toast("A ficha atual não pôde ser salva. A troca foi cancelada.");renderPlayerSheets();return;}
 activePlayerSheetId=id;
 state=normalize(payload.character);
 resetPlayerView(payload.wizard||{});
 try{localStorage.setItem(PLAYER_SHEETS_INDEX,JSON.stringify({version:1,activeId:id,sheets:playerSheets}));}
 catch(e){console.warn(e);toast("Não foi possível registrar a seleção da ficha.");}
 syncFields();render();wizardPersist();save();
 window.scrollTo?.({top:0,behavior:"smooth"});
 toast("Ficha selecionada: "+(state.name||RACES[state.race]?.[0]||"Aprendiz")+".");
}
function createPlayerSheet(character=defaultState(),wizard={},label="Nova ficha"){
 if(NPC_MODE)return false;
 if(playerSheets.length>=40){toast("Limite de 40 fichas neste navegador. Exporte e exclua as que não usar.");return false;}
 if(activePlayerSheetId&&!save()){toast("Não foi possível salvar a ficha atual. Criação cancelada.");return false;}
 const next=normalize(character),id=playerSheetId();
 const previous=[...playerSheets],previousActive=activePlayerSheetId;
 const entry=playerSheetMeta(next,id);
 try{
  localStorage.setItem(playerSheetKey(id),JSON.stringify({schema:"codex-jogador-ficha-v1",character:next,wizard}));
  playerSheets.push(entry);activePlayerSheetId=id;
  localStorage.setItem(PLAYER_SHEETS_INDEX,JSON.stringify({version:1,activeId:id,sheets:playerSheets}));
 }catch(e){
  console.warn("Codex: armazenamento sem espaço para outra ficha",e);
  playerSheets=previous;activePlayerSheetId=previousActive;
  try{localStorage.removeItem(playerSheetKey(id));}catch(e){}
  toast("Não foi possível salvar outra ficha. Exporte suas fichas e libere espaço neste navegador.");renderPlayerSheets();
  return false;
 }
 state=next;resetPlayerView(wizard);syncFields();render();wizardPersist();save();
 window.scrollTo?.({top:0,behavior:"smooth"});
 toast(label+" criada. As outras fichas continuam salvas.");
 return true;
}
function deletePlayerSheet(){
 if(NPC_MODE||playerSheets.length<2)return;
 const name=state.name||RACES[state.race]?.[0]||"Aprendiz sem nome";
 if(!confirm('Excluir permanentemente a ficha "'+name+'"? Esta operação não pode ser desfeita. Exporte o JSON antes, se desejar preservá-la.'))return;
 const id=activePlayerSheetId;
 const next=playerSheets.find(x=>x.id!==id),payload=readPlayerSheet(next.id);
 if(!payload){toast("Não foi possível recuperar a outra ficha; exclusão cancelada.");return;}
 const previous=playerSheets;
 playerSheets=playerSheets.filter(x=>x.id!==id);activePlayerSheetId=next.id;
 try{localStorage.setItem(PLAYER_SHEETS_INDEX,JSON.stringify({version:1,activeId:next.id,sheets:playerSheets}));}
 catch(e){playerSheets=previous;activePlayerSheetId=id;toast("Erro ao salvar a lista. Exclusão cancelada.");return;}
 localStorage.removeItem(playerSheetKey(id));
 state=normalize(payload.character);resetPlayerView(payload.wizard||{});syncFields();render();wizardPersist();save();
 toast("Ficha excluída. As demais continuam disponíveis.");
}
function load(){
 let migrated=false,legacyAvailable=false,retiredSkillMigrated=false,racialGrantMigrated=false;
 const playerPayload=loadPlayerSheets();
 try{
  const saved=localStorage.getItem(SAVE_KEY);
  const oldRaw=localStorage.getItem(OLD_SAVE_KEY);
  legacyAvailable=!!oldRaw;
  if(playerPayload){
   const raw=playerPayload.character;
   racialGrantMigrated=raw.race==="lucker_puro"&&Array.isArray(raw.racialInitialAttributes)&&raw.racialInitialAttributes.includes("influencia");
   retiredSkillMigrated=Array.isArray(raw.skills)&&raw.skills.some(id=>RETIRED_PROTOTYPES.has(id));
   state=normalize(raw);
  }else if(saved){
   const raw=JSON.parse(saved);
   racialGrantMigrated=raw.race==="lucker_puro"&&Array.isArray(raw.racialInitialAttributes)&&raw.racialInitialAttributes.includes("influencia");
   retiredSkillMigrated=Array.isArray(raw.skills)&&raw.skills.some(id=>RETIRED_PROTOTYPES.has(id));
   state=normalize(raw);
  }
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
 try{restoreWizard(playerPayload?.wizard||JSON.parse(localStorage.getItem(WIZARD_KEY)||"{}"));}
 catch(e){restoreWizard({});}
 viewMode=state.creationLocked?"sheet":"builder";
 try{document.documentElement.dataset.theme=localStorage.getItem(THEME_KEY)==="light"?"light":"dark";}catch(e){}
 syncFields();render();
 if(!NPC_MODE&&!playerPayload){
  const id=playerSheetId();playerSheets=[playerSheetMeta(state,id)];activePlayerSheetId=id;
  if(!save())toast("Exporte sua ficha: armazenamento local indisponível.");
 }
 renderPlayerSheets();
 $("import-old-creator").hidden=!legacyAvailable;
 if(migrated||retiredSkillMigrated||racialGrantMigrated){
  // Persistir mudanças somente quando a ficha realmente precisou ser corrigida,
  // evitando repetir remoção/aviso sem necessidade. XP é recontado nas compras.
  save();
  toast(racialGrantMigrated?"Lucker Puro corrigido: Inteligência + Destreza G1 gratuitos; Influência manual preservada.":migrated?"Ficha do antigo criador migrada. Dados originais preservados; confira as anotações.":
   "Perícia descontinuada removida da ficha. XP investido liberado para redistribuição.");
 }
}
function normalize(v){
 const s=defaultState();
 if(!v||typeof v!=="object")return s;
 s.race=Object.hasOwn(RACES,v.race)?v.race:"humano";
 s.pureElement=PURE_ELEMENTS.some(([id])=>id===v.pureElement)?v.pureElement:"";
 s.runeElements=Array.isArray(v.runeElements)&&v.runeElements.length===2?
  v.runeElements.map(id=>RUNE_ELEMENTS.some(([k])=>k===id)?id:""):["",""];
 if(s.runeElements[0]===s.runeElements[1]&&s.runeElements[0])s.runeElements[1]="";
 s.perseverancaUsed=!!v.perseverancaUsed;
 for(const id of ["name","concept","origin","virtue","personality","notes"]){
  if(typeof v[id]==="string")s[id]=v[id].slice(0,id==="notes"?5000:100);
 }
 if(typeof v.portrait==="string"&&v.portrait.startsWith("data:image/")&&v.portrait.length<1600000)s.portrait=v.portrait;
 s.level=clamp(Math.floor(v.level||1),1,20);
 for(const group of Object.keys(GROUPS)){
  for(const [id] of GROUPS[group])s[SOURCE_PROPS[group]][id]=clamp(Math.floor(v[SOURCE_PROPS[group]]?.[id]||0),0,6);
 }
 const oldGrants=Array.isArray(v.racialInitialAttributes)?[...new Set(v.racialInitialAttributes)]:[];
 // v0.61 concedia Influência G1 indevidamente ao Lucker Puro. Corrigir SOMENTE
 // quando o marcador confirma que o G1 veio da origem; preservar Influência
 // comprada manualmente ou seus avanços G2+.
 const oldPureInfluence=s.race==="lucker_puro"&&oldGrants.includes("influencia");
 if(oldPureInfluence&&(s.attributes.influencia||0)===1)s.attributes.influencia=0;
 const newDexGrant=oldPureInfluence&&(s.attributes.destreza||0)<1;
 if(newDexGrant)s.attributes.destreza=1;
 s.racialInitialAttributes=oldGrants.filter(id=>racialStartingAttributes(s.race).includes(id)&&(s.attributes[id]||0)>0);
 if(newDexGrant)s.racialInitialAttributes.push("destreza");
 const rawSkills=Array.isArray(v.skills)?[...new Set(v.skills.filter(x=>typeof x==="string"))]:[];
 const legacyCost=(rawSkills.includes("aprendiz")?2:0)+(rawSkills.includes("magia")?1:0);
 const qualifiesForFocus=(s.practices.armas_conjuracao||0)>=1&&(s.attributes.inteligencia||0)>=1&&(s.practices.artesao||0)>=1;
 const shouldMigrateFocus=legacyCost>0&&qualifiesForFocus&&!rawSkills.includes("criar-item-foco-magia");
 const legacyDifference=legacyCost-(shouldMigrateFocus?1:0);
 const removed=[...RETIRED_PROTOTYPES].filter(id=>rawSkills.includes(id));
 s.skills=[...new Set(rawSkills.filter(x=>!RETIRED_PROTOTYPES.has(x)&&SKILLS.some(y=>y[0]===x&&Number.isInteger(y[3]))))];
 if(removed.length&&!s.notes.includes("Protótipos aposentados:")){
  s.notes=(s.notes+"\nProtótipos aposentados: "+removed.map(id=>id==="marciais"?"Artes Marciais":id==="combinacao"?"Combinação de Fontes":"Perito Conjurador").join(" e ")+
   ". XP liberado automaticamente pela retirada; habilidades antigas não são concedidas sem requisitos.").trim().slice(0,5000);
 }
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
  s.creationBudgetSnapshot=saved&&["attr","training","skills"].every(k=>Number.isInteger(saved[k])&&saved[k]>=0&&saved[k]<=CREATE_BUDGET.total)?
   {attr:saved.attr,training:saved.training,skills:saved.skills}:
   {attr:used.attr,training:used.training,skills:used.skills};
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
 // Migração idempotente: peças G1 do catálogo padrão 10/15/20 -> 7/12/17;
 // abate 3 do saldo para conservar dano sofrido, sem reescrever armaduras personalizadas.
 s.items=Array.isArray(v.items)?v.items.slice(0,150).map(raw=>{
  const item=normalizeItem(raw);
  const old={"Armadura Leve":10,"Armadura Média":15,"Armadura Pesada":20};
  if(item.type==="armadura"&&item.grade===1&&item.catalogId==="Roupas Simples"&&item.max===0){
   // Anteriormente não havia Integridade; G1 agora tem 3. Item de catálogo apenas.
   item.max=3;item.hp=3;
  }
  const previous=old[item.catalogId];
  if(item.type==="armadura"&&item.grade===1&&previous&&item.max===previous){
   item.max=previous-3;item.hp=Math.min(item.max,Math.max(0,item.hp-3));
  }
  return item;
 }):[];
 const rawTrade=v.trade&&typeof v.trade==="object"?v.trade:null;
 s.trade=tradeDefault();
 if(rawTrade){
  s.trade.resources=Object.fromEntries(RESOURCES.map(([k])=>[k,clamp(Math.floor(rawTrade.resources?.[k]||0),0,100000)]));
   s.trade.collected=!!rawTrade.collected;
  // Valores introduzidos pela mesa: experimentais; sem preço oficial presumido.
  const raw=rawTrade.stonePrices?.common;
  const B=raw===null||raw===undefined||raw===""?null:clamp(Math.floor(raw),1,3333);
  s.trade.stonePrices.common=B;s.trade.stonePrices.rare=B===null?null:3*B; // Proporção homologada; preservar preços de compras históricas.
  s.trade.stones=Array.isArray(rawTrade.stones)?rawTrade.stones.slice(0,150)
   .filter(x=>x&&STONE_CATALOG.some(row=>row[0]===x.element))
   .map(x=>({element:x.element,price:clamp(Math.floor(x.price||0),0,10000)})):[];
  s.trade.purchases=Array.isArray(rawTrade.purchases)?rawTrade.purchases.slice(0,150).filter(x=>x&&typeof x.name==="string")
   .map(x=>({name:x.name.slice(0,90),price:clamp(Math.floor(x.price||0),0,99999)})):[];
 }
 s.elementalCrystal={element:String(v.elementalCrystal?.element||"").slice(0,30),
  quantity:clamp(Math.floor(v.elementalCrystal?.quantity??(ownsSkill("criar-item-foco-magia",s)?1:0)),0,1)};
 for(const item of s.items)if(item.equipped&&item.type==="armadura"&&!canEquipArmor(s,item))item.equipped=false;
 s.history=Array.isArray(v.history)?v.history.slice(0,20):[];
 s.courageUsedTurn=!!v.courageUsedTurn;
 // Protótipo hemomântico manual: rastrear derramamento e extração separadamente, somar UMA vez por ocorrência.
 s.hemomancy={
  spilled:clamp(Math.floor(v.hemomancy?.spilled??0),0,999),
  extracted:clamp(Math.floor(v.hemomancy?.extracted??0),0,999),
  selfBleeding:!!v.hemomancy?.selfBleeding,
  usedThisTurn:!!v.hemomancy?.usedThisTurn
 };
 if(v.pending&&Array.isArray(v.pending.dice)&&Array.isArray(v.pending.selected)&&v.pending.dice.length<=9){
  s.pending={...v.pending,selected:v.pending.selected.filter(x=>typeof x==="string")};
 }
 return s;
}
function normalizeItem(it={}){
 const type=["arma","armadura","escudo","foco","ferramenta","outro"].includes(it.type)?it.type:"outro";
 const grade=clamp(Math.floor(it.grade??1),1,4),qty=clamp(Math.floor(it.qty??1),1,99);
 const weight=Object.hasOwn(WEIGHTS,it.weight)?it.weight:"leve";
 const max=clamp(Math.floor(it.max??0),0,999);
 return {id:String(it.id||getId()).slice(0,80),name:String(it.name||"Item sem nome").slice(0,90),
  type,weight,grade,qty,max,hp:clamp(Math.floor(it.hp??max),0,max),equipped:!!it.equipped,
  elementalResistance:String(it.elementalResistance||"").slice(0,70),
  secondResistance:String(it.secondResistance||"").slice(0,70),specificImmunity:String(it.specificImmunity||"").slice(0,70),
  g4ElementalMode:it.g4ElementalMode==="immunity"?"immunity":"resistances",
  catalogId:String(it.catalogId||"").slice(0,90),category:String(it.category||"").slice(0,20),
  die:[6,10,12].includes(Number(it.die))?Number(it.die):0,range:clamp(Math.floor(it.range||0),0,1000),
  priceVT:clamp(Math.floor(it.priceVT||0),0,10000),
  properties:Array.isArray(it.properties)?it.properties.filter(x=>typeof x==="string").slice(0,6):[],
  firearm:!!it.firearm,element:String(it.element||"").slice(0,40),
  durability:clamp(Math.floor(it.durability||0),0,999),durabilityMax:clamp(Math.floor(it.durabilityMax||0),0,999)}; // Campo legado preservado, não concede proteção na nova regra.
}
function save(){
 try{
  if(NPC_MODE||!activePlayerSheetId){
   localStorage.setItem(SAVE_KEY,JSON.stringify(state));
  }else{
   const entry=playerSheets.find(x=>x.id===activePlayerSheetId);
   if(!entry)throw Error("Personagem sem entrada no índice");
   const updated=playerSheetMeta(state,entry.id,entry.createdAt);
   localStorage.setItem(playerSheetKey(entry.id),JSON.stringify({
    schema:"codex-jogador-ficha-v1",character:state,wizard:wizardSnapshot()}));
   Object.assign(entry,updated);
   localStorage.setItem(PLAYER_SHEETS_INDEX,JSON.stringify({version:1,activeId:activePlayerSheetId,sheets:playerSheets}));
   renderPlayerSheets();
  }
  $("save-indicator").textContent="Salvo neste navegador";
  return true;
 }catch(e){
  $("save-indicator").textContent="Não foi possível salvar; exporte a ficha.";
  console.warn("Codex: falha ao persistir ficha",e);
  return false;
 }
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800);}
// SRD v0.47: quatro estados; Vigor e a contribuição histórica de Força
// repartem pontos extras alternadamente entre Saudável e Ferido.
const LIFE_STATES={
 saudavel:{id:"saudavel",label:"Saudável",e:0,a:0,p:0,coragem:0},
 ferido:{id:"ferido",label:"Ferido",e:0,a:-1,p:0,coragem:0},
 incapacitado:{id:"incapacitado",label:"Incapacitado",e:-1,a:0,p:1,coragem:1},
 inconsciente:{id:"inconsciente",label:"Inconsciente",e:-2,a:0,p:2,coragem:2},
 morto:{id:"morto",label:"Morto",e:0,a:0,p:0,coragem:Infinity}
};
function lifeBands(s=state){
 const vigor=Math.max(0,Math.floor(s.attributes.vigor||0));
 const forca=Math.max(0,Math.floor(s.attributes.forca||0));
 const extras=vigor+Math.floor(forca/2);
 return [1+Math.ceil(extras/2),1+Math.floor(extras/2),1,1];
}
function maxLife(s=state){return lifeBands(s).reduce((n,k)=>n+k,0);}
function lifeStage(s=state){
 const bands=lifeBands(s),life=clamp(s.life,0,maxLife(s));
 const id=life===0?"morto":life===1?"inconsciente":life===2?"incapacitado":life<=2+bands[1]?"ferido":"saudavel";
 return {...LIFE_STATES[id],bands,life};
}
function maxPP(l=state.level){return l>=20?3:l>=10?2:l>=5?1:0;}
function rawCreationCosts(s=state){
 return {attr:A.reduce((n,[k])=>n+racialCostTable("attr",k,s)[s.attributes[k]||0],0),
  training:K.reduce((n,[k])=>n+racialCostTable("know",k,s)[s.knowledges[k]||0],0)+P.reduce((n,[k])=>n+racialCostTable("practice",k,s)[s.practices[k]||0],0),
  skills:s.skills.reduce((n,id)=>n+(SKILLS.find(x=>x[0]===id)?.[3]||0),0)};
}
function unusedInitialXP(spent){return Math.max(0,CREATE_BUDGET.total-(spent.attr+spent.training+spent.skills));}
function xpCosts(s=state){
 const spent=rawCreationCosts(s),attributes=spent.attr,training=spent.training,skills=spent.skills,total=attributes+training+skills;
 const initialCarryover=s.creationLocked&&s.creationBudgetSnapshot?unusedInitialXP(s.creationBudgetSnapshot):
  Math.max(0,CREATE_BUDGET.total-total);
 const free=s.creationLocked?CREATE_BUDGET.total+(s.xpEarned||0)+(s.legacyXPRefund||0)-total:CREATE_BUDGET.total-total;
 const generalSpent=Math.max(0,total-CREATE_BUDGET.total);
 return {attributes,training,skills,total,generalSpent,free,initialCarryover,
  initialRemaining:Math.max(0,initialCarryover-generalSpent),
  evolutionRemaining:Math.max(0,(s.xpEarned||0)+(s.legacyXPRefund||0)-generalSpent)};
}
function hasStarterSources(s=state){
 return A.some(([k])=>Number(s.attributes[k]||0)>=1)&&
  (K.some(([k])=>Number(s.knowledges[k]||0)>=1)||P.some(([k])=>Number(s.practices[k]||0)>=1));
}
function lockCreation(){
 if(state.creationLocked)return 0;
 if(!hasStarterSources()||xpCosts().free<0||!raceChoicesComplete())return null;
 const spent=rawCreationCosts(state);
 state.creationBudgetSnapshot={attr:spent.attr,training:spent.training,skills:spent.skills};
 state.creationLocked=true;
 return unusedInitialXP(state.creationBudgetSnapshot);
}
function xpStepCost(group,k,delta){
 const table=racialCostTable(group,k,state),field=SOURCE_PROPS[group];
 const g=state[field][k]||0,next=clamp(g+delta,0,6);
 return Math.max(0,table[next]-table[g]);
}
function canAfford(group,cost){return Number.isFinite(cost)&&cost>=0&&xpCosts().free>=cost;}
function skillReq(id,s=state){
 if(racialGrants(s).includes(id))return null;
 const has=x=>ownsSkill(x,s);
 if(id==="invocacao-elemental"&&(!has("criar-item-foco-magia")||!has("domar-criatura-pequena")))
  return"Requer Criar Item de Foco e Magia e Domar Criatura Pequena. O próprio foco habilita Psique; os demais elementos exigem suas Perícias.";
 if(id==="domar-criatura-media"&&!has("domar-criatura-pequena"))return"Requer a Perícia Domar Criatura Pequena antes de comprar Domar Criatura Média.";
 if(id==="domar-criatura-grande"&&(!has("domar-criatura-pequena")||!has("domar-criatura-media")))
  return"Requer Domar Criatura Pequena e Domar Criatura Média antes de comprar Domar Criatura Grande.";
 if((id==="domar-criatura-media"||id==="domar-criatura-grande")&&((s.attributes.influencia||0)<(id==="domar-criatura-media"?3:4)||(s.attributes.inteligencia||0)<1||(s.practices.apresentacao||0)<1))return"Requer Influência "+(id==="domar-criatura-media"?3:4)+", Inteligência 1 e Apresentação 1.";
 if(id==="domar-criatura-pequena"&&((s.attributes.influencia||0)<2||(s.attributes.inteligencia||0)<1||(s.practices.apresentacao||0)<1))return"Requer Influência 2, Inteligência 1 e Apresentação 1.";
 if(id==="pericia-druidica" && ((s.attributes.influencia||0)<2 || !["criar-item-foco-magia","domar-criatura-pequena","domar-criatura-media","domar-criatura-grande","terra"].every(has)))return"Compra única de 2 XP habilita os três Graus; exige Influência 2, Criar Item de Foco e Magia, Perícia em Elemento Terra e Domar Criatura Pequena, Média e Grande. Domar Pequena, Média e Grande podem ser compradas com 1 XP cada, respeitando seus requisitos.";

 const disc=s.practices.armas_conjuracao||0;
 const strength=s.attributes.forca||0,dex=s.attributes.destreza||0,agi=s.attributes.agilidade||0,vig=s.attributes.vigor||0;
 const meleeSpecialty=["armas-leves","armas-medias","armas-pesadas","maestria-manejo-duplo","pugilismo"].some(has);
 const rangedSpecialty=has("armas-longo-alcance")||has("maestria-arremesso-armas");
 const intelligence=s.attributes.inteligencia||0,art=s.practices.artesao||0,alch=s.knowledges.alquimia||0,med=s.knowledges.medicina||0,stealth=s.practices.furtividade||0;
 if(id==="armas-longo-alcance"&&(disc<1||dex<2))return"Requer Disciplina 1 e Destreza 2.";
 if(id==="olhos-de-aguia"&&(dex<3||disc<3||!(has("armas-longo-alcance")||has("armas-fogo"))))return"Requer Destreza 3, Disciplina 3 e Armas de Longo Alcance OU Armas de Fogo.";
 if(id==="armas-fogo"&&(disc<2||dex<2))return"Requer Disciplina 2 e Destreza 2.";
 if(id==="disparo-fulminante"&&(disc<2||dex<2||strength<1||!rangedSpecialty))return"Requer Disciplina 2, Destreza 2, Força 1 e Armas Longo Alcance OU Arremesso.";
 if(id==="disparo-multiplo"&&(disc<2||dex<2||agi<2||!has("disparo-fulminante")||!rangedSpecialty))return"Requer Disciplina 2, Destreza 2, Agilidade 2, Disparo Fulminante e Longo Alcance OU Arremesso.";
 if(id==="disparo-violento"&&(disc<2||dex<2||!(strength>=2||(strength>=1&&(s.practices.atletismo||0)>=1))||!rangedSpecialty))return"Requer Disciplina 2, Destreza 2, Força 2 OU Força 1 + Atletismo 1, Longo Alcance OU Arremesso.";
 if(id==="disparo-tatico")return"Regras, requisitos e XP pendentes.";
 if(id==="golpe-baixo"&&(dex<2||strength<1||agi<1))return"Requer Destreza 2, Força 1 e Agilidade 1.";
 if(id==="furtividade"&&(stealth<2||dex<2||agi<1))return"Requer Furtividade 2, Destreza 2 e Agilidade 1.";
 if(id==="furtividade-avancada"&&(stealth<2||!has("furtividade")))return"Requer Furtividade 2 e Perícia em Furtividade.";
 if(id==="criar-veneno"&&(art<1||intelligence<2||alch<2||med<2))return"Requer Artesão 1, Inteligência 2, Alquimia 2 e Medicina 2.";
 // IDs antigos das Perícias renomeadas preservados para compatibilidade de fichas salvas.
 if(id==="armas-leves"&&disc<1)return"Requer Disciplina 1.";
 if(id==="armas-medias"&&(disc<1||strength<1))return"Requer Disciplina 1 e Força 1.";
 if(id==="armas-pesadas"&&(disc<2||strength<2))return"Requer Disciplina 2 e Força 2.";
 if(id==="disciplina-avancada"&&disc<2)return"Requer Disciplina 2.";
 if(id==="concentracao-refinada"&&disc<2)return"Requer Disciplina 2.";
 if(id==="criar-item-foco-magia"&&(disc<1||(s.attributes.inteligencia||0)<1||art<1))return"Requer Disciplina 1, Inteligência 1 e Artesão 1.";
 if(["vento","agua","terra","fogo"].includes(id)&&(disc<1||(s.attributes.inteligencia||0)<1||!has("criar-item-foco-magia")))return"Requer Disciplina 1, Criar Item de Foco e Magia e Inteligência 1.";
 if(id==="sagrado"&&(disc<2||(s.attributes.inteligencia||0)<2||!has("criar-item-foco-magia")))return"Requer Disciplina 2, Criar Item de Foco e Magia e Inteligência 2.";
 if(id==="escudo-arcano"&&((s.attributes.inteligencia||0)<2||vig<1||!has("criar-item-foco-magia")))return"Requer Inteligência 2, Vigor 1 e Criar Item de Foco e Magia.";
 if(id==="conjuracao-equilibrada"&&(disc<2||(s.attributes.inteligencia||0)<2||dex<2||!has("criar-item-foco-magia")))return"Requer Disciplina 2, Criar Item de Foco e Magia, Inteligência 2 e Destreza 2.";
 if(id==="golpe-fulminante"&&(disc<2||strength<2||!meleeSpecialty))return"Requer Disciplina 2, Força 2 e especialização corpo a corpo (Armas Leves/Médias/Pesadas, Manejo Duplo ou Pugilismo). Perícia em Arremesso não habilita este golpe.";
 if(id==="espalhar-golpe"&&(disc<2||dex<1||agi<1||!has("golpe-fulminante")||!meleeSpecialty))return"Requer Disciplina 2, Destreza 1, Agilidade 1, Golpe Fulminante e especialização corpo a corpo.";
 if(id==="pugilismo"&&(disc<1||strength<2||dex<1))return"Requer Disciplina 1, Força 2 e Destreza 1.";
 if(id==="artista-marcial"&&(disc<2||dex<2||!has("pugilismo")))return"Requer Disciplina 2, Destreza 2 e Pugilismo.";
 if(id==="maestria-arremesso-armas"&&(!["armas-leves","armas-medias","armas-pesadas"].some(has)||strength<2||dex<2||agi<1))return"Requer Armas Leves OU Médias OU Pesadas, Força 2, Destreza 2 e Agilidade 1.";
 if(["recuperacao-vigorosa","instinto-sobrevivencia"].includes(id)&&vig<3)return"Requer Vigor 3; custo XP pendente.";
 if(id==="recuperacao-movimento"&&(vig<6||!has("recuperacao-vigorosa")))return"Requer Recuperação Vigorosa e Vigor 6; custo XP pendente.";
 if(id==="manejo-perfeito")return"Requer Disciplina Avançada e Destreza 2; XP e Golpe Certo pendentes.";
 if(id==="maestria-manejo-duplo"&&(strength<2||dex<2||agi<1||!has("disciplina-avancada")||!["armas-leves","armas-medias","armas-pesadas","maestria-arremesso-armas","armas-fogo","armas-longo-alcance"].some(has)))return"Requer Força 2, Destreza 2, Agilidade 1, Disciplina Avançada e especialização de armas.";
 if(id==="arma-certa")return"Custo de XP e requisitos definitivos ainda pendentes.";

 if(id==="montar"&&(s.attributes.influencia||0)<2)return"Requer Influência grau 2.";
 if(id==="provocacao-sofisticada"&&(s.attributes.influencia||0)<2)return"Requer Influência grau 2.";
 if(id==="improviso"&&(disc<1||(s.attributes.inteligencia||0)<1||dex<1||!has("criar-item-foco-magia")))return"Requer Disciplina 1, Inteligência 1, Destreza 1 e Criar Item de Foco e Magia.";
 if(id==="mestre"&&(disc<3||(s.attributes.inteligencia||0)<3||dex<3||!has("criar-item-foco-magia")||!has("improviso")||!["vento","sangue","agua","fogo","terra","veneno","sagrado","trevas"].some(has)))return"Requer Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e uma Perícia elemental.";
 if(["sangue","trevas"].includes(id)&&(disc<2||(s.attributes.inteligencia||0)<2||!has("criar-item-foco-magia")))return"Requer Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia.";
 if(id==="veneno"&&(disc<2||(s.attributes.inteligencia||0)<2||(s.knowledges.alquimia||0)<2||(s.knowledges.medicina||0)<2))return"Requer Disciplina 2, Inteligência 2, Alquimia 2 e Medicina 2.";
 if(id==="criar-antidoto"&&((s.practices.artesao||0)<1||(s.attributes.inteligencia||0)<2||(s.knowledges.alquimia||0)<2||(s.knowledges.medicina||0)<2||!has("criar-veneno")))return"Requer Artesão 1, Inteligência 2, Alquimia 2, Medicina 2 e Criar Veneno.";
 if(id==="transfusao-sanguinaria"&&(!has("transfusao")||!has("sangue")))
  return"Requer Transfusão e Perícia em Elemento Sangue. Transfusão original ainda tem aquisição pendente.";
 if(id==="transfusao")return"Compra ainda pendente de custo ou regras de aquisição.";
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
 $("lock-creation").disabled=state.creationLocked||!!state.pending||x.free<0||!hasStarterSources()||!raceChoicesComplete();
 $("lock-creation").textContent=state.creationLocked?"Criação concluída ✓":"Concluir criação";
 $("level-up").disabled=state.level>=20||!!state.pending||x.free<0;
 $("xp-award").disabled=!!state.pending||(state.xpEarned||0)>=MAX_EARNED_XP;
 $("xp-next-level").textContent=state.level>=20?"Nível máximo":XP_LEVEL_REFERENCE[state.level+1]+" XP*";
 for(const [type,used,id] of [["attr",x.attributes,"xp-attr"],["training",x.training,"xp-training"],["skills",x.skills,"xp-skill"]]){
  const cap=CREATE_BUDGET.total;
  $(id+"-caption").textContent=used+" XP (orçamento global: "+CREATE_BUDGET.total+" XP)";
  const bar=$(id+"-bar");bar.style.width=Math.min(100,used/cap*100)+"%";bar.classList.toggle("over",used>cap);
 }
 $("xp-feedback").textContent=x.free<0?"Saldo excedido. Reduza investimentos para respeitar o orçamento total.":
 "18 XP iniciais compartilhados; referência experimental: até "+XP_LEVEL_REFERENCE[20]+" XP totais no nível 20 ("+MAX_EARNED_XP+" XP de evolução). "+x.total+" investidos, "+x.free+" disponíveis. "+
  ((state.xpEarned||0)>MAX_EARNED_XP?"Ficha legada acima do teto: XP preservado, novas concessões bloqueadas. ":"")+
  (editMode?"Edição: correções dependem do Narrador.":"Os requisitos individuais permanecem válidos.");
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
// Todo modificador da armadura equipada vale para a DE de QUALQUER defesa.
// Teto da DE natural: 9. Teto absoluto após modificadores: 12.
function deDefense(s=state){
 return Math.min(12,Math.max(0,deNatural(s)+armorDodgeBonus(s)-armorDePenalty(s)));
}
function deDodge(s=state){return deDefense(s);} // Esquiva não recebe um segundo bônus.
function defensePresentation(s=state){
 const natural=deNatural(s),total=deDefense(s),bonus=armorDodgeBonus(s),penalty=armorDePenalty(s);
 const armor=equippedArmor(s);
 const type=armor?({muito_leve:"Muito Leve",leve:"Leve",medio:"Média",alto:"Pesada",extremo:"Muito Pesada"}[armor.weight]||armor.name):null;
 const modifier=bonus-penalty;
 return {label:"DE DEFENSIVA",value:total,caption:armor?
  "DE natural "+natural+" "+(modifier>=0?"+ ":"− ")+Math.abs(modifier)+" (armadura "+type+") = "+total+" · Vale para todas as defesas · Teto 12":
  "DE natural "+natural+" · Teto natural 9 · Teto total 12 com modificadores"};
}
function capacity(){return 1+Math.floor((state.attributes.forca||0)/3)+Math.floor((state.attributes.vigor||0)/3)+Math.floor((state.practices.armas_conjuracao||0)/3)+Math.floor((state.practices.atletismo||0)/3);}
function itemLoad(it){return WEIGHTS[it.weight][1]*it.qty*((it.properties||[]).includes("Muito Leve")?0.5:1);}
function loadUsed(){return state.items.reduce((n,it)=>n+itemLoad(it),0)+resourceWeight(); /* Recursos de troca também ocupam Carga. */}
function loadPercent(){return 100*loadUsed()/Math.max(1,capacity());}
function balance(){if(NPC_MODE)return "Pendente";const p=loadPercent();return p<25?"Muito Leve":p<50?"Leve":p<75?"Médio":p<100?"Pesado":"Muito Pesado";}
function loadBlocksMarkup(){
 const p=loadPercent(),over=p>=100;
 return Array.from({length:20},(_,i)=>{
  const fill=Math.max(0,Math.min(100,(p-i*5)*20));
  return '<span class="fp-load-block'+(over?' over':'')+'" style="--fp-fill:'+fill.toFixed(2)+'%" aria-hidden="true"></span>';
 }).join("");
}
// Mapa visual: cada célula equivale a 0,05 Alto (ilustrativo, sem novos limites por slots).
// Capacidade e carga continuam sendo calculadas pelas funções oficiais acima.
const CARGO_CELL_ALTO=0.05;
const CARGO_TYPES=new Set(["arma","armadura","escudo","foco"]);
function cargoCapacitySources(){
 const sources=[
  ["Base",null,1],["Força",state.attributes.forca||0,0],
  ["Vigor",state.attributes.vigor||0,0],
  ["Disciplina",state.practices.armas_conjuracao||0,0],
  ["Atletismo",state.practices.atletismo||0,0]
 ];
 return sources.map(([name,grade,base])=>({name,grade,gain:grade===null?base:Math.floor(grade/3)}));
}
function cargoCapacitySourcesMarkup(){
 return cargoCapacitySources().map(src=>
  '<div class="fp-capacity-source"><small>'+esc(src.name)+(src.grade===null?'':' G'+src.grade)+'</small><strong>+'+src.gain+' Alto</strong></div>'
 ).join("");
}
function cargoGridMarkup(){
 const cellCount=capacity()*20;
 const items=state.items.map(it=>({
  name:it.name||"Item sem nome",amount:itemLoad(it),
  kind:CARGO_TYPES.has(it.type)?it.type:"outro"
 })).filter(it=>it.amount>0);
 const resource=resourceWeight();
 if(resource>0)items.push({name:"Recursos físicos de troca",amount:resource,kind:"recurso"});
 let cursor=0;
 const intervals=items.map(it=>{
  const entry={...it,start:cursor,end:cursor+it.amount};
  cursor=entry.end;
  return entry;
 });
 return Array.from({length:cellCount},(_,i)=>{
  const start=i*CARGO_CELL_ALTO,end=start+CARGO_CELL_ALTO;
  const filled=intervals.map(it=>{
   const covered=Math.max(0,Math.min(it.end,end)-Math.max(it.start,start));
   if(covered<1e-9)return "";
   const width=Math.min(100,covered/CARGO_CELL_ALTO*100).toFixed(4);
   return '<span class="fp-cargo-part fp-cargo-part-'+it.kind+'" style="width:'+width+'%" title="'+
     esc(it.name)+' · '+pad(it.amount)+' Alto"></span>';
  }).join("");
  return '<div class="fp-cargo-cell" aria-hidden="true">'+filled+'</div>';
 }).join("");
}
function keepLimit(extra=false){return Math.min(4,(state.level>=6?3:2)+(extra?1:0));}
function face(sides,number){return FACES[sides]?.[number-1]||[0,0,0];}
function dataDice(g,grade){return [...(g==="attr"?DICE_ATTR:DICE_FORM)[grade||0]];}
function mentalSlotCapacity(s=state){
 // DEFINIDO: cada Grau investido em Disciplina vale 1 ponto de capacidade mental.
 // A quantidade de dados da rolagem não altera essa capacidade.
 return clamp(Math.floor(s.practices.armas_conjuracao||0),0,6);
}
function label(g,k){
 if(g==="equipment")return k;
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
 const race=$("char-race");if(race)race.value=state.race;
 for(const [id,key] of [["char-name","name"],["char-concept","concept"],["char-virtue","virtue"],["char-personality","personality"],["char-notes","notes"]]){
  $(id).value=state[key];
 }
 $("char-level").value=state.level;
 $("portrait-image").src=state.portrait||"../assets/codex-logo.svg";
 $("portrait-trigger").classList.toggle("fp-has-portrait",!!state.portrait);
}

function raceOptions(list,value){return '<option value="">Escolha o elemento</option>'+list.map(([id,n])=>'<option value="'+id+'"'+(id===value?' selected':'')+'>'+n+'</option>').join("");}
function raceForm(){
 return '<label class="fp-wiz-field">Origem / Raça<select data-race-select aria-label="Origem / Raça">'+
  Object.entries(RACES).map(([id,v])=>'<option value="'+id+'"'+(id===state.race?' selected':'')+'>'+v[0]+'</option>').join("")+
  '</select></label>';
}
function raceBenefitsForm(){
 const c=RACES[state.race]||RACES.humano;
 const free=racialStartingAttributes(state.race).map(id=>A.find(([k])=>k===id)?.[1]||id);
 const sources=free.length?'<p><strong>Grau 1 de origem (0 XP): '+esc(free.join(" + "))+'</strong>. Outros Atributos devem ser comprados.</p>':'<p>Nenhum Atributo concedido automaticamente nesta raça.</p>';
 const extras=racialExtraG1(),repair=extras.length?
  '<div><p>Há '+extras.length+' Atributo(s) extra(s) em G1. Eles não são benefícios automáticos desta raça; podem ser compras ou resíduos de fichas anteriores.</p><button type="button" class="fp-secondary" data-action="wizard-racial-repair">Revisar graus extras</button></div>':"";
 const pure=state.race==="lucker_puro"?'<label class="fp-wiz-field">Elemento inicial<select data-race-element="pure">'+raceOptions(PURE_ELEMENTS,state.pureElement)+'</select></label>':'';
 const rune=state.race==="runa_espinhos"?[0,1].map(i=>'<label class="fp-wiz-field">Elemento '+(i+1)+'<select data-race-element="rune-'+i+'">'+raceOptions(RUNE_ELEMENTS,state.runeElements[i])+'</select></label>').join(""):'';
 return pure+rune+'<div class="fp-wiz-reminder fp-wiz-race-info"><b>'+c[0]+'</b><p>'+c[1]+'</p><p>'+c[2]+'</p>'+sources+'<p>Benefícios raciais em Perícias não concedem outros Graus; graus superiores seguem a tabela.</p>'+repair+'</div>';
}
function changeRace(id){
 if(!Object.hasOwn(RACES,id)||state.creationLocked||state.pending||id===state.race)return;
 const old=state.race,candidate=structuredClone(state);
 // A seleção "Começar com" é específica da origem em que foi escolhida.
 // Desfazer somente esse investimento G1 registrado pelo assistente.
 if(wizardStarterPurchased&&(candidate.attributes[wizardStarterPurchased]||0)===1&&
    !racialStartingAttributes(old).includes(wizardStarterPurchased))
  candidate.attributes[wizardStarterPurchased]=0;
 candidate.race=id;candidate.pureElement="";candidate.runeElements=["",""];
 // Nunca preservar a escolha do assistente entre origens: esse era o vazamento
 // Runa→Sangue (Força) e Sangue→Puro (Agilidade).
 applyRacialStartingAttributes(candidate);
 const duplicate=candidate.skills.some(key=>racialGrants(candidate).includes(key));
 const blocked=dependentsValid(candidate);
 if(duplicate||blocked||xpCosts(candidate).free<0){
  toast(duplicate?"Perícia já comprada: devolva-a antes de recebê-la gratuitamente pela origem.":blocked||"XP insuficiente para a nova linhagem.");
  render();return;
 }
 state=candidate;
 wizardStarterAttribute="";wizardStarterPurchased="";wizardStarterTraining="";
 wizardStarterPhase="attr";wizardStep=0;wizardReached=0;
 if(ownsSkill("criar-item-foco-magia")){
  if(!state.elementalCrystal.quantity){state.elementalCrystal.quantity=1;state.elementalCrystal.element="";}
 }else if(old==="lucker_puro"||old==="runa_espinhos"){
  state.elementalCrystal.quantity=0;state.elementalCrystal.element="";
 }
 geneDraft.clear();genePendingSkills.clear();geneSelected="attr:"+(racialStartingAttributes(id)[0]||"forca");
 render();wizardPersist();save();
}
function racialExtraG1(s=state){
 const favored=new Set(racialStartingAttributes(s.race));
 return A.filter(([id])=>!favored.has(id)&&(s.attributes[id]||0)===1);
}
function repairRacialG1(){
 if(state.creationLocked||state.pending)return;
 const extras=racialExtraG1();
 if(!extras.length){toast("Nenhum Grau 1 adicional encontrado.");return;}
 const names=extras.map(([,name])=>name).join(", ");
 if(!confirm("Revisar os Graus 1 adicionais desta ficha?\\n\\nSerão removidos: "+names+
  ".\\n\\nAtenção: o sistema não consegue distinguir em fichas antigas uma compra manual de um Grau residual de outra raça. Se algum desses Graus foi comprado intencionalmente, CANCELE e não use esta correção. Graus 2+ serão mantidos."))
  return;
 const candidate=structuredClone(state);
 for(const [id] of extras)candidate.attributes[id]=0;
 const blocked=dependentsValid(candidate);
 if(blocked){toast("Limpeza cancelada: "+blocked);return;}
 state=candidate;
 wizardStarterAttribute="";wizardStarterPurchased="";wizardStarterTraining="";
 wizardStarterPhase="attr";wizardStep=0;wizardReached=0;
 geneDraft.clear();genePendingSkills.clear();
 render();wizardPersist();save();
 toast("Graus 1 adicionais removidos. Apenas os da origem continuam automáticos.");
}
function changeRaceElement(key,value){
 if(state.creationLocked||state.pending)return;
 const oldPure=state.pureElement,oldRune=[...state.runeElements];
 if(key==="pure"&&state.race==="lucker_puro"&&(value===""||PURE_ELEMENTS.some(([id])=>id===value)))state.pureElement=value;
 else if(/^rune-[01]$/.test(key)&&state.race==="runa_espinhos"&&(value===""||RUNE_ELEMENTS.some(([id])=>id===value)))state.runeElements[Number(key.slice(-1))]=value;
 else return;
 const duplicated=state.skills.some(id=>racialGrants(state).includes(id));
 if(duplicated||dependentsValid(state)||(state.runeElements[0]&&state.runeElements[0]===state.runeElements[1])){
  state.pureElement=oldPure;state.runeElements=oldRune;toast("Elementos devem ser diferentes e não podem duplicar compras.");render();return;
 }
 render();save();
}
function renderRacePanel(){
 const select=$("char-race"),info=$("race-description"),panel=$("race-benefit-panel"),c=RACES[state.race]||RACES.humano;
 if(select)select.value=state.race;
 if(info)info.textContent=c[1]+" "+c[2]+" "+raceCaution();
 if(!panel)return;
 const names=racialGrants(state).map(id=>SKILLS.find(row=>row[0]===id)?.[1]||id);
 panel.innerHTML='<strong>'+c[0]+'</strong><p>'+c[1]+'</p>'+(names.length?'<p>Perícias raciais gratuitas: '+esc(names.join(", "))+'.</p>':'')+
 (raceCaution()?'<p>XP PENDENTE: '+esc(raceCaution())+'</p>':'')+
 (state.race==="humano"?'<p>Perseverança Humana: <strong>'+(state.perseverancaUsed?'Usada':'Disponível')+'</strong> (1 rerrolagem/teste por descanso longo).</p>'+
 '<button type="button" data-action="human-reroll-use"'+(state.perseverancaUsed?' disabled':'')+'>Marcar uso</button> '+
 '<button type="button" data-action="human-long-rest"'+(!state.perseverancaUsed?' disabled':'')+'>Descanso longo</button>'+
 '<p><small>Controle manual; esta interface ainda não refaz a rolagem automaticamente.</small></p>':'');
}

function renderDiceLegend(){
 $("dice-legend").innerHTML=[4,6,10,12,20].map(n=>'<span class="fp-die-badge fp-die-d'+n+'">'+dieIcon(n)+'<b>d'+n+'</b></span>').join("");
}

/* Pós-criação: páginas separadas para jogar, evoluir, Codex Genético e inventário. */
const ELEMENT_SKILLS=[["fogo","Fogo"],["agua","Água"],["vento","Ar"],["terra","Terra"],["sagrado","Sagrado"],["veneno","Veneno"],["sangue","Sangue"],["trevas","Trevas"]];
function applySheetPage(){
 const show=viewMode==="sheet"&&!!state.creationLocked;
 const nav=$("sheet-navigation");if(!nav)return;
 nav.hidden=!show;
 const chosen=sheetPage;
 const isEvolve=chosen==="evolution",isInv=chosen==="inventory",isGene=chosen==="genetic",isPlay=chosen==="play";
 $("play-talents").hidden=!show||!isPlay;
 $("genetic-view").hidden=!show||!isGene;
 $("progressao").hidden=!show||!isEvolve;
 $("pericias").hidden=true; // O catálogo fica na página Codex Genético, não na tela de XP.
 $("equipamentos").hidden=!show||!isInv;
 document.querySelector(".fp-workspace").hidden=!show||!(isPlay||isEvolve&&editMode);
 document.querySelector(".fp-lower").hidden=!show||!isInv;
 document.body.classList.toggle("fp-evolution-mode",show&&isEvolve);
 document.body.classList.toggle("fp-editing-sources",show&&isEvolve&&editMode);
 for(const b of nav.querySelectorAll("button[data-sheet-page]")){
  const active=b.dataset.sheetPage===chosen;
  b.setAttribute("aria-current",active?"page":"false");b.classList.toggle("active",active);
 }
 $("page-subtitle").textContent=isGene?"Explore os caminhos presentes e futuros do seu Codex Genético.":isInv?
 "Seus equipamentos, materiais e Valor de Troca num espaço próprio.":isEvolve?
 "XP, fontes e Perícias para construir sua próxima especialização.":"Uma ficha de jogo limpa: recursos, rolagens e somente as habilidades que você adquiriu.";
}
function renderOwnedPanel(){
 const learned=SKILLS.filter(([id])=>ownsSkill(id)&&!HIDDEN_CATALOG_SKILLS.has(id));
 const basic=learned.filter(([id])=>!ELEMENT_SKILLS.some(([key])=>id===key));
 const empty='<span class="fp-owned-empty">Nenhuma por enquanto. Explore o Codex Genético para encontrar novas opções.</span>';
 const markup=([id,name,detail,cost])=>{
  const text=CARD_EFFECTS[id]||CARD_BRIEFS[id]||detail.slice(0,130),action=CARD_ACTIVATIONS[id]||"Consultar";
  return '<article class="fp-owned-card"><div><strong>'+esc(name)+'</strong><small>'+esc(action)+'</small></div>'+
   '<p>'+esc(text.slice(0,145))+'</p><button type="button" class="fp-owned-details" data-sheet-page="genetic" data-gene-select="'+esc(id)+'" aria-label="Ver detalhes de '+esc(name)+'">Detalhes</button></article>';
 };
 $("owned-skills").innerHTML=basic.length?basic.map(markup).join(""):empty;
 const elements=ELEMENT_SKILLS.filter(([id])=>ownsSkill(id));
 $("owned-elements").innerHTML=
  (state.elementalCrystal?.quantity?'<div class="fp-owned-crystal"><span>ᚨ Cristal Elemental inicial</span><strong>'+esc(state.elementalCrystal.element||"Elemento a escolher")+'</strong></div>':"")+
  (elements.length?elements.map(([id,name])=>'<button type="button" class="fp-element-prep" data-action="prepare-element" data-id="'+esc(id)+'" title="Preparar Disciplina + Inteligência com conjuração '+esc(name)+'">'+
    '<span class="fp-element-icon">ᚨ</span><span>'+esc(name)+'</span><small>Preparar magia</small></button>').join(""):'<span class="fp-owned-empty">Nenhum elemento adquirido. Ao comprar uma Perícia elemental, ela aparecerá aqui para preparar a conjuração.</span>');
 const equipped=state.items.filter(it=>it.equipped);
 $("equipped-shortcuts").innerHTML=equipped.length?equipped.map(it=>
  '<article class="fp-owned-gear"><strong>'+esc(it.name)+'</strong><span>'+esc(it.die?"Dado habilitável d"+it.die:it.type)+"</span>"+
  (it.properties?.length?'<small>'+it.properties.map(esc).join(" · ")+'</small>':"")+'</article>').join(""):'<span class="fp-owned-empty">Nenhum item equipado. Abra Inventário para equipar.</span>';
}

// SRD v0.71 — protótipo manual. Não converte dano automaticamente em sangue ou cura.
function renderHemomancy(){
 const panel=$("hemomancy-panel");
 if(!panel)return;
 panel.hidden=!ownsSkill("sangue");
 if(panel.hidden)return;
 const h=state.hemomancy||{spilled:0,extracted:0,selfBleeding:false,usedThisTurn:false};
 $("hemo-spilled").textContent=String(h.spilled);
 $("hemo-extracted").textContent=String(h.extracted);
 const spendSpilled=$("hemo-spend-spilled"),spendExtracted=$("hemo-spend-extracted");
 if(spendSpilled)spendSpilled.disabled=h.spilled<1||!!state.pending;
 if(spendExtracted)spendExtracted.disabled=h.extracted<1||!!state.pending;
 const recordDamage=$("hemo-record-damage");
 if(recordDamage)recordDamage.disabled=!!state.pending;
 $("hemo-self-status").textContent=h.selfBleeding?"Sangrando":"Sem Sangramento";
 $("hemo-self-status").setAttribute("aria-pressed",String(h.selfBleeding));
 $("hemo-boost-status").textContent=h.usedThisTurn?"Uso do turno marcado":"Marcar amplificação do turno";
 $("hemo-boost-status").setAttribute("aria-pressed",String(h.usedThisTurn));
 $("hemo-boost-status").disabled=h.usedThisTurn;
 const eligibleBlood=h.spilled+h.extracted; // Sangue extraído é elegível, mas deve ser anotado só aqui, não em "derramado".
 $("hemo-transfusion-potential").textContent=String(Math.floor(eligibleBlood/3));
 const skill=ownsSkill("transfusao-sanguinaria");
 const record=$("hemo-transfusion-record");
 record.disabled=!skill||eligibleBlood<3||state.life<=0||state.life>=maxLife()||!!state.pending;
 record.title=!skill?"Exige Perícia Transfusão Sanguinária comprada; pré-requisito Transfusão ainda pendente.":
  eligibleBlood<3?"Registre 3 marcas elegíveis entre sangue derramado e extraído (sem duplicar).":"Registrar somente após resolver a conjuração com o Narrador.";
 $("hemo-transfusion-state").textContent=skill?
  "Perícia adquirida — registro somente após resolver a conjuração com o Narrador.":
  "Protótipo de Perícia: 1 XP, exige Transfusão + Elemento Sangue. A compra de Transfusão ainda está pendente.";
}
function geneLayout(mapId,detailId){
 return '<div class="fp-gene-layout fp-gene-creator-layout">'+
  '<div class="fp-gene-canvas-shell">'+
  '<div class="fp-gene-canvas" id="'+mapId+'" role="region" aria-label="Codex Genético reorganizado: fontes com dados, graus e botões de ajuste"></div>'+
  '<aside class="fp-gene-detail fp-gene-float-detail" id="'+detailId+'" aria-label="Detalhes da fonte ou Perícia" aria-live="polite" hidden></aside>'+
  '</div></div>';
}
function genePreviewState(){
 if(!geneDraft.size&&!genePendingSkills.size)return state;
 const s={...state,attributes:{...state.attributes},knowledges:{...state.knowledges},practices:{...state.practices},
  skills:[...state.skills,...genePendingSkills]};
 for(const [id,grade] of geneDraft){
  const [group,key]=id.split(":");
  if(SOURCE_PROPS[group]&&GROUPS[group].some(([k])=>k===key))s[SOURCE_PROPS[group]][key]=grade;
 }
 return s;
}
function geneCanAdjust(){
 return !state.pending&&(viewMode==="builder"&&!state.creationLocked||viewMode==="sheet"&&sheetPage==="genetic");
}
function genePendingCount(){return geneDraft.size+genePendingSkills.size;}
function geneBudgetPanel(){
 const xp=xpCosts(genePreviewState()),actual=xpCosts();
 return '<div class="fp-gene-dashboard" id="gene-build-budget" aria-label="XP do Codex Genético">'+
  '<div><small>XP ATUAL</small><strong>'+Math.max(0,xp.total+xp.free)+' XP</strong><span>Orçamento compartilhado</span></div>'+
  '<div class="is-primary"><small>XP DISPONÍVEL</small><strong>'+xp.free+' XP</strong><span>Após os ajustes previstos</span></div>'+
  '<div><small>XP GASTO</small><strong>'+xp.total+' XP</strong><span>'+(xp.total-actual.total>=0?'+':'')+(xp.total-actual.total)+' XP nesta evolução</span></div>'+
  '</div>';
}
function geneActionsPanel(){
 const count=genePendingCount(),preview=genePreviewState();
 const costs=xpCosts(preview);
 const valid=costs.free>=0&&!dependentsValid(preview)&&(state.creationLocked||hasStarterSources(preview));
 return '<div class="fp-gene-bottom-actions"><button type="button" data-action="gene-reset"'+(count?'':' disabled')+'>Descartar ajustes</button>'+
  '<button type="button" class="fp-primary-btn" data-action="gene-confirm"'+(count&&valid?'':' disabled')+'>'+
  (count?'Confirmar evolução · '+count+' alteração'+(count===1?'':'ões'):'Confirmar evolução')+'</button>'+
  '<small>'+(count?'Prévia pendente: '+count+' alteração'+(count===1?'':'ões')+'. Nada foi debitado ainda.':
   'Ajuste graus usando os botões + e − dos nós; confirme para efetivar.')+'</small></div>';
}
function geneStageGrade(id,delta){
 if(!geneCanAdjust()){toast("Ajustes indisponíveis enquanto houver rolagem pendente.");return;}
 const [group,key]=id.split(":");
 if(!SOURCE_PROPS[group]||!GROUPS[group].some(([k])=>k===key)||![-1,1].includes(delta))return;
 const source=SOURCE_PROPS[group],preview=genePreviewState(),old=preview[source][key]||0,next=clamp(old+delta,0,6);
 if(next===old)return;
 if(next<1&&isRacialGradeOne(group,key,preview)){toast("Grau 1 é concedido pela origem e não pode ser removido.");return;}
 const baseGrade=state[source][key]||0;
 if(state.creationLocked&&next<baseGrade&&!editMode){toast("Graus adquiridos após a criação não podem ser reembolsados livremente.");return;}
 const candidate={...preview,[source]:{...preview[source],[key]:next}};
 if(xpCosts(candidate).free<0){toast("XP insuficiente para este grau.");return;}
 if(next<old){
  const problem=dependentsValid(candidate);
  if(problem){toast("Não é possível reduzir: "+problem);return;}
 }
 if(next===baseGrade)geneDraft.delete(id);else geneDraft.set(id,next);
 geneRefresh();
}
// Requisitos explícitos transcritos das verificações de skillReq(), SEM dedução
// a partir das linhas temáticas do grafo. Cada sublista é uma alternativa válida.
// a=Atributo, k=Conhecimento, p=Prática, s=Perícia.
const GENE_AUTO_REQUIREMENTS={
 "invocacao-elemental":[["s:criar-item-foco-magia","s:domar-criatura-pequena"]],
 "domar-criatura-pequena":[["a:influencia:2","a:inteligencia:1","p:apresentacao:1"]],
 "domar-criatura-media":[["a:influencia:3","a:inteligencia:1","p:apresentacao:1","s:domar-criatura-pequena"]],
 "domar-criatura-grande":[["a:influencia:4","a:inteligencia:1","p:apresentacao:1","s:domar-criatura-pequena","s:domar-criatura-media"]],
 "montar":[["a:influencia:2"]],
 "provocacao-sofisticada":[["a:influencia:2"]],
 "armas-leves":[["p:armas_conjuracao:1"]],
 "armas-medias":[["p:armas_conjuracao:1","a:forca:1"]],
 "armas-pesadas":[["p:armas_conjuracao:2","a:forca:2"]],
 "disciplina-avancada":[["p:armas_conjuracao:2"]],
 "pugilismo":[["p:armas_conjuracao:1","a:forca:2","a:destreza:1"]],
 "artista-marcial":[["p:armas_conjuracao:2","a:destreza:2","s:pugilismo"]],
 "golpe-baixo":[["a:destreza:2","a:forca:1","a:agilidade:1"]],
 "furtividade":[["p:furtividade:2","a:destreza:2","a:agilidade:1"]],
 "furtividade-avancada":[["p:furtividade:2","s:furtividade"]],
 "criar-item-foco-magia":[["p:armas_conjuracao:1","a:inteligencia:1","p:artesao:1"]],
 "escudo-arcano":[["a:inteligencia:2","a:vigor:1","s:criar-item-foco-magia"]],
 "conjuracao-equilibrada":[["p:armas_conjuracao:2","a:inteligencia:2","a:destreza:2","s:criar-item-foco-magia"]],
 "improviso":[["p:armas_conjuracao:1","a:inteligencia:1","a:destreza:1","s:criar-item-foco-magia"]],
 "fogo":[["p:armas_conjuracao:1","a:inteligencia:1","s:criar-item-foco-magia"]],
 "agua":[["p:armas_conjuracao:1","a:inteligencia:1","s:criar-item-foco-magia"]],
 "vento":[["p:armas_conjuracao:1","a:inteligencia:1","s:criar-item-foco-magia"]],
 "terra":[["p:armas_conjuracao:1","a:inteligencia:1","s:criar-item-foco-magia"]],
 "sagrado":[["p:armas_conjuracao:2","a:inteligencia:2","s:criar-item-foco-magia"]],
 "sangue":[["p:armas_conjuracao:2","a:inteligencia:2","s:criar-item-foco-magia"]],
 "trevas":[["p:armas_conjuracao:2","a:inteligencia:2","s:criar-item-foco-magia"]],
 "veneno":[["p:armas_conjuracao:2","a:inteligencia:2","k:alquimia:2","k:medicina:2"]],
 "criar-veneno":[["p:artesao:1","a:inteligencia:2","k:alquimia:2","k:medicina:2"]],
 "criar-antidoto":[["p:artesao:1","a:inteligencia:2","k:alquimia:2","k:medicina:2","s:criar-veneno"]],
 "armas-longo-alcance":[["p:armas_conjuracao:1","a:destreza:2"]],
 "armas-fogo":[["p:armas_conjuracao:2","a:destreza:2"]],
  "olhos-de-aguia":[["a:destreza:3","p:armas_conjuracao:3","s:armas-longo-alcance"],["a:destreza:3","p:armas_conjuracao:3","s:armas-fogo"]],
 "maestria-arremesso-armas":[
  ["a:forca:2","a:destreza:2","a:agilidade:1","s:armas-leves"],
  ["a:forca:2","a:destreza:2","a:agilidade:1","s:armas-medias"],
  ["a:forca:2","a:destreza:2","a:agilidade:1","s:armas-pesadas"]],
 "golpe-fulminante":[
  ...["armas-leves","armas-medias","armas-pesadas","maestria-manejo-duplo","pugilismo"].map(id=>
   ["p:armas_conjuracao:2","a:forca:2","s:"+id])],
 "espalhar-golpe":[
  ...["armas-leves","armas-medias","armas-pesadas","maestria-manejo-duplo","pugilismo"].map(id=>
   ["p:armas_conjuracao:2","a:destreza:1","a:agilidade:1","s:golpe-fulminante","s:"+id])],
 "disparo-fulminante":[
  ...["armas-longo-alcance","maestria-arremesso-armas"].map(id=>
   ["p:armas_conjuracao:2","a:destreza:2","a:forca:1","s:"+id])],
 "disparo-multiplo":[
  ...["armas-longo-alcance","maestria-arremesso-armas"].map(id=>
   ["p:armas_conjuracao:2","a:destreza:2","a:agilidade:2","s:"+id,"s:disparo-fulminante"])],
 "disparo-violento":[
  ...["armas-longo-alcance","maestria-arremesso-armas"].flatMap(id=>[
   ["p:armas_conjuracao:2","a:destreza:2","a:forca:2","s:"+id],
   ["p:armas_conjuracao:2","a:destreza:2","a:forca:1","p:atletismo:1","s:"+id]])],
 "maestria-manejo-duplo":[
  ...["armas-leves","armas-medias","armas-pesadas","maestria-arremesso-armas","armas-fogo","armas-longo-alcance"].map(id=>
   ["a:forca:2","a:destreza:2","a:agilidade:1","s:disciplina-avancada","s:"+id])],
 "mestre":[
  ...["vento","sangue","agua","fogo","terra","veneno","sagrado","trevas"].map(id=>
   ["p:armas_conjuracao:3","a:inteligencia:3","a:destreza:3","s:criar-item-foco-magia","s:improviso","s:"+id])]
};
function geneCandidateCopy(s){
 return {...s,attributes:{...s.attributes},knowledges:{...s.knowledges},
  practices:{...s.practices},skills:[...s.skills]};
}
// Retorna a evolução inteira só se os requisitos REAIS forem satisfeitos
// e todos os custos (inclusive Perícias intermediárias) couberem no orçamento.
function geneAutoPlan(id,base=genePreviewState()){
 const catalog=new Map(SKILLS.map(row=>[row[0],row]));
 const addSkill=(skillId,current,stack)=>{
  const row=catalog.get(skillId);
  if(ownsSkill(skillId,current))return current;
  if(!row||HIDDEN_CATALOG_SKILLS.has(skillId)||!Number.isInteger(row[3])||
    row[3]<0||stack.includes(skillId))return null;
  const alternatives=GENE_AUTO_REQUIREMENTS[skillId]||
   (skillReq(skillId,current)?[]:[[]]);
  let best=null;
  for(const required of alternatives){
   let draft=geneCandidateCopy(current);
   let valid=true;
   // Primeiro todos os graus de fontes: permite calcular cada Perícia intermediária corretamente.
   for(const token of required){
    const [type,key,level]=token.split(":");
    if(type==="s")continue;
    const group={a:"attr",k:"know",p:"practice"}[type],field=SOURCE_PROPS[group];
    const grade=Number(level);
    if(!field||!GROUPS[group].some(([name])=>name===key)||
      !Number.isInteger(grade)||grade<0||grade>6){valid=false;break;}
    draft[field][key]=Math.max(draft[field][key]||0,grade);
   }
   if(!valid||xpCosts(draft).free<0)continue;
   for(const token of required){
    if(!token.startsWith("s:"))continue;
    const linked=addSkill(token.slice(2),draft,[...stack,skillId]);
    if(!linked){valid=false;break;}
    draft=linked;
   }
   if(!valid||skillReq(skillId,draft))continue;
   draft.skills.push(skillId);
   if(xpCosts(draft).free<0||dependentsValid(draft))continue;
   if(!best||xpCosts(draft).total<xpCosts(best).total)best=draft;
  }
  return best;
 };
 const completed=addSkill(id,base,[]);
 if(!completed||xpCosts(completed).free<0||dependentsValid(completed))return null;
 return {state:completed,cost:xpCosts(completed).total-xpCosts(base).total};
}
function geneAutoBuy(id){
 if(!geneCanAdjust())return;
 const base=genePreviewState(),plan=geneAutoPlan(id,base);
 if(!plan||plan.cost<0){toast("Não há XP suficiente para todos os requisitos desta Perícia.");return;}
 const row=SKILLS.find(([sid])=>sid===id);
 const levels=[];
 for(const group of ["attr","know","practice"]){
  const field=SOURCE_PROPS[group];
  for(const [key,name] of GROUPS[group]){
   const from=Number(base[field][key]||0),to=Number(plan.state[field][key]||0);
   if(to>from)levels.push(name+" "+from+" → "+to);
  }
 }
 const newSkills=plan.state.skills.filter(sid=>!ownsSkill(sid,base))
  .map(sid=>SKILLS.find(([key])=>key===sid)?.[1]||sid);
 const before=xpCosts(base).free,after=xpCosts(plan.state).free;
 const summary="Comprar "+row[1]+" e todos os requisitos por "+plan.cost+" XP?\n\n"+
  (levels.length?"Graus:\n• "+levels.join("\n• ")+"\n\n":"")+
  (newSkills.length?"Perícias:\n• "+newSkills.join("\n• ")+"\n\n":"")+
  "Saldo: "+before+" XP → "+after+" XP.\n"+(genePendingCount()?"Os ajustes anteriores também serão confirmados.":"");
 if(!confirm(summary))return;
 // A compra completa é atômica: não grava nem debita um requisito isolado.
 for(const group of ["attr","know","practice"]){
  const field=SOURCE_PROPS[group];
  for(const [key] of GROUPS[group]){
   const grade=Number(plan.state[field][key]||0);
   if(grade===Number(state[field][key]||0))geneDraft.delete(group+":"+key);
   else geneDraft.set(group+":"+key,grade);
  }
 }
 for(const sid of plan.state.skills)if(!ownsSkill(sid))genePendingSkills.add(sid);
 geneCommit();
}
function geneStageSkill(id){
 if(!geneCanAdjust())return;
 const row=SKILLS.find(([sid])=>sid===id&&!HIDDEN_CATALOG_SKILLS.has(sid));
 if(!row||ownsSkill(id))return;
 if(genePendingSkills.has(id)){
  genePendingSkills.delete(id);geneRefresh();return;
 }
 const cost=row[3],preview=genePreviewState();
 if(!Number.isInteger(cost)||skillReq(id,preview)||xpCosts(preview).free<cost){
  toast("Esta Perícia ainda não reúne os requisitos ou o XP necessário.");return;
 }
 genePendingSkills.add(id);geneRefresh();
}
function geneDiscard(){
 geneDraft.clear();genePendingSkills.clear();geneRefresh();
}
function geneCommit(){
 if(!geneCanAdjust()||!genePendingCount())return;
 const preview=genePreviewState(),xp=xpCosts(preview),problem=dependentsValid(preview);
 if(xp.free<0||problem||(!state.creationLocked&&!hasStarterSources(preview))){
  toast(problem||"A criação exige Atributo 1 e Conhecimento ou Prática 1, sem exceder o XP.");return;
 }
 state.attributes={...preview.attributes};
 state.knowledges={...preview.knowledges};
 state.practices={...preview.practices};
 state.skills=[...preview.skills];
 geneDraft.clear();genePendingSkills.clear();
 for(const item of state.items)if(item.equipped&&item.type==="armadura"&&!canEquipArmor(state,item))item.equipped=false;
 render();save();toast("Evolução confirmada. Saldo de XP: "+xp.free+".");
}
function geneRefresh(){
 renderGenetic();
 const budget=$("gene-build-budget"),buttons=$("gene-build-actions");
 if(budget)budget.outerHTML=geneBudgetPanel();
 if(buttons)buttons.outerHTML='<div id="gene-build-actions">'+geneActionsPanel()+'</div>';
 const sheetBudget=$("gene-sheet-budget"),sheetActions=$("gene-sheet-actions");
 if(sheetBudget)sheetBudget.innerHTML=geneBudgetPanel().replace('id="gene-build-budget"','id="gene-sheet-budget-content"');
 if(sheetActions)sheetActions.innerHTML=geneActionsPanel();
}
function sourceGeneInfo(id,s=state){
 const [group,key]=String(id).split(":");
 if(!GROUPS[group])return null;
 const row=GROUPS[group].find(([k])=>k===key);
 if(!row)return null;
 const grade=Number(state[SOURCE_PROPS[group]][key]||0);
 const previewGrade=Number(s[SOURCE_PROPS[group]][key]||0);
 const costTable=racialCostTable(group,key,s);
 const next=previewGrade<6?costTable[previewGrade+1]-costTable[previewGrade]:null;
 const canRaise=next!==null&&xpCosts(s).free>=next&&!state.pending;
 const racialG1=isRacialGradeOne(group,key,s),xpBand=racialXpBand(group,key,s);
 return {id,group,key,type:group,name:row[1],grade,previewGrade,next,canRaise,minGrade:racialG1?1:0,xpBand,xpLabel:racialXpLabel(xpBand),
  dice:dataDice(group,previewGrade).map(n=>"d"+n),
  state:previewGrade>0?"owned":canRaise?"available":"locked",
  label:(racialG1?"Origem: Grau 1 gratuito · ":"")+(next===null?"Grau máximo":"Próximo avanço: "+next+" XP")};
}
function geneSkillStatus([id,,,cost],s=state){
 if(ownsSkill(id,s))return"owned";
 if(!Number.isInteger(cost)||xpCosts(s).free<cost||state.pending)return"locked";
 if(!skillReq(id,s))return"available";
 // Roxo somente se o pacote completo de fontes + Perícias estiver disponível no XP.
 return geneAutoPlan(id,s)?"potential":"locked";
}
function geneDetailHTML(id,s=state){
 const src=sourceGeneInfo(id,s);
 if(src){
  const dice=src.dice.join(" + "),editable=geneCanAdjust(),canReduce=src.previewGrade>(src.minGrade||0)&&
   (!state.creationLocked||editMode||src.previewGrade>src.grade)&&!state.pending;
  return '<span class="fp-gene-detail-status is-'+src.state+'">'+(src.previewGrade?"Desenvolvido":"Potencial")+'</span>'+
   '<h4>'+esc(src.name)+'</h4><p>'+({attr:"Atributo central.",know:"Conhecimento estudado.",practice:"Prática treinada."}[src.group])+'</p>'+
   racialXpMarker(src.group,src.key,s)+
   '<dl><dt>Grau / Dados</dt><dd>G'+src.previewGrade+' · '+esc(dice)+(src.minGrade?' · Grau 1 da origem (0 XP)':'')+'</dd>'+
   '<dt>Próximo grau</dt><dd>'+esc(src.next===null?"Máximo":src.next+" XP")+'</dd>'+
   '<dt>XP disponível</dt><dd>'+xpCosts(s).free+' XP</dd></dl>'+
   '<div class="fp-gene-grade-actions">'+
   '<button type="button" data-action="'+(editable?"gene-grade":"grade")+'" data-group="'+src.group+'" data-key="'+src.key+'" data-delta="-1"'+(canReduce?'':' disabled')+'>− Grau</button>'+
   '<button type="button" class="fp-primary-btn" data-action="'+(editable?"gene-grade":"grade")+'" data-group="'+src.group+'" data-key="'+src.key+'" data-delta="1"'+(src.canRaise?'':' disabled')+'>'+
   '+ Grau · '+(src.next===null?"máximo":src.next+" XP")+'</button></div>';
 }
 const skill=SKILLS.find(([sid])=>sid===id&&!HIDDEN_CATALOG_SKILLS.has(sid));
 if(!skill)return '<p>Selecione um nó para consultar seus graus e requisitos.</p>';
 const [sid,name,detail,cost]=skill,owned=ownsSkill(sid),racial=racialGrants(state).includes(sid),staged=genePendingSkills.has(sid);
 const status=geneSkillStatus(skill,s),reason=skillReq(sid,s);
 const packagePlan=status==="potential"?geneAutoPlan(sid,s):null;
 const slug=SKILL_PERMALINKS[sid];
 const verbete=slug?'<a class="fp-gene-verbete" href="../pericias/'+encodeURIComponent(slug)+'.html" target="_blank" rel="noopener noreferrer" aria-label="Abrir verbete completo de '+esc(name)+' em nova aba">Ler verbete completo ↗</a>':"";
 const skillButton=owned&&racial?'<button type="button" disabled>Concedida pela origem · 0 XP</button>':owned?
  '<button type="button" data-action="respec-skill" data-id="'+esc(sid)+'"'+(state.pending?' disabled':'')+'>Devolver '+(Number.isInteger(cost)?cost:"?")+' XP · testar build</button>':
  status==="potential"&&packagePlan&&geneCanAdjust()?
  '<button type="button" class="fp-primary-btn fp-gene-auto-buy" data-action="gene-auto-buy" data-id="'+esc(sid)+'">'+
   'Comprar Perícia + requisitos · '+packagePlan.cost+' XP</button>'+
   '<p class="fp-gene-auto-note">Compra conjunta: os graus e Perícias exigidos serão adquiridos automaticamente após confirmar o custo.</p>':
  geneCanAdjust()?'<button type="button" class="fp-primary-btn" data-action="gene-skill" data-id="'+esc(sid)+'"'+(owned||status!=="available"&&!staged?' disabled':'')+'>'+
   (owned?"Adquirida ✓":staged?"Remover da evolução":"Adicionar à evolução · "+cost+" XP")+'</button>':
   '<button type="button" class="fp-primary-btn" data-action="skill" data-id="'+esc(sid)+'"'+(owned||status!=="available"?' disabled':'')+'>'+
   (owned?"Adquirida ✓":status==="available"?"Comprar · "+cost+" XP":"Indisponível")+'</button>';
 return '<span class="fp-gene-detail-status is-'+status+'">'+(owned?"Adquirida":staged?"A confirmar":status==="available"?"Disponível":status==="potential"?"Pacote completo de XP disponível · requisitos pendentes":"Bloqueada")+'</span>'+
  '<h4>'+esc(name)+'</h4><p>'+esc(detail)+'</p>'+
  '<dl><dt>Requisitos</dt><dd>'+esc(CARD_REQUIREMENTS[sid]||reason||"Consulte o verbete")+'</dd>'+
  '<dt>Custo da Perícia</dt><dd>'+esc(racial?"0 XP · Origem":Number.isInteger(cost)?cost+" XP":"Pendente")+'</dd>'+
  (packagePlan?'<dt>Custo de tudo que falta</dt><dd>'+packagePlan.cost+' XP</dd>':"")+
  '<dt>Ativação</dt><dd>'+esc(CARD_ACTIVATIONS[sid]||"Conforme verbete")+'</dd></dl>'+skillButton+verbete;
}
function renderGenetic(){
 const preview=genePreviewState();
 if(!geneSelected)geneSelected="attr:forca";
 const nodes=[
  ...A.map(([k])=>({type:"attr",...sourceGeneInfo("attr:"+k,preview)})),
  ...K.map(([k])=>({type:"know",...sourceGeneInfo("know:"+k,preview)})),
  ...P.map(([k])=>({type:"practice",...sourceGeneInfo("practice:"+k,preview)})),
  ...SKILLS.filter(([id])=>!HIDDEN_CATALOG_SKILLS.has(id)).map(row=>({
   type:"skill",id:row[0],name:row[1],state:geneSkillStatus(row,preview),
   label:ownsSkill(row[0],preview)?"Adquirida":skillReq(row[0],preview)||"Requisitos e XP"
  }))
 ];
 const choose=(id,y)=>{geneSelected=id;geneInspectorOpen=true;
  if(Number.isFinite(y))geneInspectorTop=Math.max(12,y-150);
  renderGenetic();};
 for(const mapId of ["gene-map","gene-builder-map"]){
  const map=$(mapId);
  if(!map||map.isConnected===false)continue;
  if(mapId==="gene-builder-map"&&!(viewMode==="builder"&&wizardStep===2&&wizardMode==="genetic"))continue;
  window.CodexGeneGraph?.render(map,{skills:nodes,branches:SKILL_BRANCHES,affinity:SKILL_AFFINITY,
   selected:geneSelected,filter:mapId==="gene-builder-map"?"all":geneFilter,query:geneSearch,
   showFuture:geneShowFuture,edit:geneCanAdjust(),onSelect:choose,
   onAdjust:geneStageGrade});
 }
 for(const id of ["gene-detail","gene-builder-detail"]){
  const el=$(id);
  if(el&&el.isConnected!==false){
   el.hidden=!geneInspectorOpen;
   const mapHeight=el.closest(".fp-gene-canvas-shell")?.querySelector(".fp-gene-canvas")?.getBoundingClientRect().height||500;
   el.style.top=Math.min(geneInspectorTop,Math.max(12,mapHeight-340))+"px";
   el.innerHTML=geneInspectorOpen?'<div class="fp-gene-float-top"><strong>DETALHES DO CODEX</strong>'+
    '<button type="button" data-action="gene-close-detail" aria-label="Fechar detalhes">×</button></div>'+
    geneDetailHTML(geneSelected,preview):"";
  }
 }
 const sheetBudget=$("gene-sheet-budget"),sheetActions=$("gene-sheet-actions"),futureToggle=$("gene-sheet-future");
 if(sheetBudget)sheetBudget.innerHTML=geneBudgetPanel().replace('id="gene-build-budget"','id="gene-sheet-budget-content"');
 if(sheetActions)sheetActions.innerHTML=geneActionsPanel();
 if(futureToggle){futureToggle.textContent=geneShowFuture?"Ocultar futuras ramificações":"Mostrar futuras ramificações";futureToggle.setAttribute("aria-pressed",String(geneShowFuture));}
 const list=$("gene-list");
 if(list){list.hidden=!geneListOpen;
  if(geneListOpen)list.innerHTML=SKILLS.filter(row=>!HIDDEN_CATALOG_SKILLS.has(row[0])).map(row=>skillCompactCard(row,false)).join("");
 }
}
function openSheetPage(page,focusSkill=""){
 if(!["play","evolution","genetic","inventory"].includes(page)||viewMode!=="sheet")return;
 sheetPage=page;
 if(focusSkill)geneSelected=focusSkill;
 if((page==="play"||page==="inventory")&&editMode)editMode=false;
 render();
 $("sheet-navigation")?.scrollIntoView?.({behavior:"smooth",block:"nearest"});
}
function prepareElementSkill(id){
 if(!ELEMENT_SKILLS.some(([key])=>key===id)||!ownsSkill(id))return;
 if(state.pending){toast("Finalize a rolagem pendente antes de preparar a magia.");return;}
 if(!ownsSkill("criar-item-foco-magia")){toast("Crie primeiro um foco e adquira Criar Item de Foco e Magia.");return;}
 sheetPage="play";editMode=false;
 draft=freshDraft();draft.base={group:"practice",key:"armas_conjuracao"};draft.attribute={group:"attr",key:"inteligencia"};draft.mode="conjuracao";
 const focus=state.items.find(it=>it.equipped&&it.type==="foco"&&combatItem(it,"conjuracao").length&&
  (it.element||"").normalize("NFD").toLowerCase().includes(id==="vento"?"ar":id));
 if(focus)draft.equipmentId=focus.id;
 render();toast("Conjuração "+(ELEMENT_SKILLS.find(([key])=>key===id)?.[1]||"")+
  " preparada. Escolha o foco pertinente, confira a pilha e os custos.");
}

function render(){renderPlayerSheets();renderRacePanel();renderVitals();renderXP();renderRespecSkills();renderDiceLegend();renderSources();renderComposer();renderSkills();renderInventory();renderTrade();renderOwnedPanel();renderHemomancy();renderGenetic();renderWizard();applySheetPage();soundUI();}

/* Etapas guiadas: Codex Genético padrão e listas opcionais compartilham o mesmo XP e ficha. */
function wizardPersist(){
 try{localStorage.setItem(WIZARD_KEY,JSON.stringify(wizardSnapshot()));}
 catch(e){console.warn("Codex: etapa não persistida",e);}
 if(!NPC_MODE&&activePlayerSheetId)save();
}
function wizardSelectStep(next){
 if(viewMode!=="builder"||state.creationLocked||next<0||next>=WIZARD_STEPS.length||next>wizardReached+1)return;
 if(next>0&&!state.name.trim()){
  toast("Escolha um nome para o Aprendiz antes de continuar.");$("wizard-content").querySelector?.('[data-wizard-field="name"]')?.focus?.();return;
 }
 if(wizardStep===1&&next===2){
  // A etapa 03 também pode ser aberta pelo indicador superior quando as escolhas estão prontas.
  if(wizardStarterPhase==="confirm"&&wizardStarterAttribute&&wizardStarterTraining){
   wizardConfirmStarterPicks();return;
  }
  // Ao voltar a uma criação já confirmada, não exigir que o jogador refaça as duas compras.
  const [chosenGroup,chosenId]=wizardStarterTraining.split(":");
  const alreadyConfirmed=!!wizardStarterAttribute&&
   Number(state.attributes[wizardStarterAttribute]||0)>=1&&
   !!SOURCE_PROPS[chosenGroup]&&Number(state[SOURCE_PROPS[chosenGroup]][chosenId]||0)>=1;
  if(wizardReached>=2&&alreadyConfirmed){
   wizardStep=2;wizardPersist();renderWizard();
   $("builder-root").scrollIntoView?.({behavior:"smooth",block:"start"});return;
  }
  toast("Escolha um Atributo principal e um Conhecimento ou Prática. Confirme as duas opções para abrir a distribuição livre de XP.");
  return;
 }
 if(next>=3&&!hasStarterSources()){
  toast("Compre pelo menos um Atributo e um Conhecimento ou Prática no grau 1 antes da revisão.");return;
 }
 wizardStep=next;wizardReached=Math.max(wizardReached,wizardStep);wizardPersist();renderWizard();
 $("builder-root").scrollIntoView?.({behavior:"smooth",block:"start"});
}
function wizardStarterSelect(group,id){
 if(wizardStep!==1||viewMode!=="builder"||state.creationLocked||state.pending)return;
 if(group==="attr"){
  if(!A.some(([k])=>k===id))return;
  const previous=wizardStarterPurchased,oldChoice=wizardStarterAttribute;
  // O primeiro clique compra G1, mas trocar a opção de "Começar com"
  // não pode acumular compras feitas exclusivamente por esse botão.
  const candidate=structuredClone(state);
  if(oldChoice!==id&&previous===oldChoice&&(candidate.attributes[previous]||0)===1&&
     !isRacialGradeOne("attr",previous,candidate)){
   candidate.attributes[previous]=0;
   const invalid=dependentsValid(candidate);
   if(invalid){toast("Esta compra já é requisito de outra Perícia: "+invalid);return;}
  }
  const first=(candidate.attributes[id]||0)<1;
  if(first)candidate.attributes[id]=1;
  const cost=xpCosts(candidate).free;
  if(cost<0){toast("XP insuficiente para iniciar com esse Atributo.");return;}
  state.attributes=candidate.attributes;
  wizardStarterPurchased=first&&!isRacialGradeOne("attr",id)?id:oldChoice===id?previous:"";
  wizardStarterAttribute=id;wizardStarterPhase="training";geneSelected="attr:"+id;
 }else if(group==="know"||group==="practice"){
  if(!GROUPS[group].some(([k])=>k===id)||!wizardStarterAttribute)return;
  wizardStarterTraining=group+":"+id;wizardStarterPhase="confirm";
 }else return;
 wizardPersist();render();save();
 $("builder-root").scrollIntoView?.({behavior:"smooth",block:"start"});
}
function wizardStarterBack(){
 if(wizardStarterPhase==="confirm")wizardStarterPhase="training";
 else if(wizardStarterPhase==="training")wizardStarterPhase="attr";
 else {wizardSelectStep(0);return;}
 wizardPersist();renderWizard();
 $("builder-root").scrollIntoView?.({behavior:"smooth",block:"start"});
}
function wizardConfirmStarterPicks(){
 const attr=wizardStarterAttribute,[group,id]=wizardStarterTraining.split(":");
 if(!A.some(([k])=>k===attr)||!["know","practice"].includes(group)||!GROUPS[group].some(([k])=>k===id)){
  toast("Confirme um Atributo e um Conhecimento ou Prática.");return;
 }
 if(state.pending||state.creationLocked)return;
 const attrCost=(state.attributes[attr]||0)>=1?0:xpStepCost("attr",attr,1);
 const trainingCost=(state[SOURCE_PROPS[group]][id]||0)>=1?0:xpStepCost(group,id,1);
 if(xpCosts().free<attrCost+trainingCost){
  toast("XP insuficiente para as duas compras. Ajuste outras compras antes de continuar.");return;
 }
 // Compras dos graus mínimos em uma operação, sem bônus de 'atributo principal'.
 if((state.attributes[attr]||0)<1)state.attributes[attr]=1;
 if((state[SOURCE_PROPS[group]][id]||0)<1)state[SOURCE_PROPS[group]][id]=1;
 wizardCategory="attr";wizardTab="attr";wizardMode="genetic";
 wizardStep=2;wizardReached=Math.max(wizardReached,2);
 wizardPersist();save();render();
 toast("Compras iniciais confirmadas: "+(attrCost+trainingCost)+" XP. O restante é livre.");
 $("builder-root").scrollIntoView?.({behavior:"smooth",block:"start"});
}
function wizardFinalize(){
 if(viewMode!=="builder"||state.pending||state.creationLocked)return;
 if(!state.name.trim()){toast("O personagem precisa de um nome.");wizardStep=0;renderWizard();return;}
 if(!hasStarterSources()){toast("Desenvolva um Atributo e um Conhecimento ou Prática.");wizardStep=2;renderWizard();return;}
  if(!raceChoicesComplete()){toast("Escolha os elementos raciais iniciais para concluir.");wizardStep=0;renderWizard();return;}
 const xp=xpCosts();
 if(xp.free<0){toast("O investimento ultrapassa "+CREATE_BUDGET.total+" XP.");return;}
 if(!confirm("Concluir a criação usando "+xp.total+" dos "+CREATE_BUDGET.total+" XP? "+xp.free+" XP restante ficará disponível para progressão."))return;
 const residual=lockCreation();if(residual===null)return;
 viewMode="sheet";sheetPage="play";wizardStep=4;wizardReached=4;wizardPersist();
 syncFields();render();save();toast("Aprendiz criado! XP livre: "+residual+".");
 window.scrollTo?.({top:0,behavior:"smooth"});
}
function wizardDice(group,id,grade){
 return dataDice(group,grade).map(n=>'<span class="fp-die-badge fp-die-d'+n+'">'+dieIcon(n)+'<b>d'+n+'</b></span>').join("");
}
function wizardSource(group,item){
 const [id,name]=item,g=state[SOURCE_PROPS[group]][id]||0;
 const next=xpStepCost(group,id,1),raised=g<6&&canAfford(group,next);
 const lower=g>0&&!state.creationLocked&&!state.pending&&!(g===1&&isRacialGradeOne(group,id));
 const band=racialXpBand(group,id);
 return '<article class="fp-wiz-source'+(band==="normal"?"":" is-xp-"+band)+'" data-source-group="'+group+'">'+
  '<div class="fp-wiz-source-title"><strong>'+esc(name)+'</strong><span>GRAU '+g+'</span></div>'+
  racialXpMarker(group,id)+
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
  '<div id="wizard-skill-cards" class="fp-wiz-skills">'+wizardSkillCardsMarkup()+'</div>';
}

function wizardStarterOption(group,[id,name]){
 const isAttr=group==="attr",key=isAttr?id:group+":"+id;
 const info=isAttr?WIZARD_ATTRIBUTE_GUIDE[id]:WIZARD_TRAINING_GUIDE[key];
 const grade=Number(state[SOURCE_PROPS[group]][id]||0);
 const selected=isAttr?wizardStarterAttribute===id:wizardStarterTraining===key;
 const cost=grade>=1?0:racialCostTable(group,id,state)[1];
 const dice=isAttr?"G0: 1d4 · G1: 1d6":"G0: 1d6 · G1: 1d10";
 const band=racialXpBand(group,id);
 return '<button type="button" class="fp-wiz-focus-card'+(selected?' is-active':'')+(band==="normal"?"":" is-xp-"+band)+'" data-action="'+(isAttr?'wizard-starter-attr':'wizard-starter-training')+'" data-group="'+group+'" data-key="'+id+'" aria-pressed="'+selected+'">'+
  '<span class="fp-wiz-focus-top"><strong>'+esc(name)+'</strong><small>'+(selected?'Escolhido':'Escolher')+'</small></span>'+
  racialXpMarker(group,id)+
  '<span class="fp-wiz-focus-role">'+esc(info[0])+'</span>'+
  '<span class="fp-wiz-focus-description">'+esc(info[1])+'</span>'+
  '<span class="fp-wiz-focus-example">'+esc(info[2])+'</span>'+
  '<span class="fp-wiz-focus-bottom"><span>'+dice+'</span><b>'+(grade>=1?'Grau '+grade+' já comprado':cost?cost+' XP · grau 1':'0 XP · grau 1')+'</b></span></button>';
}
function wizardStarterCards(){
 const [group,id]=wizardStarterTraining.split(":");
 const attr=A.find(([k])=>k===wizardStarterAttribute);
 const training=GROUPS[group]?.find(([k])=>k===id);
 const attrCost=wizardStarterAttribute&&(state.attributes[wizardStarterAttribute]||0)<1?racialCostTable("attr",wizardStarterAttribute,state)[1]:0;
 const trainingCost=training&&(state[SOURCE_PROPS[group]][id]||0)<1?racialCostTable(group,id,state)[1]:0;
 const phases='<div class="fp-wiz-mini-progress" aria-label="Progresso da escolha inicial">'+
  '<span class="'+(wizardStarterPhase==="attr"?'is-current':'is-complete')+'">1 · Atributo</span>'+
  '<span class="'+(wizardStarterPhase==="training"?'is-current':wizardStarterPhase==="confirm"?'is-complete':'')+'">2 · Conhecimento ou Prática</span>'+
  '<span class="'+(wizardStarterPhase==="confirm"?'is-current':'')+'">3 · Confirmar</span></div>';
 if(wizardStarterPhase==="attr")return '<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 02 · PRIMEIRA ESCOLHA</span>'+
  '<h3>Escolha um Atributo principal.</h3><p>Veja os seis Atributos, suas funções e exemplos. Selecione aquele com que deseja iniciar. <strong>“Principal” não cria bônus, classe ou restrição:</strong> será só sua primeira compra.</p></div>'+
  phases+'<div class="fp-wiz-focus-grid">'+A.map(x=>wizardStarterOption("attr",x)).join("")+'</div>'+
  '<div class="fp-wiz-reminder"><strong>Atributos</strong><p>Grau 0: 1d4; grau 1: 1d6. “Começar com” compra o Grau 1 imediatamente pelo custo racial. Atributos favorecidos iniciam automaticamente no Grau 1 por 0 XP. Outras compras são feitas no Codex Genético.</p></div>'+ (racialExtraG1().length?'<div class="fp-wiz-reminder"><b>Graus 1 adicionais na ficha</b><p>Há Atributos em G1 fora do par gratuito da raça. Podem ser compras manuais ou resíduos de outra origem.</p><button type="button" class="fp-secondary" data-action="wizard-racial-repair">Revisar graus extras</button></div>':'');
 if(wizardStarterPhase==="training")return '<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 02 · SEGUNDA ESCOLHA</span>'+
  '<h3>Escolha um Conhecimento ou uma Prática.</h3><p>Seu Atributo inicial é <strong>'+esc(attr?.[1]||"não selecionado")+'</strong>. Agora selecione <strong>um</strong> Conhecimento ou <strong>uma</strong> Prática. Conhecimento representa estudo; Prática representa treinamento. Não é preciso escolher os dois.</p></div>'+
  phases+
  '<section class="fp-wiz-focus-section" data-source-group="know"><div class="fp-wiz-focus-heading"><h4>Conhecimentos</h4><p>Estudar, investigar e compreender.</p></div><div class="fp-wiz-focus-grid">'+K.map(x=>wizardStarterOption("know",x)).join("")+'</div></section>'+
  '<section class="fp-wiz-focus-section" data-source-group="practice"><div class="fp-wiz-focus-heading"><h4>Práticas</h4><p>Treinar, executar e aperfeiçoar.</p></div><div class="fp-wiz-focus-grid">'+P.map(x=>wizardStarterOption("practice",x)).join("")+'</div></section>'+
  '<div class="fp-wiz-reminder"><strong>Conhecimentos e Práticas</strong><p>Grau 0: 1d6; grau 1: 1d10 por 2 XP. As outras fontes continuarão disponíveis depois, sem reserva por categoria.</p></div>';
 return '<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 02 · CONFIRMAR COMPRAS</span>'+
  '<h3>Confirme as escolhas iniciais.</h3><p>Ao confirmar, as duas fontes terão pelo menos grau 1. Depois você poderá investir livremente em qualquer categoria, inclusive Perícias.</p></div>'+
  phases+'<div class="fp-wiz-focus-confirm">'+
  '<section data-source-group="attr"><small>ATRIBUTO PRINCIPAL</small><strong>'+esc(attr?.[1]||"Não selecionado")+'</strong><span>Grau 1 · '+attrCost+' XP</span><button type="button" data-action="wizard-starter-edit" data-phase="attr">Alterar Atributo</button></section>'+
  '<section data-source-group="'+group+'"><small>CONHECIMENTO OU PRÁTICA</small><strong>'+esc(training?.[1]||"Não selecionado")+'</strong><span>Grau 1 · '+trainingCost+' XP</span><button type="button" data-action="wizard-starter-edit" data-phase="training">Alterar escolha</button></section></div>'+
  '<div class="fp-wiz-starter-total"><span>XP para confirmar: <strong>'+(attrCost+trainingCost)+'</strong></span><span>Saldo livre após confirmar: <strong>'+(xpCosts().free-attrCost-trainingCost)+' XP</strong></span></div>'+
  '<div class="fp-wiz-reminder"><strong>A escolha “principal” é orientativa</strong><p>Não há bônus oculto. Ao clicar em “Começar com”, o Atributo escolhido é comprado imediatamente. Se voltar, as compras feitas permanecem na ficha e o custo de uma nova fonte será informado.</p></div>';
}
function wizardBuild(){
 const attrOK=A.some(([k])=>(state.attributes[k]||0)>=1);
 const trainingOK=K.some(([k])=>(state.knowledges[k]||0)>=1)||P.some(([k])=>(state.practices[k]||0)>=1);
 const switcher='<div class="fp-wiz-view-switch" role="group" aria-label="Visualização da criação">'+
  '<button type="button" data-action="wizard-mode" data-mode="genetic" class="'+(wizardMode==="genetic"?'is-active':'')+'" aria-pressed="'+(wizardMode==="genetic")+'">Codex Genético · principal</button>'+
  '<button type="button" data-action="wizard-mode" data-mode="list" class="'+(wizardMode==="list"?'is-active':'')+'" aria-pressed="'+(wizardMode==="list")+'">Listas · alternativa</button></div>';
 const status='<div class="fp-wiz-starter-status" aria-label="Compras mínimas">'+
  '<span class="'+(attrOK?'is-ready':'')+'">'+(attrOK?'✓':'○')+' Atributo grau 1</span>'+
  '<span class="'+(trainingOK?'is-ready':'')+'">'+(trainingOK?'✓':'○')+' Conhecimento ou Prática grau 1</span>'+
  '<span class="fp-wiz-starter-xp">Saldo <strong>'+xpCosts().free+'</strong> / 18 XP (total experimental)</span></div>';
 const confirmedHint='<div class="fp-wiz-creation-confirmed" role="status"><strong>Etapa 3 · Distribuição livre de XP</strong><span>As escolhas iniciais já estão registradas no Codex Genético. Desenvolva outros graus e Perícias pelo mapa ou use as listas opcionais.</span></div>';
 if(wizardMode==="genetic")return confirmedHint+switcher+
  geneBudgetPanel()+
  '<div class="fp-gene-map-tools"><button type="button" data-action="gene-future" aria-pressed="'+geneShowFuture+'">'+
  (geneShowFuture?'Ocultar futuras ramificações':'Mostrar futuras ramificações')+'</button>'+
  '<span>Verde: adquirida · Azul: liberada · Roxo: compra completa com requisitos pagáveis.</span>'+
  '<div class="fp-gene-zoom"><button type="button" data-gene-zoom="-1" aria-label="Diminuir zoom">−</button>'+
  '<button type="button" data-gene-zoom="0">Centralizar</button><button type="button" data-gene-zoom="1" aria-label="Aumentar zoom">+</button></div></div>'+
  
  '<div class="fp-gene-legend"><span class="owned">● Adquirido</span><span class="available">● Requisitos completos</span><span class="potential">● Requisitos compráveis com XP</span><span class="locked">● Futuro (opcional)</span></div>'+
  racialXpLegend()+
  geneLayout("gene-builder-map","gene-builder-detail")+
  '<div id="gene-build-actions">'+geneActionsPanel()+'</div>'+
  '<p class="fp-wiz-reminder">As ligações são afinidades, não bônus ou pré-requisitos automáticos. Alterações só entram na ficha após confirmar a evolução.</p>';
 const tabs=[["attr","Atributos"],["know","Conhecimentos"],["practice","Práticas"],["skills","Perícias"]];
 const current=tabs.some(([id])=>id===wizardTab)?wizardTab:"attr";
 const bar='<div class="fp-wiz-category-tabs" role="group" aria-label="Categoria de investimento">'+
  tabs.map(([id,name])=>'<button type="button" data-action="wizard-tab" data-group="'+id+'" class="'+(current===id?'is-active':'')+'" aria-pressed="'+(current===id)+'">'+name+'</button>').join("")+'</div>';
 let body;
 if(current==="skills")body='<p class="fp-wiz-tab-help">Perícias especializam o personagem e exigem seus requisitos. Todas as compras usam o mesmo XP.</p>'+wizardSkills();
 else{
  const c=WIZARD_CATEGORIES.find(x=>x.id===current);
  body='<div class="fp-wiz-tab-help" data-source-group="'+current+'"><strong>'+c.title+'</strong> · '+c.description+'<span>'+c.dice+' · '+c.cost+'</span></div>'+
   '<div class="fp-wiz-source-grid">'+GROUPS[current].map(item=>wizardSource(current,item)).join("")+'</div>';
 }
 return confirmedHint+switcher+status+bar+body+
  '<p class="fp-wiz-reminder">Compre graus usando + e −. Você pode alternar entre categorias ou abrir o Codex Genético a qualquer momento, sem reiniciar a ficha.</p>';
}
function wizardEquipment(){
 if(tradeOwner!==state){tradeOwner=state;tradeDraft={...state.trade.resources};}
 const spent=state.trade.purchases.reduce((n,p)=>n+Number(p.price||0),0),remaining=walletValue();
 const editable=!state.trade.purchases.length&&!state.trade.collected;
 // Depois da primeira compra, mostrar recursos restantes, não a distribuição original.
 if(!editable)tradeDraft={...state.trade.resources};
 const sum=RESOURCES.reduce((n,[k])=>n+Number(tradeDraft[k]||0),0);
 const changed=RESOURCES.some(([k])=>Number(tradeDraft[k]||0)!==Number(state.trade.resources[k]||0));
 const resources=RESOURCES.map(([k,name])=>'<label class="fp-wiz-vt-resource"><span>'+esc(name)+'</span><input type="number" min="0" max="'+STARTING_VT+'" data-wizard-vt-draft="'+k+'" value="'+tradeDraft[k]+'"'+(editable?'':' disabled')+'><small>Grau 1 · 1 VT por unidade (playtest)</small></label>').join("");
 const categories=[["all","Todos"],["weapon","Armas"],["firearm","Armas de fogo"],["armor","Armaduras"],["shield","Escudos"],["focus","Focos elementais"]];
 const tabs=categories.map(([k,name])=>'<button type="button" data-action="wizard-shop-category" data-category="'+k+'"'+(wizardShopCategory===k?' class="is-active" aria-pressed="true"':' aria-pressed="false"')+'>'+name+'</button>').join("");
 const items=CATALOG.filter(it=>wizardShopCategory==="all"||it.kind===wizardShopCategory)
 .map(it=>{const purchasable=it.kind!=="focus"&&it.priceVT!=null&&Number(it.priceVT)>0,price=Number(it.priceVT),details=[it.kind==="focus"?"Foco elemental":null,it.die?"d"+it.die:"Integridade "+(it.integrity?.max??"—"),it.category||"",...(it.properties||[]).slice(0,2)].filter(Boolean);
  return '<article class="fp-wiz-shop-item"><div><strong>'+esc(it.name)+'</strong><small>Grau '+it.grade+'</small></div><p>'+details.map(esc).join(" · ")+'</p><footer><b>'+(purchasable?price+' VT':it.kind==="focus"?"Fabricação por Artesão":"Preço pendente")+'</b>'+(purchasable?'<button type="button" data-action="wizard-buy-item" data-item="'+esc(it.name)+'"'+(remaining>=price&&!changed?'':' disabled')+'>'+(changed?'Confirme recursos':remaining<price?'Sem VT':'Comprar')+'</button>':'<span class="fp-wiz-muted">'+(it.kind==="focus"?"Foco de fabricação; não é compra direta":"Não disponível para compra")+'</span>')+'</footer></article>';}).join("");
 const owned=state.items.length?state.items.map(it=>'<div class="fp-wiz-owned-item"><span><strong>'+esc(it.name)+'</strong><small>G'+it.grade+' · '+esc(it.type)+' · '+(it.equipped?'Equipado':'No inventário')+'</small></span><button type="button" data-action="equip" data-id="'+esc(it.id)+'">'+(it.equipped?'Guardar':'Equipar')+'</button></div>').join(""):'<p>Nenhum equipamento comprado. Você pode continuar sem comprar itens.</p>';
 return '<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 04 · PATRIMÔNIO INICIAL</span><h3>VT e equipamentos iniciais.</h3><p><strong>VT (Valor de Troca)</strong> é uma referência de escambo, não moeda. São <strong>20 VT iniciais experimentais</strong>, separados dos 18 XP.</p></div>'+
 '<div class="fp-wiz-vt-stats"><div><small>VT INICIAIS</small><strong>'+STARTING_VT+'</strong></div><div><small>VT DISPONÍVEIS</small><strong>'+remaining+'</strong></div><div><small>VT GASTOS</small><strong>'+spent+'</strong></div></div>'+
 '<section class="fp-wiz-vt-section"><h4>Distribuição inicial dos recursos</h4><p>São cinco recursos de Grau 1; a distribuição inicial sugerida é de 4 unidades para cada. Você pode alterá-la antes da primeira compra.</p><div class="fp-wiz-vt-grid">'+resources+'</div>'+
 '<div class="fp-wiz-vt-actions"><strong>'+sum+(editable?' / '+STARTING_VT+' VT distribuídos':' VT restantes')+'</strong>'+(editable?'<button type="button" data-action="wizard-vt-allocate"'+(sum!==STARTING_VT?' disabled':'')+'>Confirmar distribuição</button>':'<span>Distribuição já consolidada.</span>')+'</div></section>'+
 '<section class="fp-wiz-vt-section"><h4>Comprar itens G1</h4><p>Os preços e alcances do catálogo são <strong>PROPOSTOS</strong> para playtest; não há equipamento gratuito presumido.</p>'+
 '<label class="fp-wiz-shop-preferred">Recurso usado primeiro na troca <select data-wizard-trade-preferred>'+
 RESOURCES.map(([k,name])=>'<option value="'+k+'"'+(wizardTradePreferred===k?' selected':'')+'>'+esc(name)+'</option>').join("")+'</select></label>'+
 '<div class="fp-wiz-shop-tabs">'+tabs+'</div><div class="fp-wiz-shop-catalog">'+(items||'<p>Nenhum item cadastrado nesta categoria.</p>')+'</div></section>'+
 '<section class="fp-wiz-vt-section"><h4>Seus itens iniciais</h4><div class="fp-wiz-owned-list">'+owned+'</div></section>'+
 '<div class="fp-wiz-reminder"><strong>VT não é XP</strong><p>Você não precisa gastar todo o patrimônio. Itens comprados aparecem na ficha e podem ser equipados conforme as regras.</p></div>';
}
function wizardReview(){
 const x=xpCosts(),life=maxLife(),move=movement(),defense=defensePresentation();
 const sourceSummary=(group,items)=>items.filter(([k])=>(state[SOURCE_PROPS[group]][k]||0)>0)
  .map(([k,name])=>'<li>'+esc(name)+' <b>G'+state[SOURCE_PROPS[group]][k]+'</b></li>').join("")||'<li class="fp-wiz-muted">Nenhum avanço comprado</li>';
 const skillList=SKILLS.filter(([id])=>ownsSkill(id)).map(([id,name])=>'<li>'+esc(name)+(racialGrants(state).includes(id)?' <small>(origem · 0 XP)</small>':'')+'</li>').join("")||'<li class="fp-wiz-muted">Nenhuma Perícia comprada</li>';
 return '<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 05 · REVISÃO FINAL</span><h3>Este é seu Aprendiz.</h3>'+
  '<p>Confira os investimentos antes de abrir a ficha completa. Depois da confirmação, as compras realizadas deixam de ter reembolso livre.</p></div>'+
  '<div class="fp-wiz-review-hero"><div class="fp-wiz-avatar"><img src="'+esc(state.portrait||"../assets/codex-logo.svg")+'" alt=""'+(state.portrait?' class="custom"':'')+'></div>'+
  '<div><small>APRENDIZ · NÍVEL '+state.level+'</small><h4>'+esc(state.name||"Sem nome")+'</h4><p>'+esc(RACES[state.race]?.[0]||"Humano")+' · '+esc(state.concept||"Profissão por descobrir")+'</p></div></div>'+
  '<div class="fp-wiz-review-stats"><div><small>VIDA</small><b>'+life+'</b></div><div><small>'+esc(defense.label)+'</small><b>'+defense.value+'</b></div><div><small>DESLOCAMENTO</small><b>'+move+' m</b></div><div><small>XP INVESTIDO</small><b>'+x.total+'</b></div></div>'+
  '<div class="fp-wiz-review-list"><section data-source-group="attr"><h4>Atributos</h4><ul>'+sourceSummary("attr",A)+'</ul></section>'+
  '<section data-source-group="know"><h4>Conhecimentos</h4><ul>'+sourceSummary("know",K)+'</ul></section>'+
  '<section data-source-group="practice"><h4>Práticas</h4><ul>'+sourceSummary("practice",P)+'</ul></section>'+
  '<section><h4>Perícias</h4><ul>'+skillList+'</ul></section></div>'+
  '<div class="fp-wiz-reminder"><strong>18 XP iniciais · orçamento compartilhado</strong>'+
  '<p>Atributos: '+x.attributes+' XP · Formação: '+x.training+' XP · Perícias: '+x.skills+' XP · saldo: '+x.free+' XP. Ao menos um Atributo e um Conhecimento ou Prática precisam alcançar Grau 1.</p></div>'+
  '<div class="fp-wiz-reminder"><strong>Patrimônio inicial · '+walletValue()+' VT restantes</strong>'+
  '<p>20 VT experimentais para escambo. Itens adquiridos: '+(state.items.length?state.items.map(it=>esc(it.name)).join(", "):"nenhum")+'. É possível começar sem equipamentos comprados.</p></div>';
}
function wizardOverview(){
 const x=xpCosts();
 return '<div class="fp-wiz-summary-top"><small>SEU PERSONAGEM</small><strong>'+esc(state.name||"Novo Aprendiz")+'</strong>'+
  '<p>'+esc(state.concept||"Seu caminho ainda está por ser escrito")+' · '+esc(RACES[state.race]?.[0]||"Humano")+'</p></div>'+
  '<div class="fp-wiz-sidebar-title">XP · CODIFICAÇÃO</div>'+
  '<div class="fp-wiz-summary-total"><span>INVESTIDOS</span><strong>'+x.total+' / 18 XP</strong></div>'+
  '<div class="fp-wiz-budget-row"><span>Atributos</span><b>'+x.attributes+' XP</b></div>'+
  '<div class="fp-wiz-budget-row"><span>Conhecimentos e Práticas</span><b>'+x.training+' XP</b></div>'+
  '<div class="fp-wiz-budget-row"><span>Perícias</span><b>'+x.skills+' XP</b></div>'+
  '<div class="fp-wiz-summary-total"><span>DISPONÍVEIS</span><strong>'+x.free+' XP</strong></div>'+
  '<div class="fp-wiz-sidebar-title">VT · PATRIMÔNIO</div>'+
  '<div class="fp-wiz-budget-row"><span>VT disponíveis</span><b>'+walletValue()+' VT</b></div>'+
  '<div class="fp-wiz-budget-row"><span>Itens</span><b>'+state.items.length+'</b></div>'+
  '<div class="fp-wiz-sidebar-title">ESTATÍSTICAS</div>'+
  '<div class="fp-wiz-pairs"><span>Vida</span><b>'+maxLife()+'</b><span>Deslocamento</span><b>'+movement()+' m</b>'+
  '<span>DE</span><b>'+deDefense()+'</b><span>Coragem</span><b>'+state.courage+'</b></div>'+
  '<p class="fp-wiz-sidebar-note">Para concluir, compre um Atributo e um Conhecimento ou Prática no grau 1. Depois, todo o XP restante é livre, inclusive para Perícias. Listas e Codex Genético compartilham o mesmo saldo.</p>';
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
 $("xp-shortcut").hidden=show;$("start-wizard").hidden=NPC_MODE;
 $("page-title").innerHTML=show?'Construa seu <span>Aprendiz.</span>':'Ficha de personagem <span>jogável.</span>';
 $("page-subtitle").textContent=show?
  "Criação guiada: o Codex Genético é o modo principal para Atributos, Conhecimentos, Práticas e Perícias.":
  "Criação, evolução, edição e rolagens em uma única ficha do Codex RPG.";
 if(!show)return;
 $("wizard-steps").innerHTML=WIZARD_STEPS.map(([title,,desc],i)=>{
  const canConfirmStarter=wizardStep===1&&wizardStarterPhase==="confirm"&&!!wizardStarterAttribute&&!!wizardStarterTraining;
  const clickable=(i<=wizardReached||(i===2&&canConfirmStarter))&&(i===0||!!state.name.trim());
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
    ["race","Origem / Raça","",0],
    ["virtue","Virtude","O que o move?",60],
    ["personality","Personalidade","Como reage ao mundo?",100]
   ].map(([field,label,placeholder,max])=>field==="race"?raceForm():'<label class="fp-wiz-field'+(field==="name"?' wide':'')+'">'+label+
    '<input data-wizard-field="'+field+'" type="text" maxlength="'+max+'" placeholder="'+placeholder+'" value="'+esc(state[field])+'"></label>').join("")+
   raceBenefitsForm()+'</div></div><div class="fp-wiz-reminder"><b>Liberdade de construção</b><p>O conceito é narrativo. A profissão emerge dos Atributos, Conhecimentos, Práticas, Perícias e escolhas feitas durante o jogo.</p></div>';
 }else if(stage===1){
  content=wizardStarterCards();
 }else if(stage===2){
   content='<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 03 · COMPRAR GRAUS E PERÍCIAS</span>'+
   '<h3>Construa seu Aprendiz.</h3><p>O <strong>Codex Genético</strong> é o modo principal. Se preferir, use as listas opcionais. Ambas as visualizações usam o mesmo personagem, as mesmas compras e o mesmo XP.</p></div>'+
   wizardBuild();
  }else if(stage===3){
   content=wizardEquipment();
  }else content=wizardReview();
 $("wizard-content").innerHTML=content;
 $("wizard-summary").innerHTML=wizardOverview();
 if(stage===2&&wizardMode==="genetic")renderGenetic();
 $("wizard-controls").innerHTML='<div class="fp-wiz-footer-left"><span>ETAPA '+(stage+1)+' DE '+WIZARD_STEPS.length+'</span><small>'+esc(WIZARD_STEPS[stage][1])+'</small></div>'+
  '<div class="fp-wiz-footer-buttons"><button type="button" class="fp-secondary" data-action="wizard-back"'+(stage===0?' disabled':'')+'>← Voltar</button>'+
  '<button type="button" class="fp-primary-btn" data-action="'+(stage===4?'wizard-finish':'wizard-next')+'"'+(stage===1&&wizardStarterPhase!=="confirm"?' disabled':'')+'>'+
  (stage===4?'Concluir e abrir a ficha →':stage===1?(wizardStarterPhase==='confirm'?'Confirmar escolhas e abrir etapa 3 →':wizardStarterPhase==='training'?'Selecione um Conhecimento ou Prática':'Selecione um Atributo'):'Continuar →')+'</button></div>';
}

function renderVitals(){
 const lifeMaxValue=maxLife();state.life=clamp(state.life,0,lifeMaxValue);state.pp=clamp(state.pp,0,maxPP());
 $("life-text").textContent=state.life+" / "+lifeMaxValue;
 $("courage-text").textContent=state.courage+" / 10";
 $("pp-text").textContent=state.pp+" / "+maxPP();
 const defense=defensePresentation();
 $("de-label").textContent=defense.label;
 $("de-text").textContent=defense.value;$("balance-text").textContent=balance();
 const protection=equippedArmor();
 const integrity=$("armor-integrity-text"),integrityCaption=$("armor-integrity-caption");
 if(integrity)integrity.textContent=protection?(protection.max>0?protection.hp+" / "+protection.max:"0 · Sem Integridade"):"Nenhuma";
 if(integrityCaption)integrityCaption.textContent=protection?
  (protection.name+" · "+(protection.max>0?"Integridade atual / máxima":"armadura sem Integridade")+
   " · registro manual de dano"):"Equipe uma armadura no Inventário";
 $("de-caption").textContent=defense.caption;
 $("load-text").textContent=pad(loadUsed())+" / "+capacity();
 const loadCaption=$("balance-caption"),blocks=$("load-blocks");
 if(loadCaption)loadCaption.textContent=NPC_MODE?"Balanço natural de criatura pendente":pad(loadPercent())+"% da capacidade";
 if(blocks){blocks.hidden=NPC_MODE;blocks.innerHTML=NPC_MODE?"":loadBlocksMarkup();blocks.setAttribute("aria-label","Carga física: "+pad(loadPercent())+"% ocupados, balanço "+balance());}
 $("move-text").textContent=movement()+" m";
 $("move-caption").textContent="8 + "+(state.attributes.agilidade||0)+" Agilidade + ⌊"+(state.practices.atletismo||0)+"/3⌋ Atletismo";
 const health=lifeStage(),names=["Saudável","Ferido","Incapacitado","Inconsciente"];
 const bands=health.bands;
 $("life-boxes").setAttribute("aria-label","Quatro estados de Saúde: "+bands.join(" / ")+". Atual: "+health.label);
 $("life-boxes").innerHTML=bands.map((amount,i)=>{
  const lower=bands.slice(i+1).reduce((total,n)=>total+n,0);
  const current=clamp(state.life-lower,0,amount);
  return '<span title="'+names[i]+': '+current+'/'+amount+'" class="'+(current>0?"filled":"")+
   ((i===2&&health.id==="incapacitado")||(i===3&&health.id==="inconsciente")?" critical":"")+'"></span>';
 }).join("");
 const effects=(health.e?health.e+"E ":"")+(health.a?health.a+"A ":"")+(health.p?"+"+health.p+"P ":"");
 $("life-recovery").textContent=health.label+" · "+(effects.trim()||"sem penalidade")+
  (health.coragem&&Number.isFinite(health.coragem)?" · "+health.coragem+" Coragem para agir":"")+
  " · Cura: revisão pendente";
}
function renderSources(){
 for(const group of ["attr","practice","know"]){
  const html=GROUPS[group].map(([id,name])=>{
   const g=state[SOURCE_PROPS[group]][id]||0,source={group,key:id};
   const nextCost=xpStepCost(group,id,1),canEdit=(viewMode==="builder"&&!state.creationLocked)||editMode;
   const canRaise=(canEdit||state.creationLocked)&&!state.pending&&g<6&&canAfford(group,nextCost);
   const canReduce=canEdit&&g>0&&!state.pending&&!(g===1&&isRacialGradeOne(group,id));
   const isBase=same(source,draft.base),isAttr=same(source,draft.attribute),isThird=same(source,draft.third);
   const flag=isBase?"BASE":isAttr?"ATRIBUTO":isThird?"COMPLEMENTO":"";
   const title=label(group,id),dice=dataDice(group,g);
   const band=racialXpBand(group,id);
   return '<div class="fp-source-item '+(isBase?"fp-is-base":isAttr?"fp-is-attr":isThird?"fp-is-third":"")+(band==="normal"?"":" is-xp-"+band)+'">'+
    '<button type="button" class="fp-source-pick" data-action="source" data-group="'+group+'" data-key="'+id+'" aria-pressed="'+!!flag+'" title="'+(editMode?"Modo edição: use + ou −":"Selecionar fonte")+'" '+(state.pending||editMode?"disabled":"")+'>'+
    '<span class="fp-src-title"><span>'+esc(title)+'</span>'+(flag?'<span class="fp-flag">'+flag+'</span>':"")+'</span>'+
    racialXpMarker(group,id)+
    '<span class="fp-dice-list">'+dice.map(n=>'<span class="fp-die-badge fp-die-d'+n+'">'+dieIcon(n)+'<span>d'+n+'</span></span>').join("")+'</span></button>'+
    '<div class="fp-grade-controls"><button type="button" data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="1" aria-label="Aumentar grau de '+esc(title)+'" '+(!canRaise||state.pending?"disabled":"")+'>+</button>'+
    '<b>'+g+'</b><button type="button" data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="-1" aria-label="Reduzir grau de '+esc(title)+'" '+(!canReduce?"disabled":"")+'>−</button><small class="fp-xp-step-cost">'+(g<6?'+'+nextCost+' XP':'MAX')+'</small></div></div>';
  }).join("");
  $({know:"knowledge-list",attr:"attribute-list",practice:"practice-list"}[group]).innerHTML=html;
 }
}
function usingDiscipline(){return draft.base?.group==="practice"&&draft.base.key==="armas_conjuracao";}
function disciplineAdvancedActive(){return usingDiscipline()&&ownsSkill("disciplina-avancada")&&(state.practices.armas_conjuracao||0)>=2;}
function stealthAdvancedActive(){return draft.base?.group==="practice"&&draft.base.key==="furtividade"&&ownsSkill("furtividade-avancada")&&(state.practices.furtividade||0)>=2;}
function canSecondAttribute(){return disciplineAdvancedActive()||stealthAdvancedActive();}
function mayThird(){return disciplineAdvancedActive()||stealthAdvancedActive();}
function canUseShared(){
 if(!usingDiscipline())return true;
 // Disciplina permite rolagem marcial sem Perícia habilitadora; a conjuração requer sua habilitação.
 return draft.mode==="armas"||(draft.mode==="conjuracao"&&ownsSkill("criar-item-foco-magia"));
}
function selectSource(group,k){
 if(editMode){toast("Edição ativa: use + ou − para ajustar graus.");return;}
 if(state.pending){toast("Finalize ou descarte a rolagem pendente primeiro.");return;}
 const source={group,key:k};
 if(group==="attr"){
  if(canSecondAttribute()&&draft.attribute&&!same(source,draft.attribute)){
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
  if(draft.third.group==="attr"&&!canSecondAttribute())errors.push("Segundo Atributo exige Disciplina Avançada com Disciplina ou Furtividade Avançada com Furtividade.");
  if(!mayThird())errors.push("Falta Perícia pertinente para a terceira fonte.");
  else if(!draft.contextOK)errors.push("Confirme a pertinência da terceira fonte com o Narrador.");
 }
 if(!canUseShared())errors.push("Conjuração exige Criar Item de Foco e Magia (a Perícia substitui Aprendiz de Conjurador e Magia Única). Uso marcial básico de Disciplina é livre.");
 for(const s of [draft.base,draft.attribute,...(draft.third?[draft.third]:[])]){
  const grade=state[SOURCE_PROPS[s.group]][s.key]||0;
  dataDice(s.group,grade).forEach((sides,index)=>pool.push({id:key(s)+":"+index,group:s.group,key:s.key,sides,baseSides:sides}));
 }
 if(usingDiscipline()&&draft.equipmentId){
  const item=state.items.find(x=>x.id===draft.equipmentId);
  const dice=combatItem(item,draft.mode);
  if(!dice.length)errors.push("Equipe um item e adquira a Perícia de arma/foco ou elemento pertinente para receber seus dados.");
  else dice.forEach((sides,index)=>pool.push({id:"equipment:"+item.id+":"+index,group:"equipment",key:item.name,sides,baseSides:sides}));
 }
 if(draft.step){
  const target=pool.find(d=>d.id===draft.stepDieId);
  const next={4:6,6:10,10:12}[target?.baseSides];
  if(next)target.sides=next;
  else errors.push("Selecione um dado elegível da pilha para elevar por 1 Coragem (d4→d6→d10→d12).");
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
   '<div class="fp-alert">Experimente <strong>Disciplina + Força</strong>. Com Disciplina Avançada (ou Furtividade Avançada nos testes de Furtividade), acrescente a terceira fonte pertinente. A composição numérica pode ser igual, mas o tipo de teste muda.</div>'+
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
 if(usingDiscipline()&&!draft.equipmentId){
  const eligible=state.items.filter(x=>combatItem(x,draft.mode).length>0);
  if(eligible.length===1)draft.equipmentId=eligible[0].id;
 }
 const {errors,pool}=buildPool(),cost=Number(draft.extraKeep)+Number(draft.step);
 const isShared=draft.base.group==="practice"&&draft.base.key==="armas_conjuracao";
 const usage=isShared?(draft.mode==="conjuracao"?"Disciplina · Conjuração":"Disciplina · Armas"):label(draft.base.group,draft.base.key);
 const canTrevas=isShared&&draft.mode==="conjuracao"&&ownsSkill("trevas");
 const select=(field,values,selected)=>'<select data-option="'+field+'">'+values.map(([id,name])=>'<option value="'+id+'"'+(selected===id?" selected":"")+'>'+esc(name)+'</option>').join("")+'</select>';
 const modes=[["armas","Disciplina — Armas"],["conjuracao","Disciplina — Conjuração"]];
 const weight=[["leve","Muito Leve / Leve"],["medio","Média"],["pesado","Pesada / Muito Pesada"]];
 const selectedItem=state.items.find(x=>x.id===draft.equipmentId);
 const gearOptions=usingDiscipline()?'<label class="fp-form-field full">Arma ou foco equipado (dado extra, exige Perícia)'+
   select("equipmentId",[["","Sem dado adicional"],...state.items.filter(x=>x.equipped&&["arma","foco"].includes(x.type))
     .map(x=>[x.id,x.name+(combatItem(x,draft.mode).length?" · "+combatItem(x,draft.mode).map(n=>"d"+n).join("+"):" · Perícia não habilitada")])],draft.equipmentId)+
   '</label>':'';
 const stepOptions=pool.filter(d=>Object.hasOwn({4:6,6:10,10:12},d.baseSides))
  .map(d=>[d.id,label(d.group,d.key)+" · dado "+(Number(d.id.split(":").at(-1))+1)+" · d"+d.baseSides+" → d"+({4:6,6:10,10:12}[d.baseSides])]);
 const checks= '<label class="fp-checkline"><input type="checkbox" data-option="extraKeep"'+(draft.extraKeep?" checked":"")+'> Manter 1 dado adicional (1 Coragem)</label>'+
 '<label class="fp-checkline"><input type="checkbox" data-option="step"'+(draft.step?" checked":"")+'> Elevar um dado à escolha (1 Coragem)</label>'+
 (draft.step?'<label class="fp-form-field full">Dado que receberá a elevação '+select("stepDieId",[["","Selecione qual dado elevar"],...stepOptions],draft.stepDieId)+'</label>':"")+
 '<label class="fp-checkline full"><input type="checkbox" data-option="weightEnabled"'+(draft.weightEnabled?" checked":"")+'> Aplicar afinidade de peso do ataque × armadura do alvo / porte natural (se pertinente)</label>'+
 (canTrevas?'<label class="fp-checkline full"><input type="checkbox" data-option="trevas"'+(draft.trevas?" checked":"")+'> Usar técnica de Trevas (+2P antes da DE; 1 PP ou 1 Coragem no acerto)</label>':"")+
 (draft.third?'<label class="fp-checkline fp-context full"><input type="checkbox" data-option="contextOK"'+(draft.contextOK?" checked":"")+'> Confirmo que a Perícia permite este complemento na ação declarada, sob validação do Narrador.</label>':"");
 const options='<div class="fp-form-grid">'+(isShared?'<label class="fp-form-field full">Uso da Prática compartilhada '+select("mode",modes,draft.mode)+'</label>':"")+gearOptions+
 '<label class="fp-form-field">Dificuldade de Êxito <input data-option="de" type="number" min="0" max="30" value="'+draft.de+'"></label>'+
 '<label class="fp-form-field">Condição da ação '+select("situation",Object.entries(SITUATIONS).map(([k,v])=>[k,v[0]]),draft.situation)+'</label>'+
 (draft.weightEnabled?'<label class="fp-form-field">Peso tático do ataque '+select("attackWeight",[["leve","Leve"],["medio","Médio"],["pesado","Pesado"]],draft.attackWeight)+'</label><label class="fp-form-field">Armadura do alvo humanoide (ou porte de criatura) '+select("targetWeight",weight,draft.targetWeight)+'</label>':"")+
 checks+'</div>';
 const poolHTML='<div class="fp-pill-row">'+pool.map(d=>'<span class="fp-pool-die">'+dieIcon(d.sides)+' d'+d.sides+' <span>'+esc(label(d.group,d.key))+'</span></span>').join("")+'</div>';
 box.innerHTML=step+'<div class="fp-prepare-title">'+esc(usage)+'</div><p class="fp-prepare-description">A Base determina o tipo de ação. Atributo e complemento não alteram sua natureza automaticamente.</p>'+
 options+'<p class="fp-caption" style="margin-top:10px">Pilha: '+pool.length+'/9 dados · Retenção: '+keepLimit(false)+' ou '+keepLimit(true)+' com Coragem · Custo previsto: '+cost+' Coragem.</p>'+poolHTML+
 (draft.third?'<p class="fp-caption">Para trocar o complemento, escolha outra fonte pertinente. Com Disciplina Avançada, pode acrescentar inclusive outro Atributo quando a Base é Disciplina.</p>':
 '<p class="fp-caption">'+(mayThird()?"Uma terceira fonte pode ser acrescentada por clique, respeitando a habilitação e a confirmação contextual.":"Sem Perícia de combinação, são duas fontes. Disciplina Avançada e Furtividade Avançada habilitam complemento em suas ações.")+'</p>')+
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
 const health=lifeStage();
 if(health.id==="morto"){toast("Vida zero: personagem morto não pode agir.");return;}
 const precoPrevisto=health.coragem+Number(draft.extraKeep||0)+Number(draft.step||0);
 if(precoPrevisto>state.courage){toast("Coragem insuficiente: "+health.label+" e a preparação exigem "+precoPrevisto+" Coragem.");return;}
 if(editMode){toast("Conclua a edição antes de rolar.");return;}
 if(state.pending){toast("Uma rolagem anterior aguarda finalização.");return;}
 const data=buildPool();
 if(data.errors.length){toast(data.errors[0]);renderComposer();return;}
 state.pending={created:new Date().toISOString(),base:{...draft.base},attribute:{...draft.attribute},
  third:draft.third?{...draft.third}:null,mode:draft.mode,
  opts:{de:draft.de,situation:draft.situation,extraKeep:draft.extraKeep,step:draft.step,stepDieId:draft.step?draft.stepDieId:"",healthId:health.id,combatBonus:false,equipmentId:draft.equipmentId,
    weightEnabled:draft.weightEnabled,attackWeight:draft.attackWeight,targetWeight:draft.targetWeight,trevas:!!draft.trevas},
  dice:data.pool.map(d=>({...d,face:randomFace(d.sides)})),selected:[],cancelP:0,pairs:0,pass:0,characteristic:"",secondCharacteristic:"",payment:"courage"};
 playRollSound();draft=freshDraft();save();render();
 toast("Dados rolados. Mantenha quaisquer dados da pilha, respeitando o limite.");
}
// v0.68: target é a armadura do alvo humanoide (Muito Leve/Leve => leve; Pesada/Muito Pesada => pesado),
// ou porte natural validado pelo Narrador em criatura. Nunca inferir pelo inventário do alvo.
function affinity(attack,target){
 const matrix={leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}};
 return matrix[attack]?.[target]||0;
}
function score(){
 const p=state.pending;if(!p)return null;
 const health=LIFE_STATES[p.opts.healthId]||lifeStage();
 const dice=p.dice.filter(x=>p.selected.includes(x.id)),errs=[];
 if(p.opts.trevas&&!(p.mode==="conjuracao"&&p.base.group==="practice"&&p.base.key==="armas_conjuracao"&&ownsSkill("trevas")))
  errs.push("A técnica de Trevas exige Disciplina em Conjuração e Perícia em Elemento Trevas.");
 if(dice.length===0)errs.push("Selecione os dados que deseja manter.");
 if(dice.length>keepLimit(p.opts.extraKeep))errs.push("Limite de retenção excedido.");
 if(!p.dice.some(x=>x.group==="attr"))errs.push("É obrigatório rolar pelo menos um dado de Atributo.");
 const raw=[0,0,0];
 for(const d of dice){const f=face(d.sides,d.face);for(let i=0;i<3;i++)raw[i]+=f[i];}
 const critTier=dice.length>=2&&dice.every(d=>d.face===d.sides)?dice.length:0;
 const criticalConverted=critTier&&raw[2]>0?1:0;
 const item=state.items.find(x=>x.id===p.opts.equipmentId);
 const properties=item?.equipped?(item.properties||[]):[];
 const el=(item?.element||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
 const elementSkill={ar:"vento",vento:"vento",agua:"agua",fogo:"fogo",terra:"terra",
  veneno:"veneno",sagrado:"sagrado",trevas:"trevas",sangue:"sangue"}[el];
 // SRD v0.43: foco válido + Perícia do elemento + Criar Item de Foco e Magia.
 const freeElementEffect=p.mode==="conjuracao"&&item?.type==="foco"&&item.equipped
  &&ownsSkill("criar-item-foco-magia")&&!!elementSkill&&ownsSkill(elementSkill);
 // v0.69: Barulhenta sempre concede +1P passivo, inclusive no crítico.
 const pBonus=properties.includes("Barulhenta")?1:0;
 // Perfurante de arma de fogo é passivo se a arma possui a propriedade.
 const passivePiercing=!!(item?.equipped&&item.firearm&&properties.includes("Perfurante"));
 const pAvailable=Math.max(0,raw[2]+pBonus+(p.opts.trevas?2:0)-criticalConverted+health.p);
 const situation=SITUATIONS[p.opts.situation]||SITUATIONS.normal;
 const w=p.opts.weightEnabled?affinity(p.opts.attackWeight,p.opts.targetWeight):0;
 const eBase=Math.max(0,raw[0]+situation[1]+criticalConverted+(critTier>=3?1:0)+
  (critTier&&properties.includes("Precisa")?1:0));
 const stealthUsed=[p.base,p.third].some(x=>x?.group==="practice"&&x.key==="furtividade");
 const stealthBonus=stealthUsed&&ownsSkill("furtividade")?1:0;
 const aPool=Math.max(0,raw[1]+situation[2]+w+stealthBonus+(critTier>=3?1:0)+
  (critTier&&properties.includes("Longa")?1:0)+(critTier&&properties.includes("Silenciosa")?1:0)+health.a);
 const cancel=clamp(Math.floor(p.cancelP),0,999),pairs=clamp(Math.floor(p.pairs),0,999),pass=clamp(Math.floor(p.pass),0,1);
 if(cancel>pAvailable)errs.push("Não há tantos Pavor restantes para anular.");
 if(cancel+2*pairs+pass>aPool)errs.push("Antecipar insuficiente para os gastos selecionados.");
 // A penalidade de Saúde incide no total de Êxitos, inclusive após converter Antecipar.
 const E=Math.max(0,eBase+pairs+health.e),P=Math.max(0,pAvailable-cancel),remainingA=Math.max(0,aPool-cancel-2*pairs-pass);
 const reached=E+P,success=reached>=p.opts.de;
 const outcome=success?(P===0?"Acerto puro":P>E?"Acerto com Pavor predominante":"Acerto normal com Pavor")
 :(P===0?"Falha limpa":P>E?"Falha com Pavor predominante":"Falha com Pavor");
 let courageCost=Number(p.opts.extraKeep)+Number(p.opts.step)+health.coragem,ppCost=0;
 const active=success&&passivePiercing?["Perfurante"]:[];
 if(success&&p.characteristic){
  if(!properties.includes(p.characteristic)||!ACTIVE_PROPERTIES.has(p.characteristic))
   errs.push("A característica escolhida não é ativável neste equipamento.");
  else if(!active.includes(p.characteristic))active.push(p.characteristic);
  if(p.secondCharacteristic){
   if(!critTier||!properties.includes(p.secondCharacteristic)||!ACTIVE_PROPERTIES.has(p.secondCharacteristic)||
      p.secondCharacteristic===p.characteristic)errs.push("Segunda característica requer crítico e efeito diferente.");
   else active.push(p.secondCharacteristic);
  }
  if(critTier?p.secondCharacteristic:true){
   // Com foco e Perícia do elemento, a propriedade Elemental já habilitada é gratuita.
   const paidFeature=critTier?p.secondCharacteristic:p.characteristic;
   if(!(freeElementEffect&&paidFeature==="Elemental")&&!(passivePiercing&&paidFeature==="Perfurante")){
    if(p.payment==="pp")ppCost+=1;else courageCost+=1;
   }
  }
 }else if(p.secondCharacteristic){errs.push("Escolha primeiro a característica principal.");}
 // Gasto de Trevas preservado no acerto; em falha o custo/ordem permanece pendente no SRD.
 if(p.opts.trevas&&success&&!freeElementEffect){if(p.payment==="pp")ppCost+=1;else courageCost+=1;}
 if(courageCost>state.courage)errs.push("Coragem insuficiente para a rolagem e ativações.");
 if(ppCost>state.pp)errs.push("PP insuficiente para a ativação.");
 const critRecovery=critTier>=3?2:critTier>=2?1:0;
 const damageBasic=success?E+Math.floor(P/2):0;
 // Perfurante NÃO atravessa armadura: P vale 1 dano apenas no cálculo de Integridade.
 // Se o alvo não tiver armadura, ou Perfurante for bloqueado por escudo, vale o dano básico.
 const armorDamage=success&&active.includes("Perfurante")?(E+P)*(critTier===4?2:1):null;
 return{dice,raw,E,P,remainingA,reached,success,outcome,health,damage:damageBasic*(critTier===4?2:1),damageBasic,armorDamage,passivePiercing,errors:errs,
  aPool,courageCost,ppCost,active,range:item?.range?effectiveWeaponRange(item)+(success&&active.includes("Muito Leve")?4:0):0,pAvailable,critTier,critRecovery,criticalConverted,freeElementEffect,elementSkill};
}
function renderPending(){
 const p=state.pending,s=score(),de=p.opts.de,cost=s.courageCost;
 const desc=esc(label(p.base.group,p.base.key))+" + "+esc(label(p.attribute.group,p.attribute.key))+
  (p.third?" + "+esc(label(p.third.group,p.third.key)):"");
 const dice='<div class="fp-rolled-dice">'+p.dice.map(d=>'<button type="button" class="fp-roll-die fp-die-d'+d.sides+' '+(p.selected.includes(d.id)?"kept":"")+'" data-action="keep" data-id="'+esc(d.id)+'" title="Face '+d.face+' do d'+d.sides+'" aria-label="'+esc(label(d.group,d.key))+' · d'+d.sides+' · face '+d.face+'" aria-pressed="'+p.selected.includes(d.id)+'">'+dieIcon(d.sides)+
  '<strong class="fp-face-runes" aria-hidden="true">'+faceRunesMarkup(face(d.sides,d.face),d.face===d.sides)+'</strong><span class="fp-die-source">'+esc(label(d.group,d.key))+' · d'+d.sides+'</span><span class="fp-symbol-line">'+symbolMarkup(face(d.sides,d.face),d.face===d.sides)+'</span></button>').join("")+'</div>';
 const selectNumber=(k,labelText,max,value)=>'<label class="fp-form-field">'+labelText+'<select data-pending="'+k+'">'+
 Array.from({length:Math.max(1,max+1)},(_,i)=>'<option value="'+i+'"'+(Number(value)===i?" selected":"")+'>'+i+'</option>').join("")+'</select></label>';
 const item=state.items.find(x=>x.id===p.opts.equipmentId);
 const specials=(item?.properties||[]).filter(x=>ACTIVE_PROPERTIES.has(x)&&!(item?.firearm&&x==="Perfurante"));
 const chooseEffect=(field,description,selected)=>'<label class="fp-form-field">'+description+'<select data-pending="'+field+'">'+
  [['','Nenhuma'],...specials.map(x=>[x,x])].map(([id,label])=>'<option value="'+esc(id)+'"'+(id===selected?" selected":"")+'>'+esc(label)+'</option>').join("")+'</select></label>';
 const effects=specials.length?'<div class="fp-form-grid">'+
  chooseEffect("characteristic","Característica escolhida",p.characteristic||"")+
  (s.critTier?chooseEffect("secondCharacteristic","Segunda característica (só no crítico)",p.secondCharacteristic||""):"")+
  '<label class="fp-form-field">Pagamento, quando necessário<select data-pending="payment"><option value="courage"'+(p.payment!=="pp"?" selected":"")+'>1 Coragem</option><option value="pp"'+(p.payment==="pp"?" selected":"")+'>1 PP</option></select></label></div>'+
  '<p class="fp-caption">Acerto comum: uma característica por 1 Coragem/1 PP. Crítico: uma grátis e outra paga. Efeitos elementais habilitados com foco e Perícia têm ativação gratuita. Narrador aplica danos/condições.</p>':"";
 const trevasPayment=p.opts.trevas&&!specials.length?(s.freeElementEffect?
 '<p class="fp-caption">Trevas com foco e Perícia correspondente: efeito habilitado gratuito (0 Coragem / 0 PP).</p>':
 '<label class="fp-form-field">Pagamento de Trevas se acertar<select data-pending="payment"><option value="courage"'+(p.payment!=="pp"?" selected":"")+'>1 Coragem</option><option value="pp"'+(p.payment==="pp"?" selected":"")+'>1 PP</option></select></label>'):'';
 const controls='<div class="fp-form-grid">'+
 selectNumber("cancelP","Anular Pavor (1A por 1P)",Math.min(s.pAvailable,s.aPool),p.cancelP)+
 selectNumber("pairs","Converter 2A em 1E",Math.floor(s.aPool/2),p.pairs)+
 selectNumber("pass","Passar ação ao aliado (1A)",1,p.pass)+'</div>'+effects+trevasPayment;
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
 '<p class="fp-caption" style="margin-top:9px">Dano básico se acertar: '+s.damage+'. Pavor não anulado conserva o risco e a transferência pertinente.</p>'+
 (s.armorDamage!==null?'<p class="fp-caption"><strong>Perfurante à Integridade:</strong> '+s.armorDamage+' dano potencial (E + 1 por P não anulado; crítico quando aplicável). Não ignora a armadura nem concede dano extra direto à Vida. Se bloqueado por escudo pertinente, usar dano básico. '+(s.passivePiercing?'Característica passiva da arma de fogo, sem ativação.':'Característica ativada conforme custo normal.')+'</p>':'')+
 (p.opts.trevas?'<p class="fp-caption"><strong>Trevas:</strong> +2P já incluídos na DE; se houver dois alvos, a mesma rolagem deve ser confrontada com cada DE. Divida o Pavor residual o mais igualmente possível (ponto ímpar a alvo escolhido) ou concentre tudo em um alvo; registre manualmente, sem duplicar pontos.</p>':'')+
 (s.active.length?'<p class="fp-caption"><strong>Característica(s) ativada(s):</strong> '+s.active.map(esc).join(", ")+'. Resolver efeitos com Narrador.</p>':'')+'</div>';
 return '<div class="fp-alert"><strong>Resultado já sorteado.</strong> '+desc+'. A rolagem ficará salva até ser finalizada ou descartada explicitamente.</div>'+
 '<p class="fp-caption" style="margin:11px 0">Mantenha até '+keepLimit(p.opts.extraKeep)+' dados à sua escolha. Atributo é obrigatório na rolagem, não entre os mantidos. '+s.dice.length+' selecionado(s). Saúde: '+esc(s.health.label)+
  ' ('+(s.health.e?s.health.e+'E ':'')+(s.health.a?s.health.a+'A ':'')+(s.health.p?'+'+s.health.p+'P':'')+
  '). Custo total previsto: '+cost+' Coragem.</p>'+dice+controls+
 (s.dice.length?stats:"<p class=\"fp-caption\" style=\"margin-top:10px\">Clique nos dados que deseja manter. Só eles geram símbolos.</p>")+
 s.errors.filter(x=>x!=="Selecione os dados que deseja manter.").map(x=>'<div class="fp-alert invalid">'+esc(x)+'</div>').join("")+
 (s.dice.length&&!s.errors.length?"":'<div class="fp-alert">A finalização só fica disponível após uma retenção válida.</div>')+
 '<div class="fp-composer-actions"><button class="fp-secondary" data-action="discard" type="button">Descartar teste...</button>'+
 '<button class="fp-primary-btn" data-action="finalize" type="button"'+(s.errors.length?" disabled":"")+'>Finalizar ação</button></div>';
}
function finalize(){
 const p=state.pending,s=score();
 if(!p||s.errors.length){toast(s?.errors?.[0]||"Rolagem inválida.");return;}
 state.courage=clamp(state.courage-s.courageCost,0,10);state.pp=clamp(state.pp-s.ppCost,0,maxPP());
 const oldCourage=state.courage,oldPP=state.pp;
 if(s.critRecovery){
  state.courage=clamp(state.courage+s.critRecovery,0,10);
  state.pp=clamp(state.pp+s.critRecovery,0,maxPP());
 }
 const gainedCourage=state.courage-oldCourage,gainedPP=state.pp-oldPP;
 const baseName=p.base.group==="practice"&&p.base.key==="armas_conjuracao"?"Disciplina ("+(p.mode==="conjuracao"?"Conjuração":"Armas")+")":label(p.base.group,p.base.key);
 const name=baseName+" + "+label(p.attribute.group,p.attribute.key)+(p.third?" + "+label(p.third.group,p.third.key):"");
 state.history.unshift({date:new Date().toISOString(),name,outcome:s.outcome,de:p.opts.de,reached:s.reached,
  E:s.E,A:s.remainingA,P:s.P,critTier:s.critTier,critConverted:s.criticalConverted,item:state.items.find(x=>x.id===p.opts.equipmentId)?.name||"",active:s.active,
  ppRecovered:gainedPP,courageRecovered:gainedCourage,damage:s.damage,armorDamage:s.armorDamage,health:s.health.id,trevas:!!p.opts.trevas,
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
 if(next<1&&isRacialGradeOne(group,id)){toast("Grau 1 é concedido pela origem e não pode ser removido.");return;}
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
 $("weapon-focus-wrap").hidden=true;
 $("weapon-focus").value=state.weaponFocus;
 $("weapon-focus").disabled=(state.creationLocked&&!editMode)||!!state.pending;
 $("convert-courage").disabled=state.level<5||state.courage<2||state.pp>=maxPP()||state.courageUsedTurn;
 $("courage-skill-message").textContent=state.level<5?"Perícia em Coragem: disponível a partir do nível 5.":state.courageUsedTurn?"Conversão já usada neste turno.":"A conversão pode ser usada uma vez por turno.";
}
function inventorySelect(field,value,values,id){
 return'<select data-item-field="'+field+'" data-id="'+esc(id)+'">'+values.map(([k,v])=>'<option value="'+k+'"'+(k===value?" selected":"")+'>'+esc(v)+'</option>').join("")+'</select>';
}
function renderInventory(){
 const focusSelector=$("focus-test-model");
 if(focusSelector){
  const previous=focusSelector.value,models=CATALOG.filter(x=>x.kind==="focus"&&x.grade===1);
  focusSelector.innerHTML=models.map(x=>'<option value="'+esc(x.name)+'">'+esc(x.name)+'</option>').join("");
  if(models.some(x=>x.name===previous))focusSelector.value=previous;
 }
 const load=loadUsed(),max=capacity(),fill=$("load-bar-fill");
 fill.style.width=Math.min(100,max?load/max*100:0)+"%";fill.classList.toggle("over",load>max);
 $("load-caption").textContent="Carga física: "+pad(load)+" / "+max+" Alto ("+pad(loadPercent())+"%) · Balanço "+balance()+(load>max?" · capacidade excedida":"")+". Focos usam carga convencional.";
 const cargoPanel=$("inventory-cargo-panel");
 if(cargoPanel)cargoPanel.hidden=NPC_MODE;
 if(!NPC_MODE&&cargoPanel){
  $("inventory-cargo-total").textContent=pad(load)+" / "+max+" Alto transportado";
  $("inventory-cargo-balance").textContent=balance()+" · "+pad(loadPercent())+"%";
  const grid=$("inventory-load-grid");
  grid.innerHTML=cargoGridMarkup();
  grid.setAttribute("aria-label",pad(load)+" de "+max+" Alto ocupados ("+pad(loadPercent())+"%). "+balance()+". Cada célula representa 0,05 Alto; cores diferenciam os tipos de item.");
  const parts=cargoCapacitySources();
  $("inventory-capacity-sources").innerHTML=cargoCapacitySourcesMarkup();
  $("inventory-capacity-equation").textContent=parts.map(x=>x.gain).join(" + ")+" = "+max+" Alto · 1 Alto a cada 3 Graus completos";
  const overflow=$("inventory-cargo-overflow");
  overflow.hidden=!(load>max);
  overflow.textContent=load>max?"Capacidade excedida em "+pad(load-max)+" Alto. Nenhuma nova penalidade foi definida.":"";
 }
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
   (it.weight==="muito_leve"?'<div class="fp-item-hint"><strong>Muito Leve:</strong> sem Integridade; +2 DE em todas as defesas.</div>':"")+
   (it.weight==="leve"?'<div class="fp-item-hint"><strong>Leve:</strong> +1 DE em todas as defesas; resistência disponível desde Grau 3.</div>':"")+
   (it.weight==="medio"?'<div class="fp-item-hint"><strong>Média:</strong> 0 DE; resistência específica desde Grau 2.</div>':"")+
   (it.weight==="alto"?'<div class="fp-item-hint"><strong>Pesada:</strong> −1 DE; resistência no Grau 2, segunda resistência no Grau 3.</div>':"")+
   (it.weight==="extremo"?'<div class="fp-item-hint"><strong>Muito Pesada:</strong> −2 DE, exige Vigor 6/Atletismo 6 e tem imunidade física em QUALQUER Grau. G4 pode acumular imunidade elemental sobre a resistência de G2.</div>':"")+
   (canResist1?`<div class="fp-item-hint"><label>Resistência elemental da peça: <input type="text" data-item-field="elementalResistance" data-id="${esc(it.id)}" value="${esc(it.elementalResistance)}" maxlength="70" placeholder="Elemento autorizado"></label></div>`:"")+
   (canResist2?`<div class="fp-item-hint"><label>Segunda resistência (Pesada Grau 3+): <input type="text" data-item-field="secondResistance" data-id="${esc(it.id)}" value="${esc(it.secondResistance)}" maxlength="70" placeholder="Outro elemento da peça"></label></div>`:"")+
   (canImmunize?`<div class="fp-item-hint"><label>Imunidade elemental adicional (Muito Pesada G4): <input type="text" data-item-field="specificImmunity" data-id="${esc(it.id)}" value="${esc(it.specificImmunity)}" maxlength="70" placeholder="Elemento específico; soma à resistência"></label></div>`:"")+
   '<div class="fp-item-hint">Acesso por Grau: G1 desde nível 1 · G2 desde 5 · G3 desde 10 · G4 desde 20. Integridade G1 do catálogo: Muito Leve 0, Leve 7, Média 12, Pesada 17 (valores de playtest). Nos graus superiores sem valor documentado, Integridade PENDENTE.</div>'
  );
  return'<div class="fp-item"><input type="text" value="'+esc(it.name)+'" data-id="'+esc(it.id)+'" data-item-field="name" maxlength="90" aria-label="Nome do item">'+
  inventorySelect("type",it.type,types,it.id)+
  inventorySelect("weight",it.weight,Object.entries(WEIGHTS).map(([id,values])=>[id,values[0]]),it.id)+
  '<div class="fp-item-controls"><button type="button" data-action="integrity" data-id="'+esc(it.id)+'" data-delta="-1" aria-label="Reduzir integridade">−</button><b title="Integridade atual / máxima">Integridade '+it.hp+' / '+it.max+'</b>'+
  '<button type="button" data-action="integrity" data-id="'+esc(it.id)+'" data-delta="1" aria-label="Aumentar integridade">+</button>'+
  '<button type="button" class="'+(it.equipped?"fp-item-equipped":"")+'" data-action="equip" data-id="'+esc(it.id)+'" title="Equipar/guardar">'+(it.equipped?"✓":"○")+'</button>'+
  '<button type="button" data-action="delete-item" data-id="'+esc(it.id)+'" title="Excluir item">×</button></div>'+
  '<div class="fp-item-hint"><label>Grau <input type="number" data-item-field="grade" data-id="'+esc(it.id)+'" min="1" max="4" value="'+it.grade+'" style="width:40px"></label> · '+
  '<label>Qtd. <input type="number" data-item-field="qty" data-id="'+esc(it.id)+'" min="1" max="99" value="'+it.qty+'" style="width:44px"></label> · '+
  '<label>Integridade máxima <input type="number" data-item-field="max" data-id="'+esc(it.id)+'" min="0" max="999" value="'+it.max+'" style="width:50px" '+(it.type==="armadura"&&it.weight==="muito_leve"?"disabled":"")+'> </label>'+
  ' · '+(it.equipped?"Equipado":"No inventário")+'</div>'+
   '<div class="fp-item-hint">Ocupa '+pad(itemLoad(it))+' Alto · '+pad(itemLoad(it)/Math.max(1,capacity())*100)+'% da capacidade de carga</div>'+
  (it.die?'<div class="fp-item-hint"><b>Dado:</b> d'+it.die+' (somente com Perícia pertinente)'+
   ' · <b>Alcance efetivo:</b> '+effectiveWeaponRange(it)+' m'+(effectiveWeaponRange(it)>it.range?' (base '+it.range+' m + Olhos de Águia)':'')+'</div>':'')+
  (it.properties?.length?'<div class="fp-item-hint"><b>Características:</b> '+it.properties.map(esc).join(", ")+'</div>':'')+
  (it.catalogId&&it.type!=="foco"?'<div class="fp-item-hint"><b>Preço de referência:</b> '+it.priceVT+' VT (playtest)</div>':'')+
  armorFields+'</div>';
 }).join(""):'<div class="fp-empty-list">Nenhum item cadastrado. Use <strong>+ Item</strong> para simular equipamento e carga.</div>';
}
function renderTrade(){
 const panel=$("trade-panel");if(!panel)return;
 if(tradeOwner!==state){tradeOwner=state;tradeDraft={...state.trade.resources};}
 const total=walletValue(),spent=state.trade.purchases.reduce((n,x)=>n+x.price,0);
 $("trade-total").textContent=total+" VT";
 $("trade-spent").textContent=spent+" VT";
 if($("crystal-summary")){
  // Não permitir nova seleção de Sangue no nível 1, mas preservar fichas legadas em leitura.
  const elements=["","Fogo","Água","Ar","Terra","Psíquico","Veneno","Sagrado","Trevas",
   ...(state.elementalCrystal.element==="Sangue"?["Sangue"]:[])];
  $("crystal-summary").innerHTML=state.elementalCrystal.quantity?
   '<label>Cristal Elemental inicial (Criar Magia): <select id="crystal-element">'+
   elements.map(x=>'<option value="'+esc(x)+'"'+(x===state.elementalCrystal.element?" selected":"")+'>'+esc(x||"Escolha o elemento")+'</option>').join("")+
   '</select></label>':'<span>Sem Cristal Elemental inicial. Adquira Criar Item de Foco e Magia para receber um.</span>';
 }
 const canAllocate=!state.trade.purchases.length&&!state.trade.collected;
 const draftSum=RESOURCES.reduce((n,[k])=>n+Number(tradeDraft[k]||0),0);
 $("trade-allocate").innerHTML=RESOURCES.map(([key,name])=>
  '<label class="fp-trade-resource">'+name+'<input type="number" min="0" max="'+STARTING_VT+'" step="1" data-trade-draft="'+key+'" value="'+tradeDraft[key]+'"'+(canAllocate?"":" disabled")+'></label>').join("")+
  '<div class="fp-trade-actions"><small>'+draftSum+' / '+STARTING_VT+' VT distribuídos'+(canAllocate?". Altere como preferir antes da primeira compra.":". Distribuição inicial bloqueada após a primeira compra.")+'</small>'+
  (canAllocate?'<button type="button" class="fp-secondary" data-action="trade-allocate"'+(draftSum!==STARTING_VT?" disabled":"")+'>Confirmar distribuição</button>':"")+'</div>';
 $("trade-wallet").innerHTML=RESOURCES.map(([key,name])=>
  '<span class="fp-trade-token">'+esc(name)+' <b>'+state.trade.resources[key]+'</b></span>').join("");
 const catalog=CATALOG.filter(x=>x.kind!=="focus"&&Number(x.priceVT)>0);
 const currentShop=$("shop-items").value,currentPreferred=$("shop-preferred").value;
 $("shop-items").innerHTML='<option value="">Escolha um equipamento</option>'+catalog.map(x=>
  '<option value="'+esc(x.name)+'">'+esc(x.name)+' · '+x.priceVT+' VT · '+(x.die?"d"+x.die:x.integrity?.max+" Integridade")+'</option>').join("");
 $("shop-preferred").innerHTML=RESOURCES.map(([key,name])=>'<option value="'+key+'">'+esc(name)+'</option>').join("");
 if(catalog.some(x=>x.name===currentShop))$("shop-items").value=currentShop;
 if(RESOURCES.some(x=>x[0]===currentPreferred))$("shop-preferred").value=currentPreferred;
 renderStoneShop();
 // Seleção do navegador é preservada quando possível para evitar reset do formulário.
}
function renderStoneShop(){
 const select=$("stone-element");if(!select)return;
 const previous=select.value,common=state.trade.stonePrices.common,rare=common===null?null:3*common;
 state.trade.stonePrices.rare=rare;
 select.innerHTML='<option value="">Escolha uma pedra</option>'+STONE_CATALOG.map(([element,kind])=>
  '<option value="'+esc(element)+'">'+esc(element)+' · '+(state.trade.stonePrices[kind]??"VT pendente")+(state.trade.stonePrices[kind]==null?"":" VT")+(kind==="rare"?" · rara":"")+'</option>').join("");
 if(STONE_CATALOG.some(row=>row[0]===previous))select.value=previous;
 const cp=$("stone-price-common"),rp=$("stone-price-rare");
 if(cp&&document.activeElement!==cp)cp.value=common??"";
 if(rp&&document.activeElement!==rp)rp.value=rare??"";
 const row=STONE_CATALOG.find(x=>x[0]===select.value),valid=Number.isInteger(common)&&common>0&&
  Number.isInteger(rare)&&rare===3*common,price=row?state.trade.stonePrices[row[1]]:null;
 $("stone-buy").disabled=!row||!valid||!Number.isInteger(price)||price>walletValue();
 $("stone-buy").title=valid?"Compra com VT restante.":"Defina o preço comum em VT; Veneno, Sagrado e Trevas custam automaticamente 3× este valor.";
 $("stone-owned").textContent=(state.trade.stones.length?
  "Pedras compradas nesta ficha: "+state.trade.stones.map(x=>x.element+" ("+x.price+" VT)").join(", ")+". ":"")+
  (valid?"Valores definidos pela mesa, não oficiais.":"Preços oficiais PENDENTES. Sangue/Pedra da Alma não comprável no nível 1.");
}
function buyElementalStone(element=$("stone-element")?.value,preferred=$("shop-preferred")?.value){
 const row=STONE_CATALOG.find(x=>x[0]===element);if(!row){toast("Escolha uma pedra disponível.");return;}
 const common=state.trade.stonePrices.common,rare=state.trade.stonePrices.rare;
 if(!Number.isInteger(common)||!Number.isInteger(rare)||common<1||rare!==3*common){
  toast("Defina o preço comum de playtest em VT; pedras especiais custam exatamente 3×.");return;
 }
 const price=state.trade.stonePrices[row[1]];
 if(price>walletValue()){toast("VT insuficiente para a pedra escolhida.");return;}
 if(state.trade.stones.length>=150||state.trade.purchases.length>=150){toast("Limite de registros do comércio atingido.");return;}
 if(!confirm("Comprar Pedra Elemental de "+element+" por "+price+" VT? Preço experimental da mesa; esta compra não concede Perícia, magia ou efeito automaticamente."))return;
 const res={...state.trade.resources},order=[preferred,...RESOURCES.map(([k])=>k)].filter((x,i,a)=>a.indexOf(x)===i);
 let due=price;
 for(const k of order){if(!Object.hasOwn(res,k))continue;const used=Math.min(res[k],due);res[k]-=used;due-=used;}
 if(due)throw Error("Saldo de recursos inconsistente; compra cancelada.");
 state.trade.resources=res;
 state.trade.stones.push({element,price});
 state.trade.purchases.push({name:"Pedra Elemental de "+element,price});
 save();render();toast("Pedra de "+element+" adquirida por "+price+" VT. Efeitos seguem requisitos de Perícia e foco.");
}
function buyCatalogItem(catalogName=$("shop-items")?.value,preferred=$("shop-preferred")?.value){
 const item=CATALOG.find(x=>x.name===catalogName);
 if(!item||item.kind==="focus")return;
 if(item.priceVT==null||!Number.isFinite(Number(item.priceVT))||Number(item.priceVT)<=0){toast("Preço pendente: este item não está disponível para compra.");return;}
 const price=Number(item.priceVT);
 if(price> walletValue()){toast("Recursos insuficientes: este item custa "+price+" VT.");return;}
 if(!confirm("Comprar "+item.name+" por "+price+" VT em recursos de Grau 1?"))return;
 const res={...state.trade.resources},order=[preferred,...RESOURCES.map(([key])=>key)].filter((x,i,a)=>a.indexOf(x)===i);
 let due=price;
 for(const k of order){if(!Object.hasOwn(res,k))continue;const used=Math.min(res[k],due);res[k]-=used;due-=used;}
 if(due)throw Error("Falha no cálculo de recursos; compra cancelada.");
 if(state.items.length>=150){toast("Inventário cheio.");return;}
 state.trade.resources=res;
 state.trade.purchases.push({name:item.name,price});
 state.items.push(normalizedCatalogItem(item));
 render();save();toast(item.name+" adquirido por "+price+" VT. Equipe no inventário.");
}
function addTestFocus(){
 if(!ownsSkill("criar-item-foco-magia")||
    (state.practices.artesao||0)<1||(state.attributes.inteligencia||0)<1||
    (state.practices.armas_conjuracao||0)<1){
  toast("Para testar um foco, adquira Criar Item de Foco e Magia (Disciplina 1, Inteligência 1, Artesão 1).");return;
 }
 if(state.items.length>=150){toast("Inventário cheio.");return;}
 if(!confirm("Adicionar Foco G1 somente para simulação? A fabricação real exige teste com Artesão e recursos ainda não automatizados."))return;
 const model=$("focus-test-model")?.value;
 const row=CATALOG.find(x=>x.kind==="focus"&&x.grade===1&&x.name===model)||CATALOG.find(x=>x.kind==="focus"&&x.grade===1);
 if(!row){toast("Foco de teste não cadastrado.");return;}
 const isElementalModel=row.name!=="Foco de Magia Leve G1";
 if(isElementalModel&&!state.elementalCrystal.element){toast("Escolha o elemento do Cristal Elemental antes de simular varinha ou cetro.");return;}
 const item=normalizedCatalogItem(row);
 item.element=String(state.elementalCrystal.element||"psiquico").toLowerCase();
 item.name=row.name+" de "+(state.elementalCrystal.element||"Psíquico")+" (teste)";
 state.items.push(item);render();save();
 toast("Foco de teste adicionado; fabricação com Artesão continua pendente.");
}
function collectResources(){
 const k=$("collect-type")?.value,n=Math.floor(Number($("collect-amount")?.value||0));
 if(!RESOURCES.some(x=>x[0]===k)||!Number.isSafeInteger(n)||n<1||n>999){toast("Informe quantidade válida de 1 a 999.");return;}
 state.trade.resources[k]=Math.min(100000,state.trade.resources[k]+n);
 state.trade.collected=true;
 render();save();toast("Coleta anotada: +"+n+" "+k+" de Grau 1.");
}

function demo(){
 const s=defaultState();
 s.name="Aprendiz de exemplo";s.concept="Artista de combate";s.origin="Humano";s.virtue="Determinação";s.personality="Criativo";
 s.level=6;s.attributes={forca:2,agilidade:3,destreza:2,inteligencia:1,influencia:1,vigor:3};
 s.knowledges={alquimia:1,medicina:0,protecao:1};
 s.practices={armas_conjuracao:2,atletismo:1,furtividade:1,apresentacao:2};
 s.skills=["armas-medias","disciplina-avancada","criar-item-foco-magia"];
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
  if(!NPC_MODE){
   if(createPlayerSheet(v,{},isNew?"Ficha importada":"Ficha antiga importada"))
    toast("Importada como nova ficha; a anterior continua salva. Confira os dados.");
   return;
  }
  if(!confirm("Substituir a ficha NPC atual pelos dados importados?"))return;
  state=normalize(v);resetPlayerView({});wizardPersist();syncFields();render();save();
  toast(isNew?"Ficha NPC importada.":"Ficha NPC do criador importada parcialmente.");
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
/** Playtest: restituição somente da Perícia comprada, sem reembolsar requisitos mantidos. */
/** Lista completa das Perícias adquiridas, inclusive IDs legados ocultos no grafo. */
function renderRespecSkills(){
 const box=$("respec-skills-list");if(!box)return;
 const owned=SKILLS.filter(([id])=>state.skills.includes(id)); // Reembolso só para compra por XP.
 box.innerHTML=owned.length?owned.map(([id,name,,cost])=>
  '<div class="fp-respec-row"><span><strong>'+esc(name)+'</strong><small>'+
  (Number.isInteger(cost)?cost+" XP investidos":"Custo pendente — conferir ficha")+'</small></span>'+
  '<button type="button" data-action="respec-skill" data-id="'+esc(id)+'"'+
  (!Number.isInteger(cost)||state.pending?' disabled':'')+'>'+
  (Number.isInteger(cost)?"Devolver "+cost+" XP":"Reembolso pendente")+'</button></div>').join(""):
  '<p class="fp-muted">Nenhuma Perícia comprada nesta Ficha.</p>';
}
function refundSkillForPlaytest(id){
  if(racialGrants(state).includes(id)){toast("Perícia racial não gera reembolso de XP.");return;}
 if(state.pending){toast("Finalize ou descarte a rolagem antes de redistribuir XP.");return;}
 const index=state.skills.indexOf(id),row=SKILLS.find(x=>x[0]===id);
 if(index<0||!row||!Number.isInteger(row[3]))return;
 const candidate=structuredClone(state);
 candidate.skills=candidate.skills.filter(skill=>skill!==id);
 const blocking=dependentsValid(candidate);
 if(blocking){toast("Não é possível devolver: outra Perícia depende desta. "+blocking);return;}
 const before=xpCosts().free,after=xpCosts(candidate).free;
 if(after-before!==row[3]){toast("Verificação de XP inconsistente. Compra preservada.");return;}
 if(!confirm("Teste de build: remover "+row[1]+" e devolver "+row[3]+" XP ao saldo da Ficha?\n"+
  "Perícias dependentes precisam ser removidas primeiro. Esta ação não altera o XP total concedido."))return;
 state.skills=candidate.skills;
 if(id==="criar-item-foco-magia"){state.elementalCrystal.quantity=0;state.elementalCrystal.element="";}
 if(draft?.third&&!mayThird())draft.third=null;
 if(draft?.base?.key==="armas_conjuracao")draft.mode=modeDefault();
 render();save();toast("Playtest: "+row[3]+" XP devolvidos. Saldo atual: "+xpCosts().free+" XP.");
}
/** Transferir uma ficha NPC independente, feita pelo próprio Codex Genético, para o encontro. */
function sendNpcToConflict(){
 if(!NPC_MODE)return;
 if(state.pending){toast("Finalize ou descarte a rolagem pendente.");return;}
 if(!state.name.trim()){toast("Informe o nome do NPC.");return;}
 if(!hasStarterSources(state)){toast("O NPC precisa de Atributo G1 e Conhecimento ou Prática G1.");return;}
 if(xpCosts().free<0){toast("A ficha excede o XP disponível.");return;}
 const blocking=dependentsValid(state);if(blocking){toast("Requisito pendente: "+blocking);return;}
 const extra=Math.max(0,Math.floor(Number(state.xpEarned||0)+Number(state.legacyXPRefund||0)));
 const character={
  id:"npc-dna-"+Date.now()+"-"+Math.random().toString(36).slice(2,9),
  kind:"humanoide",name:state.name.trim(),concept:state.concept||state.origin||"Humano comum",
  notes:[state.notes,state.origin?"Origem: "+state.origin:"",state.virtue?"Virtude: "+state.virtue:"",
   state.personality?"Personalidade: "+state.personality:""].filter(Boolean).join("\n").slice(0,4000),
  leader:false,threatGrade:1,level:state.level||1,xp:extra,
  attributes:{...state.attributes},knowledges:{...state.knowledges},
  practices:{...state.practices},skills:[...state.skills],
  life:Math.max(0,Number(state.life)||0),pavorLocal:4,keep:2,courage:state.courage??10,
  abilities:"Construído no Codex Genético. Equipamentos e efeitos especiais devem ser conferidos pelo Narrador.",
  items:[]
 };
 if(!confirm("Enviar o NPC "+character.name+" para Criar Conflito?\nA construção usa o mesmo DNA da Ficha e não substitui seu personagem de jogador.\nEquipamentos deverão ser conferidos e adicionados no encontro."))return;
 try{
  localStorage.setItem(CONFLICT_NPC_INBOX,JSON.stringify({schema:"codex-humanoide-rapido-v1",
   exportedAt:new Date().toISOString(),source:"codex-genetico-npc-v1",character}));
  save();location.href="../criar-conflito/";
 }catch(e){toast("Não foi possível enviar o NPC: "+e.message);}
}

function onClick(event){
 const button=event.target.closest("button");if(!button)return;
 const action=button.dataset.action;
 if(!action)return;
 const {group,key:source,delta,id}=button.dataset;
 switch(action){
 case "wizard-next":wizardSelectStep(wizardStep+1);break;
 case "wizard-starter-attr":wizardStarterSelect("attr",button.dataset.key);break;
 case "wizard-racial-repair":repairRacialG1();break;
 case "wizard-starter-training":wizardStarterSelect(button.dataset.group,button.dataset.key);break;
 case "wizard-starter-edit":if(wizardStep===1){wizardStarterPhase=button.dataset.phase==="attr"?"attr":"training";wizardPersist();renderWizard();}break;
 case "wizard-category":{
  // Retido apenas para compatibilidade com rascunhos da interface antiga.
  break;
 }
 case "wizard-tab":{
  if(wizardStep!==2||!["attr","know","practice","skills"].includes(button.dataset.group))break;
  wizardTab=button.dataset.group;wizardPersist();renderWizard();break;
 }
 case "wizard-mode":{
  if(wizardStep!==2||!["list","genetic"].includes(button.dataset.mode))break;
  wizardMode=button.dataset.mode;wizardPersist();renderWizard();break;
 }
 case "prepare-element":prepareElementSkill(id);break;
 case "wizard-back":if(wizardStep===1)wizardStarterBack();else wizardSelectStep(wizardStep-1);break;
 case "wizard-go":wizardSelectStep(Number(button.dataset.step));break;
 case "wizard-finish":wizardFinalize();break;
 case "wizard-portrait":$("portrait-input").click();break;
 case "human-reroll-use":{
  if(state.race!=="humano"||state.perseverancaUsed||state.pending)return;
  state.perseverancaUsed=true;renderRacePanel();save();toast("Perseverança usada. Rerrole o teste manualmente.");break;
 }
 case "human-long-rest":{
  if(state.race!=="humano"||!state.perseverancaUsed||state.pending)return;
  if(!confirm("Confirmar que o personagem concluiu um descanso longo?"))return;
  state.perseverancaUsed=false;renderRacePanel();save();toast("Perseverança Humana restaurada.");break;
 }
 case "hemo-record-damage":{
  if(!ownsSkill("sangue")||state.pending)return;
  // SRD v0.72: cada ponto de dano DIRETO aplicado à Vida gera 1 marca (não por ataque).
  // Dano absorvido pela armadura, Sangramento sem dano e custos não aprovados não são marcados automaticamente.
  const amount=Number($("hemo-damage-points")?.value);
  const pool=$("hemo-damage-pool")?.value;
  if(!Number.isInteger(amount)||amount<1||amount>999){
   toast("Informe um número inteiro de pontos de dano direto à Vida (1 a 999 por registro).");return;
  }
  if(!["spilled","extracted"].includes(pool))return;
  if(state.hemomancy[pool]+amount>999){
   toast("O contador comporta até 999 marcas; corrija ou consuma marcas antes de registrar mais.");return;
  }
  state.hemomancy[pool]+=amount;
  renderHemomancy();save();
  toast(amount+" "+(amount===1?"marca registrada":"marcas registradas")+" de sangue "+(pool==="spilled"?"derramado":"extraído")+". Uma marca por ponto de Vida perdido.");
  break;
 }
 case "hemo-spend":{
  if(!ownsSkill("sangue")||state.pending)return;
  const pool=button.dataset.pool;
  if(!["spilled","extracted"].includes(pool)||state.hemomancy[pool]<1)return;
  state.hemomancy[pool]-=1;
  renderHemomancy();save();
  toast("1 marca de Sangue consumida em conjuração. Resolva o ataque convencional contra a armadura ou o efeito especial com o Narrador.");
  break;
 }
 case "hemo-adjust":{
  if(!ownsSkill("sangue")||state.pending)return;
  const pool=button.dataset.pool;
  if(!["spilled","extracted"].includes(pool))return;
  state.hemomancy[pool]=clamp(state.hemomancy[pool]+Number(delta),0,999);
  renderHemomancy();save();break;
 }
 case "hemo-self":{
  if(!ownsSkill("sangue")||state.pending)return;
  state.hemomancy.selfBleeding=!state.hemomancy.selfBleeding;
  renderHemomancy();save();break;
 }
 case "hemo-boost":{
  if(!ownsSkill("sangue")||state.pending||state.hemomancy.usedThisTurn)return;
  state.hemomancy.usedThisTurn=true;
  renderHemomancy();save();
  toast("Uso de Sangue como substituto de Coragem marcado (sem custo automático: economia pendente).");break;
 }
 case "hemo-transfusion":{
  const h=state.hemomancy;
  if(!ownsSkill("transfusao-sanguinaria")||(h.spilled+h.extracted)<3||state.life<=0||state.life>=maxLife()||state.pending)return;
  if(!confirm("Registrar Transfusão Sanguinária JÁ RESOLVIDA pelo Narrador? Consome 3 marcas elegíveis de sangue derramado e/ou extraído e registra +1 Vida. Não conte duas vezes o sangue da mesma perda de Vida. Custos de ativação e testes continuam pendentes e NÃO são dispensados pela ficha."))return;
  // Escrituração visual: usar derramado primeiro e completar com extraído, sem alterar custo nem regra.
  const fromSpilled=Math.min(3,h.spilled);
  h.spilled-=fromSpilled;h.extracted-=3-fromSpilled;state.life=clamp(state.life+1,0,maxLife());
  renderVitals();renderHemomancy();save();toast("Transfusão registrada: −3 marcas derramadas, +1 Vida.");break;
 }
 case "source":selectSource(group,source);break;
 case "grade":updateGrade(group,source,Number(delta));break;
  case "gene-grade":geneStageGrade(group+":"+source,Number(delta));break;
  case "gene-skill":geneStageSkill(id);break;
  case "gene-auto-buy":geneAutoBuy(id);break;
  case "gene-confirm":geneCommit();break;
  case "gene-reset":geneDiscard();break;
  case "gene-future":geneShowFuture=!geneShowFuture;if(viewMode==="builder")renderWizard();else renderGenetic();break;
  case "gene-close-detail":geneInspectorOpen=false;renderGenetic();break;
 case "clear":draft=freshDraft();renderSources();renderComposer();break;
 case "roll":roll();break;
 case "wizard-vt-allocate":
 case "trade-allocate":{
  if(state.trade.purchases.length||state.trade.collected)return;
  const total=RESOURCES.reduce((n,[k])=>n+Number(tradeDraft[k]||0),0);
  if(total!==STARTING_VT){toast("Distribua exatamente "+STARTING_VT+" VT entre os recursos comuns.");return;}
  state.trade.resources={...tradeDraft};render();save();toast("Composição dos recursos iniciais atualizada.");break;
 }
 case "trade-buy":buyCatalogItem();break;
 case "stone-buy":buyElementalStone();break;
 case "wizard-buy-item":if(viewMode==="builder"&&wizardStep===3)buyCatalogItem(button.dataset.item,wizardTradePreferred);break;
 case "wizard-shop-category":{
  if(viewMode!=="builder"||wizardStep!==3||!["all","weapon","firearm","armor","shield"].includes(button.dataset.category))break;
  wizardShopCategory=button.dataset.category;wizardPersist();renderWizard();break;
 }
 case "trade-collect":collectResources();break;
 case "focus-test":addTestFocus();break;
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
 case "respec-skill":refundSkillForPlaytest(id);break;
 case "skill":{
  if(racialGrants(state).includes(id)){toast("Perícia de origem gratuita: não pode ser comprada nem devolvida como aquisição normal.");return;}
  if(state.pending){toast("Finalize a rolagem antes de modificar Perícias.");return;}
  const skill=SKILLS.find(x=>x[0]===id);if(!skill)return;
  const existing=state.skills.indexOf(id);
  if(existing<0){
   const reason=skillReq(id);
   if(reason){toast(reason);return;}
   if(!Number.isInteger(skill[3])){toast("Custo pendente.");return;}
   if(!canAfford("skills",skill[3])){toast("XP insuficiente: "+skill[3]+" XP necessários.");return;}
   state.skills.push(id);
   if(id==="criar-item-foco-magia"&&state.elementalCrystal.quantity===0){
    state.elementalCrystal.quantity=1;state.elementalCrystal.element="";
   }
   toast("Perícia comprada: "+skill[1]+" · "+skill[3]+" XP.");
  }else{refundSkillForPlaytest(id);break;}
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
  it.equipped=!it.equipped;
  if(it.equipped&&usingDiscipline()&&combatItem(it,draft.mode).length)draft.equipmentId=it.id;
  if(!it.equipped&&draft.equipmentId===it.id)draft.equipmentId="";
  renderInventory();renderVitals();renderComposer();if(viewMode==="builder")renderWizard();save();break;
 }
 case "delete-item":{
  const it=state.items.find(x=>x.id===id);if(!it)return;
  if(confirm('Excluir "'+it.name+'"?')){state.items=state.items.filter(x=>x.id!==id);renderInventory();renderVitals();renderComposer();save();}break;
 }
 }
}
function onChange(event){
 const el=event.target;
 if(el.dataset.wizardVtDraft!==undefined){
  if(state.trade.purchases.length||state.trade.collected)return;
  const k=el.dataset.wizardVtDraft;
  if(!RESOURCES.some(([key])=>key===k))return;
  tradeDraft[k]=clamp(Math.floor(el.value),0,STARTING_VT);renderWizard();return;
 }
 if(el.dataset.wizardTradePreferred!==undefined){
  if(!RESOURCES.some(([k])=>k===el.value))return;
  wizardTradePreferred=el.value;wizardPersist();renderWizard();return;
 }
 if(el.dataset.tradeDraft!==undefined){
  if(state.trade.purchases.length||state.trade.collected)return;
  const k=el.dataset.tradeDraft;if(!RESOURCES.some(x=>x[0]===k))return;
  tradeDraft[k]=clamp(Math.floor(el.value),0,STARTING_VT);
  renderTrade();return;
 }
 if(el.dataset.stonePrice){
  const kind=el.dataset.stonePrice;if(kind!=="common")return;
  const raw=String(el.value).trim();
  const common=raw===""?null:clamp(Math.floor(Number(raw)),1,3333);
  state.trade.stonePrices.common=common;state.trade.stonePrices.rare=common===null?null:3*common;
  save();renderStoneShop();return;
 }
 if(el.id==="stone-element"){renderStoneShop();return;}
 if(el.id==="crystal-element"){
  if(state.elementalCrystal.quantity){
   if(el.value==="Sangue"){toast("Sangue exige Pedra da Alma; não é opção nova no nível 1.");renderTrade();return;}
   state.elementalCrystal.element=String(el.value).slice(0,30);
  }
  renderTrade();save();return;
 }
 if(el.dataset.skillScope!==undefined||el.dataset.skillReady!==undefined){
  if(el.dataset.skillScope!==undefined)skillFilter.scope=el.value;
  if(el.dataset.skillReady!==undefined)skillFilter.ready=el.checked;
  syncSkillFilterControls();renderWizardSkillCards();renderSkills();syncSkillFilterControls();return;
 }
 if(el.dataset.option){
  const k=el.dataset.option;
  if(!Object.hasOwn(draft,k))return;
  draft[k]=el.type==="checkbox"?el.checked:el.type==="number"?clamp(Math.floor(el.value),0,30):el.value;
  if(k==="mode"){draft.third=null;draft.contextOK=false;draft.equipmentId="";draft.trevas=false;}
  renderSources();renderComposer();return;
 }
 if(el.dataset.pending&&state.pending){
  const k=el.dataset.pending;
  if(["characteristic","secondCharacteristic","payment"].includes(k)){
   state.pending[k]=String(el.value).slice(0,40);save();renderComposer();return;
  }
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
  const page=event.target.closest("button[data-sheet-page]");
  if(page){openSheetPage(page.dataset.sheetPage,page.dataset.geneSelect||"");return;}
  const zoom=event.target.closest("button[data-gene-zoom]");
  if(zoom){window.CodexGeneGraph?.zoom(zoom.closest(".fp-wizard")?.querySelector(".fp-gene-canvas")||$("gene-map"),Number(zoom.dataset.geneZoom));return;}
 });
 $("gene-filter")?.addEventListener("change",event=>{geneFilter=event.target.value;renderGenetic();});
 document.addEventListener("change",event=>{
  if(event.target.matches("[data-gene-filter]")){geneFilter=event.target.value;renderGenetic();}
  if(event.target.matches("[data-gene-search]")){geneSearch=event.target.value.slice(0,100);renderGenetic();}
 });
 $("gene-search")?.addEventListener("input",event=>{geneSearch=event.target.value.slice(0,100);renderGenetic();});
 $("gene-list-toggle")?.addEventListener("click",()=>{geneListOpen=!geneListOpen;renderGenetic();});
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
 document.addEventListener("change",event=>{
  const el=event.target;
  if(el.matches?.("[data-race-select]"))changeRace(el.value);
  else if(el.matches?.("[data-race-element]"))changeRaceElement(el.dataset.raceElement,el.value);
 });
 document.addEventListener("input",event=>{
  if(event.target?.dataset?.skillSearch!==undefined){
   skillFilter.query=String(event.target.value).slice(0,100);
   renderWizardSkillCards();renderSkills();syncSkillFilterControls();return;
  }
  const field=event.target?.dataset?.wizardField;
  if(viewMode!=="builder"||!["name","concept","virtue","personality"].includes(field))return;
  state[field]=String(event.target.value).slice(0,field==="name"?70:100);
  save();
  const heading=$("wizard-summary")?.querySelector?.(".fp-wiz-summary-top strong");
  if(heading)heading.textContent=state.name||"Novo Aprendiz";
 });
 document.addEventListener("change",event=>{
  if(event.target?.matches?.("[data-wizard-focus]"))setWeaponFocus(event.target.value);
 });
 for(const [id,field] of [["char-name","name"],["char-concept","concept"],["char-virtue","virtue"],["char-personality","personality"],["char-notes","notes"]]){
  $(id).addEventListener("input",function(){state[field]=this.value;save();});
 }
 $("char-level").addEventListener("change",function(){this.value=state.level;});
 $("xp-award").addEventListener("click",()=>{
  if(state.pending){toast("Finalize a rolagem antes de conceder XP.");return;}
  const amount=Math.floor(Number($("xp-award-amount").value));
  if(!Number.isSafeInteger(amount)||amount<1||amount>9999){toast("Informe de 1 a 9999 XP.");return;}
  if(state.xpEarned+amount>MAX_EARNED_XP){toast("Teto experimental: 260 XP totais, com até 242 XP após a criação. Fichas antigas preservadas.");return;}
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
  editMode=!editMode;sheetPage=editMode?"evolution":"play";draft=freshDraft();render();save();
  toast(editMode?"Edição ativa: use + ou − para ajustar graus e XP.":"Edição concluída. Selecione fontes para rolar.");
 });
 $("demo-load").addEventListener("click",()=>{
  if(NPC_MODE){
   if(!confirm("Substituir a ficha NPC pelo exemplo?"))return;
   state=demo();resetPlayerView({version:4,step:4,reached:4});render();save();return;
  }
  createPlayerSheet(demo(),{version:4,step:4,reached:4},"Exemplo");
 });
 $("start-wizard").addEventListener("click",()=>{
  if(NPC_MODE){
   if(!confirm("Reiniciar o NPC atual?"))return;
   state=defaultState();resetPlayerView({});render();wizardPersist();save();return;
  }
  createPlayerSheet();
 });
 $("player-sheet-duplicate")?.addEventListener("click",()=>{
  if(NPC_MODE)return;
  const copy=JSON.parse(JSON.stringify(state));
  copy.name=(state.name.trim()?state.name.trim()+" (cópia)":"Aprendiz (cópia)").slice(0,70);
  copy.pending=null; // Uma rolagem em andamento pertence à ficha original.
  createPlayerSheet(copy,wizardSnapshot(),"Cópia da ficha");
 });
 $("player-sheet-delete")?.addEventListener("click",deletePlayerSheet);
 $("player-sheet-select")?.addEventListener("change",event=>activatePlayerSheet(event.target.value));
 $("reset-sheet").addEventListener("click",()=>{
  if(!confirm("Reiniciar somente esta ficha? As outras fichas de jogadores serão preservadas. Exporte esta ficha antes se desejar manter uma cópia."))return;
  state=defaultState();resetPlayerView({});wizardPersist();syncFields();render();save();toast("Ficha atual reiniciada. As demais fichas foram preservadas.");
 });
 const sendNpc=$("send-to-conflito");
 if(sendNpc&&NPC_MODE){
  sendNpc.hidden=false;
  sendNpc.addEventListener("click",sendNpcToConflict);
  $("page-title").textContent="NPC humanoide · Codex Genético";
  $("page-subtitle").textContent="Crie um NPC com o mesmo DNA do jogador, sem alterar sua Ficha principal. Depois envie ao conflito.";
 }
 $("export-json").addEventListener("click",download);
 $("import-trigger").addEventListener("click",()=>$("import-json").click());
 $("import-old-creator").addEventListener("click",()=>{
  let raw;
  try{raw=localStorage.getItem(OLD_SAVE_KEY);}catch(e){}
  if(!raw){toast("Nenhuma ficha do criador anterior encontrada neste navegador.");return;}
  if(!confirm("Importar o personagem do criador anterior como nova ficha? As fichas atuais serão preservadas."))return;
  try{
   const converted=fromCreator(JSON.parse(raw));
   converted.creationLocked=!!converted.name.trim();
   if(!NPC_MODE){
    if(createPlayerSheet(converted,{},"Ficha antiga"))toast("Ficha antiga adicionada. Confira as anotações e investimentos em XP.");
   }else{
    state=normalize(converted);resetPlayerView({});wizardPersist();syncFields();render();save();
    toast("Ficha antiga importada para o NPC.");
   }
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
 $("sound-toggle").addEventListener("click",()=>{
  soundEnabled=!soundEnabled;try{localStorage.setItem(SOUND_KEY,soundEnabled?"on":"off");}catch(e){}
  soundUI();
 });
 $("add-item").addEventListener("click",()=>{
  state.items.push(normalizeItem({name:"Novo equipamento",type:"outro",weight:"leve",grade:1,max:0}));renderInventory();renderVitals();save();
 });
 $("convert-courage").addEventListener("click",()=>{
  if(state.level<5||state.courageUsedTurn||state.courage<2||state.pp>=maxPP())return;
  state.courage-=2;state.pp++;state.courageUsedTurn=true;renderVitals();renderSkills();save();toast("Perícia em Coragem: 2 Coragens convertidas em 1 PP.");
 });
 $("reset-turn").addEventListener("click",()=>{
  state.courageUsedTurn=false;
  if(state.hemomancy)state.hemomancy.usedThisTurn=false;
  renderSkills();renderHemomancy();save();
  toast("Novo turno: conversão em Coragem e marcador de amplificação com Sangue liberados.");
 });
 window.addEventListener("storage",event=>{if(event.newValue&&(event.key===SAVE_KEY||event.key===PLAYER_SHEETS_INDEX||event.key?.startsWith(PLAYER_SHEET_PREFIX))){toast("Fichas alteradas em outra aba. Recarregue para sincronizar antes de continuar.");}});
}
bind();load();
})();