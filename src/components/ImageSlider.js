'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/assets/01.jpg',
  '/assets/02.jpg',
  '/assets/03.jpg',
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative relative w-full h-[300px] overflow-hidden mt-[64px]">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={img}
            alt={`Slide ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;
