---
title: "Codex RPG — SRD de Continuidade v0.89: defesa combinada e 15 XP no playtest"
version: "0.89"
system: "Codex RPG"
date: "2026-11-22"
status: "DEFINIDO; balanceamento EXPERIMENTAL"
supersedes: "Correção explícita da fórmula de DE humanoide da v0.88; 15 XP do SRD Playtest Nível 1 v1.0 e da decisão de 21/11/2026 prevalecem sobre orçamentos antigos"
---

# Codex RPG — Continuidade v0.89

## 1. DE defensiva humana e humanoide — DEFINIDO (22/11/2026)

**A v0.88 interpretou incorretamente a retirada da 'DE natural':** remover a fórmula anterior significava **não somar dois cálculos**, e não retirar Agilidade/Atletismo ou fazer Vigor valer integralmente. A decisão autoral corrigida é:

```text
DE base = min(9, Agilidade + piso((Vigor + Destreza) / 2) + piso(Atletismo / 3))
DE final = min(12, max(0, DE base + modificador da armadura + efeitos defensivos válidos))
```

- **DEFINIDO:** Agilidade vale integralmente; **Vigor e Destreza somam antes da divisão inteira por 2**; Atletismo acrescenta um ponto para cada três graus completos.
- **DEFINIDO:** não existe bônus +1 fixo nem uma segunda 'DE natural' a acrescentar. Sem investimento nas quatro fontes, a DE base é **0**, antes do equipamento.
- **DEFINIDO:** teto de **9** para DE base e **12** para DE final; piso de DE final **0**.
- **DEFINIDO:** a única armadura equipada modifica a DE em todas as defesas: Muito Leve **+2**, Leve **+1**, Média **0**, Pesada **−1**, Muito Pesada **−2**, respeitando condições de uso e sem empilhar duas peças.
- **DEFINIDO:** **Roupas Simples são armadura Muito Leve** (+2 DE). No catálogo atual de G1 têm **0 Integridade**; a ausência de Integridade não as torna proteção de DE neutra.
- **DEFINIDO:** com escudo físico equipado, **Maestria em Escudos** concede **+1 DE** e +1 Integridade material para o escudo, nas condições e custos já aprovados, sem duplicar o benefício.
- **DEFINIDO:** monstros extraordinários **não humanoides** não mudam: `min(9, Agilidade + piso(Destreza/2))`. Não recebem a metade combinada humana nem +1 fixo.

**Exemplo de arredondamento:** VIG 1 e DES 1 concedem **1 DE**, não 0, pois `piso((1+1)/2)=1`. Com AGI 2, VIG 3, DES 1 e Atletismo 3, a base é **5**. Roupas Simples elevam essa DE para **7**.

### Regras substituídas

A fórmula `1 + Vigor + piso(Destreza/2)` da v0.88 fica **REVOGADA** para humanoides. A fórmula da v0.66 `Agilidade + piso(Destreza/2) + piso(Vigor/2) + piso(Atletismo/3)` é histórica e não deve ser acumulada nem usada em separado. A v0.88 permanece preservada como histórico da interpretação corrigida.

## 2. XP inicial — DEFINIDO PARA ESTE CICLO DE PLAYTEST

**15 XP compartilhados no nível 1**, conforme decisão de 21/11/2026, publicada no SRD Playtest Nível 1 v1.0. Comprar pelo menos **um Atributo G1** (1 XP) e **um Conhecimento OU Prática G1** (2 XP); os **12 XP restantes** podem ser distribuídos livremente, sujeitos a custos e pré-requisitos. **Não existem reservas exclusivas por categoria.** Não se alteram os custos da tabela dos Graus, dados simbólicos, equipamentos ou evolução após a criação. Orçamentos de 18, 19 e 20 XP nos protótipos antigos não autorizam novos personagens acima de 15 XP nesta etapa.

O equilíbrio do orçamento e da DE segue **EXPERIMENTAL**, embora os números do ciclo de playtest estejam **DEFINIDOS**.

## 3. Referência reproduzível: seis fichas de nível 1

**PROPOSTO — builds de teste, cada uma com 15 XP, não profissões obrigatórias:**

| Personagem | Atributos comprados | Conhecimentos/Práticas | Perícias | Armadura | DE final |
|---|---|---|---|---|---:|
| Samurai | FOR2, DES2, AGI1, VIG1 (8 XP) | Disciplina1, Atletismo1 (4) | Armas Médias, Maestria em Espadas (3) | Leve (+1) | **3** |
| Guerreiro | FOR2, AGI1 (4) | Disciplina2 (8) | Armas Médias, Golpe Fulminante (3) | Leve (+1) | **2** |
| Mago | INT2, DES1, AGI1, VIG1 (6) | Disciplina1, Artesão1, Proteção1 (6) | Criar Foco, Fogo, Terra (3) | Roupas Simples/Muito Leve (+2) | **4** |
| Berserker | FOR2, AGI1, VIG1 (5) | Disciplina2 (8) | Armas Pesadas (2) | Leve (+1) | **2** |
| Tanque | FOR1, DES2, VIG2, AGI1 (8) | Disciplina1, Proteção1 (4) | Armas Leves, Maestria em Escudos (3) | Média (0) e escudo habilitado (+1) | **4** |
| Atirador | DES2, AGI2, FOR1, VIG1, INT1 (9) | Disciplina1, Furtividade1 (4) | Armas de Longo Alcance (2) | Roupas Simples/Muito Leve (+2) | **5** |

