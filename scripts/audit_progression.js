const fs=require('node:fs');
const d=JSON.parse(fs.readFileSync('content/curriculum.json','utf8'));
const errors=[]; let added=0;
for(const dom of d.domains){
  let prev=-1;
  for(const lev of dom.levels){
    const dif=Number(lev.difficulty||1);
    if(dif<prev) errors.push(`${dom.id}: level difficulty decreased at ${lev.id}`);
    prev=dif;
    for(const l of lev.lessons){
      if(l.extraTier) added++;
      if(!l.ageBand) errors.push(`${l.id}: missing ageBand`);
      if(!l.difficulty) errors.push(`${l.id}: missing difficulty`);
    }
  }
}
console.log(JSON.stringify({total:d.totalLessons,added,errors},null,2));
process.exit(errors.length?1:0);
