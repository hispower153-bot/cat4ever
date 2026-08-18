'use client';

import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';
import { createClient } from '@/lib/supabase/client';

export default function LoginClient() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      showToast('Supabase 설정이 아직 완료되지 않았어요. (.env.local 확인)');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      showToast('로그인 설정이 아직 완료되지 않았어요.');
      setLoading(false);
    }
    // 성공 시 Supabase가 자동으로 리디렉션하므로 별도 처리 불필요
  };

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      <div
        className="relative rounded-[28px] overflow-hidden min-h-[180px] flex items-end p-9 mt-2 mb-11 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(31,49,41,0.3) 0%, rgba(20,26,20,0.82) 100%), url('https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=1400&q=80')",
        }}
      >
        <div className="relative z-10">
          <p className="font-accent italic text-xs tracking-[2.5px] text-goldSoft mb-2.5">CAT4EVER</p>
          <h1 className="font-serif font-black text-xl text-cream leading-[1.5]">
            매일 아침, 우리 냥이의 오늘을 가장 먼저 만나보세요
          </h1>
        </div>
      </div>

      <div className="max-w-[440px] mx-auto">
        <div className="text-center mb-2">
          <div className="w-[52px] h-[52px] mx-auto mb-5 rounded-full border-[1.5px] border-rust flex items-center justify-center font-serif font-black text-xl text-rust">
            냥
          </div>
          <h2 className="font-serif text-xl text-forest mb-2.5">돌아왔네요, 집사님</h2>
          <p className="text-[13px] text-inkDim mb-8 leading-relaxed">
            로그인하고 CatStar에 우리 냥이의
            <br />
            오늘을 남겨보세요
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2.5 bg-forest text-cream rounded-full py-3.5 text-sm font-bold disabled:opacity-60"
          >
            <span className="w-5 text-center">G</span> {loading ? '연결 중...' : 'Google로 계속하기'}
          </button>
          <button
            onClick={() => showToast('Apple 로그인은 준비 중이에요')}
            className="flex items-center justify-center gap-2.5 bg-paper border border-line rounded-full py-3.5 text-sm font-bold opacity-45"
          >
            <span className="w-5 text-center">🍎</span> Apple로 계속하기
          </button>
          <button
            onClick={() => showToast('Microsoft 로그인은 준비 중이에요')}
            className="flex items-center justify-center gap-2.5 bg-paper border border-line rounded-full py-3.5 text-sm font-bold opacity-45"
          >
            <span className="w-5 text-center">⊞</span> Microsoft로 계속하기
          </button>
        </div>

        <div className="flex items-center gap-3 my-7 text-inkDim text-[11.5px]">
          <div className="flex-1 h-px bg-line" />
          또는
          <div className="flex-1 h-px bg-line" />
        </div>

        <div className="flex flex-col gap-2.5">
          <input
            type="email"
            placeholder="이메일 주소"
            className="bg-paper border border-line rounded-xl px-4 py-3.5 text-[13.5px] outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="bg-paper border border-line rounded-xl px-4 py-3.5 text-[13.5px] outline-none"
          />
          <button
            onClick={() => showToast('이메일 로그인은 곧 만나요 ✦')}
            className="bg-rust text-[#FBF3E8] rounded-full py-3.5 text-sm font-bold mt-1"
          >
            이메일로 계속하기
          </button>
        </div>

        <p className="text-center text-[11.5px] text-inkDim mt-8 leading-relaxed">
          계속 진행하면 냥사주의 <a className="text-forest">이용약관</a> 및{' '}
          <a className="text-forest">개인정보처리방침</a>에 동의하게 돼요
        </p>
      </div>
    </main>
  );
}
