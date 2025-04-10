import React from 'react';

const images = [
  { src: '/assets/big-shoe1.jpg', span: 'col-span-2 row-span-2' },
  { src: '/assets/big-shoe2.jpg', span: '' },
  { src: '/assets/big-shoe3.jpg', span: '' },
  { src: '/assets/big-shoe1.jpg', span: 'col-span-2' },
  { src: '/assets/big-shoe2.jpg', span: '' },
  { src: '/assets/big-shoe3.jpg', span: '' },
];

const BentoGridSection = () => {
  return (
    <section className="px-6 py-16 md:px-20 bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl shadow-lg ${img.span} group`}
          >
            <img
              src={img.src}
              alt={`Shoe ${index + 1}`}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105 p-2"
            />
            <div className="absolute inset-0 bg-gray/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BentoGridSection;
