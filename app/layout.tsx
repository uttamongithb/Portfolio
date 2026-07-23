import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.uttambhartiya.in'),
  title: 'Uttam Kumar Bhartiya - Software Engineer & Full Stack Developer',
  description:
    'Uttam Kumar Bhartiya is a software engineer and full stack developer specializing in React, Next.js, Node.js, MERN, JavaScript, TypeScript, PHP and AI-powered web applications.',
  keywords: [
    'uttam',
    'uttam bharti',
    'uttam kumar bhartiya',
    'uttam developer',
    'uttam full stack developer',
    'uttam hacker',
    'web developer',
    'software engineer',
    'full stack web developer',
  ],
  authors: [{ name: 'Uttam Kumar Bhartiya' }],
  creator: 'Uttam Kumar Bhartiya',
  publisher: 'Uttam Kumar Bhartiya',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.uttambhartiya.in/',
    siteName: 'Uttam Kumar Bhartiya',
    title: 'Uttam Kumar Bhartiya - Software Engineer & Full Stack Developer',
    description:
      'Software Engineer and Full Stack Developer specializing in React, Next.js, Node.js, MERN, TypeScript, PHP and AI-powered web applications.',
    images: [
      {
        url: '/uttam-kumar-bhartiya.jpg',
        width: 626,
        height: 933,
        alt: 'Uttam Kumar Bhartiya, Software Engineer and Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uttam Kumar Bhartiya - Software Engineer & Full Stack Developer',
    description:
      'Software Engineer and Full Stack Developer specializing in React, Next.js, Node.js, MERN and AI development.',
    images: ['/uttam-kumar-bhartiya.jpg'],
  },
  icons: {
    icon: [
      {
        url: '/favicon.png?v=2',
        type: 'image/png',
      },
    ],
    shortcut: ['/favicon.png?v=2'],
    apple: [
      {
        url: '/favicon.png?v=2',
        type: 'image/png',
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
