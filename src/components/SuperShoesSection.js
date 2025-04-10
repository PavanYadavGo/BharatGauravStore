import React from 'react';
import { FaShippingFast, FaLock, FaHeadset } from 'react-icons/fa';

const SuperShoesSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900 px-6 py-16 md:px-20 transition-colors duration-300">
      {/* Top Content: Text + Image */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Text */}
        <div className="max-w-xl space-y-5">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            We Provide You Super <br /> Quality Shoes
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Ensuring premium comfort and style, our meticulously crafted footwear is designed
            to elevate your experience, providing you with unmatched quality, innovation, and
            a touch of elegance.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Our dedication to detail and excellence ensures your satisfaction.
          </p>
          <button className="mt-4 bg-[#ff6740] hover:bg-[#f6542a] text-white py-2 px-6 rounded-full transition">
            View details
          </button>
        </div>

        {/* Right Image */}
        <div>
          <img
            src="assets/big-shoe2.jpg"
            alt="Shoes"
            className="rounded-3xl w-[350px] md:w-[450px]"
          />
        </div>
      </div>

      {/* Bottom Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {/* Feature Card 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 transition-colors">
          <FaShippingFast className="text-3xl text-[#ff6740]" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Free shipping</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Enjoy seamless shopping with our complimentary shipping service.
          </p>
        </div>

        {/* Feature Card 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 transition-colors">
          <FaLock className="text-3xl text-[#ff6740]" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Secure Payment</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Experience worry-free transactions with our secure payment options.
          </p>
        </div>

        {/* Feature Card 3 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 transition-colors">
          <FaHeadset className="text-3xl text-[#ff6740]" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Love to help you</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Our dedicated team is here to assist you every step of the way.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SuperShoesSection;
