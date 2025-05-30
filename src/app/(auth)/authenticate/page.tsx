"use client"

import { useGoogleLogin } from '@/hooks/use-auth-query';
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation';

const page = () => {
    const { mutate: googleLogin } = useGoogleLogin();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        if (code) {
            googleLogin(code);
        }
    }, [code]);

    return (
        <div>page</div>
    )
}

export default page