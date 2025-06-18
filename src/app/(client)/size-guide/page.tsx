'use client';

import Image from 'next/image';
import { Ruler, Shirt, HelpCircle, Smile } from 'lucide-react';

export default function SizeGuidePage() {
    return (
        <div className="text-gray-800">
            {/* Banner */}
            <div className="relative h-72 w-full">
                <Image
                    src="/bg.png"
                    alt="Hướng dẫn chọn size"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
                        Hướng dẫn chọn size
                    </h1>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

                {/* Mở đầu */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">Tại sao chọn đúng size lại quan trọng?</h2>
                    </div>
                    <p>
                        Một chiếc áo vừa vặn không chỉ giúp bạn trông đẹp hơn mà còn đem lại sự thoải mái suốt cả ngày.
                        Ez Store giúp bạn chọn đúng size ngay từ lần đầu với hướng dẫn dưới đây.
                    </p>
                </section>

                {/* Cách đo số đo cơ thể */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Ruler className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">Cách đo số đo cơ thể</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Ngực:</strong> Dùng thước dây đo vòng quanh phần rộng nhất của ngực.</li>
                        <li><strong>Eo:</strong> Đo vòng eo tại vị trí nhỏ nhất (thường ở trên rốn).</li>
                        <li><strong>Hông:</strong> Đo tại phần rộng nhất của hông.</li>
                        <li><strong>Chiều cao và cân nặng:</strong> Giúp xác định form tổng thể phù hợp.</li>
                    </ul>
                    <p className="text-sm italic text-gray-500">Mẹo: Đo khi mặc quần áo mỏng, đứng thẳng và không hóp bụng để kết quả chính xác hơn.</p>
                </section>

                {/* Bảng size Ez Store */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Shirt className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">Bảng size tham khảo</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-sm md:text-base text-center">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2">Size</th>
                                    <th className="border px-4 py-2">Ngực (cm)</th>
                                    <th className="border px-4 py-2">Eo (cm)</th>
                                    <th className="border px-4 py-2">Hông (cm)</th>
                                    <th className="border px-4 py-2">Chiều cao</th>
                                    <th className="border px-4 py-2">Cân nặng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">S</td>
                                    <td className="border">80–86</td>
                                    <td className="border">60–66</td>
                                    <td className="border">86–92</td>
                                    <td className="border">150–160cm</td>
                                    <td className="border">40–50kg</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">M</td>
                                    <td className="border">86–92</td>
                                    <td className="border">66–72</td>
                                    <td className="border">92–98</td>
                                    <td className="border">155–165cm</td>
                                    <td className="border">50–60kg</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">L</td>
                                    <td className="border">92–98</td>
                                    <td className="border">72–78</td>
                                    <td className="border">98–104</td>
                                    <td className="border">160–170cm</td>
                                    <td className="border">60–70kg</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">XL</td>
                                    <td className="border">98–104</td>
                                    <td className="border">78–84</td>
                                    <td className="border">104–110</td>
                                    <td className="border">165–175cm</td>
                                    <td className="border">70–80kg</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Gợi ý chọn size */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Ruler className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">Tips chọn size phù hợp</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Thích mặc ôm body → chọn size nhỏ hơn 1.</li>
                        <li>Thích mặc rộng rãi / dáng streetwear → chọn size lớn hơn.</li>
                        <li>So sánh với một sản phẩm bạn đã có ở nhà để dễ hình dung hơn.</li>
                    </ul>
                </section>

                {/* Hỗ trợ chọn size */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Smile className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">Không chắc chọn size nào?</h2>
                    </div>
                    <p>
                        Ez Store luôn sẵn sàng hỗ trợ bạn qua:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Zalo / Hotline: <a href="tel:0901234567" className="text-blue-600 underline">0901 234 567</a></li>
                        <li>Inbox Facebook: <a href="https://facebook.com/ezstore" target="_blank" className="text-blue-600 underline">facebook.com/ezstore</a></li>
                        <li>Live chat ngay góc dưới màn hình!</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
