import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const formatDatetime = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

export const formatMonth = (month: string): string => {
  return dayjs(month + '-01').format('MMMM YYYY');
};

export const getMonthYear = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM');
};

export const maskPatientName = (name: string): string => {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.map(part => {
    if (part.length <= 2) return part;
    return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
  }).join(' ');
};

export const maskHistoriaClinica = (hc: string): string => {
  if (!hc.length) return '';
  return '*'.repeat(Math.max(1, hc.length - 4)) + hc.slice(-4);
};

export const hashPatientId = (historiaClinica: string): string => {
  let hash = 0;
  for (let i = 0; i < historiaClinica.length; i++) {
    const char = historiaClinica.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

export const calculateScore = (parameters: Record<string, 0 | 1 | null>): number => {
  const values = Object.values(parameters);
  const validValues = values.filter(v => v !== null);
  if (validValues.length === 0) return 0;
  const ones = validValues.filter(v => v === 1).length;
  return Math.round((ones / validValues.length) * 100);
};

export const getMetaStatus = (value: number, target: number, tolerance: number = 5): 'green' | 'yellow' | 'red' => {
  const diff = Math.abs(value - target);
  if (diff <= tolerance) return 'green';
  if (diff <= tolerance * 2) return 'yellow';
  return 'red';
};

export const calculateReconsultRate = (orders: any[]): number => {
  if (!orders.length) return 0;
  
  const admisionMap = new Map<string, any[]>();
  orders.forEach(order => {
    if (!admisionMap.has(order.ADMISION)) {
      admisionMap.set(order.ADMISION, []);
    }
    admisionMap.get(order.ADMISION)!.push(order);
  });

  let reconsultCount = 0;
  admisionMap.forEach((ordersByAdmision) => {
    const specialtyMap = new Map<string, Date[]>();
    ordersByAdmision.forEach(order => {
      if (!specialtyMap.has(order.ESPECIALIDAD)) {
        specialtyMap.set(order.ESPECIALIDAD, []);
      }
      specialtyMap.get(order.ESPECIALIDAD)!.push(new Date(order['FECHA ADMISION']));
    });

    specialtyMap.forEach((dates) => {
      if (dates.length > 1) {
        dates.sort((a, b) => a.getTime() - b.getTime());
        for (let i = 0; i < dates.length - 1; i++) {
          const diffDays = (dates[i + 1].getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays <= 7) {
            reconsultCount++;
          }
        }
      }
    });
  });

  const uniquePatients = admisionMap.size;
  return uniquePatients > 0 ? Math.round((reconsultCount / uniquePatients) * 100) : 0;
};

export const generateAlertsFromOrders = (orders: any[]): any[] => {
  const alerts: any[] = [];

  orders.forEach((order) => {
    const { ADMISION, ESPECIALIDAD, FECHA_ADMISION, NOMBRE_MEDICO } = order;

    // Excess medications
    if (order['# RECETAS'] > 5) {
      alerts.push({
        type: 'EXCESS_MEDS',
        admision: ADMISION,
        specialty: ESPECIALIDAD,
        doctor: NOMBRE_MEDICO,
        date: FECHA_ADMISION,
        value: order['# RECETAS'],
        suggestedAction: 'Revisar pertinencia de medicamentos prescritos',
      });
    }

    // Excess lab tests
    if (order['# PEDIDOS LAB'] >= 5) {
      alerts.push({
        type: 'EXCESS_LAB',
        admision: ADMISION,
        specialty: ESPECIALIDAD,
        doctor: NOMBRE_MEDICO,
        date: FECHA_ADMISION,
        value: order['# PEDIDOS LAB'],
        suggestedAction: 'Evaluar pertinencia de estudios de laboratorio',
      });
    }

    // Excess imaging
    if (order['# PEDIDOS IMG'] >= 2) {
      alerts.push({
        type: 'EXCESS_IMAGING',
        admision: ADMISION,
        specialty: ESPECIALIDAD,
        doctor: NOMBRE_MEDICO,
        date: FECHA_ADMISION,
        value: order['# PEDIDOS IMG'],
        suggestedAction: 'Evaluar necesidad de estudios de imagen',
      });
    }
  });

  return alerts;
};

export const downloadJSON = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadCSV = (data: any[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const parseCSV = (content: string): any[] => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(';').map(h => h.trim().replace(/^\ufeff/, ''));
  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';').map(v => v.trim());
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }

  return data;
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const round = (num: number, decimals: number = 2): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
