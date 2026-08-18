import json,re
from pathlib import Path
p=Path(__file__).resolve().parents[1]/'content/curriculum.json'
d=json.loads(p.read_text(encoding='utf-8'))
def age(s):
 m=re.search(r'(\d+)\s*تا\s*(\d+)',str(s or ''))
 return int(m.group(1)) if m else 99
errors=[]; count=0
for dom in d['domains']:
 prev_level=None
 for lv in dom['levels']:
  la=age(lv.get('ageBand') or (lv.get('lessons') or [{}])[0].get('ageBand'))
  ld=lv.get('difficulty',999)
  level_key=(la,ld,lv.get('progressionOrder',999))
  if prev_level and level_key < prev_level: errors.append((dom['id'],'LEVEL',prev_level,level_key))
  prev_level=level_key
  prev_lesson=None
  for l in lv['lessons']:
   lk=(age(l.get('ageBand')), l.get('order',999))
   if prev_lesson and lk < prev_lesson: errors.append((dom['id'],l['id'],prev_lesson,lk))
   prev_lesson=lk; count+=1
print({'lessons':count,'orderErrors':len(errors),'errors':errors[:10]})
raise SystemExit(1 if errors else 0)
