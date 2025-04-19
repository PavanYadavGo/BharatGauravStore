'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const shoes = [
  '/assets/big-shoe1.jpg',
  '/assets/big-shoe2.jpg',
  '/assets/big-shoe3.jpg',
];

const Hero = () => {
  const [activeShoe, setActiveShoe] = useState(shoes[0]);

  return (
    <section className="w-full flex flex-col lg:flex-row justify-between items-center px-6 md:px-16 lg:px-20 pt-16 pb-10 md:pt-20 md:pb-16">
      {/* Left */}
      <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left mb-10 lg:mb-0">
        <p className="text-sm md:text-base lg:text-lg text-[#ff6740] font-medium uppercase">
          Our Summer collections
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          The New Arrival <br className="hidden lg:block" />
          <span className="text-[#ff6740]">BHARATGAURAV</span> Clips
        </h1>

        <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
          Discover stylish<span className="text-[#ff6740]"> BHARATGAURAV</span> arrivals, quality comfort, and
          innovation for your active life.
        </p>

        <Link
          href="/products"
          className="inline-block bg-[#ff6740] hover:bg-rose-600 text-white text-lg font-semibold px-6 py-3 rounded-full transition"
        >
          Shop now →
        </Link>

        {/* Stats */}
        <div className="flex justify-center lg:justify-start gap-8 md:gap-14 pt-6 md:pt-8">
          <div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold">1k+</p>
            <p className="text-gray-500 text-sm md:text-md">Brands</p>
          </div>
          <div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold">500+</p>
            <p className="text-gray-500 text-sm md:text-md">Shops</p>
          </div>
          <div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold">250k+</p>
            <p className="text-gray-500 text-sm md:text-md">Customers</p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center bg-[#f5f6fa] rounded-bl-[50px] lg:rounded-bl-[100px] pt-8 pb-12 px-4 md:pt-12 md:pb-16 md:px-6">
        {/* Main Shoe Image */}
        <Image
          src={activeShoe}
          alt="Main Shoe"
          width={380}
          height={380}
          className="z-10 object-contain"
        />

        {/* Thumbnails */}
        <div className="mt-6 flex gap-4">
          {shoes.map((shoe, idx) => (
            <button
              key={idx}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-md bg-white p-2 md:p-3 transition-all ${
                activeShoe === shoe ? 'ring-2 ring-rose-400' : ''
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