import json,urllib.request,urllib.error,datetime,concurrent.futures
BASE='http://localhost:3000'
def req(path,body=None,auth=False,headers=None,method=None):
 h={'Content-Type':'application/json',**(headers or {})}
 if auth:h['Cookie']='__sites_local_auth=1'
 r=urllib.request.Request(BASE+path,data=json.dumps(body).encode() if body is not None else None,headers=h,method=method)
 try:
  with urllib.request.urlopen(r) as x:
   raw=x.read().decode();return x.status,json.loads(raw) if raw and 'application/json' in x.headers.get('content-type','') else raw,{k.lower():v for k,v in x.headers.items()}
 except urllib.error.HTTPError as e:
  raw=e.read().decode();return e.code,json.loads(raw) if raw and 'application/json' in e.headers.get('content-type','') else raw,{k.lower():v for k,v in e.headers.items()}
def check(v,msg):
 assert v,msg
 print('PASS:',msg,flush=True)
public='/api/public';admin='/api/spa'
r=req(public);check(r[0]==200,'Anonymous catalog loads without sign-in')
check(not r[1]['bookings'],'Public catalog never exposes bookings')
check(all(x['kind'] in ['service','settings','staff'] for x in r[1]['records']),'No private inventory or campaign records returned')
check(all('commission' not in x for x in r[1]['records'] if x['kind']=='staff'),'Staff commission excluded')
check(req(admin)[0]==403,'Anonymous management API denied')
check(req(admin,{'action':'save','kind':'settings','data':{'name':'tamper'}})[0]==403,'Anonymous management changes denied')
check(req(public,{'action':'pay','id':'anything'})[0]==403,'Public endpoint cannot collect payments')
check(req(public,method='OPTIONS',headers={'Origin':'https://az212z.github.io'})[2].get('access-control-allow-origin')=='https://az212z.github.io','GitHub Pages CORS preflight')
check(req(public,{'action':'book'},headers={'Origin':'https://attacker.invalid'})[0]==403,'Unapproved browser origin denied')
date=(datetime.datetime.now()+datetime.timedelta(days=31)).strftime('%Y-%m-%d')
b={'action':'book','name':'اختبار حجز زائرة','phone':'0500000001','date':date,'time':'16:00','staff':'e2','serviceIds':['s3'],'total':1,'preferences':{'quiet':True}}
for old in req(admin,auth=True)[1]['bookings']:
 if old['name']==b['name'] and old['phone']==b['phone'] and old['date']==date and old['status'] in ['confirmed','arrived']:
  req(admin,{'action':'status','id':old['id'],'status':'cancelled'},auth=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:r=list(pool.map(lambda _:req(public,b,headers={'Origin':'http://localhost:3000'}),range(2)))
check(sorted(x[0] for x in r)==[200,409],'Anonymous concurrent bookings cannot double-book')
booking=next(x[1] for x in r if x[0]==200);id=booking['id'];token=booking['receipt']
check(len(token)==64,'Private receipt token issued')
check(booking['total']==320,'Anonymous price cannot be manipulated')
rows=req(admin,auth=True);check(rows[0]==200,'Owner management access works')
row=next((b for b in rows[1]['bookings'] if b['id']==id),None)
check(row and row['phone']=='0500000001' and row['preferences']['quiet'],'Guest reservation immediately appears in owner dashboard data')
check('receipt' not in row,'Raw guest receipt token not disclosed in management records')
r=req(public+'/receipt',headers={'Authorization':'Bearer '+token});check(r[0]==200 and r[1]['id']==id,'Guest can track own booking without login')
check('phone' not in r[1] and 'preferences' not in r[1],'Public receipt uses minimal personal data')
check(req(public+'/receipt',headers={'Authorization':'Bearer '+'a'*64})[0]==404,'Wrong receipt token cannot read another booking')
check(req(public+'/receipt')[0]==404,'No token cannot read a booking')
check(req(admin,{'action':'status','id':id,'status':'cancelled'},auth=True)[0]==200,'Owner can manage guest booking')
check(req(public+'/receipt',headers={'Authorization':'Bearer '+token})[1]['status']=='cancelled','Owner status change appears in customer receipt')
for path in ['/','/book']:
 r=req(path);check(r[0]==200,'Guest page loads '+path)
 check('لوحة الإدارة' not in r[1],'Customer rendered page contains no administration link '+path)
print('All guest booking and access-boundary checks passed.',flush=True)
