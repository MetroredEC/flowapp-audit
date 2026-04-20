interface Env {
  DB: D1Database;
}

export const handleOrders = {
  async process(req: Request, env: Env) {
    try {
      const data = await req.json() as any;
      const { rows } = data; // Array of order data

      const alerts: any[] = [];

      for (const row of rows) {
        const {
          ADMISION,
          ESPECIALIDAD,
          FECHA_ADMISION,
          NOMBRE_MEDICO,
          '# PEDIDOS IMG': pedidosImg,
          '# PEDIDOS LAB': pedidosLab,
          '# RECETAS': recetas,
        } = row;

        // Check for excess medication
        if (recetas > 5) {
          alerts.push({
            type: 'EXCESS_MEDS',
            admision: ADMISION,
            specialty: ESPECIALIDAD,
            doctor: NOMBRE_MEDICO,
            date: FECHA_ADMISION,
            value: recetas,
            suggestedAction: 'Revisar pertinencia de medicamentos prescritos',
          });
        }

        // Check for excess lab tests
        if (pedidosLab >= 5) {
          alerts.push({
            type: 'EXCESS_LAB',
            admision: ADMISION,
            specialty: ESPECIALIDAD,
            doctor: NOMBRE_MEDICO,
            date: FECHA_ADMISION,
            value: pedidosLab,
            suggestedAction: 'Evaluar pertinencia de estudios de laboratorio',
          });
        }

        // Check for excess imaging
        if (pedidosImg >= 2) {
          alerts.push({
            type: 'EXCESS_IMAGING',
            admision: ADMISION,
            specialty: ESPECIALIDAD,
            doctor: NOMBRE_MEDICO,
            date: FECHA_ADMISION,
            value: pedidosImg,
            suggestedAction: 'Evaluar necesidad de estudios de imagen',
          });
        }
      }

      // Store alerts in DB
      for (const alert of alerts) {
        const stmt = env.DB.prepare(
          `INSERT INTO alerts (admision, type, specialty, doctor, alert_date, value, suggested_action, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        ).bind(
          alert.admision,
          alert.type,
          alert.specialty,
          alert.doctor,
          alert.date,
          alert.value,
          alert.suggestedAction
        );
        
        await stmt.run();
      }

      return new Response(JSON.stringify({ processed: rows.length, alerts: alerts.length }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },

  async listAlerts(req: Request, env: Env) {
    try {
      const url = new URL(req.url);
      const type = url.searchParams.get('type');
      const month = url.searchParams.get('month');

      let query = 'SELECT * FROM alerts WHERE 1=1';
      const params: any[] = [];

      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }
      if (month) {
        query += ' AND strftime("%Y-%m", alert_date) = ?';
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
};
