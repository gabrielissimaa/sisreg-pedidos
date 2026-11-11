/* =====================================================================
   CATÁLOGO DE SOLICITAÇÕES — SISREG / SER (Rio de Janeiro)
   Fontes: Manual de Regulação Ambulatorial SMS-Rio 2026 (versão preliminar),
           Programa de Controle da Obesidade SMS-Rio (03/2026),
           Guia Profissional de Regulação Ambulatorial (SUBGERAL 2022),
           Protocolo para o Regulador SISREG v1.4 (SUBPAV 2015),
           avisos do Complexo Regulador SMS-Rio (página SISREG, out/2026),
           Carteira de Serviços APS-Rio (2021).
   ---------------------------------------------------------------------
   Para adicionar/editar um item, copie um bloco e ajuste:
     id      identificador único (sem espaço)
     nome    nome exibido na lista
     cat     categoria: "Consulta" | "Exame" | "Procedimento" | "SER" | "Fluxo"
     enf     true = enfermeiro pode solicitar (Manual 2026, Anexo 2)
     cir     true = encaminhamento cirúrgico (acrescenta “provável ASA”)
     email   {para, assunto} = fluxo por e-mail, fora da tela do SISREG
     sis     "SISREG" | "SER"
     proc    nomenclatura exata a selecionar no sistema
     reg     quem regula
     base    "consulta" (campos completos) | "exame" (campos enxutos)
     info    [avisos exibidos no topo]
     crit    [[cor, texto]]  cor: r vermelho, y amarelo, g verde,
             b azul, n sem cor definida, e EMERGÊNCIA (não é SISREG)
     nao     [situações que NÃO devem ser encaminhadas]
     campos  [{id, l (rótulo), t: text|area|num|sel|chk, o:[opções],
               req:true, ph:"exemplo"}]
   ===================================================================== */

const CORES = {
  r: { nome: "VERMELHO", prazo: "situação grave / prioritária — até 30 dias", ordem: 4 },
  y: { nome: "AMARELO", prazo: "prioritário — até 90 dias", ordem: 3 },
  g: { nome: "VERDE", prazo: "pode aguardar — até 180 dias", ordem: 2 },
  b: { nome: "AZUL", prazo: "não prioritário — mais de 180 dias", ordem: 1 },
  n: { nome: "—", prazo: "cor não definida no protocolo", ordem: 0 },
};

