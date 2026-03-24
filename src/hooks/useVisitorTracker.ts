import { useEffect } from 'react';

const STORAGE_KEY = 'ffk_visitors';

interface VisitRecord {
  date: string;
  page: string;
  timestamp: number;
}

export const trackVisit = (page: string) => {
  try {
    const records: VisitRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    records.push({ date: new Date().toISOString().split('T')[0], page, timestamp: Date.now() });
    // Keep last 10000 records
    const trimmed = records.slice(-10000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
};

export const getVisitorStats = () => {
  try {
    const records: VisitRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.date === today);

    // Last 7 days
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayRecords = records.filter(r => r.date === dateStr);
      last7.push({ date: dateStr, label: d.toLocaleDateString('sq-AL', { weekday: 'short' }), visits: dayRecords.length });
    }

    // Per page
    const pageMap = new Map<string, number>();
    records.forEach(r => { pageMap.set(r.page, (pageMap.get(r.page) || 0) + 1); });
    const topPages = Array.from(pageMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([page, count]) => ({ page, count }));

    // Unique visitors (by day - rough estimate)
    const uniqueDays = new Set(records.map(r => r.date)).size;

    return {
      total: records.length,
      today: todayRecords.length,
      last7,
      topPages,
      uniqueDays,
    };
  } catch {
    return { total: 0, today: 0, last7: [], topPages: [], uniqueDays: 0 };
  }
};

export const useVisitorTracker = (page: string) => {
  useEffect(() => {
    trackVisit(page);
  }, [page]);
};