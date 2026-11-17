# Modelo de Perícias para um futuro Compendium do Foundry

## Fonte e vínculo com a ficha

O catálogo atual continua dispondo sobre aquisições e requisitos. A ficha registra os IDs em `Actor.system.skills`. Um futuro Item `skill` pode representar a definição consultável de uma Perícia no Compendium. O vínculo usa o ID estável da regra, independente do nome, do UUID de um pacote ou da edição do texto. A ficha continua sendo a autoridade sobre quais Perícias estão adquiridas e sobre o XP investido. A presença do Item no Compendium por si só não concede a Perícia.

## Campos propostos para Item skill

| Grupo | Dados estruturados |
| --- | --- |
| Identificação | ID estável, nome localizado, nomes anteriores e aliases de importação |
| Classificação | Família ou constelação, categoria, classes relacionadas por ID quando homologadas |
| Texto e referência | Descrição normativa, versão do SRD, seção, link para a decisão vigente, versão do registro |
| Compra | Custo de XP, custo histórico quando aplicável e pré-requisitos em lista OU de cláusulas cumulativas E |
| Graus | Graus aplicáveis, requisitos, custos e efeitos por grau, quando aprovados |
| Efeitos | Lista com ID por efeito, tipo passivo ou ativo, custo e recurso, gatilho, condições, alcance e duração |
| Rolagem e limites | Fontes permitidas, alterações distintas para pilha, retenção e símbolos, máximo por ação ou rodada, impedimentos |
| Estado normativo | Definido, experimental, pendente ou legado por registro e, quando necessário, por efeito |
| Automação | Informativo, validação automática, aplicação automática aprovada ou confirmação do Narrador. Um efeito parcialmente definido pode combinar validação de aquisição com aplicação manual |
| Exibição | Ícone, descrição acessível, família visual e metadados para o mapa |

Um requisito de fonte armazena grupo, ID e grau mínimo. Um requisito de Perícia usa o ID estável. Exemplo de Olhos de Águia. As duas alternativas exigem Destreza G3 e Disciplina G3. Uma exige Armas de Longo Alcance e a outra Armas de Fogo. O efeito passivo de alcance só se aplica a armas elegíveis, enquanto a medição e a adjudicação no mapa têm estado próprio de automação.

## Implantação gradual

1. Validar IDs únicos, referências a fontes e Perícias, ciclos, custos e estados. Usar os mesmos requisitos na compra direta e no planejador do pacote.
2. Adotar o tipo de Item quando houver definições suficientes homologadas. Começar com leitura e referências no mapa e no inspetor. Exportar definições para o pacote sem gravar conteúdo duplicado nos Actors.
3. Implementar efeitos individualmente, com testes e confirmação do Narrador onde pertinente. Efeitos pendentes ficam como descrições com a referência normativa.
4. Avaliar migração só se o armazenamento das aquisições precisar mudar. Conservar aliases, valores históricos e IDs desconhecidos, e testar leitura de fichas anteriores antes de propor uma troca.

A versão 0.2.1.14 entrega esta proposta. O tipo `skill`, a população do Compendium e a migração de Actors ficam para a próxima etapa.
