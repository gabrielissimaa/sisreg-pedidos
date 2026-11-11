import re, json, glob, sys, os
CORES={'VERMELHO':'r','AMARELO':'y','VERDE':'g','AZUL':'b'}
def clean(t):
    t=re.sub(r'\s+',' ',t)
    t=re.sub(r'(\w)- -(\w)',r'\1-\2',t)
    t=re.sub(r'([a-záéíóúâêôãõç])- ([a-záéíóúâêôãõç])',r'\1\2',t)
    t=re.sub(r'\s+(Protocolo de Regulação Ambulatorial —[^|]*\|\s*\d+)','',t)
    # corta cabeçalho em caixa alta colado no fim
    t=re.split(r'\s(?=(?:[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3,}\s){2,}[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3,})',t)[0]
    t=re.split(r'\s(?:ATENÇÃO!|Saiba mais)',t)[0]
    t=re.split(r'\.\s+A ausência de completude',t)[0]
    return t.strip(' .;:')
def load(path):
    L=[l.rstrip() for l in open(path)]
    # drop page header/footer lines
    L=[l for l in L if not re.match(r'^\s*Protocolo de Regulação Ambulatorial —.*\|\s*\d+\s*$',l) and not re.match(r'^\s*\d{1,2}\s*$',l)]
    return L
def bullets(block):
    out=[];cur=None
    for l in block:
        s=l.strip()
        if s.startswith('•') or re.match(r'^\d+\.\s',s):
            if cur: out.append(clean(cur))
            cur=re.sub(r'^(•|\d+\.)\s*','',s)
        elif cur is not None: cur+=' '+s
    if cur: out.append(clean(cur))
    return [b for b in out if b]
def section(L,start_pat,stop_pats):
    ks=[k for k,l in enumerate(L) if re.search(start_pat,l) and '....' not in l]
    i=ks[-1] if ks else None
    if i is None: return []
    out=[]
    for l in L[i+1:]:
        if any(re.search(p,l) for p in stop_pats): break
        out.append(l)
    return out
HEADS=[r'^\s*COMO SOLICITAR',r'^\s*ENCAMINHAMENTO IMEDIATO',r'^\s*PRIORIZAÇÃO',r'^\s*UNIDADES EXECUTANTES',r'^\s*SITUAÇÕES CLÍNICAS QUE N',r'^\s*SAIBA MAIS',r'^\s*REFERÊNCIAS']
def prio(L):
    blk=section(L,r'^\s*PRIORIZAÇÃO',[r'^\s*UNIDADES EXECUTANTES',r'^\s*SAIBA MAIS',r'^\s*REFERÊNCIAS'])
    res=[];cur=None;ctx=''
    for l in blk:
        s=l.strip()
        m=re.match(r'^(VERMELHO|AMARELO|VERDE|AZUL)\s*\S?\s*(.*)',s)
        if m:
            if cur: res.append(cur)
            cur=[ctx,CORES[m.group(1)],m.group(2)]
        elif cur and s and not re.match(r'^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ,/()—–-]{6,}$',s): cur[2]+=' '+s
        else:
            if cur: res.append(cur);cur=None
            if s: ctx=s
    if cur: res.append(cur)
    return [[c,k,clean(t)] for c,k,t in res]
def nomen(L):
    out=[]
    txt='\n'.join(L)
    for m in re.finditer(r'Nomenclatura (?:no|do) (SISREG|SER):\s*(.+?)(?:\.\s|\n\s*Indica|\n\n)',txt,re.S):
        out.append((m.group(1),clean(m.group(2))))
    return out
