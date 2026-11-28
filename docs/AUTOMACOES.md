# Estado das automações
27/11/2026. Separado do estado das regras. Fonte: [SRD v0.194](https://github.com/Ike-Grifact/Codex-RPG/blob/49de5d56b82b756077ecb993ea85058c7fc98297/docs/srd-continuidade-v0.194.md) e [relatório da branch de sincronização](https://github.com/Ike-Grifact/Codex-RPG/blob/feat/sincronizacao-conjuracao-v0.194/docs/sincronizacao-conjuracao-v0.194.md). Os resultados são os relatados pela implementação anterior, não testes reexecutados nesta auditoria.
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
Fonte: [Decisão autoral de 28/11/2026 — v0.195](srd-continuidade-v0.195.md). Código, interface, persistência e testes funcionais não foram alterados.

## Impacto da v0.196
Dano convencional G1 para todos os elementos; revisar habilitação de efeitos especiais de Água/Terra e seus gatilhos em ficha, criador de conflitos e simulador. Não aplicar efeitos automaticamente, não alterar requisitos/XP/IDs. Preços fixos dos focos não implementados: criador ainda usa preço de mesa e proporção histórica das pedras, aguardando recuperação da classificação de focos prontos. [v0.196 — decisão autoral de 28/11/2026](srd-continuidade-v0.196.md). A revisão de textos não equivale à automação ou teste de navegador.
