/** Codex RPG v0.49 — requisitos verificáveis para compra e porte de Invocação Elemental.
 * Criar Item de Foco e Magia habilita Psique; Combinar exige Improviso + Maestria.
 * Não resolve automaticamente ações, posse, rolagens, efeitos de área ou dano.
 */
export const ELEMENT_SKILL_IDS=Object.freeze(["fogo","agua","vento","terra","sagrado","veneno","sangue","trevas"]);
export const DOMAR_BY_SIZE=Object.freeze({pequena:"domar-criatura-pequena",media:"domar-criatura-media",grande:"domar-criatura-grande"});
export const INVOCACAO_ELEMENTAL_XP=1;
export const PSIQUE_HABILITATION_SKILL="criar-item-foco-magia";
export const COMBINATION_SKILLS=Object.freeze(["improviso","mestre"]);
export const DUAL_ELEMENT_EXTRA_COURAGE=1;
export const MASTERED_SUMMON_EXTRA_ACTIVATION=Object.freeze(["1 PP","1 Coragem"]);
export const ANTICIPATED_SUMMON_TURNS=1;
export const SUMMON_ACTION_MODES=Object.freeze(["individual","ajudar-conjurador","ajudar-aliado"]);
export const PSIQUE_ELEMENT="psique";
/** Limites aprovados: apenas uma ficha de invocação ativa por conjurador;
 * duas fichas domesticadas sob controle direto por domador. */
export const MAX_INVOCATION_SHEETS=1;
export const MAX_DIRECT_TAMED_SHEETS=2;
/** Múltiplos corpos reais podem compartilhar uma única ficha de Grande.
 * Os procedimentos para dano/posicionamento de cada corpo são pendentes. */
export const GROUPED_ZOMBIE_EXAMPLE=Object.freeze({
 realMediumBodies:3,mechanicalSize:"grande",controlledSheets:1,
 xpEntries:1,sharedMechanicalLife:true,sharedActionBudget:true
});
/** Invocação de Psique (pura ou combinada) projeta a mente do conjurador:
 * o corpo físico permanece parado enquanto a manifestação é sustentada. */
export function psychicProjectionRequiresStillBody(elements){
 const list=Array.isArray(elements)?elements:[elements];
 return list.some(element=>normalizeElement(element)===PSIQUE_ELEMENT);
}
const normalizeElement=element=>element==="psiquico"||element==="psíquico"?PSIQUE_ELEMENT:element;
export function eligibleElementalSkills(skills=[]){
 const s=new Set(Array.isArray(skills)?skills:[]);
 return [...(s.has(PSIQUE_HABILITATION_SKILL)?[PSIQUE_ELEMENT]:[]),...ELEMENT_SKILL_IDS.filter(id=>s.has(id))];
}
export function canBuyElementalSummoning(skills=[]){
 const s=new Set(Array.isArray(skills)?skills:[]);
 return s.has(PSIQUE_HABILITATION_SKILL)&&s.has("domar-criatura-pequena")&&eligibleElementalSkills(skills).length>0;
}
export function summonableElementalSizes(skills=[]){
 const s=new Set(Array.isArray(skills)?skills:[]);
 if(!s.has("invocacao-elemental")||!canBuyElementalSummoning(skills))return [];
 return Object.entries(DOMAR_BY_SIZE).filter(([,id])=>s.has(id)).map(([size])=>size);
}
export function canSummonElemental({skills=[],element,size}={}){
 const s=new Set(Array.isArray(skills)?skills:[]);
 return eligibleElementalSkills(skills).includes(normalizeElement(element))
  &&summonableElementalSizes(skills).includes(size)
  &&s.has(DOMAR_BY_SIZE[size]);
}

// DEFINIDO: combinação na Invocação usa as duas Perícias existentes,
// além das habilitações dos dois elementos. Não cria terceira Perícia.
export function canCombineSummonedElements({skills=[],elements=[]}={}){
 const s=new Set(Array.isArray(skills)?skills:[]);
 const el=Array.isArray(elements)?elements.map(normalizeElement):[];
 if(!s.has("invocacao-elemental")||!canBuyElementalSummoning(skills))return false;
 if(!COMBINATION_SKILLS.every(x=>s.has(x)))return false;
 if(el.length!==2||el[0]===el[1])return false;
 const allowed=eligibleElementalSkills(skills);
 return el.every(x=>allowed.includes(x));
}

/**
 * DEFINIDO: ao separar N corpos em tokens, dividir XP e Vida total, copiar DE
 * da ficha original. Não arredondar restos: requer procedimento do autor.
 * Dano de área segue normal para cada token atingido, não reduz os totais.
 */
