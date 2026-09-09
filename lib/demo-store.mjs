import {redeem} from './loyalty.mjs';
export const DEMO_KEY='lune-sales-demo-v1';
export function createDemoStore(makeSeed,storage,onChange=()=>{}) {
 let fallback;
 const clone=x=>JSON.parse(JSON.stringify(x));
 function read(){try{const raw=storage?.getItem(DEMO_KEY);if(raw){const d=JSON.parse(raw);if(d?.records&&d?.bookings&&d.version===1)return clone(d)}}catch{}return clone(fallback??makeSeed())}
 function write(data){fallback=clone(data);try{storage?.setItem(DEMO_KEY,JSON.stringify(data))}catch{}onChange();return clone(data)}
 return {
  get:()=>read(), reset:()=>write(makeSeed()),
  async request(body){const d=read();
   if(body.action==='redeem'){const row=redeem(d,body);write(d);return row;}
   if(body.action==='book'){
    const sv=body.serviceIds?.map(id=>d.records.find(r=>r.kind==='service'&&r.id===id));
    if(!sv?.length||sv.some(s=>!s)||new Set(body.serviceIds).size!==sv.length)throw new Error('اختاري الخدمات المطلوبة.');
    if(!body.name?.trim()||!/^05\d{8}$/.test(body.phone)||!/^\d{4}-\d{2}-\d{2}$/.test(body.date)||!/^\d{2}:\d{2}$/.test(body.time))throw new Error('راجعي بيانات الحجز التجريبي.');
    const start=Number(body.time.slice(0,2))*60+Number(body.time.slice(3)),duration=sv.reduce((n,s)=>n+s.duration,0);
    if(start<600||start%15||start+duration+15>1320)throw new Error('اختاري وقتًا بين ١٠ صباحًا و١٠ مساءً يشمل مدة الخدمة والتجهيز.');
    if(!d.records.some(r=>r.kind==='staff'&&r.id===body.staff))throw new Error('اختاري أخصائية.');
    for(const b of d.bookings.filter(b=>b.date===body.date&&!['cancelled','no_show'].includes(b.status))){const bs=Number(b.time.slice(0,2))*60+Number(b.time.slice(3));if(start<bs+b.duration+15&&bs<start+duration+15&&(body.staff===b.staff||sv.some(s=>b.services.some(x=>x.room===s.room))))throw new Error('الوقت يتعارض مع موعد آخر في العرض. اختاري وقتًا آخر.');}
    const id=crypto.randomUUID(),total=sv.reduce((n,s)=>n+s.price,0);
    d.bookings.unshift({id,name:body.name,phone:body.phone,date:body.date,time:body.time,staff:body.staff,services:clone(sv),duration,total,paid:0,status:'confirmed',preferences:body.preferences||{},created:new Date().toISOString()});write(d);return {id,total,status:'confirmed',demo:true};
   }
   if(body.action==='save'){if(!['service','staff','product','settings','campaign','waitlist'].includes(body.kind)||!body.data?.name?.trim())throw new Error('أدخلي البيانات المطلوبة.');const row={...body.data,id:body.kind==='settings'?'settings':body.data.id||crypto.randomUUID(),kind:body.kind};if(body.kind==='product'&&(!Number.isInteger(row.stock)||row.stock<0))throw new Error('الكمية غير صالحة.');if(body.kind==='service'&&(row.price<0||row.duration<15||row.duration%15))throw new Error('راجعي السعر والمدة.');const i=d.records.findIndex(r=>r.id===row.id&&r.kind===row.kind);if(i<0)d.records.push(row);else d.records[i]=row;write(d);return {id:row.id};}
   if(body.action==='removeWaitlist'){d.records=d.records.filter(r=>!(r.kind==='waitlist'&&r.id===body.id));write(d);return {ok:true};}
   const b=d.bookings.find(b=>b.id===body.id);if(!b)throw new Error('الحجز غير موجود في العرض.');
   if(body.action==='pay'){if(b.paid||['cancelled','no_show'].includes(b.status))throw new Error('الحجز مدفوع أو ملغي.');b.paid=b.total;}
   else if(body.action==='status'){if(!['confirmed','arrived','completed','cancelled','no_show'].includes(body.status)||['cancelled','no_show','completed'].includes(b.status))throw new Error('لا يمكن تغيير حالة الحجز.');if(b.paid&&['cancelled','no_show'].includes(body.status))throw new Error('الحجز محصّل؛ الاسترداد خارج العرض.');b.status=body.status;}
   else throw new Error('عملية غير متاحة في العرض.');
   write(d);return {ok:true};
  }
 };
}
