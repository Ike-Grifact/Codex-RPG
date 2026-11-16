# Playtest 0.2.1.13 · Compra de Perícias e requisitos

No Codex Genético, abra uma Perícia roxa e clique em **Comprar Perícia + requisitos**. A confirmação apresenta os aumentos de grau, as Perícias intermediárias, as alternativas escolhidas, o custo e o saldo antes e depois. Cancelar preserva a ficha. O Narrador ativo recalcula o plano com os dados atuais do Actor e grava os graus e as Perícias juntos. Se o plano tiver mudado em outra sessão, abra a Perícia e confira a nova cotação.

O catálogo exige as mesmas dependências usadas na compra individual. O planejador compara as alternativas pelo custo total e aproveita qualquer grau ou Perícia já adquirido. Requisitos em comum são cobrados uma vez. A cor roxa indica um pacote completo que cabe no saldo após a reserva da criação, quando aplicável. A cor verde indica uma compra individual disponível. O dourado identifica Perícias já adquiridas. Quando falta XP para um pacote válido, o inspetor mostra seu custo completo.

## Instalação

Com o Foundry fechado, execute no clone do PR #4 com Node.js 24:

```powershell
node foundry-prototype/scripts/install.mjs --user-data "F:/FoundryVTT-WindowsPortable-14.364" --dry-run
node foundry-prototype/scripts/install.mjs --user-data "F:/FoundryVTT-WindowsPortable-14.364"
```

A simulação confirma o ID `codex-rpg-foundry`, a versão de origem e a 0.2.1.13 de destino. Guarde o caminho de backup da 0.2.1.12 impresso pelo instalador e confira a versão em **Game Systems** no Setup.

## Restauração

Feche o Foundry. Em `Data/systems`, mova somente a pasta `codex-rpg-foundry` atual para fora desse diretório e copie para o lugar dela a pasta `codex-rpg-foundry` do backup. Confira o ID e a versão no `system.json` antes de reabrir o Setup. Para reverter uma migração que o Foundry tenha aplicado depois de abrir uma campanha, use o backup próprio do mundo.

## Custos verificados a partir de uma ficha sem compras

| Perícia | Custo do pacote | Perícias intermediárias do plano |
| --- | ---: | --- |
| Elemento Fogo | 7 XP | Criar Item de Foco e Magia |
| Furtividade Avançada | 14 XP | Furtividade |
| Criar Antídoto | 23 XP | Criar Veneno |
| Maestria Elemental | 40 XP | Criar Item de Foco e Magia, Improviso Elemental e Elemento Ar |
| Olhos de Águia | 30 XP | Armas de Longo Alcance |
| Invocação Elemental | 13 XP | Criar Item de Foco e Magia e Domar Criatura Pequena |
| Perícia Druídica | 29 XP | Criar Item de Foco e Magia, Elemento Terra e as três Perícias Domar |

Cada custo inclui os graus exigidos. Em fichas existentes, o custo é recalculado a partir dos graus e das Perícias já comprados. Um personagem que já possui a Perícia em Armas de Fogo pode aproveitar essa especialização no pacote de Olhos de Águia.

## Validação

Passaram os 79 testes automatizados da suíte Foundry. Os testes verificaram a correspondência com os requisitos declarados no site, o menor custo global, a reserva de formação, os dados inconsistentes e o bloqueio de ciclos.

No Foundry 14.367, Narrador e jogador verificaram as quatro cores, o cancelamento e a rejeição de uma compra cujo saldo mudou enquanto a confirmação estava aberta. Duas confirmações simultâneas no mesmo Actor produziram uma única atualização com todos os graus e Perícias. Os sete pacotes da tabela foram adquiridos pela autoridade em fichas de teste com orçamento suficiente. Uma rolagem pendente bloqueou a aquisição, e graus, Perícias, histórico de concessão e saldo permaneceram gravados após reiniciar.

O ZIP foi extraído e validado antes da instalação. Os 86 arquivos do sistema instalado foram comparados com o ZIP final, e os 86 arquivos anteriores com o backup da 0.2.1.12.
