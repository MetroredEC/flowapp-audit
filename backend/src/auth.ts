import { jwtVerify } from 'jose';

interface Env {
  DB: D1Database;
  KV: KVNamespace;
  ENTRA_TENANT_ID: string;
  ENTRA_CLIENT_ID: string;
  ENTRA_API_AUDIENCE: string;
  PLATFORM_URL: string;
}

interface JWTPayload {
  oid: string;
  unique_name: string;
  name: string;
  email: string;
  roles?: string[];
}

const JWKS_URL = (tenantId: string) =>
  `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;

let cachedJWKS: any = null;
let cachedJWKSTime = 0;
const JWKS_CACHE_TTL = 3600000; // 1 hora

async function getJWKS(tenantId: string) {
  const now = Date.now();
  if (cachedJWKS && now - cachedJWKSTime < JWKS_CACHE_TTL) {
    return cachedJWKS;
  }

  const response = await fetch(JWKS_URL(tenantId));
  if (!response.ok) throw new Error('Failed to fetch JWKS');
  
  cachedJWKS = await response.json();
  cachedJWKSTime = now;
  return cachedJWKS;
}

async function verifyToken(token: string, env: Env): Promise<JWTPayload> {
  try {
    // Remove "Bearer " prefix if present
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const jwks = await getJWKS(env.ENTRA_TENANT_ID);
    
    // Decode header to get kid
    const [headerB64] = actualToken.split('.');
    const header = JSON.parse(atob(headerB64));
    
    // Find matching key
    const key = jwks.keys.find((k: any) => k.kid === header.kid);
    if (!key) throw new Error('Key not found in JWKS');
    
    // Build key for jose
    const publicKey = await importSPKI(
      `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`,
      'RS256'
    );
    
    const verified = await jwtVerify(actualToken, publicKey, {
      audience: env.ENTRA_API_AUDIENCE,
      issuer: `https://login.microsoftonline.com/${env.ENTRA_TENANT_ID}/v2.0`,
    });
    
    return verified.payload as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Unauthorized');
  }
}

// Fallback for certificate parsing (jose might not have importSPKI)
async function importSPKI(spki: string, alg: string): Promise<CryptoKey> {
  const binaryString = atob(spki.replace(/-----BEGIN CERTIFICATE-----\n/, '').replace(/\n-----END CERTIFICATE-----/, ''));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return await crypto.subtle.importKey(
    'spki',
    bytes.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    true,
    ['verify']
  );
}

export const handleAuth = {
  async login(req: Request, env: Env) {
    const { code, redirectUri } = await req.json() as any;
    
    try {
      const tokenResponse = await fetch(
        `https://login.microsoftonline.com/${env.ENTRA_TENANT_ID}/oauth2/v2.0/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: env.ENTRA_CLIENT_ID,
            scope: 'api://66130291-fc50-43f1-943c-6818dac1ba99/.default',
            code,
            redirect_uri: redirectUri || env.PLATFORM_URL,
            grant_type: 'authorization_code',
            // NOTE: In production, use client secret from secure storage
          }).toString(),
        }
      );

      if (!tokenResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to get token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const tokens = await tokenResponse.json() as any;
      const payload = await verifyToken(tokens.access_token, env);

      // Store user session in KV
      const sessionId = crypto.randomUUID();
      await env.KV.put(
        `session:${sessionId}`,
        JSON.stringify({
          userId: payload.oid,
          username: payload.unique_name,
          name: payload.name,
          email: payload.email,
          roles: payload.roles || ['Auditor'],
          accessToken: tokens.access_token,
          expiresAt: Date.now() + (tokens.expires_in * 1000),
        }),
        { expirationTtl: tokens.expires_in }
      );

      return new Response(
        JSON.stringify({
          sessionId,
          user: {
            id: payload.oid,
            username: payload.unique_name,
            name: payload.name,
            email: payload.email,
            roles: payload.roles || ['Auditor'],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Login error:', error);
      return new Response(
        JSON.stringify({ error: 'Authentication failed', details: String(error) }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },

  async callback(req: Request, env: Env) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    return handleAuth.login(
      new Request(new URL('/api/auth/login', url), {
        method: 'POST',
        body: JSON.stringify({
          code,
          redirectUri: `${env.PLATFORM_URL}/auth/callback`,
        }),
      }),
      env
    );
  },

  async logout(req: Request, env: Env) {
    const sessionId = req.headers.get('X-Session-ID');
    if (sessionId) {
      await env.KV.delete(`session:${sessionId}`);
    }
    return new Response(JSON.stringify({ message: 'Logged out' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },

  async me(req: Request, env: Env) {
    const sessionId = req.headers.get('X-Session-ID');
    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = await env.KV.get(`session:${sessionId}`, 'json') as any;
    if (!session) {
      return new Response(JSON.stringify({ error: 'Session expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
