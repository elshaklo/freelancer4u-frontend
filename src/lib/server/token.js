import { createRemoteJWKSet, jwtVerify } from 'jose';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '$app/env/private';
const issuer = `https://${AUTH0_DOMAIN}/`;
const keys = createRemoteJWKSet(new URL(`${issuer}.well-known/jwks.json`));
export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, keys, {
    issuer, audience: AUTH0_CLIENT_ID, algorithms: ['RS256']
  });
  return payload;
}
