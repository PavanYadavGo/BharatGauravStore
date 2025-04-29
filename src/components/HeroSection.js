'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const images = [
  '/assets/banner1.jpg',
  '/assets/banner2.jpg',
  '/assets/banner3.jpg',
  '/assets/banner4.jpg',
  '/assets/banner5.jpg',
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, width: `${images.length * 100}%` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 h-[500px] relative">
            <Image
              src={image}
              alt={`Slider Image ${index + 1}`}
              fill
              className="object-cover"
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
