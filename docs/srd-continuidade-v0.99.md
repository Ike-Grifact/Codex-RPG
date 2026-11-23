# Codex RPG — SRD de Continuidade v0.99

**Data:** 23/11/2026  
**Estado:** **DEFINIDO** — decisões explícitas do autor sobre nomenclatura das especializações por família de armas e requisitos de compra de Armas de Punho.  
**Precedência:** adendo à v0.98 em revisão na PR #116 do repositório `Ike-Grifact/Codex-RPG`. Substitui somente os termos e requisitos identificados abaixo; preserva as demais regras, custos, exceções e pendências. Versões anteriores continuam disponíveis como histórico.

## 1. Nomenclatura das especializações de armas [DEFINIDO]

O benefício antes chamado **Maestria por família de arma** passa a se chamar **Especialização em Armas**, acompanhado da família específica (ex.: **Especialização em Armas — Espadas** ou **Especialização em Armas de Punho**). Não é uma elevação automática de grau: é uma Perícia individual de **1 XP** com requisitos próprios.

**Compatibilidade:** os identificadores internos `maestria-*` e endereços históricos `pericias/maestria-em-*.html` permanecem estáveis, garantindo acesso e leitura de fichas antigas. A mudança é do nome apresentado ao jogador, não de compras existentes ou XP. **Maestria Elemental, Maestria em Escudos, Maestria em Apresentação e outras habilidades não pertencentes às famílias de armas não são renomeadas.** A Perícia em Arremesso de Armas, `maestria-arremesso-armas`, é diferente da Especialização em Armas Arremessadas, `maestria-arremessos`.

## 2. Requisitos para comprar [DEFINIDO]

| Especialização | Requisitos de compra | Custo |
|---|---|---:|
| Armas — Adagas e Facas | Agilidade 2 + Destreza 2 | 1 XP |
| Armas — Machados | Força 2 + Destreza 1 | 1 XP |
| Armas — Cajados e Bastões | Destreza 2 | 1 XP |
| Armas — Maças e Clavas | Força 3 + Destreza 1 + Vigor 1 | 1 XP |
| Armas — Martelos | Força 3 + Destreza 1 + Vigor 1 | 1 XP |
| Armas — Espadas | Força 2 + Destreza 2 | 1 XP |
| Armas — Lanças e Hastes | Força 2 + Agilidade 1 + Destreza 1 | 1 XP |
| **Armas de Punho** | **Força 1 + Agilidade 1 + Destreza 1 + Vigor 1** | **1 XP** |
| Armas — Arcos | **PENDENTE**: atributos e graus | 1 XP nominal |
| Armas — Bestas | **PENDENTE**: atributos e graus | 1 XP nominal |
| Armas Arremessadas | **PENDENTE**: atributos e graus | 1 XP nominal |
| Armas de Longo Alcance Diversas | **PENDENTE**: atributos e graus | 1 XP nominal |
| Armas de Fogo | Exclusiva de Humanos; concessão racial gratuita | 1 XP nominal; **0 XP gasto** |

**Armas de Punho:** os quatro graus são pré-requisitos **somente da compra**. O jogador não precisa adquirir Pugilismo antes de comprar a Especialização. **Para ativar os efeitos das armas de punho em combate, Pugilismo continua obrigatório**, além de arma adequada, ataque que acerta a DE e condições da característica. A compra não fornece Pugilismo.

**Sem novos requisitos fictícios:** o custo de 1 XP não libera Arcos, Bestas, Armas Arremessadas ou Longo Alcance Diversas enquanto seus requisitos de compra não forem aprovados.

## 3. Acerto, crítico e ativação [DEFINIDO — preservado da v0.98]

- **Acerto comum:** uma característica existente e elegível da arma sem custo de Coragem, desde que a Especialização e a habilitação da arma estejam presentes.
- **Crítico com acerto:** até duas características diferentes e existentes gratuitamente; uma terceira característica diferente por 1 Coragem, se houver e for elegível.
- **Sem requisitos de ativação:** ter somente a Especialização não permite acionar a gratuidade. Armas corpo a corpo exigem Perícia de Armas do peso; Armas de Punho exigem Pugilismo; outras famílias seguem a habilitação já definida na v0.98.
- **Sem efeito duplicado:** não criar características, acerto, dano, dados ou vantagens adicionais. Preservar a exceção já aprovada de Cravar em crítico de arma Média/Pesada.

## 4. Automação, validação e limites

O criador e o catálogo de humanoides devem usar as mesmas descrições, custo e regras de compra. O Codex Genético permite montar os quatro atributos necessários para Armas de Punho na compra automática; a compra direta bloqueia abaixo de qualquer requisito e não exige Pugilismo para adquirir.

O comparador tático identifica a família do equipamento, valida Atributos da Especialização, exige a Perícia de ativação e limita características distintas conforme acerto/crítico, contabilizando Coragem. O comparador **não transforma procedimentos narrativos ainda pendentes em números automáticos**: características sem resolução numérica definida continuam demandando confirmação do Narrador.

**Compatibilidade:** não reembolsar XP, não renomear IDs internos, não apagar aquisições legadas e não alterar mecânicas não abrangidas pela decisão.

## 5. Histórico e pendências

- **Substituído:** nome “Maestria” **apenas** nas famílias de armas acima.
- **Resolvido:** requisitos antes pendentes de Armas de Punho.
- **Preservado:** custo 1 XP; gratuidade de Armas de Fogo para Humanos; benefícios de crítico e requisitos de ativação; Artista Marcial com Atletismo 1; demais regras da v0.98.
- **PENDENTE:** definir os requisitos de compra de Arcos, Bestas, Armas Arremessadas e Longo Alcance Diversas; automatizar apenas efeitos que já tenham procedimentos numéricos completos.
