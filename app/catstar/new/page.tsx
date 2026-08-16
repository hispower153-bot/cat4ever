'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ToastProvider';

type Cat = { id: string; name: string };

export default function CatStarNewPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBirth, setNewCatBirth] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUserId(data.user.id);
      const { data: catRows } = await supabase
        .from('cats')
        .select('id, name')
        .eq('owner_id', data.user.id)
        .order('created_at', { ascending: true });
      const list = catRows || [];
      setCats(list);
      if (list.length > 0) setSelectedCatId(list[0].id);
      else setAddingCat(true); // 등록된 냥이가 없으면 바로 등록 폼을 열어줌
      setChecking(false);
    });
  }, [router]);

  const handleAddCat = async () => {
    if (!newCatName.trim() || !userId) {
      showToast('냥이 이름을 입력해주세요.');
      return;
    }
    setSavingCat(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('cats')
      .insert({ owner_id: userId, name: newCatName, birth_date: newCatBirth || null })
      .select('id, name')
      .single();
    setSavingCat(false);
    if (error || !data) {
      showToast('냥이 등록 중 문제가 발생했어요.');
      console.error(error);
      return;
    }
    setCats((prev) => [...prev, data]);
    setSelectedCatId(data.id);
    setAddingCat(false);
    setNewCatName('');
    setNewCatBirth('');
    showToast(`${data.name} 등록했어요 🐾`);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast('제목을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('catstar_posts').insert({
      owner_id: userData.user.id,
      cat_id: selectedCatId,
      title,
      content,
    });

    setSubmitting(false);
    if (error) {
      showToast('등록 중 문제가 발생했어요.');
      console.error(error);
      return;
    }
    showToast('오늘의 순간이 등록됐어요 🐾');
    router.push('/catstar');
  };

  if (checking) return null;

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      <div className="max-w-[600px] mx-auto">
        <div className="pt-2 pb-8">
          <p className="font-accent italic text-[12.5px] tracking-[2.5px] text-rust mb-2.5">NEW POST</p>
          <h1 className="font-serif text-2xl text-forest">오늘 우리 냥이는 어땠나요?</h1>
        </div>

        <div className="aspect-video rounded-[20px] border-[1.5px] border-dashed border-line bg-paper flex flex-col items-center justify-center gap-2.5 mb-6 cursor-pointer">
          <span className="text-3xl text-inkDim">📷</span>
          <p className="text-[13px] text-inkDim">탭해서 사진 올리기 (다음 단계에서 연결 예정)</p>
        </div>

        <p className="font-mono text-[10.5px] tracking-[1.5px] text-inkDim uppercase mb-2.5">어떤 냥이인가요</p>
        <div className="flex gap-2 flex-wrap mb-6">
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCatId(c.id)}
              className={`px-4 py-2.5 rounded-full text-[12.5px] border ${
                selectedCatId === c.id
                  ? 'bg-rust/10 border-rust text-rust font-bold'
                  : 'bg-paper border-line text-inkDim'
              }`}
            >
              {c.name}
            </button>
          ))}
          <button
            onClick={() => setAddingCat((v) => !v)}
            className="px-4 py-2.5 rounded-full text-[12.5px] border border-line bg-paper text-inkDim"
          >
            + 새 냥이 등록
          </button>
        </div>

        {addingCat && (
          <div className="bg-paper border border-line rounded-2xl p-5 mb-6 flex flex-col gap-3">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="냥이 이름"
              className="bg-cream border border-line rounded-xl px-4 py-3 text-sm outline-none"
            />
            <input
              type="date"
              value={newCatBirth}
              onChange={(e) => setNewCatBirth(e.target.value)}
              className="bg-cream border border-line rounded-xl px-4 py-3 text-sm outline-none"
            />
            <button
              onClick={handleAddCat}
              disabled={savingCat}
              className="bg-forest text-cream rounded-xl py-3 text-sm font-bold disabled:opacity-50"
            >
              {savingCat ? '등록 중...' : '이 정보로 등록'}
            </button>
          </div>
        )}

        <div className="mb-5">
          <p className="font-mono text-[10.5px] tracking-[1.5px] text-inkDim uppercase mb-2">제목</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 창가 명상 중"
            className="w-full bg-paper border border-line rounded-2xl px-4.5 py-3.5 text-sm outline-none"
          />
        </div>

        <div className="mb-6">
          <p className="font-mono text-[10.5px] tracking-[1.5px] text-inkDim uppercase mb-2">내용</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 있었던 이야기를 들려주세요"
            className="w-full min-h-[140px] bg-paper border border-line rounded-2xl px-4.5 py-3.5 text-sm outline-none leading-relaxed"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-rust text-[#FBF3E8] rounded-full py-4 font-bold text-[14.5px] disabled:opacity-50"
        >
          {submitting ? '등록 중...' : '게시하기'}
        </button>
      </div>
    </main>
  );
}
