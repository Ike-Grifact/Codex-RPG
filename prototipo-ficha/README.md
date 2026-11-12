## Criador e ficha unificados

**Página única e canônica:** `prototipo-ficha/`. O endereço histórico `criador.html` agora redireciona para cá, sem remover o registro antigo do navegador.

A nova ficha usa colunas **Atributos à esquerda**, **Práticas no centro** e **Conhecimentos à direita**. O usuário pode selecionar o Atributo ou a Base primeiro, mas a pilha ainda deve **rolar pelo menos um dado de Atributo**. A regra não exige Atributo mantido.

**Migração:** caso a ferramenta nova ainda não tenha personagem salvo, tenta trazer a ficha antiga armazenada sob `codex-rpg-ficha-nivel1-v1`. Nunca apaga o registro anterior. O botão **Importar ficha antiga** permite refazer a importação deliberadamente (com confirmação de substituição da ficha nova). Perícias personalizadas ou IDs sem tradução automática são documentados nas notas da ficha e continuam disponíveis na cópia antiga do navegador. Exportar JSON antes de substituir personagens continua recomendado.

## Provocar e Provocação Sofisticada

**Provocar** é ação tática básica: teste de Influência **≥ DE** do inimigo para provocar. No turno do alvo, ataques contra aliados do provocador têm **Desvantagem (−1A)**; ataques contra quem o provocou têm **Vantagem (+1A)**. **Provocação Sofisticada** exige **Influência 2** e custa **1 XP**; **benefício adicional distinto ainda PENDENTE**, porque a descrição fornecida repete o efeito básico. A ficha informa isso, sem automatizar condições de inimigos.

# Codex RPG — Criador e ficha jogável unificados

**Estado:** criador e ficha jogável unificados, com regras experimentais identificadas; adaptação Foundry. Não é o Livro do Jogador, nem substitui o criador atual.

## Acessar

**Versão web** (após o GitHub Pages disponibilizar os arquivos): https://ike-grifact.github.io/Codex-RPG/prototipo-ficha/

**Código:** https://github.com/Ike-Grifact/Codex-RPG/tree/main/prototipo-ficha

Também é possível baixar o repositório e abrir `prototipo-ficha/index.html` diretamente em um navegador. O projeto referencia o CSS e a logo que já existem em `../assets/`.

Esta pasta é a **única interface ativa** para criação e ficha. O antigo `criador.html` direciona para ela; o programa antigo `assets/creator.js` fica como código histórico, sem executar no site. A ficha usa sua chave própria de `localStorage`, pode importar os dados legados da chave antiga e **não apaga** a ficha original armazenada.

## Como experimentar — fluxo de criação

**Ao abrir uma ficha nova**, você vê o **construtor em cinco telas independentes**, não a ficha jogável de uma vez:

1. **Identidade** — nome obrigatório, conceito, origem, virtude, personalidade e portrait. A logo padrão usa fundo marfim no escuro para preservar o contraste; uma imagem enviada usa corte fotográfico normal.
2. **Atributos** — seis fontes com seu Grau, dados gratuitos, custos incrementais e botões de investimento; orçamento inicial **6 XP (EXPERIMENTAL)**.
3. **Formação** — seis Conhecimentos e seis Práticas, incluindo **uma única Prática Disciplina**; todos têm 1d6 gratuito no Grau 0, e compartilham **8 XP (EXPERIMENTAL)**.
4. **Perícias** — seleção de habilidades com preços, requisitos e custo efetivamente cobrado do orçamento inicial **5 XP (DEFINIDO)**. Maestria Arma Certa aparece como **PENDENTE para compra**, já que seu custo final ainda não foi fixado.
5. **Revisão** — identificação, dados de combate derivados, investimento por categoria e todas as compras. O botão **Concluir e abrir a ficha** consolida a criação e mostra **somente então** a ficha jogável completa.

Navegue com **Continuar** e **Voltar**. As etapas já visitadas ficam disponíveis na trilha superior. Se sair ou atualizar o navegador, os campos e a etapa são lembrados localmente. Para voltar a uma criação nova após finalizar, use **Novo personagem**; exporte a ficha anterior antes, pois essa operação a substitui.

**Na ficha completa:** experimente a composição **Armas → Força → Apresentação** e sua inversão, prepare a rolagem, escolha os dados mantidos e finalize. Inventário, Coragem, PP, XP e movimentação continuam disponíveis.

