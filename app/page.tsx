'use client';

import { useState } from 'react';
import PayPalButton from '@/components/PayPalButton';

export default function Home() {
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [preview, setPreview] = useState('');
  const [fullFortune, setFullFortune] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const birthDate =
    birthYear && birthMonth && birthDay
      ? `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`
      : '';

  const handleGetPreview = async () => {
    if (!birthYear || !birthMonth || !birthDay) {
      setError('생년월일을 모두 선택해주세요.');
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
        body: JSON.stringify({ birthDate, unlocked: false }),
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

  const handlePayError = (message: string) => {
    setError(message);
  };

  const handleUnlock = async () => {
    setLoadingFull(true);
    setError('');
    setUnlocked(true); // PayPal 결제 자체는 이미 서버에서 검증 완료된 상태
    try {
      const res = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, unlocked: true }),
      });
      const data = await res.json();
      if (data.error) {
        // PayPal 결제는 성공했지만, 운세 생성(Anthropic API)에서 실패한 경우
        setFullFortune('');
        setError(`✅ PayPal 결제는 정상 처리됐어요! 다만 운세 생성 단계에서 오류: ${data.error}`);
      } else {
        setFullFortune(data.fortune);
      }
    } catch (e) {
      setError('✅ PayPal 결제는 정상 처리됐어요! 다만 운세를 불러오는 중 네트워크 오류가 발생했습니다.');
    } finally {
      setLoadingFull(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 bg-cream">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🐱</div>
          <h1 className="text-3xl font-bold text-deep">냥사주</h1>
          <p className="text-deep/60 mt-2">오늘의 고양이 운세를 확인해보세요</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <label className="block text-sm font-medium text-deep mb-2">
            생년월일
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <select
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="border border-peach rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-coral bg-white"
            >
              <option value="">년</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              className="border border-peach rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-coral bg-white"
            >
              <option value="">월</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              className="border border-peach rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-coral bg-white"
            >
              <option value="">일</option>
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGetPreview}
            disabled={loading}
            className="w-full bg-coral text-white rounded-lg py-3 font-semibold hover:bg-coral/90 transition disabled:opacity-50"
          >
            {loading ? '운세 보는 중...' : '오늘의 운세 보기'}
          </button>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          {/* 임시: Anthropic 크레딧 없이도 PayPal 결제 흐름만 따로 테스트하기 위한 버튼입니다.
              PayPal 테스트가 끝나고 크레딧 문제가 해결되면 이 버튼은 지워도 됩니다. */}
          <button
            onClick={() => {
              setError('');
              setPreview('(테스트용 미리보기 - 실제 운세 아님) 오늘 고양이가 당신을 지켜보고 있어요...');
              setFullFortune('');
              setUnlocked(false);
            }}
            className="w-full text-xs text-deep/40 underline mt-2"
          >
            [테스트] 운세 생성 건너뛰고 PayPal만 확인하기
          </button>
        </div>

        {preview && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <h2 className="font-semibold text-deep mb-2">🔮 오늘의 미리보기</h2>
            <p className="text-deep/80 leading-relaxed">{preview}</p>
          </div>
        )}

        {preview && !unlocked && (
          <div className="relative bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
            <div className="blur-sm select-none pointer-events-none">
              <h2 className="font-semibold text-deep mb-2">✨ 전체 운세</h2>
              <p className="text-deep/80 leading-relaxed">
                총운, 애정운, 재물운, 그리고 오늘의 행운 조언까지
                자세한 이야기가 여기에 펼쳐집니다. 궁금하지 않나요?
                고양이 신탁이 당신만을 위해 준비했어요.
              </p>
            </div>
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center px-6">
              <p className="text-deep font-medium mb-3">🔒 전체 운세 잠금 해제 ($1.99)</p>
              <div className="w-full max-w-[250px]">
                <PayPalButton onSuccess={handleUnlock} onError={handlePayError} />
              </div>
              {loadingFull && (
                <p className="text-deep/60 text-sm mt-2">운세를 불러오는 중...</p>
              )}
            </div>
          </div>
        )}

        {unlocked && fullFortune && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-coral">
            <h2 className="font-semibold text-deep mb-2">✨ 전체 운세</h2>
            <p className="text-deep/80 leading-relaxed whitespace-pre-line">{fullFortune}</p>
          </div>
        )}
      </div>
    </main>
  );
}
