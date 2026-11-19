# Codex RPG — Revisão de Armas, Escudos, Focos, Munições e Kits · Playtest Nível 1

**Data da decisão:** 18/11/2026. **Repositório:** `Ike-Grifact/Codex-RPG`. **Estado:** parte **DEFINIDO** pelo autor, parte **PENDENTE** e parte **PROPOSTO** para análise. **Não alterar SRDs históricos** e **não mesclar à main** antes de validação. Esta revisão pode ser incorporada ao SRD Playtest Nível 1 depois da aprovação do ciclo.

## 1. Armas G1 atualizadas [DEFINIDO]

| Item do catálogo | Peso / dado | Características | Preço VT | Observações |
|---|---|---|---:|---|
| Cajado Médio | Médio / d10 | Contundente, Enganchar | **6** | Não é foco automaticamente |
| Bastão Médio | Médio / d10 | Contundente | **4** | — |
| Cajado Pesado | Pesado / d12 | Contundente, Enganchar | **6** | — |
| Bastão Pesado | Pesado / d12 | Contundente | **7** | — |
| Martelo de Guerra | **Médio / d10** | **Perfurante, Contundente** | **6** | Substitui Pesado/d12/7 VT |
| Lança de Arremesso (**Azagaia**) | Médio / d10 | **Cravar, Perfurante** | **6** | Alcance cadastrado 8 m; dois nomes, uma arma |
| Luvas | Leve / d6 | Contundente, Muito Leve | PENDENTE | Já existia no site; não duplicar |

**DEFINIDO:** não revisar agora armas de fogo e equipamentos G2 ou superior.

### Novos modelos [características DEFINIDAS, outros campos PENDENTES]

| Arma | Características | Peso, dado e preço |
|---|---|---|
| **Katana** | Cortante, Perfurante | **PENDENTES**: categoria/peso, dado, alcance, carga e VT |
| **Naginata** | Longa, Cortante | **PENDENTES**: categoria/peso, dado, carga e VT. A regra geral de Longa implica alcance físico de **2 m** |

Ambas estão listadas para revisão, **não habilitadas como armas compráveis ou rolagens funcionais** antes de preencher os campos pendentes.

## 2. Escudos e Integridade [DEFINIDO]

| Item G1 | Integridade total | Preço VT existente |
|---|---:|---:|
| Escudo Leve | **2** | 3 |
| Escudo Médio | **3** | 5 |
| Escudo Pesado | **4** | 8 |

**DEFINIDO — efeito de Cravar no escudo:** depois de acerto válido com a característica **Cravar ativada** e habilitação pertinente, **cada Êxito mantido remove 1 ponto da Integridade do escudo alvo**, até o mínimo zero. Ex.: escudo Médio com 3 pontos atingido por Cravar com 2 Êxitos mantidos fica com 1 ponto. **Não descontar Pavor como Integridade pela regra de Cravar.** O que acontece mecanicamente quando a Integridade chega a 0 **não foi definido nesta revisão**.

Não confundir a **perda de Integridade pelo ataque** com o **efeito de arma cravada**: a penalidade previamente aprovada de **−1E por arma cravada em Levantar Escudo**, cumulativa, permanece. No inventário antigo, o controle de múltiplas armas cravadas ainda é parcial e pede aperfeiçoamento. Não reintroduzir −2E fixo.

**Armaduras G1** (inalteradas e confirmadas): Muito Leve **3**, Leve **7**, Média **12**, Pesada **17** de Integridade. A ficha antiga ainda possuía textos e edição que zeravam incorretamente a Muito Leve: corrigidos nesta branch; **fichas antigas previamente zeradas não recebem cura ou correção silenciosa**.

## 3. Item de Foco e preços em B [DEFINIDO fórmula; preço numérico PENDENTE]

**B** = preço de **uma Pedra Elemental comum** em VT (valor específico ainda definido por mesa, não oficialmente).

| Item | Características | Preço conforme decisão |
|---|---|---|
| Varinha G1 | Muito Leve, Elemental | **B VT** |
| Foco de Magia Leve G1 | Foco básico | **B VT** |
| Cetro Leve G1 | Contundente, Elemental | **B + preço da arma contundente equivalente** |
| Cetro Médio G1 | Contundente, Elemental | **B + preço da arma contundente equivalente** |
| Cetro Pesado G1 | Contundente, Elemental | **B + preço da arma contundente equivalente** |

**PENDENTE:** qual arma contundente é a referência exata para cada cetro, quando existir opção de Cajado ou Bastão. Não presumir B=1 VT e não atribuir preço zero. As regras de fabricar, possuir e habilitar Foco permanecem próprias; **foco não é venda direta no criador** enquanto faltar um procedimento compatível. A simples compra ou posse não concede Perícia Elemental.

