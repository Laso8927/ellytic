"use client";
import { useSearchParams } from "next/navigation";
export default function CheckoutPage() {
  const params = useSearchParams();
  const bundle = params.get("bundle");
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="mb-2">Selected bundle: <strong>{bundle}</strong></p>
      <button className="bg-green-600 text-white px-4 py-2">Proceed to Payment</button>
    </main>
  );
} 