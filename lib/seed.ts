import {db} from './database';
import {services,staff,products} from './catalog';
export async function seed(t:string){const rows=[...services.map(data=>({kind:'service',data})),...staff.map(data=>({kind:'staff',data})),...products.map(data=>({kind:'product',data})),{kind:'settings',data:{id:'settings',name:'لون سبا',branch:'الرياض · حي الملقا',buffer:15}}];await db().batch(rows.map(r=>db().prepare('INSERT OR IGNORE INTO records (tenant,id,kind,data) VALUES (?,?,?,?)').bind(t,r.data.id,r.kind,JSON.stringify(r.data))))}
