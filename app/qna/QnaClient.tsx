'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured';
import { useToast } from '@/components/ToastProvider';

type Answer = { id?: string; who: string; body: string };
type Question = {
  id?: string;
  title: string;
  owner: string;
  snippet: string;
  status: 'waiting' | 'answered';
  answers: Answer[];
};

const mockQuestions: Question[] = [
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

export default function QnaClient() {
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [usingMock, setUsingMock] = useState(true);
  const [selected, setSelected] = useState<Question | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));

    const loadQuestions = async () => {
      const { data: qRows, error: qErr } = await supabase
        .from('qna_questions')
        .select('id, title, content, created_at, profiles(owner_name)')
        .order('created_at', { ascending: false });

      if (qErr || !qRows) return; // 테이블이 아직 없거나 조회 실패 시 목업 유지

      const { data: aRows } = await supabase
        .from('qna_answers')
        .select('id, question_id, content, created_at, profiles(owner_name)')
        .order('created_at', { ascending: true });

      const mapped: Question[] = qRows.map((q: any) => {
        const answers = (aRows || [])
          .filter((a: any) => a.question_id === q.id)
          .map((a: any) => ({ id: a.id, who: a.profiles?.owner_name || '익명 집사', body: a.content }));
        return {
          id: q.id,
          title: q.title,
          owner: q.profiles?.owner_name || '익명 집사',
          snippet: q.content || '',
          status: answers.length > 0 ? 'answered' : 'waiting',
          answers,
        };
      });

      setQuestions(mapped);
      setUsingMock(false);
    };

    loadQuestions();
  }, []);

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !selected?.id) return;
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    setSubmittingAnswer(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from('qna_answers').insert({
      question_id: selected.id,
      owner_id: userData.user!.id,
      content: answerText,
    });
    setSubmittingAnswer(false);
    if (error) {
      showToast('답변 등록 중 문제가 발생했어요.');
      return;
    }
    showToast('답변이 등록됐어요 🐾');
    setAnswerText('');
    setSelected(null);
    // 최신 데이터 다시 불러오기
    window.location.reload();
  };

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
          href="/qna/new"
          className="bg-sage text-[#FBF3E8] rounded-full px-5 py-2.5 text-[13px] font-bold"
        >
          + 질문하기
        </Link>
      </div>

      {usingMock && (
        <p className="text-center text-[11px] text-inkDim mb-6 max-w-read mx-auto">
          (Supabase 연결 전이라 예시 데이터를 보여드리고 있어요)
        </p>
      )}

      <div className="max-w-read mx-auto">
        {questions.map((q, i) => (
          <button
            key={q.id || i}
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
        {questions.length === 0 && (
          <p className="text-center text-inkDim text-sm py-10">
            아직 등록된 질문이 없어요. 첫 질문을 남겨보세요!
          </p>
        )}
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
                  <div key={a.id || i} className="bg-paper border border-line rounded-2xl p-4 mb-3">
                    <p className="text-[11.5px] font-bold text-sage mb-1.5">{a.who}</p>
                    <p className="text-[13.5px] leading-relaxed">{a.body}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                onFocus={() => {
                  if (!isLoggedIn) window.location.href = '/login';
                }}
                placeholder="답변을 남겨보세요"
                className="flex-1 bg-paper border border-line rounded-full px-4.5 py-3.5 text-[13.5px] outline-none"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={submittingAnswer}
                className="bg-sage text-[#FBF3E8] rounded-full px-5.5 text-[13.5px] font-bold disabled:opacity-50"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
