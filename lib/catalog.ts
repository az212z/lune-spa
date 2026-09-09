export const services=[
{id:'s1',name:'مساج الاسترخاء',category:'المساج',price:280,duration:60,room:'غرفة العناية ١',description:'استعيدي توازنك مع زيوت عطرية ولمسات هادئة.',icon:'✦'},
{id:'s2',name:'طقوس الحمام المغربي',category:'العناية بالجسم',price:350,duration:75,room:'الحمام المغربي',description:'طقوس عناية أصيلة، لبشرة ناعمة وإحساس متجدد.',icon:'◈'},
{id:'s3',name:'تنظيف البشرة العميق',category:'البشرة',price:320,duration:60,room:'غرفة العناية ٢',description:'تنظيف وترطيب وعناية مخصصة لإشراقة بشرتك.',icon:'✧'},
{id:'s4',name:'مانيكير وباديكير',category:'الأظافر',price:180,duration:60,room:'ركن الأظافر',description:'عناية متكاملة بأظافرك مع لون من اختيارك.',icon:'◇'},
{id:'s5',name:'مساج الأحجار الدافئة',category:'المساج',price:380,duration:90,room:'غرفة العناية ١',description:'دفء لطيف ووقت أطول للاسترخاء العميق.',icon:'✦'},
{id:'s6',name:'باقة يوم لنفسي',category:'الباقات',price:720,duration:180,room:'جناح لون',description:'ثلاث ساعات من عناية الجسم والبشرة والاسترخاء.',icon:'✶'}];
export const staff=[{id:'e1',name:'دانة محمد',title:'أخصائية مساج',color:'#eddfeb',commission:15},{id:'e2',name:'سلمى أحمد',title:'أخصائية بشرة',color:'#e4ece2',commission:12},{id:'e3',name:'أمل حسن',title:'أخصائية عناية',color:'#f1e7d9',commission:15},{id:'e4',name:'ريم خالد',title:'أخصائية أظافر',color:'#e4e8f2',commission:10}];
export const products=[{id:'p1',name:'زيت اللافندر',stock:12,min:5,price:85},{id:'p2',name:'ماسك الترطيب',stock:4,min:8,price:120},{id:'p3',name:'ملح الحمام',stock:18,min:6,price:65},{id:'p4',name:'كريم اليدين',stock:7,min:5,price:55}];
export function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
export const money=(n:number)=>new Intl.NumberFormat('ar-SA',{maximumFractionDigits:0}).format(n);
