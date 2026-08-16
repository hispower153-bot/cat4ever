import { getSajuSummary } from './saju';

type Element = '목' | '화' | '토' | '금' | '수';

// 상생(오행이 서로 낳아주는 관계): 목→화→토→금→수→목
const GENERATES: Record<Element, Element> = {
  목: '화',
  화: '토',
  토: '금',
  금: '수',
  수: '목',
};

// 상극(오행이 서로 제어하는 관계): 목→토→수→화→금→목
const CONTROLS: Record<Element, Element> = {
  목: '토',
  토: '수',
  수: '화',
  화: '금',
  금: '목',
};

export type GunghapRelation = 'bihwa' | 'sangsaeng' | 'sanggeuk';

export type GunghapResult = {
  relation: GunghapRelation;
  score: number;
  title: string;
  message: string;
  elementA: Element;
  elementB: Element;
};

function getElementRelation(a: Element, b: Element): GunghapRelation {
  if (a === b) return 'bihwa';
  if (GENERATES[a] === b || GENERATES[b] === a) return 'sangsaeng';
  if (CONTROLS[a] === b || CONTROLS[b] === a) return 'sanggeuk';
  return 'bihwa'; // 이론상 도달하지 않지만 안전하게 처리
}

const RESULTS: Record<GunghapRelation, { title: string; baseScore: number; message: string }> = {
  sangsaeng: {
    title: '서로를 북돋아주는 케미 ✨',
    baseScore: 90,
    message:
      '한쪽이 다른 쪽에게 좋은 기운을 나눠주는 상생 관계예요. 함께 있으면 서로 시너지가 나고, 같이 놀 때 케미가 유독 잘 맞는 편이에요.',
  },
  sanggeuk: {
    title: '티격태격 케미 ⚡',
    baseScore: 62,
    message:
      '서로 다른 기운이 부딪히는 상극 관계예요. 처음엔 조금 어색하거나 티격태격할 수 있지만, 그만큼 서로에게 자극이 되어 오래 보면 정드는 사이예요.',
  },
  bihwa: {
    title: '닮은꼴 케미 🐾',
    baseScore: 82,
    message:
      '같은 기운을 타고난 비화 관계예요. 취향이나 성향이 비슷해서 편안하게 지낼 수 있는 사이예요. 다만 가끔 똑같이 고집을 부릴 수도 있어요.',
  },
};

export function getGunghapResult(
  a: { year: number; month: number; day: number },
  b: { year: number; month: number; day: number }
): GunghapResult {
  const sajuA = getSajuSummary({ ...a, timeUnknown: true });
  const sajuB = getSajuSummary({ ...b, timeUnknown: true });

  const elementA = sajuA.dayElement.stem as Element;
  const elementB = sajuB.dayElement.stem as Element;

  const relation = getElementRelation(elementA, elementB);
  const base = RESULTS[relation];

  // 점수에 약간의 결정론적 변주를 줌 (같은 조합이면 항상 같은 점수)
  const variance = ((a.day + b.day + a.month + b.month) % 7) - 3;
  const score = Math.min(99, Math.max(45, base.baseScore + variance));

  return {
    relation,
    score,
    title: base.title,
    message: base.message,
    elementA,
    elementB,
  };
}
