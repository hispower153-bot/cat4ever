import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: '로그인',
  description: '로그인하고 CatStar에 우리 냥이의 오늘을 남겨보세요.',
};

export default function Page() {
  return <LoginClient />;
}
