---
name: ajudar-questao
description: Orienta o aluno em uma questão existente (ex.: "me ajuda na Q-0003", "travei no cache da questão 5", "revisa minha solução") sem entregar a solução pronta. Lê a questão, o código do aluno em solucoes/ e o histórico em progresso/, e indica o próximo passo.
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
- **Funciona, quer revisão** → compare com os `criterios_aceite`, requisitos e restrições. Aponte o que falta e problemas de design, segurança e desempenho.

Se não estiver claro, faça **uma** pergunta objetiva ("O que acontece quando você chama o endpoint? Qual status volta?").

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

## Pontos de atenção
- conceitos em que o aluno teve dificuldade (úteis para revisão em questões futuras)
```

Status da questão:
- Primeira ajuda ou primeiro código em `solucoes/` → `status: "em_andamento"`.
- Todos os critérios de aceite atendidos (verifique, rodando testes se houver) → pergunte se ele quer marcar como `"concluida"`; se sim, altere.
- Depois de mudar status, rode `node scripts/indice.mjs`.

Os "pontos de atenção" alimentam a skill `formular-questao`: conceitos com dificuldade são bons candidatos a `conceitos_revisados` em questões futuras.
