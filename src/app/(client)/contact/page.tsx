import ScalableStoreLogo from "@/components/ui/logo-store";

export default function ContactPage() {
    return (
        <div>
            {/* Hero Section */}
            <div className="relative h-[300px] w-full">
                <img
                    src="/bg.png"
                    alt="Liên hệ EzStore"
                    className="object-cover w-full h-full"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-white text-4xl font-bold">LIÊN HỆ</h1>
                    <div className="w-[200px] ml-4 bg-white rounded-sm p-2">
                        <ScalableStoreLogo />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
                {/* Thông tin liên hệ */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Thông tin cửa hàng</h2>
                    <p>
                        <strong>Email:</strong>{' '}
                        <a href="mailto:contact@ezstore.com" className="hover:underline">
                            contact@ezstore.com
                        </a>
                    </p>
                    <p>
                        <strong>Điện thoại:</strong>{' '}
                        <a href="tel:0123456789" className="hover:underline">
                            0123 456 789
                        </a>
                    </p>
                    <p>
                        <strong>Địa chỉ:</strong> 1 Võ Văn Ngân, Quận Thủ Đức, TP. Hồ Chí Minh
                    </p>
                    <p>
                        <strong>Giờ làm việc:</strong> Thứ 2 - Chủ nhật: 8:00 - 22:00
                    </p>
                </div>

                {/* Google Map */}
                <div className="w-full h-[300px] rounded overflow-hidden shadow-md">
                    <iframe
                        src="https://www.google.com/maps?q=1%20V%C3%B5%20V%C4%83n%20Ng%C3%A2n,%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c,%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
