'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

type ProductDetailProps = {
  productId: string;
  onClose: () => void;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
};

export default function ProductDetail({ productId, onClose }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<Product, 'id'>;
        setProduct({ id: docSnap.id, ...data });
        setSelectedImage(data.images?.[0] || null);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  if (!product) return null;

  const handleBuyNow = () => {
    if (product) {
      addToCart({ ...product, quantity: 1 });
      router.push('/checkout');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute top-0 right-0 h-full w-full md:w-4/5 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto rounded-l-xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-10 p-6">
          <div className="md:w-1/2 flex flex-col items-center">
            <motion.div
              className="relative w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Selected product"
                  layout="fill"
                  objectFit="contain"
                />
              )}
            </motion.div>

            <div className="flex gap-3 overflow-x-auto mt-4">
              {product.images.map((img, i) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedImage === img
                      ? 'ring-2 ring-gray-900 dark:ring-white'
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">{product.description}</p>

            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹ {product.price.toFixed(2)}
            </div>

            {/* Buttons side by side */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <motion.div className="w-full sm:w-1/2" whileTap={{ scale: 0.97 }}>
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-xl py-3 text-lg"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </motion.div>

              <motion.div className="w-full sm:w-1/2" whileTap={{ scale: 0.97 }}>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-lg"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
