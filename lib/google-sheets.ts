export async function addContactToSheet(name: string, email: string, mobile: string, message: string) {
  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbyuvPXocx-pwFGpwpNRw3EIWNDewhb1XC8pV5opWYqEHLM0zP1ViG6G8OBdmhwgGxsc/exec';

    const payload = {
      sheetName: 'Sheet1',
      source: 'portfolio-nextjs-contact-form',
      name,
      email,
      number: mobile && mobile.startsWith('+') ? "'" + mobile : mobile,
      subject: 'New Message from Portfolio NextJS',
      message,
      submittedAt: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets webhook failed: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error adding to Google Sheet:', error);
    throw error;
  }
}

export async function getContactsFromSheet() {
  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbyuvPXocx-pwFGpwpNRw3EIWNDewhb1XC8pV5opWYqEHLM0zP1ViG6G8OBdmhwgGxsc/exec';

    // Append sheetName query param if required by the webhook GET handler
    const readUrl = new URL(webhookUrl);
    readUrl.searchParams.set('sheetName', 'Sheet1');

    const response = await fetch(readUrl.toString(), { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Google Sheets webhook failed: ${response.status}`);
    }

    const rows = await response.json();
    
    // Convert array of objects to array of arrays to match existing component logic
    if (Array.isArray(rows)) {
      return rows.map((row: any) => [
        row.submittedAt || row.createdAt || '',
        row.name || row.firstName || '',
        row.email || '',
        row.number || row.mobile || '',
        row.message || row.subject || ''
      ]);
    }

    return [];
  } catch (error) {
    console.error('Error fetching from Google Sheet:', error);
    throw error;
  }
}
