import json,urllib.request,urllib.error,datetime,concurrent.futures
BASE='http://localhost:3000/api/spa'
def req(body=None,auth=True):
 h={'Content-Type':'application/json'}
 if auth:h['Cookie']='__sites_local_auth=1'
 r=urllib.request.Request(BASE,data=json.dumps(body).encode() if body else None,headers=h)
 try:
  with urllib.request.urlopen(r) as x:return x.status,json.load(x)
 except urllib.error.HTTPError as e:return e.code,json.load(e)
def check(v,msg):
 assert v,msg
 print('PASS:',msg)
check(req(auth=False)[0]==403,'Anonymous records rejected')
check(req()[0]==200,'Catalog loads')
date=(datetime.datetime.now()+datetime.timedelta(days=45)).strftime('%Y-%m-%d')
b={'action':'book','name':'عميلة اختبار','phone':'0500000000','date':date,'time':'14:00','staff':'e1','serviceIds':['s1'],'total':1,'preferences':{'quiet':True}}
check(req({**b,'phone':'abc'})[0]==400,'Phone validation')
check(req({**b,'date':'2026-99-99'})[0]==400,'Invalid calendar date rejected')
check(req({**b,'time':'21:30'})[0]==400,'Closing time and buffer validated')
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:r=list(pool.map(req,[b,b]))
check(sorted(x[0] for x in r)==[200,409],'Concurrent collision: exactly one booking commits')
id=next(x[1]['id'] for x in r if x[0]==200)
check(next(x[1]['total'] for x in r if x[0]==200)==280,'Price taken from server catalog')
check(req({**b,'staff':'e2'})[0]==409,'Room conflict enforced across staff')
check(req({**b,'time':'15:00','staff':'e2'})[0]==409,'Cleaning buffer reserved')
rs=req()[1]['bookings'];row=next(x for x in rs if x['id']==id)
check(row['preferences']['quiet'] and row['total']==280,'Read-back persists preferences and price')
check(req({'action':'status','id':id,'status':'cancelled'})[0]==200,'Cancellation works')
r=req(b);check(r[0]==200,'Cancellation releases room and staff');id=r[1]['id']
check(req({'action':'pay','id':id})[0]==200,'Manual payment stored')
check(req({'action':'pay','id':id})[0]==409,'Duplicate payment rejected')
check(req({'action':'status','id':id,'status':'cancelled'})[0]==409,'Paid booking cannot be cancelled without refund handling')
check(req({'action':'status','id':id,'status':'arrived'})[0]==200,'Arrival recorded')
check(req({'action':'status','id':id,'status':'completed'})[0]==200,'Visit completed')
check(req({'action':'status','id':id,'status':'confirmed'})[0]==409,'Closed booking cannot reopen')
check(req({'action':'save','kind':'product','data':{'name':'اختبار','stock':-1,'price':10,'min':5}})[0]==400,'Negative inventory rejected')
for route in ['/','/book','/admin','/staff']:
 with urllib.request.urlopen(urllib.request.Request('http://localhost:3000'+route,headers={'Cookie':'__sites_local_auth=1'})) as response:check(response.status==200,'Route renders '+route)
print('All local integration checks passed. Test bookings exist only in the local database.')
