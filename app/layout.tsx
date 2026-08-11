import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '냥사주 | 고양이 운세',
  description: '오늘의 고양이 운세를 확인해보세요',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