## 4. Munições e recipientes [DEFINIDO]

| Item | Quantidade ou capacidade | VT | Categoria |
|---|---:|---:|---|
| Flechas | **20 por lote** | **5** | Leve |
| Virotes | **20 por lote** | **5** | Leve |
| Dardos de Zarabatana | **20 por lote** | **2** | Leve |
| Aljava | capacidade de **20 flechas** | **5** | Leve |
| Estojo de Virotes | capacidade de **20 virotes** | **5** | Leve |
| Bandoleira | capacidade a definir | **5** | Leve (classificação de lote/recipiente adotada do grupo) |
| Munição de Revólver Leve | **1 unidade** | **1** | Leve |
| Munição de Revólver Média | **1 unidade** | **1** | Leve (munição transportada) |
| Munição de Revólver Pesada | **1 unidade** | **2** | Leve (munição transportada) |

**Compra combinada:** **20 flechas + aljava = 10 VT**; **20 virotes + estojo = 10 VT**, no catálogo. O campo `packSize` armazena o tamanho do lote, e `ammoRemaining` a quantidade que resta **para controle manual**, sem penalidade de tiro ou recarga presumida. O item de munição fica em **uma entrada por lote comprado**, em vez de multiplicar a carga por 20. A capacidade dos recipientes é informativa; **a automação de equipar, recarregar, recuperar projéteis e vincular munição ao arma é PENDENTE**.

A referência de carga `0.125` equivale à categoria Leve já utilizada pela ficha; **não está em kg**. O impacto da bandoleira na capacidade de saque ainda é PENDENTE.

## 5. Instrumentos musicais [DEFINIDO preço, PENDENTE tipo/carga]

- **Instrumento Musical (tipo à escolha): 10 VT por instrumento.**
- Pode ser alaúde, flauta, lira, tambor, viola etc. Estes nomes são **exemplos narrativos**, não novos custos nem efeitos de Apresentação.
- **PENDENTE:** carga específica de cada instrumento, durabilidade, tipo de item e eventuais efeitos; enquanto isso fica listado, mas **a compra automática na ficha é bloqueada por falta de categoria física**.

## 6. Kits e equipamentos de aventureiro [PROPOSTO catálogo; preços PENDENTES]

**Kits listados:** Alquimia, Couraria, Escrita, Medicina, Engenharia, Ferraria, Carpintaria, Costura, Herbalismo, Cartografia, Escalada, Arrombamento, Caça, Acampamento e Cozinha.

**Outros itens listados:** Mochila, Bolsa de Cintura, Corda, Gancho de Escalada, Tocha, Lampião, Óleo para Lampião, Pederneira, Cantil, Ração de Viagem, Saco de Dormir, Tenda, Cobertor, Frasco Vazio, Bolsa de Componentes, Papel/Pergaminho e Tinta/Pena.

**PROPOSTO:** a presença de um kit oferece ferramentas narrativamente pertinentes, **sem bônus de rolagem automático**. **PENDENTE:** custo em VT, categoria de carga e quantidade/duração de cada item. O catálogo mostra os nomes como **não compráveis** até autorização de preço/categoria; não atribuir valor para preencher lacuna.

## 7. Integração e validação

- Catálogo do **site e Foundry sincronizados em 87 itens** pela branch de revisão; 43 itens anteriores + 44 novos.
- Correções do criador: categoria de loja para Munições, Aljavas/Estojos, Instrumentos, Kits e Aventureiro; armazenamento manual da quantidade de munição; confirmação explícita de dano de Cravar no escudo.
- Ferramentas, instrumentos e kits sem categoria física/VT não podem ser comprados com valores fictícios.
- **PENDENTE DE VALIDAR:** compatibilidade visual e schema do Foundry para novos `kind` não combatentes; consumo automático de munição, capacidade efetiva das bolsas, múltiplas armas presas e resolução ao zerar Integridade do escudo.
- **Não alterar XP, preços de pedras raras (3B), Maestrias ou níveis G2+** nesta revisão.

## 8. Decisões objetivas para concluir esta rodada

| Tema | Informação faltante |
|---|---|
| Katana e Naginata | Categoria física Leve/Média/Pesada, dado e VT |
| Luvas e Bastão/Cajado Leves | Preços VT ainda não definidos |
| Cetros | Referência exata de arma contundente em cada porte (Bastão ou Cajado) |
| Instrumentos musicais | Peso/carga: categoria Leve, Média ou classificação por modelo |
| Kits e exploração | VT e carga por item; confirmar quais dos modelos propostos entram na lista final |
| Cravar no escudo | Efeito operacional quando Integridade atinge 0 |
