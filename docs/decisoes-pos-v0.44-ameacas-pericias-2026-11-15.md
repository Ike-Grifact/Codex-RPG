---
title: "Codex RPG — decisões posteriores ao SRD v0.44: Perícias e tipos de ameaças"
date: "2026-11-15"
base_srd: "0.44"
state: "decisão autoral em implementação"
---
# Decisões posteriores ao SRD v0.44 — 15/11/2026

> Este registro tem **precedência autoral posterior** sobre as referências históricas da v0.44 nos assuntos explicitamente alterados. Não reescreve nem apaga o SRD v0.44 arquivado; consolidação em próximo SRD integral **PENDENTE**.

## 1. Perito Conjurador — REVOGADO [DEFINIDO]

- **Perito Conjurador não existe** no conjunto atual de Perícias, conforme decisão explícita do autor em 15/11/2026.
- Retirar novas compras, nó genético, índice de Perícias e verbete público; remover habilitação exclusiva de terceira fonte de conjuração. **Disciplina Avançada** e suas condições próprias permanecem.
- O identificador legado `peritoconj` pode aparecer em fichas antigas. A migração não pode reduzir o XP do personagem por uma habilidade inexistente: remover essa compra de 2 XP do cálculo, com crédito de saldo para redistribuição, sem conceder novas Perícias gratuitamente.
- Referência histórica revogada: menção à Perícia na v0.44 e páginas anteriormente publicadas.

## 2. Consulta de verbetes no Codex Genético [DEFINIDO no UX]

- Selecionar um **nó circular de Perícia** abre os detalhes e apresenta, além da opção de compra/evolução (ou devolução para playtest), a ação **Ler verbete completo**.
- O verbete é a página oficial correspondente do catálogo `pericias/`, aberta em nova aba para não perder a construção atual.
- Consultar um verbete não altera compras, saldo ou dados mantidos.

## 3. Tipos de ameaça [DEFINIDO em classificação e custo]

As novas fichas no Criar Conflito devem oferecer **exatamente**:

| Tipo | Custo acumulado de Atributos G0–G6 | Custo acumulado de Conhecimentos e Práticas G0–G6 | Perícias |
|---|---|---|---|
| **Humanoide** | 0, 1, 3, 7, 15, 31, 55 XP | 0, 2, 8, 20, 38, 66, 102 XP | Sim, por custo próprio |
| **Criatura/Monstro** | 0, 2, 8, 20, 38, 66, 102 XP | Não usa a formação humana como compra ordinária | Não |
| **Humanoide Monstro** | 0, 2, 8, 20, 38, 66, 102 XP | 0, 2, 8, 20, 38, 66, 102 XP | Sim, por custo próprio |

A progressão da Ficha de **Humanoide comum** conserva os **20 XP iniciais experimentais compartilhados**, enquanto o orçamento de Criatura/Monstro e Humanoide Monstro é preenchido pelo Narrador, sem atribuir um novo XP inicial por dedução.

**PENDENTE:** o autor ainda não definiu uma escala própria de dados, Marcos, Coragem/Pavor ou retenção para Humanoide Monstro. O protótipo usa temporariamente os dados e a composição Conhecimento/Prática + Atributo de humanoide, com **custo elevado de XP** conforme a nova decisão. Isso é comportamento implementado, não regra homologada de novos dados.

**Compatibilidade:** fichas históricas com tipo `criatura` continuam legíveis sem conversão involuntária de seus dados e XP; somente novas fichas oferecem os três tipos acima.

## Escopo de implementação

- Arquivos impactados: `prototipo-ficha/app.js`, `criar-conflito/rules.mjs`, `criar-conflito/codex-rules.mjs`, `criar-conflito/roll-engine.mjs`, `criar-conflito/app.js`, `foundry-prototype/module/rules.mjs`, catálogo de Perícias e controles do site.
- Testes automatizados devem confirmar os três orçamentos, a devolução de Perito Conjurador em fichas antigas, a remoção da terceira fonte exclusiva e a abertura de verbete pelo DNA.
- Nenhum custo novo, Perícia nova ou efeito especial extra foi autorizado por este registro.

## 4. Retenção das ameaças por Grau [DEFINIDO, 15/11/2026]

**Decisão explícita mais recente:** inimigos de **Grau 2 ou superior podem manter até 4 dados**. O Grau da ameaça, e não o nível do personagem, rege o teto da retenção inimiga. Continua o limite geral de até 9 rolados e 4 mantidos; jamais se mantêm dados não presentes na pilha.

