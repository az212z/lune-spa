import {db} from '@/lib/database';
import {salonTenant} from '@/lib/access';
import {hash} from '@/lib/booking';
import {publicHeaders,respond,rateLimit,allowedOrigin} from '../route';
export const dynamic='force-dynamic';
export async function OPTIONS(req:Request){return new Response(null,{status:allowedOrigin(req)?204:403,headers:publicHeaders(req)})}
export async function GET(req:Request){const token=req.headers.get('authorization')?.replace(/^Bearer /,'')||'';if(!/^[0-9a-f]{64}$/.test(token))return respond(req,{error:'رابط الحجز غير صالح.'},404);if(!await rateLimit(req,'receipt',30))return respond(req,{error:'انتظري دقيقة وحاولي مجددًا.'},429);const b:any=await db().prepare('SELECT b.* FROM bookings b JOIN guest_receipts g ON g.tenant=b.tenant AND g.booking=b.id WHERE g.token_hash=? AND b.tenant=?').bind(await hash(token),salonTenant()).first();if(!b)return respond(req,{error:'لم نعثر على الحجز.'},404);return respond(req,{id:b.id,name:b.name,date:b.date,time:b.time,services:JSON.parse(b.services).map((s:any)=>({name:s.name,duration:s.duration})),total:b.total,status:b.status})}
