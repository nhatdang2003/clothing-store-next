import Navigation from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { Metadata } from "next";
import ChatbotEmbed from "@/components/chatbot/ChatbotEmbed";

export const metadata: Metadata = {
    title: "Ez Store",
    description: "Ez Store cửa hàng thời trang uy tín",
}

export default function LayoutShop({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navigation />
            <div className="pt-[64px]">{children}</div>
            <Footer />
            <ChatbotEmbed />
        </div>
    );
}
