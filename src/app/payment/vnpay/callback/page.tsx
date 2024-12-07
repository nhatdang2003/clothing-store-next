import { Suspense } from "react";
import VNPayResult from "./vnpayResult";

export default function VNPayCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VNPayResult />
    </Suspense>
  );
}
