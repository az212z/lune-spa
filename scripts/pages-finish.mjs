import {readFile,writeFile,mkdir} from 'node:fs/promises';
const html=await readFile('dist-pages/index.html','utf8');
await mkdir('dist-pages/book',{recursive:true});
await writeFile('dist-pages/book/index.html',html);
await writeFile('dist-pages/.nojekyll','');
