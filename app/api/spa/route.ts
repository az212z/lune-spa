import {rewards} from '@/lib/loyalty.mjs';
import {isAdmin,salonTenant} from '@/lib/access';
import {createBooking} from '@/lib/booking';
import {seed} from '@/lib/seed';
import {db} from '@/lib/database';
import {services,staff,products,today} from '@/lib/catalog';
export const dynamic='force-dynamic';
const json=(data:any,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
async function identity(){return await isAdmin()?salonTenant():null}
export async function GET(){const t=await identity();if(!t)return json({error:'لوحة الإدارة مخصصة لحساب مالكة المحل.'},403);await seed(t);const [rs,bs]=await Promise.all([db().prepare('SELECT * FROM records WHERE tenant=?').bind(t).all(),db().prepare('SELECT * FROM bookings WHERE tenant=? ORDER BY date DESC,time ASC').bind(t).all()]);return json({records:rs.results.map((r:any)=>({...JSON.parse(r.data),kind:r.kind})),bookings:bs.results.map((b:any)=>({...b,tenant:undefined,services:JSON.parse(b.services),preferences:JSON.parse(b.preferences)}))})}
export async function POST(req:Request){const t=await identity();if(!t)return json({error:'ليس لديك صلاحية إدارة المحل.'},403);if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return json({error:'طلب غير مسموح'},403);let body:any;try{body=await req.json()}catch{return json({error:'طلب غير صالح'},400)}
try{if(body.action==='redeem'){
const reward=rewards.find(r=>r.id===body.reward);if(!reward||!/^05\d{8}$/.test(body.phone)||!/^[-a-zA-Z0-9]{10,80}$/.test(body.requestId))return json({error:'بيانات مكافأة غير صالحة'},400);
const id='loyalty-'+body.requestId;const existing:any=await db().prepare("SELECT data FROM records WHERE tenant=? AND id=? AND kind='loyalty_redemption'").bind(t,id).first();if(existing){const r=JSON.parse(existing.data);return r.phone===body.phone&&r.reward===reward.id?json(r):json({error:'طلب متعارض'},409)}
const row={id,kind:'loyalty_redemption',phone:body.phone,reward:reward.id,name:reward.name,cost:reward.cost,created:new Date().toISOString()};
const result=await db().prepare(`INSERT OR IGNORE INTO records (tenant,id,kind,data) SELECT ?,?,'loyalty_redemption',? WHERE (SELECT COALESCE(SUM(CAST(total AS INTEGER)),0) FROM bookings WHERE tenant=? AND phone=? AND status='completed' AND paid>=total) - (SELECT COALESCE(SUM(json_extract(data,'$.cost')),0) FROM records WHERE tenant=? AND kind='loyalty_redemption' AND json_extract(data,'$.phone')=?) >= ?`).bind(t,id,JSON.stringify(row),t,body.phone,t,body.phone,reward.cost).run();
if(!result.meta.changes)return json({error:'الرصيد غير كافٍ أو سبق تنفيذ الطلب. حدّثي الصفحة.'},409);return json(row);
}
if(body.action==='book')return createBooking(t,body);
if(body.action==='status'){
if(!['confirmed','arrived','completed','cancelled','no_show'].includes(body.status))return json({error:'حالة غير صالحة'},400);const b:any=await db().prepare('SELECT * FROM bookings WHERE tenant=? AND id=?').bind(t,body.id).first();if(!b)return json({error:'الحجز غير موجود'},404);if(b.paid>0&&['cancelled','no_show'].includes(body.status))return json({error:'يوجد مبلغ محصّل. عالجي الاسترداد مع المحل قبل إلغاء الحجز.'},409);if(['cancelled','completed','no_show'].includes(b.status))return json({error:'الحجز مغلق ولا يمكن تعديل حالته.'},409);const qs=[db().prepare('UPDATE bookings SET status=? WHERE tenant=? AND id=? AND status=? AND (?=0 OR paid=0)').bind(body.status,t,body.id,b.status,['cancelled','no_show'].includes(body.status)?1:0)];if(['cancelled','no_show'].includes(body.status))qs.push(db().prepare("DELETE FROM slots WHERE tenant=? AND booking=? AND EXISTS (SELECT 1 FROM bookings WHERE tenant=? AND id=? AND status IN ('cancelled','no_show'))").bind(t,body.id,t,body.id));const changed=await db().batch(qs);if(!changed[0].meta.changes)return json({error:'تغير الحجز أثناء التحديث. أعيدي تحميله.'},409);return json({ok:true})}
if(body.action==='pay'){const r=await db().prepare("UPDATE bookings SET paid=total WHERE tenant=? AND id=? AND status NOT IN ('cancelled','no_show') AND paid=0").bind(t,body.id).run();if(!r.meta.changes)return json({error:'الحجز مدفوع مسبقًا أو ملغي.'},409);return json({ok:true})}
if(body.action==='save'){
const {kind}=body;let d=body.data;if(!d||!['service','staff','product','waitlist','settings','campaign'].includes(kind))return json({error:'بيانات غير صالحة'},400);const id=kind==='settings'?'settings':(typeof d.id==='string'&&d.id.length<100?d.id:crypto.randomUUID());
if(typeof d.name!=='string'||d.name.trim().length<2||d.name.length>100)return json({error:'أدخلي اسمًا صحيحًا.'},400);
if(kind==='service'){if(!Number.isInteger(d.price)||d.price<0||d.price>10000||!Number.isInteger(d.duration)||d.duration<15||d.duration>360||d.duration%15)return json({error:'السعر موجب والمدة مضاعفات ١٥ دقيقة حتى ٣٦٠.'},400);d={id,name:d.name,price:d.price,duration:d.duration,category:String(d.category||'العناية'),room:String(d.room||'غرفة العناية ١'),description:String(d.description||''),icon:'✧'}}
if(kind==='product'){if(!Number.isInteger(d.stock)||d.stock<0||d.stock>100000||!Number.isFinite(d.price)||d.price<0||!Number.isInteger(d.min)||d.min<0)return json({error:'راجعي الكمية والسعر وحد التنبيه.'},400);d={id,name:d.name,stock:d.stock,price:d.price,min:d.min}}
if(kind==='staff')d={id,name:d.name,title:String(d.title||'أخصائية عناية').slice(0,100),commission:Math.max(0,Math.min(100,Number(d.commission)||0)),color:'#eddfeb'};
if(kind==='waitlist'){if(!/^05\d{8}$/.test(d.phone)||!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||d.date<today())return json({error:'راجعي الجوال والتاريخ.'},400);d={id,name:d.name,phone:d.phone,date:d.date,notes:String(d.notes||'').slice(0,300)}}
if(kind==='settings')d={id,name:d.name,branch:String(d.branch||'').slice(0,100),buffer:15};if(kind==='campaign')d={id,name:d.name,text:String(d.text||'').slice(0,2000),status:'draft'};
await db().prepare('INSERT INTO records (tenant,id,kind,data) VALUES (?,?,?,?) ON CONFLICT(tenant,id) DO UPDATE SET data=excluded.data WHERE records.kind=excluded.kind').bind(t,id,kind,JSON.stringify(d)).run();return json({id})}
if(body.action==='removeWaitlist'){await db().prepare("DELETE FROM records WHERE tenant=? AND id=? AND kind='waitlist'").bind(t,body.id).run();return json({ok:true})}
return json({error:'عملية غير معروفة'},400)
}catch(e){console.error('Spa request failed',e);return json({error:'تعذر حفظ التغيير. حاولي مجددًا.'},500)}}
