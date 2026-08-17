import type { Metadata } from 'next';
import './globals.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ToastProvider from '../components/ToastProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';

const SITE_URL = 'https://cat4ever.vercel.app';
const SITE_TITLE = '냥사주 | 고양이 전용 사주·타로';
const SITE_DESCRIPTION =
  '생년월일 하나로 시작하는 고양이 전용 사주·타로. 냥궁합, 띠운세, 별자리까지 — 우리 냥이의 오늘을 가장 먼저 만나보세요.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | 냥사주',
  },
  description: SITE_DESCRIPTION,
  keywords: ['고양이 사주', '냥사주', '고양이 타로', '냥궁합', '고양이 운세', '반려묘 사주'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: '냥사주',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '냥사주' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <ToastProvider>
          <Nav />
          {children}
          <Footer />
        </ToastProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
