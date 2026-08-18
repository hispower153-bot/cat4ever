import type { Metadata } from 'next';
import CatStarNewClient from './CatStarNewClient';

export const metadata: Metadata = {
  title: '오늘의 순간 기록하기',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CatStarNewClient />;
}
