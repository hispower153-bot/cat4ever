import type { Metadata } from 'next';
import GunghapClient from './GunghapClient';

export const metadata: Metadata = {
  title: '냥궁합 — 우리 냥이들의 케미',
  description: '두 냥이의 생년월일로 알아보는 오행 궁합. 우리 냥이와 친구네 냥이, 오늘의 케미는 어떨까요?',
};

export default function Page() {
  return <GunghapClient />;
}
