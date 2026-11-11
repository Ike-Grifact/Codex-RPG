# Codex RPG — Protótipo HTML de ficha jogável

**Estado:** protótipo visual e funcional para aprovação da experiência de uso, anterior à adaptação Foundry. Não é o Livro do Jogador, nem substitui o criador atual.

## Acessar

**Versão web** (após o GitHub Pages disponibilizar os arquivos): https://ike-grifact.github.io/Codex-RPG/prototipo-ficha/

**Código:** https://github.com/Ike-Grifact/Codex-RPG/tree/main/prototipo-ficha

Também é possível baixar o repositório e abrir `prototipo-ficha/index.html` diretamente em um navegador. O projeto referencia o CSS e a logo que já existem em `../assets/`.

Esta pasta é **completamente independente** de `criador.html` e do protótipo de Foundry. A ficha usa `localStorage` sob outra chave e não altera a ficha salva no criador.

## Como experimentar — fluxo de criação

**Ao abrir uma ficha nova**, você vê o **construtor em cinco telas independentes**, não a ficha jogável de uma vez:

1. **Identidade** — nome obrigatório, conceito, origem, virtude, personalidade e portrait. A logo padrão usa fundo marfim no escuro para preservar o contraste; uma imagem enviada usa corte fotográfico normal.
2. **Atributos** — seis fontes com seu Grau, dados gratuitos, custos incrementais e botões de investimento; orçamento inicial **6 XP (EXPERIMENTAL)**.
3. **Formação** — seis Conhecimentos e seis Práticas, incluindo **uma única Prática Disciplina**; todos têm 1d6 gratuito no Grau 0, e compartilham **8 XP (EXPERIMENTAL)**.
4. **Perícias** — seleção de habilidades com preços, requisitos e custo efetivamente cobrado do orçamento inicial **5 XP (EXPERIMENTAL)**. Maestria Arma Certa aparece como **PENDENTE para compra**, já que seu custo final ainda não foi fixado.
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
- **Orçamento inicial 6/8/5 XP é EXPERIMENTAL**, não foi consolidado como regra oficial. Uma compra que exceda seu orçamento de categoria requer XP de evolução livre.
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

## DE defensiva e armadura especializada (SRD v0.30)

A ficha calcula **DE natural = min(9, Agilidade + ⌊Destreza/2⌋ + ⌊Vigor/2⌋ + ⌊Atletismo/3⌋)**; o cálculo permanece atualizado com os graus da ficha. Se uma armadura especial estiver equipada, a ficha mostra **DE natural − 2**. O caso de DE mínima 0 ou 1 ainda está pendente e não foi assumido.

Para registrar uma **armadura Pesada Grau 4 especializada**, crie um item Armadura, escolha peso **Alto/Pesado**, informe Grau **4** e marque **Armadura Pesada especializada**. Preencha a **resistência elemental da peça** com o elemento fixado na compra ou fabricação. A ficha só permitirá equipá-la se o personagem tiver **Vigor 6 e Atletismo 6**. Ela aplica somente a penalidade de DE no cálculo automático.

**Regras não automatizadas no protótipo:** a imunidade a todo dano físico comum (que anula dano à integridade e à Vida), a resistência elemental específica e a exceção de penetração por arma perfurante habilitada (crítico pertinente ou técnica com custo de 1 PP/2 Coragens quando aplicável). Também continuam possíveis condições como derrubar, afastar e **Sangramento superficial** de cortantes; esse Sangramento não causa dano nem perda periódica de Vida e não é igual a magia de Sangue. A mesa aplica essas consequências; a ficha não simula ataques inimigos.

## Críticos cumulativos (SRD v0.29)

O rolador de dados da ficha HTML reconhece **crítico quando todos os dados escolhidos para manter estão em suas faces máximas**, exigindo pelo menos dois mantidos e um dado de Atributo. Apenas a **runa nos símbolos das faces máximas** ganha dourado: o número, o corpo e o contorno do dado não recebem nova cor por ser uma face candidata a crítico.

- **2 mantidos:** converte até 1 Pavor próprio em 1 Êxito e recupera até 1 PP e 1 Coragem.
- **3 mantidos:** benefícios anteriores, mais +1 Êxito, +1 Antecipar, total de até 2 PP e 2 Coragens recuperados.
- **4 mantidos:** todos os benefícios anteriores e **dano básico dobrado**; a interação final com proteções e limites de Vida ainda está pendente, portanto o valor exibido é anterior à resolução de armadura.

A recuperação respeita os tetos: **PP máximo 0 nos níveis 1–4**, 1 nos níveis 5–9, 2 nos níveis 10–19 e 3 no nível 20; Coragem máxima normal 10. O terceiro dado mantido no nível 1 ainda consome 1 Coragem; as recuperações são aplicadas após esse gasto. Os críticos ficam registrados no histórico do personagem.

**Os críticos dos monstros foram documentados no Livro e SRD**, com conversão de recuperações em Pavor (2P/4P/4P), mas **não são simulados no rolador da ficha de jogador**. O protótipo não automatiza os gastos do Narrador nem a alocação local-primeiro do Pavor crítico dos monstros, cujo excedente segue para a reserva pública até seu teto.


## Redistribuição experimental para o nível 1 (6/8/5)

A distribuição inicial foi ajustada de 7 XP em Atributos / 7 XP em Formação / 5 XP em Perícias para **6 XP em Atributos / 8 XP em Formação / 5 XP em Perícias**. O total de 19 XP permanece. A mesma distribuição **EXPERIMENTAL** foi registrada nos documentos de leitura e no SRD de continuidade; não é um orçamento inicial definitivo. A curva de XP dos níveis superiores não foi alterada.

**Impacto para playtest:** a Formação Grau 2 custa 8 XP acumulados e passa a ser acessível na criação para uma única fonte (2d10), enquanto o Atributo Grau 3 custa 7 XP e deixa de caber no orçamento inicial de Atributos. A progressão ainda usa os mesmos custos acumulados; o excedente de categorias necessita XP de evolução.
