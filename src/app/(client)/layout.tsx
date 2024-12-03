import Navigation from "@/components/navigation/navbar";
import { accountApi } from "@/services/account.api";

export default async function LayoutShop({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userInfo;
  try {
    const response = await accountApi.getInfo();
    userInfo = response;
  } catch (error) {
    return <div>Đã có lỗi xảy ra</div>;
  }

  return (
    <div>
      <Navigation userInfo={userInfo} />
      <div className="pt-[64px]">{children}</div>
    </div>
  );
}
