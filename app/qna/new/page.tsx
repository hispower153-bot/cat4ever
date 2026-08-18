import type { Metadata } from 'next';
import QnaNewClient from './QnaNewClient';

export const metadata: Metadata = {
  title: '질문 등록하기',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <QnaNewClient />;
}
