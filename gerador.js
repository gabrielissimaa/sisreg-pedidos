/* Gera o texto do pedido. Função pura (sem DOM) para facilitar teste/edição. */
function rotuloCurto(l) {
  return l.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s*[—–-]\s*$/, "").trim();
}
function frase(s) {
  s = String(s || "").replace(/\s+\n/g, "\n").replace(/[ \t]+/g, " ").trim();
  if (!s) return "";
  return /[.!?;:]$/.test(s) ? s : s + ".";
}
function corSugerida(item, marcados) {
  let melhor = null;
  for (const i of marcados) {
    const c = item.crit[i] && item.crit[i][0];
    if (!c || !CORES[c]) continue;
    if (!melhor || CORES[c].ordem > CORES[melhor].ordem) melhor = c;
  }
  return melhor;
}
function temEmergencia(item, marcados) {
  return marcados.some((i) => item.crit[i] && item.crit[i][0] === "e");
}
function camposDo(item) {
  return [...BASES[item.base || "consulta"], ...(item.campos || [])];
}
function faltando(item, v) {
  return camposDo(item).filter((f) => f.req && !(f.t === "chk" ? v[f.id] : String(v[f.id] || "").trim()));
}
function gerarTexto(item, v, marcados) {
  const L = [];
  const val = (id) => String(v[id] || "").trim();
  const proc = (val("nomen") || item.proc) + (val("proc") ? " — " + val("proc") : "") + (val("exame") ? " — " + val("exame") : "") + (val("regiao") ? " — " + val("regiao") : "");
  if (item.email) {
    L.push("Para: " + (val("cap") ? val("cap").split(" — ")[1] : item.email.para));
    L.push("Assunto: " + item.email.assunto + (val("codigo") ? " — SISREG " + val("codigo") : ""));
    L.push("");
    L.push("Paciente: [NOME COMPLETO], CPF [   ], CNS [   ], endereço [   ], equipe/unidade [   ].");
    if (val("proc")) L.push(frase("Solicitação: " + val("proc") + (val("codigo") ? " (código SISREG " + val("codigo") + ")" : "")));
  } else {
    L.push("SOLICITAÇÃO: " + proc + " (" + item.sis + ")");
  }

  const id = [val("idade") && "Paciente de " + val("idade"), val("sexo") && "sexo " + val("sexo")].filter(Boolean).join(", ");
  if (id) L.push(frase(id));
  if (val("quadro")) L.push(frase((item.base === "exame" ? "Indicação: " : "HDA: ") + val("quadro")));
  if (val("tempo")) L.push(frase("Tempo de evolução: " + val("tempo")));
  if (val("comorb")) L.push(frase("Comorbidades: " + val("comorb")));
  if (val("meds")) L.push(frase("Medicações em uso: " + val("meds")));
  if (val("ef")) L.push(frase("Exame físico: " + val("ef")));

  const usados = new Set(["idade", "sexo", "quadro", "tempo", "escores", "codigo", "cap", "nomen", "comorb", "meds", "ef", "exames", "conduta", "hd", "cid", "motivo", "proc", "exame", "regiao"]);
  for (const f of item.campos || []) {
    if (usados.has(f.id)) continue;
    if (f.t === "chk") { if (v[f.id]) L.push(frase(rotuloCurto(f.l) + ": sim")); continue; }
    if (val(f.id)) L.push(frase(rotuloCurto(f.l) + ": " + val(f.id)));
  }
  if (val("exames")) L.push(frase((item.base === "exame" ? "Exames prévios: " : "Exames complementares: ") + val("exames")));
  if (val("escores")) L.push(frase("Escores: " + val("escores")));
  if (val("conduta")) L.push(frase("Conduta e tratamentos prévios: " + val("conduta")));

  const crits = marcados.map((i) => item.crit[i]).filter((c) => c && CORES[c[0]]).map((c) => c[1].replace(/^Até \d+ dias: /, ""));
  if (crits.length) L.push(frase("Critério(s) de encaminhamento: " + crits.join("; ")));

  if (val("hd")) L.push(frase("Hipótese diagnóstica: " + val("hd") + (val("cid") ? " (CID " + val("cid") + ")" : "")));
  else if (val("cid")) L.push(frase("CID: " + val("cid")));
  if (val("motivo")) L.push(frase((item.base === "exame" ? "Pergunta clínica: " : "Objetivo do encaminhamento: ") + val("motivo")));

  const c = corSugerida(item, marcados);
  if (c && c !== "n" && !item.email) L.push("Classificação de risco sugerida: " + CORES[c].nome + " (" + CORES[c].prazo + ").");
  if (item.email) { L.push(""); L.push("Profissional solicitante: [NOME], [CONSELHO], [UNIDADE] — telefones: [   ] / [   ]."); }
  return L.join("\n");
}
if (typeof module !== "undefined") module.exports = { gerarTexto, faltando, corSugerida, temEmergencia, camposDo };
