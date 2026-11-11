import json, re, unicodedata
d=json.load(open('proto.json'))
def norm(s): return unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().lower()
def fixup(t):
    t=t.replace('- -','-')
    t=re.sub(r'([A-ZÁÉÍÓÚÂÊÔÃÕÇ])- ([A-ZÁÉÍÓÚÂÊÔÃÕÇ])',r'\1\2',t)
    return t
SMALL={'de','da','do','das','dos','e','em','com','por','para','a','o','ou','no','na','nos','nas','à','ao','às','vez'}
KEEP={'HIV/AIDS','HIV','AIDS','USG','US','TC','RNM','ECG','MAPA','DIU','SER','SISREG','LIO','OCT','YAG','PADI','IG','ATM','RM','II','III','(ONCOLOGIA)','TEA','COVID','PÓS-COVID','DRC','CDI'}
def tcase(s):
    out=[]
    for i,w in enumerate(s.split()):
        if w.upper() in KEEP or w in KEEP: out.append(w.upper() if w.upper() in KEEP else w); continue
        lw=w.lower()
        out.append(lw if (lw in SMALL and i>0) else lw[:1].upper()+lw[1:])
    return ' '.join(out).replace('(oncologia)','(Oncologia)')
def split_nomen(n):
    n=fixup(n); n=re.split(r'\.\s',n)[0].strip(' .')
    parts=re.split(r';|\s(?:e|ou|e/ou)\s(?=(?:CONSULTA|RESSON|AMBUL|BI[ÓO]PSIA|REABILIT|ULTRA|MAMO|MONITOR|ECOCARD|TESTE|DOPPLER|ESTUDO|COLONO|ENDOSC|ESOFAGO|ATENDIMENTO|ANGIO|ELETRO|OFTALMO|CIRURGIA|GRUPO))',n)
    out=[]
    for p in parts:
        p=p.strip(' .,')
        if len(p)<6 or re.search(r'(\bDE|—|\bE|-)$',p) or p.upper().startswith('NÃO H'): continue
        out.append(p)
    return out
CORMAP={'r':'r','y':'y','g':'g','b':'b'}
def prio_items(v, filtro=None, prefix=True):
    res=[]
    for ctx,c,t in v['prio']:
        if filtro is not None and ctx and not filtro(ctx): continue
        for it in re.split(r';\s*',t):
            it=it.strip(' .')
            if len(it)<4: continue
            it=it[:1].upper()+it[1:]
            if prefix and ctx and len(set(x[0] for x in v['prio']))>1: it=tcase(ctx)+': '+it
            res.append([c,it])
    return res
BASEMAP=[('expectativ','motivo'),('sinais ou sintomas','quadro'),('sinas ou sintomas','quadro'),('medica[çc][õo]es em uso','meds'),('exame f','ef'),('medicament','meds'),('tratamentos pr','conduta'),('conduta','conduta'),('exames realizados','exames'),('resultado','exames'),('hip[óo]tese','hd'),('condi[çc][õo]es cl','quadro'),('hist[óo]ria cl','quadro'),('tempo de evolu','tempo'),('comorbid','comorb'),('imc','escores'),('risco cardiovascular','escores'),('asa','asa')]
def como_fields(como):
    fields=[];ph={}
    for b in como:
        nb=norm(b)
        hit=None
        for k,fid in BASEMAP:
            if re.search(norm(k),nb): hit=fid;break
        if hit=='asa': continue
        if hit:
            ph.setdefault(hit,[]).append(b)
            continue
        fid=re.sub(r'[^a-z0-9]+','_',nb)[:24].strip('_')
        if 'aguardam' in nb: fid='aguardando'
        if 'familiar' in nb: fid='hf'
        lab=b if len(b)<=110 else b[:107]+'…'
        if any(f['id']=='p_'+fid for f in fields): continue
        fields.append({'id':'p_'+fid,'l':lab,'t':'area' if len(b)>60 else 'text'})
    return fields,ph
