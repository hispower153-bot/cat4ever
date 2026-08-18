'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured';
import { useToast } from '@/components/ToastProvider';

type Comment = { id?: string; who: string; body: string };
type Post = {
  id?: string;
  emoji: string;
  bg: string;
  color: string;
  owner: string;
  time: string;
  title: string;
  snippet: string;
  comments: Comment[];
};

const palette = [
  { emoji: '🐈', bg: 'bg-gold/20', color: 'text-gold' },
  { emoji: '😺', bg: 'bg-rust/20', color: 'text-rust' },
  { emoji: '🐾', bg: 'bg-forest/15', color: 'text-forest' },
  { emoji: '😻', bg: 'bg-sage/20', color: 'text-sage' },
];

const mockPosts: Post[] = [
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

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function ComuClient() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [usingMock, setUsingMock] = useState(true);
  const [selected, setSelected] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));

    const loadPosts = async () => {
      const { data: pRows, error: pErr } = await supabase
        .from('comu_posts')
        .select('id, title, content, created_at, profiles(owner_name)')
        .order('created_at', { ascending: false });

      if (pErr || !pRows) return;

      const { data: cRows } = await supabase
        .from('comu_comments')
        .select('id, post_id, content, created_at, profiles(owner_name)')
        .order('created_at', { ascending: true });

      const mapped: Post[] = pRows.map((p: any, i: number) => {
        const style = palette[i % palette.length];
        const comments = (cRows || [])
          .filter((c: any) => c.post_id === p.id)
          .map((c: any) => ({ id: c.id, who: c.profiles?.owner_name || '익명 집사', body: c.content }));
        return {
          id: p.id,
          ...style,
          owner: p.profiles?.owner_name || '익명 집사',
          time: timeAgo(p.created_at),
          title: p.title,
          snippet: p.content || '',
          comments,
        };
      });

      setPosts(mapped);
      setUsingMock(false);
    };

    loadPosts();
  }, []);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !selected?.id) return;
    if (!isLoggedIn) {
      window.location.href = '/login?next=/comu';
      return;
    }
    setSubmittingComment(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from('comu_comments').insert({
      post_id: selected.id,
      owner_id: userData.user!.id,
      content: commentText,
    });
    setSubmittingComment(false);
    if (error) {
      showToast('댓글 등록 중 문제가 발생했어요.');
      return;
    }
    showToast('댓글이 등록됐어요 🐾');
    setCommentText('');
    setSelected(null);
    window.location.reload();
  };

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
        <Link href="/comu/new" className="bg-forest text-cream rounded-full px-5 py-2.5 text-[13px] font-bold">
          + 글쓰기
        </Link>
      </div>

      {usingMock && (
        <p className="text-center text-[11px] text-inkDim mb-6 max-w-read mx-auto">
          (Supabase 연결 전이라 예시 데이터를 보여드리고 있어요)
        </p>
      )}

      <div className="max-w-read mx-auto">
        {posts.map((p, i) => (
          <button
            key={p.id || i}
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
        {posts.length === 0 && (
          <p className="text-center text-inkDim text-sm py-10">
            아직 등록된 글이 없어요. 첫 글을 남겨보세요!
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
                  <div key={c.id || i} className="flex gap-2.5 mb-3.5">
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
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => {
                  if (!isLoggedIn) window.location.href = '/login?next=/comu';
                }}
                placeholder="댓글을 남겨보세요"
                className="flex-1 bg-paper border border-line rounded-full px-4.5 py-3.5 text-[13.5px] outline-none"
              />
              <button
                onClick={handleSubmitComment}
                disabled={submittingComment}
                className="bg-forest text-cream rounded-full px-5.5 text-[13.5px] font-bold disabled:opacity-50"
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
