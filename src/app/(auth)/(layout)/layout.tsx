import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

export default function LayoutAuth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen bg-[#f5f3ef]">
      {/* Background image for both mobile and desktop */}
      <div className="absolute inset-0">
        <Image
          src="/bg.png"
          alt="Fashion model in grey coat"
          fill
          priority
          quality={100}
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      {/* Left side with welcome text (hidden on mobile) */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Easy Store</h1>
          </div>
          <div>
            <h2 className="mb-2 text-5xl font-bold text-white">Xin chào!</h2>
            <p className="mb-4 text-2xl text-white">
              Chào mừng bạn đến trang web của chúng tôi.
            </p>
            <p className="mb-8 text-lg text-white">
              Đây là nơi bạn có thể mua sắm những món đồ thời trang phù hợp cho
              bản thân
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-white" />
              <Instagram className="h-6 w-6 text-white" />
              <Twitter className="h-6 w-6 text-white" />
              <Linkedin className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="relative flex w-full items-center justify-center lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