const CATALOGO = [
  // ============================ CONSULTAS ============================
  {
    id: "cardio", nome: "Cardiologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Cardiologia", reg: "RT médico da unidade", base: "consulta",
    crit: [
      ["r", "Arritmia crônica sintomática"],
      ["r", "Insuficiência cardíaca moderada a grave, estável"],
      ["r", "Cardiopatia congênita em RN"],
      ["r", "Indicação de marcapasso"],
      ["r", "Pericardite (fora do contexto de urgência)"],
      ["y", "HAS secundária já investigada"],
      ["y", "Acompanhamento de anticoagulação (sem INR ou sem segurança de manejo na APS)"],
      ["y", "Sopro patológico"],
      ["y", "Cardiomiopatia com repercussão clínica"],
      ["y", "Valvopatia sintomática"],
      ["y", "HAS refratária (3 anti-hipertensivos em dose otimizada, incluindo diurético, adesão verificada)"],
      ["g", "Acompanhamento de arritmia"],
      ["g", "Hipertensão pulmonar"],
      ["b", "Outras situações cardiológicas"],
      ["e", "Suspeita de síndrome coronariana aguda / angina instável"],
      ["e", "Arritmia com instabilidade"],
      ["e", "Emergência hipertensiva"],
      ["e", "Dor torácica < 12 h, ou 12–72 h com alteração de exame"],
    ],
    nao: ["Risco cirúrgico", "HAS estágio I–II", "Sopro inocente", "Angina estável responsiva ao tratamento",
      "IC leve-moderada compensada", "Crise hipertensiva sem lesão de órgão-alvo", "Arritmia crônica estável"],
    campos: [
      { id: "ecg", l: "ECG (data e laudo)", t: "area", req: true, ph: "Ex.: 02/11/26 — ritmo sinusal, FC 72, BRE" },
      { id: "eco", l: "Ecocardiograma (se houver)", t: "text", ph: "Ex.: FE 35%, IM moderada" },
      { id: "pa", l: "PA nas últimas consultas / MAPA", t: "text" },
      { id: "nyha", l: "Classe funcional NYHA", t: "sel", o: ["", "I", "II", "III", "IV", "Não se aplica"] },
    ],
  },
  {
    id: "cirgeral", cir: true, nome: "Cirurgia Geral", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Cirurgia Geral (esôfago/estômago/fígado/hérnia/pâncreas/suprarrenal/vesícula)",
    reg: "RT médico da unidade", base: "consulta",
    crit: [
      ["r", "Doença diverticular com sangramento recorrente e/ou anemia"],
      ["r", "Suspeita de malignidade"],
      ["y", "Colelitíase com crises recorrentes"],
      ["y", "Hérnia com crises álgicas"],
      ["g", "Hérnia não complicada"],
      ["b", "Colelitíase oligo/assintomática"],
      ["e", "Abdome agudo / apendicite / obstrução intestinal"],
      ["e", "Hérnia encarcerada"],
      ["e", "Abscesso profundo, trauma penetrante, grande queimado"],
    ],
    nao: ["Diverticulose assintomática", "Hérnia umbilical em < 2 anos", "Cantoplastia (fazer na APS)",
      "Suturas e abscessos simples", "Risco cirúrgico"],
    campos: [
      { id: "usg", l: "USG / imagem (data e laudo)", t: "area", req: true },
      { id: "crises", l: "Nº de crises / episódios e última crise", t: "text" },
    ],
  },
  {
    id: "vascular", cir: true, nome: "Cirurgia Vascular", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Cirurgia Vascular", reg: "RT médico da unidade", base: "consulta",
    crit: [
      ["r", "Claudicação limitante sem isquemia crítica"],
      ["y", "Aneurisma de aorta abdominal ≥ 5 cm assintomático"],
      ["g", "Varizes sintomáticas refratárias ao tratamento clínico"],
      ["b", "Insuficiência venosa crônica com úlcera de difícil cicatrização"],
      ["e", "Isquemia crítica / oclusão arterial aguda"],
      ["e", "Suspeita de TVP"],
      ["e", "Úlcera grave"],
    ],
    nao: ["Apenas fatores de risco", "Claudicação não limitante", "Raynaud primário", "Livedo isolado",
      "Varizes que respondem ao tratamento", "Tromboflebite superficial"],
    campos: [
      { id: "pulsos", l: "Pulsos periféricos / ITB", t: "text", req: true },
      { id: "distancia", l: "Distância de claudicação", t: "text", ph: "Ex.: 100 m" },
      { id: "doppler", l: "Doppler / imagem (se houver)", t: "area" },
    ],
  },
  {
    id: "derma", nome: "Dermatologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Dermatologia", reg: "RT médico da unidade", base: "consulta",
    info: ["Hanseníase deve ser investigada na APS.", "Dermatofitoses, atopia, pequenas cirurgias e biópsia são da APS."],
    crit: [
      ["r", "Lesão sugestiva de neoplasia (ex.: melanoma)"],
      ["r", "Rash extenso doloroso"],
      ["y", "Prurido intenso / rash extenso sem dor"],
      ["g", "Parasitoses ou atopia refratárias"],
      ["g", "Acne grau IV"],
      ["b", "Demais situações"],
      ["e", "Queimadura extensa aguda, pênfigo, eritrodermia"],
    ],
    nao: ["Dermatofitoses", "Dermatite atópica não refratária"],
    campos: [
      { id: "lesao", l: "Descrição da lesão (local, tamanho, cor, bordas, ABCDE)", t: "area", req: true },
      { id: "mudancas", l: "Mudanças recentes da lesão", t: "text" },
      { id: "biopsia", l: "Biópsia (se feita)", t: "text" },
    ],
  },
  {
    id: "endocrino", nome: "Endocrinologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Endocrinologia", reg: "RT médico da unidade", base: "consulta",
    info: ["A tabela de cores do protocolo de 2015 está corrompida no original — só “hipertireoidismo = vermelho” é confiável. Classifique pela gravidade clínica.",
      "Manejo na APS: hipotireoidismo (inclusive início), DM sem descompensação grave, insulinização de DM2, obesidade."],
    crit: [
      ["r", "Hipertireoidismo"],
      ["n", "DM com controle inadequado apesar de tratamento otimizado"],
      ["n", "DM insulinizado de difícil controle"],
      ["n", "Hipotireoidismo de difícil ajuste"],
      ["n", "Suspeita de doença endócrina rara"],
      ["e", "Hipoglicemia grave / estado hiperosmolar / CAD"],
      ["e", "Crise tireotóxica / coma mixedematoso"],
    ],
    nao: ["Hipotireoidismo de fácil controle", "TSH subclínico < 10 assintomático", "Obesidade isolada", "DM2 apenas para iniciar insulina"],
    campos: [
      { id: "hba1c", l: "HbA1c (valores e datas)", t: "text" },
      { id: "tireoide", l: "TSH / T4L (valores e datas)", t: "text" },
      { id: "doses", l: "Doses atuais (insulina, levotiroxina etc.)", t: "text" },
    ],
  },
  {
    id: "gastro", nome: "Gastroenterologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Gastroenterologia", reg: "RT médico da unidade", base: "consulta",
    crit: [
      ["r", "Suspeita de câncer do TGI (hiporexia, perda de peso, disfagia)"],
      ["r", "Estenose péptica moderada/grave"],
      ["y", "Esofagite erosiva"],
      ["y", "Esôfago de Barrett"],
      ["y", "Dúvida diagnóstica"],
      ["g", "DRGE refratária"],
      ["b", "Hepatopatia crônica avançada compensada"],
      ["e", "HDA/HDB com instabilidade, colangite, colecistite, pancreatite, obstrução, abdome agudo"],
    ],
    nao: ["Gastrite / H. pylori", "DRGE não complicada", "Esteatose", "Constipação"],
    campos: [
      { id: "eda", l: "EDA / colonoscopia prévia (data e laudo)", t: "area" },
      { id: "peso", l: "Perda de peso (kg em quanto tempo)", t: "text" },
    ],
  },
  {
    id: "hepato", nome: "Gastro – Hepatologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Gastroenterologia – Hepatologia", reg: "RT médico da unidade", base: "consulta",
    crit: [
      ["r", "Suspeita de câncer hepático"],
      ["r", "Cirrose com descompensações frequentes"],
      ["y", "Dúvida diagnóstica"],
      ["y", "Hepatomegalia"],
      ["y", "Hepatopatia avançada"],
      ["g", "Cirrose compensada"],
      ["g", "Lesão hepática em exame de imagem"],
      ["b", "Hepatites B/C crônicas para revisão"],
      ["e", "Encefalopatia, hepatite fulminante, cirrose com complicação aguda"],
    ],
    nao: ["Icterícia fisiológica do RN", "Esteatose leve/moderada", "Hepatite viral aguda sem complicação", "Tumor hepático benigno"],
    campos: [
      { id: "lab", l: "TGO/TGP, bilirrubinas, albumina, INR, plaquetas", t: "area", req: true },
      { id: "sorol", l: "Sorologias (HBsAg, anti-HCV etc.)", t: "text" },
      { id: "img", l: "USG / imagem de abdome", t: "text" },
    ],
  },
  {
    id: "gineco", nome: "Ginecologia (geral)", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Ginecologia", reg: "RT médico da unidade", base: "consulta",
    info: ["Inserção de DIU, contracepção, vulvovaginites e dispareunia são da APS.",
      "Incontinência/uroginecologia → “Ginecologia Cirúrgica”. Mama → “Consulta em Mastologia”."],
    crit: [
      ["r", "Hiper/metrorragia moderada"],
      ["r", "Dor pélvica moderada (sem abdome agudo)"],
      ["r", "DIU na cavidade abdominal"],
      ["r", "Doença inflamatória pélvica"],
      ["y", "Rastreio alterado (colo)"],
      ["y", "Prolapso oligossintomático"],
      ["g", "Endometriose"],
      ["g", "Miomatose assintomática"],
      ["b", "Incontinência urinária"],
      ["b", "Sangramento uterino anormal já investigado na APS"],
      ["e", "Abdome agudo, sangramento volumoso, sepse"],
    ],
    nao: ["Vulvovaginites", "Contracepção / inserção de DIU", "Dispareunia / libido"],
    campos: [
      { id: "dum", l: "DUM / status menopausal", t: "text" },
      { id: "usgtv", l: "USG pélvica/transvaginal (data e laudo)", t: "area" },
      { id: "hb", l: "Hemoglobina (se sangramento)", t: "text" },
      { id: "cito", l: "Último preventivo", t: "text" },
    ],
  },
  {
    id: "histero", cir: true, nome: "Histeroscopia diagnóstica", cat: "Procedimento", sis: "SISREG",
    proc: "Consulta em Ginecologia – Histeroscopia Diagnóstica", reg: "RT médico da unidade", base: "consulta",
    info: ["“Biópsia câncer de endométrio” foi extinta — usar esta nomenclatura."],
    crit: [
      ["r", "Sangramento pós-menopausa com espessamento endometrial"],
      ["y", "Espessamento endometrial / pólipo em investigação"],
    ],
    campos: [
      { id: "eco", l: "Espessura endometrial (USG TV, data)", t: "text", req: true },
      { id: "menop", l: "Status menopausal / uso de TH", t: "text" },
    ],
  },
  {
    id: "masto", nome: "Mastologia (lesão benigna)", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Mastologia", reg: "RT médico da unidade", base: "consulta",
    info: ["Só patologias mamárias.", "Policlínica: lesão benigna com dificuldade de seguimento na APS ou BI-RADS 3 com antecedente de CA. Hospital (Gaffrée, Andaraí, Piedade, Salgado Filho): benigna com possível indicação cirúrgica.",
      "Lesão suspeita (BI-RADS 4/5) → usar os itens de biópsia."],
    crit: [
      ["y", "Lesão benigna com possível indicação cirúrgica"],
      ["g", "Lesão benigna com dificuldade de seguimento na APS"],
      ["g", "BI-RADS 3 com antecedente de câncer de mama"],
    ],
    nao: ["BI-RADS 3 impalpável sem antecedente (repetir imagem 6/6 meses no 1º ano)"],
    campos: [
      { id: "birads", l: "BI-RADS e exame (MMG/USG, data)", t: "text", req: true },
      { id: "ecm", l: "Exame clínico das mamas", t: "area", req: true },
    ],
  },
  {
    id: "neuro", nome: "Neurologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Neurologia (ou subtipo: Epilepsia, Esclerose Múltipla, Parkinson, Pediatria, Toxina Botulínica)",
    reg: "RT médico da unidade", base: "consulta",
    info: ["Demência, distúrbio do movimento e AVC → “Consulta em Neurologia”.",
      "Doenças neuromusculares e EEG migraram para o SER."],
    crit: [
      ["r", "Lesão com efeito de massa, estável"],
      ["r", "Cefaleia de início abrupto ou com piora progressiva"],
      ["r", "Convulsões / ausências recorrentes em criança"],
      ["y", "Demência de início agudo sem causa reversível"],
      ["y", "Convulsão iniciada na vida adulta"],
      ["g", "Paresias / parestesias persistentes"],
      ["g", "Demais demências"],
      ["g", "Doença de Parkinson"],
      ["b", "Disestesias subagudas inexplicadas"],
      ["e", "AVC/AIT agudo, déficit focal agudo, meningite, cefaleia com alteração do estado mental"],
    ],
    nao: ["Tremor essencial", "Demência senil estável", "Sequela de AVC estável", "Cefaleias primárias"],
    campos: [
      { id: "exneuro", l: "Exame neurológico", t: "area", req: true },
      { id: "tc", l: "TC de crânio (data e laudo)", t: "text" },
      { id: "meem", l: "Mini-Mental / testes cognitivos (se demência)", t: "text" },
      { id: "reversiveis", l: "Causas reversíveis afastadas (B12, TSH, VDRL...)", t: "text" },
    ],
  },
  {
    id: "orto", nome: "Ortopedia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Ortopedia", reg: "RT médico da unidade", base: "consulta",
    crit: [
      ["r", "Hérnia discal com dor intensa"],
      ["r", "Suspeita de câncer"],
      ["r", "Caso cirúrgico urgente (necrose de cabeça femoral, osteomielite crônica)"],
      ["r", "Artrite com suspeita de infecção"],
      ["y", "Lombociatalgia cirúrgica com dor moderada"],
      ["y", "Pós-operatório / retirada de gesso"],
      ["g", "Síndrome do túnel do carpo moderada"],
      ["b", "Poliartralgia ou lombociatalgia sem melhora"],
      ["b", "Prótese assintomática"],
      ["e", "Fratura, osteomielite aguda"],
    ],
    nao: ["Lombalgia aguda ou crônica sem sinal de alarme", "Dorsalgia", "Entorse", "Cisto sinovial"],
    campos: [
      { id: "rx", l: "Rx / imagem (data e laudo)", t: "area" },
      { id: "func", l: "Limitação funcional", t: "text" },
      { id: "fisio", l: "Fisioterapia / analgesia realizada (tempo)", t: "text" },
    ],
  },
  {
    id: "orl", nome: "Otorrinolaringologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Otorrinolaringologia", reg: "RT médico da unidade", base: "consulta",
    info: ["Distúrbios do sono / polissonografia → “Medicina do Sono”.", "VPPB: tratar na APS (Dix-Hallpike / Epley)."],
    crit: [
      ["r", "Disfonia persistente com sinais de alarme"],
      ["r", "Perfuração timpânica extensa"],
      ["y", "Rouquidão persistente sem sinais de alarme"],
      ["y", "Otites de repetição"],
      ["y", "Epistaxe recorrente"],
      ["g", "Sinusite crônica recorrente"],
      ["g", "Amigdalites de repetição"],
      ["g", "Disacusia investigada"],
      ["b", "Demais"],
      ["e", "Corpo estranho em via aérea, epistaxe volumosa refratária"],
    ],
    nao: ["Infecções agudas", "Cerume", "Disfonia recente", "Epistaxe ocasional", "VPPB", "Perfuração timpânica pequena"],
    campos: [
      { id: "episodios", l: "Nº de episódios no último ano", t: "text" },
      { id: "otoscopia", l: "Otoscopia / oroscopia / rinoscopia", t: "text" },
      { id: "tabag", l: "Tabagismo (se disfonia)", t: "text" },
    ],
  },
  {
    id: "pneumo", nome: "Pneumologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Pneumologia (ou Pneumologia – Asma)", reg: "RT médico da unidade", base: "consulta",
    crit: [
      ["r", "TB com resistência em cultura"],
      ["r", "Suspeita de câncer de pulmão"],
      ["y", "Asma de difícil controle"],
      ["y", "DPOC com insuficiência respiratória crônica"],
      ["y", "Indicação de O2 domiciliar"],
      ["g", "Nódulo pulmonar simples"],
      ["g", "Enfisema"],
      ["g", "Fibrose cística"],
      ["b", "Bronquiectasias"],
      ["e", "Pneumotórax, IRpA, pneumonia grave, derrame extenso com dessaturação"],
    ],
    nao: ["Asma controlada", "Crise leve", "Pneumonia sem complicação", "DPOC estável ou exacerbação sem IRpA"],
    campos: [
      { id: "spo2", l: "SpO2 em ar ambiente", t: "text" },
      { id: "espiro", l: "Espirometria (se houver)", t: "text" },
      { id: "imgtorax", l: "Rx / TC de tórax", t: "area" },
      { id: "inal", l: "Inaladores em uso / técnica revisada", t: "text" },
    ],
  },
  {
    id: "psiq", nome: "Psiquiatria", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Psiquiatria", reg: "RT médico da unidade", base: "consulta",
    info: ["CAPS não é emergência; usar matriciamento (NASF/eMulti) antes."],
    crit: [
      ["r", "Depressão refratária"],
      ["r", "Transtornos dissociativos"],
      ["y", "TOC / pânico / ansiedade refratários a 2 alternativas em dose plena"],
      ["y", "Esquizofrenia em idade atípica"],
      ["g", "Transtornos psicossexuais"],
      ["g", "Dúvida diagnóstica (ex.: depressão × bipolar)"],
      ["b", "Seguimento de bipolar / esquizofrenia grave"],
      ["e", "Ideação ou tentativa de suicídio, auto/heteroagressão, surto psicótico"],
    ],
    nao: ["Depressão responsiva", "TAG/TOC/pânico leve a moderado", "Uso de substâncias (fluxo CAPS/APS)"],
    campos: [
      { id: "esquemas", l: "Esquemas tentados (droga, dose, tempo, resposta)", t: "area", req: true },
      { id: "escala", l: "Escalas (PHQ-9, GAD-7...)", t: "text" },
      { id: "matric", l: "Matriciamento realizado?", t: "sel", o: ["", "Sim", "Não"] },
    ],
  },
  {
    id: "reumato", nome: "Reumatologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Reumatologia", reg: "RT médico da unidade", base: "consulta",
    crit: [
      ["r", "Artropatia inflamatória dolorosa"],
      ["r", "Incapacidade por poliartrite"],
      ["y", "Doença deformante/progressiva sem plano (AR, esclerodermia, EA, polimiosite)"],
      ["y", "Gota atípica ou recorrente"],
      ["g", "Dúvida diagnóstica"],
      ["g", "Uso prolongado de AINE sem melhora"],
      ["b", "Seguimento com plano definido"],
      ["e", "Artrite séptica / gonocócica, dor refratária intensa, SAF complicada"],
    ],
    nao: ["Artralgia < 2 meses ou não investigada", "Fibromialgia", "Osteoartrose inicial/moderada", "Gota típica"],
    campos: [
      { id: "artic", l: "Articulações acometidas / rigidez matinal", t: "text", req: true },
      { id: "provas", l: "VHS, PCR, FR, anti-CCP, FAN, ácido úrico", t: "area" },
    ],
  },
  {
    id: "uro", nome: "Urologia (geral)", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Urologia", reg: "RT médico da unidade", base: "consulta",
    info: ["Cálculo renal/ureteral → “Urologia – Litíase” (item próprio)."],
    crit: [
      ["r", "Retenção urinária de repetição"],
      ["r", "Hematúria franca"],
      ["r", "Massa testicular com exame"],
      ["y", "Prostatismo com PSA e/ou toque alterado"],
      ["g", "Oligo/azoospermia"],
      ["g", "Prostatismo refratário"],
      ["g", "Fimose"],
      ["g", "Lesões penianas"],
      ["b", "Disfunção erétil refratária"],
      ["b", "Incontinência / demais"],
      ["e", "Torção testicular, retenção aguda, pielonefrite grave, hematúria com instabilidade"],
    ],
    nao: ["Disfunção erétil não tratada", "HPB não complicada", "Rastreio de próstata", "Orquiepididimite"],
    campos: [
      { id: "psa", l: "PSA (valores e datas)", t: "text" },
      { id: "toque", l: "Toque retal", t: "text" },
      { id: "eas", l: "EAS / urocultura", t: "text" },
      { id: "usgu", l: "USG aparelho urinário / próstata", t: "text" },
    ],
  },
  {
    id: "litiase", cir: true, nome: "Urologia – Litíase", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Urologia – Litíase", reg: "RT médico da unidade", base: "consulta",
    info: ["Desde 2021 cálculo renal/ureteral só por esta via; o urologista decide a técnica."],
    crit: [
      ["r", "Nefrolitíase aguda/subaguda (após controle da dor)"],
      ["g", "Litíase crônica"],
      ["e", "Cólica refratária, febre/obstrução, pielonefrite"],
    ],
    campos: [
      { id: "calculo", l: "Tamanho e localização do cálculo (exame e data)", t: "text", req: true },
      { id: "hidro", l: "Hidronefrose?", t: "sel", o: ["", "Não", "Sim — leve", "Sim — moderada/grave"] },
      { id: "func", l: "Creatinina", t: "text" },
    ],
  },
  {
    id: "nefro", nome: "Nefrologia – Pré-dialítico", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Nefrologia – Pré-dialítico", reg: "Centralizada", base: "consulta",
    info: ["DRC estágio IV; > 18 anos.", "Exclusão: dilatação pielocalicial, hidronefrose e/ou bexigoma."],
    crit: [["y", "DRC estágio IV com creatinina > 5,0"]],
    campos: [
      { id: "creat", l: "Creatinina (mg/dL) e data", t: "text", req: true, ph: "Deve ser > 5,0" },
      { id: "usgvias", l: "USG ou TC de vias urinárias (data e laudo)", t: "area", req: true },
      { id: "labs", l: "Hemograma, ureia, Ca, P, K", t: "area", req: true },
      { id: "u24", l: "Urina 24 h (clearance e proteinúria)", t: "text", req: true },
      { id: "excl", l: "Ausência de hidronefrose/bexigoma confirmada", t: "chk", req: true },
    ],
  },
  {
    id: "catarata", nome: "Oftalmo – Cirurgia de catarata", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Oftalmologia – Cirurgia de Catarata", reg: "RT médico da APS (descentralizada, ordem cronológica)", base: "consulta",
    info: ["Sem ASA o pedido é DEVOLVIDO.", "ASA I/II → prestadores privados/municipais; ASA III/IV → HF Lagoa, HF Ipanema, HUPE, Hosp. Adventista Silvestre.",
      "2º olho: só a unidade executante insere."],
    crit: [["n", "Catarata com indicação cirúrgica"]],
    campos: [
      { id: "asa", l: "Classificação ASA", t: "sel", req: true, o: ["", "ASA I", "ASA II", "ASA III", "ASA IV"] },
      { id: "olho", l: "Olho", t: "sel", req: true, o: ["", "OD", "OE", "AO"] },
      { id: "av", l: "Acuidade visual / laudo oftalmológico", t: "text" },
    ],
  },
  {
    id: "trans", nome: "Saúde Trans – avaliação multiprofissional", cat: "Consulta", sis: "SISREG",
    proc: "Saúde Trans – Avaliação Multiprofissional", reg: "RT médico da unidade", base: "consulta",
    info: ["Não dispensa hormonização pela APS.", "Exclusão: desejo de cirurgia afirmadora (fluxo próprio), < 16 anos, outros municípios, quadro psiquiátrico agudo/descontrolado."],
    crit: [
      ["n", "Hormonização inicial quando a unidade de referência não oferece"],
      ["n", "Contraindicação relativa (cardiopatia, HAS/DM difícil controle, TEV, dislipidemia grave, epilepsia, DRC/hepatopatia etc.)"],
      ["n", "Alteração laboratorial (Ht > 55%, LH/FSH suprimidos, TGO/TGP > 2× LSN, ↑30% creatinina refratário)"],
      ["n", "Otimização por resposta insuficiente"],
      ["n", "Troca de hormônio por necessidade financeira"],
    ],
    campos: [
      { id: "resid", l: "Reside no município do Rio", t: "chk", req: true },
      { id: "hormon", l: "Hormonização atual (droga, dose, tempo)", t: "text" },
      { id: "labs", l: "Exames recentes pertinentes", t: "area" },
    ],
  },
  {
    id: "prep", nome: "PrEP (consulta)", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Profilaxia Pré-Exposição ao HIV", reg: "RT médico da unidade", base: "exame", enf: true,
    info: ["Atendimento descentralizado na APS — encaminhar só quem NÃO deseja ser atendido na própria unidade de referência.","Só para residentes no Rio, com contato prévio com o usuário. Dúvidas: Gerência IST/AIDS 3971-1639.",
      "A APS pode prescrever PrEP diretamente (ação estratégica da Carteira)."],
    crit: [
      ["n", "HSH"], ["n", "Profissional do sexo"], ["n", "Pessoa trans"], ["n", "Parceria sorodiferente"],
    ],
    campos: [
      { id: "resid", l: "Reside no município do Rio", t: "chk", req: true },
      { id: "testes", l: "Testes rápidos HIV/sífilis/hepatites (data e resultado)", t: "text", req: true },
      { id: "recusa", l: "Usuário prefere não ser atendido na unidade de referência", t: "chk", req: true },
    ],
  },
  {
    id: "padi", nome: "PADI – Atenção Domiciliar ao Idoso", cat: "Consulta", sis: "SISREG",
    proc: "PADI – Atenção Domiciliar", reg: "Unidade de referência", base: "consulta",
    info: ["Anexar formulário “Encaminhamento de Usuários (Referência e Contrarreferência)” e termo de compromisso assinado.",
      "Inelegível: profissional presencial permanente/monitorização contínua, propedêutica ou cirurgia urgente, instabilidade (exceto paliativo final com DAV para morrer em casa)."],
    crit: [
      ["n", "Agudo com necessidade de terapia parenteral"],
      ["n", "Crônico agudizado com necessidade de reabilitação"],
      ["n", "Doença crônico-degenerativa que demande atendimento no mínimo semanal"],
      ["n", "Cuidados paliativos com acompanhamento no mínimo semanal (dor/sofrimento)"],
      ["n", "Prematuridade / baixo peso com necessidade de ganho ponderal"],
    ],
    campos: [
      { id: "acamado", l: "Acamado / restrito ao lar", t: "chk", req: true },
      { id: "cuidador", l: "Cuidador identificado (se dependente)", t: "chk", req: true },
      { id: "termo", l: "Termo de compromisso assinado", t: "chk", req: true },
      { id: "infra", l: "Domicílio com infraestrutura mínima", t: "chk", req: true },
      { id: "origem", l: "Oriundo da rede SUS (origem)", t: "text" },
    ],
  },
  {
    id: "ostomia", nome: "Ostomizado – avaliação", cat: "Consulta", sis: "SISREG",
    proc: "Avaliação do Paciente Ostomizado (1ª vez)  /  Consulta em Complicações do Paciente Ostomizado", reg: "RT médico da unidade", base: "exame", enf: true,
    info: ["1ª consulta = cadastro no Programa de Atenção à Pessoa Ostomizada com estomaterapeuta; retornos e dispensação mensal de bolsas ficam na agenda interna do polo.", "APS agenda só a 1ª consulta. Executantes: CMR Oscar Clark, Policlínica PAM Bangu.",
      "Só ostomias intestinais e urinárias baixas. Não troca GTT/cânula, não fornece insumos, não trata ferida crônica."],
    crit: [["n", "Ostomia intestinal"], ["n", "Ostomia urinária baixa"]],
    campos: [
      { id: "cidpat", l: "CID da patologia de base", t: "text", req: true },
      { id: "cidost", l: "CID da ostomia", t: "text", req: true },
      { id: "tipo", l: "Técnica", t: "sel", req: true, o: ["", "Temporária", "Definitiva"] },
      { id: "docs", l: "Paciente levará: laudo, formulário SISREG, comprovante de residência, identidade, CNS, CPF", t: "chk", req: true },
    ],
  },
  {
    id: "orteses", nome: "Órteses / meios de locomoção (ABBR)", cat: "Consulta", sis: "SISREG",
    proc: "Consulta para prescrição de órtese, prótese e materiais especiais", reg: "RT médico da unidade", base: "consulta",
    info: ["Pedir REABILITAÇÃO, não o equipamento (cadeira de rodas, de banho, muletas, bengalas, andadores, calçados).",
      "Palmilha de EVA: referência da CAP. Amputado → procedimento de prótese em amputação."],
    crit: [["n", "Limitação de mobilidade com necessidade de dispositivo"]],
    campos: [
      { id: "func", l: "Funcionalidade / marcha / transferências", t: "area", req: true },
      { id: "equip", l: "Dispositivo que parece necessário", t: "text" },
    ],
  },
  {
    id: "poscovid", nome: "Reabilitação pós-COVID", cat: "Consulta", sis: "SISREG",
    proc: "Reabilitação pós-COVID", reg: "RT médico da unidade", base: "consulta",
    info: ["Com O2: CMR Engenho de Dentro e Oscar Clark. Sem O2: Policlínica Newton Bethlem e CMS Maria Cristina Roma Paugartten."],
    crit: [["n", "Sequela motora / respiratória / voz / deglutição / AVD"]],
    campos: [
      { id: "dias", l: "Dias desde os sintomas (> 30)", t: "num", req: true },
      { id: "o2", l: "Uso de O2", t: "sel", req: true, o: ["", "Não", "Sim"] },
      { id: "estavel", l: "Clinicamente estável", t: "chk", req: true },
    ],
  },
  {
    id: "audit", nome: "Reabilitação auditiva", cat: "Consulta", sis: "SISREG",
    proc: "Reabilitação Auditiva (≥ 14 anos) / Reabilitação Auditiva – Pediatria", reg: "NIR (centralizada)", base: "consulta",
    enf: true,
    info: ["Não precisa de laudo médico conclusivo: o CER faz o diagnóstico, adapta AASI e dispensa sistema FM.", "Não faz teste da orelhinha."],
    crit: [["n", "Teste da orelhinha alterado"], ["n", "Suspeita de perda auditiva (adulto ou criança)"], ["n", "Atraso de linguagem / alteração do desenvolvimento"]],
    campos: [
      { id: "audio", l: "Audiometria / EOA (se houver)", t: "text" },
    ],
  },
  // ============================ EXAMES ============================
  {
    id: "colono", nome: "Colonoscopia", cat: "Exame", sis: "SISREG",
    proc: "Colonoscopia", reg: "RT médico da unidade", base: "exame",
    info: ["NÃO serve para rastreamento populacional em assintomático sem risco (não há programa no município)."],
    crit: [
      ["r", "Sangramento baixo recorrente"],
      ["r", "Alta suspeita de câncer colorretal"],
      ["y", "Sangramento / DII / baixa suspeita muito sintomático"],
      ["g", "Baixa suspeita, sintomático"],
      ["b", "Baixa suspeita, assintomático"],
    ],
    nao: ["Rastreamento em assintomático sem fator de risco"],
    campos: [
      { id: "sof", l: "Pesquisa de sangue oculto / Hb", t: "text" },
      { id: "hf", l: "História familiar de CCR", t: "text" },
    ],
  },
  {
    id: "eda", nome: "Endoscopia digestiva alta (EDA)", cat: "Exame", sis: "SISREG",
    proc: "Esofagogastroduodenoscopia", reg: "RT médico da unidade", base: "exame",
    info: ["DRGE: tratar empiricamente; EDA se falha de IBP 2×/dia ou complicação."],
    crit: [
      ["r", "Sangramento alto crônico sem uso de AINE"],
      ["r", "Alta suspeita de câncer (alarme, história familiar, > 55 anos)"],
      ["y", "Perda de peso, disfagia progressiva, vômitos persistentes"],
      ["y", "Anemia ferropriva / massa epigástrica"],
      ["g", "Assintomático com baixa suspeita"],
      ["b", "< 55 anos com dispepsia sem alarme"],
    ],
    nao: ["Dispepsia funcional (Roma)", "Dispepsia sem alarme", "DRGE como abordagem inicial"],
    campos: [
      { id: "ibp", l: "IBP usado (dose e tempo)", t: "text" },
      { id: "alarme", l: "Sinais de alarme presentes", t: "text" },
    ],
  },
  {
    id: "tcsem", nome: "Tomografia SEM contraste", cat: "Exame", sis: "SISREG",
    proc: "GRUPO DIAGNÓSTICO POR TOMOGRAFIA – SEM CONTRASTE", reg: "Descentralizada (qualquer médico regulador)", base: "exame",
    info: ["Executantes: UPAs Cidade de Deus, Madureira, Rocinha; CF Adib Jatene; CF Otto Alves de Carvalho; Policlínicas Lincoln de Freitas Filho, PAM Bangu, Rodolpho Rocco; CMS Belizário Penna; CMS Harvey Ribeiro."],
    crit: [["r", "Suspeita de neoplasia / lesão grave"], ["y", "Prioritário"], ["g", "Pode aguardar"], ["b", "Não prioritário"]],
    campos: [
      { id: "regiao", l: "Região a examinar", t: "text", req: true, ph: "Ex.: crânio, tórax, abdome total" },
    ],
  },
  {
    id: "tccom", nome: "TC / RM COM contraste", cat: "Exame", sis: "SISREG",
    proc: "TC ou RM com contraste (procedimento específico)", reg: "EXCLUSIVA da Central — se autorizada pela unidade será cancelada", base: "exame",
    info: ["Informar função renal e alergias."],
    crit: [["r", "Suspeita de neoplasia / lesão grave"], ["y", "Prioritário"], ["g", "Pode aguardar"], ["b", "Não prioritário"]],
    campos: [
      { id: "regiao", l: "Exame e região", t: "text", req: true },
      { id: "creat", l: "Creatinina (data)", t: "text", req: true },
      { id: "alergia", l: "Alergia a contraste", t: "sel", req: true, o: ["", "Não", "Sim", "Desconhece"] },
    ],
  },
  {
    id: "rmsed", nome: "Ressonância COM sedação", cat: "Exame", sis: "SISREG",
    proc: "GRUPO – RESSONÂNCIA MAGNÉTICA – ALTA COMPLEXIDADE – SEDAÇÃO", reg: "Centralizada (CCDTI)", base: "exame",
    info: ["Sedação só para > 2 anos. Fluxo por e-mail aos NIR encerrado."],
    crit: [["r", "Suspeita de lesão grave"], ["y", "Prioritário"], ["g", "Pode aguardar"]],
    campos: [
      { id: "regiao", l: "Região", t: "text", req: true },
      { id: "motivosed", l: "Motivo da sedação (TEA, claustrofobia, criança...)", t: "text", req: true },
    ],
  },
  {
    id: "biopmama", nome: "Biópsia de mama – lesão palpável", cat: "Exame", sis: "SISREG",
    proc: "Biópsia de Mama – Lesão Palpável", reg: "Central (prioriza graves; NIR/CAP qualificam)", base: "exame",
    crit: [
      ["r", "Nódulo endurecido e fixo (qualquer idade)"],
      ["r", "Nódulo persistente > 1 ciclo em > 30 anos ou pós-menopausa"],
      ["r", "Alteração unilateral de pele (eczema, casca de laranja, retração, distorção do mamilo)"],
      ["r", "Descarga papilar sanguinolenta unilateral espontânea"],
      ["r", "BI-RADS 4, 5 ou 6"],
      ["r", "BI-RADS 0 reclassificado 4–5 após USG"],
      ["y", "BI-RADS 3 com progressão"],
      ["y", "Alto risco / história de câncer de mama com nódulo"],
    ],
    campos: [
      { id: "ecm", l: "Exame clínico das mamas (lado, quadrante, tamanho)", t: "area", req: true },
      { id: "birads", l: "MMG/USG — BI-RADS e data", t: "text", req: true },
    ],
  },
  {
    id: "biopusg", nome: "Biópsia de mama guiada por USG", cat: "Exame", sis: "SISREG",
    proc: "Biópsia de Mama Guiada por USG", reg: "Central", base: "exame",
    info: ["Lesão impalpável BI-RADS 4/5 VISÍVEL à USG. Se só visível na mamografia → Mastologia Oncológica (SER)."],
    crit: [["r", "BI-RADS 4"], ["r", "BI-RADS 5"]],
    campos: [
      { id: "birads", l: "USG — BI-RADS, lado, localização, tamanho, data", t: "text", req: true },
    ],
  },
  {
    id: "biopgang", nome: "Biópsia de gânglio", cat: "Exame", sis: "SISREG",
    proc: "Biópsia de Gânglio", reg: "Central", base: "exame",
    info: ["Imagem fortemente suspeita em região cervical. HMK não faz cadeia profunda nem inguinal."],
    crit: [["r", "Linfonodo cervical com imagem fortemente suspeita"]],
    campos: [
      { id: "img", l: "Imagem (USG/TC) — tamanho, características, data", t: "text", req: true },
    ],
  },
  {
    id: "tan", nome: "Teste da orelhinha (EOA)", cat: "Exame", sis: "SISREG",
    proc: "Emissões Otoacústicas (Teste da Orelhinha)", reg: "NIR (centralizada)", base: "exame",
    info: ["Só RN ≤ 30 dias nascido fora da rede municipal sem TAN. > 30 dias com IRDA → Reabilitação Auditiva."],
    crit: [["y", "RN ≤ 30 dias sem triagem auditiva"]],
    campos: [
      { id: "diasvida", l: "Dias de vida", t: "num", req: true },
      { id: "irda", l: "Indicadores de risco (IRDA)", t: "text" },
    ],
  },
  {
    id: "imgsimples", nome: "Exame de imagem simples (USG, Rx, MMG, ECG)", cat: "Exame", sis: "SISREG",
    proc: "Selecionar o procedimento específico (configurados como 1ª vez: ECG, mamografia bilateral, USG obstétrica/pélvica/aparelho urinário/partes moles, Rx simples...)",
    reg: "RT médico da unidade", base: "exame",
    info: ["Nomenclaturas antigas: USG axila/pescoço → partes moles; hipocôndrio D → abdome superior; próstata transretal → via abdominal; Doppler mamas → USG mamas bilateral.",
      "Mamografia de rastreio ≤ 30 dias; diagnóstica ≤ 5 dias (Carteira)."],
    crit: [["r", "Suspeita de neoplasia / lesão grave"], ["y", "Prioritário"], ["g", "Pode aguardar"], ["b", "Rotina / rastreio"]],
    campos: [
      { id: "exame", l: "Exame solicitado", t: "text", req: true },
    ],
  },
  // ============================ HEMATOLOGIA ============================
  {
    id: "hemato", nome: "Hematologia", cat: "Consulta", sis: "SISREG",
    proc: "Consulta em Hematologia", reg: "EXCLUSIVA dos reguladores do Hemorio (RT da APS só nega/devolve)", base: "consulta",
    info: ["Manejo na APS: ferropriva, anemia de doença crônica, leucopenia isolada com neutrófilos > 1.200, plaquetas > 100 mil estáveis.",
      "Não há referência municipal para trombofilia."],
    crit: [
      ["r", "Até 7 dias: blastos com anemia/plaquetopenia graves"],
      ["r", "Até 7 dias: leucocitose > 100 mil com desvio sem infecção / > 120 mil com linfocitose"],
      ["r", "Até 7 dias: neutrófilos < 500 com Hb < 9 e/ou plaq < 50 mil"],
      ["r", "Até 7 dias: plaquetas < 50 mil com sangramento mucocutâneo"],
      ["r", "Até 15 dias: anemia + dor óssea ± IRA + pico monoclonal"],
      ["r", "Até 15 dias: Ht ≥ 60% (H) / ≥ 55% (M) sintomático sem trombose"],
      ["r", "Até 15 dias: plaquetas 30–50 mil sem sangramento mucoso"],
      ["r", "Até 15 dias: leucocitose 50–99 mil com desvio / linfocitose até 100 mil"],
      ["r", "Até 15 dias: esplenomegalia com emagrecimento / adenomegalia com sintomas B"],
      ["y", "Hb < 9 com VCM > 100 oligossintomático"],
      ["y", "Anemia normo-normo 7–9 com doenças crônicas excluídas"],
      ["y", "Suspeita de mieloma sem dor"],
      ["y", "Leucocitose 20–50 mil com desvio"],
      ["y", "Trombocitose sem trombose (reativas excluídas)"],
      ["y", "Ht 55–60% (H) / 50–55% (M)"],
      ["y", "Leucopenia < 2.000 com neutrófilos 800–1.000"],
      ["g", "Plaquetas 50–100 mil persistentes (2 exames/30 dias)"],
      ["g", "Leucopenia ≤ 2.000 / neutrófilos 1.000–1.200 persistente"],
      ["g", "Eritrocitose isolada (3 exames)"],
      ["g", "Trombocitose > 500 mil isolada (3 exames)"],
      ["g", "Adenomegalia sem sintomas / pico monoclonal isolado"],
      ["e", "Leuco > 100 mil com blastos; neutropenia febril; púrpura com plaq < 15 mil; Hb ≤ 6 sintomática; adenomegalia compressiva"],
    ],
    nao: ["Anemia ferropriva", "Anemia de doença crônica", "Leucopenia com neutrófilos > 1.200", "Plaquetas > 100 mil estáveis"],
    campos: [
      { id: "hemo1", l: "Hemograma atual completo (data)", t: "area", req: true },
      { id: "hemo2", l: "Hemograma anterior para comparação (data)", t: "area" },
      { id: "cinetica", l: "Ferritina, B12, folato, reticulócitos, LDH", t: "text" },
      { id: "sorol", l: "Sorologias (HIV, HBV, HCV, sífilis)", t: "text" },
      { id: "visc", l: "Esplenomegalia / adenomegalias", t: "text" },
    ],
  },
  // ============================ SER ============================
  {
    id: "mastoonc", nome: "Mastologia Oncológica – lesão impalpável", cat: "SER", sis: "SER",
    proc: "Mastologia Oncológica – Lesão Impalpável", reg: "SER", base: "exame",
    info: ["BI-RADS 4/5 visível SÓ na mamografia (se visível à USG → biópsia guiada por USG no SISREG)."],
    crit: [["r", "BI-RADS 4 só na mamografia"], ["r", "BI-RADS 5 só na mamografia"]],
    campos: [
      { id: "mmg", l: "Mamografia — BI-RADS, lado, achado, data", t: "text", req: true },
      { id: "usg", l: "USG complementar sem correspondência (data)", t: "text", req: true },
    ],
  },
  {
    id: "implante", nome: "Implante coclear", cat: "SER", sis: "SER",
    proc: "Implante Coclear (com ficha de cadastro)", reg: "SER", base: "exame",
    info: ["Fluxo: APS detecta → avaliação auditiva → CER auditivo / serviço de saúde auditiva → SER com ficha de cadastro."],
    crit: [
      ["n", "Pré-lingual até 4 anos"], ["n", "Pós-lingual (qualquer idade)"],
      ["n", "Perda neurossensorial severa/profunda bilateral"], ["n", "≤ 50% de reconhecimento de sentenças com AASI"],
    ],
    campos: [{ id: "audio", l: "Audiometria / avaliação auditiva", t: "area", req: true }],
  },
  {
    id: "fav", nome: "Fístula AV para hemodiálise", cat: "SER", sis: "SER",
    proc: "Confecção de Fístula Arteriovenosa", reg: "SER (IECAC internados; Policlínica Piquet Carneiro ambulatoriais)", base: "exame",
    crit: [["r", "DRC com indicação de hemodiálise"]],
    campos: [{ id: "creat", l: "Creatinina / TFG e situação dialítica", t: "text", req: true }],
  },
  {
    id: "eeg", nome: "Eletroencefalograma (EEG)", cat: "SER", sis: "SER",
    proc: "Eletroencefalograma", reg: "SER (migrou em 2021)", base: "exame",
    crit: [["y", "Suspeita de epilepsia / crises recorrentes"], ["g", "Seguimento de epilepsia"]],
    campos: [{ id: "crises", l: "Descrição e frequência das crises", t: "area", req: true }],
  },
  {
    id: "seroutros", nome: "Outros do SER (genética, nutrologia infantil, elastografia, teste do suor, neuromusculares)", cat: "SER", sis: "SER",
    proc: "Selecionar o procedimento no SER", reg: "SER", base: "consulta",
    info: ["Migrados ao SER (CIB 95/2022): Endócrino – genitália ambígua; Genética médica (e pediátrica); Nutrologia infantil; Elastografia hepática transitória; Teste do suor. Doenças neuromusculares também."],
    crit: [],
    campos: [{ id: "proc", l: "Procedimento", t: "text", req: true }],
  },

  // ============ OBESIDADE (Programa de Controle da Obesidade, SMS-Rio 03/2026) ============
  {
    id: "ceom", nome: "Obesidade grave – CEOM (semaglutida)", cat: "Consulta", sis: "SISREG",
    proc: "Atendimento Multiprofissional – Obesidade Grave (código interno 2018703)", reg: "Regulação Ambulatorial (prioridade pode ser ajustada)", base: "consulta",
    info: ["Elegível só quem cumpre os 3 critérios AO MESMO TEMPO: IMC ≥ 40 + DM com CID ativo em tratamento + cadastro definitivo na APS há ≥ 6 meses.",
      "Encaminhar só após manejo estruturado na APS com registro de orientação da eMulti (nutrição + atividade física).",
      "O encaminhamento não garante semaglutida — a elegibilidade é definida no CEOM. Na implantação, prioridade para vulneráveis com CadÚnico.",
      "O resumo do próprio documento cita também IMC 35–39,9 com comorbidade descompensada e 6 meses de manejo, mas a seção de critérios oficiais exige IMC ≥ 40 — confirme com a CAP."],
    crit: [
      ["r", "DM2 sem controle glicêmico adequado apesar de ajuste terapêutico"],
      ["r", "Doença cardiovascular estabelecida"],
      ["y", "Risco cardiovascular global elevado"],
      ["y", "Multimorbidades descompensadas associadas à obesidade"],
      ["y", "Apneia obstrutiva do sono moderada ou grave"],
      ["y", "Situação de vulnerabilidade (CadÚnico)"],
      ["g", "Elegível, sem critério de gravidade adicional"],
    ],
    nao: ["Gestantes, lactantes ou planejando gestação", "Sem acompanhamento regular na APS", "Sem registro de orientação da eMulti",
      "Sem IMC atualizado / documentação mínima", "Câncer ativo ou histórico relevante (seguir com UNACON/CACON + APS)"],
    campos: [
      { id: "peso", l: "Peso, altura e IMC atuais", t: "text", req: true, ph: "Ex.: 118 kg, 1,62 m, IMC 45,0" },
      { id: "ca", l: "Circunferência abdominal", t: "text" },
      { id: "dmcid", l: "DM com CID ativo no prontuário e em tratamento medicamentoso", t: "chk", req: true },
      { id: "vinculo", l: "Cadastro definitivo na APS há ≥ 6 meses", t: "chk", req: true },
      { id: "emulti", l: "Orientação nutricional e de atividade física da eMulti registrada", t: "chk", req: true },
      { id: "hba1c", l: "HbA1c / glicemias (com datas)", t: "text", req: true },
      { id: "hf", l: "História familiar", t: "text" },
      { id: "complic", l: "Complicações da obesidade (apneia, osteoartrite, DCV...)", t: "text" },
      { id: "cirurgias", l: "Cirurgias prévias", t: "text" },
      { id: "aguardando", l: "Exames solicitados aguardando realização", t: "text" },
    ],
  },
  {
    id: "bariatrica", nome: "Cirurgia bariátrica", cat: "SER", sis: "SER",
    proc: "Cirurgia Bariátrica (SER)", reg: "SER (serviços de alta complexidade com critérios próprios)", base: "consulta", cir: true,
    info: ["Idade 18–65 anos (16–18 com consolidação das epífises comprovada).",
      "IMC 35–39,9: anexar laudo do endocrinologista afastando causa endócrina (ou doença endócrina estabilizada).",
      "Exclusão: obesidade por doença endócrina; incapacidade de compreender o tratamento; sem suporte familiar; uso de álcool/drogas, psicose grave, bulimia ou tentativa de suicídio recente."],
    crit: [
      ["n", "IMC ≥ 40 sem comorbidades, sem resposta a tratamento conservador por ≥ 2 anos em serviço habilitado"],
      ["n", "IMC ≥ 40 com comorbidades que ameaçam a vida"],
      ["n", "IMC 35–39,9 com doenças crônicas desencadeadas ou agravadas pela obesidade"],
    ],
    campos: [
      { id: "peso", l: "Peso, altura e IMC atuais", t: "text", req: true },
      { id: "labs", l: "Hemograma com plaquetas, coagulograma, ureia, creatinina, glicemia, HbA1c, ácido úrico, T3L, T4L, T3, TSH, CT, HDL, TG", t: "area", req: true },
      { id: "laudoendo", l: "Laudo do endocrinologista (obrigatório se IMC 35–39,9)", t: "text" },
      { id: "suporte", l: "Suporte familiar presente", t: "chk", req: true },
    ],
  },
  // ============ ENFERMAGEM (Manual 2026, Anexo 2) ============
  {
    id: "rxtb", nome: "Rx de tórax – tuberculose", cat: "Exame", sis: "SISREG", enf: true,
    proc: "Tórax (PA) / Tórax (PA + Perfil)", reg: "RT médico da unidade", base: "exame",
    crit: [["y", "Usuário com tuberculose (diagnóstico/seguimento)"], ["y", "Avaliação de contato de TB"]],
    campos: [{ id: "baar", l: "Baciloscopia / TRM-TB (data e resultado)", t: "text" }],
  },
  {
    id: "escarro", nome: "Teste de escarro induzido", cat: "Exame", sis: "SISREG", enf: true,
    proc: "Teste de Escarro Induzido", reg: "Somente reserva", base: "exame",
    info: ["Boa evolução clínica e radiológica sem expectoração não precisa de escarro induzido para encerrar o caso."],
    crit: [
      ["y", "Forte suspeita clínico-radiológica de TB pulmonar sem expectoração espontânea"],
      ["y", "Em tratamento, sem expectoração, com evolução desfavorável (TRM-TB, BAAR, cultura, TSA)"],
    ],
    campos: [{ id: "rx", l: "Rx de tórax (data e laudo)", t: "text", req: true }],
  },
  {
    id: "hepb", nome: "Hepatologia – hepatite B crônica", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Consulta em Hepatologia – Hepatite Crônica B", reg: "RT médico da unidade", base: "consulta",
    crit: [["y", "HBsAg reagente e anti-HBc total não reagente"], ["y", "HBsAg reagente, anti-HBc total reagente e anti-HBc IgM não reagente"]],
    campos: [{ id: "sorol", l: "TR / HBsAg, anti-HBc total, anti-HBc IgM (datas)", t: "text", req: true },
      { id: "lab", l: "TGO/TGP, plaquetas, outros", t: "text" }],
  },
  {
    id: "hepc", nome: "Hepatologia – hepatite C crônica", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Consulta em Hepatologia – Hepatite Crônica C", reg: "RT médico da unidade", base: "consulta",
    crit: [["y", "TR para hepatite C reagente confirmado por carga viral"]],
    campos: [{ id: "cv", l: "Carga viral HCV (data e resultado)", t: "text", req: true },
      { id: "lab", l: "TGO/TGP, plaquetas, outros", t: "text" }],
  },
  {
    id: "hepgest", nome: "Hepatologia – gestante com hepatite viral", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Consulta em Hepatologia – Gestantes com Hepatites Virais", reg: "RT médico da unidade", base: "consulta",
    crit: [["r", "Gestante com TR reagente para hepatite B (qualquer IG)"], ["r", "Gestante com TR reagente para hepatite C (na gestação ou antes)"]],
    campos: [{ id: "ig", l: "Idade gestacional", t: "text", req: true }, { id: "sorol", l: "Testes e sorologias (datas)", t: "text", req: true }],
  },
  {
    id: "infectoped", nome: "Infectologia pediátrica (exposição vertical)", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Consulta em Infectologia – Pediatria (ou Pediatria – HIV/AIDS)", reg: "RT médico da unidade", base: "consulta",
    crit: [["y", "Criança exposta a HBV ou HCV (mãe com hepatite viral)"], ["y", "Criança exposta ao HIV"]],
    campos: [{ id: "materno", l: "Situação materna (vírus, tratamento, carga viral)", t: "text", req: true }],
  },
  {
    id: "usgobst", nome: "USG obstétrica (pré-natal de risco habitual)", cat: "Exame", sis: "SISREG", enf: true,
    proc: "Ultrassonografia Obstétrica (transvaginal ou pélvica)", reg: "RT médico da unidade", base: "exame",
    info: ["Não há indicação de USG de 1º trimestre de rotina para IG ou translucência nucal. Sem indicação específica, não há motivo para USG após 24 semanas."],
    crit: [["y", "Discrepância entre IG e exame físico"], ["y", "DUM desconhecida ou incerta"]],
    campos: [{ id: "ig", l: "IG pela DUM / AU", t: "text", req: true }],
  },
  {
    id: "mmgrastreio", nome: "Mamografia de rastreio", cat: "Exame", sis: "SISREG", enf: true,
    proc: "Mamografia Bilateral (para rastreamento)", reg: "Regulação imediata (agendada no ato)", base: "exame",
    info: ["Não é recomendado rastreio por outro método de imagem, mesmo fora da faixa etária."],
    crit: [
      ["b", "Rastreio bienal, 50 a 69 anos"],
      ["g", "Alto risco ≥ 35 anos: parente de 1º grau com CA de mama < 50 anos, bilateral, ou CA de ovário"],
      ["g", "Alto risco: história familiar de CA de mama masculino"],
      ["g", "Alto risco: lesão proliferativa com atipia ou neoplasia lobular in situ"],
      ["g", "Alto risco: história pessoal de CA de mama"],
    ],
    campos: [{ id: "ultima", l: "Última mamografia (data e BI-RADS)", t: "text" }],
  },
  {
    id: "mmgbirads3", nome: "Mamografia – controle BI-RADS 3", cat: "Exame", sis: "SISREG", enf: true,
    proc: "Mamografia", reg: "RT médico da unidade", base: "exame",
    info: ["Controle por 3 anos: semestral no 1º ano, anual no 2º e 3º. Estável → volta à rotina; alterou → compartilhar com o médico."],
    crit: [["g", "BI-RADS 3 em controle radiológico"]],
    campos: [{ id: "birads", l: "Mamografia de origem (data, BI-RADS, achado)", t: "text", req: true },
      { id: "etapa", l: "Etapa do controle", t: "sel", o: ["", "6 meses", "12 meses", "24 meses", "36 meses"] }],
  },
  {
    id: "colpo", nome: "Ginecologia – patologia cervical (colposcopia)", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Consulta em Ginecologia – Patologia Cervical", reg: "RT médico da unidade", base: "exame",
    info: ["Conduta conforme Diretrizes Brasileiras para Rastreamento do Câncer do Colo do Útero (MS/INCA)."],
    crit: [["r", "HSIL / AGC / AIS / suspeita de carcinoma"], ["y", "ASC-H"], ["y", "LSIL ou ASC-US persistente conforme diretriz"]],
    campos: [{ id: "cito", l: "Citopatológico (data e resultado)", t: "text", req: true },
      { id: "anteriores", l: "Citopatológicos anteriores", t: "text" }],
  },
  {
    id: "diu", nome: "Ginecologia – DIU", cat: "Procedimento", sis: "SISREG", enf: true,
    proc: "Consulta em Ginecologia – DIU", reg: "RT médico da unidade", base: "exame",
    info: ["A inserção de DIU é ação estratégica da APS — encaminhar se a unidade não oferta."],
    crit: [["g", "Elegível para DIU de cobre (adolescente ou adulta)"]],
    campos: [{ id: "dum", l: "DUM / método atual", t: "text" }],
  },
  {
    id: "laqueadura", nome: "Laqueadura", cat: "Procedimento", sis: "SISREG", enf: true, cir: true,
    proc: "Consulta em Ginecologia – Laqueadura", reg: "RT médico da unidade", base: "exame",
    info: ["Critério: > 25 anos ou ≥ 2 filhos vivos. O manual pede “Passaporte” e risco cirúrgico feito pelo médico."],
    crit: [["g", "Idade > 25 anos"], ["g", "Pelo menos 2 filhos vivos"]],
    campos: [{ id: "filhos", l: "Nº de filhos vivos", t: "num", req: true }, { id: "risco", l: "Risco cirúrgico realizado", t: "chk", req: true }],
  },
  {
    id: "vasectomia", nome: "Vasectomia", cat: "Procedimento", sis: "SISREG", enf: true, cir: true,
    proc: "Consulta em Urologia – Vasectomia", reg: "RT médico da unidade", base: "exame",
    info: ["Critério: > 25 anos ou ≥ 2 filhos vivos. O manual pede “Passaporte” e risco cirúrgico feito pelo médico."],
    crit: [["g", "Idade > 25 anos"], ["g", "Pelo menos 2 filhos vivos"]],
    campos: [{ id: "filhos", l: "Nº de filhos vivos", t: "num", req: true }, { id: "risco", l: "Risco cirúrgico realizado", t: "chk", req: true }],
  },
  {
    id: "pediabetico", nome: "Pé diabético (Enfermagem especializada / TO)", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Consulta de Enfermagem na Atenção Especializada – Pé Diabético / Consulta em Terapia Ocupacional", reg: "RT médico da unidade", base: "exame",
    info: ["Não recebe doença arterial com indicação de intervenção vascular."],
    crit: [["y", "Wagner grau 2"], ["y", "Wagner grau 3 / 3a"], ["y", "Pós-amputação com deiscência de sutura"]],
    campos: [{ id: "lesao", l: "Descrição da lesão (local, tamanho, aspecto)", t: "area", req: true },
      { id: "pulsos", l: "Pulsos pediosos / tibiais", t: "text", req: true }],
  },
  {
    id: "lesaopele", nome: "Lesões de pele / curativo (Enfermagem especializada)", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Consulta de Enfermagem na AE – Avaliação de Lesões de Pele  OU  – Curativo Grau II", reg: "RT médico da unidade", base: "exame",
    info: ["Curativo grau II: úlcera venosa, queimadura grau I–II sem sedação, lesão por pressão, neuropática, maligna, deiscência.",
      "Avaliação de lesões de pele: refratária às coberturas da rede com boa adesão (NÃO recebe os tipos do curativo grau II).",
      "Exclusão de ambos: úlcera arterial, infecção sistêmica, dermatite atópica, impetigo, pênfigo, queimadura grau III, lesão maligna sem oncologia, psoríase, alergia a tratamentos prévios."],
    crit: [["y", "Curativo grau II (tipos listados acima)"], ["g", "Lesão refratária às coberturas disponíveis, com adesão adequada"]],
    campos: [{ id: "lesao", l: "Tipo e descrição da lesão", t: "area", req: true },
      { id: "coberturas", l: "Coberturas usadas e tempo", t: "text", req: true }],
  },
  {
    id: "incont", nome: "Incontinência urinária e/ou anal (Enfermagem)", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Consulta de Enfermagem – Incontinência Urinária e/ou Anal", reg: "RT médico da unidade", base: "exame",
    info: ["Não recebe prolapso > 2º grau, ITU ou IST ativa, tumores. Não dispensa cateter para cateterismo intermitente."],
    crit: [["b", "Incontinência de esforço"], ["b", "Incontinência de urgência"], ["b", "Incontinência mista / bexiga neurogênica"]],
    campos: [{ id: "eas", l: "EAS / urocultura recente", t: "text" }],
  },
  {
    id: "estomas", nome: "Gastrostomia / nefrostomia / traqueostomia (Enfermagem)", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Consulta em Enfermagem – Gastrostomia | – Nefrostomia | – Traqueostomia", reg: "RT médico da unidade", base: "exame",
    info: ["Só 1ª vez. Não faz procedimento cirúrgico, não troca botton, não dispensa equipamentos/coletores."],
    crit: [["y", "Estoma com complicação"], ["g", "Estoma sem complicação"]],
    campos: [{ id: "tipoest", l: "Tipo de estoma", t: "sel", req: true, o: ["", "Gastrostomia", "Nefrostomia", "Traqueostomia"] },
      { id: "situacao", l: "Situação do estoma / complicação", t: "text" }],
  },
  {
    id: "reabintel", nome: "Reabilitação intelectual – Pediatria", cat: "Consulta", sis: "SISREG", enf: true,
    proc: "Reabilitação Intelectual – Pediatria", reg: "RT médico da unidade", base: "consulta",
    info: ["Não precisa de laudo conclusivo — diagnóstico feito pelo CER com APS/eMulti/saúde mental (PTS).",
      "Transtornos mentais (bipolar, depressão, dissociativos, estresse) → Saúde Mental."],
    crit: [["y", "Suspeita de alteração do DNPM e da interação social"], ["y", "Atraso de linguagem com outros sintomas de transtorno global do desenvolvimento"]],
    campos: [{ id: "dnpm", l: "Marcos do desenvolvimento / achados", t: "area", req: true }],
  },
  // ============ FLUXOS ESPECIAIS (fora da tela do SISREG) ============
  {
    id: "apoionir", nome: "Caso grave sem vaga – apoio do NIR (e-mail)", cat: "Fluxo", sis: "SISREG",
    proc: "Pedido de apoio para agendamento", reg: "NIR da CAP → Complexo Regulador", base: "consulta",
    email: { para: "[e-mail do NIR da sua CAP]", assunto: "Apoio para agendamento — caso grave ambulatorial" },
    info: ["Primeiro insira o pedido no SISREG (de preferência VERMELHO); depois envie este e-mail com o código.",
      "Os campos de identificação saem como [colchetes] para você preencher fora do app."],
    crit: [["r", "Caso grave ambulatorial sem vaga disponível"]],
    campos: [{ id: "cap", l: "CAP da unidade", t: "sel", req: true, o: ["", "CAP 1.0 — nircap10@gmail.com", "CAP 2.1 — nircap21@gmail.com", "CAP 2.2 — nircap22@gmail.com", "CAP 3.1 — nircap31@gmail.com", "CAP 4.0 — nircap40@gmail.com", "CAP 5.1 — regulacao.cap51@gmail.com", "CAP 5.2 — regulacaocap52@gmail.com", "CAP 5.3 — nircap53@gmail.com"] },
      { id: "codigo", l: "Código da solicitação no SISREG", t: "text", req: true },
      { id: "proc", l: "Consulta/exame pleiteado", t: "text", req: true },
      { id: "porque", l: "Por que deve ser priorizado", t: "area", req: true }],
  },
  {
    id: "internacao", nome: "Internação eletiva (e-mail)", cat: "Fluxo", sis: "SISREG",
    proc: "Solicitação de internação eletiva", reg: "Central de Regulação de Internações — (21) 3806-0700 ramal 264, 8–17h", base: "consulta",
    email: { para: "regulacaoaps@regulacaoriorj.com.br (cópia: NIR da CAP e/ou RT médico da CAP; se e-mail pessoal, copiar e-mail da unidade/gerente)", assunto: "Solicitação de internação eletiva" },
    info: ["Anexar o Formulário de Internação Eletiva (Anexo 8 do Manual) totalmente preenchido.", "Informar pelo menos 2 telefones ativos do solicitante."],
    crit: [],
    campos: [{ id: "proc", l: "Procedimento / motivo da internação", t: "text", req: true }],
  },
  {
    id: "trs", nome: "Terapia renal substitutiva / hemodiálise (e-mail)", cat: "Fluxo", sis: "SISREG",
    proc: "Solicitação de TRS", reg: "Central de Regulação Ambulatorial → sistema TRS/SES", base: "consulta",
    email: { para: "trs-cr@regulacaoriorj.com.br — (21) 3806-0700, opção 3, ramal 214", assunto: "Solicitação de TRS / hemodiálise" },
    info: ["Exige laudo de NEFROLOGISTA, FAV funcionante, USG Doppler arterial, exames laboratoriais e sorológicos atuais e o formulário TRS (minhasaudeRio → TRS/Diálise) assinado e carimbado pelo nefrologista.",
      "Urgência dialítica: inserida pela unidade hospitalar/pré-hospitalar, não pela APS."],
    crit: [],
    campos: [{ id: "laudo", l: "Laudo do nefrologista (resumo)", t: "area", req: true },
      { id: "fav", l: "FAV funcionante", t: "chk", req: true },
      { id: "doppler", l: "USG Doppler arterial", t: "text", req: true },
      { id: "sorol", l: "Laboratório e sorologias atuais", t: "area", req: true }],
  },
  {
    id: "cancerinfantil", nome: "Suspeita de câncer infantojuvenil (Unidos pela Cura)", cat: "Fluxo", sis: "SISREG",
    proc: "Unidos pela Cura — NÃO é pelo SISREG", reg: "Profissional da CAP designado (por telefone)", base: "consulta",
    info: ["0 a 18 anos. Não precisa de biópsia. Agendamento em até 72 h.",
      "Ligar para o responsável da CAP com os pais/responsáveis presentes; depois preencher o cartão de agendamento e entregar à família.",
      "INCA: triagem aberta de livre demanda, terça a quinta, 7h às 13h."],
    crit: [["r", "Suspeita de câncer em criança/adolescente"]],
    campos: [],
  },
  {
    id: "outro", nome: "Outro procedimento (formulário genérico)", cat: "Consulta", sis: "SISREG",
    proc: "(informar)", reg: "RT médico da unidade", base: "consulta",
    crit: [["r", "Situação grave / prioritária"], ["y", "Prioritário"], ["g", "Pode aguardar"], ["b", "Não prioritário"]],
    campos: [{ id: "proc", l: "Procedimento / especialidade", t: "text", req: true }],
  },
];

