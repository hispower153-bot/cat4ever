'use client';

import Link from 'next/link';
import { useState } from 'react';

type Post = {
  emoji: string;
  cat: string;
  title: string;
  owner: string;
  body: string;
  likes: number;
  gradient: string;
};

const posts: Post[] = [
  { emoji: '🐱', cat: '나비', title: '창가 명상 중', owner: '혜영 집사', body: '오늘도 나비는 오후 내내 창가에 앉아 새를 구경했어요. 세상 진지한 눈빛이 너무 귀여워서 한참을 지켜봤네요.', likes: 24, gradient: 'from-[#D9C89A] to-[#B8965A]' },
  { emoji: '😺', cat: '두부', title: '간식 쟁탈전', owner: '준영 집사', body: '참치 캔 따는 소리만 들으면 세상 빠르게 달려오는 두부. 오늘도 승리했어요.', likes: 41, gradient: 'from-[#A8B896] to-[#6F8259]' },
  { emoji: '🐾', cat: '콩이', title: '박스가 최고야', owner: '수민 집사', body: '택배 박스만 보이면 어김없이 들어가서 안 나오는 콩이. 오늘의 자리도 완벽하게 세팅됐어요.', likes: 18, gradient: 'from-[#C9A8A0] to-[#A8695C]' },
  { emoji: '🐈', cat: '모카', title: '낮잠 3시간째', owner: '지훈 집사', body: '모카는 오늘 유독 잠이 많은 하루였어요. 배가 볼록해서 더 귀엽습니다.', likes: 33, gradient: 'from-[#A0B8C0] to-[#5C8299]' },
  { emoji: '🐈‍⬛', cat: '치즈', title: '첫 외출', owner: '유진 집사', body: '처음으로 캐리어 밖에서 산책을 시도해봤어요. 조심스럽지만 씩씩하게 걸었답니다.', likes: 52, gradient: 'from-[#D2B48C] to-[#8B6F47]' },
  { emoji: '😻', cat: '루비', title: '집사 무릎 점령', owner: '서연 집사', body: '노트북 하는 내내 무릎 위에서 안 내려가는 루비. 일은 못했지만 행복했어요.', likes: 29, gradient: 'from-[#B8A8C9] to-[#6F5C82]' },
  { emoji: '🐈', cat: '초코', title: '오늘의 캣타워 정복', owner: '민지 집사', body: '새로 산 캣타워 꼭대기까지 단숨에 올라간 초코, 뿌듯한 표정이었어요.', likes: 37, gradient: 'from-[#D9C89A] to-[#8B6F47]' },
  { emoji: '😸', cat: '별이', title: '식빵 자세 3시간', owner: '재현 집사', body: '미동도 없이 식빵을 굽고 있는 별이, 세상 편안해 보였어요.', likes: 45, gradient: 'from-[#A8B896] to-[#5C8299]' },
];

export default function CatStarPage() {
  const [selected, setSelected] = useState<Post | null>(null);

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      <div className="flex flex-wrap justify-between items-end gap-5 mt-2 mb-10">
        <div>
          <p className="font-accent italic text-[13px] tracking-[2.5px] text-rust mb-2.5">
            CATSTAR · TODAY&apos;S CATS
          </p>
          <h1 className="font-serif text-3xl text-forest mb-2">오늘, 우리 냥이들</h1>
          <p className="text-[13px] text-inkDim">전국 집사들이 남긴 오늘의 순간들</p>
        </div>
        <Link
          href="/login"
          className="bg-rust text-[#FBF3E8] rounded-full px-6 py-3.5 text-[13.5px] font-bold whitespace-nowrap"
        >
          + 오늘의 나비 기록하기
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {posts.map((p, i) => (
          <button
            key={i}
            onClick={() => setSelected(p)}
            className="text-left bg-paper border border-line rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform shadow-[0_8px_20px_rgba(43,42,37,0.05)]"
          >
            <div className={`aspect-square flex items-center justify-center text-[34px] bg-gradient-to-br ${p.gradient}`}>
              {p.emoji}
            </div>
            <div className="p-3.5">
              <p className="font-mono text-[10px] text-rust mb-1">{p.cat}</p>
              <p className="text-[13.5px] font-bold mb-1.5 truncate">{p.title}</p>
              <p className="text-[11px] text-inkDim">♡ {p.likes}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-[#2B2A25]/85 z-20 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-[520px] mx-auto py-16 px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="w-9 h-9 rounded-full border border-line bg-paper flex items-center justify-center text-inkDim mb-5"
            >
              ✕
            </button>
            <div
              className={`aspect-square rounded-[20px] mb-4.5 flex items-center justify-center text-5xl bg-gradient-to-br ${selected.gradient}`}
            >
              {selected.emoji}
            </div>
            <div className="flex items-center gap-2.5 mb-4 bg-paper p-3 rounded-2xl">
              <div className="w-9 h-9 rounded-full bg-cream border border-line flex items-center justify-center text-sm">
                🐾
              </div>
              <div className="text-[13px]">
                <b className="text-forest">{selected.cat}</b>
                <span className="block text-[11px] text-inkDim">{selected.owner}</span>
              </div>
            </div>
            <h2 className="font-serif text-xl text-forest mb-3">{selected.title}</h2>
            <p className="text-sm leading-[1.85] bg-paper p-4.5 rounded-2xl mb-5">{selected.body}</p>
            <div className="flex gap-4.5 text-[13.5px] text-inkDim">
              <Link href="/login">♡ {selected.likes}</Link>
              <Link href="/login">💬 5</Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
