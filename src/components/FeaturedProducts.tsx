"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDocs, productsCollection } from "../helpers/firebaseConfig";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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

  const handleBuyNow = (product: any) => {
    addToCart({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart`);
    router.push('/checkout');
  };

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
    <section id="featured" className="py-24 px-6 bg-background text-foreground transition-colors duration-300">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Our Popular Products</h2>
        <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
          Discover quality and design with our best-selling items. Crafted for comfort, made for style.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
        {filteredProducts.map((product) => {
          const badge = getBadge(product);
          return (
            <div
              key={product.id}
              className="bg-card text-card-foreground shadow-md rounded-2xl overflow-hidden transition-all hover:shadow-xl flex flex-col"
            >
              <div className="relative bg-muted dark:bg-muted h-[220px] flex items-center justify-center group">
                <Image
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.name}
                  width={180}
                  height={180}
                  loading="lazy"
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

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-base font-medium mb-1 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <FaStar className="text-yellow-400" size={14} />
                      <span>{product.rating}</span>
                    </div>

                    <p className="text-md font-semibold text-rose-600 flex items-center gap-1">
                      <FaRupeeSign size={14} /> {product.price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`flex-1 px-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition duration-300 border ${
                      animating[product.id]
                        ? "bg-black text-white border-black scale-105"
                        : "bg-white text-black dark:bg-transparent dark:text-white dark:border-white border-gray-800 hover:bg-black hover:text-white"
                    }`}
                  >
                    {animating[product.id] ? (
                      <>
                        <FaCheckCircle size={16} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <FaShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleBuyNow(product)}
                    className="flex-1 px-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 bg-orange-600 text-white hover:bg-orange-700 transition"
                  >
                    <FaRupeeSign size={16} />
                    <span>Buy Now</span>
                  </button>
                </div>
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
