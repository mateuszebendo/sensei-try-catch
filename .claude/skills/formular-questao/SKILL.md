---
name: formular-questao
description: Formula novas questões de software (sistemas com requisitos, não estilo LeetCode) para uma ou mais tecnologias e salva em questoes/ como JSON. Use quando o aluno pedir "nova questão", "me dá um exercício de X", "formule questões de angular + dotnet" ou similar.
---

# Formular questão

Entrada esperada do aluno: tecnologia(s) e, opcionalmente, dificuldade (1–5), quantidade e tema.
Se faltar dificuldade, escolha a próxima que faz sentido pelo histórico (passo 1). Não pergunte o que dá para decidir sozinho.

## 1. Levantar o que já existe

1. Leia `questoes/_indice.json` (se não existir, rode `node scripts/indice.mjs`).
2. Leia `tecnologias.json` para a lista de conceitos de cada tecnologia `arquiteturas.json` para os estilos disponíveis e `algoritmos.json` para as estruturas de dados e algoritmos.
3. Monte, para as tecnologias pedidas:
   - **conceitos já cobertos** (e em quais questões);
   - **conceitos concluídos** (questões com `status: "concluida"`), que são os candidatos a revisão;
   - **conceitos nunca usados**, que são os candidatos a conceito novo;
   - a maior dificuldade já feita por tecnologia;
   - os estilos de arquitetura já usados (`arquiteturas_usadas`);
   - as estruturas e algoritmos já exigidos (`algoritmos_usados`);
   - os temas já usados e as categorias das últimas questões (`temas_usados`, `categorias_recentes`).
4. Leia por completo as 2–3 questões mais recentes das mesmas tecnologias, para não repetir cenário de negócio nem estrutura de requisitos.

## 2. Pesquisar

Antes de escrever, pesquise na web (WebSearch/WebFetch) a forma atual de fazer o que a questão vai exigir:
- versão estável atual da tecnologia (ex.: .NET, Angular, Node LTS);
- bibliotecas que a questão vai obrigar ou sugerir (ex.: QuestPDF para PDF em .NET) e se a licença e o uso ainda são adequados;
- APIs recomendadas vs. obsoletas (ex.: signals e control flow novo no Angular; minimal APIs vs. controllers).

Coloque 1–4 links oficiais em `referencias`. Não invente URL: só use as que você abriu.

## 3. Desenhar a questão

### Tema e cenário
**Nada de cadastro genérico.** O aluno quer temas variados e diferentes: cancela de estacionamento, foguete, sismógrafo, matching engine, eclusa. Cada questão parte de um tema de `temas.json` e preenche o campo `tema`.

1. **Escolha o tema**:
   - Se o aluno pediu um tema, use-o (se não existir no catálogo, adicione-o primeiro, com núcleo técnico e algoritmos).
   - Senão, escolha um tema **ainda não usado** (`temas_usados` no índice) cuja **categoria não apareça nas 3 últimas questões** (`categorias_recentes`) e que caiba no nível (`niveis`).
   - Prefira temas cujo `nucleo_tecnico` combine com os conceitos e algoritmos que você escolheu para a questão.
2. **Use o núcleo técnico**: o que torna o tema interessante (máquina de estados, limites físicos, tempo real, simulação, concorrência) tem de estar nos requisitos. Um "sistema de foguete" que é só cadastro de foguetes não vale.
3. **Ajuste ao nível** com `variacoes`: `mais_simples` orienta os níveis baixos, `mais_complexa` os altos. Um tema pode voltar mais tarde em nível maior, evoluindo a questão anterior (use `pre_requisitos`).
4. **Contexto**: 3–6 frases explicando quem opera o sistema, o que acontece se ele falhar e por que a regra principal existe. Use números reais do domínio (ângulo máximo, intervalo entre trens, frequência dos sensores).
5. **Cadastro pode existir, mas como apoio**: cadastrar cancelas ou estações é aceitável se o centro da questão for o comportamento (abrir, detectar, decidir, simular).

