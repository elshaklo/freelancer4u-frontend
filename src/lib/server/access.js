import { error, redirect } from '@sveltejs/kit';
export function requireLogin(locals) {
  if (!locals.isAuthenticated || !locals.jwt_token) redirect(303, '/login');
}
export function requireAdmin(locals) {
  requireLogin(locals);
  if (!locals.user?.user_roles?.includes('admin')) error(403, 'Admin role required');
}
export function apiError(cause) {
  const status = cause.response?.status;
  if (status === 401) error(401, 'Session expired. Please log in again.');
  if (status === 403) error(403, 'Permission denied');
  error(502, 'Backend unavailable. Please try again.');
}
