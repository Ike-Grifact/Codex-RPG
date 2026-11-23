# Codex RPG — SRD de Continuidade v0.91

**Data:** 22/11/2026  
**Estado:** consolidação de decisões autorais de playtest.  
**Precedência:** substitui os pontos incompatíveis do SRD v0.90, do SRD de Playtest Nível 1 v1.0 e do Livro do Jogador; demais decisões não revogadas permanecem.

## 1. Golpe Fulminante e Disparo Fulminante — DEFINIDO

Ao **ativar uma das duas Perícias** em ataque válido com arma equipada e habilitada, ela **eleva temporariamente UM dado da arma antes da rolagem**:

| Dado original da arma | Efeito ativado |
|---|---|
| d6 | d10 |
| d10 | d12 |
| d12 | d12 + mais 1d12 |

Não altera Grau comprado, não altera os dados das demais fontes, não transforma arma em d20, não supera **9 dados rolados** e respeita o limite de dados mantidos. A versão com d12 exige uma vaga real na pilha; se já houver 9 dados, não pode gerar um décimo.

**Conservam-se** os requisitos e restrições de compra e uso de cada Perícia, a incompatibilidade de Disparo Fulminante com armas de fogo e o efeito no acerto: **cada Pavor mantido não anulado causa 1 ponto de dano, em vez do cálculo convencional de ⌊P/2⌋**, sem apagar os riscos do Pavor. Golpe Fulminante é corpo a corpo; Disparo Fulminante aplica-se a arco, besta ou arremesso habilitado. Um mesmo dado de arma **não recebe duas elevações Fulminantes simultâneas**.

**Ativação [DEFINIDO / interpretação operacional para playtest]:** o custo-base permanece em 1 recurso por ativação, inclusive no crítico. Como o dado é alterado **antes** da rolagem, o gasto é registrado na conclusão da ação mesmo se houver falha na DE. Este procedimento substitui a ordem anterior em que só se ativava após acertar; **PENDENTE:** confirmação expressa do autor sobre eventuais reembolsos quando o ataque falha.

## 2. Economia de recursos: jogadores e inimigos — DEFINIDO

**Apenas personagens jogadores (PCs) possuem Coragem.** Todos os inimigos, inclusive **humanoides** e humanoides-monstros, **não têm Coragem** e usam sua reserva de **Pavor local** para retenção adicional, elevação, ativação de Perícias e outros custos originalmente em Coragem. O custo equivalente é de **1 Pavor por 1 Coragem** da ação correspondente; a reserva mantém o teto do Grau de ameaça (4P G1, até 8P). Sem Pavor suficiente, a ativação não ocorre; nenhum Pavor é gerado gratuitamente.

O **teto de gasto de Coragem dos PCs é 5 por rodada**, somando rolagens, elevações, retenções, custos de Saúde, Perícias ativas, esferas e outras ativações. Substitui a referência histórica exclusivamente *por rolagem* como limite de planejamento. Um gasto confirmado não volta ao orçamento da rodada quando Coragem é recuperada por crítico; o contador reinicia no começo da nova rodada. Uma única rolagem não pode gastar mais que 5.

**Várias Perícias podem ser ativadas na mesma ação/turno** quando seus requisitos e gatilhos são satisfeitos e o recurso total está disponível. Cada Perícia é cobrada separadamente e cada custo é debitado uma única vez. Não concede automaticamente efeitos incompatíveis ou Perícias não adquiridas. **PENDENTE:** procedimento geral de gasto por rodada em ações sem rolagem, sem contador explícito no registro antigo.

**Estados de Saúde dos inimigos:** mantêm os mesmos símbolos e penalidades dos jogadores. Para humanoides hostis incapacitados ou inconscientes, o custo anteriormente descrito em Coragem é pago em Pavor local. Para monstros extraordinários sem procedimento anterior para agir nesses estados, **PENDENTE**; os símbolos de penalidade continuam aplicáveis sem inventar conversões adicionais.

## 3. Domar Criatura Pequena: vínculo e serpente — DEFINIDO

Compra da Perícia (**1 XP**, requisitos **Influência 2 + Inteligência 1**) não concede automaticamente um animal. Quando há **uma criatura Pequena efetivamente domesticada e presente**, o domador recebe **+1 de Vida máxima na própria ficha**; a criatura tem sua Vida própria independente conforme regra vigente. A concessão do bônus **não é cura gratuita** e deve conservar dano já sofrido na migração. A alocação normativa da Vida adicional entre as quatro caixas ainda é **PENDENTE**; a ficha de playtest apresenta temporariamente o aumento em Saudável, sem alterar os estados-base.

**Auxílio ativo:** gastar **1 Coragem por uso/turno** faz a criatura ajudar na ação do domador, concedendo o **+1 Antecipar (A) de combate** já previsto como benefício de criatura Pequena, agora condicionado à ativação. Não concede turno independente extra, dado próprio da arma nem ação irrestrita. Para inimigo que possuir Perícia e criatura válida, aplica-se o equivalente em Pavor local.