### Domínios físicos: simule o hardware
Temas com sensores e atuadores (cancela, foguete, estufa, eclusa) não exigem hardware real. Defina na questão:
- **Interface do dispositivo**: o que o sistema lê (ex.: `sensor_presenca`, `angulo_atual`, `altitude`, a cada 50 ms) e o que comanda (`abrir(angulo)`, `acionar_paraquedas()`).
- **Simulador**: o aluno implementa um simulador simples com a física mínima (velocidade angular máxima, gravidade e arrasto, vazão de água) ou recebe um arquivo de leituras gravadas para replay. Física simplificada, mas com limites coerentes.
- **Relógio injetável**: lógica de tempo testável sem esperar o tempo real (`TimeProvider` no .NET, relógio falso em JS).
- **Segurança como requisito**: invariantes que nunca podem ser violadas ("a cancela nunca fecha com presença detectada", "o paraquedas nunca abre acima de X m/s") e testes que tentam violá-las, incluindo falha de sensor e leituras fora de ordem.

### Nível e escopo
Siga a tabela de dificuldade do `CLAUDE.md`. Referência rápida:

- **1 Fundamento**: 1 tecnologia, 1 componente completo. Ex.: API de reservas com CRUD, validação de regra de negócio (sem sobreposição de horário), paginação e filtros. Nunca "faça um hello world" ou "some dois números".
- **2 Aplicado**: 1 tecnologia + biblioteca externa ou requisito não funcional. Ex.: a API de reservas gera relatório mensal em PDF.
- **3 Estruturado**: camadas, testes, erros padronizados; pode ser o primeiro front + back.
- **4 Integrado**: 2–3 tecnologias, full stack com cache, autenticação, fila ou tempo real.
- **5 Sistema**: 3+ tecnologias, vários serviços, cache distribuído, mensageria, observabilidade, containers.

Nível mais fácil significa **menos peças**, não menos seriedade: requisitos claros, regras de negócio reais e critérios de aceite verificáveis em todos os níveis.

### Conceitos
- `conceitos`: 2–4 conceitos **novos** (nunca usados antes, se possível), usando os nomes de `tecnologias.json`.
- `conceitos_revisados`: a partir do nível 2, inclua 1–3 conceitos de questões **concluídas**, com `origem` (id da questão) e `como_aparece` (onde o conceito volta, de forma diferente da original). Prefira conceitos antigos: quanto mais tempo desde o uso, melhor para fixação.
- Se a questão depende de algo construído antes, preencha `pre_requisitos`. Uma questão difícil pode evoluir o sistema de uma anterior ("pegue a API da Q-0003 e adicione...").
- Se um conceito necessário não está em `tecnologias.json`, adicione-o lá.

### Paralelismo e concorrência
Quando a questão usar conceitos de concorrência (ex.: `semaphore-slim`, `channels-produtor-consumidor`, `limite-concorrencia`, `condicoes-de-corrida`), o cenário precisa **forçar** o problema; não basta pedir "use Parallel.ForEachAsync":
- Dê volume e tempo: "importar 5.000 registros chamando uma API externa que responde em ~300 ms e aceita no máximo 8 requisições simultâneas".
- Crie disputa por recurso: duas requisições para a última vaga, dois usuários editando o mesmo registro, contador compartilhado.
- Exija cancelamento, timeout ou progresso quando fizer sentido.
- Critérios de aceite mensuráveis: tempo máximo, nunca ultrapassar N chamadas simultâneas, nenhum registro duplicado ou perdido, teste que dispara requisições em paralelo e verifica o resultado.
- Diferencie os dois: **paralelismo** (trabalho de CPU dividido entre núcleos: `plinq`, `worker-threads`) e **concorrência** (muitas operações de I/O em andamento ao mesmo tempo: `task-whenall-whenany`, `promise-combinadores`). Deixe claro na questão qual dos dois está sendo exercitado.

