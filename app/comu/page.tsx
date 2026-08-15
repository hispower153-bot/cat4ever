'use client';

import Link from 'next/link';
import { useState } from 'react';

type Comment = { who: string; body: string };
type Post = {
  emoji: string;
  bg: string;
  color: string;
  owner: string;
  time: string;
  title: string;
  snippet: string;
  comments: Comment[];
};

const posts: Post[] = [
  {
    emoji: '🐈', bg: 'bg-gold/20', color: 'text-gold', owner: '서연 집사', time: '12분 전',
    title: '오늘 첫눈 온 거 보고 완전 얼음 된 우리 루비',
    snippet: '창밖 눈 보고 그대로 굳어버렸어요 ㅋㅋㅋ 다들 첫눈 반응 어땠나요',
    comments: [
      { who: '유진 집사', body: '저희 치즈는 창문에 코 박고 안 떨어져요 ㅎㅎ' },
      { who: '준영 집사', body: '귀여워요 진짜 ㅠㅠ' },
    ],
  },
  {
    emoji: '😺', bg: 'bg-rust/20', color: 'text-rust', owner: '지훈 집사', time: '40분 전',
    title: '혹시 캣타워 추천해주실 분',
    snippet: '모카가 요즘 부쩍 높은 곳을 좋아해서 튼튼한 캣타워를 찾고 있어요',
    comments: [{ who: '수민 집사', body: '저희 집은 원목 캣타워 쓰는데 만족도 높아요!' }],
  },
  {
    emoji: '🐾', bg: 'bg-forest/15', color: 'text-forest', owner: '혜영 집사', time: '1시간 전',
    title: '퇴근하고 집 오면 현관까지 마중나오는 나비',
    snippet: '매일 이 순간 때문에 하루 버텨요 ㅎㅎ 다들 그런 순간 있으신가요',
    comments: [],
  },
  {
    emoji: '😻', bg: 'bg-sage/20', color: 'text-sage', owner: '유진 집사', time: '2시간 전',
    title: '다묘가정 처음인데 팁 있을까요',
    snippet: '둘째 들인 지 일주일 됐는데 아직 서로 경계해요. 시간이 해결해줄까요?',
    comments: [
      { who: '서연 집사', body: '저희도 한 달 정도 걸렸어요, 조급해하지 마세요!' },
      { who: '지훈 집사', body: '각자 공간 나눠주는 게 도움됐어요' },
    ],
  },
];

export default function ComuPage() {
  const [selected, setSelected] = useState<Post | null>(null);

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      <div className="flex justify-between items-center mt-2 mb-10">
        <div className="hidden md:block" />
        <div className="text-center flex-1 max-w-read mx-auto">
          <p className="font-accent italic text-[13px] tracking-[2.5px] text-forest mb-2.5">
            CAT LOVERS · FREE TALK
          </p>
          <h1 className="font-serif text-[28px] text-forest mb-2">집사들의 이야기 공간</h1>
          <p className="text-[13px] text-inkDim">가벼운 일상부터 고민까지, 자유롭게 나눠요</p>
        </div>
      </div>
      <div className="flex justify-end -mt-6 mb-6">
        <Link
          href="/login"
          className="bg-forest text-cream rounded-full px-5 py-2.5 text-[13px] font-bold"
        >
          + 글쓰기
        </Link>
      </div>

      <div className="max-w-read mx-auto">
        {posts.map((p, i) => (
          <button
            key={i}
            onClick={() => setSelected(p)}
            className="w-full text-left bg-paper border border-line rounded-2xl p-5.5 mb-3.5 flex gap-4 items-center shadow-[0_6px_18px_rgba(43,42,37,0.04)]"
          >
            <div className={`w-10.5 h-10.5 rounded-full flex-shrink-0 flex items-center justify-center text-lg ${p.bg} ${p.color}`}>
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14.5px] font-bold mb-1.5">{p.title}</h3>
              <p className="text-[13px] text-inkDim mb-2.5 truncate">{p.snippet}</p>
              <div className="flex gap-3 text-[11px] text-inkDim">
                <span>{p.owner}</span>
                <span>{p.time}</span>
                <span>💬 {p.comments.length}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-[#2B2A25]/85 z-20 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-narrow mx-auto py-16 px-6" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="w-9 h-9 rounded-full border border-line bg-paper flex items-center justify-center text-inkDim mb-5.5"
            >
              ✕
            </button>
            <div className="flex items-center gap-2.5 mb-4.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${selected.bg} ${selected.color}`}>
                {selected.emoji}
              </div>
              <div>
                <div className="text-[13px] font-bold">{selected.owner}</div>
                <span className="text-[11px] text-inkDim">{selected.time}</span>
              </div>
            </div>
            <h2 className="font-serif text-xl text-forest mb-3">{selected.title}</h2>
            <p className="text-sm leading-[1.85] bg-paper p-4.5 rounded-2xl mb-7.5">{selected.snippet}</p>
            <p className="font-mono text-[11px] tracking-wide text-inkDim mb-4">
              댓글 {selected.comments.length}개
            </p>
            <div className="mb-5.5">
              {selected.comments.length === 0 ? (
                <p className="text-[13px] text-inkDim">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
              ) : (
                selected.comments.map((c, i) => (
                  <div key={i} className="flex gap-2.5 mb-3.5">
                    <div className="w-7 h-7 rounded-full bg-paper flex-shrink-0 flex items-center justify-center text-xs">
                      🐾
                    </div>
                    <div className="text-[12.5px]">
                      <div className="font-bold text-forest mb-1">{c.who}</div>
                      <p className="leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href="/login"
                className="flex-1 bg-paper border border-line rounded-full px-4.5 py-3.5 text-[13.5px] text-inkDim"
              >
                댓글을 남겨보세요
              </Link>
              <Link
                href="/login"
                className="bg-forest text-cream rounded-full px-5.5 py-0 flex items-center text-[13.5px] font-bold"
              >
                등록
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
