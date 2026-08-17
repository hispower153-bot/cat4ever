import type { Metadata } from 'next';
import TtiClient from './TtiClient';

export const metadata: Metadata = {
  title: '띠운세 — 태어난 해로 보는 오늘',
  description: '태어난 해로 알아보는 우리 냥이의 12간지 띠운세. 무료로 바로 확인해보세요.',
};

export default function Page() {
  return <TtiClient />;
}
