// components/FeaturedProducts.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDocs, productsCollection } from "@/helpers/firebaseConfig";
import { useCart } from "@/app/context/CartContext";
import { FaStar, FaShoppingCart, FaEye, FaRupeeSign } from "react-icons/fa";
import { GiRunningShoe } from "react-icons/gi";

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(productsCollection);
      const fetched = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          images: Array.isArray(data.images) ? data.images : [],
        };
      });
      setProducts(fetched);
    };

    fetchProducts();
  }, []);

  return (
<section id="featured" className="py-24 px-6 text-center text-gray-900">
  <h2 className="text-5xl font-extrabold mb-6 dark:text-white">Our Popular Products</h2>

  <p className="text-gray-600 text-xl mb-16 max-w-4xl mx-auto dark:text-white">
    Experience top-notch quality and style with our sought-after selections. Discover a world of comfort, design, and value
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-14 max-w-7xl mx-auto">
    {products.map((product) => (
      <div key={product.id} className="flex flex-col items-center">
  {/* IMAGE BOX */}
  <div className="bg-[#c5c1e6] w-[320px] h-[280px] rounded-2xl flex items-center justify-center relative overflow-hidden">
    <Image
      src={product.images[0] || "/placeholder.png"}
      alt={product.name}
      width={260}
      height={260}
      className="object-contain drop-shadow-2xl"
    />
  </div>

  {/* RATING */}
  <div className="flex items-center gap-2 text-xl mt-5 text-gray-700">
    <FaStar className="text-red-500 text-2xl" />
    <span className="text-gray-500">(4.5)</span>
  </div>

  {/* NAME */}
  <h3 className="text-2xl font-bold mt-2 flex items-center gap-2 dark:text-white">
    {product.name}
  </h3>

  {/* PRICE */}
  <p className="text-red-500 text-2xl font-bold mt-1 flex items-center gap-1">
    <FaRupeeSign className="text-red-500 text-xl" />
    {product.price}
  </p>

  {/* BUTTONS (Optional) */}
  <div className="mt-4 flex space-x-3 justify-center">
    <Link
      href={`/products/${product.id}`}
      className="bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-blue-700 transition"
    >
      <FaEye /> View
    </Link>
    <button
      onClick={() => addToCart(product)}
      className="bg-green-600 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-green-700 transition"
    >
      <FaShoppingCart /> Add
    </button>
  </div>
</div>

    ))}
  </div>
</section>

  );
}
