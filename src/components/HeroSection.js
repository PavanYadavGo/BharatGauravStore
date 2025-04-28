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
        <section className="relative w-full flex flex-col lg:flex-row justify-between items-center px-6 md:px-16 lg:px-20 pt-16 pb-10 md:pt-24 md:pb-20 overflow-hidden">
            {/* Left Section */}
            <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left mb-12 lg:mb-0 z-10">
                <p className="text-sm md:text-base lg:text-lg text-[#ff6740] font-medium uppercase tracking-wide">
                    Our Summer Collections
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    Step into the New Arrival <br className="hidden lg:block" />
                    <span className="text-[#ff6740]">BHARATGAURAV</span> Style
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-md mx-auto lg:mx-0">
                    Discover the latest <span className="text-[#ff6740]">BHARATGAURAV</span> arrivals, where quality meets comfort and innovation for your everyday adventures.
                </p>
                <Link
                    href="/products"
                    className="inline-block bg-[#ff6740] hover:bg-rose-600 text-white text-lg font-semibold px-8 py-3 rounded-full transition-colors duration-300"
                >
                    Explore Now →
                </Link>

                {/* Stats */}
                <div className="flex justify-center lg:justify-start gap-8 md:gap-16 pt-8 md:pt-10">
                    <div className="text-center lg:text-left">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">1K+</p>
                        <p className="text-gray-600 text-sm md:text-md">Brands</p>
                    </div>
                    <div className="text-center lg:text-left">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">500+</p>
                        <p className="text-gray-600 text-sm md:text-md">Shops</p>
                    </div>
                    <div className="text-center lg:text-left">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">250K+</p>
                        <p className="text-gray-600 text-sm md:text-md">Customers</p>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="relative w-full lg:w-1/2 flex items-center justify-center bg-[#f5f6fa] rounded-bl-[50px] lg:rounded-bl-[120px] pt-10 pb-16 px-6 md:pt-16 md:pb-24 md:px-10">
                {/* Background Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#ffe6de] opacity-40 blur-xl z-0" />

                {/* Main Shoe Image */}
                <div className="relative z-10">
                    <Image
                        src={activeShoe}
                        alt="Main Shoe"
                        width={450}
                        height={450}
                        className="object-contain transition-all duration-300"
                        priority // Added priority for faster loading of the main image
                    />
                </div>

                {/* Thumbnails */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                    {shoes.map((shoe, idx) => (
                        <button
                            key={idx}
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-md bg-white p-2 md:p-3 transition-all duration-200 hover:scale-105 focus:outline-none ${
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