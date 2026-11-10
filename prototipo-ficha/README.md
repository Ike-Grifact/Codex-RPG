# Codex RPG — Protótipo HTML de ficha jogável

**Estado:** protótipo visual e funcional para aprovação da experiência de uso, anterior à adaptação Foundry. Não é o Livro do Jogador, nem substitui o criador atual.

## Acessar

**Versão web** (após o GitHub Pages disponibilizar os arquivos): https://ike-grifact.github.io/Codex-RPG/prototipo-ficha/

**Código:** https://github.com/Ike-Grifact/Codex-RPG/tree/main/prototipo-ficha

Também é possível baixar o repositório e abrir `prototipo-ficha/index.html` diretamente em um navegador. O projeto referencia o CSS e a logo que já existem em `../assets/`.

Esta pasta é **completamente independente** de `criador.html` e do protótipo de Foundry. A ficha usa `localStorage` sob outra chave e não altera a ficha salva no criador.

## Como experimentar

1. Abra a página e escolha **Carregar exemplo** para observar dados e recursos sem preencher uma ficha do zero.
2. Clique em **Armas** (Prática compartilhada) como **Base** e em **Força** como Atributo. A preparação abre automaticamente à direita (ou abaixo, no celular).
3. Se a Perícia **Combinação de Fontes** estiver marcada, clique em **Apresentação** como terceiro componente e confirme a pertinência contextual na preparação.
4. Confirme o teste com **Rolar dados**, depois clique nos dados que serão mantidos. Pode gastar Antecipar para anular Pavor, converter 2A em 1E ou passar uma oportunidade.
5. Finalize a ação: os custos de Coragem aplicáveis são descontados e o último resultado fica registrado.
6. Limpe a composição e teste **Apresentação → Força → Armas**. Os dados podem ser os mesmos, mas agora a Base é Apresentação e a finalidade da ação mudou.
7. Use **Perícias**, **Equipamentos** e **Recursos**; troque o portrait, o tema claro/escuro e experimente salvar e carregar JSON.

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

- **Sem gastos automáticos de XP** na aquisição de Perícias e na elevação de fontes; estes controles servem à exploração visual.
- Equipamentos não acrescentam dados nem resistência automática: a composição específica e os valores de integridade ainda dependem do catálogo final. A carga está apresentada com a contribuição da Prática compartilhada de forma **experimental**.
- A terceira fonte possui confirmação manual em vez de um catálogo exaustivo de compatibilidades.
- Furtividade, magias especiais, recursos de ameaça, Pressão/Pavor local, efeitos de armaduras e combates grupais não estão totalmente automatizados.
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
