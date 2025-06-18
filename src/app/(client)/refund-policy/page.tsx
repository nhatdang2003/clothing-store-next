
import ScalableStoreLogo from '@/components/ui/logo-store';
import { Ban, Clock4, ShieldCheck, HelpCircle, Phone, Truck } from 'lucide-react';
import Image from 'next/image';

export default function ReturnPolicyPage() {
    return (
        <div className="text-gray-800">
            {/* Banner */}
            <div className="relative h-72 w-full">
                <Image
                    src="/bg.png"
                    alt="Chính sách hoàn trả Ez Store"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
                        Chính sách hoàn trả<br />
                        <div className="w-[200px] inline-block bg-white rounded-sm p-2 mt-2"><ScalableStoreLogo /></div>
                    </h1>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                <p className="text-lg">
                    EZ Store cam kết đem đến sự hài lòng tối đa cho khách hàng. Trong trường hợp không như mong đợi,
                    bạn có thể gửi yêu cầu hoàn trả với quy trình đơn giản, minh bạch và hỗ trợ tận tình.
                </p>

                {/* Điều kiện hoàn trả */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">1. Điều kiện hoàn trả</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Yêu cầu hoàn trả trong vòng <strong>7 ngày</strong> kể từ khi nhận hàng.</li>
                        <li>Sản phẩm còn nguyên tem, nhãn, chưa qua sử dụng hoặc giặt.</li>
                        <li>Hộp/bao bì gốc và hóa đơn (nếu có) phải được giữ nguyên.</li>
                        <li>Không áp dụng cho sản phẩm giảm giá trên 50% hoặc có ghi rõ "không hoàn trả".</li>
                    </ul>
                </section>

                {/* Trường hợp được hoàn trả */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Ban className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">2. Khi nào bạn có thể hoàn trả?</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Nhận sai sản phẩm, màu sắc, size không đúng.</li>
                        <li>Sản phẩm lỗi kỹ thuật, rách, bung chỉ, lem màu,...</li>
                        <li>Sản phẩm hư hỏng do quá trình vận chuyển (cần chụp ảnh khi nhận).</li>
                        <li>Sản phẩm không giống mô tả hoặc ảnh trên website.</li>
                    </ul>
                </section>

                {/* Quy trình hoàn trả */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Clock4 className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">3. Quy trình hoàn trả</h2>
                    </div>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Truy cập vào mục <strong>"Đơn hàng"</strong> trên website.</li>
                        <li>Tìm đơn hàng muốn hoàn trả, bấm nút <strong>"Hoàn trả"</strong>.</li>
                        <li>Điền đầy đủ thông tin, lý do và đính kèm hình ảnh minh chứng.</li>
                        <li>Sau khi gửi yêu cầu, bạn vui lòng làm theo <strong>hướng dẫn gửi hàng</strong> về địa chỉ hoàn trả.</li>
                        <li>Sau khi Ez Store nhận lại hàng và kiểm tra đạt điều kiện, <strong>tiền sẽ được hoàn trong 3–5 ngày làm việc</strong>.</li>
                    </ol>
                </section>

                {/* Hướng dẫn gửi hàng */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Truck className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">4. Gửi hàng về địa chỉ hoàn trả</h2>
                    </div>
                    <p>
                        Sau khi yêu cầu hoàn trả được chấp nhận, bạn vui lòng gửi sản phẩm về:
                    </p>
                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm text-gray-700">
                        <p><strong>Cửa hàng Ez Store</strong></p>
                        <p>Địa chỉ: 01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, Hồ Chí Minh</p>
                        <p>SĐT: 0909 155 966</p>
                        <p>Email: contact.ezstore@gmail.com</p>
                    </div>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                        <li>Ghi rõ mã đơn hàng và số điện thoại liên hệ bên ngoài gói hàng.</li>
                        <li>Chọn dịch vụ vận chuyển có theo dõi (tracking).</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
