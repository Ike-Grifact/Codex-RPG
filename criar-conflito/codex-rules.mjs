// Cópia isolada da lógica de regras do SRD v0.44 usada apenas pelo criador de conflitos.
// Origem: foundry-prototype/module/rules.mjs na revisão v0.44; sem alterar o Foundry publicado.
/* Codex RPG — motor matemático independente do Foundry. Estado: protótipo. */
// Rework 17/11/2026: somente Coragem em custos pagos; efeitos G1/G2 habilitados são gratuitos.
// Textos históricos de preço excepcional requerem auditoria individual; não alterar compra XP por dedução.
export const ATTRIBUTES=[["forca","Força"],["agilidade","Agilidade"],["destreza","Destreza"],["inteligencia","Inteligência"],["influencia","Influência"],["vigor","Vigor"]];
export const KNOWLEDGES=[["protecao","Proteção"],["astronomia","Astronomia"],["medicina","Medicina"],["alquimia","Alquimia"],["engenharia","Engenharia"],["erudicao","Erudição"]];
export const PRACTICES=[["armas_conjuracao","Disciplina"],["atletismo","Atletismo"],["furtividade","Furtividade"],["artesao","Artesão"],["apresentacao","Apresentação"],["coleta","Coleta"]];
export const SKILLS=[{"id":"marciais","name":"Artes Marciais","detail":"Especialização desarmada. Exige Disciplina 1; outras regras em playtest.","cost":1},{"id":"montar","name":"Montar Animal","detail":"Requer Influência grau 2.","cost":2},{"id":"provocacao-sofisticada","name":"Provocação Sofisticada","detail":"Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.","cost":1},{"id":"combinacao","name":"Combinação de Fontes","detail":"Habilita propor a terceira fonte pertinente.","cost":2},{"id":"criar-item-foco-magia","name":"Criar Item de Foco e Magia","detail":"Obrigatória para conjurar qualquer elemento; habilita Psique e fabricação de focos por Artesão. Todos os nove elementos podem causar dano convencional no acerto desde G1, sem propriedade especial automática. G1/G2 imediatos; G3/G4 custam 1 Coragem e levam 2/3 turnos. Focos comprados, capacidade Leve 1, Médio 2, Pesado 3; recuperam 1 carga a cada dois turnos próprios, mesmo com cargas restantes. Pedra da Alma sem recarga natural. Não concede dado extra nem foco gratuito. Magias mentais de Psique exigem Disciplina Avançada + Inteligência + Influência.","cost":1},{"id":"escudo-arcano","name":"Escudo Arcano","detail":"Perícia ativa de conjuração, proteção passiva após conjurada. Requisitos Inteligência 2 + Vigor 1 + Criar Item de Foco e Magia. 1 Coragem; escudo pessoal, parede de 3 m ou círculo de 3×3 m por 1 rodada. Disciplina + Atributo pertinente; E+T mantidos válidos formam DE e Integridade simbólica. Protege sem nova ação de Levantar Escudo, enquanto houver cobertura e Integridade. Expansão: 1 Coragem adicional. Psíquico neutraliza Ruptura física; Sangue neutraliza Hemomancia. Extração Elemental e Perícia do elemento habilitam alteração elemental; demais efeitos, equivalências e exceções no verbete.","cost":1},{"id":"conjuracao-equilibrada","name":"Conjuração Refinada","detail":"1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Especialização de alcance de disparos e efeitos mágicos. Aumento em metros, custo e aplicação PENDENTES até reescrita autoral; não altera peso nem concede dados maiores. Identificador legado preservado.","cost":1},{"id":"improviso","name":"Improviso Elemental","detail":"Requisitos Disciplina 1, Inteligência 1, Destreza 1 e Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.","cost":1},{"id":"mestre","name":"Maestria Elemental","detail":"Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. Custo 1 Coragem para mesclar dois elementos e ativar simultaneamente as propriedades especiais dos dois, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.","cost":1},{"id":"fogo","name":"Perícia em Elemento Fogo","detail":"Domínio de Fogo; conjurar exige Criar Item de Foco e Magia. G1 manifestação e dano convencional; G2 conduzir chamas; G3 Queimar: E+T à Integridade, área 4×4; G4 Derreter: mesmo dano e +1 Vida direta fixa, área 8×8. G3/G4: 1 Coragem.","cost":1},{"id":"agua","name":"Perícia em Elemento Água","detail":"Domínio de Água; conjurar exige Criar Item de Foco e Magia. G1 manifestação e dano convencional; G2 Congelar instantâneo sem custo-base e sem dano próprio do congelamento, descongelar, extrair água do ar, mover, molhar e limpar; G3 Empurrar; G4 Ruptura: E+T à Integridade no acerto, sem ignorar armadura. G3/G4: 1 Coragem.","cost":1},{"id":"vento","name":"Perícia em Elemento Ar","detail":"Domínio de Ar; conjurar exige Criar Item de Foco e Magia. G1 manifestação e dano convencional; G2 desloca até 4 m e reduz queda em 4 m mesmo em falha; G3 até 8 m, sufocar, empurrar e derrubar; G4 até 12 m, área e rajadas. Formas livres dentro do limite. Queda 8 m por turno. G3/G4: 1 Coragem.","cost":1},{"id":"terra","name":"Perícia em Elemento Terra","detail":"Domínio de Terra; conjurar exige Criar Item de Foco e Magia. G1 manifestação e dano convencional; G2 Empurrar e Ruptura (E+T à Integridade no acerto), derrubar, moldar terreno e Sentido Sísmico 18×18 m; G3 enraizar, prender/imobilizar, espinhos e Cravar; G4 controle, empurrão e derrubada em área. Condições temporárias por uma ação do alvo, ressalvadas regras próprias. G3/G4: 1 Coragem.","cost":1},{"id":"sagrado","name":"Perícia em Elemento Sagrado","detail":"Domínio de Sagrado; conjurar exige Criar Item de Foco e Magia. G1 dano neutro sagrado convencional. G2 recuperar Coragem mediante 1 Coragem (retorno pendente); G3 Bênção em aliado E−T positivo eleva Atributo; G4 dano e anulação de Temor (quantidade pendente). Duração uma ação. G3/G4: 1 Coragem.","cost":2},{"id":"veneno","name":"Perícia em Elemento Veneno","detail":"Domínio de Veneno; conjurar exige Criar Item de Foco e Magia. G1 manifestação e dano convencional sem efeito especial; para Envenenar, em alvo Sangrando, 1 acúmulo por 2 rodadas, sem renovar anteriores. 2/3 da Vida atual: Ferido; igual à Vida atual: Incapacitado; 12 ativos ou envenenado com exatamente 2 Vida: Inconsciente. Envenenar não causa dano direto automático à Vida. Graus seguem elevação comum; G3/G4: 1 Coragem.","cost":2},{"id":"sangue","name":"Perícia em Elemento Sangue","detail":"Domínio de Sangue; conjurar exige Criar Item de Foco e Magia. G1 manifestação e dano convencional; G2 Hemomancia direta em alvo Sangrando ou com Vida já perdida: consome marcas, quantidade pendente; Escudo Arcano de Sangue neutraliza a propriedade. G3 Elevação Sanguínea: 3 marcas para elevar próprio Atributo 1 Grau ou pagar Perícia de 1 Coragem. G4 Seir: 6 marcas ou 2 Vida próprias, +2 Graus em Atributo próprio. Uma ação; G3/G4 custam também 1 Coragem. Sem automatizar custos pendentes.","cost":2},{"id":"trevas","name":"Perícia em Elemento Trevas","detail":"Domínio de Trevas; conjurar exige Criar Item de Foco e Magia. G1 manifestação e dano convencional; G2 Amplificação Sinistra +1T; G3 Divisão das Sombras +2T fixos, mesma rolagem contra DE de até dois alvos, dano integral em cada atingido antes de proteções. G4 Aflição reduz Atributo inimigo em E−T positivo durante uma ação. G3/G4: 1 Coragem. Não duplicar Temor automaticamente.","cost":2},{"id":"armas-leves","name":"Perícia em Armas Leves","detail":"Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.","cost":2},{"id":"armas-medias","name":"Perícia em Armas Médias","detail":"Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.","cost":2},{"id":"armas-pesadas","name":"Perícia em Armas Pesadas","detail":"Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.","cost":2},{"id":"disciplina-avancada","name":"Disciplina Avançada","detail":"Perícia passiva — sem custo de ativação. Disciplina 3; ao realizar uma ação com Disciplina como fonte principal, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.","cost":1},{"id":"golpe-fulminante","name":"Golpe Fulminante","detail":"Ativa: 1 Coragem paga antes de rolar. Eleva um dado da arma corpo a corpo (d6→d10; d10→d12; d12→2d12), máximo 9 dados. No acerto, cada Pavor mantido não anulado causa 1 dano e continua sendo transferido aos inimigos. Arremesso usa Disparo Fulminante. Combina com outras ativações declaradas até 5 Coragens por turno.","cost":1},{"id":"espalhar-golpe","name":"Golpe Colossal","detail":"Ativa: 1 Coragem antes de rolar, +1E e até 2 alvos adicionais a 3 m do atacante, mesma rolagem contra DE individual. Adicionais atingidos recebem metade do dano de Êxitos arredondada para baixo; Pavor válido conta para a DE, mas não causa dano nos adicionais, mesmo com Golpe Fulminante ativo. Cada Coragem adicional inclui até mais 2 alvos, sem aumentar raio ou bônus.","cost":1},{"id":"pugilismo","name":"Pugilismo","detail":"Combate desarmado: socos de peso Médio por padrão. Por 1 Coragem, altere o peso para Leve ou Pesado antes da rolagem.","cost":1},{"id":"artista-marcial","name":"Artista Marcial","detail":"Combate desarmado: 1 Coragem por tentativa de manobra, ou sem custo adicional ao ativar Pugilismo. No acerto, aplica uma manobra: Empurrar, Agarrar, Derrubar ou Desarmar.","cost":1},{"id":"maestria-arremesso-armas","name":"Perícia em Arremesso de Armas","detail":"Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.","cost":1},{"id":"disparo-fulminante","name":"Disparo Fulminante","detail":"Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados. Buff DEFINIDO 22/11/2026: na ativação, elevar UM dado da arma: d6→d10, d10→d12, d12→2d12 (nunca d20). Máximo 9 dados rolados; não aumenta Grau permanente. A técnica custa 1 recurso por ativação, inclusive no crítico; o dano por Pavor no acerto permanece.","cost":1},{"id":"disparo-multiplo","name":"Disparo Múltiplo","detail":"A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.","cost":1},{"id":"recobrar-coragem","name":"Recobrar Coragem","detail":"1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.","cost":1},{"id":"maestria-manejo-duplo","name":"Perícia em Manejo Duplo","detail":"Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 Coragem. Efeitos próprios, como Ruptura, Sangramento ou Envenenamento, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.","cost":1},{"id":"criar-veneno","name":"Criar Veneno","detail":"Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se os efeitos de ambas forem ativados, um de cada arma. Veneno usa VIDA ATUAL: a partir de 2/3 da Vida atual o alvo fica Ferido; ao atingir total de Vida atual em acúmulos, fica Incapacitado. Fica INCONSCIENTE caso esteja Envenenado com exatamente 2 de Vida atual OU ao atingir 12 acúmulos ativos, independentemente da Vida. Cada acúmulo dura 2 rodadas individualmente. Amplificar Veneno será futura Perícia PENDENTE. Graus 2/3 exigem combinação elemental (sem tornar a alquimia magia).","cost":1},{"id":"criar-antidoto","name":"Criar Antídoto","detail":"Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos forem atendidos; aquisição de Transfusão ainda pendente.","cost":1},{"id":"armas-longo-alcance","name":"Perícia em Armas de Longo Alcance","detail":"Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 Coragem ativa uma segunda; acerto normal exige 1 Coragem.","cost":2},{"id":"disparo-violento","name":"Disparo Violento","detail":"Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crítico.","cost":1},{"id":"armas-fogo","name":"Perícia em Armas de Fogo","detail":"Crítico ativa UMA característica escolhida gratuitamente; acerto normal custa 1 Coragem. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.","cost":3},{"id":"golpe-baixo","name":"Golpe Baixo","detail":"Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, mesmo após terminar a rodada de Desvantagem. Não concede movimentação ou turno gratuito.","cost":1},{"id":"furtividade","name":"Perícia em Furtividade","detail":"Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.","cost":1},{"id":"furtividade-avancada","name":"Furtividade Avançada","detail":"Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.","cost":1}];
export const ATTRIBUTE_DICE=[[4],[6],[6,6],[6,6,6],[6,6,10],[6,10,10],[10,10,10]];
export const TRAINING_DICE=[[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
export const MONSTER_DICE=[[4],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
export const FACES={
 4:[[0,0,0],[0,1,0],[0,0,1],[1,0,0]],
 6:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0]],
 10:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1]],
 12:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[0,0,3],[3,0,0]],
 20:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[0,0,3],[3,0,0],[2,1,1],[2,0,2],[0,2,3],[0,0,4],[3,1,1],[4,1,2],[5,2,1],[6,2,0]]
};
export const GROUPS={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES};
export const SITUATIONS={
 superior:{label:"Vantagem Absoluta",e:1,a:0},
 advantage:{label:"Vantagem",e:0,a:1},
 neutral:{label:"Normal",e:0,a:0},
 disadvantage:{label:"Desvantagem",e:0,a:-1},
 inferior:{label:"Desvantagem Absoluta",e:-1,a:0},
 luck:{label:"Ação de Sorte",e:-2,a:0}
};
export const XP_ATTRIBUTE=[0,1,3,7,15,31,55];
export const XP_TRAINING=[0,2,8,20,38,66,102];
export const MAGIC_GRADE_DIE={1:6,2:10,3:12}; // Compatibilidade com G1-G3.
export const MAGIC_GRADE_DICE={1:[],2:[],3:[],4:[]}; // compatibilidade de importação: v0.194 não fornece dados independentes.
export const CREATION_REFERENCE={attributes:15,training:15,skills:15,total:15}; // SRD v0.89: 15 XP compartilhados, sem reservas por categoria.
export const CRITICAL_FACES=Object.freeze({4:4,6:6,10:7,12:12,20:20});
export function isCriticalFace(sides,face){return CRITICAL_FACES[sides]===face&&Number.isInteger(face);}
export function faceSymbols(sides,face){
 if(!FACES[sides]||!Number.isInteger(face)||face<1||face>sides)throw Error("Face inválida.");
 return [...FACES[sides][face-1]];
}
export function sourceLabel(group,key){
 return (GROUPS[group]||[]).find(x=>x[0]===key)?.[1]|| (group==="equipment"?"Equipamento":"");
}
export function sourceDice(group,key,system){
 if(!(GROUPS[group]||[]).some(x=>x[0]===key))throw Error("Fonte inválida.");
 const field={attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group];
 const grade=Number(system?.[field]?.[key]||0);
 if(!Number.isInteger(grade)||grade<0||grade>6)throw Error("Grau inválido.");
 return [...(group==="attribute"?(system?.monsterRules?MONSTER_DICE:ATTRIBUTE_DICE):TRAINING_DICE)[grade]];
}
// Vida: base 4, +Vigor e +piso(Força/2), preservando a contribuição de Força.
export const lifeMax=s=>4+Number(s.attributes?.vigor||0)+Math.floor(Number(s.attributes?.forca||0)/2);
export const healthBands=s=>{
 const extra=Number(s.attributes?.vigor||0)+Math.floor(Number(s.attributes?.forca||0)/2);
 return [1+Math.ceil(extra/2),1+Math.floor(extra/2),1,1];
};
// A aplicação automática de bônus/malus depende do fluxo de rolagem de cada interface.
export const healthByLife=(s,currentLife)=>{
 const bands=healthBands(s),max=bands.reduce((n,k)=>n+k,0);
 if(!Number.isInteger(currentLife)||currentLife<0||currentLife>max)throw Error("Vida atual inválida.");
 if(currentLife===0)return {id:"morto",e:0,a:0,p:0,coragem:null};
 if(currentLife===1)return {id:"inconsciente",e:-2,a:0,p:2,coragem:2};
 if(currentLife===2)return {id:"incapacitado",e:-1,a:0,p:1,coragem:1};
 if(currentLife<=2+bands[1])return {id:"ferido",e:0,a:-1,p:0,coragem:0};
 return {id:"saudavel",e:0,a:0,p:0,coragem:0};
};
// SRD v0.89: Agilidade integral, somar Vigor+Destreza antes de dividir; Atletismo/3.
export const naturalDE=s=>Math.min(8,2+Math.floor((Number(s.attributes?.agilidade||0)+Number(s.attributes?.vigor||0))/2));
export const balance=s=>Number(s.attributes?.agilidade||0)>Number(s.attributes?.vigor||0)?"Leve":Number(s.attributes?.agilidade||0)<Number(s.attributes?.vigor||0)?"Pesado":"Médio";
export const maxCourage=level=>Math.min(15,10+Number(level>=5)+Number(level>=10)+Number(level>=20));
export const keepLimit=(level,extra=false,monster=false)=>monster?Math.min(Number(level)>=2?4:3,2+Math.max(0,Math.min(2,Number(extra)||0))):Math.min(4,(level>=10?3:2)+(extra?1:0));
export const narratorCap=players=>2+Math.max(0,Math.floor(Number(players)||0));
// SRD v0.41 [DEFINIDO]: G1=4P; progressão +1/Grau até atingir 8P (G5=8P, G6=8P).
// A reserva inicial é cheia; oportunidades, custos e retenção não são alterados.
export const monsterCap=grade=>Math.min(8,Math.max(1,Math.min(6,Math.floor(Number(grade)||1)))+3);

