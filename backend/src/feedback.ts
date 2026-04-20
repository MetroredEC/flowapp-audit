interface Env {
  DB: D1Database;
}

export const handleFeedback = {
  async list(req: Request, env: Env) {
    try {
      const url = new URL(req.url);
      const status = url.searchParams.get('status');
      const month = url.searchParams.get('month');

      let query = 'SELECT * FROM feedback WHERE 1=1';
      const params: any[] = [];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (month) {
        query += ' AND strftime("%Y-%m", due_date) = ?';
        params.push(month);
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
      const { admision, severity, responsible, dueDate, status, evidence } = data;

      const stmt = env.DB.prepare(
        `INSERT INTO feedback (admision, severity, responsible, due_date, status, evidence, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
      ).bind(admision, severity, responsible, dueDate, status || 'Pendiente', evidence);

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
      const { status, evidence } = data;

      const stmt = env.DB.prepare(
        `UPDATE feedback SET status = ?, evidence = ?, updated_at = datetime('now')
         WHERE id = ?`
      ).bind(status, evidence, id);

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
