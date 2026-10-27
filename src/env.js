import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  API_BASE_URL: {},
  AUTH0_DOMAIN: {},
  AUTH0_CLIENT_ID: {},
});