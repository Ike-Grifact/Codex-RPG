/* Codex RPG — motor matemático independente do Foundry. Estado: protótipo. */
export const ATTRIBUTES=[["forca","Força"],["agilidade","Agilidade"],["destreza","Destreza"],["inteligencia","Inteligência"],["influencia","Influência"],["vigor","Vigor"]];
export const KNOWLEDGES=[["protecao","Proteção"],["astronomia","Astronomia"],["medicina","Medicina"],["alquimia","Alquimia"],["engenharia","Engenharia"],["erudicao","Erudição"]];
export const PRACTICES=[["armas_conjuracao","Disciplina"],["atletismo","Atletismo"],["furtividade","Furtividade"],["artesao","Artesão"],["apresentacao","Apresentação"],["coleta","Coleta"]];
export const SKILLS=[{"id":"marciais","name":"Artes Marciais","detail":"Especialização desarmada. Exige Disciplina 1; outras regras em playtest.","cost":1},{"id":"montar","name":"Montar Animal","detail":"Requer Influência grau 2.","cost":2},{"id":"provocacao-sofisticada","name":"Provocação Sofisticada","detail":"Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.","cost":1},{"id":"combinacao","name":"Combinação de Fontes","detail":"Habilita propor a terceira fonte pertinente.","cost":2},{"id":"criar-item-foco-magia","name":"Criar Item de Foco e Magia","detail":"1 XP · Disciplina 1 + Inteligência 1 + Artesão 1. Substitui Aprendiz de Conjurador e Magia Única, habilita Psique e fabricação de focos por Artesão. Efeitos Psíquicos G1/G2 habilitados têm ativação-base gratuita; Graus superiores respeitam os custos e a preparação vigentes. O personagem concebe e narra as magias livremente na hora, conforme elementos, Perícias, Graus e combinações habilitados, sem memorização, slots, peso mental, desconto de peso ou 2 Coragens por criação. O foco continua sendo um item físico com suas cargas, requisitos e recarga.","cost":1},{"id":"escudo-arcano","name":"Escudo Arcano","detail":"Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 Coragem. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 Coragem amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa.","cost":1},{"id":"conjuracao-equilibrada","name":"Conjuração Equilibrada","detail":"1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Conjuração Refinada: amplia o alcance de magias, com metros, custo e procedimento ainda PENDENTES. Alteração de peso tático antiga REVOGADA.","cost":1},{"id":"improviso","name":"Improviso Elemental","detail":"Requisitos Disciplina 1, Inteligência 1 e Destreza 1, sem Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.","cost":1},{"id":"mestre","name":"Maestria Elemental","detail":"Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. Custo 1 Coragem para mesclar dois elementos e ativar simultaneamente as propriedades especiais dos dois, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.","cost":1},{"id":"fogo","name":"Perícia em Elemento Fogo","detail":"1 XP · Disciplina 1 + Inteligência 1. Perícia em Fogo habilita G1/G2 sem custo de Coragem (G2 Queimar: E+P não anulado à Integridade), inclusive sem foco quando existir fonte de Fogo válida. G3 Derreter: custa 1 Coragem pela elevação de Fogo, preservando E+P à Integridade e 1 Vida direta fixa. Em G4 conjunta, Fogo elevado a G3 custa 1 Coragem; a G4 plena de dois G3 exige 1 Antecipar de mistura + 2 Coragens no total. Sem Perícia, Grau e fonte elemental, não ativa efeitos. Graus e efeitos exigem aprovação do Narrador; não automatizar composição G4.","cost":1},{"id":"agua","name":"Perícia em Elemento Água","detail":"1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Água. Em ataque acertado, mesmo sem crítico, 1 Coragem ativa UM efeito especial. G1: Congelar por 1 rodada sem dano no estado Leve; extrair água do ar, mover, molhar e limpar. G2: Perfurar no CRÍTICO ou por ativação paga; dano à Vida e à armadura. G3: conjurar no final do turno dos aliados; Empurrar, Perfurar, Congelar e dano à Vida e à armadura, mantendo propriedades menores pertinentes. Resolução e efeitos exatos não automatizados.","cost":1},{"id":"vento","name":"Perícia em Elemento Ar","detail":"1 XP · Disciplina 1 + Inteligência 1. Habilita magias Leves de Ar. No acerto, mesmo sem crítico, gaste 1 Coragem para escolher UM efeito especial. G1: autoempurrão +4 m de deslocamento; puxar/empurrar objetos; linha, círculo, cone, X. G2: sufocar com dano à Vida ou armadura, puxar, empurrar + derrubar com dano, deslocamento até +8 m. G3: conjurar no final do turno dos aliados, área grande e múltiplos alvos, tornado/rajada, possíveis danos por queda (16 m ainda sem interpretação geométrica). Formas: linha, círculo, cone, X. TAMBÉM pode recuperar Fôlego (Grau, quantidade e gatilho pendentes). Efeitos não automatizados.","cost":1},{"id":"terra","name":"Perícia em Elemento Terra","detail":"1 XP · Disciplina 1 + Inteligência 1. Conjuração elemental Leve de Terra. Ao acertar ataque, inclusive não crítico, 1 Coragem ativa UM efeito escolhido. G1: Desvantagem 2 RODADAS (terra nos olhos), emaranhar pés, derrubar, lançar pequenas pedras, criar plataformas de deslocamento, sentido sísmico 18×18 m para detectar furtivos e armadilhas. G2: enredar e imobilizar, Desvantagem 2 TURNOS, espinhos danificam armadura/proteção, sentido sísmico 32×32. G3: conjurar ao final do turno dos aliados, área 5×5, linha/cone/círculo A PARTIR DO ALVO, dano, empurrão e derrubada, sentido sísmico 64×64. Unidades não informadas e efeitos adicionais não automatizados.","cost":1},{"id":"sagrado","name":"Perícia em Elemento Sagrado","detail":"Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação especial 1 Coragem. Suporte em si ou aliado próximo exige alcançar a DE do beneficiário. Cada E excedente recupera 1 Coragem, cada P não anulado cancela um E destinado a recuperação (não reaproveitado como dano). Em área, todos os aliados beneficiados recuperam igualmente; E excedentes podem causar dano aos inimigos cujas DEs foram alcançadas. Conjurador escolhe enfoque em dano, suporte ou combinação. Aliados não sofrem dano sagrado de suporte. G2/G3 por combinação elemental.","cost":2},{"id":"veneno","name":"Perícia em Elemento Veneno","detail":"Conjuração distinta da alquimia Criar Veneno. No acerto em alvo com Sangramento, gasta 1 Coragem para aplicar 1 acúmulo por 2 rodadas sem renovar os anteriores. A partir de 2/3 da Vida atual, Ferido; se acúmulos alcançam Vida atual, Incapacitado. Se estiver Envenenado com exatamente 2 de Vida atual OU atingir 12 acúmulos ativos, Inconsciente. Não causa dano direto à Vida; criaturas biologicamente incompatíveis podem ser imunes. Graus 2 e 3 exigem combinação elemental.","cost":2},{"id":"sangue","name":"Perícia em Elemento Sangue","detail":"Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação especial 1 Coragem. Conjurar sem Sangramento próprio custa inicialmente 2 Vida mesmo em falha; autoaplicar Sangramento na conjuração reduz esse custo para 1 Vida; se já estava em Sangramento, o custo inicial é zero. +1P comum na conjuração. Ao acertar alvo em Sangramento ou já danificado na Vida, escolher 2 Vida diretos (não comba com colossal) OU dano convencional de Integridade com sangue coagulado, consumido no uso. Sangue fluido pode ser remanipulado sem aumento de dano, mas alvo único sem mescla. Transfusão é outra Perícia. G2/G3 por combinação.","cost":2},{"id":"trevas","name":"Perícia em Elemento Trevas","detail":"Requisitos Disciplina 2 e Inteligência 2; magias Leves. Ativação especial 1 Coragem após acerto mesmo sem crítico. Escurecimento, Pavor e maldições. Técnica especializada usa uma única rolagem contra até dois alvos distintos, comparada à DE de cada alvo; depois de acertar soma +2P só ao cálculo do dano, nunca à DE, sem gerar Pavor ou intervenção extras. G2/G3 por combinação.","cost":2},{"id":"armas-leves","name":"Perícia em Armas Leves","detail":"Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.","cost":2},{"id":"armas-medias","name":"Perícia em Armas Médias","detail":"Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.","cost":2},{"id":"armas-pesadas","name":"Perícia em Armas Pesadas","detail":"Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.","cost":2},{"id":"disciplina-avancada","name":"Disciplina Avançada","detail":"Disciplina 2; ao realizar uma ação com Disciplina, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.","cost":1},{"id":"golpe-fulminante","name":"Golpe Fulminante","detail":"Após acerto, pagar a ativação transforma cada Pavor mantido não anulado em 1 dano. Pavor continua gerando risco e Pressão. Especializações: Armas Leves, Médias, Pesadas, Manejo Duplo ou Pugilismo. Arremesso não satisfaz esse requisito. Crítico NÃO isenta o custo da técnica.","cost":1},{"id":"espalhar-golpe","name":"Golpe Colossal","detail":"Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SEM bônus de +1E. Não espalha automaticamente o dano de Pavor de Golpe Fulminante. Arremesso não é especialização aceita. Centro da área PENDENTE.","cost":1},{"id":"pugilismo","name":"Pugilismo","detail":"Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 Coragem para mudar peso do soco. Pesos disponíveis PENDENTES.","cost":1},{"id":"artista-marcial","name":"Artista Marcial","detail":"Disciplina 2 + Pugilismo + Destreza 2. 1 Coragem por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.","cost":1},{"id":"maestria-arremesso-armas","name":"Perícia em Arremesso de Armas","detail":"Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.","cost":1},{"id":"disparo-fulminante","name":"Disparo Fulminante","detail":"Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados.","cost":1},{"id":"disparo-multiplo","name":"Disparo Múltiplo","detail":"A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.","cost":1},{"id":"recobrar-coragem","name":"Recobrar Coragem","detail":"1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.","cost":1},{"id":"maestria-manejo-duplo","name":"Perícia em Manejo Duplo","detail":"Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 Coragem. Efeitos próprios, como perfurar, sangrar ou envenenar, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.","cost":1},{"id":"criar-veneno","name":"Criar Veneno","detail":"Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se os efeitos de ambas forem ativados, um de cada arma. Veneno usa VIDA ATUAL: a partir de 2/3 da Vida atual o alvo fica Ferido; ao atingir total de Vida atual em acúmulos, fica Incapacitado. Fica INCONSCIENTE caso esteja Envenenado com exatamente 2 de Vida atual OU ao atingir 12 acúmulos ativos, independentemente da Vida. Cada acúmulo dura 2 rodadas individualmente. Amplificar Veneno será futura Perícia PENDENTE. Graus 2/3 exigem combinação elemental (sem tornar a alquimia magia).","cost":1},{"id":"criar-antidoto","name":"Criar Antídoto","detail":"Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos forem atendidos; aquisição de Transfusão ainda pendente.","cost":1},{"id":"armas-longo-alcance","name":"Perícia em Armas de Longo Alcance","detail":"Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 Coragem ativa uma segunda; acerto normal exige 1 Coragem.","cost":2},{"id":"disparo-violento","name":"Disparo Violento","detail":"Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crítico.","cost":1},{"id":"armas-fogo","name":"Perícia em Armas de Fogo","detail":"Crítico ativa UMA característica escolhida gratuitamente; acerto normal custa 1 Coragem. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.","cost":3},{"id":"golpe-baixo","name":"Golpe Baixo","detail":"Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, mesmo após terminar a rodada de Desvantagem. Não concede movimentação ou turno gratuito.","cost":1},{"id":"furtividade","name":"Perícia em Furtividade","detail":"Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.","cost":1},{"id":"furtividade-avancada","name":"Furtividade Avançada","detail":"Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.","cost":1}];
export const ATTRIBUTE_DICE=[[4],[6],[6,6],[6,6,6],[6,6,10],[6,10,10],[10,10,10]];
export const TRAINING_DICE=[[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
export const MONSTER_DICE=[[4],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
export const FACES={
 4:[[1,0,0],[0,1,0],[0,0,1],[0,0,0]],
 6:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0]],
 10:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1]],
 12:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[0,0,3],[3,0,0]],
 20:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[0,0,2],[3,0,0],[2,2,0],[3,2,0],[0,2,3],[0,0,4],[4,2,0],[5,2,1],[6,2,1],[8,0,0]]
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
export const MAGIC_GRADE_DICE={1:[6],2:[10],3:[12],4:[12,12]}; // SRD v0.89: G4 com dois d12.
export const CREATION_REFERENCE={attributes:15,training:15,skills:15,total:15}; // SRD v0.89: 15 XP compartilhados, sem reservas por categoria.
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
export const naturalDE=s=>Math.min(9,Number(s.attributes?.agilidade||0)+Math.floor((Number(s.attributes?.vigor||0)+Number(s.attributes?.destreza||0))/2)+Math.floor(Number(s.practices?.atletismo||0)/3));
export const balance=s=>Number(s.attributes?.agilidade||0)>Number(s.attributes?.vigor||0)?"Leve":Number(s.attributes?.agilidade||0)<Number(s.attributes?.vigor||0)?"Pesado":"Médio";
export const maxCourage=level=>Math.min(15,10+Number(level>=5)+Number(level>=10)+Number(level>=20));
export const keepLimit=(level,extra=false,monster=false)=>monster?Math.min(Number(level)>=5?4:3,2+Math.max(0,Math.min(2,Number(extra)||0))):Math.min(4,(level>=10?3:2)+(extra?1:0));
export const narratorCap=players=>2+Math.max(0,Math.floor(Number(players)||0));
export const monsterCap=grade=>Math.max(1,Math.min(6,Math.floor(Number(grade)||1)));
export const loadCapacity=s=>1+Math.floor(Number(s.attributes?.forca||0)/3)+Math.floor(Number(s.attributes?.vigor||0)/3)+Math.floor(Number(s.practices?.atletismo||0)/3); // Formação Disciplina na carga: pendente.
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
export function buildPool(system,selection,{mode="normal",contextApproved=false,step=false,equipmentDie=0,magicGrade=1,magicElement="",magicSecondElement=""}={}){
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
  if(mode==="conjuracao"&&!skills.includes("criar-item-foco-magia")&&!["fogo","agua","vento","terra","sagrado","veneno","sangue","trevas"].some(id=>skills.includes(id)))errors.push("Conjuração exige Perícia elemental ou Criar Item de Foco e Magia (Psique).");
  if(mode!=="armas"&&mode!=="conjuracao")errors.push("Escolha Armas ou Conjuração.");
 }
 if(!errors.length){
  for(const src of [b,a,...(c?[c]:[])])for(const [i,sides] of sourceDice(src.group,src.key,system).entries())
    pool.push({id:src.group+"."+src.key+"."+i,group:src.group,key:src.key,sides});
  if(step){
   const d=pool.find(x=>x.group==="attribute"),next={4:6,6:10,10:12}[d?.sides];
   if(!next)errors.push("Não é possível elevar o dado.");
   else d.sides=next;
  }
  if(mode==="conjuracao"){
   const dice=MAGIC_GRADE_DICE[Number(magicGrade)]||[];
   if(!dice.length)errors.push("Grau mágico inválido ou sem dado definido.");
   else if(Number(magicGrade)===4){
    const learned=system.skills||[];
    const habilitado=(id)=>id==="psiquico"?learned.includes("criar-item-foco-magia"):learned.includes(id);
    if(!magicElement||!magicSecondElement||magicElement===magicSecondElement||
       !habilitado(magicElement)||!habilitado(magicSecondElement))
     errors.push("G4 exige dois elementos diferentes, cada qual com Perícia G3 habilitada, e confirmação do Narrador.");
   }
   dice.forEach((sides,i)=>pool.push({id:"magic.grade."+magicGrade+"."+i,group:"magic",
    key:"Grau "+magicGrade+" · dado "+(i+1),sides,baseSides:sides}));
  }
  if(equipmentDie&&mode!=="conjuracao"){
   if(![6,10,12].includes(Number(equipmentDie)))errors.push("Dado de equipamento inválido.");
   else pool.push({id:"equipment.0",group:"equipment",key:"equipment",sides:Number(equipmentDie)});
  }
 }
 if(pool.length>9)errors.push("Máximo absoluto de nove dados rolados.");
 if(pool.filter(x=>x.sides===20).length>2)errors.push("Máximo regular de dois d20.");
 return {ok:errors.length===0,errors,pool};
}
export function resolveRoll(rolled,selectedIds,options={}){
 const {de=1,level=1,extraKeep=false,step=false,courage=10,situation="neutral",
  weight=0,cancelP=0,convertPairs=0,skillBonusE=0,monster=false,hostile=false,threatGrade=1,bonusA=0,bonusP=0}=options;
 const errors=[],kept=rolled.filter(d=>selectedIds.includes(d.id));
 if(kept.length!==new Set(selectedIds).size)errors.push("Dados mantidos não encontrados.");
 const maxKeep=keepLimit(monster?threatGrade:level,extraKeep,monster);
 if(kept.length<1||kept.length>maxKeep)errors.push("Retenção fora do limite.");
 if(!rolled.some(d=>d.group==="attribute"))errors.push("A pilha deve conter um Atributo rolado.");
 if(Number(extraKeep)+Number(step)>(monster?99:courage))errors.push("Coragem insuficiente.");
 const raw=[0,0,0];for(const d of kept)faceSymbols(d.sides,d.face).forEach((v,i)=>raw[i]+=v);
 const crit=kept.length>=2&&kept.every(d=>d.face===d.sides);
 let convertedCrit=0,extraCritE=0,extraCritA=0;
 if(crit){convertedCrit=raw[2]>0?1:0;extraCritE=kept.length>=3?1:0;extraCritA=kept.length>=3?1:0;}
 const st=SITUATIONS[situation]||SITUATIONS.neutral;
 const a=Math.max(0,raw[1]+extraCritA+st.a+Number(weight)+Number(bonusA));
 const pBefore=Math.max(0,raw[2]-convertedCrit+Number(bonusP));
 if(!Number.isInteger(cancelP)||cancelP<0||cancelP>Math.min(pBefore,a))errors.push("Anulação de Pavor inválida.");
 if(!Number.isInteger(convertPairs)||convertPairs<0||cancelP+2*convertPairs>a)errors.push("Conversão 2A → 1E inválida.");
 const e=Math.max(0,raw[0]+convertedCrit+extraCritE+st.e+convertPairs+Number(skillBonusE)),p=Math.max(0,pBefore-cancelP),reached=e+p,success=reached>=de;
 const outcome=success?(p===0?"Acerto sem Pavor":p>e?"Acerto com Pavor":"Acerto neutro (com Pavor mantido)"):(p>0?"Falha com Pavor":e>0?"Falha com Êxito":"Falha");
 const rawDamage=e+Math.floor(p/2),damage=success?rawDamage*(crit&&kept.length===4?2:1):0;
 const critical=crit?kept.length:0,refund=crit?(kept.length>=3?2:1):0;
 return{ok:errors.length===0,errors,raw:{e:raw[0],a:raw[1],p:raw[2]},e,p,aRemaining:a-cancelP-2*convertPairs,
  reached,de,success,outcome,damage,critical,criticalRefundCourage:monster||hostile?0:refund,monsterCriticalPavor:monster||hostile?2*refund:0,
  freeCharacteristics:success&&crit?1:0,selected:kept};
}
