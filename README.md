# Sensei Try-Catch

Agente de IA (Claude Code) que formula questões de software em forma de sistemas com requisitos, orienta você na resolução e monta exemplos de conceitos.

## Como usar

1. Instale o [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) e o Node.js.
2. Abra esta pasta no terminal e rode `claude`.
3. Peça em linguagem natural:

| Você diz | Skill usada |
|---|---|
| "Formule uma questão de dotnet nível 2" | `formular-questao` |
| "Questão de nível 3 sobre controle de foguete" | `formular-questao` |
| "Me dá 3 questões de angular + dotnet, da 3 à 5" | `formular-questao` |
| "Travei na Q-0001, o 409 nunca volta" | `ajudar-questao` |
| "Revisa minha solução da Q-0002" | `ajudar-questao` |
| "Por que vertical slice e não camadas na Q-0001?" | `ajudar-questao` |
| "Me mostra um exemplo de interceptor no Angular" | `exemplo` |

Também dá para chamar direto: `/formular-questao dotnet angular nível 4`.

## Onde ficam as soluções

As soluções **não ficam neste repositório**. Cada projeto vive na sua própria pasta (e, quando publicado, no seu próprio repositório).

Para o Sensei enxergar o seu código, **informe o caminho da solução no início de toda sessão** em que for trabalhar numa questão:

> Vou trabalhar na Q-0001. A solução está em `C:\...\solucoes\Q-0001`.

Para ele também poder ler, compilar e rodar os testes, a pasta precisa estar liberada na sessão. No terminal, abra o Sensei com a pasta da solução adicionada:

```bash
claude --add-dir "C:\caminho\da\solucao"
```

## Projetos feitos com o Sensei

| Questão | Projeto | Tecnologias | Nível | Status | Repositório |
|---|---|---|---|---|---|
| [Q-0001](questoes/Q-0001-reservas-salas.json) | API de reservas de salas de reunião | dotnet | 1 | concluída | a publicar |

## Pastas

- `questoes/`: uma questão por arquivo JSON (formato em `schema/questao.schema.json`).
- `progresso/`: anotações do Sensei (dicas liberadas, onde você travou).
- `exemplos/`: mini-projetos de exemplo.
- `temas.json`: 67 temas em 13 categorias. Peça um tema específico ("questão sobre foguete") ou deixe o Sensei variar.
- `algoritmos.json`: estruturas de dados e algoritmos que as questões podem exigir.
- `arquiteturas.json`: estilos de arquitetura que o Sensei escolhe para cada projeto.
- `tecnologias.json`: tecnologias e conceitos. Para adicionar uma tecnologia (ex.: `react`, `docker`), inclua em `ativas` e liste os conceitos.

Depois de mexer numa questão à mão, rode `node scripts/indice.mjs` para validar e atualizar o índice.

## Como a revisão de conceitos funciona

Cada questão lista `conceitos` (novos) e `conceitos_revisados` (de questões **concluídas**, com a origem). O índice mostra quais conceitos cada tecnologia já cobriu e quais nunca foram usados; o Sensei usa isso para escolher o que é novo e o que volta para fixação. Marque questões como concluídas pedindo ao Sensei para revisar sua solução.

## Arquitetura e estilo

Cada questão define a arquitetura e as convenções de código que você deve seguir (campo `arquitetura`): o estilo, a justificativa para aquele projeto, as alternativas descartadas, as regras, a estrutura de pastas e os trade-offs. Pergunte ao Sensei sobre qualquer escolha; se seu argumento for melhor para o projeto, ele muda.

## Estruturas de dados e complexidade

Algumas questões exigem, em pontos específicos do sistema, uma estrutura de dados ou uma complexidade máxima (campo `requisitos_algoritmicos`), sempre com volume e forma de verificar. Quanto maior o nível, mais frequente e mais livre: no nível 1 a estrutura é dada; nos níveis mais altos você recebe só a meta e escolhe a estrutura.
