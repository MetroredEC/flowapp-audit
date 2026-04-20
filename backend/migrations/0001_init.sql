-- Migration: Create initial schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  entra_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  roles TEXT, -- JSON array of roles
  specialty TEXT,
  center TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Medical records (historias clinicas)
CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admision TEXT UNIQUE NOT NULL,
  fecha_admision DATE NOT NULL,
  centro_medico TEXT NOT NULL,
  especialidad TEXT NOT NULL,
  medico TEXT NOT NULL,
  historia_clinica TEXT NOT NULL,
  paciente_nombre TEXT NOT NULL,
  paciente_hash TEXT, -- Hash of historia_clinica for privacy
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(admision)
);

-- Assignments (asignaciones de historias a auditores)
CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admision TEXT NOT NULL,
  auditor_id TEXT NOT NULL,
  specialty TEXT NOT NULL,
  assignment_date DATE NOT NULL,
  status TEXT DEFAULT 'Asignada',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (auditor_id) REFERENCES users(id),
  FOREIGN KEY (admision) REFERENCES records(admision)
);

-- Audits (auditorías)
CREATE TABLE IF NOT EXISTS audits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admision TEXT NOT NULL,
  auditor_id TEXT NOT NULL,
  specialty TEXT NOT NULL,
  medico TEXT NOT NULL,
  parameters TEXT, -- JSON with 1/0/null values
  score REAL, -- 0-100
  recommendation TEXT,
  audit_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (auditor_id) REFERENCES users(id),
  FOREIGN KEY (admision) REFERENCES records(admision)
);

-- Feedback/Findings (retroalimentación)
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admision TEXT NOT NULL,
  severity TEXT, -- 'Baja', 'Media', 'Alta'
  responsible TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'Pendiente', -- 'Pendiente', 'Enviado', 'Cerrado'
  evidence TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admision) REFERENCES records(admision)
);

-- Orders/Orders data (datos de pedidos)
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admision TEXT NOT NULL,
  fecha_admision DATE NOT NULL,
  centro_medico TEXT NOT NULL,
  especialidad TEXT NOT NULL,
  medico TEXT NOT NULL,
  diag_principal TEXT,
  pedidos_img INTEGER DEFAULT 0,
  pedidos_lab INTEGER DEFAULT 0,
  recetas INTEGER DEFAULT 0,
  diagnosticos INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(admision)
);

-- Alerts (alertas generadas de pedidos)
CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admision TEXT NOT NULL,
  type TEXT NOT NULL, -- 'EXCESS_MEDS', 'EXCESS_LAB', 'EXCESS_IMAGING', 'RECONSULT'
  specialty TEXT NOT NULL,
  doctor TEXT NOT NULL,
  alert_date DATE NOT NULL,
  value INTEGER, -- cantidad excesiva
  suggested_action TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admision) REFERENCES orders(admision)
);

-- KPIs cache (para performance)
CREATE TABLE IF NOT EXISTS kpis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL, -- YYYY-MM
  metric_name TEXT NOT NULL,
  value REAL NOT NULL,
  target REAL,
  status TEXT, -- 'green', 'yellow', 'red'
  filters TEXT, -- JSON with city, specialty, doctor filters
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(month, metric_name, filters)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignments_auditor ON assignments(auditor_id);
CREATE INDEX IF NOT EXISTS idx_assignments_month ON assignments(assignment_date);
CREATE INDEX IF NOT EXISTS idx_audits_auditor ON audits(auditor_id);
CREATE INDEX IF NOT EXISTS idx_audits_month ON audits(audit_date);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_month ON feedback(due_date);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_month ON alerts(alert_date);
CREATE INDEX IF NOT EXISTS idx_records_month ON records(fecha_admision);
CREATE INDEX IF NOT EXISTS idx_records_specialty ON records(especialidad);
