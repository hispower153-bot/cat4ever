'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '../../components/ToastProvider';

function ResultContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const catName = searchParams.get('cat') || '우리 냥이';

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      <div className="max-w-narrow mx-auto">
        <div className="text-center pt-4 pb-9">
          <p className="font-accent italic text-[13px] tracking-[3px] text-rust mb-3.5">
            RESULT UNLOCKED
          </p>
          <h1 className="font-serif text-[28px] text-forest leading-[1.5]">
            <span className="text-gold">{catName}</span>의 오늘, 이렇게 나왔어요
          </h1>
        </div>

        {/* share card */}
        <div
          className="relative rounded-3xl overflow-hidden p-9 pb-8 mb-9 bg-cover bg-center text-cream"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(31,49,41,0.55) 0%, rgba(20,26,20,0.88) 100%), url('https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1000&q=80')",
          }}
        >
          <div className="flex justify-between items-center mb-7">
            <span className="font-serif font-black text-[13px] text-goldSoft">냥사주 · Cat4ever</span>
            <span className="font-mono text-[10px] text-cream/60">
              {new Date().toLocaleDateString('ko-KR')}
            </span>
          </div>
          <h2 className="font-serif text-xl leading-[1.55] mb-7">
            <span className="text-goldSoft">{catName}</span>는 오늘, 잔잔한 행운의 하루
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { label: '총운', pct: 78, color: 'bg-gold' },
              { label: '애정운', pct: 62, color: 'bg-pink' },
              { label: '재물운', pct: 91, color: 'bg-sage' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-[52px] text-xs text-cream/70">{s.label}</span>
                <div className="flex-1 h-[5px] bg-white/20 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
                <span className="w-8 text-right font-mono text-[11px] text-cream/70">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mb-11">
          <button
            onClick={() => showToast('이미지가 저장됐어요 🐾')}
            className="flex-1 border-[1.5px] border-forest text-forest rounded-full py-3.5 text-sm font-bold hover:bg-forest hover:text-cream transition-colors"
          >
            이미지 저장
          </button>
          <button
            onClick={() => showToast('카카오톡 공유창이 열려요')}
            className="flex-1 bg-forest text-cream rounded-full py-3.5 text-sm font-bold hover:bg-forestDeep transition-colors"
          >
            카톡으로 공유
          </button>
        </div>

        <div className="flex justify-between mb-11 px-1">
          {[
            { glyph: '🟡', label: 'LUCKY COLOR', value: '노랑' },
            { glyph: '🪟', label: 'LUCKY SPOT', value: '창가' },
            { glyph: '🐟', label: 'LUCKY ITEM', value: '참치 간식' },
          ].map((l) => (
            <div key={l.label} className="text-center">
              <span className="text-xl mb-2.5 block">{l.glyph}</span>
              <p className="text-[10px] text-inkDim mb-1 tracking-wide">{l.label}</p>
              <p className="text-[13.5px] font-bold text-forest">{l.value}</p>
            </div>
          ))}
        </div>

        <p className="font-mono text-[11px] tracking-[1.8px] text-inkDim mb-4">TAROT COLLECTION</p>
        <div className="bg-paper border border-line rounded-[20px] p-7 mb-9 shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-serif text-[15.5px] text-forest">은둔자 카드를 모았어요</h3>
            <span className="font-mono text-[11px] text-rust">3 / 78</span>
          </div>
          <div className="flex gap-2 mb-4.5">
            {['✦', '☾', '♜', '?', '?', '?', '?', '?'].map((g, i) => (
              <div
                key={i}
                className={`w-8 h-12 rounded-md flex items-center justify-center text-[11px] ${
                  i < 3
                    ? 'bg-gradient-to-br from-gold to-rust text-ink'
                    : 'bg-gradient-to-br from-forest to-forestDeep text-goldSoft border border-gold/30'
                }`}
              >
                {g}
              </div>
            ))}
          </div>
          <div className="h-1 bg-black/5 rounded-full overflow-hidden mb-3">
            <div className="h-full w-[4%] bg-rust rounded-full" />
          </div>
          <p className="text-xs text-inkDim leading-relaxed">
            내일 다시 뽑으면 새로운 카드를 모을 수 있어요
          </p>
        </div>

        <div className="bg-rust/[0.08] rounded-2xl p-6 mb-9 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-rust/15 text-rust flex items-center justify-center text-lg flex-shrink-0">
            📷
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-forest mb-1">오늘의 {catName}, 기록해둘까요?</h4>
            <p className="text-xs text-inkDim leading-relaxed">운세 요약이 채워진 채로 CatStar에 남겨보세요</p>
          </div>
          <Link
            href="/login"
            className="bg-rust text-[#FBF3E8] rounded-full px-4 py-2.5 text-xs font-bold whitespace-nowrap"
          >
            기록하기
          </Link>
        </div>

        <div className="flex gap-3">
          <Link
            href="/gunghap"
            className="flex-1 text-center bg-paper border border-line rounded-2xl py-4 text-[12.5px] text-inkDim"
          >
            <span className="block text-base mb-1.5">♡</span>냥궁합 보기
          </Link>
          <Link
            href="/tti"
            className="flex-1 text-center bg-paper border border-line rounded-2xl py-4 text-[12.5px] text-inkDim"
          >
            <span className="block text-base mb-1.5">爪</span>띠운세 보기
          </Link>
          <Link
            href="/"
            className="flex-1 text-center bg-paper border border-line rounded-2xl py-4 text-[12.5px] text-inkDim"
          >
            <span className="block text-base mb-1.5">🏠</span>홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultClient() {
  return (
    <Suspense fallback={null}>
      <ResultContent />
    </Suspense>
  );
}
