# Codex RPG para Foundry VTT v14

Playtest 0.3.0, validado no Foundry v14.367 em mundo isolado. O sistema usa o identificador `codex-rpg-foundry` e os tipos `character`, `humanoid`, `creature` e `equipment` do protótipo.

## Instalação

1. Faça backup e copie o conteúdo de `foundry-prototype/` para `Data/systems/codex-rpg-foundry/`.
2. Reinicie o Foundry e abra um mundo de teste com **Codex RPG — Foundry (playtest)**.

## Ficha e rolagem

- Use **Jogar** para ações, **Criar/Editar** para identidade, graus e Perícias, e **Administração** para nível, XP de campanha, orçamento de criatura e controle da criação. Reverter uma compra durante a criação libera seu custo. Em campanha, a reversão administrativa registra o custo sem reembolso. Compras antigas continuam na contabilidade quando o ID ou custo histórico é conhecido.
- Na aba **Resumo**, escolha a fonte e o Atributo. A criatura usa Atributos monstruosos. A aba **Inventário e Combate** permite equipar itens e indicar a resposta defensiva usada pela ficha. O Narrador pode identificar humanoides da oposição sem mudar seu tipo ou a escala de XP.
- Em Disciplina, selecione teste comum, ataque com arma ou conjuração. Um ataque básico com arma equipada usa as fontes da ficha. A Perícia pertinente habilita o dado extra e as características especiais. Conjuração usa foco ou magia equipada com elemento habilitado.
- Escolha a situação e, em combate, selecione um Token alvo. A preparação mostra a DE e a pilha. Sem alvo, a DE manual é opcional.
- Role, escolha os dados mantidos e distribua Antecipar. A rolagem pendente fica no Actor. Quando há Narrador ativo e a permissão de consulta está habilitada, o cliente do Narrador serializa rolagens por Actor. Cada publicação tem ID estável e o registro da ação e do custo é gravado antes do chat, para permitir retomada se a publicação falhar.
- Crítico exige pelo menos dois dados mantidos, todos na face máxima. Um Atributo deve ter sido rolado e pode ser descartado. No acerto, a escolha de características aparece apenas quando habilitada. Os efeitos escolhidos são registrados no chat para resolução da mesa.

## HUD de Pavor

**Configurações de jogo → Codex RPG** permite ao Narrador informar o número real de jogadores. O valor `−1` usa as contas de jogador cadastradas. O teto é 2 + jogadores. O Narrador ativo controla o saldo persistente no topo da área de jogo e autoriza a exibição para jogadores. Cada conta tem sua própria configuração de visibilidade.

A reserva local de Pavor fica na ficha da oposição. O crítico preenche o espaço disponível nela. A mensagem informa a recompensa excedente para adjudicação e indica o Pavor efetivamente mantido. A distribuição de Pavor residual, a transferência de Coragem e a movimentação de turnos por Antecipar são resolvidas pelo Narrador.

## PENDENTE e EXPERIMENTAL

- **PENDENTE** — orçamento monstruoso por Grau, capacidades extraordinárias, Manejo Duplo e acúmulo da besta de uma mão. O teste com uma única arma continua disponível.
- **PENDENTE** — entrega do Cristal Elemental inicial, propriedades avançadas, dano final à Vida ou Integridade, condições, cartuchos, recarga e comércio. Use os campos do item e a adjudicação do Narrador.
- **EXPERIMENTAL** — criação com 6 XP em Atributos e 8 em Formação. Os 5 XP iniciais de Perícias são definidos. Preços e alcances do catálogo G1 permanecem referências de playtest, assim como valores de Integridade assinalados no SRD.

## Verificação

Na raiz do repositório, execute:

```sh
node --test foundry-prototype/tests/*.test.mjs
```

No Foundry v14, crie um personagem com Disciplina 1 e Perícia em Armas Leves. Adicione e equipe Faca G1. Em combate, mire um Token com DE conhecida, role Disciplina + Atributo, reabra a ficha, escolha dados e publique no chat. Repita sem alvo e sem a Perícia. Com duas sessões, ajuste a HUD como Narrador e verifique permissões e visibilidade individual como jogador.

Referências de engenharia consultadas: D&D5e 5.3.3 para composição das fichas e preparação, Assimilação para ApplicationV2, inserção no topo do canvas, integração da rolagem e testes. Implementação, catálogo, símbolos e estilos do Codex.

## Interface 0.3.1 — criação e páginas separadas (trabalho no PR #2)

A ficha jogável utiliza a identidade visual do site (base azul-escura e detalhes dourados) sem copiar regras de sistemas terceiros. As páginas são **Jogar**, **Evolução**, **Perícias** e **Inventário e Combate**. A página Jogar mostra somente Perícias adquiridas, elementos e itens equipados. A compra e leitura das Perícias ficam em sua própria página.

Para **novos Personagens/Humanoides**, o campo `creationOpen` começa ligado e a criação assistida inicia em 5 etapas: Identidade → Atributos → Formação → Perícias → Revisão. O fluxo reaproveita as ações existentes de compra por XP e verificação dos requisitos, não cria uma segunda economia. Fichas antigas com criação encerrada não são reiniciadas. O monstro extraordinário continua com sua ficha de edição por Grau e XP próprio.

**Verificação necessária em Foundry real:** redimensionamento da janela, rolagem após voltar à página Jogar, reversão de XP e fluxo de criação antes e depois da finalização. Não foi importada a economia de Assimilação; apenas a organização por etapas serviu de referência.
