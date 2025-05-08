"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDocs, productsCollection } from "../helpers/firebaseConfig";
import { useCart } from "../app/context/CartContext";
import ProductDrawer from "../components/ProductDrawer";
import {
  FaStar,
  FaShoppingCart,
  FaEye,
  FaRupeeSign,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

// Dummy function to simulate product badges (replace with your actual logic)
const getBadge = (product: any) => {
  if (product.isHot) return { text: "Hot", color: "bg-red-500" };
  if (product.isNew) return { text: "New", color: "bg-green-500" };
  if (product.onSale) return { text: "Sale", color: "bg-orange-500" };
  return null;
};

export default function FeaturedProducts({ selectedCategory = "All" }: { selectedCategory?: string }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [animating, setAnimating] = useState<{ [key: string]: boolean }>({});
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(productsCollection);
      const fetched = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          category: data.category || "Other",
          images: Array.isArray(data.images) ? data.images : [],
          rating: data.rating || 4.5, // Example rating
          isHot: data.isHot || false,   // Example hot status
          isNew: data.isNew || false,   // Example new status
          onSale: data.onSale || false, // Example sale status
        };
      });
      setProducts(fetched);
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);

    setAnimating((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAnimating((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <section id="featured" className="py-24 px-6 text-center bg-white text-gray-900 dark:text-white dark:bg-[#0f172a]">
      <h2 className="text-5xl font-extrabold mb-6">Our Popular Products</h2>
      <p className="text-black text-xl mb-16 max-w-4xl mx-auto dark:text-white">
        Experience top-notch quality and style with our sought-after selections. Discover a world of comfort, design, and value
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto"> {/* Changed grid-cols-4 to grid-cols-5 to fit the image layout */}
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col bg-white dark:bg-[#121212] shadow-md rounded-lg overflow-hidden w-full max-w-[280px] mx-auto hover:shadow-xl transition"
          >
            <div className="relative bg-[#e9e7fa] dark:bg-[#1e1e2f] w-full h-[200px] flex items-center justify-center p-4">
              <Image
                src={product.images[0] || "/placeholder.png"}
                alt={product.name}
                width={160}
                height={160}
                className="object-contain w-full h-full"
              />
              {/* Badge */}
              {getBadge(product) && (
                <span className={`absolute top-2 left-2 text-xs font-semibold text-white ${getBadge(product)?.color} px-2 py-1 rounded-full`}>
                  {getBadge(product)?.text}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col justify-between h-full">
              <h3 className="text-sm font-semibold text-left text-gray-900 dark:text-white mb-1 leading-snug line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
                <FaStar className="text-yellow-500" size={12} />
                <span>({product.rating})</span>
              </div>
              <p className="text-sm font-bold text-red-500 mb-3 flex items-center gap-1">
                <FaRupeeSign className="text-red-500" size={12} />
                {product.price}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className={`w-full py-2 px-3 rounded-md flex justify-center items-center gap-2 transition duration-300 ${
                  animating[product.id]
                    ? "bg-emerald-600 scale-105"
                    : "bg-green-600 hover:bg-green-700"
                } text-white text-sm`}
              >
                {animating[product.id] ? (
                  <>
                    <FaCheckCircle className="text-white" size={14} /> Add
                  </>
                ) : (
                  <>
                    <FaShoppingCart size={14} /> Add
                  </>
                )}
              </button>
              {/* Removed the View button to match the image */}
            </div>
          </div>
        ))}
      </div>

      {drawerProductId && (
        <ProductDrawer productId={drawerProductId} onClose={() => setDrawerProductId(null)} />
      )}
    </section>
  );
}