**Carregar exemplo** abre diretamente uma ficha já consolidada, para testar a parte jogável sem passar pelas cinco telas. **Importar** retoma o construtor para personagens ainda em criação e abre a ficha completa para personagens com criação concluída.

## Correções visuais desta versão

- **Modo escuro:** a logo SVG original contém grandes áreas cinza-escuro e não pode ficar sobre fundo escuro. Um fundo marfim permanente e `object-fit: contain` foram aplicados ao emblema padrão do personagem; o pequeno logo do cabeçalho ganhou a mesma base clara. Retratos personalizados permanecem sem o fundo de emblema.
- O criador agora usa painéis distintos por etapa e um resumo lateral de XP, progresso e estatísticas. Na conclusão, exibe a ficha integral já existente. Telas menores recebem layout responsivo.
- A identidade cromática anterior dos dados permanece: d4 roxo, d6 azul, d10 verde, d12 cinza e d20 dourado.

## Regras respeitadas

- São **6 Atributos, 6 Conhecimentos e 6 Práticas**. Disciplina é uma única Prática, e as Perícias determinam o uso marcial ou mágico.
- Todo teste começa por um **Conhecimento ou Prática (Base)** e recebe um **Atributo** como segundo componente. Uma terceira fonte é opcional, de Conhecimento ou Prática, com habilitação apropriada.
- Terceira fonte só aparece com Perícia habilitadora e **confirmação de pertinência**: a lista detalhada de combinações ainda exige decisão autoral.
- Até 9 dados rolados; retenção de 2 normalmente até o nível 5, 3 a partir do nível 6, ou mais 1 com Coragem, teto 4.
- Ao menos um dado mantido é de Atributo.
- Só dados mantidos produzem símbolos E/A/P. O resultado distingue acertos puros, acertos com Pavor normal/predominante e falhas.
- A DE defensiva é Agilidade + metade de Destreza arredondada para baixo; Vida máxima é 3 + Vigor + metade de Força arredondada para baixo.
- Perícia em Coragem a partir do nível 5; recuperação de PP 2 Coragem → 1 PP, no máximo uma vez por turno.
- Recuperação de Vida por faixas 3/3, 2/3 e 1/3 é apresentada sem criar um temporizador de cura não aprovado.

## Limites e hipóteses do protótipo

- **A compra de graus e Perícias agora calcula e consome XP**. Os custos acumulados das fontes são os mesmos do criador: Atributos 0/1/3/7/15/31/55 e Formação 0/2/8/20/38/66/102. As Perícias são cobradas conforme os preços documentados no catálogo.
- **O nível 1 possui 5 XP iniciais de Perícias [DEFINIDO].** Os 6 XP de Atributos e 8 XP de Formação ainda são **EXPERIMENTAIS**. Uma compra que exceda seu orçamento de categoria requer XP de evolução livre.
- **XP por nível segue PENDENTE.** A tabela de referência 19/31/46/.../664 XP é apenas uma curva de playtest; o protótipo não exige esses valores para subir de nível e não os concede automaticamente.
- **Antes de concluir a criação**, pode reorganizar compras. **Depois**, não permite reduzir graus nem desfazer Perícias; evolução é feita comprando com novos XP.
- **Maestria Arma Certa** aparece para consulta com seu efeito definido (+1E no peso favorável); seu custo de XP e requisitos finais continuam PENDENTES, por isso ainda não é comprável.
- Equipamentos não acrescentam dados nem resistência automática: a composição específica e os valores de integridade ainda dependem do catálogo final. A carga está apresentada com a contribuição da Prática compartilhada de forma **experimental**.
- A terceira fonte possui confirmação manual em vez de um catálogo exaustivo de compatibilidades.
- **Deslocamento — DEFINIDO nesta revisão:** 8 m básicos + 1 m por grau de Agilidade + 1 m por cada 3 graus completos de Atletismo. O resultado é exibido no cabeçalho. Alterações por terreno, equipamentos e condições não são automatizadas.
- **Identidade cromática dos dados:** d4 roxo (Pavor), d6 azul (Antecipar), d10 verde (Êxito), d12 cinza e d20 dourado; o tema escuro foi ajustado e a legenda exibe todos os cinco formatos.
- Furtividade, magias especiais, recursos de ameaça, Pavor público/local, efeitos de armaduras e combates grupais não estão totalmente automatizados.
- O rebalanceamento recente de peso, Vantagem absoluta e Arma Certa ainda não foi integralmente incorporado ao motor de rolagens; não confundir a prévia visual com a tabela definitiva de combate.
- Rolagens já reveladas ficam salvas e só podem ser descartadas com confirmação expressa.
- Não é um motor autoritativo online/multijogador e não implementa Foundry. O propósito é **testar a experiência HTML antes de aprovar sua adaptação**.

