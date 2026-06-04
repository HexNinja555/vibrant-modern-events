import React, { useEffect, useRef, useState } from 'react';

const PK = 'pk_test_51T2uYnRsKukKFny9n8Byr5WGo3iAFSLtqcMRco9npXKgAB8CkQQKu0dKbikp2lupq7E2MxOoflu5rUyUG1t31GPg00zBaMuH2h';

declare global { interface Window { Stripe?: (k: string) => any } }

function useStripeJs() {
  const [stripe, setStripe] = useState<any>(null);
  useEffect(() => {
    let cancelled = false;
    const init = () => { if (window.Stripe && !cancelled) setStripe(window.Stripe(PK)); };
    if (window.Stripe) { init(); return; }
    const existing = document.querySelector('script[data-stripe]') as HTMLScriptElement | null;
    if (existing) { existing.addEventListener('load', init); return () => existing.removeEventListener('load', init); }
    const s = document.createElement('script');
    s.src = 'https://js.stripe.com/v3/'; s.async = true; s.dataset.stripe = '1';
    s.onload = init; document.body.appendChild(s);
    return () => { cancelled = true; };
  }, []);
  return stripe;
}

export default function PaymentForm({ amount, clientSecret, onSuccess }: { amount: number; clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripeJs();
  const cardRef = useRef<HTMLDivElement>(null);
  const cardEl = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !cardRef.current || cardEl.current) return;
    const elements = stripe.elements();
    const card = elements.create('card', {
      style: { base: { color: '#fff', fontSize: '16px', '::placeholder': { color: 'rgba(255,255,255,0.4)' } } },
    });
    card.mount(cardRef.current);
    card.on('ready', () => setReady(true));
    cardEl.current = card;
  }, [stripe]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !cardEl.current) return;
    setLoading(true); setError(null);
    const { error: err, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardEl.current },
    });
    if (err) { setError(err.message || 'Payment failed'); setLoading(false); return; }
    if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) onSuccess();
    else { setError('Payment not completed.'); setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div ref={cardRef} className="min-h-[24px]" />
        {!ready && <p className="text-sm text-white/40">Loading secure card field...</p>}
      </div>
      <p className="text-center text-xs text-white/40">Test card: 4242 4242 4242 4242 · any future date · any CVC · any ZIP</p>
      {error && <div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
      <button disabled={!ready || loading} type="submit" className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 py-4 font-bold text-white shadow-[0_0_24px_rgba(255,0,110,0.5)] disabled:opacity-50">
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
}
