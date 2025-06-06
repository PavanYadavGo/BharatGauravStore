"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { getDocs, productsCollection } from "../../helpers/firebaseConfig";
import Image from "next/image";
import Link from "next/link";
import ProductDrawer from "../../components/ProductDrawer";
import { FaShoppingCart, FaEye } from "react-icons/fa";

export default function Products() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [animating, setAnimating] = useState({});
  const [drawerProductId, setDrawerProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(productsCollection);
      const fetchedProducts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          images: Array.isArray(data.images) ? data.images : [],
        };
      });
      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);

    setAnimating((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAnimating((prev) => ({ ...prev, [product.id]: false }));
    }, 300);
  };

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg transition-colors duration-300"
            >
              <Image
                src={product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-md w-full h-64 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {product.name}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold">₹{product.price}</p>

              <div className="mt-4 flex space-x-2 justify-center">
                <button
                  onClick={() => setDrawerProductId(product.id)}
                  className="bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <FaEye /> View
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`bg-green-600 text-white py-2 px-4 rounded flex items-center gap-2 transition transform duration-300 ${
                    animating[product.id] ? "scale-110" : ""
                  }`}
                >
                  <FaShoppingCart /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {drawerProductId && (
        <ProductDrawer productId={drawerProductId} onClose={() => setDrawerProductId(null)} />
      )}
    </section>
  );
}
