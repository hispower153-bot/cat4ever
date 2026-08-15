'use client';

import Link from 'next/link';
import { useState } from 'react';

type Answer = { who: string; body: string };
type Question = { title: string; owner: string; snippet: string; status: 'waiting' | 'answered'; answers: Answer[] };

const questions: Question[] = [
  {
    title: '사료 바꿔도 될까요?',
    owner: '혜영 집사',
    snippet: '지금 먹이는 사료를 3년째 먹였는데 요즘 잘 안 먹어서 바꿔볼까 하는데, 급여 시 주의할 점이 있을까요?',
    status: 'answered',
    answers: [
      { who: '준영 집사', body: '저희도 최근에 바꿨는데, 일주일 정도 기존 사료와 섞어서 서서히 전환하시는 걸 추천드려요!' },
      { who: '수민 집사', body: '급여량은 그대로 두고 비율만 조절하시면 배탈 걱정 없이 넘어갈 수 있어요.' },
      { who: '지훈 집사', body: '혹시 알러지 있는 아이라면 성분표 꼭 확인하세요.' },
    ],
  },
  {
    title: '발톱깎이 추천해주세요',
    owner: '준영 집사',
    snippet: '초보 집사인데 어떤 발톱깎이가 안전하고 쓰기 편할까요? 겁 많은 고양이라 걱정되네요.',
    status: 'waiting',
    answers: [],
  },
  {
    title: '중성화 시기 고민',
    owner: '수민 집사',
    snippet: '6개월 된 남아인데 중성화 시기를 언제로 잡는 게 좋을지 다른 집사님들 경험이 궁금해요.',
    status: 'answered',
    answers: [
      { who: '유진 집사', body: '저희 동물병원에서는 6개월~1년 사이를 추천하더라고요, 몸무게 보고 결정했어요.' },
      { who: '서연 집사', body: '너무 빠르면 성장에 영향 줄 수 있다고 해서 8개월에 했어요.' },
    ],
  },
  {
    title: '화장실을 자꾸 참는 것 같아요',
    owner: '지훈 집사',
    snippet: '모래를 자주 안 치웠더니 화장실을 참는 것 같은데, 다른 원인도 있을까요?',
    status: 'waiting',
    answers: [],
  },
];

export default function QnaPage() {
  const [selected, setSelected] = useState<Question | null>(null);

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      <div className="flex justify-between items-center mt-2 mb-10">
        <div className="hidden md:block" />
        <div className="text-center flex-1 max-w-read mx-auto">
          <p className="font-accent italic text-[13px] tracking-[2.5px] text-sage mb-2.5">
            CAT WISDOM · ASK ANYTHING
          </p>
          <h1 className="font-serif text-[28px] text-forest mb-2">궁금한 건 집사들에게</h1>
          <p className="text-[13px] text-inkDim">고양이 관련 질문을 남기면 다른 집사들이 답해줘요</p>
        </div>
      </div>
      <div className="flex justify-end -mt-6 mb-6">
        <Link
          href="/login"
          className="bg-sage text-[#FBF3E8] rounded-full px-5 py-2.5 text-[13px] font-bold"
        >
          + 질문하기
        </Link>
      </div>

      <div className="max-w-read mx-auto">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => setSelected(q)}
            className="w-full text-left bg-paper border border-line rounded-2xl p-6 mb-3.5 shadow-[0_6px_18px_rgba(43,42,37,0.04)]"
          >
            <div className="flex justify-between items-start gap-3 mb-2.5">
              <h3 className="text-[15.5px] font-bold leading-relaxed">{q.title}</h3>
              <span
                className={`font-mono text-[10.5px] px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                  q.status === 'waiting' ? 'bg-black/5 text-inkDim' : 'bg-sage/15 text-sage'
                }`}
              >
                {q.status === 'waiting' ? '답변대기중' : `답변 ${q.answers.length}`}
              </span>
            </div>
            <p className="text-[13px] text-inkDim mb-3.5 leading-relaxed">{q.snippet}</p>
            <p className="text-[11.5px] text-inkDim">{q.owner}</p>
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
            <h2 className="font-serif text-xl text-forest mb-3">{selected.title}</h2>
            <p className="text-[12.5px] text-inkDim mb-5">{selected.owner}</p>
            <p className="text-sm leading-[1.85] bg-paper p-4.5 rounded-2xl mb-7.5">{selected.snippet}</p>
            <p className="font-mono text-[11px] tracking-wide text-inkDim mb-4">
              {selected.status === 'waiting' ? '답변대기중' : `답변 ${selected.answers.length}개`}
            </p>
            <div className="mb-5.5">
              {selected.answers.length === 0 ? (
                <div className="text-center py-6 text-inkDim text-[13px]">
                  아직 답변이 없어요. 첫 답변을 남겨보세요!
                </div>
              ) : (
                selected.answers.map((a, i) => (
                  <div key={i} className="bg-paper border border-line rounded-2xl p-4 mb-3">
                    <p className="text-[11.5px] font-bold text-sage mb-1.5">{a.who}</p>
                    <p className="text-[13.5px] leading-relaxed">{a.body}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href="/login"
                className="flex-1 bg-paper border border-line rounded-full px-4.5 py-3.5 text-[13.5px] text-inkDim"
              >
                답변을 남겨보세요
              </Link>
              <Link
                href="/login"
                className="bg-sage text-[#FBF3E8] rounded-full px-5.5 py-0 flex items-center text-[13.5px] font-bold"
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
