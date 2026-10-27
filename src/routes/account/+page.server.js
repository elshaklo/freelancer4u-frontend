import { requireLogin } from '#lib/server/access.js';
export function load({ locals }) { requireLogin(locals); return {}; }
