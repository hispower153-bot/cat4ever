'use client';

import { useState } from 'react';
import { getTtiAnimal } from '@/lib/zodiac';

export default function TtiPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const [year, setYear] = useState('');
  const [result, setResult] = useState<ReturnType<typeof getTtiAnimal> | null>(null);

  const handleCheck = () => {
    if (!year) return;
    setResult(getTtiAnimal(Number(year)));
  };

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      <div
        className="relative rounded-[28px] overflow-hidden min-h-[200px] flex items-end p-9 mt-2 mb-11 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(31,49,41,0.3) 0%, rgba(20,26,20,0.82) 100%), url('https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1400&q=80')",
        }}
      >
        <div className="relative z-10">
          <p className="font-accent italic text-xs tracking-[2.5px] text-goldSoft mb-2.5">FREE · TTI FORTUNE</p>
          <h1 className="font-serif font-black text-2xl text-cream leading-[1.5]">
            태어난 해로 보는 우리 냥이의 오늘
          </h1>
        </div>
      </div>

      <div className="max-w-[440px] mx-auto">
        <div className="bg-paper border border-line rounded-[20px] p-8 mb-6 shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
          <p className="font-mono text-[10.5px] tracking-[1.5px] text-inkDim uppercase mb-3">태어난 해</p>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full bg-cream border border-line rounded-xl font-mono text-sm py-3.5 px-3 text-center mb-5"
          >
            <option value="">선택</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={handleCheck}
            className="w-full bg-rust text-[#FBF3E8] rounded-2xl py-4 font-bold text-[14.5px]"
          >
            띠운세 보기
          </button>
        </div>

        {result && (
          <div className="bg-paper border border-line rounded-[20px] p-8 text-center shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
            <span className="text-5xl mb-4 block">{result.emoji}</span>
            <h2 className="font-serif text-xl text-forest mb-1.5">{result.name}띠</h2>
            <p className="text-[13px] text-inkDim mb-5">{result.trait} 기운을 타고났어요</p>
            <p className="text-sm leading-relaxed bg-cream rounded-2xl p-5">{result.fortune}</p>
          </div>
        )}
      </div>
    </main>
  );
}
