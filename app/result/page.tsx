import type { Metadata } from 'next';
import ResultClient from './ResultClient';

export const metadata: Metadata = {
  title: '오늘의 운세 결과',
  description: '우리 냥이의 오늘 운세 결과예요.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ResultClient />;
}
