# Codex RPG — SRD de Continuidade v0.114

**Data:** 24/11/2026

**Estado:** DEFINIDO — correção autoral do dano de Golpe Colossal. Substitui exclusivamente a parcela de dano de Pavor nos adicionais estabelecida na v0.113. Mantém aquisição, requisitos, +1E único, raio de 3 m centrado no atacante, 2 alvos adicionais por Coragem e declaração antecipada.

**Golpe Colossal [DEFINIDO — 24/11/2026, correção v0.114]:** os mesmos Êxitos e Pavores válidos da rolagem são comparados à DE individual de cada alvo, também quando combinado com Golpe Fulminante. Cada adicional atingido sofre exclusivamente metade do dano dos Êxitos, arredondada para baixo. Pavor não causa dano pelo Golpe Colossal, inclusive com Fulminante. O dano de Pavor de Golpe Fulminante continua no alvo principal; seus símbolos não são removidos da rolagem nem têm suas consequências canceladas. O procedimento de transferência de Pavor entre múltiplos alvos permanece pendente, sem duplicação automática.

**Dano convencional, sem crítico:** principal com Golpe Fulminante = E + P, adicional atingido = piso(E/2). Sem Fulminante, o principal segue dano normal. O adicional usa a mesma expressão piso(E/2), independentemente de P. Mantém-se o multiplicador crítico vigente antes do arredondamento da parcela de Êxitos.

**Exemplo:** 5E e 2P, 7 pontos válidos contra cada DE; principal atingido com Fulminante sofre 7 de dano convencional, cada adicional atingido sofre 2. A comparação por DE não divide os símbolos. Não altera a regra de Vida.

**IMPLEMENTAÇÃO:** comparador retira dano de Pavor dos adicionais e mostra E/P usados contra cada DE; verbete e catálogos sincronizados. Testes de regressão incluem Pavor sem Êxito e crítico. Validação integral no navegador pendente.
