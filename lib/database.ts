import {env} from 'cloudflare:workers';
export function db(){return (env as unknown as {DB:D1Database}).DB}
