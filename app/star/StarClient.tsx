'use client';

import { useState } from 'react';
import { getWesternZodiac } from '@/lib/zodiac';

export default function StarClient() {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [result, setResult] = useState<ReturnType<typeof getWesternZodiac> | null>(null);

  const handleCheck = () => {
    if (!month || !day) return;
    setResult(getWesternZodiac(Number(month), Number(day)));
  };

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      <div
        className="relative rounded-[28px] overflow-hidden min-h-[200px] flex items-end p-9 mt-2 mb-11 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(31,49,41,0.3) 0%, rgba(20,26,20,0.82) 100%), url('https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=1400&q=80')",
        }}
      >
        <div className="relative z-10">
          <p className="font-accent italic text-xs tracking-[2.5px] text-goldSoft mb-2.5">FREE · STAR FORTUNE</p>
          <h1 className="font-serif font-black text-2xl text-cream leading-[1.5]">
            별자리로 보는 우리 냥이의 오늘
          </h1>
        </div>
      </div>

      <div className="max-w-[440px] mx-auto">
        <div className="bg-paper border border-line rounded-[20px] p-8 mb-6 shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
          <p className="font-mono text-[10.5px] tracking-[1.5px] text-inkDim uppercase mb-3">태어난 월/일</p>
          <div className="flex gap-2.5 mb-5">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="flex-1 bg-cream border border-line rounded-xl font-mono text-sm py-3.5 px-2 text-center"
            >
              <option value="">월</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="flex-1 bg-cream border border-line rounded-xl font-mono text-sm py-3.5 px-2 text-center"
            >
              <option value="">일</option>
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCheck}
            className="w-full bg-forest text-cream rounded-2xl py-4 font-bold text-[14.5px]"
          >
            별자리 보기
          </button>
        </div>

        {result && (
          <div className="bg-paper border border-line rounded-[20px] p-8 text-center shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
            <span className="text-5xl mb-4 block">{result.emoji}</span>
            <h2 className="font-serif text-xl text-forest mb-1.5">{result.name}</h2>
            <p className="text-[13px] text-inkDim mb-5">{result.trait} 기운을 타고났어요</p>
            <p className="text-sm leading-relaxed bg-cream rounded-2xl p-5">{result.fortune}</p>
          </div>
        )}
      </div>
    </main>
  );
}
