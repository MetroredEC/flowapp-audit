export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  roles: string[];
  specialty?: string;
  center?: string;
}

export interface MedicalRecord {
  id: string;
  admision: string;
  fecha_admision: string;
  centro_medico: string;
  especialidad: string;
  medico: string;
  historia_clinica: string;
  nombres_completos: string;
  paciente_hash?: string;
}

export interface Assignment {
  id: string;
  admision: string;
  auditor_id: string;
  specialty: string;
  assignment_date: string;
  status: 'Asignada' | 'En Progreso' | 'Completada';
}

export interface AuditParameter {
  id: string;
  name: string;
  description: string;
  category: string;
  applicableSpecialties?: string[];
}

export interface Audit {
  id: string;
  admision: string;
  auditor_id: string;
  specialty: string;
  medico: string;
  parameters: Record<string, 0 | 1 | null>;
  score: number;
  recommendation?: string;
  audit_date: string;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  admision: string;
  severity: 'Baja' | 'Media' | 'Alta';
  responsible: string;
  due_date: string;
  status: 'Pendiente' | 'Enviado' | 'Cerrado';
  evidence?: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  admision: string;
  type: 'EXCESS_MEDS' | 'EXCESS_LAB' | 'EXCESS_IMAGING' | 'RECONSULT';
  specialty: string;
  doctor: string;
  alert_date: string;
  value?: number;
  suggested_action?: string;
  resolved: boolean;
}

export interface KPI {
  name: string;
  value: number;
  target: number;
  status: 'green' | 'yellow' | 'red';
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface Session {
  sessionId: string;
  user: User;
  expiresAt?: number;
  accessToken?: string;
}

export interface FilterOptions {
  month?: string;
  city?: string;
  specialty?: string;
  doctor?: string;
  auditor?: string;
  status?: string;
}
