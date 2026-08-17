import type { Metadata } from 'next';
import StarClient from './StarClient';

export const metadata: Metadata = {
  title: '별자리 — 태어난 월일로 보는 오늘',
  description: '태어난 월/일로 알아보는 우리 냥이의 서양 별자리 운세. 무료로 바로 확인해보세요.',
};

export default function Page() {
  return <StarClient />;
}
