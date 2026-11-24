# Codex RPG — SRD de Continuidade v0.129

**Data:** 24/11/2026

Complementa [v0.128](srd-continuidade-v0.128.md).

## DEFINIDO — Identidade dos símbolos

Por aprovação autoral, o símbolo anteriormente denominado Pavor (P) passa a chamar-se **Temor (T)**. Preserva-se Thurisaz (ᚦ), a cor oficial `#542176`, a distribuição de faces e todos os efeitos mecânicos vigentes. O símbolo representa risco e consequências que escapam ao controle da vontade; não exige que o personagem sinta medo. A condição **Apavorado**, associada ao esgotamento da Coragem, mantém seu nome e sua regra vigente de aumento da geração do símbolo, agora denominado Temor. Não se altera a quantidade desse aumento.

### Identidade filosófica

Interpretação autoral dos símbolos do Codex, não tradução histórica literal das runas:

- Êxito (E), Sowilo (ᛋ): realização da vontade.
- Antecipar (A), Ansuz (ᚨ): compreensão das possibilidades.
- Temor (T), Thurisaz (ᚦ): risco diante do desconhecido.
- Coragem: capacidade de agir apesar do Temor.

## DEFINIDO — Nomes dos seis resultados

Os nomes Acerto Pavoroso e Falha Pavorosa da v0.128 são substituídos por **Acerto Arriscado** e **Falha Arriscada**, respectivamente. Arriscado foi escolhido pelo autor por sua clareza em português brasileiro, em lugar de Temerário. As categorias Limpo e Misto permanecem.

| Resultado | DE alcançada | Condição final |
|---|---|---|
| Acerto Limpo | Sim | T = 0 |
| Acerto Misto | Sim | 0 < T ≤ E |
| Acerto Arriscado | Sim | T > E |
| Falha Limpa | Não | T = 0 |
| Falha Mista | Não | 0 < T ≤ E |
| Falha Arriscada | Não | T > E |

A DE continua sendo comparada com E + T residual após gastos pertinentes de Antecipar. Empates com T positivo são mistos. Não se criam novos custos, penalidades, benefícios ou condições. Transferência, reservas, risco, intervenções, protagonismo, dano, crítico e demais mecânicas conservam suas regras. A distribuição de Temor em área/múltiplos alvos mantém as pendências anteriores.

## PENDENTE — Migração de nomenclatura na implementação

A decisão autoral está consolidada neste SRD. A migração abrangente de interface e documentação ainda não foi executada. Revisar Livro do Jogador, Livro/Guia do Narrador, páginas de mecânicas e Perícias, ficha, criador de conflitos, simulador, Foundry, testes e documentação ativa em conjunto. Alterar os nomes e a notação exibida de P para T sem renomear cegamente chaves internas como `p`, `pavor` ou identificadores de arquivos, preservando compatibilidade de fichas, links e dados históricos. Manter Apavorado e ocorrências de pavor que descrevam a condição ou emoção. Preservar versões históricas do SRD. Validar os seis resultados, as faces, as reservas, a transferência, o esgotamento da Coragem e a importação de fichas antes de publicar a migração.
