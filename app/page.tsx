import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: '냥사주 | 고양이 전용 사주·타로',
  description:
    '생년월일 하나로 시작하는 고양이 전용 사주·타로. 냥궁합, 띠운세, 별자리까지 — 우리 냥이의 오늘을 가장 먼저 만나보세요.',
};

export default function Page() {
  return <HomeClient />;
}