**Exemplo da serpente domesticada:** se o domador ativar o auxílio e a ação atingir o alvo **que já está em Sangramento**, a serpente pode aplicar **estado Envenenado à Vida**. Sangramento é requisito; não precisa romper a armadura para estabelecer a condição na situação validada. A interface deve registrar Sangramento e Envenenado separadamente, sem inventar perda automática de Vida. **PENDENTE:** duração, frequência, acúmulos, eventual teste resistido, imunidades biológicas e efeitos numéricos de Envenenado; a aplicação atual do simulador é um marcador de condição, não uma fórmula universal.

## 4. Implementação e validação

- Ficha do PC: registro explícito do companheiro domesticado presente, nome e espécie; bônus condicionado de Vida; orçamento acumulado de Coragem por rodada; dados e ativação de Fulminantes.
- Criar Conflito: inimigos não possuem Coragem, gastam Pavor local mesmo quando humanoides; migrar cópias históricas que tinham Coragem para zero sem criar reembolso.
- Simulador comparativo: múltiplas Perícias selecionadas por ação, custos separados, elevação da arma antes de rolar, origem de cada símbolo, rastreio de estados Sangramento/Envenenado e auxílio da serpente.
- Preservar os limites **9 rolados / 4 mantidos**, faces simbólicas, Perícias já compradas e as demais decisões não alteradas.

**Regra substituída:** inimigos humanoides com Coragem; teto de 5 Coragens apenas por rolagem; Fulminantes apenas aumentando Pavor no dano sem elevar dado de arma; assistência da criatura Pequena passiva sem custo.


## 5. Complemento de implementação — 22/11/2026: características das armas e crítico [DEFINIDO / PENDENTE]

**Sem criar nova regra de dano:** o comparador passa a mostrar apenas características realmente constantes da arma equipada (inclusive após consultar o catálogo, caso a cópia importada não contenha a lista). A **Perícia correspondente ao tipo e peso** é condição de uso. Em acerto comum, a ativação básica de uma característica custa **1 Coragem** (PC) ou **1 Pavor local** (inimigo). Em crítico válido, uma característica é gratuita, e a segunda exige o custo normal, conforme o Livro do Jogador. Quando há **Maestria da família da arma** efetivamente adquirida e habilitação-base, uma característica é gratuita no acerto comum; no crítico, duas características distintas são gratuitas e a terceira diferente custa 1 recurso. A mesma Perícia não é debitada outra vez por também estar selecionada na lista genérica.

- **Cortante — DEFINIDO:** somente com acerto e ativação de propriedade habilitada, registrar **Sangramento** no alvo mesmo quando ele utiliza armadura. A condição não aplica perda de Vida, dano periódico nem penalidade numérica gratuita.
- **Perfurante físico — DEFINIDO:** em acerto com a característica habilitada, calcular o dano potencial à **Integridade** com **1 ponto por Pavor não anulado**, em vez de ⌊P/2⌋. O efeito não ignora Integridade nem acrescenta dano direto à Vida. Se Fulminante já substituiu ⌊P/2⌋ por P, **não se soma o benefício de Perfurante duas vezes**. Escudo físico efetivamente levantado e Escudo Arcano Psíquico ativo anulam **a propriedade**, sem cancelar o dano básico; a confirmação da defesa é manual no comparador.
- **Cravar — DEFINIDO:** somente se a arma Média/Pesada possui a propriedade, acertou a DE e o escudo físico está equipado no alvo; escudo Pesado exige arma Pesada. Registrar a arma como presa ao escudo, desequipá-la do atacante e guardar o vínculo para retirada. Cada arma presa corresponde a **−1E cumulativo somente ao Levantar Escudo**; sem inventar a automação dessa ação onde não está implementada.
- **Barulhenta — DEFINIDO:** característica **passiva de +1P**, mesmo em crítico e sem custo próprio.
- **Contundente, Enganchar, Longa e demais efeitos sem procedimento universal — PENDENTE:** registrar a ativação para resolução pelo Narrador, sem criar automaticamente Derrubado, Imobilizado, dano ou deslocamento.
- **Crítico — DEFINIDO:** todas as faces **numéricas máximas** dos dados mantidos (pelo menos dois) contam, **inclusive a face vazia 4 do d4**; o d10 face 10 conserva **2E + 1A**. A interface realça essas faces em dourado, registra sua numeração e a quantidade mantida, calcula os efeitos críticos do motor vigente e preserva esses dados no histórico.
- **Seleção automática — ferramenta, não nova regra:** procura combinações válidas dos dados disponíveis até o teto de mantidos, gastando Antecipar no máximo uma vez por símbolo e respeitando os recursos existentes. O jogador escolhe entre prioridades **Equilibrado**, **Acerto limpo/segurança** e **Dano/crítico**. Nenhuma prioridade autoriza converter Pavor em acerto limpo sem pagar os A exigidos.

**PENDENTE:** posicionamento/alcance de escudos levantados e ativação de manobras não padronizadas devem continuar com o Narrador. A implementação não muda as propriedades do catálogo nem concede uma propriedade ausente da arma.
