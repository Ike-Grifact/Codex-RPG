# Padrão editorial dos livros — Codex RPG

**Estado:** diretriz editorial aplicada inicialmente ao descanso (v0.180, 27/11/2026). Não é fonte normativa de mecânicas.

## Função de cada material

| Material | Função |
| --- | --- |
| Livro do Jogador | Ensinar a jogar em ordem progressiva, a partir da intenção narrativa. |
| Mecânicas | Consultar procedimentos completos, condições e exceções. |
| Perícias | Consultar opções, requisitos, custos e benefícios. Seguir [padrão editorial das Perícias](padrao-editorial-pericias.md). |
| Livro do Mestre | Ensinar a conduzir cenas, arbitrar casos e preparar aventuras. |
| SRD | Consolidar decisões, versões e pendências. |

Consultar o SRD de maior versão e decisões posteriores antes de editar. Não importar regras de outros RPGs. Modelo próprio: [Recuperando Vida e Armadura](../livro.html#descansos), especialmente [Privações](../mecanicas/vantagens-e-desvantagens.html#privacoes).

## Modelo de escrita

1. **Título claro:** nome reconhecível no índice e na ficha.
2. **Contexto:** uma ou duas frases explicando por que e quando se usa a regra.
3. **Procedimento:** passos em ordem de resolução, verbos de ação, uma ideia por parágrafo. Introduzir os termos antes de usá-los.
4. **Valores:** tabela curta para comparações, escalas ou fórmulas. Não repetir integralmente a tabela em prosa.
5. **Exemplo:** personagens recorrentes, como Eldric; intenção, resultado e consequência, com números compatíveis com o SRD.
6. **Referência:** link descritivo ao verbete exato em Mecânicas ou Perícias. O leitor deve conseguir resolver situações comuns sem sair do capítulo.

Modelo flexível: nem toda seção precisa de tabela, exemplo ou ícone. Preservar a narrativa e as ilustrações que apresentam o mundo. Preferir parágrafos curtos e títulos descritivos. Evitar histórico de alterações, nomes de funções, notas de implementação e justificativas de balanceamento no fluxo de leitura. Pendências não são regras: manter no SRD ou referência técnica, sem ocultar lacunas que impeçam jogar.

## Identidade visual

- Reutilizar o [atlas SVG oficial](../assets/icons/codex/README.md), sem substituir seus símbolos por emojis.
- Êxito: Sowilo (E), verde #267A45; Antecipar: Ansuz (A), azul #2369BB; Temor: Thurisaz (T), roxo #542176. Usar status-exito.svg, status-antecipar.svg e status-pavor.svg; o nome histórico do arquivo não altera a terminologia.
- Preservar sinais, números e abreviações em texto: −1A junto de Ansuz, por exemplo. Não depender apenas de cor ou imagem. Ícones redundantes com rótulo textual devem ter alt vazio e aria-hidden no HTML.
- Pictogramas de sono, alimentação e hidratação são indicadores editoriais, não Aptidões, Perícias, elementos ou novas condições. Não reutilizar a gota de Vida para água potável.
- Reutilizar status-vida, status-coragem, status-integridade e categoria-artesao nos respectivos contextos. Ícones pequenos, alinhados e funcionais.
- Partes maiores com separadores; capítulos com divisórias e respiro; subseções com hierarquia coerente. Preservar rolagem contínua, índice, âncoras e navegação móvel.
- Tabelas com cabeçalhos semânticos, texto legível em temas claro/escuro e rolagem horizontal quando necessária.

## Exemplo — Sono, fome e sede

Verifique diariamente as necessidades do Aprendiz, mesmo sem um descanso longo válido.

| Necessidade | Mínimo diário | Privação |
| --- | --- | --- |
| Sono | 6 horas | Fadiga |
| Alimentação | 1 unidade de comida | Fome |
| Hidratação | 1 unidade de água | Sede |

Cada necessidade não atendida soma um nível de Desvantagem. Considere as demais circunstâncias desfavoráveis e aplique apenas o nível resultante.

| Privações | Condição | Efeito |
| --- | --- | --- |
| 0 | Normal | — |
| 1 | Desvantagem | −1A |
| 2 | Desvantagem Absoluta | −1E |
| 3 ou mais | Golpe de Sorte | −2E |

Se uma privação persistir por mais um dia, começa a prejudicar a Saúde. Penalidades de Saúde são independentes e somam-se à privação, sem o teto de −2E.

[Consultar privações e penalidades de Saúde](../mecanicas/vantagens-e-desvantagens.html#privacoes).

## Checklist antes de publicar

- [ ] Regras, valores, requisitos, custos e exceções conferidos no SRD atual.
- [ ] Conceitos introduzidos antes de serem usados; básico antes do avançado.
- [ ] Texto conciso sem remover condições relevantes.
- [ ] Tabelas, exemplos e ícones ajudam uma tarefa concreta.
- [ ] HTML e Markdown sincronizados; links e âncoras preservados.
- [ ] Verificação em tema claro/escuro e telas pequenas; testes pertinentes registrados.
- [ ] Pendências e divergências identificadas, sem preencher lacunas por suposição.

Aplicar gradualmente; não presumir que capítulos antigos já estejam adequados. O padrão não autoriza alterações de mecânica.
