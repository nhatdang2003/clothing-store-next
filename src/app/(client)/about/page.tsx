import ScalableStoreLogo from '@/components/ui/logo-store'
import {
    Award,
    Truck,
    RefreshCcw,
    Smile,
    Users,
    ShieldCheck,
    Repeat,
    Headphones,
    Gift
} from 'lucide-react'

export default function AboutPageContent() {
    return (
        <>
            {/* Banner with overlay */}
            <div className="relative h-[400px]">
                <img
                    src="/bg.png"
                    alt="Về Ez Store"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <h1 className="text-white text-4xl md:text-5xl font-bold text-center px-4 flex items-center gap-4">
                        VỀ
                        <div className="w-[200px] inline-block bg-white rounded-sm p-2"><ScalableStoreLogo /></div>
                    </h1>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-6 py-12 space-y-20">
                {/* Giới thiệu */}
                <section>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Giới thiệu về Ez Store</h2>
                    <p className="leading-relaxed text-lg text-gray-700">
                        <strong>Ez Store</strong> là nền tảng mua sắm trực tuyến dành cho thế hệ trẻ yêu thích sự năng động, tiện lợi và khác biệt. Chúng tôi không chỉ đơn thuần cung cấp sản phẩm – chúng tôi tạo ra trải nghiệm mua sắm truyền cảm hứng, nơi mỗi món đồ đều là một cách để bạn thể hiện cá tính riêng.
                    </p>
                    <p className="mt-4 italic text-gray-600">
                        "Từ chiếc áo basic đến phụ kiện độc đáo – tất cả đều được chọn lọc kỹ lưỡng để đồng hành cùng phong cách sống hiện đại của bạn."
                    </p>
                </section>

                {/* Câu chuyện */}
                <section>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Hành trình khởi đầu</h2>
                    <p className="leading-relaxed text-gray-700">
                        Năm 2024, giữa làn sóng thương mại điện tử, Ez Store được thành lập bởi một nhóm bạn trẻ đam mê thời trang và công nghệ. Từ những đơn hàng đầu tiên được đóng gói tại căn phòng trọ, giờ đây chúng tôi phục vụ hàng ngàn khách hàng trên khắp Việt Nam.
                    </p>
                    <p className="mt-4 text-gray-700">
                        Mỗi đơn hàng là một câu chuyện, và mỗi khách hàng là một người bạn đồng hành.
                    </p>
                </section>

                {/* Giá trị cốt lõi */}
                <section>
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Giá trị cốt lõi của chúng tôi</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-gray-700 text-lg">
                        <div className="flex items-start gap-4">
                            <Award className="text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Chất lượng là trên hết</h3>
                                <p>Chúng tôi chọn sản phẩm kỹ lưỡng, đặt giá trị người dùng lên hàng đầu.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Truck className="text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Giao hàng nhanh chóng</h3>
                                <p>Toàn quốc từ 1–3 ngày, kiểm tra hàng trước khi thanh toán.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <RefreshCcw className="text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Đổi mới không ngừng</h3>
                                <p>Cập nhật sản phẩm theo xu hướng thời trang Gen Z hàng tuần.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Smile className="text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Khách hàng là trung tâm</h3>
                                <p>92% khách quay lại mua lần 2 vì dịch vụ tận tâm và thân thiện.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Đội ngũ */}
                <section>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Đằng sau thương hiệu</h2>
                    <div className="flex items-start gap-4">
                        <Users className="text-primary mt-1" />
                        <div className="text-lg text-gray-700 leading-relaxed">
                            Không phải robot hay công ty khổng lồ – đằng sau Ez Store là đội ngũ trẻ trung, nhiệt huyết, và sáng tạo. Từ người gói hàng đến người tư vấn, chúng tôi đều đặt tâm huyết vào từng sản phẩm, từng tin nhắn.
                        </div>
                    </div>
                    <p className="mt-4 text-gray-600 italic">
                        "Ez Store là một gia đình – và khách hàng là một phần trong đó."
                    </p>
                </section>

                {/* Cam kết */}
                <section>
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Cam kết từ chúng tôi</h2>
                    <div className="space-y-6 text-lg text-gray-700">
                        <div className="flex items-start gap-4">
                            <ShieldCheck className="text-primary mt-1" />
                            <p><strong>Chính hãng 100%:</strong> Mô tả đúng, hình ảnh thật, nguồn gốc rõ ràng.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <Repeat className="text-primary mt-1" />
                            <p><strong>Đổi trả dễ dàng:</strong> 7 ngày linh hoạt, miễn là sản phẩm còn nguyên.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <Headphones className="text-primary mt-1" />
                            <p><strong>Hỗ trợ 24/7:</strong> Tư vấn nhiệt tình qua Zalo, Facebook, Email.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <Gift className="text-primary mt-1" />
                            <p><strong>Ưu đãi đặc biệt:</strong> Giảm giá định kỳ, quà tặng sinh nhật, tích điểm đổi quà.</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