SPLIT={'RESSONÂNCIA NUCLEAR MAGNÉTICA','EXAMES EM CARDIOLOGIA','ENDOSCOPIA E COLONOSCOPIA','OTORRINOLARINGOLOGIA E EXAMES','REABILITAÇÃO','GINECOLOGIA E MASTOLOGIA','ONCOLOGIA','ELETRONEUROMIOGRAFIA'}
EXAME_PAT=r'RESSON|ANGIORESS|ULTRASS|MAMOGRAF|ELETROCARD|ECOCARD|HOLTER|MONITORAMENTO|TESTE|BI[ÓO]PSIA|COLONOS|ENDOSC|ESOFAGO|BRONCOS|AUDIOMET|IMPEDAN|NASOFIBRO|VIDEOLARING|ELETRONEURO|ESTUDO URO|DOPPLER|TOMOGRAF|POTENCIAL|EXAMES|MAPEAMENTO|ECOBIOM|RETINOGRAF|PAQUIM'
entries=[]
def mk(id,nome,sis,v,blocks,prio,nomens,cat):
    crit=[]
    for b in blocks:
        if not b['itens']: continue
        h=tcase(b['titulo']) if b['titulo'] else tcase(split_nomen(b['nomen'])[0]) if split_nomen(b['nomen']) else ''
        if h: crit.append(['h',h])
        for it in b['itens']:
            it=fixup(it)
            if len(it)>3: crit.append(['n',it[:1].upper()+it[1:]])
    if prio:
        crit.append(['h','Classificação de prioridade (protocolo SMS-Rio)'])
        crit+=prio
    if v['emerg']:
        crit.append(['h','Emergência — não é SISREG (Vaga Zero)'])
        crit+=[['e',fixup(x)] for x in v['emerg']]
    fields,ph=como_fields(v['como'])
    opts=['']+[n for n in dict.fromkeys(nomens)]
    campos=[]
    if len(opts)>2: campos.append({'id':'nomen','l':'Procedimento a selecionar no sistema','t':'sel','req':True,'o':opts})
    campos+=fields
    e={'id':id,'nome':nome,'cat':cat,'sis':sis,'proc':nomens[0] if len(nomens)==1 else 'ver campo “Procedimento a selecionar”' if nomens else nome,
       'reg':'RT médico da unidade' if sis=='SISREG' else 'SER (Regulação estadual)','base':'exame' if cat=='Exame' else 'consulta',
       'fonte':'Protocolo de Regulação Ambulatorial — '+tcase(v['titulo'])+' (SMS-Rio, '+v['data']+')',
       'como':[fixup(x) for x in v['como']],'ph':{k:'; '.join(x)[:140] for k,x in ph.items()},
       'crit':crit,'nao':[fixup(x) for x in v['nao']],'campos':campos}
    entries.append(e)
