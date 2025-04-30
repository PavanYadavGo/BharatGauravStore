'use client';
import { useState } from 'react';
import HeroSection from '../components/ImageSlider';
import FeaturedProducts from '../components/FeaturedProducts';
import SuperShoesSection from '../components/SuperShoesSection';
import CategoriesTabs from '../components/CategoriesTabs';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <>
      <HeroSection />
      <CategoriesTabs onSelectCategory={setSelectedCategory} />
      <FeaturedProducts selectedCategory={selectedCategory} />
      <SuperShoesSection />
    </>
  );
}
