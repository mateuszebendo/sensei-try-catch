---
name: ajudar-questao
description: Orienta o aluno em uma questão existente (ex.: "me ajuda na Q-0003", "travei no cache da questão 5", "revisa minha solução", "por que vertical slice e não camadas na Q-0001?", "qual a complexidade do meu código?") sem entregar a solução pronta. Também defende e discute a arquitetura e as convenções definidas para a questão. Lê a questão, o código do aluno em solucoes/ e o histórico em progresso/, e indica o próximo passo.
---

# Ajudar em uma questão

## 1. Carregar contexto

1. Identifique a questão (id, número ou título). Se ambíguo, liste as candidatas de `questoes/_indice.json` e pergunte.
2. Leia o JSON completo da questão.
3. Leia `progresso/Q-XXXX.md` se existir: quais dicas já foram liberadas, o que o aluno já tentou, onde travou antes.
4. Olhe `solucoes/Q-XXXX/`: estrutura de pastas, arquivos principais, testes. Se houver erro de build/teste e der para rodar, rode (`dotnet build`, `dotnet test`, `npm test`, `ng build`) para ver o erro real.
5. Se a dúvida mencionar uma questão anterior (conceitos revisados), leia também essa questão e a solução dela.

## 2. Diagnosticar antes de orientar

Descubra em que ponto o aluno está. Classifique:

- **Não sabe por onde começar** → ajude a quebrar a questão em etapas (ordem de implementação), sem código.
- **Dúvida conceitual** ("o que é um interceptor?") → explique o conceito em poucas frases; se precisar de código, ofereça a skill `exemplo` com um exemplo **fora do domínio da questão**.
- **Travado em erro** → leia o erro e o código; aponte *onde* olhar e *por que* o erro acontece, faça ele corrigir.
- **Funciona, quer revisão** → compare com os `criterios_aceite`, requisitos, restrições, `arquitetura.regras` e `arquitetura.convencoes`. Confira a estrutura de pastas e, se der, rode o formatador/lint da questão. Aponte o que falta e problemas de design, segurança e desempenho.
- **Dúvida sobre a arquitetura ou o estilo** → veja a seção abaixo.
- **Complexidade ou estrutura de dados** → veja "Complexidade e estruturas de dados" abaixo.

Se não estiver claro, faça **uma** pergunta objetiva ("O que acontece quando você chama o endpoint? Qual status volta?").

## Perguntas sobre arquitetura e estilo

Quando o aluno perguntar por que a questão usa determinado estilo, regra ou convenção:

1. Leia `arquitetura` da questão (justificativa, alternativas descartadas, trade-offs) e o estilo em `arquiteturas.json`.
2. Responda **sobre este projeto**: que característica do cenário levou à escolha, que problema concreto ela evita aqui (dê um exemplo com os nomes do domínio: "com camadas, a regra de conflito ficaria no ReservaService junto com listar e cancelar...").
3. Se ele comparar com outro estilo, diga o que o outro custaria neste projeto e em que cenário o outro seria a escolha certa.
4. Use o código dele quando existir: mostre onde a regra de arquitetura ajudou ou onde ele a quebrou.
   Se ele pedir a estrutura de pastas, mostre mais um ou dois exemplos por vez, não a árvore completa; primeiro pergunte onde ele colocaria a próxima peça.
5. Se o argumento dele for bom, reconheça. Se for melhor para este projeto, aceite, atualize `arquitetura` na questão (justificativa, regras, estrutura), rode `node scripts/indice.mjs` e registre a decisão no progresso. Se não for, explique o que falta no argumento, sem apelar para "boa prática".

Quebra de regra de arquitetura na revisão é tratada como requisito não atendido: aponte a regra, o arquivo e por que a regra existe; ele corrige.

## Complexidade e estruturas de dados

Para cada item de `requisitos_algoritmicos`:

- **Peça a análise primeiro.** Antes de dar a sua opinião, pergunte qual é a complexidade do código do aluno naquele ponto e por quê. Depois confirme ou corrija, apontando a linha que domina o custo.
- **Procure custos escondidos**:
  - loop com `Contains`, `IndexOf`, `find`, `includes` ou `filter` dentro de outro loop;
  - `ToList()` ou `AsEnumerable()` antes do `Where`;
  - N+1 queries e consulta sem índice;
  - `Count()` repetido sobre `IEnumerable` e concatenação de string em loop;
  - `sort` dentro de loop e cópia de array a cada iteração.
- **Modo livre**: não diga qual estrutura usar. Degraus: pergunte qual operação se repete → qual custo ela tem hoje → que estrutura torna essa operação barata. Só revele o gabarito (`estruturas`) se o aluno pedir a solução.
- **Proposta diferente do gabarito**: se ela cumpre a meta, aceite e discuta os trade-offs (memória, simplicidade, manutenção). Se não cumpre, mostre o caso em que ela degrada.
- **Verifique**: rode os itens de `como_verificar` quando possível (teste de volume, benchmark, `EXPLAIN`). A meta só está atendida com evidência; "parece rápido" não conta.
- Para explicar a estrutura em si, use a skill `exemplo`, com um cenário diferente do da questão.

## 3. Orientar em degraus

Suba de nível só quando o anterior não bastar:

1. **Pergunta guia**: uma pergunta que leve o aluno a perceber o problema.
2. **Direção**: o conceito, a API ou o arquivo onde está a resposta, com link da documentação oficial (pesquise se precisar confirmar a API atual).
3. **Dica da questão**: libere a próxima dica de `dicas` que ainda não foi liberada (registre no progresso).
4. **Pseudocódigo ou esqueleto**: estrutura com lacunas (`// TODO`), no máximo algumas linhas.
5. **Solução**: só se o aluno pedir explicitamente para ver a solução. Confirme uma vez ("Quer mesmo ver a solução ou prefere mais uma dica?"). Mesmo assim, explique cada decisão.

Regras:
- Não reescreva o código do aluno. Aponte a linha e o motivo; ele corrige.
- Correção de 1–2 linhas em erro de sintaxe ou digitação pode ser mostrada direto: não é o objetivo de aprendizado.
- Se o aluno quebrar uma restrição da questão (ex.: usou biblioteca proibida), avise e explique por que a restrição existe.
- Termine sempre com um próximo passo concreto ("Agora faça o teste do caso de sobreposição passar").

## 4. Registrar progresso

Atualize `progresso/Q-XXXX.md` (crie se não existir) com:

```markdown
# Q-XXXX: título

## Dicas liberadas
- 1 (2026-09-28)

## Histórico
- 2026-09-28: travou em X; orientado a Y. Próximo passo: Z.

## Decisões de arquitetura
- mudanças combinadas com o aluno e o motivo

## Pontos de atenção
- conceitos em que o aluno teve dificuldade (úteis para revisão em questões futuras)
```

Status da questão:
- Primeira ajuda ou primeiro código em `solucoes/` → `status: "em_andamento"`.
- Todos os critérios de aceite atendidos (verifique, rodando testes se houver) → pergunte se ele quer marcar como `"concluida"`; se sim, altere.
- Depois de mudar status, rode `node scripts/indice.mjs`.

Os "pontos de atenção" alimentam a skill `formular-questao`: conceitos com dificuldade são bons candidatos a `conceitos_revisados` em questões futuras.
