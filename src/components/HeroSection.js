'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const shoes = [
  '/assets/big-shoe1.jpg',
  '/assets/big-shoe2.jpg',
  '/assets/big-shoe3.jpg',
];

const Hero = () => {
  const [activeShoe, setActiveShoe] = useState(shoes[0]);

  return (
    <section className="relative w-full flex flex-col lg:flex-row justify-between items-center px-6 md:px-16 lg:px-24 pt-20 pb-16 bg-gradient-to-br from-[#fff8f4] via-[#fef2ef] to-[#fff] overflow-hidden">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left mb-12 lg:mb-0 z-10">
        <p className="text-sm md:text-base lg:text-lg text-[#ff6740] font-semibold uppercase tracking-wider">
          Our Summer Collections
        </p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900">
          Step into the New <br className="hidden lg:block" />
          <span className="text-[#ff6740]">BHARATGAURAV</span> Style
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
          Discover the newest <span className="text-[#ff6740] font-medium">BHARATGAURAV</span> collection — where elegance meets everyday comfort.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#ff6740] hover:bg-[#e65432] text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
        >
          Explore Now <ArrowRight size={20} />
        </Link>

        {/* Stats */}
        <div className="flex justify-center lg:justify-start gap-8 md:gap-16 pt-8 md:pt-10">
          {[
            { label: 'Brands', value: '1K+' },
            { label: 'Shops', value: '500+' },
            { label: 'Customers', value: '250K+' },
          ].map((stat, i) => (
            <div key={i} className="text-center lg:text-left">
              <p className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center bg-[#fdf8f6] rounded-bl-[60px] lg:rounded-bl-[120px] pt-10 pb-16 px-6 md:pt-16 md:pb-24 md:px-10 shadow-inner">
        {/* Background Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#ffe6de] opacity-30 blur-3xl z-0" />

        {/* Main Shoe Image */}
        <div className="relative z-10">
          <Image
            src={activeShoe}
            alt="Main Shoe"
            width={450}
            height={450}
            className="object-contain drop-shadow-xl transform rotate-[-5deg] hover:rotate-0 transition-all duration-500"
            priority
          />
        </div>

        {/* Thumbnails */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          {shoes.map((shoe, idx) => (
            <button
              key={idx}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-md bg-white p-2 md:p-3 transition-all duration-200 hover:scale-105 focus:outline-none ${
                activeShoe === shoe ? 'ring-2 ring-[#ff6740]' : ''
              }`}
              onClick={() => setActiveShoe(shoe)}
            >
              <Image
                src={shoe}
                alt={`Shoe ${idx + 1}`}
                width={48}
                height={48}
                className="object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;