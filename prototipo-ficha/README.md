# Codex RPG — Protótipo HTML de ficha jogável

**Estado:** protótipo visual e funcional para aprovação da experiência de uso, anterior à adaptação Foundry. Não é o Livro do Jogador, nem substitui o criador atual.

## Acessar

**Versão web** (após o GitHub Pages disponibilizar os arquivos): https://ike-grifact.github.io/Codex-RPG/prototipo-ficha/

**Código:** https://github.com/Ike-Grifact/Codex-RPG/tree/main/prototipo-ficha

Também é possível baixar o repositório e abrir `prototipo-ficha/index.html` diretamente em um navegador. O projeto referencia o CSS e a logo que já existem em `../assets/`.

Esta pasta é **completamente independente** de `criador.html` e do protótipo de Foundry. A ficha usa `localStorage` sob outra chave e não altera a ficha salva no criador.

## Como experimentar

1. Abra a página. Para **construir um Aprendiz**, use as setas de Grau e os botões **Comprar** nas Perícias; a ficha calcula quanto XP resta dos orçamentos experimentais **7 de Atributos + 7 de Formação + 5 de Perícias**. Não é possível comprar sem saldo.
2. Use **Concluir criação** para consolidar as compras. Em **Criação e evolução**, registre os XP recebidos por meio de **+ Adicionar XP** e clique em **Subir nível** quando o Narrador autorizar. A progressão de XP por nível exibida é apenas uma referência de playtest, não uma regra definitiva. Subir nível não concede XP automaticamente.
3. Alternativamente, escolha **Carregar exemplo** para observar uma ficha avançada sem preencher tudo do zero.
4. Clique em **Armas** (Prática compartilhada) como **Base** e em **Força** como Atributo. A preparação abre automaticamente à direita (ou abaixo, no celular).
5. Se a Perícia **Combinação de Fontes** estiver marcada, clique em **Apresentação** como terceiro componente e confirme a pertinência contextual na preparação.
6. Confirme o teste com **Rolar dados**, depois clique nos dados que serão mantidos. Pode gastar Antecipar para anular Pavor, converter 2A em 1E ou passar uma oportunidade.
7. Finalize a ação: os custos de Coragem aplicáveis são descontados e o último resultado fica registrado.
8. Limpe a composição e teste **Apresentação → Força → Armas**. Os dados podem ser os mesmos, mas agora a Base é Apresentação e a finalidade da ação mudou.
9. Use **Perícias**, **Equipamentos** e **Recursos**; troque o portrait, o tema claro/escuro e experimente salvar e carregar JSON.

## Regras respeitadas

- São **6 Atributos, 6 Conhecimentos e 6 Práticas**. Armas ou Conjuração é uma única Prática, e as Perícias determinam o uso marcial ou mágico.
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
- **Orçamento inicial 7/7/5 XP é EXPERIMENTAL**, não foi consolidado como regra oficial. Uma compra que exceda seu orçamento de categoria requer XP de evolução livre.
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
