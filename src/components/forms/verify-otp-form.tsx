'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useToast } from '@/hooks/use-toast'
import { useVerifyOtp } from '@/hooks/use-auth-query'
import { useSearchParams } from 'next/navigation'

const VerifyOtpForm = () => {
    const [value, setValue] = useState('')
    const { toast } = useToast()
    const { mutate: verifyOtp } = useVerifyOtp()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    const handleSubmit = () => {
        if (!email) {
            toast({
                variant: 'default',
                title: 'Email không hợp lệ',
                description: 'Vui lòng quay lại trang đăng ký',
            })
            return
        }
        if (value.length !== 6) {
            toast({
                variant: 'default',
                title: 'Mã kích hoạt không hợp lệ',
                description: 'Vui lòng nhập lại mã kích hoạt',
            })
            return
        }
        verifyOtp({ email: email || '', activationCode: value })
    }

    return (
        <div className="w-full max-w-md space-y-2 rounded-xl bg-white bg-opacity-90 p-8 shadow-lg backdrop-blur-sm">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Nhập mã kích hoạt</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Nhập mã kích hoạt để xác thực tài khoản của bạn
                </p>
            </div>

            <div className="grid gap-4">
                <div className="flex justify-center items-center my-2">
                    <InputOTP
                        pattern={REGEXP_ONLY_DIGITS}
                        maxLength={6}
                        value={value}
                        onChange={(value: string) => setValue(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    onClick={handleSubmit}
                >
                    Xác thực
                </Button>
            </div>
        </div>
    )
}

export default VerifyOtpForm