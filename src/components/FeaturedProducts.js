"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDocs, productsCollection } from "../helpers/firebaseConfig";
import { useCart } from "../app/context/CartContext";
import { FaStar, FaShoppingCart, FaEye, FaRupeeSign } from "react-icons/fa";

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
    <section id="featured" className="py-24 px-6 text-center bg-white text-gray-900 dark:text-white dark:bg-[#0f172a]">
      <h2 className="text-5xl font-extrabold mb-6">Our Popular Products</h2>

      <p className="text-black text-xl mb-16 max-w-4xl mx-auto dark:text-white">
        Experience top-notch quality and style with our sought-after selections. Discover a world of comfort, design, and value
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col bg-white dark:bg-[#121212] shadow-lg rounded-2xl overflow-hidden w-full max-w-[320px] mx-auto hover:shadow-2xl transition">
            
            {/* Image Container */}
            <div className="bg-[#e9e7fa] dark:bg-[#1e1e2f] w-full h-[250px] flex items-center justify-center p-4">
              <Image
                src={product.images[0] || "/placeholder.png"}
                alt={product.name}
                width={220}
                height={220}
                className="object-contain w-full h-full"
              />
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col justify-between h-full">
              {/* Rating */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <FaStar className="text-red-500" />
                <span>(4.5)</span>
              </div>

              {/* Name */}
              <h3 className="text-base font-semibold text-left text-gray-900 dark:text-white mb-2 leading-snug line-clamp-2">
                {product.name}
              </h3>

              {/* Price */}
              <p className="text-lg font-bold text-red-500 mb-4 flex items-center gap-1">
                <FaRupeeSign className="text-red-500" />
                {product.price}
              </p>

              {/* Buttons */}
              <div className="flex space-x-2">
                <Link
                  href={`/products/${product.id}`}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md flex justify-center items-center gap-2 hover:bg-blue-700 transition"
                >
                  <FaEye /> View
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md flex justify-center items-center gap-2 hover:bg-green-700 transition"
                >
                  <FaShoppingCart /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
