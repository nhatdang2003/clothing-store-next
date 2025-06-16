import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ShippingPolicyPage() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center">Chính Sách Vận Chuyển</h1>

            <Card>
                <CardContent className="space-y-4 p-6">
                    <section>
                        <h2 className="text-xl font-semibold">1. Hình thức giao hàng</h2>
                        <ul className="list-disc list-inside mt-2 space-y-2">
                            <li>
                                <strong>Giao hàng tiêu chuẩn:</strong> Áp dụng toàn quốc qua các đối tác như
                                GHN, GHTK, J&T...<br />
                                - Nội thành: 1–2 ngày làm việc<br />
                                - Tỉnh thành khác: 2–5 ngày làm việc
                            </li>
                            <li>
                                <strong>Giao hàng hỏa tốc (Giả lập Grab Express):</strong> Áp dụng nội thành
                                TP.HCM & Hà Nội, giao trong 2 giờ kể từ khi xác nhận đơn (trong khung giờ
                                8:00–18:00). Phí vận chuyển tính theo biểu phí thời điểm.
                            </li>
                        </ul>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold">2. Thời gian xử lý đơn hàng</h2>
                        <ul className="list-disc list-inside mt-2">
                            <li>Đơn xác nhận trước 15h: xử lý trong ngày.</li>
                            <li>Đơn sau 15h: xử lý vào ngày làm việc kế tiếp.</li>
                            <li>Không xử lý đơn vào Chủ Nhật và ngày lễ/Tết.</li>
                        </ul>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold">3. Phí vận chuyển</h2>
                        <ul className="list-disc list-inside mt-2">
                            <li>Miễn phí với đơn hàng từ <strong>[X]₫</strong> trở lên (chỉ áp dụng cho giao hàng tiêu chuẩn).</li>
                            <li>Giao hàng hỏa tốc: phí được hiển thị trước khi thanh toán.</li>
                        </ul>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold">4. Lưu ý khi nhận hàng</h2>
                        <ul className="list-disc list-inside mt-2">
                            <li>Quý khách vui lòng kiểm tra kỹ sản phẩm khi nhận hàng.</li>
                            <li>Nếu không liên hệ được hoặc không có người nhận, đơn sẽ hoàn lại và phí vận chuyển không hoàn.</li>
                        </ul>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold">5. Câu hỏi thường gặp</h2>
                        <div className="space-y-2 mt-2">
                            <div>
                                <strong>Q:</strong> Tôi muốn đổi sang giao hàng hỏa tốc sau khi đã đặt hàng tiêu chuẩn, được không?<br />
                                <strong>A:</strong> Được, nếu đơn hàng chưa được giao cho đơn vị vận chuyển. Vui lòng liên hệ CSKH.
                            </div>
                            <div>
                                <strong>Q:</strong> Giao hàng hỏa tốc có hỗ trợ thanh toán khi nhận không?<br />
                                <strong>A:</strong> Có. Quý khách nên chuẩn bị tiền mặt để thuận tiện.
                            </div>
                        </div>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold">6. Liên hệ hỗ trợ</h2>
                        <ul className="list-disc list-inside mt-2">
                            <li>📞 Hotline: [Số điện thoại]</li>
                            <li>💬 Zalo/Live Chat: [Link/Zalo]</li>
                            <li>📧 Email: [Email hỗ trợ]</li>
                        </ul>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
