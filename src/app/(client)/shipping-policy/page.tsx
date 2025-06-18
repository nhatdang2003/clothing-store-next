'use client';

import ScalableStoreLogo from '@/components/ui/logo-store';
import { Truck, Timer, Wallet, Info, Phone } from 'lucide-react';
import Image from 'next/image';

export default function ShippingPolicyPage() {
    return (
        <div className="text-gray-800">
            {/* Banner Section */}
            <div className="relative h-72 w-full">
                <Image
                    src="/bg.png" // Thay bằng ảnh phù hợp (ảnh vận chuyển, đóng gói, xe giao hàng)
                    alt="Chính sách vận chuyển Ez Store"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
                        Chính sách vận chuyển<br />
                        <div className="w-[200px] inline-block bg-white rounded-sm p-2 mt-2"><ScalableStoreLogo /></div>
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                <p className="text-lg text-gray-700">
                    Với EZ Store, giao hàng không chỉ là việc chuyển sản phẩm – đó là một phần của trải nghiệm mua sắm trọn vẹn. Dưới đây là những thông tin bạn cần biết để yên tâm đặt hàng và nhận hàng nhanh chóng, an toàn nhất.
                </p>

                {/* Hình thức giao hàng */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Truck className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">1. Hình thức giao hàng</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>
                            <strong>Giao hàng nhanh:</strong> Giao toàn quốc thông qua đơn vị vận chuyển giao hàng nhanh, thời gian từ 2–3 ngày làm việc. Khách nhận được mã vận đơn để theo dõi tiến trình.
                        </li>
                        <li>
                            <strong>Giao hàng hỏa tốc:</strong> Áp dụng tại nội thành TP.HCM (Quận 1–12, Bình Thạnh, Phú Nhuận,...). Giao trong vòng 2–4 giờ kể từ khi xác nhận đơn.
                        </li>
                    </ul>
                </section>

                {/* Thời gian xử lý đơn */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Timer className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">2. Thời gian xử lý đơn hàng</h2>
                    </div>
                    <p>
                        Đơn hàng sẽ được đóng gói trong vòng <strong>24 giờ</strong> sau khi xác nhận. Đơn đặt sau 17h hoặc vào cuối tuần/ lễ sẽ được xử lý vào ngày làm việc kế tiếp.
                    </p>
                    <p className="text-gray-600 italic">Ví dụ: Đơn đặt tối Chủ Nhật sẽ được xử lý vào sáng Thứ Hai.</p>
                </section>

                {/* Phí vận chuyển */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Wallet className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">3. Phí vận chuyển</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>
                            <strong>Giao hàng nhanh:</strong> Theo biểu phí của đơn vị vận chuyển Giao hàng nhanh, hệ thống sẽ tự động tính dựa trên địa chỉ nhận hàng và trọng lượng.
                        </li>
                        <li>
                            <strong>Giao hàng hỏa tốc:</strong> Theo biểu phí của Grab Express.
                        </li>
                        <li>
                            <strong>Miễn phí vận chuyển:</strong> Với đơn hàng từ <strong>1.000.000đ</strong> trở lên – áp dụng cho cả tiêu chuẩn và hỏa tốc.
                        </li>
                    </ul>
                </section>

                {/* Cam kết & lưu ý */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Info className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">4. Lưu ý và cam kết</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>
                            Đơn hàng có thể bị chậm vì lý do khách quan (thời tiết, cấm đường,...). Chúng tôi sẽ chủ động báo nếu có thay đổi.
                        </li>
                        <li>
                            Vui lòng cung cấp đầy đủ địa chỉ và số điện thoại liên hệ. Trường hợp giao không thành công sẽ được gọi lại 2 lần trước khi hoàn về kho.
                        </li>
                        <li>
                            Bạn có thể <strong>kiểm tra sản phẩm trước khi thanh toán</strong> với hình thức COD.
                        </li>
                        <li>
                            Ez Store luôn xử lý phản hồi liên quan đến vận chuyển <strong>trong vòng 24 giờ</strong>.
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
