import axios from "axios";
import { error, fail } from '@sveltejs/kit';
import { API_BASE_URL } from '$app/env/private';

export async function load() {

    try {
        const [jobsResponse, companiesResponse] = await Promise.all([axios({
            method: "get",
            url: `${API_BASE_URL}/api/job`,
            timeout: 10000,
        }), axios({
            method: "get",
            url: `${API_BASE_URL}/api/company`,
            timeout: 10000,
        })]);

        return {
            jobs: jobsResponse.data,
            companies: companiesResponse.data
        };

    } catch {
        error(502, 'Could not load jobs. Please check that the backend is running.');
    }
}

export const actions = {
    createJob: async ({ request }) => {

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
                headers: {
                    "Content-Type": "application/json",
                },
                data: job,
                timeout: 10000,
            });

            return { success: true };
        } catch {
            return fail(502, {
                success: false,
                error: 'Could not create job'
            });
        }
    }
}
