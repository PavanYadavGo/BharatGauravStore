"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../helpers/firebaseConfig";
import Image from "next/image";
import { FaTimes, FaShoppingBag, FaRocket } from "react-icons/fa";
import { useCart } from "../app/context/CartContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaRupeeSign } from "react-icons/fa";

export default function ProductDrawer({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
        if (docSnap.data()?.images && docSnap.data().images.length > 0) {
          setMainImage(docSnap.data().images[0]);
        } else {
          setMainImage("/placeholder.png");
        }
      }
      setLoading(false);
    };

    fetchProduct();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, id: productId, quantity });
    toast.success(`${product.name} added to cart`);
    closeDrawer();
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({ ...product, id: productId, quantity });
    router.push("/checkout");
    closeDrawer();
  };

  const closeDrawer = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleSwapImage = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-full md:w-1/2 h-full bg-white z-50 shadow-md transform transition-transform duration-300 ease-in-out overflow-y-auto rounded-l-lg ${
          isClosing ? "animate-slide-out" : "animate-slide-in"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeDrawer}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes className="h-6 w-6" />
        </button>

        <div className="p-6 pt-12 space-y-4 flex flex-col h-full">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : product ? (
            <div className="flex flex-col h-full">
              {/* Main Image Section */}
              <div className="w-full aspect-square relative rounded-md overflow-hidden bg-gray-100 shadow-sm">
                <Image
                  src={mainImage || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Other Details Section */}
              <div className="mt-4 flex flex-col flex-grow space-y-4">
                {/* Thumbnail Images */}
                {Array.isArray(product.images) && product.images.length > 1 && (
                  <div className="flex overflow-x-auto scroll-smooth">
                    {product.images.map((imageUrl: string, index: number) => (
                      <div
                        key={`extra-image-${index}`}
                        className={`w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 mr-2 last:mr-0 shadow-sm cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200 ${
                          mainImage === imageUrl ? "border-2 border-gray-400" : ""
                        }`}
                        onClick={() => handleSwapImage(imageUrl)}
                      >
                        <Image
                          src={imageUrl}
                          alt={`${product.name} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Product Information */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {product.name}
                  </h2>

                  <p className="text-lg font-medium text-gray-700 flex items-center gap-1">
                    <FaRupeeSign className="text-gray-500" size={16} />
                    {product.price}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {product.description || "No description available."}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="quantity"
                    className="text-sm font-medium text-gray-600"
                  >
                    Quantity:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center text-gray-700"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-md flex items-center justify-center gap-2 transition duration-200"
                  >
                    <FaShoppingBag className="h-5 w-5" /> Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md flex items-center justify-center gap-2 transition duration-200"
                  >
                    <FaRocket className="h-5 w-5" /> Buy Now
                  </button>
                </div>

                {/* Product Details (Example - you can customize this) */}
                <div className="mt-4 space-y-2">
                  <h3 className="text-md font-semibold text-gray-700">Product Details</h3>
                  <ul className="list-disc pl-5 text-gray-500 text-sm">
                    <li>High-quality materials</li>
                    <li>Durable and long-lasting</li>
                    <li>Perfect for daily use</li>
                    <li>Available in various sizes</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400">Product not found.</p>
          )}
        </div>
      </div>

      {/* Slide animation */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0%);
          }
        }
        @keyframes slide-out {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .animate-slide-out {
          animation: slide-out 0.3s ease-in forwards;
        }
      `}</style>
    </>,
    document.body
  );
}