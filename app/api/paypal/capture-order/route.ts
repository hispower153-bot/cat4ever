import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId가 없습니다.' }, { status: 400 });
    }

    const { isCompleted } = await capturePayPalOrder(orderId);

    if (!isCompleted) {
      return NextResponse.json({ error: '결제가 완료되지 않았습니다.' }, { status: 402 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PayPal capture-order error:', err);
    return NextResponse.json({ error: '결제 확인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
