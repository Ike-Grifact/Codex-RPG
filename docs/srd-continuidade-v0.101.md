# Codex RPG — SRD de Continuidade v0.101

**Data:** 23/11/2026  
**Estado:** **DEFINIDO** — esclarecimento autoral do pagamento de Coragem e sua recuperação em um crítico.  
**Precedência:** complemento posterior à v0.100; substitui apenas sua pendência sobre como conciliar o custo de 1 Coragem da tentativa com a gratuidade da característica no crítico. Preserva custos, limites, recuperação geral por crítico e habilidades especiais do SRD vigente.

## 1. Pagamento da tentativa e recuperação no crítico [DEFINIDO]

O jogador declara a ação, escolhe se ativará uma Perícia que exige **1 Coragem**, paga **1 Coragem antes de rolar**, e só então realiza o teste.

- **Falha:** a ativação não alcança seu efeito condicionado ao acerto; a Coragem continua gasta.
- **Acerto comum:** a ativação pode produzir seu efeito; a Coragem continua gasta.
- **Crítico válido com acerto:** o jogador **recupera 1 Coragem do custo pago**. A característica ativada torna-se gratuita **no saldo final**, não na declaração da ação.

**Não adicionar um segundo reembolso pelo mesmo crítico.** O motor já possui a recuperação geral de Coragem nos críticos: **+1 no crítico com dois dados mantidos** e **+2 no crítico com três ou quatro dados mantidos**, conforme a resolução atual. A primeira Coragem recuperada pode compensar a ativação paga; se houver outra Coragem concedida pelo crítico, ela permanece como o benefício geral já existente, respeitando os tetos da ficha.

Esta interpretação não transforma a Perícia em fonte de Coragem adicional: **pagar 1 e recuperar 1 resulta em gasto líquido zero**, e não em ganho líquido de 1. O crítico sem Perícia ativada mantém sua recuperação geral própria.

### Exemplo: Armas Leves, Médias e Pesadas

O personagem declara o uso de uma característica existente em sua arma e paga 1 Coragem antes de rolar. Em falha, perde essa Coragem sem produzir o efeito; em acerto comum, produz o efeito pagando 1; em crítico com acerto, produz o efeito e recupera a primeira Coragem paga por meio da recuperação crítica, ficando com custo líquido zero.

A regra se aplica ao gasto da **tentativa**. Não altera o conjunto de características existentes, as habilitações da arma, os benefícios gratuitos das Especializações por família, a exceção de Cravar, nem o custo eventual de uma segunda ou terceira característica.

### Aplicação às Especializações em Armas por família [DEFINIDO]

As Especializações em Armas (antigas Maestrias por família) conservam as regras aprovadas na v0.99. **Uma característica da arma é gratuita no acerto comum**, sem gasto inicial. Uma segunda característica diferente, quando pretendida, envolve **1 Coragem declarada e paga antes da rolagem**; no crítico com acerto, a recuperação normal do crítico compensa esse pagamento, totalizando duas características distintas com custo líquido zero **para essa segunda ativação**. Não há outra devolução concedida pela Especialização.

Uma terceira característica diferente, se existir e for elegível, exige **outra Coragem paga antes da rolagem**. O efeito da terceira continua restrito ao crítico com acerto, e a recuperação geral do crítico é aplicada uma vez, conforme o número de dados mantidos, sem bônus ou reembolso duplicado. Se não houver a condição necessária, a característica não produz efeito e a Coragem declarada não é devolvida por falha.

A primeira característica da Especialização é uma gratuidade própria e **não deve ser debitada e depois reembolsada**. A recuperação geral de Coragem por crítico continua independente desse benefício. Não alterar habilitação por peso, Pugilismo para Armas de Punho, concessão racial das Armas de Fogo ou bloqueio de compra das quatro famílias com requisitos pendentes.

## 2. Sequência de resolução [DEFINIDO]

1. **Declarar ação e Perícias** (inclusive característica paga da arma).
2. **Debitar a Coragem exigida**, com saldo suficiente antes da rolagem.
3. **Rolar e resolver** dados mantidos, Êxitos e crítico.
4. **Aplicar o efeito** se suas condições forem satisfeitas.
5. **Recuperar Coragem por crítico** segundo o benefício geral, somente uma vez, respeitando o teto; esse reembolso pode compensar o pagamento inicial.

## 3. Implementação, histórico e pendências

**DEFINIDO:** gasto antecipado, manutenção do gasto na falha e reembolso de 1 Coragem investida por meio da recuperação geral de crítico, sem gratuidade duplicada.

**IMPLEMENTADO nesta revisão:** o planejamento do comparador conserva o custo bruto da característica mesmo quando ocorre crítico. A recuperação geral do resultado crítico é creditada somente uma vez no fechamento; o saldo líquido deixa de gerar Coragem extra por contabilização duplicada.

**PENDENTE:** o comparador registra os débitos na confirmação da rolagem em vez de deduzir fisicamente os recursos no instante da declaração, antes da geração dos dados. A interface deve posteriormente ser adequadamente transacionada para executar a sequência acima sem perder dados em cancelamentos ou permitir alterações depois de conhecer o resultado. Não confundir essa pendência de automação com regra pendente.

**PENDENTE:** escolher e pagar propriedades adicionais condicionadas a um crítico após a declaração inicial sem permitir pagamentos retroativos indevidos. A gratuidade específica de Especializações permanece conforme sua própria regra, não é substituída por este esclarecimento.

**Substitui:** a marcação geral de procedimento de reembolso como pendente na v0.100 apenas para a ativação declarada por 1 Coragem e seu reembolso em crítico. O SRD v0.100 continua válido quanto à obrigação de pagar **antes de rolar**, e as versões anteriores permanecem como histórico.
