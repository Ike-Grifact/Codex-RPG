---
title: "Codex RPG — SRD de Continuidade v0.88: DE base humana substitutiva"
version: "0.88"
system: "Codex RPG"
updated: "2026-11-22"
status: "DEFINIDO / EQUILÍBRIO EXPERIMENTAL"
supersedes: "Fórmula anterior da DE natural para personagens e humanoides; demais decisões de v0.87 e do SRD Playtest Nível 1 v1.0 permanecem"
---

# Codex RPG — SRD de Continuidade v0.88

## Decisão autoral — 22/11/2026: remover a DE natural antiga

**DEFINIDO:** a antiga **DE natural** de personagens e humanoides é **substituída por completo**. Não conservar nem somar os termos anteriores de Agilidade, Vigor pela metade e Atletismo. Fica **somente o novo cálculo** aprovado pelo autor:

**DE base = mínimo(9; 1 + Vigor + ⌊Destreza / 2⌋).**

- **1 DE base** para cada personagem humanoide, mesmo com todos os Graus em 0.
- **Vigor inteiro** contribui na proporção de 1 ponto de DE para cada Grau.
- **Destreza** contribui com metade do Grau arredondada para baixo; **Agilidade e Atletismo não integram a nova DE base**.
- Aplicar o teto **9** ao cálculo da DE base. Depois, somar o modificador da única armadura válida equipada, Maestria em Escudos e outros efeitos defensivos já definidos, respeitando **DE final mínima 0 e máxima 12**. A base +1 entra **uma vez** apenas.
- Aplica-se a **personagens/Aprendizes**, **NPCs humanoides** e **humanoides monstros** que seguem o modelo de fontes humanoides.
- **Monstros extraordinários não humanoides** continuam usando seu cálculo específico **mínimo(9; Agilidade + ⌊Destreza/2⌋)**. Não recebem o ponto básico nem Vigor integral nesta revisão.
- **Sem alterações** nos dados simbólicos, limites de retenção, XP, fontes, Vida, Pavor, Coragem, dano, equipamentos, Integridade, custos de ativação ou DE de tarefas sem ficha defensiva.

### Exemplos para o playtest

Humanoide com Vigor 3, Destreza 2, Agilidade 1 e Atletismo 3: **DE base = 1 + 3 + 1 = 5**. Agilidade e Atletismo não acrescentam pontos. Usando armadura Leve (+1): **DE final 6**. Usando armadura Pesada (−1): **DE final 4**, antes de outros modificadores definidos.

Seis fichas do confronto proposto, já com armaduras e Maestria em Escudos indicadas: **Samurai DE 4**, **Guerreiro DE 3**, **Mago DE 4**, **Berserker DE 5**, **Tanque com armadura Pesada DE 4**, **Atirador DE 5**. Valores próprios dessas builds, não bônus universais.

## Estado, histórico e validação

**DEFINIDO:** substituição integral da DE natural para personagens humanoides, fórmula **1 + Vigor + ⌊Destreza/2⌋**, teto 9 para o cálculo base e 0–12 para resultado final, modificadores de armadura e Perícias preservados.

**EXPERIMENTAL:** equilíbrio das chances de acerto limpo/com Pavor, impacto em opções de combate defensivas/ofensivas, papel de Agilidade e Atletismo após a mudança, durabilidade da armadura e gasto de Coragem nos Marcos e no nível 1. O playtest 3 × 3 servirá para mensurar esses efeitos; nenhuma outra mecânica foi alterada como compensação.

**IMPLEMENTAÇÃO:** atualizar criador/ficha, Criar Conflito e Foundry para recalcular a defesa sem mudar XP, fontes nem histórico de rolagens. Regressões de Vigor ímpar, Destreza ímpar, personagens com Graus zero, teto, armaduras, NPCs humanoides e não humanoides e interface do simulador.

**Histórico:** esta decisão de 22/11/2026 revoga **somente a fórmula anterior de DE humana**. A v0.87 (Manejo Perfeito), o SRD Playtest Nível 1 v1.0 e demais decisões permanecem vigentes nos outros tópicos.