/* Campos comuns, inseridos antes dos campos específicos */
const BASES = {
  // Manual de Regulação Ambulatorial 2026, 6.1 — descrição mínima obrigatória de todo pedido
  consulta: [
    { id: "idade", l: "Idade", t: "text", req: true, ph: "Ex.: 64 anos / 8 meses" },
    { id: "sexo", l: "Sexo", t: "sel", req: true, o: ["", "feminino", "masculino"] },
    { id: "quadro", l: "Anamnese / justificativa clínica atualizada", t: "area", req: true },
    { id: "tempo", l: "Tempo de evolução", t: "text", req: true, ph: "Ex.: 8 meses, piora há 2 semanas" },
    { id: "comorb", l: "Comorbidades", t: "text" },
    { id: "meds", l: "Medicações em uso (com posologia)", t: "text" },
    { id: "ef", l: "Exame físico compatível com a hipótese", t: "area", req: true },
    { id: "exames", l: "Exames complementares com datas", t: "area", req: true, ph: "Se não houver, escreva: sem exames prévios" },
    { id: "escores", l: "Escores relevantes (IMC, risco CV global, TFG...)", t: "text" },
    { id: "conduta", l: "Conduta adotada, tratamentos prévios e resultado", t: "area", req: true },
    { id: "hd", l: "Hipótese diagnóstica", t: "text", req: true },
    { id: "cid", l: "CID-10", t: "text" },
    { id: "motivo", l: "Objetivo do encaminhamento (o que se espera)", t: "area", req: true },
  ],
  exame: [
    { id: "idade", l: "Idade", t: "text", req: true },
    { id: "sexo", l: "Sexo", t: "sel", req: true, o: ["", "feminino", "masculino"] },
    { id: "quadro", l: "Quadro clínico / indicação", t: "area", req: true },
    { id: "tempo", l: "Tempo de evolução", t: "text" },
    { id: "comorb", l: "Comorbidades", t: "text" },
    { id: "ef", l: "Exame físico pertinente", t: "area" },
    { id: "exames", l: "Exames prévios com datas", t: "area" },
    { id: "hd", l: "Hipótese diagnóstica", t: "text", req: true },
    { id: "cid", l: "CID-10", t: "text" },
    { id: "motivo", l: "Pergunta clínica que o exame deve responder", t: "area", req: true },
  ],
};


