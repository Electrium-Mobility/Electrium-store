// components/CheckoutButton.tsx
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutButton: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);

        const response = await fetch('/api/checkout_sessions', {
            method: 'POST',
        });

        if (response.ok) {
            const { id: sessionId } = await response.json();
            const stripe = await stripePromise;

            if (stripe) {
                const { error } = await stripe.redirectToCheckout({ sessionId });

                if (error) {
                    console.error('Stripe error:', error);
                }
            } else {
                console.error('Stripe.js has not loaded yet.');
            }
        } else {
            console.error('Failed to create checkout session');
        }

        setLoading(false);
    };

    return (
        <button onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : 'Checkout'}
        </button>
    );
};

export default CheckoutButton;