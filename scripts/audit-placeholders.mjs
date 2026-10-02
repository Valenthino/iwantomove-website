import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
async function files(dir) { const out = []; for(const entry of await readdir(dir,{withFileTypes:true})) { if(entry.name==='out') continue; const path=`${dir}/${entry.name}`; if(entry.isDirectory())out.push(...await files(path)); else out.push(path); } return out; }
const register = await readFile('marketing/09-open-items.md','utf8');
const tokens = new Set();
for(const dir of ['app','components','lib','marketing','scripts'])for(const path of await files(dir)) {
 if(!/\.(tsx?|md|html|json|py)$/.test(path))continue;
 for(const token of (await readFile(path,'utf8')).match(/\[\[PLACEHOLDER: [^\]]+\]\]/g)||[]) { assert(!token.includes('\n'),`Split token: ${path}`); assert(register.includes(token),`Unregistered token: ${token}`); tokens.add(token); }
}
const common = ['business email','hours','service area'];
for(const path of (await files('.next/server/app')).filter(p=>p.endsWith('.html'))) {
 const html=await readFile(path,'utf8'); const allowed=new Set(common);
 if(path.endsWith('/index.html'))for(const t of ['hero photo','insurance status'])allowed.add(t);
 if(path.endsWith('/privacy.html'))for(const t of ['data retention period','privacy contact'])allowed.add(t);
 if(path.endsWith('/thank-you.html'))allowed.add('response time');
 const actual=[...new Set(html.match(/\[\[PLACEHOLDER: [^\]]+\]\]/g)||[])];
 for(const t of actual)assert(allowed.has(t.slice(15,-2)),`${path}: unexpected ${t}`);
 assert(!html.includes('reviews-heading')); assert(!html.includes('real reviews'));
 console.log(path,actual.join(', '));
}
console.log(`${tokens.size} distinct source tokens registered; built HTML tokens expected; reviews absent.`);
