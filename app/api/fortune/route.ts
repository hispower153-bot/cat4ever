import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { birthDate, unlocked } = await req.json();

    if (!birthDate) {
      return NextResponse.json({ error: '생년월일을 입력해주세요.' }, { status: 400 });
    }

    // unlocked=false 일 때는 짧은 미리보기만, true일 때는 전체 운세 생성
    const prompt = unlocked
      ? `당신은 신비로운 고양이 운세 마스터입니다. 생년월일 ${birthDate}인 사람을 위한
오늘의 상세한 고양이 운세를 작성해주세요. 다음 항목을 포함해서 400자 내외로 작성하세요:
- 오늘의 총운
- 애정운
- 재물운
- 행운의 고양이 조언 한 마디
따뜻하고 위트있는 톤으로, 고양이 관점에서 이야기하듯 작성해주세요.`
      : `당신은 신비로운 고양이 운세 마스터입니다. 생년월일 ${birthDate}인 사람을 위한
오늘의 운세를 딱 2문장으로만 미리보기처럼 짧게 작성해주세요. 궁금증을 유발하되
핵심 내용(재물운, 애정운 등 구체적인 부분)은 알려주지 마세요.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
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
