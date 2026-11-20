# Codex RPG — Protótipo de Sistema Foundry VTT v14

> **Playtest 0.2.1.18.** Selecione duas fontes para abrir a janela de rolagem no PC. Arraste a barra **Rolagem** para mover a janela. Com a barra em foco, use as setas. Em telas pequenas e com toque, a preparação permanece na ficha. Consulte o [SRD ativo v1.0](https://github.com/Ike-Grifact/Codex-RPG/blob/feat/criar-conflito-foundry-carga-20261113/docs/srd-playtest-nivel-1-v1.0.md).

**Estado:** sistema experimental. Use o canal de playtest em uma User Data separada ou em um mundo de testes. A versão instalada aparece em **Game Systems**.

## Desenvolvimento local

Feche completamente o aplicativo ou servidor do Foundry. Com Node.js 24, no clone de [Ike-Grifact/Codex-RPG](https://github.com/Ike-Grifact/Codex-RPG) já atualizado na branch do PR #4, execute o mesmo comando no Windows, Linux ou macOS:

```sh
node foundry-prototype/scripts/install.mjs
```

O instalador busca a User Data nos locais padrão do sistema operacional e na configuração `dataPath`. Também reconhece `FOUNDRY_VTT_DATA_PATH` e uma edição portátil quando executado a partir da árvore dela. Para indicar uma pasta personalizada ou escolher entre instalações, use a raiz **User Data**, a pasta que contém `Config` e `Data`. Este exemplo usa a instalação portátil do Windows:

```powershell
node foundry-prototype/scripts/install.mjs --user-data "F:/FoundryVTT-WindowsPortable-14.364"
```

Acrescente `--dry-run` para confirmar o caminho, o ID e as versões sem gravar arquivos. O script valida os arquivos do pacote e verifica se há um processo do Foundry ou um servidor escutando na porta configurada. Mantenha o Foundry fechado até a conclusão.

A instalação anterior é movida inteira para `<User Data>/Backups/codex-rpg-system-installer/<data>/codex-rpg-foundry` antes da substituição. O instalador restaura essa cópia se a troca falhar e prepara a pasta persistente `storage` do pacote, preservando seu conteúdo. Arquivos adicionais na raiz e nas subpastas também são copiados para a nova instalação. Conflitos que troquem arquivo por pasta interrompem a preparação sem substituir a instalação anterior. Os arquivos distribuídos pelo sistema são atualizados e suas versões antigas permanecem no backup. Mundos, Actors, Items e configurações continuam na User Data original. Nenhuma operação de escrita do instalador usa `Data/worlds`. Para restaurar manualmente, feche o Foundry, mova a pasta instalada para fora de `Data/systems` e copie a pasta do backup para `Data/systems/codex-rpg-foundry`.

## Instalação e atualização pela interface do Foundry

1. Na tela **Setup**, abra **Game Systems → Install System**.
2. Cole a URL do canal no campo **Manifest URL** e clique em **Install**.
3. Para atualizações futuras, volte a **Game Systems** e use **Update** no Codex RPG. Uma cópia antiga instalada sem manifesto passa a receber atualizações após a instalação pela URL.

| Canal | URL do manifesto |
| --- | --- |
| Playtest | `https://raw.githubusercontent.com/Ike-Grifact/Codex-RPG/foundry-playtest-manifest/system.json` |
| Estável | `https://github.com/Ike-Grifact/Codex-RPG/releases/latest/download/system.json` |

Cada URL passa a responder com a primeira publicação do canal. Os canais usam o mesmo ID para manter a associação dos mundos existentes ao sistema. Para usar os dois ao mesmo tempo, configure duas User Data independentes. Para trocar de canal, faça backup do sistema e instale pelo manifesto desejado.

Se o atualizador no Windows mostrar `EBUSY` ao remover `Data/systems/codex-rpg-foundry`, feche completamente o Foundry e execute o comando de desenvolvimento local acima. Ele refaz a instalação com backup e prepara o diretório persistente para as próximas atualizações pelo gerenciador.

## Publicação no GitHub

- O PR testa o instalador nos três sistemas operacionais e gera o ZIP com o manifesto como artefato do workflow **Codex RPG - pacote instalável Foundry v14**.
- Para publicar um playtest, aumente a versão de quatro partes em `system.json`, atualize `download` com a tag correspondente e crie a tag no commit revisado. Exemplo para a versão `0.2.1.1`:

  ```sh
  git tag foundry-playtest-v0.2.1.1
  git push origin refs/tags/foundry-playtest-v0.2.1.1
  ```

  O workflow testa, publica a pré-release e atualiza a branch exclusiva do manifesto depois de verificar o ZIP publicado. A quarta parte numérica ordena as revisões de playtest no Foundry v14.
- Para preparar (sem publicar) a versão estável correspondente, envie a tag `foundry-v0.2.1` no commit revisado. O workflow gera o manifesto de três partes e deixa a release em **rascunho**, com o ZIP e o manifesto anexados. Depois de aprovar a versão, o mantenedor deve abri-la em **Releases**, marcar **Set as the latest release** e clicar em **Publish release**. O fluxo de playtest nunca altera o lançamento estável.

## Fichas disponíveis

- **Personagem:** criação por Atributos, Conhecimentos, Práticas e Perícias; 15 XP iniciais compartilhados conforme SRD v1.0, após comprar um Atributo G1 e um Conhecimento OU Prática G1; Vida, Coragem, DE e Carga. Fichas históricas conservam os 20 XP de formação já concedidos e o registro de PP, sem conversão.
- **Criatura/Monstro Humanoide:** mesmos dados e progressão de Personagem, com Pavor local da oposição em combate.
- **Criatura/Monstro não humanoide:** Atributos monstruosos próprios (Grau 0 d4; Grau 1 d10; Grau 2 2d10; até 3d12), orçamento de XP a informar pelo Narrador e reserva de Pavor local limitada ao Grau. Graus 1–4 podem manter até três dados; Graus 5–6 até quatro, pagando **1P por dado além dos dois básicos**. Custos extraordinários e formas naturais específicas ainda requerem ficha do Narrador.

## Criação de fichas (protótipo)

### Criação pelo diretório do Foundry

Use **Criar ficha Codex** no diretório de Actors para escolher Aprendiz, Humanoide, Criatura comum ou Monstro extraordinário. **Importar do site** recebe o JSON do Criador de Fichas ou do Criar Conflito. No diretório de Items e em **+ Novo equipamento** na ficha, use o catálogo de playtest ou crie um item personalizado.

Para animar as faces rúnicas em 3D, ative o módulo **Dice So Nice** no mundo. O mesmo lançamento alimenta a animação sincronizada da mesa e as cartas dos dados mantidos. Nenhum cliente rerrola para animar; o resultado confirmado vai para o chat.

O [relatório de feedback](https://github.com/Ike-Grifact/Codex-RPG/blob/feat/criar-conflito-foundry-carga-20261113/docs/feedback-foundry-site-2026-11-14.md) compara a cobertura com o Criador, o Criar Conflito e o Roll & Keep do Assimilação.

A ficha de Personagem/Humanoide oferece **Compras mínimas orientadas**. A compra usa os custos vigentes para a origem e cobra apenas os graus ainda ausentes. Para um Humano novo, Atributo G1 e Conhecimento ou Prática G1 custam 3 dos 15 XP.

Em **Codex Genético → Identidade**, escolha Humano, Lucker de Sangue, Lucker Puro ou Runa Espinhos. As origens não humanas concedem os Graus e as Perícias indicados. O custo dos graus segue as faixas raciais do criador e os benefícios gratuitos ficam separados das aquisições pagas. O jogador escolhe durante a criação e o Narrador pode ajustar fichas já concluídas. Origens narrativas antigas e graus comprados são preservados. A Perseverança Humana tem uma marca de uso manual, restaurada no descanso longo.

O comparador oferece botão **“Usar estes dados mantidos”** para aplicar uma seleção alternativa dentro da **mesma rolagem já realizada**. Isso não rerrola, não consome recursos e não publica mensagem: somente a finalização confirmada produz efeitos.

## Rolagem

1. Em Jogar, clique nos cartões de um Atributo e uma Prática ou Conhecimento, em qualquer ordem. Perícias Avançadas habilitam o complemento pertinente. Criaturas não humanoides usam Atributos distintos. Editar ficha permite evolução e equipamentos, com a seleção de fontes oculta.
2. Escolha o modo de Disciplina, as condições de **Vantagem Absoluta (+1E), Vantagem (+1A), Normal, Desvantagem (−1A), Desvantagem Absoluta (−1E) ou Ação de Sorte (−2E)**, equipamento equipado e custos opcionais.
3. Use a ferramenta **Selecionar alvos** do Foundry e clique em **um token** no mapa. Passe o cursor sobre o token e pressione **T** para usar o atalho. O Codex aplica a DE defensiva da ficha e mantém a DE reservada para jogadores sem permissão de consulta. Use **DE manual** para testes sem alvo.
4. Role a pilha de até nove dados; **escolha quais manter**. Somente os mantidos geram símbolos. O crítico é detectado automaticamente quando todos os mantidos estão na face máxima (mínimo dois); não existe botão de “rolar crítico”.
5. Escolha quantos A usar para cancelar Pavor ou converter 2A→1E. Escolha as características da arma que deseja ativar, seguindo a regra **uma grátis no crítico e mais uma pagando**, ou uma paga no acerto comum.
6. Finalize a ação. O chat mostra acerto, falha, DE atingida, símbolos, dano básico, crítico e os custos. Crítico devolve Coragem segundo o teto de nível; monstro recebe recompensa em Pavor. PP histórico permanece sem uso nas ações atuais. A elevação comum paga 1 Coragem uma vez na rodada e sobe um dado na cadeia d4→d6→d10→d12.

**Comparativo das faces já roladas:** o bloco "Comparar escolhas" apresenta até quatro alternativas de dados mantidos, com DE, Êxito, Antecipar, Pavor e dano. A comparação não rerrola dados, não aplica a alternativa nem gasta recursos automaticamente.

**Alcance e movimento no mapa.** O Repertório mostra o alcance cadastrado de armas e a preparação exibe seu alcance efetivo quando habilitadas. Compare com a distância usando a régua da cena. A validação de alcance entre tokens, incluindo conjuração, e os limites de deslocamento por turno ficam a cargo da mesa. Arrastar o token e medir o trajeto são recursos nativos do Foundry.

**Carga no Foundry:** a ficha soma os pesos e quantidades dos equipamentos, informa a capacidade restante e o número alternativo de Leves, Médios e Pesados que cabem. Adicionar um item G1 acima da capacidade avisa sobre sobrecarga, sem inventar penalidades. As compras VT do site não são importadas automaticamente.

As seis classificações de situação não são classes de ataque separadas. Quando a ação não supera a DE, o chat diferencia falha sem símbolos, falha com Êxito e falha com Pavor. Quando supera a DE, diferencia acerto limpo, acerto neutro com Pavor e acerto com Pavor predominante.

## Pavor do Narrador

A HUD no topo da mesa exibe a quantidade de jogadores e o saldo de Pavor público sobre o teto, com uma runa por espaço da reserva. Use os botões −/+ ao lado de cada valor para ajustá-lo. Clique na contagem manual de jogadores para voltar à contagem do cadastro. Durante o combate, a HUD mostra quanto Pavor foi adicionado à reserva pública na rodada em exibição, já respeitando o teto. O mundo novo começa com 2P e retoma o saldo salvo nas próximas sessões.

Com combate ativo e um único alvo selecionado, o sistema tenta transferir **Pavor residual** ao Actor alvo: monstros e humanoides da oposição recebem Pavor local até o teto de Grau, Personagens recebem Coragem, 1 por Pavor, até 10/11/12/13 nos níveis 1/5/10/20. A operação é realizada no cliente do Narrador a partir da mensagem de chat. A decisão de alocação do excedente permanece manual. Recompensas críticas da oposição seguem a ordem local primeiro, público depois, sujeitas ao teto.

**Importante:** o mecanismo de transferência por chat ainda requer validação multijogador, especialmente de permissões, casos simultâneos e adversários pertencentes a jogadores. Não utilize como contabilidade oficial sem conferir a reserva na ficha.

## Itens e Perícias

- Itens Foundry `equipment`: arma, arma de fogo, armadura, escudo, foco e recursos genéricos. Campos de Grau, Carga, dado adicional, alcance, Integridade, Durabilidade, VT, características, elemento, munição, cartucho e recarga.
- O Compendium **Codex RPG — Equipamentos** contém as 90 entradas do catálogo oficial, com IDs estáveis, dados estruturados e indicação de preços pendentes. A Loja usa os mesmos dados e debita VT. O Narrador pode conceder equipamento por arrasto nativo; o jogador deve comprar pela Loja.
- O Compendium **Codex RPG — Perícias** contém 66 definições consultáveis, incluindo registros legados. Consulta, aquisição e devolução ficam no Codex Genético. Aquisições pagas continuam em `Actor.system.skills` e as de origem são calculadas a partir da linhagem. Arrastar uma definição não concede uma Perícia.
- O dado da arma ou foco é acrescentado à pilha quando o equipamento está equipado e a Perícia habilitadora é possuída. A Besta de uma mão com Manejo Duplo, múltiplos focos e efeitos simultâneos complexos ainda exigem código adicional.
- A Perícia **Criar Item de Foco e Magia** custa 1 XP e exige **Disciplina 1 + Inteligência 1 + Artesão 1**. Seu Cristal Elemental inicial é uma regra definida, mas a escolha e entrega automática do item ainda não têm formulário próprio.

## Limites da automação atual

O dano à Vida e à Integridade do alvo e as condições especiais são resolvidos pelo Narrador a partir da intenção e do resultado registrados no chat. A criação tem XP e requisitos validados; etapas narrativas do criador web continuam supervisionadas. A Loja controla VT. Comércio, múltiplos alvos, sucessões de transformações e composições de dados animais ainda indefinidas permanecem sob adjudicação. A Druídica v1.0 custa 1 XP, exige Foco + Terra e habilita os três portes sem Domar. Os limites de cada automação e as sete aquisições ainda pendentes estão descritos na auditoria.

## Testes de regras

Com Node.js compatível com Foundry v14 (Node 24), na pasta `foundry-prototype/`:

```bash
node --test tests/*.test.mjs
```

Os testes cobrem faces, Vantagens, retenção, críticos, Pavor descartado, progressão monstruosa, aquisição básica, Perícias, itens e DE com armadura. **Testes unitários não substituem teste de integração dentro do Foundry.**

## Identidade e compatibilidade

Sistema e textos pertencem ao Codex RPG. As soluções de engenharia visual de dados de projetos anteriores serviram apenas como referência de arquitetura, não como fonte de regras importadas. Não existe dependência de instalar Assimilação RPG. O código do Foundry reside isoladamente em `foundry-prototype/`, sem substituir o site ou a ficha web.
