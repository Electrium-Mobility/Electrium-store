// app/checkout/page.tsx
import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutForm />
        </Suspense>
    );
}