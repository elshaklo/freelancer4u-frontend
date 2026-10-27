import { fail, redirect } from '@sveltejs/kit';
import auth from '#lib/server/auth.service.js';

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    try {
      // Call the auth.js login function - it handles cookie setting
      await auth.login(email, password, cookies);
    } catch (error) {
      return fail(400, {
        error: 'Login failed. Please check your credentials.'
      });
    }

    // After a successful login POST, redirect to the home page with a GET request
    redirect(303, '/');
  }
};
