'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PayPalButton from '@/components/PayPalButton';

const glyphs = ['✦', '☾', '♜', '✧', '☉', '♡', '✶', '☽', '♛', '✵'];

function SajuTaroContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ownerName = searchParams.get('owner') || '집사';
  const catName = searchParams.get('cat') || '우리 냥이';

  const [mode, setMode] = useState<'saju' | 'tarot'>('saju');

  // saju inputs
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const sajuPayload = () => ({
    year: Number(birthYear),
    month: Number(birthMonth),
    day: Number(birthDay),
    hour: timeUnknown ? undefined : Number(birthHour),
    minute: 0,
    timeUnknown,
  });

  // tarot
  const [pickedCard, setPickedCard] = useState<number | null>(null);

  // shared result state
  const [preview, setPreview] = useState('');
  const [fullFortune, setFullFortune] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [error, setError] = useState('');

  const switchMode = (m: 'saju' | 'tarot') => {
    setMode(m);
    setPreview('');
    setFullFortune('');
    setUnlocked(false);
    setError('');
    setPickedCard(null);
  };

  const handleGetPreview = async () => {
    if (mode === 'saju' && (!birthYear || !birthMonth || !birthDay || (!timeUnknown && !birthHour))) {
      setError('생년월일(시간)을 모두 선택해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    setPreview('');
    setFullFortune('');
    setUnlocked(false);

    try {
      const res = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'saju'
            ? { saju: sajuPayload(), catName, unlocked: false }
            : { birthDate: `tarot-${pickedCard}`, catName, unlocked: false }
        ),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPreview(data.fortune);
      }
    } catch (e) {
      setError('운세를 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickCard = (i: number) => {
    setPickedCard(i);
    handleGetPreviewForCard(i);
  };

  const handleGetPreviewForCard = async (i: number) => {
    setError('');
    setLoading(true);
    setPreview('');
    setFullFortune('');
    setUnlocked(false);
    try {
      const res = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate: `tarot-${i}`, catName, unlocked: false }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setPreview(data.fortune);
    } catch (e) {
      setError('운세를 불러오는 중 문제가 발생했어요.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayError = (message: string) => setError(message);

  const handleUnlock = async () => {
    setLoadingFull(true);
    setError('');
    setUnlocked(true);
    try {
      const res = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'saju'
            ? { saju: sajuPayload(), catName, unlocked: true }
            : { birthDate: `tarot-${pickedCard}`, catName, unlocked: true }
        ),
      });
      const data = await res.json();
      if (data.error) {
        setFullFortune('');
        setError(`✅ 결제는 정상 처리됐어요! 다만 운세 생성 단계에서 오류: ${data.error}`);
      } else {
        setFullFortune(data.fortune);
      }
    } catch (e) {
      setError('✅ 결제는 정상 처리됐어요! 다만 운세를 불러오는 중 네트워크 오류가 발생했습니다.');
    } finally {
      setLoadingFull(false);
    }
  };

  const goToResult = () => {
    const params = new URLSearchParams({ owner: ownerName, cat: catName });
    router.push(`/result?${params.toString()}`);
  };

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      {/* page hero banner */}
      <div
        className="relative rounded-[28px] overflow-hidden min-h-[220px] flex items-end p-10 mt-2 mb-14 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(31,49,41,0.25) 0%, rgba(20,26,20,0.82) 100%), url('https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1400&q=80')",
        }}
      >
        <div className="relative z-10">
          <p className="font-accent italic text-[12.5px] tracking-[2.5px] text-goldSoft mb-3">
            TODAY&apos;S READING
          </p>
          <h1 className="font-serif font-black text-2xl md:text-3xl text-cream mb-2 leading-[1.4]">
            <span className="text-goldSoft">{catName}</span>의 오늘, 어떤 이야기가 기다리고 있을까요
          </h1>
          <p className="text-[13.5px] text-cream/80">{ownerName}님이 등록한 {catName}를 위한 운세예요</p>
        </div>
      </div>

      <div className="max-w-narrow mx-auto">
        {/* tabs */}
        <div className="flex bg-paper border border-line rounded-full p-1 mb-7 shadow-[0_6px_18px_rgba(43,42,37,0.05)]">
          <button
            onClick={() => switchMode('saju')}
            className={`flex-1 text-center py-3 rounded-full text-sm font-bold transition-colors ${
              mode === 'saju' ? 'bg-rust/15 text-rust' : 'text-inkDim'
            }`}
          >
            사주
          </button>
          <button
            onClick={() => switchMode('tarot')}
            className={`flex-1 text-center py-3 rounded-full text-sm font-bold transition-colors ${
              mode === 'tarot' ? 'bg-forest/10 text-forest' : 'text-inkDim'
            }`}
          >
            타로
          </button>
        </div>

        {mode === 'saju' && (
          <div className="bg-paper border border-line rounded-[20px] p-8 mb-5 shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
            <p className="font-mono text-[10.5px] tracking-[1.5px] text-inkDim uppercase mb-3">태어난 날</p>
            <div className="flex gap-2.5 mb-2">
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="flex-1 bg-cream border border-line rounded-xl font-mono text-sm py-3 px-2 text-center"
              >
                <option value="">년</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="flex-1 bg-cream border border-line rounded-xl font-mono text-sm py-3 px-2 text-center"
              >
                <option value="">월</option>
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="flex-1 bg-cream border border-line rounded-xl font-mono text-sm py-3 px-2 text-center"
              >
                <option value="">일</option>
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <p className="font-mono text-[10.5px] tracking-[1.5px] text-inkDim uppercase mb-3 mt-5">태어난 시간</p>
            <div className="flex items-center justify-between gap-3.5">
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                disabled={timeUnknown}
                className="flex-1 bg-cream border border-line rounded-xl font-mono text-sm py-3 px-2 text-center disabled:opacity-35"
              >
                <option value="">시</option>
                {hours.map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')}시</option>
                ))}
              </select>
              <label className="flex items-center gap-1.5 text-xs text-inkDim whitespace-nowrap cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={timeUnknown}
                  onChange={(e) => setTimeUnknown(e.target.checked)}
                  className="accent-rust"
                />
                시간 모름
              </label>
            </div>
            <button
              onClick={handleGetPreview}
              disabled={loading}
              className="w-full mt-6 bg-rust text-[#FBF3E8] rounded-2xl py-4 font-bold text-[15px] disabled:opacity-50 hover:bg-rust/90 transition-colors"
            >
              {loading ? '운세 보는 중...' : '사주 풀이 보기'}
            </button>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>
        )}

        {mode === 'tarot' && (
          <div className="bg-paper border border-line rounded-[20px] p-9 mb-5 text-center shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
            <p className="text-[13px] text-inkDim mb-6">
              마음을 가라앉히고, 끌리는 카드 한 장을 골라보세요
            </p>
            <div className="flex justify-center h-[150px] relative mb-2">
              {glyphs.map((g, i) => {
                const spread = 140;
                const angle = -spread / 2 + (spread / (glyphs.length - 1)) * i;
                return (
                  <button
                    key={i}
                    onClick={() => handlePickCard(i)}
                    style={{
                      transform: `translateX(-50%) rotate(${angle}deg) translateY(-4px)`,
                      transformOrigin: 'bottom center',
                    }}
                    className={`w-[58px] h-[92px] rounded-[9px] absolute top-2 left-1/2 flex items-center justify-center text-lg transition-all hover:-translate-y-2 ${
                      pickedCard === i
                        ? 'bg-gradient-to-br from-gold to-rust text-ink'
                        : 'bg-gradient-to-br from-forest to-forestDeep text-goldSoft border border-gold/40'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
            {loading && <p className="text-inkDim text-sm mt-4">운세 보는 중...</p>}
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>
        )}

        {preview && (
          <div className="bg-paper border border-line rounded-[20px] p-6 mb-5 shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
            <p className="font-mono text-[11px] text-sage tracking-wide mb-2.5">🔮 미리보기</p>
            <p className="text-[14.5px] leading-relaxed">{preview}</p>
          </div>
        )}

        {preview && !unlocked && (
          <div className="relative bg-paper border border-line rounded-[20px] p-7 overflow-hidden">
            <div className="blur-sm select-none pointer-events-none">
              <h3 className="font-serif text-base text-forest mb-2.5">✦ 총운 · 애정운 · 재물운</h3>
              <p className="text-sm leading-relaxed text-inkDim">
                총운, 애정운, 재물운, 그리고 오늘의 행운 조언까지 자세한 이야기가 여기에 펼쳐집니다.
                궁금하지 않나요? 고양이 신탁이 당신만을 위해 준비했어요.
              </p>
            </div>
            <div className="absolute inset-0 bg-cream/90 flex flex-col items-center justify-center px-6 gap-3">
              <p className="text-ink font-bold text-sm">🔒 전체 운세 잠금 해제 ($1.99)</p>
              <div className="w-full max-w-[250px]">
                <PayPalButton onSuccess={handleUnlock} onError={handlePayError} />
              </div>
              {loadingFull && <p className="text-inkDim text-sm">운세를 불러오는 중...</p>}
            </div>
          </div>
        )}

        {unlocked && fullFortune && (
          <>
            <div className="bg-paper border-2 border-gold rounded-[20px] p-7 mb-6">
              <h3 className="font-serif text-base text-forest mb-2.5">✦ 전체 운세</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">{fullFortune}</p>
            </div>
            <button
              onClick={goToResult}
              className="w-full bg-forest text-cream rounded-2xl py-4 font-bold text-[15px] hover:bg-forestDeep transition-colors"
            >
              결과 확인하기 →
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function SajuTaroPage() {
  return (
    <Suspense fallback={null}>
      <SajuTaroContent />
    </Suspense>
  );
}

