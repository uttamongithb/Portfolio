'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './actions';
import styles from './admin.module.css';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div style={{ display: 'inline-flex', padding: '20px', background: 'rgba(34, 211, 238, 0.15)', borderRadius: '24px', color: '#22d3ee', marginBottom: '24px', boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}>
          <Lock size={36} strokeWidth={2.5} />
        </div>
        <h1>Admin Access</h1>
        <p>Please enter your credentials to continue</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input type="email" name="email" required placeholder="admin@portfolio.com" />
              <Mail size={18} style={{ position: 'absolute', right: '20px', top: '16px', color: '#94a3b8' }} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input type="password" name="password" required placeholder="••••••••" />
              <Lock size={18} style={{ position: 'absolute', right: '20px', top: '16px', color: '#94a3b8' }} />
            </div>
          </div>

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
