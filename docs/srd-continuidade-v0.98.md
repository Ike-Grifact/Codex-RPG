# Codex RPG — SRD de Continuidade v0.98

**Data:** 23/11/2026  
**Estado:** **DEFINIDO** — decisões explícitas do autor: compra das Maestrias por família de armas, custo nominal universal de 1 XP e requisito adicional de Artista Marcial.  
**Precedência:** adendo pontual ao SRD v0.97 em preparação (PR #116), sobrepondo descrições históricas de 20–21/11/2026 e qualquer indicação de custo ou requisitos de compra pendentes **apenas nos pontos especificados**. O SRD v0.96 publicado em `main`, o v0.97 da PR e regras não citadas permanecem vigentes.

## 1. Requisitos de compra das Maestrias por família [DEFINIDO]

**Todas as Maestrias por família de armas têm custo nominal de aquisição de 1 XP.** A concessão racial gratuita da **Maestria em Armas de Fogo aos Humanos (0 XP gastos)** é preservada como exceção específica, sem oferecer essa Maestria a outras origens.

| Maestria | Requisitos para comprar | XP nominal |
|---|---|---:|
| Maestria em Adagas e Facas | Agilidade 2 + Destreza 2 | 1 |
| Maestria em Espadas | Força 2 + Destreza 2 | 1 |
| Maestria em Machados | Força 2 + Destreza 1 | 1 |
| Maestria em Maças e Clavas | Força 3 + Destreza 1 + Vigor 1 | 1 |
| Maestria em Martelos | Força 3 + Destreza 1 + Vigor 1 | 1 |
| Maestria em Lanças e Hastes | Força 2 + Agilidade 1 + Destreza 1 | 1 |
| Maestria em Cajados e Bastões | Destreza 2 | 1 |
| Maestria em Arcos | PENDENTE: atributos/graus de compra | 1 |
| Maestria em Bestas | PENDENTE: atributos/graus de compra | 1 |
| Maestria em Armas Arremessadas | PENDENTE: atributos/graus de compra | 1 |
| Maestria em Armas de Punho | PENDENTE: atributos/graus de compra | 1 |
| Maestria em Armas de Longo Alcance Diversas | PENDENTE: atributos/graus de compra | 1 |
| Maestria em Armas de Fogo | Exclusiva da origem Humano; concessão racial gratuita | 1 nominal / 0 gasto na origem |

A **Maestria em Martelos e a Maestria em Maças e Clavas são compras distintas**, embora compartilhem os mesmos requisitos de Força 3, Destreza 1 e Vigor 1. Não adquirir uma ao comprar a outra. Adagas, Machados e Cajados adotam os requisitos novos acima; Espadas e Lanças/Hastes mantêm seus requisitos já aprovados.

**PENDENTE:** os atributos/graus para comprar Arcos, Bestas, Armas Arremessadas, Punhos e Longo Alcance Diversas não foram informados. O custo de 1 XP está DEFINIDO, mas **a compra permanece bloqueada no criador** até decisão explícita, sem atribuir requisito zero ou inventar uma exigência. Não liberar automaticamente por ausência de validação.

## 2. Compra ≠ ativação [DEFINIDO]

A Perícia em Armas correspondente ao **peso da arma** não é necessária **para comprar** uma Maestria cujo requisito de aquisição já tenha sido definido; é necessária **para ativar seu efeito**. Ex.: Maestria em Martelos + Perícia em Armas Leves habilita martelo Leve; para martelo Pesado, também é necessária Perícia em Armas Pesadas. As respectivas Perícias mantêm seus graus obrigatórios de Disciplina/Força.

| Peso da arma | Habilitação para Maestrias corpo a corpo |
|---|---|
| Leve | Perícia em Armas Leves |
| Médio | Perícia em Armas Médias |
| Pesado | Perícia em Armas Pesadas |

Para as famílias de **Arcos, Bestas e Longo Alcance Diversas**, aplica-se Perícia em Armas de Longo Alcance. Para **Armas Arremessadas**, habilitação de arremesso e a Perícia da categoria da arma. Para **Armas de Punho**, Pugilismo. Para **Armas de Fogo**, Perícia em Armas de Fogo (a origem Humano concede apenas a Maestria). Essas habilitações não substituem a compra quando necessária nem concedem Perícias adicionais.

### Benefício comum a todas as famílias [DEFINIDO]

- **Acerto comum:** uma característica existente da arma é ativada **gratuitamente**.
- **Crítico com acerto:** até **duas características diferentes** da arma são ativadas gratuitamente.
- **Crítico com custo adicional:** até **uma terceira característica diferente**, existente e elegível, por **1 Coragem**, caso a arma tenha pelo menos três características distintas.
- **Limites:** acerto da DE e gatilhos próprios de cada característica; nunca repetir o mesmo efeito para preencher as vagas. A Maestria não concede crítico automático, Êxitos adicionais, dados ou dano básico extra, nem substitui requisito das Perícias de Armas.

A automação deve manter a separação entre compra da Maestria, requisitos de Atributos, habilitação da arma, acerto/crítico, seleção de propriedades e custo de Coragem. Fichas antigas preservam compras e XP; uma Maestria já adquirida não habilita efeitos quando suas condições presentes não forem satisfeitas.

## 3. Artista Marcial [DEFINIDO]

**Custo permanece 1 XP.** Requisitos completos passam a ser:
**Disciplina 2 + Destreza 2 + Atletismo 1 + Pugilismo adquirido.**

O novo requisito de **Atletismo 1** vale para compra direta e por pacote / Codex Genético. Não altera os efeitos, custo de manobras, crítico de Pugilismo ou outras Perícias dependentes. Fichas anteriores mantêm suas compras; sem Atletismo 1, a condição de aquisição está temporariamente não satisfeita.

## 4. Atualização dos textos [DEFINIDO — documentação]

Os verbetes das Maestrias passam a seguir o modelo da **Maestria em Martelos**: apresentação concisa de **Custo**, **Requisitos de compra**, **Habilitação de ativação**, **Acerto comum**, **Crítico**, **Aquisição**, **Efeito definido**, **Perícia correspondente ao peso/modalidade** e **Limites**. Remover cabeçalhos e blocos repetidos como “Compra [DEFINIDO — 21/11/2026]”, “Compra ainda pendente” quando houver requisitos aprovados, e procedimentos desatualizados. Manter históricos nos documentos SRD antigos, sem removê-los retroativamente.

## 5. Implementação, testes e escopo

**Validar:** 1 XP por Maestria; Atributos corretos nos sete ramos definidos; compra possível sem Perícia em Armas correspondente; ativação bloqueada sem ela; Maestria Maças distinta da de Martelos; crítico e uma terceira propriedade distinta por 1 Coragem; família correta da arma; Artista Marcial exige Atletismo 1; concessão racial Humano mantém custo efetivo zero; compras pendentes bloqueadas sem requisitos inventados.

**Não alterar:** custo das Perícias em Armas, dados, Maestria em Manejo Duplo, Perícias Avançadas, propriedades e bônus de equipamento, raça, XP inicial e regras de combate não citadas.

**PENDENTE para decisão futura:** requisitos de aquisição das cinco famílias listadas como pendentes, já com preço nominal aprovado.

**Esta v0.98 é um adendo específico.** Tudo que não foi modificado permanece regido pelos SRDs e decisões vigentes.
