// components/CheckoutButton.tsx
import { useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutButton: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);

        // Call your backend to create the Checkout session.
        const response = await fetch('/api/create-checkout-session', { method: 'POST' });
        const session = await response.json();

        const stripe = await stripePromise;
        if (stripe) {
            // Redirect to Checkout.
            const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
            if (error) {
                console.error(error);
            }
        }

        setLoading(false);
    };

    return (
        <button onClick={handleClick} disabled={loading}>
            {loading ? 'Loading...' : 'Checkout'}
        </button>
    );
};

export default CheckoutButton;