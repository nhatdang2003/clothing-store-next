import Navigation from "@/components/navigation/navbar";
import { accountApi } from "@/services/account.api";
import { Footer } from "@/components/footer/footer";

export default async function LayoutShop({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div>
            <Navigation />
            <div className="pt-[64px]">{children}</div>
            <Footer />
        </div>
    );
}
