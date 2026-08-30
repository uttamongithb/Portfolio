import { cookies } from 'next/headers';
import { getContactsFromSheet, getVisitorsFromSheet } from '../../lib/google-sheets';
import AdminDashboard from './AdminDashboard';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Admin Panel | Portfolio',
  robots: 'noindex, nofollow',
};

export default async function AdminPage() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'authenticated';

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  let contacts: any[] = [];
  let visitors: any[] = [];
  let error: string | null = null;

  try {
    const [contactsData, visitorsData] = await Promise.all([
      getContactsFromSheet(),
      getVisitorsFromSheet(),
    ]);
    contacts = contactsData;
    visitors = visitorsData;
  } catch (err: any) {
    error = err.message || 'Failed to fetch data';
  }

  return <AdminDashboard initialContacts={contacts} initialVisitors={visitors} error={error} />;
}
