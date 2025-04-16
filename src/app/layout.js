// app/layout.jsx
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Bharat Gaurav Store",
  description: "Buy the best products online!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-pattern min-h-screen flex flex-col text-gray-900 dark:text-white dark:bg-[#0f172a]">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
