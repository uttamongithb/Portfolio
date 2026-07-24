'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from './actions';
import styles from './admin.module.css';
import { LogOut, Users, MessageSquare, Briefcase, Mail, Home, Menu, X, BookOpen } from 'lucide-react';

type AdminView = 'dashboard' | 'messages';

export default function AdminDashboard({ initialContacts, error }: { initialContacts: any[], error: string | null }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.refresh();
  }

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const SectionButton = ({ view, icon: Icon, label }: { view: AdminView, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveView(view); setSidebarOpen(false); }}
      style={{
        display: 'flex', width: '100%', alignItems: 'center', gap: '12px',
        padding: '12px 16px', borderRadius: '16px', fontSize: '14px', fontWeight: 600,
        transition: 'all 0.3s',
        background: activeView === view ? 'rgba(24,33,59,0.06)' : 'transparent',
        color: activeView === view ? '#18213b' : '#596278',
        border: activeView === view ? '1px solid rgba(24,33,59,0.1)' : '1px solid transparent',
        boxShadow: activeView === view ? '0 2px 5px rgba(24,33,59,0.05)' : 'none',
      }}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className={styles.dashboard} style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'rgba(255, 253, 250, 0.5)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(24,33,59, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(0)',
        transition: 'transform 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div className={styles.headerIcon}>
            <Briefcase size={24} strokeWidth={2.5} />
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#18213b', fontFamily: '"Baloo 2", cursive' }}>
            Mission Control
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <SectionButton view="dashboard" icon={Home} label="Dashboard" />
          <SectionButton view="messages" icon={MessageSquare} label="Contact Us Data" />
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className={styles.logoutBtn} style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header className={styles.header} style={{ borderBottom: '1px solid rgba(24,33,59, 0.1)', background: 'transparent' }}>
          <div>
            <h1 style={{ fontSize: '24px', margin: 0 }}>
              {activeView === 'dashboard' ? 'Overview' : 'Contact Us Data'}
            </h1>
            <p style={{ margin: '4px 0 0', color: '#596278', fontSize: '14px', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {activeView === 'dashboard' ? 'Overview of contact form data.' : 
               'Contact form submissions synced from Google Sheets.'}
            </p>
          </div>
        </header>

        <main className={styles.content} style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {error && (
            <div style={{ background: 'rgba(255, 109, 97, 0.1)', color: '#ff6d61', padding: '16px', borderRadius: '12px', marginBottom: '30px' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {activeView === 'dashboard' && (
            <>
              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon2}>
                    <MessageSquare size={32} strokeWidth={2.5} />
                  </div>
                  <div className={styles.statInfo}>
                    <h3>{initialContacts.length}</h3>
                    <p>Total Transmissions</p>
                  </div>
                </div>
              </div>

              <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <h2>Recent Transmissions ✦</h2>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {initialContacts.length === 0 ? (
                        <tr>
                          <td colSpan={5}>
                            <div className={styles.emptyState}>
                              <Mail size={48} />
                              <p>No messages received yet.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        initialContacts.slice().reverse().slice(0, 5).map((contact, index) => (
                          <tr key={index}>
                            <td style={{ whiteSpace: 'nowrap' }}>{contact[0] ? formatDate(contact[0]) : '-'}</td>
                            <td><strong>{contact[1] || '-'}</strong></td>
                            <td>{contact[2] || '-'}</td>
                            <td>{contact[3] || '-'}</td>
                            <td style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {contact[4] || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeView === 'messages' && (
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <h2>Contact Us Data</h2>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialContacts.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          <div className={styles.emptyState}>
                            <Mail size={48} />
                            <p>No messages received yet.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      initialContacts.slice().reverse().map((contact, index) => (
                        <tr key={index}>
                          <td style={{ whiteSpace: 'nowrap' }}>{contact[0] ? formatDate(contact[0]) : '-'}</td>
                          <td><strong>{contact[1] || '-'}</strong></td>
                          <td>
                            <a href={`mailto:${contact[2]}`} style={{ color: '#4d78ff', textDecoration: 'none', fontWeight: 600 }}>
                              {contact[2] || '-'}
                            </a>
                          </td>
                          <td>{contact[3] || '-'}</td>
                          <td style={{ maxWidth: '400px', lineHeight: '1.5' }}>
                            {contact[4] ? (
                              contact[4].startsWith('[Project:') ? (
                                <div>
                                  <span className={styles.badge} style={{ marginBottom: '8px' }}>
                                    {contact[4].split(']')[0].replace('[Project:', '').trim()}
                                  </span>
                                  <div>{contact[4].split(']').slice(1).join(']').trim()}</div>
                                </div>
                              ) : (
                                contact[4]
                              )
                            ) : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