### Docker e Kubernetes
- Quase sempre aparecem **junto** de uma aplicação: containerizar a API de uma questão anterior é ótimo uso de `pre_requisitos` e `conceitos_revisados`.
- Sozinhos (nível 1–2), o cenário é operacional: "a imagem da API tem 1,2 GB e roda como root; reduza para menos de 250 MB, sem root, com healthcheck".
- Critérios de aceite verificáveis por comando: tamanho da imagem, `docker compose up` sobe tudo do zero, pod reinicia quando o health check falha, `kubectl rollout undo` volta a versão.
- Kubernetes local: indique kind, minikube ou k3d; não exija nuvem paga.

### Markdown para IA (`md-para-ia`)
Questões em que o aluno escreve instruções para um agente de IA (CLAUDE.md, AGENTS.md, SKILL.md, prompts reutilizáveis).
- O cenário descreve um repositório ou tarefa real e o comportamento esperado do agente ("o agente vive criando testes sem rodar; o time quer que ele siga o padrão de commits X").
- Entregável: os arquivos `.md` e um conjunto de **3–5 pedidos de teste** com o resultado esperado de cada um.
- Critérios de aceite comportamentais: "dado o pedido X, o agente faz Y e não faz Z". A avaliação é rodar os pedidos com um agente usando as instruções do aluno.
- Restrições típicas: limite de tamanho, proibir regras sem motivo ("NUNCA faça X" sem explicar por quê), obrigar divisão entre CLAUDE.md e skills.
- Combina bem com outras tecnologias: "escreva as instruções para um agente que mantém a API da Q-0003".

### Arquitetura e convenções
Preencha o campo `arquitetura`. É obrigatório e o validador confere.

1. **Escolha o estilo** em `arquiteturas.json` (use `niveis`, `quando_usar` e `quando_evitar`). Full stack pode ter dois estilos: `["vertical-slice", "angular-feature-based"]`. Se o projeto pedir um estilo que não está no catálogo, adicione-o lá primeiro.
2. **Justificativa**: 3–5 frases citando o cenário desta questão (quantos recursos, onde está a regra de negócio, quantas entradas, que infraestrutura). Tem de ser um texto que não serviria para outra questão.
3. **Alternativas descartadas**: 1–3 estilos plausíveis e por que não servem aqui. É isso que prepara você para responder "por que não Y?".
4. **Regras**: 4–7 regras verificáveis na revisão de código (onde fica a regra de negócio, o que pode depender do quê, como as rotas são registradas, o que é proibido).
5. **Estrutura de pastas** como esqueleto: as pastas de topo e **1–2 exemplos** do padrão com nomes reais do domínio (ex.: uma fatia, um componente), seguidos de `...` e de uma frase dizendo que o resto é com o aluno. Não liste todas as pastas, fatias ou arquivos: montar o resto a partir dos requisitos faz parte do exercício.
6. **Convenções**: estilo de código da linguagem (nulidade, nomes, async, imutabilidade, formatação) e a ferramenta que confere (`dotnet format`, ESLint, Prettier, `ng lint`).
7. **Trade-offs**: o que se aceita perder e em que ponto de crescimento a escolha deixaria de servir.

Adicione 1–2 `criterios_aceite` sobre arquitetura e convenções (ex.: estrutura seguida, formatador sem alterações) e, se útil, uma dica sobre como organizar o código antes de começar.

Escolha deliberada de vez em quando: uma questão pode impor um estilo para o aluno sentir o custo dele ("faça em Clean Architecture e compare com a Q-0001"), desde que a justificativa diga isso abertamente.

### Estruturas de dados e complexidade
Decida se a questão terá `requisitos_algoritmicos` pela tabela de frequência do `CLAUDE.md`. Se tiver:

