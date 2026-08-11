'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

type Props = {
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function PayPalButton({ onSuccess, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      onError('PayPal 설정이 완료되지 않았습니다. (NEXT_PUBLIC_PAYPAL_CLIENT_ID 없음)');
      return;
    }

    const renderButtons = () => {
      if (rendered.current || !containerRef.current || !window.paypal) return;
      rendered.current = true;

      window.paypal
        .Buttons({
          style: { layout: 'vertical', color: 'gold', label: 'paypal', height: 45 },

          // 주문 생성은 서버에서 처리 — 가격 조작 방지
          createOrder: async () => {
            const res = await fetch('/api/paypal/create-order', { method: 'POST' });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return data.orderId;
          },

          // 결제 승인 후, 서버에서 실제 완료 여부를 다시 검증
          onApprove: async (data: { orderID: string }) => {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const result = await res.json();
            if (result.success) {
              onSuccess();
            } else {
              onError(result.error || '결제 확인에 실패했습니다.');
            }
          },

          onError: (err: any) => {
            console.error('PayPal button error:', err);
            onError('결제 진행 중 오류가 발생했습니다.');
          },
        })
        .render(containerRef.current);
    };

    // 이미 스크립트가 로드되어 있으면 바로 렌더링
    if (window.paypal) {
      renderButtons();
      return;
    }

    const existingScript = document.getElementById('paypal-sdk');
    if (existingScript) {
      existingScript.addEventListener('load', renderButtons);
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.onload = renderButtons;
    script.onerror = () => onError('PayPal 스크립트를 불러오지 못했습니다.');
    document.body.appendChild(script);
  }, [onSuccess, onError]);

  return <div ref={containerRef} />;
}
