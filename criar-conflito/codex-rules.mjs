// Cópia isolada da lógica de regras do SRD v0.44 usada apenas pelo criador de conflitos.
// Origem: foundry-prototype/module/rules.mjs na revisão v0.44; sem alterar o Foundry publicado.
/* Codex RPG — motor matemático independente do Foundry. Estado: protótipo. */
// SRD v0.43: em ativações pagas, custo-base 1 PP OU 1 Coragem; efeito elemental é gratuito sob foco e habilitação.
// Textos históricos de preço excepcional requerem auditoria individual; não alterar compra XP por dedução.
export const ATTRIBUTES=[["forca","Força"],["agilidade","Agilidade"],["destreza","Destreza"],["inteligencia","Inteligência"],["influencia","Influência"],["vigor","Vigor"]];
export const KNOWLEDGES=[["protecao","Proteção"],["astronomia","Astronomia"],["medicina","Medicina"],["alquimia","Alquimia"],["engenharia","Engenharia"],["erudicao","Erudição"]];
export const PRACTICES=[["armas_conjuracao","Disciplina"],["atletismo","Atletismo"],["furtividade","Furtividade"],["artesao","Artesão"],["apresentacao","Apresentação"],["coleta","Coleta"]];
export const SKILLS=[{"id":"marciais","name":"Artes Marciais","detail":"Especialização desarmada. Exige Disciplina 1; outras regras em playtest.","cost":1},{"id":"montar","name":"Montar Animal","detail":"Requer Influência grau 2.","cost":2},{"id":"provocacao-sofisticada","name":"Provocação Sofisticada","detail":"Influência 2; 1 XP. O texto atual repete Provocar básico. Benefício adicional PENDENTE; não acumula Vantagens ou Desvantagens.","cost":1},{"id":"combinacao","name":"Combinação de Fontes","detail":"Habilita propor a terceira fonte pertinente.","cost":2},{"id":"criar-item-foco-magia","name":"Criar Item de Foco e Magia","detail":"1 XP · Disciplina 1 + Inteligência 1 + Artesão 1. SUBSTITUI Aprendiz de Conjurador e Magia Única. Ativa UM efeito Psíquico no acerto por 1 PP/1 Coragem; foco por Artesão recarrega em N rodadas no Grau N. Desde Disciplina 2, pode criar fora de combate magias G2/G3 por 1 PP/1 Coragem e memorizar em slots; Criar Magia reduz 1 ponto do peso mental de magia criada e memorizada, mesmo com foco (G2=1, G3=2, G4=3); peso mínimo de G1 pendente. Capacidade mental é 1 ponto por Grau de Disciplina, não por dado. Pesos nominais G1=1, G2=2, G3=3, G4=4. Conjuração rápida da magia preparada conforme regras ainda pendentes.","cost":1},{"id":"escudo-arcano","name":"Escudo Arcano","detail":"Requisitos Inteligência 2, Vigor 1, Criar Item de Foco e Magia. Ativação 1 PP ou 1 Coragem. Escudo pessoal, parede de 3 m ou círculo 3×3 m, por 1 rodada. Teste Disciplina com Atributo (terceira fonte com Disciplina Avançada); E+P definem DE e Integridade simbólica. E cancela E ou 2P; P cancela P, 2P cancelam E. Mais 1 PP/1 Coragem amplia 3 m ou a área. Imunidade ao elemento inserido, exceto Sagrado imune a Trevas e Trevas a Sagrado; juntá-los anula vantagens elementais. Com Improviso e Perícia do elemento troca o tipo; com Maestria ativada na conjuração, ataques e atravessamentos disparam efeitos especiais durante a duração. Corpo a corpo de dentro ignora defesa.","cost":1},{"id":"conjuracao-equilibrada","name":"Conjuração Refinada","detail":"1 XP · Disciplina 2 + Criar Item de Foco e Magia + Inteligência 2 + Destreza 2. Especialização de alcance de disparos e efeitos mágicos. Aumento em metros, custo e aplicação PENDENTES até reescrita autoral; não altera peso nem concede dados maiores. Identificador legado preservado.","cost":1},{"id":"improviso","name":"Improviso Elemental","detail":"Requisitos Disciplina 1, Inteligência 1, Destreza 1 e Criar Item de Foco e Magia. Passiva: +1A em Disciplina e Conjuração, adicionando um elemento realmente presente na cena para vantagens elementais e dano de impacto, sem ativar sua propriedade especial. Acumula com Maestria Elemental.","cost":1},{"id":"mestre","name":"Maestria Elemental","detail":"Requisitos Disciplina 3, Inteligência 3, Destreza 3, Criar Item de Foco e Magia, Improviso Elemental e pelo menos uma Perícia em Ar, Sangue, Água, Fogo, Terra, Veneno, Sagrado ou Trevas. +1A cumulativo ao Improviso em Disciplina e Conjuração. Custo 1 PP ou 1 Coragem para mesclar dois elementos e ativar simultaneamente as propriedades especiais dos dois, exigindo adquirir a Perícia de ambos. ID legado mestre preservado.","cost":1},{"id":"fogo","name":"Perícia em Elemento Fogo","detail":"1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Permite conjurar magias Leves de Fogo. Em ataque acertado, mesmo sem crítico, 1 PP/1 Coragem ativa UM efeito especial. G1: disparo a distância causa dano à armadura, sem queimadura direta à Vida; iluminar e conduzir chamas com fonte/faísca disponível (lamparina, isqueiro, foco pequeno encantado ou luvas de faísca); não invoca fogo do nada. G2: área 4×4, cone/linha/círculo, dano à Vida e armadura; SEM FOCO invocar fogo custa 1 Coragem ADICIONAL à ativação normal: 1 PP + 1 Coragem ou 3 Coragens. G3: conjurar no final do turno dos aliados, área 8×8, círculo/cone/linha. Pode amplificar pequena faísca em incêndios; dano persistente, unidade das áreas e alcance pendentes. Não automatizado.","cost":1},{"id":"agua","name":"Perícia em Elemento Água","detail":"1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Habilita magias Leves de Água. Em ataque acertado, mesmo sem crítico, 1 PP/1 Coragem ativa UM efeito especial. G1: Congelar por 1 rodada sem dano no estado Leve; extrair água do ar, mover, molhar e limpar. G2: Perfurar no CRÍTICO ou por ativação paga; dano à Vida e à armadura. G3: conjurar no final do turno dos aliados; Empurrar, Perfurar, Congelar e dano à Vida e à armadura, mantendo propriedades menores pertinentes. Resolução e efeitos exatos não automatizados.","cost":1},{"id":"vento","name":"Perícia em Elemento Ar","detail":"1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Habilita magias Leves de Ar. No acerto, mesmo sem crítico, gaste 1 PP ou 1 Coragem para escolher UM efeito especial. G1: autoempurrão +4 m de deslocamento; puxar/empurrar objetos; linha, círculo, cone, X. G2: sufocar com dano à Vida ou armadura, puxar, empurrar + derrubar com dano, deslocamento até +8 m. G3: conjurar no final do turno dos aliados, área grande e múltiplos alvos, tornado/rajada, possíveis danos por queda (16 m ainda sem interpretação geométrica). Formas: linha, círculo, cone, X. TAMBÉM pode recuperar Fôlego (Grau, quantidade e gatilho pendentes). Efeitos não automatizados.","cost":1},{"id":"terra","name":"Perícia em Elemento Terra","detail":"1 XP · Disciplina 1 + Criar Item de Foco e Magia + Inteligência 1. Conjuração elemental Leve de Terra. Ao acertar ataque, inclusive não crítico, 1 PP ou 1 Coragem ativa UM efeito escolhido. G1: Desvantagem 2 RODADAS (terra nos olhos), emaranhar pés, derrubar, lançar pequenas pedras, criar plataformas de deslocamento, sentido sísmico 18×18 m para detectar furtivos e armadilhas. G2: enredar e imobilizar, Desvantagem 2 TURNOS, espinhos danificam armadura/proteção, sentido sísmico 32×32. G3: conjurar ao final do turno dos aliados, área 5×5, linha/cone/círculo A PARTIR DO ALVO, dano, empurrão e derrubada, sentido sísmico 64×64. Unidades não informadas e efeitos adicionais não automatizados.","cost":1},{"id":"sagrado","name":"Perícia em Elemento Sagrado","detail":"Requisitos Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia; magias Leves. Ativação especial 1 PP ou 1 Coragem. Suporte em si ou aliado próximo exige alcançar a DE do beneficiário. Cada E excedente recupera 1 Coragem, cada P não anulado cancela um E destinado a recuperação (não reaproveitado como dano). Em área, todos os aliados beneficiados recuperam igualmente; E excedentes podem causar dano aos inimigos cujas DEs foram alcançadas. Conjurador escolhe enfoque em dano, suporte ou combinação. Aliados não sofrem dano sagrado de suporte. G2/G3 por combinação elemental.","cost":2},{"id":"veneno","name":"Perícia em Elemento Veneno","detail":"Conjuração distinta da alquimia Criar Veneno. No acerto em alvo com Sangramento, gasta 1 PP ou 1 Coragem para aplicar 1 acúmulo por 2 rodadas sem renovar os anteriores. A partir de 2/3 da Vida atual, Ferido; se acúmulos alcançam Vida atual, Incapacitado. Se estiver Envenenado com exatamente 2 de Vida atual OU atingir 12 acúmulos ativos, Inconsciente. Não causa dano direto à Vida; criaturas biologicamente incompatíveis podem ser imunes. Graus 2 e 3 exigem combinação elemental.","cost":2},{"id":"sangue","name":"Perícia em Elemento Sangue","detail":"Requisitos Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia; magias Leves. Ativação especial 1 PP ou 1 Coragem. Conjurar sem Sangramento próprio custa inicialmente 2 Vida mesmo em falha; autoaplicar Sangramento na conjuração reduz esse custo para 1 Vida; se já estava em Sangramento, o custo inicial é zero. +1P comum na conjuração. Ao acertar alvo em Sangramento ou já danificado na Vida, escolher 2 Vida diretos (não comba com colossal) OU dano convencional de Integridade com sangue coagulado, consumido no uso. Sangue fluido pode ser remanipulado sem aumento de dano, mas alvo único sem mescla. Transfusão é outra Perícia. G2/G3 por combinação.","cost":2},{"id":"trevas","name":"Perícia em Elemento Trevas","detail":"Requisitos Disciplina 2, Inteligência 2 e Criar Item de Foco e Magia; magias Leves. Ativação especial 1 PP ou 1 Coragem após acerto mesmo sem crítico. Escurecimento, Pavor e maldições. Técnica especializada usa uma rolagem contra um ou dois alvos: +2P antes da DE, conta para dano e Pavor de risco. O Pavor não anulado é dividido igualmente entre dois alvos ou concentrado em um, sem duplicar pontos; um só alvo também é válido. G2/G3 exigem combinação.","cost":2},{"id":"armas-leves","name":"Perícia em Armas Leves","detail":"Disciplina 1; 2 XP. Crítico ativa UMA característica; acerto sem crítico exige 1 PP/1 Coragem. Ignora Desvantagem de peso contra pesados. Efeito não automatizado.","cost":2},{"id":"armas-medias","name":"Perícia em Armas Médias","detail":"Disciplina 1 + Força 1; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 PP/1 Coragem. Ignora Desvantagem de peso contra médios. Não automatizado.","cost":2},{"id":"armas-pesadas","name":"Perícia em Armas Pesadas","detail":"Disciplina 2 + Força 2; 2 XP. Crítico ativa UMA característica; acerto não crítico 1 PP/1 Coragem. Ignora Desvantagem de peso contra leves. Não automatizado.","cost":2},{"id":"disciplina-avancada","name":"Disciplina Avançada","detail":"Disciplina 2; ao realizar uma ação com Disciplina, pode acrescentar mais 1 Atributo, Conhecimento ou Prática pertinente. Na rolagem, selecione a fonte e confirme a pertinência; respeite o limite de dados.","cost":1},{"id":"golpe-fulminante","name":"Golpe Fulminante","detail":"Após acerto, pagar a ativação transforma cada Pavor mantido não anulado em 1 dano. Pavor continua gerando risco e Pressão. Especializações: Armas Leves, Médias, Pesadas, Manejo Duplo ou Pugilismo. Arremesso não satisfaz esse requisito. Crítico NÃO isenta o custo da técnica.","cost":1},{"id":"espalhar-golpe","name":"Golpe Colossal","detail":"Substitui Espalhar Golpe. Alvo principal recebe dano integral. Cada gasto permite atacar até 2 inimigos adicionais a 3 m, usando a mesma rolagem contra DE individual, e aplica metade do dano de Êxitos arredondada para baixo. O custo é consumido mesmo se a DE adicional não for alcançada. SEM bônus de +1E. Não espalha automaticamente o dano de Pavor de Golpe Fulminante. Arremesso não é especialização aceita. Centro da área PENDENTE.","cost":1},{"id":"pugilismo","name":"Pugilismo","detail":"Disciplina 1 + Força 2 + Destreza 1. Desarmado: 1 PP/1 Coragem para mudar peso do soco. Pesos disponíveis PENDENTES.","cost":1},{"id":"artista-marcial","name":"Artista Marcial","detail":"Disciplina 2 + Pugilismo + Destreza 2. 1 PP/1 Coragem por manobra ou crítico ativando Pugilismo; só uma por vez: Empurrar, Agarrar, Derrubar, Desarmar.","cost":1},{"id":"maestria-arremesso-armas","name":"Perícia em Arremesso de Armas","detail":"Qualquer personagem pode arremessar uma arma sem esta Perícia, causar dano básico, passar a um aliado ou afastar uma arma de inimigo. A Perícia permite ativar os efeitos próprios da arma ao acertar pagando 1 PP ou 1 Coragem, e exige possuir a especialização corpo a corpo do peso usado. Alcances efetivos: leve 12 m; média 8 m; pesada 4 m. Cada metro além impõe um patamar: +1 m −1A, +2 m −1E, +3 m −2E (Acerto de Sorte); além do terceiro metro excedido, resolução PENDENTE; não sofre Desvantagem por proximidade. Aliados próximos ao alvo podem impor Desvantagem. A arma acerta e aloja, com penalidade pertinente. Acerto sem Pavor permite nova jogada, avançar, recuperar a arma e atacar novamente; acerto com Pavor pode permitir ao inimigo usar a arma. Falha sem Pavor: cai no caminho e 1A permite correr para recuperá-la; falha com Pavor: cai próxima ao inimigo ou pode atingir aliado próximo se alcançar sua DE. Em falha a distância de queda é E mantido + P mantido não anulado + E convertido de 2A, em metros. Retirar arma alojada usa Armas + Força + Atletismo contra resistência de Força + Vigor + Atletismo do inimigo, com cálculo da DE PENDENTE. Habilita Disparo Fulminante/Múltiplo/Tático; Disparo Violento só com arremesso MÉDIO ou PESADO.","cost":1},{"id":"disparo-fulminante","name":"Disparo Fulminante","detail":"Técnica somática de arco, besta ou arremesso. No acerto, cada Pavor mantido não anulado provoca 1 dano, sem retirar suas consequências. A ativação não é gratuita no crítico. NÃO se aplica a armas de fogo. Pode combinar com outras técnicas somáticas pagando custos separados.","cost":1},{"id":"disparo-multiplo","name":"Disparo Múltiplo","detail":"A mesma rolagem é comparada à DE de cada alvo. O raio de 3 m é centrado no ALVO PRINCIPAL; cada 1 PP ou 1 Coragem permite até dois alvos adicionais, e o custo é consumido mesmo que não se alcance a DE de um deles. O adicional recebe metade do dano de Êxitos, arredondada para baixo, e somente 0,5 de dano por Pavor válido mesmo se Disparo Fulminante for ativado no principal. Cada técnica é paga separadamente; crítico não dispensa custo. Armas de fogo usam apenas a modalidade especial Descarregar Tambor, nunca o efeito de Disparo Fulminante.","cost":1},{"id":"recobrar-coragem","name":"Recobrar Coragem","detail":"1 XP. Após descanso curto ou longo e cena narrativa, recupera 2 Coragens. Recuperação anotada manualmente.","cost":1},{"id":"maestria-manejo-duplo","name":"Perícia em Manejo Duplo","detail":"Permite equipar e utilizar duas armas simultaneamente e realizar um único ataque. Rola Armas + Armas + Atributo, respeitando limites da pilha. Dano básico é aplicado UMA vez: empunhar duas armas não soma dano gratuito. Crítico ativa UMA característica escolhida do golpe combinado sem custo e pode pagar 1 PP ou 1 Coragem para ativar mais uma; acerto comum ativa UMA característica escolhida por 1 PP ou 1 Coragem. Efeitos próprios, como perfurar, sangrar ou envenenar, continuam condicionados às propriedades e ao alvo. O simulador registra a compra mas não automatiza duas armas na mesma pilha.","cost":1},{"id":"criar-veneno","name":"Criar Veneno","detail":"Não concede conjuração elemental. Usa materiais venenosos coletados para produzir doses não diluídas. 1 dose ingerida = 1 acúmulo. Só UMA dose em cada arma; para aplicar por golpe, o alvo deve estar em Sangramento. Duas adagas envenenadas usadas com Manejo Duplo podem aplicar 2 acúmulos se os efeitos de ambas forem ativados, um de cada arma. Veneno usa VIDA ATUAL: a partir de 2/3 da Vida atual o alvo fica Ferido; ao atingir total de Vida atual em acúmulos, fica Incapacitado. Fica INCONSCIENTE caso esteja Envenenado com exatamente 2 de Vida atual OU ao atingir 12 acúmulos ativos, independentemente da Vida. Cada acúmulo dura 2 rodadas individualmente. Amplificar Veneno será futura Perícia PENDENTE. Graus 2/3 exigem combinação elemental (sem tornar a alquimia magia).","cost":1},{"id":"criar-antidoto","name":"Criar Antídoto","detail":"Criado de materiais venenosos coletados. Cada Antídoto criado vale uma dose; remove um acúmulo ao ser ingerido ou aplicado em alvo em Sangramento. Remover dois acúmulos exige duas doses não diluídas; diluição não multiplica eficácia. Pode ser enviado por Transfusão quando seus requisitos forem atendidos; aquisição de Transfusão ainda pendente.","cost":1},{"id":"armas-longo-alcance","name":"Perícia em Armas de Longo Alcance","detail":"Arco curto: contra alvo leve −1A, médio +1A, pesado neutro. Arco longo (2 mãos): leve −1A, médio neutro, pesado +1A. Besta pequena: neutro para todos os pesos. Besta de duas mãos: leve −1A, médio neutro, pesado +1A. Os valores são naturais inclusive para quem não possui a Perícia. O especialista elimina somente Desvantagem por peso e mantém Vantagens. Crítico ativa UMA característica escolhida da arma sem custo; pagamento adicional de 1 PP ou 1 Coragem ativa uma segunda; acerto normal exige 1 PP ou 1 Coragem.","cost":2},{"id":"disparo-violento","name":"Disparo Violento","detail":"Técnica somática independente de Disparo Fulminante e Múltiplo. Ao acertar, derruba e empurra o inimigo 4 m. Aceita arco longo, besta de duas mãos ou arma arremessada MÉDIA ou PESADA com a Perícia em Arremesso de Armas. Não aceita arremesso leve. Ativação própria é paga inclusive em crítico.","cost":1},{"id":"armas-fogo","name":"Perícia em Armas de Fogo","detail":"Crítico ativa UMA característica escolhida gratuitamente; acerto normal custa 1 PP ou 1 Coragem. Ignora apenas Desvantagens naturais de peso. Tabela natural contra peso leve/médio/pesado: Revólver −1A/neutro/neutro; Pistola −1A/neutro/neutro; Metralhadora −1A/neutro/neutro; Shotgun (escopeta) +1A/neutro/neutro; Sniper +1A/+1A/+1A; Lança-granadas −1A/neutro/neutro. Descarregar Tambor: modalidade especial de Disparo Múltiplo para armas automáticas/semiautomáticas, alvo ÚNICO, rolagem única, consome TODAS as munições disponíveis, custa 1 PP OU 1 Coragem POR TIRO. Primeiro tiro recebe dano integral de Êxitos; cada tiro adicional recebe metade do dano dos Êxitos arredondada para baixo. Pavor NÃO causa dano. Se há 1 ou mais Pavor mantidos e NÃO anulados, a arma sujeita trava; P anulado com A ou descartado não trava por essa condição. O revólver não trava e não é arma automática. Disparo Fulminante NÃO se aplica a armas de fogo. A ligação de aquisição entre esta modalidade e os pré-requisitos de Disparo Múltiplo permanece PENDENTE de exceção, não inventar.","cost":3},{"id":"golpe-baixo","name":"Golpe Baixo","detail":"Técnica somática: chutar ponto vulnerável, jogar terra nos olhos e outros golpes desleais. Ao acertar aplica Desvantagem (−1A) por 1 rodada. Contra inimigos com Inteligência grau ZERO, o inimigo ignora Provocar e fixa quem aplicou Golpe Baixo como alvo até que um dos dois seja eliminado, mesmo após terminar a rodada de Desvantagem. Não concede movimentação ou turno gratuito.","cost":1},{"id":"furtividade","name":"Perícia em Furtividade","detail":"Ao usar Furtividade como fonte do teste, recebe +1A automaticamente e sem custo. Cumulativa com outras Vantagens legítimas como Concentrado, mas cada símbolo A só pode ser gasto uma vez. Alguns inimigos são IMUNES a Furtividade; vantagens não anulam essa imunidade nem garantem ocultação.","cost":1},{"id":"furtividade-avancada","name":"Furtividade Avançada","detail":"Em teste com Furtividade habilita terceira fonte pertinente com seus dados comprados, respeitando teto de dados rolados e mantidos e confirmação do Narrador. Não concede +1E automático nem modifica fonte sem pertinência. Funciona em combinação Furtividade + Atributo + complemento e permite segundo Atributo pertinente no simulador, sem custo de ativação.","cost":1}];
export const ATTRIBUTE_DICE=[[4],[6],[6,6],[6,6,6],[6,6,10],[6,10,10],[10,10,10]];
export const TRAINING_DICE=[[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
export const MONSTER_DICE=[[4],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
export const FACES={
4:[[0,0,0],[0,0,0],[0,0,1],[0,1,1]],
6:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0]],
10:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,1,0]],
12:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[1,2,1],[0,0,2]],
20:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,1,0],[2,1,0],[2,1,1],[2,2,1],[2,2,1],[0,0,2],[2,2,0],[3,2,0],[4,2,0],[0,0,4],[4,2,0],[5,2,1],[6,2,1],[8,0,0]]
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
export const CREATION_REFERENCE={attributes:6,training:8,skills:5,total:19}; // 6+8+5 experimental.
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
export const lifeMax=s=>3+Number(s.attributes?.vigor||0)+Math.floor(Number(s.attributes?.forca||0)/2);
export const naturalDE=s=>Math.min(9,Number(s.attributes?.agilidade||0)+Math.floor(Number(s.attributes?.destreza||0)/2)+Math.floor(Number(s.attributes?.vigor||0)/2)+Math.floor(Number(s.practices?.atletismo||0)/3));
export const balance=s=>Number(s.attributes?.agilidade||0)>Number(s.attributes?.vigor||0)?"Leve":Number(s.attributes?.agilidade||0)<Number(s.attributes?.vigor||0)?"Pesado":"Médio";
export const maxPP=level=>level>=20?3:level>=10?2:level>=5?1:0;
export const keepLimit=(level,extra=false,monster=false)=>monster?Math.min(Number(level)>=2?4:3,2+Math.max(0,Math.min(2,Number(extra)||0))):Math.min(4,(level>=6?3:2)+(extra?1:0));
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