for k,v in d.items():
    T=v['titulo']; slug=re.sub(r'[^a-z]+','',norm(T))[:14]
    if 'psiq' in v:
        crit=[];nao=[];caps=[]
        cur=None
        for cond,m,t in v['psiq']:
            if m=='amb':
                if cond!=cur: crit.append(['h',tcase(cond)]);cur=cond
                crit.append(['n',t])
            elif m=='aps': nao.append(tcase(cond)+': '+t)
            else: caps.append(tcase(cond)+': '+t)
        crit.append(['h','Emergência — não é SISREG (Vaga Zero)'])
        crit+=[['e',x] for x in v['emerg']]
        fields,ph=como_fields(v['como'])
        entries.append({'id':'p_psiq','nome':'Psiquiatria / Saúde Mental adulto','cat':'Consulta','sis':'SISREG','proc':'ver campo “Procedimento a selecionar”','reg':'RT médico da unidade','base':'consulta',
          'fonte':'Protocolo de Regulação Ambulatorial — Psiquiatria e Saúde Mental Adulto (SMS-Rio, '+v['data']+')','como':v['como'],'ph':{k2:'; '.join(x)[:140] for k2,x in ph.items()},
          'info':['CAPS é porta aberta (sem regulação): compartilhar por contato direto com a equipe do CAPS de referência.']+['Perfil CAPS — '+c for c in caps],
          'crit':crit,'nao':nao,'campos':[{'id':'nomen','l':'Procedimento a selecionar no sistema','t':'sel','req':True,'o':['','CONSULTA EM PSIQUIATRIA','CONSULTA EM SAÚDE MENTAL — ADULTO']}]+fields})
        continue
    if T in SPLIT:
        groups={}
        for b in v['indic']:
            ns=split_nomen(b['nomen'])
            if not ns: continue
            key=ns[0]
            groups.setdefault(key,{'blocks':[],'nomens':[] ,'sis':b['sis']})
            groups[key]['blocks'].append(b); groups[key]['nomens']+=ns
        for i,(key,g) in enumerate(groups.items()):
            words=[w for w in re.findall(r'[a-z]{4,}',norm(key)) if w not in ('consulta','ambulatorio','magnetica','ressonancia','oncologia','monitoramento','ginecologia','pediatria','cardiaco','para')]
            filt=lambda ctx,words=words: bool(words) and all(w[:6] in norm(ctx) for w in words)
            if v['prio'] and all(c[0] for c in v['prio']): pr=prio_items(v,filt,prefix=False)
            else: pr=prio_items(v,None,False)
            if T=='ONCOLOGIA': pr=[['r','Suspeita de câncer (todo exame de investigação vai em VERMELHO)']]
            cat='SER' if g['sis']=='SER' else ('Exame' if re.search(EXAME_PAT,key) else 'Consulta')
            k2=re.sub(r'^AMBULATÓRIO (DE )?1ª VEZ( EM)?\s*—?\s*','',key)
            k2=re.sub(r'^CONSULTA (EM|ME) ','',k2)
            nome=tcase(k2).replace('(ONCOLOGIA)','').replace('(Oncologia)','').replace(' (oncologia','').strip()
            if T=='ONCOLOGIA' and g['sis']=='SER': nome+=' (Oncologia – SER)'
            mk('p_'+slug+str(i),nome,g['sis'],v,g['blocks'],pr,list(dict.fromkeys(g['nomens'])),cat)
            if T=='RESSONÂNCIA NUCLEAR MAGNÉTICA': entries[-1]['info']=['Prioridade: o protocolo não define cor por indicação — usar gravidade (neoplasia e doença neurodegenerativa = VERMELHO).']
    else:
        nomens=[]
        for b in v['indic']: nomens+=split_nomen(b['nomen'])
        sis='SISREG' if any(b['sis']=='SISREG' for b in v['indic']) or not v['indic'] else 'SER'
        mk('p_'+slug,tcase(T.replace(' PARTE 1','').replace(' (PADI','').replace('PROGRAMA DE ATENÇÃO DOMICILIAR AO IDOSO','PADI – Atenção Domiciliar ao Idoso')),sis,v,v['indic'],prio_items(v),list(dict.fromkeys(nomens)),'Consulta')
# mescla duplicados (mesmo procedimento em 2 protocolos)
def k(e): return re.sub(r'[^a-z0-9]','',norm(re.sub(r'\s*\(.*','',e['nome'])).replace('mamas bilateral','mama')).replace('ginecologiamastologia','mastologia').replace('histeroscopiadiagnostica','ginecologiahisteroscopiadiagnostica').replace('gineco'+'logiaginecologia','ginecologia').replace('pelvebacia','baciaepelve')
merged={};order=[]
entries.sort(key=lambda e: bool(re.search(r'\d$',e['id'])))
for e in entries:
    kk=k(e)+e['sis']
    if kk in merged:
        m=merged[kk]
        m['crit']+= [['h','Também no protocolo: '+e['fonte'].split('— ')[1]]]+[c for c in e['crit'] if c[0]!='e' and not (c[0]=='h' and c[1].startswith('Emergência'))]
        m['fonte']+=' + '+e['fonte'].split('— ')[1]
        m['nao']+= [x for x in e['nao'] if x not in m['nao']]
        ids={f['id'] for f in m['campos']}; m['campos']+=[f for f in e['campos'] if f['id'] not in ids]
    else: merged[kk]=e; order.append(kk)
