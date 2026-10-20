import axios from 'axios';
import { error, fail } from '@sveltejs/kit';
import { API_BASE_URL } from '$app/env/private';

export async function load() {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/company`, { timeout: 10000 });
        return { companies: response.data };
    } catch {
        error(502, 'Could not load companies. Please check that the backend is running.');
    }
}

export const actions = {
    createCompany: async ({ request }) => {
        const data = await request.formData();
        const name = String(data.get('name') ?? '').trim();
        const email = String(data.get('email') ?? '').trim();

        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return fail(400, {
                success: false,
                error: 'Please enter a company name and a valid email address.',
                name,
                email
            });
        }

        try {
            await axios.post(`${API_BASE_URL}/api/company`, { name, email }, { timeout: 10000 });
            return { success: true };
        } catch {
            return fail(502, {
                success: false,
                error: 'Could not create company. Please check the backend and try again.',
                name,
                email
            });
        }
    }
};
