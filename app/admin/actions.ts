'use server';

import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  } else {
    return { error: 'Invalid credentials' };
  }
}

export async function logout() {
  cookies().delete('admin_auth');
}
