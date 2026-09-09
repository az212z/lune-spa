import {env} from 'cloudflare:workers';
import {getChatGPTUser,requireChatGPTUser} from '@/app/chatgpt-auth';
export function runtime(){return env as unknown as {DB:D1Database;SPA_ADMIN_EMAIL?:string;SPA_TENANT_ID?:string;PUBLIC_CUSTOMER_ORIGIN?:string}}
export function salonTenant(){const tenant=runtime().SPA_TENANT_ID;if(!tenant)throw new Error('Salon configuration missing');return tenant}
export async function isAdmin(){const user=await getChatGPTUser();const email=runtime().SPA_ADMIN_EMAIL;return !!(user&&email&&user.email.toLowerCase()===email.toLowerCase())}
export async function requireAdmin(path:string){await requireChatGPTUser(path);return isAdmin()}
