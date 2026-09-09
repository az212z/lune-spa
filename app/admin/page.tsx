import Spa from '../spa';
import {requireAdmin} from '@/lib/access';
export const dynamic='force-dynamic';
export default async function Admin(){if(!await requireAdmin('/admin'))return <main className="empty"><h1>هذه المساحة مخصصة لإدارة المحل</h1><p>الحساب الحالي لا يملك صلاحية الوصول.</p><a className="outline" href="/signout-with-chatgpt?return_to=/admin">تبديل الحساب</a></main>;return <Spa/>}
