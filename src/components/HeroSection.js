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
    <section className="w-full flex flex-col lg:flex-row justify-between items-center px-8 md:px-20 pt-20 pb-16">
      {/* Left */}
      <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
        <p className="text-base md:text-lg text-[#ff6740] font-medium">Our Summer collections</p>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          The New Arrival <br />
          <span className="text-[#ff6740]">BHARATGAURAV</span> Clips
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
          Discover stylish<span className="text-[#ff6740]"> BHARATGAURAV</span> arrivals, quality comfort, and innovation for your active life.
        </p>

        <Link
          href="/products"
          className="inline-block bg-[#ff6740] hover:bg-rose-600 text-white text-lg font-semibold px-8 py-4 rounded-full transition"
        >
          Shop now →
        </Link>

        {/* Stats */}
        <div className="flex justify-center lg:justify-start gap-14 pt-8">
          <div>
            <p className="text-2xl md:text-3xl font-bold">1k+</p>
            <p className="text-gray-500 text-md">Brands</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">500+</p>
            <p className="text-gray-500 text-md">Shops</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">250k+</p>
            <p className="text-gray-500 text-md">Customers</p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center bg-[#f5f6fa] rounded-bl-[100px] mt-14 lg:mt-0 pt-12 pb-16 px-6">
        {/* Main Shoe Image */}
        <Image
          src={activeShoe}
          alt="Main Shoe"
          width={480}
          height={480}
          className="z-10 object-contain"
        />

        {/* Thumbnails */}
        <div className="mt-8 flex gap-6">
          {shoes.map((shoe, idx) => (
            <button
              key={idx}
              className={`w-20 h-20 rounded-xl shadow-md bg-white p-3 transition-all ${
                activeShoe === shoe ? 'ring-2 ring-rose-400' : ''
              }`}
              onClick={() => setActiveShoe(shoe)}
            >
              <Image
                src={shoe}
                alt={`Shoe ${idx + 1}`}
                width={64}
                height={64}
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
