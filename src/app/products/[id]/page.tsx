"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../helpers/firebaseConfig";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: string[];
};

export default function ProductDetails() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [animating, setAnimating] = useState(false);
  const [purchaseAnimating, setPurchaseAnimating] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as Product;
        setProduct(data);

        const imgs = Array.isArray(data.images) ? data.images : [];
        setSelectedImage(imgs[0] || data.imageUrl || "/assets/default-product.jpg");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    toast.success(`${product.name} added to cart`);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 800);
  };

  const handleBuyNow = () => {
    if (!product) return;
    setPurchaseAnimating(true);
    setTimeout(() => {
      setPurchaseAnimating(false);
      router.push(`/checkout?productId=${product.id}`);
    }, 400);
  };

  if (!product) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 text-xl font-medium">❌ Product not found.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-[#ff6740] underline hover:text-[#e65d37]"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-[#fff5f0] to-[#ffe0d6] flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT SIDE: IMAGES */}
        <div className="flex flex-col items-center">
          {/* Main Image */}
          <div className="relative w-full aspect-square max-w-md border-2 border-[#ff6740] rounded-xl overflow-hidden shadow-md mb-6">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 flex-wrap justify-center">
            {product.images?.map((img, i) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                  selectedImage === img
                    ? "border-[#FF6740] scale-105"
                    : "border-gray-300 hover:scale-105"
                }`}
              >
                <Image
                  src={img}
                  alt={`thumb ${i}`}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: DETAILS */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Price */}
            <p className="text-3xl font-bold text-[#FF6740] mb-4">₹{product.price}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <label className="font-medium">Quantity:</label>
              <input
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-center"
              />
            </div>
          </div>

          {/* BUTTONS - SIDE BY SIDE */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-md ${
                animating
                  ? "bg-[#e75d37] scale-105"
                  : "bg-[#FF6740] hover:bg-[#e75d37]"
              }`}
            >
              {animating ? (
                <>
                  <FaCheckCircle /> Added to Cart
                </>
              ) : (
                <>
                  <FaShoppingCart /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-md ${
                purchaseAnimating
                  ? "bg-[#d94f2d] scale-105"
                  : "bg-[#FF6740] hover:bg-[#d94f2d]"
              }`}
            >
              {purchaseAnimating ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
