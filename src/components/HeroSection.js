'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

const images = [
  '/assets/big-shoe1.jpg',
  '/assets/big-shoe2.jpg',
  '/assets/big-shoe3.jpg',
];

const Hero = () => {
  const [activeImg, setActiveImg] = useState(images[0]);

  return (
    <section className="relative flex flex-col lg:flex-row justify-between items-center px-6 md:px-16 lg:px-24 pt-20 pb-16 bg-white overflow-hidden">
      {/* Product Info */}
      <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
        <p className="inline-block bg-[#ff6740] text-white px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
          🔥 45% OFF - Limited Time
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Multicolor Hair Clips Beads – 100 pcs Pack
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto lg:mx-0">
          Elevate your style with this vibrant collection of durable and cute hair clips – perfect for kids and teens!
        </p>

        {/* Price & Ratings */}
        <div className="flex items-center gap-6 justify-center lg:justify-start">
          <div className="text-2xl font-bold text-gray-800">₹199</div>
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" stroke="none" />
            ))}
            <span className="text-gray-500 text-sm ml-1">(1.2k Reviews)</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#ff6740] hover:bg-[#e65432] text-white rounded-full font-semibold transition">
            <ShoppingCart size={20} /> Buy Now
          </button>
          <button className="px-6 py-3 border border-[#ff6740] text-[#ff6740] hover:bg-[#fff2eb] rounded-full font-medium transition">
            View Details
          </button>
        </div>
      </div>

      {/* Product Image + Thumbnails */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center bg-[#fdf8f6] rounded-bl-[60px] lg:rounded-bl-[120px] pt-10 pb-16 px-6 shadow-inner">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[400px] md:h-[400px] rounded-full bg-[#ffe6de] opacity-30 blur-3xl z-0" />

        <div className="relative z-10">
          <Image
            src={activeImg}
            alt="Hero Product"
            width={450}
            height={450}
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`w-16 h-16 bg-white p-2 rounded-xl shadow-md transition hover:scale-105 ${
                activeImg === img ? 'ring-2 ring-[#ff6740]' : ''
              }`}
              onClick={() => setActiveImg(img)}
            >
              <Image src={img} alt={`Option ${idx}`} width={48} height={48} className="object-contain" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
