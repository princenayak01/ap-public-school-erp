// API Client for A. P PUBLIC SCHOOL ERP
// Attach the server-issued access token to dashboard API requests.
export async function authenticatedFetch(input: RequestInfo | URL, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  const token = typeof window !== 'undefined' ? localStorage.getItem('apps_token') : null;
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, {
    ...options,
    headers,
    cache: options.cache || 'no-store',
  });
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('apps_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn(`[API_FETCH_FALLBACK] ${endpoint}:`, err.message);
    return { success: false, fallback: true, error: err.message };
  }
}

// Fallback Mock Data for instant resilient frontend rendering
export const fallbackPrincipalData = {
  kpis: {
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalAdmins: 1,
    presentToday: 0,
    absentToday: 0,
    attendanceRate: 0,
    totalBilled: 0,
    totalCollected: 0,
    totalPending: 0,
    collectionRate: '0.0',
  },
  classDistribution: [
    { classId: '1', className: 'Nursery', studentCount: 0 },
    { classId: '2', className: 'LKG', studentCount: 0 },
    { classId: '3', className: 'UKG', studentCount: 0 },
    { classId: '4', className: 'Class 1', studentCount: 0 },
    { classId: '5', className: 'Class 2', studentCount: 0 },
    { classId: '6', className: 'Class 3', studentCount: 0 },
    { classId: '7', className: 'Class 4', studentCount: 0 },
    { classId: '8', className: 'Class 5', studentCount: 0 },
    { classId: '9', className: 'Class 6', studentCount: 0 },
    { classId: '10', className: 'Class 7', studentCount: 0 },
    { classId: '11', className: 'Class 8', studentCount: 0 },
  ],
  recentAdmissions: [],
  recentPayments: [],
  upcomingExams: [
    { id: '1', name: 'Periodic Assessment 1', term: 'TERM_1', startDate: '2026-05-15', endDate: '2026-05-22' },
    { id: '2', name: 'Mid-Term Examination 2026', term: 'MID_TERM', startDate: '2026-09-10', endDate: '2026-09-20' },
  ],
};