// SRD v0.42: dividir o Pavor residual da ÚNICA rolagem de Trevas ou concentrá-lo em um alvo.
// Os totais afetam APENAS a alocação na reserva; cada alvo compara a rolagem inteira à própria DE.
export function distributeDarknessPavor(total,targetUuids,{mode="split",preferred=""}={}){
 const p=Number(total);
 if(!Number.isInteger(p)||p<0)throw Error("Pavor a distribuir inválido.");
 if(!Array.isArray(targetUuids)||targetUuids.length<1||targetUuids.length>2
   ||targetUuids.some(x=>typeof x!=="string"||!x)||new Set(targetUuids).size!==targetUuids.length)
   throw Error("Trevas exige um ou dois alvos distintos.");
 if(targetUuids.length===1)return [{uuid:targetUuids[0],p}];
 if(!["split","focus"].includes(mode))throw Error("Modo de distribuição de Trevas inválido.");
 if(!targetUuids.includes(preferred))throw Error("Escolha o alvo de prioridade de Trevas.");
 if(mode==="focus")return targetUuids.map(uuid=>({uuid,p:uuid===preferred?p:0}));
 const half=Math.floor(p/2),odd=p%2;
 return targetUuids.map(uuid=>({uuid,p:half+(odd&&uuid===preferred?1:0)}));
}