export function splitSummonTokens({xpTotal,lifeTotal,tokenCount,defenseDE=null}={}){
 if(!Number.isSafeInteger(xpTotal)||xpTotal<0||
    !Number.isSafeInteger(lifeTotal)||lifeTotal<1||
    !Number.isSafeInteger(tokenCount)||tokenCount<1)
  throw new RangeError("XP, Vida e quantidade de tokens precisam ser inteiros válidos");
 const xpRemainder=xpTotal%tokenCount,lifeRemainder=lifeTotal%tokenCount;
 const exact=xpRemainder===0&&lifeRemainder===0;
 return {
  tokenCount,totalXP:xpTotal,totalLife:lifeTotal,defenseDE,
  exact,requiresRemainderDecision:!exact,
  xpRemainder,lifeRemainder,
  xpPerToken:exact?xpTotal/tokenCount:null,
  lifePerToken:exact?lifeTotal/tokenCount:null,
  sameDEPerToken:true,
  areaDamage:"normal",
  maxTurnsPerAnticipation:ANTICIPATED_SUMMON_TURNS
 };
}

/** DEFINIDO: o conjurador só antecipa um turno da invocação por oportunidade.
 * Com tokens separados, escolhe o único token que efetivamente participa.
 * Não executa Antecipar, rolagens nem ações conjuntas automaticamente.
 */
export function summonAnticipatedTurn({tokenCount=1,selectedToken=0,mode="individual"}={}){
 if(!Number.isSafeInteger(tokenCount)||tokenCount<1||
    !Number.isSafeInteger(selectedToken)||selectedToken<0||selectedToken>=tokenCount)
  throw new RangeError("Token selecionado inválido");
 if(!SUMMON_ACTION_MODES.includes(mode))throw new RangeError("Modalidade inválida");
 return {tokenCount,selectedToken,mode,turns:ANTICIPATED_SUMMON_TURNS,
  otherTokensReceiveTurns:false,
  normalAnticipationAndJointCostsApply:true};
}


/** DEFINIDO 16/11/2026: uma contribuição de Atributo por parte da invocação.
 * Os resultados permanecem identificados por parte; nenhum turno novo é criado.
 * A escolha do dado dentro de Atributos com vários dados e a agregação para DE
 * coletiva continuam PENDENTES e não são inferidas por esta função.
 */
export const SUMMON_PARTS_BY_SIZE=Object.freeze({pequena:1,media:2,grande:3});
export const SUMMON_ATTRIBUTE_KEYS=Object.freeze(["forca","agilidade","destreza","inteligencia","influencia","vigor"]);
export function summonDiceLimit(size){
 const parts=SUMMON_PARTS_BY_SIZE[size];
 if(!parts)throw new RangeError("Porte de invocação inválido");
 return {size,parts,rolled:parts,maxKept:parts,dicePerPart:1,source:"attribute",sheets:1};
}
/** Registra UM dado de Atributo por parte, sem resolver DE nem fundir símbolos.
 * dice: [{part:1,attribute:"forca",sides:6,face:6}, ...].
 * keptParts é opcional: por padrão, mantém todos os dados rolados do porte.
 * A origem/passos do dado deverão ser conferidos com os Atributos da ficha.
 */
export function summonPartRoll({size,dice=[],keptParts}={}){
 const rule=summonDiceLimit(size);
 if(!Array.isArray(dice)||dice.length!==rule.parts)throw new RangeError("A invocação exige exatamente um dado por parte");
 const parts=new Set();
 const results=dice.map(item=>{
  if(!item||!Number.isInteger(item.part)||item.part<1||item.part>rule.parts||parts.has(item.part))
   throw new RangeError("Identificação das partes inválida");
  parts.add(item.part);
  if(!SUMMON_ATTRIBUTE_KEYS.includes(item.attribute)||![4,6,10,12].includes(item.sides))
   throw new RangeError("Cada parte precisa de um dado de Atributo válido");
  if(!Number.isInteger(item.face)||item.face<1||item.face>item.sides)
   throw new RangeError("Face de dado inválida");
  return {part:item.part,attribute:item.attribute,sides:item.sides,face:item.face};
 }).sort((a,b)=>a.part-b.part);
 const kept=keptParts===undefined?results.map(x=>x.part):keptParts;
 if(!Array.isArray(kept)||new Set(kept).size!==kept.length||kept.some(x=>!parts.has(x))||
    kept.length>rule.maxKept)throw new RangeError("Dados mantidos precisam corresponder às partes roladas");
 return {...rule,keptCount:kept.length,results:results.map(x=>({...x,kept:kept.includes(x.part)})),
  automaticDEAggregation:false,extraTurns:0,requiresGroupResolutionDecision:true};
}
