"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/helpers/firebaseConfig";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const productRef = doc(db, "products", id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = { id: productSnap.id, ...productSnap.data() };
        setProduct(productData);

        const allImages = productData.images || [];
        if (allImages.length > 0) {
          setSelectedImage(allImages[0]);
        } else {
          setSelectedImage(productData.imageUrl || "/assets/default-product.jpg");
        }
      } else {
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (product?.id) {
      router.push(`/checkout?productId=${product.id}`);
    }
  };

  if (!product) {
    return (
      <p className="text-center text-red-500 font-semibold text-lg mt-10">
        ❌ Product not found.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <section className="flex flex-col lg:flex-row items-center justify-center bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg mx-auto max-w-6xl transition-colors duration-300">
        {/* 🔹 Left Section: Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-[400px] h-[400px] bg-white dark:bg-gray-700 border rounded-lg shadow-md overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 flex-wrap mt-4 justify-center">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`border-2 p-1 rounded-lg transition ${
                    selectedImage === img ? "border-blue-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className="rounded-md object-cover w-[80px] h-[80px]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Right Section: Product Details */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:pl-10 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{product.description}</p>

          <p className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mt-4">
            ₹{product.price}
          </p>

          {/* ✅ Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="mt-6 bg-green-600 text-white py-3 px-8 rounded-lg flex items-center gap-3 text-lg font-semibold hover:bg-green-700 transition duration-300 mx-auto lg:mx-0"
          >
            <FaShoppingCart className="text-xl" /> Add to Cart
          </button>

          {/* ✅ Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="mt-4 bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 mx-auto lg:mx-0 block"
          >
            ⚡ Buy Now
          </button>
        </div>
      </section>
    </div>
  );
}
