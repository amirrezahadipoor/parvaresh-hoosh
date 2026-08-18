import json,re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CUR=ROOT/'content/curriculum.json'

def age_key(s):
    m=re.search(r'(\d+)\s*تا\s*(\d+)', str(s or ''))
    return int(m.group(1)) if m else 99

def level_age(lv):
    ages=[age_key(x.get('ageBand')) for x in lv.get('lessons',[])]
    return min(ages) if ages else 99

def lesson_key(l, fallback=999):
    return (age_key(l.get('ageBand')), l.get('difficulty', 999), l.get('order', fallback))

d=json.loads(CUR.read_text(encoding='utf-8'))
for dom in d.get('domains',[]):
    # Physical curriculum order: age first, then internal progression rank, then original order.
    indexed=list(enumerate(dom.get('levels',[])))
    indexed.sort(key=lambda p:(level_age(p[1]), p[1].get('difficulty',999), p[0]))
    new_levels=[]
    for new_idx,(old_idx,lv) in enumerate(indexed,1):
        lessons=list(lv.get('lessons',[]))
        lessons.sort(key=lambda l: lesson_key(l))
        for oi,l in enumerate(lessons,1):
            l['order']=oi
        lv['lessons']=lessons
        # Do not introduce or display difficulty labels; keep existing numeric metadata only for progression sorting.
        ages=sorted({x.get('ageBand') for x in lessons if x.get('ageBand')}, key=age_key)
        if ages:
            lv['ageBand']=ages[0] if len(ages)==1 else ' و '.join(ages)
        lv['progressionOrder']=new_idx
        new_levels.append(lv)
    dom['levels']=new_levels

# Keep top-level count consistent.
d['totalLessons']=sum(len(lv.get('lessons',[])) for dom in d.get('domains',[]) for lv in dom.get('levels',[]))
d['lastUpdated']='2026-08-18'
d['version']='3.1-age-ordered'
CUR.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