## Arquivos

```
prototipo-ficha/
  index.html   # visual da ficha e acessibilidade básica
  styles.css   # identidade visual Codex e responsividade
  app.js       # estado, escolha de fontes, dados, rolagens e salvamento local
  README.md    # instruções e limites
```

**Atenção:** os documentos internos de SRD não estão vinculados nesta página; apenas o Livro e o criador originais são acessíveis pela navegação.

## Modo edição e runas nas faces — atualização de 11/11/2026

Na ficha jogável, o botão **Editar ficha** alterna entre o modo normal (clicar nas fontes para montar a rolagem) e o modo de edição (botões **+** e **−** para corrigir graus e XP de Atributos, Conhecimentos e Práticas). Nesse modo também é possível desfazer Perícias adquiridas, desde que não invalide seus requisitos. O modo edição não funciona durante rolagem pendente. O XP investido e o XP livre são recalculados automaticamente; **isso corrige a ficha, não cria uma regra de reembolso de XP em campanha**.

A fonte compartilhada passou a se chamar **Disciplina**. Fichas existentes com o identificador interno `armas_conjuracao` mantêm seus graus e XP: só mudou o nome visível, não os dados salvos.

Nos dados rolados, o destaque principal mostra **as runas reais da face repetidas uma vez por símbolo** (por exemplo, **ᛋ ᛋ ᚦ**, em vez de uma face numérica grande). As contagens menores continuam sob o dado e os valores numéricos das faces permanecem preservados para cálculo, acessibilidade e críticos.

**Retenção corrigida:** ao menos um dado de Atributo deve ser **rolado**, mas o jogador é livre para descartá-lo e manter apenas outros dados válidos. O crítico de duas ou mais faces máximas também não exige Atributo mantido.


## Armaduras por tipo e Grau (SRD v0.38)

O tipo de armadura é independente do Grau: **Muito Leve** (sem Integridade, +2 DE na esquiva), **Leve** (Integridade baixa, +1 DE na esquiva), **Média** (0 DE), **Pesada** (−1 DE) e **Muito Pesada** (−2 DE, imunidade física natural e requisitos Vigor 6 + Atletismo 6 em qualquer Grau).

A ficha mostra **DE base** e, quando for relevante, o valor de **DE para esquiva**. O teto 9 é aplicado à DE natural antes dos modificadores. O peso da peça não é alterado automaticamente ao escolher Grau 3 ou Grau 4. Uma Muito Leve não pode ter Integridade. Ao equipar, o protótipo verifica nível mínimo: G1 nível 1, G2 nível 5, G3 nível 10, G4 nível 20. Por conveniência técnica, o protótipo deixa apenas uma armadura equipada de cada vez; **não é uma nova regra oficial de sobreposição**.

**Propriedades por Grau:** Muito Leve e Leve recebem campo de resistência G3+; Média G2+; Pesada G2+ com segunda resistência G3+; Muito Pesada G2+ com resistência e G4 com **imunidade elemental adicional cumulativa**. A ficha apenas registra os elementos e mostra a imunidade física natural da Muito Pesada, **não calcula resistências nem dano recebido**. A natureza **neutra do Psíquico** impede que seja tratado como dano físico automaticamente. Integridades numéricas aguardam análise do dano das Perícias iniciais.

## Perícias autorais e orçamento de criação

**5 XP de Perícias no nível 1 [DEFINIDO]**; Atributos 6 XP + Formação 8 XP permanecem EXPERIMENTAIS. O catálogo da ficha apresenta as 15 Perícias fornecidas pelo autor, os dois novos Disparos pendentes e as opções anteriores. Só libera compra das Perícias com custo informado e pré-requisitos verificáveis; **Manejo Perfeito, Recuperação Vigorosa, sua Maestria em Movimento e Instinto de Sobrevivência têm custo PENDENTE**, e Maestria em Manejo Duplo aguarda especificação dos requisitos.

