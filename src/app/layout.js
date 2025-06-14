// app/layout.jsx
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ChatWidget from "../components/ChatWidget";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Bharat Gaurav Store",
  description: "Buy the best products online!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-pattern min-h-screen flex flex-col text-gray-900 dark:text-white dark:bg-[#0f172a]">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.getItem('theme') === 'dark') {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="top-center"
              toastOptions={{
                className: 'bg-green-500 text-white',
                duration: 2000,
              }}
            />
          </CartProvider>
          <ChatWidget/>
        </AuthProvider>
      </body>
    </html>
  );
}
