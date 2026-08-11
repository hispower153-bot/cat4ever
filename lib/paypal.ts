// PayPal REST API와 통신하는 서버 전용 헬퍼 함수들입니다.
// 절대 클라이언트(브라우저) 코드에서 이 파일을 import하지 마세요 — Secret이 노출됩니다.

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// 운세 전체보기 가격 (달러). 실제 가격을 바꾸고 싶으면 여기만 수정하세요.
export const FORTUNE_PRICE_USD = '1.99';

async function getAccessToken(): Promise<string> {
  // NEXT_PUBLIC_ 접두사가 붙은 값은 클라이언트뿐 아니라 서버에서도 읽을 수 있습니다.
  // Client ID는 원래 비밀값이 아니라서(브라우저에도 노출되는 값) 이렇게 공유해도 안전합니다.
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !secret) {
    throw new Error('PayPal 환경변수(NEXT_PUBLIC_PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)가 설정되지 않았습니다.');
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error('PayPal 인증 토큰 발급에 실패했습니다.');
  }

  const data = await res.json();
  return data.access_token;
}

// 결제 주문을 생성합니다. 가격은 서버에서 고정값으로 지정해서
// 클라이언트가 가격을 조작할 수 없게 합니다.
export async function createPayPalOrder() {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: FORTUNE_PRICE_USD,
          },
          description: '냥사주 - 오늘의 전체 운세',
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`PayPal 주문 생성 실패: ${errText}`);
  }

  return res.json();
}

// 결제를 캡처(확정)하고, 실제로 결제가 완료됐는지(COMPLETED) 검증합니다.
// 이 검증을 반드시 서버에서 해야 합니다 — 그래야 사용자가 결제 없이
// 브라우저 조작만으로 잠금을 풀 수 없습니다.
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`PayPal 결제 캡처 실패: ${JSON.stringify(data)}`);
  }

  const isCompleted = data.status === 'COMPLETED';
  return { isCompleted, raw: data };
}