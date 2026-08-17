'use client';

import { useState } from 'react';
import { getGunghapResult, type GunghapResult } from '@/lib/gunghap';

const ELEMENT_LABEL: Record<string, string> = {
  목: '목(木)',
  화: '화(火)',
  토: '토(土)',
  금: '금(金)',
  수: '수(水)',
};

export default function GunghapClient() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [nameA, setNameA] = useState('');
  const [yA, setYA] = useState('');
  const [mA, setMA] = useState('');
  const [dA, setDA] = useState('');

  const [nameB, setNameB] = useState('');
  const [yB, setYB] = useState('');
  const [mB, setMB] = useState('');
  const [dB, setDB] = useState('');

  const [result, setResult] = useState<GunghapResult | null>(null);
  const [error, setError] = useState('');

  const handleCheck = () => {
    setError('');
    if (!yA || !mA || !dA || !yB || !mB || !dB) {
      setError('두 냥이의 생년월일을 모두 입력해주세요.');
      return;
    }
    try {
      const r = getGunghapResult(
        { year: Number(yA), month: Number(mA), day: Number(dA) },
        { year: Number(yB), month: Number(mB), day: Number(dB) }
      );
      setResult(r);
    } catch (e) {
      setError('입력하신 날짜가 올바르지 않아요. 다시 확인해주세요.');
    }
  };

  const DateSelect = ({
    year, month, day, setYear, setMonth, setDay,
  }: {
    year: string; month: string; day: string;
    setYear: (v: string) => void; setMonth: (v: string) => void; setDay: (v: string) => void;
  }) => (
    <div className="flex gap-2">
      <select value={year} onChange={(e) => setYear(e.target.value)} className="flex-1 bg-cream border border-line rounded-xl font-mono text-sm py-3 px-2 text-center">
        <option value="">년</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      <select value={month} onChange={(e) => setMonth(e.target.value)} className="flex-1 bg-cream border border-line rounded-xl font-mono text-sm py-3 px-2 text-center">
        <option value="">월</option>
        {months.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={day} onChange={(e) => setDay(e.target.value)} className="flex-1 bg-cream border border-line rounded-xl font-mono text-sm py-3 px-2 text-center">
        <option value="">일</option>
        {days.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  );

  return (
    <main className="max-w-site mx-auto px-8 pb-20">
      <div
        className="relative rounded-[28px] overflow-hidden min-h-[200px] flex items-end p-9 mt-2 mb-11 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(31,49,41,0.3) 0%, rgba(20,26,20,0.82) 100%), url('https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1400&q=80')",
        }}
      >
        <div className="relative z-10">
          <p className="font-accent italic text-xs tracking-[2.5px] text-goldSoft mb-2.5">FREE · GUNGHAP</p>
          <h1 className="font-serif font-black text-2xl text-cream leading-[1.5]">
            우리 냥이, 오늘의 케미는 어떨까요
          </h1>
        </div>
      </div>

      <div className="max-w-narrow mx-auto">
        <div className="bg-paper border border-line rounded-[20px] p-8 mb-6 shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
          <div className="mb-6">
            <input
              type="text"
              value={nameA}
              onChange={(e) => setNameA(e.target.value)}
              placeholder="첫번째 냥이 이름"
              className="w-full bg-cream border border-line rounded-xl px-4 py-3 text-sm outline-none mb-3"
            />
            <DateSelect year={yA} month={mA} day={dA} setYear={setYA} setMonth={setMA} setDay={setDA} />
          </div>

          <div className="flex items-center justify-center text-pink text-xl mb-6">♡</div>

          <div>
            <input
              type="text"
              value={nameB}
              onChange={(e) => setNameB(e.target.value)}
              placeholder="두번째 냥이(또는 친구 냥이) 이름"
              className="w-full bg-cream border border-line rounded-xl px-4 py-3 text-sm outline-none mb-3"
            />
            <DateSelect year={yB} month={mB} day={dB} setYear={setYB} setMonth={setMB} setDay={setDB} />
          </div>

          <button
            onClick={handleCheck}
            className="w-full mt-7 bg-pink text-[#3A1420] rounded-2xl py-4 font-bold text-[14.5px]"
          >
            궁합 보기
          </button>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {result && (
          <div className="bg-paper border border-line rounded-[20px] p-8 text-center shadow-[0_10px_28px_rgba(43,42,37,0.05)]">
            <p className="font-mono text-[11px] text-inkDim mb-2">
              {nameA || '첫번째 냥이'} ({ELEMENT_LABEL[result.elementA]}) × {nameB || '두번째 냥이'} ({ELEMENT_LABEL[result.elementB]})
            </p>
            <div className="text-4xl font-serif font-black text-rust mb-3">{result.score}점</div>
            <h2 className="font-serif text-xl text-forest mb-4">{result.title}</h2>
            <p className="text-sm leading-relaxed bg-cream rounded-2xl p-5 text-left">{result.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
