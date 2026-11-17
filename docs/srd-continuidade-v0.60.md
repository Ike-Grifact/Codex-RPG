---
title: "Codex RPG — SRD de Continuidade v0.60: múltiplas fichas de Aprendizes"
version: "0.60"
system: "Codex RPG"
updated: "2026-11-17"
status: "definido — ferramenta de playtest; regras mecânicas inalteradas"
---

# Codex RPG — SRD de Continuidade v0.60

## 0-AW. Gerenciador de fichas de jogadores — 17/11/2026

**DEFINIDO — solicitação expressa do autor:** o Criador oficial deve permitir **manter mais de uma ficha de jogador no mesmo navegador**, especialmente para comparar construções das quatro origens/raças do [SRD v0.59](srd-continuidade-v0.59.md).

### Fluxo de usuário [DEFINIDO]

- **Minhas fichas de jogadores:** selecionar uma ficha existente por **nome, raça e nível**. Ao alternar, restaurar a ficha daquele personagem e sua etapa do assistente de criação.
- **Nova ficha:** criar outro Aprendiz **sem substituir** o personagem anterior. Nenhuma compra, raça, recurso ou atributo de uma ficha deve ser copiado automaticamente.
- **Duplicar:** criar uma **cópia independente** da ficha ativa para comparações de build. Rolagens ainda pendentes não devem ser duplicadas.
- **Excluir:** excluir **somente a ficha selecionada**, mediante confirmação explícita. Impedir a exclusão quando houver apenas uma ficha, usando Reiniciar ficha para redefini-la.
- **Exportar ficha:** manter o JSON compatível da ficha selecionada. **Importar JSON** e **Importar ficha antiga** adicionam um personagem novo, sem substituir outro jogador. O exemplo demonstrativo também ocupa uma ficha própria.
- Todas as fichas usam **a mesma interface e lógica** de fontes, XP, custos raciais, Perícias, equipamentos, Vida, Coragem, PP, inventário e rolador. Recursos e progresso são **independentes por personagem**.

### Persistência, migração e privacidade [DEFINIDO]

Cada personagem é armazenado em **chave local própria**, com índice de fichas e a identificação da ficha ativa. A ficha antiga única, já salva no navegador antes desta atualização, deve ser incorporada automaticamente à lista como primeira ficha **sem apagar o arquivo local original**. Fichas JSON históricas mantêm compatibilidade de importação.

O armazenamento é **local neste navegador/dispositivo** e não implica sincronização com nuvem. Limites do navegador podem impedir salvar muitos retratos ou fichas; a interface deve alertar para **exportar JSON** quando não puder persistir os dados. Em outro dispositivo, usar a exportação/importação para transportar personagens.

O modo separado de **NPC humanoide** (consulta `?npc=1`) continua usando seu armazenamento independente e **não entra** na lista de fichas de jogador. Uma ficha de jogador não deve ser alterada ao abrir um NPC.

### Sem mudanças mecânicas

**EXPERIMENTAL preservado:** 18 XP iniciais compartilhados no nível 1, conforme [SRD v0.58](srd-continuidade-v0.58.md); 260 XP totais de referência no nível 20. Mantidos custos acumulados por grau da v0.56, benefícios raciais da v0.55, Origem = Raça da v0.59 e todas as restrições atuais de compra e testes de dados. Não foi criado nenhum custo para aumentar o número de fichas.

**PENDENTE para playtest:** comparar a legibilidade da troca de personagens no desktop e celular e testar a capacidade de armazenamento com muitos retratos. Não alterar regras por causa do gerenciador de fichas.
