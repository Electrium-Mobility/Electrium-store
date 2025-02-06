'use client'

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';

const EmailVerificationContent = () => {
  const [cooldown, setCooldown] = useState(0);
  const searchParams = useSearchParams();
    const email = searchParams.get('email');

  useEffect(() => {
        const cooldownEndTime = localStorage.getItem('cooldownEndTime');
    if (cooldownEndTime) {
            const remainingTime = Math.ceil((parseInt(cooldownEndTime) - Date.now()) / 1000);
      if (remainingTime > 0) {
        setCooldown(remainingTime);
      } else {
                localStorage.removeItem('cooldownEndTime');
      }
    }

    const timer = setInterval(() => {
      if (cooldown > 0) {
                setCooldown(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;

    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
      });

      if (error) {
                console.error('Failed to resend verification email:', error.message);
        return;
      }

      // Set 60 second cooldown and store end time in localStorage
            const endTime = Date.now() + (60 * 1000);
            localStorage.setItem('cooldownEndTime', endTime.toString());
      setCooldown(60);
    } catch (error) {
            console.error('Failed to resend verification email:', error);
    }
  };

  return (
        <div className="flex flex-col items-center border border-gray-200 bg-gray-100 p-8 rounded-lg w-full max-w-md">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Email Verification</h1>
          <p className="text-center text-gray-600">
                Please check your email to verify your account and complete the signup process!
          </p>
          <p className="text-sm text-gray-500 mt-4 text-center">
                Once verified, you will be automatically redirected to continue your checkout.
            </p>
            <button 
            onClick={handleResend}
            disabled={cooldown > 0}
            className={`w-full ${
                    cooldown > 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-500'
            } text-white font-bold text-center px-4 py-2 mt-8 rounded transition-colors`}
          >
                {cooldown > 0 
                    ? `Resend in ${cooldown}s` 
                    : 'Resend Verification Email'
                }
          </button>
        </div>
  );
};

const EmailVerification = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <EmailVerificationContent />
            </Suspense>
        </div>
    );
};

export default EmailVerification;
