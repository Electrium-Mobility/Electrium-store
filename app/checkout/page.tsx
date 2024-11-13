'use client';

import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams, useRouter } from 'next/navigation';

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        if (searchParams.get('success')) {
            console.log('Order placed! You will receive an email confirmation.');
        }

        if (searchParams.get('canceled')) {
            console.log(
                'Order canceled -- continue to shop around and checkout when you are ready.'
        );
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { url, error } = await response.json();

            if (error) {
                console.error('Error:', error);
                return;
            }

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <section>
                <button type="submit" role="link">
                    Checkout
                </button>
            </section>
            <style jsx>{`
        section {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 400px;
          height: 112px;
          border-radius: 6px;
          justify-content: space-between;
        }
        button {
          height: 36px;
          background: #556cd6;
          border-radius: 4px;
          color: white;
          border: 0;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
        }
        button:hover {
          opacity: 0.8;
        }
      `}</style>
        </form>
    );
}