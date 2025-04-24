'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../helpers/firebaseConfig';
import { useCart } from '../../context/CartContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FaShoppingCart } from 'react-icons/fa';
import { MdOutlineShoppingBag } from 'react-icons/md';

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
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Product;
          setProduct(data);
          const imgs = Array.isArray(data.images) ? data.images : [];
          setSelectedImage(imgs[0] || data.imageUrl || '/default.jpg');
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity }); // ✅ Pass quantity here
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  if (loading) return <div className="text-center py-12">Loading product...</div>;

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-red-500 font-semibold">Product not found</h2>
        <button
          className="mt-4 underline text-blue-500"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-[#DCECF9] to-[#A3B8E2] flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-md p-6 grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {/* Image Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex mt-4 gap-2">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 relative rounded-md border cursor-pointer overflow-hidden ${
                    selectedImage === img ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`thumb-${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>
            <p className="text-xl text-[#ff6740] font-bold mt-2">₹{product.price}</p>
            <p className="text-gray-700 mt-4">{product.description}</p>
          </div>

          {/* Quantity + Buttons */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
                min={1}
                className="w-20 px-2 py-1 border rounded-md text-center"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 bg-[#ff6740] hover:bg-[#e65d37] text-white py-2 px-4 rounded-md transition"
              >
                <MdOutlineShoppingBag /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
