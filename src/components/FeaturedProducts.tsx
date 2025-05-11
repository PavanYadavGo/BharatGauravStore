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

// Badge utility
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
          rating: data.rating || 4.5,
          isHot: data.isHot || false,
          isNew: data.isNew || false,
          onSale: data.onSale || false,
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
<section id="featured" className="py-24 px-6 bg-white dark:bg-[#0f172a]">
  <div className="text-center mb-16">
    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
      Our Popular Products
    </h2>
    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
      Discover quality and design with our best-selling items. Crafted for comfort, made for style.
    </p>
  </div>

  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto">
    {filteredProducts.map((product) => {
      const badge = getBadge(product);

      return (
        <div
          key={product.id}
          className="bg-white dark:bg-[#121212] shadow-md rounded-2xl overflow-hidden transition-all hover:shadow-xl"
        >
          <div className="relative bg-[#f4f4f4] dark:bg-[#1e1e2f] h-[220px] flex items-center justify-center group">
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              width={180}
              height={180}
              className="object-contain h-full transition-transform duration-300 group-hover:scale-105"
            />

            {badge && (
              <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full ${badge.color}`}>
                {badge.text}
              </span>
            )}

            <button
              onClick={() => setDrawerProductId(product.id)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md">
                <FaEye size={14} /> View
              </span>
            </button>
          </div>

          <div className="p-4 flex flex-col h-[180px]">
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
              {product.name}
            </h3>

            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <FaStar className="text-yellow-400" size={14} />
              <span>{product.rating}</span>
            </div>

            <p className="text-md font-semibold text-rose-600 mb-3 flex items-center gap-1">
              <FaRupeeSign size={14} /> {product.price}
            </p>

            <button
  onClick={() => handleAddToCart(product)}
  className={`mt-auto w-full py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition duration-300 border ${
    animating[product.id]
      ? "bg-black text-white border-black scale-105"
      : "bg-white text-black border-gray-800 hover:bg-black hover:text-white"
  }`}
>
  {animating[product.id] ? (
    <>
      <FaCheckCircle size={14} /> Added
    </>
  ) : (
    <>
      <FaShoppingCart size={14} /> Add to Cart
    </>
  )}
            </button>
          </div>
        </div>
      );
    })}
  </div>

  {drawerProductId && (
    <ProductDrawer productId={drawerProductId} onClose={() => setDrawerProductId(null)} />
  )}
</section>

  );
}