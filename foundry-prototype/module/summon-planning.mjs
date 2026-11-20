import {healthByLife, xpLedger} from "./rules.mjs";
import {allOwnedSkills} from "./races.mjs";

// Preparação consultiva. O Narrador controla a criação, as ações e a dissipação da ficha.
export function summonPlan(rules, system, {size, first, second="", base="courage", mastery="", count=1, life, de}){
 const skills=allOwnedSkills(system);
 const elements=[first,...(second?[second]:[])];
 const health=system.life&&healthByLife(system,system.life.value);
 if(health&&["morto","incapacitado","inconsciente"].includes(health.id))throw Error("A Saúde atual impede sustentar a Invocação.");
 if(!rules.canSummonElemental({skills,element:first,size}))throw Error("Porte ou elemento sem habilitação.");
 if(second&&!rules.canCombineSummonedElements({skills,elements}))throw Error("Dois elementos exigem habilitação de ambos, Improviso e Maestria Elemental.");
 if(base!=='courage'||!['','courage'].includes(mastery))throw Error('A Invocação utiliza Coragem. PP foi revogado.');
 if(mastery&&!skills.includes("mestre"))throw Error("A ativação adicional exige Maestria Elemental.");
 const courage=Number(base==="courage")+Number(mastery==="courage")+(second?rules.DUAL_ELEMENT_EXTRA_COURAGE:0);
 if(courage>system.courage)throw Error("Recursos insuficientes para esta invocação.");
 const xpTotal=xpLedger(system).grant;
 if(!Number.isSafeInteger(count)||count<1)throw Error("Informe uma quantidade inteira de tokens.");
 const split=count>1?rules.splitSummonTokens({xpTotal,lifeTotal:life,tokenCount:count,defenseDE:de}):null;
 return {
  xpTotal, courage, dice:rules.summonDiceLimit(size), split,
  stillBody:rules.psychicProjectionRequiresStillBody(elements),
  necromancy:elements.includes("sangue")&&elements.includes("trevas"),
  turns:rules.ANTICIPATED_SUMMON_TURNS, maxSheets:rules.MAX_INVOCATION_SHEETS,
 };
}
