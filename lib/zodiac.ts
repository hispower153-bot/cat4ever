// 띠(12간지)와 서양 별자리는 규칙 기반으로 계산 가능해서, Claude API를 호출하지 않고
// 여기서 바로 결과를 만들어요. 크레딧 절약 + 즉시 응답이 장점이에요.

const TTI_ANIMALS = [
  { name: '쥐', emoji: '🐭', trait: '눈치 빠르고 재빠른', fortune: '작은 기회를 놓치지 않는 날이에요. 평소보다 예민한 감각이 오늘 도움이 될 거예요.' },
  { name: '소', emoji: '🐮', trait: '우직하고 성실한', fortune: '서두르지 않아도 괜찮은 하루예요. 꾸준히 하던 대로만 해도 좋은 결과가 따라와요.' },
  { name: '호랑이', emoji: '🐯', trait: '용맹하고 당당한', fortune: '망설이던 일이 있다면 오늘 밀어붙여보세요. 기세가 좋은 날이에요.' },
  { name: '토끼', emoji: '🐰', trait: '온순하고 섬세한', fortune: '주변 분위기를 살피는 게 도움이 되는 날이에요. 조용히 관찰하다 보면 답이 보여요.' },
  { name: '용', emoji: '🐲', trait: '카리스마 넘치는', fortune: '존재감이 빛나는 하루예요. 평소보다 시선이 많이 쏠릴 수 있어요.' },
  { name: '뱀', emoji: '🐍', trait: '신중하고 지혜로운', fortune: '천천히, 확실하게 움직이는 게 좋은 날이에요. 서두르면 오히려 꼬일 수 있어요.' },
  { name: '말', emoji: '🐴', trait: '활동적이고 자유로운', fortune: '몸을 움직이는 만큼 기분도 좋아지는 날이에요. 산책이나 외출을 추천해요.' },
  { name: '양', emoji: '🐑', trait: '온화하고 다정한', fortune: '누군가와 함께하는 시간이 특히 따뜻하게 느껴지는 날이에요.' },
  { name: '원숭이', emoji: '🐵', trait: '재치있고 영리한', fortune: '평소 안 하던 시도를 해봐도 좋은 날이에요. 아이디어가 잘 떠올라요.' },
  { name: '닭', emoji: '🐔', trait: '부지런하고 야무진', fortune: '작은 정리정돈이 큰 만족감을 주는 하루예요. 주변을 한 번 돌아보세요.' },
  { name: '개', emoji: '🐶', trait: '충직하고 믿음직한', fortune: '곁에 있는 사람(혹은 존재)의 소중함이 느껴지는 날이에요.' },
  { name: '돼지', emoji: '🐷', trait: '너그럽고 복스러운', fortune: '오늘은 그냥 편하게 있어도 괜찮아요. 여유가 곧 행운이 되는 하루예요.' },
];

/** 태어난 해로 12간지 띠를 계산합니다. (1900년이 쥐띠 기준) */
export function getTtiAnimal(year: number) {
  const index = ((year - 1900) % 12 + 12) % 12;
  return TTI_ANIMALS[index];
}

const ZODIAC_SIGNS = [
  { name: '염소자리', emoji: '♑', from: [12, 22], to: [1, 19], trait: '책임감 있고 끈기있는', fortune: '오늘 하루의 작은 목표를 세워보세요. 하나씩 해내는 재미가 있는 날이에요.' },
  { name: '물병자리', emoji: '♒', from: [1, 20], to: [2, 18], trait: '독창적이고 자유로운', fortune: '평범한 하루보다 조금 다른 하루가 어울려요. 새로운 자극을 찾아보세요.' },
  { name: '물고기자리', emoji: '♓', from: [2, 19], to: [3, 20], trait: '감성적이고 다정한', fortune: '오늘은 감정에 솔직해도 괜찮은 날이에요. 마음 가는 대로 움직여보세요.' },
  { name: '양자리', emoji: '♈', from: [3, 21], to: [4, 19], trait: '열정적이고 씩씩한', fortune: '망설임 없이 시작하기 좋은 날이에요. 첫 발을 떼는 데 의미가 있어요.' },
  { name: '황소자리', emoji: '♉', from: [4, 20], to: [5, 20], trait: '느긋하고 안정적인', fortune: '편안한 곳에서 편안한 것들과 함께하는 게 최고의 하루가 될 거예요.' },
  { name: '쌍둥이자리', emoji: '♊', from: [5, 21], to: [6, 21], trait: '호기심 많고 재빠른', fortune: '여러 가지가 동시에 궁금해지는 날이에요. 다 궁금해해도 괜찮아요.' },
  { name: '게자리', emoji: '♋', from: [6, 22], to: [7, 22], trait: '따뜻하고 보호본능 강한', fortune: '익숙한 공간, 익숙한 사람 곁이 오늘따라 더 편안하게 느껴져요.' },
  { name: '사자자리', emoji: '♌', from: [7, 23], to: [8, 22], trait: '당당하고 빛나는', fortune: '오늘은 주인공이 되어도 좋은 날이에요. 자신있게 나서보세요.' },
  { name: '처녀자리', emoji: '♍', from: [8, 23], to: [9, 22], trait: '세심하고 완벽주의적인', fortune: '디테일을 챙기면 챙길수록 만족스러운 하루가 될 거예요.' },
  { name: '천칭자리', emoji: '♎', from: [9, 23], to: [10, 22], trait: '균형감 있고 우아한', fortune: '두 가지 사이에서 고민된다면, 오늘은 마음이 편한 쪽을 골라도 좋아요.' },
  { name: '전갈자리', emoji: '♏', from: [10, 23], to: [11, 21], trait: '깊이있고 신비로운', fortune: '겉으로 드러나지 않는 것들에 오늘따라 마음이 가는 하루예요.' },
  { name: '사수자리', emoji: '♐', from: [11, 22], to: [12, 21], trait: '모험심 강하고 낙천적인', fortune: '멀리 보고 크게 생각해보기 좋은 날이에요. 오늘의 작은 일에 너무 얽매이지 마세요.' },
];

/** 태어난 월/일로 서양 별자리를 계산합니다. */
export function getWesternZodiac(month: number, day: number) {
  for (const sign of ZODIAC_SIGNS) {
    const [fromM, fromD] = sign.from;
    const [toM, toD] = sign.to;
    if (fromM === toM) {
      if (month === fromM && day >= fromD && day <= toD) return sign;
    } else if (fromM < toM) {
      if ((month === fromM && day >= fromD) || (month === toM && day <= toD)) return sign;
    } else {
      // 염소자리처럼 연말~연초에 걸치는 경우
      if ((month === fromM && day >= fromD) || (month === toM && day <= toD)) return sign;
    }
  }
  return ZODIAC_SIGNS[0];
}
