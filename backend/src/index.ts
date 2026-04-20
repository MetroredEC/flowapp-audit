import { Router } from 'itty-router';
import { handleAuth } from './auth';
import { handleAudits } from './audits';
import { handleAssignments } from './assignments';
import { handleFeedback } from './feedback';
import { handleOrders } from './orders';

interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  KV: KVNamespace;
  ENTRA_TENANT_ID: string;
  ENTRA_CLIENT_ID: string;
  ENTRA_API_AUDIENCE: string;
  ALLOWED_ORIGINS: string;
  PLATFORM_URL: string;
  APP_ENV: string;
}

const router = Router();

// CORS middleware
const corsHeaders = (origin: string, env: Env) => {
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
};

// OPTIONS para preflight
router.options('*', (req, env: Env) => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get('origin') || '', env),
  });
});

// Health check
router.get('/api/health', () => {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// Auth endpoints
router.post('/api/auth/login', (req, env: Env) => handleAuth.login(req, env));
router.post('/api/auth/callback', (req, env: Env) => handleAuth.callback(req, env));
router.post('/api/auth/logout', (req, env: Env) => handleAuth.logout(req, env));
router.get('/api/auth/me', (req, env: Env) => handleAuth.me(req, env));

// Audit endpoints
router.get('/api/audits', (req, env: Env) => handleAudits.list(req, env));
router.post('/api/audits', (req, env: Env) => handleAudits.create(req, env));
router.get('/api/audits/:id', (req, env: Env) => handleAudits.get(req, env));
router.put('/api/audits/:id', (req, env: Env) => handleAudits.update(req, env));

// Assignment endpoints
router.get('/api/assignments', (req, env: Env) => handleAssignments.list(req, env));
router.post('/api/assignments', (req, env: Env) => handleAssignments.create(req, env));
router.put('/api/assignments/:id', (req, env: Env) => handleAssignments.update(req, env));

// Feedback endpoints
router.get('/api/feedback', (req, env: Env) => handleFeedback.list(req, env));
router.post('/api/feedback', (req, env: Env) => handleFeedback.create(req, env));
router.put('/api/feedback/:id', (req, env: Env) => handleFeedback.update(req, env));

// Orders/Alerts endpoints
router.post('/api/orders/process', (req, env: Env) => handleOrders.process(req, env));
router.get('/api/alerts', (req, env: Env) => handleOrders.listAlerts(req, env));

// File upload
router.post('/api/files/upload', (req, env: Env) => handleFiles.upload(req, env));

// 404
router.all('*', () => new Response('Not Found', { status: 404 }));

// Main handler
export default {
  fetch: async (request: Request, env: Env, ctx: ExecutionContext) => {
    const origin = request.headers.get('origin') || '';
    
    try {
      const response = await router.handle(request, env, ctx);
      const corsHeaders_ = corsHeaders(origin, env);
      
      const newResponse = new Response(response.body, response);
      Object.entries(corsHeaders_).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });
      
      return newResponse;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal Server Error', details: String(error) }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin, env) }
        }
      );
    }
  },
};
