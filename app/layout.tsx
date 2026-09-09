import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'LUNE | لون سبا',icons:{icon:'/favicon.svg'},description:'حجوزات وعناية وإدارة السبا في مكان واحد'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="ar" dir="rtl"><body>{children}</body></html>}
