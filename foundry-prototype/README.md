# Codex RPG — Protótipo de Sistema Foundry VTT v0.2.1 (branch de testes)

**Estado:** implementação experimental em JavaScript para **Foundry VTT v14**. Não foi executado dentro de uma instância real, nem testado entre múltiplos usuários. Utilize somente em mundo de testes com backup.

## Instalar manualmente

1. Baixe ou clone o repositório [Ike-Grifact/Codex-RPG](https://github.com/Ike-Grifact/Codex-RPG).
2. Copie **o conteúdo** de `foundry-prototype/` (não a pasta que o contém) para `FoundryVTT/Data/systems/codex-rpg-foundry/`.
3. Confirme que `system.json`, `module/`, `templates/`, `styles/`, `lang/` e `assets/` estejam dentro desse diretório.
4. Reinicie o Foundry e crie um mundo usando **Codex RPG — Foundry (playtest)**.

Não há instalador por URL de manifesto nem distribuição ZIP própria publicados. Uma URL `system.json` de subdiretório GitHub não é instalador remoto do Foundry.

## Fichas disponíveis

- **Personagem:** criação por Atributos, Conhecimentos, Práticas e Perícias; 20 XP iniciais compartilhados **EXPERIMENTAIS**, sem reservas, após comprar um Atributo G1 e um Conhecimento OU Prática G1; Vida, Coragem, PP, DE e Carga.
- **Criatura/Monstro Humanoide:** mesmos dados e progressão de Personagem, com Pavor local da oposição em combate.
- **Criatura/Monstro não humanoide:** Atributos monstruosos próprios (Grau 0 d4; Grau 1 d10; Grau 2 2d10; até 3d12), orçamento de XP a informar pelo Narrador e reserva de Pavor local limitada ao Grau. Graus 1–4 podem manter até três dados; Graus 5–6 até quatro, pagando **1P por dado além dos dois básicos**. Custos extraordinários e formas naturais específicas ainda requerem ficha do Narrador.

## Rolagem

1. Clique primeiro em uma fonte de base e depois em Atributo. Para monstro, clique em dois Atributos distintos.
2. Escolha o modo de Disciplina, as condições de **Vantagem Absoluta (+1E), Vantagem (+1A), Normal, Desvantagem (−1A), Desvantagem Absoluta (−1E) ou Ação de Sorte (−2E)**, equipamento equipado e custos opcionais.
3. Selecione **exatamente um Token como alvo** durante o combate para consultar a DE defensiva desse alvo; sem alvo, o teste é apenas anunciado no chat.
4. Role a pilha de até nove dados; **escolha quais manter**. Somente os mantidos geram símbolos. O crítico é detectado automaticamente quando todos os mantidos estão na face máxima (mínimo dois); não existe botão de “rolar crítico”.
5. Escolha quantos A usar para cancelar Pavor ou converter 2A→1E. Escolha as características da arma que deseja ativar, seguindo a regra **uma grátis no crítico e mais uma pagando**, ou uma paga no acerto comum.
6. Finalize a ação. O chat mostra acerto, falha, DE atingida, símbolos, dano básico, crítico e os custos. Crítico devolve Coragem/PP ao jogador segundo o teto; monstro recebe recompensa em Pavor.

**Comparativo das faces já roladas:** o bloco "Comparar escolhas" apresenta até quatro alternativas de dados mantidos, com DE, Êxito, Antecipar, Pavor e dano. A comparação não rerrola dados, não aplica a alternativa nem gasta recursos automaticamente.

**Carga no Foundry:** a ficha soma os pesos e quantidades dos equipamentos, informa a capacidade restante e o número alternativo de Leves, Médios e Pesados que cabem. Adicionar um item G1 acima da capacidade avisa sobre sobrecarga, sem inventar penalidades. As compras VT do site não são importadas automaticamente.

As seis classificações de situação não são classes de ataque separadas. Quando a ação não supera a DE, o chat diferencia falha sem símbolos, falha com Êxito e falha com Pavor. Quando supera a DE, diferencia acerto limpo, acerto neutro com Pavor e acerto com Pavor predominante.

## Pavor do Narrador

Ao entrar, o Narrador tem um **painel manual de Pavor público**. O teto é `2 + quantidade de jogadores cadastrados`; o saldo começa em 2 e não ultrapassa o teto. É possível adicionar/remover Pavor manualmente sem duplicar símbolos descartados.

Com combate ativo e um único alvo selecionado, o sistema tenta transferir **Pavor residual** ao Actor alvo: monstros e humanoides da oposição recebem Pavor local até o teto de Grau, Personagens recebem Coragem (1 por Pavor, até 10). A operação é realizada no cliente do Narrador a partir de mensagem de chat. Pavor excedente de ataques não é automaticamente convertido em saldo público; a decisão de alocação permanece manual, conforme solicitado. Recompensas críticas da oposição seguem a ordem local primeiro, público depois, sujeitas ao teto.

**Importante:** o mecanismo de transferência por chat ainda requer validação multijogador, especialmente de permissões, casos simultâneos e adversários pertencentes a jogadores. Não utilize como contabilidade oficial sem conferir a reserva na ficha.

## Itens e Perícias

- Itens Foundry `equipment`: arma, arma de fogo, armadura, escudo, foco e recursos genéricos. Campos de Grau, Carga, dado adicional, alcance, Integridade, Durabilidade, VT, características, elemento, munição, cartucho e recarga.
- Catálogo experimental G1 selecionável da ficha: armas, armaduras, escudos e foco Psíquico. **Os preços e alcances dos arcos, bestas e revólver são propostas**; Integridade das armaduras 10/15/20 é experimental e escudos 6/9/12 propostos.
- O dado da arma ou foco é acrescentado à pilha quando o equipamento está equipado e a Perícia habilitadora é possuída. A Besta de uma mão com Manejo Duplo, múltiplos focos e efeitos simultâneos complexos ainda exigem código adicional.
- A Perícia **Criar Item de Foco e Magia** custa 1 XP e exige **Disciplina 1 + Inteligência 1 + Artesão 1**. Seu Cristal Elemental inicial é uma regra definida, mas a escolha e entrega automática do item ainda não têm formulário próprio.

## Limites da automação atual

Esta versão **não** aplica dano automaticamente à Vida ou Integridade do alvo, nem estados especiais como Sangramento, Cravar, Derrubar, Enganchar, Explosivo, Perfuração direta ou travamento de arma. A seleção da característica registra a intenção no chat para resolução supervisionada. A criação tem XP calculado e requisitos básicos de Perícia, mas **ainda não replica integralmente o wizard guiado do site**, não controla a despesa VT de compras, e a Perícia de comércio não tem fórmula aprovada. Magias de múltiplos elementos, Manejo Duplo e equipamento com duas fontes acumuláveis aguardam implementação específica. **Domar e Montar** continuam em revisão.

## Testes de regras

Com Node.js compatível com Foundry v14 (Node 24), na pasta `foundry-prototype/`:

```bash
node --test tests/*.test.mjs
```

Os testes cobrem faces, Vantagens, retenção, críticos, Pavor descartado, progressão monstruosa, aquisição básica, Perícias, itens e DE com armadura. **Testes unitários não substituem teste de integração dentro do Foundry.**

## Identidade e compatibilidade

Sistema e textos pertencem ao Codex RPG. As soluções de engenharia visual de dados de projetos anteriores serviram apenas como referência de arquitetura, não como fonte de regras importadas. Não existe dependência de instalar Assimilação RPG. O código do Foundry reside isoladamente em `foundry-prototype/`, sem substituir o site ou a ficha web.
