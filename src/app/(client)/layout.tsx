import Navigation from "@/components/navigation/navbar";

export default function LayoutShop({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navigation />
      <div className="pt-[64px]">{children}</div>
    </div>
  );
}
