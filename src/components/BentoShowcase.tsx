"use client";

import { BentoGrid, BentoGridItem } from "../components/ui/BentoGrid";
import { Sparkles } from "lucide-react";
import HeroSection from "../components/ImageSlider"; // or wherever your slider is

export default function BentoShowcase() {
  return (
    <section className="px-4 py-10 md:px-8 lg:px-16">
      <BentoGrid>
        <BentoGridItem
          className="md:col-span-2 p-0 overflow-hidden" // removes padding for image slider
          header={<HeroSection />} // use your image slider here
        />
        <BentoGridItem
          title="New Arrivals"
          description="Explore our latest hair clips and bands now in stock."
          header={
            <div className="h-28 w-full rounded-xl bg-gradient-to-r from-purple-200 to-purple-100" />
          }
          icon={<Sparkles className="h-6 w-6 text-purple-600" />}
        />
      </BentoGrid>
    </section>
  );
}
