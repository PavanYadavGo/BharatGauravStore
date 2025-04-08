// components/FeaturedProducts.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDocs, productsCollection } from "@/helpers/firebaseConfig";
import { useCart } from "@/app/context/CartContext";
import { FaShoppingCart, FaEye } from "react-icons/fa";

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
    <section id="featured" className="py-20 px-6 text-center text-gray-900">
      <h2 className="text-3xl font-bold mb-10">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              width={300}
              height={300}
              className="rounded-md w-full h-64 object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold dark:text-white">{product.name}</h3>
            <p className="text-blue-600 font-bold">₹{product.price}</p>
            <div className="mt-4 flex space-x-2 justify-center">
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
