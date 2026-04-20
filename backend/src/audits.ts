interface Env {
  DB: D1Database;
  KV: KVNamespace;
}

export const handleAudits = {
  async list(req: Request, env: Env) {
    try {
      const url = new URL(req.url);
      const month = url.searchParams.get('month');
      const specialty = url.searchParams.get('specialty');
      
      let query = 'SELECT * FROM audits';
      const params: any[] = [];
      
      if (month) {
        query += ' WHERE strftime("%Y-%m", audit_date) = ?';
        params.push(month);
      }
      if (specialty) {
        query += month ? ' AND' : ' WHERE';
        query += ' specialty = ?';
        params.push(specialty);
      }
      
      const stmt = env.DB.prepare(query).bind(...params);
      const result = await stmt.all();
      
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },

  async create(req: Request, env: Env) {
    try {
      const data = await req.json() as any;
      const { admision, auditorId, specialty, medico, parameters, score, recommendation } = data;

      const stmt = env.DB.prepare(
        `INSERT INTO audits (admision, auditor_id, specialty, medico, parameters, score, recommendation, audit_date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
      ).bind(admision, auditorId, specialty, medico, JSON.stringify(parameters), score, recommendation);

      const result = await stmt.run();

      return new Response(JSON.stringify({ id: result.meta.last_row_id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },

  async get(req: Request, env: Env) {
    try {
      const { id } = req as any;
      const stmt = env.DB.prepare('SELECT * FROM audits WHERE id = ?').bind(id);
      const result = await stmt.first();

      if (!result) {
        return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
      }

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },

  async update(req: Request, env: Env) {
    try {
      const { id } = req as any;
      const data = await req.json() as any;
      const { score, recommendation, parameters } = data;

      const stmt = env.DB.prepare(
        `UPDATE audits SET score = ?, recommendation = ?, parameters = ?, updated_at = datetime('now')
         WHERE id = ?`
      ).bind(score, recommendation, JSON.stringify(parameters), id);

      await stmt.run();

      return new Response(JSON.stringify({ id, updated: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
