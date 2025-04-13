'use client';

import dynamic from "next/dynamic";

// Import Checkout page without SSR (only render on client)
const ClientCheckout = dynamic(() => import("./CheckoutClient"), {
  ssr: false,
});

export default function Page() {
  return <ClientCheckout />;
}