A ficha **não executa automaticamente** efeitos de Golpe Fulminante/Espalhar Golpe/Disparos pendentes, mudança de peso de Pugilismo, manobras, alojamento de armas, recuperação em movimento ou inclusão de fonte extra de Disciplina Avançada. A aquisição registra a Perícia, não inventa procedimentos. A descrição e a lista de decisões estão no [SRD v0.38](../docs/srd-continuidade-v0.38.md).


## Críticos cumulativos (SRD v0.29)

O rolador de dados da ficha HTML reconhece **crítico quando todos os dados escolhidos para manter estão em suas faces máximas**, exigindo pelo menos dois mantidos e um dado de Atributo. Apenas a **runa nos símbolos das faces máximas** ganha dourado: o número, o corpo e o contorno do dado não recebem nova cor por ser uma face candidata a crítico.

- **2 mantidos:** converte até 1 Pavor próprio em 1 Êxito e recupera até 1 PP e 1 Coragem.
- **3 mantidos:** benefícios anteriores, mais +1 Êxito, +1 Antecipar, total de até 2 PP e 2 Coragens recuperados.
- **4 mantidos:** todos os benefícios anteriores e **dano básico dobrado**; a interação final com proteções e limites de Vida ainda está pendente, portanto o valor exibido é anterior à resolução de armadura.

A recuperação respeita os tetos: **PP máximo 0 nos níveis 1–4**, 1 nos níveis 5–9, 2 nos níveis 10–19 e 3 no nível 20; Coragem máxima normal 10. O terceiro dado mantido no nível 1 ainda consome 1 Coragem; as recuperações são aplicadas após esse gasto. Os críticos ficam registrados no histórico do personagem.

**Os críticos dos monstros foram documentados no Livro e SRD**, com conversão de recuperações em Pavor (2P/4P/4P), mas **não são simulados no rolador da ficha de jogador**. O protótipo não automatiza os gastos do Narrador nem a alocação local-primeiro do Pavor crítico dos monstros, cujo excedente segue para a reserva pública até seu teto.


## Redistribuição experimental para o nível 1 (6/8/5)

A distribuição de playtest usa **6 XP Atributos / 8 XP Formação [EXPERIMENTAIS] + 5 XP Perícias [DEFINIDO]**. O total de 19 XP não é definitivo enquanto os dois primeiros orçamentos não forem aprovados. A curva de XP dos níveis superiores não foi alterada.

**Impacto para playtest:** a Formação Grau 2 custa 8 XP acumulados e passa a ser acessível na criação para uma única fonte (2d10), enquanto o Atributo Grau 3 custa 7 XP e deixa de caber no orçamento inicial de Atributos. A progressão ainda usa os mesmos custos acumulados; o excedente de categorias necessita XP de evolução.

## Atualização operacional — Disciplina e XP residual (SRD v0.38)

- **Disciplina** é a Prática compartilhada para armas ou conjuração; testes marciais básicos podem ser rolados com Disciplina + Atributo sem comprar Armas 1. Habilitações específicas permanecem para efeitos próprios, e a conjuração especializada conserva os requisitos pertinentes.
- **Disciplina Avançada:** somente quando a ação usa Disciplina, permite acrescentar um Atributo, Conhecimento ou Prática pertinente; a ficha passa a montar essa terceira fonte, inclusive outro Atributo, sem elevar a retenção.
- **Filtros do catálogo:** busca, Atributos, Conhecimentos, Práticas, relacionadas às adquiridas e requisitos atingidos. A categorização temática não estabelece requisitos.
- **Saldo inicial livre:** XP não gasto durante o orçamento inicial passa a ser livre para novas compras após concluir a criação. Compras reduzem o saldo, sem permitir reembolso livre automático de compras consolidadas. Os 5 XP iniciais de Perícias são DEFINIDOS; 6 XP Atributos/8 XP Formação são EXPERIMENTAIS.
- **Espalhar Golpe:** metade do dano dos Êxitos arredondada para baixo é calculada antes de aplicar a Integridade e as resistências de cada alvo adicional que tenha sido acertado conforme sua DE individual.
