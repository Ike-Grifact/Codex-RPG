# Playtest 0.2.1.14 do Codex RPG

O Codex Genético localiza Perícias pelo nome e apresenta constelação, estado e custo. Uma devolução preserva os requisitos adquiridos em pacote e recalcula o XP investido. Após concluir a criação, o Narrador ativo autoriza a devolução. A ficha registra quem pediu, quem autorizou, a Perícia, a data e o XP liberado.

O [reforço de dados](../docs/decisao-reforco-de-dados.md) acrescenta uma cópia temporária do dado escolhido por 1 Coragem. Influência G4 com Apresentação G1 passa de 2d6 + 2d10 a 2d6 + 3d10 ao reforçar o d10 de Apresentação. A retenção segue seu limite próprio. O d20 fica fora das opções.

A [proposta do Compendium](./MODELO-COMPENDIUM-PERICIAS.md) descreve o tipo de Item e os campos que poderão ser incorporados quando as regras forem homologadas. Na versão 0.2.1.14, as fichas usam os IDs já registrados em `Actor.system.skills`.

## Instalação e recuperação

A partir do clone, com Node.js 24 e Foundry fechado, use o instalador do projeto. No Windows portátil deste playtest, o comando é:

```powershell
node foundry-prototype/scripts/install.mjs --user-data 'F:/FoundryVTT-WindowsPortable-14.364'
```

Acrescente `--dry-run` para conferir a User Data, a versão e o diretório de destino antes da troca. O instalador guarda a versão anterior em `Backups/codex-rpg-system-installer/<data>/codex-rpg-foundry` e preserva a pasta persistente `storage`. O caminho exato aparece na linha `Backup:` da saída.

Se o instalador detectar um erro na promoção do pacote, ele restaura a versão anterior. Para uma restauração manual, feche o Foundry, mova apenas a pasta `Data/systems/codex-rpg-foundry` para fora de `Data/systems` e copie a pasta `codex-rpg-foundry` do backup para o lugar dela. Abra o Setup e confirme a versão restaurada. Se houve uso do sistema atualizado, preserve também a cópia deslocada para recuperar eventuais arquivos recentes de `storage`.

## Validação

- Foundry VTT 14.367 com dois clientes Chromium. A busca parcial sem acentos encontrou Invocação Elemental e Elemento Fogo. Os resultados selecionaram os nós no mapa e as dez constelações mantiveram suas posições.
- Em uma ficha criada para teste, a compra de Elemento Fogo e requisitos investiu 7 XP. A devolução de Criar Item de Foco e Magia foi bloqueada enquanto Elemento Fogo dependia dela. Devolver a Perícia principal recuperou 1 XP, deixou o XP adicional em zero e preservou Inteligência G1, Disciplina G1, Artesão G1 e Criar Item de Foco e Magia.
- Depois de concluir a criação, a recusa do Narrador preservou a ficha. A autorização posterior persistiu um registro com solicitante, autorizador e saldo investido de 7 para 6 XP. O reembolso, uma ficha da versão anterior e seu histórico continuaram disponíveis após reiniciar o Foundry de QA.
- A prévia da ficha mostrou 2d6 + 3d10, com retenção natural de dois dados. Dice So Nice 6.2.6 reproduziu as mesmas cinco faces nos dois clientes e o chat registrou uma única publicação. A Coragem passou de 10 para 9. Uma segunda tentativa de reforço na rodada foi recusada.
- O ZIP local contém 86 arquivos. O manifesto interno identifica `codex-rpg-foundry` 0.2.1.14 e compatibilidade com Foundry v14.
- Os protótipos web passaram em 74 testes Node.js e dois roteiros no Chromium, incluindo prévia, cobrança, retenção, CSV, integridade, histórico e navegação no mapa por mouse e toque. O teste do site cobre o cálculo da pilha e a retenção. A trava por rodada foi exercitada no combate do Foundry. [PR #32 para revisão](https://github.com/Ike-Grifact/Codex-RPG/pull/32).
- A suíte completa do Foundry passou com Node.js 24.16.0, com 84 testes e zero falhas. Ela inclui as verificações da 0.2.1.13 e cinco novas verificações.
- A atualização portátil foi executada com o Foundry fechado. A conferência comparou os 86 arquivos instalados com o ZIP e os 86 arquivos antigos com o backup. A estrutura de mundos, os arquivos de banco, os manifestos de mundos, as configurações e o armazenamento persistente foram conferidos antes e depois da troca. O Setup da instalação portátil carregou o Codex RPG 0.2.1.14 no Foundry 14.367.

Backup desta instalação em `F:/FoundryVTT-WindowsPortable-14.364/Backups/codex-rpg-system-installer/2026-11-17T01-33-00-281Z-MDh1e0/codex-rpg-foundry`. SHA-256 do ZIP local: `80EEADBDC3567B09B0E5CCC7BE25512C545B41F0C018D2CBE50360F87D40BFA3`.