entries=[merged[x] for x in order]
for e in entries:
    if e['nome'].count(')')>e['nome'].count('('): e['nome']=e['nome'].replace(')','')
    e['nome']=e['nome'].replace('PADI – Atenção Domiciliar ao Idoso)','PADI – Atenção Domiciliar ao Idoso')
    # emergência duplicada em mesclas: remove itens 'e' repetidos
    seen=set(); c2=[]
    for c in e['crit']:
        key=(c[0],c[1])
        if c[0]!='h' and key in seen: continue
        seen.add(key); c2.append(c)
    e['crit']=c2
# sub-entradas focadas (fluxos com regras próprias nos avisos)
E={e['id']:e for e in entries}
def sub(src,nid,nome,hpat,ppat,nomen,prio_ctx=None):
    s=E[src]; crit=[];take=False
    for c in s['crit']:
        if c[0]=='h':
            if c[1].startswith('Classificação') or c[1].startswith('Emergência') or c[1].startswith('Também'): take=False
            else: take=bool(re.search(hpat,norm(c[1])))
            if take: crit.append(c)
        elif take: crit.append(c)
    pr=[c for c in s['crit'] if c[0] in 'rygb' and (re.search(ppat,norm(c[1])) if ppat else False)]
    if pr: crit+= [['h','Classificação de prioridade (protocolo SMS-Rio)']]+pr
    em=[c for c in s['crit'] if c[0]=='e']
    if em: crit+=[['h','Emergência — não é SISREG (Vaga Zero)']]+em
    n=dict(s); n.update({'id':nid,'nome':nome,'proc':nomen,'crit':crit,'campos':[f for f in s['campos'] if f['id']!='nomen']})
    entries.append(n)
sub('p_oftalmologia','p_catarata','Oftalmologia – Cirurgia de catarata',r'catarata|capsulotomia|\blio$|implante secund','^catarata','CONSULTA EM OFTALMOLOGIA — CIRURGIA DE CATARATA')
sub('p_urologia','p_vasectomia','Urologia – Vasectomia','vasectomia','vasectomia','CONSULTA EM UROLOGIA — VASECTOMIA')
sub('p_urologia','p_litiase','Urologia – Litíase','litiase','litiase|calculo','CONSULTA EM UROLOGIA — LITÍASE')
for e in entries:
    if re.search(r'Cirurgi|Laqueadura|Vasectomia|Histeroscopia Cirúrgica|Catarata',e['nome']) and 'Oncologia' not in e['nome']: e['cir']=True
    e['info']=[e.pop('fonte')]+e.get('info',[])
json.dump(entries,open('entries.json','w'),ensure_ascii=False,indent=1)
print(len(entries))
for e in entries: print(e['id'],'|',e['cat'],'|',e['nome'][:60],'| crit',len(e['crit']),'| nomen',len(e['campos'][0]['o'])-1 if e['campos'] and e['campos'][0]['id']=='nomen' else 1)

js='/* Gerado automaticamente a partir dos Protocolos de Regulação Ambulatorial da SMS-Rio (2023–2025). Não editar à mão: rode build.py. */\nconst PROTOCOLOS = '+json.dumps(entries,ensure_ascii=False)+';\nif (typeof module !== "undefined") module.exports = { PROTOCOLOS };\n'
open('protocolos.js','w').write(js)
