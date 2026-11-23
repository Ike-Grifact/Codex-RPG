/* Codex RPG — criador e ficha unificados. SRD Playtest Nível 1 v1.0 (15 XP, Druídica Foco + Terra e Transformação Elemental; efeitos manuais); d4 de v0.46 (1E, 1A, 1P, vazio); base v0.44: Conjuração Refinada, armaduras G1 −3 e pedras especiais 3× comuns; 15 XP iniciais DEFINIDOS (SRD Playtest Nível 1 v1.0). */
(function(){
"use strict";
const NPC_MODE=new URLSearchParams(location.search).get("npc")==="1";
const EMBED_NPC=NPC_MODE&&new URLSearchParams(location.search).get("embedded")==="1";
const SAVE_KEY=NPC_MODE?"codex-html-ficha-npc-dna-v1":"codex-html-ficha-prototipo-v1",OLD_SAVE_KEY="codex-rpg-ficha-nivel1-v1",THEME_KEY="codex-rpg-color-theme",WIZARD_KEY=NPC_MODE?"codex-html-ficha-npc-wizard-v1":"codex-html-ficha-wizard-v1";
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
 humano:["Humano","Perseverança Humana + Maestria em Armas de Fogo inicial gratuita (não concede Perícia em Armas de Fogo).","Sem custos raciais adicionais."],
 lucker_sangue:["Lucker de Sangue","Perícia em Elemento Sangue gratuita; linhagem exclusiva de Transfusão Sanguinária (que não é gratuita).","Vigor/Agilidade: desconto; Influência/Apresentação: faixa elevada."],
 lucker_puro:["Lucker Puro","Criar Item de Foco e Magia + um elemento gratuito à escolha: Fogo, Água, Ar, Terra ou Sagrado. Veneno, Sangue e Trevas não são opções iniciais.","Inteligência/Destreza: desconto; Força/Atletismo: faixa elevada."],
 runa_espinhos:["Runa Espinhos","Pugilismo, Criar Item de Foco e Magia, um elemento (Ar/Água/Terra/Fogo) e Escudo Rúnico gratuitos. Não pode usar armadura física; 1 conjuração do Escudo Rúnico é gratuita por dia.","Vigor/Força: desconto; Agilidade/Destreza: faixa elevada."]
};
// v0.94: Lucker Puro escolhe um elemento básico ou Sagrado; especiais não são gratuitos.
// Vento é o identificador interno da Perícia em Ar.
const PURE_ELEMENTS=[["fogo","Fogo"],["agua","Água"],["vento","Ar"],["terra","Terra"],["sagrado","Sagrado"]];
const RUNE_ELEMENTS=[["vento","Ar"],["agua","Água"],["terra","Terra"],["fogo","Fogo"]];
// Regra racial: conversão dos símbolos que compõem a barreira; não modifica a
// rolagem original, Pressão nem outros gastos de Pavor.
function runeShieldBarrier(successes,pavores){
 const E=Math.max(0,Math.floor(Number(successes)||0));
 const P=Math.max(0,Math.floor(Number(pavores)||0));
 const pairs=Math.floor(P/2);
 return {E:E+pairs,P:P%2,de:E+pairs+P%2,integrity:E+pairs+P%2,convertedPairs:pairs};
}
function racialGrants(s=state){
 if(s.race==="humano")return ["maestria-armas-fogo"];
 if(s.race==="lucker_sangue")return ["sangue"];
 if(s.race==="lucker_puro")return ["criar-item-foco-magia",...(PURE_ELEMENTS.some(([id])=>id===s.pureElement)?[s.pureElement]:[])];
 if(s.race==="runa_espinhos")return ["pugilismo","criar-item-foco-magia","escudo-arcano",
  ...((s.runeElements||[]).slice(0,1).filter(id=>RUNE_ELEMENTS.some(([k])=>k===id)))];
 return [];
}
function ownsSkill(id,s=state){
 if(id==="transfusao-sanguinaria"&&s.race!=="lucker_sangue")return false;
 if(id==="maestria-armas-fogo"&&s.race!=="humano")return false;
 return !!s.skills?.includes(id)||racialGrants(s).includes(id);
}
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
 s.race==="runa_espinhos"?RUNE_ELEMENTS.some(([id])=>id===s.runeElements?.[0]):true;
}
function raceCaution(s=state){return "";} // Nenhum multiplicador racial pendente na v0.56.

const CREATE_BUDGET={attr:15,training:15,skills:15,total:15}; // DEFINIDO PARA PLAYTEST (21/11/2026): 15 XP globais; após compras mínimas 1+2 XP, saldo livre.
const XP_LEVEL_REFERENCE=[0,15,28,37,46,56,66,77,88,100,112,125,138,152,166,181,196,212,228,245,260]; // DEFINIDO PARA O PLAYTEST (21/11/2026): 15 XP no nível 1 e teto acumulado 260 XP no nível 20; demais níveis preservados.
const MAX_EARNED_XP=XP_LEVEL_REFERENCE[20]-CREATE_BUDGET.total; // 245 XP novos concedíveis (260 totais − 15 iniciais).
// Todas as especializações Avançadas de Conhecimentos e Práticas exigem Grau 2
// na respectiva fonte e custam 1 XP; outras exigências históricas permanecem.
const ADVANCED_SOURCE_DEFS=[{"id":"disciplina-avancada","group":"practice","key":"armas_conjuracao","label":"Disciplina"},{"id":"furtividade-avancada","group":"practice","key":"furtividade","label":"Furtividade"},{"id":"medicina-avancada","group":"know","key":"medicina","label":"Medicina"},{"id":"protecao-avancada","name":"Proteção Avançada","group":"know","key":"protecao","label":"Proteção","ref":"k:protecao:2"},{"id":"astronomia-avancada","name":"Astronomia Avançada","group":"know","key":"astronomia","label":"Astronomia","ref":"k:astronomia:2"},{"id":"alquimia-avancada","name":"Alquimia Avançada","group":"know","key":"alquimia","label":"Alquimia","ref":"k:alquimia:2"},{"id":"engenharia-avancada","name":"Engenharia Avançada","group":"know","key":"engenharia","label":"Engenharia","ref":"k:engenharia:2"},{"id":"erudicao-avancada","name":"Erudição Avançada","group":"know","key":"erudicao","label":"Erudição","ref":"k:erudicao:2"},{"id":"atletismo-avancado","name":"Atletismo Avançado","group":"practice","key":"atletismo","label":"Atletismo","ref":"p:atletismo:2"},{"id":"artesao-avancado","name":"Artesão Avançado","group":"practice","key":"artesao","label":"Artesão","ref":"p:artesao:2"},{"id":"apresentacao-avancada","name":"Apresentação Avançada","group":"practice","key":"apresentacao","label":"Apresentação","ref":"p:apresentacao:2"},{"id":"coleta-avancada","name":"Coleta Avançada","group":"practice","key":"coleta","label":"Coleta","ref":"p:coleta:2"}];
const WEAPON_MASTERY_TYPES=Object.freeze([
 {id:"maestria-adagas",name:"Maestria em Adagas e Facas",family:"adagas",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-espadas",name:"Maestria em Espadas",family:"espadas",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-machados",name:"Maestria em Machados",family:"machados",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-macas",name:"Maestria em Maças e Clavas",family:"macas",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-hastes",name:"Maestria em Lanças e Hastes",family:"hastes",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-cajados",name:"Maestria em Cajados e Bastões",family:"cajados",activationReq:"Armas Leves/Médias/Pesadas conforme peso"},
 {id:"maestria-arcos",name:"Maestria em Arcos",family:"arcos",activationReq:"Perícia em Armas de Longo Alcance"},
 {id:"maestria-bestas",name:"Maestria em Bestas",family:"bestas",activationReq:"Perícia em Armas de Longo Alcance"},
 {id:"maestria-arremessos",name:"Maestria em Armas Arremessadas",family:"arremessos",activationReq:"Maestria em Arremesso de Armas e Perícia de Armas do peso"},
 {id:"maestria-punhos",name:"Maestria em Armas de Punho",family:"punhos",activationReq:"Pugilismo"},
 {id:"maestria-longo-alcance",name:"Maestria em Armas de Longo Alcance Diversas",family:"longo-alcance",activationReq:"Perícia em Armas de Longo Alcance"},
 {id:"maestria-armas-fogo",name:"Maestria em Armas de Fogo",family:"fogo",activationReq:"Perícia em Armas de Fogo"},
]);
const APPROVED_WEAPON_MASTERY_PURCHASE=Object.freeze({
 "maestria-hastes":"Força 2 + Agilidade 1 + Destreza 1",
 "maestria-espadas":"Força 2 + Destreza 2"
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
  (family==="fogo"?"Exclusiva de Humanos: gratuita desde a criação. ":APPROVED_WEAPON_MASTERY_PURCHASE[id]?"1 XP. Requisitos de aquisição: "+APPROVED_WEAPON_MASTERY_PURCHASE[id]+". ":"Custo de XP e atributos de compra PENDENTES. ")+"Maestria por tipo de arma: acerto comum ativa um efeito próprio da arma grátis; crítico ativa dois diferentes grátis e um terceiro diferente por 1 Coragem. Exige "+activationReq+" para usar, arma com características habilitadas e acerto na DE. Não concede a Perícia em Armas automaticamente.",
  APPROVED_WEAPON_MASTERY_PURCHASE[id]?1:null
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
  "Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.",
  2
 ],
 [
  "armas-medias",
  "Perícia em Armas Médias",
  "Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.",
  2
 ],
 [
  "armas-pesadas",
  "Perícia em Armas Pesadas",
  "Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.",
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
  "1 XP. Requer Disciplina Avançada + Destreza 2. Ao usar a arma correta contra oponente que possui Desvantagem contra ela, concede Vantagem Absoluta (+1E substituindo o +1A natural); se a ação já estiver em Vantagem Absoluta, aplica Golpe Certo. Procedimento de Golpe Certo PENDENTE, sem bônus numérico adicional.",
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
  "Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 Coragem para mudar peso do soco. Pesos disponíveis PENDENTES.",
  1
 ],
 [
  "artista-marcial",
  "Artista Marcial",
  "Disciplina 2 + Pugilismo + Destreza 2. 1 Coragem por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.",
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
  "1 XP. Requisito: Proteção 2. Com Proteção como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "astronomia-avancada",
  "Astronomia Avançada",
  "1 XP. Requisito: Astronomia 2. Com Astronomia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "alquimia-avancada",
  "Alquimia Avançada",
  "1 XP. Requisito: Alquimia 2. Com Alquimia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "engenharia-avancada",
  "Engenharia Avançada",
  "1 XP. Requisito: Engenharia 2. Com Engenharia como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "erudicao-avancada",
  "Erudição Avançada",
  "1 XP. Requisito: Erudição 2. Com Erudição como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "atletismo-avancado",
  "Atletismo Avançado",
  "1 XP. Requisito: Atletismo 2. Com Atletismo como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "artesao-avancado",
  "Artesão Avançado",
  "1 XP. Requisito: Artesão 2. Com Artesão como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "maestria-martelos",
  "Maestria em Martelos",
  "1 XP. Compra: Força 3 + Destreza 1 + Vigor 1. Ataque com martelo e Perícia em Armas do peso: acerto comum ativa 1 característica gratuitamente; crítico ativa 2 características diferentes gratuitamente e pode gastar 1 Coragem para uma terceira, se a arma possuir três. A Perícia do peso é requisito da ativação, não da compra. Sem acerto, sem gratuidade; não cria características ou dano extra.",
  1
 ],
 [
  "ferreiro",
  "Ferreiro",
  "1 XP. Requisitos: Artesão 1 + Força 1 + Destreza 1 + Inteligência 1 + Artesão Avançado (que exige Artesão 2). Habilita criar armas, armaduras Médias e Pesadas de Grau 1, consertar e modificar armas e preparar minérios e metais. +1 Êxito (E) apenas em testes de Forja; demais procedimentos de fabricação pendentes.",
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
  "1 XP. Requisito: Apresentação 2. Com Apresentação como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "coleta-avancada",
  "Coleta Avançada",
  "1 XP. Requisito: Coleta 2. Com Coleta como fonte predominante, permite até duas fontes adicionais pertinentes (três no total), incluindo ao menos um Atributo na pilha. Não concede efeitos automáticos, bônus ou nova técnica exclusiva.",
  1
 ],
 [
  "medicina-avancada",
  "Medicina Avançada",
  "1 XP. Requisito Medicina 2. Em teste com Medicina como Base, acrescenta até duas fontes pertinentes (total de três), incluindo Atributo na pilha. Para tratar Sangrando, testa contra a DE defensiva do alvo com Desvantagem (−1A); sucesso remove o estado, falha mantém. Não dispensa rolagem nem concede cura automática.",
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

// IDs de Perícias legadas continuam nas fichas salvas e no cálculo de XP,
// mas não aparecem nas opções novas de compra.
// Efeitos internos do Bardo não são Perícias individuais; preservar IDs legados sem ofertar compras.
const BARD_INTERNAL_EFFECTS=Object.freeze(["dueto-improvisado","contratempo","solo-provocador","cancoes-sustentadas","ritmo-de-batalha","inspiracao","ressonancia-arcana","acorde-de-protecao","acorde-triunfal","compasso-adiantado","ritmo-acelerado","harmonia-musical","piada-infame","elevacao-harmonica","acao-em-conjunto-musical","presenca-de-palco","melodia-psiquica"]);
const HIDDEN_CATALOG_SKILLS=new Set(["combate","armas",...BARD_INTERNAL_EFFECTS]);
const RETIRED_PROTOTYPES=new Set(["marciais","combinacao","peritoconj"]);
const visibleSkillCount=()=>SKILLS.length-HIDDEN_CATALOG_SKILLS.size;

// Facetas servem à navegação: uma associação temática nunca se torna pré-requisito.
const SKILL_AFFINITY={
 "dueto-improvisado":["practice:apresentacao","attr:influencia"],
 "contratempo":["practice:apresentacao","attr:influencia"],
 "solo-provocador":["practice:apresentacao","attr:influencia"],
 "cancoes-sustentadas":["practice:apresentacao","attr:influencia"],
 "pericia-em-instrumentos":["practice:apresentacao","attr:influencia","attr:destreza"],
 "maestria-em-apresentacao":["practice:apresentacao","attr:influencia","attr:destreza"],
 "voz-encantadora":["practice:apresentacao","attr:influencia","attr:vigor"],
 "ritmo-de-batalha":["practice:apresentacao","attr:influencia","attr:destreza"],
 "inspiracao":["practice:apresentacao","attr:influencia","attr:destreza"],
 "ressonancia-arcana":["practice:apresentacao","attr:influencia","attr:destreza"],
 "acorde-de-protecao":["practice:apresentacao","attr:influencia","attr:destreza"],
 "acorde-triunfal":["practice:apresentacao","attr:influencia","attr:destreza"],
 "compasso-adiantado":["practice:apresentacao","attr:influencia","attr:destreza"],
 "ritmo-acelerado":["practice:apresentacao","attr:influencia","attr:destreza"],
 "harmonia-musical":["practice:apresentacao","attr:influencia","attr:destreza"],
 "piada-infame":["practice:apresentacao","attr:influencia","attr:destreza"],
 "elevacao-harmonica":["practice:apresentacao","attr:influencia","attr:destreza"],
 "acao-em-conjunto-musical":["practice:apresentacao","attr:influencia","attr:destreza"],
 "presenca-de-palco":["practice:apresentacao","attr:influencia","attr:destreza"],
 "melodia-psiquica":["practice:armas_conjuracao","attr:inteligencia","practice:apresentacao"],
 "maos-leves":["practice:furtividade","practice:armas_conjuracao","know:protecao"],
 "pericia-armadilha":["practice:furtividade","practice:armas_conjuracao","know:protecao"],
 "golpe-furtivo":["practice:furtividade","practice:armas_conjuracao","know:protecao"],
 "bioetica":["know:alquimia","attr:inteligencia","attr:destreza"],
 "pesquisa-avancada-pocoes":["know:alquimia","practice:artesao","attr:destreza"],
 "corpo-fechado":["attr:vigor","practice:armas_conjuracao"],
 "invocar-esfera-espiritual":["attr:destreza","attr:inteligencia","practice:armas_conjuracao"],
 "passo-etereo":["attr:destreza","attr:inteligencia","practice:armas_conjuracao"],
 "absorver-esferas":["attr:destreza","attr:inteligencia","practice:armas_conjuracao"],
 "disparo-esferas-espirituais":["attr:destreza","attr:inteligencia","practice:armas_conjuracao"],
 "dilema":["attr:vigor","practice:armas_conjuracao"],
 "impacto-psiquico":["attr:inteligencia","practice:armas_conjuracao"],
 "invocacao-elemental":["attr:influencia","attr:inteligencia","practice:apresentacao","practice:armas_conjuracao"],
 "domar-criatura-media":["attr:influencia","attr:inteligencia","practice:apresentacao"],
 "domar-criatura-grande":["attr:influencia","attr:inteligencia","practice:apresentacao"],
 "domar-criatura-pequena": ["attr:influencia","attr:inteligencia"],
 "pericia-druidica": ["practice:armas_conjuracao","attr:inteligencia","practice:artesao"],
 "transformacao-elemental": ["practice:armas_conjuracao","attr:inteligencia","practice:artesao"],
 "combate": [
  "practice:armas_conjuracao"
 ],
 "armas": [
  "practice:armas_conjuracao"
 ],
 "montar": [
  "attr:influencia"
 ],
 "pericia-montaria": [
  "attr:influencia",
  "attr:destreza"
 ],
 "montaria-epica":["attr:influencia","attr:destreza"],
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
 "cancelar-magia":["practice:armas_conjuracao","attr:inteligencia","attr:agilidade","attr:destreza"],
 "mudanca-elemental":["attr:inteligencia","attr:destreza","practice:armas_conjuracao"],
 "desencantar":["attr:inteligencia","practice:artesao","practice:armas_conjuracao"],
 "espelho-magico":["attr:inteligencia","know:protecao","practice:armas_conjuracao"],
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
 "sacrificio-heroico":["attr:vigor","practice:atletismo","know:protecao"],
 "escudo-refletor":["know:protecao","attr:vigor","attr:destreza"],
 "sentido-elemental":["attr:inteligencia","practice:armas_conjuracao","know:erudicao"],
 "maestria-escudos": ["attr:destreza","attr:vigor","know:protecao"],
 "escudo-bumerangue": ["attr:destreza","attr:forca","practice:armas_conjuracao","know:protecao"],
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
 "protecao-avancada": [
  "know:protecao"
 ],
 "astronomia-avancada": [
  "know:astronomia"
 ],
 "alquimia-avancada": [
  "know:alquimia"
 ],
 "engenharia-avancada": [
  "know:engenharia"
 ],
 "erudicao-avancada": [
  "know:erudicao"
 ],
 "atletismo-avancado": [
  "practice:atletismo"
 ],
 "artesao-avancado": [
  "practice:artesao"
 ],
 "maestria-martelos": [
  "practice:armas_conjuracao",
  "attr:forca",
  "attr:destreza",
  "attr:vigor"
 ],
 "maestria-adagas":["practice:armas_conjuracao", "attr:forca"],
 "maestria-espadas":["practice:armas_conjuracao","attr:forca","attr:destreza"],
 "maestria-machados":["practice:armas_conjuracao", "attr:forca"],
 "maestria-macas":["practice:armas_conjuracao", "attr:forca"],
 "maestria-hastes":["practice:armas_conjuracao","attr:forca","attr:agilidade","attr:destreza"],
 "maestria-cajados":["practice:armas_conjuracao", "attr:forca"],
 "maestria-arcos":["practice:armas_conjuracao", "attr:destreza"],
 "maestria-bestas":["practice:armas_conjuracao", "attr:destreza"],
 "maestria-arremessos":["practice:armas_conjuracao", "attr:forca"],
 "maestria-punhos":["practice:armas_conjuracao", "attr:forca"],
 "maestria-longo-alcance":["practice:armas_conjuracao", "attr:destreza"],
 "maestria-armas-fogo":["practice:armas_conjuracao", "attr:destreza"],
 "ferreiro": [
  "practice:artesao",
  "attr:forca",
  "attr:destreza",
  "attr:inteligencia"
 ],
 "ferreiro-elemental": [
  "practice:artesao",
  "attr:inteligencia",
  "attr:destreza",
  "practice:armas_conjuracao"
 ],
 "resistencia-a-fogo": [
  "practice:artesao",
  "attr:vigor",
  "practice:armas_conjuracao"
 ],
 "encantar-com-elemento": [
  "practice:armas_conjuracao",
  "attr:inteligencia"
 ],
 "apresentacao-avancada": [
  "practice:apresentacao"
 ],
 "coleta-avancada": [
  "practice:coleta"
 ],
 "medicina-avancada": [
  "know:medicina"
 ],
 "furtividade-avancada": [
  "practice:furtividade",
  "attr:destreza",
  "attr:agilidade"
 ]
};
const SKILL_BRANCHES=[
 // Compra única de Maestria, com Voz e Instrumentos separados.
 ["apresentacao-avancada","pericia-em-instrumentos","maestria-em-apresentacao","voz-encantadora"],
 ["montar","pericia-montaria","montaria-epica"],
 ["coleta-avancada"],
 ["artesao-avancado","ferreiro","ferreiro-elemental","resistencia-a-fogo"],
 ["alquimia-avancada","pesquisa-avancada-pocoes","bioetica"],
 ["improviso","mestre","invocacao-elemental","transformacao-elemental","mudanca-elemental","sentido-elemental"],
 ["furtividade","maos-leves","golpe-furtivo"],
 ["protecao","pericia-armadilha"],
 ["alquimia","pesquisa-avancada-pocoes","bioetica"],
 ["artista-marcial","corpo-fechado","dilema","impacto-psiquico"],
 ["criar-item-foco-magia","invocar-esfera-espiritual","passo-etereo","absorver-esferas","disparo-esferas-espirituais"],
 ["maestria-escudos","escudo-refletor","escudo-bumerangue","maestria-arremesso-armas"],
  ["sacrificio-heroico","maestria-escudos"],
  ["improviso","sentido-elemental","transformacao-elemental","mudanca-elemental"],
  ["criar-item-foco-magia","improviso","cancelar-magia","desencantar","espelho-magico"],
 ["criar-item-foco-magia","domar-criatura-pequena","invocacao-elemental"],
 ["criar-item-foco-magia","terra","pericia-druidica"],
 ["criar-item-foco-magia","terra","transformacao-elemental"],
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
  "pericia-montaria",
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
 ],
 ["medicina-avancada"],
 ["protecao-avancada"],
 ["astronomia-avancada"],
 ["alquimia-avancada"],
 ["engenharia-avancada"],
 ["erudicao-avancada"],
 ["atletismo-avancado"],
 ["artesao-avancado","ferreiro","ferreiro-elemental","resistencia-a-fogo"],
 ["armas-leves","armas-medias","armas-pesadas","maestria-martelos","maestria-adagas","maestria-espadas","maestria-machados","maestria-macas","maestria-hastes","maestria-cajados"],
 ["armas-longo-alcance","maestria-arremesso-armas","maestria-arcos","maestria-bestas","maestria-arremessos","maestria-punhos","maestria-longo-alcance","maestria-armas-fogo"],
 ["criar-item-foco-magia","encantar-com-elemento"],
 ["apresentacao-avancada"],
 ["coleta-avancada"]
];

const SKILL_PERMALINKS={
 "dueto-improvisado":"dueto-improvisado",
 "contratempo":"contratempo",
 "solo-provocador":"solo-provocador",
 "cancoes-sustentadas":"cancoes-sustentadas",
 "pericia-em-instrumentos":"pericia-em-instrumentos",
 "maestria-em-apresentacao":"maestria-em-apresentacao",
 "voz-encantadora":"voz-encantadora",
 "ritmo-de-batalha":"ritmo-de-batalha",
 "inspiracao":"inspiracao",
 "ressonancia-arcana":"ressonancia-arcana",
 "acorde-de-protecao":"acorde-de-protecao",
 "acorde-triunfal":"acorde-triunfal",
 "compasso-adiantado":"compasso-adiantado",
 "ritmo-acelerado":"ritmo-acelerado",
 "harmonia-musical":"harmonia-musical",
 "piada-infame":"piada-infame",
 "elevacao-harmonica":"elevacao-harmonica",
 "acao-em-conjunto-musical":"acao-em-conjunto-musical",
 "presenca-de-palco":"presenca-de-palco",
 "melodia-psiquica":"melodia-psiquica",
 "maos-leves":"maos-leves",
 "pericia-armadilha":"pericia-armadilha",
 "golpe-furtivo":"golpe-furtivo",
 "bioetica":"bioetica",
 "pesquisa-avancada-pocoes":"pesquisa-avancada-pocoes",
 "corpo-fechado":"corpo-fechado",
 "invocar-esfera-espiritual":"invocar-esfera-espiritual",
 "passo-etereo":"passo-etereo",
 "absorver-esferas":"absorver-esferas",
 "disparo-esferas-espirituais":"disparo-esferas-espirituais",
 "dilema":"dilema",
 "impacto-psiquico":"impacto-psiquico",
 "invocacao-elemental":"invocacao-elemental",
 "domar-criatura-media":"domar-criatura-media",
 "domar-criatura-grande":"domar-criatura-grande",
 "domar-criatura-pequena": "domar-criatura-pequena",
 "pericia-druidica": "pericia-druidica",
 "transformacao-elemental": "transformacao-elemental",
 "combate": "combate",
 "armas": "armas-1",
 "montar": "montar-animal",
 "pericia-montaria": "pericia-em-montaria",
 "montaria-epica":"montaria-epica",
 "provocacao-sofisticada": "provocacao-sofisticada",
 "criar-item-foco-magia": "criar-item-de-foco-e-magia",
 "escudo-arcano": "escudo-arcano",
 "conjuracao-equilibrada": "conjuracao-refinada",
 "cancelar-magia":"cancelar-magia",
 "mudanca-elemental":"mudanca-elemental",
 "desencantar":"desencantar",
 "espelho-magico":"espelho-magico",
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
 "sacrificio-heroico":"sacrificio-heroico",
 "escudo-refletor":"escudo-refletor",
 "sentido-elemental":"sentido-elemental",
 "maestria-escudos": "maestria-em-escudos",
 "escudo-bumerangue": "escudo-bumerangue",
 "maestria-arremesso-armas": "pericia-em-arremesso-de-armas",
 "disparo-fulminante": "disparo-fulminante",
 "disparo-multiplo": "disparo-multiplo",
 "recuperacao-vigorosa": "recuperacao-vigorosa",
 "recuperacao-movimento": "maestria-em-recuperacao-vigorosa-em-movimento",
 "recobrar-coragem": "recobrar-coragem",
 "maestria-manejo-duplo": "pericia-em-manejo-duplo",
 "instinto-sobrevivencia": "instinto-de-sobrevivencia",
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
 "furtividade-avancada": "furtividade-avancada",
 "medicina-avancada": "medicina-avancada",
 "protecao-avancada": "protecao-avancada",
 "astronomia-avancada": "astronomia-avancada",
 "alquimia-avancada": "alquimia-avancada",
 "engenharia-avancada": "engenharia-avancada",
 "erudicao-avancada": "erudicao-avancada",
 "atletismo-avancado": "atletismo-avancado",
 "artesao-avancado": "artesao-avancado",
 "maestria-martelos": "maestria-em-martelos",
 "maestria-adagas":"maestria-em-adagas",
 "maestria-espadas":"maestria-em-espadas",
 "maestria-machados":"maestria-em-machados",
 "maestria-macas":"maestria-em-macas",
 "maestria-hastes":"maestria-em-hastes",
 "maestria-cajados":"maestria-em-cajados",
 "maestria-arcos":"maestria-em-arcos",
 "maestria-bestas":"maestria-em-bestas",
 "maestria-arremessos":"maestria-em-arremessos",
 "maestria-punhos":"maestria-em-punhos",
 "maestria-longo-alcance":"maestria-em-longo-alcance",
 "maestria-armas-fogo":"maestria-em-armas-fogo",
 "ferreiro": "ferreiro",
 "ferreiro-elemental": "ferreiro-elemental",
 "resistencia-a-fogo": "resistencia-a-fogo",
 "encantar-com-elemento": "encantar-com-elemento",
 "apresentacao-avancada": "apresentacao-avancada",
 "coleta-avancada": "coleta-avancada"
};
const CARD_REQUIREMENTS={
 "dueto-improvisado":"Requisitos e custos pendentes; PROPOSTO",
 "contratempo":"Requisitos e custos pendentes; PROPOSTO",
 "solo-provocador":"Requisitos e custos pendentes; PROPOSTO",
 "cancoes-sustentadas":"Requisitos e custos pendentes; PROPOSTO",
 "pericia-em-instrumentos":"Requisitos próprios ainda não definidos",
 "maestria-em-apresentacao":"Apresentação 4 + Influência 4 + Destreza 4 + Apresentação Avançada + Perícia em Instrumentos",
 "voz-encantadora":"Influência 4 + Apresentação 4 + Vigor 3",
 "ritmo-de-batalha":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "inspiracao":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "ressonancia-arcana":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "acorde-de-protecao":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "acorde-triunfal":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "compasso-adiantado":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "ritmo-acelerado":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "harmonia-musical":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "piada-infame":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "elevacao-harmonica":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "acao-em-conjunto-musical":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "presenca-de-palco":"Requisitos individuais pendentes; consultar playtest do Bardo",
 "melodia-psiquica":"Disciplina 4 + Criar Item de Foco e Magia",
 "maos-leves":"Furtividade 3 + Disciplina 3 + Proteção 2",
 "pericia-armadilha":"Artesão 1 + Disciplina 1 + Engenharia 1 + Destreza 1 + Inteligência 1 + Proteção 2 + Furtividade 1",
 "golpe-furtivo":"Disciplina 2 + Furtividade 2",
 "bioetica":"Alquimia 3 + Inteligência 3 + Destreza 3 + Perícia em Sangue + Criar Item de Foco e Magia + outra Perícia Elemental + Domar Criatura Média",
 "pesquisa-avancada-pocoes":"Alquimia 3 + Improviso Elemental + Artesão 3 + Destreza 2",
 "corpo-fechado":"Vigor 4 + Artista Marcial",
 "invocar-esfera-espiritual":"Criar Item de Foco e Magia + Destreza 4 + Inteligência 3 + Vigor 3",
 "passo-etereo":"Invocar Esfera Espiritual",
 "absorver-esferas":"Invocar Esfera Espiritual",
 "disparo-esferas-espirituais":"Invocar Esfera Espiritual",
 "dilema":"Vigor 4 + Artista Marcial",
 "impacto-psiquico":"Criar Item de Foco e Magia + Artista Marcial",
 "sacrificio-heroico":"Vigor 4",
 "escudo-refletor":"Maestria em Escudos",
 "sentido-elemental":"Inteligência 3 + Improviso Elemental",
 "cancelar-magia":"Criar Item de Foco e Magia + Improviso Elemental + Inteligência 4 + Agilidade 4 + Destreza 4",
 "mudanca-elemental":"Transformação Elemental + Destreza 4 + Inteligência 4",
 "desencantar":"Cancelar Magia",
 "espelho-magico":"Cancelar Magia",
 "manejo-perfeito": "Disciplina Avançada + Destreza 2",
 "maestria-escudos": "Destreza 2 + Vigor 2",
 "escudo-bumerangue": "Destreza 2 + Força 3 + Perícia em Arremesso de Armas + Maestria em Escudos",
 "montar": "Influência 2",
 "pericia-montaria": "Influência 1 + Destreza 2; custo em XP PENDENTE",
 "montaria-epica":"PROPOSTO — montarias gigantes, aladas ou exóticas; requisitos e XP pendentes",
 "invocacao-elemental":"Criar Item de Foco e Magia (habilita Psique) + Domar Criatura Pequena; outros elementos exigem Perícia própria",
 "domar-criatura-media":"Influência 3 + Apresentação 1 + Inteligência 1 + Domar Criatura Pequena",
 "domar-criatura-grande":"Influência 4 + Apresentação 2 + Inteligência 1 + Domar Criatura Pequena + Domar Criatura Média",
 "domar-criatura-pequena": "Influência 2 + Inteligência 1",
 "pericia-druidica": "Criar Item de Foco e Magia + Perícia em Elemento Terra",
 "transformacao-elemental": "Criar Item de Foco e Magia + ao menos uma Perícia Elemental",
 "criar-item-foco-magia": "Disciplina 1, Inteligência 1, Artesão 1",
 "escudo-arcano": "Inteligência 2, Vigor 1, Criar Foco",
 "conjuracao-equilibrada": "Disciplina 2, Inteligência 2, Destreza 2, Criar Foco",
 "improviso": "Disciplina 1, Inteligência 1 e Destreza 1",
 "mestre": "Disciplina 3, Inteligência 3, Destreza 3, Improviso, Criar Foco, Elemento",
 "fogo": "Disciplina 1, Inteligência 1",
 "agua": "Disciplina 1, Inteligência 1",
 "vento": "Disciplina 1, Inteligência 1",
 "terra": "Disciplina 1, Inteligência 1",
 "sagrado": "Disciplina 2, Inteligência 2",
 "veneno": "Disciplina 2 + Inteligência 2 + Alquimia 2 + Medicina 2",
 "sangue": "Disciplina 2, Inteligência 2",
 "trevas": "Disciplina 2, Inteligência 2",
 "criar-antidoto": "Artesão 1 + Inteligência 2 + Alquimia 2 + Medicina 2 + Criar Veneno",
 "transfusao-sanguinaria": "Lucker de Sangue (exclusiva) + Transfusão + Perícia em Elemento Sangue",
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
 "medicina-avancada": "Medicina 2",
 "protecao-avancada": "Proteção 2",
 "astronomia-avancada": "Astronomia 2",
 "alquimia-avancada": "Alquimia 2",
 "engenharia-avancada": "Engenharia 2",
 "erudicao-avancada": "Erudição 2",
 "atletismo-avancado": "Atletismo 2",
 "artesao-avancado": "Artesão 2",
 "maestria-martelos": "Força 3 + Destreza 1 + Vigor 1 (Perícia de Armas do peso é exigida somente na ativação)",
 "maestria-adagas":"PENDENTE: custo de XP e requisitos de compra. Ativação exige Armas Leves/Médias/Pesadas conforme peso",
 "maestria-espadas":"1 XP; Força 2 + Destreza 2 para compra. Ativação exige Armas Leves/Médias/Pesadas conforme peso da espada",
 "maestria-machados":"PENDENTE: custo de XP e requisitos de compra. Ativação exige Armas Leves/Médias/Pesadas conforme peso",
 "maestria-macas":"PENDENTE: custo de XP e requisitos de compra. Ativação exige Armas Leves/Médias/Pesadas conforme peso",
 "maestria-hastes":"1 XP; Força 2 + Agilidade 1 + Destreza 1 para compra. Ativação exige Armas Leves/Médias/Pesadas conforme peso da lança ou haste",
 "maestria-cajados":"PENDENTE: custo de XP e requisitos de compra. Ativação exige Armas Leves/Médias/Pesadas conforme peso",
 "maestria-arcos":"PENDENTE: custo de XP e requisitos de compra. Ativação exige Perícia em Armas de Longo Alcance",
 "maestria-bestas":"PENDENTE: custo de XP e requisitos de compra. Ativação exige Perícia em Armas de Longo Alcance",
 "maestria-arremessos":"PENDENTE: custo de XP e requisitos de compra. Ativação exige Maestria em Arremesso de Armas e Perícia de Armas do peso",
 "maestria-punhos":"PENDENTE: custo de XP e requisitos de compra. Ativação exige Pugilismo",
 "maestria-longo-alcance":"PENDENTE: custo de XP e requisitos de compra. Ativação exige Perícia em Armas de Longo Alcance",
 "maestria-armas-fogo":"Origem Humano (0 XP); ativação: Perícia em Armas de Fogo (não concedida)",
 "ferreiro": "Artesão 1 + Força 1 + Destreza 1 + Inteligência 1 + Artesão Avançado (exige Artesão 2)",
 "ferreiro-elemental": "Ferreiro + Inteligência 2 + Destreza 2 + Improviso Elemental + Criar Item de Foco e Magia + Encantar com Elemento",
 "resistencia-a-fogo": "Ferreiro Elemental + Perícia em Elemento Fogo + Vigor 2",
 "encantar-com-elemento": "Uma Perícia Elemental + Criar Item de Foco e Magia",
 "apresentacao-avancada": "Apresentação 2",
 "coleta-avancada": "Coleta 2",
 "armas-leves": "Disciplina 1",
 };

const CARD_EFFECTS={
 "maos-leves":"Em combate, remove itens de inventário inimigo (armas, escudos ou armaduras), rolando Disciplina + Furtividade. DE = DE inimiga + Grau do item + peso, somente se equipado. Ex.: DE 3 + item G1 equipado Leve = DE 5; Médio = DE 6. A combinação de duas Práticas é exceção específica desta Perícia e não é habilitada genericamente.",
 "pericia-armadilha":"Concede Vantagem ao armar ou desarmar armadilhas; os testes utilizam Proteção. Vantagem segue a regra geral de +1A e não concede dado extra.",
 "golpe-furtivo":"Ao atacar furtivamente, adiciona mais um dado da arma à pilha, respeitando o limite geral de dados e a habilitação da arma. Não adiciona dado ao ataque que não seja furtivo nem converte dado em dano automático.",
 "bioetica":"Permite criar homúnculos: criaturas elementais de carne formadas pela mistura do DNA de duas outras criaturas. Destreza 3 confirmada. O homúnculo usa ficha própria, separada da ficha do criador, com XP próprio igual ao XP total atual do criador, seguindo as regras e tabelas de Atributos das criaturas domadas conforme porte. A criação exige sangue e tecidos vivos. Porte e quantidades de materiais permanecem pendentes.",
 "pesquisa-avancada-pocoes":"Concede +1 Êxito (E) aos testes de criação de poções e habilita a criação de poções elementais. Receitas, custo de materiais, graus e efeitos específicos não foram definidos.",
 "corpo-fechado":"Gasta 1 Coragem para não sofrer efeitos nem dano de golpes de armas físicas em sua Vitalidade por 1 rodada. Não protege automaticamente Integridade da armadura nem concede imunidade a magia; resolução do tempo de rodada pelo Narrador.",
 "invocar-esfera-espiritual":"Converte Coragem em Esferas Espirituais, com limite de 5 criações por rodada e teto de 5 esferas armazenadas. Ao reunir 5 esferas permite transformar um dado em d20 para o golpe corpo a corpo de Disciplina conhecido como Punho Supremo de Asura. Cada esfera custa 1 Coragem; até 5 podem ser criadas na rodada, com teto de 5 armazenadas. Punho Supremo de Asura consome 5 esferas e 1 Coragem ao finalizar um golpe corpo a corpo com Disciplina, substituindo um dado escolhido por d20; o d20 contribui para atingir a DE e calcular o dano básico por seus símbolos mantidos; esse dano é sempre neutro e não tem parcela extra.",
 "passo-etereo":"Arremessa uma Esfera Espiritual e se projeta em deslocamento rápido de até 8 metros, consumindo 1 esfera. Movimento e obstáculos dependem do mapa do combate.",
 "absorver-esferas":"Recupera Coragem em quantidade igual ao total de Esferas Espirituais; consome TODAS as esferas disponíveis. Recupera 1 Coragem por esfera consumida, limitada ao teto; esferas ficam em zero após a absorção.",
 "disparo-esferas-espirituais":"Permite ataques físicos à distância por disparo de Esferas Espirituais, gastando 1 esfera por golpe. Alcance, dados, DE e cálculo de dano não informados; não presumir ataque de magia.",
 "dilema":"Desafia um inimigo para pacto de combate que impede ambos de se moverem até que um dos dois fique inconsciente. Procedimentos de resistência, interrupção, distância e condição em caso de fuga não foram especificados.",
 "impacto-psiquico":"Por 1 Coragem permite golpes psíquicos que aplicam efeitos de armas. Dados, classificação de efeitos elegíveis e interação com proteção física requerem decisão; não supor dano extra.",
 "sacrificio-heroico":"Intervém para proteger alguém até 8 m, mesmo fora da sua vez. Recebe o dano na própria armadura ou Vida, conforme Narrador.",
 "escudo-refletor":"Escudo físico equipado reflete ao inimigo a parcela de dano efetiva causada por Pavor; proteções normais se aplicam.",
 "sentido-elemental":"Analisa alvo por 1 Coragem e conhece sua afinidade elemental; informação do Narrador.",
 "cancelar-magia":"Ao perceber magia a até 8 m com Pavor mantido, gasta 1 Coragem e tenta alcançar DE igual ou maior (≥) que a magia adversária; empate cancela. Requer a Perícia do elemento cancelado.",
 "mudanca-elemental":"Altera o elemento de criatura, armadura ou ambiente até 8 m para um elemento em que possui Perícia; duração E − P (>0); unidade temporal e resistência pendentes.",
 "desencantar":"Remove elementos ou imunidades a até 8 m; não remove o elemento natural constitutivo de criatura feita desse elemento. Teste, custo e duração pendentes.",
 "espelho-magico":"Passivo: reflete ao conjurador a parcela do dano mágico provocada por Pavor mantido, mesmo se a armadura da vítima absorveu ou anulou totalmente o dano. Não funciona contra dano físico.",
 "maestria-escudos": "+1 DE defensiva com escudo físico equipado (teto total 12) e +1 Integridade material apenas nesse escudo; não aumenta a armadura nem os E+P simbólicos de Levantar Escudo.",
 "escudo-bumerangue": "Ataque com Disciplina + Atributo(s) a 8 m. Acerto (mesmo com Pavor): escudo volta no mesmo turno. Falha: cai no caminho ou perto do alvo, conforme Pavor e regras de Arremesso de Armas. Custa 1 Coragem para lançar; dano físico normal no acerto e características existentes do escudo conforme seus custos, sem dado adicional.",
 "montar": "Vantagem em testes com montaria; NÃO concede +1A automaticamente.",
 "pericia-montaria": "+1 Antecipar (A) aos testes com montaria, sem Vantagem e sem dado extra. Custo XP pendente; aplicação contextual manual.",
 "invocacao-elemental":"Uma ficha ativa por conjurador; pode dividir criaturas em tokens com XP/Vida repartidos e DE preservada. Dano de área é normal. Apenas um turno antecipável, para agir sozinho ou ajudar conjurador/aliado em ação conjunta. Dois elementos exigem Improviso + Maestria; Psique projeta a mente e deixa o corpo parado. Divisão inexata pendente.",
 "domar-criatura-media":"Uma companheira Média por personagem; ficha própria e +1 Vida ao domador.",
 "domar-criatura-grande":"Uma companheira Grande por personagem; ficha própria e +1 Vida ao domador.",
 "domar-criatura-pequena": "Companheiro Pequeno domesticado presente: +1 Vida máxima ao domador. Por 1 Coragem, atua como auxílio no turno (+1A em combate); serpente pode aplicar Envenenado a alvo em Sangramento, sem dano periódico definido. Possui Vida própria inicial 1.",
 "pericia-druidica": "Transforma-se nas formas Pequena (0 Coragem, eleva 1 Atributo), Média (1 Coragem, eleva 2) ou Grande (1 Coragem, eleva 3). Não conjura nem usa armadura enquanto transformado; a Vida temporária desaparece ao reverter. Regras e cancelamentos no verbete completo.",
 "transformacao-elemental": "1 XP; requer Criar Item de Foco e Magia e uma Perícia Elemental. Ativação 1 Coragem. Imune ao elemento escolhido e intangível, exceto Terra (tangível, imune a Terra e efeitos aplicáveis das armas). Sem armadura; dano não protegido por imunidade ou Escudo Arcano chega diretamente à Vida. Duração elemental = E - P, exigindo E - P > 0, sem duração-base. Fonte e DE pendentes. Aura Sagrada: quando a Transformação Elemental em Sagrado se concretiza, pessoas num raio de 3 m recebem 1 Coragem até o teto de cada ficha. Sem recuperação periódica definida. Imunidade: zero dano do elemento; resistência: E/2 dano e P=0 dano só no elemento resistido. Foco pode amplificar (procedimento pendente); ambiente favorável exige 3 turnos de preparação. Resistência citada além de imunidade aguarda interpretação; Escudo Arcano é compatível.",
 "criar-item-foco-magia": "Prepara magias, focos e efeito Psíquico inicial.",
 "escudo-arcano": "Escudo de 1 rodada; E+P mantidos formam DE/Integridade; Psíquico anula Perfurante físico, não dano.",
 "conjuracao-equilibrada": "Especialização de alcance de efeitos mágicos; distância e procedimento pendentes.",
 "improviso": "+1A e elemento disponível na cena sem efeito especial.",
 "mestre": "+1A cumulativo e dois efeitos de elementos habilitados.",
 "fogo": "G2 Queimar: E + P à Integridade; G3 Derreter: E + P à Integridade e 1 Vida direta fixa.",
 "agua": "Água leve, congelamento e manipulação.",
 "vento": "Ar leve, movimento e deslocamento.",
 "terra": "Terra leve, terreno e percepção sísmica.",
 "sagrado": "Êxitos excedentes recuperam Coragem; P anula recuperação.",
 "veneno": "Magia de Veneno: 1 acúmulo em alvo com Sangramento; limiares por Vida atual",
 "sangue": "Magia de Sangue amplificada: TODO o dano calculado à Vida, sem atingir Integridade. Custo: 1 Vida própria OU 3 marcas inimigas; 1 vez/turno.",
 "trevas": "Até dois alvos; +2P válidos para DE, dano e risco; dividir ou concentrar Pavor.",
 "criar-veneno": "Produz venenos; 1 dose por arma e 1 acúmulo por efeito ativado",
 "criar-antidoto": "Fabrica Antídoto; cada dose não diluída remove 1 acúmulo de Envenenamento",
 "transfusao": "Transfere 1 Vida ou aplica Antídoto à distância.",
 "transfusao-sanguinaria": "Exclusiva de Lucker de Sangue; conjuração ativa. 3 marcas disponíveis de sangue inimigo recuperam +1 Vida, mantendo custo 1 XP e requisitos Transfusão + Elemento Sangue.",
 "armas-longo-alcance": "Arcos e bestas: ativa efeitos, remove Desvantagens naturais por peso",
 "golpe-fulminante": "Por 1 Coragem: eleva um dado de arma d6→d10, d10→d12 ou d12→2d12; no acerto Pavor válido vale 1 dano por P",
 "espalhar-golpe": "Raio 3 m, até 2 alvos adicionais por ativação, metade do dano dos Êxitos, SEM +1E",
 "maestria-arremesso-armas": "Ativa Sangramento, Perfuração, Veneno etc. da arma arremessada; arremessar é ação básica",
 "disparo-fulminante": "Por 1 Coragem: eleva um dado de arma d6→d10, d10→d12 ou d12→2d12; no acerto Pavor válido vale 1 dano por P",
 "disparo-multiplo": "Principal recebe dano integral; adicionais no raio de 3 m recebem metade dos Êxitos e 0,5 por P",
 "disparo-violento": "Derruba inimigo atingido e empurra 4 m",
 "disparo-tatico": "Técnica futura, com compatibilidade com Arremesso definida",
 "armas-fogo": "Perfurante é passivo quando presente; Barulhenta +1P fixo. Descarregar Tambor contra um alvo",
 "golpe-baixo": "Acerto aplica Desvantagem (−1A) durante 1 rodada",
 "maestria-manejo-duplo": "Uma única rolagem Armas + Armas + Atributo, característica escolhida entre as armas, dano básico uma vez",
 "furtividade": "Recebe Vantagem (+1A) em testes com Furtividade, cumulativa com Concentrado",
 "furtividade-avancada": "Acrescenta mais um Atributo, Conhecimento ou Prática pertinente a teste de Furtividade",
 "medicina-avancada": "Medicina predominante + duas fontes pertinentes; tratar Sangrando exige rolagem contra DE defensiva do alvo com −1A",
 "protecao-avancada": "Proteção predominante + até duas fontes adicionais pertinentes, respeitando limites da pilha",
 "astronomia-avancada": "Astronomia predominante + até duas fontes adicionais pertinentes, respeitando limites da pilha",
 "alquimia-avancada": "Alquimia predominante + até duas fontes adicionais pertinentes, respeitando limites da pilha",
 "engenharia-avancada": "Engenharia predominante + até duas fontes adicionais pertinentes, respeitando limites da pilha",
 "erudicao-avancada": "Erudição predominante + até duas fontes adicionais pertinentes, respeitando limites da pilha",
 "atletismo-avancado": "Atletismo predominante + até duas fontes adicionais pertinentes, respeitando limites da pilha",
 "artesao-avancado": "Artesão predominante + até duas fontes adicionais pertinentes, respeitando limites da pilha",
 "maestria-martelos": "Martelo habilitado pelo peso: acerto comum ativa 1 característica gratuita; crítico ativa até 2 características diferentes gratuitas e pode pagar 1 Coragem para mais uma terceira, se existente. Não exige Perícia de Armas para compra, só para ativação",
 "maestria-adagas":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-espadas":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-machados":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-macas":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-hastes":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-cajados":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-arcos":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-bestas":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-arremessos":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-punhos":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-longo-alcance":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-armas-fogo":"Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "ferreiro": "Cria armas e armaduras Médias/Pesadas G1; conserta/modifica armas; prepara minérios e metais. +1E apenas em testes de Forja, sem alterar outras rolagens de Artesão",
 "ferreiro-elemental": "Habilita criar armas elementais e pedras elementais. Receita, custo, DE e propriedades de fabricação pendentes; Encantar com Elemento é requisito comprável e nunca é concedido automaticamente",
 "resistencia-a-fogo": "Resistência pessoal à Vida: dano de Fogo que alcança a Vida do portador é reduzido à metade. Derreter G3 causa 0 de Vida direta (seu +1 fixo é anulado), mas E+P à Integridade da armadura continua normal. Não concede imunidade ou proteção à armadura",
 "encantar-com-elemento": "Armadura/escudo: 1 Coragem para aplicar resistência ao elemento adquirido. Arma: adquire temporariamente o elemento. Duração igual para os três: E-P>0; unidade temporal, DE/fontes, custo da arma e automação pendentes",
 "apresentacao-avancada": "Apresentação predominante + até duas fontes adicionais pertinentes, respeitando limites da pilha",
 "coleta-avancada": "Coleta predominante + até duas fontes adicionais pertinentes, respeitando limites da pilha"
};

const CARD_BRIEFS={
 "maos-leves":"1 XP; retira arma, escudo ou armadura de inimigo em combate. DE inimiga + Grau + peso se equipado (Leve +1, Médio +2 nos exemplos).",
 "pericia-armadilha":"1 XP; Vantagem (+1A) para armar ou desarmar armadilhas usando Proteção.",
 "golpe-furtivo":"1 XP; ataque furtivo recebe mais 1 dado da arma, respeitando limite de 9 dados rolados.",
 "bioetica":"1 XP; Destreza 3 confirmada. Cria homúnculo com sangue e tecidos vivos, ficha própria e XP igual ao total atual do criador, seguindo Domar Criaturas.",
 "pesquisa-avancada-pocoes":"1 XP; +1E em testes para criar poções; pode produzir poções elementais.",
 "corpo-fechado":"1 XP; 1 Coragem: sem efeitos ou dano na Vitalidade de golpes de armas físicas por 1 rodada.",
 "invocar-esfera-espiritual":"1 XP; 1 Coragem cria 1 esfera, até 1 por rodada. Em golpe corpo a corpo com Disciplina, Punho Supremo de Asura consome 5 esferas e converte um dado em d20.",
 "passo-etereo":"1 XP; gasta 1 Esfera Espiritual para se projetar até 8 m.",
 "absorver-esferas":"1 XP; recupera Coragem igual ao total de Esferas Espirituais, consumindo todas as esferas.",
 "disparo-esferas-espirituais":"1 XP; 1 esfera por golpe para ataque físico à distância.",
 "dilema":"1 XP; prende desafiante e alvo sem deslocamento até que um fique inconsciente.",
 "impacto-psiquico":"1 XP; golpe psíquico por 1 Coragem com efeitos de armas.",
 "sacrificio-heroico":"1 XP; Vigor 4. Intervém por outro a até 8 m mesmo sem turno antecipado e recebe dano na própria armadura ou Vida.",
 "escudo-refletor":"1 XP; Maestria em Escudos. Escudo equipado reflete parcela de dano de Pavor realmente sofrida, sem anular o golpe.",
 "sentido-elemental":"1 XP; Inteligência 3 e Improviso Elemental. 1 Coragem para descobrir a afinidade elemental do alvo com Narrador.",
 "cancelar-magia":"1 XP; Criar Item de Foco e Magia, Improviso Elemental, Inteligência/Agilidade/Destreza 4. Reage a magia até 8 m com Pavor mantido; 1 Coragem; resultado ≥ DE adversária, empate cancela; Perícia do mesmo elemento.",
 "mudanca-elemental":"1 XP; Transformação Elemental, Destreza 4, Inteligência 4. Muda elemento de criatura, armadura ou ambiente até 8 m para elemento habilitado; duração E − P, exigindo resultado positivo.",
 "desencantar":"1 XP; Cancelar Magia. Remove elementos ou imunidades em 8 m, exceto elemento natural constituinte de criatura elemental; teste e ativação pendentes.",
 "espelho-magico":"1 XP; Cancelar Magia. Passivo; reflete dano mágico por Pavor mantido antes da armadura absorver ou anular, mesmo se a Vida não for atingida; somente magia.",
 "maestria-escudos": "1 XP; Destreza 2 e Vigor 2. Com escudo equipado, +1 DE defensiva (teto 12, único) e +1 Integridade material da peça. Bônus separado da Integridade-base.",
 "escudo-bumerangue": "1 XP, Destreza 2, Força 3, Arremesso de Armas e Maestria em Escudos. Disciplina + Atributos; até 8 m; retorna no mesmo turno APENAS se acertar a DE. Falha segue queda de Arremesso de Armas; lançar custa 1 Coragem e o dano é físico normal, com características próprias do escudo quando habilitadas.",
 "montar": "2 XP, Influência 2. Vantagem nos testes com montaria; não confundir com +1A da Perícia em Montaria.",
 "pericia-montaria": "Requisitos Influência 1 + Destreza 2; +1A nos testes com montaria, NÃO Vantagem. Custo de XP PENDENTE; compra bloqueada.",
 "invocacao-elemental":"Compra 1 XP; Criar Item de Foco e Magia habilita Psique e Domar Pequena dá o porte inicial. Outros elementos exigem Perícia própria. Invocar: 1 Coragem.",
 "domar-criatura-media":"1 XP. Influência 3, Apresentação 1, Inteligência 1 e Domar Criatura Pequena.",
 "domar-criatura-grande":"1 XP. Influência 4, Apresentação 2, Inteligência 1, Domar Criatura Pequena e Domar Criatura Média.",
 "domar-criatura-pequena": "1 XP e requisitos Influência 2 e Inteligência 1, sem Apresentação como requisito de compra. Domar consome 1 Coragem; o teste publicado de Influência + Apresentação não foi alterado. Compra não é domesticação.",
 "pericia-druidica": "Transforma-se nas formas Pequena (0 Coragem, eleva 1 Atributo), Média (1 Coragem, eleva 2) ou Grande (1 Coragem, eleva 3). Não conjura nem usa armadura enquanto transformado; a Vida temporária desaparece ao reverter. Regras e cancelamentos no verbete completo.",
 "transformacao-elemental": "1 XP; requer Criar Item de Foco e Magia e uma Perícia Elemental. Ativação 1 Coragem. Imune ao elemento escolhido e intangível, exceto Terra (tangível, imune a Terra e efeitos aplicáveis das armas). Sem armadura; dano não protegido por imunidade ou Escudo Arcano chega diretamente à Vida. Duração elemental = E - P, exigindo E - P > 0, sem duração-base. Fonte e DE pendentes. Aura Sagrada: quando a Transformação Elemental em Sagrado se concretiza, pessoas num raio de 3 m recebem 1 Coragem até o teto de cada ficha. Sem recuperação periódica definida. Imunidade: zero dano do elemento; resistência: E/2 dano e P=0 dano só no elemento resistido. Foco pode amplificar (procedimento pendente); ambiente favorável exige 3 turnos de preparação. Resistência citada além de imunidade aguarda interpretação; Escudo Arcano é compatível.",
 "criar-item-foco-magia": "Inicia a conjuração Psíquica, permite preparar magias e fabricar focos. Efeitos especiais requerem acerto e ativação.",
 "escudo-arcano": "Escudo de 1 rodada. E+P válidos mantidos formam DE/Integridade. Escudo Psíquico anula Perfurante físico sem cancelar dano; Perfurar de Água não é anulado. Protege em todas as direções na forma pessoal/circular; parede linear tem cobertura própria. Efeitos de proteção não são automatizados.",
 "conjuracao-equilibrada": "Conjuração Refinada substituirá a mudança de peso por alcance ampliado de magias; números e custos ainda não reescritos pelo autor.",
 "improviso": "Adiciona +1 Antecipar e um elemento presente na cena. O elemento ajuda no impacto e afinidades, mas não ativa sua propriedade especial.",
 "mestre": "Mescla dois elementos em uma conjuração; aplica as propriedades de ambos se as duas Perícias tiverem sido adquiridas. +1A acumula com Improviso.",
 "sagrado": "Recupera Coragem por Êxitos excedentes depois da DE. Pavor cancela recuperação sem voltar a virar dano. Em área, aliados recuperam igualmente.",
 "trevas": "Uma rolagem contra até dois alvos; +2P antes da DE, válidos para dano e transferência. Repartir Pavor igualmente ou concentrar em um alvo; nunca duplicar.",
 "sangue": "Rework v0.74: Sangue puro atinge armadura normalmente. Após pagar 1 Vida própria OU 3 marcas inimigas, uma magia de Sangue que acerte pode aplicar TODO o dano calculado diretamente à Vida, sem desgaste simultâneo de armadura. Exclusivo desta build, sem bônus gratuito. Compete com manter ou elevar dado, no limite de uma vez por turno.",
 "veneno": "Conjuração distinta da alquimia Criar Veneno. No acerto em alvo com Sangramento, gasta 1 Coragem para aplicar 1 acúmulo por 2 rodadas sem renovar os anteriores. A partir de 2/3 da Vida atual, Ferido; se acúmulos alcançam Vida atual, Incapacitado. Se estiver Envenenado com exatamen…",
 "criar-antidoto": "Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos f…",
 "criar-veneno": "Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento (estado que ignora armadura, sem causar dano à Vida). Aplicação por magia de Sangue foi autorizada conceitualmente, mas entrega, custos e habilitações permanecem pendentes. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se…",
 "transfusao": "Perícia separada, utilizável em combate: transfere exatamente 1 Vida do Hemomante ao aliado ou leva Antídoto à distância consumindo doses.",
 "transfusao-sanguinaria": "Exclusiva de Lucker de Sangue. 1 XP; exige Transfusão + Elemento Sangue. Conjuração ativa; 3 marcas inimigas por 1 Vida; compra prévia de Transfusão pendente.",
 "fogo": "SRD v0.76: G1 disparo convencional; G2 Queimar causa E+P à Integridade; G3 Derreter mantém esse dano e acrescenta só 1 Vida direta, não dobrada no crítico. Áreas e custos mantidos; validação dos Graus pelo Narrador.",
 "agua": "Manipula água, produz congelamento leve e abre efeitos de perfuração nos Graus superiores, com os custos pertinentes.",
 "vento": "Manipula deslocamento e correntes de ar, incluindo autoempurrão, formas em L e X e outras curvas por caminhos abertos para tirar alvos de cobertura; alcance, DE e procedimentos pendentes.",
 "terra": "Manipula terreno, dificulta movimentação e ajuda a detectar ameaças pelo sentido sísmico.",
 "armas-longo-alcance": "Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especi…",
 "golpe-fulminante": "Ativação custa 1 Coragem, inclusive no crítico: eleva temporariamente UM dado da arma antes de rolar (d6→d10; d10→d12; d12→2d12). Se acertar, cada Pavor mantido não anulado vale 1 dano, conservando risco e Pressão. Requer especialização corpo a corpo; Arremesso não satisfaz Golpe Fulminante. Máximo 9 dados.…",
 "espalhar-golpe": "Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SE…",
 "maestria-arremesso-armas": "Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Al…",
 "disparo-fulminante": "Técnica somática de arco, besta ou arremesso, exceto armas de fogo. Ativação 1 Coragem (inclusive no crítico): eleva UM dado da arma antes da rolagem (d6→d10, d10→d12 ou d12→2d12); no acerto, cada Pavor não anulado causa 1 dano, preservando risco. Combina com outras técnicas pagas, respeitando 9 dados e 5 Coragens por rodada.…",
 "disparo-multiplo": "A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e some…",
 "disparo-violento": "Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crític…",
 "disparo-tatico": "O autor confirmou compatibilidade com Perícia em Arremesso de Armas. Requisitos completos, custo, efeitos e ativação ainda PENDENTES. Não habilitar compra nem automatizar efeitos.…",
 "armas-fogo": "Crítico ativa UMA característica escolhida gratuitamente; acerto normal custa 1 Coragem. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escope…",
 "golpe-baixo": "Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, m…",
 "maestria-manejo-duplo": "Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica das duas armas sem custo; acerto comum ativa ambo…",
 "furtividade": "Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.…",
 "furtividade-avancada": "Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite…",
 "medicina-avancada": "Medicina 2, 1 XP. Com Medicina predominante, combina Medicina + Atributo + complemento pertinente. Ao tratar Sangrando, teste contra a DE defensiva do alvo com Desvantagem (−1A); sucesso remove Sangrando.",
 "protecao-avancada": "1 XP; requisito Proteção 2. Com Proteção como fonte principal, permite uma terceira fonte pertinente, até três no total. Efeitos específicos diferentes desse benefício não definidos.",
 "astronomia-avancada": "1 XP; requisito Astronomia 2. Com Astronomia como fonte principal, permite uma terceira fonte pertinente, até três no total. Efeitos específicos diferentes desse benefício não definidos.",
 "alquimia-avancada": "1 XP; requisito Alquimia 2. Com Alquimia como fonte principal, permite uma terceira fonte pertinente, até três no total. Efeitos específicos diferentes desse benefício não definidos.",
 "engenharia-avancada": "1 XP; requisito Engenharia 2. Com Engenharia como fonte principal, permite uma terceira fonte pertinente, até três no total. Efeitos específicos diferentes desse benefício não definidos.",
 "erudicao-avancada": "1 XP; requisito Erudição 2. Com Erudição como fonte principal, permite uma terceira fonte pertinente, até três no total. Efeitos específicos diferentes desse benefício não definidos.",
 "atletismo-avancado": "1 XP; requisito Atletismo 2. Com Atletismo como fonte principal, permite uma terceira fonte pertinente, até três no total. Efeitos específicos diferentes desse benefício não definidos.",
 "artesao-avancado": "1 XP; requisito Artesão 2. Com Artesão como fonte principal, permite uma terceira fonte pertinente, até três no total. Efeitos específicos diferentes desse benefício não definidos.",
 "maestria-martelos": "1 XP; exige Força 3, Destreza 1 e Vigor 1. Com Perícia de Armas do peso, em acerto comum ativa 1 efeito grátis; em crítico, 2 diferentes grátis + possibilidade de terceira por 1 Coragem. Apenas efeitos existentes na arma.",
 "maestria-adagas":"Aquisição PENDENTE: custo e requisitos próprios não definidos. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-espadas":"1 XP; Força 2, Destreza 2. Ao acertar com espada, ativa uma característica existente da arma sem Coragem, exigindo a Perícia do peso; crítico mantém até 2 diferentes gratuitas e terceira diferente por 1 Coragem.",
 "maestria-machados":"Aquisição PENDENTE: custo e requisitos próprios não definidos. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-macas":"Aquisição PENDENTE: custo e requisitos próprios não definidos. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-hastes":"1 XP; Força 2, Agilidade 1, Destreza 1. Ao acertar com lança da família atual Lanças e Hastes, ativa uma característica existente sem Coragem, exigindo a Perícia do peso; crítico mantém até 2 diferentes gratuitas e terceira diferente por 1 Coragem.",
 "maestria-cajados":"Aquisição PENDENTE: custo e requisitos próprios não definidos. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-arcos":"Aquisição PENDENTE: custo e requisitos próprios não definidos. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-bestas":"Aquisição PENDENTE: custo e requisitos próprios não definidos. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-arremessos":"Aquisição PENDENTE: custo e requisitos próprios não definidos. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-punhos":"Aquisição PENDENTE: custo e requisitos próprios não definidos. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-longo-alcance":"Aquisição PENDENTE: custo e requisitos próprios não definidos. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "maestria-armas-fogo":"Exclusiva Humano: concessão racial gratuita; Perícia em Armas de Fogo necessária para ativar. Em acerto comum: 1 característica própria gratuita. No crítico: 2 diferentes gratuitas e uma terceira diferente por 1 Coragem, desde que a arma tenha tais características. Requer habilitação de manejo; respeitar DE, recursos e gatilhos.",
 "ferreiro": "1 XP; requer Artesão 1, Força 1, Destreza 1, Inteligência 1 e Artesão Avançado (que exige Artesão 2). +1E somente em teste de Forja; armas e armaduras Médias/Pesadas G1, conserto/modificação de armas e preparação de minérios/metais. Fabricação automática pendente.",
 "ferreiro-elemental": "1 XP; requer Ferreiro, Inteligência 2, Destreza 2, Improviso Elemental, Criar Item de Foco e Magia e Encantar com Elemento. Cria armas elementais e pedras elementais; receitas e automação pendentes.",
 "resistencia-a-fogo": "1 XP. Exige Ferreiro Elemental, Perícia em Elemento Fogo e Vigor 2. O portador reduz à metade o dano de Fogo à Vida, sem proteger a armadura. O +1 de Vida direta de Derreter é 0, enquanto E+P à Integridade permanece normal. Frações e interações pendentes.",
 "encantar-com-elemento": "1 XP. Exige uma Perícia Elemental + Criar Item de Foco e Magia. Armaduras e escudos: 1 Coragem por resistência elemental; armas tornam-se do elemento habilitado. Mesma duração E-P>0 para todos. Custo da arma e unidade temporal pendentes.",
 "apresentacao-avancada": "1 XP; requisito Apresentação 2. Com Apresentação como fonte principal, permite uma terceira fonte pertinente, até três no total. Efeitos específicos diferentes desse benefício não definidos.",
 "coleta-avancada": "1 XP; requisito Coleta 2. Com Coleta como fonte principal, permite uma terceira fonte pertinente, até três no total. Efeitos específicos diferentes desse benefício não definidos."
};

const CARD_ACTIVATIONS={
 "maos-leves":"Teste de Disciplina + Furtividade; confirmação do Narrador para inventário/DE.",
 "pericia-armadilha":"Vantagem contextual (+1A) em teste com Proteção para armar ou desarmar armadilhas.",
 "golpe-furtivo":"Dado da arma adicional no ataque furtivo; sem custo de Coragem informado.",
 "bioetica":"Cria homúnculo com ficha própria e XP como Domar Criaturas, conforme porte; materiais e procedimento pendentes.",
 "pesquisa-avancada-pocoes":"+1E na criação de poções; habilita poções elementais.",
 "corpo-fechado":"1 Coragem; protege Vitalidade de efeitos e danos de armas físicas por 1 rodada.",
 "invocar-esfera-espiritual":"1 Coragem = 1 Esfera Espiritual (uma por rodada). Punho Supremo de Asura consome 5 para substituir um dado por d20 em golpe corpo a corpo com Disciplina.",
 "passo-etereo":"1 esfera; deslocamento rápido de 8 m.",
 "absorver-esferas":"Recupera Coragem = total de esferas; consome todas as esferas.",
 "disparo-esferas-espirituais":"1 esfera por ataque físico à distância; alcance/dano pendentes.",
 "dilema":"Pacto impede movimento de ambos até um ficar inconsciente; custo de ativação não informado.",
 "impacto-psiquico":"1 Coragem; golpe psíquico pode aplicar efeitos de armas.",
 "sacrificio-heroico":"Intervenção protetora até 8 m mesmo fora do turno; ativação sem custo adicional informado",
 "escudo-refletor":"Passiva com escudo físico equipado ao sofrer dano de Pavor",
 "sentido-elemental":"1 Coragem por análise",
 "cancelar-magia":"1 Coragem por tentativa, em até 8 m; exige Pavor mantido na magia",
 "mudanca-elemental":"Mudança de elemento a 8 m; custo de ativação não informado",
 "desencantar":"Remoção elemental a 8 m; custo de ativação não informado",
 "espelho-magico":"Passiva; devolve dano mágico originado de Pavor mantido",
 "maestria-escudos": "Passiva com escudo físico equipado · +1 DE e +1 Integridade da peça",
 "escudo-bumerangue": "Arremesso de escudo: Disciplina + Atributo(s), 8 m; acerto retorna no mesmo turno, falha cai conforme Arremesso de Armas. Custa 1 Coragem para lançar; dano físico normal e características registradas na peça conforme habilitação",
 "montar": "Vantagem nos testes com montaria; não é +1A",
 "pericia-montaria": "+1A em testes com montaria; não é Vantagem; aquisição PENDENTE",
 "invocacao-elemental":"1 Coragem; segundo elemento +1 Coragem (Improviso + Maestria); efeitos especiais +1 Coragem",
 "domar-criatura-media":"1 Coragem + teste de Influência + Apresentação",
 "domar-criatura-grande":"1 Coragem + teste de Influência + Apresentação",
 "domar-criatura-pequena": "1 Coragem + teste de Influência + Apresentação",
 "pericia-druidica": "Pequena: 0 Coragem; Média e Grande: 1 Coragem",
 "transformacao-elemental": "1 Coragem. Ambiente favorável: 3 turnos. Duração = E-P (>0); unidade, fontes, DE e amplificação pendentes.",
 "criar-item-foco-magia": "G1/G2 Psíquico: ativação-base gratuita",
 "escudo-arcano": "1 Coragem (+ custo por expansão)",
 "conjuracao-equilibrada": "PENDENTE",
 "improviso": "Passiva",
 "mestre": "Mistura: 1A; custo próprio da Maestria PENDENTE",
 "fogo": "G1/G2: gratuito com Perícia e Grau habilitados, com ou sem foco se houver fonte elemental; G3: 1 Coragem; G4: 1 Coragem pela elevação de Fogo (2 no total se os dois elementos chegam a G3)",
 "agua": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
 "vento": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
 "terra": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
 "sagrado": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
 "veneno": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
 "sangue": "1 Vida própria OU 3 Sangues de inimigos · 1 uso/turno",
 "trevas": "G1/G2: ativação-base gratuita; G3: +1 Coragem quando habilitado",
 "criar-veneno": "Preparação alquímica; ativação conforme arma",
 "criar-antidoto": "1 dose remove 1 acúmulo",
 "transfusao": "Custo de Vida; custo de ativação PENDENTE",
 "transfusao-sanguinaria": "Conjuração ativa · custo e procedimento pendentes",
 "armas-longo-alcance": "1 Coragem no acerto comum; crítico gratuito",
 "golpe-fulminante": "1 Coragem; crítico não dispensa",
 "espalhar-golpe": "1 Coragem por até 2 alvos adicionais",
 "maestria-arremesso-armas": "1 Coragem ao acertar para ativar efeitos",
 "disparo-fulminante": "1 Coragem; crítico não dispensa",
 "disparo-multiplo": "1 Coragem a cada até 2 alvos adicionais",
 "disparo-violento": "1 Coragem; crítico não dispensa",
 "disparo-tatico": "PENDENTE",
 "armas-fogo": "1 Coragem no acerto comum; crítico gratuito para efeitos da arma",
 "golpe-baixo": "1 Coragem",
 "maestria-manejo-duplo": "1 Coragem no acerto normal; crítico gratuito",
 "furtividade": "Passiva",
 "furtividade-avancada": "Passiva",
 "medicina-avancada": "Passiva para compor fontes; tratamento exige teste",
 "protecao-avancada": "Passiva",
 "astronomia-avancada": "Passiva",
 "alquimia-avancada": "Passiva",
 "engenharia-avancada": "Passiva",
 "erudicao-avancada": "Passiva",
 "atletismo-avancado": "Passiva",
 "artesao-avancado": "Passiva",
 "maestria-martelos": "Acerto comum: 1 efeito grátis. Crítico: 2 efeitos diferentes grátis e uma terceira por 1 Coragem; requer arma e Perícia de peso habilitadas. Escolha manual",
 "maestria-adagas":"Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
 "maestria-espadas":"1 XP; Força 2 + Destreza 2. Ao acertar: 1 característica grátis; crítico mantém 2 diferentes grátis e terceira diferente por 1 Coragem. Exige Perícia em Armas do peso.",
 "maestria-machados":"Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
 "maestria-macas":"Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
 "maestria-hastes":"1 XP; Força 2 + Agilidade 1 + Destreza 1. Ao acertar: 1 característica grátis; crítico mantém 2 diferentes grátis e terceira diferente por 1 Coragem. Exige Perícia em Armas do peso.",
 "maestria-cajados":"Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
 "maestria-arcos":"Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
 "maestria-bestas":"Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
 "maestria-arremessos":"Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
 "maestria-punhos":"Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
 "maestria-longo-alcance":"Aquisição pendente; efeito: 1 grátis comum, 2 grátis crítico e +1 Coragem para terceiro, conforme habilitação.",
 "maestria-armas-fogo":"Racial Humano · 0 XP; efeitos dependem de Perícia em Armas de Fogo.",
 "ferreiro": "Passiva no teste de Forja; produção/alterações aguardam procedimento",
 "ferreiro-elemental": "Habilitação de criação; procedimentos de fabricação pendentes",
 "resistencia-a-fogo": "Passiva pessoal: metade do dano de Fogo à Vida e 0 Vida direta por Derreter. Não protege Integridade; cálculos automáticos pendentes",
 "encantar-com-elemento": "Armadura/escudo: 1 Coragem. Arma: custo PENDENTE. Duração E-P>0 para ambos",
 "apresentacao-avancada": "Passiva",
 "coleta-avancada": "Passiva"
};

function skillCompactCard([id,baseName,detail,cost],wizard){
 const name=id==="escudo-arcano"&&state.race==="runa_espinhos"?"Escudo Rúnico":baseName;
 const racial=racialGrants(state).includes(id),owned=ownsSkill(id),req=skillReq(id),affordable=Number.isInteger(cost)&&canAfford("skills",cost);
 const disabled=racial||!!state.pending||(!owned&&(!!req||!affordable));
 const act=CARD_ACTIVATIONS[id]||(id==="olhos-de-aguia"?"Passiva · sem custo":(/1 Coragem/i.test(detail)?"1 Coragem (quando exigida)":"Passiva / consultar"));
 const practical=CARD_EFFECTS[id]||detail.replace(/^\\d+ XP [·•] /,"").split(". ")[0].slice(0,105);
 const warning=req||(!owned&&!affordable?"XP insuficiente.":"");
 const button=racial?"Origem · Gratuita":owned?("Devolver "+(Number.isInteger(cost)?cost:"?")+" XP · playtest"):cost===null?"Pendente":"Comprar · "+cost+" XP";
 return '<article tabindex="0" class="fp-skill fp-skill-compact'+(wizard?' fp-wiz-skill':'')+(owned?' owned selected':'')+'" data-skill-open="'+esc(id)+'" aria-label="Abrir detalhes de '+esc(name)+'">'+
 '<a class="fp-skill-content fp-skill-main-link" href="../pericias/'+SKILL_PERMALINKS[id]+'.html" aria-label="Ler verbete completo de '+esc(name)+'"><span class="fp-skill-heading">'+codexSkillIcon(id)+'<strong>'+esc(name)+'</strong></span><dl class="fp-skill-quick">'+
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
// Pictogramas apenas visuais: não fornecem dados, habilidades nem novos requisitos.
const CODEX_SKILL_ICONS=Object.freeze({
 "armas-leves":"arma-adaga","armas-medias":"arma-espada","armas-pesadas":"arma-montante",
 "armas-longo-alcance":"arma-arco","maestria-arremesso-armas":"arma-arremesso",
 "armas-fogo":"arma-pistola","pugilismo":"arma-punhos","manejo-perfeito":"arma-espada",
 "maestria-manejo-duplo":"arma-espada","disciplina-avancada":"arma-espada",
 "criar-item-foco-magia":"magia-foco","escudo-arcano":"armadura-escudo-arcano",
 "improviso":"magia-circulo","invocacao-elemental":"magia-circulo",
 "pericia-druidica":"categoria-natureza","transformacao-elemental":"magia-transformacao",
 "psiquico":"elemento-psiquico","fogo":"elemento-fogo","agua":"elemento-agua","vento":"elemento-ar",
 "terra":"elemento-terra","sagrado":"elemento-sagrado","sangue":"elemento-sangue",
 "trevas":"elemento-trevas","veneno":"elemento-veneno"
});
function codexItemIconId(item){
 const name=String(item?.name||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const type=item?.kind||item?.type||"";
 if(type==="shield"||type==="escudo")return "armadura-escudo";
 if(type==="armor"||type==="armadura"){
  if(/muito leve|roupas simples/.test(name)||item.weight==="muito_leve")return "armadura-muito-leve";
  if(/pesada|pesado/.test(name)||item.weight==="alto")return "armadura-pesada";
  if(/media|medio/.test(name)||item.weight==="medio")return "armadura-media";
  return "armadura-leve";
 }
 if(type==="focus"||type==="foco")return "magia-foco";
 if(type==="weapon"||type==="firearm"||type==="arma"){
  if(/punho|luva|soqueira|manopla/.test(name))return "arma-punhos";
  if(/arco/.test(name))return "arma-arco";
  if(/besta/.test(name))return "arma-besta";
  if(/revolver|pistola|mosquete|rifle|metralhadora|escopeta/.test(name))return "arma-pistola";
  if(/lanca|azagaia|naginata|cajado|bastao/.test(name))return "arma-lanca";
  if(/machado|machadinha/.test(name))return "arma-machado";
  if(/montante/.test(name))return "arma-montante";
  if(/adaga|faca|punhal|kunai|shuriken/.test(name))return "arma-adaga";
  if(/espada|katana/.test(name))return "arma-espada";
  if(/arremesso|dardo|chicote/.test(name))return "arma-arremesso";
  return item.die>=12?"arma-montante":item.die>=10?"arma-espada":"arma-adaga";
 }
 return null;
}
function codexIcon(icon,cls="fp-codex-icon"){
 if(!icon||!/^[a-z0-9-]+$/.test(icon))return "";
 return '<img class="'+cls+'" src="../assets/icons/codex/'+icon+'.svg" alt="" aria-hidden="true">';
}
const codexSkillIcon=(id,cls)=>codexIcon(CODEX_SKILL_ICONS[id],cls);
const codexItemIcon=(item,cls)=>codexIcon(codexItemIconId(item),cls);


/** Organização VISUAL do catálogo: não muda categoria física, dado ou compra. */
const EQUIPMENT_FAMILIES=[
 ["all","Todos os tipos"],["espadas","Espadas"],["adagas","Adagas e facas"],
 ["martelos","Martelos e maças"],["machados","Machados"],["hastes","Lanças e hastes"],
 ["cajados","Cajados e bastões"],["distancia","Longo alcance"],
 ["fogo","Armas de fogo"],["arremesso","Arremesso"],["punhos","Luvas e punhos"],
 ["armas-outros","Outras armas"],["armadura","Armaduras"],["escudo","Escudos"],
 ["foco","Focos"],["ammunition","Munições"],["container","Aljavas e estojos"],
 ["instrument","Instrumentos"],["kit","Kits"],["adventurer","Aventureiro"],["outro","Outros"]
];
const EQUIPMENT_WEIGHT_OPTIONS=[
 ["all","Todos os pesos"],["muito_leve","Muito leve"],["leve","Leve"],
 ["medio","Médio"],["pesado","Pesado"],["extremo","Muito pesado"]
];
function equipmentFamily(item){
 const catalogRow=item.catalogId?CATALOG.find(x=>x.name===item.catalogId):null;
 const kind=item.kind||catalogRow?.kind||item.type||"";
 const n=String(item.name||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 if(kind==="firearm"||item.firearm)return "fogo";
 if(kind==="armor"||kind==="armadura")return "armadura";
 if(kind==="shield"||kind==="escudo")return "escudo";
 if(kind==="focus"||kind==="foco")return "foco";
 if(["ammunition","container","instrument","kit","adventurer"].includes(kind))return kind;
 if(kind!=="weapon"&&kind!=="arma")return "outro";
 if(/arco|besta|zarabatana/.test(n)||(item.properties||[]).includes("À Distância"))return "distancia";
 if(/espada|katana|montante/.test(n))return "espadas";
 if(/martelo|marreta|maca|clava/.test(n))return "martelos";
 if(/machado|machadinha/.test(n))return "machados";
 if(/lanca|azagaia|naginata|alabarda/.test(n))return "hastes";
 if(/cajado|bastao/.test(n))return "cajados";
 if(/faca|adaga|punhal|kunai|shuriken/.test(n))return "adagas";
 if(/luva|manopla|soqueira|punho/.test(n))return "punhos";
 if(/arremesso|dardo/.test(n))return "arremesso";
 return "armas-outros";
}
function equipmentWeight(item){
 const c=String(item.category||"").replace(/-/g,"_");
 if(["muito_leve","leve","medio","pesado","extremo"].includes(c))return c;
 if(item.weight==="muito_leve")return "muito_leve";
 if(item.weight==="leve")return "leve";
 if(item.weight==="medio")return "medio";
 if(item.weight==="alto")return "pesado";
 if(item.weight==="extremo")return "extremo";
 return "leve";
}
// Maestria em Martelos: Perícia de Armas conforme o PESO é exigida na ativação,
// e não como requisito para comprar Maestria em Martelos.
function hammerMasteryRequiredSkill(item){
 if(!item||!["weapon","arma"].includes(item.type))return null;
 const name=String(item.name||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 if(!/martelo|marreta/.test(name))return null;
 return {leve:"armas-leves",medio:"armas-medias",pesado:"armas-pesadas"}[equipmentWeight(item)]||null;
}
function hammerMasteryCanActivate(item,s=state){
 const required=hammerMasteryRequiredSkill(item);
 return !!required&&ownsSkill("maestria-martelos",s)&&ownsSkill(required,s);
}
// Orçamento de características para um ATAQUE QUE ACERTOU, não executa efeitos ou gasta recursos.
function hammerMasteryOnHit(item,critical=false,payExtra=false,s=state){
 if(!hammerMasteryCanActivate(item,s))return {free:0,paid:0,courageCost:0,maxEffects:0};
 const free=critical?2:1;
 const paid=critical&&payExtra?1:0;
 return {free,paid,courageCost:paid,maxEffects:free+paid};
}
// Identificação conservadora de famílias: o catálogo visual não concede Maestria por proximidade.
function weaponMasteryId(item){
 if(!item||!["weapon","arma"].includes(item.type))return null;
 const name=String(item.name||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 if(item.firearm||/revolver|pistola|mosquete|rifle|metralhadora|escopeta|shotgun|sniper|lanca.granadas/.test(name))return "maestria-armas-fogo";
 if(/martelo|marreta/.test(name))return "maestria-martelos";
 if(/maca|clava/.test(name))return "maestria-macas";
 if(/besta/.test(name))return "maestria-bestas";
 if(/arco/.test(name))return "maestria-arcos";
 if(/adaga|faca|punhal|kunai/.test(name))return "maestria-adagas";
 if(/espada|katana|montante/.test(name))return "maestria-espadas";
 if(/machado|machadinha/.test(name))return "maestria-machados";
 if(/lanca|azagaia|naginata|alabarda/.test(name))return "maestria-hastes";
 if(/cajado|bastao/.test(name))return "maestria-cajados";
 if(/luva|manopla|soqueira|punho/.test(name))return "maestria-punhos";
 if(/dardo|shuriken|funda|arremesso/.test(name))return "maestria-arremessos";
 if(/zarabatana/.test(name)||(item.properties||[]).includes("À Distância"))return "maestria-longo-alcance";
 return null; // Famílias não classificadas continuam pendentes em vez de ganhar Maestria arbitrária.
}
function weaponMasteryRequiredSkill(item){
 const id=weaponMasteryId(item);
 if(!id)return null;
 if(id==="maestria-martelos")return hammerMasteryRequiredSkill(item);
 if(id==="maestria-armas-fogo")return "armas-fogo";
 if(id==="maestria-punhos")return "pugilismo";
 if(["maestria-arcos","maestria-bestas","maestria-longo-alcance"].includes(id))return "armas-longo-alcance";
 if(id==="maestria-arremessos")return "maestria-arremesso-armas";
 return {leve:"armas-leves",medio:"armas-medias",pesado:"armas-pesadas"}[equipmentWeight(item)]||null;
}
function weaponMasteryCanActivate(item,s=state){
 const id=weaponMasteryId(item),required=weaponMasteryRequiredSkill(item);
 if(!id||!required||!ownsSkill(id,s)||!ownsSkill(required,s))return false;
 if(id==="maestria-arremessos"){
  const weightSkill={leve:"armas-leves",medio:"armas-medias",pesado:"armas-pesadas"}[equipmentWeight(item)];
  if(!weightSkill||!ownsSkill(weightSkill,s))return false;
 }
 return id!=="maestria-armas-fogo"||s.race==="humano";
}
function weaponMasteryOnHit(item,critical=false,payExtra=false,s=state){
 if(!weaponMasteryCanActivate(item,s))return {free:0,paid:0,courageCost:0,maxEffects:0};
 const free=critical?2:1,paid=critical&&payExtra?1:0;
 return {free,paid,courageCost:paid,maxEffects:free+paid};
}
function equipmentGroupName(id){return EQUIPMENT_FAMILIES.find(x=>x[0]===id)?.[1]||"Outros";}
function equipmentWeightName(id){return EQUIPMENT_WEIGHT_OPTIONS.find(x=>x[0]===id)?.[1]||"Leve";}
function equipmentMatches(item,family,weight){
 return (family==="all"||equipmentFamily(item)===family)&&
  (weight==="all"||equipmentWeight(item)===weight);
}
function equipmentDetails(item){
 const kind=item.kind||item.type;
 const weight=equipmentWeightName(equipmentWeight(item));
 const p=item.properties||[];
 const info=[weight];
 if(item.die>0)info.push("d"+item.die+" com Perícia");
 if(kind==="armor"||kind==="armadura"){
  info.push("Integridade "+(item.integrity?.max??item.max??0));
  info.push(({muito_leve:"+2 DE",leve:"+1 DE",medio:"0 DE",pesado:"−1 DE",extremo:"−2 DE"})[equipmentWeight(item)]||"DE a conferir");
 }else if(kind==="shield"||kind==="escudo")info.push("Integridade "+(kind==="escudo"?shieldIntegrityDisplay(item).max:(item.integrity?.max??item.max??0))+(kind==="escudo"&&shieldMasteryActive(item)?" (+1 Maestria)":""));
 if(item.range>0)info.push("Alcance "+item.range+" m");
 if(p.length)info.push(p.join(" · "));
 return info.join(" · ");
}
function preferredQuickAttribute(item){
 if(item.type==="foco"&&(state.attributes.inteligencia||0)>0)return "inteligencia";
 const previous=draft.attribute;
 if(previous?.group==="attr"&&(state.attributes[previous.key]||0)>0)return previous.key;
 const priority=["destreza","forca","agilidade","vigor","inteligencia","influencia"];
 return priority.filter(k=>(state.attributes[k]||0)>0)
  .sort((a,b)=>state.attributes[b]-state.attributes[a])[0]||null;
}
function quickRollItem(id){
 const item=state.items.find(it=>it.id===id&&it.equipped&&["arma","foco"].includes(it.type));
 if(!item){toast("Somente arma ou foco equipado pode iniciar uma rolagem de equipamento.");return;}
 if(state.pending){toast("Finalize primeiro a rolagem pendente.");return;}
 if(editMode){toast("Conclua a edição antes de rolar.");return;}
 const mode=item.type==="foco"?"conjuracao":"armas";
 if(!combatItem(item,mode).length){
  toast("O dado de "+item.name+" exige a Perícia de manejo ou foco pertinente; revise a ficha.");return;
 }
 const attr=preferredQuickAttribute(item);
 if(!attr){toast("Selecione um Atributo treinado para rolar com Disciplina.");sheetPage="play";render();return;}
 const de=Number.isInteger(draft.de)?draft.de:1;
 draft=freshDraft();
 draft.base={group:"practice",key:"armas_conjuracao"};
 draft.attribute={group:"attr",key:attr};
 draft.mode=mode;draft.equipmentId=id;draft.de=de;
 sheetPage="play";
 // Ação preparada: o jogador escolhe recursos antes de executar a rolagem.
 render();
 $("composer-content")?.scrollIntoView?.({behavior:"smooth",block:"start"});
 toast("Ação preparada com "+item.name+". Ajuste seus recursos e clique em Rolar dados.");
}

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
 // Foco pode estar somente no inventário para conjurar; armas ainda exigem estar equipadas.
 if(!item||!(item.equipped||(mode==="conjuracao"&&item.type==="foco"))||!["arma","foco"].includes(item.type))return [];
 if(!((item.grade||1)<= (state.level>=20?4:state.level>=10?3:state.level>=5?2:1)))return [];
 const skills=allOwnedSkills(),properties=item.properties||[],range=properties.includes("À Distância");
 const cat=item.category||({leve:"leve",medio:"medio",alto:"pesado"}[item.weight]||"leve");
 const die=[6,10,12].includes(item.die)?item.die:({leve:6,medio:10,pesado:12}[cat]||0);
 if(!die)return [];
 if(mode==="conjuracao"){
  // SRD v0.89: apenas o Grau da magia adiciona seu dado, nunca o foco.
  return [];
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
 const type=entry.kind==="armor"?"armadura":entry.kind==="shield"?"escudo":entry.kind==="focus"?"foco":entry.kind==="kit"||entry.kind==="instrument"?"ferramenta":entry.kind==="weapon"||entry.kind==="firearm"?"arma":"outro";
 const weight=entry.category==="muito-leve"?"muito_leve":entry.category==="pesado"?"alto":entry.category==="medio"?"medio":"leve";
 return normalizeItem({name:entry.name,type,weight,category:entry.category,grade:entry.grade,qty:1,
  max:entry.integrity?.max||0,hp:entry.integrity?.value||0,equipped:false,
  die:entry.die||0,range:entry.range||0,priceVT:entry.priceVT||0,properties:entry.properties||[],
  element:entry.element||"",firearm:entry.kind==="firearm",catalogId:entry.name,
  durability:entry.durability?.value||0,durabilityMax:entry.durability?.max||0,
  packSize:entry.packSize||0,ammoRemaining:entry.packSize||0,storageCapacity:entry.storageCapacity||0,description:entry.description||""});
}

const SITUATIONS={normal:["Normal",0,0],vantagem:["Vantagem (+1A)",0,1],desvantagem:["Desvantagem (−1A)",0,-1],absoluta:["Vantagem absoluta (+1E)",1,0],desv_absoluta:["Desvantagem absoluta (−1E)",-1,0],sorte:["Ação de Sorte (−2E)",-2,0]};
const $=id=>document.getElementById(id),esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
const key=x=>x?x.group+"."+x.key:"";
const same=(a,b)=>!!a&&!!b&&key(a)===key(b);
const pad=n=>Number(n).toLocaleString("pt-BR",{maximumFractionDigits:4});
const getId=()=>typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"item-"+Date.now()+"-"+Math.floor(Math.random()*1e6);
function defaultState(){return{
 schema:"codex-html-playtest-v1",name:"",concept:"",origin:"",race:"humano",pureElement:"",runeElements:["",""],racialInitialAttributes:[],perseverancaUsed:false,runeShieldFreeUsed:false,virtue:"",personality:"",portrait:"",
 level:1,attributes:{},knowledges:{},practices:{},skills:[],weaponFocus:"leve",creationLocked:false,creationBudgetSnapshot:null,
 xpEarned:0,legacyXPRefund:0,xpHistory:[],life:4,courage:10,courageRoundSpent:0,xp:0,
 smallCompanion:{present:false,name:"",species:"outro"},
 items:[],trade:tradeDefault(),elementalCrystal:{element:"",quantity:0},spiritualSpheres:{count:0,createdThisRound:0},notes:"",pending:null,history:[],
 hemomancy:{spilled:0,extracted:0,selfBleeding:false,usedThisTurn:false,boostKind:"",boostPayment:"",directLifeResolved:false}
};}
let state=defaultState(),draft=null,toastTimer=null,wizardStep=0,wizardReached=0,viewMode="builder",editMode=false;
let playerSheets=[],activePlayerSheetId="";
let wizardCategory="",wizardTab="attr",wizardMode="genetic";
let wizardStarterPhase="attr",wizardStarterAttribute="",wizardStarterTraining="",wizardStarterPurchased="";
let wizardShopCategory="all",wizardShopWeight="all",wizardTradePreferred="ervas";
let tradeShopType="all",tradeShopWeight="all",inventoryType="all",inventoryWeight="all";
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
 agilidade:["Movimento e reação","Mover-se, reagir, reposicionar-se e evitar ameaças.","Contribui integralmente à DE defensiva, além do deslocamento."],
 destreza:["Precisão e coordenação","Manipular objetos, executar movimentos finos e agir com precisão.","Contribui para a DE defensiva e ações que dependem de coordenação."],
 inteligencia:["Raciocínio e compreensão","Analisar situações, interpretar pistas e resolver problemas lógicos.","Pode combinar com estudos pertinentes, sem habilitar efeitos automaticamente."],
 influencia:["Presença e interação","Comunicar, convencer, negociar e liderar em situações sociais.","Para caminhos sociais, expressivos e de liderança."],
 vigor:["Resistência física","Suportar cansaço, esforço prolongado e condições adversas.","Na DE base, soma com Destreza e então divide por 2 (SRD v0.89). Contribui para a Vida."]
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
  extraKeep:false,step:false,stepSourceId:"",fulminante:"",attackThrown:false,domarActivate:false,combatBonus:false,weightEnabled:false,attackWeight:"leve",targetWeight:"medio",
  shieldRaise:false,contextOK:false,equipmentId:"",trevas:false,cravarRemovalShieldId:"",cravarRemovalDEConfirmed:false,
  shieldThrowId:"",shieldThrowMeters:8,maosLeves:false,stealthAttack:false,potionResearch:false,asura:false,asuraDieId:"",
  magicElement:"",magicSecondElement:"",magicGrade:1,magicFocusId:"",magicSecondFocusId:"",magicCharges:0,magicAmplify:false,magicGradeConfirmed:false,magicTimeConfirmed:false});
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
  shopCategory:wizardShopCategory,shopWeight:wizardShopWeight,tradePreferred:wizardTradePreferred};
}
function restoreWizard(w={}){
 const oldStep=Math.floor(w.step||0),oldReached=Math.floor(w.reached||oldStep);
 wizardStep=w.version>=4?clamp(oldStep,0,4):w.version>=2?(oldStep>=3?4:clamp(oldStep,0,2)):clamp(oldStep>0?1:0,0,4);
 wizardReached=w.version>=4?clamp(oldReached,wizardStep,4):w.version>=2?(oldReached>=3?4:Math.max(wizardStep,clamp(oldReached,0,2))):wizardStep;
 wizardCategory=["attr","know","practice"].includes(w.category)?w.category:"";
 wizardTab=["attr","know","practice","skills"].includes(w.tab)?w.tab:(wizardCategory||"attr");
 wizardMode=w.mode==="list"?"list":"genetic";
 wizardShopCategory=EQUIPMENT_FAMILIES.some(([id])=>id===w.shopCategory)?w.shopCategory:"all";
 wizardShopWeight=EQUIPMENT_WEIGHT_OPTIONS.some(([id])=>id===w.shopWeight)?w.shopWeight:"all";
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
 let migrated=false,legacyAvailable=false,retiredSkillMigrated=false,racialGrantMigrated=false,racialElementMigrated=false;
 const playerPayload=loadPlayerSheets();
 try{
  const saved=localStorage.getItem(SAVE_KEY);
  const oldRaw=localStorage.getItem(OLD_SAVE_KEY);
  legacyAvailable=!!oldRaw;
  if(playerPayload){
   const raw=playerPayload.character;
   racialGrantMigrated=raw.race==="lucker_puro"&&Array.isArray(raw.racialInitialAttributes)&&raw.racialInitialAttributes.includes("influencia");
   racialElementMigrated=raw.race==="lucker_puro"&&["sangue","trevas","veneno"].includes(raw.pureElement);
   retiredSkillMigrated=Array.isArray(raw.skills)&&raw.skills.some(id=>RETIRED_PROTOTYPES.has(id));
   state=normalize(raw);
  }else if(saved){
   const raw=JSON.parse(saved);
   racialGrantMigrated=raw.race==="lucker_puro"&&Array.isArray(raw.racialInitialAttributes)&&raw.racialInitialAttributes.includes("influencia");
   racialElementMigrated=raw.race==="lucker_puro"&&["sangue","trevas","veneno"].includes(raw.pureElement);
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
 try{
  const savedTheme=localStorage.getItem(THEME_KEY)||localStorage.getItem("codex-html-ficha-tema-v1");
  if(savedTheme==="light"||savedTheme==="dark")document.documentElement.dataset.theme=savedTheme;
 }catch(e){}
 const themeButton=$("theme-toggle");
 if(themeButton){themeButton.textContent=document.documentElement.dataset.theme==="light"?"☀ Claro":"☾ Escuro";themeButton.setAttribute("aria-pressed",String(document.documentElement.dataset.theme==="light"));}
 syncFields();render();
 if(!NPC_MODE&&!playerPayload){
  const id=playerSheetId();playerSheets=[playerSheetMeta(state,id)];activePlayerSheetId=id;
  if(!save())toast("Exporte sua ficha: armazenamento local indisponível.");
 }
 notifyNpcPreview();
 renderPlayerSheets();
 $("import-old-creator").hidden=!legacyAvailable;
 if(migrated||retiredSkillMigrated||racialGrantMigrated||racialElementMigrated){
  // Persistir mudanças somente quando a ficha realmente precisou ser corrigida,
  // evitando repetir remoção/aviso sem necessidade. XP é recontado nas compras.
  save();
  toast(racialElementMigrated?"Lucker Puro: Sangue, Trevas e Veneno não são mais elementos iniciais gratuitos. Escolha Fogo, Água, Ar, Terra ou Sagrado; Perícias compradas foram preservadas.":racialGrantMigrated?"Lucker Puro corrigido: Inteligência + Destreza G1 gratuitos; Influência manual preservada.":migrated?"Ficha do antigo criador migrada. Dados originais preservados; confira as anotações.":
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
 // Guardar o segundo elemento histórico como dado legado, sem continuá-lo como Perícia gratuita.
 if(s.runeElements[0]===s.runeElements[1]&&s.runeElements[0])s.runeElements[1]="";
 s.perseverancaUsed=!!v.perseverancaUsed;
 s.runeShieldFreeUsed=!!v.runeShieldFreeUsed;
 for(const id of ["name","concept","origin","virtue","personality","notes"]){
  if(typeof v[id]==="string")s[id]=v[id].slice(0,id==="notes"?5000:100);
 }
 // Preservar escolha antiga da origem sem converter em Perícia paga ou retirar skills compradas.
 if(s.race==="lucker_puro"&&["sangue","trevas","veneno"].includes(v.pureElement)&&
    !s.notes.includes("Elemento de origem Lucker Puro (legado):")){
  const legacyName=({sangue:"Sangue",trevas:"Trevas",veneno:"Veneno"})[v.pureElement];
  s.notes=(s.notes+"\nElemento de origem Lucker Puro (legado): "+legacyName+
   " deixou de ser gratuito. Escolha de origem desativada, sem aquisição de Perícia nem cobrança de XP. Perícias compradas com XP permanecem na ficha.").trim().slice(0,5000);
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
 // v0.87: "arma-certa" era uma duplicata de Manejo Perfeito. Migrar o ID legado
 // antes de filtrar SKILLS, deduplicando compras sem cobrar XP duas vezes.
 const rawSkills=Array.isArray(v.skills)?[...new Set(v.skills.filter(x=>typeof x==="string").map(x=>x==="arma-certa"?"manejo-perfeito":x))]:[];
 const legacyCost=(rawSkills.includes("aprendiz")?2:0)+(rawSkills.includes("magia")?1:0);
 const qualifiesForFocus=(s.practices.armas_conjuracao||0)>=1&&(s.attributes.inteligencia||0)>=1&&(s.practices.artesao||0)>=1;
 const shouldMigrateFocus=legacyCost>0&&qualifiesForFocus&&!rawSkills.includes("criar-item-foco-magia");
 const legacyDifference=legacyCost-(shouldMigrateFocus?1:0);
 const removed=[...RETIRED_PROTOTYPES].filter(id=>rawSkills.includes(id));
 s.skills=[...new Set(rawSkills.filter(x=>!RETIRED_PROTOTYPES.has(x)&&SKILLS.some(y=>y[0]===x&&Number.isInteger(y[3]))&&!(x==="transfusao-sanguinaria"&&s.race!=="lucker_sangue")))];
 if(s.race!=="lucker_sangue"&&rawSkills.includes("transfusao-sanguinaria")&&!s.notes.includes("Restrição racial de Transfusão Sanguinária:")){
  s.notes=(s.notes+"\nRestrição racial de Transfusão Sanguinária: compra histórica inválida nesta origem; Perícia retirada da ficha, XP investido liberado para redistribuição.").trim().slice(0,5000);
 }
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
 s.smallCompanion={
  present:!!v.smallCompanion?.present&&s.skills.includes("domar-criatura-pequena"),
  name:String(v.smallCompanion?.name||"").slice(0,70),
  species:v.smallCompanion?.species==="serpente"?"serpente":"outro"
 };
 s.weaponFocus=["leve","medio","pesado","distancia","Punhos"].includes(v.weaponFocus)?v.weaponFocus:"leve";
 s.xpEarned=clamp(Math.floor(v.xpEarned??v.xp??0),0,1000000);
 s.legacyXPRefund=clamp(Math.floor(v.legacyXPRefund||0),0,1000000);
 s.creationLocked=!!v.creationLocked||s.level>1;
 // Snapshot da criação: preservar a distribuição anterior ao substituir as Perícias antigas.
 if(s.creationLocked){
  const used=rawCreationCosts(s),saved=v.creationBudgetSnapshot;
  const formerSkillsCost=used.skills+legacyDifference;
  // Legado: preservar snapshots de fichas que usavam até 18/20 XP; o orçamento NOVO continua em 15.
  s.creationBudgetSnapshot=saved&&["attr","training","skills"].every(k=>Number.isSafeInteger(saved[k])&&saved[k]>=0&&saved[k]<=20)&&
   (saved.attr+saved.training+saved.skills)<=20?
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
  s.courage=clamp(Math.floor(v.courage??10),0,maxCourage(s));
  s.courageRoundSpent=clamp(Math.floor(v.courageRoundSpent??0),0,5);
 s.spiritualSpheres={
  count:clamp(Math.floor(v.spiritualSpheres?.count||0),0,5),
  // Migra fichas antigas: true equivalia a uma criação na rodada.
  createdThisRound:clamp(Math.floor(typeof v.spiritualSpheres?.createdThisRound==="boolean"?(v.spiritualSpheres.createdThisRound?1:0):Number(v.spiritualSpheres?.createdThisRound)||0),0,5)
 };
 s.xp=clamp(Math.floor(v.xp),0,1e9);
 // Migração idempotente (playtest 22/11): G1 3/7/12/17 → 2/5/8/12.
 // Conserva o dano já sofrido, inclusive após alterações históricas 10/15/20.
 s.items=Array.isArray(v.items)?v.items.slice(0,150).map(raw=>{
  const item=normalizeItem(raw);
  if(item.type!=="armadura"||item.grade!==1)return item;
  const updates={
   "Roupas Simples":{0:2,3:2},
   "Armadura Leve":{7:5,10:5},
   "Armadura Média":{12:8,15:8},
   "Armadura Pesada":{17:12,20:12}
  };
  const map=updates[item.catalogId||item.name],nextMax=map?.[item.max];
  if(nextMax!==undefined){
   const loss=Math.max(0,item.max-item.hp),newMax=nextMax;
   item.max=newMax;item.hp=Math.max(0,newMax-loss);
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
 // SRD v0.73: unificar sangue inimigo. Importações antigas mantêm as duas parcelas existentes
 // SOMENTE no primeiro carregamento; fichas gravadas na versão atual têm extracted=0.
 const priorSpilled=clamp(Math.floor(v.hemomancy?.spilled??0),0,1998);
 const priorExtracted=clamp(Math.floor(v.hemomancy?.extracted??0),0,999);
 s.hemomancy={
  spilled:clamp(priorSpilled+priorExtracted,0,1998),
  extracted:0, // campo legado zerado para não haver segunda reserva ativa
  selfBleeding:!!v.hemomancy?.selfBleeding,
  usedThisTurn:!!v.hemomancy?.usedThisTurn,
  boostKind:["magic","direct-life","keep","step"].includes(v.hemomancy?.boostKind)?v.hemomancy.boostKind:"",
  boostPayment:["life","blood"].includes(v.hemomancy?.boostPayment)?v.hemomancy.boostPayment:"",
  directLifeResolved:!!v.hemomancy?.directLifeResolved
 };
 if(v.pending&&Array.isArray(v.pending.dice)&&Array.isArray(v.pending.selected)&&v.pending.dice.length<=9){
  s.pending={...v.pending,selected:v.pending.selected.filter(x=>typeof x==="string")};
  delete s.pending.payment; delete s.pending.firePayment; delete s.pending.ppCost; delete s.pending.fireSummon;
 }
 return s;
}
function normalizeItem(it={}){
 const type=["arma","armadura","escudo","foco","ferramenta","outro"].includes(it.type)?it.type:"outro";
 const grade=clamp(Math.floor(it.grade??1),1,4),qty=clamp(Math.floor(it.qty??1),1,99);
 const weight=Object.hasOwn(WEIGHTS,it.weight)?it.weight:"leve";
 const max=clamp(Math.floor(it.max??0),0,999);
 // v0.77: armadura pesada não é escudo pesado; Cravar fica preso ao escudo físico.
 const embed=type==="escudo"&&["medio","pesado"].includes(it.embeddedWeapon)&&
  (!["alto","extremo"].includes(weight)||it.embeddedWeapon==="pesado")?it.embeddedWeapon:"";
 return {id:String(it.id||getId()).slice(0,80),name:String(it.name||"Item sem nome").slice(0,90),
  type,weight,grade,qty,max,hp:clamp(Math.floor(it.hp??max),0,max),equipped:!!it.equipped&&!it.shieldGrounded,
  shieldGrounded:type==="escudo"&&!!it.shieldGrounded,
  shieldFallCase:type==="escudo"&&["caminho","perto-alvo"].includes(it.shieldFallCase)?it.shieldFallCase:"",
  shieldFallMeters:type==="escudo"?clamp(Math.floor(Number(it.shieldFallMeters)||0),0,1000):0,
  embeddedWeapon:embed,
  shieldMasteryBonusSpent:type==="escudo"&&!!it.shieldMasteryBonusSpent,
  elementalResistance:String(it.elementalResistance||"").slice(0,70),
  secondResistance:String(it.secondResistance||"").slice(0,70),specificImmunity:String(it.specificImmunity||"").slice(0,70),
  g4ElementalMode:it.g4ElementalMode==="immunity"?"immunity":"resistances",
  catalogId:String(it.catalogId||"").slice(0,90),category:String(it.category||"").slice(0,20),
  die:[6,10,12].includes(Number(it.die))?Number(it.die):0,range:clamp(Math.floor(it.range||0),0,1000),
  priceVT:clamp(Math.floor(it.priceVT||0),0,10000),
  properties:Array.isArray(it.properties)?it.properties.filter(x=>typeof x==="string").slice(0,6):[],
  firearm:!!it.firearm,element:String(it.element||"").slice(0,40),
  focusCharges:type==="foco"?clamp(Math.floor(it.focusCharges??grade),0,grade):0,
  durability:clamp(Math.floor(it.durability||0),0,999),durabilityMax:clamp(Math.floor(it.durabilityMax||0),0,999),
  packSize:clamp(Math.floor(it.packSize||0),0,99),ammoRemaining:clamp(Math.floor(it.ammoRemaining??it.packSize??0),0,99),
  storageCapacity:clamp(Math.floor(it.storageCapacity||0),0,99),description:String(it.description||"").slice(0,330)}; // Lotes/consumo manuais.
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
  notifyNpcPreview();
  return true;
 }catch(e){
  $("save-indicator").textContent="Não foi possível salvar; exporte a ficha.";
  console.warn("Codex: falha ao persistir ficha",e);
  return false;
 }
}
function notifyNpcPreview(){
 if(!EMBED_NPC||window.parent===window)return;
 try{
  const invested=xpCosts(),available=Number(invested.free)||0;
  const ready=!!state.name.trim()&&hasStarterSources(state)&&available>=0&&!state.pending&&
   !dependentsValid(state)&&raceChoicesComplete(state);
  window.parent.postMessage({
   type:"codex-rpg:npc-resumo-v1",name:state.name.trim().slice(0,70)||"Sem nome",
   race:RACES[state.race]?.[0]||"Humano",xpRemaining:available,
   hasStarter:hasStarterSources(state),skills:allOwnedSkills(state).length,
   items:state.items.length,ready
  },window.location.origin);
 }catch(e){console.warn("Codex: prévia NPC não pôde ser enviada",e);}
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
function companionLifeBonus(s=state){return Number(!!(s.smallCompanion?.present&&s.skills?.includes("domar-criatura-pequena")));}
function lifeBands(s=state){
 const vigor=Math.max(0,Math.floor(s.attributes.vigor||0));
 const forca=Math.max(0,Math.floor(s.attributes.forca||0));
 const extras=vigor+Math.floor(forca/2);
 // Exibir o bônus no segmento superior apenas como convenção técnica de interface.
 // Alocação normativa do +1 nas quatro faixas continua PENDENTE.
 return [1+Math.ceil(extras/2)+companionLifeBonus(s),1+Math.floor(extras/2),1,1];
}
function maxLife(s=state){return lifeBands(s).reduce((n,k)=>n+k,0);}
function lifeStage(s=state){
 const bands=lifeBands(s),life=clamp(s.life,0,maxLife(s));
 const id=life===0?"morto":life===1?"inconsciente":life===2?"incapacitado":life<=2+bands[1]?"ferido":"saudavel";
 return {...LIFE_STATES[id],bands,life};
}
function maxCourage(s=state){
 const level=Number(s.level)||1;
 // Bônus especializados de Maestria não foram implementados; teto absoluto 15.
 return Math.min(15,10+Number(level>=5)+Number(level>=10)+Number(level>=20));
}
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
 if(id==="transfusao-sanguinaria"&&s.race!=="lucker_sangue")return"Transfusão Sanguinária é exclusiva de Lucker de Sangue; outras linhagens não podem comprar nem usar.";
 if(id==="maestria-armas-fogo"&&s.race!=="humano")return"Maestria em Armas de Fogo é exclusiva dos Humanos, concedida gratuitamente pela origem.";
 if(id!=="maestria-armas-fogo"&&WEAPON_MASTERY_TYPES.some(x=>x.id===id)&&!APPROVED_WEAPON_MASTERY_PURCHASE[id])return"Custo de XP e requisitos de aquisição desta Maestria ainda PENDENTES; consultar os efeitos e aguardar aprovação.";
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
 if(id==="furtividade-avancada"&&(stealth<2||!has("furtividade")))return"Requer Furtividade 2 e Perícia em Furtividade.";
  const advancedSource=ADVANCED_SOURCE_DEFS.find(row=>row.id===id);
  if(advancedSource&&(s[SOURCE_PROPS[advancedSource.group]][advancedSource.key]||0)<2)
   return"Requer "+advancedSource.label+" 2.";
 if(id==="maestria-martelos"&&(strength<3||dex<1||vig<1))return"Requer Força 3, Destreza 1 e Vigor 1 para comprar. A Perícia de Armas conforme peso do martelo será exigida somente ao ativar o efeito.";
  if(id==="maestria-hastes"&&(strength<2||agi<1||dex<1))return"Requer Força 2, Agilidade 1 e Destreza 1. Perícia em Armas do peso exigida somente para ativar a Maestria.";
  if(id==="maestria-espadas"&&(strength<2||dex<2))return"Requer Força 2 e Destreza 2. Perícia em Armas do peso exigida somente para ativar a Maestria.";
 if(id==="ferreiro"&&(art<1||strength<1||dex<1||intelligence<1||!has("artesao-avancado")))return"Requer Artesão 1, Força 1, Destreza 1, Inteligência 1 e Artesão Avançado (que exige Artesão 2).";
 if(id==="ferreiro-elemental"&&(!has("ferreiro")||intelligence<2||dex<2||!has("improviso")||!has("criar-item-foco-magia")))return"Requer Ferreiro, Inteligência 2, Destreza 2, Improviso Elemental e Criar Item de Foco e Magia.";
 if(id==="ferreiro-elemental"&&!has("encantar-com-elemento"))return"Requer comprar Encantar com Elemento antes de Ferreiro Elemental.";
 if(id==="resistencia-a-fogo"&&(!has("ferreiro-elemental")||!has("fogo")||vig<2))return"Requer Ferreiro Elemental, Perícia em Elemento Fogo e Vigor 2."; 
 if(id==="encantar-com-elemento"&&(!has("criar-item-foco-magia")||!["vento","agua","terra","fogo","sagrado","sangue","trevas","veneno"].some(has)))return"Requer Criar Item de Foco e Magia e pelo menos uma Perícia Elemental adquirida (Ar, Água, Terra, Fogo, Sagrado, Sangue, Trevas ou Veneno).";
 if(id==="criar-veneno"&&(art<1||intelligence<2||alch<2||med<2))return"Requer Artesão 1, Inteligência 2, Alquimia 2 e Medicina 2.";
 // IDs antigos das Perícias renomeadas preservados para compatibilidade de fichas salvas.
 if(id==="armas-leves"&&disc<1)return"Requer Disciplina 1.";
 if(id==="armas-medias"&&(disc<1||strength<1))return"Requer Disciplina 1 e Força 1.";
 if(id==="armas-pesadas"&&(disc<2||strength<2))return"Requer Disciplina 2 e Força 2.";
 if(id==="disciplina-avancada"&&disc<2)return"Requer Disciplina 2.";
 if(id==="concentracao-refinada"&&disc<2)return"Requer Disciplina 2.";
 if(id==="criar-item-foco-magia"&&(disc<1||(s.attributes.inteligencia||0)<1||art<1))return"Requer Disciplina 1, Inteligência 1 e Artesão 1.";
 if(["vento","agua","terra","fogo"].includes(id)&&(disc<1||(s.attributes.inteligencia||0)<1))return"Requer Disciplina 1 e Inteligência 1. Criar Foco é opcional.";
 if(id==="sagrado"&&(disc<2||(s.attributes.inteligencia||0)<2))return"Requer Disciplina 2 e Inteligência 2. Criar Foco é opcional.";
 if(id==="escudo-arcano"&&((s.attributes.inteligencia||0)<2||vig<1||!has("criar-item-foco-magia")))return"Requer Inteligência 2, Vigor 1 e Criar Item de Foco e Magia.";
 if(id==="conjuracao-equilibrada"&&(disc<2||(s.attributes.inteligencia||0)<2||dex<2||!has("criar-item-foco-magia")))return"Requer Disciplina 2, Criar Item de Foco e Magia, Inteligência 2 e Destreza 2.";
 if(id==="golpe-fulminante"&&(disc<2||strength<2||!meleeSpecialty))return"Requer Disciplina 2, Força 2 e especialização corpo a corpo (Armas Leves/Médias/Pesadas, Manejo Duplo ou Pugilismo). Perícia em Arremesso não habilita este golpe.";
 if(id==="espalhar-golpe"&&(disc<2||dex<1||agi<1||!has("golpe-fulminante")||!meleeSpecialty))return"Requer Disciplina 2, Destreza 1, Agilidade 1, Golpe Fulminante e especialização corpo a corpo.";
 if(id==="pugilismo"&&(disc<1||strength<2||dex<1))return"Requer Disciplina 1, Força 2 e Destreza 1.";
 if(id==="artista-marcial"&&(disc<2||dex<2||!has("pugilismo")))return"Requer Disciplina 2, Destreza 2 e Pugilismo.";
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
 if(id==="manejo-perfeito"&&(!has("disciplina-avancada")||dex<2))return"Requer Disciplina Avançada adquirida e Destreza 2.";
 if(id==="maestria-manejo-duplo"&&(strength<2||dex<2||agi<1||!has("disciplina-avancada")||!["armas-leves","armas-medias","armas-pesadas","maestria-arremesso-armas","armas-fogo","armas-longo-alcance"].some(has)))return"Requer Força 2, Destreza 2, Agilidade 1, Disciplina Avançada e especialização de armas.";
 
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
 $("xp-feedback").textContent=x.free<0?"Saldo excedido no orçamento do playtest de "+CREATE_BUDGET.total+" XP. Investimentos anteriores foram preservados: revise as compras antes de continuar.":
 CREATE_BUDGET.total+" XP iniciais compartilhados; teto de playtest: "+XP_LEVEL_REFERENCE[20]+" XP totais no nível 20 ("+MAX_EARNED_XP+" XP de evolução). "+x.total+" investidos, "+x.free+" disponíveis. "+
  ((state.xpEarned||0)>MAX_EARNED_XP?"Ficha legada acima do teto: XP preservado, novas concessões bloqueadas. ":"")+
  (editMode?"Edição: correções dependem do Narrador.":"Os requisitos individuais permanecem válidos.");
 $("char-level").value=state.level;
}
function deNatural(s=state){
 const a=s.attributes||{},p=s.practices||{};
 return Math.min(9,(a.agilidade||0)+Math.floor(((a.vigor||0)+(a.destreza||0))/2)+Math.floor((p.atletismo||0)/3));
}
function canEquipArmor(s=state,it=null){
 if(!it||it.type!=="armadura")return true;
 if(s.race==="runa_espinhos")return false; // Runa Espinhos: armadura física proibida.
 const minLevel=it.grade===4?20:it.grade===3?10:it.grade===2?5:1;
 if(s.level<minLevel)return false;
 if(it.weight==="extremo"&&((s.attributes.vigor||0)<6||(s.practices.atletismo||0)<6))return false;
 return true;
}
// Bônus de Maestria em Escudos: apenas uma peça física equipada recebe os bônus.
function masteredShield(s=state){
 return ownsSkill("maestria-escudos",s)?(s.items||[]).find(it=>it.type==="escudo"&&it.equipped)||null:null;
}
function shieldMasteryActive(item,s=state){
 const shield=masteredShield(s);
 return !!(shield&&item?.type==="escudo"&&shield.id===item.id);
}
function shieldIntegrityDisplay(item,s=state){
 const active=shieldMasteryActive(item,s),bonus=active?1:0;
 return {hp:(item?.hp||0)+(active&&!item.shieldMasteryBonusSpent?1:0),max:(item?.max||0)+bonus,bonus,active};
}
// O ponto extra não modifica a Integridade-base e não renasce ao reequipar.
function changeShieldIntegrity(item,delta,s=state){
 if(!item||item.type!=="escudo"||![-1,1].includes(Number(delta)))return;
 const active=shieldMasteryActive(item,s);
 if(delta<0){
  if(active&&!item.shieldMasteryBonusSpent){item.shieldMasteryBonusSpent=true;return;}
  item.hp=Math.max(0,item.hp-1);
 }else if(item.hp<item.max)item.hp=Math.min(item.max,item.hp+1);
 else if(active&&item.shieldMasteryBonusSpent)item.shieldMasteryBonusSpent=false;
}
function loseShieldIntegrity(item,amount,s=state){
 const loss=Math.min(shieldIntegrityDisplay(item,s).hp,Math.max(0,Math.floor(amount)||0));
 if(!loss)return 0;
 let rest=loss;
 if(shieldMasteryActive(item,s)&&!item.shieldMasteryBonusSpent){
  item.shieldMasteryBonusSpent=true;rest--;
 }
 item.hp=Math.max(0,item.hp-rest);
 return loss;
}
function shieldBoomerangReady(item,s=state){
 return !!(item?.type==="escudo"&&item.equipped&&!item.shieldGrounded&&
  ownsSkill("escudo-bumerangue",s)&&ownsSkill("maestria-escudos",s)&&
  ownsSkill("maestria-arremesso-armas",s)&&
  (s.attributes?.destreza||0)>=2&&(s.attributes?.forca||0)>=3);
}
// Resultado da rolagem de Escudo Bumerangue: mesma queda de Arremesso de Armas.
// E/P são contados dos dados mantidos; 2A convertido vale 1E na distância.
function shieldBoomerangResult(success,pavor,keptE,keptP,convertedE){
 if(success)return {returned:true,grounded:false,where:"portador",distance:null};
 return {returned:false,grounded:true,where:pavor>0?"perto-alvo":"caminho",
  distance:Math.max(0,Math.floor(keptE)+Math.floor(keptP)+Math.floor(convertedE))};
}
function prepareShieldBoomerang(id){
 if(state.pending){toast("Finalize a rolagem pendente antes de arremessar um escudo.");return;}
 if(editMode){toast("Conclua a edição da ficha antes de lançar o escudo.");return;}
 const shield=state.items.find(it=>it.id===id);
 if(!shieldBoomerangReady(shield)){toast("Escudo Bumerangue exige escudo físico equipado, Destreza 2, Força 3, Maestria em Escudos e Arremesso de Armas.");return;}
 if((state.practices.armas_conjuracao||0)<1){toast("O ataque exige Disciplina treinada para rolar os dados.");return;}
 const attribute=preferredQuickAttribute({type:"escudo"});
 if(!attribute){toast("O ataque requer ao menos um Atributo treinado.");return;}
 draft=freshDraft();
 draft.base={group:"practice",key:"armas_conjuracao"};
 draft.attribute={group:"attr",key:attribute};
 draft.mode="armas";draft.shieldThrowId=id;draft.shieldThrowMeters=8;
 draft.equipmentId="";draft.shieldRaise=false;
 sheetPage="play";render();save();
 $("composer-content")?.scrollIntoView?.({behavior:"smooth",block:"start"});
 toast("Escudo Bumerangue: 1 Coragem para arremessar; no acerto, dano físico normal e características da peça. Até 8 m, retorno no acerto e queda na falha.");
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
// Teto da DE base: 9. Teto absoluto após modificadores: 12.
function deDefense(s=state){
 return Math.min(12,Math.max(0,deNatural(s)+armorDodgeBonus(s)-armorDePenalty(s)+(masteredShield(s)?1:0)));
}
function deDodge(s=state){return deDefense(s);} // Esquiva não recebe um segundo bônus.
function defensePresentation(s=state){
 const natural=deNatural(s),total=deDefense(s),bonus=armorDodgeBonus(s),penalty=armorDePenalty(s);
 const armor=equippedArmor(s);
 const type=armor?({muito_leve:"Muito Leve",leve:"Leve",medio:"Média",alto:"Pesada",extremo:"Muito Pesada"}[armor.weight]||armor.name):null;
 const modifier=bonus-penalty,shieldBonus=masteredShield(s)?1:0;
 const baseCaption=armor?
  "DE base "+natural+" "+(modifier>=0?"+ ":"− ")+Math.abs(modifier)+" (armadura "+type+")":
  "DE base "+natural;
 return {label:"DE DEFENSIVA",value:total,caption:baseCaption+(shieldBonus?" + 1 (Maestria em Escudos)":"")+" = "+total+" · Todas as defesas · Teto base 9 / final 12"};
}
function capacity(){return 1+Math.floor(((state.attributes.forca||0)+(state.attributes.vigor||0)+(state.practices.atletismo||0))/3);}
function itemLoad(it){
 if(it.type==="escudo"&&it.shieldGrounded)return 0; // Escudo caído não ocupa a carga do personagem.
 const regular=WEIGHTS[it.weight][1]*it.qty*((it.properties||[]).includes("Muito Leve")?0.5:1);
 // A arma presa soma peso real categórico enquanto o escudo permanecer carregado
 // (mesmo se abaixado). O item é retirado do inventário ao abandonar o escudo.
 const embedded=it.type==="escudo"&&it.embeddedWeapon?
  WEIGHTS[it.embeddedWeapon==="pesado"?"alto":"medio"][1]:0;
 return regular+embedded;
}
function loadUsed(){return state.items.reduce((n,it)=>n+itemLoad(it),0)+resourceWeight(); /* Recursos de troca também ocupam Carga. */}
function loadPercent(){return 100*loadUsed()/Math.max(1,capacity());}
function balanceForPercent(p){return p<25?"Muito Leve":p<50?"Leve":p<75?"Médio":p<100?"Pesado":"Muito Pesado";}
function balance(){return NPC_MODE?"Pendente":balanceForPercent(loadPercent());}
// A prévia subtrai o peso dos recursos de troca realmente gastos na compra.
function purchaseLoadPreview(entry,price){
 const current=loadUsed(),added=itemLoad(normalizedCatalogItem(entry));
 const paid=Math.min(Math.max(0,Number(price)||0),walletValue());
 const released=paid/10*WEIGHTS.leve[1];
 const after=Math.max(0,current+added-released),max=capacity(),percent=100*after/max;
 return {current,added,released,after,max,percent,balance:balanceForPercent(percent),
  status:percent>=100?"over":percent>=75?"heavy":"normal"};
}
function purchaseLoadMarkup(preview){
 const warning=preview.status==="over"?"Atenção: ficará Muito Pesado (sobrepeso). A compra não é bloqueada.":
  preview.status==="heavy"?"Atenção: ficará Pesado, com pouca margem para transportar outros itens.":
  "A compra permanece abaixo do patamar Pesado.";
 return '<div class="fp-purchase-load fp-purchase-load-'+preview.status+'"><strong>Carga após compra: '+
  pad(preview.after)+' / '+preview.max+' Alto ('+pad(preview.percent)+'%) · '+preview.balance+'</strong>'+
  '<small>Agora: '+pad(preview.current)+' · Item: +'+pad(preview.added)+' · Recursos gastos: −'+pad(preview.released)+' Alto</small>'+
  '<span>'+warning+'</span></div>';
}
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
  ["Atletismo",state.practices.atletismo||0,0]
 ];
 return sources.map(([name,grade,base])=>({name,grade,gain:grade===null?base:grade}));
}
function cargoCapacitySourcesMarkup(){
 return cargoCapacitySources().map(src=>
  '<div class="fp-capacity-source"><small>'+esc(src.name)+(src.grade===null?'':' G'+src.grade)+'</small><strong>'+(src.grade===null?'+1 Alto':src.gain+' graus')+'</strong></div>'
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
function temporaryGradeDice(group,grade,raise=false){
 return dataDice(group,Math.min(6,Math.max(0,(Number(grade)||0)+(raise?1:0))));
}
function describeDicePool(dice){
 const packs=[];
 for(const sides of dice){
  const prev=packs.at(-1);
  if(prev&&prev.sides===sides)prev.count++;
  else packs.push({sides,count:1});
 }
 return packs.map(x=>x.count+"d"+x.sides).join(" + ");
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
 const pure=state.race==="lucker_puro"?'<label class="fp-wiz-field">Elemento inicial gratuito (Fogo, Água, Ar, Terra ou Sagrado)<select data-race-element="pure">'+raceOptions(PURE_ELEMENTS,state.pureElement)+'</select></label>':'';
 const rune=state.race==="runa_espinhos"?'<label class="fp-wiz-field">Elemento inicial (1 gratuito)<select data-race-element="rune-0">'+raceOptions(RUNE_ELEMENTS,state.runeElements[0])+'</select></label>':'';
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
 candidate.race=id;candidate.pureElement="";candidate.runeElements=["",""];candidate.runeShieldFreeUsed=false;
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
 for(const item of state.items)if(item.type==="armadura"&&item.equipped&&!canEquipArmor(state,item))item.equipped=false;
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
 if(state.pending)return;
 // Ficha concluída cuja escolha antiga foi revogada pode escolher uma vez,
 // sem refazer a criação nem permitir trocar benefícios já válidos livremente.
 const initialRepair=state.creationLocked&&key==="pure"&&state.race==="lucker_puro"&&
  !state.pureElement&&PURE_ELEMENTS.some(([id])=>id===value);
 if(state.creationLocked&&!initialRepair)return;
 const oldPure=state.pureElement,oldRune=[...state.runeElements];
 if(key==="pure"&&state.race==="lucker_puro"&&(value===""||PURE_ELEMENTS.some(([id])=>id===value)))state.pureElement=value;
 else if(key==="rune-0"&&state.race==="runa_espinhos"&&(value===""||RUNE_ELEMENTS.some(([id])=>id===value)))state.runeElements[0]=value;
 else return;
 const duplicated=state.skills.some(id=>racialGrants(state).includes(id));
 if(duplicated||dependentsValid(state)){
  state.pureElement=oldPure;state.runeElements=oldRune;toast("Elementos devem ser diferentes e não podem duplicar compras.");render();return;
 }
 render();save();
}
function renderRacePanel(){
 const select=$("char-race"),info=$("race-description"),panel=$("race-benefit-panel"),c=RACES[state.race]||RACES.humano;
 if(select)select.value=state.race;
 if(info)info.textContent=c[1]+" "+c[2]+" "+raceCaution();
 if(!panel)return;
 const names=racialGrants(state).map(id=>id==="escudo-arcano"&&state.race==="runa_espinhos"?"Escudo Rúnico":SKILLS.find(row=>row[0]===id)?.[1]||id);
 panel.innerHTML='<strong>'+c[0]+'</strong><p>'+c[1]+'</p>'+(names.length?'<p>Perícias raciais gratuitas: '+esc(names.join(", "))+'.</p>':'')+
 (raceCaution()?'<p>XP PENDENTE: '+esc(raceCaution())+'</p>':'')+
 (state.race==="lucker_puro"&&!state.pureElement&&state.creationLocked?
  '<label class="fp-wiz-field">Atualizar elemento de origem (uma única escolha gratuita)<select data-race-element="pure"'+(state.pending?' disabled':'')+'>'+raceOptions(PURE_ELEMENTS,state.pureElement)+'</select></label><p><small>O elemento anterior foi preservado nas notas; não há cobrança de XP nem alteração das Perícias compradas.</small></p>':'')+
 (state.race==="runa_espinhos"?'<p><strong>Escudo Rúnico:</strong> Escudo Arcano racial; resistência elemental padrão (0,5 dano por E e 0 dano por P do elemento escolhido) e conversão defensiva de 2P em 1E (somente na barreira). <strong>'+(state.runeShieldFreeUsed?'Uso diário gasto':'1 uso gratuito disponível hoje')+'</strong>. Outras ativações custam 1 Coragem. Não pode equipar armaduras físicas.</p>'+
 '<button type="button" data-action="rune-shield-use"'+(state.runeShieldFreeUsed||!!state.pending?' disabled':'')+'>Marcar ativação gratuita</button> '+
 '<button type="button" data-action="rune-shield-reset"'+(!state.runeShieldFreeUsed||!!state.pending?' disabled':'')+'>Restaurar uso diário</button>'+
 (state.runeElements?.[1]?'<p><small>Ficha legada: o segundo elemento '+esc(RUNE_ELEMENTS.find(([id])=>id===state.runeElements[1])?.[1]||state.runeElements[1])+' foi preservado apenas como dado histórico; não é mais gratuito e pode ser comprado separadamente.</small></p>':''):'')+
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

/* Conjuração livre: efeitos/tempo definidos no Livro; efeitos de amplificação não recebem números inventados. */
function magicElementId(value){
 const raw=String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();
 return ({ar:"vento",vento:"vento",psique:"psiquico",psiquico:"psiquico",agua:"agua",fogo:"fogo",terra:"terra",sagrado:"sagrado",sangue:"sangue",trevas:"trevas",veneno:"veneno"})[raw]||"";
}
function magicKnownElements(){
 return [...(ownsSkill("criar-item-foco-magia")?[["psiquico","Psíquico"]]:[]),
  ...ELEMENT_SKILLS.filter(([id])=>ownsSkill(id))];
}
function magicCompatibleFoci(element){
 return state.items.filter(item=>item.type==="foco"&&
  magicElementId(item.element||"psiquico")===element);
}
function magicSelectedFocus(plan=draft){
 return magicCompatibleFoci(plan.magicElement).find(item=>item.id===plan.magicFocusId)||null;
}
function magicSelectedSecondFocus(plan=draft){
 return magicCompatibleFoci(plan.magicSecondElement).find(item=>item.id===plan.magicSecondFocusId)||null;
}
function magicPreparationTurns(grade,charges,hasFocus=false,hasSecondFocus=false){
 if(grade===1)return 1;
 if(grade===2)return hasFocus&&charges>=1?1:2;
 if(grade===3)return Math.max(1,3-(hasFocus?Math.min(2,charges):0));
 if(grade===4)return Math.max(3,6-(hasFocus&&hasSecondFocus?Math.min(3,charges):0));
 return 1;
}
function magicCourageCost(plan=draft){
 return (plan.magicGrade===4?2:plan.magicGrade===3?1:0)+(plan.magicAmplify?1:0);
}
function alignMagicDraft(){
 const known=magicKnownElements();
 if(!known.some(([id])=>id===draft.magicElement))draft.magicElement=known[0]?.[0]||"";
 draft.magicGrade=[1,2,3,4].includes(Number(draft.magicGrade))?Number(draft.magicGrade):1;
 if(draft.magicGrade!==4){
  draft.magicSecondElement="";draft.magicSecondFocusId="";
 }else if(!known.some(([id])=>id===draft.magicSecondElement&&id!==draft.magicElement)){
  draft.magicSecondElement="";draft.magicSecondFocusId="";
 }
 const focus=magicSelectedFocus(),second=magicSelectedSecondFocus();
 if(!focus){draft.magicFocusId="";draft.magicAmplify=false;}
 if(!second)draft.magicSecondFocusId="";
 const cap=draft.magicGrade===4?(focus&&second?Math.min(3,focus.focusCharges??0,second.focusCharges??0):0):
  draft.magicGrade===3?(focus?Math.min(2,focus.focusCharges??0):0):
  draft.magicGrade===2?(focus?Math.min(1,focus.focusCharges??0):0):0;
 draft.magicCharges=Math.min(cap,Math.max(0,Math.floor(Number(draft.magicCharges)||0)));
 if(draft.magicGrade===1)draft.magicGradeConfirmed=false;
 if(draft.mode==="conjuracao"&&draft.magicElement)draft.equipmentId="";
}

function prepareMagic(element=""){
 if(state.pending){toast("Finalize a rolagem pendente antes de preparar uma conjuração.");return;}
 if(editMode){toast("Encerre a edição da ficha antes de conjurar.");return;}
 const known=magicKnownElements(),chosen=element||draft.magicElement||known[0]?.[0];
 if(!known.some(([id])=>id===chosen)){toast("Adquira uma Perícia elemental ou Criar Item de Foco e Magia para conjurar Psíquico.");return;}
 const previous=draft,grade=previous.magicGrade,focusId=previous.magicFocusId,secondFocusId=previous.magicSecondFocusId,secondElement=previous.magicSecondElement;
 const charges=previous.magicCharges,amplify=previous.magicAmplify,confirmed=previous.magicGradeConfirmed,timeConfirmed=previous.magicTimeConfirmed;
 const de=Number.isInteger(previous.de)?previous.de:1;
 draft=freshDraft();draft.mode="conjuracao";draft.de=de;
 draft.base={group:"practice",key:"armas_conjuracao"};
 // Inteligência é preenchida só se foi realmente treinada; outras combinações continuam possíveis.
 const attr=(state.attributes.inteligencia||0)>0?"inteligencia":
  A.find(([id])=>(state.attributes[id]||0)>0)?.[0]||"";
 if(attr)draft.attribute={group:"attr",key:attr};
 draft.magicElement=chosen;draft.magicSecondElement=secondElement;draft.magicGrade=grade;
 const compatible=magicCompatibleFoci(chosen);
 draft.magicFocusId=focusId||(previous.mode!=="conjuracao"&&compatible.length===1?compatible[0].id:"");
 draft.magicSecondFocusId=secondFocusId;
 draft.magicCharges=charges;draft.magicAmplify=amplify;draft.magicGradeConfirmed=confirmed;
 draft.magicTimeConfirmed=chosen===previous.magicElement&&!!timeConfirmed;
 alignMagicDraft();sheetPage="play";render();
 $("composer-content")?.scrollIntoView?.({behavior:"smooth",block:"nearest"});
 toast("Conjuração de "+(known.find(([id])=>id===chosen)?.[1]||chosen)+" preparada; defina os gastos e confirme a rolagem.");
}
function renderMagicActions(){
 const root=$("magic-actions"),elementsRoot=$("owned-elements");
 if(!root||!elementsRoot)return;
 const elements=magicKnownElements();
 if(!elements.length){
  root.innerHTML='<span class="fp-owned-empty">Nenhuma magia habilitada</span>';
  elementsRoot.innerHTML="";return;
 }
 const chosen=elements.some(([id])=>id===draft.magicElement)?draft.magicElement:elements[0][0];
 root.innerHTML='<button type="button" class="fp-action-cast" data-action="magic-prepare" title="Preparar Disciplina e configurar Grau, foco e custos no rolador">ᚨ Conjurar magia</button>';
 elementsRoot.innerHTML=elements.map(([id,name])=>
  '<button type="button" class="fp-magic-element'+(chosen===id&&draft.mode==="conjuracao"?" selected":"")+
  '" data-action="magic-element" data-id="'+esc(id)+'" aria-pressed="'+(chosen===id&&draft.mode==="conjuracao"?'true':'false')+'" title="Conjurar '+esc(name)+'">'+
  '<span class="fp-element-icon">'+codexSkillIcon(id)+'</span><span class="fp-element-label">'+esc(name)+'</span></button>').join("");
}
function magicComposerFields(){
 if(draft.mode!=="conjuracao"||!draft.magicElement)return "";
 const chosen=draft.magicElement,grade=[1,2,3,4].includes(Number(draft.magicGrade))?Number(draft.magicGrade):1;
 const foci=magicCompatibleFoci(chosen),focus=magicSelectedFocus(),secondFocus=magicSelectedSecondFocus(),
  charges=grade===4?Math.min(3,focus?.focusCharges??0,secondFocus?.focusCharges??0):grade===3?Math.min(2,focus?.focusCharges??0):grade===2?Math.min(1,focus?.focusCharges??0):0;
 const options=(choices,current)=>choices.map(([value,caption])=>'<option value="'+esc(value)+'"'+(String(value)===String(current)?" selected":"")+'>'+esc(caption)+'</option>').join("");
 const chosenName=magicKnownElements().find(([id])=>id===chosen)?.[1]||chosen;
 const time=magicPreparationTurns(grade,draft.magicCharges,!!focus,!!secondFocus);
 const tacticalHint=chosen==="vento"?
 "Ar: correntes em L/X ou trajetórias curvas usam a soma dos trechos dentro da metragem do Grau (G1 4 m, G2 8 m, G3 16 m); sem alcance extra por curva, atravessar paredes ou efeito automático. DE e demais requisitos normais.":
 chosen==="fogo"&&ownsSkill("veneno")?
 (ownsSkill("mestre")?
 "Ácido: Fogo + Veneno, em acerto com Queimar aplica 1 acúmulo de Veneno por 2 rodadas (sem Sangramento), somente na mistura com Maestria Elemental e habilitações válidas. Misturar custa 1A e a elevação G3 segue a regra comum (+1 Coragem por elemento G3). Sem dano duplicado; registro manual.":
 "Ácido: Fogo + Veneno exige Maestria Elemental para ativar juntos Queimar e Veneno. Improviso Elemental só adapta o tipo de dano, sem transmitir Veneno. A mistura normal custa 1A e respeita Graus; registro manual."):
 "";
 const focusOptions=[["","Sem foco"],...foci.map(item=>[item.id,item.name+" · "+(item.focusCharges??item.grade)+"/"+item.grade+" cargas · sem dado adicional"])];
 return '<div class="fp-magic-composer"><strong class="fp-magic-heading"><span class="fp-element-icon">'+codexSkillIcon(chosen)+'</span><span>Conjurar '+esc(chosenName)+'</span></strong>'+
  '<div class="fp-magic-config">'+
  '<label>Grau da magia<select data-magic-field="magicGrade">'+options([[1,"G1 · +1d6 · imediato"],[2,"G2 · +1d10 · 2 turnos / 1 carga = 1 turno"],[3,"G3 · +1d12 · até 2 cargas"],[4,"G4 · +2d12 · dois elementos G3 · mínimo 3 turnos"]],grade)+'</select></label>'+
  '<label>Foco elemental principal<select data-magic-field="magicFocusId">'+options(focusOptions,focus?.id||"")+'</select></label>'+
  (grade===4?'<label>Segundo elemento G3<select data-magic-field="magicSecondElement">'+options(
    [["","Escolha outro elemento habilitado"],...magicKnownElements().filter(([id])=>id!==chosen)],draft.magicSecondElement)+'</select></label>'+
   '<label>Foco do segundo elemento<select data-magic-field="magicSecondFocusId">'+options(
    [["","Sem foco"],...magicCompatibleFoci(draft.magicSecondElement).map(item=>[item.id,item.name+" · "+(item.focusCharges??item.grade)+" carga(s)"])],
    secondFocus?.id||"")+'</select></label>':"")+
  (grade>=2&&focus&&grade!==4?'<label>Cargas para acelerar<select data-magic-field="magicCharges">'+
   options(Array.from({length:charges+1},(_,n)=>[n,n+" carga(s) · "+magicPreparationTurns(grade,n,true)+" turno(s)"]),Math.min(charges,draft.magicCharges||0))+'</select></label>':"")+
  (grade===4&&focus&&secondFocus?'<label>Pares de cargas (um de cada foco)<select data-magic-field="magicCharges">'+
   options(Array.from({length:charges+1},(_,n)=>[n,n+" par(es) de cargas · "+(6-n)+" turno(s)"]),Math.min(charges,draft.magicCharges||0))+'</select></label>':"")+
  (grade>1?'<label class="fp-magic-check"><input type="checkbox" data-magic-field="magicGradeConfirmed"'+(draft.magicGradeConfirmed?" checked":"")+
   '> Grau e efeito habilitados (confirmado com Narrador)</label>':"")+
  (grade===4?'<p class="fp-magic-note">G4 plena exige dois elementos G3 diferentes, 1A + 2 Coragens e 6 turnos, reduzidos até 3 com pares de cargas: uma de cada foco. Habilitação e efeitos confirmados com Narrador.</p>':"")+
  '<p class="fp-magic-note">Role AGORA, ao declarar. Se houver espera, os dados ficam visíveis enquanto o inimigo pode reagir ao Pavor.</p>'+
  '<label class="fp-magic-check"><input type="checkbox" data-magic-field="magicAmplify"'+(draft.magicAmplify&&focus?" checked":"")+(focus?"":" disabled")+
  '> Amplificar (+1 Coragem, dentro do limite permitido)</label></div>'+
  (tacticalHint?'<p class="fp-magic-note">'+esc(tacticalHint)+'</p>':'')+
  '<small class="fp-magic-note">Dados mágicos: '+(grade===4?'+2d12':'+1d'+({1:6,2:10,3:12}[grade]))+' (pelo Grau, nunca pelo foco) · Preparação: '+time+' turno(s) · Magia: '+magicCourageCost()+
  ' Coragem · '+draft.magicCharges+' carga(s). Intervenções do inimigo conforme Narrador.</small></div>';
}

let inventoryPane="bag";
function syncInventoryPane(){
 const container=$("equipamentos");if(!container)return;
 for(const node of container.querySelectorAll("[data-inventory-pane]"))
  node.hidden=node.dataset.inventoryPane!==inventoryPane;
 for(const button of container.querySelectorAll("button[data-inventory-view]")){
  const active=button.dataset.inventoryView===inventoryPane;
  button.setAttribute("aria-current",active?"page":"false");
  button.classList.toggle("active",active);
 }
 if(inventoryPane==="shop"){
  const market=$("inventory-shop-details");if(market)market.open=true;
 }
}
function chooseInventoryPane(next){
 if(!["bag","wallet","shop"].includes(next))return;
 inventoryPane=next;syncInventoryPane();
}
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
 syncInventoryPane();
 $("page-subtitle").textContent=isGene?"Explore os caminhos presentes e futuros do seu Codex Genético.":isInv?
 "Seus equipamentos, materiais e Valor de Troca num espaço próprio.":isEvolve?
 "XP, fontes e Perícias para construir sua próxima especialização.":"Uma ficha de jogo limpa: recursos, rolagens e somente as habilidades que você adquiriu.";
}
function renderOwnedPanel(){
 // Ações aparecem antes das fontes: botões compactos abrem a especialização ou preparam o teste.
 const learned=SKILLS.filter(([id])=>ownsSkill(id)&&!HIDDEN_CATALOG_SKILLS.has(id));
 const basic=learned; // Consulta na Evolução inclui também Perícias elementais.
 const skillsEmpty='<span class="fp-owned-empty">Nenhuma Perícia adquirida.</span>';
 const skillCount=$("owned-skills-count");if(skillCount)skillCount.textContent=String(basic.length);
 $("owned-skills").innerHTML=basic.length?basic.map(([id,name,detail])=>{
  const description=CARD_EFFECTS[id]||CARD_BRIEFS[id]||detail||"";
  return '<details class="fp-quick-skill"><summary>'+codexSkillIcon(id)+'<strong>'+esc(name)+'</strong></summary>'+
   '<p>'+esc(description)+'</p><button type="button" class="fp-secondary" data-sheet-page="genetic" data-gene-select="'+esc(id)+'">Ver no Codex Genético</button></details>';
 }).join(""):skillsEmpty;
 renderMagicActions();
 // A área de armas mostra apenas armamento equipado; focos ficam no preparador de magia.
 const weapons=state.items.filter(it=>it.equipped&&it.type==="arma");
 $("equipped-shortcuts").innerHTML=weapons.length?weapons.map(it=>{
  const mode="armas",dice=combatItem(it,mode);
  const chosen=preferredQuickAttribute(it),ready=dice.length>0&&!!chosen;
  const labelText=dice.length?dice.map(n=>"d"+n).join(" + "):"Requer Perícia";
  const hint=ready?labelText+" · Preparar":dice.length?"Selecione um Atributo treinado":"Perícia de manejo/foco necessária";
  const icon=codexItemIcon(it),name=esc(it.name);
  return ready?
   '<button type="button" class="fp-action-weapon" data-action="repertoire-roll" data-id="'+esc(it.id)+'" title="Preparar '+name+' com Disciplina + '+esc(label("attr",chosen))+'">'+
    '<span class="fp-owned-heading">'+icon+'<strong>'+name+'</strong></span><small>'+esc(hint)+'</small></button>':
   '<div class="fp-action-weapon is-unavailable" title="'+esc(equipmentDetails(it))+'">'+
    '<span class="fp-owned-heading">'+icon+'<strong>'+name+'</strong></span><small>'+esc(hint)+'</small></div>';
 }).join(""):'<button type="button" class="fp-action-inventory" data-sheet-page="inventory">Equipar arma ou foco no Inventário</button>';
}
// SRD v0.71 — protótipo manual. Não converte dano automaticamente em sangue ou cura.
function renderHemomancy(){
 const panel=$("hemomancy-panel");
 if(!panel)return;
 const available=ownsSkill("sangue");
 const details=$("hemo-details");if(details)details.hidden=!available;
 panel.hidden=!available;
 if(panel.hidden)return;
 const h=state.hemomancy||{spilled:0,selfBleeding:false,usedThisTurn:false};
 $("hemo-spilled").textContent=String(h.spilled);
 const spend=$("hemo-spend-spilled");
 if(spend)spend.disabled=h.spilled<1||!!state.pending;
 const record=$("hemo-record-damage");
 if(record)record.disabled=!!state.pending;
 $("hemo-self-status").textContent=h.selfBleeding?"Sangrando":"Sem Sangramento";
 $("hemo-self-status").setAttribute("aria-pressed",String(h.selfBleeding));
 const kinds={magic:"Amplificação de magia", "direct-life":"Magia contra Vida sem armadura", keep:"Manter dado",step:"Elevar dado"};
 $("hemo-boost-status").textContent=h.usedThisTurn?
  "Usado neste turno: "+(kinds[h.boostKind]||"amplificação")+" · "+(h.boostPayment==="life"?"−1 Vida":"−3 Sangue inimigo"):
  "Disponível · 1 ativação por turno";
 const lifePay=$("hemo-amplify-life"),bloodPay=$("hemo-amplify-blood");
 if(lifePay)lifePay.disabled=h.usedThisTurn||state.life<1||!!state.pending;
 if(bloodPay)bloodPay.disabled=h.usedThisTurn||h.spilled<3||!!state.pending;
 $("hemo-transfusion-potential").textContent=String(Math.floor(h.spilled/3));
 const transfusion=$("hemo-transfusion-record");
 transfusion.disabled=!ownsSkill("transfusao-sanguinaria")||h.spilled<3||state.life<=0||state.life>=maxLife()||!!state.pending;
 transfusion.title=state.race!=="lucker_sangue"?"Exclusiva de Lucker de Sangue; outras origens não podem utilizar Transfusão Sanguinária.":!ownsSkill("transfusao-sanguinaria")?
  "Exige Transfusão Sanguinária (e sua Perícia pré-requisito Transfusão ainda pendente).":
  h.spilled<3?"Exige 3 marcas de sangue inimigo disponível.":"Registrar conjuração já resolvida com o Narrador.";
 $("hemo-transfusion-state").textContent=state.race!=="lucker_sangue"?"Transfusão Sanguinária é exclusiva dos Luckers de Sangue, não disponível para esta origem.":ownsSkill("transfusao-sanguinaria")?
  "Perícia adquirida. Registro somente após resolver a conjuração com o Narrador.":
  "Protótipo: 1 XP, requisitos Transfusão + Elemento Sangue; aquisição de Transfusão ainda pendente.";
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
 "manejo-perfeito":[["p:armas_conjuracao:2","a:destreza:2","s:disciplina-avancada"]],
 "maos-leves":[["p:furtividade:3","p:armas_conjuracao:3","k:protecao:2"]],
 "pericia-armadilha":[["p:artesao:1","p:armas_conjuracao:1","k:engenharia:1","a:destreza:1","a:inteligencia:1","k:protecao:2","p:furtividade:1"]],
 "golpe-furtivo":[["p:armas_conjuracao:2","p:furtividade:2"]],
 "bioetica":[["k:alquimia:3","a:inteligencia:3","a:destreza:3","s:sangue","s:criar-item-foco-magia","s:vento","s:domar-criatura-media"],["k:alquimia:3","a:inteligencia:3","a:destreza:3","s:sangue","s:criar-item-foco-magia","s:agua","s:domar-criatura-media"],["k:alquimia:3","a:inteligencia:3","a:destreza:3","s:sangue","s:criar-item-foco-magia","s:terra","s:domar-criatura-media"],["k:alquimia:3","a:inteligencia:3","a:destreza:3","s:sangue","s:criar-item-foco-magia","s:fogo","s:domar-criatura-media"],["k:alquimia:3","a:inteligencia:3","a:destreza:3","s:sangue","s:criar-item-foco-magia","s:sagrado","s:domar-criatura-media"],["k:alquimia:3","a:inteligencia:3","a:destreza:3","s:sangue","s:criar-item-foco-magia","s:trevas","s:domar-criatura-media"],["k:alquimia:3","a:inteligencia:3","a:destreza:3","s:sangue","s:criar-item-foco-magia","s:veneno","s:domar-criatura-media"]],
 "pesquisa-avancada-pocoes":[["k:alquimia:3","s:improviso","p:artesao:3","a:destreza:2"]],
 "corpo-fechado":[["a:vigor:4","s:artista-marcial"]],
 "invocar-esfera-espiritual":[["s:criar-item-foco-magia","a:destreza:4","a:inteligencia:3","a:vigor:3"]],
 "passo-etereo":[["s:invocar-esfera-espiritual"]],
 "absorver-esferas":[["s:invocar-esfera-espiritual"]],
 "disparo-esferas-espirituais":[["s:invocar-esfera-espiritual"]],
 "dilema":[["a:vigor:4","s:artista-marcial"]],
 "impacto-psiquico":[["s:criar-item-foco-magia","s:artista-marcial"]],
 "invocacao-elemental":[["s:criar-item-foco-magia","s:domar-criatura-pequena"]],
 "domar-criatura-pequena":[["a:influencia:2","a:inteligencia:1"]],
 "domar-criatura-media":[["a:influencia:3","a:inteligencia:1","p:apresentacao:1","s:domar-criatura-pequena"]],
 "domar-criatura-grande":[["a:influencia:4","a:inteligencia:1","p:apresentacao:2","s:domar-criatura-pequena","s:domar-criatura-media"]],
 "pericia-druidica":[["s:criar-item-foco-magia","s:terra"]],
 "transformacao-elemental":[["s:criar-item-foco-magia","s:vento"],["s:criar-item-foco-magia","s:agua"],["s:criar-item-foco-magia","s:terra"],["s:criar-item-foco-magia","s:fogo"],["s:criar-item-foco-magia","s:sagrado"],["s:criar-item-foco-magia","s:sangue"],["s:criar-item-foco-magia","s:trevas"],["s:criar-item-foco-magia","s:veneno"]],
 "montar":[["a:influencia:2"]],
 "pericia-montaria":[["a:influencia:1","a:destreza:2"]],
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
 "medicina-avancada":[["k:medicina:2"]],
 "protecao-avancada":[["k:protecao:2"]],
 "astronomia-avancada":[["k:astronomia:2"]],
 "alquimia-avancada":[["k:alquimia:2"]],
 "engenharia-avancada":[["k:engenharia:2"]],
 "erudicao-avancada":[["k:erudicao:2"]],
 "atletismo-avancado":[["p:atletismo:2"]],
 "artesao-avancado":[["p:artesao:2"]],
 "maestria-martelos":[["a:forca:3","a:destreza:1","a:vigor:1"]],
 "maestria-hastes":[["a:forca:2","a:agilidade:1","a:destreza:1"]],
 "maestria-espadas":[["a:forca:2","a:destreza:2"]],
 "ferreiro":[["p:artesao:1","a:forca:1","a:destreza:1","a:inteligencia:1","s:artesao-avancado"]],
 "ferreiro-elemental":[["a:inteligencia:2","a:destreza:2","s:ferreiro","s:improviso","s:criar-item-foco-magia","s:encantar-com-elemento"]],
 "resistencia-a-fogo":[["a:vigor:2","s:ferreiro-elemental","s:fogo"]],
 "encantar-com-elemento":[["s:criar-item-foco-magia","s:vento"],["s:criar-item-foco-magia","s:agua"],["s:criar-item-foco-magia","s:terra"],["s:criar-item-foco-magia","s:fogo"],["s:criar-item-foco-magia","s:sagrado"],["s:criar-item-foco-magia","s:sangue"],["s:criar-item-foco-magia","s:trevas"],["s:criar-item-foco-magia","s:veneno"]],
 "apresentacao-avancada":[["p:apresentacao:2"]],
 "coleta-avancada":[["p:coleta:2"]],
 "criar-item-foco-magia":[["p:armas_conjuracao:1","a:inteligencia:1","p:artesao:1"]],
 "escudo-arcano":[["a:inteligencia:2","a:vigor:1","s:criar-item-foco-magia"]],
 "conjuracao-equilibrada":[["p:armas_conjuracao:2","a:inteligencia:2","a:destreza:2","s:criar-item-foco-magia"]],
 "improviso":[["p:armas_conjuracao:1","a:inteligencia:1","a:destreza:1"]],
 "fogo":[["p:armas_conjuracao:1","a:inteligencia:1"]],
 "agua":[["p:armas_conjuracao:1","a:inteligencia:1"]],
 "vento":[["p:armas_conjuracao:1","a:inteligencia:1"]],
 "terra":[["p:armas_conjuracao:1","a:inteligencia:1"]],
 "sagrado":[["p:armas_conjuracao:2","a:inteligencia:2"]],
 "sangue":[["p:armas_conjuracao:2","a:inteligencia:2"]],
 "trevas":[["p:armas_conjuracao:2","a:inteligencia:2"]],
 "veneno":[["p:armas_conjuracao:2","a:inteligencia:2","k:alquimia:2","k:medicina:2"]],
 "criar-veneno":[["p:artesao:1","a:inteligencia:2","k:alquimia:2","k:medicina:2"]],
 "criar-antidoto":[["p:artesao:1","a:inteligencia:2","k:alquimia:2","k:medicina:2","s:criar-veneno"]],
 "armas-longo-alcance":[["p:armas_conjuracao:1","a:destreza:2"]],
 "armas-fogo":[["p:armas_conjuracao:2","a:destreza:2"]],
  "olhos-de-aguia":[["a:destreza:3","p:armas_conjuracao:3","s:armas-longo-alcance"],["a:destreza:3","p:armas_conjuracao:3","s:armas-fogo"]],
 "sacrificio-heroico":[["a:vigor:4"]],
 "escudo-refletor":[["s:maestria-escudos"]],
 "sentido-elemental":[["a:inteligencia:3","s:improviso"]],
 "cancelar-magia":[["s:criar-item-foco-magia","s:improviso","a:inteligencia:4","a:agilidade:4","a:destreza:4"]],
 "mudanca-elemental":[["s:transformacao-elemental","a:destreza:4","a:inteligencia:4"]],
 "desencantar":[["s:cancelar-magia"]],
 "espelho-magico":[["s:cancelar-magia"]],
 "maestria-escudos":[["a:destreza:2","a:vigor:2"]],
 "escudo-bumerangue":[["a:destreza:2","a:forca:3","s:maestria-arremesso-armas","s:maestria-escudos"]],
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
 const [sid,baseName,baseDetail,cost]=skill,owned=ownsSkill(sid),racial=racialGrants(state).includes(sid),staged=genePendingSkills.has(sid);
 const name=sid==="escudo-arcano"&&s.race==="runa_espinhos"?"Escudo Rúnico":baseName;
 const detail=sid==="escudo-arcano"&&s.race==="runa_espinhos"?
 "Escudo Rúnico racial: uma ativação gratuita por dia, resistência a um elemento, 2P mantidos para formar 1E de barreira; DE e Integridade E+P convertidos, duração 1 rodada; sem armadura física. Resistência elemental padrão contra o elemento escolhido: cada E do ataque vale 0,5 de dano e P vale 0 dano elemental, preservadas as consequências de Pavor. Arredondamento geral ainda pendente.":baseDetail;
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
  '<h4 class="fp-gene-detail-heading">'+codexSkillIcon(sid)+'<span>'+esc(name)+'</span></h4><p>'+esc(sid==="pericia-druidica"?CARD_BRIEFS[sid]:detail)+'</p>'+
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
   type:"skill",id:row[0],name:row[0]==="escudo-arcano"&&preview.race==="runa_espinhos"?"Escudo Rúnico":row[1],state:geneSkillStatus(row,preview),
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
 if(page==="inventory")inventoryPane="bag";
 if(focusSkill)geneSelected=focusSkill;
 if((page==="play"||page==="inventory")&&editMode)editMode=false;
 render();
 $("sheet-navigation")?.scrollIntoView?.({behavior:"smooth",block:"nearest"});
}
function prepareElementSkill(id){
 // Compatibilidade com atalhos legados: Perícia elemental não exige compra da Perícia de Foco.
 if(!magicKnownElements().some(([key])=>key===id))return;
 prepareMagic(id);
}

function render(){renderPlayerSheets();renderRacePanel();renderVitals();renderSmallCompanion();renderXP();renderRespecSkills();renderDiceLegend();renderSources();renderComposer();renderSkills();renderInventory();renderTrade();renderOwnedPanel();renderHemomancy();renderGenetic();renderWizard();applySheetPage();soundUI();}

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
  '<span class="fp-wiz-starter-xp">Saldo <strong>'+xpCosts().free+'</strong> / '+CREATE_BUDGET.total+' XP (total experimental)</span></div>';
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
  const currentPercent=loadPercent(),currentLoadStatus=currentPercent>=100?"over":currentPercent>=75?"heavy":"normal";
 const editable=!state.trade.purchases.length&&!state.trade.collected;
 // Depois da primeira compra, mostrar recursos restantes, não a distribuição original.
 if(!editable)tradeDraft={...state.trade.resources};
 const sum=RESOURCES.reduce((n,[k])=>n+Number(tradeDraft[k]||0),0);
 const changed=RESOURCES.some(([k])=>Number(tradeDraft[k]||0)!==Number(state.trade.resources[k]||0));
 const resources=RESOURCES.map(([k,name])=>'<label class="fp-wiz-vt-resource"><span>'+esc(name)+'</span><input type="number" min="0" max="'+STARTING_VT+'" data-wizard-vt-draft="'+k+'" value="'+tradeDraft[k]+'"'+(editable?'':' disabled')+'><small>Grau 1 · 1 VT por unidade (playtest)</small></label>').join("");

 const selectFilter=(key,options,value)=>'<select data-wizard-shop-'+key+' aria-label="Filtrar por '+(key==="type"?"tipo":"peso")+'">'+
  options.map(([id,label])=>'<option value="'+id+'"'+(id===value?' selected':'')+'>'+esc(label)+'</option>').join("")+'</select>';
 const filters='<div class="fp-equip-filters"><label>Tipo '+selectFilter("type",EQUIPMENT_FAMILIES,wizardShopCategory)+'</label>'+
  '<label>Peso '+selectFilter("weight",EQUIPMENT_WEIGHT_OPTIONS,wizardShopWeight)+'</label></div>';
 const visible=CATALOG.filter(it=>equipmentMatches(it,wizardShopCategory,wizardShopWeight))
  .sort((a,b)=>EQUIPMENT_FAMILIES.findIndex(x=>x[0]===equipmentFamily(a))-
    EQUIPMENT_FAMILIES.findIndex(x=>x[0]===equipmentFamily(b))||
    EQUIPMENT_WEIGHT_OPTIONS.findIndex(x=>x[0]===equipmentWeight(a))-
    EQUIPMENT_WEIGHT_OPTIONS.findIndex(x=>x[0]===equipmentWeight(b))||
    a.name.localeCompare(b.name,"pt-BR"));
 let previousGroup="";
 const items=visible.map(it=>{
  const group=equipmentGroupName(equipmentFamily(it))+" · "+equipmentWeightName(equipmentWeight(it));
  const groupTitle=group===previousGroup?"":'<h5 class="fp-shop-group-title">'+esc(group)+'</h5>';
  previousGroup=group;
  const purchasable=it.kind!=="focus"&&it.category!=="pendente"&&it.priceVT!=null&&Number(it.priceVT)>0;
  const price=Number(it.priceVT);
  const preview=purchasable?purchaseLoadPreview(it,price):null;
  const priceText=purchasable?price+" VT":it.kind==="focus"?(it.priceFormula?it.priceFormula+" VT · foco":"Fabricação por Artesão"):
   it.priceVT!=null?it.priceVT+" VT · categoria pendente":"Preço pendente";
  return groupTitle+'<details class="fp-wiz-shop-item fp-shop-compact"><summary class="fp-shop-summary">'+
   codexItemIcon(it)+'<strong>'+esc(it.name)+'</strong><small>'+esc(equipmentDetails(it))+(preview?' <span class="fp-shop-weight-risk'+(preview.status==="normal"?"":' is-'+preview.status)+'">· Após compra '+pad(preview.percent)+'% ('+preview.balance+')</span>':'')+'</small>'+
   '<b>'+esc(priceText)+'</b></summary><div class="fp-shop-expand">'+
   (it.description?'<p>'+esc(it.description)+'</p>':'<p>As características exigem Perícia apropriada; não concedem bônus automáticos.</p>')+
   (preview?purchaseLoadMarkup(preview):'')+
   (purchasable?'<button type="button" data-action="wizard-buy-item" data-item="'+esc(it.name)+'"'+
    (remaining>=price&&!changed?'':' disabled')+'>'+(changed?'Confirme recursos':remaining<price?'Sem VT':'Comprar · '+price+' VT')+'</button>':
    '<span class="fp-wiz-muted">Não disponível para compra automática</span>')+
   '</div></details>';
 }).join("");
 const owned=state.items.length?state.items.map(it=>'<div class="fp-wiz-owned-item"><span><strong>'+esc(it.name)+'</strong><small>G'+it.grade+' · '+esc(it.type)+' · '+(it.equipped?'Equipado':'No inventário')+'</small></span><button type="button" data-action="equip" data-id="'+esc(it.id)+'">'+(it.equipped?'Guardar':'Equipar')+'</button></div>').join(""):'<p>Nenhum equipamento comprado. Você pode continuar sem comprar itens.</p>';
 return '<div class="fp-wiz-copy"><span class="fp-kicker">ETAPA 04 · PATRIMÔNIO INICIAL</span><h3>VT e equipamentos iniciais.</h3><p><strong>VT (Valor de Troca)</strong> é uma referência de escambo, não moeda. São <strong>20 VT iniciais experimentais</strong>, separados dos '+CREATE_BUDGET.total+' XP.</p></div>'+
 '<div class="fp-wiz-vt-stats"><div><small>VT INICIAIS</small><strong>'+STARTING_VT+'</strong></div><div><small>VT DISPONÍVEIS</small><strong>'+remaining+'</strong></div><div><small>VT GASTOS</small><strong>'+spent+'</strong></div></div>'+
 '<section class="fp-wiz-vt-section"><h4>Distribuição inicial dos recursos</h4><p>São cinco recursos de Grau 1; a distribuição inicial sugerida é de 4 unidades para cada. Você pode alterá-la antes da primeira compra.</p><div class="fp-wiz-vt-grid">'+resources+'</div>'+
 '<div class="fp-wiz-vt-actions"><strong>'+sum+(editable?' / '+STARTING_VT+' VT distribuídos':' VT restantes')+'</strong>'+(editable?'<button type="button" data-action="wizard-vt-allocate"'+(sum!==STARTING_VT?' disabled':'')+'>Confirmar distribuição</button>':'<span>Distribuição já consolidada.</span>')+'</div></section>'+
 '<section class="fp-wiz-vt-section"><h4>Comprar itens G1</h4><p>Os preços e alcances do catálogo são <strong>PROPOSTOS</strong> para playtest; não há equipamento gratuito presumido.</p>'+
  '<div class="fp-purchase-load fp-purchase-load-'+currentLoadStatus+'"><strong>Carga atual: '+pad(loadUsed())+' / '+capacity()+' Alto ('+pad(currentPercent)+'%) · '+balance()+'</strong><small>Capacidade = 1 + ⌊(Força + Vigor + Atletismo) / 3⌋. As prévias descontam os recursos gastos no escambo.</small></div>'+
 '<label class="fp-wiz-shop-preferred">Recurso usado primeiro na troca <select data-wizard-trade-preferred>'+
 RESOURCES.map(([k,name])=>'<option value="'+k+'"'+(wizardTradePreferred===k?' selected':'')+'>'+esc(name)+'</option>').join("")+'</select></label>'+
 '<div class="fp-shop-filters-wrap">'+filters+'<span class="fp-filter-count">'+visible.length+' opções</span></div><div class="fp-wiz-shop-catalog">'+(items||'<p>Nenhum item encontrado com esses filtros.</p>')+'</div></section>'+
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
  '<div class="fp-wiz-reminder"><strong>'+CREATE_BUDGET.total+' XP iniciais · orçamento compartilhado</strong>'+
  '<p>Atributos: '+x.attributes+' XP · Formação: '+x.training+' XP · Perícias: '+x.skills+' XP · saldo: '+x.free+' XP. Ao menos um Atributo e um Conhecimento ou Prática precisam alcançar Grau 1.</p></div>'+
  '<div class="fp-wiz-reminder"><strong>Patrimônio inicial · '+walletValue()+' VT restantes</strong>'+
  '<p>20 VT experimentais para escambo. Itens adquiridos: '+(state.items.length?state.items.map(it=>esc(it.name)).join(", "):"nenhum")+'. É possível começar sem equipamentos comprados.</p></div>'+
  '<div class="fp-purchase-load fp-purchase-load-'+(loadPercent()>=100?"over":loadPercent()>=75?"heavy":"normal")+'"><strong>Revisão de carga: '+pad(loadUsed())+' / '+capacity()+' Alto ('+pad(loadPercent())+'%) · '+balance()+'</strong><small>Confira o peso antes de concluir o personagem. Itens transportados e recursos de troca contam na carga.</small></div>';
}
function wizardOverview(){
 const x=xpCosts();
 return '<div class="fp-wiz-summary-top"><small>SEU PERSONAGEM</small><strong>'+esc(state.name||"Novo Aprendiz")+'</strong>'+
  '<p>'+esc(state.concept||"Seu caminho ainda está por ser escrito")+' · '+esc(RACES[state.race]?.[0]||"Humano")+'</p></div>'+
  '<div class="fp-wiz-sidebar-title">XP · CODIFICAÇÃO</div>'+
  '<div class="fp-wiz-summary-total"><span>INVESTIDOS</span><strong>'+x.total+' / '+CREATE_BUDGET.total+' XP</strong></div>'+
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

function renderSmallCompanion(){
 const panel=$("small-companion-panel");if(!panel)return;
 const owned=state.skills.includes("domar-criatura-pequena");
 panel.hidden=!owned;
 const present=owned&&!!state.smallCompanion?.present;
 $("small-companion-present").checked=present;
 $("small-companion-name").value=state.smallCompanion?.name||"";
 $("small-companion-name").disabled=!present;
 $("small-companion-species").value=state.smallCompanion?.species==="serpente"?"serpente":"outro";
 $("small-companion-species").disabled=!present;
 $("small-companion-info").textContent=present?
  "+1 Vida máxima registrado. Auxílio ativo: 1 Coragem por turno; a serpente aplica Envenenado se o alvo estiver em Sangramento, sem dano automático não definido.":
  "Comprar Domar Criatura Pequena não cria automaticamente um companheiro nem concede +1 Vida. Registre-o após a domesticação.";
}
function renderVitals(){
 const roundLabel=$("round-spent-label");if(roundLabel)roundLabel.textContent="Coragem gasta nesta rodada: "+(state.courageRoundSpent||0)+"/5";
 const lifeMaxValue=maxLife();state.life=clamp(state.life,0,lifeMaxValue);state.courage=clamp(state.courage,0,maxCourage());
 $("life-text").textContent=state.life+" / "+lifeMaxValue;
 $("courage-text").textContent=state.courage+" / "+maxCourage();
 const defense=defensePresentation();
 $("de-label").textContent=defense.label;
 $("de-text").textContent=defense.value;$("balance-text").textContent=balance();
 const protection=equippedArmor();
 const integrity=$("armor-integrity-text"),integrityCaption=$("armor-integrity-caption");
 if(integrity)integrity.textContent=protection?(protection.max>0?protection.hp+" / "+protection.max:"0 / 0"):"—";
 if(integrityCaption)integrityCaption.textContent=protection?protection.name:"Sem armadura";
 $("de-caption").textContent="Base "+deNatural()+(protection?" · armadura "+(armorDodgeBonus()-armorDePenalty()>=0?"+":"")+(armorDodgeBonus()-armorDePenalty()):"")+(masteredShield()?" · Maestria em Escudos +1 DE":"");
 $("load-text").textContent=pad(loadUsed())+" / "+capacity();
 const loadCaption=$("balance-caption"),blocks=$("load-blocks");
 if(loadCaption)loadCaption.textContent=NPC_MODE?"Cálculo pendente":pad(loadPercent())+"% de carga";
 if(blocks){blocks.hidden=NPC_MODE;blocks.innerHTML=NPC_MODE?"":loadBlocksMarkup();blocks.setAttribute("aria-label","Carga física: "+pad(loadPercent())+"% ocupados, balanço "+balance());}
 $("move-text").textContent=movement()+" m";
 $("move-caption").textContent="Por deslocamento";
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
 $("life-recovery").textContent=health.label+(effects.trim()?" · "+effects.trim():"");
}

/* Ajuda contextual: leitura das fórmulas existentes, sem mudar regras. */
function vitalHelpDetails(kind){
 const a=state.attributes,p=state.practices,armor=equippedArmor(),health=lifeStage();
 const natural=deNatural(),mod=armorDodgeBonus()-armorDePenalty();
 const used=Number(loadUsed().toFixed(2)),percent=Number(loadPercent().toFixed(1));
 const levelBonus=Number(state.level>=5)+Number(state.level>=10)+Number(state.level>=20);
 const entries={
 life:["Vida e estados","A Vida atual define a condição "+health.label+". Em zero, o personagem morre.",
 "Máxima: 4 + Vigor ("+(a.vigor||0)+") + ⌊Força ("+(a.forca||0)+") / 2⌋ = "+maxLife()+". Faixas: "+health.bands.join(" / ")+".",
 "SRD Playtest Nível 1 v1.0 · Vida e estados."],
 courage:["Coragem","Reserva usada para preparar dados e ativar efeitos. Até 5 Coragens podem ser gastas numa única rolagem.",
 "Teto: 10 + "+levelBonus+" pelos níveis 5, 10 e 20 já alcançados = "+maxCourage()+". Críticos recuperam 1 ou 2; descanso longo recupera Vigor + 1, até o teto.",
 "SRD Playtest Nível 1 v1.0 · Seção 2."],
 defense:["DE Defensiva","Dificuldade que o atacante precisa alcançar em todas as defesas. Teto da DE base 9 e total com modificadores limitado a 12.",
 "DE base: AGI "+(a.agilidade||0)+" + ⌊(VIG "+(a.vigor||0)+" + DES "+(a.destreza||0)+")/2⌋ + ⌊ATL "+(p.atletismo||0)+"/3⌋ = "+natural+". "+(armor?"Armadura "+armor.name+": "+(mod>=0?"+":"")+mod+" (Muito Leve +2 em todas as defesas). ":"Sem armadura. ")+"Total = "+deDefense()+". Esquiva não duplica bônus.",
 "Cálculo atual da ficha · Livro do Jogador, defesa e armaduras."],
 integrity:["Integridade",armor?"Resistência restante da armadura "+armor.name+". Registre perda no Inventário.":"Não há armadura equipada; equipe uma peça no Inventário.",
 armor?"Atual / máxima: "+(armor.hp??0)+" / "+(armor.max??0)+". O valor vem da própria peça equipada. Escudos possuem Integridade separada.":"Sem armadura, não se calcula Integridade adicional.",
 "SRD Playtest Nível 1 v1.0 · Proteções; Inventário da ficha."],
 balance:["Balanço por carga",NPC_MODE?"Balanço natural de criatura: regra pendente.":"Categoria atual do peso carregado: "+balance()+".",
 "Ocupação: "+used+" / "+capacity()+" = "+percent+"%. Faixas: abaixo de 25% Muito Leve; 25–49% Leve; 50–74% Médio; 75–99% Pesado; 100% ou mais Muito Pesado.",
 "Classificação atual do criador (playtest)."],
 load:["Carga","Peso total dos itens, recursos carregados e armas presas em escudos, quando presentes.",
 "Capacidade = 1 + ⌊Força ("+(a.forca||0)+")/3⌋ + ⌊Vigor ("+(a.vigor||0)+")/3⌋ + ⌊Disciplina ("+(p.armas_conjuracao||0)+")/3⌋ + ⌊Atletismo ("+(p.atletismo||0)+")/3⌋ = "+capacity()+". Ocupação: "+used+" unidades Alto.",
 "Fórmula atual da ficha · Inventário (playtest)."],
 movement:["Movimento","Deslocamento básico antes de efeitos situacionais e Perícias específicas.",
 "8 m + Agilidade ("+(a.agilidade||0)+") + ⌊Atletismo ("+(p.atletismo||0)+") / 3⌋ = "+movement()+" m.",
 "Fórmula atual da ficha · Agilidade e Atletismo."]
 };
 return entries[kind]||null;
}
let vitalTooltipPinned=false;
let vitalTooltipTrigger=null;
let vitalTooltipTimer=null;
function stopVitalTooltipTimer(){
 if(vitalTooltipTimer!==null)clearTimeout(vitalTooltipTimer);
 vitalTooltipTimer=null;
}
function closeVitalTooltip(){
 stopVitalTooltipTimer();
 vitalTooltipPinned=false;vitalTooltipTrigger=null;
 const tip=$("fp-vital-tooltip");if(tip)tip.hidden=true;
 document.querySelectorAll(".fp-vital-open[aria-expanded='true']").forEach(b=>{
  b.setAttribute("aria-expanded","false");b.removeAttribute("aria-describedby");
 });
}
function showVitalTooltip(button,pinned=false){
 const tip=$("fp-vital-tooltip");if(!tip||!button)return;
 if(vitalTooltipPinned&&!pinned)return;
 const kind=button.dataset.vitalOpen,info=vitalHelpDetails(kind);
 if(!info)return;
 stopVitalTooltipTimer();
 document.querySelectorAll(".fp-vital-open[aria-expanded='true']").forEach(b=>b.setAttribute("aria-expanded","false"));
 let controls="";
 if(kind==="life"||kind==="courage"){
  const value=kind==="life"?state.life+" / "+maxLife():state.courage+" / "+maxCourage();
  const minusLabel=kind==="life"?"Perder Vida":"Gastar Coragem",plusLabel=kind==="life"?"Recuperar Vida":"Recuperar Coragem";
  controls='<div class="fp-vital-tooltip-actions"><strong>'+esc(value)+'</strong>'+
   '<button type="button" class="fp-counter" data-resource="'+kind+'" data-delta="-1" aria-label="'+minusLabel+'">−</button>'+
   '<button type="button" class="fp-counter" data-resource="'+kind+'" data-delta="1" aria-label="'+plusLabel+'">+</button></div>';
 }
 tip.innerHTML='<div class="fp-vital-tooltip-heading"><strong id="fp-vital-tooltip-title">'+esc(info[0])+'</strong>'+
  '<button type="button" class="fp-vital-tooltip-close" data-vital-close aria-label="Fechar explicação">×</button></div>'+
  '<p>'+esc(info[1])+'</p>'+controls+
  '<p class="fp-vital-tooltip-formula">'+esc(info[2])+'</p>'+
  '<small>Origem: '+esc(info[3])+'</small>'+
  '<a class="fp-vital-tooltip-source" href="https://github.com/Ike-Grifact/Codex-RPG/blob/main/docs/srd-playtest-nivel-1-v1.0.md" target="_blank" rel="noopener noreferrer">Consultar SRD vigente</a>';
 tip.hidden=false;
 tip.setAttribute("aria-labelledby","fp-vital-tooltip-title");
 const rect=button.getBoundingClientRect(),gap=9,padding=12;
 const width=tip.offsetWidth,height=tip.offsetHeight;
 const left=Math.max(padding,Math.min(rect.left,window.innerWidth-width-padding));
 const bottom=rect.bottom+gap;
 const top=bottom+height<=window.innerHeight-padding?bottom:Math.max(padding,Math.min(rect.top-height-gap,window.innerHeight-height-padding));
 tip.style.left=left+"px";tip.style.top=top+"px";
 button.setAttribute("aria-expanded","true");
 vitalTooltipTrigger=button;vitalTooltipPinned=!!pinned;
}
function toggleVitalTooltip(button){
 if(vitalTooltipPinned&&vitalTooltipTrigger===button){closeVitalTooltip();return;}
 showVitalTooltip(button,true);
}
function scheduleVitalTooltipClose(){
 if(vitalTooltipPinned)return;
 stopVitalTooltipTimer();
 vitalTooltipTimer=setTimeout(()=>{
  const tip=$("fp-vital-tooltip");
  if(!tip?.matches(":hover")&&!vitalTooltipTrigger?.matches(":hover"))closeVitalTooltip();
 },180);
}
function renderSources(){
 for(const group of ["attr","practice","know"]){
  const html=GROUPS[group].map(([id,name])=>{
   const g=state[SOURCE_PROPS[group]][id]||0,source={group,key:id};
   const nextCost=xpStepCost(group,id,1),canEdit=(viewMode==="builder"&&!state.creationLocked)||editMode;
   const canRaise=(canEdit||state.creationLocked)&&!state.pending&&g<6&&canAfford(group,nextCost);
   const canReduce=canEdit&&g>0&&!state.pending&&!(g===1&&isRacialGradeOne(group,id));
   const isBase=same(source,draft.base),isAttr=same(source,draft.attribute),isThird=same(source,draft.third);
   const flag=isBase?"BASE":isAttr?(draft.maosLeves?"FURTIVIDADE":"ATRIBUTO"):isThird?"COMPLEMENTO":"";
   const title=label(group,id),dice=dataDice(group,g);
   const band=editMode?racialXpBand(group,id):"normal";
   return '<div class="fp-source-item '+(isBase?"fp-is-base":isAttr?"fp-is-attr":isThird?"fp-is-third":"")+(band==="normal"?"":" is-xp-"+band)+'">'+
    '<button type="button" class="fp-source-pick" data-action="source" data-group="'+group+'" data-key="'+id+'" aria-pressed="'+!!flag+'" title="'+(editMode?"Modo edição: use + ou −":"Selecionar fonte")+'" '+(state.pending||editMode?"disabled":"")+'>'+
    '<span class="fp-src-title"><span>'+esc(title)+'</span>'+(flag?'<span class="fp-flag">'+flag+'</span>':"")+'</span>'+
    (editMode?racialXpMarker(group,id):"")+
    '<span class="fp-dice-list">'+dice.map(n=>'<span class="fp-die-badge fp-die-d'+n+'">'+dieIcon(n)+'<span>d'+n+'</span></span>').join("")+'</span></button>'+
    '<div class="fp-grade-controls"><button type="button" data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="1" aria-label="Aumentar grau de '+esc(title)+'" '+(!canRaise||state.pending?"disabled":"")+'>+</button>'+
    '<b>'+g+'</b><button type="button" data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="-1" aria-label="Reduzir grau de '+esc(title)+'" '+(!canReduce?"disabled":"")+'>−</button><small class="fp-xp-step-cost">'+(g<6?'+'+nextCost+' XP':'MAX')+'</small></div></div>';
  }).join("");
  $({know:"knowledge-list",attr:"attribute-list",practice:"practice-list"}[group]).innerHTML=html;
 }
}
function usingDiscipline(){return draft.base?.group==="practice"&&draft.base.key==="armas_conjuracao";}
// Uma Perícia Avançada habilita sua fonte principal + duas fontes pertinentes (3 no total).
// O requisito de rolar um Atributo e os limites de dados continuam vigentes.
const ADVANCED_SOURCE_SKILLS=Object.fromEntries(ADVANCED_SOURCE_DEFS.map(({id,group,key})=>[group+":"+key,id]));
function advancedSourceActive(){
 const base=draft.base;if(!base)return false;
 const id=ADVANCED_SOURCE_SKILLS[base.group+":"+base.key];
 return !!id&&ownsSkill(id)&&!skillReq(id,state);
}
function canSecondAttribute(){return advancedSourceActive();}
function mayThird(){return advancedSourceActive();}
const ELEMENTAL_SKILL_IDS=["fogo","agua","vento","terra","sagrado","veneno","sangue","trevas"];
function canUseShared(){
 if(!usingDiscipline())return true;
 // Disciplina permite rolagem marcial sem Perícia habilitadora; a conjuração requer sua habilitação.
 return draft.mode==="armas"||(draft.mode==="conjuracao"&&(ownsSkill("criar-item-foco-magia")||ELEMENTAL_SKILL_IDS.some(ownsSkill)));
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
  const selectedAttribute=draft.attribute,removalId=draft.cravarRemovalShieldId,removalDE=draft.de,removalConfirmed=draft.cravarRemovalDEConfirmed;
  draft=freshDraft();draft.base=source;draft.attribute=selectedAttribute;
  if(removalId){draft.cravarRemovalShieldId=removalId;draft.de=removalDE;draft.cravarRemovalDEConfirmed=removalConfirmed;}
  draft.mode=k==="armas_conjuracao"?modeDefault():"normal";
 }else if(same(source,draft.base)){
  const selectedAttribute=draft.attribute,removalId=draft.cravarRemovalShieldId,removalDE=draft.de,removalConfirmed=draft.cravarRemovalDEConfirmed;
  draft=freshDraft();draft.attribute=selectedAttribute;
  if(removalId){draft.cravarRemovalShieldId=removalId;draft.de=removalDE;draft.cravarRemovalDEConfirmed=removalConfirmed;}
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
 if(draft.maosLeves){
  if(!ownsSkill("maos-leves")||skillReq("maos-leves")||draft.base.group!=="practice"||draft.base.key!=="armas_conjuracao"||
   draft.attribute.group!=="practice"||draft.attribute.key!=="furtividade"||draft.third||draft.mode!=="armas"||
   draft.equipmentId||draft.shieldThrowId||draft.shieldRaise||draft.weightEnabled||draft.magicElement||draft.stealthAttack)
   errors.push("Mãos Leves exige exclusivamente Disciplina + Furtividade, sem arma, terceiro dado de fonte ou outro efeito.");
 }else if(!((draft.base.group==="practice"||draft.base.group==="know")&&draft.attribute.group==="attr")&&
  !(typeof NPC_MODE!=="undefined"&&NPC_MODE&&draft.base.group==="attr"&&draft.attribute.group==="attr")){
  errors.push("Teste comum exige Base de Conhecimento/Prática e Atributo; a exceção Disciplina + Furtividade é exclusiva de Mãos Leves.");
 }
 if(draft.shieldThrowId){
  const shield=state.items.find(it=>it.id===draft.shieldThrowId);
  if(!shieldBoomerangReady(shield))errors.push("Escudo Bumerangue exige escudo equipado e Perícias/requisitos válidos.");
  if(draft.base.group!=="practice"||draft.base.key!=="armas_conjuracao"||draft.mode!=="armas"||draft.attribute.group!=="attr"||
    (draft.third&&draft.third.group!=="attr"))errors.push("Escudo Bumerangue requer Disciplina (Armas) + Atributo(s), não outra Prática ou Conhecimento.");
  if(draft.shieldRaise||draft.cravarRemovalShieldId||draft.equipmentId||draft.magicElement||draft.weightEnabled)
   errors.push("Arremessar Escudo Bumerangue é uma ação própria; não combinar com Levantar Escudo, Cravar ou dados de arma.");
  if(!Number.isInteger(draft.shieldThrowMeters)||draft.shieldThrowMeters<1||draft.shieldThrowMeters>8)
   errors.push("Escudo Bumerangue possui alcance máximo de 8 metros.");
 }
 if(draft.third){
  if(same(draft.third,draft.base)||same(draft.third,draft.attribute))errors.push("Não duplique a mesma fonte.");
  if(draft.third.group==="attr"&&!canSecondAttribute())errors.push("Segundo Atributo complementar exige Perícia Avançada da fonte principal.");
  if(!mayThird())errors.push("Falta Perícia pertinente para a terceira fonte.");
  // A pertinência do complemento é combinada verbalmente com o Narrador; sem checkbox obrigatório.
 }
 if(!canUseShared())errors.push("Conjuração exige Perícia elemental habilitada ou Criar Item de Foco e Magia para Psíquico.");
 if(draft.mode==="conjuracao"&&draft.magicElement){
  const known=magicKnownElements().some(([id])=>id===draft.magicElement);
  const focus=magicSelectedFocus();
  if(!known)errors.push("Elemento não habilitado para esta conjuração.");
  if(draft.magicGrade>1&&!draft.magicGradeConfirmed)errors.push("Confirme com Narrador o acesso ao Grau e efeito G"+draft.magicGrade+".");
  // SRD v0.89: rolar ao declarar; confirmar preparação APÓS o resultado.
  if(draft.magicFocusId&&!focus)errors.push("Foco deve estar no inventário e corresponder ao elemento.");
  if(draft.magicGrade===4&&!magicKnownElements().some(([id])=>id===draft.magicSecondElement&&id!==draft.magicElement))
   errors.push("G4 exige dois elementos G3 diferentes e habilitados, confirmados com Narrador.");
  const secondFocus=magicSelectedSecondFocus();
  const chargeLimit=draft.magicGrade===4?3:draft.magicGrade===3?2:draft.magicGrade===2?1:0;
  if(draft.magicCharges>chargeLimit||draft.magicCharges<0||
     (draft.magicCharges>0&&(!focus||draft.magicCharges>(focus.focusCharges??0)||
      (draft.magicGrade===4&&(!secondFocus||draft.magicCharges>(secondFocus.focusCharges??0))))))
   errors.push("Cargas insuficientes: G2 usa 1 carga; G3 até 2; G4 usa pares de cargas dos dois focos.");
  if(draft.magicAmplify&&!focus)errors.push("Amplificação com foco exige um foco compatível.");
  if(draft.equipmentId&&draft.equipmentId!==(focus?.id||""))
   errors.push("O foco selecionado deve corresponder ao elemento da magia; ele não adiciona dado.");
 }
 const sources=[draft.base,draft.attribute,...(draft.third?[draft.third]:[])];
 const selectedStep=draft.step?draft.stepSourceId:"";
 const elevatedSource=sources.find(source=>selectedStep&&key(source)===selectedStep);
 if(draft.step&&(!elevatedSource||!Object.hasOwn(SOURCE_PROPS,elevatedSource.group)||
  (state[SOURCE_PROPS[elevatedSource.group]]?.[elevatedSource.key]||0)>=6))
  errors.push("Selecione uma fonte usada na rolagem, abaixo do Grau 6, para elevar temporariamente 1 Grau.");
 for(const s of sources){
  const grade=state[SOURCE_PROPS[s.group]][s.key]||0;
  const raised=!!draft.step&&key(s)===selectedStep&&grade<6;
  temporaryGradeDice(s.group,grade,raised).forEach((sides,index)=>pool.push({
   id:key(s)+":"+index,group:s.group,key:s.key,sides,baseSides:sides,temporaryStep:raised
  }));
 }
 if(draft.mode==="conjuracao"&&draft.magicElement){
  const magicDice={1:[6],2:[10],3:[12],4:[12,12]}[Number(draft.magicGrade)]||[];
  if(!magicDice.length)errors.push("Grau mágico inválido.");
  magicDice.forEach((sides,i)=>pool.push({id:"magia:grau:"+draft.magicGrade+":"+i,
    group:"magic",key:"Magia G"+draft.magicGrade+" · dado "+(i+1),sides,baseSides:sides}));
 }
 if(usingDiscipline()&&draft.equipmentId){
  const item=state.items.find(x=>x.id===draft.equipmentId);
  const dice=combatItem(item,draft.mode);
  if(!dice.length)errors.push("Equipe um item e adquira a Perícia de arma/foco ou elemento pertinente para receber seus dados.");
  else dice.forEach((sides,index)=>pool.push({id:"equipment:"+item.id+":"+index,group:"equipment",key:item.name,sides,baseSides:sides}));
 }
 if(draft.potionResearch&&(!ownsSkill("pesquisa-avancada-pocoes")||skillReq("pesquisa-avancada-pocoes")||draft.maosLeves||draft.mode==="conjuracao"||draft.shieldThrowId))
  errors.push("Pesquisa Avançada em Poções concede +1E somente para criar poções; exige Perícia válida e teste não mágico.");
 if(draft.stealthAttack){
  const weapon=state.items.find(x=>x.id===draft.equipmentId);
  const weaponDice=weapon&&combatItem(weapon,"armas");
  if(!ownsSkill("golpe-furtivo")||skillReq("golpe-furtivo")||draft.mode!=="armas"||!usingDiscipline()||
   !weapon||weapon.type!=="arma"||!weaponDice?.length||draft.shieldThrowId||draft.cravarRemovalShieldId||
   draft.maosLeves||draft.shieldRaise)
   errors.push("Golpe Furtivo exige ataque furtivo com Disciplina e arma equipada/habilitada; não vale para foco, escudo ou magia.");
  else pool.push({id:"golpe-furtivo:"+weapon.id,group:"equipment",key:weapon.name+" · Golpe Furtivo",sides:weaponDice[0],baseSides:weaponDice[0],stealthBonus:true});
 }
 if(draft.fulminante){
  const weapon=state.items.find(it=>it.id===draft.equipmentId);
  const ranged=!!weapon&&(weapon.properties||[]).includes("À Distância")||
   /^(arco|besta|zarabatana)/i.test(weapon?.name||"");
  const valid=weapon?.type==="arma"&&weapon.equipped&&!weapon.firearm&&
   !!combatItem(weapon,"armas").length&&draft.mode==="armas"&&usingDiscipline()&&
   (draft.fulminante==="golpe-fulminante"?!ranged&&!draft.attackThrown:
    draft.fulminante==="disparo-fulminante"&&(ranged||(draft.attackThrown&&ownsSkill("maestria-arremesso-armas"))));
  if(!ownsSkill(draft.fulminante)||!valid||skillReq(draft.fulminante))
   errors.push("Fulminante exige Perícia adquirida, Disciplina e arma equipada compatível; arremesso exige confirmação própria.");
  else{
   const target=pool.find(d=>d.group==="equipment"&&d.id.startsWith("equipment:"+weapon.id+":"));
   if(!target||![6,10,12].includes(target.sides))errors.push("Fulminante exige um dado da arma d6/d10/d12.");
   else{
    const original=target.sides;
    target.sides=original===6?10:12;target.fulminante=true;target.baseSides=original;
    if(original===12)pool.push({id:"fulminante:"+weapon.id,group:"equipment",
     key:weapon.name+" · Fulminante",sides:12,baseSides:12,fulminante:true});
   }
  }
 }
 if(draft.domarActivate&&(!state.smallCompanion?.present||!ownsSkill("domar-criatura-pequena")))
  errors.push("Auxílio do companheiro requer criatura Pequena domesticada presente.");
 if(draft.asura){
  const chosen=pool.find(d=>d.id===draft.asuraDieId);
  const weapon=state.items.find(item=>item.id===draft.equipmentId);
  const melee=!draft.equipmentId||(weapon?.type==="arma"&&weapon.equipped&&!weapon.firearm&&
    !((weapon.properties||[]).includes("À Distância"))&&Number(weapon.range||1)<=2);
  if(!ownsSkill("invocar-esfera-espiritual")||skillReq("invocar-esfera-espiritual")||sphereCount()<5||state.courage<1||
    state.spiritualSpheres.createdThisRound>0||!usingDiscipline()||draft.mode!=="armas"||draft.shieldThrowId||draft.cravarRemovalShieldId||draft.maosLeves||
    draft.magicElement||draft.shieldRaise||draft.potionResearch||!melee)
    errors.push("Asura exige 5 esferas preparadas em rodada anterior, 1 Coragem e golpe corpo a corpo com Disciplina.");
  if(!chosen||chosen.sides===20)errors.push("Selecione UM dado válido da pilha para transformar em d20 com Asura.");
  else{chosen.baseSides=chosen.sides;chosen.sides=20;chosen.asuraSpecial=true;}
 }
 if(pool.length>9)errors.push("A pilha ultrapassa o limite de 9 dados rolados.");
 const spellCost=draft.mode==="conjuracao"&&draft.magicElement?magicCourageCost():0;
 const totalPreparationCost=Number(draft.extraKeep)+Number(draft.step)+Number(!!draft.fulminante)+Number(!!draft.domarActivate)+spellCost+Number(!!draft.shieldThrowId)+
  (draft.mode==="conjuracao"&&draft.magicElement?lifeStage().coragem:0);
 if(totalPreparationCost>5)errors.push("Máximo de 5 Coragens por rolagem, incluindo Grau, amplificação e condição.");
 if(totalPreparationCost+Number(state.courageRoundSpent||0)>5)errors.push("Máximo de 5 Coragens por rodada. Confirme a próxima rodada antes de agir novamente.");
 if(totalPreparationCost>state.courage)errors.push("Coragem insuficiente para a magia e os custos de preparação.");
 if(draft.de<0||draft.de>30)errors.push("DE deve ficar entre 0 e 30.");
 if(draft.cravarRemovalShieldId){
  const shield=state.items.find(it=>it.id===draft.cravarRemovalShieldId&&it.type==="escudo"&&it.embeddedWeapon);
  if(!shield)errors.push("Escudo sem arma cravada para retirar.");
  if(!Number.isInteger(draft.de)||draft.de<1||draft.de>4)errors.push("Retirar Cravar exige DE de 1 a 4, correspondente ao peso da arma.");
  if(!draft.cravarRemovalDEConfirmed)errors.push("Confirme com o Narrador a DE correspondente ao peso da arma cravada.");
  if(![draft.base,draft.attribute,draft.third].some(src=>src&&((src.group==="attr"&&["forca","vigor"].includes(src.key))||(src.group==="practice"&&src.key==="atletismo"))))
   errors.push("Combine aptidões incluindo Força, Atletismo ou Vigor; não são permitidas fontes isoladas.");
  if(draft.weightEnabled||draft.shieldRaise||draft.equipmentId||draft.trevas)
   errors.push("Retirar Cravar é teste de remoção, sem afinidade de ataque, equipamento de ataque nem defesa simultânea.");
 }
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
   '<div class="fp-alert">Experimente <strong>Disciplina + Força</strong>. Com uma Perícia Avançada do Conhecimento ou Prática predominante, acrescente uma terceira fonte pertinente. A composição numérica pode ser igual, mas o tipo de teste muda.</div>'+
   (state.history.length?'<p class="fp-caption">Última ação: '+esc(state.history[0].name)+' · '+esc(state.history[0].outcome)+'</p>':"");
  return;
 }
 stat.textContent=draft.attribute?"Revisar antes de rolar":"Escolha um Atributo";
 const step='<div class="fp-selection-steps"><div class="fp-step-box base"><small>01 · BASE</small><strong>'+esc(label(draft.base.group,draft.base.key))+'</strong></div>'+
 '<div class="fp-step-box attr"><small>02 · '+(draft.maosLeves?"FURTIVIDADE":"ATRIBUTO")+'</small><strong>'+(draft.attribute?esc(label(draft.attribute.group,draft.attribute.key)):"Selecione...")+'</strong></div>'+
 '<div class="fp-step-box third"><small>03 · COMPLEMENTO</small><strong>'+(draft.third?esc(label(draft.third.group,draft.third.key)):"Opcional")+'</strong></div></div>';
 if(!draft.attribute){
  box.innerHTML=step+'<p class="fp-prepare-description">Escolha um Atributo na coluna à esquerda para completar a ação.</p>'+
   magicComposerFields()+
   '<div class="fp-composer-actions"><button type="button" class="fp-secondary" data-action="clear">Limpar seleção</button></div>';return;
 }
 if(usingDiscipline()&&!draft.maosLeves&&!draft.shieldThrowId&&!draft.equipmentId&&!(draft.mode==="conjuracao"&&draft.magicElement)){
  const eligible=state.items.filter(x=>combatItem(x,draft.mode).length>0);
  if(eligible.length===1)draft.equipmentId=eligible[0].id;
 }
 const {errors,pool}=buildPool(),cost=Number(draft.extraKeep)+Number(draft.step)+Number(!!draft.fulminante)+Number(!!draft.domarActivate)+(draft.mode==="conjuracao"&&draft.magicElement?magicCourageCost():0)+Number(!!draft.shieldThrowId)+lifeStage().coragem;
 const removalShield=draft.cravarRemovalShieldId?
  state.items.find(it=>it.id===draft.cravarRemovalShieldId&&it.type==="escudo"&&it.embeddedWeapon):null;
 const removalHint=draft.cravarRemovalShieldId?
  '<div class="fp-alert"><strong>RETIRAR CRAVAR — '+esc(removalShield?.name||"Escudo")+'</strong><p>Combine Força, Atletismo ou Vigor com outra aptidão pertinente. A DE depende do PESO DA ARMA cravada, máximo 4 — o Narrador informa a dificuldade; não há tabela numérica fixa aprovada.</p>'+
  '<label class="fp-checkline"><input type="checkbox" data-option="cravarRemovalDEConfirmed"'+
  (draft.cravarRemovalDEConfirmed?' checked':'')+'> Confirmo que o Narrador definiu a DE da arma (1 a 4)</label>'+
  '<p>Uma rolagem de retirada não é ataque, não causa dano e só remove a condição ao vencer a DE.</p></div>':"";
 const isShared=draft.base.group==="practice"&&draft.base.key==="armas_conjuracao";
 const usage=isShared?(draft.mode==="conjuracao"?"Disciplina · Conjuração":"Disciplina · Armas"):label(draft.base.group,draft.base.key);
 const canTrevas=isShared&&draft.mode==="conjuracao"&&ownsSkill("trevas");
 const select=(field,values,selected)=>'<select data-option="'+field+'">'+values.map(([id,name])=>'<option value="'+id+'"'+(selected===id?" selected":"")+'>'+esc(name)+'</option>').join("")+'</select>';
 const modes=[["armas","Disciplina — Armas"],["conjuracao","Disciplina — Conjuração"]];
 const weight=[["leve","Muito Leve / Leve"],["medio","Média"],["pesado","Pesada / Muito Pesada"]];
 const selectedItem=state.items.find(x=>x.id===draft.equipmentId);
 const throwingShield=!!draft.shieldThrowId;
 const spellSelection=draft.mode==="conjuracao"&&!!draft.magicElement;
 const gearOptions=throwingShield?"":spellSelection?magicComposerFields():
  usingDiscipline()?'<label class="fp-form-field full">Arma (dado extra somente de arma habilitada)'+
   select("equipmentId",[["","Sem dado adicional"],...state.items.filter(x=>x.equipped&&x.type==="arma")
     .map(x=>[x.id,x.name+(combatItem(x,draft.mode).length?" · "+combatItem(x,draft.mode).map(n=>"d"+n).join("+"):" · Perícia não habilitada")])],draft.equipmentId)+
   '</label>':"";
 const stepOptions=[draft.base,draft.attribute,...(draft.third?[draft.third]:[])].filter(source=>
  source&&(state[SOURCE_PROPS[source.group]]?.[source.key]||0)<6).map(source=>{
  const grade=state[SOURCE_PROPS[source.group]][source.key]||0;
  return [key(source),label(source.group,source.key)+" · "+describeDicePool(dataDice(source.group,grade))+
   " → "+describeDicePool(temporaryGradeDice(source.group,grade,true))];
 });
 const carriedShield=state.items.find(it=>it.type==="escudo"&&it.equipped);
 const shieldRaiseChoice=isShared&&draft.mode==="armas"&&carriedShield&&!throwingShield&&!draft.maosLeves?
  '<label class="fp-checkline full"><input type="checkbox" data-option="shieldRaise"'+
  (draft.shieldRaise?" checked":"")+'> Levantar Escudo físico'+
  (carriedShield.embeddedWeapon?' (arma cravada: −2E nesta ação)':'')+'</label>':"";
 const stealthCheckbox=ownsSkill("golpe-furtivo")&&isShared&&draft.mode==="armas"&&!draft.maosLeves&&!throwingShield?
  '<label class="fp-checkline full"><input type="checkbox" data-option="stealthAttack"'+(draft.stealthAttack?' checked':'')+'> Golpe Furtivo: ataque furtivo confirmado pelo Narrador (+1 dado da arma equipada)</label>':"";
 const potionCheckbox=ownsSkill("pesquisa-avancada-pocoes")&&!draft.maosLeves&&draft.mode!=="conjuracao"?
  '<label class="fp-checkline full"><input type="checkbox" data-option="potionResearch"'+(draft.potionResearch?' checked':'')+'> Pesquisa Avançada em Poções: confirme criação de poção (+1E; não vale em outras ações)</label>':"";
 const asuraControls=ownsSkill("invocar-esfera-espiritual")&&isShared&&draft.mode==="armas"&&!draft.maosLeves&&!throwingShield?
  '<label class="fp-checkline full"><input type="checkbox" data-option="asura"'+(draft.asura?' checked':'')+((sphereCount()<5||state.courage<1||state.spiritualSpheres.createdThisRound>0)&&!draft.asura?' disabled':'')+
   '> Punho Supremo de Asura: 5 esferas + 1 Coragem; substitui UM dado por d20 (somente corpo a corpo; d20 contribui para DE e dano básico; neutro)</label>'+
  (draft.asura?'<label class="fp-form-field full">Dado da pilha que se transforma em d20 '+
   select("asuraDieId",[["","Selecione um dado"],...pool.filter(d=>d.sides!==20||d.asuraSpecial).map(d=>[d.id,
     (d.asuraSpecial?"d"+d.baseSides:"d"+d.sides)+" · "+label(d.group,d.key)])],draft.asuraDieId)+'</label>':""):"";
 const fulminanteSkills=[
  ["golpe-fulminante","Golpe Fulminante"],["disparo-fulminante","Disparo Fulminante"]
 ].filter(([id])=>ownsSkill(id));
 const fulminanteControls=fulminanteSkills.length&&isShared&&draft.mode==="armas"?
  '<label class="fp-form-field full">Técnica Fulminante (1 Coragem, eleva 1 dado da arma) '+
  select("fulminante",[["","Não ativar"],...fulminanteSkills],draft.fulminante)+'</label>'+
  (ownsSkill("maestria-arremesso-armas")?
   '<label class="fp-checkline full"><input type="checkbox" data-option="attackThrown"'+
   (draft.attackThrown?' checked':'')+'> Ataque de arremesso (Disparo Fulminante)</label>':""):"";
 const companionControl=ownsSkill("domar-criatura-pequena")&&state.smallCompanion?.present?
  '<label class="fp-checkline full"><input type="checkbox" data-option="domarActivate"'+
  (draft.domarActivate?' checked':'')+'> Auxílio de '+esc(state.smallCompanion.name||"criatura Pequena")+
  ': 1 Coragem neste turno, +1A; serpente envenena alvo em Sangramento (estado manual)</label>':"";
 const checks=fulminanteControls+companionControl+asuraControls+potionCheckbox+stealthCheckbox+shieldRaiseChoice+'<label class="fp-checkline"><input type="checkbox" data-option="extraKeep"'+(draft.extraKeep?" checked":"")+'> Manter 1 dado adicional (1 Coragem)</label>'+
 '<label class="fp-form-field full">Elevar fonte em 1 Grau nesta rolagem (1 Coragem) '+select("stepSourceId",[["","Não elevar"],...stepOptions],draft.stepSourceId)+'</label>'+
 (throwingShield?"":'<label class="fp-checkline full"><input type="checkbox" data-option="weightEnabled"'+(draft.weightEnabled?" checked":"")+'> Aplicar afinidade de peso do ataque × armadura do alvo / porte natural (se pertinente)</label>')+
 (canTrevas?'<label class="fp-checkline full"><input type="checkbox" data-option="trevas"'+(draft.trevas?" checked":"")+'> Usar técnica de Trevas (+2P antes da DE; 1 Coragem no acerto)</label>':"")+
 "";
 const throwDetails=throwingShield?'<div class="fp-alert"><strong>ESCUDO BUMERANGUE — '+esc(state.items.find(it=>it.id===draft.shieldThrowId)?.name||"Escudo")+'</strong><p>Lançamento: 1 Coragem; Disciplina + Atributo(s), até 8 m, sem dado adicional de escudo. No acerto, dano físico normal, características da peça conforme custos/gatilhos e retorno no mesmo turno. Na falha, queda conforme Arremesso de Armas.</p><label class="fp-form-field">Distância do alvo (m) <input type="number" data-option="shieldThrowMeters" min="1" max="8" value="'+draft.shieldThrowMeters+'"></label></div>':"";
 const options=throwDetails+(draft.maosLeves?'<div class="fp-alert"><strong>MÃOS LEVES:</strong> exceção exclusiva de Disciplina + Furtividade. DE inimiga + Grau do item + peso somente se equipado. Não é ataque nem causa dano; o Narrador confirma retirada do item.</div>':"")+
 '<div class="fp-form-grid">'+(isShared&&!draft.maosLeves?'<label class="fp-form-field full">Uso da Prática compartilhada '+select("mode",modes,draft.mode)+'</label>':"")+(draft.maosLeves?"":gearOptions)+
 '<label class="fp-form-field">Dificuldade de Êxito <input data-option="de" type="number" min="0" max="30" value="'+draft.de+'"></label>'+
 '<label class="fp-form-field">Condição da ação '+select("situation",Object.entries(SITUATIONS).map(([k,v])=>[k,v[0]]),draft.situation)+'</label>'+
 (draft.weightEnabled?'<label class="fp-form-field">Peso tático do ataque '+select("attackWeight",[["leve","Leve"],["medio","Médio"],["pesado","Pesado"]],draft.attackWeight)+'</label><label class="fp-form-field">Armadura do alvo humanoide (ou porte de criatura) '+select("targetWeight",weight,draft.targetWeight)+'</label>':"")+
 checks+removalHint+'</div>';
 const poolHTML='<div class="fp-pill-row">'+pool.map(d=>'<span class="fp-pool-die">'+dieIcon(d.sides)+' d'+d.sides+' <span>'+esc(label(d.group,d.key))+'</span></span>').join("")+'</div>';
 box.innerHTML=step+'<div class="fp-prepare-title">'+esc(usage)+'</div><p class="fp-prepare-description">A Base determina o tipo de ação. Atributo e complemento não alteram sua natureza automaticamente.</p>'+
 options+(ownsSkill("manejo-perfeito")?'<p class="fp-caption"><strong>Manejo Perfeito:</strong> com arma equipada, declare a afinidade de peso contra o alvo para aplicar Vantagem Absoluta (substitui +1A natural). Se a condição já for Vantagem Absoluta, o rolador apenas registra Golpe Certo; resolução do efeito PENDENTE.</p>':"")+'<p class="fp-caption" style="margin-top:10px">Pilha: '+pool.length+'/9 dados · Retenção: '+keepLimit(false)+' ou '+keepLimit(true)+' com Coragem · Custo previsto: '+cost+' Coragem.</p>'+poolHTML+
 (draft.third?'<p class="fp-caption">Para trocar o complemento, escolha outra fonte pertinente. Com a Perícia Avançada da Base, pode acrescentar outra fonte pertinente, inclusive outro Atributo.</p>':
 '<p class="fp-caption">'+(mayThird()?"Uma terceira fonte pode ser acrescentada por clique, respeitando a habilitação e a confirmação contextual.":"Sem Perícia Avançada, são duas fontes; com a especialização Avançada da fonte predominante, pode selecionar até três fontes pertinentes.")+'</p>')+
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
 const precoPrevisto=health.coragem+Number(draft.extraKeep||0)+Number(draft.step||0)+Number(!!draft.fulminante)+Number(!!draft.domarActivate)+Number(!!draft.shieldThrowId)+
  (draft.mode==="conjuracao"&&draft.magicElement?magicCourageCost():0);
 if(precoPrevisto>5||precoPrevisto+Number(state.courageRoundSpent||0)>5){toast("Limite de 5 Coragens por rodada (e por rolagem) excedido.");return;}
 if(precoPrevisto>state.courage){toast("Coragem insuficiente: "+health.label+" e a preparação exigem "+precoPrevisto+" Coragem.");return;}
 if(editMode){toast("Conclua a edição antes de rolar.");return;}
 if(state.pending){toast("Uma rolagem anterior aguarda finalização.");return;}
 const data=buildPool();
 if(data.errors.length){toast(data.errors[0]);renderComposer();return;}
 state.pending={created:new Date().toISOString(),cravarRemovalShieldId:draft.cravarRemovalShieldId||"",
  shieldThrowId:draft.shieldThrowId||"",
  base:{...draft.base},attribute:{...draft.attribute},
  third:draft.third?{...draft.third}:null,mode:draft.mode,
  opts:{de:draft.de,fulminante:draft.fulminante,domarActivate:!!draft.domarActivate,maosLeves:!!draft.maosLeves,stealthAttack:!!draft.stealthAttack,potionResearch:!!draft.potionResearch,asura:!!draft.asura,situation:draft.situation,extraKeep:draft.extraKeep,step:draft.step,stepSourceId:draft.step?draft.stepSourceId:"",healthId:health.id,combatBonus:false,equipmentId:draft.equipmentId,
    weightEnabled:draft.weightEnabled,attackWeight:draft.attackWeight,targetWeight:draft.targetWeight,
    shieldRaise:!!draft.shieldRaise,trevas:!!draft.trevas,
    shieldThrowMeters:draft.shieldThrowId?draft.shieldThrowMeters:0,
    magicElement:draft.mode==="conjuracao"?draft.magicElement:"",
    magicGrade:draft.mode==="conjuracao"&&draft.magicElement?draft.magicGrade:0,
    magicFocusId:draft.mode==="conjuracao"?draft.magicFocusId:"",
    magicSecondElement:draft.mode==="conjuracao"&&draft.magicGrade===4?draft.magicSecondElement:"",
    magicSecondFocusId:draft.mode==="conjuracao"&&draft.magicGrade===4?draft.magicSecondFocusId:"",
    magicCharges:draft.mode==="conjuracao"?draft.magicCharges:0,
    magicAmplify:draft.mode==="conjuracao"&&!!draft.magicAmplify,
    magicGradeConfirmed:!!draft.magicGradeConfirmed,
    magicTimeConfirmed:draft.mode!=="conjuracao"||!draft.magicElement||magicPreparationTurns(draft.magicGrade,draft.magicCharges,!!magicSelectedFocus(),!!magicSelectedSecondFocus())===1},
  dice:data.pool.map(d=>({...d,face:randomFace(d.sides)})),selected:[],cancelP:0,pairs:0,pass:0,characteristic:"",secondCharacteristic:"",payment:"courage",
  cravarTargetShield:"",
  fireMode:"",fireGradeConfirmed:false};
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
 if(p.opts.asura){
  const converted=p.dice.filter(d=>d.asuraSpecial&&d.sides===20);
  const weapon=state.items.find(it=>it.id===p.opts.equipmentId);
  const melee=!p.opts.equipmentId||(weapon?.type==="arma"&&weapon.equipped&&!weapon.firearm&&
   !(weapon.properties||[]).includes("À Distância")&&Number(weapon.range||1)<=2);
  if(!ownsSkill("invocar-esfera-espiritual")||skillReq("invocar-esfera-espiritual")||sphereCount()<5||state.courage<1||
    p.base?.group!=="practice"||p.base?.key!=="armas_conjuracao"||p.mode!=="armas"||
    p.shieldThrowId||p.cravarRemovalShieldId||p.opts.magicElement||state.spiritualSpheres.createdThisRound>0||!melee||converted.length!==1)
    errs.push("Asura exige 5 esferas preparadas em rodada anterior, 1 Coragem, Disciplina corpo a corpo e dado convertido em d20.");
 }
 if(p.shieldThrowId){
  const shield=state.items.find(it=>it.id===p.shieldThrowId);
  if(!shieldBoomerangReady(shield))errs.push("Escudo Bumerangue inválido: escudo não equipado ou requisitos não atendidos.");
  if(p.base?.group!=="practice"||p.base?.key!=="armas_conjuracao"||p.mode!=="armas"||
    p.attribute?.group!=="attr"||(p.third&&p.third.group!=="attr"))
   errs.push("Escudo Bumerangue exige Disciplina (Armas) e Atributo(s) escolhido(s).");
  if(p.opts.shieldRaise||p.cravarRemovalShieldId||p.opts.equipmentId||p.opts.magicElement||p.opts.weightEnabled)
   errs.push("Arremesso de escudo não admite Levantar Escudo, dados de arma ou afinidade de peso; efeitos existentes do escudo seguem suas regras.");
  if(!Number.isInteger(p.opts.shieldThrowMeters)||p.opts.shieldThrowMeters<1||p.opts.shieldThrowMeters>8)
   errs.push("Escudo Bumerangue atinge no máximo 8 metros.");
 }
 if(p.cravarRemovalShieldId){
  const shield=state.items.find(it=>it.id===p.cravarRemovalShieldId&&it.type==="escudo"&&it.embeddedWeapon);
  if(!shield)errs.push("O escudo já não possui a arma cravada declarada.");
  if(!Number.isInteger(p.opts.de)||p.opts.de<1||p.opts.de>4)
   errs.push("A DE da arma cravada deve ficar entre 1 e 4.");
  if(![p.base,p.attribute,p.third].some(src=>src&&((src.group==="attr"&&["forca","vigor"].includes(src.key))||(src.group==="practice"&&src.key==="atletismo"))))
   errs.push("A retirada deve combinar aptidões incluindo Força, Atletismo ou Vigor.");
  if(p.characteristic||p.secondCharacteristic||p.opts.shieldRaise||p.opts.weightEnabled||p.opts.equipmentId||p.opts.trevas)
   errs.push("A retirada não é um ataque e não pode aplicar característica de arma, escudo ou magia ao mesmo tempo.");
 }
 if(p.opts.trevas&&!(p.mode==="conjuracao"&&p.base.group==="practice"&&p.base.key==="armas_conjuracao"&&ownsSkill("trevas")))
  errs.push("A técnica de Trevas exige Disciplina em Conjuração e Perícia em Elemento Trevas.");
 if(dice.length===0)errs.push("Selecione os dados que deseja manter.");
 if(dice.length>keepLimit(p.opts.extraKeep))errs.push("Limite de retenção excedido.");
 if(p.opts.potionResearch&&(!ownsSkill("pesquisa-avancada-pocoes")||skillReq("pesquisa-avancada-pocoes")||p.opts.maosLeves||p.mode==="conjuracao"))errs.push("Pesquisa de Poções inválida: +1E apenas no contexto de criar poções.");
 if(p.opts.maosLeves){
  if(!ownsSkill("maos-leves")||skillReq("maos-leves")||p.base?.group!=="practice"||p.base?.key!=="armas_conjuracao"||
   p.attribute?.group!=="practice"||p.attribute?.key!=="furtividade"||p.third||p.opts.equipmentId)
   errs.push("Mãos Leves não permite outras fontes nem equipamento; teste inválido.");
 }else if(!p.dice.some(x=>x.group==="attr"))errs.push("É obrigatório rolar pelo menos um dado de Atributo.");
 const raw=[0,0,0];
 for(const d of dice){const f=face(d.sides,d.face);for(let i=0;i<3;i++)raw[i]+=f[i];}
 if(p.opts.asura&&(p.characteristic==="Elemental"||p.secondCharacteristic==="Elemental"))errs.push("Asura causa sempre dano neutro: característica Elemental não aplicável.");
 const critTier=dice.length>=2&&dice.every(d=>d.face===d.sides)?dice.length:0;
 const criticalConverted=critTier&&raw[2]>0?1:0;
 const item=state.items.find(x=>x.id===(p.shieldThrowId||p.opts.equipmentId));
 const properties=item?.equipped?(item.properties||[]):[];
 const el=(item?.element||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
 const elementSkill={ar:"vento",vento:"vento",agua:"agua",fogo:"fogo",terra:"terra",
  veneno:"veneno",sagrado:"sagrado",trevas:"trevas",sangue:"sangue"}[el];
 // SRD v0.43: foco válido + Perícia do elemento + Criar Item de Foco e Magia.
 const freeElementEffect=p.mode==="conjuracao"&&item?.type==="foco"
  &&ownsSkill("criar-item-foco-magia")&&!!elementSkill&&ownsSkill(elementSkill);
 // v0.69: Barulhenta sempre concede +1P passivo, inclusive no crítico.
 const pBonus=properties.includes("Barulhenta")?1:0;
 // Perfurante de arma de fogo é passivo se a arma possui a propriedade.
 const passivePiercing=!!(item?.equipped&&item.firearm&&properties.includes("Perfurante"));
 const pAvailable=Math.max(0,raw[2]+pBonus+(p.opts.trevas?2:0)-criticalConverted+health.p);
 const situation=SITUATIONS[p.opts.situation]||SITUATIONS.normal;
 const w=p.opts.weightEnabled?affinity(p.opts.attackWeight,p.opts.targetWeight):0;
 // v0.87: Manejo Perfeito (ex-"Arma Certa") exige arma física equipada e alvo com Desvantagem.
 // Substitui somente o +1A natural deste confronto por Vantagem Absoluta (+1E).
 // Se a situação já é Vantagem Absoluta, sinaliza Golpe Certo sem inventar seu efeito.
 const manejoPerfeitoActive=ownsSkill("manejo-perfeito")&&p.mode==="armas"&&
  item?.type==="arma"&&item.equipped&&!p.opts.maosLeves&&!p.shieldThrowId&&w>0;
 const manejoPerfeitoGolpeCerto=manejoPerfeitoActive&&p.opts.situation==="absoluta";
 const eBase=Math.max(0,raw[0]+situation[1]+(manejoPerfeitoActive&&!manejoPerfeitoGolpeCerto?1:0)+criticalConverted+(critTier>=3?1:0)+
  (critTier&&properties.includes("Precisa")?1:0)+(p.opts.potionResearch?1:0));
 const stealthUsed=[p.base,p.third].some(x=>x?.group==="practice"&&x.key==="furtividade");
 const stealthBonus=stealthUsed&&ownsSkill("furtividade")?1:0;
 const aPool=Math.max(0,raw[1]+situation[2]+(manejoPerfeitoActive?0:w)+stealthBonus+Number(!!p.opts.domarActivate)+(critTier>=3?1:0)+
  (critTier&&properties.includes("Longa")?1:0)+(critTier&&properties.includes("Silenciosa")?1:0)+health.a);
 const cancel=clamp(Math.floor(p.cancelP),0,999),pairs=clamp(Math.floor(p.pairs),0,999),pass=clamp(Math.floor(p.pass),0,1);
 if(cancel>pAvailable)errs.push("Não há tantos Pavor restantes para anular.");
 const magicMixA=p.opts.magicElement&&Number(p.opts.magicGrade)===4?1:0;
 if(cancel+2*pairs+pass+magicMixA>aPool)errs.push("Antecipar insuficiente: G4 plena exige 1A de mistura além dos demais gastos.");
 // A penalidade de Saúde incide no total de Êxitos, inclusive após converter Antecipar.
 // v0.77: −2E somente quando a ação declarada é Levantar Escudo e o escudo carrega uma arma cravada.
 const raisedShield=state.items.find(it=>it.type==="escudo"&&it.equipped);
 if(p.opts.shieldRaise&&(!raisedShield||p.base?.group!=="practice"||p.base.key!=="armas_conjuracao"||p.mode!=="armas"))
  errs.push("Levantar Escudo exige Disciplina (Armas) e escudo físico equipado.");
 if(p.opts.shieldRaise&&(p.characteristic||p.secondCharacteristic||p.fireMode||p.hemomancyDirectLife))
  errs.push("Levantar Escudo consome uma ação: não é possível ativar simultaneamente Cravar, arma ou magia.");
 const shieldCravarPenalty=p.opts.shieldRaise&&raisedShield?.embeddedWeapon?2:0;
 const E=Math.max(0,eBase+pairs+health.e-shieldCravarPenalty),P=Math.max(0,pAvailable-cancel),remainingA=Math.max(0,aPool-cancel-2*pairs-pass-magicMixA);
 const reached=E+P,success=reached>=p.opts.de;
 const outcome=success?(P===0?"Acerto puro":P>E?"Acerto com Pavor predominante":"Acerto normal com Pavor")
 :(P===0?"Falha limpa":P>E?"Falha com Pavor predominante":"Falha com Pavor");
 const shieldThrowOutcome=p.shieldThrowId?shieldBoomerangResult(success,P,raw[0],
  Math.max(0,raw[2]-criticalConverted-cancel),pairs):null;
 let courageCost=Number(p.opts.extraKeep)+Number(p.opts.step)+Number(!!p.opts.fulminante)+Number(!!p.opts.domarActivate)+health.coragem+Number(!!p.shieldThrowId)+Number(!!p.opts.asura);
 if(p.mode==="conjuracao"&&p.opts.magicElement){
  const element=p.opts.magicElement,grade=Number(p.opts.magicGrade)||1;
  if(!magicKnownElements().some(([id])=>id===element))errs.push("Elemento da conjuração já não está habilitado.");
  if(grade>1&&!p.opts.magicGradeConfirmed)errs.push("Grau avançado não confirmado pelo Narrador.");
  if(magicPreparationTurns(grade,p.opts.magicCharges||0,!!p.opts.magicFocusId,!!p.opts.magicSecondFocusId)>1&&!p.opts.magicTimeConfirmed)
   errs.push("Turnos de conjuração não confirmados.");
  const focus=state.items.find(it=>it.id===p.opts.magicFocusId&&it.type==="foco"&&
   magicElementId(it.element||"psiquico")===element);
  if(p.opts.magicFocusId&&!focus)errs.push("Foco não corresponde ao elemento da magia.");
  const second=p.opts.magicSecondElement,focus2=state.items.find(it=>it.id===p.opts.magicSecondFocusId&&it.type==="foco"&&
   magicElementId(it.element||"psiquico")===second);
  if(grade===4){
   if(!second||second===element||!magicKnownElements().some(([id])=>id===second))
    errs.push("G4 exige dois elementos G3 diferentes e habilitados.");
   if(p.opts.magicSecondFocusId&&!focus2)errs.push("Segundo foco não corresponde ao segundo elemento.");
  }
  const maxCharges=grade===4?3:grade===3?2:grade===2?1:0;
  if(p.opts.magicCharges&&(p.opts.magicCharges>maxCharges||!focus||
     p.opts.magicCharges>(focus.focusCharges??focus.grade)||
     (grade===4&&(!focus2||p.opts.magicCharges>(focus2.focusCharges??focus2.grade)))))
   errs.push("Cargas insuficientes: G2 = 1 carga; G3 = até 2; G4 = pares de cargas dos dois focos.");
  if(p.opts.magicAmplify&&!focus)errs.push("Amplificação exige foco correspondente.");
  courageCost+=(grade===4?2:grade===3?1:0)+(p.opts.magicAmplify?1:0);
 }
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
    courageCost+=1;
   }
  }
 }else if(p.secondCharacteristic){errs.push("Escolha primeiro a característica principal.");}
 // v0.77: Cravar nunca é passivo. Requer DE, arma com característica, Médio/Pesado e
 // crítico OU a Perícia pertinente para acerto não crítico.
 const cravarChosen=[p.characteristic,p.secondCharacteristic].includes("Cravar");
 const weaponCategory=["medio","pesado"].includes(item?.category)?item.category:
  item?.weight==="medio"?"medio":["alto","extremo"].includes(item?.weight)?"pesado":"leve";
 const validCravarWeapon=item?.equipped&&item.type==="arma"&&!item.firearm&&
  p.mode==="armas"&&["medio","pesado"].includes(weaponCategory)&&properties.includes("Cravar");
 const cravarSpecialty=weaponCategory==="medio"?"armas-medias":"armas-pesadas";
 if(cravarChosen&&success){
  if(!validCravarWeapon)errs.push("Cravar requer arma física Média ou Pesada equipada, com a característica Cravar.");
  if(!critTier&&!ownsSkill(cravarSpecialty))errs.push("Sem crítico, Cravar exige Perícia em Armas Médias ou Pesadas correspondente.");
  if(!["leve","medio","pesado"].includes(p.cravarTargetShield))
   errs.push("Para Cravar, confirme a categoria do escudo físico levantado pelo alvo.");
  if(p.cravarTargetShield==="pesado"&&weaponCategory!=="pesado")
   errs.push("Escudo Pesado ou Muito Pesado só pode ser cravado por arma Pesada.");
 }
 const cravarApplied=!!(cravarChosen&&success&&active.includes("Cravar")&&validCravarWeapon&&
  (critTier||ownsSkill(cravarSpecialty))&&["leve","medio","pesado"].includes(p.cravarTargetShield)&&
  (p.cravarTargetShield!=="pesado"||weaponCategory==="pesado"));
 // Gasto de Trevas preservado no acerto; em falha o custo/ordem permanece pendente no SRD.
 if(p.opts.trevas&&success&&!freeElementEffect){courageCost+=1;}
 // v0.76: os Graus de Fogo ainda dependem de validação manual pelo Narrador.
 const fireMode=["queimar","derreter"].includes(p.fireMode)?p.fireMode:"";
 const isFireCast=ownsSkill("fogo")&&p.mode==="conjuracao"&&p.base?.group==="practice"&&
  p.base.key==="armas_conjuracao"&&
  // Foco explicitamente de outro elemento não pode ser usado como foco de Fogo.
  !(item?.type==="foco"&&elementSkill&&elementSkill!=="fogo");
 if(p.fireMode&&!fireMode)errs.push("Manifestação de Fogo não reconhecida nesta rolagem.");
 if(fireMode&&!isFireCast)errs.push("Queimar/Derreter exigem conjuração de Fogo habilitada, não ataque de outra natureza.");
 if(fireMode&&p.opts.magicElement&&p.opts.magicElement!=="fogo")errs.push("Efeito de Fogo exige elemento Fogo declarado.");
 if(fireMode&&p.opts.magicGrade&&Number(p.opts.magicGrade)!==(fireMode==="derreter"?3:2))
  errs.push("Grau da magia deve coincidir com Queimar G2 ou Derreter G3.");
 if(fireMode&&!p.fireGradeConfirmed)errs.push("Confirme com o Narrador o acesso a este Grau de Fogo antes de ativar.");
 if(fireMode&&p.hemomancyDirectLife)errs.push("A mesma magia não pode ser registrada simultaneamente como Fogo e como Hemomancia direta.");
 const fireValid=!!(fireMode&&isFireCast&&p.fireGradeConfirmed&&!p.hemomancyDirectLife);
 // A Perícia Fogo habilita G1/G2 sem cobrança. G3 Derreter consome
 // 1 Coragem ao ativar com sucesso, independentemente de foco.
 // G4 é conjuração conjunta (dois G3) e não está automatizada neste compositor.
 if(fireValid&&success&&fireMode==="derreter"&&p.opts.magicGrade!==3)courageCost+=1;
 if(courageCost>5)errs.push("Máximo de 5 Coragens por rolagem, incluindo efeitos ativados.");
 if(courageCost+Number(state.courageRoundSpent||0)>5)errs.push("Máximo de 5 Coragens por rodada, somando todas as ativações.");
 if(courageCost>state.courage)errs.push("Coragem insuficiente para a rolagem e ativações.");
 const critRecovery=critTier>=3?2:critTier>=2?1:0;
 // O d20 de Asura mantido compõe E/P tanto na DE quanto no dano básico; nunca rolar dano extra.
 const damageBasic=success?E+Math.floor(P/2):0;
 const fulminanteDamageBasic=success&&p.opts.fulminante?E+P:damageBasic;
 // Perfurante NÃO atravessa armadura: P vale 1 dano apenas no cálculo de Integridade.
 // Se o alvo não tiver armadura, ou Perfurante for bloqueado por escudo, vale o dano básico.
 const damage=p.opts.maosLeves||p.cravarRemovalShieldId?0:fulminanteDamageBasic*(critTier===4?2:1); // Escudo Bumerangue: dano físico básico normal, incluindo crítico.
 // v0.76: Queimar usa E+P na Integridade, inclusive o crítico de 4 mantidos;
 // Derreter acrescenta só +1 Vida FIXA, não multiplicada no crítico.
 const fireArmorDamage=fireValid?(success?(E+P)*(critTier===4?2:1):0):null;
 const fireDirectLifeDamage=fireValid&&fireMode==="derreter"?(success?1:0):null;
 // v0.74: somente UMA rolagem de magia de Sangue, vinculada a um pagamento já realizado.
 const hemomancy=state.hemomancy||{};
 const mayHemomancyDirectLife=ownsSkill("sangue")&&p.mode==="conjuracao"&&p.base?.group==="practice"&&
  p.base.key==="armas_conjuracao"&&hemomancy.usedThisTurn&&
  hemomancy.boostKind==="direct-life"&&!hemomancy.directLifeResolved&&
  // Foco explicitamente de outro elemento impede vincular dano direto de Sangue.
  !(item?.equipped&&item.type==="foco"&&elementSkill&&elementSkill!=="sangue");
 if(p.hemomancyDirectLife&&!mayHemomancyDirectLife)errs.push("Dano direto de Hemomancia exige a conjuração de Sangue paga neste turno e um vínculo ainda não utilizado.");
 const hemomancyLinked=mayHemomancyDirectLife&&p.hemomancyDirectLife===true;
 // v0.75: apenas Escudo Arcano de Sangue ativo e aplicável anula o bypass.
 // Escudo físico ou arcano de qualquer outro elemento não neutraliza Hemomancia direta.
 const bloodArcaneShieldNeutralized=hemomancyLinked&&!!p.targetBloodArcaneShield;
 const directLifeDamage=hemomancyLinked&&!bloodArcaneShieldNeutralized?damage:null;
 // Quando o Escudo de Sangue neutraliza a propriedade, resolver dano convencional
 // contra a barreira e proteções pelo Narrador (sem dano integral direto automático).
 const armorDamage=hemomancyLinked||fireValid?null:success&&active.includes("Perfurante")?(E+P)*(critTier===4?2:1):null;
 return{dice,raw,E,P,remainingA,reached,success,outcome,shieldThrowOutcome,health,shieldCravarPenalty,cravarApplied:cravarApplied&&errs.length===0,cravarTargetShield:cravarApplied&&errs.length===0?p.cravarTargetShield:null,damage,damageBasic,damageNature:p.opts.asura?"neutro":(elementSkill||""),armorDamage,fireMode:fireValid?fireMode:"",fireArmorDamage,fireDirectLifeDamage,directLifeDamage,mayHemomancyDirectLife,hemomancyLinked,bloodArcaneShieldNeutralized,passivePiercing,errors:errs,
  aPool,courageCost,active,range:p.shieldThrowId?8:item?.range?effectiveWeaponRange(item)+(success&&active.includes("Muito Leve")?4:0):0,pAvailable,critTier,critRecovery,criticalConverted,freeElementEffect,elementSkill,
   manejoPerfeitoActive:!!manejoPerfeitoActive,manejoPerfeitoGolpeCerto:!!manejoPerfeitoGolpeCerto};
}
function renderPending(){
 const p=state.pending,s=score(),de=p.opts.de,cost=s.courageCost;
 const manejoPerfeitoSummary=s.manejoPerfeitoActive?'<div class="fp-alert"><strong>MANEJO PERFEITO:</strong> '+
  (s.manejoPerfeitoGolpeCerto?'A ação já estava em Vantagem Absoluta: gatilho de <strong>Golpe Certo</strong> registrado. Seu efeito numérico está PENDENTE e não foi acrescentado ao resultado.':
   'Confronto favorável com arma equipada: <strong>Vantagem Absoluta (+1E)</strong> aplicada no lugar do +1A natural de afinidade.')+'</div>':"";
 const asuraSummary=p.opts.asura?
 '<div class="fp-alert"><strong>Punho Supremo de Asura:</strong> um dado da pilha foi transformado em <strong>d20</strong> em golpe corpo a corpo com Disciplina. <strong>5 Esferas Espirituais + 1 Coragem reservadas</strong>; consumidas ao finalizar a rolagem, mesmo em falha. Os símbolos do d20 mantido entram na DE e no dano básico, sem dano extra. Natureza neutra.</div>':"";
 const magicWait=p.opts.magicElement&&!p.opts.magicTimeConfirmed?
   '<div class="fp-alert"><strong>Conjuração em preparação.</strong> Os dados já foram rolados e os símbolos são conhecidos. Pavor mantido oferece ao inimigo oportunidade de revidar, fugir ou tentar interromper, conforme o Narrador; não é cancelamento automático.</div>'+
   '<button type="button" class="fp-secondary" data-action="magic-preparation-complete">Confirmar preparação cumprida com o Narrador</button>':"";
 const magicSummary=p.opts.magicElement?
  '<div class="fp-alert"><strong>Conjuração: '+esc(magicKnownElements().find(([id])=>id===p.opts.magicElement)?.[1]||p.opts.magicElement)+' G'+p.opts.magicGrade+
  '</strong> '+(p.opts.magicSecondElement?" + "+esc(magicKnownElements().find(([id])=>id===p.opts.magicSecondElement)?.[1]||p.opts.magicSecondElement):"")+
  ' · '+magicPreparationTurns(p.opts.magicGrade,p.opts.magicCharges||0,!!p.opts.magicFocusId,!!p.opts.magicSecondFocusId)+' turno(s) · '+(p.opts.magicCharges||0)+
  (Number(p.opts.magicGrade)===4?' par(es) de cargas (2 focos)':' carga(s) do foco')+
  ' reservadas; custos efetivos ao finalizar. '+(Number(p.opts.magicGrade)===4?'Mistura G4: 1A + 2 Coragens. ':'')+
  'Amplificação: '+(p.opts.magicAmplify?"declarada":"não")+" (sem bônus numérico automático).</div>":"";

 const desc=esc(label(p.base.group,p.base.key))+" + "+esc(label(p.attribute.group,p.attribute.key))+
  (p.third?" + "+esc(label(p.third.group,p.third.key)):"");
 const dice='<div class="fp-rolled-dice">'+p.dice.map(d=>'<button type="button" class="fp-roll-die fp-die-d'+d.sides+' '+(p.selected.includes(d.id)?"kept":"")+'" data-action="keep" data-id="'+esc(d.id)+'" title="Face '+d.face+' do d'+d.sides+'" aria-label="'+esc(label(d.group,d.key))+' · d'+d.sides+' · face '+d.face+'" aria-pressed="'+p.selected.includes(d.id)+'">'+dieIcon(d.sides)+
  '<strong class="fp-face-runes" aria-hidden="true">'+faceRunesMarkup(face(d.sides,d.face),d.face===d.sides)+'</strong><span class="fp-die-source">'+esc(label(d.group,d.key))+' · d'+d.sides+'</span><span class="fp-symbol-line">'+symbolMarkup(face(d.sides,d.face),d.face===d.sides)+'</span></button>').join("")+'</div>';
 const selectNumber=(k,labelText,max,value)=>'<label class="fp-form-field">'+labelText+'<select data-pending="'+k+'">'+
 Array.from({length:Math.max(1,max+1)},(_,i)=>'<option value="'+i+'"'+(Number(value)===i?" selected":"")+'>'+i+'</option>').join("")+'</select></label>';
 const item=state.items.find(x=>x.id===(p.shieldThrowId||p.opts.equipmentId));
 const specials=(item?.properties||[]).filter(x=>ACTIVE_PROPERTIES.has(x)&&!(item?.firearm&&x==="Perfurante")&&!(p.shieldThrowId&&x==="Cravar"));
 const chooseEffect=(field,description,selected)=>'<label class="fp-form-field">'+description+'<select data-pending="'+field+'">'+
  [['','Nenhuma'],...specials.map(x=>[x,x])].map(([id,label])=>'<option value="'+esc(id)+'"'+(id===selected?" selected":"")+'>'+esc(label)+'</option>').join("")+'</select></label>';
 const cravarChosen=[p.characteristic,p.secondCharacteristic].includes("Cravar");
 const cravarSelector=cravarChosen?
  '<label class="fp-form-field full">Escudo físico do alvo a ser cravado<select data-pending="cravarTargetShield">'+
  [['','Selecione a categoria do escudo (exigido no acerto)'],['leve','Leve / Muito Leve'],['medio','Médio'],['pesado','Pesado / Muito Pesado']].map(([v,l])=>'<option value="'+v+'"'+(p.cravarTargetShield===v?' selected':'')+'>'+l+'</option>').join("")+'</select></label>'+
  '<p class="fp-caption">Cravar requer arma Média/Pesada, DE atingida e crítico OU Perícia pertinente. Sem crítico: 1 Coragem. Não altera automaticamente a ficha do defensor; registre a arma presa no escudo dele.</p>':"";
 const effects=specials.length?'<div class="fp-form-grid">'+
  chooseEffect("characteristic","Característica escolhida",p.characteristic||"")+
  (s.critTier?chooseEffect("secondCharacteristic","Segunda característica (só no crítico)",p.secondCharacteristic||""):"")+
  '<p class="fp-caption">Ativação paga, quando necessária: 1 Coragem. Crítico: uma característica grátis e outra paga.</p></div>'+
  '<p class="fp-caption">Acerto comum: uma característica por 1 Coragem. Efeitos G1/G2 habilitados têm ativação-base gratuita. Narrador aplica danos e condições.</p>'+cravarSelector:"";
 const trevasPayment=p.opts.trevas&&!specials.length?(s.freeElementEffect?
  '<p class="fp-caption">Trevas: efeito habilitado gratuito.</p>':
  '<p class="fp-caption">Trevas: ativação paga no acerto custa 1 Coragem.</p>'):'';
 const hemoControl=s.mayHemomancyDirectLife?
  '<div class="fp-alert"><strong>Amplificação de Sangue já paga</strong> · disponível para uma rolagem de magia de Sangue neste turno. '+
  '<button type="button" class="fp-secondary" data-action="hemo-link-roll" aria-pressed="'+(!!p.hemomancyDirectLife)+'">'+
  (p.hemomancyDirectLife?'✓ Vinculada: magia de Sangue amplificada':'Vincular esta rolagem à magia de Sangue amplificada')+'</button>'+
  (p.hemomancyDirectLife?'<button type="button" class="fp-secondary" data-action="hemo-target-shield" aria-pressed="'+(!!p.targetBloodArcaneShield)+'">'+
   (p.targetBloodArcaneShield?'✓ Escudo Arcano de Sangue ativo no alvo':'Alvo tem Escudo Arcano de Sangue ativo?')+'</button>':"")+
  '<p class="fp-caption">Escudos físicos e arcanos de outros elementos não anulam o dano direto à Vida. Somente Escudo Arcano de Sangue ativo e aplicável neutraliza essa propriedade. Sem foco, confirme que a magia é de Sangue com o Narrador. Após finalizar, não pode vincular outra rolagem neste turno.</p></div>':"";
 const fireChoices=p.mode==="conjuracao"&&p.base?.group==="practice"&&p.base.key==="armas_conjuracao"&&ownsSkill("fogo");
 const fireControl=fireChoices?
  '<div class="fp-alert"><strong>Fogo G2/G3 — Queimar ou Derreter (v0.76)</strong>'+
  '<label class="fp-form-field">Efeito declarado<select data-pending="fireMode">'+
   '<option value=""'+(!p.fireMode?' selected':'')+'>Nenhum / Fogo G1 convencional</option>'+
   '<option value="queimar"'+(p.fireMode==="queimar"?' selected':'')+'>G2 Queimar — E+P à Integridade</option>'+
   '<option value="derreter"'+(p.fireMode==="derreter"?' selected':'')+'>G3 Derreter — E+P à Integridade e +1 Vida direta</option></select></label>'+
  (p.fireMode?
   '<label class="fp-checkline"><input type="checkbox" data-pending="fireGradeConfirmed"'+(p.fireGradeConfirmed?' checked':'')+
   '> Confirmo com o Narrador que este Grau de Fogo está habilitado (não é compra automática)</label>'+
   '<p class="fp-caption">Fogo G2 Queimar: 0 Coragem com Perícia e Grau habilitados, inclusive sem foco quando houver fonte elemental disponível. Fogo G3 Derreter: 1 Coragem. G4 plena (dois G3): 1 Coragem por elemento elevado + 1 Antecipar de mistura; a composição G4 ainda é manual.</p>'+
   '<p class="fp-caption">O dano de Derreter é à armadura + 1 Vida fixa, não o dano completo à Vida. Imunidades, área e excedente ficam sujeitos ao Narrador.</p>'
  :'')+'</div>':"";
 const controls='<div class="fp-form-grid">'+
 selectNumber("cancelP","Anular Pavor (1A por 1P)",Math.min(s.pAvailable,s.aPool),p.cancelP)+
 selectNumber("pairs","Converter 2A em 1E",Math.floor(s.aPool/2),p.pairs)+
 selectNumber("pass","Passar ação ao aliado (1A)",1,p.pass)+'</div>'+effects+trevasPayment+hemoControl+fireControl;
 const criticalNote=s.critTier?'<div class="fp-alert"><strong>Crítico de '+s.critTier+' dados mantidos!</strong> '+
  (s.criticalConverted?'1P convertido em 1E. ':'Sem Pavor próprio para converter. ')+
  (s.critTier>=3?'+1E e +1A. ':'')+
  'Recuperação de até '+s.critRecovery+' Coragem (respeitando o teto). '+
  (s.critTier===4?'Dano básico dobrado; interação com proteções ainda pendente. ':'')+'</div>':'';
 const stats='<div class="fp-outcome"><h4>'+esc(s.outcome)+'</h4>'+criticalNote+'<div class="fp-outcome-stats">'+
 '<div class="fp-outcome-stat">DE alcançada<b>'+s.reached+' / '+de+'</b></div>'+
 '<div class="fp-outcome-stat"><span class="fp-rune fp-rune-e">Êxito ᛋ</span><b>'+s.E+'</b></div>'+
 '<div class="fp-outcome-stat"><span class="fp-rune fp-rune-a">Antecipar ᚨ</span><b>'+s.remainingA+'</b></div>'+
 '<div class="fp-outcome-stat"><span class="fp-rune fp-rune-p">Pavor ᚦ</span><b>'+s.P+'</b></div></div>'+
 (p.cravarRemovalShieldId?'<p class="fp-caption"><strong>RETIRAR CRAVAR — '+(s.success?'SUCESSO':'FALHA')+':</strong> '+s.reached+' contra DE '+p.opts.de+
  '. '+(s.success?'Ao finalizar, a arma será retirada do escudo e sua carga/penalidade serão removidas.':'A arma permanecerá cravada no escudo.')+
  ' Não é ataque e não causa dano; Pavor continua produzindo risco.</p>':
  (p.shieldThrowId?'<p class="fp-caption"><strong>ESCUDO BUMERANGUE:</strong> Ataque de Disciplina + Atributo(s), até 8 m. <strong>'+(s.shieldThrowOutcome?.returned?'ACERTO — escudo retorna no mesmo turno, mesmo com Pavor.':'FALHA — escudo cai no chão; '+(s.shieldThrowOutcome?.where==='caminho'?'queda no caminho, 1A pode permitir correr e recuperar.':'queda próxima ao alvo; pode atingir aliado próximo se alcançar a DE dele.')+' Distância de queda: '+s.shieldThrowOutcome?.distance+' m (E mantidos + P não anulado + E convertido por 2A).')+'</strong> Dano físico básico no acerto: <strong>'+s.damage+'</strong> (Êxitos válidos + piso(Pavor/2), crítico normal). Características da peça só se existirem e forem habilitadas; Pavor conserva seus riscos. A situação será registrada ao finalizar.</p>':'<p class="fp-caption" style="margin-top:9px">Dano básico se acertar: '+s.damage+'. Pavor não anulado conserva o risco e a transferência pertinente.</p>'))+
 (s.directLifeDamage!==null?'<p class="fp-caption"><strong>HEMOMANCIA — TODO O DANO À VIDA:</strong> '+s.directLifeDamage+' ponto(s) (dano calculado, sem passar pela Integridade da armadura nem escudo físico/arcano de outro elemento). Falha na DE = 0. Marcas de Sangue apenas pela Vida efetivamente perdida.</p>':"")+
 (s.bloodArcaneShieldNeutralized?'<p class="fp-caption"><strong>ESCUDO ARCANO DE SANGUE:</strong> propriedade de atingir diretamente a Vida neutralizada. '+s.damage+' de dano convencional potencial para resolver contra o Escudo Arcano de Sangue e demais proteções, incluindo imunidades e desgaste conforme o Narrador. Não aplicar '+s.damage+' automaticamente à Vida; o pagamento da amplificação não é reembolsado.</p>':"")+
 (s.fireArmorDamage!==null?'<p class="fp-caption"><strong>FOGO '+(s.fireMode==="derreter"?'G3 — DERRETER':'G2 — QUEIMAR')+':</strong> '+
  s.fireArmorDamage+' dano potencial à Integridade (E + 1 por P não anulado'+(s.critTier===4?'; crítico dobrando o dano à Integridade':'')+'). '+
  (s.fireMode==="derreter"?'Acrescenta exatamente <strong>'+s.fireDirectLifeDamage+' Vida direta</strong>, mesmo contra armadura, não multiplicada no crítico.':'<strong>0 Vida direta adicional</strong> por Queimar.')+
  ' O Narrador resolve imunidades, outras barreiras e eventual excedente convencional; sem alteração automática de ficha adversária.</p>':"")+
 (s.cravarApplied?'<p class="fp-caption"><strong>CRAVAR — ESCUDO FÍSICO:</strong> arma '+(p.opts.equipmentId?esc(item?.name||"Média/Pesada"):'Média/Pesada')+
  ' fica presa ao escudo '+(s.cravarTargetShield==="pesado"?'Pesado':s.cravarTargetShield==="medio"?'Médio':'Leve')+
  ' do alvo. Na ficha do defensor, marque Cravar no escudo: <strong>−2E ao Levantar Escudo</strong> e peso da arma enquanto carregar o conjunto. Não atinge Vida por si só.</p>':"")+
 (p.opts.shieldRaise?'<p class="fp-caption"><strong>LEVANTAR ESCUDO:</strong> Integridade simbólica E + P válidos = '+(s.E+s.P)+
  ' ('+s.E+'E + '+s.P+'P). '+(s.shieldCravarPenalty?'Arma cravada: <strong>−2E aplicado</strong> apenas nesta ação.':'Sem penalidade de Cravar no escudo equipado.')+'</p>':"")+
 (s.armorDamage!==null?'<p class="fp-caption"><strong>Perfurante à Integridade:</strong> '+s.armorDamage+' dano potencial (E + 1 por P não anulado; crítico quando aplicável). Não ignora a armadura nem concede dano extra direto à Vida. Se bloqueado por escudo pertinente, usar dano básico. '+(s.passivePiercing?'Característica passiva da arma de fogo, sem ativação.':'Característica ativada conforme custo normal.')+'</p>':'')+
 (p.opts.trevas?'<p class="fp-caption"><strong>Trevas:</strong> +2P já incluídos na DE; se houver dois alvos, a mesma rolagem deve ser confrontada com cada DE. Divida o Pavor residual o mais igualmente possível (ponto ímpar a alvo escolhido) ou concentre tudo em um alvo; registre manualmente, sem duplicar pontos.</p>':'')+
 (s.active.length?'<p class="fp-caption"><strong>Característica(s) ativada(s):</strong> '+s.active.map(esc).join(", ")+'. Resolver efeitos com Narrador.</p>':'')+'</div>';
 return '<div class="fp-alert"><strong>Resultado já sorteado.</strong> '+desc+'. A rolagem ficará salva até ser finalizada ou descartada explicitamente.</div>'+magicSummary+magicWait+asuraSummary+manejoPerfeitoSummary+
 '<p class="fp-caption" style="margin:11px 0">Mantenha até '+keepLimit(p.opts.extraKeep)+' dados à sua escolha. Atributo é obrigatório na rolagem, não entre os mantidos. '+s.dice.length+' selecionado(s). Saúde: '+esc(s.health.label)+
  ' ('+(s.health.e?s.health.e+'E ':'')+(s.health.a?s.health.a+'A ':'')+(s.health.p?'+'+s.health.p+'P':'')+
  '). Custo previsto: '+cost+' Coragem (inclui ativações escolhidas).</p>'+dice+controls+
 (s.dice.length?stats:"<p class=\"fp-caption\" style=\"margin-top:10px\">Clique nos dados que deseja manter. Só eles geram símbolos.</p>")+
 s.errors.filter(x=>x!=="Selecione os dados que deseja manter.").map(x=>'<div class="fp-alert invalid">'+esc(x)+'</div>').join("")+
 (s.dice.length&&!s.errors.length?"":'<div class="fp-alert">A finalização só fica disponível após uma retenção válida.</div>')+
 '<div class="fp-composer-actions"><button class="fp-secondary" data-action="discard" type="button">Descartar teste...</button>'+
 '<button class="fp-primary-btn" data-action="finalize" type="button"'+(s.errors.length?" disabled":"")+'>Finalizar ação</button></div>';
}
function finalize(){
 const p=state.pending,s=score();
 if(!p||s.errors.length){toast(s?.errors?.[0]||"Rolagem inválida.");return;}
 if(p.opts.asura){
  if(sphereCount()<5||state.spiritualSpheres.createdThisRound>0){toast("Asura exige 5 esferas preparadas e execução em uma rodada posterior.");return;}
  state.spiritualSpheres.count=sphereCount()-5; // Gasta cinco na conclusão da rolagem especial.
 }
 state.courage=clamp(state.courage-s.courageCost,0,maxCourage());
 state.courageRoundSpent=clamp((state.courageRoundSpent||0)+s.courageCost,0,5);
 const oldCourage=state.courage;
 if(s.critRecovery)state.courage=clamp(state.courage+s.critRecovery,0,maxCourage());
 const gainedCourage=state.courage-oldCourage;
 // As cargas de foco são consumidas pela conjuração concluída, mesmo se a DE falhar.
 const usedFocus=p.opts.magicFocusId?state.items.find(it=>it.id===p.opts.magicFocusId&&it.type==="foco"):null;
 if(usedFocus&&p.opts.magicCharges)usedFocus.focusCharges=Math.max(0,(usedFocus.focusCharges??usedFocus.grade)-p.opts.magicCharges);
 const secondUsedFocus=p.opts.magicSecondFocusId?state.items.find(it=>it.id===p.opts.magicSecondFocusId&&it.type==="foco"):null;
 if(Number(p.opts.magicGrade)===4&&secondUsedFocus&&p.opts.magicCharges)
  secondUsedFocus.focusCharges=Math.max(0,(secondUsedFocus.focusCharges??secondUsedFocus.grade)-p.opts.magicCharges);
 const baseName=p.base.group==="practice"&&p.base.key==="armas_conjuracao"?"Disciplina ("+(p.mode==="conjuracao"?"Conjuração":"Armas")+")":label(p.base.group,p.base.key);
 const name=(p.opts.asura?"Punho Supremo de Asura · ":p.opts.maosLeves?"Mãos Leves · ":p.shieldThrowId?"Escudo Bumerangue · ":p.cravarRemovalShieldId?"Retirar Cravar · ":"")+baseName+" + "+label(p.attribute.group,p.attribute.key)+(p.third?" + "+label(p.third.group,p.third.key):"");
 const removalShield=p.cravarRemovalShieldId?state.items.find(it=>it.id===p.cravarRemovalShieldId&&it.type==="escudo"&&it.embeddedWeapon):null;
 const removalSuccess=!!(removalShield&&s.success);
 const thrownShield=p.shieldThrowId?state.items.find(it=>it.id===p.shieldThrowId&&it.type==="escudo"):null;
 if(thrownShield&&s.shieldThrowOutcome?.grounded){
  thrownShield.equipped=false;thrownShield.shieldGrounded=true;
  thrownShield.shieldFallCase=s.shieldThrowOutcome.where;
  thrownShield.shieldFallMeters=s.shieldThrowOutcome.distance;
 }
 state.history.unshift({date:new Date().toISOString(),name,outcome:s.outcome,de:p.opts.de,reached:s.reached,
  cravarRemovalAttempt:!!p.cravarRemovalShieldId,cravarRemovalSuccess:removalSuccess,cravarRemovalShieldName:removalShield?.name||"",
  shieldThrowId:p.shieldThrowId||"",shieldThrowMeters:p.opts.shieldThrowMeters||0,
  shieldThrowReturned:!!s.shieldThrowOutcome?.returned,shieldThrowFallCase:s.shieldThrowOutcome?.grounded?s.shieldThrowOutcome.where:"",shieldThrowFallMeters:s.shieldThrowOutcome?.distance??null,
  asura:!!p.opts.asura,asuraSpheresSpent:p.opts.asura?5:0,asuraCourageSpent:p.opts.asura?1:0,asuraD20Face:p.opts.asura?(p.dice.find(d=>d.asuraSpecial&&d.sides===20)?.face??null):null,asuraNeutral:!!p.opts.asura,E:s.E,A:s.remainingA,P:s.P,critTier:s.critTier,critConverted:s.criticalConverted,item:state.items.find(x=>x.id===p.opts.equipmentId)?.name||"",active:s.active,
  courageRecovered:gainedCourage,magicElement:p.opts.magicElement||"",magicGrade:p.opts.magicGrade||0,
  magicFocusName:usedFocus?.name||"",magicChargesSpent:p.opts.magicCharges||0,magicAmplify:!!p.opts.magicAmplify,
  magicSecondElement:p.opts.magicSecondElement||"",magicSecondFocusName:secondUsedFocus?.name||"",
  magicSecondChargesSpent:Number(p.opts.magicGrade)===4?(p.opts.magicCharges||0):0,magicG4MixASpent:Number(p.opts.magicGrade)===4?1:0,
  magicPreparationTurns:p.opts.magicGrade?magicPreparationTurns(p.opts.magicGrade,p.opts.magicCharges||0,!!p.opts.magicFocusId,!!p.opts.magicSecondFocusId):0,
  cravarApplied:s.cravarApplied,cravarTargetShield:s.cravarTargetShield,shieldCravarPenalty:s.shieldCravarPenalty,damage:s.damage,armorDamage:s.armorDamage,fireMode:s.fireMode,fireArmorDamage:s.fireArmorDamage,fireDirectLifeDamage:s.fireDirectLifeDamage,directLifeDamage:s.directLifeDamage,bloodArcaneShieldNeutralized:s.bloodArcaneShieldNeutralized,health:s.health.id,trevas:!!p.opts.trevas,
   manejoPerfeitoActive:!!s.manejoPerfeitoActive,golpeCertoTriggered:!!s.manejoPerfeitoGolpeCerto,
  faces:s.dice.map(d=>({id:d.id,sides:d.sides,face:d.face}))});
 // Uma conjuração vinculada consome a oportunidade também quando neutralizada pelo Escudo de Sangue.
 if(s.hemomancyLinked)state.hemomancy.directLifeResolved=true;
 if(removalSuccess)removalShield.embeddedWeapon=""; // Remover −2E e massa extra somente após sucesso
 state.history=state.history.slice(0,20);state.pending=null;save();render();
 toast(p.shieldThrowId?(s.shieldThrowOutcome?.returned?
  "Escudo Bumerangue acertou e retornou no mesmo turno. Pavor mantém seus riscos.":
  "Escudo Bumerangue falhou e caiu "+(s.shieldThrowOutcome?.where==="caminho"?"no caminho":"próximo ao alvo")+". Recupere conforme Arremesso de Armas; ficou desequipado."):
  p.cravarRemovalShieldId?(removalSuccess?"Sucesso: arma retirada do escudo; carga e penalidade atualizadas.":"Falha: arma permanece cravada no escudo."):
  (s.critTier?"Crítico de "+s.critTier+" dados! · ":"")+s.outcome+" · DE "+s.reached+"/"+p.opts.de);
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
 if(!["life","courage"].includes(resource)||![-1,1].includes(Number(delta)))return;
 if(resource==="courage"&&delta<0&&state.courage>0){
  if((state.courageRoundSpent||0)>=5){toast("Já gastou 5 Coragens nesta rodada.");return;}
  state.courageRoundSpent=(state.courageRoundSpent||0)+1;
 }
 const max=resource==="life"?maxLife():maxCourage();
 state[resource]=clamp(state[resource]+delta,0,max);renderVitals();save();
}
// Mãos Leves: exceção deliberada e EXCLUSIVA à combinação usual de fontes.
function prepareMaosLeves(){
 if(!ownsSkill("maos-leves")||skillReq("maos-leves")||state.pending||editMode){
  toast("Mãos Leves requer a Perícia, seus requisitos e nenhuma rolagem/edição pendente.");return;
 }
 const ask=(question,min,max)=>{
  const value=prompt(question);
  if(value===null)return null;
  const n=Number(value.trim());
  if(!value.trim()||!Number.isInteger(n)||n<min||n>max){toast("Informe um número inteiro válido.");return null;}
  return n;
 };
 const de=ask("Mãos Leves: DE defensiva do inimigo (0 a 30).",0,30);if(de===null)return;
 const grade=ask("Grau da arma, escudo ou armadura que pretende retirar (1 a 4).",1,4);if(grade===null)return;
 const equipped=confirm("O item está EQUIPADO? Em caso negativo, o peso NÃO aumenta a DE.");
 let weight=0;
 if(equipped){
  const answer=ask("Peso do item EQUIPADO a somar à DE: Leve = 1, Médio = 2. Outros pesos: use o valor confirmado pelo Narrador (0 a 30).",0,30);
  if(answer===null)return;weight=answer;
 }
 const finalDe=de+grade+weight;
 if(finalDe>30){toast("DE calculada acima do teto configurável do rolador (30). Confirme a resolução manual com o Narrador.");return;}
 draft=freshDraft();draft.maosLeves=true;draft.mode="armas";
 draft.base={group:"practice",key:"armas_conjuracao"};
 draft.attribute={group:"practice",key:"furtividade"};draft.de=finalDe;
 sheetPage="play";render();save();
 $("composer-content")?.scrollIntoView?.({behavior:"smooth",block:"start"});
 toast("Mãos Leves: DE "+de+" + Grau "+grade+(equipped?" + peso "+weight:" + peso 0 (não equipado)")+" = "+finalDe+". Teste sem dano; Narrador confirma retirada.");
}
function prepareArmadilha(){
 if(!ownsSkill("pericia-armadilha")||skillReq("pericia-armadilha")||state.pending||editMode){toast("Perícia em Armadilha indisponível: confira a compra e finalize qualquer rolagem.");return;}
 if(!confirm("Preparar teste para ARMAR ou DESARMAR armadilha, com Proteção e Vantagem (+1A), conforme contexto confirmado pelo Narrador?"))return;
 draft=freshDraft();draft.mode="normal";draft.situation="vantagem";
 draft.base={group:"know",key:"protecao"};
 draft.attribute={group:"attr",key:(state.attributes.destreza||0)>0?"destreza":"inteligencia"};
 sheetPage="play";render();save();$("composer-content")?.scrollIntoView?.({behavior:"smooth",block:"start"});
 toast("Teste de armadilha: Proteção + Atributo, Vantagem (+1A). Ajuste a DE informada pelo Narrador.");
}
function sphereCount(){return clamp(Math.floor(state.spiritualSpheres?.count||0),0,5);}
function logSkillAction(name,outcome){
 state.history.unshift({date:new Date().toISOString(),name,outcome,de:0,reached:0,E:0,A:0,P:0,faces:[],damage:0});
 state.history=state.history.slice(0,20);
}
function renderSkills(){
 const bar=$("skills-filterbar");if(bar&&!bar.firstChild)bar.innerHTML=skillFilterControls();
 const defensiveNotes=(ownsSkill("sacrificio-heroico")?'<p class="fp-alert"><strong>Sacrifício Heroico:</strong> proteja alguém a até 8 m, mesmo sem antecipação de seu turno. O dano segue para sua armadura ou Vida, conforme o Narrador; não é um ataque adicional.</p>':"")+
  (ownsSkill("escudo-refletor")?'<p class="fp-alert"><strong>Escudo Refletor:</strong> com escudo físico equipado, reflita ao inimigo apenas o dano efetivo da parcela de Pavor do ataque recebido. Não diminui o golpe original; proteções e resultado devem ser resolvidos pelo Narrador.</p>':"")+
  (ownsSkill("transformacao-elemental")&&ownsSkill("sagrado")?'<p class="fp-alert"><strong>Aura Sagrada:</strong> ao assumir efetivamente a forma Sagrada, pessoas a até 3 m recebem +1 Coragem, até o próprio teto. É um efeito da Transformação Elemental; não se repete automaticamente a cada turno. Registre o efeito nas fichas.</p>':"")+
  (ownsSkill("sentido-elemental")?'<p class="fp-alert"><strong>Sentido Elemental:</strong> gaste 1 Coragem para analisar um alvo e conhecer sua afinidade elemental (informada pelo Narrador). <button type="button" class="fp-secondary" data-action="sentido-elemental-use"'+(state.pending||state.courage<1?' disabled':'')+'>Analisar alvo (−1 Coragem)</button></p>':"");
 const antimagicNotes=(ownsSkill("cancelar-magia")?'<p class="fp-alert"><strong>Cancelar Magia:</strong> magia percebida a até 8 m, com pelo menos 1 Pavor mantido. Requer sua Perícia no elemento e 1 Coragem para alcançar resultado <strong>igual ou maior (≥)</strong> que a DE declarada da conjuração (todos os valores mantidos); empate cancela. <button type="button" class="fp-secondary" data-action="cancelar-magia-use"'+(state.pending||state.courage<1||editMode?' disabled':'')+'>Declarar tentativa (−1 Coragem)</button> A ficha registra a tentativa; o teste e a anulação devem ser resolvidos com o Narrador.</p>':"")+
  (ownsSkill("mudanca-elemental")?'<p class="fp-alert"><strong>Mudança Elemental:</strong> altere o elemento de criatura, armadura ou ambiente até 8 m para um elemento cuja Perícia já possui. Duração <strong>E − P, com E − P > 0</strong>. Unidade de duração, resistência e custo de ativação pendentes; efeito manual.</p>':"")+
  (ownsSkill("desencantar")?'<p class="fp-alert"><strong>Desencantar:</strong> remova elementos ou imunidades até 8 m, inclusive em itens encantados. Não remove o elemento natural de criatura constituída desse elemento; não exclua objetos nem criaturas automaticamente.</p>':"")+
  (ownsSkill("espelho-magico")?'<p class="fp-alert"><strong>Espelho Mágico:</strong> passivo. Reflita ao conjurador a parcela de <strong>dano mágico de Pavor mantido, antes da armadura absorver ou anular</strong>; funciona mesmo quando a armadura bloqueia tudo. Não funciona contra ataque físico. Aplicação manual; não confundir com Escudo Refletor.</p>':"");
 const newSkillNotes=[
  ownsSkill("maos-leves")?'<p class="fp-alert"><strong>Mãos Leves:</strong> teste excepcional de Disciplina + Furtividade para tirar arma, escudo ou armadura de inimigo em combate. DE inimiga + Grau + peso somente se equipado. <button type="button" class="fp-secondary" data-action="maos-leves-prepare"'+(state.pending||editMode?' disabled':'')+'>Calcular DE e preparar teste</button> A retirada do inventário inimigo é confirmada pelo Narrador.</p>':"",
  ownsSkill("pericia-armadilha")?'<p class="fp-alert"><strong>Perícia em Armadilha:</strong> Vantagem (+1A) para armar/desarmar armadilhas com Proteção. <button type="button" class="fp-secondary" data-action="armadilha-prepare"'+(state.pending||editMode?' disabled':'')+'>Preparar Proteção + Vantagem</button></p>':"",
  ownsSkill("golpe-furtivo")?'<p class="fp-alert"><strong>Golpe Furtivo:</strong> marque «Golpe Furtivo» no rolador de Disciplina + Atributo durante ataque furtivo com arma habilitada: +1 dado da arma, máximo de 9 dados rolados.</p>':"",
  ownsSkill("bioetica")?'<p class="fp-alert"><strong>Bioética:</strong> requer Destreza 3, confirmada. Homúnculo elemental de carne feito com DNA de duas criaturas, sangue e tecidos vivos, usa <strong>ficha própria</strong> com XP e custos por porte conforme Domar Criaturas, acompanhando o XP total do criador. <a href="../criar-conflito/" target="_blank" rel="noopener noreferrer">Abrir Criar Conflito para montar ficha própria</a>. Porte, quantidades dos materiais e procedimento de criação ainda não definidos.</p>':"",
  ownsSkill("pesquisa-avancada-pocoes")?'<p class="fp-alert"><strong>Pesquisa Avançada em Poções:</strong> +1E em testes para criar poções e habilita poções elementais. Receitas e valores pendentes; marque a criação de poções no rolador para somar +1E, sem alterar outras ações.</p>':"",
  ownsSkill("corpo-fechado")?'<p class="fp-alert"><strong>Corpo Fechado:</strong> por 1 Coragem, Vitalidade protegida de danos e efeitos de golpes com armas físicas por 1 rodada. <button type="button" class="fp-secondary" data-action="corpo-fechado-use"'+(state.pending||state.courage<1||editMode?' disabled':'')+'>Ativar (−1 Coragem)</button> A rodada e os ataques são resolvidos manualmente.</p>':"",
  ownsSkill("invocar-esfera-espiritual")?'<p class="fp-alert"><strong>Esferas Espirituais:</strong> <strong>'+sphereCount()+'/5</strong> armazenadas; <strong>'+state.spiritualSpheres.createdThisRound+'/5</strong> criadas nesta rodada. <strong>1 Coragem = 1 esfera</strong>. <button type="button" class="fp-secondary" data-action="sphere-create"'+(state.pending||state.spiritualSpheres.createdThisRound>=5||sphereCount()>=5||state.courage<1||editMode?' disabled':'')+'>Criar esfera (−1 Coragem)</button> <button type="button" class="fp-secondary" data-action="sphere-next-round"'+(!state.spiritualSpheres.createdThisRound||state.pending||editMode?' disabled':'')+'>Confirmar próxima rodada</button> <strong>Punho Supremo de Asura:</strong> com 5 esferas e 1 Coragem, selecione a técnica no rolador de Disciplina corpo a corpo, escolha UM dado para trocar por d20; os 6 recursos são consumidos na conclusão. Os símbolos do d20 mantido contam para acerto e dano básico, sem parcela extra; dano neutro.</p>':"",
  ownsSkill("passo-etereo")?'<p class="fp-alert"><strong>Passo Etéreo:</strong> 1 esfera para deslocamento rápido de até 8 m. <button type="button" class="fp-secondary" data-action="sphere-spend" data-id="passo-etereo"'+(sphereCount()<1||state.pending||editMode?' disabled':'')+'>Usar Passo Etéreo (−1 esfera)</button></p>':"",
  ownsSkill("absorver-esferas")?'<p class="fp-alert"><strong>Absorver Esferas:</strong> consome <strong>TODAS</strong> as esferas e recupera a mesma quantidade de Coragem, até o teto. <button type="button" class="fp-secondary" data-action="sphere-absorb"'+(sphereCount()<1||state.pending||editMode?' disabled':'')+'>Absorver '+sphereCount()+' esferas</button></p>':"",
  ownsSkill("disparo-esferas-espirituais")?'<p class="fp-alert"><strong>Disparo de Esferas Espirituais:</strong> ataque físico a distância, 1 esfera por golpe. <button type="button" class="fp-secondary" data-action="sphere-spend" data-id="disparo-esferas-espirituais"'+(sphereCount()<1||state.pending||editMode?' disabled':'')+'>Declarar disparo (−1 esfera)</button> DE, alcance e dados pendentes; ataque manual.</p>':"",
  ownsSkill("dilema")?'<p class="fp-alert"><strong>Dilema:</strong> pacto imobiliza a si e ao adversário até um dos dois ficar inconsciente. Ativação e resistência pendentes; não altera a ficha inimiga automaticamente.</p>':"",
  ownsSkill("impacto-psiquico")?'<p class="fp-alert"><strong>Impacto Psíquico:</strong> golpe psíquico que pode usar efeitos de arma por 1 Coragem. <button type="button" class="fp-secondary" data-action="impacto-psiquico-use"'+(state.pending||state.courage<1||editMode?' disabled':'')+'>Declarar golpe (−1 Coragem)</button> Dados e efeitos concretos dependem do Narrador.</p>':""
 ].join("");
 const fireResistanceNote=ownsSkill("resistencia-a-fogo")?'<p class="fp-alert"><strong>Resistência pessoal a Fogo ativa:</strong> metade do dano de Fogo que atingir a <strong>Vida</strong> do portador; <strong>0 dano direto à Vida por Derreter G3</strong>. <strong>Não reduz dano à Integridade da armadura.</strong> Aplicação numérica manual; frações pendentes.</p>':"";
 $("skills-list").innerHTML=defensiveNotes+antimagicNotes+newSkillNotes+fireResistanceNote+(filteredSkills().map(item=>skillCompactCard(item,false)).join("")||'<div class="fp-skill-empty">Nenhuma Perícia corresponde aos filtros.</div>');
 $("weapon-focus-wrap").hidden=true;
 $("weapon-focus").value=state.weaponFocus;
 $("weapon-focus").disabled=(state.creationLocked&&!editMode)||!!state.pending;
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
 const count=$("inventory-quick-items"),equipped=$("inventory-quick-equipped"),quickLoad=$("inventory-quick-load");
 if(count)count.textContent=String(state.items.length);
 if(equipped)equipped.textContent=String(state.items.filter(it=>it.equipped).length);
 if(quickLoad)quickLoad.textContent=pad(load)+" / "+max+" Alto";
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
  $("inventory-capacity-equation").textContent="1 + ⌊(Força "+(state.attributes.forca||0)+" + Vigor "+(state.attributes.vigor||0)+" + Atletismo "+(state.practices.atletismo||0)+") / 3⌋ = "+max+" Alto · somar os três graus antes de dividir";
  const overflow=$("inventory-cargo-overflow");
  overflow.hidden=!(load>max);
  overflow.textContent=load>max?"Capacidade excedida em "+pad(load-max)+" Alto. Nenhuma nova penalidade foi definida.":"";
 }
 const filterSelect=(opts,current,attribute)=>'<select '+attribute+'>'+opts.map(([id,label])=>
  '<option value="'+id+'"'+(current===id?' selected':'')+'>'+esc(label)+'</option>').join("")+'</select>';
 $("inventory-filterbar").innerHTML='<div class="fp-equip-filters"><label>Tipo '+
  filterSelect(EQUIPMENT_FAMILIES,inventoryType,'data-inventory-type aria-label="Filtrar inventário por tipo"')+'</label>'+
  '<label>Peso '+filterSelect(EQUIPMENT_WEIGHT_OPTIONS,inventoryWeight,'data-inventory-weight aria-label="Filtrar inventário por peso"')+'</label>'+
  '<span class="fp-filter-count">'+state.items.filter(it=>equipmentMatches(it,inventoryType,inventoryWeight)).length+' de '+state.items.length+' itens</span></div>';
 const openedItems=new Set([...document.querySelectorAll('#inventory-list details.fp-item[open]')].map(x=>x.dataset.itemId));
 const listedItems=state.items.filter(it=>equipmentMatches(it,inventoryType,inventoryWeight))
  .sort((a,b)=>EQUIPMENT_FAMILIES.findIndex(x=>x[0]===equipmentFamily(a))-
    EQUIPMENT_FAMILIES.findIndex(x=>x[0]===equipmentFamily(b))||
    EQUIPMENT_WEIGHT_OPTIONS.findIndex(x=>x[0]===equipmentWeight(a))-
    EQUIPMENT_WEIGHT_OPTIONS.findIndex(x=>x[0]===equipmentWeight(b))||a.name.localeCompare(b.name,"pt-BR"));
 let previousGroup="";
 $("inventory-list").innerHTML=listedItems.length?listedItems.map(it=>{
  const types=[["arma","Arma"],["armadura","Armadura"],["escudo","Escudo"],["foco","Foco"],["ferramenta","Ferramenta"],["outro","Outro"]];
  const canResist1=it.weight==="extremo"?it.grade>=2:(it.weight==="alto"||it.weight==="medio")?it.grade>=2:it.grade>=3;
  const canResist2=it.weight==="alto"&&it.grade>=3;
  const canImmunize=it.weight==="extremo"&&it.grade>=4;
  const shieldEmbedFields=it.type!=="escudo"?"":(
   '<div class="fp-item-hint"><label><strong>Arma cravada no escudo:</strong> '+
   inventorySelect("embeddedWeapon",it.embeddedWeapon||"",
    [["","Nenhuma"],...(["alto","extremo"].includes(it.weight)?[]:[["medio","Arma Média"]]),["pesado","Arma Pesada"]],it.id)+
   '</label></div>'+
   (it.embeddedWeapon?'<div class="fp-item-hint"><strong>Cravar ativo:</strong> −1E por arma cravada em Levantar Escudo (registro de múltiplas armas pendente); '+
    'carga adicional de '+pad(WEIGHTS[it.embeddedWeapon==="pesado"?"alto":"medio"][1])+
    ' Alto enquanto o escudo permanecer carregado. <button type="button" class="fp-secondary" data-action="cravar-remove-prepare" data-id="'+esc(it.id)+'">Tentar retirar a arma (teste)</button>'+
    ' <small>O campo acima permite corrigir erros de cadastro; para retirar em jogo use o teste. Soltar escudo: retire o item da carga.</small></div>':"")
  );
  const cravarImpact=it.type!=="escudo"?"":(
   '<div class="fp-item-hint"><label><strong>Cravar ativo contra este escudo:</strong> Êxitos mantidos <input type="number" data-cravar-exitos min="1" max="32" value="1" style="width:55px"></label> '+
   '<button type="button" class="fp-secondary" data-action="cravar-impact" data-id="'+esc(it.id)+'">Aplicar perda de Integridade</button> '+
   '<small>Apenas quando o ataque acertou e Cravar foi ativada conforme a Perícia. -1 Integridade por Êxito. Não implica remoção automática das armas cravadas.</small></div>'
  );
  const armorFields=it.type!=="armadura"?"":(
   (it.weight==="muito_leve"?'<div class="fp-item-hint"><strong>Muito Leve G1:</strong> 2 de Integridade e +2 DE em todas as defesas (valores corrigidos).</div>':"")+
   (it.weight==="leve"?'<div class="fp-item-hint"><strong>Leve:</strong> +1 DE em todas as defesas; resistência disponível desde Grau 3.</div>':"")+
   (it.weight==="medio"?'<div class="fp-item-hint"><strong>Média:</strong> 0 DE; resistência específica desde Grau 2.</div>':"")+
   (it.weight==="alto"?'<div class="fp-item-hint"><strong>Pesada:</strong> −1 DE; resistência no Grau 2, segunda resistência no Grau 3.</div>':"")+
   (it.weight==="extremo"?'<div class="fp-item-hint"><strong>Muito Pesada:</strong> −2 DE, exige Vigor 6/Atletismo 6 e tem imunidade física em QUALQUER Grau. G4 pode acumular imunidade elemental sobre a resistência de G2.</div>':"")+
   (canResist1?`<div class="fp-item-hint"><label>Resistência elemental da peça: <input type="text" data-item-field="elementalResistance" data-id="${esc(it.id)}" value="${esc(it.elementalResistance)}" maxlength="70" placeholder="Elemento autorizado"></label></div>`:"")+
   (canResist2?`<div class="fp-item-hint"><label>Segunda resistência (Pesada Grau 3+): <input type="text" data-item-field="secondResistance" data-id="${esc(it.id)}" value="${esc(it.secondResistance)}" maxlength="70" placeholder="Outro elemento da peça"></label></div>`:"")+
   (canImmunize?`<div class="fp-item-hint"><label>Imunidade elemental adicional (Muito Pesada G4): <input type="text" data-item-field="specificImmunity" data-id="${esc(it.id)}" value="${esc(it.specificImmunity)}" maxlength="70" placeholder="Elemento específico; soma à resistência"></label></div>`:"")+
   '<div class="fp-item-hint">Acesso por Grau: G1 desde nível 1 · G2 desde 5 · G3 desde 10 · G4 desde 20. Integridade G1 do catálogo: Muito Leve 2, Leve 5, Média 8, Pesada 12 (valores de playtest). Nos graus superiores sem valor documentado, Integridade PENDENTE.</div>'
  );
  const shieldIntegrity=it.type==="escudo"?shieldIntegrityDisplay(it):null;
  const shieldMasteryHint=it.type!=="escudo"?"":(
   (shieldMasteryActive(it)?'<div class="fp-item-hint"><strong>Maestria em Escudos ativa:</strong> +1 DE defensiva (teto 12) e +1 Integridade neste escudo: '+shieldIntegrity.hp+' / '+shieldIntegrity.max+' efetivos. Valor-base: '+it.hp+' / '+it.max+'. Ponto adicional '+(it.shieldMasteryBonusSpent?'já consumido (reparo manual necessário).':'disponível.')+' Não altera a Integridade simbólica de Levantar Escudo.</div>':"")+
   (it.shieldGrounded?'<div class="fp-item-hint"><strong>Escudo no chão:</strong> '+(it.shieldFallCase==="caminho"?"Caiu no caminho. 1 Antecipar pode permitir correr e recuperar, conforme Narrador.":"Caiu próximo ao alvo; pode haver risco de atingir aliado próximo se alcançou a DE dele.")+' Distância calculada da queda: '+it.shieldFallMeters+' m. <button class="fp-secondary" type="button" data-action="shield-ground-recover" data-id="'+esc(it.id)+'">Confirmar recuperação (Narrador)</button></div>':"")+
   (ownsSkill("escudo-bumerangue")?'<div class="fp-item-hint"><strong>Escudo Bumerangue:</strong> '+(shieldBoomerangReady(it)?'Escudo equipado e habilitado: Disciplina + Atributo(s), até 8 m. Acerto retorna no mesmo turno; falha deixa no chão. <button class="fp-secondary" type="button" data-action="shield-throw-prepare" data-id="'+esc(it.id)+'">Preparar lançamento</button>':it.shieldGrounded?'Recupere o escudo caído antes de lançar novamente.':'Equipe este escudo para preparar a rolagem de lançamento.')+' 1 Coragem para lançar; dano físico normal no acerto e características existentes conforme habilitação. Recuperação condicionada ao resultado.</div>':"")
  );
  const group=equipmentGroupName(equipmentFamily(it))+" · "+equipmentWeightName(equipmentWeight(it));
  const groupTitle=previousGroup===group?"":'<h5 class="fp-shop-group-title">'+esc(group)+'</h5>';
  previousGroup=group;
  const stats=equipmentDetails(it);
  return groupTitle+'<details class="fp-item fp-item-compact" data-item-id="'+esc(it.id)+'"'+(openedItems.has(it.id)?' open':'')+'>'+
  '<summary class="fp-item-summary">'+codexItemIcon(it)+'<strong>'+esc(it.name)+'</strong>'+
  '<small>'+esc(stats)+'</small><span class="fp-inventory-status">'+(it.shieldGrounded?'No chão':it.equipped?'Equipado':'Guardado')+'</span></summary>'+
  '<div class="fp-item-editor"><div class="fp-inventory-name">'+codexItemIcon(it)+
  '<input type="text" value="'+esc(it.name)+'" data-id="'+esc(it.id)+'" data-item-field="name" maxlength="90" aria-label="Nome do item"></div>'+
  inventorySelect("type",it.type,types,it.id)+
  inventorySelect("weight",it.weight,Object.entries(WEIGHTS).map(([id,values])=>[id,values[0]]),it.id)+
  '<div class="fp-item-controls"><button type="button" data-action="integrity" data-id="'+esc(it.id)+'" data-delta="-1" aria-label="Reduzir integridade">−</button><b title="Integridade atual / máxima">Integridade '+(shieldIntegrity?shieldIntegrity.hp:it.hp)+' / '+(shieldIntegrity?shieldIntegrity.max:it.max)+'</b>'+
  '<button type="button" data-action="integrity" data-id="'+esc(it.id)+'" data-delta="1" aria-label="Aumentar integridade">+</button>'+
  '<button type="button" class="'+(it.equipped?"fp-item-equipped":"")+'" data-action="equip" data-id="'+esc(it.id)+'" title="Equipar/guardar">'+(it.equipped?"✓":"○")+'</button>'+
  '<button type="button" data-action="delete-item" data-id="'+esc(it.id)+'" title="Excluir item">×</button></div>'+
  '<div class="fp-item-hint"><label>Grau <input type="number" data-item-field="grade" data-id="'+esc(it.id)+'" min="1" max="4" value="'+it.grade+'" style="width:40px"></label> · '+
  '<label>Qtd. <input type="number" data-item-field="qty" data-id="'+esc(it.id)+'" min="1" max="99" value="'+it.qty+'" style="width:44px"></label> · '+
  '<label>Integridade máxima '+(it.type==="escudo"?'(base) ':'')+'<input type="number" data-item-field="max" data-id="'+esc(it.id)+'" min="0" max="999" value="'+it.max+'" style="width:50px" '+""+'> </label>'+
  ' · '+(it.equipped?"Equipado":"No inventário")+'</div>'+
   '<div class="fp-item-hint">Ocupa '+pad(itemLoad(it))+' Alto · '+pad(itemLoad(it)/Math.max(1,capacity())*100)+'% da capacidade de carga</div>'+
  (it.die?'<div class="fp-item-hint"><b>Dado:</b> d'+it.die+' (somente com Perícia pertinente)'+
   ' · <b>Alcance efetivo:</b> '+effectiveWeaponRange(it)+' m'+(effectiveWeaponRange(it)>it.range?' (base '+it.range+' m + Olhos de Águia)':'')+'</div>':'')+
  (weaponMasteryId(it)&&ownsSkill(weaponMasteryId(it))?'<div class="fp-item-hint"><strong>Maestria por tipo de arma:</strong> '+(weaponMasteryCanActivate(it)?'Arma habilitada: acerto comum = 1 característica grátis; crítico = até 2 diferentes grátis, podendo gastar 1 Coragem para uma terceira. Apenas características existentes na arma.':'Ativação gratuita indisponível: falta Perícia de Armas/manejo apropriada para este equipamento ou peso não definido.')+' Não concede Perícias de Armas, nem ativa efeitos automaticamente.</div>':"")+ 
  (it.properties?.length?'<div class="fp-item-hint"><b>Características:</b> '+it.properties.map(esc).join(", ")+'</div>':'')+
  (it.catalogId&&it.type!=="foco"?'<div class="fp-item-hint"><b>Preço de referência:</b> '+it.priceVT+' VT (playtest)</div>':'')+
  (it.type==="foco"?'<div class="fp-item-hint fp-focus-charge-editor"><strong>Foco elemental</strong> · <label>Elemento <select data-item-field="element" data-id="'+esc(it.id)+'">'+
   [["psiquico","Psíquico"],["fogo","Fogo"],["agua","Água"],["vento","Ar"],["terra","Terra"],["sagrado","Sagrado"],["sangue","Sangue"],["trevas","Trevas"],["veneno","Veneno"]]
   .map(([id,name])=>'<option value="'+id+'"'+(magicElementId(it.element||"psiquico")===id?" selected":"")+'>'+name+'</option>').join("")+
   '</select></label> · <label>Cargas atuais <input type="number" data-item-field="focusCharges" data-id="'+esc(it.id)+'" min="0" max="'+it.grade+'" value="'+(it.focusCharges??it.grade)+'"></label>'+
   ' / '+it.grade+' <button type="button" class="fp-secondary" data-action="focus-round" data-id="'+esc(it.id)+'"'+((it.focusCharges??it.grade)>=it.grade?" disabled":"")+'>Encerrar rodada: +1 carga</button>'+
   '<small>Recarga gradual manual no fim de cada rodada; Pedra da Alma não recarrega naturalmente.</small></div>':"")+
  (it.packSize>0?'<div class="fp-item-hint"><label><b>Munição restante no lote:</b> <input type="number" data-item-field="ammoRemaining" data-id="'+esc(it.id)+'" min="0" max="'+it.packSize+'" value="'+it.ammoRemaining+'" style="width:62px"> / '+it.packSize+' · controle manual</label></div>':'')+
  (it.storageCapacity>0?'<div class="fp-item-hint"><b>Capacidade:</b> até '+it.storageCapacity+' munições (armazenamento manual)</div>':'')+
  (it.description?'<div class="fp-item-hint">'+esc(it.description)+'</div>':'')+
  armorFields+shieldMasteryHint+shieldEmbedFields+cravarImpact+'</div></details>';
 }).join(""):'<div class="fp-empty-list">'+(state.items.length?'Nenhum item corresponde aos filtros.':'Nenhum item cadastrado. Use <strong>+ Item</strong> para simular equipamento e carga.')+'</div>';
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
 const listOptions=(options,value)=>options.map(([id,label])=>'<option value="'+id+'"'+(id===value?' selected':'')+'>'+esc(label)+'</option>').join("");
 $("trade-shop-type").innerHTML=listOptions(EQUIPMENT_FAMILIES,tradeShopType);
 $("trade-shop-weight").innerHTML=listOptions(EQUIPMENT_WEIGHT_OPTIONS,tradeShopWeight);
 const catalog=CATALOG.filter(x=>x.kind!=="focus"&&x.category!=="pendente"&&Number(x.priceVT)>0)
  .filter(x=>equipmentMatches(x,tradeShopType,tradeShopWeight))
  .sort((a,b)=>EQUIPMENT_FAMILIES.findIndex(x=>x[0]===equipmentFamily(a))-
    EQUIPMENT_FAMILIES.findIndex(x=>x[0]===equipmentFamily(b))||a.name.localeCompare(b.name,"pt-BR"));
 const currentShop=$("shop-items").value,currentPreferred=$("shop-preferred").value;
 $("trade-shop-count").textContent=catalog.length+" opções";
 let prevFamily="";
 $("shop-items").innerHTML='<option value="">Escolha um equipamento</option>'+catalog.map(x=>{
  const family=equipmentFamily(x);
  const group=family!==prevFamily?'</optgroup><optgroup label="'+esc(equipmentGroupName(family))+'">':'';
  prevFamily=family;
  return group+'<option value="'+esc(x.name)+'">'+esc(x.name)+' · '+x.priceVT+' VT · '+esc(equipmentDetails(x))+'</option>';
 }).join("").replace(/^<\/optgroup>/,"")+(catalog.length?'</optgroup>':'');
 $("shop-preferred").innerHTML=RESOURCES.map(([key,name])=>'<option value="'+key+'">'+esc(name)+'</option>').join("");
 if(catalog.some(x=>x.name===currentShop))$("shop-items").value=currentShop;
 if(RESOURCES.some(x=>x[0]===currentPreferred))$("shop-preferred").value=currentPreferred;
 renderStoneShop();renderPurchaseLoadPreview();
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
function renderPurchaseLoadPreview(){
 const preview=$("trade-purchase-load");if(!preview)return;
 const item=CATALOG.find(x=>x.name===$("shop-items")?.value);
 if(!item||item.kind==="focus"||item.category==="pendente"||!(Number(item.priceVT)>0)){
  preview.innerHTML='<small>Escolha um equipamento para visualizar a carga e o balanço após a compra.</small>';return;
 }
 preview.innerHTML=purchaseLoadMarkup(purchaseLoadPreview(item,Number(item.priceVT)));
}
function buyCatalogItem(catalogName=$("shop-items")?.value,preferred=$("shop-preferred")?.value){
 const item=CATALOG.find(x=>x.name===catalogName);
 if(!item||item.kind==="focus")return;
 if(item.category==="pendente"){toast("Categoria/carga ainda não definidas; compra indisponível.");return;}
 if(item.priceVT==null||!Number.isFinite(Number(item.priceVT))||Number(item.priceVT)<=0){toast("Preço pendente: este item não está disponível para compra.");return;}
 const price=Number(item.priceVT);
 if(price> walletValue()){toast("Recursos insuficientes: este item custa "+price+" VT.");return;}
 const preview=purchaseLoadPreview(item,price);
  const risk=preview.status==="over"?"\nATENÇÃO: após esta compra ficará MUITO PESADO (sobrepeso).":
   preview.status==="heavy"?"\nATENÇÃO: após esta compra ficará PESADO.":"";
  if(!confirm("Comprar "+item.name+" por "+price+" VT em recursos de Grau 1?"+
   "\nCarga após compra: "+pad(preview.after)+" / "+preview.max+" Alto ("+pad(preview.percent)+"%) · "+preview.balance+
   "\nInclui o peso do item e desconta o peso dos recursos gastos."+risk+"\nDeseja confirmar?"))return;
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
 s.courage=Math.min(8,maxCourage(s));s.life=maxLife(s)-1;
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
/** Leva equipamentos à ficha de conflito preservando Integridade atual e estado equipado. */
function npcConflictItems(items=state.items){
 const categories={muito_leve:"muito-leve",leve:"leve",medio:"medio",alto:"pesado",extremo:"muito-pesado"};
 const kinds={armadura:"armor",escudo:"shield",arma:"weapon"};
 return (Array.isArray(items)?items:[]).slice(0,70).map(it=>({
  id:it.id,name:it.name,kind:kinds[it.type]||"other",
  category:categories[it.weight]||"",
  weight:typeof it.weight==="number"?it.weight:(WEIGHTS[it.weight]?.[1]??0),
  qty:it.qty,grade:it.grade,
  integrityMax:it.max,integrity:it.hp,equipped:!!it.equipped
 }));
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
  leader:false,threatGrade:1,level:state.level||1,xp:extra,race:state.race||"",
  attributes:{...state.attributes},knowledges:{...state.knowledges},
  practices:{...state.practices},skills:[...state.skills],
  life:Math.max(0,Number(state.life)||0),pavorLocal:4,keep:2,courage:state.courage??10,
  abilities:"Construído no Codex Genético. Equipamentos copiados; efeitos especiais devem ser conferidos pelo Narrador.",
  items:npcConflictItems()
 };
 if(!confirm("Enviar o NPC "+character.name+" para Criar Conflito?\nA construção usa o mesmo DNA da Ficha e não substitui seu personagem de jogador.\nOs equipamentos e a Integridade atual serão levados ao encontro. Confira-os antes do combate."))return;
 try{
  localStorage.setItem(CONFLICT_NPC_INBOX,JSON.stringify({schema:"codex-humanoide-rapido-v1",
   exportedAt:new Date().toISOString(),source:"codex-genetico-npc-v1",character}));
  save();
  if(EMBED_NPC&&window.parent!==window){
   window.parent.postMessage({type:"codex-rpg:npc-enviado-v1"},window.location.origin);
   toast("Humanoide enviado ao encontro. Continue pelo painel Meus inimigos.");
  }else location.href="../criar-conflito/";
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
 case "magic-prepare":prepareMagic();break;
 case "magic-element":prepareMagic(id);break;
 case "focus-round":{
  // Registro manual de encerramento de rodada: sem supor que "Novo turno" encerrou a rodada.
  if(state.pending){toast("Finalize a ação antes de atualizar cargas do foco.");break;}
  const item=state.items.find(it=>it.id===id&&it.type==="foco");if(!item)return;
  if(magicElementId(item.element||"psiquico")==="sangue"&&item.name.toLowerCase().includes("alma")){
   toast("Pedra da Alma não recarrega naturalmente: exige Perícia Fixar Alma.");break;
  }
  item.focusCharges=Math.min(item.grade,(item.focusCharges??item.grade)+1);
  renderInventory();renderOwnedPanel();save();
  toast(item.name+": "+item.focusCharges+"/"+item.grade+" cargas disponíveis.");
  break;
 }
 case "repertoire-roll":quickRollItem(id);break;
 case "shield-throw-prepare":prepareShieldBoomerang(id);break;
 case "maos-leves-prepare":prepareMaosLeves();break;
 case "armadilha-prepare":prepareArmadilha();break;
 case "corpo-fechado-use":{
  if((state.courageRoundSpent||0)>=5){toast("Teto de 5 Coragens gastas nesta rodada.");break;}
  if(!ownsSkill("corpo-fechado")||skillReq("corpo-fechado")||state.pending||editMode||state.courage<1){toast("Corpo Fechado indisponível: confira a compra, Coragem e rolagem.");break;}
  if(!confirm("Gastar 1 Coragem para proteger a Vitalidade contra dano e efeitos de golpes com armas FÍSICAS por 1 rodada? O Narrador encerra o efeito ao término da rodada."))break;
  state.courage-=1;
  state.courageRoundSpent=clamp((state.courageRoundSpent||0)+1,0,5);logSkillAction("Corpo Fechado","Ativado por 1 rodada; efeitos físicos na Vitalidade resolvidos manualmente.");render();save();toast("Corpo Fechado: −1 Coragem; proteção por 1 rodada.");break;
 }
 case "impacto-psiquico-use":{
  if((state.courageRoundSpent||0)>=5){toast("Teto de 5 Coragens gastas nesta rodada.");break;}
  if(!ownsSkill("impacto-psiquico")||skillReq("impacto-psiquico")||state.pending||editMode||state.courage<1){toast("Impacto Psíquico indisponível.");break;}
  if(!confirm("Gastar 1 Coragem para declarar Impacto Psíquico? O golpe e os efeitos de arma são resolvidos pelo Narrador."))break;
  state.courage-=1;
  state.courageRoundSpent=clamp((state.courageRoundSpent||0)+1,0,5);logSkillAction("Impacto Psíquico","Golpe psíquico declarado; efeitos de armas pendentes de resolução.");render();save();toast("Impacto Psíquico: −1 Coragem; registre e resolva o golpe.");break;
 }
 case "sphere-create":{
  if((state.courageRoundSpent||0)>=5){toast("Limite de 5 Coragens na rodada. Confirme nova rodada.");break;}
  if(!ownsSkill("invocar-esfera-espiritual")||skillReq("invocar-esfera-espiritual")||state.pending||editMode){toast("Invocar Esfera Espiritual indisponível.");break;}
  if(state.spiritualSpheres.createdThisRound>=5){toast("Limite de 5 esferas criadas nesta rodada; confirme a próxima rodada antes de repetir.");break;}
  if(sphereCount()>=5){toast("Teto de 5 Esferas Espirituais armazenadas atingido.");break;}
  if(state.courage<1){toast("Invocar Esfera Espiritual exige 1 Coragem.");break;}
  if(!confirm("Converter 1 Coragem em 1 Esfera Espiritual? Limite de 5 criações por rodada e de 5 esferas armazenadas."))break;
  state.courage-=1;state.spiritualSpheres.count=sphereCount()+1;state.spiritualSpheres.createdThisRound=Number(state.spiritualSpheres.createdThisRound||0)+1;
  state.courageRoundSpent=clamp((state.courageRoundSpent||0)+1,0,5);
  logSkillAction("Invocar Esfera Espiritual","−1 Coragem; +1 esfera; "+state.spiritualSpheres.createdThisRound+"/5 criadas na rodada.");
  render();save();toast("1 esfera criada; "+state.spiritualSpheres.createdThisRound+"/5 nesta rodada.");break;
 }
 case "sphere-absorb":{
  if(!ownsSkill("absorver-esferas")||skillReq("absorver-esferas")||state.pending||editMode||sphereCount()<1){
    toast("Absorver Esferas exige a Perícia e pelo menos uma Esfera Espiritual disponível.");break;
  }
  const amount=sphereCount(),received=Math.min(amount,Math.max(0,maxCourage()-state.courage));
  if(!confirm("Absorver TODAS as "+amount+" esferas? Recupera "+received+" Coragem"+(received<amount?" (limitada pelo teto)":"")+" e consome todas as esferas, deixando 0. Prosseguir?"))break;
  state.spiritualSpheres.count=0;
  state.courage=clamp(state.courage+received,0,maxCourage());
  logSkillAction("Absorver Esferas","−"+amount+" esferas; +"+received+" Coragem (teto respeitado).");
  render();save();toast("Absorver Esferas: −"+amount+" esferas, +"+received+" Coragem.");break;
 }
 case "advance-round":{
  if(state.pending||editMode){toast("Finalize a ação ou edição antes de avançar a rodada.");break;}
  if(!confirm("O Narrador confirmou uma nova rodada? O orçamento de 5 Coragens será reiniciado."))break;
  state.courageRoundSpent=0;state.spiritualSpheres.createdThisRound=0;
  render();save();toast("Nova rodada registrada.");break;
 }
 case "sphere-next-round":{
  if(!ownsSkill("invocar-esfera-espiritual")||!state.spiritualSpheres.createdThisRound||state.pending||editMode)break;
  if(!confirm("O Narrador confirmou o início de uma NOVA rodada? Isto zera o contador de até 5 criações permitidas por rodada."))break;
  state.spiritualSpheres.createdThisRound=0;state.courageRoundSpent=0;render();save();toast("Nova rodada confirmada para criação de Esferas Espirituais.");break;
 }
 case "sphere-spend":{
  const skillId=id;
  if(!["passo-etereo","disparo-esferas-espirituais"].includes(skillId)||!ownsSkill(skillId)||skillReq(skillId)||state.pending||editMode||sphereCount()<1){toast("A ação exige a Perícia e pelo menos 1 esfera disponível.");break;}
  const label=skillId==="passo-etereo"?"Passo Etéreo (8 m)":"Disparo de Esferas (golpe físico à distância)";
  if(!confirm("Gastar 1 Esfera Espiritual para "+label+"? A resolução de alvo, deslocamento, alcance e dano é manual."))break;
  state.spiritualSpheres.count=sphereCount()-1;logSkillAction(label,"−1 esfera; aplicação de efeito confirmada pelo Narrador.");
  render();save();toast(label+": −1 esfera.");break;
 }
 case "cancelar-magia-use":{
  if((state.courageRoundSpent||0)>=5){toast("Teto de 5 Coragens gastas nesta rodada.");break;}
  if(!ownsSkill("cancelar-magia")||skillReq("cancelar-magia")){toast("Cancelar Magia exige Foco, Improviso Elemental e Inteligência, Agilidade, Destreza 4.");break;}
  if(state.pending||editMode){toast("Finalize a rolagem ou edição antes de declarar Cancelar Magia.");break;}
  if(state.courage<1){toast("Coragem insuficiente para tentar Cancelar Magia.");break;}
  const available=[["vento","Ar"],["agua","Água"],["terra","Terra"],["fogo","Fogo"],
   ["sagrado","Sagrado"],["sangue","Sangue"],["trevas","Trevas"],["veneno","Veneno"]]
   .filter(([id])=>ownsSkill(id));
  if(!available.length){toast("Cancelar Magia exige adquirir a Perícia do elemento da magia adversária.");break;}
  const selection=prompt("Cancelar Magia: indique o número do elemento da magia percebida:\\n"+
    available.map(([,name],i)=>(i+1)+". "+name).join("\\n"));
  if(selection===null)break;
  const idx=Number(selection)-1;
  if(!Number.isInteger(idx)||idx<0||idx>=available.length){toast("Escolha um número de elemento que você possui.");break;}
  const [elementId,elementName]=available[idx];
  const deInput=prompt("Qual é a DE da magia adversária, considerando TODOS os valores mantidos? O Narrador informa o valor.");
  if(deInput===null)break;
  const enemyDe=Number(deInput);
  if(deInput.trim()===""||!Number.isSafeInteger(enemyDe)||enemyDe<0){toast("Informe a DE inteira e não negativa declarada pelo Narrador.");break;}
  if(!confirm("Confirmar: você percebe a conjuração de "+elementName+" a até 8 m, e o conjurador adversário MANTEVE ao menos um símbolo de Pavor? Sem isso, não é possível cancelar."))break;
  if(!confirm("Gastar 1 Coragem para TENTAR cancelar "+elementName+"? É preciso igualar ou superar a DE "+enemyDe+" (resultado ≥ "+enemyDe+"); empate cancela, sem sucesso automático."))break;
  state.courage-=1;
  state.courageRoundSpent=clamp((state.courageRoundSpent||0)+1,0,5);
  state.history.unshift({date:new Date().toISOString(),name:"Cancelar Magia · "+elementName,
   outcome:"Tentativa declarada · DE adversária "+enemyDe+" · exige resultado ≥ "+enemyDe+"; empate cancela; Narrador resolve",
   de:enemyDe,reached:0,E:0,A:0,P:0,faces:[],damage:0});
  state.history=state.history.slice(0,20);
  render();save();
  toast("Cancelar Magia: −1 Coragem. Faça o teste pertinente e alcance DE ≥ "+enemyDe+" (empate cancela); o Narrador confirma o resultado.");break;
 }
 case "sentido-elemental-use":{
  if((state.courageRoundSpent||0)>=5){toast("Teto de 5 Coragens gastas nesta rodada.");break;}
  if(!ownsSkill("sentido-elemental")||skillReq("sentido-elemental")){toast("Sentido Elemental exige Inteligência 3 e Improviso Elemental.");break;}
  if(state.pending){toast("Finalize a rolagem pendente antes de analisar um alvo.");break;}
  if(state.courage<1){toast("Coragem insuficiente para usar Sentido Elemental.");break;}
  const input=prompt("Sentido Elemental: qual alvo deseja analisar? A afinidade será informada pelo Narrador.");
  if(input===null)break;
  const target=input.trim().slice(0,90);
  if(!target){toast("Informe o alvo da análise.");break;}
  if(!confirm("Gastar 1 Coragem para analisar "+target+"? O Narrador informa a afinidade elemental."))break;
  state.courage-=1;
  state.courageRoundSpent=clamp((state.courageRoundSpent||0)+1,0,5);
  state.history.unshift({date:new Date().toISOString(),name:"Sentido Elemental · "+target,outcome:"Alvo analisado — afinidade informada pelo Narrador",de:0,reached:0,E:0,A:0,P:0,faces:[],damage:0});
  state.history=state.history.slice(0,20);
  render();save();toast("Sentido Elemental: −1 Coragem. Solicite ao Narrador a afinidade elemental de "+target+".");break;
 }
 case "shield-ground-recover":{
  const it=state.items.find(x=>x.id===id&&x.type==="escudo"&&x.shieldGrounded);
  if(!it||state.pending){toast("Finalize a rolagem e confirme a recuperação do escudo no chão.");break;}
  if(!confirm("O Narrador confirmou que o escudo foi recuperado? Em falha limpa, 1 Antecipar pode permitir correr para recuperá-lo; não há recuperação automática, e riscos com Pavor precisam ser resolvidos."))break;
  it.shieldGrounded=false;it.shieldFallCase="";it.shieldFallMeters=0;
  it.equipped=true; // Escudo devolvido ao portador apenas após confirmação do Narrador.
  render();save();toast("Escudo recuperado e equipado, conforme confirmação do Narrador.");break;
 }
 case "wizard-back":if(wizardStep===1)wizardStarterBack();else wizardSelectStep(wizardStep-1);break;
 case "wizard-go":wizardSelectStep(Number(button.dataset.step));break;
 case "wizard-finish":wizardFinalize();break;
 case "wizard-portrait":$("portrait-input").click();break;
 case "rune-shield-use":{
  if(state.race!=="runa_espinhos"||state.runeShieldFreeUsed||state.pending)return;
  state.runeShieldFreeUsed=true;renderRacePanel();save();
  toast("Escudo Rúnico: ativação gratuita diária registrada. Faça a rolagem de Disciplina normalmente.");break;
 }
 case "rune-shield-reset":{
  if(state.race!=="runa_espinhos"||!state.runeShieldFreeUsed||state.pending)return;
  if(!confirm("Confirmar a renovação do uso diário do Escudo Rúnico?"))return;
  state.runeShieldFreeUsed=false;renderRacePanel();save();toast("Escudo Rúnico: uso diário restaurado.");break;
 }
 case "human-reroll-use":{
  if(state.race!=="humano"||state.perseverancaUsed||state.pending)return;
  state.perseverancaUsed=true;renderRacePanel();save();toast("Perseverança usada. Rerrole o teste manualmente.");break;
 }
 case "human-long-rest":{
  if(state.race!=="humano"||!state.perseverancaUsed||state.pending)return;
  if(!confirm("Confirmar que o personagem concluiu um descanso longo?"))return;
  state.perseverancaUsed=false;renderRacePanel();save();toast("Perseverança Humana restaurada.");break;
 }
 case "hemo-link-roll":{
  if(!state.pending)return;
  const result=score();
  if(!result?.mayHemomancyDirectLife)return;
  state.pending.hemomancyDirectLife=!state.pending.hemomancyDirectLife;
  save();renderComposer();break;
 }
 case "hemo-target-shield":{
  if(!state.pending||!score()?.mayHemomancyDirectLife||!state.pending.hemomancyDirectLife)return;
  state.pending.targetBloodArcaneShield=!state.pending.targetBloodArcaneShield;
  save();renderComposer();break;
 }
 case "hemo-record-damage":{
  if(!ownsSkill("sangue")||state.pending)return;
  const amount=Number($("hemo-damage-points")?.value);
  if(!Number.isInteger(amount)||amount<1||amount>999){
   toast("Informe 1 a 999 pontos inteiros de dano real à Vida de inimigos.");return;
  }
  if(state.hemomancy.spilled+amount>1998){
   toast("Limite técnico de registro alcançado; gaste ou corrija marcas.");return;
  }
  state.hemomancy.spilled+=amount;
  renderHemomancy();save();
  toast(amount+" marcas de sangue de inimigos registradas (uma por ponto de Vida perdido).");break;
 }
 case "hemo-spend":{
  if(!ownsSkill("sangue")||state.pending||state.hemomancy.spilled<1)return;
  state.hemomancy.spilled-=1;
  renderHemomancy();save();
  toast("1 marca de Sangue inimigo consumida. Resolva o efeito com o Narrador.");break;
 }
 case "hemo-adjust":{
  if(!ownsSkill("sangue")||state.pending)return;
  state.hemomancy.spilled=clamp(state.hemomancy.spilled+Number(delta),0,1998);
  renderHemomancy();save();break;
 }
 case "hemo-self":{
  if(!ownsSkill("sangue")||state.pending)return;
  state.hemomancy.selfBleeding=!state.hemomancy.selfBleeding;
  renderHemomancy();save();break;
 }
 case "hemo-amplify":{
  const h=state.hemomancy,kind=$("hemo-amplify-effect")?.value;
  const payment=button.dataset.payment;
  if(!ownsSkill("sangue")||state.pending||h.usedThisTurn||
   !["magic","direct-life","keep","step"].includes(kind)||!["life","blood"].includes(payment))return;
  if(payment==="life"){
   if(state.life<1)return;
   if(state.life===1&&!confirm("Sacrificar sua última Vida para amplificar? A ficha ficará com Vida 0; condições de morte são resolvidas pelo Narrador."))return;
   state.life-=1;
  }else{
   if(h.spilled<3)return;
   h.spilled-=3;
  }
  h.usedThisTurn=true;h.boostKind=kind;h.boostPayment=payment;h.directLifeResolved=false;
  renderVitals();renderHemomancy();save();
  toast("Amplificação paga: "+(payment==="life"?"−1 Vida própria":"−3 marcas inimigas")+". Resolva o efeito sem bônus de dano automático.");break;
 }
 case "hemo-transfusion":{
  const h=state.hemomancy;
  if(!ownsSkill("transfusao-sanguinaria")||h.spilled<3||state.life<=0||state.life>=maxLife()||state.pending)return;
  if(!confirm("Registrar a conjuração Transfusão Sanguinária JÁ RESOLVIDA pelo Narrador? Consome 3 marcas de sangue inimigo e recupera 1 Vida. Sem dispensa de testes e custos pendentes."))return;
  h.spilled-=3;state.life=clamp(state.life+1,0,maxLife());
  renderVitals();renderHemomancy();save();toast("Transfusão registrada: −3 marcas inimigas, +1 Vida.");break;
 }
 case "source":selectSource(group,source);break;
 case "grade":updateGrade(group,source,Number(delta));break;
  case "gene-grade":geneStageGrade(group+":"+source,Number(delta));break;
  case "gene-skill":geneStageSkill(id);break;
  case "gene-auto-buy":geneAutoBuy(id);break;
  case "gene-confirm":geneCommit();break;
  case "gene-reset":geneDiscard();break;
  case "gene-future":{
   geneShowFuture=!geneShowFuture;
   // Alterna a visibilidade sem recriar a etapa inteira do assistente.
   // Assim, a câmera do Codex não volta ao início ao tocar no botão interno.
   renderGenetic();
   for(const control of document.querySelectorAll('[data-action="gene-future"]')){
    control.textContent=geneShowFuture?(control.classList.contains("fp-gene-future-float")?"Ocultar futuras":"Ocultar futuras ramificações"):(control.classList.contains("fp-gene-future-float")?"Mostrar futuras":"Mostrar futuras ramificações");
    control.setAttribute("aria-pressed",String(geneShowFuture));
   }
   break;
  }
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
 case "magic-preparation-complete":{
   const p=state.pending;if(!p?.opts?.magicElement)return;
   p.opts.magicTimeConfirmed=true;save();renderComposer();
   toast("Tempo confirmado. Resolva as oportunidades de Pavor antes de finalizar.");break;
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
 case "cravar-remove-prepare":{
  const shield=state.items.find(it=>it.id===id&&it.type==="escudo"&&it.embeddedWeapon);
  if(!shield){toast("Escudo sem arma cravada para retirar.");break;}
  if(state.pending){toast("Finalize a rolagem pendente antes de tentar retirar Cravar.");break;}
  editMode=false;sheetPage="play";
  draft=freshDraft();
  draft.cravarRemovalShieldId=id;draft.base={group:"practice",key:"atletismo"};
  draft.attribute={group:"attr",key:(state.attributes.vigor||0)>(state.attributes.forca||0)?"vigor":"forca"};
  draft.de=1;draft.cravarRemovalDEConfirmed=false;
  render();$("composer-content")?.scrollIntoView?.({behavior:"smooth",block:"center"});
  toast("Retirar Cravar: escolha uma combinação com Força, Atletismo ou Vigor e informe a DE da arma (máximo 4).");break;
 }
 case "cravar-impact":{
  const target=state.items.find(it=>it.id===id&&it.type==="escudo");
  if(!target){toast("Escolha um escudo físico do inventário.");break;}
  const input=button.closest(".fp-item")?.querySelector("[data-cravar-exitos]");
  const e=Number(input?.value);
  if(!Number.isSafeInteger(e)||e<1||e>32){toast("Informe quantos Êxitos mantidos foram válidos (1 a 32).");break;}
  if(!confirm("Confirmar ataque acertado com Cravar ativada por Perícia habilitada? Aplicar "+e+" de perda à Integridade do escudo "+target.name+"?"))break;
  const removed=loseShieldIntegrity(target,e);
  const remaining=shieldIntegrityDisplay(target);
  renderInventory();renderVitals();save();
  toast("Cravar: "+removed+" de Integridade perdida; restante "+remaining.hp+"/"+remaining.max+" (bônus de Maestria apenas com escudo equipado).");
  break;
 }
 case "integrity":{
  const it=state.items.find(x=>x.id===id);if(it){if(it.type==="escudo")changeShieldIntegrity(it,Number(delta));else it.hp=clamp(it.hp+Number(delta),0,it.max);renderInventory();renderVitals();save();}break;
 }
 case "equip":{
  const it=state.items.find(x=>x.id===id);if(!it)return;
  if(it.type==="escudo"&&it.shieldGrounded){toast("Escudo no chão: confirme primeiro a recuperação conforme Arremesso de Armas.");return;}
  if(!it.equipped&&it.type==="armadura"&&!canEquipArmor(state,it)){toast(state.race==="runa_espinhos"?"Runa Espinhos não pode equipar armaduras físicas.":"Não pode equipar: G2 exige nível 5, G3 nível 10, G4 nível 20; Muito Pesada exige Vigor 6 e Atletismo 6.");return;}
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
 if(["small-companion-present","small-companion-name","small-companion-species"].includes(el.id)){
  if(!state.skills.includes("domar-criatura-pequena")){toast("Adquira Domar Criatura Pequena e realize a domesticação antes de registrar o animal.");renderSmallCompanion();return;}
  const oldMax=maxLife();
  if(el.id==="small-companion-present")state.smallCompanion.present=!!el.checked;
  else if(el.id==="small-companion-name")state.smallCompanion.name=String(el.value).slice(0,70);
  else if(el.id==="small-companion-species")state.smallCompanion.species=el.value==="serpente"?"serpente":"outro";
  const difference=maxLife()-oldMax;
  if(difference)state.life=clamp(state.life+difference,0,maxLife()); // Preserva o dano sofrido.
  renderVitals();renderSmallCompanion();save();return;
 }
 if(el.dataset.magicField!==undefined){
  if(state.pending){toast("Finalize a rolagem antes de alterar a magia.");renderOwnedPanel();return;}
  const field=el.dataset.magicField;
  if(field==="magicGrade"){draft.magicGrade=Number(el.value);draft.magicGradeConfirmed=false;draft.magicTimeConfirmed=false;draft.magicCharges=0;}
  else if(field==="magicFocusId"){draft.magicFocusId=String(el.value);draft.magicCharges=0;draft.magicTimeConfirmed=false;}
  else if(field==="magicSecondElement"){draft.magicSecondElement=String(el.value);draft.magicSecondFocusId="";draft.magicCharges=0;draft.magicTimeConfirmed=false;}
  else if(field==="magicSecondFocusId"){draft.magicSecondFocusId=String(el.value);draft.magicCharges=0;draft.magicTimeConfirmed=false;}
  else if(field==="magicCharges"){draft.magicCharges=Math.floor(Number(el.value));draft.magicTimeConfirmed=false;}
  else if(field==="magicAmplify")draft.magicAmplify=!!el.checked;
  else if(field==="magicGradeConfirmed")draft.magicGradeConfirmed=!!el.checked;
  else if(field==="magicTimeConfirmed")draft.magicTimeConfirmed=!!el.checked;
  else return;
  alignMagicDraft();
  if(draft.mode!=="conjuracao"||!draft.base)prepareMagic();
  else{renderOwnedPanel();renderComposer();}
  return;
 }
 if(el.dataset.inventoryType!==undefined||el.dataset.inventoryWeight!==undefined){
  if(el.dataset.inventoryType!==undefined&&EQUIPMENT_FAMILIES.some(([key])=>key===el.value))inventoryType=el.value;
  if(el.dataset.inventoryWeight!==undefined&&EQUIPMENT_WEIGHT_OPTIONS.some(([key])=>key===el.value))inventoryWeight=el.value;
  renderInventory();return;
 }

 if(el.id==="shop-items"){renderPurchaseLoadPreview();return;}
  if(el.dataset.tradeShopType!==undefined||el.dataset.tradeShopWeight!==undefined){
  if(el.dataset.tradeShopType!==undefined&&EQUIPMENT_FAMILIES.some(([key])=>key===el.value))tradeShopType=el.value;
  if(el.dataset.tradeShopWeight!==undefined&&EQUIPMENT_WEIGHT_OPTIONS.some(([key])=>key===el.value))tradeShopWeight=el.value;
  renderTrade();return;
 }

 if(el.dataset.wizardShopType!==undefined||el.dataset.wizardShopWeight!==undefined){
  if(viewMode!=="builder"||wizardStep!==3)return;
  if(el.dataset.wizardShopType!==undefined&&EQUIPMENT_FAMILIES.some(([key])=>key===el.value))wizardShopCategory=el.value;
  if(el.dataset.wizardShopWeight!==undefined&&EQUIPMENT_WEIGHT_OPTIONS.some(([key])=>key===el.value))wizardShopWeight=el.value;
  wizardPersist();renderWizard();return;
 }

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
  if(k==="stepSourceId")draft.step=!!draft.stepSourceId;
  if(k==="mode"){draft.third=null;draft.contextOK=false;draft.equipmentId="";draft.fulminante="";draft.attackThrown=false;draft.trevas=false;draft.shieldRaise=false;draft.asura=false;draft.asuraDieId="";}
  if(k==="asura"&&!draft.asura)draft.asuraDieId="";
  if(k==="equipmentId"&&draft.mode==="conjuracao"&&draft.magicElement){draft.magicFocusId=draft.equipmentId;alignMagicDraft();}
  if(k==="de"&&draft.cravarRemovalShieldId)draft.cravarRemovalDEConfirmed=false;
  renderSources();renderComposer();return;
 }
 if(el.dataset.pending&&state.pending){
  const k=el.dataset.pending;
  if(["characteristic","secondCharacteristic","fireMode","cravarTargetShield"].includes(k)){
   state.pending[k]=String(el.value).slice(0,40);
   if(k==="fireMode")state.pending.fireGradeConfirmed=false;
   save();renderComposer();return;
  }
  if(k==="fireGradeConfirmed"){
   state.pending[k]=!!el.checked;
   save();renderComposer();return;
  }
  if(!["cancelP","pairs","pass"].includes(k))return;
  state.pending[k]=clamp(Math.floor(el.value),0,k==="pass"?1:20);save();renderComposer();return;
 }
 if(el.dataset.itemField){
  const it=state.items.find(x=>x.id===el.dataset.id);if(!it)return;
  const k=el.dataset.itemField;
  if(k==="name")it.name=el.value.slice(0,90);
  else if(k==="type"){
   it.type=["arma","armadura","escudo","foco","ferramenta","outro"].includes(el.value)?el.value:"outro";
   if(it.type!=="escudo")it.embeddedWeapon="";
  }
  else if(k==="weight"){
   it.weight=Object.hasOwn(WEIGHTS,el.value)?el.value:"leve";
   if(it.type==="escudo"&&["alto","extremo"].includes(it.weight)&&it.embeddedWeapon==="medio"){
    it.embeddedWeapon="";toast("Escudo pesado só aceita Cravar de arma Pesada; marca de arma Média retirada.");
   }
  }
  else if(k==="qty")it.qty=it.packSize>0?1:clamp(Math.floor(el.value),1,99);
  else if(k==="ammoRemaining"&&it.packSize>0){it.ammoRemaining=clamp(Math.floor(el.value),0,it.packSize);}
  else if(k==="grade"){it.grade=clamp(Math.floor(el.value),1,4);if(it.type==="foco")it.focusCharges=clamp(it.focusCharges??it.grade,0,it.grade);}
  else if(k==="focusCharges"&&it.type==="foco")it.focusCharges=clamp(Math.floor(Number(el.value)),0,it.grade);
  else if(k==="element"&&it.type==="foco"){
   const n=magicElementId(el.value);
   if(n)it.element=n;
  }
  else if(k==="max"){it.max=clamp(Math.floor(el.value),0,999);it.hp=clamp(it.hp,0,it.max);}
  else if(k==="elementalResistance"){it.elementalResistance=String(el.value).slice(0,70);}
  else if(k==="secondResistance"){it.secondResistance=String(el.value).slice(0,70);}
  else if(k==="specificImmunity"){it.specificImmunity=String(el.value).slice(0,70);}
  else if(k==="embeddedWeapon"&&it.type==="escudo"){
   const w=["medio","pesado"].includes(el.value)?el.value:"";
   if(w==="medio"&&["alto","extremo"].includes(it.weight)){
    toast("Escudo pesado só pode receber Cravar de arma Pesada.");
    it.embeddedWeapon="";
   }else it.embeddedWeapon=w;
  }
  // Não zerar Integridade 3 da Armadura Muito Leve ao editar a ficha.
  if(it.equipped&&it.type==="armadura"&&!canEquipArmor(state,it)){it.equipped=false;toast(state.race==="runa_espinhos"?"Runa Espinhos não pode equipar armaduras físicas.":"Armadura desequipada: nível ou requisitos do tipo/Grau não atendidos.");}
  renderInventory();renderVitals();save();return;
 }
}
function bind(){
 document.addEventListener("click",onClick);
 document.addEventListener("click",event=>{
  const button=event.target.closest("button[data-inventory-view]");
  if(button)chooseInventoryPane(button.dataset.inventoryView);
 });
 document.addEventListener("click",event=>{
  const trigger=event.target.closest("[data-vital-open]");
  if(trigger){toggleVitalTooltip(trigger);return;}
  if(event.target.closest("[data-vital-close]")){closeVitalTooltip();return;}
  if(!event.target.closest("#fp-vital-tooltip"))closeVitalTooltip();
 });
 document.addEventListener("pointerover",event=>{
  if(event.pointerType!=="mouse")return;
  const trigger=event.target.closest?.("[data-vital-open]");
  if(trigger&&!trigger.contains(event.relatedTarget))showVitalTooltip(trigger,false);
  if(event.target.closest?.("#fp-vital-tooltip"))stopVitalTooltipTimer();
 });
 document.addEventListener("pointerout",event=>{
  if(event.pointerType!=="mouse")return;
  const trigger=event.target.closest?.("[data-vital-open]");
  if(trigger&&!trigger.contains(event.relatedTarget))scheduleVitalTooltipClose();
  const tip=event.target.closest?.("#fp-vital-tooltip");
  if(tip&&!tip.contains(event.relatedTarget))scheduleVitalTooltipClose();
 });
 document.addEventListener("keydown",event=>{if(event.key==="Escape")closeVitalTooltip();});
 window.addEventListener("resize",closeVitalTooltip);
 window.addEventListener("scroll",event=>{if(!event.target.closest?.("#fp-vital-tooltip"))closeVitalTooltip();},true);
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
  const b=event.target.closest("button[data-resource]");
  if(b){
   adjustResource(b.dataset.resource,Number(b.dataset.delta));
   if(b.closest("#fp-vital-tooltip")&&vitalTooltipTrigger)showVitalTooltip(vitalTooltipTrigger,true);
  }
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
  if(state.xpEarned+amount>MAX_EARNED_XP){toast("Teto do playtest: "+XP_LEVEL_REFERENCE[20]+" XP totais, com até "+MAX_EARNED_XP+" XP após a criação. Fichas antigas preservadas.");return;}
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
  const button=$("theme-toggle");button.textContent=next==="light"?"☀ Claro":"☾ Escuro";
  button.setAttribute("aria-pressed",String(next==="light"));
 });
 const menuToggle=document.querySelector(".fp-site-header [data-menu]");
 const siteNav=document.querySelector(".fp-site-header .site-nav");
 menuToggle?.addEventListener("click",()=>{
  const open=siteNav?.classList.toggle("open")||false;
  menuToggle.setAttribute("aria-expanded",String(open));
  menuToggle.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");
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
 if(EMBED_NPC){
  document.body.classList.add("fp-npc-embedded");
  const toolbar=$("npc-embed-toolbar");if(toolbar)toolbar.hidden=false;
  $("npc-embed-send")?.addEventListener("click",sendNpcToConflict);
  $("npc-embed-new")?.addEventListener("click",()=>{
   if(state.name.trim()&&!confirm("Criar outro humanoide? O rascunho anterior permanecerá no encontro apenas se foi enviado."))return;
   state=defaultState();resetPlayerView({});render();wizardPersist();save();
   window.scrollTo({top:0,behavior:"smooth"});
  });
 }
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
 $("reset-turn").addEventListener("click",()=>{
  if(state.hemomancy){state.hemomancy.usedThisTurn=false;state.hemomancy.boostKind="";state.hemomancy.boostPayment="";state.hemomancy.directLifeResolved=false;}
  renderSkills();renderHemomancy();save();
  toast("Novo turno: marcador de amplificação com Sangue liberado.");
 });
 window.addEventListener("storage",event=>{if(event.newValue&&(event.key===SAVE_KEY||event.key===PLAYER_SHEETS_INDEX||event.key?.startsWith(PLAYER_SHEET_PREFIX))){toast("Fichas alteradas em outra aba. Recarregue para sincronizar antes de continuar.");}});
}
bind();load();
})();