const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const all = [];
function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory()) walk(p); else if(/\.(js|html|css)$/.test(e.name)) all.push(p);
  }
}
walk(src); all.push(path.join(root,'index.html'));
const text = all.map(p=>fs.readFileSync(p,'utf8')).join('\n');
const svgArt = fs.readFileSync(path.join(src,'core/svg-art.js'),'utf8');
const objectCases = new Set([...svgArt.matchAll(/case ['"]([^'"]+)['"]/g)].map(m=>m[1]));
const refs = new Set([...text.matchAll(/SvgArt\.object\(['"]([^'"]+)['"]/g)].map(m=>m[1]));
const missing = [...refs].filter(x=>!objectCases.has(x));
const icons = fs.readFileSync(path.join(src,'core/icons.js'),'utf8');
const iconNames = new Set([...icons.matchAll(/^\s*['"]?([\w-]+)['"]?:/gm)].map(m=>m[1]));
const iconIds = new Set([...text.matchAll(/iconId:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]));
const missingIcons = [...iconIds].filter(x=>!iconNames.has(x));
const badSvg = [];
for(const [file] of all.map(p=>[p])){
  const s=fs.readFileSync(file,'utf8');
  for(const m of s.matchAll(/<svg\b[^>]*>/gi)){
    const tag=m[0];
    if(/width=["']#/.test(tag)||/height=["']#/.test(tag)) badSvg.push(`${path.relative(root,file)}: ${tag}`);
  }
}
const result={objectRefs:[...refs].sort(),missingObjectCases:missing,iconIds:[...iconIds].sort(),missingIconIds:missingIcons,badSvgDimensionAttributes:badSvg,filesScanned:all.length};
console.log(JSON.stringify(result,null,2));
if(missing.length||missingIcons.length||badSvg.length) process.exit(1);
