import Spa from '../spa';
import {requireAdmin} from '@/lib/access';
export const dynamic='force-dynamic';
export default async function Staff(){if(!await requireAdmin('/staff'))return <main className="empty"><h1>ليس لديك صلاحية الوصول</h1><p>مساحة الفريق متاحة لحساب الإدارة في هذه النسخة.</p></main>;return <Spa mode="staff"/>}