1. **Escolha o ponto** onde o custo importa de verdade: a operação mais repetida, a que roda sobre o maior volume ou a que tem tempo limite. Exemplos: checar conflito a cada nova reserva, autocomplete a cada tecla digitada, conciliar 200 mil lançamentos por noite.
2. **Defina n com volume**: "n = reservas da sala; até 100 mil em 5 anos". Sem volume, a meta não significa nada.
3. **Meta de complexidade** de tempo (e de espaço, quando a memória for limitada) em notação O, considerando o custo do banco e da rede.
4. **Modo**: `imposto` (diz a estrutura) ou `livre` (só a meta). No modo livre, preencha `estruturas` com o gabarito, que não é mostrado ao aluno.
5. **Justificativa** ligada ao cenário: o que acontece com uma solução ingênua naquele volume.
6. **Como verificar**, com pelo menos um item mensurável: teste com volume grande e tempo máximo, benchmark (BenchmarkDotNet, `performance.now()`, `node --cpu-prof`), plano de consulta (`EXPLAIN`) ou contagem de consultas. Sempre exija também uma seção "Análise de complexidade" no README da solução.
7. Prefira estruturas ainda não praticadas e, a partir do nível 3, reuse uma já praticada em outro contexto (vale como `conceitos_revisados`).

Inclua nos `requisitos_funcionais` ou nos `criterios_aceite` a meta em linguagem de negócio ("responde em menos de 50 ms com 100 mil reservas") e deixe o detalhe técnico em `requisitos_algoritmicos`. Adicione uma dica que leve à estrutura sem nomeá-la cedo demais.

### Requisitos e restrições
- `requisitos_funcionais`: 4–10 itens concretos e testáveis. Inclua pelo menos uma regra de negócio que exija pensar (conflito, limite, estado, permissão).
- `requisitos_nao_funcionais`: desempenho, segurança, logs, tempo de resposta, formato de erro etc. Pode ser vazio no nível 1.
- `restricoes.obrigatorio`: bibliotecas ou abordagens exigidas (ex.: "EF Core com SQLite", "formulários reativos, não template-driven").
- `restricoes.proibido`: o que tira o aprendizado se usado (ex.: "não usar AutoMapper", "não usar biblioteca de gerenciamento de estado; use signals").
- `restricoes.outras`: limites de escopo (ex.: "sem front-end nesta questão", "autenticação pode ser fake").

### Critérios de aceite e dicas
- `criterios_aceite`: frases verificáveis ("GET /reservas?pagina=2&tamanho=10 retorna no máximo 10 itens e o total no cabeçalho X-Total-Count").
- `dicas`: 3–5 dicas em ordem crescente de revelação. A primeira só aponta a direção (qual conceito pesquisar); a última quase mostra o caminho, mas sem código pronto.
- `desafios_extras`: 1–3 extensões opcionais.
- `estimativa_horas`: nível 1 ≈ 2–4 h, nível 5 ≈ 15–30 h.

## 4. Salvar

1. Próximo id: maior id em `questoes/` + 1, com 4 dígitos (`Q-0007`).
2. Arquivo: `questoes/Q-0007-slug-curto.json` (slug em kebab-case, sem acento).
3. `status: "nao_iniciada"`, `criada_em`: data de hoje (AAAA-MM-DD).
4. Rode `node scripts/indice.mjs`. Se a validação falhar, corrija e rode de novo.
5. Não crie pasta de solução neste repositório. O aluno implementa numa pasta própria, fora do Sensei, e informa o caminho quando pedir ajuda.

## 5. Apresentar

Mostre ao aluno um resumo curto: título, dificuldade, tecnologias, contexto, requisitos, arquitetura escolhida (com a justificativa em 1–2 frases), restrições e os pontos com meta de complexidade. No modo livre, mostre a meta e esconda a estrutura esperada. **Não mostre as dicas.** Diga quais conceitos antigos estão sendo revisados e de onde vêm.

Se o aluno pediu várias questões, faça todas antes de apresentar e garanta que tenham temas de categorias diferentes entre si e uma progressão de dificuldade coerente.
