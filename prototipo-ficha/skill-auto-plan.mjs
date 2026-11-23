/* Compras conjuntas de Perícias, sem alterar requisitos ou custos.
 * O mapa de alternativas abaixo é copiado de prototipo-ficha/app.js.
 * A CI compara as alternativas com o criador e impede divergências silenciosas.
 */
import {HIDDEN_PLAYER_SKILL_IDS} from "./skills-catalog.mjs?v=20261123-hidden-skill-v1";
export const GENE_AUTO_REQUIREMENTS={
 "manejo-perfeito":[["p:armas_conjuracao:3","a:destreza:2","s:disciplina-avancada"]],
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
 "disciplina-avancada":[["p:armas_conjuracao:3"]],
 "pugilismo":[["p:armas_conjuracao:1","a:forca:2","a:destreza:1"]],
 "artista-marcial":[["p:armas_conjuracao:2","a:destreza:2","s:pugilismo"]],
 "golpe-baixo":[["a:destreza:2","a:forca:1","a:agilidade:1"]],
 "furtividade":[["p:furtividade:2","a:destreza:2","a:agilidade:1"]],
 "furtividade-avancada":[["p:furtividade:3","s:furtividade"]],
 "medicina-avancada":[["k:medicina:3"]],
 "protecao-avancada":[["k:protecao:3"]],
 "astronomia-avancada":[["k:astronomia:3"]],
 "alquimia-avancada":[["k:alquimia:3"]],
 "engenharia-avancada":[["k:engenharia:3"]],
 "erudicao-avancada":[["k:erudicao:3"]],
 "atletismo-avancado":[["p:atletismo:3"]],
 "artesao-avancado":[["p:artesao:3"]],
 "maestria-martelos":[["a:forca:3","a:destreza:1","a:vigor:1"]],
 "maestria-hastes":[["a:forca:2","a:agilidade:1","a:destreza:1"]],
 "maestria-espadas":[["a:forca:2","a:destreza:2"]],
 "ferreiro":[["p:artesao:1","a:forca:1","a:destreza:1","a:inteligencia:1","s:artesao-avancado"]],
 "ferreiro-elemental":[["a:inteligencia:2","a:destreza:2","s:ferreiro","s:improviso","s:criar-item-foco-magia","s:encantar-com-elemento"]],
 "resistencia-a-fogo":[["a:vigor:2","s:ferreiro-elemental","s:fogo"]],
 "encantar-com-elemento":[["s:criar-item-foco-magia","s:vento"],["s:criar-item-foco-magia","s:agua"],["s:criar-item-foco-magia","s:terra"],["s:criar-item-foco-magia","s:fogo"],["s:criar-item-foco-magia","s:sagrado"],["s:criar-item-foco-magia","s:sangue"],["s:criar-item-foco-magia","s:trevas"],["s:criar-item-foco-magia","s:veneno"]],
 "apresentacao-avancada":[["p:apresentacao:3"]],
 "coleta-avancada":[["p:coleta:3"]],
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

const HIDDEN_SKILLS=new Set(HIDDEN_PLAYER_SKILL_IDS);
const FIELDS={attr:"attributes",know:"knowledges",practice:"practices"};
const SOURCE_TYPES={a:"attr",k:"know",p:"practice"};
const copyCharacter=s=>({...s,attributes:{...s.attributes},knowledges:{...s.knowledges},
 practices:{...s.practices},skills:[...(s.skills||[])]});

/* options:
 * catalog: Perícias reais com campos id, cost, name
 * ledger(s): contabilização vigente (incluindo raça e tabela de monstros)
 * requirements(s,id): requisito canônico, nulo quando atendido
 * grants(s): Perícias gratuitas da raça
 * groups: mapa attr/know/practice -> [nome do campo, fontes da ficha]
 * eligible(id): restringe o catálogo novo aos IDs autorizados
 */
export function planSkillPurchase(id,base,{catalog,ledger,requirements,grants,groups,eligible}){
 if(!base||typeof id!=="string"||typeof ledger!=="function"||
   typeof requirements!=="function"||typeof grants!=="function")return null;
 const entries=new Map((catalog||[]).map(row=>[row.id,row]));
 const owns=(skillId,s)=>(s.skills||[]).includes(skillId)||grants(s).includes(skillId);
 if(owns(id,base)||ledger(base).remaining<0)return null;
 const addSkill=(skillId,current,stack)=>{
  const row=entries.get(skillId);
  if(owns(skillId,current))return current;
  if(!row||HIDDEN_SKILLS.has(skillId)||!Number.isInteger(row.cost)||row.cost<0||
   (typeof eligible==="function"&&!eligible(skillId))||stack.includes(skillId))return null;
  const choices=GENE_AUTO_REQUIREMENTS[skillId]||
   (requirements(current,skillId)?[]:[[]]);
  let best=null;
  for(const tokens of choices){
   let draft=copyCharacter(current),valid=true;
   // Elevar as fontes da alternativa ANTES de testar Perícias encadeadas.
   for(const token of tokens){
    const [type,key,value]=token.split(":");
    if(type==="s")continue;
    const group=SOURCE_TYPES[type],spec=groups?.[group],level=Number(value);
    if(!group||!spec||!spec[1].some(([k])=>k===key)||
      !Number.isInteger(level)||level<0||level>6){valid=false;break;}
    draft[spec[0]][key]=Math.max(Number(draft[spec[0]][key]||0),level);
   }
   if(!valid||ledger(draft).remaining<0)continue;
   for(const token of tokens){
    if(!token.startsWith("s:"))continue;
    const linked=addSkill(token.slice(2),draft,[...stack,skillId]);
    if(!linked){valid=false;break;}
    draft=linked;
   }
   if(!valid||requirements(draft,skillId))continue;
   draft.skills.push(skillId);
   if(ledger(draft).remaining<0)continue;
   if(!best||ledger(draft).spent<ledger(best).spent)best=draft;
  }
  return best;
 };
 const state=addSkill(id,base,[]);
 if(!state)return null;
 const cost=ledger(state).spent-ledger(base).spent;
 if(!Number.isFinite(cost)||cost<0||cost>ledger(base).remaining)return null;
 const grades=[];
 for(const [group,[field,values]] of Object.entries(groups||{})){
  for(const [key,name] of values){
   const from=Number(base[field]?.[key]||0),to=Number(state[field]?.[key]||0);
   if(to>from)grades.push({group,key,name,from,to});
  }
 }
 const skills=state.skills.filter(sid=>!owns(sid,base)).map(sid=>{
  const row=entries.get(sid);return {id:sid,name:row?.name||sid,cost:row?.cost};
 });
 return {state,cost,grades,skills,before:ledger(base).remaining,after:ledger(state).remaining};
}
