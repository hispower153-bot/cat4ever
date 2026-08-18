import type { Metadata } from 'next';
import ComuNewClient from './ComuNewClient';

export const metadata: Metadata = {
  title: '글쓰기',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ComuNewClient />;
}
