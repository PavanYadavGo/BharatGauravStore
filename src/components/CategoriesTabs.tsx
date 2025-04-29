'use client';
import { useState } from 'react';

const categories = ['All', 'Hair Clips'];

export default function CategoriesTabs({ onSelectCategory }: { onSelectCategory: (cat: string) => void }) {
  const [active, setActive] = useState('All');

  const handleClick = (cat: string) => {
    setActive(cat);
    onSelectCategory(cat);
  };

  return (
    <div className="flex gap-4 justify-center mt-6 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
            active === cat
              ? 'bg-[#ff6740] text-white border-[#ff6740]'
              : 'bg-white text-gray-700 border-gray-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
