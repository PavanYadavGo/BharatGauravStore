'use client';

import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const router = useRouter();
  const { addToCart } = useCart();

  const fetchProduct = async (id: string) => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Product, 'id'>;
      setProduct({ id: docSnap.id, ...data });
      setSelectedImage(data.images?.[0] || null);
    }
  };

  const fetchRelatedProducts = async (excludeId: string) => {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('__name__', '!=', excludeId));
    const querySnapshot = await getDocs(q);
    const allProducts: Product[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Product, 'id'>;
      allProducts.push({ id: doc.id, ...data });
    });

    // Shuffle and take 4
    const shuffled = allProducts.sort(() => 0.5 - Math.random());
    setRelatedProducts(shuffled.slice(0, 4));
  };

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      fetchRelatedProducts(productId);
    }
  }, [productId]);

  if (!product) return null;

  const handleBuyNow = () => {
    addToCart({ ...product, quantity: 1 });
    router.push('/checkout');
    onClose();
  };

  const handleProductClick = (newId: string) => {
    // Replace product in same drawer
    fetchProduct(newId);
    fetchRelatedProducts(newId);
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
        className="absolute top-0 right-0 h-full w-full md:w-1/2 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto rounded-l-xl"
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">{product.description}</p>

            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹ {product.price.toFixed(2)}
            </div>

            <div className="flex flex-row gap-3 pt-6">
              <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-xl py-3 text-lg"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </motion.div>

              <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
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

        {/* Related Products */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">You may also like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedProducts.map((prod) => (
              <motion.div
                key={prod.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer border rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md"
                onClick={() => handleProductClick(prod.id)}
              >
                <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={prod.images[0]}
                    alt={prod.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="p-2 text-sm text-center">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{prod.name}</p>
                  <p className="text-gray-600 dark:text-gray-400">₹{prod.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
  