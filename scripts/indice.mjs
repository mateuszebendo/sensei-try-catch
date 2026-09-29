#!/usr/bin/env node
// Valida todas as questões em questoes/ e regenera questoes/_indice.json.
// Uso: node scripts/indice.mjs
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const pasta = join(raiz, "questoes");
const tecnologias = JSON.parse(readFileSync(join(raiz, "tecnologias.json"), "utf8"));

const obrigatorios = [
  "id", "titulo", "dificuldade", "tecnologias", "conceitos", "contexto",
  "requisitos_funcionais", "requisitos_nao_funcionais", "restricoes",
  "criterios_aceite", "dicas", "status", "criada_em",
];
const statusValidos = ["nao_iniciada", "em_andamento", "concluida"];

const arquivos = existsSync(pasta)
  ? readdirSync(pasta).filter((f) => /^Q-\d{4}-.+\.json$/.test(f)).sort()
  : [];

const erros = [];
const avisos = [];
const questoes = [];

for (const arquivo of arquivos) {
  const erro = (msg) => erros.push(`${arquivo}: ${msg}`);
  let q;
  try {
    q = JSON.parse(readFileSync(join(pasta, arquivo), "utf8"));
  } catch (e) {
    erro(`JSON inválido (${e.message})`);
    continue;
  }

  for (const campo of obrigatorios) if (!(campo in q)) erro(`campo obrigatório ausente: ${campo}`);
  if (!/^Q-\d{4}$/.test(q.id ?? "")) erro(`id inválido: ${q.id}`);
  if (q.id && !arquivo.startsWith(q.id + "-")) erro(`id ${q.id} não bate com o nome do arquivo`);
  if (!Number.isInteger(q.dificuldade) || q.dificuldade < 1 || q.dificuldade > 5) erro("dificuldade deve ser inteiro de 1 a 5");
  if (!statusValidos.includes(q.status)) erro(`status inválido: ${q.status}`);
  if (!Array.isArray(q.dicas) || q.dicas.length < 2) erro("precisa de pelo menos 2 dicas");
  if (!Array.isArray(q.requisitos_funcionais) || q.requisitos_funcionais.length === 0) erro("requisitos_funcionais vazio");
  if (!Array.isArray(q.criterios_aceite) || q.criterios_aceite.length === 0) erro("criterios_aceite vazio");

  for (const t of q.tecnologias ?? []) {
    if (!tecnologias.ativas.includes(t)) avisos.push(`${arquivo}: tecnologia "${t}" não está em tecnologias.json`);
  }
  const conhecidos = new Set((q.tecnologias ?? []).flatMap((t) => tecnologias.conceitos[t] ?? []));
  for (const c of q.conceitos ?? []) {
    if (!conhecidos.has(c)) avisos.push(`${arquivo}: conceito "${c}" não está listado em tecnologias.json`);
  }

  // Coerência entre nível e quantidade de tecnologias
  const n = (q.tecnologias ?? []).length;
  if (q.dificuldade <= 2 && n > 1) avisos.push(`${arquivo}: nível ${q.dificuldade} com ${n} tecnologias (esperado 1)`);
  if (q.dificuldade === 4 && n < 2) avisos.push(`${arquivo}: nível 4 com 1 tecnologia (esperado 2–3)`);
  if (q.dificuldade === 5 && n < 3) avisos.push(`${arquivo}: nível 5 com ${n} tecnologias (esperado 3+)`);

  questoes.push({ ...q, arquivo });
}

// Referências entre questões
const ids = new Set(questoes.map((q) => q.id));
const duplicados = questoes.map((q) => q.id).filter((id, i, a) => a.indexOf(id) !== i);
for (const id of new Set(duplicados)) erros.push(`id duplicado: ${id}`);
for (const q of questoes) {
  for (const r of q.conceitos_revisados ?? []) {
    if (!ids.has(r.origem)) erros.push(`${q.arquivo}: conceitos_revisados aponta para ${r.origem}, que não existe`);
  }
  for (const p of q.pre_requisitos ?? []) {
    if (!ids.has(p)) erros.push(`${q.arquivo}: pre_requisito ${p} não existe`);
  }
}

for (const a of avisos) console.warn("aviso:", a);
if (erros.length) {
  for (const e of erros) console.error("erro:", e);
  console.error(`\n${erros.length} erro(s). Índice não atualizado.`);
  process.exit(1);
}

// Cobertura de conceitos por tecnologia
const cobertura = {};
for (const t of tecnologias.ativas) {
  const todos = tecnologias.conceitos[t] ?? [];
  const usados = {};
  for (const q of questoes) {
    if (!q.tecnologias.includes(t)) continue;
    for (const c of q.conceitos) if (todos.includes(c)) (usados[c] ??= []).push(q.id);
    for (const r of q.conceitos_revisados ?? []) if (todos.includes(r.conceito)) (usados[r.conceito] ??= []).push(q.id);
  }
  cobertura[t] = { usados, nunca_usados: todos.filter((c) => !usados[c]) };
}

const indice = {
  gerado_em: new Date().toISOString(),
  total: questoes.length,
  proximo_id: `Q-${String(questoes.reduce((m, q) => Math.max(m, +q.id.slice(2)), 0) + 1).padStart(4, "0")}`,
  questoes: questoes.map((q) => ({
    id: q.id,
    arquivo: q.arquivo,
    titulo: q.titulo,
    dificuldade: q.dificuldade,
    tecnologias: q.tecnologias,
    conceitos: q.conceitos,
    conceitos_revisados: (q.conceitos_revisados ?? []).map((r) => r.conceito),
    pre_requisitos: q.pre_requisitos ?? [],
    status: q.status,
    criada_em: q.criada_em,
  })),
  cobertura,
};

writeFileSync(join(pasta, "_indice.json"), JSON.stringify(indice, null, 2) + "\n");
console.log(`${questoes.length} questão(ões) válida(s). Próximo id: ${indice.proximo_id}.`);