O Guerreiro e o Berserker foram **redistribuídos** em relação à primeira proposta, que excedia 15 XP; as demais quatro fichas mantiveram os investimentos originais. A armadura e os equipamentos do cenário são concedidos **para o teste**, não gratuitamente na criação geral.

## 4. Probabilidades de acerto — EXPERIMENTAL

Enumeração **exata**, sem Monte Carlo, das faces atuais do SRD (d6, d10 e d12), por teste independente, sem cobertura, distância, bônus situacionais, Elevar fonte ou técnicas que modifiquem símbolos antes da DE. A seleção tática dá prioridade a **atingir a DE** e, entre as opções vencedoras, **não deixar Pavor residual**, aplicando 1A para cancelar 1P e 2A para criar 1E, além do crítico quando disponível. Dados descartados não geram símbolos. Com 1 Coragem podem ser mantidos **até 3** dados em vez de 2; isso não adiciona dado novo à pilha.

**Pilhas do ensaio:** Samurai Disciplina1 (1d10) + FOR2 (2d6) + Espada Longa G1 (1d10); Guerreiro Disciplina2 (2d10) + FOR2 (2d6) + Martelo G1 (1d10); Mago Disciplina1 (1d10) + INT2 (2d6), sem dado adicional de foco; Berserker Disciplina2 (2d10) + FOR2 (2d6) + Machado Pesado G1 (1d12); Tanque Disciplina1 (1d10) + FOR1 (1d6) + Espada Curta G1 (1d6); Atirador Disciplina1 (1d10) + DES2 (2d6) + Arco Curto G1 (1d6). As referências de dado e peso dos equipamentos seguem as **hipóteses deste cenário**; não aprovam fichas definitivas de katana ou novos itens.

### Acerto total (%), 2 mantidos

| Atacante | Alvo 1 | Alvo 2 | Alvo 3 |
|---|---:|---:|---:|
| Samurai | Berserker **96,9** | Tanque **23,1** | Atirador **8,0** |
| Guerreiro | Berserker **99,2** | Tanque **40,6** | Atirador **19,4** |
| Mago | Berserker **83,3** | Tanque **6,1** | Atirador **0,0** |
| Berserker | Samurai **80,9** | Guerreiro **99,1** | Mago **47,8** |
| Tanque | Samurai **34,2** | Guerreiro **83,3** | Mago **6,1** |
| Atirador | Samurai **41,0** | Guerreiro **93,0** | Mago **8,4** |

### Acerto total (%), até 3 mantidos, 1 Coragem

| Atacante | Alvo 1 | Alvo 2 | Alvo 3 |
|---|---:|---:|---:|
| Samurai | Berserker **96,9** | Tanque **52,1** | Atirador **38,2** |
| Guerreiro | Berserker **99,2** | Tanque **73,7** | Atirador **60,4** |
| Mago | Berserker **83,3** | Tanque **20,3** | Atirador **4,4** |
| Berserker | Samurai **95,3** | Guerreiro **99,1** | Mago **77,9** |
| Tanque | Samurai **51,7** | Guerreiro **83,3** | Mago **20,3** |
| Atirador | Samurai **73,5** | Guerreiro **93,0** | Mago **34,1** |

As afinidades de peso foram aplicadas quando pertinentes, incluindo remoção de Desvantagem natural pelas especializações, e a conjuração foi modelada em condição neutra por falta de peso situacional explicitamente atribuído. **O acerto do Mago pode produzir apenas controle** quando usa magia G1; porcentagem de acerto não equivale automaticamente a dano. Essas probabilidades não são simulações de combate completo: não incorporam perdas de Vida/Integridade, Pavor e Coragem ao longo de várias rodadas ou recursos que se esgotam.

## 5. Validação e pendências

**IMPLEMENTAÇÃO EM REVISÃO:** ficha de jogador, Criar Conflito e motor Foundry devem usar a mesma DE e os 15 XP; documentação viva aponta esta v0.89. Instalações locais Foundry requerem atualização separada.

**EXPERIMENTAL:** balanceamento observado — um defensor de DE 5 pode receber raros acertos limpos sem gastar Coragem, enquanto DE 2 é atingida frequentemente. Antes de alterar a fórmula, testar efeitos condicionados, Pressão/Pavor, Coragem, Integridade, proteção por armas e desempenho de builds híbridas em confronto de múltiplas rodadas.

**PENDENTE:** completar catálogos e automações de Perícias/itens ainda divergentes entre Foundry e site; não inventar custos nem benefícios de aquisição. Registrar explicitamente qualquer ajuste futuro em novo SRD.
