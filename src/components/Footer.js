'use client';

import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-6 py-8 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left Side */}
        <div className="text-center md:text-left text-sm">
          &copy; {year} <span className="font-semibold text-[#ff6740]">BHARATGAURAV</span>. All rights reserved.
        </div>

        {/* Separator for small screens */}
        <Separator className="block md:hidden" />

        {/* Right Side Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-3 text-sm">
          <a href="https://bharatgauravshop.com/privacy-policy" className="hover:underline hover:text-[#ff6740] transition-colors">
            Privacy Policy
          </a>
          <a href="https://bharatgauravshop.com/terms-and-conditions" className="hover:underline hover:text-[#ff6740] transition-colors">
            Terms of Service
          </a>
          <a href="https://bharatgauravshop.com/ShippingPolicy" className="hover:underline hover:text-[#ff6740] transition-colors">
            Shipping Policy
          </a>
          <a href="https://bharatgauravshop.com/ReturnPolicy" className="hover:underline hover:text-[#ff6740] transition-colors">
            Return Policy
          </a>
          <a href="https://bharatgauravshop.com/RefundPolicy" className="hover:underline hover:text-[#ff6740] transition-colors">
            Refund Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