export const loadCapacity=s=>1+Math.floor(Number(s.attributes?.forca||0)/3)+Math.floor(Number(s.attributes?.vigor||0)/3)+Math.floor(Number(s.practices?.atletismo||0)/3); // Formação Disciplina na carga: pendente.
export const affinity=(attack,target)=>({leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}})[attack]?.[target]??0;
export function xpLedger(s){
 const attr=ATTRIBUTES.reduce((n,[k])=>n+XP_ATTRIBUTE[Number(s.attributes?.[k]||0)],0);
 const knowledge=KNOWLEDGES.reduce((n,[k])=>n+XP_TRAINING[Number(s.knowledges?.[k]||0)],0);
 const practices=PRACTICES.reduce((n,[k])=>n+XP_TRAINING[Number(s.practices?.[k]||0)],0);
 const perks=(s.skills||[]).reduce((n,id)=>n+(SKILLS.find(x=>x.id===id)?.cost||0),0);
 const spent=attr+knowledge+practices+perks,grant=Number(s.xp||0)+(s.monsterRules?0:19);
 return {attributes:attr,training:knowledge+practices,skills:perks,spent,grant,left:grant-spent,
  state:s.monsterRules?"XP monstruoso: definir orçamento por Grau.":"19 XP iniciais: orçamento 6/8/5 experimental; excedentes não são autorizados pelo cálculo."};
}
// A ordem de escolha não determina a categoria da fonte (decisão de 15/11/2026).
const isDiscipline=src=>src?.group==="practice"&&src.key==="armas_conjuracao";
const isFurtividade=src=>src?.group==="practice"&&src.key==="furtividade";
const hasDualHandling=system=>(system.skills||[]).some(id=>["maestria-manejo-duplo","manejo-duplo"].includes(id));
export function mayComplement(system,first,mode="normal",second=null){
 const skills=system.skills||[];
 if(system.monsterRules)return true; // Criaturas só têm Atributos: 2 ou 3 fontes, em qualquer Grau.
 const chosen=[first,second];
 if(skills.includes("combinacao"))return true; // compatibilidade com fichas antigas
 if(chosen.some(isDiscipline)&&skills.includes("disciplina-avancada")&&Number(system.practices?.armas_conjuracao||0)>=2)return true;
 if(chosen.some(isDiscipline)&&hasDualHandling(system))return true;
 if(chosen.some(isFurtividade)&&skills.includes("furtividade-avancada")&&Number(system.practices?.furtividade||0)>=2)return true;
 return false;
}
// Uma elevação comum compra temporariamente o GRAU seguinte da aptidão escolhida.
// Não altera XP nem a ficha, e não troca um único dado isolado.
export function elevationChoices(system,selection){
 const chosen=[selection?.base,selection?.attribute,...(selection?.complement?[selection.complement]:[])];
 const counts=new Map(),result=[];
 for(const src of chosen){
  if(!src||( !GROUPS[src.group] || !GROUPS[src.group].some(([key])=>key===src.key)))continue;
  const code=src.group+"."+src.key,copy=counts.get(code)||0;counts.set(code,copy+1);
  const field={attribute:"attributes",knowledge:"knowledges",practice:"practices"}[src.group];
  const grade=Number(system?.[field]?.[src.key]||0);
  if(!Number.isInteger(grade)||grade<0||grade>=6)continue;
  const table=src.group==="attribute"?(system.monsterRules?MONSTER_DICE:ATTRIBUTE_DICE):TRAINING_DICE;
  result.push({id:code+(copy?".duplo":""),group:src.group,key:src.key,
   grade,before:[...table[grade]],after:[...table[grade+1]]});
 }
 return result;
}
export function buildPool(system,selection,{mode="normal",step=false,stepSourceId="",equipmentDie=0}={}){
 const errors=[],pool=[],first=selection?.base,second=selection?.attribute,third=selection?.complement;
 const monster=!!system.monsterRules,selected=[first,second,...(third?[third]:[])];
 const valid=src=>!!src&&(GROUPS[src.group]||[]).some(([key])=>key===src.key);
 const discipline=selected.filter(isDiscipline).length,dual=hasDualHandling(system);
 if(!valid(first)||!valid(second))errors.push("Selecione duas fontes válidas.");
 if(monster&&selected.some(src=>src?.group!=="attribute"))errors.push("Criaturas/monstros não humanoides combinam apenas Atributos.");
 if(!monster&&valid(first)&&valid(second)&&first.group===second.group&&
   !(isDiscipline(first)&&isDiscipline(second)&&dual))
   errors.push("As duas fontes básicas devem ser de categorias diferentes (Atributo, Conhecimento ou Prática).");
 if(valid(first)&&valid(second)&&first.group===second.group&&first.key===second.key&&
   !(isDiscipline(first)&&dual))errors.push("Aptidão duplicada na combinação básica.");
 if(third){
  if(!valid(third))errors.push("Terceira fonte inválida.");
  if(!mayComplement(system,first,mode,second))errors.push("Terceira fonte exige Perícia ou capacidade da criatura.");
 }
 for(let i=0;i<selected.length;i++){
  const src=selected[i];
  if(!valid(src))continue;
  if(selected.slice(0,i).some(other=>other?.group===src.group&&other.key===src.key)&&
    !(isDiscipline(src)&&dual&&discipline===2))
   errors.push("Não repita a mesma aptidão (exceto Disciplina com Manejo Duplo).");
 }
 if(discipline>2)errors.push("Manejo Duplo permite no máximo duas seleções de Disciplina.");
 if(discipline&&!monster){
  const skills=system.skills||[];
  if(mode==="conjuracao"&&!skills.includes("criar-item-foco-magia"))
   errors.push("Conjuração exige Criar Item de Foco e Magia.");
  if(!["armas","conjuracao"].includes(mode))errors.push("Escolha Armas ou Conjuração para Disciplina.");
 }
 const elevations=elevationChoices(system,selection);
 if(step&&(!stepSourceId||!elevations.some(x=>x.id===stepSourceId)))
  errors.push("Selecione uma aptidão elegível para elevar um Grau temporário.");
 if(!errors.length){
  const counts=new Map();
  for(const src of selected){
   const code=src.group+"."+src.key,copy=counts.get(code)||0;counts.set(code,copy+1);
   const slot=code+(copy?".duplo":"");
   const elevated=step&&elevations.find(x=>x.id===slot);
   const sidesList=elevated?elevated.after:sourceDice(src.group,src.key,system);
   for(const [i,sides] of sidesList.entries())
    pool.push({id:slot+"."+i,group:src.group,key:src.key,sides,baseSides:sides,temporaryGrade:!!elevated});
  }
  if(equipmentDie){
   if(![6,10,12].includes(Number(equipmentDie)))errors.push("Dado de equipamento inválido.");
   else pool.push({id:"equipment.0",group:"equipment",key:"equipment",sides:Number(equipmentDie),baseSides:Number(equipmentDie)});
  }
 }
 if(pool.length>9)errors.push("Máximo absoluto de nove dados rolados.");
 if(pool.filter(x=>x.sides===20).length>2)errors.push("Máximo regular de dois d20.");
 return {ok:errors.length===0,errors,pool};
}
export function resolveRoll(rolled,selectedIds,options={}){
 const {de=1,level=1,extraKeep=false,step=false,courage=10,situation="neutral",
  weight=0,cancelP=0,convertPairs=0,skillBonusE=0,monster=false,hostile=false,threatGrade=1,bonusA=0,bonusP=0,enemyKeepLimit=null}=options;
 const errors=[],kept=rolled.filter(d=>selectedIds.includes(d.id));
 if(kept.length!==new Set(selectedIds).size)errors.push("Dados mantidos não encontrados.");
 // O teto próprio do inimigo vem do Grau da ameaça, não de um nível fictício.
 // Usar override somente na resolução hostil impede afetar Marcos de jogadores.
 const enemyOverride=hostile&&Number.isInteger(enemyKeepLimit)&&enemyKeepLimit>=1&&enemyKeepLimit<=4;
 const maxKeep=enemyOverride?enemyKeepLimit:keepLimit(monster?threatGrade:level,extraKeep,monster);
 if(kept.length<1||kept.length>maxKeep)errors.push("Retenção fora do limite.");
 if(monster&&!rolled.some(d=>d.group==="attribute"))errors.push("Monstros precisam de Atributo na pilha.");
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
  reached,de,success,outcome,damage,critical,criticalRefundCourage:monster||hostile?0:refund,
  criticalRefundPP:monster||hostile?0:refund,monsterCriticalPavor:monster||hostile?2*refund:0,
  freeCharacteristics:success&&crit?1:0,selected:kept};
}
