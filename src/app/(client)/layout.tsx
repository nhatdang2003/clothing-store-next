import Navigation from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";

export default function LayoutShop({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navigation />
            <div className="pt-[64px]">{children}</div>
            <Footer />
        </div>
    );
}
