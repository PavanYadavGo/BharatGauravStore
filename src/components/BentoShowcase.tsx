'use client';

import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { Sparkles } from 'lucide-react';
import HeroSection from '../components/ImageSlider';

export default function BentoShowcase() {
  return (
    <section className="px-4 py-10 md:px-8 lg:px-16 bg-background text-foreground transition-colors duration-300">
      <BentoGrid>
        {/* Hero Slider Item */}
        <BentoGridItem
          className="md:col-span-2 p-0 overflow-hidden rounded-2xl shadow-lg"
          header={<HeroSection />}
        />

        {/* New Arrivals Box */}
        <BentoGridItem
          title="New Arrivals"
          description="Explore our latest hair clips and bands now in stock."
          header={
            <div className="h-28 w-full rounded-xl bg-gradient-to-r from-purple-200 to-purple-100 dark:from-purple-800 dark:to-purple-600 transition-all duration-300" />
          }
          icon={<Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-300" />}
        />
      </BentoGrid>
    </section>
  );
}