export const loadCapacity=s=>s.monsterRules?1+Math.floor(Number(s.attributes?.forca||0)/3)+Math.floor(Number(s.attributes?.vigor||0)/3)+Math.floor(Number(s.practices?.atletismo||0)/3):8+Number(s.attributes?.forca||0)+Math.floor(Number(s.attributes?.vigor||0)/2); // humanoides: inclui mochila inicial
export const affinity=(attack,target)=>({leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}})[attack]?.[target]??0;
export function xpLedger(s){
 const attr=ATTRIBUTES.reduce((n,[k])=>n+XP_ATTRIBUTE[Number(s.attributes?.[k]||0)],0);
 const knowledge=KNOWLEDGES.reduce((n,[k])=>n+XP_TRAINING[Number(s.knowledges?.[k]||0)],0);
 const practices=PRACTICES.reduce((n,[k])=>n+XP_TRAINING[Number(s.practices?.[k]||0)],0);
 const perks=(s.skills||[]).reduce((n,id)=>n+(SKILLS.find(x=>x.id===id)?.cost||0),0);
 const spent=attr+knowledge+practices+perks,grant=Number(s.xp||0)+(s.monsterRules?0:15);
 return {attributes:attr,training:knowledge+practices,skills:perks,spent,grant,left:grant-spent,
  state:s.monsterRules?"XP monstruoso: definir orçamento por Grau.":"15 XP iniciais compartilhados, sem reservas obrigatórias; excedentes não são autorizados."};
}
export function mayComplement(system,base,mode){
 const sk=system.skills||[];
 if(system.monsterRules)return Number(system.threatGrade||1)>=5;
 if(sk.includes("combinacao"))return true;
 if(base?.group==="practice"&&base.key==="furtividade")return sk.includes("furtividade-avancada");
 if(base?.group==="practice"&&base.key==="armas_conjuracao")
  return sk.includes("disciplina-avancada");
 return false;
}
export function buildPool(system,selection,{mode="normal",contextApproved=false,step=false,stepDieId="",equipmentDie=0,magicGrade=1,magicElement="",magicSecondElement=""}={}){
 const errors=[],pool=[],b=selection?.base,a=selection?.attribute,c=selection?.complement,monster=!!system.monsterRules;
 if(!b||!(GROUPS[b.group]||[]).some(x=>x[0]===b.key)||(monster&&b.group!=="attribute")||(!monster&&b.group==="attribute"))
  errors.push(monster?"Monstro: selecione primeiro um Atributo.":"Selecione primeiro Conhecimento ou Prática.");
 if(!a||a.group!=="attribute"||!ATTRIBUTES.some(x=>x[0]===a.key))
  errors.push("Inclua um Atributo pertinente.");
 if(b&&a&&b.group===a.group&&b.key===a.key)errors.push("Fontes duplicadas.");
 if(c){
  if(!(GROUPS[c.group]||[]).some(x=>x[0]===c.key)||(monster&&c.group!=="attribute"))errors.push("Complemento inválido.");
  if((b&&b.group===c.group&&b.key===c.key)||(a&&a.group===c.group&&a.key===c.key))errors.push("Complemento duplicado.");
  if(!mayComplement(system,b,mode))errors.push("Complemento exige Perícia ou capacidade de monstro.");
  if(!contextApproved)errors.push("Confirme pertinência do complemento.");
 }
 if(b?.key==="armas_conjuracao"&&!monster){
  const skills=system.skills||[];
  const armed=["armas-leves","armas-medias","armas-pesadas","armas-longo-alcance","armas-fogo","pugilismo","arremesso","manejo-duplo"];
  if(mode==="armas"&&!armed.some(id=>skills.includes(id)))errors.push("Disciplina armada exige Perícia correspondente.");
  if(mode==="conjuracao"&&!skills.includes("criar-item-foco-magia"))errors.push("Conjuração exige Criar Item de Foco e Magia.");
  if(mode!=="armas"&&mode!=="conjuracao")errors.push("Escolha Armas ou Conjuração.");
 }
 if(!errors.length){
  for(const src of [b,a,...(c?[c]:[])])for(const [i,sides] of sourceDice(src.group,src.key,system).entries())
    pool.push({id:src.group+"."+src.key+"."+i,group:src.group,key:src.key,sides,baseSides:sides});
  if(mode==="conjuracao"){
   const grade=Number(magicGrade),learned=system.skills||[];
   if(b?.key!=="armas_conjuracao"||a?.key!=="inteligencia"||!learned.includes("criar-item-foco-magia"))errors.push("Conjuração exige Disciplina, Inteligência e Criar Item de Foco e Magia.");
   if(![1,2,3,4].includes(grade)||magicSecondElement)errors.push("Grau inválido; G5 e mistura exigem resolução manual.");
   if(magicElement&&magicElement!=="psiquico"&&!learned.includes(magicElement)&&!(grade===1&&learned.includes("improviso")))errors.push("Elemento não habilitado.");
   const intGrade=Number(system.attributes?.inteligencia||0);
   const dice=[[4],[6],[6,6],[6,6,6],[6,6,10],[6,10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]][Math.min(9,intGrade+Math.max(0,grade-2))]||[];
   for(let i=pool.length-1;i>=0;i--)if(pool[i].group==="attribute"&&pool[i].key==="inteligencia")pool.splice(i,1);
   dice.forEach((sides,i)=>pool.push({id:"attribute.inteligencia."+i,group:"attribute",key:"inteligencia",sides,baseSides:sides}));
  }
  if(equipmentDie&&mode!=="conjuracao"){
   if(![4,6,10,12].includes(Number(equipmentDie)))errors.push("Dado de equipamento inválido.");
   else pool.push({id:"equipment.0",group:"equipment",key:"equipment",sides:Number(equipmentDie),baseSides:Number(equipmentDie)});
  }
  if(step){
   const target=pool.find(d=>d.id===stepDieId);
   const next={4:6,6:10,10:12}[target?.baseSides];
   if(!next)errors.push("Selecione o dado elegível a elevar (1 Coragem; d4→d6→d10→d12).");
   else target.sides=next;
  }
 }
 if(pool.length>9)errors.push("Máximo absoluto de nove dados rolados.");
 if(pool.filter(x=>x.sides===20).length>2)errors.push("Máximo regular de dois d20.");
 return {ok:errors.length===0,errors,pool};
}
export function resolveRoll(rolled,selectedIds,options={}){
 const {de=1,level=1,extraKeep=false,step=false,courage=10,situation="neutral",
  weight=0,cancelP=0,convertPairs=0,skillBonusE=0,monster=false,hostile=false,threatGrade=1,bonusA=0,bonusP=0,enemyKeepLimit=null,drawMode="none"}=options;
 const errors=[],kept=rolled.filter(d=>selectedIds.includes(d.id));
 if(kept.length!==new Set(selectedIds).size)errors.push("Dados mantidos não encontrados.");
 // O teto próprio do inimigo vem do Grau da ameaça, não de um nível fictício.
 // Usar override somente na resolução hostil impede afetar Marcos de jogadores.
 const enemyOverride=hostile&&Number.isInteger(enemyKeepLimit)&&enemyKeepLimit>=1&&enemyKeepLimit<=4;
 const maxKeep=enemyOverride?enemyKeepLimit:keepLimit(monster?threatGrade:level,extraKeep,monster);
 if(kept.length<1||kept.length>maxKeep)errors.push("Retenção fora do limite.");
 if(!rolled.some(d=>d.group==="attribute"))errors.push("A pilha deve conter um Atributo rolado.");
 if(Number(extraKeep)+Number(step)>(monster?99:courage))errors.push("Coragem insuficiente.");
 const raw=[0,0,0];for(const d of kept)faceSymbols(d.sides,d.face).forEach((v,i)=>raw[i]+=v);
 const crit=kept.length>=2&&kept.every(d=>isCriticalFace(d.sides,d.face));
 let convertedCrit=0,extraCritE=0,extraCritA=0;
 if(crit){convertedCrit=raw[2]>0?1:0;extraCritE=kept.length>=3?1:0;extraCritA=kept.length>=3?1:0;}
 const st=SITUATIONS[situation]||SITUATIONS.neutral;
 const availableA=Math.max(0,raw[1]+extraCritA+st.a+Number(weight)+Number(bonusA));
 const drawSpent=drawMode==="quick"&&availableA>0?1:0;
 const drawPenalty=drawMode==="inventory-untrained"?-2:drawMode==="normal"||drawMode==="inventory-trained"||(drawMode==="quick"&&!drawSpent)?-1:0;
 const a=availableA-drawSpent;
 const pBefore=Math.max(0,raw[2]-convertedCrit+Number(bonusP));
 if(!Number.isInteger(cancelP)||cancelP<0||cancelP>Math.min(pBefore,a))errors.push("Anulação de Pavor inválida.");
 if(!Number.isInteger(convertPairs)||convertPairs<0||cancelP+2*convertPairs>a)errors.push("Conversão 2A → 1E inválida.");
 const e=Math.max(0,raw[0]+convertedCrit+extraCritE+st.e+convertPairs+Number(skillBonusE)+drawPenalty),p=Math.max(0,pBefore-cancelP),reached=e+p,success=reached>=de;
 const outcome=success?(p===0?"Acerto Limpo":p>e?"Acerto Pavoroso":"Acerto Misto"):(p===0?"Falha Limpa":p>e?"Falha Pavorosa":"Falha Mista");
 const rawDamage=e+Math.floor(p/2),damage=success?rawDamage*(crit&&kept.length===4?2:1):0;
 const critical=crit?kept.length:0,refund=crit?(kept.length>=3?2:1):0;
 return{ok:errors.length===0,errors,raw:{e:raw[0],a:raw[1],p:raw[2]},e,p,aRemaining:a-cancelP-2*convertPairs,
  reached,de,success,outcome,damage,critical,drawSpent,drawPenalty,criticalRefundCourage:monster||hostile?0:refund,monsterCriticalPavor:monster||hostile?refund:0,
  freeCharacteristics:success&&crit?1:0,selected:kept};
}
