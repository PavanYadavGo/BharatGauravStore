'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const images = [
  '/assets/01.jpg',
  '/assets/02.jpg',
  '/assets/03.jpg',
  '/assets/04.jpg',
  '/assets/05.jpg',
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
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, width: `${images.length * 100}%` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 aspect-[16/6] relative">
            <Image
              src={image}
              alt={`Slider Image ${index + 1}`}
              fill
              className="object-contain" // Or object-cover depending on how you want it cropped
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
