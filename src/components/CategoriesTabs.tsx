'use client';
import { useState } from 'react';

const categories = [
  'All', 'Hair Clips', 'Jaw Clip', 'Mini clips', 'Banana Clips', 
  'Combs French', 'Headbands', 'Ponytail', 'Hair Pins Clip', 'Hair Band'
];

export default function CategoriesTabs({
  onSelectCategory,
}: {
  onSelectCategory: (cat: string) => void;
}) {
  const [active, setActive] = useState('All');

  const handleClick = (cat: string) => {
    setActive(cat);
    onSelectCategory(cat);
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="flex space-x-4 px-4 sm:justify-center w-max sm:w-auto snap-x">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              active === cat
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                : 'text-gray-600 hover:text-blue-600'
            } focus:outline-none snap-start`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
