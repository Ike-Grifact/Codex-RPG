# Playtest 0.2.1.12 · Evolução e experiência

O Codex Genético permite aumentar e reduzir graus pelo inspetor. Em mapas largos com mouse, os cartões também oferecem + e −. A ficha mostra o custo do próximo grau, o XP liberado na redução e o motivo de um bloqueio. Depois de concluir a criação, pedidos de redução de jogadores são confirmados pelo Narrador ativo. As compras e reduções passam pelo mesmo motor da ficha clássica. O limite de Grau 6, a formação mínima, os pré-requisitos das Perícias e a trava durante rolagens pendentes continuam sendo verificados.

O cabeçalho separa XP de formação, adicional, total, investido e disponível. O Narrador pode conceder ou retirar XP adicional no painel **Gerenciar XP**. A retirada exige confirmação e o total nunca pode cair abaixo do investimento. O histórico da ficha registra a conta que fez cada ajuste, a data e os valores anterior e posterior. O saldo continua em `system.xp` e é sincronizado com os clientes.

## Instalação

Feche o Foundry. No clone do PR #4, com Node.js 24, simule a instalação e confira o destino, o ID `codex-rpg-foundry` e a versão. Em seguida execute o instalador e guarde o caminho de backup que ele imprime.

```powershell
node foundry-prototype/scripts/install.mjs --user-data "F:/FoundryVTT-WindowsPortable-14.364" --dry-run
node foundry-prototype/scripts/install.mjs --user-data "F:/FoundryVTT-WindowsPortable-14.364"
```

Reabra o Setup e confira a versão em **Game Systems** antes de abrir uma campanha. A instalação usa o pacote do clone e preserva os dados do mundo e o armazenamento do sistema.

## Restauração

Com o Foundry fechado, confira o ID e a versão no arquivo `system.json` do backup da 0.2.1.11. Mova apenas a instalação atual `Data/systems/codex-rpg-foundry` para uma pasta fora de `Data/systems` e copie o diretório `codex-rpg-foundry` do backup para o destino. Abra o Setup e confirme a versão restaurada. Se uma campanha já tiver passado por migração, a restauração do mundo usa o backup próprio do Foundry.

## Validação deste candidato

- Passaram os 73 testes Node.js do Foundry, incluindo as verificações do instalador.
- Em um mundo isolado do Foundry 14.367, Narrador e jogador conectados confirmaram o saldo inicial de 20 XP, as compras no mapa e no inspetor, a devolução de XP, o bloqueio de pré-requisitos e a evolução após a criação. O Narrador recusou e aprovou reduções em testes separados.
- Uma concessão de 5 XP apareceu nos dois clientes. A ficha do jogador recusou o ajuste tanto pelo fluxo de solicitações quanto pela atualização normal do Actor. A retirada de 5 XP foi bloqueada quando o total cairia abaixo do investimento. Uma retirada de 2 XP foi confirmada e registrada.
- A rolagem pendente travou a edição e publicou uma única mensagem ao concluir. Após reiniciar o Foundry, os graus, a Perícia, os 3 XP adicionais, o histórico e a mensagem continuaram salvos. A tentativa de passar do Grau 6 também foi bloqueada.
