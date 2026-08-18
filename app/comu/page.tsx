import type { Metadata } from 'next';
import ComuClient from './ComuClient';

export const metadata: Metadata = {
  title: 'Comu — 집사들의 이야기 공간',
  description: '가벼운 일상부터 고민까지, 집사들이 자유롭게 나누는 공간.',
};

export default function Page() {
  return <ComuClient />;
}
