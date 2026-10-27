import { requireLogin, requireAdmin, apiError } from '#lib/server/access.js';
import axios from "axios";
import { error, fail } from '@sveltejs/kit';
import { API_BASE_URL } from '$app/env/private';

export async function load({ locals }) {
    requireLogin(locals);
    const headers = { Authorization: `Bearer ${locals.jwt_token}` };

    try {
        const [jobsResponse, companiesResponse] = await Promise.all([axios({
            method: "get",
            url: `${API_BASE_URL}/api/job`,
            headers, timeout: 10000,
        }), locals.user?.user_roles?.includes('admin') ? axios({
            method: "get",
            url: `${API_BASE_URL}/api/company`,
            headers, timeout: 10000,
        }) : Promise.resolve({ data: [] })]);

        return {
            jobs: jobsResponse.data,
            companies: companiesResponse.data
        };

    } catch (cause) {
        apiError(cause);
    }
}

export const actions = {
    createJob: async ({ request, locals }) => {
        requireAdmin(locals);
        const headers = { Authorization: `Bearer ${locals.jwt_token}` };

        const data = await request.formData();
        const job = {
            title: String(data.get('title') ?? '').trim(),
            description: String(data.get('description') ?? '').trim(),
            earnings: parseFloat(data.get('earnings')),
            jobType: data.get('jobType'),
            companyId: data.get('companyId')
        };

        if (!job.title || !job.description || !job.companyId
            || !['TEST', 'IMPLEMENT', 'REVIEW', 'OTHER'].includes(job.jobType)
            || !Number.isFinite(job.earnings) || job.earnings < 0) {
            return fail(400, { success: false, error: 'Please complete all job fields with valid values.' });
        }

        try {
            await axios({
                method: "post",
                url: `${API_BASE_URL}/api/job`,
                data: job,
                headers, timeout: 10000,
            });

            return { success: true };
        } catch (cause) {
            if ([401, 403].includes(cause.response?.status)) apiError(cause);
            return fail(502, {
                success: false,
                error: 'Could not create job'
            });
        }
    }
}
