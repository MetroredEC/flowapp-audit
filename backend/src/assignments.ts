interface Env {
  DB: D1Database;
}

export const handleAssignments = {
  async list(req: Request, env: Env) {
    try {
      const url = new URL(req.url);
      const month = url.searchParams.get('month');
      const auditorId = url.searchParams.get('auditorId');

      let query = 'SELECT * FROM assignments';
      const params: any[] = [];

      if (month) {
        query += ' WHERE strftime("%Y-%m", assignment_date) = ?';
        params.push(month);
      }
      if (auditorId) {
        query += month ? ' AND' : ' WHERE';
        query += ' auditor_id = ?';
        params.push(auditorId);
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
      const { admision, auditorId, specialty } = data;

      const stmt = env.DB.prepare(
        `INSERT INTO assignments (admision, auditor_id, specialty, assignment_date, created_at)
         VALUES (?, ?, ?, datetime('now'), datetime('now'))`
      ).bind(admision, auditorId, specialty);

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

  async update(req: Request, env: Env) {
    try {
      const { id } = req as any;
      const data = await req.json() as any;
      const { auditorId } = data;

      const stmt = env.DB.prepare(
        'UPDATE assignments SET auditor_id = ?, updated_at = datetime("now") WHERE id = ?'
      ).bind(auditorId, id);

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