def indic(L):
    """blocos: titulo (linha maiúscula antes de 'Nomenclatura'), nomenclatura, itens numerados"""
    res=[]
    ks=[k for k,l in enumerate(L) if re.search(r'^\s*SITUAÇÕES CLÍNICAS QUE N|^\s*COMO SOLICITAR',l) and '....' not in l]
    end=ks[-1] if ks else len(L)
    k=0
    while k<end:
        l=L[k]
        if re.search(r'Nomenclatura (no|do) (SISREG|SER)',l):
            # titulo: linhas maiúsculas acima
            t=[];j=k-1
            while j>0 and (re.match(r'^\s*[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ,/()—–\-:]+$',L[j]) and L[j].strip()): t.insert(0,L[j].strip()); j-=1
            # nomenclatura text até 'Indicações' ou ponto
            nb=[];j=k
            while j<end and 'Indicações clínicas' not in L[j] and not re.match(r'^\s*\d+\.',L[j]) and j<k+4: nb.append(L[j]); j+=1
            nm=re.sub(r'\s+',' ',re.sub(r'.*Nomenclatura (no|do) (SISREG|SER):','',' '.join(nb)).split('Indicações')[0]).strip(' .')
            sis='SER' if 'no SER' in l else 'SISREG'
            # itens até próximo nomenclatura ou título
            blk=[];j=j
            while j<end and not re.search(r'Nomenclatura (no|do) (SISREG|SER)',L[j]): blk.append(L[j]); j+=1
            # remove trailing title lines
            while blk and re.match(r'^\s*[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ,/()—–\-:]+$',blk[-1]) : blk.pop()
            its=[]
            cur=None
            for b in blk:
                s=b.strip()
                if re.match(r'^\d+\.\s',s):
                    if cur: its.append(clean(cur))
                    cur=re.sub(r'^\d+\.\s*','',s)
                elif re.match(r'^ATENÇÃO|^V Nomenclatura|^Indicações clínicas',s):
                    if cur: its.append(clean(cur)); cur=None
                elif cur is not None and s: cur+=' '+s
            if cur: its.append(clean(cur))
            res.append({'titulo':' '.join(t),'sis':sis,'nomen':nm,'itens':its})
            k=j
        else: k+=1
    return res
def psiq(L):
    res=[];cond=None;modo=None;cur=None
    ini=[k for k,l in enumerate(L) if 'TRANSTORNO POR USO DE ÁLCOOL' in l][-1]
    fim=[k for k,l in enumerate(L) if 'NECESSITAM DE ENCAMINHAMENTO' in l][-1]
    for l in L[ini:fim]:
        s=l.strip()
        if re.match(r'^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ,/()—–\-]{8,}$',s): cond=(cond+' '+s) if (cond and modo is None) else s; modo=None; continue
        m=re.match(r'^(Manter em tratamento exclusivamente na APS|Compartilhar com (?:o )?[Aa]mbulatório|Compartilhar com o CAPS)',s)
        if m: modo={'M':'aps','C':'amb'}[s[0]] if 'CAPS' not in s else 'caps'; continue
        if s.startswith('•'):
            if cur: res.append(cur)
            cur=[cond,modo,s[1:].strip()]
        elif cur and s and not s.startswith('Pode se caracterizar'): cur[2]+=' '+s
        elif s.startswith('Pode se caracterizar'):
            if cur: res.append(cur); cur=None
    if cur: res.append(cur)
    return [[c,m,clean(t)] for c,m,t in res]
out={}
for c in sorted(glob.glob('txt/*.c')):
    L=load(c)
    head=re.sub(r'\s+',' ',' '.join(L[0:8]))
    m=re.search(r'REGULAÇÃO AMBULATORIAL\s*(.+?)\s*ATUALIZADO EM ([A-ZÇ]+ DE \d{4})',head)
    title=(m.group(1) if m else head[:60]).strip(); data=m.group(2).lower() if m else ''
    out[os.path.basename(c)]={
      'titulo':title,'data':data,
      'nao':bullets(section(L,r'^\s*SITUAÇÕES CLÍNICAS QUE N',HEADS)),
      'como':bullets(section(L,r'^\s*COMO SOLICITAR',HEADS)),
      'emerg':bullets(section(L,r'^\s*ENCAMINHAMENTO IMEDIATO',HEADS)),
      'prio':prio(L),
      'indic':indic(L),
    }
    if 'PSIQUIATRIA' in title: out[os.path.basename(c)]['psiq']=psiq(L)
json.dump(out,open('proto.json','w'),ensure_ascii=False,indent=1)
for k,v in out.items(): print(v['titulo'][:50],'| nao',len(v['nao']),'como',len(v['como']),'emerg',len(v['emerg']),'prio',len(v['prio']),'indic',len(v['indic']),sum(len(b['itens']) for b in v['indic']))
