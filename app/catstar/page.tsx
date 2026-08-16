'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured';

type Post = {
  id?: string;
  emoji: string;
  cat: string;
  title: string;
  owner: string;
  body: string;
  likes: number;
  gradient: string;
  imageUrl?: string | null;
};

const gradients = [
  'from-[#D9C89A] to-[#B8965A]', 'from-[#A8B896] to-[#6F8259]',
  'from-[#C9A8A0] to-[#A8695C]', 'from-[#A0B8C0] to-[#5C8299]',
  'from-[#D2B48C] to-[#8B6F47]', 'from-[#B8A8C9] to-[#6F5C82]',
];
const emojis = ['🐱', '😺', '🐾', '🐈', '🐈‍⬛', '😻', '😸'];

const mockPosts: Post[] = [
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
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [usingMock, setUsingMock] = useState(true);
  const [selected, setSelected] = useState<Post | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUserId(userData.user?.id || null);

      const { data, error } = await supabase
        .from('catstar_posts')
        .select('id, title, content, image_url, created_at, profiles(owner_name), cats(name)')
        .order('created_at', { ascending: false });
      if (error || !data) return;

      const { data: likeRows } = await supabase.from('catstar_likes').select('post_id, owner_id');
      const counts: Record<string, number> = {};
      const myLikes = new Set<string>();
      (likeRows || []).forEach((l: any) => {
        counts[l.post_id] = (counts[l.post_id] || 0) + 1;
        if (userData.user && l.owner_id === userData.user.id) myLikes.add(l.post_id);
      });
      setLikedIds(myLikes);

      const mapped: Post[] = data.map((p: any, i: number) => ({
        id: p.id,
        emoji: emojis[i % emojis.length],
        cat: p.cats?.name || p.profiles?.owner_name || '이름 없는 냥이',
        title: p.title,
        owner: p.profiles?.owner_name || '익명 집사',
        body: p.content || '',
        likes: counts[p.id] || 0,
        gradient: gradients[i % gradients.length],
        imageUrl: p.image_url,
      }));
      setPosts(mapped);
      setUsingMock(false);
    };

    load();
  }, []);

  const toggleLike = async (post: Post) => {
    if (!post.id) return;
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    const supabase = createClient();
    const isLiked = likedIds.has(post.id);

    if (isLiked) {
      await supabase.from('catstar_likes').delete().eq('post_id', post.id).eq('owner_id', userId);
    } else {
      await supabase.from('catstar_likes').insert({ post_id: post.id, owner_id: userId });
    }

    const nextLiked = new Set(likedIds);
    isLiked ? nextLiked.delete(post.id) : nextLiked.add(post.id);
    setLikedIds(nextLiked);

    const delta = isLiked ? -1 : 1;
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, likes: p.likes + delta } : p)));
    setSelected((prev) => (prev && prev.id === post.id ? { ...prev, likes: prev.likes + delta } : prev));
  };

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
          href="/catstar/new"
          className="bg-rust text-[#FBF3E8] rounded-full px-6 py-3.5 text-[13.5px] font-bold whitespace-nowrap"
        >
          + 오늘의 순간 기록하기
        </Link>
      </div>

      {usingMock && (
        <p className="text-center text-[11px] text-inkDim mb-6">
          (Supabase 연결 전이라 예시 데이터를 보여드리고 있어요)
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {posts.map((p, i) => (
          <button
            key={p.id || i}
            onClick={() => setSelected(p)}
            className="text-left bg-paper border border-line rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform shadow-[0_8px_20px_rgba(43,42,37,0.05)]"
          >
            <div className={`aspect-square flex items-center justify-center text-[34px] bg-gradient-to-br ${p.gradient} overflow-hidden`}>
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                p.emoji
              )}
            </div>
            <div className="p-3.5">
              <p className="font-mono text-[10px] text-rust mb-1">{p.cat}</p>
              <p className="text-[13.5px] font-bold mb-1.5 truncate">{p.title}</p>
              <p className="text-[11px] text-inkDim">
                {likedIds.has(p.id || '') ? '♥' : '♡'} {p.likes}
              </p>
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
              className={`aspect-square rounded-[20px] mb-4.5 flex items-center justify-center text-5xl bg-gradient-to-br ${selected.gradient} overflow-hidden`}
            >
              {selected.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.imageUrl} alt={selected.title} className="w-full h-full object-cover" />
              ) : (
                selected.emoji
              )}
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
              <button
                onClick={() => toggleLike(selected)}
                className={likedIds.has(selected.id || '') ? 'text-rust font-bold' : ''}
              >
                {likedIds.has(selected.id || '') ? '♥' : '♡'} {selected.likes}
              </button>
              <Link href="/login">💬 5</Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
