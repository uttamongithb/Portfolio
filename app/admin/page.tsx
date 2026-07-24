import { cookies } from 'next/headers';
import { getContactsFromSheet } from '../../lib/google-sheets';
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
  let error: string | null = null;

  try {
    contacts = await getContactsFromSheet();
  } catch (err: any) {
    error = err.message || 'Failed to fetch contacts';
  }

  return <AdminDashboard initialContacts={contacts} error={error} />;
}
