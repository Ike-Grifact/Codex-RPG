---
title: "Codex RPG — SRD de Continuidade v0.74: dano integral à Vida com Hemomancia amplificada"
version: "0.74"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO — todo o dano calculado de magia de Sangue amplificada atinge Vida diretamente, sem desgaste da armadura; EXPERIMENTAL — potencial de dano elevado requer playtest"
---

# Codex RPG — SRD de Continuidade v0.74

## 0-BN. Hemomancia amplificada atravessa integralmente a armadura [17/11/2026]

**DEFINIDO por decisão explícita do autor em 17/11/2026:** quando **um ataque de magia de Sangue** recebe a **amplificação para atingir diretamente a Vida**, e **o ataque acerta a DE**, **TODO o dano calculado para esse ataque é aplicado diretamente à Vida do alvo**, **ignorando integralmente a Integridade da armadura equipada**. Não aplicar esse mesmo dano também à Integridade: o efeito **redireciona** o dano, não o duplica.

### Cálculo de dano [DEFINIDO]

O dano da Hemomancia amplificada **não ganha valor numérico gratuito**, mas usa **todo o dano convencional já calculado** segundo as regras atuais do ataque, inclusive críticos e outros modificadores legitimamente habilitados:

- Dano convencional após acerto: **Êxitos (E) válidos + ⌊Pavor (P) não anulado / 2⌋**, sujeito aos multiplicadores/críticos que já sejam válidos para a técnica.
- Se a magia de Sangue foi amplificada especificamente para **dano direto à Vida**, o resultado inteiro acima é aplicado **à Vida**, sem primeiro descontar a Integridade da armadura.
- Se **falhar na DE**, não há dano à Vida por essa magia. O pagamento de amplificação, já efetuado na ficha, **não produz 1 dano automático** nem autoriza novo uso gratuito.
- Se a magia **não recebeu essa amplificação**, o dano segue o fluxo de proteção normal (escudo/armadura e eventual excedente à Vida).
- **Pavor continua Pavor:** os riscos e demais consequências não são anulados por redirecionar o dano à Vida. **Não** usar a regra de Perfurante (1 P por dano à Integridade) para calcular dano de Sangue; são especializações distintas.

**Exemplo:** magia de Sangue que acertou e concluiu com **3E e 2P** causa **4 de dano** (`3 + ⌊2/2⌋`). Com amplificação para atingir Vida, **4 são aplicados à Vida e 0 à Integridade da armadura**. Sem essa amplificação, o dano convencional atinge as proteções primeiro.

### Exclusividade e custo [DEFINIDO]

**Exclusivo da construção de Hemomante** que possua **Perícia em Elemento Sangue**, como propriedade de **magia de Sangue amplificada para atingir Vida**. Não conceder este desvio para armas comuns, Perfurante, magia de Fogo, demais elementos, ou ataques de qualquer personagem que apenas possua sangue em cena.

A amplificação continua sujeita a **uma escolha por turno** entre (a) ampliar uma magia, incluindo a opção de dano direto, (b) manter dado adicional, **ou** (c) elevar dado. **Custo alternativo para um uso:**

| Pagamento | Custo |
|---|---|
| Sangue próprio | **Perder 1 Vida do Hemomante** |
| Sangue derramado de inimigos | **Consumir 3 marcas disponíveis de sangue inimigo** |

Essas opções não se somam. A Perícia de Sangue, o ataque, as habilidades do foco e os limites de dados continuam respeitando seus requisitos próprios. **Extração de Sangue como técnica separada segue revogada** (v0.73).

### Sangue produzido por dano [DEFINIDO]

Quando a magia de Sangue amplificada realmente remove `N` pontos da Vida do **inimigo**, ela pode produzir **N marcas de sangue inimigo** ainda não contabilizadas (**1 marca para cada 1 Vida realmente perdida**, v0.72), para registro no contador manual. Pagar 3 marcas anteriores não impede obter sangue **novo** de dano efetivamente causado, mas não devolve automaticamente as marcas antigas. Dano à Integridade, Sangramento sem dano e custo da Vida do próprio Hemomante **não** geram marcas de sangue inimigo na ficha.

### Relação com defesas e lacunas

- **Não altera DE nem remove a exigência de acerto.** Dano à Vida não é sucesso automático.
- **Armadura não absorve nem sofre dano deste ataque específico** se a amplificação direta estiver habilitada e o ataque acertar.
- **PENDENTE:** interação de Hemomancia amplificada com **escudos ativos, barreiras, imunidades, reduções de dano, níveis de proteção e regras de técnicas em área** que não estejam explicitamente definidas; não conceder atravessamento de escudos por inferência.
- **PENDENTE de balanceamento:** chance e impacto de perda extrema de Vida com pool elevado e críticos, economia de 1 Vida versus 3 marcas, sustentabilidade pela Transfusão Sanguinária. Dano integral direto é **DEFINIDO**, não reduzir silenciosamente a um teto para resolver essas dúvidas.
- **PENDENTE:** coleta, alcance e duração de sangue inimigo; Perícia Transfusão original ainda sem aquisição definida; demais técnicas como coágulo/hemorragia interna ainda sem efeitos adicionais aprovados.

### Protótipo da ficha [IMPLEMENTADO]

Na ficha, ao pagar a amplificação de **dano direto à Vida** (1 Vida própria ou 3 marcas inimigas), o jogador pode vincular essa amplificação a **uma rolagem de Conjuração de Sangue** na etapa de dados mantidos. Se acertar, a ficha mostra **dano integral potencial à Vida** igual ao dano convencional calculado e o registra no histórico do teste. Se falhar, registra zero; em ambos os casos, o pagamento não retorna. A marca de vínculo não aplica dano automaticamente a uma ficha externa e **não deve ser vinculada a uma segunda rolagem no mesmo turno**. A perícia e a natureza de Sangue da magia permanecem sob validação do Narrador, principalmente em conjurações sem foco.

**Histórico preservado:** v0.73 define custos alternativos e revoga Extração; v0.72 gera 1 marca por Vida de inimigo perdida; v0.71 define sangue consumível e Transfusão Sanguinária; v0.70 Sangramento não causa dano à Vida; v0.69 Perfurante atua na Integridade.
