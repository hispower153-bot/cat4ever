import type { Metadata } from 'next';
import CatStarClient from './CatStarClient';

export const metadata: Metadata = {
  title: 'CatStar — 오늘, 우리 냥이들',
  description: '전국 집사들이 남긴 오늘의 순간들. 우리 냥이의 오늘도 CatStar에 기록해보세요.',
};

export default function Page() {
  return <CatStarClient />;
}
