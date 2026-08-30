import { NextResponse } from 'next/server';
import { addVisitorToSheet, VisitorData } from '../../../lib/google-sheets';

// Parse user-agent string to extract browser, OS, and device type
function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  // Detect browser
  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera';
  else if (ua.includes('Chrome/') && !ua.includes('Chromium')) browser = 'Chrome';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'IE';

  // Detect OS
  if (ua.includes('Windows NT 10')) os = 'Windows 10/11';
  else if (ua.includes('Windows NT')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('CrOS')) os = 'ChromeOS';

  // Detect device type
  if (ua.includes('Mobile') || ua.includes('Android') && !ua.includes('Tablet')) device = 'Mobile';
  else if (ua.includes('iPad') || ua.includes('Tablet')) device = 'Tablet';
  else if (ua.includes('Bot') || ua.includes('bot') || ua.includes('Crawler') || ua.includes('Spider')) device = 'Bot';

  return { browser, os, device };
}

// Get geolocation from IP using ip-api.com (free, no key needed)
async function getGeoFromIP(ip: string): Promise<{ city: string; region: string; country: string }> {
  const fallback = { city: 'Unknown', region: 'Unknown', country: 'Unknown' };

  // Skip lookup for localhost/private IPs
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === 'unknown') {
    return { city: 'Localhost', region: 'Local', country: 'Local' };
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country`, {
      signal: AbortSignal.timeout(3000), // 3s timeout
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    return {
      city: data.city || 'Unknown',
      region: data.regionName || 'Unknown',
      country: data.country || 'Unknown',
    };
  } catch {
    return fallback;
  }
}

export async function POST(req: Request) {
  try {
    const { page, referrer } = await req.json();

    // Extract IP from headers
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';

    // Extract User-Agent
    const userAgent = req.headers.get('user-agent') || '';
    const { browser, os, device } = parseUserAgent(userAgent);

    // Get geolocation from IP
    const geo = await getGeoFromIP(ip);

    const visitorData: VisitorData = {
      ip,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      browser,
      os,
      device,
      page: page || '/',
      referrer: referrer || 'Direct',
    };

    // Fire and forget — don't block the response
    addVisitorToSheet(visitorData).catch((err) =>
      console.error('Failed to log visitor:', err)
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
