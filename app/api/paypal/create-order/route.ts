import { NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST() {
  try {
    const order = await createPayPalOrder();
    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error('PayPal create-order error:', err);
    return NextResponse.json({ error: '결제 주문 생성에 실패했습니다.' }, { status: 500 });
  }
}