- **Grau 1:** preservado o máximo anterior de 3 mantidos nos inimigos extraordinários e o modelo humanoide de 2 naturais + 1 mediante Coragem.
- **Graus 2–6:** novo teto **4 mantidos** para todos os três tipos: Humanoide, Criatura/Monstro e Humanoide Monstro.
- **Economia anterior preservada:** Criatura/Monstro mantém 2 dados sem custo e paga 1P local por cada dado extra efetivamente mantido (3º/4º: até 2P). Humanoides inimigos têm 3 dados sem custo em Grau 2+ e podem manter o quarto mediante 1 Coragem, descontada **apenas se o quarto for mantido**. Não se pode alegar que o novo limite oferece gastos gratuitos.
- O máximo de 4 depende de **disponibilidade de dados da rolagem**. Um Grau 2 que rolou só 2 dados mantém somente 2.
- **SUBSTITUÍDO:** o teto histórico de apenas 3 dados para monstros extraordinários Graus 1–4 e o quarto a partir do Grau 5 na seção histórica da v0.44.
- Não foram alteradas a tabela de XP, a quantidade/faces fornecidas por Grau de Atributo, os custos de elevação, a DE, o dano ou a reserva de Pavor local.

**Observação de implementação:** os controles da ferramenta devem indicar o teto por Grau e o custo real; mudar de Grau descarta qualquer rolagem pendente construída sob limite anterior.

## 5. Equivalência de ameaça, Grau 2 [DEFINIDO, 15/11/2026]

**Grau 2 de ameaça equivale a enfrentar um personagem jogador de nível 5.**

- Esta equivalência informa a **referência de poder/desafio**, não transfere automaticamente XP, equipamento, requisitos, faces de dados, quantidade de fontes ou estatísticas de nível 5 ao inimigo.
- A regra própria da ameaça prevalece: **inimigos de Grau 2 em diante podem manter até 4 dados**, independentemente do nível numérico salvo na ficha.
- Custos para manter dados extras permanecem aqueles documentados para o tipo de ameaça; a equivalência **não cria retenção gratuita**.
- Os equivalentes de nível de jogador para os Graus 1, 3, 4, 5 e 6 estão **PENDENTES** e não devem ser extrapolados.
- Esta decisão é posterior ao SRD v0.44 e ao registro acima; não modifica a progressão dos Aprendizes.

## 6. Grau padrão das magias e opção sem dano [DEFINIDO, 15/11/2026 — decisão autoral mais recente]

**Toda magia passa a começar no Grau 2, por padrão.** Quando for usada como ataque ofensivo, a magia de **Grau 2 causa o dano calculado normalmente** após atingir a DE, com as proteções, resistências, efeitos e custos pertinentes. O Grau 2 não concede bônus gratuito de Êxitos, dados ou dano fixo: utiliza a fórmula de dano já vigente.

**O conjurador pode reduzir voluntariamente a magia para o Grau 1.** No **Grau 1, a magia não causa dano**, seja à Vida, seja à Integridade; a rolagem continua determinando sucesso, efeitos, condições e outras consequências autorizadas pela Perícia, pelo elemento e pelo Narrador. Mesmo que os símbolos resultassem em valor numérico positivo pela fórmula de dano, esse valor não é aplicado como dano mágico em G1. **Reduzir para G1 não custa Coragem**, mas também não dispensa requisitos, efeitos específicos, recarga e condições de foco.

**A escolha G2 ou G1 é feita antes de resolver a magia**, não como conversão retroativa de uma rolagem já danosa. A nova diretriz é de **Grau de magia**; **não** altera automaticamente o *peso tático* (Leve/Médio/Pesado), o *peso mental* de slots, os valores de dados das fontes, os custos de XP de Perícias, o custo de ativação, as exigências de habilitação ou a duração/recarga do foco.

**Especialidades mantidas:** Trevas conserva +2P válido antes da DE e transferência de Pavor; ao escolher G1, mesmo que alcance a DE, **essa magia não aplica dano** por E ou P. Ar G1 preserva controle/deslocamento habilitados e não gera dano físico por suposição de queda ou impacto. Efeitos de suporte (Escudo Arcano, apoio de Sagrado etc.) continuam suporte: a regra de dano do G2 é pertinente quando a magia é empregada como **ataque ofensivo legal**, não converte automaticamente uma proteção em ataque. Consequências não danosas podem seguir sendo aplicadas normalmente quando habilitadas.

**SUBSTITUI:** a afirmação anterior do Livro do Jogador de que “todas as magias elementais começam ... Grau 1” e as permissões anteriores de dano direto por magias G1. **PENDENTE de harmonização:** o requisito anterior de Disciplina 2 para *criar/memorizar* magias G2 e G3, e a relação entre preparo e acesso ao Grau 2 padrão em personagens com Disciplina menor; não presumir novo custo ou dispensar uma habilitação sem definição. Os demais graus, técnicas especiais, geometrias e interações particulares não foram reescritos nesta decisão.

**Playtest anterior:** os cenários de Ar que aplicavam dano aproximam-se da hipótese de conjuração G2; os cenários de Ar sem dano aproximam-se de G1, mas não automatizavam seus efeitos de controle. Os ataques de Trevas com dano devem ser lidos como G2. Os percentuais publicados anteriormente **não** incorporavam a seleção explícita de Grau e recarga da magia, portanto não são probabilidades definitivas desta nova versão.
