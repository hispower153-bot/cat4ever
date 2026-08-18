import type { Metadata } from 'next';
import QnaClient from './QnaClient';

export const metadata: Metadata = {
  title: 'Q&A — 궁금한 건 집사들에게',
  description: '고양이 관련 질문을 남기면 다른 집사들이 답해줘요.',
};

export default function Page() {
  return <QnaClient />;
}
