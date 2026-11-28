# Estado das automações
Consolidado em 28/11/2026, main ca0cc29501dc67ff72a64ea2263535ebb77471d9 e revisão 1b3fffcd3d5e12c90dc1164ff0dd308ea6ee201f. Separado do estado das regras. Os resultados anteriores são relatos de implementação, não testes reexecutados. A tabela inicial é o retrato histórico de 27/11 da [sincronização v0.194](https://github.com/Ike-Grifact/Codex-RPG/blob/07b47b7845e00d4db7811709dc00b7f9485444aa/docs/sincronizacao-conjuracao-v0.194.md); os estados abaixo das versões são registros da revisão e não implicam publicação na main.

### Verificação desta consolidação
| Recurso | Main | Revisão / evidência |
|---|---|---|
| Furtividade v0.198–v0.203 | Documentação publicada; automação de ocultação e comparação não validada | Relato de não implementação nos adendos |
| Detecção Elemental | Verbete individual ausente na árvore; ID/nome não encontrados nos catálogos e arquivos de aplicação consultados | Verbete existente no commit de revisão; aquisição e débito manual relatados na v0.201 em branch de ferramentas, não confirmados por execução nesta auditoria |
| Rerrolagem seletiva, persistência da localização, requisito duplo de Furtividade Elemental | NÃO IMPLEMENTADO conforme registros; sem teste funcional novo | Manual conforme v0.201 e v0.203 |
| Conjuração, Ruptura, Escudo Arcano | Não revalidados funcionalmente nesta integração | Estados registrados nas seções abaixo; não promover teste isolado a validação integral |
| Foundry | Sem alterações | Instalação externa não verificada |

Não se alteram código, regras, catálogo, UI ou dados de fichas nesta consolidação.
| Recurso | Estado registrado |
|---|---|
| Catálogo da ficha e 12 Perícias mágicas | Atualizado na branch de sincronização, ainda não na main no momento auditado. 112 IDs/custos preservados segundo relatório. |
| Conjuração G1–G4 | Progressão básica e custo atualizados na branch. |
| Focos | Capacidade, retirada da gratuidade e recarga manual na branch; preço informado pelo Narrador. Números recuperados em DECISOES FOC-03. |
| Comparador | Básico G1–G4, alvo único; elementos e tempo confirmados pelo Narrador. |
| G5, Sagrado, Sangue, Psique mental, Bênção/Aflição, dano múltiplo, invocação | Total ou parcialmente manuais na branch. Não equivale a regra indefinida. |
| Testes | Relatório: 112 pares ID/custo, 12 descrições, 56 casos de elevação e quatro builds; faltam testes integrados de navegador, persistência, comércio, combate completo. |
| Foundry | Não alterado por esta sincronização. Instalações externas não verificadas. |
Esta branch documental não altera código ou validação funcional. Antes de mesclar a branch de sincronização, corrigir a expressão genérica “preços oficiais pendentes” e confrontar DIV-01 a DIV-09 com as decisões recuperadas. Não alterar custos/efeitos por inferência.

## Impacto das decisões de 28/11/2026 — não implementado nesta revisão
- Recarga: retirar exigência de esgotamento e restaurar 1 carga a cada 2 turnos próprios até o máximo, mantendo exceção Pedra da Alma.
- Hemomancia: preservar neutralização da propriedade pelo Escudo Arcano de Sangue, sem restaurar custos antigos por inferência.
- Invocação Pequena: distinguir apoio +1A de ataque independente como ação conjunta com ficha básica e somente 1 dado mantido. Preservar limites de atuação.
Fonte: [Decisão autoral de 28/11/2026 — v0.195](https://github.com/Ike-Grifact/Codex-RPG/blob/1b3fffcd3d5e12c90dc1164ff0dd308ea6ee201f/docs/srd-continuidade-v0.195.md). Código, interface, persistência e testes funcionais não foram alterados.

## Impacto da v0.196
Dano convencional G1 para todos os elementos; revisar habilitação de efeitos especiais de Água/Terra e seus gatilhos em ficha, criador de conflitos e simulador. Não aplicar efeitos automaticamente, não alterar requisitos/XP/IDs. Preços fixos dos focos não implementados: criador ainda usa preço de mesa e proporção histórica das pedras, aguardando recuperação da classificação de focos prontos. [v0.196 — decisão autoral de 28/11/2026](https://github.com/Ike-Grifact/Codex-RPG/blob/1b3fffcd3d5e12c90dc1164ff0dd308ea6ee201f/docs/srd-continuidade-v0.196.md). A revisão de textos não equivale à automação ou teste de navegador.

## v0.197 — Ruptura
Renomear rótulos públicos da propriedade e descrições; preservar chaves legadas Perfurante, perfurante, perfurar, campos de munição, IDs e lógica. Não implica automatizar efeitos elementais ou alterar o dano. Validação de navegador e publicação separadas. [v0.197 — decisão autoral de 28/11/2026](https://github.com/Ike-Grifact/Codex-RPG/blob/1b3fffcd3d5e12c90dc1164ff0dd308ea6ee201f/docs/srd-continuidade-v0.197.md).

## v0.198 — Furtividade
NÃO IMPLEMENTADO nesta revisão: guardar faces originais mantidas, comparar multiconjuntos de mantidos por tipo e E/A/T, aplicar −2E mesmo localizando; distinguir ocultação elemental e percepção pertinente. Sem automatizar detecção, duração, quebra ou custos não definidos. [v0.198](https://github.com/Ike-Grifact/Codex-RPG/blob/1b3fffcd3d5e12c90dc1164ff0dd308ea6ee201f/docs/srd-continuidade-v0.198.md).

## v0.199 — Ataque surpresa
NÃO IMPLEMENTADO nesta revisão: estado oculto, bônus de surpresa +1E, exposição ao atacar, retirada do −2E e da comparação de faces após revelação; revide imediato quando válido e nova ocultação em ação própria conforme habilitações. Não modificar regras gerais de Temor, Antecipar, alcance, turnos ou transformação. [v0.199](https://github.com/Ike-Grifact/Codex-RPG/blob/1b3fffcd3d5e12c90dc1164ff0dd308ea6ee201f/docs/srd-continuidade-v0.199.md).

## v0.200 — Busca ativa e Detecção Elemental
NÃO IMPLEMENTADO: busca dedicada com correspondência dos mantidos, localização individual e ataque posterior sem penalidade da ocultação quando válido. Detecção Elemental foi habilitada na v0.201; rerrolagem ainda manual. Preservar Sentido Elemental e Sentido Sísmico vigentes, sem mudar custo, IDs ou alcance. [v0.200](https://github.com/Ike-Grifact/Codex-RPG/blob/1b3fffcd3d5e12c90dc1164ff0dd308ea6ee201f/docs/srd-continuidade-v0.200.md).

## v0.201 — Detecção Elemental
PARCIALMENTE IMPLEMENTADO na branch de sincronização: aquisição, cinco requisitos, catálogo humanoide, plano genético e declaração manual com débito de 1 Coragem. NÃO IMPLEMENTADO: rerrolagem seletiva, comparação e persistência de localização. Teste de requisitos adicionado; execução de suíte e navegador não confirmada. [v0.201](https://github.com/Ike-Grifact/Codex-RPG/blob/1b3fffcd3d5e12c90dc1164ff0dd308ea6ee201f/docs/srd-continuidade-v0.201.md).

## v0.202 — sincronização editorial
VALIDADO no escopo de comparação isolada relatada na revisão: 124 entradas do catálogo da ficha e compartilhado coincidem integralmente (ID, nome, descrição, XP); IDs e XP anteriores preservados. Sem alteração do trecho de cálculo de Manejo Perfeito/Golpe Certo. Escudo Arcano não recebeu automação de proteção; navegador e suíte integral não testados. [v0.202](https://github.com/Ike-Grifact/Codex-RPG/blob/1b3fffcd3d5e12c90dc1164ff0dd308ea6ee201f/docs/srd-continuidade-v0.202.md).

## v0.203 — Furtividade Elemental
NÃO IMPLEMENTADO: verificar ambas as Perícias na resolução da ocultação elemental. Nenhuma compra independente nem custo adicional. [v0.203](srd-continuidade-v0.203.md).

## Critério de fechamento
VALIDADO somente no escopo explicitamente testado, com versão/branch e evidência. A igualdade histórica das 124 entradas refere-se à revisão/branch de ferramentas, não valida o catálogo da main. Para integração futura, verificar diffs e testes de compatibilidade, salvamento, importação/exportação, mobile e comparador; não considerar este documento uma execução de testes.
