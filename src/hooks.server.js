import { verifyToken } from '#lib/server/token.js';
export async function handle({ event, resolve }) {
  const token = event.cookies.get('jwt_token');
  event.locals.user = {};
  event.locals.isAuthenticated = false;
  try {
    if (token) {
      const claims = await verifyToken(token);
      if (claims.exp * 1000 > Date.now()) {
        event.locals.jwt_token = token;
        const profile = JSON.parse(event.cookies.get('user_info') || '{}');
        event.locals.user = { ...profile, user_roles: Array.isArray(claims.user_roles) ? claims.user_roles : [] };
        event.locals.isAuthenticated = true;
      }
    }
  } catch { /* Invalid or expired sessions remain logged out. */ }
  if (token && !event.locals.isAuthenticated) {
    event.cookies.delete('jwt_token', { path: '/' });
    event.cookies.delete('user_info', { path: '/' });
  }
  return resolve(event);
}
