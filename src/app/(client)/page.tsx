import { Suspense } from "react";
import HomeContent from "./Home";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
