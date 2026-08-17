import type { Metadata } from 'next';
import SajuTaroClient from './SajuTaroClient';

export const metadata: Metadata = {
  title: '고양이 사주·타로 보기',
  description: '생년월일시로 정확하게 계산한 우리 냥이의 오늘 사주, 또는 카드 한 장으로 보는 타로 운세.',
};

export default function Page() {
  return <SajuTaroClient />;
}
