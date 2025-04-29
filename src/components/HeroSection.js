'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const images = [
  '/assets/banner1.jpg',
  '/assets/banner2.jpg',
  '/assets/banner3.jpg',
  '/assets/banner4.jpg',
  '/assets/banner5.jpg',
  // Add paths to all your banner images here
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds (adjust as needed)

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  return (
    <div className="relative w-full h-auto overflow-hidden">
      <div
        className="relative transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="inline-block w-full h-auto"
          >
            <Image
              src={image}
              alt={`Slider Image ${index + 1}`}
              width={1920} // Or your desired fixed width
              height={500} // Or your desired fixed height (adjust based on your banner's aspect ratio)
              className="object-cover w-full h-full"
              priority={index < 2} // Prioritize the first few images
            />
          </div>
        ))}
      </div>
      {/* Optional: Add navigation dots or arrows here */}
    </div>
  );
};

export default ImageSlider;