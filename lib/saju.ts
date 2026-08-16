import { calculateFourPillars, getHeavenlyStemElement, getEarthlyBranchElement } from 'manseryeok';
import type { FourPillars } from 'manseryeok';

export type SajuInput = {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  timeUnknown?: boolean;
};

const ELEMENT_KO: Record<string, string> = {
  목: '목(木)',
  화: '화(火)',
  토: '토(土)',
  금: '금(金)',
  수: '수(水)',
};

/**
 * 생년월일(시)을 받아 사주 명식(연/월/일/시주)과 오행 분포를 계산합니다.
 * 시간을 모르면(timeUnknown) 시주는 계산에서 제외합니다.
 */
export function getSajuSummary(input: SajuInput) {
  const { year, month, day, timeUnknown } = input;
  const hour = timeUnknown ? 12 : input.hour ?? 12; // 모르면 정오로 채우되 시주는 결과에서 제외
  const minute = timeUnknown ? 0 : input.minute ?? 0;

  const result = calculateFourPillars({ year, month, day, hour, minute });

  const pillars: FourPillars = timeUnknown
    ? { year: result.year, month: result.month, day: result.day, hour: result.hour }
    : result;

  // 오행 분포 집계 (연/월/일주는 항상, 시주는 시간 알 때만)
  const elementCount: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const countPillar = (p: { heavenlyStem: string; earthlyBranch: string }) => {
    const stemEl = getHeavenlyStemElement(p.heavenlyStem as any);
    const branchEl = getEarthlyBranchElement(p.earthlyBranch as any);
    elementCount[stemEl] = (elementCount[stemEl] || 0) + 1;
    elementCount[branchEl] = (elementCount[branchEl] || 0) + 1;
  };
  countPillar(result.year);
  countPillar(result.month);
  countPillar(result.day);
  if (!timeUnknown) countPillar(result.hour);

  const elementSummary = Object.entries(elementCount)
    .filter(([, count]) => count > 0)
    .map(([el, count]) => `${ELEMENT_KO[el]}${count}`)
    .join(' ');

  const pillarString = timeUnknown
    ? `연주 ${result.toObject().year}, 월주 ${result.toObject().month}, 일주 ${result.toObject().day} (시주 미상)`
    : result.toString();

  return {
    pillarString,
    elementSummary,
    dayElement: result.dayElement, // 일간(日干) 기준 오행 — 본인의 핵심 기운
  };
}

/** 오늘 날짜의 일진(오늘의 간지)을 계산합니다. 하루에 한 번만 계산해서 캐싱하면 됩니다. */
export function getTodaySummary() {
  const now = new Date();
  return getSajuSummary({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    timeUnknown: true,
  });
}
