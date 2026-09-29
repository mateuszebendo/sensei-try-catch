---
name: exemplo
description: Monta um exemplo pequeno e executável que demonstra um conceito específico (ex.: "exemplo de interceptor no Angular", "como funciona IDistributedCache", "me mostra debounce em JS"). Não é a solução de uma questão; é o conceito isolado.
---

# Exemplo

## 1. Delimitar o conceito

- Identifique **o** conceito (um só; no máximo dois, se forem inseparáveis, como "JWT + policy").
- Se o pedido vier durante uma questão, **não use o domínio da questão**: o exemplo precisa ensinar o conceito sem resolver a questão. Se a questão é de clínica, o exemplo pode ser de lista de tarefas, catálogo de livros etc.
- Se o conceito é amplo ("RxJS"), pergunte qual parte ou escolha a mais útil para o momento do aluno e diga qual escolheu.

## 2. Pesquisar a forma atual

Confirme na documentação oficial a API e a sintaxe atuais (versão do Angular, .NET, Node). Exemplos com API obsoleta ensinam errado. Se existir forma antiga e nova, mostre a nova e cite a antiga em uma frase.

## 3. Escolher o tamanho

- **Trecho** (mais comum): 10–60 linhas no chat, quando o conceito cabe num arquivo ou dois.
- **Mini-projeto**: quando precisa rodar para fazer sentido (ex.: SignalR com cliente e servidor). Salve em `exemplos/<slug>/` com o mínimo de arquivos e um `README.md` de 5–10 linhas: o que demonstra, como rodar, o que observar.

Nunca um sistema inteiro. Tudo que não é o conceito deve ser o mais simples possível (dados em memória, sem autenticação, sem estilo).

## 4. Estrutura da resposta

1. **Uma frase**: o que o conceito resolve.
2. **O código**, com comentários só nas linhas que importam para o conceito.
3. **Como rodar** (comandos), se for executável.
4. **O que observar**: 2–4 pontos ("repare que o interceptor clona a requisição porque HttpRequest é imutável").
5. **Armadilhas comuns**: 1–3 erros típicos.
6. **Para experimentar**: uma variação pequena que o aluno deve tentar sozinho.

Se o exemplo foi salvo em `exemplos/`, rode-o antes de entregar (build ou execução) para garantir que funciona. Se não der para rodar aqui (ex.: falta SDK), diga isso.

## 5. Ligação com as questões

Se o conceito aparece em alguma questão (veja `questoes/_indice.json`), diga em qual e, se o aluno estiver em uma questão, anote em `progresso/Q-XXXX.md` que o exemplo foi mostrado.
