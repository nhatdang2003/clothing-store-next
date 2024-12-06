import { WorkspaceLayout } from "@/components/workspace/workspace-layout";
import { accountApi } from "@/services/account.api";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let info;
  try {
    info = await accountApi.getInfo();
  } catch (error) {
    return <div>Đã có lỗi xảy ra!</div>;
  }

  return <WorkspaceLayout info={info}>{children}</WorkspaceLayout>;
}
