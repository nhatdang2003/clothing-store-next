"use client"

import { useGoogleLogin } from '@/hooks/use-auth-query';
import React, { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation';

// Separate component for the authentication logic
const AuthenticateContent = () => {
    const { mutate: googleLogin } = useGoogleLogin();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        if (code) {
            googleLogin(code);
        }
    }, [code, googleLogin]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Authenticating...</p>
            </div>
        </div>
    );
};

// Loading fallback component
const AuthenticateLoading = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <div className="animate-pulse rounded-full h-8 w-8 bg-gray-300 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
        </div>
    </div>
);

const Page = () => {
    return (
        <Suspense fallback={<AuthenticateLoading />}>
            <AuthenticateContent />
        </Suspense>
    );
};

export default Page;