/* ===== Protocolos de Regulação Ambulatorial SMS-Rio (2023–2025) — protocolos.js =====
   Cada protocolo substitui os itens antigos (Protocolo do Regulador 2015) do mesmo procedimento.
   Campos específicos dos itens antigos (vindos dos avisos/Manual) são preservados.
   [idNovo, idAntigo, manterObrigatorios, manterAvisos] */
const SUBSTITUI = [
  ["p_cardiologia", "cardio", false, false], ["p_angiologia", "vascular", false, false],
  ["p_neurologia", "neuro", false, true], ["p_endocrinologia", "endocrino", false, false],
  ["p_reumatologia", "reumato", false, false], ["p_ortopedia", "orto", false, false],
  ["p_otorrinolaring0", "orl", false, true], ["p_psiq", "psiq", false, true],
  ["p_urologia", "uro", false, true], ["p_litiase", "litiase", true, true],
  ["p_vasectomia", "vasectomia", false, false], ["p_cirurgiageralp", "cirgeral", false, false],
  ["p_catarata", "catarata", true, true], ["p_programadeaten", "padi", true, true],
  ["CIRURGICA_GINECO", "gineco", false, false],
];
function _porNome(n) { return PROTOCOLOS.find((p) => p.nome === n); }
const SUBST_NOME = [
  ["Ginecologia — Histeroscopia Diagnóstica", "histero", false, true],
  ["Mastologia", "masto", false, true],
  ["Biópsia de Mama — Lesão Palpável", "biopmama", false, false],
  ["Biópsia de Mama Guiada por US", "biopusg", false, true],
  ["Biópsia de Gânglio Linfático", "biopgang", false, true],
  ["Mastologia (Oncologia – SER)", "mastoonc", false, true],
  ["Colonoscopia", "colono", false, true],
  ["Endoscopia Digestiva Alta", "eda", false, true],
  ["Ginecologia — Patologia Cervical", "colpo", false, true],
  ["Ginecologia — DIU", "diu", false, true],
  ["Ginecologia — Laqueadura", "laqueadura", false, false],
  ["Mamografia Bilateral", "mmgrastreio", false, true],
  ["Reabilitação Auditiva", "audit", false, true],
  ["Reabilitação Intelectual e Reabilitação Intelectual Pediatria", "reabintel", false, true],
  ["Avaliação do Paciente Ostomizado", "ostomia", true, true],
  ["Reabilitação — Prescrição de Órteses e Próteses e Materiais Especiais", "orteses", false, true],
  ["Reabilitação PÓS-COVID", "poscovid", true, true],
];
(function integrar() {
  const pares = SUBSTITUI.filter((s) => s[0] !== "CIRURGICA_GINECO").map((s) => [PROTOCOLOS.find((p) => p.id === s[0]), ...s.slice(1)])
    .concat(SUBST_NOME.map((s) => [_porNome(s[0]), ...s.slice(1)]));
  const remover = new Set(["gineco"]);
  for (const [novo, antigoId, manterReq, manterInfo] of pares) {
    const antigo = CATALOGO.find((i) => i.id === antigoId);
    if (!novo || !antigo) { if (typeof console !== "undefined") console.warn("integração: não achei", antigoId); continue; }
    const ids = new Set((novo.campos || []).map((f) => f.id));
    for (const f of antigo.campos || []) if (!ids.has(f.id)) novo.campos.push(manterReq ? f : { ...f, req: false });
    if (manterInfo && antigo.info) novo.info = [...(novo.info || []), ...antigo.info];
    if (antigo.enf) novo.enf = true;
    if (antigo.cir) novo.cir = true;
    if (manterInfo && antigo.reg) novo.reg = antigo.reg;
    remover.add(antigoId);
  }
  for (let k = CATALOGO.length - 1; k >= 0; k--) if (remover.has(CATALOGO[k].id)) CATALOGO.splice(k, 1);
  for (const id of ["hemato", "derma", "gastro", "hepato", "pneumo", "outro"]) {
    const it = CATALOGO.find((i) => i.id === id);
    if (it && id !== "outro") it.info = ["Ainda sem protocolo novo da SMS-Rio na base: critérios do Protocolo do Regulador de 2015.", ...(it.info || [])];
  }
  for (const p of PROTOCOLOS) {
    if (p.como && p.como.length) p.info = [...(p.info || []), "O protocolo pede que o texto contenha: " + p.como.join("; ") + "."];
    CATALOGO.push(p);
  }
})();

/* Pedidos cirúrgicos: Manual 2026 exige o provável ASA */
for (const it of CATALOGO) if (it.cir && !(it.campos || []).some((f) => f.id === "asa"))
  (it.campos = it.campos || []).push({ id: "asa", l: "Provável ASA", t: "sel", req: true, o: ["", "ASA I", "ASA II", "ASA III", "ASA IV"] });

if (typeof module !== "undefined") module.exports = { CATALOGO, BASES, CORES };
