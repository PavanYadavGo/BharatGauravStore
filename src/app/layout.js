// app/layout.jsx
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "./context/CartContext";

export const metadata = {
  title: "Bharat Gaurav Store",
  description: "Buy the best products online!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-pattern min-h-screen flex flex-col text-gray-900 dark:text-white dark:bg-[#0f172a]">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
