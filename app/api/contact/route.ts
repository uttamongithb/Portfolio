import { NextResponse } from 'next/server';
import { addContactToSheet } from '../../../lib/google-sheets';

export async function POST(req: Request) {
  try {
    const { name, email, mobile, project, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const fullMessage = project ? `[Project: ${project}]\n${message}` : message;

    await addContactToSheet(name, email, mobile || '', fullMessage);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error handling contact form:', error);
    return NextResponse.json({ error: 'Failed to send message', details: error.message }, { status: 500 });
  }
}
