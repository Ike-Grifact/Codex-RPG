---
title: "Codex RPG — SRD de Continuidade v0.69: Perfurante, Pavor e Barulhenta"
version: "0.69"
system: "Codex RPG"
updated: "2026-11-17"
status: "DEFINIDO — Perfurante reforça dano à Integridade, armas de fogo usam Perfurante passivamente e Barulhenta +1P fixo"
---

# Codex RPG — SRD de Continuidade v0.69

## 0-BF. Reorientar Perfurante para armaduras — 17/11/2026

**DEFINIDO pelo autor:** Perfurante deixa de ser uma propriedade que ignora automaticamente a armadura para atingir a Vida. Em vez disso, **se o ataque acertar e Perfurante estiver habilitado**, cada **Pavor mantido e não anulado** contribui com **1 dano** ao atacar a **Integridade da armadura**, substituindo **nesse efeito** a contagem básica de `⌊P / 2⌋`. Não acrescentar ambos os danos de Pavor: usar `E válidos + P não anulados` **para o dano contra a Integridade da armadura**. Continuam pertinentes efeitos de crítico e outras condições já definidas que alterem dano, respeitando seus próprios gatilhos.

**Sem armadura/Perfurante desabilitado:** não existe Integridade de armadura a perfurar; **não presumir dano extra diretamente à Vida** por esta propriedade. O dano básico fora do efeito segue `E válidos + ⌊P não anulados / 2⌋`, sujeito às regras gerais de proteção, excedente e efeitos específicos. **Não foi aprovada uma alteração geral** para tornar cada Pavor igual a um dano em todos os ataques.

**Escudos/barreiras:** na situação já definida em que escudo físico levantado ou Escudo Arcano Psíquico neutraliza a propriedade Perfurante, o ataque continua com seu dano básico e **não** recebe o bônus de Pavor dessa propriedade. Não interpretar essa neutralização como redução automática de todos os Êxitos ou Pavor válidos do ataque. O procedimento de defesa e consumo de Integridade do escudo segue sua regra vigente.

**Crítico e Perícias Fulminantes:** não apagar nem converter efeitos aprovados de outras especializações. Caso outro efeito altere a contribuição de Pavor ao dano, **não duplicar o mesmo Pavor**. A forma final de cálculo para acumulações não autorizadas permanece **PENDENTE**.

## 0-BG. Armas de fogo com Perfurante [DEFINIDO]

Armas de fogo com a propriedade **Perfurante** utilizam-na **passivamente no acerto**, sem ativar a característica e **sem pagar 1 PP/1 Coragem** para obter seu efeito. Isso **não concede automaticamente Perfurante a modelos que não a possuam** (p. ex., escopeta não perfurante) e **não dispensa os requisitos gerais para utilizar a arma** nem habilita gratuitamente outras características.

**Barulhenta [DEFINIDO]:** sempre que uma arma equipada com a característica Barulhenta participa da rolagem pertinente, ela adiciona **+1P passivo**. A propriedade **não exige crítico nem gasto de PP/Coragem**. Um crítico **não aumenta esse bônus para +2P**: permanece **+1P**. O Pavor gerado participa das verificações e riscos gerais normalmente, incluindo acerto e Pressão conforme as regras da rolagem.

## Escopo da implementação

- **DEFINIDO e aplicado neste lote:** Perfurante deixa de ignorar a armadura; contribui com 1 dano por Pavor válido **à Integridade** quando habilitado. Em armas de fogo com Perfurante cadastrado, o efeito é passivo. Barulhenta fornece **+1P fixo**.
- **PRESERVADO:** dano básico `E + ⌊P / 2⌋` fora de Perfurante, bônus e custos de outras Perícias, imunidades, DE, armaduras, escudos, dano excedente, dados, limites e riscos.
- **PENDENTE:** modelo completo de dano direto à Vida e Sangramento, Perícia em Elemento Sangue, Fogo G2/G3 (Queimar/Derreter), revisão de Cravar e penalidade por excesso de carga. Essas decisões autorais serão tratadas isoladamente antes de atualizar seus procedimentos.
- **Implementação visual:** quando há Perfurante habilitado, a ficha mostra separadamente o **dano calculado à Integridade com Perfurante** e o **dano básico**, sem aplicar automaticamente dano à ficha de um alvo que não foi vinculado à rolagem.
- **Compatibilidade:** fichas de personagens e identificadores de Perícias/itens são mantidos. Propagação aos módulos do Foundry, simulador e fichas de conflitos fica em revisão específica de integração.

## Histórico substituído

A v0.69 **revoga os trechos da v0.68 e do Livro do Jogador** que diziam que Perfurante físico normalmente ignora a armadura, mantendo todas as demais regras da v0.68 (afinidade pela armadura do alvo), v0.67 (carga por porcentagem) e v0.66 (DE das armaduras).
