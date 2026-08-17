'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/ToastProvider';

const miniFeatures = [
  { key: 'gunghap', icon: '♡', title: '냥궁합', badge: 'bg-pink/20 text-pink', href: '/gunghap' },
  { key: 'tti', icon: '爪', title: '띠운세', badge: 'bg-amber/20 text-amber', href: '/tti' },
  { key: 'star', icon: '✦', title: '별자리', badge: 'bg-violet/20 text-violet', href: '/star' },
];

const communityPosts = [
  { cls: 'from-[#D9C89A] to-[#B8965A]', emoji: '🐈', cap: '창가 명상 중', who: '나비 · 혜영 집사' },
  { cls: 'from-[#A8B896] to-[#6F8259]', emoji: '😺', cap: '간식 쟁탈전', who: '두부 · 준영 집사' },
  { cls: 'from-[#C9A8A0] to-[#A8695C]', emoji: '🐾', cap: '박스가 최고야', who: '콩이 · 수민 집사' },
  { cls: 'from-[#A0B8C0] to-[#5C8299]', emoji: '🐈‍⬛', cap: '낮잠 3시간째', who: '모카 · 지훈 집사' },
];

export default function HomeClient() {
  const { showToast } = useToast();
  const router = useRouter();
  const [ownerName, setOwnerName] = useState('');
  const [catName, setCatName] = useState('');

  const startJourney = () => {
    const params = new URLSearchParams();
    if (ownerName) params.set('owner', ownerName);
    if (catName) params.set('cat', catName);
    router.push(`/saju-tarot?${params.toString()}`);
  };

  return (
    <main className="max-w-site mx-auto px-8">
      {/* Hero */}
      <div className="text-center pt-5 pb-12">
        <p className="font-accent italic text-[13px] tracking-[3px] text-rust mb-4">
          SAJU · TAROT · YOUR CAT&apos;S DESTINY
        </p>
        <h1 className="font-serif font-black text-3xl md:text-[40px] leading-[1.4] text-forest mb-4">
          우리 냥이의 오늘,
          <br />
          별과 사주가 <span className="text-gold">먼저</span> 알고 있어요
        </h1>
        <p className="text-[15px] text-inkDim">
          생년월일 하나로 시작하는 고양이 전용 사주 · 타로
        </p>
      </div>

      {/* Bento: saju | tarot | mini stack */}
      <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr_68px] gap-3 mb-5 items-stretch">
        <Link
          href="/saju-tarot"
          className="h-full bg-gradient-to-br from-forest to-forestDeep border border-amber/35 rounded-[20px] p-8 relative overflow-hidden shadow-[0_14px_32px_rgba(31,49,41,0.25)] hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(31,49,41,0.32)] transition-all"
        >
          <span className="font-mono text-[11px] tracking-[2px] px-2.5 py-1 rounded-full inline-block mb-4 text-amber bg-amber/15">
            SAJU
          </span>
          <h2 className="font-serif text-xl text-cream mb-2.5">고양이 사주 보기</h2>
          <p className="text-[13.5px] text-cream/65 leading-relaxed mb-5">
            생년월일로 풀어보는 우리 냥이의 오늘 총운 · 애정운 · 재물운
          </p>
          <span className="text-[13px] font-bold text-amber">지금 시작하기 →</span>
          <div className="absolute -right-2 -bottom-4 text-[90px] opacity-[0.07] font-serif text-cream">
            卦
          </div>
        </Link>

        <Link
          href="/saju-tarot"
          className="h-full bg-gradient-to-br from-forest to-forestDeep border border-violet/35 rounded-[20px] p-8 relative overflow-hidden shadow-[0_14px_32px_rgba(31,49,41,0.25)] hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(31,49,41,0.32)] transition-all"
        >
          <span className="font-mono text-[11px] tracking-[2px] px-2.5 py-1 rounded-full inline-block mb-4 text-violet bg-violet/15">
            TAROT
          </span>
          <h2 className="font-serif text-xl text-cream mb-2.5">고양이 타로 보기</h2>
          <p className="text-[13.5px] text-cream/65 leading-relaxed mb-5">
            카드 한 장이 알려주는 오늘의 기분과 조언
          </p>
          <span className="text-[13px] font-bold text-violet">카드 뽑기 →</span>
          <div className="absolute -right-2 -bottom-4 text-[90px] opacity-[0.07] font-serif text-cream">
            ✦
          </div>
        </Link>

        <div className="flex flex-row md:flex-col gap-2 h-full">
          {miniFeatures.map((m) =>
            m.href ? (
              <Link
                key={m.key}
                href={m.href}
                className="flex-1 bg-gradient-to-br from-forest to-forestDeep border border-cream/10 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_6px_14px_rgba(31,49,41,0.18)] hover:-translate-y-1 transition-transform p-1"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${m.badge}`}>
                  {m.icon}
                </span>
                <span className="text-[8px] font-bold text-cream">{m.title}</span>
              </Link>
            ) : (
              <button
                key={m.key}
                onClick={() => showToast(`${m.title} 페이지는 곧 만나요 ✦`)}
                className="flex-1 bg-gradient-to-br from-forest to-forestDeep border border-cream/10 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_6px_14px_rgba(31,49,41,0.18)] hover:-translate-y-1 transition-transform p-1"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${m.badge}`}>
                  {m.icon}
                </span>
                <span className="text-[8px] font-bold text-cream">{m.title}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Quickstart */}
      <div className="bg-paper border border-line rounded-full p-2 flex items-center gap-1 max-w-[620px] mx-auto mb-24 shadow-[0_10px_26px_rgba(43,42,37,0.05)]">
        <div className="flex-1 min-w-0 flex items-center gap-2 px-4">
          <span className="font-mono text-[10px] text-inkDim whitespace-nowrap flex-shrink-0">주인</span>
          <input
            type="text"
            placeholder="이름"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="flex-1 min-w-0 bg-transparent outline-none text-sm"
          />
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2 px-4 border-l border-line">
          <span className="font-mono text-[10px] text-inkDim whitespace-nowrap flex-shrink-0">고양이</span>
          <input
            type="text"
            placeholder="이름"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            className="flex-1 min-w-0 bg-transparent outline-none text-sm"
          />
        </div>
        <button
          onClick={startJourney}
          className="bg-forest text-cream rounded-full px-6 py-3 text-[13px] font-bold whitespace-nowrap flex-shrink-0 hover:bg-forestDeep transition-colors"
        >
          운세 보기
        </button>
      </div>

      {/* Community teaser */}
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="font-serif text-2xl text-forest">오늘 우리 커뮤니티에서는</h2>
        <Link href="/catstar" className="text-[12.5px] text-inkDim hover:text-forest">
          CatStar 더보기 →
        </Link>
      </div>
      <Link href="/catstar" className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {communityPosts.map((p, i) => (
          <div
            key={i}
            className="bg-paper border border-line rounded-2xl p-3 pb-4 hover:-translate-y-1 hover:-rotate-1 transition-transform"
          >
            <div className={`aspect-square rounded-lg mb-3 flex items-center justify-center text-2xl bg-gradient-to-br ${p.cls}`}>
              {p.emoji}
            </div>
            <p className="text-xs font-bold mb-0.5">{p.cap}</p>
            <p className="text-[10.5px] text-inkDim">{p.who}</p>
          </div>
        ))}
      </Link>
    </main>
  );
}
