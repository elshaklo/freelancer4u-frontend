import { redirect } from '@sveltejs/kit';
// Load environment variables from .env file for local development
import { AUTH0_DOMAIN } from '$app/env/private';
import { AUTH0_CLIENT_ID } from '$app/env/private';

export const actions = {
	default: async ({ cookies, url }) => {
		// Clear our app's cookies
		cookies.set('jwt_token', '', { path: '/', maxAge: 0 });
		cookies.set('user_info', '', { path: '/', maxAge: 0 });

		// Redirect to Auth0 logout endpoint which will then redirect back to our app
		const returnTo = encodeURIComponent(`${url.origin}/`);
		const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${returnTo}`;

		redirect(303, logoutUrl, { external: [`https://${AUTH0_DOMAIN}`] });
	}
};
