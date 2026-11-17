import { requireLogin, requireAdmin, apiError } from '#lib/server/access.js';
import axios from "axios";
import { error, fail } from '@sveltejs/kit';
import { API_BASE_URL } from '$app/env/private';

export async function load({ url, locals }) {
    requireLogin(locals);
    const headers = { Authorization: `Bearer ${locals.jwt_token}` };
    const currentPage = Number(url.searchParams.get('pageNumber') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 4);
    if (!Number.isInteger(currentPage) || currentPage < 1 || !Number.isInteger(pageSize) || pageSize < 1) {
        error(400, 'Invalid pagination parameters');
    }

    try {
        const [jobsResponse, companiesResponse] = await Promise.all([axios({
            method: "get",
            url: `${API_BASE_URL}/api/job`,
            params: { pageNumber: currentPage, pageSize, min: url.searchParams.get("min") ?? undefined, type: url.searchParams.get("type") ?? undefined },
            headers, timeout: 10000,
        }), locals.user?.user_roles?.includes('admin') ? axios({
            method: "get",
            url: `${API_BASE_URL}/api/company`,
            params: { pageSize: 100, pageNumber: 1 },
            headers, timeout: 10000,
        }) : Promise.resolve({ data: { content: [], totalPages: 0 } })]);

        const companies = [...companiesResponse.data.content];
        for (let page = 2; page <= companiesResponse.data.totalPages; page++) {
            const response = await axios.get(`${API_BASE_URL}/api/company`, {
                headers, timeout: 10000, params: { pageNumber: page, pageSize: 100 }
            });
            companies.push(...response.data.content);
        }
        return {
            currentPage, pageSize, nrOfPages: jobsResponse.data.totalPages,
            jobs: jobsResponse.data.content,
            companies
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
    },
    assignToMe: async ({ request, locals }) => {
        requireLogin(locals);
        const data = await request.formData();
        const jobId = String(data.get('jobId') ?? '').trim();
        if (!jobId) return fail(400, { error: 'Job is required.' });
        try {
            await axios.put(`${API_BASE_URL}/api/service/me/assignjob`, null, {
                params: { jobId },
                headers: { Authorization: `Bearer ${locals.jwt_token}` }, timeout: 10000
            });
            return { message: 'Job assigned successfully.' };
        } catch (cause) {
            if ([401, 403].includes(cause.response?.status)) apiError(cause);
            return fail(cause.response?.status === 400 ? 400 : 502, { error: 'Could not assign job. Please reload and try again.' });
        }
    },
    completeMyJob: async ({ request, locals }) => {
        requireLogin(locals);
        const data = await request.formData();
        const jobId = String(data.get('jobId') ?? '').trim();
        if (!jobId) return fail(400, { error: 'Job is required.' });
        try {
            await axios.put(`${API_BASE_URL}/api/service/me/completejob`, null, {
                params: { jobId },
                headers: { Authorization: `Bearer ${locals.jwt_token}` }, timeout: 10000
            });
            return { message: 'Job completed successfully.' };
        } catch (cause) {
            if ([401, 403].includes(cause.response?.status)) apiError(cause);
            return fail(cause.response?.status === 400 ? 400 : 502, { error: 'Could not complete job. Please reload and try again.' });
        }
    }
}
