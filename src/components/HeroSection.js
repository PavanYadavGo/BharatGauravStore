// components/HeroSection.jsx
import Link from "next/link";
// components/HeroSection.jsx
export default function HeroSection() {
  return (
    <section className="py-28 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
        Elevate Your <span className="text-blue-600 dark:text-blue-400">Shopping</span> Experience
      </h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
        Discover high-quality products with unbeatable prices and seamless checkout.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-md transition"
        >
          Shop Now
        </Link>
        <Link
          href="#featured"
          className="bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 py-2 px-6 rounded-md shadow transition"
        >
          Explore More
        </Link>
      </div>
    </section>
  );
}

