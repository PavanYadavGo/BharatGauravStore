'use client';

import { motion } from 'framer-motion';
import { FaStore, FaLeaf, FaFlag, FaBullseye, FaHandsHelping, FaUsers } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-20 bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-center transition-colors duration-300">
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About Us
      </motion.h1>

      {/* Intro Paragraph */}
      <motion.p
        className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Welcome to <strong>Bharat Gaurav Store</strong> &ndash; your trusted destination for quality, value, and a truly Indian shopping experience.
        We are dedicated to bringing you curated products with a focus on sustainability and tradition.
      </motion.p>

      {/* Values Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto text-left mb-16">
        {[{
          icon: <FaStore className="text-blue-600 dark:text-blue-400 text-3xl mb-4" />,
          title: 'Curated Selection',
          desc: 'We offer handpicked, quality-assured products that reflect Indian heritage and modern excellence.'
        }, {
          icon: <FaLeaf className="text-green-600 dark:text-green-400 text-3xl mb-4" />,
          title: 'Sustainability Focus',
          desc: 'From eco-friendly packaging to responsible sourcing, sustainability is at our core.'
        }, {
          icon: <FaFlag className="text-red-600 dark:text-red-400 text-3xl mb-4" />,
          title: 'Proudly Indian',
          desc: 'We celebrate Indian culture, craftsmanship, and values by supporting local artisans and entrepreneurs.'
        }].map((item, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-blue-200 dark:hover:shadow-blue-800 transition"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
          >
            {item.icon}
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{item.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Mission & Vision */}
      <motion.div
        className="max-w-4xl mx-auto text-left mb-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaBullseye className="text-yellow-500" /> Our Mission
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          At Bharat Gaurav Store, our mission is to empower every Indian household with access to authentic, high-quality, and culturally rich products.
          We strive to promote indigenous talent, encourage sustainable living, and build a community that celebrates Indian roots with pride.
        </p>

        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaUsers className="text-pink-500" /> Our Vision
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We envision a future where every customer experiences the essence of Bharat through our offerings. Our vision is to be a global ambassador for Indian tradition, craftsmanship, and innovation &mdash; making &quot;Made in India&quot; a mark of trust and excellence.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 py-10 px-6 rounded-2xl max-w-3xl mx-auto mt-16 shadow-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4">Join the Bharat Gaurav Movement</h3>
        <p className="mb-6">
          Support Indian artisans, shop responsibly, and experience the joy of cultural authenticity. Together, let&apos;s make a difference.
        </p>
        <a
          href="#"
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-full transition"
        >
          Explore Now
        </a>
      </motion.div>
    </div>
  );
}
