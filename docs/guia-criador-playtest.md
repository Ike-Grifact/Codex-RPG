# Laboratório de Aprendizes — guia de playtest

O [Criador de Ficha nível 1](../criador.html) ajuda a testar construções iniciais e a futura árvore de Perícias do Codex RPG. Está vinculado ao [SRD de Continuidade v0.22](srd-continuidade-v0.22.md).

## Criação nível 1: orçamento experimental

| Categoria | XP | Estado |
|---|---:|---|
| Atributos | 7 | EXPERIMENTAL |
| Conhecimentos e Práticas | 7 | EXPERIMENTAL |
| Perícias | 5 | 5 XP iniciais definidos, porém soma com 14 históricos ainda EXPERIMENTAL |
| **Total** | **19** | **EXPERIMENTAL** |

A progressão dos dados de cada grau e seu custo acumulado são do SRD. A escolha das profissões é aberta, não existe classe obrigatória.

## O que funciona

- Distribuir XP em seis Atributos, Conhecimentos, Práticas e Perícias iniciais com seus preços.
- Ver Vida, DE natural, balanço corporal, carga parcial, Coragem e resumo da ficha.
- Comprar Perícias documentadas, com uma verificação conservadora dos requisitos conhecidos.
- Criar **rascunhos de Perícias personalizadas**, de 1 a 5 XP, com nome, requisitos e efeito. Elas entram como opções na ficha, não no catálogo oficial.
- Selecionar Atributo e fontes de dados, rolar d4/d6/d10/d12, manter manualmente dois dados (ou três mediante Coragem) e converter Antecipar.
- Testar o bônus **condicional de +1E ou +2E** concedido por Perícias distintas mediante um seletor manual; não ultrapassar +2E por ação.
- Aplicar afinidades entre peso do ataque (leve, médio, pesado) e balanço defensivo do alvo (leve, médio, pesado): Vantagem +1A / Desvantagem −1A.
- Calcular DE atingida, classificação do resultado, dano básico por E e piso(P/2), e gastos de Coragem.
- Salvar localmente no navegador, importar/exportar JSON e imprimir.

## Como desenhar uma Perícia experimental

Na etapa **04 · Perícias iniciais**, expanda **“Desenhar uma Perícia experimental”** e preencha:

1. **Nome:** distinto e curto.
2. **Custo em XP:** hipótese de 1 a 5.
3. **Requisitos:** Atributo, Conhecimento, Prática, Perícia, tipo de arma ou situação.
4. **Efeito:** exatamente o que o personagem faz e em quais condições.

Clique **“Registrar como rascunho”**. Ela aparecerá em uma categoria separada e poderá ser comprada com o XP da ficha. As Perícias experimentais são salvas e exportadas junto ao personagem, mas **o criador não verifica automaticamente seus requisitos nem aplica seus bônus**. O autor ou Narrador deve validar caso a caso.

**Exemplo PROPOSTO, não oficial:** Passo Calculado — 1 XP, requer Agilidade 1 e espaço livre; concede +1E em uma manobra de reposicionamento quando a condição é cumprida. Respeita o teto +2E de Perícias por ação.

## Como testar no laboratório

1. Crie e equipe conceitualmente um Aprendiz; o catálogo físico de equipamentos ainda não está disponível.
2. Escolha Atributo e fonte adicional. A terceira fonte, se habilitada pela Perícia de combinação, ainda depende de pertinência validada.
3. Escolha DE de teste e balanço do alvo. Nos níveis 1–5, DE 2 é uma referência de confronto comum para playtest, DE 3 treinado e DE 4 excepcional — todas EXPERIMENTAIS, não obrigações.
4. Se desejar, gaste Coragem para elevar o primeiro dado de Atributo **antes de rolar**.
5. Role e **selecione os dados mantidos**. É obrigatório manter um dado de Atributo; o terceiro dado custa 1 Coragem.
6. Declare, quando pertinente, +1E ou +2E de Perícias. O criador disponibiliza esse valor para testes e pressupõe que os requisitos foram cumpridos.
7. Gaste Antecipar para cancelar Pavor e converter pares em Êxito. Não reutilize símbolos.
8. Finalize a ação para atualizar a Coragem da ficha.

Compare os resultados nos diferentes perfis de DE e peso. O Pavor remanescente não causa automaticamente uma ativação inimiga a cada símbolo; o Narrador usa as reservas e oportunidades.

## Limitações explícitas

Ainda não há cálculo automático de críticos, dano elemental específico, armas físicas, escudos, integridade da armadura, dano à Vida, combate de grupos, condições de Saúde, alcance ou ações conjuntas. O laboratório mostra **dano básico**, não a totalidade de um combate. A capacidade de carga está parcialmente implementada e não soma o grau completo de Armas, ainda não modelado no protótipo.

Bônus de múltiplas Vantagens/Desvantagens até estados absolutos permanecem PENDENTES e não são simulados automaticamente. D20 reforçado G é EXPERIMENTAL e não é dado comum do Aprendiz nível 1.

O laboratório é uma ferramenta para desenhar e comparar hipóteses, **não converte Perícias experimentais em regras DEFINIDAS**.

## Próxima etapa

Criar as primeiras árvores abertas de Perícias com caminhos especializados e cruzamentos entre profissões, requisitos verificáveis, custos apropriados e efeitos distintos de dano, defesa, controle, mobilidade e suporte. Depois implementar combate conjunto, inventário, magia e playtest de várias rodadas.
