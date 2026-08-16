import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getSajuSummary, getTodaySummary } from '@/lib/saju';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type RequestBody = {
  // 타로 모드
  birthDate?: string; // 'tarot-N' 형식이면 타로
  // 사주 모드 (정확한 계산을 위해 구조화된 값으로 받음)
  saju?: {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
    timeUnknown?: boolean;
  };
  catName?: string;
  unlocked: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { unlocked, catName } = body;
    const displayName = catName || '이 고양이';

    let subject: string;

    if (body.saju) {
      // 1단계: 결정론적 계산 (LLM이 아니라 라이브러리가 사주팔자를 계산)
      let sajuInfo;
      try {
        sajuInfo = getSajuSummary(body.saju);
      } catch (e) {
        return NextResponse.json(
          { error: '입력하신 생년월일시가 올바르지 않아요. 다시 확인해주세요.' },
          { status: 400 }
        );
      }
      const today = getTodaySummary();

      subject = `${displayName}(사주 명식: ${sajuInfo.pillarString} / 오행 분포: ${sajuInfo.elementSummary})를 위한.
오늘(${new Date().toLocaleDateString('ko-KR')})의 일진 오행은 ${today.elementSummary}이며,
이 고양이의 일간(핵심 기운)은 ${sajuInfo.dayElement.stem} 기운입니다.
이 사주 명식과 오늘 일진의 오행 관계(상생·상극)를 참고해서`;
    } else if (body.birthDate?.startsWith('tarot-')) {
      subject = `${displayName}가 방금 뽑은 타로 카드를 위한`;
    } else {
      return NextResponse.json({ error: '생년월일 정보가 필요합니다.' }, { status: 400 });
    }

    // 2단계: 계산된 명식을 "재료"로 넘겨서 Claude가 자연어 해석만 생성
    const prompt = unlocked
      ? `당신은 신비로운 고양이 운세 마스터입니다. ${subject}
오늘의 상세한 고양이 운세를 작성해주세요. 다음 항목을 포함해서 400자 내외로 작성하세요:
- 오늘의 총운
- 애정운
- 재물운
- 행운의 고양이 조언 한 마디
따뜻하고 위트있는 톤으로, 고양이 관점에서 이야기하듯 작성해주세요.
사주 용어(간지, 오행 이름 등)를 그대로 나열하지 말고, 쉬운 말로 풀어서 설명하세요.`
      : `당신은 신비로운 고양이 운세 마스터입니다. ${subject}
오늘의 운세를 딱 2문장으로만 미리보기처럼 짧게 작성해주세요. 궁금증을 유발하되
핵심 내용(재물운, 애정운 등 구체적인 부분)은 알려주지 마세요. 사주 용어는 쓰지 마세요.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    const fortuneText = textBlock && 'text' in textBlock ? textBlock.text : '운세를 불러오지 못했습니다.';

    return NextResponse.json({ fortune: fortuneText });
  } catch (err) {
    console.error('Fortune API error:', err);
    return NextResponse.json({ error: '운세 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
